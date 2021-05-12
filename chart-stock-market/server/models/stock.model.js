import config from '../config/config';
import redisClient from '../config/redis';
import httpStatus from 'http-status';
import APIError from '../errors/APIError';

const encode = JSON.stringify;
const decode = JSON.parse;

/**
 * checks if data for stock company exists in redis
 * @param symbol — The stock company symbol
 * @returns {Promise<boolean>}
 */
function has(symbol) {
  return (async function() {
    const stocks = await redisClient.getAsync('stocks')
      .then(stocks => stocks !== null ? decode(stocks) : []);

    return stocks.indexOf(symbol) !== -1;
  })();
}

/**
 * adds data for stock company to redis
 * @param symbol — The stock company symbol
 * @param data — The data for the company
 * @returns {Promise<data|error>}
 */
function add(symbol, data) {
  return (async function() {
    try {
      const allSymbols = await addInList(symbol);
      const savedStock = await redisClient.setAsync(symbol, encode(data));
      const allStockData = await getAll();

      return allStockData;
    } catch(e) {
      return handleError(`An error occured while adding '${symbol}' stock!`);
    }
  })();
}

/**
 * removes data for stock company from redis
 * @param symbol — The stock comoany symbol
 * @returns {Promise<data|error>}
 */
function remove(symbol) {
  return (async function() {
    try {
      const allSymbols = await removeFromList(symbol);
      const deletedStock = await redisClient.delAsync(symbol);
      const allStockData = await getAll();

      return allStockData;
    } catch(e) {
      return handleError(`An error occured while removing '${symbol}' stock!`);
    }
  })();
}

/**
 * returns all data for all stock companies from redis
 * @returns {Promise<data|error>}
 */
function getAll() {
  return (async function() {
    try {
      const symbols = await redisClient.getAsync('stocks')
        .then(ss => ss !== null ? decode(ss) : []);

      return Promise.all(symbols.map(symbol => redisClient.getAsync(symbol)))
        .then(ss => ss.map(s => decode(s)));
    } catch(e) {
      return handleError(`An error occured while getting the stocks!`);
    }
  })();
}

/**
 * returns data for a stock company from redis
 * @returns {Promise<data|error>}
 */
function get(symbol) {
  return (async function() {
    try {
      const stockData = await redisClient.getAsync(symbol);

      if(stockData === null)
        return handleError(`No stock data for ${symbol}!`, httpStatus.NOT_FOUND);

      return decode(stockData);
    } catch(e) {
      return handleError(`An error occured while getting the stock data!`);
    }
  })();
}

/**
 * private helper fn. —
 * adds company symbol in the 'stocks' list in redis
 * @param symbol — The stock company symbol
 * @returns {Promise<data|error>}
 */
function addInList(symbol) {
  return (async function() {
    try {
      const stocks = await redisClient.getAsync('stocks')
        .then(stocks => stocks !== null ? decode(stocks) : [])
        .then(stocks => [symbol, ...stocks].filter((s, ix, arr) => arr.indexOf(s) === ix));

      const savedStocks = await redisClient.setAsync('stocks', encode(stocks));
      return stocks;
    } catch(e) {
      return handleError(`An error occured while saving '${stock}' in the list!`);
    }
  })();
}

/**
 * private helper fn. —
 * removes company symbol from the 'stocks' list in redis
 * @param symbol — The stock company symbol
 * @returns {Promise<data|error>}
 */
function removeFromList(symbol) {
  return (async function() {
    try {
      const stocks = await redisClient.getAsync('stocks')
        .then(ss => ss !== null ? decode(ss) : [])
        .then(ss => ss.filter(s => s !== symbol));

      const savedStocks = await redisClient.setAsync('stocks', encode(stocks));
      return stocks;
    } catch(e) {
      return Promise.reject(`An error occured while removing '${stock}' from the list!`);
    }
  })();
}

/**
 * private helper fn. — handles errors
 * @param error — The error message
 * @param code — 4xx Status code
 * @returns {Promise<error>}
 */
function handleError(error, code = httpStatus.FORBIDDEN) {
  return Promise.reject(new APIError(error, code, true));
}

export default { add, remove, getAll, has, get };
