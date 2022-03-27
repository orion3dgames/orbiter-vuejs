import nengi from 'nengi'

class Cube {
  constructor(entity) {

    this.nid = 0;
    this.sourceId = 0;
    this.x = 0
    this.y = 1
    this.z = 0
    this.color = '#FFFFFF';

    if (entity) {
      Object.assign(this, entity)
    }

    this.position = {
      x: this.x,
      y: 0,
      z: this.z,
    };

    this.rotation = {
      x: 0,
      y: 0,
      z: 0,
    }

    this.geometry = {
      primitive: 'box',
      height: 1,
      width: 1,
      depth: 1,
      buffer: true
    }

    this.material = {
      shader: 'standard',
      color: this.color
    }

    this.shadow = {
      receive: true,
      cast:true
    }

    this.snap = {
      offset: '0.50 0.50 0.50',
      snap: '1 1 1',
    }

    this.mixin = 'voxel'
  }

  spawn(targetEl){
    let cubeEl = document.createElement('a-entity');
    cubeEl.setAttribute('id', 'nid-' + this.nid);
    cubeEl.setAttribute('cube', '');
    cubeEl.setAttribute('position', this.position);
    cubeEl.setAttribute('rotation', this.rotation);
    cubeEl.setAttribute('material', this.material);
    cubeEl.setAttribute('geometry', this.geometry);
    cubeEl.setAttribute('shadow', this.shadow);
    cubeEl.setAttribute('snap', this.snap);
    targetEl.appendChild(cubeEl);
  }

}

Cube.protocol = {
  sourceId: { type: nengi.UInt16, interp: false },
  x: { type: nengi.Float32, interp: true },
  y: { type: nengi.Float32, interp: true },
  z: { type: nengi.Float32, interp: true },
  color: nengi.UTF8String,
}

export default Cube