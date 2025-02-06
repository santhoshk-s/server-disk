// server/routes/contactRoutes.js

const express = require('express');
const router = express.Router();
const { sendMessage,getContactMessages ,getEmailCount} = require('../controllers/contactUscontroller');

router.post('/contact', sendMessage);
router.get('/contact', getContactMessages);
router.get('/contact/emails/count', getEmailCount);
module.exports = router;
