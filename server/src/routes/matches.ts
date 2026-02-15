import { Router, Request, Response } from 'express';
import * as matchService from '../services/matchService';
import { isValidMatchId, isValidItem } from '../shared/constants';

const router = Router();

// POST /api/matches — Create a new match
router.post('/', async (req: Request, res: Response) => {
  try {
    const { id, gameMode, selectedItem } = req.body;

    if (!id || !gameMode) {
      res.status(400).json({ error: 'id and gameMode are required' });
      return;
    }

    if (!isValidMatchId(id)) {
      res.status(400).json({ error: 'Invalid match ID format (6 alphanumeric chars)' });
      return;
    }

    if (gameMode !== 'shapes' && gameMode !== 'colors') {
      res.status(400).json({ error: 'gameMode must be "shapes" or "colors"' });
      return;
    }

    if (selectedItem && !isValidItem(gameMode, selectedItem)) {
      res.status(400).json({ error: `Invalid item "${selectedItem}" for mode "${gameMode}"` });
      return;
    }

    const existing = await matchService.getMatch(id);
    if (existing) {
      res.status(409).json({ error: 'Match ID already exists' });
      return;
    }

    const match = await matchService.createMatch({
      id,
      gameMode,
      selectedItem: selectedItem || null,
    });

    res.status(201).json(matchToResponse(match));
  } catch (err) {
    console.error('[POST /api/matches]', err);
    res.status(500).json({ error: 'Failed to create match' });
  }
});

// GET /api/matches/:id — Get match state
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const match = await matchService.getMatch(req.params.id as string);
    if (!match) {
      res.status(404).json({ error: 'Match not found' });
      return;
    }
    res.json(matchToResponse(match));
  } catch (err) {
    console.error('[GET /api/matches/:id]', err);
    res.status(500).json({ error: 'Failed to fetch match' });
  }
});

// Convert Prisma model to API response (snake_case to match frontend expectations)
function matchToResponse(match: any) {
  return {
    id: match.id,
    game_mode: match.gameMode,
    state: match.state,
    transmitter_ready: match.transmitterReady,
    receiver_ready: match.receiverReady,
    selected_item: match.selectedItem,
    receiver_choice: match.receiverChoice,
    phase_started_at: match.phaseStartedAt?.toISOString() || null,
    phase_duration: match.phaseDuration,
    updated_at: match.updatedAt.toISOString(),
    last_activity_at: match.lastActivityAt.toISOString(),
    created_at: match.createdAt.toISOString(),
  };
}

export { matchToResponse };
export default router;
