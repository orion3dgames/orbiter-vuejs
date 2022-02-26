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
            x: Math.random() * 10,
            y: Math.random() * 2,
            z: -5,
        };

        this.rotation = {
            x: 0,
            y: 0,
            z: 0,
        }

        this.geometry = {
            primitive: 'box',
            height:0.1,
            width: 0.1,
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

        this.rotation = command.rotation

        let unitX = 0
        let unitY = 0
        let unitZ = 0

        // create forces from input
        if (command.forward) { unitY -= 1 }
        if (command.backward) { unitY += 1 }
        if (command.left) { unitX -= 1 }
        if (command.right) { unitX += 1 }

        // normalize
        const len = Math.sqrt(unitX * unitX + unitY * unitY)
        if (len > 0) {
            unitX = unitX / len
            unitY = unitY / len
        }

        this.moveDirection.x = unitX
        this.moveDirection.y = unitY
        this.moveDirection.z = unitZ


    }

    move(delta) {
        this.x += this.moveDirection.x * this.speed * delta
        this.y += this.moveDirection.y * this.speed * delta
        this.z += this.moveDirection.z * this.speed * delta

        this.collider.pos.x = this.x
        this.collider.pos.y = this.y
        this.collider.pos.z = this.z
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