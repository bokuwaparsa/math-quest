// ─── Physics Quest · Persian sim terms · slice j (w5-standing-waves, w6-beats-lab) ──
// Keys EXACTLY match the user-visible English strings in src/components/sims/j/.
// {placeholders} mark interpolated values; missing keys fall back to English.
export const termsFaJ: Record<string, string> = {
  // ── w5-standing-waves ── frame, controls, readouts
  'Standing Waves Lab': 'آزمایشگاه موج ایستاده',
  'A string fixed at both ends vibrates in whole loops. Nodes stand still, antinodes swing hardest. Motion is slow motion — every readout is real.':
    'نخی که دو سرش بسته است در حلقه‌های کامل ارتعاش می‌کند. گره‌ها بی‌حرکت می‌مانند و شکم‌ها بیشترین تاب را می‌خورند. حرکت آهسته است — هر نمایشگری مقدار واقعی را نشان می‌دهد.',
  'Standing wave lab: a string fixed at both ends vibrating in n loops, with a dashed amplitude envelope, rose node dots on the axis and amber antinode dots at the envelope tips':
    'آزمایشگاه موج ایستاده: نخی با دو سر بسته که در n حلقه ارتعاش می‌کند، همراه پوشش دامنهٔ نقطه‌چین، نقطه‌های گرهٔ سرخ روی محور و نقطه‌های کهربایی شکم در نوک پوشش',
  'String length L': 'طول نخ L',
  'Tension F': 'کشش F',
  'String material': 'جنس نخ',
  'Nylon · 0.001 kg/m': 'نایلون · 0.001 kg/m',
  'Steel · 0.004 kg/m': 'فولاد · 0.004 kg/m',
  'Thick · 0.01 kg/m': 'ضخیم · 0.01 kg/m',
  'Harmonic n': 'هارمونیک n',
  'n = 1 (fundamental)': 'n = 1 (بنیادی)',
  'n = 2': 'n = 2',
  'n = 3': 'n = 3',
  'n = 4': 'n = 4',
  'n = 5': 'n = 5',
  'n = 6': 'n = 6',
  'Reset': 'بازنشانی',
  'Challenge: f₃ = 300 Hz': 'چالش: f₃ = 300 Hz',
  'Wave speed v = √(F/μ)': 'تندی موج v = √(F/μ)',
  'Harmonic frequency fₙ': 'بسامد هارمونیک fₙ',
  'Wavelength λₙ = 2L/n': 'طول موج λₙ = 2L/n',
  'Challenge target': 'هدف چالش',

  // ── w5-standing-waves ── result templates + canvas banners + canvas labels
  'Goal: I set L = 1 m, steel string, n = 3 for you. Tune the tension F until the 3rd harmonic f₃ reads 300 Hz (±2 Hz).':
    'هدف: من برایت L = 1 m، نخ فولادی و n = 3 را تنظیم کرده‌ام. کشش F را طوری تنظیم کن که سومین هارمونیک f₃ روی 300 Hz (±2 Hz) بخواند.',
  'f₃ = 3·v/(2L) = {f} Hz at F = {F} N (v = √(F/μ) = {v} m/s) — the 3rd harmonic of the steel string is spot on 300 Hz!':
    'f₃ = 3·v/(2L) = {f} Hz در F = {F} N (v = √(F/μ) = {v} m/s) — سومین هارمونیک نخ فولادی دقیقاً روی 300 Hz است!',
  'Challenge: tune F until f₃ = 300 Hz (±2 Hz)': 'چالش: F را طوری تنظیم کن که f₃ = 300 Hz (±2 Hz) شود',
  '★ f₃ = 300 Hz — challenge complete!': '★ f₃ = 300 Hz — چالش کامل شد!',
  'y = 2A·sin(nπx/L)·cos(2πfₙ·t) · slow motion': 'y = 2A·sin(nπx/L)·cos(2πfₙ·t) · حرکت آهسته',
  'n = {n} loops': 'n = {n} حلقه',
  'fixed end': 'سر بسته',
  'node': 'گره',
  'antinode': 'شکم',
  '● node (still)   ● antinode (biggest swing)   ‑ ‑ envelope ±2A·sin(nπx/L)':
    '● گره (بی‌حرکت)   ● شکم (بیشترین تاب)   ‑ ‑ پوشش ±2A·sin(nπx/L)',

  // ── w6-beats-lab ── frame, controls, readouts, legends
  'Beats & Intensity Lab': 'آزمایشگاه ضربه و شدت',
  'Two tuning forks with close frequencies wobble the loudness at f_beat = |f₁ − f₂|. Below: a point source spreads power over a growing sphere (I = P/(4πr²)).':
    'دو دیاپازون با بسامدهای نزدیک، بلندی صدا را با f_beat = |f₁ − f₂| تپش می‌دهند. پایین: چشمهٔ نقطه‌ای، توان را روی کره‌ای در حال بزرگ شدن می‌پراکند (I = P/(4πr²)).',
  'Beats lab: a scrolling graph of two close sine waves added together, the loudness envelope pulsing at the beat frequency, and a glowing point source whose halo shrinks with distance':
    'آزمایشگاه ضربه: نمودارِ لغزانِ جمع دو موج سینوسی نزدیک به هم، پوشش بلندی که با بسامد ضربه تپش می‌کند، و چشمهٔ نقطه‌ای درخشانی که هاله‌اش با فاصله کوچک می‌شود',
  'sum of the two waves': 'جمع دو موج',
  'loudness envelope (beats)': 'پوشش بلندی (ضربه‌ها)',
  'Fork 1 f₁': 'دیاپازون 1 f₁',
  'Fork 2 f₂': 'دیاپازون 2 f₂',
  'Play tone': 'پخش نت',
  'Source power P': 'توان چشمه P',
  'Distance r': 'فاصله r',
  'Challenge: 4 beats/s': 'چالش: 4 ضربه بر ثانیه',
  'Beat frequency |f₁ − f₂|': 'بسامد ضربه |f₁ − f₂|',
  'Intensity I = P/(4πr²)': 'شدت I = P/(4πr²)',
  'Sound level 10·log₁₀(I/10⁻¹²)': 'تراز صدا 10·log₁₀(I/10⁻¹²)',

  // ── w6-beats-lab ── result templates + canvas banners + canvas labels
  'Goal: fork 1 is locked at 440 Hz. Tune fork 2 until the beat frequency reads 4 Hz (±0.5) — 436 or 444 will do it.':
    'هدف: دیاپازون 1 روی 440 Hz قفل است. دیاپازون 2 را طوری تنظیم کن که بسامد ضربه 4 Hz (±0.5) را نشان دهد — 436 یا 444 جواب می‌دهد.',
  'f₂ = {f2} Hz against f₁ = 440 Hz → f_beat = |f₂ − f₁| = {fb} Hz — four loud–soft pulses per second. Tuned like a pro!':
    'f₂ = {f2} Hz در برابر f₁ = 440 Hz → f_beat = |f₂ − f₁| = {fb} Hz — چهار تپِ بلند–آرام در هر ثانیه. مثل یک حرفه‌ای کوکش کردی!',
  'Challenge: tune f₂ for 4 beats/s (f₁ = 440 Hz)': 'چالش: f₂ را برای 4 ضربه بر ثانیه تنظیم کن (f₁ = 440 Hz)',
  '★ 4 beats/s — challenge complete!': '★ 4 ضربه بر ثانیه — چالش کامل شد!',
  'sum of the two waves (motion paused)': 'جمع دو موج (حرکت متوقف است)',
  'sum: sin(2πf₁·t) + sin(2πf₂·t) · 0.1 s window': 'جمع: sin(2πf₁·t) + sin(2πf₂·t) · پنجرهٔ 0.1 s',
  'envelope |2cos(2π(f₂−f₁)t/2)| · 1 s window': 'پوشش |2cos(2π(f₂−f₁)t/2)| · پنجرهٔ 1 s',
  'loudness envelope — f_beat = {fb} Hz (motion paused)': 'پوشش بلندی — f_beat = {fb} Hz (حرکت متوقف است)',
  'point source · P = {P} W · r = {r} m': 'چشمهٔ نقطه‌ای · P = {P} W · r = {r} m',
  'glow radius ∝ 1/r · level ≈ {db} dB': 'شعاع درخشش ∝ 1/r · تراز ≈ {db} dB',
}
