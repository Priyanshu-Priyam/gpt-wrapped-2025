import { Handler } from "@netlify/functions";

interface PersonaPayload {
  title: string;
  archetype: string;
  vibe: string;
  redFlag: string;
  genZArchetype: string;
  genZDescription: string;
  toxicTrait: string;
  exposedSecret: string;
  toxicityScore: number;
  contentDiet: string;
}

interface WrappedPayload {
  totalPrompts: number;
  peakHour: number;
  peakHourCount: number;
  topTopics: { word: string; count: number }[];
  prompts: string[];
  persona: PersonaPayload;
  meta?: Record<string, unknown>;
}

const handler: Handler = async (event) => {
  // CORS preflight
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers: corsHeaders(),
      body: "",
    };
  }

  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers: corsHeaders(),
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  try {
    const payload = JSON.parse(event.body || "{}") as Partial<WrappedPayload>;

    if (!payload || !payload.persona || typeof payload.totalPrompts !== "number") {
      return {
        statusCode: 400,
        headers: corsHeaders(),
        body: JSON.stringify({ error: "Invalid payload" }),
      };
    }

    // Encode the whole payload as base64 so the frontend can render without storage
    const encoded = Buffer.from(JSON.stringify(payload)).toString("base64url");
    const viewerUrl = `https://gptwrap-2025.netlify.app/?data=${encoded}`;

    return {
      statusCode: 200,
      headers: corsHeaders(),
      body: JSON.stringify({
        success: true,
        viewer_url: viewerUrl,
        data: payload,
      }),
    };
  } catch (error) {
    console.error("wrapped function error", error);
    return {
      statusCode: 500,
      headers: corsHeaders(),
      body: JSON.stringify({ error: "Internal server error" }),
    };
  }
};

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
}

export { handler };

