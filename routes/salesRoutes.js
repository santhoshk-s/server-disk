// server/routes/contactRoutes.js

const express = require('express');
const router = express.Router();
const { sendSalesMessage,getSalesMessages,getEmailCount } = require('../controllers/salesController');

router.post('/sales', sendSalesMessage);
router.get('/sales', getSalesMessages);
router.get('/sales/emails/count', getEmailCount);
module.exports = router;
