'use client';

import { useState, useMemo, useEffect } from 'react';
import { PostType } from '@/types/post';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, Filter, Calendar, Tag, TrendingUp, X } from 'lucide-react';
import Link from 'next/link';
import { searchPosts, getSearchSuggestions } from '@/utils/search';
import PostCard from '@/components/post-card';

interface PostsPageClientProps {
  posts: PostType[];
}

/**
 * 포스트 목록 페이지 (클라이언트 컴포넌트)
 * 검색, 필터링, 정렬 기능이 있는 포스트 목록을 표시합니다.
 */
const PostsPageClient = ({ posts }: PostsPageClientProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('latest');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchSuggestions, setSearchSuggestions] = useState<string[]>([]);

  // Get unique categories from posts
  const categories = useMemo(
    () =>
      Array.from(new Set(posts.map((post) => post.category).filter(Boolean))),
    [posts]
  );

  // Get all unique tags
  const allTags = useMemo(
    () => Array.from(new Set(posts.flatMap((post) => post.tags || []))),
    [posts]
  );

  // Initialize search suggestions
  useEffect(() => {
    const suggestions = getSearchSuggestions(posts);
    setSearchSuggestions(suggestions);
  }, [posts]);

  // Filter and sort posts
  const filteredPosts = useMemo(() => {
    let filtered = posts;

    // Apply search filter
    if (searchQuery.trim()) {
      filtered = searchPosts(filtered, searchQuery);
    }

    // Apply category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter((post) => post.category === selectedCategory);
    }

    // Apply sorting
    return filtered.sort((a, b) => {
      if (sortBy === 'latest') {
        return new Date(b.created).getTime() - new Date(a.created).getTime();
      }
      return a.title.localeCompare(b.title);
    });
  }, [posts, searchQuery, selectedCategory, sortBy]);

  // Get recent posts for sidebar
  const recentPosts = useMemo(
    () =>
      posts
        .sort(
          (a, b) =>
            new Date(b.created).getTime() - new Date(a.created).getTime()
        )
        .slice(0, 5),
    [posts]
  );

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Page Header */}
      <div className="mb-8 space-y-4">
        <div className="space-y-2">
          <h1 className="text-3xl md:text-4xl">All Posts</h1>
          <p className="text-muted-foreground">
            {searchQuery || selectedCategory !== 'all' ? (
              <>
                <span className="text-primary font-medium">
                  {filteredPosts.length}개
                </span>
                의 검색 결과를 찾았습니다
                {posts.length !== filteredPosts.length && (
                  <span className="text-muted-foreground">
                    {' '}
                    (전체 {posts.length}개 중)
                  </span>
                )}
              </>
            ) : (
              `총 ${posts.length}개의 포스트가 있습니다`
            )}
          </p>
        </div>

        {/* Search and Filter Bar */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
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
              <div className="absolute top-full left-0 right-0 mt-1 bg-background border border-border rounded-md shadow-lg z-10 max-h-60 overflow-y-auto">
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
                  <SelectItem key={category} value={category!}>
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
        {(searchQuery || selectedCategory !== 'all') && (
          <div className="flex flex-wrap gap-2">
            {searchQuery && (
              <Badge variant="secondary" className="gap-1">
                검색: &quot;{searchQuery}&quot;
                <button
                  onClick={() => setSearchQuery('')}
                  className="ml-1 hover:text-foreground"
                >
                  ×
                </button>
              </Badge>
            )}
            {selectedCategory !== 'all' && (
              <Badge variant="secondary" className="gap-1">
                카테고리: {selectedCategory}
                <button
                  onClick={() => setSelectedCategory('all')}
                  className="ml-1 hover:text-foreground"
                >
                  ×
                </button>
              </Badge>
            )}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6">
          {filteredPosts.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredPosts.map((post) => (
                  <Link key={post.slug} href={`/posts/${post.slug}`}>
                    <PostCard {...post} />
                  </Link>
                ))}
              </div>

              {/* Load More */}
              <div className="text-center pt-8">
                <Button variant="outline" size="lg">
                  더 많은 포스트 보기
                </Button>
              </div>
            </>
          ) : (
            <div className="text-center py-16">
              <div className="space-y-4">
                <div className="text-6xl">🔍</div>
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">
                    {searchQuery
                      ? `"${searchQuery}"에 대한 검색 결과가 없습니다`
                      : '검색 조건에 맞는 포스트가 없습니다'}
                  </h3>
                  <p className="text-muted-foreground">
                    {searchQuery ? (
                      <>
                        다른 키워드로 검색해보거나{' '}
                        <button
                          onClick={() => setSearchQuery('')}
                          className="text-primary hover:underline"
                        >
                          검색어를 지워보세요
                        </button>
                      </>
                    ) : (
                      '다른 카테고리를 선택해보세요'
                    )}
                  </p>
                </div>
                {searchQuery && (
                  <div className="pt-4">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSearchQuery('');
                        setSelectedCategory('all');
                      }}
                    >
                      <X className="h-4 w-4 mr-2" />
                      모든 필터 지우기
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
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
                        month: 'short',
                        day: 'numeric',
                      })}
                    </time>
                  </div>
                </Link>
              ))}
            </CardContent>
          </Card>

          {/* Categories */}
          <Card>
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
                전체 ({posts.length})
              </Button>
              {categories.map((category) => {
                const count = posts.filter(
                  (post) => post.category === category
                ).length;
                return (
                  <Button
                    key={category}
                    variant={
                      selectedCategory === category ? 'secondary' : 'ghost'
                    }
                    className="w-full justify-start text-sm"
                    onClick={() => setSelectedCategory(category!)}
                  >
                    {category} ({count})
                  </Button>
                );
              })}
            </CardContent>
          </Card>

          {/* Tags */}
          <Card>
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
                    variant="outline"
                    className="text-xs cursor-pointer hover:bg-secondary"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PostsPageClient;
