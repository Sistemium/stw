import { createI18n } from 'vue-i18n'
// @ts-ignore
import uiEn from 'element-plus/dist/locale/en'
// @ts-ignore
import uiRu from 'element-plus/dist/locale/ru'
// @ts-ignore
import uiLt from 'element-plus/dist/locale/lt'
import ru from '@/locales/ru.json'
import en from '@/locales/en.json'
import lt from '@/locales/lt.json'
import isString from 'lodash/isString'
import ruFields from '@/locales/fields/ru.json'
import enFields from '@/locales/fields/en.json'
import ltFields from '@/locales/fields/lt.json'
import ruUnits from '@/locales/units/ru.json'
import enUnits from '@/locales/units/en.json'
import ltUnits from '@/locales/units/lt.json'
import ruWords from '@/locales/words/ru.json'
import enWords from '@/locales/words/en.json'
import ltWords from '@/locales/words/lt.json'
import { ru as ruV, en as enV, lt as ltV } from 'vuetify/locale'

const LS_KEY_I18N_LOCALE = 'I18N_LOCALE'

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
} as const

const numberFormats = {
  decimal: {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  },
  currency: {
    style: 'decimal',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  },
}

// @ts-ignore
const i18n = createI18n({
  locale: getSavedLocale() || import.meta.env.VITE_I18N_LOCALE || 'en',
  fallbackLocale: import.meta.env.VITE_I18N_FALLBACK_LOCALE || 'en',
  messages: {
    en: {
      ...en,
      ...uiEn,
      fields:
      enFields,
      $vuetify: enV,
      ...enUnits,
      ...enWords,
    },
    ru: {
      ...ru,
      ...uiRu,
      fields: ruFields,
      $vuetify:
      ruV,
      ...ruUnits,
      ...ruWords,
    },
    lt: {
      ...lt,
      ...uiLt,
      fields: ltFields,
      $vuetify: ltV,
      ...ltUnits,
      ...ltWords,
    },
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
})

// ElementLocale.i18n((key, value) => i18n.global.t(key, value));

export default i18n

export function saveLocale(locale: string) {
  localStorage.setItem(LS_KEY_I18N_LOCALE, locale)
}

function getSavedLocale() {
  return localStorage.getItem(LS_KEY_I18N_LOCALE)
}

export function getLocale(): string {
  // @ts-ignore
  return i18n.global.locale.value
}


export function safeTd(stringOrDate?: string | Date | null, format: string = 'timestamp'): string {
  if (!stringOrDate) {
    return stringOrDate || ''
  }
  const date = isString(stringOrDate) ? new Date(stringOrDate) : stringOrDate
  return i18n.global.d(date, format)
}

export function safeN(number: number, format?: string): string | null {
  if (number === undefined || number === null) {
    return null
  }
  return i18n.global.n(number, format || 'decimal')
}

export function safeT(mayBeNullKey?: string, prefix: string = '', ...param: string[]): string {
  if (!mayBeNullKey) {
    return ''
  }
  const key = prefixedKey(mayBeNullKey, prefix)
  return i18n.global.te(key) ? i18n.global.t(key, param) : key
}

function prefixedKey(key: string, prefix: string = ''): string {
  return prefix ? `${prefix}.${key}` : key
}

export function ta(key: string, param: string): string {
  return safeT(key, 'action', param)
}
