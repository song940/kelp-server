## kelp-server

> kelp server

```js
const { createServer } = require('kelp-server');

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
```