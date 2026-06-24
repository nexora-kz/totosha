export type TotoshaVacancy = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  responsibilities: string[];
  requirements: string[];
  conditions: string[];
  employment: string;
  schedule: string;
  location: string;
  salaryFrom?: number | null;
  salaryTo?: number | null;
  currency?: string;
  source: 'totosha' | 'hh';
  externalUrl?: string | null;
  externalId?: string | null;
  publishedAt?: string | null;
  active: boolean;
};

export const TOTOSHA_RECRUITING_FALLBACK: TotoshaVacancy[] = [
  {
    id: 'totosha-vospitatel',
    slug: 'vospitatel',
    title: 'Воспитатель',
    summary: 'Ищем внимательного педагога, который умеет создавать спокойную, безопасную и развивающую атмосферу для детей.',
    responsibilities: [
      'Организация режима и развивающих занятий группы',
      'Наблюдение за адаптацией и самочувствием детей',
      'Открытая и корректная коммуникация с родителями',
      'Работа по единым стандартам детского сада Тотоша',
    ],
    requirements: [
      'Профильное педагогическое образование',
      'Опыт работы с детьми дошкольного возраста',
      'Грамотная русская речь; казахский язык будет преимуществом',
      'Ответственность, доброжелательность и командная работа',
    ],
    conditions: [
      'Работа в современном частном детском саду в Астане',
      'Пятидневная рабочая неделя',
      'Стабильная команда и понятные рабочие процессы',
      'Оформление и оплата обсуждаются на собеседовании',
    ],
    employment: 'Полная занятость',
    schedule: 'Пн–Пт',
    location: 'Астана, ул. Алихана Бокейхана, 29А',
    source: 'totosha',
    active: true,
  },
  {
    id: 'totosha-pomoshnik-vospitatelya',
    slug: 'pomoshnik-vospitatelya',
    title: 'Помощник воспитателя',
    summary: 'Нужен заботливый и аккуратный сотрудник, готовый помогать воспитателю и поддерживать порядок и комфорт в группе.',
    responsibilities: [
      'Помощь воспитателю в ежедневной работе группы',
      'Сопровождение детей во время питания, прогулок и режимных моментов',
      'Поддержание чистоты и порядка в помещениях группы',
      'Соблюдение правил безопасности и санитарных требований',
    ],
    requirements: [
      'Ответственное и бережное отношение к детям',
      'Аккуратность и исполнительность',
      'Готовность работать в команде',
      'Опыт работы в детском саду будет преимуществом',
    ],
    conditions: [
      'Работа в детском саду Тотоша в Астане',
      'Пятидневная рабочая неделя',
      'Понятные обязанности и поддержка команды',
      'Условия оплаты обсуждаются на собеседовании',
    ],
    employment: 'Полная занятость',
    schedule: 'Пн–Пт',
    location: 'Астана, ул. Алихана Бокейхана, 29А',
    source: 'totosha',
    active: true,
  },
  {
    id: 'totosha-pedagog-dop-obrazovaniya',
    slug: 'pedagog-dopolnitelnogo-obrazovaniya',
    title: 'Педагог дополнительного образования',
    summary: 'Рассматриваем педагогов английского языка, музыки, хореографии, подготовки к школе и других дошкольных направлений.',
    responsibilities: [
      'Проведение занятий по утверждённому расписанию',
      'Адаптация программы под возраст группы',
      'Подготовка материалов и краткой обратной связи',
      'Соблюдение стандартов безопасности и общения с детьми',
    ],
    requirements: [
      'Профильная квалификация по своему направлению',
      'Опыт занятий с дошкольниками',
      'Умение удерживать внимание группы без давления',
      'Пунктуальность и готовность работать по расписанию сада',
    ],
    conditions: [
      'Частичная занятость или работа по расписанию',
      'Современное пространство и готовые группы',
      'Долгосрочное сотрудничество при успешной работе',
      'Ставка обсуждается индивидуально',
    ],
    employment: 'Частичная занятость',
    schedule: 'По расписанию',
    location: 'Астана, ул. Алихана Бокейхана, 29А',
    source: 'totosha',
    active: true,
  },
];

export function formatVacancySalary(vacancy: Pick<TotoshaVacancy, 'salaryFrom' | 'salaryTo' | 'currency'>) {
  const from = Number(vacancy.salaryFrom || 0);
  const to = Number(vacancy.salaryTo || 0);
  const currency = vacancy.currency || 'KZT';
  const formatter = new Intl.NumberFormat('ru-RU');
  if (from && to) return `${formatter.format(from)}–${formatter.format(to)} ${currency}`;
  if (from) return `от ${formatter.format(from)} ${currency}`;
  if (to) return `до ${formatter.format(to)} ${currency}`;
  return 'Обсуждается на собеседовании';
}
