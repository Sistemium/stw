import i18n from '@/i18n';
import upperFirst from 'lodash/upperFirst';
import keyBy from 'lodash/keyBy';
import mapValues from 'lodash/mapValues';
import { t } from '@/lib/validations'

export const DEFAULT_PACKAGE_TYPE_ID = 'box';

type LocaleCode = 'en' | 'ru' | 'lt'

interface IPackageType {
  id: string
  name: Record<LocaleCode, string>
  measureType: string
  short: Record<LocaleCode, string>
  genitive: Record<LocaleCode, string>
}

export const PackageType: IPackageType[] = [
  {
    id: 'box',
    name: { en: 'Box', lt: 'Dėžė', ru: 'Коробка' },
    measureType: 'discreet',
    short: { en: 'bx', lt: 'dž', ru: 'кор' },
    genitive: { en: 'boxes', lt: 'dėžų', ru: 'коробок' },
  },
  {
    id: 'bag',
    name: { en: 'Bag', lt: 'Maišas', ru: 'Мешок' },
    measureType: '3d',
    short: { en: 'bg', lt: 'mš', ru: 'меш' },
    genitive: { en: 'bags', lt: 'maišų', ru: 'мешков' },
  },
  {
    id: 'tinCan',
    name: { en: 'Tin can', lt: 'Skardinė', ru: 'Жестяная банка' },
    measureType: '3d',
    short: { en: 'tn', lt: 'sk', ru: 'ж/б' },
    genitive: { en: 'cans', lt: 'skardinių', ru: 'банок' },
  },
  {
    id: 'jar',
    name: { en: 'Jar', lt: 'Stiklainė', ru: 'Стекл.банка' },
    measureType: '3d',
    short: { en: 'jr', lt: 'st', ru: 'ст/б' },
    genitive: { en: 'jars', lt: 'stiklainių', ru: 'банок' },
  },
  {
    id: 'reel',
    name: { en: 'Reel', lt: 'Ritė', ru: 'Катушка' },
    measureType: '1d',
    short: { en: 'rl', lt: 'rt', ru: 'кат' },
    genitive: { en: 'reels', lt: 'ričių', ru: 'катушек' },
  },
];

export function packageTypes(localeArg: LocaleCode, fallbackLocaleArg?: LocaleCode) {
  const locale = localeArg || i18n.global.locale;
  const fallbackLocale: LocaleCode = fallbackLocaleArg || i18n.global.fallbackLocale as LocaleCode || 'en';
  return PackageType.map(packageType => ({
    ...packageType,
    name: packageType.name[locale] || packageType.name[fallbackLocale],
    shortened: packageType.short[locale] || packageType.short[fallbackLocale],
    genitive: packageType.genitive[locale] || packageType.genitive[fallbackLocale],
  }));
}

const BY_ID = mapValues(keyBy<LocaleCode>(['en', 'lt', 'ru']), locale => keyBy(packageTypes(locale), 'id'));

export function getById(id: string, locale?: LocaleCode) {
  return BY_ID[locale || i18n.global.locale][id];
}

export function unitsInPackageLabel(measureUnitId: string) {
  const units = t(`units.genitive.${measureUnitId}`);
  return upperFirst(t('fields.unitsInPackage', [units]).toString());
}

export function shortenedPackage(packageTypeId: string) {
  if (!packageTypeId) {
    return null;
  }
  const packageType = getById(packageTypeId);
  return packageType ? packageType.shortened : packageTypeId;
}

export function numberOf(packageTypeId: string) {
  const packageType = getById(packageTypeId);
  const gen = packageType ? packageType.genitive : packageTypeId;
  return upperFirst(t('units.quantityOf', [gen]).toString());
}
