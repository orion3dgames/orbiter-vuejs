<template>
  <div>

    <h5>Leaderboard (TOP 10 Players)</h5>

    <hr />

    <table class="table table-sm table-bordered">
      <thead>
        <tr>
          <th>#</th>
          <th>Player Name</th>
          <th>Score</th>
        </tr>
      </thead>
      <tbody v-for="(player, index) in players.slice().reverse()" :key="player.uid">
        <tr>
          <td>{{ (index + 1)}}</td>
          <td>{{player.displayName}}</td>
          <td class="text-end">{{player.score}}</td>
        </tr>
      </tbody>
    </table>

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
      players: "players",
    })
  },
  mounted: function () {
    this.$store.dispatch('fetchPlayers');
  },
  methods: {

    updateProfileName(name){

    },

  },
}
</script>