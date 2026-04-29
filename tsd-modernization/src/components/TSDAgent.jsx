import { useState, useRef, useEffect, useCallback } from "react";
import { C, v } from "../shared";
import { trackEvent } from "../analytics.js";

/* ── TSD chat agent ────────────────────────────────────────────────
 * Floating chat widget mounted globally in Layout. Talks to /api/agent
 * (Vercel serverless function → Claude Haiku 4.5). The agent answers
 * questions and, when a visitor shows clear intent, calls the
 * capture_lead tool which posts to the same Web3Forms backend the
 * contact page uses.
 *
 * Wire format from the server is NDJSON over a streaming response.
 * Each line is a JSON event:
 *   {type:"delta", text}                    — text streaming in
 *   {type:"done", messages, leadCaptured}   — terminal, canonical state
 *   {type:"error", error}                   — terminal, failure
 *
 * State model: while a response is streaming we accumulate text into
 * `streamingText` and render it in a separate transient bubble. When
 * the server emits `done`, we replace `messages` with the canonical
 * full history (which includes tool_use / tool_result blocks the
 * client doesn't see) and clear `streamingText`.
 *
 * Persistence: messages + leadCaptured are mirrored to localStorage on
 * every change. On mount we hydrate from localStorage if the saved
 * blob is current-version and within the TTL window.
 */

const INITIAL_GREETING =
  "Hi — I'm the chat agent for TSD Modernization Solutions. Ask me about pricing, the Summer 2026 cohort, or what we build. If you want to talk to a founder, just say so.";

const STORAGE_KEY = "tsd-agent-conversation";
const STORAGE_VERSION = 1;
const STORAGE_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

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

function TrashIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M5 7h14M10 11v6M14 11v6M6 7l1 12a2 2 0 002 2h6a2 2 0 002-2l1-12M9 7V5a2 2 0 012-2h2a2 2 0 012 2v2"
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

function loadFromStorage() {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    if (data?.version !== STORAGE_VERSION) return null;
    if (!Array.isArray(data.messages) || data.messages.length === 0) return null;
    if (Date.now() - (data.savedAt || 0) > STORAGE_MAX_AGE_MS) {
      window.localStorage.removeItem(STORAGE_KEY);
      return null;
    }
    return {
      messages: data.messages,
      leadCaptured: Boolean(data.leadCaptured),
      // Backward-compat: pre-transcript-emailing storage blobs won't have
      // these. Treat missing as null/0 so behavior degrades cleanly.
      conversationId: data.conversationId || null,
      startedAt: data.startedAt || null,
      lastSentCount: Number(data.lastSentCount) || 0,
    };
  } catch {
    return null;
  }
}

function saveToStorage(messages, leadCaptured, conversationId, startedAt, lastSentCount) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        version: STORAGE_VERSION,
        messages,
        leadCaptured,
        conversationId: conversationId || null,
        startedAt: startedAt || null,
        lastSentCount: Number(lastSentCount) || 0,
        savedAt: Date.now(),
      }),
    );
  } catch {}
}

function clearStorage() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {}
}

