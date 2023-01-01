import type { Request, Response } from 'express';
import express from 'express';
import Youch from 'youch';

const router = express.Router();

router.get('/', async (_: Request, res: Response) => {
  res.status(200);
  res.send('Hello, World!');
});

router.get('/error', async (req: Request, res: Response) => {
  const error = new Error("😌 Don't panic, this is just a test error.");
  const youch = new Youch(error, req);
  const html = await youch
    .addLink(({ message }: { message: string }) => {
      const url = `https://stackoverflow.com/search?q=${encodeURIComponent(`[node.js] ${message}`)}`;

      return `<a href="${url}" target="_blank" title="Search on stackoverflow">Search stackoverflow</a>`;
    })
    .toHTML();

  res.writeHead(500, { 'content-type': 'text/html' });
  res.write(html);
  res.end();
});

export default router;
