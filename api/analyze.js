export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const report = {
    performanceMetrics: {
      overall: 85,
      seo: 80,
      content: 90,
      technical: 85,
      issues: {
        technical: 0,
        seo: 1,
        content: 0,
        totalIssues: 1
      }
    },
    executiveSummary: {
      overallAssessment: "Website performance is good with a score of 85/100.",
      keyStrengths: ["Page title is present", "Adequate content length"],
      criticalIssues: ["Missing meta description"],
      businessImpact: "Improving these areas will enhance search visibility and user experience."
    },
    technicalAnalysis: {
      htmlStructure: { score: 90, issues: 1 },
      pageSpeed: { score: 85, loadTime: '2.3s' },
      mobileOptimization: { score: 80, responsive: true },
      issues: [{ type: 'high', issue: 'Missing meta description', impact: 'Reduced search visibility' }],
      recommendations: ['Create meta description', 'Optimize images with alt text']
    },
    seoRecommendations: {
      onPageSEO: { score: 85, recommendations: [{ priority: 'High', recommendation: 'Create compelling meta description (120-160 chars)', impact: 'Better CTR' }] },
      technicalSEO: { score: 75, issues: [] }
    },
    actionPlan: {
      highPriority: ['Create compelling meta description'],
      mediumPriority: ['Expand content to improve depth and value'],
      lowPriority: [],
      estimatedImpact: 'High - improved search visibility and user engagement'
    },
    detailedFindings: `## Content Optimization
- **Word Count**: 450 words
- **Title**: Sample Website Title
- **Images**: 5 total images found
- **Links**: 10 total links found

## Technical SEO
- **URL Structure**: Clean and readable
- **Page Speed**: Good performance detected
- **Mobile Friendly**: Responsive design elements found`
  };

  res.json(report);
}