import { useState } from "react";
import { Link, useParams, Navigate } from "react-router-dom";
import {
  C, v,
  Card, Tag, DiamondDivider, Button,
  Eyebrow, ChapterRule, GradientText,
  SPACE, RADIUS, SHADOW,
} from "../shared";
import { CheckIcon, ArrowRightIcon } from "../icons";
import PageShell from "./PageShell";
import { getServiceBySlug } from "../services-data";
import ChatbotDemo from "../components/ChatbotDemo";
import MakeFlowDemo from "../components/MakeFlowDemo";

function GalleryEmbed({ name }) {
  if (name === "chatbot-demo") return <ChatbotDemo />;
  if (name === "make-flow-demo") return <MakeFlowDemo />;
  return null;
}

function PlayIcon({ size = 48 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <circle cx="24" cy="24" r="23" stroke="rgba(255,255,255,0.85)" strokeWidth="1.6" />
      <path d="M19 15l14 9-14 9V15z" fill="rgba(255,255,255,0.95)" />
    </svg>
  );
}

function VideoCard({ video, gradient }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        borderRadius: RADIUS.lg, overflow: "hidden",
        border: `1px solid ${hovered ? "var(--glass-border-strong)" : "var(--glass-border)"}`,
        background: "var(--glass-bg-strong)",
        backdropFilter: "blur(var(--glass-blur)) saturate(var(--glass-saturate))",
        WebkitBackdropFilter: "blur(var(--glass-blur)) saturate(var(--glass-saturate))",
        transition: "border-color 0.3s ease, transform 0.3s ease, box-shadow 0.3s ease",
        transform: hovered ? "translateY(-2px)" : "translateY(0)",
        boxShadow: hovered ? "var(--glass-shadow), 0 0 28px var(--glass-glow)" : "var(--glass-shadow)",
      }}>
      <div style={{
        height: "180px", background: gradient, position: "relative",
        display: "flex", alignItems: "center", justifyContent: "center",
        overflow: "hidden",
      }}>
        <div style={{ transform: hovered ? "scale(1.08)" : "scale(1)", transition: "transform 0.4s ease" }}>
          <PlayIcon />
        </div>
        <span style={{
          position: "absolute", bottom: "12px", right: "14px",
          background: "rgba(7,13,26,0.75)", borderRadius: RADIUS.sm,
          padding: "4px 10px",
          fontSize: "10px", fontWeight: 700, letterSpacing: "1.5px",
          textTransform: "uppercase", color: "#fff",
          backdropFilter: "blur(var(--glass-blur)) saturate(var(--glass-saturate))", WebkitBackdropFilter: "blur(var(--glass-blur)) saturate(var(--glass-saturate))",
        }}>Coming Soon</span>
      </div>
      <div style={{ padding: SPACE.md }}>
        <h4 style={{ fontSize: "15px", fontWeight: 700, color: v("text"), marginBottom: "6px" }}>{video.title}</h4>
        <p style={{ fontSize: "13px", lineHeight: 1.6, color: v("text-muted"), margin: 0 }}>{video.desc}</p>
      </div>
    </div>
  );
}

