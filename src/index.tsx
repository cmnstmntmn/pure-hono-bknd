import { Hono } from "hono";
import { showRoutes } from "hono/dev";
import { renderer } from "./renderer";

import type { App } from "bknd";
import { Api } from "bknd/client";
import { getFresh } from "bknd/adapter/cloudflare";

const app = new Hono<{
  Bindings: Cloudflare.Env;
  Variables: {
    app: App;
    api: Api;
  };
}>().use(async (c, next) => {
  const app = await getFresh(
    {
      // your bknd config goes here
      d1: {
        session: true,
      },
      adminOptions: {
        adminBasepath: "/admin",
      },
    },
    { request: c.req.raw, env: c.env, ctx: c.executionCtx },
  );

  const api = app.getApi(c.req.raw);
  await api.verifyAuth();

  c.set("app", app);
  c.set("api", api);

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

showRoutes(app, { verbose: true });

export default app;
