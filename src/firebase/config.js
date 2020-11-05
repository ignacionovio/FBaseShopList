import * as firebase from 'firebase';
import '@firebase/auth';
import '@firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyCPLXnCPi7WTIfwr-Tsr2m3lnS22_meVqU',
  authDomain: 'appmia-48940.firebaseapp.com',
  databaseURL: 'https://appmia-48940.firebaseio.com',
  projectId: 'appmia-48940',
  storageBucket: 'appmia-48940.appspot.com',
  messagingSenderId: '1052430455499',
  appId: '1:1052430455499:web:a25eb6f1cd0c59fa2c814e',
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

export { firebase };