'use client';

import { useState, useMemo } from 'react';
import { Input } from '@/components/ui/input';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import InfinitePosts from '@/app/posts/components/infinite-posts';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, Filter, Calendar, Tag, TrendingUp, X } from 'lucide-react';
import Link from 'next/link';
import { PostsResponseType } from '@typings/post';

interface PostsPageClientProps {
  categories: string[];
  allTags: string[];
  initialPosts: PostsResponseType;
}

/**
 * 포스트 목록 페이지의 클라이언트 기능 (검색, 필터링, 무한스크롤)
 */
const PostsPageClient = ({
  categories,
  allTags,
  initialPosts,
}: PostsPageClientProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('latest');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const { posts, filters } = initialPosts;
  const recentPosts = posts.slice(0, 5);

  // 검색 제안어 생성
  const searchSuggestions = useMemo(() => {
    const suggestions = new Set<string>();

    // 태그에서 제안어 생성
    allTags.forEach((tag) => {
      suggestions.add(tag);
    });

    // 카테고리에서 제안어 생성
    categories.forEach((category) => {
      suggestions.add(category);
    });

    return Array.from(suggestions);
  }, [allTags, categories]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      <div className="lg:col-span-3">
        {/* Search and Filter Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-5 top-1/2 -translate-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="포스트 검색..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSuggestions(e.target.value.length > 0);
              }}
              onFocus={() => setShowSuggestions(searchQuery.length > 0)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              className="pl-10"
            />

            {/* Search Suggestions */}
            {showSuggestions && searchSuggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-background border rounded-md shadow-lg z-10 max-h-60 overflow-y-auto">
                {searchSuggestions
                  .filter((suggestion) =>
                    suggestion.toLowerCase().includes(searchQuery.toLowerCase())
                  )
                  .slice(0, 5)
                  .map((suggestion, index) => (
                    <button
                      key={index}
                      className="w-full px-4 py-2 text-left hover:bg-muted text-sm"
                      onClick={() => {
                        setSearchQuery(suggestion);
                        setShowSuggestions(false);
                      }}
                    >
                      {suggestion}
                    </button>
                  ))}
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
              <SelectTrigger className="w-40" size="default">
                <Filter className="h-4 w-4" />
                <SelectValue placeholder="카테고리" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">모든 카테고리</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-32" size="default">
                <SelectValue placeholder="정렬" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="latest">최신순</SelectItem>
                <SelectItem value="title">제목순</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Active Filters */}
        {
          <div className="flex flex-wrap gap-2 mb-4">
            {searchQuery && (
              <Badge variant="secondary" className="gap-1 !font-light">
                검색: &quot;{searchQuery}&quot;
                <button
                  onClick={() => setSearchQuery('')}
                  className="rounded-full p-1  hover:bg-primary hover:text-primary-foreground"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}

            {selectedCategory !== 'all' && (
              <Badge variant="secondary" className="gap-1 !font-light">
                카테고리: {selectedCategory}
                <button
                  onClick={() => setSelectedCategory('all')}
                  className="rounded-full p-1  hover:bg-primary hover:text-primary-foreground"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}

            {selectedTags.length > 0 && (
              <Badge variant="secondary" className="gap-1 !font-light">
                태그: {selectedTags.join(', ')}
                <button
                  onClick={() => setSelectedTags([])}
                  className="rounded-full p-1  hover:bg-primary hover:text-primary-foreground"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
          </div>
        }

        {/* 포스트 목록 - 항상 무한스크롤 사용 */}
        <InfinitePosts
          search={searchQuery}
          category={selectedCategory}
          sortBy={sortBy}
          limit={10}
          tags={selectedTags}
        />
      </div>

      {/* Sidebar */}

      <aside className="space-y-6">
        {/* Recent Posts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <TrendingUp className="h-5 w-5" />
              최근 포스트
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentPosts.map((post) => (
              <Link
                key={post.slug}
                href={`/posts/${post.slug}`}
                className="space-y-2 block w-full text-left hover:bg-muted/50 p-2 rounded-md transition-colors"
              >
                <h4 className="line-clamp-2 hover:text-primary transition-colors text-sm">
                  {post.title}
                </h4>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  <time dateTime={post.created}>
                    {new Date(post.created).toLocaleDateString('ko-KR', {
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: false,
                      timeZone:
                        Intl.DateTimeFormat().resolvedOptions().timeZone,
                    })}
                  </time>
                </div>
              </Link>
            ))}
          </CardContent>
        </Card>

        <Card className="sticky top-20 lg:overflow-y-auto lg:max-h-[calc(100vh-10rem)] flex flex-col gap-6">
          {/* Categories */}
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Filter className="h-5 w-5" />
              카테고리
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button
              variant={selectedCategory === 'all' ? 'secondary' : 'ghost'}
              className="w-full justify-start text-sm"
              onClick={() => setSelectedCategory('all')}
            >
              전체 ({initialPosts.pagination.total})
            </Button>
            {categories.map((category) => {
              const count = filters.totalCategories[category];
              return (
                <Button
                  key={category}
                  variant={
                    selectedCategory === category ? 'secondary' : 'ghost'
                  }
                  className="w-full justify-start text-sm"
                  onClick={() => {
                    setSelectedCategory(category);
                    scrollTo({
                      top: 0,
                      behavior: 'smooth',
                    });
                  }}
                >
                  {category} ({count})
                </Button>
              );
            })}
          </CardContent>

          <hr className="mx-5 border-t-2 border-muted-foreground/30" />

          {/* Tags */}
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Tag className="h-5 w-5" />
              인기 태그
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {allTags.slice(0, 15).map((tag) => (
                <Badge
                  key={tag}
                  variant={selectedTags.includes(tag) ? 'default' : 'outline'}
                  className={'text-xs cursor-pointer hover:bg-muted'}
                  onClick={() => {
                    if (selectedTags.includes(tag)) {
                      setSelectedTags(selectedTags.filter((t) => t !== tag));
                    } else {
                      setSelectedTags([...selectedTags, tag]);
                    }

                    scrollTo({
                      top: 0,
                      behavior: 'smooth',
                    });
                  }}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </aside>
    </div>
  );
};

export default PostsPageClient;
