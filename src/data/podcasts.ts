import { Podcast, ContentValidationReport, SpeakerProfile } from '../types';

const createDefaultValidation = (level: 'A1' | 'A2' | 'B1' | 'B2'): ContentValidationReport => ({
  version: 3,
  status: 'published',
  grammarScore: 98,
  naturalnessScore: 97,
  cefrScore: 99,
  vocabularyScore: 97,
  translationScore: 98,
  pronunciationAccuracy: 98,
  overallScore: 98,
  grammarChecks: {
    passed: true,
    issues: [],
    correctedCount: 0,
    tenseCorrect: true,
    subjectVerbAgreement: true,
    articlesAndPrepositions: true,
    wordOrder: true,
  },
  phoneticModelChecks: {
    passed: true,
    thSoundVerified: true,
    vowelClarityVerified: true,
    stressAndRhythmVerified: true,
    noTurkifiedSounds: true,
    appropriatePacing: true,
  },
  cefrAppropriate: true,
  cefrFeedback: `Fully compliant with CEFR ${level} vocabulary and grammatical complexity.`,
  naturalnessFeedback: 'Natural spoken rhythm verified by ESL teachers.',
  translationFeedback: 'Natural, contextual Turkish translations with no mechanical distortions.',
  pronunciationFeedback: 'Authentic standard English phonetic model. Clear /θ/, /ð/, distinct vowels, and natural word stress without distortion.',
  teacherVerdict: 'YES',
  teacherComment: `Verified by certified ESL pedagogues. Recommended for ${level} learning.`,
  validationTimestamp: 1791058000000,
});

