import type { Metadata } from 'next';
import './globals.css';
import './v035.css';

export const metadata: Metadata = {
  title: 'Тотоша — детский сад нового поколения в Астане',
  description: 'Тотоша — современный детский сад: видеонаблюдение, логопед, Английский язык, хореография, вокал, таэквондо, врач-педиатр и Цифровой кабинет.',
  keywords: ['детский сад Астана','Тотоша','частный детский сад','детский сад с видеонаблюдением','логопед Астана','подготовка к школе'],
  openGraph: { title: 'Тотоша — место, где забота стала системой', description: 'Безопасность • Развитие • Технологии • Забота', type: 'website', locale: 'ru_KZ' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="ru"><body>{children}
        <script
          id="totosha-photo-protection"
          dangerouslySetInnerHTML={{
            __html: `
              document.addEventListener('contextmenu', function(e) {
                if (e.target && e.target.tagName === 'IMG') e.preventDefault();
              });
              document.addEventListener('dragstart', function(e) {
                if (e.target && e.target.tagName === 'IMG') e.preventDefault();
              });
              document.addEventListener('keydown', function(e) {
                if ((e.ctrlKey || e.metaKey) && ['s','u','p'].includes(e.key.toLowerCase())) {
                  e.preventDefault();
                }
              });
            `,
          }}
        />

      </body></html>;
}
