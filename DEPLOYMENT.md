# 🚀 Деплой Fatherhood Is

Полная инструкция по деплою проекта на Render.com (backend) и Vercel (frontend).

---

## 📦 Что нужно подготовить заранее

Зарегистрируйся и получи креды от этих сервисов:

| Сервис | Назначение | Ссылка | Что нужно |
|--------|-----------|--------|-----------|
| **Supabase** | База данных | [supabase.com](https://supabase.com) | URL, Service Key, Anon Key, DATABASE_URL |
| **Google AI** | Генерация изображений | [aistudio.google.com](https://aistudio.google.com/app/apikey) | API Key |
| **Cloudflare R2** | Хранилище изображений | [dash.cloudflare.com](https://dash.cloudflare.com) | Account ID, Access Key, Secret Key, Public URL |
| **GitHub** | Репозиторий | [github.com](https://github.com) | Залить код |
| **Render** | Хостинг backend | [render.com](https://render.com) | Аккаунт (бесплатный) |
| **Vercel** | Хостинг frontend | [vercel.com](https://vercel.com) | Аккаунт (бесплатный) |

---

## 1️⃣ Деплой Backend (Render.com)

### Шаг 1: Открой Render Dashboard
Перейди на https://dashboard.render.com/

### Шаг 2: Создай Web Service через Blueprint
1. Нажми **"New +"** → выбери **"Blueprint"**
2. Подключи свой GitHub репозиторий `fatherhood-is`
3. Render автоматически найдет файл `render.yaml`
4. Нажми **"Apply"**

### Шаг 3: Добавь переменные окружения
В разделе **Settings → Environment** добавь:

```bash
# Application
ENVIRONMENT=production
API_HOST=0.0.0.0
API_PORT=10000
FRONTEND_URL=http://localhost:3000
RATE_LIMIT_PER_HOUR=10

# Supabase (скопируй из Supabase Dashboard → Settings → API)
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...  # Service role key
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
DATABASE_URL=postgresql://postgres:password@db.xxxxx.supabase.co:5432/postgres

# Google AI (скопируй из https://aistudio.google.com/app/apikey)
GOOGLE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXX

# Cloudflare R2 (скопируй из R2 Dashboard)
R2_ACCOUNT_ID=your-account-id
R2_ACCESS_KEY_ID=your-access-key
R2_SECRET_ACCESS_KEY=your-secret-key
R2_BUCKET_NAME=fatherhood-images
R2_PUBLIC_URL=https://pub-xxxxx.r2.dev
```

### Шаг 4: Сохрани и дождись деплоя
1. Нажми **"Save Changes"**
2. Render начнет автоматический деплой (3-5 минут)
3. Статус изменится на **"Live"** ✅

### Шаг 5: Проверь работу
Скопируй URL (например, `https://fatherhood-is-backend.onrender.com`) и открой в браузере:
```
https://fatherhood-is-backend.onrender.com/health
```

Должен вернуть:
```json
{
  "status": "healthy",
  "environment": "production"
}
```

✅ **Backend готов!**

---

## 2️⃣ Деплой Frontend (Vercel)

### Шаг 1: Открой Vercel Dashboard
Перейди на https://vercel.com/dashboard

### Шаг 2: Создай проект
1. Нажми **"Add New..."** → выбери **"Project"**
2. Выбери свой GitHub репозиторий `fatherhood-is`
3. Нажми **"Import"**

### Шаг 3: Настрой проект
Vercel автоматически определит Next.js. Проверь:
- **Framework Preset:** Next.js ✅
- **Root Directory:** `.` (корень проекта) ✅
- **Build Command:** `npm run build` ✅

### Шаг 4: Добавь переменные окружения
В разделе **Environment Variables** добавь:

```bash
# Backend API URL (твой Render URL из Шага 1.5)
NEXT_PUBLIC_API_URL=https://fatherhood-is-backend.onrender.com

# Supabase (опционально, для прямых запросов)
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

⚠️ **Важно:** Замени URL на свой реальный Render URL!

### Шаг 5: Deploy
1. Нажми **"Deploy"**
2. Дождись завершения (2-4 минуты)
3. Скопируй URL (например, `https://fatherhood-is-abc123.vercel.app`)

✅ **Frontend готов!**

---

## 3️⃣ Обновление CORS

### Важный шаг! Обнови FRONTEND_URL в Render
1. Вернись в Render Dashboard
2. Перейди в **Settings → Environment**
3. Найди переменную `FRONTEND_URL`
4. Измени на URL Vercel:
   ```bash
   FRONTEND_URL=https://fatherhood-is-abc123.vercel.app
   ```
5. Нажми **"Save Changes"**
6. Render автоматически перезапустит backend

---

## 4️⃣ Финальная проверка

### 1. Открой свой сайт
Перейди на URL Vercel: `https://fatherhood-is-abc123.vercel.app`

### 2. Создай тестовый пост
1. Нажми **"Create Post"** (или `/create`)
2. Введи текст, например: `"teaching my daughter to ride a bike"`
3. Нажми **"Create"**
4. Подожди 5-10 секунд (генерация изображения)

### 3. Убедись, что всё работает
- [ ] Изображение сгенерировалось ✅
- [ ] Пост сохранился в базе ✅
- [ ] Пост отображается на главной странице ✅
- [ ] Нет ошибок в DevTools → Console ✅

---

## 🎉 Поздравляю! Проект в продакшене!

**Твои ссылки:**
- **Frontend:** https://fatherhood-is-abc123.vercel.app
- **Backend API:** https://fatherhood-is-backend.onrender.com
- **API Docs:** https://fatherhood-is-backend.onrender.com/docs

---

## 🔧 Дополнительно: Custom Domain (опционально)

Хочешь использовать свой домен типа `fatherhood.is`?

### Frontend Domain (fatherhood.is)
1. Vercel Dashboard → **Settings → Domains**
2. Добавь домен `fatherhood.is`
3. В DNS провайдере добавь:
   ```
   A record: @ → 76.76.21.21
   CNAME: www → cname.vercel-dns.com
   ```

### Backend Domain (api.fatherhood.is)
1. Render Dashboard → **Settings → Custom Domain**
2. Добавь домен `api.fatherhood.is`
3. В DNS провайдере добавь:
   ```
   CNAME: api → fatherhood-is-backend.onrender.com
   ```

### Обнови переменные окружения
После добавления доменов:
1. **Render:** `FRONTEND_URL=https://fatherhood.is`
2. **Vercel:** `NEXT_PUBLIC_API_URL=https://api.fatherhood.is`

---

## ⚠️ Известные ограничения Free Tier

### Render.com
- **Спящий режим:** Backend засыпает после 15 минут неактивности
- **Первый запрос после сна:** Занимает 30-60 секунд
- **Решение:** Используй loading state или апгрейдись до платного плана ($7/месяц)

### Vercel
- **Лимит деплоев:** 100/день на бесплатном плане
- **Bandwidth:** 100 GB/месяц
- **Build Time:** 6000 минут/месяц

---

## 🐛 Что делать, если что-то не работает?

### Backend не запускается (Render Logs показывает ошибки)
Проверь:
1. ✅ Все переменные окружения добавлены
2. ✅ `DATABASE_URL` правильный (из Supabase → Settings → Database)
3. ✅ `GOOGLE_API_KEY` валидный
4. ✅ R2 бакет существует и публичный

### Frontend не коннектится к backend (CORS ошибки)
Проверь:
1. ✅ `NEXT_PUBLIC_API_URL` правильный в Vercel Environment
2. ✅ `FRONTEND_URL` правильный в Render Environment
3. ✅ URL без слэша в конце: `https://app.com` (не `https://app.com/`)

### Images не загружаются
Проверь:
1. ✅ R2 бакет публичный (Cloudflare → R2 → Settings → Public Access)
2. ✅ `R2_PUBLIC_URL` правильный в Render
3. ✅ `next.config.ts` содержит `remotePatterns` для R2 домена

---

## 📚 Дополнительные ресурсы

- **Render Docs:** https://render.com/docs
- **Vercel Docs:** https://vercel.com/docs
- **Next.js Deployment:** https://nextjs.org/docs/app/building-your-application/deploying
