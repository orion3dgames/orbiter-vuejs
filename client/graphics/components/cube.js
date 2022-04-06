import MsgCommand from "../../../common/command/MsgCommand";
import Utils from "../../Utils";
import CubeCommand from "../../../common/command/CubeCommand";

window.AFRAME.registerComponent("cube", {
    dependencies: ['material'],
    init: function () {

        const el = this.el;
        const keyState = window.app.gameClient.input.keyState;

        el.addEventListener("click", function (evt) {

            // REMOVE CUBE
            if (keyState.mouseType === 'right') {
                let nid = el.getAttribute('nid');
                let intersected = evt.target;
                let intersectedType = intersected.getAttribute('type');
                if (intersectedType === 'standard') {
                    window.app.gameClient.client.addCommand(new MsgCommand('remove_cube', { nid: nid }));
                    console.log('delete cube', nid)
                }
            }

            // ADD CUBE
            if (keyState.mouseType === 'left') {
                let intersected = evt.target;
                let intersectedType = intersected.getAttribute('type');
                let faceIndex = evt.detail.intersection.face?.materialIndex;
                let currentPoint = Object.assign({}, intersected.object3D.position); // save original ray point just in case
                let adjustedPoint = Utils.adjustPosition(faceIndex, currentPoint, intersectedType)
                window.app.gameClient.client.addCommand(new CubeCommand(adjustedPoint.x,adjustedPoint.y, adjustedPoint.z));
            }

        });

        el.addEventListener("raycaster-intersection", function (evt) {
            console.log('raycaster-intersection', evt);
        });

        // ADD HOVER COLOR CHANGE TO CUBES
        // Not working very well ????
        // investigate

        const mesh = el.getObject3D('mesh');
        let color = el.getAttribute('material').color;
        mesh.material = [
            new window.THREE.MeshLambertMaterial({ color: new window.THREE.Color(color) }),
            new window.THREE.MeshLambertMaterial({ color: new window.THREE.Color(color) }),
            new window.THREE.MeshLambertMaterial({ color: new window.THREE.Color(color) }),
            new window.THREE.MeshLambertMaterial({ color: new window.THREE.Color(color) }),
            new window.THREE.MeshLambertMaterial({ color: new window.THREE.Color(color) }),
            new window.THREE.MeshLambertMaterial({ color: new window.THREE.Color(color) }),
        ];
        let faceIndex = 0;

        el.addEventListener("mouseenter", function (evt) {
            faceIndex = evt.detail.intersection.face.materialIndex;
            window.app.debug('faceIndex ' + faceIndex)
            const darkerColor = Utils.darkerColor(color, -0.9);
            mesh.material[faceIndex] = new window.THREE.MeshLambertMaterial({color: new window.THREE.Color(0xffffff)});
        });

        el.addEventListener("mouseleave", function (evt) {
            mesh.material[faceIndex] = new window.THREE.MeshLambertMaterial({color: new window.THREE.Color(color)});
        });

    }
});