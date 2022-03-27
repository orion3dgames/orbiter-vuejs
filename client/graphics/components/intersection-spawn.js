import { log } from "aframe";

window.AFRAME.registerComponent('intersection-spawn', {
  schema: {
    default: '',
    parse: window.AFRAME.utils.styleParser.parse
  },
  init: function () {
    const el = this.el;
    let down = false;
    el.addEventListener('mousedown', e => {
      console.log(e);
      down = new Date().getTime();
    });
    el.addEventListener('mouseup', e => {
      if (new Date().getTime() - down < 200)
        el.emit('cube_added', e.detail.intersection.point)
    });
  }
});