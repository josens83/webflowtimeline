import { motion } from 'framer-motion';
import { Shield, Lock, Eye, Database, UserCheck, Mail } from 'lucide-react';

export default function PrivacyPolicyPage() {
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
            <Shield className="w-16 h-16 text-primary-600 mx-auto mb-4" />
            <h1 className="text-4xl font-bold mb-4">개인정보처리방침</h1>
            <p className="text-gray-600 dark:text-gray-400">
              최종 업데이트: 2025년 1월 17일
            </p>
          </div>

          {/* Content */}
          <div className="card space-y-8">
            {/* 1. 개요 */}
            <section>
              <h2 className="text-2xl font-bold mb-4 flex items-center">
                <Eye className="w-6 h-6 mr-2 text-primary-600" />
                1. 개인정보 수집 및 이용
              </h2>
              <div className="space-y-4 text-gray-700 dark:text-gray-300">
                <p>
                  Web Trends Timeline(이하 "회사")은 다음과 같은 목적으로 개인정보를 수집 및 이용합니다.
                  회사는 수집한 개인정보를 명시한 목적 이외의 용도로는 사용하지 않으며, 이용 목적이 변경될 시에는
                  사전 동의를 구합니다.
                </p>

                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                  <h3 className="font-bold mb-2">수집하는 개인정보 항목</h3>
                  <ul className="list-disc list-inside space-y-1">
                    <li>필수 항목: 이메일 주소, 이름, 비밀번호</li>
                    <li>선택 항목: 프로필 사진, 연락처</li>
                    <li>자동 수집: IP 주소, 쿠키, 서비스 이용 기록, 접속 로그</li>
                  </ul>
                </div>

                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                  <h3 className="font-bold mb-2">수집 및 이용 목적</h3>
                  <ul className="list-disc list-inside space-y-1">
                    <li>회원 가입 및 관리</li>
                    <li>서비스 제공 및 계약 이행</li>
                    <li>결제 및 환불 처리</li>
                    <li>고객 상담 및 불만 처리</li>
                    <li>서비스 개선 및 통계 분석</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* 2. 보유 및 이용기간 */}
            <section>
              <h2 className="text-2xl font-bold mb-4 flex items-center">
                <Database className="w-6 h-6 mr-2 text-purple-600" />
                2. 개인정보 보유 및 이용기간
              </h2>
              <div className="space-y-4 text-gray-700 dark:text-gray-300">
                <p>
                  회사는 법령에 따른 개인정보 보유·이용기간 또는 정보주체로부터 개인정보를 수집 시에
                  동의받은 개인정보 보유·이용기간 내에서 개인정보를 처리·보유합니다.
                </p>

                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-800">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          항목
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          보유기간
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">회원 정보</td>
                        <td className="px-6 py-4 text-sm">회원 탈퇴 시까지</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">결제 정보</td>
                        <td className="px-6 py-4 text-sm">5년 (전자상거래법)</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">접속 로그</td>
                        <td className="px-6 py-4 text-sm">3개월</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">쿠키</td>
                        <td className="px-6 py-4 text-sm">1년</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </section>

            {/* 3. 제3자 제공 */}
            <section>
              <h2 className="text-2xl font-bold mb-4 flex items-center">
                <UserCheck className="w-6 h-6 mr-2 text-orange-600" />
                3. 개인정보의 제3자 제공
              </h2>
              <div className="space-y-4 text-gray-700 dark:text-gray-300">
                <p>
                  회사는 정보주체의 동의, 법률의 특별한 규정 등 개인정보 보호법 제17조 및 제18조에 해당하는
                  경우에만 개인정보를 제3자에게 제공합니다.
                </p>

                <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
                  <h3 className="font-bold mb-2">제3자 제공 현황</h3>
                  <ul className="list-disc list-inside space-y-2">
                    <li>
                      <strong>Stripe:</strong> 결제 처리 (이름, 이메일, 결제 정보)
                    </li>
                    <li>
                      <strong>Google Analytics:</strong> 서비스 분석 (익명화된 사용 데이터)
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            {/* 4. 개인정보 파기 */}
            <section>
              <h2 className="text-2xl font-bold mb-4 flex items-center">
                <Lock className="w-6 h-6 mr-2 text-red-600" />
                4. 개인정보의 파기
              </h2>
              <div className="space-y-4 text-gray-700 dark:text-gray-300">
                <p>
                  회사는 개인정보 보유기간의 경과, 처리목적 달성 등 개인정보가 불필요하게 되었을 때에는
                  지체 없이 해당 개인정보를 파기합니다.
                </p>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="border dark:border-gray-700 p-4 rounded-lg">
                    <h3 className="font-bold mb-2">파기 절차</h3>
                    <p className="text-sm">
                      이용자가 입력한 정보는 목적 달성 후 별도의 DB에 옮겨져 내부 방침 및 기타 관련 법령에 따라
                      일정기간 저장된 후 혹은 즉시 파기됩니다.
                    </p>
                  </div>
                  <div className="border dark:border-gray-700 p-4 rounded-lg">
                    <h3 className="font-bold mb-2">파기 방법</h3>
                    <p className="text-sm">
                      전자적 파일 형태: 기록을 재생할 수 없도록 완전 삭제<br/>
                      종이 문서: 분쇄기로 분쇄하거나 소각
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* 5. 정보주체의 권리 */}
            <section>
              <h2 className="text-2xl font-bold mb-4 flex items-center">
                <Shield className="w-6 h-6 mr-2 text-indigo-600" />
                5. 정보주체의 권리·의무 및 행사방법
              </h2>
              <div className="space-y-4 text-gray-700 dark:text-gray-300">
                <p>
                  정보주체는 회사에 대해 언제든지 다음 각 호의 개인정보 보호 관련 권리를 행사할 수 있습니다.
                </p>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-4 rounded-lg">
                    <h3 className="font-bold mb-2">🔍 열람 요구</h3>
                    <p className="text-sm">개인정보 열람을 요구할 수 있습니다</p>
                  </div>
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-4 rounded-lg">
                    <h3 className="font-bold mb-2">✏️ 정정 요구</h3>
                    <p className="text-sm">오류가 있는 경우 정정을 요구할 수 있습니다</p>
                  </div>
                  <div className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 p-4 rounded-lg">
                    <h3 className="font-bold mb-2">🗑️ 삭제 요구</h3>
                    <p className="text-sm">개인정보 삭제를 요구할 수 있습니다</p>
                  </div>
                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-4 rounded-lg">
                    <h3 className="font-bold mb-2">⛔ 처리정지 요구</h3>
                    <p className="text-sm">개인정보 처리 정지를 요구할 수 있습니다</p>
                  </div>
                </div>

                <p className="text-sm italic">
                  권리 행사는 개인정보 보호법 시행규칙 별지 제8호 서식에 따라 서면, 전자우편 등을 통하여 하실 수 있으며,
                  회사는 이에 대해 지체 없이 조치하겠습니다.
                </p>
              </div>
            </section>

            {/* 6. 개인정보 보호책임자 */}
            <section>
              <h2 className="text-2xl font-bold mb-4 flex items-center">
                <Mail className="w-6 h-6 mr-2 text-green-600" />
                6. 개인정보 보호책임자
              </h2>
              <div className="space-y-4 text-gray-700 dark:text-gray-300">
                <p>
                  회사는 개인정보 처리에 관한 업무를 총괄해서 책임지고, 개인정보 처리와 관련한 정보주체의
                  불만처리 및 피해구제 등을 위하여 아래와 같이 개인정보 보호책임자를 지정하고 있습니다.
                </p>

                <div className="bg-gradient-to-r from-primary-50 to-purple-50 dark:from-primary-900/20 dark:to-purple-900/20 p-6 rounded-lg">
                  <h3 className="font-bold text-lg mb-4">개인정보 보호책임자</h3>
                  <div className="space-y-2">
                    <p><strong>담당자:</strong> 개인정보보호팀</p>
                    <p><strong>이메일:</strong> privacy@webtrends.com</p>
                    <p><strong>전화:</strong> 02-1234-5678</p>
                    <p><strong>주소:</strong> 서울특별시 강남구 테헤란로 123</p>
                  </div>
                </div>
              </div>
            </section>

            {/* 7. 쿠키 정책 */}
            <section>
              <h2 className="text-2xl font-bold mb-4">7. 쿠키(Cookie) 운영 및 거부</h2>
              <div className="space-y-4 text-gray-700 dark:text-gray-300">
                <p>
                  회사는 이용자에게 개별적인 맞춤서비스를 제공하기 위해 이용정보를 저장하고 수시로 불러오는
                  '쿠키(cookie)'를 사용합니다.
                </p>

                <div className="space-y-2">
                  <h3 className="font-bold">쿠키 사용 목적</h3>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>로그인 세션 유지</li>
                    <li>사용자 맞춤 서비스 제공</li>
                    <li>서비스 이용 통계 분석</li>
                  </ul>
                </div>

                <div className="space-y-2">
                  <h3 className="font-bold">쿠키 거부 방법</h3>
                  <p className="text-sm">
                    웹브라우저 상단의 도구 &gt; 인터넷 옵션 &gt; 개인정보 메뉴에서 쿠키 저장을 거부할 수 있습니다.
                    단, 쿠키 저장을 거부할 경우 맞춤형 서비스 이용에 어려움이 발생할 수 있습니다.
                  </p>
                </div>
              </div>
            </section>

            {/* 8. 변경 고지 */}
            <section className="border-t pt-8">
              <h2 className="text-2xl font-bold mb-4">8. 개인정보처리방침 변경</h2>
              <div className="space-y-4 text-gray-700 dark:text-gray-300">
                <p>
                  이 개인정보처리방침은 2025년 1월 17일부터 적용되며, 법령 및 방침에 따른 변경내용의 추가,
                  삭제 및 정정이 있는 경우에는 변경사항의 시행 7일 전부터 공지사항을 통하여 고지할 것입니다.
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  공고일자: 2025년 1월 17일<br/>
                  시행일자: 2025년 1월 17일
                </p>
              </div>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
