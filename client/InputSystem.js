class InputSystem {
  constructor() {
    this.canvasEle = document.getElementById('main-canvas')
    this.onmousemove = null

    // default key mapping, compatible with qwerty and azerty
    const keyMapping = {
      up: "KeyW",
      down: "KeyS",
      left: "KeyA",
      right: "KeyD",
    }

    this.keyState = {
      up: false,
      down: false,
      left: false,
      right: false,
      space: false,
      mouseDown: false,
    };

    // disable right click
    document.addEventListener('contextmenu', e =>
      e.preventDefault()
    )

    document.addEventListener('keydown', e => {
      //console.log('keydown', e)
      // w,z or up arrow
      console.log(e)
      if (e.code === keyMapping.up || e.keyCode === 38) {
        this.keyState.up = 1
        window.app.debug('up')
      }
      // s or down arrow
      if (e.code === keyMapping.down || e.keyCode === 40) {
        this.keyState.down = 1
        window.app.debug('down')
      }
      // a,q or left arrow
      if (e.code === keyMapping.left || e.keyCode === 37) {
        this.keyState.left = 1
        window.app.debug('left')
      }
      // d or right arrow
      if (e.code === keyMapping.right || e.keyCode === 39) {
        this.keyState.right = 1
        window.app.debug('right')
      }
      // space
      if (eval.keyCode === 32) {
        this.keyState.space = true
      }
    })

    document.addEventListener('keyup', e => {
      //console.log('keyup', event)
      if (e.code === keyMapping.up || e.keyCode === 38) {
        this.keyState.up = 0
      }
      if (e.code === keyMapping.down || e.keyCode === 40) {
        this.keyState.down = 0
      }
      if (e.code === keyMapping.left || e.keyCode === 37) {
        this.keyState.left = 0
      }
      if (e.code === keyMapping.right || e.keyCode === 39) {
        this.keyState.right = 0
      }
      if (e.keyCode === 32) {
        this.keyState.space = 0
      }
    })

    document.addEventListener('mousemove', e => {
      this.keyState.mx = e.clientX
      this.keyState.my = e.clientY
      if (this.onmousemove) {
        this.onmousemove(e)
      }
    })

    document.addEventListener('pointerdown', e => {
      this.keyState.mouseDown = true
    })


    document.addEventListener('mouseup', e => {
      this.keyState.mouseDown = false
    })
  }

}

export default InputSystem