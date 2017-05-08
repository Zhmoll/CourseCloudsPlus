const OAuthApi = require('./OAuth');
const User = require('../model/users');
const UserCourseRelation = require('../model/user-course-relation');
const CourseAttend = require('../model/course-attends');
const CourseAttendRemark = require('../model/course-attend-remarks');
const UserNoticeRelation = require('../model/user-notice-relation');
const CourseTimeLeave = require('../model/course-time-leave');
const Term = require('../model/terms');

// 订阅
function subscribe(message, req, res, next) {
  const user = req.me;
  if (!user) {
    return res.reply('欢迎关注云课平台！请点击下方“云课中心”按钮绑定学生身份。');
  }
  res.reply(`你好，${user.name}，欢迎回到云课平台！\n点击下方按钮看看有什么新鲜事吧！`);
}

// 用户中心按钮
function key_user_center(message, req, res, next) {
  // 微信用户已绑定平台账号
  const user = req.me;
  const url = 'http://courseclouds.zhmoll.com/user-center/index.html';
  return res.reply([{
    title: '用户中心',
    description: '欢迎回来，' + user.name + '！',
    picurl: 'https://ss0.bdstatic.com/5aV1bjqh_Q23odCf/static/superman/img/logo/bd_logo1_31bdc765.png',
    url: url
  }]);
}

// 获取今日课表按钮
function key_today_courses(message, req, res, next) {
  const user = req.me;
  Term.getCurrentWeek(user.university, (err, time) => {
    if (err) return next(err);
    UserCourseRelation.findCourseTimes(user.id, (err, show) => {
      if (err) return next(err);
      let courses;
      let weekday;
      switch (time.weekday) {
        case 0: weekday = '周日'; break;
        case 1: weekday = '周一'; break;
        case 2: weekday = '周二'; break;
        case 3: weekday = '周三'; break;
        case 4: weekday = '周四'; break;
        case 5: weekday = '周五'; break;
        case 6: weekday = '周六'; break;
      }
      const result = [{ title: `今天是 第${time.week}周 ${weekday}` }];
      if (show && show[time.term] && show[time.term][time.week] &&
        show[time.term][time.week][time.weekday]) {
        courses = show[time.term][time.week][time.weekday];
        if (courses.length == 0) {
          result.push({ title: '恭喜你，今天没课！' });
          result.push({
            title: '点我获得完整课程表',
            url: 'http://courseclouds.zhmoll.com/user-center/course.html'
          });
          return res.reply(result);
        }
      }
      else {
        result.push({ title: '恭喜你，今天没课！' });
        result.push({
          title: '点我获得完整课程表',
          url: 'http://courseclouds.zhmoll.com/user-center/course.html'
        });
        return res.reply(result);
      }

      courses.sort((a, b) => a.rows[0] - b.rows[0]);

      courses.forEach(item => {
        const name = item.course.name;
        const rows = item.rows.toString();
        const teachers = [];
        item.course.teachers.forEach(teacher => {
          teachers.push(teacher.name);
        });
        result.push({
          title: `课程：${item.course.name} - ${item.course.cid}`
          + '\n' + `时间：第${rows}节`
          + '\n' + `老师：` + teachers.toString()
          + '\n' + `地点：${item.location}`
        });
      });

      result.push({
        title: '点我获得完整课程表',
        url: 'http://courseclouds.zhmoll.com/user-center/course.html'
      });
      res.reply(result);
    });
  });
}

// 签到
function key_attend_course(message, req, res, next) {
  const user = req.me;
  const attendid = message.ScanCodeInfo.ScanResult;

  CourseAttend.findById(attendid).exec((err, courseattend) => {
    if (!courseattend) {
      res.reply('找不到该签到');
    }
    const now = Date.now();
    const start = courseattend.createdAt.getTime();
    if (now - start > 3 * 60 * 1000)
      res.reply('该签到已结束');
    CourseAttendRemark
      .findOne({ user: user.id })
      .exec((err, check) => {
        if (err) {
          res.reply('服务器遇到了一些麻烦');
          console.error(err);
          return;
        }
        if (!check) {
          CourseAttendRemark.create({
            user: user.id,
            course: courseattend.course,
            courseAttend: attendid
          }, (err, result) => {
            if (err) {
              res.reply('服务器遇到了一些麻烦');
              console.error(err);
              return;
            }
            res.reply('签到成功！');
          });
        }
        res.reply('本课已经签过到！');
      });
  });
}

// 收件箱
function key_user_inbox(message, req, res, next) {
  const user = req.me;
  UserNoticeRelation.findByReceiverId(user.id, (err, relations) => {
    if (err) {
      res.reply('服务器遇到了一些麻烦');
      console.error(err);
      return;
    }
    const results = [{ title: `消息收件箱（最近6条消息）` }];
    relations.forEach((relation, index) => {
      if (index >= 6) return;
      const sendtime = relation.notice.createdAt.toLocaleDateString() + relation.notice.createdAt.toLocaleTimeString();
      if (relation.notice.course) {
        // 课程相关群发
        results.push({
          title: `标题：${relation.notice.title}` +
          '\n' + `来自：${relation.notice.from.nickname}` +
          '\n' + `时间：${sendtime}` +
          '\n' + `课堂：${relation.notice.course.name}`,
          url: 'http://courseclouds.zhmoll.com/user-center/inbox?noticeid=' + relation.notice.id
        });
      }
      else {
        // 非课程相关群发
        results.push({
          title: `标题：${relation.notice.title}` +
          '\n' + `来自：${relation.notice.from.nickname}` +
          '\n' + `时间：${sendtime}`,
          url: 'http://courseclouds.zhmoll.com/user-center/inbox?noticeid=' + relation.notice.id
        });
      }
    });
    results.push({ title: '点击查看完整消息收件箱', url: 'http://courseclouds.zhmoll.com/user-center/inbox' });
    res.reply(results);
  });
}

