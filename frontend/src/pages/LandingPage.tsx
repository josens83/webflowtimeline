import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { TrendingUp, Globe, BarChart3, Zap, Lock, Download, Sparkles, ArrowRight } from 'lucide-react';

export default function LandingPage() {
  const features = [
    {
      icon: <Globe className="w-6 h-6" />,
      title: '4개국 웹 트렌드 분석',
      description: '한국, 미국, 일본, 중국의 웹 역사를 한눈에',
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: '시대별 트렌드 추적',
      description: '1990년대부터 2020년대까지 변화 추이',
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: '상세한 비교 분석',
      description: '국가간, 시대간 인터랙티브 비교 도구',
      gradient: 'from-orange-500 to-red-500'
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: '실시간 인사이트',
      description: '데이터 기반 웹 트렌드 인사이트',
      gradient: 'from-yellow-500 to-orange-500'
    },
    {
      icon: <Lock className="w-6 h-6" />,
      title: '프리미엄 콘텐츠',
      description: '심화 분석과 전문가 리포트',
      gradient: 'from-indigo-500 to-purple-500'
    },
    {
      icon: <Download className="w-6 h-6" />,
      title: 'PDF/Excel 내보내기',
      description: '데이터를 원하는 형식으로 다운로드',
      gradient: 'from-green-500 to-emerald-500'
    }
  ];

  return (
    <div className="min-h-screen overflow-hidden">
      {/* Hero Section - Linear Style */}
      <section className="relative min-h-[90vh] flex items-center justify-center bg-bg-base">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-grid-pattern opacity-30"></div>
        <div className="absolute inset-0 gradient-mesh"></div>

        {/* Gradient Orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="text-center"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8"
            >
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-text-primary">웹 트렌드 타임라인</span>
            </motion.div>

            {/* Main Headline */}
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight">
              <span className="block text-text-primary">웹 트렌드의</span>
              <span className="block bg-gradient-to-r from-primary via-accent to-purple-600 bg-clip-text text-transparent">
                모든 것
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-xl md:text-2xl text-text-secondary max-w-3xl mx-auto mb-12 leading-relaxed">
              한국, 미국, 일본, 중국의 30년 웹 트렌드 변화를<br />
              <span className="text-text-primary font-semibold">인터랙티브 타임라인</span>으로 탐색하세요
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                to="/register"
                className="group relative px-8 py-4 bg-primary hover:bg-primary-hover text-text-inverse font-semibold text-lg rounded-xl transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/30 flex items-center gap-2"
              >
                무료로 시작하기
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/timeline"
                className="px-8 py-4 bg-surface hover:bg-surface-hover border border-border-default text-text-primary font-semibold text-lg rounded-xl transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
              >
                타임라인 보기
              </Link>
            </div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="flex flex-wrap justify-center gap-8 mt-16 text-sm text-text-tertiary"
            >
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
                <span>4개국 데이터</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
                <span>30년 트렌드</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
                <span>실시간 분석</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section - Bento Grid */}
      <section className="py-32 bg-bg-subtle relative">
        <div className="absolute inset-0 bg-dot-pattern opacity-20"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-text-primary">
              강력한 기능들
            </h2>
            <p className="text-xl text-text-secondary max-w-2xl mx-auto">
              웹 트렌드 분석을 위한 모든 도구를 한 곳에서
            </p>
          </motion.div>

          {/* Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group card-glass hover:scale-[1.02] cursor-pointer"
              >
                {/* Icon with gradient */}
                <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${feature.gradient} mb-4`}>
                  <div className="text-white">
                    {feature.icon}
                  </div>
                </div>

                <h3 className="text-xl font-semibold mb-2 text-text-primary group-hover:text-primary transition-colors">
                  {feature.title}
                </h3>
                <p className="text-text-secondary leading-relaxed">
                  {feature.description}
                </p>

                {/* Hover effect border */}
                <div className="absolute inset-0 rounded-2xl border-2 border-primary/0 group-hover:border-primary/50 transition-all duration-300 pointer-events-none"></div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Preview Section */}
      <section className="py-32 bg-bg-base relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-gradient-to-b from-primary/5 via-transparent to-transparent"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-text-primary">
              시대별 웹 트렌드
            </h2>
            <p className="text-xl text-text-secondary">
              30년 웹 역사를 한눈에
            </p>
          </motion.div>

          {/* Decade Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { decade: '1990s', desc: '웹의 태동기', color: 'from-blue-500 to-cyan-500' },
              { decade: '2000s', desc: '포털의 시대', color: 'from-purple-500 to-pink-500' },
              { decade: '2010s', desc: '모바일 혁명', color: 'from-orange-500 to-red-500' },
              { decade: '2020s', desc: 'AI & 메타버스', color: 'from-emerald-500 to-teal-500' }
            ].map((item, index) => (
              <motion.div
                key={item.decade}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group relative card-glass hover:scale-105 transition-transform duration-300 cursor-pointer overflow-hidden"
              >
                {/* Background gradient on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>

                <div className="relative text-center">
                  <div className={`text-5xl font-bold bg-gradient-to-br ${item.color} bg-clip-text text-transparent mb-3 group-hover:scale-110 transition-transform`}>
                    {item.decade}
                  </div>
                  <p className="text-text-secondary group-hover:text-text-primary transition-colors">
                    {item.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section - Modern */}
      <section className="py-32 bg-bg-subtle relative overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/20 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="card-glass p-12 md:p-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-text-primary">
                지금 바로 시작하세요
              </h2>
              <p className="text-xl text-text-secondary mb-8 leading-relaxed">
                무료로 웹 트렌드 타임라인을 탐색해보세요.<br />
                프리미엄으로 업그레이드하면 모든 기능을 이용할 수 있습니다.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/register"
                  className="group px-8 py-4 bg-primary hover:bg-primary-hover text-text-inverse font-semibold text-lg rounded-xl transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/30 inline-flex items-center justify-center gap-2"
                >
                  무료로 시작하기
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/pricing"
                  className="px-8 py-4 bg-surface hover:bg-surface-hover border border-border-default text-text-primary font-semibold text-lg rounded-xl transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
                >
                  요금제 보기
                </Link>
              </div>

              {/* Trust indicators */}
              <div className="mt-12 pt-8 border-t border-border-subtle flex flex-wrap justify-center gap-6 text-sm text-text-tertiary">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-success rounded-full"></div>
                  <span>무료 체험 가능</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-success rounded-full"></div>
                  <span>카드 등록 불필요</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-success rounded-full"></div>
                  <span>언제든 취소 가능</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
