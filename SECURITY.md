# Отчёт об устранении уязвимостей

Документ описывает выполненные меры по закрытию выявленных уязвимостей в проекте.

---

## Сводка

| Уязвимость | CVE | Критичность | Статус |
|------------|-----|-------------|--------|
| SSRF в `/_next/image` | CVE-2024-34351 | Высокая | Закрыта |
| RCE в React Server Components | CVE-2025-55182 | Критическая | Закрыта |
| Опасная конфигурация `remotePatterns` | — | Высокая | Закрыта |

---

## 1. Обновление Next.js до 15.4.11

**Проблема:** Уязвимости CVE-2024-34351 (SSRF) и CVE-2025-55182 (RCE в React Server Components).

**Решение:** Обновление Next.js с 14.2.15 до **15.4.11** — минорной версии с патчами безопасности.

**Изменения в `package.json`:**
- `next`: `15.4.11`
- `eslint-config-next`: `15.4.11`
- `@next/env`: `15.4.11`

**Источники:**
- [GHSA-fr5h-rqp8-mj6g](https://github.com/vercel/next.js/security/advisories/GHSA-fr5h-rqp8-mj6g) — SSRF в Server Actions
- [Critical Security Vulnerability in React Server Components](https://react.dev/blog/2025/12/03/critical-security-vulnerability-in-react-server-components) — CVE-2025-55182

---

## 2. Ограничение `remotePatterns` (SSRF в `/_next/image`)

**Проблема:** Эндпоинт `/_next/image` позволял запросы к произвольным URL, включая внутренние адреса (RFC 1918: 10.x.x.x, 172.16.x.x, 192.168.x.x).

**Пример эксплуатации:**
```
GET /_next/image?w=16&q=10&url=http://10.77.235.152:8000/
```

**Решение:** В `next.config.mjs` установлен пустой массив `remotePatterns`:

```js
images: {
  remotePatterns: [],
},
```

**Обоснование:** Проект использует только локальные изображения (`/assets/...`). Внешние URL в `next/image` не применяются. Пустой список разрешает только локальные пути и блокирует SSRF.


**Сборка:**
```bash
pnpm install
pnpm run build
```

**Проверка SSRF (ожидается 400 Bad Request):**
```bash
curl "http://localhost:3000/_next/image?w=16&q=10&url=http://10.77.235.152:8000/"
```
