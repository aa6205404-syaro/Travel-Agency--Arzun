const http = require('http');
const fs = require('fs');
const path = require('path');
const { URL } = require('url');

const PORT = process.env.PORT || 3000;
const publicDir = path.join(__dirname, 'public');
const dataDir = path.join(__dirname, 'data');

const destinations = JSON.parse(fs.readFileSync(path.join(dataDir, 'destinations.json')));
const faqs = JSON.parse(fs.readFileSync(path.join(dataDir, 'faqs.json')));

const mimeTypes = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

function sendJson(res, status, payload) {
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(payload));
}

function serveStatic(res, filePath) {
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Not Found');
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const type = mimeTypes[ext] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': type });
    res.end(data);
  });
}

function handleQuote(req, res) {
  let body = '';
  req.on('data', chunk => {
    body += chunk.toString();
    if (body.length > 1e6) req.connection.destroy();
  });

  req.on('end', () => {
    try {
      const payload = JSON.parse(body || '{}');
      const { name, email, destination, travelers, notes } = payload;

      if (!name || !email || !destination) {
        return sendJson(res, 400, { message: 'Name, email, and destination are required.' });
      }

      const inquiry = {
        name,
        email,
        destination,
        travelers: Number(travelers) || 1,
        notes: notes || '',
        timestamp: new Date().toISOString()
      };

      console.log('New travel inquiry received:', inquiry);
      sendJson(res, 201, { message: 'Inquiry submitted successfully', inquiry });
    } catch (err) {
      console.error(err);
      sendJson(res, 400, { message: 'Invalid request payload' });
    }
  });
}

const server = http.createServer((req, res) => {
  const requestUrl = new URL(req.url, `http://${req.headers.host}`);
  const pathname = requestUrl.pathname;

  if (pathname === '/api/destinations' && req.method === 'GET') {
    return sendJson(res, 200, { destinations });
  }

  if (pathname === '/api/faqs' && req.method === 'GET') {
    return sendJson(res, 200, { faqs });
  }

  if (pathname === '/api/quote' && req.method === 'POST') {
    return handleQuote(req, res);
  }

  const filePath = path.join(publicDir, pathname === '/' ? 'index.html' : pathname);

  if (!filePath.startsWith(publicDir)) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    res.end('Forbidden');
    return;
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      return serveStatic(res, path.join(publicDir, 'index.html'));
    }
    serveStatic(res, filePath);
  });
});

server.listen(PORT, () => {
  console.log(`Travel Agency server running at http://localhost:${PORT}`);
});