function GallerySlideshow({ slides, gradient }) {
  const [idx, setIdx] = useState(0);
  const slide = slides[idx];
  const prev = () => setIdx((i) => (i - 1 + slides.length) % slides.length);
  const next = () => setIdx((i) => (i + 1) % slides.length);

  const arrowBtn = (dir) => ({
    position: "absolute", top: "50%", transform: "translateY(-50%)",
    [dir === "left" ? "left" : "right"]: "16px",
    width: "44px", height: "44px", borderRadius: RADIUS.full,
    background: "rgba(7,13,26,0.6)",
    border: "1px solid rgba(255,255,255,0.18)",
    backdropFilter: "blur(var(--glass-blur)) saturate(var(--glass-saturate))", WebkitBackdropFilter: "blur(var(--glass-blur)) saturate(var(--glass-saturate))",
    color: "#fff", fontSize: "20px", cursor: "pointer",
    display: "flex", alignItems: "center", justifyContent: "center", zIndex: 2,
    transition: "transform 0.2s ease, background 0.2s ease",
  });

  return (
    <div>
      <div style={{
        position: "relative",
        borderRadius: RADIUS.xl, overflow: "hidden",
        border: `1px solid ${v("surface-border")}`,
        boxShadow: SHADOW.md,
      }}>
        {slide.embed ? (
          <div style={{ height: "560px", position: "relative", overflow: "hidden", background: "#06101e" }}>
            <GalleryEmbed name={slide.embed} />
          </div>
        ) : slide.image ? (
          <div style={{ height: "340px", position: "relative", overflow: "hidden", background: "#0a1628" }}>
            <img
              src={slide.image} alt={slide.title} loading="lazy"
              style={{
                width: "100%", height: "100%",
                objectFit: "cover", objectPosition: "center",
                display: "block",
              }}
            />
          </div>
        ) : (
          <div style={{
            height: "340px", background: gradient,
            display: "flex", alignItems: "center", justifyContent: "center",
            flexDirection: "column", gap: "12px", padding: SPACE.xl,
            position: "relative",
          }}>
            <span style={{ opacity: 0.85, color: "#fff" }}>
              {slide.Icon ? <slide.Icon size={48} /> : null}
            </span>
            <span style={{
              fontSize: "16px", fontWeight: 600, color: "#fff", textAlign: "center",
              textShadow: "0 2px 10px rgba(0,0,0,0.35)",
            }}>{slide.title}</span>
            <span style={{
              position: "absolute", bottom: "12px", right: "14px",
              background: "rgba(7,13,26,0.7)", borderRadius: RADIUS.sm,
              padding: "4px 10px",
              fontSize: "10px", fontWeight: 700, letterSpacing: "1.5px",
              textTransform: "uppercase", color: "#fff",
            }}>Placeholder</span>
          </div>
        )}
        {slides.length > 1 && (
          <>
            <button onClick={prev} style={arrowBtn("left")} aria-label="Previous slide">‹</button>
            <button onClick={next} style={arrowBtn("right")} aria-label="Next slide">›</button>
          </>
        )}
      </div>
      <div style={{ padding: `${SPACE.lg} 4px 0` }}>
        <h4 style={{ fontSize: "17px", fontWeight: 700, color: v("text"), marginBottom: "6px" }}>{slide.title}</h4>
        <p style={{ fontSize: "14px", lineHeight: 1.6, color: v("text-muted"), margin: 0 }}>{slide.desc}</p>
      </div>
      {slides.length > 1 && (
        <div style={{
          display: "flex", justifyContent: "center", gap: "8px",
          marginTop: SPACE.md,
        }}>
          {slides.map((_, i) => (
            <button key={i} onClick={() => setIdx(i)} aria-label={`Go to slide ${i + 1}`} style={{
              width: i === idx ? "28px" : "8px", height: "8px", borderRadius: RADIUS.full,
              border: "none", cursor: "pointer", padding: 0,
              background: i === idx ? C.gradientAccent : "rgba(75,156,211,0.25)",
              transition: "all 0.35s cubic-bezier(0.16,1,0.3,1)",
            }} />
          ))}
        </div>
      )}
    </div>
  );
}

/* Shared glass-panel style for the bespoke sections below. */
const glassPanel = (strong) => ({
  padding: SPACE.xl,
  borderRadius: "var(--glass-radius)",
  background: "var(--glass-bg-strong)",
  border: `1px solid ${strong ? "var(--glass-border-strong)" : "var(--glass-border)"}`,
  backdropFilter: "blur(var(--glass-blur)) saturate(var(--glass-saturate))",
  WebkitBackdropFilter: "blur(var(--glass-blur)) saturate(var(--glass-saturate))",
  boxShadow: strong ? "var(--glass-shadow), 0 0 28px var(--glass-glow)" : "var(--glass-shadow)",
  position: "relative", isolation: "isolate",
});

const glassRim = (
  <span aria-hidden="true" style={{
    position: "absolute", top: 0, left: "8%", right: "8%", height: "1px",
    background: "linear-gradient(90deg, transparent, var(--glass-rim), transparent)",
    pointerEvents: "none",
  }} />
);

