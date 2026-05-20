# NBA Team Salaries — Live Site

Live NBA salary data powered by [BallDontLie API](https://balldontlie.io), hosted free on Vercel.

## How it works
- `index.html` — the frontend (browser calls `/api/salaries`)
- `api/salaries.js` — Vercel serverless function that proxies BallDontLie (keeps API key server-side, solves CORS)

## Deploy steps

### 1. Push to GitHub
Create a new repo and upload all 3 files: `index.html`, `api/salaries.js`, `vercel.json`

### 2. Import to Vercel
- Go to vercel.com → Add New Project → import your GitHub repo
- Click Deploy (don't touch any build settings)

### 3. Add your API key as an environment variable
- In Vercel dashboard → your project → Settings → Environment Variables
- Add: `BALLDONTLIE_API_KEY` = your key
- Click Save, then Redeploy

That's it — your site will be live at yourproject.vercel.app
