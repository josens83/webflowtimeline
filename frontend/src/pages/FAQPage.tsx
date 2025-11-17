import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, ChevronDown, Search, CreditCard, Shield, Zap, BookOpen, Mail } from 'lucide-react';

interface FAQ {
  category: string;
  icon: any;
  questions: {
    question: string;
    answer: string;
  }[];
}

const faqs: FAQ[] = [
  {
    category: '일반',
    icon: BookOpen,
    questions: [
      {
        question: 'Web Trends Timeline은 어떤 서비스인가요?',
        answer: '1990년대부터 2020년대까지 한국, 미국, 일본, 중국의 웹 트렌드 변화를 분석하고 비교할 수 있는 프리미엄 SaaS 플랫폼입니다. 시대별, 국가별 웹사이트, 디자인 트렌드, 기술 스택의 변화를 한눈에 파악할 수 있습니다.'
      },
      {
        question: '무료 티어와 프리미엄 티어의 차이는 무엇인가요?',
        answer: '무료 티어는 기본 타임라인과 제한적인 국가 데이터를 제공합니다. 프리미엄 티어($9.99/월)는 전체 4개국 데이터, 고급 비교 분석, 인사이트 대시보드, PDF/Excel 내보내기 기능을 제공합니다.'
      },
      {
        question: '데이터는 얼마나 자주 업데이트되나요?',
        answer: '역사적 트렌드 데이터는 분기별로 검증 및 업데이트되며, 새로운 트렌드와 인사이트는 월 1회 추가됩니다.'
      },
      {
        question: '모바일에서도 사용할 수 있나요?',
        answer: '네! Progressive Web App (PWA)로 제작되어 모바일 브라우저에서 완벽하게 작동하며, 홈 화면에 설치하여 앱처럼 사용할 수 있습니다.'
      }
    ]
  },
  {
    category: '결제 및 구독',
    icon: CreditCard,
    questions: [
      {
        question: '결제는 어떻게 진행되나요?',
        answer: 'Stripe를 통해 안전하게 결제가 진행됩니다. 신용카드, 체크카드 등 다양한 결제 수단을 지원합니다. 모든 결제 정보는 암호화되어 안전하게 처리됩니다.'
      },
      {
        question: '구독을 취소할 수 있나요?',
        answer: '언제든지 구독을 취소할 수 있습니다. 계정 페이지에서 "구독 취소" 버튼을 클릭하시면 다음 결제일부터 청구가 중단됩니다. 현재 구독 기간 동안은 계속 프리미엄 서비스를 이용하실 수 있습니다.'
      },
      {
        question: '환불이 가능한가요?',
        answer: '결제 후 7일 이내에는 전액 환불이 가능합니다. 7일 경과 후에는 사용하지 않은 기간에 대해 비례 환불됩니다. 자세한 내용은 환불 정책 페이지를 참고해 주세요.'
      },
      {
        question: '구독 요금은 자동으로 갱신되나요?',
        answer: '네, 월 단위로 자동 갱신됩니다. 취소하지 않는 한 매월 같은 날짜에 자동으로 결제가 진행됩니다. 결제 3일 전에 이메일 알림을 보내드립니다.'
      },
      {
        question: '할인이나 프로모션이 있나요?',
        answer: '신규 가입자 대상 할인, 연간 구독 할인 등 다양한 프로모션을 진행합니다. 뉴스레터를 구독하시면 최신 할인 정보를 받아보실 수 있습니다.'
      }
    ]
  },
  {
    category: '기능 및 사용',
    icon: Zap,
    questions: [
      {
        question: '데이터를 내보내기할 수 있나요?',
        answer: '프리미엄 회원은 PDF, Excel, JSON 형식으로 데이터를 내보낼 수 있습니다. 타임라인 페이지 우측 상단의 내보내기 버튼을 클릭하시면 됩니다.'
      },
      {
        question: '북마크 기능은 어떻게 사용하나요?',
        answer: '각 트렌드 카드의 북마크 아이콘을 클릭하면 저장됩니다. 북마크 페이지에서 저장된 모든 트렌드를 한눈에 볼 수 있으며, 시대별로 정리되어 표시됩니다.'
      },
      {
        question: '비교 분석 기능은 무엇인가요?',
        answer: '여러 국가의 트렌드를 동시에 비교할 수 있는 프리미엄 기능입니다. Bar, Radar, Line 차트를 통해 시각적으로 비교하고, 상세한 통계를 확인할 수 있습니다.'
      },
      {
        question: '인사이트 대시보드에서는 무엇을 볼 수 있나요?',
        answer: '전체 트렌드에 대한 종합 통계, 국가별 웹사이트 분포, 시대별 기술 변화, 인기 기술 TOP 10, 디자인 트렌드 등을 다양한 차트로 확인할 수 있습니다.'
      },
      {
        question: 'PWA를 설치하려면 어떻게 하나요?',
        answer: '브라우저 주소창의 설치 아이콘을 클릭하거나, 웹사이트 방문 후 30초 뒤에 나타나는 설치 프롬프트를 이용하세요. Android, iOS, Windows, macOS 모두 지원합니다.'
      }
    ]
  },
  {
    category: '계정 및 보안',
    icon: Shield,
    questions: [
      {
        question: '내 개인정보는 안전한가요?',
        answer: '모든 개인정보는 암호화되어 저장되며, 업계 표준 보안 프로토콜을 따릅니다. 자세한 내용은 개인정보처리방침을 참고해 주세요.'
      },
      {
        question: '비밀번호를 잊어버렸어요.',
        answer: '로그인 페이지의 "비밀번호 찾기" 링크를 클릭하세요. 가입 시 사용한 이메일 주소로 비밀번호 재설정 링크를 보내드립니다.'
      },
      {
        question: '이메일 주소를 변경할 수 있나요?',
        answer: '계정 페이지에서 언제든지 이메일 주소를 변경할 수 있습니다. 변경 후 새 이메일 주소로 확인 메일이 발송됩니다.'
      },
      {
        question: '계정을 삭제하려면 어떻게 하나요?',
        answer: '계정 페이지 하단의 "계정 삭제" 버튼을 클릭하세요. 삭제 즉시 모든 개인 데이터가 영구적으로 삭제되며 복구할 수 없습니다.'
      },
      {
        question: '2단계 인증을 지원하나요?',
        answer: '현재는 지원하지 않지만, 향후 업데이트를 통해 추가될 예정입니다.'
      }
    ]
  },
  {
    category: '기술 지원',
    icon: HelpCircle,
    questions: [
      {
        question: '페이지가 로드되지 않아요.',
        answer: '브라우저 캐시를 삭제하거나 시크릿 모드로 시도해 보세요. 문제가 계속되면 고객 지원팀(support@webtrends.com)으로 문의해 주세요.'
      },
      {
        question: '로그인이 안 됩니다.',
        answer: '이메일과 비밀번호를 정확히 입력했는지 확인하세요. Caps Lock이 켜져 있지 않은지도 확인해 주세요. 문제가 계속되면 비밀번호를 재설정하세요.'
      },
      {
        question: '결제가 실패했어요.',
        answer: '카드 정보가 정확한지, 잔액이 충분한지 확인하세요. 해외 결제가 차단되어 있지 않은지 카드사에 문의해 보세요.'
      },
      {
        question: '어떤 브라우저를 지원하나요?',
        answer: 'Chrome, Firefox, Safari, Edge의 최신 버전을 지원합니다. 최상의 경험을 위해 브라우저를 최신 버전으로 유지해 주세요.'
      },
      {
        question: '오프라인에서도 사용할 수 있나요?',
        answer: 'PWA를 설치하면 제한적으로 오프라인 사용이 가능합니다. 이전에 조회한 데이터는 캐시되어 오프라인에서도 볼 수 있습니다.'
      }
    ]
  }
];

