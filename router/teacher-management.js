const express = require('express');
const router = express.Router();
const OAuthApi = require('../wechat/OAuth');

router.use(express.static('../public'));

module.exports = router;