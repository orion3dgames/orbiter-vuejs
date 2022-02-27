import nengi from 'nengi'
import nengiConfig from '../common/nengiConfig'
import PlayerCharacter from '../common/entity/PlayerCharacter'
import Identity from '../common/message/Identity'

class GameInstance {
  constructor() {
    this.players = new Map()

    this.instance = new nengi.Instance(nengiConfig, { port: 8079 })

    this.instance.onConnect((client, clientData, callback) => {

      // create a entity for this client
      const entity = new PlayerCharacter()
      this.instance.addEntity(entity) // adding an entity to a nengi instance assigns it an id

      // tell the client which entity it controls (the client will use this to follow it with the camera)
      this.instance.message(new Identity(entity.nid), client)

      // set random starting point
      entity.x = Math.random() * 10
      entity.y = Math.random() * 10
      entity.z = Math.random() * 10

      // set player color
      var randomColor = Math.floor(Math.random()*16777215).toString(16);
      entity.color = "#"+randomColor;

      // establish a relation between this entity and the client
      entity.client = client
      client.entity = entity

      this.players.set(entity.nid, entity)

      callback({ accepted: true, text: 'Welcome!' })

    })

    this.instance.onDisconnect(client => {
      this.players.delete(client.entity.nid)
      this.instance.removeEntity(client.entity)
    })

  }

  update(delta, tick, now) {
    let cmd = null

    while (cmd = this.instance.getNextCommand()) {
      const tick = cmd.tick
      const client = cmd.client

      for (let i = 0; i < cmd.commands.length; i++) {
        const command = cmd.commands[i]
        const entity = client.entity

        if (command.protocol.name === 'MoveCommand') {
          entity.processMove(command)
        }

        if (command.protocol.name === 'FireCommand') {
          console.log('FireCommand', command);
        }
      }
    }

    // TODO: the rest of the game logic
    this.instance.clients.forEach(client => {
      client.entity.move(delta)
    })

    // when instance.updates, nengi sends out snapshots to every client
    this.instance.update()

  }
}

export default GameInstance