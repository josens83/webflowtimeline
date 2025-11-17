import { useEffect, useState } from 'react';
import { trendsAPI } from '../services/api';
import { TrendData } from '../types';
import { motion } from 'framer-motion';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import {
  TrendingUp, Globe, Code, Palette, Users, Calendar,
  Award, Target, Zap, Activity
} from 'lucide-react';
import { toast } from 'react-toastify';
import ExportButton from '../components/ExportButton';
import { InsightsPageSkeleton } from '../components/LoadingSkeleton';

const COUNTRY_COLORS: { [key: string]: string } = {
  korea: '#3b82f6',
  usa: '#ef4444',
  japan: '#8b5cf6',
  china: '#f59e0b'
};

const COUNTRY_LABELS: { [key: string]: string } = {
  korea: '한국',
  usa: '미국',
  japan: '일본',
  china: '중국'
};

export default function InsightsPage() {
  const [trends, setTrends] = useState<TrendData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadTrends();
  }, []);

  const loadTrends = async () => {
    setIsLoading(true);
    try {
      const response = await trendsAPI.getAll();
      setTrends(response.data.trends || []);
    } catch (error) {
      toast.error('데이터를 불러오는데 실패했습니다');
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate statistics
  const totalWebsites = trends.reduce((sum, t) => sum + t.websites.length, 0);
  const totalTechnologies = new Set(trends.flatMap(t => t.tech_stack)).size;
  const totalDesignTrends = new Set(trends.flatMap(t => t.design_trends)).size;
  const totalCountries = new Set(trends.map(t => t.country)).size;
  const totalDecades = new Set(trends.map(t => t.decade)).size;

  // Websites by country
  const websitesByCountry = Object.keys(COUNTRY_LABELS).map(country => ({
    name: COUNTRY_LABELS[country],
    value: trends
      .filter(t => t.country === country)
      .reduce((sum, t) => sum + t.websites.length, 0),
    color: COUNTRY_COLORS[country]
  }));

  // Trends over decades
  const trendsByDecade = ['1990s', '2000s', '2010s', '2020s'].map(decade => {
    const decadeTrends = trends.filter(t => t.decade === decade);
    return {
      decade,
      한국: decadeTrends.find(t => t.country === 'korea')?.websites.length || 0,
      미국: decadeTrends.find(t => t.country === 'usa')?.websites.length || 0,
      일본: decadeTrends.find(t => t.country === 'japan')?.websites.length || 0,
      중국: decadeTrends.find(t => t.country === 'china')?.websites.length || 0
    };
  });

  // Technology adoption over time
  const techByDecade = ['1990s', '2000s', '2010s', '2020s'].map(decade => ({
    decade,
    technologies: trends
      .filter(t => t.decade === decade)
      .reduce((sum, t) => sum + t.tech_stack.length, 0)
  }));

  // Top technologies across all trends
  const allTech = trends.flatMap(t => t.tech_stack);
  const techFrequency: { [key: string]: number } = {};
  allTech.forEach(tech => {
    techFrequency[tech] = (techFrequency[tech] || 0) + 1;
  });
  const topTechnologies = Object.entries(techFrequency)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([name, count]) => ({ name, count }));

  // Top design trends
  const allDesign = trends.flatMap(t => t.design_trends);
  const designFrequency: { [key: string]: number } = {};
  allDesign.forEach(design => {
    designFrequency[design] = (designFrequency[design] || 0) + 1;
  });
  const topDesignTrends = Object.entries(designFrequency)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([name, count]) => ({ name, count }));

  // Most influential websites (by category frequency)
  const categoryCount: { [key: string]: number } = {};
  trends.forEach(trend => {
    trend.websites.forEach(site => {
      categoryCount[site.category] = (categoryCount[site.category] || 0) + 1;
    });
  });
  const topCategories = Object.entries(categoryCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([name, value]) => ({ name, value }));

  if (isLoading) {
    return <InsightsPageSkeleton />;
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-8">
          <div className="text-center md:text-left mb-4 md:mb-0">
            <h1 className="text-4xl font-bold mb-2 flex items-center justify-center md:justify-start">
              <Activity className="w-10 h-10 mr-3 text-primary-600" />
              인사이트 대시보드
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              웹 트렌드의 변화와 발전을 한눈에 파악하세요
            </p>
          </div>
          {trends.length > 0 && (
            <ExportButton data={trends} filename="insights-report" />
          )}
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="card bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20"
          >
            <Globe className="w-8 h-8 text-blue-600 mb-2" />
            <div className="text-3xl font-bold text-blue-600">{totalWebsites}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">전체 웹사이트</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20"
          >
            <Code className="w-8 h-8 text-purple-600 mb-2" />
            <div className="text-3xl font-bold text-purple-600">{totalTechnologies}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">기술 스택</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="card bg-gradient-to-br from-pink-50 to-pink-100 dark:from-pink-900/20 dark:to-pink-800/20"
          >
            <Palette className="w-8 h-8 text-pink-600 mb-2" />
            <div className="text-3xl font-bold text-pink-600">{totalDesignTrends}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">디자인 트렌드</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="card bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20"
          >
            <Target className="w-8 h-8 text-orange-600 mb-2" />
            <div className="text-3xl font-bold text-orange-600">{totalCountries}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">국가</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="card bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20"
          >
            <Calendar className="w-8 h-8 text-green-600 mb-2" />
            <div className="text-3xl font-bold text-green-600">{totalDecades}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">시대</div>
          </motion.div>
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Websites by Country */}
          <div className="card">
            <h3 className="text-xl font-bold mb-4 flex items-center">
              <Globe className="w-5 h-5 mr-2 text-primary-600" />
              국가별 웹사이트 분포
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={websitesByCountry}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {websitesByCountry.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Trends over Decades */}
          <div className="card">
            <h3 className="text-xl font-bold mb-4 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-purple-600" />
              시대별 웹사이트 트렌드
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={trendsByDecade}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="decade" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="한국" stroke="#3b82f6" strokeWidth={2} />
                <Line type="monotone" dataKey="미국" stroke="#ef4444" strokeWidth={2} />
                <Line type="monotone" dataKey="일본" stroke="#8b5cf6" strokeWidth={2} />
                <Line type="monotone" dataKey="중국" stroke="#f59e0b" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Charts Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Top Technologies */}
          <div className="card">
            <h3 className="text-xl font-bold mb-4 flex items-center">
              <Code className="w-5 h-5 mr-2 text-green-600" />
              인기 기술 TOP 10
            </h3>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={topTechnologies} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={100} />
                <Tooltip />
                <Bar dataKey="count" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Technology Adoption Timeline */}
          <div className="card">
            <h3 className="text-xl font-bold mb-4 flex items-center">
              <Zap className="w-5 h-5 mr-2 text-yellow-600" />
              시대별 기술 채택 현황
            </h3>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={techByDecade}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="decade" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="technologies" fill="#f59e0b" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Charts Row 3 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Top Design Trends */}
          <div className="card">
            <h3 className="text-xl font-bold mb-4 flex items-center">
              <Palette className="w-5 h-5 mr-2 text-pink-600" />
              인기 디자인 트렌드 TOP 8
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={topDesignTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#ec4899" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Top Categories */}
          <div className="card">
            <h3 className="text-xl font-bold mb-4 flex items-center">
              <Award className="w-5 h-5 mr-2 text-indigo-600" />
              주요 웹사이트 카테고리
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={topCategories}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#6366f1" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Insights Summary */}
        <div className="card bg-gradient-to-r from-primary-50 to-purple-50 dark:from-primary-900/20 dark:to-purple-900/20">
          <h3 className="text-2xl font-bold mb-6 flex items-center">
            <TrendingUp className="w-6 h-6 mr-3 text-primary-600" />
            주요 인사이트
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-bold text-lg mb-3 flex items-center">
                <Users className="w-5 h-5 mr-2 text-blue-600" />
                시장 리더
              </h4>
              <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-600 rounded-full mr-2"></span>
                  가장 많은 웹사이트: {websitesByCountry.sort((a, b) => b.value - a.value)[0]?.name}
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-purple-600 rounded-full mr-2"></span>
                  인기 기술: {topTechnologies[0]?.name} ({topTechnologies[0]?.count}회 사용)
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-pink-600 rounded-full mr-2"></span>
                  주요 디자인 트렌드: {topDesignTrends[0]?.name}
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-lg mb-3 flex items-center">
                <Activity className="w-5 h-5 mr-2 text-green-600" />
                발전 추세
              </h4>
              <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-green-600 rounded-full mr-2"></span>
                  웹사이트 수는 2020s에 정점 도달
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-orange-600 rounded-full mr-2"></span>
                  기술 다양성은 시간이 지남에 따라 증가
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-indigo-600 rounded-full mr-2"></span>
                  국가별 웹 생태계가 독특하게 발전
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
