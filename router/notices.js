const express = require('express');
const router = express.Router();
const mw = require('../lib/middleware');
const { ResponseError, Response } = require('../lib/response');

// 获取用户所有接收到的消息（完成）
// get /api/notices/inbox
router.get('/inbox',
  mw.authority.check(),
  mw.notice.findReceivedByUserid,
  (req, res, next) => {
    const notices = notices;
    res.json(new Response(2305, '获取收件箱成功', notices));
  }
);

// 获取用户所有发送了的消息（完成）
// get /api/notices/outbox
router.get('/outbox',
  mw.authority.check(),
  mw.notice.findSentByUserid,
  (req, res, next) => {
    const notices = notices;
    res.json(new Response(2306, '获取发件箱成功', notices));
  }
);

// 获取用户的某一条接收的消息（完成）
// get /api/notices/inbox/:noticeid
router.get('/inbox/:noticeid',
  mw.authority.check(),
  mw.notice.findReceivedByNoticeid,
  (req, res, next) => {
    const notice = req.notice;
    res.json(new Response(2301, '获取消息成功', notice));
  }
);

// 获取用户的某一条发送的消息（完成）
// get /api/notices/outbox/:noticeid
router.get('/outbox/:noticeid',
  mw.authority.check(),
  mw.notice.findSentByNoticeid,
  (req, res, next) => {
    const notice = req.notice;
    res.json(new Response(2301, '获取消息成功', notice));
  }
);

// 标记某接收的消息已读（完成）
// get /api/notices/inbox/:noticeid/done
router.get('/inbox/:noticeid/done',
  mw.authority.check(),
  mw.notice.findReceivedByNoticeid,
  (req, res, next) => {
    const notice = req.notice;
    notice.done = true;
    notice.save((err, result) => {
      if (err) return next(err);
      res.json(new Response(2302, '标记消息已读成功'));
    });
  }
);

// 删除某条接收的消息（完成）
// delete /api/notices/:noticeid
router.delete('/inbox/:noticeid',
  mw.authority.check(),
  mw.notice.findReceivedByNoticeid,
  (req, res, next) => {
    const notice = req.notice;
    notice.deleted = true
    notice.save((err, result) => {
      if (err) return next(err);
      res.json(new Response(2303, '删除消息成功'));
    });
  }
);

module.exports = router;