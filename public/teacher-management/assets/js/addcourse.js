window.onload=function () {
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
    $("#submit").click(function () {
        if($("#course-id").val()!=''&&$("#course-name").val()!=''){
            $.post("../api/teacher-management/courses",{"cid":$("#course-id").val(),"name":$("#course-name").val(),"intros":$("#course-intros").val()},function (data) {
                console.log(data.body);
                if(data.code==3001){
                    alert(data.message);
                    console.log(data.body);
                    window.location.href="addcoursedetail.html?courseid="+data.body._id;
                }
                else alert(data.message);
            })
        }
        else alert("请填写所有选项");
    })
};