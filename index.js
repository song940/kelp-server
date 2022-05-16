const http = require('http');
const kelp = require('kelp');
const body = require('kelp-body');
const send = require('kelp-send');
const error = require('kelp-error');
const logger = require('kelp-logger');
const Router = require('kelp-router');
const routing = require('routing2');
const { debuglog } = require('util');

const debug = debuglog('kelp-server');

const createServer = ({
  app = kelp(),
  port = 3000,
  routes = [],
  plugins = [],
  middlewares = [],
  controllers = [],
  defaultHandler = true,
  defaultErrorHandler = true,
}) => {
  // router
  const router = new Router();
  const rules = routes.map(routing.create);
  const ctrls = controllers.reduce((obj, Ctrl) => {
    obj[Ctrl.name] = new Ctrl(app);
    debug('initialized controller:', Ctrl.name);
    return obj;
  }, {});
  for (const rule of rules) {
    const { method, path, controller: c, action: a } = rule;
    const ctrl = ctrls[c];
    if (!ctrl) throw new Error(`[kelp-server] Can not find controller: "${c}"`);
    const action = ctrl[a];
    if (!action) throw new Error(`[kelp-server] Can not find action: "${a}"`);
    debug('mapping controller to rule:', c, a);
    router.route(method, path, action);
  }
  // middleware
  app.use(send);
  app.use(body);
  app.use(logger);
  app.use(
    middlewares,
    plugins
      .map(plugin => plugin(app))
      .filter(p => typeof p === 'function')
  );
  if (defaultErrorHandler) {
    app.use(error);
  }
  app.use(router);
  if (defaultHandler) {
    app.use((_, res) => res.send(404));
  }
  const server = http.createServer(app);
  server.start = (p = port) => server.listen(p);
  return server;
};

module.exports = {
  createServer,
};