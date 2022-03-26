<template>
  <div >

    <div v-if="user">
      <button @click="joinGame()" class="btn btn-primary">Join Game</button>
    </div>


  </div>
</template>

<script>

import { mapGetters } from "vuex";
import router from "../router";

export default {
  name: 'Home',
  components: {

  },
  data() {
    return {
      test: 1,
    }
  },
  computed: {
    ...mapGetters({
      user: "user",
    })
  },
  mounted: function () {

  },
  methods: {

    joinGame(hash){
      this.$router.push({ path: 'play/' });
    },

  },
}
</script>