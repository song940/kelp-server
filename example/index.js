const { createServer } = require('..');

class Home {
  name = "home"
  index() {
    return "hello world";
  }
}

const server = createServer({
  routes: [
    `get / => home#index`
  ],
  middlewares: [],
  controllers: [Home],
  defaultErrorHandler: true,
});

server.listen(3000);
