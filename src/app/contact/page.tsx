import { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Mail,
  Github,
  MessageCircle,
  Send,
  MapPin,
  Clock,
  Heart,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Contact | 까먹을게 분명하기 때문에 기록하는 블로그',
  description:
    '개발 관련 질문이나 피드백, 또는 단순히 인사하고 싶으시다면 언제든 연락해 주세요!',
  keywords: ['연락처', '문의', '피드백', '개발자', '블로그'],
  authors: [{ name: 'wonseok-han' }],
  openGraph: {
    title: 'Contact | 까먹을게 분명하기 때문에 기록하는 블로그',
    description:
      '개발 관련 질문이나 피드백, 또는 단순히 인사하고 싶으시다면 언제든 연락해 주세요!',
    type: 'website',
    locale: 'ko_KR',
  },
  robots: {
    index: true,
    follow: true,
  },
};

/**
 * Contact 페이지 컴포넌트
 * 연락처 정보와 문의 폼을 제공합니다.
 */
export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* 헤더 섹션 */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Contact</h1>
        <p className="text-xl text-muted-foreground max-w-4xl mx-auto">
          개발 관련 질문이나 피드백, 또는 단순히 인사하고 싶으시다면 언제든
          연락해 주세요!
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        {/* 연락처 정보 */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5" />
                연락처 정보
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">이메일</p>
                  <a
                    href="mailto:your-email@example.com"
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {process.env.NEXT_PUBLIC_ABOUT_EMAIL}
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3">
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
                <div>
                  <p className="text-sm font-medium">GitHub</p>
                  <a
                    href="https://github.com/wonseok-han"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    github.com/wonseok-han
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">위치</p>
                  <p className="text-sm text-muted-foreground">대한민국</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">응답 시간</p>
                  <p className="text-sm text-muted-foreground">
                    보통 24시간 이내
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5" />
                문의 유형
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span className="text-sm">기술 질문 및 조언</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span className="text-sm">블로그 포스트 피드백</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span className="text-sm">협업 제안</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span className="text-sm">일반적인 인사</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 문의 폼 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Send className="h-5 w-5" />
              문의하기
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">이름</Label>
                <Input id="name" placeholder="홍길동" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">이메일</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="example@email.com"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject">제목</Label>
                <Input
                  id="subject"
                  placeholder="문의 제목을 입력해주세요"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">메시지</Label>
                <Textarea
                  id="message"
                  placeholder="문의 내용을 자세히 작성해주세요..."
                  rows={6}
                  required
                />
              </div>

              <Button type="submit" className="w-full">
                <Send className="h-4 w-4 mr-2" />
                메시지 보내기
              </Button>
            </form>

            <div className="mt-4 p-3 bg-muted rounded-md">
              <p className="text-xs text-muted-foreground">
                💡 <strong>참고:</strong> 현재는 데모 폼입니다. 실제 문의는
                이메일을 통해 연락해 주세요!
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 추가 정보 */}
      <div className="mt-12 text-center">
        <Card className="max-w-2xl mx-auto">
          <CardContent className="pt-6">
            <h3 className="text-lg font-semibold mb-2">다른 소통 방법</h3>
            <p className="text-sm text-muted-foreground mb-4">
              이메일 외에도 다양한 방법으로 소통할 수 있습니다.
            </p>
            <div className="flex justify-center gap-4">
              <a
                href="https://github.com/wonseok-han"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                <Github className="h-4 w-4" />
                GitHub Issues
              </a>
              <span className="text-muted-foreground">•</span>
              <a
                href="/posts"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                <MessageCircle className="h-4 w-4" />
                포스트 댓글
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
