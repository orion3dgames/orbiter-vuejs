<template>
  <div v-if="session">

    <div class="game-area">

      <a-scene class="aframe-scene" embedded>
        <a-assets>
          <a-asset-item id="thing" src="thing.dae"></a-asset-item>
        </a-assets>
        <a-entity position="0 0 5">
          <a-camera wasd-controls-enabled=true fov=60 near=0.1 far=10000>
            <a-cursor></a-cursor>
            <a-entity cursor raycaster="far: 20; interval: 1000; objects: .clickable"></a-entity>
          </a-camera>
        </a-entity>
        <a-entity id="scene">
          <my-sphere v-for="n in offsetNumbers" v-bind:distance="n" :key="n"></my-sphere>
        </a-entity>
      </a-scene>

    </div>
    <div class="game-sidebar">
      fdsf
      <game-sidebar v-bind:session="session" v-bind:user="user"></game-sidebar>
    </div>
  </div>

</template>

<script>

import MySphere from '../components/MySphere';
import GameSidebar from '../components/GameSidebar';

require('aframe');

export default {
  name: 'Play',
  components: {
    MySphere,
    GameSidebar,
  },
  data() {
    return {
      chat_message: '',
      offsetNumbers: [0,1,-1],
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

  },
  updated: function () {

    // IF CREATOR DELETE GAME SESSION, THEN REDIRECT TO HOMEPAGE
    if(!this.session){
      this.$router.push('/');
    }

  },
  methods: {
    squareClick(index){

    },
  }
}
</script>