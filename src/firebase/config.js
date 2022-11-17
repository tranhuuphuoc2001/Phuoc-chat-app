import firebase from 'firebase/compat/app';
import 'firebase/compat/auth'
import 'firebase/compat/firestore'

//import { initializeApp } from "firebase/app";
import { getAnalytics,logEvent  } from 'firebase/analytics'

const firebaseConfig = {
  apiKey: "AIzaSyAtTFw5iCiumFdXk8fQgMbBafYnYhkSrnQ",
  authDomain: "chat-254e7.firebaseapp.com",
  projectId: "chat-254e7",
  storageBucket: "chat-254e7.appspot.com",
  messagingSenderId: "782339351696",
  appId: "1:782339351696:web:9e3d5d690126d459d62415",
  measurementId: "G-9NSZHLZBX0"
};
  
  // Initialize Firebase
  const app = firebase.initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);
  logEvent(analytics, 'notification_received');
  const auth = firebase.auth()
  const db = firebase.firestore()

  export { auth,db }
  export default firebase