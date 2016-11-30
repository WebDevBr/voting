import firebase from 'firebase';
import firebaseui from 'firebaseui';

export class Firebase {

  constructor() {
    this.config = {
      apiKey: "AIzaSyBN4OP-EwtpYEj8zzpFX1HVFx5Xsfunwmc",
      authDomain: "voting-a548a.firebaseapp.com",
      databaseURL: "https://voting-a548a.firebaseio.com",
      storageBucket: "voting-a548a.appspot.com",
      messagingSenderId: "144978538230"
    };
  }

  start() {
    var firebaseApp = firebase.initializeApp(this.config);
    return firebaseApp.database();
  }

  login(provider) {
    if (provider == 'facebook') {
      var provider = new firebase.auth.FacebookAuthProvider();
    }

    if (provider == 'github') {
      var provider = new firebase.auth.GithubAuthProvider();
    }

    if (provider == 'google') {
      var provider = new firebase.auth.GoogleAuthProvider();
    }

    return new Promise((resolve, reject)=>{
      firebase.auth().signInWithPopup(provider).then(function(result) {
        var token = result.credential.accessToken;
        var user = result.user;
        return resolve({token, user})
      })
      .catch((error) => {
        if (error.code == 'auth/popup-blocked') {
          alert('O navegador bloqueou o popup de login, por favor, autorize antes de continuar');
        }
        return reject(error);
      });
    });
  }

  logout() {
    firebase.auth().signOut();
  }

  isLogged() {
    return new Promise((resolve, reject)=>{
      firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
          return resolve(user);
        }
        return reject();
      });
    });
  }

}
