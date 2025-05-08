import GoogleAnalytics from '@/lib/GoogleAnalytics';
import Providers from './providers';
import { GoogleTagManager } from '@next/third-parties/google';

export const metadata = {
  title: '레터링 | 온라인 편지 아카이빙 플랫폼',
  titleTemplate: '%s - 레터링',
  description:
    '다양한 우주 행성 그리고 별빛이 담긴 편지지로 마음을 형상화한 편지를 보관해보세요.',
  icons: {
    icon: '/icon_16.png'
  },
  openGraph: {
    site_name: '레터링',
    title: '레터링 | 온라인 편지 아카이빙 플랫폼',
    description:
      '다양한 우주 행성 그리고 별빛이 담긴 편지지로 마음을 형상화한 편지를 보관해보세요.',
    url: 'https://www.lettering.world',
    type: 'website'
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html>
      <head>
        <script
          defer
          src="https://developers.kakao.com/sdk/js/kakao.min.js"
        ></script>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximumScale=1, user-scalable=no"
        />
        <meta
          name="google-site-verification"
          content={process.env.NEXT_PUBLIC_GOOGLE_SEARCH_CONSOLE}
        />
        <meta name="theme-color" content="#444d9b" />
        <link rel="apple-touch-icon" href="/icon_114.png"></link>
        <link rel="shortcut icon" href="/icon_72.png"></link>
        {/* Maze Snippet */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function (m, a, z, e) {
                var s, t;
                try {
                  t = m.sessionStorage.getItem('maze-us');
                } catch (err) {}

                if (!t) {
                  t = new Date().getTime();
                  try {
                    m.sessionStorage.setItem('maze-us', t);
                  } catch (err) {}
                }

                s = a.createElement('script');
                s.src = z + '?apiKey=' + e;
                s.async = true;
                a.getElementsByTagName('head')[0].appendChild(s);
                m.mazeUniversalSnippetApiKey = e;
              })(window, document, 'https://snippet.maze.co/maze-universal-loader.js', '697c563b-a019-4f27-8185-5f33599d9c4d');
            `
          }}
        />
      </head>
      <body>
        <Providers>{children}</Providers>
        <GoogleTagManager gtmId={process.env.NEXT_PUBLIC_GOOGLE_TAG_MANAGER} />
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS} />
      </body>
    </html>
  );
}
