document.ready=function () {
    if(localStorage.signin)
    {
        $("#name").text(localStorage.name);
    }
    else {
        $("#name").text('');
    }
};