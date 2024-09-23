/* eslint-disable no-undef */

importScripts(
  'https://www.gstatic.com/firebasejs/9.6.1/firebase-app-compat.js'
);
importScripts(
  'https://www.gstatic.com/firebasejs/9.6.1/firebase-messaging-compat.js'
);

// Firebase 설정 객체
const firebaseConfig = {
  apiKey: '__FIREBASE_API_KEY__', // 환경 변수로 대체됨
  authDomain: '__FIREBASE_AUTH_DOMAIN__', // 환경 변수로 대체됨
  projectId: '__FIREBASE_PROJECT_ID__', // 환경 변수로 대체됨
  storageBucket: '__FIREBASE_STORAGE_BUCKET__', // 환경 변수로 대체됨
  messagingSenderId: '__FIREBASE_MESSAGING_SENDER_ID__', // 환경 변수로 대체됨
  appId: '__FIREBASE_APP_ID__', // 환경 변수로 대체됨
  measurementId: '__FIREBASE_MEASUREMENT_ID__', // 환경 변수로 대체됨
};

// Firebase 초기화
firebase.initializeApp(firebaseConfig);

// Firebase Messaging 초기화
const messaging = firebase.messaging();

// 백그라운드에서 푸시 알림을 수신합니다.
messaging.onBackgroundMessage(function (payload) {
  console.log('[firebase-messaging-sw.js] 백그라운드 메시지 수신: ', payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/icons/icon.png', // 아이콘 경로
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
