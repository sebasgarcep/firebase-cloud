# API

`firebase-cloud` exports a Server function be default:

### Get Started

```
const Server = require('firebase-cloud');

const server = Server();
```

### Server()

returns an instance of `firebase-cloud` Server;

---

### server.auth

### server.get(path, config)

### server.post(path, config)

### server.put(path, config)

### server.delete(path, config)

### server.getExpress()

returns the wrapped `express` server, ready to be passed to firebase cloud functions.
