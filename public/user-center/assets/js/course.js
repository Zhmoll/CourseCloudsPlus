var $oTd = $("#1td");
var $aTh = $("#tr th:not('#2th')");

var choose_term;
var choose_week;
var courses;

$(document).ready(function () {
  $.get("../api/term/currentWeek", function (current_week_time, status) {
    if (current_week_time && current_week_time.code != 2007) {
      alert(current_week_time.message);
      return;
    }
    $.get("../api/profile/coursetimes", function (data, status) {
      if (data && data.code != 2207) {
        alert(data.message);
        return;
      }
      courses = data.body;
      var to_weekday = (current_week_time.body.weekday == 0) ? 7 : (current_week_time.body.weekday);
      var to_week = current_week_time.body.week;
      var to_term = current_week_time.body.term;
      choose_term = to_term;
      choose_week = to_week;
        $("select option[value='"+to_week+"']").attr("select","selected");
      reCourse(choose_term, choose_week);
      $(".course").click(function () {
        localStorage.courseid=this.attr("id");
        window.location.href="inform.html";
      })
    });
  });

});

//创建课程浮层
function addCourse(day, col, num, course, color, teacher, id) {
  var today = new Date();
  var weekday = today.getDay() == 0 ? 7 : today.getDay();
  //参数:day指周几, col指从第几节课开始,num指几节课,course指什么课
  var oDiv = $('<div></div>');
  $(oDiv).attr('id', id);
  $(oDiv).attr("class", 'course');
  var oP = $('<p></p>');
  //var oSpanWeekDay = $('<span id=oSpanWeekDay></span>');
  var oSpanSelectcode = $('<span id=oSpanSelectcode></span>');
  var oSpanTeacher = $('<span id=oSpanTeacher></span>');
  $aTh.width(0.15 * $(window).width());//课表的宽度
  //$aTh.eq(weekday-1).css("width",0.30*$(window).width());//当天的课表宽度
  var left = $aTh.eq(day - 1).offset().left;//课表到页边左距离
  if (!isPC()) {
    oDiv.css({
      'backgroundColor': color,
      "position": "absolute",
      'left': left,
      "font-size": "10px",
      'top': $("#1td").offset().top + 2 + ($("#1td").height() + 10.2) * (col - 1) + 'px'
    });
    oDiv.width($aTh.width() + 11);//某节课的宽度
    if (num == 2)
      oDiv.height(num * ($oTd.height()) + 20.8);//某节课的高度
    else
      oDiv.height(num * ($oTd.height()) + 31);//某节课的高度
    oDiv.addClass('course');
    oP.html(course);
    oSpanSelectcode.css('position', 'absolute');
    oSpanSelectcode.css('text-indent', '-999px');
    oSpanTeacher.text(teacher);
    oSpanTeacher.css('position', 'absolute');
    oSpanTeacher.css('text-indent', '-999px');
    $('#div1').append(oDiv);
    oDiv.append(oP);
    //oDiv.append(oSpanCol);
    $(oDiv).append(oSpanTeacher);
    $(oDiv).append(oSpanSelectcode);
    if (day == weekday) {
      oP.css('fontSize', '12px');
    }
    oP.css('paddingTop', parseInt((oDiv.height() - oP.height()) / 2) + 'px');
  }
  else {
    oDiv.css({
      'backgroundColor': color,
      "position": "absolute",
      'left': left,
      "font-size": "1px",
      'top': $("#1td").offset().top + 2 + ($("#1td").height() + 7.5) * (col - 1) + 'px'
    });
    if (col == 1) {
      oDiv.css("top", $("#1td").offset().top + ($("#1td").height() + 7.5) * (col - 1) + 'px')
    }
    oDiv.width($aTh.width() + 9.2);//某节课的宽度
    if (num == 2 && col != 1) {
      oDiv.height(num * ($oTd.height()) + 15.9);//某节课的高度
      oDiv.css("top", $("#1td").offset().top + 5 + ($("#1td").height() + 7.5) * (col - 1) + 'px');
    }
    else
      oDiv.height(num * ($oTd.height()) + 26);//某节课的高度
    oDiv.addClass('course');
    oP.html(course);
    oSpanSelectcode.css('position', 'absolute');
    oSpanSelectcode.css('text-indent', '-999px');
    oSpanTeacher.text(teacher);
    oSpanTeacher.css('position', 'absolute');
    oSpanTeacher.css('text-indent', '-999px');
    $('#div1').append(oDiv);
    oDiv.append(oP);
    //oDiv.append(oSpanCol);
    $(oDiv).append(oSpanTeacher);
    $(oDiv).append(oSpanSelectcode);
    oP.css('paddingTop', parseInt((oDiv.height() - oP.height()) / 2) + 'px');
  }
}

