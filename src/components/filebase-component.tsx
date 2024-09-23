'use client';

import { usePushStore } from '@/store/push-store';
import { FCMMessagePayloadType } from '@/types/firebase';
import { onMessageListener, requestPermission } from '@utils/firebase';
import { memo, useEffect } from 'react';

const FirebaseComponent = () => {
  const { token, setToken, trigger } = usePushStore();

  const sendNotification = async () => {
    try {
      const res = await fetch('/api/notification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          title: 'Web Push',
          body: `${new Date()}`,
        }),
      });

      if (res.ok) {
        alert('Notification sent successfully!');
      } else {
        const errorData = await res.json();
        alert(`Failed to send notification: ${errorData.error}`);
      }
    } catch (error) {
      console.error('Error setting notification:', error);
    }
  };

  useEffect(() => {
    // 브라우저 푸시 알림 권한 요청
    if (Notification.permission !== 'granted') {
      Notification.requestPermission().then((permission) => {
        if (permission === 'granted') {
          console.log('알림 권한이 허용되었습니다.');
        } else {
          console.log('알림 권한이 거부되었습니다.');
        }
      });
    }
  }, []);

  useEffect(() => {
    // 페이지 로드 시 푸시 알림 권한 요청
    if (typeof window !== 'undefined') {
      const fetchToken = async () => {
        const fcmToken = await requestPermission();
        if (fcmToken) {
          setToken(fcmToken); // 토큰을 상태에 저장
        }
      };

      fetchToken();
    }
  }, []);

  useEffect(() => {
    // 메시지가 수신될 때마다 호출되는 리스너
    onMessageListener((payload) => {
      console.log('포그라운드 메시지 수신: ', payload);

      // Notification API를 통해 포그라운드에서 알림 표시
      if (Notification.permission !== 'granted') return;

      const result = payload as FCMMessagePayloadType;
      const notificationTitle = result.notification?.title;
      const notificationOptions = {
        body: result.notification?.body,
        icon: '/icons/icon.png', // 알림 아이콘 경로
      };

      if (notificationTitle && notificationOptions.body) {
        // 포그라운드에서 Notification API 사용
        new Notification(notificationTitle, notificationOptions);
      }
    });
  }, []);

  useEffect(() => {
    if (trigger > 0) {
      sendNotification();
    }
  }, [trigger]);

  return null;
};

export default memo(FirebaseComponent);
