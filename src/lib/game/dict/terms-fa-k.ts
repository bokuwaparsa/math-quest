// ─── Physics Quest · Persian sim terms · slice k (e5-flux-lab, e6-potential-map, e7-capacitor-lab) ──
// Keys EXACTLY match the user-visible English strings in src/components/sims/k/.
// {placeholders} mark interpolated values; missing keys fall back to English.
export const termsFaK: Record<string, string> = {
  // ── e5-flux-lab ── frame, controls, readouts, legends, buttons
  'Flux Lab': 'آزمایشگاه شار',
  'A point charge breathes field lines through a tilting flat surface: Φ = E·A·cos θ. Any CLOSED surface around the charge carries Φ = q/ε₀ — no matter its shape or size.':
    'بار نقطه‌ای خطوط میدان را از سطح تختِ در حال کج‌شدن عبور می‌دهد: Φ = E·A·cos θ. هر سطح بستهٔ دور بار، فارغ از شکل و اندازه‌اش، شار Φ = q/ε₀ را با خود دارد.',
  'A point charge with radial field arrows, a dashed closed-surface loop showing constant flux q over epsilon-zero, and a flat rectangular surface whose projected width shrinks with the tilt angle':
    'بار نقطه‌ای با فلش‌های شعاعی میدان، حلقهٔ نقطه‌چینِ سطح بسته که شار ثابت q بر ε₀ را نشان می‌دهد، و سطح مستطیلی تخت که پهنای رؤیت‌شده‌اش با زاویهٔ کجی کوچک می‌شود',
  'Charge q': 'بار q',
  'Surface area A': 'مساحت سطح A',
  'Tilt angle θ': 'زاویه کجی θ',
  'E at surface': 'E روی سطح',
  'Surface flux Φ': 'شار سطح Φ',
  'Closed-surface Φ': 'شار سطح بسته Φ',
  'Angle θ': 'زاویه θ',
  'q > 0 · arrows out': 'q > 0 · فلش‌ها به بیرون',
  'q < 0 · arrows in': 'q < 0 · فلش‌ها به درون',
  'flat surface (tilts with θ)': 'سطح تخت (با θ کج می‌شود)',
  'closed surface · Φ = q/ε₀': 'سطح بسته · Φ = q/ε₀',
  'Challenge: zero the flux': 'چالش: صفر کردن شار',
  'Reset': 'بازنشانی',

  // ── e5-flux-lab ── result templates + canvas banners + canvas labels
  'Φ is zero — but for a sneaky reason: the charge itself is 0. Nudge q off zero, then tilt the surface edge-on to the field!':
    'Φ صفر است — اما به دلیلی حیله‌گرانه: خودِ بار 0 است. q را از صفر جدا کن، بعد سطح را لبه‌به‌لبه رو به میدان بچرخان!',
  'Φ = E·A·cos θ and cos 90° = 0 — edge-on to the field, no field lines pierce the surface! (Any closed surface around q would still carry Φ = q/ε₀.)':
    'Φ = E·A·cos θ و cos 90° = 0 — وقتی سطح لبه‌به‌لبه رو به میدان است، هیچ خط میدانی از سطح نمی‌گذرد! (با این حال هر سطح بستهٔ دور q همچنان شار Φ = q/ε₀ را نشان می‌دهد.)',
  'Φ = {f} N·m²/C (|cos θ| = {c}). Tilt closer to 90° so the field skims along the surface.':
    'Φ = {f} N·m²/C (|cos θ| = {c}). زاویه را به 90° نزدیک‌تر کن تا میدان در امتداد سطح سُر بخورد.',
  'closed surface: Φ = q/ε₀ = {f} N·m²/C': 'سطح بسته: Φ = q/ε₀ = {f} N·m²/C',
  'Challenge: tilt the surface until |Φ| < 1% of its maximum — find the zero-flux angle!':
    'چالش: سطح را بچرخان تا |Φ| به کمتر از 1% بیشینه برسد — زاویهٔ شار صفر را پیدا کن!',
  '★ Challenge complete!': '★ چالش کامل شد!',
  'Not zero yet — keep tilting toward 90°!': 'هنوز صفر نشده — به کج‌کردن به سمت 90° ادامه بده!',

  // ── e6-potential-map ── frame, controls, readouts, legends, buttons
  'Potential Map': 'نقشه پتانسیل',
  'Two charges paint an energy landscape: amber bands are positive potential, violet bands negative. Slide the test charge and add V = kq₁/r₁ + kq₂/r₂ as plain numbers.':
    'دو بار یک چشم‌انداز انرژی نقاشی می‌کنند: نوارهای کهربایی پتانسیل مثبت و نوارهای بنفش پتانسیل منفی‌اند. بار آزمون را بلغزان و V = kq₁/r₁ + kq₂/r₂ را مثل عدد معمولی جمع بزن.',
  'Equipotential map of two charges with amber bands for positive and violet bands for negative potential, a movable test charge on the axis, and an arrow showing the electric field direction':
    'نقشهٔ هم‌پتانسیل دو بار با نوارهای کهربایی برای پتانسیل مثبت و نوارهای بنفش برای پتانسیل منفی، بار آزمونِ جابه‌جاشدنی روی محور، و فلشی که جهت میدان الکتریکی را نشان می‌دهد',
  'Charge q₁': 'بار q₁',
  'Charge q₂': 'بار q₂',
  'Test charge at x': 'بار آزمون در x',
  'Test charge qₜ': 'بار آزمون qₜ',
  'Position x': 'موقعیت x',
  'V at x': 'V در x',
  'E at x': 'E در x',
  'Work A→B': 'کار A→B',
  'V > 0 (near + charges)': 'V > 0 (نزدیک بارهای +)',
  'V < 0 (near − charges)': 'V < 0 (نزدیک بارهای −)',
  'test charge qₜ · E arrow': 'بار آزمون qₜ · فلش E',
  'Mark A': 'علامت A',
  'Mark B': 'علامت B',
  'Challenge: find V = 0': 'چالش: پیدا کردن V = 0',

  // ── e6-potential-map ── result templates + canvas banners
  'V(x) = kq₁/r₁ + kq₂/r₂ = {v} V at x = {x} m — the +4 nC hill exactly cancels the −1 nC valley! Equipotential zero: the bands swap colour right here.':
    'V(x) = kq₁/r₁ + kq₂/r₂ = {v} V در x = {x} m — تپهٔ +4 nC دقیقاً درهٔ −1 nC را خنثی می‌کند! هم‌پتانسیلِ صفر: نوارها همین‌جا رنگ عوض می‌کنند.',
  'V = {v} V at x = {x} m. Keep hunting between the charges — the zero sits closer to the smaller charge.':
    'V = {v} V در x = {x} m. میان بارها به جست‌وجو ادامه بده — صفر به بار کوچک‌تر نزدیک‌تر است.',
  'Challenge: with q₁ = +4 nC, q₂ = −1 nC — slide the test charge until V = 0 (|V| < 0.5 V)!':
    'چالش: با q₁ = +4 nC و q₂ = −1 nC — بار آزمون را بلغزان تا V = 0 شود (|V| < 0.5 V)!',
  'Not zero yet — watch the bands swap colour!': 'هنوز صفر نشده — ببین نوارها چطور رنگ عوض می‌کنند!',

  // ── e7-capacitor-lab ── frame, controls, readouts, legends, buttons
  'Capacitor Lab': 'آزمایشگاه خازن',
  'Two plates, one hungry battery: charge piles up until Q = CV. Widen the plates, squeeze the gap, insert a dielectric — then watch the energy U = ½CV² climb.':
    'دو صفحه و یک باتری حریص: بار تا Q = CV روی هم تلنبار می‌شود. صفحات را پهن‌تر کن، فاصله را تنگ‌تر کن، عایق جا بگذار — بعد ببین انرژی U = ½CV² بالا می‌رود.',
  'Parallel-plate capacitor with plus signs on the top plate, minus signs on the bottom plate, a tinted dielectric slab between them, field arrows, and a battery showing the applied voltage':
    'خازن صفحه‌موازی با علامت‌های مثبت روی صفحهٔ بالا، علامت‌های منفی روی صفحهٔ پایین، ورقهٔ عایقِ رنگی میان آن‌ها، فلش‌های میدان، و باتری‌ای که ولتاژ اعمال‌شده را نشان می‌دهد',
  'Plate area A': 'مساحت صفحه A',
  'Gap d': 'فاصلهٔ صفحات d',
  'Dielectric': 'عایق (دی‌الکتریک)',
  'Voltage V': 'ولتاژ V',
  'Capacitance C': 'ظرفیت خازنی C',
  'Charge Q': 'بار Q',
  'Energy U': 'انرژی U',
  'Field E': 'میدان E',
  '+ plate': 'صفحهٔ +',
  '− plate': 'صفحهٔ −',
  'dielectric slab': 'ورقهٔ عایق',
  'field E = V/d': 'میدان E = V/d',
  'Vacuum · κ = 1': 'خلأ · κ = 1',
  'Paper · κ = 3': 'کاغذ · κ = 3',
  'Glass · κ = 7': 'شیشه · κ = 7',
  'Water · κ = 80': 'آب · κ = 80',
  'Challenge: bank 200 nJ at 20 V': 'چالش: اندوختن 200 nJ در 20 V',

  // ── e7-capacitor-lab ── result templates + canvas banners + canvas labels
  'U = ½CV² = ½ × {c} pF × (20 V)² = {u} nJ — past the 200 nJ target! Big area A, tiny gap d and a high-κ dielectric all boost C = κε₀A/d.':
    'U = ½CV² = ½ × {c} pF × (20 V)² = {u} nJ — از هدفِ 200 nJ گذشتی! مساحت بزرگ A، فاصلهٔ کوچک d و عایق با κ بزرگ‌تر همه C = κε₀A/d را بالا می‌برند.',
  'U = {u} nJ at 20 V — not yet. You need C ≥ 1000 pF: widen the plates, squeeze the gap, or slide in a juicier dielectric.':
    'U = {u} nJ در 20 V — هنوز نه. به C ≥ 1000 pF نیاز داری: صفحات را پهن‌تر کن، فاصله را تنگ‌تر کن یا عایق پرقدرت‌تری جا بگذار.',
  'vacuum · κ = 1': 'خلأ · κ = 1',
  'paper · κ = 3': 'کاغذ · κ = 3',
  'glass · κ = 7': 'شیشه · κ = 7',
  'water · κ = 80': 'آب · κ = 80',
  'Challenge: locked at V = 20 — tune A, d and the dielectric to bank at least 200 nJ!':
    'چالش: V روی 20 قفل است — A و d و عایق را طوری تنظیم کن که دست‌کم 200 nJ اندوخته شود!',
  'Not enough energy — crank up C!': 'انرژی کافی نیست — C را بکش بالا!',
}
