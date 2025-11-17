import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Home, Search, ArrowLeft, HelpCircle } from 'lucide-react';

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-2xl"
      >
        {/* 404 Animation */}
        <motion.div
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          transition={{
            repeat: Infinity,
            repeatType: "reverse",
            duration: 2,
            ease: "easeInOut"
          }}
          className="mb-8"
        >
          <h1 className="text-9xl font-bold bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
            404
          </h1>
        </motion.div>

        {/* Message */}
        <h2 className="text-3xl font-bold mb-4">페이지를 찾을 수 없습니다</h2>
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
          요청하신 페이지가 존재하지 않거나 이동되었을 수 있습니다.
        </p>

        {/* Icon Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {[
            { icon: '🌐', label: '타임라인' },
            { icon: '📊', label: '비교 분석' },
            { icon: '💡', label: '인사이트' },
            { icon: '🔖', label: '북마크' }
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg"
            >
              <div className="text-3xl mb-2">{item.icon}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">{item.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate(-1)}
            className="btn-secondary flex items-center justify-center"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            이전 페이지로
          </button>
          <button
            onClick={() => navigate('/')}
            className="btn-primary flex items-center justify-center"
          >
            <Home className="w-5 h-5 mr-2" />
            홈으로 가기
          </button>
          <button
            onClick={() => navigate('/timeline')}
            className="btn-secondary flex items-center justify-center"
          >
            <Search className="w-5 h-5 mr-2" />
            타임라인 보기
          </button>
        </div>

        {/* Help Link */}
        <div className="mt-12 pt-8 border-t dark:border-gray-700">
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            문제가 계속되시나요?
          </p>
          <button
            onClick={() => navigate('/contact')}
            className="text-primary-600 hover:text-primary-700 font-semibold inline-flex items-center"
          >
            <HelpCircle className="w-5 h-5 mr-2" />
            고객 지원 센터
          </button>
        </div>
      </motion.div>
    </div>
  );
}
