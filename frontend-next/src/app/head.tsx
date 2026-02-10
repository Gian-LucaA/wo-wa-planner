export default function Head() {
  return (
    <>
      <title>Deine App</title>
      <script
        dangerouslySetInnerHTML={{
          __html: `
            (function () {
              try {
                const mode = sessionStorage.getItem('mui-mode') ||
                  (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
                document.documentElement.setAttribute('data-color-scheme', mode);
              } catch (e) {}
            })();
          `,
        }}
      />
    </>
  );
}
