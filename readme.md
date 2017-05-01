# CourseCloudsPlus 开发者文档

## 一、全局返回码及对应说明

| 返回码  | 返回信息            | 附加对象               |
| ---- | --------------- | ------------------ |
| 2000 | 获取用户自身信息成功      | user               |
| 2001 | 修改用户自身信息成功      | updated_user       |
| 2002 | 修改密码成功          |                    |
| 2003 | 绑定微信用户成功        |                    |
| 2004 | 微信登录成功          |                    |
| 2100 | 获取用户公开信息成功      | user               |
| 2200 | 获取课程成功          |                    |
| 2201 | 获取用户课程成功        |                    |
| 2202 | 获取该课程的上课时间成功    | coursertimes       |
| 2203 | 获取该上课时间成功       | coursetime         |
| 2204 | 创建请假条完成，请等待教师批复 |                    |
| 2205 | 获取请假条成功         | leaves             |
| 2300 |                 |                    |
| 2301 | 获取消息成功          | notice             |
| 2302 | 标记消息已读成功        |                    |
| 2303 | 删除消息成功          |                    |
| 2304 | 消息发送成功          |                    |
|      | 获取该课的所有消息成功     | notices            |
| 2305 | 获取收件箱成功         | notices            |
| 2306 | 获取发件箱成功         | notices            |
| 3001 | 成功创建课程          | course             |
| 3002 | 成功修改课程          | course             |
| 3003 | 成功删除课程          |                    |
| 3004 | 课程通知发布成功        |                    |
| 3005 | 添加上课时间成功        |                    |
| 3006 | 获取上课时间成功        | show               |
| 3007 | 删除上课时间成功        |                    |
| 3008 | 修改上课时间信息成功      | updated_coursetime |
| 3009 | 获取该上课时间成功       | coursetime         |
|      | 获取该课的所有消息成功     | notices            |
| 4001 | 密码错误            |                    |
| 4002 | 找不到该用户          |                    |
| 4003 | 微信用户尚未绑定账户      |                    |
| 4101 | 缺少参数courseid    |                    |
| 4102 | 用户尚未参加此课程       |                    |
| 4103 | 找不到此课程          |                    |
| 4104 | 该课程不属于该教师管理     |                    |
| 4105 | 添加的上课时间参数不正确    |                    |
| 4106 | 该上课时间与该课程无关     |                    |
| 4201 | 缺少参数noticeid    |                    |
| 4202 | 找不到该消息          |                    |
|      |                 |                    |
|      |                 |                    |
|      |                 |                    |
|      |                 |                    |
|      |                 |                    |
|      |                 |                    |

## 二、api说明

### 1、用户相关

#### 0）、User Schema

```javascript
const schema = {
  /* 
   * - - - - - - - - 用户元信息 - - - - - - - -
   * uid        学工号             [可选公开] - realname_public
   * name       姓名               [可选公开] - realname_public
   * password   密码（已作摘要处理）
   * openid     微信openid
   * unionid    微信unionid
   * authority  权限
   * enable     账户是否被启用
   * deleted    用户是否被删除
   * - - - - - - - - - - - - - - - - - - - - -
   */
  uid: { type: String, index: true },
  name: { type: String },
  password: { type: String },
  openid: { type: String, index: true },
  unionid: { type: String, index: true },
  authority: { type: Number, default: 1 },
  enable: { type: Boolean, default: false },
  deleted: { type: Boolean, default: false },

  /* 
   * - - - - - - - - 用户公开信息 - - - - - - - -
   * nickname   昵称
   * gender     性别  0保密，1男，2女
   * avatar     头像链接
   * description个性签名
   * - - - - - - - - - - - - - - - - - - - - - -
   */
  nickname: { type: String },
  gender: { type: String, enum: [0, 1, 2] },
  avatar: { type: String },
  description: { type: String },

  /*
   * - - - - - - - - 用户个人信息 - - - - - - - -
   * telephone  电话        [可选公开] - telephone_public
   * wechat     微信号      [可选公开] - wechat_public
   * email      邮箱        [可选公开] - email_public
   * city       城市        [可选公开] - location_public
   * province   省份        [可选公开] - location_public
   * school     学院        [可选公开] - university_public
   * university 学校        [可选公开] - university_public
   */
  telephone: { type: String },
  wechat: { type: String },
  email: { type: String },
  city: { type: String },
  province: { type: String },
  school: { type: String },
  university: { type: String },

  /*
   * - - - - - - - - 认证信息 - - - - - - - -
   * telephone_verified  电话认证
   * email_verified      邮箱
   */
  telephone_verified: { type: Boolean, default: false },
  email_verified: { type: Boolean, default: false },

  /*
   * - - - - - - - - 公开信息 - - - - - - - -
   */
  realname_public: { type: Boolean, default: false },
  telephone_public: { type: Boolean, default: false },
  wechat_public: { type: Boolean, default: false },
  email_public: { type: Boolean, default: false },
  location_public: { type: Boolean, default: false },
  university_public: { type: Boolean, default: false },
  courses_public: { type: Boolean, default: false },
};
```

