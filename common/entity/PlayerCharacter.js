import nengi from 'nengi'
//import { Vector3 } from 'aframe/src/lib/three'

class PlayerCharacter {
    constructor(entity) {

        this.nid = 0; // nengi uid
        this.player_uid = false // firebase uid
        this.x = 0
        this.y = 0
        this.z = 0
        this.rotation = 0
        this.color = '#FFFFFF';
        this.speed = 2;
        this.displayName = '...loading';
        this.moveRotation = 0;
        this.moveDirection = {
            x: 0,
            y: 0,
            z: 0,
        }

        this.shadow = {
            receive: true,
            cast: true,
        }

        this.geometry = {
            primitive: 'sphere',
            radius: 0.5,
        };

        if (entity) {
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

        console.log(this);
    }

    spawn(targetEl, entity, myId) {

        var entityEl = document.createElement('a-entity');
        entityEl.setAttribute('id', 'nid-' + this.nid);
        entityEl.setAttribute('position', this.position);
        entityEl.setAttribute('rotation', this.rotation);
        entityEl.setAttribute('material', this.material);
        entityEl.setAttribute('geometry', this.geometry);
        entityEl.setAttribute('shadow', this.geometry);

        // add username
        var nameEl = document.createElement('a-text');
        nameEl.setAttribute('text', 'color: #000; align: left; value: ' + this.displayName + "\n" + this.nid + '; width: 2; side: double');
        nameEl.setAttribute('position', { x: -0.5, y: 1.25, z: 0 });
        entityEl.appendChild(nameEl);

        // if myself, add all player related stuff
        if (entity.nid === myId) {

            // add player specific component
            entityEl.setAttribute('player-body', ''); // uniquement sur le joueur?

            // add cursor
            var cursorEl = document.createElement('a-cursor');
            cursorEl.setAttribute('intersection-spawn', '');

            // add camera to entity
            var cameraEl = document.createElement('a-entity');
            cameraEl.setAttribute('id', 'camera');
            cameraEl.setAttribute('camera', 'active', true);
            cameraEl.setAttribute('position', { x: 0, y: 1, z: 0 });
            cameraEl.setAttribute('player-head', '');
            cameraEl.setAttribute('look-controls', {
                'enabled': true,
                'pointerLockEnabled': false
            });
            cameraEl.appendChild(cursorEl);
            entityEl.appendChild(cameraEl);

            // add left hand
            var leftHand = document.createElement('a-entity');
            leftHand.setAttribute('oculus-touch-controls', { 'hand': 'left' });
            leftHand.setAttribute('thumbstick-logging', '');
            entityEl.appendChild(leftHand);

            // add right hand
            var rightHand = document.createElement('a-entity');
            rightHand.setAttribute('oculus-touch-controls', { 'hand': 'right' });
            rightHand.setAttribute('thumbstick-logging', '');
            entityEl.appendChild(rightHand);
        }

        targetEl.appendChild(entityEl);

        return entityEl;
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

        // add values
        this.moveDirection.x = velocityZ * Math.sin(command.rotation / 180 * Math.PI * 2) + velocityX * Math.cos((-command.rotation / 180 * Math.PI * 2));
        this.moveDirection.z = velocityZ * Math.cos(command.rotation / 180 * Math.PI * 2) + velocityX * Math.sin((-command.rotation / 180 * Math.PI * 2));
        this.moveDirection.y = velocityY
        this.moveRotation = command.rotation

        // DONT GO BELOW GROUND
        if (velocityY < 1) {
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

// list of all vars to keep sync with all clients
PlayerCharacter.protocol = {
    x: { type: nengi.Float32, interp: true },
    y: { type: nengi.Float32, interp: true },
    z: { type: nengi.Float32, interp: true },
    rotation: { type: nengi.Float32, interp: true }, // should we use nengi.RotationFloat32 as suggested by DOC ?
    color: nengi.UTF8String,
    displayName: nengi.UTF8String,
    player_uid: nengi.UTF8String,
}

export default PlayerCharacter
