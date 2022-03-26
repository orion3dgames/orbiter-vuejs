<template>
  <div v-if="user">

    <h5>Profile</h5>

    <div class="form-floating mb-3">
      <input type="email" class="form-control" id="floatingInput" placeholder="username" v-model="user.displayName">
      <label for="floatingInput">Profile Name</label>
    </div>

    <button @click="updateProfileName()" class="btn btn-primary">Update Profile</button>

    <hr>

    <button @click="logout()" class="btn btn-sm btn-secondary">Logout</button>

  </div>
</template>

<script>

import { mapGetters } from "vuex";
import router from "../router";

export default {
  name: 'Profile',
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

    updateProfileName(name){
      if(this.user.displayName.length < 1) return false;
      this.$store.dispatch('updateProfileName', this.user.displayName);
      //this.$store.dispatch('updateProfile', this.user);
    },

    logout() {
      this.$store.dispatch('logout');
    },

  },
}
</script>