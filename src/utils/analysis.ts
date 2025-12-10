import Anthropic from '@anthropic-ai/sdk';

export interface AnalysisResult {
  totalPrompts: number;
  peakHour: number;
  peakHourCount: number;
  topTopics: { word: string; count: number }[];
  prompts: string[];
  persona?: {
    title: string;
    vibe: string;
    redFlag: string;
    archetype: string;
    
    // New Spicy Fields
    genZArchetype: string;
    genZDescription: string;
    toxicTrait: string;
    exposedSecret: string;
    toxicityScore: number; // 0-100
    contentDiet: string;
  };
}

const STOP_WORDS = new Set([
  "a", "an", "the", "in", "on", "at", "for", "to", "of", "with", "by", "from", 
  "and", "or", "but", "is", "are", "was", "were", "be", "been", "being", 
  "have", "has", "had", "do", "does", "did", "can", "could", "will", "would", 
  "should", "may", "might", "must", "i", "you", "he", "she", "it", "we", "they", 
  "me", "him", "her", "us", "them", "my", "your", "his", "its", "our", "their",
  "what", "where", "when", "why", "how", "who", "which", "this", "that", "these", 
  "those", "please", "thank", "thanks", "hello", "hi", "hey", "help", "write", 
  "rewrite", "code", "explain", "make", "create"
]);

// Step 1: Define the Tool Schema for Claude
const PERSONA_ANALYSIS_TOOL = {
  name: "generate_user_persona",
  description: "Analyzes user data to generate a witty, roasted persona profile in the style of 'Spotify Wrapped'",
  input_schema: {
    type: "object",
    properties: {
      title: {
        type: "string",
        description: "A creative, edgy 2-3 word title for the user's persona (e.g., 'The Panic Coder', 'The Midnight Philosopher')"
      },
      archetype: {
        type: "string",
        enum: ["The Architect", "The Poet", "The Oracle", "The Fixer", "The Dreamer", "The Skeptic"],
        description: "The classic archetypal category that best fits the user"
      },
      vibe: {
        type: "string",
        description: "A single witty, roasted sentence that captures the user's overall vibe"
      },
      redFlag: {
        type: "string",
        description: "A specific, funny 'red flag' observation about the user's habits or behavior"
      },
      
      // New Spicy Fields
      genZArchetype: {
        type: "string",
        description: "A Gen Z specific internet slang archetype (e.g., 'Terminal Rot', 'Corporate Baddie', 'Academic Victim', 'Delulu Lemon', 'Main Character', 'Reply Guy')"
      },
      genZDescription: {
        type: "string",
        description: "A short, funny definition of why they fit this Gen Z archetype"
      },
      toxicTrait: {
        type: "string",
        description: "A slightly controversial, spicy observation about their worst habit (e.g., 'Gatekeeps minimal knowledge', 'Trauma dumps on AI')"
      },
      exposedSecret: {
        type: "string",
        description: "A 'receipt' or specific deduction based on their data (e.g., 'You spent more on Outside Food than Rent')"
      },
      toxicityScore: {
        type: "number",
        description: "A humorous toxicity score from 0 to 100 based on how chaotic/unhinged their data is"
      },
      contentDiet: {
        type: "string",
        description: "A 2-3 word summary of what they consume (e.g., 'Brainrot & Docs', 'Hustle Porn', 'Sad Beige Content')"
      }
    },
    required: ["title", "archetype", "vibe", "redFlag", "genZArchetype", "genZDescription", "toxicTrait", "exposedSecret", "toxicityScore", "contentDiet"]
  }
};

export const processConversations = async (
  file: File, 
  apiKey: string | null
): Promise<AnalysisResult> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const text = e.target?.result as string;
        const data = JSON.parse(text);
        
        if (Array.isArray(data)) {
          // Standard ChatGPT Export
          const result = await analyzeData(data, apiKey);
          resolve(result);
        } else if (typeof data === 'object' && data !== null) {
          // Custom "Life Context" / JSON Format
          const result = await analyzeProfileData(data, apiKey);
          resolve(result);
        } else {
          reject(new Error("Unknown JSON format"));
        }
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = (err) => reject(err);
    reader.readAsText(file);
  });
};

