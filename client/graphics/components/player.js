import MoveCommand from '../../../common/command/MoveCommand'

window.AFRAME.registerComponent('player-body', {
    init() {
        console.log('player-body component init');
        this.game = window.app.gameClient;
        this.game.playerLoaded = true;
        this.nengi = this.game.client;
    },
    tick(time, timeDelta) {
        this.do(timeDelta);
    },
    do(time, delta) {
        const input = this.game.input.frameState;
        const rotation = this.game.renderer.cameraEl ? this.game.renderer.cameraEl.getAttribute('rotation').y : 0;
        this.nengi.addCommand(new MoveCommand(input.w, input.a, input.s, input.d, input.space, rotation, delta))
        this.game.update(delta);
    }
});