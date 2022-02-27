import nengi from 'nengi'
import SAT from 'sat'

class PlayerCharacter {
    constructor() {
        this.x = 0
        this.y = 0
        this.z = 0
        this.rotation = 0
        this.hitpoints = 100
        this.isAlive = true

        this.position = {
            x: 0,
            y: 1,
            z: 0,
        };

        this.rotation = {
            x: 0,
            y: 0,
            z: 0,
        }

        this.geometry = {
            primitive: 'box',
            height:0.5,
            width: 0.5,
            depth: 0.5,
        };

        this.moveDirection = {
            x: 0,
            y: 0,
            z: 0
        }

        this.speed = 400

        this.collider = new SAT.Circle(new SAT.Vector(this.x, this.y), 25)
    }

    processMove(command) {
        if (!this.isAlive) {
            return
        }
        console.log();

        this.rotation = command.rotation

        this.x = command.pos_x;
        this.y = command.pos_y;
        this.z = command.pos_z
    }

    move(delta) {
        // obsolete??
    }
}

PlayerCharacter.protocol = {
    x: { type: nengi.Float32, interp: true },
    y: { type: nengi.Float32, interp: true },
    z: { type: nengi.Float32, interp: true },
    rotation: { type: nengi.RotationFloat32, interp: true },
    isAlive: nengi.Boolean,
    hitpoints: nengi.UInt8
}

export default PlayerCharacter