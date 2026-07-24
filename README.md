# Less3.ai Marketing Site

Plain static marketing site for Less3 at `https://less3.ai`.

Open [index.html](./index.html) directly in a browser to preview the site locally. No build step, framework runtime, server-side rendering, API route, database, cookie, analytics, or runtime secret is required.

## Files

- `index.html` - complete static page
- `styles.css` - local styling
- `script.js` - small progressive enhancement for the mobile menu, tabs, and copy buttons
- `public/` - local images, favicon, screenshots, and social preview image
- `CNAME` - GitHub Pages custom domain for `less3.ai`

## Commands

```bash
npm install
npm run dev
npm run build
npm run test:e2e
```

`npm run dev` serves the same static files at `http://127.0.0.1:3000`. `npm run build` only validates that required static files exist and that `index.html` uses file-friendly relative paths.

## Source Facts

Marketing copy was checked against the Less3 `main` branch at `e1887a21cd6cefb79398cb40fe46808c35fc8579`. Unstable or conflicting runtime prerequisites are intentionally not hard-coded in the page.
