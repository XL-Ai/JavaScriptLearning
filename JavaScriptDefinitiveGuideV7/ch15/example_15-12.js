const http = require('http');
const fs = require('fs');
const url = require('url');

const clientHTML = fs.readFileSync('/Users/aixl/StudySpace/frontEnd/JavaScriptLearning/JavaScriptDefinitiveGuideV7/ch15/example_15-15.html');

let clients = [];

let server = new http.Server();
server.listen(8080);

function acceptNewClient(request, response) {
  console.log('acceptNewClient begin');
  clients.push(response);

  request.connection.on('end', () => {
    console.log('acceptNewClient on connection end');
    clients.splice(clients.indexOf(response), 1);
    response.end();
  });

  response.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Connection': 'keep-alive',
    'Cache-Control': 'no-cache'
  });
  response.write("event: chat\ndata: Connected\n\n");
}

async function broadcastNewMessage(request, response) {
  request.setEncoding('utf8');
  let body = '';
  for await (let chunk of request) {
    body += chunk;
  }

  response.writeHead(200).end();

  let message = "data: " + body.replace("\n", "\ndata: ");
  let event = `event: chat\n${message}\n\n`;

  clients.forEach(client => client.write(event));
}

server.on('request', (request, response) => {
  let pathName = url.parse(request.url).pathname;

  if (pathName === '/') {
    response.writeHead(200, { 'Content-Type': 'text/html' }).end(clientHTML);
  } else if (pathName !== '/chat' || (request.method !== 'GET' && request.method !== 'POST')) {
    response.writeHead(404).end();
  } else if (request.method === 'GET') {
    acceptNewClient(request, response);
  } else {
    broadcastNewMessage(request, response);
  }
})