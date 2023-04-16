import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta charSet="utf-8" />
        <meta
          name="description"
          content="A simple project starter to work with TypeScript, React, NextJS and Styled Components"
        />
        <meta
          name="keywords"
          content="Education, Techology, Python, Web Development, SQL, Next.js, Typescript, Courses, Edtech, Non-profit, 501(c)3"
        />
        <meta name="author" content="Tech Optimum" />
        <meta name="robot" content="index, follow" />
        <meta name="og:title" content="Tech Optimum | Dashboard" />
        <meta
          name="og:description"
          content="A platform built by students for students for you to learn, build, and accomplish your goals. Allow yourself to succeed in the world of technology."
        />
        <meta name="og:image" content="/TOFavicon(DBlue).ico" />
        <meta name="og:url" content="https://techoptimum.com/dashboard" />
        <meta name="og:type" content="Tech Optimum" />
        <link rel="icon" href="/TOFavicon(DBlue).ico" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
