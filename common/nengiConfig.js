import nengi from 'nengi'
require('dotenv').config();

import PlayerCharacter from './entity/PlayerCharacter'
import Cube from './entity/Cube'

import Identity from './message/Identity'
import PlaceCube from './message/PlaceCube'
import Message from './message/Message'

import MoveCommand from './command/MoveCommand'
import FireCommand from './command/FireCommand'
import MsgCommand from './command/MsgCommand'

const config = {

    PORT: process.env.VUE_APP_PORT || process.env.PORT || 8080,
    UPDATE_RATE: 20,

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
            ['Message', Message],
        ],
        commands: [
            ['MoveCommand', MoveCommand],
            ['MsgCommand', MsgCommand],
            ['FireCommand', FireCommand],
        ],
        basics: []
    }
}

export default config