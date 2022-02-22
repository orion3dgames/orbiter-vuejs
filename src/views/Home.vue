<template>
  <div >

    <div v-if="user">
      <button @click="createGame()" class="btn btn-primary">Start New Game</button>

      <div v-if="mysessions.length > 0">
        <hr />
        <h5>Your Ongoing Games</h5>
        <table class="table table-sm table-bordered">
          <thead>
            <tr>
              <th>Game</th>
              <th>Creator</th>
              <th></th>
            </tr>
          </thead>
          <tbody v-for="session in mysessions" :key="session.uid">
            <tr>
              <td>{{session.uid}}</td>
              <td>{{session.creator.displayName}}</td>
              <td class="text-end">
                <button @click="reJoinGame(session.uid)" class="btn btn-primary">Rejoin</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div>
        <hr />
        <h5>All Games</h5>
        <table class="table table-sm table-bordered" v-if="allsessions.length > 0">
          <thead>
            <tr>
              <th>Game</th>
              <th>Creator</th>
              <th></th>
            </tr>
          </thead>
          <tbody v-for="session in allsessions" :key="session.uid">
            <tr>
              <td>{{session.uid}}</td>
              <td>{{session.creator.displayName}}</td>
              <td class="text-end">
                <button @click="joinGame(session.uid)" class="btn btn-primary">JOIN</button>
              </td>
            </tr>
          </tbody>
        </table>
        <div v-else>
          <div class="alert bg-light">No games available...</div>
        </div>

      </div>
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
      allsessions: "allsessions",
      mysessions: "mysessions",
    })
  },
  mounted: function () {

  },
  methods: {

    createGame(){
      this.$store.dispatch('addSession').then(session => {
        router.push('/play/#'+session.uid);
      });
    },

    joinGame(hash){
      this.$store.dispatch('joinSession', hash).then(session => {
        this.$router.push({ path: 'play/#'+hash });
      });
    },

    reJoinGame(hash){
      this.$router.push({ path: 'play/#'+hash });
    },

  },
}
</script>