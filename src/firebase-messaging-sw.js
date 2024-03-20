importScripts("https://www.gstatic.com/firebasejs/10.2.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.2.0/firebase-messaging-compat.js");

firebase.initializeApp({
    apiKey: "AIzaSyCNr7nAJOZJW0YDBTanTXnH_xVnlnMDAPI",
    authDomain: "dawem-5361a.firebaseapp.com",
    projectId: "dawem-5361a",
    storageBucket: "dawem-5361a.appspot.com",
    messagingSenderId: "920034014025",
    appId: "1:920034014025:web:18bb00d19266b668b1a098",
    measurementId: "G-VE6JQS06RC"
});
const messaging = firebase.messaging();
// messaging.onBackgroundMessage((payload) => {
    
//     console.log('Received background message ', payload);
// });
