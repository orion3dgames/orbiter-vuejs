import nengi from 'nengi'

class Cube {
  constructor(entity) {

    this.nid = 0;
    this.x = 0
    this.y = 1
    this.z = 0

    if (entity) {
      console.log('new [Cube]', entity);
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
      height: 1,
      width: 1,
      depth: 1,
    };
  }
}

Cube.protocol = {
  x: { type: nengi.Float32, interp: true },
  y: { type: nengi.Float32, interp: true },
  z: { type: nengi.Float32, interp: true },
}

export default Cube