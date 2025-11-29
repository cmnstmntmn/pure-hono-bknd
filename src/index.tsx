import type { App } from "bknd";
import { getFresh } from "bknd/adapter/cloudflare";
import type { Api } from "bknd/client";
import { Hono } from "hono";
import { showRoutes } from "hono/dev";
import { languageDetector } from "hono/language";
import config from "../config";

import Contact from "./app/contact";
import { renderer } from "./renderer";

const app = new Hono<{
  Bindings: Cloudflare.Env;
  Variables: {
    app: App;
    api: Api;
  };
}>()
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

    const api = app.getApi(c.req.raw);
    await api.verifyAuth();

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

app.get("/contact", (c) => {
  return c.render(<Contact />);
});

showRoutes(app, { verbose: false });

export default app;
