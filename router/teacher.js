const express = require('express');
const router = express.Router();
const mw = require('../lib/middleware');
const config = require('config-lite');
const Course = require('../model/courses');
const User = require('../model/users');
const Notice = require('../model/notices');
const UserCourseRelation = require('../model/user-course-relation');
const CourseTime = require('../model/course-times');
const CourseTimeLeave = require('../model/course-time-leave');
const CourseAttend = require('../model/course-attends');
const CourseAttendRemark = require('../model/course-attend-remarks');
const xlsx = require('node-xlsx');
const querystring = require('querystring');
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

// 教师为某上课时间群发通知
// get /api/teacher-management/courses/:courseid/course-times/:coursetimeid/notices
router.get('/courses/:courseid/course-times/:coursetimeid/notices',
  mw.authority.check(10),
  mw.course.checkOwnerRelation,
  mw.course.checkCoursetimeRelation,
  mw.course.findWithPrivateInfo,
  (req, res, next) => {
    const coursetime = req.coursetime;
    const course = req.course;
    const courseid = course.id;
    const userid = req.session.userid;

    let weekday;
    switch (coursetime.weekday) {
      case 0: weekday = '周日'; break;
      case 1: weekday = '周一'; break;
      case 2: weekday = '周二'; break;
      case 3: weekday = '周三'; break;
      case 4: weekday = '周四'; break;
      case 5: weekday = '周五'; break;
      case 6: weekday = '周六'; break;
    }

    data.title = `${course.name}上课时间通知`;
    data.content = `时间：${coursetime.term}学期 第${coursetime.week}周 ${weekday} 第${coursetime.rows.toString()}节` +
      '\n' + `地点：${coursetime.location}`;
    if (course.remark) data.content += '\n备注：' + course.remark;

    UserCourseRelation.findByCourseid(courseid, (err, relations) => {
      if (err) return next(err);
      const receiverid = [];
      relations.forEach(relation => {
        receiverid.push(relation.user);
      });

      Notice.sendNotice(userid, receiverid, data, (err, result) => {
        if (err) return next(err);
        res.json(new Response(3016, '上课时间通知发布成功'));
      })
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

// 教师获得签到结果
// get /api/teacher-management/courses/:courseid/attends-check/:attendid
router.get('/courses/:courseid/attends-check/:attendid',
  mw.authority.check(10),
  mw.course.checkOwnerRelation,
  (req, res, next) => {
    const { courseid, attendid } = req.params;
    CourseAttend
      .findOne({ course: courseid, id: attendid })
      .exec((err, attend) => {
        if (err) return next(err);
        if (!attend)
          return next(new ResponseError(4203, '找不到该签到'));

        CourseAttendRemark
          .find({ courseAttend: attendid })
          .populate({
            path: 'user',
            match: { deleted: false },
            select: 'id uid name university'
          })
          .exec((err, remarks) => {
            if (err) return next(err);
            const results = [['id', '学校', '学号', '姓名']];

            remarks.forEach(remark => {
              results.push([remark.user.id, remark.user.university, remark.user.uid, remark.user.name]);
            });

            const buffer = xlsx.build([{ name: '签到结果', data: results }]);
            const filename = '签到结果.xlsx';
            res.setHeader('Content-Type', 'application/octet-stream');
            res.setHeader('Content-Disposition', 'attachment;filename=' + querystring.escape(filename));
            return res.end(buffer);
          });
      });
  }
);

// 教师获取自己的课表
// get /api/teacher-management/coursetimes
router.get('/coursetimes',
  mw.authority.check(10),
  (req, res, next) => {
    const userid = req.session.userid;
    Course
      .find({ teachers: { $all: [userid] }, deleted: false })
      .populate({
        path: 'teachers',
        match: { deleted: false },
        select: config.select.simple_teacher_info
      })
      .exec((err, courses) => {
        if (err) return next(err);
        const missions = [];
        courses.forEach(course => {
          const courseid = course.id;
          missions.push(CourseTime
            .find({ course: courseid, deleted: false })
            .select('-deleted')
          );
        });
        Promise.all(missions)
          .then(results => {
            const coursetimes = [];
            for (let i = 0; i < courses.length; i++) {
              results[i].forEach(item => {
                item.course = courses[i];
                coursetimes.push(item);
              });
            }
            // 拿了course对象，返回了课表
            const show = {};
            coursetimes.forEach(coursetime => {
              const { id, location, term, week, weekday, rows, remark } = coursetime;
              const course_simple = _.pick(coursetime.course, ['id', 'cid', 'name', 'teachers']);
              // 创建学期
              if (!show[term])
                show[term] = {};
              // 创建周
              if (!show[term][week])
                show[term][week] = {};
              // 创建周几
              if (!show[term][week][weekday])
                show[term][week][weekday] = [];
              // 为周几添加课程
              show[term][week][weekday].push({
                coursetimeid: id,
                course: course_simple,
                rows: rows,
                location: location,
                remark: remark
              });
            });
            console.log(show);
            res.json(new Response(3017, '教师获得课表成功', show));
          })
          .catch(e => {
            return next(e);
          });
      });
  }
);

module.exports = router;