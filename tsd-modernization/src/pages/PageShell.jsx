import { C, GridBg, GradientOrbs } from "../shared";

export default function PageShell({ children, showOrbs = true, minHeight = "100vh" }) {
  return (
    <section style={{
      position: "relative",
      minHeight,
      paddingTop: "180px",
      paddingBottom: "80px",
      background: C.bg,
      overflow: "hidden",
    }}>
      <GridBg />
      {showOrbs && <GradientOrbs />}
      <div style={{ position: "relative", zIndex: 2 }}>
        {children}
      </div>
    </section>
  );
}
