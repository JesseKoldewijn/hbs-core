import helmet from "@fastify/helmet";
import fastifyStatic from "@fastify/static";
import fastifyView from "@fastify/view";
import f from "fastify";
import { Glob } from "glob";
import hbs from "handlebars";
import path from "path";
import { partials } from "~/config/hbs/partials";

import "~/server/lib/hbs/customHelpers";

const __dirname = String(new URL(".", import.meta.url).pathname);
const pubDir = path.join(__dirname, "public");

const isDev = process.env.NODE_ENV === "development";

const fastify = f({
  logger: {
    enabled: isDev,
    level: "warn",
  },
});

fastify.register(helmet, { global: true, contentSecurityPolicy: false });
fastify.register(fastifyStatic, {
  root: pubDir,
  prefix: "/", // optional: default '/'
});
fastify.register(fastifyView, {
  engine: {
    handlebars: hbs,
  },
  root: "src",
  includeViewExtension: true,
  defaultContext: {
    dev: isDev, // Inside your templates, `dev` will be `true` if the expression evaluates to true
  },
  options: {
    partials,
  },
});

const routesDirGlob = new Glob("src/routes/**/*.hbs", {});
const apiRoutesDirGlob = new Glob("src/api/**/*.ts", {});

const allRoutesMerged = [...routesDirGlob, ...apiRoutesDirGlob];

for await (const path of allRoutesMerged) {
  const route = path
    .replace(".hbs", "")
    .replace(".ts", "")
    .replace("src/", "")
    .replace("routes/", "");

  const pathName = (path: string) => {
    const p = path.replace("src/routes/", "");
    const isRoot = p.includes("index");

    if (isRoot) {
      const ext = p.split(".")[1];
      const relative = `${p.replace("index", "").split("/.")[0].replace("/.", "")}${ext ? `.${ext}` : ""}`;

      if (relative === "") return "/";
      if (relative.startsWith("/")) return relative;
      if (relative.endsWith("/")) {
        return `/${relative.slice(0, -1)}`;
      }
      return `/${relative}`;
    }

    return p;
  };

  const getCtx = async () => {
    try {
      const ctxs = import.meta.glob("./src/routes/**/*-ctx.ts", {
        eager: true,
      }) as {
        [key: string]: {
          default: any;
          context: any;
        };
      };

      const ctxModule = ctxs[`./src/routes/${route}-ctx.ts`];
      return ctxModule?.context || ctxModule?.default || {};
    } catch (error) {
      return {};
    }
  };

  const ctxModule = await getCtx();

  const ctx = ctxModule || {};

  if (!route.startsWith("api")) {
    fastify.get(pathName(route), (req, reply) => {
      reply.view(`/routes/${route}`, ctx, {
        layout: "/layouts/main",
      });
    });
  } else {
    const getApiRoutes = async () => {
      try {
        // all api routes are located in the src/api directory and not inside the routes directory
        const apiRoutes = import.meta.glob("./src/api/**/*.ts", {
          eager: true,
        }) as {
          [key: string]: {
            default?: any;
            handler?: any;
            GET?: any;
            POST?: any;
            PUT?: any;
            DELETE?: any;
          };
        };

        const routePath = route.replace("api/", "");

        const apiRoute = apiRoutes[`./src/api/${routePath}.ts`];

        const moduleStructuredObj = {
          default: apiRoute?.default,
          handler: apiRoute?.handler,
          GET: apiRoute?.GET,
          POST: apiRoute?.POST,
          PUT: apiRoute?.PUT,
          DELETE: apiRoute?.DELETE,
        };

        return apiRoute ? moduleStructuredObj : {};
      } catch (error) {
        return {};
      }
    };

    const apiRoute = (await getApiRoutes()) as {
      default?: any;
      handler?: any;
      GET?: any;
      POST?: any;
      PUT?: any;
      DELETE?: any;
    };

    const defaultHandler = apiRoute.default || apiRoute.handler || apiRoute.GET;

    const routePathName = pathName(route);

    if (!!defaultHandler) {
      const includesExt = routePathName.includes(".");
      if (includesExt) {
        const ext = routePathName.split(".")[1];
        const relative = `${routePathName.replace(`.${ext}`, "")}`;

        fastify.get(relative, async (req, reply) => {
          defaultHandler(req, reply);
        });
      }
      fastify.get(routePathName, async (req, reply) => {
        defaultHandler(req, reply);
      });
    } else {
      const includesExt = routePathName.includes(".");

      const methods = Object.keys(apiRoute) as Array<
        "GET" | "POST" | "PUT" | "DELETE"
      >;

      const setMethod = (
        route: string,
        methods: Array<"GET" | "POST" | "PUT" | "DELETE">,
      ) => {
        for (const method of methods) {
          const handler = apiRoute[method];

          switch (method) {
            case "GET":
              fastify.get(route, async (req, reply) => {
                handler(req, reply);
              });
              break;
            case "POST":
              fastify.post(route, async (req, reply) => {
                handler(req, reply);
              });
              break;
            case "PUT":
              fastify.put(route, async (req, reply) => {
                handler(req, reply);
              });
              break;
            case "DELETE":
              fastify.delete(route, async (req, reply) => {
                handler(req, reply);
              });
              break;
          }
        }
      };

      if (includesExt) {
        const ext = routePathName.split(".")[1];
        const relative = `${routePathName.replace(`.${ext}`, "")}`;

        setMethod(relative, methods);
      }
      setMethod(routePathName, methods);
    }
  }
}

export const viteNodeApp = fastify;
