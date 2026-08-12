import React from 'react';
import { render, screen } from '@testing-library/react';
import { MDXComponent } from '@/components/mdx-component';

jest.mock('react-syntax-highlighter', () => ({
  Prism: ({
    children,
    language,
    style,
  }: {
    children: React.ReactNode;
    language: string;
    style: Record<string, React.CSSProperties>;
  }) => (
    <pre data-language={language}>
      <code>
        <span>[</span>
        <span className="token table" style={style.table}>
          agents
        </span>
        <span>]</span>
        {children}
      </code>
    </pre>
  ),
}));
jest.mock('react-syntax-highlighter/dist/esm/styles/prism', () => ({
  dracula: {},
}));

describe('MDXComponent code blocks', () => {
  it('renders a TOML table header without a nested pre element', () => {
    const Code = MDXComponent.code as React.ElementType;
    const Pre = MDXComponent.pre as React.ElementType;

    const { container } = render(
      <Pre>
        <Code className="language-toml">
          {'[agents]\nmax_concurrent_threads_per_session = 4'}
        </Code>
      </Pre>
    );

    expect(container.querySelectorAll('pre')).toHaveLength(1);
    expect(screen.getByText('agents')).toHaveStyle({ display: 'inline' });
    expect(container.querySelector('pre')).toHaveTextContent(
      '[agents] max_concurrent_threads_per_session = 4'
    );
  });

  it('highlights JSONC blocks with the JSON5 grammar', () => {
    const Code = MDXComponent.code as React.ElementType;

    const { container } = render(
      <Code className="language-jsonc">{'{ "hooks": {} // 훅 등록\n}'}</Code>
    );

    expect(screen.getByText('jsonc')).toBeInTheDocument();
    expect(container.querySelector('pre')).toHaveAttribute(
      'data-language',
      'json5'
    );
  });
});
