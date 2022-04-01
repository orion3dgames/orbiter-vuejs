window.AFRAME.registerComponent('thumbstick-logging', {
    init: function () {
        console.log('thumbstick-logging init')
        this.el.addEventListener('thumbstickmoved', this.logThumbstick);
    },
    logThumbstick: function (e) {
        window.app.gameClient.input.keyState.down = e.detail.y > 0.95;
        window.app.gameClient.input.keyState.up = e.detail.y < -0.95;
        window.app.gameClient.input.keyState.left = e.detail.x < -0.95;
        window.app.gameClient.input.keyState.right = e.detail.x > 0.95;

        if (e.detail.y > 0.95) {
            console.log("DOWN");
            window.app.debug('DOWN')
        }
        if (e.detail.y < -0.95) {
            console.log("UP");
            window.app.debug('UP')
        }
        if (e.detail.x < -0.95) {
            console.log("LEFT");
            window.app.debug('LEFT')
        }
        if (e.detail.x > 0.95) {
            console.log("RIGHT");
            window.app.debug('RIGHT')
        }
    }
});