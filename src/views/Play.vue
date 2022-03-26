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
          geometry="primitive: box; height: 0.5; width: 0.5; depth: 0.5"
          material="shader: standard"
          snap="offset: 0.25 0.25 0.25; snap: 0.5 0.5 0.5"
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
        position="-5 3 1.5"
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
      let tick = 0;
      let previous = performance.now();

      // const loop = function () {
      //   window.requestAnimationFrame(loop);
      //   const now = performance.now();
      //   const delta = (now - previous) / 1000;
      //   previous = now;
      //   tick++;
      //   window.app.gameClient.update(delta, tick, now);
      // };

      // loop();

      let xrSession = null;

      function onWindowAnimationFrame(time) {
        window.requestAnimationFrame(onWindowAnimationFrame);

        // This may be called while an immersive session is running on some devices,
        // such as a desktop with a tethered headset. To prevent two loops from
        // rendering in parallel, skip drawing in this one until the session ends.
        if (!xrSession) {
          renderFrame(time, null);
        }
      }

      // The window animation loop can be started immediately upon the page loading.
      window.requestAnimationFrame(onWindowAnimationFrame);

      function onXRAnimationFrame(time, xrFrame) {
        xrSession.requestAnimationFrame(onXRAnimationFrame);
        renderFrame(time, xrFrame);
      }

      function renderFrame(time, xrFrame) {
        // Shared rendering logic.
        const now = performance.now();
        const delta = (now - previous) / 1000;
        previous = now;
        tick++;
        window.app.gameClient.update(delta, tick, now);
      }

      // Assumed to be called by a user gesture event elsewhere in code.
      function startXRSession() {
        navigator.xr.requestSession("immersive-vr").then((session) => {
          xrSession = session;
          xrSession.addEventListener("end", onXRSessionEnded);
          // Do necessary session setup here.
          // Begin the session's animation loop.
          xrSession.requestAnimationFrame(onXRAnimationFrame);
        });
      }

      function onXRSessionEnded() {
        xrSession = null;
      }
    }, 5000); // ah ouais quand même
  },

  methods: {
    squareClick(index) {},
  },
};
</script>