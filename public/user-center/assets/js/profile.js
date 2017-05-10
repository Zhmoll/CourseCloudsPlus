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
        if(data.body.name==''||typeof data.body.name==undefined)
        {
            $("#username").text("未公开");

        }
        else {
            $("#username").text(data.body.name);
        }
        if(data.body.nickname==''||typeof data.body.nickname==undefined)
        {

            $("#nickname").text("未公开");
        }
        else {
            $("#nickname").text(data.body.nickname);
        }
        if(data.body.school==''||typeof data.body.school==undefined)
        {

            $("#school").text("未公开");
        }
        else {
            $("#school").text(data.body.school);
        }
        if(data.body.uid==''||typeof data.body.uid==undefined)
        {

            $("#uid").text("未公开");
        }
        else {
            $("#uid").text(data.body.uid);
        }
        if(data.body.university==''||typeof data.body.university==undefined)
        {

            $("#university").text("未公开");
        }
        else {
            $("#university").text(data.body.university);
        }



    })
};
