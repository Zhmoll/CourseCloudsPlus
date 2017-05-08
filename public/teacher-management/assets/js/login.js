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

        if (localStorage.signin) {
            window.location.href = 'index.html';
            return;
        }

        $.post("../api/users/login", data, function (data, state) {
            if (data.code == 2005) {
                if (data.body.authority < 10) {
                    return alert('请确保你有登录教师管理平台的权限');
                }
                localStorage.signin = true;
                localStorage.id = data.body.id;
                localStorage.name = data.body.name;
                localStorage.nickname = data.body.nickname;
                localStorage.profile = data.body.avatar;
                window.location.href = 'index.html';
            }
            else {
                alert(data.message);
            }
        });
    });
};
