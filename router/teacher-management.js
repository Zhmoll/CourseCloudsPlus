const express = require('express');
const router = express.Router();
const OAuthApi = require('../wechat/OAuth');
const path = require('path');

function checkLogin(req, res, next) {
  if (!req.session.userid) {
    req.session.url = path.join('http://courseclouds.zhmoll.com/', req.originalUrl);
    const url = OAuthApi.getAuthorizeURL('http://courseclouds.zhmoll.com/user-center/wechat_login', 'wechat_login', 'snsapi_base');
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