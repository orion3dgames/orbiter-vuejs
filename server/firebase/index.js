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
      console.log('players/' + UID);
      this.db.ref('players/' + UID).once("value", function (snapshot) {
        resolve(snapshot.val());
      });
    });
  }

  canCreateCube(data) {
    return new Promise((resolve) => {
      const pos = this.generatePositionRef(data);
      const q = query(ref(this.db, 'cubes/'), orderByChild('position_ref'), equalTo(pos));
      get(q).then(snapshot => {
        if (snapshot.exists()) {
          resolve(false);
        }
        resolve(true);
      });
    })
  }

  generatePositionRef(data) {
    return data.x + '_' + data.y + '_' + data.z
  }

  addCube(data) {
    return new Promise((resolve) => {
      const dbRef = ref(this.db, 'cubes');
      const newSessionRef = push(dbRef);
      let cube = {
        player_uid: data.player_uid,
        cube_uid: newSessionRef.key,
        position_ref: this.generatePositionRef(data),
        x: data.x,
        y: data.y,
        z: data.z,
        color: data.color,
        type: data.type,
      }
      set(newSessionRef, cube).then(() => {
        data.cube_uid = newSessionRef.key;
        resolve(data);
      });
    })
  }

  removeCube(data) {
    return new Promise((resolve, reject) => {
      if (data && data.cube_uid) {
        // console.log(data);
        remove(ref(this.db, 'cubes/' + data.cube_uid)).then(snapshot => {
          resolve(true);
        }).catch(error => {
          reject(error);
        })
      }
      else {
        if (!data)
          reject('but no data');
        else
          reject('but no cube_uid');
      }
    });
  }

}

export default firebaseInstance