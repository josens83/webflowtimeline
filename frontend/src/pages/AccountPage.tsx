import { useAuthStore } from '../store/useAuthStore';
import { Crown, Calendar, Mail, User as UserIcon, CreditCard } from 'lucide-react';
import { stripeAPI } from '../services/api';
import { toast } from 'react-toastify';
import { useState } from 'react';

export default function AccountPage() {
  const { user } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);

  const isPremium = user?.subscription_status === 'premium';

  const handleManageSubscription = async () => {
    setIsLoading(true);
    try {
      const response = await stripeAPI.createPortalSession();
      if (response.data.url) {
        window.location.href = response.data.url;
      }
    } catch (error) {
      toast.error('구독 관리 페이지를 불러오는데 실패했습니다');
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">내 계정</h1>

        <div className="grid gap-6">
          {/* Profile Card */}
          <div className="card">
            <h2 className="text-2xl font-bold mb-6">프로필 정보</h2>

            <div className="space-y-4">
              <div className="flex items-center">
                <UserIcon className="w-5 h-5 mr-3 text-gray-500" />
                <div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">이름</div>
                  <div className="font-semibold">{user.name}</div>
                </div>
              </div>

              <div className="flex items-center">
                <Mail className="w-5 h-5 mr-3 text-gray-500" />
                <div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">이메일</div>
                  <div className="font-semibold">{user.email}</div>
                </div>
              </div>

              <div className="flex items-center">
                <Calendar className="w-5 h-5 mr-3 text-gray-500" />
                <div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">가입일</div>
                  <div className="font-semibold">
                    {user.created_at
                      ? new Date(user.created_at).toLocaleDateString('ko-KR')
                      : '-'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Subscription Card */}
          <div className="card">
            <h2 className="text-2xl font-bold mb-6">구독 정보</h2>

            <div className="mb-6">
              {isPremium ? (
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg text-white">
                  <div className="flex items-center">
                    <Crown className="w-6 h-6 mr-3" />
                    <div>
                      <div className="font-bold text-lg">프리미엄 구독 중</div>
                      <div className="text-sm opacity-90">
                        모든 기능을 이용할 수 있습니다
                      </div>
                    </div>
                  </div>
                  <div className="text-2xl font-bold">$9.99/월</div>
                </div>
              ) : (
                <div className="flex items-center justify-between p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
                  <div>
                    <div className="font-bold text-lg">무료 플랜</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      기본 기능만 이용 가능합니다
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-4">
              {isPremium ? (
                <>
                  <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                    <h3 className="font-semibold text-green-800 dark:text-green-300 mb-2">
                      프리미엄 기능
                    </h3>
                    <ul className="space-y-1 text-sm text-green-700 dark:text-green-400">
                      <li>✓ 전체 국가 데이터 접근</li>
                      <li>✓ 무제한 비교 분석</li>
                      <li>✓ PDF/Excel 내보내기</li>
                      <li>✓ API 액세스</li>
                      <li>✓ 우선 지원</li>
                    </ul>
                  </div>

                  <button
                    onClick={handleManageSubscription}
                    disabled={isLoading}
                    className="w-full flex items-center justify-center px-6 py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg font-semibold transition disabled:opacity-50"
                  >
                    <CreditCard className="w-5 h-5 mr-2" />
                    {isLoading ? '처리 중...' : '구독 관리'}
                  </button>

                  <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                    결제 정보 수정, 구독 취소 등을 할 수 있습니다
                  </p>
                </>
              ) : (
                <>
                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                    <h3 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">
                      프리미엄으로 업그레이드하세요
                    </h3>
                    <ul className="space-y-1 text-sm text-blue-700 dark:text-blue-400">
                      <li>✓ 전체 국가 데이터 (한·미·일·중)</li>
                      <li>✓ 상세 비교 분석 도구</li>
                      <li>✓ PDF/Excel 내보내기</li>
                      <li>✓ API 액세스</li>
                      <li>✓ 우선 고객 지원</li>
                    </ul>
                  </div>

                  <a
                    href="/pricing"
                    className="block w-full text-center btn-primary"
                  >
                    프리미엄 시작하기 - $9.99/월
                  </a>
                </>
              )}
            </div>
          </div>

          {/* Usage Stats */}
          <div className="card">
            <h2 className="text-2xl font-bold mb-6">이용 통계</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="text-3xl font-bold text-primary-600 dark:text-primary-400">
                  {isPremium ? '∞' : '제한'}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  월별 조회
                </div>
              </div>

              <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                  {isPremium ? '4' : '2'}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  접근 가능 국가
                </div>
              </div>

              <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">
                  {isPremium ? '✓' : '✗'}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  API 액세스
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
