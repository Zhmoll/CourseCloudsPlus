function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return decodeURI(r[2]);
    return null;
}

window.onload = function () {
    var courseid = getQueryString('courseid');
    // 获取课程详情
    $.get('../api/courses/' + courseid, function (data, status) {
        if (data.code != 2200) {
            alert(data.message);
            console.log(data);
            return;
        }
        var course = data.body;
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
        // course: 
        // location: 
        // term: 
        // week: 
        // weekday: 
        // rows: 
        // remark: 
        // createdAt: 
    });
    // 获取历史通知
    $.get("../api/courses/" + courseid + "/notices", function (data) {
        if (data.code != 2307) {
            alert(data.message);
            console.log(data);
            return;
        }
        // if (data1.code == 2307) {
        //     var notices = data1.body;
        //     for (var i = 0; i < notices.length; i++) {
        //         var notice = notices[i];
        //         var name = ' notice.name;';
        //         var title = notice.title;
        //         var createdAt = notice.createdAt;
        //         var from = notice.from.name;
        //         $("#div1").append("<ul class=" + "ul1" + " id='ul2'" + "> <li class=" + "ui-border-t " + "id=" + "li1" + "> <p><span>" + "课程名：" + name + "。" + "</span><span class=" + "date>" + "发件人：" + from + "</span></p><h4>" + "消息：" + title + "</h4></li></ul>");
        //         $(".ul1").addClass("ui-list ui-list-pure ui-border-tb");
        //     }
        // }
        // else {
        //     $("#div1").append("<ul class=" + "ul1" + " id='ul2'" + "> <li class=" + "ui-border-t " + "id=" + "li1" + "> <p><span>" + "</span><span class=" + "date>" + "</span></p><h4>" + "无消息" + "</h4></li></ul>");
        //     $(".ul1").addClass("ui-list ui-list-pure ui-border-tb");
        //     alert(data1.message);
        // }
    });
    $(".ul1").css({
        "margin-bottom": 0 + "px"
    })
    // 获取假条反馈
    $.get("../api/courses/" + courseid + "/askforleave", function (data) {
        if (data.code != 2205) {
            alert(data.message);
            console.log(data);
            return;
        }
        // if (data1.code == 2205) {
        //     for (i = 0; i < data1.body.length; i++) {
        //         id = data1.body[i].id;
        //         reason = data1.body[i].reason;
        //         course = data1.body[i].courseTime.weekday;
        //         courseid = data1.body[i].course;
        //         allow = data1.body[i].allow;
        //         allowby = data1.body[i].allowBy;
        //         $("#div2").append("<ul class=" + "ul2" + " id='ul2'" + "> <li class=" + "ui-border-t " + "id=" + "li1" + "> <p><span>" + "课程名：" + courseid + "。" + "</span><span class=" + "date>" + "请假原因：" + reason + "</span></p><h4>" + "是否批准:" + allow + "；批准人：" + allowby + "</h4></li></ul>");
        //         $(".ul2").addClass("ui-list ui-list-pure ui-border-tb");
        //     }
        // }
        // else {
        //     $("#div2").append("<ul class=" + "ul1" + " id='ul2'" + "> <li class=" + "ui-border-t " + "id=" + "li1" + "> <p><span>" + "</span><span class=" + "date>" + "</span></p><h4>" + "暂无请假条" + "</h4></li></ul>");
        //     $(".ul1").addClass("ui-list ui-list-pure ui-border-tb");
        //     alert(data1.message);
        // }
    })
    $(".ul2").css({
        "margin-bottom": 0 + "px"
    });
};