// 假条批复查询
function key_ask_for_leave(message, req, res, next) {
  const user = req.me;
  CourseTimeLeave
    .find({ user: user.id, deleted: false })
    .populate({
      path: 'course',
      match: { deleted: false },
      select: 'id cid name'
    })
    .populate({
      path: 'courseTime',
      match: { deleted: false },
      select: '-deleted'
    })
    .exec((err, leaves) => {
      if (err) {
        res.reply('服务器遇到了一些麻烦');
        console.error(err);
        return;
      }
      const results = [{ title: '假条批复（最近6条假条）' }];
      leaves.forEach((leave, index) => {
        if (index >= 6) return;
        let weekday;
        switch (leave.courseTime.weekday) {
          case 0: weekday = '周日'; break;
          case 1: weekday = '周一'; break;
          case 2: weekday = '周二'; break;
          case 3: weekday = '周三'; break;
          case 4: weekday = '周四'; break;
          case 5: weekday = '周五'; break;
          case 6: weekday = '周六'; break;
        }
        if (leave.responsed) {
          // 已批复的假条
          let answer;
          if (leave.allow) answer = '允许请假';
          else answer = '不允许请假';
          results.push({
            title: `课程：${leave.course.name} - ${leave.course.cid}`
            + '\n' + `时间：第${leave.courseTime.week}周 ${weekday}`
            + '第' + leave.courseTime.rows.toString() + '节'
            + '\n' + `理由：${leave.reason}`
            + '\n' + `结果：${answer}`,
            url: 'http://courseclouds.zhmoll.com/user-center/ask-for-leave.html?leaveid=' + leave.id
          });
        }
        else {
          // 未批复的假条
          results.push({
            title: `课程：${leave.course.name} - ${leave.course.cid}`
            + '\n' + `时间：第${leave.courseTime.week}周 ${weekday}`
            + '第' + leave.courseTime.rows.toString() + '节'
            + '\n' + `理由：${leave.reason}`
            + '\n' + `状态：未批复`,
            url: 'http://courseclouds.zhmoll.com/user-center/ask-for-leave.html?leaveid=' + leave.id
          });
        }
      });
      results.push({ title: '点击查看完整假条批复信息', url: 'http://courseclouds.zhmoll.com/user-center/ask-for-leave.html' });
      res.reply(results);
    });
}

// 更改绑定信息
function key_change_bind(message, req, res, next) {
  const user = req.me;
  const url = OAuthApi.getAuthorizeURL('http://courseclouds.zhmoll.com/user-center/register.html', 'wechat-bind', 'snsapi_userinfo');
  return res.reply([{
    title: '更换用户绑定',
    description: `您现在是以${user.university}${user.uid}${user.name}的身份绑定该微信公众号的，若要切换身份，请点击进入。`,
    picurl: 'https://ss0.bdstatic.com/5aV1bjqh_Q23odCf/static/superman/img/logo/bd_logo1_31bdc765.png',
    url: url
  }]);
}

module.exports = (message, req, res, next) => {
  const openid = message.FromUserName;
  console.log(message);
  User.innerFindByOpenid(openid, (err, user) => {
    if (err) {
      res.reply('服务器遇到了一些麻烦');
      console.error(err);
      return;
    }
    // 分发事件
    req.me = user;
    switch (message.Event) {
      case 'CLICK': {
        // 微信用户未绑定平台账号
        if (!user) {
          const url = OAuthApi.getAuthorizeURL('http://courseclouds.zhmoll.com/user-center/register.html', 'wechat-bind', 'snsapi_userinfo');
          return res.reply([{
            title: '绑定云课平台账号',
            description: '绑定微信号和云课平台账号，无需登录即可享受云课平台全功能服务，消息通知第一时间抵达微信！',
            picurl: 'https://ss0.bdstatic.com/5aV1bjqh_Q23odCf/static/superman/img/logo/bd_logo1_31bdc765.png',
            url: url
          }]);
        }
        // 绑定了就允许之下的操作
        switch (message.EventKey) {
          case 'key_user_center': return key_user_center(message, req, res, next);
          case 'key_today_courses': return key_today_courses(message, req, res, next);
          case 'key_attend_course': return key_attend_course(message, req, res, next);
          case 'key_user_inbox': return key_user_inbox(message, req, res, next);
          case 'key_ask_for_leave': return key_ask_for_leave(message, req, res, next);
          case 'key_change_bind': return key_change_bind(message, req, res, next);
        }
        return;
      }
      case 'subscribe': return subscribe(message, req, res, next);
    }

  });
};