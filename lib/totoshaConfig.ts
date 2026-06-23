import homeHero from '../public/totosha-premium/home-hero.jpg';
import programsHero from '../public/totosha-premium/programs-hero.jpg';
import parentsHero from '../public/totosha-premium/parents-hero.jpg';

export const TOTOSHA_VERSION = 'v083';
export const TOTOSHA_BUILD_DATE = '2026-06-23';
export const TOTOSHA_DEPLOY_LABEL = 'Premium Production v083';

const mapQuery = encodeURIComponent('Тотоша, Астана, улица Алихана Бокейхана, 29А');

export const TOTOSHA_CONTACTS = {
  phoneDigits: '77767002929',
  phoneDisplay: '+7 (776) 700-29-29',
  contactPerson: 'Айшагуль Галымжановна',
  contactRole: 'Заведующая детским садом',
  address: 'Астана, ул. Алихана Бокейхана, 29А',
  telUrl: 'tel:+77767002929',
  whatsappUrl: 'https://wa.me/77767002929',
  instagramUrl: 'https://www.instagram.com/totoshakids/',
  telegramUrl: 'https://t.me/totoshakids',
  mapUrl:
    'https://2gis.kz/astana/search/%D0%A2%D0%BE%D1%82%D0%BE%D1%88%D0%B0%20%D0%90%D0%BB%D0%B8%D1%85%D0%B0%D0%BD%20%D0%91%D0%BE%D0%BA%D0%B5%D0%B9%D1%85%D0%B0%D0%BD%2029%D0%B0',
  yandexMapUrl: `https://yandex.kz/maps/?text=${mapQuery}`,
  yandexMapEmbedUrl: `https://yandex.ru/map-widget/v1/?mode=search&text=${mapQuery}&z=17`,
} as const;

export const PREMIUM_VISUALS = {
  home: {
    src: homeHero.src,
    alt: 'Счастливые дети на празднике в детском саду Тотоша',
  },
  about: {
    src: homeHero.src,
    alt: 'Тёплая атмосфера и забота в детском саду Тотоша',
  },
  programs: {
    src: programsHero.src,
    alt: 'Дети участвуют в развивающих занятиях Тотоша',
  },
  parents: {
    src: parentsHero.src,
    alt: 'Радостные дети в спокойной атмосфере детского сада Тотоша',
  },
} as const;

export const HOME_GALLERY = [
  {
    src: PREMIUM_VISUALS.home.src,
    alt: 'Новый год в Тотоша',
    title: 'Праздники',
  },
  {
    src: PREMIUM_VISUALS.programs.src,
    alt: 'Праздник в детском саду Тотоша',
    title: 'Мероприятия',
  },
  {
    src: PREMIUM_VISUALS.parents.src,
    alt: 'Жизнь детского сада Тотоша',
    title: 'Атмосфера',
  },
] as const;
