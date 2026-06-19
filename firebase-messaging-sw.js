/* Handles push notifications when the app is in the background/closed */
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyDJMoHjVSBmb08BjDxUOcPOGfHa_6GFz_g",
  authDomain: "family-task-fe977.firebaseapp.com",
  projectId: "family-task-fe977",
  storageBucket: "family-task-fe977.firebasestorage.app",
  messagingSenderId: "183635682597",
  appId: "1:183635682597:web:fcf47603fff0d9873c66cc"
});

const messaging = firebase.messaging();
messaging.onBackgroundMessage(payload => {
  const n = payload.notification || {};
  self.registration.showNotification(n.title || 'Family Tasks', {
    body: n.body || '',
    icon: 'icon-192.png',
    badge: 'icon-192.png'
  });
});
