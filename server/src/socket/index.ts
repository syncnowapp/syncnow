import { Server as HttpServer } from 'http';
import { Server } from 'socket.io';
import { corsOptions } from '../config/cors';
import { timerManager } from './timerManager';
import { registerMatchHandlers } from './matchHandlers';

export function setupSocketIO(httpServer: HttpServer): Server {
  const io = new Server(httpServer, {
    cors: corsOptions,
    transports: ['websocket', 'polling'],
  });

  timerManager.setIO(io);

  io.on('connection', (socket) => {
    console.log(`[Socket] Connected: ${socket.id}`);
    registerMatchHandlers(io, socket);
  });

  return io;
}
