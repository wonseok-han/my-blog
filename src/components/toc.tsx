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

  useEffect(() => {
    const updateActiveId = () => {
      // 모바일에서는 스크롤 추적 비활성화
      if (window.innerWidth < 1024) return;

      const headings = allHeadingIds
        .map((id) => document.getElementById(id))
        .filter(Boolean) as HTMLElement[];

      if (headings.length === 0) return;

      const scrollY = window.scrollY;
      const header =
        document.querySelector('header') ||
        document.querySelector('[data-header]');
      const headerHeight = header
        ? (header as HTMLElement).offsetHeight + 100
        : 120;

      let currentActive: string | null = null;
      let minDistance = Number.POSITIVE_INFINITY;

      for (const heading of headings) {
        const rect = heading.getBoundingClientRect();
        const top = rect.top + scrollY - headerHeight;
        const distance = Math.abs(top - scrollY);

        if (top <= scrollY && distance < minDistance) {
          minDistance = distance;
          currentActive = heading.id;
        }
      }

      setActiveId(currentActive);
    };

    // 초기 실행
    updateActiveId();

    // 스크롤 이벤트 리스너
    window.addEventListener('scroll', updateActiveId, { passive: true });
    // 리사이즈 이벤트 리스너 (화면 크기 변경 시)
    window.addEventListener('resize', updateActiveId, { passive: true });

    return () => {
      window.removeEventListener('scroll', updateActiveId);
      window.removeEventListener('resize', updateActiveId);
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