/* ── What this saves you — the money table that opens every service. */
function SavesSection({ service }) {
  return (
    <section style={{ marginBottom: SPACE["3xl"] }}>
      <div style={glassPanel(true)}>
        {glassRim}
        <Eyebrow style={{ marginBottom: SPACE.md }}>What this saves you</Eyebrow>
        <p style={{
          fontSize: "15px", color: v("text-muted"), lineHeight: 1.6,
          margin: `0 0 ${SPACE.lg}`, maxWidth: "52ch",
        }}>
          The same technology the big franchises run, sized to your shop. Here is what it puts back in your pocket.
        </p>
        <div>
          {service.savesRows.map((row, i) => (
            <div key={i} style={{
              display: "flex", justifyContent: "space-between", alignItems: "baseline",
              gap: "16px", padding: "12px 0",
              borderTop: i === 0 ? "none" : `1px solid ${v("divider-soft")}`,
            }}>
              <span style={{ fontSize: "15px", color: v("text-muted"), lineHeight: 1.5 }}>{row.label}</span>
              <span style={{
                fontSize: "16px", fontWeight: 800, color: v("text"),
                whiteSpace: "nowrap", fontFeatureSettings: '"tnum" 1',
              }}>{row.value}</span>
            </div>
          ))}
        </div>
        <div style={{
          marginTop: SPACE.lg, padding: "14px 16px", borderRadius: RADIUS.md,
          background: "rgba(75,156,211,0.08)",
          border: `1px solid ${v("divider")}`,
        }}>
          <p style={{ fontSize: "14px", color: v("text"), lineHeight: 1.55, margin: 0 }}>
            <strong style={{ fontWeight: 700 }}>{service.sheetLine}</strong>{" "}{service.proof}
          </p>
        </div>
        <p style={{
          fontFamily: "var(--font-body)", fontStyle: "normal",
          fontSize: "13px", color: v("text-dim"), lineHeight: 1.6,
          margin: `${SPACE.md} 0 0`,
        }}>
          {service.savesNote}
        </p>
        <div style={{ marginTop: SPACE.lg, display: "flex", gap: "10px", flexWrap: "wrap" }}>
          <Link to="/savings" style={{ textDecoration: "none" }}>
            <Button as="span" variant="secondary" size="sm" iconRight={<ArrowRightIcon size={13} />}>
              Run your own numbers
            </Button>
          </Link>
          <a href={`/sheets/${service.slug}`} style={{ textDecoration: "none" }}>
            <Button as="span" variant="ghost" size="sm">
              Get the one-page savings sheet
            </Button>
          </a>
        </div>
      </div>
    </section>
  );
}

/* ── Optional: how it works, 3 steps (front desk, audit). */
function StepsSection({ steps }) {
  return (
    <section style={{ marginBottom: SPACE["3xl"] }}>
      <Eyebrow style={{ marginBottom: SPACE.lg }}>How it works</Eyebrow>
      <div className="card-grid" style={{
        "--cg-min": "240px",
        gap: SPACE.lg,
      }}>
        {steps.map((s, i) => (
          <Card key={s.num} delay={i * 100}>
            <div style={{
              fontFamily: "var(--font-body)", fontStyle: "normal", fontWeight: 700,
              fontSize: "26px",
              background: C.gradientAccent,
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
              marginBottom: SPACE.sm,
            }}>{s.num}</div>
            <h3 style={{
              fontFamily: "var(--font-body)", fontWeight: 800, fontSize: "20px",
              color: v("text"), marginBottom: SPACE.sm, letterSpacing: "-0.3px",
            }}>{s.title}</h3>
            <p style={{ fontSize: "14px", lineHeight: 1.7, color: v("text-muted"), margin: 0 }}>{s.body}</p>
          </Card>
        ))}
      </div>
    </section>
  );
}

