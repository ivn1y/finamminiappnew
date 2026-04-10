'use client';

import { ChevronLeft } from 'lucide-react';

const glowBackground =
  'linear-gradient(305deg, #FEDA3B -2.67%, #EF5541 38.9%, #801FDB 77.17%, #7E2A89 98.46%)';

const gradientLink =
  'linear-gradient(90deg, #FDB938 0%, #DE6D4B 50%, #A55AFF 100%)';

function GradientLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="bg-clip-text text-transparent underline decoration-white/30 underline-offset-[3px]"
      style={{ backgroundImage: gradientLink, WebkitBackgroundClip: 'text', backgroundClip: 'text' }}
    >
      {children}
    </a>
  );
}

type Props = {
  onClose: () => void;
};

export function ConsentPersonalDataOverlay({ onClose }: Props) {
  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-black text-white"
      style={{ WebkitOverflowScrolling: 'touch', overscrollBehavior: 'none' }}
    >
      <div className="relative min-h-full">
        <div
          className="pointer-events-none absolute right-[105px] top-[-66px] z-0 h-[260px] w-[375px] rounded-[375px] opacity-[0.16] blur-[50px]"
          style={{ background: glowBackground }}
          aria-hidden
        />

        <div className="relative z-10 mx-auto flex w-full max-w-3xl flex-col pb-[calc(3rem+env(safe-area-inset-bottom,0px))] md:pb-20">
          <div className="px-5 pt-10 md:px-8 md:pt-16 lg:px-12">
            <button
              type="button"
              onClick={onClose}
              className="flex size-11 items-center justify-center rounded-xl bg-white/[0.08] text-white/80 active:scale-95 active:bg-white/[0.15] transition-all hover:bg-white/[0.12] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/25"
              style={{ touchAction: 'manipulation' }}
              aria-label="Назад"
            >
              <ChevronLeft className="size-5" strokeWidth={2.5} />
            </button>
          </div>

          <h1 className="mt-6 px-5 font-[family-name:var(--font-inter-tight)] text-[30px] font-normal leading-[1.1] tracking-[-0.6px] md:px-8 md:text-4xl md:leading-[1.15] md:tracking-[-0.8px] lg:px-12">
            Согласие на&nbsp;обработку персональных данных
          </h1>

          <div className="mt-8 px-5 md:px-8 lg:px-12">
            <div className="max-w-[353px] text-[16px] leading-normal text-white/[0.85] md:max-w-none md:text-[17px] md:leading-relaxed">
              <ConsentBody />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ConsentBody() {
  return (
    <div className="flex flex-col gap-1 font-[family-name:var(--font-inter-tight)]">
      <h2 className="mb-2 mt-2 text-[18px] font-bold text-white md:text-[20px]">Термины</h2>

      <p className="mb-3">
        <strong className="text-white">1.1. Оператор</strong> — Акционерное общество «Инвестиционная компания «ФИНАМ», ИНН:&nbsp;7731038186, ОГРН:&nbsp;1027739572343, 127006, г.&nbsp;Москва, пер.&nbsp;Настасьинский, д.7, стр.2, комн.33.
      </p>
      <p className="mb-3">
        <strong className="text-white">1.2. Электронный ресурс</strong> — веб-сайт Оператора в&nbsp;сети «Интернет»{' '}
        <GradientLink href="https://collab.finam.ru/">https://collab.finam.ru/</GradientLink>{' '}
        (далее — Электронный ресурс, либо Сайт).
      </p>
      <p className="mb-5">
        <strong className="text-white">1.3. Пользователь</strong> — любое лицо, посещающее Электронный ресурс Оператора и/или предоставляющее Оператору свои персональные данные для использования функционала Электронного ресурса.
      </p>

      <h2 className="mb-2 mt-2 text-[18px] font-bold text-white md:text-[20px]">Текст Согласия</h2>

      <p className="mb-3">
        <strong className="text-white">1.</strong> Используя Электронный ресурс или направляя информацию через его сервисы (например, подписка на&nbsp;рассылки, отправка электронных писем или иными способами), я&nbsp;подтверждаю свое решение о&nbsp;предоставлении персональных данных и&nbsp;выражаю полное согласие в&nbsp;соответствии со&nbsp;ст.&nbsp;9 Федерального закона от&nbsp;27.07.2006 №&nbsp;152&#8209;ФЗ «О&nbsp;персональных данных» на&nbsp;смешанную обработку, сбор, использование, хранение, уточнение (обновление, изменение), обезличивание, блокирование и&nbsp;уничтожение моих персональных данных, а&nbsp;также согласие на&nbsp;обработку персональных данных, введенных в&nbsp;формы, и&nbsp;иных данных, которые могут быть технически переданы Оператору посредством сети Интернет, свободно, своей волей и&nbsp;в&nbsp;своем интересе, в&nbsp;соответствии с&nbsp;настоящим Согласием и&nbsp;«Политикой обработки персональных данных Пользователей» (далее&nbsp;Политика). Согласие на&nbsp;обработку персональных данных может быть как автоматизированной, так и&nbsp;неавтоматизированной.
      </p>

      <p className="mb-3">
        <strong className="text-white">2.</strong> Я&nbsp;гарантирую достоверность предоставленных мной персональных данных при использовании Электронного ресурса, а&nbsp;также гарантирую, что предоставленные мной персональные данные принадлежат мне. Я&nbsp;несу полную ответственность за&nbsp;предоставление недостоверных данных или данных, принадлежащих третьим лицам.
      </p>

      <p className="mb-3">
        <strong className="text-white">3.</strong> В&nbsp;случае предъявления любых претензий к&nbsp;Оператору Электронного ресурса третьими лицами, связанных с&nbsp;обработкой и&nbsp;использованием персональных данных, предоставленных мной, я&nbsp;обязуюсь урегулировать указанные претензии с&nbsp;третьими лицами за&nbsp;свой счет и&nbsp;своими силами.
      </p>

      <p className="mb-3">
        <strong className="text-white">4.</strong> Оператор Электронного ресурса имеет право отказать мне в&nbsp;доступе к&nbsp;сервисам Электронного ресурса без объяснения причин отказа. В&nbsp;таком случае мои персональные данные удаляются, если они хранятся у&nbsp;Владельца Электронного ресурса.
      </p>

      <p className="mb-3">
        <strong className="text-white">5.</strong> Оператор Электронного ресурса имеет право использовать мои персональные данные в&nbsp;пределах, разрешенных законодательством Российской Федерации, а&nbsp;также раскрывать персональные данные на&nbsp;основании федерального закона, в&nbsp;том числе по&nbsp;запросу правоохранительных органов.
      </p>

      <p className="mb-3">
        <strong className="text-white">6.</strong> Мое согласие может быть отозвано в&nbsp;письменной форме путем направления заявления по&nbsp;адресу Оператора, указанному в&nbsp;Политике.
      </p>

      <p className="mb-3">
        <strong className="text-white">7.</strong> Я&nbsp;считаю, что ознакомлен с&nbsp;Политикой и&nbsp;даю согласие с&nbsp;момента начала использования Электронного ресурса. Я&nbsp;признаю и&nbsp;понимаю требования Федерального закона от&nbsp;27.07.2006 №&nbsp;152&#8209;ФЗ «О&nbsp;персональных данных», свои права и&nbsp;обязанности в&nbsp;этой области.
      </p>

      <p className="mb-3">
        <strong className="text-white">8.</strong> Посещая Электронный ресурс, я&nbsp;даю согласие Оператору на&nbsp;использование файлов cookies в&nbsp;соответствии с&nbsp;условиями Политики. Я&nbsp;уведомлен и&nbsp;согласен с&nbsp;тем, что Оператор использует Яндекс.Метрику как метрическую программу. Ссылка на&nbsp;политику сбора данных Яндекс:{' '}
        <GradientLink href="https://yandex.ru/support/metrica/code/data-collected.html">
          https://yandex.ru/support/metrica/code/data-collected.html
        </GradientLink>.
      </p>

      <p className="mb-3">
        <strong className="text-white">9.</strong> Персональные данные и&nbsp;личная информация, предоставленные через Электронный ресурс, будут использоваться для целей, указанных в&nbsp;Согласии и&nbsp;Политике. Обработка персональных данных прекращается по&nbsp;достижении целей обработки. Категории персональных данных, на&nbsp;обработку которых я&nbsp;даю согласие, указаны в&nbsp;Политике.
      </p>

      <p className="mb-2">
        <strong className="text-white">10.</strong> Оператор может раскрывать личную информацию и&nbsp;персональные данные Пользователя:
      </p>
      <ul className="mb-3 ml-5 list-disc flex flex-col gap-1 marker:text-white/40">
        <li>10.1. в&nbsp;объеме, предусмотренном законодательством Российской Федерации;</li>
        <li>10.2. в&nbsp;связи с&nbsp;любыми текущими или предполагаемыми разбирательствами;</li>
        <li>10.3. по&nbsp;запросу уполномоченных государственных органов (например, МВД, Прокуратура, Следственный комитет), а&nbsp;также для защиты правовых прав и&nbsp;интересов Оператора, включая предотвращение мошенничества и&nbsp;снижение кредитного риска;</li>
        <li>10.4. аналитическим системам и&nbsp;рекламодателям в&nbsp;объеме и&nbsp;пределах, установленных настоящим Согласием и&nbsp;Политикой;</li>
        <li>10.5. в&nbsp;иных случаях, предусмотренных законодательством Российской Федерации.</li>
      </ul>

      <p className="mb-3">
        <strong className="text-white">11.</strong> Срок, в&nbsp;течение которого будут храниться персональные данные и&nbsp;иная личная информация: до&nbsp;достижения цели обработки персональных данных.
      </p>

      <p className="mb-3">
        <strong className="text-white">12.</strong> Оператор принимает разумные технические и&nbsp;организационные меры предосторожности для предотвращения потери, неправильного использования или изменения персональных данных и&nbsp;личной информации, как описано в&nbsp;Политике.
      </p>

      <p className="mt-2 text-white/50">
        Более подробную информацию об&nbsp;обработке персональных данных вы&nbsp;можете найти в&nbsp;Политике обработки персональных данных.
      </p>
    </div>
  );
}
