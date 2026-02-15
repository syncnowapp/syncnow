import { CorsOptions } from 'cors';
import { config } from './env';

export const corsOptions: CorsOptions = {
  origin: [
    config.corsOrigin,
    'http://localhost:3000',
  ],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  credentials: true,
};
