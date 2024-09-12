# 블로그

* **markdown and MDX** 을 작성을 통해 블로그 게시글을 작성하는 개인 프로젝트
* https://my-blog.wonseok-han.dev

## 개발 환경

* **NodeJS:** `v20.14.0` (LTS)
* **PackageManager:** `npm`

## Getting Started

### 실행

```bash
# Module Install
npm install

# Server start
npm run dev
```

### 배포

* Build 명령 후 생성되는 .next 폴더로 배포합니다.

```bash
# Build
npm run build
```

### 게시글 작성

* contents 폴더 내에 작성할 게시글을 **.mdx** 파일로 생성하고 작성합니다.

### 소스 구조

```bash
.
├── __tests__ # 테스트 코드
│   └── components
│       └── layout
├── contents  # 포스트 mdx
│   └── blog-posts
├── licenses  # 폰트 License 문서
│   └── font_aggro
├── public  # Public 콘텐츠
│   ├── fonts
│   │   └── aggro
│   ├── icons
│   ├── images
│   │   └── blog-posts  # 블로그 포스팅에 사용되는 이미지
│   └── thumbnail # 포스트 썸네일
│       └── blog-posts
└── src
    ├── app
    │   └── posts # /posts Route
    │       └── [slug]
    ├── components  # 컴포넌트
    │   └── layout
    ├── types # 타입
    └── utils # 유틸성 함수
```

### 배포환경

* [**vercel**](https://vercel.com/)

## Reference

* **Markdown and MDX**
  - https://nextjs.org/docs/pages/building-your-application/configuring/mdx

* **Nextjs Darkmode**
  - https://coding-je.com/entry/Nextjs-next-themes%EB%A1%9C-Nextjs%EC%97%90%EC%84%9C-%EA%B0%84%EB%8B%A8%ED%9E%88-%EB%8B%A4%ED%81%AC%EB%AA%A8%EB%93%9C-%EA%B5%AC%ED%98%84%ED%95%98%EA%B8%B0-feat-tailwind
