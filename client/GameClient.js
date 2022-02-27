import nengi from 'nengi'
import nengiConfig from '../common/nengiConfig'
import InputSystem from './InputSystem'
import AFRAMERenderer from './graphics/AFrame'
import MoveCommand from '../common/command/MoveCommand'

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

    //console.log(this.renderer);

    /* sending */
    let playerPos = this.renderer.playerEl.getAttribute('position');
    let playerRot = { x: 0, y: 0, z: 0};
    this.client.addCommand(new MoveCommand(playerPos, playerRot, delta))

    /*
    if (input.mouseDown) {
      this.client.addCommand(new FireCommand(worldCoord.x, worldCoord.y))
    }
    */

    this.client.update()
    /*
    //this.renderer.update(delta)
    */
  }
}

export default GameClient