require('aframe');

import PlayerCharacter from '../../common/entity/PlayerCharacter'

class AFRAMERenderer {

  constructor() {

    this.sceneEl = document.querySelector('a-scene');
    this.playerEl = document.querySelector('#player');

    this.myId = null
    this.myEntity = null
    this.entities = new Map();

    /*
    window.addEventListener('resize', () => {
      this.resize()
    })
    */
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

      // IF MYSELF
      if(this.myId === entity.nid){
        this.setPlayer(clientEntity);
      }

      // ELSE INSTANTIATE OTHER PLAYER(S)
      if(this.myId !== entity.nid) {
        this.createClient(clientEntity);
      }

    }
  }

  // set local player
  setPlayer(clientEntity) {
    console.log('SET PLAYER', this.playerEl, clientEntity.position)
    //this.playerEl.setAttribute('position', clientEntity.position);
    //this.playerEl.setAttribute('material', clientEntity.material);
  }

  // create all client entity
  createClient(clientEntity) {
    console.log('CREATE CLIENT', clientEntity)
    var entityEl = document.createElement('a-entity');
    entityEl.setAttribute('id', 'nid-'+ clientEntity.nid);
    entityEl.setAttribute('position', clientEntity.position);
    entityEl.setAttribute('rotation', clientEntity.rotation);
    entityEl.setAttribute('geometry', clientEntity.geometry);
    entityEl.setAttribute('material', clientEntity.material);
    this.sceneEl.appendChild(entityEl)
  }

  updateEntity(update) {

    // get entity el
    let entity = document.querySelector('#nid-'+update.nid);

    // if entity found
    if(entity) {

      console.log('[updateEntity]', update, entity);

      // update pos todo: to be improved
      let position = ['x', 'y', 'z'];
      if (position.includes(update.prop)) {
        let currentPosition = entity.getAttribute('position');
        currentPosition[update.prop] = update.value;
        entity.setAttribute('position', currentPosition);
      }
    }

  }

  processMessage(message) {
    if (message.protocol.name === 'Identity') {
      this.myId = message.entityId
      this.playerEl.setAttribute('id', '#nid-'+this.myId)
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