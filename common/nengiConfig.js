import nengi from 'nengi'

import PlayerCharacter from './entity/PlayerCharacter'
import Cube from './entity/Cube'

import Identity from './message/Identity'
import PlaceCube from './message/PlaceCube'

import MoveCommand from './command/MoveCommand'
import FireCommand from './command/FireCommand'

const config = {
    UPDATE_RATE: 1,

    ID_BINARY_TYPE: nengi.UInt16,
    TYPE_BINARY_TYPE: nengi.UInt8, 

    ID_PROPERTY_NAME: 'nid',
    TYPE_PROPERTY_NAME: 'ntype', 

    USE_HISTORIAN: true,
    HISTORIAN_TICKS: 40,

    protocols: {
        entities: [
            ['PlayerCharacter', PlayerCharacter],
            ['Cube', Cube],
        ],
        localMessages: [],
        messages: [
            ['Identity', Identity],
            ['PlaceCube', PlaceCube],
        ],
        commands: [
            ['MoveCommand', MoveCommand],
            ['FireCommand', FireCommand],
        ],
        basics: []
    }
}

export default config