// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getAuth,
  signInWithPopup,
  signInWithRedirect,
  GoogleAuthProvider,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCAI9Oo7iDgBy7lm0I4eCRL558vyuINwLA",
  authDomain: "lucid-delight-423502-v9.firebaseapp.com",
  projectId: "lucid-delight-423502-v9",
  storageBucket: "lucid-delight-423502-v9.appspot.com",
  messagingSenderId: "1078433286724",
  appId: "1:1078433286724:web:e59f55bf9cd3397c5cca11",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
auth.languageCode = "en";
const provider = new GoogleAuthProvider();

const googleBtn = document.getElementById("btnGoogleSignin");

googleBtn.addEventListener("click", function () {
  signInWithPopup(auth, provider)
    .then((result) => {
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const user = result.user;

      // console.log(user);
      const userData = {
        name: user.displayName,
        email: user.email,
      };

      // console.log(url);

      inserLogin(userData);
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
    });
});

function inserLogin(data) {
  const url = "http://localhost:3000/googleLogin";
  const options = {
    method: "GET",
    Headers: {
      Accept: "application.json",
      "Content-Type": "application/json",
    },
    Body: data,
  };

  fetch(url, {
    method: "GET",
    Headers: {
      Accept: "application.json",
      "Content-Type": "application/json",
    },
    Body: data,
  })
    .then((response) => response.json())
    .then((data) => console.log(data))
    .catch((err) => {
      console.log(err);
    });
}
