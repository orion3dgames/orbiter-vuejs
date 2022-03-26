<template>
    <div class="container">
      <div v-if="user">
        <header class="pt-2">
          <div class="row">
            <div class="col">
              <h3 class="m-0 d-inline-block me-2">
                <router-link to="/" class="">{{ appTitle }}</router-link>
              </h3>
              <span class="badge bg-secondary">{{ appVersion }}</span>
            </div>
            <div class="col text-end">
              <div class="p-2">
                Hi <router-link to="/profile"><b>{{ user.displayName}}</b></router-link>
                <br><small>{{ user.uid}}</small>
              </div>
            </div>
          </div>
        </header>

        <hr />

        <slot />

        <footer>
          <hr />
          FOOTER
        </footer>
      </div>
      <div v-else>
        <div class="spinner-border" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>
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

