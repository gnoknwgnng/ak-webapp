# WebSight Pro - Website Analyzer

A comprehensive AI-powered website analysis tool that provides SEO audits, grammar checking, and performance insights.

## 🚀 Live Demo

Visit: [Your Vercel URL will be here]

## ✨ Features

- **SEO Analysis** - Complete SEO audit with keyword analysis and recommendations
- **Grammar & Content** - AI-powered grammar checking and readability analysis  
- **Performance Metrics** - Technical performance and optimization insights
- **Actionable Reports** - Prioritized recommendations with clear action items

## 🛠️ Tech Stack

- **Frontend**: HTML, CSS, JavaScript (Vanilla)
- **Backend**: Node.js with Vercel Serverless Functions
- **AI**: Groq API (GPT-OSS-20B model)
- **Deployment**: Vercel

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

## 🚀 Deploy to Vercel

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Deploy:
```bash
vercel
```

3. Follow the prompts and your app will be live!

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```bash
GROQ_API_KEY=your-groq-api-key-here
```

### For Vercel Deployment

Add the environment variable in your Vercel dashboard:
1. Go to your project settings
2. Navigate to "Environment Variables"
3. Add `GROQ_API_KEY` with your actual API key

## 📁 Project Structure

```
├── api/
│   └── analyze.js          # Vercel serverless function
├── src/
│   ├── analyzer.js         # Main analysis engine
│   ├── scraper.js          # Web scraping functionality
│   ├── grammar.js          # Grammar analysis
│   └── seo.js             # SEO analysis
├── public/
│   └── index.html         # Frontend interface
├── vercel.json            # Vercel configuration
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