import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { TrendingUp, Globe, BarChart3, Zap, Lock, Download } from 'lucide-react';

export default function LandingPage() {
  const features = [
    {
      icon: <Globe className="w-8 h-8" />,
      title: '4개국 웹 트렌드 분석',
      description: '한국, 미국, 일본, 중국의 웹 역사를 한눈에'
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: '시대별 트렌드 추적',
      description: '1990년대부터 2020년대까지 변화 추이'
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: '상세한 비교 분석',
      description: '국가간, 시대간 인터랙티브 비교 도구'
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: '실시간 인사이트',
      description: '데이터 기반 웹 트렌드 인사이트'
    },
    {
      icon: <Lock className="w-8 h-8" />,
      title: '프리미엄 콘텐츠',
      description: '심화 분석과 전문가 리포트'
    },
    {
      icon: <Download className="w-8 h-8" />,
      title: 'PDF/Excel 내보내기',
      description: '데이터를 원하는 형식으로 다운로드'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-600 via-purple-600 to-pink-600 text-white py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              웹 트렌드의 모든 것<br />
              <span className="text-yellow-300">1990s - 2020s</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-100 max-w-3xl mx-auto">
              한국, 미국, 일본, 중국의 웹 트렌드 변화를<br />
              인터랙티브 타임라인으로 탐색하세요
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="px-8 py-4 bg-white text-primary-600 font-bold text-lg rounded-lg hover:bg-gray-100 transition transform hover:scale-105"
              >
                무료로 시작하기
              </Link>
              <Link
                to="/timeline"
                className="px-8 py-4 bg-transparent border-2 border-white text-white font-bold text-lg rounded-lg hover:bg-white hover:text-primary-600 transition transform hover:scale-105"
              >
                타임라인 보기
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Decorative shapes */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-20 h-20 bg-white opacity-10 rounded-full blur-xl"></div>
          <div className="absolute bottom-20 right-10 w-32 h-32 bg-yellow-300 opacity-10 rounded-full blur-xl"></div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              강력한 기능들
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              웹 트렌드 분석을 위한 모든 도구를 제공합니다
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="card hover:shadow-2xl transition-shadow duration-300"
              >
                <div className="text-primary-600 dark:text-primary-400 mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Preview */}
      <section className="py-20 bg-gray-100 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              시대별 웹 트렌드
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              30년 웹 역사를 한눈에
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {['1990s', '2000s', '2010s', '2020s'].map((decade, index) => (
              <motion.div
                key={decade}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="card hover:shadow-2xl transition-all duration-300 cursor-pointer group"
              >
                <div className="text-center">
                  <div className="text-4xl font-bold text-primary-600 dark:text-primary-400 mb-2 group-hover:scale-110 transition-transform">
                    {decade}
                  </div>
                  <p className="text-gray-600 dark:text-gray-400">
                    {decade === '1990s' && '웹의 태동기'}
                    {decade === '2000s' && '포털의 시대'}
                    {decade === '2010s' && '모바일 혁명'}
                    {decade === '2020s' && 'AI & 메타버스'}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              지금 바로 시작하세요
            </h2>
            <p className="text-xl mb-8 text-gray-100">
              무료로 웹 트렌드 타임라인을 탐색해보세요.<br />
              프리미엄으로 업그레이드하면 모든 기능을 이용할 수 있습니다.
            </p>
            <Link
              to="/register"
              className="inline-block px-8 py-4 bg-white text-primary-600 font-bold text-lg rounded-lg hover:bg-gray-100 transition transform hover:scale-105"
            >
              무료로 시작하기
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
