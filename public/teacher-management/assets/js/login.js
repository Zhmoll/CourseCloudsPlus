/**
 * Created by Administrator on 2017-5-8.
 */
window.onload = function () {
    $("#submit").click(function () {
        if ($("#user-name").val() == '' || $("#user-password").val() == '') {
            alert("用户名和密码不能为空");
            return;
        }
        var data = {
            "university": $('#selected option:selected').val(),
            "uid": $("#user-name").val(),
            "password": $("#user-password").val()
        };
        $.post("http://courseclouds.zhmoll.com/api/users/login", data, function (data1, state) {
            if (data1.code == 2005) {
                alert(data1.message);
                localStorage.signin=1;
                localStorage.id=data1.body.id;
                localStorage.name = data1.body.name;
                localStorage.nickname = data1.body.nickname;
                localStorage.profile=data1.body.avatar;
                window.location.href = "index.html";
            }
            else alert(data1.message);
        })
    })
};
