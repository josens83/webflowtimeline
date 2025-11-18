/**
 * PricingPage - Subscription Plans
 * Phase 19 리팩토링: Atomic Design 패턴 적용
 */

import { Link } from 'react-router-dom';
import { Check, Crown } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuthStore } from '../store/useAuthStore';
import { stripeAPI } from '../services/api';
import { loadStripe } from '@stripe/stripe-js';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { Card } from '../components/molecules/Card';
import { Button } from '../components/atoms/Button';
import { Badge } from '../components/atoms/Badge';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY || '');

export default function PricingPage() {
  const { isAuthenticated, user } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);

  const handleUpgrade = async () => {
    if (!isAuthenticated) {
      toast.error('로그인이 필요합니다');
      return;
    }

    setIsLoading(true);

    try {
      const response = await stripeAPI.createCheckoutSession();
      const stripe = await stripePromise;

      if (stripe && response.data.sessionId) {
        await stripe.redirectToCheckout({
          sessionId: response.data.sessionId
        });
      }
    } catch (error) {
      toast.error('결제 페이지를 불러오는데 실패했습니다');
    } finally {
      setIsLoading(false);
    }
  };

  const freePlan = {
    name: '무료',
    price: '₩0',
    period: '영구 무료',
    features: [
      '기본 타임라인 뷰',
      '한국 + 1개국 데이터',
      '시대별 주요 트렌드',
      '커뮤니티 지원'
    ],
    limitations: [
      '제한적인 국가 데이터',
      '비교 분석 불가',
      '내보내기 불가',
      'API 액세스 불가'
    ]
  };

  const premiumPlan = {
    name: '프리미엄',
    price: '$9.99',
    period: '월',
    features: [
      '전체 국가 데이터 (한·미·일·중)',
      '무제한 비교 분석',
      '상세 통계 및 차트',
      'PDF/Excel 내보내기',
      'API 액세스',
      '우선 지원',
      '광고 없음',
      '조기 신규 기능 액세스'
    ]
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            간단하고 투명한 가격
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            언제든지 취소 가능하며, 환불 보장
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Free Plan */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card variant="default" padding="lg">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold mb-2">{freePlan.name}</h3>
                <div className="mb-2">
                  <span className="text-4xl font-bold">{freePlan.price}</span>
                </div>
                <p className="text-gray-600 dark:text-gray-400">{freePlan.period}</p>
              </div>

              <div className="space-y-4 mb-8">
                {freePlan.features.map((feature, index) => (
                  <div key={index} className="flex items-start">
                    <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>

              <Link to={isAuthenticated ? '/timeline' : '/register'} className="block w-full">
                <Button variant="secondary" size="lg" fullWidth>
                  {isAuthenticated ? '타임라인 보기' : '무료로 시작하기'}
                </Button>
              </Link>
            </Card>
          </motion.div>

          {/* Premium Plan */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="relative"
          >
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
              <Badge color="primary" size="lg">
                <Crown className="w-4 h-4 mr-1" />
                인기
              </Badge>
            </div>

            <Card variant="default" padding="lg" className="border-4 border-primary-500 dark:border-primary-600">
              <div className="text-center mb-6 mt-2">
                <h3 className="text-2xl font-bold mb-2">{premiumPlan.name}</h3>
                <div className="mb-2">
                  <span className="text-4xl font-bold">{premiumPlan.price}</span>
                  <span className="text-gray-600 dark:text-gray-400">/{premiumPlan.period}</span>
                </div>
                <p className="text-gray-600 dark:text-gray-400">월간 구독, 언제든 취소</p>
              </div>

              <div className="space-y-4 mb-8">
                {premiumPlan.features.map((feature, index) => (
                  <div key={index} className="flex items-start">
                    <Check className="w-5 h-5 text-primary-500 mr-3 flex-shrink-0 mt-0.5" />
                    <span className="font-medium">{feature}</span>
                  </div>
                ))}
              </div>

              {user?.subscription_status === 'premium' ? (
                <div className="w-full text-center py-3 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-200 font-semibold rounded-lg">
                  현재 구독 중
                </div>
              ) : (
                <Button
                  variant="primary"
                  size="lg"
                  fullWidth
                  onClick={handleUpgrade}
                  isLoading={isLoading}
                  loadingText="처리 중..."
                >
                  프리미엄 시작하기
                </Button>
              )}
            </Card>
          </motion.div>
        </div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 max-w-3xl mx-auto"
        >
          <h2 className="text-3xl font-bold text-center mb-8">자주 묻는 질문</h2>

          <div className="space-y-6">
            <Card variant="default" padding="md">
              <h3 className="font-bold text-lg mb-2">언제든지 취소할 수 있나요?</h3>
              <p className="text-gray-600 dark:text-gray-400">
                네, 언제든지 구독을 취소할 수 있습니다. 취소 후에도 결제한 기간까지는 프리미엄 기능을 이용할 수 있습니다.
              </p>
            </Card>

            <Card variant="default" padding="md">
              <h3 className="font-bold text-lg mb-2">환불 정책은 어떻게 되나요?</h3>
              <p className="text-gray-600 dark:text-gray-400">
                결제 후 7일 이내에 전액 환불이 가능합니다. 그 이후에는 남은 기간에 대해 일할 계산으로 환불해드립니다.
              </p>
            </Card>

            <Card variant="default" padding="md">
              <h3 className="font-bold text-lg mb-2">결제 수단은 무엇을 사용할 수 있나요?</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Stripe를 통해 신용카드, 체크카드를 사용할 수 있습니다. 안전하고 보안이 철저한 결제 시스템을 사용합니다.
              </p>
            </Card>

            <Card variant="default" padding="md">
              <h3 className="font-bold text-lg mb-2">팀 요금제도 있나요?</h3>
              <p className="text-gray-600 dark:text-gray-400">
                현재는 개인 요금제만 제공하고 있습니다. 팀 요금제는 곧 출시 예정입니다.
              </p>
            </Card>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
