# WebSight Pro - Website Analyzer

A comprehensive AI-powered website analysis tool that provides SEO audits, grammar checking, and performance insights.

## 🚀 Live Demo

Visit: [Your Leap Cell URL will be here]

## ✨ Features

- **SEO Analysis** - Complete SEO audit with keyword analysis and recommendations
- **Grammar & Content** - AI-powered grammar checking and readability analysis  
- **Performance Metrics** - Technical performance and optimization insights
- **Actionable Reports** - Prioritized recommendations with clear action items

## 🛠️ Tech Stack

- **Frontend**: HTML, CSS, JavaScript (Vanilla)
- **Backend**: Node.js with Leap Cell Serverless Functions
- **AI**: Groq API (Llama3-8b-8192 model)
- **Deployment**: Leap Cell

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

## 🚀 Deploy to Leap Cell

1. Install Leap CLI:
```bash
npm i -g @leap/cli
```

2. Set your environment variables:
```bash
# Windows
set GROQ_API_KEY=your-groq-api-key-here

# Linux/Mac
export GROQ_API_KEY=your-groq-api-key-here
```

3. Deploy using the deployment script:
```bash
# Windows
leap-deploy.bat

# Linux/Mac
./leap-deploy.sh
```

Or deploy manually:
```bash
leap deploy
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```bash
GROQ_API_KEY=your-groq-api-key-here
```

### For Leap Cell Deployment

Add the environment variable using Leap CLI:
```bash
leap env set GROQ_API_KEY=your-groq-api-key-here
```

Or set it in your leap.yml configuration file.

## 📁 Project Structure

```
├── api/
│   └── analyze.js          # Leap Cell serverless function
├── src/
│   ├── analyzer.js         # Main analysis engine
│   ├── scraper.js          # Web scraping functionality
│   ├── grammar.js          # Grammar analysis
│   └── seo.js             # SEO analysis
├── public/
│   └── index.html         # Frontend interface
├── leap.yml               # Leap Cell configuration
├── leap.config.js         # Leap Cell advanced configuration
├── leap-deploy.sh         # Deployment script (Linux/Mac)
├── leap-deploy.bat        # Deployment script (Windows)
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