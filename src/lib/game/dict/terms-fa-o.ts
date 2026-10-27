// ─── Physics Quest · Persian sim terms · slice o (p8-nucleus-lab, p9-chain-reaction, p10-quark-builder) ──
// Keys EXACTLY match the user-visible English strings in src/components/sims/o/.
// {placeholders} mark interpolated values; missing keys fall back to English.
export const termsFaO: Record<string, string> = {
  // ── p8-nucleus-lab ── frame, controls, readouts, buttons
  'Nucleus Lab': 'آزمایشگاه هسته',
  'Dial in protons Z and neutrons N, see if the nucleus sits in the valley of stability, then fire α or β⁻ decays to fix it.':
    'پروتون‌های Z و نوترون‌های N را تنظیم کن، ببین هسته در درهٔ پایداری جای می‌گیرد یا نه، بعد واپاشی α یا β⁻ شلیک کن تا درستش کنی.',
  'A ball of amber protons and teal neutrons with a valley-of-stability chart showing whether the chosen isotope is stable':
    'گویه‌ای از پروتون‌های کهربایی و نوترون‌های فیروزه‌ای با نمودار درهٔ پایداری که نشان می‌دهد ایزوتوپ انتخابی پایدار است یا نه',
  'Protons Z': 'پروتون‌ها Z',
  'Neutrons N': 'نوترون‌ها N',
  'Fire α': 'شلیک α',
  'Fire β⁻': 'شلیک β⁻',
  'Challenge: tame F-20': 'چالش: رام کردن F-20',
  'Nucleus': 'هسته',
  'Mass number A': 'عدد جرمی A',
  'Verdict': 'حکم',
  'Suggested fix': 'راه‌حل پیشنهادی',
  'Decays used': 'واپاشی‌های مصرف‌شده',

  // ── p8-nucleus-lab ── result messages + canvas banners + canvas labels
  '★ {iso} (Z={z}, N={n}) is stable and A stayed 20 — one β⁻ (neutron → proton) fixed the neutron-rich nucleus!':
    '★ {iso} (Z={z}, N={n}) پایدار است و A روی 20 ماند — یک β⁻ (نوترون → پروتون) هستهٔ پرنوترون را درست کرد!',
  '{iso} may be stable, but α changed A ({a} ≠ 20) — α is the wrong tool here. Reset the challenge to retry!':
    '{iso} شاید پایدار باشد، اما α مقدار A را عوض کرد ({a} ≠ 20) — α این‌جا ابزار درستی نیست. چالش را بازنشانی کن و دوباره تلاش کن!',
  'Two decays used and still unstable. The winning move is a single β⁻ (n → p). Reset to retry!':
    'دو واپاشی مصرف شد و هنوز ناپایدار است. حرکت برنده یک β⁻ تکی است (n → p). بازنشانی کن و دوباره تلاش کن!',
  '{iso} (Z={z}, N={n}). One decay left — and A must stay 20.':
    '{iso} (Z={z}, N={n}). یک واپاشی باقی مانده — و A باید 20 بماند.',
  'Too light for α decay — α particles (He-4) only escape from heavy nuclei.':
    'برای واپاشی α زیادی سبک است — ذره‌های α (He-4) فقط از هسته‌های سنگین می‌گریزند.',
  'No neutrons left to convert — β⁻ decay needs a neutron (n → p).':
    'نوترونی برای تبدیل نمانده — واپاشی β⁻ به یک نوترون نیاز دارد (n → p).',
  'That leaves the lab bench (Z > 30 not modelled here).': 'از میز آزمایشگاه بیرون می‌زند (Z > 30 در اینجا مدل نشده است).',
  'F-20 (Z=9, N=11) is neutron-rich and unstable. Make it stable with at most 2 decays — and keep A = 20. (α changes A; β⁻ does not!)':
    'F-20 (Z=9, N=11) پرنوترون و ناپایدار است. با حداکثر 2 واپاشی پایدارش کن — و A را 20 نگه دار. (α مقدار A را عوض می‌کند؛ β⁻ نه!)',
  'STABLE ✓': 'پایدار ✓',
  'UNSTABLE ✗': 'ناپایدار ✗',
  'proton': 'پروتون',
  'neutron': 'نوترون',
  'Be-8 cannot hold: it instantly splits into two α particles!': 'Be-8 دوام نمی‌آورد: در همان لحظه به دو ذرهٔ α می‌شکافد!',
  'Too many neutrons → β⁻ decay (n → p) suggested': 'نوترون زیاد است → واپاشی β⁻ (n → p) پیشنهاد می‌شود',
  'Too few neutrons → β⁺ / electron capture (p → n) suggested': 'نوترون کم است → β⁺ / گیراندازی الکترون (p → n) پیشنهاد می‌شود',
  'Inside the valley of stability — nothing to fix': 'درون درهٔ پایداری — چیزی برای درست کردن نیست',
  'valley of stability': 'درهٔ پایداری',
  'Challenge: turn F-20 stable in ≤ 2 decays, keeping A = 20': 'چالش: F-20 را با ≤ 2 واپاشی پایدار کن، با حفظ A = 20',
  'decays used: {n}': 'واپاشی‌های مصرف‌شده: {n}',
  '★ Challenge complete — Ne-20 stable!': '★ چالش کامل شد — Ne-20 پایدار شد!',
  'Out of decays — the nucleus is still not right. Retry!': 'واپاشی‌ها تمام شد — هسته هنوز درست نیست. دوباره تلاش کن!',

  // ── p9-chain-reaction ── frame, controls, readouts, buttons
  'Chain Reaction Lab': 'آزمایشگاه واکنش زنجیره‌ای',
  'Split one U-235 nucleus and watch neutrons cascade through the lattice. Control rods (boron) absorb neutrons — tune them for steady power.':
    'یک هستهٔ U-235 را بشکاف و ببین نوترون‌ها چطور در شبکه آبشاری می‌شوند. میله‌های کنترل (بور) نوترون‌ها را می‌گیرند — آن‌ها را برای توان پایدار تنظیم کن.',
  'A ten by seven lattice of uranium-235 nuclei; firing one starts a fission cascade of teal neutrons that control rods can absorb':
    'شبکه‌ای 10 در 7 از هسته‌های اورانیوم-235؛ شلیک یکی، آبشار شکافت از نوترون‌های فیروزه‌ای را آغاز می‌کند که میله‌های کنترل می‌توانند بگیرند',
  'Control rods (boron)': 'میله‌های کنترل (بور)',
  'Rods in core': 'میله‌ها در قلب',
  'Fire neutron': 'شلیک نوترون',
  'Challenge: steady power': 'چالش: توان پایدار',
  'Total fissions': 'شکافت‌های کل',
  'Energy released': 'انرژی آزادشده',
  'Neutrons absorbed': 'نوترون‌های گرفته‌شده',
  'Neutrons escaped': 'نوترون‌های گریخته',
  'Chain': 'زنجیره',

  // ── p9-chain-reaction ── result messages + canvas banners + canvas labels
  '★ {n} fissions (≈ {mev} MeV) — steady power! The rods kept about one neutron per fission on duty.':
    '★ {n} شکافت (≈ {mev} MeV) — توان پایدار! میله‌ها حدود یک نوترون به ازای هر شکافت را سر کار نگه داشتند.',
  '{n} fissions — the chain ran away (supercritical). Each fission freed more than one useful neutron: pull in more rod and retry.':
    '{n} شکافت — زنجیره از کنترل خارج شد (فوق‌بحرانی). هر شکافت بیش از یک نوترون مفید آزاد کرد: میلهٔ بیشتری داخل بکش و دوباره تلاش کن.',
  'Only {n} fissions — the chain died out (subcritical): too many neutrons absorbed or escaped. Try fewer rods and retry.':
    'تنها {n} شکافت — زنجیره مرد (زیربحرانی): نوترون‌های زیادی گرفته شدند یا گریختند. میلهٔ کمتری امتحان کن و دوباره تلاش کن.',
  'Keep steady power: land 12–20 total fissions across 3 generations. Tune the rods, then Fire — under 12 the chain dies, over 20 it runs away.':
    'توان را پایدار نگه دار: در مجموع 12 تا 20 شکافت در 3 نسل به هدف بخورد. میله‌ها را تنظیم کن، بعد شلیک کن — زیر 12 زنجیره می‌میرد، بالای 20 از کنترل می‌خرد بیرون.',
  'U-235 lattice · click a nucleus or press Fire': 'شبکهٔ U-235 · روی یک هسته کلیک کن یا «شلیک نوترون» را بزن',
  'gen {g} · g0:{g0} g1:{g1} g2:{g2} g3:{g3}': 'نسل {g} · g0:{g0} g1:{g1} g2:{g2} g3:{g3}',
  'fissions / generation': 'شکافت / نسل',
  'absorbed {n}': 'گرفته‌شده {n}',
  'escaped  {n}': 'گریخته  {n}',
  'absorbed {a} · escaped {e} · {mev} MeV': 'گرفته‌شده {a} · گریخته {e} · {mev} MeV',
  'Challenge: steady power — 12 to 20 total fissions after 3 generations': 'چالش: توان پایدار — 12 تا 20 شکافت کل پس از 3 نسل',
  '★ Steady power achieved!': '★ توان پایدار به دست آمد!',
  'Not steady — read the message below and retry!': 'پایدار نیست — پیام پایین را بخوان و دوباره تلاش کن!',
  'chain ended · {n} fissions · {mev} MeV': 'زنجیره پایان یافت · {n} شکافت · {mev} MeV',

  // ── p10-quark-builder ── frame, controls, readouts, buttons
  'Quark Builder': 'سازنده کوارک',
  'Pick quarks from the palette and check the charge ledger: proton uud (+1), neutron udd (0), π⁺ u d̄ (+1) — combos must sum to whole charges.':
    'کوارک‌ها را از جعبه‌ابزار بردار و دفتر بار را چک کن: پروتون uud (+1)، نوترون udd (0)، π⁺ u d̄ (+1) — هر ترکیب مجاز باید به بار درست برسد.',
  'A quark composer: chosen quarks appear inside a dashed outline with a running charge ledger on the right':
    'آهنگساز کوارک: کوارک‌های انتخابی درون خط‌چین با دفتر بارِ در حال به‌روزرسانی در سمت راست ظاهر می‌شوند',
  'Hadron mode': 'حالت هادرون',
  'Baryon · 3 quarks': 'باریون · 3 کوارک',
  'Meson · quark + antiquark': 'مزون · کوارک + پادکوارک',
  'u (+2/3)': 'u (+2/3)',
  'd (−1/3)': 'd (−1/3)',
  'anti-u (−2/3)': 'پاد-u (−2/3)',
  'anti-d (+1/3)': 'پاد-d (+1/3)',
  'Challenge: neutron then π⁺': 'چالش: اول نوترون، بعد π⁺',
  'Total charge': 'بار کل',
  'Detected hadron': 'هادرون شناسایی‌شده',
  'Mass hint': 'راهنمای جرم',
  'Quarks': 'کوارک‌ها',

  // ── p10-quark-builder ── result messages + canvas banners + canvas labels
  '★ Step 1 done — neutron (udd, charge 0) built! Step 2: switch to Meson mode and build π⁺ (u + anti-d).':
    '★ مرحله 1 انجام شد — نوترون (udd، بار 0) ساخته شد! مرحله 2: به حالت مزون برو و π⁺ (u + پاد-d) را بساز.',
  '★ Both built! Proton uud (+1), neutron udd (0), π⁺ u d̄ (+1) — every legal combo sums to a whole charge.':
    '★ هر دو ساخته شد! پروتون uud (+1)، نوترون udd (0)، π⁺ u d̄ (+1) — هر ترکیب مجاز به بار صحیح می‌رسد.',
  'Not the target yet — a neutron needs u + d + d in Baryon mode.': 'هنوز هدف نیست — نوترون در حالت باریون به u + d + d نیاز دارد.',
  'Close! π⁺ needs u + anti-d in Meson mode (switch the mode selector). Progress is kept.':
    'نزدیک بود! π⁺ در حالت مزون به u + پاد-d نیاز دارد (انتخابگر حالت را عوض کن). پیشرفت حفظ می‌شود.',
  'Step 1: build a NEUTRON — Baryon mode, pick u + d + d. Then I will ask for a π⁺.':
    'مرحله 1: یک نوترون بساز — حالت باریون، u + d + d را بردار. بعد از تو π⁺ می‌خواهم.',
  'Baryons are built from 3 quarks — an antiquark does not belong in this line-up.':
    'باریون‌ها از 3 کوارک ساخته می‌شوند — یک پادکوارک جای خود را در این ترکیب ندارد.',
  'A meson is one quark + one antiquark (e.g. u + d̄).': 'مزون یک کوارک + یک پادکوارک است (مثلاً u + d̄).',
  'Baryon mode · pick 3 quarks': 'حالت باریون · 3 کوارک بردار',
  'Meson mode · pick 1 quark + 1 antiquark': 'حالت مزون · 1 کوارک + 1 پادکوارک بردار',
  'colour-neutral line-ups only!': 'فقط ترکیب‌های خنثای رنگی!',
  'CHARGE LEDGER': 'دفتر بار',
  'TOTAL': 'جمع',
  '(anti)': '(پاد)',
  '{n} / {t} quarks': '{n} / {t} کوارک',
  'Pick {n} more quark from the palette…': '{n} کوارک دیگر از جعبه‌ابزار بردار…',
  'Pick {n} more quarks from the palette…': '{n} کوارک دیگر از جعبه‌ابزار بردار…',
  'mass ≈ {m} MeV/c²': 'جرم ≈ {m} MeV/c²',
  '{name} · charge {q}': '{name} · بار {q}',
  'Proton (p⁺)': 'پروتون (p⁺)',
  'Neutron (n⁰)': 'نوترون (n⁰)',
  'Pion π⁺': 'پیون π⁺',
  'Pion π⁻': 'پیون π⁻',
  'Pion π⁰': 'پیون π⁰',
  'Δ⁺⁺ (Delta-plus-plus)': 'Δ⁺⁺ (دلتا-پلاس-پلاس)',
  'Δ⁻ (Delta-minus)': 'Δ⁻ (دلتا-ماینوس)',
  'an excited resonance — real, but it decays in ~10⁻²⁴ s': 'یک تشدید برانگیخته — واقعی است، اما در ~10⁻²⁴ s واپاشی می‌شود',
  'uū and dd̄ both work — π⁰ is a quantum mix': 'uū و dd̄ هر دو درست‌اند — π⁰ یک ترکیب کوانتومی است',
  '★ Neutron + π⁺ both built — quark chemist!': '★ نوترون و π⁺ هر دو ساخته شدند — شیمی‌دان کوارک!',
  'Step 1/2 — build a NEUTRON (Baryon: u + d + d)': 'مرحله 1/2 — یک نوترون بساز (باریون: u + d + d)',
  'Step 2/2 — build π⁺ (Meson: u + d̄) · switch mode!': 'مرحله 2/2 — π⁺ بساز (مزون: u + d̄) · حالت را عوض کن!',

  // shared
  'Reset': 'بازنشانی',
}
