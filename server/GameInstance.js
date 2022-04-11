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
  console.log('Server started on port ' + PORT);
});

////////////////////////////////////////////////////////////////////
////////////////  GAME INSTANCE ////////////////////////////////////

class GameInstance {
  constructor() {

    // INIT VARIABLES
    this.savePlayerPositionEvery = 10000 // every 10 seconds

    // INIT VAR
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
      console.log('[SERVER][onDisconnect]', client.entity);
      this.entities.delete(client.entity.nid)
      this.instance.removeEntity(client.entity)
    })

    //

  }

  spawnCube(cubeData) {
    const cube = new Cube(cubeData)
    this.instance.addEntity(cube) // assigns an `nid` to green
    this.entities.set(cube.nid, cube) // uses the `nid` as a key
    return cube;
  }

  addCube(command, player_uid) {

    this.database.canCreateCube(command).then(data => {

      if (data === true) {

        let cube = this.spawnCube({
          player_uid: player_uid,
          x: command.x,
          y: command.y,
          z: command.z,
          type: 'standard',
          color: "#" + Math.floor(Math.random() * 16777215).toString(16),
        });

        // add cube to DB
        this.database.addCube(cube).then(data => {
          // cube saved to DB
          console.log('new [Cube]', cube);
        });

      }
    });
  }

  removeCube(nid) {

    let id = parseInt(nid, 10);

    if (!id) return false;

    const cube = this.entities.get(id);
    console.log();
    if (cube !== 'undefined') {


      console.log('try to delete cube nid', cube.nid);
      this.database.removeCube(cube).then(data => {
        console.log('removed [Cube]', cube);
        this.instance.removeEntity(cube)

      }).catch(function (e) {
        console.error(e);
      })
    }
  }

  addPlayer(user) {
    return new Promise((resolve) => {
      console.log('[SERVER][addPlayer]', user);
      this.database.getPlayer(user.uid).then(data => {

        // set default stats
        let defaultPlayer = {
          uid: false,
          x: 0,
          z: 0,
          y: 0,
          rotation: 0,
          color: "#" + Math.floor(Math.random() * 16777215).toString(16),
          displayName: "loading..."
        }

        // if found in database
        if (data) {
          defaultPlayer.player_uid = user.uid;
          defaultPlayer.color = data.color;
          defaultPlayer.displayName = data.displayName;
          defaultPlayer.rotation = data.rotation.y;
          defaultPlayer.x = data.position.x;
          defaultPlayer.z = data.position.z;
          defaultPlayer.y = data.position.y;
        }

        // create an entity for this client
        const entity = new PlayerCharacter(defaultPlayer)

        this.instance.addEntity(entity) // adding an entity to a nengi instance assigns it an id

        // tell the client which entity it controls (the client will use this to follow it with the camera)
        this.instance.message(new Identity(entity.nid), this.client)

        // establish a relation between this entity and the client
        entity.client = this.client
        this.client.entity = entity

        this.client.view = {
          x: entity.x,
          z: entity.z,
          y: entity.y,
          halfWidth: 20,
          halfHeight: 20,
          halfDepth: 20,
        }

        this.entities.set(entity.nid, entity)

        resolve(true);

      });
    });
  }

  initializeWorld() {

    console.log('initializeWorldFromDB');

    ////////////////////////////////////////////////////////
    // ADD USER ADDED CUBES
    this.database.loadCubes().then(cubes => {
      let count = 0;
      for (let c in cubes) {
        count++;
        let cubeData = cubes[c];
        this.spawnCube(cubeData);
      }
      console.log("Added User Generated Cubes ( " + count + " ) ");

      /////////////////////////////////////////////////////////
      // GENERATE MAIN WORLD
      var grid_x = 5;
      var grid_z = 5;
      for (var x = -grid_x; x <= grid_x; x++) {
        for (var z = -grid_z; z <= grid_z; z++) {
          let cubeData = {
            player_uid: 'SERVER',
            x: x,
            y: -1,
            z: z,
            color: '#EEEEEE',
            type: 'crate'
          }
          this.spawnCube(cubeData);

          // ADD A BORDER TO THE MAIN WORLD
          cubeData.y = 0;
          if (z === -grid_x) { this.spawnCube(cubeData); }
          if (x === -grid_z) { this.spawnCube(cubeData); }
          if (x === grid_x) { this.spawnCube(cubeData); }
          if (z === grid_z) { this.spawnCube(cubeData); }

        }
      }
      console.log("Generated Main World ( " + (grid_x * grid_z) + " cubes ) ");

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
          if (command.type === 'remove_cube') {
            this.removeCube(message.nid)
          }
        }

        if (command.protocol.name === 'MoveCommand') {
          entity.processMove(command)
        }

        if (command.protocol.name === 'CubeCommand') {
          //console.log(entity.player_uid, command);
          this.addCube(command, entity.player_uid);
        }

      }
    }

    // TODO: the rest of the game logic
    this.instance.clients.forEach(client => {

      if (client.entity) {

        // move client
        client.entity.move(delta);

        // update view
        client.view.x = client.entity.x
        client.view.z = client.entity.z
        client.view.y = client.entity.y

        // save player position
        // will save to db 1 time every 10 seconds
        let now = new Date().getTime();
        let timeSinceSave = client.entity.lastSaved + this.savePlayerPositionEvery;
        if(!client.entity.savingToDB && timeSinceSave < now){
          client.entity.savingToDB = true;
          let position = {
            'x': client.entity.x,
            'y': client.entity.y,
            'z': client.entity.z,
          }
          this.database.savePlayerPosition(position, client.entity.player_uid).then(data => {
            client.entity.lastSaved = new Date().getTime();
            client.entity.savingToDB = false;
          });
        }

      }

    })

    // when instance.updates, nengi sends out snapshots to every client
    this.instance.update()

  }
}

export default GameInstance