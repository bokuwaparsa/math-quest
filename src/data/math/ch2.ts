// ─── Math Quest · فصل ۲: مثلثات — lesson data (agent 3-b) ────────────────────
import type { Lesson } from '@/lib/game/types'

export const lessonsCh2: Lesson[] = [
  // ── درس ۱: نسبت‌های مثلثاتی ────────────────────────────────────────────────
  {
    id: 't1-trig-ratios',
    unitId: 'ch2',
    order: 1,
    title: 'نسبت‌های مثلثاتی',
    tagline: 'در مثلث قائم‌الزاویه، هر زاویه حاده سه نسبت جادویی دارد: سینوس، کسینوس و تانژانت.',
    difficulty: 'easy',
    minutes: 12,
    xp: 100,
    objectives: [
      'وتر، قببه و مجاور را در مثلث قائم‌الزاویه تشخیص دهی',
      'نسبت‌های سینوس، کسینوس و تانژانت را تعریف کنی',
      'نسبت‌های زاویه‌های ۳۰، ۴۵ و ۶۰ درجه را دقیق بنویسی',
      'با نسبت‌های مثلثاتی ضلع‌های مجهول مثلث را پیدا کنی',
    ],
    concept: [
      {
        type: 'p',
        text: String.raw`در مثلث قائم‌الزاویه یک ضلع نقش ویژه دارد: **وتر**، یعنی ضلع روبه‌روی زاویهٔ قائمه ($90^\circ$) که بلندترین ضلع مثلث است. حالا هر زاویهٔ حاده (کوچک‌تر از $90^\circ$) مثل $\theta$ را در نظر بگیر: ضلع روبه‌روی آن **قببه** و ضلع کناری آن **مجاور** نام دارد.`,
      },
      { type: 'h', text: 'سه نسبت اصلی' },
      {
        type: 'formula',
        tex: String.raw`\sin\theta=\dfrac{\text{قببه}}{\text{وتر}}\qquad \cos\theta=\dfrac{\text{مجاور}}{\text{وتر}}\qquad \tan\theta=\dfrac{\text{قببه}}{\text{مجاور}}`,
        caption: 'سینوس، کسینوس و تانژانت زاویهٔ θ در مثلث قائم‌الزاویه',
      },
      {
        type: 'key',
        text: String.raw`نسبت‌های مثلثاتی به اندازهٔ مثلث بستگی ندارند؛ فقط به زاویه وابسته‌اند. هر مثلث قائم‌الزاویهٔ دیگری با همان زاویهٔ $\theta$ شبیه مثلث اول است و نسبت‌ها یکسان می‌مانند.`,
      },
      {
        type: 'p',
        text: String.raw`مثال: اگر در یک مثلث $\tan\theta=\frac{3}{4}$ باشد، در هر مثلث قائم‌الزاویهٔ دیگری با همان زاویه هم تانژانت $\frac{3}{4}$ است؛ فقط همهٔ اضلاع با یک ضریب یکسان بزرگ‌تر شده‌اند.`,
      },
      { type: 'h', text: 'نسبت‌های زاویه‌های خاص' },
      {
        type: 'table',
        headers: ['نسبت \\ زاویه', '0°', '30°', '45°', '60°', '90°'],
        rows: [
          [String.raw`$\sin\theta$`, '0', String.raw`$\frac{1}{2}$`, String.raw`$\frac{\sqrt{2}}{2}$`, String.raw`$\frac{\sqrt{3}}{2}$`, '1'],
          [String.raw`$\cos\theta$`, '1', String.raw`$\frac{\sqrt{3}}{2}$`, String.raw`$\frac{\sqrt{2}}{2}$`, String.raw`$\frac{1}{2}$`, '0'],
          [String.raw`$\tan\theta$`, '0', String.raw`$\frac{\sqrt{3}}{3}$`, '1', String.raw`$\sqrt{3}$`, 'تعریف‌نشده'],
        ],
      },
      {
        type: 'p',
        text: String.raw`دقت کن که $\tan 90^\circ$ تعریف‌نشده است؛ چون ضلع مجاور صفر می‌شود و تقسیم بر صفر نداریم. به همین دلیل در محاسبه‌ها زاویه را هرگز دقیقاً ۹۰ درجه نمی‌گیریم.`,
      },
      { type: 'h', text: 'حل مثلث' },
      {
        type: 'p',
        text: String.raw`**حل مثلث** یعنی پیدا کردن اندازهٔ همهٔ ضلع‌ها و زاویه‌های ناشناختهٔ آن. اگر دو ضلع، یا یک ضلع و یک زاویهٔ حاده را بدانیم، بقیه را می‌توان با نسبت‌های مثلثاتی به دست آورد.`,
      },
      {
        type: 'key',
        text: String.raw`راهبرد: ضلع خواسته‌شده را از دیدِ زاویهٔ داده‌شده شناسایی کن (قببه؟ مجاور؟ وتر؟)، نسبت درست را انتخاب کن و معادله بساز؛ مثلاً قببه = وتر $\times\sin\theta$.`,
      },
      {
        type: 'list',
        items: [
          String.raw`وتر را پیدا کن: ضلع روبه‌روی زاویهٔ قائمه.`,
          String.raw`از دید زاویهٔ داده‌شده، قببه و مجاور را نام‌گذاری کن.`,
          String.raw`نسبت مناسب (sin، cos یا tan) را بنویس.`,
          String.raw`معادله را حل کن؛ مثلاً مجاور = وتر $\times\cos\theta$.`,
          String.raw`جواب را با رابطهٔ فیثاغورس بررسی کن: $a^2+b^2=c^2$.`,
        ],
      },
      {
        type: 'key',
        text: String.raw`هشدار اشتباه رایج: جابه‌جا کردن قببه و مجاور! همیشه از دید زاویهٔ θ نگاه کن: قببه روبه‌روی θ است و مجاور کنار θ (و چسبیده به زاویهٔ قائمه).`,
      },
    ],
    simKey: 't1-trig-ratios',
    workedExample: {
      title: 'حل یک مثلث قائم‌الزاویه',
      problem: String.raw`در مثلث قائم‌الزاویه، وتر برابر $10$ و یکی از زاویه‌های حاده $30^\circ$ است. دو ضلع دیگر را پیدا کن.`,
      steps: [
        {
          text: 'نسبت سینوس برای یافتن قببه (ضلع روبه‌روی زاویهٔ ۳۰ درجه):',
          tex: String.raw`\sin 30^\circ=\frac{\text{قببه}}{10}`,
        },
        {
          text: 'مقدار دقیق سینوس ۳۰ درجه را جای‌گذاری می‌کنیم:',
          tex: String.raw`\frac{1}{2}=\frac{\text{قببه}}{10}`,
        },
        {
          text: 'پس قببه:',
          tex: String.raw`\text{قببه}=10\times\frac{1}{2}=5`,
        },
        {
          text: 'حالا با کسینوس، مجاور را پیدا می‌کنیم:',
          tex: String.raw`\cos 30^\circ=\frac{\text{مجاور}}{10}\ \Rightarrow\ \frac{\sqrt{3}}{2}=\frac{\text{مجاور}}{10}`,
        },
        {
          text: 'پس مجاور:',
          tex: String.raw`\text{مجاور}=10\times\frac{\sqrt{3}}{2}=5\sqrt{3}\approx 8.66`,
        },
        {
          text: 'بررسی با رابطهٔ فیثاغورس:',
          tex: String.raw`5^2+(5\sqrt{3})^2=25+75=100=10^2\ \checkmark`,
        },
      ],
      answer: String.raw`قببه $=5$ و مجاور $=5\sqrt{3}\approx 8.66$`,
    },
    practice: [
      {
        id: 't1-trig-ratios-p1',
        prompt: String.raw`مقدار $\sin 30^\circ$ کدام است؟`,
        kind: 'mc',
        choices: [
          String.raw`$\frac{1}{2}$`,
          String.raw`$\frac{\sqrt{3}}{2}$`,
          String.raw`$\frac{\sqrt{2}}{2}$`,
          '1',
        ],
        answerIndex: 0,
        hints: [
          'به جدول زاویه‌های خاص در درس نگاه کن.',
          'در مثلث قائم‌الزاویه با زاویهٔ ۳۰°، قببه همیشه نصف وتر است.',
        ],
        explanation: String.raw`$\sin 30^\circ=\frac{1}{2}$؛ چون در مثلث قائم‌الزاویه با زاویهٔ ۳۰ درجه، ضلع قببه دقیقاً نصف وتر است.`,
      },
      {
        id: 't1-trig-ratios-p2',
        prompt: String.raw`در مثلث قائم‌الزاویه، وتر $8$ و زاویهٔ حاده $45^\circ$ است. طول قببه را (با دو رقم اعشار) بنویس.`,
        kind: 'numeric',
        answer: 5.66,
        tolerance: 0.02,
        hints: [
          'قببه روبه‌روی زاویه است؛ پس از سینوس استفاده کن.',
          String.raw`$\sin 45^\circ=\frac{\sqrt{2}}{2}\approx 0.707$`,
          String.raw`قببه $=$ وتر $\times\sin 45^\circ$`,
        ],
        explanation: String.raw`قببه $=8\times\frac{\sqrt{2}}{2}=4\sqrt{2}\approx 5.66$`,
      },
      {
        id: 't1-trig-ratios-p3',
        prompt: String.raw`در مثلث قائم‌الزاویه، قببهٔ زاویهٔ θ برابر ۳ و مجاور آن ۴ است. مقدار $\tan\theta$ کدام است؟`,
        kind: 'mc',
        choices: [
          String.raw`$\frac{3}{4}$`,
          String.raw`$\frac{4}{3}$`,
          String.raw`$\frac{3}{5}$`,
          String.raw`$\frac{4}{5}$`,
        ],
        answerIndex: 0,
        hints: [
          'تانژانت یعنی قببه تقسیم بر مجاور.',
          'ضلع بزرگ‌تر این مثلث (وتر) در تانژانت نقشی ندارد.',
        ],
        explanation: String.raw`$\tan\theta=\frac{\text{قببه}}{\text{مجاور}}=\frac{3}{4}$؛ وتر هم $5$ است (فیثاغورس) ولی در تانژانت به کار نمی‌آید.`,
      },
      {
        id: 't1-trig-ratios-p4',
        prompt: String.raw`وتر مثلثی ۱۳ و قببهٔ زاویهٔ θ آن ۵ است. مقدار $\cos\theta$ را (با سه رقم اعشار) بنویس.`,
        kind: 'numeric',
        answer: 0.923,
        tolerance: 0.01,
        hints: [
          'اول مجاور را با رابطهٔ فیثاغورس پیدا کن.',
          String.raw`$\text{مجاور}=\sqrt{13^2-5^2}=\sqrt{144}=12$`,
          'کسینوس یعنی مجاور تقسیم بر وتر.',
        ],
        explanation: String.raw`$\cos\theta=\frac{12}{13}\approx 0.923$`,
      },
      {
        id: 't1-trig-ratios-p5',
        prompt: 'کدام گزینه دربارهٔ زاویهٔ ۶۰ درجه درست است؟',
        kind: 'mc',
        choices: [
          String.raw`$\tan 60^\circ=\sqrt{3}$`,
          String.raw`$\sin 60^\circ=\frac{1}{2}$`,
          String.raw`$\cos 60^\circ=\frac{\sqrt{3}}{2}$`,
          String.raw`$\tan 60^\circ=1$`,
        ],
        answerIndex: 0,
        hints: [
          'به جدول زاویه‌های خاص نگاه کن.',
          'در زاویهٔ ۶۰° قببه بلندتر از مجاور است، پس تانژانت بزرگ‌تر از ۱ است.',
        ],
        explanation: String.raw`$\tan 60^\circ=\dfrac{\sqrt{3}/2}{1/2}=\sqrt{3}$؛ گزینه‌های دیگر مقادیر زاویه‌های ۶۰ و ۴۵ درجه را جابه‌جا کرده‌اند.`,
      },
    ],
    quiz: [
      {
        id: 't1-trig-ratios-q1',
        prompt: 'در مثلث قائم‌الزاویه، ضلع روبه‌روی زاویهٔ قائمه چه نامیده می‌شود؟',
        kind: 'mc',
        choices: ['وتر', 'قببه', 'مجاور', 'قائمه'],
        answerIndex: 0,
        hints: ['بلندترین ضلع مثلث را پیدا کن.'],
        explanation: 'وتر، ضلع روبه‌روی زاویهٔ قائمه و بلندترین ضلع مثلث قائم‌الزاویه است.',
      },
      {
        id: 't1-trig-ratios-q2',
        prompt: String.raw`$\sin 30^\circ = ?$`,
        kind: 'numeric',
        answer: 0.5,
        tolerance: 0.01,
        hints: [
          'در مثلث با زاویهٔ ۳۰°، قببه نصف وتر است.',
          'جواب را به صورت عدد اعشاری بنویس.',
        ],
        explanation: String.raw`$\sin 30^\circ=\frac{1}{2}=0.5$`,
      },
      {
        id: 't1-trig-ratios-q3',
        prompt: String.raw`وتر مثلثی ۵ و مجاور زاویهٔ θ آن ۳ است. $\cos\theta$ کدام است؟`,
        kind: 'mc',
        choices: [
          String.raw`$\frac{3}{5}$`,
          String.raw`$\frac{5}{3}$`,
          String.raw`$\frac{4}{5}$`,
          String.raw`$\frac{3}{4}$`,
        ],
        answerIndex: 0,
        hints: ['کسینوس یعنی مجاور تقسیم بر وتر.'],
        explanation: String.raw`$\cos\theta=\frac{\text{مجاور}}{\text{وتر}}=\frac{3}{5}$`,
      },
      {
        id: 't1-trig-ratios-q4',
        prompt: String.raw`زاویهٔ حادهٔ θ برابر $60^\circ$ و مجاور آن ۴ است. طول قببه را (با دو رقم اعشار) بنویس.`,
        kind: 'numeric',
        answer: 6.93,
        tolerance: 0.02,
        hints: [
          String.raw`از تانژانت استفاده کن: قببه $=$ مجاور $\times\tan 60^\circ$`,
          String.raw`$\tan 60^\circ=\sqrt{3}\approx 1.73$`,
        ],
        explanation: String.raw`قببه $=4\times\sqrt{3}=4\sqrt{3}\approx 6.93$`,
      },
      {
        id: 't1-trig-ratios-q5',
        prompt: String.raw`$\tan 90^\circ$ چقدر است؟`,
        kind: 'mc',
        choices: ['تعریف‌نشده', '1', '0', String.raw`$\sqrt{3}$`],
        answerIndex: 0,
        hints: ['در ۹۰ درجه ضلع مجاور چه اندازه‌ای دارد؟'],
        explanation: String.raw`در $90^\circ$ ضلع مجاور صفر است و $\tan\theta=\frac{\text{قببه}}{\text{مجاور}}$ تعریف‌نشده می‌شود.`,
      },
    ],
  },

  // ── درس ۲: دایرهٔ مثلثاتی ─────────────────────────────────────────────────
  {
    id: 't2-unit-circle',
    unitId: 'ch2',
    order: 2,
    title: 'دایرهٔ مثلثاتی',
    tagline: 'با دایره‌ای به شعاع ۱، نسبت‌های مثلثاتی را از مثلث کوچک به همهٔ زاویه‌ها گسترش بده.',
    difficulty: 'standard',
    minutes: 14,
    xp: 100,
    objectives: [
      'دایرهٔ مثلثاتی را تعریف کنی و مختصات نقطهٔ متناظر با θ را بنویسی',
      'علامت هر نسبت را در چهار ربع تعیین کنی',
      'مقدار نسبت‌ها را برای زاویه‌های بزرگ‌تر از ۹۰ درجه بیابی',
      'محل تعریف‌نشدن تانژانت را توضیح دهی',
    ],
    concept: [
      {
        type: 'p',
        text: String.raw`تا این‌جا نسبت‌ها را فقط برای زاویه‌های حاده دیدیم. برای آن‌که سینوس و کسینوس برای **هر زاویه** تعریف شوند، دایره‌ای به مرکز مبدأ مختصات و شعاع ۱ می‌کشیم؛ آن را **دایرهٔ مثلثاتی** می‌نامیم.`,
      },
      {
        type: 'key',
        text: String.raw`روی دایرهٔ مثلثاتی، اگر نقطهٔ $P$ متناظر با زاویهٔ θ باشد: $\cos\theta$ مختصهٔ اول (طولی) و $\sin\theta$ مختصهٔ دوم (عرضی) نقطهٔ $P$ است.`,
      },
      {
        type: 'formula',
        tex: String.raw`P=(\cos\theta\ ,\ \sin\theta)`,
        caption: 'نقطهٔ متناظر با زاویهٔ θ روی دایرهٔ مثلثاتی',
      },
      {
        type: 'p',
        text: String.raw`زاویه را از نیم‌محور مثبت $x$ و در جهت پادساعت‌گرد می‌سنجیم. مثلاً زاویهٔ $120^\circ$ به نقطه‌ای در ربع دوم می‌رسد و زاویهٔ $300^\circ$ به نقطه‌ای در ربع چهارم.`,
      },
      { type: 'h', text: 'علامت نسبت‌ها در ربع‌ها' },
      {
        type: 'table',
        headers: ['ربع', 'ناحیهٔ زاویه', 'sin θ', 'cos θ', 'tan θ'],
        rows: [
          ['اول', '0° تا 90°', '+', '+', '+'],
          ['دوم', '90° تا 180°', '+', '−', '−'],
          ['سوم', '180° تا 270°', '−', '−', '+'],
          ['چهارم', '270° تا 360°', '−', '+', '−'],
        ],
      },
      {
        type: 'key',
        text: 'قاعدهٔ به‌خاطرسپاری: در ربع اول همه مثبت‌اند؛ در ربع دوم فقط سینوس، در ربع سوم فقط تانژانت و در ربع چهارم فقط کسینوس مثبت است.',
      },
      {
        type: 'p',
        text: String.raw`چرا؟ $\cos\theta$ مختصهٔ $x$ نقطه است: در ربع‌های ۲ و ۳ نقطه سمت چپ محور $y$ است، پس کسینوس منفی است. $\sin\theta$ مختصهٔ $y$ است: در ربع‌های ۳ و ۴ نقطه زیر محور $x$ است، پس سینوس منفی است.`,
      },
      { type: 'h', text: 'زاویه‌های بزرگ‌تر از ۹۰ درجه' },
      {
        type: 'formula',
        tex: String.raw`\sin(180^\circ-\theta)=\sin\theta\qquad \cos(180^\circ-\theta)=-\cos\theta`,
        caption: String.raw`مثال: $\sin 120^\circ=\sin 60^\circ=\frac{\sqrt{3}}{2}$`,
      },
      {
        type: 'p',
        text: String.raw`پس برای زاویهٔ θ در ربع دوم، زاویهٔ حادهٔ متناظر آن $(180^\circ-\theta)$ است. مثلاً $\cos 150^\circ=-\cos 30^\circ=-\frac{\sqrt{3}}{2}$؛ چون ۱۵۰ درجه در ربع دوم است و کسینوس آن‌جا منفی است.`,
      },
      { type: 'h', text: 'تانژانت روی دایره' },
      {
        type: 'key',
        text: String.raw`$\tan\theta=\dfrac{y}{x}=\dfrac{\sin\theta}{\cos\theta}$؛ وقتی نقطه روی محور $y$ قرار بگیرد ($\theta=90^\circ$ یا $270^\circ$) مخرج صفر است و تانژانت تعریف‌نشده می‌شود.`,
      },
      {
        type: 'p',
        text: String.raw`هشدار رایج: علامت‌ها را فراموش نکن! مثلاً $\sin 210^\circ$ مثبت نیست؛ ۲۱۰ درجه در ربع سوم است و سینوسش منفی است: $\sin 210^\circ=-\sin 30^\circ=-\frac{1}{2}$.`,
      },
    ],
    simKey: 't2-unit-circle',
    workedExample: {
      title: 'مکان‌یابی نقطه روی دایرهٔ مثلثاتی',
      problem: String.raw`مختصات نقطهٔ متناظر با زاویهٔ $150^\circ$ روی دایرهٔ مثلثاتی را پیدا کن و علامت تانژانت آن را تعیین کن.`,
      steps: [
        {
          text: 'زاویهٔ ۱۵۰ درجه بین ۹۰ و ۱۸۰ است، پس نقطه در ربع دوم قرار دارد.',
        },
        {
          text: 'سینوس در ربع دوم مثبت است و با زاویهٔ حادهٔ متناظر برابر است:',
          tex: String.raw`\sin 150^\circ=\sin(180^\circ-150^\circ)=\sin 30^\circ=\frac{1}{2}`,
        },
        {
          text: 'چون در ربع دوم کسینوس منفی است:',
          tex: String.raw`\cos 150^\circ=-\cos 30^\circ=-\frac{\sqrt{3}}{2}`,
        },
        {
          text: 'پس نقطهٔ متناظر:',
          tex: String.raw`P=\left(-\frac{\sqrt{3}}{2}\ ,\ \frac{1}{2}\right)`,
        },
        {
          text: 'تانژانت نسبت y به x است؛ مثبت بر منفی، منفی می‌شود:',
          tex: String.raw`\tan 150^\circ=\frac{1/2}{-\sqrt{3}/2}=-\frac{1}{\sqrt{3}}=-\frac{\sqrt{3}}{3}\approx -0.58`,
        },
      ],
      answer: String.raw`$P=\left(-\frac{\sqrt{3}}{2},\ \frac{1}{2}\right)$ و $\tan 150^\circ=-\frac{\sqrt{3}}{3}\approx -0.58$ (منفی، چون در ربع دوم تانژانت منفی است)`,
    },
    practice: [
      {
        id: 't2-unit-circle-p1',
        prompt: String.raw`علامت $\cos\theta$ در ربع سوم چیست؟`,
        kind: 'mc',
        choices: ['منفی', 'مثبت', 'صفر', 'به θ بستگی دارد'],
        answerIndex: 0,
        hints: [
          'کسینوس همان مختصهٔ x نقطه است.',
          'در ربع سوم نقطه سمت چپ محور y قرار دارد.',
        ],
        explanation: 'در ربع سوم مختصهٔ x نقطه منفی است، پس کسینوس منفی است (و سینوس هم منفی است ولی تانژانت مثبت می‌شود).',
      },
      {
        id: 't2-unit-circle-p2',
        prompt: String.raw`مقدار $\sin 150^\circ$ را (به صورت عدد اعشاری) بنویس.`,
        kind: 'numeric',
        answer: 0.5,
        tolerance: 0.01,
        hints: [
          '۱۵۰ درجه در ربع دوم است؛ سینوس آن‌جا مثبت است.',
          String.raw`$\sin(180^\circ-\theta)=\sin\theta$`,
        ],
        explanation: String.raw`$\sin 150^\circ=\sin 30^\circ=\frac{1}{2}=0.5$`,
      },
      {
        id: 't2-unit-circle-p3',
        prompt: 'نقطهٔ متناظر با زاویهٔ ۶۰ درجه روی دایرهٔ مثلثاتی کدام است؟',
        kind: 'mc',
        choices: [
          String.raw`$\left(\frac{1}{2}\ ,\ \frac{\sqrt{3}}{2}\right)$`,
          String.raw`$\left(\frac{\sqrt{3}}{2}\ ,\ \frac{1}{2}\right)$`,
          String.raw`$\left(\frac{\sqrt{3}}{2}\ ,\ -\frac{1}{2}\right)$`,
          String.raw`$\left(-\frac{1}{2}\ ,\ \frac{\sqrt{3}}{2}\right)$`,
        ],
        answerIndex: 0,
        hints: [
          'مختصهٔ اول کسینوس و مختصهٔ دوم سینوس است.',
          String.raw`$\cos 60^\circ=\frac{1}{2}$ و $\sin 60^\circ=\frac{\sqrt{3}}{2}$`,
        ],
        explanation: String.raw`$P=(\cos 60^\circ,\ \sin 60^\circ)=\left(\frac{1}{2},\ \frac{\sqrt{3}}{2}\right)$`,
      },
      {
        id: 't2-unit-circle-p4',
        prompt: String.raw`مقدار $\cos 120^\circ$ را (به صورت عدد اعشاری) بنویس.`,
        kind: 'numeric',
        answer: -0.5,
        tolerance: 0.01,
        hints: [
          '۱۲۰ درجه در ربع دوم است؛ کسینوس آن‌جا منفی است.',
          String.raw`$\cos 120^\circ=-\cos 60^\circ$`,
        ],
        explanation: String.raw`$\cos 120^\circ=-\cos 60^\circ=-\frac{1}{2}=-0.5$`,
      },
      {
        id: 't2-unit-circle-p5',
        prompt: 'کدام زاویه در ربع دوم قرار دارد؟',
        kind: 'mc',
        choices: ['120°', '60°', '210°', '330°'],
        answerIndex: 0,
        hints: ['ربع دوم یعنی بین ۹۰ و ۱۸۰ درجه.'],
        explanation: '۱۲۰ درجه بین ۹۰ و ۱۸۰ است (ربع دوم)؛ ۶۰ در ربع اول، ۲۱۰ در ربع سوم و ۳۳۰ در ربع چهارم است.',
      },
    ],
    quiz: [
      {
        id: 't2-unit-circle-q1',
        prompt: 'شعاع دایرهٔ مثلثاتی چقدر است؟',
        kind: 'mc',
        choices: ['1', '2', '90', 'به اندازهٔ زاویه بستگی دارد'],
        answerIndex: 0,
        hints: ['دایره از مبدأ می‌گذرد و به نقطهٔ (1, 0) می‌رسد.'],
        explanation: 'دایرهٔ مثلثاتی دایره‌ای به مرکز مبدأ و شعاع ۱ است.',
      },
      {
        id: 't2-unit-circle-q2',
        prompt: String.raw`$\sin 90^\circ = ?$`,
        kind: 'numeric',
        answer: 1,
        tolerance: 0.01,
        hints: [
          'نقطهٔ متناظر با ۹۰ درجه روی کدام نقطه از محور y است؟',
          'مختصات آن نقطه (0, 1) است.',
        ],
        explanation: String.raw`نقطهٔ متناظر با $90^\circ$ نقطهٔ $(0,1)$ است؛ پس $\sin 90^\circ=1$.`,
      },
      {
        id: 't2-unit-circle-q3',
        prompt: String.raw`$\sin\theta$ در ربع چهارم چه علامتی دارد؟`,
        kind: 'mc',
        choices: ['منفی', 'مثبت', 'صفر', 'تعریف‌نشده'],
        answerIndex: 0,
        hints: ['در ربع چهارم نقطه زیر محور x است.'],
        explanation: 'در ربع چهارم مختصهٔ y نقطه منفی است، پس سینوس منفی است (و کسینوس مثبت است).',
      },
      {
        id: 't2-unit-circle-q4',
        prompt: String.raw`مقدار $\tan 135^\circ$ را (به صورت عدد اعشاری) بنویس.`,
        kind: 'numeric',
        answer: -1,
        tolerance: 0.01,
        hints: [
          '۱۳۵ درجه در ربع دوم است؛ تانژانت آن‌جا منفی است.',
          String.raw`$\tan 135^\circ=\frac{\sin 135^\circ}{\cos 135^\circ}=\frac{\sqrt{2}/2}{-\sqrt{2}/2}$`,
        ],
        explanation: String.raw`$\tan 135^\circ=\frac{\sqrt{2}/2}{-\sqrt{2}/2}=-1$`,
      },
      {
        id: 't2-unit-circle-q5',
        prompt: String.raw`$\cos 210^\circ$ کدام است؟`,
        kind: 'mc',
        choices: [
          String.raw`$-\frac{\sqrt{3}}{2}$`,
          String.raw`$\frac{\sqrt{3}}{2}$`,
          String.raw`$-\frac{1}{2}$`,
          String.raw`$-\sqrt{3}$`,
        ],
        answerIndex: 0,
        hints: [
          '۲۱۰ = ۱۸۰ + ۳۰؛ پس زاویهٔ حادهٔ متناظر ۳۰ درجه است.',
          'در ربع سوم کسینوس منفی است.',
        ],
        explanation: String.raw`$\cos 210^\circ=-\cos 30^\circ=-\frac{\sqrt{3}}{2}$`,
      },
    ],
  },

  // ── درس ۳: روابط بین نسبت‌های مثلثاتی ────────────────────────────────────
  {
    id: 't3-trig-relations',
    unitId: 'ch2',
    order: 3,
    title: 'روابط بین نسبت‌های مثلثاتی',
    tagline: 'اتحادها پل‌هایی میان نسبت‌هایند: یکی را بدانی، همه را می‌یابی.',
    difficulty: 'challenge',
    minutes: 15,
    xp: 100,
    objectives: [
      'روابط کسری csc، sec و cot را تعریف کنی',
      String.raw`اتحاد $\sin^2\theta+\cos^2\theta=1$ را در حل مسئله به کار ببری`,
      String.raw`رابطهٔ $\tan\theta=\frac{\sin\theta}{\cos\theta}$ را به کار ببری`,
      'نسبت‌های زاویه‌های مکمل (متمم) را بنویسی',
    ],
    concept: [
      {
        type: 'p',
        text: 'سه نسبت اصلی مثلثاتی به هم پیوند دارند؛ اگر یکی را بدانیم، بقیه هم قابل محاسبه‌اند. به این پیوندها **روابط بین نسبت‌های مثلثاتی** می‌گوییم.',
      },
      { type: 'h', text: 'روابط کسری' },
      {
        type: 'formula',
        tex: String.raw`\csc\theta=\frac{1}{\sin\theta}\qquad \sec\theta=\frac{1}{\cos\theta}\qquad \cot\theta=\frac{1}{\tan\theta}=\frac{\cos\theta}{\sin\theta}`,
        caption: 'کسینوس متقابل، سکانت و کوتانژانت',
      },
      {
        type: 'key',
        text: String.raw`دقت کن: $\cot\theta$ نسبت مجاور به قببه است؛ یعنی دقیقاً برعکس تانژانت. هر کدام از این نسبت‌ها وقتی تعریف‌نشده می‌شوند که مخرجشان صفر باشد؛ مثلاً $\csc\theta$ در $0^\circ$ و $180^\circ$، و $\sec\theta$ در $90^\circ$ تعریف‌نشده است.`,
      },
      { type: 'h', text: 'اتحاد فیثاغورسی' },
      {
        type: 'formula',
        tex: String.raw`\sin^2\theta+\cos^2\theta=1`,
        caption: 'مهم‌ترین اتحاد مثلثاتی؛ برای هر زاویهٔ θ برقرار است',
      },
      {
        type: 'p',
        text: String.raw`این اتحاد از رابطهٔ فیثاغورس می‌آید: $\left(\frac{\text{قببه}}{\text{وتر}}\right)^2+\left(\frac{\text{مجاور}}{\text{وتر}}\right)^2=\frac{\text{قببه}^2+\text{مجاور}^2}{\text{وتر}^2}=\frac{\text{وتر}^2}{\text{وتر}^2}=1$.`,
      },
      {
        type: 'key',
        text: String.raw`نماد $\sin^2\theta$ یعنی $(\sin\theta)^2$؛ هرگز آن را با $\sin\theta^2$ (سینوسِ θ به توان ۲) اشتباه نگیر.`,
      },
      { type: 'h', text: 'تانژانت از سینوس و کسینوس' },
      {
        type: 'formula',
        tex: String.raw`\tan\theta=\frac{\sin\theta}{\cos\theta}`,
        caption: String.raw`برای هر زاویه‌ای که $\cos\theta\neq 0$`,
      },
      {
        type: 'p',
        text: String.raw`مثال: اگر $\sin\theta=\frac{3}{5}$ و $\cos\theta=\frac{4}{5}$ باشد، آن‌گاه $\tan\theta=\frac{3/5}{4/5}=\frac{3}{4}$.`,
      },
      { type: 'h', text: 'نسبت‌های زاویه‌های مکمل' },
      {
        type: 'formula',
        tex: String.raw`\sin(90^\circ-\theta)=\cos\theta\qquad \cos(90^\circ-\theta)=\sin\theta\qquad \tan(90^\circ-\theta)=\cot\theta`,
        caption: 'دو زاویهٔ مکمل، نقش قببه و مجاور را عوض می‌کنند',
      },
      {
        type: 'p',
        text: String.raw`مثال: $\sin 30^\circ=\cos 60^\circ=\frac{1}{2}$؛ چون $30+60=90$ است و دو زاویه مکمل‌اند.`,
      },
      {
        type: 'key',
        text: String.raw`راهبرد حل: وقتی یک نسبت داده شده و θ حاده است، با اتحاد فیثاغورسی نسبت دوم را بیاب (در ربع اول همه مثبت‌اند) و بعد با $\tan\theta=\frac{\sin\theta}{\cos\theta}$ نسبت سوم را بساز.`,
      },
    ],
    simKey: 't3-trig-relations',
    workedExample: {
      title: 'از یک نسبت، همهٔ نسبت‌ها',
      problem: String.raw`می‌دانیم $\sin\theta=\frac{5}{13}$ و θ زاویه‌ای حاده است. $\cos\theta$ و $\tan\theta$ را پیدا کن.`,
      steps: [
        {
          text: 'با اتحاد فیثاغورسی شروع می‌کنیم:',
          tex: String.raw`\sin^2\theta+\cos^2\theta=1`,
        },
        {
          text: 'مقدار سینوس را جای‌گذاری می‌کنیم:',
          tex: String.raw`\cos^2\theta=1-\left(\frac{5}{13}\right)^2=1-\frac{25}{169}=\frac{144}{169}`,
        },
        {
          text: 'چون θ حاده است، کسینوس مثبت است:',
          tex: String.raw`\cos\theta=\frac{12}{13}`,
        },
        {
          text: 'حالا تانژانت از سینوس و کسینوس:',
          tex: String.raw`\tan\theta=\frac{\sin\theta}{\cos\theta}=\frac{5/13}{12/13}=\frac{5}{12}`,
        },
        {
          text: 'بررسی: مثلث با اضلاع ۵، ۱۲ و ۱۳ راست‌گرد است:',
          tex: String.raw`5^2+12^2=25+144=169=13^2\ \checkmark`,
        },
      ],
      answer: String.raw`$\cos\theta=\frac{12}{13}$ و $\tan\theta=\frac{5}{12}$`,
    },
    practice: [
      {
        id: 't3-trig-relations-p1',
        prompt: String.raw`$\sec\theta$ برابر است با:`,
        kind: 'mc',
        choices: [
          String.raw`$\frac{1}{\cos\theta}$`,
          String.raw`$\frac{1}{\sin\theta}$`,
          String.raw`$\frac{\cos\theta}{\sin\theta}$`,
          String.raw`$\tan\theta$`,
        ],
        answerIndex: 0,
        hints: ['سکانت، وارونهٔ کدام نسبت است؟', 'دقت کن که «س» سکانت و «کس» کسینوس را یادآوری می‌کند.'],
        explanation: String.raw`$\sec\theta=\frac{1}{\cos\theta}$؛ کسینوس متقابل ($\csc$) هم وارونهٔ سینوس است.`,
      },
      {
        id: 't3-trig-relations-p2',
        prompt: String.raw`$\sin\theta=\frac{3}{5}$ و θ حاده است. مقدار $\cos\theta$ را (به صورت عدد اعشاری) بنویس.`,
        kind: 'numeric',
        answer: 0.8,
        tolerance: 0.01,
        hints: [
          String.raw`$\cos^2\theta=1-\sin^2\theta$`,
          String.raw`$\cos^2\theta=1-\frac{9}{25}=\frac{16}{25}$`,
          'چون θ حاده است، کسینوس مثبت است.',
        ],
        explanation: String.raw`$\cos\theta=\sqrt{\frac{16}{25}}=\frac{4}{5}=0.8$`,
      },
      {
        id: 't3-trig-relations-p3',
        prompt: String.raw`$\cot\theta$ کدام است؟`,
        kind: 'mc',
        choices: [
          String.raw`$\frac{1}{\tan\theta}$`,
          String.raw`$\frac{1}{\cos\theta}$`,
          String.raw`$\frac{\sin\theta}{\cos\theta}$`,
          String.raw`$\sin\theta\cdot\cos\theta$`,
        ],
        answerIndex: 0,
        hints: ['کوتانژانت وارونهٔ تانژانت است.', 'تانژانت نسبت قببه به مجاور است؛ کوتانژانت برعکس.'],
        explanation: String.raw`$\cot\theta=\frac{1}{\tan\theta}=\frac{\cos\theta}{\sin\theta}$`,
      },
      {
        id: 't3-trig-relations-p4',
        prompt: 'زاویهٔ حاده‌ای پیدا کن که تانژانت آن ۱ باشد؛ اندازهٔ آن را (به درجه) بنویس.',
        kind: 'numeric',
        answer: 45,
        tolerance: 0.005,
        unit: 'درجه',
        hints: [
          'در چه زاویه‌ای قببه و مجاور برابرند؟',
          String.raw`$\tan 45^\circ=\frac{\text{قببه}}{\text{مجاور}}=1$`,
        ],
        explanation: String.raw`$\tan 45^\circ=1$؛ چون در زاویهٔ ۴۵ درجه قببه و مجاور برابرند.`,
      },
      {
        id: 't3-trig-relations-p5',
        prompt: String.raw`$\sin(90^\circ-\theta)$ برابر است با:`,
        kind: 'mc',
        choices: [
          String.raw`$\cos\theta$`,
          String.raw`$\sin\theta$`,
          String.raw`$\tan\theta$`,
          String.raw`$-\cos\theta$`,
        ],
        answerIndex: 0,
        hints: [
          'دو زاویهٔ مکمل، قببه و مجاور را جابه‌جا می‌کنند.',
          String.raw`امتحان کن: $\sin(90^\circ-30^\circ)=\sin 60^\circ=\frac{\sqrt{3}}{2}$`,
        ],
        explanation: String.raw`$\sin(90^\circ-\theta)=\cos\theta$؛ نمونهٔ عددی: $\sin 60^\circ=\cos 30^\circ=\frac{\sqrt{3}}{2}$.`,
      },
    ],
    quiz: [
      {
        id: 't3-trig-relations-q1',
        prompt: String.raw`مقدار $\sin^2 60^\circ+\cos^2 60^\circ$ کدام است؟`,
        kind: 'mc',
        choices: ['1', '0', String.raw`$\frac{1}{2}$`, String.raw`$\frac{3}{4}$`],
        answerIndex: 0,
        hints: ['اتحاد فیثاغورسی را به یاد بیاور.'],
        explanation: String.raw`$\sin^2\theta+\cos^2\theta=1$ برای هر زاویه‌ای برقرار است؛ پس جواب ۱ است.`,
      },
      {
        id: 't3-trig-relations-q2',
        prompt: String.raw`$\sin\theta=\frac{12}{13}$ و θ حاده است. مقدار $\cos\theta$ را (با سه رقم اعشار) بنویس.`,
        kind: 'numeric',
        answer: 0.385,
        tolerance: 0.02,
        hints: [
          String.raw`$\cos^2\theta=1-\left(\frac{12}{13}\right)^2=\frac{25}{169}$`,
          'چون θ حاده است، کسینوس مثبت است.',
        ],
        explanation: String.raw`$\cos\theta=\frac{5}{13}\approx 0.385$`,
      },
      {
        id: 't3-trig-relations-q3',
        prompt: String.raw`$\cot 60^\circ$ کدام است؟`,
        kind: 'mc',
        choices: [
          String.raw`$\frac{\sqrt{3}}{3}$`,
          String.raw`$\sqrt{3}$`,
          String.raw`$\frac{1}{2}$`,
          '1',
        ],
        answerIndex: 0,
        hints: [
          String.raw`$\cot\theta=\frac{1}{\tan\theta}$`,
          String.raw`$\tan 60^\circ=\sqrt{3}$`,
        ],
        explanation: String.raw`$\cot 60^\circ=\frac{1}{\sqrt{3}}=\frac{\sqrt{3}}{3}$`,
      },
      {
        id: 't3-trig-relations-q4',
        prompt: String.raw`اگر $\cos\theta=\frac{1}{2}$ باشد، $\sec\theta$ چند است؟`,
        kind: 'numeric',
        answer: 2,
        tolerance: 0.01,
        hints: [String.raw`$\sec\theta=\frac{1}{\cos\theta}$`],
        explanation: String.raw`$\sec\theta=\frac{1}{1/2}=2$`,
      },
      {
        id: 't3-trig-relations-q5',
        prompt: 'کدام گزینه همیشه درست است (به شرط تعریف‌شدن نسبت‌ها)؟',
        kind: 'mc',
        choices: [
          String.raw`$\tan\theta=\frac{\sin\theta}{\cos\theta}$`,
          String.raw`$\sin\theta=\frac{\cos\theta}{\tan\theta}$`,
          String.raw`$\sin^2\theta+\cos^2\theta=\tan\theta$`,
          String.raw`$\cot\theta=\tan\theta$`,
        ],
        answerIndex: 0,
        hints: [
          'تانژانت را از دید مثلث قائم‌الزاویه بررسی کن.',
          'با یک زاویهٔ ساده مثل ۳۰ درجه امتحان کن.',
        ],
        explanation: String.raw`$\tan\theta=\frac{\sin\theta}{\cos\theta}$ همیشه برقرار است؛ گزینهٔ آخر مثلاً فقط در زاویه‌های خاص درست می‌شود.`,
      },
    ],
  },
]
