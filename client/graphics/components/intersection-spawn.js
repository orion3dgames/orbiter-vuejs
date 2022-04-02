import { log } from "aframe";

window.AFRAME.registerComponent('intersection-spawn', {
  schema: {
    default: '',
    parse: window.AFRAME.utils.styleParser.parse
  },
  init: function () {
    const cursor = this.el;
    let intersected = null;
    let down = false;
    let point = {};
    cursor.addEventListener('mousedown', e => {
      down = new Date().getTime();
      intersected = e.detail.intersectedEl
      const faceIndex = e.detail.intersection.face?.materialIndex;
      point = e.detail.intersectedEl.object3D.position
      if (intersected.getAttribute('type') === 'standard') {
        if (faceIndex === 2) point.y += 1 // top
        if (faceIndex === 1) point.x -= 1 // WEST
        if (faceIndex === 0) point.x += 1// EST
        if (faceIndex === 4) point.z += 1// SOUTH
        if (faceIndex === 5) point.z -= 1 // NORTH
      }
      if (intersected.getAttribute('type') === 'crate') {
        point.y += 1
      }
    });
    cursor.addEventListener('mouseup', e => {
      const keyState = window.app.gameClient.input.keyState;
      if (keyState.mouseType !== 'left') return;
      if (new Date().getTime() - down < 200)
        cursor.emit('cube_added', { x: point.x, y: point.y, z: point.z })
    });
  }
});