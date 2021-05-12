import server from './server';
import WebSocket from 'ws';

const wss = new WebSocket.Server({ server: server });

// Broadcast to all.
wss.broadcast = (data) => {
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data));
    }
  });
};

wss.on('connection', (ws) => {
  // ws.on('message', (msg) => console.log(`Message received ${msg}`));
  ws.send(JSON.stringify({action: 'ping', data: 'Hello there!'}));
});

export default wss;
