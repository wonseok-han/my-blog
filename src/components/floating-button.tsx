'use client';

import { Button } from '@/components/ui/button';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { useState, useEffect } from 'react';

/**
 * 플로팅 버튼 컴포넌트
 * 페이지 상단/하단으로 스크롤하는 버튼을 제공합니다.
 */
const FloatingButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const handleUpClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDownClick = () => {
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed flex flex-col gap-3 bottom-8 right-8 z-50">
      <Button
        variant="outline"
        size="icon"
        className="h-12 w-12 rounded-full shadow-lg hover:shadow-xl transition-all duration-200"
        onClick={handleUpClick}
        aria-label="페이지 상단으로 이동"
      >
        <ChevronUp className="h-5 w-5" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        className="h-12 w-12 rounded-full shadow-lg hover:shadow-xl transition-all duration-200"
        onClick={handleDownClick}
        aria-label="페이지 하단으로 이동"
      >
        <ChevronDown className="h-5 w-5" />
      </Button>
    </div>
  );
};

export default FloatingButton;
