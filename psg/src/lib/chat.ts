export type ChatMessage = { role: "user" | "assistant"; content: string };

const SYSTEM_PROMPT = `You are LegalLens AI, an expert legal advisor specializing in Indian law. You help Indian citizens understand their legal rights and provide actionable guidance.

When a user describes a legal issue, provide:
1. **Relevant Laws** — Cite specific Indian laws, acts, and sections
2. **Your Rights** — Explain what protections the user has
3. **Step-by-Step Actions** — Clear numbered steps to take
4. **Relevant Authority** — Which government office or court to approach
5. **Helpline Numbers** — e.g., 15100 for Legal Aid, 14434 for Labour, 181 for Women

Be empathetic, clear, and use simple language. Format with markdown headers and bold text.`;

export async function streamChat({
  messages,
  language,
  onDelta,
  onDone,
  onError,
}: {
  messages: ChatMessage[];
  language: string;
  onDelta: (text: string) => void;
  onDone: () => void;
  onError: (error: string) => void;
}) {
  try {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      onError("Supabase configuration missing. Please check your environment variables.");
      return;
    }

    const resp = await fetch(`${supabaseUrl}/functions/v1/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${supabaseKey}`,
      },
      body: JSON.stringify({
        messages: messages.map((m) => ({
          role: m.role,
          content: m.content,
        })),
        language,
      }),
    });

    if (!resp.ok) {
      const errorData = await resp.json().catch(() => ({}));
      onError(errorData?.error || `Error ${resp.status}. Please try again.`);
      return;
    }

    const reader = resp.body?.getReader();
    if (!reader) {
      onError("Failed to read response stream.");
      return;
    }

    const decoder = new TextDecoder();
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() || "";

      for (const line of lines) {
        if (line.startsWith("data: ")) {
          const data = line.slice(6);
          if (data === "[DONE]") {
            onDone();
            return;
          }

          try {
            const parsed = JSON.parse(data);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              onDelta(content);
            }
          } catch (e) {
            // Ignore parsing errors for incomplete chunks
          }
        }
      }
    }

    onDone();
  } catch (e: any) {
    onError(e?.message || "Network error. Check your internet connection.");
  }
}
