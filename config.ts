import { boolean, em, entity, text } from "bknd";
import type { CloudflareBkndConfig } from "bknd/adapter/cloudflare";
import { cloudflareImageOptimization } from "bknd/plugins";
import { secureRandomString } from "bknd/utils";

const schema = em({
  todos: entity("todos", {
    title: text(),
    done: boolean(),
  }),
});

export default {
  d1: {
    session: true,
  },
  adminOptions: {
    adminBasepath: "/admin",
  },
  buildConfig: {
    // this instructs the build command to always perform a db sync.
    // if you have CI/CD in place, you'd want to perform the sync on the CI/CD server instead using `npx bknd sync`
    sync: true,
  },
  app: (_env) => {
    return {
      // in production mode, we use the appconfig.json file as static config
      config: {
        data: schema.toJSON(),
        server: {
          mcp: {
            enabled: true,
          },
        },
        auth: {
          enabled: true,
          jwt: {
            issuer: "domzz",
            secret: secureRandomString(64),
          },
          guard: { enabled: true },
          roles: {
            EDITOR: {
              is_default: true,
              implicit_allow: false,
              permissions: [
                "system.access.api",
                "media.file.read",
                "data.entity.read",
              ],
            },
            ADMIN: {
              implicit_allow: true,
            },
          },
        },
        media: {
          enabled: true,
          adapter: {
            type: "r2",
            config: {
              binding: "BUCKET",
            },
          },
        },
      },
      options: {
        mode: "code",
        plugins: [
          cloudflareImageOptimization({
            accessUrl: "/api/_plugin/image/optimize",
            explain: true,
          }),
        ],
      },
      onBuilt: async (_app) => {
        console.log("On build");
      },
    };
  },
  // remove "<any>" once you added the env variables
  // wrangler types should properly type it
} satisfies CloudflareBkndConfig;
