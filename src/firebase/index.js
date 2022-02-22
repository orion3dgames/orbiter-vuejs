import { initializeApp } from "firebase/app"
import { getAuth, signInAnonymously } from "firebase/auth"
import { getDatabase } from "firebase/database"

const firebaseConfig = require("./config.json");
const app = initializeApp(firebaseConfig)

const auth = getAuth(app)
const database = getDatabase(app)

export { auth, database }