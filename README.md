# JobFinder — Qualification-First Localhost Chatbot (DeepSeek via OpenRouter)

This app starts by asking for your **qualifications**. Your first message is turned into:

> Tell me how i can find a job: here are my qualifications : {your qualifications}

That crafted prompt is sent to **DeepSeek** (via **OpenRouter**) and you get a tailored plan.

## Prerequisites
- **Node.js** (v18+ recommended) — https://nodejs.org
- No Python required.

## Setup
1. Unzip this folder.
2. Create `.env` by copying `.env.example`, then paste your OpenRouter API key:
   ```env
   OPENROUTER_API_KEY=sk-or-...your_key_here...
   APP_REFERER=http://localhost:3000
   APP_TITLE=JobFinder
   PORT=3000
   DEFAULT_MODEL=deepseek/deepseek-chat-v3.1:free
   ```
3. Install dependencies:
   ```bash
   npm install
   ```

## Run (development)
```bash
npm run dev
# open http://localhost:3000
```

## Run (production)
```bash
npm start
# open http://localhost:3000
```

## Notes
- Header shows **JobFinder**.
- To reset the “first message as qualifications” flow, refresh the page.
- You can switch models with the dropdown.
- If your key was ever shared publicly, rotate it in your OpenRouter account before use.
