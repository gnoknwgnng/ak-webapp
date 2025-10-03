export class GrammarChecker {
  constructor(groqClient) {
    this.groq = groqClient;
  }

  async analyzeGrammar(content) {
    try {
      console.log('Analyzing grammar...');
      
      // Split content into chunks if too long
      const chunks = this.splitContent(content, 3000);
      const analyses = [];
      
      for (const chunk of chunks) {
        const analysis = await this.analyzeChunk(chunk);
        analyses.push(analysis);
      }
      
      return this.combineAnalyses(analyses);
      
    } catch (error) {
      console.error('Grammar analysis failed:', error);
      return {
        errors: [],
        suggestions: [],
        score: 0,
        summary: 'Grammar analysis failed'
      };
    }
  }

  async analyzeChunk(content) {
    const prompt = `Analyze the following text for grammar, spelling, and readability issues. Provide specific corrections and improvements:

Text to analyze:
"${content}"

Please provide:
1. Grammar errors with corrections
2. Spelling mistakes
3. Readability improvements
4. Style suggestions
5. Overall quality score (1-10)

Format as JSON with structure:
{
  "errors": [{"type": "grammar|spelling|style", "original": "text", "correction": "text", "explanation": "reason"}],
  "score": number,
  "readabilityIssues": ["issue1", "issue2"],
  "improvements": ["suggestion1", "suggestion2"]
}`;

    const completion = await this.groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "openai/gpt-oss-20b",
      temperature: 0.3,
      max_completion_tokens: 2048
    });

    try {
      const response = completion.choices[0]?.message?.content || '{}';
      return JSON.parse(response);
    } catch {
      return {
        errors: [],
        score: 5,
        readabilityIssues: [],
        improvements: []
      };
    }
  }

  splitContent(content, maxLength) {
    if (content.length <= maxLength) {
      return [content];
    }
    
    const chunks = [];
    const sentences = content.split(/[.!?]+/);
    let currentChunk = '';
    
    for (const sentence of sentences) {
      if ((currentChunk + sentence).length > maxLength && currentChunk) {
        chunks.push(currentChunk.trim());
        currentChunk = sentence;
      } else {
        currentChunk += sentence + '.';
      }
    }
    
    if (currentChunk) {
      chunks.push(currentChunk.trim());
    }
    
    return chunks;
  }

  combineAnalyses(analyses) {
    const combined = {
      errors: [],
      score: 0,
      readabilityIssues: [],
      improvements: []
    };
    
    let totalScore = 0;
    let validAnalyses = 0;
    
    for (const analysis of analyses) {
      if (analysis.errors) combined.errors.push(...analysis.errors);
      if (analysis.readabilityIssues) combined.readabilityIssues.push(...analysis.readabilityIssues);
      if (analysis.improvements) combined.improvements.push(...analysis.improvements);
      
      if (typeof analysis.score === 'number') {
        totalScore += analysis.score;
        validAnalyses++;
      }
    }
    
    combined.score = validAnalyses > 0 ? Math.round(totalScore / validAnalyses) : 5;
    
    return combined;
  }
}