import store from "@/store";

import nengi from 'nengi'
import nengiConfig from '../common/nengiConfig'

import InputSystem from './InputSystem'
import AFRAMERenderer from './graphics/AFrame'

import MoveCommand from '../common/command/MoveCommand'
import CubeCommand from '../common/command/CubeCommand'
import MsgCommand from '../common/command/MsgCommand'

class GameClient {
  constructor() {
    this.client = new nengi.Client(nengiConfig)
    this.renderer = new AFRAMERenderer()
    this.input = new InputSystem()
    this.latestCubePlacedTime = 0;
    this.user = store.getters.user;
    this.isloaded = false;

    this.client.onConnect(res => {
      console.log('onConnect response:', res);

      // server is ready
      this.isloaded = true;

      // showing loading screen
      let connectingScreen = document.querySelector('#screen-connecting');
      connectingScreen.style.display = 'none';

    })

    this.client.on('disconnected', () => {
      console.log('connection disconnected');
      alert('connection disconnected');
      window.location = '/';
    })

    this.client.onClose(() => {
      console.log('server is down');
      alert('server is down');
      window.location = '/';
    })

    // if local dev server, connect to correct serve
    var HOST = location.origin.replace(/^http/, 'ws')
    if (location.origin.includes('localhost')) {
      HOST = "ws://localhost:8080";
    }
    this.client.connect(HOST, {
      uid: this.user.uid,
      name: this.user.displayName
    })

    // REGISTER CUSTOM EVENT
    this.cubeAdded = null;
    this.renderer.sceneEl.addEventListener('cube_added', (data) => {
      console.log(data);
      this.cubeAdded = data.detail;
    });

  }

  update(delta, tick, now) {

    /* receiving */
    const network = this.client.readNetwork();

    network.entities.forEach(snapshot => {
      snapshot.createEntities.forEach(entity => {
        this.renderer.createEntity(entity)
      })

      snapshot.updateEntities.forEach(update => {
        this.renderer.updateEntity(update)
      })

      snapshot.deleteEntities.forEach(nid => {
        this.renderer.deleteEntity(nid)
      })
    })

    network.messages.forEach(message => {
      this.renderer.processMessage(message)
    })

    network.localMessages.forEach(localMessage => {
      this.renderer.processLocalMessage(localMessage)
    })

    if (this.isloaded) {

      // IF MOVING
      let input = this.input.frameState
      // moved in 'player-body' component, work in progress
      // const rotation = this.renderer.cameraEl ? this.renderer.cameraEl.getAttribute('rotation').y : 0;
      // this.client.addCommand(new MoveCommand(input.w, input.a, input.s, input.d, input.space, rotation, delta))

      // IF SPACE BUTTON PRESSED
      if (input.space) {
        var thisClickTime = new Date().getTime();
        if (thisClickTime - this.latestCubePlacedTime > 500 && this.cubeAdded) {
          this.latestCubePlacedTime = thisClickTime;
          console.log('CubeCommand', 'Click event fired...', this.cubeAdded);
          this.client.addCommand(new CubeCommand(this.cubeAdded.x, this.cubeAdded.y, this.cubeAdded.z));
          this.cubeAdded = null;
        }
      }

    }

    this.input.releaseKeys()
    this.client.update()
    /* * */

    /* rendering */
    this.renderer.update(delta)
  }
}

export default GameClient