'use client';

import React from 'react';
import { TOCItem as TOCItemType } from '@/utils/toc';

interface TOCItemProps {
  item: TOCItemType;
  activeId: string | null;
}

/**
 * 목차 아이템 컴포넌트 (클라이언트)
 * 클릭시 해당 제목으로 스크롤하고, 활성 섹션을 하이라이트합니다.
 */
export default function TOCItem({ item, activeId }: TOCItemProps) {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const element = document.getElementById(item.id);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
        inline: 'nearest',
      });

      setTimeout(() => {
        const header =
          (document.querySelector('header') as HTMLElement) ||
          (document.querySelector('[data-header]') as HTMLElement);
        const headerHeight = header ? header.offsetHeight + 20 : 100;

        const rect = element.getBoundingClientRect();
        const currentScroll = window.pageYOffset;
        const targetPosition = currentScroll + rect.top - headerHeight;

        if (targetPosition > 0) {
          window.scrollTo({ top: targetPosition, behavior: 'smooth' });
        }
      }, 50);
    }
  };

  const isActive = activeId === item.id;

  return (
    <div>
      <a
        href={`#${item.id}`}
        onClick={handleClick}
        data-toc-id={item.id}
        className={
          'block text-sm transition-colors cursor-pointer ' +
          (isActive
            ? 'text-blue-600 font-medium underline underline-offset-4'
            : 'hover:text-primary text-muted-foreground')
        }
        style={{ paddingLeft: `${(item.level - 1) * 16}px` }}
      >
        {item.text}
      </a>
      {item.children && (
        <div className="space-y-1">
          {item.children.map((child) => (
            <TOCItem key={child.id} item={child} activeId={activeId} />
          ))}
        </div>
      )}
    </div>
  );
}
