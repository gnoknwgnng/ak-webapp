export default {
  // Leap Cell configuration
  name: 'websight-pro',
  version: '1.0.0',
  
  // Runtime configuration
  runtime: 'nodejs18',
  
  // Function configuration
  functions: {
    'api/analyze': {
      handler: 'api/analyze.js',
      timeout: 60000, // 60 seconds
      memory: 512, // 512MB
      environment: {
        GROQ_API_KEY: process.env.GROQ_API_KEY
      }
    }
  },
  
  // Static file serving
  static: {
    directory: 'public',
    fallback: 'index.html'
  },
  
  // Environment variables
  env: {
    NODE_ENV: 'production'
  },
  
  // Build configuration
  build: {
    command: 'npm run build',
    output: 'dist'
  }
};