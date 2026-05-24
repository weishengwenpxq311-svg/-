import './globals.css';
import type { Metadata, Viewport } from 'next';

export const metadata: Metadata = {
  title: '修琪 · Xiu Qi — Personal Portfolio',
  description: 'Xiu Qi personal portfolio with Qi AI avatar.',
  icons: {
    icon: '/favicon.svg',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  viewportFit: 'cover',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Inter:wght@300;400;500;600&family=Noto+Serif+SC:wght@300;400;500;700&family=ZCOOL+KuaiLe&family=Ma+Shan+Zheng&family=JetBrains+Mono:wght@300;400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body data-vibe="warm" data-accent="chartreuse" data-cursor="trail">
        {children}
      </body>
    </html>
  );
}
