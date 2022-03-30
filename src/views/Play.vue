<template>
  <div class="game-area">
    <div class="game-header">
      <div class="float-end">
        <a href="/" class="btn btn-sm btn-secondary">Quit Game</a>
      </div>
      Logged in as {{user.displayName}}
    </div>
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
        <a-asset-item id="rightHand" src="../../client/assets/rightHandLow.glb"></a-asset-item>-
        -->
        <img
            id="crateTexture"
            src="../../client/assets/crate.jpg"
            crossorigin="anonymous"
        />
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

    </a-scene>
  </div>
</template>

<script>
import GameClient from "../../client/GameClient";

export default {
  name: "Play",
  components: {

  },
  data() {
    return {
      chat_message: "",
      offsetNumbers: [0, 1, -1],
      players: [],
    };
  },
  computed: {
    appTitle() {
      return this.$store.getters.appTitle;
    },
    appDescription() {
      return this.$store.getters.appDescription;
    },
    appVersion() {
      return this.$store.getters.appVersion;
    },
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

        // loop
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