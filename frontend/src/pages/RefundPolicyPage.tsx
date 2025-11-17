import { motion } from 'framer-motion';
import { DollarSign, Clock, CheckCircle, XCircle, AlertTriangle, HelpCircle } from 'lucide-react';

export default function RefundPolicyPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <div className="text-center mb-12">
            <DollarSign className="w-16 h-16 text-primary-600 mx-auto mb-4" />
            <h1 className="text-4xl font-bold mb-4">환불 정책</h1>
            <p className="text-gray-600 dark:text-gray-400">
              최종 업데이트: 2025년 1월 17일
            </p>
          </div>

          {/* Content */}
          <div className="card space-y-8">
            {/* 개요 */}
            <section>
              <h2 className="text-2xl font-bold mb-4">환불 정책 개요</h2>
              <div className="text-gray-700 dark:text-gray-300 space-y-4">
                <p>
                  Web Trends Timeline은 고객 만족을 최우선으로 생각합니다.
                  구매하신 서비스에 만족하지 못하시는 경우, 아래 조건에 따라 환불을 요청하실 수 있습니다.
                </p>
                <div className="bg-gradient-to-r from-primary-50 to-blue-50 dark:from-primary-900/20 dark:to-blue-900/20 p-6 rounded-lg">
                  <h3 className="font-bold text-lg mb-3">핵심 요약</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                      <span>결제 후 7일 이내 전액 환불 가능</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                      <span>구독 취소는 언제든지 가능 (다음 결제일부터 중단)</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                      <span>환불 처리는 영업일 기준 5-7일 소요</span>
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            {/* 환불 가능 조건 */}
            <section>
              <h2 className="text-2xl font-bold mb-4 flex items-center">
                <CheckCircle className="w-6 h-6 mr-2 text-green-600" />
                환불 가능 조건
              </h2>
              <div className="space-y-4">
                <div className="border-l-4 border-green-500 bg-green-50 dark:bg-green-900/20 p-6">
                  <h3 className="font-bold text-lg mb-3 flex items-center">
                    <Clock className="w-5 h-5 mr-2" />
                    1. 7일 이내 전액 환불
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 mb-3">
                    최초 결제일로부터 7일 이내에 환불을 요청하시는 경우, 100% 전액 환불해 드립니다.
                  </p>
                  <div className="bg-white dark:bg-gray-800 p-4 rounded">
                    <h4 className="font-semibold mb-2">환불 대상:</h4>
                    <ul className="text-sm space-y-1 list-disc list-inside ml-2">
                      <li>프리미엄 구독 첫 결제 ($9.99)</li>
                      <li>서비스 이용에 기술적 문제가 있는 경우</li>
                      <li>고객이 서비스에 만족하지 못하는 경우</li>
                    </ul>
                  </div>
                </div>

                <div className="border-l-4 border-blue-500 bg-blue-50 dark:bg-blue-900/20 p-6">
                  <h3 className="font-bold text-lg mb-3">2. 비례 환불</h3>
                  <p className="text-gray-700 dark:text-gray-300 mb-3">
                    7일 경과 후 환불 요청 시, 사용하지 않은 기간에 대해 일할 계산하여 환불해 드립니다.
                  </p>
                  <div className="bg-white dark:bg-gray-800 p-4 rounded">
                    <h4 className="font-semibold mb-2">계산 방식:</h4>
                    <p className="text-sm font-mono bg-gray-100 dark:bg-gray-700 p-2 rounded">
                      환불액 = (구독료 / 30일) × 남은 일수
                    </p>
                    <p className="text-sm mt-2 text-gray-600 dark:text-gray-400">
                      예시: 15일 사용 후 취소 시, 15일분에 해당하는 금액 환불
                    </p>
                  </div>
                </div>

                <div className="border-l-4 border-purple-500 bg-purple-50 dark:bg-purple-900/20 p-6">
                  <h3 className="font-bold text-lg mb-3">3. 서비스 장애로 인한 환불</h3>
                  <p className="text-gray-700 dark:text-gray-300">
                    회사의 귀책사유로 서비스가 24시간 이상 중단된 경우, 해당 기간에 대한 환불 또는
                    서비스 기간 연장을 제공합니다.
                  </p>
                </div>
              </div>
            </section>

            {/* 환불 불가 조건 */}
            <section>
              <h2 className="text-2xl font-bold mb-4 flex items-center">
                <XCircle className="w-6 h-6 mr-2 text-red-600" />
                환불 불가 조건
              </h2>
              <div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-lg">
                <ul className="space-y-3 text-gray-700 dark:text-gray-300">
                  <li className="flex items-start">
                    <XCircle className="w-5 h-5 text-red-600 mr-3 flex-shrink-0 mt-0.5" />
                    <span>
                      <strong>이용약관 위반:</strong> 회원이 이용약관을 위반하여 서비스 이용이 정지된 경우
                    </span>
                  </li>
                  <li className="flex items-start">
                    <XCircle className="w-5 h-5 text-red-600 mr-3 flex-shrink-0 mt-0.5" />
                    <span>
                      <strong>부정 사용:</strong> 타인의 결제 정보를 도용하거나 부정한 방법으로 결제한 경우
                    </span>
                  </li>
                  <li className="flex items-start">
                    <XCircle className="w-5 h-5 text-red-600 mr-3 flex-shrink-0 mt-0.5" />
                    <span>
                      <strong>서비스 악용:</strong> 서비스를 상업적 목적으로 무단 사용하거나 재판매한 경우
                    </span>
                  </li>
                  <li className="flex items-start">
                    <XCircle className="w-5 h-5 text-red-600 mr-3 flex-shrink-0 mt-0.5" />
                    <span>
                      <strong>이중 청구:</strong> 이미 환불을 받은 동일한 결제 건에 대해 재요청하는 경우
                    </span>
                  </li>
                </ul>
              </div>
            </section>

            {/* 환불 신청 방법 */}
            <section>
              <h2 className="text-2xl font-bold mb-4 flex items-center">
                <HelpCircle className="w-6 h-6 mr-2 text-primary-600" />
                환불 신청 방법
              </h2>
              <div className="space-y-4 text-gray-700 dark:text-gray-300">
                <p>환불을 원하시는 경우, 다음 절차에 따라 신청해 주시기 바랍니다.</p>

                <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-6 rounded-lg">
                    <div className="text-3xl font-bold text-primary-600 mb-2">1</div>
                    <h3 className="font-bold mb-2">계정 페이지 접속</h3>
                    <p className="text-sm">
                      로그인 후 "내 계정" 페이지로 이동합니다.
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-6 rounded-lg">
                    <div className="text-3xl font-bold text-purple-600 mb-2">2</div>
                    <h3 className="font-bold mb-2">구독 관리</h3>
                    <p className="text-sm">
                      "구독 취소" 또는 "환불 요청" 버튼을 클릭합니다.
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-6 rounded-lg">
                    <div className="text-3xl font-bold text-green-600 mb-2">3</div>
                    <h3 className="font-bold mb-2">사유 입력</h3>
                    <p className="text-sm">
                      환불 사유를 간단히 작성하고 제출합니다.
                    </p>
                  </div>
                </div>

                <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg flex items-start">
                  <AlertTriangle className="w-5 h-5 text-yellow-600 mr-3 flex-shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-bold mb-1">고객 지원 문의</p>
                    <p>
                      환불 신청이 어려우신 경우, 이메일(<a href="mailto:support@webtrends.com" className="text-primary-600 hover:underline">support@webtrends.com</a>)로
                      문의 주시면 신속하게 처리해 드립니다.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* 환불 처리 기간 */}
            <section>
              <h2 className="text-2xl font-bold mb-4 flex items-center">
                <Clock className="w-6 h-6 mr-2 text-orange-600" />
                환불 처리 기간
              </h2>
              <div className="space-y-4 text-gray-700 dark:text-gray-300">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-800">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                          결제 수단
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                          처리 기간
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                          비고
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">신용카드</td>
                        <td className="px-6 py-4 text-sm">영업일 기준 5-7일</td>
                        <td className="px-6 py-4 text-sm">카드사에 따라 다를 수 있음</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">체크카드</td>
                        <td className="px-6 py-4 text-sm">영업일 기준 3-5일</td>
                        <td className="px-6 py-4 text-sm">은행 영업일 기준</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">기타 결제수단</td>
                        <td className="px-6 py-4 text-sm">영업일 기준 7-10일</td>
                        <td className="px-6 py-4 text-sm">결제 대행사 정책 따름</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                  <p className="text-sm">
                    💡 <strong>참고:</strong> 환불 승인 후 실제 입금까지는 결제 수단 및 금융기관에 따라
                    추가 시간이 소요될 수 있습니다. 환불이 지연되는 경우 고객센터로 문의해 주시기 바랍니다.
                  </p>
                </div>
              </div>
            </section>

            {/* 구독 취소 vs 환불 */}
            <section>
              <h2 className="text-2xl font-bold mb-4">구독 취소 vs 환불의 차이</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="border-2 border-blue-500 rounded-lg p-6">
                  <h3 className="font-bold text-lg text-blue-600 mb-4">구독 취소</h3>
                  <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                    <li className="flex items-start">
                      <CheckCircle className="w-4 h-4 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                      <span>다음 결제일부터 청구 중단</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-4 h-4 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                      <span>현재 구독 기간 종료까지 서비스 이용 가능</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-4 h-4 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                      <span>언제든지 재구독 가능</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-4 h-4 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                      <span>즉시 환불 없음</span>
                    </li>
                  </ul>
                </div>

                <div className="border-2 border-purple-500 rounded-lg p-6">
                  <h3 className="font-bold text-lg text-purple-600 mb-4">환불 요청</h3>
                  <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                    <li className="flex items-start">
                      <CheckCircle className="w-4 h-4 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                      <span>즉시 서비스 이용 종료</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-4 h-4 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                      <span>조건에 따라 환불 진행</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-4 h-4 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                      <span>환불 처리 기간 5-7일 소요</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-4 h-4 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                      <span>환불 사유 입력 필요</span>
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            {/* FAQ */}
            <section className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
              <h2 className="text-2xl font-bold mb-4">자주 묻는 질문 (FAQ)</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-bold mb-2">Q. 구독을 취소하면 즉시 서비스를 이용할 수 없나요?</h3>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    A. 아니요. 구독을 취소하셔도 현재 결제 기간이 종료될 때까지는 프리미엄 서비스를 계속 이용하실 수 있습니다.
                  </p>
                </div>
                <div>
                  <h3 className="font-bold mb-2">Q. 환불 신청 후 얼마나 걸리나요?</h3>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    A. 환불 승인 후 영업일 기준 5-7일 내에 처리됩니다. 금융기관에 따라 실제 입금까지 추가 시간이 소요될 수 있습니다.
                  </p>
                </div>
                <div>
                  <h3 className="font-bold mb-2">Q. 7일이 지나면 환불이 불가능한가요?</h3>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    A. 7일 경과 후에도 환불이 가능하지만, 사용 기간을 제외한 금액만 비례하여 환불됩니다.
                  </p>
                </div>
                <div>
                  <h3 className="font-bold mb-2">Q. 환불 처리 상태를 확인할 수 있나요?</h3>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    A. 네. 계정 페이지의 "결제 내역"에서 환불 진행 상태를 확인하실 수 있습니다.
                  </p>
                </div>
              </div>
            </section>

            {/* 문의 */}
            <section className="border-t pt-8">
              <h2 className="text-2xl font-bold mb-4">추가 문의</h2>
              <div className="bg-gradient-to-r from-primary-50 to-purple-50 dark:from-primary-900/20 dark:to-purple-900/20 p-6 rounded-lg">
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  환불 정책에 대해 추가 문의사항이 있으시거나, 특별한 상황에 대한 환불을 요청하시는 경우
                  고객 지원팀으로 연락 주시기 바랍니다.
                </p>
                <div className="space-y-2 text-sm">
                  <p><strong>이메일:</strong> <a href="mailto:support@webtrends.com" className="text-primary-600 hover:underline">support@webtrends.com</a></p>
                  <p><strong>운영시간:</strong> 평일 09:00 - 18:00 (주말 및 공휴일 제외)</p>
                  <p><strong>평균 응답시간:</strong> 24시간 이내</p>
                </div>
              </div>
            </section>

            {/* 마지막 업데이트 */}
            <section className="text-center text-sm text-gray-500 dark:text-gray-400 pt-8 border-t">
              <p>이 환불 정책은 2025년 1월 17일부터 적용됩니다.</p>
              <p className="mt-2">정책 변경 시 웹사이트를 통해 사전 공지합니다.</p>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
