/**
 * TimelinePage - Web Trends Timeline
 * Phase 19 리팩토링: Atomic Design 패턴 적용
 */

import { useEffect, useState, useCallback } from 'react';
import { trendsAPI } from '../services/api';
import { TrendData, Decade, Country } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, FileQuestion } from 'lucide-react';
import { toast } from 'react-toastify';
import { useAuthStore } from '../store/useAuthStore';
import ExportButton from '../components/ExportButton';
import TimelineChart from '../components/TimelineChart';
import { TimelinePageSkeleton } from '../components/LoadingSkeleton';
import EmptyState from '../components/EmptyState';
import { SearchInput } from '../components/molecules/SearchInput';
import { FilterButton } from '../components/molecules/FilterButton';
import { TrendCard } from '../components/organisms/TrendCard';
import { useDebounce } from '../hooks/useDebounce';
import { DECADES_CONFIG, COUNTRIES_CONFIG } from '../config/constants';

export default function TimelinePage() {
  const [trends, setTrends] = useState<TrendData[]>([]);
  const [filteredTrends, setFilteredTrends] = useState<TrendData[]>([]);
  const [selectedDecade, setSelectedDecade] = useState<Decade>('2020s');
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuthStore();

  const isPremium = user?.subscription_status === 'premium';
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  useEffect(() => {
    loadTrends();
  }, [selectedDecade, selectedCountry]);

  useEffect(() => {
    filterTrends();
  }, [trends, debouncedSearchQuery]);

  const loadTrends = async () => {
    setIsLoading(true);
    try {
      let response;
      if (selectedCountry) {
        response = await trendsAPI.getByCountry(selectedCountry);
      } else {
        response = await trendsAPI.getByDecade(selectedDecade);
      }
      setTrends(response.data.trends || []);
    } catch (error) {
      toast.error('데이터를 불러오는데 실패했습니다');
    } finally {
      setIsLoading(false);
    }
  };

  const filterTrends = useCallback(() => {
    if (!debouncedSearchQuery.trim()) {
      setFilteredTrends(trends);
      return;
    }

    const query = debouncedSearchQuery.toLowerCase();
    const filtered = trends.filter(trend => {
      return (
        trend.title.toLowerCase().includes(query) ||
        trend.description.toLowerCase().includes(query) ||
        trend.websites.some(site => site.name.toLowerCase().includes(query)) ||
        trend.design_trends.some(dt => dt.toLowerCase().includes(query)) ||
        trend.tech_stack.some(tech => tech.toLowerCase().includes(query))
      );
    });

    setFilteredTrends(filtered);
  }, [trends, debouncedSearchQuery]);

  const handleDecadeChange = useCallback((decade: Decade) => {
    setSelectedDecade(decade);
    setSelectedCountry(null);
  }, []);

  const handleCountryFilter = useCallback((country: Country) => {
    if (selectedCountry === country) {
      setSelectedCountry(null);
    } else {
      setSelectedCountry(country);
    }
  }, [selectedCountry]);

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  }, []);

  const handleResetSearch = useCallback(() => {
    setSearchQuery('');
  }, []);

  const handleResetAll = useCallback(() => {
    setSearchQuery('');
    setSelectedCountry(null);
    setSelectedDecade('2020s');
  }, []);

  return (
    <div className="min-h-[calc(100vh-4rem)] py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">웹 트렌드 타임라인</h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            1990년대부터 2020년대까지 웹의 진화를 탐색하세요
          </p>
        </div>

        {/* Search and Export */}
        <div className="flex flex-col md:flex-row gap-4 mb-8 items-center justify-between">
          <div className="flex-1 w-full md:max-w-md">
            <SearchInput
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="웹사이트, 기술, 트렌드 검색..."
            />
          </div>
          <ExportButton data={filteredTrends} filename="web-trends-timeline" />
        </div>

        {/* Decade Selector */}
        <div className="mb-8">
          <div className="flex flex-wrap justify-center gap-4">
            {DECADES_CONFIG.map((decade) => (
              <FilterButton
                key={decade.value}
                onClick={() => handleDecadeChange(decade.value)}
                isActive={selectedDecade === decade.value}
                activeGradient={decade.color}
              >
                {decade.label}
              </FilterButton>
            ))}
          </div>
        </div>

        {/* Country Filter */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4 text-center">국가별 필터</h3>
          <div className="flex flex-wrap justify-center gap-3">
            {COUNTRIES_CONFIG.map((country) => (
              <FilterButton
                key={country.value}
                onClick={() => handleCountryFilter(country.value)}
                isActive={selectedCountry === country.value}
                icon={<span className="text-xl">{country.flag}</span>}
              >
                {country.label}
              </FilterButton>
            ))}
          </div>
        </div>

        {/* Timeline Chart */}
        {!isLoading && filteredTrends.length > 0 && !searchQuery && (
          <div className="mb-8">
            <TimelineChart trends={filteredTrends} />
          </div>
        )}

        {/* Trends Grid */}
        {isLoading ? (
          <TimelinePageSkeleton />
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={`${selectedDecade}-${selectedCountry}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {filteredTrends.map((trend, index) => (
                <TrendCard
                  key={trend.id}
                  trend={trend}
                  index={index}
                  isPremium={isPremium}
                />
              ))}
            </motion.div>
          </AnimatePresence>
        )}

        {filteredTrends.length === 0 && !isLoading && (
          <EmptyState
            icon={searchQuery ? Search : FileQuestion}
            title={searchQuery ? '검색 결과가 없습니다' : '데이터가 없습니다'}
            description={
              searchQuery
                ? '다른 키워드로 검색하거나 필터를 변경해보세요.'
                : '해당 조건의 트렌드 데이터가 없습니다. 다른 시대나 국가를 선택해보세요.'
            }
            action={
              searchQuery
                ? {
                    label: '검색 초기화',
                    onClick: handleResetSearch,
                    variant: 'secondary' as const
                  }
                : {
                    label: '전체 타임라인 보기',
                    onClick: handleResetAll,
                    variant: 'primary' as const
                  }
            }
          />
        )}
      </div>
    </div>
  );
}
