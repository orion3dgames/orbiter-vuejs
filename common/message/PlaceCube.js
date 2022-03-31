import nengi from 'nengi';

class PlaceCube {
  constructor(x, y, z) {
    this.x = x
    this.y = y
    this.z = z
  }
}

PlaceCube.protocol = {
  x: nengi.Float32,
  y: nengi.Float32,
  z: nengi.Float32,
}

export default PlaceCube;