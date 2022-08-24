import app from './server';
import { createTypeormConnection } from './Utils/createTypeormConnection';
import { parse } from 'url';
import ws from 'ws';
import user from './Middleware/user';

const users = new Set();

// Set up a headless websocket server that prints any
// events that come in.
const wsServer = new ws.Server({ noServer: true });
wsServer.on('connection', (socket) => {
  const userRef = { socket };
  users.add(userRef);

  socket.on('message', (message) => {
    try {
      const data = message.toString('utf-8');
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  });
});

const server = app.listen(process.env.PORT, async () => {
  console.log(`Server running at http://localhost:5000`);
  try {
    console.log('creating connection');

    await createTypeormConnection();
    console.log('database connected');
  } catch (error) {
    console.log(error);
  }
});
server.on('upgrade', (request, socket, head) => {
  const { pathname } = parse(request.url!);
  if (pathname == '/foo') {
    wsServer.handleUpgrade(request, socket, head, (socket) => {
      wsServer.emit('connection', socket, request);
    });
  }
});