/* ── Optional: us-vs-them comparison table (front desk). */
function ComparisonSection({ comparison }) {
  return (
    <section style={{ marginBottom: SPACE["3xl"] }}>
      <Eyebrow style={{ marginBottom: SPACE.lg }}>How we compare</Eyebrow>
      <div style={{
        overflowX: "auto",
        borderRadius: "var(--glass-radius)",
        border: "1px solid var(--glass-border)",
        backdropFilter: "blur(var(--glass-blur)) saturate(var(--glass-saturate))",
        WebkitBackdropFilter: "blur(var(--glass-blur)) saturate(var(--glass-saturate))",
        boxShadow: "var(--glass-shadow)",
        isolation: "isolate",
      }}>
        <div style={{ minWidth: "600px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr 1.4fr" }}>
            <div style={{ padding: "20px 24px", background: v("surface"), borderBottom: `1px solid ${v("divider")}` }} />
            <div style={{
              padding: "20px 24px", background: v("surface"),
              borderBottom: `1px solid ${v("divider")}`, borderLeft: `1px solid ${v("divider")}`,
            }}>
              <Eyebrow color={v("text-muted")} diamond={false}>{comparison.theirsLabel}</Eyebrow>
              <div style={{
                fontSize: "12px", fontStyle: "normal", color: v("text-dim"),
                marginTop: "6px", fontFamily: "var(--font-body)",
              }}>{comparison.theirsNote}</div>
            </div>
            <div style={{
              padding: "20px 24px",
              background: "linear-gradient(180deg, rgba(75,156,211,0.10) 0%, rgba(75,156,211,0.04) 100%)",
              borderBottom: `1px solid ${v("divider")}`, borderLeft: `1px solid ${v("divider")}`,
            }}>
              <Eyebrow>TSD</Eyebrow>
              <div style={{
                fontSize: "12px", fontStyle: "normal", color: v("text-muted"),
                marginTop: "6px", fontFamily: "var(--font-body)",
              }}>Charlotte metro</div>
            </div>
          </div>
          {comparison.rows.map((row, i) => (
            <div key={i} style={{
              display: "grid", gridTemplateColumns: "1fr 1.4fr 1.4fr",
              borderTop: i === 0 ? "none" : `1px solid ${v("divider-soft")}`,
            }}>
              <div style={{
                padding: "16px 24px", background: v("surface"),
                fontSize: "11px", fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase",
                color: v("text-muted"), display: "flex", alignItems: "center",
              }}>{row.axis}</div>
              <div style={{
                padding: "16px 24px", background: v("surface"),
                borderLeft: `1px solid ${v("divider-soft")}`,
                fontSize: "14px", color: v("text-muted"), lineHeight: 1.5,
              }}>{row.theirs}</div>
              <div style={{
                padding: "16px 24px", background: "rgba(75,156,211,0.05)",
                borderLeft: `1px solid ${v("divider-soft")}`,
                fontSize: "14px", color: v("text"), fontWeight: 500, lineHeight: 1.5,
              }}>{row.ours}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function ServiceDetail() {
  const { slug } = useParams();
  const service = getServiceBySlug(slug);
  if (!service) return <Navigate to="/services" replace />;

  const pairs = (service.pairsWith || [])
    .map((s) => getServiceBySlug(s))
    .filter(Boolean);

  return (
    <PageShell>
      <div style={{
        padding: `${SPACE.xl} clamp(20px, 4vw, 48px) ${SPACE["4xl"]}`,
        maxWidth: "960px", margin: "0 auto",
      }}>
        <div style={{ marginBottom: SPACE.lg, fontSize: "13px" }}>
          <Link to="/services" style={{
            color: v("accent"), fontWeight: 600,
            display: "inline-flex", alignItems: "center", gap: "6px",
          }}>
            <span style={{ transform: "rotate(180deg)", display: "inline-flex" }}>
              <ArrowRightIcon size={14} />
            </span>
            All services
          </Link>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "auto 1fr",
          gap: SPACE.xl,
          alignItems: "flex-start",
          marginBottom: SPACE["2xl"],
        }} className="service-hero">
          <div style={{
            width: "88px", height: "88px", borderRadius: RADIUS.xl,
            background: service.gradient,
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "#fff", flexShrink: 0,
            boxShadow: "0 12px 30px rgba(75,156,211,0.32)",
          }}><service.Icon size={38} /></div>
          <div style={{ flex: 1, minWidth: "260px" }}>
            <h1 style={{
              fontSize: "clamp(30px, 4.8vw, 48px)", fontWeight: 800,
              letterSpacing: "-1.5px", lineHeight: 1.1,
              color: v("text"), marginBottom: SPACE.md,
            }}>{service.title}</h1>
            <p style={{ fontSize: "17px", lineHeight: 1.65, color: v("text-muted"), marginBottom: "10px" }}>{service.desc}</p>
            <p style={{ fontSize: "14px", lineHeight: 1.7, color: v("text-dim"), marginBottom: SPACE.md }}>{service.longDesc}</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              {service.tags.map((t) => <Tag key={t}>{t}</Tag>)}
            </div>
          </div>
        </div>

        <SavesSection service={service} />

        {service.steps && <StepsSection steps={service.steps} />}

        <section style={{ marginBottom: SPACE["3xl"] }}>
          <Eyebrow style={{ marginBottom: SPACE.md }}>What's Included</Eyebrow>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {service.included.map((item, i) => (
              <li key={i} style={{
                display: "flex", alignItems: "flex-start", gap: "12px",
                padding: "12px 0",
                borderTop: i === 0 ? "none" : `1px solid ${v("divider-soft")}`,
                fontSize: "15px", lineHeight: 1.6, color: v("text"),
              }}>
                <span style={{
                  flexShrink: 0, marginTop: "2px",
                  width: "20px", height: "20px", borderRadius: RADIUS.full,
                  background: "rgba(6,214,160,0.16)",
                  display: "inline-flex", alignItems: "center", justifyContent: "center",
                  color: C.success,
                }}>
                  <CheckIcon size={12} strokeWidth={2.5} />
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="card-grid" style={{
          "--cg-min": "260px",
          gap: SPACE.lg,
          marginBottom: SPACE["3xl"],
        }}>
          <div style={{ ...glassPanel(false), padding: SPACE.lg }}>
            {glassRim}
            <Eyebrow style={{ marginBottom: SPACE.sm }}>Typical Timeline</Eyebrow>
            <p style={{ fontSize: "14px", lineHeight: 1.65, color: v("text-muted"), margin: 0 }}>{service.timeline}</p>
          </div>
          <div style={{ ...glassPanel(true), padding: SPACE.lg }}>
            {glassRim}
            <Eyebrow style={{ marginBottom: SPACE.sm }}>The Price</Eyebrow>
            <p style={{ fontSize: "14px", lineHeight: 1.65, color: v("text"), margin: 0 }}>{service.price}</p>
            {service.riskReversal && (
              <div style={{
                marginTop: SPACE.md, padding: "12px 14px", borderRadius: RADIUS.md,
                background: "rgba(75,156,211,0.08)",
                border: `1px dashed ${C.carolina}`,
              }}>
                <Eyebrow style={{ marginBottom: "6px" }}>Risk reversal</Eyebrow>
                <p style={{ fontSize: "13px", color: v("text"), lineHeight: 1.5, margin: 0 }}>{service.riskReversal}</p>
              </div>
            )}
          </div>
        </section>

        {service.comparison && <ComparisonSection comparison={service.comparison} />}

        <section style={{ marginBottom: SPACE["3xl"] }}>
          <Eyebrow style={{ marginBottom: SPACE.lg }}>Demo Videos</Eyebrow>
          <div className="card-grid" style={{
            "--cg-min": "280px",
            gap: SPACE.lg,
          }}>
            {service.videos.map((vid, i) => <VideoCard key={i} video={vid} gradient={service.gradient} />)}
          </div>
          <p style={{
            fontSize: "13px", color: v("text-dim"), textAlign: "center",
            marginTop: SPACE.lg, fontStyle: "normal", fontFamily: "var(--font-body)",
          }}>
            Video demos are being produced — check back soon.
          </p>
        </section>

        <section style={{ marginBottom: SPACE["3xl"] }}>
          <Eyebrow style={{ marginBottom: SPACE.lg }}>Solutions Gallery</Eyebrow>
          <GallerySlideshow slides={service.gallery} gradient={service.gradient} />
        </section>

        {pairs.length > 0 && (
          <section style={{ marginBottom: SPACE["3xl"] }}>
            <Eyebrow style={{ marginBottom: SPACE.md }}>Pairs well with</Eyebrow>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
              {pairs.map((p) => (
                <Link key={p.slug} to={`/services/${p.slug}`} style={{ textDecoration: "none" }}>
                  <Button as="span" variant="ghost" size="sm" iconRight={<ArrowRightIcon size={12} />}>
                    {p.title}
                  </Button>
                </Link>
              ))}
            </div>
          </section>
        )}

        <section style={{
          padding: "clamp(36px, 5vw, 56px) clamp(28px, 5vw, 56px)",
          background: C.gradientPrism,
          borderRadius: RADIUS["2xl"],
          textAlign: "center", color: "#fff",
          boxShadow: "0 28px 80px rgba(19,41,75,0.28), inset 0 1px 0 rgba(255,255,255,0.12)",
          position: "relative", overflow: "hidden",
        }}>
          <span aria-hidden="true" style={{
            position: "absolute", top: "-50px", right: "-50px",
            fontSize: "260px", color: "#fff", opacity: 0.04,
            lineHeight: 1, pointerEvents: "none",
          }}>{"◆"}</span>

          <h3 style={{
            fontFamily: "var(--font-body)", fontSize: "clamp(24px, 3.6vw, 34px)", fontWeight: 800,
            letterSpacing: "-0.6px", marginBottom: SPACE.sm,
            lineHeight: 1.15,
          }}>
            Ready to <span style={{
              fontFamily: "var(--font-body)", fontStyle: "normal", fontWeight: 700,
            }}>stop the leak?</span>
          </h3>
          <p style={{
            fontSize: "15px", lineHeight: 1.65,
            color: "rgba(255,255,255,0.92)",
            maxWidth: "520px", margin: "0 auto 28px",
          }}>
            Free fit call, 48-hour written proposal, 100% money-back guarantee.
          </p>
          <Link to="/contact" style={{ textDecoration: "none" }}>
            <Button as="span" variant="onAccent" size="lg" iconRight={<ArrowRightIcon size={14} />}>
              Start a project
            </Button>
          </Link>
        </section>
      </div>
      <style>{`
        @media (max-width: 600px) {
          .service-hero { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </PageShell>
  );
}
