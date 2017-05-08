$(document).ready(function () {
  $('button').click(function () {
    var university = $('#university').text();
    var uid = $('#uid').text();
    var password = $('#password').text()
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