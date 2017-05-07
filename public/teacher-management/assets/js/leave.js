window.onload = function () {
    
    $.post("http://courseclouds.zhmoll.com/api/users/login", {
        "university": "杭州电子科技大学",
        "password": 14051534,
        "uid": 14051534
    }, function (data) {
        if (data.code == 2005) {
            //alert(data.message + "data.message");
            $.get("http://courseclouds.zhmoll.com//api/profile/askforleave", function (data1) {
                if (data1.code == 2205) {
                    jQuery.each(data1, function (i, j) {
                        //alert('success');
                        var title = j.notice.title;
                        var date = j.notice.course.teacher.name;//date未定义
                        var inform = j.notice.course.name;//inform未定义
                        //addInform(title,date,inform);
                        $("#list_leave").append("<tr class="+"gradeX"+"> <td class="+"am-text-middle"+">Amaze UI 模式窗口</td> <td class="+"am-text-middle"+">张鹏飞</td> <td class="+"am-text-middle"+">2016-09-26</td> <td class="+"am-text-middle"+"> <div class="+"tpl-table-black-operation"+"> <a href="+"javascript:;"+"> <i class="+"am-icon-pencil"+"></i> 同意 </a> <a href="+"javascript:;"+"class="+"tpl-table-black-operation-del"+"> <i class="+"am-icon-trash"+"></i> 拒绝 </a> </div> </td> </tr>");
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
    $("#loginout").click(function () {

    })
};
// $("#list_leave").append("<tr class="+"gradeX"+"> <td class="+"am-text-middle"+">Amaze UI 模式窗口</td> <td class="+"am-text-middle"+">张鹏飞</td> <td class="+"am-text-middle"+">2016-09-26</td> <td class="+"am-text-middle"+"> <div class="+"tpl-table-black-operation"+"> <a href="+"javascript:;"+"> <i class="+"am-icon-pencil"+"></i> 同意 </a> <a href="+"javascript:; "+"class="+"tpl-table-black-operation-del"+"> <i class="+"am-icon-trash"+"></i> 拒绝 </a> </div> </td> </tr>");