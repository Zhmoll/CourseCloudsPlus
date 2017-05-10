function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return decodeURI(r[2]);
    return null;
}
window.onload = function () {
    $("#name").text(localStorage.name);
    $("#title_imagine").attr("src",localStorage.profile);
    var userid = getQueryString('userid');
    $.get("../api/users/"+userid,function (data) {
        console.log(data.body);
    })
};
