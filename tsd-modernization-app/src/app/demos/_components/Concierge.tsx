"use client";

import { useEffect, useRef, useState } from "react";
import {
  Send,
  Sparkles,
  FileText,
  ChevronDown,
  CalendarCheck,
} from "lucide-react";
import type {
  ChatResponse,
  Citation,
  DemoLang,
  RetrievalChunk,
} from "@/lib/demos/types";

interface ConciergeProps {
  slug: string;
  company: string;
  accent: string;
  glyph: string;
  greeting: Record<DemoLang, string>;
  starterChips: Record<DemoLang, string[]>;
  bookUrl: string;
}

interface Turn {
  role: "user" | "assistant";
  content: string;
  data?: ChatResponse; // present on assistant turns from the model
}

const T: Record<
  DemoLang,
  {
    placeholder: string;
    sources: string;
    retrieval: string;
    thinking: string;
    cta: string;
    fitTitle: string;
    fitBody: string;
    fitBtn: string;
    langLabel: string;
    matched: string;
    cited: string;
  }
> = {
  en: {
    placeholder: "Ask a question…",
    sources: "Sources",
    retrieval: "How I found this",
    thinking: "Looking that up…",
    cta: "Book a fit call",
    fitTitle: "Want this for your business?",
    fitBody:
      "This is exactly what TSD Modernization builds. Grab a free 15-minute fit call.",
    fitBtn: "Book a free fit call",
    langLabel: "Español",
    matched: "Most relevant in the knowledge base",
    cited: "cited",
  },
  es: {
    placeholder: "Haz una pregunta…",
    sources: "Fuentes",
    retrieval: "Cómo encontré esto",
    thinking: "Buscando eso…",
    cta: "Agenda una llamada",
    fitTitle: "¿Quieres esto para tu negocio?",
    fitBody:
      "Esto es justo lo que crea TSD Modernization. Agenda una llamada gratis de 15 minutos.",
    fitBtn: "Agenda una llamada gratis",
    langLabel: "English",
    matched: "Lo más relevante en la base de conocimiento",
    cited: "citado",
  },
};

export default function Concierge({
  slug,
  company,
  accent,
  glyph,
  greeting,
  starterChips,
  bookUrl,
}: ConciergeProps) {
  const [lang, setLang] = useState<DemoLang>("en");
  const [turns, setTurns] = useState<Turn[]>([
    { role: "assistant", content: greeting.en },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const t = T[lang];
  const started = turns.some((x) => x.role === "user");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [turns, loading]);

  function switchLang() {
    const next: DemoLang = lang === "en" ? "es" : "en";
    setLang(next);
    // Re-greet in the new language only if the conversation hasn't begun.
    if (!started) setTurns([{ role: "assistant", content: greeting[next] }]);
  }

  async function send(text: string) {
    const q = text.trim();
    if (!q || loading) return;
    const history = [...turns, { role: "user" as const, content: q }];
    setTurns(history);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("/api/demos/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          slug,
          lang,
          messages: history.map((m) => ({ role: m.role, content: m.content })),
        }),
      });
      const data: ChatResponse = await res.json();
      setTurns((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            data.reply ??
            "Sorry — I had trouble with that. Try asking another way.",
          data,
        },
      ]);
    } catch {
      setTurns((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Sorry — I had trouble connecting. Please try again in a moment.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex h-[min(640px,75vh)] flex-col overflow-hidden rounded-[14px] border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow-card)]">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 border-b border-[var(--border)] px-4 py-3">
        <div className="flex min-w-0 items-center gap-3">
          <span
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
            style={{ background: accent }}
            aria-hidden
          >
            {glyph}
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-[var(--text)]">
              {company} Assistant
            </p>
            <p className="flex items-center gap-1.5 text-xs text-[var(--text-subtle)]">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--success)]" />
              Live demo · answers from {company}&rsquo;s info
            </p>
          </div>
        </div>
        <button
          onClick={switchLang}
          className="shrink-0 rounded-md border border-[var(--border-strong)] px-2.5 py-1 text-xs font-semibold text-[var(--text-muted)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]"
        >
          {t.langLabel}
        </button>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto px-4 py-4">
        {turns.map((m, i) =>
          m.role === "user" ? (
            <div key={i} className="flex justify-end">
              <div className="max-w-[85%] rounded-2xl rounded-br-sm bg-[var(--accent-soft)] px-3.5 py-2 text-sm text-[var(--text)]">
                {m.content}
              </div>
            </div>
          ) : (
            <AssistantBubble
              key={i}
              accent={accent}
              glyph={glyph}
              content={m.content}
              data={m.data}
              t={t}
              bookUrl={bookUrl}
            />
          ),
        )}
        {loading && (
          <div className="flex items-center gap-2 pl-11 text-sm text-[var(--text-subtle)]">
            <Sparkles size={14} className="animate-pulse" />
            {t.thinking}
          </div>
        )}
      </div>

      {/* Starter chips */}
      {!started && (
        <div className="flex flex-wrap gap-2 px-4 pb-2">
          {starterChips[lang].map((c) => (
            <button
              key={c}
              onClick={() => send(c)}
              className="rounded-full border border-[var(--border-strong)] bg-[var(--surface-2)] px-3 py-1.5 text-xs font-medium text-[var(--text-muted)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]"
            >
              {c}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          send(input);
        }}
        className="flex items-center gap-2 border-t border-[var(--border)] p-3"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t.placeholder}
          className="h-10 flex-1 rounded-[10px] border border-[var(--border-strong)] bg-[var(--surface-2)] px-3 text-sm text-[var(--text)] outline-none placeholder:text-[var(--text-subtle)] transition-colors focus:border-[var(--accent)]"
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] text-white transition-opacity disabled:opacity-40"
          style={{ background: accent }}
          aria-label="Send"
        >
          <Send size={16} />
        </button>
      </form>
    </div>
  );
}

