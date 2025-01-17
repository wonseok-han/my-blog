import createMDX from '@next/mdx';
import createPWA from 'next-pwa';
import fs from 'fs';
import path from 'path';

console.log('NODE_ENV::', process.env.NODE_ENV);

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configure `pageExtensions` to include markdown and MDX files
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
  // Optionally, add any other Next.js config below
  reactStrictMode: false,
  headers: async () => {
    return [
      {
        // 모든 페이지에 대한 캐시 정책 적용
        source: '/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'private, no-cache, no-store, max-age=0, must-revalidate', // 페이지는 캐시하지 않음
          },
        ],
      },
      {
        // 정적 파일에 대한 캐시 정책 적용
        source:
          '/:path(.+\\.(?:ico|png|svg|jpg|jpeg|gif|webp|json|mp3|mp4|ttf|ttc|otf|woff|woff2)$)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable', // 1년 캐시, 변경되지 않는 파일에 적합
          },
        ],
      },
    ];
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // 현재 작업 디렉터리로부터 절대 경로를 계산
      const swTemplate = fs.readFileSync(
        path.resolve(process.cwd(), 'src/service-worker-template.js'), // 서비스 워커 템플릿 경로
        'utf8'
      );

      const swFile = swTemplate
        .replace(
          '__FIREBASE_API_KEY__',
          process.env.NEXT_PUBLIC_FIREBASE_API_KEY
        )
        .replace(
          '__FIREBASE_AUTH_DOMAIN__',
          process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
        )
        .replace(
          '__FIREBASE_PROJECT_ID__',
          process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
        )
        .replace(
          '__FIREBASE_STORAGE_BUCKET__',
          process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
        )
        .replace(
          '__FIREBASE_MESSAGING_SENDER_ID__',
          process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
        )
        .replace('__FIREBASE_APP_ID__', process.env.NEXT_PUBLIC_FIREBASE_APP_ID)
        .replace(
          '__FIREBASE_MEASUREMENT_ID__',
          process.env.NEXT_PUBLIC_MEASUREMENT_ID
        );

      fs.writeFileSync(
        path.resolve(process.cwd(), 'public/worker/index.js'), // `__dirname` 대신 `process.cwd()` 사용
        swFile
      );
    }

    return config;
  },
};

const withMDX = createMDX({
  // Add markdown plugins here, as desired
  extension: /\.mdx$/,
});

const withPWA = createPWA({
  dest: 'public', // next export를 사용할 때 필요
  disable: process.env.NODE_ENV === 'development', // 개발 환경에서는 비활성화
  register: true, // 서비스 워커 등록 여부
  customWorkerDir: 'worker', // 서비스 워커 파일 경로
  skipWaiting: true, // 서비스 워커 강제 업데이트
  // runtimeCaching은 GenerateSW에서만 사용가능 InjectManifest의 swSrc와 함께 사용할 수 없다.
  runtimeCaching: [
    // 캐싱 설정
    {
      // 이미지 캐싱
      urlPattern: /\.(?:png|jpg|jpeg|svg|gif|ico)$/i,
      handler: 'CacheFirst',
      options: {
        cacheName: 'images',
        expiration: {
          maxEntries: 64,
          maxAgeSeconds: 30 * 24 * 60 * 60, // 30일
        },
      },
    },
    {
      // 정적 리소스 캐싱
      urlPattern: /\.(?:js|css)$/i,
      handler: 'StaleWhileRevalidate',
      options: {
        cacheName: 'static-resources',
      },
    },
  ],
});

// Merge MDX config with Next.js config
export default withPWA(withMDX(nextConfig));