export default function TSDAgent() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "assistant", content: INITIAL_GREETING },
  ]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [streamingText, setStreamingText] = useState("");
  const [error, setError] = useState("");
  const [leadCaptured, setLeadCaptured] = useState(false);
  const scrollRef = useRef(null);
  const inputRef = useRef(null);
  const hydratedRef = useRef(false);

  // Refs supporting the end-of-conversation transcript email. These
  // mirror state values so the pagehide listener (attached once with
  // an empty deps array) can read the latest values without
  // re-attaching every render.
  const conversationIdRef = useRef(null);
  const startedAtRef = useRef(null);
  const lastSentCountRef = useRef(0);
  const messagesRef = useRef(messages);
  const sendingRef = useRef(false);

  // Hydrate from localStorage on mount (client-only — useEffect doesn't run during SSR prerender).
  useEffect(() => {
    const persisted = loadFromStorage();
    if (persisted) {
      setMessages(persisted.messages);
      if (persisted.leadCaptured) setLeadCaptured(true);
      // Restore the transcript-email state too so a returning visitor
      // doesn't trigger a duplicate email for content that already shipped.
      conversationIdRef.current = persisted.conversationId;
      startedAtRef.current = persisted.startedAt;
      lastSentCountRef.current = persisted.lastSentCount || 0;
    }
    hydratedRef.current = true;
  }, []);

  // Keep refs in sync with state so the pagehide/visibilitychange
  // listeners — attached once below — always see the latest messages
  // without needing to re-bind.
  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);
  useEffect(() => {
    sendingRef.current = sending;
  }, [sending]);

  // Persist to localStorage whenever messages or leadCaptured change.
  // Skip the initial render (before hydration) so we don't overwrite a
  // saved conversation with the default greeting.
  useEffect(() => {
    if (!hydratedRef.current) return;
    if (messages.length <= 1 && !leadCaptured) {
      // Only the greeting present; don't bother persisting.
      clearStorage();
      return;
    }
    saveToStorage(
      messages,
      leadCaptured,
      conversationIdRef.current,
      startedAtRef.current,
      lastSentCountRef.current,
    );
  }, [messages, leadCaptured]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, sending, streamingText, open]);

  useEffect(() => {
    if (open && inputRef.current) {
      const t = setTimeout(() => inputRef.current?.focus(), 220);
      return () => clearTimeout(t);
    }
  }, [open]);

  // Track agent_opened the first time the panel opens in a session.
  useEffect(() => {
    if (open) trackEvent("agent_opened");
  }, [open]);

  /* ── End-of-conversation transcript email ─────────────────────────
   *
   * Fires a POST to /api/chat-transcript with the full conversation
   * when the visitor leaves the page or closes the chat widget.
   *
   * Uses navigator.sendBeacon — the only browser API designed for
   * "fire-and-forget POST that completes during page unload." Falls
   * back to fetch with keepalive:true on the rare browser without
   * sendBeacon support.
   *
   * Server dedups by conversation_id + message count so multiple
   * triggers (pagehide AND widget close AND visibility change) only
   * produce one email per unique conversation state. lastSentCountRef
   * keeps the client side in sync so we don't even bother POSTing
   * when there's nothing new since the last send.
   */
  const sendTranscript = useCallback(() => {
    const conversationId = conversationIdRef.current;
    const currentMessages = messagesRef.current;
    if (!conversationId) return;
    if (!Array.isArray(currentMessages) || !currentMessages.length) return;
    if (currentMessages.length <= lastSentCountRef.current) return;

    // Skip empty/AI-only conversations (visitor never typed anything).
    const hasUserMsg = currentMessages.some(
      (m) =>
        m?.role === "user" &&
        typeof m.content === "string" &&
        m.content.trim(),
    );
    if (!hasUserMsg) return;

    const payload = {
      conversation_id: conversationId,
      messages: currentMessages,
      page_url:
        typeof window !== "undefined" ? window.location.href : "",
      started_at: startedAtRef.current,
    };

    try {
      if (
        typeof navigator !== "undefined" &&
        typeof navigator.sendBeacon === "function"
      ) {
        const blob = new Blob([JSON.stringify(payload)], {
          type: "application/json",
        });
        const ok = navigator.sendBeacon("/api/chat-transcript", blob);
        if (ok) {
          lastSentCountRef.current = currentMessages.length;
        }
      } else if (typeof fetch === "function") {
        // Fallback path. keepalive lets the request survive a tab close
        // similar to sendBeacon, with broader header support.
        fetch("/api/chat-transcript", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
          keepalive: true,
        })
          .then((res) => {
            if (res.status < 400) {
              lastSentCountRef.current = currentMessages.length;
            }
          })
          .catch(() => {});
      }
    } catch {
      // Swallow — this fires during page unload, no UI to surface to.
    }
  }, []);

  // Attach pagehide + visibilitychange listeners once. pagehide is the
  // canonical "user is leaving" signal (more reliable than beforeunload,
  // works on iOS). visibilitychange catches the case where the user
  // backgrounds the tab without actually closing it.
  useEffect(() => {
    if (typeof window === "undefined") return undefined;
    const onPagehide = () => sendTranscript();
    const onVisibility = () => {
      if (
        typeof document !== "undefined" &&
        document.visibilityState === "hidden"
      ) {
        sendTranscript();
      }
    };
    window.addEventListener("pagehide", onPagehide);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      window.removeEventListener("pagehide", onPagehide);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [sendTranscript]);

  const send = useCallback(async () => {
    const text = input.trim();
    if (!text || sending) return;

    // First real visitor message in this conversation? Mint a fresh
    // conversation_id + start time so the transcript email has a
    // stable handle to dedup on. crypto.randomUUID is available in
    // every browser back to ~2020, fine for our audience.
    if (!conversationIdRef.current) {
      try {
        conversationIdRef.current =
          typeof crypto !== "undefined" && crypto.randomUUID
            ? crypto.randomUUID()
            : `c_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
      } catch {
        conversationIdRef.current = `c_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
      }
      startedAtRef.current = new Date().toISOString();
      lastSentCountRef.current = 0;
    }

    const next = [...messages, { role: "user", content: text }];
    setMessages(next);
    setInput("");
    setSending(true);
    setStreamingText("");
    setError("");
    trackEvent("agent_message_sent");

    try {
      const res = await fetch("/api/agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next }),
      });

      if (!res.ok) {
        // Non-streaming error response — server returned JSON before
        // it started streaming (auth, rate limit, validation).
        let errMsg = `Request failed (${res.status})`;
        try {
          const errData = await res.json();
          if (errData?.error) errMsg = errData.error;
        } catch {}
        throw new Error(errMsg);
      }

      if (!res.body) {
        throw new Error("Streaming is not supported in this browser.");
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let accumulatedText = "";

      // Process one parsed event from the NDJSON stream.
      const handleEvent = (event) => {
        if (event.type === "delta" && typeof event.text === "string") {
          accumulatedText += event.text;
          setStreamingText(accumulatedText);
        } else if (event.type === "done") {
          if (Array.isArray(event.messages)) setMessages(event.messages);
          if (event.leadCaptured) {
            setLeadCaptured(true);
            trackEvent("agent_lead_captured");
          }
          setStreamingText("");
        } else if (event.type === "error") {
          throw new Error(event.error || "Agent error.");
        }
      };

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";
        for (const line of lines) {
          if (!line.trim()) continue;
          try {
            handleEvent(JSON.parse(line));
          } catch (parseErr) {
            // If parse fails because handleEvent threw, rethrow it.
            if (parseErr instanceof Error && parseErr.message !== "Unexpected end of JSON input") {
              throw parseErr;
            }
          }
        }
      }
      // Flush any final partial line (server should always end with \n,
      // but handle the case where the last newline was lost).
      if (buffer.trim()) {
        try {
          handleEvent(JSON.parse(buffer));
        } catch {}
      }
    } catch (e) {
      setError(e?.message || "Something went wrong. Please try again.");
      setStreamingText("");
      trackEvent("agent_error", { error: e?.message?.slice(0, 100) });
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

  const clearConversation = useCallback(() => {
    if (sending) return;
    // Fire one last transcript before wiping local state — the visitor
    // explicitly chose to clear, but the founders should still see what
    // was discussed up to that point.
    sendTranscript();
    setMessages([{ role: "assistant", content: INITIAL_GREETING }]);
    setLeadCaptured(false);
    setStreamingText("");
    setError("");
    clearStorage();
    // Reset conversation-tracking refs so the next message starts a
    // fresh conversation_id (and, therefore, a fresh email thread).
    conversationIdRef.current = null;
    startedAtRef.current = null;
    lastSentCountRef.current = 0;
    trackEvent("agent_cleared");
  }, [sending, sendTranscript]);

  // Wraps setOpen(false) so closing the widget with content present
  // also flushes the transcript to the founders. Server dedups so this
  // doesn't double-email when pagehide eventually fires.
  const closeWidget = useCallback(() => {
    sendTranscript();
    setOpen(false);
  }, [sendTranscript]);

  const renderable = toRenderable(messages);
  const hasHistory = messages.length > 1 || leadCaptured;

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
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              {hasHistory && (
                <button
                  onClick={clearConversation}
                  aria-label="Clear conversation"
                  title="Clear conversation"
                  disabled={sending}
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
                    cursor: sending ? "default" : "pointer",
                    opacity: sending ? 0.5 : 1,
                  }}
                >
                  <TrashIcon size={14} />
                </button>
              )}
              <button
                onClick={closeWidget}
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
            {/* Streaming bubble — visible while a response is being generated.
                Shows accumulated text once first delta arrives; typing dots
                while waiting for the first delta or during a tool-execution
                pause. */}
            {(sending || streamingText) && (
              <div style={{ alignSelf: "flex-start", maxWidth: "85%" }}>
                <div
                  style={{
                    padding: streamingText ? "10px 14px" : "6px 14px",
                    borderRadius: "16px 16px 16px 4px",
                    background: v("surface"),
                    border: `1px solid ${v("surface-border")}`,
                    color: v("text"),
                    fontSize: "14px",
                    lineHeight: 1.55,
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-word",
                  }}
                >
                  {streamingText || <TypingDots />}
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
