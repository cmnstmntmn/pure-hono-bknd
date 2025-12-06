import { jsxRenderer, useRequestContext } from "hono/jsx-renderer";
import { Link, ViteClient } from "vite-ssr-components/hono";

export const renderer = jsxRenderer(
  ({ children }) => {
    const c = useRequestContext();

    return (
      <html lang={c.var.language}>
        <head>
          <meta charset="utf-8" />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0"
          />
          <ViteClient />
          <Link
            href="/src/style.css"
            rel="stylesheet"
            async
            nonce={c.get("secureHeadersNonce")}
          />
        </head>
        <body>
          <h1 class="text-3xl font-bold underline text-blue-300">
            Hello world!!
          </h1>
          {children}
        </body>
      </html>
    );
  },
  { docType: true },
);
