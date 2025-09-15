import React from 'react';
import { Skeleton } from './skeleton';

/**
 * 페이지 스켈레톤 컴포넌트
 */
function MobilePageSkeleton() {
  return (
    <div className="min-h-screen bg-background md:hidden">
      {/* 모바일 헤더 스켈레톤 */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="px-4">
          <div className="flex h-14 items-center justify-between">
            {/* 로고 */}
            <Skeleton className="h-6 w-24" />

            {/* 햄버거 메뉴 + 검색 */}
            <div className="flex items-center space-x-2">
              <Skeleton className="h-8 w-8 rounded-md" />
              <Skeleton className="h-8 w-8 rounded-md" />
            </div>
          </div>
        </div>
      </header>

      {/* 모바일 메인 컨텐츠 */}
      <main className="flex-1">
        <div className="px-4 py-6">
          {/* 페이지 제목 영역 */}
          <div className="mb-6">
            <Skeleton className="h-6 w-48 mb-3" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-3/4 mt-1" />
          </div>

          {/* 모바일 필터 영역 */}
          <div className="mb-6 flex gap-2 overflow-x-auto pb-2">
            <Skeleton className="h-8 w-16 flex-shrink-0" />
            <Skeleton className="h-8 w-20 flex-shrink-0" />
            <Skeleton className="h-8 w-14 flex-shrink-0" />
            <Skeleton className="h-8 w-18 flex-shrink-0" />
          </div>

          {/* 모바일 포스트 리스트 스켈레톤 */}
          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="rounded-lg border bg-card p-4">
                <div className="flex gap-3">
                  {/* 썸네일 */}
                  <Skeleton className="h-20 w-20 flex-shrink-0 rounded-md" />

                  {/* 내용 */}
                  <div className="flex-1 space-y-2">
                    {/* 카테고리 */}
                    <Skeleton className="h-3 w-16" />

                    {/* 제목 */}
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-4/5" />

                    {/* 설명 */}
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-3 w-3/4" />

                    {/* 날짜 */}
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* 모바일 푸터 스켈레톤 */}
      <footer className="border-t bg-background">
        <div className="px-4 py-6">
          <div className="space-y-4">
            <Skeleton className="h-5 w-32 mx-auto" />
            <div className="flex justify-center space-x-4">
              <Skeleton className="h-6 w-6" />
              <Skeleton className="h-6 w-6" />
              <Skeleton className="h-6 w-6" />
            </div>
            <Skeleton className="h-3 w-48 mx-auto" />
          </div>
        </div>
      </footer>
    </div>
  );
}

/**
 * 데스크톱용 페이지 스켈레톤 컴포넌트
 */
function DesktopPageSkeleton() {
  return (
    <div className="min-h-screen bg-background hidden md:block">
      {/* 데스크톱 헤더 스켈레톤 */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            {/* 로고 */}
            <Skeleton className="h-8 w-32" />

            {/* 네비게이션 */}
            <nav className="flex items-center space-x-8">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-16" />
            </nav>

            {/* 검색 버튼 */}
            <div className="flex items-center space-x-2">
              <Skeleton className="h-9 w-9 rounded-md" />
              <Skeleton className="h-9 w-9 rounded-md" />
            </div>
          </div>
        </div>
      </header>

      {/* 데스크톱 메인 컨텐츠 */}
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          {/* 페이지 제목 영역 */}
          <div className="mb-8">
            <Skeleton className="h-8 w-64 mb-4" />
            <Skeleton className="h-4 w-96 max-w-full" />
          </div>

          {/* 필터 영역 */}
          <div className="mb-8 flex flex-wrap gap-4">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-28" />
            <Skeleton className="h-10 w-20" />
          </div>

          {/* 데스크톱 포스트 그리드 스켈레톤 */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="group relative overflow-hidden rounded-lg border bg-card text-card-foreground shadow-sm"
              >
                {/* 썸네일 */}
                <Skeleton className="aspect-video w-full" />

                {/* 카드 내용 */}
                <div className="p-6 space-y-3">
                  {/* 카테고리 */}
                  <Skeleton className="h-4 w-20" />

                  {/* 제목 */}
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-6 w-3/4" />

                  {/* 설명 */}
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />

                  {/* 태그 */}
                  <div className="flex flex-wrap gap-2">
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="h-6 w-20" />
                    <Skeleton className="h-6 w-14" />
                  </div>

                  {/* 날짜 */}
                  <Skeleton className="h-4 w-32" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* 데스크톱 푸터 스켈레톤 */}
      <footer className="border-t bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-4">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-4 w-48" />
            </div>
            <div className="space-y-4">
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-28" />
            </div>
            <div className="space-y-4">
              <Skeleton className="h-6 w-20" />
              <div className="flex space-x-2">
                <Skeleton className="h-8 w-8" />
                <Skeleton className="h-8 w-8" />
                <Skeleton className="h-8 w-8" />
              </div>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t">
            <Skeleton className="h-4 w-64 mx-auto" />
          </div>
        </div>
      </footer>
    </div>
  );
}

/**
 * 전체 페이지 로딩을 위한 반응형 스켈레톤 컴포넌트
 */
export function PageSkeleton() {
  return (
    <>
      <MobilePageSkeleton />
      <DesktopPageSkeleton />
    </>
  );
}
