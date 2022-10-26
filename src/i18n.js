import Vue from 'vue';
import VueI18n from 'vue-i18n';
import uiEn from 'element-ui/lib/locale/lang/en';
import uiRu from 'element-ui/lib/locale/lang/ru-RU';
import uiLt from 'element-ui/lib/locale/lang/lt';
import ElementLocale from 'element-ui/lib/locale';

Vue.use(VueI18n);

const LS_KEY_I18N_LOCALE = 'I18N_LOCALE';
const ui = {
  en: uiEn,
  ru: uiRu,
  lt: uiLt,
};

function loadLocaleMessages() {
  const locales = require.context('./locales', true, /[A-Za-z0-9-_,\s]+\.json$/i);
  const messages = {};
  locales.keys()
    .forEach(key => {
      const matched = key.match(/([A-Za-z0-9-_]+)\./i);
      if (matched && matched.length > 1) {
        const locale = matched[1];
        messages[locale] = { ...locales(key), ...ui[locale] };
      }
    });
  return messages;
}

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

const i18n = new VueI18n({
  locale: getSavedLocale() || process.env.VUE_APP_I18N_LOCALE || 'en',
  fallbackLocale: process.env.VUE_APP_I18N_FALLBACK_LOCALE || 'en',
  messages: loadLocaleMessages(),
  silentFallbackWarn: true,
  dateTimeFormats: {
    en: dateTimeFormatGeneric,
    ru: dateTimeFormatGeneric,
    lt: dateTimeFormatGeneric,
  },
});

ElementLocale.i18n((key, value) => i18n.t(key, value));

export default i18n;

export function saveLocale(locale) {
  localStorage.setItem(LS_KEY_I18N_LOCALE, locale);
}

function getSavedLocale() {
  return localStorage.getItem(LS_KEY_I18N_LOCALE);
}
