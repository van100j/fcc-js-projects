const express = require('express');
const processRequest = require('./intents');
const uuidv4 = require('uuid/v4');

const router = express.Router();

router.route('/session')
  .get((req, res, next) => res.json({type: 'sessionId', msg: uuidv4()}))

router.route('/process')
  .post(async function(req, res, next) {
    try {
      const answer = await processRequest(req.body);

      return res.json({ type: 'bot', msg: answer })
    } catch(err) {
      return res.json({
        err
      })
    }
  });

router.route('*')
  .get((req, res, next) => res.json({msg: 'Hello!'}));

module.exports = router;
