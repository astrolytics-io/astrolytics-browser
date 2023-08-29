## Vite + HTML

first, run an http server to serve the bundled iife file from the `dist/` directory:

```
http-server ./dist -p 8000

```

then, run the project:

```
yarn dev
```

make sure to replace `APP_ID` with your Astrolytics APP_ID in `src/main.ts`

To test with CDN script, replace

```
<script src="http://localhost:8000/bundle.iife.js"></script>
```

with the CDN url.
