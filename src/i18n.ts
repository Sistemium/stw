import { createI18n } from 'vue-i18n';
import uiEn from 'element-plus/dist/locale/en';
import uiRu from 'element-plus/dist/locale/ru';
import uiLt from 'element-plus/dist/locale/lt';
import ru from '@/locales/ru.json';
import en from '@/locales/en.json';
import lt from '@/locales/lt.json';

const LS_KEY_I18N_LOCALE = 'I18N_LOCALE';

const dateTimeFormatGeneric = {
  timestamp: {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
  },
  minutes: {
    // year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  },
  short: {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  },
  long: {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
    hour: 'numeric',
    minute: 'numeric',
  },
} as const;

const numberFormats = {
  decimal: {
    style: 'decimal',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  },
}

const i18n = createI18n({
  locale: getSavedLocale() || process.env.VITE_I18N_LOCALE || 'en',
  fallbackLocale: process.env.VITE_I18N_FALLBACK_LOCALE || 'en',
  messages: {
    en: { ...en, ...uiEn },
    ru: { ...ru, ...uiRu },
    lt: { ...lt, ...uiLt },
  },
  silentFallbackWarn: true,
  datetimeFormats: {
    en: dateTimeFormatGeneric,
    ru: dateTimeFormatGeneric,
    lt: dateTimeFormatGeneric,
  },
  numberFormats: {
    en: numberFormats,
    ru: numberFormats,
    lt: numberFormats,
  },
});

// ElementLocale.i18n((key, value) => i18n.global.t(key, value));

export default i18n;

export function saveLocale(locale) {
  localStorage.setItem(LS_KEY_I18N_LOCALE, locale);
}

function getSavedLocale() {
  return localStorage.getItem(LS_KEY_I18N_LOCALE);
}
