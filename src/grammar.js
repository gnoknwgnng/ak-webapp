class GrammarChecker {
  constructor(groqClient) {
    this.groq = groqClient;
  }

  async analyzeGrammar(content) {
    try {
      // Split content into chunks for analysis
      const chunks = this.splitContent(content, 2000);
      const analyses = [];
      
      for (const chunk of chunks) {
        const analysis = await this.analyzeChunk(chunk);
        analyses.push(analysis);
      }
      
      return this.combineAnalyses(analyses);
      
    } catch (error) {
      console.error('Grammar analysis failed:', error);
      return {
        score: 5,
        errors: [],
        suggestions: [],
        improvements: [],
        summary: 'Grammar analysis failed'
      };
    }
  }

  async analyzeChunk(content) {
    try {
      const prompt = `Analyze this text for grammar, spelling, and readability issues:

"${content}"

Provide a JSON response with:
1. score (1-10, where 10 is perfect)
2. errors (array of specific grammar/spelling errors found)
3. suggestions (array of improvement suggestions)
4. readabilityLevel (beginner/intermediate/advanced)

Focus on:
- Grammar mistakes
- Spelling errors
- Sentence structure
- Clarity and readability
- Professional tone

Respond only with valid JSON.`;

      const completion = await this.groq.chat.completions.create({
        messages: [{ role: 'user', content: prompt }],
        model: 'llama3-8b-8192',
        temperature: 0.1,
        max_tokens: 800
      });

      const response = completion.choices[0]?.message?.content;
      
      try {
        return JSON.parse(response);
      } catch {
        // Fallback if JSON parsing fails
        return {
          score: 7,
          errors: [],
          suggestions: ['Consider reviewing for clarity and conciseness'],
          readabilityLevel: 'intermediate'
        };
      }
      
    } catch (error) {
      console.error('Chunk analysis failed:', error);
      return {
        score: 5,
        errors: [],
        suggestions: [],
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
        currentChunk = sentence + '.';
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
      score: 0,
      errors: [],
      suggestions: [],
      improvements: [],
      readabilityLevel: 'intermediate'
    };
    
    let totalScore = 0;
    let validAnalyses = 0;
    
    for (const analysis of analyses) {
      if (analysis.errors) combined.errors.push(...analysis.errors);
      if (analysis.suggestions) combined.suggestions.push(...analysis.suggestions);
      if (analysis.improvements) combined.improvements.push(...analysis.improvements);
      
      if (typeof analysis.score === 'number') {
        totalScore += analysis.score;
        validAnalyses++;
      }
    }
    
    combined.score = validAnalyses > 0 ? Math.round(totalScore / validAnalyses) : 5;
    
    return combined;
  }
}module.e
xports = { GrammarChecker };