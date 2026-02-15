import { Router, Request, Response } from 'express';
import matchesRouter from './matches';
import statsRouter from './stats';

const router = Router();

// Health check
router.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

router.use('/matches', matchesRouter);
router.use('/stats', statsRouter);

export default router;
