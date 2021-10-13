const { createServer } = require('..');

class Home {
  index() {
    return "hello world";
  }
}

const plugin = () => {
  console.log('plugin');
  return async (req, res, next) => {
    console.log('middleware before', req.url);
    await next();
    console.log('middleware after', req.url);
  }
};

const server = createServer({
  port: 4000,
  routes: [
    `get / => Home#index`,
  ],
  plugins: [
    plugin,
  ],
  middlewares: [],
  controllers: [Home],
  defaultErrorHandler: true,
});

server.start();
