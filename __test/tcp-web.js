var net = require('net');
const crypto = require('crypto');

var PORT = 6969;

net.createServer(function(sock) {

    // 为这个socket实例添加一个"data"事件处理函数
    sock.on('data', function(data) {
        console.log(`${data}`);
        let k = String(data).match(/Sec-WebSocket-Key\:\s([\w\W]+?)\n/);
        k = k ? k[1] : '';
        k=k.substr(0, k.length - 1);
        sock.write('HTTP/1.1 101 Web Socket Protocol Handshake\r\n' +
                     'Upgrade: WebSocket\r\n' +
                     'Connection: Upgrade\r\n' +
                     'Sec-WebSocket-Accept: ' + crypto.createHash('sha1').update(k + '258EAFA5-E914-47DA-95CA-C5AB0DC85B11').digest('base64') + '\r\n' +
                     '\r\n');
    });

}).listen(PORT);

console.log('Server listening on ' +':'+ PORT);
