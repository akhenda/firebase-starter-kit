import type { Request, Response } from 'express';
import express from 'express';

const router = express.Router();

router.get('/', (_: Request, res: Response) => {
  res.status(200);
  res.send('Hello, All Planets!');
});

router.post('/snap-finger', (_: Request, res: Response) => {
  // const { body, query, params } = req;
  // console.log('====================================');
  // console.log({ body, query, params });
  // console.log('====================================');
  res.status(201);
  res.send('Half of the total population in all planets exterminated');
});

export default router;
