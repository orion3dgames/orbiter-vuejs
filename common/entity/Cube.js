import nengi from 'nengi'

class Cube {
  constructor(entity) {

    this.nid = 0; // nengi id
    this.cube_uid = 0; // firebase cube id
    this.player_uid = 0; // firebase player nid
    this.x = 0
    this.y = 0
    this.z = 0
    this.color = '#FFFFFF';
    this.type = 'standard'; // 2 types available: standard, crate

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

    this.shadow = {
      receive: true,
      cast:true
    }

    this.snap = {
      offset: '0 0 0',
      snap: '1 1 1',
    }

    this._loadMaterial(this.type);

  }

  _loadMaterial(type){

    let material;

    switch(type) {

      case "standard":
        material = {
          shader: 'standard',
          color: this.color,
        }
        break;

      case "crate":
        material = {
          shader: 'standard',
          color: this.color,
          src: "#crateTexture"
        }
        break;
    }

    this.material = material;

  }

  spawn(targetEl){
    let cubeEl = document.createElement('a-entity');
    cubeEl.setAttribute('id', 'nid-' + this.nid);
    cubeEl.setAttribute('type', this.type);
    cubeEl.setAttribute('position', this.position);
    cubeEl.setAttribute('rotation', this.rotation);
    cubeEl.setAttribute('material', this.material);
    cubeEl.setAttribute('geometry', this.geometry);
    cubeEl.setAttribute('shadow', this.shadow);
    cubeEl.setAttribute('snap', this.snap);
    cubeEl.setAttribute('cube', ''); // CUSTOM AFRAME COMPONENT
    targetEl.appendChild(cubeEl);
  }

}

Cube.protocol = {
  player_uid: nengi.UTF8String,
  x: { type: nengi.Float32, false: true },
  y: { type: nengi.Float32, false: true },
  z: { type: nengi.Float32, false: true },
  type: nengi.UTF8String,
  color: nengi.UTF8String,
}

export default Cube