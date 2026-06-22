import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Жизнь Тотоша — фото и события детского сада',
  description:
    'Фотографии, праздники, занятия и повседневная жизнь детского сада Тотоша в Астане.',
  alternates: {
    canonical: '/life',
  },
  openGraph: {
    title: 'Жизнь Тотоша — фото и события детского сада',
    description:
      'Настоящие моменты детского сада Тотоша: праздники, занятия, развитие и заботливая атмосфера.',
    url: '/life',
    type: 'website',
    locale: 'ru_KZ',
  },
};

export default function LifeLayout({ children }: { children: React.ReactNode }) {
  return children;
}
