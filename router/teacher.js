const express = require('express');
const router = express.Router();
const mw = require('../lib/middleware');
const Course = require('../model/courses');
const User = require('../model/users');
const Notice = require('../model/notices');
const UserCourseRelation = require('../model/user-course-relation');
const CourseTime = require('../model/course-times');
const CourseTimeLeave = require('../model/course-time-leave');
const CourseAttend = require('../model/course-attends');
const { ResponseError, Response } = require('../lib/response');
const _ = require('lodash');

// 教师添加课程（完成）
// post /api/teacher-management/courses
router.post('/courses',
  mw.params.exist('cid name intros teachers'),
  mw.authority.check(10),
  function (req, res, next) {
    const teacherid = req.session.userid;
    const data = _.pick(req.body, ['cid', 'name', 'intros', 'teachers']);

    Course.create(data, (err, course) => {
      if (err) return next(err);
      return res.json(new Response(3001, '成功创建课程', course));
    });
  }
);

// 教师修改某课程（完成）
// put /api/teacher-management/courses/:courseid
router.put('/courses/:courseid',
  mw.authority.check(10),
  mw.course.checkOwnerRelation,
  mw.course.findWithPrivateInfo,
  function (req, res, next) {
    const course = req.course;
    const update = _.pick(req.body, ['cid', 'name', 'intros', 'teachers']);

    course
      .update(update)
      .exec((err, course) => {
        if (err) return next(err);
        return res.json(new Response(3002, '成功修改课程'));
      });
  }
);

// 教师删除某课程（完成）
// delete /api/teacher-management/courses/:courseid
router.delete('/courses/:courseid',
  mw.authority.check(10),
  mw.course.checkOwnerRelation,
  mw.course.findWithPrivateInfo,
  function (req, res, next) {
    const course = req.course;
    course.deleted = true;
    course.save((err, course) => {
      if (err) return next(err);
      return res.json(new Response(3003, '成功删除课程'));
    });
  }
);

// 教师针对某课程发送通知（完成）
// post /api/teacher-management/courses/:courseid/notices
router.post('/courses/:courseid/notices',
  mw.authority.check(10),
  mw.course.checkOwnerRelation,
  function (req, res, next) {
    const courseid = req.params.courseid;
    const userid = req.session.userid;

    const data = _.pick(req.body, ['title', 'content']);
    data.course = courseid;

    UserCourseRelation.findByCourseid(courseid, (err, relations) => {
      if (err) return next(err);
      const receiverid = [];
      relations.forEach(relation => {
        receiverid.push(relation.user);
      });

      Notice.sendNotice(userid, receiverid, data, (err, result) => {
        if (err) return next(err);
        res.json(new Response(3004, '课程通知发布成功'));
      })
    });
  }
);

// 教师针对某课程获取所有上课时间（完成）
// get /api/teacher-management/courses/:courseid/course-times
router.get('/courses/:courseid/course-times',
  mw.authority.check(10),
  mw.course.checkOwnerRelation,
  mw.course.findWithPrivateInfo,
  (req, res, next) => {
    const courseid = req.params.courseid;
    const course = req.course;
    course.findCourseTimes((err, show) => {
      if (err) return next(err);
      res.json(new Response(3006, '获取上课时间成功', show));
    });
  }
);

// 教师针对某课程添加上课时间（完成）
// post /api/teacher-management/courses/:courseid/course-times
router.post('/courses/:courseid/course-times',
  mw.authority.check(10),
  mw.course.checkOwnerRelation,
  (req, res, next) => {
    const courseid = req.params.courseid;
    const data = [];
    if (!Array.isArray(req.body))
      return next(new ResponseError(4105, '添加的上课时间参数不正确'));
    req.body.forEach(item => {
      const record = _.pick(item, ['location', 'term', 'week', 'weekday', 'rows', 'remark']);
      if (!record.location || !record.term || !record.week || !record.weekday || !record.rows || !record.remark) {
        return next(new ResponseError(4105, '添加的上课时间参数不正确'));
      }
      record.course = courseid;
      data.push(record);
    });
    CourseTime.create(data, (err, result) => {
      if (err) return next(err);
      res.json(new Response(3005, '添加上课时间成功'));
    });
  }
);

// 教师获得某上课时间（完成）
// get /api/teacher-management/courses/:courseid/course-times/:coursetimeid
router.get('/courses/:courseid/course-times/:coursetimeid',
  mw.authority.check(10),
  mw.course.checkOwnerRelation,
  mw.course.checkCoursetimeRelation,
  (req, res, next) => {
    const coursetime = req.coursetime;
    res.json(new Response(3009, '获取该上课时间成功', coursetime));
  }
);

