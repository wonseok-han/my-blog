'use client';

import { useState, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, Filter } from 'lucide-react';
import InfinitePosts from '@/components/infinite-posts';

interface PostsPageClientProps {
  categories: string[];
  allTags: string[];
}

/**
 * 포스트 목록 페이지의 클라이언트 기능 (검색, 필터링, 무한스크롤)
 */
const PostsPageClient = ({ categories, allTags }: PostsPageClientProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('latest');
  const [showSuggestions, setShowSuggestions] = useState(false);

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
    <>
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
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
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

      {/* 포스트 목록 - 항상 무한스크롤 사용 */}
      <InfinitePosts
        search={searchQuery}
        category={selectedCategory}
        sortBy={sortBy}
        limit={10}
      />
    </>
  );
};

export default PostsPageClient;
