window.AFRAME.registerComponent('intersection-spawn', {
  schema: {
    default: '',
    parse: window.AFRAME.utils.styleParser.parse
  },
  init: function () {
    const data = this.data;
    const el = this.el;
    el.addEventListener(data.event, evt => {
      el.emit('cube_added', evt.detail.intersection.point)
    });
  }
});