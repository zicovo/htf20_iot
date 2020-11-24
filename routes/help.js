const config = require('../config/config'),
  https = require('https'),
  mqtt = require('mqtt'),
  fs = require('fs');

exports.startMQTT = () => {
  client = mqtt.connect('mqtts://flexso.eu10.cp.iot.sap:8883', {
    keepalive: 10,
    clientId: config.device,
    clean: true,
    reconnectPeriod: 2000,
    connectTimeout: 2000,
    cert: fs.readFileSync(config.cert),
    key: fs.readFileSync(config.cert),
    passphrase: fs.readFileSync(config.secret).toString(),
    rejectUnauthorized: false
  });

  client.on('error', function (error) {
    console.error(error);
    client.end();
  });

  return client;
}


exports._validateInit = (json) => {
  return json.difficulty && json.gameId && json.fieldSize && json.player && json.player.LocX >= 0 && json.player.LocY >= 0;
}

exports._createPayload = (monsters) => {
  return {
    sensorAlternateId: config.sensorAltId,
    capabilityAlternateId: config.capAltId,
    measures: monsters
  };
}

exports.getAPI = (url) => new Promise((resolve, reject) => {
  return https
    .get(url, (response) => {
      if (response.statusCode === 301) {
        resolve(exports.getAPI(config.baseUrl + response.headers.location));
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

exports._createMonsters = (json) => {
  let monsters = [],
    defaultAmount = json.difficulty === 'E' ? 2 : json.difficulty === 'M' ? 3 : json.difficulty === 'D' ? 4 : 5;
  json.fieldSize >= 10 ? json.fieldSize >= 15 ? json.fieldSize === 20 ? defaultAmount *= 4 : defaultAmount *= 3 : defaultAmount *= 2 : defaultAmount *= 1;
  for (let i = 0; i < defaultAmount; i++) {
    monsters.push(exports._createMonster(json));
  }
  client = exports.startMQTT();
  client.publish(config.topic, JSON.stringify(exports._createPayload(monsters)), [], error => {
    if (!error) {
      console.log('Monsters created.');
    } else {
      console.log('An unexpected error occurred:', error);
    }
    client.end();
  });
}

exports._createMonster = (json) => {
  let monster = {
    LocX: exports._randomInt(json.fieldSize),
    LocY: exports._randomInt(json.fieldSize)
  };
  exports._checkSameCoords(json.player, monster, json.fieldSize);
  return { Step: 0, GameId: json.gameId, ...monster };
}


exports._randomInt = (max) => {
  return Math.floor(Math.random() * Math.floor(max));
}

exports._checkSameCoords = (fixedObject, checkObject, fieldSize) => {
  JSON.stringify(fixedObject) === JSON.stringify(checkObject) ?
    exports._randomInt(2) === 1 ?
      checkObject.LocX === fixedObject.LocX ?
        checkObject.LocX > 1 ? checkObject.LocX -= 1 : checkObject.LocX += 1 :
        checkObject.LocX < fieldSize ? checkObject.LocX += 1 : checkObject.LocX -= 1 :
      checkObject.LocY === fixedObject.LocY ?
        checkObject.LocY > 1 ? checkObject.LocY -= 1 : checkObject.LocY += 1 :
        checkObject.LocY < fieldSize ? checkObject.LocY += 1 : checkObject.LocY -= 1 :
    true;
  return checkObject;
}

exports._moveMonsters = async (json) => {
  let oneHourAgo = new Date().setHours(new Date().getHours() - 1);
  let measures = JSON.parse(await exports.getAPI(config.measuresUrl + '?filter=timestamp gt ' + oneHourAgo));
  let monsters = measures.filter(measure => measure.measure.GameId === json.gameId && measure.measure.Step === json.step).map(measure => exports._moveMonster(measure.measure, json.fieldSize));
  client = exports.startMQTT();
  client.publish(config.topic, JSON.stringify(exports._createPayload(monsters)), [], error => {
    if (!error) {
      console.log('Monsters updated.');
    } else {
      console.log('An unexpected error occurred:', error);
    }
    client.end();
  });
}

exports._moveMonster = (checkObject, fieldSize) => {
  checkObject.Step++;
  exports._randomInt(2) === 1 ?
    checkObject.LocX > 1 ? checkObject.LocX -= 1 : checkObject.LocX < fieldSize ?
      checkObject.LocX += 1 : checkObject.LocX -= 1 :
    checkObject.LocY > 1 ? checkObject.LocY -= 1 : checkObject.LocY < fieldSize ?
      checkObject.LocY += 1 : checkObject.LocY -= 1;
  return checkObject;
}