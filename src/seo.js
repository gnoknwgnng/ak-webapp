export class SEOAnalyzer {
  constructor(groqClient) {
    this.groq = groqClient;
  }

  async analyzeSEO(scrapedData, url) {
    try {
      const basicSEO = this.analyzeBasicSEO(scrapedData);
      const contentSEO = await this.analyzeContentSEO(scrapedData);
      const technicalSEO = this.analyzeTechnicalSEO(scrapedData);
      
      const overallScore = this.calculateSEOScore(basicSEO, contentSEO, technicalSEO);
      
      return {
        basicSEO,
        contentSEO,
        technicalSEO,
        overallScore
      };
    } catch (error) {
      console.error('SEO analysis failed:', error);
      return {
        basicSEO: { score: 0, issues: [], recommendations: [] },
        contentSEO: { score: 0, keywords: [], readability: 0 },
        technicalSEO: { score: 0, issues: [] },
        overallScore: 0
      };
    }
  }

  analyzeBasicSEO(data) {
    const issues = [];
    const recommendations = [];
    
    // Title analysis
    const titleLength = data.title ? data.title.length : 0;
    if (!data.title) {
      issues.push('Missing page title');
      recommendations.push('Add a descriptive page title (50-60 characters)');
    } else if (titleLength > 60) {
      issues.push('Title too long (> 60 characters)');
    }
    
    // Meta description analysis
    const descLength = data.metaDescription ? data.metaDescription.length : 0;
    if (!data.metaDescription) {
      issues.push('Missing meta description');
      recommendations.push('Add meta description (120-160 characters)');
    } else if (descLength > 160) {
      issues.push('Meta description too long (> 160 characters)');
    }
    
    // Headings analysis
    const h1Count = data.headings.filter(h => h.level === 1).length;
    if (h1Count === 0) {
      issues.push('Missing H1 tag');
    } else if (h1Count > 1) {
      issues.push('Multiple H1 tags found');
    }
    
    // Images analysis
    const imagesWithoutAlt = data.images.filter(img => !img.hasAlt).length;
    if (imagesWithoutAlt > 0) {
      issues.push(`${imagesWithoutAlt} images missing alt text`);
    }
    
    return {
      score: Math.max(0, 100 - (issues.length * 15)),
      issues,
      recommendations,
      titleAnalysis: {
        present: !!data.title,
        length: titleLength,
        optimal: titleLength >= 30 && titleLength <= 60
      },
      metaAnalysis: {
        present: !!data.metaDescription,
        length: descLength,
        optimal: descLength >= 120 && descLength <= 160
      },
      headingAnalysis: {
        h1Count,
        totalHeadings: data.headings.length,
        hierarchy: this.analyzeHeadingHierarchy(data.headings)
      }
    };
  }

  async analyzeContentSEO(data) {
    try {
      const keywords = await this.extractKeywords(data.content);
      const readability = this.calculateReadability(data.content);
      const contentQuality = this.assessContentQuality(data);
      
      return {
        score: Math.round((readability + contentQuality) / 2),
        keywords: keywords.slice(0, 10), // Top 10 keywords
        readability,
        contentQuality,
        wordCount: data.wordCount,
        keywordDensity: this.calculateKeywordDensity(data.content, keywords),
        missingElements: []
      };
    } catch (error) {
      console.error('Content SEO analysis failed:', error);
      return {
        score: 0,
        keywords: [],
        readability: 0,
        contentQuality: 0,
        wordCount: data.wordCount,
        keywordDensity: {},
        missingElements: []
      };
    }
  }

  analyzeTechnicalSEO(data) {
    const issues = [];
    
    // Content length check
    if (data.wordCount < 300) {
      issues.push('Content too short (< 300 words)');
    }
    
    // Internal vs external links
    const internalLinks = data.links.filter(link => !link.isExternal).length;
    const externalLinks = data.links.filter(link => link.isExternal).length;
    
    if (internalLinks === 0) {
      issues.push('No internal links found');
    }
    
    return {
      score: Math.max(0, 100 - (issues.length * 20)),
      internalLinks,
      externalLinks,
      totalLinks: data.links.length,
      imageOptimization: this.analyzeImageOptimization(data.images),
      issues
    };
  }

  async extractKeywords(content) {
    try {
      // Simple keyword extraction - in production, use more sophisticated NLP
      const words = content.toLowerCase()
        .replace(/[^\w\s]/g, ' ')
        .split(/\s+/)
        .filter(word => word.length > 3)
        .filter(word => !this.isStopWord(word));
      
      const frequency = {};
      words.forEach(word => {
        frequency[word] = (frequency[word] || 0) + 1;
      });
      
      return Object.entries(frequency)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 20)
        .map(([word, count]) => ({ word, count }));
    } catch {
      return [];
    }
  }

  calculateSEOScore(basicSEO, contentSEO, technicalSEO) {
    let score = 0;
    let maxScore = 0;
    
    // Basic SEO (40% weight)
    score += basicSEO.score * 0.4;
    maxScore += 40;
    
    // Content SEO (40% weight)
    if (contentSEO.contentQuality) {
      score += (contentSEO.contentQuality / 10) * 20;
    }
    maxScore += 20;
    
    if (contentSEO.readability) {
      score += (contentSEO.readability / 10) * 20;
    }
    maxScore += 20;
    
    return Math.round((score / maxScore) * 100);
  }
}