#### 1）、返回信息标准

##### ①、用户私有信息

去除了`deleted`, `password`, `openid`, `unionid`，`enable`。

##### ②、用户公开信息

包含`_id`, `nickname`, `gender`, `avatar`, `description`, `authority`，以及标记 `public` 为 `true` 的对应属性。

#### 2）、获取用户自身信息

`get` `/api/profile`

需登录

返回 `2000`, `用户私有信息` 。

#### 3）、修改用户自身信息

`put` `/api/profile`

需登录

发送

```json
{
  "nickname": "Zhmoll",
  "gender": 1,
  "description": "如果你不能清楚的描述……那么说明你没有理解……",
  "wechat": "zhmoll",
  "school": "计算机学院",
  "realname_public": false,
  "telephone_public": false,
  "wechat_public": true,
  "email_public": false,
  "location_public": false,
  "university_public": true,
  "courses_public": false
}
```

注意，需要修改什么内容就发送什么内容。下面的api将不再以这种完整的格式展现，只告诉可以发送什么东西，开发者需自行根据`Schema`拼装要发送的内容。

返回 `2001`, `用户私有信息` 。

#### 4）、修改用户密码

`put` `/api/profile/password`

需登录

发送 `{ oldpassword, newpassword }`，其中`oldpassword`是旧密码，`newpassword`是新密码。

返回`2002`。

#### 5）、绑定用户的微信号

`post` `/api/profile/wechat/bind`

发送 `{ uid, university, password, code, state }`，其中`code`和`state`需要从url上摘取，其余的内容需要从页面输入框中拿到。

返回`2003`。

#### 6）、用用户的微信号登录

`post` `/api/profile/wechat/login`

发送`{ code, state }`，其中`code`和`state`需要从url上摘取。

返回`2004`。

#### 7）、修改用户手机号时发送验证短信（暂未完成）

`put` `/api/profile/telephone`

发送`{ telephone }`。

#### 8）、修改用户邮箱（暂未完成）

`put` `/api/profile/telephone`

发送`{ email }`。

#### 9）、验证用户邮箱(暂未完成)

`get` `/profile/emailverify?token={token}&userid={userid}`

#### 10）、获取某一用户，返回公开信息

`get` `/api/users/:userid`

返回`2100`，`用户公开信息`。

### 2、消息相关

#### 0）、Schema

##### ①、Notice Schema

```javascript
const schema = {
  title: { type: String },
  content: { type: String },
  createdAt: { type: Date, default: new Date() },
  from: { type: Schema.Types.ObjectId, ref: 'User' },
  course: { type: Schema.Types.ObjectId, ref: 'Course' },
  deleted: { type: Boolean, default: false }
};
```

该模型是用来保存消息内容的。其中`title`、`content`分别为消息的标题以及内容体。当`course`存在时，则该消息为教师发布的、对应某课程群发的消息。

##### ②、User Notice Relation Schema

```javascript
const schema = {
  notice: { type: Schema.Types.ObjectId, ref: 'Notice' },
  to: { type: Schema.Types.ObjectId, index: true, ref: 'User' },
  done: { type: Boolean, default: false },
  deleted: { type: Boolean, default: false }
};
```

该模型是用来保存消息的发送接收关系的。`notice`关联上面那个模型的记录。`from`、`to`是用户的`userid`，分别对应发送者和接收者。`done`字段为标记消息是否已读的字段。

