var course_id
function getQueryString(name) {
    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
    var r = window.location.search.substr(1).match(reg);
    if (r != null) {
        return unescape(r[2]);
    }
    return null;
}
course_id = getQueryString("course");
$(document).ready(function () {
    if(course_id==null)
    {
        window.location.href("index.html");
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

    $.get("../api/teacher-management/courses/" + course_id + "/askforleave", function (data1) {
        if (data1.code == 3012) {
            console.log(data1.body)
            for (i = 0; i < data1.body.length; i++) {

                var name = data1.body[i].user.name;
                //var course=data1.body[i].course.name.
                var data = "第" + data1.body[i].courseTime.weekday + "周 " + "第" + data1.body[i].courseTime.rows.join(",") + "节"
                var id = data1.body[i]._id;
                alert(id);
                var reason = data1.body[i].reason
                if (data1.body[i].responsed) {
                    var responsed = "已经批准过了"
                    $("#list_leave").append("<tr class=" + "gradeX" + "> <td class=" + "am-text-middle" + ">" + name + "</td><td class=" + "am-text-middle" + ">" + data + "</td> <td class=" + "am-text-middle" + ">" + reason + "</td>  <td class=" + "am-text-middle" + ">" + responsed + "</td> </tr>");
                    $(".ul1").addClass("ui-list ui-list-pure ui-border-tb");
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
            $.post("../api/teacher-management/courses/" + course_id + "/askforleave/" + leaveid + "/allow", {"allow": true}, function (data) {
                $('#' + leaveid).html("");
                $('#' + leaveid).html(data.message);
            })
        });
        //拒绝假条
        $(".no").click(function () {
            var leaveid = $(this).attr("mycourse");
            $.post("../api/teacher-management/courses/" + course_id + "/askforleave/" + leaveid + "/allow", {"allow": true}, function (data) {
                $('#' + leaveid).html("");
                $('#' + leaveid).html(data.message);
            })
        })
    });

    //发送通知
    $("#form_send").click(function () {
        $.post()
        $("#form_send_detigal")
    })
});