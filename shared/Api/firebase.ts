
import { initializeApp } from "firebase/app";
import {getStorage} from 'firebase/storage'

const firebaseConfig = {
  apiKey: "AIzaSyC7TVOHnU4yQFPxE-aPfvsDQZcy6svzk8I",
  authDomain: "xtremefish-9ceaf.firebaseapp.com",
  projectId: "xtremefish-9ceaf",
  storageBucket: "xtremefish-9ceaf.appspot.com",
  messagingSenderId: "740298059758",
  appId: "1:740298059758:web:d71458ad7cd86da829e8ff"
};

const app = initializeApp(firebaseConfig);
export const storage = getStorage(app)