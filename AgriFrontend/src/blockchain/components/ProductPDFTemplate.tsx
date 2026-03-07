import { forwardRef } from 'react';
import { ShieldCheck } from 'lucide-react';

interface ProductPDFTemplateProps {
    data: any;
    vendorDetails?: {
        firstname: string;
        lastname: string;
    };
    imagePreviewUrl?: string;
}

const ProductPDFTemplate = forwardRef<HTMLDivElement, ProductPDFTemplateProps>(({ data, vendorDetails, imagePreviewUrl }, ref) => {
    // Current date for the report
    const generationDate = new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });

    return (
        <div style={{ position: 'absolute', top: '-9999px', left: '-9999px' }}>
            <div
                ref={ref}
                style={{
                    width: '794px', // A4 width at 96 DPI
                    minHeight: '1123px', // A4 height at 96 DPI
                    padding: '40px 50px',
                    backgroundColor: '#ffffff',
                    fontFamily: '"Inter", "Poppins", sans-serif',
                    color: '#1f2937',
                    boxSizing: 'border-box',
                    border: '1px solid #f3f4f6'
                }}
            >
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '2px solid #10b981', paddingBottom: '20px', marginBottom: '30px' }}>
                    <div>
                        <h1 style={{ fontSize: '28px', fontWeight: '900', color: '#064e3b', margin: '0 0 5px 0', textTransform: 'uppercase', letterSpacing: '1px' }}>
                            Traceability Report
                        </h1>
                        <p style={{ fontSize: '14px', color: '#6b7280', margin: 0, fontWeight: '500' }}>
                            Blockchain Verification Document &bull; Generated on {generationDate}
                        </p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', backgroundColor: '#ecfdf5', padding: '8px 16px', borderRadius: '4px', color: '#047857', fontWeight: 'bold', fontSize: '12px', border: '1px solid #a7f3d0' }}>
                            <ShieldCheck style={{ width: '16px', height: '16px', marginRight: '6px' }} /> Verified Origin
                        </div>
                    </div>
                </div>

                {/* Main Content Info */}
                <div style={{ display: 'flex', gap: '30px', marginBottom: '40px' }}>
                    <div style={{ flex: '1' }}>
                        <h2 style={{ fontSize: '32px', fontWeight: '900', margin: '0 0 10px 0', textTransform: 'uppercase', color: '#111827', lineHeight: '1.2' }}>
                            {data.name || 'N/A'}
                        </h2>

                        <div style={{ display: 'flex', gap: '15px', marginBottom: '20px' }}>
                            <span style={{ fontSize: '12px', backgroundColor: '#f3f4f6', padding: '6px 12px', borderRadius: '4px', fontWeight: '600' }}>
                                Batch: {data.harvest_batchId || 'N/A'}
                            </span>
                            <span style={{ fontSize: '12px', backgroundColor: '#f3f4f6', padding: '6px 12px', borderRadius: '4px', fontWeight: '600' }}>
                                Category: {data.category || 'N/A'}
                            </span>
                        </div>

                        <p style={{ fontSize: '14px', lineHeight: '1.6', color: '#4b5563', marginBottom: '25px', whiteSpace: 'pre-wrap' }}>
                            {data.description || 'No description provided.'}
                        </p>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                            <div style={{ borderLeft: '3px solid #10b981', paddingLeft: '15px' }}>
                                <p style={{ fontSize: '10px', textTransform: 'uppercase', color: '#9ca3af', fontWeight: '800', margin: '0 0 5px 0', letterSpacing: '1px' }}>Producer</p>
                                <p style={{ fontSize: '16px', fontWeight: '700', margin: 0 }}>
                                    {vendorDetails?.firstname && vendorDetails?.lastname ? `${vendorDetails.firstname} ${vendorDetails.lastname}` : 'Verified Farm'}
                                </p>
                            </div>
                            <div style={{ borderLeft: '3px solid #10b981', paddingLeft: '15px' }}>
                                <p style={{ fontSize: '10px', textTransform: 'uppercase', color: '#9ca3af', fontWeight: '800', margin: '0 0 5px 0', letterSpacing: '1px' }}>Net Quantity</p>
                                <p style={{ fontSize: '16px', fontWeight: '700', margin: 0 }}>
                                    {data.weightValue || '0'} {data.weightUnit || 'kg'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {imagePreviewUrl && (
                        <div style={{ width: '250px', height: '250px', flexShrink: 0, borderRadius: '12px', overflow: 'hidden', border: '1px solid #e5e7eb', backgroundColor: '#f9fafb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <img src={imagePreviewUrl} alt="Product Form" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                    )}
                </div>

                {/* Details Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px', marginBottom: '30px' }}>
                    {/* Origin & Cultivation */}
                    <div style={{ backgroundColor: '#f9fafb', padding: '20px', borderRadius: '8px', border: '1px solid #f3f4f6' }}>
                        <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#374151', textTransform: 'uppercase', margin: '0 0 15px 0', display: 'flex', alignItems: 'center' }}>
                            Origin & Cultivation
                        </h3>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                            <tbody>
                                <tr>
                                    <td style={{ padding: '6px 0', color: '#6b7280', fontWeight: '600', width: '40%' }}>Location:</td>
                                    <td style={{ padding: '6px 0', fontWeight: '700', textAlign: 'right' }}>{data.farmDetails_village || 'N/A'}, {data.farmDetails_district || 'N/A'}</td>
                                </tr>
                                <tr>
                                    <td style={{ padding: '6px 0', color: '#6b7280', fontWeight: '600' }}>Sowing Date:</td>
                                    <td style={{ padding: '6px 0', fontWeight: '700', textAlign: 'right' }}>{data.cultivation_sowingDate ? new Date(data.cultivation_sowingDate).toLocaleDateString() : 'N/A'}</td>
                                </tr>
                                <tr>
                                    <td style={{ padding: '6px 0', color: '#6b7280', fontWeight: '600' }}>Fertilizer:</td>
                                    <td style={{ padding: '6px 0', fontWeight: '700', textAlign: 'right' }}>{data.cultivation_fertilizer || 'N/A'}</td>
                                </tr>
                                <tr>
                                    <td style={{ padding: '6px 0', color: '#6b7280', fontWeight: '600' }}>Organic Certified:</td>
                                    <td style={{ padding: '6px 0', fontWeight: '700', textAlign: 'right' }}>{data.farmDetails_isOrganic ? 'Yes' : 'No'}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    {/* Harvest & Quality */}
                    <div style={{ backgroundColor: '#f9fafb', padding: '20px', borderRadius: '8px', border: '1px solid #f3f4f6' }}>
                        <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#374151', textTransform: 'uppercase', margin: '0 0 15px 0', display: 'flex', alignItems: 'center' }}>
                            Harvest & Quality
                        </h3>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                            <tbody>
                                <tr>
                                    <td style={{ padding: '6px 0', color: '#6b7280', fontWeight: '600', width: '40%' }}>Harvest Date:</td>
                                    <td style={{ padding: '6px 0', fontWeight: '700', textAlign: 'right' }}>{data.harvest_harvestDate ? new Date(data.harvest_harvestDate).toLocaleDateString() : 'N/A'}</td>
                                </tr>
                                <tr>
                                    <td style={{ padding: '6px 0', color: '#6b7280', fontWeight: '600' }}>Processing Date:</td>
                                    <td style={{ padding: '6px 0', fontWeight: '700', textAlign: 'right' }}>{data.processing_processDate ? new Date(data.processing_processDate).toLocaleDateString() : 'N/A'}</td>
                                </tr>
                                <tr>
                                    <td style={{ padding: '6px 0', color: '#6b7280', fontWeight: '600' }}>Residue Check:</td>
                                    <td style={{ padding: '6px 0', fontWeight: '700', textAlign: 'right' }}>{data.qualityTest_residuePpm ? `${data.qualityTest_residuePpm} ppm` : 'N/A'}</td>
                                </tr>
                                <tr>
                                    <td style={{ padding: '6px 0', color: '#6b7280', fontWeight: '600' }}>Quality Status:</td>
                                    <td style={{ padding: '6px 0', fontWeight: '700', textAlign: 'right', color: data.qualityTest_status === 'Passed' ? '#059669' : 'inherit' }}>{data.qualityTest_status || 'N/A'}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Footer Signature Box */}
                <div style={{ marginTop: '50px', borderTop: '1px solid #e5e7eb', paddingTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                    <div style={{ fontSize: '10px', color: '#9ca3af', lineHeight: '1.4' }}>
                        <p style={{ margin: '0 0 4px 0' }}>This report is digitally generated for agricultural traceability.</p>
                        <p style={{ margin: 0 }}>Document ID: VERIFY-DOC-{(Math.random() * 1000000).toFixed(0).padStart(6, '0')}</p>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ width: '150px', borderBottom: '1px solid #d1d5db', marginBottom: '8px', height: '30px' }}></div>
                        <p style={{ fontSize: '12px', fontWeight: '700', margin: 0, color: '#4b5563' }}>Authorized Signature</p>
                    </div>
                </div>

            </div>
        </div>
    );
});

ProductPDFTemplate.displayName = 'ProductPDFTemplate';

export default ProductPDFTemplate;