export default function FAQPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [openIndex, setOpenIndex] = useState<string | null>(null);

  const toggleQuestion = (categoryIndex: number, questionIndex: number) => {
    const key = `${categoryIndex}-${questionIndex}`;
    setOpenIndex(openIndex === key ? null : key);
  };

  const filteredFaqs = faqs.map(category => ({
    ...category,
    questions: category.questions.filter(
      q =>
        q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.answer.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.questions.length > 0);

  return (
    <div className="min-h-[calc(100vh-4rem)] py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <HelpCircle className="w-16 h-16 text-primary-600 mx-auto mb-4" />
          <h1 className="text-4xl font-bold mb-4">자주 묻는 질문</h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            궁금하신 내용을 검색하거나 카테고리별로 찾아보세요
          </p>
        </div>

        {/* Search */}
        <div className="mb-12">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="질문을 검색하세요..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 text-lg border-2 border-gray-200 dark:border-gray-700 rounded-lg focus:border-primary-500 dark:focus:border-primary-500 bg-white dark:bg-gray-800"
            />
          </div>
        </div>

        {/* FAQ Categories */}
        <div className="space-y-8">
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map((category, categoryIndex) => (
              <motion.div
                key={categoryIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: categoryIndex * 0.1 }}
                className="card"
              >
                <h2 className="text-2xl font-bold mb-6 flex items-center">
                  <category.icon className="w-6 h-6 mr-3 text-primary-600" />
                  {category.category}
                </h2>

                <div className="space-y-4">
                  {category.questions.map((item, questionIndex) => {
                    const key = `${categoryIndex}-${questionIndex}`;
                    const isOpen = openIndex === key;

                    return (
                      <div
                        key={questionIndex}
                        className="border dark:border-gray-700 rounded-lg overflow-hidden"
                      >
                        <button
                          onClick={() => toggleQuestion(categoryIndex, questionIndex)}
                          className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                        >
                          <span className="font-semibold pr-4">{item.question}</span>
                          <motion.div
                            animate={{ rotate: isOpen ? 180 : 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0" />
                          </motion.div>
                        </button>

                        <AnimatePresence>
                          {isOpen && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              className="overflow-hidden"
                            >
                              <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800/50 text-gray-700 dark:text-gray-300">
                                {item.answer}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            ))
          ) : (
            <div className="text-center py-12">
              <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">검색 결과가 없습니다</h3>
              <p className="text-gray-600 dark:text-gray-400">
                다른 키워드로 검색하거나 아래 고객 지원팀에 문의해 주세요.
              </p>
            </div>
          )}
        </div>

        {/* Contact Support */}
        <div className="mt-12 bg-gradient-to-r from-primary-50 to-purple-50 dark:from-primary-900/20 dark:to-purple-900/20 rounded-lg p-8 text-center">
          <Mail className="w-12 h-12 text-primary-600 mx-auto mb-4" />
          <h3 className="text-2xl font-bold mb-2">원하는 답변을 찾지 못하셨나요?</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            고객 지원팀이 24시간 이내에 답변해 드립니다.
          </p>
          <a href="/contact" className="btn-primary inline-flex items-center">
            <Mail className="w-5 h-5 mr-2" />
            문의하기
          </a>
        </div>
      </div>
    </div>
  );
}
