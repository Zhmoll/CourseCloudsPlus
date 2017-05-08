
window.onload = function () {
    $.get("/api/courses/"+localStorage.courseid+"/askforleave", function (data1) {
        if (data1.code == 2205) {
            alert(data1.message);
            for(i=0;i<data1.body.length;i++)
            {
                id=data1.body[i].id;
                reason=data1.body[i].reason;
                course=data1.body[i].courseTime.weekday;
                courseid=data1.body[i].course;
                allow=data1.body[i].allow;
                allowby=data1.body[i].allowBy;
                $("#div2").append("<ul class=" + "ul2" + " id='ul2'" + "> <li class=" + "ui-border-t " + "id=" + "li1" + "> <p><span>" + "原因："+reason + "</span><span class=" + "date>" +"课程名："+ courseid + "</span></p><h4>" + inform + "</h4></li></ul>");
                $("#div2").append("<ul class=" + "ul1" + " id='ul2'" + "> <li class=" + "ui-border-t " + "id=" + "li1" + "> <p><span>" + "课程名："+courseid +"。"+ "</span><span class=" + "date>" +"请假原因："+ reason + "</span></p><h4>" + "是否批准:" + allow+"；批准人："+allowby+"</h4></li></ul>");
                $(".ul2").addClass("ui-list ui-list-pure ui-border-tb");
            }

        }
        else
            alert(data1.message);
    })
    $(".ul2").css({
        "margin-bottom": 0 + "px"
    })
};

// else
// {
//     alert(data.message);
//     window.location.href='register.html';
// }
// var data = [{
//     'notice': {
//         'title': '五一放假',
//         'date': "五月一日",
//         'inform': "全体师生五一放假"
//     }
// }, {
//     'notice': {
//         'title': '六一放假',
//         'date': "五月一日",
//         'inform': "全体师生五一放假"
//     }
// },
//     {
//         'notice': {
//             'title': '七一放假',
//             'date': "五月一日",
//             'inform': "全体师生五一放假"
//         }
//     }];