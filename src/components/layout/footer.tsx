'use client';

import Link from 'next/link';

/**
 * 블로그 푸터 컴포넌트
 * 저작권 정보와 GitHub 링크를 포함합니다.
 */
const Footer = () => {
  return (
    <footer className="border-t mt-24">
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
          <div className="text-muted-foreground text-sm">
            © {new Date().getFullYear()} 까먹을게 분명하기 때문에 기록하는
            블로그. All rights reserved.
          </div>
          <div className="flex space-x-6 text-sm text-muted-foreground">
            <Link
              href="/about"
              className="hover:text-foreground transition-colors"
            >
              About
            </Link>
            <Link
              href="/contact"
              className="hover:text-foreground transition-colors"
            >
              Contact
            </Link>
            <Link
              href="/api/rss"
              target="_blank"
              className="hover:text-foreground transition-colors flex items-center"
            >
              <svg
                role="img"
                aria-label="RSS icon"
                viewBox="0 0 24 24"
                width="16"
                height="16"
                xmlns="http://www.w3.org/2000/svg"
                className="mr-1"
              >
                <path
                  d="M4.259 3.09c1.187-.108 2.35.39 3.2 1.24.85.85 1.348 2.013 1.24 3.2-.108 1.187-.69 2.3-1.6 3.2-.91.91-2.013 1.492-3.2 1.6-1.187.108-2.35-.39-3.2-1.24-.85-.85-1.348-2.013-1.24-3.2.108-1.187.69-2.3 1.6-3.2.91-.91 2.013-1.492 3.2-1.6zM2.4 6.8c-.44 0-.8.36-.8.8s.36.8.8.8.8-.36.8-.8-.36-.8-.8-.8zm1.6 2.4c0-1.1-.9-2-2-2s-2 .9-2 2 .9 2 2 2 2-.9 2-2zm6.4 0c0-4.4-3.6-8-8-8s-8 3.6-8 8 3.6 8 8 8 8-3.6 8-8zm-8 6.4c-3.5 0-6.4-2.9-6.4-6.4S3.5 2.4 7 2.4s6.4 2.9 6.4 6.4-2.9 6.4-6.4 6.4z"
                  fill="currentColor"
                />
              </svg>
              RSS
            </Link>
            <Link
              href="https://github.com/wonseok-han/my-blog"
              target="_blank"
              className="hover:text-foreground transition-colors flex items-center"
            >
              <svg
                role="img"
                aria-label="GitHub icon"
                viewBox="0 0 98 96"
                width="16"
                height="16"
                xmlns="http://www.w3.org/2000/svg"
                className="mr-1"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M48.854 0C21.839 0 0 22 0 49.217c0 21.756 13.993 40.172 33.405 46.69 2.427.49 3.316-1.059 3.316-2.362 0-1.141-.08-5.052-.08-9.127-13.59 2.934-16.42-5.867-16.42-5.867-2.184-5.704-5.42-7.17-5.42-7.17-4.448-3.015.324-3.015.324-3.015 4.934.326 7.523 5.052 7.523 5.052 4.367 7.496 11.404 5.378 14.235 4.074.404-3.178 1.699-5.378 3.074-6.6-10.839-1.141-22.243-5.378-22.243-24.283 0-5.378 1.94-9.778 5.014-13.2-.485-1.222-2.184-6.275.486-13.038 0 0 4.125-1.304 13.426 5.052a46.97 46.97 0 0 1 12.214-1.63c4.125 0 8.33.571 12.213 1.63 9.302-6.356 13.427-5.052 13.427-5.052 2.67 6.763.97 11.816.485 13.038 3.155 3.422 5.015 7.822 5.015 13.2 0 18.905-11.404 23.06-22.324 24.283 1.78 1.548 3.316 4.481 3.316 9.126 0 6.6-.08 11.897-.08 13.526 0 1.304.89 2.853 3.316 2.364 19.412-6.52 33.405-24.935 33.405-46.691C97.707 22 75.788 0 48.854 0z"
                  fill="currentColor"
                />
              </svg>
              GitHub
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
