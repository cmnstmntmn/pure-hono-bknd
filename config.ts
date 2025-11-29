import type { CloudflareBkndConfig } from "bknd/adapter/cloudflare";
import { em, entity, text, boolean } from "bknd";

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
   app: (env) => {
      console.log('env');

      return {
         // in production mode, we use the appconfig.json file as static config
         config: {
            data: em({
               todos: entity("todos", {
                  title: text(),
                  description: text(),
                  completed: boolean(),
               }),
            }).toJSON(),
            // media: {
            //    enabled: true,
            //    adapter: {
            //       type: "s3",
            //       config: {
            //          access_key: env.S3_ACCESS_KEY,
            //          secret_access_key: env.S3_SECRET_ACCESS_KEY,
            //          url: env.S3_URL,
            //       },
            //    },
            // },
         },
         options: {
            mode: "code",
         },
      };
   },
   // remove "<any>" once you added the env variables
   // wrangler types should properly type it
} satisfies CloudflareBkndConfig<any>;
