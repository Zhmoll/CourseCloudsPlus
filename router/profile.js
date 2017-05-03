const express = require('express');
const router = express.Router();
const mw = require('../lib/middleware');
const User = require('../model/users');
const { ResponseError, Response } = require('../lib/response');
const _ = require('lodash');
const fetchheadimg = require('../lib/fetchheadimg');
const OAuthApi = require('../wechat/OAuth');
const UserCourseRelation = require('../model/user-course-relation');
const CourseTimeLeave = require('../model/course-time-leave');

// 获取用户自身信息（完成）
// get /api/profile
router.get('/',
  mw.authority.check(),
  (req, res, next) => {
    const userid = req.session.userid;
    User.privateFindById(userid, (err, user) => {
      if (err) return next(err);
      res.json(new Response(2000, '获取用户自身信息成功', user));
    });
  }
);

// 修改用户自身信息（完成）
// put /api/profile
router.put('/',
  mw.authority.check(),
  mw.user.findMe,
  (req, res, next) => {
    const user = req.me;
    const update = _.pick(req.body, [
      'nickname', 'gender', 'description', 'wechat', 'school',
      'realname_public', 'telephone_public', 'wechat_public', 'email_public',
      'location_public', 'university_public', 'courses_public'
    ]);

    user.update(update, (err, updated_user) => {
      if (err) return next(err);
      res.json(new Response(2001, '修改用户自身信息成功'));
    });
  }
);

// 修改用户密码（完成）
// put /api/profile/password
router.put('/password',
  mw.authority.check(),
  mw.params.exist('oldpassword newpassword'),
  mw.user.findMe,
  (req, res, next) => {
    const { oldpassword, newpassword } = req.body;
    const user = req.me;
    if (!user.validatePassword(oldpassword)) {
      return next(new ResponseError(4001, '密码错误'));
    }
    user.changePassword(newpassword, (err, result) => {
      if (err) return next(err);
      res.json(new Response(2002, '修改密码成功'));
    });
  }
);

// 绑定用户的微信号（完成）
// post /api/profile/wechat/bind
router.post('/wechat/bind',
  mw.params.exist('uid university password code state'),
  (req, res, next) => {
    const { uid, university, password, code, state } = req.body;

    User
      .findOne({ uid: uid, university: university })
      .where('deleted').equals(false)
      .exec((err, user) => {
        if (err) return next(err);
        if (!user)
          return next(new ResponseError(4002, '找不到该用户'));
        if (!user.validatePassword(password))
          return next(new ResponseError(4001, '密码错误'));

        OAuthApi.getUserByCode(code, (err, wechatuser) => {
          if (err) return next(err);
          const update = _.pick(wechatuser,
            ['openid', 'unionid', 'nickname', 'gender', 'city', 'province']);

          fetchheadimg(wechatuser.headimgurl, (err, url) => {
            if (err) return next(err);
            update.avatar = url;
            update.enable = true;

            user.update(wechatuser, (err, updated_user) => {
              if (err) return next(err);
              req.session.openid = user.openid;
              req.session.userid = user.id;
              req.session.authority = user.authority;
              res.json(new Response(2003, '绑定微信用户成功'));
            });
          });
        });
      });
  }
);

// 用用户的微信号登录（完成）
// post /api/profile/wechat/login
router.post('/wechat/login',
  mw.params.exist('code state'),
  (req, res, next) => {
    const { code, state } = req.body;

    OAuthApi.getAccessToken(code, (err, result) => {
      const openid = result.data.openid;

      User.innerFindByOpenid(openid, (err, user) => {
        if (err) return next(err);
        if (!user)
          return next(new ResponseError(4003, '微信用户尚未绑定账户'));
        req.session.openid = openid;
        req.session.userid = user.id;
        req.session.authority = user.authority;
        res.json(new Response(2004, '微信登录成功'));
      });
    });
  }
);


// 学生查询的某个请假条（完成）
// get /api/profile/askforleave/:leaveid
router.get('/askforleave/:leaveid',
  mw.authority.check(1),
  mw.course.checkLeaveUserRelation,
  (req, res, next) => {
    const leave = req.leave;
    res.json(new Response(2206, '获取该请假条成功', leave));
  }
);

// 学生查询的所有请假条（完成）
// get /api/profile/askforleave
router.get('/askforleave',
  mw.authority.check(1),
  (req, res, next) => {
    const userid = req.session.userid;
    CourseTimeLeave
      .find({ user: userid })
      .where('deleted').equals(false)
      .populate({
        path: 'courseTime',
        match: { deleted: false },
        select: '-deleted'
      })
      .populate({
        path: 'allowBy',
        match: { deletd: false },
        select: 'id uid name avatar'
      })
      .exec((err, leaves) => {
        if (err) return next(err);
        res.json(new Response(2205, '获取请假条成功', leaves));
      });
  }
);

// 学生查询课表（完成）
// get /api/profile/coursetimes
router.get('/coursetimes',
  mw.authority.check(1),
  (req, res, next) => {
    const userid = req.session.userid;
    UserCourseRelation.findCourseTimes(userid, (err, show) => {
      if (err) return next(err);
      res.json(new Response(2207, '获取课表成功', show));
    });
  }
);

module.exports = router;

// // 修改用户手机号 todo
// // put /api/profile/telephone
// router.put('/telephone',
//   mw.authority.check(),
//   mw.user.findMe,
//   (req, res, next) => {
//     const user = req.me;
//     const telephone = req.body.telephone;

//     user.telephone = telephone;
//     user.telephone_verified = false;
//   }
// );

// // 修改用户邮箱 todo
// // put /api/profile/email
// router.put('/email',
//   mw.authority.check(),
//   mw.user.findMe,
//   (req, res, next) => {
//     const user = req.me;
//     const email = req.body.email;

//     user.email = email;
//     user.email_verified = false;
//     user.save((err, user) => {
//       if (err) return next(err);
//       // 生成一个链接用于验证用户邮箱是否正确
//     });
//   }
// );
