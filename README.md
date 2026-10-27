# 🎲 ریاضی‌کوئست — Math Quest

A complete, free, browser-based **Persian Grade-10 math learning game**.
۲۳ درس تعاملی در ۷ فصل، دقیقاً مطابق فهرست کتاب ریاضی پایهٔ دهم — هر درس با
توضیح مفهومی کامل، ویجت تعاملی زنده (canvas)، مثال حل‌شدهٔ گام‌به‌گام، تمرین
راهنمادار، آزمون، امتیاز (XP)، نشان و رتبه. بدون ثبت‌نام، بدون تبلیغ، بدون
پای‌وال — صد در صد رایگان.

> فهرست پوشش‌داده‌شده (۷ فصل / ۲۳ درس):
> ۱. مجموعه، الگو و دنباله · ۲. مثلثات · ۳. توان‌های گویا و عبارت‌های جبری ·
> ۴. معادله‌ها و نامعادله‌ها · ۵. تابع · ۶. شمارش، بدون شمردن · ۷. آمار و احتمال

## ▶️ Run it

```bash
bun install
bun run dev          # http://localhost:3000
bun run build:export # fully static export (GitHub Pages) into .next-static/
```

Live: **https://bokuwaparsa.github.io/math-quest/**

## 🧩 Structure

- `src/data/math/ch1..7.ts` — lesson data (Persian content, KaTeX math in `$…$`)
- `src/components/sims/math/c1..7.tsx` — interactive canvas widgets (sim-kit)
- `src/components/game/` — shell: home map, lesson view, quiz, progress, book map
- `src/lib/game/` — curriculum registry, i18n (fa/RTL), progress store, hash router

## 📄 Content & licensing

All lesson text, examples, questions and widgets are **original works** (CC0 1.0);
the chapter/lesson list follows the public outline of the official Grade-10 math
textbook — no text, example, or image was copied from any book. Code: MIT.
