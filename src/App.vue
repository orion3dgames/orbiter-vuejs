<template>
  <div id="app">
    <component :is="layout">
      <router-view />
    </component>
  </div>
</template>

<script>
const default_layout = "default";

export default {
  name: "App",
  computed: {
    layout() {
      return (this.$route.meta.layout || default_layout) + "_layout";
    },
  },
  mounted: function () {
    window.app.version = this.$store.getters.appVersion;
    this.$store.dispatch("fetchUser");
    this.$store.dispatch("fetchSessions");

    window.app.debug("version " + window.app.version);
  },
};
</script>

<style></style>
