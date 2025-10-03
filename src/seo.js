class SEOAnalyzer {
  constructor(groqClient) {
    this.groq = groqClient;
  }

  async analyzeSEO(scrapedData, url) {
    try {
      console.log('Analyzing SEO...');
      
      const basicSEO = this.analyzeBasicSEO(scrapedData);
      const contentSEO = await this.analyzeContentSEO(scrapedData);
      const technicalSEO = this.analyzeTechnicalSEO(scrapedData);
      const keywords = await this.extractKeywords(scrapedData.content);
      
      return {
        basicSEO,
        contentSEO,
        technicalSEO,
        keywords,
        overallScore: this.calculateSEOScore(basicSEO, contentSEO, technicalSEO)
      };
      
    } catch (error) {
      console.error('SEO analysis failed:', error);
      return {
        basicSEO: {},
        contentSEO: {},
        technicalSEO: {},
        keywords: [],
        overallScore: 0
      };
    }
  }

  analyzeBasicSEO(data) {
    const issues = [];
    const recommendations = [];
    
    // Title analysis
    const titleLength = data.title.length;
    if (titleLength === 0) {
      issues.push('Missing page title');
    } else if (titleLength < 30) {
      issues.push('Title too short (< 30 characters)');
    } else if (titleLength > 60) {
      issues.push('Title too long (> 60 characters)');
    }
    
    // Meta description analysis
    const descLength = data.metaDescription.length;
    if (descLength === 0) {
      issues.push('Missing meta description');
    } else if (descLength < 120) {
      issues.push('Meta description too short (< 120 characters)');
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
      title: {
        text: data.title,
        length: titleLength,
        status: titleLength >= 30 && titleLength <= 60 ? 'good' : 'needs-improvement'
      },
      metaDescription: {
        text: data.metaDescription,
        length: descLength,
        status: descLength >= 120 && descLength <= 160 ? 'good' : 'needs-improvement'
      },
      headings: {
        structure: data.headings,
        h1Count,
        status: h1Count === 1 ? 'good' : 'needs-improvement'
      },
      images: {
        total: data.images.length,
        withoutAlt: imagesWithoutAlt,
        status: imagesWithoutAlt === 0 ? 'good' : 'needs-improvement'
      },
      issues,
      recommendations
    };
  }

  async analyzeContentSEO(data) {
    const prompt = `Analyze the following content for SEO optimization:

Title: ${data.title}
Meta Description: ${data.metaDescription}
Content: ${data.content.substring(0, 2000)}...

Provide SEO analysis including:
1. Keyword density and distribution
2. Content quality and relevance
3. Readability for search engines
4. Content structure recommendations
5. Missing SEO elements

Format as JSON:
{
  "keywordDensity": {"keyword": percentage},
  "contentQuality": "score 1-10",
  "readability": "score 1-10",
  "recommendations": ["rec1", "rec2"],
  "missingElements": ["element1", "element2"]
}`;

    try {
      const completion = await this.groq.chat.completions.create({
        messages: [{ role: "user", content: prompt }],
        model: "openai/gpt-oss-20b",
        temperature: 0.3,
        max_completion_tokens: 1024
      });

      const response = completion.choices[0]?.message?.content || '{}';
      return JSON.parse(response);
    } catch {
      return {
        keywordDensity: {},
        contentQuality: 5,
        readability: 5,
        recommendations: [],
        missingElements: []
      };
    }
  }

  analyzeTechnicalSEO(data) {
    const issues = [];
    
    // Content length
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
      wordCount: data.wordCount,
      links: {
        internal: internalLinks,
        external: externalLinks,
        total: data.links.length
      },
      issues
    };
  }

  async extractKeywords(content) {
    const prompt = `Extract the top 10 most important keywords and phrases from this content for SEO purposes:

"${content.substring(0, 1500)}"

Return as JSON array of objects:
[{"keyword": "term", "relevance": "high|medium|low", "frequency": number}]`;

    try {
      const completion = await this.groq.chat.completions.create({
        messages: [{ role: "user", content: prompt }],
        model: "openai/gpt-oss-20b",
        temperature: 0.3,
        max_completion_tokens: 512
      });

      const response = completion.choices[0]?.message?.content || '[]';
      return JSON.parse(response);
    } catch {
      return [];
    }
  }

  calculateSEOScore(basicSEO, contentSEO, technicalSEO) {
    let score = 0;
    let maxScore = 0;
    
    // Basic SEO scoring
    if (basicSEO.title?.status === 'good') score += 20;
    maxScore += 20;
    
    if (basicSEO.metaDescription?.status === 'good') score += 15;
    maxScore += 15;
    
    if (basicSEO.headings?.status === 'good') score += 15;
    maxScore += 15;
    
    if (basicSEO.images?.status === 'good') score += 10;
    maxScore += 10;
    
    // Content SEO scoring
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
}module.ex
ports = { SEOAnalyzer };modu
le.exports = { SEOAnalyzer };