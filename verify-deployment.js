#!/usr/bin/env node

/**
 * Deployment Verification Script for WebSight Pro
 * Checks if all files and configurations are ready for Leap Cell deployment
 */

import fs from 'fs';
import path from 'path';

const checks = [];

// Check if required files exist
const requiredFiles = [
  'leap.yml',
  'leap.config.js',
  '.leapignore',
  'package.json',
  'api/analyze.js',
  'src/analyzer.js',
  'src/scraper.js',
  'src/grammar.js',
  'src/seo.js',
  'public/index.html',
  'index.html'
];

console.log('🔍 Verifying WebSight Pro deployment readiness...\n');

// File existence checks
requiredFiles.forEach(file => {
  const exists = fs.existsSync(file);
  checks.push({
    name: `File: ${file}`,
    status: exists,
    message: exists ? '✅ Found' : '❌ Missing'
  });
});

// Package.json validation
try {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  
  checks.push({
    name: 'Package.json: type module',
    status: packageJson.type === 'module',
    message: packageJson.type === 'module' ? '✅ ES modules configured' : '❌ Should be "module"'
  });

  const requiredDeps = ['groq-sdk', 'cheerio', 'axios', 'express', 'cors'];
  requiredDeps.forEach(dep => {
    const hasDepency = packageJson.dependencies && packageJson.dependencies[dep];
    checks.push({
      name: `Dependency: ${dep}`,
      status: !!hasDepency,
      message: hasDepency ? '✅ Installed' : '❌ Missing'
    });
  });

} catch (error) {
  checks.push({
    name: 'Package.json validation',
    status: false,
    message: '❌ Invalid JSON'
  });
}

// Leap.yml validation
try {
  const leapYml = fs.readFileSync('leap.yml', 'utf8');
  
  checks.push({
    name: 'leap.yml: runtime nodejs18',
    status: leapYml.includes('runtime: nodejs18'),
    message: leapYml.includes('runtime: nodejs18') ? '✅ Node.js 18 configured' : '❌ Runtime not set'
  });

  checks.push({
    name: 'leap.yml: analyze function',
    status: leapYml.includes('name: analyze'),
    message: leapYml.includes('name: analyze') ? '✅ Function configured' : '❌ Function missing'
  });

} catch (error) {
  checks.push({
    name: 'leap.yml validation',
    status: false,
    message: '❌ File not readable'
  });
}

// API handler validation
try {
  const apiHandler = fs.readFileSync('api/analyze.js', 'utf8');
  
  checks.push({
    name: 'API: Leap Cell handler',
    status: apiHandler.includes('export const handler'),
    message: apiHandler.includes('export const handler') ? '✅ Handler exported' : '❌ Handler not found'
  });

  checks.push({
    name: 'API: CORS configured',
    status: apiHandler.includes('Access-Control-Allow-Origin'),
    message: apiHandler.includes('Access-Control-Allow-Origin') ? '✅ CORS headers set' : '❌ CORS missing'
  });

} catch (error) {
  checks.push({
    name: 'API handler validation',
    status: false,
    message: '❌ File not readable'
  });
}

// Environment file check
const hasEnvExample = fs.existsSync('.env.example');
const hasEnvFile = fs.existsSync('.env');

checks.push({
  name: 'Environment: .env.example',
  status: hasEnvExample,
  message: hasEnvExample ? '✅ Template provided' : '❌ Missing template'
});

checks.push({
  name: 'Environment: .env (local)',
  status: hasEnvFile,
  message: hasEnvFile ? '✅ Local config found' : '⚠️  Create for local testing'
});

// Git ignore check
try {
  const gitignore = fs.readFileSync('.gitignore', 'utf8');
  
  checks.push({
    name: 'Git: .env ignored',
    status: gitignore.includes('.env'),
    message: gitignore.includes('.env') ? '✅ Environment files ignored' : '❌ Add .env to .gitignore'
  });

} catch (error) {
  checks.push({
    name: 'Git ignore validation',
    status: false,
    message: '❌ .gitignore not found'
  });
}

// Display results
console.log('📋 Deployment Readiness Report:\n');

let passedChecks = 0;
let totalChecks = checks.length;

checks.forEach(check => {
  console.log(`${check.message} ${check.name}`);
  if (check.status) passedChecks++;
});

console.log('\n' + '='.repeat(50));
console.log(`📊 Results: ${passedChecks}/${totalChecks} checks passed`);

if (passedChecks === totalChecks) {
  console.log('\n🎉 SUCCESS: Your project is ready for Leap Cell deployment!');
  console.log('\n📋 Next Steps:');
  console.log('1. Push to GitHub repository');
  console.log('2. Connect repository to Leap Cell');
  console.log('3. Set GROQ_API_KEY environment variable');
  console.log('4. Deploy and test');
} else {
  console.log('\n⚠️  WARNING: Some checks failed. Please fix the issues above.');
  console.log('\n🔧 Common fixes:');
  console.log('- Ensure all required files are present');
  console.log('- Check package.json dependencies');
  console.log('- Verify leap.yml configuration');
  console.log('- Add missing environment variables');
}

console.log('\n📖 For detailed deployment guide, see: GITHUB_DEPLOYMENT_SETUP.md');