import i18n from '@/i18n';
import upperFirst from 'lodash/upperFirst';
import keyBy from 'lodash/keyBy';
import mapValues from 'lodash/mapValues';

export const PackageType = [
  {
    id: 'box',
    name: { en: 'Box', lt: 'Dėžė', ru: 'Коробка' },
    measureType: 'discreet',
    short: { en: 'bx', lt: 'dž', ru: 'кор' },
  },
  {
    id: 'bag',
    name: { en: 'Bag', lt: 'Maišas', ru: 'Мешок' },
    measureType: '3d',
    short: { en: 'bg', lt: 'mš', ru: 'меш' },
  },
  {
    id: 'tinCan',
    name: { en: 'Tin can', lt: 'Skardinė', ru: 'Жестяная банка' },
    measureType: '3d',
    short: { en: 'tn', lt: 'sk', ru: 'ж/б' },
  },
  {
    id: 'jar',
    name: { en: 'Jar', lt: 'Stiklainė', ru: 'Стекл.банка' },
    measureType: '3d',
    short: { en: 'jr', lt: 'st', ru: 'ст/б' },
  },
  {
    id: 'reel',
    name: { en: 'Reel', lt: 'Ritė', ru: 'Катушка' },
    measureType: '1d',
    short: { en: 'rl', lt: 'rt', ru: 'кат' },
  },
];

export function packageTypes(locale = i18n.locale, fallbackLocale = i18n.fallbackLocale) {
  return PackageType.map(packageType => ({
    ...packageType,
    name: packageType.name[locale] || packageType.name[fallbackLocale],
    shortened: packageType.short[locale] || packageType.short[fallbackLocale],
  }));
}

const BY_ID = mapValues(keyBy(['en', 'lt', 'ru']), locale => keyBy(packageTypes(locale), 'id'));

export function getById(id, locale = i18n.locale) {
  return BY_ID[locale][id];
}

export function unitsInPackageLabel(measureUnitId) {
  const units = i18n.t(`units.genitive.${measureUnitId}`);
  return upperFirst(i18n.t('fields.unitsInPackage', [units]).toString());
}

export function shortenedPackage(packageTypeId) {
  if (!packageTypeId) {
    return null;
  }
  const packageType = getById(packageTypeId);
  return packageType ? packageType.shortened : packageTypeId;
}
