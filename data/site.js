// All site content, both languages, in one place. build.js turns this into dist/.
// Arabic is the primary language (the site opens in Arabic); English is a full mirror under /en/.

const brand = {
  name: { ar: 'ميد ديسك', en: 'MedDesk' },
  tagline: {
    ar: 'برامج إدارة عيادات تعمل بدون إنترنت',
    en: 'Clinic software that runs without internet',
  },
  whatsapp: '+963935835096',
};

// Interface strings. Keys are referenced from build.js as t('key').
const ui = {
  navProducts: { ar: 'البرامج', en: 'Products' },
  navWhy: { ar: 'لماذا ميد ديسك', en: 'Why MedDesk' },
  navInstall: { ar: 'طريقة التركيب', en: 'Installing' },
  navHelp: { ar: 'أسئلة شائعة', en: 'FAQ' },
  langSwitch: { ar: 'English', en: 'العربية' },

  heroTitle: {
    ar: 'برنامج لعيادتك، يعمل حتى لو انقطع الإنترنت',
    en: 'Clinic software that keeps working offline',
  },
  heroBody: {
    ar: 'أربعة برامج لأربعة اختصاصات. بياناتك تبقى على جهاز العيادة، والترخيص بدفعة واحدة.',
    en: 'Four programs for four specialties. Your data stays on the clinic computer, and the licence is a one-time payment.',
  },
  heroCta: { ar: 'اختر برنامج عيادتك', en: 'Choose your program' },
  heroCta2: { ar: 'تواصل على واتساب', en: 'Message on WhatsApp' },

  productsTitle: { ar: 'لكل اختصاص برنامجه', en: 'A program for each specialty' },
  productsBody: {
    ar: 'كل برنامج مبني على أوراق اختصاصه، وليس قالباً عاماً واحداً.',
    en: 'Each one is built around the paperwork of its own specialty, not a single generic template.',
  },
  openProduct: { ar: 'التفاصيل والتحميل', en: 'Details and download' },

  whyTitle: { ar: 'ثلاثة أشياء تجعله مختلفاً', en: 'Three things that make it different' },

  installTitle: { ar: 'التركيب يستغرق دقيقتين', en: 'Installing takes two minutes' },
  installBody: {
    ar: 'لا تحتاج خبرة تقنية. حمّل الملف، شغّله، وافتح البرنامج.',
    en: 'No technical experience needed. Download the file, run it, open the program.',
  },

  faqTitle: { ar: 'أسئلة يسألها الأطباء قبل التحميل', en: 'What doctors ask before downloading' },

  ctaTitle: { ar: 'غير متأكد أي برنامج يناسبك؟', en: 'Not sure which one fits?' },
  ctaBody: {
    ar: 'أرسل رسالة واذكر اختصاص عيادتك، وسأرد عليك بنفسي.',
    en: 'Send a message with your specialty and I will reply personally.',
  },

  download: { ar: 'تحميل', en: 'Download' },
  downloadFor: { ar: 'تحميل النسخة التجريبية', en: 'Download the trial' },
  trialNote: { ar: 'تجربة مجانية 14 يوماً بكل الميزات', en: '14-day free trial, all features' },
  for32: { ar: 'جهاز قديم؟ نزّل نسخة 32 بت', en: 'Older PC? 32-bit version' },
  hint64: {
    ar: 'أغلب الأجهزة اليوم 64 بت. إذا لم يعمل الملف، جرّب نسخة 32 بت.',
    en: 'Most PCs today are 64-bit. If the file will not run, try the 32-bit version.',
  },
  notReady: { ar: 'رابط التحميل قيد التجهيز', en: 'Download link coming soon' },
  version: { ar: 'الإصدار', en: 'Version' },
  size: { ar: 'الحجم', en: 'Size' },
  requirements: { ar: 'يعمل على', en: 'Runs on' },
  screenshots: { ar: 'من داخل البرنامج', en: 'Inside the program' },
  features: { ar: 'ما الذي يفعله', en: 'What it does' },
  backHome: { ar: 'كل البرامج', en: 'All products' },
  otherProducts: { ar: 'برامج أخرى', en: 'Other products' },

  footerRights: { ar: 'جميع الحقوق محفوظة', en: 'All rights reserved' },
  footerNote: {
    ar: 'برامج سطح مكتب لأنظمة ويندوز. البيانات تُحفظ على جهاز العيادة.',
    en: 'Windows desktop software. Data is stored on the clinic computer.',
  },
};

