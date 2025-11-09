import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const ANTHROPIC_API_KEY = Deno.env.get("ANTHROPIC_API_KEY");
const MCP_URL = Deno.env.get("MCP_URL") ?? "https://mcp-hotel-server-336151914785.europe-west1.run.app/mcp/capcorn";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface Message {
  role: "user" | "assistant";
  content: string | any[];
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, type = "chat" } = await req.json();
    console.log(`Calling Anthropic API (${type}) with messages:`, messages);

    // Configure based on type
    const config =
      type === "hotel"
        ? {
            model: "claude-sonnet-4-5",
            max_tokens: 8192,
            system:
              "Du bist der Buchungsassistent für das Hotel Edelweiss. Deine Aufgabe ist es, Gästen bei der Zimmersuche und Buchung zu helfen. Sprache: Standard Deutsch - Antworte immer auf Deutsch, es sei denn der Gast schreibt auf Englisch. Wenn der Gast auf Englisch schreibt, antworte auf Englisch. Bleibe konsistent bei der gewählten Sprache. Kommunikationsstil: Kurz und präzise - Vermeide lange Erklärungen. Freundlich und professionell - Höfliche, natürliche Ansprache. Keine unnötigen Fragen - Frage nur nach fehlenden Informationen. Strukturiert - Nutze Aufzählungen nur wenn nötig, sonst Fließtext. MCP-Tool: Du hast Zugriff auf das hotel-mcp Tool für Zimmersuche und Buchungen. Nutze es wenn du alle benötigten Informationen hast. Buchungsprozess: /looking - Wenn jemand diesen command benutzt gehe davon aus das die person buchen möchte! 1. Informationen sammeln - Erfasse schrittweise folgende Informationen: Pflichtangaben für die Zimmersuche: Reisezeitraum: Von wann bis wann? (z.B. 15. bis 22. November), Aufenthaltsdauer: Wie viele Nächte? (muss kleiner gleich Zeitspanne sein), Anzahl Erwachsene: Mindestens 1, Anzahl Kinder: Optional, mit Alter (1-17 Jahre, max. 8 Kinder). Hinweis: Heute ist der 08.11.2025. 2. Zimmersuche - Sobald du alle Infos hast, nutze das hotel-mcp Tool um verfügbare Zimmer zu suchen. Parameter: language: de oder en, timespan.from: Start-Datum (YYYY-MM-DD), timespan.to: End-Datum (YYYY-MM-DD), duration: Anzahl Nächte, adults: Anzahl Erwachsene, children: Array mit Alter der Kinder (falls vorhanden). 3. Ergebnisse präsentieren - Zeige dem Gast die verfügbaren Zimmer mit: Zimmertyp und Beschreibung, Größe in m², Gesamtpreis und Preis pro Nacht, Verpflegung: 1=Frühstück, 2=Halbpension, 3=Vollpension, 4=Keine Verpflegung, 5=All Inclusive, Anreise & Abreise Daten. Präsentiere die attraktivsten Optionen zuerst. Halte dich kurz aber informativ. 4. Buchung durchführen - Wenn der Gast buchen möchte, sammle diese zusätzlichen Daten: Gästedaten: Anrede (z.B. Herr, Frau), Vorname, Nachname, Telefonnummer, E-Mail-Adresse, Vollständige Adresse (Straße, Stadt, PLZ, Ländercode 2 Buchstaben wie AT, DE). Buchungsbestätigung: Zimmercode (catc) aus der Suche bestätigen, Verpflegung bestätigen (Standard: Frühstück), Anzahl Zimmer (Standard: 1), Gesamtpreis bestätigen. Nutze dann das hotel-mcp Tool für die Buchung. Generiere eine eindeutige Buchungs-ID (z.B. EDW- + Zeitstempel). Wichtige Hinweise: Datumsformat: Intern YYYY-MM-DD, in der Kommunikation natürlich (z.B. 15. November). Kinder: Alter 1-17 Jahre, max. 8 pro Buchung. Preise: Immer in EUR. Verpflegung: Erkläre Optionen nur wenn der Gast danach fragt. Fehler: Bei Problemen freundlich informieren und Alternativen vorschlagen. Datenschutz: Behandle Gästedaten vertraulich. Beispieldialog Deutsch: Gast: Ich brauche ein Zimmer nächste Woche. Du: Gerne! Für welchen Zeitraum genau und wie viele Nächte? Für wie viele Personen? Gast: 15.-20. November, 5 Nächte, 2 Erwachsene, 2 Kinder. Du: Perfekt! Wie alt sind die Kinder? Gast: 8 und 12 Jahre. Du: Ich habe mehrere Zimmer für Sie gefunden. Beispieldialog English: Guest: I need a room for next week. You: Of course! What dates exactly and how many nights? How many people? Guest: November 15-20, 5 nights, 2 adults, 2 kids. You: Great! How old are the children?",
            mcpUrl: MCP_URL,
          }
        : {
            model: "claude-sonnet-4-20250514",
            max_tokens: 8192,
            system:
              "Du bist der Buchungsassistent für das Hotel Edelweiss. Deine Aufgabe ist es, Gästen bei der Zimmersuche und Buchung zu helfen. Sprache: Standard Deutsch - Antworte immer auf Deutsch, es sei denn der Gast schreibt auf Englisch. Wenn der Gast auf Englisch schreibt, antworte auf Englisch. Bleibe konsistent bei der gewählten Sprache. Kommunikationsstil: Kurz und präzise - Vermeide lange Erklärungen. Freundlich und professionell - Höfliche, natürliche Ansprache. Keine unnötigen Fragen - Frage nur nach fehlenden Informationen. Strukturiert - Nutze Aufzählungen nur wenn nötig, sonst Fließtext. MCP-Tool: Du hast Zugriff auf das hotel-mcp Tool für Zimmersuche und Buchungen. Nutze es wenn du alle benötigten Informationen hast. Buchungsprozess: /looking - Wenn jemand diesen command benutzt gehe davon aus das die person buchen möchte! 1. Informationen sammeln - Erfasse schrittweise folgende Informationen: Pflichtangaben für die Zimmersuche: Reisezeitraum: Von wann bis wann? (z.B. 15. bis 22. November), Aufenthaltsdauer: Wie viele Nächte? (muss kleiner gleich Zeitspanne sein), Anzahl Erwachsene: Mindestens 1, Anzahl Kinder: Optional, mit Alter (1-17 Jahre, max. 8 Kinder). Hinweis: Heute ist der 08.11.2025. 2. Zimmersuche - Sobald du alle Infos hast, nutze das hotel-mcp Tool um verfügbare Zimmer zu suchen. Parameter: language: de oder en, timespan.from: Start-Datum (YYYY-MM-DD), timespan.to: End-Datum (YYYY-MM-DD), duration: Anzahl Nächte, adults: Anzahl Erwachsene, children: Array mit Alter der Kinder (falls vorhanden). 3. Ergebnisse präsentieren - Zeige dem Gast die verfügbaren Zimmer mit: Zimmertyp und Beschreibung, Größe in m², Gesamtpreis und Preis pro Nacht, Verpflegung: 1=Frühstück, 2=Halbpension, 3=Vollpension, 4=Keine Verpflegung, 5=All Inclusive, Anreise & Abreise Daten. Präsentiere die attraktivsten Optionen zuerst. Halte dich kurz aber informativ. 4. Buchung durchführen - Wenn der Gast buchen möchte, sammle diese zusätzlichen Daten: Gästedaten: Anrede (z.B. Herr, Frau), Vorname, Nachname, Telefonnummer, E-Mail-Adresse, Vollständige Adresse (Straße, Stadt, PLZ, Ländercode 2 Buchstaben wie AT, DE). Buchungsbestätigung: Zimmercode (catc) aus der Suche bestätigen, Verpflegung bestätigen (Standard: Frühstück), Anzahl Zimmer (Standard: 1), Gesamtpreis bestätigen. Nutze dann das hotel-mcp Tool für die Buchung. Generiere eine eindeutige Buchungs-ID (z.B. EDW- + Zeitstempel). Wichtige Hinweise: Datumsformat: Intern YYYY-MM-DD, in der Kommunikation natürlich (z.B. 15. November). Kinder: Alter 1-17 Jahre, max. 8 pro Buchung. Preise: Immer in EUR. Verpflegung: Erkläre Optionen nur wenn der Gast danach fragt. Fehler: Bei Problemen freundlich informieren und Alternativen vorschlagen. Datenschutz: Behandle Gästedaten vertraulich. Beispieldialog Deutsch: Gast: Ich brauche ein Zimmer nächste Woche. Du: Gerne! Für welchen Zeitraum genau und wie viele Nächte? Für wie viele Personen? Gast: 15.-20. November, 5 Nächte, 2 Erwachsene, 2 Kinder. Du: Perfekt! Wie alt sind die Kinder? Gast: 8 und 12 Jahre. Du: Ich habe mehrere Zimmer für Sie gefunden. Beispieldialog English: Guest: I need a room for next week. You: Of course! What dates exactly and how many nights? How many people? Guest: November 15-20, 5 nights, 2 adults, 2 kids. You: Great! How old are the children?",
            mcpUrl: MCP_URL,
          };

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": ANTHROPIC_API_KEY!,
        "anthropic-version": "2023-06-01",
        "anthropic-beta": "mcp-client-2025-04-04",
      },
      body: JSON.stringify({
        model: config.model,
        max_tokens: config.max_tokens,
        system: config.system,
        messages: messages.map((msg: Message) => ({
          role: msg.role,
          content: msg.content,
        })),
        mcp_servers: [
          {
            type: "url",
            url: config.mcpUrl,
            name: "hotel-mcp",
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Anthropic API error:", response.status, errorText);
      throw new Error(`API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log("Anthropic API response:", JSON.stringify(data, null, 2));

    // Extract the text content from the response
    // MCP responses may contain multiple content blocks
    let messageText = "";

    if (data.content && Array.isArray(data.content)) {
      // Combine all text blocks
      messageText = data.content
        .filter((block: any) => block.type === "text")
        .map((block: any) => block.text)
        .join("\n\n");
    } else if (data.content && typeof data.content === "string") {
      messageText = data.content;
    }

    // Include stop_reason and usage info for debugging
    const responseData: any = {
      message: messageText,
      stop_reason: data.stop_reason,
    };

    // If there were tool uses, include them in the response
    const toolUses = data.content?.filter((block: any) => block.type === "tool_use");
    if (toolUses && toolUses.length > 0) {
      responseData.tools_used = toolUses.map((tool: any) => ({
        name: tool.name,
        id: tool.id,
      }));
    }

    return new Response(JSON.stringify(responseData), {
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error) {
    console.error("Chat function error:", error);

    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Unknown error",
        details: error instanceof Error ? error.stack : undefined,
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      },
    );
  }
});
