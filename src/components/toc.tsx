'use client';

import React from 'react';
import { TOCItem as TOCItemType } from '@/utils/toc';

interface TOCProps {
  items: TOCItemType[];
}

interface TOCItemProps {
  item: TOCItemType;
}

/**
 * 목차 아이템 컴포넌트 (클라이언트)
 * 클릭시 해당 제목으로 스크롤하는 기능을 제공합니다.
 */
function TOCItem({ item }: TOCItemProps) {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const element = document.getElementById(item.id);
    if (element) {
      // scrollIntoView API 사용 (더 정확함)
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
        inline: 'nearest',
      });

      // 헤더 높이만큼 추가 오프셋 적용
      setTimeout(() => {
        const header =
          document.querySelector('header') ||
          document.querySelector('[data-header]');
        const headerHeight = header ? header.offsetHeight + 20 : 100;

        const rect = element.getBoundingClientRect();
        const currentScroll = window.pageYOffset;
        const targetPosition = currentScroll + rect.top - headerHeight;

        if (targetPosition > 0) {
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth',
          });
        }
      }, 50);
    }
  };

  return (
    <div>
      <a
        href={`#${item.id}`}
        onClick={handleClick}
        className="block text-sm hover:text-primary transition-colors cursor-pointer"
        style={{ paddingLeft: `${(item.level - 1) * 16}px` }}
      >
        {item.text}
      </a>
      {item.children && (
        <div className="space-y-1">
          {item.children.map((child) => (
            <TOCItem key={child.id} item={child} />
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * 목차 컴포넌트 (클라이언트)
 * 서버에서 생성된 목차 데이터를 받아서 렌더링합니다.
 */
export default function TOC({ items }: TOCProps) {
  if (items.length === 0) {
    return null;
  }

  return (
    <div className="space-y-2">
      {items.map((item) => (
        <TOCItem key={item.id} item={item} />
      ))}
    </div>
  );
}
