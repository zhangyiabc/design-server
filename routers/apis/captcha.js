const express = require("express");
const router = express.Router();
const svgCaptcha = require('svg-captcha');
const { handleSend } = require("../../utils/resultMessage");

router.get('/', (req, res) => {
  var captcha = svgCaptcha.create({
    size: 6,
    ignoreChars: "o0Oli1I",
    noise: 4,
    color: true
  });

  res.cookie('captcha',captcha.text)

  handleSend({
    data: captcha.data,
    code: 200,
    msg: "success"
  }, res)
})

module.exports = router