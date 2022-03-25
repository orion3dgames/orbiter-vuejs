window.AFRAME.registerComponent('thumbstick-logging', {
    init: function () {
        console.log('thumbstick-logging init')
        this.el.addEventListener('thumbstickmoved', this.logThumbstick);
    },
    logThumbstick: function (evt) {
        if (evt.detail.y > 0.95) {
            console.log("DOWN");
            window.app.debug('DOWN')
            window.app.gameClient.frameState.s = true
        }
        if (evt.detail.y < -0.95) {
            console.log("UP");
            window.app.debug('UP')
            window.location.reload()
            window.app.gameClient.frameState.w = true
        }
        if (evt.detail.x < -0.95) {
            console.log("LEFT");
            window.app.debug('LEFT')
            window.app.gameClient.frameState.a = true
        }
        if (evt.detail.x > 0.95) {
            console.log("RIGHT");
            window.app.debug('RIGHT')
            window.app.gameClient.input.frameState.d = true
        }
    }
});