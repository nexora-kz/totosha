import type { Metadata } from 'next';
import { SeoLanding } from '../../components/SeoLanding';

export const metadata: Metadata = {
  title: 'Контакты детского сада Тотоша в Астане',
  description: 'Контакты Тотоша: записаться на экскурсию, позвонить заведующей, написать в WhatsApp или Telegram, открыть карту и маршрут.',
  alternates: { canonical: '/contacts' },
};

export default function ContactsSeoPage() {
  return (
    <SeoLanding
      eyebrow="Контакты"
      title="Связаться с детским садом Тотоша в Астане"
      description="Оставьте заявку, напишите в WhatsApp, подпишитесь на Telegram-канал или позвоните заведующей Айшагуль Галымжановне."
      bullets={[
        'Телефон: +7 (776) 700-29-29',
        'WhatsApp для быстрой связи',
        'Официальный Telegram-канал @totoshakids',
        'Instagram @totoshakids',
        'Запись на экскурсию',
        'Удобный маршрут через 2ГИС',
      ]}
      cta="Написать в WhatsApp"
    />
  );
}