#### 1）、返回信息标准

##### ①、用户所有消息列表

```json
[{
  "notice":{
    "id": "{noticeid}",
    "title": "{title}",
    "createdAt": "{createdAt}",
    "course": {
      "id": "{courseid}",
      "cid": "{cid}",
      "name": "{name}",
      "teachers": {
        "id": "{teacherid}",
        "uid": "{uid}",
        "name": "{name}",
        "avatar": "{avatar}"
      }
    }
  },
  "from":{
    "id": "{userid}",
    "nickname": "{nickname}",
    "avatar": "{avatar}"
  },
  "to": "{userid}",
  "done": "{done}"
}]
```

##### ②、用户某条具体消息

```json
{
  "notice":{
    "id": "{noticeid}",
    "title": "{title}",
    "content": "{content}",
    "createdAt": "{createdAt}",
    "course": {
      "id": "{courseid}",
      "cid": "{cid}",
      "name": "{name}",
      "teachers": {
        "id": "{teacherid}",
        "uid": "{uid}",
        "name": "{name}",
        "avatar": "{avatar}"
      }
    }
  },
  "from":{
    "id": "{userid}",
    "nickname": "{nickname}",
    "avatar": "{avatar}"
  },
  "to": "{userid}",
  "done": "{done}"
}
```

#### 2）、获取用户收件箱的所有消息

`get` `/api/notices/inbox`

需登录

返回`2305`，`用户所有消息列表`。

#### 3）、获取用户发件箱的所有消息

`get` `/api/notices/outbox`

需登录

返回`2306`，`用户所有消息列表`。

#### 4）、获取用户的某一条接收的消息

`get` `/api/notices/inbox/:noticeid`

需登录，获取的消息需要是用户拥有的

返回`2301`，`用户某条具体消息`。

#### 5）、获取用户的某一条接收的消息

`get` `/api/notices/outbox/:noticeid`

需登录，获取的消息需要是用户拥有的

返回`2301`，`用户某条具体消息`。

#### 6）、标记某条接收的消息已读

`get` `/api/notices/inbox/:noticeid/done`

需登录，标记的消息需要是用户所有的

返回`2302`。

#### 7）、删除某条接收的消息

`delete` `/api/notices/inbox/:noticeid`

需登录，删除的消息需要是用户所有的

返回`2303`。

#### 8）、向某用户发送消息

`post` `/api/users/:userid/notice`

需登录，使用到的用户需存在并且启用

发送`{ title, content }`。

返回`2304`。

### 3、课程相关

#### 0）、Schema

##### ①、Course Schema

```javascript
const schema = {
  /* 
   * - - - - - - - - 用户元信息 - - - - - - - -
   * cid        课程号
   * name       课程名
   * intros     课程简介
   * teachers   教师id
   * courseTimes课程时间
   * deleted    是否已被删除
   * - - - - - - - - - - - - - - - - - - - - -
   */
  cid: { type: String, index: true },
  name: { type: String },
  intros: { type: String },
  teachers: { type: [Schema.Types.ObjectId], ref: 'User' },
  courseTimes: { type: [Schema.Types.ObjectId], ref: 'CourseTime' },
  deleted: { type: Boolean, default: false }
};
```

##### ②、Course Time Schema

```javascript
const schema = {
  course: { type: Schema.Types.ObjectId, ref: 'Course' },
  // 上课地点
  location: { type: String },

  // 按照学校上课的标准来
  // weekday = 5, rows = [3,4,5] 就是周五的三四五节课
  term: { type: String },         // 学年，比如'2016-1' 即2016学年第一学期
  week: { type: Number },         // 第几周
  weekday: { type: Number },      // 1,2,3,4,5,6,7 分别代表周一、周二……周日
  rows: [{ type: Number }],       // 1,2,3,……,12 分别代表第一、第二……第十二节课

  remark: { type: String },       // 备注
  createdAt: { type: Date, default: new Date() },
  deleted: { type: Boolean, default: false }
};
```

##### ③、User Course Relation Schema

