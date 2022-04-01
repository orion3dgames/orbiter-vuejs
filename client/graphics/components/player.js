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

            const input = this.game.input;
            const rotation = this.game.renderer.cameraEl ? this.game.renderer.cameraEl.getAttribute('rotation').y : 0;
            this.nengiClient.addCommand(new MoveCommand(input.frameState.w, input.frameState.a, input.frameState.s, input.frameState.d, input.frameState.space, rotation, timeDelta))
            // this.game.update(timeDelta);

            // IF MOUSE PRESSED
            if (input.frameState.mouseDown) {
                const clickTime = new Date().getTime();
                if (clickTime - this.latestCubePlacedTime > 500 && this.game.cubeAdded) {
                    this.latestCubePlacedTime = clickTime;
                    console.log('CubeCommand', 'Click event fired...', this.game.cubeAdded);
                    this.nengiClient.addCommand(new CubeCommand(this.game.cubeAdded.x, this.game.cubeAdded.y, this.game.cubeAdded.z));
                    this.game.cubeAdded = null;
                }
            }

            input.releaseKeys()
        }

    },

});