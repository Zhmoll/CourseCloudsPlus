window.onload = function () {
    if (localStorage.signin) {
        $("#name").text(localStorage.name);
    }
    else {
        $("#name").text('');
    }
    //发件箱
    $.get("../api/notices/outbox", function (data1) {
        if (data1.code == 2305) {
            alert(data1.message);
            for (i = 0; i < data1.body.length; i++) {
                id = data1.body[i].notice.id;
                $.get("http://courseclouds.zhmoll.com/api/notices/outbox/" + id, function (data2) {
                    name = data2.body.notice.course.name;
                    content = data2.body.notice.content;
                    to = data2.body.to[0].nickname;
                    $("#div1").append("<ul class=" + "ul1" + " id='ul2'" + "> <li class=" + "ui-border-t " + "id=" + "li1" + "> <p><span>" + "课程名：" + name + "。" + "</span><span class=" + "date>" + "接受人：" + to + "</span></p><h4>" + "消息：" + content + "</h4></li></ul>");
                    $(".ul1").addClass("ui-list ui-list-pure ui-border-tb");
                })

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
};