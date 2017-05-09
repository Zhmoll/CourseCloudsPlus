var course_id
var coursetimeid
function getQueryString(name) {
    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
    var r = window.location.search.substr(1).match(reg);
    if (r != null) {
        return unescape(r[2]);
    }
    return null;
}
coursetimeid = getQueryString("coursetimeid")
course_id = getQueryString("course");
$(document).ready(function () {

    $("#name").text(localStorage.name);
    $("#profile").attr("src", localStorage.profile);
    $("#loginout").click(function () {
        $.get("../api/users/logout", function (data) {
            if (data.code == 2006) {
                localStorage.signin = 0;
                window.location.href = "login.html";
            }
            else {
                localStorage.signin = 0;
                window.location.href = "login.html";
            }
        })
    });
    if (course_id == null) {
        window.location.href = "index.html";
    }
    //alert(course_id);
    $("#leave").click(function () {
        $('html, body').animate({
            scrollTop: $("#leave_body").offset().top
        }, 200);
    });
    $("#inform").click(function () {
        $('html, body').animate({
            scrollTop: $("#inform_body").offset().top
        }, 200);
    });
    $("#select").click(function () {
        $('html, body').animate({
            scrollTop: $("#select_body").offset().top
        }, 200);
    });

    $("#delete").click(function () {
        $.ajax({
            url: '/api/teacher-management/courses/' + course_id + '/course-times/' + coursetimeid,
            type: 'delete',
            dataType: 'json',
            success: function (data, status) {
                alert(data.message);
            }
        })
    });
    $("#sign").click(function () {
        $.post("/api/teacher-management/courses/" + course_id + "/attends-check", {}, function (data) {
            $('#sign_picture').html('');
            $('#sign_picture').qrcode(data.body.content);
            $("#download").click(function () {
                $.get("../api/teacher-management/course/" + course_id + "/attends-check/" + data.body.content)
            })
            //alert(data.body.content);
        })
    });

    $.get("../api/courses/" + course_id, function (data1) {

        var coursename = data1.body.name;
        $.get("../api/teacher-management/courses/" + course_id + "/course-times/" + coursetimeid, function (data) {
            if (data.code == 3009) {
                $("#course_name").text(coursename + "。");
                $("#course_time").text("第" + data.body.weekday + "周 " + "第" + data.body.rows.join(",") + "节");
                $("#location").text(data.body.location);
            }
            else {
                window.location.href = "index.html";
            }
        })
    })


    $.get("../api/teacher-management/courses/" + course_id + "/askforleave", function (data1) {
        if (data1.code == 3012) {
            console.log(data1.body)
            for (i = 0; i < data1.body.length; i++) {

                var name = data1.body[i].user.name;
                //var course=data1.body[i].course.name.
                var weekday_str = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
                var data = "第" + data1.body[i].courseTime.week + "周 " + weekday_str[data1.body[i].courseTime.weekday] + " 第" + data1.body[i].courseTime.rows.join(",") + "节";
                var id = data1.body[i]._id;
                var reason = data1.body[i].reason
                if (data1.body[i].responsed) {
                    if (data1.body[i].allow) {
                        var responsed = "已同意"
                        $("#list_leave").append("<tr class=" + "gradeX" + "> <td class=" + "am-text-middle" + ">" + name + "</td><td class=" + "am-text-middle" + ">" + data + "</td> <td class=" + "am-text-middle" + ">" + reason + "</td>  <td class=" + "am-text-middle" + ">" + responsed + "</td> </tr>");
                        $(".ul1").addClass("ui-list ui-list-pure ui-border-tb");
                    }
                    else {
                        var responsed = "已拒绝";
                        $("#list_leave").append("<tr class=" + "gradeX" + "> <td class=" + "am-text-middle" + ">" + name + "</td><td class=" + "am-text-middle" + ">" + data + "</td> <td class=" + "am-text-middle" + ">" + reason + "</td>  <td class=" + "am-text-middle" + ">" + responsed + "</td> </tr>");
                        $(".ul1").addClass("ui-list ui-list-pure ui-border-tb");
                    }
                }

                else {
                    $('#list_leave').append('<tr class="gradeX"><td class="am-text-middle">' + name + '</td><td class="am-text-middle">' + data + '</td> <td class="am-text-middle">' + reason + '</td> <td class="am-text-middle"> <div class="tpl-table-black-operation" id="' + id + '"> <a class="yes" mycourse="' + id + '"> <i class="am-icon-pencil">' + '</i> 同意 </a><a class="no tpl-table-black-operation-del" mycourse="' + id + '" > <i class="am-icon-trash"></i> 拒绝 </a> </div> </td> </tr>');
                    // $("#list_leave").append("<tr class=" + "gradeX" + "> <td class=" + "am-text-middle" + ">" + name + "</td><td class=" + "am-text-middle" + ">" + data + "</td> <td class=" + "am-text-middle" + ">" + reason + "</td>  <td class=" + "am-text-middle" + "> <div class=" + "tpl-table-black-operation"  + "> <a " + "class=''"+"> <i class=" + "am-icon-pencil"+" yes" + " value=" + id + "></i> 同意 </a> <a " +"class=''"+ "class=" + "no tpl-table-black-operation-del" + "> <i class=" + "am-icon-trash" + " value=" + id + "></i> 拒绝 </a> </div> </td> </tr>");
                    $(".ul1").addClass("ui-list ui-list-pure ui-border-tb");
                }
            }
        }
        else
            alert(data1.message + "2");
        $(".ul1").css({
            "margin-bottom": 0 + "px"
        })
        //同意假条
        $(".yes").click(function () {
            var leaveid = $(this).attr("mycourse");
            //alert(leaveid+";"+course_id);
            $.post("../api/teacher-management/courses/" + course_id + "/askforleave/" + leaveid + "/allow", { "allow": true }, function (data) {
                $('#' + leaveid).html("");
                $('#' + leaveid).html(data.message);
            })
        });
        //拒绝假条
        $(".no").click(function () {
            var leaveid = $(this).attr("mycourse");
            $.post("../api/teacher-management/courses/" + course_id + "/askforleave/" + leaveid + "/allow", { "allow": false }, function (data) {
                $('#' + leaveid).html("");
                $('#' + leaveid).html(data.message);
            })
        })
    });


    //发送通知
    $("#form_send").click(function () {
        var title = $("#form_send_title").val();
        $.post("../api/teacher-management/courses/" + course_id + "/notices", {
            "title": title,
            "content": $("#form_send_detigal").val()
        }, function (data) {
            alert(data.message);
            location.reload();
        })
    });
    $("#submit").click(function () {
        $.ajax({
            url: '../api/teacher-management/courses/' + course_id + '/course-times/' + coursetimeid,
            type: 'put',
            data: {
                "location": $("#course-location").val(),
                "term": $("#term").val(),
                "week": $("#week").val().replace(/[^0-9]/ig, ""),
                "weekday": $("#weekday").val().replace(/[^0-9]/ig, "") == 7 ? 0 : $("#weekday").val().replace(/[^0-9]/ig, ""),
                "rows": $("#rows").val().split(","),
                "remark": ''
            },
            dataType: 'json',
            success: function (data, status) {
                alert(data.message);
            }
        })
    })

});