import PlayerCharacter from '../../common/entity/PlayerCharacter'
import Cube from '../../common/entity/Cube'
import store from '../../src/store'; // path to your Vuex store

// import aframe components
import intersectionSpawn from './components/intersection-spawn';
import './components/touch';
import './components/player';
//import randomColor from './components/random-color';
import snap from './components/snap';
import CubeCommand from "../../common/command/CubeCommand";

class AFRAMERenderer {

  constructor() {

    this.sceneEl = document.querySelector('a-scene');
    this.playerEl = null;
    this.cameraEl = null;

    this.myId = null
    this.myEntity = null
    this.entities = new Map();

    this.init();

  }

  init() {

    // debug
    const debug = document.createElement('a-entity');
    debug.setAttribute('id', 'debug');
    debug.setAttribute('position', '0 2 -5');
    debug.setAttribute('geometry', 'primitive: plane; width: 2; height: 2;');
    debug.setAttribute('material', 'color: #FFF;');
    debug.setAttribute('text', 'color: #000; align: left; value: "DEBUG"; width: 2; side: double');
    this.sceneEl.appendChild(debug);

  }

  createEntity(entity) {

    //////////// CUBES /////////////////
    if (entity.protocol.name === 'Cube') {

      // dont add client own cubes
      if (entity.sourceId === this.myId) {
        //return false;
      }

      // create cube
      const cubeIdentity = new Cube(entity)

      // add to local entities
      this.entities.set(entity.nid, cubeIdentity);

      // spawn cube
      cubeIdentity.spawn(this.sceneEl)
    }

    //////////// PLAYER CHARACTER /////////////////
    if (entity.protocol.name === 'PlayerCharacter') {

      let user = store.getters.user;

      const playerEntity = new PlayerCharacter(entity)

      this.entities.set(entity.nid, playerEntity)

      // if that entity is ours, save it to myEntity
      if (entity.nid === this.myId) {
        playerEntity.name = user.displayName;
        this.myEntity = playerEntity
      }

      // spawn player / client
      this.playerEl = playerEntity.spawn(this.sceneEl, entity, this.myId);

      // add camera el
      this.cameraEl = document.querySelector('#camera');

    }
  }

  updateEntity(update) {

    // get entity el
    let entity = document.querySelector('#nid-' + update.nid);

    // if entity found
    if (entity) {

      //console.log('[updateEntity]', update, entity);

      // update pos todo: to be improved
      let position = ['x', 'y', 'z'];
      if (position.includes(update.prop)) {
        let currentPosition = entity.getAttribute('position');
        currentPosition[update.prop] = update.value;
        entity.setAttribute('position', currentPosition);
      }

      let rotation = ['rotation'];
      if (rotation.includes(update.prop)) {
        let currentPosition = entity.getAttribute('rotation');
        currentPosition['y'] = update.value;
        entity.setAttribute('rotation', currentPosition);
      }
    }

  }

  processMessage(message) {
    if (message.protocol.name === 'Identity') {
      this.myId = message.entityId
      console.log('identified as', this.myId)
    }
  }

  deleteEntity(nid) {
    // remove an entity from the renderer
    const entity = this.entities.get(nid)
    console.log('DELETE ENTITY', entity);
    let entityEl = document.querySelector('#nid-' + entity.nid);
    if (entity && entityEl) {
      entityEl.parentNode.removeChild(entityEl);
    }
  }

  processLocalMessage(message) {
    if (message.protocol.name === 'WeaponFired') {
      //this.drawHitscan(message.x, message.y, message.tx, message.ty, 0xff0000)
    }
  }

  update(delta) {

    if (this.myEntity) {
      //this.centerCamera(this.myEntity)
    }

  }
}

export default AFRAMERenderer