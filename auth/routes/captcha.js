const express = require('express');
const sliderCaptcha = require('@slider-captcha/core');

const router = express.Router(); // Instantiate a new router

router.get('/create', (req, res) => {
  req.session.User = {
    website: 'anonystick.com',
    type: 'blog javascript',
    like: '4550',
  };
  req.session.save();
  sliderCaptcha.create().then(({ data, solution }) => {
    req.session.captcha = solution;
    req.session.save();
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Headers', 'Content-Type,Authorization');
    res.set('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.set('Access-Control-Allow-Credentials', 'true');
    res.status(200).send(data);
  });
});

router.post('/verify', (req, res) => {
  sliderCaptcha.verify(req.session.captcha, req.body).then((verification) => {
    if (verification.result === 'success') {
      req.session.token = verification.token;
      req.session.save();
    }
    res.status(200).send(verification);
  });
});

module.exports = router;