function AssistantBubble({
  accent,
  glyph,
  content,
  data,
  t,
  bookUrl,
}: {
  accent: string;
  glyph: string;
  content: string;
  data?: ChatResponse;
  t: (typeof T)[DemoLang];
  bookUrl: string;
}) {
  const citations: Citation[] = data?.citations ?? [];
  return (
    <div className="flex gap-3">
      <span
        className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
        style={{ background: accent }}
        aria-hidden
      >
        {glyph}
      </span>
      <div className="min-w-0 flex-1 space-y-2">
        <div className="max-w-[92%] rounded-2xl rounded-tl-sm bg-[var(--surface-2)] px-3.5 py-2 text-sm leading-relaxed text-[var(--text)]">
          {content}
        </div>

        {citations.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5">
            {citations.map((c) => (
              <span
                key={c.id}
                title={c.sourceLabel}
                className="inline-flex items-center gap-1 rounded-full border border-[var(--border)] bg-[var(--surface)] px-2 py-0.5 text-[11px] text-[var(--text-muted)]"
              >
                <FileText size={11} aria-hidden />
                {c.title}
              </span>
            ))}
          </div>
        )}

        {data && data.retrieval.chunks.length > 0 && (
          <RetrievalDetail data={data} t={t} />
        )}

        {data?.suggestFitCall && (
          <div className="rounded-[12px] border border-[var(--accent)]/30 bg-[var(--accent-soft)] p-3">
            <p className="text-sm font-semibold text-[var(--text)]">
              {t.fitTitle}
            </p>
            <p className="mt-0.5 text-xs text-[var(--text-muted)]">{t.fitBody}</p>
            <a
              href={bookUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-flex h-8 items-center gap-1.5 rounded-md bg-[var(--primary-bg)] px-3 text-xs font-semibold text-[var(--primary-fg)]"
            >
              <CalendarCheck size={13} /> {t.fitBtn}
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

function RetrievalDetail({
  data,
  t,
}: {
  data: ChatResponse;
  t: (typeof T)[DemoLang];
}) {
  const [open, setOpen] = useState(false);
  const chunks: RetrievalChunk[] = data.retrieval.chunks;
  return (
    <div className="text-xs">
      <button
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-1 text-[var(--text-subtle)] transition-colors hover:text-[var(--accent)]"
      >
        <ChevronDown
          size={12}
          className={`transition-transform ${open ? "rotate-180" : ""}`}
        />
        {t.retrieval}
        <span className="font-mono opacity-70">
          · {data.retrieval.model}
          {data.retrieval.timings.generateMs
            ? ` · ${data.retrieval.timings.generateMs}ms`
            : ""}
        </span>
      </button>
      {open && (
        <div className="mt-2 space-y-1.5 rounded-[10px] border border-[var(--border)] bg-[var(--surface-muted)] p-2.5">
          <p className="text-[10px] uppercase tracking-wide text-[var(--text-subtle)]">
            {t.matched}
          </p>
          {chunks.map((c) => (
            <div
              key={c.id}
              className={`rounded-md border px-2 py-1.5 ${
                c.cited
                  ? "border-[var(--accent)]/40 bg-[var(--accent-soft)]"
                  : "border-[var(--border)] bg-[var(--surface)]"
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="truncate font-medium text-[var(--text)]">
                  {c.title}
                </span>
                <span className="shrink-0 font-mono text-[10px] text-[var(--text-subtle)]">
                  {c.score.toFixed(2)}
                  {c.cited ? ` · ${t.cited}` : ""}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