```javascript
const schema = {
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  course: { type: Schema.Types.ObjectId, ref: 'Course' },
  createdAt: { type: Date, default: new Date },
  deleted: { type: Boolean, default: false }
};
```

##### ④、Course Attend Schema

```javascript
const schema = {
  course: { type: Schema.Types.ObjectId, index: true, ref: 'Course' },
  courseTime: { type: Schema.Types.ObjectId, index: true, ref: 'CourseTime' },
  createdAt: { type: Date, default: new Date() },
  enable: { type: Boolean, default: false },
  enableStart: { type: Date },
  enableEnd: { type: Date },
};
```

##### ⑤、Course Attend Remark Schema

```javascript
const schema = {
  course: { type: Schema.Types.ObjectId, index: true, ref: 'Course' },
  courseTime: { type: Schema.Types.ObjectId, index: true, ref: 'CourseTime' },
  courseAttend: { type: Schema.Types.ObjectId, index: true, ref: 'CourseAttend' },
  createdAt: { type: Date, default: new Date() }
};
```

#### ⑥、Course Time Leave Schema

```javascript
const schema = {
  reason: { type: String },
  user: { type: Schema.Types.ObjectId, index: true, ref: 'User' },
  course: { type: Schema.Types.ObjectId, index: true, ref: 'Course' },
  courseTime: { type: Schema.Types.ObjectId, index: true, ref: 'CourseTime' },
  createdAt: { type: Date, default: new Date() },
  allow: { type: Boolean, default: false },
  allowBy: { type: Schema.Types.ObjectId, index: true, ref: 'User' },
  allowInfo: { type: String },
  deleted: { type: Boolean, default: false }
};
```

#### 1）、返回信息标准

##### ①、课表结构

```json
{
  "2016-2": {
    1: {
      5: [
        { 
          "coursetimeid": "{id}",
          "course": {
            "id": "{courseid}",
            "cid": "{cid}",
            "name": "{name}",
            "teachers": [{
              "id": "{teacherid}",
              "uid": "{uid}",
              "name": "{name}",
              "avatar": "{avatar}"
            }]
          },
          "rows": [],
          "location": "{location}",
          "remark": "{remark}"
        }
      ]
    }
  }
}
```

课表结构释义：表结构按照以下形式布置，`table[term][week][weekday]`，即`table['2016-2'][8][3]`为2016学年第二学期第八周周三的课。注意了，`table[term][week][weekday]`所拿到的是一个数组对象，这个对象里面的内容即为一个课程时间单位，即模型`Course Time`。

使用这样的课表结构有许多好处。例如获取一周的课表（假定是2016学年第二学期第三周的课表）：

```json
{
  "2016-2":{
    3:{
      1:[
        { 
          "coursetimeid": "1234ABCD1234ABCD",
          "course": {
            "id": "1234ABCD1234ABCD",
            "cid": "A123456-1",
            "name": "数据结构",
            "teachers": [{
              "id": "1234ABCD1234ABCD",
              "uid": "11111",
              "name": "张三",
              "avatar": "http://www.baidu.com/avatar.png"
            }]
          },
          "rows": [1,2],
          "location": "七教北楼101",
          "remark": "小测验不要忘记了哟"
        },
        { 
          "coursetimeid": "1234ABCD1234ABCD",
          "course": {
            "id": "1234ABCD1234ABCD",
            "cid": "A123456-1",
            "name": "编译原理",
            "teachers": [{
              "id": "1234ABCD1234ABCD",
              "uid": "22222",
              "name": "李四",
              "avatar": "http://www.baidu.com/avatar.png"
            }]
          },
          "rows": [3,4,5],
          "location": "七教北楼103",
          "remark": "请不要旷课！"
        },
      ],
      2:[
        { 
          "coursetimeid": "1234ABCD1234ABCD",
          "course": {
            "id": "1234ABCD1234ABCD",
            "cid": "A123456-1",
            "name": "生命与自然",
            "teachers": [{
              "id": "1234ABCD1234ABCD",
              "uid": "33333",
              "name": "王五",
              "avatar": "http://www.baidu.com/avatar.png"
            }]
          },
          "rows": [6,7],
          "location": "六教中楼321",
          "remark": "课堂上严禁谈情说爱"
        }
      ],
      4:[
        { 
          "coursetimeid": "1234ABCD1234ABCD",
          "course": {
            "id": "1234ABCD1234ABCD",
            "cid": "A123456-1",
            "name": "编译原理",
            "teachers": [{
              "id": "1234ABCD1234ABCD",
              "uid": "22222",
              "name": "李四",
              "avatar": "http://www.baidu.com/avatar.png"
            }]
          },
          "rows": [3,4,5],
          "location": "三教南楼105",
          "remark": "请不要旷课！"
        }
      ]
    }
  }
}
```

