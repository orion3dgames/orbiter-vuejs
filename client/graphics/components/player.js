import MoveCommand from '../../../common/command/MoveCommand'
import CubeCommand from "../../../common/command/CubeCommand";

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

            // IF MOUSE PRESSED
            if (keyState.mouseDown) {
                const clickTime = new Date().getTime();
                if (clickTime - this.latestCubePlacedTime > 500 && this.game.cubeAdded) {
                    this.latestCubePlacedTime = clickTime;
                    console.log('CubeCommand', 'Click event fired...', this.game.cubeAdded);
                    this.nengiClient.addCommand(new CubeCommand(this.game.cubeAdded.x, this.game.cubeAdded.y, this.game.cubeAdded.z));
                    this.game.cubeAdded = null;
                }
            }
        }

    },

});