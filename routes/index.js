const express = require('express');
const router = express.Router();
const captchaController = require('../controller/captchaController');

// Rute untuk membuat captcha
router.get('/captcha', captchaController.createCaptcha);

// Rute untuk memverifikasi captcha
router.post('/verify-captcha', captchaController.verifyCaptcha);

module.exports = router;
