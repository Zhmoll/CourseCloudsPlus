const Course = require('../../model/courses');
const UserCourseRelation = require('../../model/user-course-relation');
const CourseTime = require('../../model/course-times');
const CourseTimeLeave = require('../../model/course-time-leave');
const ResponseError = require('../error');

// 查询公开信息
function findWithPublicInfo(req, res, next) {
  const courseid = req.params.courseid;
  if (!courseid)
    return next(new ResponseError(4101, '缺少参数courseid'));
  Course.publicFindById(courseid, (err, course) => {
    if (err) return next(err);
    if (!course)
      return next(new ResponseError(4001, '找不到该课程'));
    req.course = course;
    next();
  });
}

// 查询私有信息
function findWithPrivateInfo(req, res, next) {
  const courseid = req.params.courseid;
  if (!courseid)
    return next(new ResponseError(4101, '缺少参数courseid'));
  Course.privateFindById(courseid, (err, course) => {
    if (err) return next(err);
    if (!course)
      return next(new ResponseError(4001, '找不到该课程'));
    req.course = course;
    next();
  });
}

// 检查用户参加课程的关系是否存在
function checkRelation(req, res, next) {
  const userid = req.session.userid;
  const courseid = req.params.courseid;
  if (!courseid)
    return next(new ResponseError(4101, '缺少参数courseid'));
  UserCourseRelation.checkRelation(userid, courseid, (err, relation) => {
    if (err) return next(err);
    if (!relation)
      return next(new ResponseError(4102, '用户尚未参加此课程'));
    next();
  });
}

// 查询教师拥有课程的关系是否存在
function checkOwnerRelation(req, res, next) {
  const teacherid = req.session.userid;
  const courseid = req.params.courseid;
  if (!courseid)
    return next(new ResponseError(4101, '缺少参数courseid'));
  Course
    .findById(courseid)
    .where('deleted').equals(false)
    .exec((err, course) => {
      if (err) return next(err);
      if (!course)
        return next(new ResponseError(4103, '找不到此课程'));
      let flag = false;
      course.teachers.forEach(teacher => {
        if (teacher.toString() == teacherid)
          flag = true;
      });
      if (!flag)
        return next(new ResponseError(4104, '该课程不属于该教师管理'))
      next();
    });
}

// 查询课程和课程时间是否有关联
function checkCoursetimeRelation(req, res, next) {
  const courseid = req.params.courseid;
  const coursetimeid = req.params.coursetimeid;
  CourseTime.checkRelation(courseid, coursetimeid, (err, coursetime) => {
    if (err) return next(err);
    if (!coursetime)
      return res.json(new ResponseError(4106, '该上课时间与该课程无关'));
    req.coursetime = coursetime;
    next();
  });
}

// 查询指定请假条与用户是否有关联
function checkLeaveUserRelation(req, res, next) {
  const leaveid = req.params.leaveid;
  const userid = req.params.userid;
  CourseTimeLeave
    .findOne({ id: leaveid, user: userid })
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
    .exec((err, leave) => {
      if (err) return next(err);
      if (!leave)
        return next(new Response(4004, '找不到该请假条'));
      req.leave = leave;
    });
}

// 查询指定请假条与课程是否有关
function checkLeaveCourseRelation(req, res, next) {
  const leaveid = req.params.leaveid;
  const courseid = req.params.courseid;
  CourseTimeLeave
    .findOne({ id: leaveid, course: courseid })
    .where('deleted').equals(false)
    .populate({
      path: 'user',
      match: { deleted: false },
      select: 'id uid name nickname avatar'
    })
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
    .exec((err, leave) => {
      if (err) return next(err);
      if (!leave)
        return next(new Response(4004, '找不到该请假条'));
      req.leave = leave;
    });
}

module.exports = {
  findWithPublicInfo,
  findWithPrivateInfo,
  checkRelation,
  checkOwnerRelation,
  checkCoursetimeRelation,
  checkLeaveUserRelation,
  checkLeaveCourseRelation
};