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
    this.renderer = PIXI.autoDetectRenderer({
      width :window.innerWidth,
      height: window.innerHeight,
      view: this.canvas,
      antialiasing: false,
      transparent: false,
      resolution: 1
    })

    this.stage = new PIXI.Container()
    this.camera = new PIXI.Container()
    this.background = new PIXI.Container()
    this.middleground = new PIXI.Container()
    this.foreground = new PIXI.Container()

    this.camera.addChild(this.background)
    this.camera.addChild(this.middleground)
    this.camera.addChild(this.foreground)
    this.stage.addChild(this.camera)

    this.background.addChild(new BackgroundGrid())

    window.addEventListener('resize', () => {
      this.resize()
    })
    */
  }

  resize() {
    this.renderer.resize(window.innerWidth, window.innerHeight)
  }

  createEntity(entity) {

    // create and add an entity to the renderer
    if (entity.protocol.name === 'PlayerCharacter') {
      const clientEntity = new PlayerCharacter(entity)
      this.entities.set(entity.nid, clientEntity)

      // IF MYSELF
      if(this.myId === entity.nid){
        this.playerEl.setAttribute('position', clientEntity.position);
        console.log('UPDATE PLAYER POSITION', entity);
      }

      // ELSE INSTANTIATE OTHER PLAYER(S)
      if(this.myId !== entity.nid) {
        var entityEl = document.createElement('a-entity');
        entityEl.setAttribute('id', 'nid-'+entity.nid);
        entityEl.setAttribute('position', clientEntity.position);
        entityEl.setAttribute('rotation', clientEntity.rotation);
        entityEl.setAttribute('geometry', clientEntity.geometry);
        this.sceneEl.appendChild(entityEl)
        console.log('ADDING OTHER PLAYER POSITION', entity);
      }

      // if that entity is ours, save it to myEntity
      if (entity.nid === this.myId) {
        this.myEntity = clientEntity
      }
    }
  }

  updateEntity(update) {
    let entity = document.querySelector('#nid-'+update.nid);

    // TERRIBLE BUT WORKS
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
      this.middleground.removeChild(entity)
      this.entities.delete(nid)
    }
  }

  processLocalMessage(message) {
    if (message.protocol.name === 'WeaponFired') {
      this.drawHitscan(message.x, message.y, message.tx, message.ty, 0xff0000)
    }
  }

  // not used, but this would rigidly follow the entity w/ the camera
  centerCamera(entity) {
    this.camera.x = -entity.x + 0.5 * window.innerWidth
    this.camera.y = -entity.y + 0.5 * window.innerHeight
  }

  followSmoothlyWithCamera(entity, delta) {
    const cameraSpeed = 5
    const targetX = -entity.x + 0.5 * window.innerWidth
    const targetY = -entity.y + 0.5 * window.innerHeight
    const dx = targetX - this.camera.x
    const dy = targetY - this.camera.y
    this.camera.x += dx * cameraSpeed * delta
    this.camera.y += dy * cameraSpeed * delta
  }

  toWorldCoordinates(mouseX, mouseY) {
    return {
      x: -this.camera.x + mouseX,
      y: -this.camera.y + mouseY
    }
  }

  update(delta) {
    /*
    // if we had draw logic (animations) for each entity...
    this.entities.forEach(entity => {
        entity.update(delta)
    })
    */

    if (this.myEntity) {
      //this.centerCamera(this.myEntity)
      this.followSmoothlyWithCamera(this.myEntity, delta)
    }

    this.renderer.render(this.stage)
  }
}

export default AFRAMERenderer