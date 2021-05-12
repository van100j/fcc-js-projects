import request from 'supertest';
import httpStatus from 'http-status';
import chai, { expect } from 'chai';
import app from '../index';
import config from '../config/config';
import Stock from '../models/stock.model';

chai.config.includeStack = true;

describe('## Stock APIs', () => {

  let stock = {
    symbol: 'AAPL'
  };

  let stockData;

  describe('# POST /api/stocks', () => {
    it('should fail because of invalid data', (done) => {
      request(app)
        .post('/api/stocks')
        .send({})
        .expect(httpStatus.BAD_REQUEST)
        .then((res) => {
          expect(res.body.error).to.have.property('message');
          done();
        })
        .catch(done);
    });

    it('should create stock data', (done) => {
      request(app)
        .post('/api/stocks')
        .send(stock)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body).to.have.property('data');
          expect(res.body.data.dataset_code).to.equal(stock.symbol);
          done();
        })
        .catch(done);
    });
  });

  describe('# GET /api/stocks', () => {
    it('should get all stock data', (done) => {
      request(app)
        .get('/api/stocks')
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body).to.have.property('data');
          expect(res.body.data).to.be.instanceof(Array);
          expect(res.body.data[0].dataset_code).to.equal(stock.symbol);
          done();
        })
        .catch(done);
    });
  });

  describe('# GET /api/stocks/:symbol', () => {
    it('should fail because of invalid symbol', (done) => {
      request(app)
        .get(`/api/stocks/AA.PL`)
        .expect(httpStatus.BAD_REQUEST)
        .then((res) => {
          expect(res.body.error).to.have.property('message');
          done();
        })
        .catch(done);
    });

    it('should fail because of non existing symbol', (done) => {
      request(app)
        .get(`/api/stocks/GOOGL`)
        .expect(httpStatus.NOT_FOUND)
        .then((res) => {
          expect(res.body.error).to.have.property('message');
          done();
        })
        .catch(done);
    });

    it('should fetch stock symbol data', (done) => {
      request(app)
        .get(`/api/stocks/${stock.symbol}`)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body).to.have.property('data');
          expect(res.body.data.dataset_code).to.equal(stock.symbol);
          done();
        })
        .catch(done);
    });
  });

  describe('# DELETE /api/stocks/:symbol', () => {
    it('should fail because of invalid symbol', (done) => {
      request(app)
        .delete(`/api/stocks/AA.PL`)
        .expect(httpStatus.BAD_REQUEST)
        .then((res) => {
          expect(res.body.error).to.have.property('message');
          done();
        })
        .catch(done);
    });

    it('should fail because of non existing symbol', (done) => {
      request(app)
        .delete(`/api/stocks/GOOGL`)
        .expect(httpStatus.NOT_FOUND)
        .then((res) => {
          expect(res.body.error).to.have.property('message');
          done();
        })
        .catch(done);
    });

    it('should delete stock symbol data', (done) => {
      request(app)
        .delete(`/api/stocks/${stock.symbol}`)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body).to.have.property('data');
          done();
        })
        .catch(done);
    });
  });

  after(function(done) {
    (async function() {
      try {
        const d = await Stock.remove(stock.symbol);
      } catch(e) {}

      done();
    })();
  });

});
