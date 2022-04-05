import MoveCommand from '../../../common/command/MoveCommand'

window.AFRAME.registerComponent('player-body', {
    init() {
        console.log('player-body component init');
        this.game = window.app.gameClient;
        this.game.playerLoaded = true;
        this.nengiClient = this.game.client;
        this.latestCubePlacedTime = new Date().getTime();
    },
    tick(time, timeDelta) {
        if (this.game.isloaded) {
            const keyState = this.game.input.keyState;
            const rotation = this.game.renderer.cameraEl ? this.game.renderer.cameraEl.getAttribute('rotation').y : 0;
            this.nengiClient.addCommand(new MoveCommand(keyState.up, keyState.left, keyState.down, keyState.right, keyState.space, rotation, timeDelta))
            this.game.update(timeDelta);
        }

    },

});