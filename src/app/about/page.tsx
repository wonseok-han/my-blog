import { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Code,
  Coffee,
  Heart,
  BookOpen,
  Mail,
  Calendar,
  MapPin,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'About | 까먹을게 분명하기 때문에 기록하는 블로그',
  description: '개발자로서의 여정과 학습 과정을 기록하고 공유하는 공간입니다.',
  authors: [{ name: 'wonseok-han' }],
  openGraph: {
    title: 'About | 까먹을게 분명하기 때문에 기록하는 블로그',
    description:
      '개발자로서의 여정과 학습 과정을 기록하고 공유하는 공간입니다.',
  },
};

/**
 * About 페이지 컴포넌트
 * 블로그 소개와 개발자 정보를 표시합니다.
 */
export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* 헤더 섹션 */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">About</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          개발자로서의 여정과 학습 과정을 기록하고 공유하는 공간입니다.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        {/* 개발자 소개 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Code className="h-5 w-5" />
              개발자 소개
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>2018년부터 개발 시작</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>대한민국</span>
            </div>
            <p className="text-sm leading-relaxed">
              프론트엔드 개발에 관심이 많은 개발자입니다. 새로운 기술을 배우고
              적용하는 것을 좋아하며, 특히 사용자 경험을 개선하는 것에 집중하고
              있습니다.
            </p>
          </CardContent>
        </Card>

        {/* 기술 스택 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              기술 스택
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <h4 className="text-sm font-medium mb-2">Frontend</h4>
                <div className="flex flex-wrap gap-2">
                  {['React', 'Next.js', 'TypeScript', 'Tailwind CSS'].map(
                    (tech) => (
                      <Badge key={tech} variant="secondary">
                        {tech}
                      </Badge>
                    )
                  )}
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium mb-2">Backend</h4>
                <div className="flex flex-wrap gap-2">
                  {['Node.js', 'Spring', 'MySQL'].map((tech) => (
                    <Badge key={tech} variant="outline">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium mb-2">Tools</h4>
                <div className="flex flex-wrap gap-2">
                  {['Git', 'Docker', 'Vercel', 'VS Code'].map((tech) => (
                    <Badge key={tech} variant="outline">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 블로그 소개 */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5" />이 블로그에 대해
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm leading-relaxed">
              &quot;까먹을게 분명하기 때문에 기록하는 블로그&quot;는 제가 개발
              과정에서 배운 것들을 기록하고 공유하기 위해 만들었습니다. 새로운
              기술을 학습하거나 문제를 해결하는 과정에서 얻은 경험과 지식을
              정리하여 다른 개발자들과 함께 나누고 싶습니다.
            </p>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <h4 className="font-medium mb-2">주요 주제</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• 웹 개발 기술</li>
                  <li>• 프론트엔드 프레임워크</li>
                  <li>• 개발 도구 및 환경 설정</li>
                  <li>• 문제 해결 과정</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">블로그 특징</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• 실무 경험 기반 내용</li>
                  <li>• 단계별 상세 설명</li>
                  <li>• 코드 예제 포함</li>
                  <li>• 지속적인 업데이트</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 연락처 */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Coffee className="h-5 w-5" />
              연락처
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <a
                href="https://github.com/wonseok-han"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <svg
                  role="img"
                  aria-label="GitHub icon"
                  viewBox="0 0 98 96"
                  width="16"
                  height="16"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M48.854 0C21.839 0 0 22 0 49.217c0 21.756 13.993 40.172 33.405 46.69 2.427.49 3.316-1.059 3.316-2.362 0-1.141-.08-5.052-.08-9.127-13.59 2.934-16.42-5.867-16.42-5.867-2.184-5.704-5.42-7.17-5.42-7.17-4.448-3.015.324-3.015.324-3.015 4.934.326 7.523 5.052 7.523 5.052 4.367 7.496 11.404 5.378 14.235 4.074.404-3.178 1.699-5.378 3.074-6.6-10.839-1.141-22.243-5.378-22.243-24.283 0-5.378 1.94-9.778 5.014-13.2-.485-1.222-2.184-6.275.486-13.038 0 0 4.125-1.304 13.426 5.052a46.97 46.97 0 0 1 12.214-1.63c4.125 0 8.33.571 12.213 1.63 9.302-6.356 13.427-5.052 13.427-5.052 2.67 6.763.97 11.816.485 13.038 3.155 3.422 5.015 7.822 5.015 13.2 0 18.905-11.404 23.06-22.324 24.283 1.78 1.548 3.316 4.481 3.316 9.126 0 6.6-.08 11.897-.08 13.526 0 1.304.89 2.853 3.316 2.364 19.412-6.52 33.405-24.935 33.405-46.691C97.707 22 75.788 0 48.854 0z"
                    fill="currentColor"
                  />
                </svg>
                GitHub
              </a>
              <a
                href={`mailto:${process.env.NEXT_PUBLIC_ABOUT_EMAIL}`}
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <Mail className="h-4 w-4" />
                Email
              </a>
            </div>
            <p className="text-xs text-muted-foreground mt-4">
              궁금한 점이나 피드백이 있으시면 언제든 연락해 주세요!
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
