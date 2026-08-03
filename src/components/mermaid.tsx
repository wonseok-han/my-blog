'use client';

import { useEffect, useId, useState } from 'react';
import { useTheme } from 'next-themes';
import { Skeleton } from '@components/skeleton/skeleton';
import Zoomable from '@components/zoomable';

interface MermaidProps {
  code: string;
}

/**
 * mermaid 코드블록을 다이어그램으로 렌더링하는 클라이언트 컴포넌트
 * 테마(light/dark)에 따라 mermaid 테마를 전환합니다.
 */
export default function Mermaid({ code }: MermaidProps) {
  const [svg, setSvg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { resolvedTheme } = useTheme();
  // useId는 ':' 등 CSS 선택자로 쓸 수 없는 문자를 포함하므로 제거
  const id = useId().replace(/[^a-zA-Z0-9]/g, '');

  useEffect(() => {
    let cancelled = false;
    const isDark = resolvedTheme === 'dark';

    // 기본 노드는 파스텔 블루 카드, subgraph는 반투명 레이어
    // (개별 다이어그램에서 classDef/style로 노드별 색을 지정할 수 있음)
    const themeVariables = isDark
      ? {
          background: '#1f1f23',
          mainBkg: '#3b82f629',
          primaryColor: '#3b82f629',
          primaryTextColor: '#e7e7ea',
          textColor: '#e7e7ea',
          // subgraph 제목 색 (미지정 시 다크모드에서도 검정으로 남음)
          titleColor: '#e7e7ea',
          primaryBorderColor: '#3b82f6',
          nodeBorder: '#3b82f6',
          lineColor: '#8a8a96',
          clusterBkg: 'rgba(255, 255, 255, 0.04)',
          clusterBorder: '#3a3a44',
          edgeLabelBackground: '#26262c',
          fontSize: '14px',
        }
      : {
          background: '#ffffff',
          mainBkg: '#dbeafe',
          primaryColor: '#dbeafe',
          primaryTextColor: '#27272a',
          textColor: '#27272a',
          titleColor: '#27272a',
          primaryBorderColor: '#60a5fa',
          nodeBorder: '#60a5fa',
          lineColor: '#94949f',
          // 반투명이라 중첩 subgraph가 깊어질수록 자연스럽게 짙어짐
          clusterBkg: 'rgba(39, 39, 42, 0.03)',
          clusterBorder: '#dcdce2',
          edgeLabelBackground: '#f4f4f6',
          fontSize: '14px',
        };

    // 번들 크기를 고려해 동적 import
    import('mermaid').then(async ({ default: mermaid }) => {
      mermaid.initialize({
        startOnLoad: false,
        securityLevel: 'strict',
        theme: 'base',
        themeVariables,
        fontFamily: 'inherit',
        flowchart: {
          // subgraph 제목의 상하 여백
          subGraphTitleMargin: { top: 8, bottom: 8 },
        },
        // 노드·subgraph 모서리 둥글게
        themeCSS: '.node rect, .cluster rect { rx: 10px; ry: 10px; }',
      });

      try {
        const { svg: rendered } = await mermaid.render(
          `mermaid-${id}`,
          code.trim()
        );
        if (!cancelled) {
          setSvg(rendered);
          setError(null);
        }
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : String(e));
        }
        // mermaid.render 실패 시 DOM에 남는 에러 요소 제거
        document.getElementById(`dmermaid-${id}`)?.remove();
        document.getElementById(`mermaid-${id}`)?.remove();
      }
    });

    return () => {
      cancelled = true;
    };
  }, [code, resolvedTheme, id]);

  if (error) {
    // 렌더링 실패 시 원본 코드를 그대로 노출
    return (
      <pre className="overflow-x-auto rounded-lg border bg-card p-4 my-6 text-sm">
        <code>{code}</code>
      </pre>
    );
  }

  if (!svg) {
    return <Skeleton className="h-64 w-full rounded-lg my-6" />;
  }

  return (
    <Zoomable
      as="div"
      label="다이어그램 확대해서 보기"
      zoom={
        <div
          className="rounded-lg bg-background p-6 [&_svg]:h-auto [&_svg]:w-[88vw] [&_svg]:!max-w-none"
          dangerouslySetInnerHTML={{ __html: svg }}
        />
      }
    >
      <div
        className="my-6 flex justify-center overflow-x-auto [&_svg]:max-w-full [&_svg]:h-auto"
        dangerouslySetInnerHTML={{ __html: svg }}
      />
    </Zoomable>
  );
}
