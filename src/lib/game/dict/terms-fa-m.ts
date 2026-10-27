// ─── Physics Quest · Persian sim terms · slice m (o5-em-spectrum, o6-double-slit, o7-single-slit) ──
// Keys EXACTLY match the user-visible English strings in src/components/sims/m/.
// {placeholders} mark interpolated values; missing keys fall back to English.
export const termsFaM: Record<string, string> = {
  // ── o5-em-spectrum ── frame, controls, readouts, buttons
  'EM Spectrum Explorer': 'کاوشگر طیف الکترومغناطیسی',
  'Slide across 15 decades of wavelength: each band lights up with its use, its danger, its frequency f = c/λ and its photon energy E = hf.':
    'در 15 دههٔ طول موج بلغزان: هر باند با کاربردش، خطرش، بسامدش f = c/λ و انرژی فوتونش E = hf روشن می‌شود.',
  'A logarithmic electromagnetic-spectrum strip from gamma rays to radio waves with a movable wavelength marker, band information and an optional oscillating E/B wave':
    'نوار لگاریتمی طیف الکترومغناطیسی از پرتو گاما تا موج رادیویی، با نشانگر متحرک طول موج، اطلاعات باند و موج E/B نوسانی اختیاری',
  'Wavelength': 'طول موج',
  'Show wave': 'نمایش موج',
  'Band': 'باند',
  'Frequency f = c/λ': 'بسامد f = c/λ',
  'Photon E = hf': 'انرژی فوتون E = hf',
  'Challenge: find visible light': 'چالش: یافتن نور مرئی',

  // ── o5-em-spectrum ── result templates
  'Aim at the rainbow band on the strip — it sits between UV (400 nm) and IR (700 nm).':
    'روی باند رنگین‌کمانی روی نوار نشانه بگیر — میان فرابنفش (400 nm) و فروسرخ (700 nm) قرار دارد.',
  'λ = {v} {u} — inside 400–700 nm: visible light! Your eyes are tuned to a razor-thin slice of the spectrum.':
    'λ = {v} {u} — درون 400–700 nm: نور مرئی! چشمانت به برشی تیزبر از طیف کوک شده‌اند.',

  // ── o5-em-spectrum ── band info panel (canvas)
  'Gamma rays': 'پرتوهای گاما',
  'X-rays': 'پرتوهای ایکس',
  'Ultraviolet': 'فرابنفش',
  'Visible light': 'نور مرئی',
  'Infrared': 'فروسرخ',
  'Microwaves': 'ریزموج‌ها',
  'Radio waves': 'موج‌های رادیویی',
  'gamma': 'گاما',
  'X-ray': 'پرتو ایکس',
  'UV': 'فرابنفش',
  'visible': 'مرئی',
  'IR': 'فروسرخ',
  'microwave': 'ریزموج',
  'radio': 'رادیو',
  'Use: {use}': 'کاربرد: {use}',
  'Danger: {danger}': 'خطر: {danger}',
  'Cancer therapy · sterilising': 'درمان سرطان · عقیم‌سازی',
  'Medical imaging · security': 'تصویربرداری پزشکی · امنیت',
  'Sterilising · tanning': 'عقیم‌سازی · برنزه‌سازی',
  'Sight · lasers · fibre optics': 'بینایی · لیزرها · فیبر نوری',
  'Remotes · thermal cameras': 'کنترل از راه دور · دوربین‌های حرارتی',
  'Ovens · radar · Wi-Fi': 'فر · رادار · وای‌فای',
  'Broadcasting · MRI · astronomy': 'پخش رادیویی و تلویزیونی · ام‌آرآی · نجوم',
  'Ionising — deadly': 'یونیزه‌کننده — کشنده',
  'Ionising — cancer risk': 'یونیزه‌کننده — خطر سرطان',
  'Sunburn · skin cancer': 'آفتاب‌سوختگی · سرطان پوست',
  'Bright beams hurt eyes': 'پرتوهای پرفروغ به چشم آسیب می‌زنند',
  'Strong beams burn skin': 'پرتوهای قوی پوست را می‌سوزانند',
  'Cooks tissue at high power': 'در توان بالا بافت را می‌پزد',
  'Very strong fields heat': 'میدان‌های خیلی قوی گرم می‌کنند',

  // ── o5-em-spectrum ── canvas banners + canvas labels
  '▬ atmospheric windows (radio + visible)': '▬ پنجره‌های جوّی (رادیو + مرئی)',
  'visible 400–700 nm': 'مرئی 400–700 nm',
  "Toggle 'Show wave' to see the oscillating": '«نمایش موج» را روشن کن تا نوسان',
  'electric (E) and magnetic (B) fields': 'میدان الکتریکی (E) و مغناطیسی (B) را ببینی',
  'schematic — not to scale': 'شماتیک — بدون رعایت مقیاس',
  'schematic — not to scale · static (reduced motion)': 'شماتیک — بدون رعایت مقیاس · ایستا (حرکت آهسته)',
  'Challenge: land the marker inside the rainbow — 400–700 nm!': 'چالش: نشانگر را درون رنگین‌کمان فرود بیاور — 400–700 nm!',
  '★ Challenge complete — you found visible light!': '★ چالش کامل شد — نور مرئی را پیدا کردی!',

  // ── o6-double-slit ── frame, controls, readouts, buttons
  'Double-Slit Interference': 'تداخل شکاف دوگانه',
  'Two coherent slits ripple outward and overlap on the screen: bright where the paths differ by whole wavelengths, dark in between. Δy = λL/d.':
    'دو شکاف همدوس موج‌های دایره‌ای می‌فرستند و روی پرده هم‌پوشانی می‌کنند: جایی که اختلاف مسیر مضرب درستی از طول موج باشد روشن و میان آن‌ها تاریک است. Δy = λL/d.',
  'Two slits emitting circular wavefronts toward a screen showing the cos-squared interference pattern with bright and dark fringes':
    'دو شکاف که جبهه‌موج‌های دایره‌ای به سمت پرده‌ای با الگوی تداخل کسینوس‌مربع می‌فرستند، همراه فرینج‌های روشن و تاریک',
  'Slit separation': 'فاصلهٔ شکاف‌ها',
  'Screen distance': 'فاصلهٔ پرده',
  'Fringe spacing Δy = λL/d': 'فاصلهٔ فرینج Δy = λL/d',
  'Bright fringes on screen': 'فرینج‌های روشن روی پرده',
  'First order at sinθ = λ/d': 'مرتبهٔ اول در sinθ = λ/d',
  'Challenge: Δy = 8.0 mm': 'چالش: Δy = 8.0 mm',

  // ── o6-double-slit ── result templates + canvas banners + canvas labels
  'Δy = λL/d = {dy} mm — within 2% of 8.0 mm! Sharper colours and a wider slit would each shrink it; more distance stretches it.':
    'Δy = λL/d = {dy} mm — در محدودهٔ 2% از 8.0 mm است! رنگ خالص‌تر یا شکاف پهن‌تر، هر یک، آن را کوچک می‌کند؛ فاصلهٔ بیشتر آن را می‌کشد.',
  'Δy = {dy} mm — target is 8.0 ± 0.16 mm. Remember Δy = λL/d: λ and L stretch the fringes, d squeezes them.':
    'Δy = {dy} mm — هدف 8.0 ± 0.16 mm است. یادت باشد Δy = λL/d: λ و L فرینج‌ها را می‌کشند و d فشرده می‌کند.',
  'Challenge: tune λ, d and L until Δy = 8.0 mm (±2%)': 'چالش: λ و d و L را طوری تنظیم کن که Δy = 8.0 mm شود (±2%)',
  '★ Challenge complete — Δy = 8.0 mm!': '★ چالش کامل شد — Δy = 8.0 mm!',
  'screen': 'پرده',

  // ── o7-single-slit ── frame, controls, readouts, buttons
  'Diffraction: Single Slit & Gratings': 'پراش: شکاف واحد و توری‌ها',
  'Squeeze light through a slit and it fans out (minima at a·sinθ = mλ). Swap in a grating and the same angles turn into razor-sharp orders d·sinθ = mλ.':
    'نور را از شکافی تنگ رد کن تا بادبزنی باز می‌شود (کمینه‌ها در a·sinθ = mλ). توری بگذار تا همان زاویه‌ها به مرتبه‌های تیزچاقویی d·sinθ = mλ بدل شوند.',
  'Plane waves hitting a single slit or a diffraction grating, with the resulting sinc or sharp-order intensity pattern drawn on a screen at the right':
    'موج‌های تخت که به شکاف واحد یا توری پراش می‌خورند، با الگوی شدت سینک یا مرتبه‌های تیزِ حاصل روی پردهٔ سمت راست',
  'Slit width': 'پهنای شکاف',
  'Aperture': 'دهانه',
  'Single slit': 'شکاف واحد',
  'Grating 600 lines/mm': 'توری 600 خط/mm',
  'Grating 1200 lines/mm': 'توری 1200 خط/mm',
  'First min / order θ₁': 'نخستین کمینه / مرتبه θ₁',
  'Highest order m': 'بالاترین مرتبه m',
  'Orders on screen': 'مرتبه‌های روی پرده',
  'Central spread 2θ₁': 'گسترهٔ مرکزی 2θ₁',
  'First minimum sinθ = λ/a': 'نخستین کمینه sinθ = λ/a',
  'Challenge: split 450 & 650 nm': 'چالش: جدا کردن 450 و 650 nm',

  // ── o7-single-slit ── result templates + canvas banners + canvas labels
  'θ₄₅₀ = {t450}°, θ₆₅₀ = {t650}° → {sep}° apart — the first orders are clearly separated. Finer gratings spread colours further!':
    'θ₄₅₀ = {t450}°، θ₆₅₀ = {t650}° → {sep}° فاصله — مرتبه‌های اول به‌خوبی جدا شده‌اند. توری‌های ریزتر رنگ‌ها را بیشتر پخش می‌کنند!',
  'θ₄₅₀ = {t450}°, θ₆₅₀ = {t650}° → only {sep}° apart. You need ≥ 8°: a grating with more lines per mm (smaller d) bends the orders further out.':
    'θ₄₅₀ = {t450}°، θ₆₅₀ = {t650}° → فقط {sep}° فاصله. ≥ 8° لازم داری: توری با خط‌های بیشتر در هر میلی‌متر (d کوچک‌تر) مرتبه‌ها را بیرون‌تر می‌برد.',
  'Challenge: separate the first orders of 450 & 650 nm by ≥ 8°': 'چالش: مرتبه‌های اول 450 و 650 nm را ≥ 8° جدا کن',
  '★ Challenge complete — orders separated by ≥ 8°!': '★ چالش کامل شد — مرتبه‌ها ≥ 8° جدا شدند!',
  '{n} lines/mm · d = {d} μm': '{n} خط/mm · d = {d} μm',

  // shared
  'Reset': 'بازنشانی',
}
