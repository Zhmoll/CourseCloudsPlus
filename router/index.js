const cors = require('cors');

module.exports = app => {
  app.use('/api', cors({ credentials: true }));
  app.use('/api/profile', require('./profile'));
  app.use('/api/users', require('./users'));
  app.use('/api/courses', require('./courses'));
  app.use('/api/notices', require('./notices'));
  app.use('/api/terms', require('./terms'));
  app.use('/api/teacher-management', require('./teacher'));
  app.use('/api/admin', require('./admin'));
};