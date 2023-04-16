// pages/_app.js
import "@/styles/globals.css";
import { ChakraProvider } from "@chakra-ui/react";
import theme from "../styles/theme";
import "react-markdown-editor-lite/lib/index.css";
import Fonts from "../components/font";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import Loading from "../components/loading";

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    router.events.on("routeChangeStart", (url) => {
      setLoading(true);
    });

    router.events.on("routeChangeComplete", (url) => {
      setLoading(false);
    });
  }, [router.events]);
  return (
    <ChakraProvider theme={theme}>
      <Fonts />

      {loading ? (
        <Loading />
      ) : (
        <>
          <Component {...pageProps} />
        </>
      )}
    </ChakraProvider>
  );
}

export default MyApp;
