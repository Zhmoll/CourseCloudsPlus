function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return decodeURI(r[2]);
    return null;
}
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
    var userid = getQueryString('userid');
    if (userid != localStorage.id) {
        $.get("../api/users/" + userid, function (data) {
            if (data.code != 2100) {
                alert(data.message);
                return
            }
            $("#title_imagine").attr("src", data.body.avatar);
            if (data.body && data.body.name) {
                $("#username").text(data.body.name);
            }
            else {
                $("#username").text("未公开");
            }

            if (data.body && data.body.nickname) {
                $("#nickname").text(data.body.nickname);
            }
            else {
                $("#nickname").text("未公开");
            }

            if (data.body && data.body.school) {
                $("#school").text(data.body.school);
            }
            else {
                $("#school").text("未公开");
            }

            if (data.body && data.body.uid) {
                $("#uid").text(data.body.uid);
            }
            else {
                $("#uid").text("未公开");
            }

            if (data.body && data.body.university) {
                $("#university").text(data.body.university);
            }
            else {
                $("#university").text("未公开");
            }

            if (data.body && data.body.description) {
                $("#description").text(data.body.description);
            }
            else {
                $("#description").text("未公开");
            }
        });
    }
    else {
        $.get('../api/profile', function (data) {
            if (data.code != 2000) {
                alert(data.message);
                return;
            }
            if (data.body && data.body.name) {
                $("#username").text(data.body.name);
            }
            else {
                $("#username").text("未填写");
            }

            if (data.body && data.body.nickname) {
                $("#nickname").text(data.body.nickname);
            }
            else {
                $("#nickname").text("未填写");
            }

            if (data.body && data.body.school) {
                $("#school").text(data.body.school);
            }
            else {
                $("#school").text("未填写");
            }

            if (data.body && data.body.uid) {
                $("#uid").text(data.body.uid);
            }
            else {
                $("#uid").text("未填写");
            }

            if (data.body && data.body.university) {
                $("#university").text(data.body.university);
            }
            else {
                $("#university").text("未填写");
            }

            if (data.body && data.body.description) {
                $("#description").text(data.body.description);
            }
            else {
                $("#description").text("未填写");
            }
        });
    }
}