import i18n from '@/i18n';
import find from 'lodash/find';

export const PackageType = [
  {
    id: 'box',
    name: { en: 'Box', lt: 'Dėžė', ru: 'Коробка' },
    measureType: 'discreet',
  },
  {
    id: 'bag',
    name: { en: 'Bag', lt: 'Maišas', ru: 'Мешок' },
    measureType: '3d',
  },
  {
    id: 'can',
    name: { en: 'Can', lt: 'Skardinė/Stiklainė', ru: 'Банка' },
    measureType: '3d',
  },
  {
    id: 'reel',
    name: { en: 'Reel', lt: 'Ritė', ru: 'Катушка' },
    measureType: '1d',
  },
];

export function packageTypes(locale = i18n.locale, fallbackLocale = i18n.fallbackLocale) {
  return PackageType.map(packageType => ({
    ...packageType,
    name: packageType.name[locale] || packageType.name[fallbackLocale],
  }));
}

export function getById(id) {
  return find(packageTypes(), { id });
}
