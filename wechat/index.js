const Wechat = require('wechat');
const config = require('config-lite').wechat;

const wechat = Wechat(config)
  .text(function (message, req, res, next) {
    res.reply('hehe');
  })
  .image(function (message, req, res, next) {
    // TODO
  })
  .voice(function (message, req, res, next) {
    // TODO
  })
  .video(function (message, req, res, next) {
    // TODO
  })
  .location(function (message, req, res, next) {
    // TODO
  })
  .link(function (message, req, res, next) {
    // TODO
  })
  .event(require('./event.js'))
  .device_text(function (message, req, res, next) {
    // TODO
  })
  .device_event(function (message, req, res, next) {
    // TODO
  })
  .middlewarify();

module.exports = wechat;