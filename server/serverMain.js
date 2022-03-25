////////////////////////////////////////////////////////////////////
////////////////    START VUE CLIENT      //////////////////////////

const express = require('express');
const path = require('path');

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const PORT = process.env.PORT || 8080;
let indexPath = "dist/";
let clientFile = "index.html";

const app = express();

// ONLY USE THIS WHEN IN PRODUCTION (locally we will use yarn serve directly in the client folder)
//if (process.env.NODE_ENV === 'production') {
  app.use(express.static(indexPath));
  let indexFile = path.resolve(indexPath+clientFile);
  console.log(indexFile);
  app.get('/', function (req, res) {
    res.sendFile(indexFile);
  });
  app.get('/play', function (req, res) {
    res.sendFile(indexFile);
  });

  const server = require('http').createServer(app);
  server.listen(PORT, function () {
    console.log('Socket Server started on port '+PORT);
  });

//}

////////////////////////////////////////////////////////////////////
////////////////  INITIALIZE NENGI SERVER  /////////////////////////

import GameInstance from './GameInstance'
import nengiConfig from '../common/nengiConfig'
const gameInstance = new GameInstance(/*args*/)

const hrtimeMs = function() {
  let time = process.hrtime()
  return time[0] * 1000 + time[1] / 1000000
}

let tick = 0
let previous = hrtimeMs()
const tickLengthMs = 1000 / nengiConfig.UPDATE_RATE

const loop = function() {
  const now = hrtimeMs()
  if (previous + tickLengthMs <= now) {
    const delta = (now - previous) / 1000
    previous = now
    tick++

    //const start = hrtimeMs() // uncomment to benchmark
    gameInstance.update(delta, tick, Date.now())
    //const stop = hrtimeMs()
    //console.log('game update took', stop-start, 'ms')
  }

  if (hrtimeMs() - previous < tickLengthMs - 4) {
    setTimeout(loop)
  } else {
    setImmediate(loop)
  }
}

loop()