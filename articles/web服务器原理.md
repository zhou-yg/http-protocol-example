# web服务器原理

## 前言

web服务器就运行在服务器主机的操作系统里的一个处理网络请求的程序，最主要处理的就是http请求

http请求的目的：获取服务器端的数据

  - 获取后端业务数据
  - 反向代理
    反向代理（Reverse Proxy）方式是指以代理服务器来接受 internet上 的连接请求，然后将请求转发给内部网络上的服务器，并将从服务器上得到的结果返回给 internet 上请求连接的客户端，此时代理服务器对外就表现为一个反向代理服务器。简单来说就是真实的服务器不能直接被外部网络访问，所以需要一台代理服务器，而代理服务器能被外部网络访问的同时又跟真实服务器在同一个网络环境，当然也可能是同一台服务器，端口不同而已。
  - 负载均衡
    当有2台或以上服务器时，根据规则随机的将请求分发到指定的服务器上处理，负载均衡配置一般都需要同时配置反向代理，通过反向代理跳转到负载均衡。
  - 静态文件托管
    静态资源的服务器，代理访问文件


那么一个web服务器它是怎么工作，它会碰上什么问题？

## 协议

web服务器主要是接收通过http协议发过来的数据，所以这里先简单普及一下http，详情的可以看后面的分享。

首先http基于tcp，tcp是网络层的协议，http是应用层协议。
在tcp建立连接的基础上，才能开始应用http协议

每发起一个http请求，都需要在客户端和服务器建立一个tcp连接管道，用以传输http报文。
由于tcp是有状态的连接，所以服务器需要内存资源来保持一个开启的tcp连接管道。

|-- 服务器 --|
| <tcp>    |
| <tcp>    |
| <tcp>    |
|----------|


## 服务器和端口号

端口是设备与外界通讯交流的出入口

在日常开发中我们常说的端口实际都是tcp协议的端口，用于区分处理tcp协议的程序，如80，8080等

通常情况下，服务器开机启动的会有超级进程用以收取tcp请求

当一个tcp/发送过来时，超级进程会接收这个请求并根据端口号，确认这个端口是否有httpd程序申请了监听这个端口号

如果有程序趴在这个端口上监听，然后再转发这个这个请求数据到对应的httpd程序进程，这个httpd程序进程通常就是我们说的web服务，如nginx，tomcat，nodejs的net/http模块，apache httpd

[此处有图]


## web服务器工作

初的服务器都是基于进程/线程模型的，新到来一个TCP连接，就需要分配1个进程（或者线程）。而进程又是操作系统最昂贵的资源，一台机器无法创建很多进程。如果是有1万个请求就要创建1万个进程，那么操作系统是无法承受的。如果是采用分布式系统，维持1亿用户在线需要10万台服务器，成本巨大，也只有Facebook，Google才有财力购买如此多的服务器。

这经典的C10K问题。


示例: apache httpd（服务端） + php（执行脚本）

请求处理过程演示

[此处有图]

## 进程，线程

进程 -> 线程1
    -> 线程2
    -> 线程3

创建进程是系统级操作，创建线程是进程内操作
新建一个进程 远大于 新建 一个线程 大于 本线程内直接处理

在linux 或 mac操作执行ps -ef 可以看到当前正在运行的所有进程

进程因为系统级的，所以它能做的事情非常多，获得系统的资源，状态，跟其它进程通信等。。

基于进程和线程的特性，常见的web服务器会采用不同的进程策略模型，

- 经典的 apache httpd + php
  - 多进程单线程
    - 全新的上下文执行环境，
    - 进程之间，不会相互影响

    - 占用系统资源多
    - 进程间不能简单直接共享数据
    - 脚本执行效率低

- 主流的 tomcat + java
  - 单进程多线程
    - 多线程编程模式功能强大，充分利用资源
    - 支持更高的并发，受限于tomcat线程池设定
    - 程序执行效率高

    - 多线程会引发线程安全问题，线程之间相互影响
    - 创建一个线程也需要消耗资源

- 强大的 nodejs http + JavaScript
  - 单进程单线程
    - 资源占用小
    - 支持超高的并发

    - 维护难度max，共享内存引发连锁噩梦
    - 脚本执行速度低，计算速度慢

  - fork 和 cluster
    - cluster
      - 简单实用
      - 共享端口，负载均衡
      - work进程之间互相独立，不相互影响
    - fork
      - 默认fork模式下，无法共享同一个端口。
      - 需要手动实现cluster中的master进程的效果，添加更多的工作，才能能达成跟cluster一致的效果

## Socket

终于要说到应用的层面了，操作系统的Socket

实际上我们并不需要去真正去编写tcp协议相关的工作，如发送，接收

因为操作系统已经帮我们封装好了一层接口，里面包含网络层的协议，tcp，udp，而这层接口就是Socket。我们直接调用Socket相关的api既可以开始接收和发送tcp请求了

