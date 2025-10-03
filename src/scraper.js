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
      
      // Extract basic metadata
      const title = $('title').text().trim();
      const metaDescription = $('meta[name="description"]').attr('content') || '';
      const metaKeywords = $('meta[name="keywords"]').attr('content') || '';
      
      // Extract content
      const content = this.extractContent($);
      
      // Extract images
      const images = this.extractImages($, url);
      
      // Extract links
      const links = this.extractLinks($, url);
      
      // Extract headings structure
      const headings = this.extractHeadings($);
      
      return {
        title,
        metaDescription,
        metaKeywords,
        content,
        images,
        links,
        headings,
        wordCount: content.split(/\s+/).length,
        rawHtml: response.data
      };
      
    } catch (error) {
      console.error('Scraping failed:', error.message);
      throw new Error(`Failed to scrape website: ${error.message}`);
    }
  }

  extractContent($) {
    // Remove script and style elements
    $('script, style, nav, footer, aside').remove();
    
    // Extract main content
    const contentSelectors = [
      'main',
      'article',
      '.content',
      '#content',
      '.post-content',
      '.entry-content'
    ];
    
    let content = '';
    for (const selector of contentSelectors) {
      const element = $(selector);
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
    $('img').each((i, elem) => {
      const src = $(elem).attr('src');
      const alt = $(elem).attr('alt') || '';
      if (src) {
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
    $('a[href]').each((i, elem) => {
      const href = $(elem).attr('href');
      const text = $(elem).text().trim();
      if (href) {
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
    $('h1, h2, h3, h4, h5, h6').each((i, elem) => {
      headings.push({
        level: parseInt(elem.tagName.charAt(1)),
        text: $(elem).text().trim()
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
      const linkDomain = new URL(href, baseUrl).hostname;
      const baseDomain = new URL(baseUrl).hostname;
      return linkDomain !== baseDomain;
    } catch {
      return false;
    }
  }
}modul
e.exports = { WebScraper };module.expo
rts = { WebScraper };