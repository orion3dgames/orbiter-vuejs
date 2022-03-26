import firebaseDB from "./firebaseDB";

import {
  signOut,
  updateProfile,
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

class firebaseInstance {

  constructor() {
      this.db = firebaseDB;
      this.session_id = false;
      console.log('[firebaseInstance]', 'initialized');
  }

  setSession(uid) {
    this.session_id = uid;
  }

  loadSessions() {
    return new Promise((resolve) => {
      console.log('[firebaseInstance]', 'loadSessions');
      this.db.ref('sessions').once("value", function (snapshot) {
        var sessions = [];
        snapshot.forEach(function (child) {
          sessions.push(child.val());
        });
        resolve(sessions);
      });
    });
  }

  loadSession() {
    return new Promise((resolve) => {
      this.db.ref('sessions/'+this.session_id).once("value", function (snapshot) {
        resolve(snapshot.val());
      });
    });
  }

  addCube(data) {
    return new Promise((resolve) => {
      if(this.session_id === false){
        return false;
      }
      const dbRef = ref(this.db, 'sessions/'+ this.session_id+'/cubes');
      const newSessionRef = push(dbRef);
      data.uid = newSessionRef.key;
      set(newSessionRef, data).then(() => {
        resolve(data);
      });
    })
  }

}

export default firebaseInstance