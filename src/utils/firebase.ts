// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import {
  getMessaging,
  getToken,
  isSupported,
  onMessage,
} from 'firebase/messaging';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_MEASUREMENT_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// 푸시 알림 수신 권한 요청
export const requestPermission = async () => {
  // 브라우저 환경에서만 실행되도록 체크
  if (typeof window !== 'undefined') {
    try {
      // FCM이 브라우저에서 지원되는지 확인
      const supported = await isSupported();
      if (supported) {
        const messaging = getMessaging(app);
        // VAPID 키 설정 (Firebase 콘솔에서 가져온 VAPID 공개 키를 사용)
        const token = await getToken(messaging, {
          vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
        });

        if (token) {
          return token; // 이 토큰을 사용해서 푸시 알림을 보냅니다
        } else {
          console.log('푸시 알림 권한이 거부되었습니다.');
          return null;
        }
      } else {
        console.warn('이 브라우저는 FCM을 지원하지 않습니다.');
        return null;
      }
    } catch (error) {
      console.error('FCM 토큰 요청 중 오류 발생:', error);
      return null;
    }
  } else {
    // 서버사이드 렌더링에서는 null 반환
    console.warn('서버사이드에서는 FCM 토큰을 요청할 수 없습니다.');
    return null;
  }
};

// 포그라운드 메시지 수신
export const onMessageListener = (callback: (_payload: unknown) => void) => {
  const messaging = getMessaging(app);
  onMessage(messaging, (payload) => {
    callback(payload);
  });
};
