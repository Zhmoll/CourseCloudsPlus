function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return decodeURI(r[2]);
    return null;
}

document.ready = function click_button() {
    $("button").click(function cc() {
        //alert(getQueryString('code'));
        if (document.getElementById("id").value == '' || $("#password").val() == '') {
            alert("用户名和密码不能为空");
            return;
        }

        var data = {
            "uid": document.getElementById("id").value,
            "university": $('#selected option:selected').val(),
            "password": $("#password").val(),
            "code": getQueryString("code"),
            "state": getQueryString("state")
        };
        $.post("http://courseclouds.zhmoll.com/api/profile/wechat/bind", data, function (data, state) {
            if (data.code == 2003) {
                alert("绑定微信成功");
                localStorage.id = data.body.id;
                localStorage.name = data.body.name;
                localStorage.nickname = data.body.nickname;
                localStorage.signin = true;
                window.location.href = "index.html";
            }
            else alert(data.message);
        })
    })
}
;
