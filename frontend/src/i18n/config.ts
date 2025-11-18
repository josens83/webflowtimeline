/**
 * i18n Configuration
 * Supported languages: ko, en, ja, zh
 */

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translations
import commonKo from './locales/ko/common.json';
import commonEn from './locales/en/common.json';
import commonJa from './locales/ja/common.json';
import commonZh from './locales/zh/common.json';

import timelineKo from './locales/ko/timeline.json';
import timelineEn from './locales/en/timeline.json';
import timelineJa from './locales/ja/timeline.json';
import timelineZh from './locales/zh/timeline.json';

import pricingKo from './locales/ko/pricing.json';
import pricingEn from './locales/en/pricing.json';
import pricingJa from './locales/ja/pricing.json';
import pricingZh from './locales/zh/pricing.json';

const resources = {
  ko: {
    common: commonKo,
    timeline: timelineKo,
    pricing: pricingKo,
  },
  en: {
    common: commonEn,
    timeline: timelineEn,
    pricing: pricingEn,
  },
  ja: {
    common: commonJa,
    timeline: timelineJa,
    pricing: pricingJa,
  },
  zh: {
    common: commonZh,
    timeline: timelineZh,
    pricing: pricingZh,
  },
};

i18n
  .use(LanguageDetector) // 브라우저 언어 자동 감지
  .use(initReactI18next) // React 통합
  .init({
    resources,
    fallbackLng: 'ko', // 기본 언어
    defaultNS: 'common', // 기본 네임스페이스

    interpolation: {
      escapeValue: false, // React already escapes
    },

    detection: {
      // 언어 감지 옵션
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: 'i18nextLng',
    },
  });

export default i18n;
