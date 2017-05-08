$(document).ready(function () {
  $('button').click(function () {
    $.post('../api/users/login', {
      university: '杭州电子科技大学',//$('#user-university').text(),
      uid: '14051534',//$('#user-name').text(),
      password: '14051534'//$('#user-password').text()
    }, function (data, status) {
      console.log(data);
      alert(data.message);
    });
  });
});