const express = require('express');
const router = express.Router();
const mw = require('../lib/middleware');
const Term = require('../model/terms');
const { Response, ResponseError } = require('../lib/response');

router.get('/currentWeek',
  mw.authority.check(1),
  mw.user.findMe,
  (req, res, next) => {
    const user = req.me;
    const university = user.university;
    Term.getCurrentWeek(university, (err, result) => {
      if (err) return next(err);
      res.json(new Response(2007, '获取当前周成功'));
    });
  }
);