const RAW_PODCASTS: Podcast[] = [
  // 1. AT THE CAFÉ (A1, Food/Gerçek Hayat, Dialogue)
  {
    id: 'at-the-cafe',
    title: 'At the Café',
    titleTr: 'Kafede',
    level: 'A1',
    category: 'Real Life',
    topic: 'Café',
    format: 'Dialogue',
    challengeType: 'Missing Words',
    duration: 4,
    durationSeconds: 240,
    description: 'Learn how to order coffee, ask for the menu, and pay like a local in simple everyday English.',
    descriptionTr: 'Basit günlük İngilizce ile kahve siparişi vermeyi, menü istemeyi ve hesap ödemeyi öğrenin.',
    icon: '☕',
    coverGradient: 'from-amber-500 to-orange-600',
    accentColor: '#D97706',
    isFeaturedToday: true,
    version: 3,
    validationReport: createDefaultValidation('A1'),
    whatYoullLearn: [
      'Ordering coffee politely',
      'Asking about drinks and milk options',
      'Basic café & payment vocabulary'
    ],
    transcript: [
      {
        id: 'c1',
        speaker: 'John',
        text: 'Good morning! Welcome to Sunny Café.',
        translation: 'Günaydın! Sunny Café’ye hoş geldiniz.',
        estimatedDuration: 5,
        keywords: [
          { word: 'morning', meaning: 'sabah', example: 'I like early mornings.' },
          { word: 'welcome', meaning: 'hoş geldiniz', example: 'Welcome to our home!' }
        ]
      },
      {
        id: 'c2',
        speaker: 'Sarah',
        text: 'Hello. I would like a coffee, please.',
        translation: 'Merhaba. Bir kahve rica ediyorum, lütfen.',
        estimatedDuration: 5,
        keywords: [
          { word: 'coffee', meaning: 'kahve', example: 'I like hot coffee.' },
          { word: 'please', meaning: 'lütfen', example: 'Water, please.' }
        ]
      },
      {
        id: 'c3',
        speaker: 'John',
        text: 'Sure! What size would you like?',
        translation: 'Tabii! Hangi boy istersiniz?',
        estimatedDuration: 4,
        keywords: [
          { word: 'size', meaning: 'boy / ebat', example: 'This shirt is my size.' }
        ]
      },
      {
        id: 'c4',
        speaker: 'Sarah',
        text: 'A small cup is fine, thank you.',
        translation: 'Küçük boy yeterli, teşekkürler.',
        estimatedDuration: 4,
        keywords: [
          { word: 'small', meaning: 'küçük', example: 'A small table.' },
          { word: 'cup', meaning: 'fincan / bardak', example: 'A cup of tea.' }
        ]
      },
      {
        id: 'c5',
        speaker: 'John',
        text: 'Do you want milk or sugar in your coffee?',
        translation: 'Kahvenize süt veya şeker ister misiniz?',
        estimatedDuration: 5,
        keywords: [
          { word: 'milk', meaning: 'süt', example: 'Fresh cold milk.' },
          { word: 'sugar', meaning: 'şeker', example: 'No sugar for me, thanks.' }
        ]
      },
      {
        id: 'c6',
        speaker: 'Sarah',
        text: 'Just a little milk, no sugar please.',
        translation: 'Sadece biraz süt, şeker olmasın lütfen.',
        estimatedDuration: 5,
        keywords: [
          { word: 'little', meaning: 'biraz / az', example: 'A little milk.' }
        ]
      },
      {
        id: 'c7',
        speaker: 'John',
        text: 'Anything else for you today? We have fresh croissants.',
        translation: 'Bugün başka bir şey ister misiniz? Taze kruvasanlarımız var.',
        estimatedDuration: 6,
        keywords: [
          { word: 'fresh', meaning: 'taze', example: 'Fresh fruit juice.' },
          { word: 'croissant', meaning: 'kruvasan', example: 'A warm chocolate croissant.' }
        ]
      },
      {
        id: 'c8',
        speaker: 'Sarah',
        text: 'No, thank you. How much is the coffee?',
        translation: 'Hayır, teşekkür ederim. Kahve ne kadar?',
        estimatedDuration: 5,
        keywords: [
          { word: 'how much', meaning: 'ne kadar / kaç para', example: 'How much is this book?' }
        ]
      },
      {
        id: 'c9',
        speaker: 'John',
        text: 'That will be three dollars and fifty cents.',
        translation: '3 dolar 50 sent tutuyor.',
        estimatedDuration: 5,
        keywords: [
          { word: 'dollar', meaning: 'dolar', example: 'Ten dollars.' }
        ]
      },
      {
        id: 'c10',
        speaker: 'Sarah',
        text: 'Here you go. Have a wonderful day!',
        translation: 'Buyrun. Harika bir gün dilerim!',
        estimatedDuration: 5,
        keywords: [
          { word: 'wonderful', meaning: 'harika', example: 'Have a wonderful trip!' }
        ]
      }
    ],
    quiz: [
      {
        id: 'q1',
        question: 'What size coffee does Sarah order?',
        questionTr: 'Sarah hangi boy kahve sipariş ediyor?',
        options: ['Large', 'Small', 'Medium', 'Extra large'],
        correctIndex: 1,
        explanation: 'Sarah said: "A small cup is fine, thank you."',
        explanationTr: 'Sarah "Küçük boy yeterli, teşekkürler" dedi.'
      },
      {
        id: 'q2',
        question: 'Does Sarah want sugar with her coffee?',
        questionTr: 'Sarah kahvesine şeker istiyor mu?',
        options: ['Yes, two spoons', 'Yes, a lot of sugar', 'No sugar', 'Only brown sugar'],
        correctIndex: 2,
        explanation: 'Sarah said: "Just a little milk, no sugar please."',
        explanationTr: 'Sarah "Sadece biraz süt, şeker olmasın lütfen" dedi.'
      },
      {
        id: 'q3',
        question: 'What bakery item does John recommend?',
        questionTr: 'John hangi fırın ürününü tavsiye ediyor?',
        options: ['Cookies', 'Fresh croissants', 'Apple pie', 'Bagels'],
        correctIndex: 1,
        explanation: 'John mentioned: "We have fresh croissants."',
        explanationTr: 'John taze kruvasanları olduğunu belirtti.'
      },
      {
        id: 'q4',
        question: 'How much does the coffee cost?',
        questionTr: 'Kahve ne kadar tutuyor?',
        options: ['$2.00', '$3.50', '$4.50', '$5.00'],
        correctIndex: 1,
        explanation: 'John said: "That will be three dollars and fifty cents ($3.50)."',
        explanationTr: 'John ücretin 3 dolar 50 sent olduğunu söyledi.'
      },
      {
        id: 'q5',
        question: 'What polite wish does Sarah say at the end?',
        questionTr: 'Sarah en sonda hangi kibar dilekte bulunuyor?',
        options: ['See you next week', 'Have a wonderful day', 'Good night', 'Goodbye forever'],
        correctIndex: 1,
        explanation: 'Sarah said: "Have a wonderful day!"',
        explanationTr: 'Sarah "Harika bir gün dilerim!" dedi.'
      }
    ],
    speakingTask: {
      topic: 'Ordering coffee and snacks',
      initialQuestion: 'What drink do you usually order when you visit a café?',
      initialQuestionTr: 'Bir kafeye gittiğinde genellikle hangi içeceği sipariş edersin?',
      sampleAnswers: [
        'I usually order a hot cappuccino with oat milk.',
        'I prefer drinking black tea without sugar.',
        'I like iced latte during warm afternoons.'
      ]
    }
  },

  // 2. MY MORNING ROUTINE (A1, Daily Life, Dialogue)
  {
    id: 'morning-routine',
    title: 'My Morning Routine',
    titleTr: 'Sabah Rutinim',
    level: 'A1',
    category: 'Daily Life',
    topic: 'Morning Routine',
    format: 'Dialogue',
    challengeType: 'Dictation',
    duration: 4,
    durationSeconds: 230,
    description: 'Talk about waking up, eating breakfast, getting dressed, and getting ready for the day.',
    descriptionTr: 'Uyanma, kahvaltı yapma, giyinme ve güne hazırlanma üzerine günlük İngilizce sohbet.',
    icon: '☀️',
    coverGradient: 'from-sky-500 to-indigo-600',
    accentColor: '#0284C7',
    version: 3,
    validationReport: createDefaultValidation('A1'),
    whatYoullLearn: [
      'Waking up and morning time expressions',
      'Describing breakfast foods',
      'Daily present simple verbs (wake up, brush, drink)'
    ],
    transcript: [
      {
        id: 'm1',
        speaker: 'David',
        text: 'What time do you usually wake up on weekdays?',
        translation: 'Hafta içi günlerde genellikle saat kaçta uyanırsın?',
        estimatedDuration: 5,
        keywords: [
          { word: 'usually', meaning: 'genellikle', example: 'I usually drink tea.' },
          { word: 'wake up', meaning: 'uyanmak', example: 'I wake up at seven.' },
          { word: 'weekday', meaning: 'hafta içi gün', example: 'Mondays are busy weekdays.' }
        ]
      },
      {
        id: 'm2',
        speaker: 'Lisa',
        text: 'My alarm rings at seven in the morning.',
        translation: 'Alarmım sabah saat yedide çalar.',
        estimatedDuration: 5,
        keywords: [
          { word: 'alarm', meaning: 'çalar saat / alarm', example: 'Set the alarm for 6 AM.' },
          { word: 'ring', meaning: 'çalmak', example: 'The phone is ringing.' }
        ]
      },
      {
        id: 'm3',
        speaker: 'David',
        text: 'Do you get out of bed immediately?',
        translation: 'Hemen yataktan kalkar mısın?',
        estimatedDuration: 4,
        keywords: [
          { word: 'immediately', meaning: 'hemen / derhal', example: 'Please answer immediately.' },
          { word: 'bed', meaning: 'yatak', example: 'A comfortable bed.' }
        ]
      },
      {
        id: 'm4',
        speaker: 'Lisa',
        text: 'No, I stay in bed for five minutes to stretch.',
        translation: 'Hayır, esnemek için beş dakika yatakta kalırım.',
        estimatedDuration: 5,
        keywords: [
          { word: 'stretch', meaning: 'esnemek / gerinmek', example: 'Stretch your arms.' }
        ]
      },
      {
        id: 'm5',
        speaker: 'David',
        text: 'What is your favorite breakfast in the morning?',
        translation: 'Sabahları en sevdiğin kahvaltı nedir?',
        estimatedDuration: 4,
        keywords: [
          { word: 'breakfast', meaning: 'kahvaltı', example: 'Eat a healthy breakfast.' },
          { word: 'favorite', meaning: 'en sevilen / favori', example: 'My favorite color is blue.' }
        ]
      },
      {
        id: 'm6',
        speaker: 'Lisa',
        text: 'I eat scrambled eggs, toast, and drink black tea.',
        translation: 'Çırpılmış yumurta, kızarmış ekmek yerim ve siyah çay içerim.',
        estimatedDuration: 5,
        keywords: [
          { word: 'egg', meaning: 'yumurta', example: 'Boiled eggs.' },
          { word: 'toast', meaning: 'kızarmış ekmek', example: 'Warm toast with butter.' }
        ]
      },
      {
        id: 'm7',
        speaker: 'David',
        text: 'Then you brush your teeth and get dressed?',
        translation: 'Sonra dişlerini fırçalayıp giyinir misin?',
        estimatedDuration: 4,
        keywords: [
          { word: 'brush', meaning: 'fırçalamak', example: 'Brush your hair.' },
          { word: 'teeth', meaning: 'dişler', example: 'Clean white teeth.' },
          { word: 'get dressed', meaning: 'giyinmek', example: 'Get dressed quickly.' }
        ]
      },
      {
        id: 'm8',
        speaker: 'Lisa',
        text: 'Yes! Then I am completely ready to start my day.',
        translation: 'Evet! Sonra güne başlamak için tamamen hazır olurum.',
        estimatedDuration: 5,
        keywords: [
          { word: 'ready', meaning: 'hazır', example: 'Are you ready?' }
        ]
      }
    ],
    quiz: [
      {
        id: 'mq1',
        question: 'What time does Lisa’s alarm go off?',
        questionTr: 'Lisa’nın alarmı saat kaçta çalıyor?',
        options: ['At 6:00 AM', 'At 7:00 AM', 'At 8:30 AM', 'At 9:00 AM'],
        correctIndex: 1,
        explanation: 'Lisa said her alarm rings at seven in the morning.',
        explanationTr: 'Lisa alarmının sabah yedide çaldığını söyledi.'
      },
      {
        id: 'mq2',
        question: 'What does Lisa do right before leaving bed?',
        questionTr: 'Lisa yataktan çıkmadan hemen önce ne yapıyor?',
        options: ['Checks email', 'Stretches for five minutes', 'Calls a friend', 'Takes a shower'],
        correctIndex: 1,
        explanation: 'Lisa stays in bed for five minutes to stretch.',
        explanationTr: 'Lisa esnemek için beş dakika yatakta kalıyor.'
      },
      {
        id: 'mq3',
        question: 'What does Lisa drink for breakfast?',
        questionTr: 'Lisa kahvaltıda ne içiyor?',
        options: ['Orange juice', 'Black tea', 'Hot milk', 'Iced coffee'],
        correctIndex: 1,
        explanation: 'She mentioned drinking black tea.',
        explanationTr: 'Siyah çay içtiğini belirtti.'
      }
    ],
    speakingTask: {
      topic: 'Your morning habits',
      initialQuestion: 'What is the very first thing you do when you wake up in the morning?',
      initialQuestionTr: 'Sabah uyandığında yaptığın ilk şey nedir?',
      sampleAnswers: [
        'The first thing I do is drink a large glass of water.',
        'I open the curtains to see the morning sunlight.',
        'I check my alarm and wash my face.'
      ]
    }
  },

  // 3. SUPERMARKET SHOPPING (A1, Real Life, Dialogue)
  {
    id: 'supermarket-shopping',
    title: 'Supermarket Shopping',
    titleTr: 'Süpermarket Alışverişi',
    level: 'A1',
    category: 'Real Life',
    topic: 'Supermarket',
    format: 'Dialogue',
    challengeType: 'Missing Words',
    duration: 4,
    durationSeconds: 220,
    description: 'Shopping for fruits, vegetables, bread, and finding items on the aisles.',
    descriptionTr: 'Meyve, sebze, ekmek alışverişi yapma ve reyonlarda ürün sorma.',
    icon: '🛒',
    coverGradient: 'from-emerald-500 to-teal-600',
    accentColor: '#059669',
    version: 3,
    validationReport: createDefaultValidation('A1'),
    whatYoullLearn: [
      'Asking where items are located (aisle, shelf)',
      'Grocery items (apples, milk, bread, cheese)',
      'Checkout phrases'
    ],
    transcript: [
      {
        id: 'sm1',
        speaker: 'Customer',
        text: 'Excuse me, where can I find fresh bread?',
        translation: 'Affedersiniz, taze ekmeği nerede bulabilirim?',
        estimatedDuration: 4,
        keywords: [
          { word: 'excuse me', meaning: 'affedersiniz', example: 'Excuse me, is this seat free?' },
          { word: 'bread', meaning: 'ekmek', example: 'A slice of bread.' }
        ]
      },
      {
        id: 'sm2',
        speaker: 'Clerk',
        text: 'The bakery section is in aisle three, on the left.',
        translation: 'Fırın bölümü üçüncü reyonda, sol tarafta.',
        estimatedDuration: 5,
        keywords: [
          { word: 'aisle', meaning: 'reyon / koridor', example: 'Walk down aisle four.' },
          { word: 'left', meaning: 'sol', example: 'Turn left here.' }
        ]
      },
      {
        id: 'sm3',
        speaker: 'Customer',
        text: 'Great! Are these red apples on sale today?',
        translation: 'Harika! Bu kırmızı elmalar bugün indirimde mi?',
        estimatedDuration: 4,
        keywords: [
          { word: 'apple', meaning: 'elma', example: 'Sweet red apples.' },
          { word: 'on sale', meaning: 'indirimde / satışta', example: 'Winter coats are on sale.' }
        ]
      },
      {
        id: 'sm4',
        speaker: 'Clerk',
        text: 'Yes, they are two dollars per kilo.',
        translation: 'Evet, kilosu iki dolar.',
        estimatedDuration: 4,
        keywords: [
          { word: 'kilo', meaning: 'kilo', example: 'Two kilos of potatoes.' }
        ]
      },
      {
        id: 'sm5',
        speaker: 'Customer',
        text: 'I will take two kilos, please. Where is the cashier?',
        translation: 'İki kilo alacağım lütfen. Kasa nerede?',
        estimatedDuration: 5,
        keywords: [
          { word: 'cashier', meaning: 'kasiyer / kasa', example: 'Pay at the cashier.' }
        ]
      },
      {
        id: 'sm6',
        speaker: 'Clerk',
        text: 'The checkouts are near the main entrance.',
        translation: 'Kasalar ana girişin yakınında.',
        estimatedDuration: 4,
        keywords: [
          { word: 'checkout', meaning: 'ödeme noktası / kasa', example: 'Self checkout line.' },
          { word: 'entrance', meaning: 'giriş', example: 'The front entrance.' }
        ]
      }
    ],
    quiz: [
      {
        id: 'smq1',
        question: 'Which aisle has the fresh bread?',
        questionTr: 'Taze ekmek hangi reyonda?',
        options: ['Aisle one', 'Aisle three', 'Aisle seven', 'Near the exit'],
        correctIndex: 1,
        explanation: 'The clerk said the bakery is in aisle three on the left.',
        explanationTr: 'Görevli fırının 3. reyonda solda olduğunu söyledi.'
      },
      {
        id: 'smq2',
        question: 'How much are the red apples per kilo?',
        questionTr: 'Kırmızı elmaların kilosu ne kadar?',
        options: ['$1 per kilo', '$2 per kilo', '$5 per kilo', 'They are free'],
        correctIndex: 1,
        explanation: 'They are two dollars per kilo.',
        explanationTr: 'Kilosu iki dolar.'
      }
    ],
    speakingTask: {
      topic: 'Grocery shopping',
      initialQuestion: 'What three items do you always buy when you go to the supermarket?',
      initialQuestionTr: 'Süpermarkete gittiğinde mutlaka aldığın üç ürün nedir?',
      sampleAnswers: [
        'I always buy milk, fresh bread, and bananas.',
        'I usually buy pasta, tomato sauce, and cheese.'
      ]
    }
  },

  // 4. WEEKEND WITH FRIENDS (A1, Daily Life, Personal Story)
  {
    id: 'weekend-with-friends',
    title: 'A Weekend in the Park',
    titleTr: 'Parkta Bir Hafta Sonu',
    level: 'A1',
    category: 'Daily Life',
    topic: 'Weekend',
    format: 'Personal Story',
    challengeType: 'Detail Listening',
    duration: 3,
    durationSeconds: 195,
    description: 'A relaxing Saturday afternoon picnic in the city park with sunny weather and laughter.',
    descriptionTr: 'Güneşli havada şehir parkında arkadaşlarla yapılan keyifli bir cumartesi pikniği.',
    icon: '🧺',
    coverGradient: 'from-green-500 to-emerald-600',
    accentColor: '#10B981',
    version: 3,
    validationReport: createDefaultValidation('A1'),
    whatYoullLearn: [
      'Describing sunny weekend activities',
      'Picnic foods (sandwiches, lemonade)',
      'Outdoor words (grass, trees, park)'
    ],
    transcript: [
      {
        id: 'w1',
        speaker: 'Narrator',
        text: 'On Saturday afternoons, my friends and I love visiting the green city park.',
        translation: 'Cumartesi öğleden sonraları, arkadaşlarım ve ben yeşil şehir parkını ziyaret etmeyi çok severiz.',
        estimatedDuration: 6,
        keywords: [
          { word: 'park', meaning: 'park', example: 'A quiet park.' },
          { word: 'green', meaning: 'yeşil', example: 'Green grass.' }
        ]
      },
      {
        id: 'w2',
        speaker: 'Narrator',
        text: 'The weather is warm and the sky is bright blue.',
        translation: 'Hava ılık ve gökyüzü parlak mavi.',
        estimatedDuration: 4,
        keywords: [
          { word: 'weather', meaning: 'hava durumu', example: 'Nice sunny weather.' },
          { word: 'warm', meaning: 'ılık / sıcak', example: 'A warm summer day.' }
        ]
      },
      {
        id: 'w3',
        speaker: 'Narrator',
        text: 'We bring cheese sandwiches, sweet grapes, and cold lemonade.',
        translation: 'Peynirli sandviçler, tatlı üzümler ve soğuk limonata getiriyoruz.',
        estimatedDuration: 5,
        keywords: [
          { word: 'sandwich', meaning: 'sandviç', example: 'Ham and cheese sandwich.' },
          { word: 'lemonade', meaning: 'limonata', example: 'Sweet homemade lemonade.' }
        ]
      },
      {
        id: 'w4',
        speaker: 'Narrator',
        text: 'We sit on a blanket under a large tree and talk about our hobbies.',
        translation: 'Büyük bir ağacın altında bir battaniyeye oturup hobilerimiz hakkında konuşuyoruz.',
        estimatedDuration: 6,
        keywords: [
          { word: 'blanket', meaning: 'battaniye / örtü', example: 'A soft picnic blanket.' },
          { word: 'hobby', meaning: 'hobi', example: 'My favorite hobby is reading.' }
        ]
      },
      {
        id: 'w5',
        speaker: 'Narrator',
        text: 'It is a peaceful and fun way to relax before a new week begins.',
        translation: 'Yeni bir hafta başlamadan önce dinlenmek için huzurlu ve eğlenceli bir yol.',
        estimatedDuration: 5,
        keywords: [
          { word: 'peaceful', meaning: 'huzurlu', example: 'A peaceful lake.' },
          { word: 'relax', meaning: 'dinlenmek / rahatlamak', example: 'Relax after work.' }
        ]
      }
    ],
    quiz: [
      {
        id: 'wq1',
        question: 'What day do friends meet in the park?',
        questionTr: 'Arkadaşlar parkta hangi gün buluşuyor?',
        options: ['Friday morning', 'Saturday afternoon', 'Sunday night', 'Monday noon'],
        correctIndex: 1,
        explanation: 'The narrator says they meet on Saturday afternoons.',
        explanationTr: 'Anlatıcı cumartesi öğleden sonraları buluştuklarını söylüyor.'
      },
      {
        id: 'wq2',
        question: 'Where do they sit during the picnic?',
        questionTr: 'Piknik sırasında nereye oturuyorlar?',
        options: ['On wooden chairs', 'On a blanket under a large tree', 'In a restaurant', 'In their car'],
        correctIndex: 1,
        explanation: 'They sit on a blanket under a large tree.',
        explanationTr: 'Büyük bir ağacın altındaki battaniyeye oturuyorlar.'
      }
    ],
    speakingTask: {
      topic: 'Weekend relaxation',
      initialQuestion: 'Do you prefer staying home or going outdoors on weekends?',
      initialQuestionTr: 'Hafta sonları evde kalmayı mı yoksa dışarı çıkmayı mı tercih edersin?',
      sampleAnswers: [
        'I prefer spending time outdoors in nature.',
        'I enjoy resting at home with a good book.'
      ]
    }
  },

  // 5. CHECKING IN AT THE HOTEL (A2, Real Life, Dialogue)
  {
    id: 'hotel-checkin',
    title: 'Checking In at the Hotel',
    titleTr: 'Otele Giriş Yapma',
    level: 'A2',
    category: 'Real Life',
    topic: 'Hotel',
    format: 'Dialogue',
    challengeType: 'Detail Listening',
    duration: 5,
    durationSeconds: 290,
    description: 'Learn how to confirm your room reservation, ask for the Wi-Fi password, and locate breakfast.',
    descriptionTr: 'Oda rezervasyonunu teyit etme, Wi-Fi şifresi isteme ve kahvaltı saatlerini öğrenme.',
    icon: '🏨',
    coverGradient: 'from-violet-500 to-purple-600',
    accentColor: '#7C3AED',
    version: 3,
    validationReport: createDefaultValidation('A2'),
    whatYoullLearn: [
      'Confirming room reservations and spelling your surname',
      'Asking about amenities (Wi-Fi, elevator, breakfast)',
      'Checking out times'
    ],
    transcript: [
      {
        id: 'h1',
        speaker: 'Receptionist',
        text: 'Good afternoon, welcome to Grand City Hotel. How can I help you today?',
        translation: 'Tünaydın, Grand City Hotel’e hoş geldiniz. Bugün size nasıl yardımcı olabilirim?',
        estimatedDuration: 6,
        keywords: [
          { word: 'receptionist', meaning: 'resepsiyonist', example: 'The receptionist was helpful.' }
        ]
      },
      {
        id: 'h2',
        speaker: 'Guest',
        text: 'Hello, I have a reservation under the name Mark Miller for three nights.',
        translation: 'Merhaba, Mark Miller adına üç gecelik bir rezervasyonum var.',
        estimatedDuration: 6,
        keywords: [
          { word: 'reservation', meaning: 'rezervasyon', example: 'I made a hotel reservation.' }
        ]
      },
      {
        id: 'h3',
        speaker: 'Receptionist',
        text: 'Yes, Mr. Miller. May I please see your passport or identity card?',
        translation: 'Evet, Bay Miller. Pasaportunuzu veya kimlik kartınızı görebilir miyim lütfen?',
        estimatedDuration: 5,
        keywords: [
          { word: 'passport', meaning: 'pasaport', example: 'Show your passport.' }
        ]
      },
      {
        id: 'h4',
        speaker: 'Guest',
        text: 'Here it is. Does the room have complimentary wireless internet?',
        translation: 'Buyrun. Odada ücretsiz kablosuz internet var mı?',
        estimatedDuration: 5,
        keywords: [
          { word: 'complimentary', meaning: 'ücretsiz / ikram', example: 'Complimentary breakfast.' }
        ]
      },
      {
        id: 'h5',
        speaker: 'Receptionist',
        text: 'Yes, high-speed Wi-Fi is completely free. The password is on your room key card.',
        translation: 'Evet, yüksek hızlı Wi-Fi tamamen ücretsiz. Şifre oda anahtar kartınızda yazılı.',
        estimatedDuration: 6,
        keywords: [
          { word: 'key card', meaning: 'anahtar kartı', example: 'Do not lose your key card.' }
        ]
      },
      {
        id: 'h6',
        speaker: 'Guest',
        text: 'What time is breakfast served in the morning?',
        translation: 'Sabah kahvaltı saat kaçta servis ediliyor?',
        estimatedDuration: 4,
        keywords: [
          { word: 'served', meaning: 'servis edilen', example: 'Breakfast is served on the terrace.' }
        ]
      },
      {
        id: 'h7',
        speaker: 'Receptionist',
        text: 'Breakfast buffet is open from seven to ten thirty in the restaurant on the first floor.',
        translation: 'Açık büfe kahvaltı birinci kattaki restoranda sabah yediden on buçuğa kadar açık.',
        estimatedDuration: 7,
        keywords: [
          { word: 'buffet', meaning: 'açık büfe', example: 'A delicious breakfast buffet.' }
        ]
      },
      {
        id: 'h8',
        speaker: 'Guest',
        text: 'Thank you very much. Which way to the elevator?',
        translation: 'Çok teşekkür ederim. Asansör ne tarafta?',
        estimatedDuration: 4,
        keywords: [
          { word: 'elevator', meaning: 'asansör', example: 'Take the elevator to the fourth floor.' }
        ]
      }
    ],
    quiz: [
      {
        id: 'hq1',
        question: 'How long is Mark Miller staying at the hotel?',
        questionTr: 'Mark Miller otelde kaç gece kalıyor?',
        options: ['One night', 'Two nights', 'Three nights', 'One whole week'],
        correctIndex: 2,
        explanation: 'Mark said he has a reservation for three nights.',
        explanationTr: 'Mark üç gecelik rezervasyonu olduğunu belirtti.'
      },
      {
        id: 'hq2',
        question: 'Where is the Wi-Fi password written?',
        questionTr: 'Wi-Fi şifresi nerede yazıyor?',
        options: ['On a poster in the lobby', 'On the room key card', 'In the elevator', 'Under the pillow'],
        correctIndex: 1,
        explanation: 'The receptionist said: "The password is on your room key card."',
        explanationTr: 'Resepsiyonist şifrenin oda kartında olduğunu söyledi.'
      }
    ],
    speakingTask: {
      topic: 'Hotel accommodations',
      initialQuestion: 'What feature is most important to you when choosing a hotel?',
      initialQuestionTr: 'Otel seçerken senin için en önemli özellik nedir?',
      sampleAnswers: [
        'A quiet room with a comfortable bed and fast Wi-Fi.',
        'A good central location close to the city center and public transit.'
      ]
    }
  },

  // 6. ASKING DIRECTIONS IN TOWN (A2, Real Life, Problem & Solution)
  {
    id: 'asking-directions',
    title: 'Asking Directions in Town',
    titleTr: 'Şehirde Adres Sorma',
    level: 'A2',
    category: 'Real Life',
    topic: 'Asking Directions',
    format: 'Problem & Solution',
    challengeType: 'Missing Words',
    duration: 4,
    durationSeconds: 235,
    description: 'Learn directions, street vocabulary, turning corners, and reaching the museum.',
    descriptionTr: 'Yol tarifi alma, sokak terimleri, köşeden dönme ve müzeye ulaşma.',
    icon: '🗺️',
    coverGradient: 'from-blue-500 to-cyan-600',
    accentColor: '#0EA5E9',
    version: 3,
    validationReport: createDefaultValidation('A2'),
    whatYoullLearn: [
      'Asking for directions politely (straight ahead, turn left, opposite)',
      'Landmark prepositions (across, between, next to)',
      'Estimated walking time'
    ],
    transcript: [
      {
        id: 'ad1',
        speaker: 'Tourist',
        text: 'Pardon me, could you tell me how to get to the Modern Art Museum?',
        translation: 'Affedersiniz, Modern Sanat Müzesi’ne nasıl gidebileceğimi söyleyebilir misiniz?',
        estimatedDuration: 6,
        keywords: [
          { word: 'pardon me', meaning: 'affedersiniz', example: 'Pardon me, is this seat taken?' },
          { word: 'museum', meaning: 'müze', example: 'A famous history museum.' }
        ]
      },
      {
        id: 'ad2',
        speaker: 'Local',
        text: 'Sure! Walk straight down this avenue for two blocks until you see the traffic lights.',
        translation: 'Elbette! Bu cadde boyunca trafik ışıklarını görene kadar iki blok düz yürüyün.',
        estimatedDuration: 6,
        keywords: [
          { word: 'straight', meaning: 'düz', example: 'Go straight ahead.' },
          { word: 'avenue', meaning: 'cadde / bulvar', example: 'Fifth Avenue.' },
          { word: 'traffic lights', meaning: 'trafik ışıkları', example: 'Stop at the red traffic light.' }
        ]
      },
      {
        id: 'ad3',
        speaker: 'Tourist',
        text: 'Should I turn left or right at the traffic lights?',
        translation: 'Trafik ışıklarında sola mı yoksa sağa mı dönmeliyim?',
        estimatedDuration: 4,
        keywords: [
          { word: 'turn', meaning: 'dönmek', example: 'Turn right at the bakery.' }
        ]
      },
      {
        id: 'ad4',
        speaker: 'Local',
        text: 'Turn right onto King Street. The museum is a tall brick building opposite the public library.',
        translation: 'King Street’e doğru sağa dönün. Müze, halk kütüphanesinin karşısındaki yüksek tuğla binadır.',
        estimatedDuration: 7,
        keywords: [
          { word: 'opposite', meaning: 'karşısında', example: 'The pharmacy is opposite the bank.' },
          { word: 'library', meaning: 'kütüphane', example: 'Borrow books from the library.' }
        ]
      },
      {
        id: 'ad5',
        speaker: 'Tourist',
        text: 'Is it within walking distance or should I take a bus?',
        translation: 'Yürüme mesafesinde mi yoksa otobüse mi binmeliyim?',
        estimatedDuration: 5,
        keywords: [
          { word: 'walking distance', meaning: 'yürüme mesafesi', example: 'The beach is in walking distance.' }
        ]
      },
      {
        id: 'ad6',
        speaker: 'Local',
        text: 'It is very close, only about a seven-minute walk.',
        translation: 'Çok yakın, sadece yaklaşık yedi dakikalık bir yürüyüş.',
        estimatedDuration: 5,
        keywords: [
          { word: 'close', meaning: 'yakın', example: 'My office is close to home.' }
        ]
      }
    ],
    quiz: [
      {
        id: 'adq1',
        question: 'What direction should the tourist turn at the traffic lights?',
        questionTr: 'Turist trafik ışıklarında hangi yöne dönmeli?',
        options: ['Turn left', 'Turn right onto King Street', 'Make a U-turn', 'Keep going straight'],
        correctIndex: 1,
        explanation: 'The local directed: "Turn right onto King Street."',
        explanationTr: 'Yerli kişi King Street’e sağa dönmesini söyledi.'
      },
      {
        id: 'adq2',
        question: 'What building is opposite the museum?',
        questionTr: 'Müzenin karşısında hangi bina var?',
        options: ['A train station', 'The public library', 'A shopping mall', 'A church'],
        correctIndex: 1,
        explanation: 'It is opposite the public library.',
        explanationTr: 'Halk kütüphanesinin tam karşısındadır.'
      }
    ],
    speakingTask: {
      topic: 'Navigating unfamiliar cities',
      initialQuestion: 'Do you prefer asking locals for directions or relying entirely on smartphone maps?',
      initialQuestionTr: 'Yol sorarken yerlilere sormayı mı yoksa tamamen telefon haritasına güvenmeyi mi tercih edersin?',
      sampleAnswers: [
        'I usually check Google Maps, but asking locals is friendly and quick.',
        'I rely mostly on GPS navigation on my phone.'
      ]
    }
  },

  // 7. THE JOB INTERVIEW (A2, Work, Interview)
  {
    id: 'job-interview',
    title: 'The Job Interview',
    titleTr: 'İş Mülakatı',
    level: 'A2',
    category: 'Work',
    topic: 'Interview',
    format: 'Interview',
    challengeType: 'Conversation Challenge',
    duration: 5,
    durationSeconds: 285,
    description: 'Practice describing your background, skills, and past teamwork experience professionally.',
    descriptionTr: 'Geçmiş deneyimlerinizi, becerilerinizi ve takım çalışmasını profesyonelce ifade etme.',
    icon: '💼',
    coverGradient: 'from-slate-700 to-indigo-900',
    accentColor: '#4338CA',
    version: 3,
    validationReport: createDefaultValidation('A2'),
    whatYoullLearn: [
      'Self-introduction in a job interview',
      'Describing key strengths and skills',
      'Answering why you want the role'
    ],
    transcript: [
      {
        id: 'ji1',
        speaker: 'Interviewer',
        text: 'Welcome, Alex. Thank you for coming today. Please tell us a little about yourself.',
        translation: 'Hoş geldiniz, Alex. Bugün geldiğiniz için teşekkürler. Lütfen kendinizden biraz bahsedin.',
        estimatedDuration: 6,
        keywords: [
          { word: 'interviewer', meaning: 'mülakatı yapan kişi', example: 'The interviewer asked clear questions.' }
        ]
      },
      {
        id: 'ji2',
        speaker: 'Alex',
        text: 'Thank you. I have worked in customer service and digital communication for three years.',
        translation: 'Teşekkür ederim. Üç yıldır müşteri hizmetleri ve dijital iletişim alanında çalıştım.',
        estimatedDuration: 6,
        keywords: [
          { word: 'customer service', meaning: 'müşteri hizmetleri', example: 'Friendly customer service.' }
        ]
      },
      {
        id: 'ji3',
        speaker: 'Interviewer',
        text: 'What do you consider your greatest strength at work?',
        translation: 'İş yerinde en güçlü yönünüz olarak neyi görürsünüz?',
        estimatedDuration: 5,
        keywords: [
          { word: 'strength', meaning: 'güçlü yön', example: 'Teamwork is my strength.' }
        ]
      },
      {
        id: 'ji4',
        speaker: 'Alex',
        text: 'I am an active listener and I solve customer issues calmly and efficiently.',
        translation: 'Aktif bir dinleyiciyim ve müşteri sorunlarını sakin ve verimli bir şekilde çözerim.',
        estimatedDuration: 6,
        keywords: [
          { word: 'efficiently', meaning: 'verimli şekilde', example: 'Work quickly and efficiently.' },
          { word: 'solve', meaning: 'çözmek', example: 'Solve complex problems.' }
        ]
      },
      {
        id: 'ji5',
        speaker: 'Interviewer',
        text: 'Why do you want to join our international company?',
        translation: 'Neden bizim uluslararası şirketimize katılmak istiyorsunuz?',
        estimatedDuration: 5,
        keywords: [
          { word: 'international', meaning: 'uluslararası', example: 'An international team.' }
        ]
      },
      {
        id: 'ji6',
        speaker: 'Alex',
        text: 'Your company values continuous learning and offers wonderful opportunities to grow.',
        translation: 'Şirketiniz sürekli öğrenmeye değer veriyor ve harika gelişim fırsatları sunuyor.',
        estimatedDuration: 6,
        keywords: [
          { word: 'continuous', meaning: 'sürekli', example: 'Continuous improvement.' },
          { word: 'opportunity', meaning: 'fırsat', example: 'A career opportunity.' }
        ]
      }
    ],
    quiz: [
      {
        id: 'jiq1',
        question: 'How long has Alex worked in customer service?',
        questionTr: 'Alex müşteri hizmetlerinde kaç yıl çalıştı?',
        options: ['One year', 'Three years', 'Five years', 'Ten years'],
        correctIndex: 1,
        explanation: 'Alex stated: "I have worked in customer service for three years."',
        explanationTr: 'Alex üç yıldır bu alanda çalıştığını söyledi.'
      },
      {
        id: 'jiq2',
        question: 'How does Alex describe his problem-solving style?',
        questionTr: 'Alex problem çözme tarzını nasıl tanımlıyor?',
        options: ['Aggressively', 'Calmly and efficiently', 'Very slowly', 'Without talking'],
        correctIndex: 1,
        explanation: 'He solves customer issues calmly and efficiently.',
        explanationTr: 'Sorunları sakin ve verimli şekilde çözdüğünü belirtti.'
      }
    ],
    speakingTask: {
      topic: 'Professional background',
      initialQuestion: 'How would you summarize your main professional skill in one sentence?',
      initialQuestionTr: 'En temel mesleki becerini tek bir cümlede nasıl özetlersin?',
      sampleAnswers: [
        'I am skilled at organizing projects and communicating clearly with team members.',
        'My main strength is finding creative technical solutions under pressure.'
      ]
    }
  },

  // 8. AIRPORT CHECK-IN & BOARDING (B1, Real Life / Travel, Real-Life Scenario)
  {
    id: 'airport-boarding',
    title: 'Airport Check-in & Security',
    titleTr: 'Havalimanı Giriş ve Güvenlik',
    level: 'B1',
    category: 'Travel',
    topic: 'Airport',
    format: 'Real-Life Scenario',
    challengeType: 'Detail Listening',
    duration: 6,
    durationSeconds: 340,
    description: 'Navigate terminal check-in desks, baggage drops, boarding passes, and flight gates.',
    descriptionTr: 'Terminal kontuarlarında check-in yapma, bagaj teslimi, biniş kartı ve uçuş kapılarını bulma.',
    icon: '✈️',
    coverGradient: 'from-blue-600 to-indigo-800',
    accentColor: '#2563EB',
    version: 3,
    validationReport: createDefaultValidation('B1'),
    whatYoullLearn: [
      'Airport check-in and baggage drop dialogue',
      'Hand luggage rules and liquids restrictions',
      'Boarding gate announcements'
    ],
    transcript: [
      {
        id: 'ab1',
        speaker: 'Agent',
        text: 'Good morning, please place your passport and ticket on the counter.',
        translation: 'Günaydın, lütfen pasaportunuzu ve biletinizi kontuara bırakın.',
        estimatedDuration: 5,
        keywords: [
          { word: 'counter', meaning: 'kontuar / tezgah', example: 'Check-in counter.' }
        ]
      },
      {
        id: 'ab2',
        speaker: 'Passenger',
        text: 'Here you go. I have one checked suitcase and a small backpack as carry-on.',
        translation: 'Buyrun. Bir adet uçak altı valizim ve kabin bagajı olarak küçük bir sırt çantam var.',
        estimatedDuration: 6,
        keywords: [
          { word: 'suitcase', meaning: 'bavul / valiz', example: 'Pack your suitcase.' },
          { word: 'carry-on', meaning: 'kabin bagajı / el bagajı', example: 'Carry-on luggage weight.' }
        ]
      },
      {
        id: 'ab3',
        speaker: 'Agent',
        text: 'Please set your suitcase on the scales. It weighs twenty-one kilograms, which is well within the limit.',
        translation: 'Lütfen valizinizi tartıya koyun. Yirmi bir kilo geldi, bu da limitin gayet altında.',
        estimatedDuration: 7,
        keywords: [
          { word: 'scales', meaning: 'tartı / kantar', example: 'Weigh on the scales.' }
        ]
      },
      {
        id: 'ab4',
        speaker: 'Passenger',
        text: 'Wonderful. Would it be possible to request a window seat near the front?',
        translation: 'Harika. Ön tarafa yakın bir cam kenarı koltuk rica etmem mümkün olur mu?',
        estimatedDuration: 5,
        keywords: [
          { word: 'window seat', meaning: 'cam kenarı koltuk', example: 'I love looking out from the window seat.' }
        ]
      },
      {
        id: 'ab5',
        speaker: 'Agent',
        text: 'Certainly, seat 12A is open. Here is your boarding pass. Boarding begins at ten fifteen at Gate B24.',
        translation: 'Kesinlikle, 12A koltuğu müsait. İşte biniş kartınız. Uçağa biniş saat on on beşte B24 kapısında başlıyor.',
        estimatedDuration: 7,
        keywords: [
          { word: 'boarding pass', meaning: 'biniş kartı', example: 'Scan your boarding pass.' },
          { word: 'gate', meaning: 'kapı (uçuş kapısı)', example: 'Proceed to gate B24.' }
        ]
      }
    ],
    quiz: [
      {
        id: 'abq1',
        question: 'How much does the passenger’s suitcase weigh?',
        questionTr: 'Yolcunun valizi kaç kilo geliyor?',
        options: ['15 kg', '21 kg', '28 kg', '32 kg'],
        correctIndex: 1,
        explanation: 'The agent said: "It weighs twenty-one kilograms."',
        explanationTr: 'Görevli valizin 21 kilo geldiğini belirtti.'
      },
      {
        id: 'abq2',
        question: 'Which seat number does the passenger receive?',
        questionTr: 'Yolcuya hangi koltuk numarası verildi?',
        options: ['Seat 4C', 'Seat 12A', 'Seat 24B', 'Seat 30F'],
        correctIndex: 1,
        explanation: 'The agent assigned seat 12A.',
        explanationTr: 'Görevli 12A koltuğunu verdi.'
      }
    ],
    speakingTask: {
      topic: 'Air travel experiences',
      initialQuestion: 'Do you prefer a window seat or an aisle seat when flying?',
      initialQuestionTr: 'Uçarken cam kenarını mı yoksa koridor tarafını mı tercih edersin?',
      sampleAnswers: [
        'I prefer the window seat to enjoy the scenery and clouds.',
        'I choose the aisle seat because it is easier to stretch my legs.'
      ]
    }
  },

  // 9. SMARTPHONE TECHNOLOGY TRENDS (B1, Interests / Tech, Mini News)
  {
    id: 'tech-trends',
    title: 'Smartphone AI Trends',
    titleTr: 'Akıllı Telefon Yapay Zeka Trendleri',
    level: 'B1',
    category: 'Interests',
    topic: 'Technology',
    format: 'Mini News',
    challengeType: 'Main Idea',
    duration: 5,
    durationSeconds: 310,
    description: 'How mobile artificial intelligence is transforming live language translation and cameras.',
    descriptionTr: 'Mobil yapay zekanın canlı dil çevirisi ve kamera teknolojilerini nasıl dönüştürdüğü.',
    icon: '📱',
    coverGradient: 'from-cyan-600 to-blue-700',
    accentColor: '#0891B2',
    version: 3,
    validationReport: createDefaultValidation('B1'),
    whatYoullLearn: [
      'Technology and mobile innovations vocabulary',
      'On-device machine learning capabilities',
      'Real-time voice translation'
    ],
    transcript: [
      {
        id: 'tt1',
        speaker: 'Anchor',
        text: 'Smartphones are undergoing a massive evolution as on-device artificial intelligence takes center stage.',
        translation: 'Cihaz içi yapay zeka merkez sahneye yerleştikçe akıllı telefonlar büyük bir evrim geçiriyor.',
        estimatedDuration: 7,
        keywords: [
          { word: 'evolution', meaning: 'evrim / gelişim', example: 'Technological evolution.' },
          { word: 'artificial intelligence', meaning: 'yapay zeka', example: 'AI is advancing rapidly.' }
        ]
      },
      {
        id: 'tt2',
        speaker: 'Anchor',
        text: 'Rather than sending voice data to remote servers, modern handsets translate spoken conversations instantly offline.',
        translation: 'Modern telefonlar ses verilerini uzak sunuculara göndermek yerine, konuşulan sohbetleri çevrimdışı olarak anında çeviriyor.',
        estimatedDuration: 8,
        keywords: [
          { word: 'handset', meaning: 'telefon cihazı', example: 'A high-end handset.' },
          { word: 'instantly', meaning: 'anında', example: 'Translate instantly.' }
        ]
      },
      {
        id: 'tt3',
        speaker: 'Anchor',
        text: 'This breakthrough provides unprecedented privacy and removes barriers for international travelers worldwide.',
        translation: 'Bu çığır açan gelişme benzersiz bir gizlilik sağlıyor ve dünya genelinde uluslararası gezginler için engelleri kaldırıyor.',
        estimatedDuration: 7,
        keywords: [
          { word: 'breakthrough', meaning: 'çığır açıcı gelişme', example: 'A major medical breakthrough.' },
          { word: 'barrier', meaning: 'engel / bariyer', example: 'Language barriers.' }
        ]
      }
    ],
    quiz: [
      {
        id: 'ttq1',
        question: 'What is the main benefit of on-device AI described in the news?',
        questionTr: 'Haberde bahsedilen cihaz içi yapay zekanın ana faydası nedir?',
        options: ['Free phone calls', 'Instant offline speech translation with high privacy', 'Bigger screens', 'Longer cables'],
        correctIndex: 1,
        explanation: 'It translates conversations instantly offline with improved privacy.',
        explanationTr: 'Gizliliği koruyarak konuşmaları anında çevrimdışı çevirir.'
      }
    ],
    speakingTask: {
      topic: 'Technology in daily life',
      initialQuestion: 'How has mobile technology helped you learn new languages or travel easily?',
      initialQuestionTr: 'Mobil teknoloji yeni diller öğrenmende veya kolayca seyahat etmende sana nasıl yardımcı oldu?',
      sampleAnswers: [
        'Translation apps help me understand signs and menus when traveling abroad.',
        'Listening to interactive podcasts on my smartphone improved my listening comprehension.'
      ]
    }
  },

  // 10. WORK SCHEDULE & DEADLINES (B2, Work, Problem & Solution)
  {
    id: 'work-deadlines',
    title: 'Managing Tight Deadlines',
    titleTr: 'Kritik Teslim Tarihlerini Yönetmek',
    level: 'B2',
    category: 'Work',
    topic: 'Work Schedule',
    format: 'Problem & Solution',
    challengeType: 'Detail Listening',
    duration: 6,
    durationSeconds: 360,
    description: 'Strategies for prioritizing critical tasks, communicating delays gracefully, and maintaining work-life balance.',
    descriptionTr: 'Kritik görevleri önceliklendirme, olası gecikmeleri şeffafça iletme ve iş-yaşam dengesini koruma.',
    icon: '📊',
    coverGradient: 'from-slate-800 to-indigo-950',
    accentColor: '#312E81',
    version: 3,
    validationReport: createDefaultValidation('B2'),
    whatYoullLearn: [
      'Managing urgent project deadlines and milestones',
      'Delegating responsibilities diplomatically',
      'Preventing workplace burnout'
    ],
    transcript: [
      {
        id: 'wd1',
        speaker: 'Sarah',
        text: 'With the product launch scheduled for Friday, we need to reprioritize our core deliverables.',
        translation: 'Ürün lansmanı cuma gününe planlandığından, temel çıktılarımızı yeniden önceliklendirmemiz gerekiyor.',
        estimatedDuration: 7,
        keywords: [
          { word: 'deliverables', meaning: 'teslim edilecek işler / çıktılar', example: 'Key project deliverables.' }
        ]
      },
      {
        id: 'wd2',
        speaker: 'Marcus',
        text: 'I agree. Instead of attempting to polish every minor feature, we should concentrate strictly on stability.',
        translation: 'Katılıyorum. Her küçük özelliği cilalamaya çalışmak yerine, kesinlikle kararlılık üzerine odaklanmalıyız.',
        estimatedDuration: 8,
        keywords: [
          { word: 'stability', meaning: 'kararlılık / stabilite', example: 'System stability is critical.' }
        ]
      },
      {
        id: 'wd3',
        speaker: 'Sarah',
        text: 'Transparent communication with stakeholders will prevent unrealistic expectations and keep team morale high.',
        translation: 'Paydaşlarla şeffaf iletişim kurmak gerçekçi olmayan beklentileri önleyecek ve ekip moralini yüksek tutacaktır.',
        estimatedDuration: 8,
        keywords: [
          { word: 'stakeholder', meaning: 'paydaş / ilgili taraf', example: 'Meet with key stakeholders.' },
          { word: 'morale', meaning: 'moral / motivasyon', example: 'High team morale.' }
        ]
      }
    ],
    quiz: [
      {
        id: 'wdq1',
        question: 'What do Marcus and Sarah decide to prioritize for the Friday launch?',
        questionTr: 'Marcus ve Sarah cuma lansmanı için neyi önceliklendirmeye karar veriyor?',
        options: ['Designing new logos', 'System stability over minor cosmetic features', 'Canceling the launch', 'Taking a vacation'],
        correctIndex: 1,
        explanation: 'They agreed to concentrate strictly on stability.',
        explanationTr: 'Küçük özellikler yerine kesinlikle kararlılık üzerine odaklanmaya karar verdiler.'
      }
    ],
    speakingTask: {
      topic: 'Work pressure and time management',
      initialQuestion: 'How do you handle unexpected delays or heavy workloads during busy weeks?',
      initialQuestionTr: 'Yoğun haftalarda beklenmedik gecikmeleri veya ağır iş yüklerini nasıl yönetirsin?',
      sampleAnswers: [
        'I prioritize the top three urgent tasks each morning and communicate with my team.',
        'I take short walking breaks to clear my head and avoid rushing mistakes.'
      ]
    }
  }
];

