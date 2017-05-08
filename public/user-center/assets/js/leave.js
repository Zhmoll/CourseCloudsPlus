window.onload = function () {
    if (localStorage.signin) {
        $("#name").text(localStorage.name);
    }
    else {
        $("#name").text('');
    }
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