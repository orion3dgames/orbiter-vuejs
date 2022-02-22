<template>
  <a-sphere radius=".5" v-bind:color="color" v-bind:position="pos" v-on:click="clicked"></a-sphere>
</template>

<style>

</style>

<script>
export default {
  props: ['distance'],
  computed: {
    pos () {
      return `${this.distance} 0 -4`;
    }
  },
  data: function(){
    return {
      color:"#EF2D5E"
    }
  },
  methods: {
    clicked: function(){
      this.color="#00FF00"
    }
  }
};
</script>
