import express from 'express';
import cors from 'cors';
import { WebsiteAnalyzer } from './src/analyzer.js';

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Routes
// API route for website analysis
app.post('/api/analyze', async (req, res) => {
  try {
    const { url } = req.body;
    
    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    console.log(`Analyzing website: ${url}`);
    const analyzer = new WebsiteAnalyzer();
    const report = await analyzer.analyzeWebsite(url);
    
    console.log('Analysis completed successfully');
    res.json(report);
    
  } catch (error) {
    console.error('Analysis error:', error);
    res.status(500).json({
      error: 'Failed to analyze website',
      details: error.message
    });
  }
});

// Legacy route for backward compatibility
app.post('/analyze', async (req, res) => {
  try {
    const { url } = req.body;
    
    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    console.log(`Analyzing website: ${url}`);
    const analyzer = new WebsiteAnalyzer();
    const report = await analyzer.analyzeWebsite(url);
    
    console.log('Analysis completed successfully');
    res.json(report);
    
  } catch (error) {
    console.error('Analysis error:', error);
    res.status(500).json({
      error: 'Failed to analyze website',
      details: error.message
    });
  }
});

// Serve static files from public directory
app.use(express.static('public'));

// Serve main HTML file
app.get('/', (req, res) => {
  res.sendFile('index.html', { root: '.' });
});

app.listen(port, () => {
  console.log(`Website Analyzer running on http://localhost:${port}`);
});