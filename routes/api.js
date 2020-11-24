const help = require('./help'),
  config = require('../config/config'),
  express = require('express'),
  router = express.Router(),
  https = require('https');

/**
 * Implement this method
 */

router.get('/api/getmonsters', (req, res) => {
  return (async () => {
    /**
     * Add code to execute a call to the IoT server.
     * Keep in mind that if not providing specifications to the url the IoT will answer with all data that is present.
     * Check out following documentation: https://flexso.eu10.cp.iot.sap/flexso/iot/core/api/v1/doc/swagger#/Devices/getMeasuresByDeviceUsingGET
     *                                 &  https://blogs.sap.com/2017/12/13/tip-how-to-retrieve-measures-filtered-from-sap-cloud-platform-internet-of-things-for-the-cloud-foundry-environment-postgres-database/
     */
  })()
    .catch(error => res.send(error));
})

/**
 * Do not change code after this line if you do not know what you are doing =)
 */

const getAPI = (url) => new Promise((resolve, reject) => {
  return https
    .get(url, (response) => {
      if (response.statusCode === 301) {
        resolve(getAPI(config.baseUrl + response.headers.location));
      } else {
        let body = '';
        response.on('data', (chunk) => {
          body += chunk;
        })
        response.on('end', () => {
          resolve(body)
        })
      }
    })
    .on('error', (e) => reject(e));
});

router.get('/', (req, res, next) => {
  res.redirect('/api');
});

router.post('/api/initiatemonsters', (req, res) => {
  if (help._validateInit(req.body)) {
    help._createMonsters(req.body);
    res.json({ status: 'ok' });
  } else {
    res.status(400).send('Missing parameters');
  }
});

router.post('/api/movemonsters', (req, res) => {
  return (async () => {
    help._moveMonsters(req.body);
    res.json({ status: 'ok' });
  })()
    .catch(error => res.send(error));
});

module.exports = router;