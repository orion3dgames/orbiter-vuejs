import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
const usernameGen = require("username-gen");

import router from '../router'

import { auth, database } from '../firebase'
import {
  signOut,
  updateProfile,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword
} from 'firebase/auth'
import {
  ref,
  set,
  push,
  onValue,
  remove,
  update,
  increment,
  orderByChild,
  query,
  limitToLast
} from 'firebase/database'

function formatSessionPlayer(user){
  return {
    uid: user.uid,
    displayName: user.displayName,
    email: user.email,
    score: 0,
    symbol: user.symbol,
  };
}

const WINNING_CONDITIONS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
];

function checkForWinners(gameState) {
  let roundWon = false;
  for (let i = 0; i <= 7; i++) {
    const winCondition = WINNING_CONDITIONS[i];
    let a = gameState[winCondition[0]];
    let b = gameState[winCondition[1]];
    let c = gameState[winCondition[2]];
    if (a === '' || b === '' || c === '') {
      continue;
    }
    if (a === b && b === c) {
      roundWon = true;
      break
    }
  }
  return roundWon;
}

export default new Vuex.Store({

  state: {
    appTitle: process.env.VUE_APP_TITLE || 'NO TITLE FOUND IN MANIFEST.JSON',
    appDescription: process.env.VUE_APP_DESCRIPTION || 'NO DESCRIPTION FOUND IN MANIFEST.JSON',
    appVersion: process.env.VUE_APP_VERSION || 'NO VERSION FOUND IN MANIFEST.JSON',
    user: false,
    sessions: [],
    players: [],
    MAX_PLAYERS: 2,
    DEFAULT_BOARD: ["", "", "", "", "", "", "", "", ""],
    WINNING_CONDITIONS: [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6]
    ],
    SYMBOL_X: "X",
    SYMBOL_O: "O",
  },

  getters: {
    appVersion: (state) => {
      return state.appVersion
    },
    appTitle: (state) => {
      return state.appTitle
    },
    appDescription: (state) => {
      return state.appDescription
    },
    user(state) {
      return state.user;
    },
    sessions(state) {
      return state.sessions;
    },
    mysessions(state) {
      return state.sessions.filter(session => (session.creator.uid === state.user.uid || (session.challenger && session.challenger.uid === state.user.uid) ));
    },
    allsessions(state) {
      return state.sessions.filter(session => (session.creator.uid !== state.user.uid));
    },
    session: (state) => (id) => {
      return state.sessions.find(session => session.uid == id);
    },
    players(state) {
      return state.players;
    },
  },

  mutations: {
    SET_SESSIONS (state, sessions) {
      state.sessions = sessions
    },
    SET_PLAYERS (state, players) {
      state.players = players
    },
    SET_USER (state, user) {
      state.user = user
    },
    CLEAR_USER (state) {
      state.user = null
    }
  },

  actions: {

    async login ({ commit }, details) {
      const { email, password } = details

      try {
        await signInWithEmailAndPassword(auth, email, password)
      } catch (error) {
        switch(error.code) {
          case 'auth/user-not-found':
            alert("User not found")
            break
          case 'auth/wrong-password':
            alert("Wrong password")
            break
          default:
            alert("Something went wrong")
        }

        return
      }

      commit('SET_USER', formatSessionPlayer(auth.currentUser));

      router.push('/')
    },

    async register ({ commit}, details) {
      const { email, password } = details

      try {
        await createUserWithEmailAndPassword(auth, email, password)
      } catch (error) {
        switch(error.code) {
          case 'auth/email-already-in-use':
            alert("Email already in use")
            break
          case 'auth/invalid-email':
            alert("Invalid email")
            break
          case 'auth/operation-not-allowed':
            alert("Operation not allowed")
            break
          case 'auth/weak-password':
            alert("Weak password")
            break
          default:
            alert("Something went wrong")
        }

        return
      }

      updateProfile(auth.currentUser, {
        displayName: usernameGen.generateUsername(8),
      }).then(() => {

        let player = formatSessionPlayer(auth.currentUser);

        commit('SET_USER', player);

        set(ref(database, 'players/' + player.uid), player);

        router.push('/')

      }).catch((error) => {

      });
    },

    async updateProfileName({ commit}, newName) {
      updateProfile(auth.currentUser, {
        displayName: newName,
      }).then(() => {
        update(ref(database, 'players/' +auth.currentUser.uid+"/"), {
          'name': auth.currentUser.displayName,
        });
        alert('Profile updated successfully');
      }).catch((error) => {

      });
    },

    async logout ({ commit }) {
      await signOut(auth)
      commit('CLEAR_USER')
      //router.push('/')
    },

    addSession ({ commit, state}) {
      return new Promise((resolve) => {
        const dbRef = ref(database, 'sessions');
        const newSessionRef = push(dbRef);
        state.user.symbol = state.SYMBOL_X;
        let session = {
          'uid': newSessionRef.key,
          'players': [],
          'player_turn': "",
          'messages': "",
          'play_board': [...state.DEFAULT_BOARD],
          'started': 0,
          'draw': 0,
          'creator': formatSessionPlayer(state.user),
          'challenger': false,
          'latest_winner': 'creator'
        };
        set(newSessionRef, session).then(() => {
          set(ref(database, 'players/' +state.user.uid+'/sessions/'+newSessionRef.key+'/'), 'creator');
        });
        resolve(session);
      })
    },

    joinSession ({ commit, state }, session_id) {
      state.user.symbol = state.SYMBOL_O;
      set(ref(database, 'sessions/' +session_id+"/challenger"), formatSessionPlayer(state.user));
      return true;
    },

    deleteSession ({ commit, state }, session_id) {
      console.log('DELETE SESSION', session_id);

      // GET SESSION
      let session = state.sessions.find(session => session.uid === session_id);

      // REMOVE PLAYERS
      remove(ref(database, 'players/'+session.creator.uid+'/sessions/'+session_id));
      if(session.challenger){
        remove(ref(database, 'players/'+session.challenger.uid+'/sessions/'+session_id));
      }

      // REMOVE SESSION
      const dbRef = ref(database, 'sessions/'+session_id);
      remove(dbRef);

      router.push('/');
    },

    leaveSession ({ commit, state }, session_id) {
      console.log('REMOVE CHALLENGER FROM SESSION', session_id);
      const dbRef = ref(database, 'sessions/'+session_id+'/challenger/');
      remove(dbRef);
      router.push('/');
    },

    addMessage ({ commit, state}, data) {
      return new Promise((resolve) => {
        console.log('addMessage',data);
        const dbRef = ref(database, 'sessions/'+data.session_id+'/messages');
        const newSessionRef = push(dbRef);
        let session = {
          'name': data.name,
          'message': data.message,
        };
        set(newSessionRef, session);
        resolve(session);
      })
    },

    fetchSessions ({ commit }) {
      const dbRef = ref(database, 'sessions');
      onValue(dbRef, (snapshot) => {
        let sessions = [];
        snapshot.forEach((childSnapshot) => {
          sessions.push(childSnapshot.val());
        });
        commit('SET_SESSIONS', sessions)
      }, {
        onlyOnce: false
      });
    },

    fetchPlayers({ commit }) {
      //const dbRef = ref(database, 'players');
      const dbRef = query(ref(database, 'players'), orderByChild('score'), limitToLast(10));
      onValue(dbRef, (snapshot) => {
        let sessions = [];
        snapshot.forEach((childSnapshot) => {
          sessions.push(childSnapshot.val());
        });
        commit('SET_PLAYERS', sessions)
      }, {
        onlyOnce: false
      });
    },

    startGame ({ commit, state }, session_id) {
      console.log('START GAME', session_id);
      let session = state.sessions.find(session => session.uid === session_id);
      set(ref(database, 'sessions/' +session_id+"/started"), 1);
      set(ref(database, 'sessions/' +session_id+"/player_turn"), session[session.latest_winner].uid);
    },

    clickSquare ({ commit, state }, data) {

      let session = state.sessions.find(session => session.uid === data.session_id);
      let type = session.creator.uid === state.user.uid ? 'creator':'challenger'

      session.play_board[data.index] = session[type].symbol;
      session.player_turn = session.player_turn === session.creator.uid ? session.challenger.uid : session.creator.uid;

      update(ref(database, 'sessions/' +session.uid+"/"), {
        'play_board': session.play_board,
        'player_turn': session.player_turn,
      });

      // CHECK FOR DRAW
      let roundDraw = !session.play_board.includes("");
      if (roundDraw) {
        update(ref(database, 'sessions/' +session.uid+"/"), {
          'play_board': [...state.DEFAULT_BOARD],
          'player_turn': session.creator.uid,
          'started': 0,
          'draw': session.draw + 1,
        });
      }

      console.log('CLICK SQUARE', session);

      // CHECK FOR WINNER
      if(checkForWinners(session.play_board)){

        // INCREMENT SCORE
        update(ref(database, 'sessions/' +session.uid+"/"+type), { 'score': increment(1) });

        // INCREASE LEADERBOARD
        update(ref(database, 'players/'+state.user.uid), { 'score': increment(1) });

        // RESTART GAME
        update(ref(database, 'sessions/' +session.uid+"/"), {
          'play_board': [...state.DEFAULT_BOARD],
          'current_symbol': state.SYMBOL_O,
          'player_turn': session.creator.uid,
          'started': 0,
          'latest_winner': type,
        });

        return false;
      }

    },

    fetchUser ({ commit }) {
      auth.onAuthStateChanged(async user => {
        if (user === null) {
          commit('CLEAR_USER');
          router.push('/login')
        } else {

          commit('SET_USER', formatSessionPlayer(user));

          if (router && router.currentRoute.name === 'login') {
            router.push('/')
          }
        }
      })
    }

  }

})
