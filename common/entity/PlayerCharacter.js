import nengi from 'nengi'
//import { Vector3 } from 'aframe/src/lib/three'

class PlayerCharacter {
    constructor(entity) {

        this.nid = 0;
        this.x = 0
        this.y = 0
        this.z = 0
        this.rotation = 0
        this.color = '#FFFFFF';
        this.speed = 2;

        this.moveRotation = 0;
        this.moveDirection = {
            x: 0,
            y: 0,
            z: 0,
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
            y: this.rotation,
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
        let unitZ = 0
        let unitY = 0
        let radian = command.rotation * (Math.PI / 180)

        // create forces from input
        if (command.forward) { unitZ -= 1 }
        if (command.backward) { unitZ += 1 }
        if (command.left) { unitX -= 1 }
        if (command.right) { unitX += 1 }
        if (command.jump) {
            //unitY += 1
        }else{
            //unitY -= 1
        }

        this.moveDirection.x = unitX
        this.moveDirection.z = unitZ
        this.moveDirection.y = unitY
        this.moveRotation = command.rotation

        // DONT GO BELOW GROUND
        if(unitY < 0){
            //this.y = 0;
        }

        console.log(command, unitZ, unitX, unitY);

    }

    move(delta) {
        this.x += this.moveDirection.x * this.speed * delta
        this.z += this.moveDirection.z * this.speed * delta
        this.y = 0;
        this.rotation = this.moveRotation;
    }

}

PlayerCharacter.protocol = {
    x: { type: nengi.Float32, interp: true },
    y: { type: nengi.Float32, interp: true },
    z: { type: nengi.Float32, interp: true },
    rotation: { type: nengi.Float32, interp: true },
    color: nengi.UTF8String,
}

export default PlayerCharacter