import type { DemoBusiness, DemoLang, SeedDoc } from "./types";

const LANG_NAME: Record<DemoLang, string> = {
  en: "English",
  es: "Spanish",
};

// Build the grounded system prompt for one turn: persona + hard rules +
// retrieved context as JSON. The model answers ONLY from this context and cites
// source ids, which is what makes every reply verifiable against the business's
// real information.
export function buildSystemPrompt(
  business: DemoBusiness,
  docs: SeedDoc[],
  lang: DemoLang,
): string {
  const rules =
    "Rules:\n" +
    `- Answer ONLY from the ${business.company} information below. Never invent services, products, prices, policies, hours, names, or facts.\n` +
    "- If nothing below answers the question, say so honestly and offer to connect them with the team or take a message. Do not guess.\n" +
    '- When you state a fact, cite the source documents you used by their exact id (the "id" field).\n' +
    "- Keep answers short and conversational — two to four sentences. Plain text only: no markdown, asterisks, or bullet lists.\n" +
    `- Reply in ${LANG_NAME[lang]}. Keep prices, numbers, phone numbers, and proper names exactly as written.\n` +
    "- This is a live demo of an AI assistant built by TSD Modernization Solutions. If the visitor asks about getting an assistant like this for their OWN business, or asks about TSD, set suggestFitCall to true and warmly invite them to book a free fit call. Otherwise set suggestFitCall to false.\n" +
    "- Always answer by calling the `respond` tool.";

  const context = docs.map((d) => ({
    id: d.id,
    title: d.title,
    kind: d.kind,
    price: d.price,
    source: d.sourceLabel,
    text: d.body,
  }));

  return `${business.persona}\n\n${rules}\n\n${business.company} information (JSON):\n${JSON.stringify(context)}`;
}
