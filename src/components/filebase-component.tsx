'use client';

import { onMessageListener, requestPermission } from '@utils/firebase';
import { useEffect, useState } from 'react';

const FirebaseComponent = () => {
  const [token, setToken] = useState('');

  const sendNotification = async () => {
    try {
      const res = await fetch('/api/notification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, title: 'Test title', body: 'Test body' }),
      });

      if (res.ok) {
        // alert('Notification sent successfully!');
      } else {
        const errorData = await res.json();
        alert(`Failed to send notification: ${errorData.error}`);
      }
    } catch (error) {
      console.error('Error sending notification:', error);
    }
  };

  useEffect(() => {
    // 페이지 로드 시 푸시 알림 권한 요청
    if (typeof window !== 'undefined') {
      // requestPermission();
      const fetchToken = async () => {
        const fcmToken = await requestPermission();
        if (fcmToken) {
          setToken(fcmToken); // 토큰을 상태에 저장
        }
      };

      fetchToken();

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
    }
  }, []);

  useEffect(() => {
    // 포그라운드에서 수신된 메시지 처리
    onMessageListener()
      .then((payload) => {
        console.log('22포그라운드 메시지 수신: ', payload);
      })
      .catch((err) => console.log('포그라운드 메시지 수신 실패: ', err));
  }, []);

  return <button onClick={sendNotification}>푸쉬</button>;
};

export default FirebaseComponent;
