<template>
  <main class="login">
    <section class="forms">

      <form class="register" @submit.prevent="register">
        <h2>Register</h2>
        <input
            type="email"
            placeholder="Email address"
            v-model="register_form.email" />
        <input
            type="password"
            placeholder="Password"
            v-model="register_form.password" />
        <input
            type="submit"
            value="Register" />
      </form>

      <form class="login" @submit.prevent="login">
        <h2>Login</h2>
        <input
            type="email"
            placeholder="Email address"
            v-model="login_form.email" />
        <input
            type="password"
            placeholder="Password"
            v-model="login_form.password" />
        <input
            type="submit"
            value="Login" />
      </form>

    </section>
  </main>
</template>

<script>

export default {
  data() {
    return {
      login_form: {
        email: "",
        password: ""
      },
      register_form: {
        email: "",
        password: ""
      },
      error: null
    };
  },
  methods: {
    login() {
      this.$store.dispatch('login', this.login_form);
    },
    register() {
      this.$store.dispatch('register', this.register_form).then((result) => {
        console.log(result);
      });
    }
  }
};
</script>