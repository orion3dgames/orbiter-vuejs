<template>
  <div class="game-container">
    <div class="game-header">
      <div class="float-end">
        <a href="/" class="btn btn-sm btn-secondary">Quit Game</a>
      </div>
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

  }
};

export class Default {

}
</script>

