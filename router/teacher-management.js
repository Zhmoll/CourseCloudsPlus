const express = require('express');
const router = express.Router();
const OAuthApi = require('../wechat/OAuth');
const path = require('path');

function is_weixn(req) {
  let ua = req.headers['user-agent'].toLowerCase();
  console.log(req.headers["user-agent"]);
  return ua.match(/MicroMessenger/i) == "micromessenger";
  //如果是微信浏览器返回true 否则返回false
}

function checkLogin(req, res, next) {
  if (!req.session.userid) {
    req.session.url = path.join('http://courseclouds.zhmoll.com/', req.originalUrl);
    let url;
    if (is_weixn(req))
      url = OAuthApi.getAuthorizeURL('http://courseclouds.zhmoll.com/user-center/wechat_login', 'wechat_login', 'snsapi_base');
    else
      url = 'http://courseclouds.zhmoll.com/teacher-management/login.html';
    res.redirect(url);
    return;
  }
  next();
}

router.get('/addcourse.html', checkLogin);
router.get('/addcoursedetail.html', checkLogin);
router.get('/calendar.html', checkLogin);
router.get('/chart.html', checkLogin);
router.get('/form.html', checkLogin);
router.get('/index.html', checkLogin);
router.get('/leave.html', checkLogin);
router.get('/sign-up.html', checkLogin);
router.get('/table-list.html', checkLogin);
router.get('/tables.html', checkLogin);

router.use(express.static(path.join(__dirname, '../public/teacher-management')));
module.exports = router;