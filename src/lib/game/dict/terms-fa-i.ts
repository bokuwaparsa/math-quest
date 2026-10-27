// ─── Physics Quest · Persian sim terms · slice i (w4-shm-lab, t4-gas-box, t5-heat-engine) ──
// Keys EXACTLY match the user-visible English strings in src/components/sims/i/.
// {placeholders} mark interpolated values; missing keys fall back to English.
export const termsFaI: Record<string, string> = {
  // ── w4-shm-lab ── frame, controls, readouts, legends
  'SHM Lab': 'آزمایشگاه حرکت هماهنگ ساده',
  'Springs and pendulums in simple harmonic motion. Theory says T = 2π√(m/k) and T = 2π√(L/g) — the stopwatch measures the real period from zero crossings to check.':
    'فنرها و آونگ‌ها در حرکت هماهنگ ساده. نظریه می‌گوید T = 2π√(m/k) و T = 2π√(L/g) — کرنومتر برای راستی‌آزمایی، تناوب واقعی را از گذر از صفر اندازه می‌گیرد.',
  'A mass oscillating on a spring beside vertical kinetic and potential energy bars, or a pendulum swinging between dashed extremes, with a period stopwatch during the challenge':
    'جرمی که روی فنر در کنار میله‌های عمودی انرژی جنبشی و پتانسیل نوسان می‌کند، یا آونگی که میان کران‌های نقطه‌چین تاب می‌خورد، همراه با کرنومتر تناوب در زمان چالش',
  'Mode': 'حالت',
  'Spring': 'فنر',
  'Pendulum': 'آونگ',
  'Mass m': 'جرم m',
  'Spring constant k': 'ثابت فنر k',
  'Length L': 'طول L',
  'Swing angle θ₀': 'زاویهٔ تاب θ₀',
  'Challenge: period exactly 2.00 s': 'چالش: تناوب دقیقاً 2.00 ثانیه',
  'Reset': 'بازنشانی',
  'T theory': 'T نظری',
  'T measured': 'T اندازه‌گیری‌شده',
  'Frequency f = 1/T': 'بسامد f = 1/T',
  'Total energy ½kA²': 'انرژی کل ½kA²',
  'kinetic energy': 'انرژی جنبشی',
  'potential energy': 'انرژی پتانسیل',
  'pendulum bob': 'گلولهٔ آونگ',

  // ── w4-shm-lab ── canvas strings
  'Challenge: tune the period to 2.00 ± 0.05 s for two cycles in a row!': 'چالش: تناوب را برای دو چرخهٔ پشت‌سرهم روی 2.00 ± 0.05 ثانیه تنظیم کن!',
  'T = measuring…': 'T = در حال اندازه‌گیری…',
  'motion paused · judged on theory ({n} cycles in band)': 'حرکت متوقف است · داوری بر پایهٔ نظریه ({n} چرخه در باند)',
  'stopwatch · in-band cycles: {n} / 2': 'کرنومتر · چرخه‌های درون باند: {n} / 2',
  '★ T = 2.00 s — challenge complete!': '★ T = 2.00 ثانیه — چالش کامل شد!',
  '(motion paused — readouts use theory)': '(حرکت متوقف است — نمایشگرها بر پایهٔ نظریه‌اند)',
  'total = ½kA² = {E} J (constant)': 'کل = ½kA² = {E} J (ثابت)',
  'x = {x} m': 'x = {x} m',
  'L = {L} m · θ = {θ}°': 'L = {L} m · θ = {θ}°',
  'KE': 'KE',
  'PE': 'PE',

  // ── w4-shm-lab ── challenge results
  'Goal: get a measured period of 2.00 ± 0.05 s for two cycles in a row. Spring: tune m and k (T = 2π√(m/k)). Pendulum: tune L (T = 2π√(L/g)) — θ₀ changes nothing!':
    'هدف: تناوب اندازه‌گیری‌شده را 2.00 ± 0.05 ثانیه بگیر و دو چرخهٔ پشت‌سرهم نگه دار. فنر: m و k را تنظیم کن (T = 2π√(m/k)). آونگ: L را تنظیم کن (T = 2π√(L/g)) — θ₀ هیچ تغییری نمی‌دهد!',
  '★ T = {T} s — two cycles in a row inside 2.00 ± 0.05 s! You tuned the ratio m/k just right: T = 2π√(m/k). Mass and stiffness trade off, so many pairs work.':
    '★ T = {T} ثانیه — دو چرخهٔ پشت‌سرهم درون 2.00 ± 0.05 ثانیه! نسبت m/k را درست تنظیم کرده‌ای: T = 2π√(m/k). جرم و سختی با هم معامله می‌کنند، پس جفت‌های بسیاری جواب می‌دهند.',
  '★ T = {T} s — two cycles in a row inside 2.00 ± 0.05 s! You found the "seconds pendulum": T = 2π√(L/g) needs L ≈ 0.99 m. The swing angle θ₀ never mattered.':
    '★ T = {T} ثانیه — دو چرخهٔ پشت‌سرهم درون 2.00 ± 0.05 ثانیه! «آونگ ثانیه‌ای» را یافته‌ای: T = 2π√(L/g) به L ≈ 0.99 m نیاز دارد. زاویهٔ تاب θ₀ هرگز مهم نبود.',

  // ── t4-gas-box ── frame, controls, readouts, legends
  'Gas Box': 'جعبهٔ گاز',
  '100 particles bounce elastically off the walls. Heat them (T↑) or squeeze the box (V↓) and watch the pressure climb — the readout is the real momentum the walls receive each second.':
    '100 ذره از دیوارها به‌طور کشسان بازتاب می‌کنند. آن‌ها را گرم کن (T↑) یا جعبه را فشرده کن (V↓) و بالا رفتن فشار را ببین — نمایشگر، تکانهٔ واقعی‌ای است که هر ثانیه به دیوارها می‌رسد.',
  'A box of 100 bouncing gas particles with adjustable temperature and volume; the pressure readout is measured from the momentum the particles deliver to the walls':
    'جعبه‌ای با 100 ذرهٔ گازِ جهنده و دما و حجمِ تنظیم‌پذیر؛ نمایشگر فشار از تکانه‌ای که ذره‌ها به دیوارها می‌رسانند اندازه‌گیری می‌شود',
  'Temperature T': 'دما T',
  'Volume V': 'حجم V',
  'Colour by speed': 'رنگ‌آمیزی بر اساس تندی',
  'Challenge: target P = 150': 'چالش: هدف P = 150',
  'Temperature': 'دما',
  'Volume': 'حجم',
  'Pressure (smoothed)': 'فشار (هموارشده)',
  'Theory P = 100·T/(300·V)': 'نظریه P = 100·T/(300·V)',
  'slow particles': 'ذره‌های کند',
  'medium': 'متوسط',
  'fast particles': 'ذره‌های تند',

  // ── t4-gas-box ── canvas strings
  'N = 100 elastic particles · P measured from wall momentum flux': 'N = 100 ذرهٔ کشسان · فشار P از شار تکانهٔ دیوارها اندازه‌گیری می‌شود',
  'Challenge: reach P = 150 units (±8) by tuning T and V!': 'چالش: با تنظیم T و V به P = 150 یکا (±8) برس!',
  'in band {t} / 2 s': 'در باند {t} / 2 ثانیه',
  '★ P = 150 units — challenge complete!': '★ P = 150 یکا — چالش کامل شد!',

  // ── t4-gas-box ── challenge results
  'Goal: tune T and V until the smoothed pressure sits at 150 units (±8) for 2 s. Remember P ∝ T/V — try 450 K at V = 1, or 300 K with V ≈ 0.65–0.70.':
    'هدف: T و V را طوری تنظیم کن که فشار هموارشده 2 ثانیه روی 150 یکا (±8) بماند. یادت باشد P ∝ T/V — 450 K در V = 1، یا 300 K با V ≈ 0.65–0.70 را امتحان کن.',
  '★ P = {P} units — on target and steady for 2 s! You lived the law P ∝ T/V: hotter or squeezed gas hammers the walls harder and more often.':
    '★ P = {P} یکا — روی هدف و پایدار به مدت 2 ثانیه! قانون P ∝ T/V را با تمام وجود زیستی: گازِ داغ‌تر یا فشرده‌تر، محکم‌تر و پرتواترتر به دیوارها کوبیده می‌شود.',

  // ── t5-heat-engine ── frame, controls, readouts, legends
  'Heat Engine': 'موتور گرمایی',
  'Pour 1000 J of heat in: the engine outputs work W and dumps waste heat Qc. Efficiency e = W/Qh is capped by Carnot, e_max = 1 − Tc/Th, in kelvin. Beat 500 J if you can!':
    '1000 ژول گرما بریز: موتور کار W را بیرون می‌دهد و گرمای هدررفتهٔ Qc را دور می‌ریزد. بازده e = W/Qh با سقف کارنو، یعنی e_max = 1 − Tc/Th بر حسب کلوین، محدود می‌شود. اگر می‌توانی از 500 J پیشی بگیر!',
  'A heat engine between a hot and a cold reservoir: heat flows in, work flows out and waste heat is dumped, with three energy bars and the Carnot limit marked':
    'موتور گرمایی میان مخزن گرم و سرد: گرما درون می‌رود، کار بیرون می‌آید و گرمای هدررفته دور ریخته می‌شود؛ با سه میلهٔ انرژی و علامت‌گذاری حد کارنو',
  'Hot reservoir Th': 'مخزن گرم Th',
  'Cold reservoir Tc': 'مخزن سرد Tc',
  'Engine type': 'نوع موتور',
  'Ideal Carnot (reversible)': 'کارنوی ایده‌آل (بازگشت‌پذیر)',
  'Steam turbine · 15%': 'توربین بخار · 15%',
  'Petrol engine · 25%': 'موتور بنزینی · 25%',
  'Diesel engine · 37%': 'موتور دیزلی · 37%',
  'Pour 1000 J': 'ریختن 1000 J',
  'Challenge: W ≥ 500 J': 'چالش: W ≥ 500 J',
  'Efficiency e = W/Qh': 'بازده e = W/Qh',
  'Carnot limit 1 − Tc/Th': 'حد کارنو 1 − Tc/Th',
  'Work W': 'کار W',
  'Waste heat Qc': 'گرمای هدررفته Qc',
  'heat in Qh': 'گرمای ورودی Qh',
  'work out W': 'کار خروجی W',
  'waste heat Qc': 'گرمای هدررفته Qc',

  // ── t5-heat-engine ── canvas strings
  'hot · Th = {Th} K': 'گرم · Th = {Th} K',
  'cold · Tc = {Tc} K': 'سرد · Tc = {Tc} K',
  'Tc ≥ Th — engine cannot run!': 'Tc ≥ Th — موتور نمی‌تواند کار کند!',
  'ENGINE': 'موتور',
  'Qh {q} J': 'Qh {q} J',
  'W {W} J': 'W {W} J',
  'Qc {Qc} J': 'Qc {Qc} J',
  'Qh in (heat)': 'Qh ورودی (گرما)',
  'W out (work) — dashed = Carnot max': 'W خروجی (کار) — نقطه‌چین = بیشینهٔ کارنو',
  'Qc dumped (waste)': 'Qc دورریخته (اتلاف)',
  'Challenge: get W ≥ 500 J from one 1000 J pour — needs Carnot ≥ 50% (Th ≥ 2×Tc)!': 'چالش: از یک بار ریختن 1000 J به W ≥ 500 J برس — حد کارنو ≥ 50% لازم است (Th ≥ 2×Tc)!',
  '★ W ≥ 500 J — challenge complete!': '★ W ≥ 500 J — چالش کامل شد!',

  // ── t5-heat-engine ── challenge results
  'Goal: get W ≥ 500 J from ONE 1000 J pour. Hint: e = min(engine rating, 1 − Tc/Th) must clear 50% — tune Th and Tc, and remember the rated engines stay at 15–37%.':
    'هدف: از «یک» بار ریختن 1000 J به W ≥ 500 J برس. راهنما: e = min(رتبهٔ موتور، 1 − Tc/Th) باید از 50% بگذرد — Th و Tc را تنظیم کن و یادت باشد موتورهای رتبه‌دار در 15–37% می‌مانند.',
  '★ W = {W} J from one 1000 J pour! Efficiency {e}% ≥ 50% needs the Carnot limit ≥ 50% — that means Th ≥ 2×Tc. Real engines (15–37%) can never get there; only the ideal reversible one can.':
    '★ W = {W} J از یک بار ریختن 1000 J! بازده {e}% ≥ 50% یعنی حد کارنو ≥ 50% — یعنی Th ≥ 2×Tc. موتورهای واقعی (15–37%) هرگز به آنجا نمی‌رسند؛ تنها موتور ایده‌آل بازگشت‌پذیر می‌رسد.',
  "{W} J — short of the 500 J goal. You need e ≥ 50%, so the Carnot limit 1 − Tc/Th must reach 50%: make Th ≥ 2×Tc (e.g. 600 K over 300 K) and pick 'Ideal Carnot' — a 1000 J pour then splits 500 J work / 500 J waste.":
    '{W} J — کمتر از هدف 500 J. به e ≥ 50% نیاز داری، پس حد کارنو 1 − Tc/Th باید به 50% برسد: Th ≥ 2×Tc کن (مثلاً 600 K روی 300 K) و «کارنوی ایده‌آل» را انتخاب کن — آن‌وقت 1000 J به 500 J کار / 500 J اتلاف تقسیم می‌شود.',
  'Poured 1000 J: W = {W} J out, Qc = {Qc} J dumped. e = {e}% against a Carnot ceiling of {c}%.':
    '1000 J ریخته شد: W = {W} J بیرون آمد و Qc = {Qc} J دور ریخته شد. e = {e}% در برابر سقف کارنوی {c}%.',
}
