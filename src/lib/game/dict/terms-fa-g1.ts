// ─── Physics Quest · Persian sim terms · slice g1 (g/x1-unit-lab, g/x2-vector-lab, g/x3-rotation-lab, h/x4-rolling-race, h/x5-beam-balance, h/x6-orbit-sandbox) ──
// Keys EXACTLY match the user-visible English strings in src/components/sims/g/ and src/components/sims/h/.
// {placeholders} mark interpolated values; missing keys fall back to English.
export const termsFaG1: Record<string, string> = {
  // ── x1-unit-lab ── frame, controls, readouts
  'Unit Lab': 'آزمایشگاه یکاها',
  'Pick an object, read its length on the ruler, then convert between mm, cm and m.':
    'جسمی را انتخاب کن، طولش را روی خط‌کش بخوان، سپس بین mm و cm و m تبدیل کن.',
  'A pencil, book or rope drawn to scale above a centimetre ruler, with its length shown in centimetres, metres and millimetres':
    'مداد، کتاب یا طناب که در مقیاس واقعی بالای خط‌کش سانتی‌متری رسم شده و طولش بر حسب سانتی‌متر، متر و میلی‌متر نشان داده می‌شود',
  'Object': 'جسم',
  'Pencil · 14 cm': 'مداد · 14 cm',
  'Book · 24 cm': 'کتاب · 24 cm',
  'Rope · 1.85 m': 'طناب · 1.85 m',
  'pencil': 'مداد',
  'book': 'کتاب',
  'rope': 'طناب',
  'Your answer': 'پاسخ شما',
  'Choose an answer': 'یک پاسخ انتخاب کن',
  'Reset': 'بازنشانی',
  'Challenge: convert it': 'چالش: تبدیلش کن',
  'Length': 'طول',

  // ── x1-unit-lab ── result templates + canvas banners
  'Correct! {a} {fu} = {b} {tu} — same length, different unit.':
    'درست! {a} {fu} = {b} {tu} — همان طول، یکای متفاوت.',
  'Not quite: {a} {fu} = {b} {tu}. You picked {c} {tu}.':
    'دقیق نبود: {a} {fu} = {b} {tu}. تو {c} {tu} را انتخاب کردی.',
  'Challenge: report the {obj} length in {unit}!': 'چالش: طول {obj} را بر حسب {unit} گزارش کن!',
  '★ Challenge complete!': '★ چالش کامل شد!',
  'Watch the powers of ten — try again!': 'مراقب توان‌های 10 باش — دوباره تلاش کن!',
  'ruler (cm)': 'خط‌کش (cm)',

  // ── x2-vector-lab ── frame, controls, readouts
  'Vector Lab': 'آزمایشگاه بردار',
  'Build vectors A and B with the sliders and watch their components and the head-to-tail sum R.':
    'بردارهای A و B را با لغزنده‌ها بساز و مؤلفه‌ها و مجموع سربه‌دُم آن‌ها یعنی R را ببین.',
  'Two vectors A and B drawn head-to-tail on x-y axes with their emerald resultant R and dashed components':
    'دو بردار A و B که سربه‌دُم روی محورهای x-y رسم شده‌اند، همراه برآیند زمردی R و مؤلفه‌های نقطه‌چین',
  'Magnitude A': 'اندازهٔ A',
  'Angle A': 'زاویهٔ A',
  'Magnitude B': 'اندازهٔ B',
  'Angle B': 'زاویهٔ B',
  'Check': 'بررسی',
  'Challenge: make |R| = 10': 'چالش: |R| = 10 بساز',
  'Ax': 'Ax',
  'Ay': 'Ay',
  'Bx': 'Bx',
  'By': 'By',
  'Rx': 'Rx',
  'Ry': 'Ry',
  '|R|': '|R|',
  'Direction of R': 'جهت R',

  // ── x2-vector-lab ── result templates + canvas banners
  'Challenge solved! |R| = {r} at {dir}° — a 10-unit arrow pointing right.':
    'چالش حل شد! |R| = {r} در {dir}° — پیکانی 10 یکایی رو به راست.',
  'Not yet: |R| = {r} at {dir}°. You need |R| = 10 pointing right (0°).':
    'هنوز نه: |R| = {r} در {dir}°. لازم است |R| = 10 و رو به راست (0°) باشد.',
  'Challenge: make |R| = 10 pointing right (0°)!': 'چالش: |R| = 10 بساز که رو به راست باشد (0°)!',
  'Not the right resultant — tweak the sliders and check again!': 'برآیند درستی نیست — لغزنده‌ها را کمی جابه‌جا کن و دوباره بررسی کن!',

  // ── x3-rotation-lab ── frame, controls, readouts
  'Rotation Lab': 'آزمایشگاه چرخش',
  'Apply a torque to the disc: α = (τ − friction)/I with friction 0.5 N·m. Bigger I means slower spin-up.':
    'به دیسک گشتاور بده: α = (τ − اصطکاک)/I با اصطکاک 0.5 N·m. I بزرگ‌تر یعنی تند شدن چرخش کندتر.',
  'A rotating disc with an applied torque arrow, angular velocity gauge, marker dot and spokes':
    'دیسکی در حال چرخش با پیکان گشتاور اعمالی، عقربهٔ سرعت زاویه‌ای، نقطهٔ نشانگر و پره‌ها',
  'Applied torque τ': 'گشتاور اعمالی τ',
  'Disc type': 'نوع دیسک',
  'Solid disc · ½MR²': 'دیسک توپر · ½MR²',
  'Ring · MR²': 'حلقه · MR²',
  'Point masses · MR²': 'جرم‌های نقطه‌ای · MR²',
  'Stop': 'توقف',
  'Start': 'شروع',
  'Challenge: 10 rad/s at t = 2 s': 'چالش: 10 rad/s در t = 2 ثانیه',
  'Time': 'زمان',
  'Angle θ': 'زاویه θ',
  'Angular velocity ω': 'سرعت زاویه‌ای ω',
  'Angular acceleration α': 'شتاب زاویه‌ای α',
  'Moment of inertia I': 'گشتاور لختی I',
  'Target ω': 'ω هدف',

  // ── x3-rotation-lab ── result templates + canvas banners
  'Nailed it! ω = {w} rad/s at t = 2.0 s — your choice of τ and I produced α = {a} rad/s².':
    'دقیقاً درست بود! ω = {w} rad/s در t = 2.0 ثانیه — انتخاب τ و I تو α = {a} rad/s² ساخت.',
  'At t = 2.0 s the disc spun at {w} rad/s (target 10). You needed α = 5 rad/s². Retune τ or I and retry.':
    'در t = 2.0 ثانیه دیسک با {w} rad/s می‌چرخید (هدف 10). به α = 5 rad/s² نیاز داشتی. τ یا I را دوباره تنظیم کن و دوباره تلاش کن.',
  'Challenge: tune τ and I to hit ω = 10 rad/s at t = 2 s — measuring…':
    'چالش: τ و I را طوری تنظیم کن که در t = 2 ثانیه به ω = 10 rad/s برسد — در حال اندازه‌گیری…',
  'Off target at t = 2 s — retune τ or I and retry!': 'در t = 2 ثانیه از هدف جا ماندی — τ یا I را دوباره تنظیم کن و دوباره تلاش کن!',

  // ── x4-rolling-race ── frame, controls, readouts, legends
  'Rolling Race': 'مسابقهٔ غلتش',
  'Hoop, disc and solid sphere — same mass, same radius — race down an incline: a = g·sinθ/(1 + I/mR²). Energy spent on spinning is energy not spent on speed.':
    'حلقه، دیسک و کرهٔ توپر — با جرم و شعاع برابر — از سطح شیبدار پایین می‌تازند: a = g·sinθ/(1 + I/mR²). انرژی‌ای که صرف چرخش شود، دیگر صرف تندی نمی‌شود.',
  'Three rollers — hoop, disc and solid sphere — racing down an inclined ramp toward a finish line, their spokes showing rotation':
    'سه غلتنده — حلقه، دیسک و کرهٔ توپر — که به سمت خط پایان از سطح شیبدار می‌تازند و پره‌هایشان چرخش را نشان می‌دهد',
  'Incline angle': 'زاویهٔ شیب',
  'Your pick': 'انتخاب شما',
  'Hoop (I = mR²)': 'حلقه (I = mR²)',
  'Disc (I = ½mR²)': 'دیسک (I = ½mR²)',
  'Solid sphere (I = 2/5 mR²)': 'کرهٔ توپر (I = 2/5 mR²)',
  'Race!': 'مسابقه!',
  'Challenge: pick the winner': 'چالش: انتخاب برنده',
  'Hoop a': 'a حلقه',
  'Disc a': 'a دیسک',
  'Sphere a': 'a کره',
  'Finish order': 'ترتیب پایان',
  'hoop': 'حلقه',
  'disc': 'دیسک',
  'solid sphere': 'کرهٔ توپر',
  'finish line': 'خط پایان',
  'Hoop': 'حلقه',
  'Disc': 'دیسک',
  'Sphere': 'کره',
  'FINISH': 'پایان',

  // ── x4-rolling-race ── challenge results + canvas banners
  'You picked the solid sphere — and it won! Smallest I/mR² (0.4) means the biggest share of mgh becomes forward speed: a = g·sinθ/(1+0.4) beats 1.5 and 2.':
    'کرهٔ توپر را انتخاب کردی — و برنده شد! کوچک‌ترین I/mR² (0.4) یعنی بزرگ‌ترین سهم mgh به تندی روبه‌جلو تبدیل می‌شود: a = g·sinθ/(1+0.4) از 1.5 و 2 پیشی می‌گیرد.',
  'Your disc finished 2nd — so close! Its c = I/mR² = 0.5 gives a = g·sinθ/1.5; only the sphere (c = 0.4) accelerates harder.':
    'دیسک تو دوم شد — خیلی نزدیک بود! c = I/mR² = 0.5 آن یعنی a = g·sinθ/1.5؛ فقط کره (c = 0.4) تندتر شتاب می‌گیرد.',
  'Your hoop finished last. Its c = I/mR² = 1 stores half the energy as spin: a = g·sinθ/2 — the laziest roller on the ramp!':
    'حلقهٔ تو آخری شد. c = I/mR² = 1 آن نیمی از انرژی را در چرخش ذخیره می‌کند: a = g·sinθ/2 — تنبل‌ترین غلتکِ سطح شیبدار!',
  'Challenge: pick the winner in the select, then press Race!': 'چالش: برنده را در فهرست انتخاب کن، بعد «مسابقه!» را بزن!',
  '★ Winner predicted correctly!': '★ برنده درست پیش‌بینی شد!',
  'Wrong pick — watch which object crosses first!': 'انتخاب اشتباه بود — ببین کدام جسم اول از خط می‌گذرد!',

  // ── x5-beam-balance ── frame, controls, readouts, legends
  'Beam Balance': 'تعادل تیر',
  'A uniform 20 kg beam on two supports. Hang a load anywhere — the reactions follow from Στ = 0 taken about each support. Overload a support (or lift one off) and the beam tips.':
    'تیری یکنواخت به جرم 20 کیلوگرم روی دو تکیه‌گاه. بار را هرجا بخواهی آویزان کن — عکس‌العمل‌ها از Στ = 0 حول هر تکیه‌گاه به دست می‌آیند. یک تکیه‌گاه را اضافه‌بار کن (یا از زیرش بردار) تا تیر واژگن شود.',
  'A uniform beam on two triangular supports with a hanging load, reaction-force arrows, and a centre-of-gravity marker; the beam tips if a support unloads':
    'تیری یکنواخت روی دو تکیه‌گاه سه‌گوش با بار آویزان، پیکان‌های نیروی عکس‌العمل و نشانگر مرکز ثقل؛ اگر یک تکیه‌گاه بی‌بار شود تیر واژگن می‌شود',
  'Beam length': 'طول تیر',
  'Load': 'بار',
  'Load position': 'موقعیت بار',
  'Challenge: balance 150 N': 'چالش: متعادل کردن 150 N',
  'Support A': 'تکیه‌گاه A',
  'Support B': 'تکیه‌گاه B',
  'Beam weight': 'وزن تیر',
  'Support capacity': 'ظرفیت تکیه‌گاه',
  'center of gravity': 'مرکز ثقل',
  'load': 'بار',
  'support reaction': 'عکس‌العمل تکیه‌گاه',
  'capacity {n} N/support': 'ظرفیت {n} N برای هر تکیه‌گاه',

  // ── x5-beam-balance ── challenge results + canvas banners
  'Both supports now carry between 150 and 200 N — the 346 N total (196 N beam + 150 N load) shared almost evenly. The centre position, 173 N each, is the classic sweet spot!':
    'هر دو تکیه‌گاه الان بین 150 و 200 N حمل می‌کنند — کلِ 346 N (196 N تیر + 150 N بار) تقریباً مساوی تقسیم شده است. موقعیت وسط با 173 N برای هر تکیه‌گاه، همان نقطهٔ طلایی کلاسیک است!',
  "The beam tipped! One support's reaction hit zero, so the beam rotated about the other support and slid off. Keep the load between the supports (and balanced).":
    'تیر واژگن شد! عکس‌العمل یکی از تکیه‌گاه‌ها صفر شد، پس تیر حول تکیه‌گاه دیگر چرخید و سُر خورد. بار را بین تکیه‌گاه‌ها نگه دار (و متعادل).',
  'A support was asked for more than its 800 N capacity — the beam collapsed! Watch the reaction readouts and keep both below the limit.':
    'از یکی از تکیه‌گاه‌ها بیش از ظرفیت 800 N آن خواسته شد — تیر فرو ریخت! نمایشگرهای عکس‌العمل را زیر نظر بگیر و هر دو را زیر حد نگه دار.',
  'Challenge: place the 150 N load so BOTH supports carry 150–200 N': 'چالش: بار 150 N را طوری بگذار که هر دو تکیه‌گاه 150–200 N حمل کنند',
  '★ Perfectly shared load!': '★ بار کاملاً مساوی تقسیم شد!',
  'Beam down — press the challenge button and try again!': 'تیر افتاد — دکمهٔ چالش را بزن و دوباره تلاش کن!',

  // ── x6-orbit-sandbox ── frame, controls, readouts, legends
  'Orbit Sandbox': 'آزمایشگاه مدار',
  'Launch a satellite horizontally from altitude r with speed v. Gravity pulls a = GM/r² toward the planet: too slow crashes, v = √(GM/r) circles, v ≥ √(2GM/r) escapes.':
    'ماهواره‌ای را از ارتفاع r با تندی v به‌صورت افقی پرتاب کن. گرانش با a = GM/r² به سمت سیاره می‌کشد: خیلی کند برخورد می‌کند، v = √(GM/r) دایره می‌زند، v ≥ √(2GM/r) می‌گریزد.',
  'A planet at the centre of a starry sandbox with a launchable satellite: sliders set launch altitude and horizontal speed, a trail shows the trajectory, and the readouts track radius, speed and the circular and escape speeds':
    'سیاره‌ای در مرکز آزمایشگاهی پرستاره با ماهواره‌ای قابل پرتاب: لغزنده‌ها ارتفاع و تندی افقی پرتاب را تنظیم می‌کنند، ردّی مسیر را نشان می‌دهد و نمایشگرها شعاع، تندی و تندی‌های دایره‌ای و گریز را دنبال می‌کنند',
  'Preset orbits': 'مدارهای پیش‌فرض',
  'Fall (v = 2)': 'سقوط (v = 2)',
  'Sub-orbital (v = 4)': 'زیرمداری (v = 4)',
  'Circular at 2R (v = 5.6)': 'دایره‌ای در 2R (v = 5.6)',
  'Escape (v = 9)': 'گریز (v = 9)',
  'Altitude r': 'ارتفاع r',
  'Launch speed v': 'تندی پرتاب v',
  'Launch': 'پرتاب',
  'Challenge: stable orbit at 2R': 'چالش: مدار پایدار در 2R',
  'Radius r': 'شعاع r',
  'Speed v': 'تندی v',
  'Circular speed √(GM/r)': 'تندی دایره‌ای √(GM/r)',
  'Escape speed √(2GM/r)': 'تندی گریز √(2GM/r)',
  'planet (R = 1)': 'سیاره (R = 1)',
  'satellite + trail': 'ماهواره + ردّ',
  'velocity arrow': 'فلش سرعت',

  // ── x6-orbit-sandbox ── challenge results + canvas banners + status words
  "Goal: hold the orbit inside r = 1.85–2.15 R for 12 s of flight. At r = 2R the circular speed is v = √(GM/r) = √(62.5/2) ≈ 5.6 units/s — the 'Circular at 2R (v = 5.6)' preset sets both sliders, then press Launch.":
    'هدف: مدار را 12 ثانیه از پرواز درون r = 1.85–2.15 R نگه دار. در r = 2R تندی دایره‌ای برابر است با v = √(GM/r) = √(62.5/2) ≈ 5.6 units/s — پیش‌فرضِ «دایره‌ای در 2R (v = 5.6)» هر دو لغزنده را تنظیم می‌کند، بعد «پرتاب» را بزن.',
  "Crashed into the planet! At r = {r} R the circular speed is √(GM/r) ≈ {vc} units/s — slower launches fall in. Try the 'Circular at 2R (v = 5.6)' preset, then Launch.":
    'به سیاره برخورد کرد! در r = {r} R تندی دایره‌ای √(GM/r) ≈ {vc} units/s است — پرتاب‌های کندتر سقوط می‌کنند. پیش‌فرضِ «دایره‌ای در 2R (v = 5.6)» را امتحان کن، بعد «پرتاب».',
  'Escaped into space! Your {v} units/s met or beat the escape speed √(2GM/r) ≈ {ve} — the planet can never reel it back. For a circular orbit you need LESS than that: v = √(GM/r).':
    'به فضا گریخت! تندی {v} units/s تو به تندی گریز √(2GM/r) ≈ {ve} رسید یا از آن گذشت — سیاره هرگز نمی‌تواند آن را پس بکشد. برای مدار دایره‌ای باید کمتر از آن باشد: v = √(GM/r).',
  '★ Stable orbit! r stayed inside 1.85–2.15 R for 12 s. Gravity bent your {v} units/s sideways exactly as fast as you fell — v = √(GM/r) = √(62.5/2) ≈ 5.6 units/s is the circular recipe at 2R.':
    '★ مدار پایدار! r به مدت 12 ثانیه درون 1.85–2.15 R ماند. گرانش تندی {v} units/s تو را دقیقاً به‌اندازهٔ سقوطت به پهلو خم کرد — v = √(GM/r) = √(62.5/2) ≈ 5.6 units/s فرمولِ دایره‌ای در 2R است.',
  'Challenge: stable circular orbit at r = 2R — hold for 12 s!': 'چالش: مدار دایره‌ای پایدار در r = 2R — 12 ثانیه نگهش دار!',
  '★ Circular orbit achieved — challenge complete!': '★ مدار دایره‌ای حاصل شد — چالش کامل شد!',
  'Crashed — aim for v ≈ 5.6 at 2R and try again!': 'برخورد کرد — در 2R نشانهٔ v ≈ 5.6 را بگیر و دوباره تلاش کن!',
  'Escaped — that speed never comes back. Try again!': 'گریخت — آن تندی دیگر برنمی‌گردد. دوباره تلاش کن!',
  'stable {t} / 12 s': 'پایدار {t} / 12 ثانیه',
  'Predicted: {pred}': 'پیش‌بینی: {pred}',
  'Trajectory: {cls}': 'مسیر: {cls}',
  'Falls straight in': 'مستقیم سقوط می‌کند',
  'Escape': 'گریز',
  'Crash course': 'مسیر برخورد',
  'Circular': 'دایره‌ای',
  'Ellipse': 'بیضی',
  'Escaped': 'گریخت',
  'Crashed': 'برخورد کرد',
  'Escape (unbound)': 'گریز (باز)',
  'Circular (bound)': 'دایره‌ای (بسته)',
  'Ellipse (bound)': 'بیضی (بسته)',
}
