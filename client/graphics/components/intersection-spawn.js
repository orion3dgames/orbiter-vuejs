window.AFRAME.registerComponent('intersection-spawn', {
  dependencies: ['raycaster'],
  schema: {
    default: '',
    parse: window.AFRAME.utils.styleParser.parse
  },
  init: function () {

    // const cursor = this.el;

    // cursor.addEventListener("raycaster-intersection", function (e) {
    //   // enter objects
    //   // const intersections = e.detail.intersections;
    //   // for (let i = 0; i < intersections.length; i++) {
    //   //     console.log('enter cube', intersections[i])
    //   // }
    // });

    // cursor.addEventListener("raycaster-intersection-cleared", (e) => {
    //   // leave objects
    //   // console.log("leave cube", e.detail.clearedEls)
    // });

  }
});