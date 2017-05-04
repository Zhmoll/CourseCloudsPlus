const UserNoticeRelation = require('../../model/user-notice-relation');
const Notice = require('../../model/notices');
const { ResponseError } = require('../response');
const _ = require('lodash');

// 查询属于某用户的所有接收消息
function findReceivedByUserid(req, res, next) {
  const userid = req.session.userid;
  UserNoticeRelation
    .findByReceiverId(userid, (err, notices) => {
      if (err) return next(err);
      req.notices = notices;
      next();
    });
}

// 查询属于某用户的所有发送的消息
function findSentByUserid(req, res, next) {
  const userid = req.session.userid;
  Notice
    .findBySenderId(userid, (err, notices) => {
      if (err) return next(err);
      req.notices = notices;
      next();
    });
}

// 查询用户接收到的某条消息
function findReceivedByNoticeid(req, res, next) {
  const userid = req.session.userid;
  const noticeid = req.params.noticeid;
  if (!noticeid)
    return next(new ResponseError(4101, '缺少参数noticeid'));
  UserNoticeRelation
    .findOneByReceiverIdAndNoticeId(userid, noticeid, (err, notice) => {
      if (err) return next(err);
      if (!notice)
        return next(new ResponseError(4202, '找不到该消息'));
      req.notice = notice;
      next();
    });
}

// 查询用户发送的某条消息
function findSentByNoticeid(req, res, next) {
  const userid = req.session.userid;
  const noticeid = req.params.noticeid;
  if (!noticeid)
    return next(new ResponseError(4101, '缺少参数noticeid'));
  Notice
    .findOneBySenderIdAndNoticeId(userid, noticeid, (err, notice) => {
      if (err) return next(err);
      if (!notice)
        return next(new ResponseError(4202, '找不到该消息'));
      req.notice = notice;
      next();
    });
}

// 查询用户收到的属于某课程的消息
function findByCourseid(req, res, next) {
  const courseid = req.params.courseid;
  Notice.findByCourseid(courseid, (err, notices) => {
    if (err) return next(err);
    req.notices = notices;
    next();
  });
}

exports.findReceivedByUserid = findReceivedByUserid;
exports.findSentByUserid = findSentByUserid;
exports.findReceivedByNoticeid = findReceivedByNoticeid;
exports.findSentByNoticeid = findSentByNoticeid;
exports.findByCourseid = findByCourseid;