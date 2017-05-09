const express = require('express');
const router = express.Router();
const OAuthApi = require('../wechat/OAuth');
const path = require('path');

router.use(express.static(path.join(__dirname,'../public/teacher-management')));

module.exports = router;