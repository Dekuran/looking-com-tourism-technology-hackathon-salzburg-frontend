import { supabase } from "@/integrations/supabase/client";

export interface Message {
  role: "user" | "assistant";
  content: string;
}

/**
 * Unified chat caller that routes via the Supabase Edge Function.
 * This avoids exposing the Anthropic API key in the browser and
 * centralizes MCP configuration on the server.
 *
 * The server-side key is read in [supabase/functions/chat/index.ts](supabase/functions/chat/index.ts:4)
 * via Deno.env.get("ANTHROPIC_API_KEY") and MCP config is managed there as well.
 */
export const callClaudeAPI = async (
  messages: Message[],
  type: "chat" | "hotel" = "chat"
): Promise<string> => {
  try {
    const { data, error } = await supabase.functions.invoke("chat", {
      body: { messages, type },
    });

    if (error) throw error;
    if (!data || typeof data.message !== "string") {
      throw new Error("Unexpected response from chat function");
    }

    return data.message as string;
  } catch (error) {
    console.error("Claude API error:", error);
    return "Entschuldigung, es gab einen Fehler bei der Verarbeitung Ihrer Anfrage.";
  }
};
