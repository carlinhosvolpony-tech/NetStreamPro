
import { GoogleGenAI, Type } from "@google/genai";
import { Match } from "../types";

// The API key must be obtained exclusively from the environment variable process.env.API_KEY.
// Initializing the AI client following the latest SDK guidelines.
// Always use const ai = new GoogleGenAI({apiKey: process.env.API_KEY});
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Mock data in case API fails, to ensure app playability
const FALLBACK_MATCHES: Match[] = Array.from({ length: 12 }, (_, i) => ({
  id: i + 1,
  homeTeam: { name: `Time Casa ${i + 1}`, color: '#3b82f6', logoPlaceholder: '' },
  awayTeam: { name: `Time Fora ${i + 1}`, color: '#ef4444', logoPlaceholder: '' },
  league: 'Campeonato Simulado',
  time: '16:00'
}));

export const generateDailyMatches = async (): Promise<Match[]> => {
  try {
    // Using gemini-3-flash-preview for basic text generation tasks as recommended.
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: "Generate a list of 12 realistic football matches for a betting pool. Use famous teams from Brazil (Série A), Europe (Premier League, La Liga), or National Teams. Ensure the names are correct.",
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              homeTeamName: { type: Type.STRING },
              awayTeamName: { type: Type.STRING },
              league: { type: Type.STRING },
              time: { type: Type.STRING, description: "Time in HH:MM format" }
            },
            required: ["homeTeamName", "awayTeamName", "league", "time"]
          }
        }
      }
    });

    // Accessing .text as a property as per the correct method for GenerateContentResponse.
    const data = JSON.parse(response.text || "[]");
    
    if (!Array.isArray(data) || data.length === 0) return FALLBACK_MATCHES;

    return data.map((item: any, index: number) => ({
      id: index + 1,
      homeTeam: { 
        name: item.homeTeamName, 
        color: '#10b981', 
        logoPlaceholder: `https://ui-avatars.com/api/?name=${encodeURIComponent(item.homeTeamName)}&background=random` 
      },
      awayTeam: { 
        name: item.awayTeamName, 
        color: '#ef4444', 
        logoPlaceholder: `https://ui-avatars.com/api/?name=${encodeURIComponent(item.awayTeamName)}&background=random` 
      },
      league: item.league,
      time: item.time
    }));

  } catch (error) {
    console.error("Failed to generate matches with Gemini, using fallback.", error);
    return FALLBACK_MATCHES;
  }
};

export const generateLuckyTips = async (matches: Match[]): Promise<Record<number, 'HOME' | 'DRAW' | 'AWAY'>> => {
  // 1. Generate a base layer of random picks to ensure 100% coverage even if AI skips a game
  const basePicks: Record<number, 'HOME' | 'DRAW' | 'AWAY'> = {};
  matches.forEach(m => {
      const r = Math.random();
      // Slight bias towards Home wins mathematically
      basePicks[m.id] = r < 0.45 ? 'HOME' : r < 0.75 ? 'DRAW' : 'AWAY';
  });

  try {
      const matchDescriptions = matches.map(m => `ID ${m.id}: ${m.homeTeam.name} vs ${m.awayTeam.name}`).join('\n');
      
      // Using gemini-3-flash-preview for consistency in basic text tasks.
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `You are 'Volpony', an expert football betting analyst. Analyze these 12 matches and provide the single most likely outcome for EACH match (HOME, DRAW, or AWAY). 
        
        Rules:
        1. You MUST return a prediction for EVERY match ID listed.
        2. Be bold but realistic based on team strength.
        3. Return strictly JSON: { "1": "HOME", "2": "DRAW", ... }
        
        Matches:
        ${matchDescriptions}`,
        config: {
            responseMimeType: "application/json",
            // The recommended way is to configure a responseSchema for the expected output.
            responseSchema: {
              type: Type.OBJECT,
              description: "A map of match IDs to predicted outcomes",
              properties: matches.reduce((acc: any, m) => {
                acc[m.id.toString()] = {
                  type: Type.STRING,
                  enum: ["HOME", "DRAW", "AWAY"]
                };
                return acc;
              }, {}),
            }
        }
      });
      
      // Accessing .text as a property as per the correct method.
      const aiPicks = JSON.parse(response.text || "{}");
      
      // Merge: AI picks overwrite random picks. 
      // If AI misses an ID, the basePick remains.
      const finalPicks: any = { ...basePicks };
      
      Object.keys(aiPicks).forEach(key => {
          const numKey = parseInt(key);
          if (!isNaN(numKey) && ['HOME', 'DRAW', 'AWAY'].includes(aiPicks[key])) {
              finalPicks[numKey] = aiPicks[key];
          }
      });

      return finalPicks;

  } catch (e) {
      console.error("AI prediction failed, using statistical fallback", e);
      return basePicks;
  }
}
