interface Message {
  role: "user" | "assistant";
  content: string;
}

const CLAUDE_API_KEY = import.meta.env.VITE_ANTHROPIC_API_KEY;

export const callClaudeAPI = async (messages: Message[]): Promise<string> => {
  try {
    if (!CLAUDE_API_KEY) {
      throw new Error("Missing VITE_ANTHROPIC_API_KEY in .env");
    }
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": CLAUDE_API_KEY,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1024,
        messages: messages.map(msg => ({
          role: msg.role,
          content: msg.content
        }))
      })
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    return data.content[0].text;
  } catch (error) {
    console.error("Claude API error:", error);
    return "Entschuldigung, es gab einen Fehler bei der Verarbeitung Ihrer Anfrage.";
  }
};
