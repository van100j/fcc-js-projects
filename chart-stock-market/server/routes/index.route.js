import express from 'express';
import stockRoutes from './stock.route';

const router = express.Router(); // eslint-disable-line new-cap

router.get('/health-check', (req, res) => res.send('OK'));

router.use('/stocks', stockRoutes);

export default router;
