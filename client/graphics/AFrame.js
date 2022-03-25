import PlayerCharacter from '../../common/entity/PlayerCharacter'
import Cube from '../../common/entity/Cube'
import store from '../../src/store'; // path to your Vuex store

// import aframe components
import intersectionSpawn from './components/intersection-spawn';
import './components/touch';
//import randomColor from './components/random-color';
import snap from './components/snap';
import FireCommand from "../../common/command/FireCommand";

class AFRAMERenderer {

  constructor() {

    this.sceneEl = document.querySelector('a-scene');
    this.playerEl = null;
    this.cameraEl = null;

    this.myId = null
    this.myEntity = null
    this.entities = new Map();

  }

  createEntity(entity) {

    // create and add an entity to the renderer
    if (entity.protocol.name === 'Cube') {
      if (entity.sourceId === this.myId) {
        //return false;
      }
      const cubeIdentity = new Cube(entity)
      this.entities.set(entity.nid, cubeIdentity)

      let cubeEl = document.createElement('a-entity');
      cubeEl.setAttribute('id', 'nid-' + cubeIdentity.nid);
      cubeEl.setAttribute('position', cubeIdentity.position);
      cubeEl.setAttribute('rotation', cubeIdentity.rotation);
      cubeEl.setAttribute('material', cubeIdentity.material);
      cubeEl.setAttribute('mixin', cubeIdentity.mixin);
      this.sceneEl.appendChild(cubeEl);
    }

    // create and add an entity to the renderer
    if (entity.protocol.name === 'PlayerCharacter') {

      let user = store.getters.user;

      const clientEntity = new PlayerCharacter(entity)
      //clientEntity.name = user.displayName;

      this.entities.set(entity.nid, clientEntity)

      // if that entity is ours, save it to myEntity
      if (entity.nid === this.myId) {
        clientEntity.name = user.displayName;
        this.myEntity = clientEntity
      }

      // create entity
      console.log('CREATE CLIENT', clientEntity)
      var entityEl = document.createElement('a-entity');
      entityEl.setAttribute('id', 'nid-' + clientEntity.nid);
      entityEl.setAttribute('position', clientEntity.position);
      entityEl.setAttribute('rotation', clientEntity.rotation);
      entityEl.setAttribute('material', clientEntity.material);
      entityEl.setAttribute('geometry', clientEntity.geometry);
      entityEl.setAttribute('shadow', clientEntity.geometry);

      // add username (not multiplayer yet)
      var nameEl = document.createElement('a-text');
      nameEl.setAttribute('text', 'color: #000; align: left; value: ' + clientEntity.name + "\n" + clientEntity.nid + '; width: 2; side: double');
      nameEl.setAttribute('position', { x: -0.5, y: 1.25, z: 0 });
      entityEl.appendChild(nameEl);

      // if myself
      if (entity.nid === this.myId) {

        // add cursor
        var cursorEl = document.createElement('a-cursor');
        cursorEl.setAttribute('intersection-spawn', { event: 'click', mixin: 'voxel' });

        // add camera to entity
        var cameraEl = document.createElement('a-entity');
        cameraEl.setAttribute('camera', 'active', true);
        cameraEl.setAttribute('position', { x: 0, y: 1, z: 0 });
        cameraEl.setAttribute('player-head');
        cameraEl.setAttribute('look-controls', {
          'enabled': true,
          'pointerLockEnabled': false
        });
        cameraEl.appendChild(cursorEl);
        entityEl.appendChild(cameraEl);

        // add left hand
        var leftHand = document.createElement('a-entity');
        leftHand.setAttribute('oculus-touch-controls', { 'hand': 'left' });
        leftHand.setAttribute('thumbstick-logging', '');
        entityEl.appendChild(leftHand);

        // add right hand
        var rightHand = document.createElement('a-entity');
        rightHand.setAttribute('oculus-touch-controls', { 'hand': 'right' });
        rightHand.setAttribute('thumbstick-logging', '');
        entityEl.appendChild(rightHand);

        // debug
        const debug = document.createElement('a-entity');
        debug.setAttribute('id', 'debug');
        debug.setAttribute('position', '0 2 -5');
        debug.setAttribute('geometry', 'primitive: plane; width: 2; height: 2;');
        debug.setAttribute('text', 'color: #000; align: left; value: "DEBUG"; width: 2; side: double');
        this.sceneEl.appendChild(debug);

        //<a-entity sphere-collider="objects: a-box" super-hands hand-controls="hand: left"></a-entity>
        //<a-entity sphere-collider="objects: a-box" super-hands hand-controls="hand: right"></a-entity>
        /*
        var rightHandEl = document.createElement('a-entity');
        rightHandEl.setAttribute('hand-controls', 'right');
        rightHandEl.setAttribute('controller-cursor');
        rightHandEl.setAttribute('intersection-spawn', {event: 'click', mixin: 'voxel'});
        entityEl.appendChild(rightHandEl);
         */

        this.playerEl = entityEl;
        this.cameraEl = cameraEl;
      }

      this.sceneEl.appendChild(entityEl);
      console.log("entity added")
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