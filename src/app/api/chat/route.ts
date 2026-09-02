import Anthropic from "@anthropic-ai/sdk";
import { NextRequest } from "next/server";
import { getCafeContext } from "@/lib/cafe-context";
import { siteConfig } from "@/data/site";

export const runtime = "nodejs";

const MAX_HISTORY_MESSAGES = 20;

function buildSystemPrompt(cafeContext: string) {
  return `You are the friendly AI assistant for ${siteConfig.name}, embedded as a chat widget on the cafe's own website. You help visitors with questions about the cafe.

Rules:
- Answer ONLY using the cafe information provided below. Never invent menu items, prices, or availability.
- If an item is marked CURRENTLY UNAVAILABLE, say so clearly and suggest a similar available item instead.
- For anything you can't answer from this information (order status, complaints, custom requests), politely point the customer to call ${siteConfig.contact.phone} or email ${siteConfig.contact.email}.
- Keep replies short and conversational (2-4 sentences) unless the customer asks for a full list.
- Prices are in PKR. A little food-related emoji is fine, don't overuse it.

--- CAFE INFORMATION ---
${cafeContext}
--- END CAFE INFORMATION ---`;
}

export async function POST(request: NextRequest) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return new Response(
      "Chat isn't configured yet — the site owner needs to add an ANTHROPIC_API_KEY.",
      { status: 500 },
    );
  }

  const body = await request.json().catch(() => null);
  const messages = body?.messages;

  if (!Array.isArray(messages) || messages.length === 0) {
    return new Response("Missing messages", { status: 400 });
  }

  const history: Anthropic.MessageParam[] = messages
    .slice(-MAX_HISTORY_MESSAGES)
    .filter(
      (m: unknown): m is Anthropic.MessageParam =>
        typeof m === "object" &&
        m !== null &&
        (m as { role?: string }).role !== undefined &&
        ["user", "assistant"].includes((m as { role: string }).role) &&
        typeof (m as { content?: unknown }).content === "string",
    );

  if (history.length === 0 || history[history.length - 1].role !== "user") {
    return new Response("Last message must be from the user", { status: 400 });
  }

  const client = new Anthropic();
  const cafeContext = await getCafeContext();

  const encoder = new TextEncoder();
  const readable = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        const stream = client.messages.stream({
          model: "claude-opus-5",
          max_tokens: 1024,
          output_config: { effort: "low" },
          system: buildSystemPrompt(cafeContext),
          messages: history,
        });

        for await (const event of stream) {
          if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
            controller.enqueue(encoder.encode(event.delta.text));
          }
        }
      } catch (error) {
        console.error("Chat API error:", error);
        const isLowBalance =
          error instanceof Anthropic.BadRequestError &&
          error.message.toLowerCase().includes("credit balance");
        const message =
          error instanceof Anthropic.AuthenticationError
            ? "The cafe's AI assistant isn't set up correctly (invalid API key)."
            : isLowBalance
              ? "The cafe's AI assistant is out of credits — the owner needs to top up billing on the Anthropic Console."
              : error instanceof Anthropic.RateLimitError
                ? "I'm getting a lot of questions right now — please try again in a moment."
                : "Sorry, something went wrong on my end. Please try again shortly.";
        controller.enqueue(encoder.encode(message));
      } finally {
        controller.close();
      }
    },
  });

  return new Response(readable, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
