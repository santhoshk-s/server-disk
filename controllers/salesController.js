// server/controllers/contactController.js

const axios = require('axios');
const Sales = require('../modals/salesmodel'); // Import your MongoDB model

// Replace with your reCAPTCHA secret key
const RECAPTCHA_SECRET_KEY = process.env.RECAPTCHA_SECRET_KEY;

exports.sendSalesMessage = async (req, res) => {
    const { firstname, email, phone, message, captcha,companyname } = req.body;

    try {
        // Verify the CAPTCHA response
        const response = await axios.post('https://www.google.com/recaptcha/api/siteverify', null, {
            params: {
                secret: RECAPTCHA_SECRET_KEY,
                response: captcha,
            },
        });

        if (!response.data.success) {
            return res.status(400).json({ message: 'CAPTCHA verification failed' });
        }

        // Store form data in MongoDB
        const newSales = new Sales({ firstname, email, phone, message,companyname });
        await newSales.save();

        res.status(200).json({ message: 'Sales Message sent successfully' });
    } catch (error) {
        console.error('Error:', error); // Log the error details
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.getSalesMessages = async (req, res) => {
    try {
      const messages = await Sales.find(); // Fetch all contact messages
      res.status(200).json(messages);
    } catch (error) {
      console.error('Error fetching contact messages:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
  exports.getEmailCount = async (req, res) => {
    try {
      // Fetch all contact messages
      const messages = await Sales.find();
  
      // Count the total number of email addresses
      const emailCount = messages.length;
  
      res.status(200).json({ count: emailCount });
    } catch (error) {
      console.error('Error counting emails:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };