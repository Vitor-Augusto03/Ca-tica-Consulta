// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDoBQ28HM0YB7I76ztB-5uHKx-UzrzIswk",
  authDomain: "agenda-medica-d5c9d.firebaseapp.com",
  projectId: "agenda-medica-d5c9d",
  storageBucket: "agenda-medica-d5c9d.appspot.com",
  messagingSenderId: "742493341095",
  appId: "1:742493341095:web:4596d5f519d2183d7da282",
  measurementId: "G-0P3EGB760R"
};


// Inicializa o Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider };
