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
  equalTo,
  get,
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

  canCreateCube(data) {
    return new Promise((resolve) => {
      const pos = this.generatePositionRef(data);
      const q = query(ref(this.db, 'cubes/'), orderByChild('position_ref'), equalTo(pos));
      get(q).then(snapshot => {
        if (snapshot.exists()){
          const cubeData = snapshot.val();
          console.log("exists!", cubeData);
          resolve(false);
        }
        resolve(true);
      });
    })
  }

  generatePositionRef(data) {
    return data.x+'_'+data.y+'_'+data.z
  }

  addCube(data) {
    return new Promise((resolve) => {
      const dbRef = ref(this.db, 'cubes');
      const newSessionRef = push(dbRef);
      let cube = {
        uid: newSessionRef.key,
        player_uid: data.player_uid,
        position_ref: this.generatePositionRef(data),
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