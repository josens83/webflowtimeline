import { useEffect, useState } from 'react';
import { trendsAPI } from '../services/api';
import { TrendData, Decade, Country } from '../types';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { useAuthStore } from '../store/useAuthStore';
import { Link } from 'react-router-dom';
import { Lock, Globe, Code, TrendingUp } from 'lucide-react';
import { toast } from 'react-toastify';
import ExportButton from '../components/ExportButton';
import { ComparePageSkeleton } from '../components/LoadingSkeleton';

const DECADES: Decade[] = ['1990s', '2000s', '2010s', '2020s'];
const COUNTRIES: { value: Country; label: string; flag: string; color: string }[] = [
  { value: 'korea', label: '한국', flag: '🇰🇷', color: '#3b82f6' },
  { value: 'usa', label: '미국', flag: '🇺🇸', color: '#ef4444' },
  { value: 'japan', label: '일본', flag: '🇯🇵', color: '#8b5cf6' },
  { value: 'china', label: '중국', flag: '🇨🇳', color: '#f59e0b' },
];

export default function ComparePage() {
  const [selectedDecade, setSelectedDecade] = useState<Decade>('2020s');
  const [selectedCountries, setSelectedCountries] = useState<Country[]>(['korea', 'usa']);
  const [comparisonData, setComparisonData] = useState<TrendData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuthStore();

  const isPremium = user?.subscription_status === 'premium';

  useEffect(() => {
    if (isPremium) {
      loadComparison();
    }
  }, [selectedDecade, selectedCountries, isPremium]);

  const loadComparison = async () => {
    if (selectedCountries.length < 2) {
      toast.info('최소 2개 국가를 선택하세요');
      return;
    }

    setIsLoading(true);
    try {
      const response = await trendsAPI.compare(selectedCountries, selectedDecade);
      setComparisonData(response.data.comparison || []);
    } catch (error) {
      toast.error('비교 데이터를 불러오는데 실패했습니다');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleCountry = (country: Country) => {
    if (selectedCountries.includes(country)) {
      if (selectedCountries.length > 1) {
        setSelectedCountries(selectedCountries.filter(c => c !== country));
      } else {
        toast.info('최소 1개 국가는 선택되어야 합니다');
      }
    } else {
      if (selectedCountries.length < 4) {
        setSelectedCountries([...selectedCountries, country]);
      } else {
        toast.info('최대 4개 국가까지 선택 가능합니다');
      }
    }
  };

  if (!isPremium) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="card">
            <Lock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-4">프리미엄 전용 기능</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              비교 분석 기능은 프리미엄 회원만 이용할 수 있습니다.
              전체 국가의 트렌드를 비교하고 심층 분석 인사이트를 얻으세요.
            </p>
            <Link to="/pricing" className="btn-primary inline-block">
              프리미엄 업그레이드 - $9.99/월
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Prepare chart data
  const websiteCountData = comparisonData.map(trend => ({
    country: COUNTRIES.find(c => c.value === trend.country)?.label,
    websites: trend.websites.length,
    fill: COUNTRIES.find(c => c.value === trend.country)?.color
  }));

  const techStackData = comparisonData.map(trend => ({
    country: COUNTRIES.find(c => c.value === trend.country)?.label,
    technologies: trend.tech_stack.length,
    fill: COUNTRIES.find(c => c.value === trend.country)?.color
  }));

  // Radar chart data
  const radarData = [
    {
      metric: '웹사이트 수',
      ...comparisonData.reduce((acc, trend) => ({
        ...acc,
        [COUNTRIES.find(c => c.value === trend.country)?.label || '']: trend.websites.length
      }), {})
    },
    {
      metric: '디자인 트렌드',
      ...comparisonData.reduce((acc, trend) => ({
        ...acc,
        [COUNTRIES.find(c => c.value === trend.country)?.label || '']: trend.design_trends.length
      }), {})
    },
    {
      metric: '기술 스택',
      ...comparisonData.reduce((acc, trend) => ({
        ...acc,
        [COUNTRIES.find(c => c.value === trend.country)?.label || '']: trend.tech_stack.length
      }), {})
    },
    {
      metric: '사용자 행동',
      ...comparisonData.reduce((acc, trend) => ({
        ...acc,
        [COUNTRIES.find(c => c.value === trend.country)?.label || '']: trend.user_behavior.length
      }), {})
    }
  ];

  return (
    <div className="min-h-[calc(100vh-4rem)] py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-8">
          <div className="text-center md:text-left mb-4 md:mb-0">
            <h1 className="text-4xl font-bold mb-2">트렌드 비교 분석</h1>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              국가별 웹 트렌드를 비교하고 인사이트를 발견하세요
            </p>
          </div>
          {comparisonData.length > 0 && (
            <ExportButton
              data={comparisonData}
              filename={`compare-${selectedDecade}-${selectedCountries.join('-')}`}
            />
          )}
        </div>

        {/* Controls */}
        <div className="mb-8 space-y-6">
          {/* Decade Selector */}
          <div>
            <h3 className="text-lg font-semibold mb-3">시대 선택</h3>
            <div className="flex flex-wrap gap-3">
              {DECADES.map((decade) => (
                <button
                  key={decade}
                  onClick={() => setSelectedDecade(decade)}
                  className={`px-6 py-2 rounded-lg font-semibold transition ${
                    selectedDecade === decade
                      ? 'bg-primary-600 text-white shadow-lg'
                      : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:shadow-md'
                  }`}
                >
                  {decade}
                </button>
              ))}
            </div>
          </div>

          {/* Country Selector */}
          <div>
            <h3 className="text-lg font-semibold mb-3">
              비교할 국가 선택 ({selectedCountries.length}/4)
            </h3>
            <div className="flex flex-wrap gap-3">
              {COUNTRIES.map((country) => (
                <button
                  key={country.value}
                  onClick={() => toggleCountry(country.value)}
                  className={`px-4 py-2 rounded-lg font-medium transition ${
                    selectedCountries.includes(country.value)
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
        </div>

        {/* Loading */}
        {isLoading && <ComparePageSkeleton />}

        {/* Charts */}
        {!isLoading && comparisonData.length > 0 && (
          <div className="space-y-8">
            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {comparisonData.map((trend, index) => {
                const country = COUNTRIES.find(c => c.value === trend.country);
                return (
                  <motion.div
                    key={trend.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="card"
                  >
                    <div className="text-center">
                      <div className="text-4xl mb-2">{country?.flag}</div>
                      <h3 className="text-xl font-bold mb-2">{country?.label}</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">웹사이트:</span>
                          <span className="font-semibold">{trend.websites.length}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">기술:</span>
                          <span className="font-semibold">{trend.tech_stack.length}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">트렌드:</span>
                          <span className="font-semibold">{trend.design_trends.length}</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Bar Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Websites Count */}
              <div className="card">
                <h3 className="text-xl font-bold mb-4 flex items-center">
                  <Globe className="w-5 h-5 mr-2 text-primary-600" />
                  주요 웹사이트 수
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={websiteCountData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="country" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="websites" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Tech Stack Count */}
              <div className="card">
                <h3 className="text-xl font-bold mb-4 flex items-center">
                  <Code className="w-5 h-5 mr-2 text-purple-600" />
                  기술 스택 수
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={techStackData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="country" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="technologies" fill="#8b5cf6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Radar Chart */}
            <div className="card">
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-orange-600" />
                종합 비교
              </h3>
              <ResponsiveContainer width="100%" height={400}>
                <RadarChart data={radarData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="metric" />
                  <PolarRadiusAxis />
                  {selectedCountries.map((countryValue) => {
                    const country = COUNTRIES.find(c => c.value === countryValue);
                    return (
                      <Radar
                        key={countryValue}
                        name={country?.label}
                        dataKey={country?.label}
                        stroke={country?.color}
                        fill={country?.color}
                        fillOpacity={0.3}
                      />
                    );
                  })}
                  <Legend />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            {/* Detailed Comparison Table */}
            <div className="card overflow-x-auto">
              <h3 className="text-xl font-bold mb-4">상세 비교</h3>
              <table className="w-full">
                <thead>
                  <tr className="border-b dark:border-gray-700">
                    <th className="text-left py-3 px-4">국가</th>
                    <th className="text-left py-3 px-4">주요 웹사이트</th>
                    <th className="text-left py-3 px-4">디자인 트렌드</th>
                    <th className="text-left py-3 px-4">기술 스택</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonData.map((trend) => {
                    const country = COUNTRIES.find(c => c.value === trend.country);
                    return (
                      <tr key={trend.id} className="border-b dark:border-gray-700">
                        <td className="py-3 px-4">
                          <span className="mr-2">{country?.flag}</span>
                          <strong>{country?.label}</strong>
                        </td>
                        <td className="py-3 px-4">
                          <div className="space-y-1">
                            {trend.websites.slice(0, 3).map((site, idx) => (
                              <div key={idx} className="text-sm">{site.name}</div>
                            ))}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex flex-wrap gap-1">
                            {trend.design_trends.slice(0, 3).map((dt, idx) => (
                              <span key={idx} className="text-xs px-2 py-1 bg-purple-100 dark:bg-purple-900 rounded">
                                {dt}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex flex-wrap gap-1">
                            {trend.tech_stack.slice(0, 3).map((tech, idx) => (
                              <span key={idx} className="text-xs px-2 py-1 bg-orange-100 dark:bg-orange-900 rounded">
                                {tech}
                              </span>
                            ))}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
