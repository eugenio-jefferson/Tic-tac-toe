import { createServer } from 'node:https';
import { parse } from 'node:url';
import next from 'next';
import fs from 'node:fs';

const app = next({ dev: true });
const handle = app.getRequestHandler();

const httpsOptions = {
  key: fs.readFileSync('../key.pem'),
  cert: fs.readFileSync('../cert.pem'),
};

await app.prepare().then(() => {
  createServer(httpsOptions, (req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  }).listen(3000, () => {
    console.log('> HTTPS server running at https://localhost:3000');
  });
});
