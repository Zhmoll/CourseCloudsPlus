
//判断是手机端还是web端
function IsPC() {
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
var flag = IsPC(); //true为PC端，false为手机端


week();//课程函数

$(".course").click(function () {
    localStorage.courseid=this.eq(0).attr('id');
})

function week() {
    var $oTd = $("#1td");
    $.get("http://courseclouds.zhmoll.com/api/term/currentWeek",course_get);
    $.get("http://courseclouds.zhmoll.com/api/profile/coursetimes",data_course);
    alert(data_course.message);
    var getcourse = course_get.body;//课程信息数组
    var weeknum = data_course.body.week;//当前周数
    var yearnum = data_course.body.term;//当前学期


    var weeknum_string = weeknum.toString();

    var weekday = new Date().getDay();
    if (weekday == 0) {
        weekday = 7;
    }
    var $aTh = $("#tr th:not('#2th')");
    var dayNum = weeknum;   //将周数的初始化赋值为后台传来的当前周数
    var year = yearnum;


    //定义颜色
    var colorArr1 = ['rgb(255,125,84)', 'rgb(0,143,209)', 'rgb(255, 177,54)', 'rgb(245,72,130)', 'rgb(255,75,90)', 'rgb(180,89,212)', 'rgb(0,179,190)', 'rgb(44,110,213)', 'rgb(0,173,95)', 'rgb(255,131,0)', 'rgb(241,70,78)', 'rgb(196,65,163)', 'rgb(255,195,56)', 'rgb(222,48,119)', 'rgb(254,91,94)', 'rgb(128,88,189)', 'rgb(66,114,215)', 'rgb(0,181,233)', 'rgb(0,178,111)', 'rgb(87,184,70)', 'rgb(255,224,72)', 'rgb(255,137,47)', 'rgb(255,95,61)', 'rgb(228,93,39)', 'rgb(255,169,48)', 'rgb(255,115,133)', 'rgb(118, 190,172)', 'rgb(147, 206, 97)', 'rgb(217,144,181)', 'rgb(97, 189, 230)', 'rgb(238, 196, 115)', 'rgb(138, 216, 162)', 'rgb(202, 165, 158)', 'rgb(222, 196, 145)', 'rgb(97, 189, 230)', 'rgb(134, 167, 234)', 'rgb(165, 156, 219)', 'rgb(118, 190,172)', 'rgb(147, 206, 97)', 'rgb(217,144,181)', 'rgb(97, 189, 230)', 'rgb(238, 196, 115)', 'rgb(138, 216, 162)', 'rgb(202, 165, 158)', 'rgb(145, 180, 215)', 'rgb(222, 196, 145)'];

    //创建课程浮层
    function addCourse(day, col, num, course, color, teacher,id) {
        //参数:day指周几, col指从第几节课开始,num指几节课,course指什么课
        var oDiv = $('<div></div>');
        $(oDiv).attr('id', id);
        $(oDiv).attr("class",'course');
        var oP = $('<p></p>');
        //var oSpanWeekDay = $('<span id=oSpanWeekDay></span>');
        var oSpanSelectcode = $('<span id=oSpanSelectcode></span>');
        var oSpanTeacher = $('<span id=oSpanTeacher></span>');
        $aTh.width(0.15 * $(window).width());//课表的宽度

        //$aTh.eq(weekday-1).css("width",0.30*$(window).width());//当天的课表宽度
        var left = $aTh.eq(day - 1).offset().left;//课表到页边左距离
        if (!flag) {
            oDiv.css({

                'backgroundColor': color,

                "position": "absolute",

                'left': left,

                "font-size": "1px",

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
                oP.css('fontSize', '4px');
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

    var colorNum = 0;

    //建立整周课表
    function reCourse() {
        var dataObj = getcourse;		//接收课表数据
        //alert(dataObj[year][dayNum]);
        $("#select").val(weeknum_string);

        $("#selected option").each(function () {
            if ($(this).val() == weeknum_string) {
                $(this).attr("selected", true);
            }
        });

        for (var i = 1; i < 8; i++) {	//循环周几
            if (dataObj[year][dayNum][i]) {

                var t = dataObj[year][dayNum][i].length;

                for (var j = 0; j < t; j++) {	//循环第几节课

                    var iCourse = dataObj[year][dayNum][i][j]['course']["name"] + '#' + dataObj[year][dayNum][i][j]['course']["teachers"][0]["name"] + '@' + dataObj[year][dayNum][i][j]['location'];

                    var id=dataObj[year][dayNum][i][j]['course']["id"];

                    var weekday = i;

                    var teacher = dataObj[year][dayNum][i][j]['course']['teachers']["name"];

                    var iCol = parseInt(dataObj[year][dayNum][i][j]['rows'][0]);

                    //var Selectcode = dataObj[i][j]['selectcode'];

                    var iNum = dataObj[year][dayNum][i][j]['rows'].length;
                    //alert("success10")

                    addCourse(weekday, iCol, iNum, iCourse, colorArr1[colorNum], teacher,id);
                    //alert("success1")
                    colorNum++;
                    if (colorNum == 25) {
                        colorNum = 0;
                    }
                }
            }
        }

    }

    reCourse();

    //动态调整课程框宽度
    $(window).resize(function () {

        var $aDiv = $("#div1");

        $aDiv.html('');  //id = div1

        reCourse();

    });

    //点击菜单选项
    $("#selected").on("change", function () {

        var $aDiv = $("#div1");

        $aDiv.html('');  //id = div1 将aDiv用空白覆盖

        var num = parseInt($("option:selected", this).val());

        dayNum = num;
        reCourse();

    });
}