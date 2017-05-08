$(document).ready(function () {
  $('button').click(function () {
    var university = $('#university').val();
    var uid = $('#uid').val();
    var password = $('#password').val()
    $.post('../api/users/login', {
      university: university,
      uid: uid,
      password: password
    }, function (data, status) {
      console.log(data);
      alert(data.message);
    });
  });
});