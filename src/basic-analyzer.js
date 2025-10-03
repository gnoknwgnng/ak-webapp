er(img => !img.hasAlt).length;
  if (imagesWithoutAlt > 0) {
    recommendations.push(`Add alt text to ${imagesWithoutAlt} images for better accessibility`);
  }
  
  if (data.wordCount < 300) {
    recommendations.push('Increase content length to at least 300 words');
  }
  
  return recommendations.length > 0 ? 
    'SEO Recommendations:\n' + recommendations.map(rec => `• ${rec}`).join('\n') :
    'Great SEO foundation! Continue monitoring and optimizing.';
}

function generateDetailedFindings(data, metrics) {
  return `Detailed Website Analysis Report

URL: ${data.url}
Analysis Date: ${new Date().toLocaleDateString()}

CONTENT ANALYSIS:
- Word Count: ${data.wordCount}
- Reading Time: ~${Math.ceil(data.wordCount / 200)} minutes
- Heading Structure: ${data.headings.length} headings found
- Content Quality Score: ${metrics.content}/100

SEO ANALYSIS:
- Title Optimization: ${data.title ? 'Present' : 'Needs Attention'}
- Meta Description: ${data.metaDescription ? 'Present' : 'Missing'}
- SEO Score: ${metrics.seo}/100

TECHNICAL ANALYSIS:
- Image Optimization: ${data.images.filter(img => img.hasAlt).length}/${data.images.length} images have alt text
- Link Analysis: ${data.links.length} links found
- Technical Score: ${metrics.technical}/100

RECOMMENDATIONS:
${generateSEORecommendations(data)}

This analysis provides a comprehensive overview of your website's current performance and optimization opportunities.`;
}

module.exports = { analyzeWebsite };