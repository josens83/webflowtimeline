import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, MessageSquare, Clock, MapPin, Send, CheckCircle } from 'lucide-react';
import { toast } from 'react-toastify';
import { contactAPI } from '../services/api';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await contactAPI.submit(formData);
      setIsSubmitted(true);
      toast.success('문의가 성공적으로 전송되었습니다!');

      // Reset form after 3 seconds
      setTimeout(() => {
        setFormData({ name: '', email: '', subject: '', message: '' });
        setIsSubmitted(false);
      }, 3000);
    } catch (error: any) {
      console.error('Contact submission error:', error);
      toast.error(error.response?.data?.error || '문의 전송에 실패했습니다. 다시 시도해 주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <Mail className="w-16 h-16 text-primary-600 mx-auto mb-4" />
          <h1 className="text-4xl font-bold mb-4">고객 지원</h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            궁금하신 사항이 있으시면 언제든지 문의해 주세요
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="card"
            >
              <h2 className="text-2xl font-bold mb-6 flex items-center">
                <MessageSquare className="w-6 h-6 mr-3 text-primary-600" />
                문의하기
              </h2>

              {isSubmitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-12"
                >
                  <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold mb-2">문의가 전송되었습니다!</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    24시간 이내에 답변을 보내드리겠습니다.
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        이름 <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-800"
                        placeholder="홍길동"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        이메일 <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-800"
                        placeholder="example@email.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      문의 유형 <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-800"
                    >
                      <option value="">선택해 주세요</option>
                      <option value="general">일반 문의</option>
                      <option value="technical">기술 지원</option>
                      <option value="billing">결제 및 환불</option>
                      <option value="feature">기능 제안</option>
                      <option value="bug">버그 신고</option>
                      <option value="partnership">제휴 문의</option>
                      <option value="other">기타</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      문의 내용 <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={8}
                      className="w-full px-4 py-3 border dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-800 resize-none"
                      placeholder="문의하실 내용을 자세히 작성해 주세요..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full btn-primary flex items-center justify-center"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                        전송 중...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5 mr-2" />
                        문의 보내기
                      </>
                    )}
                  </button>
                </form>
              )}
            </motion.div>
          </div>

          {/* Contact Information */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="card"
            >
              <h3 className="text-xl font-bold mb-4">연락처 정보</h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <Mail className="w-5 h-5 text-primary-600 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <div className="font-semibold mb-1">이메일</div>
                    <a
                      href="mailto:support@webtrends.com"
                      className="text-primary-600 hover:underline text-sm"
                    >
                      support@webtrends.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start">
                  <Clock className="w-5 h-5 text-primary-600 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <div className="font-semibold mb-1">운영 시간</div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      평일 09:00 - 18:00<br />
                      (주말 및 공휴일 제외)
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <MapPin className="w-5 h-5 text-primary-600 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <div className="font-semibold mb-1">주소</div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      서울특별시 강남구<br />
                      테헤란로 123<br />
                      웹트렌드 빌딩 5층
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="card bg-gradient-to-br from-primary-50 to-purple-50 dark:from-primary-900/20 dark:to-purple-900/20"
            >
              <h3 className="text-xl font-bold mb-4">평균 응답 시간</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">일반 문의</span>
                  <span className="font-bold text-primary-600">12시간</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">기술 지원</span>
                  <span className="font-bold text-primary-600">24시간</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">긴급 문의</span>
                  <span className="font-bold text-primary-600">4시간</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="card"
            >
              <h3 className="text-xl font-bold mb-4">자주 묻는 질문</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                문의하시기 전에 FAQ를 확인해 보세요. 대부분의 질문에 대한 답변을 찾으실 수 있습니다.
              </p>
              <a href="/faq" className="btn-secondary w-full block text-center">
                FAQ 보기
              </a>
            </motion.div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          <motion.a
            href="/privacy"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="card hover:shadow-lg transition-shadow cursor-pointer"
          >
            <h3 className="font-bold mb-2">개인정보처리방침</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              개인정보 수집 및 이용에 대한 안내
            </p>
          </motion.a>

          <motion.a
            href="/terms"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="card hover:shadow-lg transition-shadow cursor-pointer"
          >
            <h3 className="font-bold mb-2">이용약관</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              서비스 이용 관련 약관 및 규정
            </p>
          </motion.a>

          <motion.a
            href="/refund"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="card hover:shadow-lg transition-shadow cursor-pointer"
          >
            <h3 className="font-bold mb-2">환불 정책</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              결제 취소 및 환불에 대한 안내
            </p>
          </motion.a>
        </div>
      </div>
    </div>
  );
}
