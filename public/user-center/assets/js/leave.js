window.onload = function () {
    if (localStorage.signin) {
        $("#name").text(localStorage.name);
    }
    else {
        $("#name").text('');
    }
    $.get("../api/profile/askforleave",function (data) {
        if(data.code!=2205){
            alert(data.message)
        }
        else {
            for(i=0;i<data.body.length;i++)
            {
                console.log(data.body[i]);
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
                            $("#myleave").prepend('<li class="ui-border-t"><p><span>课程名：</span><span class="date">' + "数据结构" + '</span></p> <p><span>上课时间：</span><span class="date">  第' + coursetimes.week + '周 ' + weekday + ' 第' + coursetimes.rows.join(',') + '节' + '</span></p> <p><span>请假原因：</span><span class="date">' + reason + '</span></p><p><span>请假时间：</span><span class="date">' + time + '</span></p><p><span style="color: red">已允许</span></p><p><span >允许人：</span><span>' + teachername + '</span></p></li>')
                        })
                    }
                    else {
                        $("#myleave").prepend('<li class="ui-border-t"><p><span>课程名：</span><span class="date">' + "数据结构" + '</span></p> <p><span>上课时间：</span><span class="date"> 第' + coursetimes.week + '周 ' + weekday + ' 第' + coursetimes.rows.join(',') + '节' + '</span></p> <p><span>请假原因：</span><span class="date">' + reason + '</span></p><p><span>请假时间：</span><span class="date">' + time + '</span></p><p><span style="color: red">已拒绝</span></p></li>')
                    }
                }
                else {
                    $("#myleave").prepend('<li class="ui-border-t"><p><span>课程名：</span><span class="date">' + "数据结构" + '</span></p> <p><span>上课时间：</span><span class="date">  第' + coursetimes.week + '周 ' + weekday + ' 第' + coursetimes.rows.join(',') + '节' + '</span></p> <p><span>请假原因：</span><span class="date">' + reason + '</span></p><p><span>请假时间：</span><span class="date">' + time + '</span></p><p><span style="color: red">未处理</span></p></li>')
                }
            }
        }
    })
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
                        $("#myleave").prepend('<li class="ui-border-t"><p><span>课程名：</span><span class="date">' + coursename_full + '</span></p> <p><span>上课时间：</span><span class="date">  第' + coursetimes.week + '周 ' + weekday + ' 第' + coursetimes.rows.join(',') + '节' + '</span></p> <p><span>请假原因：</span><span class="date">' + reason + '</span></p><p><span>请假时间：</span><span class="date">' + time + '</span></p><p><span style="color: red">已允许</span></p><p><span >允许人：</span><span>' + teachername + '</span></p></li>')
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

    //发件箱
    $.get("../api/profile/askforleave", function (data) {
        if(data.code==2205){
            for(i=0;i<data.body.length;i++)
            {
                course=data.body[i].course.name;
                coursetime=data.body[i].courseTime.rows.join(",");
                reason=data.body[i].reason;
                allow=data.body[i].allow;
                allowby=data.body[i].allowby;
                $("#div1").append("<ul class=" + "ul1" + " id='ul2'" + "> <li class=" + "ui-border-t " + "id=" + "li1" + "> <p><span>" + "课程名：" + course + "。" + "</span><span class=" + "date>" + "请假原因：" + reason + "</span></p><h4>" + "是否批准:" + allow + "；批准人：" + allowby + "</h4></li></ul>");
                $(".ul1").addClass("ui-list ui-list-pure ui-border-tb");
            }
        }
        else {
            $("#div1").append("<ul class=" + "ul1" + " id='ul2'" + "> <li class=" + "ui-border-t " + "id=" + "li1" + "> <p><span>" + "</span><span class=" + "date>" + "</span></p><h4>" + "无消息" + "</h4></li></ul>");
            $(".ul1").addClass("ui-list ui-list-pure ui-border-tb");
            alert(data.message);

        }

    })
    $(".ul1").css({
        "margin-bottom": 0 + "px"
    })
};