import type { Request, Response } from 'express';
import express from 'express';

const router = express.Router();

router.get('/', (_: Request, res: Response) => {
  res.status(200);
  res.send('Hello, All Planets!');
});

router.post('/snap-finger', (req: Request, res: Response) => {
  // const { body, query, params } = req;
  // console.log('====================================');
  // console.log({ body, params, query });
  // console.log('====================================');
  res.status(201);
  res.json({ message: `Half of the total population in ${req.body.planets} exterminated` });
});

export default router;
