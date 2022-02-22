<template>
  <div>
    <div class="btn-group w-100" role="group" aria-label="Game Options Buttons">
      <button @click="leaveGame(session.uid)" class="btn btn-outline-danger" v-if="session.challenger && session.challenger.uid === user.uid">Leave</button>
      <button @click="deleteGame(session.uid)" class="btn btn-outline-secondary" v-if="session.creator.uid === user.uid">Cancel</button>
      <button @click="startGame(session.uid)" class="btn btn-primary" v-if="(session.challenger && session.creator) && session.started === 0">Start</button>
    </div>

    <hr>

    <h5>Players</h5>
    <hr>
    <table class="table table-bordered table-sm">
      <tbody>
      <tr>
        <th>{{ session.creator.displayName }}</th>
        <td class="text-center" width="100">{{ session.creator.score }}</td>
      </tr>
      <tr v-if="session.challenger">
        <th>{{ session.challenger.displayName }}</th>
        <td class="text-center">{{ session.challenger.score }}</td>
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
