import { useState } from "react";
import { Link, useParams, Navigate } from "react-router-dom";
import { C, v, Card, Tag, DiamondDivider, RippleButton } from "../shared";
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
      <circle cx="24" cy="24" r="23" stroke="rgba(255,255,255,0.8)" strokeWidth="2" />
      <path d="M19 15l14 9-14 9V15z" fill="rgba(255,255,255,0.9)" />
    </svg>
  );
}

function VideoCard({ video, gradient }) {
  return (
    <div style={{
      borderRadius: "16px", overflow: "hidden",
      border: `1px solid ${v("border")}`, background: v("card-bg"),
      transition: "border-color 0.2s, box-shadow 0.2s",
    }}
      onMouseEnter={(e) => { e.currentTarget.style.borderColor = C.carolina; e.currentTarget.style.boxShadow = `0 4px 20px rgba(75,156,211,0.15)`; }}
      onMouseLeave={(e) => { e.currentTarget.style.borderColor = v("border"); e.currentTarget.style.boxShadow = "none"; }}
    >
      <div style={{
        height: "160px", background: gradient, position: "relative",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <PlayIcon />
        <span style={{
          position: "absolute", bottom: "10px", right: "12px",
          background: "rgba(0,0,0,0.6)", borderRadius: "6px",
          padding: "2px 8px", fontSize: "12px", color: "#fff", fontWeight: 600,
        }}>Coming Soon</span>
      </div>
      <div style={{ padding: "16px" }}>
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
    [dir === "left" ? "left" : "right"]: "12px",
    width: "40px", height: "40px", borderRadius: "50%",
    background: "rgba(0,0,0,0.5)", border: "1px solid rgba(255,255,255,0.2)",
    color: "#fff", fontSize: "20px", cursor: "pointer",
    display: "flex", alignItems: "center", justifyContent: "center", zIndex: 2,
  });
  return (
    <div>
      <div style={{ position: "relative", borderRadius: "16px", overflow: "hidden", border: `1px solid ${v("border")}` }}>
        {slide.embed ? (
          // Embed slides (animated demos like ChatbotDemo, MakeFlowDemo) get
          // a taller container than image/placeholder slides so the demos
          // have more vertical real estate to scale into. The Stage inside
          // the demos preserves its 1280×720 aspect ratio and scales to fit
          // this box — taller container → larger rendered demo.
          <div style={{ height: "520px", position: "relative", overflow: "hidden", background: "#06101e" }}>
            <GalleryEmbed name={slide.embed} />
          </div>
        ) : slide.image ? (
          <div style={{ height: "320px", position: "relative", overflow: "hidden", background: "#0a1628" }}>
            <img
              src={slide.image}
              alt={slide.title}
              loading="lazy"
              style={{
                width: "100%", height: "100%",
                objectFit: "cover", objectPosition: "center",
                display: "block",
              }}
            />
          </div>
        ) : (
          <div style={{
            height: "320px", background: gradient,
            display: "flex", alignItems: "center", justifyContent: "center",
            flexDirection: "column", gap: "12px", padding: "32px",
          }}>
            <span style={{ opacity: 0.85, color: "#fff" }}>
              {slide.Icon ? <slide.Icon size={48} /> : null}
            </span>
            <span style={{ fontSize: "16px", fontWeight: 600, color: "#fff", textAlign: "center", textShadow: "0 2px 8px rgba(0,0,0,0.3)" }}>{slide.title}</span>
            <span style={{
              position: "absolute", bottom: "10px", right: "12px",
              background: "rgba(0,0,0,0.6)", borderRadius: "6px",
              padding: "2px 8px", fontSize: "12px", color: "#fff", fontWeight: 600,
            }}>Placeholder</span>
          </div>
        )}
        {slides.length > 1 && (
          <>
            <button onClick={prev} style={arrowBtn("left")} aria-label="Previous slide">&#8249;</button>
            <button onClick={next} style={arrowBtn("right")} aria-label="Next slide">&#8250;</button>
          </>
        )}
      </div>
      <div style={{ padding: "20px 4px 0" }}>
        <h4 style={{ fontSize: "16px", fontWeight: 700, color: v("text"), marginBottom: "6px" }}>{slide.title}</h4>
        <p style={{ fontSize: "14px", lineHeight: 1.6, color: v("text-muted"), margin: 0 }}>{slide.desc}</p>
      </div>
      {slides.length > 1 && (
        <div style={{ display: "flex", justifyContent: "center", gap: "8px", marginTop: "16px" }}>
          {slides.map((_, i) => (
            <button key={i} onClick={() => setIdx(i)} aria-label={`Go to slide ${i + 1}`} style={{
              width: i === idx ? "24px" : "8px", height: "8px", borderRadius: "4px",
              border: "none", cursor: "pointer",
              background: i === idx ? C.carolina : "rgba(75,156,211,0.25)",
              transition: "all 0.3s ease",
            }} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function ServiceDetail() {
  const { slug } = useParams();
  const service = getServiceBySlug(slug);
  if (!service) return <Navigate to="/services" replace />;

  return (
    <PageShell>
      <div style={{ padding: "40px 48px 80px", maxWidth: "900px", margin: "0 auto" }}>
        <div style={{ marginBottom: "24px", fontSize: "13px" }}>
          <Link to="/services" style={{ color: v("accent"), fontWeight: 600 }}>← All services</Link>
        </div>

        <div style={{ display: "flex", alignItems: "flex-start", gap: "24px", marginBottom: "32px", flexWrap: "wrap" }}>
          <div style={{
            width: "72px", height: "72px", borderRadius: "18px", background: service.gradient,
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "#fff", flexShrink: 0,
          }}><service.Icon size={34} /></div>
          <div style={{ flex: 1, minWidth: "260px" }}>
            <h1 style={{
              fontSize: "clamp(28px, 4.5vw, 44px)", fontWeight: 800,
              letterSpacing: "-1px", lineHeight: 1.15, color: v("text"),
              marginBottom: "14px",
            }}>{service.title}</h1>
            <p style={{ fontSize: "16px", lineHeight: 1.7, color: v("text-muted"), marginBottom: "10px" }}>{service.desc}</p>
            <p style={{ fontSize: "14px", lineHeight: 1.7, color: v("text-dim"), marginBottom: "18px" }}>{service.longDesc}</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              {service.tags.map((t) => <Tag key={t}>{t}</Tag>)}
            </div>
          </div>
        </div>

        <DiamondDivider width={160} style={{ margin: "48px auto" }} />

        <section style={{ marginBottom: "48px" }}>
          <h2 style={{ fontSize: "13px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1.5px", color: C.carolina, marginBottom: "18px" }}>
            What's Included
          </h2>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {service.included.map((item, i) => (
              <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: "12px", padding: "10px 0", fontSize: "15px", lineHeight: 1.6, color: v("text") }}>
                <span style={{ color: C.success, flexShrink: 0, marginTop: "3px" }}><CheckIcon size={16} /></span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "20px", marginBottom: "56px" }}>
          <div style={{ padding: "20px 24px", borderRadius: "14px", background: v("surface"), border: `1px solid ${v("surface-border")}` }}>
            <p style={{ fontSize: "12px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1.2px", color: C.carolina, marginBottom: "8px" }}>Typical Timeline</p>
            <p style={{ fontSize: "14px", lineHeight: 1.6, color: v("text-muted"), margin: 0 }}>{service.timeline}</p>
          </div>
          <div style={{ padding: "20px 24px", borderRadius: "14px", background: C.gradientSubtle, border: "1px solid rgba(75,156,211,0.2)" }}>
            <p style={{ fontSize: "12px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1.2px", color: C.carolina, marginBottom: "8px" }}>Starting Price</p>
            <p style={{ fontSize: "14px", lineHeight: 1.6, color: v("text"), margin: 0 }}>{service.price}</p>
          </div>
        </section>

        <section style={{ marginBottom: "56px" }}>
          <h2 style={{ fontSize: "13px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1.5px", color: C.carolina, marginBottom: "20px" }}>
            Demo Videos
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "20px" }}>
            {service.videos.map((vid, i) => <VideoCard key={i} video={vid} gradient={service.gradient} />)}
          </div>
          <p style={{ fontSize: "13px", color: v("text-dim"), textAlign: "center", marginTop: "20px", fontStyle: "italic" }}>
            Video demos are being produced — check back soon.
          </p>
        </section>

        <section style={{ marginBottom: "56px" }}>
          <h2 style={{ fontSize: "13px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1.5px", color: C.carolina, marginBottom: "20px" }}>
            Solutions Gallery
          </h2>
          <GallerySlideshow slides={service.gallery} gradient={service.gradient} />
        </section>

        <section style={{
          padding: "clamp(28px, 4vw, 40px) clamp(24px, 4vw, 40px)",
          background: C.gradientPrism,
          borderRadius: "20px",
          textAlign: "center", color: "#fff",
          boxShadow: "0 20px 60px rgba(19,41,75,0.2)",
        }}>
          <h3 style={{
            fontFamily: "var(--font-body)", fontSize: "clamp(22px, 3.5vw, 30px)", fontWeight: 800,
            letterSpacing: "-0.5px", marginBottom: "12px",
          }}>
            Ready to get started?
          </h3>
          <p style={{ fontSize: "15px", lineHeight: 1.65, color: "rgba(255,255,255,0.9)", maxWidth: "500px", margin: "0 auto 24px" }}>
            Free fit call, 48-hour written proposal, 100% money-back guarantee.
          </p>
          <Link to="/contact">
            <RippleButton variant="secondary" style={{
              padding: "14px 32px", fontSize: "14px",
              background: "#fff", color: C.navy, borderColor: "transparent",
            }}>
              Apply for a founding slot <ArrowRightIcon size={14} />
            </RippleButton>
          </Link>
        </section>
      </div>
    </PageShell>
  );
}
