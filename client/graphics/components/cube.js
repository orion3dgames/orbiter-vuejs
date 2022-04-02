import MsgCommand from "../../../common/command/MsgCommand";

window.AFRAME.registerComponent("cube", {
    dependencies: ['material'],
    init: function () {

        const el = this.el;
        const keyState = window.app.gameClient.input.keyState;

        el.addEventListener("click", function (evt) {
            if(keyState.mouseType === 'right'){
                let nid = el.getAttribute('nid');
                window.app.gameClient.client.addCommand(new MsgCommand('remove_cube', {nid: nid}));
                console.log('delete cube', nid)
            }
        });

        // ADD HOVER COLOR CHANGE TO CUBES
        if (el.getAttribute("type") === 'standard') {
            const mesh = el.getObject3D('mesh');
            let color = el.getAttribute('material').color;
            mesh.material = [
                new window.THREE.MeshLambertMaterial({color: new window.THREE.Color(color)}),
                new window.THREE.MeshLambertMaterial({color: new window.THREE.Color(color)}),
                new window.THREE.MeshLambertMaterial({color: new window.THREE.Color(color)}),
                new window.THREE.MeshLambertMaterial({color: new window.THREE.Color(color)}),
                new window.THREE.MeshLambertMaterial({color: new window.THREE.Color(color)}),
                new window.THREE.MeshLambertMaterial({color: new window.THREE.Color(color)}),
            ];
            let faceIndex = 0;
            el.addEventListener("mouseenter", function (evt) {
                //faceIndex = evt.detail.intersection.face.materialIndex;
                //const darkerColor = pSBC(-0.9, color);
                //mesh.material[faceIndex] = new window.THREE.MeshLambertMaterial({color: new window.THREE.Color(darkerColor)});
            });
            el.addEventListener("mouseleave", function (evt) {
               //mesh.material[faceIndex] = new window.THREE.MeshLambertMaterial({color: new window.THREE.Color(color)});
            });
        }
    }
});