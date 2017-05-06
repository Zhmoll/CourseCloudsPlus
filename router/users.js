const express = require('express');
const router = express.Router();
const mw = require('../lib/middleware');
const { ResponseError, Response } = require('../lib/response');
const Notice = require('../model/notices');
const User = require('../model/users');
const _ = require('lodash');

// 使用账号密码登录
// post /api/users/login
router.post('/login',
  mw.authority.checkNotLogin,
  mw.params.exist('uid university password'),
  (req, res, next) => {
    const { uid, university, password } = req.body;
    User
      .findOne({ uid: uid, university: university })
      .exec((err, user) => {
        if (err) return next(err);
        if (!user)
          return next(new ResponseError(4002, '找不到该用户'));
        if (!user.validatePassword(password))
          return next(new ResponseError(4001, '密码错误'));
        req.session.userid = user.id;
        req.session.authority = user.authority;

        if (!user.enable) {
          user
            .update({ enable: true })
            .then((result) => {
              if (err) return next(err);
              return res.json(new Response(2005, '登陆成功', {
                id: user.id,
                avatar: user.avatar,
                name: user.name,
                nickname: user.nickname,
                university: user.university,
                description: user.description
              }));
            });
        }
        else
          return res.json(new Response(2005, '登陆成功', {
            id: user.id,
            avatar: user.avatar,
            name: user.name,
            nickname: user.nickname,
            university: user.university,
            description: user.description
          }));
      });
  }
);

// 注销
// get /api/users/logout
router.get('/logout',
  mw.authority.check(),
  (req, res, next) => {
    req.session.destroy();
    res.json(new Response(2006, '注销成功'));
  }
);

// 获取某一用户，返回公开信息（完成）
// get /api/users/:userid
router.get('/:userid',
  mw.user.findWithPublicInfo,
  (req, res, next) => {
    const user = req.user;
    res.json(new Response(2100, '获取用户公开信息成功', user));
  }
);

// 向某用户发送消息（完成）
// post /api/users/:userid/notice
router.post('/:userid/notice',
  mw.authority.check(),
  mw.params.exist('title content'),
  mw.user.findWithPublicInfo,
  (req, res, next) => {
    const user = req.user;
    const userid = user._id;
    const myid = req.session.userid;
    const data = _.pick(req.body, ['title', 'content']);

    Notice.sendNotice(myid, userid, data, (err, result) => {
      if (err) return next(err);
      res.json(new Response(2304, '消息发送成功'));
    });
  }
);

module.exports = router;