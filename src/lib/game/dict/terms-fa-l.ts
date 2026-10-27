// ─── Physics Quest · Persian sim terms · slice l (e8-charge-b-field, e9-induction-coil, e10-rlc-resonance) ──
// Keys EXACTLY match the user-visible English strings in src/components/sims/l/.
// {placeholders} mark interpolated values; missing keys fall back to English.
export const termsFaL: Record<string, string> = {
  // ── e8-charge-b-field ── frame, controls, readouts, legends, buttons
  'Charge in a B Field': 'بار در میدان B',
  'A charge fired across a magnetic field feels F = qv×B, always sideways — so it runs in circles. Tune v, B and the charge to land it on the 0.10 m detector ring.':
    'باری که در عرض میدان مغناطیسی شلیک شود نیروی F = qv×B را حس می‌کند که همیشه جانبی است — پس در دایره می‌چرخد. v و B و بار را طوری تنظیم کن که روی حلقهٔ آشکارساز 0.10 m فرود بیاید.',
  'A charged particle circling in a uniform magnetic field shown as circled dots or crosses, with its predicted orbit circle, an amber detector ring of radius 0.10 metres and a rose force arrow':
    'ذره‌ای باردار که در میدان مغناطیسی یکنواخت — با نماد نقطهٔ محصور یا ضربدر — می‌چرخد، همراه دایرهٔ مدار پیش‌بینی‌شده‌اش، حلقهٔ آشکارساز کهربایی به شعاع 0.10 متر و فلش نیروی سرخ',
  'Charge': 'بار',
  'Proton (+e)': 'پروتون (+e)',
  'Electron (−e)': 'الکترون (−e)',
  'Alpha (+2e)': 'آلفا (+2e)',
  'Speed v': 'تندی v',
  'Field B': 'میدان B',
  'Launch angle': 'زاویه پرتاب',
  'B out of screen': 'B به بیرون از صفحه',
  'Challenge: land at r = 0.10 m': 'چالش: فرود در r = 0.10 m',
  'Force F = qvB': 'نیرو F = qvB',
  'Radius r = mv/qB': 'شعاع r = mv/qB',
  'f cyclotron': 'بسامد سیکلوترون',
  'r vs detector': 'r نسبت به آشکارساز',
  'particle trail': 'رد ذره',
  'predicted orbit (r = mv/qB)': 'مدار پیش‌بینی‌شده (r = mv/qB)',
  'detector ring (0.10 m)': 'حلقهٔ آشکارساز (0.10 m)',
  'magnetic force': 'نیروی مغناطیسی',

  // ── e8-charge-b-field ── result templates + canvas banners + canvas labels
  'Goal: tune v and B so the proton’s orbit radius r = mv/(qB) matches the amber detector ring at 0.10 m ± 2% — the violet orbit circle must sit on the ring. Hint: v/B ≈ 9.58×10⁶, e.g. v = 2.0×10⁶ m/s with B ≈ 0.21 T.':
    'هدف: v و B را طوری تنظیم کن که شعاع مدار پروتون r = mv/(qB) با حلقهٔ آشکارساز کهربایی روی 0.10 m ± 2% بخواند — دایرهٔ مدار بنفش باید روی حلقه بنشیند. راهنما: v/B ≈ 9.58×10⁶، مثلاً v = 2.0×10⁶ m/s با B ≈ 0.21 T.',
  '★ Landed! r = mv/(qB) = {r} — inside 0.10 m ± 2%. You tuned the v/B ratio to 9.58×10⁶ so the Lorentz force bends the proton exactly onto the detector ring. The magnetic force steered, but never sped it up.':
    '★ فرود آمد! r = mv/(qB) = {r} — درون بازهٔ 0.10 m ± 2%. نسبت v/B را روی 9.58×10⁶ تنظیم کردی تا نیروی لورنتس پروتون را دقیقاً روی حلقهٔ آشکارساز بپیچاند. نیروی مغناطیسی هدایتش کرد، اما هرگز تندترش نکرد.',
  'B out of screen ⊙ (toward you)': 'B به بیرون از صفحه ⊙ (رو به تو)',
  'B into screen ⊗ (away from you)': 'B به درون صفحه ⊗ (روی از تو)',
  'detector r = 0.10 m ✓': 'آشکارساز r = 0.10 m ✓',
  'detector r = 0.10 m': 'آشکارساز r = 0.10 m',
  'orbit radius r = {r}': 'شعاع مدار r = {r}',
  'Challenge: match the orbit to the detector ring — r = 0.10 m ± 2% (tune v and B)':
    'چالش: مدار را با حلقهٔ آشکارساز منطبق کن — r = 0.10 m ± 2% (v و B را تنظیم کن)',
  '★ Challenge complete — proton on the detector!': '★ چالش کامل شد — پروتون روی آشکارساز!',
  '(motion paused — the violet circle shows the predicted orbit)': '(حرکت متوقف است — دایرهٔ بنفش مدار پیش‌بینی‌شده را نشان می‌دهد)',

  // ── e9-induction-coil ── frame, controls, readouts, legends, buttons
  'Induction Coil': 'سیم‌پیچ القا',
  'Faraday’s law live: EMF = −N·dΦ/dt. Only a changing flux makes the galvanometer move — sweep the magnet, drag it by hand, or let it oscillate.':
    'قانون فارادی به‌صورت زنده: EMF = −N·dΦ/dt. فقط شارِ در حال تغییر گالوانومتر را تکان می‌دهد — آهن‌ربا را عبور بده، با دست جابه‌جا کن، یا بگذار نوسان کند.',
  'A red and blue bar magnet moving toward a copper coil connected to a galvanometer whose needle swings with the induced EMF, above a graph of field through the coil versus position and a live EMF trace':
    'آهن‌ربای میله‌ای سرخ و آبی که به سمت سیم‌پیچ مسی متصل به گالوانومتر می‌رود و عقربه‌اش با نیروی محرکهٔ القاشده تاب می‌خورد، بالای نمودار میدان در سیم‌پیچ بر حسب موقعیت و رد زندهٔ نیروی محرکه',
  'Turns N': 'تعداد دور N',
  'Coil area A': 'مساحت سیم‌پیچ A',
  'Magnet speed': 'تندی آهن‌ربا',
  'Magnet position': 'موقعیت آهن‌ربا',
  'Auto-oscillate': 'نوسان خودکار',
  'Sweep through coil': 'عبور از میان سیم‌پیچ',
  'Challenge: 3 V peak': 'چالش: اوج 3 V',
  'Flux Φ = B·A': 'شار Φ = B·A',
  'EMF = −N·dΦ/dt': 'نیروی محرکه = −N·dΦ/dt',
  'Peak |EMF|': 'اوج |نیروی محرکه|',
  'B through coil vs position': 'B در سیم‌پیچ بر حسب موقعیت',
  'EMF vs time': 'نیروی محرکه بر حسب زمان',
  '3 V challenge line': 'خط چالش 3 V',

  // ── e9-induction-coil ── result templates + canvas banners + canvas labels
  'Goal: generate a peak EMF of at least 3 V. EMF = N·A·(dB/dx)·v — more turns, a bigger coil area, or a faster magnet all work. Press “Sweep through coil”, or drag the position slider by hand.':
    'هدف: نیروی محرکه‌ای با اوج دست‌کم 3 V بساز. EMF = N·A·(dB/dx)·v — دور بیشتر، مساحت سیم‌پیچ بزرگ‌تر یا آهن‌ربای تندتر، هر سه کار می‌کنند. «عبور از میان سیم‌پیچ» را بزن، یا لغزندهٔ موقعیت را با دست بکش.',
  'Auto-oscillation is paused while reduced motion is on — use “Sweep through coil” or drag the position slider yourself.':
    'وقتی «حرکت آهسته» روشن است نوسان خودکار متوقف می‌شود — از «عبور از میان سیم‌پیچ» استفاده کن یا لغزندهٔ موقعیت را خودت بکش.',
  '★ {v} V peak — past the 3 V goal! EMF = N·A·(dB/dx)·v with N = {n} turns, A = {a} m² and a magnet moving at up to {vmax} m/s: you made the flux change fast enough.':
    '★ اوج {v} V — از هدفِ 3 V گذشتی! EMF = N·A·(dB/dx)·v با N = {n} دور، A = {a} m² و آهن‌ربایی که تا {vmax} m/s حرکت می‌کند: شار را به‌اندازهٔ کافی سریع تغییر دادی.',
  'galvanometer (EMF)': 'گالوانومتر (نیروی محرکه)',
  'coil · N = {n} turns · A = {a} m²': 'سیم‌پیچ · N = {n} دور · A = {a} m²',
  'magnet · x = {x} m · v = {v} m/s': 'آهن‌ربا · x = {x} m · v = {v} m/s',
  'B through coil vs magnet position (peak 0.2 T)': 'B در سیم‌پیچ بر حسب موقعیت آهن‌ربا (اوج 0.2 T)',
  'EMF vs time (V) · time →': 'نیروی محرکه بر حسب زمان (V) · زمان →',
  'Challenge: generate a peak EMF of 3 V or more!': 'چالش: نیروی محرکه‌ای با اوج دست‌کم 3 V بساز!',
  '★ Challenge complete — needle knocked past 3 V!': '★ چالش کامل شد — عقربه از 3 V گذشت!',
  '(auto-oscillation paused · reduced motion)': '(نوسان خودکار متوقف است · حرکت آهسته)',

  // ── e10-rlc-resonance ── frame, controls, readouts, legends, buttons
  'Series RLC Resonance': 'تشدید RLC سری',
  'A 10 V AC source drives R, L and C in series. X_L grows with frequency, X_C shrinks — where they cancel, Z collapses to R and the current peaks at f₀ = 1/(2π√(LC)).':
    'یک منبع AC با 10 ولت R و L و C را در سری به کار می‌اندازد. X_L با بسامد زیاد می‌شود و X_C کم — جایی که همدیگر را خنثی می‌کنند، Z به R فرو می‌ریزد و جریان در f₀ = 1/(2π√(LC)) بیشینه است.',
  'A series RLC circuit with an AC source, resistor, inductor and capacitor, above a resonance curve of current versus log frequency with a teal marker at f0 and an amber marker at the chosen source frequency':
    'مدار RLC سری با منبع AC، مقاومت، القاگر و خازن، بالای منحنی تشدید جریان بر حسب بسامد لگاریتمی با نشانگر فیروزه‌ای روی f0 و نشانگر کهربایی روی بسامد منبع انتخابی',
  'Resistance R': 'مقاومت R',
  'Inductance L': 'خودالقایی L',
  'Capacitance C': 'ظرفیت خازنی C',
  'Source frequency f': 'بسامد منبع f',
  'Challenge: hit f₀ within 1%': 'چالش: رسیدن به f₀ با خطای کمتر از 1%',
  'f₀ = 1/(2π√LC)': 'f₀ = 1/(2π√LC)',
  'X_L = 2πfL': 'X_L = 2πfL',
  'X_C = 1/(2πfC)': 'X_C = 1/(2πfC)',
  'Impedance Z': 'امپدانس Z',
  'I = V/Z': 'I = V/Z',
  'I(f) resonance curve': 'منحنی تشدید I(f)',
  'your source frequency': 'بسامد منبع تو',
  'current in the circuit': 'جریان در مدار',

  // ── e10-rlc-resonance ── result templates + canvas banners + canvas labels
  'Goal: tune the source frequency f to within 1% of f₀ = 1/(2π√(LC)). Watch the teal f₀ line and slide f onto it — there X_L = X_C cancel and the current explodes to V/R.':
    'هدف: بسامد منبع f را تا فاصلهٔ کمتر از 1% با f₀ = 1/(2π√(LC)) تنظیم کن. خط فیروزه‌ای f₀ را زیر نظر بگیر و f را رویش بلغزان — آن‌جا X_L و X_C همدیگر را خنثی می‌کنند و جریان تا V/R منفجر می‌شود.',
  '★ Resonance! f = {f} is within {off}% of f₀ = {f0}. There X_L = X_C cancel, Z = R = {r} Ω, and I = V/R = {i} — the biggest current this circuit can carry. That is exactly how a radio locks onto one station.':
    '★ تشدید! f = {f} با فاصلهٔ {off}% از f₀ = {f0} قرار دارد. آن‌جا X_L و X_C همدیگر را خنثی می‌کنند، Z = R = {r} Ω می‌شود و I = V/R = {i} — بزرگ‌ترین جریانی که این مدار می‌تواند از خودش عبور دهد. دقیقاً همین‌طور است که یک رادیو روی یک ایستگاه قفل می‌کند.',
  'f₀ = {f0} → beyond the dial (increase L or C)': 'f₀ = {f0} → بیرون از گسترهٔ تنظیم (L یا C را بیشتر کن)',
  'I (mA) · log frequency →': 'I (mA) · بسامد لگاریتمی →',
  'Challenge: get f within 1% of f₀ — currently off by {off} %': 'چالش: f را تا فاصلهٔ 1% با f₀ نزدیک کن — الان {off} % فاصله دارد',
  '★ Challenge complete — locked onto resonance!': '★ چالش کامل شد — روی تشدید قفل شد!',

  // shared
  'Reset': 'بازنشانی',
}
