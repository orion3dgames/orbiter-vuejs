window.AFRAME.registerComponent('intersection-spawn', {
  schema: {
    default: '',
    parse: window.AFRAME.utils.styleParser.parse
  },
  init: function () {

    const cursor = this.el;

    cursor.addEventListener('click', e => {

      // not used yet

    });

  }
});