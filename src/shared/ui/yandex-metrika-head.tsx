import Script from 'next/script'

function enabled(): boolean {
  const id = process.env.NEXT_PUBLIC_YANDEX_METRIKA_ID
  if (!id) return false
  if (process.env.NEXT_PUBLIC_ANALYTICS_ENABLED === 'false') return false
  return true
}

function getId(): number | null {
  const raw = process.env.NEXT_PUBLIC_YANDEX_METRIKA_ID
  if (!raw) return null
  const id = Number(raw)
  return Number.isFinite(id) ? id : null
}

/**
 * Счётчик Яндекс.Метрики: ранняя загрузка из &lt;head&gt; (аналог «вставь код в head» из инструкции Метрики).
 * Реализовано через next/script + beforeInteractive — так делает Next.js вместо сырого &lt;script&gt; в body.
 */
export function YandexMetrikaHead() {
  if (!enabled()) return null
  const id = getId()
  if (id == null) return null

  // 1:1 с кодом из кабинета Метрики (вставка в head), ID из NEXT_PUBLIC_YANDEX_METRIKA_ID
  return (
    <Script
      id="yandex-metrika"
      strategy="beforeInteractive"
      dangerouslySetInnerHTML={{
        __html: `
(function(m,e,t,r,i,k,a){
    m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
    m[i].l=1*new Date();
    for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
    k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)
})(window, document,'script','https://mc.yandex.ru/metrika/tag.js?id=${id}', 'ym');

ym(${id}, 'init', {ssr:true, webvisor:true, clickmap:true, ecommerce:"dataLayer", referrer: document.referrer, url: location.href, accurateTrackBounce:true, trackLinks:true});
`,
      }}
    />
  )
}
