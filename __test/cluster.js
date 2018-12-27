const cluster = require('cluster');
const http = require('http');

if (cluster.isMaster) {

  const numCPUs = require('os').cpus().length;
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

} else {

  // Worker processes have a http server.
  http.Server((req, res) => {
    res.writeHead(200);
    res.end('hello world\n');
  }).listen(8011);
}
