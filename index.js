const http = require('http');
const kelp = require('kelp');
const body = require('kelp-body');
const send = require('kelp-send');
const error = require('kelp-error');
const logger = require('kelp-logger');
const routing = require('routing2');

const createServer = ({
  routes = [],
  middlewares = [],
  controllers = [],
  defaultHandler = true,
  defaultErrorHandler = true,
}) => {
  const app = kelp();
  app.use(send);
  app.use(body);
  app.use(logger);
  app.use(middlewares);
  if (defaultErrorHandler) {
    app.use(error);
  }
  const ctrls = {};
  for (const Controller of controllers) {
    const ctrl = new Controller();
    ctrls[ctrl.name] = ctrl;
  }
  const rules = routes.map(routing.create);
  app.use((req, res, next) => {
    const { status, route } = routing.find(rules, req);
    if (!route) return next();
    const { controller: c, action: a, params } = route;
    if (ctrls[c] && a in ctrls[c]) {
      req.params = params;
      const response = ctrls[c][a](req);
      res.status(status).send(response);
      return;
    }
    return next();
  });
  if (defaultHandler) {
    app.use((_, res) => res.send(404));
  }
  return http.createServer(app);
};

module.exports = {
  createServer,
};