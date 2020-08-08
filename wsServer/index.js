const WebSocket = require('ws');
const fs = require('fs');
const https = require('https');
const { setInterval } = require('timers');
const express = require('express');
var Clients = require('./clients');

const app = express();

const server = https.createServer({
    cert: fs.readFileSync('wsServer/cert/cert.pem'),
    key: fs.readFileSync('wsServer/cert/key.pem')    
}, app);

function noop() {
    
}

function heartbeat() {
    this.isAlive = true;
}

const clients = new Clients();
const wss = new WebSocket.Server({server});
wss.on('connection', function connection(client, req) {
    
    client.isAlive = true;
    client.ip = req.socket.remoteAddress;
    client.on('pong', heartbeat);

    client.onopen = function() {
        console.log('WebSocket connection established');        
    };

    client.onclose = function() {
        console.log('WebSocket connection closed');        
    };

    client.onerror = function() {
        console.log('WebSocket error');        
    };

    client.onmessage = function(res) {        
        console.log(`type: ${res.type}, msg: ${res.data}`);
    };
    
    clients.saveClient(req.socket.remoteAddress, client);
});

const interval = setInterval(function ping() {
    wss.clients.forEach(function each(client) {
        if (client.isAlive == false) {
            console.log(`Terminating client ${client.ip}`)
            clients.removeClient(client.ip);
            return client.terminate();
        }
        client.isAlive = false;
        client.ping(noop);
    });
}, 30000);

wss.on('close', function close() {
    clearInterval(interval);
});

app.post('/rest', (req, res, next) => {
    
});

server.listen(8080, () => {
    console.log('Server listening on wss://localhost:8080');
});