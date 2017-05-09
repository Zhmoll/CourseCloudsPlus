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
        $.post("../api/users/login", data, function (data1, state) {
            if (data1.code == 2005) {
                if (data1.body.authority < 10) {
                    return alert('请确保你有登录教师管理平台的权限');
                }
                localStorage.signin = true;
                localStorage.id = data1.body.id;
                localStorage.name = data1.body.name;
                localStorage.nickname = data1.body.nickname;
                localStorage.profile = data1.body.avatar;
                window.location.href = 'index.html';
            }
            else {
                alert(data1.message+"2");
            }
        });
    });
};
