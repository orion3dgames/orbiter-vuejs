import nengi from 'nengi'
import nengiConfig from '../common/nengiConfig'

import firebaseInstance from './firebase'

import PlayerCharacter from '../common/entity/PlayerCharacter'
import Identity from '../common/message/Identity'
import Cube from "../common/entity/Cube";

////////////////////////////////////////////////////////////////////
////////////////  INITIALIZE FIREBASE  /////////////////////////


// Your web app's Firebase configuration
import firebaseDB from "./firebase";



/*
var findPlayer = (hash, username) => {
  let foundUserIndex = players.findIndex(player => player.name === username);
  if(!players[foundUserIndex]){
    return false;
  }
  return players[foundUserIndex]
}*/

////////////////////////////////////////////////////////////////////
////////////////  GAME INSTANCE ////////////////////////////////////

require('dotenv').config();
const express = require('express');

const path = require('path');
const PORT = process.env.PORT || 8080;
let indexPath = "dist/";
let clientFile = "index.html";

const app = express();

app.use(express.static(indexPath));
let indexFile = path.resolve(indexPath + clientFile);

app.get('/', function (req, res) {
  res.sendFile(indexFile);
});
app.get('/play', function (req, res) {
  res.sendFile(indexFile);
});

const server = require('http').createServer(app);

server.listen(PORT, function () {
  console.log('Server started on port '+PORT);
});

////////////////////////////////////////////////////////////////////
////////////////  GAME INSTANCE ////////////////////////////////////

class GameInstance {
  constructor() {
    this.entities = new Map()

    //this.instance = new nengi.Instance(nengiConfig, { port: nengiConfig.PORT })
    this.instance = new nengi.Instance(nengiConfig, { httpServer: server })

    this.database = new firebaseInstance();
    this.session_id = false;
    this.session = false;

    this.instance.onConnect((client, clientData, callback) => {

      // set default stats
      let defaultPlayer = {
        x: Math.random() * 5,
        z: Math.random() * 5,
        rotation: 0,
        color: "#"+Math.floor(Math.random()*16777215).toString(16),
        name: "loading..."
      }

      // create a entity for this client
      const entity = new PlayerCharacter(defaultPlayer)

      this.instance.addEntity(entity) // adding an entity to a nengi instance assigns it an id

      // tell the client which entity it controls (the client will use this to follow it with the camera)
      this.instance.message(new Identity(entity.nid), client)

      console.log(entity);

      // establish a relation between this entity and the client
      entity.client = client
      client.entity = entity

      client.view = {
        x: entity.x,
        y: entity.y,
        halfWidth: 10,
        halfHeight: 10
      }

      this.entities.set(entity.nid, entity)

      callback({ accepted: true, text: 'Welcome!' })

    })

    this.instance.onDisconnect(client => {
      this.entities.delete(client.entity.nid)
      this.instance.removeEntity(client.entity)
    })

  }

  initializeWorld(){
    this.database.loadSession().then( session => {
      console.log('initializeWorld()', session.cubes);
      for (let c in session.cubes) {
        let cubeDb = session.cubes[c];

        const cube = new Cube({
          x: cubeDb.x,
          y: cubeDb.y,
          z: cubeDb.z,
          color: cubeDb.color,
        })

        // Order is important for the next two lines
        this.instance.addEntity(cube) // assigns an `nid` to green
        this.entities.set(cube.nid, cube) // uses the `nid` as a key

      }
    });

  }

  update(delta, tick, now) {
    let cmd = null

    while (cmd = this.instance.getNextCommand()) {
      const tick = cmd.tick
      const client = cmd.client

      for (let i = 0; i < cmd.commands.length; i++) {
        const command = cmd.commands[i]
        const entity = client.entity

        // console.log('COMMAND', command, entity.nid);

        if (command.protocol.name === 'MoveCommand') {
          entity.processMove(command)
        }

        if (command.protocol.name === 'MsgCommand') {
          if(command.type === 'name'){
            entity.name = command.message;
          }
          if(command.type === 'session_id'){
            this.database.setSession(command.message);
            this.initializeWorld();
          }
        }

        if (command.protocol.name === 'FireCommand') {

          const cube = new Cube({
            sourceId: entity.nid,
            x: command.x,
            y: command.y,
            z: command.z,
            color: "#"+Math.floor(Math.random()*16777215).toString(16),
          })

          // Order is important for the next two lines
          this.instance.addEntity(cube) // assigns an `nid` to green
          this.entities.set(cube.nid, cube) // uses the `nid` as a key

          this.database.addCube(cube).then( data => {
            console.log(data);
          });

          console.log('new [Cube]', cube);
        }


      }
    }

    // TODO: the rest of the game logic
    this.instance.clients.forEach(client => {

      //
      client.entity.move(delta);

      // update view
      client.view.x = client.entity.x
      client.view.y = client.entity.y

    })

    // when instance.updates, nengi sends out snapshots to every client
    this.instance.update()

  }
}

export default GameInstance