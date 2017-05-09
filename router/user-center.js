const express = require('express');
const router = express.Router();
const OAuthApi = require('../wechat/OAuth');
const User = require('../model/users');
const path = require('path');
const fs = require('fs');

function checkLogin(req, res, next) {
  if (!req.session.userid) {
    req.session.url = path.join('http://courseclouds.zhmoll.com/', req.originalUrl);
    const url = OAuthApi.getAuthorizeURL('http://courseclouds.zhmoll.com/user-center/wechat_login', 'wechat_login', 'snsapi_base');
    res.redirect(url);
    return;
  }
  next();
}

router.get('/wechat_login', (req, res, next) => {
  const { code, state } = req.query;
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
        if (user.authority == 1)
          return res.redirect('http://courseclouds.zhmoll.com/user-center/index.html');
        else if (user.authority == 10)
          return res.redirect('http://courseclouds.zhmoll.com/teacher-management/index.html');
      }
    });
  });
});

router.get('/profile.html', checkLogin);
router.get('/course.html', checkLogin);
router.get('/courseform.html', checkLogin);
router.get('/index.html', checkLogin);
router.get('/inform.html', checkLogin);
router.get('/iscroll.html', checkLogin);
router.get('/landing.html', checkLogin);
router.get('/leave.html', checkLogin);
router.get('/receivemessage.html', checkLogin);
router.get('/sendmessage.html', checkLogin);

router.use(express.static(path.join(__dirname, '../public/user-center')));
module.exports = router;