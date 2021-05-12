import httpStatus from 'http-status';
import APIError from '../errors/APIError';
import config from '../config/config';
import wss from '../config/websocket';
import Stock from '../models/stock.model';
import fetch from 'node-fetch';

/**
 * Returns stock data
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
function list(req, res, next) {
  (async function() {
    try {
      const stocks = await Stock.getAll();
      return res.json({ data: stocks });
    } catch(error) {
      return next(error);
    }
  })();
}

/**
 * Adds new stock
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
function add(req, res, next) {
  const symbol = req.body.symbol.toUpperCase();
  const dt = new Date();
  const [ year, month, day ] = [ +dt.getFullYear(), 1 + +dt.getMonth(), +dt.getDate() ];

  (async function() {
    const start_date = `${year - 1}-${month}-${day}`;
    const end_date = `${year}-${month}-${day}`;
    const url = [
      `${config.quandlApiUrl}/${symbol}.json?api_key=${config.quandlApiKey}`,
      `start_date=${start_date}`,
      `end_date=${end_date}`,
    ].join("&");

    try {
      const isAlreadyAdded = await Stock.has(symbol)
        .then(isIt => isIt ? Promise.reject(new APIError(`'${symbol}' stock has already been added!`, httpStatus.FORBIDDEN, true)) : 1);

      const response = await fetch(url)
        .then(res => res.ok ? res.json() : Promise.reject(`Invalid stock symbol: '${symbol}'!`))
        .catch(err => Promise.reject(new APIError(err, httpStatus.BAD_REQUEST, true)));

      const { dataset } = await response;
      const returnStocks = await Stock.add(symbol, dataset);

      wss.broadcast({ action: 'add', symbol: symbol });
      return res.json({ data: dataset });
    } catch(error) {
      return next(error);
    }
  })();
}

/**
 * Removes a stock
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
function remove(req, res, next) {
  const symbol = req.params.symbol.toUpperCase();

  (async function() {
    (async function() {
      try {
        const isAlreadyAdded = await Stock.has(symbol)
          .then(isIt => !isIt ? Promise.reject(new APIError(`'${symbol}' stock has not been found!`, httpStatus.NOT_FOUND, true)) : 1);

        const returnStocks = await Stock.remove(symbol);
        wss.broadcast({ action: 'remove', symbol: symbol });

        return res.json({data: {}});
      } catch(error) {
        return next(error);
      }
    })();

  })();
}

/**
 * Get a stock
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
function get(req, res, next) {
  const symbol = req.params.symbol.toUpperCase();

  (async function() {
    try {
      const stockData = await Stock.get(symbol);

      return res.json({data: stockData});
    } catch(error) {
      return next(error);
    }
  })();
}

export default { list, add, remove, get };
