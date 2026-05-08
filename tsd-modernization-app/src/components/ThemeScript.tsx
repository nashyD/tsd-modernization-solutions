/**
 * Inline script that runs before paint to set the theme class on <html>.
 * Reads from localStorage; defaults to dark.
 * Prevents flash of wrong theme on first load.
 */
export function ThemeScript() {
  const code = `
(function() {
  try {
    var stored = localStorage.getItem('tsd-theme');
    if (stored === 'light') {
      document.documentElement.classList.add('light');
    }
    // Default is dark — no class needed.
  } catch (e) {}
})();
`;
  return <script dangerouslySetInnerHTML={{ __html: code }} />;
}
