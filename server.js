const express = require('express');
const { createServer } = require('http');
const WebSocket = require('ws');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

const server = createServer(app);
const wss = new WebSocket.Server({ server });

function sendJsonData(ws) {
  const filePath = path.join(__dirname, 'data.json');

  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading JSON file:', err);
      return;
    }

    ws.send(data);
  });
}

wss.on('connection', (ws) => {
  console.log('Client connected');

  const intervalId = setInterval(() => {
    sendJsonData(ws);
  }, 5000);

  ws.on('message', (message) => {
    console.log('Received from client:', message.toString());
  });

  ws.on('close', () => {
    console.log('Client disconnected');
    clearInterval(intervalId);
  });

  /*ws.on('message', (message, isBinary) => {
    if (isBinary) {
      console.log('Received binary:', message); // Logs: <Buffer 0a 14 1e>
    } else {
      const text = message.toString();
      console.log(`Received text: ${text}`);
      ws.send(`You said: ${text}`);
    }
  });*/
});

server.listen(port, () => {
  console.log('Server running on port ${port}');
});


