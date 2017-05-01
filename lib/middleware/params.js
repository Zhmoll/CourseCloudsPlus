const _ = require('lodash');

function exist(content) {
  return function (req, res, next) {
    const items = content.split(' ');
    items.forEach(item => {
      if (!_.has(req.body, item))
        return next(new Error('缺少参数' + item));
    });
    next();
  }
}

module.exports = {
  exist
};