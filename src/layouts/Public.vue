<template>
  <div class="container">

    <header class="pt-2">
      <h3 class="m-0">{{ appTitle }} <span class="badge bg-secondary">{{ appVersion }}</span></h3>
    </header>

    <hr />

    <slot />

    <footer>
      <hr />
      FOOTER
    </footer>
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
      return this.$store.getters.currentUser;
    },
  },

  components: {

  }
};

export class Default {

}
</script>