``` nodejs
const net = require('net');
const PORT = 6969;

net.createServer(function(socket) {

  // 当有请求进来的，就会创建一个socket实例对象。

}).listen(PORT + parseInt(Math.random() * 10));
```

## http请求

既然已经知道如何建立tcp连接，那么在tcp的基础上的http又是如何工作的呢？

http是一种文本协议，它在tcp连接管道里，发送一种叫报文的明文文本数据。

那么http报文是什么，它的规则是怎么样，此处省略一万字。


## http过程


``` nodejs
const net = require('net');
const PORT = 6969;

net.createServer(function(socket) {

  console.log('CONNECTED: ' +
      sock.remoteAddress + ':' + sock.remotePort);

  // 当有请求进来的，就会创建一个socket实例对象。
  sock.on('data', function(data) {
      console.log('DATA ' + sock.remoteAddress + ': ' + data);
      // 回发该数据，客户端将收到来自服务端的数据
      sock.end('HTTP/1.1 200 OK\nContent-Type: text/html\n\n<html><head><title>title</title></head><body>hello</body></html>');
  });
  // 为这个socket实例添加一个"close"事件处理函数
  sock.on('close', function(data) {
      console.log('CLOSED: ' +
          sock.remoteAddress + ' ' + sock.remotePort);
  });

}).listen(PORT);
```

其中输出的日志：

> CONNECTED: 127.0.0.1:59409

> DATA 127.0.0.1: GET /a/b/ HTTP/1.1
> Host: 127.0.0.1:6969
> Connection: keep-alive
> Cache-Control: max-age=0
> Upgrade-Insecure-Requests: 1
> User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, > like Gecko) Chrome/71.0.3578.80 Safari/537.36
> Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8
> Accept-Encoding: gzip, deflate, br
> Accept-Language: zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7


> CLOSED: 127.0.0.1 59409

因为tcp是有状态的连接。
可以看到一个http请求从chrome浏览器发出的时候，chrome会在本地构建起一个tcp监听，端口号为59409，专门用来接收来自服务器端的tcp数据。

中间这段输出了chrome浏览器和服务器端构建起tcp通信管道后，发送到服务器端的http原始报文数据，这里有很多我们常见的header字段和值。

最后这段是tcp关闭的日志，因为http是无状态的，所以在服务器端在确认已经把该发送的数据都发送完成的时候，就会把整个tcp管道关闭掉。

完整的一次http请求过程完成。

## websocket过程

曾经由于http 请求响应模型的局限性使得无法让服务器端主动给我们推消息，所以我们必须借助websocket来实现一些需要实时响应的功能，如聊天系统

websocket是要依靠http实现的，所以仍旧需要像刚才的那样，建立tcp连接。

然后发送http报文，报文头部包含了建立websocket所需要的最基本的信息

> GET /webfin/websocket/ HTTP/1.1
> Host: localhost
> Upgrade: websocket
> Connection: Upgrade
> Sec-WebSocket-Key: xqBt3ImNzJbYqRINxEFlkg==
> Origin: http://localhost:8080
> Sec-WebSocket-Version: 13

然后服务器端的接收到这个http请求后，返回

> HTTP/1.1 101 Switching Protocols
> Upgrade: websocket
> Connection: Upgrade
> Sec-WebSocket-Accept: K7DJLdLooIwIG/MOpvWFB3y3FE8=


这样，在tcp管理里建立了websocket的连接，后续的websocket数据就直接通过tcp传输二进制的websocket帧数据数据。

其中在websocket有一个有意思的约定, '258EAFA5-E914-47DA-95CA-C5AB0DC85B11'
> crypto.createHash('sha1').update('xqBt3ImNzJbYqRINxEFlkg==' + '258EAFA5-E914-47DA-95CA-C5AB0DC85B11').digest('base64')



## 文件服务

在网络中我经常会浏览一些大型的图片，视频，下载文件。如果按照原先的流程：

> http视频 -> 服务器读取视频到内存 -> 服务器把内存中的数据塞到tcp管道 -> tcp管道传输到客户端 -> 客户端展现给用户

这种情况下，服务器端需要完整的读取视频文件后才能把数据传输给客户端，1.会造成客户端过多的等待 2.管道瞬间占用大，带宽利用率低下。

所以这里我就需要用到分块传输，当http res返回的头中有下面这个头部时即开始分段传输数据。

> Transfer-Encoding: chunked

如下代码所示，分块传输的精髓在于用socket往tcp的管道里不停的write 2行数据

```javascript
sock.write('[数据的长度]\n');
sock.write('[数据的内容]\n');
```

完整的tcp返回，直到传输的数据长度为0，sock.end并结束

```javascript
sock.on('data', function(data) {
    // 回发该数据，客户端将收到来自服务端的数据
    sock.write('HTTP/1.1 200 OK\nTransfer-Encoding: chunked\n\n');

    let b = fs.readFileSync(__dirname + '/tenpaycert.dmg');

    sock.write(b.length + '\n');
    sock.write(Buffer.concat([b, new Buffer('\n')]));

    sock.end('0\n\n');
});
```













-
