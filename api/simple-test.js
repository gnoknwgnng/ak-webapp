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

    console.log('Simple test function called');
    
    // Test environment
    const testResult = {
      success: true,
      message: 'API is working!',
      timestamp: new Date().toISOString(),
      environment: {
        nodeVersion: process.version,
        hasGroqKey: !!process.env.GROQ_API_KEY,
        groqKeyLength: process.env.GROQ_API_KEY ? process.env.GROQ_API_KEY.length : 0
      }
    };

    console.log('Test result:', testResult);
    res.json(testResult);
    
  } catch (error) {
    console.error('Simple test error:', error);
    res.status(500).json({
      error: 'Simple test failed',
      details: error.message,
      stack: error.stack
    });
  }
}