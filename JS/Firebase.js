// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-app.js";
import { getAuth} from "https://www.gstatic.com/firebasejs/9.17.2/firebase-auth.js";
import { getFirestore} from "https://www.gstatic.com/firebasejs/9.17.2/firebase-firestore.js"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  // apiKey: "AIzaSyACjKeVXQwHckPq5YfviRyVGxFt4NJHlu8",
  // authDomain: "store-afe09.firebaseapp.com",
  // projectId: "store-afe09",
  // storageBucket: "store-afe09.appspot.com",
  // messagingSenderId: "936109725787",
  // appId: "1:936109725787:web:004f01a44ef8c135a5877e"

  apiKey: "AIzaSyA5fCj_OL89yXd77cXHCz5E2RpOs7aefNc",
  authDomain: "enyoi-4077a.firebaseapp.com",
  projectId: "enyoi-4077a",
  storageBucket: "enyoi-4077a.appspot.com",
  messagingSenderId: "761472218427",
  appId: "1:761472218427:web:1d4d381ed05ef57467b31e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore();

export{auth, db};