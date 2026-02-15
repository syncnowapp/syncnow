import { config } from './config/env';
import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { corsOptions } from './config/cors';
import { errorHandler } from './middleware/errorHandler';
import apiRouter from './routes/index';
import { setupSocketIO } from './socket/index';

const app = express();
const httpServer = createServer(app);

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// Routes
app.use('/api', apiRouter);

// Error handler
app.use(errorHandler);

// Socket.io
const io = setupSocketIO(httpServer);

// Start server
httpServer.listen(config.port, () => {
  console.log(`[SyncNow] Server running on port ${config.port}`);
  console.log(`[SyncNow] CORS origin: ${config.corsOrigin}`);
  console.log(`[SyncNow] Environment: ${config.nodeEnv}`);
});
