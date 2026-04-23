export default function PageShell({ children }) {
  return (
    <div style={{ paddingTop: "120px", minHeight: "100vh" }}>
      {children}
    </div>
  );
}
