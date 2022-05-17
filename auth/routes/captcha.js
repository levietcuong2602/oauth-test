const express = require('express');
const sliderCaptcha = require('@slider-captcha/core');

const router = express.Router(); // Instantiate a new router

router.get('/create', (req, res) => {
  const sessionKey = `sess:${req.session.id}`;
  console.log({ create: sessionKey });
  req.session.save();
  sliderCaptcha.create().then(({ data, solution }) => {
    console.log({
      type: Buffer.isBuffer(data.background),
      hih: Buffer.isBuffer('123'),
    });
    req.session.captcha = solution;
    req.session.save();
    res.status(200).send(data);
  });
});

router.post('/verify', (req, res) => {
  const sessionKey = `sess:${req.session.id}`;
  console.log({ verify: sessionKey });
  sliderCaptcha.verify(req.session.captcha, req.body).then((verification) => {
    if (verification.result === 'success') {
      req.session.token = verification.token;
      req.session.save();
    }
    res.status(200).send(verification);
  });
});

module.exports = router;
