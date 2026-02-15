import { Router, Request, Response } from 'express';
import * as roundService from '../services/roundService';

const router = Router();

// GET /api/stats — Global statistics
router.get('/', async (_req: Request, res: Response) => {
  try {
    const stats = await roundService.getStats();
    res.json(stats);
  } catch (err) {
    console.error('[GET /api/stats]', err);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

export default router;