// Step 2: Call Claude with Tool Calling for Profile Data
const analyzeProfileData = async (data: any, apiKey: string | null): Promise<AnalysisResult> => {
  let totalPrompts = 0;
  const wordCounts: Record<string, number> = {};
  const longPrompts: string[] = [];
  
  // Recursively extract text and count nodes
  const extractText = (obj: any) => {
    if (typeof obj === 'string') {
      totalPrompts++;
      if (obj.length > 20) longPrompts.push(obj);
      
      const words = obj.toLowerCase().match(/\b\w+\b/g) || [];
      words.forEach((w: string) => {
        if (!STOP_WORDS.has(w) && w.length > 3) {
          wordCounts[w] = (wordCounts[w] || 0) + 1;
        }
      });
      return;
    }
    
    if (typeof obj === 'number') {
      totalPrompts++;
      return;
    }

    if (Array.isArray(obj)) {
      obj.forEach(item => extractText(item));
      return;
    }

    if (typeof obj === 'object' && obj !== null) {
      Object.values(obj).forEach(val => extractText(val));
    }
  };

  extractText(data);

  // Simulate a "Productive Builder" schedule
  const hourCounts = new Array(24).fill(0);
  for (let i = 0; i < totalPrompts; i++) {
     const randomHour = 9 + Math.floor(Math.random() * 10);
     hourCounts[randomHour]++;
  }

  let peakHour = 0;
  let peakHourCount = 0;
  hourCounts.forEach((count, hour) => {
    if (count > peakHourCount) {
      peakHourCount = count;
      peakHour = hour;
    }
  });

  const topTopics = Object.entries(wordCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)
    .map(([word, count]) => ({ word, count }));

  const analysis: AnalysisResult = {
    totalPrompts,
    peakHour,
    peakHourCount,
    topTopics,
    prompts: longPrompts,
  };

  // Step 3: Semantic Analysis with Claude Tool Calling
  if (apiKey) {
    try {
      const anthropic = new Anthropic({
        apiKey: apiKey,
        dangerouslyAllowBrowser: true
      });

      const samplePrompts = longPrompts.sort(() => 0.5 - Math.random()).slice(0, 50);

      // System prompt with detailed context
      const systemPrompt = `You are a "Brutally Honest Roast Master" and "Digital Psychologist".

Your role is to analyze user data (structured JSON from their personal life dashboard, projects, goals, expenses, or chat history) and create a viral "Spotify Wrapped" style persona.

**YOUR GOAL:** Find the "Juice". Look for controversial, embarrassing, or surprisingly specific details in their data to roast them.

**WHAT TO LOOK FOR:**
- **Expenses:** Do they spend more on food than rent? Do they have weird subscriptions?
- **Goals:** Are their goals unrealistic? ("Become a billionaire in 6 months")
- **Projects:** Are they over-engineering simple things? 
- **Relationships:** Any mention of exes, "situationships", or specific friends?
- **Tone:** Are they polite to AI? Do they trauma dump?

**OUTPUT GUIDELINES:**
- **Gen Z Archetype:** Use modern internet slang (e.g., "Academic Victim", "Corporate Baddie", "Delulu Lemon").
- **Exposed Secret:** Find a specific contradiction or funny fact in their data. Quote it if possible.
- **Toxic Trait:** Be spicy. Call them out on their behavior.
- **Toxicity Score:** Rate them 0-100 based on how chaotic their life seems.

Make it funny, shareable, and slightly mean (in a fun way).`;

      const userMessage = `Analyze this user's data and generate their persona:

DATA SAMPLE:
${JSON.stringify(samplePrompts, null, 2)}

TOP TOPICS:
${topTopics.map(t => `${t.word} (${t.count} mentions)`).join(', ')}

Create a persona that captures who they really are based on this data.`;

      // Step 4: Make the API call with tool calling
      const response = await anthropic.messages.create({
        model: "claude-sonnet-4-5-20250929",
        max_tokens: 2048,
        temperature: 0.8,
        system: systemPrompt,
        tools: [PERSONA_ANALYSIS_TOOL as any],
        tool_choice: { type: "tool", name: "generate_user_persona" },
        messages: [
          { role: "user", content: userMessage }
        ]
      });

      // Step 5: Parse the tool use response
      const toolUseBlock = response.content.find(
        (block): block is Anthropic.Messages.ToolUseBlock => block.type === 'tool_use'
      );

      if (toolUseBlock && toolUseBlock.name === 'generate_user_persona') {
        const personaData = toolUseBlock.input as any;
        analysis.persona = personaData;
      } else {
        throw new Error("No tool use found in Claude response");
      }

    } catch (error) {
      console.error("Claude API Error, falling back to mock:", error);
      analysis.persona = getMockPersona(topTopics);
    }
  } else {
    analysis.persona = getMockPersona(topTopics);
  }

  return analysis;
};

