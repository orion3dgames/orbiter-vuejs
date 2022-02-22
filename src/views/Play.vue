<template>
  <div v-if="session">

    <div class="game-area">

      <a-scene class="aframe-scene" embedded>
        <a-assets>
          <img id="groundTexture" src="https://cdn.aframe.io/a-painter/images/floor.jpg" crossorigin="anonymous" />
          <img id="skyTexture" src="https://cdn.aframe.io/a-painter/images/sky.jpg" crossorigin="anonymous" />
          <a-mixin id="sun" geometry="primitive: sphere; radius: 1.5" material="color: #FFD; shader: flat" light="color: #FFD; distance: 120; intensity: 1; type: point; castShadow: false; shadowCameraVisible: false;"></a-mixin>
          <a-asset-item id="car" src="/glTF/free_car_001.gltf"></a-asset-item>
          <a-asset-item id="wooden-crate" src="/glTF/wooden_crate.glb"></a-asset-item>
          <a-asset-item id="thing" src="thing.dae"></a-asset-item>
        </a-assets>

        <a-entity position="0 0 5">
          <a-camera wasd-controls-enabled=true fov=60 near=0.1 far=10000>
            <a-cursor></a-cursor>
            <a-entity cursor raycaster="far: 20; interval: 1000; objects: .clickable"></a-entity>
          </a-camera>
        </a-entity>

        <!-- players -->
        <a-entity
            v-for="player in session.players" :key="player.uid"
            :position="player.position.x+' '+player.position.y+''+player.position.z"
            :rotation="player.rotation.x+' '+player.rotation.y+''+player.rotation.z">
          <a-box shadow position="0 -1 0.05" class="collidable" material="color: #333" width="0.4" height="1.5" depth="0.2"
                 ammo-body="type: kinematic; emitCollisionEvents: true;" ammo-shape="type: box"></a-box>
        </a-entity>

        <!-- spheres-->
        <a-entity id="scene">
          <my-sphere v-for="n in offsetNumbers" v-bind:distance="n" :key="n"></my-sphere>
        </a-entity>

        <!-- moving orange -->
        <a-box position="0 0.5 -10" rotation="0 0 0" color="#F90" shadow velocity="1 0 0" toggle-velocity="axis: x; min: -10; max: 10;" ammo-body="type: kinematic; emitCollisionEvents: true;" ammo-shape="type: box" width="1" height="1" depth="1"></a-box>

        <!-- ground -->
        <a-cylinder id="ground" shadow="cast: false; receive: true" ammo-body="type: static" ammo-shape="type: cylinder" class="collidable spawnable" src="#groundTexture" radius="32" height="0.1"></a-cylinder>

        <a-sky id="bg" radius="30" src="#skyTexture" theta-length="90"></a-sky>

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