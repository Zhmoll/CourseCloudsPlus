const express = require('express');
const router = express.Router();
const mw = require('../lib/middleware');
const { ResponseError, Response } = require('../lib/response');
const Notice = require('../model/');

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