'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { Search, Sun, Moon, Menu, Home, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { useTheme } from 'next-themes';
import SearchModal from '@/components/search-modal';
import Image from 'next/image';

/**
 * 블로그 헤더 컴포넌트
 * 네비게이션, 다크모드 토글, 검색 기능을 포함합니다.
 */
const Header = () => {
  const pathname = usePathname();

  const [isOpen, setIsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchParams = useSearchParams();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // 모달 열기 함수
  const openSearchModal = () => {
    setIsSearchOpen(true);
  };

  // 모달 닫기 함수
  const closeSearchModal = () => {
    setIsSearchOpen(false);
  };

  const navigationItems = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Blog', href: '/posts', icon: BookOpen },
  ];

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <header className="sticky top-0 z-8888 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6 font-normal">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="relative px-3 py-2 rounded-md hover:text-accent-foreground transition-all duration-200 hover:scale-105"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button
                variant="ghost"
                size="icon"
                className="hover:bg-accent hover:text-accent-foreground transition-all duration-200 hover:scale-110"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="left"
              className="w-full z-[8889] overflow-y-auto"
            >
              <div className="flex flex-col h-full">
                <SheetHeader className="text-left pb-8">
                  <SheetTitle className="text-2xl font-bold leading-tight">
                    까먹을게 분명하기 때문에
                  </SheetTitle>
                  <p className="text-base text-muted-foreground font-normal leading-relaxed">
                    개발 경험과 학습을 기록하는 공간
                  </p>
                </SheetHeader>

                {/* Profile Section */}
                <div className="mb-8 p-4 bg-accent/50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                      <Image
                        src="/images/profile.png"
                        alt="Profile"
                        width={500}
                        height={500}
                        sizes="500px"
                        quality={100}
                        loading="lazy"
                        className="rounded-full w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="text-sm font-medium leading-tight">
                        wonseok-han
                      </p>
                      <p className="text-xs text-muted-foreground font-normal leading-tight">
                        Frontend Developer
                      </p>
                    </div>
                  </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 space-y-2">
                  {navigationItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={() => setIsOpen(false)}
                        className={`flex items-center space-x-4 w-full p-4 rounded-lg transition-all duration-200 text-lg font-medium leading-tight ${
                          pathname === item.href
                            ? 'bg-primary text-primary-foreground'
                            : 'hover:bg-accent hover:text-accent-foreground'
                        }`}
                      >
                        <Icon className="h-6 w-6" />
                        <span>{item.name}</span>
                      </Link>
                    );
                  })}
                </nav>

                {/* Footer */}
                <div className="pt-8 border-t">
                  <p className="flex items-center justify-center text-sm text-muted-foreground text-center font-normal leading-relaxed">
                    © {new Date().getFullYear()} 까먹을게 분명하기 때문에
                    기록하는 블로그
                  </p>
                </div>
              </div>
            </SheetContent>
          </Sheet>

          {/* Right side actions */}
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={openSearchModal}
              className="hover:bg-accent hover:text-accent-foreground transition-all duration-200 hover:scale-110"
            >
              <Search className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="hover:bg-accent hover:text-accent-foreground transition-all duration-200 hover:scale-110"
            >
              {mounted && theme === 'dark' ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={closeSearchModal}
        initialQuery={searchParams.get('q') || ''}
      />
    </header>
  );
};

export default Header;
