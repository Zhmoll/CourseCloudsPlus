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
        $("#username").text(data.body.name);
        $("#nickname").text(data.body.nickname);
        $("#school").text(data.body.school);
        $("#uid").text(data.body.uid);
        $("#university").text(data.body.university);
    })
};
