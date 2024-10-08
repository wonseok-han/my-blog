'use client';

import { usePushStore } from '@/store/push-store';
import { useTokenStore } from '@/store/token-store';

import { requestPermission } from '@utils/firebase';
import { usePathname } from 'next/navigation';
import { memo, useEffect } from 'react';

const WorkerComponent = () => {
  const pathname = usePathname();

  const { token, setToken } = useTokenStore();
  const { trigger, clear } = usePushStore();

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
    if (typeof window == 'undefined') return;

    // 서비스 워커 등록
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      navigator.serviceWorker
        .register('/worker/index.js')
        .then(function (registration) {
          console.log('서비스 워커 등록 성공:', registration);
          const fetchToken = async (
            registration: ServiceWorkerRegistration
          ) => {
            const fcmToken = await requestPermission(registration);
            if (fcmToken) {
              setToken(fcmToken); // 토큰을 상태에 저장
            }
          };

          fetchToken(registration);
        })
        .catch(function (err) {
          console.error('서비스 워커 등록 실패:', err);
        });
    }
  }, []);

  useEffect(() => {
    clear();
  }, [pathname]);

  useEffect(() => {
    if (trigger > 0) {
      sendNotification();
    }
  }, [trigger]);

  return null;
};

export default memo(WorkerComponent);
