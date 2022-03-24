import nengi from 'nengi';

class PlaceCube {
  constructor(sourceId, x, y, z) {
    this.sourceId = sourceId
    this.x = x
    this.y = y
    this.z = z
  }
}

PlaceCube.protocol = {
  sourceId: nengi.UInt16,
  x: nengi.Float32,
  y: nengi.Float32,
  z: nengi.Float32,
}

export default PlaceCube;