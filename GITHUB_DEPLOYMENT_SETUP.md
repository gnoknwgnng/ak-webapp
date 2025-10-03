# GitHub Deployment Setup for Leap Cell

## 📋 Pre-Deployment Checklist

Your WebSight Pro project is **READY FOR DEPLOYMENT** ✅

### ✅ What's Already Configured:

1. **Leap Cell Configuration Files:**
   - `leap.yml` - Main deployment configuration
   - `leap.config.js` - Advanced configuration
   - `.leapignore` - Files to exclude from deployment

2. **API Handler:**
   - `api/analyze.js` - Properly configured for Leap Cell serverless functions
   - CORS headers configured
   - Error handling implemented

3. **Source Code:**
   - All analysis modules in `src/` directory
   - Frontend files in `public/` directory
   - Package.json with correct dependencies

4. **Build Configuration:**
   - Build scripts configured in package.json
   - Static file serving setup

## 🚀 GitHub Deployment Steps

### Step 1: Initialize Git Repository (if not already done)

```bash
git init
git add .
git commit -m "Initial commit: WebSight Pro for Leap Cell deployment"
```

### Step 2: Create GitHub Repository

1. Go to [GitHub.com](https://github.com)
2. Click "New Repository"
3. Name it: `websight-pro-leap-cell`
4. Make it **Public** (for easier deployment)
5. Don't initialize with README (you already have files)

### Step 3: Connect Local Repository to GitHub

```bash
git remote add origin https://github.com/YOUR_USERNAME/websight-pro-leap-cell.git
git branch -M main
git push -u origin main
```

### Step 4: Set Up Environment Variables

Create a `.env` file locally (for testing):
```bash
GROQ_API_KEY=your-actual-groq-api-key-here
```

**Important:** Never commit the `.env` file to GitHub!

### Step 5: Deploy to Leap Cell via GitHub

#### Option A: Leap Cell Dashboard (Recommended)
1. Go to Leap Cell dashboard
2. Click "New Project"
3. Select "Import from GitHub"
4. Choose your repository: `websight-pro-leap-cell`
5. Configure environment variables:
   - `GROQ_API_KEY`: Your actual Groq API key
   - `NODE_ENV`: production

#### Option B: Leap Cell CLI (if available)
```bash
# Connect repository
leap connect github YOUR_USERNAME/websight-pro-leap-cell

# Set environment variables
leap env set GROQ_API_KEY=your-actual-groq-api-key-here
leap env set NODE_ENV=production

# Deploy
leap deploy
```

## 🔧 Configuration Details

### Environment Variables Required:
- `GROQ_API_KEY` - Your Groq API key for AI analysis
- `NODE_ENV` - Set to "production"

### Deployment Configuration:
- **Runtime:** Node.js 18
- **Memory:** 512MB
- **Timeout:** 60 seconds
- **Auto-scaling:** 0-10 instances

### API Endpoints:
- `POST /api/analyze` - Main analysis endpoint
- `OPTIONS /api/analyze` - CORS preflight

### Static Files:
- Frontend served from `/public` directory
- Main entry point: `/index.html`

## 🧪 Testing After Deployment

1. **Health Check:** Visit your deployed URL
2. **API Test:** Try analyzing a website
3. **Monitor Logs:** Check Leap Cell dashboard for any errors

## 📁 Project Structure Summary

```
websight-pro/
├── api/
│   └── analyze.js          # Leap Cell serverless function
├── src/
│   ├── analyzer.js         # Main analysis engine
│   ├── scraper.js          # Web scraping
│   ├── grammar.js          # Grammar analysis
│   └── seo.js             # SEO analysis
├── public/
│   └── index.html         # Frontend
├── leap.yml               # Leap Cell config
├── leap.config.js         # Advanced config
├── .leapignore           # Deployment exclusions
├── package.json          # Dependencies
└── README.md             # Documentation
```

## 🔍 Troubleshooting

### Common Issues:

1. **API Key Not Set:**
   - Ensure `GROQ_API_KEY` is set in Leap Cell environment variables
   - Check the exact key name and value

2. **Function Timeout:**
   - Default is 60 seconds (should be sufficient)
   - Monitor logs for performance issues

3. **CORS Issues:**
   - CORS is configured for all origins (`*`)
   - Check browser console for specific errors

4. **Build Failures:**
   - Ensure all dependencies are in package.json
   - Check build logs in Leap Cell dashboard

### Debug Commands:
```bash
# Check environment variables
leap env list

# View deployment logs
leap logs

# Check function status
leap status
```

## ✅ Deployment Verification

After deployment, verify:
- [ ] Website loads at deployed URL
- [ ] Can enter a URL in the analyzer
- [ ] Analysis completes successfully
- [ ] Results display properly
- [ ] No console errors

## 🎯 Next Steps

1. **Custom Domain:** Configure custom domain in Leap Cell
2. **Monitoring:** Set up alerts and monitoring
3. **Analytics:** Add usage tracking
4. **Rate Limiting:** Implement API rate limiting for production

Your project is fully configured and ready for deployment! 🚀