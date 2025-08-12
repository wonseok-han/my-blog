/* eslint-disable no-undef */

/**
 * SECTION: PWA를 위한 기본 서비스 워커 로직
 */
// 서비스 워커가 설치될 때 호출되는 이벤트 리스너
self.addEventListener('install', () => {
  console.log('Service Worker install');

  // skipWaiting()을 호출하면 새 서비스 워커가 대기 중인 상태에서
  // 즉시 활성화 상태로 전환되도록 강제합니다.
  self.skipWaiting(); // 기존 서비스 워커를 대체하고 즉시 활성화
});

// 네트워크 요청을 가로채서 캐싱된 데이터를 우선적으로 반환하는 이벤트 리스너
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // 캐시에 요청이 있는 경우 캐시에서 반환, 없으면 네트워크에서 가져옴
      return response || fetch(event.request);
    })
  );
});

// 서비스 워커가 푸시 알림을 수신할 때 호출되는 이벤트 리스너
self.addEventListener('push', (event) => {
  console.log('[Service Worker] Push Received.', event.data.text()); // 푸시 데이터 출력

  // 푸시 알림의 데이터를 JSON으로 변환
  const { title, body } = event.data.json().notification; // title과 body를 추출

  // 푸시 알림을 생성 및 표시
  event.waitUntil(
    self.registration.showNotification(title, {
      body, // 푸시 알림 내용
      icon: '/icons/icon.png', // 알림 아이콘 경로
      data: {
        link: '/', // 알림 클릭 시 이동할 URL
      },
    })
  );
});

// 사용자가 푸시 알림을 클릭했을 때 실행되는 이벤트 리스너
self.addEventListener('notificationclick', (event) => {
  console.log('[Service Worker] notificationclick', event.notification.data); // 알림 클릭 시 데이터 출력

  // 알림 클릭 시 지정된 URL로 브라우저 창 열기
  event.waitUntil(clients.openWindow(event.notification.data.link));
});

/**
 * SECTION: FCM을 위한 로직 (이미 백그라운드에 서비스워커가 위에서 설정되있기때문에 여기서는 필요없음)
 */
// importScripts(
//   'https://www.gstatic.com/firebasejs/9.6.1/firebase-app-compat.js'
// );
// importScripts(
//   'https://www.gstatic.com/firebasejs/9.6.1/firebase-messaging-compat.js'
// );

// // Firebase 설정 객체
// const firebaseConfig = {
//   apiKey: 'undefined', // 환경 변수로 대체됨
//   authDomain: 'undefined', // 환경 변수로 대체됨
//   projectId: 'undefined', // 환경 변수로 대체됨
//   storageBucket: 'undefined', // 환경 변수로 대체됨
//   messagingSenderId: 'undefined', // 환경 변수로 대체됨
//   appId: 'undefined', // 환경 변수로 대체됨
//   measurementId: 'undefined', // 환경 변수로 대체됨
// };

// // Firebase 초기화
// firebase.initializeApp(firebaseConfig);

// // Firebase Messaging 초기화
// const messaging = firebase.messaging();

// // 백그라운드에서 푸시 알림을 수신합니다.
// messaging.onBackgroundMessage(function (payload) {
//   console.log('[firebase-messaging-sw.js] 백그라운드 메시지 수신: ', payload);
//   const notificationTitle = payload.notification.title;
//   const notificationOptions = {
//     body: payload.notification.body,
//     icon: '/icons/icon.png', // 아이콘 경로
//     data: {
//       link: '/', // 알림 클릭 시 이동할 URL
//     },
//   };

//   self.registration.showNotification(notificationTitle, notificationOptions);
// });
