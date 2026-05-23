import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "เรียน SQL / PL-SQL แบบเห็นภาพ",
  description: "สื่อสอน SQL / PL-SQL ของ Oracle แบบ visual + interactive",
};

const themeScript = `
(function(){
  try {
    var t = localStorage.getItem('theme');
    if (t !== 'light' && t !== 'dark') t = 'dark';
    if (t === 'dark') document.documentElement.classList.add('dark');
  } catch(e) {
    document.documentElement.classList.add('dark');
  }
})();
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th" className="dark">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
