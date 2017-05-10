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
    if (userid && userid != localStorage.userid) {
        $.get("../api/users/" + userid, function (data) {
            if (data.code != 2100) {
                alert(data.message);
                return
            }
            document.title = data.body.nickname;
            $("#title_imagine").attr("src", data.body.avatar);

            if (data.body.name) $("#username").text(data.body.name);
            else $(".username").hide();

            if (data.body.uid) $("#uid").text(data.body.uid);
            else $(".uid").hide();

            if (data.body.gender != undefined) {
                switch (data.body.gender) {
                    case 0: $("#sex").text('保密'); break;
                    case 1: $("#sex").text('男'); break;
                    case 2: $("#sex").text('女'); break;
                    default: $("#sex").hide();
                }
            } else $(".sex").hide();

            if (data.body.authority != undefined) {
                switch (data.body.authority) {
                    case 0: $("#identity").text('未认证'); break;
                    case 1: $("#identity").text('学生'); break;
                    case 10: $("#identity").text('教师'); break;
                    case 100: $("#identity").text('管理员'); break;
                    default: $("#identity").hide();
                }
            } else $(".identity").hide();

            if (data.body.nickname) $("#nickname").text(data.body.nickname);
            else $(".nickname").hide();

            if (data.body.description) $("#description").text(data.body.description);
            else $(".description").hide();

            if (data.body.university) $("#university").text(data.body.university);
            else $(".university").hide();

            if (data.body.school) $("#school").text(data.body.school);
            else $(".school").hide();

            if (data.body.province) $("#province").text(data.body.province);
            else $(".province").hide();

            if (data.body.city) $("#city").text(data.body.city);
            else $(".city").hide();

            if (data.body.telephone) $("#telephone").text(data.body.telephone);
            else $(".telephone").hide();

            if (data.body.wechat) $("#wechat").text(data.body.wechat);
            else $(".wechat").hide();

            if (data.body.email) $("#email").text(data.body.email);
            else $(".email").hide();
        });
    }
    else {
        $.get('../api/profile', function (data) {
            if (data.code != 2000) {
                alert(data.message);
                return;
            }

            $("#title_imagine").attr("src", data.body.avatar);

            if (data.body.name) $("#username").text(data.body.name);
            else $(".username").hide();

            if (data.body.uid) $("#uid").text(data.body.uid);
            else $(".uid").hide();

            if (data.body.gender != undefined) {
                switch (data.body.gender) {
                    case 0: $("#sex").text('保密'); break;
                    case 1: $("#sex").text('男'); break;
                    case 2: $("#sex").text('女'); break;
                    default: $("#sex").hide();
                }
            } else $(".sex").hide();

            if (data.body.authority != undefined) {
                switch (data.body.authority) {
                    case 0: $("#identity").text('未认证'); break;
                    case 1: $("#identity").text('学生'); break;
                    case 10: $("#identity").text('教师'); break;
                    case 100: $("#identity").text('管理员'); break;
                    default: $("#identity").hide();
                }
            } else $(".identity").hide();

            if (data.body.description) $("#description").text(data.body.description);
            else $(".description").hide();

            if (data.body.university) $("#university").text(data.body.university);
            else $(".university").hide();

            if (data.body.school) $("#school").text(data.body.school);
            else $(".school").hide();

            if (data.body.province) $("#province").text(data.body.province);
            else $(".province").hide();

            if (data.body.city) $("#city").text(data.body.city);
            else $(".city").hide();

            if (data.body.telephone) $("#telephone").text(data.body.telephone);
            else $(".telephone").hide();

            if (data.body.wechat) $("#wechat").text(data.body.wechat);
            else $(".wechat").hide();

            if (data.body.email) $("#email").text(data.body.email);
            else $(".email").hide();
        });
    }
};
