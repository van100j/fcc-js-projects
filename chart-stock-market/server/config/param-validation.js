import Joi from 'joi';

const validators = {
  stockSymbol: Joi.string().required().regex(/^([a-zA-Z0-9]{1,10})$/).options({
    language: {
      string: {
        regex: {
          base: "is invalid — stock symbol of a company consists of letters and numbers only"
        }
      }
    }
  })
}

export default {

  /* Stocks */
  // POST /api/stocks
  addStock: {
    body: {
      symbol: validators.stockSymbol
    }
  },

  // POST /api/stocks/:symbol
  getStock: {
    params: {
      symbol: validators.stockSymbol
    }
  },
};
