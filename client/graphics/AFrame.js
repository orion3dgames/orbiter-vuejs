import { registerComponent } from 'aframe';

import PlayerCharacter from '../../common/entity/PlayerCharacter'

class AFRAMERenderer {

  constructor() {

    this.sceneEl = document.querySelector('a-scene');
    this.playerEl = null;
    this.myId = null
    this.myEntity = null
    this.entities = new Map();

    // register component
    registerComponent('player', {
      init() {
        //console.log('init COMPONENT ENTITY');
      },
    });

  }

  createEntity(entity) {

    // create and add an entity to the renderer
    if (entity.protocol.name === 'PlayerCharacter') {

      console.log('[createEntity]', entity);

      const clientEntity = new PlayerCharacter(entity)
      this.entities.set(entity.nid, clientEntity)

      // if that entity is ours, save it to myEntity
      if (entity.nid === this.myId) {
        this.myEntity = clientEntity
      }

      // create entity
      console.log('CREATE CLIENT', clientEntity)
      var entityEl = document.createElement('a-entity');
      entityEl.setAttribute('id', 'nid-'+ clientEntity.nid);
      entityEl.setAttribute('position', clientEntity.position);
      entityEl.setAttribute('rotation', clientEntity.rotation);
      entityEl.setAttribute('geometry', clientEntity.geometry);
      entityEl.setAttribute('material', clientEntity.material);


      // if myself
      if (entity.nid === this.myId) {

        // add player component
        entityEl.setAttribute('player');

        // add camera to entity
        var cameraEl = document.createElement('a-entity');
        cameraEl.setAttribute('camera', 'active', true);
        entityEl.appendChild(cameraEl);

        // add control
        entityEl.setAttribute('wasd-controls', { fly: true, acceleration: 65 });
        cameraEl.setAttribute('look-controls', 'enabled', true);

        this.playerEl = entityEl;
      }

      this.sceneEl.appendChild(entityEl);

    }
  }

  updateEntity(update) {

    // get entity el
    let entity = document.querySelector('#nid-'+update.nid);

    // if entity found
    if(entity) {

      // update pos todo: to be improved
      let position = ['x', 'y', 'z'];
      if (position.includes(update.prop)) {
        console.log('[updateEntity]', update, entity);
        let currentPosition = entity.getAttribute('position');
        currentPosition[update.prop] = update.value;
        entity.setAttribute('position', currentPosition);
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
    let entityEl = document.querySelector('#nid-'+entity.nid);
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