'use client';

import { Button } from '@/components/ui/button';
import { ChevronUp, ChevronDown, Check, Share2 } from 'lucide-react';
import { useState } from 'react';

export default function ActionButtons() {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('클립보드 복사 실패:', err);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToBottom = () => {
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  };

  return (
    <div className="lg:fixed lg:left-8 lg:top-1/2 lg:-translate-y-1/2 mb-8 lg:mb-0">
      <div className="flex lg:flex-col gap-2">
        <Button
          size="sm"
          variant="outline"
          className="lg:w-12 lg:h-12"
          onClick={handleCopyLink}
        >
          {copied ? (
            <Check className="h-4 w-4" />
          ) : (
            <Share2 className="h-4 w-4" />
          )}
          <span className="lg:hidden ml-2">
            {copied ? '복사됨!' : '링크 복사'}
          </span>
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="lg:w-12 lg:h-12"
          onClick={scrollToTop}
        >
          <ChevronUp className="h-4 w-4" />
          <span className="lg:hidden ml-2">맨 위로</span>
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="lg:w-12 lg:h-12"
          onClick={scrollToBottom}
        >
          <ChevronDown className="h-4 w-4" />
          <span className="lg:hidden ml-2">맨 아래로</span>
        </Button>
      </div>
    </div>
  );
}
