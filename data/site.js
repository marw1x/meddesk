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
  navTutorials: { ar: 'شروحات', en: 'Tutorials' },
    tutTitle: { ar: 'شروحات البرامج', en: 'How-to videos' },
    tutBody: { ar: 'فيديو قصير لكل برنامج: الإعداد لأول مرة، الإعدادات، ويوم العمل. دقيقة واحدة وبتصير جاهز.', en: 'One short video per app: first-time setup, the settings, and a working day. About a minute each (in Arabic).' },
    tutWatch: { ar: 'شاهد', en: 'Watch' },
    tutDownload: { ar: 'تحميل الفيديو', en: 'Download video' },
    tutShare: { ar: 'أرسل الرابط على واتساب', en: 'Send the link on WhatsApp' },
    tutShareMsg: { ar: 'شرح برنامج {name} بدقيقة 👇', en: 'How to use {name}, in one minute 👇' },
    tutHelp: { ar: 'عندك سؤال بعد الفيديو؟ راسلنا على واتساب ونساعدك خطوة بخطوة.', en: 'Still have a question? Message us on WhatsApp and we will help step by step.' },
    navAndroid: { ar: 'تثبيت أندرويد', en: 'Android install' },
  navHelp: { ar: 'أسئلة شائعة', en: 'FAQ' },
  langSwitch: { ar: 'English', en: 'العربية' },

  heroTitle: {
    ar: 'برنامج لعيادتك، يعمل حتى لو انقطع الإنترنت',
    en: 'Clinic software that keeps working offline',
  },
  heroBody: {
    ar: 'أربعة برامج للعيادات ومراكز الأشعة. بياناتك تبقى على جهاز العيادة، والترخيص بدفعة واحدة.',
    en: 'Four programs for clinics and radiology centres. Your data stays on the clinic computer, and the licence is a one-time payment.',
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
  forWindows: { ar: 'ويندوز', en: 'Windows' },
  androidCta: { ar: 'تحميل تطبيق أندرويد', en: 'Download the Android app' },
  androidHint: {
    ar: 'للتابلت أو الموبايل. حمّله من الجهاز نفسه، وسيطلب أندرويد منك السماح بالتثبيت مرة واحدة.',
    en: 'For tablet or phone. Download it on the device itself; Android will ask you to allow the install once.',
  },
  androidHow: { ar: 'طريقة تثبيت تطبيق أندرويد', en: 'How to install the Android app' },
  androidInstallTitle: { ar: 'تثبيت تطبيق أندرويد', en: 'Installing the Android app' },
  androidInstallBody: {
    ar: 'التطبيق لا يأتي من متجر Google Play، لذلك يسألك أندرويد مرتين قبل تثبيته. هذا طبيعي لأي تطبيق من خارج المتجر، وليس تحذيراً من فيروس.',
    en: 'The app does not come from the Google Play store, so Android asks twice before installing it. That happens to any app from outside the store; it is not a virus warning.',
  },
  androidNote: {
    ar: 'بعد التثبيت يمكنك إطفاء «السماح من هذا المصدر» مرة ثانية من الإعدادات. بعض الأجهزة (مثل شاومي وسامسونج) تعرض فحصاً خاصاً بها بأسماء أزرار مختلفة قليلاً: اختر المتابعة أو التثبيت. وإذا تعذّر عليك شيء، راسلني وسأساعدك خطوة بخطوة.',
    en: 'After installing you can switch "Allow from this source" off again in Settings. Some phones (Xiaomi, Samsung) show their own scan with slightly different button names: choose continue or install. If anything gets stuck, message me and I will walk you through it.',
  },
  notReady: { ar: 'رابط التحميل قيد التجهيز', en: 'Download link coming soon' },
  version: { ar: 'الإصدار', en: 'Version' },
  size: { ar: 'الحجم', en: 'Size' },
  requirements: { ar: 'يعمل على', en: 'Runs on' },
  screenshots: { ar: 'من داخل البرنامج', en: 'Inside the program' },
  features: { ar: 'ما الذي يفعله', en: 'What it does' },
  backHome: { ar: 'كل البرامج', en: 'All products' },
  buyCta: { ar: 'طلب شراء الترخيص', en: 'Request a licence' },
  buyHint: {
    ar: 'رمز هذا الجهاز تجده داخل البرنامج: الإعدادات ← ترخيص البرنامج. أرسله مع الطلب ويصلك رمز التفعيل.',
    en: 'Your PC code is inside the app: Settings, then Software licence. Send it with the request and the activation code comes back to you.',
  },
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

// Installing the APK: Android asks twice for any app from outside Google Play (unknown source, then Play Protect).
// Button names are quoted as they appear on Arabic and English Android.
const androidSteps = [
  {
    t: { ar: 'نزّل التطبيق على الجهاز نفسه', en: 'Download it on the device itself' },
    b: {
      ar: 'افتح صفحة البرنامج على هذا الموقع من التابلت أو الموبايل واضغط «تحميل تطبيق أندرويد». إذا قال المتصفح إن الملف قد يكون ضاراً، اختر «التنزيل على أي حال».',
      en: 'Open the product page on this site from the tablet or phone and press "Download the Android app". If the browser says the file might be harmful, choose "Download anyway".',
    },
  },
  {
    t: { ar: 'اسمح بالتثبيت من هذا المصدر', en: 'Allow installs from this source' },
    b: {
      ar: 'افتح الملف من الإشعارات أو من «التنزيلات». سيقول أندرويد إن التثبيت من هذا المصدر غير مسموح: اضغط «الإعدادات»، فعّل «السماح من هذا المصدر»، ثم ارجع للخلف.',
      en: 'Open the file from the notification or from Downloads. Android says installs from this source are not allowed: tap "Settings", switch on "Allow from this source", then go back.',
    },
  },
  {
    t: { ar: 'مرّ من فحص Play Protect', en: 'Get past the Play Protect scan' },
    b: {
      ar: 'اضغط «تثبيت». إذا عرض Play Protect فحص التطبيق، اضغط «فحص التطبيق» وانتظر ثوانٍ ثم «تثبيت». وإذا ظهر «تم الحظر بواسطة Play Protect»، اضغط «مزيد من التفاصيل» ثم «التثبيت على أي حال».',
      en: 'Tap "Install". If Play Protect offers to scan the app, tap "Scan app", wait a few seconds, then "Install". If it says "Blocked by Play Protect", tap "More details" then "Install anyway".',
    },
  },
  {
    t: { ar: 'افتح التطبيق', en: 'Open the app' },
    b: {
      ar: 'اضغط «فتح». ليتصل بكمبيوتر العيادة، يجب أن يكون التابلت على شبكة الواي فاي نفسها المتصل بها الكمبيوتر.',
      en: 'Tap "Open". To connect to the clinic computer, the tablet must be on the same Wi-Fi network as the computer.',
    },
  },
];

const faq = [
  {
    q: { ar: 'هل أحتاج إنترنت لتشغيل البرنامج؟', en: 'Do I need internet to run it?' },
    a: {
      ar: 'للعمل اليومي لا. البرنامج يعمل كاملاً بدون إنترنت. يحتاج اتصالاً قصيراً مرة كل 90 يوماً على الأقل ليتحقق من الترخيص، ويُرسَل فيه رمز الجهاز فقط، لا أي بيانات مرضى.',
      en: 'Not for daily work. It runs completely offline. It needs a short connection at least once every 90 days to check the licence, and that check sends only the device code, never patient data.',
    },
  },
  {
    q: { ar: 'أين تُحفظ بيانات المرضى؟', en: 'Where is patient data stored?' },
    a: {
      ar: 'على جهاز العيادة نفسه. لا يُرفع شيء إلى أي خادم. يمكنك أخذ نسخة احتياطية على فلاشة بضغطة، أو تفعيل نسخ يومي إلى Google Drive أو OneDrive الخاص بعيادتك إن أردت.',
      en: 'On the clinic computer itself. Nothing is uploaded to any server. You can back up to a USB stick with one click, or switch on a daily copy to your own clinic Google Drive or OneDrive if you want one.',
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
    q: { ar: 'هل يعمل على التابلت أو الموبايل؟', en: 'Does it work on a tablet or phone?' },
    a: {
      ar: 'نعم في أسنان وجاينو ديسك وراي ديسك: لكل منها تطبيق أندرويد يتصل بكمبيوتر العيادة عبر شبكة العيادة، بدون إنترنت. كلينك ديسك يعمل على كمبيوتر ويندوز.',
      en: 'Yes for Asnaan, GynoDesk and RayDesk: each has an Android app that connects to the clinic computer over the clinic network, with no internet. Clinic Desk runs on Windows.',
    },
  },
  {
    q: { ar: 'أندرويد يقول إن التطبيق غير آمن أو محظور. ماذا أفعل؟', en: 'Android says the app is unsafe or blocked. What do I do?' },
    a: {
      ar: 'أندرويد يسأل هكذا عن أي تطبيق لا يأتي من متجر Google Play، وليس لأنه وجد فيروساً. فعّل «السماح من هذا المصدر» عندما يطلب ذلك، وعند Play Protect اختر «فحص التطبيق» ثم «تثبيت»، أو «مزيد من التفاصيل» ثم «التثبيت على أي حال». الخطوات كاملة في قسم «تثبيت تطبيق أندرويد» أعلى هذه الأسئلة وفي صفحة كل برنامج.',
      en: 'Android asks this about any app that does not come from the Google Play store, not because it found a virus. Switch on "Allow from this source" when asked, and at Play Protect choose "Scan app" then "Install", or "More details" then "Install anyway". The full steps are in "Installing the Android app" just above these questions and on each product page.',
    },
  },
  {
    q: { ar: 'هل يمكن ربط أكثر من جهاز في العيادة؟', en: 'Can I connect more than one device?' },
    a: {
      ar: 'نعم في البرامج الأربعة. جهاز واحد يكون رئيسياً والباقي، كمبيوتر أو تابلت، ينضم إليه عبر شبكة العيادة. الاستقبال والطبيب يريان الشيء نفسه في اللحظة نفسها.',
      en: 'Yes, in all four. One device is the main one and the rest, computer or tablet, join it over the clinic network. Reception and doctor see the same thing at the same moment.',
    },
  },
  {
    q: { ar: 'ماذا يحدث بعد انتهاء التجربة؟', en: 'What happens when the trial ends?' },
    a: {
      ar: 'البيانات التي أدخلتها تبقى كما هي. ترسل لي رمز الجهاز الظاهر في البرنامج، فتحصل على الترخيص الدائم وتكمل من نفس النقطة.',
      en: 'Everything you entered stays exactly as it is. Send me the device code shown in the app, get the permanent licence, and carry on from the same point.',
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

// products served as the 64-bit installer (data/downloads.json pagesArch)
const winReq64 = {
  ar: ['ويندوز 10 أو 11، 64 بت', 'ذاكرة 4 غيغابايت أو أكثر', 'مساحة فارغة 1 غيغابايت'],
  en: ['Windows 10 or 11, 64-bit', '4 GB RAM or more', '1 GB free disk space'],
};

const winReq = {
  ar: ['ويندوز 10 أو 11، 32 أو 64 بت (ملف واحد للاثنين)', 'ذاكرة 4 غيغابايت أو أكثر', 'مساحة فارغة 1 غيغابايت'],
  en: ['Windows 10 or 11, 32- or 64-bit (one file for both)', '4 GB RAM or more', '1 GB free disk space'],
};

// Screenshots live in static/shots/<slug>/<lang>-<f>.png, captured from the running apps on seeded demo
// data. A missing English file falls back to the Arabic one.
// apk: where the Android build is found, if the product has one.
const products = [
  {
    slug: 'asnaan',
    updates: true, // installed apps update themselves from the downloads site (tools/update-files.js)
    dir: 'dental-app',
    exeName: 'Asnaan Setup',
    apk: { dir: 'dental-app/dist', pattern: '^Asnaan-(\\d+\\.\\d+\\.\\d+)\\.apk$' },
    logo: 'dental-app/build/logo.png',
    name: { ar: 'أسنان', en: 'Asnaan' },
    audience: { ar: 'عيادات الأسنان', en: 'Dental clinics' },
    blurb: {
      ar: 'من الموعد إلى الإيصال: مخطط أسنان واقعي، جلسات وعمليات، مخبر، أشعة وأقراص CBCT، ووصفات بترويسة عيادتك. على الكمبيوتر والتابلت.',
      en: 'From booking to receipt: a realistic tooth chart, visits and surgery, lab work, imaging and CBCT discs, and prescriptions on your letterhead. On PC and tablet.',
    },
    shots: [
      { f: 'today', c: { ar: 'مواعيد اليوم ومن ينتظر الآن', en: "Today's appointments and who is waiting" } },
      { f: 'chart', c: { ar: 'ملف المريض ومخطط الأسنان الواقعي', en: 'The patient file and its realistic tooth chart' } },
      { f: 'appointments', c: { ar: 'التقويم والأوقات الفارغة', en: 'The calendar and free slots' } },
      { f: 'payments', c: { ar: 'الدفعات والذمم لكل مريض', en: 'Payments and balances per patient' } },
      { f: 'lab', c: { ar: 'أعمال المخبر من الإرسال إلى التركيب', en: 'Lab cases from sent to fitted' } },
    ],
    features: [
      { icon: 'scan', t: { ar: 'مخطط أسنان واقعي', en: 'Realistic tooth chart' }, b: { ar: 'تيجان وزرعات وجسور ومعالجات لبية كما تبدو في الفم، وأكثر من حالة للسن الواحد. ومخطط للأسنان اللبنية.', en: 'Crowns, implants, bridges and root canals as they look in the mouth, with more than one condition per tooth. Plus a primary-teeth chart.' } },
      { icon: 'calendar', t: { ar: 'مواعيد ومتابعة فورية', en: 'Appointments and instant follow-up' }, b: { ar: 'احجز على الأوقات الفارغة. وموعد المتابعة يُحجز في التقويم لحظة تكتب تاريخه في الجلسة.', en: 'Book into free slots. The follow-up is booked into the calendar the moment you type its date in the visit.' } },
      { icon: 'wallet', t: { ar: 'حساب واضح وذمم', en: 'Clear payments and balances' }, b: { ar: 'دفع كامل أو جزئي أو ذمة، بالليرة أو الدولار بسعر الصرف الذي تحدده، وإيصال بضغطة.', en: 'Full, partial or outstanding payment, in local currency or dollars at the rate you set, with a one-click receipt.' } },
      { icon: 'image', t: { ar: 'أشعة وأقراص CBCT', en: 'Imaging and CBCT discs' }, b: { ar: 'الصور تُربط بالسن الذي صُوّر، وقرص الـ CBCT يُنسخ كاملاً إلى ملف المريض مع برنامج عرضه.', en: 'Images are linked to the tooth they show, and a CBCT disc is copied whole into the patient file with its viewer.' } },
      { icon: 'clipboard', t: { ar: 'مخبر وعمليات جراحية', en: 'Lab work and surgery' }, b: { ar: 'تابع كل عمل مخبري بلونه وموعده. والعملية الجراحية جلسة مستقلة يُحجز بعدها موعد إزالة الخيوط.', en: 'Track each lab case with its shade and due date. Surgery is its own session type, and suture removal is booked straight after.' } },
      { icon: 'monitor', t: { ar: 'كمبيوتر وتابلت معاً', en: 'PC and tablet together' }, b: { ar: 'تطبيق أندرويد للتابلت أو الموبايل يتصل بكمبيوتر العيادة عبر شبكة العيادة. السكرتيرة تبدأ الجلسة والطبيب يجدها مفتوحة.', en: 'An Android app for tablet or phone joins the clinic PC over the clinic network. Reception opens the visit and the doctor finds it ready.' } },
    ],
    extraReq: { ar: ['تطبيق أندرويد للتابلت والموبايل'], en: ['Android app for tablet and phone'] },
  },
  {
    slug: 'gynodesk',
    updates: true, // installed apps update themselves from the downloads site (tools/update-files.js)
    dir: 'gyno-clinic-app',
    exeName: 'GynoDesk Setup',
    apk: { dir: 'gyno-clinic-app/mobile/dist', pattern: '^GynoDesk-(\\d+\\.\\d+\\.\\d+)\\.apk$' },
    logo: 'gyno-clinic-app/build/logo.png',
    name: { ar: 'جاينو ديسك', en: 'GynoDesk' },
    audience: { ar: 'النسائية والتوليد', en: 'Obstetrics and gynaecology' },
    blurb: {
      ar: 'بطاقة المشاهدة النسائية والولادية بنفس حقول ورقتك، متابعة الحمل وموعد الولادة، تحاليل وإيكو، عمليات وأتعاب، وأرشيف بطاقاتك الورقية القديمة.',
      en: 'The gynaecology and obstetric visit cards with the same fields as your paper form, pregnancy follow-up and due dates, labs and ultrasound, surgery and fees, and an archive of your old paper cards.',
    },
    shots: [
      { f: 'home', c: { ar: 'الصفحة الرئيسية: اليوم كله أمامك', en: 'The home page: the whole day at a glance' } },
      { f: 'pregnancies', c: { ar: 'كل الحوامل وموعد الولادة المتوقع', en: 'Every pregnancy with its expected delivery date' } },
      { f: 'labs', c: { ar: 'التحاليل والإيكو: طلب ونتيجة', en: 'Labs and ultrasound: order and result' } },
      { f: 'operations', c: { ar: 'العمليات الجراحية وأتعابك منها', en: 'Surgical operations and your earnings from them' } },
      { f: 'card', c: { ar: 'بطاقة المشاهدة، بنفس حقول ورقتك', en: 'The visit card, with the same fields as your paper form' } },
    ],
    features: [
      { icon: 'card', t: { ar: 'بطاقة نسائية وبطاقة ولادية', en: 'Gynaecology and obstetric cards' }, b: { ar: 'نفس حقول ورقتك: القصة، الفحص، التشخيص، التدبير. جدول متابعة حملية ومخطط مخاض، وتُطبع على A4 بشعار عيادتك.', en: 'The same fields as your paper: history, examination, diagnosis, management. An antenatal table and partogram, printed to A4 on your letterhead.' } },
      { icon: 'baby', t: { ar: 'متابعة الحمل', en: 'Pregnancy follow-up' }, b: { ar: 'موعد الولادة وعمر الحمل والثلث تُحسب من آخر طمث، وكل الحوامل ومواعيد ولادتهن في قائمة واحدة.', en: 'Due date, gestational age and trimester come from the last period, and every pregnancy sits in one list with its due date.' } },
      { icon: 'activity', t: { ar: 'تحاليل وإيكو ووصفات', en: 'Labs, ultrasound and prescriptions' }, b: { ar: 'اطلب التحليل من الجلسة ويبقى معلّقاً حتى تُدخل النتيجة. ووصفات بترويسة العيادة.', en: 'Order from inside the visit; it stays pending until you enter the result. Prescriptions print on clinic letterhead.' } },
      { icon: 'wallet', t: { ar: 'عمليات ودفعات', en: 'Surgery and payments' }, b: { ar: 'أتعاب كل عملية وحصتك منها. والسكرتيرة ترى من بانتظار الدفع وتقبض من شاشتها.', en: 'The fee and your share for each operation. Reception sees who is waiting to pay and takes payment from their own screen.' } },
      { icon: 'folderOpen', t: { ar: 'أرشيف البطاقات الورقية', en: 'Your old paper cards, archived' }, b: { ar: 'صوّر بطاقاتك القديمة وجه وظهر بالتابلت، فتصبح في ملف المريضة وتجدها برقم البطاقة. مصمّم لعشرات الآلاف.', en: 'Photograph your old cards front and back with the tablet; they land in the patient file and are found by card number. Built for tens of thousands.' } },
      { icon: 'monitor', t: { ar: 'تابلت للطبيبة والسكرتيرة', en: 'Tablets for doctor and reception' }, b: { ar: 'تطبيق أندرويد للتابلت يعمل حتى لو انقطعت الشبكة لحظياً، ثم يُزامن ما كُتب عند عودتها.', en: 'An Android tablet app that keeps working through a network drop and syncs what was entered once it is back.' } },
    ],
    extraReq: { ar: ['تطبيق أندرويد للتابلت'], en: ['Android tablet app'] },
  },
  {
    slug: 'clinic-desk',
    updates: true, // installed apps update themselves from the downloads site (tools/update-files.js)
    dir: 'general-clinic-app',
    exeName: 'Clinic Desk Setup',
    logo: 'general-clinic-app/build/logo.png',
    name: { ar: 'كلينك ديسك', en: 'Clinic Desk' },
    audience: { ar: 'كل الاختصاصات', en: 'Every specialty' },
    blurb: {
      ar: 'لعيادات الداخلية والأطفال والجلدية والعظمية والعصبية والعينية والأذنية وغيرها: غرفة انتظار، وصفات وطلبات تحاليل وأشعة، علامات حيوية وتنبيهات الحساسية.',
      en: 'For internal medicine, paediatrics, dermatology, orthopaedics, neurology, eye, ENT and more: a waiting room, prescriptions and lab and imaging requests, vital signs and allergy alerts.',
    },
    shots: [
      { f: 'queue', c: { ar: 'غرفة الانتظار: من وصل ومن بالداخل', en: 'The waiting room: who arrived and who is in' } },
      { f: 'orders', c: { ar: 'طلبات التحاليل والأشعة والوصفات', en: 'Lab and imaging requests and prescriptions' } },
      { f: 'patient', c: { ar: 'ملف المريض مع تنبيه الحساسية والأمراض المزمنة', en: 'The patient file with its allergy and chronic-condition alert' } },
      { f: 'visit', c: { ar: 'الزيارة مع العلامات الحيوية', en: 'A visit with its vital signs' } },
    ],
    features: [
      { icon: 'stethoscope', t: { ar: 'مُعدّ لاختصاصك', en: 'Set up for your specialty' }, b: { ar: 'اختر اختصاصك فيملأ البرنامج الخدمات والأدوية والتحاليل والعلامات الحيوية المناسبة له، وتعدّلها كما تريد.', en: 'Pick your specialty and it fills in the matching services, drugs, lab tests and vital signs, which you can then edit.' } },
      { icon: 'pill', t: { ar: 'وصفات تنبّهك للحساسية', en: 'Prescriptions that check allergies' }, b: { ar: 'اكتب الوصفة من قائمة أدويتك بجرعاتها، ويحذّرك البرنامج إن تعارض دواء مع حساسية مسجّلة للمريض.', en: 'Write prescriptions from your drug list with doses, and it warns you when a drug clashes with an allergy on file.' } },
      { icon: 'clipboard', t: { ar: 'طلبات تحاليل وأشعة', en: 'Lab and imaging requests' }, b: { ar: 'اطلب التحليل أو الصورة من الزيارة واطبع الطلب، وتابع النتائج المعلّقة حتى تصل.', en: 'Order a test or scan from the visit, print the request, and track pending results until they arrive.' } },
      { icon: 'activity', t: { ar: 'علامات حيوية وتنبيهات', en: 'Vital signs and alerts' }, b: { ar: 'الضغط والنبض والحرارة والوزن في كل زيارة، وشريط أحمر أعلى الملف للحساسية والأمراض المزمنة.', en: 'Blood pressure, pulse, temperature and weight on every visit, and a red strip atop the file for allergies and chronic conditions.' } },
      { icon: 'users', t: { ar: 'غرفة انتظار ومواعيد', en: 'Waiting room and appointments' }, b: { ar: 'من وصل ومن عند الطبيب ومن انتهى، ومواعيد متكررة.', en: 'Who arrived, who is with the doctor, who is done, plus recurring appointments.' } },
      { icon: 'printer', t: { ar: 'طباعة بمعاينة قبلها', en: 'Printing with a preview first' }, b: { ar: 'كل ورقة تُعاين قبل طباعتها، بترويسة عيادتك وخط وحجم تختاره. ومستودع أدوية اختياري إن كانت عيادتك تصرف.', en: 'Every sheet is previewed before it prints, on your letterhead in the font and size you choose. Plus an optional medicine store if you dispense.' } },
    ],
    extraReq: { ar: ['يمكن ربط جهاز الاستقبال وجهاز الطبيب على شبكة العيادة'], en: ['Reception and doctor computers can be linked over the clinic network'] },
  },
  {
    slug: 'raydesk',
    updates: true, // installed apps update themselves from the downloads site (tools/update-files.js)
    dir: 'xray-desk',
    exeName: 'RayDesk Setup',
    apk: { dir: 'xray-desk/dist', pattern: '^RayDesk (\\d+\\.\\d+\\.\\d+)\\.apk$' },
    logo: 'xray-desk/build/logo.png',
    name: { ar: 'راي ديسك', en: 'RayDesk' },
    audience: { ar: 'مراكز الأشعة', en: 'Radiology centres' },
    blurb: {
      ar: 'دور عمل لكل قسم على جهازه، أطباء محوّلون، صور وتقارير في ملف المريض، ومصاريف وتقارير أرباح. يعمل على شبكة المركز فقط.',
      en: 'A work queue per department on its own screen, referring doctors, images and reports in the patient file, and expenses and profit reports. Runs on the centre network only.',
    },
    shots: [
      { f: 'queue', c: { ar: 'قائمة الانتظار موزعة على الأقسام', en: 'The waiting list split across departments' } },
      { f: 'visit', c: { ar: 'تسجيل زيارة وتحديد الفحوصات', en: 'Registering a visit and choosing the studies' } },
      { f: 'patient', c: { ar: 'ملف المريض: صوره وتقاريره', en: 'The patient file: images and reports' } },
      { f: 'doctors', c: { ar: 'الأطباء المحوّلون وما حوّلوه', en: 'Referring doctors and what they sent' } },
      { f: 'services', c: { ar: 'الأقسام والخدمات والأسعار', en: 'Departments, services and prices' } },
    ],
    features: [
      { icon: 'hourglass', t: { ar: 'دور عمل لكل قسم', en: 'A queue per department' }, b: { ar: 'الاستقبال يسجّل المريض، وكل قسم يراه في دوره على جهازه مع تنبيه صوتي عند وصول طلب جديد.', en: 'Reception registers the patient and each department sees them in its own queue, with a sound alert for new work.' } },
      { icon: 'userCheck', t: { ar: 'الأطباء المحوّلون', en: 'Referring doctors' }, b: { ar: 'سجّل الطبيب المحوّل مع كل زيارة، وشاهد كم حوّل كل طبيب وماذا خلال أي فترة.', en: 'Record the referring doctor on each visit and see how much each one sent, and what, over any period.' } },
      { icon: 'image', t: { ar: 'صور وتقارير في ملف المريض', en: 'Images and reports in the file' }, b: { ar: 'الصور وملفات PDF تُحفظ مع الزيارة، والتقرير الطبي يُطبع على A4 بترويسة المركز وشعاره.', en: 'Images and PDFs are saved with the visit, and the medical report prints to A4 with the centre header and logo.' } },
      { icon: 'lock', t: { ar: 'أرباح مقفلة ومصاريف', en: 'Locked profits and expenses' }, b: { ar: 'سجّل مصاريف المركز وشاهد الصافي. تقارير الشهر والسنة بكلمة مرور، ويمكن إرسالها لبريدك تلقائياً.', en: 'Log the centre expenses and see the net. Monthly and yearly reports need a password, and can be e-mailed to you automatically.' } },
      { icon: 'monitor', t: { ar: 'أجهزة الأقسام والموبايل', en: 'Department PCs and phones' }, b: { ar: 'جهاز رئيسي والباقي ينضم إليه على شبكة المركز، مع تطبيق أندرويد للموبايل. لا شيء يُكشف على الإنترنت.', en: 'One main computer and the rest join it over the centre network, plus an Android phone app. Nothing is exposed to the internet.' } },
      { icon: 'inbox', t: { ar: 'طلبات المستلزمات', en: 'Supply requests' }, b: { ar: 'الموظفون يكتبون ما ينقص المركز من ورق ومواد، فيعرف صاحب المركز ما يشتريه.', en: 'Staff note what the centre is running short of, so the owner knows what to buy.' } },
    ],
    extraReq: { ar: ['تطبيق أندرويد للموبايل', 'جهاز رئيسي وأجهزة أقسام على شبكة واحدة'], en: ['Android phone app', 'A main computer plus department PCs on one network'] },
  },
];

module.exports = { brand, ui, why, steps, androidSteps, faq, winReq, winReq64, products };
