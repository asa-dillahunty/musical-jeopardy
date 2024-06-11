// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
	apiKey: "AIzaSyDmHiJs7KXNUJVeqekiLkf92Q3jCrWwvVA",
	authDomain: "musical-jeopardy.firebaseapp.com",
	projectId: "musical-jeopardy",
	storageBucket: "musical-jeopardy.appspot.com",
	messagingSenderId: "1001376375609",
	appId: "1:1001376375609:web:27b8870bf062fede4b7ee8",
	measurementId: "G-7MTJRTD0XB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);