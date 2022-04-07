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
    this.raycaster = new window.THREE.Raycaster();
    this.pointer = new window.THREE.Vector2();

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
    this.renderer.sceneEl.addEventListener('cube_added', (e) => {
      this.cubeAdded = e.detail;
    });

    this.input.onmousemove = (e) => {
      this.pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      this.pointer.y = - (e.clientY / window.innerHeight) * 2 + 1;
      const camera = window.AFRAME.scenes[0].camera
      this.raycaster.setFromCamera(this.pointer, camera);

      const scene = this.renderer.sceneEl;
      const intersects = this.raycaster.intersectObjects(scene.object3D.children);
      for (let i = 0; i < intersects.length; i++) {
        const inter = intersects[i];
        const isCube = inter.object.el.hasAttribute('cube');
        if (isCube) {
          // console.log(inter)
          inter.object.material[inter.face.materialIndex].color.set(0xff0000);
        }
      }
    }
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

    this.client.update()
    /* * */

    /* rendering */
    this.renderer.update(delta)
  }
}

export default GameClient