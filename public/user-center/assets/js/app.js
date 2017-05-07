(function ($) {
    'use strict';
    $(function () {
        var $fullText = $('.admin-fullText');
        $('#admin-fullscreen').on('click', function () {
            $.AMUI.fullscreen.toggle();
        });
        $(document).on($.AMUI.fullscreen.raw.fullscreenchange, function () {
            $fullText.text($.AMUI.fullscreen.isFullscreen ? '退出全屏' : '开启全屏');
        });
    });
})(jQuery);



document.getElementById(password).onclick(function () {
    return check();

})

function check()
{
    if (document.getElementById("password").value==""){
        alert("请输入登录密码!");
        return false;
    }
    if (document.getElementById("repassword").value==""==""){
        alert("请输入重复密码!");
        return false;
    }
    if (document.getElementById("password").value!=document.getElementById("repassword").value){
        alert("对不起!重复密码不等于登录密码");
        return false;
    }
    return true;
}

function KeyUp() {
    var a = $('#password').val();
    //alert(a);
    var b = $('#repassword').val();
    //alert(b);
    if (a == b) {
        $('#btnSave').removeAttr('disabled');
        $(function() {
            $('#my-popover').open.popover.amui({
                content: 'Popover via JavaScript'
            })
        });
    }
    else {

    }
}(jQuery);