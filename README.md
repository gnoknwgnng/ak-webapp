# WebSight Pro - Website Analyzer

A comprehensive AI-powered website analysis tool that provides SEO audits, grammar checking, and performance insights.

## 🚀 Live Demo

Visit: [Your Netlify URL will be here]

## ✨ Features

- **SEO Analysis** - Complete SEO audit with keyword analysis and recommendations
- **Grammar & Content** - AI-powered grammar checking and readability analysis  
- **Performance Metrics** - Technical performance and optimization insights
- **Actionable Reports** - Prioritized recommendations with clear action items

## 🛠️ Tech Stack

- **Frontend**: HTML, CSS, JavaScript (Vanilla)
- **Backend**: Netlify Serverless Functions
- **AI**: Groq API (Llama3-8b-8192 model)
- **Deployment**: Netlify (JAMstack)

## 📦 Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd websight-pro
```

2. Install dependencies:
```bash
npm install
```

3. Run locally:
```bash
npm start
```

## 🚀 Deploy to Netlify (Recommended - FREE!)

### Option 1: One-Click Deploy
[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/gnoknwgnng/ak-webapp)

### Option 2: Manual Deploy
1. Fork this repository
2. Go to [netlify.com](https://netlify.com) and sign up
3. Click "New site from Git"
4. Choose your forked repository
5. Set build settings:
   ```
   Build command: npm run build
   Publish directory: public
   ```
6. Add environment variables:
   ```
   GROQ_API_KEY=your-groq-api-key-here
   NODE_ENV=production
   ```
7. Deploy!

### Option 3: Netlify CLI
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Deploy
netlify deploy --prod
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```bash
GROQ_API_KEY=your-groq-api-key-here
```

### For Netlify Deployment

Add environment variables in Netlify dashboard:
1. Go to Site settings → Environment variables
2. Add `GROQ_API_KEY` with your actual API key
3. Add `NODE_ENV` with value `production`

Or use Netlify CLI:
```bash
netlify env:set GROQ_API_KEY your-groq-api-key-here
netlify env:set NODE_ENV production
```

## 📁 Project Structure

```
├── netlify/
│   └── functions/
│       └── analyze.js      # Netlify serverless function
├── src/
│   ├── analyzer.js         # Main analysis engine
│   ├── scraper.js          # Web scraping functionality
│   ├── grammar.js          # Grammar analysis
│   └── seo.js             # SEO analysis
├── public/
│   └── index.html         # Frontend interface
├── netlify.toml           # Netlify configuration
├── index.html             # Main HTML file
└── package.json
```

## 🎯 Usage

1. Enter a website URL
2. Click "Analyze Now"
3. Get comprehensive analysis results including:
   - SEO score and recommendations
   - Grammar and content quality
   - Technical performance metrics
   - Priority action plan

## 📄 License

MIT License - feel free to use this project for your own purposes!