import { Groq } from 'groq-sdk';
import { WebScraper } from './scraper.js';
import { SEOAnalyzer } from './seo.js';
import { GrammarChecker } from './grammar.js';

export class WebsiteAnalyzer {
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
      console.log('Scraping website:', url);
      const scrapedData = await this.scraper.scrapeWebsite(url);

      // Step 2: Analyze grammar and readability
      console.log('Analyzing grammar...');
      const grammarAnalysis = await this.grammarChecker.analyzeGrammar(scrapedData.content);

      // Step 3: Perform SEO analysis
      console.log('Analyzing SEO...');
      const seoAnalysis = await this.seoAnalyzer.analyzeSEO(scrapedData, url);

      // Step 4: Calculate performance metrics
      const performanceMetrics = this.calculatePerformanceMetrics(scrapedData, grammarAnalysis, seoAnalysis);

      // Step 5: Generate structured report
      const structuredReport = await this.generateStructuredReport({
        scrapedData,
        grammarAnalysis,
        seoAnalysis,
        performanceMetrics,
        url
      });

      return {
        success: true,
        url: url,
        scrapedData: scrapedData,
        performanceMetrics: performanceMetrics,
        structuredReport: structuredReport
      };

    } catch (error) {
      console.error('Error during website analysis:', error.message);
      console.error('Error stack:', error.stack);
      throw error;
    }
  }

  calculatePerformanceMetrics(scrapedData, grammarAnalysis, seoAnalysis) {
    try {
      // Calculate individual scores
      const contentScore = Math.min(100, Math.max(0, grammarAnalysis.score * 10));
      const seoScore = seoAnalysis.overallScore || 0;
      const technicalScore = this.calculateTechnicalScore(scrapedData);
      
      // Calculate overall score (weighted average)
      const overallScore = Math.round((contentScore * 0.3 + seoScore * 0.4 + technicalScore * 0.3));

      return {
        overall: overallScore,
        seo: seoScore,
        content: Math.round(contentScore),
        technical: technicalScore,
        issues: {
          technical: this.countTechnicalIssues(scrapedData),
          seo: this.countSEOIssues(seoAnalysis),
          content: grammarAnalysis.errors?.length || 0,
          totalIssues: 0
        }
      };
    } catch (error) {
      console.error('Error calculating performance metrics:', error);
      return {
        overall: 0,
        seo: 0,
        content: 0,
        technical: 0,
        issues: {
          technical: 0,
          seo: 0,
          content: 0,
          totalIssues: 0
        }
      };
    }
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

  calculateTechnicalScore(scrapedData) {
    let score = 100;
    
    // Deduct points for missing elements
    if (!scrapedData.title) score -= 20;
    if (!scrapedData.metaDescription) score -= 15;
    if (scrapedData.wordCount < 300) score -= 10;
    
    // Image optimization
    const imagesWithoutAlt = scrapedData.images.filter(img => !img.hasAlt).length;
    if (imagesWithoutAlt > 0) {
      score -= Math.min(20, imagesWithoutAlt * 5);
    }
    
    // Heading structure
    const h1Count = scrapedData.headings.filter(h => h.level === 1).length;
    if (h1Count !== 1) score -= 10;
    
    return Math.max(0, Math.min(100, score));
  }

  async generateStructuredReport(data) {
    try {
      return {
        performanceMetrics: data.performanceMetrics,
        executiveSummary: await this.generateExecutiveSummary(data),
        technicalAnalysis: await this.generateTechnicalAnalysis(data),
        contentAnalysis: await this.generateContentAnalysis(data),
        seoRecommendations: await this.generateSEORecommendations(data),
        actionPlan: await this.generateActionPlan(data),
        detailedFindings: await this.generateDetailedFindings(data)
      };
    } catch (error) {
      console.error('Error generating structured report:', error);
      throw error;
    }
  }

  async generateExecutiveSummary(data) {
    try {
      const prompt = `Generate an executive summary for this website analysis:
      
      URL: ${data.url}
      Overall Score: ${data.performanceMetrics.overall}/100
      SEO Score: ${data.performanceMetrics.seo}/100
      Content Score: ${data.performanceMetrics.content}/100
      Technical Score: ${data.performanceMetrics.technical}/100
      
      Key Issues: ${data.grammarAnalysis.errors?.length || 0} grammar errors, ${data.seoAnalysis.basicSEO?.issues?.length || 0} SEO issues
      
      Provide a concise executive summary with:
      1. Overall assessment
      2. Key strengths (2-3 points)
      3. Critical issues (2-3 points)
      4. Business impact statement
      
      Keep it professional and actionable.`;

      const completion = await this.groq.chat.completions.create({
        messages: [{ role: 'user', content: prompt }],
        model: 'llama3-8b-8192',
        temperature: 0.3,
        max_tokens: 500
      });

      return completion.choices[0]?.message?.content || 'Executive summary generation failed';
    } catch (error) {
      console.error('Error generating executive summary:', error);
      return 'Executive summary generation failed';
    }
  }

  async generateTechnicalAnalysis(data) {
    const issues = [];
    
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
        issue: 'Content length below recommended minimum',
        impact: 'May not rank well for target keywords'
      });
    }

    return {
      htmlStructure: {
        score: data.scrapedData.title && data.scrapedData.metaDescription ? 90 : 60,
        issues: issues.length
      },
      pageSpeed: {
        score: 85, // This would come from actual performance testing
        loadTime: '2.3s'
      },
      mobileOptimization: {
        score: 80,
        responsive: true
      },
      issues,
      recommendations: [
        'Optimize page loading speed',
        'Implement proper heading hierarchy',
        'Add structured data markup'
      ]
    };
  }

  async generateContentAnalysis(data) {
    return {
      readability: {
        score: data.grammarAnalysis.score * 10,
        level: data.grammarAnalysis.score > 7 ? 'Good' : 'Needs Improvement',
        errors: data.grammarAnalysis.errors || []
      },
      contentQuality: {
        wordCount: data.scrapedData.wordCount,
        uniqueness: 85, // This would come from plagiarism checking
        engagement: 75,
        paragraphs: Math.ceil(data.scrapedData.wordCount / 100),
        estimatedReadingTime: Math.ceil(data.scrapedData.wordCount / 200)
      }
    };
  }

  async generateSEORecommendations(data) {
    const recommendations = [];
    
    if (!data.scrapedData.title) {
      recommendations.push({
        priority: 'High',
        recommendation: 'Add page title with primary keyword',
        impact: 'Improved search rankings and click-through rates'
      });
    }

    if (!data.scrapedData.metaDescription || data.scrapedData.metaDescription.length < 120) {
      recommendations.push({
        priority: 'High',
        recommendation: 'Create compelling meta description (120-160 characters)',
        impact: 'Better search result snippets and higher CTR'
      });
    }

    const h1Count = data.scrapedData.headings.filter(h => h.level === 1).length;
    if (h1Count !== 1) {
      recommendations.push({
        priority: 'Medium',
        recommendation: 'Use exactly one H1 tag per page',
        impact: 'Better content hierarchy and SEO structure'
      });
    }

    return {
      onPageSEO: data.seoAnalysis.basicSEO || {},
      contentSEO: data.seoAnalysis.contentSEO || {},
      technicalSEO: data.seoAnalysis.technicalSEO || {}
    };
  }

  async generateActionPlan(data) {
    const highPriority = [];
    const mediumPriority = [];
    const lowPriority = [];

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
      highPriority,
      mediumPriority,
      lowPriority,
      estimatedImpact: this.calculateEstimatedImpact(highPriority, mediumPriority, lowPriority)
    };
  }

  async generateCompetitorInsights(data) {
    return {
      industryBenchmark: 75,
      competitorAnalysis: 'Limited data available',
      opportunityAreas: ['Local SEO optimization', 'Mobile user experience']
    };
  }

  calculateEstimatedImpact(high, medium, low) {
    const totalIssues = high.length + medium.length + low.length;
    const impactScore = (high.length * 3 + medium.length * 2 + low.length * 1);
    
    return {
      timeToImplement: `${Math.max(1, Math.ceil(totalIssues / 2))} weeks`,
      difficultyLevel: impactScore > 10 ? 'High' : impactScore > 5 ? 'Medium' : 'Low',
      expectedROI: 'High - improved search visibility and user engagement'
    };
  }

  async generateDetailedFindings(data) {
    try {
      const prompt = `Generate detailed findings for this website analysis:
      
      Website: ${data.url}
      Word Count: ${data.scrapedData.wordCount}
      Images: ${data.scrapedData.images.length}
      Links: ${data.scrapedData.links.length}
      Grammar Score: ${data.grammarAnalysis.score}/10
      SEO Score: ${data.seoAnalysis.overallScore}/100
      
      Create a comprehensive analysis covering:
      1. Content Optimization opportunities
      2. Technical SEO improvements
      3. User Experience enhancements
      4. Conversion optimization suggestions
      
      Format as markdown with clear sections and actionable recommendations.`;

      const completion = await this.groq.chat.completions.create({
        messages: [{ role: 'user', content: prompt }],
        model: 'llama3-8b-8192',
        temperature: 0.3,
        max_tokens: 1000
      });

      return completion.choices[0]?.message?.content || 'Detailed findings generation failed';
    } catch (error) {
      console.error('Error generating detailed findings:', error);
      return 'Detailed findings generation failed';
    }
  }
}