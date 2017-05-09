function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return decodeURI(r[2]);
    return null;
}

window.onload = function () {
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
        $("#courseid").text(course.cid);
        $("#coursename").text(course.name);
        $("#courseintros").text(course.intros);
        for (i = 0; i < course.teachers.length; i++) {
            $("#teachername").append('<a src="profile.html?userid=' + course.teachers[i].id + '">' + course.teachers[i].name + '</a> ');
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
                case 0: weekday = '周日'; break;
                case 1: weekday = '周一'; break;
                case 2: weekday = '周二'; break;
                case 3: weekday = '周三'; break;
                case 4: weekday = '周四'; break;
                case 5: weekday = '周五'; break;
                case 6: weekday = '周六'; break;
            }
            var element = '<span class="data">第' + coursetimes[i].week + '周 ' + weekday + ' 第' + coursetimes[i].rows.join(',') + '节</span> ';
            if (coursetimes[i]._id == coursetimeid) {
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
    });
    // 获取假条反馈
    $.get("../api/courses/" + courseid + "/askforleave", function (data) {
        if (data.code != 2205) {
            alert(data.message);
            console.log(data);
            return;
        }
    });
};
