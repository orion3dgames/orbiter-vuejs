<template>
  <div>
    <div class="btn-group w-100" role="group" aria-label="Game Options Buttons">
      <button @click="leaveGame(session.uid)" class="btn btn-outline-danger" v-if="isUserInSession && session.creator.uid !== user.uid">Leave</button>
      <button @click="deleteGame(session.uid)" class="btn btn-outline-secondary" v-if="session.creator.uid === user.uid">Delete Session</button>
    </div>

    <hr>

    <h5>Players Online</h5>
    <hr>
    <table class="table table-bordered table-sm">
      <tbody>
        <tr v-for="(player, index) in session.players" :key="index">
          <th>{{ player.displayName }}</th>
        </tr>
      </tbody>
    </table>

    <h5>Chat</h5>
    <hr>
    <ul class="list-unstyled">
      <li v-for="(msg, index) in session.messages" :key="index">
        <b><small class="text-muted">{{ msg.name }}</small></b>: {{ msg.message }}
      </li>
    </ul>
    <form class="row row-cols-lg-auto g-3 align-items-center" @submit.prevent="sendMessage">
      <div class="input-group mb-3">
        <input type="text" class="form-control" v-model="chat_message" placeholder="Message">
        <button type="submit" class="btn btn-primary">Send</button>
      </div>
    </form>
  </div>
</template>

<style>

</style>

<script>
export default {
  props: ['session','user'],
  data: function(){
    return {
      chat_message:""
    }
  },
  computed: {
    isUserInSession() {
      return this.$store.getters.isUserInSession(this.session.uid);
    },
  },
  methods: {
    leaveGame(uid){
      this.$store.dispatch('leaveSession', uid);
    },
    deleteGame(uid){
      this.$store.dispatch('deleteSession', uid);
    },
    startGame(uid){
      this.$store.dispatch('startGame', uid);
    },
    sendMessage: function(){
      this.$store.dispatch('addMessage', {
        'session_id': this.session.uid,
        'message': this.chat_message,
        'name': this.user.displayName,
      });
      this.chat_message = '';
    }
  }
};
</script>
