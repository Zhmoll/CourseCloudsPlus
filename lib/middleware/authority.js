const { ResponseError } = require('../response');

function check(threshold) {
  // 不输入参数，即记为0，即只检验是否登录
  // 1 学生
  // 10 教师
  // 20 管理员
  threshold = threshold || 0;
  return function (req, res, next) {
    // 当所需权限 会话权限小 比 threshold ，就给予错误
    if (req.session.authority == undefined)
      return next(new ResponseError(4000, '您尚未登录'));
    if (req.session.authority < threshold)
      return next(new ResponseError(4100, '权限不足'));
    next();
  }
}

function checkNotLogin(req, res, next) {
  if (req.session.userid)
    return next(new ResponseError(4107, '您已经登录'));
  next();
}

module.exports = {
  check,
  checkNotLogin
};