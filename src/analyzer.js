const { Groq } = require('groq-sdk');
const { WebScraper } = require('./scraper.js');
const { SEOAnalyzer } = require('./seo.js');
const { GrammarChecker } = require('./grammar.js');

class WebsiteAnalyzer {
  constructor() {
    this.groq = new Groq({
      apiKey: process.env.GROQ_API_KEY || 'your-groq-api-key-here'
    });
    this.scraper = new WebScraper();
    this.seoAnalyzer = new SEOAnalyzer(this.groq);
    this.grammarChecker = new GrammarChecker(this.groq);
  }

  async analyzeWebsite(url) {
    try {
      console.log('Starting comprehensive website analysis...');

      // Step 1: Scrape website content
      console.log('Step 1: Scraping website...');
      const scrapedData = await this.scraper.scrapeWebsite(url);
      console.log('Scraping completed. Word count:', scrapedData.wordCount);

      // Step 2: Analyze grammar and get improvements
      console.log('Step 2: Analyzing grammar...');
      const grammarAnalysis = await this.grammarChecker.analyzeGrammar(scrapedData.content);
      console.log('Grammar analysis completed. Score:', grammarAnalysis.score);

      // Step 3: Perform SEO analysis
      console.log('Step 3: Performing SEO analysis...');
      const seoAnalysis = await this.seoAnalyzer.analyzeSEO(scrapedData, url);
      console.log('SEO analysis completed. Score:', seoAnalysis.overallScore);

      // Step 4: Generate performance metrics
      console.log('Step 4: Calculating performance metrics...');
      const performanceMetrics = this.calculatePerformanceMetrics(scrapedData, grammarAnalysis, seoAnalysis);
      console.log('Performance metrics calculated:', performanceMetrics);

      // Step 5: Generate structured report sections
      console.log('Step 5: Generating structured report...');
      const structuredReport = await this.generateStructuredReport({
        url,
        scrapedData,
        grammarAnalysis,
        seoAnalysis,
        performanceMetrics
      });
      console.log('Structured report generated successfully');

      const result = {
        success: true,
        url,
        timestamp: new Date().toISOString(),
        scrapedData,
        grammarAnalysis,
        seoAnalysis,
        performanceMetrics,
        structuredReport
      };

      console.log('Analysis completed successfully. Returning result.');
      return result;

    } catch (error) {
      console.error('Website analysis failed:', error);
      console.error('Error stack:', error.stack);
      throw error;
    }
  }

  calculatePerformanceMetrics(scrapedData, grammarAnalysis, seoAnalysis) {
    // Calculate overall scores
    const seoScore = seoAnalysis.overallScore || 0;
    const grammarScore = grammarAnalysis.score || 0;

    // Performance score based on technical factors
    let performanceScore = 100;
    if (scrapedData.wordCount < 300) performanceScore -= 20;
    if (scrapedData.images.filter(img => !img.hasAlt).length > 0) performanceScore -= 15;
    if (!scrapedData.title || scrapedData.title.length === 0) performanceScore -= 25;
    if (!scrapedData.metaDescription || scrapedData.metaDescription.length === 0) performanceScore -= 20;

    // Content quality score
    let contentScore = 70;
    if (scrapedData.wordCount > 500) contentScore += 10;
    if (scrapedData.headings.length > 3) contentScore += 10;
    if (scrapedData.links.length > 5) contentScore += 10;

    return {
      overall: Math.round((seoScore + grammarScore + performanceScore + contentScore) / 4),
      seo: seoScore,
      grammar: grammarScore,
      performance: Math.max(0, performanceScore),
      content: Math.min(100, contentScore),
      breakdown: {
        technicalIssues: this.countTechnicalIssues(scrapedData),
        contentIssues: grammarAnalysis.errors?.length || 0,
        seoIssues: this.countSEOIssues(seoAnalysis),
        totalIssues: 0
      }
    };
  }

  countTechnicalIssues(data) {
    let issues = 0;
    if (!data.title) issues++;
    if (!data.metaDescription) issues++;
    if (data.images.filter(img => !img.hasAlt).length > 0) issues++;
    if (data.wordCount < 300) issues++;
    return issues;
  }

  countSEOIssues(seoAnalysis) {
    let issues = 0;
    if (seoAnalysis.basicSEO?.issues) issues += seoAnalysis.basicSEO.issues.length;
    if (seoAnalysis.technicalSEO?.issues) issues += seoAnalysis.technicalSEO.issues.length;
    return issues;
  }

