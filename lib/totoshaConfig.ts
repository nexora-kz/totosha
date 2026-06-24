import homeHero from '../public/totosha-media/2025/Осенние_события_2025/102_photo_1452@31-10-2025_14-29-07.jpg';
import aboutHero from '../public/totosha-media/2024/8_Марта_2024/058_photo_991@05-03-2024_13-19-07.jpg';
import programsHero from '../public/totosha-media/2024/Повседневная_жизнь/083_photo_1044@03-05-2024_11-55-55.jpg';
import parentsHero from '../public/totosha-media/2026/8_Марта_2026/118_photo_1808@05-03-2026_16-23-19.jpg';

export const TOTOSHA_VERSION = 'v096';
export const TOTOSHA_BUILD_DATE = '2026-06-24';
export const TOTOSHA_DEPLOY_LABEL = 'Free Recruiting Only v096';

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
    alt: 'Атмосфера Тотоша',
  },
  about: {
    src: aboutHero.src,
    alt: 'Жизнь Тотоша',
  },
  programs: {
    src: programsHero.src,
    alt: 'Занятия в Тотоша',
  },
  parents: {
    src: parentsHero.src,
    alt: 'Семейная атмосфера Тотоша',
  },
} as const;

export const HOME_GALLERY = [
  {
    src: PREMIUM_VISUALS.home.src,
    alt: 'Осенний праздник в Тотоша',
    title: 'Праздники',
  },
  {
    src: PREMIUM_VISUALS.programs.src,
    alt: 'Творческое занятие в Тотоша',
    title: 'Развитие',
  },
  {
    src: PREMIUM_VISUALS.parents.src,
    alt: 'Атмосфера Тотоша',
    title: 'Забота',
  },
] as const;
