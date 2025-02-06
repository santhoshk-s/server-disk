// server/routes/contactRoutes.js

const express = require('express');
const router = express.Router();
const { sendHelpMessage,getHelpMessages ,getEmailCount} = require('../controllers/helpController');

router.post('/help', sendHelpMessage);
router.get('/help', getHelpMessages);
router.get('/help/emails/count', getEmailCount);
module.exports = router;
