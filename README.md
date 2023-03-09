# vite-vue-express-example

Embed Vite + Vue in Express with HMR

### Overview

This example runs both Express and Vite + Vue in a single node process, with HMR for live updates in development.  Server-rendered pages are supported via Nunjucks templating as well.


### Run in development mode

Install dependencies and then start.  Edit `src/client/components/HelloWorld.vue` to see live updates in action.

```
npm ci
NODE_ENV=dev npm start
```

### In production

Build production assets into `dist/`, and then start

```
npm run build
NODE_ENV=production npm start
```
