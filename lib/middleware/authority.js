function check(threshold) {
  // 不输入参数，即记为0，即只检验是否登录
  // 1 学生
  // 10 教师
  // 20 管理员
  threshold = threshold || 0;
  return function (req, res, next) {
    // 当所需权限 会话权限小 比 threshold ，就给予错误
    if (!req.session.authority)
      return next(new ResponseError(401, '您尚未登录'));
    if (req.session.authority < threshold)
      return next(new ResponseError(401, '权限不足'));
  }
}

module.exports = {
  check
};