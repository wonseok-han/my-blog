'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { TOCItem as TOCItemType } from '@/utils/toc';
import TOCItem from '@/components/toc-item';

interface TOCProps {
  items: TOCItemType[];
}

/**
 * 목차 컴포넌트 (클라이언트)
 * 서버에서 생성된 목차 데이터를 받아서 렌더링합니다.
 * 스크롤 위치에 따라 현재 보고 있는 섹션을 하이라이트합니다.
 */
export default function TOC({ items }: TOCProps) {
  // 활성 섹션 ID 상태
  const [activeId, setActiveId] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // 관찰할 모든 헤딩 ID 목록 전개
  const allHeadingIds = useMemo(() => {
    const flatten = (nodes: TOCItemType[]): string[] => {
      const acc: string[] = [];
      for (const n of nodes) {
        acc.push(n.id);
        if (n.children && n.children.length > 0)
          acc.push(...flatten(n.children));
      }
      return acc;
    };
    return flatten(items);
  }, [items]);

  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    // 한국어 주석: 뷰포트에 들어온 헤딩을 추적하여 가장 상단에 가까운 헤딩을 활성화
    const headings = allHeadingIds
      .map((id) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[];

    if (headings.length === 0) return;

    const visibleMap = new Map<string, number>();

    const handleIntersect = (entries: IntersectionObserverEntry[]) => {
      for (const entry of entries) {
        const id = entry.target.getAttribute('id');
        if (!id) continue;
        // 가시 비율 저장
        visibleMap.set(id, entry.isIntersecting ? entry.intersectionRatio : 0);
      }

      // 가장 가시 비율이 높은 헤딩을 활성화
      let maxRatio = 0;
      let currentActive: string | null = null;
      for (const [id, ratio] of visibleMap.entries()) {
        if (ratio > maxRatio) {
          maxRatio = ratio;
          currentActive = id;
        }
      }

      // 상단 오프셋을 고려하여, 아무 것도 안 보이면 현재 스크롤 위치 기준으로 가장 가까운 헤딩 선택
      if (!currentActive) {
        const scrollY = window.scrollY;
        const header =
          document.querySelector('header') ||
          document.querySelector('[data-header]');
        const headerHeight = header
          ? (header as HTMLElement).offsetHeight + 20
          : 100;
        let nearestId: string | null = null;
        let nearestDelta = Number.POSITIVE_INFINITY;
        for (const h of headings) {
          const top =
            h.getBoundingClientRect().top + window.scrollY - headerHeight;
          const delta = Math.abs(top - scrollY);
          if (delta < nearestDelta) {
            nearestDelta = delta;
            nearestId = h.id;
          }
        }
        currentActive = nearestId;
      }

      setActiveId((prev) => (prev === currentActive ? prev : currentActive));
    };

    // 옵저버 생성 (상단 여유를 위해 rootMargin 사용)
    const observer = new IntersectionObserver(handleIntersect, {
      root: null,
      rootMargin: '-20% 0px -60% 0px',
      threshold: [0, 0.1, 0.25, 0.5, 0.75, 1],
    });
    observerRef.current = observer;

    for (const h of headings) observer.observe(h);

    return () => {
      observer.disconnect();
      observerRef.current = null;
    };
  }, [allHeadingIds]);

  // 활성 항목이 변경될 때 TOC 스크롤을 활성 항목으로 맞춤
  useEffect(() => {
    if (!activeId) return;
    const link = containerRef.current?.querySelector(
      `[data-toc-id="${activeId}"]`
    ) as HTMLElement | null;
    if (link) {
      link.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
  }, [activeId]);

  return items.length === 0 ? null : (
    <div ref={containerRef} className="space-y-2">
      {items.map((item) => (
        <TOCItem key={item.id} item={item} activeId={activeId} />
      ))}
    </div>
  );
}
