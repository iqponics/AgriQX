const axios = require('axios');
const { cloudinary } = require('../config/cloudinary');
const Product = require('../models/Product');

const PROOFEASY_BASE_URL = 'https://staging.proofeasy.io';
const PROOFEASY_API_KEY = process.env.PROOFEASY_API_KEY;
const PROOFEASY_SECRET_KEY = process.env.PROOFEASY_SECRET_KEY;

/**
 * Step 1 – Login to ProofEasy and get a Bearer token
 */
const getProofEasyToken = async () => {
    console.log('[Blockchain] 🔐 Authenticating with ProofEasy using API Keys...');
    const response = await axios.post(`${PROOFEASY_BASE_URL}/api/v1/auth`, {
        api_key: PROOFEASY_API_KEY,
        api_secret: PROOFEASY_SECRET_KEY
    });
    const token = response.data?.data?.token || response.data?.token;
    if (!token) {
        console.error('[Blockchain] ❌ ProofEasy login response:', JSON.stringify(response.data, null, 2));
        throw new Error('Failed to get ProofEasy auth token');
    }
    console.log('[Blockchain] ✅ ProofEasy token obtained:', token.substring(0, 20) + '...');
    return token;
};

/**
 * Step 2 – Upload a base64-encoded PDF buffer to Cloudinary and return the public URL
 */
const uploadPdfToCloudinary = async (base64Pdf, filename) => {
    console.log('[Blockchain] ☁️  Uploading PDF to Cloudinary...');
    // Strip possible data URI prefix
    const dataUri = base64Pdf.startsWith('data:')
        ? base64Pdf
        : `data:application/pdf;base64,${base64Pdf}`;

    const uploadResult = await cloudinary.uploader.upload(dataUri, {
        resource_type: 'raw',
        type: 'authenticated',
        folder: 'blockchain-certificates',
        public_id: filename,
        format: 'pdf'
    });

    // Cloudinary restricts public delivery of PDF files by default for new accounts.
    // To bypass this without requiring the user to change account security settings,
    // we generate a signed download URL that expires in 24 hours.
    const expiresAt = Math.floor(Date.now() / 1000) + 86400; // 24 hours
    const signedUrl = cloudinary.utils.private_download_url(
        uploadResult.public_id,
        'pdf',
        {
            resource_type: 'raw',
            type: 'authenticated',
            expires_at: expiresAt
        }
    );

    console.log('[Blockchain] ✅ PDF uploaded to Cloudinary, signed URL generated.');
    return signedUrl;
};

/**
 * Step 3 – Submit the Cloudinary PDF URL to ProofEasy blockchain API
 */
const submitToProofEasy = async (token, externalId, fileUrl, productName, verificationDetail) => {
    console.log('[Blockchain] 🔗 Submitting to ProofEasy API...');
    console.log('[Blockchain] Payload:', {
        type: 'document',
        external_id: externalId,
        file_url: fileUrl,
        name: productName,
        verification_detail: verificationDetail
    });

    const response = await axios.post(
        `${PROOFEASY_BASE_URL}/api/v1/certificate/upload`,
        {
            type: 'document',
            documents: [
                {
                    external_id: externalId,
                    file_url: fileUrl,
                    name: productName,
                    description: `Agricultural Traceability Report – ${productName}`,
                    verification_detail: verificationDetail
                }
            ]
        },
        {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        }
    );

    console.log('[Blockchain] 📦 ProofEasy raw response:', JSON.stringify(response.data, null, 2));
    return response.data;
};

/**
 * Main controller — called by POST /api/blockchain/submit
 * Expects: { productId, pdfBase64, productName, harvestDate, expiryDate, farmerName }
 */
const submitToBlockchain = async (req, res) => {
    try {
        const { productId, pdfBase64, productName, harvestDate, expiryDate, farmerName } = req.body;

        console.log('[Blockchain] 🚀 New blockchain submission request');
        console.log('[Blockchain] productId:', productId);
        console.log('[Blockchain] productName:', productName);
        console.log('[Blockchain] pdfBase64 length:', pdfBase64?.length);

        // --- Validate inputs ---
        if (!productId || !pdfBase64 || !productName) {
            console.error('[Blockchain] ❌ Missing required fields');
            return res.status(400).json({ message: 'productId, pdfBase64, and productName are required' });
        }

        // --- Find product in DB ---
        const product = await Product.findById(productId);
        if (!product) {
            console.error('[Blockchain] ❌ Product not found:', productId);
            return res.status(404).json({ message: 'Product not found' });
        }

        // If already verified, just return the existing URL
        if (product.blockchainVerificationUrl) {
            console.log('[Blockchain] ℹ️  Product already blockchain-verified:', product.blockchainVerificationUrl);
            return res.status(200).json({
                verificationUrl: product.blockchainVerificationUrl,
                message: 'Already verified'
            });
        }

        // --- Upload PDF to Cloudinary ---
        const safeFilename = `product-${productId}-${Date.now()}`;
        const fileUrl = await uploadPdfToCloudinary(pdfBase64, safeFilename);

        // --- Authenticate with ProofEasy ---
        const token = await getProofEasyToken();

        // --- Build verification detail ---
        const externalId = `AGRIQX-${productId}`;
        const verificationDetail = {
            farmer_name: farmerName || 'AgriQX Farmer',
            product_name: productName
        };
        if (harvestDate) verificationDetail.harvest_date = harvestDate;
        if (expiryDate) verificationDetail.expiry_date = expiryDate;

        // --- Submit to ProofEasy ---
        const proofeasyResponse = await submitToProofEasy(token, externalId, fileUrl, productName, verificationDetail);

        // --- Parse results ---
        const results = proofeasyResponse?.results || [];
        console.log('[Blockchain] 📋 Parsed results array:', JSON.stringify(results, null, 2));

        const successResult = results.find(r => !r.error);
        const failedResult = results.find(r => r.error);

        if (failedResult) {
            console.warn('[Blockchain] ⚠️  ProofEasy reported an error for:', failedResult.data?.external_id, '|', failedResult.message);
        }

        if (!successResult) {
            console.error('[Blockchain] ❌ No successful result from ProofEasy. Full response:', JSON.stringify(proofeasyResponse, null, 2));
            return res.status(502).json({ message: failedResult?.message || 'ProofEasy submission failed' });
        }

        const verificationUrl = successResult.data?.verification_url;
        console.log('[Blockchain] 🎉 Verification URL received:', verificationUrl);

        // --- Persist to DB ---
        product.blockchainVerificationUrl = verificationUrl;
        product.blockchainExternalId = externalId;
        await product.save();
        console.log('[Blockchain] 💾 Saved verification URL to product in DB');

        return res.status(200).json({
            verificationUrl,
            message: 'Blockchain verification successful!'
        });

    } catch (err) {
        console.error('[Blockchain] 🔥 Unexpected error in submitToBlockchain:');
        if (err.response) {
            console.error('[Blockchain] HTTP status:', err.response.status);
            console.error('[Blockchain] Response data:', JSON.stringify(err.response.data, null, 2));
            console.error('[Blockchain] Request config URL:', err.response.config?.url);
        } else {
            console.error('[Blockchain] Error message:', err.message);
            console.error('[Blockchain] Stack:', err.stack);
        }
        return res.status(500).json({ message: err.message || 'Internal server error during blockchain submission' });
    }
};

module.exports = { submitToBlockchain };
