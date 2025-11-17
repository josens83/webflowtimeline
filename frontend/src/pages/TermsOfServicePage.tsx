import { motion } from 'framer-motion';
import { FileText, AlertCircle, CreditCard, Ban, Scale, Shield } from 'lucide-react';

export default function TermsOfServicePage() {
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
            <FileText className="w-16 h-16 text-primary-600 mx-auto mb-4" />
            <h1 className="text-4xl font-bold mb-4">이용약관</h1>
            <p className="text-gray-600 dark:text-gray-400">
              최종 업데이트: 2025년 1월 17일
            </p>
          </div>

          {/* Content */}
          <div className="card space-y-8">
            {/* 제1조: 목적 */}
            <section>
              <h2 className="text-2xl font-bold mb-4">제1조 (목적)</h2>
              <div className="text-gray-700 dark:text-gray-300">
                <p>
                  이 약관은 Web Trends Timeline(이하 "회사")이 제공하는 웹 트렌드 분석 서비스(이하 "서비스")의
                  이용과 관련하여 회사와 이용자의 권리, 의무 및 책임사항, 기타 필요한 사항을 규정함을 목적으로 합니다.
                </p>
              </div>
            </section>

            {/* 제2조: 정의 */}
            <section>
              <h2 className="text-2xl font-bold mb-4">제2조 (용어의 정의)</h2>
              <div className="space-y-3 text-gray-700 dark:text-gray-300">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                  <p className="mb-2"><strong>1. "서비스"</strong></p>
                  <p className="text-sm ml-4">
                    회사가 제공하는 웹 트렌드 타임라인 분석, 비교, 인사이트 등 모든 관련 서비스를 의미합니다.
                  </p>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                  <p className="mb-2"><strong>2. "회원"</strong></p>
                  <p className="text-sm ml-4">
                    회사와 서비스 이용계약을 체결하고 회사가 제공하는 서비스를 이용하는 고객을 말합니다.
                  </p>
                </div>
                <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                  <p className="mb-2"><strong>3. "프리미엄 회원"</strong></p>
                  <p className="text-sm ml-4">
                    유료 구독을 통해 프리미엄 서비스를 이용하는 회원을 의미합니다.
                  </p>
                </div>
                <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg">
                  <p className="mb-2"><strong>4. "아이디(ID)"</strong></p>
                  <p className="text-sm ml-4">
                    회원의 식별과 서비스 이용을 위하여 회원이 등록한 이메일 주소를 말합니다.
                  </p>
                </div>
              </div>
            </section>

            {/* 제3조: 약관의 효력 및 변경 */}
            <section>
              <h2 className="text-2xl font-bold mb-4 flex items-center">
                <Scale className="w-6 h-6 mr-2 text-indigo-600" />
                제3조 (약관의 효력 및 변경)
              </h2>
              <div className="space-y-3 text-gray-700 dark:text-gray-300">
                <p>① 이 약관은 서비스를 이용하고자 하는 모든 회원에 대하여 그 효력을 발생합니다.</p>
                <p>
                  ② 회사는 필요하다고 인정되는 경우 이 약관을 변경할 수 있으며, 약관이 변경되는 경우
                  변경된 약관의 적용일자 및 개정사유를 명시하여 현행 약관과 함께 서비스 초기화면에
                  그 적용일자 7일 이전부터 적용일자 전일까지 공지합니다.
                </p>
                <p>
                  ③ 회원은 변경된 약관에 동의하지 않을 경우 회원 탈퇴를 요청할 수 있으며, 변경된 약관의
                  효력 발생일 이후에도 서비스를 계속 사용할 경우 약관의 변경 사항에 동의한 것으로 간주됩니다.
                </p>
              </div>
            </section>

            {/* 제4조: 이용계약의 성립 */}
            <section>
              <h2 className="text-2xl font-bold mb-4">제4조 (이용계약의 성립)</h2>
              <div className="space-y-3 text-gray-700 dark:text-gray-300">
                <p>
                  ① 이용계약은 회원이 되고자 하는 자(이하 "가입신청자")가 약관의 내용에 대하여 동의를 한 다음
                  회원가입신청을 하고 회사가 이러한 신청에 대하여 승낙함으로써 체결됩니다.
                </p>
                <p>
                  ② 회사는 가입신청자의 신청에 대하여 서비스 이용을 승낙함을 원칙으로 합니다.
                  다만, 회사는 다음 각 호에 해당하는 신청에 대하여는 승낙을 하지 않거나 사후에 이용계약을 해지할 수 있습니다.
                </p>
                <div className="ml-6 space-y-2">
                  <p>1. 가입신청자가 이 약관에 의하여 이전에 회원자격을 상실한 적이 있는 경우</p>
                  <p>2. 실명이 아니거나 타인의 명의를 이용한 경우</p>
                  <p>3. 허위의 정보를 기재하거나, 회사가 제시하는 내용을 기재하지 않은 경우</p>
                  <p>4. 부정한 용도로 서비스를 이용하고자 하는 경우</p>
                  <p>5. 기타 관련 법령에 위배되거나 회사가 정한 기준에 미달하는 경우</p>
                </div>
              </div>
            </section>

            {/* 제5조: 서비스의 제공 */}
            <section>
              <h2 className="text-2xl font-bold mb-4 flex items-center">
                <Shield className="w-6 h-6 mr-2 text-green-600" />
                제5조 (서비스의 제공 및 변경)
              </h2>
              <div className="space-y-3 text-gray-700 dark:text-gray-300">
                <p>① 회사는 회원에게 아래와 같은 서비스를 제공합니다.</p>
                <div className="grid md:grid-cols-2 gap-4 my-4">
                  <div className="border dark:border-gray-700 p-4 rounded-lg">
                    <h3 className="font-bold text-primary-600 mb-2">무료 서비스</h3>
                    <ul className="text-sm space-y-1 list-disc list-inside">
                      <li>기본 타임라인 뷰</li>
                      <li>제한적 국가 데이터</li>
                      <li>기본 검색 기능</li>
                      <li>북마크 기능</li>
                    </ul>
                  </div>
                  <div className="border dark:border-gray-700 p-4 rounded-lg">
                    <h3 className="font-bold text-purple-600 mb-2">프리미엄 서비스</h3>
                    <ul className="text-sm space-y-1 list-disc list-inside">
                      <li>전체 국가 데이터</li>
                      <li>고급 비교 분석</li>
                      <li>인사이트 대시보드</li>
                      <li>데이터 내보내기</li>
                    </ul>
                  </div>
                </div>
                <p>
                  ② 회사는 서비스의 내용을 변경할 경우에는 변경사유 및 내용을 회원에게 통지합니다.
                </p>
                <p>
                  ③ 회사는 상당한 이유가 있는 경우 서비스의 전부 또는 일부를 변경하거나 중단할 수 있으며,
                  이에 대하여 관련법에 특별한 규정이 없는 한 회원에게 별도의 보상을 하지 않습니다.
                </p>
              </div>
            </section>

            {/* 제6조: 유료서비스 */}
            <section>
              <h2 className="text-2xl font-bold mb-4 flex items-center">
                <CreditCard className="w-6 h-6 mr-2 text-yellow-600" />
                제6조 (유료서비스 이용 및 결제)
              </h2>
              <div className="space-y-3 text-gray-700 dark:text-gray-300">
                <p>
                  ① 회사가 제공하는 유료서비스를 이용하는 경우 회원은 이용대금을 납부하는 것을 원칙으로 합니다.
                </p>
                <p>
                  ② 유료서비스 이용요금의 결제방법은 회사가 정한 방법에 따르며, 다음 각 호와 같습니다.
                </p>
                <div className="ml-6 space-y-2">
                  <p>1. 신용카드 결제</p>
                  <p>2. 체크카드 결제</p>
                  <p>3. 기타 회사가 정하는 결제 수단</p>
                </div>
                <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg mt-4">
                  <h3 className="font-bold mb-2">⚠️ 중요 안내</h3>
                  <ul className="text-sm space-y-1 list-disc list-inside">
                    <li>프리미엄 구독은 월 $9.99이며, 매월 자동 갱신됩니다.</li>
                    <li>구독 취소는 언제든지 가능하며, 다음 결제일부터 적용됩니다.</li>
                    <li>결제 후 7일 이내 환불이 가능합니다(환불 정책 참조).</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* 제7조: 회원의 의무 */}
            <section>
              <h2 className="text-2xl font-bold mb-4 flex items-center">
                <AlertCircle className="w-6 h-6 mr-2 text-red-600" />
                제7조 (회원의 의무)
              </h2>
              <div className="space-y-3 text-gray-700 dark:text-gray-300">
                <p>① 회원은 다음 행위를 하여서는 안 됩니다.</p>
                <div className="ml-6 space-y-2 text-sm">
                  <p>1. 신청 또는 변경 시 허위내용의 등록</p>
                  <p>2. 타인의 정보 도용</p>
                  <p>3. 회사가 게시한 정보의 변경</p>
                  <p>4. 회사가 정한 정보 이외의 정보(컴퓨터 프로그램 등) 등의 송신 또는 게시</p>
                  <p>5. 회사와 기타 제3자의 저작권 등 지적재산권에 대한 침해</p>
                  <p>6. 회사 및 기타 제3자의 명예를 손상시키거나 업무를 방해하는 행위</p>
                  <p>7. 외설 또는 폭력적인 메시지, 화상, 음성, 기타 공서양속에 반하는 정보를 서비스에 공개 또는 게시하는 행위</p>
                  <p>8. 서비스를 영리 목적으로 이용하는 행위</p>
                  <p>9. 기타 불법적이거나 부당한 행위</p>
                </div>
                <p>
                  ② 회원은 관계법령, 이 약관의 규정, 이용안내 및 서비스와 관련하여 공지한 주의사항,
                  회사가 통지하는 사항 등을 준수하여야 하며, 기타 회사의 업무에 방해되는 행위를 하여서는 안 됩니다.
                </p>
              </div>
            </section>

            {/* 제8조: 서비스 이용제한 */}
            <section>
              <h2 className="text-2xl font-bold mb-4 flex items-center">
                <Ban className="w-6 h-6 mr-2 text-gray-600" />
                제8조 (서비스 이용 제한)
              </h2>
              <div className="space-y-3 text-gray-700 dark:text-gray-300">
                <p>
                  ① 회사는 회원이 이 약관의 의무를 위반하거나 서비스의 정상적인 운영을 방해한 경우,
                  경고, 일시정지, 영구이용정지 등으로 서비스 이용을 단계적으로 제한할 수 있습니다.
                </p>
                <p>
                  ② 회사는 전항에도 불구하고, 저작권법을 위반한 불법프로그램의 제공 및 운영방해,
                  정보통신망법을 위반한 불법통신 및 해킹, 악성프로그램의 배포, 접속권한 초과행위 등과 같이
                  관련법을 위반한 경우에는 즉시 영구이용정지를 할 수 있습니다.
                </p>
              </div>
            </section>

            {/* 제9조: 계약 해지 */}
            <section>
              <h2 className="text-2xl font-bold mb-4">제9조 (계약 해지 및 이용 제한)</h2>
              <div className="space-y-3 text-gray-700 dark:text-gray-300">
                <p>
                  ① 회원은 언제든지 서비스 이용을 원하지 않는 경우 회원 탈퇴를 통해 이용계약을 해지할 수 있습니다.
                </p>
                <p>
                  ② 회원이 계약을 해지하는 경우, 관련법 및 개인정보처리방침에 따라 회사가 회원정보를 보유하는
                  경우를 제외하고는 해지 즉시 회원의 모든 데이터는 소멸됩니다.
                </p>
                <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
                  <p className="font-bold mb-2">⚠️ 탈퇴 시 유의사항</p>
                  <ul className="text-sm space-y-1 list-disc list-inside">
                    <li>탈퇴 즉시 모든 개인 데이터(북마크, 설정 등)가 삭제됩니다.</li>
                    <li>유료 구독 중 탈퇴하는 경우, 환불 정책에 따라 처리됩니다.</li>
                    <li>동일 이메일로 재가입 시 이전 데이터는 복구되지 않습니다.</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* 제10조: 면책조항 */}
            <section>
              <h2 className="text-2xl font-bold mb-4">제10조 (면책조항)</h2>
              <div className="space-y-3 text-gray-700 dark:text-gray-300">
                <p>
                  ① 회사는 천재지변 또는 이에 준하는 불가항력으로 인하여 서비스를 제공할 수 없는 경우에는
                  서비스 제공에 관한 책임이 면제됩니다.
                </p>
                <p>
                  ② 회사는 회원의 귀책사유로 인한 서비스 이용의 장애에 대하여 책임을 지지 않습니다.
                </p>
                <p>
                  ③ 회사는 회원이 서비스를 이용하여 기대하는 수익을 상실한 것에 대하여 책임을 지지 않으며,
                  그 밖의 서비스를 통하여 얻은 자료로 인한 손해에 관하여 책임을 지지 않습니다.
                </p>
                <p>
                  ④ 회사는 회원이 게재한 정보, 자료, 사실의 신뢰도, 정확성 등의 내용에 관하여는 책임을 지지 않습니다.
                </p>
              </div>
            </section>

            {/* 분쟁 해결 */}
            <section className="border-t pt-8">
              <h2 className="text-2xl font-bold mb-4">제11조 (분쟁 해결)</h2>
              <div className="space-y-3 text-gray-700 dark:text-gray-300">
                <p>
                  ① 회사는 회원이 제기하는 정당한 의견이나 불만을 반영하고 그 피해를 보상처리하기 위하여
                  피해보상처리기구를 설치·운영합니다.
                </p>
                <p>
                  ② 회사와 회원 간에 발생한 전자상거래 분쟁과 관련하여 회원의 피해구제신청이 있는 경우에는
                  공정거래위원회 또는 시·도지사가 의뢰하는 분쟁조정기관의 조정에 따를 수 있습니다.
                </p>
                <p>
                  ③ 서비스 이용과 관련하여 회사와 회원 사이에 분쟁이 발생한 경우, 회사와 회원은 분쟁의
                  해결을 위해 성실히 협의합니다.
                </p>
              </div>
            </section>

            {/* 부칙 */}
            <section className="border-t pt-8">
              <h2 className="text-2xl font-bold mb-4">부칙</h2>
              <div className="text-gray-700 dark:text-gray-300">
                <p className="mb-2">이 약관은 2025년 1월 17일부터 적용됩니다.</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  시행일: 2025년 1월 17일
                </p>
              </div>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
