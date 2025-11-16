import { useEffect, useState } from 'react';
import { trendsAPI } from '../services/api';
import { TrendData, Decade, Country } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Globe, Code, Users, TrendingUp } from 'lucide-react';
import { toast } from 'react-toastify';
import { useAuthStore } from '../store/useAuthStore';
import { Link } from 'react-router-dom';

const DECADES: { value: Decade; label: string; color: string }[] = [
  { value: '1990s', label: '1990년대', color: 'from-blue-500 to-cyan-500' },
  { value: '2000s', label: '2000년대', color: 'from-purple-500 to-pink-500' },
  { value: '2010s', label: '2010년대', color: 'from-orange-500 to-red-500' },
  { value: '2020s', label: '2020년대', color: 'from-green-500 to-teal-500' },
];

const COUNTRIES: { value: Country; label: string; flag: string }[] = [
  { value: 'korea', label: '한국', flag: '🇰🇷' },
  { value: 'usa', label: '미국', flag: '🇺🇸' },
  { value: 'japan', label: '일본', flag: '🇯🇵' },
  { value: 'china', label: '중국', flag: '🇨🇳' },
];

export default function TimelinePage() {
  const [trends, setTrends] = useState<TrendData[]>([]);
  const [selectedDecade, setSelectedDecade] = useState<Decade>('2020s');
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuthStore();

  const isPremium = user?.subscription_status === 'premium';

  useEffect(() => {
    loadTrends();
  }, [selectedDecade, selectedCountry]);

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

  const handleCountryFilter = (country: Country) => {
    if (selectedCountry === country) {
      setSelectedCountry(null);
    } else {
      setSelectedCountry(country);
    }
  };

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

        {/* Decade Selector */}
        <div className="mb-8">
          <div className="flex flex-wrap justify-center gap-4">
            {DECADES.map((decade) => (
              <button
                key={decade.value}
                onClick={() => {
                  setSelectedDecade(decade.value);
                  setSelectedCountry(null);
                }}
                className={`px-6 py-3 rounded-lg font-semibold transition-all transform hover:scale-105 ${
                  selectedDecade === decade.value
                    ? `bg-gradient-to-r ${decade.color} text-white shadow-lg`
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:shadow-md'
                }`}
              >
                {decade.label}
              </button>
            ))}
          </div>
        </div>

        {/* Country Filter */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4 text-center">국가별 필터</h3>
          <div className="flex flex-wrap justify-center gap-3">
            {COUNTRIES.map((country) => (
              <button
                key={country.value}
                onClick={() => handleCountryFilter(country.value)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  selectedCountry === country.value
                    ? 'bg-primary-600 text-white shadow-lg'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:shadow-md'
                }`}
              >
                <span className="mr-2">{country.flag}</span>
                {country.label}
              </button>
            ))}
          </div>
        </div>

        {/* Trends Grid */}
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary-600"></div>
          </div>
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
              {trends.map((trend, index) => (
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

        {trends.length === 0 && !isLoading && (
          <div className="text-center py-20">
            <p className="text-xl text-gray-600 dark:text-gray-400">
              해당 조건의 데이터가 없습니다
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

interface TrendCardProps {
  trend: TrendData;
  index: number;
  isPremium: boolean;
}

function TrendCard({ trend, index, isPremium }: TrendCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const isLocked = trend.is_premium && !isPremium;

  const countryEmoji = {
    korea: '🇰🇷',
    usa: '🇺🇸',
    japan: '🇯🇵',
    china: '🇨🇳',
  }[trend.country];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className={`card relative ${isLocked ? 'opacity-75' : ''}`}
    >
      {isLocked && (
        <div className="absolute inset-0 backdrop-blur-sm bg-white/50 dark:bg-gray-900/50 rounded-xl flex items-center justify-center z-10">
          <div className="text-center p-6">
            <Lock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-lg font-semibold mb-2">프리미엄 전용</p>
            <Link to="/pricing" className="btn-primary inline-block">
              업그레이드
            </Link>
          </div>
        </div>
      )}

      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-2xl font-bold mb-1">
            <span className="mr-2">{countryEmoji}</span>
            {trend.title}
          </h3>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {trend.decade}
          </span>
        </div>
        {trend.is_premium && (
          <span className="premium-badge">Premium</span>
        )}
      </div>

      <p className="text-gray-700 dark:text-gray-300 mb-4">
        {trend.description}
      </p>

      {!isLocked && (
        <>
          {/* Websites */}
          <div className="mb-4">
            <div className="flex items-center mb-2">
              <Globe className="w-5 h-5 mr-2 text-primary-600" />
              <h4 className="font-semibold">주요 웹사이트</h4>
            </div>
            <div className="space-y-2">
              {trend.websites.slice(0, isExpanded ? undefined : 3).map((site, idx) => (
                <div
                  key={idx}
                  className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-semibold">{site.name}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {site.description}
                      </div>
                    </div>
                    <span className="text-xs bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 px-2 py-1 rounded">
                      {site.category}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Design Trends */}
          <div className="mb-4">
            <div className="flex items-center mb-2">
              <Code className="w-5 h-5 mr-2 text-purple-600" />
              <h4 className="font-semibold">디자인 트렌드</h4>
            </div>
            <div className="flex flex-wrap gap-2">
              {trend.design_trends.map((dt, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 rounded-full text-sm"
                >
                  {dt}
                </span>
              ))}
            </div>
          </div>

          {isExpanded && (
            <>
              {/* Tech Stack */}
              <div className="mb-4">
                <div className="flex items-center mb-2">
                  <TrendingUp className="w-5 h-5 mr-2 text-orange-600" />
                  <h4 className="font-semibold">기술 스택</h4>
                </div>
                <div className="flex flex-wrap gap-2">
                  {trend.tech_stack.map((tech, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300 rounded-full text-sm"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* User Behavior */}
              <div className="mb-4">
                <div className="flex items-center mb-2">
                  <Users className="w-5 h-5 mr-2 text-green-600" />
                  <h4 className="font-semibold">사용자 행동</h4>
                </div>
                <div className="flex flex-wrap gap-2">
                  {trend.user_behavior.map((behavior, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-full text-sm"
                    >
                      {behavior}
                    </span>
                  ))}
                </div>
              </div>
            </>
          )}

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="mt-4 text-primary-600 dark:text-primary-400 font-semibold hover:underline"
          >
            {isExpanded ? '접기' : '더 보기'}
          </button>
        </>
      )}
    </motion.div>
  );
}