const why = [
  {
    icon: 'wifiOff',
    t: { ar: 'يعمل بدون إنترنت', en: 'Works offline' },
    b: {
      ar: 'كل شيء يجري على جهاز العيادة. لا سحابة، ولا حساب، ولا انتظار اتصال.',
      en: 'Everything runs on the clinic computer. No cloud, no account, no waiting for a connection.',
    },
  },
  {
    icon: 'lock',
    t: { ar: 'بياناتك تبقى عندك', en: 'Your data stays with you' },
    b: {
      ar: 'ملفات المرضى لا تُرفع إلى أي مكان، والنسخ الاحتياطية بيدك أنت.',
      en: 'Patient files are never uploaded anywhere, and the backups are yours to keep.',
    },
  },
  {
    icon: 'wallet',
    t: { ar: 'دفعة واحدة، بلا اشتراك', en: 'One payment, no subscription' },
    b: {
      ar: 'ترخيص دائم. لا رسوم شهرية، ولا برنامج يتوقف لأن الاشتراك انتهى.',
      en: 'A permanent licence. No monthly fee, and nothing stops working because a subscription lapsed.',
    },
  },
];

const steps = [
  {
    t: { ar: 'نزّل الملف', en: 'Download the file' },
    b: {
      ar: 'اضغط زر التحميل في صفحة البرنامج. الملف ينزل إلى مجلد التنزيلات.',
      en: 'Press the download button on the product page. The file lands in your Downloads folder.',
    },
  },
  {
    t: { ar: 'شغّل ملف التركيب', en: 'Run the installer' },
    b: {
      ar: 'اضغط عليه مرتين. إذا ظهرت رسالة من ويندوز، اختر «مزيد من المعلومات» ثم «تشغيل على أي حال».',
      en: 'Double-click it. If Windows shows a warning, choose "More info" then "Run anyway".',
    },
  },
  {
    t: { ar: 'افتح البرنامج', en: 'Open the program' },
    b: {
      ar: 'سيسألك عن اسم العيادة والطبيب والشعار، ثم يصبح جاهزاً للعمل.',
      en: 'It asks for your clinic name, doctor name and logo, and it is ready to use.',
    },
  },
];

const faq = [
  {
    q: { ar: 'هل أحتاج إنترنت لتشغيل البرنامج؟', en: 'Do I need internet to run it?' },
    a: {
      ar: 'لا. البرنامج يعمل كاملاً بدون إنترنت. تحتاج الإنترنت مرة واحدة فقط لتحميل الملف.',
      en: 'No. It runs completely offline. You only need internet once, to download the file.',
    },
  },
  {
    q: { ar: 'أين تُحفظ بيانات المرضى؟', en: 'Where is patient data stored?' },
    a: {
      ar: 'على جهاز العيادة نفسه. لا يُرفع شيء إلى الإنترنت، ويمكنك أخذ نسخة احتياطية على فلاشة بضغطة واحدة.',
      en: 'On the clinic computer itself. Nothing is uploaded, and you can back it up to a USB stick with one click.',
    },
  },
  {
    q: { ar: 'ويندوز يقول إن الملف غير معروف. هل هو آمن؟', en: 'Windows says the file is unrecognised. Is it safe?' },
    a: {
      ar: 'هذه رسالة تظهر لأي برنامج غير موقّع رقمياً، وليست تحذيراً من فيروس. اختر «مزيد من المعلومات» ثم «تشغيل على أي حال». إذا أردت التأكد، راسلني قبل التركيب.',
      en: 'That message appears for any program without a paid code-signing certificate. It is not a virus warning. Choose "More info" then "Run anyway". Message me first if you want to check.',
    },
  },
  {
    q: { ar: 'هل يمكن ربط أكثر من جهاز في العيادة؟', en: 'Can I connect more than one computer?' },
    a: {
      ar: 'نعم، في أسنان وكلينك ديسك وكلينك مانجر. جهاز واحد يكون رئيسياً والباقي ينضم إليه عبر شبكة العيادة، بدون إنترنت.',
      en: 'Yes, in Asnaan, Clinic Desk and Clinic Manager. One computer acts as the main one and the others join it over the clinic network, with no internet.',
    },
  },
  {
    q: { ar: 'ماذا يحدث بعد انتهاء التجربة؟', en: 'What happens when the trial ends?' },
    a: {
      ar: 'البيانات التي أدخلتها تبقى كما هي. تراسلني للحصول على الترخيص الدائم وتكمل من نفس النقطة.',
      en: 'Everything you entered stays exactly as it is. Message me for the permanent licence and you continue from the same point.',
    },
  },
  {
    q: { ar: 'هل تساعدونني في التركيب والتدريب؟', en: 'Do you help with setup and training?' },
    a: {
      ar: 'نعم. التركيب والتدريب على البرنامج والدعم بعد البيع كلها جزء من السعر، وليست خدمة إضافية.',
      en: 'Yes. Installation, training and after-sales support are part of the price, not an add-on.',
    },
  },
];

