module.exports = async function handler(req, res) {
  try {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

    if (req.method === 'OPTIONS') {
      res.status(200).end();
      return;
    }

    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    // Test basic functionality first
    console.log('API function called successfully');
    
    // Check if we can import the analyzer
    let WebsiteAnalyzer;
    try {
      const analyzerModule = require('../src/analyzer.js');
      WebsiteAnalyzer = analyzerModule.WebsiteAnalyzer;
      console.log('WebsiteAnalyzer imported successfully');
    } catch (importError) {
      console.error('Import error:', importError);
      return res.status(500).json({
        error: 'Failed to import analyzer',
        details: importError.message,
        stack: importError.stack
      });
    }

    const { url } = req.body;
    
    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    console.log(`Analyzing website: ${url}`);
    
    // Try to create analyzer instance
    let analyzer;
    try {
      analyzer = new WebsiteAnalyzer();
      console.log('WebsiteAnalyzer instance created successfully');
    } catch (constructorError) {
      console.error('Constructor error:', constructorError);
      return res.status(500).json({
        error: 'Failed to create analyzer instance',
        details: constructorError.message,
        stack: constructorError.stack
      });
    }

    // Try to run analysis
    try {
      const report = await analyzer.analyzeWebsite(url);
      console.log('Analysis completed successfully');
      res.json(report);
    } catch (analysisError) {
      console.error('Analysis error:', analysisError);
      return res.status(500).json({
        error: 'Failed to analyze website',
        details: analysisError.message,
        stack: analysisError.stack
      });
    }
    
  } catch (error) {
    console.error('Unexpected error:', error);
    res.status(500).json({
      error: 'Unexpected server error',
      details: error.message,
      stack: error.stack
    });
  }
}