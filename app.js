const express = require("express");
const Vite = require('vite');
const nunjucks = require('nunjucks');

const { NODE_ENV } = process.env;
const PROXY_PORT = 39482;

async function main() {

  const port = process.env.PORT || 3000;
  const app = express();

  nunjucks.configure('dist', {
    autoescape: true,
    express: app,
    noCache: true,
  })

  // serve pages from express
  app.get('/hello', (req, res) => {
    res.send('Hello, from express');
  });

  app.get('/dashboard', (req, res, next) => {
    req.url = '/__vue__';
    next('route');
  });

  app.get('/profile', (req, res, next) => {
    req.url = '/__vue__';
    next('route');
  });

  app.get('/__vue__', async (req, res, next) => {
    const config = { message: Date.now() };
    if (NODE_ENV == 'dev') {
      const template = await fetch(`http://localhost:${PROXY_PORT}`);
      const html = nunjucks.renderString(await template.text(), { config });
      res.send(html);
    } else {
      res.render('index.html', { config });
    }
  });

  const server = await app.listen(port);

  if (NODE_ENV == 'dev') {

    const Proxy = require('http-proxy');

    var proxy = new Proxy.createProxyServer({
      target: { host: 'localhost', port: PROXY_PORT }
    });

    // proxy anything yet-unhandled back to vite
    app.get('*', (req, res) => proxy.web(req, res));

    // proxy hmr ws back to vite
    server.on('upgrade', (req, socket, head) => {
      if (req.url == '/') proxy.ws(req, socket, head)
    });

    // start our vite dev server
    const vite = await Vite.createServer({ server: { port: PROXY_PORT }});
    vite.listen();

  } else {

    // serve built static files
    app.use(express.static(__dirname + '/dist'));
  }

}

main();

