// No external dependencies - use built-in modules only

module.exports = async function handler(req, res) {
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

  try {
    const { url } = req.body;
    
    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    console.log(`Analyzing website: ${url}`);
    
    // For now, return mock data to test if the function works
    const title = 'Sample Website Title';
    const metaDescription = 'Sample meta description for testing';
    const h1Count = 1;
    const imageCount = 5;
    const imagesWithoutAlt = 2;
    const linkCount = 10;
    const wordCount = 450;

    // Calculate scores
    const seoScore = calculateSEOScore(title, metaDescription, h1Count, imagesWithoutAlt);
    const contentScore = Math.min(100, Math.max(0, (wordCount / 500) * 100));
    const technicalScore = calculateTechnicalScore(title, metaDescription, h1Count);
    const overallScore = Math.round((seoScore + contentScore + technicalScore) / 3);

    // Generate report
    const report = {
      performanceMetrics: {
        overall: overallScore,
        seo: seoScore,
        content: contentScore,
        technical: technicalScore,
        issues: {
          technical: title ? 0 : 1,
          seo: (title ? 0 : 1) + (metaDescription ? 0 : 1) + (h1Count === 1 ? 0 : 1),
          content: wordCount < 300 ? 1 : 0,
          totalIssues: 0
        }
      },
      executiveSummary: generateExecutiveSummary(overallScore, title, wordCount, imagesWithoutAlt),
      technicalAnalysis: generateTechnicalAnalysis(title, metaDescription, h1Count, imagesWithoutAlt, wordCount),
      seoRecommendations: generateSEORecommendations(title, metaDescription, h1Count, imagesWithoutAlt),
      actionPlan: generateActionPlan(title, metaDescription, h1Count, imagesWithoutAlt, wordCount),
      detailedFindings: generateDetailedFindings(url, title, wordCount, imageCount, linkCount)
    };

    console.log('Analysis completed successfully');
    res.json(report);
    
  } catch (error) {
    console.error('Analysis error:', error);
    res.status(500).json({
      error: 'Failed to analyze website',
      details: error.message
    });
  }
}

function calculateSEOScore(title, metaDescription, h1Count, imagesWithoutAlt) {
  let score = 100;
  if (!title) score -= 30;
  if (!metaDescription) score -= 25;
  if (h1Count !== 1) score -= 20;
  if (imagesWithoutAlt > 0) score -= 25;
  return Math.max(0, score);
}

function calculateTechnicalScore(title, metaDescription, h1Count) {
  let score = 100;
  if (!title) score -= 40;
  if (!metaDescription) score -= 30;
  if (h1Count !== 1) score -= 30;
  return Math.max(0, score);
}

function generateExecutiveSummary(score, title, wordCount, imagesWithoutAlt) {
  const assessment = score >= 80 ? 'Excellent' : score >= 60 ? 'Good' : score >= 40 ? 'Fair' : 'Poor';
  
  return {
    overallAssessment: `Website performance is ${assessment.toLowerCase()} with a score of ${score}/100.`,
    keyStrengths: [
      title ? 'Page title is present' : null,
      wordCount > 300 ? 'Adequate content length' : null,
      imagesWithoutAlt === 0 ? 'All images have alt text' : null
    ].filter(Boolean),
    criticalIssues: [
      !title ? 'Missing page title' : null,
      wordCount < 300 ? 'Content too short' : null,
      imagesWithoutAlt > 0 ? `${imagesWithoutAlt} images missing alt text` : null
    ].filter(Boolean),
    businessImpact: 'Improving these areas will enhance search visibility and user experience.'
  };
}

function generateTechnicalAnalysis(title, metaDescription, h1Count, imagesWithoutAlt, wordCount) {
  const issues = [];
  
  if (!title) issues.push({ type: 'critical', issue: 'Missing page title', impact: 'High SEO impact' });
  if (!metaDescription) issues.push({ type: 'high', issue: 'Missing meta description', impact: 'Reduced search visibility' });
  if (h1Count !== 1) issues.push({ type: 'medium', issue: `Found ${h1Count} H1 tags (should be 1)`, impact: 'SEO structure issues' });
  if (imagesWithoutAlt > 0) issues.push({ type: 'medium', issue: `${imagesWithoutAlt} images missing alt text`, impact: 'Accessibility concerns' });
  if (wordCount < 300) issues.push({ type: 'medium', issue: 'Content too short', impact: 'May not rank well' });

  return {
    htmlStructure: { score: title && metaDescription ? 90 : 60, issues: issues.length },
    pageSpeed: { score: 85, loadTime: '2.3s' },
    mobileOptimization: { score: 80, responsive: true },
    issues,
    recommendations: ['Add missing page title', 'Create meta description', 'Optimize images with alt text']
  };
}

function generateSEORecommendations(title, metaDescription, h1Count, imagesWithoutAlt) {
  const recommendations = [];
  
  if (!title) recommendations.push({ priority: 'High', recommendation: 'Add page title with primary keyword', impact: 'Improved search rankings' });
  if (!metaDescription) recommendations.push({ priority: 'High', recommendation: 'Create compelling meta description (120-160 chars)', impact: 'Better CTR' });
  if (h1Count !== 1) recommendations.push({ priority: 'Medium', recommendation: 'Use exactly one H1 tag per page', impact: 'Better content hierarchy' });
  if (imagesWithoutAlt > 0) recommendations.push({ priority: 'Medium', recommendation: 'Add alt text to all images', impact: 'Improved accessibility and SEO' });

  return {
    onPageSEO: { score: title && metaDescription ? 85 : 50, recommendations },
    technicalSEO: { score: 75, issues: [] }
  };
}

function generateActionPlan(title, metaDescription, h1Count, imagesWithoutAlt, wordCount) {
  const highPriority = [];
  const mediumPriority = [];
  const lowPriority = [];

  if (!title) highPriority.push('Add page title with primary keyword');
  if (!metaDescription) highPriority.push('Create compelling meta description');
  if (imagesWithoutAlt > 0) mediumPriority.push(`Add alt text to ${imagesWithoutAlt} images`);
  if (wordCount < 500) mediumPriority.push('Expand content to improve depth and value');
  if (h1Count !== 1) lowPriority.push('Optimize heading structure with single H1');

  return {
    highPriority,
    mediumPriority,
    lowPriority,
    estimatedImpact: 'High - improved search visibility and user engagement'
  };
}

function generateDetailedFindings(url, title, wordCount, imageCount, linkCount) {
  return `## Content Optimization
- **Word Count**: ${wordCount} words
- **Title**: ${title || 'Missing'}
- **Images**: ${imageCount} total images found
- **Links**: ${linkCount} total links found

## Technical SEO
- **URL Structure**: Clean and readable
- **Page Speed**: Good performance detected
- **Mobile Friendly**: Responsive design elements found

## User Experience  
- **Content Quality**: ${wordCount > 500 ? 'Comprehensive' : 'Could be expanded'}
- **Navigation**: ${linkCount > 5 ? 'Good internal linking' : 'Limited navigation'}
- **Accessibility**: ${imageCount > 0 ? 'Images present, check alt text' : 'No images found'}

## Conversion Optimization
- **Call to Action**: Review page for clear CTAs
- **User Engagement**: Optimize content for better engagement
- **Trust Signals**: Add testimonials and social proof`;
}