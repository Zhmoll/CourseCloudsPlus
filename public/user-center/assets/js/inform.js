function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return decodeURI(r[2]);
    return null;
}
var coursename_full
window.onload = function () {
    $("#name").text(localStorage.name);
    var courseid = getQueryString('courseid');
    var coursetimeid = getQueryString('coursetimeid');
    // 获取课程详情
    $.get('../api/courses/' + courseid, function (data, status) {
        if (data.code != 2200) {
            alert(data.message);
            console.log(data);
            return;
        }
        var course = data.body;
        coursename_full = course.name;
        $("#courseid").text(course.cid);
        $("#coursename").text(course.name);
        $("#courseintros").text(course.intros);
        for (i = 0; i < course.teachers.length; i++) {
            console.log(course.teachers[i]);
            $("#teachername").append('<a href="profile.html?userid=' + course.teachers[i]._id + '">' + course.teachers[i].name + '</a> ');
        }
        // cid:
        // name:
        // intros:
        // teachers: 

    });
    // 获取上课时间
    $.get('../api/courses/' + courseid + '/course-times', function (data, status) {
        if (data.code != 2202) {
            alert(data.message);
            console.log(data);
            return;
        }
        var coursetimes = data.body; // 是数组
        for (i = 0; i < coursetimes.length; i++) {
            var weekday;
            switch (coursetimes[i].weekday) {
                case 0:
                    weekday = '周日';
                    break;
                case 1:
                    weekday = '周一';
                    break;
                case 2:
                    weekday = '周二';
                    break;
                case 3:
                    weekday = '周三';
                    break;
                case 4:
                    weekday = '周四';
                    break;
                case 5:
                    weekday = '周五';
                    break;
                case 6:
                    weekday = '周六';
                    break;
            }
            if (coursetimeid && coursetimes[i]._id == coursetimeid) {
                $("#coursetime").append('<p><span  style="color: red;">第' + coursetimes[i].week + '周 ' + weekday + ' 第' + coursetimes[i].rows.join(',') + '节</span> </p>');
            }
            else {
                $("#coursetime").append('<p><span >第' + coursetimes[i].week + '周 ' + weekday + ' 第' + coursetimes[i].rows.join(',') + '节</span> </p>');
            }
        }
    });
    // course:
    // location:
    // term:
    // week:
    // weekday:
    // rows:
    // remark:
    // createdAt:

    // 获取历史通知
    $.get("../api/courses/" + courseid + "/notices", function (data) {
        if (data.code != 2307) {
            alert(data.message);
            console.log(data);
            return;
        }
        var notices = data.body;
        notices.forEach(function (notice) {
            var noticeid = notice._id;
            var time = moment(notice.createdAt).format('YY年MM月DD日 HH:mm:ss');
            var title = notice.title;
            var sender_name = notice.from.name;
            var sender_id = notice.from._id;
            $("#coursemessage").append('<li class="ui-border-t"><p><span>标题：</span><a href="http://courseclouds.zhmoll.com/user-center/receivemessage.html?=noticeid=' + noticeid + '"><span class="date">' + title + '</span></a></p> <p><span>来自：</span><a href="http://courseclouds.zhmoll.com/user-center/profile.html?userid=' + sender_id + '"><span class="date">' + teacher + '</span></a></p><p><span>时间：</span><span class="date">' + time + '</span></p></li>')
        });
    });
    // 获取假条反馈
    $.get("../api/courses/" + courseid + "/askforleave", function (data) {
        if (data.code != 2205) {
            alert(data.message);
            // console.log(data);
            return;
        }
        for (i = 0; i < data.body.length; i++) {
            coursetimes = data.body[i].courseTime;
            var reason = data.body[i].reason;
            var time = data.body[i].createdAt;
            console.log(coursetimes);
            var weekday;
            var userid = data.body[i].allowBy;
            switch (coursetimes.weekday) {
                case 0:
                    weekday = '周日';
                    break;
                case 1:
                    weekday = '周一';
                    break;
                case 2:
                    weekday = '周二';
                    break;
                case 3:
                    weekday = '周三';
                    break;
                case 4:
                    weekday = '周四';
                    break;
                case 5:
                    weekday = '周五';
                    break;
                case 6:
                    weekday = '周六';
                    break;
            }
            if (data.body[i].responsed == true) {
                if (data.body[i].allow == true) {
                    $.get("../api/users/" + userid, function (data1) {
                        console.log(data1.body);
                        var teachername = data1.body.nickname;
                        $("#myleave").prepend('<li class="ui-border-t"><p><span>课程名：</span><span class="date">' + coursename_full + '</span></p> <p><span>上课时间：</span><span class="date">  第' + coursetimes.week + '周 ' + weekday + ' 第' + coursetimes.rows.join(',') + '节' + '</span></p> <p><span>请假原因：</span><span class="date">' + reason + '</span></p><p><span>请假时间：</span><span class="date">' + time + '</span></p><p><span style="color: green">已允许</span></p><p><span >允许人：</span><span>' + teachername + '</span></p></li>')
                    })
                }
                else {
                    $("#myleave").prepend('<li class="ui-border-t"><p><span>课程名：</span><span class="date">' + coursename_full + '</span></p> <p><span>上课时间：</span><span class="date"> 第' + coursetimes.week + '周 ' + weekday + ' 第' + coursetimes.rows.join(',') + '节' + '</span></p> <p><span>请假原因：</span><span class="date">' + reason + '</span></p><p><span>请假时间：</span><span class="date">' + time + '</span></p><p><span style="color: red">已拒绝</span></p></li>')
                }
            }
            else {
                $("#myleave").prepend('<li class="ui-border-t"><p><span>课程名：</span><span class="date">' + coursename_full + '</span></p> <p><span>上课时间：</span><span class="date">  第' + coursetimes.week + '周 ' + weekday + ' 第' + coursetimes.rows.join(',') + '节' + '</span></p> <p><span>请假原因：</span><span class="date">' + reason + '</span></p><p><span>请假时间：</span><span class="date">' + time + '</span></p><p><span style="color: red">未处理</span></p></li>')
            }
        }

    });
    $("#leave_click").click(function () {
        if (!coursetimeid) {
            return alert('请在课程表中选择指定上课时间进行请假！');
        }
        if ($("#leave_reason").val() != '') {
            //alert($("#leave_reason").val());
            $.post("../api/courses/" + courseid + "/course-times/" + coursetimeid + "/askforleave", { "reason": $("#leave_reason").val() }, function (data) {
                alert(data.message);
                location.reload();
            })
        }
        else {
            alert("请输入请假原因");
        }

    });

    // $(document).attr("title",coursename_full);
};
