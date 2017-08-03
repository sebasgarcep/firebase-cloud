import supertest from 'supertest';
import joi from 'joi';

import FirebaseCloudFactory from '../../';

let app;

describe('Authentication functional testing suite', () => {
  beforeEach(() => {
    app = FirebaseCloudFactory();
  });

  it('should work with no validation defined', (done) => {
    app.post('/foo', {
      handler: (req, res) => {
        res.status(200).send('OK');
      },
    });

    const express = app.getExpress();

    supertest(express)
      .post('/foo')
      .then((res) => {
        expect(res.status).toBe(200);
        done();
      })
      .catch(done.fail);
  });

  it('should throw an error on startup when options.validate has incorrect keys', () => {
    expect(() => {
      app.post('/foo', {
        validate: {
          bar: joi.any().optional(),
        },
        handler: (req, res) => {
          res.status(200).send('OK');
        },
      });
    }).toThrow();
  });

  it('should return an error when the payload is invalid', (done) => {
    app.post('/foo', {
      validate: {
        body: {
          bar: joi.string().required(),
        },
      },
      handler: (req, res) => {
        res.status(200).send('OK');
      },
    });

    const express = app.getExpress();

    supertest(express)
      .post('/foo')
      .send({ bar: 1 })
      .then((res) => {
        expect(res.status).toBe(400);
        done();
      })
      .catch(done.fail);
  });

  it('should let a request through when the payload is valid', (done) => {
    app.post('/foo', {
      validate: {
        body: {
          bar: joi.string().required(),
        },
      },
      handler: (req, res) => {
        res.status(200).send('OK');
      },
    });

    const express = app.getExpress();

    supertest(express)
      .post('/foo')
      .send({ bar: 'baz' })
      .then((res) => {
        expect(res.status).toBe(200);
        done();
      })
      .catch(done.fail);
  });
});
