window.onload=function () {
    $("#submit").click(function () {
        if($("#course-id").val()!=''&&$("#course-name").val()!=''&&$("#teacher-name").val()!=''){
            $.post("http://courseclouds.zhmoll.com/api/teacher-management/courses",{"cid":$("#course-id").val(),"name":$("#course-name").val(),"intros":$("#course-intros").val(),"teacher":$("#teacher-name").val()})
        }
    })
};