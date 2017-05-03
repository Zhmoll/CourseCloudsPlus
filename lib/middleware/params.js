const _ = require('lodash');
const { ResponseError } = require('../response');

function exist(content) {
  return function (req, res, next) {
    const items = content.split(' ');
    items.forEach(item => {
      if (!_.has(req.body, item))
        return next(new ResponseError(4101, '缺少参数' + item));
    });
    next();
  }
}

module.exports = {
  exist
};