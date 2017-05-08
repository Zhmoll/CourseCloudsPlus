window.onload=function () {
    $("#submit").click(function () {
        if($("#course-id").val()!=''&&$("#course-name").val()!=''&&$("#teacher-name").val()!=''){
            $.post("http://courseclouds.zhmoll.com/api/teacher-management/courses",{"cid":$("#course-id").val(),"name":$("#course-name").val(),"intros":$("#course-intros").val(),"teachers":$("#teacher-name").val()},function (data) {
                if(data.code==3001){
                    alert(data.message);
                    localStorage.courseid=$("#course-id").val();
                    window.location.href="addcoursedetail.html";
                }
                else alert(data.message);
            })
        }
        else alert("请填写所有选项");
    })
};