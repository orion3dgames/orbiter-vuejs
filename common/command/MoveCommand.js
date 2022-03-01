import nengi from 'nengi'

class MoveCommand {
  constructor(forward, left, backward, right, jump, rotation, delta) {
    this.forward = forward
    this.left = left
    this.backward = backward
    this.right = right
    this.jump = jump
    this.rotation = rotation
    this.delta = delta
  }
}

MoveCommand.protocol = {
  forward: nengi.Boolean,
  left: nengi.Boolean,
  backward: nengi.Boolean,
  right: nengi.Boolean,
  jump: nengi.Boolean,
  rotation: nengi.Float32,
  delta: nengi.Float32
}

export default MoveCommand;