const winReq = {
  ar: ['ويندوز 10 أو 11 (ويعمل على ويندوز 7 بنسخة 32 بت)', 'ذاكرة 4 غيغابايت أو أكثر', 'مساحة فارغة 1 غيغابايت'],
  en: ['Windows 10 or 11 (Windows 7 works with the 32-bit build)', '4 GB RAM or more', '1 GB free disk space'],
};

const products = [
  {
    slug: 'asnaan',
    dir: 'dental-app',
    exeName: 'Asnaan Setup',
    logo: 'dental-app/build/logo.png',
    name: { ar: 'أسنان', en: 'Asnaan' },
    audience: { ar: 'عيادات الأسنان', en: 'Dental clinics' },
    blurb: {
      ar: 'من حجز الموعد إلى الإيصال: مخطط أسنان واقعي، جلسات، مخبر، أشعة وأقراص CBCT، ووصفات بترويسة عيادتك.',
      en: 'From booking to receipt: a realistic tooth chart, visits, lab work, imaging and CBCT discs, and prescriptions on your own letterhead.',
    },
    shotDir: 'dental-app/promo/carousel/shots',
    shots: [
      { f: 'today.png', c: { ar: 'مواعيد اليوم ومن ينتظر الآن', en: "Today's appointments and who is waiting" } },
      { f: 'patient-chart.png', c: { ar: 'مخطط أسنان واقعي، كل سن وتاريخه', en: 'A realistic chart, every tooth with its history' } },
      { f: 'visit-picker.png', c: { ar: 'اختيار السن والعلاج، والسعر يُحسب تلقائياً', en: 'Pick the tooth and treatment, the price calculates itself' } },
      { f: 'lab.png', c: { ar: 'أعمال المخبر من الإرسال إلى التركيب', en: 'Lab cases from sent to fitted' } },
      { f: 'sheets.png', c: { ar: 'وصفات وإيصالات بشعار عيادتك', en: 'Prescriptions and receipts on your letterhead' } },
    ],
    features: [
      { icon: 'scan', t: { ar: 'مخطط أسنان واقعي', en: 'Realistic tooth chart' }, b: { ar: 'تيجان وزرعات وجسور كما تبدو في الفم، وأكثر من حالة للسن الواحد. ومخطط الأسنان اللبنية للأطفال.', en: 'Crowns, implants and bridges as they look in the mouth, with more than one condition per tooth. Includes a primary-teeth chart for children.' } },
      { icon: 'calendar', t: { ar: 'مواعيد وجلسات', en: 'Appointments and visits' }, b: { ar: 'احجز على الأوقات الفارغة، وملف المريض الجديد يُنشأ تلقائياً مع أول موعد.', en: 'Book into free slots, and a new patient file is created automatically with the first appointment.' } },
      { icon: 'wallet', t: { ar: 'حساب واضح وذمم', en: 'Clear payments and balances' }, b: { ar: 'دفع كامل أو جزئي أو ذمة، بالليرة أو الدولار بسعر الصرف الذي تحدده، وإيصال بضغطة.', en: 'Full, partial or outstanding payment, in local currency or dollars at the rate you set, with a one-click receipt.' } },
      { icon: 'image', t: { ar: 'أشعة وأقراص CBCT', en: 'Imaging and CBCT discs' }, b: { ar: 'الصور تُربط بالسن الذي صُوّر، وقرص الـ CBCT يُنسخ كاملاً إلى ملف المريض مع برنامج عرضه.', en: 'Images are linked to the tooth they show, and a CBCT disc is copied whole into the patient file with its viewer.' } },
      { icon: 'clipboard', t: { ar: 'مخبر وعمليات جراحية', en: 'Lab work and surgery' }, b: { ar: 'تابع كل عمل مخبري بلونه وموعده، واحجز موعد إزالة الخيوط تلقائياً بعد العملية.', en: 'Track every lab case with its shade and due date, and auto-book the suture-removal appointment after surgery.' } },
      { icon: 'chart', t: { ar: 'تقارير محمية بكلمة مرور', en: 'Password-protected reports' }, b: { ar: 'المقبوضات والمصاريف والصافي، مع تصدير Excel. تقارير الشهر والسنة لا تُفتح إلا بكلمة مرورك.', en: 'Income, expenses and net profit with Excel export. Monthly and yearly reports open only with your password.' } },
    ],
    extraReq: { ar: ['يمكن ربط أكثر من جهاز على شبكة العيادة'], en: ['Multiple computers can be linked over the clinic network'] },
  },
  {
    slug: 'gynodesk',
    dir: 'gyno-clinic-app',
    exeName: 'GynoDesk Setup',
    logo: 'gyno-clinic-app/build/logo.png',
    name: { ar: 'جاينو ديسك', en: 'GynoDesk' },
    audience: { ar: 'النسائية والتوليد', en: 'Obstetrics and gynaecology' },
    blurb: {
      ar: 'بطاقة المشاهدة النسائية والولادية بنفس حقول ورقتك، ومتابعة الحمل وحساب موعد الولادة تلقائياً.',
      en: 'The gynaecology and obstetric visit cards with the same fields as your paper form, plus pregnancy follow-up and automatic due dates.',
    },
    shotDir: 'gyno-clinic-app/src/help',
    shots: [
      { f: 'home.png', c: { ar: 'الصفحة الرئيسية: اليوم كله أمامك', en: 'The home page: the whole day at a glance' } },
      { f: 'card.png', c: { ar: 'بطاقة المشاهدة، بنفس حقول ورقتك', en: 'The visit card, with the same fields as your paper form' } },
      { f: 'pregnancies.png', c: { ar: 'كل الحوامل وموعد الولادة المتوقع', en: 'Every pregnancy with its expected delivery date' } },
      { f: 'labs.png', c: { ar: 'التحاليل والإيكو: طلب ونتيجة', en: 'Labs and ultrasound: order and result' } },
      { f: 'reports.png', c: { ar: 'تقارير الدخل والمصاريف', en: 'Income and expense reports' } },
    ],
    features: [
      { icon: 'card', t: { ar: 'بطاقة نسائية وبطاقة ولادية', en: 'Gynaecology and obstetric cards' }, b: { ar: 'نفس حقول ورقتك: القصة، الفحص، التشخيص، التدبير. وتُطبع على A4 بشعار عيادتك.', en: 'The same fields as your paper: history, examination, diagnosis, management. Prints to A4 on your letterhead.' } },
      { icon: 'baby', t: { ar: 'متابعة الحمل', en: 'Pregnancy follow-up' }, b: { ar: 'موعد الولادة المتوقع وعمر الحمل والثلث تُحسب من آخر طمث وتتحدث كل يوم.', en: 'Due date, gestational age and trimester are calculated from the last period and update daily.' } },
      { icon: 'clipboard', t: { ar: 'جدول المتابعة والمخاض', en: 'Antenatal table and partogram' }, b: { ar: 'سطر لكل زيارة، والزيارة القادمة تحجز موعداً في التقويم. والمخاض والولادة وبيانات الوليد في البطاقة نفسها.', en: 'A row per visit, and the next visit books itself into the calendar. Labour, delivery and newborn details live in the same card.' } },
      { icon: 'activity', t: { ar: 'تحاليل وإيكو', en: 'Labs and ultrasound' }, b: { ar: 'اطلب التحليل من الجلسة، ويبقى معلّقاً حتى تُدخل النتيجة، مع تنبيه بالنتائج الناقصة.', en: 'Order from inside the visit; it stays pending until you enter the result, with a reminder for anything missing.' } },
      { icon: 'pill', t: { ar: 'وصفات طبية', en: 'Prescriptions' }, b: { ar: 'أدويتك محفوظة بجرعاتها، والوصفة تُطبع بترويسة العيادة بقياس A5.', en: 'Your drug list is saved with doses, and the prescription prints on clinic letterhead at A5.' } },
      { icon: 'whatsapp', t: { ar: 'تذكير المريضة على واتساب', en: 'WhatsApp reminders' }, b: { ar: 'تذكير بالموعد أو باقتراب موعد الولادة، برسالة جاهزة باسم المريضة.', en: 'Appointment or approaching-due-date reminders, pre-written with the patient name.' } },
    ],
    extraReq: { ar: ['مصمّم للعمل على جهاز واحد في العيادة'], en: ['Designed for a single clinic computer'] },
  },
  {
    slug: 'clinic-desk',
    dir: 'general-clinic-app',
    exeName: 'Clinic Desk Setup',
    logo: 'general-clinic-app/build/logo.png',
    name: { ar: 'كلينك ديسك', en: 'Clinic Desk' },
    audience: { ar: 'العيادات العامة', en: 'General practice' },
    blurb: {
      ar: 'مواعيد وغرفة انتظار على الشاشة، ملف مريض بخلاصة سريعة، مستودع أدوية، وعمليات بتعليمات تُطبع للمريض.',
      en: 'Appointments and an on-screen waiting room, patient files with a quick summary, a medicine store, and procedures with printed aftercare.',
    },
    shotDir: 'general-clinic-app/src/help',
    shots: [
      { f: 'queue.png', c: { ar: 'غرفة الانتظار: من وصل ومن بالداخل', en: 'The waiting room: who arrived and who is in' } },
      { f: 'appointments.png', c: { ar: 'تقويم بالأوقات الفارغة الجاهزة', en: 'A calendar with free slots ready to pick' } },
      { f: 'patient.png', c: { ar: 'ملف المريض وخلاصته قبل أن يدخل', en: 'The patient file and summary before they walk in' } },
      { f: 'medicines.png', c: { ar: 'مستودع الأدوية والصرف', en: 'Medicine stock and dispensing' } },
      { f: 'reports.png', c: { ar: 'تقارير الدخل والمصاريف', en: 'Income and expense reports' } },
    ],
    features: [
      { icon: 'users', t: { ar: 'غرفة انتظار على الشاشة', en: 'On-screen waiting room' }, b: { ar: 'من وصل، من عند الطبيب، ومن انتهى. الاستقبال والطبيب يريان الشيء نفسه في اللحظة نفسها.', en: 'Who arrived, who is with the doctor, who is done. Reception and doctor see the same thing at the same moment.' } },
      { icon: 'calendar', t: { ar: 'مواعيد ومواعيد متكررة', en: 'Appointments, including recurring' }, b: { ar: 'البرنامج يعرف أيام دوامك وساعاتك ويقترح الأوقات الفارغة. ومريض الجلسات يُحجز له كل مواعيده دفعة واحدة.', en: 'It knows your working days and hours and offers the free slots. A course of visits can be booked in one go.' } },
      { icon: 'fileText', t: { ar: 'خلاصة المريض قبل دخوله', en: 'Patient summary before they enter' }, b: { ar: 'آخر زيارة، الأمراض المزمنة، الأدوية الحالية، والموعد القادم في سطر واحد أعلى الشاشة.', en: 'Last visit, chronic conditions, current medication and next appointment on one line at the top.' } },
      { icon: 'pill', t: { ar: 'مستودع أدوية', en: 'Medicine store' }, b: { ar: 'كمية كل صنف، تنبيه عند اقتراب النفاد، وصرف للمريض مسجّل بتاريخه.', en: 'Quantity per item, a warning when stock runs low, and every dispense logged with its date.' } },
      { icon: 'clipboard', t: { ar: 'عمليات وتعليمات ما بعدها', en: 'Procedures and aftercare' }, b: { ar: 'تعليمات جاهزة تُطبع بشعار عيادتك أو تُرسل على واتساب، وموعد المتابعة يُحجز قبل خروج المريض.', en: 'Ready-made instructions printed on your letterhead or sent over WhatsApp, with the follow-up booked before the patient leaves.' } },
      { icon: 'sliders', t: { ar: 'معالج إعداد لأول مرة', en: 'First-run setup wizard' }, b: { ar: 'خمسة أسئلة: اسم العيادة، الطبيب، الشعار، أيام الدوام، وعدد الأجهزة. ثم تبدأ العمل.', en: 'Five questions: clinic name, doctor, logo, working days, number of computers. Then you start.' } },
    ],
    extraReq: { ar: ['يمكن ربط جهاز الاستقبال وجهاز الطبيب على شبكة العيادة'], en: ['Reception and doctor computers can be linked over the clinic network'] },
  },
  {
    slug: 'clinic-manager',
    dir: 'clinic-app',
    exeName: 'Clinic Manager Setup',
    logo: 'meddesk-site/static/logo-rays.png',
    name: { ar: 'كلينك مانجر', en: 'Clinic Manager' },
    audience: { ar: 'مراكز الأشعة', en: 'Radiology centres' },
    blurb: {
      ar: 'دور عمل لكل قسم على جهازه، صور وتقارير في ملف المريض، ومصاريف وتقارير أرباح للمركز.',
      en: 'A work queue per department on its own screen, images and reports in the patient file, and expenses and profit reports for the centre.',
    },
    shotDir: 'meddesk-site/static/shots/clinic-manager',
    shots: [
      { f: 'queue.png', c: { ar: 'قائمة الانتظار موزعة على الأقسام', en: 'The waiting list split across departments' } },
      { f: 'patients.png', c: { ar: 'ملفات المرضى وصورهم', en: 'Patient files and their images' } },
      { f: 'visit.png', c: { ar: 'تسجيل زيارة وتحديد الفحوصات', en: 'Registering a visit and choosing the studies' } },
      { f: 'reports.png', c: { ar: 'تقارير الدخل والمصاريف', en: 'Income and expense reports' } },
      { f: 'settings.png', c: { ar: 'إعدادات الأقسام والأجهزة', en: 'Department and device settings' } },
    ],
    features: [
      { icon: 'hourglass', t: { ar: 'دور عمل لكل قسم', en: 'A queue per department' }, b: { ar: 'الاستقبال يسجّل المريض، وكل قسم يراه في دوره على جهازه مع تنبيه صوتي عند وصول طلب جديد.', en: 'Reception registers the patient and each department sees them in its own queue, with a sound alert for new work.' } },
      { icon: 'monitor', t: { ar: 'أجهزة الأقسام مربوطة', en: 'Department computers linked' }, b: { ar: 'جهاز رئيسي والباقي ينضم إليه على شبكة المركز. بدون إنترنت وبدون اشتراك.', en: 'One main computer, the rest join it over the centre network. No internet, no subscription.' } },
      { icon: 'image', t: { ar: 'صور وتقارير في ملف المريض', en: 'Images and reports in the file' }, b: { ar: 'الصور وملفات PDF تُحفظ مع الزيارة بتاريخها، فتجدها بعد سنتين في ثانية.', en: 'Images and PDFs are saved with the visit and its date, so you find them in a second two years later.' } },
      { icon: 'receipt', t: { ar: 'مقبوضات ومصاريف', en: 'Income and expenses' }, b: { ar: 'سجّل مصاريف المركز من أفلام وكهرباء ورواتب، وشاهد الصافي لا المقبوضات وحدها.', en: 'Log film, electricity and salary costs, and see the net figure rather than income alone.' } },
      { icon: 'lock', t: { ar: 'تقارير الأرباح مقفلة', en: 'Profit reports locked' }, b: { ar: 'التقرير اليومي مفتوح للموظفين، وتقارير الشهر والسنة بكلمة مرور تفتح ربع ساعة ثم تُقفل.', en: 'The daily report is open to staff; monthly and yearly need a password that unlocks for fifteen minutes.' } },
      { icon: 'save', t: { ar: 'نسخ احتياطية واستعادة', en: 'Backup and restore' }, b: { ar: 'نسخة احتياطية بضغطة على فلاشة، وتُستعاد على أي جهاز آخر بالضغطة نفسها.', en: 'One-click backup to a USB stick, restored onto any other computer the same way.' } },
    ],
    extraReq: { ar: ['جهاز رئيسي وأجهزة أقسام على شبكة واحدة'], en: ['A main computer plus department computers on one network'] },
  },
];

module.exports = { brand, ui, why, steps, faq, winReq, products };