function isPC() {
  var userAgentInfo = navigator.userAgent;
  var Agents = ["Android", "iPhone",
    "SymbianOS", "Windows Phone",
    "iPad", "iPod"];
  var flag = true;
  for (var v = 0; v < Agents.length; v++) {
    if (userAgentInfo.indexOf(Agents[v]) > 0) {
      flag = false;
      break;
    }
  }
  return flag;
}

// 点击菜单选项
$("#selected").on("change", function () {
  var $aDiv = $("#div1");
  $aDiv.html('');  //id = div1 将aDiv用空白覆盖
  choose_week = parseInt($("option:selected", this).val());
  reCourse(choose_term, choose_week);
});

//动态调整课程框宽度
$(window).resize(function () {
  var $aDiv = $("#div1");
  $aDiv.html('');  //id = div1
  reCourse(choose_term, choose_week);
});

// 画课
function reCourse(term, week) {
  //定义颜色
  var colorArr1 = ['rgb(255,125,84)', 'rgb(0,143,209)', 'rgb(255, 177,54)', 'rgb(245,72,130)', 'rgb(255,75,90)', 'rgb(180,89,212)', 'rgb(0,179,190)', 'rgb(44,110,213)', 'rgb(0,173,95)', 'rgb(255,131,0)', 'rgb(241,70,78)', 'rgb(196,65,163)', 'rgb(255,195,56)', 'rgb(222,48,119)', 'rgb(254,91,94)', 'rgb(128,88,189)', 'rgb(66,114,215)', 'rgb(0,181,233)', 'rgb(0,178,111)', 'rgb(87,184,70)', 'rgb(255,224,72)', 'rgb(255,137,47)', 'rgb(255,95,61)', 'rgb(228,93,39)', 'rgb(255,169,48)', 'rgb(255,115,133)', 'rgb(118, 190,172)', 'rgb(147, 206, 97)', 'rgb(217,144,181)', 'rgb(97, 189, 230)', 'rgb(238, 196, 115)', 'rgb(138, 216, 162)', 'rgb(202, 165, 158)', 'rgb(222, 196, 145)', 'rgb(97, 189, 230)', 'rgb(134, 167, 234)', 'rgb(165, 156, 219)', 'rgb(118, 190,172)', 'rgb(147, 206, 97)', 'rgb(217,144,181)', 'rgb(97, 189, 230)', 'rgb(238, 196, 115)', 'rgb(138, 216, 162)', 'rgb(202, 165, 158)', 'rgb(145, 180, 215)', 'rgb(222, 196, 145)'];
  var colorNum = 0;
  for (var i = 0; i < 7; i++) {	//循环周几
    if (courses[term] && courses[term][week] && courses[term][week][i]) {
      var today_courses = courses[term][week][i];
      var weekday = i == 0 ? 7 : i;
      for (var j = 0; j < today_courses.length; j++) {	//循环第几节课
        var current_course = today_courses[j];
        var teachers = [];
        current_course.course.teachers.forEach(function(teacher) {
          teachers.push(teacher.name);
        });
        var iCourse = current_course.course.name + '#' + teachers.toString() + '@' + current_course.location;
        var teacher = teachers.toString();
        var iCol = parseInt(current_course['rows'][0]);
        var iNum = current_course['rows'].length;
        var id = current_course.course.id;
        addCourse(weekday, iCol, iNum, iCourse, colorArr1[colorNum], teacher, id);
        colorNum++;
        if (colorNum == 25) colorNum = 0;
      }
    }
  }
}