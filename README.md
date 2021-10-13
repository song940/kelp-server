## kelp-server

> Super tiny web-server framework in Node.js

```js
const { createServer } = require('kelp-server');

class Home {
  index() {
    return "hello world";
  }
}

const server = createServer({
  routes: [
    `get / => Home#index`
  ],
  middlewares: [],
  controllers: [Home],
  defaultErrorHandler: true,
});

server.listen(3000);
```