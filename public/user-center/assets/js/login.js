$(document).ready(function () {
  $('button').click(function () {
    $.post('../api/users/login', {
      university: $('#user-university').text(),
      uid: $('#user-name').text(),
      password: $('#user-password').text()
    }, function (data, status) {
      console.log(data);
      alert(data.message);
    });
  });
});