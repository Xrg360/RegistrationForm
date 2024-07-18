import { initializeApp } from "firebase/app";
import {getFirestore} from "firebase/firestore";
import {getStorage} from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyC3739a1nU9tfD2mu0KHYF83TWbQt8Czrk",
  authDomain: "devsummit-b4866.firebaseapp.com",
  projectId: "devsummit-b4866",
  storageBucket: "devsummit-b4866.appspot.com",
  messagingSenderId: "595021606505",
  appId: "1:595021606505:web:a4474ec46730c41d09bcf8"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, db,storage };