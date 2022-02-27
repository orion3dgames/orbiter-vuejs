import nengi from 'nengi'

class MoveCommand {
  constructor(pos, rot, delta) {
    this.pos_x = pos.x;
    this.pos_y = pos.y;
    this.pos_z = pos.z;
    this.delta = delta
  }
}

MoveCommand.protocol = {
  pos_x: nengi.Float32,
  pos_y: nengi.Float32,
  pos_z: nengi.Float32,
  delta: nengi.Float32
}

export default MoveCommand;