function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return decodeURI(r[2]);
    return null;
}
window.onload = function () {
    $("#name").text(localStorage.name);
    // $("#title_imagine").attr("src",localStorage.profile);
    var userid = getQueryString('userid');
    $.get("../api/users/"+userid,function (data) {
        if(data.code!=2100){
            alert(data.message);
            return
        }
        console.log(data.body);
        $("#title_imagine").attr("src",data.body.avatar);
        if(data.body.name!='')
        {
            $("#username").text(data.body.name);
        }
        else {
            $("#username").text("未公开");
        }
        if(data.body.name!='')
        {
            $("#nickname").text(data.body.nickname);

        }
        else {
            $("#nickname").text("未公开");
        }
        if(data.body.name!='')
        {
            $("#school").text(data.body.school);

        }
        else {
            $("#school").text("未公开");
        }
        if(data.body.name!='')
        {
            $("#uid").text(data.body.uid);

        }
        else {
            $("#uid").text("未公开");
        }
        if(data.body.name!='')
        {
            $("#university").text(data.body.university);
        }
        else {
            $("#university").text("未公开");
        }



    })
};
