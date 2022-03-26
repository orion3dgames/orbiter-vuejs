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

    // START NENGI GAME SERVER
    this.instance = new nengi.Instance(nengiConfig, { httpServer: server })

    // INITIALIZE FIREBASE
    this.database = new firebaseInstance();

    // INITIALIZE WORLD
    this.initializeWorld();

    // ON CLIENT CONNECT
    this.instance.onConnect((client, clientData, callback) => {
      this.client = client;
      console.log(clientData, 'is connecting')
      this.addPlayer(clientData.fromClient).then(() => {
        callback({ accepted: true, text: 'Welcome!' })
      });
    })

    // ON CLIENT DISCONNECT
    this.instance.onDisconnect(client => {
      console.log('[SERVER][onDisconnect]', client.nid);
      this.entities.delete(client.entity.nid)
      this.instance.removeEntity(client.entity)
    })

  }

  addPlayer(user){
    return new Promise((resolve) => {
      console.log('[SERVER][addPlayer]', user);
      this.database.getPlayer(user.uid).then(data => {

        // set default stats
        let defaultPlayer = {
          x: 0,
          z: 0,
          rotation: 0,
          color: "#" + Math.floor(Math.random() * 16777215).toString(16),
          displayName: "loading..."
        }

        // if found in database
        if (data) {
          defaultPlayer.color = data.color;
          defaultPlayer.displayName = data.displayName;
          defaultPlayer.rotation = data.rotation.y;
          defaultPlayer.x = data.position.x;
          defaultPlayer.z = data.position.z;
        }

        // create a entity for this client
        const entity = new PlayerCharacter(defaultPlayer)

        this.instance.addEntity(entity) // adding an entity to a nengi instance assigns it an id

        // tell the client which entity it controls (the client will use this to follow it with the camera)
        this.instance.message(new Identity(entity.nid), this.client)

        // establish a relation between this entity and the client
        entity.client = this.client
        this.client.entity = entity

        this.client.view = {
          x: entity.x,
          y: entity.y,
          halfWidth: 10,
          halfHeight: 10
        }

        this.entities.set(entity.nid, entity)

        resolve(true);

      });
    });
  }

  initializeWorld(){

    console.log('initializeWorldFromDB');

    ////////////////////////////////////////////////////////
    // ADD EXISTING CUBES
    this.database.loadCubes().then( cubes => {
      for (let c in cubes) {
        let cubeDb = cubes[c];
        const cube = new Cube({
          x: cubeDb.x,
          y: cubeDb.y,
          z: cubeDb.z,
          color: cubeDb.color,
        })
        this.instance.addEntity(cube) // assigns an `nid` to green
        this.entities.set(cube.nid, cube) // uses the `nid` as a key
        console.log('---> [ADDED CUBE]', cube.x, cube.y, cube.z);
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

        if (command.protocol.name === 'MsgCommand') {
          let message = JSON.parse(command.message);
          //example of how to use it.
          /*
          if(command.type === 'newUser'){
            entity.name = message.displayName;
            entity.firebaseUID = message.uid;
            console.log(message);
          }*/
        }

        if (command.protocol.name === 'MoveCommand') {
          entity.processMove(command)
        }

        if (command.protocol.name === 'CubeCommand') {

          // create cube identity
          const cube = new Cube({
            sourceId: entity.nid,
            x: command.x,
            y: command.y,
            z: command.z,
            color: "#"+Math.floor(Math.random()*16777215).toString(16),
          })
          this.instance.addEntity(cube) // assigns an `nid` to green
          this.entities.set(cube.nid, cube) // uses the `nid` as a key

          // add cube to DB
          this.database.addCube(cube).then( data => {
            console.log(data);
          });

          console.log('new [Cube]', cube);
        }


      }
    }

    // TODO: the rest of the game logic
    this.instance.clients.forEach(client => {

      if(client.entity) {

        // move client
        client.entity.move(delta);

        // update view
        client.view.x = client.entity.x
        client.view.y = client.entity.y

      }

    })

    // when instance.updates, nengi sends out snapshots to every client
    this.instance.update()

  }
}

export default GameInstance