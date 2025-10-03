import { WebsiteAnalyzer } from '../src/analyzer.js';

// Leap Cell serverless function handler
export const handler = async (event) => {
  // Parse the request from Leap Cell event
  const req = {
    method: event.httpMethod || event.requestContext?.http?.method,
    body: event.body ? JSON.parse(event.body) : {},
    headers: event.headers || {}
  };

  // Response helper for Leap Cell
  const createResponse = (statusCode, body, headers = {}) => ({
    statusCode,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,OPTIONS,PATCH,DELETE,POST,PUT',
      'Access-Control-Allow-Headers': 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version',
      'Access-Control-Allow-Credentials': 'true',
      ...headers
    },
    body: JSON.stringify(body)
  });

  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return createResponse(200, { message: 'CORS preflight' });
  }

  if (req.method !== 'POST') {
    return createResponse(405, { error: 'Method not allowed' });
  }

  try {
    // Check for required environment variables
    if (!process.env.GROQ_API_KEY) {
      console.error('GROQ_API_KEY environment variable is not set');
      return createResponse(500, {
        error: 'Server configuration error',
        details: 'Missing required API key configuration'
      });
    }

    const { url } = req.body;
    
    if (!url) {
      return createResponse(400, { error: 'URL is required' });
    }

    // Validate URL format
    try {
      new URL(url);
    } catch {
      return createResponse(400, { error: 'Invalid URL format' });
    }

    console.log(`Analyzing website: ${url}`);
    const analyzer = new WebsiteAnalyzer();
    const report = await analyzer.analyzeWebsite(url);
    
    console.log('Analysis completed successfully');
    return createResponse(200, report);
    
  } catch (error) {
    console.error('Analysis error:', error);
    return createResponse(500, {
      error: 'Failed to analyze website',
      details: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

// For backward compatibility with Express-style handlers
export default async function handler(req, res) {
  // Convert Express req/res to Leap Cell event format
  const event = {
    httpMethod: req.method,
    body: JSON.stringify(req.body),
    headers: req.headers
  };

  const result = await exports.handler(event);
  
  // Set response headers
  Object.entries(result.headers).forEach(([key, value]) => {
    res.setHeader(key, value);
  });
  
  res.status(result.statusCode).json(JSON.parse(result.body));
}