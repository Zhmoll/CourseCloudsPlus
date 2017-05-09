window.onload = function () {
    $("#name").text(localStorage.name);
    var url="url(" + localStorage.profile + ")";
    $("#title_imagine").style = {"background-image": url};
};