export default interface Language {
  key: string;
  name: string;
  icon: string;
}

export const Languages : Language[] = [
  {
    key: 'en',
    name: 'English',
    icon: '/img/icons8-great-britain.svg',
  },
  {
    key: 'ru',
    name: 'Русский',
    icon: '/img/icons8-russian-federation.svg',
  },
  {
    key: 'lt',
    name: 'Lietuvių',
    icon: '/img/icons8-lithuania.svg',
  },
];
