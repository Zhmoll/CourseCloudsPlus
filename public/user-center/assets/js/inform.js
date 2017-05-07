//class=" + "ui-list"+"&nbsp"+"ui-list-pure"+"ui-border-tb" +"&nbsp"+ "
window.onload = function () {
    $.post("http://courseclouds.zhmoll.com/api/users/login", {
        "university": "杭州电子科技大学",
        "password": 14051534,
        "uid": 14051534
    }, function (data) {
        if (data.code == 2005) {
            alert(data.message + "data.message");
            $.get("http://courseclouds.zhmoll.com/api/notices/inbox", function (data1) {
                if (data1.code == 2306) {
                    alert(data1.message);
                    jQuery.each(data1, function (i, j) {
                        //alert('success');
                        var title = j.notice.title;
                        var date = j.notice.course.teacher.name;//date未定义
                        var inform = j.notice.course.name;//inform未定义
                        //addInform(title,date,inform);
                        $("#div1").append("<ul class=" + "ul1"+" id='ul2'" + "> <li class=" + "ui-border-t " + "id=" + "li1" + "> <p><span>"+title+"</span><span class=" + "date>"+date+"</span></p><h4>"+inform+"</h4></li></ul>");
                        $(".ul1").addClass("ui-list ui-list-pure ui-border-tb");
                    });

                }
                else
                    alert(data1.message);
            })
        }
        else
            alert(data.message);
        $(".ul1").css({
            "margin-bottom":0+"px"
        })
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