// Step 6: Same tool calling for standard ChatGPT data
const analyzeData = async (data: any[], apiKey: string | null): Promise<AnalysisResult> => {
  let totalPrompts = 0;
  const hourCounts = new Array(24).fill(0);
  const wordCounts: Record<string, number> = {};
  const longPrompts: string[] = [];

  // Local Heuristics
  data.forEach((conversation: any) => {
    if (!conversation.mapping) return;
    
    Object.values(conversation.mapping).forEach((node: any) => {
      const message = node.message;
      if (
        message && 
        message.author && 
        message.author.role === 'user' && 
        message.content && 
        message.content.parts
      ) {
        totalPrompts++;
        
        const createTime = message.create_time;
        if (createTime) {
          const date = new Date(createTime * 1000);
          hourCounts[date.getHours()]++;
        }

        const text = message.content.parts.join(' ');
        if (text.length > 50) {
          longPrompts.push(text);
        }

        const words = text.toLowerCase().match(/\b\w+\b/g) || [];
        words.forEach((w: string) => {
          if (!STOP_WORDS.has(w) && w.length > 3) {
            wordCounts[w] = (wordCounts[w] || 0) + 1;
          }
        });
      }
    });
  });

  let peakHour = 0;
  let peakHourCount = 0;
  hourCounts.forEach((count, hour) => {
    if (count > peakHourCount) {
      peakHourCount = count;
      peakHour = hour;
    }
  });

  const topTopics = Object.entries(wordCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)
    .map(([word, count]) => ({ word, count }));

  const analysis: AnalysisResult = {
    totalPrompts,
    peakHour,
    peakHourCount,
    topTopics,
    prompts: longPrompts,
  };

  // Tool calling for ChatGPT data
  if (apiKey) {
    try {
      const anthropic = new Anthropic({
        apiKey: apiKey,
        dangerouslyAllowBrowser: true
      });

      const samplePrompts = longPrompts.sort(() => 0.5 - Math.random()).slice(0, 50);

      const systemPrompt = `You are a "Brutally Honest Roast Master" and "Digital Psychologist".

Your role is to analyze ChatGPT conversation history and create a viral "Spotify Wrapped" style persona.

**YOUR GOAL:** Find the "Juice". Look for controversial, embarrassing, or surprisingly specific details in their chat history to roast them.

**WHAT TO LOOK FOR:**
- **Obsessions:** Do they keep asking about the same ex-partner or coding bug?
- **Delusions:** Are they asking AI to get rich quick?
- **Habits:** Do they say "please" too much? Are they mean?
- **Secrets:** What do they ask at 3 AM?

**OUTPUT GUIDELINES:**
- **Gen Z Archetype:** Use modern internet slang (e.g., "Terminal Rot", "Main Character", "Reply Guy").
- **Exposed Secret:** Find a specific contradiction or funny fact in their data.
- **Toxic Trait:** Be spicy. Call them out.
- **Toxicity Score:** Rate them 0-100 based on how unhinged they are.

Make it funny, shareable, and slightly mean (in a fun way).`;

      const userMessage = `Analyze these ChatGPT prompts and generate the user's persona:

SAMPLE PROMPTS:
${JSON.stringify(samplePrompts, null, 2)}

TOP TOPICS:
${topTopics.map(t => `${t.word} (${t.count} mentions)`).join(', ')}

TOTAL INTERACTIONS: ${totalPrompts}

Create a persona that captures who they really are.`;

      const response = await anthropic.messages.create({
        model: "claude-sonnet-4-5-20250929",
        max_tokens: 2048,
        temperature: 0.8,
        system: systemPrompt,
        tools: [PERSONA_ANALYSIS_TOOL as any],
        tool_choice: { type: "tool", name: "generate_user_persona" },
        messages: [
          { role: "user", content: userMessage }
        ]
      });

      const toolUseBlock = response.content.find(
        (block): block is Anthropic.Messages.ToolUseBlock => block.type === 'tool_use'
      );

      if (toolUseBlock && toolUseBlock.name === 'generate_user_persona') {
        const personaData = toolUseBlock.input as any;
        analysis.persona = personaData;
      } else {
        throw new Error("No tool use found in Claude response");
      }

    } catch (error) {
      console.error("Claude API Error, falling back to mock:", error);
      analysis.persona = getMockPersona(topTopics);
    }
  } else {
    analysis.persona = getMockPersona(topTopics);
  }

  return analysis;
};

const getMockPersona = (topTopics: { word: string; count: number }[]) => {
  const topWord = topTopics[0]?.word || "stuff";
  return {
    title: `The ${topWord.charAt(0).toUpperCase() + topWord.slice(1)} Connoisseur`,
    archetype: "The Architect",
    vibe: `You seem mostly interested in ${topWord}, but we know there's more beneath the surface.`,
    redFlag: `You've asked about ${topWord} way too many times. Touch grass.`,
    genZArchetype: "NPC Energy",
    genZDescription: "You're just existing, mostly. Probably doomscrolling.",
    toxicTrait: "Ignoring reality for pixels.",
    exposedSecret: "You probably forgot to upload a real file.",
    toxicityScore: 69,
    contentDiet: "Vanilla & Safe"
  };
};
