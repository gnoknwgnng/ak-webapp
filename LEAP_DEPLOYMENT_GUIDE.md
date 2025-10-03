# Leap Cell Deployment Guide for WebSight Pro

This guide will help you deploy WebSight Pro to Leap Cell's serverless platform.

## Prerequisites

1. **Leap CLI**: Install the Leap Cell CLI
   ```bash
   npm install -g @leap/cli
   ```

2. **Groq API Key**: Get your API key from [Groq Console](https://console.groq.com/)

3. **Leap Cell Account**: Sign up at [Leap Cell](https://leap.cell.com/)

## Quick Deployment

### Option 1: Using Deployment Scripts

**Windows:**
```cmd
set GROQ_API_KEY=your-groq-api-key-here
leap-deploy.bat
```

**Linux/Mac:**
```bash
export GROQ_API_KEY=your-groq-api-key-here
./leap-deploy.sh
```

### Option 2: Manual Deployment

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set environment variables:**
   ```bash
   leap env set GROQ_API_KEY=your-groq-api-key-here
   leap env set NODE_ENV=production
   ```

3. **Deploy:**
   ```bash
   leap deploy
   ```

## Configuration Files

### leap.yml
Main configuration file for Leap Cell deployment:
- Function definitions and routing
- Environment variables
- Static file serving
- Build commands
- Scaling configuration

### leap.config.js
Advanced configuration for complex deployments:
- Runtime settings
- Memory and timeout configurations
- Custom build processes

### .leapignore
Specifies files to exclude from deployment:
- Development files
- Node modules
- Environment files
- IDE configurations

## Environment Variables

Set these environment variables for your deployment:

| Variable | Description | Required |
|----------|-------------|----------|
| `GROQ_API_KEY` | Your Groq API key for AI analysis | Yes |
| `NODE_ENV` | Environment (production/development) | No |

## Function Configuration

The analyze function is configured with:
- **Runtime**: Node.js 18
- **Memory**: 512MB
- **Timeout**: 60 seconds
- **Concurrency**: Up to 100 concurrent requests

## Static File Serving

Static files are served from:
- `public/` directory → Root path `/`
- `index.html` → Main entry point

## API Endpoints

After deployment, your API will be available at:
- `POST /api/analyze` - Main analysis endpoint
- `OPTIONS /api/analyze` - CORS preflight handling

## Monitoring and Logs

Use Leap CLI commands to monitor your deployment:

```bash
# View deployment status
leap status

# View logs
leap logs

# View function metrics
leap metrics

# Get deployment info
leap info
```

## Scaling Configuration

The application is configured to:
- **Min Instances**: 0 (scales to zero when not in use)
- **Max Instances**: 10 (scales up based on demand)
- **Target Concurrency**: 100 requests per instance

## Troubleshooting

### Common Issues

1. **API Key Not Set**
   ```bash
   leap env set GROQ_API_KEY=your-actual-api-key
   ```

2. **Function Timeout**
   - Default timeout is 60 seconds
   - Increase in `leap.yml` if needed

3. **Memory Issues**
   - Default memory is 512MB
   - Increase in `leap.yml` if needed

4. **CORS Issues**
   - CORS is configured for all origins (`*`)
   - Modify in `api/analyze.js` if needed

### Debug Commands

```bash
# Check environment variables
leap env list

# View function logs
leap logs --function analyze

# Test function locally
leap dev

# Check deployment status
leap status --verbose
```

## Security Considerations

1. **Environment Variables**: Never commit API keys to version control
2. **CORS**: Configure appropriate origins for production
3. **Rate Limiting**: Consider implementing rate limiting for production use
4. **Input Validation**: All inputs are validated before processing

## Performance Optimization

1. **Cold Starts**: Minimized with efficient imports and initialization
2. **Memory Usage**: Optimized for 512MB memory limit
3. **Timeout Handling**: 60-second timeout for comprehensive analysis
4. **Concurrent Processing**: Supports up to 100 concurrent requests

## Cost Optimization

1. **Auto-scaling**: Scales to zero when not in use
2. **Efficient Processing**: Optimized analysis pipeline
3. **Resource Management**: Right-sized memory and timeout settings

## Support

For Leap Cell specific issues:
- [Leap Cell Documentation](https://docs.leap.cell.com/)
- [Leap Cell Support](https://support.leap.cell.com/)

For WebSight Pro issues:
- Check the main README.md
- Review the PROJECT_ANALYSIS_REPORT.md