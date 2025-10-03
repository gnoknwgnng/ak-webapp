#!/bin/bash

# Leap Cell deployment script for WebSight Pro

echo "🚀 Starting Leap Cell deployment for WebSight Pro..."

# Check if Leap CLI is installed
if ! command -v leap &> /dev/null; then
    echo "❌ Leap CLI not found. Please install it first:"
    echo "   npm install -g @leap/cli"
    exit 1
fi

# Check for required environment variables
if [ -z "$GROQ_API_KEY" ]; then
    echo "❌ GROQ_API_KEY environment variable is required"
    echo "   Please set it before deployment:"
    echo "   export GROQ_API_KEY=your-api-key-here"
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build the project
echo "🔨 Building project..."
npm run build

# Set environment variables for Leap Cell
echo "🔧 Setting environment variables..."
leap env set GROQ_API_KEY="$GROQ_API_KEY"
leap env set NODE_ENV="production"

# Deploy to Leap Cell
echo "🚀 Deploying to Leap Cell..."
leap deploy

echo "✅ Deployment completed!"
echo "🌐 Your WebSight Pro analyzer is now live on Leap Cell!"

# Show deployment info
leap info