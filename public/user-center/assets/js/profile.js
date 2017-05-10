window.onload = function () {
    $("#name").text(localStorage.name);
    $("#title_imagine").attr("src",localStorage.profile);
};
