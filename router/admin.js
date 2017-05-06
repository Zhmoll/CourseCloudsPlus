const express = require('express');
const router = express.Router();
const mw = require('../lib/middleware');
const User = require('../model/users');
const Term = require('../model/terms');
const _ = require('lodash');
const { Response, ResponseError } = require('../lib/response');

// 批量添加用户
// post /api/admin/users
// [{ uid, name, university, ... }]
router.post('/users',
  mw.authority.check(100),
  (req, res, next) => {
    const arr = req.body;
    for (let item of arr) {
      item.password = item.uid;
    }
    User.create(arr, (err, result) => {
      if (err) return next(err);
      res.json(new Response(6000, '批量添加用户成功'));
    });
  }
);

// 添加学期
// post /api/admin/terms
// [{ university, term, start_date }]
router.post('/terms',
  mw.authority.check(100),
  (req, res, next) => {
    const arr = req.body;
    Term.create(arr, (err, result) => {
      if (err) return next(err);
      res.json(new Response(6001, '批量添加学期成功'));
    });
  }
)

module.exports = router;