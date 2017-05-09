$(document).ready(function (){
    $("#leave").click(function (){
        $('html, body').animate({
            scrollTop: $("#leave_body").offset().top
        }, 200);
    });
    $("#inform").click(function (){
        $('html, body').animate({
            scrollTop: $("#inform_body").offset().top
        }, 200);
    });
    $("#select").click(function (){
        $('html, body').animate({
            scrollTop: $("#select_body").offset().top
        }, 200);
    });
});