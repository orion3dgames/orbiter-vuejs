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
      const clientEntity = new PlayerCharacter(entity)
      this.entities.set(entity.nid, clientEntity)

      // IF MYSELF
      if(this.myId === entity.nid){
        this.setPlayer();
      }

      // ELSE INSTANTIATE OTHER PLAYER(S)
      if(this.myId !== entity.nid) {
        this.createClient();
      }

      // if that entity is ours, save it to myEntity
      if (entity.nid === this.myId) {
        this.myEntity = clientEntity
      }
    }
  }

  updateEntity(update) {

    // get entity el
    let entity = document.querySelector('#nid-'+update.nid);

    // update pos todo: to be improved
    let position = ['x', 'y', 'z'];
    if(position.includes(update.prop)){
      let currentPosition = entity.getAttribute('position');
      currentPosition[update.prop] = update.value;
      entity.setAttribute('position', currentPosition);
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
    if (entity) {
      let entityEl = document.querySelector('#nid-'+entity.nid);
      entityEl.parentNode.removeChild(entityEl);
    }
  }

  processLocalMessage(message) {
    if (message.protocol.name === 'WeaponFired') {
      this.drawHitscan(message.x, message.y, message.tx, message.ty, 0xff0000)
    }
  }

  // SET LOCAL PLAYER
  setPlayer() {
    this.playerEl.setAttribute('position', this.position);
    this.playerEl.setAttribute('material', this.material);
  }

  // ADD CLIENT
  createClient() {
    var entityEl = document.createElement('a-entity');
    entityEl.setAttribute('id', 'nid-'+this.nid);
    entityEl.setAttribute('position', this.position);
    entityEl.setAttribute('rotation', this.rotation);
    entityEl.setAttribute('geometry', this.geometry);
    entityEl.setAttribute('material', this.material);
    this.sceneEl.appendChild(entityEl)
  }

  update(delta) {

    if (this.myEntity) {
      //this.centerCamera(this.myEntity)
    }

  }
}

export default AFRAMERenderer