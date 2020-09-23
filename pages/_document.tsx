import Document, { Html, Head, Main, NextScript } from "next/document";

const APP_URL = "https://cms-yakwqnqcrq-de.a.run.app";
const APP_NAME = "Client Management System";
const APP_DESCRIPTION = "An app that manages your clients relations";
const APP_THEME_COLOR = "#3182ce";

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    return (
      <Html lang="en">
        <Head>
          <meta name="application-name" content={APP_NAME} />

          <meta name="description" content={APP_DESCRIPTION} />

          <meta name="format-detection" content="telephone=no" />
          <meta name="mobile-web-app-capable" content="yes" />
          <meta name="theme-color" content={APP_THEME_COLOR} />

          {/* Apple */}
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta
            name="apple-mobile-web-app-status-bar-style"
            content="default"
          />
          <meta name="apple-mobile-web-app-title" content={APP_NAME} />
          <link
            rel="apple-touch-icon"
            sizes="180x180"
            href="/icons/apple-touch-icon.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="32x32"
            href="/icons/favicon-32x32.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="16x16"
            href="/icons/favicon-16x16.png"
          />
          <link rel="manifest" href="/manifest.json" />
          <link
            rel="mask-icon"
            href="/icons/safari-pinned-tab.svg"
            color={APP_THEME_COLOR}
          />
          <link rel="shortcut icon" href="/favicon.ico" />

          {/* Microsoft Tiles */}
          <meta name="msapplication-TileColor" content={APP_THEME_COLOR} />

          {/* Twitter */}
          <meta name="twitter:card" content="summary" />
          <meta name="twitter:url" content={`${APP_URL}/app`} />
          <meta name="twitter:title" content={APP_NAME} />
          <meta name="twitter:description" content={APP_DESCRIPTION} />
          <meta
            name="twitter:image"
            content={`${APP_URL}/icons/icon-192x192.png`}
          />
          <meta name="twitter:creator" content="" />

          {/* Open Graph */}
          <meta property="og:type" content="website" />
          <meta property="og:title" content={APP_NAME} />
          <meta property="og:description" content={APP_DESCRIPTION} />
          <meta property="og:site_name" content={APP_NAME} />
          <meta property="og:url" content={`${APP_URL}/app`} />
          <meta
            property="og:image"
            content={`${APP_URL}/icons/apple-touch-icon.png`}
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
