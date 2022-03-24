import nengi from 'nengi'
import nengiConfig from '../common/nengiConfig'
import InputSystem from './InputSystem'
import AFRAMERenderer from './graphics/AFrame'
import MoveCommand from '../common/command/MoveCommand'
import FireCommand from '../common/command/FireCommand'

class GameClient {
  constructor() {
    this.client = new nengi.Client(nengiConfig)
    this.renderer = new AFRAMERenderer()
    this.input = new InputSystem()

    this.client.onConnect(res => {
      console.log('onConnect response:', res)
    })

    this.client.onClose(() => {
      console.log('connection closed')
    })

    this.client.connect('ws://localhost:8079')

  }

  update(delta, tick, now) {
    /* receiving */
    const network = this.client.readNetwork()

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

    const input = this.input.frameState
    const rotation = this.renderer.cameraEl ? this.renderer.cameraEl.getAttribute('rotation').y : 0;
    this.client.addCommand(new MoveCommand(input.w, input.a, input.s, input.d, input.space, rotation, delta))

    if (input.mouseDown) {
      console.log('FireCommand', 'Click event fired...');
      /*
      var cursor = document.querySelector('a-cursor');
      if (!cursor.components.intersectedEl) { return; }
      var intersection = cursor.components.raycaster.getIntersection(cursor.components.intersectedEl);
      var worldCoord = intersection.point;
      console.log('FireCommand', worldCoord);
      this.client.addCommand(new FireCommand(worldCoord.x, worldCoord.y, worldCoord.z))
      */
    }

    this.input.releaseKeys()
    this.client.update()
    /* * */

    /* rendering */
    this.renderer.update(delta)
  }
}

export default GameClient