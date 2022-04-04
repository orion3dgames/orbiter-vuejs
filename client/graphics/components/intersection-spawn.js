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
    let adjustedPoint = {};
    let intersectedType = null;

    cursor.addEventListener('mousedown', e => {

      down = new Date().getTime();
      intersected = e.detail.intersectedEl;
      intersectedType = intersected.getAttribute('type');
      let faceIndex = e.detail.intersection.face?.materialIndex;

      let currentPoint = Object.assign({}, intersected.object3D.position); // save original ray point just in case
      adjustedPoint = Object.assign({}, currentPoint); // do a real copy

      //
      if(intersectedType === 'standard') {
        if (faceIndex === 2) adjustedPoint.y += 1 // top
        if (faceIndex === 1) adjustedPoint.x -= 1 // WEST
        if (faceIndex === 0) adjustedPoint.x += 1// EST
        if (faceIndex === 4) adjustedPoint.z += 1// SOUTH
        if (faceIndex === 5) adjustedPoint.z -= 1 // NORTH
      }

      // ????
      if (intersectedType === 'crate') {
        adjustedPoint.y += 1
      }

    });

    cursor.addEventListener('mouseup', e => {

      const keyState = window.app.gameClient.input.keyState;

      // only add a cube if left click
      if (keyState.mouseType !== 'left') return;

      if (new Date().getTime() - down < 200){
        cursor.emit('cube_added', { x: adjustedPoint.x, y: adjustedPoint.y, z: adjustedPoint.z })
      }

    });

  }
});