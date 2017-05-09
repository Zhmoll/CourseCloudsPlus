const express = require('express');
const router = express.Router();
const mw = require('../lib/middleware');
const { ResponseError, Response } = require('../lib/response');
const CourseTimeLeave = require('../model/course-time-leave');
const CourseTime = require('../model/course-times');
const _ = require('lodash');

// 获取某一课程信息（完成）
// get /api/courses/:courseid
router.get('/:courseid',
  mw.course.findWithPublicInfo,
  (req, res, next) => {
    const course = req.course;
    res.json(new Response(2200, '获取课程成功', course));
  }
);

// 获取某一课程的具体信息（完成）
// get /api/courses/:courseid/detail
router.get('/:courseid/detail',
  mw.authority.check(1),
  mw.course.checkRelation,
  mw.course.findWithPrivateInfo,
  (req, res, next) => {
    const course = req.course;
    res.json(new Response(2201, '获取用户课程成功', course));
  }
);

// 获取某一课程的上课时间（完成）
// get /api/courses/:courseid/course-times
router.get('/:courseid/course-times',
  mw.authority.check(1),
  mw.course.checkRelation,
  mw.course.findWithPrivateInfo,
  (req, res, next) => {
    const course = req.course;
    // course.findCourseTimes((err, show) => {
    //   if (err) return next(err);
    //   res.json(new Response(2202, '获取该课程的上课时间成功', show));
    // });
    CourseTime
      .find({ course: course.id, deleted: false })
      .select('-deleted')
      .exec((err, coursetimes) => {
        if (err) return next(err);
        res.json(new Response(2202, '获取该课程的上课时间成功', coursetimes));
      });
  }
);

// 获取某一课程的某节课上课时间（完成）
// get /api/courses/:courseid/course-times/:coursetimeid
router.get('/:courseid/course-times/:coursetimeid',
  mw.authority.check(1),
  mw.course.checkRelation,
  mw.course.checkCoursetimeRelation,
  (req, res, next) => {
    const coursetime = req.coursetime;
    res.json(new Response(2203, '获取该上课时间成功', coursetime));
  }
);

// 学生查询某节课的所有请假条（完成）
// get /api/courses/:courseid/askforleave
router.get('/:courseid/askforleave',
  mw.authority.check(1),
  mw.course.checkRelation,
  (req, res, next) => {
    const courseid = req.params.courseid;
    const userid = req.session.userid;

    CourseTimeLeave.findByUserIdAndCourseId(userid, courseid, (err, leaves) => {
      if (err) return next(err);
      res.json(new Response(2205, '获取请假条成功', leaves));
    });
  }
);

// 为某节课某一次课程的某次上课时间请假（完成）
// post /api/courses/:courseid/course-times/:coursetimeid/askforleave
router.post('/:courseid/course-times/:coursetimeid/askforleave',
  mw.authority.check(1),
  mw.course.checkRelation,
  mw.course.checkCoursetimeRelation,
  mw.params.exist('reason'),
  (req, res, next) => {
    const data = _.pick(req.body, ['reason']);
    data.user = req.session.userid;
    data.course = req.params.courseid;
    data.courseTime = req.params.coursetimeid;

    CourseTimeLeave
      .findOne(data)
      .exec((err, result) => {
        if (err) return next(err);
        if (result)
          return res.json(new ResponseError(4006, '已经在该课时申请过请假条'));
        CourseTimeLeave.create(data, (err, leave) => {
          if (err) return next(err);
          res.json(new Response(2204, '创建请假条完成，请等待教师批复'));
        });
      });
  }
);

// 学生查询某节课的所有教师群发消息（完成）
// get /api/courses/:courseid/notices
router.get('/:courseid/notices',
  mw.authority.check(1),
  mw.course.checkRelation,
  mw.notice.findByCourseid,
  (req, res, next) => {
    const notices = req.notices;
    res.json(new Response(2307, '获取该课的所有消息成功', notices));
  }
);

module.exports = router;