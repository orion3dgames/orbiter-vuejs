window.AFRAME.registerComponent('thumbstick-logging', {
    init: function () {
        this.el.addEventListener('thumbstickmoved', this.logThumbstick);
    },
    logThumbstick: function (evt) {
        if (evt.detail.y > 0.95) {
            console.log("DOWN");
            global.app.debug('DOWN')
            global.app.gameClient.frameState.s = true
        }
        if (evt.detail.y < -0.95) {
            console.log("UP");
            global.app.debug('UP')
            window.location.reload()
            global.app.gameClient.frameState.w = true
        }
        if (evt.detail.x < -0.95) {
            console.log("LEFT");
            global.app.debug('LEFT')
            global.app.gameClient.frameState.a = true
        }
        if (evt.detail.x > 0.95) {
            console.log("RIGHT");
            global.app.debug('RIGHT')
            global.app.gameClient.input.frameState.d = true
        }
    }
});