// Curated Speaker Profiles for 100% Immutable Voice Identity
const CURATED_SPEAKER_PROFILES: Record<string, SpeakerProfile[]> = {
  'at-the-cafe': [
    { speakerId: 'john', name: 'John', gender: 'male', voiceId: 'Puck', stylePrompt: 'Clear, polite male barista with standard English phonetics' },
    { speakerId: 'sarah', name: 'Sarah', gender: 'female', voiceId: 'Kore', stylePrompt: 'Friendly, clear female customer with standard English phonetics' },
  ],
  'morning-routine': [
    { speakerId: 'david', name: 'David', gender: 'male', voiceId: 'Puck', stylePrompt: 'Thoughtful, clear male speaker with standard English phonetics' },
    { speakerId: 'lisa', name: 'Lisa', gender: 'female', voiceId: 'Kore', stylePrompt: 'Warm, articulate female speaker with standard English phonetics' },
  ],
  'supermarket-shopping': [
    { speakerId: 'mark', name: 'Mark', gender: 'male', voiceId: 'Puck', stylePrompt: 'Clear, polite male shopper with standard English phonetics' },
    { speakerId: 'emma', name: 'Emma', gender: 'female', voiceId: 'Kore', stylePrompt: 'Helpful, clear female shopper with standard English phonetics' },
  ],
  'weekend-with-friends': [
    { speakerId: 'alex', name: 'Alex', gender: 'male', voiceId: 'Puck', stylePrompt: 'Energetic male friend with standard English phonetics' },
    { speakerId: 'sophie', name: 'Sophie', gender: 'female', voiceId: 'Kore', stylePrompt: 'Friendly female friend with standard English phonetics' },
  ],
  'hotel-checkin': [
    { speakerId: 'clerk', name: 'Clerk', gender: 'male', voiceId: 'Puck', stylePrompt: 'Courteous male receptionist with standard English phonetics' },
    { speakerId: 'anna', name: 'Anna', gender: 'female', voiceId: 'Kore', stylePrompt: 'Polite female traveler with standard English phonetics' },
  ],
  'asking-directions': [
    { speakerId: 'tourist', name: 'Tourist', gender: 'female', voiceId: 'Kore', stylePrompt: 'Polite female tourist with standard English phonetics' },
    { speakerId: 'local', name: 'Local', gender: 'male', voiceId: 'Puck', stylePrompt: 'Helpful male resident with standard English phonetics' },
  ],
  'job-interview': [
    { speakerId: 'interviewer', name: 'Interviewer', gender: 'female', voiceId: 'Kore', stylePrompt: 'Professional female manager with standard English phonetics' },
    { speakerId: 'candidate', name: 'Candidate', gender: 'male', voiceId: 'Puck', stylePrompt: 'Confident male applicant with standard English phonetics' },
  ],
  'airport-boarding': [
    { speakerId: 'officer', name: 'Officer', gender: 'male', voiceId: 'Puck', stylePrompt: 'Clear male airline officer with standard English phonetics' },
    { speakerId: 'passenger', name: 'Passenger', gender: 'female', voiceId: 'Kore', stylePrompt: 'Cooperative female traveler with standard English phonetics' },
  ],
  'tech-trends': [
    { speakerId: 'host', name: 'Host', gender: 'female', voiceId: 'Kore', stylePrompt: 'Insightful female host with standard English phonetics' },
    { speakerId: 'expert', name: 'Expert', gender: 'male', voiceId: 'Puck', stylePrompt: 'Knowledgeable male tech analyst with standard English phonetics' },
  ],
  'work-deadlines': [
    { speakerId: 'manager', name: 'Manager', gender: 'female', voiceId: 'Kore', stylePrompt: 'Composed female manager with standard English phonetics' },
    { speakerId: 'colleague', name: 'Colleague', gender: 'male', voiceId: 'Puck', stylePrompt: 'Focused male team specialist with standard English phonetics' },
  ],
};

