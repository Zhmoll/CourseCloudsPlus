window.onload = function () {
    $("#name").text(localStorage.name);
    $("#name").click(function () {
        window.location.href='profile.html?userid='+localStorage.userid;
    })
    $("#title_imagine").click(function () {
        window.location.href='profile.html?userid='+localStorage.userid;
    })
    $("#title_imagine").attr("src",localStorage.profile);
};