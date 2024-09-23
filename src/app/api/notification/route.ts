import { NextRequest, NextResponse } from 'next/server';
import admin from '../../../utils/firebase-admin'; // Firebase Admin 초기화된 파일 경로

export async function POST(request: NextRequest) {
  const { token, title, body } = await request.json();

  if (!token || !title || !body) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }

  try {
    const message = {
      token, // FCM 토큰
      notification: {
        title, // 푸시 알림 제목
        body, // 푸시 알림 내용
      },
    };

    // FCM 메시지 전송
    await admin.messaging().send(message);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error sending FCM message:', error);
    return NextResponse.json(
      { error: 'Error sending notification' },
      { status: 500 }
    );
  }
}
