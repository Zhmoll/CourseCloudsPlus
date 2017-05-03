const mongoose = require('mongoose');
mongoose.Promise = Promise;
const config = require('config-lite').mongodb;

mongoose.connect(config.url);

require('../model/course-attend-remarks');
require('../model/course-attends');
require('../model/course-time-leave');
require('../model/course-times');
require('../model/courses');
require('../model/notices');
require('../model/user-course-relation');
require('../model/user-notice-relation');
require('../model/users');
require('../model/wechat-user-access-tokens');
