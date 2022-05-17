const fs = require('fs');
const path = require('path');

const express = require('express');
const sliderCaptcha = require('@slider-captcha/core');

const router = express.Router(); // Instantiate a new router

router.get('/create', async (req, res) => {
  const sessionKey = `sess:${req.session.id}`;
  console.log({ create: sessionKey });
  req.session.save();

  let imgBuff = await fs.readFileSync(
    path.join(__dirname, '../../public/logo192.png'),
  );
  const str = imgBuff.toString('base64');
  imgBuff = Buffer.from(str, 'base64');

  sliderCaptcha.create({ image: imgBuff }).then(({ data, solution }) => {
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
