const http = require('http');
const fs = require('fs');

// Worker processes have a http server.
http.createServer((req, res) => {

  const rs = fs.createReadStream(__dirname+'/tenpaycert.dmg');

  console.log('req');

  rs.pipe(res);

}).listen(8011);
