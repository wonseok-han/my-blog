import * as React from 'react';

import { cn } from '@/lib/utils';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

/**
 * 입력 필드 컴포넌트
 * 텍스트 입력을 위한 기본 input 요소입니다.
 */
const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          // 기본 스타일 (마이그레이션 디자인과 동기화)
          'file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground',
          'dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border px-3 py-1 text-base bg-input-background',
          'transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium',
          // 포커스 스타일
          'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
          // 비활성화 스타일
          'disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
          // 에러 상태
          'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = 'Input';

export { Input };
