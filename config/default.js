module.exports = {
  mongodb: {
    url: 'mongodb://localhost/CourseClouds'
  },
  wechat: {
    appid: 'wxb54a4c0517a8584e',
    appsecret: '40c9a95eac50c41f4df617563cbb08ea',
    token: 'zhmollcourseclouds',
    // encodingAESKey: 'encodinAESKey',
    checkSignature: false // 可选，默认为true。由于微信公众平台接口调试工具在明文模式下不发送签名，所以如要使用该测试工具，请将其设置为false
  },
  session: {
    secret: 'ZhmollCourseClouds',
    name: 'sid',
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 3600 * 24 * 7
    }
  },
  select: {
    public_user_info: '',
    private_user_info: '',
    simple_user_info: 'id nickname avatar',
    simple_teacher_info: 'id uid name avatar'
  }
};