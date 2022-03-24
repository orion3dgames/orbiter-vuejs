import nengi from 'nengi'
import nengiConfig from '../common/nengiConfig'
import PlayerCharacter from '../common/entity/PlayerCharacter'
import Identity from '../common/message/Identity'
import PlaceCube from '../common/message/PlaceCube'
import Cube from "../common/entity/Cube";

class GameInstance {
  constructor() {
    this.entities = new Map()

    this.instance = new nengi.Instance(nengiConfig, { port: 8079 })

    this.instance.onConnect((client, clientData, callback) => {

      // set default stats
      let defaultPlayer = {
        x: Math.random() * 2,
        y: 1,
        z: Math.random() * 1,
        rotation: 0,
        color: "#"+Math.floor(Math.random()*16777215).toString(16),
        name: "loading..."
      }

      // create a entity for this client
      const entity = new PlayerCharacter(defaultPlayer)

      this.instance.addEntity(entity) // adding an entity to a nengi instance assigns it an id

      // tell the client which entity it controls (the client will use this to follow it with the camera)
      this.instance.message(new Identity(entity.nid), client)

      console.log(entity);

      // establish a relation between this entity and the client
      entity.client = client
      client.entity = entity

      this.entities.set(entity.nid, entity)

      callback({ accepted: true, text: 'Welcome!' })

    })

    this.instance.onDisconnect(client => {
      this.entities.delete(client.entity.nid)
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

        console.log('COMMAND', command, entity.nid);

        if (command.protocol.name === 'MoveCommand') {
          entity.processMove(command)
        }

        if (command.protocol.name === 'FireCommand') {

          const cube = new Cube({
            sourceId: entity.nid,
            x: command.x,
            y: command.y,
            z: command.z,
            color: "#"+Math.floor(Math.random()*16777215).toString(16),
          })

          // Order is important for the next two lines
          this.instance.addEntity(cube) // assigns an `nid` to green
          this.entities.set(cube.nid, cube) // uses the `nid` as a key
          console.log('new [Cube]', cube);
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