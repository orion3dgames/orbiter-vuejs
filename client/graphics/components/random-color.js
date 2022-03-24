function getRandomColor() {
  const letters = '123456789';
  let color = '#';
  const r = Math.floor(Math.random() * 9);
  for (let i = 0; i < 6; i++) {
    color += letters[r];
  }
  return color;
}

window.AFRAME.registerComponent('random-color', {
  dependencies: ['material'],
  init() {
    var color = getRandomColor();
    this.el.setAttribute('material', 'color', color);
  },
});