<template>
  <div class="game-container">
    <div class="game-header">
      HEADER AREA
    </div>
    <slot />
  </div>
</template>

<script>
export default {
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
  methods: {
    logout() {
      this.$store.dispatch('logout');
    },
  }
};

export class Default {

}
</script>

