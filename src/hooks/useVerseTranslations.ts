import { useLanguage } from '@/contexts/LanguageContext';

// Verse translations for different languages
const verseTranslations: Record<string, Record<number, string>> = {
  en: {
    1: "In the name of Allah, the Most Gracious, the Most Merciful",
    2: "Allah - there is no deity except Him, the Ever-Living, the Self-Sustaining",
    3: "Say, O Allah, Owner of Sovereignty",
    4: "Allah is the light of the heavens and the earth",
    5: "So which of the favors of your Lord would you deny?",
    6: "Say, He is Allah, who is One",
    7: "Say, I seek refuge in the Lord of daybreak",
    8: "Say, I seek refuge in the Lord of mankind",
    9: "Allah does not burden a soul beyond that it can bear",
    10: "But if they turn away, then say, Sufficient for me is Allah"
  },
  fr: {
    1: "Au nom d'Allah, le Tout Miséricordieux, le Très Miséricordieux",
    2: "Allah - point de divinité à part Lui, le Vivant, Celui qui subsiste par lui-même",
    3: "Dis : Ô Allah, Maître de l'autorité absolue",
    4: "Allah est la lumière des cieux et de la terre",
    5: "Lequel donc des bienfaits de votre Seigneur nierez-vous?",
    6: "Dis : Il est Allah, Unique",
    7: "Dis : Je cherche protection auprès du Seigneur de l'aube naissante",
    8: "Dis : Je cherche protection auprès du Seigneur des hommes",
    9: "Allah n'impose à aucune âme une charge supérieure à sa capacité",
    10: "S'ils se détournent, dis alors : Allah me suffit"
  },
  ar: {
    1: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
    2: "اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ",
    3: "قُلِ اللَّهُمَّ مَالِكَ الْمُلْكِ",
    4: "اللَّهُ نُورُ السَّمَاوَاتِ وَالْأَرْضِ",
    5: "فَبِأَيِّ آلَاءِ رَبِّكُمَا تُكَذِّبَانِ",
    6: "قُلْ هُوَ اللَّهُ أَحَدٌ",
    7: "قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ",
    8: "قُلْ أَعُوذُ بِرَبِّ النَّاسِ",
    9: "لَا يُكَلِّفُ اللَّهُ نَفْسًا إِلَّا وُسْعَهَا",
    10: "فَإِن تَوَلَّوْا فَقُلْ حَسْبِيَ اللَّهُ"
  },
  es: {
    1: "En el nombre de Alá, el Compasivo, el Misericordioso",
    2: "Alá - no hay más divinidad que Él, el Viviente, el Subsistente",
    3: "Di: ¡Oh Alá, Dueño de la soberanía!",
    4: "Alá es la luz de los cielos y de la tierra",
    5: "¿Cuál, pues, de los beneficios de vuestro Señor negaréis?",
    6: "Di: Él es Alá, Uno",
    7: "Di: Me refugio en el Señor del alba",
    8: "Di: Me refugio en el Señor de los hombres",
    9: "Alá no impone a nadie una carga superior a sus fuerzas",
    10: "Pero si se desvían, di entonces: Me basta Alá"
  },
  de: {
    1: "Im Namen Allahs, des Allerbarmers, des Barmherzigen",
    2: "Allah - es gibt keinen Gott außer Ihm, dem Lebendigen, dem Beständigen",
    3: "Sprich: O Allah, Herrscher der Herrschaft",
    4: "Allah ist das Licht der Himmel und der Erde",
    5: "Welche der Wohltaten eures Herrn wollt ihr beide denn leugnen?",
    6: "Sprich: Er ist Allah, ein Einziger",
    7: "Sprich: Ich nehme Zuflucht zum Herrn des Morgengrauens",
    8: "Sprich: Ich nehme Zuflucht zum Herrn der Menschen",
    9: "Allah belastet keine Seele über das hinaus, was sie zu leisten vermag",
    10: "Wenn sie sich aber abwenden, dann sprich: Allah genügt mir"
  },
  ur: {
    1: "اللہ کے نام سے جو بہت مہربان، نہایت رحم والا ہے",
    2: "اللہ ہی معبود ہے، اس کے سوا کوئی معبود نہیں، وہ زندہ ہے، سب کا تھامنے والا ہے",
    3: "کہہ دیجیے: اے اللہ! اے بادشاہی کے مالک!",
    4: "اللہ آسمانوں اور زمین کا نور ہے",
    5: "پھر تم دونوں اپنے رب کی کون سی نعمت کو جھٹلاؤ گے؟",
    6: "کہہ دیجیے کہ وہ اللہ ایک ہے",
    7: "کہہ دیجیے کہ میں صبح کے رب کی پناہ مانگتا ہوں",
    8: "کہہ دیجیے کہ میں لوگوں کے رب کی پناہ مانگتا ہوں",
    9: "اللہ کسی جان پر اس کی طاقت سے زیادہ بوجھ نہیں ڈالتا",
    10: "پھر اگر وہ منہ پھیر لیں تو کہہ دیجیے کہ میرے لیے اللہ کافی ہے"
  },
  id: {
    1: "Dengan menyebut nama Allah Yang Maha Pemurah lagi Maha Penyayang",
    2: "Allah, tidak ada Tuhan selain Dia Yang Hidup kekal lagi terus menerus mengurus makhluk-Nya",
    3: "Katakanlah: Wahai Allah, Yang mempunyai kerajaan",
    4: "Allah adalah cahaya langit dan bumi",
    5: "Maka nikmat Tuhan kamu yang manakah yang kamu dustakan?",
    6: "Katakanlah: Dia-lah Allah, Yang Maha Esa",
    7: "Katakanlah: Aku berlindung kepada Tuhan yang menguasai subuh",
    8: "Katakanlah: Aku berlindung kepada Tuhan manusia",
    9: "Allah tidak membebani seseorang melainkan sesuai dengan kesanggupannya",
    10: "Jika mereka berpaling maka katakanlah: Cukuplah Allah bagiku"
  },
  tr: {
    1: "Rahman ve Rahim olan Allah'ın adıyla",
    2: "Allah ki, O'ndan başka ilah yoktur. O diridir, kaimdir",
    3: "De ki: Ey mülkün sahibi Allah!",
    4: "Allah, göklerin ve yerin nurudur",
    5: "Rabbinizin hangi nimetlerini yalanlıyorsunuz?",
    6: "De ki: O, Allah'tır, birdir",
    7: "De ki: Sabahın Rabbine sığınırım",
    8: "De ki: İnsanların Rabbine sığınırım",
    9: "Allah, hiç kimseyi gücünün yetmeyeceği şeyle yükümlü kılmaz",
    10: "Eğer yüz çevirirlerse, de ki: Bana Allah yeter"
  },
  bn: {
    1: "পরম করুণাময়, অসীম দয়ালু আল্লাহর নামে",
    2: "আল্লাহ, তিনি ছাড়া কোনো উপাস্য নেই, তিনি চিরঞ্জীব, সর্বদা রক্ষণাবেক্ষণকারী",
    3: "বলুন: হে আল্লাহ! রাজত্বের মালিক!",
    4: "আল্লাহ আকাশমণ্ডলী ও পৃথিবীর জ্যোতি",
    5: "সুতরাং তোমাদের প্রতিপালকের কোন অনুগ্রহকে তোমরা অস্বীকার করবে?",
    6: "বলুন: তিনি আল্লাহ, একক",
    7: "বলুন: আমি আশ্রয় গ্রহণ করি প্রভাতের প্রতিপালকের",
    8: "বলুন: আমি আশ্রয় গ্রহণ করি মানুষের প্রতিপালকের",
    9: "আল্লাহ কারো উপর তার সাধ্যের চেয়ে বেশি বোঝা চাপান না",
    10: "যদি তারা মুখ ফিরিয়ে নেয়, তাহলে বলুন: আমার জন্য আল্লাহই যথেষ্ট"
  },
  fa: {
    1: "به نام خداوند بخشنده مهربان",
    2: "خدا که معبودی جز او نیست، زنده و پاینده است",
    3: "بگو: ای خدا، مالک فرمانروایی!",
    4: "خدا نور آسمان‌ها و زمین است",
    5: "پس کدام‌یک از نعمت‌های پروردگارتان را انکار می‌کنید؟",
    6: "بگو: او خداست، یکی",
    7: "بگو: پناه می‌برم به پروردگار سپیده‌دم",
    8: "بگو: پناه می‌برم به پروردگار مردم",
    9: "خدا هیچ کس را جز به اندازه توانش تکلیف نمی‌کند",
    10: "اگر روی گردانیدند، بگو: خدا برای من کافی است"
  }
};

export const useVerseTranslations = () => {
  const { language } = useLanguage();
  
  const getTranslation = (verseId: number, fallbackText?: string): string => {
    const translations = verseTranslations[language] || verseTranslations.en;
    return translations[verseId] || fallbackText || `Translation not available for verse ${verseId}`;
  };

  return { getTranslation };
};