  async generateStructuredReport(data) {
    const executiveSummary = await this.generateExecutiveSummary(data);
    const technicalAnalysis = await this.generateTechnicalAnalysis(data);
    const contentAnalysis = await this.generateContentAnalysis(data);
    const seoRecommendations = await this.generateSEORecommendations(data);
    const actionPlan = await this.generateActionPlan(data);

    return {
      executiveSummary,
      technicalAnalysis,
      contentAnalysis,
      seoRecommendations,
      actionPlan,
      keywordStrategy: data.seoAnalysis.keywords || [],
      detailedFindings: await this.generateDetailedFindings(data)
    };
  }

  async generateExecutiveSummary(data) {
    const prompt = `Create an executive summary for website analysis of ${data.url}:

Website Stats:
- Title: ${data.scrapedData.title}
- Word Count: ${data.scrapedData.wordCount}
- Images: ${data.scrapedData.images.length}
- Links: ${data.scrapedData.links.length}

Performance Scores:
- SEO Score: ${data.performanceMetrics.seo}/100
- Grammar Score: ${data.performanceMetrics.grammar}/100
- Technical Score: ${data.performanceMetrics.performance}/100

Write a concise 2-3 paragraph executive summary highlighting:
1. Overall website health assessment
2. Top 3 strengths
3. Top 3 areas for improvement
4. Business impact of recommended changes

Keep it professional and actionable.`;

    const completion = await this.groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "openai/gpt-oss-20b",
      temperature: 0.6,
      max_completion_tokens: 800
    });

    return completion.choices[0]?.message?.content || 'Executive summary generation failed';
  }

  async generateTechnicalAnalysis(data) {
    const issues = [];
    const recommendations = [];

    // Analyze technical aspects
    if (!data.scrapedData.title) {
      issues.push({ type: 'critical', issue: 'Missing page title', impact: 'High SEO impact' });
    }
    if (!data.scrapedData.metaDescription) {
      issues.push({ type: 'high', issue: 'Missing meta description', impact: 'Reduced search visibility' });
    }

    const imagesWithoutAlt = data.scrapedData.images.filter(img => !img.hasAlt).length;
    if (imagesWithoutAlt > 0) {
      issues.push({
        type: 'medium',
        issue: `${imagesWithoutAlt} images missing alt text`,
        impact: 'Accessibility and SEO concerns'
      });
    }

    if (data.scrapedData.wordCount < 300) {
      issues.push({
        type: 'medium',
        issue: 'Content too short',
        impact: 'May not rank well for target keywords'
      });
    }

    return {
      pageStructure: {
        title: data.scrapedData.title || 'Missing',
        titleLength: data.scrapedData.title?.length || 0,
        metaDescription: data.scrapedData.metaDescription || 'Missing',
        metaDescriptionLength: data.scrapedData.metaDescription?.length || 0,
        headingStructure: data.scrapedData.headings,
        wordCount: data.scrapedData.wordCount
      },
      mediaOptimization: {
        totalImages: data.scrapedData.images.length,
        imagesWithAlt: data.scrapedData.images.filter(img => img.hasAlt).length,
        imagesWithoutAlt: imagesWithoutAlt
      },
      linkAnalysis: {
        totalLinks: data.scrapedData.links.length,
        internalLinks: data.scrapedData.links.filter(link => !link.isExternal).length,
        externalLinks: data.scrapedData.links.filter(link => link.isExternal).length
      },
      issues,
      recommendations
    };
  }

  async generateContentAnalysis(data) {
    return {
      grammarIssues: data.grammarAnalysis.errors || [],
      readabilityScore: data.grammarAnalysis.score || 0,
      contentQuality: {
        wordCount: data.scrapedData.wordCount,
        readabilityIssues: data.grammarAnalysis.readabilityIssues || [],
        improvements: data.grammarAnalysis.improvements || []
      },
      contentStructure: {
        headings: data.scrapedData.headings,
        paragraphs: Math.ceil(data.scrapedData.wordCount / 100),
        estimatedReadingTime: Math.ceil(data.scrapedData.wordCount / 200)
      }
    };
  }

  async generateSEORecommendations(data) {
    const recommendations = [];

    if (!data.scrapedData.title || data.scrapedData.title.length < 30) {
      recommendations.push({
        priority: 'high',
        category: 'Title Optimization',
        issue: 'Title tag needs optimization',
        recommendation: 'Create a compelling 50-60 character title with primary keyword',
        impact: 'Improved search rankings and click-through rates'
      });
    }

    if (!data.scrapedData.metaDescription || data.scrapedData.metaDescription.length < 120) {
      recommendations.push({
        priority: 'high',
        category: 'Meta Description',
        issue: 'Missing or inadequate meta description',
        recommendation: 'Write a compelling 150-160 character meta description',
        impact: 'Better search result snippets and higher CTR'
      });
    }

    const h1Count = data.scrapedData.headings.filter(h => h.level === 1).length;
    if (h1Count !== 1) {
      recommendations.push({
        priority: 'medium',
        category: 'Header Structure',
        issue: h1Count === 0 ? 'Missing H1 tag' : 'Multiple H1 tags found',
        recommendation: 'Use exactly one H1 tag per page with primary keyword',
        impact: 'Better content hierarchy and SEO structure'
      });
    }

    return {
      recommendations,
      keywordOpportunities: data.seoAnalysis.keywords || [],
      competitorInsights: await this.generateCompetitorInsights(data),
      technicalSEO: data.seoAnalysis.technicalSEO || {}
    };
  }

  async generateActionPlan(data) {
    const highPriority = [];
    const mediumPriority = [];
    const lowPriority = [];

    // Categorize issues by priority
    if (!data.scrapedData.title) {
      highPriority.push('Add page title with primary keyword');
    }
    if (!data.scrapedData.metaDescription) {
      highPriority.push('Create compelling meta description');
    }
    if (data.grammarAnalysis.errors?.length > 0) {
      highPriority.push(`Fix ${data.grammarAnalysis.errors.length} grammar/spelling errors`);
    }

    const imagesWithoutAlt = data.scrapedData.images.filter(img => !img.hasAlt).length;
    if (imagesWithoutAlt > 0) {
      mediumPriority.push(`Add alt text to ${imagesWithoutAlt} images`);
    }
    if (data.scrapedData.wordCount < 500) {
      mediumPriority.push('Expand content to improve depth and value');
    }

    if (data.scrapedData.links.filter(link => !link.isExternal).length < 3) {
      lowPriority.push('Add more internal links for better navigation');
    }

    return {
      immediate: highPriority,
      shortTerm: mediumPriority,
      longTerm: lowPriority,
      estimatedImpact: this.calculateEstimatedImpact(highPriority, mediumPriority, lowPriority)
    };
  }

  async generateCompetitorInsights(data) {
    // Placeholder for competitor analysis
    return {
      suggestedKeywords: data.seoAnalysis.keywords?.slice(0, 5) || [],
      contentGaps: ['Add more detailed product information', 'Include customer testimonials'],
      opportunityAreas: ['Local SEO optimization', 'Mobile user experience']
    };
  }

  calculateEstimatedImpact(high, medium, low) {
    const highImpact = high.length * 25;
    const mediumImpact = medium.length * 15;
    const lowImpact = low.length * 5;

    return {
      totalPotentialImprovement: Math.min(100, highImpact + mediumImpact + lowImpact),
      timeToImplement: `${high.length + medium.length} hours`,
      expectedROI: 'High - improved search visibility and user engagement'
    };
  }

  async generateDetailedFindings(data) {
    const prompt = `Generate detailed technical findings for ${data.url}:

Technical Data:
- Page Title: ${data.scrapedData.title || 'Missing'}
- Meta Description: ${data.scrapedData.metaDescription || 'Missing'}
- Word Count: ${data.scrapedData.wordCount}
- Images: ${data.scrapedData.images.length}
- Links: ${data.scrapedData.links.length}
- Headings: ${data.scrapedData.headings.length}

Grammar Issues: ${data.grammarAnalysis.errors?.length || 0}
SEO Score: ${data.performanceMetrics.seo}/100

Provide specific, actionable findings in these areas:
1. Content optimization opportunities
2. Technical SEO improvements needed
3. User experience enhancements
4. Conversion optimization suggestions

Be specific and include examples where possible.`;

    const completion = await this.groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "openai/gpt-oss-20b",
      temperature: 0.5,
      max_completion_tokens: 1500
    });

    return completion.choices[0]?.message?.content || 'Detailed findings generation failed';
  }
}
modu
le.exports = { WebsiteAnalyzer };
module.
exports = { WebsiteAnalyzer };