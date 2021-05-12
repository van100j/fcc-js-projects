import express from 'express';
import validate from 'express-validation';
import paramValidation from '../config/param-validation';
import stockCtrl from '../controllers/stock.controller';
import config from '../config/config';

const router = express.Router(); // eslint-disable-line new-cap

router.route('/')
  .get(stockCtrl.list)
  .post(validate(paramValidation.addStock), stockCtrl.add);

router.route('/:symbol')
  .get(validate(paramValidation.getStock), stockCtrl.get)
  .delete(validate(paramValidation.getStock), stockCtrl.remove);

export default router;
