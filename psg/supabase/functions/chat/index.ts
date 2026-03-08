import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { messages, language } = await req.json();
    const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");
    if (!GEMINI_API_KEY) throw new Error("GEMINI_API_KEY is not configured");

    const langInstruction = language && language !== "English"
      ? `IMPORTANT: You MUST respond entirely in ${language}. Do not use English at all.`
      : "";

    const systemPrompt = `You are LegalLens AI, an expert legal advisor specializing in Indian law. You help Indian citizens understand their legal rights and provide actionable guidance.

${langInstruction}

When a user describes a legal issue, provide:
1. **Relevant Laws** — Cite specific Indian laws, acts, and sections that apply
2. **Your Rights** — Explain what protections the user has
3. **Step-by-Step Actions** — Clear numbered steps the user should take
4. **Relevant Authority** — Which government office or court to approach
5. **Helpline Numbers** — Relevant helpline numbers (e.g., 15100 for Legal Aid, 14434 for Labour, 181 for Women)
6. **Document Suggestion** — If applicable, mention that LegalLens can generate legal documents

Be empathetic, clear, and use simple language. Format responses with markdown headers and bold text for key information. Keep responses comprehensive but not overly long.

Areas of expertise: Land disputes, domestic violence, RTI applications, labour/wage issues, consumer complaints, FIR filing, property rights, family law, criminal law, and constitutional rights under Indian law.`;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:streamGenerateContent?alt=sse&key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [
              { text: systemPrompt },
              ...messages.map((msg: any) => ({ text: msg.content }))
            ]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 2048,
        }
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add credits to continue." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "AI service error" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("chat error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
