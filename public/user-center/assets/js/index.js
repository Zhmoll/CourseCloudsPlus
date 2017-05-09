window.onload = function () {
    $("#name").text(localStorage.name);
    $(".title_imagine").css = {"background-image": "url(" + localStorage.profile + ")"};
};