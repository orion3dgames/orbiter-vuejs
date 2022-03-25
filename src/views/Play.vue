<template>
  <div v-if="session">
    <div class="game-area">
      <a-scene class="aframe-scene" embedded>

        <a-assets>
          <img id="groundTexture" src="/assets/floor_grid.jpg" crossorigin="anonymous" />
          <a-mixin id="voxel"
                   geometry="primitive: box; height: 0.5; width: 0.5; depth: 0.5"
                   material="shader: standard"
                   snap="offset: 0.25 0.25 0.25; snap: 0.5 0.5 0.5"
                   shadow="receive: true; cast:true;"
          ></a-mixin>
        </a-assets>

        <a-entity light="type: ambient; intensity: 0.5;"></a-entity>
        <a-entity light="type: directional;
                   castShadow: true;
                   intensity: 0.4;
                   shadowCameraVisible: true;"
                  position="-5 3 1.5"></a-entity>

        <a-sky color="#CCC"></a-sky>
        <a-plane position="0 0 0" rotation="-90 0 0" width="100" height="100" color="#EEE" src="#groundTexture" repeat="1 1" shadow="receive: true"></a-plane>

      </a-scene>
    </div>
    <!--
    <div class="game-sidebar">
      <game-sidebar v-bind:session="session" v-bind:user="user"></game-sidebar>
      {{session}}
    </div>
    -->
  </div>

</template>

<script>

//import GameSidebar from '../components/UI/GameSidebar';
import GameClient from '../../client/GameClient';

export default {
  name: 'Play',
  components: {
    //GameSidebar,
  },
  data() {
    return {
      chat_message: '',
      offsetNumbers: [0,1,-1],
      players: []
    }
  },
  computed: {
    hash() {
      return this.session.uid;
    },
    session() {
      return this.$store.getters.session(location.hash.replace('#',''));
    },
    user() {
      return this.$store.getters.user;
    }
  },
  mounted: function () {

    // WAIT FOR LOADING
    setTimeout(function() {

      // run game server
      const gameClient = new GameClient(this.user)
      let tick = 0
      let previous = performance.now()
      const loop = function() {
        window.requestAnimationFrame(loop)
        const now = performance.now()
        const delta = (now - previous) / 1000
        previous = now
        tick++
        gameClient.update(delta, tick, now)
      }

      loop()

    }, 2000);

  },

  methods: {
    squareClick(index){

    },
  }
}
</script>