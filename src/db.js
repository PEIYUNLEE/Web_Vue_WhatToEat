import * as firebase from 'firebase/app';
import "firebase/firestore";

let config = {
  apiKey: "AIzaSyDHhnSmbAGhiPp_Zs_tEQQKx_JiTkFYj1c",
    authDomain: "whattoeat-395d9.firebaseapp.com",
    databaseURL: "https://whattoeat-395d9.firebaseio.com",
    projectId: "whattoeat-395d9",
    storageBucket: "whattoeat-395d9.appspot.com",
    messagingSenderId: "1094549090596",
    appId: "1:1094549090596:web:cdc5a009acc26987"
}

firebase.initializeApp(config);
window.firebase=firebase;

export const db = firebase.firestore()
