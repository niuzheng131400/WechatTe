import { camelize } from "./format.mjs";
function withInstall(options) {
  options.install = (app) => {
    const { name } = options;
    app.component(name, options);
    app.component(camelize(`-${name}`), options);
  };
  return options;
}
export {
  withInstall
};
