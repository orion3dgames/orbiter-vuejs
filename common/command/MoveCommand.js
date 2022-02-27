import nengi from 'nengi'

class MoveCommand {
  constructor(pos, rot, delta) {
    this.x = pos.x;
    this.y = pos.y;
    this.z = pos.z;
    this.delta = delta
  }
}

MoveCommand.protocol = {
  x: nengi.Float32,
  y: nengi.Float32,
  z: nengi.Float32,
  delta: nengi.Float32
}

export default MoveCommand;