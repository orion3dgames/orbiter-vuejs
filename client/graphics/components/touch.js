window.AFRAME.registerComponent('thumbstick-logging', {
    init: function () {
        console.log('thumbstick-logging init')
        this.el.addEventListener('thumbstickmoved', this.logThumbstick);
    },
    logThumbstick: function (e) {
        const limite = 0.1;
        window.app.gameClient.input.keyState.up = e.detail.y < -limite ? -e.detail.y : 0;
        window.app.gameClient.input.keyState.down = e.detail.y > limite ? e.detail.y : 0;
        window.app.gameClient.input.keyState.left = e.detail.x < -limite ? -e.detail.x : 0;
        window.app.gameClient.input.keyState.right = e.detail.x > limite ? e.detail.x : 0;

        if (e.detail.y > limite) {
            console.log("DOWN " + e.detail.y);
            window.app.debug("DOWN " + e.detail.y)
        }
        if (e.detail.y < -limite) {
            console.log("UP" + e.detail.y);
            window.app.debug('UP' + e.detail.y)
        }
        if (e.detail.x < -limite) {
            console.log("LEFT" + e.detail.x);
            window.app.debug('LEFT' + e.detail.x)
        }
        if (e.detail.x > limite) {
            console.log("RIGHT" + e.detail.x);
            window.app.debug('RIGHT' + e.detail.x)
        }
    }
});