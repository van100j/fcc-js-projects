# Chart the Stock Market

### Objective:

Build a full stack JavaScript app that is functionally similar to this: http://watchstocks.herokuapp.com/ and deploy it to Heroku.

### Here are the specific user stories you should implement for this project:

- I can view a graph displaying the recent trend lines for each added stock.

- I can add new stocks by their symbol name.

- I can remove stocks.

- I can see changes in real-time when any other user adds or removes a stock. For this you will need to use Web Sockets.

### Live Demo:

Live demo available at: https://vs-stock-market.herokuapp.com/

### Requirements & Usage

Redis is used for handling data storage, install it locally — visit https://redis.io/ for more info.

Quandl API is used to get stock data — you'll need an API key available for free, visit https://www.quandl.com/ for more info.

Copy `.env.example` to `.env` file and update it with your data (API key and Redis URL);

```
git clone https://github.com/van100j/chart-stock-market
cd chart-stock-market/
yarn install
yarn start

cd client/
yarn install
ng serve -o
```
