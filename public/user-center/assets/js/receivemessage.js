function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return decodeURI(r[2]);
    return null;
}
window.onload = function () {
    $("#name").text(localStorage.name);
    $("#name").click(function () {
        window.location.href = 'profile.html?userid=' + localStorage.userid;
    });
    var noticeid = getQueryString('noticeid');
    if (noticeid) {
        // 显示单个信件
        $.get('../api/notices/inbox/' + noticeid, function (data) {
            if (data.code != 2301) {
                $("#div1").append("<ul class=" + "ul1" + " id='ul2'" + "> <li class=" + "ui-border-t " + "id=" + "li1" + "> <p><span>" + "</span><span class=" + "date>" + "</span></p><h4>" + "找不到该消息" + "</h4></li></ul>");
                $(".ul1").addClass("ui-list ui-list-pure ui-border-tb");
                alert(data1.message);
                return;
            }
            var element = '<ul class="ul1" id="ul2">';

            var title = data.body.notice.title;
            var content = data.body.notice.content;
            var time = moment(data.body.notice.createdAt).format('YY年MM月DD日 HH:mm:ss');

            element += '<li class="ui-border-t">标题：' + title + '</li>';
            element += '<li class="ui-border-t">时间：' + time + '</li>';
            element += '<li class="ui-border-t">内容：</li>';
            element += '<li class="ui-border-t"><p>' + content + '</p></li>';
            var course = data.body.notice.course;
            var from_name = data.body.notice.from.nickname;
            var from_id = data.body.notice.from.id;
            var from_avatar = data.body.notice.from.avatar;
            if (course) {
                // 如果信件是由教师群发的
                for (var i = 0; i < course.teachers.length; i++) {
                    if (course.teachers[i].id == from_id) from_name = course.teachers[i].name;
                }
                element += '<li class="ui-border-t"><span>课程：<a href="http://courseclouds.zhmoll.com/user-center/inform.html?courseid='
                    + data.body.notice.course._id + '">' + data.body.notice.course.cid + ' - '
                    + data.body.notice.course.name + '</a></span></li>';
            }
            element += '<li class="ui-border-t"><span>来自：<a href="http://courseclouds.zhmoll.com/user-center/profile.html?userid='
                + from_id + '">' + from_name + '</a></span></li>';
            element += '</ul>';
            $('#top_title').hide();
            $("#div1").append(element);
            $(".ul1").addClass("ui-list ui-list-pure ui-border-tb");
        });
    }
    else {
        // 显示收件箱
        $.get("../api/notices/inbox", function (data) {
            if (data.code != 2305) {
                $("#div1").append("<ul class=" + "ul1" + " id='ul2'" + "> <li class=" + "ui-border-t " + "id=" + "li1" + "> <p><span>" + "</span><span class=" + "date>" + "</span></p><h4>" + "无消息" + "</h4></li></ul>");
                $(".ul1").addClass("ui-list ui-list-pure ui-border-tb");
                alert(data1.message);
                return;
            }
            var notices = data.body;
            var element = '<ul class="ul1" id="ul2">';

            notices.forEach(function (notice) {
                var item = '<li class="ui-border-t">';
                var title = notice.title;
                var time = moment(notice.createdAt).format('YY年MM月DD日 HH:mm:ss');
                item += '<span><a href="http://courseclouds.zhmoll.com/user-center/receivemessage.html?noticeid=' + notice._id + '">标题：' + title + '</a></span><br />';
                item += '<span>时间：' + time + '</span><br />';
                var course = notice.course;
                var from_name = notice.from.nickname;
                var from_id = notice.from.id;
                var from_avatar = notice.from.avatar;
                if (course) {
                    // 如果信件是由教师群发的
                    for (var i = 0; i < course.teachers.length; i++) {
                        if (course.teachers[i].id == from_id) from_name = course.teachers[i].name;
                    }
                    item += '<span>课程：<a href="http://courseclouds.zhmoll.com/user-center/inform.html?courseid='
                        + course._id + '">' + course.cid + ' - ' + course.name + '</a></span><br />';
                }
                item += '<span>来自：<a href="http://courseclouds.zhmoll.com/user-center/profile.html?userid='
                    + from_id + '">' + from_name + '</a></span><br />';
                item += '</li>';
                element += item;
            });
            element += '</ul>';
            $("#div1").append(element);
            $(".ul1").addClass("ui-list ui-list-pure ui-border-tb");
        });
    }
    $(".ul1").css({
        "margin-bottom": 0 + "px"
    });
};