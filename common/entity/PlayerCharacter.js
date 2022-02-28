import nengi from 'nengi'

class PlayerCharacter {
    constructor(entity) {

        this.nid = 0;
        this.x = 0
        this.y = 0
        this.z = 0
        this.color = '#FFFFFF';

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
        this.x = command.x;
        this.y = command.y;
        this.z = command.z
    }
}

PlayerCharacter.protocol = {
    x: { type: nengi.Float32, interp: true },
    y: { type: nengi.Float32, interp: true },
    z: { type: nengi.Float32, interp: true },
    color: nengi.UTF8String,
}

export default PlayerCharacter