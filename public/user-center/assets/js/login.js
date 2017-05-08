$(document).ready(function () {
  $('button').click(function () {
    $.post('../api/users/login', {
      university: $('#university').text(),
      uid: $('#uid').text(),
      password: $('#password').text()
    }, function (data, status) {
      console.log(data);
      alert(data.message);
    });
  });
});