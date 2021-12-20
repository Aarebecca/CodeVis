import lodash from "lodash";

export const config = {
  base: {},
  dev: {
    host: "127.0.0.1:3001",
  },
  prod: {
    host: "localhost:3001",
  },
  get: (api: string) => {
    const host =
      process.env.NODE_ENV === "development"
        ? config.dev.host
        : config.prod.host;
    return `http://${host}/${lodash.get(config, ["apis", api], "")}`;
  },
  apis: {
    varFlow: "var-flow",
  },
};
