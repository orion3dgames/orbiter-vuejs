<template>
  <div v-if="session">
    <div class="game-area">
      <a-scene class="aframe-scene" embedded>
        <a-assets>
          <img id="groundTexture" src="https://cdn.aframe.io/a-painter/images/floor.jpg" crossorigin="anonymous" />
          <img id="skyTexture" src="https://cdn.aframe.io/a-painter/images/sky.jpg" crossorigin="anonymous" />
        </a-assets>
        <a-sky id="bg" radius="30" src="#skyTexture" theta-length="90"></a-sky>
        <a-cylinder id="ground" shadow="cast: false; receive: true" ammo-body="type: static" ammo-shape="type: cylinder" class="collidable spawnable" src="#groundTexture" radius="32" height="0.1"></a-cylinder>

        <!-- PLAYER -->
        <a-entity id="player" player wasd-controls="fly: true" position="0 0 0" rotation="0 0 0">
          <!-- camera -->
          <a-entity id="camera" camera look-controls player-head position="0 0.5 1" rotation="0 0 0"></a-entity>
        </a-entity>

      </a-scene>
    </div>
    <div class="game-sidebar">
      <game-sidebar v-bind:session="session" v-bind:user="user"></game-sidebar>
      {{session}}
    </div>
  </div>

</template>

<script>

import MySphere from '../components/MySphere';
import GameSidebar from '../components/UI/GameSidebar';
import GameClient from '../../client/GameClient';

import nengi from 'nengi';
import config from '../../common/nengiConfig';

export default {
  name: 'Play',
  components: {
    GameSidebar,
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

      // construct the client
      const client = new nengi.Client(config, 100);

      // connection callback
      client.onConnect(res => {
        console.log('nengi: onConnect response:', res);
      });

      // connection closed callback
      client.onClose(() => {
        console.log('nengi: connection closed');
      });

      // connect to a server
      client.connect('ws://localhost:8079', {});

      // run game server
      const gameClient = new GameClient()
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