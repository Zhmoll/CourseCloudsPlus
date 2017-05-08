/**
 * Created by Administrator on 2017-5-7.
 */
window.onload=function () {
    $("#submit").click(function () {
        if($("#week").val()!=''&&$("#course-location").val()!=''&&$("#term").val()!=''&&$("#weekday").val()!=''&&$("#rows").val()!=''){
            var week=$("#week").val().replace(/[^0-9]/ig,"");
            var weekday=$("#weekday").val().replace(/[^0-9]/ig,"");
            if(weekday=='7')
                weekday='0';
            var strs=$("#rows").val().split(","); //字符分割
            for (i=0;i<strs.length ;i++ )
            {
                rows[i]=parseInt(strs[i]); //分割后的字符输出
                alert(typeof rows[i]);
            }
            $.post("http://courseclouds.zhmoll.com/api/teacher-management/courses/"+localStorage.courseid+"/course-times",{"location":$("#course-location").val(),"term":$("#term").val(),"week":week,"weekday":weekday,"rows":rows,"remark":''},function (data) {
                if(data.code==3005){
                    alert(data.message);
                    localStorage.courseid='';
                    window.location.href="index.html";
                }
                else alert(data.message);
            })
        }
        else alert("请填写所有选项");
    })
};