var http = require('http');

http.createServer(function(req,res){
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Hello world!');
}).listen(5031);

console.log('Server started on flip1 port 5031; press Ctrl-C to terminate....');
