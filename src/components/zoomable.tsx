'use client';

import * as Dialog from '@radix-ui/react-dialog';
import { Minus, Plus, X } from 'lucide-react';
import React, { useState } from 'react';

const MIN_SCALE = 0.5;
const MAX_SCALE = 3;
const SCALE_STEP = 0.25;

interface ZoomableProps {
  /** 본문에 표시되는 원본 콘텐츠 */
  children: React.ReactNode;
  /** 모달에 표시할 확대 콘텐츠 (미지정 시 children 재사용) */
  zoom?: React.ReactNode;
  /** 접근성 라벨 */
  label?: string;
  /** 래퍼 요소 — 이미지는 p 안에 오므로 span, 다이어그램은 div */
  as?: 'span' | 'div';
}

/**
 * 클릭하면 모달로 확대해서 보여주는 래퍼 컴포넌트
 * 이미지, mermaid 다이어그램 등 시각 콘텐츠에 사용합니다.
 * 모달 내에서 -/+ 버튼으로 배율을 조절할 수 있습니다.
 */
export default function Zoomable({
  children,
  zoom,
  label = '확대해서 보기',
  as = 'span',
}: ZoomableProps) {
  const [open, setOpen] = useState(false);
  const [scale, setScale] = useState(1);
  const Wrapper = as;

  const handleOpenChange = (next: boolean) => {
    setOpen(next);
    if (next) setScale(1); // 열 때마다 배율 초기화
  };

  return (
    <>
      <Wrapper
        role="button"
        tabIndex={0}
        aria-label={label}
        title={label}
        className="block cursor-zoom-in"
        onClick={() => handleOpenChange(true)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleOpenChange(true);
          }
        }}
      >
        {children}
      </Wrapper>

      <Dialog.Root open={open} onOpenChange={handleOpenChange}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-[9998] bg-black/75 backdrop-blur-sm" />
          <Dialog.Content
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 outline-none sm:p-8"
            onClick={() => handleOpenChange(false)}
          >
            <Dialog.Title className="sr-only">{label}</Dialog.Title>
            <Dialog.Description className="sr-only">
              -/+ 버튼으로 배율을 조절하고, ESC 키 또는 바깥 영역을 클릭하면
              닫힙니다.
            </Dialog.Description>

            <div
              className="max-h-full max-w-full overflow-auto rounded-lg"
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{ zoom: scale }}>{zoom ?? children}</div>
            </div>

            {/* 컨트롤 툴바: [ − | 배율 | + ] 그룹 + 닫기 */}
            <div
              className="absolute right-4 top-4 flex items-center gap-2"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center overflow-hidden rounded-full bg-black/50">
                <button
                  type="button"
                  aria-label="축소"
                  disabled={scale <= MIN_SCALE}
                  onClick={() =>
                    setScale((s) => Math.max(MIN_SCALE, s - SCALE_STEP))
                  }
                  className="p-2 text-white transition-colors hover:bg-white/15 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent"
                >
                  <Minus className="h-5 w-5" />
                </button>
                <span className="min-w-[3.25rem] select-none text-center text-sm font-medium tabular-nums text-white">
                  {Math.round(scale * 100)}%
                </span>
                <button
                  type="button"
                  aria-label="확대"
                  disabled={scale >= MAX_SCALE}
                  onClick={() =>
                    setScale((s) => Math.min(MAX_SCALE, s + SCALE_STEP))
                  }
                  className="p-2 text-white transition-colors hover:bg-white/15 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent"
                >
                  <Plus className="h-5 w-5" />
                </button>
              </div>
              <Dialog.Close asChild>
                <button
                  type="button"
                  aria-label="닫기"
                  className="rounded-full bg-black/50 p-2 text-white transition-colors hover:bg-black/80"
                >
                  <X className="h-5 w-5" />
                </button>
              </Dialog.Close>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
}
