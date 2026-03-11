const express = require('express');
const router = express.Router();
const { submitToBlockchain } = require('../controllers/blockchainController');
const { verifyAccessToken } = require('../middlewares/authmiddleware');

// POST /api/blockchain/submit
// Protected: only authenticated farmers can submit to blockchain
router.post('/submit', verifyAccessToken, submitToBlockchain);

module.exports = router;
