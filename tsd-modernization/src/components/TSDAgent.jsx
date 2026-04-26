import { useState, useRef, useEffect, useCallback } from "react";
import { C, v } from "../shared";

/* ── TSD chat agent ────────────────────────────────────────────────
 * Floating chat widget mounted globally in Layout. Talks to /api/agent
 * (Vercel serverless function → Claude Haiku 4.5). The agent answers
 * questions and, when a visitor shows clear intent, calls the
 * capture_lead tool which posts to the same Web3Forms backend the
 * contact page uses.
 *
 * State model: the server returns the FULL message history (including
 * tool_use / tool_result blocks). We store it verbatim and send it back
 * unchanged on the next request — that's what gives the agent memory of
 * its own tool calls without us building a server-side session store.
 * The render loop filters down to text-only blocks for display.
 */

const INITIAL_GREETING =
  "Hi — I'm the chat agent for TSD Modernization Solutions. Ask me about pricing, the Summer 2026 cohort, or what we build. If you want to talk to a founder, just say so.";

function ChatBubbleIcon({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4 6.5C4 5.12 5.12 4 6.5 4h11C18.88 4 20 5.12 20 6.5v8c0 1.38-1.12 2.5-2.5 2.5H10l-4 3.5v-3.5h-.5C4.12 17 4 15.88 4 14.5v-8z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CloseIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M6 6l12 12M18 6L6 18"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function SendIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4 12l16-8-6 18-3-7-7-3z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function TypingDots() {
  return (
    <span style={{ display: "inline-flex", gap: "4px", padding: "8px 0" }}>
      <style>{`
        @keyframes tsdAgentDot { 0%,80%,100% { transform: translateY(0); opacity: 0.4; } 40% { transform: translateY(-3px); opacity: 1; } }
        .tsd-agent-dot { width: 6px; height: 6px; border-radius: 50%; background: ${C.carolina}; animation: tsdAgentDot 1.2s infinite ease-in-out both; }
      `}</style>
      <span className="tsd-agent-dot" style={{ animationDelay: "0s" }} />
      <span className="tsd-agent-dot" style={{ animationDelay: "0.18s" }} />
      <span className="tsd-agent-dot" style={{ animationDelay: "0.36s" }} />
    </span>
  );
}

/* Reduce the server's full message array (with tool_use / tool_result
   blocks) to just user / assistant text for rendering. */
function toRenderable(messages) {
  const out = [];
  for (const m of messages) {
    if (m.role === "user") {
      if (typeof m.content === "string") {
        out.push({ role: "user", text: m.content });
      }
    } else if (m.role === "assistant") {
      const content = Array.isArray(m.content)
        ? m.content
        : [{ type: "text", text: m.content }];
      const text = content
        .filter((b) => b.type === "text")
        .map((b) => b.text)
        .join("\n\n")
        .trim();
      if (text) out.push({ role: "assistant", text });
    }
  }
  return out;
}

export default function TSDAgent() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "assistant", content: INITIAL_GREETING },
  ]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [leadCaptured, setLeadCaptured] = useState(false);
  const scrollRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, sending, open]);

  useEffect(() => {
    if (open && inputRef.current) {
      const t = setTimeout(() => inputRef.current?.focus(), 220);
      return () => clearTimeout(t);
    }
  }, [open]);

  const send = useCallback(async () => {
    const text = input.trim();
    if (!text || sending) return;

    const next = [...messages, { role: "user", content: text }];
    setMessages(next);
    setInput("");
    setSending(true);
    setError("");

    try {
      const res = await fetch("/api/agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data?.error || `Request failed (${res.status})`);
      }
      if (Array.isArray(data.messages)) {
        setMessages(data.messages);
      }
      if (data.leadCaptured) setLeadCaptured(true);
    } catch (e) {
      setError(e?.message || "Something went wrong. Please try again.");
    } finally {
      setSending(false);
    }
  }, [input, sending, messages]);

  const onKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  const renderable = toRenderable(messages);

  return (
    <>
      {/* Floating bubble — collapsed state */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          aria-label="Open chat with TSD"
          style={{
            position: "fixed",
            bottom: "24px",
            right: "24px",
            zIndex: 1000,
            display: "inline-flex",
            alignItems: "center",
            gap: "10px",
            padding: "14px 22px",
            borderRadius: "100px",
            border: "none",
            background: C.gradientPrism,
            color: "#fff",
            fontFamily: "var(--font-body)",
            fontSize: "14px",
            fontWeight: 600,
            letterSpacing: "0.2px",
            cursor: "pointer",
            boxShadow:
              "0 12px 30px rgba(19,41,75,0.35), 0 4px 12px rgba(19,41,75,0.25)",
            transition: "transform 0.2s ease, box-shadow 0.2s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-2px)";
            e.currentTarget.style.boxShadow =
              "0 18px 40px rgba(19,41,75,0.4), 0 6px 16px rgba(19,41,75,0.28)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow =
              "0 12px 30px rgba(19,41,75,0.35), 0 4px 12px rgba(19,41,75,0.25)";
          }}
        >
          <ChatBubbleIcon size={18} />
          <span>Chat with TSD</span>
        </button>
      )}

      {/* Expanded panel */}
      {open && (
        <div
          role="dialog"
          aria-label="TSD chat agent"
          style={{
            position: "fixed",
            bottom: "24px",
            right: "24px",
            zIndex: 1000,
            width: "min(380px, calc(100vw - 32px))",
            height: "min(560px, calc(100vh - 48px))",
            display: "flex",
            flexDirection: "column",
            borderRadius: "20px",
            overflow: "hidden",
            background: v("bg"),
            border: `1px solid ${v("surface-border")}`,
            boxShadow:
              "0 24px 60px rgba(19,41,75,0.35), 0 8px 24px rgba(19,41,75,0.18)",
          }}
        >
          {/* Header — editorial masthead */}
          <div
            style={{
              padding: "16px 20px",
              background: C.gradientPrism,
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "12px",
            }}
          >
            <div>
              <div
                style={{
                  fontSize: "9px",
                  fontWeight: 700,
                  letterSpacing: "3px",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.78)",
                  marginBottom: "2px",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <span style={{ fontSize: "7px" }}>{"◆"}</span> Chat Agent
              </div>
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  fontStyle: "italic",
                  fontWeight: 700,
                  fontSize: "18px",
                  lineHeight: 1.1,
                }}
              >
                TSD Modernization
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              aria-label="Close chat"
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                border: "1px solid rgba(255,255,255,0.25)",
                background: "rgba(255,255,255,0.1)",
                color: "#fff",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                flexShrink: 0,
              }}
            >
              <CloseIcon size={16} />
            </button>
          </div>

          {/* Lead-captured banner */}
          {leadCaptured && (
            <div
              style={{
                padding: "10px 16px",
                background: "rgba(6,214,160,0.08)",
                borderBottom: `1px solid ${v("surface-border")}`,
                color: v("text-muted"),
                fontSize: "12px",
                lineHeight: 1.4,
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <span style={{ color: C.success, fontSize: "10px" }}>{"◆"}</span>
              Lead submitted — a founder will reach out within 24 hours.
            </div>
          )}

          {/* Messages */}
          <div
            ref={scrollRef}
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "20px",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
              background: v("bg"),
            }}
          >
            {renderable.map((m, i) => (
              <div
                key={i}
                style={{
                  alignSelf: m.role === "user" ? "flex-end" : "flex-start",
                  maxWidth: "85%",
                }}
              >
                <div
                  style={{
                    padding: "10px 14px",
                    borderRadius:
                      m.role === "user"
                        ? "16px 16px 4px 16px"
                        : "16px 16px 16px 4px",
                    background:
                      m.role === "user"
                        ? C.gradientAccent
                        : v("surface"),
                    border:
                      m.role === "user"
                        ? "none"
                        : `1px solid ${v("surface-border")}`,
                    color: m.role === "user" ? "#fff" : v("text"),
                    fontSize: "14px",
                    lineHeight: 1.55,
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-word",
                  }}
                >
                  {m.text}
                </div>
              </div>
            ))}
            {sending && (
              <div style={{ alignSelf: "flex-start", maxWidth: "85%" }}>
                <div
                  style={{
                    padding: "6px 14px",
                    borderRadius: "16px 16px 16px 4px",
                    background: v("surface"),
                    border: `1px solid ${v("surface-border")}`,
                  }}
                >
                  <TypingDots />
                </div>
              </div>
            )}
          </div>

          {/* Error bar */}
          {error && (
            <div
              role="alert"
              style={{
                padding: "10px 16px",
                background: "rgba(239,68,68,0.08)",
                borderTop: "1px solid rgba(239,68,68,0.2)",
                color: "#fca5a5",
                fontSize: "12px",
                lineHeight: 1.4,
              }}
            >
              {error}
            </div>
          )}

          {/* Input */}
          <div
            style={{
              padding: "14px 16px",
              borderTop: `1px solid ${v("surface-border")}`,
              background: v("bg-alt"),
              display: "flex",
              gap: "10px",
              alignItems: "flex-end",
            }}
          >
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder="Ask about pricing, the cohort, or your project…"
              rows={1}
              disabled={sending}
              style={{
                flex: 1,
                resize: "none",
                minHeight: "40px",
                maxHeight: "120px",
                padding: "10px 14px",
                borderRadius: "12px",
                border: `1px solid ${v("surface-border")}`,
                background: v("surface"),
                color: v("text"),
                fontSize: "14px",
                fontFamily: "var(--font-body)",
                lineHeight: 1.4,
                outline: "none",
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = C.carolina;
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = "";
              }}
            />
            <button
              onClick={send}
              disabled={sending || !input.trim()}
              aria-label="Send message"
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                border: "none",
                background:
                  sending || !input.trim()
                    ? v("surface")
                    : C.gradientAccent,
                color: sending || !input.trim() ? v("text-dim") : "#fff",
                cursor: sending || !input.trim() ? "default" : "pointer",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                transition: "transform 0.15s ease",
              }}
            >
              <SendIcon size={16} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
