const express = require('express');
const router = express.Router();
const OAuthApi = require('../wechat/OAuth');
const User = require('../model/users');
const path = require('path');
const fs = require('fs');

router.get('/wechat_login', (req, res, next) => {
  const { code, state } = req.body;
  if (!code) {
    res.redirect('http://courseclouds.zhmoll.com/user-center/index.html');
  }
  OAuthApi.getAccessToken(code, function (err, result) {
    if (err) return next(err);
    const accessToken = result.data.access_token;
    const openid = result.data.openid;
    User.innerFindByOpenid(openid, (err, user) => {
      if (err) return next(err);
      if (!user) res.redirect('http://courseclouds.zhmoll.com/user-center/registry.html');
      req.session.userid = user.id;
      req.session.authority = user.authority;
      if (req.session.url) {
        res.redirect(req.session.url);
        delete req.session.url;
      }
      else {
        res.redirect('http://courseclouds.zhmoll.com/user-center/index.html');
      }
    });
  });
});

router.get('/registry.html', express.static('../public/user-center'));
router.get('/login.html', express.static('../public/user-center'));

// 登录
router.use((req, res, next) => {
  if (!req.session.userid) {
    const url = OAuthApi.getAuthorizeURL(path.join('http://courseclouds.zhmoll.com/', req.originalUrl), 'wechat_login', 'snsapi_base');
    return res.redirect(url);
  }
  next();
});

router.use(express.static('../public/user-center'));
module.exports = router;