上面的课表具有清晰简洁的特征，也非常适合程序获取信息后将课程填充到视图中。

#### 2）、获取某一课程信息

`get` `/api/courses/:courseid`

#### 3）、获取用户参加的某一课程的具体信息

`get` `/api/courses/:courseid/detail`

需登录为学生，需参加该课程

#### 4）、获取用户参加的某一课程的上课时间

`get` `/api/courses/:courseid/course-times`

需登录为学生，需参加该课程

#### 5）、获取用户参加的某一课程的某次上课时间

需登录为学生，需参加该课程，需课程与课程时间相关联

`get` `/api/courses/:courseid/course-times/:coursetimeid`

#### 6）、为某节课某一次课程的某次上课时间请假

`post` `/api/courses/:courseid/course-times/:coursetimeid/askforleave`

需登录为学生，需参加该课程，需课程与课程时间相关联

发送`{ reason }`。

返回`2204`。

#### 7）、学生查询某节课的所有请假条

`get` `/api/courses/:courseid/askforleave`

需登录为学生，需参加该课程

返回`2205`，`标准请假条对象组`。

#### 8）、学生查询某节课的所有教师群发消息

`get` `/api/course/:courseid/notices`

返回`2305`，`标准消息组`。

### 4、教师相关

#### 0）、Schema

#### 1）、返回信息标准

##### ①、课程对象

见课程相关部分的返回信息标准。

##### ②、课程表

见课程相关部分的返回信息标准。

##### ③、课程时间

见课程相关部分的返回信息标准。

#### 2）、教师添加课程

`post` `/api/teacher-management/courses`

需登录为教师。

发送`{ cid, name, intros, teachers }`

返回`3001`，`课程对象`。

#### 3）、教师修改某课程

`put` `/api/teacher-management/courses/:courseid`

需登录为教师，需执教该课程。

发送`{ cid, name, intros, teachers }`

返回`3002`，`课程对象`。

#### 4）、教师删除某课程

`delete` `/api/teacher-management/courses/:courseid`

需登录为教师，需执教该课程。

返回`3003`。

#### 5）、教师针对某课程群发通知

`post` `/api/teacher-management/courses/:courseid/notice`

需登录为教师，需执教该课程。

发送`{ title, content }`。

返回`3004`。

#### 6）、教师针对某课程获取所有上课时间

`get` `/api/teacher-management/courses/:courseid/course-times`

需登录为教师，需执教该课程。

返回`3006`，`课程表`。

#### 7）、教师针对某课程添加上课时间

`post` `/api/teacher-management/courses/:courseid/course-times`

需登录为教师，需执教该课程。

发送`[{location, term, week, weekday, rows, remark}]`。

返回`3005`。

#### 8）、教师针对某课程获得某上课时间

`get` `/api/teacher-management/courses/:courseid/course-times/:coursetimeid`

需登录为教师，需执教该课程，课程时间需与课程相关联。

返回`3009`，`课程时间`。

#### 9）、教师针对某课程修改某上课时间

`put` `/api/teacher-management/courses/:courseid/course-times/:coursetimeid`

需登录为教师，需执教该课程，课程时间需与课程相关联。

发送`{location, term, week, weekday, rows, remark}`。

返回`3008`，`课程时间`。

#### 10）、教师删除某课程的某上课时间

`delete` `/api/teacher-management/courses/:courseid/course-times/:coursetimeid`

需登录为教师，需执教该课程，课程时间需与课程相关联。

返回`3007`。

#### 11）、教师查询某节课的所有教师群发消息

`get` `/api/teacher-management/course/:courseid/notices`

需登录为教师，需执教该课程。

返回`3010`，`标准消息组`。