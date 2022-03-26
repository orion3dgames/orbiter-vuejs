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
      console.log('[firebaseInstance]', 'initialized');
  }

  loadCubes() {
    return new Promise((resolve) => {
      this.db.ref('cubes').once("value", function (snapshot) {
        resolve(snapshot.val());
      });
    });
  }

  getPlayer(UID) {
    return new Promise((resolve) => {
      console.log('players/'+UID);
      this.db.ref('players/'+UID).once("value", function (snapshot) {
        resolve(snapshot.val());
      });
    });
  }

  addCube(data) {
    return new Promise((resolve) => {
      const dbRef = ref(this.db, 'cubes');
      const newSessionRef = push(dbRef);
      let cube = {
        uid: newSessionRef.key,
        x: data.x,
        y: data.y,
        z: data.z,
        color: data.color,
      }
      set(newSessionRef, cube).then(() => {
        resolve(data);
      });
    })
  }

}

export default firebaseInstance