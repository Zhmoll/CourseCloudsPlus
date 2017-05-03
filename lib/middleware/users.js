const User = require('../../model/users');
const { Response, ResponseError } = require('../response');

// 查找用户自己, 挂载在 req.me
function findMe(req, res, next) {
  const userid = req.session.userid;
  User.innerFindById(userid, (err, user) => {
    if (err) return next(err);
    req.me = user;
    next();
  });
}

// 查找别的用户的公共信息
function findWithPublicInfo(req, res, next) {
  const userid = req.params.userid;
  if (!userid)
    return next(new ResponseError(4100, '缺少参数userid'));

  User.publicFindById(userid, (err, user) => {
    if (err) return next(err);
    if (!user)
      return next(new ResponseError(4000, '找不到该用户'));
    req.user = user;
    next();
  });
}

module.exports = {
  findMe,
  findWithPublicInfo
};