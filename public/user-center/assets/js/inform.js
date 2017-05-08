window.onload = function () {
    //教务通知
    $.get("http://courseclouds.zhmoll.com/api/courses/" + localStorage.courseid + "/notices", function (data1) {
        if (data1.code == 2305) {
            alert(data1.message);
            for (i = 0; i < data1.body.length; i++) {
                name=data1.body[i].notice.course.name;
                title = data1.body[i].notice.title;
                createdAt = data1.body[i].notice.createdAt;
                from = data1.body[i].from.nickname;
                $("#div1").append("<ul class=" + "ul1" + " id='ul2'" + "> <li class=" + "ui-border-t " + "id=" + "li1" + "> <p><span>" + "课程名：" + name + "。" + "</span><span class=" + "date>" + "发件人：" + from + "</span></p><h4>" + "消息：" + title + "</h4></li></ul>");
                $(".ul1").addClass("ui-list ui-list-pure ui-border-tb");
            }

        }
        else {
            $("#div1").append("<ul class=" + "ul1" + " id='ul2'" + "> <li class=" + "ui-border-t " + "id=" + "li1" + "> <p><span>" + "</span><span class=" + "date>" + "</span></p><h4>" + "无消息" + "</h4></li></ul>");
            $(".ul1").addClass("ui-list ui-list-pure ui-border-tb");
            alert(data1.message);

        }

    })
    $(".ul1").css({
        "margin-bottom": 0 + "px"
    })
    //假条通知
    $.get("../api/courses/" + localStorage.courseid + "/askforleave", function (data1) {
        if (data1.code == 2205) {
            alert(data1.message);
            for (i = 0; i < data1.body.length; i++) {
                id = data1.body[i].id;
                reason = data1.body[i].reason;
                course = data1.body[i].courseTime.weekday;
                courseid = data1.body[i].course;
                allow = data1.body[i].allow;
                allowby = data1.body[i].allowBy;
                $("#div2").append("<ul class=" + "ul2" + " id='ul2'" + "> <li class=" + "ui-border-t " + "id=" + "li1" + "> <p><span>" + "课程名：" + courseid + "。" + "</span><span class=" + "date>" + "请假原因：" + reason + "</span></p><h4>" + "是否批准:" + allow + "；批准人：" + allowby + "</h4></li></ul>");
                $(".ul2").addClass("ui-list ui-list-pure ui-border-tb");
            }

        }
        else {
            $("#div2").append("<ul class=" + "ul1" + " id='ul2'" + "> <li class=" + "ui-border-t " + "id=" + "li1" + "> <p><span>" + "</span><span class=" + "date>" + "</span></p><h4>" + "无消息" + "</h4></li></ul>");
            $(".ul1").addClass("ui-list ui-list-pure ui-border-tb");
            alert(data1.message);

        }
    })
    $(".ul2").css({
        "margin-bottom": 0 + "px"
    })

    localStorage.courseid='';
};