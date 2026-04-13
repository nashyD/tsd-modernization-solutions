export default function PageShell({ children }) {
  return (
    <div style={{ paddingTop: "100px", minHeight: "100vh" }}>
      {children}
    </div>
  );
}
