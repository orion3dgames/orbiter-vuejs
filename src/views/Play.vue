<template>
  <div class="game-area">
    <div class="game-loading" id="screen-connecting">
      Connecting to server...
    </div>
    <a-scene
      class="aframe-scene"
      loading-screen="dotsColor: red; backgroundColor: black"
      embedded
    >
      <a-assets>
        <!--<a-asset-item id="leftHand" src="../../client/assets/leftHandLow.glb"></a-asset-item>
        <a-asset-item id="rightHand" src="../../client/assets/rightHandLow.glb"></a-asset-item>-->
        <img
          id="groundTexture"
          src="/assets/floor_grid.jpg"
          crossorigin="anonymous"
        />
        <a-mixin
          id="voxel"
          geometry="primitive: box; height: 1; width: 1; depth: 1"
          material="shader: standard"
          snap="offset: 0.50 0.50 0.50; snap: 1 1 1"
          shadow="receive: true; cast:true;"
          grabbable
          stretchable
          draggable
          dropppable
        ></a-mixin>
      </a-assets>

      <a-entity light="type: ambient; intensity: 0.5;"></a-entity>
      <a-entity
        light="type: directional;
                 castShadow: true;
                 intensity: 0.4;
                 shadowCameraVisible: true;"
        position="-5 20 1.5"
      ></a-entity>

      <a-sky color="#CCC"></a-sky>
      <a-plane
        position="0 0 0"
        rotation="-90 0 0"
        width="100"
        height="100"
        color="#EEE"
        src="#groundTexture"
        repeat="1 1"
        shadow="receive: true"
      ></a-plane>
    </a-scene>
  </div>
</template>

<script>
import GameClient from "../../client/GameClient";

export default {
  name: "Play",
  components: {
    //GameSidebar,
  },
  data() {
    return {
      chat_message: "",
      offsetNumbers: [0, 1, -1],
      players: [],
    };
  },
  computed: {
    user() {
      return this.$store.getters.user;
    },
  },
  mounted: function () {
    // WAIT FOR LOADING
    setTimeout(function () {
      // run game server
      window.app.gameClient = new GameClient();
      if (!window.app.gameClient.playerLoaded) {
        let tick = 0;
        let previous = performance.now();
        const loop = function () {
          window.requestAnimationFrame(loop);
          const now = performance.now();
          const delta = (now - previous) / 1000;
          previous = now;
          tick++;
          window.app.gameClient.update(delta, tick, now);
        };

        loop();
      }
    }, 5000); // ah ouais quand même
  },

  methods: {
    squareClick(index) {},
  },
};
</script>