'use client';

import { useTheme } from 'next-themes';
import { memo, useEffect, useRef } from 'react';

const Comments = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();

  useEffect(() => {
    if (!ref?.current || ref?.current.hasChildNodes()) return;

    const script = document.createElement('script');
    script.src = 'https://utteranc.es/client.js';
    script.async = true;
    script.setAttribute('repo', 'wonseok-han/my-blog');
    script.setAttribute('issue-term', 'pathname');
    script.setAttribute(
      'theme',
      theme === 'light' ? 'github-light' : 'github-dark'
    );
    script.setAttribute('crossorigin', 'anonymous');

    ref.current?.appendChild(script);
  }, [theme]);

  return <div ref={ref} />;
};

export default memo(Comments);
