const express = require('express'),
  router = express.Router(),
  apiRouter = require('./api');

router.get('/', (req, res, next) => {
  res.redirect('/api');
});

router.use('/api', apiRouter);

module.exports = router;