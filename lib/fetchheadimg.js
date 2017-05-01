const fs = require('fs');
const request = require('request');

function fetchheadimg(url, callback) {
  // let suffix = '';
  // const filename = 
  // request
  //   .get(url)
  //   .on('response', function (response) {
  //     suffix = response.headers['content-type'].split('/')[1];
  //   })
  //   .pipe(fs.createWriteStream('../public/img/avatar/doodle.png'))
  callback(null, url);
}

module.exports = fetchheadimg;