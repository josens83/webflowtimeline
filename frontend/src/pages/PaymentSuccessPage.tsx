import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Crown } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuthStore } from '../store/useAuthStore';

export default function PaymentSuccessPage() {
  const navigate = useNavigate();
  const checkAuth = useAuthStore((state) => state.checkAuth);

  useEffect(() => {
    // Refresh user data to get updated subscription status
    checkAuth();
  }, [checkAuth]);

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full text-center"
      >
        <div className="card">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="inline-flex items-center justify-center w-20 h-20 bg-green-100 dark:bg-green-900 rounded-full mb-6"
          >
            <CheckCircle className="w-12 h-12 text-green-600 dark:text-green-400" />
          </motion.div>

          <h1 className="text-3xl font-bold mb-4">결제 완료!</h1>

          <div className="mb-6">
            <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-full font-semibold mb-4">
              <Crown className="w-5 h-5 mr-2" />
              프리미엄 회원
            </div>
            <p className="text-gray-600 dark:text-gray-400">
              이제 모든 프리미엄 기능을 이용하실 수 있습니다!
            </p>
          </div>

          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 mb-6 text-left">
            <h3 className="font-semibold mb-3">프리미엄 혜택</h3>
            <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                전체 국가 데이터 (한·미·일·중)
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                무제한 비교 분석
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                PDF/Excel 내보내기
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                API 액세스
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                우선 고객 지원
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => navigate('/timeline')}
              className="w-full btn-primary"
            >
              타임라인 탐색하기
            </button>
            <button
              onClick={() => navigate('/account')}
              className="w-full btn-secondary"
            >
              내 계정 보기
            </button>
          </div>

          <p className="mt-6 text-sm text-gray-500 dark:text-gray-400">
            결제 영수증이 이메일로 전송되었습니다
          </p>
        </div>
      </motion.div>
    </div>
  );
}
