// routes/serviceCardRoutes.js
const express = require('express');
const router = express.Router();
const multer = require("multer");
const upload = multer();


const serviceCardController = require('../controllers/serviceCardController');

router.post('/service-cards',upload.single('img'),  serviceCardController.createServiceCard);
router.get('/servicecard/:id', serviceCardController.getCardById);
router.put('/service-cards/:id',upload.single('img'), serviceCardController.updateServiceCard);

router.get('/service-cards/:id', serviceCardController.getServiceCard);

router.get('/service-cards', serviceCardController.getAllServiceCards);
router.delete('/delete/:id', serviceCardController.deleteServiceCard);


module.exports = router;
