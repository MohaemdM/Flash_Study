// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore} from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC1IsIdwUo40luFXtxZuPOaedgIaFshAtA",
  authDomain: "flashcardsaas-4e613.firebaseapp.com",
  projectId: "flashcardsaas-4e613",
  storageBucket: "flashcardsaas-4e613.appspot.com",
  messagingSenderId: "427004853087",
  appId: "1:427004853087:web:85e649b2fb9e847b84d4ea"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export  {db};