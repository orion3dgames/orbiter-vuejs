<template>
  <div v-if="session">
    <div class="game-area">
      <a-scene class="aframe-scene" embedded>

        <a-assets>
          <img id="groundTexture" src="/assets/floor_grid.jpg" crossorigin="anonymous" />
        </a-assets>

        <a-sky color="#CCC"></a-sky>
        <a-plane position="0 0 0" rotation="-90 0 0" width="100" height="100" color="#EEE" src="#groundTexture" repeat="1 1"></a-plane>

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

import MySphere from '../components/MySphere';
//import GameSidebar from '../components/UI/GameSidebar';
import GameClient from '../../client/GameClient';

import nengi from 'nengi';
import config from '../../common/nengiConfig';

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

    let that = this;
    console.log('MOUNTED');

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