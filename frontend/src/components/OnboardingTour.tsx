import { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface TourStep {
  title: string;
  description: string;
  target?: string;
  position?: 'top' | 'bottom' | 'left' | 'right' | 'center';
}

const tourSteps: TourStep[] = [
  {
    title: '🎉 Web Trends Timeline에 오신 것을 환영합니다!',
    description: '1990년대부터 2020년대까지 웹 트렌드의 변화를 탐색해보세요. 한국, 미국, 일본, 중국 4개국의 웹 역사를 한눈에!',
    position: 'center'
  },
  {
    title: '📊 타임라인 탐색',
    description: '시대별, 국가별로 웹사이트, 디자인 트렌드, 기술 스택의 변화를 확인할 수 있습니다. 검색 기능으로 원하는 정보를 빠르게 찾아보세요.',
    target: '/timeline',
    position: 'center'
  },
  {
    title: '⚖️ 비교 분석',
    description: '여러 국가의 트렌드를 동시에 비교해보세요. 프리미엄 회원은 상세한 차트와 통계를 확인할 수 있습니다.',
    target: '/compare',
    position: 'center'
  },
  {
    title: '💡 인사이트 대시보드',
    description: '전체 데이터를 기반으로 한 종합 분석과 인사이트를 확인하세요. 인기 기술 TOP 10, 디자인 트렌드 등을 시각화된 차트로 제공합니다.',
    target: '/insights',
    position: 'center'
  },
  {
    title: '🔖 북마크 기능',
    description: '관심 있는 트렌드를 북마크하여 나중에 다시 확인할 수 있습니다. 북마크는 브라우저에 저장되어 언제든 접근 가능합니다.',
    position: 'center'
  },
  {
    title: '⭐ 프리미엄으로 업그레이드',
    description: '프리미엄 구독으로 전체 국가 데이터, 비교 분석, PDF/Excel 내보내기 등 모든 기능을 이용하세요. 월 $9.99!',
    target: '/pricing',
    position: 'center'
  }
];

interface OnboardingTourProps {
  onComplete: () => void;
  onSkip: () => void;
}

export default function OnboardingTour({ onComplete, onSkip }: OnboardingTourProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  const currentTourStep = tourSteps[currentStep];
  const isLastStep = currentStep === tourSteps.length - 1;
  const isFirstStep = currentStep === 0;

  const handleNext = () => {
    if (isLastStep) {
      handleComplete();
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (!isFirstStep) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSkip = () => {
    setIsVisible(false);
    setTimeout(() => {
      onSkip();
    }, 300);
  };

  const handleComplete = () => {
    setIsVisible(false);
    setTimeout(() => {
      onComplete();
    }, 300);
  };

  const handleDotClick = (index: number) => {
    setCurrentStep(index);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleSkip();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        handlePrevious();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentStep]);

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={handleSkip}
          />

          {/* Tour Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', duration: 0.5 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full pointer-events-auto overflow-hidden">
              {/* Close Button */}
              <button
                onClick={handleSkip}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition z-10"
                aria-label="Close tour"
              >
                <X className="w-6 h-6" />
              </button>

              {/* Content */}
              <div className="p-8 md:p-12">
                {/* Step Indicator */}
                <div className="flex justify-center mb-8">
                  <div className="flex gap-2">
                    {tourSteps.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => handleDotClick(index)}
                        className={`h-2 rounded-full transition-all ${
                          index === currentStep
                            ? 'w-8 bg-primary-600'
                            : 'w-2 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400'
                        }`}
                        aria-label={`Go to step ${index + 1}`}
                      />
                    ))}
                  </div>
                </div>

                {/* Step Content */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="text-center"
                  >
                    <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
                      {currentTourStep.title}
                    </h2>
                    <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed mb-8">
                      {currentTourStep.description}
                    </p>
                  </motion.div>
                </AnimatePresence>

                {/* Navigation */}
                <div className="flex items-center justify-between mt-8">
                  {/* Previous Button */}
                  <button
                    onClick={handlePrevious}
                    disabled={isFirstStep}
                    className={`flex items-center px-4 py-2 rounded-lg font-semibold transition ${
                      isFirstStep
                        ? 'text-gray-400 cursor-not-allowed'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <ChevronLeft className="w-5 h-5 mr-1" />
                    이전
                  </button>

                  {/* Step Counter */}
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {currentStep + 1} / {tourSteps.length}
                  </div>

                  {/* Next/Complete Button */}
                  <button
                    onClick={handleNext}
                    className="flex items-center px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-semibold transition"
                  >
                    {isLastStep ? (
                      <>
                        완료
                        <Check className="w-5 h-5 ml-2" />
                      </>
                    ) : (
                      <>
                        다음
                        <ChevronRight className="w-5 h-5 ml-2" />
                      </>
                    )}
                  </button>
                </div>

                {/* Skip Link */}
                <div className="text-center mt-6">
                  <button
                    onClick={handleSkip}
                    className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 underline"
                  >
                    투어 건너뛰기
                  </button>
                </div>
              </div>

              {/* Decorative Element */}
              <div className="h-2 bg-gradient-to-r from-primary-600 via-purple-600 to-pink-600" />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// Hook to manage onboarding state
export const useOnboarding = () => {
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem('hasSeenOnboarding');
    if (!hasSeenOnboarding) {
      // Show onboarding after a short delay
      const timer = setTimeout(() => {
        setShowOnboarding(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const completeOnboarding = () => {
    localStorage.setItem('hasSeenOnboarding', 'true');
    setShowOnboarding(false);
  };

  const skipOnboarding = () => {
    localStorage.setItem('hasSeenOnboarding', 'true');
    setShowOnboarding(false);
  };

  const resetOnboarding = () => {
    localStorage.removeItem('hasSeenOnboarding');
    setShowOnboarding(true);
  };

  return {
    showOnboarding,
    completeOnboarding,
    skipOnboarding,
    resetOnboarding
  };
};
