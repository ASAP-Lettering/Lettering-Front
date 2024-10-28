import Providers from "./providers";

export const metadata = {
  title: "레터링 | 온라인 편지 아카이빙 플랫폼",
  titleTemplate: "%s - 레터링",
  description:
    "다양한 우주 행성 그리고 별빛이 담긴 편지지로 마음을 형상화한 편지를 보관해보세요.",
  icons: {
    icon: "/favicon.png",
  },
  openGraph: {
    site_name: "레터링",
    title: "레터링 | 온라인 편지 아카이빙 플랫폼",
    description:
      "다양한 우주 행성 그리고 별빛이 담긴 편지지로 마음을 형상화한 편지를 보관해보세요.",
    url: "https://www.lettering.world",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html>
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1,  maximumScale=1, user-scalable=no"
        />
        <script defer src="https://developers.kakao.com/sdk/js/kakao.min.js" />
      </head>
      <body>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','GTM-K6XC8LPQ');
            `,
          }}
        />
        <Providers>{children}</Providers>
        {/* Google Tag Manager Noscript */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-K6XC8LPQ"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          ></iframe>
        </noscript>
      </body>
    </html>
  );
}
