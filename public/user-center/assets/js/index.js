document.ready=function () {
    if (typeof(localStorage.signin) == "undefined") {
        window.location.href = "register.html";
        alert("请先登录");
    }
    else {
        if (localStorage.signin==0) {
            window.location.href = "register.html";
        }
    }
    if(localStorage.signin)
    {
        $("#name").text(localStorage.name);
    }
    else {
        $("#name").text('');
    }
};