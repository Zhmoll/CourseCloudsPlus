window.onload = function () {
    $("#name").text(localStorage.name);
    $(".title_imagine").css = {"background-image": "url(" + localStorage.profile + ")"};
    $("#course").click(function () {
        window.location.href='course.html'
    })
};