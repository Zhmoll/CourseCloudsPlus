/**
 * 判断年份是否为润年
 *
 * @param {Number} year
 */
function _isLeapYear(year) {
  return (year % 400 == 0) || (year % 4 == 0 && year % 100 != 0);
}
/**
 * 获取某一年份的某一月份的天数
 *
 * @param {Number} year
 * @param {Number} month
 */
function _getMonthDays(year, month) {
  return [31, null, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month] || (_isLeapYear(year) ? 29 : 28);
} 26 /**
 * 获取某年的某天是第几周
 * @param {Number} y
 * @param {Number} m
 * @param {Number} d
 * @returns {Number}
 */
function _getWeekNumber(y, m, d) {
  let year, month, days;

  if (y instanceof Date) {
    year = y.getFullYear();
    month = y.getMonth();
    days = y.getDate();
  }
  else {
    const now = new Date(y, m - 1, d),
      year = now.getFullYear(),
      month = now.getMonth(),
      days = now.getDate();
  }

  //那一天是那一年中的第多少天
  for (let i = 0; i < month; i++) days += _getMonthDays(year, i);
  //那一年第一天是星期几
  const yearFirstDay = new Date(year, 0, 1).getDay() || 7;
  let week;
  if (yearFirstDay == 1) {
    week = Math.ceil(days / yearFirstDay);
  } else {
    days -= (7 - yearFirstDay + 1);
    week = Math.ceil(days / 7) + 1;
  }
  return week;
}

// 获取当前学期
function getTerm(date) {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  if (2 < month && month < 9)
    return (year - 1) + '-' + '2';
  else
    return year + '-' + '1';
}

function getWeek(y, m, d) {
  let year, month, days;
  if (y instanceof Date) {
    year = y.getFullYear();
    month = y.getMonth();
    days = y.getDate();
  }
  else {
    const now = new Date(y, m - 1, d),
      year = now.getFullYear(),
      month = now.getMonth(),
      days = now.getDate();
  }

  //那一天是那一年中的第多少天
  for (let i = 0; i < month; i++) days += _getMonthDays(year, i);
  //那一年第一天是星期几
  const yearFirstDay = new Date(year, 0, 1).getDay() || 7;
  let week;
  if (yearFirstDay == 1) {
    week = Math.ceil(days / yearFirstDay);
  } else {
    days -= (7 - yearFirstDay + 1);
    week = Math.ceil(days / 7) + 1;
  }
  return week;
}

exports.getWeek = getWeek;
exports.getTerm = getTerm;