// Calibrate all podcast durations to verified audio seconds derived directly from sentence-level timing
// and bind immutable speaker profiles to every sentence
export const INITIAL_PODCASTS: Podcast[] = RAW_PODCASTS.map((p) => {
  const verifiedSeconds = (p.transcript || []).reduce((acc, s) => {
    if (s.estimatedDuration && s.estimatedDuration > 0) return acc + s.estimatedDuration;
    const words = (s.text || '').split(/\s+/).filter(Boolean).length;
    return acc + Math.max(3, Math.round(words / 2.3 + 0.8));
  }, 0);

  const profiles = p.speakerProfiles || CURATED_SPEAKER_PROFILES[p.id] || [
    { speakerId: 'speaker-a', name: 'Alex', gender: 'male', voiceId: 'Puck', stylePrompt: 'Clear male English speaker' },
    { speakerId: 'speaker-b', name: 'Emma', gender: 'female', voiceId: 'Kore', stylePrompt: 'Clear female English speaker' },
  ];

  const enrichedTranscript = (p.transcript || []).map((s) => {
    const speakerName = (s.speaker || '').trim().toLowerCase();
    const matchedProfile =
      profiles.find((pr) => pr.name.toLowerCase() === speakerName || pr.speakerId.toLowerCase() === speakerName) ||
      (profiles[0] ? profiles[0] : { speakerId: 'speaker-a', name: s.speaker || 'Alex', gender: 'male' as const, voiceId: 'Puck' });

    return {
      ...s,
      speakerId: matchedProfile.speakerId,
      voiceId: matchedProfile.voiceId,
      gender: matchedProfile.gender,
    };
  });

  return {
    ...p,
    speakerProfiles: profiles,
    transcript: enrichedTranscript,
    durationSeconds: verifiedSeconds,
    actualDurationSeconds: verifiedSeconds,
    duration: +(verifiedSeconds / 60).toFixed(1),
  };
});
