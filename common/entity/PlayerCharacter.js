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
        this.name = '...loading';

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

        this.shadow = {
            receive: true,
            cast: true,
        }

        this.geometry = {
            primitive: 'sphere',
            radius: 0.5,
        };
    }

    processMove(command) {

        let velocityX = 0
        let velocityZ = 0
        let velocityY = 0.25

        // create forces from input
        if (command.forward) { velocityZ -= 1 }
        if (command.backward) { velocityZ += 1 }
        if (command.left) { velocityX -= 1 }
        if (command.right) { velocityX += 1 }

        //let x = velocityX * Math.cos(command.rotation + Math.PI / 2);
        //let z = velocityZ * Math.sin(command.rotation + Math.PI / 2);

        // add values
        this.moveDirection.x = velocityX
        this.moveDirection.z = velocityZ
        this.moveDirection.y = velocityY
        this.moveRotation = command.rotation

        // DONT GO BELOW GROUND
        if(velocityY < 1){
            this.y = 0;
        }

        //console.log(command.rotation, radian, x, y, unitZ, unitX, unitY);

    }

    move(delta) {
        this.x += this.moveDirection.x * this.speed * delta
        this.z += this.moveDirection.z * this.speed * delta
        this.y = this.moveDirection.y;
        this.rotation = this.moveRotation;
    }

}

PlayerCharacter.protocol = {
    x: { type: nengi.Float32, interp: true },
    y: { type: nengi.Float32, interp: true },
    z: { type: nengi.Float32, interp: true },
    rotation: { type: nengi.Float32, interp: true },
    //rotation: { type: nengi.RotationFloat32, interp: true },
    color: nengi.UTF8String,
    name: nengi.UTF8String,
}

export default PlayerCharacter