// 教师修改某上课时间（完成）
// put /api/teacher-management/courses/:courseid/course-times/:coursetimeid
router.put('/courses/:courseid/course-times/:coursetimeid',
  mw.authority.check(10),
  mw.course.checkOwnerRelation,
  mw.course.checkCoursetimeRelation,
  (req, res, next) => {
    const coursetime = req.coursetime;
    const update = _.pick(req.body, ['location', 'term', 'week', 'weekday', 'rows', 'remark']);

    coursetime.update(update, (err, updated_coursetime) => {
      if (err) return next(err);
      res.json(new Response(3008, '修改上课时间信息成功'));
    });
  }
);

// 教师删除某上课时间（完成）
// delete /api/teacher-management/courses/:courseid/course-times/:coursetimeid
router.delete('/courses/:courseid/course-times/:coursetimeid',
  mw.authority.check(10),
  mw.course.checkOwnerRelation,
  mw.course.checkCoursetimeRelation,
  (req, res, next) => {
    const coursetime = req.coursetime;
    coursetime.deleted = true;
    coursetime.save((err, result) => {
      if (err) return next(err);
      res.json(new Response(3007, '删除上课时间成功'));
    });
  }
);

// 教师查询某节课的所有教师群发消息（完成）
// get /api/teacher-management/courses/:courseid/notices
router.get('/courses/:courseid/notices',
  mw.authority.check(10),
  mw.course.checkOwnerRelation,
  mw.notice.findByCourseid,
  (req, res, next) => {
    const notices = req.notices;
    res.json(new Response(3010, '获取该课的所有消息成功', notices));
  }
);

// 教师批准某节课的学生的某请假条（完成）
// post /api/teacher-management/courses/:courseid/askforleave/:leaveid/allow
router.post('/courses/:courseid/askforleave/:leaveid/allow',
  mw.authority.check(10),
  mw.course.checkOwnerRelation,
  mw.course.checkLeaveCourseRelation,
  (req, res, next) => {
    const leave = req.leave;

    if (leave.responsed) {
      return res.json(new ResponseError(4005, '该请假条已经批复'));
    }

    const update = _.pick(req.body, ['allow', 'allowBy', 'allowInfo']);
    update.responsed = true;
    leave.update(update, (err, updated_leave) => {
      if (err) return next(err);
      res.json(new Response(3011, '批复请假条成功', updated_leave));
    });
  }
);

// 教师查询某节课所有的学生请假条（完成）
// get /api/teacher-management/courses/:courseid/askforleave
router.get('/api/teacher-management/courses/:courseid/askforleave',
  mw.authority.check(10),
  mw.course.checkOwnerRelation,
  (req, res, next) => {
    const courseid = req.params.courseid;

    CourseTimeLeave
      .find({ course: courseid })
      .populate({
        path: 'user',
        match: { deletd: false },
        select: 'id cid name nickname avatar'
      })
      .populate({
        path: 'courseTime',
        match: { deleted: false },
        select: '-deleted'
      })
      .populate({
        path: 'allowBy',
        match: { deleted: false },
        select: 'id uid name avatar'
      })
      .exec((err, leaves) => {
        if (err) return next(err);
        res.json(new Response(3012, '获取该课程请假条成功', leaves));
      });
  }
);

// 教师批量添加上课学生（完成）
// post /api/teacher-management/courses/:courseid/students
router.post('/courses/:courseid/students',
  mw.authority.check(10),
  mw.course.checkOwnerRelation,
  (req, res, next) => {
    const courseid = req.params.courseid;
    const ids = req.body;
    const university = req.method.university;
    const relations = [];

    ids.forEach(userid => {
      relations.push({ user: userid, course: courseid });
    });

    UserCourseRelation.create(relations, (err, results) => {
      if (err) return next(err);
      res.json(new Response(3013, '批量添加上课学生成功'));
    });
  }
);

// 教师获得某课的上课学生（完成）
// get /api/teacher-management/courses/:courseid/students
router.get('/courses/:courseid/students',
  mw.authority.check(10),
  mw.course.checkOwnerRelation,
  mw.course.findStudents,
  (req, res, next) => {
    const students = req.students;
    res.json(new Response(3014, '获取该课参与学生成功', students));
  }
);

// 教师发起签到
// post /api/teacher-management/courses/:courseid/attends-check
router.post('/courses/:courseid/attends-check',
  mw.authority.check(10),
  mw.course.checkOwnerRelation,
  (req, res, next) => {
    CourseAttend.create({ course: req.params.courseid }, (err, result) => {
      if (err) return next(err);
      res.json(new Response(3015, '发起请求签到成功', { content: result.id }));
    });
  }
);

module.exports = router;