# Krishna Shah — Portfolio

Built with React + Vite. Deployed on Vercel. Visitor count via Firebase Realtime Database.

## Setup in 5 steps

### 1. Clone & install
```bash
git clone <your-repo-url>
cd krishna-portfolio
npm install
```

### 2. Set up Firebase (visitor counter)
1. Go to https://console.firebase.google.com
2. Create a new project → Add a web app
3. Copy the config object
4. Go to **Build → Realtime Database → Create database** (start in test mode)
5. Open `src/firebase.js` and replace the `firebaseConfig` values

### 3. Fill in your "Beyond Code" section
Open `src/App.jsx` and find the `BEYOND` array near the top.
Replace the placeholder descriptions with your real experiences — sport, music, leadership, jobs.

### 4. Run locally
```bash
npm run dev
```

### 5. Deploy to Vercel
```bash
npm install -g vercel
vercel
# Follow prompts — it auto-detects Vite
```
Your live URL will be: `https://krishna-portfolio.vercel.app` (or custom domain)

## To add a custom domain
In Vercel dashboard → your project → Settings → Domains → Add domain

## Recruiter tracking
Once Firebase is configured, every visit increments a counter visible in:
- The navbar (top right)
- The footer
- Your Firebase Realtime Database console at `/visitors/count`
