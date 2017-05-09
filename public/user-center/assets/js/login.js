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
      localStorage.signin = true;
      localStorage.userid = data.body.id;
      localStorage.avatar = data.body.avatar;
      localStorage.name = data.body.name;
      localStorage.nickname = data.body.nickname;
      localStorage.university = data.body.university;
      window.location.href = 'index.html';
    });
  });
});