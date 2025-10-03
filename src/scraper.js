const axios = require('axios');
const cheerio = require('cheerio');

class WebScraper {
  constructor() {
    this.axiosConfig = {
      timeout: 30000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    };
  }

  async scrapeWebsite(url) {
    try {
      console.log(`Scraping website: ${url}`);
      
      const response = await axios.get(url, this.axiosConfig);
      const $ = cheerio.load(response.data);
      
      // Extract basic information
      const title = $('title').text().trim();
      const metaDescription = $('meta[name="description"]').attr('content') || '';
      const metaKeywords = $('meta[name="keywords"]').attr('content') || '';
      
      // Extract content
      const content = this.extractContent($);
      const wordCount = content.split(/\s+/).filter(word => word.length > 0).length;
      
      // Extract images
      const images = this.extractImages($, url);
      
      // Extract links
      const links = this.extractLinks($, url);
      
      // Extract headings
      const headings = this.extractHeadings($);
      
      return {
        url,
        title,
        metaDescription,
        metaKeywords,
        content,
        wordCount,
        images,
        links,
        headings,
        scrapedAt: new Date().toISOString()
      };
      
    } catch (error) {
      console.error('Scraping failed:', error.message);
      throw new Error(`Failed to scrape website: ${error.message}`);
    }
  }

  extractContent($) {
    // Remove script and style elements
    $('script, style, nav, header, footer').remove();
    
    // Try to find main content area
    let content = '';
    const contentSelectors = ['main', 'article', '.content', '#content', '.post', '.entry'];
    
    for (const selector of contentSelectors) {
      const element = $(selector).first();
      if (element.length > 0) {
        content = element.text();
        break;
      }
    }
    
    // Fallback to body content
    if (!content) {
      content = $('body').text();
    }
    
    return content.replace(/\s+/g, ' ').trim();
  }

  extractImages($, baseUrl) {
    const images = [];
    $('img').each((index, element) => {
      const src = $(element).attr('src');
      if (src) {
        const alt = $(element).attr('alt') || '';
        images.push({
          src: this.resolveUrl(src, baseUrl),
          alt,
          hasAlt: !!alt
        });
      }
    });
    return images;
  }

  extractLinks($, baseUrl) {
    const links = [];
    $('a[href]').each((index, element) => {
      const href = $(element).attr('href');
      if (href) {
        const text = $(element).text().trim();
        links.push({
          href: this.resolveUrl(href, baseUrl),
          text,
          isExternal: this.isExternalLink(href, baseUrl)
        });
      }
    });
    return links;
  }

  extractHeadings($) {
    const headings = [];
    $('h1, h2, h3, h4, h5, h6').each((index, element) => {
      headings.push({
        level: parseInt(element.tagName.charAt(1)),
        text: $(element).text().trim()
      });
    });
    return headings;
  }

  resolveUrl(url, baseUrl) {
    try {
      return new URL(url, baseUrl).href;
    } catch {
      return url;
    }
  }

  isExternalLink(href, baseUrl) {
    try {
      const linkUrl = new URL(href, baseUrl);
      const baseUrlObj = new URL(baseUrl);
      return linkUrl.hostname !== baseUrlObj.hostname;
    } catch {
      return false;
    }
  }
}

module.exports = { WebScraper };