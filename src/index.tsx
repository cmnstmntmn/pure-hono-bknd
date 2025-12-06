import type { App } from "bknd";
import { getFresh } from "bknd/adapter/cloudflare";
import type { Api } from "bknd/client";
import { Hono } from "hono";
import { trimTrailingSlash } from "hono/trailing-slash";
import { showRoutes } from "hono/dev";
import { languageDetector } from "hono/language";
import config from "../config";

import { renderer } from "./renderer";

const app = new Hono<{
  Bindings: Cloudflare.Env;
  Variables: {
    app: App;
    api: Api;
  };
}>()
  .use(trimTrailingSlash())
  .use(
    languageDetector({
      supportedLanguages: ["en", "es", "de", "it", "nl", "zh"],
      fallbackLanguage: "en",
    }),
  )
  .use(async (c, next) => {
    const app = await getFresh(config, {
      request: c.req.raw,
      env: c.env,
      ctx: c.executionCtx,
    });

    const api = app.getApi({ headers: c.req.raw.headers });
    await api.verifyAuth();

    const me = await api.auth.me();

    console.log("me =>", me);

    c.set("app", app);
    c.set("api", api);
    c.set("language", c.get("language"));

    await next();
  });

app.use(renderer);

app.get("/", (c) => {
  return c.render(<h1>Hello!!!</h1>);
});

app.all("/api/*", (c) => {
  return c.var.app.fetch(c.req.raw);
});

app.get("/admin/*", (c) => {
  return c.var.app.fetch(c.req.raw);
});

showRoutes(app, { verbose: false });

export default app;
