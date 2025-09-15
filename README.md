# 까먹을게 분명하기 때문에 기록하는 블로그

개발 경험과 학습 내용을 담은 개인 블로그입니다. Next.js 15와 MDX를 활용하여 구축되었습니다.

**Live:** https://blog.wonseok-han.dev

## 주요 기능

- **MDX 기반 포스트 작성** - 마크다운과 React 컴포넌트를 함께 사용
- **통합 검색 시스템** - 제목, 내용, 태그 기반 검색
- **카테고리 및 태그 시스템** - 포스트 분류 및 필터링
- **다크/라이트 모드** - 사용자 선호도에 따른 테마 전환
- **Giscus 댓글 시스템** - GitHub Discussions 기반 댓글
- **반응형 디자인** - 모바일부터 데스크톱까지 최적화
- **PWA 지원** - 오프라인 사용 및 앱 설치 가능
- **Git 메타데이터** - 포스트별 Git 정보 자동 수집
- **커스텀 폰트** - SB 어그로 폰트 적용

## 기술 스택

### Frontend
- **Next.js 15** - React 프레임워크
- **TypeScript** - 타입 안전성
- **Tailwind CSS** - 스타일링
- **MDX** - 마크다운 + React 컴포넌트
- **next-themes** - 다크모드 지원

### Backend & Data
- **Vercel** - 배포 및 호스팅
- **GitHub** - 소스 코드 및 Discussions
- **Git 메타데이터** - 포스트 생성/수정 정보

### 개발 도구
- **ESLint** - 코드 품질 관리
- **Prettier** - 코드 포맷팅
- **Jest** - 테스트 프레임워크
- **next-pwa** - PWA 기능

## 개발 환경

- **Node.js:** `v20.14.0` (LTS)
- **Package Manager:** `npm`

## 시작하기

### 설치 및 실행

```bash
# 의존성 설치
npm install

# 개발 서버 시작
npm run dev
```

개발 서버가 시작되면 [http://localhost:3000](http://localhost:3000)에서 확인할 수 있습니다.

### 빌드 및 배포

```bash
# 프로덕션 빌드
npm run build

# 빌드 결과 확인
npm run start
```

Vercel에 배포할 때는 자동으로 빌드가 실행됩니다.

### 포스트 작성

1. `contents/blog-posts/` 폴더에 `.mdx` 파일 생성
2. 파일명 형식: `YYYYMMDDHHMM-포스트-제목.mdx`
3. Frontmatter에 메타데이터 작성:

```mdx
---
title: "포스트 제목"
description: "포스트 설명"
category: "카테고리"
tags: ["태그1", "태그2"]
created: "2024-01-01 10:00"
---

# 포스트 내용

마크다운 문법으로 작성하거나 React 컴포넌트를 사용할 수 있습니다.
```

### 환경 변수 설정

`.env.local` 파일을 생성하고 다음 변수들을 설정하세요:

```env
# Giscus 댓글 시스템 설정
NEXT_PUBLIC_GISCUS_MY_REPO_NAME=wonseok-han/my-blog
NEXT_PUBLIC_GISCUS_MY_REPO_ID=your_repo_id
NEXT_PUBLIC_GISCUS_MY_CATEGORY=General
NEXT_PUBLIC_GISCUS_MY_CATEGORY_ID=your_category_id

# Firebase 설정 (PWA 푸시 알림용)
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_MEASUREMENT_ID=your_measurement_id
```

## 📁 프로젝트 구조

```
my-blog/
├── __tests__/                    # 테스트 코드
│   └── components/
│       └── layout/
├── contents/                     # MDX 포스트 파일
│   └── blog-posts/
├── public/                       # 정적 파일
│   ├── fonts/                    # 커스텀 폰트 (SB 어그로)
│   ├── icons/                    # 아이콘
│   ├── images/                   # 포스트 이미지
│   ├── metadata/                 # Git 메타데이터
│   └── thumbnail/                # 포스트 썸네일
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── api/                  # API 라우트
│   │   ├── posts/                # 포스트 페이지
│   │   └── globals.css           # 전역 스타일
│   ├── components/               # React 컴포넌트
│   │   ├── layout/               # 레이아웃 컴포넌트
│   │   ├── posts/                # 포스트 관련 컴포넌트
│   │   └── ui/                   # UI 컴포넌트
│   ├── lib/                      # 라이브러리 및 유틸리티
│   ├── store/                    # 상태 관리
│   ├── types/                    # TypeScript 타입 정의
│   └── utils/                    # 유틸리티 함수
├── scripts/                      # 빌드 스크립트
└── licenses/                     # 폰트 라이센스
```

## 🔧 주요 기능 상세

### 검색 시스템
- 실시간 검색 제안
- 제목, 내용, 태그 기반 검색
- 카테고리 및 태그 필터링
- 무한 스크롤 페이지네이션

### Git 메타데이터
- 포스트별 Git 생성/수정 날짜 자동 수집
- 빌드 시점에 메타데이터 생성

### PWA 기능
- 오프라인 사용 가능
- 앱 설치 지원
- 푸시 알림 (Firebase 기반)
- 서비스 워커를 통한 캐싱

### 댓글 시스템
- Giscus 기반 GitHub Discussions 연동
- 다크/라이트 모드 지원
- 한국어 인터페이스

## 배포

이 프로젝트는 [Vercel](https://vercel.com/)을 통해 배포됩니다.

### 자동 배포
- `main` 브랜치에 푸시 시 자동 배포
- Git 메타데이터 자동 생성
- 환경 변수 자동 설정

### 수동 배포
```bash
npm run build
# Vercel CLI 또는 웹 인터페이스를 통해 배포
```

## 테스트

```bash
# 테스트 실행
npm test

# 테스트 커버리지 확인
npm run test:coverage

# 테스트 감시 모드
npm run test:watch
```

## 참고 자료

- [Next.js 15 공식 문서](https://nextjs.org/docs)
- [MDX 공식 문서](https://mdxjs.com/)
- [Tailwind CSS 공식 문서](https://tailwindcss.com/docs)
- [Giscus 댓글 시스템](https://giscus.app/ko)
- [next-themes 다크모드](https://github.com/pacocoursey/next-themes)
- [PWA 가이드](https://web.dev/progressive-web-apps/)
