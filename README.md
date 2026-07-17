# 🌿 Plant Identification Online

Plant Identification Online is an AI-powered web application that identifies plants from uploaded images using the Pl@ntNet API and provides trusted botanical information from Wikipedia.

This version runs on **Cloudflare Workers** with static assets and a serverless API.

---

## ✨ Features

- 🌱 AI-powered plant identification
- 📖 Plant descriptions
- 📜 History & Region
- ❤️ Benefits & Uses
- 📊 Confidence score
- ❌ Plant Not Found detection
- 📱 Mobile-friendly design
- ⚡ Fast global delivery via Cloudflare

---

## 🛠️ Technologies Used

- Cloudflare Workers
- JavaScript (ES Modules)
- HTML5
- CSS3
- Pl@ntNet API
- Wikipedia API
- Wrangler CLI
- GitHub Actions

---

## 📁 Project Structure

```
plant-identification-online/
├── public/              # Static frontend (HTML, CSS, JS)
├── src/                 # Cloudflare Worker source code
│   ├── worker.js        # Main worker entry point
│   ├── plantnet.js      # Pl@ntNet API integration
│   └── wikipedia.js     # Wikipedia data helpers
├── wrangler.jsonc       # Cloudflare Workers config
└── .github/workflows/   # GitHub Actions deploy workflow
```

---

## 🚀 Local Development

### 1. Install dependencies

```bash
npm install
```

### 2. Configure your Pl@ntNet API key

Copy the example file and add your key:

```bash
copy .dev.vars.example .dev.vars
```

Edit `.dev.vars`:

```
PLANTNET_API_KEY=your_plantnet_api_key_here
```

### 3. Run locally

```bash
npm run dev
```

Open the local URL shown by Wrangler (usually `http://localhost:8787`).

---

## ☁️ Deploy to Cloudflare via GitHub

### Step 1: Push to GitHub

```bash
git init
git add .
git commit -m "Migrate Plant Identification Online to Cloudflare Workers"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/plant-identification-online.git
git push -u origin main
```

### Step 2: Create Cloudflare API token

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/) → **My Profile** → **API Tokens**
2. Create a token with **Edit Cloudflare Workers** permission
3. Copy your **Account ID** from the Workers overview page

### Step 3: Add GitHub secrets

In your GitHub repo → **Settings** → **Secrets and variables** → **Actions**, add:

| Secret | Value |
|--------|-------|
| `CLOUDFLARE_API_TOKEN` | Your Cloudflare API token |
| `CLOUDFLARE_ACCOUNT_ID` | Your Cloudflare account ID |

### Step 4: Set the Pl@ntNet API key on Cloudflare

After the first deploy, set the secret on your Worker:

```bash
npx wrangler secret put PLANTNET_API_KEY
```

Or in Cloudflare Dashboard → Workers → your worker → **Settings** → **Variables** → add `PLANTNET_API_KEY` as an encrypted variable.

### Step 5: Deploy

Every push to `main` triggers automatic deployment via GitHub Actions.

You can also deploy manually:

```bash
npm run deploy
```

---

## 📷 How to Use

1. Open the website.
2. Upload a plant image.
3. Click **Identify Plant**.
4. View the plant's:
   - Common Name
   - Scientific Name
   - Family
   - Confidence Score
   - Description
   - History & Region
   - Benefits & Uses

---

## 🙏 Credits

- **Pl@ntNet API** — AI-powered plant identification.
- **Wikipedia** — Plant descriptions and information.

---

## 👨‍💻 Developer

**AQ Khan**  
GitHub: **NaxariTech**

---

## 📄 License

This project is intended for educational and research purposes.
