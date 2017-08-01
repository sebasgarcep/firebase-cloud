import supertest from 'supertest';

import FirebaseCloudFactory from '../../';

let app;

describe('Authentication functional testing suite', () => {
  beforeEach(() => {
    app = FirebaseCloudFactory();
  });

  it('should work with no authentication defined', (done) => {
    app.get('/ok', {
      handler: (req, res) => {
        res.status(200).send('OK');
      },
    });

    const express = app.getExpress();

    supertest(express)
      .get('/ok')
      .then((res) => {
        expect(res.status).toBe(200);
        done();
      })
      .catch(done.fail);
  });

  it('should not allow access to routes when a default auth is defined and auth fails on request', (done) => {
    app.auth.scheme('default', () => false);
    app.auth.default('default');

    app.get('/ok', {
      handler: (req, res) => {
        res.status(200).send('OK');
      },
    });

    const express = app.getExpress();

    supertest(express)
      .get('/ok')
      .then((res) => {
        expect(res.status).toBe(401);
        done();
      })
      .catch(done.fail);
  });


  it('should allow access to routes when a default auth is defined and auth succeeds on request', (done) => {
    app.auth.scheme('default', () => ({ uid: 1 }));
    app.auth.default('default');

    app.get('/ok', {
      handler: (req, res) => {
        res.status(200).send('OK');
      },
    });

    const express = app.getExpress();

    supertest(express)
      .get('/ok')
      .then((res) => {
        expect(res.status).toBe(200);
        done();
      })
      .catch(done.fail);
  });
});
