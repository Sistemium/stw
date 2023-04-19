import { createI18n } from 'vue-i18n';
import uiEn from 'element-plus/dist/locale/en';
import uiRu from 'element-plus/dist/locale/ru';
import uiLt from 'element-plus/dist/locale/lt';
import ru from '@/locales/ru.json';
import en from '@/locales/en.json';
import lt from '@/locales/lt.json';
// import ElementLocale from 'element-ui/lib/locale';

const LS_KEY_I18N_LOCALE = 'I18N_LOCALE';
// const ui = {
//   en: uiEn,
//   ru: uiRu,
//   lt: uiLt,
// };

// const local = { en, ru, lt };

// function loadLocaleMessages() {
//   const locales = require.context('./locales', true, /[A-Za-z0-9-_,\s]+\.json$/i);
//   const messages = {};
//   locales.keys()
//     .forEach(key => {
//       const [, locale] = key.match(/([A-Za-z0-9-_]+)\./i);
//       messages[locale] = { ...locales(key), ...ui[locale] };
//       // eslint-disable-next-line no-console
//       console.log(locale, locales(key));
//     });
//   return messages;
// }

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
};

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
});

// ElementLocale.i18n((key, value) => i18n.global.t(key, value));

export default i18n;

export function saveLocale(locale) {
  localStorage.setItem(LS_KEY_I18N_LOCALE, locale);
}

function getSavedLocale() {
  return localStorage.getItem(LS_KEY_I18N_LOCALE);
}
