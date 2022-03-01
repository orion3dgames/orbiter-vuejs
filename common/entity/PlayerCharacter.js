import nengi from 'nengi'

class PlayerCharacter {
    constructor(entity) {

        this.nid = 0;
        this.x = 0
        this.y = 0
        this.z = 0
        this.color = '#FFFFFF';
        this.speed = 2;

        this.moveDirection = {
            x: 0,
            y: 0
        }

        if (entity) {
            console.log('new [PlayerCharacter]', entity);
            Object.assign(this, entity)
        }

        this.position = {
            x: this.x,
            y: this.y,
            z: this.z,
        };

        this.rotation = {
            x: 0,
            y: 0,
            z: 0,
        }

        this.material = {
            color: this.color
        }

        this.geometry = {
            primitive: 'box',
            height:0.5,
            width: 0.5,
            depth: 0.5,
        };
    }

    processMove(command) {

        let unitX = 0
        let unitY = 0

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


    }

    move(delta) {
        this.x += this.moveDirection.x * this.speed * delta
        this.z += this.moveDirection.y * this.speed * delta
    }

}

PlayerCharacter.protocol = {
    x: { type: nengi.Float32, interp: true },
    y: { type: nengi.Float32, interp: true },
    z: { type: nengi.Float32, interp: true },
    color: nengi.UTF8String,
}

export default PlayerCharacter