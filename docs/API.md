# API

`firebase-cloud` exports a Server function be default:

### Get Started

```javascript
const ServerFactory = require('firebase-cloud');

const server = ServerFactory();
```

### Server()

returns an instance of `firebase-cloud` Server;

---

### Route config

`path` is any valid path `express` takes. To define parametric paths, put `:` before the path parameter (e.g. `/users/:userId`).

`config` is an object with the following properties:
- auth: If it is not defined it will use the default authentication strategy. If no default authenticationConfig strategy is set, then no authentication will be performed. When defined it may be either of:
  - `false`: Do no authentication for this route
  - string: Use this authentication scheme to authenticate the user. Authentication must not fail.
  - Array of string: Try authentication schemes until one succeeds or return an error to the client.
  - object: The object can have the following options:
    - mode
    - schemes
    - scopes
- handler: Function that takes a request and response objects as inputs and is responsible for responding to the client using the response object.
- pre: Array of functions that take a request object, a response object and a next callback. Used to make certain validations before the execution of the main handler. The next callback should be called with no parameters to continue with the request pipeline, or with an error parameter when the request pipeline fails but should continue to the error handler. It is also valid to send a response back to the client and never use next in these middlewares, but this is only recommended when a terminating error is detected.
- validate: Object with the following properties:
  - body: Object where every key corresponds to a validation rule for `joi` to check against the given field in the payload.
  - query: Object where every key corresponds to a validation rule for `joi` to check against the given querystring in the URL.
  - params: Object where every key corresponds to a validation rule for `joi` to check against the given path parameter in the URL.

The following route config methods are available:
- server.get(path, config)
- server.post(path, config)
- server.put(path, config)
- server.delete(path, config)

---

### server.auth.default(strategy)

### server.auth.scheme(name, scheme)

### server.ext(event, middleware)
Adds a middleware to some point in the request pipeline indicated by the `event` parameter which may take any of the following values:
- onPreAuth
- onPostAuth
- onPreHandler

### server.decorate(key, value)
Sets `server[key]` to `value`. Useful when wanting to add a custom function to the server instance.

### server.getExpress()
Returns the wrapped `express` server, ready to be passed to firebase cloud functions.
