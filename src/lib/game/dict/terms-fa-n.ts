// ─── Physics Quest · Persian sim terms · slice n (p4-photoelectric, p5-matter-wave, p6-atom-levels, p7-band-gap) ──
// Keys EXACTLY match the user-visible English strings in src/components/sims/n/.
// {placeholders} mark interpolated values; missing keys fall back to English.
export const termsFaN: Record<string, string> = {
  // ── p4-photoelectric-lab ── frame, controls, readouts, legends, buttons
  'Photoelectric Lab': 'آزمایشگاه فوتوالکتریک',
  'A lamp fires photons of wavelength λ at a metal. Each photon alone must pay the work function φ: KE_max = 1240/λ − φ (eV). Brightness only changes how many photons arrive.':
    'چراغی فوتون‌های با طول موج λ را به سمت فلزی شلیک می‌کند. هر فوتون به‌تنهایی باید کار تابش φ را بپردازد: KE_max = 1240/λ − φ (eV). روشنایی فقط تعداد فوتون‌های رسیده را عوض می‌کند.',
  'A lamp sending coloured photon arrows toward a metal plate; ejected electron dots fly off with speed set by their kinetic energy, and a below-threshold notice appears when the photon energy is too low':
    'چراغی که فلش‌های فوتونی رنگی به سمت صفحهٔ فلزی می‌فرستد؛ نقطه‌های الکترون گسیل‌شده با تندی‌ای وابسته به انرژی جنبشی‌شان می‌پرند و وقتی انرژی فوتون کم باشد اعلان «زیر آستانه» دیده می‌شود',
  'Wavelength λ': 'طول موج λ',
  'Intensity': 'شدت',
  'Metal': 'فلز',
  'Caesium · φ = 2.1 eV': 'سزیم · φ = 2.1 eV',
  'Sodium · φ = 2.3 eV': 'سدیم · φ = 2.3 eV',
  'Zinc · φ = 4.3 eV': 'روی · φ = 4.3 eV',
  'Platinum · φ = 6.4 eV': 'پلاتین · φ = 6.4 eV',
  'Caesium': 'سزیم',
  'Sodium': 'سدیم',
  'Zinc': 'روی',
  'Platinum': 'پلاتین',
  'Challenge: Zn electrons at 0.5–1 eV': 'چالش: الکترون‌های Zn در بازهٔ 0.5–1 eV',
  'E photon': 'انرژی فوتون',
  'Work fn φ': 'کار تابش φ',
  'KE max': 'بیشینهٔ KE',
  'Photocurrent': 'فتوجریان',
  'photon · {lam} nm': 'فوتون · {lam} nm',
  'ejected electron': 'الکترون گسیل‌شده',

  // ── p4-photoelectric-lab ── result templates + canvas banners + canvas labels
  'Zinc: KE = 1240/{l} − 4.3 = {ke} eV — inside the 0.5–1.0 eV band! Any λ from {lo} to {hi} nm does it. One rich photon pays the 4.3 eV fee and hands the electron the change.':
    'روی: KE = 1240/{l} − 4.3 = {ke} eV — درون بازهٔ 0.5–1.0 eV! هر λ از {lo} تا {hi} nm جواب می‌دهد. یک فوتون پولدار هزینهٔ 4.3 eV را می‌پردازد و باقی‌مانده را به الکترون می‌دهد.',
  'You used {metal} — the challenge is to eject electrons from zinc (φ = 4.3 eV). Switch the metal, then find λ where 1240/λ − 4.3 lands between 0.5 and 1.0 eV.':
    'تو از {metal} استفاده کردی — چالش، گسیل الکترون از روی است (φ = 4.3 eV). فلز را عوض کن، بعد λای پیدا کن که 1240/λ − 4.3 میان 0.5 و 1.0 eV بیفتد.',
  'KE = 1240/{l} − 4.3 = {ke} eV — below zero, so nothing is ejected. Shorten the wavelength (richer photons) to get into the 0.5–1.0 eV band.':
    'KE = 1240/{l} − 4.3 = {ke} eV — زیر صفر است، پس چیزی گسیل نمی‌شود. طول موج را کوتاه کن (فوتون‌های پولدارتر) تا وارد بازهٔ 0.5–1.0 eV شوی.',
  'KE = 1240/{l} − 4.3 = {ke} eV — ejected, but outside the 0.5–1.0 eV band. Nudge λ between {lo} and {hi} nm.':
    'KE = 1240/{l} − 4.3 = {ke} eV — گسیل شد، اما بیرون از بازهٔ 0.5–1.0 eV. λ را میان {lo} و {hi} nm جابه‌جا کن.',
  '{lam} nm (UV)': '{lam} nm (فرابنفش)',
  '{lam} nm (IR)': '{lam} nm (فروسرخ)',
  'electrons out →': 'الکترون‌ها به بیرون →',
  'below threshold — no electrons': 'زیر آستانه — بدون الکترون',
  'KE_max = 1240/{λ} − {φ} = {ke} eV · electron speed ∝ √KE':
    'KE_max = 1240/{λ} − {φ} = {ke} eV · تندی الکترون ∝ √KE',
  'Challenge: eject electrons from ZINC with KE between 0.5 and 1.0 eV!':
    'چالش: گسیل الکترون از روی (Zn) با KE میان 0.5 و 1.0 eV!',
  '★ Challenge complete!': '★ چالش کامل شد!',
  'Not in the band yet — tune λ (or the metal)!': 'هنوز در بازه نیستی — λ را (یا فلز را) تنظیم کن!',

  // ── p5-matter-wave-slit ── frame, controls, readouts, legends, buttons
  'Matter-Wave Double Slit': 'شکاف دوگانهٔ موج ماده',
  'Fire particles one at a time at a double slit. Each lands as a single dot — yet the dots accumulate into interference fringes with spacing Δy = λL/d. Flip the which-path detector and the fringes die.':
    'ذره‌ها را یکی‌یکی به شکاف دوگانه شلیک کن. هر یک به‌صورت یک نقطه فرود می‌آید — اما نقطه‌ها کم‌کم به فرینج‌های تداخل با فاصلهٔ Δy = λL/d می‌رسند. آشکارساز کدام‌مسیر را روشن کنی، فرینج‌ها می‌میرند.',
  'A particle gun fires single particles at a double slit; dots accumulate on a detector screen into an interference histogram, and a which-path detector toggle collapses the pattern into two clumps':
    'تفنگ ذره‌ای ذره‌ها را یکی‌یکی به شکاف دوگانه شلیک می‌کند؛ نقطه‌ها روی پردهٔ آشکارساز به هیستوگرام تداخل می‌رسند و کلید آشکارساز کدام‌مسیر الگو را به دو توده فرومی‌ریزد',
  'particle dot': 'نقطهٔ ذره',
  'accumulated hits': 'برخوردهای انباشته',
  'wave prediction': 'پیش‌بینی موج',
  'Particle': 'ذره',
  'Electron': 'الکترون',
  'Neutron': 'نوترون',
  'Fullerene C₆₀': 'فولرن C₆₀',
  'Speed': 'تندی',
  'Which-path detector': 'آشکارساز کدام‌مسیر',
  'Auto fire': 'شلیک خودکار',
  'Fire 5': 'شلیک 5 تایی',
  'Challenge: collect 80 dots': 'چالش: جمع کردن 80 نقطه',
  'de Broglie λ': 'دوبروی λ',
  'Fringe Δy': 'فرینج Δy',
  'Landed': 'فرود آمده',

  // ── p5-matter-wave-slit ── notes, results + canvas banners + canvas labels
  'Which-path detector ON: knowing which slit each particle used destroys the superposition — new dots pile into two plain clumps. Observation collapses the interference.':
    'آشکارساز کدام‌مسیر روشن است: دانستن اینکه هر ذره از کدام شکاف گذشته، برهم‌نهی را نابود می‌کند — نقطه‌های جدید در دو تودهٔ ساده تلنبار می‌شوند. مشاهده، تداخل را فرومی‌ریزد.',
  'Which-path detector OFF: each particle explores both slits again, so fringes resume building.':
    'آشکارساز کدام‌مسیر خاموش است: هر ذره دوباره هر دو شکاف را می‌پیماید و فرینج‌ها دوباره ساخته می‌شوند.',
  '80 dots and counting — the fringes are unmistakable. Each particle landed at ONE spot, yet the crowd of landings obeys the wave\'s probability map. That is wave–particle duality in one picture.':
    '80 نقطه و همچنان در حال جمع شدن — فرینج‌ها بی‌تردیدند. هر ذره در یک نقطه فرود آمد، با این حال جمع فرودها از نقشهٔ احتمال موج پیروی می‌کند. این همان دوگانگی موج–ذره در یک تصویر است.',
  'Auto-fire is paused under reduced motion — press Fire 5 to launch particles yourself.':
    'تحت «حرکت آهسته» شلیک خودکار متوقف است — برای پرتاب ذره‌ها خودت «شلیک 5 تایی» را بزن.',
  '1 {p} at a time': 'هر بار 1 {p}',
  'double slit': 'شکاف دوگانه',
  'which-path ON': 'کدام‌مسیر روشن',
  'detector screen': 'پردهٔ آشکارساز',
  'λ = h/(mv) = {λ} pm · on-screen spacing exaggerated; true Δy = λL/d in the readout':
    'λ = h/(mv) = {λ} pm · فاصله روی صفحه اغراق‌شده است؛ Δy واقعی = λL/d در نمایشگر',
  'ℏ/2 = {h} J·s — the trade nature never breaks': 'ℏ/2 = {h} J·s — این معامله‌ای است که طبیعت هرگز نمی‌شکند.',
  'Challenge: let 80 particles land — watch the pattern emerge! ({n}/80)':
    'چالش: بگذار 80 ذره فرود بیاید — پدیدار شدن الگو را ببین! ({n}/80)',
  'Something went sideways — reset and refire!': 'یک جایی از مسیر منحرف شد — بازنشانی کن و دوباره شلیک!',

  // ── p6-atom-levels ── frame, controls, readouts, legends, buttons
  'Atomic Levels & Spectra': 'ترازهای اتم و طیف‌ها',
  'Hydrogen\'s ladder, drawn to scale: E_n = −13.6/n² eV. Pick a drop (emission) or a climb (absorption) and watch the photon carry exactly the gap energy, λ = 1240/ΔE.':
    'نردبان هیدروژن، با مقیاس واقعی: E_n = −13.6/n² eV. یک سقوط (گسیل) یا بالا رفتن (جذب) انتخاب کن و ببین فوتون دقیقاً انرژی فاصله را با خود می‌برد: λ = 1240/ΔE.',
  'Hydrogen energy-level ladder from n=1 to n=6 drawn to scale, with an electron dot that drops between levels while a coloured photon squiggle flies out, or absorbs one while climbing':
    'نردبان ترازهای انرژی هیدروژن از n=1 تا n=6 با مقیاس واقعی؛ نقطهٔ الکترون میان ترازها سقوط می‌کند و فوتون رنگی بیرون می‌پرد، یا هنگام بالا رفتن یکی را جذب می‌کند',
  'electron': 'الکترون',
  'active levels': 'ترازهای فعال',
  'photon (UV/IR shown grey)': 'فوتون (فرابنفش/فروسرخ خاکستری نشان داده می‌شود)',
  'From level n': 'از تراز n',
  'To level n': 'به تراز n',
  'n = 1': 'n = 1',
  'n = 2': 'n = 2',
  'n = 3': 'n = 3',
  'n = 4': 'n = 4',
  'n = 5': 'n = 5',
  'n = 6': 'n = 6',
  'Challenge: make the 656 nm line': 'چالش: ساختن خط 656 nm',
  'ΔE photon': 'انرژی فوتون ΔE',
  'Wavelength': 'طول موج',
  'Series': 'سری',
  'Type': 'نوع',

  // ── p6-atom-levels ── result templates + canvas banners + canvas labels
  'Same level — no jump, no photon. Choose two different rungs (e.g. from n = 3 down to n = 2).':
    'همان تراز — نه پرشی، نه فوتونی. دو پلهٔ متفاوت انتخاب کن (مثلاً از n = 3 به پایین به n = 2).',
  'Dropping to n = 2 releases ΔE = {de} eV → λ = 1240/{de} ≈ 656 nm — the red H-alpha Balmer line, the colour of glowing nebulae!':
    'سقوط به n = 2 انرژی ΔE = {de} eV آزاد می‌کند → λ = 1240/{de} ≈ 656 nm — خط سرخ ه‌آلفای بالمر، رنگ سحابی‌های درخشان!',
  'That\'s an absorption (the electron climbs UP). Emission means falling DOWN to a lower rung — try setting "to" below "from" so ΔE pays out as light.':
    'این یک جذب است (الکترون به بالا می‌رود). گسیل یعنی سقوط به پلهٔ پایین‌تر — «به» را زیر «از» بگذار تا ΔE به نور تبدیل شود.',
  'λ = 1240/{de} ≈ {lam} nm — a real hydrogen line, but not the red 656 nm one. The Balmer lines end on n = 2; which drop into n = 2 gives ~656 nm?':
    'λ = 1240/{de} ≈ {lam} nm — یک خط واقعی هیدروژن، اما نه خط سرخ 656 nm. خط‌های بالمر به n = 2 ختم می‌شوند؛ کدام سقوط به n = 2 حدود 656 nm می‌دهد؟',
  'E = 0 — electron free (ionization at 13.6 eV above ground)': 'E = 0 — الکترون آزاد (یونش در 13.6 eV بالاتر از حالت پایه)',
  'emission': 'گسیل',
  'absorption': 'جذب',
  'none': 'هیچ',
  'ΔE = |E_{to} − E_{from}| = {de} eV · λ = 1240/ΔE = {lam} nm · levels to scale':
    'ΔE = |E_{to} − E_{from}| = {de} eV · λ = 1240/ΔE = {lam} nm · ترازها با مقیاس واقعی',
  'Challenge: emit the red 656 nm Balmer line — pick the right drop!':
    'چالش: خط سرخ 656 nm بالمر را بگسیل — سقوط درست را انتخاب کن!',
  'Not the red Balmer line yet — try another drop!': 'هنوز خط سرخ بالمر نیست — سقوط دیگری را امتحان کن!',

  // ── p7-band-gap-lab ── frame, controls, readouts, legends, buttons
  'Band Gap Lab': 'آزمایشگاه گاف نوار',
  'Electrons must climb the band gap Eg to conduct. Metals have no gap, insulators a wall, semiconductors a stepladder that heat helps to climb: n ∝ e^(−Eg/2kT). LEDs pay the gap back as light, λ = 1240/Eg.':
    'الکترون‌ها برای رسانایی باید از گاف نوار Eg بالا بروند. فلزها گاف ندارند، عایق‌ها دیوار دارند، و نیم‌رساناها پله‌ای دارند که گرما بالا رفتن را آسان می‌کند: n ∝ e^(−Eg/2kT). LEDها گاف را به‌صورت نور پس می‌دهند: λ = 1240/Eg.',
  'Energy band diagram with a conduction band on top and a valence band below, separated by a gap whose height depends on the chosen material; thermal electrons jump the gap, holes appear in the valence band, and LED materials glow at their emission wavelength':
    'نمودار نوارهای انرژی با نوار رسانش بالا و نوار ظرفیت پایین که گافِ وابسته به مادهٔ انتخابی میان‌شان است؛ الکترون‌های گرمایی از گاف می‌پرند، حفره‌ها در نوار ظرفیت پیدا می‌شوند و ماده‌های LED در طول موج گسیل خود می‌درخشند',
  'conduction electron': 'الکترون رسانش',
  'valence electron': 'الکترون ظرفیت',
  'hole': 'حفره',
  'Material': 'جنس ماده',
  'Copper · conductor': 'مس · رسانا',
  'Diamond · 5.5 eV': 'الماس · 5.5 eV',
  'Silicon · 1.1 eV': 'سیلیسیم · 1.1 eV',
  'Germanium · 0.67 eV': 'ژرمانیم · 0.67 eV',
  'LED red (GaAs) · 1.9 eV': 'LED سرخ (GaAs) · 1.9 eV',
  'LED blue (GaN) · 2.7 eV': 'LED آبی (GaN) · 2.7 eV',
  'Temperature': 'دما',
  'Challenge: find & heat the semiconductor': 'چالش: پیدا کردن نیم‌رسانا و گرم کردنش',
  'Band gap Eg': 'گاف نوار Eg',
  'Class': 'رده',
  'Excited electrons': 'الکترون‌های برانگیخته',
  'LED λ = 1240/Eg': 'LED λ = 1240/Eg',

  // ── p7-band-gap-lab ── result templates + canvas banners + canvas labels
  'Copper conducts at ANY temperature — its bands overlap, so there is nothing to demonstrate. The challenge wants a semiconductor: silicon or germanium, warmed until at least 5 electrons jump the gap.':
    'مس در هر دمایی رسانا است — نوارهایش هم‌پوشانی دارند، پس چیزی برای نمایش نیست. چالش یک نیم‌رسانا می‌خواهد: سیلیسیم یا ژرمانیم، آن‌قدر گرم که دست‌کم 5 الکترون از گاف بپرند.',
  '{metal}: n ∝ e^(−Eg/2kT) = e^(−{eg}/(2×8.617e-5×{T})) → model count {n} ≥ 5. A small gap plus a little heat frees carriers — warm semiconductors conduct better, the exact opposite of metals!':
    '{metal}: n ∝ e^(−Eg/2kT) = e^(−{eg}/(2×8.617e-5×{T})) → شمار مدل {n} ≥ 5. گاف کوچک اندکی گرما، حامل‌ها را آزاد می‌کند — نیم‌رساناهای گرم بهتر رسانا می‌شوند، دقیقاً برعکس فلزها!',
  'Diamond\'s 5.5 eV gap is a wall: even at {T} K the model count is 0. Diamond is an insulator — pick silicon (1.1 eV) or germanium (0.67 eV) and heat them up.':
    'گاف 5.5 eV الماس یک دیوار است: حتی در {T} K شمار مدل 0 است. الماس عایق است — سیلیسیم (1.1 eV) یا ژرمانیم (0.67 eV) را بردار و گرمشان کن.',
  '{metal} at {T} K: only {n} excited electrons — not the ≥ 5 you need. Turn up the temperature (or pick the smaller-gap semiconductor, germanium).':
    '{metal} در {T} K: تنها {n} الکترون برانگیخته — نه آن ≥ 5 که لازم داری. دما را بالا ببر (یا نیم‌رسانای گاف‌کوچک‌تر، ژرمانیم را انتخاب کن).',
  'valence & conduction bands OVERLAP — no gap': 'نوارهای ظرفیت و رسانش هم‌پوشانند — بدون گاف',
  'electron sea → conducts at any temperature': 'دریای الکترون → در هر دمایی رسانا',
  'conduction band (mobile electrons)': 'نوار رسانش (الکترون‌های متحرک)',
  'valence band (bonding electrons)': 'نوار ظرفیت (الکترون‌های پیوندی)',
  'n ∝ e^(−Eg/2kT) · hotter ⇒ more climbers (semiconductors only) · model exaggerated ~10¹⁶× for visibility':
    'n ∝ e^(−Eg/2kT) · گرمای بیشتر ⇒ صعودکننده‌های بیشتر (فقط نیم‌رساناها) · مدل برای دیده‌شدن ~10¹⁶× اغراق‌شده است',
  'Challenge: pick the semiconductor whose conduction sits between metal & insulator — heat it to ≥ 5 excited electrons!':
    'چالش: نیم‌رسانایی را بردار که رسانایی‌اش میان فلز و عایق است — آن‌قدر گرمش کن که ≥ 5 الکترون برانگیخته شود!',
  'Not there yet — adjust material or temperature!': 'هنوز نرسیده‌ای — جنس ماده یا دما را تنظیم کن!',

  // shared
  'Reset': 'بازنشانی',
}
