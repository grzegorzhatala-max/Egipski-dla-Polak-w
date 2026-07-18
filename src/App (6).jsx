import { useState, useEffect, useMemo, useRef, createContext, useContext } from "react";
import { Plus, Palette, GraduationCap, Trash2, Shuffle, BookOpen, ListChecks, X, Check, RotateCw, Upload, Flag, Pencil, Hash, HelpCircle, Puzzle, MessageSquare, MessagesSquare, List, PenLine, TrendingUp } from "lucide-react";

// ---------- Domyślny zestaw słówek (50 fraz, na podst. "50 Essential Egyptian Arabic Phrases") ----------
const SEED_WORDS = [
  {
    cat: "basics",
    pl: "Witaj!",
    en: "Hi! / Welcome!",
    ar: "أهلًا!",
    ph: "ahlan!",
    ex: { ar: "أهلًا! ايه الأخبار؟", ph: "ahlan! ee(h) (e)l2akhbaar?", pl: "Witaj! Co słychać?", en: "Hi! What's up?" },
  },
  {
    cat: "basics",
    pl: "dziękuję",
    en: "thank you",
    ar: "شكرًا!",
    ph: "shokran!",
    ex: { ar: "شكرًا أوي على مساعدتك!", ph: "shokran 2awi 3ala mosa3detak!", pl: "Bardzo dziękuję za pomoc!", en: "Thank you so much for your help!" },
  },
  {
    cat: "basics",
    pl: "proszę (do mężczyzny/kobiety)",
    en: "please (to m./f.)",
    ar: "من فضلك / فضلِك",
    ph: "men faDlak/ek",
    ex: { ar: "واحد قهوة، من فضلِك.", ph: "waaHed 2ahwa, men faDlek.", pl: "Jedna kawa, proszę.", en: "One coffee, please." },
  },
  {
    cat: "basics",
    pl: "przepraszam / proszę (do mężczyzny/kobiety)",
    en: "excuse me / please (to m./f.)",
    ar: "لو سمحت / سمحتي",
    ph: "law samaHt/i",
    ex: { ar: "لو سمحتي، فين الحمّام؟", ph: "law samaHti, feen elHammaam?", pl: "Przepraszam (do kobiety), gdzie jest toaleta?", en: "Excuse me (to f.), where's the toilet?" },
  },
  {
    cat: "basics",
    pl: "tak / nie",
    en: "yes / no",
    ar: "آه / لا",
    ph: "aa(h) / la2",
    ex: { ar: "آه، عايزين حاجة حلوة. / لا، شكرًا.", ph: "aa(h) 3ayziin Haaga Helwa. / la, shokran.", pl: "Tak, chcielibyśmy deser. / Nie, dziękuję.", en: "Yes, we'd like dessert. / No, thank you." },
  },
  {
    cat: "basics",
    pl: "jak się masz? (do mężczyzny/kobiety)",
    en: "how are you? (to m./f.)",
    ar: "ازايك / ازايِك؟",
    ph: "ezzayyak/ek?",
    ex: { ar: "ازايِك النهاردة؟", ph: "ezzayyek ennahaarda?", pl: "Jak się masz (do kobiety) dzisiaj?", en: "How are you (to f.) today?" },
  },
  {
    cat: "basics",
    pl: "nazywam się...",
    en: "my name is...",
    ar: "اسمي...",
    ph: "esmi…",
    ex: { ar: "اسمي مريم.", ph: "esmi maryam.", pl: "Nazywam się Maryam.", en: "My name is Maryam." },
  },
  {
    cat: "basics",
    pl: "miło mi cię poznać",
    en: "nice to meet you",
    ar: "اتشرفنا",
    ph: "etsharrafna",
    ex: { ar: "اتشرفنا يا علي. الشرف ليّا يا محمود.", ph: "etsharrafna ya 3ali. eshsharaf leyya ya maHmuud.", pl: "Miło mi, Ali. Mnie również, Mahmoud (standardowa odpowiedź).", en: "Nice to meet you, Ali. Likewise, Mahmoud (standard reply)." },
  },
  {
    cat: "questions",
    pl: "gdzie jest/są...?",
    en: "where is/are...?",
    ar: "فين...؟",
    ph: "feen…?",
    ex: { ar: "فين محطة القطر؟", ph: "feen maHaTTet el2aTr?", pl: "Gdzie jest stacja kolejowa?", en: "Where's the train station?" },
  },
  {
    cat: "questions",
    pl: "ile to kosztuje?",
    en: "how much is it?",
    ar: "بكام؟",
    ph: "bekaam?",
    ex: { ar: "بكام دا، لو سمحت؟", ph: "bekaam da, law samaHt?", pl: "Ile to kosztuje, proszę (do mężczyzny)?", en: "How much is it, please (to m.)?" },
  },
  {
    cat: "questions",
    pl: "mówisz po angielsku? (do mężczyzny/kobiety)",
    en: "do you speak English? (to m./f.)",
    ar: "بتتكلم / بتتكلمي انجليزي؟",
    ph: "betetkallem/i engeliizi?",
    ex: { ar: "لو سمحت، بتتكلم انجليزي؟", ph: "law samaHt, betetkallem engeliizi?", pl: "Przepraszam, mówi pan po angielsku?", en: "Excuse me, do you speak English?" },
  },
  {
    cat: "questions",
    pl: "chcę / chciałbym (m./ż.)",
    en: "I want / I'd like (m./f.)",
    ar: "عايز / عايزة",
    ph: "3aayez/3ayza",
    ex: { ar: "عايز ترابيزة لفردين، من فضلك.", ph: "3aayez tarabeeza l(e)fardeen, men faDlak.", pl: "Chcę stolik dla dwóch osób, proszę.", en: "I'd like a table for two, please." },
  },
  {
    cat: "basics",
    pl: "do zobaczenia (m./ż./l.mn.)",
    en: "see you (m./f./pl.)",
    ar: "اشوفك / اشوفِك / اشوفكو",
    ph: "ashuufak/ek / ashofku",
    ex: { ar: "اشوفكو على خير، ان شاء الله.", ph: "ashofku 3ala kheer, enshaa2allaa(h).", pl: "Do zobaczenia w dobrym zdrowiu, da Bóg (popularne wyrażenie).", en: "See you in good health, God willing (a common phrase)." },
  },
  {
    cat: "food_shopping",
    pl: "smacznego / dobre zdrowie po jedzeniu",
    en: "bon appétit / good health after eating",
    ar: "بالهنا والشفا",
    ph: "belhana we (e)shshefa",
    ex: { ar: "بالهنا والشفا يا حبيبي.", ph: "belhana we (e)shshefa ya Habiibi.", pl: "Smacznego, kochanie.", en: "Bon appétit, dear." },
  },
  {
    cat: "basics",
    pl: "przykro mi (m./ż.)",
    en: "I'm sorry (m./f.)",
    ar: "آسف / أسفة",
    ph: "aasef/asfa",
    ex: { ar: "آسف على التأخير.", ph: "aasef 3ala (e)tta2kheer.", pl: "Przepraszam za spóźnienie.", en: "Sorry I'm late." },
  },
  {
    cat: "basics",
    pl: "nie rozumiem (m./ż.)",
    en: "I don't understand (m./f.)",
    ar: "مش فاهم / فاهمة",
    ph: "mesh faahem/fahma",
    ex: { ar: "انا آسف، مش فاهم.", ph: "ana aasef, mesh faahem.", pl: "Przykro mi (m.), nie rozumiem.", en: "I'm sorry (m.), I don't understand." },
  },
  {
    cat: "basics",
    pl: "możesz mi pomóc? (do mężczyzny/kobiety)",
    en: "can you help me? (to m./f.)",
    ar: "ممكن تساعدني / تساعديني؟",
    ph: "momken tesa3edni/tesa3diini?",
    ex: { ar: "فيه مشكلة. ممكن تساعدني؟", ph: "fii(h) moshkela. momken tesa3edni?", pl: "Jest problem. Mógłbyś (m.) mi pomóc?", en: "There's a problem. Could you (m.) help me?" },
  },
  {
    cat: "questions",
    pl: "która jest godzina?",
    en: "what time is it?",
    ar: "الساعة كام؟",
    ph: "essaa3a kaam?",
    ex: { ar: "الساعة كام، لو سمحت؟", ph: "essaa3a kaam, law samaHt?", pl: "Która jest godzina, proszę (do mężczyzny)?", en: "What time is it, please (to m.)?" },
  },
  {
    cat: "questions",
    pl: "gdzie mieszkasz? (do mężczyzny/kobiety)",
    en: "where do you live? (to m./f.)",
    ar: "انت عايش / انتي عايشة فين؟",
    ph: "enta 3aayesh / enti 3aysha feen?",
    ex: { ar: "انا نسيت. حضرتك عايش فين؟", ph: "ana neseet. HaDretak 3aayesh feen?", pl: "Zapomniałem. Gdzie pan mieszka?", en: "I forgot. Where do you live?" },
  },
  {
    cat: "basics",
    pl: "dzień dobry",
    en: "good morning",
    ar: "صباح الخير",
    ph: "SabaaH el-kheer",
    ex: { ar: "صباح الخير! صباح النور!", ph: "SabaaH el-kheer! SabaaH ennuur!", pl: "Dzień dobry! Dzień dobry! (standardowa odpowiedź)", en: "Good morning! Good morning! (standard reply)" },
  },
  {
    cat: "basics",
    pl: "do widzenia",
    en: "goodbye",
    ar: "سالم!",
    ph: "salaam!",
    ex: { ar: "سالم! اشوفك بكرة!", ph: "salaam! ashuufak bokra!", pl: "Cześć! Do zobaczenia jutro!", en: "Hi! See you tomorrow!" },
  },
  {
    cat: "basics",
    pl: "dobry wieczór",
    en: "good evening",
    ar: "مساء الخير",
    ph: "masaa2 el-kheer",
    ex: { ar: "مساء الخير! مساء النور!", ph: "masaa2 el-kheer! masaa2 ennuur!", pl: "Dobry wieczór! Dobry wieczór! (standardowa odpowiedź)", en: "Good evening! Good evening! (standard reply)" },
  },
  {
    cat: "basics",
    pl: "dobranoc (do mężczyzny/kobiety)",
    en: "good night (to m./f.)",
    ar: "تصبح / تصبحي على خير",
    ph: "teSbaH/i 3ala kheer",
    ex: { ar: "تصبحي على خير. وانتي من أهله.", ph: "teSbaHi 3ala kheer. we (e)nti men 2ahlu.", pl: "Dobranoc (do kobiety). Dobranoc (standardowa odpowiedź).", en: "Good night (to f.). Good night (standard reply)." },
  },
  {
    cat: "basics",
    pl: "oczywiście",
    en: "of course",
    ar: "أكيد",
    ph: "akiid",
    ex: { ar: "بتحب العربي؟ أكيد.", ph: "betHebb el3arabi? akiid.", pl: "Kochasz arabski? Oczywiście.", en: "Do you love Arabic? Of course." },
  },
  {
    cat: "basics",
    pl: "może",
    en: "maybe",
    ar: "يمكن",
    ph: "yemken",
    ex: { ar: "يمكن آجي بكرة.", ph: "yemken aagi bokra.", pl: "Może przyjdę jutro.", en: "Maybe I'll come tomorrow." },
  },
  {
    cat: "basics",
    pl: "nic się nie stało / przykro mi (mniej formalne niż „aasef”)",
    en: "no worries / sorry (less formal than aasef)",
    ar: "معلش",
    ph: "ma3lesh",
    ex: { ar: "كان يوم صعب النهاردة. معلش.", ph: "kaan yoom Sa3b ennahaarda. ma3lesh.", pl: "To był trudny dzień. Przykro mi.", en: "It was a hard day. I'm sorry." },
  },
  {
    cat: "basics",
    pl: "uważaj na siebie (do mężczyzny/kobiety)",
    en: "take care (to m./f.)",
    ar: "خلي بالك من نفسك / خلي بالِك من نفسِك",
    ph: "5alli baalak men nafsak / 5alli baalek men nafsek",
    ex: { ar: "الوقت متأخر. خلي بالك من نفسك.", ph: "elwa2t met2akhkhar. 5alli baalak men nafsak.", pl: "Jest późno. Uważaj na siebie (m.).", en: "It's late. Take care (m.)." },
  },
  {
    cat: "basics",
    pl: "gratulacje",
    en: "congratulations",
    ar: "مبروك",
    ph: "mabruuk",
    ex: { ar: "مبروك الشقة الجديدة.", ph: "mabruuk eshsha22a (e)ggediida.", pl: "Gratulacje z powodu nowego mieszkania.", en: "Congratulations on the new apartment." },
  },
  {
    cat: "basics",
    pl: "wszystkiego dobrego (z okazji święta/urodzin)",
    en: "best wishes (holiday/birthday)",
    ar: "كل سنة وانت طيب / وانتي طيبة",
    ph: "koll sana we (e)nta Tayyeb/(e)nti Tayyeba",
    ex: { ar: "رمضان بكرة. كل سنة وانت طيب. وانت طيب!", ph: "ramaDaan bokra. koll sana we (e)nta Tayyeb. we (e)nta Tayyeb!", pl: "Ramadan jest jutro. Wszystkiego dobrego. Tobie również! (standardowa odpowiedź)", en: "Ramadan is tomorrow. Best wishes. To you too! (standard reply)" },
  },
  {
    cat: "basics",
    pl: "szczęśliwego Ramadanu",
    en: "happy Ramadan",
    ar: "رمضان كريم",
    ph: "ramaDaan kariim",
    ex: { ar: "رمضان كريم. رمضان كريم وهللا أكرم.", ph: "ramaDaan kariim. ramaDaan kariim wallaahu akram.", pl: "Ramadan jest dobry. Ramadan jest dobry, a Bóg jest jeszcze lepszy (standardowa odpowiedź).", en: "Ramadan is good. Ramadan is good, and God is even better (standard reply)." },
  },
  {
    cat: "basics",
    pl: "da Bóg",
    en: "God willing",
    ar: "ان شاء هللا",
    ph: "enshaa2allaa(h)",
    ex: { ar: "اشوفك الحد، ان شاء هللا.", ph: "ashuufak elHadd, enshaa2allaa(h).", pl: "Do zobaczenia w niedzielę, da Bóg.", en: "See you on Sunday, God willing." },
  },
  {
    cat: "basics",
    pl: "dzięki Bogu",
    en: "thank God",
    ar: "الحمد لله",
    ph: "elHamdulellaa(h)",
    ex: { ar: "ازايك؟ كويس، الحمد لله.", ph: "ezzayyak? kowayyes, elHamdulellaa(h).", pl: "Jak się masz? Dobrze, dzięki Bogu.", en: "How are you? Fine, thank God." },
  },
  {
    cat: "basics",
    pl: "miłego wolnego/urlopu",
    en: "enjoy your day off",
    ar: "أجازة سعيدة",
    ph: "agaaza sa3iida",
    ex: { ar: "أجازة سعيدة! شكرًا!", ph: "agaaza sa3iida! shokran!", pl: "Miłego weekendu! Dziękuję!", en: "Have a nice weekend! Thanks!" },
  },
  {
    cat: "basics",
    pl: "wszystkiego dobrego (do chorego)",
    en: "get well soon",
    ar: "ألف سالمة",
    ph: "alf salaama",
    ex: { ar: "سمعت انك مريض. ألف سالمة.", ph: "seme3t ennak mariiD. alf salaama.", pl: "Słyszałem, że byłeś chory. Wszystkiego dobrego.", en: "I heard you were sick. Get well soon." },
  },
  {
    cat: "basics",
    pl: "w porządku",
    en: "okay / fine",
    ar: "تمام",
    ph: "tamaam",
    ex: { ar: "هنتقابل الساعة سبعة. تمام.", ph: "hante2aabel essaa3a sab3a. tamaam.", pl: "Spotkamy się o siódmej. W porządku.", en: "We'll meet at seven. Okay." },
  },
  {
    cat: "basics",
    pl: "kocham cię (do mężczyzny/kobiety)",
    en: "I love you (to m./f.)",
    ar: "بحبك / بحبِك",
    ph: "baHebbak/ek",
    ex: { ar: "بحبِك. وانا كمان.", ph: "baHebbek. wa (a)na kamaan.", pl: "Kocham cię (kobietę). Ja też.", en: "I love you (to f.). Me too." },
  },
  {
    cat: "feelings",
    pl: "jestem zmęczony/a",
    en: "I'm tired",
    ar: "انا تعبان / تعبانة",
    ph: "ana ta3baan/a",
    ex: { ar: "انا تعبانة أوي النهاردة.", ph: "ana ta3baana awi (e)nnahaarda.", pl: "Jestem bardzo zmęczona dzisiaj.", en: "I'm very tired today." },
  },
  {
    cat: "feelings",
    pl: "jestem głodny/a",
    en: "I'm hungry",
    ar: "انا جعان / جعانة",
    ph: "ana ga3aan/a",
    ex: { ar: "انا جعان أوي. الغدا امتى؟", ph: "ana ga3aan awi. el8ada emta?", pl: "Jestem bardzo głodny. Kiedy jest obiad?", en: "I'm very hungry. When's lunch?" },
  },
  {
    cat: "feelings",
    pl: "potrzebuję (m./ż.)",
    en: "I need (m./f.)",
    ar: "انا محتاج / محتاجة",
    ph: "ana meHtaag/a",
    ex: { ar: "انا محتاجة مساعدة.", ph: "ana meHtaaga mosa3da.", pl: "Potrzebuję (kobieta) pomocy.", en: "I (f.) need help." },
  },
  {
    cat: "feelings",
    pl: "zgubiłem/am się (m./ż.)",
    en: "I'm lost (m./f.)",
    ar: "انا تايه / تايهة",
    ph: "ana taayeh/tayha",
    ex: { ar: "لو سمحت، انا تايه. ممكن تساعدني؟", ph: "law samaHt, ana taayeh. momken tesa3edni?", pl: "Przepraszam, zgubiłem się. Mógłbyś mi pomóc?", en: "Excuse me, I'm lost. Could you help me?" },
  },
  {
    cat: "basics",
    pl: "wszystko w porządku?",
    en: "is everything okay?",
    ar: "كله تمام؟",
    ph: "kollu tamaam?",
    ex: { ar: "شكلِك زعلانة. كله تمام؟", ph: "shaklek za3laana. kollu tamaam?", pl: "Wyglądasz smutno. Wszystko w porządku?", en: "You look sad. Is everything okay?" },
  },
  {
    cat: "feelings",
    pl: "jestem zadowolony/a",
    en: "I'm happy",
    ar: "مبسوط / مبسوطة",
    ph: "mabSuuT/a",
    ex: { ar: "انا مبسوطة أوي عشان النهاردة أجازة.", ph: "ana mabSuuTa awi 3ashaan ennahaarda agaaza.", pl: "Jestem bardzo zadowolona, bo dziś wolne.", en: "I'm very happy because today's a day off." },
  },
  {
    cat: "basics",
    pl: "doskonale, świetnie",
    en: "excellent, great",
    ar: "ممتاز",
    ph: "momtaaz",
    ex: { ar: "الجو ايه؟ ممتاز!", ph: "eggaww ee(h)? momtaaz!", pl: "Jaka jest pogoda? Świetna!", en: "What's the weather like? Great!" },
  },
  {
    cat: "basics",
    pl: "nie szkodzi (do mężczyzny/kobiety)",
    en: "never mind (to m./f.)",
    ar: "ولا يهمك / يهمِك",
    ph: "wala y(e)hemmak/ek",
    ex: { ar: "آسف. ولا يهمك.", ph: "aasef. wala y(e)hemmak.", pl: "Przepraszam. Nie szkodzi (m.).", en: "Sorry. Never mind (m.)." },
  },
  {
    cat: "basics",
    pl: "jak się nazywasz? (do mężczyzny/kobiety)",
    en: "what's your name? (to m./f.)",
    ar: "اسمك / اسمِك ايه؟",
    ph: "esmak/ek ee(h)?",
    ex: { ar: "اسمِك ايه؟ ليلى.", ph: "esmek ee(h)? layla.", pl: "Jak się nazywasz (kobieta)? Layla.", en: "What's your name (f.)? Layla." },
  },
  {
    cat: "basics",
    pl: "no chodź, dalej",
    en: "come on, let's go",
    ar: "يالا",
    ph: "yalla",
    ex: { ar: "يالا ناكل.", ph: "yalla naakol.", pl: "Chodźmy jeść.", en: "Let's go eat." },
  },
  {
    cat: "basics",
    pl: "nie ma problemu",
    en: "no problem",
    ar: "مفيش مشكلة",
    ph: "mafiish moshkela",
    ex: { ar: "آسف على التأخير. مفيش مشكلة.", ph: "aasef 3ala (e)tta2kheer. mafiish moshkela.", pl: "Przepraszam za spóźnienie. Nie ma problemu.", en: "Sorry I'm late. No problem." },
  },
  {
    cat: "basics",
    pl: "jestem gotowy/a",
    en: "I'm ready",
    ar: "انا جاهز / جاهزة",
    ph: "ana gaahez/gahza",
    ex: { ar: "انا جاهز. يالا بينا.", ph: "ana gaahez. yalla biina.", pl: "Jestem gotowy. Chodźmy.", en: "I'm ready. Let's go." },
  },
  {
    cat: "basics",
    pl: "nie ma za co",
    en: "you're welcome",
    ar: "عفوًا",
    ph: "3afwan",
    ex: { ar: "شكرًا! عفوًا.", ph: "shokran! 3afwan.", pl: "Dziękuję! Nie ma za co.", en: "Thank you! You're welcome." },
  },
  {
    cat: "basics",
    pl: "skąd jesteś? (formalnie, do mężczyzny/kobiety)",
    en: "where are you from? (formal, to m./f.)",
    ar: "حضرتك / حضرتِك منين؟",
    ph: "HaDretak/ek meneen?",
    ex: { ar: "حضرتِك منين؟ انا من مصر.", ph: "HaDretek meneen? ana men maSr.", pl: "Skąd pani jest? Jestem z Egiptu.", en: "Where are you from? I'm from Egypt." },
  },
  {
    cat: "basics",
    pl: "duże drzwi",
    en: "a big door",
    ar: "الباب الكبير",
    ph: "il-baab il-kibiir",
    ex: { ar: "الباب الكبير ده.", ph: "il-baab il-kibiir da.", pl: "To są duże drzwi.", en: "This is a big door." },
  },
  {
    cat: "basics",
    pl: "nie mam (czegoś)",
    en: "I don't have (something)",
    ar: "معنديش",
    ph: "ma3andiish",
    ex: { ar: "معنديش فلوس.", ph: "ma3andiish fuluus.", pl: "Nie mam pieniędzy.", en: "I don't have money." },
  },
  {
    cat: "basics",
    pl: "mam (coś)",
    en: "I have (something)",
    ar: "عندي",
    ph: "3andi",
    ex: { ar: "عندي مشكلة.", ph: "3andi moshkela.", pl: "Mam problem.", en: "I have a problem." },
  },
  {
    cat: "basics",
    pl: "nie ma / nie istnieje",
    en: "there isn't / doesn't exist",
    ar: "مافيش",
    ph: "mafiish",
    ex: { ar: "مافيش مشكلة.", ph: "mafiish moshkela.", pl: "Nie ma problemu.", en: "No problem." },
  },
  {
    cat: "basics",
    pl: "jest / są (coś istnieje)",
    en: "there is / are",
    ar: "فيه",
    ph: "fiih",
    ex: { ar: "فيه مشكلة.", ph: "fiih moshkela.", pl: "Jest problem.", en: "There's a problem." },
  },
  {
    cat: "numbers_time",
    pl: "która godzina jest teraz, proszę?",
    en: "what time is it now, please?",
    ar: "الساعة كام دلوقتي من فضلك؟",
    ph: "essaa3a kaam dilwa2ti min faDlak?",
    ex: { ar: "الساعة كام دلوقتي من فضلك؟ الساعة سبعة.", ph: "essaa3a kaam dilwa2ti min faDlak? essaa3a sab3a.", pl: "Która godzina teraz, proszę? Jest siódma.", en: "What time is it now, please? It's seven." },
  },
  {
    cat: "numbers_time",
    pl: "pół godziny",
    en: "half an hour",
    ar: "نص ساعة",
    ph: "nuSS saa3a",
    ex: { ar: "هوصل بعد نص ساعة.", ph: "hawSal ba3d nuSS saa3a.", pl: "Przyjedę za pół godziny.", en: "I'll come in half an hour." },
  },
  {
    cat: "home_hotel",
    pl: "pokój",
    en: "room",
    ar: "أوضة",
    ph: "2uDa",
    ex: { ar: "عايز أوضة لفردين.", ph: "3aayez 2uDa l(e)fardeen.", pl: "Chcę pokój dla dwóch osób.", en: "I want a room for two." },
  },
  {
    cat: "home_hotel",
    pl: "hotel",
    en: "hotel",
    ar: "فندق",
    ph: "fundu2",
    ex: { ar: "الفندق ده كويس أوي.", ph: "el-fundu2 da kowayyes awi.", pl: "Ten hotel jest bardzo dobry.", en: "This hotel is very good." },
  },
  {
    cat: "home_hotel",
    pl: "łazienka",
    en: "bathroom",
    ar: "حمّام",
    ph: "Hammaam",
    ex: { ar: "فين الحمّام، لو سمحت؟", ph: "feen el-Hammaam, law samaHt?", pl: "Gdzie jest łazienka, proszę?", en: "Where's the bathroom, please?" },
  },
  {
    cat: "home_hotel",
    pl: "klucz",
    en: "key",
    ar: "مفتاح",
    ph: "muftaaH",
    ex: { ar: "ده مفتاح الأوضة.", ph: "da muftaaH el-2uDa.", pl: "To jest klucz do pokoju.", en: "This is the room key." },
  },
  {
    cat: "home_hotel",
    pl: "okno",
    en: "window",
    ar: "شباك",
    ph: "shibbaak",
    ex: { ar: "الشباك ده كبير.", ph: "esh-shibbaak da kibiir.", pl: "To okno jest duże.", en: "This window is big." },
  },
  {
    cat: "home_hotel",
    pl: "łóżko",
    en: "bed",
    ar: "سرير",
    ph: "sirriir",
    ex: { ar: "عايز سرير كبير.", ph: "3aayez sirriir kibiir.", pl: "Chcę duże łóżko.", en: "I want a big bed." },
  },
  {
    cat: "home_hotel",
    pl: "ręcznik",
    en: "towel",
    ar: "فوطة",
    ph: "fuuTa",
    ex: { ar: "ممكن فوطة كمان، لو سمحت؟", ph: "momken fuuTa kamaan, law samaHt?", pl: "Mogę prosić jeszcze jeden ręcznik?", en: "Can I have another towel?" },
  },
  {
    cat: "food_shopping",
    pl: "ile kilo chcesz? (do mężczyzny)",
    en: "how many kilos do you want? (to m.)",
    ar: "عايز كام كيلو؟",
    ph: "3aayez kaam kiilu?",
    ex: { ar: "عايز كام كيلو رز؟ عايز كيلو واحد.", ph: "3aayez kaam kiilu ruzz? 3aayez kiilu waaHed.", pl: "Ile kilo ryżu chcesz? Chcę jedno kilo.", en: "How many kilos of rice do you want? I want one kilo." },
  },
  {
    cat: "food_shopping",
    pl: "ryż",
    en: "rice",
    ar: "رز",
    ph: "ruzz",
    ex: { ar: "عندك رز؟", ph: "3andak ruzz?", pl: "Masz ryż?", en: "Do you have rice?" },
  },
  {
    cat: "food_shopping",
    pl: "cukier",
    en: "sugar",
    ar: "سكر",
    ph: "sukkar",
    ex: { ar: "عايز كيلو سكر.", ph: "3aayez kiilu sukkar.", pl: "Chcę kilo cukru.", en: "I want a kilo of sugar." },
  },
  {
    cat: "food_shopping",
    pl: "herbata",
    en: "tea",
    ar: "شاي",
    ph: "shaay",
    ex: { ar: "عايز شاي وقهوة.", ph: "3aayez shaay wi 2ahwa.", pl: "Chcę herbatę i kawę.", en: "I want tea and coffee." },
  },
  {
    cat: "food_shopping",
    pl: "ser",
    en: "cheese",
    ar: "جبنة",
    ph: "gibna",
    ex: { ar: "عايز جبنة بيضا.", ph: "3aayez gibna beeDa.", pl: "Chcę biały ser.", en: "I want white cheese." },
  },
  {
    cat: "food_shopping",
    pl: "mleko",
    en: "milk",
    ar: "لبن",
    ph: "laban",
    ex: { ar: "عايز عبوة لبن.", ph: "3aayez 3ilbet laban.", pl: "Chcę pudełko mleka.", en: "I want a carton of milk." },
  },
  {
    cat: "food_shopping",
    pl: "proszę, daj mi...",
    en: "please give me...",
    ar: "من فضلك إديني",
    ph: "min faDlak 2iddiini",
    ex: { ar: "من فضلك إديني كيلو رز.", ph: "min faDlak 2iddiini kiilu ruzz.", pl: "Proszę, daj mi kilo ryżu.", en: "Please give me a kilo of rice." },
  },
  {
    cat: "food_shopping",
    pl: "proszę, zważ dla mnie...",
    en: "please weigh out for me...",
    ar: "من فضلك إوزن لي",
    ph: "min faDlak 2iwzen li",
    ex: { ar: "من فضلك إوزن لي كيلو بطاطس.", ph: "min faDlak 2iwzen li kiilu baTaaTes.", pl: "Proszę, zważ mi kilo ziemniaków.", en: "Please weigh out a kilo of potatoes for me." },
  },
  {
    cat: "food_shopping",
    pl: "menu, proszę",
    en: "the menu, please",
    ar: "المنيو من فضلك",
    ph: "il-minya min faDlak",
    ex: { ar: "المنيو من فضلك.", ph: "il-minya min faDlak.", pl: "Menu, proszę.", en: "The menu, please." },
  },
  {
    cat: "food_shopping",
    pl: "do twoich usług, panie/pani",
    en: "at your service, sir/madam",
    ar: "تحت أمرك / أمرك",
    ph: "taHt 2amrak / 2amrik",
    ex: { ar: "تحت أمرك يا فندم.", ph: "taHt 2amrak ya fandem.", pl: "Do pana usług.", en: "At your service." },
  },
  {
    cat: "food_shopping",
    pl: "kelner przynosi jedzenie na tacy",
    en: "the waiter brings food on a tray",
    ar: "الجرسون بيجيب له الأكل على صينية",
    ph: "il-garsoon biygiib lu il-2akl 3ala Siniyya",
    ex: { ar: "الجرسون بيجيب له الأكل على صينية.", ph: "il-garsoon biygiib lu il-2akl 3ala Siniyya.", pl: "Kelner przynosi mu jedzenie na tacy.", en: "The waiter brings him food on a tray." },
  },
  {
    cat: "travel",
    pl: "czy ten autobus jedzie do piramid?",
    en: "does this bus go to the pyramids?",
    ar: "الأتوبيس ده بيروح الأهرام؟",
    ph: "il-2utubiis da biyruuH il-2ahraam?",
    ex: { ar: "الأتوبيس ده بيروح الأهرام؟ آه.", ph: "il-2utubiis da biyruuH il-2ahraam? aa(h).", pl: "Czy ten autobus jedzie do piramid? Tak.", en: "Does this bus go to the pyramids? Yes." },
  },
  {
    cat: "travel",
    pl: "ile kosztuje bilet?",
    en: "how much is the ticket?",
    ar: "بكام التذكرة؟",
    ph: "bikaam it-tazkara?",
    ex: { ar: "بكام التذكرة؟ بعشرة جنيه.", ph: "bikaam it-tazkara? bi3ashara geneeh.", pl: "Ile kosztuje bilet? Dziesięć funtów.", en: "How much is the ticket? Ten pounds." },
  },
  {
    cat: "food_shopping",
    pl: "to jest za drogo (m.)",
    en: "that's too expensive (m.)",
    ar: "ده غالي عليّ",
    ph: "da ghaali 3alayya",
    ex: { ar: "ده غالي عليّ. خليها عشرين.", ph: "da ghaali 3alayya. khalliiha 3ishriin.", pl: "To dla mnie za drogo. Zrób dwadzieścia.", en: "That's too expensive for me. Make it twenty." },
  },
  {
    cat: "travel",
    pl: "dobra, ruszajmy (do taksówkarza/grupy)",
    en: "okay, let's go (to a driver/group)",
    ar: "ماشي، يالا بينا",
    ph: "maashi, yalla biina",
    ex: { ar: "ماشي، يالا بينا.", ph: "maashi, yalla biina.", pl: "OK, jedziemy.", en: "Okay, let's go." },
  },
  {
    cat: "body_services",
    pl: "głowa",
    en: "head",
    ar: "راس",
    ph: "raas",
    ex: { ar: "راسي بتوجعني.", ph: "raasi bitiwga3ni.", pl: "Boli mnie głowa.", en: "My head hurts." },
  },
  {
    cat: "body_services",
    pl: "ręka",
    en: "hand / arm",
    ar: "إيد",
    ph: "2iid",
    ex: { ar: "إيدي بتوجعني.", ph: "2iidi bitiwga3ni.", pl: "Boli mnie ręka.", en: "My arm hurts." },
  },
  {
    cat: "body_services",
    pl: "noga",
    en: "leg",
    ar: "رجل",
    ph: "regl",
    ex: { ar: "رجلي بتوجعني.", ph: "regli bitiwga3ni.", pl: "Boli mnie noga.", en: "My leg hurts." },
  },
  {
    cat: "body_services",
    pl: "brzuch",
    en: "stomach",
    ar: "بطن",
    ph: "baTn",
    ex: { ar: "بطني بتوجعني.", ph: "baTni bitiwga3ni.", pl: "Boli mnie brzuch.", en: "My stomach hurts." },
  },
  {
    cat: "body_services",
    pl: "serce",
    en: "heart",
    ar: "قلب",
    ph: "2alb",
    ex: { ar: "قلبي طيب وانا مبسوط.", ph: "2albi Tayyeb wana mabSuuT.", pl: "Moje serce jest dobre i jestem zadowolony.", en: "My heart is good and I'm content." },
  },
  {
    cat: "body_services",
    pl: "but/y",
    en: "shoe(s)",
    ar: "جزمة",
    ph: "gazma",
    ex: { ar: "ممكن تصلح الجزمة بتاعتي، من فضلك؟", ph: "momken tiSallaH il-gazma betaa3ti, min faDlak?", pl: "Możesz naprawić mi buty, proszę?", en: "Can you fix my shoes, please?" },
  },
  {
    cat: "questions",
    pl: "co jest z tym nie tak?",
    en: "what's wrong with this?",
    ar: "فيها إيه؟",
    ph: "fiiha 2eeh?",
    ex: { ar: "ممكن تصلح الجزمة؟ فيها إيه؟", ph: "momken tiSallaH il-gazma? fiiha 2eeh?", pl: "Możesz naprawić te buty? Co z nimi nie tak?", en: "Can you fix these shoes? What's wrong with them?" },
  },
  {
    cat: "body_services",
    pl: "znaczki pocztowe",
    en: "postage stamps",
    ar: "طوابع",
    ph: "Tawaabe3",
    ex: { ar: "عندك طوابع للأمريكا؟", ph: "3andak Tawaabe3 lil2amriika?", pl: "Masz znaczki do Ameryki?", en: "Do you have stamps for America?" },
  },
  {
    cat: "body_services",
    pl: "gazeta",
    en: "newspaper",
    ar: "جورنال",
    ph: "gurnaal",
    ex: { ar: "عايز جورنال بالإنجليزي.", ph: "3aayez gurnaal bil2ingiliizi.", pl: "Chcę gazetę po angielsku.", en: "I want a newspaper in English." },
  },
  {
    cat: "body_services",
    pl: "sznurówka do butów",
    en: "shoelace",
    ar: "رباط جزمة",
    ph: "ribaaT gazma",
    ex: { ar: "عايز رباط جزمة جديد.", ph: "3aayez ribaaT gazma gediid.", pl: "Chcę nową sznurówkę do butów.", en: "I want a new shoelace." },
  },
  {
    cat: "body_services",
    pl: "czy możesz zaszyć ten guzik?",
    en: "can you sew on this button?",
    ar: "ممكن تخيطي الزرار ده؟",
    ph: "momken tikhayyaTi iz-zoraar da?",
    ex: { ar: "ممكن تخيطي الزرار ده؟ آه، تحت أمرك.", ph: "momken tikhayyaTi iz-zoraar da? aa(h), taHt 2amrik.", pl: "Możesz przyszyć ten guzik? Tak, do usług.", en: "Can you sew on this button? Yes, at your service." },
  },
  {
    cat: "basics",
    pl: "do zobaczenia wkrótce",
    en: "see you soon",
    ar: "أشوفك قريّب",
    ph: "ashuufak 2orayyeb",
    ex: { ar: "أشوفك قريّب بكرة الصبح", ph: "ashuufak 2orayyeb bukra is-subH", pl: "Do zobaczenia wkrótce, jutro rano", en: "See you soon, tomorrow morning" },
  },
  {
    cat: "basics",
    pl: "wcześnie rano",
    en: "early in the morning",
    ar: "الصبح بدري",
    ph: "is-subH badri",
    ex: { ar: "أشوفك الصبح بدري", ph: "ashuufak is-subH badri", pl: "Do zobaczenia wcześnie rano", en: "See you early in the morning" },
  },
  {
    cat: "travel",
    pl: "czy widzimy się wieczorem w restauracji?",
    en: "shall we meet at the restaurant this evening?",
    ar: "نشوف بعض بالليل في المطعم؟",
    ph: "nishuuf ba3D bil-leel fil-maT3am?",
    ex: { ar: "نشوف بعض بالليل في المطعم؟ أيوا!", ph: "nishuuf ba3D bil-leel fil-maT3am? aywa!", pl: "Widzimy się wieczorem w restauracji? Tak!", en: "Shall we meet at the restaurant this evening? Yes!" },
  },
  {
    cat: "food_shopping",
    pl: "chcesz zjeść ze mną kolację? (do mężczyzny)",
    en: "would you like to have dinner with me? (to m.)",
    ar: "عايز تتعشى معايا؟",
    ph: "3aayez tit3ashsha ma3aaya?",
    ex: { ar: "عايز تتعشى معايا؟ أيوا، عايز.", ph: "3aayez tit3ashsha ma3aaya? aywa, 3aayez.", pl: "Chcesz zjeść ze mną kolację? Tak, chcę.", en: "Do you want to have dinner with me? Yes, I do." },
  },
  {
    cat: "travel",
    pl: "co robisz dzisiaj wieczorem? (do mężczyzny)",
    en: "what are you doing tonight? (to m.)",
    ar: "انت هتعمل ايه النهاردة بالليل؟",
    ph: "enta hate3mel eeh ennaharda bil-leel?",
    ex: { ar: "انت هتعمل ايه النهاردة بالليل؟ مفيش حاجة.", ph: "enta hate3mel eeh ennaharda bil-leel? mafiish Haaga.", pl: "Co robisz dzisiaj wieczorem? Nic.", en: "What are you doing tonight? Nothing." },
  },
  {
    cat: "feelings",
    pl: "jest zimno wieczorem",
    en: "it's cold in the evening",
    ar: "بارد بالليل",
    ph: "baared bil-leel",
    ex: { ar: "بارد بالليل دلوقتي", ph: "baared bil-leel dilwa2ti", pl: "Teraz wieczorem jest zimno", en: "It's cold in the evening now" },
  },
  {
    cat: "work_daily",
    pl: "chcę pracować z tobą",
    en: "I want to work with you",
    ar: "عايز اشتغل معاك",
    ph: "3aayez ashtaghal ma3aak",
    ex: { ar: "أنا عايز اشتغل معاك", ph: "ana 3aayez ashtaghal ma3aak", pl: "Chcę pracować z tobą", en: "I want to work with you" },
  },
  {
    cat: "work_daily",
    pl: "muszę iść tam dzisiaj",
    en: "I have to go there today",
    ar: "لازم اروح هناك النهاردة",
    ph: "laazem aruuH hinaak ennaharda",
    ex: { ar: "أنا لازم اروح هناك النهاردة", ph: "ana laazem aruuH hinaak ennaharda", pl: "Muszę iść tam dzisiaj", en: "I have to go there today" },
  },
  {
    cat: "work_daily",
    pl: "nie pracuję wcale",
    en: "I don't work at all",
    ar: "ما بشتغلش أبدا",
    ph: "ma bashtaghalsh abadan",
    ex: { ar: "أنا ما بشتغلش أبدا", ph: "ana ma bashtaghalsh abadan", pl: "Wcale nie pracuję", en: "I don't work at all" },
  },
  {
    cat: "work_daily",
    pl: "pracuję jako prawnik",
    en: "I work as a lawyer",
    ar: "باشتغل محامي",
    ph: "bashtaghal muHaami",
    ex: { ar: "أنا باشتغل محامي في شركتي", ph: "ana bashtaghal muHaami fi sharikti", pl: "Pracuję jako prawnik w mojej firmie", en: "I work as a lawyer at my company" },
  },
  {
    cat: "work_daily",
    pl: "gotuję jedzenie",
    en: "I cook food",
    ar: "بعمل الأكل",
    ph: "ba3mel el-akl",
    ex: { ar: "أنا بعمل الأكل وهي بتشتغل مهندسة", ph: "ana ba3mel el-akl wi heyya betishtaghal mohandisa", pl: "Gotuję jedzenie, a ona pracuje jako inżynierka", en: "I cook food, and she works as an engineer" },
  },
  {
    cat: "work_daily",
    pl: "kupuję teraz coś z supermarketu",
    en: "I'm buying something from the supermarket now",
    ar: "بشتري حاجة من السوبر ماركت دلوقتي",
    ph: "bashtiri Haaga min is-supermarket dilwa2ti",
    ex: { ar: "أنا بشتري حاجة من السوبر ماركت دلوقتي", ph: "ana bashtiri Haaga min is-supermarket dilwa2ti", pl: "Kupuję teraz coś z supermarketu", en: "I'm buying something from the supermarket now" },
  },
  {
    cat: "numbers_time",
    pl: "następny raz",
    en: "next time",
    ar: "المرة الجاية",
    ph: "el-marra el-gayya",
    ex: { ar: "اشوفك المرة الجاية", ph: "ashuufak el-marra el-gayya", pl: "Do zobaczenia następny raz", en: "See you next time" },
  },
  {
    cat: "numbers_time",
    pl: "następny tydzień",
    en: "next week",
    ar: "الإسبوع الجاي",
    ph: "el-isbuu3 el-gayy",
    ex: { ar: "هشتغل الإسبوع الجاي", ph: "hashtaghal el-isbuu3 el-gayy", pl: "Będę pracować w następnym tygodniu", en: "I'll be working next week" },
  },
  {
    cat: "work_daily",
    pl: "lubię patrzeć na ciebie codziennie",
    en: "I like looking at you every day",
    ar: "عايز ابص لك كل يوم",
    ph: "3aayez aboSS lak koll yoom",
    ex: { ar: "أنا عايز ابص لك كل يوم", ph: "ana 3aayez aboSS lak koll yoom", pl: "Chcę patrzeć na ciebie codziennie", en: "I want to look at you every day" },
  },
  {
    cat: "work_daily",
    pl: "lubię sprzątać dom codziennie",
    en: "I like cleaning the house every day",
    ar: "بحب اعمل البيت كل يوم",
    ph: "baHebb a3mel el-beet koll yoom",
    ex: { ar: "أنا بحب اعمل البيت كل يوم", ph: "ana baHebb a3mel el-beet koll yoom", pl: "Lubię sprzątać dom codziennie", en: "I like cleaning the house every day" },
  },
  {
    cat: "work_daily",
    pl: "lubię jeść kurczaka",
    en: "I like eating chicken",
    ar: "بحب آكل فراخ",
    ph: "baHebb aakul firaakh",
    ex: { ar: "أنا بحب آكل فراخ", ph: "ana baHebb aakul firaakh", pl: "Lubię jeść kurczaka", en: "I like eating chicken" },
  },
  {
    cat: "work_daily",
    pl: "nie mam czasu",
    en: "I don't have time",
    ar: "معنديش وقت",
    ph: "ma3andiish wa2t",
    ex: { ar: "عايز اروح معاكي المطعم بس معنديش وقت", ph: "3aayez aruuH ma3aaki el-maT3am bas ma3andiish wa2t", pl: "Chcę pójść z tobą do restauracji, ale nie mam czasu", en: "I want to go to a restaurant with you, but I don't have time" },
  },
  {
    cat: "work_daily",
    pl: "chodziłem do szkoły",
    en: "I used to go to school",
    ar: "رحت المدرسة",
    ph: "ruHt el-madrasa",
    ex: { ar: "أنا رحت المدرسة", ph: "ana ruHt el-madrasa", pl: "Chodziłem do szkoły", en: "I used to go to school" },
  },
  {
    cat: "work_daily",
    pl: "gdzie byłeś wczoraj? (do grupy)",
    en: "where were you yesterday? (to a group)",
    ar: "انتوا رحتوا مبارح فين؟",
    ph: "entu ruHtu mbaareH feen?",
    ex: { ar: "انتوا رحتوا مبارح فين؟", ph: "entu ruHtu mbaareH feen?", pl: "Gdzie byliście wczoraj?", en: "Where were you (pl.) yesterday?" },
  },
  {
    cat: "work_daily",
    pl: "kim był ten, który przyszedł wczoraj?",
    en: "who was the one who came yesterday?",
    ar: "كان مين ده اللي جه مبارح؟",
    ph: "kaan miin da elli geh mbaareH?",
    ex: { ar: "كان مين ده اللي جه مبارح؟", ph: "kaan miin da elli geh mbaareH?", pl: "Kim był ten, który przyszedł wczoraj?", en: "Who was the one who came yesterday?" },
  },
  {
    cat: "work_daily",
    pl: "piszę teraz mejla",
    en: "I'm writing an email now",
    ar: "بكتب ايميل دلوقتي",
    ph: "baktib email dilwa2ti",
    ex: { ar: "أنا بكتب لك ايميل دلوقتي", ph: "ana baktib lak email dilwa2ti", pl: "Piszę teraz do ciebie mejla", en: "I'm writing you an email now" },
  },
  {
    cat: "work_daily",
    pl: "będę w biurze o czwartej",
    en: "I'll be at the office at four",
    ar: "هكون في المكتب الساعة أربعة",
    ph: "hakuun fil-maktab is-saa3a arba3a",
    ex: { ar: "أنا هكون في المكتب الساعة أربعة", ph: "ana hakuun fil-maktab is-saa3a arba3a", pl: "Będę w biurze o czwartej", en: "I'll be at the office at four" },
  },
  {
    cat: "work_daily",
    pl: "byłem w biurze rano, ale teraz jestem w domu",
    en: "I was at the office in the morning, but now I'm home",
    ar: "كنت في المكتب الصبح لكن دلوقتي في البيت",
    ph: "kunt fil-maktab is-subH laakin dilwa2ti fil-beet",
    ex: { ar: "أنا كنت في المكتب النهاردة الصبح لكن أنا في البيت دلوقتي مع مراتي", ph: "ana kunt fil-maktab ennaharda is-subH laakin ana fil-beet dilwa2ti ma3a maraati", pl: "Byłem w biurze dziś rano, ale teraz jestem w domu z żoną", en: "I was at the office this morning, but now I'm home with my wife" },
  },
  {
    cat: "work_daily",
    pl: "czy możemy zrobić to razem?",
    en: "can we do this together?",
    ar: "ممكن نعمله مع بعض؟",
    ph: "momken ne3miluh ma3a ba3D?",
    ex: { ar: "ممكن نعمله مع بعض؟ أيوا، ممكن.", ph: "momken ne3miluh ma3a ba3D? aywa, momken.", pl: "Możemy zrobić to razem? Tak, możemy.", en: "Can we do this together? Yes, we can." },
  },
  {
    cat: "work_daily",
    pl: "byłem kiedyś w Niemczech",
    en: "I've been to Germany before",
    ar: "كنت في ألمانيا مرة واحدة",
    ph: "kunt fi almaanya marra waHda",
    ex: { ar: "أنا كنت في ألمانيا مرة واحدة", ph: "ana kunt fi almaanya marra waHda", pl: "Byłem kiedyś w Niemczech", en: "I've been to Germany before" },
  },
  {
    cat: "work_daily",
    pl: "ona nigdy nie była w Japonii",
    en: "she's never been to Japan",
    ar: "هي ما كانتش أبدا في اليابان",
    ph: "heyya ma kaanetsh abadan fil-yabaan",
    ex: { ar: "هي ما كانتش أبدا في اليابان", ph: "heyya ma kaanetsh abadan fil-yabaan", pl: "Ona nigdy nie była w Japonii", en: "She's never been to Japan" },
  },
  {
    cat: "work_daily",
    pl: "czego chcesz? (do mężczyzny)",
    en: "what do you want? (to m.)",
    ar: "انت عايز ايه؟",
    ph: "enta 3aayez eeh?",
    ex: { ar: "انت عايز تروح فين؟", ph: "enta 3aayez tiruuH feen?", pl: "Gdzie chcesz pójść?", en: "Where do you want to go?" },
  },
  {
    cat: "work_daily",
    pl: "co chcesz kupić? (do mężczyzny)",
    en: "what do you want to buy? (to m.)",
    ar: "انت عايز تشتري ايه؟",
    ph: "enta 3aayez tishtiri eeh?",
    ex: { ar: "انت عايز تشتري ايه من هنا؟", ph: "enta 3aayez tishtiri eeh min hina?", pl: "Co chcesz kupić stąd?", en: "What do you want to buy from here?" },
  },
  {
    cat: "feelings",
    pl: "myślę o czymś",
    en: "I'm thinking about something",
    ar: "بفكر في حاجة",
    ph: "befakkar fi Haaga",
    ex: { ar: "أنا بفكر في حاجة", ph: "ana befakkar fi Haaga", pl: "Myślę o czymś", en: "I'm thinking about something" },
  },
  {
    cat: "feelings",
    pl: "myślę, że masz rację (do kobiety)",
    en: "I think you're right (to f.)",
    ar: "بفكر إنك صح",
    ph: "befakkar ennek saHH",
    ex: { ar: "أنا بفكر إنك صح", ph: "ana befakkar ennek saHH", pl: "Myślę, że masz rację", en: "I think you're right" },
  },
  {
    cat: "feelings",
    pl: "myślałem o tobie wczoraj",
    en: "I was thinking about you yesterday",
    ar: "فكرت فيك مبارح",
    ph: "fakkart fiik mbaareH",
    ex: { ar: "أنا فكرت فيك مبارح", ph: "ana fakkart fiik mbaareH", pl: "Myślałem o tobie wczoraj", en: "I was thinking about you yesterday" },
  },
  {
    cat: "work_daily",
    pl: "jaka jest sytuacja kraju teraz?",
    en: "what's the country's situation now?",
    ar: "ايه حالة البلد دلوقتي؟",
    ph: "eeh Haalet el-balad dilwa2ti?",
    ex: { ar: "ايه حالة البلد دلوقتي؟", ph: "eeh Haalet el-balad dilwa2ti?", pl: "Jaka jest sytuacja kraju teraz?", en: "What's the country's situation now?" },
  },
  {
    cat: "work_daily",
    pl: "potrzebuję więcej pieniędzy",
    en: "I need more money",
    ar: "بحتاج فلوس أكتر",
    ph: "baHtaag fuluus aktar",
    ex: { ar: "أنا بحتاج فلوس أكتر", ph: "ana baHtaag fuluus aktar", pl: "Potrzebuję więcej pieniędzy", en: "I need more money" },
  },
  {
    cat: "work_daily",
    pl: "rozumiemy się",
    en: "we understand each other",
    ar: "احنا بنفهم بعض",
    ph: "eHna binifham ba3D",
    ex: { ar: "احنا بنفهم بعض كويس", ph: "eHna binifham ba3D kowayyes", pl: "Dobrze się rozumiemy", en: "We understand each other well" },
  },
  {
    cat: "feelings",
    pl: "jestem zadowolony, że jestem tutaj",
    en: "I'm glad to be here",
    ar: "أنا مبسوط إني هنا",
    ph: "ana mabSuuT enni hina",
    ex: { ar: "أنا مبسوط إني هنا معاكي", ph: "ana mabSuuT enni hina ma3aaki", pl: "Jestem zadowolony, że jestem tu z tobą", en: "I'm glad to be here with you" },
  },
  {
    cat: "home_hotel",
    pl: "gdzie jest mój pies?",
    en: "where is my dog?",
    ar: "فين كلبي؟",
    ph: "feen kalbi?",
    ex: { ar: "فين كلبي؟ هو في أوضة النوم.", ph: "feen kalbi? huwwa fi 2uDet en-noom.", pl: "Gdzie jest mój pies? Jest w sypialni.", en: "Where's my dog? It's in the bedroom." },
  },
  {
    cat: "home_hotel",
    pl: "ona jest w kuchni",
    en: "she's in the kitchen",
    ar: "هي في المطبخ",
    ph: "heyya fil-maTbakh",
    ex: { ar: "فين مراتي؟ هي في المطبخ.", ph: "feen maraati? heyya fil-maTbakh.", pl: "Gdzie jest moja żona? Jest w kuchni.", en: "Where's my wife? She's in the kitchen." },
  },
  {
    cat: "home_hotel",
    pl: "jest zaparkowany na zewnątrz",
    en: "it's parked outside",
    ar: "مركون برّا",
    ph: "markuun barra",
    ex: { ar: "فين عربيتي؟ مركونة برّا.", ph: "feen 3arabeyti? markoona barra.", pl: "Gdzie jest mój samochód? Jest zaparkowany na zewnątrz.", en: "Where's my car? It's parked outside." },
  },
  {
    cat: "basics",
    pl: "wielkie dzięki (do mężczyzny)",
    en: "thanks a lot (to m.)",
    ar: "متشكر أوي ليك",
    ph: "mitshakkir awi liik",
    ex: { ar: "متشكر أوي ليك", ph: "mitshakkir awi liik", pl: "Wielkie dzięki", en: "Thanks a lot" },
  },
  {
    cat: "food_shopping",
    pl: "mam wszystko, czego potrzebuję",
    en: "I have everything I need",
    ar: "معايا كل حاجة",
    ph: "ma3aaya koll Haaga",
    ex: { ar: "أنا معايا كل حاجة للعشا", ph: "ana ma3aaya koll Haaga lil-3asha", pl: "Mam wszystko na kolację", en: "I have everything for dinner" },
  },
  {
    cat: "feelings",
    pl: "to jest szalony pomysł",
    en: "that's a crazy idea",
    ar: "دي فكرة مجنونة",
    ph: "di fikra magnuuna",
    ex: { ar: "جتلي فكرة مجنونة النهاردة", ph: "gatli fikra magnuuna ennaharda", pl: "Wpadłem dziś na szalony pomysł", en: "I had a crazy idea today" },
  },
  {
    cat: "family",
    pl: "to jest mój mąż",
    en: "this is my husband",
    ar: "ده جوزي",
    ph: "da gozi",
    ex: { ar: "ده جوزي ودي مراتي", ph: "da gozi wi di maraati", pl: "To jest mój mąż, a to moja żona", en: "This is my husband, and this is my wife" },
  },
  {
    cat: "family",
    pl: "to jest moja kochana",
    en: "this is my beloved",
    ar: "دي حبيبتي",
    ph: "di Habiibti",
    ex: { ar: "دي حبيبتي وده حبيبي", ph: "di Habiibti wi da Habiibi", pl: "To jest moja kochana, a to mój kochany", en: "This is my beloved (f.), and this is my beloved (m.)" },
  },
  {
    cat: "family",
    pl: "to jest mój kolega/przyjaciel",
    en: "this is my friend",
    ar: "ده صاحبي",
    ph: "da SaaHbi",
    ex: { ar: "ده صاحبي ودي صاحبتي", ph: "da SaaHbi wi di SaaHibti", pl: "To jest mój kolega, a to moja koleżanka", en: "This is my friend (m.), and this is my friend (f.)" },
  },
  {
    cat: "family",
    pl: "to jest mój brat / to jest moja siostra",
    en: "this is my brother / this is my sister",
    ar: "ده أخويا / دي أختي",
    ph: "da akhuuya / di ukhti",
    ex: { ar: "ده أخويا ودي أختي", ph: "da akhuuya wi di ukhti", pl: "To jest mój brat, a to moja siostra", en: "This is my brother, and this is my sister" },
  },
  {
    cat: "family",
    pl: "mama, tata, babcia, dziadek",
    en: "mom, dad, grandma, grandpa",
    ar: "ماما، بابا، تيتا، جدي",
    ph: "mama, baba, teeta, geddi",
    ex: { ar: "ده بابا، دي ماما، دي تيتا، ده جدي", ph: "da baba, di mama, di teeta, da geddi", pl: "To tata, to mama, to babcia, to dziadek", en: "This is dad, this is mom, this is grandma, this is grandpa" },
  },
  {
    cat: "family",
    pl: "jesteśmy ludźmi",
    en: "we are people",
    ar: "احنا بني آدمين",
    ph: "eHna bani-2admiin",
    ex: { ar: "احنا بني آدمين", ph: "eHna bani-2admiin", pl: "Jesteśmy ludźmi", en: "We are people" },
  },
  // ---- Liczby 0–1 000 000 ----
  {
    cat: "numbers_time",
    pl: "zero (0)",
    en: "zero (0)",
    ar: "صفر",
    ph: "Sifr",
    ex: { ar: "معايا صفر جنيه", ph: "ma3aaya Sifr geneeh", pl: "Mam zero funtów", en: "I have zero pounds" },
  },
  {
    cat: "numbers_time",
    pl: "jeden (1)",
    en: "one (1)",
    ar: "واحد",
    ph: "waaHed",
    ex: { ar: "عايز واحد قهوة", ph: "3aayez waaHed 2ahwa", pl: "Chcę jedną kawę", en: "I want one coffee" },
  },
  {
    cat: "numbers_time",
    pl: "dwa (2)",
    en: "two (2)",
    ar: "اتنين",
    ph: "etneen",
    ex: { ar: "عايز اتنين قهوة", ph: "3aayez etneen 2ahwa", pl: "Chcę dwie kawy", en: "I want two coffees" },
  },
  {
    cat: "numbers_time",
    pl: "trzy (3)",
    en: "three (3)",
    ar: "تلاتة",
    ph: "talaata",
    ex: { ar: "عندي تلاتة كتب", ph: "3andi talaata kotob", pl: "Mam trzy książki", en: "I have three books" },
  },
  {
    cat: "numbers_time",
    pl: "cztery (4)",
    en: "four (4)",
    ar: "أربعة",
    ph: "arba3a",
    ex: { ar: "عندي أربعة كتب", ph: "3andi arba3a kotob", pl: "Mam cztery książki", en: "I have four books" },
  },
  {
    cat: "numbers_time",
    pl: "pięć (5)",
    en: "five (5)",
    ar: "خمسة",
    ph: "khamsa",
    ex: { ar: "عايز خمسة كيلو رز", ph: "3aayez khamsa kiilu ruzz", pl: "Chcę pięć kilo ryżu", en: "I want five kilos of rice" },
  },
  {
    cat: "numbers_time",
    pl: "sześć (6)",
    en: "six (6)",
    ar: "ستة",
    ph: "setta",
    ex: { ar: "الساعة ستة دلوقتي", ph: "essaa3a setta dilwa2ti", pl: "Jest teraz szósta", en: "It's six o'clock now" },
  },
  {
    cat: "numbers_time",
    pl: "siedem (7)",
    en: "seven (7)",
    ar: "سبعة",
    ph: "sab3a",
    ex: { ar: "هنتقابل الساعة سبعة", ph: "hanet2aabel essaa3a sab3a", pl: "Spotkamy się o siódmej", en: "We'll meet at seven" },
  },
  {
    cat: "numbers_time",
    pl: "osiem (8)",
    en: "eight (8)",
    ar: "تمانية",
    ph: "tamanya",
    ex: { ar: "عندي تمانية جنيه بس", ph: "3andi tamanya geneeh bas", pl: "Mam tylko osiem funtów", en: "I only have eight pounds" },
  },
  {
    cat: "numbers_time",
    pl: "dziewięć (9)",
    en: "nine (9)",
    ar: "تسعة",
    ph: "tes3a",
    ex: { ar: "احنا تسعة في البيت", ph: "eHna tes3a fil-beet", pl: "Jest nas dziewięcioro w domu", en: "There are nine of us at home" },
  },
  {
    cat: "numbers_time",
    pl: "dziesięć (10)",
    en: "ten (10)",
    ar: "عشرة",
    ph: "3ashara",
    ex: { ar: "عايز عشرة جنيه", ph: "3aayez 3ashara geneeh", pl: "Chcę dziesięć funtów", en: "I want ten pounds" },
  },
  {
    cat: "numbers_time",
    pl: "jedenaście (11)",
    en: "eleven (11)",
    ar: "حداشر",
    ph: "Hidaashar",
    ex: { ar: "عندي حداشر كتاب", ph: "3andi Hidaashar kitaab", pl: "Mam jedenaście książek", en: "I have eleven books" },
  },
  {
    cat: "numbers_time",
    pl: "dwanaście (12)",
    en: "twelve (12)",
    ar: "اتناشر",
    ph: "etnaashar",
    ex: { ar: "الساعة اتناشر دلوقتي", ph: "essaa3a etnaashar dilwa2ti", pl: "Jest teraz dwunasta", en: "It's twelve o'clock now" },
  },
  {
    cat: "numbers_time",
    pl: "trzynaście (13)",
    en: "thirteen (13)",
    ar: "تلتاشر",
    ph: "talattaashar",
    ex: { ar: "عندها تلتاشر سنة", ph: "3andaha talattaashar sana", pl: "Ona ma trzynaście lat", en: "She's thirteen years old" },
  },
  {
    cat: "numbers_time",
    pl: "czternaście (14)",
    en: "fourteen (14)",
    ar: "أربعتاشر",
    ph: "arba3taashar",
    ex: { ar: "عندي أربعتاشر جنيه", ph: "3andi arba3taashar geneeh", pl: "Mam czternaście funtów", en: "I have fourteen pounds" },
  },
  {
    cat: "numbers_time",
    pl: "piętnaście (15)",
    en: "fifteen (15)",
    ar: "خمستاشر",
    ph: "khamastaashar",
    ex: { ar: "هوصل بعد خمستاشر دقيقة", ph: "hawSal ba3d khamastaashar di2ii2a", pl: "Przyjadę za piętnaście minut", en: "I'll come in fifteen minutes" },
  },
  {
    cat: "numbers_time",
    pl: "szesnaście (16)",
    en: "sixteen (16)",
    ar: "ستاشر",
    ph: "sittaashar",
    ex: { ar: "عندي ستاشر سنة", ph: "3andi sittaashar sana", pl: "Mam szesnaście lat", en: "I'm sixteen years old" },
  },
  {
    cat: "numbers_time",
    pl: "siedemnaście (17)",
    en: "seventeen (17)",
    ar: "سبعتاشر",
    ph: "saba3taashar",
    ex: { ar: "عندي سبعتاشر جنيه بس", ph: "3andi saba3taashar geneeh bas", pl: "Mam tylko siedemnaście funtów", en: "I only have seventeen pounds" },
  },
  {
    cat: "numbers_time",
    pl: "osiemnaście (18)",
    en: "eighteen (18)",
    ar: "تمنتاشر",
    ph: "tamantaashar",
    ex: { ar: "هنتقابل الساعة تمنتاشر", ph: "hanet2aabel essaa3a tamantaashar", pl: "Spotkamy się o osiemnastej", en: "We'll meet at six p.m." },
  },
  {
    cat: "numbers_time",
    pl: "dziewiętnaście (19)",
    en: "nineteen (19)",
    ar: "تسعتاشر",
    ph: "tisa3taashar",
    ex: { ar: "عندي تسعتاشر كتاب", ph: "3andi tisa3taashar kitaab", pl: "Mam dziewiętnaście książek", en: "I have nineteen books" },
  },
  {
    cat: "numbers_time",
    pl: "dwadzieścia (20)",
    en: "twenty (20)",
    ar: "عشرين",
    ph: "3ishriin",
    ex: { ar: "عايز عشرين جنيه", ph: "3aayez 3ishriin geneeh", pl: "Chcę dwadzieścia funtów", en: "I want twenty pounds" },
  },
  {
    cat: "numbers_time",
    pl: "dwadzieścia jeden (21)",
    en: "twenty-one (21)",
    ar: "واحد وعشرين",
    ph: "waaHed wi 3ishriin",
    ex: { ar: "عندي واحد وعشرين سنة", ph: "3andi waaHed wi 3ishriin sana", pl: "Mam dwadzieścia jeden lat", en: "I'm twenty-one years old" },
  },
  {
    cat: "numbers_time",
    pl: "trzydzieści (30)",
    en: "thirty (30)",
    ar: "تلاتين",
    ph: "talatiin",
    ex: { ar: "عندي تلاتين جنيه", ph: "3andi talatiin geneeh", pl: "Mam trzydzieści funtów", en: "I have thirty pounds" },
  },
  {
    cat: "numbers_time",
    pl: "trzydzieści pięć (35)",
    en: "thirty-five (35)",
    ar: "خمسة وتلاتين",
    ph: "khamsa wi talatiin",
    ex: { ar: "عندها خمسة وتلاتين سنة", ph: "3andaha khamsa wi talatiin sana", pl: "Ona ma trzydzieści pięć lat", en: "She's thirty-five years old" },
  },
  {
    cat: "numbers_time",
    pl: "czterdzieści (40)",
    en: "forty (40)",
    ar: "أربعين",
    ph: "arbe3iin",
    ex: { ar: "عايز أربعين كيلو سكر", ph: "3aayez arbe3iin kiilu sukkar", pl: "Chcę czterdzieści kilo cukru", en: "I want forty kilos of sugar" },
  },
  {
    cat: "numbers_time",
    pl: "pięćdziesiąt (50)",
    en: "fifty (50)",
    ar: "خمسين",
    ph: "khamsiin",
    ex: { ar: "عندي خمسين جنيه بس", ph: "3andi khamsiin geneeh bas", pl: "Mam tylko pięćdziesiąt funtów", en: "I only have fifty pounds" },
  },
  {
    cat: "numbers_time",
    pl: "sześćdziesiąt (60)",
    en: "sixty (60)",
    ar: "ستين",
    ph: "sittiin",
    ex: { ar: "هوصل بعد ستين دقيقة", ph: "hawSal ba3d sittiin di2ii2a", pl: "Przyjadę za sześćdziesiąt minut", en: "I'll come in sixty minutes" },
  },
  {
    cat: "numbers_time",
    pl: "siedemdziesiąt (70)",
    en: "seventy (70)",
    ar: "سبعين",
    ph: "sab3iin",
    ex: { ar: "جدي عنده سبعين سنة", ph: "geddi 3andu sab3iin sana", pl: "Mój dziadek ma siedemdziesiąt lat", en: "My grandfather is seventy years old" },
  },
  {
    cat: "numbers_time",
    pl: "osiemdziesiąt (80)",
    en: "eighty (80)",
    ar: "تمانين",
    ph: "tamaniin",
    ex: { ar: "ده غالي، تمانين جنيه", ph: "da ghaali, tamaniin geneeh", pl: "To drogie, osiemdziesiąt funtów", en: "That's expensive, eighty pounds" },
  },
  {
    cat: "numbers_time",
    pl: "dziewięćdziesiąt (90)",
    en: "ninety (90)",
    ar: "تسعين",
    ph: "tes3iin",
    ex: { ar: "عندي تسعين جنيه", ph: "3andi tes3iin geneeh", pl: "Mam dziewięćdziesiąt funtów", en: "I have ninety pounds" },
  },
  {
    cat: "numbers_time",
    pl: "dziewięćdziesiąt dziewięć (99)",
    en: "ninety-nine (99)",
    ar: "تسعة وتسعين",
    ph: "tes3a wi tes3iin",
    ex: { ar: "ده تسعة وتسعين جنيه", ph: "da tes3a wi tes3iin geneeh", pl: "To dziewięćdziesiąt dziewięć funtów", en: "That's ninety-nine pounds" },
  },
  {
    cat: "numbers_time",
    pl: "sto (100)",
    en: "one hundred (100)",
    ar: "ميه",
    ph: "miyya",
    ex: { ar: "عايز ميه جنيه", ph: "3aayez miyya geneeh", pl: "Chcę sto funtów", en: "I want one hundred pounds" },
  },
  {
    cat: "numbers_time",
    pl: "sto dwadzieścia pięć (125)",
    en: "one hundred twenty-five (125)",
    ar: "ميه وخمسة وعشرين",
    ph: "miyya wi khamsa wi 3ishriin",
    ex: { ar: "ده ميه وخمسة وعشرين جنيه", ph: "da miyya wi khamsa wi 3ishriin geneeh", pl: "To sto dwadzieścia pięć funtów", en: "That's one hundred twenty-five pounds" },
  },
  {
    cat: "numbers_time",
    pl: "dwieście (200)",
    en: "two hundred (200)",
    ar: "ميتين",
    ph: "miteen",
    ex: { ar: "عندي ميتين جنيه", ph: "3andi miteen geneeh", pl: "Mam dwieście funtów", en: "I have two hundred pounds" },
  },
  {
    cat: "numbers_time",
    pl: "trzysta (300)",
    en: "three hundred (300)",
    ar: "تلتميه",
    ph: "tultumiyya",
    ex: { ar: "ده تلتميه جنيه", ph: "da tultumiyya geneeh", pl: "To trzysta funtów", en: "That's three hundred pounds" },
  },
  {
    cat: "numbers_time",
    pl: "czterysta (400)",
    en: "four hundred (400)",
    ar: "ربعميه",
    ph: "rub3umiyya",
    ex: { ar: "عايز ربعميه جنيه", ph: "3aayez rub3umiyya geneeh", pl: "Chcę czterysta funtów", en: "I want four hundred pounds" },
  },
  {
    cat: "numbers_time",
    pl: "pięćset (500)",
    en: "five hundred (500)",
    ar: "خمسميه",
    ph: "khamsumiyya",
    ex: { ar: "عندي خمسميه جنيه", ph: "3andi khamsumiyya geneeh", pl: "Mam pięćset funtów", en: "I have five hundred pounds" },
  },
  {
    cat: "numbers_time",
    pl: "sześćset (600)",
    en: "six hundred (600)",
    ar: "ستميه",
    ph: "suttumiyya",
    ex: { ar: "ده ستميه جنيه", ph: "da suttumiyya geneeh", pl: "To sześćset funtów", en: "That's six hundred pounds" },
  },
  {
    cat: "numbers_time",
    pl: "siedemset (700)",
    en: "seven hundred (700)",
    ar: "سبعميه",
    ph: "sub3umiyya",
    ex: { ar: "عايز سبعميه جنيه", ph: "3aayez sub3umiyya geneeh", pl: "Chcę siedemset funtów", en: "I want seven hundred pounds" },
  },
  {
    cat: "numbers_time",
    pl: "osiemset (800)",
    en: "eight hundred (800)",
    ar: "تمنميه",
    ph: "tumnumiyya",
    ex: { ar: "ده تمنميه جنيه", ph: "da tumnumiyya geneeh", pl: "To osiemset funtów", en: "That's eight hundred pounds" },
  },
  {
    cat: "numbers_time",
    pl: "dziewięćset (900)",
    en: "nine hundred (900)",
    ar: "تسعميه",
    ph: "tus3umiyya",
    ex: { ar: "عندي تسعميه جنيه", ph: "3andi tus3umiyya geneeh", pl: "Mam dziewięćset funtów", en: "I have nine hundred pounds" },
  },
  {
    cat: "numbers_time",
    pl: "tysiąc (1 000)",
    en: "one thousand (1,000)",
    ar: "ألف",
    ph: "alf",
    ex: { ar: "عايز ألف جنيه", ph: "3aayez alf geneeh", pl: "Chcę tysiąc funtów", en: "I want a thousand pounds" },
  },
  {
    cat: "numbers_time",
    pl: "dwa tysiące (2 000)",
    en: "two thousand (2,000)",
    ar: "ألفين",
    ph: "alfeen",
    ex: { ar: "عندي ألفين جنيه", ph: "3andi alfeen geneeh", pl: "Mam dwa tysiące funtów", en: "I have two thousand pounds" },
  },
  {
    cat: "numbers_time",
    pl: "trzy tysiące (3 000)",
    en: "three thousand (3,000)",
    ar: "تلات تلاف",
    ph: "talat talaaf",
    ex: { ar: "ده تلات تلاف جنيه", ph: "da talat talaaf geneeh", pl: "To trzy tysiące funtów", en: "That's three thousand pounds" },
  },
  {
    cat: "numbers_time",
    pl: "cztery tysiące (4 000)",
    en: "four thousand (4,000)",
    ar: "أربع تلاف",
    ph: "arba3 talaaf",
    ex: { ar: "عايز أربع تلاف جنيه", ph: "3aayez arba3 talaaf geneeh", pl: "Chcę cztery tysiące funtów", en: "I want four thousand pounds" },
  },
  {
    cat: "numbers_time",
    pl: "pięć tysięcy (5 000)",
    en: "five thousand (5,000)",
    ar: "خمس تلاف",
    ph: "khamas talaaf",
    ex: { ar: "عندي خمس تلاف جنيه", ph: "3andi khamas talaaf geneeh", pl: "Mam pięć tysięcy funtów", en: "I have five thousand pounds" },
  },
  {
    cat: "numbers_time",
    pl: "sześć tysięcy (6 000)",
    en: "six thousand (6,000)",
    ar: "ست تلاف",
    ph: "sit talaaf",
    ex: { ar: "ده ست تلاف جنيه", ph: "da sit talaaf geneeh", pl: "To sześć tysięcy funtów", en: "That's six thousand pounds" },
  },
  {
    cat: "numbers_time",
    pl: "siedem tysięcy (7 000)",
    en: "seven thousand (7,000)",
    ar: "سبع تلاف",
    ph: "saba3 talaaf",
    ex: { ar: "عايز سبع تلاف جنيه", ph: "3aayez saba3 talaaf geneeh", pl: "Chcę siedem tysięcy funtów", en: "I want seven thousand pounds" },
  },
  {
    cat: "numbers_time",
    pl: "osiem tysięcy (8 000)",
    en: "eight thousand (8,000)",
    ar: "تمن تلاف",
    ph: "taman talaaf",
    ex: { ar: "عندي تمن تلاف جنيه", ph: "3andi taman talaaf geneeh", pl: "Mam osiem tysięcy funtów", en: "I have eight thousand pounds" },
  },
  {
    cat: "numbers_time",
    pl: "dziewięć tysięcy (9 000)",
    en: "nine thousand (9,000)",
    ar: "تسع تلاف",
    ph: "tisa3 talaaf",
    ex: { ar: "ده تسع تلاف جنيه", ph: "da tisa3 talaaf geneeh", pl: "To dziewięć tysięcy funtów", en: "That's nine thousand pounds" },
  },
  {
    cat: "numbers_time",
    pl: "dziesięć tysięcy (10 000)",
    en: "ten thousand (10,000)",
    ar: "عشر تلاف",
    ph: "3ashar talaaf",
    ex: { ar: "البيت ده عشر تلاف جنيه", ph: "el-beet da 3ashar talaaf geneeh", pl: "Ten dom kosztuje dziesięć tysięcy funtów", en: "This house costs ten thousand pounds" },
  },
  {
    cat: "numbers_time",
    pl: "sto tysięcy (100 000)",
    en: "one hundred thousand (100,000)",
    ar: "ميه ألف",
    ph: "miyyat alf",
    ex: { ar: "العربية دي ميه ألف جنيه", ph: "el-3arabiyya di miyyat alf geneeh", pl: "Ten samochód kosztuje sto tysięcy funtów", en: "This car costs a hundred thousand pounds" },
  },
  {
    cat: "numbers_time",
    pl: "milion (1 000 000)",
    en: "one million (1,000,000)",
    ar: "مليون",
    ph: "milyoon",
    ex: { ar: "البيت ده بمليون جنيه", ph: "el-beet da bimilyoon geneeh", pl: "Ten dom kosztuje milion funtów", en: "This house costs a million pounds" },
  },
  // ---- Godzina: liczby w praktyce ----
  {
    cat: "numbers_time",
    pl: "jest piąta (godzina)",
    en: "it's five o'clock",
    ar: "الساعة خمسة",
    ph: "essaa3a khamsa",
    ex: { ar: "الساعة كام؟ الساعة خمسة", ph: "essaa3a kaam? essaa3a khamsa", pl: "Która godzina? Jest piąta", en: "What time is it? It's five" },
  },
  {
    cat: "numbers_time",
    pl: "jest wpół do szóstej",
    en: "it's half past five",
    ar: "الساعة خمسة ونص",
    ph: "essaa3a khamsa wi nuSS",
    ex: { ar: "الساعة خمسة ونص دلوقتي", ph: "essaa3a khamsa wi nuSS dilwa2ti", pl: "Jest teraz wpół do szóstej", en: "It's half past five now" },
  },
  {
    cat: "numbers_time",
    pl: "piętnaście po piątej",
    en: "quarter past five",
    ar: "الساعة خمسة وربع",
    ph: "essaa3a khamsa wi rub3",
    ex: { ar: "هنتقابل الساعة خمسة وربع", ph: "hanet2aabel essaa3a khamsa wi rub3", pl: "Spotkamy się piętnaście po piątej", en: "We'll meet at quarter past five" },
  },
  {
    cat: "numbers_time",
    pl: "za piętnaście szósta",
    en: "quarter to six",
    ar: "الساعة ستة إلا ربع",
    ph: "essaa3a setta illa rub3",
    ex: { ar: "هوصل الساعة ستة إلا ربع", ph: "hawSal essaa3a setta illa rub3", pl: "Przyjadę za piętnaście szósta", en: "I'll come at quarter to six" },
  },
  {
    cat: "numbers_time",
    pl: "za dziesięć minut",
    en: "in ten minutes",
    ar: "بعد عشر دقايق",
    ph: "ba3d 3ashar da2aayi2",
    ex: { ar: "هوصل بعد عشر دقايق", ph: "hawSal ba3d 3ashar da2aayi2", pl: "Przyjadę za dziesięć minut", en: "I'll come in ten minutes" },
  },
  {
    cat: "numbers_time",
    pl: "dwadzieścia minut temu",
    en: "twenty minutes ago",
    ar: "من عشرين دقيقة",
    ph: "min 3ishriin di2ii2a",
    ex: { ar: "هو وصل من عشرين دقيقة", ph: "huwwa waSal min 3ishriin di2ii2a", pl: "On przyjechał dwadzieścia minut temu", en: "He arrived twenty minutes ago" },
  },
  {
    cat: "numbers_time",
    pl: "o siódmej wieczorem",
    en: "at seven in the evening",
    ar: "الساعة سبعة بالليل",
    ph: "essaa3a sab3a bil-leel",
    ex: { ar: "هنتقابل الساعة سبعة بالليل", ph: "hanet2aabel essaa3a sab3a bil-leel", pl: "Spotkamy się o siódmej wieczorem", en: "We'll meet at seven in the evening" },
  },
  {
    cat: "numbers_time",
    pl: "o dziewiątej rano",
    en: "at nine in the morning",
    ar: "الساعة تسعة الصبح",
    ph: "essaa3a tes3a iS-SubH",
    ex: { ar: "الشغل بيبدأ الساعة تسعة الصبح", ph: "esh-shughl beyebda2 essaa3a tes3a iS-SubH", pl: "Praca zaczyna się o dziewiątej rano", en: "Work starts at nine in the morning" },
  },
  // ---- Pogoda: liczby w praktyce ----
  {
    cat: "numbers_time",
    pl: "temperatura wynosi trzydzieści stopni",
    en: "the temperature is thirty degrees",
    ar: "الحرارة تلاتين درجة",
    ph: "el-Haraara talatiin daraga",
    ex: { ar: "النهاردة الحرارة تلاتين درجة", ph: "ennaharda el-Haraara talatiin daraga", pl: "Dzisiaj temperatura wynosi trzydzieści stopni", en: "Today the temperature is thirty degrees" },
  },
  {
    cat: "numbers_time",
    pl: "ile jest stopni dzisiaj?",
    en: "how many degrees is it today?",
    ar: "الحرارة كام درجة النهاردة؟",
    ph: "el-Haraara kaam daraga ennaharda?",
    ex: { ar: "الحرارة كام درجة النهاردة؟ أربعين درجة", ph: "el-Haraara kaam daraga ennaharda? arbe3iin daraga", pl: "Ile jest stopni dzisiaj? Czterdzieści stopni", en: "How many degrees is it today? Forty degrees" },
  },
  {
    cat: "numbers_time",
    pl: "jest czterdzieści stopni, bardzo gorąco",
    en: "it's forty degrees, very hot",
    ar: "أربعين درجة، الجو حر جدا",
    ph: "arbe3iin daraga, el-gaww Harr giddan",
    ex: { ar: "النهاردة أربعين درجة، الجو حر جدا", ph: "ennaharda arbe3iin daraga, el-gaww Harr giddan", pl: "Dzisiaj jest czterdzieści stopni, bardzo gorąco", en: "It's forty degrees today, very hot" },
  },
  {
    cat: "numbers_time",
    pl: "tylko dziesięć stopni, bardzo zimno",
    en: "only ten degrees, very cold",
    ar: "عشرة درجة بس، الجو برد جدا",
    ph: "3ashara daraga bas, el-gaww bard giddan",
    ex: { ar: "بكرة عشرة درجة بس، الجو برد جدا", ph: "bukra 3ashara daraga bas, el-gaww bard giddan", pl: "Jutro jest tylko dziesięć stopni, bardzo zimno", en: "Tomorrow it's only ten degrees, very cold" },
  },
  {
    cat: "numbers_time",
    pl: "prognoza na pięć dni",
    en: "the five-day forecast",
    ar: "نشرة الجو لخمس تيام",
    ph: "nashret el-gaww li-khamas tiyaam",
    ex: { ar: "شوفت نشرة الجو لخمس تيام؟", ph: "shuft nashret el-gaww li-khamas tiyaam?", pl: "Widziałeś prognozę na pięć dni?", en: "Did you see the five-day forecast?" },
  },
  {
    cat: "numbers_time",
    pl: "będzie dwadzieścia pięć stopni jutro",
    en: "it'll be twenty-five degrees tomorrow",
    ar: "بكرة هتكون خمسة وعشرين درجة",
    ph: "bukra hatkuun khamsa wi 3ishriin daraga",
    ex: { ar: "بكرة هتكون خمسة وعشرين درجة، جو لطيف", ph: "bukra hatkuun khamsa wi 3ishriin daraga, gaww laTiif", pl: "Jutro będzie dwadzieścia pięć stopni, miła pogoda", en: "Tomorrow it'll be twenty-five degrees, nice weather" },
  },
  // ---- Dni tygodnia ----
  {
    cat: "calendar",
    pl: "niedziela",
    en: "Sunday",
    ar: "يوم الحد",
    ph: "yoom el-Hadd",
    ex: { ar: "هشوفك يوم الحد", ph: "hashuufak yoom el-Hadd", pl: "Zobaczę się z tobą w niedzielę", en: "I'll see you on Sunday" },
  },
  {
    cat: "calendar",
    pl: "poniedziałek",
    en: "Monday",
    ar: "يوم الاتنين",
    ph: "yoom el-etneen",
    ex: { ar: "الشغل بيبدأ يوم الاتنين", ph: "esh-shughl beyebda2 yoom el-etneen", pl: "Praca zaczyna się w poniedziałek", en: "Work starts on Monday" },
  },
  {
    cat: "calendar",
    pl: "wtorek",
    en: "Tuesday",
    ar: "يوم التلات",
    ph: "yoom et-talaat",
    ex: { ar: "عندي اجتماع يوم التلات", ph: "3andi egtimaa3 yoom et-talaat", pl: "Mam spotkanie we wtorek", en: "I have a meeting on Tuesday" },
  },
  {
    cat: "calendar",
    pl: "środa",
    en: "Wednesday",
    ar: "يوم الأربع",
    ph: "yoom el-arba3",
    ex: { ar: "هروح المطعم يوم الأربع", ph: "haruuH el-maT3am yoom el-arba3", pl: "Pójdę do restauracji w środę", en: "I'll go to a restaurant on Wednesday" },
  },
  {
    cat: "calendar",
    pl: "czwartek",
    en: "Thursday",
    ar: "يوم الخميس",
    ph: "yoom el-khamiis",
    ex: { ar: "بكرة يوم الخميس", ph: "bukra yoom el-khamiis", pl: "Jutro jest czwartek", en: "Tomorrow is Thursday" },
  },
  {
    cat: "calendar",
    pl: "piątek",
    en: "Friday",
    ar: "يوم الجمعة",
    ph: "yoom el-gum3a",
    ex: { ar: "يوم الجمعة أجازة", ph: "yoom el-gum3a agaaza", pl: "Piątek jest wolny (dniem wolnym)", en: "Friday is a day off" },
  },
  {
    cat: "calendar",
    pl: "sobota",
    en: "Saturday",
    ar: "يوم السبت",
    ph: "yoom es-sabt",
    ex: { ar: "يوم السبت برضو أجازة", ph: "yoom es-sabt barDu agaaza", pl: "Sobota też jest wolna", en: "Saturday is a day off too" },
  },
  {
    cat: "calendar",
    pl: "jaki dzisiaj jest dzień?",
    en: "what day is it today?",
    ar: "النهاردة ايه؟",
    ph: "ennaharda eeh?",
    ex: { ar: "النهاردة ايه؟ النهاردة الأربع", ph: "ennaharda eeh? ennaharda el-arba3", pl: "Jaki dzisiaj jest dzień? Dzisiaj jest środa", en: "What day is it today? Today is Wednesday" },
  },
  {
    cat: "calendar",
    pl: "dzień, dni",
    en: "day, days",
    ar: "يوم، تيام",
    ph: "yoom, tiyaam",
    ex: { ar: "هقعد هناك تلات تيام", ph: "ha2aud hinaak talat tiyaam", pl: "Zostanę tam trzy dni", en: "I'll stay there for three days" },
  },
  {
    cat: "calendar",
    pl: "tydzień",
    en: "week",
    ar: "أسبوع",
    ph: "isbuu3",
    ex: { ar: "هشوفك الإسبوع الجاي", ph: "hashuufak el-isbuu3 el-gayy", pl: "Zobaczę się z tobą w następnym tygodniu", en: "I'll see you next week" },
  },
  // ---- Miesiące ----
  {
    cat: "calendar",
    pl: "styczeń",
    en: "January",
    ar: "يناير",
    ph: "yanaayer",
    ex: { ar: "عيد ميلادي في يناير", ph: "3iid milaadi fi yanaayer", pl: "Moje urodziny są w styczniu", en: "My birthday is in January" },
  },
  {
    cat: "calendar",
    pl: "luty",
    en: "February",
    ar: "فبراير",
    ph: "febraayer",
    ex: { ar: "هنسافر في فبراير", ph: "hanesaafer fi febraayer", pl: "Wyjedziemy w lutym", en: "We'll leave in February" },
  },
  {
    cat: "calendar",
    pl: "marzec",
    en: "March",
    ar: "مارس",
    ph: "maares",
    ex: { ar: "الجو بيتحسن في مارس", ph: "el-gaww beyetHassen fi maares", pl: "Pogoda się poprawia w marcu", en: "The weather gets better in March" },
  },
  {
    cat: "calendar",
    pl: "kwiecień",
    en: "April",
    ar: "إبريل",
    ph: "ebriil",
    ex: { ar: "إبريل شهر لطيف في مصر", ph: "ebriil shahr laTiif fi maSr", pl: "Kwiecień jest miłym miesiącem w Egipcie", en: "April is a nice month in Egypt" },
  },
  {
    cat: "calendar",
    pl: "maj",
    en: "May",
    ar: "مايو",
    ph: "maayo",
    ex: { ar: "بنتجوز في مايو", ph: "bnetgawwez fi maayo", pl: "Bierzemy ślub w maju", en: "We're getting married in May" },
  },
  {
    cat: "calendar",
    pl: "czerwiec",
    en: "June",
    ar: "يونيو",
    ph: "yonyo",
    ex: { ar: "المدرسة بتخلص في يونيو", ph: "el-madrasa betkhallaS fi yonyo", pl: "Szkoła się kończy w czerwcu", en: "School ends in June" },
  },
  {
    cat: "calendar",
    pl: "lipiec",
    en: "July",
    ar: "يوليو",
    ph: "yolyo",
    ex: { ar: "الجو حر جدا في يوليو", ph: "el-gaww Harr giddan fi yolyo", pl: "W lipcu jest bardzo gorąco", en: "It's very hot in July" },
  },
  {
    cat: "calendar",
    pl: "sierpień",
    en: "August",
    ar: "أغسطس",
    ph: "aghosTos",
    ex: { ar: "هروح البحر في أغسطس", ph: "haruuH el-baHr fi aghosTos", pl: "Pojadę nad morze w sierpniu", en: "I'll go to the seaside in August" },
  },
  {
    cat: "calendar",
    pl: "wrzesień",
    en: "September",
    ar: "سبتمبر",
    ph: "sebtember",
    ex: { ar: "المدرسة بتبدأ في سبتمبر", ph: "el-madrasa betebda2 fi sebtember", pl: "Szkoła zaczyna się we wrześniu", en: "School starts in September" },
  },
  {
    cat: "calendar",
    pl: "październik",
    en: "October",
    ar: "أكتوبر",
    ph: "oktoobar",
    ex: { ar: "الجو حلو في أكتوبر", ph: "el-gaww Helw fi oktoobar", pl: "Pogoda jest piękna w październiku", en: "The weather is beautiful in October" },
  },
  {
    cat: "calendar",
    pl: "listopad",
    en: "November",
    ar: "نوفمبر",
    ph: "novamber",
    ex: { ar: "بيبدأ يبرد في نوفمبر", ph: "beyebda2 yebrad fi novamber", pl: "Zaczyna się robić zimno w listopadzie", en: "It starts getting cold in November" },
  },
  {
    cat: "calendar",
    pl: "grudzień",
    en: "December",
    ar: "ديسمبر",
    ph: "disamber",
    ex: { ar: "هقعد مع عيلتي في ديسمبر", ph: "ha2aud ma3a 3eelti fi disamber", pl: "Spędzę czas z rodziną w grudniu", en: "I'll spend time with my family in December" },
  },
  {
    cat: "calendar",
    pl: "miesiąc",
    en: "month",
    ar: "شهر",
    ph: "shahr",
    ex: { ar: "هقعد في مصر شهر", ph: "ha2aud fi maSr shahr", pl: "Zostanę w Egipcie miesiąc", en: "I'll stay in Egypt for a month" },
  },
  {
    cat: "calendar",
    pl: "w jakim miesiącu?",
    en: "in which month?",
    ar: "في أي شهر؟",
    ph: "fi ayyi shahr?",
    ex: { ar: "هتسافر في أي شهر؟", ph: "hatesaafer fi ayyi shahr?", pl: "W jakim miesiącu wyjedziesz?", en: "In which month will you leave?" },
  },
  // ---- Pory roku ----
  {
    cat: "calendar",
    pl: "lato",
    en: "summer",
    ar: "الصيف",
    ph: "eS-Seef",
    ex: { ar: "الصيف في مصر حر جدا", ph: "eS-Seef fi maSr Harr giddan", pl: "Lato w Egipcie jest bardzo gorące", en: "Summer in Egypt is very hot" },
  },
  {
    cat: "calendar",
    pl: "zima",
    en: "winter",
    ar: "الشتا",
    ph: "esh-shetaa",
    ex: { ar: "الشتا في القاهرة معتدل", ph: "esh-shetaa fil-2aahera mu3tadel", pl: "Zima w Kairze jest umiarkowana", en: "Winter in Cairo is mild" },
  },
  {
    cat: "calendar",
    pl: "wiosna",
    en: "spring",
    ar: "الربيع",
    ph: "er-rabii3",
    ex: { ar: "الربيع أحلى فصل في السنة", ph: "er-rabii3 aHla faSl fis-sana", pl: "Wiosna jest najpiękniejszą porą roku", en: "Spring is the most beautiful season" },
  },
  {
    cat: "calendar",
    pl: "jesień",
    en: "autumn / fall",
    ar: "الخريف",
    ph: "el-khariif",
    ex: { ar: "الخريف بيبدأ في سبتمبر", ph: "el-khariif beyebda2 fi sebtember", pl: "Jesień zaczyna się we wrześniu", en: "Autumn starts in September" },
  },
  {
    cat: "calendar",
    pl: "jaka jest twoja ulubiona pora roku?",
    en: "what's your favorite season?",
    ar: "إيه فصل السنة المفضل عندك؟",
    ph: "eeh faSl es-sana el-mufaDDal 3andak?",
    ex: { ar: "إيه فصل السنة المفضل عندك؟ الربيع", ph: "eeh faSl es-sana el-mufaDDal 3andak? er-rabii3", pl: "Jaka jest twoja ulubiona pora roku? Wiosna", en: "What's your favorite season? Spring" },
  },
  {
    cat: "calendar",
    pl: "rok",
    en: "year",
    ar: "سنة",
    ph: "sana",
    ex: { ar: "كل سنة وانت طيب", ph: "koll sana we (e)nta Tayyeb", pl: "Wszystkiego dobrego (co roku bądź dobry)", en: "Best wishes (may you be well every year)" },
  },
];

// ---------- Kategorie / działy tematyczne ----------
const CATEGORIES = [
  { key: "basics", label: "Powitania i podstawy", labelEn: "Greetings & basics", emoji: "👋" },
  { key: "questions", label: "Pytania i zwroty użytkowe", labelEn: "Questions & useful phrases", emoji: "❓" },
  { key: "numbers_time", label: "Liczby i czas", labelEn: "Numbers & time", emoji: "🕐" },
  { key: "calendar", label: "Dni, miesiące, pory roku", labelEn: "Days, months, seasons", emoji: "📅" },
  { key: "feelings", label: "Uczucia i samopoczucie", labelEn: "Feelings & well-being", emoji: "💭" },
  { key: "work_daily", label: "Praca i codzienność", labelEn: "Work & daily life", emoji: "💼" },
  { key: "food_shopping", label: "Jedzenie i zakupy", labelEn: "Food & shopping", emoji: "🍽️" },
  { key: "kitchen", label: "Kuchnia (potrawy, smaki)", labelEn: "Kitchen (dishes, flavors)", emoji: "🍳" },
  { key: "home_hotel", label: "Dom i hotel", labelEn: "Home & hotel", emoji: "🏠" },
  { key: "travel", label: "Podróże i transport", labelEn: "Travel & transport", emoji: "🚕" },
  { key: "body_services", label: "Ciało i drobne usługi", labelEn: "Body & small services", emoji: "🧵" },
  { key: "family", label: "Rodzina i bliscy", labelEn: "Family", emoji: "👨‍👩‍👧" },
  { key: "health", label: "Zdrowie i samopoczucie", labelEn: "Health", emoji: "🩺" },
  { key: "weather", label: "Pogoda", labelEn: "Weather", emoji: "🌤️" },
  { key: "smalltalk", label: "Small talk (rozmowy)", labelEn: "Small talk", emoji: "💭" },
  { key: "fillers", label: "Wygładzacze i reakcje", labelEn: "Fillers & reactions", emoji: "🗯️" },
  { key: "slang", label: "Slang (jak miejscowy)", labelEn: "Slang", emoji: "😎" },
  { key: "life", label: "O sobie i życiu", labelEn: "About me & life", emoji: "🙋" },
  { key: "colors", label: "Kolory", labelEn: "Colors", emoji: "🎨" },
  { key: "adjectives", label: "Przymiotniki opisowe", labelEn: "Adjectives", emoji: "📏" },
  { key: "daily_verbs", label: "Czasowniki codzienne", labelEn: "Everyday verbs", emoji: "⚡" },
  { key: "motion", label: "Czasowniki ruchu", labelEn: "Verbs of motion", emoji: "🚶" },
  { key: "time_adverbs", label: "Przysłówki czasu", labelEn: "Time adverbs", emoji: "⏰" },
  { key: "body", label: "Ciało", labelEn: "Body", emoji: "🧍" },
  { key: "clothes", label: "Ubrania", labelEn: "Clothes", emoji: "👕" },
  { key: "home_furniture", label: "Dom i meble", labelEn: "Home & furniture", emoji: "🛋️" },
  { key: "nature", label: "Natura i miejsca", labelEn: "Nature & places", emoji: "🏞️" },
  { key: "transport", label: "Transport", labelEn: "Transport", emoji: "🚗" },
  { key: "jobs", label: "Zawody", labelEn: "Jobs", emoji: "💼" },
  { key: "emotions", label: "Emocje i stany", labelEn: "Emotions", emoji: "😊" },
  { key: "animals", label: "Zwierzęta", labelEn: "Animals", emoji: "🐾" },
  { key: "ordinals", label: "Liczby porządkowe", labelEn: "Ordinal numbers", emoji: "🔢" },
  { key: "directions", label: "Kierunki i położenie", labelEn: "Directions & position", emoji: "🧭" },
  { key: "constructions", label: "Konstrukcje zdaniowe", labelEn: "Sentence patterns", emoji: "🔗" },
  { key: "culture", label: "Kultura i życie w Egipcie", labelEn: "Egyptian culture", emoji: "🇪🇬" },
  { key: "practical", label: "Praktyczne (podróże, sprawy)", labelEn: "Practical", emoji: "🧳" },
  { key: "expressions", label: "Wyrażenia codzienne", labelEn: "Everyday expressions", emoji: "💬" },
  { key: "conjunctions", label: "Spójniki i łączniki", labelEn: "Conjunctions", emoji: "🔗" },
  { key: "religious", label: "Wyrażenia religijne", labelEn: "Religious expressions", emoji: "🕌" },
  { key: "verbs", label: "Czasowniki (odmiana)", labelEn: "Verbs (conjugation)", emoji: "🔁" },
  { key: "nouns", label: "Rzeczowniki (liczba)", labelEn: "Nouns (number)", emoji: "🔢" },
  { key: "questions_pron", label: "Zaimki pytające", labelEn: "Question words", emoji: "❔" },
  { key: "grammar", label: "Gramatyka (wskazujące, liczebniki, przyimki)", labelEn: "Grammar (demonstratives, numerals, prepositions)", emoji: "🧩" },
  { key: "other", label: "Inne / dodane przez Ciebie", labelEn: "Other / added by you", emoji: "✨" },
];

function categoryLabel(key, lang) {
  const c = CATEGORIES.find((c) => c.key === key);
  const fallback = lang === "en" ? "✨ Other / added by you" : "✨ Inne / dodane przez Ciebie";
  return c ? `${c.emoji} ${lang === "en" && c.labelEn ? c.labelEn : c.label}` : fallback;
}


// Każdy czasownik: bezokolicznik (forma "on"), znaczenie, oraz odmiana
// przez 8 zaimków z transkrypcją i przykładowym zdaniem.
const PRONOUNS = [
  { key: "ana", pl: "ja", ar: "أنا", ph: "ana" },
  { key: "enta", pl: "ty (m.)", ar: "انت", ph: "enta" },
  { key: "enti", pl: "ty (f.)", ar: "انتي", ph: "enti" },
  { key: "huwwa", pl: "on", ar: "هو", ph: "huwwa" },
  { key: "heyya", pl: "ona", ar: "هي", ph: "heyya" },
  { key: "e7na", pl: "my", ar: "احنا", ph: "eHna" },
  { key: "ento", pl: "wy", ar: "انتو", ph: "ento" },
  { key: "homma", pl: "oni/one", ar: "هم", ph: "homma" },
];

// Wzory odmiany czasownika REGULARNEGO (trójspółgłoskowego) na przykładzie
// كتب (k-t-b, „pisać"). Pokazuje przedrostki/przyrostki dla każdej osoby —
// systematyka, dzięki której można odmienić dowolny regularny czasownik.
const CONJ_PATTERN = {
  present: {
    label: "teraźniejszy (بـ + temat)",
    note: "Czas teraźniejszy/ciągły: przedrostek بـ (bi-) + osobowy przedrostek. Temat: -ktib-.", noteEn: "Present/continuous: the بـ (bi-) prefix + a personal prefix. Stem: -ktib-.",
    rows: [
      { pron: "ana", prefix: "با-", ar: "بكتب", ph: "baktib", pl: "piszę" },
      { pron: "enta", prefix: "بتـ-", ar: "بتكتب", ph: "betiktib", pl: "piszesz (m.)" },
      { pron: "enti", prefix: "بتـ-ي", ar: "بتكتبي", ph: "betiktibi", pl: "piszesz (f.)" },
      { pron: "huwwa", prefix: "بيـ-", ar: "بيكتب", ph: "biyiktib", pl: "pisze (on)" },
      { pron: "heyya", prefix: "بتـ-", ar: "بتكتب", ph: "betiktib", pl: "pisze (ona)" },
      { pron: "e7na", prefix: "بنـ-", ar: "بنكتب", ph: "biniktib", pl: "piszemy" },
      { pron: "ento", prefix: "بتـ-وا", ar: "بتكتبوا", ph: "betiktibu", pl: "piszecie" },
      { pron: "homma", prefix: "بيـ-وا", ar: "بيكتبوا", ph: "biyiktibu", pl: "piszą" },
    ],
  },
  past: {
    label: "przeszły (temat + końcówka)",
    note: "Czas przeszły: rdzeń katab- + osobowa końcówka. Bez przedrostków.", noteEn: "Past tense: the root katab- + a personal ending. No prefixes.",
    rows: [
      { pron: "ana", prefix: "-ت", ar: "كتبت", ph: "katabt", pl: "napisałem/am" },
      { pron: "enta", prefix: "-ت", ar: "كتبت", ph: "katabt", pl: "napisałeś" },
      { pron: "enti", prefix: "-تي", ar: "كتبتي", ph: "katabti", pl: "napisałaś" },
      { pron: "huwwa", prefix: "— (rdzeń)", ar: "كتب", ph: "katab", pl: "napisał" },
      { pron: "heyya", prefix: "-ت", ar: "كتبت", ph: "katbet", pl: "napisała" },
      { pron: "e7na", prefix: "-نا", ar: "كتبنا", ph: "katabna", pl: "napisaliśmy" },
      { pron: "ento", prefix: "-توا", ar: "كتبتوا", ph: "katabtu", pl: "napisaliście" },
      { pron: "homma", prefix: "-وا", ar: "كتبوا", ph: "katabu", pl: "napisali" },
    ],
  },
  future: {
    label: "przyszły (هـ + temat)",
    note: "Czas przyszły: przedrostek هـ (ha-) zamiast بـ, reszta jak w teraźniejszym.", noteEn: "Future tense: the هـ (ha-) prefix instead of بـ, otherwise like the present.",
    rows: [
      { pron: "ana", prefix: "هـ-", ar: "هكتب", ph: "haktib", pl: "napiszę" },
      { pron: "enta", prefix: "هتـ-", ar: "هتكتب", ph: "hatiktib", pl: "napiszesz (m.)" },
      { pron: "enti", prefix: "هتـ-ي", ar: "هتكتبي", ph: "hatiktibi", pl: "napiszesz (f.)" },
      { pron: "huwwa", prefix: "هيـ-", ar: "هيكتب", ph: "hayiktib", pl: "napisze (on)" },
      { pron: "heyya", prefix: "هتـ-", ar: "هتكتب", ph: "hatiktib", pl: "napisze (ona)" },
      { pron: "e7na", prefix: "هنـ-", ar: "هنكتب", ph: "haniktib", pl: "napiszemy" },
      { pron: "ento", prefix: "هتـ-وا", ar: "هتكتبوا", ph: "hatiktibu", pl: "napiszecie" },
      { pron: "homma", prefix: "هيـ-وا", ar: "هيكتبوا", ph: "hayiktibu", pl: "napiszą" },
    ],
  },
};

// Wzory czasowników NIEREGULARNYCH — pogrupowane wg typu słabej spółgłoski.
// Dla każdego typu pokazujemy, jak zmienia się temat między czasami (to sedno
// nieregularności), na jednym reprezentatywnym czasowniku, dla 3 osób-kluczy.
const IRREGULAR_PATTERNS = [
  {
    key: "hollow",
    title: "Puste (środkowa głoska słaba)",
    desc: "Środek rdzenia to długie ā/ū/ī, które SKRACA się w czasie przeszłym.",
    example: "نام (n-w-m, „spać”): naam → nemt",
    rows: [
      { pron: "huwwa", present: { ar: "بينام", ph: "biynaam" }, past: { ar: "نام", ph: "naam" }, future: { ar: "هينام", ph: "haynaam" } },
      { pron: "ana", present: { ar: "بنام", ph: "banaam" }, past: { ar: "نمت", ph: "nemt" }, future: { ar: "هنام", ph: "hanaam" } },
      { pron: "homma", present: { ar: "بيناموا", ph: "biynaamu" }, past: { ar: "ناموا", ph: "naamu" }, future: { ar: "هيناموا", ph: "haynaamu" } },
    ],
    note: "Uwaga na przeszły „ja/ty”: naam → nemt (długie „aa” staje się krótkim „e”). Tak samo: raaḥ→ruḥt, shaaf→shuft.", noteEn: "Note the past \"I/you\": naam → nemt (long \"aa\" becomes short \"e\"). Same with: raaḥ → roḥt.",
  },
  {
    key: "defective",
    title: "Ubytkowe (ostatnia głoska słaba)",
    desc: "Kończą się na samogłoskę (-i/-a) zamiast spółgłoski; przeszły ma -eet.",
    example: "اشترى (sh-r-y, „kupować”): ishtara → ishtareet",
    rows: [
      { pron: "huwwa", present: { ar: "بيشتري", ph: "biyishteri" }, past: { ar: "اشترى", ph: "ishtara" }, future: { ar: "هيشتري", ph: "hayishteri" } },
      { pron: "ana", present: { ar: "بشتري", ph: "bashteri" }, past: { ar: "اشتريت", ph: "ishtareet" }, future: { ar: "هشتري", ph: "hashteri" } },
      { pron: "homma", present: { ar: "بيشتروا", ph: "biyishteru" }, past: { ar: "اشتروا", ph: "ishtaru" }, future: { ar: "هيشتروا", ph: "hayishteru" } },
    ],
    note: "Końcówka „ja/ty” w przeszłym to -eet (ishtareet). Tak samo: eddi→eddeet (dać), nesi→neseet (zapomnieć).", noteEn: "The past \"I/you\" ending is -eet (ishtareet). Same with: eddi→eddeet (to give), nesi→neseet (to forget).",
  },
  {
    key: "doubled",
    title: "Podwojone (2. i 3. głoska takie same)",
    desc: "Rdzeń kończy się podwójną spółgłoską; w przeszłym „ja/ty” rozwija się w -eet.",
    example: "حب (ḥ-b-b, „lubić”): ḥabb → ḥabbeet",
    rows: [
      { pron: "huwwa", present: { ar: "بيحب", ph: "biyHebb" }, past: { ar: "حب", ph: "Habb" }, future: { ar: "هيحب", ph: "hayHebb" } },
      { pron: "ana", present: { ar: "بحب", ph: "baHebb" }, past: { ar: "حبيت", ph: "Habbeet" }, future: { ar: "هحب", ph: "haHebb" } },
      { pron: "homma", present: { ar: "بيحبوا", ph: "biyHebbu" }, past: { ar: "حبوا", ph: "Habbu" }, future: { ar: "هيحبوا", ph: "hayHebbu" } },
    ],
    note: "Podwójna spółgłoska „rozdziela się” przez -eet w 1./2. os. przeszłego: Habb → Habbeet.", noteEn: "A doubled consonant \"splits\" via -eet in the 1st/2nd person past: Habb → Habbeet.",
  },
  {
    key: "special",
    title: "Zupełnie nieregularne",
    desc: "Mają własny wzór — trzeba je zapamiętać osobno.",
    example: "جه (przyjść): biyiigi → geh/gum; rozkaźnik ta3aala",
    rows: [
      { pron: "huwwa", present: { ar: "بييجي", ph: "biyiigi" }, past: { ar: "جه", ph: "geh" }, future: { ar: "هييجي", ph: "hayiigi" } },
      { pron: "ana", present: { ar: "باجي", ph: "baagi" }, past: { ar: "جيت", ph: "geet" }, future: { ar: "هاجي", ph: "haagi" } },
      { pron: "homma", present: { ar: "بييجوا", ph: "biyiigu" }, past: { ar: "جم", ph: "gum" }, future: { ar: "هييجوا", ph: "hayiigu" } },
    ],
    note: "„przyjść” ma nietypowy przeszły (geh/gum) i rozkaźnik z innego rdzenia (ta3aala). Podobnie „wziąć” (khad) i „jeść” (kal) gubią hamzę.", noteEn: "\"to come\" has an irregular past (geh/gum) and an imperative from a different root (ta3aala). Irregular overall.",
  },
];

const VERBS = [
  {
    pl: "chcieć",
    en: "to want",
    ar: "عايز",
    ph: "3aayez",
    note: "Nie jest to czasownik w klasycznym sensie, lecz aktywny imiesłów (ism fa3il) — odmienia się jak przymiotnik przez rodzaj/liczbę, nie przez osobę. W czasie przeszłym i przyszłym łączy się z czasownikiem „być” (kaan/hykuun).", noteEn: "This isn't a verb in the classic sense but an active participle (ism fa3il) — it inflects like an adjective for gender/number, not for person. In the past and future it combines with the verb \"to be\" (kaan/hykuun).",
    tenses: {
      present: [
        { pronoun: "ana", ar: "عايز / عايزة", ph: "3aayez / 3ayza", pl: "chcę (m./f.)" },
        { pronoun: "enta", ar: "عايز", ph: "3aayez", pl: "chcesz (m.)" },
        { pronoun: "enti", ar: "عايزة", ph: "3ayza", pl: "chcesz (f.)" },
        { pronoun: "huwwa", ar: "عايز", ph: "3aayez", pl: "chce (on)" },
        { pronoun: "heyya", ar: "عايزة", ph: "3ayza", pl: "chce (ona)" },
        { pronoun: "e7na", ar: "عايزين", ph: "3ayziin", pl: "chcemy" },
        { pronoun: "ento", ar: "عايزين", ph: "3ayziin", pl: "chcecie" },
        { pronoun: "homma", ar: "عايزين", ph: "3ayziin", pl: "chcą" },
      ],
      past: [
        { pronoun: "ana", ar: "كنت عايز / عايزة", ph: "kunt 3aayez / 3ayza", pl: "chciałem/am (m./f.)" },
        { pronoun: "enta", ar: "كنت عايز", ph: "kunt 3aayez", pl: "chciałeś (m.)" },
        { pronoun: "enti", ar: "كنتي عايزة", ph: "kunti 3ayza", pl: "chciałaś (f.)" },
        { pronoun: "huwwa", ar: "كان عايز", ph: "kaan 3aayez", pl: "chciał (on)" },
        { pronoun: "heyya", ar: "كانت عايزة", ph: "kaanet 3ayza", pl: "chciała (ona)" },
        { pronoun: "e7na", ar: "كنا عايزين", ph: "kunna 3ayziin", pl: "chcieliśmy" },
        { pronoun: "ento", ar: "كنتوا عايزين", ph: "kuntu 3ayziin", pl: "chcieliście" },
        { pronoun: "homma", ar: "كانوا عايزين", ph: "kaanu 3ayziin", pl: "chcieli" },
      ],
      future: [
        { pronoun: "ana", ar: "هكون عايز / عايزة", ph: "hakuun 3aayez / 3ayza", pl: "będę chciał/a (m./f.)" },
        { pronoun: "enta", ar: "هتكون عايز", ph: "hatkuun 3aayez", pl: "będziesz chciał (m.)" },
        { pronoun: "enti", ar: "هتكوني عايزة", ph: "hatkuuni 3ayza", pl: "będziesz chciała (f.)" },
        { pronoun: "huwwa", ar: "هيكون عايز", ph: "haykuun 3aayez", pl: "będzie chciał (on)" },
        { pronoun: "heyya", ar: "هتكون عايزة", ph: "hatkuun 3ayza", pl: "będzie chciała (ona)" },
        { pronoun: "e7na", ar: "هنكون عايزين", ph: "hankuun 3ayziin", pl: "będziemy chcieli" },
        { pronoun: "ento", ar: "هتكونوا عايزين", ph: "hatkuunu 3ayziin", pl: "będziecie chcieli" },
        { pronoun: "homma", ar: "هيكونوا عايزين", ph: "haykuunu 3ayziin", pl: "będą chcieli" },
      ],
    },
  },
  {
    pl: "robić",
    en: "to do / to make",
    ar: "بيعمل",
    ph: "biy3mel",
    tenses: {
      present: [
        { pronoun: "ana", ar: "بعمل", ph: "ba3mel", pl: "robię" },
        { pronoun: "enta", ar: "بتعمل", ph: "bet3mel", pl: "robisz (m.)" },
        { pronoun: "enti", ar: "بتعملي", ph: "bet3mili", pl: "robisz (f.)" },
        { pronoun: "huwwa", ar: "بيعمل", ph: "biy3mel", pl: "robi (on)" },
        { pronoun: "heyya", ar: "بتعمل", ph: "bet3mel", pl: "robi (ona)" },
        { pronoun: "e7na", ar: "بنعمل", ph: "bin3mel", pl: "robimy" },
        { pronoun: "ento", ar: "بتعملوا", ph: "bet3melu", pl: "robicie" },
        { pronoun: "homma", ar: "بيعملوا", ph: "biy3melu", pl: "robią" },
      ],
      past: [
        { pronoun: "ana", ar: "عملت", ph: "3amalt", pl: "zrobiłem/am" },
        { pronoun: "enta", ar: "عملت", ph: "3amalt", pl: "zrobiłeś" },
        { pronoun: "enti", ar: "عملتي", ph: "3amalti", pl: "zrobiłaś" },
        { pronoun: "huwwa", ar: "عمل", ph: "3amal", pl: "zrobił" },
        { pronoun: "heyya", ar: "عملت", ph: "3amalet", pl: "zrobiła" },
        { pronoun: "e7na", ar: "عملنا", ph: "3amalna", pl: "zrobiliśmy" },
        { pronoun: "ento", ar: "عملتوا", ph: "3amaltu", pl: "zrobiliście" },
        { pronoun: "homma", ar: "عملوا", ph: "3amalu", pl: "zrobili" },
      ],
      future: [
        { pronoun: "ana", ar: "هعمل", ph: "ha3mel", pl: "zrobię" },
        { pronoun: "enta", ar: "هتعمل", ph: "hat3mel", pl: "zrobisz (m.)" },
        { pronoun: "enti", ar: "هتعملي", ph: "hat3mili", pl: "zrobisz (f.)" },
        { pronoun: "huwwa", ar: "هيعمل", ph: "hay3mel", pl: "zrobi (on)" },
        { pronoun: "heyya", ar: "هتعمل", ph: "hat3mel", pl: "zrobi (ona)" },
        { pronoun: "e7na", ar: "هنعمل", ph: "han3mel", pl: "zrobimy" },
        { pronoun: "ento", ar: "هتعملوا", ph: "hat3melu", pl: "zrobicie" },
        { pronoun: "homma", ar: "هيعملوا", ph: "hay3melu", pl: "zrobią" },
      ],
    },
  },
  {
    pl: "iść / jechać",
    en: "to go",
    ar: "بيروح",
    ph: "biyruuH",
    tenses: {
      present: [
        { pronoun: "ana", ar: "بروح", ph: "baruuH", pl: "idę" },
        { pronoun: "enta", ar: "بتروح", ph: "betruuH", pl: "idziesz (m.)" },
        { pronoun: "enti", ar: "بتروحي", ph: "betruuHi", pl: "idziesz (f.)" },
        { pronoun: "huwwa", ar: "بيروح", ph: "biyruuH", pl: "idzie (on)" },
        { pronoun: "heyya", ar: "بتروح", ph: "betruuH", pl: "idzie (ona)" },
        { pronoun: "e7na", ar: "بنروح", ph: "binruuH", pl: "idziemy" },
        { pronoun: "ento", ar: "بتروحوا", ph: "betruuHu", pl: "idziecie" },
        { pronoun: "homma", ar: "بيروحوا", ph: "biyruuHu", pl: "idą" },
      ],
      past: [
        { pronoun: "ana", ar: "رحت", ph: "ruHt", pl: "poszedłem/am" },
        { pronoun: "enta", ar: "رحت", ph: "ruHt", pl: "poszedłeś" },
        { pronoun: "enti", ar: "رحتي", ph: "ruHti", pl: "poszłaś" },
        { pronoun: "huwwa", ar: "راح", ph: "raaH", pl: "poszedł" },
        { pronoun: "heyya", ar: "راحت", ph: "raaHet", pl: "poszła" },
        { pronoun: "e7na", ar: "رحنا", ph: "ruHna", pl: "poszliśmy" },
        { pronoun: "ento", ar: "رحتوا", ph: "ruHtu", pl: "poszliście" },
        { pronoun: "homma", ar: "راحوا", ph: "raaHu", pl: "poszli" },
      ],
      future: [
        { pronoun: "ana", ar: "هروح", ph: "haruuH", pl: "pójdę" },
        { pronoun: "enta", ar: "هتروح", ph: "hatruuH", pl: "pójdziesz (m.)" },
        { pronoun: "enti", ar: "هتروحي", ph: "hatruuHi", pl: "pójdziesz (f.)" },
        { pronoun: "huwwa", ar: "هيروح", ph: "hayruuH", pl: "pójdzie (on)" },
        { pronoun: "heyya", ar: "هتروح", ph: "hatruuH", pl: "pójdzie (ona)" },
        { pronoun: "e7na", ar: "هنروح", ph: "hanruuH", pl: "pójdziemy" },
        { pronoun: "ento", ar: "هتروحوا", ph: "hatruuHu", pl: "pójdziecie" },
        { pronoun: "homma", ar: "هيروحوا", ph: "hayruuHu", pl: "pójdą" },
      ],
    },
  },
  {
    pl: "jeść",
    en: "to eat",
    ar: "بياكل",
    ph: "biyaakul",
    tenses: {
      present: [
        { pronoun: "ana", ar: "باكل", ph: "baakul", pl: "jem" },
        { pronoun: "enta", ar: "بتاكل", ph: "betaakul", pl: "jesz (m.)" },
        { pronoun: "enti", ar: "بتاكلي", ph: "betaakli", pl: "jesz (f.)" },
        { pronoun: "huwwa", ar: "بياكل", ph: "biyaakul", pl: "je (on)" },
        { pronoun: "heyya", ar: "بتاكل", ph: "betaakul", pl: "je (ona)" },
        { pronoun: "e7na", ar: "بناكل", ph: "binaakul", pl: "jemy" },
        { pronoun: "ento", ar: "بتاكلوا", ph: "betaaklu", pl: "jecie" },
        { pronoun: "homma", ar: "بياكلوا", ph: "biyaaklu", pl: "jedzą" },
      ],
      past: [
        { pronoun: "ana", ar: "اكلت", ph: "akalt", pl: "zjadłem/am" },
        { pronoun: "enta", ar: "اكلت", ph: "akalt", pl: "zjadłeś" },
        { pronoun: "enti", ar: "اكلتي", ph: "akalti", pl: "zjadłaś" },
        { pronoun: "huwwa", ar: "اكل", ph: "akal", pl: "zjadł" },
        { pronoun: "heyya", ar: "اكلت", ph: "akalet", pl: "zjadła" },
        { pronoun: "e7na", ar: "اكلنا", ph: "akalna", pl: "zjedliśmy" },
        { pronoun: "ento", ar: "اكلتوا", ph: "akaltu", pl: "zjedliście" },
        { pronoun: "homma", ar: "اكلوا", ph: "akalu", pl: "zjedli" },
      ],
      future: [
        { pronoun: "ana", ar: "هاكل", ph: "haakul", pl: "zjem" },
        { pronoun: "enta", ar: "هتاكل", ph: "hataakul", pl: "zjesz (m.)" },
        { pronoun: "enti", ar: "هتاكلي", ph: "hataakli", pl: "zjesz (f.)" },
        { pronoun: "huwwa", ar: "هياكل", ph: "hayaakul", pl: "zje (on)" },
        { pronoun: "heyya", ar: "هتاكل", ph: "hataakul", pl: "zje (ona)" },
        { pronoun: "e7na", ar: "هناكل", ph: "hanaakul", pl: "zjemy" },
        { pronoun: "ento", ar: "هتاكلوا", ph: "hataaklu", pl: "zjecie" },
        { pronoun: "homma", ar: "هياكلوا", ph: "hayaaklu", pl: "zjedzą" },
      ],
    },
  },
  {
    pl: "pić",
    en: "to drink",
    ar: "بيشرب",
    ph: "biyishrab",
    tenses: {
      present: [
        { pronoun: "ana", ar: "بشرب", ph: "bashrab", pl: "piję" },
        { pronoun: "enta", ar: "بتشرب", ph: "betishrab", pl: "pijesz (m.)" },
        { pronoun: "enti", ar: "بتشربي", ph: "betishrabi", pl: "pijesz (f.)" },
        { pronoun: "huwwa", ar: "بيشرب", ph: "biyishrab", pl: "pije (on)" },
        { pronoun: "heyya", ar: "بتشرب", ph: "betishrab", pl: "pije (ona)" },
        { pronoun: "e7na", ar: "بنشرب", ph: "binishrab", pl: "pijemy" },
        { pronoun: "ento", ar: "بتشربوا", ph: "betishrabu", pl: "pijecie" },
        { pronoun: "homma", ar: "بيشربوا", ph: "biyishrabu", pl: "piją" },
      ],
      past: [
        { pronoun: "ana", ar: "شربت", ph: "shrebt", pl: "wypiłem/am" },
        { pronoun: "enta", ar: "شربت", ph: "shrebt", pl: "wypiłeś" },
        { pronoun: "enti", ar: "شربتي", ph: "shrebti", pl: "wypiłaś" },
        { pronoun: "huwwa", ar: "شرب", ph: "shereb", pl: "wypił" },
        { pronoun: "heyya", ar: "شربت", ph: "shrebet", pl: "wypiła" },
        { pronoun: "e7na", ar: "شربنا", ph: "shrebna", pl: "wypiliśmy" },
        { pronoun: "ento", ar: "شربتوا", ph: "shrebtu", pl: "wypiliście" },
        { pronoun: "homma", ar: "شربوا", ph: "shrebu", pl: "wypili" },
      ],
      future: [
        { pronoun: "ana", ar: "هشرب", ph: "hashrab", pl: "wypiję" },
        { pronoun: "enta", ar: "هتشرب", ph: "hatishrab", pl: "wypijesz (m.)" },
        { pronoun: "enti", ar: "هتشربي", ph: "hatishrabi", pl: "wypijesz (f.)" },
        { pronoun: "huwwa", ar: "هيشرب", ph: "hayishrab", pl: "wypije (on)" },
        { pronoun: "heyya", ar: "هتشرب", ph: "hatishrab", pl: "wypije (ona)" },
        { pronoun: "e7na", ar: "هنشرب", ph: "hanishrab", pl: "wypijemy" },
        { pronoun: "ento", ar: "هتشربوا", ph: "hatishrabu", pl: "wypijecie" },
        { pronoun: "homma", ar: "هيشربوا", ph: "hayishrabu", pl: "wypiją" },
      ],
    },
  },
  {
    pl: "mówić",
    en: "to speak",
    ar: "بيتكلم",
    ph: "biyetkallem",
    tenses: {
      present: [
        { pronoun: "ana", ar: "باتكلم", ph: "batkallem", pl: "mówię" },
        { pronoun: "enta", ar: "بتتكلم", ph: "betetkallem", pl: "mówisz (m.)" },
        { pronoun: "enti", ar: "بتتكلمي", ph: "betetkallemi", pl: "mówisz (f.)" },
        { pronoun: "huwwa", ar: "بيتكلم", ph: "biyetkallem", pl: "mówi (on)" },
        { pronoun: "heyya", ar: "بتتكلم", ph: "betetkallem", pl: "mówi (ona)" },
        { pronoun: "e7na", ar: "بنتكلم", ph: "bnetkallem", pl: "mówimy" },
        { pronoun: "ento", ar: "بتتكلموا", ph: "betetkallemu", pl: "mówicie" },
        { pronoun: "homma", ar: "بيتكلموا", ph: "biyetkallemu", pl: "mówią" },
      ],
      past: [
        { pronoun: "ana", ar: "اتكلمت", ph: "etkallemt", pl: "powiedziałem/am" },
        { pronoun: "enta", ar: "اتكلمت", ph: "etkallemt", pl: "powiedziałeś" },
        { pronoun: "enti", ar: "اتكلمتي", ph: "etkallemti", pl: "powiedziałaś" },
        { pronoun: "huwwa", ar: "اتكلم", ph: "etkallem", pl: "powiedział" },
        { pronoun: "heyya", ar: "اتكلمت", ph: "etkallemet", pl: "powiedziała" },
        { pronoun: "e7na", ar: "اتكلمنا", ph: "etkallemna", pl: "powiedzieliśmy" },
        { pronoun: "ento", ar: "اتكلمتوا", ph: "etkallemtu", pl: "powiedzieliście" },
        { pronoun: "homma", ar: "اتكلموا", ph: "etkallemu", pl: "powiedzieli" },
      ],
      future: [
        { pronoun: "ana", ar: "هاتكلم", ph: "hatkallem", pl: "powiem" },
        { pronoun: "enta", ar: "هتتكلم", ph: "hatetkallem", pl: "powiesz (m.)" },
        { pronoun: "enti", ar: "هتتكلمي", ph: "hatetkallemi", pl: "powiesz (f.)" },
        { pronoun: "huwwa", ar: "هيتكلم", ph: "hayetkallem", pl: "powie (on)" },
        { pronoun: "heyya", ar: "هتتكلم", ph: "hatetkallem", pl: "powie (ona)" },
        { pronoun: "e7na", ar: "هنتكلم", ph: "hanetkallem", pl: "powiemy" },
        { pronoun: "ento", ar: "هتتكلموا", ph: "hatetkallemu", pl: "powiecie" },
        { pronoun: "homma", ar: "هيتكلموا", ph: "hayetkallemu", pl: "powiedzą" },
      ],
    },
  },
  {
    pl: "rozumieć",
    en: "to understand",
    ar: "بيفهم",
    ph: "biyifham",
    tenses: {
      present: [
        { pronoun: "ana", ar: "بفهم", ph: "bafham", pl: "rozumiem" },
        { pronoun: "enta", ar: "بتفهم", ph: "betifham", pl: "rozumiesz (m.)" },
        { pronoun: "enti", ar: "بتفهمي", ph: "betifhami", pl: "rozumiesz (f.)" },
        { pronoun: "huwwa", ar: "بيفهم", ph: "biyifham", pl: "rozumie (on)" },
        { pronoun: "heyya", ar: "بتفهم", ph: "betifham", pl: "rozumie (ona)" },
        { pronoun: "e7na", ar: "بنفهم", ph: "binifham", pl: "rozumiemy" },
        { pronoun: "ento", ar: "بتفهموا", ph: "betifhamu", pl: "rozumiecie" },
        { pronoun: "homma", ar: "بيفهموا", ph: "biyifhamu", pl: "rozumieją" },
      ],
      past: [
        { pronoun: "ana", ar: "فهمت", ph: "fehemt", pl: "zrozumiałem/am" },
        { pronoun: "enta", ar: "فهمت", ph: "fehemt", pl: "zrozumiałeś" },
        { pronoun: "enti", ar: "فهمتي", ph: "fehemti", pl: "zrozumiałaś" },
        { pronoun: "huwwa", ar: "فهم", ph: "fehem", pl: "zrozumiał" },
        { pronoun: "heyya", ar: "فهمت", ph: "fehmet", pl: "zrozumiała" },
        { pronoun: "e7na", ar: "فهمنا", ph: "fehemna", pl: "zrozumieliśmy" },
        { pronoun: "ento", ar: "فهمتوا", ph: "fehemtu", pl: "zrozumieliście" },
        { pronoun: "homma", ar: "فهموا", ph: "fehmu", pl: "zrozumieli" },
      ],
      future: [
        { pronoun: "ana", ar: "هفهم", ph: "hafham", pl: "zrozumiem" },
        { pronoun: "enta", ar: "هتفهم", ph: "hatifham", pl: "zrozumiesz (m.)" },
        { pronoun: "enti", ar: "هتفهمي", ph: "hatifhami", pl: "zrozumiesz (f.)" },
        { pronoun: "huwwa", ar: "هيفهم", ph: "hayifham", pl: "zrozumie (on)" },
        { pronoun: "heyya", ar: "هتفهم", ph: "hatifham", pl: "zrozumie (ona)" },
        { pronoun: "e7na", ar: "هنفهم", ph: "hanifham", pl: "zrozumiemy" },
        { pronoun: "ento", ar: "هتفهموا", ph: "hatifhamu", pl: "zrozumiecie" },
        { pronoun: "homma", ar: "هيفهموا", ph: "hayifhamu", pl: "zrozumieją" },
      ],
    },
  },
  {
    pl: "pracować",
    en: "to work",
    ar: "بيشتغل",
    ph: "biyishtaghal",
    tenses: {
      present: [
        { pronoun: "ana", ar: "بشتغل", ph: "bashtaghal", pl: "pracuję" },
        { pronoun: "enta", ar: "بتشتغل", ph: "betishtaghal", pl: "pracujesz (m.)" },
        { pronoun: "enti", ar: "بتشتغلي", ph: "betishtaghali", pl: "pracujesz (f.)" },
        { pronoun: "huwwa", ar: "بيشتغل", ph: "biyishtaghal", pl: "pracuje (on)" },
        { pronoun: "heyya", ar: "بتشتغل", ph: "betishtaghal", pl: "pracuje (ona)" },
        { pronoun: "e7na", ar: "بنشتغل", ph: "binishtaghal", pl: "pracujemy" },
        { pronoun: "ento", ar: "بتشتغلوا", ph: "betishtaghalu", pl: "pracujecie" },
        { pronoun: "homma", ar: "بيشتغلوا", ph: "biyishtaghalu", pl: "pracują" },
      ],
      past: [
        { pronoun: "ana", ar: "اشتغلت", ph: "eshtaghalt", pl: "pracowałem/am" },
        { pronoun: "enta", ar: "اشتغلت", ph: "eshtaghalt", pl: "pracowałeś" },
        { pronoun: "enti", ar: "اشتغلتي", ph: "eshtaghalti", pl: "pracowałaś" },
        { pronoun: "huwwa", ar: "اشتغل", ph: "eshtaghal", pl: "pracował" },
        { pronoun: "heyya", ar: "اشتغلت", ph: "eshtaghalet", pl: "pracowała" },
        { pronoun: "e7na", ar: "اشتغلنا", ph: "eshtaghalna", pl: "pracowaliśmy" },
        { pronoun: "ento", ar: "اشتغلتوا", ph: "eshtaghaltu", pl: "pracowaliście" },
        { pronoun: "homma", ar: "اشتغلوا", ph: "eshtaghalu", pl: "pracowali" },
      ],
      future: [
        { pronoun: "ana", ar: "هشتغل", ph: "hashtaghal", pl: "będę pracować" },
        { pronoun: "enta", ar: "هتشتغل", ph: "hatishtaghal", pl: "będziesz pracować (m.)" },
        { pronoun: "enti", ar: "هتشتغلي", ph: "hatishtaghali", pl: "będziesz pracować (f.)" },
        { pronoun: "huwwa", ar: "هيشتغل", ph: "hayishtaghal", pl: "będzie pracować (on)" },
        { pronoun: "heyya", ar: "هتشتغل", ph: "hatishtaghal", pl: "będzie pracować (ona)" },
        { pronoun: "e7na", ar: "هنشتغل", ph: "hanishtaghal", pl: "będziemy pracować" },
        { pronoun: "ento", ar: "هتشتغلوا", ph: "hatishtaghalu", pl: "będziecie pracować" },
        { pronoun: "homma", ar: "هيشتغلوا", ph: "hayishtaghalu", pl: "będą pracować" },
      ],
    },
  },
  {
    pl: "widzieć",
    en: "to see",
    ar: "بيشوف",
    ph: "biyshuuf",
    tenses: {
      present: [
        { pronoun: "ana", ar: "باشوف", ph: "bashuuf", pl: "widzę" },
        { pronoun: "enta", ar: "بتشوف", ph: "betshuuf", pl: "widzisz (m.)" },
        { pronoun: "enti", ar: "بتشوفي", ph: "betshuufi", pl: "widzisz (f.)" },
        { pronoun: "huwwa", ar: "بيشوف", ph: "biyshuuf", pl: "widzi (on)" },
        { pronoun: "heyya", ar: "بتشوف", ph: "betshuuf", pl: "widzi (ona)" },
        { pronoun: "e7na", ar: "بنشوف", ph: "binshuuf", pl: "widzimy" },
        { pronoun: "ento", ar: "بتشوفوا", ph: "betshuufu", pl: "widzicie" },
        { pronoun: "homma", ar: "بيشوفوا", ph: "biyshuufu", pl: "widzą" },
      ],
      past: [
        { pronoun: "ana", ar: "شفت", ph: "shoft", pl: "zobaczyłem/am" },
        { pronoun: "enta", ar: "شفت", ph: "shoft", pl: "zobaczyłeś" },
        { pronoun: "enti", ar: "شفتي", ph: "shofti", pl: "zobaczyłaś" },
        { pronoun: "huwwa", ar: "شاف", ph: "shaaf", pl: "zobaczył" },
        { pronoun: "heyya", ar: "شافت", ph: "shaafet", pl: "zobaczyła" },
        { pronoun: "e7na", ar: "شفنا", ph: "shofna", pl: "zobaczyliśmy" },
        { pronoun: "ento", ar: "شفتوا", ph: "shoftu", pl: "zobaczyliście" },
        { pronoun: "homma", ar: "شافوا", ph: "shaafu", pl: "zobaczyli" },
      ],
      future: [
        { pronoun: "ana", ar: "هاشوف", ph: "hashuuf", pl: "zobaczę" },
        { pronoun: "enta", ar: "هتشوف", ph: "hatshuuf", pl: "zobaczysz (m.)" },
        { pronoun: "enti", ar: "هتشوفي", ph: "hatshuufi", pl: "zobaczysz (f.)" },
        { pronoun: "huwwa", ar: "هيشوف", ph: "hayshuuf", pl: "zobaczy (on)" },
        { pronoun: "heyya", ar: "هتشوف", ph: "hatshuuf", pl: "zobaczy (ona)" },
        { pronoun: "e7na", ar: "هنشوف", ph: "hanshuuf", pl: "zobaczymy" },
        { pronoun: "ento", ar: "هتشوفوا", ph: "hatshuufu", pl: "zobaczycie" },
        { pronoun: "homma", ar: "هيشوفوا", ph: "hayshuufu", pl: "zobaczą" },
      ],
    },
  },
  {
    pl: "wiedzieć",
    en: "to know",
    ar: "بيعرف",
    ph: "biy3raf",
    tenses: {
      present: [
        { pronoun: "ana", ar: "باعرف", ph: "ba3raf", pl: "wiem" },
        { pronoun: "enta", ar: "بتعرف", ph: "bet3raf", pl: "wiesz (m.)" },
        { pronoun: "enti", ar: "بتعرفي", ph: "bet3rafi", pl: "wiesz (f.)" },
        { pronoun: "huwwa", ar: "بيعرف", ph: "biy3raf", pl: "wie (on)" },
        { pronoun: "heyya", ar: "بتعرف", ph: "bet3raf", pl: "wie (ona)" },
        { pronoun: "e7na", ar: "بنعرف", ph: "bin3raf", pl: "wiemy" },
        { pronoun: "ento", ar: "بتعرفوا", ph: "bet3rafu", pl: "wiecie" },
        { pronoun: "homma", ar: "بيعرفوا", ph: "biy3rafu", pl: "wiedzą" },
      ],
      past: [
        { pronoun: "ana", ar: "عرفت", ph: "3araft", pl: "dowiedziałem/am się" },
        { pronoun: "enta", ar: "عرفت", ph: "3araft", pl: "dowiedziałeś się" },
        { pronoun: "enti", ar: "عرفتي", ph: "3arafti", pl: "dowiedziałaś się" },
        { pronoun: "huwwa", ar: "عرف", ph: "3araf", pl: "dowiedział się" },
        { pronoun: "heyya", ar: "عرفت", ph: "3arafet", pl: "dowiedziała się" },
        { pronoun: "e7na", ar: "عرفنا", ph: "3arafna", pl: "dowiedzieliśmy się" },
        { pronoun: "ento", ar: "عرفتوا", ph: "3araftu", pl: "dowiedzieliście się" },
        { pronoun: "homma", ar: "عرفوا", ph: "3arafu", pl: "dowiedzieli się" },
      ],
      future: [
        { pronoun: "ana", ar: "هعرف", ph: "ha3raf", pl: "dowiem się" },
        { pronoun: "enta", ar: "هتعرف", ph: "hat3raf", pl: "dowiesz się (m.)" },
        { pronoun: "enti", ar: "هتعرفي", ph: "hat3rafi", pl: "dowiesz się (f.)" },
        { pronoun: "huwwa", ar: "هيعرف", ph: "hay3raf", pl: "dowie się (on)" },
        { pronoun: "heyya", ar: "هتعرف", ph: "hat3raf", pl: "dowie się (ona)" },
        { pronoun: "e7na", ar: "هنعرف", ph: "han3raf", pl: "dowiemy się" },
        { pronoun: "ento", ar: "هتعرفوا", ph: "hat3rafu", pl: "dowiecie się" },
        { pronoun: "homma", ar: "هيعرفوا", ph: "hay3rafu", pl: "dowiedzą się" },
      ],
    },
  },
  {
    pl: "musieć",
    en: "to have to",
    ar: "لازم",
    ph: "laazem",
    note: "„لازم” (laazem) to nieodmienna partykuła modalna „trzeba / muszę”. Sama się nie odmienia — odmienia się czasownik następujący po niej, i to w trybie łączącym (subjunctive), czyli bez przedrostka „بـ” (tu na przykładzie „iść”: aruu7). Czas przeszły tworzy się przez „كان لازم” (kaan laazem = „musiałem / trzeba było”), a przyszły zwykle pokrywa się z formą teraźniejszą (لازم + subjunctive).", noteEn: "\"لازم\" (laazem) is an invariable modal particle \"must / have to\". It doesn't inflect itself — the verb after it does (in the subjunctive).",
    tenses: {
      present: [
        { pronoun: "ana", ar: "لازم أروح", ph: "laazem aruuH", pl: "muszę iść" },
        { pronoun: "enta", ar: "لازم تروح", ph: "laazem tiruuH", pl: "musisz iść (m.)" },
        { pronoun: "enti", ar: "لازم تروحي", ph: "laazem tiruuHi", pl: "musisz iść (f.)" },
        { pronoun: "huwwa", ar: "لازم يروح", ph: "laazem yiruuH", pl: "musi iść (on)" },
        { pronoun: "heyya", ar: "لازم تروح", ph: "laazem tiruuH", pl: "musi iść (ona)" },
        { pronoun: "e7na", ar: "لازم نروح", ph: "laazem niruuH", pl: "musimy iść" },
        { pronoun: "ento", ar: "لازم تروحوا", ph: "laazem tiruuHu", pl: "musicie iść" },
        { pronoun: "homma", ar: "لازم يروحوا", ph: "laazem yiruuHu", pl: "muszą iść" },
      ],
      past: [
        { pronoun: "ana", ar: "كان لازم أروح", ph: "kaan laazem aruuH", pl: "musiałem/am iść" },
        { pronoun: "enta", ar: "كان لازم تروح", ph: "kaan laazem tiruuH", pl: "musiałeś iść (m.)" },
        { pronoun: "enti", ar: "كان لازم تروحي", ph: "kaan laazem tiruuHi", pl: "musiałaś iść (f.)" },
        { pronoun: "huwwa", ar: "كان لازم يروح", ph: "kaan laazem yiruuH", pl: "musiał iść (on)" },
        { pronoun: "heyya", ar: "كان لازم تروح", ph: "kaan laazem tiruuH", pl: "musiała iść (ona)" },
        { pronoun: "e7na", ar: "كان لازم نروح", ph: "kaan laazem niruuH", pl: "musieliśmy iść" },
        { pronoun: "ento", ar: "كان لازم تروحوا", ph: "kaan laazem tiruuHu", pl: "musieliście iść" },
        { pronoun: "homma", ar: "كان لازم يروحوا", ph: "kaan laazem yiruuHu", pl: "musieli iść" },
      ],
      future: [
        { pronoun: "ana", ar: "هيبقى لازم أروح", ph: "hayeb2a laazem aruuH", pl: "będę musiał/a iść" },
        { pronoun: "enta", ar: "هيبقى لازم تروح", ph: "hayeb2a laazem tiruuH", pl: "będziesz musiał iść (m.)" },
        { pronoun: "enti", ar: "هيبقى لازم تروحي", ph: "hayeb2a laazem tiruuHi", pl: "będziesz musiała iść (f.)" },
        { pronoun: "huwwa", ar: "هيبقى لازم يروح", ph: "hayeb2a laazem yiruuH", pl: "będzie musiał iść (on)" },
        { pronoun: "heyya", ar: "هيبقى لازم تروح", ph: "hayeb2a laazem tiruuH", pl: "będzie musiała iść (ona)" },
        { pronoun: "e7na", ar: "هيبقى لازم نروح", ph: "hayeb2a laazem niruuH", pl: "będziemy musieli iść" },
        { pronoun: "ento", ar: "هيبقى لازم تروحوا", ph: "hayeb2a laazem tiruuHu", pl: "będziecie musieli iść" },
        { pronoun: "homma", ar: "هيبقى لازم يروحوا", ph: "hayeb2a laazem yiruuHu", pl: "będą musieli iść" },
      ],
    },
  },
  {
    pl: "przyjść / przychodzić",
    en: "to come",
    ar: "بييجي",
    ph: "biyiigi",
    note: "Nieregularny. Rozkaźnik: ta3aala (chodź). Czas przeszły od rdzenia „g-y-2”.", noteEn: "Irregular. Imperative: ta3aala (come). Past from the root \"g-y-2\".",
    tenses: {
      present: [
        { pronoun: "ana", ar: "باجي", ph: "baagi", pl: "przychodzę" },
        { pronoun: "enta", ar: "بتيجي", ph: "betiigi", pl: "przychodzisz (m.)" },
        { pronoun: "enti", ar: "بتيجي", ph: "betiigi", pl: "przychodzisz (f.)" },
        { pronoun: "huwwa", ar: "بييجي", ph: "biyiigi", pl: "przychodzi (on)" },
        { pronoun: "heyya", ar: "بتيجي", ph: "betiigi", pl: "przychodzi (ona)" },
        { pronoun: "e7na", ar: "بنيجي", ph: "beniigi", pl: "przychodzimy" },
        { pronoun: "ento", ar: "بتيجوا", ph: "betiigu", pl: "przychodzicie" },
        { pronoun: "homma", ar: "بييجوا", ph: "biyiigu", pl: "przychodzą" },
      ],
      past: [
        { pronoun: "ana", ar: "جيت", ph: "geet", pl: "przyszedłem/am" },
        { pronoun: "enta", ar: "جيت", ph: "geet", pl: "przyszedłeś" },
        { pronoun: "enti", ar: "جيتي", ph: "geeti", pl: "przyszłaś" },
        { pronoun: "huwwa", ar: "جه", ph: "geh", pl: "przyszedł" },
        { pronoun: "heyya", ar: "جت", ph: "get", pl: "przyszła" },
        { pronoun: "e7na", ar: "جينا", ph: "geena", pl: "przyszliśmy" },
        { pronoun: "ento", ar: "جيتوا", ph: "geetu", pl: "przyszliście" },
        { pronoun: "homma", ar: "جم", ph: "gum", pl: "przyszli" },
      ],
      future: [
        { pronoun: "ana", ar: "هاجي", ph: "haagi", pl: "przyjdę" },
        { pronoun: "enta", ar: "هتيجي", ph: "hatiigi", pl: "przyjdziesz (m.)" },
        { pronoun: "enti", ar: "هتيجي", ph: "hatiigi", pl: "przyjdziesz (f.)" },
        { pronoun: "huwwa", ar: "هييجي", ph: "hayiigi", pl: "przyjdzie (on)" },
        { pronoun: "heyya", ar: "هتيجي", ph: "hatiigi", pl: "przyjdzie (ona)" },
        { pronoun: "e7na", ar: "هنيجي", ph: "haniigi", pl: "przyjdziemy" },
        { pronoun: "ento", ar: "هتيجوا", ph: "hatiigu", pl: "przyjdziecie" },
        { pronoun: "homma", ar: "هييجوا", ph: "hayiigu", pl: "przyjdą" },
      ],
    },
  },
  {
    pl: "wziąć / brać",
    en: "to take",
    ar: "بياخد",
    ph: "biyaakhod",
    note: "Nieregularny (rdzeń a-kh-d). Rozkaźnik: khod (weź).", noteEn: "Irregular (root a-kh-d). Imperative: khod (take).",
    tenses: {
      present: [
        { pronoun: "ana", ar: "باخد", ph: "baakhod", pl: "biorę" },
        { pronoun: "enta", ar: "بتاخد", ph: "betaakhod", pl: "bierzesz (m.)" },
        { pronoun: "enti", ar: "بتاخدي", ph: "betaakhdi", pl: "bierzesz (f.)" },
        { pronoun: "huwwa", ar: "بياخد", ph: "biyaakhod", pl: "bierze (on)" },
        { pronoun: "heyya", ar: "بتاخد", ph: "betaakhod", pl: "bierze (ona)" },
        { pronoun: "e7na", ar: "بناخد", ph: "benaakhod", pl: "bierzemy" },
        { pronoun: "ento", ar: "بتاخدوا", ph: "betaakhdu", pl: "bierzecie" },
        { pronoun: "homma", ar: "بياخدوا", ph: "biyaakhdu", pl: "biorą" },
      ],
      past: [
        { pronoun: "ana", ar: "خدت", ph: "khadt", pl: "wziąłem/am" },
        { pronoun: "enta", ar: "خدت", ph: "khadt", pl: "wziąłeś" },
        { pronoun: "enti", ar: "خدتي", ph: "khadti", pl: "wzięłaś" },
        { pronoun: "huwwa", ar: "خد", ph: "khad", pl: "wziął" },
        { pronoun: "heyya", ar: "خدت", ph: "khadet", pl: "wzięła" },
        { pronoun: "e7na", ar: "خدنا", ph: "khadna", pl: "wzięliśmy" },
        { pronoun: "ento", ar: "خدتوا", ph: "khadtu", pl: "wzięliście" },
        { pronoun: "homma", ar: "خدوا", ph: "khadu", pl: "wzięli" },
      ],
      future: [
        { pronoun: "ana", ar: "هاخد", ph: "haakhod", pl: "wezmę" },
        { pronoun: "enta", ar: "هتاخد", ph: "hataakhod", pl: "weźmiesz (m.)" },
        { pronoun: "enti", ar: "هتاخدي", ph: "hataakhdi", pl: "weźmiesz (f.)" },
        { pronoun: "huwwa", ar: "هياخد", ph: "hayaakhod", pl: "weźmie (on)" },
        { pronoun: "heyya", ar: "هتاخد", ph: "hataakhod", pl: "weźmie (ona)" },
        { pronoun: "e7na", ar: "هناخد", ph: "hanaakhod", pl: "weźmiemy" },
        { pronoun: "ento", ar: "هتاخدوا", ph: "hataakhdu", pl: "weźmiecie" },
        { pronoun: "homma", ar: "هياخدوا", ph: "hayaakhdu", pl: "wezmą" },
      ],
    },
  },
  {
    pl: "dać / dawać",
    en: "to give",
    ar: "بيدي",
    ph: "biyeddi",
    note: "Rozkaźnik: iddi / eddiini (daj mi). Często z sufiksem: eddiini (daj mi).", noteEn: "Imperative: iddi / eddiini (give me). Often with a suffix: eddiini (give me).",
    tenses: {
      present: [
        { pronoun: "ana", ar: "بادي", ph: "baddi", pl: "daję" },
        { pronoun: "enta", ar: "بتدي", ph: "beteddi", pl: "dajesz (m.)" },
        { pronoun: "enti", ar: "بتدي", ph: "beteddi", pl: "dajesz (f.)" },
        { pronoun: "huwwa", ar: "بيدي", ph: "biyeddi", pl: "daje (on)" },
        { pronoun: "heyya", ar: "بتدي", ph: "beteddi", pl: "daje (ona)" },
        { pronoun: "e7na", ar: "بندي", ph: "beneddi", pl: "dajemy" },
        { pronoun: "ento", ar: "بتدوا", ph: "beteddu", pl: "dajecie" },
        { pronoun: "homma", ar: "بيدوا", ph: "biyeddu", pl: "dają" },
      ],
      past: [
        { pronoun: "ana", ar: "اديت", ph: "eddeet", pl: "dałem/am" },
        { pronoun: "enta", ar: "اديت", ph: "eddeet", pl: "dałeś" },
        { pronoun: "enti", ar: "اديتي", ph: "eddeeti", pl: "dałaś" },
        { pronoun: "huwwa", ar: "ادى", ph: "edda", pl: "dał" },
        { pronoun: "heyya", ar: "ادت", ph: "eddet", pl: "dała" },
        { pronoun: "e7na", ar: "ادينا", ph: "eddeena", pl: "daliśmy" },
        { pronoun: "ento", ar: "اديتوا", ph: "eddeetu", pl: "daliście" },
        { pronoun: "homma", ar: "ادوا", ph: "eddu", pl: "dali" },
      ],
      future: [
        { pronoun: "ana", ar: "هادي", ph: "haddi", pl: "dam" },
        { pronoun: "enta", ar: "هتدي", ph: "hateddi", pl: "dasz (m.)" },
        { pronoun: "enti", ar: "هتدي", ph: "hateddi", pl: "dasz (f.)" },
        { pronoun: "huwwa", ar: "هيدي", ph: "hayeddi", pl: "da (on)" },
        { pronoun: "heyya", ar: "هتدي", ph: "hateddi", pl: "da (ona)" },
        { pronoun: "e7na", ar: "هندي", ph: "haneddi", pl: "damy" },
        { pronoun: "ento", ar: "هتدوا", ph: "hateddu", pl: "dacie" },
        { pronoun: "homma", ar: "هيدوا", ph: "hayeddu", pl: "dadzą" },
      ],
    },
  },
  {
    pl: "wracać / wrócić",
    en: "to return",
    ar: "بيرجع",
    ph: "biyirga3",
    note: "Regularny (r-g-3). Też: „stawać się” w niektórych kontekstach.", noteEn: "Regular (r-g-3). Also: \"to become\" in some contexts.",
    tenses: {
      present: [
        { pronoun: "ana", ar: "برجع", ph: "barga3", pl: "wracam" },
        { pronoun: "enta", ar: "بترجع", ph: "betirga3", pl: "wracasz (m.)" },
        { pronoun: "enti", ar: "بترجعي", ph: "betirga3i", pl: "wracasz (f.)" },
        { pronoun: "huwwa", ar: "بيرجع", ph: "biyirga3", pl: "wraca (on)" },
        { pronoun: "heyya", ar: "بترجع", ph: "betirga3", pl: "wraca (ona)" },
        { pronoun: "e7na", ar: "بنرجع", ph: "binirga3", pl: "wracamy" },
        { pronoun: "ento", ar: "بترجعوا", ph: "betirga3u", pl: "wracacie" },
        { pronoun: "homma", ar: "بيرجعوا", ph: "biyirga3u", pl: "wracają" },
      ],
      past: [
        { pronoun: "ana", ar: "رجعت", ph: "rege3t", pl: "wróciłem/am" },
        { pronoun: "enta", ar: "رجعت", ph: "rege3t", pl: "wróciłeś" },
        { pronoun: "enti", ar: "رجعتي", ph: "rege3ti", pl: "wróciłaś" },
        { pronoun: "huwwa", ar: "رجع", ph: "rege3", pl: "wrócił" },
        { pronoun: "heyya", ar: "رجعت", ph: "reg3et", pl: "wróciła" },
        { pronoun: "e7na", ar: "رجعنا", ph: "rege3na", pl: "wróciliśmy" },
        { pronoun: "ento", ar: "رجعتوا", ph: "rege3tu", pl: "wróciliście" },
        { pronoun: "homma", ar: "رجعوا", ph: "rege3u", pl: "wrócili" },
      ],
      future: [
        { pronoun: "ana", ar: "هرجع", ph: "harga3", pl: "wrócę" },
        { pronoun: "enta", ar: "هترجع", ph: "hatirga3", pl: "wrócisz (m.)" },
        { pronoun: "enti", ar: "هترجعي", ph: "hatirga3i", pl: "wrócisz (f.)" },
        { pronoun: "huwwa", ar: "هيرجع", ph: "hayirga3", pl: "wróci (on)" },
        { pronoun: "heyya", ar: "هترجع", ph: "hatirga3", pl: "wróci (ona)" },
        { pronoun: "e7na", ar: "هنرجع", ph: "hanirga3", pl: "wrócimy" },
        { pronoun: "ento", ar: "هترجعوا", ph: "hatirga3u", pl: "wrócicie" },
        { pronoun: "homma", ar: "هيرجعوا", ph: "hayirga3u", pl: "wrócą" },
      ],
    },
  },
  {
    pl: "spać",
    en: "to sleep",
    ar: "بينام",
    ph: "biynaam",
    note: "Czasownik pusty (środkowa „a” długa). Rozkaźnik: naam.", noteEn: "A hollow verb (long middle \"a\"). Imperative: naam.",
    tenses: {
      present: [
        { pronoun: "ana", ar: "بنام", ph: "banaam", pl: "śpię" },
        { pronoun: "enta", ar: "بتنام", ph: "betnaam", pl: "śpisz (m.)" },
        { pronoun: "enti", ar: "بتنامي", ph: "betnaami", pl: "śpisz (f.)" },
        { pronoun: "huwwa", ar: "بينام", ph: "biynaam", pl: "śpi (on)" },
        { pronoun: "heyya", ar: "بتنام", ph: "betnaam", pl: "śpi (ona)" },
        { pronoun: "e7na", ar: "بننام", ph: "binnaam", pl: "śpimy" },
        { pronoun: "ento", ar: "بتناموا", ph: "betnaamu", pl: "śpicie" },
        { pronoun: "homma", ar: "بيناموا", ph: "biynaamu", pl: "śpią" },
      ],
      past: [
        { pronoun: "ana", ar: "نمت", ph: "nemt", pl: "spałem/am" },
        { pronoun: "enta", ar: "نمت", ph: "nemt", pl: "spałeś" },
        { pronoun: "enti", ar: "نمتي", ph: "nemti", pl: "spałaś" },
        { pronoun: "huwwa", ar: "نام", ph: "naam", pl: "spał" },
        { pronoun: "heyya", ar: "نامت", ph: "naamet", pl: "spała" },
        { pronoun: "e7na", ar: "نمنا", ph: "nemna", pl: "spaliśmy" },
        { pronoun: "ento", ar: "نمتوا", ph: "nemtu", pl: "spaliście" },
        { pronoun: "homma", ar: "ناموا", ph: "naamu", pl: "spali" },
      ],
      future: [
        { pronoun: "ana", ar: "هنام", ph: "hanaam", pl: "będę spać" },
        { pronoun: "enta", ar: "هتنام", ph: "hatnaam", pl: "będziesz spać (m.)" },
        { pronoun: "enti", ar: "هتنامي", ph: "hatnaami", pl: "będziesz spać (f.)" },
        { pronoun: "huwwa", ar: "هينام", ph: "haynaam", pl: "będzie spać (on)" },
        { pronoun: "heyya", ar: "هتنام", ph: "hatnaam", pl: "będzie spać (ona)" },
        { pronoun: "e7na", ar: "هننام", ph: "hannaam", pl: "będziemy spać" },
        { pronoun: "ento", ar: "هتناموا", ph: "hatnaamu", pl: "będziecie spać" },
        { pronoun: "homma", ar: "هيناموا", ph: "haynaamu", pl: "będą spać" },
      ],
    },
  },
  {
    pl: "kupować / kupić",
    en: "to buy",
    ar: "بيشتري",
    ph: "biyishteri",
    note: "Czasownik z „słabą” końcówką (-i). Rozkaźnik: eshteri.", noteEn: "A verb with a \"weak\" ending (-i). Imperative: eshteri.",
    tenses: {
      present: [
        { pronoun: "ana", ar: "بشتري", ph: "bashteri", pl: "kupuję" },
        { pronoun: "enta", ar: "بتشتري", ph: "betishteri", pl: "kupujesz (m.)" },
        { pronoun: "enti", ar: "بتشتري", ph: "betishteri", pl: "kupujesz (f.)" },
        { pronoun: "huwwa", ar: "بيشتري", ph: "biyishteri", pl: "kupuje (on)" },
        { pronoun: "heyya", ar: "بتشتري", ph: "betishteri", pl: "kupuje (ona)" },
        { pronoun: "e7na", ar: "بنشتري", ph: "binishteri", pl: "kupujemy" },
        { pronoun: "ento", ar: "بتشتروا", ph: "betishteru", pl: "kupujecie" },
        { pronoun: "homma", ar: "بيشتروا", ph: "biyishteru", pl: "kupują" },
      ],
      past: [
        { pronoun: "ana", ar: "اشتريت", ph: "ishtareet", pl: "kupiłem/am" },
        { pronoun: "enta", ar: "اشتريت", ph: "ishtareet", pl: "kupiłeś" },
        { pronoun: "enti", ar: "اشتريتي", ph: "ishtareeti", pl: "kupiłaś" },
        { pronoun: "huwwa", ar: "اشترى", ph: "ishtara", pl: "kupił" },
        { pronoun: "heyya", ar: "اشترت", ph: "ishtaret", pl: "kupiła" },
        { pronoun: "e7na", ar: "اشترينا", ph: "ishtareena", pl: "kupiliśmy" },
        { pronoun: "ento", ar: "اشتريتوا", ph: "ishtareetu", pl: "kupiliście" },
        { pronoun: "homma", ar: "اشتروا", ph: "ishtaru", pl: "kupili" },
      ],
      future: [
        { pronoun: "ana", ar: "هشتري", ph: "hashteri", pl: "kupię" },
        { pronoun: "enta", ar: "هتشتري", ph: "hatishteri", pl: "kupisz (m.)" },
        { pronoun: "enti", ar: "هتشتري", ph: "hatishteri", pl: "kupisz (f.)" },
        { pronoun: "huwwa", ar: "هيشتري", ph: "hayishteri", pl: "kupi (on)" },
        { pronoun: "heyya", ar: "هتشتري", ph: "hatishteri", pl: "kupi (ona)" },
        { pronoun: "e7na", ar: "هنشتري", ph: "hanishteri", pl: "kupimy" },
        { pronoun: "ento", ar: "هتشتروا", ph: "hatishteru", pl: "kupicie" },
        { pronoun: "homma", ar: "هيشتروا", ph: "hayishteru", pl: "kupią" },
      ],
    },
  },
  {
    pl: "otwierać / otworzyć",
    en: "to open",
    ar: "بيفتح",
    ph: "biyiftaH",
    note: "Regularny (f-t-H). Rozkaźnik: eftaH.", noteEn: "Regular (f-t-H). Imperative: eftaH.",
    tenses: {
      present: [
        { pronoun: "ana", ar: "بفتح", ph: "baftaH", pl: "otwieram" },
        { pronoun: "enta", ar: "بتفتح", ph: "betiftaH", pl: "otwierasz (m.)" },
        { pronoun: "enti", ar: "بتفتحي", ph: "betiftaHi", pl: "otwierasz (f.)" },
        { pronoun: "huwwa", ar: "بيفتح", ph: "biyiftaH", pl: "otwiera (on)" },
        { pronoun: "heyya", ar: "بتفتح", ph: "betiftaH", pl: "otwiera (ona)" },
        { pronoun: "e7na", ar: "بنفتح", ph: "biniftaH", pl: "otwieramy" },
        { pronoun: "ento", ar: "بتفتحوا", ph: "betiftaHu", pl: "otwieracie" },
        { pronoun: "homma", ar: "بيفتحوا", ph: "biyiftaHu", pl: "otwierają" },
      ],
      past: [
        { pronoun: "ana", ar: "فتحت", ph: "fataHt", pl: "otworzyłem/am" },
        { pronoun: "enta", ar: "فتحت", ph: "fataHt", pl: "otworzyłeś" },
        { pronoun: "enti", ar: "فتحتي", ph: "fataHti", pl: "otworzyłaś" },
        { pronoun: "huwwa", ar: "فتح", ph: "fataH", pl: "otworzył" },
        { pronoun: "heyya", ar: "فتحت", ph: "fatHet", pl: "otworzyła" },
        { pronoun: "e7na", ar: "فتحنا", ph: "fataHna", pl: "otworzyliśmy" },
        { pronoun: "ento", ar: "فتحتوا", ph: "fataHtu", pl: "otworzyliście" },
        { pronoun: "homma", ar: "فتحوا", ph: "fataHu", pl: "otworzyli" },
      ],
      future: [
        { pronoun: "ana", ar: "هفتح", ph: "haftaH", pl: "otworzę" },
        { pronoun: "enta", ar: "هتفتح", ph: "hatiftaH", pl: "otworzysz (m.)" },
        { pronoun: "enti", ar: "هتفتحي", ph: "hatiftaHi", pl: "otworzysz (f.)" },
        { pronoun: "huwwa", ar: "هيفتح", ph: "hayiftaH", pl: "otworzy (on)" },
        { pronoun: "heyya", ar: "هتفتح", ph: "hatiftaH", pl: "otworzy (ona)" },
        { pronoun: "e7na", ar: "هنفتح", ph: "haniftaH", pl: "otworzymy" },
        { pronoun: "ento", ar: "هتفتحوا", ph: "hatiftaHu", pl: "otworzycie" },
        { pronoun: "homma", ar: "هيفتحوا", ph: "hayiftaHu", pl: "otworzą" },
      ],
    },
  },
  {
    pl: "pisać / napisać",
    en: "to write",
    ar: "بيكتب",
    ph: "biyiktib",
    note: "Regularny (k-t-b). Rozkaźnik: ekteb.", noteEn: "Regular (k-t-b). Imperative: ekteb.",
    tenses: {
      present: [
        { pronoun: "ana", ar: "بكتب", ph: "baktib", pl: "piszę" },
        { pronoun: "enta", ar: "بتكتب", ph: "betiktib", pl: "piszesz (m.)" },
        { pronoun: "enti", ar: "بتكتبي", ph: "betiktibi", pl: "piszesz (f.)" },
        { pronoun: "huwwa", ar: "بيكتب", ph: "biyiktib", pl: "pisze (on)" },
        { pronoun: "heyya", ar: "بتكتب", ph: "betiktib", pl: "pisze (ona)" },
        { pronoun: "e7na", ar: "بنكتب", ph: "biniktib", pl: "piszemy" },
        { pronoun: "ento", ar: "بتكتبوا", ph: "betiktibu", pl: "piszecie" },
        { pronoun: "homma", ar: "بيكتبوا", ph: "biyiktibu", pl: "piszą" },
      ],
      past: [
        { pronoun: "ana", ar: "كتبت", ph: "katabt", pl: "napisałem/am" },
        { pronoun: "enta", ar: "كتبت", ph: "katabt", pl: "napisałeś" },
        { pronoun: "enti", ar: "كتبتي", ph: "katabti", pl: "napisałaś" },
        { pronoun: "huwwa", ar: "كتب", ph: "katab", pl: "napisał" },
        { pronoun: "heyya", ar: "كتبت", ph: "katbet", pl: "napisała" },
        { pronoun: "e7na", ar: "كتبنا", ph: "katabna", pl: "napisaliśmy" },
        { pronoun: "ento", ar: "كتبتوا", ph: "katabtu", pl: "napisaliście" },
        { pronoun: "homma", ar: "كتبوا", ph: "katabu", pl: "napisali" },
      ],
      future: [
        { pronoun: "ana", ar: "هكتب", ph: "haktib", pl: "napiszę" },
        { pronoun: "enta", ar: "هتكتب", ph: "hatiktib", pl: "napiszesz (m.)" },
        { pronoun: "enti", ar: "هتكتبي", ph: "hatiktibi", pl: "napiszesz (f.)" },
        { pronoun: "huwwa", ar: "هيكتب", ph: "hayiktib", pl: "napisze (on)" },
        { pronoun: "heyya", ar: "هتكتب", ph: "hatiktib", pl: "napisze (ona)" },
        { pronoun: "e7na", ar: "هنكتب", ph: "haniktib", pl: "napiszemy" },
        { pronoun: "ento", ar: "هتكتبوا", ph: "hatiktibu", pl: "napiszecie" },
        { pronoun: "homma", ar: "هيكتبوا", ph: "hayiktibu", pl: "napiszą" },
      ],
    },
  },
  {
    pl: "móc / potrafić",
    en: "to be able to",
    ar: "بيقدر",
    ph: "biyi2dar",
    note: "Wyraża zdolność („umieć/dać radę”). Po nim czasownik w subjunctive.", noteEn: "Expresses ability (\"to be able to/manage\"). Followed by a verb in the subjunctive.",
    tenses: {
      present: [
        { pronoun: "ana", ar: "بقدر", ph: "ba2dar", pl: "potrafię" },
        { pronoun: "enta", ar: "بتقدر", ph: "beti2dar", pl: "potrafisz (m.)" },
        { pronoun: "enti", ar: "بتقدري", ph: "beti2dari", pl: "potrafisz (f.)" },
        { pronoun: "huwwa", ar: "بيقدر", ph: "biyi2dar", pl: "potrafi (on)" },
        { pronoun: "heyya", ar: "بتقدر", ph: "beti2dar", pl: "potrafi (ona)" },
        { pronoun: "e7na", ar: "بنقدر", ph: "bini2dar", pl: "potrafimy" },
        { pronoun: "ento", ar: "بتقدروا", ph: "beti2daru", pl: "potraficie" },
        { pronoun: "homma", ar: "بيقدروا", ph: "biyi2daru", pl: "potrafią" },
      ],
      past: [
        { pronoun: "ana", ar: "قدرت", ph: "2edert", pl: "mogłem/am" },
        { pronoun: "enta", ar: "قدرت", ph: "2edert", pl: "mogłeś" },
        { pronoun: "enti", ar: "قدرتي", ph: "2ederti", pl: "mogłaś" },
        { pronoun: "huwwa", ar: "قدر", ph: "2eder", pl: "mógł" },
        { pronoun: "heyya", ar: "قدرت", ph: "2edret", pl: "mogła" },
        { pronoun: "e7na", ar: "قدرنا", ph: "2ederna", pl: "mogliśmy" },
        { pronoun: "ento", ar: "قدرتوا", ph: "2edertu", pl: "mogliście" },
        { pronoun: "homma", ar: "قدروا", ph: "2ederu", pl: "mogli" },
      ],
      future: [
        { pronoun: "ana", ar: "هقدر", ph: "ha2dar", pl: "będę mógł" },
        { pronoun: "enta", ar: "هتقدر", ph: "hati2dar", pl: "będziesz mógł (m.)" },
        { pronoun: "enti", ar: "هتقدري", ph: "hati2dari", pl: "będziesz mogła (f.)" },
        { pronoun: "huwwa", ar: "هيقدر", ph: "hayi2dar", pl: "będzie mógł (on)" },
        { pronoun: "heyya", ar: "هتقدر", ph: "hati2dar", pl: "będzie mogła (ona)" },
        { pronoun: "e7na", ar: "هنقدر", ph: "hani2dar", pl: "będziemy mogli" },
        { pronoun: "ento", ar: "هتقدروا", ph: "hati2daru", pl: "będziecie mogli" },
        { pronoun: "homma", ar: "هيقدروا", ph: "hayi2daru", pl: "będą mogli" },
      ],
    },
  },
  {
    pl: "lubić / kochać",
    en: "to like / to love",
    ar: "بيحب",
    ph: "biyHebb",
    note: "Podwojony (H-b-b). „baHebb” = lubię/kocham; jeden z najczęstszych.", noteEn: "Doubled (H-b-b). \"baHebb\" = I like/love; one of the most common.",
    tenses: {
      present: [
        { pronoun: "ana", ar: "بحب", ph: "baHebb", pl: "lubię" },
        { pronoun: "enta", ar: "بتحب", ph: "betHebb", pl: "lubisz (m.)" },
        { pronoun: "enti", ar: "بتحبي", ph: "betHebbi", pl: "lubisz (f.)" },
        { pronoun: "huwwa", ar: "بيحب", ph: "biyHebb", pl: "lubi (on)" },
        { pronoun: "heyya", ar: "بتحب", ph: "betHebb", pl: "lubi (ona)" },
        { pronoun: "e7na", ar: "بنحب", ph: "binHebb", pl: "lubimy" },
        { pronoun: "ento", ar: "بتحبوا", ph: "betHebbu", pl: "lubicie" },
        { pronoun: "homma", ar: "بيحبوا", ph: "biyHebbu", pl: "lubią" },
      ],
      past: [
        { pronoun: "ana", ar: "حبيت", ph: "Habbeet", pl: "polubiłem/am" },
        { pronoun: "enta", ar: "حبيت", ph: "Habbeet", pl: "polubiłeś" },
        { pronoun: "enti", ar: "حبيتي", ph: "Habbeeti", pl: "polubiłaś" },
        { pronoun: "huwwa", ar: "حب", ph: "Habb", pl: "polubił" },
        { pronoun: "heyya", ar: "حبت", ph: "Habbet", pl: "polubiła" },
        { pronoun: "e7na", ar: "حبينا", ph: "Habbeena", pl: "polubiliśmy" },
        { pronoun: "ento", ar: "حبيتوا", ph: "Habbeetu", pl: "polubiliście" },
        { pronoun: "homma", ar: "حبوا", ph: "Habbu", pl: "polubili" },
      ],
      future: [
        { pronoun: "ana", ar: "هحب", ph: "haHebb", pl: "polubię" },
        { pronoun: "enta", ar: "هتحب", ph: "hatHebb", pl: "polubisz (m.)" },
        { pronoun: "enti", ar: "هتحبي", ph: "hatHebbi", pl: "polubisz (f.)" },
        { pronoun: "huwwa", ar: "هيحب", ph: "hayHebb", pl: "polubi (on)" },
        { pronoun: "heyya", ar: "هتحب", ph: "hatHebb", pl: "polubi (ona)" },
        { pronoun: "e7na", ar: "هنحب", ph: "hanHebb", pl: "polubimy" },
        { pronoun: "ento", ar: "هتحبوا", ph: "hatHebbu", pl: "polubicie" },
        { pronoun: "homma", ar: "هيحبوا", ph: "hayHebbu", pl: "polubią" },
      ],
    },
  },
];

// ---------- Konstrukcje modalne: modalny + czasownik bazowy (subjunctive) ----------
// W egipskim czasownik modalny łączy się z czasownikiem w trybie łączącym
// (subjunctive) — czyli formą czasu teraźniejszego BEZ przedrostka „بـ”.
// Każdy modal ma „stem” zależny od osoby i czasu (np. لازم jest nieodmienne,
// ale عايز zgadza się rodzajem/liczbą). Czasownik bazowy odmienia się przez osobę.

// Czasowniki bazowe w subjunctive (forma po modalnym), przez 8 osób.
const BASE_VERBS = [
  {
    key: "yeruu7", pl: "iść / jechać", en: "to go", ar: "يروح", ph: "yiruuH",
    sub: {
      ana:   { ar: "أروح",   ph: "aruuH" },
      enta:  { ar: "تروح",   ph: "tiruuH" },
      enti:  { ar: "تروحي",  ph: "tiruuHi" },
      huwwa: { ar: "يروح",   ph: "yiruuH" },
      heyya: { ar: "تروح",   ph: "tiruuH" },
      e7na:  { ar: "نروح",   ph: "niruuH" },
      ento:  { ar: "تروحوا", ph: "tiruuHu" },
      homma: { ar: "يروحوا", ph: "yiruuHu" },
    },
  },
  {
    key: "yaakol", pl: "jeść", en: "to eat", ar: "ياكل", ph: "yaakol",
    sub: {
      ana:   { ar: "آكل",    ph: "aakol" },
      enta:  { ar: "تاكل",   ph: "taakol" },
      enti:  { ar: "تاكلي",  ph: "taakli" },
      huwwa: { ar: "ياكل",   ph: "yaakol" },
      heyya: { ar: "تاكل",   ph: "taakol" },
      e7na:  { ar: "ناكل",   ph: "naakol" },
      ento:  { ar: "تاكلوا", ph: "taaklu" },
      homma: { ar: "ياكلوا", ph: "yaaklu" },
    },
  },
  {
    key: "yeshrab", pl: "pić", en: "to drink", ar: "يشرب", ph: "yeshrab",
    sub: {
      ana:   { ar: "أشرب",   ph: "ashrab" },
      enta:  { ar: "تشرب",   ph: "teshrab" },
      enti:  { ar: "تشربي",  ph: "teshrabi" },
      huwwa: { ar: "يشرب",   ph: "yeshrab" },
      heyya: { ar: "تشرب",   ph: "teshrab" },
      e7na:  { ar: "نشرب",   ph: "neshrab" },
      ento:  { ar: "تشربوا", ph: "teshrabu" },
      homma: { ar: "يشربوا", ph: "yeshrabu" },
    },
  },
  {
    key: "yekteb", pl: "pisać", en: "to write", ar: "يكتب", ph: "yekteb",
    sub: {
      ana:   { ar: "أكتب",   ph: "akteb" },
      enta:  { ar: "تكتب",   ph: "tekteb" },
      enti:  { ar: "تكتبي",  ph: "tektebi" },
      huwwa: { ar: "يكتب",   ph: "yekteb" },
      heyya: { ar: "تكتب",   ph: "tekteb" },
      e7na:  { ar: "نكتب",   ph: "nekteb" },
      ento:  { ar: "تكتبوا", ph: "tektebu" },
      homma: { ar: "يكتبوا", ph: "yektebu" },
    },
  },
  {
    key: "ye3mel", pl: "robić", en: "to do / make", ar: "يعمل", ph: "ye3mel",
    sub: {
      ana:   { ar: "أعمل",   ph: "a3mel" },
      enta:  { ar: "تعمل",   ph: "te3mel" },
      enti:  { ar: "تعملي",  ph: "te3mili" },
      huwwa: { ar: "يعمل",   ph: "ye3mel" },
      heyya: { ar: "تعمل",   ph: "te3mel" },
      e7na:  { ar: "نعمل",   ph: "ne3mel" },
      ento:  { ar: "تعملوا", ph: "te3milu" },
      homma: { ar: "يعملوا", ph: "ye3milu" },
    },
  },
];

// Czasowniki modalne. „stem” = część modalna dla danej osoby i czasu.
// pre/post określa, czy modal stoi przed czy po czasowniku bazowym
// (w egipskim modal zawsze poprzedza — post nieużywany, zostawiony dla jasności).
// past/future: prefiks czasu dokładany PRZED całą konstrukcją.
const MODALS = [
  {
    key: "laazem", pl: "musieć", en: "must", ar: "لازم", ph: "laazem",
    note: "„لازم” jest nieodmienne — dla każdej osoby to samo. Odmienia się tylko czasownik bazowy (subjunctive). Przeszłość: „كان لازم”, przyszłość: „هيبقى لازم”.", noteEn: "\"لازم\" is invariable — the same for every person. Only the base verb inflects (subjunctive).",
    stem: {
      present: { all: { ar: "لازم", ph: "laazem" } },
      past:    { pre: { ar: "كان لازم", ph: "kaan laazem" } },
      future:  { pre: { ar: "هيبقى لازم", ph: "hayeb2a laazem" } },
    },
  },
  {
    key: "mumken", pl: "móc / można (mieć pozwolenie)", en: "can / may (permission)", ar: "ممكن", ph: "mumken",
    note: "„ممكن” (mumken) wyraża możliwość/pozwolenie („mogę, można, czy mogę…?”). Nieodmienne — odmienia się czasownik bazowy. Przeszłość: „كان ممكن” (mógłbym był / można było), przyszłość zwykle jak teraźniejszość.", noteEn: "\"ممكن\" (mumken) expresses possibility/permission (\"I may, one can, may I…?\"). Invariable — the base verb inflects.",
    stem: {
      present: { all: { ar: "ممكن", ph: "mumken" } },
      past:    { pre: { ar: "كان ممكن", ph: "kaan mumken" } },
      future:  { all: { ar: "ممكن", ph: "mumken" } },
    },
  },
  {
    key: "3aayez", pl: "chcieć", en: "to want", ar: "عايز", ph: "3aayez",
    note: "„عايز” zgadza się RODZAJEM i LICZBĄ z podmiotem (عايز m. / عايزة f. / عايزين l.mn.), a czasownik bazowy stoi w subjunctive. Przeszłość: „كنت عايز…”, przyszłość: „هكون عايز…”.", noteEn: "\"عايز\" agrees in GENDER and NUMBER with the subject (عايز m. / عايزة f. / عايزين pl.), and the base verb is in the subjunctive.",
    stem: {
      present: {
        ana:   { ar: "عايز/عايزة", ph: "3aayez/3ayza" },
        enta:  { ar: "عايز",   ph: "3aayez" },
        enti:  { ar: "عايزة",  ph: "3ayza" },
        huwwa: { ar: "عايز",   ph: "3aayez" },
        heyya: { ar: "عايزة",  ph: "3ayza" },
        e7na:  { ar: "عايزين", ph: "3ayziin" },
        ento:  { ar: "عايزين", ph: "3ayziin" },
        homma: { ar: "عايزين", ph: "3ayziin" },
      },
      past: {
        ana:   { ar: "كنت عايز/عايزة", ph: "kunt 3aayez/3ayza" },
        enta:  { ar: "كنت عايز",   ph: "kunt 3aayez" },
        enti:  { ar: "كنتي عايزة", ph: "kunti 3ayza" },
        huwwa: { ar: "كان عايز",   ph: "kaan 3aayez" },
        heyya: { ar: "كانت عايزة", ph: "kaanet 3ayza" },
        e7na:  { ar: "كنا عايزين", ph: "kunna 3ayziin" },
        ento:  { ar: "كنتوا عايزين", ph: "kuntu 3ayziin" },
        homma: { ar: "كانوا عايزين", ph: "kaanu 3ayziin" },
      },
      future: {
        ana:   { ar: "هكون عايز/عايزة", ph: "hakuun 3aayez/3ayza" },
        enta:  { ar: "هتكون عايز",   ph: "hatkuun 3aayez" },
        enti:  { ar: "هتكوني عايزة", ph: "hatkuuni 3ayza" },
        huwwa: { ar: "هيكون عايز",   ph: "haykuun 3aayez" },
        heyya: { ar: "هتكون عايزة",  ph: "hatkuun 3ayza" },
        e7na:  { ar: "هنكون عايزين", ph: "hankuun 3ayziin" },
        ento:  { ar: "هتكونوا عايزين", ph: "hatkuunu 3ayziin" },
        homma: { ar: "هيكونوا عايزين", ph: "haykuunu 3ayziin" },
      },
    },
  },
];

// Składa formę: modal (stem dla osoby+czasu) + czasownik bazowy (subjunctive dla osoby).
function composeModal(modal, base, tenseKey, pronounKey) {
  const t = modal.stem[tenseKey] || modal.stem.present;
  const stem = t[pronounKey] || t.all;
  const pre = t.pre;
  const sub = base.sub[pronounKey];
  if (!sub) return null;
  if (pre) {
    // np. „kaan laazem” + subjunctive
    return {
      ar: `${pre.ar} ${sub.ar}`,
      ph: `${pre.ph} ${sub.ph}`,
    };
  }
  return {
    ar: `${stem.ar} ${sub.ar}`,
    ph: `${stem.ph} ${sub.ph}`,
  };
}


// Liczba mnoga bywa "łamana" (nieregularna) — podane są formy faktycznie używane.
const NOUNS = [
  {
    gen: "m", pl: "książka", nounEn: "book",
    sing: { ar: "كتاب", ph: "ketaab" },
    dual: { ar: "كتابين", ph: "ketabeen" },
    plur: { ar: "كتب", ph: "kotob" },
    note: "Liczba mnoga łamana (kotob). Dual regularny: ketaab → ketabeen.", noteEn: "Broken plural (kotob). Regular dual: ketaab → ketabeen.",
    poss: {
      i:      { ar: "كتابي",   ph: "ketaabi" },
      ak:     { ar: "كتابك",   ph: "ketaabak" },
      ik:     { ar: "كتابك",   ph: "ketaabek" },
      uh:     { ar: "كتابه",   ph: "ketaabuh" },
      ha:     { ar: "كتابها",  ph: "ketabha" },
      na:     { ar: "كتابنا",  ph: "ketabna" },
      ku:     { ar: "كتابكو",  ph: "ketabku" },
      hum:    { ar: "كتابهم",  ph: "ketabhom" },
    },
  },
  {
    gen: "m", pl: "dom", nounEn: "house",
    sing: { ar: "بيت", ph: "beet" },
    dual: { ar: "بيتين", ph: "beteen" },
    plur: { ar: "بيوت", ph: "beyuut" },
    poss: {
      i:      { ar: "بيتي",   ph: "beeti" },
      ak:     { ar: "بيتك",   ph: "beetak" },
      ik:     { ar: "بيتك",   ph: "beetek" },
      uh:     { ar: "بيته",   ph: "beetuh" },
      ha:     { ar: "بيتها",  ph: "betha" },
      na:     { ar: "بيتنا",  ph: "betna" },
      ku:     { ar: "بيتكو",  ph: "betku" },
      hum:    { ar: "بيتهم",  ph: "bethom" },
    },
  },
  {
    gen: "f", pl: "torba / torebka", nounEn: "bag",
    sing: { ar: "شنطة", ph: "shanTa" },
    dual: { ar: "شنطتين", ph: "shanTeteen" },
    plur: { ar: "شنط", ph: "shonaT" },
    note: "Rzeczownik żeński z końcówką ـة (ta marbuta). W dualu ـة zamienia się na ـت + ـين (shanTa → shanTeteen).", noteEn: "A feminine noun with the ـة ending (ta marbuta). In the dual, ـة becomes ـت + ـين (shanTa → shanTeteen).",
    possNote: "ة (ta marbuta) przed sufiksem zmienia się w ت: شنطة → شنطتي (shanTeti).",
    poss: {
      i:      { ar: "شنطتي",   ph: "shanTeti" },
      ak:     { ar: "شنطتك",   ph: "shanTetak" },
      ik:     { ar: "شنطتك",   ph: "shanTetek" },
      uh:     { ar: "شنطته",   ph: "shanTetuh" },
      ha:     { ar: "شنطتها",  ph: "shanTet-ha" },
      na:     { ar: "شنطتنا",  ph: "shanTetna" },
      ku:     { ar: "شنطتكو",  ph: "shanTetku" },
      hum:    { ar: "شنطتهم",  ph: "shanTet-hom" },
    },
  },
  {
    gen: "f", pl: "samochód", nounEn: "car",
    sing: { ar: "عربية", ph: "3arabeyya" },
    dual: { ar: "عربيتين", ph: "3arabeyyeteen" },
    plur: { ar: "عربيات", ph: "3arabeyyaat" },
    note: "Liczba mnoga regularna żeńska: ـات (-aat).", noteEn: "Regular feminine plural: ـات (-aat).",
    possNote: "ة → ت przed sufiksem: عربية → عربيتي (3arabeyyeti).",
    poss: {
      i:      { ar: "عربيتي",   ph: "3arabeyyeti" },
      ak:     { ar: "عربيتك",   ph: "3arabeyyetak" },
      ik:     { ar: "عربيتك",   ph: "3arabeyyetek" },
      uh:     { ar: "عربيته",   ph: "3arabeyyetuh" },
      ha:     { ar: "عربيتها",  ph: "3arabeyyet-ha" },
      na:     { ar: "عربيتنا",  ph: "3arabeyyetna" },
      ku:     { ar: "عربيتكو",  ph: "3arabeyyetku" },
      hum:    { ar: "عربيتهم",  ph: "3arabeyyet-hom" },
    },
  },
  {
    gen: "m", pl: "chłopiec", nounEn: "boy",
    sing: { ar: "ولد", ph: "walad" },
    dual: { ar: "ولدين", ph: "waladeen" },
    plur: { ar: "أولاد", ph: "awlaad" },
    countPlur: { ar: "تولاد", ph: "tiwlaad" },
    poss: {
      i:      { ar: "ولدي",   ph: "waladi" },
      ak:     { ar: "ولدك",   ph: "waladak" },
      ik:     { ar: "ولدك",   ph: "waladek" },
      uh:     { ar: "ولده",   ph: "waladuh" },
      ha:     { ar: "ولدها",  ph: "waladha" },
      na:     { ar: "ولدنا",  ph: "waladna" },
      ku:     { ar: "ولدكو",  ph: "waladku" },
      hum:    { ar: "ولدهم",  ph: "waladhom" },
    },
  },
  {
    gen: "f", pl: "dziewczyna / córka", nounEn: "girl / daughter",
    sing: { ar: "بنت", ph: "bent" },
    dual: { ar: "بنتين", ph: "benteen" },
    plur: { ar: "بنات", ph: "banaat" },
    possNote: "Rdzeń ma zbitkę spółgłosek, więc przy sufiksie pojawia się samogłoska pomocnicza: bent → binti.",
    poss: {
      i:      { ar: "بنتي",   ph: "binti" },
      ak:     { ar: "بنتك",   ph: "bintak" },
      ik:     { ar: "بنتك",   ph: "bintek" },
      uh:     { ar: "بنته",   ph: "bintuh" },
      ha:     { ar: "بنتها",  ph: "bintaha" },
      na:     { ar: "بنتنا",  ph: "bintena" },
      ku:     { ar: "بنتكو",  ph: "bintoku" },
      hum:    { ar: "بنتهم",  ph: "bintohom" },
    },
  },
  {
    gen: "m", pl: "dzień", nounEn: "day",
    sing: { ar: "يوم", ph: "yoom" },
    dual: { ar: "يومين", ph: "yomeen" },
    plur: { ar: "أيام", ph: "ayyaam" },
    countPlur: { ar: "تيام", ph: "tiyyaam" },
    poss: {
      i:      { ar: "يومي",   ph: "yoomi" },
      ak:     { ar: "يومك",   ph: "yoomak" },
      ik:     { ar: "يومك",   ph: "yoomek" },
      uh:     { ar: "يومه",   ph: "yoomuh" },
      ha:     { ar: "يومها",  ph: "yomha" },
      na:     { ar: "يومنا",  ph: "yomna" },
      ku:     { ar: "يومكو",  ph: "yomku" },
      hum:    { ar: "يومهم",  ph: "yomhom" },
    },
  },
  {
    gen: "m", pl: "pokój", nounEn: "room",
    sing: { ar: "أوضة", ph: "2uDa" },
    dual: { ar: "أوضتين", ph: "2uDeteen" },
    plur: { ar: "أوض", ph: "2owaD" },
    note: "Uwaga: أوضة ma końcówkę ـة, ale jest rodzaju żeńskiego mimo zapisu — to jeden z często mylonych wyrazów.", noteEn: "Note: أوضة has the ـة ending but is feminine despite the spelling — one of the commonly confused ones.",
    genOverride: "f",
    possNote: "ة → ت przed sufiksem: أوضة → أوضتي (2uDeti).",
    poss: {
      i:      { ar: "أوضتي",   ph: "2uDeti" },
      ak:     { ar: "أوضتك",   ph: "2uDetak" },
      ik:     { ar: "أوضتك",   ph: "2uDetek" },
      uh:     { ar: "أوضته",   ph: "2uDetuh" },
      ha:     { ar: "أوضتها",  ph: "2uDet-ha" },
      na:     { ar: "أوضتنا",  ph: "2uDetna" },
      ku:     { ar: "أوضتكو",  ph: "2uDetku" },
      hum:    { ar: "أوضتهم",  ph: "2uDet-hom" },
    },
  },
  {
    gen: "m", pl: "stół", nounEn: "table",
    sing: { ar: "ترابيزة", ph: "tarabeeza" },
    dual: { ar: "ترابيزتين", ph: "tarabezeteen" },
    plur: { ar: "ترابيزات", ph: "tarabezaat" },
    genOverride: "f",
    possNote: "ة → ت przed sufiksem: ترابيزة → ترابيزتي (tarabezti).",
    poss: {
      i:      { ar: "ترابيزتي",   ph: "tarabezti" },
      ak:     { ar: "ترابيزتك",   ph: "tarabeztak" },
      ik:     { ar: "ترابيزتك",   ph: "tarabeztek" },
      uh:     { ar: "ترابيزته",   ph: "tarabeztuh" },
      ha:     { ar: "ترابيزتها",  ph: "tarabezet-ha" },
      na:     { ar: "ترابيزتنا",  ph: "tarabezetna" },
      ku:     { ar: "ترابيزتكو",  ph: "tarabezetku" },
      hum:    { ar: "ترابيزتهم",  ph: "tarabezet-hom" },
    },
  },
  {
    gen: "m", pl: "klucz", nounEn: "key",
    sing: { ar: "مفتاح", ph: "muftaaH" },
    dual: { ar: "مفتاحين", ph: "muftaHeen" },
    plur: { ar: "مفاتيح", ph: "mafatiiH" },
    poss: {
      i:      { ar: "مفتاحي",   ph: "muftaaHi" },
      ak:     { ar: "مفتاحك",   ph: "muftaaHak" },
      ik:     { ar: "مفتاحك",   ph: "muftaaHek" },
      uh:     { ar: "مفتاحه",   ph: "muftaaHuh" },
      ha:     { ar: "مفتاحها",  ph: "muftaHha" },
      na:     { ar: "مفتاحنا",  ph: "muftaHna" },
      ku:     { ar: "مفتاحكو",  ph: "muftaHku" },
      hum:    { ar: "مفتاحهم",  ph: "muftaHhom" },
    },
  },
  {
    gen: "m", pl: "telefon / komórka", nounEn: "phone",
    sing: { ar: "موبايل", ph: "mobaayel" },
    dual: { ar: "موبايلين", ph: "mobayleen" },
    plur: { ar: "موبايلات", ph: "mobaylaat" },
    poss: {
      i:      { ar: "موبايلي",   ph: "mobaayli" },
      ak:     { ar: "موبايلك",   ph: "mobaaylak" },
      ik:     { ar: "موبايلك",   ph: "mobaaylek" },
      uh:     { ar: "موبايله",   ph: "mobaayluh" },
      ha:     { ar: "موبايلها",  ph: "mobaylha" },
      na:     { ar: "موبايلنا",  ph: "mobaylna" },
      ku:     { ar: "موبايلكو",  ph: "mobaylku" },
      hum:    { ar: "موبايلهم",  ph: "mobaylhom" },
    },
  },
  {
    gen: "f", pl: "ręka", nounEn: "hand",
    sing: { ar: "إيد", ph: "2iid" },
    dual: { ar: "إيدين", ph: "2iideen" },
    plur: { ar: "أيادي", ph: "2ayaadi" },
    note: "Części ciała występujące parami są rodzaju żeńskiego; dual (2iideen) jest tu formą używaną najczęściej.", noteEn: "Body parts that come in pairs are feminine; the dual (2iideen) is the everyday form here.",
    poss: {
      i:      { ar: "إيدي",   ph: "2iidi" },
      ak:     { ar: "إيدك",   ph: "2iidak" },
      ik:     { ar: "إيدك",   ph: "2iidek" },
      uh:     { ar: "إيده",   ph: "2iiduh" },
      ha:     { ar: "إيدها",  ph: "2iidha" },
      na:     { ar: "إيدنا",  ph: "2iidna" },
      ku:     { ar: "إيدكو",  ph: "2iidku" },
      hum:    { ar: "إيدهم",  ph: "2iidhom" },
    },
  },
  {
    gen: "m", pl: "przyjaciel", nounEn: "friend",
    sing: { ar: "صاحب", ph: "SaaHeb" },
    dual: { ar: "صاحبين", ph: "SaHbeen" },
    plur: { ar: "أصحاب", ph: "aSHaab" },
    poss: {
      i:      { ar: "صاحبي",   ph: "SaHbi" },
      ak:     { ar: "صاحبك",   ph: "SaHbak" },
      ik:     { ar: "صاحبك",   ph: "SaHbek" },
      uh:     { ar: "صاحبه",   ph: "SaHbuh" },
      ha:     { ar: "صاحبها",  ph: "SaHebha" },
      na:     { ar: "صاحبنا",  ph: "SaHebna" },
      ku:     { ar: "صاحبكو",  ph: "SaHebku" },
      hum:    { ar: "صاحبهم",  ph: "SaHebhom" },
    },
  },
  {
    gen: "f", pl: "praca / robota", nounEn: "job",
    sing: { ar: "شغلانة", ph: "sho8laana" },
    dual: { ar: "شغلانتين", ph: "sho8laneteen" },
    plur: { ar: "شغلانات", ph: "sho8lanaat" },
    possNote: "ة → ت przed sufiksem: شغلانة → شغلانتي (sho8lanti).",
    poss: {
      i:      { ar: "شغلانتي",   ph: "sho8lanti" },
      ak:     { ar: "شغلانتك",   ph: "sho8lantak" },
      ik:     { ar: "شغلانتك",   ph: "sho8lantek" },
      uh:     { ar: "شغلانته",   ph: "sho8lantuh" },
      ha:     { ar: "شغلانتها",  ph: "sho8lanet-ha" },
      na:     { ar: "شغلانتنا",  ph: "sho8lanetna" },
      ku:     { ar: "شغلانتكو",  ph: "sho8lanetku" },
      hum:    { ar: "شغلانتهم",  ph: "sho8lanet-hom" },
    },
  },
  {
    gen: "m", pl: "przyjaciel / kolega", nounEn: "friend",
    sing: { ar: "صاحب", ph: "SaaHeb" },
    dual: { ar: "صاحبين", ph: "SaHbeen" },
    plur: { ar: "صحاب", ph: "SoHaab" },
    note: "Mnoga łamana: SaaHeb → SoHaab. Bardzo częste słowo w rozmowie.", noteEn: "Broken plural: SaaHeb → SoHaab. A very common word in conversation.",
    poss: {
      i:      { ar: "صاحبي",   ph: "SaaHbi" },
      ak:     { ar: "صاحبك",   ph: "SaaHbak" },
      ik:     { ar: "صاحبك",   ph: "SaHbek" },
      uh:     { ar: "صاحبه",   ph: "SaaHbo" },
      ha:     { ar: "صاحبها",  ph: "SaHabha" },
      na:     { ar: "صاحبنا",  ph: "SaHebna" },
      ku:     { ar: "صاحبكو",  ph: "SaHebko" },
      hum:    { ar: "صاحبهم",  ph: "SaHebhom" },
    },
  },
  {
    gen: "m", pl: "dzień", nounEn: "day",
    sing: { ar: "يوم", ph: "yoom" },
    dual: { ar: "يومين", ph: "yomeen" },
    plur: { ar: "أيام", ph: "ayyaam" },
    note: "Mnoga łamana: yoom → ayyaam. Dual „yomeen” bardzo częsty („dwa dni”).", noteEn: "Broken plural: yoom → ayyaam. The dual \"yomeen\" is very common (\"two days\").",
    poss: {
      i:      { ar: "يومي",   ph: "yoomi" },
      ak:     { ar: "يومك",   ph: "yoomak" },
      ik:     { ar: "يومك",   ph: "yoomek" },
      uh:     { ar: "يومه",   ph: "yoomo" },
      ha:     { ar: "يومها",  ph: "yomha" },
      na:     { ar: "يومنا",  ph: "yomna" },
      ku:     { ar: "يومكو",  ph: "yomko" },
      hum:    { ar: "يومهم",  ph: "yomhom" },
    },
  },
  {
    gen: "f", pl: "ręka", nounEn: "hand",
    sing: { ar: "إيد", ph: "iid" },
    dual: { ar: "إيدين", ph: "ideen" },
    plur: { ar: "إيدين", ph: "ideen" },
    note: "Części ciała parzyste używają zwykle formy dualnej zamiast mnogiej.", noteEn: "Paired body parts usually use the dual form instead of the plural.",
    poss: {
      i:      { ar: "إيدي",   ph: "iidi" },
      ak:     { ar: "إيدك",   ph: "iidak" },
      ik:     { ar: "إيدك",   ph: "iidek" },
      uh:     { ar: "إيده",   ph: "iido" },
      ha:     { ar: "إيدها",  ph: "idha" },
      na:     { ar: "إيدنا",  ph: "idna" },
      ku:     { ar: "إيدكو",  ph: "idko" },
      hum:    { ar: "إيدهم",  ph: "idhom" },
    },
  },
  {
    gen: "m", pl: "pieniądze", nounEn: "money",
    sing: { ar: "فلوس", ph: "feluus" },
    dual: { ar: "—", ph: "—" },
    plur: { ar: "فلوس", ph: "feluus" },
    note: "Rzeczownik zbiorowy — zawsze w liczbie mnogiej, bez dualu.", noteEn: "A collective noun — always plural, no dual.",
    poss: {
      i:      { ar: "فلوسي",   ph: "feluusi" },
      ak:     { ar: "فلوسك",   ph: "feluusak" },
      ik:     { ar: "فلوسك",   ph: "feluusek" },
      uh:     { ar: "فلوسه",   ph: "feluuso" },
      ha:     { ar: "فلوسها",  ph: "felusha" },
      na:     { ar: "فلوسنا",  ph: "felusna" },
      ku:     { ar: "فلوسكو",  ph: "felusko" },
      hum:    { ar: "فلوسهم",  ph: "felushom" },
    },
  },
  {
    gen: "f", pl: "samochód", nounEn: "car",
    sing: { ar: "عربية", ph: "3arabeyya" },
    dual: { ar: "عربيتين", ph: "3arabeyyiteen" },
    plur: { ar: "عربيات", ph: "3arabeyyaat" },
    possNote: "ة → ت przed sufiksem: عربية → عربيتي (3arabeyyeti).",
    poss: {
      i:      { ar: "عربيتي",   ph: "3arabeyyeti" },
      ak:     { ar: "عربيتك",   ph: "3arabeyyetak" },
      ik:     { ar: "عربيتك",   ph: "3arabeyyetek" },
      uh:     { ar: "عربيته",   ph: "3arabeyyeto" },
      ha:     { ar: "عربيتها",  ph: "3arabeyyet-ha" },
      na:     { ar: "عربيتنا",  ph: "3arabeyyetna" },
      ku:     { ar: "عربيتكو",  ph: "3arabeyyetko" },
      hum:    { ar: "عربيتهم",  ph: "3arabeyyet-hom" },
    },
  },
  {
    gen: "m", pl: "problem / sprawa", nounEn: "problem / matter",
    sing: { ar: "موضوع", ph: "mawDuu3" },
    dual: { ar: "موضوعين", ph: "mawDu3een" },
    plur: { ar: "مواضيع", ph: "mawaDii3" },
    note: "Mnoga łamana wg wzorca mafaa3iil: mawDuu3 → mawaDii3.", noteEn: "Broken plural on the mafaa3iil pattern: mawDuu3 → mawaDii3.",
    poss: {
      i:      { ar: "موضوعي",   ph: "mawDu3i" },
      ak:     { ar: "موضوعك",   ph: "mawDu3ak" },
      ik:     { ar: "موضوعك",   ph: "mawDu3ek" },
      uh:     { ar: "موضوعه",   ph: "mawDu3o" },
      ha:     { ar: "موضوعها",  ph: "mawDu3ha" },
      na:     { ar: "موضوعنا",  ph: "mawDu3na" },
      ku:     { ar: "موضوعكو",  ph: "mawDu3ko" },
      hum:    { ar: "موضوعهم",  ph: "mawDu3hom" },
    },
  },
  {
    gen: "f", pl: "sprawa / rzecz", nounEn: "thing / matter",
    sing: { ar: "حاجة", ph: "Haaga" },
    dual: { ar: "حاجتين", ph: "Hagteen" },
    plur: { ar: "حاجات", ph: "Hagaat" },
    note: "Bardzo częste, uniwersalne słowo — „rzecz”, „coś”, „sprawa”.", noteEn: "A very common, all-purpose word — \"thing\", \"something\", \"matter\".",
    poss: {
      i:      { ar: "حاجتي",   ph: "Hagti" },
      ak:     { ar: "حاجتك",   ph: "Hagtak" },
      ik:     { ar: "حاجتك",   ph: "Hagtek" },
      uh:     { ar: "حاجته",   ph: "Hagto" },
      ha:     { ar: "حاجتها",  ph: "Haget-ha" },
      na:     { ar: "حاجتنا",  ph: "Hagetna" },
      ku:     { ar: "حاجتكو",  ph: "Hagetko" },
      hum:    { ar: "حاجتهم",  ph: "Haget-hom" },
    },
  },
  {
    gen: "m", pl: "chłopiec / syn", nounEn: "boy / son",
    sing: { ar: "ولد", ph: "walad" },
    dual: { ar: "ولدين", ph: "waladeen" },
    plur: { ar: "أولاد", ph: "awlaad" },
    note: "Mnoga łamana: walad → awlaad („dzieci” ogólnie, nie tylko chłopcy).", noteEn: "Broken plural: walad → awlaad (\"children\" in general, not just boys).",
    poss: {
      i:      { ar: "ولدي",   ph: "waladi" },
      ak:     { ar: "ولدك",   ph: "waladak" },
      ik:     { ar: "ولدك",   ph: "waladek" },
      uh:     { ar: "ولده",   ph: "walado" },
      ha:     { ar: "ولدها",  ph: "waladha" },
      na:     { ar: "ولدنا",  ph: "waladna" },
      ku:     { ar: "ولدكو",  ph: "waladko" },
      hum:    { ar: "ولدهم",  ph: "waladhom" },
    },
  },
];

// Etykiety sufiksów dzierżawczych (8 osób).
const POSS_SUFFIXES = [
  { key: "i",   suf: "ـي",  pl: "mój / moja", en: "my",         ph: "-i" },
  { key: "ak",  suf: "ـك",  pl: "twój (m.)", en: "your (m.)",   ph: "-ak" },
  { key: "ik",  suf: "ـك",  pl: "twój (f.)", en: "your (f.)",   ph: "-ek" },
  { key: "uh",  suf: "ـه",  pl: "jego", en: "his",              ph: "-uh" },
  { key: "ha",  suf: "ـها", pl: "jej", en: "her",               ph: "-ha" },
  { key: "na",  suf: "ـنا", pl: "nasz", en: "our",              ph: "-na" },
  { key: "ku",  suf: "ـكو", pl: "wasz", en: "your (pl.)",       ph: "-ku" },
  { key: "hum", suf: "ـهم", pl: "ich", en: "their",             ph: "-hom" },
];

const NOUN_NUM_LABELS = {
  sing: "l. pojedyncza",
  dual: "l. podwójna",
  plur: "l. mnoga",
};

const NOUN_NUM_LABELS_EN = {
  sing: "singular",
  dual: "dual",
  plur: "plural",
};

// Rzeczowniki również trafiają do fiszek/quizu — każda forma liczby jako osobne słówko.
function nounsToWords(nouns) {
  const out = [];
  for (const n of nouns) {
    const g = n.genOverride || n.gen;
    const forms = [
      ["sing", n.sing],
      ["dual", n.dual],
      ["plur", n.plur],
    ];
    for (const [numKey, form] of forms) {
      if (!form) continue;
      out.push({
        cat: "nouns",
        pl: `${n.pl} (${NOUN_NUM_LABELS[numKey]}, ${g === "f" ? "r.ż." : "r.m."})`,
        en: `${n.nounEn || n.pl} (${NOUN_NUM_LABELS_EN[numKey]}, ${g === "f" ? "f." : "m."})`,
        ar: form.ar,
        ph: form.ph,
      });
    }
    // Formy dzierżawcze jako osobne fiszki
    if (n.poss) {
      for (const suf of POSS_SUFFIXES) {
        const form = n.poss[suf.key];
        if (!form) continue;
        out.push({
          cat: "nouns",
          pl: `${n.pl} — ${suf.pl}`,
          en: `${n.nounEn || n.pl} — ${suf.en || suf.pl}`,
          ar: form.ar,
          ph: form.ph,
        });
      }
    }
  }
  return out;
}

const NOUN_WORDS = nounsToWords(NOUNS);

// Generuje pojedyncze "słówka" z każdej formy osobowej i każdego czasu
// czasownika, żeby trafiły do fiszek i quizu razem ze zwykłym słownictwem.
const TENSE_LABELS = {
  present: "czas teraźniejszy",
  past: "czas przeszły",
  future: "czas przyszły",
};

const TENSE_LABELS_EN = {
  present: "present",
  past: "past",
  future: "future",
};

// Angielskie odpowiedniki bezokoliczników (do etykiet form czasownikowych).
const VERB_EN = {
  "chcieć": "to want", "robić": "to do", "pić": "to drink", "rozumieć": "to understand",
  "pracować": "to work", "widzieć": "to see", "wiedzieć": "to know", "musieć": "must",
  "spać": "to sleep", "pisać": "to write", "iść": "to go", "jeść": "to eat",
  "mówić": "to speak", "czytać": "to read", "kupować": "to buy", "brać": "to take",
  "dawać": "to give", "mieszkać": "to live", "lubić": "to like", "przychodzić": "to come",
  "wracać": "to return", "otwierać": "to open", "zamykać": "to close", "pomagać": "to help",
  "grać": "to play", "słuchać": "to listen", "myśleć": "to think", "płacić": "to pay",
  "czekać": "to wait", "szukać": "to look for", "znajdować": "to find", "sprzedawać": "to sell",
};

// Angielskie etykiety osób (do form czasownikowych).
const PRONOUN_EN = {
  ana: "I", enta: "you (m.)", enti: "you (f.)", huwwa: "he", howwa: "he", heyya: "she",
  e7na: "we", ento: "you (pl.)", homma: "they",
};

// Naturalne dopełnienie do przykładu czasownika (żeby przykład był pełnym zdaniem,
// nie tylko „zaimek + czasownik”). Klucz = bezokolicznik polski.
const VERB_OBJECTS = {
  "chcieć": { ar: "شاي بالنعناع", ph: "shaay bin-ne3naa3", pl: "herbaty z miętą", en: "mint tea" },
  "robić": { ar: "حاجة حلوة للعشا", ph: "Haaga Helwa lil-3asha", pl: "coś dobrego na kolację", en: "something nice for dinner" },
  "pić": { ar: "قهوة في القهوة", ph: "2ahwa fil-2ahwa", pl: "kawę w kawiarni", en: "coffee at the café" },
  "rozumieć": { ar: "الدرس كويس", ph: "id-dars kwayyes", pl: "lekcję dobrze", en: "the lesson well" },
  "pracować": { ar: "في المكتب كل يوم", ph: "fil-maktab koll yoom", pl: "w biurze codziennie", en: "at the office every day" },
  "widzieć": { ar: "البحر من الشباك", ph: "il-baHr min ish-shebbaak", pl: "morze przez okno", en: "the sea through the window" },
  "wiedzieć": { ar: "كل حاجة عن الموضوع", ph: "koll Haaga 3an il-mawDuu3", pl: "wszystko o tej sprawie", en: "everything about the matter" },
  "musieć": { ar: "أروح الشغل بدري", ph: "aruuH ish-shughl badri", pl: "iść do pracy wcześnie", en: "to go to work early" },
  "spać": { ar: "بدري عشان الشغل", ph: "badri 3ashaan ish-shughl", pl: "wcześnie z powodu pracy", en: "early because of work" },
  "pisać": { ar: "رسالة لصاحبي", ph: "resaala li-SaaHbi", pl: "list do przyjaciela", en: "a letter to my friend" },
};

// Angielskie formy czasowników: base -> [3. os. l.poj. (present), past].
// Future = "will " + base. Reszta osób w present = base.
const EN_VERB_FORMS = {
  "want": ["wants", "wanted"], "do": ["does", "did"], "drink": ["drinks", "drank"],
  "understand": ["understands", "understood"], "work": ["works", "worked"],
  "see": ["sees", "saw"], "know": ["knows", "knew"], "must": ["must", "had to"],
  "sleep": ["sleeps", "slept"], "write": ["writes", "wrote"], "go": ["goes", "went"],
  "eat": ["eats", "ate"], "speak": ["speaks", "spoke"], "read": ["reads", "read"],
  "buy": ["buys", "bought"], "take": ["takes", "took"], "give": ["gives", "gave"],
  "live": ["lives", "lived"], "like": ["likes", "liked"], "come": ["comes", "came"],
  "return": ["returns", "returned"], "open": ["opens", "opened"], "close": ["closes", "closed"],
  "help": ["helps", "helped"], "play": ["plays", "played"], "listen": ["listens", "listened"],
  "think": ["thinks", "thought"], "pay": ["pays", "paid"], "wait": ["waits", "waited"],
  "look for": ["looks for", "looked for"], "find": ["finds", "found"], "sell": ["sells", "sold"],
};

// Podmiot angielski (mianownik) dla klucza zaimka.
const EN_SUBJECT = {
  ana: "I", enta: "you", enti: "you", huwwa: "he", howwa: "he", heyya: "she",
  e7na: "we", ento: "you", homma: "they",
};

// Buduje naturalne angielskie zdanie: podmiot + poprawnie odmieniony czasownik.
// tense: "present" | "past" | "future". base = bezokolicznik bez "to ".
function enVerbSentence(base, pronounKey, tense, objectEn) {
  const subj = EN_SUBJECT[pronounKey] || "";
  const forms = EN_VERB_FORMS[base];
  const isThird = pronounKey === "huwwa" || pronounKey === "howwa" || pronounKey === "heyya";
  let verb;
  if (base === "must") {
    verb = tense === "past" ? "had to" : (tense === "future" ? "will have to" : "must");
  } else if (tense === "future") {
    verb = "will " + base;
  } else if (tense === "past") {
    verb = forms ? forms[1] : base + "ed";
  } else {
    verb = isThird ? (forms ? forms[0] : base + "s") : base;
  }
  const obj = objectEn ? " " + objectEn : "";
  return `${subj} ${verb}${obj}`.trim();
}

function verbsToWords(verbs) {
  const out = [];
  for (const v of verbs) {
    const obj = VERB_OBJECTS[v.pl]; // dopełnienie dla naturalnego przykładu
    for (const [tenseKey, forms] of Object.entries(v.tenses)) {
      for (const f of forms) {
        const pronoun = PRONOUNS.find((p) => p.key === f.pronoun);
        // Przykład: zaimek + forma (+ dopełnienie). W polskim tłumaczeniu usuwamy
        // dopisek w nawiasie z formy (np. „chce (ona)” → „chce”), żeby nie dublować zaimka.
        const plClean = f.pl.replace(/\s*\([^)]*\)\s*$/, "").trim();
        // Baza angielska czasownika: „to want" → „want" (do przykładu).
        const enVerbBase = (v.en || VERB_EN[v.pl] || v.pl).replace(/^to\s+/, "");
        let ex;
        if (pronoun) {
          ex = obj
            ? {
                ar: `${pronoun.ar} ${f.ar} ${obj.ar}`,
                ph: `${pronoun.ph} ${f.ph} ${obj.ph}`,
                pl: `${pronoun.pl} ${plClean} ${obj.pl}`,
                en: enVerbSentence(enVerbBase, f.pronoun, tenseKey, obj.en),
              }
            : {
                ar: `${pronoun.ar} ${f.ar}`,
                ph: `${pronoun.ph} ${f.ph}`,
                pl: `${pronoun.pl} ${plClean}`,
                en: enVerbSentence(enVerbBase, f.pronoun, tenseKey, null),
              };
        }
        out.push({
          cat: "verbs",
          pl: `${f.pl} (${v.pl}, ${TENSE_LABELS[tenseKey]})`,
          en: `${enVerbSentence(enVerbBase, f.pronoun, tenseKey, null)} (${TENSE_LABELS_EN[tenseKey]})`,
          ar: f.ar,
          ph: f.ph,
          ex,
          verbBase: v.pl,
          verbTense: tenseKey,
        });
      }
    }
  }
  return out;
}

const VERB_WORDS = verbsToWords(VERBS);

// ---------- Zaimki pytające ----------
// Egipski arabski. Uwaga na szyk: zaimek pytający często stoi na KOŃCU zdania
// (np. „ismak eeh?” = „jak masz na imię?”, dosł. „imię-twoje co?”).
const QUESTION_WORDS = [
  {
    pl: "co?", en: "what?", ar: "إيه", ph: "eeh",
    note: "Zwykle na końcu zdania: „da eeh?” (co to?), „ismak eeh?” (jak się nazywasz?).", noteEn: "Usually at the end of the sentence: \"da eeh?\" (what's this?), \"ismak eeh?\" (what's your name?).",
    ex: { ar: "ده إيه؟", ph: "da eeh?", pl: "Co to jest?", en: "What is this?" },
  },
  {
    pl: "kto?", en: "who?", ar: "مين", ph: "meen",
    ex: { ar: "مين ده؟", ph: "meen da?", pl: "Kto to (jest)?", en: "Who is this?" },
  },
  {
    pl: "gdzie?", en: "where?", ar: "فين", ph: "feen",
    ex: { ar: "الحمام فين؟", ph: "il-Hammaam feen?", pl: "Gdzie jest łazienka?", en: "Where's the bathroom?" },
  },
  {
    pl: "kiedy?", en: "when?", ar: "إمتى", ph: "emta",
    ex: { ar: "هتيجي إمتى؟", ph: "hatiigi emta?", pl: "Kiedy przyjdziesz?", en: "When are you coming?" },
  },
  {
    pl: "dlaczego?", en: "why?", ar: "ليه", ph: "leeh",
    ex: { ar: "ليه زعلان؟", ph: "leeh za3laan?", pl: "Dlaczego jesteś smutny?", en: "Why are you sad?" },
  },
  {
    pl: "jak?", en: "how?", ar: "إزاي", ph: "ezzaay",
    ex: { ar: "عامل إزاي؟", ph: "3aamel ezzaay?", pl: "Jak się masz? (do mężczyzny)", en: "How are you? (to m.)" },
  },
  {
    pl: "ile?", en: "how much?", ar: "كام", ph: "kaam",
    note: "Po „kaam” rzeczownik stoi w liczbie POJEDYNCZEJ: „kaam yoom?” (ile dni?).", noteEn: "After \"kaam\" the noun is SINGULAR: \"kaam yoom?\" (how many days?).",
    ex: { ar: "بكام؟", ph: "bikaam?", pl: "Za ile? / Ile kosztuje?", en: "For how much? / How much is it?" },
  },
  {
    pl: "który / jaki?", en: "which?", ar: "أنهي", ph: "anhi",
    note: "Rodzaj męski „anhu”, żeński „anhi”; w mowie często „anhi” dla obu.", noteEn: "Masculine \"anhu\", feminine \"anhi\"; in speech often \"anhi\" for both.",
    ex: { ar: "أنهي واحد؟", ph: "anhi waaHed?", pl: "Który (z nich)?", en: "Which (of them)?" },
  },
  {
    pl: "czyj?", en: "whose?", ar: "بتاع مين", ph: "betaa3 meen",
    note: "Dosłownie „należący do kogo”. Zgadza się rodzajem: bitaa3 (m.) / bitaa3et (f.) / bituu3 (l.mn.).", noteEn: "Literally \"belonging to whom\". Agrees in gender: bitaa3 (m.) / bitaa3et (f.) / bituu3 (pl.).",
    ex: { ar: "الكتاب ده بتاع مين؟", ph: "il-ketaab da betaa3 meen?", pl: "Czyja jest ta książka?", en: "Whose book is this?" },
  },
  {
    pl: "ile? (liczba)", en: "how many? (number)", ar: "كام واحد", ph: "kaam waaHed",
    note: "„kaam” samo pyta o liczbę; „kaam waaHed” = „ile sztuk / ilu”.", noteEn: "\"kaam\" alone asks about quantity; \"kaam waaHed\" = \"how many pieces / how many\".",
    ex: { ar: "كام واحد عايز؟", ph: "kaam waaHed 3aayez?", pl: "Ile (sztuk) chcesz?", en: "How many do you want?" },
  },
];

function questionWordsToWords(qws) {
  return qws.map((q) => ({
    cat: "questions_pron",
    pl: `${q.pl} (zaimek pytający)`,
    en: q.en ? `${q.en} (question word)` : undefined,
    ar: q.ar,
    ph: q.ph,
    ex: q.ex,
  }));
}

const QW_WORDS = questionWordsToWords(QUESTION_WORDS);

// ---------- Gramatyka: zaimki wskazujące ----------
// da (m.) / di (f.) / dol (l.mn.). W egipskim stoją zwykle PO rzeczowniku
// z rodzajnikiem: „il-beet da” = „ten dom”.
const DEMONSTRATIVES = [
  {
    pl: "ten (m.)", ar: "ده", ph: "da",
    note: "Dla rzeczowników rodzaju męskiego. Stoi po rzeczowniku: „il-walad da” (ten chłopiec).", noteEn: "For masculine nouns. Comes after the noun: \"il-walad da\" (this boy).",
    ex: { ar: "الكتاب ده", ph: "il-ketaab da", pl: "ta książka (dosł. ta-książka ten)", en: "this book" },
  },
  {
    pl: "ta (f.)", ar: "دي", ph: "di",
    note: "Dla rzeczowników rodzaju żeńskiego: „il-bent di” (ta dziewczyna).", noteEn: "For feminine nouns: \"il-bent di\" (this girl).",
    ex: { ar: "العربية دي", ph: "il-3arabeyya di", pl: "ten samochód", en: "this car" },
  },
  {
    pl: "ci / te (l.mn.)", ar: "دول", ph: "dol",
    note: "Dla liczby mnogiej, niezależnie od rodzaju: „il-awlaad dol” (ci chłopcy).", noteEn: "For the plural, regardless of gender: \"il-awlaad dol\" (these boys).",
    ex: { ar: "الناس دول", ph: "in-naas dol", pl: "ci ludzie", en: "these people" },
  },
  {
    pl: "to (jest)…", ar: "ده", ph: "da",
    note: "Na początku zdania „da/di” znaczy „to jest”: „da beeti” (to jest mój dom).", noteEn: "At the start of a sentence \"da/di\" means \"this is\": \"da beeti\" (this is my house).",
    ex: { ar: "ده بيتي", ph: "da beeti", pl: "To jest mój dom.", en: "This is my house." },
  },
];

// ---------- Gramatyka: liczebniki 1–10 ----------
// Uwaga: „1” i „2” stoją PO rzeczowniku (albo są domyślne), a 3–10 stoją PRZED
// rzeczownikiem w liczbie MNOGIEJ i często w formie skróconej (talat, arba3…).
// Formy liczebników używane PRZED rzeczownikiem (skrócone, tzw. counting forms).
const COUNT_FORMS = {
  3:  { ar: "تلات",  ph: "talat" },
  4:  { ar: "أربع",  ph: "arba3" },
  5:  { ar: "خمس",   ph: "khamas" },
  6:  { ar: "ست",    ph: "sett" },
  7:  { ar: "سبع",   ph: "saba3" },
  8:  { ar: "تمن",   ph: "taman" },
  9:  { ar: "تسع",   ph: "tesa3" },
  10: { ar: "عشر",   ph: "3ashar" },
};

// Składa frazę „liczba + rzeczownik” wg reguł egipskich:
// 1 → pojedyncza + waaHed/waHda (PO rzeczowniku, zgodność rodzaju)
// 2 → sam DUAL (bez liczebnika)
// 3–10 → forma skrócona + liczba MNOGA (countPlur, jeśli mnoga zaczyna się
//        samogłoską i przyjmuje „t-”: ayyaam → tiyyaam)
// 11 → Hidashar + liczba POJEDYNCZA
function composeCount(n, noun) {
  const g = noun.genOverride || noun.gen;
  if (n === 1) {
    const one = g === "f" ? { ar: "واحدة", ph: "waHda" } : { ar: "واحد", ph: "waaHed" };
    return {
      ar: `${noun.sing.ar} ${one.ar}`,
      ph: `${noun.sing.ph} ${one.ph}`,
      rule: "1: liczba pojedyncza + waaHed (m.) / waHda (f.) — liczebnik stoi PO rzeczowniku.",
    };
  }
  if (n === 2) {
    return {
      ar: noun.dual.ar,
      ph: noun.dual.ph,
      rule: "2: sam DUAL — bez liczebnika. „etneen + rzeczownik” brzmi nienaturalnie.",
    };
  }
  if (n >= 3 && n <= 10) {
    const cf = COUNT_FORMS[n];
    const plur = noun.countPlur || noun.plur;
    const tNote = noun.countPlur
      ? " Mnoga zaczyna się samogłoską, więc dostaje „t-”: " + noun.plur.ph + " → " + noun.countPlur.ph + "."
      : "";
    return {
      ar: `${cf.ar} ${plur.ar}`,
      ph: `${cf.ph} ${plur.ph}`,
      rule: `3–10: forma skrócona liczebnika + liczba MNOGA.${tNote}`,
    };
  }
  // 11
  return {
    ar: `حداشر ${noun.sing.ar}`,
    ph: `Hidashar ${noun.sing.ph}`,
    rule: "11+: rzeczownik wraca do liczby POJEDYNCZEJ (Hidashar yoom, nie Hidashar ayyaam).",
  };
}

const NUMERALS = [
  { pl: "1", ar: "واحد", ph: "waaHed", note: "waaHed (m.) / waHda (f.). Zwykle po rzeczowniku lub domyślne.", noteEn: "waaHed (m.) / waHda (f.). Usually after the noun or implied." },
  { pl: "2", ar: "اتنين", ph: "etneen", note: "Zamiast „2 + rzeczownik” używa się DUALU: „yomeen” (dwa dni), nie „etneen yoom”.", noteEn: "Instead of \"2 + noun\" the DUAL is used: \"yomeen\" (two days), not \"etneen yoom\"." },
  { pl: "3", ar: "تلاتة", ph: "talaata", note: "Przed rzeczownikiem forma skrócona: „talat tiyyaam” (3 dni).", noteEn: "Before the noun, a shortened form: \"talat tiyyaam\" (3 days)." },
  { pl: "4", ar: "أربعة", ph: "arba3a", note: "Skróć.: „arba3 …”. 3–10 łączą się z liczbą MNOGĄ rzeczownika.", noteEn: "Short: \"arba3 …\". 3–10 combine with the PLURAL of the noun." },
  { pl: "5", ar: "خمسة", ph: "khamsa", note: "Skróć.: „khamas …”.", noteEn: "Short: \"khamas …\"." },
  { pl: "6", ar: "ستة", ph: "setta", note: "Skróć.: „sett …”.", noteEn: "Short: \"sett …\"." },
  { pl: "7", ar: "سبعة", ph: "sab3a", note: "Skróć.: „saba3 …”.", noteEn: "Short: \"saba3 …\"." },
  { pl: "8", ar: "تمانية", ph: "tamanya", note: "Skróć.: „taman …”.", noteEn: "Short: \"taman …\"." },
  { pl: "9", ar: "تسعة", ph: "tes3a", note: "Skróć.: „tesa3 …”.", noteEn: "Short: \"tesa3 …\"." },
  { pl: "10", ar: "عشرة", ph: "3ashara", note: "Skróć.: „3ashar …”. Od 11 w górę rzeczownik wraca do l. POJEDYNCZEJ.", noteEn: "Short: \"3ashar …\". From 11 up, the noun returns to the SINGULAR." },
];

// ---------- Gramatyka: przyimki z sufiksami zaimkowymi ----------
// Przyimek + sufiks (ja/ty/on…). Formy są nieregularne, więc wpisane ręcznie.
const PREP_SUFFIXES = [
  { key: "i",   pl: "ja",        en: "me",          ph: "-i / -ya" },
  { key: "ak",  pl: "ty (m.)",   en: "you (m.)",    ph: "-ak" },
  { key: "ik",  pl: "ty (f.)",   en: "you (f.)",    ph: "-ik" },
  { key: "uh",  pl: "on",        en: "him",         ph: "-uh" },
  { key: "ha",  pl: "ona",       en: "her",         ph: "-ha" },
  { key: "na",  pl: "my",        en: "us",          ph: "-na" },
  { key: "ku",  pl: "wy",        en: "you (pl.)",   ph: "-ku" },
  { key: "hum", pl: "oni/one",   en: "them",        ph: "-hom" },
];

const PREPOSITIONS = [
  {
    pl: "u / mieć (posiadanie)", ar: "عند", ph: "3and",
    note: "„3and” + sufiks wyraża posiadanie: „3andi” = „mam” (dosł. „u-mnie”).", noteEn: "\"3and\" + suffix expresses possession: \"3andi\" = \"I have\" (lit. \"at me\").",
    forms: {
      i:   { ar: "عندي",   ph: "3andi" },
      ak:  { ar: "عندك",   ph: "3andak" },
      ik:  { ar: "عندك",   ph: "3andek" },
      uh:  { ar: "عنده",   ph: "3anduh" },
      ha:  { ar: "عندها",  ph: "3andaha" },
      na:  { ar: "عندنا",  ph: "3andena" },
      ku:  { ar: "عندكو",  ph: "3andoku" },
      hum: { ar: "عندهم",  ph: "3andohom" },
    },
  },
  {
    pl: "z (kimś) / przy sobie", ar: "مع", ph: "ma3a",
    note: "„ma3a” + sufiks: „ma3aaya” = „ze mną / przy mnie”. Uwaga na wydłużone samogłoski.", noteEn: "\"ma3a\" + suffix: \"ma3aaya\" = \"with me / on me\". Watch the lengthened vowels.",
    forms: {
      i:   { ar: "معايا",  ph: "ma3aaya" },
      ak:  { ar: "معاك",   ph: "ma3aak" },
      ik:  { ar: "معاكي",  ph: "ma3aaki" },
      uh:  { ar: "معاه",   ph: "ma3aah" },
      ha:  { ar: "معاها",  ph: "ma3aaha" },
      na:  { ar: "معانا",  ph: "ma3aana" },
      ku:  { ar: "معاكو",  ph: "ma3aaku" },
      hum: { ar: "معاهم",  ph: "ma3aahom" },
    },
  },
  {
    pl: "dla / do (ktoś)", ar: "لـ", ph: "li-",
    note: "„li-” + sufiks: „liya” = „dla mnie / mnie (celownik)”.", noteEn: "\"li-\" + suffix: \"liya\" = \"for me / to me (dative)\".",
    forms: {
      i:   { ar: "ليا",   ph: "liya" },
      ak:  { ar: "ليك",   ph: "liik" },
      ik:  { ar: "ليكي",  ph: "liiki" },
      uh:  { ar: "ليه",   ph: "liih" },
      ha:  { ar: "ليها",  ph: "liiha" },
      na:  { ar: "لينا",  ph: "liina" },
      ku:  { ar: "ليكو",  ph: "liiku" },
      hum: { ar: "ليهم",  ph: "liihom" },
    },
  },
  {
    pl: "w / u (miejsce)", ar: "في", ph: "fi-",
    note: "„fi” = „w”; z sufiksem „fiyya” = „we mnie”, częściej używane z rzeczownikiem („fi-l-beet” = w domu).", noteEn: "\"fi\" = \"in\"; with a suffix \"fiyya\" = \"in me\", more often used with a noun (\"fi-l-beet\" = at home).",
    forms: {
      i:   { ar: "فيا",   ph: "fiyya" },
      ak:  { ar: "فيك",   ph: "fiik" },
      ik:  { ar: "فيكي",  ph: "fiiki" },
      uh:  { ar: "فيه",   ph: "fiih" },
      ha:  { ar: "فيها",  ph: "fiiha" },
      na:  { ar: "فينا",  ph: "fiina" },
      ku:  { ar: "فيكو",  ph: "fiiku" },
      hum: { ar: "فيهم",  ph: "fiihom" },
    },
  },
  {
    pl: "od / niż (min)", ar: "من", ph: "men",
    note: "„men” = „od / z / niż”; z sufiksem „menni” = „ode mnie”.", noteEn: "\"men\" = \"from / than\"; with a suffix \"menni\" = \"from me\".",
    forms: {
      i:   { ar: "مني",   ph: "menni" },
      ak:  { ar: "منك",   ph: "mennak" },
      ik:  { ar: "منك",   ph: "mennek" },
      uh:  { ar: "منه",   ph: "mennuh" },
      ha:  { ar: "منها",  ph: "menha" },
      na:  { ar: "مننا",  ph: "menena" },
      ku:  { ar: "منكو",  ph: "menku" },
      hum: { ar: "منهم",  ph: "menhom" },
    },
  },
];

// ---------- Gramatyka: stopniowanie przymiotników ----------
// Egipski nie ma osobnego stopnia najwyższego morfologicznie — forma „af3al”
// służy i do „większy”, i (z rodzajnikiem lub przed rzeczownikiem) do „największy”.
const COMPARATIVES = [
  {
    pl: "duży", en: "big", base: { ar: "كبير", ph: "kebiir" },
    comp: { ar: "أكبر", ph: "akbar" }, sup: { ar: "الأكبر", ph: "il-akbar" },
    ex: { ar: "أخويا أكبر مني.", ph: "akhuuya akbar menni.", pl: "Mój brat jest starszy ode mnie.", en: "My brother is older than me." },
  },
  {
    pl: "mały", en: "small", base: { ar: "صغير", ph: "so8ayyar" },
    comp: { ar: "أصغر", ph: "aS8ar" }, sup: { ar: "الأصغر", ph: "il-aS8ar" },
    ex: { ar: "دي أصغر أوضة.", ph: "di aS8ar 2uDa.", pl: "To najmniejszy pokój.", en: "This is the smallest room." },
  },
  {
    pl: "dobry / ładny", en: "good / nice", base: { ar: "كويس", ph: "kwayyes" },
    comp: { ar: "أحسن", ph: "aHsan" }, sup: { ar: "الأحسن", ph: "il-aHsan" },
    ex: { ar: "ده أحسن من ده.", ph: "da aHsan min da.", pl: "Ten jest lepszy od tamtego.", en: "This one is better than that one." },
    note: "Stopień wyższy „aHsan” pochodzi od innego rdzenia niż „kwayyes” (nieregularne, jak pol. dobry → lepszy).", noteEn: "The comparative \"aHsan\" comes from a different root than \"kwayyes\" (irregular, like good→better).",
  },
  {
    pl: "ładny / piękny", en: "nice / beautiful", base: { ar: "حلو", ph: "Helw" },
    comp: { ar: "أحلى", ph: "aHla" }, sup: { ar: "الأحلى", ph: "il-aHla" },
    ex: { ar: "المكان ده أحلى.", ph: "il-makaan da aHla.", pl: "To miejsce jest ładniejsze.", en: "This place is nicer." },
  },
  {
    pl: "tani", en: "cheap", base: { ar: "رخيص", ph: "rekhiiS" },
    comp: { ar: "أرخص", ph: "arkhaS" }, sup: { ar: "الأرخص", ph: "il-arkhaS" },
    ex: { ar: "فيه حاجة أرخص؟", ph: "fiih Haaga arkhaS?", pl: "Jest coś tańszego?", en: "Is there anything cheaper?" },
  },
  {
    pl: "drogi", en: "expensive", base: { ar: "غالي", ph: "8aali" },
    comp: { ar: "أغلى", ph: "a8la" }, sup: { ar: "الأغلى", ph: "il-a8la" },
    ex: { ar: "ده أغلى واحد.", ph: "da a8la waaHed.", pl: "To najdroższy.", en: "This is the most expensive." },
  },
  {
    pl: "bliski", en: "close", base: { ar: "قريب", ph: "2urayyib" },
    comp: { ar: "أقرب", ph: "a2rab" }, sup: { ar: "الأقرب", ph: "il-a2rab" },
    ex: { ar: "فين أقرب محطة؟", ph: "feen a2rab maHaTTa?", pl: "Gdzie jest najbliższa stacja?", en: "Where's the nearest station?" },
  },
  {
    pl: "łatwy", en: "easy", base: { ar: "سهل", ph: "sahl" },
    comp: { ar: "أسهل", ph: "as-hal" }, sup: { ar: "الأسهل", ph: "il-as-hal" },
    ex: { ar: "دي أسهل طريقة.", ph: "di as-hal Tarii2a.", pl: "To najłatwiejszy sposób.", en: "This is the easiest way." },
  },
  {
    pl: "ładny / piękny", en: "nice / beautiful", base: { ar: "حلو", ph: "Helw" },
    comp: { ar: "أحلى", ph: "aHla" }, sup: { ar: "الأحلى", ph: "il-aHla" },
    ex: { ar: "الجو أحلى النهارده.", ph: "il-gaww aHla innaharda.", pl: "Pogoda jest dziś ładniejsza.", en: "The weather is nicer today." },
  },
  {
    pl: "drogi", en: "expensive", base: { ar: "غالي", ph: "8aali" },
    comp: { ar: "أغلى", ph: "a8la" }, sup: { ar: "الأغلى", ph: "il-a8la" },
    ex: { ar: "ده أغلى من ده.", ph: "da a8la min da.", pl: "To jest droższe od tamtego.", en: "This is more expensive than that." },
  },
  {
    pl: "tani", en: "cheap", base: { ar: "رخيص", ph: "rekhiiS" },
    comp: { ar: "أرخص", ph: "arkhaS" }, sup: { ar: "الأرخص", ph: "il-arkhaS" },
    ex: { ar: "فين أرخص محل؟", ph: "feen arkhaS maHall?", pl: "Gdzie jest najtańszy sklep?", en: "Where's the cheapest shop?" },
  },
  {
    pl: "trudny", en: "difficult", base: { ar: "صعب", ph: "Sa3b" },
    comp: { ar: "أصعب", ph: "aS3ab" }, sup: { ar: "الأصعب", ph: "il-aS3ab" },
    ex: { ar: "العربي أصعب من الإنجليزي.", ph: "il-3arabi aS3ab min il-engliizi.", pl: "Arabski jest trudniejszy niż angielski.", en: "Arabic is harder than English." },
  },
  {
    pl: "długi", en: "long / tall", base: { ar: "طويل", ph: "Tawiil" },
    comp: { ar: "أطول", ph: "aTwal" }, sup: { ar: "الأطول", ph: "il-aTwal" },
    ex: { ar: "هو أطول واحد فينا.", ph: "howwa aTwal waaHed fiina.", pl: "On jest najwyższy z nas.", en: "He's the tallest of us." },
  },
  {
    pl: "szybki", en: "fast", base: { ar: "سريع", ph: "sarii3" },
    comp: { ar: "أسرع", ph: "asra3" }, sup: { ar: "الأسرع", ph: "il-asra3" },
    ex: { ar: "المترو أسرع من الأتوبيس.", ph: "il-metro asra3 min il-otobiis.", pl: "Metro jest szybsze niż autobus.", en: "The metro is faster than the bus." },
  },
  {
    pl: "lepszy (dobry)", en: "better (good)", base: { ar: "كويس", ph: "kwayyes" },
    comp: { ar: "أحسن", ph: "aHsan" }, sup: { ar: "الأحسن", ph: "il-aHsan" },
    ex: { ar: "ده أحسن حل.", ph: "da aHsan Hall.", pl: "To najlepsze rozwiązanie.", en: "This is the best solution." },
  },
];

// ---------- Gramatyka: liczebniki 11–100 ----------
const BIG_NUMERALS = [
  { pl: "11", ar: "حداشر", ph: "Hidaashar" },
  { pl: "12", ar: "اتناشر", ph: "itnaashar" },
  { pl: "13", ar: "تلتاشر", ph: "talataashar" },
  { pl: "14", ar: "أربعتاشر", ph: "arba3taashar" },
  { pl: "15", ar: "خمستاشر", ph: "khamastaashar" },
  { pl: "16", ar: "ستاشر", ph: "settaashar" },
  { pl: "17", ar: "سبعتاشر", ph: "saba3taashar" },
  { pl: "18", ar: "تمنتاشر", ph: "tamantaashar" },
  { pl: "19", ar: "تسعتاشر", ph: "tesa3taashar" },
  { pl: "20", ar: "عشرين", ph: "3eshriin" },
  { pl: "21", ar: "واحد وعشرين", ph: "waaHed wi 3eshriin", note: "Jedności PRZED dziesiątkami, spojone „wi” (i): waaHed wi 3eshriin.", noteEn: "Units BEFORE tens, joined by \"wi\" (and): waaHed wi 3eshriin." },
  { pl: "25", ar: "خمسة وعشرين", ph: "khamsa wi 3eshriin" },
  { pl: "30", ar: "تلاتين", ph: "talatiin" },
  { pl: "40", ar: "أربعين", ph: "arbe3iin" },
  { pl: "50", ar: "خمسين", ph: "khamsiin" },
  { pl: "60", ar: "ستين", ph: "settiin" },
  { pl: "70", ar: "سبعين", ph: "sab3iin" },
  { pl: "80", ar: "تمانين", ph: "tamaniin" },
  { pl: "90", ar: "تسعين", ph: "tes3iin" },
  { pl: "100", ar: "مية", ph: "meyya" },
];

// ---------- Gramatyka: tryb rozkazujący ----------
// Rozkaźnik tworzy się od tematu czasu teraźniejszego (bez prefiksu ت-).
// Negacja rozkaźnika: klamra ma-…-sh na formie 2. os. (matruHsh = nie idź).
const IMPERATIVES = [
  {
    pl: "iść", forms: {
      m: { ar: "روح", ph: "ruuH" }, f: { ar: "روحي", ph: "ruuHi" }, pl_: { ar: "روحوا", ph: "ruuHu" },
    }, neg: { ar: "متروحش", ph: "matruuHsh" },
  },
  {
    pl: "przyjść / chodź", forms: {
      m: { ar: "تعالى", ph: "ta3aala" }, f: { ar: "تعالي", ph: "ta3aali" }, pl_: { ar: "تعالوا", ph: "ta3aalu" },
    }, neg: { ar: "متجيش", ph: "matgiish" },
    note: "„ta3aala” (chodź tu) jest nieregularne. Negacja od czasownika „giih”: matgiish.", noteEn: "\"ta3aala\" (come here) is irregular. Negation from the verb \"giih\": matgiish.",
  },
  {
    pl: "wziąć / weź", forms: {
      m: { ar: "خد", ph: "khod" }, f: { ar: "خدي", ph: "khodi" }, pl_: { ar: "خدوا", ph: "khodu" },
    }, neg: { ar: "متاخدش", ph: "matakhodsh" },
  },
  {
    pl: "słuchać / posłuchaj", forms: {
      m: { ar: "اسمع", ph: "esma3" }, f: { ar: "اسمعي", ph: "esma3i" }, pl_: { ar: "اسمعوا", ph: "esma3u" },
    }, neg: { ar: "متسمعش", ph: "matesma3sh" },
  },
  {
    pl: "patrzeć / popatrz", forms: {
      m: { ar: "بص", ph: "boSS" }, f: { ar: "بصي", ph: "boSSi" }, pl_: { ar: "بصوا", ph: "boSSu" },
    }, neg: { ar: "متبصش", ph: "matboSSesh" },
  },
  {
    pl: "poczekać / zaczekaj", forms: {
      m: { ar: "استنى", ph: "estanna" }, f: { ar: "استني", ph: "estanni" }, pl_: { ar: "استنوا", ph: "estannu" },
    }, neg: { ar: "متستناش", ph: "matestannaash" },
  },
  {
    pl: "usiąść / usiądź", forms: {
      m: { ar: "اقعد", ph: "o23od" }, f: { ar: "اقعدي", ph: "o23odi" }, pl_: { ar: "اقعدوا", ph: "o23odu" },
    }, neg: { ar: "متقعدش", ph: "mato23odsh" },
  },
  {
    pl: "powiedzieć / powiedz", forms: {
      m: { ar: "قول", ph: "2uul" }, f: { ar: "قولي", ph: "2uuli" }, pl_: { ar: "قولوا", ph: "2uulu" },
    }, neg: { ar: "متقولش", ph: "mat2ulsh" },
  },
  {
    pl: "czekać / poczekaj", forms: {
      m: { ar: "استنى", ph: "estanna" }, f: { ar: "استني", ph: "estanni" }, pl_: { ar: "استنوا", ph: "estannu" },
    }, neg: { ar: "متستناش", ph: "matestannaash" },
  },
  {
    pl: "słuchać / posłuchaj", forms: {
      m: { ar: "اسمع", ph: "esma3" }, f: { ar: "اسمعي", ph: "esma3i" }, pl_: { ar: "اسمعوا", ph: "esma3u" },
    }, neg: { ar: "متسمعش", ph: "matesma3sh" },
  },
  {
    pl: "patrzeć / popatrz", forms: {
      m: { ar: "بص", ph: "boSS" }, f: { ar: "بصي", ph: "boSSi" }, pl_: { ar: "بصوا", ph: "boSSu" },
    }, neg: { ar: "متبصش", ph: "matboSSesh" },
  },
  {
    pl: "otworzyć / otwórz", forms: {
      m: { ar: "افتح", ph: "eftaH" }, f: { ar: "افتحي", ph: "eftaHi" }, pl_: { ar: "افتحوا", ph: "eftaHu" },
    }, neg: { ar: "متفتحش", ph: "mateftaHsh" },
  },
  {
    pl: "zamknąć / zamknij", forms: {
      m: { ar: "اقفل", ph: "e2fel" }, f: { ar: "اقفلي", ph: "e2fili" }, pl_: { ar: "اقفلوا", ph: "e2filu" },
    }, neg: { ar: "متقفلش", ph: "mate2felsh" },
  },
  {
    pl: "wziąć / weź", forms: {
      m: { ar: "خد", ph: "khod" }, f: { ar: "خدي", ph: "khodi" }, pl_: { ar: "خدوا", ph: "khodu" },
    }, neg: { ar: "متخدش", ph: "matakhodsh" },
  },
  {
    pl: "jeść / jedz", forms: {
      m: { ar: "كل", ph: "kol" }, f: { ar: "كلي", ph: "koli" }, pl_: { ar: "كلوا", ph: "kolu" },
    }, neg: { ar: "متكلش", ph: "matakolsh" },
  },
  {
    pl: "pić / pij", forms: {
      m: { ar: "اشرب", ph: "eshrab" }, f: { ar: "اشربي", ph: "eshrabi" }, pl_: { ar: "اشربوا", ph: "eshrabu" },
    }, neg: { ar: "متشربش", ph: "mateshrabsh" },
  },
  {
    pl: "pomóc / pomóż", forms: {
      m: { ar: "ساعد", ph: "saa3ed" }, f: { ar: "ساعدي", ph: "sa3di" }, pl_: { ar: "ساعدوا", ph: "sa3du" },
    }, neg: { ar: "متساعدش", ph: "matsa3edsh" },
  },
];

// Fiszki z nowych działów gramatyki.
// Angielskie odpowiedniki podstaw dla generatorów gramatyki.
const GRAMMAR_EN = {
  // przymiotniki (stopniowanie)
  "duży": "big", "mały": "small", "dobry / ładny": "good / nice", "ładny / piękny": "nice",
  "tani": "cheap", "drogi": "expensive", "bliski": "close", "łatwy": "easy",
  "trudny": "difficult", "długi": "long / tall", "szybki": "fast", "lepszy (dobry)": "better (good)",
  // rozkaźniki (bezokoliczniki)
  "iść": "go", "przyjść / chodź": "come", "wziąć / weź": "take", "słuchać / posłuchaj": "listen",
  "patrzeć / popatrz": "look", "poczekać / zaczekaj": "wait", "usiąść / usiądź": "sit down",
  "powiedzieć / powiedz": "say", "czekać / poczekaj": "wait", "otworzyć / otwórz": "open",
  "zamknąć / zamknij": "close", "jeść / jedz": "eat", "pić / pij": "drink", "pomóc / pomóż": "help",
  // wskazujące
  "ten (m.)": "this (m.)", "ta (f.)": "this (f.)", "ci / te (l.mn.)": "these (pl.)", "to (jest)…": "this is…",
  // przyimki
  "u / mieć (posiadanie)": "at / to have", "z (kimś) / przy sobie": "with", "dla / do (ktoś)": "for / to",
  "w / u (miejsce)": "in / at", "od / niż (min)": "from / than",
};

function extraGrammarWords() {
  const out = [];
  for (const c of COMPARATIVES) {
    const base = GRAMMAR_EN[c.pl] || c.pl;
    out.push({ cat: "grammar", pl: `${c.pl} — wyższy`, en: `${base} — comparative`, ar: c.comp.ar, ph: c.comp.ph });
    out.push({ cat: "grammar", pl: `${c.pl} — najwyższy`, en: `${base} — superlative`, ar: c.sup.ar, ph: c.sup.ph });
  }
  for (const n of BIG_NUMERALS) {
    out.push({ cat: "grammar", pl: `${n.pl} (liczebnik)`, en: `${n.pl} (numeral)`, ar: n.ar, ph: n.ph });
  }
  for (const im of IMPERATIVES) {
    const base = GRAMMAR_EN[im.pl] || im.pl;
    out.push({ cat: "grammar", pl: `${im.pl} — rozkaz (m.)`, en: `${base} — imperative (m.)`, ar: im.forms.m.ar, ph: im.forms.m.ph });
    out.push({ cat: "grammar", pl: `nie ${im.pl.split(" ")[0]} — zakaz`, en: `don't ${base.split(" ")[0]} — negative imperative`, ar: im.neg.ar, ph: im.neg.ph });
  }
  return out;
}

// Fiszki z gramatyki: wskazujące, liczebniki i przyimki (z sufiksami).
function grammarToWords() {
  const out = [];
  for (const d of DEMONSTRATIVES) {
    const base = GRAMMAR_EN[d.pl] || d.pl;
    out.push({ cat: "grammar", pl: `${d.pl} (wskazujący)`, en: `${base} (demonstrative)`, ar: d.ar, ph: d.ph, ex: d.ex });
  }
  for (const n of NUMERALS) {
    out.push({ cat: "grammar", pl: `${n.pl} (liczebnik)`, en: `${n.pl} (numeral)`, ar: n.ar, ph: n.ph });
  }
  for (const p of PREPOSITIONS) {
    const base = GRAMMAR_EN[p.pl] || p.pl;
    for (const suf of PREP_SUFFIXES) {
      const f = p.forms[suf.key];
      if (!f) continue;
      out.push({ cat: "grammar", pl: `${p.pl} — ${suf.pl}`, en: `${base} — ${suf.en || suf.pl}`, ar: f.ar, ph: f.ph });
    }
  }
  return out;
}

// ---------- Gramatyka: negacja ----------
// Dwa systemy: ma-…-sh (klamra wokół CZASOWNIKA) oraz mish (wszystko inne:
// przymiotniki, rzeczowniki, imiesłowy jak 3aayez/3aaref i czas PRZYSZŁY).
const NEGATION_EXAMPLES = [
  {
    rule: "ma-…-sh",
    pl: "lubię kawę → nie lubię kawy",
    en: "I like coffee → I don't like coffee",
    aff: { ar: "بحب القهوة", ph: "baHebb il-ahwa" },
    neg: { ar: "مبحبش القهوة", ph: "mabaHebbish il-ahwa" },
    note: "Czas teraźniejszy z بـ: klamra ma-…-sh wokół czasownika.", noteEn: "Present with بـ: the ma-…-sh frame around the verb.",
  },
  {
    rule: "ma-…-sh",
    pl: "poszedłem do domu → nie poszedłem do domu",
    en: "I went home → I didn't go home",
    aff: { ar: "رحت البيت", ph: "ruHt il-beet" },
    neg: { ar: "مرحتش البيت", ph: "maruHtish il-beet" },
    note: "Czas przeszły: ma-…-sh; po zbitce spółgłosek wskakuje -i- (ruHt → maruHtish).", noteEn: "Past: ma-…-sh; after a consonant cluster an -i- appears (ruHt → maruHtish).",
  },
  {
    rule: "ma-…-sh",
    pl: "mam czas → nie mam czasu",
    en: "I have time → I don't have time",
    aff: { ar: "عندي وقت", ph: "3andi wa2t" },
    neg: { ar: "معنديش وقت", ph: "ma3andiish wa2t" },
    note: "Posiadanie (3and + sufiks) neguje się klamrą jak czasownik.", noteEn: "Possession (3and + suffix) is negated with the frame like a verb.",
  },
  {
    rule: "ma-…-sh",
    pl: "jest problem → nie ma problemu",
    en: "there's a problem → there's no problem",
    aff: { ar: "فيه مشكلة", ph: "fiih moshkila" },
    neg: { ar: "مفيش مشكلة", ph: "mafiish moshkila" },
    note: "fiih (jest/znajduje się) → mafiish (nie ma). Jedno z najczęstszych słów w Egipcie.", noteEn: "fiih (there is) → mafiish (there isn't). One of the most common words in Egypt.",
  },
  {
    rule: "ma-…-sh",
    pl: "on był tutaj → on nie był tutaj",
    en: "he was here → he wasn't here",
    aff: { ar: "كان هنا", ph: "kaan hena" },
    neg: { ar: "مكنش هنا", ph: "makansh hena" },
    note: "kaan (był) → makansh.", noteEn: "kaan (was) → makansh.",
  },
  {
    rule: "mish",
    pl: "chcę jeść → nie chcę jeść",
    en: "I want to eat → I don't want to eat",
    aff: { ar: "أنا عايز آكل", ph: "ana 3aayez aakol" },
    neg: { ar: "أنا مش عايز آكل", ph: "ana mish 3aayez aakol" },
    note: "3aayez to IMIESŁÓW, nie czasownik → mish, nigdy „ma3aayezsh”. Częsty błąd!", noteEn: "3aayez is a PARTICIPLE, not a verb → mish, never \"ma3aayezsh\". A common mistake!",
  },
  {
    rule: "mish",
    pl: "wiem → nie wiem",
    en: "I know → I don't know",
    aff: { ar: "أنا عارف", ph: "ana 3aaref" },
    neg: { ar: "أنا مش عارف", ph: "ana mish 3aaref" },
    note: "3aaref (wiedzący) — też imiesłów → mish 3aaref.", noteEn: "3aaref (knowing) — also a participle → mish 3aaref.",
  },
  {
    rule: "mish",
    pl: "jestem zmęczony → nie jestem zmęczony",
    en: "I'm tired → I'm not tired",
    aff: { ar: "أنا تعبان", ph: "ana ta3baan" },
    neg: { ar: "أنا مش تعبان", ph: "ana mish ta3baan" },
    note: "Przymiotniki zawsze z mish.", noteEn: "Adjectives always take mish.",
  },
  {
    rule: "mish",
    pl: "pójdę jutro → nie pójdę jutro",
    en: "I'll go tomorrow → I won't go tomorrow",
    aff: { ar: "هروح بكرة", ph: "haruuH bukra" },
    neg: { ar: "مش هروح بكرة", ph: "mish haruuH bukra" },
    note: "PRZYSZŁOŚĆ (ha-) neguje się przez mish — klamra ma-…-sh tu nie działa.", noteEn: "The FUTURE (ha-) is negated with mish — the ma-…-sh frame doesn't work here.",
  },
  {
    rule: "mish",
    pl: "to mój przyjaciel → to nie jest mój przyjaciel",
    en: "this is my friend → this isn't my friend",
    aff: { ar: "ده صاحبي", ph: "da SaHbi" },
    neg: { ar: "ده مش صاحبي", ph: "da mish SaHbi" },
    note: "Zdania rzeczownikowe (bez czasownika) → mish.", noteEn: "Nominal sentences (verbless) → mish.",
  },
];

// Formy przeczące jako fiszki.
function negationToWords() {
  return NEGATION_EXAMPLES.map((n) => ({
    cat: "grammar",
    pl: `${n.pl.split("→")[1].trim()} (negacja: ${n.rule})`,
    en: n.en ? `${n.en.split("→")[1].trim()} (negation: ${n.rule})` : undefined,
    ar: n.neg.ar,
    ph: n.neg.ph,
  }));
}

const GRAMMAR_WORDS = [...grammarToWords(), ...negationToWords(), ...extraGrammarWords()];

// ---------- Wyrażenia codzienne ----------
// Zwroty-klucze potocznego egipskiego (bez dubli z kategorii "basics":
// ma3lesh, yalla i ahlan już tam są).
const EXPRESSION_WORDS = [
  {
    cat: "expressions", pl: "koniec / już / dość", en: "enough / that's it", ar: "خلاص", ph: "khalaaS",
    ex: { ar: "خلاص، فهمت.", ph: "khalaaS, fehemt.", pl: "Już dobrze, zrozumiałem.", en: "Alright, I understood." },
  },
  {
    cat: "expressions", pl: "w ogóle / całkiem (wzmacnia przeczenie)", en: "at all (emphasizes negation)", ar: "خالص", ph: "khaaliS",
    ex: { ar: "مفيش فلوس خالص.", ph: "mafiish feluus khaaliS.", pl: "Nie ma w ogóle pieniędzy. (uwaga: خالص ≠ خلاص khalaaS „dość”)", en: "There's no money at all. (note: khaaliS ≠ khalaaS \"enough\")" },
  },
  {
    cat: "expressions", pl: "pytanie", en: "question", ar: "سؤال", ph: "su2aal",
    ex: { ar: "عندي سؤال.", ph: "3andi su2aal.", pl: "Mam pytanie.", en: "I have a question." },
  },
  {
    cat: "expressions", pl: "chwila", en: "moment", ar: "لحظة", ph: "laHZa",
    ex: { ar: "استنى لحظة.", ph: "estanna laHZa.", pl: "Poczekaj chwilę.", en: "Wait a moment." },
  },
  {
    cat: "expressions", pl: "chwileczkę? / masz chwilę?", en: "got a minute?", ar: "ممكن لحظة؟", ph: "mumken laHZa?",
    ex: { ar: "ممكن لحظة؟ عايز أسألك.", ph: "mumken laHZa? 3aayez as2alak.", pl: "Masz chwilę? Chcę cię o coś zapytać.", en: "Do you have a minute? I want to ask you something." },
  },
  {
    cat: "expressions", pl: "mogę zadać pytanie?", en: "may I ask a question?", ar: "ممكن سؤال؟", ph: "mumken su2aal?",
    ex: { ar: "ممكن سؤال لو سمحت؟", ph: "mumken su2aal law samaHt?", pl: "Czy mogę zadać pytanie, proszę?", en: "May I ask a question, please?" },
  },
  {
    cat: "expressions", pl: "no dobra / to…", en: "well then / so…", ar: "طب", ph: "Tab",
    ex: { ar: "طب ماشي، نتكلم بكرة.", ph: "Tab maashi, netkallem bukra.", pl: "No dobra, pogadamy jutro.", en: "Alright, we'll talk tomorrow." },
  },
  {
    cat: "expressions", pl: "drobiazg / nic takiego", en: "no big deal", ar: "بسيطة", ph: "basiiTa",
    ex: { ar: "متقلقش، بسيطة.", ph: "mat2la2sh, basiiTa.", pl: "Nie martw się, to drobiazg.", en: "Don't worry, it's nothing." },
  },
  {
    cat: "expressions", pl: "to znaczy / no wiesz", en: "I mean / you know", ar: "يعني", ph: "ya3ni",
    ex: { ar: "الفيلم كان يعني مش وحش.", ph: "il-film kaan ya3ni mish weHesh.", pl: "Film był, no wiesz, nie taki zły.", en: "The movie was, you know, not that bad." },
  },
  {
    cat: "expressions", pl: "nie ma problemu", en: "no problem", ar: "مش مشكلة", ph: "mish moshkila",
    ex: { ar: "مش مشكلة، أقدر أستنى.", ph: "mish moshkila, a2dar astanna.", pl: "Nie ma problemu, mogę poczekać.", en: "No problem, I can wait." },
  },
  {
    cat: "expressions", pl: "nie przejmuj się (do m.)", en: "never mind (to m.)", ar: "ولا يهمك", ph: "wala yhemmak",
    ex: { ar: "ولا يهمك، كله هيبقى تمام.", ph: "wala yhemmak, kollo hayeb2a tamaam.", pl: "Nie przejmuj się, wszystko będzie dobrze.", en: "Don't worry, everything will be fine." },
  },
  {
    cat: "expressions", pl: "za pozwoleniem (wychodząc)", en: "excuse me (when leaving)", ar: "عن إذنك", ph: "3an iznak",
    ex: { ar: "عن إذنك، لازم أمشي.", ph: "3an iznak, laazem amshi.", pl: "Za pozwoleniem, muszę już iść.", en: "Excuse me, I have to go now." },
  },
  {
    cat: "expressions", pl: "dzięki / bądź zdrów (do m.)", en: "thanks / bless you (to m.)", ar: "تسلم", ph: "tislam",
    ex: { ar: "تسلم إيدك!", ph: "tislam iidak!", pl: "Dzięki! (dosł. niech żyje twoja ręka — np. za posiłek)", en: "Thanks! (lit. long live your hand — e.g. for a meal)" },
  },
  {
    cat: "expressions", pl: "wszystko w porządku", en: "everything's fine", ar: "كله تمام", ph: "kollo tamaam",
    ex: { ar: "كله تمام عندك؟", ph: "kollo tamaam 3andak?", pl: "Wszystko u ciebie w porządku?", en: "Is everything okay with you?" },
  },
  {
    cat: "expressions", pl: "od razu / prosto", en: "right away / straight", ar: "على طول", ph: "3ala Tuul",
    ex: { ar: "امشي على طول وبعدين شمال.", ph: "emshi 3ala Tuul wi ba3deen shemaal.", pl: "Idź prosto, a potem w lewo.", en: "Go straight, then left." },
  },
  {
    cat: "expressions", pl: "powoli / stopniowo", en: "slowly / gradually", ar: "شوية شوية", ph: "shwayya shwayya",
    ex: { ar: "بتعلم عربي شوية شوية.", ph: "bat3allem 3arabi shwayya shwayya.", pl: "Uczę się arabskiego krok po kroku.", en: "I'm learning Arabic step by step." },
  },
  {
    cat: "expressions", pl: "à propos / przy okazji", en: "by the way", ar: "على فكرة", ph: "3ala fekra",
    ex: { ar: "على فكرة، شفت صاحبك امبارح.", ph: "3ala fekra, shuft SaHbak embaareH.", pl: "Przy okazji — widziałem wczoraj twojego przyjaciela.", en: "By the way — I saw your friend yesterday." },
  },
];

// ---------- Wyrażenia religijne codziennego użytku ----------
// W Egipcie te zwroty są częścią zwykłej rozmowy niezależnie od religijności
// rozmówców — funkcjonują jak polskie "daj Boże" czy "dzięki Bogu".
const RELIGIOUS_WORDS = [
  {
    cat: "religious", pl: "jak Bóg da (o planach)", en: "God willing (about plans)", ar: "إن شاء الله", ph: "in shaa2 allah",
    ex: { ar: "أشوفك بكرة إن شاء الله.", ph: "ashuufak bukra in shaa2 allah.", pl: "Do zobaczenia jutro, jak Bóg da. (obowiązkowe przy każdym planie; bywa też grzecznym „zobaczymy”)", en: "See you tomorrow, God willing. (mandatory with any plan; also a polite \"we'll see\")" },
  },
  {
    cat: "religious", pl: "dzięki Bogu", en: "thank God", ar: "الحمد لله", ph: "il-Hamdu lillah",
    ex: { ar: "عامل إيه؟ — الحمد لله.", ph: "3aamel eeh? — il-Hamdu lillah.", pl: "Jak się masz? — Dzięki Bogu. (standardowa odpowiedź; też po posiłku)", en: "How are you? — Thank God. (standard reply; also after a meal)" },
  },
  {
    cat: "religious", pl: "cóż za cudo (podziw bez uroku)", en: "how wonderful (praise without envy)", ar: "ما شاء الله", ph: "ma shaa2 allah",
    ex: { ar: "ابنك كبر، ما شاء الله!", ph: "ibnak kebir, ma shaa2 allah!", pl: "Ale twój syn urósł, ma shaa2 allah! (wypada dodać przy komplementach, zwłaszcza o dzieciach)", en: "How your son has grown, mashallah! (worth adding with compliments, especially about children)" },
  },
  {
    cat: "religious", pl: "w imię Boga (zaczynając)", en: "in the name of God (when starting)", ar: "بسم الله", ph: "bismillah",
    ex: { ar: "بسم الله، نبدأ.", ph: "bismillah, nebda2.", pl: "Bismillah, zaczynamy. (przed jedzeniem, pracą, podróżą)", en: "Bismillah, let's begin. (before eating, working, traveling)" },
  },
  {
    cat: "religious", pl: "oby / daj Boże", en: "may it be so / God willing", ar: "يا رب", ph: "ya rabb",
    ex: { ar: "يا رب تنجح.", ph: "ya rabb tengaH.", pl: "Oby ci się udało.", en: "May you succeed." },
  },
  {
    cat: "religious", pl: "niech ci Bóg wynagrodzi (dziękując)", en: "may God reward you (thanking)", ar: "ربنا يخليك", ph: "rabbena yekhalliik",
    ex: { ar: "ساعدتني كتير، ربنا يخليك.", ph: "sa3edtini ketiir, rabbena yekhalliik.", pl: "Bardzo mi pomogłeś, niech ci Bóg wynagrodzi.", en: "You helped me a lot, may God reward you." },
  },
  {
    cat: "religious", pl: "oby Bóg ułatwił", en: "may God make it easy", ar: "ربنا يسهل", ph: "rabbena yesahhel",
    ex: { ar: "عندي امتحان بكرة. — ربنا يسهل!", ph: "3andi imtiHaan bukra. — rabbena yesahhel!", pl: "Mam jutro egzamin. — Oby poszło gładko!", en: "I have an exam tomorrow. — May it go smoothly!" },
  },
  {
    cat: "religious", pl: "za pozwoleniem Boga (pewniej niż in shaa2 allah)", en: "with God's permission (more certain than in shaa2 allah)", ar: "بإذن الله", ph: "bi2izn illah",
    ex: { ar: "هننجح بإذن الله.", ph: "hanengaH bi2izn illah.", pl: "Uda nam się, z Bożą pomocą.", en: "We'll make it, with God's help." },
  },
  {
    cat: "religious", pl: "pokój z tobą (powitanie)", en: "peace be upon you (greeting)", ar: "السلام عليكم", ph: "is-salaamu 3aleekum",
    ex: { ar: "السلام عليكم. — وعليكم السلام.", ph: "is-salaamu 3aleekum. — wa 3aleekum is-salaam.", pl: "Pokój z wami. — I z wami pokój. (odpowiedź jest obowiązkowa)", en: "Peace be upon you. — And upon you peace. (the reply is mandatory)" },
  },
  {
    cat: "religious", pl: "świeć Panie nad jego duszą", en: "may God have mercy on him", ar: "الله يرحمه", ph: "allah yarHamuh",
    ex: { ar: "جدي، الله يرحمه، كان طيب.", ph: "geddi, allah yarHamuh, kaan Tayyeb.", pl: "Mój dziadek, świeć Panie nad jego duszą, był dobrym człowiekiem. (o zmarłych; o kobiecie: allah yarHamha)", en: "My grandfather, may God rest his soul, was a good man. (of the deceased; of a woman: allah yarHamha)" },
  },
  {
    cat: "religious", pl: "Boże uchowaj / wybacz", en: "God forbid", ar: "أستغفر الله", ph: "astaghfar allah",
    ex: { ar: "أستغفر الله! مش ممكن.", ph: "astaghfar allah! mish mumken.", pl: "Boże uchowaj! Nie do wiary. (oburzenie lub skromne odżegnanie się od pochwały)", en: "God forbid! Unbelievable. (indignation or modestly deflecting praise)" },
  },
  {
    cat: "religious", pl: "błogosławionego piątku", en: "blessed Friday", ar: "جمعة مباركة", ph: "gum3a mubaraka",
    ex: { ar: "جمعة مباركة عليك.", ph: "gum3a mubaraka 3aleek.", pl: "Błogosławionego piątku. (piątkowe pozdrowienie, jak nasze „miłej niedzieli”)", en: "Blessed Friday. (a Friday greeting, like \"have a nice Sunday\")" },
  },
];

// ---------- Jedzenie i zakupy: rozszerzenie (słownictwo codzienne) ----------
const FOOD_WORDS = [
  // Owoce
  { cat: "food_shopping", pl: "owoce", en: "fruit", ar: "فاكهة", ph: "faakha" },
  { cat: "food_shopping", pl: "jabłko", en: "apple", ar: "تفاحة", ph: "toffaaHa" },
  { cat: "food_shopping", pl: "banan", en: "banana", ar: "موزة", ph: "mooza" },
  { cat: "food_shopping", pl: "pomarańcza", en: "orange", ar: "برتقانة", ph: "borto2aana" },
  { cat: "food_shopping", pl: "winogrona", en: "grapes", ar: "عنب", ph: "3enab" },
  { cat: "food_shopping", pl: "arbuz", en: "watermelon", ar: "بطيخ", ph: "baTTiikh" },
  { cat: "food_shopping", pl: "mango", en: "mango", ar: "مانجة", ph: "manga" },
  { cat: "food_shopping", pl: "cytryna", en: "lemon", ar: "لمونة", ph: "lamuuna" },
  { cat: "food_shopping", pl: "daktyle", en: "dates", ar: "بلح", ph: "balaH" },
  // Warzywa
  { cat: "food_shopping", pl: "warzywa", en: "vegetables", ar: "خضار", ph: "khoDaar" },
  { cat: "food_shopping", pl: "pomidor", en: "tomato", ar: "طماطم", ph: "TamaaTem" },
  { cat: "food_shopping", pl: "ziemniak", en: "potato", ar: "بطاطس", ph: "baTaaTes" },
  { cat: "food_shopping", pl: "cebula", en: "onion", ar: "بصل", ph: "baSal" },
  { cat: "food_shopping", pl: "czosnek", en: "garlic", ar: "توم", ph: "toom" },
  { cat: "food_shopping", pl: "ogórek", en: "cucumber", ar: "خيار", ph: "khiyaar" },
  { cat: "food_shopping", pl: "marchew", en: "carrot", ar: "جزر", ph: "gazar" },
  { cat: "food_shopping", pl: "bakłażan", en: "eggplant", ar: "بتنجان", ph: "betengaan" },
  { cat: "food_shopping", pl: "papryka", en: "pepper", ar: "فلفل", ph: "felfel" },
  // Mięso / białko
  { cat: "food_shopping", pl: "mięso", en: "meat", ar: "لحمة", ph: "laHma" },
  { cat: "food_shopping", pl: "kurczak", en: "chicken", ar: "فراخ", ph: "feraakh" },
  { cat: "food_shopping", pl: "ryba", en: "fish", ar: "سمك", ph: "samak" },
  { cat: "food_shopping", pl: "jajko", en: "egg", ar: "بيضة", ph: "beeDa" },
  { cat: "food_shopping", pl: "fasola bób (ful)", en: "fava beans (ful)", ar: "فول", ph: "fuul" },
  // Pieczywo / podstawy
  { cat: "food_shopping", pl: "chleb", en: "bread", ar: "عيش", ph: "3eesh" },
  { cat: "food_shopping", pl: "sól", en: "salt", ar: "ملح", ph: "malH" },
  { cat: "food_shopping", pl: "olej", en: "oil", ar: "زيت", ph: "zeet" },
  { cat: "food_shopping", pl: "masło", en: "butter", ar: "زبدة", ph: "zebda" },
  { cat: "food_shopping", pl: "miód", en: "honey", ar: "عسل", ph: "3asal" },
  // Napoje
  { cat: "food_shopping", pl: "woda", en: "water", ar: "ميّة", ph: "mayya" },
  { cat: "food_shopping", pl: "sok", en: "juice", ar: "عصير", ph: "3aSiir" },
  { cat: "food_shopping", pl: "kawa", en: "coffee", ar: "قهوة", ph: "2ahwa" },
  { cat: "food_shopping", pl: "kawa po turecku bez cukru", en: "Turkish coffee, no sugar", ar: "قهوة سادة", ph: "2ahwa saada" },
  // Sklepy i zakupy
  { cat: "food_shopping", pl: "sklep", en: "shop", ar: "محل", ph: "maHall" },
  { cat: "food_shopping", pl: "targ / bazar", en: "market", ar: "سوق", ph: "suu2" },
  { cat: "food_shopping", pl: "piekarnia", en: "bakery", ar: "مخبز", ph: "makhbaz" },
  { cat: "food_shopping", pl: "rzeźnik", en: "butcher", ar: "جزار", ph: "gazzaar" },
  { cat: "food_shopping", pl: "kilogram", en: "kilogram", ar: "كيلو", ph: "kiilo" },
  { cat: "food_shopping", pl: "pół kilo", en: "half a kilo", ar: "نص كيلو", ph: "noSS kiilo" },
  { cat: "food_shopping", pl: "reszta (pieniądze)", en: "change (money)", ar: "الباقي", ph: "il-baa2i" },
  {
    cat: "food_shopping", pl: "ile to kosztuje?", en: "how much is it?", ar: "بكام ده؟", ph: "bikaam da?",
    ex: { ar: "الكيلو بكام؟", ph: "il-kiilo bikaam?", pl: "Ile za kilogram?", en: "How much per kilo?" },
  },
  {
    cat: "food_shopping", pl: "poproszę kilo pomidorów", en: "a kilo of tomatoes, please", ar: "كيلو طماطم لو سمحت", ph: "kiilo TamaaTem law samaHt",
    ex: { ar: "إديني كيلو طماطم لو سمحت.", ph: "eddiini kiilo TamaaTem law samaHt.", pl: "Daj mi kilo pomidorów, proszę.", en: "Give me a kilo of tomatoes, please." },
  },
  { cat: "food_shopping", pl: "świeży", en: "fresh", ar: "طازة", ph: "Taaza" },
  { cat: "food_shopping", pl: "dojrzały", en: "ripe", ar: "مستوي", ph: "mestewi" },
];

// ---------- Kuchnia: potrawy i przymiotniki kulinarne ----------
const KITCHEN_WORDS = [
  // Sposób przyrządzenia (przymiotniki kulinarne)
  { cat: "kitchen", pl: "smażony", en: "fried", ar: "مقلي", ph: "ma2li", ex: { ar: "بيض مقلي", ph: "beeD ma2li", pl: "jajka smażone", en: "fried eggs" } },
  { cat: "kitchen", pl: "gotowany", en: "boiled", ar: "مسلوق", ph: "masluu2", ex: { ar: "بيض مسلوق", ph: "beeD masluu2", pl: "jajka gotowane", en: "boiled eggs" } },
  { cat: "kitchen", pl: "pieczony / z piekarnika", en: "baked / roasted", ar: "في الفرن", ph: "fil-forn", ex: { ar: "فراخ في الفرن", ph: "feraakh fil-forn", pl: "kurczak z piekarnika", en: "roast chicken" } },
  { cat: "kitchen", pl: "grillowany", en: "grilled", ar: "مشوي", ph: "mashwi", ex: { ar: "سمك مشوي", ph: "samak mashwi", pl: "ryba z grilla", en: "grilled fish" } },
  { cat: "kitchen", pl: "faszerowany / nadziewany", en: "stuffed", ar: "محشي", ph: "maHshi", ex: { ar: "محشي كرنب", ph: "maHshi koronb", pl: "gołąbki (nadziewana kapusta)", en: "stuffed cabbage rolls" } },
  { cat: "kitchen", pl: "duszony / w sosie", en: "stewed / in sauce", ar: "مطبوخ", ph: "maTbuukh" },
  { cat: "kitchen", pl: "surowy", en: "raw", ar: "ني", ph: "nayy" },
  { cat: "kitchen", pl: "ostry / pikantny", en: "spicy / hot", ar: "حار", ph: "Haar" },
  { cat: "kitchen", pl: "słodki", en: "sweet", ar: "حلو", ph: "Helw" },
  { cat: "kitchen", pl: "słony", en: "salty", ar: "مالح", ph: "maaleH" },
  { cat: "kitchen", pl: "kwaśny", en: "sour", ar: "حامض", ph: "HaameD" },
  { cat: "kitchen", pl: "gorzki", en: "bitter", ar: "مر", ph: "morr" },
  { cat: "kitchen", pl: "pyszny", en: "delicious", ar: "لذيذ", ph: "laziiz" },
  { cat: "kitchen", pl: "zimny", en: "cold", ar: "بارد", ph: "baared" },
  { cat: "kitchen", pl: "gorący / ciepły", en: "hot / warm", ar: "سخن", ph: "sokhn" },
  // Popularne potrawy egipskie
  { cat: "kitchen", pl: "koszari (danie narodowe)", en: "koshari (national dish)", ar: "كشري", ph: "koshari", ex: { ar: "أنا بحب الكشري.", ph: "ana baHebb il-koshari.", pl: "Lubię koszari.", en: "I like koshari." } },
  { cat: "kitchen", pl: "ful (bób) medames", en: "ful medames (fava beans)", ar: "فول مدمس", ph: "fuul medammes" },
  { cat: "kitchen", pl: "falafel (ta3meya)", en: "falafel (ta3meya)", ar: "طعمية", ph: "Ta3meyya" },
  { cat: "kitchen", pl: "molocheja (zupa)", en: "molokhia (soup)", ar: "ملوخية", ph: "molokheyya" },
  { cat: "kitchen", pl: "shawarma", en: "shawarma", ar: "شاورما", ph: "shawerma" },
  { cat: "kitchen", pl: "kofta (mielone na grillu)", en: "kofta (grilled minced meat)", ar: "كفتة", ph: "kofta" },
  { cat: "kitchen", pl: "sałatka", en: "salad", ar: "سلطة", ph: "salaTa" },
  { cat: "kitchen", pl: "zupa", en: "soup", ar: "شوربة", ph: "shorba" },
  { cat: "kitchen", pl: "makaron", en: "pasta", ar: "مكرونة", ph: "makaroona" },
  // Naczynia i sztućce
  { cat: "kitchen", pl: "talerz", en: "plate", ar: "طبق", ph: "Taba2" },
  { cat: "kitchen", pl: "szklanka", en: "glass", ar: "كباية", ph: "kobaaya" },
  { cat: "kitchen", pl: "widelec", en: "fork", ar: "شوكة", ph: "shooka" },
  { cat: "kitchen", pl: "łyżka", en: "spoon", ar: "معلقة", ph: "ma3la2a" },
  { cat: "kitchen", pl: "nóż", en: "knife", ar: "سكينة", ph: "sekkiina" },
  // Czasowniki kuchenne (bezokolicznik/temat)
  { cat: "kitchen", pl: "gotować", en: "to cook", ar: "يطبخ", ph: "yeTbokh" },
  { cat: "kitchen", pl: "jeść", en: "to eat", ar: "ياكل", ph: "yaakol" },
  { cat: "kitchen", pl: "pić", en: "to drink", ar: "يشرب", ph: "yeshrab" },
  // Zwroty
  { cat: "kitchen", pl: "jestem głodny (m.)", en: "I'm hungry (m.)", ar: "أنا جعان", ph: "ana ga3aan" },
  { cat: "kitchen", pl: "jestem spragniony (m.)", en: "I'm thirsty (m.)", ar: "أنا عطشان", ph: "ana 3aTshaan" },
  { cat: "kitchen", pl: "najadłem się / jestem syty", en: "I'm full", ar: "أنا شبعان", ph: "ana shab3aan" },
  {
    cat: "kitchen", pl: "co dzisiaj gotujesz?", en: "what are you cooking today?", ar: "بتطبخي إيه النهاردة؟", ph: "betoTbokhi eeh in-naharda?",
    ex: { ar: "بتطبخي إيه النهاردة؟", ph: "betoTbokhi eeh in-naharda?", pl: "Co dziś gotujesz? (do kobiety)", en: "What are you cooking today? (to f.)" },
  },
];

// ---------- Spójniki i łączniki ----------
// Egipski jest mniej „spójnikowy" niż polski — wiele polskich spójników
// oddaje kilka potocznych słów. Formy literackie (fusha) oznaczono w notatce.
const CONJUNCTION_WORDS = [
  {
    cat: "conjunctions", pl: "i / oraz", en: "and", ar: "و", ph: "wi",
    ex: { ar: "أنا وانت", ph: "ana w-enta", pl: "ja i ty", en: "you and I" },
  },
  {
    cat: "conjunctions", pl: "ale / lecz", en: "but", ar: "بس", ph: "bass",
    ex: { ar: "عايز أروح بس مش قادر.", ph: "3aayez aruuH bass mish 2aader.", pl: "Chcę iść, ale nie mogę.", en: "I want to go, but I can't." },
  },
  {
    cat: "conjunctions", pl: "ale (formalniej)", en: "but (more formal)", ar: "لكن", ph: "laakin",
    ex: { ar: "الأكل كويس لكن غالي.", ph: "il-akl kwayyes laakin 8aali.", pl: "Jedzenie dobre, ale drogie.", en: "The food is good, but expensive." },
  },
  {
    cat: "conjunctions", pl: "bo / ponieważ / żeby", en: "because / so that", ar: "عشان", ph: "3ashaan",
    ex: { ar: "بذاكر عشان أنجح.", ph: "bazaaker 3ashaan angaH.", pl: "Uczę się, żeby zdać. (3ashaan = i „bo”, i „żeby”)", en: "I study to pass. (3ashaan = both \"because\" and \"in order to\")" },
  },
  {
    cat: "conjunctions", pl: "ponieważ (pełniej)", en: "because (fuller form)", ar: "علشان", ph: "3alashaan",
    ex: { ar: "بحبها علشان طيبة.", ph: "baHebbaha 3alashaan Tayyeba.", pl: "Lubię ją, ponieważ jest miła.", en: "I like her because she's nice." },
  },
  {
    cat: "conjunctions", pl: "więc / dlatego", en: "so / therefore", ar: "فـ", ph: "fa",
    ex: { ar: "كان بيشتي فقعدت في البيت.", ph: "kaan biyshatti fa 2a3adt fil-beet.", pl: "Padało, więc został(a)em w domu.", en: "It was raining, so I stayed home." },
  },
  {
    cat: "conjunctions", pl: "albo / lub", en: "or", ar: "أو", ph: "aw",
    ex: { ar: "شاي أو قهوة؟", ph: "shaay aw 2ahwa?", pl: "Herbata czy kawa?", en: "Tea or coffee?" },
  },
  {
    cat: "conjunctions", pl: "albo… albo", en: "either… or", ar: "يا... يا", ph: "ya... ya",
    ex: { ar: "يا دلوقتي يا بكرة.", ph: "ya dilwa2ti ya bukra.", pl: "Albo teraz, albo jutro.", en: "Either now or tomorrow." },
  },
  {
    cat: "conjunctions", pl: "jeśli / jeżeli", en: "if", ar: "لو", ph: "law",
    ex: { ar: "لو عايز، تعالى.", ph: "law 3aayez, ta3aala.", pl: "Jeśli chcesz, przyjdź.", en: "If you want, come." },
  },
  {
    cat: "conjunctions", pl: "kiedy / gdy", en: "when", ar: "لما", ph: "lamma",
    ex: { ar: "لما توصل، كلمني.", ph: "lamma tewSal, kallemni.", pl: "Kiedy dotrzesz, zadzwoń.", en: "When you arrive, call." },
  },
  {
    cat: "conjunctions", pl: "że (spójnik dopełnieniowy)", en: "that (complementizer)", ar: "إن", ph: "enn",
    ex: { ar: "أعتقد إنه صح.", ph: "a3ta2ed ennu SaHH.", pl: "Myślę, że to prawda.", en: "I think it's true." },
  },
  {
    cat: "conjunctions", pl: "też / także", en: "also / too", ar: "كمان", ph: "kamaan",
    ex: { ar: "أنا كمان جاي.", ph: "ana kamaan gaay.", pl: "Ja też przychodzę.", en: "I'm coming too." },
  },
  {
    cat: "conjunctions", pl: "a poza tym / w dodatku", en: "and besides / moreover", ar: "وكمان", ph: "wi kamaan",
    ex: { ar: "غالي وكمان وحش.", ph: "8aali wi kamaan weHesh.", pl: "Drogie, a w dodatku kiepskie.", en: "Expensive, and bad on top of that." },
  },
  {
    cat: "conjunctions", pl: "mimo że / chociaż", en: "even though / although", ar: "مع إن", ph: "ma3 enn",
    ex: { ar: "خرج مع إنه تعبان.", ph: "kharag ma3 ennu ta3baan.", pl: "Wyszedł, chociaż był zmęczony.", en: "He went out even though he was tired." },
  },
  {
    cat: "conjunctions", pl: "jednak / mimo to", en: "however / still", ar: "برضه", ph: "barDo",
    ex: { ar: "تعبان بس رايح برضه.", ph: "ta3baan bass raayeH barDo.", pl: "Zmęczony, ale mimo to idę.", en: "Tired, but I'm going anyway." },
  },
  {
    cat: "conjunctions", pl: "aczkolwiek / jakkolwiek (fusha, formalne)", en: "although (fusha, formal)", ar: "على الرغم من", ph: "3ala r-ra8m men",
    ex: { ar: "على الرغم من التعب، كمّل.", ph: "3ala r-ra8m men it-ta3ab, kammel.", pl: "Mimo zmęczenia — kontynuował. (rejestr pisany/formalny)", en: "Despite the fatigue, he continued. (written/formal register)" },
  },
  {
    cat: "conjunctions", pl: "potem / następnie", en: "then / afterwards", ar: "بعدين", ph: "ba3deen",
    ex: { ar: "هناكل الأول وبعدين نخرج.", ph: "hanaakol il-awwel wi ba3deen nokhrog.", pl: "Najpierw zjemy, a potem wyjdziemy.", en: "First we'll eat, then we'll go out." },
  },
  {
    cat: "conjunctions", pl: "dlatego / z tego powodu", en: "that's why", ar: "عشان كده", ph: "3ashaan keda",
    ex: { ar: "تعبان، عشان كده مش جاي.", ph: "ta3baan, 3ashaan keda mish gaay.", pl: "Jestem zmęczony, dlatego nie przychodzę.", en: "I'm tired, that's why I'm not coming." },
  },
];

// ---------- Rodzina i bliscy: rozszerzenie ----------
const FAMILY_WORDS = [
  // Najbliżsi
  { cat: "family", pl: "rodzina", en: "family", ar: "عيلة", ph: "3eela" },
  { cat: "family", pl: "mąż", en: "husband", ar: "جوز", ph: "gooz" },
  { cat: "family", pl: "żona", en: "wife", ar: "مرات", ph: "meraat", ex: { ar: "دي مراتي.", ph: "di meraati.", pl: "To moja żona.", en: "This is my wife." } },
  { cat: "family", pl: "syn", en: "son", ar: "ابن", ph: "ebn" },
  { cat: "family", pl: "córka", en: "daughter", ar: "بنت", ph: "bint" },
  { cat: "family", pl: "dzieci", en: "children", ar: "عيال", ph: "3eyaal" },
  { cat: "family", pl: "dziecko / chłopiec", en: "child / boy", ar: "ولد", ph: "walad" },
  // Rodzice i dziadkowie
  { cat: "family", pl: "ojciec", en: "father", ar: "أب", ph: "2ab" },
  { cat: "family", pl: "matka", en: "mother", ar: "أم", ph: "2omm" },
  { cat: "family", pl: "rodzice", en: "parents", ar: "الوالدين", ph: "il-waldeen" },
  { cat: "family", pl: "dziadek", en: "grandfather", ar: "جد", ph: "gedd" },
  { cat: "family", pl: "babcia", en: "grandmother", ar: "جدة", ph: "gedda" },
  // Rodzeństwo
  { cat: "family", pl: "brat", en: "brother", ar: "أخ", ph: "akh" },
  { cat: "family", pl: "siostra", en: "sister", ar: "أخت", ph: "okht" },
  // Dalsza rodzina
  { cat: "family", pl: "wujek (brat ojca)", en: "uncle (father's brother)", ar: "عم", ph: "3amm" },
  { cat: "family", pl: "wujek (brat matki)", en: "uncle (mother's brother)", ar: "خال", ph: "khaal" },
  { cat: "family", pl: "ciotka (siostra ojca)", en: "aunt (father's sister)", ar: "عمة", ph: "3amma" },
  { cat: "family", pl: "ciotka (siostra matki)", en: "aunt (mother's sister)", ar: "خالة", ph: "khaala" },
  { cat: "family", pl: "kuzyn / kuzynka", en: "cousin", ar: "ابن عم / بنت عم", ph: "ebn 3amm / bint 3amm" },
  { cat: "family", pl: "wnuk / wnuczka", en: "grandchild", ar: "حفيد / حفيدة", ph: "Hafiid / Hafiida" },
  // Teściowie i powinowaci
  { cat: "family", pl: "teść / teściowa", en: "father-in-law / mother-in-law", ar: "حمو / حماة", ph: "Hamu / Hamaa" },
  { cat: "family", pl: "zięć", en: "son-in-law", ar: "جوز البنت", ph: "gooz il-bint" },
  { cat: "family", pl: "synowa", en: "daughter-in-law", ar: "مرات الابن", ph: "meraat il-ebn" },
  // Stan cywilny i etapy
  { cat: "family", pl: "narzeczony / narzeczona", en: "fiancé / fiancée", ar: "خطيب / خطيبة", ph: "khaTiib / khaTiiba" },
  { cat: "family", pl: "zaręczony (m.)", en: "engaged (m.)", ar: "مخطوب", ph: "makhTuub" },
  { cat: "family", pl: "żonaty / zamężna", en: "married", ar: "متجوز / متجوزة", ph: "metgawwez / metgawweza" },
  { cat: "family", pl: "kawaler / panna", en: "single", ar: "أعزب / عزباء", ph: "a3zab / 3azbaa2" },
  { cat: "family", pl: "rozwiedziony (m.)", en: "divorced (m.)", ar: "مطلق", ph: "meTalla2" },
  // Określenia
  { cat: "family", pl: "krewny / bliski", en: "relative", ar: "قريب", ph: "2ariib" },
  { cat: "family", pl: "sąsiad", en: "neighbor", ar: "جار", ph: "gaar" },
  { cat: "family", pl: "przyjaciel / kolega", en: "friend", ar: "صاحب", ph: "SaaHeb" },
  {
    cat: "family", pl: "ile masz dzieci?", en: "how many children do you have?", ar: "عندك كام عيل؟", ph: "3andak kaam 3ayyel?",
    ex: { ar: "عندك كام عيل؟", ph: "3andak kaam 3ayyel?", pl: "Ile masz dzieci? (do mężczyzny)", en: "How many children do you have? (to m.)" },
  },
  {
    cat: "family", pl: "jesteś żonaty?", en: "are you married?", ar: "إنت متجوز؟", ph: "enta metgawwez?",
    ex: { ar: "إنت متجوز ولا لأ؟", ph: "enta metgawwez walla la2?", pl: "Jesteś żonaty czy nie?", en: "Are you married or not?" },
  },
];

// ---------- Zdrowie i samopoczucie ----------
const HEALTH_WORDS = [
  { cat: "health", pl: "lekarz", en: "doctor", ar: "دكتور", ph: "doktoor" },
  { cat: "health", pl: "apteka", en: "pharmacy", ar: "صيدلية", ph: "Saydaleyya" },
  { cat: "health", pl: "lekarstwo", en: "medicine", ar: "دوا", ph: "dawa" },
  { cat: "health", pl: "szpital", en: "hospital", ar: "مستشفى", ph: "mustashfa" },
  { cat: "health", pl: "chory (m.)", en: "sick (m.)", ar: "عيان", ph: "3ayyaan" },
  { cat: "health", pl: "chora (ż.)", en: "sick (f.)", ar: "عيانة", ph: "3ayyaana" },
  { cat: "health", pl: "boli mnie", en: "it hurts me", ar: "بيوجعني", ph: "biyewga3ni" },
  { cat: "health", pl: "głowa", en: "head", ar: "راس", ph: "raas" },
  { cat: "health", pl: "boli mnie głowa", en: "I have a headache", ar: "راسي بتوجعني", ph: "raasi betewga3ni", ex: { ar: "راسي بتوجعني من الصبح.", ph: "raasi betewga3ni min iS-SobH.", pl: "Głowa boli mnie od rana.", en: "My head has been hurting since this morning." } },
  { cat: "health", pl: "brzuch", en: "stomach", ar: "بطن", ph: "baTn" },
  { cat: "health", pl: "gardło", en: "throat", ar: "زور", ph: "zoor" },
  { cat: "health", pl: "ząb", en: "tooth", ar: "سنة", ph: "senna" },
  { cat: "health", pl: "gorączka", en: "fever", ar: "سخونية", ph: "sokhoneyya" },
  { cat: "health", pl: "przeziębienie", en: "a cold", ar: "برد", ph: "bard" },
  { cat: "health", pl: "kaszel", en: "cough", ar: "كحة", ph: "koHHa" },
  { cat: "health", pl: "zmęczony (m.)", en: "tired (m.)", ar: "تعبان", ph: "ta3baan" },
  { cat: "health", pl: "czuję się lepiej", en: "I feel better", ar: "أنا أحسن", ph: "ana aHsan" },
  { cat: "health", pl: "potrzebuję lekarza", en: "I need a doctor", ar: "محتاج دكتور", ph: "meHtaag doktoor" },
  { cat: "health", pl: "zdrowie", en: "health", ar: "صحة", ph: "SeHHa" },
  { cat: "health", pl: "wyzdrowiej! (życzenie)", en: "get well soon!", ar: "سلامتك", ph: "salamtak", ex: { ar: "سلامتك، ألف سلامة.", ph: "salamtak, alf salaama.", pl: "Zdrowia, oby szybko wyzdrowieć.", en: "Get well, may you recover soon." } },
];

// ---------- Pogoda ----------
const WEATHER_WORDS = [
  { cat: "weather", pl: "pogoda", en: "weather", ar: "الجو", ph: "il-gaww" },
  { cat: "weather", pl: "gorąco", en: "hot", ar: "حر", ph: "Harr" },
  { cat: "weather", pl: "zimno", en: "cold", ar: "برد", ph: "bard" },
  { cat: "weather", pl: "słońce", en: "sun", ar: "شمس", ph: "shams" },
  { cat: "weather", pl: "deszcz", en: "rain", ar: "مطر", ph: "maTar" },
  { cat: "weather", pl: "wiatr", en: "wind", ar: "هوا", ph: "hawa" },
  { cat: "weather", pl: "upał", en: "heat", ar: "حرارة", ph: "Haraara" },
  { cat: "weather", pl: "chmury", en: "clouds", ar: "غيوم", ph: "8oyuum" },
  { cat: "weather", pl: "jest gorąco", en: "it's hot", ar: "الجو حر", ph: "il-gaww Harr", ex: { ar: "النهارده الجو حر أوي.", ph: "innaharda il-gaww Harr awi.", pl: "Dziś jest bardzo gorąco.", en: "It's very hot today." } },
  { cat: "weather", pl: "jest zimno", en: "it's cold", ar: "الجو برد", ph: "il-gaww bard" },
  { cat: "weather", pl: "pada deszcz", en: "it's raining", ar: "بتمطر", ph: "betemTar" },
  { cat: "weather", pl: "ładna pogoda", en: "nice weather", ar: "الجو حلو", ph: "il-gaww Helw" },
  { cat: "weather", pl: "lato", en: "summer", ar: "صيف", ph: "Seef" },
  { cat: "weather", pl: "zima", en: "winter", ar: "شتا", ph: "shita" },
];

// ---------- Small talk / rozmowy grzecznościowe ----------
// Pytania i zwroty, które podtrzymują rozmowę — mało treści, dużo relacji.
const SMALLTALK_WORDS = [
  { cat: "smalltalk", pl: "jak się masz? (do m.)", en: "how are you? (to m.)", ar: "عامل إيه؟", ph: "3aamel eeh?" },
  { cat: "smalltalk", pl: "jak się masz? (do ż.)", en: "how are you? (to f.)", ar: "عاملة إيه؟", ph: "3amla eeh?" },
  { cat: "smalltalk", pl: "co słychać?", en: "what's new?", ar: "أخبارك إيه؟", ph: "akhbaarak eeh?" },
  { cat: "smalltalk", pl: "jak leci? (dosł. jaki kolor)", en: "how are you? (lit. what color)", ar: "إزيك؟", ph: "ezzayyak?" },
  { cat: "smalltalk", pl: "jak twoja rodzina?", en: "how's your family?", ar: "إزاي العيلة؟", ph: "ezzaay il-3eela?" },
  { cat: "smalltalk", pl: "jak zdrowie? (dosł. jaki stan)", en: "how's your health?", ar: "إزاي الصحة؟", ph: "ezzaay iS-SeHHa?" },
  { cat: "smalltalk", pl: "co u ciebie nowego?", en: "what's new with you?", ar: "إيه الجديد؟", ph: "eeh ig-gediid?" },
  { cat: "smalltalk", pl: "jak babcia? (dosł. jak ma się)", en: "how's grandma?", ar: "إزاي تيتا؟", ph: "ezzaay teeta?" },
  { cat: "smalltalk", pl: "dawno się nie widzieliśmy", en: "long time no see", ar: "من زمان ما شفتكش", ph: "min zamaan ma shoftaksh" },
  { cat: "smalltalk", pl: "tęskniłem za tobą (do m.)", en: "I missed you (to m.)", ar: "وحشتني", ph: "waHashtini" },
  { cat: "smalltalk", pl: "wszystko dobrze, dzięki Bogu", en: "all good, thank God", ar: "كله تمام، الحمد لله", ph: "kollo tamaam, il-Hamdulillah" },
  { cat: "smalltalk", pl: "jakoś leci (tak sobie)", en: "getting by / so-so", ar: "ماشي الحال", ph: "maashi il-Haal" },
  { cat: "smalltalk", pl: "pozdrów rodzinę", en: "say hi to your family", ar: "سلّم على العيلة", ph: "sallem 3ala il-3eela" },
  { cat: "smalltalk", pl: "co porabiałeś?", en: "what have you been up to?", ar: "كنت بتعمل إيه؟", ph: "kont bete3mel eeh?" },
  { cat: "smalltalk", pl: "miło było cię widzieć", en: "nice to see you", ar: "فرصة سعيدة", ph: "forSa sa3iida" },
  { cat: "smalltalk", pl: "trzymaj się (uważaj na siebie)", en: "take care of yourself", ar: "خلي بالك من نفسك", ph: "khalli baalak min nafsak" },
];

// ---------- Wygładzacze i reakcje (język mówiony) ----------
// Wtrącenia, pauzy, potakiwania. Egipski to język mówiony — te słowa są jego rytmem.
const FILLER_WORDS = [
  { cat: "fillers", pl: "no wiesz / to znaczy (pauza)", en: "you know / I mean (filler)", ar: "يعني", ph: "ya3ni", ex: { ar: "الفيلم كان... يعني... مش بطال.", ph: "il-film kaan... ya3ni... mish baTTaal.", pl: "Film był... no wiesz... niezły.", en: "The movie was... you know... not bad." } },
  { cat: "fillers", pl: "normalnie / nic takiego (wzruszenie ramion)", en: "it's normal / no big deal", ar: "عادي", ph: "3aadi", ex: { ar: "معلش، عادي، بيحصل.", ph: "ma3lesh, 3aadi, biyiHSal.", pl: "Nie szkodzi, normalne, zdarza się.", en: "Never mind, it's normal, it happens." } },
  { cat: "fillers", pl: "no dobra / że tak powiem (na końcu)", en: "well then (sentence-final)", ar: "بقى", ph: "ba2a", ex: { ar: "يلا بينا بقى!", ph: "yalla biina ba2a!", pl: "No to chodźmy już!", en: "So let's go already!" } },
  { cat: "fillers", pl: "tak jakby / w ten sposób", en: "like this / sort of", ar: "كده", ph: "keda" },
  { cat: "fillers", pl: "a propos / przy okazji", en: "by the way", ar: "على فكرة", ph: "3ala fekra" },
  { cat: "fillers", pl: "oczywiście / jasne", en: "of course", ar: "طبعاً", ph: "Tab3an" },
  { cat: "fillers", pl: "naprawdę? (zdziwienie)", en: "really? (surprise)", ar: "بجد؟", ph: "begad?" },
  { cat: "fillers", pl: "niemożliwe! (nie do wiary)", en: "no way! / unbelievable!", ar: "مش معقول!", ph: "mish ma32uul!" },
  { cat: "fillers", pl: "wspaniale! / super", en: "great! / lovely!", ar: "جميل!", ph: "gamiil!" },
  { cat: "fillers", pl: "poważnie mówię", en: "I'm serious", ar: "بجد بقولك", ph: "begad ba2ollak" },
  { cat: "fillers", pl: "no właśnie / dokładnie", en: "exactly", ar: "بالظبط", ph: "biZ-ZabT" },
  { cat: "fillers", pl: "rozumiem / jasne (potakiwanie)", en: "I get it / right", ar: "فاهم", ph: "faahem" },
  { cat: "fillers", pl: "no i? / i co dalej?", en: "and then? / so what?", ar: "وبعدين؟", ph: "we ba3deen?" },
  { cat: "fillers", pl: "słuchaj... (zaczepienie)", en: "look... / listen...", ar: "بص...", ph: "boSS..." },
  { cat: "fillers", pl: "krótko mówiąc", en: "long story short", ar: "المهم", ph: "il-mohemm" },
  { cat: "fillers", pl: "coś w tym stylu", en: "something like that", ar: "حاجة زي كده", ph: "Haaga zayy keda" },
  { cat: "fillers", pl: "to ciekawe, co mówisz", en: "that's interesting", ar: "كلام جميل", ph: "kalaam gamiil" },
  { cat: "fillers", pl: "dobra, dobra (zgoda/koniec tematu)", en: "okay okay (agreement/ending it)", ar: "خلاص خلاص", ph: "khalaaS khalaaS" },
];

// ---------- Slang wyższego poziomu (brzmieć jak miejscowy) ----------
// Wyrażenia, które sygnalizują dobrą znajomość języka. Uwaga na rejestr — potoczne.
const SLANG_WORDS = [
  { cat: "slang", pl: "z przyjemnością (dosł. z moich oczu)", en: "with pleasure (lit. from my eyes)", ar: "من عنيا", ph: "men 3enaaya", ex: { ar: "أساعدك؟ من عنيا!", ph: "asaa3dak? men 3enaaya!", pl: "Pomóc ci? Z przyjemnością!", en: "Can I help you? With pleasure!" } },
  { cat: "slang", pl: "świetny pomysł", en: "great idea", ar: "فكرة جامدة", ph: "fekra gamda" },
  { cat: "slang", pl: "spoko / w porządku (o czymś)", en: "that works / it's fine", ar: "ده ماشي", ph: "da maashi" },
  { cat: "slang", pl: "wyluzuj / odpuść", en: "chill out / let it go", ar: "فكّك", ph: "fokkak" },
  { cat: "slang", pl: "nie ma sprawy / bez problemu", en: "no worries", ar: "مفيش مشكلة", ph: "mafiish moshkela" },
  { cat: "slang", pl: "równy gość (dosł. lekka krew)", en: "a cool guy (lit. light blood)", ar: "دمه خفيف", ph: "dammo khafiif" },
  { cat: "slang", pl: "nudziarz (dosł. ciężka krew)", en: "a bore (lit. heavy blood)", ar: "دمه تقيل", ph: "dammo te2iil" },
  { cat: "slang", pl: "szefie / mistrzu (do m., z sympatią)", en: "boss / chief (friendly, to m.)", ar: "يا باشا", ph: "ya baasha" },
  { cat: "slang", pl: "stary / ziomek (zaczepnie)", en: "man / dude (casual)", ar: "يا عم", ph: "ya 3amm" },
  { cat: "slang", pl: "genialne / miód (dosł. miód)", en: "brilliant (lit. honey)", ar: "عسل", ph: "3asal" },
  { cat: "slang", pl: "idealnie / sto procent", en: "perfect / one hundred percent", ar: "مية مية", ph: "meyya meyya" },
  { cat: "slang", pl: "nie martw się tym", en: "don't worry about it", ar: "ولا يهمك", ph: "wala yhemmak" },
  { cat: "slang", pl: "gadanie / puste słowa", en: "empty talk", ar: "كلام فاضي", ph: "kalaam faaDi" },
  { cat: "slang", pl: "on tylko gada bez sensu", en: "he's just talking nonsense", ar: "بيقول أي كلام", ph: "biy2uul ayy kalaam" },
  { cat: "slang", pl: "kiedy świnie zaczną latać (nigdy)", en: "when pigs fly (lit. in apricot season)", ar: "في المشمش", ph: "fil-meshmesh" },
  { cat: "slang", pl: "daj spokój / no weź (namawianie)", en: "come on / enough already", ar: "خلاص بقى", ph: "khalaaS ba2a" },
  { cat: "slang", pl: "co jest grane? / o co chodzi?", en: "what's the story?", ar: "إيه الحكاية؟", ph: "eeh il-Hekaaya?" },
  { cat: "slang", pl: "super sprawa / ekstra", en: "awesome / a gem", ar: "تحفة", ph: "toHfa" },
];

// ---------- O sobie / życie codzienne ----------
// Słownictwo do mówienia o pracy, nauce, mieszkaniu, zwierzętach — podstawa
// osobistych rozmów i tekstów.
const LIFE_WORDS = [
  // praca i zawody
  { cat: "life", pl: "praca", en: "work", ar: "شغل", ph: "shughl" },
  { cat: "life", pl: "pracuję", en: "I work", ar: "بشتغل", ph: "bashtaghal" },
  { cat: "life", pl: "firma", en: "company", ar: "شركة", ph: "sherka" },
  { cat: "life", pl: "biuro", en: "office", ar: "مكتب", ph: "maktab" },
  { cat: "life", pl: "prawnik / adwokat", en: "lawyer", ar: "محامي", ph: "moHaami" },
  { cat: "life", pl: "architekt(ka)", en: "architect", ar: "مهندس معماري", ph: "mohandes me3maari" },
  { cat: "life", pl: "księgowość", en: "accounting", ar: "محاسبة", ph: "moHasba" },
  { cat: "life", pl: "pracownik", en: "employee", ar: "موظف", ph: "mowaZZaf" },
  { cat: "life", pl: "właściciel", en: "owner", ar: "صاحب", ph: "SaaHeb" },
  { cat: "life", pl: "klient", en: "client", ar: "عميل", ph: "3amiil" },
  { cat: "life", pl: "podatki", en: "taxes", ar: "ضرايب", ph: "Daraayeb" },
  // nauka i język
  { cat: "life", pl: "uczę się", en: "I'm learning", ar: "بتعلم", ph: "bat3allem" },
  { cat: "life", pl: "nauczyciel(ka)", en: "teacher", ar: "مدرس / مدرسة", ph: "modarres / modarresa" },
  { cat: "life", pl: "język", en: "language", ar: "لغة", ph: "lo8a" },
  { cat: "life", pl: "arabski (język)", en: "Arabic (language)", ar: "عربي", ph: "3arabi" },
  { cat: "life", pl: "polski (język)", en: "Polish (language)", ar: "بولندي", ph: "bolandi" },
  { cat: "life", pl: "lekcja", en: "lesson", ar: "درس", ph: "dars" },
  { cat: "life", pl: "trudny", en: "difficult", ar: "صعب", ph: "Sa3b" },
  { cat: "life", pl: "łatwy", en: "easy", ar: "سهل", ph: "sahl" },
  { cat: "life", pl: "przez internet / online", en: "online", ar: "أونلاين", ph: "onlaayn" },
  { cat: "life", pl: "hobby", en: "hobby", ar: "هواية", ph: "hewaaya" },
  // dom i miejsca
  { cat: "life", pl: "mieszkanie", en: "apartment", ar: "شقة", ph: "sha22a" },
  { cat: "life", pl: "miasto", en: "city", ar: "مدينة", ph: "mediina" },
  { cat: "life", pl: "kraj", en: "country", ar: "بلد", ph: "balad" },
  { cat: "life", pl: "Polska", en: "Poland", ar: "بولندا", ph: "bolanda" },
  { cat: "life", pl: "Egipt", en: "Egypt", ar: "مصر", ph: "maSr" },
  { cat: "life", pl: "za granicą", en: "abroad", ar: "برة", ph: "barra" },
  // zwierzęta
  { cat: "life", pl: "pies", en: "dog", ar: "كلب", ph: "kalb" },
  { cat: "life", pl: "kot", en: "cat", ar: "قطة", ph: "2oTTa" },
  // czasowniki uczuć/relacji przydatne o sobie
  { cat: "life", pl: "lubię / kocham", en: "I like / I love", ar: "بحب", ph: "baHebb" },
  { cat: "life", pl: "mieszkam (m.)", en: "I live (m.)", ar: "ساكن", ph: "saaken" },
  { cat: "life", pl: "od dwóch lat", en: "for two years", ar: "من سنتين", ph: "min santeen" },
  { cat: "life", pl: "rok", en: "year", ar: "سنة", ph: "sana" },
  { cat: "life", pl: "razem", en: "together", ar: "مع بعض", ph: "ma3 ba3D" },
];

// ---------- Kolory ----------
const COLOR_WORDS = [
  { cat: "colors", pl: "kolor", en: "color", ar: "لون", ph: "loon" },
  { cat: "colors", pl: "czerwony", en: "red", ar: "أحمر", ph: "aHmar", ex: { ar: "العربية حمرا.", ph: "il-3arabeyya Hamra.", pl: "Samochód jest czerwony.", en: "The car is red." } },
  { cat: "colors", pl: "niebieski", en: "blue", ar: "أزرق", ph: "azra2", ex: { ar: "السما زرقا النهارده.", ph: "is-sama zar2a innaharda.", pl: "Niebo jest dziś niebieskie.", en: "The sky is blue today." } },
  { cat: "colors", pl: "zielony", en: "green", ar: "أخضر", ph: "akhDar" },
  { cat: "colors", pl: "żółty", en: "yellow", ar: "أصفر", ph: "aSfar" },
  { cat: "colors", pl: "czarny", en: "black", ar: "أسود", ph: "eswed" },
  { cat: "colors", pl: "biały", en: "white", ar: "أبيض", ph: "abyaD" },
  { cat: "colors", pl: "brązowy", en: "brown", ar: "بني", ph: "bonni" },
  { cat: "colors", pl: "pomarańczowy", en: "orange (color)", ar: "برتقاني", ph: "borto2aani" },
  { cat: "colors", pl: "różowy", en: "pink", ar: "بمبي", ph: "bambi" },
  { cat: "colors", pl: "szary", en: "gray", ar: "رمادي", ph: "romaadi" },
  { cat: "colors", pl: "fioletowy", en: "purple", ar: "بنفسجي", ph: "banafsegi" },
  { cat: "colors", pl: "jasny", en: "light", ar: "فاتح", ph: "faateH", ex: { ar: "أزرق فاتح.", ph: "azra2 faateH.", pl: "Jasnoniebieski.", en: "Light blue." } },
  { cat: "colors", pl: "ciemny", en: "dark", ar: "غامق", ph: "8aame2", ex: { ar: "أخضر غامق.", ph: "akhDar 8aame2.", pl: "Ciemnozielony.", en: "Dark green." } },
];

// ---------- Przymiotniki opisowe ----------
const ADJECTIVE_WORDS = [
  { cat: "adjectives", pl: "duży", en: "big", ar: "كبير", ph: "kebiir", ex: { ar: "البيت ده كبير.", ph: "il-beet da kebiir.", pl: "Ten dom jest duży.", en: "This house is big." } },
  { cat: "adjectives", pl: "mały", en: "small", ar: "صغير", ph: "So8ayyar", ex: { ar: "العيال صغيرين.", ph: "il-3eyaal So8ayyariin.", pl: "Dzieci są małe.", en: "The children are small." } },
  { cat: "adjectives", pl: "ładny / piękny", en: "beautiful / nice", ar: "جميل", ph: "gamiil" },
  { cat: "adjectives", pl: "brzydki", en: "ugly", ar: "وحش", ph: "weHesh" },
  { cat: "adjectives", pl: "długi", en: "long", ar: "طويل", ph: "Tawiil" },
  { cat: "adjectives", pl: "krótki", en: "short", ar: "قصير", ph: "2oSayyar" },
  { cat: "adjectives", pl: "wysoki", en: "tall / high", ar: "عالي", ph: "3aali" },
  { cat: "adjectives", pl: "niski", en: "low / short", ar: "واطي", ph: "waaTi" },
  { cat: "adjectives", pl: "gruby", en: "fat / thick", ar: "تخين", ph: "tekhiin" },
  { cat: "adjectives", pl: "szczupły / chudy", en: "thin / slim", ar: "رفيع", ph: "rofayya3" },
  { cat: "adjectives", pl: "stary (o rzeczy)", en: "old (thing)", ar: "قديم", ph: "2adiim" },
  { cat: "adjectives", pl: "nowy", en: "new", ar: "جديد", ph: "gediid" },
  { cat: "adjectives", pl: "szybki", en: "fast", ar: "سريع", ph: "sarii3" },
  { cat: "adjectives", pl: "wolny (powolny)", en: "slow", ar: "بطيء", ph: "baTii2" },
  { cat: "adjectives", pl: "silny / mocny", en: "strong", ar: "قوي", ph: "2awi" },
  { cat: "adjectives", pl: "słaby", en: "weak", ar: "ضعيف", ph: "Da3iif" },
  { cat: "adjectives", pl: "bogaty", en: "rich", ar: "غني", ph: "8ani" },
  { cat: "adjectives", pl: "biedny", en: "poor", ar: "فقير", ph: "fa2iir" },
  { cat: "adjectives", pl: "łatwy", en: "easy", ar: "سهل", ph: "sahl" },
  { cat: "adjectives", pl: "trudny", en: "difficult", ar: "صعب", ph: "Sa3b" },
  { cat: "adjectives", pl: "pełny", en: "full", ar: "مليان", ph: "malyaan" },
  { cat: "adjectives", pl: "pusty", en: "empty", ar: "فاضي", ph: "faaDi" },
  { cat: "adjectives", pl: "czysty", en: "clean", ar: "نضيف", ph: "neDiif" },
  { cat: "adjectives", pl: "brudny", en: "dirty", ar: "وسخ", ph: "wesekh" },
  { cat: "adjectives", pl: "drogi", en: "expensive", ar: "غالي", ph: "8aali" },
  { cat: "adjectives", pl: "tani", en: "cheap", ar: "رخيص", ph: "rekhiiS" },
  { cat: "adjectives", pl: "ważny", en: "important", ar: "مهم", ph: "mohemm" },
  { cat: "adjectives", pl: "prawdziwy", en: "real / true", ar: "حقيقي", ph: "Ha2ii2i" },
];

// ---------- Czasowniki codzienne (forma podstawowa, on/ona) ----------
const DAILY_VERB_WORDS = [
  { cat: "daily_verbs", pl: "dawać", en: "to give", ar: "يدي", ph: "yeddi", ex: { ar: "ممكن تديني المية؟", ph: "momken teddiini il-mayya?", pl: "Możesz mi dać wodę?", en: "Can you give me water?" } },
  { cat: "daily_verbs", pl: "brać", en: "to take", ar: "ياخد", ph: "yaakhod", ex: { ar: "خد الكتاب ده.", ph: "khod il-ketaab da.", pl: "Weź tę książkę.", en: "Take this book." } },
  { cat: "daily_verbs", pl: "kupować", en: "to buy", ar: "يشتري", ph: "yeshteri", ex: { ar: "بشتري خضار من السوق.", ph: "bashteri khoDaar min is-suu2.", pl: "Kupuję warzywa na targu.", en: "I buy vegetables at the market." } },
  { cat: "daily_verbs", pl: "sprzedawać", en: "to sell", ar: "يبيع", ph: "yebii3" },
  { cat: "daily_verbs", pl: "otwierać", en: "to open", ar: "يفتح", ph: "yeftaH", ex: { ar: "افتح الشباك.", ph: "eftaH ish-shebbaak.", pl: "Otwórz okno.", en: "Open the window." } },
  { cat: "daily_verbs", pl: "zamykać", en: "to close", ar: "يقفل", ph: "ye2fel" },
  { cat: "daily_verbs", pl: "zaczynać", en: "to start", ar: "يبدأ", ph: "yebda2" },
  { cat: "daily_verbs", pl: "kończyć", en: "to finish", ar: "يخلص", ph: "yekhallaS" },
  { cat: "daily_verbs", pl: "szukać", en: "to look for", ar: "يدور", ph: "yedawwar", ex: { ar: "بدور على المفتاح.", ph: "badawwar 3ala il-muftaaH.", pl: "Szukam klucza.", en: "I'm looking for the key." } },
  { cat: "daily_verbs", pl: "znajdować", en: "to find", ar: "يلاقي", ph: "yelaa2i" },
  { cat: "daily_verbs", pl: "pomagać", en: "to help", ar: "يساعد", ph: "yesaa3ed", ex: { ar: "ممكن تساعدني؟", ph: "momken tesa3edni?", pl: "Możesz mi pomóc?", en: "Can you help me?" } },
  { cat: "daily_verbs", pl: "pytać", en: "to ask", ar: "يسأل", ph: "yes2al" },
  { cat: "daily_verbs", pl: "odpowiadać", en: "to answer", ar: "يرد", ph: "yeredd" },
  { cat: "daily_verbs", pl: "mówić / powiedzieć", en: "to say / to speak", ar: "يقول", ph: "ye2uul" },
  { cat: "daily_verbs", pl: "słuchać", en: "to listen", ar: "يسمع", ph: "yesma3" },
  { cat: "daily_verbs", pl: "czytać", en: "to read", ar: "يقرأ", ph: "ye2ra" },
  { cat: "daily_verbs", pl: "myśleć", en: "to think", ar: "يفكر", ph: "yefakkar" },
  { cat: "daily_verbs", pl: "wiedzieć / znać", en: "to know", ar: "يعرف", ph: "ye3raf" },
  { cat: "daily_verbs", pl: "lubić / kochać", en: "to like / to love", ar: "يحب", ph: "yeHebb" },
  { cat: "daily_verbs", pl: "grać", en: "to play", ar: "يلعب", ph: "yel3ab" },
  { cat: "daily_verbs", pl: "pracować", en: "to work", ar: "يشتغل", ph: "yeshtaghal" },
  { cat: "daily_verbs", pl: "płacić", en: "to pay", ar: "يدفع", ph: "yedfa3" },
  { cat: "daily_verbs", pl: "czekać", en: "to wait", ar: "يستنى", ph: "yestanna", ex: { ar: "استنى شوية.", ph: "estanna shwayya.", pl: "Poczekaj chwilę.", en: "Wait a moment." } },
  { cat: "daily_verbs", pl: "używać", en: "to use", ar: "يستعمل", ph: "yesta3mel" },
];

// ---------- Czasowniki ruchu ----------
const MOTION_VERB_WORDS = [
  { cat: "motion", pl: "iść / chodzić", en: "to walk", ar: "يمشي", ph: "yemshi", ex: { ar: "بمشي كل يوم.", ph: "bamshi koll yoom.", pl: "Chodzę codziennie.", en: "I walk every day." } },
  { cat: "motion", pl: "iść (dokądś)", en: "to go (somewhere)", ar: "يروح", ph: "yeruuH", ex: { ar: "بروح الشغل بدري.", ph: "baruuH ish-shughl badri.", pl: "Idę do pracy wcześnie.", en: "I go to work early." } },
  { cat: "motion", pl: "przychodzić", en: "to come", ar: "ييجي", ph: "yiigi", ex: { ar: "تعالى هنا!", ph: "ta3aala hena!", pl: "Chodź tutaj!", en: "Come here!" } },
  { cat: "motion", pl: "wracać", en: "to return", ar: "يرجع", ph: "yerga3" },
  { cat: "motion", pl: "wchodzić", en: "to enter", ar: "يدخل", ph: "yedkhol" },
  { cat: "motion", pl: "wychodzić", en: "to go out", ar: "يخرج", ph: "yokhrog" },
  { cat: "motion", pl: "jechać (pojazdem)", en: "to ride / to board", ar: "يركب", ph: "yerkab", ex: { ar: "بركب تاكسي.", ph: "barkab taksi.", pl: "Jadę taksówką.", en: "I'm taking a taxi." } },
  { cat: "motion", pl: "wstawać", en: "to get up", ar: "يقوم", ph: "ye2uum" },
  { cat: "motion", pl: "siadać", en: "to sit down", ar: "يقعد", ph: "yo23od", ex: { ar: "اقعد هنا.", ph: "o23od hena.", pl: "Usiądź tutaj.", en: "Sit here." } },
  { cat: "motion", pl: "stać / zatrzymać się", en: "to stand / to stop", ar: "يقف", ph: "ye2af" },
  { cat: "motion", pl: "biegać", en: "to run", ar: "يجري", ph: "yegri" },
  { cat: "motion", pl: "podróżować", en: "to travel", ar: "يسافر", ph: "yesaafer", ex: { ar: "بسافر مصر كل سنة.", ph: "basaafer maSr koll sana.", pl: "Podróżuję do Egiptu co roku.", en: "I travel to Egypt every year." } },
];

// ---------- Przysłówki czasu i częstotliwości ----------
const TIME_ADVERB_WORDS = [
  { cat: "time_adverbs", pl: "teraz", en: "now", ar: "دلوقتي", ph: "delwa2ti" },
  { cat: "time_adverbs", pl: "potem / później", en: "later", ar: "بعدين", ph: "ba3deen" },
  { cat: "time_adverbs", pl: "wcześniej / przedtem", en: "before / earlier", ar: "قبل كده", ph: "2abl keda" },
  { cat: "time_adverbs", pl: "zawsze", en: "always", ar: "دايماً", ph: "daayman", ex: { ar: "بشرب قهوة دايماً.", ph: "bashrab 2ahwa daayman.", pl: "Zawsze piję kawę.", en: "I always drink coffee." } },
  { cat: "time_adverbs", pl: "nigdy", en: "never", ar: "أبداً", ph: "abadan" },
  { cat: "time_adverbs", pl: "czasami", en: "sometimes", ar: "أحياناً", ph: "aHyaanan" },
  { cat: "time_adverbs", pl: "często", en: "often", ar: "كتير", ph: "ketiir" },
  { cat: "time_adverbs", pl: "rzadko", en: "rarely", ar: "نادراً", ph: "naadran" },
  { cat: "time_adverbs", pl: "wczoraj", en: "yesterday", ar: "إمبارح", ph: "embaareH" },
  { cat: "time_adverbs", pl: "dzisiaj", en: "today", ar: "النهارده", ph: "innaharda" },
  { cat: "time_adverbs", pl: "jutro", en: "tomorrow", ar: "بكرة", ph: "bukra" },
  { cat: "time_adverbs", pl: "wcześnie", en: "early", ar: "بدري", ph: "badri" },
  { cat: "time_adverbs", pl: "późno", en: "late", ar: "متأخر", ph: "met2akhkhar" },
  { cat: "time_adverbs", pl: "szybko", en: "quickly", ar: "بسرعة", ph: "besor3a" },
  { cat: "time_adverbs", pl: "powoli", en: "slowly", ar: "بالراحة", ph: "bir-raaHa" },
  { cat: "time_adverbs", pl: "jeszcze / wciąż", en: "still / not yet", ar: "لسه", ph: "lessa" },
  { cat: "time_adverbs", pl: "już", en: "already / done", ar: "خلاص", ph: "khalaaS" },
];

// ---------- Ciało ----------
const BODY_WORDS = [
  { cat: "body", pl: "głowa", en: "head", ar: "راس", ph: "raas" },
  { cat: "body", pl: "twarz", en: "face", ar: "وش", ph: "wesh" },
  { cat: "body", pl: "oko", en: "eye", ar: "عين", ph: "3een" },
  { cat: "body", pl: "ucho", en: "ear", ar: "ودن", ph: "wedn" },
  { cat: "body", pl: "nos", en: "nose", ar: "مناخير", ph: "manakhiir" },
  { cat: "body", pl: "usta", en: "mouth", ar: "بق", ph: "bo22" },
  { cat: "body", pl: "ząb", en: "tooth", ar: "سنة", ph: "senna" },
  { cat: "body", pl: "język (w ustach)", en: "tongue", ar: "لسان", ph: "lesaan" },
  { cat: "body", pl: "włosy", en: "hair", ar: "شعر", ph: "sha3r" },
  { cat: "body", pl: "szyja", en: "neck", ar: "رقبة", ph: "ra2aba" },
  { cat: "body", pl: "ręka / dłoń", en: "hand", ar: "إيد", ph: "iid" },
  { cat: "body", pl: "palec", en: "finger", ar: "صباع", ph: "Sobaa3" },
  { cat: "body", pl: "noga", en: "leg", ar: "رجل", ph: "regl" },
  { cat: "body", pl: "stopa", en: "foot", ar: "قدم", ph: "2adam" },
  { cat: "body", pl: "serce", en: "heart", ar: "قلب", ph: "2alb" },
  { cat: "body", pl: "brzuch", en: "stomach", ar: "بطن", ph: "baTn" },
  { cat: "body", pl: "plecy", en: "back", ar: "ضهر", ph: "Dahr" },
  { cat: "body", pl: "ramię / bark", en: "shoulder", ar: "كتف", ph: "ketf" },
];

// ---------- Ubrania ----------
const CLOTHES_WORDS = [
  { cat: "clothes", pl: "ubrania", en: "clothes", ar: "هدوم", ph: "hoduum" },
  { cat: "clothes", pl: "koszula", en: "shirt", ar: "قميص", ph: "2amiiS" },
  { cat: "clothes", pl: "spodnie", en: "trousers", ar: "بنطلون", ph: "banTaloon" },
  { cat: "clothes", pl: "buty", en: "shoes", ar: "جزمة", ph: "gazma" },
  { cat: "clothes", pl: "sukienka", en: "dress", ar: "فستان", ph: "fostaan" },
  { cat: "clothes", pl: "kurtka / płaszcz", en: "jacket / coat", ar: "جاكيت", ph: "zhakeet" },
  { cat: "clothes", pl: "czapka / kapelusz", en: "hat", ar: "قبعة", ph: "2obba3a" },
  { cat: "clothes", pl: "skarpetki", en: "socks", ar: "شراب", ph: "sharaab" },
  { cat: "clothes", pl: "sweter", en: "sweater", ar: "بلوفر", ph: "belofar" },
  { cat: "clothes", pl: "koszulka (t-shirt)", en: "t-shirt", ar: "تي شيرت", ph: "ti-shirt" },
  { cat: "clothes", pl: "okulary", en: "glasses", ar: "نضارة", ph: "naDDaara" },
  { cat: "clothes", pl: "zegarek", en: "watch", ar: "ساعة", ph: "saa3a" },
  { cat: "clothes", pl: "torba", en: "bag", ar: "شنطة", ph: "shanTa" },
  { cat: "clothes", pl: "nosić / zakładać", en: "to wear", ar: "يلبس", ph: "yelbes", ex: { ar: "بلبس جاكيت في الشتا.", ph: "balbes zhakeet fish-shita.", pl: "Noszę kurtkę zimą.", en: "I wear a jacket in winter." } },
];

// ---------- Dom i meble ----------
const HOME_FURNITURE_WORDS = [
  { cat: "home_furniture", pl: "dom", en: "house / home", ar: "بيت", ph: "beet" },
  { cat: "home_furniture", pl: "pokój", en: "room", ar: "أوضة", ph: "ooDa" },
  { cat: "home_furniture", pl: "kuchnia (pomieszczenie)", en: "kitchen", ar: "مطبخ", ph: "maTbakh" },
  { cat: "home_furniture", pl: "łazienka", en: "bathroom", ar: "حمام", ph: "Hammaam" },
  { cat: "home_furniture", pl: "salon", en: "living room", ar: "صالة", ph: "Saala" },
  { cat: "home_furniture", pl: "sypialnia", en: "bedroom", ar: "أوضة نوم", ph: "ooDet noom" },
  { cat: "home_furniture", pl: "stół", en: "table", ar: "ترابيزة", ph: "tarabeeza" },
  { cat: "home_furniture", pl: "krzesło", en: "chair", ar: "كرسي", ph: "korsi" },
  { cat: "home_furniture", pl: "łóżko", en: "bed", ar: "سرير", ph: "seriir" },
  { cat: "home_furniture", pl: "drzwi", en: "door", ar: "باب", ph: "baab" },
  { cat: "home_furniture", pl: "okno", en: "window", ar: "شباك", ph: "shebbaak" },
  { cat: "home_furniture", pl: "ściana", en: "wall", ar: "حيطة", ph: "HeeTa" },
  { cat: "home_furniture", pl: "podłoga", en: "floor", ar: "أرض", ph: "arD" },
  { cat: "home_furniture", pl: "lampa", en: "lamp", ar: "لمبة", ph: "lamba" },
  { cat: "home_furniture", pl: "szafa", en: "wardrobe", ar: "دولاب", ph: "dolaab" },
  { cat: "home_furniture", pl: "kanapa", en: "sofa", ar: "كنبة", ph: "kanaba" },
  { cat: "home_furniture", pl: "lodówka", en: "fridge", ar: "تلاجة", ph: "tallaaga" },
  { cat: "home_furniture", pl: "klucz", en: "key", ar: "مفتاح", ph: "moftaaH" },
  { cat: "home_furniture", pl: "winda", en: "elevator", ar: "أسانسير", ph: "asanseer" },
  { cat: "home_furniture", pl: "schody", en: "stairs", ar: "سلم", ph: "sellem" },
];

// ---------- Natura i miejsca ----------
const NATURE_WORDS = [
  { cat: "nature", pl: "morze", en: "sea", ar: "بحر", ph: "baHr" },
  { cat: "nature", pl: "góra", en: "mountain", ar: "جبل", ph: "gabal" },
  { cat: "nature", pl: "rzeka", en: "river", ar: "نهر", ph: "nahr" },
  { cat: "nature", pl: "Nil", en: "the Nile", ar: "النيل", ph: "in-niil" },
  { cat: "nature", pl: "plaża", en: "beach", ar: "شاطئ", ph: "shaaTe2" },
  { cat: "nature", pl: "pustynia", en: "desert", ar: "صحرا", ph: "SaHra" },
  { cat: "nature", pl: "niebo", en: "sky", ar: "سما", ph: "sama" },
  { cat: "nature", pl: "słońce", en: "sun", ar: "شمس", ph: "shams" },
  { cat: "nature", pl: "księżyc", en: "moon", ar: "قمر", ph: "2amar" },
  { cat: "nature", pl: "gwiazda", en: "star", ar: "نجمة", ph: "negma" },
  { cat: "nature", pl: "drzewo", en: "tree", ar: "شجرة", ph: "shagara" },
  { cat: "nature", pl: "kwiat", en: "flower", ar: "وردة", ph: "warda" },
  { cat: "nature", pl: "ogród / park", en: "garden / park", ar: "جنينة", ph: "geneena" },
  { cat: "nature", pl: "ulica", en: "street", ar: "شارع", ph: "shaare3" },
  { cat: "nature", pl: "wieś", en: "village", ar: "قرية", ph: "2arya" },
  { cat: "nature", pl: "kamień", en: "stone", ar: "حجر", ph: "Hagar" },
  { cat: "nature", pl: "piasek", en: "sand", ar: "رمل", ph: "raml" },
];

// ---------- Transport ----------
const TRANSPORT_WORDS = [
  { cat: "transport", pl: "samochód", en: "car", ar: "عربية", ph: "3arabeyya" },
  { cat: "transport", pl: "autobus", en: "bus", ar: "أتوبيس", ph: "otobiis" },
  { cat: "transport", pl: "pociąg", en: "train", ar: "قطر", ph: "2aTr" },
  { cat: "transport", pl: "samolot", en: "airplane", ar: "طيارة", ph: "Tayyaara" },
  { cat: "transport", pl: "taksówka", en: "taxi", ar: "تاكسي", ph: "taksi" },
  { cat: "transport", pl: "metro", en: "metro", ar: "مترو", ph: "metro" },
  { cat: "transport", pl: "rower", en: "bicycle", ar: "عجلة", ph: "3agala" },
  { cat: "transport", pl: "statek / łódź", en: "boat / ship", ar: "مركب", ph: "markeb" },
  { cat: "transport", pl: "lotnisko", en: "airport", ar: "مطار", ph: "maTaar" },
  { cat: "transport", pl: "stacja / przystanek", en: "station / stop", ar: "محطة", ph: "maHaTTa" },
  { cat: "transport", pl: "bilet", en: "ticket", ar: "تذكرة", ph: "tazkara" },
  { cat: "transport", pl: "droga", en: "road", ar: "طريق", ph: "Tarii2" },
  { cat: "transport", pl: "benzyna", en: "petrol / gas", ar: "بنزين", ph: "banziin" },
];

// ---------- Zawody ----------
const JOB_WORDS = [
  { cat: "jobs", pl: "nauczyciel", en: "teacher", ar: "مدرس", ph: "modarres" },
  { cat: "jobs", pl: "lekarz", en: "doctor", ar: "دكتور", ph: "doktoor" },
  { cat: "jobs", pl: "inżynier", en: "engineer", ar: "مهندس", ph: "mohandes" },
  { cat: "jobs", pl: "kierowca", en: "driver", ar: "سواق", ph: "sawwaa2" },
  { cat: "jobs", pl: "sprzedawca", en: "salesperson", ar: "بياع", ph: "bayyaa3" },
  { cat: "jobs", pl: "policjant", en: "police officer", ar: "ظابط", ph: "ZaabeT" },
  { cat: "jobs", pl: "kucharz", en: "cook", ar: "طباخ", ph: "Tabbaakh" },
  { cat: "jobs", pl: "prawnik", en: "lawyer", ar: "محامي", ph: "moHaami" },
  { cat: "jobs", pl: "student", en: "student", ar: "طالب", ph: "Taaleb" },
  { cat: "jobs", pl: "urzędnik / pracownik", en: "employee / clerk", ar: "موظف", ph: "mowaZZaf" },
  { cat: "jobs", pl: "rolnik", en: "farmer", ar: "فلاح", ph: "fallaaH" },
  { cat: "jobs", pl: "artysta", en: "artist", ar: "فنان", ph: "fannaan" },
];

// ---------- Emocje i stany ----------
const EMOTION_WORDS = [
  { cat: "emotions", pl: "szczęśliwy / zadowolony", en: "happy / pleased", ar: "مبسوط", ph: "mabsuuT", ex: { ar: "أنا مبسوط النهارده.", ph: "ana mabsuuT innaharda.", pl: "Jestem dziś szczęśliwy.", en: "I'm happy today." } },
  { cat: "emotions", pl: "smutny", en: "sad", ar: "زعلان", ph: "za3laan" },
  { cat: "emotions", pl: "zły / wkurzony", en: "angry / upset", ar: "متعصب", ph: "met3aSSeb" },
  { cat: "emotions", pl: "zmęczony", en: "tired", ar: "تعبان", ph: "ta3baan" },
  { cat: "emotions", pl: "zdenerwowany / zmartwiony", en: "worried / anxious", ar: "قلقان", ph: "2al2aan" },
  { cat: "emotions", pl: "spokojny", en: "calm", ar: "هادي", ph: "haadi" },
  { cat: "emotions", pl: "przestraszony", en: "scared", ar: "خايف", ph: "khaayef" },
  { cat: "emotions", pl: "znudzony", en: "bored", ar: "زهقان", ph: "zah2aan" },
  { cat: "emotions", pl: "głodny", en: "hungry", ar: "جعان", ph: "ga3aan" },
  { cat: "emotions", pl: "spragniony", en: "thirsty", ar: "عطشان", ph: "3aTshaan" },
  { cat: "emotions", pl: "dumny", en: "proud", ar: "فخور", ph: "fakhuur" },
  { cat: "emotions", pl: "zaskoczony", en: "surprised", ar: "متفاجئ", ph: "metfaage2" },
];

// ---------- Zwierzęta ----------
const ANIMAL_WORDS = [
  { cat: "animals", pl: "pies", en: "dog", ar: "كلب", ph: "kalb" },
  { cat: "animals", pl: "kot", en: "cat", ar: "قطة", ph: "2oTTa" },
  { cat: "animals", pl: "koń", en: "horse", ar: "حصان", ph: "HoSaan" },
  { cat: "animals", pl: "krowa", en: "cow", ar: "بقرة", ph: "ba2ara" },
  { cat: "animals", pl: "ptak", en: "bird", ar: "عصفور", ph: "3aSfuur" },
  { cat: "animals", pl: "ryba", en: "fish", ar: "سمكة", ph: "samaka" },
  { cat: "animals", pl: "osioł", en: "donkey", ar: "حمار", ph: "Homaar" },
  { cat: "animals", pl: "wielbłąd", en: "camel", ar: "جمل", ph: "gamal" },
  { cat: "animals", pl: "owca", en: "sheep", ar: "خروف", ph: "kharuuf" },
  { cat: "animals", pl: "mysz", en: "mouse", ar: "فار", ph: "faar" },
  { cat: "animals", pl: "lew", en: "lion", ar: "أسد", ph: "asad" },
];

// ---------- Liczby porządkowe ----------
const ORDINAL_WORDS = [
  { cat: "ordinals", pl: "pierwszy", en: "first", ar: "أول", ph: "awwel", ex: { ar: "ده أول يوم.", ph: "da awwel yoom.", pl: "To pierwszy dzień.", en: "It's the first day." } },
  { cat: "ordinals", pl: "drugi", en: "second", ar: "تاني", ph: "taani" },
  { cat: "ordinals", pl: "trzeci", en: "third", ar: "تالت", ph: "taalet" },
  { cat: "ordinals", pl: "czwarty", en: "fourth", ar: "رابع", ph: "raabe3" },
  { cat: "ordinals", pl: "piąty", en: "fifth", ar: "خامس", ph: "khaames" },
  { cat: "ordinals", pl: "szósty", en: "sixth", ar: "سادس", ph: "saades" },
  { cat: "ordinals", pl: "siódmy", en: "seventh", ar: "سابع", ph: "saabe3" },
  { cat: "ordinals", pl: "ósmy", en: "eighth", ar: "تامن", ph: "taamen" },
  { cat: "ordinals", pl: "dziewiąty", en: "ninth", ar: "تاسع", ph: "taase3" },
  { cat: "ordinals", pl: "dziesiąty", en: "tenth", ar: "عاشر", ph: "3aasher" },
  { cat: "ordinals", pl: "ostatni", en: "last", ar: "آخر", ph: "aakher" },
];

// ---------- Kierunki i położenie (przyimki miejsca) ----------
const DIRECTION_WORDS = [
  // kierunki
  { cat: "directions", pl: "w prawo / prawa", en: "right", ar: "يمين", ph: "yemiin", ex: { ar: "لف يمين بعد الإشارة.", ph: "leff yemiin ba3d il-eshaara.", pl: "Skręć w prawo za światłami.", en: "Turn right after the lights." } },
  { cat: "directions", pl: "w lewo / lewa", en: "left", ar: "شمال", ph: "shemaal", ex: { ar: "البيت على الشمال.", ph: "il-beet 3ala ish-shemaal.", pl: "Dom jest po lewej.", en: "The house is on the left." } },
  { cat: "directions", pl: "prosto", en: "straight ahead", ar: "على طول", ph: "3ala Tuul", ex: { ar: "امشي على طول.", ph: "emshi 3ala Tuul.", pl: "Idź prosto.", en: "Go straight." } },
  { cat: "directions", pl: "do góry / w górę", en: "up / upstairs", ar: "فوق", ph: "foo2", ex: { ar: "الأوضة فوق.", ph: "il-ooDa foo2.", pl: "Pokój jest na górze.", en: "The room is upstairs." } },
  { cat: "directions", pl: "do dołu / w dół", en: "down / downstairs", ar: "تحت", ph: "taHt", ex: { ar: "المطبخ تحت.", ph: "il-maTbakh taHt.", pl: "Kuchnia jest na dole.", en: "The kitchen is downstairs." } },
  { cat: "directions", pl: "z przodu / na przedzie", en: "in front", ar: "قدام", ph: "2oddaam", ex: { ar: "العربية قدام البيت.", ph: "il-3arabeyya 2oddaam il-beet.", pl: "Samochód jest przed domem.", en: "The car is in front of the house." } },
  { cat: "directions", pl: "z tyłu / za", en: "behind", ar: "ورا", ph: "wara", ex: { ar: "الجنينة ورا البيت.", ph: "ig-geneena wara il-beet.", pl: "Ogród jest za domem.", en: "The garden is behind the house." } },
  // przyimki miejsca
  { cat: "directions", pl: "na (czymś)", en: "on (top of)", ar: "على", ph: "3ala", ex: { ar: "الكتاب على الترابيزة.", ph: "il-ketaab 3ala it-tarabeeza.", pl: "Książka jest na stole.", en: "The book is on the table." } },
  { cat: "directions", pl: "w / wewnątrz", en: "in / inside", ar: "في", ph: "fi", ex: { ar: "المفتاح في الشنطة.", ph: "il-moftaaH fish-shanTa.", pl: "Klucz jest w torbie.", en: "The key is in the bag." } },
  { cat: "directions", pl: "pod", en: "under", ar: "تحت", ph: "taHt", ex: { ar: "القطة تحت الكرسي.", ph: "il-2oTTa taHt il-korsi.", pl: "Kot jest pod krzesłem.", en: "The cat is under the chair." } },
  { cat: "directions", pl: "nad / powyżej", en: "above", ar: "فوق", ph: "foo2", ex: { ar: "اللمبة فوق الترابيزة.", ph: "il-lamba foo2 it-tarabeeza.", pl: "Lampa jest nad stołem.", en: "The lamp is above the table." } },
  { cat: "directions", pl: "obok / przy", en: "next to", ar: "جنب", ph: "ganb", ex: { ar: "اقعد جنبي.", ph: "o23od ganbi.", pl: "Usiądź obok mnie.", en: "Sit next to me." } },
  { cat: "directions", pl: "między", en: "between", ar: "بين", ph: "been", ex: { ar: "المحل بين البنك والصيدلية.", ph: "il-maHall been il-bank wiS-Saydaleyya.", pl: "Sklep jest między bankiem a apteką.", en: "The shop is between the bank and the pharmacy." } },
  { cat: "directions", pl: "koło / w pobliżu", en: "near", ar: "جنب", ph: "ganb", ex: { ar: "أنا جنب المحطة.", ph: "ana ganb il-maHaTTa.", pl: "Jestem koło stacji.", en: "I'm near the station." } },
  { cat: "directions", pl: "naprzeciwko", en: "across from", ar: "قصاد", ph: "2oSaad", ex: { ar: "المدرسة قصاد البيت.", ph: "il-madrasa 2oSaad il-beet.", pl: "Szkoła jest naprzeciwko domu.", en: "The school is across from the house." } },
  { cat: "directions", pl: "w środku / wewnątrz", en: "inside", ar: "جوه", ph: "gowwa", ex: { ar: "استنى جوه.", ph: "estanna gowwa.", pl: "Poczekaj w środku.", en: "Wait inside." } },
  { cat: "directions", pl: "na zewnątrz", en: "outside", ar: "برة", ph: "barra", ex: { ar: "العربية برة.", ph: "il-3arabeyya barra.", pl: "Samochód jest na zewnątrz.", en: "The car is outside." } },
  // przydatne odniesienia
  { cat: "directions", pl: "tutaj", en: "here", ar: "هنا", ph: "hena", ex: { ar: "تعالى هنا.", ph: "ta3aala hena.", pl: "Chodź tutaj.", en: "Come here." } },
  { cat: "directions", pl: "tam", en: "there", ar: "هناك", ph: "henaak", ex: { ar: "المحطة هناك.", ph: "il-maHaTTa henaak.", pl: "Stacja jest tam.", en: "The station is there." } },
  { cat: "directions", pl: "blisko", en: "close", ar: "قريب", ph: "2orayyeb", ex: { ar: "البيت قريب.", ph: "il-beet 2orayyeb.", pl: "Dom jest blisko.", en: "The house is close." } },
  { cat: "directions", pl: "daleko", en: "far", ar: "بعيد", ph: "be3iid", ex: { ar: "المطار بعيد.", ph: "il-maTaar be3iid.", pl: "Lotnisko jest daleko.", en: "The airport is far." } },
];

// ---------- Konstrukcje zdaniowe (mowa złożona) ----------
// Gotowe „ramki" do wyrażania niepewności, opinii, zamiaru, nadziei. To one
// pozwalają budować złożone myśli: „nie wiem, czy…", „myślę, że…".
const CONSTRUCTION_WORDS = [
  { cat: "constructions", pl: "nie wiem (m.)", en: "I don't know (m.)", ar: "مش عارف", ph: "mish 3aaref", ex: { ar: "مش عارف هروح ولا لأ.", ph: "mish 3aaref haruuH walla la2.", pl: "Nie wiem, czy pójdę, czy nie.", en: "I don't know whether I'll go or not." } },
  { cat: "constructions", pl: "nie wiem (ż.)", en: "I don't know (f.)", ar: "مش عارفة", ph: "mish 3arfa", ex: { ar: "مش عارفة أعمل إيه.", ph: "mish 3arfa a3mel eeh.", pl: "Nie wiem, co robić.", en: "I don't know what to do." } },
  { cat: "constructions", pl: "…czy… (w mowie zależnej)", en: "…whether/if… (indirect)", ar: "لو", ph: "law", ex: { ar: "مش عارف لو هييجي.", ph: "mish 3aaref law hayiigi.", pl: "Nie wiem, czy przyjdzie.", en: "I don't know if he'll come." } },
  { cat: "constructions", pl: "…czy nie", en: "…or not", ar: "ولا لأ", ph: "walla la2", ex: { ar: "هتيجي ولا لأ؟", ph: "hatiigi walla la2?", pl: "Przyjdziesz czy nie?", en: "Are you coming or not?" } },
  { cat: "constructions", pl: "myślę, że… (m.)", en: "I think that… (m.)", ar: "أنا فاكر إن", ph: "ana faaker enn", ex: { ar: "أنا فاكر إن ده صح.", ph: "ana faaker enn da SaHH.", pl: "Myślę, że to prawda.", en: "I think it's true." } },
  { cat: "constructions", pl: "wydaje mi się, że…", en: "it seems to me that…", ar: "أظن إن", ph: "aZonn enn", ex: { ar: "أظن إنه مشغول.", ph: "aZonn ennoh mashghuul.", pl: "Wydaje mi się, że jest zajęty.", en: "It seems to me he's busy." } },
  { cat: "constructions", pl: "mam nadzieję, że…", en: "I hope that…", ar: "أتمنى إن", ph: "atmanna enn", ex: { ar: "أتمنى إنك تيجي.", ph: "atmanna ennak tiigi.", pl: "Mam nadzieję, że przyjdziesz.", en: "I hope you'll come." } },
  { cat: "constructions", pl: "boję się, że…", en: "I'm afraid that…", ar: "خايف إن", ph: "khaayef enn", ex: { ar: "خايف إن الوقت يخلص.", ph: "khaayef enn il-wa2t yekhlaS.", pl: "Boję się, że skończy się czas.", en: "I'm afraid time will run out." } },
  { cat: "constructions", pl: "cieszę się, że…", en: "I'm glad that…", ar: "مبسوط إن", ph: "mabsuuT enn", ex: { ar: "مبسوط إنك هنا.", ph: "mabsuuT ennak hena.", pl: "Cieszę się, że tu jesteś.", en: "I'm glad you're here." } },
  { cat: "constructions", pl: "jestem pewien, że… (m.)", en: "I'm sure that… (m.)", ar: "متأكد إن", ph: "met2akked enn", ex: { ar: "متأكد إن ده صح.", ph: "met2akked enn da SaHH.", pl: "Jestem pewien, że to prawda.", en: "I'm sure it's true." } },
  { cat: "constructions", pl: "może / możliwe, że…", en: "maybe / it's possible that…", ar: "يمكن", ph: "yemken", ex: { ar: "يمكن أروح بكرة.", ph: "yemken aruuH bukra.", pl: "Może pójdę jutro.", en: "Maybe I'll go tomorrow." } },
  { cat: "constructions", pl: "musisz / trzeba (żeby)", en: "must / have to", ar: "لازم", ph: "laazem", ex: { ar: "لازم نروح دلوقتي.", ph: "laazem neruuH delwa2ti.", pl: "Musimy iść teraz.", en: "We have to go now." } },
  { cat: "constructions", pl: "chcę, żeby…", en: "I want to…", ar: "عايز", ph: "3aayez", ex: { ar: "عايز أقولك حاجة.", ph: "3aayez a2ollak Haaga.", pl: "Chcę ci coś powiedzieć.", en: "I want to tell you something." } },
  { cat: "constructions", pl: "wolałbym / wolę", en: "I'd prefer / I prefer", ar: "أفضّل", ph: "afaDDal", ex: { ar: "أفضّل أقعد في البيت.", ph: "afaDDal a23od fil-beet.", pl: "Wolę zostać w domu.", en: "I'd rather stay home." } },
  { cat: "constructions", pl: "zależy (od tego)", en: "it depends", ar: "على حسب", ph: "3ala Hasab", ex: { ar: "على حسب الجو.", ph: "3ala Hasab il-gaww.", pl: "Zależy od pogody.", en: "It depends on the weather." } },
  { cat: "constructions", pl: "dlatego / z tego powodu (że)", en: "that's why", ar: "عشان كده", ph: "3ashaan keda", ex: { ar: "تعبان، عشان كده مش هخرج.", ph: "ta3baan, 3ashaan keda mish hakhrog.", pl: "Jestem zmęczony, dlatego nie wyjdę.", en: "I'm tired, that's why I won't go out." } },
];

// ---------- Kultura i życie codzienne w Egipcie ----------
// Słownictwo osadzone w realiach egipskich (wiedza ogólna o kulturze).
const CULTURE_WORDS = [
  { cat: "culture", pl: "dozorca / portier (bawwāb)", en: "doorman (bawwāb)", ar: "بواب", ph: "bawwaab", ex: { ar: "البواب بيفتح الباب.", ph: "il-bawwaab biyeftaH il-baab.", pl: "Dozorca otwiera drzwi.", en: "The doorman opens the door." } },
  { cat: "culture", pl: "hagga (zwrot do starszej kobiety)", en: "hagga (respectful, to an older woman)", ar: "حاجة", ph: "Hagga", ex: { ar: "الحاجة أم أحمد ساكنة تحت.", ph: "il-Hagga omm aHmad sakna taHt.", pl: "Hagga Umm Ahmed mieszka na dole.", en: "Hagga Umm Ahmed lives downstairs." } },
  { cat: "culture", pl: "hagg (zwrot do starszego mężczyzny)", en: "hagg (respectful, to an older man)", ar: "حاج", ph: "Hagg" },
  { cat: "culture", pl: "wujek/starszy (3amm, z szacunkiem)", en: "3amm (respectful, to an older man)", ar: "عم", ph: "3amm", ex: { ar: "عم مصطفى بياع الفاكهة.", ph: "3amm muSTafa bayyaa3 il-faakha.", pl: "Amm Mustafa sprzedaje owoce.", en: "Amm Mustafa sells fruit." } },
  { cat: "culture", pl: "gołąb", en: "pigeon", ar: "حمامة", ph: "Hamaama" },
  { cat: "culture", pl: "gołębie (zbiorowo)", en: "pigeons (collective)", ar: "حمام", ph: "Hamaam", ex: { ar: "بيربّي حمام فوق السطح.", ph: "biyrabbi Hamaam foo2 is-saTH.", pl: "Hoduje gołębie na dachu.", en: "He keeps pigeons on the roof." } },
  { cat: "culture", pl: "dach (taras na dachu)", en: "roof / rooftop", ar: "سطح", ph: "saTH" },
  { cat: "culture", pl: "henna", en: "henna", ar: "حنة", ph: "Henna", ex: { ar: "ليلة الحنة قبل الفرح.", ph: "lelet il-Henna 2abl il-faraH.", pl: "Wieczór henny przed weselem.", en: "The henna night before the wedding." } },
  { cat: "culture", pl: "wesele", en: "wedding", ar: "فرح", ph: "faraH" },
  { cat: "culture", pl: "panna młoda", en: "bride", ar: "عروسة", ph: "3aruusa" },
  { cat: "culture", pl: "pan młody", en: "groom", ar: "عريس", ph: "3ariis" },
  { cat: "culture", pl: "oaza", en: "oasis", ar: "واحة", ph: "waaHa", ex: { ar: "واحة سيوة في الصحرا.", ph: "waaHet siiwa fiS-SaHra.", pl: "Oaza Siwa na pustyni.", en: "The Siwa oasis in the desert." } },
  { cat: "culture", pl: "koszari (danie)", en: "koshari (dish)", ar: "كشري", ph: "koshari", ex: { ar: "الكشري أكلة مصرية شعبية.", ph: "il-koshari akla maSreyya sha3beyya.", pl: "Koszari to popularne egipskie danie.", en: "Koshari is a popular Egyptian dish." } },
  { cat: "culture", pl: "ludowy / uliczny (sha3bi)", en: "popular / working-class (sha3bi)", ar: "شعبي", ph: "sha3bi" },
  { cat: "culture", pl: "tradycje", en: "traditions", ar: "تقاليد", ph: "ta2aliid" },
  { cat: "culture", pl: "pokolenie", en: "generation", ar: "جيل", ph: "giil" },
  { cat: "culture", pl: "przodkowie / dziadowie", en: "ancestors", ar: "أجداد", ph: "agdaad" },
  { cat: "culture", pl: "dzielnica / okolica", en: "the neighborhood", ar: "الحتة", ph: "il-Hetta" },
  { cat: "culture", pl: "centrum miasta (wist il-balad)", en: "downtown (wist il-balad)", ar: "وسط البلد", ph: "wisT il-balad" },
  { cat: "culture", pl: "kawiarnia (tradycyjna, ahwa)", en: "traditional coffeehouse (ahwa)", ar: "قهوة", ph: "2ahwa", ex: { ar: "الرجالة قاعدين في القهوة.", ph: "ir-reggaala 2a3diin fil-2ahwa.", pl: "Mężczyźni siedzą w kawiarni.", en: "The men are sitting in the coffeehouse." } },
  { cat: "culture", pl: "sziszа / fajka wodna", en: "shisha / hookah", ar: "شيشة", ph: "shiisha" },
  { cat: "culture", pl: "meczet", en: "mosque", ar: "جامع", ph: "gaame3" },
  { cat: "culture", pl: "wezwanie na modlitwę (azan)", en: "call to prayer (azan)", ar: "أذان", ph: "azaan" },
];

// ---------- Praktyczne: podróże, formalności, umawianie się ----------
const PRACTICAL_WORDS = [
  // dokumenty i podróż
  { cat: "practical", pl: "paszport", en: "passport", ar: "باسبور", ph: "basbuur", ex: { ar: "الباسبور معايا.", ph: "il-basbuur ma3aaya.", pl: "Mam paszport przy sobie.", en: "I have my passport with me." } },
  { cat: "practical", pl: "wiza", en: "visa", ar: "فيزا", ph: "viiza" },
  { cat: "practical", pl: "rezerwacja", en: "reservation", ar: "حجز", ph: "Hagz", ex: { ar: "عندي حجز باسمي.", ph: "3andi Hagz be-esmi.", pl: "Mam rezerwację na moje nazwisko.", en: "I have a reservation under my name." } },
  { cat: "practical", pl: "hotel", en: "hotel", ar: "فندق", ph: "fondo2" },
  { cat: "practical", pl: "walizka", en: "suitcase", ar: "شنطة سفر", ph: "shanTet safar" },
  { cat: "practical", pl: "portfel", en: "wallet", ar: "محفظة", ph: "maHfaZa" },
  { cat: "practical", pl: "kieszeń", en: "pocket", ar: "جيب", ph: "geeb", ex: { ar: "المفتاح في جيبي.", ph: "il-moftaaH fi geebi.", pl: "Klucz jest w mojej kieszeni.", en: "The key is in my pocket." } },
  // pieniądze
  { cat: "practical", pl: "rachunek", en: "bill", ar: "حساب", ph: "Hisaab" },
  { cat: "practical", pl: "napiwek", en: "tip", ar: "بقشيش", ph: "ba2shiish", ex: { ar: "سيبله بقشيش.", ph: "sebbo ba2shiish.", pl: "Zostaw mu napiwek.", en: "Leave him a tip." } },
  { cat: "practical", pl: "czynsz", en: "rent", ar: "إيجار", ph: "igaar" },
  { cat: "practical", pl: "rozmiar", en: "size", ar: "مقاس", ph: "ma2aas", ex: { ar: "مقاسك كام؟", ph: "ma2aasak kaam?", pl: "Jaki masz rozmiar?", en: "What's your size?" } },
  { cat: "practical", pl: "przymierzyć", en: "to try on", ar: "يقيس", ph: "ye2iis" },
  // czas i umawianie się
  { cat: "practical", pl: "spotkanie / umówiony termin", en: "appointment", ar: "معاد", ph: "me3aad", ex: { ar: "عندي معاد الساعة تلاتة.", ph: "3andi me3aad is-saa3a talaata.", pl: "Mam spotkanie o trzeciej.", en: "I have an appointment at three." } },
  { cat: "practical", pl: "umówić się", en: "to arrange / agree", ar: "يتفق", ph: "yettefe2" },
  { cat: "practical", pl: "spóźnić się", en: "to be late", ar: "يتأخر", ph: "yet2akhkhar", ex: { ar: "أسف، اتأخرت.", ph: "aasef, et2akhkhart.", pl: "Przepraszam, spóźniłem się.", en: "Sorry, I'm late." } },
  { cat: "practical", pl: "zdążyć", en: "to make it in time", ar: "يلحق", ph: "yelHa2" },
  { cat: "practical", pl: "wolny czas", en: "free time", ar: "وقت فاضي", ph: "wa2t faaDi" },
  { cat: "practical", pl: "odpoczywać", en: "to rest", ar: "يرتاح", ph: "yertaaH" },
  { cat: "practical", pl: "zajęty", en: "busy", ar: "مشغول", ph: "mashghuul", ex: { ar: "أنا مشغول دلوقتي.", ph: "ana mashghuul delwa2ti.", pl: "Jestem teraz zajęty.", en: "I'm busy right now." } },
  // problemy
  { cat: "practical", pl: "pomyłka / błąd", en: "mistake", ar: "غلط", ph: "8alaT", ex: { ar: "ده غلط، آسف.", ph: "da 8alaT, aasef.", pl: "To pomyłka, przepraszam.", en: "It's a mistake, sorry." } },
  { cat: "practical", pl: "zepsuty", en: "broken", ar: "بايظ", ph: "baayeZ", ex: { ar: "الأسانسير بايظ.", ph: "il-asanseer baayeZ.", pl: "Winda jest zepsuta.", en: "The elevator is broken." } },
  { cat: "practical", pl: "naprawić", en: "to fix", ar: "يصلح", ph: "yeSallaH" },
  { cat: "practical", pl: "zgubić", en: "to lose", ar: "يضيع", ph: "yeDayya3" },
  { cat: "practical", pl: "znaleźć", en: "to find", ar: "يلاقي", ph: "yelaa2i" },
];

// Przykłady dla słów, które nie mają własnego pola ex i nie występują w dialogach.
// Klucz = wordId (cat|pl|ar). Doklejane w loadWords, nie zmieniają definicji słowa
// (więc wordId się nie zmienia i postęp jest zachowany).
const EXAMPLES_EXTRA = {
  // --- jedzenie i zakupy ---
  "food_shopping|owoce|فاكهة": { ar: "بحب الفاكهة الطازة.", ph: "baHebb il-faakha iT-Taaza.", pl: "Lubię świeże owoce.", en: "I like fresh fruit." },
  "food_shopping|jabłko|تفاحة": { ar: "كلت تفاحة الصبح.", ph: "kalt toffaaHa iS-SobH.", pl: "Zjadłem jabłko rano.", en: "I ate an apple this morning." },
  "food_shopping|banan|موزة": { ar: "الموزة دي مستوية.", ph: "il-mooza di mestewya.", pl: "Ten banan jest dojrzały.", en: "This banana is ripe." },
  "food_shopping|pomarańcza|برتقانة": { ar: "عصير البرتقان لذيذ.", ph: "3aSiir il-borto2aan laziiz.", pl: "Sok pomarańczowy jest pyszny.", en: "Orange juice is delicious." },
  "food_shopping|winogrona|عنب": { ar: "العنب حلو أوي.", ph: "il-3enab Helw awi.", pl: "Winogrona są bardzo słodkie.", en: "The grapes are very sweet." },
  "food_shopping|arbuz|بطيخ": { ar: "البطيخ حلو في الصيف.", ph: "il-baTTiikh Helw fiS-Seef.", pl: "Arbuz jest dobry latem.", en: "Watermelon is good in summer." },
  "food_shopping|mango|مانجة": { ar: "المانجة فاكهة مصرية.", ph: "il-manga faakha maSreyya.", pl: "Mango to egipski owoc.", en: "Mango is an Egyptian fruit." },
  "food_shopping|cytryna|لمونة": { ar: "عايز لمونة على السلطة.", ph: "3aayez lamuuna 3ala is-salaTa.", pl: "Chcę cytrynę do sałatki.", en: "I want a lemon for the salad." },
  "food_shopping|daktyle|بلح": { ar: "البلح حلو ومفيد.", ph: "il-balaH Helw we mefiid.", pl: "Daktyle są słodkie i zdrowe.", en: "Dates are sweet and healthy." },
  "food_shopping|warzywa|خضار": { ar: "بشتري الخضار من السوق.", ph: "bashteri il-khoDaar min is-suu2.", pl: "Kupuję warzywa na targu.", en: "I buy vegetables at the market." },
  "food_shopping|pomidor|طماطم": { ar: "كيلو طماطم لو سمحت.", ph: "kiilo TamaaTem law samaHt.", pl: "Kilo pomidorów poproszę.", en: "A kilo of tomatoes, please." },
  "food_shopping|ziemniak|بطاطس": { ar: "بحب البطاطس المقلية.", ph: "baHebb il-baTaaTes il-ma2leyya.", pl: "Lubię smażone ziemniaki.", en: "I like fried potatoes." },
  "food_shopping|cebula|بصل": { ar: "من غير بصل من فضلك.", ph: "min 8eer baSal min faDlak.", pl: "Bez cebuli proszę.", en: "No onions, please." },
  "food_shopping|czosnek|توم": { ar: "التوم بيدي طعم حلو.", ph: "it-toom biyeddi Ta3m Helw.", pl: "Czosnek nadaje dobry smak.", en: "Garlic gives a good flavor." },
  "food_shopping|ogórek|خيار": { ar: "الخيار في السلطة.", ph: "il-khiyaar fis-salaTa.", pl: "Ogórek jest w sałatce.", en: "The cucumber is in the salad." },
  "food_shopping|marchew|جزر": { ar: "الجزر لونه برتقاني.", ph: "il-gazar loono borto2aani.", pl: "Marchew jest pomarańczowa.", en: "The carrot is orange." },
  "food_shopping|bakłażan|بتنجان": { ar: "بحب البتنجان المطبوخ.", ph: "baHebb il-betengaan il-maTbuukh.", pl: "Lubię duszony bakłażan.", en: "I like stewed eggplant." },
  "food_shopping|papryka|فلفل": { ar: "الفلفل ده حار.", ph: "il-felfel da Haar.", pl: "Ta papryka jest ostra.", en: "This pepper is spicy." },
  "food_shopping|mięso|لحمة": { ar: "اللحمة غالية النهارده.", ph: "il-laHma 8alya innaharda.", pl: "Mięso jest dziś drogie.", en: "Meat is expensive today." },
  "food_shopping|kurczak|فراخ": { ar: "بنطبخ فراخ يوم الجمعة.", ph: "beniTbokh feraakh yoom ig-gom3a.", pl: "Gotujemy kurczaka w piątek.", en: "We cook chicken on Friday." },
  "food_shopping|jajko|بيضة": { ar: "بفطر بيضة كل يوم.", ph: "bafTar beeDa koll yoom.", pl: "Jem jajko na śniadanie codziennie.", en: "I eat an egg for breakfast every day." },
  "food_shopping|fasola bób (ful)|فول": { ar: "الفول أكلة مصرية شعبية.", ph: "il-fuul akla maSreyya sha3beyya.", pl: "Ful to popularna egipska potrawa.", en: "Ful is a popular Egyptian dish." },
  "food_shopping|sól|ملح": { ar: "الأكل عايز شوية ملح.", ph: "il-akl 3aayez shwayyet malH.", pl: "Jedzenie potrzebuje trochę soli.", en: "The food needs a little salt." },
  "food_shopping|olej|زيت": { ar: "بستعمل زيت الزيتون.", ph: "basta3mel zeet iz-zatuun.", pl: "Używam oliwy z oliwek.", en: "I use olive oil." },
  "food_shopping|masło|زبدة": { ar: "بحط زبدة على العيش.", ph: "baHoTT zebda 3ala il-3eesh.", pl: "Kładę masło na chleb.", en: "I put butter on the bread." },
  "food_shopping|miód|عسل": { ar: "العسل أحلى من السكر.", ph: "il-3asal aHla min is-sokkar.", pl: "Miód jest słodszy niż cukier.", en: "Honey is sweeter than sugar." },
  "food_shopping|sok|عصير": { ar: "عايز عصير مانجة.", ph: "3aayez 3aSiir manga.", pl: "Chcę sok z mango.", en: "I want mango juice." },
  "food_shopping|sklep|محل": { ar: "المحل ده قريب من البيت.", ph: "il-maHall da 2orayyeb min il-beet.", pl: "Ten sklep jest blisko domu.", en: "This shop is near the house." },
  "food_shopping|targ / bazar|سوق": { ar: "السوق زحمة يوم الجمعة.", ph: "is-suu2 zaHma yoom ig-gom3a.", pl: "Targ jest zatłoczony w piątek.", en: "The market is crowded on Friday." },
  "food_shopping|piekarnia|مخبز": { ar: "العيش سخن من المخبز.", ph: "il-3eesh sokhn min il-makhbaz.", pl: "Chleb jest ciepły z piekarni.", en: "The bread is warm from the bakery." },
  "food_shopping|rzeźnik|جزار": { ar: "بشتري اللحمة من الجزار.", ph: "bashteri il-laHma min il-gazzaar.", pl: "Kupuję mięso u rzeźnika.", en: "I buy meat at the butcher's." },
  "food_shopping|reszta (pieniądze)|الباقي": { ar: "خد الباقي من فضلك.", ph: "khod il-baa2i min faDlak.", pl: "Weź resztę proszę.", en: "Take the change, please." },
  "food_shopping|świeży|طازة": { ar: "العيش ده طازة.", ph: "il-3eesh da Taaza.", pl: "Ten chleb jest świeży.", en: "This bread is fresh." },
  "food_shopping|dojrzały|مستوي": { ar: "المانجة مستوية وحلوة.", ph: "il-manga mestewya we Helwa.", pl: "Mango jest dojrzałe i słodkie.", en: "The mango is ripe and sweet." },
  "food_shopping|Gotówką|كاش": { ar: "هدفع كاش.", ph: "hadfa3 kaash.", pl: "Zapłacę gotówką.", en: "I'll pay in cash." },
  "food_shopping|Wezmę to|هاخده": { ar: "تمام، هاخده.", ph: "tamaam, haakhdo.", pl: "Dobrze, wezmę to.", en: "Alright, I'll take it." },
  "food_shopping|Torba / reklamówka|كيس": { ar: "ممكن كيس من فضلك؟", ph: "momken kiis min faDlak?", pl: "Można torbę proszę?", en: "Can I have a bag, please?" },
  // --- kuchnia ---
  "kitchen|duszony / w sosie|مطبوخ": { ar: "الأكل ده مطبوخ كويس.", ph: "il-akl da maTbuukh kwayyes.", pl: "To jedzenie jest dobrze ugotowane.", en: "This food is well cooked." },
  "kitchen|ostry / pikantny|حار": { ar: "الأكل ده حار أوي.", ph: "il-akl da Haar awi.", pl: "To jedzenie jest bardzo ostre.", en: "This food is very spicy." },
  "kitchen|słony|مالح": { ar: "الشوربة مالحة شوية.", ph: "ish-shorba maalHa shwayya.", pl: "Zupa jest trochę słona.", en: "The soup is a bit salty." },
  "kitchen|kwaśny|حامض": { ar: "اللمون حامض.", ph: "il-lamuun HaameD.", pl: "Cytryna jest kwaśna.", en: "The lemon is sour." },
  "kitchen|pyszny|لذيذ": { ar: "الأكل لذيذ جداً!", ph: "il-akl laziiz gedan!", pl: "Jedzenie jest bardzo pyszne!", en: "The food is very delicious!" },
  "kitchen|zimny|بارد": { ar: "المية باردة.", ph: "il-mayya baarda.", pl: "Woda jest zimna.", en: "The water is cold." },
  "kitchen|gorący / ciepły|سخن": { ar: "الشاي سخن.", ph: "ish-shaay sokhn.", pl: "Herbata jest gorąca.", en: "The tea is hot." },
  "kitchen|falafel (ta3meya)|طعمية": { ar: "الطعمية أكلة الفطار.", ph: "iT-Ta3meyya aklet il-faTaar.", pl: "Falafel to danie śniadaniowe.", en: "Falafel is a breakfast dish." },
  "kitchen|shawarma|شاورما": { ar: "عايز ساندويتش شاورما.", ph: "3aayez sandawitsh shawerma.", pl: "Chcę kanapkę z shawarmą.", en: "I want a shawarma sandwich." },
  "kitchen|kofta (mielone na grillu)|كفتة": { ar: "الكفتة مشوية على الفحم.", ph: "il-kofta mashweyya 3ala il-faHm.", pl: "Kofta jest grillowana na węglu.", en: "Kofta is grilled over charcoal." },
  "kitchen|sałatka|سلطة": { ar: "السلطة فيها خضار كتير.", ph: "is-salaTa fiiha khoDaar ketiir.", pl: "W sałatce jest dużo warzyw.", en: "There are lots of vegetables in the salad." },
  "kitchen|zupa|شوربة": { ar: "الشوربة سخنة وحلوة.", ph: "ish-shorba sokhna we Helwa.", pl: "Zupa jest ciepła i dobra.", en: "The soup is warm and good." },
  "kitchen|makaron|مكرونة": { ar: "بحب المكرونة بالصلصة.", ph: "baHebb il-makaroona biS-SalSa.", pl: "Lubię makaron z sosem.", en: "I like pasta with sauce." },
  "kitchen|talerz|طبق": { ar: "حط الأكل في الطبق.", ph: "HoTT il-akl fiT-Taba2.", pl: "Połóż jedzenie na talerzu.", en: "Put the food on the plate." },
  "kitchen|szklanka|كباية": { ar: "عايز كباية مية.", ph: "3aayez kobaayet mayya.", pl: "Chcę szklankę wody.", en: "I want a glass of water." },
  "kitchen|widelec|شوكة": { ar: "الشوكة على الطبق.", ph: "ish-shooka 3ala iT-Taba2.", pl: "Widelec jest na talerzu.", en: "The fork is on the plate." },
  "kitchen|łyżka|معلقة": { ar: "معلقة سكر في الشاي.", ph: "ma3la2et sokkar fish-shaay.", pl: "Łyżka cukru do herbaty.", en: "A spoon of sugar for the tea." },
  "kitchen|nóż|سكينة": { ar: "السكينة قاطعة.", ph: "is-sekkiina 2aT3a.", pl: "Nóż jest ostry.", en: "The knife is sharp." },
  "kitchen|gotować|يطبخ": { ar: "مراتي بتطبخ كويس.", ph: "meraati betoTbokh kwayyes.", pl: "Moja żona dobrze gotuje.", en: "My wife cooks well." },
  "kitchen|jeść|ياكل": { ar: "بياكل كتير.", ph: "biyaakol ketiir.", pl: "Dużo je.", en: "He eats a lot." },
  "kitchen|pić|يشرب": { ar: "بيشرب قهوة كل يوم.", ph: "biyeshrab 2ahwa koll yoom.", pl: "Pije kawę codziennie.", en: "He drinks coffee every day." },
  // --- rodzina ---
  "family|dzieci|عيال": { ar: "عندي عيال كتير.", ph: "3andi 3eyaal ketiir.", pl: "Mam dużo dzieci.", en: "I have many children." },
  "family|dziecko / chłopiec|ولد": { ar: "الولد ده شاطر.", ph: "il-walad da shaaTer.", pl: "Ten chłopiec jest zdolny.", en: "This boy is clever." },
  "family|rodzice|الوالدين": { ar: "بحب والديّ أوي.", ph: "baHebb waldeyya awi.", pl: "Bardzo kocham rodziców.", en: "I love my parents very much." },
  "family|dziadek|جد": { ar: "جدي عنده تمانين سنة.", ph: "geddi 3ando tamaniin sana.", pl: "Mój dziadek ma osiemdziesiąt lat.", en: "My grandfather is eighty years old." },
  "family|babcia|جدة": { ar: "جدتي بتطبخ حلو.", ph: "geddeti betoTbokh Helw.", pl: "Moja babcia dobrze gotuje.", en: "My grandmother cooks well." },
  "family|ciotka (siostra ojca)|عمة": { ar: "عمتي أخت أبويا.", ph: "3ammeti okht abuuya.", pl: "Ciotka to siostra mojego ojca.", en: "The aunt is my father's sister." },
  "family|ciotka (siostra matki)|خالة": { ar: "خالتي ساكنة في طنطا.", ph: "khalti sakna fi TanTa.", pl: "Ciotka mieszka w Tancie.", en: "My aunt lives in Tanta." },
  "family|zaręczony (m.)|مخطوب": { ar: "أخويا مخطوب.", ph: "akhuuya makhTuub.", pl: "Mój brat jest zaręczony.", en: "My brother is engaged." },
  "family|rozwiedziony (m.)|مطلق": { ar: "هو مطلق من سنة.", ph: "howwa meTalla2 min sana.", pl: "Jest rozwiedziony od roku.", en: "He's been divorced for a year." },
  "family|sąsiad|جار": { ar: "جاري راجل كويس.", ph: "gaari raagel kwayyes.", pl: "Mój sąsiad to dobry człowiek.", en: "My neighbor is a good man." },
  // --- zdrowie ---
  "health|lekarz|دكتور": { ar: "لازم أروح للدكتور.", ph: "laazem aruuH lid-doktoor.", pl: "Muszę iść do lekarza.", en: "I have to go to the doctor." },
  "health|szpital|مستشفى": { ar: "المستشفى قريبة من هنا.", ph: "il-mustashfa 2orayyiba min hena.", pl: "Szpital jest blisko stąd.", en: "The hospital is near here." },
  "health|chory (m.)|عيان": { ar: "أنا عيان النهارده.", ph: "ana 3ayyaan innaharda.", pl: "Jestem dziś chory.", en: "I'm sick today." },
  "health|chora (ż.)|عيانة": { ar: "هي عيانة وتعبانة.", ph: "heyya 3ayyaana we ta3baana.", pl: "Ona jest chora i zmęczona.", en: "She's sick and tired." },
  "health|boli mnie|بيوجعني": { ar: "ضهري بيوجعني.", ph: "Dahri biyewga3ni.", pl: "Boli mnie plecy.", en: "My back hurts." },
  "health|brzuch|بطن": { ar: "بطني بتوجعني.", ph: "baTni betewga3ni.", pl: "Boli mnie brzuch.", en: "My stomach hurts." },
  "health|kaszel|كحة": { ar: "عندي كحة من إمبارح.", ph: "3andi koHHa min embaareH.", pl: "Mam kaszel od wczoraj.", en: "I've had a cough since yesterday." },
  // --- pogoda ---
  "weather|słońce|شمس": { ar: "الشمس قوية النهارده.", ph: "ish-shams 2aweyya innaharda.", pl: "Słońce jest dziś mocne.", en: "The sun is strong today." },
  "weather|deszcz|مطر": { ar: "المطر بينزل في الشتا.", ph: "il-maTar biyinzel fish-shita.", pl: "Deszcz pada zimą.", en: "It rains in winter." },
  "weather|upał|حرارة": { ar: "الحرارة عالية في الصيف.", ph: "il-Haraara 3alya fiS-Seef.", pl: "Temperatura jest wysoka latem.", en: "The temperature is high in summer." },
  "weather|pada deszcz|بتمطر": { ar: "الدنيا بتمطر بره.", ph: "id-donya betemTar barra.", pl: "Na dworze pada deszcz.", en: "It's raining outside." },
  "weather|zima|شتا": { ar: "الشتا في مصر مش برد أوي.", ph: "ish-shita fi maSr mish bard awi.", pl: "Zima w Egipcie nie jest bardzo zimna.", en: "Winter in Egypt isn't very cold." },
  // --- pozostałe ---
  "life|Polska|بولندا": { ar: "أنا من بولندا.", ph: "ana min bolanda.", pl: "Jestem z Polski.", en: "I'm from Poland." },
  "life|Egipt|مصر": { ar: "مصر بلد جميل.", ph: "maSr balad gamiil.", pl: "Egipt to piękny kraj.", en: "Egypt is a beautiful country." },
  "life|za granicą|برة": { ar: "مراتي بتشتغل مع شركة برة.", ph: "meraati betishtaghal ma3 sherka barra.", pl: "Moja żona pracuje z firmą za granicą.", en: "My wife works with a company abroad." },
  "life|kot|قطة": { ar: "عندي قطة في البيت.", ph: "3andi 2oTTa fil-beet.", pl: "Mam kota w domu.", en: "I have a cat at home." },
  "life|rok|سنة": { ar: "بقالي سنة في كراكوف.", ph: "ba2aali sana fi Krakow.", pl: "Jestem rok w Krakowie.", en: "I've been in Krakow for a year." },
  "life|hobby|هواية": { ar: "العربي هوايتي.", ph: "il-3arabi hewayti.", pl: "Arabski to moje hobby.", en: "Arabic is my hobby." },
  // --- pozostałe pojedyncze słowa ---
  "kitchen|surowy|ني": { ar: "الأكل ده لسه ني.", ph: "il-akl da lessa nayy.", pl: "To jedzenie jest jeszcze surowe.", en: "This food is still raw." },
  "kitchen|gorzki|مر": { ar: "القهوة مرة من غير سكر.", ph: "il-2ahwa morra min 8eer sokkar.", pl: "Kawa jest gorzka bez cukru.", en: "Coffee is bitter without sugar." },
  "family|syn|ابن": { ar: "ابني في المدرسة.", ph: "ebni fil-madrasa.", pl: "Mój syn jest w szkole.", en: "My son is at school." },
  "family|ojciec|أب": { ar: "أبويا راجل طيب.", ph: "abuuya raagel Tayyeb.", pl: "Mój ojciec to dobry człowiek.", en: "My father is a good man." },
  "family|matka|أم": { ar: "أمي بتحبني أوي.", ph: "ommi betHebbni awi.", pl: "Moja matka bardzo mnie kocha.", en: "My mother loves me very much." },
  "family|siostra|أخت": { ar: "أختي أصغر مني.", ph: "okhti aS8ar menni.", pl: "Moja siostra jest młodsza ode mnie.", en: "My sister is younger than me." },
  "family|wujek (brat ojca)|عم": { ar: "عمي أخو أبويا.", ph: "3ammi akhu abuuya.", pl: "Mój wujek to brat ojca.", en: "My uncle is my father's brother." },
  "family|wujek (brat matki)|خال": { ar: "خالي ساكن في إسكندرية.", ph: "khaali saaken fi eskendereyya.", pl: "Mój wujek mieszka w Aleksandrii.", en: "My uncle lives in Alexandria." },
  "family|przyjaciel / kolega|صاحب": { ar: "صاحبي من زمان.", ph: "SaaHbi min zamaan.", pl: "To mój stary przyjaciel.", en: "This is my old friend." },
  "health|apteka|صيدلية": { ar: "الصيدلية فين؟", ph: "iS-Saydaleyya feen?", pl: "Gdzie jest apteka?", en: "Where's the pharmacy?" },
  "health|gardło|زور": { ar: "زوري بيوجعني.", ph: "zoori biyewga3ni.", pl: "Boli mnie gardło.", en: "My throat hurts." },
  "health|ząb|سنة": { ar: "سنتي بتوجعني.", ph: "senneti betewga3ni.", pl: "Boli mnie ząb.", en: "My tooth hurts." },
  "weather|lato|صيف": { ar: "الصيف حر في مصر.", ph: "iS-Seef Harr fi maSr.", pl: "Lato w Egipcie jest upalne.", en: "Summer in Egypt is scorching." },
  "fillers|naprawdę? (zdziwienie)|بجد؟": { ar: "بجد؟ مش مصدق!", ph: "begad? mish meSadda2!", pl: "Naprawdę? Nie wierzę!", en: "Really? I don't believe it!" },
  "fillers|rozumiem / jasne (potakiwanie)|فاهم": { ar: "أيوا، أنا فاهم.", ph: "aywa, ana faahem.", pl: "Tak, rozumiem.", en: "Yes, I understand." },
  "fillers|krótko mówiąc|المهم": { ar: "المهم، خلصنا الشغل.", ph: "il-mohemm, khallaSna ish-shughl.", pl: "Krótko mówiąc, skończyliśmy pracę.", en: "In short, we finished the work." },
  "slang|wyluzuj / odpuść|فكّك": { ar: "فكّك من الموضوع ده.", ph: "fokkak min il-mawDuu3 da.", pl: "Odpuść sobie ten temat.", en: "Let this topic go." },
  "slang|genialne / miód (dosł. miód)|عسل": { ar: "الفكرة دي عسل!", ph: "il-fekra di 3asal!", pl: "Ten pomysł jest genialny!", en: "This idea is brilliant!" },
  "life|biuro|مكتب": { ar: "مكتبي في وسط البلد.", ph: "maktabi fi wist il-balad.", pl: "Moje biuro jest w centrum.", en: "My office is downtown." },
  "life|właściciel|صاحب": { ar: "أنا صاحب الشركة.", ph: "ana SaaHeb ish-sherka.", pl: "Jestem właścicielem firmy.", en: "I'm the owner of the company." },
  "life|klient|عميل": { ar: "العميل مبسوط من الخدمة.", ph: "il-3amiil mabsuuT min il-khedma.", pl: "Klient jest zadowolony z usługi.", en: "The client is satisfied with the service." },
  "life|język|لغة": { ar: "العربي لغة صعبة شوية.", ph: "il-3arabi lo8a Sa3ba shwayya.", pl: "Arabski to trochę trudny język.", en: "Arabic is a somewhat difficult language." },
  "life|polski (język)|بولندي": { ar: "أنا بتكلم بولندي.", ph: "ana batkallem bolandi.", pl: "Mówię po polsku.", en: "I speak Polish." },
  "life|łatwy|سهل": { ar: "الدرس ده سهل.", ph: "id-dars da sahl.", pl: "Ta lekcja jest łatwa.", en: "This lesson is easy." },
  "life|miasto|مدينة": { ar: "كراكوف مدينة جميلة.", ph: "Krakow mediina gamiila.", pl: "Kraków to piękne miasto.", en: "Krakow is a beautiful city." },
  "life|kraj|بلد": { ar: "مصر بلد كبير.", ph: "maSr balad kebiir.", pl: "Egipt to duży kraj.", en: "Egypt is a big country." },
  "travel|Taksówka|تاكسي": { ar: "هركب تاكسي للمطار.", ph: "harkab taksi lil-maTaar.", pl: "Wezmę taksówkę na lotnisko.", en: "I'll take a taxi to the airport." },
  "travel|Lotnisko|المطار": { ar: "المطار بعيد عن هنا.", ph: "il-maTaar be3iid 3an hena.", pl: "Lotnisko jest daleko stąd.", en: "The airport is far from here." },
  "travel|W prawo|يمين": { ar: "لف يمين بعد الإشارة.", ph: "leff yemiin ba3d il-eshaara.", pl: "Skręć w prawo za światłami.", en: "Turn right after the lights." },
};

// ---------- Generator zdań ze słów z bazy ----------
// Zamiast sztywnych zdań: szablony z „gniazdami”. Każde gniazdo ma pulę słów,
// które GRAMATYCZNIE tam pasują. Rodzaj i forma są respektowane, więc każda
// wygenerowana kombinacja jest poprawna. To daje setki wariantów z tego, co jest.

// Rzeczowniki: mianownik (nom) do „gdzie jest…/ten…", biernik (acc) do „chcę…/mam…".
const GEN_NOUNS = [
  { nom: "książka", acc: "książkę", def: { ar: "الكتاب", ph: "il-ketaab" }, gen: "m" },
  { nom: "dom", acc: "dom", def: { ar: "البيت", ph: "il-beet" }, gen: "m" },
  { nom: "samochód", acc: "samochód", def: { ar: "العربية", ph: "il-3arabeyya" }, gen: "f" },
  { nom: "pokój", acc: "pokój", def: { ar: "الأوضة", ph: "il-2uDa" }, gen: "f" },
  { nom: "klucz", acc: "klucz", def: { ar: "المفتاح", ph: "il-muftaaH" }, gen: "m" },
  { nom: "telefon", acc: "telefon", def: { ar: "الموبايل", ph: "il-mobaayel" }, gen: "m" },
  { nom: "stół", acc: "stół", def: { ar: "الترابيزة", ph: "it-tarabeeza" }, gen: "f" },
];

// Czasowniki w formie subjunctive dla 1. os. (po modalnym) + tłumaczenie.
const GEN_VERBS = [
  { pl: "zobaczyć", sub: { ar: "أشوف", ph: "ashuuf" } },
  { pl: "wziąć", sub: { ar: "آخد", ph: "aakhod" } },
  { pl: "kupić", sub: { ar: "أشتري", ph: "ashteri" } },
  { pl: "znaleźć", sub: { ar: "ألاقي", ph: "alaa2i" } },
];

// Modalne z odmianą dla „ja” (zgodność rodzaju obsłużona wariantem).
const GEN_MODALS = [
  { pl: "chcę", ar: "عايز", ph: "3aayez", note: "3aayez (m.) / 3ayza (f.) — imiesłów, zgadza się rodzajem.", noteEn: "3aayez (m.) / 3ayza (f.) — a participle, agrees in gender." },
  { pl: "muszę", ar: "لازم", ph: "laazem", note: "لازم nieodmienne + czasownik w subjunctive.", noteEn: "لازم invariable + a verb in the subjunctive." },
  { pl: "mogę", ar: "ممكن", ph: "mumken", note: "ممكن (możliwość/pozwolenie) + subjunctive.", noteEn: "ممكن (possibility/permission) + subjunctive." },
];

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// Szablony: każdy zwraca { pl, tiles, note } — tiles w kolejności czytania.
const GEN_TEMPLATES = [
  // 1) [modalny] + [czasownik] + [rzeczownik z rodzajnikiem] → biernik
  () => {
    const mod = pick(GEN_MODALS);
    const v = pick(GEN_VERBS);
    const n = pick(GEN_NOUNS);
    return {
      pl: `${mod.pl} ${v.pl} ${n.acc}.`,
      tiles: [
        { ar: mod.ar, ph: mod.ph },
        { ar: v.sub.ar, ph: v.sub.ph },
        { ar: n.def.ar, ph: n.def.ph },
      ],
      note: mod.note,
    };
  },
  // 2) [rzeczownik] + [wskazujący zgodny z rodzajem] → mianownik
  () => {
    const n = pick(GEN_NOUNS);
    const dem = n.gen === "f" ? { ar: "دي", ph: "di" } : { ar: "ده", ph: "da" };
    return {
      pl: `ten/ta ${n.nom} (właśnie ten)`,
      tiles: [
        { ar: n.def.ar, ph: n.def.ph },
        { ar: dem.ar, ph: dem.ph },
      ],
      note: `Wskazujący zgadza się rodzajem: ${n.gen === "f" ? "di (żeński)" : "da (męski)"}.`,
    };
  },
  // 3) „mam [rzeczownik]” → biernik
  () => {
    const n = pick(GEN_NOUNS);
    return {
      pl: `mam ${n.acc}.`,
      tiles: [
        { ar: "عندي", ph: "3andi" },
        { ar: n.def.ar, ph: n.def.ph },
      ],
      note: "„3andi” (u-mnie) wyraża posiadanie — egipski nie ma osobnego „mieć”.", noteEn: "\"3andi\" (at me) expresses possession — Egyptian has no separate \"to have\".",
    };
  },
  // 4) „gdzie jest [rzeczownik]?” → mianownik
  () => {
    const n = pick(GEN_NOUNS);
    return {
      pl: `gdzie jest ${n.nom}?`,
      tiles: [
        { ar: n.def.ar, ph: n.def.ph },
        { ar: "فين", ph: "feen" },
      ],
      note: "Zaimek pytający „feen” stoi PO rzeczowniku.", noteEn: "The question word \"feen\" comes AFTER the noun.",
    };
  },
];

function generateSentence() {
  return pick(GEN_TEMPLATES)();
}

function generateSentences(count) {
  const out = [];
  const seen = new Set();
  let guard = 0;
  while (out.length < count && guard < count * 12) {
    guard++;
    const s = generateSentence();
    const key = s.tiles.map((t) => t.ph).join("|");
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(s);
  }
  return out;
}

const SENTENCE_DRILLS = [
  {
    pl: "Chcę napić się kawy.",
    en: "I want to drink coffee.",
    tiles: [
      { ar: "أنا", ph: "ana" },
      { ar: "عايز", ph: "3aayez" },
      { ar: "أشرب", ph: "ashrab" },
      { ar: "قهوة", ph: "ahwa" },
    ],
    note: "Modalny (3aayez) + czasownik w subjunctive (ashrab, bez بـ).", noteEn: "Modal (3aayez) + a verb in the subjunctive (ashrab, without بـ).",
  },
  {
    pl: "Muszę teraz iść.",
    en: "I have to go now.",
    tiles: [
      { ar: "لازم", ph: "laazem" },
      { ar: "أروح", ph: "aruuH" },
      { ar: "دلوقتي", ph: "dilwa2ti" },
    ],
    note: "لازم jest nieodmienne i stoi przed czasownikiem.", noteEn: "لازم is invariable and comes before the verb.",
  },
  {
    pl: "Gdzie jest łazienka, przepraszam?",
    en: "Where's the bathroom, please?",
    tiles: [
      { ar: "الحمام", ph: "il-Hammaam" },
      { ar: "فين", ph: "feen" },
      { ar: "لو سمحت", ph: "law samaHt" },
    ],
    note: "Zaimek pytający (feen) stoi PO rzeczowniku, nie na początku.", noteEn: "The question word (feen) comes AFTER the noun, not at the start.",
  },
  {
    pl: "Mam trzy dni wolnego.",
    en: "I have three days off.",
    tiles: [
      { ar: "عندي", ph: "3andi" },
      { ar: "تلات", ph: "talat" },
      { ar: "تيام", ph: "tiyyaam" },
      { ar: "أجازة", ph: "agaaza" },
    ],
    note: "3–10 + liczba mnoga; ayyaam po liczebniku dostaje t- (tiyyaam).", noteEn: "3–10 + plural; ayyaam after a numeral takes t- (tiyyaam).",
  },
  {
    pl: "Czyje to jest?",
    en: "Whose is this?",
    tiles: [
      { ar: "ده", ph: "da" },
      { ar: "بتاع", ph: "bitaa3" },
      { ar: "مين", ph: "meen" },
    ],
  },
  {
    pl: "Ta książka jest na stole.",
    en: "This book is on the table.",
    tiles: [
      { ar: "الكتاب", ph: "il-ketaab" },
      { ar: "ده", ph: "da" },
      { ar: "على", ph: "3ala" },
      { ar: "الترابيزة", ph: "it-tarabeeza" },
    ],
    note: "Wskazujący (da) stoi PO rzeczowniku z rodzajnikiem.", noteEn: "The demonstrative (da) comes AFTER the definite noun.",
  },
  {
    pl: "Czy mogę zobaczyć menu?",
    en: "Can I see the menu?",
    tiles: [
      { ar: "ممكن", ph: "mumken" },
      { ar: "أشوف", ph: "ashuuf" },
      { ar: "المنيو", ph: "il-menyu" },
    ],
  },
  {
    pl: "Ona chciała iść.",
    en: "She wanted to go.",
    tiles: [
      { ar: "هي", ph: "heyya" },
      { ar: "كانت", ph: "kaanet" },
      { ar: "عايزة", ph: "3ayza" },
      { ar: "تروح", ph: "tiruuH" },
    ],
    note: "Przeszłość modalnego: kaanet + 3ayza (zgodność rodzaju) + subjunctive.", noteEn: "Past of the modal: kaanet + 3ayza (gender agreement) + subjunctive.",
  },
  {
    pl: "Kiedy przyjdziesz? (do mężczyzny)",
    en: "When are you coming? (to m.)",
    tiles: [
      { ar: "انت", ph: "enta" },
      { ar: "هتيجي", ph: "hatiigi" },
      { ar: "إمتى", ph: "emta" },
    ],
    note: "emta na końcu zdania.", noteEn: "emta at the end of the sentence.",
  },
  {
    pl: "Mój dom jest blisko stąd.",
    en: "My house is near here.",
    tiles: [
      { ar: "بيتي", ph: "beeti" },
      { ar: "قريب", ph: "2urayyib" },
      { ar: "من هنا", ph: "min hena" },
    ],
  },
  {
    pl: "Musimy iść do domu.",
    en: "We have to go home.",
    tiles: [
      { ar: "لازم", ph: "laazem" },
      { ar: "نروح", ph: "niruuH" },
      { ar: "البيت", ph: "il-beet" },
    ],
  },
  {
    pl: "Po ile jest ten kilogram?",
    en: "How much is a kilo?",
    tiles: [
      { ar: "بكام", ph: "bikaam" },
      { ar: "الكيلو", ph: "il-kiilo" },
      { ar: "ده", ph: "da" },
    ],
  },
  {
    pl: "Mam przy sobie nowy telefon.",
    en: "I have a new phone with me.",
    tiles: [
      { ar: "معايا", ph: "ma3aaya" },
      { ar: "موبايل", ph: "mobaayel" },
      { ar: "جديد", ph: "gediid" },
    ],
    note: "Przymiotnik stoi PO rzeczowniku (mobaayel gediid).", noteEn: "The adjective comes AFTER the noun (mobaayel gediid).",
  },
  {
    pl: "Ten samochód należy do mojego przyjaciela.",
    en: "This car belongs to my friend.",
    tiles: [
      { ar: "العربية", ph: "il-3arabeyya" },
      { ar: "دي", ph: "di" },
      { ar: "بتاعة", ph: "bitaa3et" },
      { ar: "صاحبي", ph: "SaHbi" },
    ],
    note: "3arabeyya jest żeńska → di oraz bitaa3et (nie da/bitaa3).", noteEn: "3arabeyya is feminine → di and bitaa3et (not da/bitaa3).",
  },
  {
    pl: "Jestem z Polski.",
    en: "I'm from Poland.",
    tiles: [
      { ar: "أنا", ph: "ana" },
      { ar: "من", ph: "min" },
      { ar: "بولاندا", ph: "bolanda" },
    ],
    note: "Prosty schemat: ana min + miejsce (z dialogu z obcokrajowcem).", noteEn: "A simple pattern: ana min + place (from a dialogue with a foreigner).",
  },
  {
    pl: "Mieszkam w Maadi.",
    en: "I live in Maadi.",
    tiles: [
      { ar: "أنا", ph: "ana" },
      { ar: "ساكن", ph: "saaken" },
      { ar: "في", ph: "fi" },
      { ar: "المعادي", ph: "il-ma3aadi" },
    ],
    note: "saaken (mieszkający) to imiesłów; „fi + miejsce” = „w”.", noteEn: "saaken (living) is a participle; \"fi + place\" = \"in\".",
  },
  {
    pl: "Mówisz po angielsku?",
    en: "Do you speak English?",
    tiles: [
      { ar: "إنت", ph: "enta" },
      { ar: "بتتكلم", ph: "betetkallem" },
      { ar: "انجليزي", ph: "engliizi" },
    ],
    note: "Czas teraźniejszy z przedrostkiem بـ (betetkallem = mówisz/mawiasz).", noteEn: "Present with the بـ prefix (betetkallem = you speak).",
  },
  {
    pl: "Gdzie jest winda?",
    en: "Where's the elevator?",
    tiles: [
      { ar: "فين", ph: "feen" },
      { ar: "الأصانصير", ph: "il-2aSanSeer" },
    ],
    note: "Tu „feen” stoi PRZED rzeczownikiem — oba szyki (feen na początku i na końcu) są używane.", noteEn: "Here \"feen\" comes BEFORE the noun — both orders (feen at the start and the end) are used.",
  },
  {
    pl: "Chcę dużą butelkę.",
    en: "I want a big bottle.",
    tiles: [
      { ar: "عايز", ph: "3aayez" },
      { ar: "القزازة", ph: "il-2ezaaza" },
      { ar: "الكبيرة", ph: "il-kebiira" },
    ],
    note: "Przymiotnik (kebiira) stoi PO rzeczowniku i zgadza się rodzajem (2ezaaza żeńska → kebiira).", noteEn: "The adjective (kebiira) comes AFTER the noun and agrees in gender (2ezaaza feminine → kebiira).",
  },
  {
    pl: "Znasz kawiarnię blisko stąd?",
    en: "Do you know a café near here?",
    tiles: [
      { ar: "عارف", ph: "3aaref" },
      { ar: "قهوة", ph: "2ahwa" },
      { ar: "قريبة", ph: "2urayyiba" },
      { ar: "من هنا", ph: "min hena" },
    ],
    note: "3aaref (wiedzący/znający) — imiesłów; przymiotnik 2urayyiba po rzeczowniku.", noteEn: "3aaref (knowing) — a participle; the adjective 2urayyiba after the noun.",
  },
  {
    pl: "Wszystko w porządku, dziękuję.",
    en: "Everything's fine, thanks.",
    tiles: [
      { ar: "مفيش", ph: "mafiish" },
      { ar: "مشكلة", ph: "moshkila" },
      { ar: "شكراً", ph: "shukran" },
    ],
    note: "mafiish (nie ma) → mafiish moshkila = „nie ma problemu”.", noteEn: "mafiish (there isn't) → mafiish moshkila = \"no problem\".",
  },
  {
    pl: "Nie wiem, czy przyjdzie.",
    en: "I don't know if he'll come.",
    tiles: [
      { ar: "مش", ph: "mish" },
      { ar: "عارف", ph: "3aaref" },
      { ar: "لو", ph: "law" },
      { ar: "هييجي", ph: "hayiigi" },
    ],
    note: "„Czy” w mowie zależnej = law. Przyszły: ha- + czasownik (hayiigi).", noteEn: "\"whether\" in indirect speech = law. Future: ha- + verb (hayiigi).",
  },
  {
    pl: "Książka jest na stole.",
    en: "The book is on the table.",
    tiles: [
      { ar: "الكتاب", ph: "il-ketaab" },
      { ar: "على", ph: "3ala" },
      { ar: "الترابيزة", ph: "it-tarabeeza" },
    ],
    note: "Zdanie bez czasownika „być” — typowe dla arabskiego w czasie teraźniejszym.", noteEn: "A sentence without the verb \"to be\" — typical of Arabic in the present.",
  },
  {
    pl: "Skręć w prawo za światłami.",
    en: "Turn right after the lights.",
    tiles: [
      { ar: "لف", ph: "leff" },
      { ar: "يمين", ph: "yemiin" },
      { ar: "بعد", ph: "ba3d" },
      { ar: "الإشارة", ph: "il-eshaara" },
    ],
    note: "Tryb rozkazujący (leff) + kierunek. Przydatne w taksówce.", noteEn: "Imperative (leff) + direction. Handy in a taxi.",
  },
  {
    pl: "Myślę, że to dobry pomysł.",
    en: "I think it's a good idea.",
    tiles: [
      { ar: "أنا", ph: "ana" },
      { ar: "فاكر", ph: "faaker" },
      { ar: "إن", ph: "enn" },
      { ar: "دي", ph: "di" },
      { ar: "فكرة", ph: "fekra" },
      { ar: "حلوة", ph: "Helwa" },
    ],
    note: "Konstrukcja opinii: faaker enn (myślę, że). Przymiotnik zgadza się rodzajem (fekra Helwa — ż.).", noteEn: "Opinion construction: faaker enn (I think that). The adjective agrees in gender (fekra Helwa — feminine).",
  },
  {
    pl: "Mój brat jest starszy ode mnie.",
    en: "My brother is older than me.",
    tiles: [
      { ar: "أخويا", ph: "akhuuya" },
      { ar: "أكبر", ph: "akbar" },
      { ar: "مني", ph: "menni" },
    ],
    note: "Stopień wyższy: akbar (większy/starszy) + min (od) + sufiks (menni = ode mnie).", noteEn: "Comparative: akbar (bigger/older) + min (than) + suffix (menni = than me).",
  },
  {
    pl: "Możesz mi pomóc?",
    en: "Can you help me?",
    tiles: [
      { ar: "ممكن", ph: "momken" },
      { ar: "تساعدني", ph: "tesa3edni" },
    ],
    note: "momken + czasownik = grzeczna prośba. Sufiks -ni = mnie.", noteEn: "momken + verb = a polite request. The suffix -ni = me.",
  },
  {
    pl: "Kupuję warzywa na targu.",
    en: "I buy vegetables at the market.",
    tiles: [
      { ar: "بشتري", ph: "bashteri" },
      { ar: "خضار", ph: "khoDaar" },
      { ar: "من", ph: "min" },
      { ar: "السوق", ph: "is-suu2" },
    ],
    note: "Czas teraźniejszy z prefiksem بـ (bashteri = kupuję, zwyczajowo).", noteEn: "Present with the بـ prefix (bashteri = I buy, habitually).",
  },
  {
    pl: "Wczoraj poszedłem do lekarza.",
    en: "Yesterday I went to the doctor.",
    tiles: [
      { ar: "إمبارح", ph: "embaareH" },
      { ar: "رحت", ph: "roHt" },
      { ar: "للدكتور", ph: "lid-doktoor" },
    ],
    note: "Czas przeszły (roHt = poszedłem). Przyimek li- + rodzajnik → lid-.", noteEn: "Past (roHt = I went). The preposition li- + article → lid-.",
  },
  {
    pl: "Kot jest pod krzesłem.",
    en: "The cat is under the chair.",
    tiles: [
      { ar: "القطة", ph: "il-2oTTa" },
      { ar: "تحت", ph: "taHt" },
      { ar: "الكرسي", ph: "il-korsi" },
    ],
    note: "Przyimek miejsca taHt (pod). Uwaga: taHt znaczy też „na dole”.", noteEn: "The locative preposition taHt (under). Note: taHt also means \"downstairs\".",
  },
  {
    pl: "Poczekaj chwilę, proszę.",
    en: "Wait a moment, please.",
    tiles: [
      { ar: "استنى", ph: "estanna" },
      { ar: "شوية", ph: "shwayya" },
      { ar: "لو سمحت", ph: "law samaHt" },
    ],
    note: "Rozkaźnik (estanna) + shwayya (trochę) + grzeczne law samaHt.", noteEn: "Imperative (estanna) + shwayya (a little) + polite law samaHt.",
  },
  {
    pl: "Mam nadzieję, że pogoda będzie ładna.",
    en: "I hope the weather will be nice.",
    tiles: [
      { ar: "أتمنى", ph: "atmanna" },
      { ar: "إن", ph: "enn" },
      { ar: "الجو", ph: "il-gaww" },
      { ar: "يبقى", ph: "yeb2a" },
      { ar: "حلو", ph: "Helw" },
    ],
    note: "atmanna enn (mam nadzieję, że) + subjunctive (yeb2a — bez بـ).", noteEn: "atmanna enn (I hope that) + subjunctive (yeb2a — without بـ).",
  },
];

// ---------- Egipski a MSA (fuS7a) ----------
// Porównanie dialektu egipskiego z arabskim literackim (Modern Standard Arabic).
// Trzy grupy: identyczne / to samo słowo, inna wymowa / zupełnie inne słowo.
// Reguły wymowy potwierdzone: ج j→g, ق q→hamza(2), ث th→t, ذ dh→d/z.
// ---------- MSA: rdzenie i rodziny słów (جذور) ----------
// Fundament arabskiego: z jednego rdzenia trójspółgłoskowego wyrastają słowa
// według wzorów (أوزان). Pokazujemy rodzinę słów + most do egipskiego.
// Pola równoległe (msa/eg/wazn/note) — nie wchodzą do wordId, więc bezpieczne.
// ---------- Lekcje MSA od podstaw — Moduł 1: fonetyka i pismo ----------
// Krótka teoria (prosto + technicznie) + przykłady MSA vs egipski.
// Cel: czytanie MSA. Każda lekcja buduje na tym, co znasz z egipskiego.
// ---------- Pełny alfabet arabski: 28 liter, 4 formy pozycyjne ----------
// iso=izolowana, ini=początkowa, med=środkowa, fin=końcowa.
// nonConnect: litery niełączące się z następną (ا د ذ ر ز و).
const ARABIC_ALPHABET = [
  { name: "alif", iso: "ا", ini: "ا", med: "ـا", fin: "ـا", sound: { pl: "ā / nośnik", en: "ā / carrier" }, ex: { iso: { w: "دار", ph: "daar", pl: "dom, siedziba", en: "home" }, ini: { w: "أَسَد", ph: "asad", pl: "lew", en: "lion" }, med: { w: "بَاب", ph: "baab", pl: "drzwi", en: "door" }, fin: { w: "سَمَا", ph: "samaa", pl: "niebo", en: "sky" } }, nonConnect: true },
  { name: "bā'", iso: "ب", ini: "بـ", med: "ـبـ", fin: "ـب", sound: { pl: "b", en: "b" }, ex: { iso: { w: "بابْ", ph: "baab", pl: "drzwi", en: "door" }, ini: { w: "بَيْت", ph: "bayt", pl: "dom", en: "house" }, med: { w: "كَبير", ph: "kabiir", pl: "duży", en: "big" }, fin: { w: "قَلْب", ph: "qalb", pl: "serce", en: "heart" } }, },
  { name: "tā'", iso: "ت", ini: "تـ", med: "ـتـ", fin: "ـت", sound: { pl: "t", en: "t" }, ex: { iso: { w: "مَوْت", ph: "mawt", pl: "śmierć", en: "death" }, ini: { w: "تِين", ph: "tiin", pl: "figa", en: "fig" }, med: { w: "كِتاب", ph: "kitaab", pl: "książka", en: "book" }, fin: { w: "بَيْت", ph: "bayt", pl: "dom", en: "house" } }, },
  { name: "thā'", iso: "ث", ini: "ثـ", med: "ـثـ", fin: "ـث", sound: { pl: "th (jak „think”)", en: "th (as in 'think')" }, ex: { iso: { w: "أَثاث", ph: "athaath", pl: "meble", en: "furniture" }, ini: { w: "ثَلْج", ph: "thalj", pl: "śnieg", en: "snow" }, med: { w: "مِثْل", ph: "mithl", pl: "jak, podobny", en: "like" }, fin: { w: "ثُلُث", ph: "thuluth", pl: "jedna trzecia", en: "a third" } }, },
  { name: "jīm", iso: "ج", ini: "جـ", med: "ـجـ", fin: "ـج", sound: { pl: "j (eg. g)", en: "j (Egy. g)" }, ex: { iso: { w: "بُرْج", ph: "burj", pl: "wieża", en: "tower" }, ini: { w: "جَمَل", ph: "jamal", pl: "wielbłąd", en: "camel" }, med: { w: "رَجُل", ph: "rajul", pl: "mężczyzna", en: "man" }, fin: { w: "ثَلْج", ph: "thalj", pl: "śnieg", en: "snow" } }, },
  { name: "ḥā'", iso: "ح", ini: "حـ", med: "ـحـ", fin: "ـح", sound: { pl: "H (gardłowe)", en: "H (throaty)" }, ex: { iso: { w: "صَباح", ph: "Sabaah", pl: "poranek", en: "morning" }, ini: { w: "حُبّ", ph: "Hubb", pl: "miłość", en: "love" }, med: { w: "بَحْر", ph: "baHr", pl: "morze", en: "sea" }, fin: { w: "مِلْح", ph: "milH", pl: "sól", en: "salt" } }, },
  { name: "khā'", iso: "خ", ini: "خـ", med: "ـخـ", fin: "ـخ", sound: { pl: "kh (jak „ch”)", en: "kh (like 'loch')" }, ex: { iso: { w: "صَرْخ", ph: "Sarkh", pl: "krzyk", en: "scream" }, ini: { w: "خُبْز", ph: "khubz", pl: "chleb", en: "bread" }, med: { w: "نَخْل", ph: "nakhl", pl: "palmy", en: "palm trees" }, fin: { w: "طَبْخ", ph: "Tabkh", pl: "gotowanie", en: "cooking" } }, },
  { name: "dāl", iso: "د", ini: "د", med: "ـد", fin: "ـد", sound: { pl: "d", en: "d" }, ex: { iso: { w: "وَرْد", ph: "ward", pl: "róże", en: "roses" }, ini: { w: "دَار", ph: "daar", pl: "dom, siedziba", en: "home" }, med: { w: "مَدْرَسة", ph: "madrasa", pl: "szkoła", en: "school" }, fin: { w: "وَلَد", ph: "walad", pl: "chłopiec", en: "boy" } }, nonConnect: true },
  { name: "dhāl", iso: "ذ", ini: "ذ", med: "ـذ", fin: "ـذ", sound: { pl: "dh (jak „this”)", en: "dh (as in 'this')" }, ex: { iso: { w: "رَذاذ", ph: "radhaadh", pl: "mżawka", en: "drizzle" }, ini: { w: "ذَهَب", ph: "dhahab", pl: "złoto", en: "gold" }, med: { w: "لَذيذ", ph: "ladhiidh", pl: "pyszny", en: "delicious" }, fin: { w: "نَبيذ", ph: "nabiidh", pl: "wino", en: "wine" } }, nonConnect: true },
  { name: "rā'", iso: "ر", ini: "ر", med: "ـر", fin: "ـر", sound: { pl: "r", en: "r" }, ex: { iso: { w: "زَأْر", ph: "za'r", pl: "ryk", en: "roar" }, ini: { w: "رَأْس", ph: "ra's", pl: "głowa", en: "head" }, med: { w: "مَريض", ph: "mariiD", pl: "chory", en: "sick" }, fin: { w: "قَمَر", ph: "qamar", pl: "księżyc", en: "moon" } }, nonConnect: true },
  { name: "zāy", iso: "ز", ini: "ز", med: "ـز", fin: "ـز", sound: { pl: "z", en: "z" }, ex: { iso: { w: "أَرُز", ph: "aruzz", pl: "ryż", en: "rice" }, ini: { w: "زَيْت", ph: "zayt", pl: "olej", en: "oil" }, med: { w: "خِزانة", ph: "khizaana", pl: "szafa", en: "cupboard" }, fin: { w: "خُبْز", ph: "khubz", pl: "chleb", en: "bread" } }, nonConnect: true },
  { name: "sīn", iso: "س", ini: "سـ", med: "ـسـ", fin: "ـس", sound: { pl: "s", en: "s" }, ex: { iso: { w: "فَأْس", ph: "fa's", pl: "topór", en: "axe" }, ini: { w: "سَمَك", ph: "samak", pl: "ryba", en: "fish" }, med: { w: "مَسْجِد", ph: "masjid", pl: "meczet", en: "mosque" }, fin: { w: "شَمْس", ph: "shams", pl: "słońce", en: "sun" } }, },
  { name: "shīn", iso: "ش", ini: "شـ", med: "ـشـ", fin: "ـش", sound: { pl: "sh", en: "sh" }, ex: { iso: { w: "فِراش", ph: "firaash", pl: "pościel", en: "bedding" }, ini: { w: "شَمْس", ph: "shams", pl: "słońce", en: "sun" }, med: { w: "مِشْمِش", ph: "mishmish", pl: "morela", en: "apricot" }, fin: { w: "فِراش", ph: "firaash", pl: "pościel", en: "bedding" } }, },
  { name: "ṣād", iso: "ص", ini: "صـ", med: "ـصـ", fin: "ـص", sound: { pl: "S (emfatyczne)", en: "S (emphatic)" }, ex: { iso: { w: "رَصاص", ph: "raSaaS", pl: "ołów", en: "lead" }, ini: { w: "صَباح", ph: "Sabaah", pl: "poranek", en: "morning" }, med: { w: "قَصْر", ph: "qaSr", pl: "pałac", en: "palace" }, fin: { w: "قَميص", ph: "qamiiS", pl: "koszula", en: "shirt" } }, },
  { name: "ḍād", iso: "ض", ini: "ضـ", med: "ـضـ", fin: "ـض", sound: { pl: "D (emfatyczne)", en: "D (emphatic)" }, ex: { iso: { w: "أَرْض", ph: "arD", pl: "ziemia", en: "earth" }, ini: { w: "ضَيْف", ph: "Dayf", pl: "gość", en: "guest" }, med: { w: "أَخْضَر", ph: "akhDar", pl: "zielony", en: "green" }, fin: { w: "أَبْيَض", ph: "abyaD", pl: "biały", en: "white" } }, },
  { name: "ṭā'", iso: "ط", ini: "طـ", med: "ـطـ", fin: "ـط", sound: { pl: "T (emfatyczne)", en: "T (emphatic)" }, ex: { iso: { w: "شَرْط", ph: "sharT", pl: "warunek", en: "condition" }, ini: { w: "طَريق", ph: "Tariiq", pl: "droga", en: "road" }, med: { w: "مَطَر", ph: "maTar", pl: "deszcz", en: "rain" }, fin: { w: "قِطّ", ph: "qiTT", pl: "kot", en: "cat" } }, },
  { name: "ẓā'", iso: "ظ", ini: "ظـ", med: "ـظـ", fin: "ـظ", sound: { pl: "Z / DH (emfatyczne)", en: "Z / DH (emphatic)" }, ex: { iso: { w: "حُظوظ", ph: "HuZuuZ", pl: "losy, szczęście", en: "fortunes" }, ini: { w: "ظُهْر", ph: "Zuhr", pl: "południe", en: "noon" }, med: { w: "نَظيف", ph: "naZiif", pl: "czysty", en: "clean" }, fin: { w: "حِفْظ", ph: "HifZ", pl: "zapamiętanie", en: "memorization" } }, },
  { name: "ʿayn", iso: "ع", ini: "عـ", med: "ـعـ", fin: "ـع", sound: { pl: "3 (gardłowe)", en: "3 (throaty)" }, ex: { iso: { w: "ذِراع", ph: "dhiraa3", pl: "ramię", en: "arm" }, ini: { w: "عَيْن", ph: "3ayn", pl: "oko", en: "eye" }, med: { w: "سَعيد", ph: "sa3iid", pl: "szczęśliwy", en: "happy" }, fin: { w: "جائِع", ph: "jaa'i3", pl: "głodny", en: "hungry" } }, },
  { name: "ghayn", iso: "غ", ini: "غـ", med: "ـغـ", fin: "ـغ", sound: { pl: "gh (jak fr. „r”)", en: "gh (French 'r')" }, ex: { iso: { w: "فَراغ", ph: "faraagh", pl: "pustka", en: "void" }, ini: { w: "غَريب", ph: "ghariib", pl: "obcy, dziwny", en: "strange" }, med: { w: "صَغير", ph: "Saghiir", pl: "mały", en: "small" }, fin: { w: "فارِغ", ph: "faarigh", pl: "pusty", en: "empty" } }, },
  { name: "fā'", iso: "ف", ini: "فـ", med: "ـفـ", fin: "ـف", sound: { pl: "f", en: "f" }, ex: { iso: { w: "رَفّ", ph: "raff", pl: "półka", en: "shelf" }, ini: { w: "فيل", ph: "fiil", pl: "słoń", en: "elephant" }, med: { w: "سَفَر", ph: "safar", pl: "podróż", en: "travel" }, fin: { w: "ضَيْف", ph: "Dayf", pl: "gość", en: "guest" } }, },
  { name: "qāf", iso: "ق", ini: "قـ", med: "ـقـ", fin: "ـق", sound: { pl: "q (eg. hamza)", en: "q (Egy. hamza)" }, ex: { iso: { w: "وَرَق", ph: "waraq", pl: "papier", en: "paper" }, ini: { w: "قَلَم", ph: "qalam", pl: "długopis", en: "pen" }, med: { w: "يَقْرَأ", ph: "yaqra'", pl: "czyta", en: "reads" }, fin: { w: "طَريق", ph: "Tariiq", pl: "droga", en: "road" } }, },
  { name: "kāf", iso: "ك", ini: "كـ", med: "ـكـ", fin: "ـك", sound: { pl: "k", en: "k" }, ex: { iso: { w: "مُبارَك", ph: "mubaarak", pl: "błogosławiony", en: "blessed" }, ini: { w: "كَلْب", ph: "kalb", pl: "pies", en: "dog" }, med: { w: "سُكّر", ph: "sukkar", pl: "cukier", en: "sugar" }, fin: { w: "سَمَك", ph: "samak", pl: "ryba", en: "fish" } }, },
  { name: "lām", iso: "ل", ini: "لـ", med: "ـلـ", fin: "ـل", sound: { pl: "l", en: "l" }, ex: { iso: { w: "طِوال", ph: "Tiwaal", pl: "wysocy", en: "tall (pl.)" }, ini: { w: "لَيْل", ph: "layl", pl: "noc", en: "night" }, med: { w: "قَلَم", ph: "qalam", pl: "długopis", en: "pen" }, fin: { w: "جَمَل", ph: "jamal", pl: "wielbłąd", en: "camel" } }, },
  { name: "mīm", iso: "م", ini: "مـ", med: "ـمـ", fin: "ـم", sound: { pl: "m", en: "m" }, ex: { iso: { w: "يَوْم", ph: "yawm", pl: "dzień", en: "day" }, ini: { w: "ماء", ph: "maa'", pl: "woda", en: "water" }, med: { w: "قَمَر", ph: "qamar", pl: "księżyc", en: "moon" }, fin: { w: "يَوْم", ph: "yawm", pl: "dzień", en: "day" } }, },
  { name: "nūn", iso: "ن", ini: "نـ", med: "ـنـ", fin: "ـن", sound: { pl: "n", en: "n" }, ex: { iso: { w: "فُرْن", ph: "furn", pl: "piec", en: "oven" }, ini: { w: "نَهْر", ph: "nahr", pl: "rzeka", en: "river" }, med: { w: "بِنْت", ph: "bint", pl: "dziewczyna", en: "girl" }, fin: { w: "لَبَن", ph: "laban", pl: "mleko", en: "milk" } }, },
  { name: "hā'", iso: "ه", ini: "هـ", med: "ـهـ", fin: "ـه", sound: { pl: "h", en: "h" }, ex: { iso: { w: "مِياه", ph: "miyaah", pl: "wody", en: "waters" }, ini: { w: "هَواء", ph: "hawaa'", pl: "powietrze", en: "air" }, med: { w: "نَهْر", ph: "nahr", pl: "rzeka", en: "river" }, fin: { w: "وَجْه", ph: "wajh", pl: "twarz", en: "face" } }, },
  { name: "wāw", iso: "و", ini: "و", med: "ـو", fin: "ـو", sound: { pl: "w / ū", en: "w / ū" }, ex: { iso: { w: "دَوْر", ph: "dawr", pl: "rola, tura", en: "role, turn" }, ini: { w: "وَرْدة", ph: "warda", pl: "róża", en: "rose" }, med: { w: "يَوْم", ph: "yawm", pl: "dzień", en: "day" }, fin: { w: "دَلْو", ph: "dalw", pl: "wiadro", en: "bucket" } }, nonConnect: true },
  { name: "yā'", iso: "ي", ini: "يـ", med: "ـيـ", fin: "ـي", sound: { pl: "y / ī", en: "y / ī" }, ex: { iso: { w: "رَأْي", ph: "ra'y", pl: "opinia", en: "opinion" }, ini: { w: "يَد", ph: "yad", pl: "ręka", en: "hand" }, med: { w: "بَيْت", ph: "bayt", pl: "dom", en: "house" }, fin: { w: "كُرْسي", ph: "kursii", pl: "krzesło", en: "chair" } }, },
];

// Grupy liter podobnych wizualnie (najczęściej mylone).
const SIMILAR_GROUPS = [
  { id: "bataTha", letters: ["ب", "ت", "ث", "ن", "ي"], hint: { pl: "Różnią się kropkami: ب (1 pod), ت (2 nad), ث (3 nad), ن (1 nad), ي (2 pod).", en: "Differ by dots: ب (1 below), ت (2 above), ث (3 above), ن (1 above), ي (2 below)." } },
  { id: "jimHaKha", letters: ["ج", "ح", "خ"], hint: { pl: "Ten sam kształt „miseczki”: ج (kropka pod), ح (bez kropki), خ (kropka nad).", en: "Same 'bowl' shape: ج (dot below), ح (no dot), خ (dot above)." } },
  { id: "dalDhal", letters: ["د", "ذ"], hint: { pl: "د (bez kropki) vs ذ (kropka nad).", en: "د (no dot) vs ذ (dot above)." } },
  { id: "raZay", letters: ["ر", "ز"], hint: { pl: "ر (bez kropki) vs ز (kropka nad).", en: "ر (no dot) vs ز (dot above)." } },
  { id: "sinShin", letters: ["س", "ش"], hint: { pl: "س (bez kropek) vs ش (3 kropki nad).", en: "س (no dots) vs ش (3 dots above)." } },
  { id: "sadDad", letters: ["ص", "ض"], hint: { pl: "ص (bez kropki) vs ض (kropka nad).", en: "ص (no dot) vs ض (dot above)." } },
  { id: "taZa", letters: ["ط", "ظ"], hint: { pl: "ط (bez kropki) vs ظ (kropka nad).", en: "ط (no dot) vs ظ (dot above)." } },
  { id: "aynGhayn", letters: ["ع", "غ"], hint: { pl: "ع (bez kropki) vs غ (kropka nad).", en: "ع (no dot) vs غ (dot above)." } },
  { id: "faQaf", letters: ["ف", "ق"], hint: { pl: "ف (1 kropka nad) vs ق (2 kropki nad).", en: "ف (1 dot above) vs ق (2 dots above)." } },
];

// ---------- Ścieżka egipskiego „od zera do bohatera” (prowadzone lekcje) ----------
const EG_PATH = [
  {
    id: "e1", num: 1, kind: "practice", title: { pl: "Cześć i dzień dobry", en: "Hi and hello" },
    goal: { pl: "Przywitaj się po egipsku.", en: "Say hello in Egyptian." },
    blocks: [
      { type: "text", pl: "Zacznijmy od najważniejszego — przywitania. Egipcjanie witają się ciepło i na wiele sposobów. Oto trzy podstawowe:", en: "Let's start with the most important thing — greetings. Egyptians greet warmly and in many ways. Here are three basics:" },
      { type: "word", ar: "أَهْلاً", ph: "ahlan", pl: "cześć", en: "hi" },
      { type: "word", ar: "إِزَّيَّك؟", ph: "ezzayyak?", pl: "jak się masz? (do mężczyzny)", en: "how are you? (to a man)" },
      { type: "word", ar: "إِزَّيِّك؟", ph: "ezzayyik?", pl: "jak się masz? (do kobiety)", en: "how are you? (to a woman)" },
      { type: "tip", pl: "Egipski rozróżnia płeć rozmówcy! „-ak” do mężczyzny, „-ik” do kobiety. To wróci wielokrotnie.", en: "Egyptian distinguishes the listener's gender! '-ak' to a man, '-ik' to a woman. This recurs often." },
    ],
    fiszki: { cat: "basics", pl: "Poćwicz powitania na fiszkach", en: "Practice greetings on flashcards" },
  },
  {
    id: "e2", num: 2, kind: "grammar", title: { pl: "Ja, ty, on — zaimki", en: "I, you, he — pronouns" },
    goal: { pl: "Poznaj podstawowe zaimki osobowe.", en: "Learn the basic personal pronouns." },
    blocks: [
      { type: "text", pl: "Żeby mówić o sobie i innych, potrzebujesz zaimków. Oto najważniejsze:", en: "To talk about yourself and others, you need pronouns. Here are the key ones:" },
      { type: "word", ar: "أَنا", ph: "ana", pl: "ja", en: "I" },
      { type: "word", ar: "إِنْتَ", ph: "enta", pl: "ty (mężczyzna)", en: "you (m)" },
      { type: "word", ar: "إِنْتِ", ph: "enti", pl: "ty (kobieta)", en: "you (f)" },
      { type: "word", ar: "هُوَّ", ph: "howwa", pl: "on", en: "he" },
      { type: "word", ar: "هِيَّ", ph: "heyya", pl: "ona", en: "she" },
      { type: "tip", pl: "Znowu płeć: „enta/enti”. W egipskim nie ma „ono” — wszystko jest rodzaju męskiego lub żeńskiego.", en: "Gender again: 'enta/enti'. Egyptian has no 'it' — everything is masculine or feminine." },
    ],
  },
  {
    id: "e3", num: 3, kind: "practice", title: { pl: "Jak masz na imię?", en: "What's your name?" },
    goal: { pl: "Przedstaw się i zapytaj o imię.", en: "Introduce yourself and ask for a name." },
    blocks: [
      { type: "text", pl: "Teraz połączymy zaimki z praktyką — przedstawianie się.", en: "Now let's combine pronouns with practice — introducing yourself." },
      { type: "phrase", ar: "إِسْمَك إيه؟", ph: "esmak eeh?", pl: "jak masz na imię? (do mężczyzny)", en: "what's your name? (to a man)" },
      { type: "phrase", ar: "إِسْمِك إيه؟", ph: "esmik eeh?", pl: "jak masz na imię? (do kobiety)", en: "what's your name? (to a woman)" },
      { type: "phrase", ar: "أَنا اسْمي...", ph: "ana esmi...", pl: "mam na imię...", en: "my name is..." },
      { type: "tip", pl: "„eeh” = co. „esmak eeh” dosłownie: „imię-twoje co?”. Zauważ znów -ak/-ik.", en: "'eeh' = what. 'esmak eeh' literally: 'name-your what?'. Note -ak/-ik again." },
    ],
  },
  {
    id: "e4", num: 4, kind: "grammar", title: { pl: "Zdanie bez „być”", en: "A sentence with no 'to be'" },
    goal: { pl: "Buduj zdania bez słowa „jest”.", en: "Build sentences with no 'is'." },
    blocks: [
      { type: "text", pl: "Dobra wiadomość: w egipskim (jak w MSA) nie ma „być” w teraźniejszości. „Ja Polak” = „jestem Polakiem”.", en: "Good news: in Egyptian (like MSA) there's no 'to be' in the present. 'I Polish' = 'I am Polish'." },
      { type: "sentence", ar: "أَنا مِصْري", ph: "ana maṣri", pl: "Jestem Egipcjaninem.", en: "I am Egyptian." },
      { type: "sentence", ar: "إِنْتَ كُوَيِّس؟", ph: "enta kwayyes?", pl: "Dobrze się masz? (dosł. ty dobry?)", en: "Are you well? (lit. you good?)" },
      { type: "tip", pl: "Po prostu zestawiasz słowa. Bez odpowiednika „jestem/jesteś”.", en: "You just place words together. No equivalent of 'am/are'." },
    ],
  },
  {
    id: "e5", num: 5, kind: "practice", title: { pl: "Dziękuję i proszę", en: "Thank you and please" },
    goal: { pl: "Bądź uprzejmy po egipsku.", en: "Be polite in Egyptian." },
    blocks: [
      { type: "text", pl: "Uprzejmość otwiera drzwi. Te słowa usłyszysz i powiesz codziennie:", en: "Politeness opens doors. You'll hear and say these daily:" },
      { type: "word", ar: "شُكْراً", ph: "shokran", pl: "dziękuję", en: "thank you" },
      { type: "word", ar: "مِن فَضْلَك", ph: "men faḍlak", pl: "proszę (do mężczyzny)", en: "please (to a man)" },
      { type: "word", ar: "عَفْواً", ph: "3afwan", pl: "proszę bardzo / nie ma za co", en: "you're welcome" },
      { type: "word", ar: "آسِف", ph: "aasef", pl: "przepraszam (mówi mężczyzna)", en: "sorry (said by a man)" },
      { type: "tip", pl: "„3” w transkrypcji to dźwięk „ ع ” (ayn) — gardłowy, charakterystyczny dla arabskiego.", en: "'3' in transcription is the sound 'ع' (ayn) — a throaty sound typical of Arabic." },
    ],
    fiszki: { cat: "basics", pl: "Poćwicz zwroty grzecznościowe", en: "Practice polite phrases" },
  },
  {
    id: "e6", num: 6, kind: "grammar", title: { pl: "To jest... (rodzajnik el-)", en: "This is... (article el-)" },
    goal: { pl: "Naucz się „ten/ta” — rodzajnik el-.", en: "Learn 'the' — the article el-." },
    blocks: [
      { type: "text", pl: "Egipski rodzajnik określony to „el-”, doklejany z przodu. To odpowiednik arabskiego „al-”.", en: "The Egyptian definite article is 'el-', attached to the front. It's the equivalent of Arabic 'al-'." },
      { type: "word", ar: "البيت", ph: "el-beet", pl: "ten dom", en: "the house" },
      { type: "word", ar: "الوَلَد", ph: "el-walad", pl: "ten chłopiec", en: "the boy" },
      { type: "tip", pl: "Przed niektórymi literami „el-” zlewa się: „el-shams” → „esh-shams” (słońce). Usłyszysz to naturalnie.", en: "Before some letters 'el-' assimilates: 'el-shams' → 'esh-shams' (the sun). You'll hear it naturally." },
    ],
  },
  {
    id: "e7", num: 7, kind: "practice", title: { pl: "Liczby 1-5", en: "Numbers 1-5" },
    goal: { pl: "Policz do pięciu.", en: "Count to five." },
    blocks: [
      { type: "text", pl: "Liczby przydają się na targu, przy płaceniu, przy godzinach. Zacznijmy od pięciu:", en: "Numbers are useful at the market, paying, telling time. Let's start with five:" },
      { type: "word", ar: "واحِد", ph: "waaḥed", pl: "jeden", en: "one" },
      { type: "word", ar: "اِتْنين", ph: "etneen", pl: "dwa", en: "two" },
      { type: "word", ar: "تَلاتة", ph: "talaata", pl: "trzy", en: "three" },
      { type: "word", ar: "أَرْبَعة", ph: "arba3a", pl: "cztery", en: "four" },
      { type: "word", ar: "خَمْسة", ph: "khamsa", pl: "pięć", en: "five" },
    ],
    fiszki: { cat: "numbers_time", pl: "Poćwicz liczby na fiszkach", en: "Practice numbers on flashcards" },
  },
  {
    id: "e8", num: 8, kind: "grammar", title: { pl: "Mam / nie mam (3andi)", en: "I have / I don't (3andi)" },
    goal: { pl: "Powiedz, że coś masz.", en: "Say that you have something." },
    blocks: [
      { type: "text", pl: "„Mieć” w egipskim to nie czasownik, tylko przyimek „3and” (u) + zaimek. „3andi” = u-mnie = mam.", en: "'To have' in Egyptian isn't a verb, but the preposition '3and' (at) + pronoun. '3andi' = at-me = I have." },
      { type: "word", ar: "عَنْدي", ph: "3andi", pl: "mam (u mnie)", en: "I have" },
      { type: "word", ar: "عَنْدَك", ph: "3andak", pl: "masz (do mężczyzny)", en: "you have (m)" },
      { type: "sentence", ar: "عَنْدي عَرَبِيّة", ph: "3andi 3arabeyya", pl: "Mam samochód.", en: "I have a car." },
      { type: "tip", pl: "Przeczenie: „ma-3andiish” (nie mam) — dodajesz „ma-...-sh” wokół słowa. To egipski wzór przeczenia.", en: "Negation: 'ma-3andiish' (I don't have) — you add 'ma-...-sh' around the word. That's the Egyptian negation pattern." },
    ],
  },
];

// ---------- Ścieżka MSA „od zera do bohatera” (prowadzone lekcje) ----------
const MSA_PATH = [
  {
    id: "l1", num: 1, title: { pl: "Czym jest MSA?", en: "What is MSA?" },
    goal: { pl: "Zrozum, czego się uczysz i po co.", en: "Understand what you're learning and why." },
    blocks: [
      { type: "text", pl: "MSA (arabski standardowy) to wspólny język pisany całego świata arabskiego — prasa, książki, wiadomości, dokumenty. Nikt nie mówi nim w domu, ale każdy go czyta.", en: "MSA (Modern Standard Arabic) is the shared written language of the whole Arab world — press, books, news, documents. No one speaks it at home, but everyone reads it." },
      { type: "text", pl: "Uczysz się już egipskiego (dialektu mówionego). MSA to jego „literacki brat” — wiele słów rozpoznasz. Arabski pisze się od PRAWEJ do lewej.", en: "You're already learning Egyptian (the spoken dialect). MSA is its 'literary sibling' — you'll recognize many words. Arabic is written from RIGHT to left." },
      { type: "fact", ar: "العَرَبِيّة", ph: "al-ʿarabiyya", pl: "„język arabski” — tak nazywa się MSA po arabsku", en: "'the Arabic language' — what MSA calls itself in Arabic" },
    ],
  },
  {
    id: "l2", num: 2, title: { pl: "Pierwsze trzy litery", en: "Your first three letters" },
    goal: { pl: "Rozpoznaj litery ب، ت، ث — różnią się tylko kropkami.", en: "Recognize ب, ت, ث — they differ only by dots." },
    blocks: [
      { type: "text", pl: "Arabskie litery często różnią się tylko liczbą i położeniem kropek. Oto pierwsza trójka — ten sam kształt, inne kropki:", en: "Arabic letters often differ only by the number and position of dots. Here's the first trio — same shape, different dots:" },
      { type: "letter", ar: "ب", ph: "b", pl: "jedna kropka pod spodem", en: "one dot below" },
      { type: "letter", ar: "ت", ph: "t", pl: "dwie kropki na górze", en: "two dots above" },
      { type: "letter", ar: "ث", ph: "th (jak ang. think)", pl: "trzy kropki na górze", en: "three dots above" },
      { type: "tip", pl: "Kropki to jedyna różnica. Kształt („miseczka”) jest identyczny.", en: "Dots are the only difference. The shape (a 'bowl') is identical." },
    ],
  },
  {
    id: "l3", num: 3, title: { pl: "Litery się łączą", en: "Letters connect" },
    goal: { pl: "Zrozum, że arabski to pismo łączone.", en: "Understand that Arabic is a connected script." },
    blocks: [
      { type: "text", pl: "Arabski to pismo łączone — litery w słowie łączą się jak w naszym piśmie odręcznym. Dlatego jedna litera ma różne kształty zależnie od miejsca w słowie.", en: "Arabic is a connected script — letters in a word join like our handwriting. That's why one letter has different shapes depending on its place in the word." },
      { type: "forms", ar: "ب", iso: "ب", ini: "بـ", med: "ـبـ", fin: "ـب", pl: "litera ب w czterech pozycjach", en: "the letter ب in four positions" },
      { type: "tip", pl: "Nie musisz ich teraz umieć na pamięć — zobaczysz je w praktyce. Pełna tabela jest w zakładce „alfabet”.", en: "You don't need to memorize these now — you'll see them in practice. The full table is in the 'alphabet' tab." },
    ],
  },
  {
    id: "l4", num: 4, title: { pl: "Pierwsze słowo: بَاب", en: "Your first word: بَاب" },
    goal: { pl: "Przeczytaj swoje pierwsze arabskie słowo.", en: "Read your first Arabic word." },
    blocks: [
      { type: "text", pl: "Masz już ب (b). Dołóżmy dwie litery: ا (alif, długie „a”) i znów ب. Czytając od prawej: ب-ا-ب.", en: "You have ب (b). Let's add two letters: ا (alif, long 'a') and ب again. Reading right to left: ب-ا-ب." },
      { type: "word", ar: "بَاب", ph: "bāb", pl: "drzwi", en: "door" },
      { type: "text", pl: "Zauważ: pierwsze ب łączy się z alifem, ale alif NIE łączy się z następną literą — dlatego drugie ب stoi osobno.", en: "Notice: the first ب connects to the alif, but alif does NOT connect to the next letter — so the second ب stands alone." },
    ],
  },
  {
    id: "l5", num: 5, title: { pl: "Samogłoski to znaczki", en: "Vowels are marks" },
    goal: { pl: "Zrozum harakat — krótkie samogłoski nad/pod literą.", en: "Understand harakat — short vowels above/below letters." },
    blocks: [
      { type: "text", pl: "Krótkie samogłoski (a, i, u) nie są literami — to małe znaczki nad lub pod literą, zwane harakat. W prasie zwykle się ich nie pisze (native je zna).", en: "Short vowels (a, i, u) aren't letters — they're small marks above or below a letter, called harakat. Press usually omits them (natives know them)." },
      { type: "haraka", ar: "بَ", ph: "ba", pl: "fatha (kreska na górze) = a", en: "fatha (stroke above) = a" },
      { type: "haraka", ar: "بِ", ph: "bi", pl: "kasra (kreska pod spodem) = i", en: "kasra (stroke below) = i" },
      { type: "haraka", ar: "بُ", ph: "bu", pl: "damma (pętelka na górze) = u", en: "damma (loop above) = u" },
    ],
  },
  {
    id: "l6", num: 6, title: { pl: "Słowo, które już znasz", en: "A word you already know" },
    goal: { pl: "Zobacz, jak egipskie słowo wygląda w MSA.", en: "See how an Egyptian word looks in MSA." },
    blocks: [
      { type: "text", pl: "Znasz z egipskiego „ketaab” (książka). W MSA to niemal to samo — „kitāb”. Rdzeń k-t-b (pisać) łączy książkę, pisanie i biuro.", en: "You know 'ketaab' (book) from Egyptian. In MSA it's almost the same — 'kitāb'. The root k-t-b (write) links book, writing and office." },
      { type: "word", ar: "كِتَاب", ph: "kitāb", pl: "książka", en: "book" },
      { type: "compare", msa: "kitāb", eg: "ketaab", pl: "MSA vs egipski — tylko drobna różnica w samogłosce", en: "MSA vs Egyptian — just a small vowel difference" },
    ],
  },
  {
    id: "l7", num: 7, title: { pl: "Rodzajnik الـ", en: "The article الـ" },
    goal: { pl: "Naucz się „the” po arabsku.", en: "Learn 'the' in Arabic." },
    blocks: [
      { type: "text", pl: "Arabski ma jeden rodzajnik określony: الـ (al-), doklejany z przodu słowa. Nie ma rodzajnika nieokreślonego („a/an”) — jego brak to znaczy „jakiś”.", en: "Arabic has one definite article: الـ (al-), attached to the front of a word. There's no indefinite article ('a/an') — its absence means 'a/some'." },
      { type: "word", ar: "الكِتَاب", ph: "al-kitāb", pl: "ta książka", en: "the book" },
      { type: "tip", pl: "To samo „al-” znasz z egipskiego („el-”) i z „el-ḥamdu li-llāh”.", en: "You know the same 'al-' from Egyptian ('el-') and from 'el-ḥamdu li-llāh'." },
    ],
  },
  {
    id: "l8", num: 8, title: { pl: "Zdanie bez „być”", en: "A sentence with no 'to be'" },
    goal: { pl: "Zbuduj pierwsze zdanie.", en: "Build your first sentence." },
    blocks: [
      { type: "text", pl: "W arabskim w czasie teraźniejszym nie ma słowa „jest”. „Dom duży” = „dom (jest) duży”. To samo działa w egipskim!", en: "In Arabic there's no word 'is' in the present. 'House big' = 'the house (is) big'. The same works in Egyptian!" },
      { type: "sentence", ar: "البَيْتُ كَبيرٌ", ph: "al-baytu kabīrun", pl: "Dom jest duży.", en: "The house is big." },
      { type: "tip", pl: "Końcówki -u i -un to znaczniki przypadka (mianownik). W mowie się je pomija — zobaczysz je w tekście pisanym.", en: "The -u and -un endings mark the case (nominative). They're dropped in speech — you'll see them in written text." },
    ],
  }
];

const MSA_MODULE_1 = {
  id: "phonetics",
  title: { pl: "Fonetyka i pismo MSA", en: "MSA phonetics & script" },
  desc: { pl: "Jak litery brzmią w literackim arabskim — i czym różnią się od egipskiego.", en: "How letters sound in literary Arabic — and how they differ from Egyptian." },
  lessons: [
    {
      id: "qaf",
      title: { pl: "Litera ق (qāf)", en: "The letter ق (qāf)" },
      letter: "ق",
      simple: { pl: "W MSA ق to głoska „q” — twarde k wymawiane głęboko w gardle. W egipskim ta sama litera to zwykle hamza (przerwa krtaniowa).", en: "In MSA ق is 'q' — a hard k made deep in the throat. In Egyptian the same letter is usually a hamza (glottal stop)." },
      tech: { pl: "ق (qāf) to spółgłoska zwarta języczkowa bezdźwięczna [q]. W większości dialektów miejskich (w tym kairskim) przeszła w zwarcie krtaniowe [ʔ]. W czytaniu MSA zawsze wymawiamy pełne [q].", en: "ق (qāf) is a voiceless uvular stop [q]. In most urban dialects (including Cairene) it shifted to a glottal stop [ʔ]. In reading MSA we always pronounce the full [q]." },
      bridge: { pl: "Egipskie „2alb” (serce) to w MSA „qalb”. Ta sama pisownia قلب, inna wymowa.", en: "Egyptian '2alb' (heart) is 'qalb' in MSA. Same spelling قلب, different sound." },
      examples: [
        { ar: "قَلْب", msaPh: "qalb", egPh: "2alb", pl: "serce", en: "heart" },
        { ar: "قَمَر", msaPh: "qamar", egPh: "2amar", pl: "księżyc", en: "moon" },
        { ar: "قَهْوة", msaPh: "qahwa", egPh: "2ahwa", pl: "kawa", en: "coffee" },
        { ar: "قَلَم", msaPh: "qalam", egPh: "2alam", pl: "długopis, pióro", en: "pen" },
      ],
    },
    {
      id: "tha",
      title: { pl: "Litera ث (thā')", en: "The letter ث (thā')" },
      letter: "ث",
      simple: { pl: "W MSA ث to angielskie „th” (jak w „think”). W egipskim zwykle staje się „t” albo „s”.", en: "In MSA ث is the English 'th' (as in 'think'). In Egyptian it usually becomes 't' or 's'." },
      tech: { pl: "ث (thā') to spółgłoska szczelinowa międzyzębowa bezdźwięczna [θ]. W egipskim potocznym przechodzi w [t] (w słowach dziedzicznych) lub [s] (w zapożyczeniach z MSA).", en: "ث (thā') is a voiceless interdental fricative [θ]. In colloquial Egyptian it becomes [t] (in inherited words) or [s] (in MSA loanwords)." },
      bridge: { pl: "„Trzy” to MSA „thalātha”, egipskie „talāta”. Ta sama ث, inna realizacja.", en: "'Three' is MSA 'thalātha', Egyptian 'talāta'. Same ث, different realization." },
      examples: [
        { ar: "ثَلاثة", msaPh: "thalātha", egPh: "talāta", pl: "trzy", en: "three" },
        { ar: "ثَوْب", msaPh: "thawb", egPh: "toob", pl: "szata, ubranie", en: "garment, robe" },
        { ar: "ثَقافة", msaPh: "thaqāfa", egPh: "saʔāfa", pl: "kultura", en: "culture" },
        { ar: "ثَلْج", msaPh: "thalj", egPh: "talg", pl: "śnieg, lód", en: "snow, ice" },
      ],
    },
    {
      id: "jim",
      title: { pl: "Litera ج (jīm)", en: "The letter ج (jīm)" },
      letter: "ج",
      simple: { pl: "W MSA ج to „j” jak w angielskim „jam” (dź). W kairskim egipskim to twarde „g” jak w „góra”.", en: "In MSA ج is 'j' as in English 'jam'. In Cairene Egyptian it's a hard 'g' as in 'go'." },
      tech: { pl: "ج (jīm) to w MSA zwykle afrykata dziąsłowa dźwięczna [dʒ]. Kair jest wyjątkiem wśród stolic arabskich — realizuje ją jako zwarte [g]. To najbardziej rozpoznawalna cecha egipskiej wymowy.", en: "ج (jīm) in MSA is usually a voiced postalveolar affricate [dʒ]. Cairo is exceptional among Arab capitals — it realizes it as a stop [g]. This is the most recognizable feature of Egyptian pronunciation." },
      bridge: { pl: "„Piękny” to MSA „jamīl”, egipskie „gamīl”. Znasz „gamīl” — w MSA to „jamīl”.", en: "'Beautiful' is MSA 'jamīl', Egyptian 'gamīl'. You know 'gamīl' — in MSA it's 'jamīl'." },
      examples: [
        { ar: "جَميل", msaPh: "jamīl", egPh: "gamīl", pl: "piękny", en: "beautiful" },
        { ar: "جَبَل", msaPh: "jabal", egPh: "gabal", pl: "góra", en: "mountain" },
        { ar: "جَديد", msaPh: "jadīd", egPh: "gedīd", pl: "nowy", en: "new" },
        { ar: "رَجُل", msaPh: "rajul", egPh: "rāgil", pl: "mężczyzna", en: "man" },
      ],
    },
    {
      id: "dhal",
      title: { pl: "Litera ذ (dhāl)", en: "The letter ذ (dhāl)" },
      letter: "ذ",
      simple: { pl: "W MSA ذ to dźwięczne „th” jak w angielskim „this”. W egipskim zwykle staje się „d” albo „z”.", en: "In MSA ذ is a voiced 'th' as in English 'this'. In Egyptian it usually becomes 'd' or 'z'." },
      tech: { pl: "ذ (dhāl) to spółgłoska szczelinowa międzyzębowa dźwięczna [ð]. To dźwięczny odpowiednik ث. W egipskim przechodzi w [d] (słowa dziedziczne) lub [z] (zapożyczenia z MSA). Nie mylić z ز (zāy), które zawsze jest [z].", en: "ذ (dhāl) is a voiced interdental fricative [ð]. It's the voiced counterpart of ث. In Egyptian it becomes [d] (inherited words) or [z] (MSA loans). Don't confuse with ز (zāy), which is always [z]." },
      bridge: { pl: "„To/tamto” to MSA „dhālika”, egipskie „da”. A „złoto” — MSA „dhahab”, egipskie „dahab”.", en: "'That' is MSA 'dhālika', Egyptian 'da'. And 'gold' — MSA 'dhahab', Egyptian 'dahab'." },
      examples: [
        { ar: "ذَهَب", msaPh: "dhahab", egPh: "dahab", pl: "złoto", en: "gold" },
        { ar: "ذَكَر", msaPh: "dhakara", egPh: "zakar", pl: "wspomniał", en: "he mentioned" },
        { ar: "هٰذا", msaPh: "hādhā", egPh: "da", pl: "ten, to", en: "this" },
        { ar: "لَذيذ", msaPh: "ladhīdh", egPh: "lazīz", pl: "pyszny", en: "delicious" },
      ],
    },
    {
      id: "ta-marbuta",
      title: { pl: "Końcówka ة (tā' marbūṭa)", en: "The ending ة (tā' marbūṭa)" },
      letter: "ة",
      simple: { pl: "ة to końcówka rodzaju żeńskiego. Zwykle czytamy ją jako „a”, ale gdy słowo łączy się z następnym (iḍāfa), brzmi jako „-at”.", en: "ة is the feminine ending. Usually read as 'a', but when the word links to the next (iḍāfa), it sounds as '-at'." },
      tech: { pl: "tā' marbūṭa („związane t”) to ت zapisane jak ه z dwiema kropkami. Na końcu wyrazu w pauzie: [a]. W iḍāfie lub przed końcówką ujawnia się jako [t]. W MSA z pełnym i'rāb: -atun/-atin/-atan. To jeden z najważniejszych sygnałów rodzaju żeńskiego.", en: "tā' marbūṭa ('tied t') is a ت written like ه with two dots. Word-finally in pause: [a]. In iḍāfa or before a suffix it surfaces as [t]. In MSA with full i'rāb: -atun/-atin/-atan. It's a key marker of feminine gender." },
      bridge: { pl: "„Szkoła” to „madrasa”, ale „szkoła języków” to „madrasat al-lughāt” — ة ujawnia „t”. To znasz z egipskiego: „madraset...”.", en: "'School' is 'madrasa', but 'school of languages' is 'madrasat al-lughāt' — ة reveals the 't'. You know this from Egyptian: 'madraset...'." },
      examples: [
        { ar: "مَدينة", msaPh: "madīna", egPh: "medīna", pl: "miasto", en: "city" },
        { ar: "سَيّارة", msaPh: "sayyāra", egPh: "3arabeyya", pl: "samochód", en: "car" },
        { ar: "جامِعة", msaPh: "jāmiʿa", egPh: "gam3a", pl: "uniwersytet", en: "university" },
        { ar: "لُغة", msaPh: "lugha", egPh: "logha", pl: "język", en: "language" },
      ],
    },
    {
      id: "hamza",
      title: { pl: "Znak ء (hamza)", en: "The sign ء (hamza)" },
      letter: "ء",
      simple: { pl: "hamza to zwarcie krtaniowe — krótka „przerwa” w głosie. Siedzi na nośniku: أ إ ؤ ئ, albo samodzielnie ء.", en: "hamza is a glottal stop — a brief 'catch' in the voice (like in 'uh-oh'). It sits on a carrier: أ إ ؤ ئ, or stands alone ء." },
      tech: { pl: "hamza [ʔ] to pełnoprawna spółgłoska w MSA. Nośnik zależy od otaczających samogłosek (reguły „siły”: i > u > a). Na początku wyrazu prawie zawsze na alifie: أ (a/u) lub إ (i). Egipskie „2” (z ق) to inny dźwięk niż etymologiczna hamza, choć brzmią tak samo.", en: "hamza [ʔ] is a full consonant in MSA. Its carrier depends on surrounding vowels (strength rules: i > u > a). Word-initially almost always on alif: أ (a/u) or إ (i). The Egyptian '2' (from ق) is a different sound from etymological hamza, though they sound alike." },
      bridge: { pl: "„Pytanie” to „su'āl” z hamzą na nośniku ؤ. hamzę wymawiasz jak egipskie „2” — tylko pochodzi z innego miejsca.", en: "'Question' is 'su'āl' with hamza on the carrier ؤ. You pronounce hamza just like the Egyptian '2' — it just comes from a different source." },
      examples: [
        { ar: "سُؤال", msaPh: "su'āl", egPh: "su2āl", pl: "pytanie", en: "question" },
        { ar: "أَكَل", msaPh: "akala", egPh: "akal", pl: "zjadł", en: "he ate" },
        { ar: "مَساء", msaPh: "masā'", egPh: "masā2", pl: "wieczór", en: "evening" },
        { ar: "شَيء", msaPh: "shay'", egPh: "shē2", pl: "rzecz", en: "thing" },
      ],
    },
    {
      id: "alif-maqsura",
      title: { pl: "Litera ى (alif maqṣūra)", en: "The letter ى (alif maqṣūra)" },
      letter: "ى",
      simple: { pl: "ى na końcu wyrazu to „ukryte alif” — wygląda jak ي (yā') bez kropek, ale czyta się jak długie „ā”.", en: "ى at the end of a word is a 'hidden alif' — it looks like ي (yā') without dots, but reads as a long 'ā'." },
      tech: { pl: "alif maqṣūra („skrócone alif”) występuje tylko na końcu wyrazu i brzmi [aː]. Historycznie to zredukowane yā' lub wāw. Pojawia się w czasownikach o słabym rdzeniu (np. رمى ramā) i przysłówkach. W Egipcie ي i ى często pisze się wymiennie — w MSA rozróżnienie jest ścisłe.", en: "alif maqṣūra ('shortened alif') occurs only word-finally and sounds [aː]. Historically a reduced yā' or wāw. It appears in weak-root verbs (e.g. رمى ramā) and adverbs. In Egypt ي and ى are often written interchangeably — in MSA the distinction is strict." },
      bridge: { pl: "„Na/do” to „ʿalā” pisane z ى na końcu. Czytasz „ā”, nie „i”. To samo w „ilā” (do).", en: "'On/onto' is 'ʿalā' written with ى at the end. You read 'ā', not 'i'. Same in 'ilā' (to)." },
      examples: [
        { ar: "عَلى", msaPh: "ʿalā", egPh: "3ala", pl: "na, do", en: "on, onto" },
        { ar: "إِلى", msaPh: "ilā", egPh: "ila", pl: "do, ku", en: "to, towards" },
        { ar: "مَعْنى", msaPh: "maʿnā", egPh: "ma3na", pl: "znaczenie", en: "meaning" },
        { ar: "مُستَشْفى", msaPh: "mustashfā", egPh: "mustashfa", pl: "szpital", en: "hospital" },
      ],
    },
  ],
};

const MSA_MODULE_2 = {
  id: "vocab",
  title: { pl: "Słownictwo literackie", en: "Literary vocabulary" },
  desc: { pl: "Pierwsze prawdziwe słowa MSA różne od egipskich — z odpowiednikiem egipskim i zdaniem użycia.", en: "The first real MSA words that differ from Egyptian — with an Egyptian equivalent and a usage sentence." },
  lessons: [
    {
      id: "questions",
      title: { pl: "Pytajniki (MSA)", en: "Question words (MSA)" },
      simple: { pl: "Pytajniki to jedne z najczęstszych słów w tekście — i prawie wszystkie różnią się od egipskich. W prasie i literaturze spotkasz formy MSA.", en: "Question words are among the most frequent words in text — and almost all differ from Egyptian. In press and literature you'll meet the MSA forms." },
      tech: { pl: "W MSA pytajniki są bardziej zróżnicowane niż w egipskim. Niektóre rządzą przypadkiem (np. كَم + biernik nieokreślony). مَا vs مَاذَا: مَا pyta o rzeczy w zdaniu imiennym, مَاذَا przed czasownikiem.", en: "In MSA question words are more differentiated than in Egyptian. Some govern case (e.g. كَم + accusative singular). مَا vs مَاذَا: مَا asks about things in nominal sentences, مَاذَا before a verb." },
      words: [
        { ar: "كَيْفَ", msaPh: "kayfa", egPh: "ezzāy", pl: "jak", en: "how", sMsa: "كَيْفَ حالُك؟", sMsaPh: "kayfa ḥāluk?", sEg: "ezzayyak?", sPl: "Jak się masz?", sEn: "How are you?" },
        { ar: "مَاذَا", msaPh: "mādhā", egPh: "eeh", pl: "co", en: "what", sMsa: "مَاذَا تَفْعَل؟", sMsaPh: "mādhā tafʿal?", sEg: "bti3mel eeh?", sPl: "Co robisz?", sEn: "What are you doing?" },
        { ar: "لِمَاذَا", msaPh: "limādhā", egPh: "leeh", pl: "dlaczego", en: "why", sMsa: "لِمَاذَا تَأَخَّرْت؟", sMsaPh: "limādhā ta'akhkhart?", sEg: "et'akhkhart leeh?", sPl: "Dlaczego się spóźniłeś?", sEn: "Why are you late?" },
        { ar: "أَيْنَ", msaPh: "ayna", egPh: "feen", pl: "gdzie", en: "where", sMsa: "أَيْنَ الْبَيْت؟", sMsaPh: "ayna al-bayt?", sEg: "feen el-beet?", sPl: "Gdzie jest dom?", sEn: "Where is the house?" },
        { ar: "مَتَى", msaPh: "matā", egPh: "emta", pl: "kiedy", en: "when", sMsa: "مَتَى تَصِل؟", sMsaPh: "matā taṣil?", sEg: "hatewsal emta?", sPl: "Kiedy przyjedziesz?", sEn: "When do you arrive?" },
        { ar: "مَنْ", msaPh: "man", egPh: "meen", pl: "kto", en: "who", sMsa: "مَنْ هٰذا؟", sMsaPh: "man hādhā?", sEg: "meen da?", sPl: "Kto to?", sEn: "Who is this?" },
        { ar: "كَمْ", msaPh: "kam", egPh: "kām", pl: "ile", en: "how many", sMsa: "كَمْ عُمْرُك؟", sMsaPh: "kam ʿumruk?", sEg: "3andak kām sana?", sPl: "Ile masz lat?", sEn: "How old are you?" },
      ],
    },
    {
      id: "connectors",
      title: { pl: "Łączniki tekstu (MSA)", en: "Text connectors (MSA)" },
      simple: { pl: "Łączniki spajają zdania w tekście. To fundament czytania prasy — pojawiają się w niemal każdym zdaniu i nadają tekstowi rytm i logikę.", en: "Connectors bind sentences in text. They're the foundation of reading press — they appear in almost every sentence and give text its rhythm and logic." },
      tech: { pl: "وَ (wa) to zwykłe „i”. فَ (fa) = „i wtedy / więc” (następstwo). ثُمَّ (thumma) = „potem” (odstęp w czasie). لٰكِنَّ (lākinna) rządzi biernikiem. لِأَنَّ (li-anna) = „ponieważ” + biernik. Te słowa często zlewają się z następnym wyrazem w piśmie.", en: "وَ (wa) is plain 'and'. فَ (fa) = 'and so / then' (immediate result). ثُمَّ (thumma) = 'then' (time gap). لٰكِنَّ (lākinna) governs the accusative. لِأَنَّ (li-anna) = 'because' + accusative. These often attach to the next word in writing." },
      words: [
        { ar: "وَ", msaPh: "wa", egPh: "we", pl: "i", en: "and", sMsa: "الأَبُ وَالأُمّ", sMsaPh: "al-abu wa-l-umm", sEg: "el-ab we-l-omm", sPl: "ojciec i matka", sEn: "the father and the mother" },
        { ar: "فَ", msaPh: "fa", egPh: "fa", pl: "więc, i wtedy", en: "so, and then", sMsa: "دَرَسَ فَنَجَح", sMsaPh: "darasa fa-najaḥ", sEg: "zaakir fa-negeh", sPl: "Uczył się, więc zdał.", sEn: "He studied, so he passed." },
        { ar: "ثُمَّ", msaPh: "thumma", egPh: "ba3dēn", pl: "potem, następnie", en: "then, afterwards", sMsa: "أَكَلَ ثُمَّ نَامَ", sMsaPh: "akala thumma nāma", sEg: "kal wa ba3dēn nām", sPl: "Zjadł, potem zasnął.", sEn: "He ate, then slept." },
        { ar: "لٰكِنْ", msaPh: "lākin", egPh: "bass", pl: "ale, lecz", en: "but", sMsa: "أُريدُ لٰكِنْ لا أَسْتَطيع", sMsaPh: "urīdu lākin lā astaṭīʿ", sEg: "3āyez bass mush 2ādir", sPl: "Chcę, ale nie mogę.", sEn: "I want to, but I can't." },
        { ar: "لِأَنَّ", msaPh: "li-anna", egPh: "3ashān", pl: "ponieważ, bo", en: "because", sMsa: "بَقِيَ لِأَنَّهُ مَريض", sMsaPh: "baqiya li-annahu marīḍ", sEg: "2a3ad 3ashān 3ayyān", sPl: "Został, bo jest chory.", sEn: "He stayed because he's sick." },
        { ar: "أَوْ", msaPh: "aw", egPh: "walla", pl: "albo, lub", en: "or", sMsa: "شايٌ أَوْ قَهْوة", sMsaPh: "shāyun aw qahwa", sEg: "shāy walla 2ahwa", sPl: "Herbata albo kawa?", sEn: "Tea or coffee?" },
        { ar: "إِذَا", msaPh: "idhā", egPh: "law", pl: "jeśli", en: "if", sMsa: "إِذَا دَرَسْتَ نَجَحْت", sMsaPh: "idhā darasta najaḥt", sEg: "law zaakirt hatengaḥ", sPl: "Jeśli się uczysz, zdasz.", sEn: "If you study, you'll pass." },
      ],
    },
  ],
};

const MSA_MODULE_3 = {
  id: "syntax",
  title: { pl: "Składnia zdania", en: "Sentence syntax" },
  desc: { pl: "Jak słowa układają się w zdania MSA — z rozbiorem na części zdania.", en: "How words form MSA sentences — with a breakdown into sentence parts." },
  lessons: [
    {
      id: "nominal",
      title: { pl: "Zdanie imienne vs czasownikowe", en: "Nominal vs verbal sentence" },
      simple: { pl: "Arabskie zdanie zaczyna się albo od rzeczownika (zdanie imienne — opisuje stan), albo od czasownika (zdanie czasownikowe — opisuje czynność). To podstawowy podział składni.", en: "An Arabic sentence starts either with a noun (nominal — describes a state) or a verb (verbal — describes an action). This is the basic split of syntax." },
      tech: { pl: "Zdanie imienne (jumla ismiyya) = podmiot (mubtada') + orzecznik (khabar), bez czasownika „być” w czasie teraźniejszym. Zdanie czasownikowe (jumla fiʿliyya) zaczyna się od czasownika. W MSA orzecznik zdania imiennego jest w mianowniku (-un).", en: "Nominal sentence (jumla ismiyya) = subject (mubtada') + predicate (khabar), with no verb 'to be' in the present. Verbal sentence (jumla fiʿliyya) starts with a verb. In MSA the predicate of a nominal sentence is in the nominative (-un)." },
      note: { pl: "Egipski działa tak samo — brak „być” w teraźniejszości. „el-beet kbeer” = dom (jest) duży.", en: "Egyptian works the same — no 'to be' in the present. 'el-beet kbeer' = the house (is) big." },
      sentences: [
        { type: { pl: "zdanie imienne", en: "nominal" }, segs: [ {ar:"الْبَيْتُ", ph:"al-baytu", role:"subject"}, {ar:"كَبيرٌ", ph:"kabīrun", role:"predicate"} ], pl: "Dom jest duży.", en: "The house is big." },
        { type: { pl: "zdanie imienne", en: "nominal" }, segs: [ {ar:"الطّالِبُ", ph:"aṭ-ṭālibu", role:"subject"}, {ar:"مُجْتَهِدٌ", ph:"mujtahidun", role:"predicate"} ], pl: "Uczeń jest pilny.", en: "The student is diligent." },
        { type: { pl: "zdanie czasownikowe", en: "verbal" }, segs: [ {ar:"كَتَبَ", ph:"kataba", role:"verb"}, {ar:"الْوَلَدُ", ph:"al-waladu", role:"subject"}, {ar:"الدَّرْسَ", ph:"ad-darsa", role:"object"} ], pl: "Chłopiec napisał lekcję.", en: "The boy wrote the lesson." },
      ],
    },
    {
      id: "vso",
      title: { pl: "Szyk zdania: czasownik na początku", en: "Word order: verb first" },
      simple: { pl: "W klasycznym zdaniu czasownikowym MSA czasownik stoi PRZED podmiotem (VSO: czasownik–podmiot–dopełnienie). To inaczej niż po polsku i inaczej niż w codziennym egipskim.", en: "In a classic MSA verbal sentence the verb comes BEFORE the subject (VSO: verb–subject–object). This differs from English and from everyday Egyptian." },
      tech: { pl: "W szyku VSO czasownik na początku pozostaje w liczbie pojedynczej niezależnie od liczby podmiotu (np. „kataba l-awlādu” = napisali chłopcy, dosł. „napisał chłopcy”). Egipski preferuje szyk SVO (podmiot–czasownik), bliższy polskiemu.", en: "In VSO the initial verb stays singular regardless of the subject's number (e.g. 'kataba l-awlādu' = the boys wrote, lit. 'wrote the-boys'). Egyptian prefers SVO (subject–verb), closer to English." },
      note: { pl: "WAŻNA różnica: MSA „ذَهَبَ الرَّجُلُ” (poszedł mężczyzna), egipski „الراجل راح” (mężczyzna poszedł). Kolejność odwrócona!", en: "KEY difference: MSA 'dhahaba r-rajulu' (went the-man), Egyptian 'er-rāgil rāḥ' (the-man went). Order reversed!" },
      sentences: [
        { type: { pl: "VSO", en: "VSO" }, segs: [ {ar:"ذَهَبَ", ph:"dhahaba", role:"verb"}, {ar:"الرَّجُلُ", ph:"ar-rajulu", role:"subject"}, {ar:"إِلَى السّوقِ", ph:"ilā s-sūqi", role:"adverbial"} ], pl: "Mężczyzna poszedł na targ.", en: "The man went to the market." },
        { type: { pl: "VSO", en: "VSO" }, segs: [ {ar:"قَرَأَتْ", ph:"qara'at", role:"verb"}, {ar:"الْبِنْتُ", ph:"al-bintu", role:"subject"}, {ar:"الْكِتابَ", ph:"al-kitāba", role:"object"} ], pl: "Dziewczyna przeczytała książkę.", en: "The girl read the book." },
        { type: { pl: "VSO", en: "VSO" }, segs: [ {ar:"يَشْرَبُ", ph:"yashrabu", role:"verb"}, {ar:"الْأَطْفالُ", ph:"al-aṭfālu", role:"subject"}, {ar:"الْحَليبَ", ph:"al-ḥalība", role:"object"} ], pl: "Dzieci piją mleko.", en: "The children drink milk." },
      ],
    },
    {
      id: "idafa",
      title: { pl: "Iḍāfa — konstrukcja dopełniaczowa", en: "Iḍāfa — the genitive construction" },
      simple: { pl: "Iḍāfa łączy dwa rzeczowniki: „X (czegoś)”. Pierwszy rzeczownik NIE ma rodzajnika, drugi jest w dopełniaczu. To jak polskie „drzwi domu” — bez „od”, samo zestawienie.", en: "Iḍāfa links two nouns: 'X of Y'. The first noun takes NO article, the second is in the genitive. Like 'the door of the house' — just juxtaposition." },
      tech: { pl: "W iḍāfie pierwszy człon (al-muḍāf) traci rodzajnik i tanwīn; drugi człon (al-muḍāf ilayhi) jest w dopełniaczu (-i / -in). Cała konstrukcja jest określona, jeśli drugi człon jest określony. To najczęstsza konstrukcja w prasie.", en: "In iḍāfa the first term (al-muḍāf) loses its article and tanwīn; the second term (al-muḍāf ilayhi) is in the genitive (-i / -in). The whole is definite if the second term is definite. It's the most common construction in press." },
      note: { pl: "Egipski używa iḍāfy tak samo („bāb el-beet” = drzwi domu), ale też „bitā3”. MSA używa tylko iḍāfy.", en: "Egyptian uses iḍāfa too ('bāb el-beet' = door of the house), but also 'bitā3'. MSA uses only iḍāfa." },
      sentences: [
        { type: { pl: "iḍāfa", en: "iḍāfa" }, segs: [ {ar:"بابُ", ph:"bābu", role:"mudaf"}, {ar:"الْبَيْتِ", ph:"al-bayti", role:"mudafilayhi"} ], pl: "drzwi domu", en: "the door of the house" },
        { type: { pl: "iḍāfa", en: "iḍāfa" }, segs: [ {ar:"كِتابُ", ph:"kitābu", role:"mudaf"}, {ar:"الطّالِبِ", ph:"aṭ-ṭālibi", role:"mudafilayhi"} ], pl: "książka ucznia", en: "the student's book" },
        { type: { pl: "iḍāfa", en: "iḍāfa" }, segs: [ {ar:"مِفْتاحُ", ph:"miftāḥu", role:"mudaf"}, {ar:"السَّيّارةِ", ph:"as-sayyārati", role:"mudafilayhi"} ], pl: "kluczyk do samochodu", en: "the car key" },
      ],
    },
  ],
};

const MSA_MODULES = [MSA_MODULE_1, MSA_MODULE_2, MSA_MODULE_3];

const MSA_ROOTS = [
  {
    root: { ar: "ك-ت-ب", tr: "k-t-b" },
    meaning: { pl: "pisanie, pismo", en: "writing" },
    coreIdea: { pl: "wszystko związane z pisaniem i tekstem", en: "everything to do with writing and text" },
    family: [
      { role: "verb", wazn: { ar: "فَعَلَ", tr: "fa3ala" }, msa: { ar: "كَتَبَ", ph: "kataba" }, eg: { ar: "كتب", ph: "katab" }, pl: "napisał", en: "he wrote", note: { pl: "Podstawowy czasownik I wzoru. Egipski gubi końcówkę -a.", en: "Basic form-I verb. Egyptian drops the final -a." } },
      { role: "noun", wazn: { ar: "فِعَال", tr: "fi3aal" }, msa: { ar: "كِتَاب", ph: "kitaab" }, eg: { ar: "كتاب", ph: "ketaab" }, pl: "książka", en: "book", note: { pl: "Ten sam rdzeń, MSA „kitaab” → egipskie „ketaab”.", en: "Same root, MSA 'kitaab' → Egyptian 'ketaab'." } },
      { role: "agent", wazn: { ar: "فاعِل", tr: "faa3il" }, msa: { ar: "كاتِب", ph: "kaatib" }, eg: { ar: "كاتب", ph: "kaatib" }, pl: "pisarz, autor", en: "writer", note: { pl: "Wzór فاعِل = wykonawca czynności (ten, kto pisze).", en: "The فاعِل pattern = the doer (the one who writes)." } },
      { role: "place", wazn: { ar: "مَفْعَل", tr: "maf3al" }, msa: { ar: "مَكْتَب", ph: "maktab" }, eg: { ar: "مكتب", ph: "maktab" }, pl: "biuro, biurko", en: "office, desk", note: { pl: "Wzór مَفْعَل = miejsce czynności (miejsce pisania).", en: "The مَفْعَل pattern = place of the action (place of writing)." } },
      { role: "place", wazn: { ar: "مَفْعَلة", tr: "maf3ala" }, msa: { ar: "مَكْتَبة", ph: "maktaba" }, eg: { ar: "مكتبة", ph: "maktaba" }, pl: "biblioteka, księgarnia", en: "library, bookshop", note: { pl: "Ten sam wzór miejsca z końcówką -a.", en: "The same place-pattern with an -a ending." } },
      { role: "plural", wazn: { ar: "فُعُل", tr: "fu3ul" }, msa: { ar: "كُتُب", ph: "kutub" }, eg: { ar: "كتب", ph: "kotob" }, pl: "książki", en: "books", note: { pl: "Liczba mnoga łamana od „kitaab”.", en: "Broken plural of 'kitaab'." } },
    ],
  },
  {
    root: { ar: "أ-ك-ل", tr: "2-k-l" },
    meaning: { pl: "jedzenie", en: "eating" },
    coreIdea: { pl: "wszystko związane z jedzeniem", en: "everything to do with eating" },
    family: [
      { role: "verb", wazn: { ar: "فَعَلَ", tr: "fa3ala" }, msa: { ar: "أَكَلَ", ph: "akala" }, eg: { ar: "أكل", ph: "akal" }, pl: "zjadł", en: "he ate", note: { pl: "Czasownik I wzoru. W egipskim rozkaźnik nieregularny: kul (jedz).", en: "Form-I verb. Egyptian imperative is irregular: kul (eat)." } },
      { role: "noun", wazn: { ar: "فَعْل", tr: "fa3l" }, msa: { ar: "أَكْل", ph: "akl" }, eg: { ar: "أكل", ph: "akl" }, pl: "jedzenie (rzecz)", en: "food", note: { pl: "Rzeczownik odczasownikowy. W egipskim „akl” = jedzenie w ogóle.", en: "Verbal noun. In Egyptian 'akl' = food in general." } },
      { role: "agent", wazn: { ar: "فاعِل", tr: "faa3il" }, msa: { ar: "آكِل", ph: "aakil" }, eg: { ar: "آكل", ph: "aakil" }, pl: "jedzący", en: "eater / eating", note: { pl: "Imiesłów czynny: ten, kto je.", en: "Active participle: the one eating." } },
      { role: "food", wazn: { ar: "مَفْعُولات", tr: "maf3uulaat" }, msa: { ar: "مَأْكُولات", ph: "ma2kuulaat" }, eg: { ar: "مأكولات", ph: "ma2kulaat" }, pl: "potrawy, dania", en: "foods, dishes", note: { pl: "Wzór مَفْعُول = przedmiot czynności (to, co się je), lm.", en: "The مَفْعُول pattern = object of the action (what is eaten), plural." } },
      { role: "meal", wazn: { ar: "مَفْعَل", tr: "maf3al" }, msa: { ar: "مَأْكَل", ph: "ma2kal" }, eg: { ar: "مأكل", ph: "ma2kal" }, pl: "pokarm, pożywienie", en: "food, sustenance", note: { pl: "Wzór miejsca/źródła — to, z czego się je.", en: "Place/source pattern — that from which one eats." } },
    ],
  },
  {
    root: { ar: "د-ر-س", tr: "d-r-s" },
    meaning: { pl: "nauka, studiowanie", en: "studying" },
    coreIdea: { pl: "wszystko związane z uczeniem się i nauczaniem", en: "everything to do with studying and teaching" },
    family: [
      { role: "verb", wazn: { ar: "فَعَلَ", tr: "fa3ala" }, msa: { ar: "دَرَسَ", ph: "darasa" }, eg: { ar: "درس", ph: "daras" }, pl: "studiował, uczył się", en: "he studied", note: { pl: "I wzór = uczyć się. Uwaga: II wzór „darras” = nauczać.", en: "Form I = to study. Note: form II 'darras' = to teach." } },
      { role: "noun", wazn: { ar: "فَعْل", tr: "fa3l" }, msa: { ar: "دَرْس", ph: "dars" }, eg: { ar: "درس", ph: "dars" }, pl: "lekcja", en: "lesson", note: { pl: "Ten sam wyraz w MSA i egipskim.", en: "The same word in MSA and Egyptian." } },
      { role: "agent", wazn: { ar: "مُفَعِّل", tr: "mufa33il" }, msa: { ar: "مُدَرِّس", ph: "mudarris" }, eg: { ar: "مدرس", ph: "mudarris" }, pl: "nauczyciel", en: "teacher", note: { pl: "Wykonawca od II wzoru (nauczający). Wzór مُفَعِّل.", en: "Doer of form II (the one teaching). Pattern مُفَعِّل." } },
      { role: "place", wazn: { ar: "مَفْعَلة", tr: "maf3ala" }, msa: { ar: "مَدْرَسة", ph: "madrasa" }, eg: { ar: "مدرسة", ph: "madrasa" }, pl: "szkoła", en: "school", note: { pl: "Wzór miejsca = miejsce nauki. Identyczne w obu.", en: "Place pattern = place of study. Identical in both." } },
      { role: "student", wazn: { ar: "فاعِل", tr: "faa3il" }, msa: { ar: "دارِس", ph: "daaris" }, eg: { ar: "دارس", ph: "daaris" }, pl: "uczący się, student", en: "learner, student", note: { pl: "Imiesłów: ten, kto się uczy.", en: "Participle: the one who studies." } },
    ],
  },
];

const MSA_COMPARISON = {
  // 1. IDENTYCZNE — pisownia i wymowa praktycznie takie same w obu.
  same: [
    { pl: "książka", en: "book", eg: { ar: "كتاب", ph: "ketaab" }, msa: { ar: "كتاب", ph: "kitaab" }, note: "Ten sam rdzeń, tylko krótka samogłoska brzmi nieco inaczej.", noteEn: "The same root, only the short vowel sounds a bit different." },
    { pl: "dom", en: "house", eg: { ar: "بيت", ph: "beet" }, msa: { ar: "بيت", ph: "bayt" }, note: "MSA „ay” → egipskie długie „ee”. Pisownia identyczna.", noteEn: "MSA \"ay\" → Egyptian long \"ee\". Spelling identical." },
    { pl: "szkoła", en: "school", eg: { ar: "مدرسة", ph: "madrasa" }, msa: { ar: "مدرسة", ph: "madrasa" }, note: "Praktycznie identyczne.", noteEn: "Practically identical." },
    { pl: "woda", en: "water", eg: { ar: "ماء / مية", ph: "mayya" }, msa: { ar: "ماء", ph: "maa2" }, note: "MSA „maa2” pisane ماء; egipski upraszcza do مية „mayya”.", noteEn: "MSA \"maa2\" written ماء; Egyptian simplifies it to مية \"mayya\"." },
    { pl: "słońce", en: "sun", eg: { ar: "شمس", ph: "shams" }, msa: { ar: "شمس", ph: "shams" }, note: "Identyczne.", noteEn: "Identical." },
    { pl: "ręka", en: "hand", eg: { ar: "يد / إيد", ph: "iid" }, msa: { ar: "يد", ph: "yad" }, note: "Ten sam rdzeń; egipski dodaje na początku „i”.", noteEn: "The same root; Egyptian adds an \"i\" at the start." },
    { pl: "nowy", en: "new", eg: { ar: "جديد", ph: "gediid" }, msa: { ar: "جديد", ph: "jadiid" }, note: "Pisownia ta sama, ale ج: MSA „j” → egipskie „g” (patrz grupa „inna wymowa”).", noteEn: "Same spelling, but ج: MSA \"j\" → Egyptian \"g\" (see the \"different pronunciation\" group)." },
  ],
  // 2. TO SAMO SŁOWO, INNA WYMOWA — pisownia identyczna, ale egipski czyta inaczej
  //    (najczęściej przez ج/ق/ث/ذ).
  pronunciation: [
    { pl: "piękny", ar: "جميل", eg: "gamiil", msa: "jamiil", rule: "ج: MSA „j” → egipskie „g”" },
    { pl: "mężczyzna", ar: "رجل / راجل", eg: "raagel", msa: "rajul", rule: "ج: „j” → „g” (egipski dodaje też „aa”)" },
    { pl: "góra", ar: "جبل", eg: "gabal", msa: "jabal", rule: "ج: „j” → „g”" },
    { pl: "serce", ar: "قلب", eg: "2alb", msa: "qalb", rule: "ق: MSA „q” → egipska hamza (2)" },
    { pl: "powiedział", ar: "قال", eg: "2aal", msa: "qaala", rule: "ق: „q” → hamza (2)" },
    { pl: "przed", ar: "قبل", eg: "2abl", msa: "qabl", rule: "ق: „q” → hamza (2)" },
    { pl: "trzy", ar: "ثلاثة / تلاتة", eg: "talaata", msa: "thalaatha", rule: "ث: MSA „th” → egipskie „t”" },
    { pl: "drugi / inny", ar: "ثاني / تاني", eg: "taani", msa: "thaani", rule: "ث: „th” → „t”" },
    { pl: "lód", ar: "ثلج / تلج", eg: "talg", msa: "thalj", rule: "ث→t oraz ج→g (dwie zmiany naraz)" },
    { pl: "to (rodzaj męski)", ar: "ذا / ده", eg: "da", msa: "dhaa", rule: "ذ: MSA „dh” → egipskie „d”" },
    { pl: "złoto", ar: "ذهب / دهب", eg: "dahab", msa: "dhahab", rule: "ذ: „dh” → „d”" },
    { pl: "bogaty", ar: "غني", eg: "8ani", msa: "ghaniyy", rule: "Ten sam wyraz; drobna różnica w końcówce" },
  ],
  // 3. ZUPEŁNIE INNE SŁOWO — egipski używa innego wyrazu niż MSA.
  different: [
    { pl: "jak? / w jaki sposób", en: "how?", eg: { ar: "إزاي", ph: "ezzaay" }, msa: { ar: "كيف", ph: "kayfa" } },
    { pl: "dlaczego?", en: "why?", eg: { ar: "ليه", ph: "leeh" }, msa: { ar: "لماذا", ph: "limaadha" } },
    { pl: "co?", en: "what?", eg: { ar: "إيه", ph: "eeh" }, msa: { ar: "ماذا", ph: "maadha" } },
    { pl: "gdzie?", en: "where?", eg: { ar: "فين", ph: "feen" }, msa: { ar: "أين", ph: "ayna" } },
    { pl: "teraz", en: "now", eg: { ar: "دلوقتي", ph: "delwa2ti" }, msa: { ar: "الآن", ph: "al-2aan" } },
    { pl: "chcę", en: "I want", eg: { ar: "عايز", ph: "3aayez" }, msa: { ar: "أريد", ph: "uriid" } },
    { pl: "poszedł", en: "he went", eg: { ar: "راح", ph: "raaH" }, msa: { ar: "ذهب", ph: "dhahaba" } },
    { pl: "zobaczył / patrzył", en: "he saw / looked", eg: { ar: "بص / شاف", ph: "baSS / shaaf" }, msa: { ar: "نظر", ph: "naZara" } },
    { pl: "dobry / ładny", en: "good / nice", eg: { ar: "كويس", ph: "kwayyes" }, msa: { ar: "جيد", ph: "jayyid" } },
    { pl: "bardzo", en: "very", eg: { ar: "أوي / خالص", ph: "awi / khaaliS" }, msa: { ar: "جداً", ph: "jiddan" } },
    { pl: "tylko", en: "only", eg: { ar: "بس", ph: "bass" }, msa: { ar: "فقط", ph: "faqaT" } },
    { pl: "trochę", en: "a little", eg: { ar: "شوية", ph: "shwayya" }, msa: { ar: "قليلاً", ph: "qaliilan" } },
    { pl: "jak (podobny)", en: "like (similar)", eg: { ar: "زي", ph: "zayy" }, msa: { ar: "مثل", ph: "mithl" } },
    { pl: "znowu / jeszcze", en: "again / still", eg: { ar: "كمان", ph: "kamaan" }, msa: { ar: "أيضاً", ph: "ayDan" } },
    { pl: "chcieć", en: "to want", eg: { ar: "عايز", ph: "3aayez" }, msa: { ar: "يريد", ph: "yuriid" } },
    { pl: "patrzeć", en: "to look", eg: { ar: "بص", ph: "boSS" }, msa: { ar: "ينظر", ph: "yanZur" } },
    { pl: "przynieść", en: "to bring", eg: { ar: "جاب", ph: "gaab" }, msa: { ar: "أحضر", ph: "aHDara" } },
    { pl: "usiąść", en: "to sit down", eg: { ar: "قعد", ph: "2a3ad" }, msa: { ar: "جلس", ph: "jalasa" } },
    { pl: "pieniądze", en: "money", eg: { ar: "فلوس", ph: "feluus" }, msa: { ar: "نقود", ph: "nuquud" } },
    { pl: "samochód", en: "car", eg: { ar: "عربية", ph: "3arabeyya" }, msa: { ar: "سيارة", ph: "sayyaara" } },
    { pl: "telefon", en: "phone", eg: { ar: "موبايل", ph: "mobaayel" }, msa: { ar: "هاتف", ph: "haatif" } },
    { pl: "kiedy?", en: "when?", eg: { ar: "إمتى", ph: "emta" }, msa: { ar: "متى", ph: "mata" } },
    { pl: "ile?", en: "how much?", eg: { ar: "كام", ph: "kaam" }, msa: { ar: "كم", ph: "kam" } },
    { pl: "teraz (drugi wariant)", en: "now (variant)", eg: { ar: "حالاً", ph: "Haalan" }, msa: { ar: "الآن", ph: "al-2aan" } },
  ],
};

// ---------- Czytanki ----------
// Dłuższe teksty narracyjne (nie dialogi) z użyciem różnych czasów.
// Każde zdanie: ar/ph/pl. tenseNote wyjaśnia użyte czasy. questions = pytania
// na rozumienie (typu prawda/fałsz lub wybór), oparte wyłącznie na treści tekstu.
// ---------- Edycja dialogów i czytanek ----------
// Poprawki treści (błędy w ar/ph/pl) zapisywane w localStorage jako nakładki,
// nakładane na dane z kodu. Dzięki temu poprawki przetrwają aktualizacje aplikacji.
const CONTENT_EDITS_KEY = "ar-eg-content-edits-v1";

function loadContentEdits() {
  try {
    const raw = localStorage.getItem(CONTENT_EDITS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    return {};
  }
}

function saveContentEdit(key, value) {
  try {
    const all = loadContentEdits();
    all[key] = value;
    localStorage.setItem(CONTENT_EDITS_KEY, JSON.stringify(all));
  } catch (e) {}
}

// Klucz linii: "dialog|{tytuł}|{index}" lub "reading|{tytuł}|{index}".
function lineEditKey(kind, title, i) {
  return `${kind}|${title}|${i}`;
}

// Nakłada zapisane poprawki na linię (ar/ph/pl). edits = obiekt z loadContentEdits.
function applyLineEdit(line, edits, key) {
  const e = edits[key];
  return e ? { ...line, ...e } : line;
}

const READINGS = [
  {
    title: "Mój dzień", titleEn: "My day",
    emoji: "📅",
    level: "łatwy", levelEn: "easy",
    context: "Opis zwykłego dnia — czas teraźniejszy.", contextEn: "A description of an ordinary day — present tense.",
    tenseNote: "Tekst w czasie teraźniejszym (biyi-/ba-). Opisuje rutynę, która powtarza się codziennie.", tenseNoteEn: "A present-tense text (biyi-/ba-). It describes a routine that repeats every day.",
    sentences: [
      { ar: "أنا بصحى الساعة سبعة الصبح.", arH: "أنا بَصْحى السّاعة سَبْعة الصُّبْح.", ph: "ana baSHa is-saa3a sab3a iS-SobH.", pl: "Wstaję o siódmej rano." , en: "I get up at seven in the morning." },
      { ar: "بفطر عيش وجبنة وبشرب شاي.", arH: "بَفْطَر عيش وِجِبْنة وِبَشْرَب شاي.", ph: "bafTar 3eesh we gebna we bashrab shaay.", pl: "Jem na śniadanie chleb z serem i piję herbatę." , en: "For breakfast I eat bread with cheese and drink tea." },
      { ar: "بروح الشغل الساعة تسعة.", arH: "بَروح الشُّغْل السّاعة تِسْعة.", ph: "baruuH ish-shughl is-saa3a tes3a.", pl: "Idę do pracy o dziewiątej." , en: "I go to work at nine." },
      { ar: "بشتغل لحد الساعة خمسة.", arH: "بَشْتَغَل لِحَدّ السّاعة خَمْسة.", ph: "bashtaghal leHadd is-saa3a khamsa.", pl: "Pracuję do piątej." , en: "I work until five." },
      { ar: "بالليل بتفرج على التليفزيون وبنام بدري.", arH: "بِاللّيل بَتْفَرَّج عَلى التِّليفِزْيون وِبَنام بَدْري.", ph: "bil-leel batfarrag 3ala it-televizyon we banaam badri.", pl: "Wieczorem oglądam telewizję i kładę się wcześnie spać." , en: "In the evening I watch TV and go to bed early." },
    ],
    questions: [
      {
        q: "O której wstaje autor?",
        qEn: "What time does the author get up?",
        qAr: "بيصحى الساعة كام؟",
        options: ["O szóstej", "O siódmej", "O dziewiątej"],
        optionsEn: ["At six", "At seven", "At nine"],
        optionsAr: ["الساعة ستة", "الساعة سبعة", "الساعة تسعة"],
        correct: 1,
      },
      {
        q: "Co je na śniadanie?",
        qEn: "What does he eat for breakfast?",
        qAr: "بيفطر إيه؟",
        options: ["Chleb z serem", "Koszari", "Tylko herbatę"],
        optionsEn: ["Bread with cheese", "Koshari", "Only tea"],
        optionsAr: ["عيش وجبنة", "كشري", "شاي بس"],
        correct: 0,
      },
      {
        q: "Do której pracuje?",
        qEn: "Until what time does he work?",
        qAr: "بيشتغل لحد الساعة كام؟",
        options: ["Do trzeciej", "Do piątej", "Do dziewiątej"],
        optionsEn: ["Until three", "Until five", "Until nine"],
        optionsAr: ["لحد تلاتة", "لحد خمسة", "لحد تسعة"],
        correct: 1,
      },
    ],
  },
  {
    title: "Wycieczka do Aleksandrii", titleEn: "A trip to Alexandria",
    emoji: "🏖️",
    level: "średni", levelEn: "medium",
    context: "Opowieść o wczorajszym wyjeździe — czas przeszły.", contextEn: "A story about yesterday's trip — past tense.",
    tenseNote: "Tekst w czasie przeszłym (formy typu ruHt, akalt, kaan). Opowiada o zdarzeniu, które już się wydarzyło.", tenseNoteEn: "A past-tense text (forms like ruHt, akalt, kaan). It tells of an event that already happened.",
    sentences: [
      { ar: "إمبارح رحت إسكندرية مع العيلة.", arH: "إمْبارِح رُحْت إسْكِنْدِرِيّة مَع العيلة.", ph: "embaareH ruHt eskendereyya ma3 il-3eela.", pl: "Wczoraj pojechałem do Aleksandrii z rodziną." , en: "Yesterday I went to Alexandria with my family." },
      { ar: "ركبنا العربية الساعة ستة الصبح.", arH: "رِكِبْنا العَرَبِيّة السّاعة سِتّة الصُّبْح.", ph: "rekebna il-3arabeyya is-saa3a setta iS-SobH.", pl: "Wsiedliśmy do samochodu o szóstej rano." , en: "We got in the car at six in the morning." },
      { ar: "الجو كان حلو والبحر كان جميل.", arH: "الجَوّ كان حِلْو وِالبَحْر كان جَميل.", ph: "il-gaww kaan Helw wil-baHr kaan gamiil.", pl: "Pogoda była ładna, a morze było piękne." , en: "The weather was nice and the sea was beautiful." },
      { ar: "أكلنا سمك في مطعم على البحر.", arH: "أكَلْنا سَمَك في مَطْعَم عَلى البَحْر.", ph: "akalna samak fi maT3am 3ala il-baHr.", pl: "Jedliśmy rybę w restauracji nad morzem." , en: "We ate fish at a restaurant by the sea." },
      { ar: "رجعنا القاهرة بالليل تعبانين بس مبسوطين.", arH: "رِجِعْنا القاهْرة بِاللّيل تَعْبانين بَسّ مَبْسوطين.", ph: "rege3na il-2aahira bil-leel ta3baniin bass mabsuTiin.", pl: "Wróciliśmy do Kairu wieczorem, zmęczeni, ale zadowoleni." , en: "We returned to Cairo in the evening, tired but happy." },
    ],
    questions: [
      { q: "Dokąd pojechał autor?", options: ["Do Kairu", "Do Aleksandrii", "Do Gizy"], correct: 1, qEn: "Where did the author go?", optionsEn: ["To Cairo", "To Alexandria", "To Giza"] },
      { q: "Jaka była pogoda?", options: ["Ładna", "Deszczowa", "Zimna"], correct: 0, qEn: "What was the weather like?", optionsEn: ["Nice", "Rainy", "Cold"] },
      { q: "Co jedli?", options: ["Koszari", "Rybę", "Mięso"], correct: 1, qEn: "What did they eat?", optionsEn: ["Koshari", "Fish", "Meat"] },
      { q: "Jak się czuli po powrocie?", options: ["Głodni", "Zmęczeni ale zadowoleni", "Smutni"], correct: 1, qEn: "How did they feel after returning?", optionsEn: ["Hungry", "Tired but happy", "Sad"] },
    ],
  },
  {
    title: "Plany na weekend", titleEn: "Weekend plans",
    emoji: "🗓️",
    level: "średni", levelEn: "medium",
    context: "Zamiary na najbliższe dni — czas przyszły.", contextEn: "Plans for the coming days — future tense.",
    tenseNote: "Tekst w czasie przyszłym (ha- + czasownik, np. haruuH, hazuur). Mówi o tym, co dopiero się wydarzy.", tenseNoteEn: "A future-tense text (ha- + verb, e.g. haruuH, hazuur). It talks about what is about to happen.",
    sentences: [
      { ar: "الأسبوع الجاي هزور خالتي في طنطا.", arH: "الأُسْبوع الجايّ هَزور خالْتي في طَنْطا.", ph: "il-osbuu3 ig-gaay hazuur khalti fi TanTa.", pl: "W przyszłym tygodniu odwiedzę ciocię w Tancie." , en: "Next week I'll visit my aunt in Tanta." },
      { ar: "هركب القطر الساعة تمنية.", arH: "هَرْكَب القَطْر السّاعة تَمَنْية.", ph: "harkab il-2aTr is-saa3a tamanya.", pl: "Wsiądę do pociągu o ósmej." , en: "I'll take the train at eight." },
      { ar: "هقعد معاها يومين.", arH: "هَقْعُد مَعاها يُومين.", ph: "ha23od ma3aaha yomeen.", pl: "Zostanę u niej dwa dni." , en: "I'll stay with her for two days." },
      { ar: "هنطبخ ملوخية ونتفرج على أفلام.", arH: "هَنُطْبُخ مُلوخِيّة وِنِتْفَرَّج عَلى أفْلام.", ph: "hanTbokh molokheyya we netfarrag 3ala aflaam.", pl: "Ugotujemy molochiję i pooglądamy filmy." , en: "We'll cook molokhia and watch movies." },
      { ar: "هرجع القاهرة يوم الأحد.", arH: "هَرْجَع القاهْرة يوم الأحَدّ.", ph: "harga3 il-2aahira yoom il-Hadd.", pl: "Wrócę do Kairu w niedzielę." , en: "I'll return to Cairo on Sunday." },
    ],
    questions: [
      { q: "Kogo odwiedzi autor?", options: ["Brata", "Ciocię", "Kolegę"], correct: 1, qEn: "Who will the author visit?", optionsEn: ["A brother", "His aunt", "A colleague"] },
      { q: "Ile dni zostanie?", options: ["Jeden", "Dwa", "Trzy"], correct: 1, qEn: "How many days will he stay?", optionsEn: ["One", "Two", "Three"] },
      { q: "Kiedy wróci do Kairu?", options: ["W sobotę", "W niedzielę", "W piątek"], correct: 1, qEn: "When will he return to Cairo?", optionsEn: ["On Saturday", "On Sunday", "On Friday"] },
    ],
  },
  {
    title: "Historia Ahmeda", titleEn: "Ahmed's story",
    emoji: "📖",
    level: "trudny", levelEn: "hard",
    context: "Dłuższa opowieść mieszająca czasy — przeszły, teraźniejszy, przyszły.", contextEn: "A longer story mixing tenses — past, present, future.",
    tenseNote: "Tekst miesza czasy: przeszły (opis kim był), teraźniejszy (co robi teraz) i przyszły (plany). Zwróć uwagę, jak zmienia się forma czasownika.", tenseNoteEn: "The text mixes tenses: past (who he was), present (what he does now), and future (plans). Notice how the verb form changes.",
    sentences: [
      { ar: "أحمد كان طالب في الجامعة.", arH: "أحْمَد كان طالِب في الجامْعة.", ph: "aHmad kaan Taalib fil-gam3a.", pl: "Ahmed był studentem na uniwersytecie." , en: "Ahmed was a student at the university." },
      { ar: "درس هندسة أربع سنين.", arH: "دَرَس هَنْدَسة أرْبَع سِنين.", ph: "daras handasa arba3 siniin.", pl: "Studiował inżynierię przez cztery lata." , en: "He studied engineering for four years." },
      { ar: "دلوقتي هو بيشتغل في شركة كبيرة.", arH: "دِلْوَقْتي هُوَّ بِيِشْتَغَل في شِرْكة كِبيرة.", ph: "delwa2ti howwa biyishtaghal fi sherka kebiira.", pl: "Teraz pracuje w dużej firmie." , en: "Now he works at a big company." },
      { ar: "بيحب شغله بس بيتعب كتير.", arH: "بِيْحِبّ شُغْلُه بَسّ بِيِتْعِب كِتير.", ph: "biyHebb shughlo bass biyit3ab ketiir.", pl: "Lubi swoją pracę, ale bardzo się męczy." , en: "He likes his job but gets very tired." },
      { ar: "السنة الجاية هيتجوز ويسافر برة مصر.", arH: "السَّنة الجايّة هَيِتْجَوِّز وِيْسافِر بَرّة مَصْر.", ph: "is-sana ig-gaaya hayitgawwez we yesaafer barra maSr.", pl: "W przyszłym roku ożeni się i wyjedzie za granicę." , en: "Next year he'll get married and go abroad." },
      { ar: "بيقول إن المستقبل هيبقى أحسن.", arH: "بِيْقول إنّ المُسْتَقْبَل هَيِبْقى أحْسَن.", ph: "biy2uul enn il-musta2bal hayeb2a aHsan.", pl: "Mówi, że przyszłość będzie lepsza." , en: "He says the future will be better." },
    ],
    questions: [
      { q: "Co studiował Ahmed?", options: ["Medycynę", "Inżynierię", "Prawo"], correct: 1, qEn: "What did Ahmed study?", optionsEn: ["Medicine", "Engineering", "Law"] },
      { q: "Gdzie teraz pracuje?", options: ["Na uniwersytecie", "W dużej firmie", "W szpitalu"], correct: 1, qEn: "Where does he work now?", optionsEn: ["At university", "At a big company", "At a hospital"] },
      { q: "Co planuje w przyszłym roku?", options: ["Zmienić pracę", "Ożenić się i wyjechać", "Wrócić na studia"], correct: 1, qEn: "What is he planning next year?", optionsEn: ["Change jobs", "Get married and go abroad", "Go back to studying"] },
      { q: "Jak myśli o przyszłości?", options: ["Że będzie lepsza", "Że będzie trudna", "Nie wie"], correct: 0, qEn: "How does he think about the future?", optionsEn: ["That it'll be better", "That it'll be hard", "He doesn't know"] },
    ],
  },
  {
    title: "Kim jestem", titleEn: "Who I am",
    emoji: "🙋",
    level: "łatwy", levelEn: "easy",
    context: "Grzegorz przedstawia siebie — czas teraźniejszy.", contextEn: "Grzegorz introduces himself — present tense.",
    tenseNote: "Prosty tekst w czasie teraźniejszym — podstawa przedstawiania się. Zauważ „ana” (ja) + zawód bez czasownika „być”, typowe dla arabskiego.", tenseNoteEn: "A simple present-tense text — the basics of introducing yourself. Note \"ana\" (I) + occupation without the verb \"to be\", typical of Arabic.",
    sentences: [
      { ar: "أنا اسمي جيجورج، أنا من بولندا.", arH: "أنا اسْمي جِيجورج، أنا مِن بولَنْدا.", ph: "ana esmi Grzegorz, ana min bolanda.", pl: "Nazywam się Grzegorz, jestem z Polski." , en: "My name is Grzegorz, I'm from Poland." },
      { ar: "أنا ساكن في كراكوف.", arH: "أنا ساكِن في كْراكوف.", ph: "ana saaken fi Krakow.", pl: "Mieszkam w Krakowie." , en: "I live in Krakow." },
      { ar: "أنا محامي وعندي شركة.", arH: "أنا مُحامي وِعَنْدي شِرْكة.", ph: "ana moHaami we 3andi sherka.", pl: "Jestem prawnikiem i mam firmę." , en: "I'm a lawyer and I have a company." },
      { ar: "الشركة بتقدم خدمات محاسبة.", arH: "الشِّرْكة بِتْقَدِّم خَدَمات مُحاسْبة.", ph: "ish-sherka bet2addem khadamaat moHasba.", pl: "Firma świadczy usługi księgowe." , en: "The company provides accounting services." },
      { ar: "أنا متجوز ومراتي مهندسة معمارية.", arH: "أنا مِتْجَوِّز وِمَراتي مُهَنْدِسة مِعْمارِيّة.", ph: "ana metgawwez we meraati mohandesa me3maareyya.", pl: "Jestem żonaty, a moja żona jest architektką." , en: "I'm married, and my wife is an architect." },
    ],
    questions: [
      { q: "Skąd jest Grzegorz?", options: ["Z Egiptu", "Z Polski", "Z Austrii"], correct: 1, qEn: "Where is Grzegorz from?", optionsEn: ["From Egypt", "From Poland", "From Austria"] },
      { q: "Jaki ma zawód?", options: ["Architekt", "Prawnik", "Nauczyciel"], correct: 1, qEn: "What's his profession?", optionsEn: ["Architect", "A lawyer", "A teacher"] },
      { q: "Co robi jego firma?", options: ["Usługi księgowe", "Buduje domy", "Uczy języków"], correct: 0, qEn: "What does his company do?", optionsEn: ["Accounting services", "She builds houses", "She teaches languages"] },
    ],
  },
  {
    title: "Moja firma", titleEn: "My company",
    emoji: "💼",
    level: "średni", levelEn: "medium",
    context: "Grzegorz opowiada o swojej pracy — teraźniejszy z liczbami.", contextEn: "Grzegorz talks about his work — present tense with numbers.",
    tenseNote: "Czas teraźniejszy do opisu stałej sytuacji. Zwróć uwagę na liczby (arba3iin = 40) i „3andi” (mam).", tenseNoteEn: "Present tense describing a stable situation. Note the numbers (arba3iin = 40) and \"3andi\" (I have).",
    sentences: [
      { ar: "عندي شركة في كراكوف.", arH: "عَنْدي شِرْكة في كْراكوف.", ph: "3andi sherka fi Krakow.", pl: "Mam firmę w Krakowie." , en: "I have a company in Krakow." },
      { ar: "بشتغل محامي ومستشار ضرايب.", arH: "بَشْتَغَل مُحامي وِمُسْتَشار ضَرايِب.", ph: "bashtaghal moHaami we mostashaar Daraayeb.", pl: "Pracuję jako prawnik i doradca podatkowy." , en: "I work as a lawyer and tax advisor." },
      { ar: "عندي أربعين موظف بيشتغلوا معايا.", arH: "عَنْدي أرْبِعين مُوَظَّف بِيِشْتَغَلوا مَعايا.", ph: "3andi arba3iin mowaZZaf biyishtaghalu ma3aaya.", pl: "Mam czterdziestu pracowników, którzy pracują ze mną." , en: "I have forty employees who work with me." },
      { ar: "بنقدم خدمات محاسبة للعملاء.", arH: "بِنْقَدِّم خَدَمات مُحاسْبة لِلعُمَلاء.", ph: "beni2addem khadamaat moHasba lil-3omalaa2.", pl: "Świadczymy usługi księgowe dla klientów." , en: "We provide accounting services for clients." },
      { ar: "الشغل صعب شوية بس بحبه.", arH: "الشُّغْل صَعْب شْوَيّة بَسّ بَحِبُّه.", ph: "ish-shughl Sa3b shwayya bass baHebbo.", pl: "Praca jest trochę trudna, ale ją lubię." , en: "The work is a bit hard, but I like it." },
    ],
    questions: [
      { q: "Ilu pracowników ma Grzegorz?", options: ["Czternastu", "Czterdziestu", "Czterech"], correct: 1, qEn: "How many employees does Grzegorz have?", optionsEn: ["Fourteen", "Forty", "Four"] },
      { q: "Czym się zajmuje oprócz prawa?", options: ["Doradztwem podatkowym", "Architekturą", "Nauczaniem"], correct: 0, qEn: "What does he do besides law?", optionsEn: ["Tax advisory", "Architecture", "Teaching"] },
      { q: "Jak ocenia swoją pracę?", options: ["Łatwa i nudna", "Trudna, ale ją lubi", "Nie lubi jej"], correct: 1, qEn: "How does he rate his work?", optionsEn: ["Easy and boring", "Hard", "but he likes it", "He doesn't like it"] },
    ],
  },
  {
    title: "Moja żona", titleEn: "My wife",
    emoji: "👩‍💼",
    level: "średni", levelEn: "medium",
    context: "Grzegorz opowiada o żonie i ich planach — teraźniejszy i przyszły.", contextEn: "Grzegorz talks about his wife and their plans — present and future.",
    tenseNote: "Tekst miesza teraźniejszy (co żona robi) z przyszłym (ha- + czasownik, plany o psie). Dobre ćwiczenie przechodzenia między czasami.", tenseNoteEn: "The text mixes present (what the wife does) with future (ha- + verb, plans about a dog). Good practice for switching tenses.",
    sentences: [
      { ar: "مراتي مهندسة معمارية.", arH: "مَراتي مُهَنْدِسة مِعْمارِيّة.", ph: "meraati mohandesa me3maareyya.", pl: "Moja żona jest architektką." , en: "My wife is an architect." },
      { ar: "بتشتغل في شركة بتشتغل في النمسا.", arH: "بِتِشْتَغَل في شِرْكة بِتِشْتَغَل في النِّمْسا.", ph: "betishtaghal fi sherka betishtaghal fin-nemsa.", pl: "Pracuje w firmie, która działa w Austrii." , en: "She works at a company that operates in Austria." },
      { ar: "إحنا عندنا شقة في كراكوف.", arH: "إحْنا عَنْدِنا شَقّة في كْراكوف.", ph: "eHna 3andena sha22a fi Krakow.", pl: "Mamy mieszkanie w Krakowie." , en: "We have an apartment in Krakow." },
      { ar: "قريب هنجيب كلب.", arH: "قُرَيِّب هَنْجيب كَلْب.", ph: "2orayyeb hangiib kalb.", pl: "Wkrótce sprowadzimy psa." , en: "We'll get a dog soon." },
      { ar: "إحنا مبسوطين بحياتنا مع بعض.", arH: "إحْنا مَبْسوطين بِحَياتْنا مَع بَعْض.", ph: "eHna mabsuTiin be-Hayaatna ma3 ba3D.", pl: "Jesteśmy szczęśliwi z naszego wspólnego życia." , en: "We're happy with our life together." },
    ],
    questions: [
      { q: "Jaki zawód ma żona Grzegorza?", options: ["Prawniczka", "Architektka", "Księgowa"], correct: 1, qEn: "What's Grzegorz's wife's profession?", optionsEn: ["A lawyer", "Architect", "An accountant"] },
      { q: "Na jakim rynku działa jej firma?", options: ["Austriackim", "Polskim", "Egipskim"], correct: 0, qEn: "Which market does her company work in?", optionsEn: ["Austrian", "Polish", "Egyptian"] },
      { q: "Co planują wkrótce?", options: ["Kupić mieszkanie", "Sprowadzić psa", "Wyjechać za granicę"], correct: 1, qEn: "What are they planning soon?", optionsEn: ["Buy an apartment", "Get a dog", "Go abroad"] },
    ],
  },
  {
    title: "Jak uczę się arabskiego", titleEn: "How I learn Arabic",
    emoji: "📚",
    level: "trudny", levelEn: "hard",
    context: "Grzegorz o swojej nauce arabskiego — przeszły, teraźniejszy, przyszły.", contextEn: "Grzegorz on learning Arabic — past, present, future.",
    tenseNote: "Pełny miks czasów: zaczął uczyć się (przeszły), uczy się teraz (teraźniejszy), chce mówić lepiej (przyszły/pragnienie). To Twoja własna historia po egipsku.", tenseNoteEn: "A full mix of tenses: started learning (past), learns now (present), wants to speak better (future/desire). This is your own story in Egyptian.",
    sentences: [
      { ar: "بقالي سنتين بتعلم عربي.", arH: "بَقالي سَنْتين بَتْعَلِّم عَرَبي.", ph: "ba2aali santeen bat3allem 3arabi.", pl: "Od dwóch lat uczę się arabskiego." , en: "I've been learning Arabic for two years." },
      { ar: "بتعلمه كهواية، مش للشغل.", arH: "بَتْعَلِّمُه كِهِوايَة، مِش لِلشُّغْل.", ph: "bat3allemo ke-hewaaya, mish lish-shughl.", pl: "Uczę się go jako hobby, nie do pracy." , en: "I learn it as a hobby, not for work." },
      { ar: "بآخد دروس أونلاين.", arH: "بآخُد دُروس أونْلايْن.", ph: "baakhod duruus onlaayn.", pl: "Biorę lekcje online." , en: "I take online lessons." },
      { ar: "مدرستي سورية بس ساكنة في القاهرة.", arH: "مُدَرِّسْتي سورِيّة بَسّ ساكْنة في القاهْرة.", ph: "modarrasti soreyya bass sakna fil-2aahira.", pl: "Moja nauczycielka jest Syryjką, ale mieszka w Kairze." , en: "My teacher is Syrian, but she lives in Cairo." },
      { ar: "رحت مصر كذا مرة وحبيت البلد.", arH: "رُحْت مَصْر كَذا مَرّة وِحَبّيت البَلَد.", ph: "roHt maSr kaza marra we Habbeet il-balad.", pl: "Byłem w Egipcie kilka razy i pokochałem ten kraj." , en: "I've been to Egypt a few times and I fell in love with the country." },
      { ar: "نفسي أتكلم عربي كويس أكتر.", arH: "نِفْسي أتْكَلِّم عَرَبي كْوَيِّس أكْتَر.", ph: "nefsi atkallem 3arabi kwayyes aktar.", pl: "Chciałbym mówić po arabsku jeszcze lepiej." , en: "I'd like to speak Arabic even better." },
    ],
    questions: [
      { q: "Jak długo Grzegorz uczy się arabskiego?", options: ["Rok", "Dwa lata", "Pięć lat"], correct: 1, qEn: "How long has Grzegorz been learning Arabic?", optionsEn: ["A year", "Two years", "Five years"] },
      { q: "Po co się uczy?", options: ["Do pracy", "Jako hobby", "Bo ma rodzinę w Egipcie"], correct: 1, qEn: "Why is he learning?", optionsEn: ["To work", "As a hobby", "Because he has family in Egypt"] },
      { q: "Skąd jest jego nauczycielka?", options: ["Z Egiptu", "Z Syrii", "Z Polski"], correct: 1, qEn: "Where is his teacher from?", optionsEn: ["From Egypt", "From Syria", "From Poland"] },
      { q: "Gdzie ona mieszka?", options: ["W Damaszku", "W Kairze", "W Krakowie"], correct: 1, qEn: "Where does she live?", optionsEn: ["In Damascus", "In Cairo", "In Krakow"] },
      { q: "Czego chce Grzegorz?", options: ["Mówić lepiej po arabsku", "Przestać się uczyć", "Zamieszkać w Egipcie"], correct: 0, qEn: "What does Grzegorz want?", optionsEn: ["To speak Arabic better", "Stop learning", "Settle in Egypt"] },
    ],
  },
  {
    title: "Dozorca z naszego budynku", titleEn: "The doorman in our building",
    emoji: "🇪🇬",
    level: "średni", levelEn: "medium",
    context: "Scenka z życia kairskiego budynku — czas teraźniejszy i przeszły.", contextEn: "A scene from life in a Cairo building — present and past tense.",
    tenseNote: "Tekst miesza teraźniejszy (co dzieje się zwykle) z przeszłym (co się wydarzyło). Dobre do poczucia realiów codziennego Egiptu.", tenseNoteEn: "The text mixes present (what usually happens) with past (what happened). Good for a feel of everyday Egypt.",
    sentences: [
      { ar: "في العمارة بتاعتنا بواب اسمه عم سيد.", arH: "في العِمارة بْتاعِتْنا بَوّاب اسْمُه عَمّ سَيِّد.", ph: "fil-3imaara bta3etna bawwaab esmo 3amm sayyed.", pl: "W naszym budynku jest dozorca imieniem Amm Sajjed." , en: "In our building there's a doorman named Amm Sajjed." },
      { ar: "كل الصبح بيفتح الباب وبينضّف السلم.", arH: "كُلّ الصُّبْح بِيِفْتَح الباب وِبِيْنَضَّف السِّلِّم.", ph: "koll iS-SobH biyeftaH il-baab we biynaDDaf is-sellem.", pl: "Każdego ranka otwiera drzwi i sprząta schody." , en: "Every morning he opens the door and cleans the stairs." },
      { ar: "الأسانسير بايظ من زمان، بس هو بيقول 'بكرة نصلّحه'.", arH: "الأسانْسير بايِظ مِن زَمان، بَسّ هُوَّ بِيْقول 'بُكْرة نْصَلَّحُه'.", ph: "il-asanseer baayeZ min zamaan, bass howwa biy2uul 'bukra neSallaHo'.", pl: "Winda jest zepsuta od dawna, ale on mówi „jutro ją naprawimy”." , en: "The elevator has been broken for ages, but he says he will fix it tomorrow." },
      { ar: "إمبارح ساعدني أطلّع الشنط لحد الدور الخامس.", arH: "إمْبارِح ساعِدْني أطَلَّع الشُّنَط لِحَدّ الدَّوْر الخامِس.", ph: "embaareH sa3edni aTalla3 ish-shonaT leHadd id-door il-khaames.", pl: "Wczoraj pomógł mi wnieść torby na piąte piętro." , en: "Yesterday he helped me carry the bags up to the fifth floor." },
      { ar: "الناس في الحتة كلها بتحبه وبتحترمه.", arH: "النّاس في الحِتّة كُلَّها بِتْحِبُّه وِبِتِحْتِرْمُه.", ph: "in-naas fil-Hetta kollaha betHebbo we betaHtermo.", pl: "Wszyscy w okolicy go lubią i szanują." , en: "Everyone in the neighborhood likes and respects him." },
    ],
    questions: [
      { q: "Jak nazywa się dozorca?", options: ["Amm Mustafa", "Amm Sajjed", "Amm Ahmed"], correct: 1, qEn: "What's the doorman's name?", optionsEn: ["Amm Mustafa", "Amm Sajjed", "Amm Ahmed"] },
      { q: "Co jest zepsute w budynku?", options: ["Winda", "Drzwi", "Schody"], correct: 0, qEn: "What's broken in the building?", optionsEn: ["The elevator", "The door", "The stairs"] },
      { q: "W czym dozorca pomógł wczoraj?", options: ["W naprawie windy", "W wniesieniu toreb", "W sprzątaniu"], correct: 1, qEn: "What did the doorman help with yesterday?", optionsEn: ["Fixing the elevator", "Carrying the bags", "Cleaning"] },
      { q: "Jak ludzie go traktują?", options: ["Lubią i szanują", "Ignorują", "Boją się go"], correct: 0, qEn: "How do people treat him?", optionsEn: ["They like and respect him", "They ignore him", "They fear him"] },
    ],
  },
  {
    title: "Dzień na targu", titleEn: "A day at the market",
    emoji: "🛒",
    level: "łatwy", levelEn: "easy",
    context: "Zakupy na egipskim targu — czas teraźniejszy i targowanie.", contextEn: "Shopping at an Egyptian market — present tense and bargaining.",
    tenseNote: "Czas teraźniejszy z prefiksem بـ (bashteri, bakhod). Zwróć uwagę na liczby i targowanie się — to codzienność w Egipcie.", tenseNoteEn: "Present tense with the بـ prefix (bashteri, bakhod). Note the numbers and the bargaining — everyday life in Egypt.",
    sentences: [
      { ar: "كل يوم جمعة بروح السوق.", arH: "كُلّ يوم جُمْعة بَروح السّوق.", ph: "koll yoom gom3a baruuH is-suu2.", pl: "W każdy piątek chodzę na targ." , en: "Every Friday I go to the market." },
      { ar: "السوق زحمة، بس الخضار طازة.", arH: "السّوق زَحْمة، بَسّ الخُضار طازة.", ph: "is-suu2 zaHma, bass il-khoDaar Taaza.", pl: "Targ jest zatłoczony, ale warzywa są świeże." , en: "The market is crowded, but the vegetables are fresh." },
      { ar: "بشتري طماطم وبصل وخيار.", arH: "بَشْتِري طَماطِم وِبَصَل وِخِيار.", ph: "bashteri TamaaTem we baSal we khiyaar.", pl: "Kupuję pomidory, cebulę i ogórki." , en: "I buy tomatoes, onions, and cucumbers." },
      { ar: "البياع بيقول عشرين جنيه، وأنا بقول خمستاشر.", arH: "البَيّاع بِيْقول عِشْرين جِنيه، وِأنا بَقول خَمَسْتاشَر.", ph: "il-bayyaa3 biy2uul 3eshriin gineeh, we ana ba2uul khamastaashar.", pl: "Sprzedawca mówi dwadzieścia funtów, a ja mówię piętnaście." , en: "The seller says twenty pounds, and I say fifteen." },
      { ar: "في الآخر بندفع تمنتاشر — كله تمام.", arH: "في الآخِر بْنِدْفَع تَمَنْتاشَر — كُلُّه تَمام.", ph: "fil-aakher bnedfa3 tamantaashar — kollo tamaam.", pl: "W końcu płacimy osiemnaście — wszystko w porządku." , en: "In the end we pay eighteen — all good." },
    ],
    questions: [
      { q: "Kiedy autor chodzi na targ?", options: ["W piątek", "W sobotę", "Codziennie"], correct: 0, qEn: "When does the author go to the market?", optionsEn: ["On Friday", "On Saturday", "Every day"] },
      { q: "Co kupuje?", options: ["Mięso", "Warzywa", "Owoce"], correct: 1, qEn: "What does he buy?", optionsEn: ["Meat", "Vegetables", "Fruit"] },
      { q: "Ile ostatecznie płaci?", options: ["Piętnaście", "Osiemnaście", "Dwadzieścia"], correct: 1, qEn: "How much does he pay in the end?", optionsEn: ["Fifteen", "Eighteen", "Twenty"] },
    ],
  },
  {
    title: "Zgubiłem klucze", titleEn: "I lost my keys",
    emoji: "🔑",
    level: "średni", levelEn: "medium",
    context: "Mała katastrofa dnia codziennego — czas przeszły.", contextEn: "A little everyday disaster — past tense.",
    tenseNote: "Czas przeszły (Dayya3t, dawwart, la2eet) + konstrukcje niepewności (mish 3aaref). Typowa opowieść o kłopocie.", tenseNoteEn: "Past tense (Dayya3t, dawwart, la2eet) + expressions of uncertainty (mish 3aaref). A typical tale of trouble.",
    sentences: [
      { ar: "إمبارح ضيعت مفاتيحي.", arH: "إمْبارِح ضَيَّعْت مَفاتيحي.", ph: "embaareH Dayya3t mafatiiHi.", pl: "Wczoraj zgubiłem klucze." , en: "Yesterday I lost my keys." },
      { ar: "دورت في كل حتة: في الشنطة، تحت الكرسي، جوه العربية.", arH: "دَوَّرْت في كُلّ حِتّة: في الشَّنْطة، تَحْت الكُرْسي، جُوّه العَرَبِيّة.", ph: "dawwart fi koll Hetta: fish-shanTa, taHt il-korsi, gowwa il-3arabeyya.", pl: "Szukałem wszędzie: w torbie, pod krzesłem, w samochodzie." , en: "I looked everywhere: in the bag, under the chair, in the car." },
      { ar: "مش عارف راحوا فين.", arH: "مِش عارِف راحوا فين.", ph: "mish 3aaref raaHu feen.", pl: "Nie wiem, gdzie się podziały." , en: "I don't know where they went." },
      { ar: "البواب ساعدني وفتحلي الباب.", arH: "البَوّاب ساعِدْني وِفَتَحْلي الباب.", ph: "il-bawwaab sa3edni we fataHli il-baab.", pl: "Dozorca pomógł mi i otworzył drzwi." , en: "The doorman helped me and opened the door." },
      { ar: "وبعدين لقيتهم في جيب الجاكيت!", arH: "وِبَعْدين لَقيتْهُم في جيب الجاكيت!", ph: "we ba3deen la2ethom fi geeb iz-zhakeet!", pl: "A potem znalazłem je w kieszeni kurtki!" , en: "And then I found them in my jacket pocket!" },
      { ar: "ضحكنا كتير على الموضوع ده.", arH: "ضِحِكْنا كِتير عَلى المَوْضوع ده.", ph: "DeHekna ketiir 3ala il-mawDuu3 da.", pl: "Dużo się śmialiśmy z tej sprawy." , en: "We laughed a lot about it." },
    ],
    questions: [
      { q: "Co zgubił autor?", options: ["Telefon", "Klucze", "Portfel"], correct: 1, qEn: "What did the author lose?", optionsEn: ["Phone", "The keys", "Wallet"] },
      { q: "Kto mu pomógł?", options: ["Sąsiad", "Dozorca", "Żona"], correct: 1, qEn: "Who helped him?", optionsEn: ["A neighbor", "The doorman", "His wife"] },
      { q: "Gdzie ostatecznie były klucze?", options: ["W torbie", "W samochodzie", "W kieszeni kurtki"], correct: 2, qEn: "Where were the keys in the end?", optionsEn: ["In the bag", "In the car", "In the jacket pocket"] },
    ],
  },
  {
    title: "Plany na przyszłość", titleEn: "Plans for the future",
    emoji: "🔮",
    level: "trudny", levelEn: "hard",
    context: "Rozmyślania o tym, co dalej — czas przyszły i konstrukcje niepewności.", contextEn: "Musings about what's next — future tense and expressions of uncertainty.",
    tenseNote: "Czas przyszły (ha- + czasownik) połączony z konstrukcjami niepewności (yemken, mish 3aaref law, atmanna enn). Zaawansowany, ale bardzo przydatny.", tenseNoteEn: "Future tense (ha- + verb) combined with expressions of uncertainty (yemken, mish 3aaref law, atmanna enn). Advanced, but very useful.",
    sentences: [
      { ar: "السنة الجاية عايز أتعلم عربي أحسن.", arH: "السَّنة الجايّة عايِز أتْعَلِّم عَرَبي أحْسَن.", ph: "is-sana ig-gaaya 3aayez at3allem 3arabi aHsan.", pl: "W przyszłym roku chcę nauczyć się arabskiego lepiej." , en: "Next year I want to learn Arabic better." },
      { ar: "يمكن أروح مصر شهرين، ويمكن أكتر.", arH: "يِمْكِن أروح مَصْر شَهْرين، وِيِمْكِن أكْتَر.", ph: "yemken aruuH maSr shahreen, we yemken aktar.", pl: "Może pojadę do Egiptu na dwa miesiące, a może dłużej." , en: "Maybe I'll go to Egypt for two months, maybe longer." },
      { ar: "مش عارف لو هينفع مع الشغل ولا لأ.", arH: "مِش عارِف لو هَيِنْفَع مَع الشُّغْل وَلا لأ.", ph: "mish 3aaref law hayenfa3 ma3 ish-shughl walla la2.", pl: "Nie wiem, czy da się to pogodzić z pracą, czy nie." , en: "I don't know whether it can be reconciled with work or not." },
      { ar: "على حسب الظروف.", arH: "عَلى حَسَب الظُّروف.", ph: "3ala Hasab iZ-Zuruuf.", pl: "Zależy od okoliczności." , en: "It depends on the circumstances." },
      { ar: "بس أتمنى إني أتكلم زي المصريين.", arH: "بَسّ أتْمَنّى إنّي أتْكَلِّم زَيّ المَصْرِيّين.", ph: "bass atmanna enni atkallem zayy il-maSreyyiin.", pl: "Ale mam nadzieję, że będę mówić jak Egipcjanie." , en: "But I hope I'll speak like the Egyptians." },
      { ar: "الحلم ده مش سهل، بس مش مستحيل.", arH: "الحِلْم ده مِش سَهْل، بَسّ مِش مُسْتَحيل.", ph: "il-Helm da mish sahl, bass mish mostaHiil.", pl: "To marzenie nie jest łatwe, ale nie jest niemożliwe." , en: "This dream isn't easy, but it isn't impossible." },
    ],
    questions: [
      { q: "Czego chce autor w przyszłym roku?", options: ["Zmienić pracę", "Nauczyć się arabskiego lepiej", "Kupić dom"], correct: 1, qEn: "What does the author want next year?", optionsEn: ["Change jobs", "To learn Arabic better", "Buy a house"] },
      { q: "Ile czasu może spędzić w Egipcie?", options: ["Tydzień", "Dwa miesiące lub dłużej", "Rok"], correct: 1, qEn: "How much time might he spend in Egypt?", optionsEn: ["A week", "Two months or longer", "A year"] },
      { q: "Od czego to zależy?", options: ["Od okoliczności", "Od pieniędzy", "Od pogody"], correct: 0, qEn: "What does it depend on?", optionsEn: ["On circumstances", "On money", "On the weather"] },
      { q: "Jak autor ocenia swoje marzenie?", options: ["Niemożliwe", "Łatwe", "Trudne, ale możliwe"], correct: 2, qEn: "How does the author view his dream?", optionsEn: ["Impossible", "Easy", "Hard", "but possible"] },
    ],
  },
];

// ---------- Mini-dialogi ----------
// Scenki osadzone w słownictwie aplikacji. speaker: "a"/"b" (dwie strony rozmowy).
const DIALOGUES = [
  {
    title: "Na targu", titleEn: "At the market",
    emoji: "🛒",
    context: "Kupujesz owoce i się targujesz.", contextEn: "You buy fruit and haggle.",
    lines: [
      { s: "a", ar: "الكيلو بكام؟", arH: "الكِيلو بِكامْ؟", ph: "il-kiilo bikaam?", pl: "Ile za kilogram?" , en: "How much per kilo?" },
      { s: "b", ar: "بعشرين جنيه.", arH: "بِعِشْرين جِنيه.", ph: "bi3eshriin gineeh.", pl: "Dwadzieścia funtów." , en: "Twenty pounds." },
      { s: "a", ar: "غالي شوية. خمستاشر؟", arH: "غالي شْوَيّة. خَمَسْتاشَر؟", ph: "8aali shwayya. khamastaashar?", pl: "Trochę drogo. Piętnaście?" , en: "A bit expensive. Fifteen?" },
      { s: "b", ar: "ماشي، عشانك.", arH: "ماشي، عَشانَك.", ph: "maashi, 3ashaanak.", pl: "Dobra, dla ciebie." , en: "Okay, for you." },
      { s: "a", ar: "تسلم، إديني اتنين كيلو.", arH: "تِسْلَم، إدّيني اتْنين كِيلو.", ph: "tislam, eddiini etneen kiilo.", pl: "Dzięki, daj mi dwa kilo." , en: "Thanks, give me two kilos." },
    ],
  },
  {
    title: "W taksówce", titleEn: "In a taxi",
    emoji: "🚕",
    context: "Wsiadasz i podajesz cel.", contextEn: "You get in and give your destination.",
    lines: [
      { s: "a", ar: "على وسط البلد لو سمحت.", arH: "عَلى وِسْط البَلَد لو سَمَحْت.", ph: "3ala wist il-balad law samaHt.", pl: "Do centrum, proszę." , en: "Downtown, please." },
      { s: "b", ar: "اتفضل. الطريق زحمة دلوقتي.", arH: "اتْفَضَّل. الطَّريق زَحْمة دِلْوَقْتي.", ph: "etfaDDal. iT-Tarii2 zaHma dilwa2ti.", pl: "Proszę. Na drodze są teraz korki." , en: "Sure. The road is busy right now." },
      { s: "a", ar: "مفيش مشكلة، مش مستعجل.", arH: "مَفيش مُشْكِلة، مِش مُسْتَعْجِل.", ph: "mafiish moshkila, mish mesta3gel.", pl: "Nie ma problemu, nie spieszę się." , en: "No problem, I'm not in a hurry." },
      { s: "b", ar: "وصلنا. بعشرة جنيه.", arH: "وِصِلْنا. بِعَشَرة جِنيه.", ph: "wesilna. bi3ashara gineeh.", pl: "Dojechaliśmy. Dziesięć funtów." , en: "We're here. Ten pounds." },
      { s: "a", ar: "اتفضل، تسلم.", arH: "اتْفَضَّل، تِسْلَم.", ph: "etfaDDal, tislam.", pl: "Proszę, dziękuję." , en: "Here you go, thanks." },
    ],
  },
  {
    title: "W kawiarni", titleEn: "At the café",
    emoji: "☕",
    context: "Zamawiasz coś do picia.", contextEn: "You order something to drink.",
    lines: [
      { s: "a", ar: "عايز أشرب إيه؟", arH: "عايِز أشْرَب إيه؟", ph: "3aayez ashrab eeh?", pl: "Na co masz ochotę? (dosł. co chcesz pić)" , en: "What would you like? (lit. what do you want to drink)" },
      { s: "b", ar: "قهوة من غير سكر، لو سمحت.", arH: "قَهْوة مِن غير سُكَّر، لو سَمَحْت.", ph: "ahwa min 8eer sokkar, law samaHt.", pl: "Kawę bez cukru, proszę." , en: "Coffee without sugar, please." },
      { s: "a", ar: "حاضر. حاجة تانية؟", arH: "حاضِر. حاجة تانْية؟", ph: "HaaDer. Haaga tanya?", pl: "Już się robi. Coś jeszcze?" , en: "Coming right up. Anything else?" },
      { s: "b", ar: "لأ، كده تمام. شكراً.", arH: "لأ، كِده تَمام. شُكْراً.", ph: "la2, keda tamaam. shukran.", pl: "Nie, to wszystko. Dziękuję." , en: "No, that's all. Thank you." },
    ],
  },
  {
    title: "Spotkanie znajomego", titleEn: "Meeting a friend",
    emoji: "👋",
    context: "Wpadasz na przyjaciela na ulicy.", contextEn: "You run into a friend on the street.",
    lines: [
      { s: "a", ar: "إزيك يا صاحبي! عامل إيه؟", arH: "إزَّيَّك يا صاحْبي! عامِل إيه؟", ph: "ezzayyak ya SaHbi! 3aamel eeh?", pl: "Cześć, przyjacielu! Jak się masz?" , en: "Hi, my friend! How are you?" },
      { s: "b", ar: "الحمد لله، كله تمام. وانت؟", arH: "الحَمْدُ لله، كُلُّه تَمام. وِإنْت؟", ph: "il-Hamdu lillah, kollo tamaam. wenta?", pl: "Dzięki Bogu, wszystko dobrze. A ty?" , en: "Thank God, all good. And you?" },
      { s: "a", ar: "الحمد لله. وحشتني!", arH: "الحَمْدُ لله. وَحَشْتِني!", ph: "il-Hamdu lillah. waHashtini!", pl: "Dzięki Bogu. Tęskniłem za tobą!" , en: "Thank God. I missed you!" },
      { s: "b", ar: "وانت كمان. نشرب قهوة؟", arH: "وِإنْت كَمان. نِشْرَب قَهْوة؟", ph: "wenta kamaan. neshrab ahwa?", pl: "Ja też. Napijemy się kawy?" , en: "Me too. Shall we have a coffee?" },
      { s: "a", ar: "يلا بينا!", arH: "يَلّا بينا!", ph: "yalla biina!", pl: "Chodźmy!" , en: "Let's go!" },
    ],
  },
  {
    title: "W hotelu", titleEn: "At the hotel",
    emoji: "🏨",
    context: "Meldujesz się w recepcji.", contextEn: "You check in at the reception.",
    lines: [
      { s: "a", ar: "عندكو أوضة فاضية؟", arH: "عَنْدُكو أوضة فاضْية؟", ph: "3andoku 2uDa faDya?", pl: "Macie wolny pokój?" , en: "Do you have a room available?" },
      { s: "b", ar: "أيوه. لكام ليلة؟", arH: "أيْوه. لِكامْ لَيْلة؟", ph: "aywa. li-kaam leela?", pl: "Tak. Na ile nocy?" , en: "Yes. For how many nights?" },
      { s: "a", ar: "تلات ليالي.", arH: "تَلات لَيالي.", ph: "talat layaali.", pl: "Trzy noce." , en: "Three nights." },
      { s: "b", ar: "تمام. الأوضة في الدور التاني.", arH: "تَمام. الأوضة في الدَّوْر التّاني.", ph: "tamaam. il-2uDa fid-door it-taani.", pl: "W porządku. Pokój jest na drugim piętrze." , en: "Alright. The room is on the second floor." },
      { s: "a", ar: "شكراً، ربنا يخليك.", arH: "شُكْراً، رَبِّنا يِخَلّيك.", ph: "shukran, rabbena yekhalliik.", pl: "Dziękuję, niech ci Bóg wynagrodzi." , en: "Thank you, may God reward you." },
    ],
  },
  {
    title: "Pytanie o drogę", titleEn: "Asking directions",
    emoji: "🧭",
    context: "Zgubiłeś się i pytasz przechodnia.", contextEn: "You're lost and ask a passer-by.",
    lines: [
      { s: "a", ar: "لو سمحت، المحطة فين؟", arH: "لو سَمَحْت، المَحَطّة فين؟", ph: "law samaHt, il-maHaTTa feen?", pl: "Przepraszam, gdzie jest stacja?" , en: "Excuse me, where's the station?" },
      { s: "b", ar: "امشي على طول، وبعدين شمال.", arH: "امْشي عَلى طُول، وِبَعْدين شِمال.", ph: "emshi 3ala Tuul, wi ba3deen shemaal.", pl: "Idź prosto, a potem w lewo." , en: "Go straight, then left." },
      { s: "a", ar: "بعيدة من هنا؟", arH: "بِعيدة مِن هِنا؟", ph: "be3iida min hena?", pl: "Daleko stąd?" , en: "Far from here?" },
      { s: "b", ar: "لأ، قريبة. خمس دقايق.", arH: "لأ، قُرَيِّبة. خَمَس دَقايِق.", ph: "la2, 2urayyiba. khamas da2aaye2.", pl: "Nie, blisko. Pięć minut." , en: "No, close. Five minutes." },
      { s: "a", ar: "متشكر جداً.", arH: "مُتْشَكِّر جِدّاً.", ph: "moteshakker gedan.", pl: "Bardzo dziękuję." , en: "Thank you very much." },
    ],
  },
  {
    title: "Spotkanie i winda", titleEn: "Meeting & the elevator",
    emoji: "🛗",
    context: "Krótkie powitanie, pytanie o godzinę, potem o windę w budynku. (z Twoich notatek)", contextEn: "A short greeting, asking the time, then about the building's elevator. (from your notes)",
    lines: [
      { s: "a", ar: "أهلاً", arH: "أهْلاً", ph: "ahlan", pl: "Cześć." , en: "Hi." },
      { s: "b", ar: "أهلاً", arH: "أهْلاً", ph: "ahlan", pl: "Cześć." , en: "Hi." },
      { s: "a", ar: "إزيّك؟", arH: "إزَّيِّك؟", ph: "ezzayyek?", pl: "Jak się masz? (do kobiety)" , en: "How are you? (to a woman)" },
      { s: "b", ar: "أنا كويسة، شكراً، وإنت؟", arH: "أنا كْوَيِّسة، شُكْراً، وِإنْت؟", ph: "ana kwayyesa, shukran, wenta?", pl: "Dobrze, dziękuję, a ty?" , en: "Fine, thanks, and you?" },
      { s: "a", ar: "مفيش مشكلة، شكراً", arH: "مَفيش مُشْكِلة، شُكْراً", ph: "mafiish moshkila, shukran.", pl: "Wszystko w porządku, dziękuję." , en: "Everything's fine, thanks." },
      { s: "b", ar: "الساعة كام؟", arH: "السّاعة كامْ؟", ph: "is-saa3a kaam?", pl: "Która godzina?" , en: "What time is it?" },
      { s: "a", ar: "واحدة ونص", arH: "واحْدة وِنُصّ", ph: "waHda wi noSS.", pl: "Wpół do drugiej." , en: "Half past one." },
      { s: "b", ar: "فين الأصانصير؟", arH: "فين الأصانْصير؟", ph: "feen il-2aSanSeer?", pl: "Gdzie jest winda?" , en: "Where's the elevator?" },
      { s: "a", ar: "قريّب من الحمّام، هناك عند المدخل", arH: "قُرَيِّب مِن الحَمّام، هِناك عَنْد المَدْخَل", ph: "2urayyib min il-Hammaam, henaak 3and il-madkhal.", pl: "Blisko łazienki, tam przy wejściu." , en: "Near the bathroom, over by the entrance." },
      { s: "b", ar: "أوه، فهمت… متشكّرة جداً", arH: "أوه، فِهِمْت… مُتْشَكِّرة جِدّاً", ph: "oh, fehemt… motshakkera gedan.", pl: "Aha, rozumiem… bardzo dziękuję." , en: "Ah, I see… thank you very much." },
      { s: "a", ar: "العفو، مع السلامة", arH: "العَفْو، مَع السَّلامة", ph: "il-3afw, ma3 is-salaama.", pl: "Nie ma za co, do widzenia." , en: "You're welcome, goodbye." },
    ],
  },
  {
    title: "Rozmowa z obcokrajowcem", titleEn: "Talking with a foreigner",
    emoji: "🌍",
    context: "Small talk: skąd jesteś, gdzie mieszkasz, potem kupno wody i pytanie o kawiarnię. (z Twoich notatek)", contextEn: "Small talk: where you're from, where you live, then buying water and asking about a café. (from your notes)",
    lines: [
      { s: "a", ar: "مساء الخير", arH: "مَساء الخير", ph: "misaa2 il-kheer.", pl: "Dobry wieczór." , en: "Good evening." },
      { s: "b", ar: "مساء النّور", arH: "مَساء النّور", ph: "misaa2 in-nuur.", pl: "Dobry wieczór (odpowiedź)." , en: "Good evening (reply)." },
      { s: "a", ar: "إنت بتتكلّم انجليزي؟", arH: "إنْت بِتِتْكَلِّم انْجِليزي؟", ph: "enta betetkallem engliizi?", pl: "Mówisz po angielsku?" , en: "Do you speak English?" },
      { s: "b", ar: "أيوا، بتكلّم انجليزي كويّس ومصري شويّة", arH: "أيْوا، بَتْكَلِّم انْجِليزي كْوَيِّس وِمَصْري شْوَيّة", ph: "aywa, batkallem engliizi kwayyes wi maSri shwayya.", pl: "Tak, mówię dobrze po angielsku i trochę po egipsku." , en: "Yes, I speak English well and a little Egyptian." },
      { s: "a", ar: "إنت منين؟", arH: "إنْت مِنين؟", ph: "enta mneen?", pl: "Skąd jesteś?" , en: "Where are you from?" },
      { s: "b", ar: "أنا من بولاندا", arH: "أنا مِن بولانْدا", ph: "ana min bolanda.", pl: "Jestem z Polski." , en: "I'm from Poland." },
      { s: "a", ar: "أحسن ناس! إنت ساكن فين؟", arH: "أحْسَن ناس! إنْت ساكِن فين؟", ph: "aHsan naas! enta saaken feen?", pl: "Najlepsi ludzie! Gdzie mieszkasz?" , en: "The best people! Where do you live?" },
      { s: "b", ar: "أنا ساكن في المعادي", arH: "أنا ساكِن في المَعادي", ph: "ana saaken fil-ma3aadi.", pl: "Mieszkam w Maadi." , en: "I live in Maadi." },
      { s: "a", ar: "عايز حاجة؟", arH: "عايِز حاجة؟", ph: "3aayez Haaga?", pl: "Chcesz coś?" , en: "Do you want anything?" },
      { s: "b", ar: "عايز ميّة. بكام القزازة؟", arH: "عايِز مَيّة. بِكامْ القُزازة؟", ph: "3aayez mayya. bikaam il-2ezaaza?", pl: "Chcę wodę. Ile za butelkę?" , en: "I want water. How much for a bottle?" },
      { s: "a", ar: "الصغيّرة بخمسة جنيه والكبيرة بتمنية", arH: "الصُّغَيِّرة بِخَمْسة جِنيه وِالكِبيرة بِتَمَنْية", ph: "iS-So8ayyara bi-khamsa gineeh wil-kebiira bi-tamanya.", pl: "Mała za 5 funtów, duża za 8." , en: "Small for 5 pounds, large for 8." },
      { s: "b", ar: "إدّيني الكبيرة. عارف قهوة قريّبة من هنا؟", arH: "إدّيني الكِبيرة. عارِف قَهْوة قُرَيِّبة مِن هِنا؟", ph: "eddiini il-kebiira. 3aaref 2ahwa 2urayyiba min hena?", pl: "Daj mi dużą. Znasz kawiarnię blisko stąd?" , en: "Give me the large one. Do you know a café near here?" },
      { s: "a", ar: "أيوا، في قهوة في آخر الشارع ده", arH: "أيْوا، في قَهْوة في آخِر الشّارِع ده", ph: "aywa, fi 2ahwa fi aakher ish-shaare3 da.", pl: "Tak, jest kawiarnia na końcu tej ulicy." , en: "Yes, there's a café at the end of this street." },
      { s: "b", ar: "شكراً ليك، مع السلامة", arH: "شُكْراً ليك، مَع السَّلامة", ph: "shukran liik, ma3 is-salaama.", pl: "Dziękuję ci, do widzenia." , en: "Thank you, goodbye." },
    ],
  },
  {
    title: "Rozmowa o rodzinie", titleEn: "Talking about family",
    emoji: "👨‍👩‍👧",
    context: "Pytacie się nawzajem o rodzinę.", contextEn: "You ask each other about family.",
    lines: [
      { s: "a", ar: "إنت متجوز؟", arH: "إنْت مِتْجَوِّز؟", ph: "enta metgawwez?", pl: "Jesteś żonaty?" , en: "Are you married?" },
      { s: "b", ar: "أيوا، أنا متجوز. عندي بنت وابن", arH: "أيْوا، أنا مِتْجَوِّز. عَنْدي بِنْت وِابْن", ph: "aywa, ana metgawwez. 3andi bint we ebn.", pl: "Tak, jestem żonaty. Mam córkę i syna." , en: "Yes, I'm married. I have a daughter and a son." },
      { s: "a", ar: "حلو! ومراتك بتشتغل؟", arH: "حِلْو! وِمَراتَك بِتِشْتَغَل؟", ph: "Helw! we meraatak betishtaghal?", pl: "Miło! A twoja żona pracuje?" , en: "Nice! And does your wife work?" },
      { s: "b", ar: "أيوا. وإنت، عندك عيلة كبيرة؟", arH: "أيْوا. وِإنْت، عَنْدَك عيلة كِبيرة؟", ph: "aywa. wenta, 3andak 3eela kebiira?", pl: "Tak. A ty, masz dużą rodzinę?" , en: "Yes. And you, do you have a big family?" },
      { s: "a", ar: "عندي أخ وأخت. أبويا وأمي في المعادي", arH: "عَنْدي أخ وِأُخْت. أبويا وِأُمّي في المَعادي", ph: "3andi akh we okht. abuuya we ommi fil-ma3aadi.", pl: "Mam brata i siostrę. Rodzice są w Maadi." , en: "I have a brother and a sister. My parents are in Maadi." },
      { s: "b", ar: "ربنا يخليهم لك", arH: "رَبِّنا يِخَلّيهُم لَك", ph: "rabbena yekhalliihom lak.", pl: "Niech Bóg ich zachowa dla ciebie." , en: "May God keep them for you." },
    ],
  },
  {
    title: "Umawianie się", titleEn: "Making plans",
    emoji: "📅",
    context: "Ustalacie, kiedy się spotkać.", contextEn: "You arrange when to meet.",
    lines: [
      { s: "a", ar: "عايز تشرب قهوة بكرة؟", arH: "عايِز تِشْرَب قَهْوة بُكْرة؟", ph: "3aayez teshrab 2ahwa bukra?", pl: "Chcesz iść jutro na kawę?" , en: "Do you want to go for coffee tomorrow?" },
      { s: "b", ar: "أيوا، طبعاً. الساعة كام؟", arH: "أيْوا، طَبْعاً. السّاعة كامْ؟", ph: "aywa, Tab3an. is-saa3a kaam?", pl: "Tak, jasne. O której godzinie?" , en: "Yes, sure. What time?" },
      { s: "a", ar: "الساعة خمسة، كويس؟", arH: "السّاعة خَمْسة، كْوَيِّس؟", ph: "is-saa3a khamsa, kwayyes?", pl: "O piątej, dobrze?" , en: "At five, okay?" },
      { s: "b", ar: "ماشي. فين؟", arH: "ماشي. فين؟", ph: "maashi. feen?", pl: "Dobra. Gdzie?" , en: "Okay. Where?" },
      { s: "a", ar: "في القهوة اللي في وسط البلد", arH: "في القَهْوة اللي في وِسْط البَلَد", ph: "fil-2ahwa illi fi wist il-balad.", pl: "W kawiarni w centrum." , en: "At the café downtown." },
      { s: "b", ar: "تمام، أشوفك بكرة", arH: "تَمام، أشوفَك بُكْرة", ph: "tamaam, ashuufak bukra.", pl: "Świetnie, do zobaczenia jutro." , en: "Great, see you tomorrow." },
    ],
  },
  {
    title: "W restauracji", titleEn: "At the restaurant",
    emoji: "🍽️",
    context: "Zamawiasz jedzenie i picie.", contextEn: "You order food and drink.",
    lines: [
      { s: "a", ar: "المنيو من فضلك", arH: "المِنْيو مِن فَضْلَك", ph: "il-menyu min faDlak.", pl: "Poproszę menu." , en: "The menu, please." },
      { s: "b", ar: "اتفضل. عايز تاكل إيه؟", arH: "اتْفَضَّل. عايِز تاكُل إيه؟", ph: "etfaDDal. 3aayez taakol eeh?", pl: "Proszę. Co chcesz zjeść?" , en: "Here you go. What would you like to eat?" },
      { s: "a", ar: "عايز كشري ومية", arH: "عايِز كُشَري وِمَيّة", ph: "3aayez koshari we mayya.", pl: "Chcę koszari i wodę." , en: "I want koshari and water." },
      { s: "b", ar: "تحب تشرب حاجة تانية؟", arH: "تِحِبّ تِشْرَب حاجة تانْية؟", ph: "teHebb teshrab Haaga tanya?", pl: "Chcesz się jeszcze czegoś napić?" , en: "Would you like anything else to drink?" },
      { s: "a", ar: "أيوا، قهوة بعد الأكل", arH: "أيْوا، قَهْوة بَعْد الأكْل", ph: "aywa, 2ahwa ba3d il-akl.", pl: "Tak, kawę po jedzeniu." , en: "Yes, coffee after the meal." },
      { s: "b", ar: "حاضر، دقيقة", arH: "حاضِر، دِقيقة", ph: "HaaDer, di2ii2a.", pl: "Już się robi, chwileczkę." , en: "Coming right up, one moment." },
      { s: "a", ar: "الحساب لو سمحت", arH: "الحِساب لو سَمَحْت", ph: "il-Hisaab law samaHt.", pl: "Poproszę rachunek." , en: "The bill, please." },
    ],
  },
  {
    title: "U lekarza", titleEn: "At the doctor's",
    emoji: "🩺",
    context: "Nie czujesz się dobrze i idziesz do lekarza.", contextEn: "You don't feel well and go to the doctor.",
    lines: [
      { s: "a", ar: "أنا تعبان، راسي بتوجعني", arH: "أنا تَعْبان، راسي بِتِوْجَعْني", ph: "ana ta3baan, raasi betewga3ni.", pl: "Źle się czuję, boli mnie głowa." , en: "I don't feel well, my head hurts." },
      { s: "b", ar: "من إمتى؟", arH: "مِن إمْتى؟", ph: "min emta?", pl: "Od kiedy?" , en: "Since when?" },
      { s: "a", ar: "من الصبح. وعندي سخونية", arH: "مِن الصُّبْح. وِعَنْدي سُخونِيّة", ph: "min iS-SobH. we 3andi sokhoneyya.", pl: "Od rana. I mam gorączkę." , en: "Since this morning. And I have a fever." },
      { s: "b", ar: "معلش، عندك برد بسيط", arH: "مَعْلِش، عَنْدَك بَرْد بَسيط", ph: "ma3lesh, 3andak bard basiiT.", pl: "Nic groźnego, masz lekkie przeziębienie." , en: "Nothing serious, you have a mild cold." },
      { s: "a", ar: "محتاج دوا؟", arH: "مِحْتاج دَوا؟", ph: "meHtaag dawa?", pl: "Potrzebuję lekarstwa?" , en: "Do I need medicine?" },
      { s: "b", ar: "أيوا، من الصيدلية. سلامتك", arH: "أيْوا، مِن الصَّيْدَلِيّة. سَلامْتَك", ph: "aywa, min iS-Saydaleyya. salamtak.", pl: "Tak, z apteki. Zdrowia!" , en: "Yes, from the pharmacy. Get well!" },
    ],
  },
  {
    title: "Rozmowa o pogodzie", titleEn: "Talking about the weather",
    emoji: "🌤️",
    context: "Komentujecie pogodę.", contextEn: "You comment on the weather.",
    lines: [
      { s: "a", ar: "الجو حر أوي النهارده", arH: "الجَوّ حَرّ أوي النَّهارْده", ph: "il-gaww Harr awi innaharda.", pl: "Dziś jest bardzo gorąco." , en: "It's very hot today." },
      { s: "b", ar: "أيوا، الصيف في مصر حر", arH: "أيْوا، الصِّيف في مَصْر حَرّ", ph: "aywa, iS-Seef fi maSr Harr.", pl: "Tak, lato w Egipcie jest upalne." , en: "Yes, summer in Egypt is scorching." },
      { s: "a", ar: "بكرة هيبقى إيه؟", arH: "بُكْرة هَيِبْقى إيه؟", ph: "bukra hayeb2a eeh?", pl: "Jaka będzie jutro?" , en: "What will it be like tomorrow?" },
      { s: "b", ar: "قالوا هيبقى في هوا", arH: "قالوا هَيِبْقى في هَوا", ph: "2aalu hayeb2a fi hawa.", pl: "Mówili, że będzie wietrznie." , en: "They said it'll be windy." },
      { s: "a", ar: "الحمد لله، أحسن من الحر", arH: "الحَمْدُ لله، أحْسَن مِن الحَرّ", ph: "il-Hamdulillah, aHsan min il-Harr.", pl: "Dzięki Bogu, lepsze niż upał." , en: "Thank God, better than the heat." },
    ],
  },
  {
    title: "Poranek w domu", titleEn: "Morning at home",
    emoji: "☀️",
    context: "Zwykły poranek, pytania o plany.", contextEn: "An ordinary morning, questions about plans.",
    lines: [
      { s: "a", ar: "صباح الخير، نمت كويس؟", arH: "صَباح الخير، نِمْت كْوَيِّس؟", ph: "SabaaH il-kheer, nemt kwayyes?", pl: "Dzień dobry, dobrze spałeś?" , en: "Good morning, did you sleep well?" },
      { s: "b", ar: "صباح النور، أيوا الحمد لله", arH: "صَباح النّور، أيْوا الحَمْدُ لله", ph: "SabaaH in-nuur, aywa il-Hamdulillah.", pl: "Dzień dobry, tak, dzięki Bogu." , en: "Good morning, yes, thank God." },
      { s: "a", ar: "عايز تفطر إيه؟", arH: "عايِز تِفْطَر إيه؟", ph: "3aayez tefTar eeh?", pl: "Co chcesz na śniadanie?" , en: "What do you want for breakfast?" },
      { s: "b", ar: "عيش وجبنة وشاي", arH: "عيش وِجِبْنة وِشاي", ph: "3eesh we gebna we shaay.", pl: "Chleb, ser i herbatę." , en: "Bread, cheese, and tea." },
      { s: "a", ar: "وبعدين هتعمل إيه؟", arH: "وِبَعْدين هَتِعْمِل إيه؟", ph: "we ba3deen hate3mel eeh?", pl: "A potem co robisz?" , en: "And then what are you doing?" },
      { s: "b", ar: "هروح الشغل الساعة تسعة", arH: "هَروح الشُّغْل السّاعة تِسْعة", ph: "haruuH ish-shughl is-saa3a tes3a.", pl: "Idę do pracy o dziewiątej." , en: "I'm going to work at nine." },
    ],
  },
  {
    title: "Poznajmy się", titleEn: "Let's get acquainted",
    emoji: "🙋",
    context: "Ktoś pyta Grzegorza, skąd jest i czym się zajmuje.", contextEn: "Someone asks Grzegorz where he's from and what he does.",
    lines: [
      { s: "a", ar: "إنت منين؟", arH: "إنْت مِنين؟", ph: "enta mneen?", pl: "Skąd jesteś?" , en: "Where are you from?" },
      { s: "b", ar: "أنا من بولندا، ساكن في كراكوف.", arH: "أنا مِن بولَنْدا، ساكِن في كْراكوف.", ph: "ana min bolanda, saaken fi Krakow.", pl: "Jestem z Polski, mieszkam w Krakowie." , en: "I'm from Poland, I live in Krakow." },
      { s: "a", ar: "بتشتغل إيه؟", arH: "بِتِشْتَغَل إيه؟", ph: "betishtaghal eeh?", pl: "Czym się zajmujesz?" , en: "What do you do?" },
      { s: "b", ar: "أنا محامي وعندي شركة.", arH: "أنا مُحامي وِعَنْدي شِرْكة.", ph: "ana moHaami we 3andi sherka.", pl: "Jestem prawnikiem i mam firmę." , en: "I'm a lawyer and I have a company." },
      { s: "a", ar: "جميل! والشركة بتعمل إيه؟", arH: "جَميل! وِالشِّرْكة بِتِعْمِل إيه؟", ph: "gamiil! wish-sherka bte3mel eeh?", pl: "Świetnie! A czym zajmuje się firma?" , en: "Great! And what does the company do?" },
      { s: "b", ar: "بنقدم خدمات محاسبة.", arH: "بِنْقَدِّم خَدَمات مُحاسْبة.", ph: "beni2addem khadamaat moHasba.", pl: "Świadczymy usługi księgowe." , en: "We provide accounting services." },
    ],
  },
  {
    title: "Pytania o pracę", titleEn: "Questions about work",
    emoji: "💼",
    context: "Rozmowa o firmie Grzegorza i pracownikach.", contextEn: "A conversation about Grzegorz's company and employees.",
    lines: [
      { s: "a", ar: "عندك موظفين كتير؟", arH: "عَنْدَك مُوَظَّفين كِتير؟", ph: "3andak mowaZZafiin ketiir?", pl: "Masz dużo pracowników?" , en: "Do you have many employees?" },
      { s: "b", ar: "أيوا، عندي أربعين موظف.", arH: "أيْوا، عَنْدي أرْبِعين مُوَظَّف.", ph: "aywa, 3andi arba3iin mowaZZaf.", pl: "Tak, mam czterdziestu pracowników." , en: "Yes, I have forty employees." },
      { s: "a", ar: "ده شغل كبير! صعب؟", arH: "ده شُغْل كِبير! صَعْب؟", ph: "da shughl kebiir! Sa3b?", pl: "To duża praca! Trudna?" , en: "That's a big job! Is it hard?" },
      { s: "b", ar: "صعب شوية بس بحبه.", arH: "صَعْب شْوَيّة بَسّ بَحِبُّه.", ph: "Sa3b shwayya bass baHebbo.", pl: "Trochę trudna, ale ją lubię." , en: "A bit hard, but I like it." },
      { s: "a", ar: "إنت بتعمل إيه بالظبط؟", arH: "إنْت بِتِعْمِل إيه بِالظَّبْط؟", ph: "enta bte3mel eeh biZ-ZabT?", pl: "Co dokładnie robisz?" , en: "What exactly do you do?" },
      { s: "b", ar: "محامي ومستشار ضرايب.", arH: "مُحامي وِمُسْتَشار ضَرايِب.", ph: "moHaami we mostashaar Daraayeb.", pl: "Prawnik i doradca podatkowy." , en: "Lawyer and tax advisor." },
    ],
  },
  {
    title: "Rozmowa o żonie", titleEn: "Talking about my wife",
    emoji: "👩‍💼",
    context: "Ktoś pyta Grzegorza o żonę i plany.", contextEn: "Someone asks Grzegorz about his wife and plans.",
    lines: [
      { s: "a", ar: "مراتك بتشتغل إيه؟", arH: "مَراتَك بِتِشْتَغَل إيه؟", ph: "meraatak betishtaghal eeh?", pl: "Czym zajmuje się twoja żona?" , en: "What does your wife do?" },
      { s: "b", ar: "هي مهندسة معمارية.", arH: "هِيَّ مُهَنْدِسة مِعْمارِيّة.", ph: "heyya mohandesa me3maareyya.", pl: "Jest architektką." , en: "She's an architect." },
      { s: "a", ar: "بتشتغل فين؟", arH: "بِتِشْتَغَل فين؟", ph: "betishtaghal feen?", pl: "Gdzie pracuje?" , en: "Where does she work?" },
      { s: "b", ar: "في شركة بتشتغل في النمسا.", arH: "في شِرْكة بِتِشْتَغَل في النِّمْسا.", ph: "fi sherka betishtaghal fin-nemsa.", pl: "W firmie, która działa w Austrii." , en: "At a company that works in Austria." },
      { s: "a", ar: "عندكوا أولاد؟", arH: "عَنْدُكوا أوْلاد؟", ph: "3andoku awlaad?", pl: "Macie dzieci?" , en: "Do you have children?" },
      { s: "b", ar: "لسه، بس قريب هنجيب كلب!", arH: "لِسّه، بَسّ قُرَيِّب هَنْجيب كَلْب!", ph: "lessa, bass 2orayyeb hangiib kalb!", pl: "Jeszcze nie, ale wkrótce sprowadzimy psa!" , en: "Not yet, but we'll get a dog soon!" },
    ],
  },
  {
    title: "O nauce arabskiego", titleEn: "On learning Arabic",
    emoji: "📚",
    context: "Egipcjanin dziwi się, że Grzegorz mówi po arabsku.", contextEn: "An Egyptian is surprised that Grzegorz speaks Arabic.",
    lines: [
      { s: "a", ar: "إنت بتتكلم عربي كويس! بقالك قد إيه؟", arH: "إنْت بِتِتْكَلِّم عَرَبي كْوَيِّس! بَقالَك قَدّ إيه؟", ph: "enta betetkallem 3arabi kwayyes! ba2aalak 2add eeh?", pl: "Dobrze mówisz po arabsku! Od jak dawna?" , en: "You speak Arabic well! For how long?" },
      { s: "b", ar: "بقالي سنتين بتعلم.", arH: "بَقالي سَنْتين بَتْعَلِّم.", ph: "ba2aali santeen bat3allem.", pl: "Uczę się od dwóch lat." , en: "I've been learning for two years." },
      { s: "a", ar: "بتتعلم ليه؟ للشغل؟", arH: "بِتِتْعَلِّم ليه؟ لِلشُّغْل؟", ph: "betet3allem leeh? lish-shughl?", pl: "Dlaczego się uczysz? Do pracy?" , en: "Why are you learning? For work?" },
      { s: "b", ar: "لأ، كهواية بس. بحب اللغة.", arH: "لأ، كِهِوايَة بَسّ. بَحِبّ اللُّغة.", ph: "la2, ke-hewaaya bass. baHebb il-lo8a.", pl: "Nie, tylko jako hobby. Lubię ten język." , en: "No, just as a hobby. I like the language." },
      { s: "a", ar: "وبتتعلم إزاي؟", arH: "وِبِتِتْعَلِّم إزّاي؟", ph: "we betet3allem ezzaay?", pl: "A jak się uczysz?" , en: "And how do you learn?" },
      { s: "b", ar: "بآخد دروس أونلاين مع مدرسة سورية.", arH: "بآخُد دُروس أونْلايْن مَع مُدَرِّسة سورِيّة.", ph: "baakhod duruus onlaayn ma3 modarrsa soreyya.", pl: "Biorę lekcje online z syryjską nauczycielką." , en: "I take online lessons with a Syrian teacher." },
      { s: "a", ar: "تحفة! نفسك تزور مصر تاني؟", arH: "تُحْفة! نِفْسَك تِزور مَصْر تاني؟", ph: "toHfa! nefsak tezuur maSr taani?", pl: "Świetnie! Chciałbyś znów odwiedzić Egipt?" , en: "Great! Would you like to visit Egypt again?" },
      { s: "b", ar: "أكيد! رحت كذا مرة وحبيت البلد.", arH: "أكيد! رُحْت كَذا مَرّة وِحَبّيت البَلَد.", ph: "akiid! roHt kaza marra we Habbeet il-balad.", pl: "Jasne! Byłem kilka razy i pokochałem ten kraj." , en: "Sure! I've been a few times and I fell in love with the country." },
    ],
  },
  {
    title: "W taksówce", titleEn: "In a taxi",
    emoji: "🚕",
    context: "Podajesz cel i negocjujesz cenę.", contextEn: "You give your destination and negotiate the price.",
    lines: [
      { s: "a", ar: "على فين يا أستاذ؟", arH: "عَلى فين يا أُسْتاذ؟", ph: "3ala feen ya ostaaz?", pl: "Dokąd jedziemy?" , en: "Where to?" },
      { s: "b", ar: "على وسط البلد، لو سمحت.", arH: "عَلى وِسْط البَلَد، لو سَمَحْت.", ph: "3ala wisT il-balad, law samaHt.", pl: "Do centrum, proszę." , en: "Downtown, please." },
      { s: "a", ar: "خمسين جنيه.", arH: "خَمْسين جِنيه.", ph: "khamsiin gineeh.", pl: "Pięćdziesiąt funtów." , en: "Fifty pounds." },
      { s: "b", ar: "غالي شوية. أربعين؟", arH: "غالي شْوَيّة. أرْبِعين؟", ph: "8aali shwayya. arbe3iin?", pl: "Trochę drogo. Czterdzieści?" , en: "A bit expensive. Forty?" },
      { s: "a", ar: "ماشي، اركب.", arH: "ماشي، ارْكَب.", ph: "maashi, erkab.", pl: "Dobra, wsiadaj." , en: "Okay, get in." },
      { s: "b", ar: "لف يمين بعد الإشارة، بعدين على طول.", arH: "لِفّ يِمين بَعْد الإشارة، بَعْدين عَلى طُول.", ph: "leff yemiin ba3d il-eshaara, ba3deen 3ala Tuul.", pl: "Skręć w prawo za światłami, potem prosto." , en: "Turn right after the lights, then straight." },
      { s: "a", ar: "حاضر. وصلنا، اتفضل.", arH: "حاضِر. وِصِلْنا، اتْفَضَّل.", ph: "HaaDer. weSelna, etfaDDal.", pl: "Jasne. Dojechaliśmy, proszę." , en: "Sure. We're here, please." },
    ],
  },
  {
    title: "Szukam mieszkania", titleEn: "Looking for an apartment",
    emoji: "🏠",
    context: "Rozmowa o wynajmie mieszkania.", contextEn: "A conversation about renting an apartment.",
    lines: [
      { s: "a", ar: "بدور على شقة في الحتة دي.", arH: "بَدَوَّر عَلى شَقّة في الحِتّة دي.", ph: "badawwar 3ala sha22a fil-Hetta di.", pl: "Szukam mieszkania w tej okolicy." , en: "I'm looking for an apartment in this area." },
      { s: "b", ar: "عايز كام أوضة؟", arH: "عايِز كامْ أوضة؟", ph: "3aayez kaam ooDa?", pl: "Ile pokoi chcesz?" , en: "How many rooms do you want?" },
      { s: "a", ar: "تلات أوض، وقريبة من المترو.", arH: "تَلات أوَض، وِقُرَيِّبة مِن المِتْرو.", ph: "talat ooWaD, we 2orayyiba min il-metro.", pl: "Trzy pokoje, i blisko metra." , en: "Three rooms, and close to the metro." },
      { s: "b", ar: "عندي واحدة في الدور الخامس. بس الأسانسير بايظ.", arH: "عَنْدي واحْدة في الدَّوْر الخامِس. بَسّ الأسانْسير بايِظ.", ph: "3andi waHda fid-door il-khaames. bass il-asanseer baayeZ.", pl: "Mam jedno na piątym piętrze. Ale winda jest zepsuta." , en: "I have one on the fifth floor. But the elevator is broken." },
      { s: "a", ar: "الإيجار كام؟", arH: "الإيجار كامْ؟", ph: "il-igaar kaam?", pl: "Ile wynosi czynsz?" , en: "How much is the rent?" },
      { s: "b", ar: "خمس تلاف في الشهر.", arH: "خَمَس تَلاف في الشَّهْر.", ph: "khamas talaaf fish-shahr.", pl: "Pięć tysięcy miesięcznie." , en: "Five thousand a month." },
      { s: "a", ar: "ممكن أشوفها بكرة؟", arH: "مُمْكِن أشوفْها بُكْرة؟", ph: "momken ashufha bukra?", pl: "Mogę je zobaczyć jutro?" , en: "Can I see it tomorrow?" },
    ],
  },
  {
    title: "W kawiarni", titleEn: "At the café",
    emoji: "☕",
    context: "Zamawiasz i rozmawiasz w tradycyjnej kawiarni.", contextEn: "You order and chat in a traditional coffeehouse.",
    lines: [
      { s: "a", ar: "تشرب إيه؟", arH: "تِشْرَب إيه؟", ph: "teshrab eeh?", pl: "Co pijesz?" , en: "What are you drinking?" },
      { s: "b", ar: "قهوة مظبوط، من فضلك.", arH: "قَهْوة مَظْبوط، مِن فَضْلَك.", ph: "2ahwa maZbuuT, min faDlak.", pl: "Kawę średnio słodką, proszę." , en: "Medium-sweet coffee, please." },
      { s: "a", ar: "وأنا شاي بالنعناع.", arH: "وِأنا شاي بِالنِّعْناع.", ph: "we ana shaay bin-ne3naa3.", pl: "A ja herbatę z miętą." , en: "And I'll have tea with mint." },
      { s: "b", ar: "المكان ده حلو أوي.", arH: "المَكان ده حِلْو أوي.", ph: "il-makaan da Helw awi.", pl: "To miejsce jest bardzo miłe." , en: "This place is very nice." },
      { s: "a", ar: "أيوا، بقالي سنين بجي هنا.", arH: "أيْوا، بَقالي سِنين بَجي هِنا.", ph: "aywa, ba2aali siniin baagi hena.", pl: "Tak, od lat tu przychodzę." , en: "Yes, I've been coming here for years." },
      { s: "b", ar: "على فكرة، الحساب عليا النهارده.", arH: "عَلى فِكْرة، الحِساب عَلَيّا النَّهارْده.", ph: "3ala fekra, il-Hisaab 3alayya innaharda.", pl: "A propos, dziś ja płacę." , en: "By the way, I'm paying today." },
      { s: "a", ar: "لأ، ولا يهمك. أنا هدفع.", arH: "لأ، وَلا يْهِمَّك. أنا هَدْفَع.", ph: "la2, wala yhemmak. ana hadfa3.", pl: "Nie, nie ma sprawy. Ja zapłacę." , en: "No, no worries. I'll pay." },
    ],
  },
  {
    title: "Kupowanie ubrań", titleEn: "Buying clothes",
    emoji: "👕",
    context: "Przymierzasz i pytasz o rozmiar.", contextEn: "You try things on and ask about size.",
    lines: [
      { s: "a", ar: "عايز قميص أزرق.", arH: "عايِز قَميص أزْرَق.", ph: "3aayez 2amiiS azra2.", pl: "Chcę niebieską koszulę." , en: "I want a blue shirt." },
      { s: "b", ar: "مقاسك كام؟", arH: "مَقاسَك كامْ؟", ph: "ma2aasak kaam?", pl: "Jaki masz rozmiar?" , en: "What's your size?" },
      { s: "a", ar: "مش عارف بالظبط. ممكن أقيس؟", arH: "مِش عارِف بِالظَّبْط. مُمْكِن أقيس؟", ph: "mish 3aaref biZ-ZabT. momken a2iis?", pl: "Nie wiem dokładnie. Mogę przymierzyć?" , en: "I don't know exactly. Can I try it on?" },
      { s: "b", ar: "أكيد، اتفضل. الأوضة هناك.", arH: "أكيد، اتْفَضَّل. الأوضة هِناك.", ph: "akiid, etfaDDal. il-ooDa henaak.", pl: "Jasne, proszę. Przymierzalnia jest tam." , en: "Sure, please. The fitting room is over there." },
      { s: "a", ar: "ده صغير شوية. عندك أكبر؟", arH: "ده صُغَيَّر شْوَيّة. عَنْدَك أكْبَر؟", ph: "da So8ayyar shwayya. 3andak akbar?", pl: "Ten jest trochę mały. Masz większy?" , en: "This one is a bit small. Do you have a bigger one?" },
      { s: "b", ar: "اتفضل، جرب ده.", arH: "اتْفَضَّل، جَرَّب ده.", ph: "etfaDDal, garrab da.", pl: "Proszę, przymierz ten." , en: "Here, try this one." },
      { s: "a", ar: "ده مظبوط. بكام؟", arH: "ده مَظْبوط. بِكامْ؟", ph: "da maZbuuT. bikaam?", pl: "Ten pasuje. Ile kosztuje?" , en: "This one fits. How much is it?" },
    ],
  },
];

// ---------- Lekcje: dopasowanie słówek z bazy do dialogu ----------
// Normalizuje arabski: usuwa diakrytyki, ujednolica warianty liter, tnie interpunkcję.
function normalizeArabic(s) {
  return (s || "")
    .replace(/[\u064B-\u0652\u0670]/g, "") // harakat (diakrytyki)
    .replace(/\u0640/g, "") // tatweel (wydłużenie)
    .replace(/[\u0622\u0623\u0625\u0671]/g, "\u0627") // آ أ إ ٱ → ا
    .replace(/\u0629/g, "\u0647") // ة → ه (ta marbuta bywa pisana jako ha)
    .replace(/\u0649/g, "\u064A") // ى → ي (alef maksura)
    .replace(/[؟،.!?\u061F\u060C]/g, " ") // interpunkcja → spacja
    .replace(/\s+/g, " ")
    .trim();
}

// Rozbija tekst na znormalizowane tokeny, zdejmując pospolite przedrostki
// (ال rodzajnik, بـ/لـ/وـ/فـ przyimki i spójniki doklejone do słowa).
function arabicTokens(text) {
  const raw = normalizeArabic(text).split(" ").filter(Boolean);
  const out = new Set();
  for (const tok of raw) {
    out.add(tok);
    if (tok.startsWith("\u0627\u0644") && tok.length > 3) out.add(tok.slice(2)); // bez ال
    if (/^[\u0628\u0644\u0648\u0641\u0643]/.test(tok) && tok.length > 3) out.add(tok.slice(1)); // bez b/l/w/f/k
  }
  return out;
}

// Zwraca listę słówek z bazy, które pojawiają się w danym dialogu.
function wordsInDialogue(dialogue, allWords) {
  const tokens = new Set();
  for (const line of dialogue.lines) {
    for (const t of arabicTokens(line.ar)) tokens.add(t);
  }
  const seen = new Set();
  const matched = [];
  for (const w of allWords) {
    if (!w.ar) continue;
    const forms = w.ar.includes(" ")
      ? [] // wielowyrazowych nie dopasowujemy po tokenie
      : [normalizeArabic(w.ar)];
    // dopasuj też słowa wielowyrazowe, jeśli cała frazа występuje w linii
    let hit = false;
    if (w.ar.includes(" ")) {
      const phrase = normalizeArabic(w.ar);
      hit = dialogue.lines.some((l) => normalizeArabic(l.ar).includes(phrase));
    } else {
      hit = forms.some((f) => f.length >= 2 && tokens.has(f));
    }
    if (hit) {
      const id = `${w.cat || "other"}|${w.pl}|${w.ar}`;
      if (!seen.has(id)) {
        seen.add(id);
        matched.push(w);
      }
    }
  }
  return matched;
}

// Zwraca zdania z układanki (SENTENCE_DRILLS), które pasują do słownictwa dialogu.
function sentencesForDialogue(dialogue) {
  const tokens = new Set();
  for (const line of dialogue.lines) {
    for (const t of arabicTokens(line.ar)) tokens.add(t);
  }
  return SENTENCE_DRILLS.filter((d) => {
    const tileTokens = d.tiles.map((t) => normalizeArabic(t.ar));
    const overlap = tileTokens.filter((t) => tokens.has(t)).length;
    return overlap >= Math.max(2, Math.ceil(d.tiles.length / 2));
  });
}

// Nowe słowa dochodzą przez scalanie (mergeWords), a nie przez podbicie wersji.
const STORAGE_KEY = "ar-eg-words";
// Osobny klawisz przechowuje same statystyki postępu (correctCount itd.) per słówko,
// odporny na zmiany zestawu — dzięki temu aktualizacja bazy nie zeruje wyników.
const PROGRESS_KEY_BASE = "ar-eg-progress-v1";

// Aktywny kurs (egyptian / msa / quran). Postęp, statystyki i cel są zapisywane
// osobno dla każdego kursu — z sufiksem kursu w kluczu. Ustawiane przy wyborze kursu.
let ACTIVE_COURSE = (() => {
  try { return localStorage.getItem("ar-eg-course-v1") || "egyptian"; } catch { return "egyptian"; }
})();
function setActiveCourseKey(c) { ACTIVE_COURSE = c || "egyptian"; }
function progressKey() { return `${PROGRESS_KEY_BASE}-${ACTIVE_COURSE}`; }

// Pełna, aktualna baza słówek (zawsze najnowsza, z wszystkimi dodatkami).
// ---------- 100 przydatnych zwrotów: brakujące (dodane z listy) ----------
const PHRASE_WORDS = [
  { cat: "basics", pl: "Witaj (serdeczne)", en: "Welcome (warm)", ar: "أهلاً وسهلاً", ph: "ahlan wa sahlan" },
  { cat: "basics", pl: "Dobranoc", en: "Good night", ar: "تصبح على خير", ph: "teSbaH 3ala kheer", ex: { ar: "تصبح على خير يا سمير.", ph: "teSbaH 3ala kheer", pl: "Dobranoc, Samir.", en: "Good night, Samir." } },
  { cat: "basics", pl: "Jak się masz? (do kobiety)", en: "How are you? (to a woman)", ar: "عاملة إيه؟", ph: "3amla eeh?" },
  { cat: "basics", pl: "Bardzo dobrze", en: "Very well", ar: "كويس جداً", ph: "kwayyes gedan" },
  { cat: "basics", pl: "Bardzo dziękuję", en: "Thank you very much", ar: "شكراً جداً", ph: "shukran gedan" },
  { cat: "basics", pl: "Przepraszam / przykro mi", en: "Sorry / excuse me", ar: "آسف", ph: "aasef", ex: { ar: "آسف، مش قصدي.", ph: "aasef", pl: "Przepraszam, nie chciałem.", en: "Sorry, I didn't mean to." } },
  { cat: "basics", pl: "Do zobaczenia", en: "See you", ar: "أشوفك بعدين", ph: "ashuufak ba3deen" },
  { cat: "basics", pl: "Tak", en: "Yes", ar: "أيوة", ph: "aywa" },
  { cat: "basics", pl: "Nie", en: "No", ar: "لأ", ph: "la2" },
  { cat: "basics", pl: "Oczywiście", en: "Of course", ar: "طبعاً", ph: "Tab3an" },
  { cat: "questions", pl: "Powiedz jeszcze raz", en: "Say that again", ar: "قول تاني", ph: "2uul taani", ex: { ar: "مش فاهم، قول تاني.", ph: "2uul taani", pl: "Nie rozumiem, powtórz.", en: "I don't understand, say it again." } },
  { cat: "questions", pl: "Wolniej / spokojnie", en: "Slower, please", ar: "بالراحة", ph: "bir-raaHa" },
  { cat: "questions", pl: "Głośniej trochę", en: "A bit louder", ar: "أعلى شوية", ph: "a3la shwayya" },
  { cat: "questions_pron", pl: "Dlaczego?", en: "Why?", ar: "ليه؟", ph: "leeh?" },
  { cat: "questions_pron", pl: "Dokąd?", en: "Where to?", ar: "على فين؟", ph: "3ala feen?" },
  { cat: "questions_pron", pl: "Który? (rodz. męski)", en: "Which? (m.)", ar: "أنهو؟", ph: "anhu?", ex: { ar: "أنهو دور؟", ph: "anhu door?", pl: "Które piętro?", en: "Which floor?" } },
  { cat: "questions_pron", pl: "Która? (rodz. żeński)", en: "Which? (f.)", ar: "أنهي؟", ph: "anhi?", ex: { ar: "إنت ساكن في أنهي شقة؟", ph: "enta saaken fi anhi sha22a?", pl: "W którym mieszkaniu mieszkasz?", en: "Which apartment do you live in?" } },
  { cat: "questions_pron", pl: "Którzy? / Które? (l. mnoga)", en: "Which? (pl.)", ar: "أنهم؟", ph: "anhum?", ex: { ar: "أنهم كتب؟", ph: "anhum kotob?", pl: "Które książki?", en: "Which books?" } },
  { cat: "questions", pl: "Co się stało?", en: "What happened?", ar: "حصل إيه؟", ph: "HaSal eeh?" },
  { cat: "work_daily", pl: "Mieszkam w Polsce", en: "I live in Poland", ar: "أنا ساكن في بولندا", ph: "ana saaken fi bolanda" },
  { cat: "work_daily", pl: "Jestem Polakiem", en: "I'm Polish", ar: "أنا بولندي", ph: "ana bolandi" },
  { cat: "basics", pl: "Miło cię poznać", en: "Nice to meet you", ar: "تشرفت بيك", ph: "tasharrafna biik" },
  { cat: "basics", pl: "Ja też", en: "Me too", ar: "وأنا كمان", ph: "wana kamaan" },
  { cat: "work_daily", pl: "Czym się zajmujesz?", en: "What do you do?", ar: "بتشتغل إيه؟", ph: "beteshta8al eeh?" },
  { cat: "work_daily", pl: "Jestem prawnikiem", en: "I'm a lawyer", ar: "أنا محامي", ph: "ana muHaami" },
  { cat: "work_daily", pl: "Jestem księgowym", en: "I'm an accountant", ar: "أنا محاسب", ph: "ana muHaaseb" },
  { cat: "food_shopping", pl: "Poproszę menu", en: "The menu, please", ar: "المنيو لو سمحت", ph: "il-menyu law samaHt" },
  { cat: "food_shopping", pl: "Co polecasz?", en: "What do you recommend?", ar: "ترشح إيه؟", ph: "terashshaH eeh?" },
  { cat: "food_shopping", pl: "Chciałbym zamówić", en: "I'd like to order", ar: "عايز أطلب", ph: "3aayez aTlob" },
  { cat: "food_shopping", pl: "To wszystko", en: "That's all", ar: "بس كده", ph: "bass keda" },
  { cat: "food_shopping", pl: "Bardzo smaczne", en: "Very tasty", ar: "لذيذ جداً", ph: "laziiz gedan" },
  { cat: "food_shopping", pl: "Rachunek poproszę", en: "The bill, please", ar: "الحساب لو سمحت", ph: "il-Hesaab law samaHt" },
  { cat: "food_shopping", pl: "Można kartą?", en: "Can I pay by card?", ar: "ينفع كارت؟", ph: "yenfa3 kart?" },
  { cat: "food_shopping", pl: "Gotówką", en: "in cash", ar: "كاش", ph: "kaash" },
  { cat: "food_shopping", pl: "Bez cebuli", en: "No onions", ar: "من غير بصل", ph: "min 8eer baSal" },
  { cat: "food_shopping", pl: "Bez ostrego", en: "Not spicy", ar: "من غير شطة", ph: "min 8eer shaTTa" },
  { cat: "food_shopping", pl: "Ile to kosztuje?", en: "How much does it cost?", ar: "ده بكام؟", ph: "da bikaam?" },
  { cat: "food_shopping", pl: "Za drogo (bardzo)", en: "Too expensive", ar: "غالي قوي", ph: "8aali 2awi" },
  { cat: "food_shopping", pl: "Nie ma zniżki?", en: "Any discount?", ar: "مفيش خصم؟", ph: "mafiish khaSm?" },
  { cat: "food_shopping", pl: "Wezmę to", en: "I'll take it", ar: "هاخده", ph: "haakhdo" },
  { cat: "food_shopping", pl: "Tylko oglądam", en: "Just looking", ar: "بتفرج بس", ph: "batfarrag bass" },
  { cat: "food_shopping", pl: "Masz drobne?", en: "Do you have change?", ar: "معاك فكة؟", ph: "ma3aak fakka?" },
  { cat: "food_shopping", pl: "Torba / reklamówka", en: "bag", ar: "كيس", ph: "kiis" },
  { cat: "travel", pl: "Jak dojdę do…?", en: "How do I get to…?", ar: "أروح إزاي؟", ph: "aruuH ezzaay?" },
  { cat: "travel", pl: "W prawo", en: "To the right", ar: "يمين", ph: "yemiin" },
  { cat: "travel", pl: "Tutaj", en: "Here", ar: "هنا", ph: "hena" },
  { cat: "travel", pl: "Zatrzymaj tutaj", en: "Stop here", ar: "وقف هنا", ph: "wa22af hena", ex: { ar: "وقف هنا لو سمحت.", ph: "wa22af hena", pl: "Zatrzymaj tutaj, proszę.", en: "Stop here, please." } },
  { cat: "travel", pl: "Taksówka", en: "Taxi", ar: "تاكسي", ph: "taksi" },
  { cat: "travel", pl: "Lotnisko", en: "Airport", ar: "المطار", ph: "il-maTaar" },
  { cat: "expressions", pl: "Chwileczkę", en: "Just a moment", ar: "استنى شوية", ph: "estanna shwayya" },
  { cat: "expressions", pl: "Zaraz wracam", en: "I'll be right back", ar: "راجع حالاً", ph: "raage3 Haalan" },
  { cat: "expressions", pl: "Naprawdę?", en: "Really?", ar: "بجد؟", ph: "begad?" },
  { cat: "expressions", pl: "Powodzenia!", en: "Good luck!", ar: "بالتوفيق", ph: "bit-tawfii2" },
  { cat: "expressions", pl: "Miłego dnia!", en: "Have a nice day!", ar: "يوم سعيد", ph: "yoom sa3iid" },
];

function freshDeck() {
  return [
    ...SEED_WORDS, ...VERB_WORDS, ...NOUN_WORDS, ...QW_WORDS,
    ...GRAMMAR_WORDS, ...EXPRESSION_WORDS, ...RELIGIOUS_WORDS,
    ...FOOD_WORDS, ...KITCHEN_WORDS, ...PHRASE_WORDS, ...CONJUNCTION_WORDS, ...FAMILY_WORDS, ...HEALTH_WORDS, ...WEATHER_WORDS, ...SMALLTALK_WORDS, ...FILLER_WORDS, ...SLANG_WORDS, ...LIFE_WORDS,
    ...COLOR_WORDS, ...ADJECTIVE_WORDS, ...DAILY_VERB_WORDS, ...MOTION_VERB_WORDS, ...TIME_ADVERB_WORDS,
    ...BODY_WORDS, ...CLOTHES_WORDS, ...HOME_FURNITURE_WORDS, ...NATURE_WORDS, ...TRANSPORT_WORDS,
    ...JOB_WORDS, ...EMOTION_WORDS, ...ANIMAL_WORDS, ...ORDINAL_WORDS, ...DIRECTION_WORDS, ...CONSTRUCTION_WORDS, ...CULTURE_WORDS, ...PRACTICAL_WORDS,
  ];
}

// Stabilny identyfikator słówka (nie zależy od pozycji w tablicy).
function wordId(w) {
  return `${w.cat || "other"}|${w.pl}|${w.ar}`;
}

// ---------- System audio wymowy ----------
// Pliki audio hostowane statycznie w /audio/. Nazwa pliku = stabilny hash wordId,
// więc bezpieczna (bez znaków arabskich/spacji) i automatycznie dopasowywalna.
// Słowo może też mieć jawne pole `audio` (nadpisuje hash).
const AUDIO_BASE = "/audio/";
function hashStr(s) {
  // deterministyczny hash (djb2), zwraca dodatnią liczbę w base36
  let h = 5381;
  for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) >>> 0;
  return h.toString(36);
}
function audioSrc(w) {
  if (!w) return null;
  if (w.audio) return w.audio.startsWith("http") || w.audio.startsWith("/") ? w.audio : AUDIO_BASE + w.audio;
  return AUDIO_BASE + hashStr(wordId(w)) + ".mp3";
}
// Zbiór dostępnych plików audio (manifest). Ładowany raz z /audio/manifest.json,
// by wiedzieć, dla których słów audio istnieje — inaczej pokazywalibyśmy 🔊 wszędzie.
let AUDIO_MANIFEST = null;
function loadAudioManifest(setReady) {
  if (AUDIO_MANIFEST !== null) { setReady && setReady(true); return; }
  fetch(AUDIO_BASE + "manifest.json")
    .then((r) => (r.ok ? r.json() : []))
    .then((list) => { AUDIO_MANIFEST = new Set(Array.isArray(list) ? list : []); setReady && setReady(true); })
    .catch(() => { AUDIO_MANIFEST = new Set(); setReady && setReady(true); });
}
function hasAudio(w) {
  if (!w) return false;
  if (w.audio) return true;
  if (AUDIO_MANIFEST === null) return false; // manifest jeszcze nie załadowany
  return AUDIO_MANIFEST.has(hashStr(wordId(w)) + ".mp3");
}
let _currentAudio = null;
function playWordAudio(w) {
  const src = audioSrc(w);
  if (!src) return;
  try {
    if (_currentAudio) { _currentAudio.pause(); _currentAudio = null; }
    const a = new Audio(src);
    _currentAudio = a;
    a.play().catch(() => {});
  } catch (e) {}
}

function loadProgress() {
  try {
    const raw = localStorage.getItem(progressKey());
    if (raw) return JSON.parse(raw); // { id: {correctCount, wrongCount, verified, flagged, ex} }
  } catch (e) {}
  return {};
}

// ---------- SRS: system powtórek rozłożonych w czasie ----------
// Uproszczony SM-2 (jak Anki). Każde słowo ma:
//   interval — za ile dni pokazać ponownie
//   ease     — mnożnik trudności (rośnie przy trafieniach, spada przy błędach)
//   due      — data (ISO) następnej powtórki
// Trafienie → interwał rośnie (1 → 3 → 7 → 16 dni…). Błąd → wraca do 1 dnia.
const SRS_MIN_EASE = 1.3;
const SRS_START_EASE = 2.5;

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function addDays(dateStr, days) {
  const d = new Date(dateStr + "T00:00:00");
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

// Zwraca zaktualizowane pola SRS po odpowiedzi.
function srsUpdate(word, correct) {
  const ease = word.ease || SRS_START_EASE;
  const interval = word.interval || 0;
  if (!correct) {
    // Błąd: powtórz jutro, obniż łatwość.
    return {
      interval: 1,
      ease: Math.max(SRS_MIN_EASE, ease - 0.2),
      due: addDays(todayISO(), 1),
    };
  }
  // Trafienie: rośnie interwał.
  let next;
  if (interval === 0) next = 1;
  else if (interval === 1) next = 3;
  else next = Math.round(interval * ease);
  next = Math.min(next, 180); // nie dłużej niż pół roku
  return {
    interval: next,
    ease: Math.min(3.0, ease + 0.1),
    due: addDays(todayISO(), next),
  };
}

// Czy słowo jest do powtórki dziś (lub zaległe)?
function isDue(word) {
  if (!word.due) return true; // nigdy nie ćwiczone = do nauki
  return word.due <= todayISO();
}

// Słowa do powtórki dziś, posortowane: najbardziej zaległe pierwsze.
function dueWords(words) {
  return words
    .filter((w) => (w.correctCount || w.wrongCount) && isDue(w))
    .sort((a, b) => (a.due || "").localeCompare(b.due || ""));
}

// Słowa jeszcze nie ruszone (nowe do nauki).
function newWords(words) {
  return words.filter((w) => !w.correctCount && !w.wrongCount);
}

function saveProgress(words) {
  try {
    const prog = {};
    for (const w of words) {
      const c = w.correctCount || 0, x = w.wrongCount || 0;
      // Zapisuj tylko REALNY postęp nauki. Uwaga: NIE liczymy w.ex — przykłady
      // użycia są częścią bazy słówek, nie postępu, i doklejanie ich tutaj
      // zaśmiecało zapis (każde słówko z przykładem wyglądało jak „przerobione").
      if (c || x || w.verified || w.flagged || w.known) {
        prog[wordId(w)] = {
          correctCount: c, wrongCount: x,
          verified: !!w.verified, flagged: !!w.flagged,
          known: w.known || undefined, // "known" | "unknown" | "review"
          // Pola SRS (mogą być puste dla starych zapisów — wtedy słowo jest „do nauki").
          interval: w.interval || undefined,
          ease: w.ease || undefined,
          due: w.due || undefined,
        };
      }
    }
    localStorage.setItem(progressKey(), JSON.stringify(prog));
    try {
      const meta = { count: Object.keys(prog).length, at: new Date().toISOString() };
      localStorage.setItem("ar-eg-progress-meta", JSON.stringify(meta));
    } catch (e2) {}
  } catch (e) {}
}

function loadWords() {
  // 1) Zbuduj aktualną bazę (z nowymi słowami z każdej aktualizacji).
  const deck = freshDeck();
  // 2) Wczytaj zapisane słówka. Rozdziel na:
  //    - edycje słów z bazy (ten sam wordId co w decku, ale zmieniona treść/ph/ex),
  //    - słówka dodane ręcznie (wordId spoza decku).
  let saved = [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) saved = JSON.parse(raw) || [];
  } catch (e) {}
  const deckIds = new Set(deck.map(wordId));
  const savedById = new Map(saved.map((w) => [wordId(w), w]));
  const userAdded = saved.filter((w) => !deckIds.has(wordId(w)));

  // Lista oryginałów z bazy ukrytych, bo użytkownik zmienił ich pl/ar (nowy wordId).
  let hidden = [];
  try {
    const rawH = localStorage.getItem("ar-eg-hidden");
    if (rawH) hidden = JSON.parse(rawH) || [];
  } catch (e) {}
  const hiddenSet = new Set(hidden);

  // 3) Dla słów z decku: jeśli użytkownik je edytował (zapisana wersja różni się
  //    treścią), użyj zapisanej wersji zamiast tej z kodu — inaczej edycje znikają.
  //    Pomiń oryginały ukryte (zastąpione edycją zmieniającą pl/ar).
  const merged = deck
    .filter((w) => !hiddenSet.has(wordId(w)))
    .map((w) => {
      const s = savedById.get(wordId(w));
      if (s && (s.ph !== w.ph || (s.ex && !w.ex) || (s.pl !== w.pl))) {
        return { ...w, ...s };
      }
      return w;
    });
  const all = [...merged, ...userAdded];

  // 4) Nałóż zapisany postęp na dopasowane słówka (po stabilnym id).
  const prog = loadProgress();
  return all.map((w) => {
    // Dolej dodatkowy przykład, jeśli słowo go nie ma (nie zmienia wordId).
    const base = !w.ex && EXAMPLES_EXTRA[wordId(w)] ? { ...w, ex: EXAMPLES_EXTRA[wordId(w)] } : w;
    const p = prog[wordId(base)];
    return p ? { ...base, ...p } : base;
  });
}

function saveWords(words) {
  try {
    // Baza: zapisujemy pełną listę (żeby zachować słówka dodane przez użytkownika).
    localStorage.setItem(STORAGE_KEY, JSON.stringify(words));
  } catch (e) {}
  // Postęp: osobno, odporny na przyszłe zmiany zestawu.
  saveProgress(words);
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Normalizacja do wyszukiwania: małe litery + zdjęcie diakrytyków,
// żeby „reka” znalazło „ręka”, a „laazem” — „Laazem”.
function normalizeSearch(s) {
  return (s || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ł/g, "l");
}

// Status nauki słówka — spójny z panelem postępu.
function wordStatus(w) {
  const c = w.correctCount || 0;
  const x = w.wrongCount || 0;
  if (w.verified || (c >= 2 && c > x)) return "mastered";
  if (c + x > 0) return "inprogress";
  return "untouched";
}

// Wyznacza "grupę" słówka dla trudnego quizu — inne formy tej samej podstawy.
// Czasowniki: opis to "muszę iść (musieć, czas teraźniejszy)" → grupa "musieć".
// Rzeczowniki (liczba): "dom (l. mnoga, r.m.)" → grupa "dom".
// Rzeczowniki (dzierżawcze): "dom — mój / moja" → grupa "dom".
// Dzięki temu dystraktory to mylące warianty tego samego wyrazu.
function quizGroupKey(word) {
  if (!word || !word.pl) return null;
  if (word.cat === "verbs") {
    // Etykieta kończy się na "(podstawa, czas)". Bierzemy OSTATNI taki nawias,
    // bo w treści bywają inne, np. "musisz iść (m.) (musieć, czas teraźniejszy)".
    const matches = [...word.pl.matchAll(/\(([^(),]+),\s*czas[^)]*\)/g)];
    if (matches.length) return "v:" + matches[matches.length - 1][1].trim();
    // zapas: ostatni nawias z przecinkiem
    const any = [...word.pl.matchAll(/\(([^(),]+),[^)]*\)/g)];
    if (any.length) return "v:" + any[any.length - 1][1].trim();
  }
  if (word.cat === "nouns") {
    // najpierw wariant dzierżawczy "baza — ..."
    const dash = word.pl.split("—")[0];
    if (dash && dash !== word.pl) return "n:" + dash.trim();
    // wariant liczby "baza (l. ...)"
    const paren = word.pl.split("(")[0];
    return "n:" + paren.trim();
  }
  return null;
}


// ---------- Komponent: Fiszka ----------
// ---------- Komponent: panel oznaczania "do poprawki" ----------
function ReviewPanel({ word, onToggleFlag, onToggleVerified }) {
  const ui = useUi();
  const [draftNote, setDraftNote] = useState(word.flagNote || "");
  const [editing, setEditing] = useState(false);

  // Stan "oznaczone do poprawki" ma priorytet wizualny — jeśli ktoś naniesie
  // poprawkę, ma być od razu widoczne, nawet jeśli wcześniej było zatwierdzone.
  if (word.flagged) {
    return (
      <div className="flag-panel flag-panel-active" onClick={(e) => e.stopPropagation()}>
        {editing ? (
          <>
            <input
              autoFocus
              className="flag-note-input"
              placeholder={ui("co poprawić?")}
              value={draftNote}
              onChange={(e) => setDraftNote(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  onToggleFlag(true, draftNote);
                  setEditing(false);
                }
              }}
            />
            <button
              className="flag-note-save"
              onClick={() => {
                onToggleFlag(true, draftNote);
                setEditing(false);
              }}
            >
              <Check size={14} />
            </button>
          </>
        ) : (
          <>
            <Flag size={14} className="flag-icon-active" />
            <span className="flag-note-text" onClick={() => setEditing(true)}>
              {word.flagNote ? word.flagNote : "do poprawki — dotknij, by dodać notatkę"}
            </span>
            <button
              className="flag-remove-btn"
              onClick={() => onToggleFlag(false, "")}
              title={ui("Usuń oznaczenie")}
            >
              <X size={14} />
            </button>
          </>
        )}
      </div>
    );
  }

  if (word.verified) {
    return (
      <div
        className="flag-panel verified-panel-active"
        onClick={(e) => e.stopPropagation()}
      >
        <Check size={14} className="verified-icon-active" />
        <span className="verified-text">sprawdzone</span>
        <button
          className="flag-remove-btn verified-remove-btn"
          onClick={() => onToggleVerified(false)}
          title={ui("Usuń zatwierdzenie")}
        >
          <X size={14} />
        </button>
      </div>
    );
  }

  return (
    <div className="review-toggle-row" onClick={(e) => e.stopPropagation()}>
      <button
        className="review-toggle-btn review-toggle-verify"
        onClick={() => onToggleVerified(true)}
      >
        <Check size={14} />
        {ui("poprawna")}
      </button>
      <button
        className="review-toggle-btn review-toggle-flag"
        onClick={() => onToggleFlag(true, "")}
      >
        <Flag size={14} />
        {ui("do poprawki")}
      </button>
    </div>
  );
}

// ---------- Komponent: przycisk "nowy przykład" (generowany przez AI) ----------
function EditExampleButton({ word, onSaveExample, className = "" }) {
  const ui = useUi();
  const lang = useLang();
  const [editing, setEditing] = useState(false);
  const [ar, setAr] = useState(word.ex?.ar || "");
  const [ph, setPh] = useState(word.ex?.ph || "");
  const [pl, setPl] = useState(word.ex?.pl || "");
  const [en, setEn] = useState(word.ex?.en || "");

  function startEdit(e) {
    e.preventDefault();
    e.stopPropagation();
    setAr(word.ex?.ar || "");
    setPh(word.ex?.ph || "");
    setPl(word.ex?.pl || "");
    setEn(word.ex?.en || "");
    setEditing(true);
  }

  function handleSave(e) {
    e.preventDefault();
    e.stopPropagation();
    const t = (lang === "en" ? en : pl).trim();
    if (!ar.trim() || !t) return;
    // Pole tłumaczenia edytuje język interfejsu; drugi język zachowujemy.
    // Jeśli któregoś brakuje, używamy wpisanego tekstu jako wspólnego fallbacku,
    // żeby przykład nie pokazywał pustego/obcojęzycznego tłumaczenia.
    const nextPl = lang === "en" ? (pl.trim() || t) : pl.trim();
    const nextEn = lang === "en" ? en.trim() : (en.trim() || t);
    onSaveExample({ ar: ar.trim(), ph: ph.trim(), pl: nextPl, en: nextEn });
    setEditing(false);
  }

  if (editing) {
    return (
      <div className={`example-edit-wrap ${className}`} onClick={(e) => e.stopPropagation()}>
        <input
          autoFocus
          className="example-edit-input example-edit-input-arabic"
          placeholder={ui("zdanie po arabsku")}
          value={ar}
          onChange={(e) => setAr(e.target.value)}
        />
        <input
          className="example-edit-input example-edit-input-mono"
          placeholder={ui("transkrypcja")}
          value={ph}
          onChange={(e) => setPh(e.target.value)}
        />
        <input
          className="example-edit-input"
          placeholder={ui("tłumaczenie")}
          value={lang === "en" ? en : pl}
          onChange={(e) => (lang === "en" ? setEn(e.target.value) : setPl(e.target.value))}
        />
        <div className="example-edit-actions">
          <button type="button" className="text-btn" onClick={() => setEditing(false)}>
            {lang === "en" ? "cancel" : "anuluj"}
          </button>
          <button
            type="button"
            className="example-edit-save"
            onClick={handleSave}
            disabled={!ar.trim() || !(lang === "en" ? en : pl).trim()}
          >
            <Check size={13} />
            {lang === "en" ? "save" : "zapisz"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`new-example-wrap ${className}`} onClick={(e) => e.stopPropagation()}>
      <button type="button" className="new-example-btn" onClick={startEdit}>
        <Pencil size={13} />
        {word.ex ? ui("edytuj przykład") : ui("dodaj przykład")}
      </button>
    </div>
  );
}

// Znajduje pełny obiekt czasownika po polskim bezokoliczniku (verbBase z fiszki).
function findVerbByBase(base) {
  if (!base) return null;
  return VERBS.find((v) => v.pl === base) || null;
}

// Podgląd pełnej odmiany czasownika — rozwijany na fiszce.
// Pokazuje wszystkie czasy (present/past/future) z formami osobowymi.
function ConjugationPreview({ verb, highlightTense, highlightAr }) {
  const lang = useLang();
  const [open, setOpen] = useState(false);
  if (!verb) return null;
  const tenseOrder = ["present", "past", "future"];

  return (
    <div className="conj-preview" onClick={(e) => e.stopPropagation()}>
      <button
        type="button"
        className="conj-toggle"
        onClick={() => setOpen((o) => !o)}
      >
        {open
          ? (lang === "en" ? "hide full conjugation" : "ukryj pełną odmianę")
          : (lang === "en" ? "show full conjugation" : "pokaż pełną odmianę")}
      </button>
      {open && (
        <div className="conj-tables">
          {tenseOrder.map((tk) => {
            const forms = verb.tenses[tk];
            if (!forms) return null;
            return (
              <div className="conj-table" key={tk}>
                <div className={`conj-tense-title ${tk === highlightTense ? "conj-tense-active" : ""}`}>
                  {lang === "en" ? TENSE_LABELS_EN[tk] : TENSE_LABELS[tk]}
                </div>
                {forms.map((f, i) => {
                  const pr = PRONOUNS.find((p) => p.key === f.pronoun);
                  const isHi = highlightAr && f.ar === highlightAr && tk === highlightTense;
                  return (
                    <div className={`conj-row ${isHi ? "conj-row-hi" : ""}`} key={i}>
                      <span className="conj-pron">{pr ? pr.ph : f.pronoun}</span>
                      <span className="conj-ar">{f.ar}</span>
                      <span className="conj-ph">{f.ph}</span>
                    </div>
                  );
                })}
              </div>
            );
          })}
          {verb.note && (
            <p className="conj-note">{lang === "en" && verb.noteEn ? verb.noteEn : verb.note}</p>
          )}
        </div>
      )}
    </div>
  );
}

function Flashcard({ word, flipped, onFlip, onToggleFlag, onToggleVerified, onSetKnown, onSaveExample, onEditCard, onGoToRoot }) {
  const trx = useTr();
  const lang = useLang();
  const ui = useUi();
  return (
    <div className="card-stage" onClick={onFlip}>
      <div className={`card-inner ${flipped ? "is-flipped" : ""}`}>
        <div className="card-face card-front">
          <button
            type="button"
            className="card-edit-btn"
            onClick={(e) => {
              e.stopPropagation();
              onEditCard();
            }}
            title={ui("Edytuj fiszkę")}
          >
            <Pencil size={14} />
          </button>
          {word.known && <KnownBadge value={word.known} />}
          <span className="card-eyebrow">{lang==="en"?"English":"polski"}</span>
          <span className="card-word">{trx(word)}</span>
          <span className="card-hint">{lang==="en"?"tap to reveal":"dotknij, by odsłonić"}</span>
          <ReviewPanel word={word} onToggleFlag={onToggleFlag} onToggleVerified={onToggleVerified} />
        </div>
        <div className="card-face card-back">
          <button
            type="button"
            className="card-edit-btn card-edit-btn-dark"
            onClick={(e) => {
              e.stopPropagation();
              onEditCard();
            }}
            title={ui("Edytuj fiszkę")}
          >
            <Pencil size={14} />
          </button>
          <span className="card-eyebrow">مصري</span>
          <span className="card-arabic">{word.ar}</span>
          <span className="card-phonetic">{word.ph} <AudioButton word={word} size={20} /></span>
          {(() => {
            const ex = word.ex || findUsageExample(word);
            if (!ex) return null;
            return (
              <div className="card-example">
                {!word.ex && <span className="card-example-src">{ui("przykład z dialogu")}</span>}
                <span className="example-arabic">{ex.ar}</span>
                <span className="example-phonetic">{ex.ph}</span>
                <span className="example-pl">„{trx(ex)}”</span>
              </div>
            );
          })()}
          <EditExampleButton word={word} onSaveExample={onSaveExample} className="new-example-card" />
          {onGoToRoot && (() => {
            const ri = findRootIndexForWord(word);
            if (ri < 0) return null;
            const r = MSA_ROOTS[ri];
            return (
              <button
                type="button"
                className="card-root-link"
                onClick={(e) => { e.stopPropagation(); onGoToRoot(ri); }}
              >
                <span className="card-root-link-ar">{r.root.ar}</span>
                {lang === "en" ? "see root family" : "zobacz rodzinę rdzenia"}
              </button>
            );
          })()}
          {word.verbBase && (() => {
            const v = findVerbByBase(word.verbBase);
            if (!v) return null;
            return <ConjugationPreview verb={v} highlightTense={word.verbTense} highlightAr={word.ar} />;
          })()}
          <KnownTags value={word.known} onSetKnown={onSetKnown} />
          <ReviewPanel word={word} onToggleFlag={onToggleFlag} onToggleVerified={onToggleVerified} />
        </div>
      </div>
    </div>
  );
}

// Pasek samooceny: wiem / nie wiem / do powtórki. Kliknięcie aktywnego zdejmuje.
function KnownTags({ value, onSetKnown }) {
  const lang = useLang();
  const opts = [
    { key: "known", label: "wiem", labelEn: "know", cls: "known-tag-known" },
    { key: "unknown", label: "nie wiem", labelEn: "don't know", cls: "known-tag-unknown" },
    { key: "review", label: "do powtórki", labelEn: "to review", cls: "known-tag-review" },
  ];
  return (
    <div className="known-tags" onClick={(e) => e.stopPropagation()}>
      {opts.map((o) => (
        <button
          key={o.key}
          className={`known-tag ${o.cls} ${value === o.key ? "known-tag-active" : ""}`}
          onClick={() => onSetKnown(o.key)}
        >
          {lang==="en"&&o.labelEn?o.labelEn:o.label}
        </button>
      ))}
    </div>
  );
}

// Mała plakietka na froncie pokazująca aktualny znacznik samooceny.
function KnownBadge({ value }) {
  const map = {
    known: { label: "wiem", cls: "known-badge-known" },
    unknown: { label: "nie wiem", cls: "known-badge-unknown" },
    review: { label: "do powtórki", cls: "known-badge-review" },
  };
  const m = map[value];
  if (!m) return null;
  return <span className={`known-badge ${m.cls}`}>{m.label}</span>;
}

// ---------- Widok: Fiszki ----------
function FlashcardsView({ words, onToggleFlag, onToggleVerified, onSetKnown, onSaveExample, onEditCard, onGoToRoot, preserveOrder, emptyHint }) {
  const lang = useLang();
  const ui = useUi();
  // Tryb kolejności: "shuffle" (losowo), "oldest" (od dodania), "newest" (od końca).
  // Kolejność tablicy `words` odzwierciedla kolejność dodawania (nowe na końcu).
  const [sortMode, setSortMode] = useState(preserveOrder ? "oldest" : "shuffle");

  function buildOrder(mode) {
    const idx = words.map((_, i) => i);
    if (mode === "oldest") return idx;
    if (mode === "newest") return idx.slice().reverse();
    return shuffle(idx);
  }

  const [order, setOrder] = useState(() => buildOrder(preserveOrder ? "oldest" : "shuffle"));
  const [pos, setPos] = useState(0);
  const [flipped, setFlipped] = useState(false);

  // Reagujemy tylko na zmianę SKŁADU zestawu (inne słówka / inna liczba),
  // a nie na zmianę właściwości istniejących słówek (np. oznaczenie flagą) —
  // inaczej oznaczenie "do poprawki" przeskakiwałoby na inną, losową fiszkę.
  const wordsSignature = words.map((w) => w.pl + "|" + w.ar).join("\u0000");
  const isFirstRun = useRef(true);

  useEffect(() => {
    // Przy pierwszym montowaniu kolejność już została ustalona przez
    // useState powyżej — nie budujemy jej od nowa, żeby fiszka nie "mrugnęła".
    if (isFirstRun.current) {
      isFirstRun.current = false;
      return;
    }
    setOrder(buildOrder(sortMode));
    setPos(0);
    setFlipped(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wordsSignature]);

  // Zmiana trybu przez użytkownika — przelicz kolejność natychmiast.
  function changeSort(mode) {
    setSortMode(mode);
    setOrder(buildOrder(mode));
    setPos(0);
    setFlipped(false);
  }

  if (words.length === 0) {
    const hint =
      emptyHint ||
      "Brak słówek w tym widoku.";
    return <EmptyState text={hint} />;
  }

  // order/pos mogą na chwilę odnosić się do poprzedniej (innej) listy słówek
  // tuż po zmianie kategorii, zanim powyższy useEffect zdąży je przeliczyć.
  // Dlatego zawsze ograniczamy się do bezpiecznego zakresu.
  const safeOrder = order.length === words.length ? order : words.map((_, i) => i);
  const safePos = pos < safeOrder.length ? pos : 0;
  const current = words[safeOrder[safePos]];

  if (!current) {
    return <EmptyState text={lang==="en"?"Loading words…":"Wczytywanie słówek…"} />;
  }

  function next() {
    setFlipped(false);
    setPos((p) => (p + 1) % safeOrder.length);
  }
  function prev() {
    setFlipped(false);
    setPos((p) => (p - 1 + safeOrder.length) % safeOrder.length);
  }

  return (
    <div className="view-flash">
      <div className="progress-row">
        <span className="progress-text">
          {safePos + 1} / {safeOrder.length}
        </span>
        <div className="flash-sort">
          <button
            className={`flash-sort-btn ${sortMode === "shuffle" ? "flash-sort-active" : ""}`}
            onClick={() => changeSort("shuffle")}
            title="Losowo"
          >
            <Shuffle size={15} />
          </button>
          <button
            className={`flash-sort-btn ${sortMode === "oldest" ? "flash-sort-active" : ""}`}
            onClick={() => changeSort("oldest")}
            title={ui("Od najstarszych (kolejność dodania)")}
          >
            ↑ {lang==="en"?"old":"stare"}
          </button>
          <button
            className={`flash-sort-btn ${sortMode === "newest" ? "flash-sort-active" : ""}`}
            onClick={() => changeSort("newest")}
            title={lang==="en"?"Newest first":"Od najnowszych"}
          >
            ↓ {lang==="en"?"new":"nowe"}
          </button>
        </div>
      </div>

      <Flashcard
        word={current}
        flipped={flipped}
        onFlip={() => setFlipped((f) => !f)}
        onToggleFlag={(flagged, note) => onToggleFlag(current, flagged, note)}
        onToggleVerified={(verified) => onToggleVerified(current, verified)}
        onSetKnown={(value) => onSetKnown(current, value)}
        onSaveExample={(ex) => onSaveExample(current, ex)}
        onEditCard={() => onEditCard(current)}
        onGoToRoot={onGoToRoot}
      />

      <div className="nav-row">
        <button className="nav-btn" onClick={prev}>
          ← {lang==="en"?"back":"wstecz"}
        </button>
        <button className="nav-btn nav-btn-primary" onClick={next}>
          {lang==="en"?"next":"dalej"} →
        </button>
      </div>
    </div>
  );
}

// ---------- Widok: Quiz ----------
// Znajduje w dialogach lub czytankach zdanie zawierające dane słowo — użyte jako
// przykład w quizie, gdy słowo nie ma własnego pola ex.
// Znajduje w dialogach lub czytankach zdanie zawierające dane słowo — użyte jako
// przykład, gdy słowo nie ma własnego pola ex.
// UWAGA: dopasowujemy CAŁY token (ewentualnie po zdjęciu prefiksu gramatycznego).
// Wcześniejsze „tok.includes(target)” dawało fałszywe trafienia: خد (weź) pasowało
// do خدمات (usługi), więc przykład nie miał nic wspólnego ze słowem.
// Wykrywa, do którego rdzenia (MSA_ROOTS) pasuje słowo — po dopasowaniu formy
// arabskiej z rodziny rdzenia. Zwraca indeks rdzenia lub -1. Bezpieczne: tylko
// odczyt, nie zmienia słowa ani wordId.
function stripArabic(s) {
  // usuń harakat i znaki diakrytyczne, zostaw same litery
  return (s || "").replace(/[\u064B-\u0652\u0670\u0640]/g, "").trim();
}
function findRootIndexForWord(word) {
  if (!word || !word.ar) return -1;
  const wordForms = stripArabic(word.ar).split(/[\s\/,]+/).filter(Boolean);
  for (let i = 0; i < MSA_ROOTS.length; i++) {
    const r = MSA_ROOTS[i];
    for (const f of r.family) {
      const forms = [stripArabic(f.msa.ar), stripArabic(f.eg.ar)];
      for (const form of forms) {
        if (!form) continue;
        // dopasowanie: któraś forma słowa równa się formie z rodziny
        if (wordForms.some((w) => w === form)) return i;
      }
    }
  }
  return -1;
}

function findUsageExample(word) {
  if (!word || !word.ar) return null;
  const target = normalizeArabic(word.ar);
  // Słowa 1–2-znakowe są zbyt krótkie, by dopasować je bezpiecznie.
  if (!target || target.length < 3) return null;

  // Warianty tokenu do porównania: sam token, token bez prefiksu gramatycznego
  // (rodzajnik ال, spójnik و, przyimki بـ لـ فـ كـ) oraz bez sufiksu dzierżawczego
  // (ـي ـك ـه ـها ـنا ـكم ـهم), np. بيتي („mój dom”) → بيت.
  const POSS_SUFFIXES = ["ها", "نا", "كم", "كو", "هم", "ي", "ك", "ه"];
  const stripPoss = (tok) => {
    for (const suf of POSS_SUFFIXES) {
      if (tok.endsWith(suf) && tok.length - suf.length >= 3) {
        return tok.slice(0, tok.length - suf.length);
      }
    }
    return null;
  };
  const tokenVariants = (tok) => {
    const bases = [tok];
    if (tok.startsWith("ال") && tok.length > 3) bases.push(tok.slice(2));
    if (/^[وبلفك]/.test(tok) && tok.length > 3) {
      const cut = tok.slice(1);
      bases.push(cut);
      if (cut.startsWith("ال") && cut.length > 3) bases.push(cut.slice(2));
    }
    // Dla każdej bazy dodaj też wersję bez sufiksu dzierżawczego.
    const out = [];
    for (const b of bases) {
      out.push(b);
      const s = stripPoss(b);
      if (s) out.push(s);
    }
    return out;
  };

  const inText = (arText) => {
    const norm = normalizeArabic(arText);
    return norm
      .split(" ")
      .some((tok) => tokenVariants(tok).some((v) => v === target));
  };

  for (const d of DIALOGUES) {
    for (const line of d.lines) {
      if (inText(line.ar)) return { ar: line.ar, ph: line.ph, pl: line.pl, en: line.en };
    }
  }
  for (const r of READINGS) {
    for (const s of r.sentences) {
      if (inText(s.ar)) return { ar: s.ar, ph: s.ph, pl: s.pl, en: s.en };
    }
  }
  return null;
}

function QuizView({ words, onAnswer, preserveOrder }) {
  const lang = useLang();
  const ui = useUi();
  const trx = useTr();
  const [pool, setPool] = useState(() =>
    preserveOrder ? words.map((_, i) => i) : shuffle(words.map((_, i) => i))
  );
  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [finished, setFinished] = useState(false);

  const [difficulty, setDifficulty] = useState("easy"); // "easy" | "hard" | "expert"
  const [quizLen, setQuizLen] = useState("all"); // 10 | 20 | 30 | "all"
  const [direction, setDirection] = useState("pl2ar"); // "pl2ar" (widzisz PL) | "ar2pl" (widzisz arabski)

  // Buduje pulę indeksów: losową (lub zachowaną kolejność) i skróconą do quizLen.
  function buildPool(len) {
    const useLen = len === undefined ? quizLen : len;
    const base = preserveOrder
      ? words.map((_, i) => i)
      : shuffle(words.map((_, i) => i));
    if (useLen === "all") return base;
    return base.slice(0, Math.min(useLen, base.length));
  }

  // Reagujemy tylko na zmianę SKŁADU zestawu (inna kategoria / inna liczba
  // słówek), a nie na każdą zmianę properties (np. wrongCount/correctCount
  // aktualizowane przez recordAnswer po każdej odpowiedzi) — inaczej wybrana
  // odpowiedź resetowałaby się, zanim zdążysz zobaczyć, czy była poprawna.
  const wordsSignature = words.map((w) => w.pl + "|" + w.ar).join("\u0000");
  const isFirstRun = useRef(true);

  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      return;
    }
    restart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wordsSignature]);

  function restart(len) {
    setPool(buildPool(len));
    setIdx(0);
    setSelected(null);
    setScore({ correct: 0, total: 0 });
    setFinished(false);
  }

  // UWAGA (React #300): wszystkie hooki muszą wykonać się w KAŻDYM renderze,
  // dlatego obliczenia i useMemo stoją PRZED wczesnymi returnami poniżej.
  // pool/idx mogą na chwilę odnosić się do poprzedniej (innej) listy słówek
  // tuż po zmianie kategorii, zanim powyższy useEffect zdąży je przeliczyć.
  // Pula bywa krótsza od words (wybór 10/20/30), więc sprawdzamy zakres indeksów,
  // a nie równość długości.
  const poolValid =
    pool.length > 0 && pool.every((i) => i >= 0 && i < words.length);
  const safePool = poolValid && words.length ? pool : words.map((_, i) => i);
  const safeIdx = idx < safePool.length ? idx : 0;
  const correctWord = words[safePool[safeIdx]];

  const options = useMemo(() => {
    if (finished || !correctWord || words.length < 4) return [];
    const correctIdx = safePool[safeIdx];
    // Klucz rozróżniający opcje zależy od kierunku:
    // - PL→AR: opcje to formy arabskie → unikamy duplikatów po .ar
    //   (np. عايزين dla e7na/ento/homma to jedna forma, nie może pojawić się 2×).
    // - AR→PL: opcje to znaczenia polskie → unikamy duplikatów po .pl.
    const keyOf = (w) => (direction === "ar2pl" ? w.pl : w.ar);
    const correctKey = keyOf(correctWord);
    const others = words.filter(
      (w, i) => i !== correctIdx && keyOf(w) !== correctKey
    );

    // Wybiera do `count` dystraktorów o UNIKALNYCH kluczach
    // (żaden nie powtarza klucza poprawnej odpowiedzi ani innego dystraktora).
    function pickUnique(pool, count, seedKeys) {
      const seen = new Set(seedKeys);
      const out = [];
      for (const w of shuffle(pool)) {
        const k = keyOf(w);
        if (seen.has(k)) continue;
        seen.add(k);
        out.push(w);
        if (out.length >= count) break;
      }
      return out;
    }

    let distractors;
    if (difficulty === "hard" || difficulty === "expert") {
      const group = quizGroupKey(correctWord);
      const siblings = group
        ? others.filter((w) => quizGroupKey(w) === group)
        : [];
      const picked = pickUnique(siblings, 3, [correctKey]);
      // Uzupełnij losowymi, jeśli za mało odrębnych wariantów rodzeństwa.
      if (picked.length < 3) {
        const seed = [correctKey, ...picked.map((w) => keyOf(w))];
        const filler = pickUnique(others, 3 - picked.length, seed);
        distractors = [...picked, ...filler];
      } else {
        distractors = picked;
      }
    } else {
      distractors = pickUnique(others, 3, [correctKey]);
    }
    return shuffle([correctWord, ...distractors]);
    // Zależymy od STABILNEGO identyfikatora pytania (forma arabska + pozycja + kierunek),
    // a nie od referencji safePool — ta jest tworzona na nowo przy każdym renderze
    // (words.map(...)), więc po zapisaniu odpowiedzi (setWords) memo przeliczałoby
    // się i TASOWAŁO opcje ponownie, przez co poprawna odpowiedź zmieniała miejsce.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [safeIdx, correctWord?.ar, finished, difficulty, direction]);

  // Wczesne returny DOPIERO poniżej wszystkich hooków.
  if (words.length < 4) {
    return <EmptyState text={lang==="en"?"Add at least 4 words to start the quiz.":"Dodaj przynajmniej 4 słówka, aby uruchomić quiz."} />;
  }

  if (!correctWord) {
    return <EmptyState text={lang==="en"?"Loading words…":"Wczytywanie słówek…"} />;
  }

  function choose(opt) {
    if (selected) return;
    setSelected(opt);
    const isCorrect = opt.ar === correctWord.ar;
    setScore((s) => ({ correct: s.correct + (isCorrect ? 1 : 0), total: s.total + 1 }));
    if (onAnswer) onAnswer(correctWord, isCorrect, difficulty);
  }

  function nextQuestion() {
    setSelected(null);
    if (safeIdx + 1 >= safePool.length) {
      setFinished(true);
    } else {
      setIdx(safeIdx + 1);
    }
  }

  if (finished) {
    const pct = Math.round((score.correct / score.total) * 100);
    return (
      <div className="view-quiz quiz-result">
        <span className="result-pct">{pct}%</span>
        <span className="result-label">
          {score.correct} z {score.total} poprawnych odpowiedzi
        </span>
        <button className="nav-btn nav-btn-primary" onClick={restart}>
          <RotateCw size={16} style={{ marginRight: 8 }} />
          zacznij od nowa
        </button>
      </div>
    );
  }

  return (
    <div className="view-quiz">
      <div className="quiz-diff-row">
        <div className="quiz-diff-toggle">
          <button
            type="button"
            className={`quiz-diff-btn ${difficulty === "easy" ? "quiz-diff-active" : ""}`}
            onClick={() => difficulty !== "easy" && (setDifficulty("easy"), setSelected(null))}
          >
            {lang==="en"?"easy":"łatwy"}
          </button>
          <button
            type="button"
            className={`quiz-diff-btn ${difficulty === "hard" ? "quiz-diff-active" : ""}`}
            onClick={() => difficulty !== "hard" && (setDifficulty("hard"), setSelected(null))}
          >
            {lang==="en"?"hard":"trudny"}
          </button>
          <button
            type="button"
            className={`quiz-diff-btn ${difficulty === "expert" ? "quiz-diff-active" : ""}`}
            onClick={() => difficulty !== "expert" && (setDifficulty("expert"), setSelected(null))}
          >
            {lang==="en"?"expert":"ekspert"}
          </button>
        </div>
        <span className="quiz-diff-hint">
          {difficulty === "expert"
            ? (lang==="en"?"Arabic only — transcription after answering":"sam arabski — transkrypcja po odpowiedzi")
            : difficulty === "hard"
            ? (lang==="en"?"variants of the same word":"warianty tego samego wyrazu")
            : (lang==="en"?"random words as distractors":"losowe słówka jako błędne")}
        </span>
      </div>

      <div className="quiz-len-row">
        <span className="quiz-len-label">{ui("liczba pytań:")}</span>
        <div className="quiz-len-toggle">
          {[10, 20, 30, "all"].map((len) => (
            <button
              key={len}
              type="button"
              className={`quiz-len-btn ${quizLen === len ? "quiz-len-active" : ""}`}
              onClick={() => {
                if (quizLen === len) return;
                setQuizLen(len);
                restart(len);
              }}
            >
              {len === "all" ? "wszystkie" : len}
            </button>
          ))}
        </div>
      </div>

      <div className="quiz-len-row">
        <span className="quiz-len-label">{ui("kierunek:")}</span>
        <div className="quiz-len-toggle">
          <button
            type="button"
            className={`quiz-len-btn ${direction === "pl2ar" ? "quiz-len-active" : ""}`}
            onClick={() => direction !== "pl2ar" && (setDirection("pl2ar"), setSelected(null))}
          >
            PL → AR
          </button>
          <button
            type="button"
            className={`quiz-len-btn ${direction === "ar2pl" ? "quiz-len-active" : ""}`}
            onClick={() => direction !== "ar2pl" && (setDirection("ar2pl"), setSelected(null))}
          >
            AR → PL
          </button>
        </div>
      </div>

      <div className="progress-row">
        <span className="progress-text">
          {safeIdx + 1} / {safePool.length}
        </span>
        <span className="progress-text progress-score">
          {score.correct} / {score.total} ✓
        </span>
      </div>

      <div className="quiz-prompt">
        <span className="card-eyebrow">
          {direction === "ar2pl"
            ? (lang === "en" ? "what does it mean?" : "co to znaczy?")
            : (lang === "en" ? "how do you say it?" : "jak po egipsku?")}
        </span>
        {direction === "ar2pl" ? (
          <>
            <span className="quiz-word quiz-word-ar">{correctWord.ar}</span>
            {(difficulty !== "expert" || selected) && (
              <span className="quiz-word-ph">{correctWord.ph}</span>
            )}
          </>
        ) : (
          <span className="quiz-word">{trx(correctWord)}</span>
        )}
      </div>

      <div className="quiz-options">
        {options.map((opt, i) => {
          let stateClass = "";
          if (selected) {
            if (opt.ar === correctWord.ar) stateClass = "opt-correct";
            else if (opt === selected) stateClass = "opt-wrong";
          }
          return (
            <button
              key={i}
              className={`quiz-option ${stateClass}`}
              onClick={() => choose(opt)}
              disabled={!!selected}
            >
              {direction === "ar2pl" ? (
                <span className="opt-pl">{opt.pl}</span>
              ) : (
                <span className="opt-ar-wrap">
                  <bdi className="opt-arabic">{opt.ar}</bdi>
                  {(difficulty !== "expert" || selected) && (
                    <span className="opt-phonetic">{opt.ph}</span>
                  )}
                </span>
              )}
              {selected && opt.ar === correctWord.ar && <Check size={18} className="opt-icon" />}
              {selected && opt === selected && opt.ar !== correctWord.ar && <X size={18} className="opt-icon" />}
            </button>
          );
        })}
      </div>

      {selected && (() => {
        const usage = correctWord.ex || findUsageExample(correctWord);
        return (
          <div className="quiz-reveal">
            <div className="quiz-reveal-word">
              <span className="quiz-reveal-ar">{correctWord.ar}</span>
              <span className="quiz-reveal-ph">{correctWord.ph}</span>
              <span className="quiz-reveal-pl">{trx(correctWord)}</span>
            </div>
            {usage ? (
              <div className="quiz-reveal-ex">
                <span className="quiz-reveal-ex-label">{ui("przykład użycia")}</span>
                <span className="quiz-reveal-ex-ar">{usage.ar}</span>
                <span className="quiz-reveal-ex-ph">{usage.ph}</span>
                <span className="quiz-reveal-ex-pl">„{trx(usage)}”</span>
              </div>
            ) : null}
          </div>
        );
      })()}

      {selected && (
        <button className="nav-btn nav-btn-primary nav-btn-full" onClick={nextQuestion}>
          {idx + 1 >= pool.length
            ? (lang === "en" ? "see result" : "zobacz wynik")
            : (lang === "en" ? "next word" : "następne słowo")} →
        </button>
      )}
    </div>
  );
}

// ---------- Widok: Lista / edycja ----------
function ListView({ words, setWords, activeCat, onToggleFlag, onToggleVerified, onSaveExample, onEditCard }) {
  const ui = useUi();
  const lang = useLang();
  const trx = useTr();
  const [pl, setPl] = useState("");
  const [ar, setAr] = useState("");
  const [ph, setPh] = useState("");
  const [cat, setCat] = useState(activeCat !== "all" ? activeCat : "other");
  const [exAr, setExAr] = useState("");
  const [exPh, setExPh] = useState("");
  const [exPl, setExPl] = useState("");
  const fileRef = useRef(null);
  // Wyszukiwarka i filtr statusu nauki
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all"); // all | untouched | inprogress | mastered

  useEffect(() => {
    setCat(activeCat !== "all" ? activeCat : "other");
  }, [activeCat]);

  function addWord(e) {
    e.preventDefault();
    if (!pl.trim() || !ar.trim()) return;
    const word = { cat, pl: pl.trim(), ar: ar.trim(), ph: ph.trim() };
    if (exAr.trim() && exPl.trim()) {
      word.ex = { ar: exAr.trim(), ph: exPh.trim(), pl: exPl.trim() };
    }
    setWords((w) => [...w, word]);
    setPl("");
    setAr("");
    setPh("");
    setExAr("");
    setExPh("");
    setExPl("");
  }

  // Usuwamy po referencji do obiektu, nie po indeksie filtrowanej listy,
  // żeby działało poprawnie również przy aktywnym filtrze kategorii.
  function removeWord(wordToRemove) {
    setWords((w) => w.filter((item) => item !== wordToRemove));
  }

  function resetToSeed() {
    try {
      localStorage.removeItem(progressKey());
    } catch (e) {}
    setWords(freshDeck());
  }

  function clearAll() {
    setWords([]);
  }

  function importCsv(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const text = String(reader.result || "");
      const rows = text
        .split("\n")
        .map((r) => r.trim())
        .filter(Boolean);
      const parsed = rows
        .map((r) => r.split(","))
        .filter((cols) => cols.length >= 2)
        .map((cols) => {
          const word = {
            cat: cat,
            pl: cols[0]?.trim() ?? "",
            ar: cols[1]?.trim() ?? "",
            ph: cols[2]?.trim() ?? "",
          };
          const exAr = cols[3]?.trim();
          const exPh = cols[4]?.trim();
          const exPl = cols[5]?.trim();
          if (exAr && exPl) word.ex = { ar: exAr, ph: exPh ?? "", pl: exPl };
          return word;
        })
        .filter((w) => w.pl && w.ar);
      if (parsed.length) setWords((w) => [...w, ...parsed]);
    };
    reader.readAsText(file);
    e.target.value = "";
  }

  const baseVisible =
    activeCat === "review"
      ? words
          .filter((w) => (w.wrongCount || 0) > 0 || w.flagged)
          .sort((a, b) => {
            const scoreA = (a.wrongCount || 0) * 2 - (a.correctCount || 0) * 0.5 + (a.flagged ? 2 : 0);
            const scoreB = (b.wrongCount || 0) * 2 - (b.correctCount || 0) * 0.5 + (b.flagged ? 2 : 0);
            return scoreB - scoreA;
          })
      : activeCat === "flagged"
      ? words.filter((w) => w.flagged)
      : activeCat === "verified"
      ? words.filter((w) => w.verified)
      : activeCat === "all"
      ? words
      : words.filter((w) => (w.cat || "other") === activeCat);

  const q = normalizeSearch(search.trim());
  const visibleWords = baseVisible.filter((w) => {
    if (statusFilter !== "all" && wordStatus(w) !== statusFilter) return false;
    if (!q) return true;
    return (
      normalizeSearch(w.pl).includes(q) ||
      normalizeSearch(w.ph).includes(q) ||
      (w.ar || "").includes(search.trim())
    );
  });

  return (
    <div className="view-list">
      <form className="add-form" onSubmit={addWord}>
        <input
          className="text-input"
          placeholder={ui("polski (np. dom)")}
          value={pl}
          onChange={(e) => setPl(e.target.value)}
        />
        <input
          className="text-input input-arabic"
          placeholder={ui("arabski (np. بيت)")}
          value={ar}
          onChange={(e) => setAr(e.target.value)}
        />
        <input
          className="text-input input-mono"
          placeholder={ui("transkrypcja (np. beet)")}
          value={ph}
          onChange={(e) => setPh(e.target.value)}
        />
        <select
          className="text-input cat-select"
          value={cat}
          onChange={(e) => setCat(e.target.value)}
        >
          {CATEGORIES.map((c) => (
            <option key={c.key} value={c.key}>
              {c.emoji} {catLabel(c, lang)}
            </option>
          ))}
        </select>
        <div className="example-divider">{ui("przykład użycia (opcjonalnie)")}</div>
        <input
          className="text-input input-arabic"
          placeholder={ui("zdanie po arabsku")}
          value={exAr}
          onChange={(e) => setExAr(e.target.value)}
        />
        <input
          className="text-input input-mono"
          placeholder={ui("transkrypcja zdania")}
          value={exPh}
          onChange={(e) => setExPh(e.target.value)}
        />
        <input
          className="text-input example-pl-input"
          placeholder={ui("tłumaczenie zdania")}
          value={exPl}
          onChange={(e) => setExPl(e.target.value)}
        />
        <button className="nav-btn nav-btn-primary add-submit" type="submit">
          <Plus size={16} style={{ marginRight: 6 }} />
          {lang==="en"?"add":"dodaj"}
        </button>
      </form>

      <div className="list-toolbar">
        <span className="list-count">
          {visibleWords.length} / {words.length} {lang==="en"?"words":"słówek"}
        </span>
        <div className="list-toolbar-actions">
          <button className="text-btn" onClick={() => fileRef.current?.click()}>
            <Upload size={14} style={{ marginRight: 4 }} />
            import CSV
          </button>
          <input
            ref={fileRef}
            type="file"
            accept=".csv,text/csv"
            style={{ display: "none" }}
            onChange={importCsv}
          />
          <button className="text-btn" onClick={resetToSeed}>
            {lang==="en"?"starter set":"zestaw startowy"}
          </button>
          <button className="text-btn text-btn-danger" onClick={clearAll}>
            {ui("wyczyść wszystko")}
          </button>
        </div>
      </div>
      <p className="csv-hint">
        {lang==="en"
          ? "CSV: meaning,arabic,transcription,sentence_ar,sentence_transcr,sentence_pl — the last three columns are optional. Imported words go to the category selected above."
          : "CSV: polski,arabski,transkrypcja,zdanie_ar,zdanie_transkr,zdanie_pl — ostatnie trzy kolumny opcjonalne. Importowane słówka trafią do działu wybranego powyżej."}
      </p>

      <div className="search-bar">
        <input
          type="text"
          className="search-input"
          placeholder={ui("Szukaj: polski, transkrypcja lub arabski…")}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {search && (
          <button
            type="button"
            className="search-clear"
            onClick={() => setSearch("")}
            title={ui("Wyczyść")}
          >
            <X size={15} />
          </button>
        )}
      </div>

      <div className="status-filter-row">
        {[
          { key: "all", label: "wszystkie", labelEn: "all" },
          { key: "untouched", label: "nieprzerobione", labelEn: "untouched" },
          { key: "inprogress", label: "w trakcie", labelEn: "in progress" },
          { key: "mastered", label: "opanowane", labelEn: "mastered" },
        ].map((f) => (
          <button
            key={f.key}
            type="button"
            className={`status-filter-btn ${statusFilter === f.key ? "status-filter-active" : ""}`}
            onClick={() => setStatusFilter(f.key)}
          >
            {lang==="en"&&f.labelEn?f.labelEn:f.label}
          </button>
        ))}
        <span className="status-filter-count">{visibleWords.length} {lang==="en"?"words":"słówek"}</span>
      </div>

      <ul className="word-list">
        {visibleWords.map((w, i) => (
          <li
            className={`word-row ${w.flagged ? "word-row-flagged" : ""} ${
              w.verified ? "word-row-verified" : ""
            }`}
            key={i}
          >
            <div className="word-row-text">
              <div className="word-row-tags">
                <span className="word-cat-tag">{categoryLabel(w.cat, lang)}</span>
                {w.flagged && (
                  <button
                    className="word-flag-tag"
                    onClick={() => onToggleFlag(w, false, "")}
                    title={ui("Kliknij, by usunąć oznaczenie")}
                  >
                    <Flag size={11} />
                    {w.flagNote ? w.flagNote : "do poprawki"}
                  </button>
                )}
                {w.verified && (
                  <button
                    className="word-verified-tag"
                    onClick={() => onToggleVerified(w, false)}
                    title={ui("Kliknij, by usunąć zatwierdzenie")}
                  >
                    <Check size={11} />
                    {ui("sprawdzone")}
                  </button>
                )}
              </div>
              <span className="word-pl">{trx(w)}</span>
              <span className="word-ar">{w.ar}</span>
              <span className="word-ph">{w.ph}</span>
              {w.ex && (
                <span className="word-ex">
                  {w.ex.ar} <span className="word-ex-pl">— {trx(w.ex)}</span>
                </span>
              )}
              <EditExampleButton
                word={w}
                onSaveExample={(ex) => onSaveExample(w, ex)}
                className="new-example-row"
              />
            </div>
            <div className="word-row-actions">
              <button
                className="icon-btn icon-btn-edit"
                onClick={() => onEditCard(w)}
                title={ui("Edytuj fiszkę")}
              >
                <Pencil size={15} />
              </button>
              {!w.verified && (
                <button
                  className="icon-btn icon-btn-verify"
                  onClick={() => onToggleVerified(w, true)}
                  title={ui("Oznacz jako poprawną")}
                >
                  <Check size={15} />
                </button>
              )}
              {!w.flagged && (
                <button
                  className="icon-btn icon-btn-flag"
                  onClick={() => onToggleFlag(w, true, "")}
                  title="Oznacz do poprawki"
                >
                  <Flag size={15} />
                </button>
              )}
              <button className="icon-btn icon-btn-danger" onClick={() => removeWord(w)}>
                <Trash2 size={15} />
              </button>
            </div>
          </li>
        ))}
      </ul>
      {visibleWords.length === 0 && (
        <EmptyState
          text={
            activeCat === "review"
              ? "Brak słówek do powtórki — pojawią się tu po pierwszej pomyłce w quizie albo po oznaczeniu „do poprawki”."
              : activeCat === "flagged"
              ? "Brak słówek oznaczonych do poprawki."
              : activeCat === "verified"
              ? "Brak słówek oznaczonych jako sprawdzone."
              : words.length === 0
              ? "Lista jest pusta. Dodaj słówko powyżej."
              : "W tym dziale nie ma jeszcze żadnych słówek."
          }
        />
      )}
    </div>
  );
}

function EmptyState({ text }) {
  return (
    <div className="empty-state">
      <span>{text}</span>
    </div>
  );
}

// ---------- Modal: dodaj fiszkę (generowana przez AI) ----------
// Prosta, lokalna heurystyka dopasowania kategorii na podstawie słów kluczowych
// w polskim tekście — działa od razu, bez połączenia z siecią.
const CATEGORY_KEYWORDS = {
  food_shopping: ["jedzeni", "restaurac", "kelner", "menu", "kupi", "sklep", "cena", "kosztuj", "zakup", "płac", "pieniąd", "kawa", "herbat", "chleb", "ryż", "ser", "mlek"],
  home_hotel: ["dom", "pok", "hotel", "łazienk", "łóżk", "klucz", "okno", "kuchni", "mieszkani"],
  travel: ["autobus", "podróż", "taksów", "bilet", "samolot", "lotnisk", "jad", "jedzie", "piramid", "wycieczk"],
  body_services: ["głow", "ręk", "noga", "but", "brzuch", "serc", "boli", "naprawi", "krawc", "guzik"],
  family: ["mąż", "żon", "brat", "siostr", "mam", "tat", "babci", "dziadek", "rodzin", "kochan", "przyjaciel"],
  numbers_time: ["godzin", "minut", "ile", "kiedy", "dzień", "tydzień", "miesiąc", "rok", "liczb", "stopni", "pogod"],
  calendar: ["poniedziałek", "wtorek", "środ", "czwartek", "piątek", "sobot", "niedziel", "styczeń", "luty", "marzec", "lato", "zima", "wiosn", "jesień"],
  feelings: ["czuj", "zmęczon", "głodn", "zadowolon", "smutn", "szczęśliw", "boj", "lubi", "kocham"],
  work_daily: ["prac", "biur", "szkoł", "myśl", "rozumie", "chc", "muszę", "potrzebuj"],
  questions: ["czy ", "gdzie", "jak ", "co ", "kto ", "?"],
};

function guessCategory(text) {
  const lower = text.toLowerCase();
  for (const [cat, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    if (keywords.some((kw) => lower.includes(kw))) return cat;
  }
  return "other";
}

const ARABIC_RANGE = /[\u0600-\u06FF]/;

function CardFormModal({ onClose, onSave, onDelete, initial }) {
  const ui = useUi();
  const lang = useLang();
  const isEditing = !!initial;
  const [pl, setPl] = useState(initial?.pl || "");
  const [ar, setAr] = useState(initial?.ar || "");
  const [ph, setPh] = useState(initial?.ph || "");
  const [cat, setCat] = useState(initial?.cat || "other");
  const [catTouched, setCatTouched] = useState(isEditing);
  const [exAr, setExAr] = useState(initial?.ex?.ar || "");
  const [exPh, setExPh] = useState(initial?.ex?.ph || "");
  const [exPl, setExPl] = useState(initial?.ex?.pl || "");
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  // Auto-sugestia kategorii, dopóki użytkownik nie wybierze jej sam (tylko przy dodawaniu).
  function handlePlChange(value) {
    setPl(value);
    if (!catTouched) {
      const guessed = guessCategory(value);
      if (guessed !== "other") setCat(guessed);
    }
  }

  const arLooksArabic = ar.trim() === "" || ARABIC_RANGE.test(ar);
  const canSubmit = pl.trim() && ar.trim() && ph.trim();

  function handleSubmit(e) {
    e.preventDefault();
    if (!canSubmit) return;
    const word = { cat, pl: pl.trim(), ar: ar.trim(), ph: ph.trim() };
    if (exAr.trim() && exPl.trim()) {
      word.ex = { ar: exAr.trim(), ph: exPh.trim(), pl: exPl.trim() };
    }
    if (isEditing) {
      // Zachowujemy flagi/notatki, zmieniamy tylko treść fiszki.
      word.flagged = initial.flagged;
      word.flagNote = initial.flagNote;
      word.verified = initial.verified;
    }
    onSave(word);
    onClose();
  }

  function handleDelete() {
    onDelete();
    onClose();
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{isEditing ? "Edytuj fiszkę" : "Dodaj fiszkę"}</h2>
          <button className="modal-close" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <input
            autoFocus
            className="text-input"
            placeholder={ui("polski (np. czy mogę prosić o rachunek?)")}
            value={pl}
            onChange={(e) => handlePlChange(e.target.value)}
          />
          <input
            className="text-input input-arabic"
            placeholder={ui("arabski (np. ممكن الفاتورة؟)")}
            value={ar}
            onChange={(e) => setAr(e.target.value)}
          />
          {!arLooksArabic && (
            <p className="modal-warning">{ui('To pole nie wygląda na zapisane pismem arabskim — sprawdź, czy nie wpisałeś transkrypcji w tym miejscu.')}</p>
          )}
          <input
            className="text-input input-mono"
            placeholder="transkrypcja (np. momken el-fatuura?)"
            value={ph}
            onChange={(e) => setPh(e.target.value)}
          />
          <select
            className="text-input cat-select"
            value={cat}
            onChange={(e) => {
              setCat(e.target.value);
              setCatTouched(true);
            }}
          >
            {CATEGORIES.map((c) => (
              <option key={c.key} value={c.key}>
                {c.emoji} {catLabel(c, lang)}
              </option>
            ))}
          </select>
          {!isEditing && !catTouched && cat !== "other" && (
            <p className="modal-hint">{ui('Dział dobrany automatycznie na podstawie treści — możesz go zmienić powyżej.')}</p>
          )}

          <div className="example-divider">{ui("przykład użycia (opcjonalnie)")}</div>
          <input
            className="text-input input-arabic"
            placeholder={ui("zdanie po arabsku")}
            value={exAr}
            onChange={(e) => setExAr(e.target.value)}
          />
          <input
            className="text-input input-mono"
            placeholder={ui("transkrypcja zdania")}
            value={exPh}
            onChange={(e) => setExPh(e.target.value)}
          />
          <input
            className="text-input example-pl-input"
            placeholder={ui("tłumaczenie zdania")}
            value={exPl}
            onChange={(e) => setExPl(e.target.value)}
          />

          {(pl.trim() || ar.trim()) && (
            <div className="modal-preview">
              <span className="modal-preview-label">{ui("podgląd fiszki")}</span>
              <span className="word-cat-tag">{categoryLabel(cat, lang)}</span>
              <span className="word-pl">{pl.trim() || "…"}</span>
              <span className="word-ar">{ar.trim() || "…"}</span>
              <span className="word-ph">{ph.trim() || "…"}</span>
              {exAr.trim() && exPl.trim() && (
                <span className="word-ex">
                  {exAr.trim()} <span className="word-ex-pl">— {exPl.trim()}</span>
                </span>
              )}
            </div>
          )}

          <button className="nav-btn nav-btn-primary modal-submit" type="submit" disabled={!canSubmit}>
            {isEditing ? (
              <>
                <Check size={16} style={{ marginRight: 6 }} />
                zapisz zmiany
              </>
            ) : (
              <>
                <Plus size={16} style={{ marginRight: 6 }} />
                dodaj do listy
              </>
            )}
          </button>

          {isEditing && (
            <div className="modal-delete-zone">
              {confirmingDelete ? (
                <div className="modal-delete-confirm">
                  <span>{ui("Usunąć tę fiszkę na zawsze?")}</span>
                  <div className="modal-delete-confirm-actions">
                    <button type="button" className="text-btn" onClick={() => setConfirmingDelete(false)}>
                      nie
                    </button>
                    <button type="button" className="text-btn text-btn-danger" onClick={handleDelete}>
                      tak, usuń
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  className="text-btn text-btn-danger"
                  onClick={() => setConfirmingDelete(true)}
                >
                  <Trash2 size={13} style={{ marginRight: 4 }} />
                  usuń fiszkę
                </button>
              )}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

// ---------- Widok: Czasowniki ----------
const TENSE_TABS = [
  { key: "present", label: "teraźniejszy", labelEn: "present", arLabel: "المضارع" },
  { key: "past", label: "przeszły", labelEn: "past", arLabel: "الماضي" },
  { key: "future", label: "przyszły", labelEn: "future", arLabel: "المستقبل" },
];

function VerbsView() {
  const lang = useLang();
  const ui = useUi();
  const [openIdx, setOpenIdx] = useState(0);
  const [tense, setTense] = useState("present");
  // Stan sekcji modalnej
  const [modalKey, setModalKey] = useState(MODALS[0].key);
  const [baseKey, setBaseKey] = useState(BASE_VERBS[0].key);
  const [modalTense, setModalTense] = useState("present");
  // Tabela wzorów odmiany
  const [showPattern, setShowPattern] = useState(false);
  const [patternTense, setPatternTense] = useState("present");
  // Tabela czasowników nieregularnych
  const [showIrregular, setShowIrregular] = useState(false);
  const activeModal = MODALS.find((m) => m.key === modalKey);
  const activeBase = BASE_VERBS.find((b) => b.key === baseKey);
  const pat = CONJ_PATTERN[patternTense];

  return (
    <div className="view-verbs">
      <p className="verbs-intro">{ui('Odmiana podstawowych czasowników przez wszystkie osoby, w trzech czasach. Stuknij czasownik, aby zobaczyć pełną tabelę, i przełącz czas powyżej niej.')}</p>

      {/* Tabela wzorów odmiany */}
      <div className="pattern-box">
        <button
          className="pattern-toggle"
          onClick={() => setShowPattern((v) => !v)}
        >
          <span>📐 {lang==="en"?"Conjugation patterns (prefixes & endings)":"Wzory odmiany (przedrostki i końcówki)"}</span>
          <span className="pattern-chevron">{showPattern ? "−" : "+"}</span>
        </button>
        {showPattern && (
          <div className="pattern-body">
            <p className="pattern-intro">{ui('Schemat na przykładzie regularnego czasownika')}<strong>كتب</strong> (k-t-b,
              „pisać"). Te same przedrostki i końcówki działają dla większości
              czasowników trójspółgłoskowych — wystarczy podstawić rdzeń.
            </p>
            <div className="tense-tabs">
              {[
                { key: "present", label: "teraźniejszy" },
                { key: "past", label: "przeszły" },
                { key: "future", label: "przyszły" },
              ].map((t) => (
                <button
                  key={t.key}
                  className={`tense-tab ${patternTense === t.key ? "tense-tab-active" : ""}`}
                  onClick={() => setPatternTense(t.key)}
                >
                  {lang==="en"&&t.labelEn?t.labelEn:t.label}
                </button>
              ))}
            </div>
            <p className="pattern-rule">{lang==="en"&&pat.noteEn?pat.noteEn:pat.note}</p>
            <table className="pattern-table">
              <thead>
                <tr>
                  <th>{ui("osoba")}</th>
                  <th>{ui("wzór")}</th>
                  <th>{ui("przykład")}</th>
                </tr>
              </thead>
              <tbody>
                {pat.rows.map((r) => {
                  const pron = PRONOUNS.find((p) => p.key === r.pron);
                  return (
                    <tr key={r.pron}>
                      <td className="pattern-pron">{pron ? pron.pl : r.pron}</td>
                      <td className="pattern-affix">{r.prefix}</td>
                      <td className="pattern-example">
                        <span className="pattern-ar">{r.ar}</span>
                        <span className="pattern-ph">{r.ph}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Tabela czasowników nieregularnych */}
      <div className="pattern-box">
        <button
          className="pattern-toggle"
          onClick={() => setShowIrregular((v) => !v)}
        >
          <span>🔀 Czasowniki nieregularne (typy)</span>
          <span className="pattern-chevron">{showIrregular ? "−" : "+"}</span>
        </button>
        {showIrregular && (
          <div className="pattern-body">
            <p className="pattern-intro">
              Nieregularność w egipskim jest przewidywalna — zależy od tego, która
              spółgłoska rdzenia jest „słaba". Poniżej cztery typy; dla każdego widać,
              jak zmienia się temat między czasami (na osobach <em>on / ja / oni</em>).
            </p>
            {IRREGULAR_PATTERNS.map((grp) => (
              <div className="irr-group" key={grp.key}>
                <h4 className="irr-title">{grp.title}</h4>
                <p className="irr-desc">{grp.desc}</p>
                <p className="irr-example">{grp.example}</p>
                <table className="pattern-table irr-table">
                  <thead>
                    <tr>
                      <th>{ui("osoba")}</th>
                      <th>{ui("teraźn.")}</th>
                      <th>{ui("przeszły")}</th>
                      <th>{ui("przyszły")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {grp.rows.map((r) => {
                      const pron = PRONOUNS.find((p) => p.key === r.pron);
                      return (
                        <tr key={r.pron}>
                          <td className="pattern-pron">{pron ? pron.pl : r.pron}</td>
                          <td className="irr-cell">
                            <span className="irr-ar">{r.present.ar}</span>
                            <span className="irr-ph">{r.present.ph}</span>
                          </td>
                          <td className="irr-cell irr-cell-hl">
                            <span className="irr-ar">{r.past.ar}</span>
                            <span className="irr-ph">{r.past.ph}</span>
                          </td>
                          <td className="irr-cell">
                            <span className="irr-ar">{r.future.ar}</span>
                            <span className="irr-ph">{r.future.ph}</span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                <p className="pattern-rule irr-note">{lang==="en"&&grp.noteEn?grp.noteEn:grp.note}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <ul className="verb-list">
        {VERBS.map((v, i) => {
          const isOpen = openIdx === i;
          const forms = v.tenses[tense];
          return (
            <li className="verb-card" key={i}>
              <button
                className="verb-card-header"
                onClick={() => setOpenIdx(isOpen ? -1 : i)}
              >
                <div className="verb-card-title">
                  <span className="verb-card-pl">{lang==="en"&&v.en?v.en:v.pl}</span>
                  <span className="verb-card-ar">{v.ar}</span>
                  <span className="verb-card-ph">{v.ph}</span>
                </div>
                <span className={`verb-caret ${isOpen ? "verb-caret-open" : ""}`}>▾</span>
              </button>

              {isOpen && (
                <div className="verb-table">
                  <div className="tense-tabs">
                    {TENSE_TABS.map((t) => (
                      <button
                        key={t.key}
                        type="button"
                        className={`tense-tab ${tense === t.key ? "tense-tab-active" : ""}`}
                        onClick={() => setTense(t.key)}
                      >
                        {lang==="en"&&t.labelEn?t.labelEn:t.label}
                      </button>
                    ))}
                  </div>
                  {v.note && tense === "present" && <p className="verb-note">{lang==="en"&&v.noteEn?v.noteEn:v.note}</p>}
                  {forms.map((f, j) => {
                    const pronoun = PRONOUNS.find((p) => p.key === f.pronoun);
                    return (
                      <div className="verb-row" key={j}>
                        <div className="verb-pronoun-stack">
                          <span className="verb-pronoun">{pronoun?.ar}</span>
                          <span className="verb-pronoun-ph">{pronoun?.ph}</span>
                        </div>
                        <span className="verb-pronoun-pl">{pronoun?.pl}</span>
                        <div className="verb-form-stack">
                          <span className="verb-form-ar">{f.ar}</span>
                          <span className="verb-form-ph">{f.ph}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </li>
          );
        })}
      </ul>

      {/* ---- Konstrukcje modalne: modalny + czasownik bazowy ---- */}
      <div className="modal-section">
        <h3 className="modal-section-title">{ui("Czasowniki modalne + czasownik bazowy")}</h3>
        <p className="verbs-intro">{ui('Wybierz czasownik modalny i czasownik bazowy — tabela pokaże, jak łączą się przez wszystkie osoby. Czasownik bazowy stoi w trybie łączącym (subjunctive), czyli bez przedrostka „بـ”.')}</p>

        <div className="modal-picker-label">{ui("Czasownik modalny")}</div>
        <div className="modal-chip-row">
          {MODALS.map((m) => (
            <button
              key={m.key}
              type="button"
              className={`modal-chip ${modalKey === m.key ? "modal-chip-active" : ""}`}
              onClick={() => setModalKey(m.key)}
            >
              <span className="modal-chip-ar">{m.ar}</span>
              <span className="modal-chip-pl">{lang==="en"&&m.en?m.en:m.pl.split(" ")[0]}</span>
            </button>
          ))}
        </div>

        <div className="modal-picker-label">{ui("Czasownik bazowy")}</div>
        <div className="modal-chip-row">
          {BASE_VERBS.map((b) => (
            <button
              key={b.key}
              type="button"
              className={`modal-chip ${baseKey === b.key ? "modal-chip-active" : ""}`}
              onClick={() => setBaseKey(b.key)}
            >
              <span className="modal-chip-ar">{b.ar}</span>
              <span className="modal-chip-pl">{lang==="en"&&b.en?b.en:b.pl.split(" ")[0]}</span>
            </button>
          ))}
        </div>

        <div className="verb-card modal-result-card">
          <div className="verb-table">
            <div className="tense-tabs">
              {TENSE_TABS.map((t) => (
                <button
                  key={t.key}
                  type="button"
                  className={`tense-tab ${modalTense === t.key ? "tense-tab-active" : ""}`}
                  onClick={() => setModalTense(t.key)}
                >
                  {lang==="en"&&t.labelEn?t.labelEn:t.label}
                </button>
              ))}
            </div>
            {activeModal?.note && modalTense === "present" && (
              <p className="verb-note">{lang==="en"&&activeModal.noteEn?activeModal.noteEn:activeModal.note}</p>
            )}
            {PRONOUNS.map((p, j) => {
              const composed = composeModal(activeModal, activeBase, modalTense, p.key);
              if (!composed) return null;
              return (
                <div className="verb-row" key={j}>
                  <div className="verb-pronoun-stack">
                    <span className="verb-pronoun">{p.ar}</span>
                    <span className="verb-pronoun-ph">{p.ph}</span>
                  </div>
                  <span className="verb-pronoun-pl">{p.pl}</span>
                  <div className="verb-form-stack">
                    <span className="verb-form-ar">{composed.ar}</span>
                    <span className="verb-form-ph">{composed.ph}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------- Widok: Rzeczowniki ----------
const NOUN_NUM_TABS = [
  { key: "sing", label: "pojedyncza", labelEn: "singular", arLabel: "المفرد" },
  { key: "dual", label: "podwójna", labelEn: "dual", arLabel: "المثنى" },
  { key: "plur", label: "mnoga", labelEn: "plural", arLabel: "الجمع" },
];

function NounsView() {
  const ui = useUi();
  const lang = useLang();
  const [openIdx, setOpenIdx] = useState(0);
  // Sekcja dzierżawcza — niezależny wybór rzeczownika
  const possNouns = NOUNS.filter((n) => n.poss);
  const [possIdx, setPossIdx] = useState(0);
  const activePoss = possNouns[possIdx];

  return (
    <div className="view-verbs">
      <p className="verbs-intro">{ui('Podstawowe rzeczowniki w trzech liczbach: pojedynczej, podwójnej (dual) i mnogiej, z oznaczeniem rodzaju. Stuknij rzeczownik, aby rozwinąć pełną tabelę.')}</p>
      <ul className="verb-list">
        {NOUNS.map((n, i) => {
          const isOpen = openIdx === i;
          const g = n.genOverride || n.gen;
          const genLabel = lang === "en" ? (g === "f" ? "f." : "m.") : (g === "f" ? "r.ż." : "r.m.");
          const rows = [
            { key: "sing", form: n.sing },
            { key: "dual", form: n.dual },
            { key: "plur", form: n.plur },
          ];
          return (
            <li className="verb-card" key={i}>
              <button
                className="verb-card-header"
                onClick={() => setOpenIdx(isOpen ? -1 : i)}
              >
                <div className="verb-card-title">
                  <span className="verb-card-pl">
                    {lang === "en" && n.nounEn ? n.nounEn : n.pl}
                    <span className={`noun-gender noun-gender-${g}`}>{genLabel}</span>
                  </span>
                  <span className="verb-card-ar">{n.sing.ar}</span>
                  <span className="verb-card-ph">{n.sing.ph}</span>
                </div>
                <span className={`verb-caret ${isOpen ? "verb-caret-open" : ""}`}>▾</span>
              </button>

              {isOpen && (
                <div className="verb-table">
                  {n.note && <p className="verb-note">{lang==="en"&&n.noteEn?n.noteEn:n.note}</p>}
                  {rows.map((r, j) => {
                    const tab = NOUN_NUM_TABS.find((t) => t.key === r.key);
                    return (
                      <div className="verb-row" key={j}>
                        <div className="verb-pronoun-stack">
                          <span className="verb-pronoun-pl">{lang === "en" && tab?.labelEn ? tab.labelEn : tab?.label}</span>
                          <span className="verb-pronoun-ph">{tab?.arLabel}</span>
                        </div>
                        <span className="verb-pronoun-pl" />
                        <div className="verb-form-stack">
                          <span className="verb-form-ar">{r.form.ar}</span>
                          <span className="verb-form-ph">{r.form.ph}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </li>
          );
        })}
      </ul>

      {/* ---- Zaimki dzierżawcze (sufiksy) ---- */}
      <div className="modal-section">
        <h3 className="modal-section-title">{ui("Zaimki dzierżawcze (sufiksy)")}</h3>
        <p className="verbs-intro">{ui('W egipskim „mój / twój / jego…” to sufiks doklejany do rzeczownika, nie osobne słowo. Wybierz rzeczownik — tabela pokaże wszystkie osiem form.')}</p>

        <div className="modal-picker-label">{ui("Rzeczownik")}</div>
        <div className="modal-chip-row">
          {possNouns.map((n, i) => (
            <button
              key={i}
              type="button"
              className={`modal-chip ${possIdx === i ? "modal-chip-active" : ""}`}
              onClick={() => setPossIdx(i)}
            >
              <span className="modal-chip-ar">{n.sing.ar}</span>
              <span className="modal-chip-pl">{lang==="en"&&n.nounEn?n.nounEn:n.pl.split(" ")[0].replace("/", "")}</span>
            </button>
          ))}
        </div>

        <div className="verb-card modal-result-card">
          <div className="verb-table">
            <p className="verb-note">
              <strong>{lang==="en"&&activePoss.nounEn?activePoss.nounEn:activePoss.pl}</strong> — {activePoss.sing.ar} ({activePoss.sing.ph})
            </p>
            {activePoss.possNote && <p className="verb-note">{lang==="en"&&activePoss.possNoteEn?activePoss.possNoteEn:activePoss.possNote}</p>}
            {POSS_SUFFIXES.map((suf, j) => {
              const form = activePoss.poss[suf.key];
              if (!form) return null;
              return (
                <div className="verb-row" key={j}>
                  <div className="verb-pronoun-stack">
                    <span className="verb-pronoun">{suf.suf}</span>
                    <span className="verb-pronoun-ph">{suf.ph}</span>
                  </div>
                  <span className="verb-pronoun-pl">{lang==="en"&&suf.en?suf.en:suf.pl}</span>
                  <div className="verb-form-stack">
                    <span className="verb-form-ar">{form.ar}</span>
                    <span className="verb-form-ph">{form.ph}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------- Widok: Zaimki pytające ----------
function QuestionsView() {
  const lang = useLang();
  const ui = useUi();
  const trx = useTr();
  return (
    <div className="view-verbs">
      <p className="verbs-intro">{ui('Zaimki pytające egipskiego arabskiego. Uwaga na szyk — zaimek często stoi na końcu zdania (np. „ismak eeh?” = „jak masz na imię?”). Każdy z przykładem użycia.')}</p>
      <ul className="qw-list">
        {QUESTION_WORDS.map((q, i) => (
          <li className="qw-card" key={i}>
            <div className="qw-head">
              <div className="qw-main">
                <span className="qw-ar">{q.ar}</span>
                <span className="qw-ph">{q.ph}</span>
              </div>
              <span className="qw-pl">{lang==="en"&&q.en?q.en:q.pl}</span>
            </div>
            {q.note && <p className="verb-note qw-note">{lang==="en"&&q.noteEn?q.noteEn:q.note}</p>}
            {q.ex && (
              <div className="qw-example">
                <span className="qw-ex-ar">{q.ex.ar}</span>
                <span className="qw-ex-ph">{q.ex.ph}</span>
                <span className="qw-ex-pl">{trx(q.ex)}</span>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

// ---------- Widok: Gramatyka (wskazujące / liczebniki / przyimki) ----------
const GRAMMAR_SECTIONS = [
  { key: "demons", label: "wskazujące", labelEn: "demonstratives" },
  { key: "numerals", label: "liczebniki", labelEn: "numbers" },
  { key: "bignum", label: "11–100", labelEn: "11–100" },
  { key: "compar", label: "stopniowanie", labelEn: "comparison" },
  { key: "imper", label: "rozkaźnik", labelEn: "imperative" },
  { key: "preps", label: "przyimki", labelEn: "prepositions" },
  { key: "negation", label: "negacja", labelEn: "negation" },
];

function GrammarView() {
  const lang = useLang();
  const ui = useUi();
  const trx = useTr();
  const [section, setSection] = useState("demons");
  const [openPrep, setOpenPrep] = useState(0);
  // Kompozytor: liczba + rzeczownik
  const [countNum, setCountNum] = useState(3);
  const [countNounIdx, setCountNounIdx] = useState(0);
  const countNoun = NOUNS[countNounIdx];
  const composed = composeCount(countNum, countNoun);
  // Negacja: tryb samosprawdzenia (ukryte przeczenia, odsłaniane stuknięciem)
  const [negTest, setNegTest] = useState(false);
  const [negRevealed, setNegRevealed] = useState(() => new Set());

  return (
    <div className="view-verbs">
      <div className="tense-tabs grammar-tabs">
        {GRAMMAR_SECTIONS.map((s) => (
          <button
            key={s.key}
            type="button"
            className={`tense-tab ${section === s.key ? "tense-tab-active" : ""}`}
            onClick={() => setSection(s.key)}
          >
            {lang==="en"&&s.labelEn?s.labelEn:s.label}
          </button>
        ))}
      </div>

      {/* Zaimki wskazujące */}
      {section === "demons" && (
        <>
          <p className="verbs-intro">{ui('Zaimki wskazujące: ده (m.) / دي (f.) / دول (l.mn.). Zwykle stoją PO rzeczowniku z rodzajnikiem: „il-beet da” = „ten dom”.')}</p>
          <ul className="qw-list">
            {DEMONSTRATIVES.map((d, i) => (
              <li className="qw-card" key={i}>
                <div className="qw-head">
                  <div className="qw-main">
                    <span className="qw-ar">{d.ar}</span>
                    <span className="qw-ph">{d.ph}</span>
                  </div>
                  <span className="qw-pl">{lang==="en"&&d.en?d.en:d.pl}</span>
                </div>
                {d.note && <p className="verb-note qw-note">{lang==="en"&&d.noteEn?d.noteEn:d.note}</p>}
                {d.ex && (
                  <div className="qw-example">
                    <span className="qw-ex-ar">{d.ex.ar}</span>
                    <span className="qw-ex-ph">{d.ex.ph}</span>
                    <span className="qw-ex-pl">{trx(d.ex)}</span>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </>
      )}

      {/* Liczebniki */}
      {section === "numerals" && (
        <>
          <p className="verbs-intro">{ui('Liczebniki 1–10. Kluczowe reguły: „2” zastępuje dual (yomeen = 2 dni), a 3–10 stoją przed rzeczownikiem w liczbie MNOGIEJ, często w formie skróconej.')}</p>

          {/* Kompozytor: liczba + rzeczownik */}
          <div className="modal-section count-composer">
            <h3 className="modal-section-title">{ui("Złóż frazę: liczba + rzeczownik")}</h3>

            <div className="modal-picker-label">{ui("Liczba")}</div>
            <div className="modal-chip-row">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((n) => (
                <button
                  key={n}
                  type="button"
                  className={`modal-chip count-chip ${countNum === n ? "modal-chip-active" : ""}`}
                  onClick={() => setCountNum(n)}
                >
                  <span className="modal-chip-pl count-chip-num">{n}</span>
                </button>
              ))}
            </div>

            <div className="modal-picker-label">{ui("Rzeczownik")}</div>
            <div className="modal-chip-row">
              {NOUNS.map((n, i) => (
                <button
                  key={i}
                  type="button"
                  className={`modal-chip ${countNounIdx === i ? "modal-chip-active" : ""}`}
                  onClick={() => setCountNounIdx(i)}
                >
                  <span className="modal-chip-ar">{n.sing.ar}</span>
                  <span className="modal-chip-pl">{lang==="en"&&n.nounEn?n.nounEn:n.pl.split(" ")[0].replace("/", "")}</span>
                </button>
              ))}
            </div>

            <div className="count-result">
              <div className="count-result-main">
                <span className="count-result-ar">{composed.ar}</span>
                <span className="count-result-ph">{composed.ph}</span>
              </div>
              <p className="verb-note count-result-rule">{composed.rule}</p>
            </div>
          </div>

          <ul className="num-grid">
            {NUMERALS.map((n, i) => (
              <li className="num-card" key={i}>
                <div className="num-head">
                  <span className="num-digit">{n.pl}</span>
                  <div className="num-forms">
                    <span className="num-ar">{n.ar}</span>
                    <span className="num-ph">{n.ph}</span>
                  </div>
                </div>
                {n.note && <p className="verb-note num-note">{lang==="en"&&n.noteEn?n.noteEn:n.note}</p>}
              </li>
            ))}
          </ul>
        </>
      )}

      {/* Przyimki z sufiksami */}
      {section === "preps" && (
        <>
          <p className="verbs-intro">{ui('Przyimki łączą się z sufiksami zaimkowymi (ja/ty/on…). Stuknij przyimek, aby rozwinąć pełną odmianę. Formy są nieregularne — warto zapamiętać całościowo.')}</p>
          <ul className="verb-list">
            {PREPOSITIONS.map((p, i) => {
              const isOpen = openPrep === i;
              return (
                <li className="verb-card" key={i}>
                  <button
                    className="verb-card-header"
                    onClick={() => setOpenPrep(isOpen ? -1 : i)}
                  >
                    <div className="verb-card-title">
                      <span className="verb-card-pl">{p.pl}</span>
                      <span className="verb-card-ar">{p.ar}</span>
                      <span className="verb-card-ph">{p.ph}</span>
                    </div>
                    <span className={`verb-caret ${isOpen ? "verb-caret-open" : ""}`}>▾</span>
                  </button>
                  {isOpen && (
                    <div className="verb-table">
                      {p.note && <p className="verb-note">{lang==="en"&&p.noteEn?p.noteEn:p.note}</p>}
                      {PREP_SUFFIXES.map((suf, j) => {
                        const f = p.forms[suf.key];
                        if (!f) return null;
                        return (
                          <div className="verb-row" key={j}>
                            <div className="verb-pronoun-stack">
                              <span className="verb-pronoun-pl">{lang==="en"&&suf.en?suf.en:suf.pl}</span>
                              <span className="verb-pronoun-ph">{suf.ph}</span>
                            </div>
                            <span className="verb-pronoun-pl" />
                            <div className="verb-form-stack">
                              <span className="verb-form-ar">{f.ar}</span>
                              <span className="verb-form-ph">{f.ph}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </>
      )}

      {/* Negacja */}
      {section === "negation" && (
        <>
          <p className="verbs-intro">
            {lang === "en" ? (
              <>Two systems: <strong>ma-…-sh</strong> wraps the frame around a verb (baruu7 → ma-baruu7-sh), while <strong>mish</strong> negates everything else — adjectives, nouns, participles (mish 3aayez!), and the future tense (mish haruu7).</>
            ) : (
              <>Dwa systemy: <strong>ma-…-sh</strong> obejmuje klamrą czasownik (baruu7 → ma-baruu7-sh), a <strong>mish</strong> neguje wszystko inne — przymiotniki, rzeczowniki, imiesłowy (mish 3aayez!) oraz czas przyszły (mish haruu7).</>
            )}
          </p>

          <div className="neg-test-row">
            <button
              type="button"
              className={`status-filter-btn ${negTest ? "status-filter-active" : ""}`}
              onClick={() => {
                setNegTest((v) => !v);
                setNegRevealed(new Set());
              }}
            >
              {negTest
                ? (lang === "en" ? "study mode: show all" : "tryb nauki: pokaż wszystko")
                : (lang === "en" ? "test yourself: hide negations" : "sprawdź się: ukryj przeczenia")}
            </button>
          </div>

          <ul className="qw-list">
            {NEGATION_EXAMPLES.map((n, i) => {
              const hidden = negTest && !negRevealed.has(i);
              return (
                <li className="qw-card" key={i}>
                  <div className="neg-head">
                    <span className={`neg-rule neg-rule-${n.rule === "mish" ? "mish" : "mash"}`}>
                      {n.rule}
                    </span>
                    <span className="neg-pl">{lang==="en"&&n.en?n.en:n.pl}</span>
                  </div>
                  <div className="neg-pair">
                    <div className="neg-line">
                      <span className="qw-ex-ar">{n.aff.ar}</span>
                      <span className="qw-ex-ph">{n.aff.ph}</span>
                    </div>
                    <span className="neg-arrow">↓</span>
                    {hidden ? (
                      <button
                        type="button"
                        className="neg-reveal-btn"
                        onClick={() =>
                          setNegRevealed((s) => {
                            const next = new Set(s);
                            next.add(i);
                            return next;
                          })
                        }
                      >
                        stuknij, by odsłonić przeczenie
                      </button>
                    ) : (
                      <div className="neg-line neg-line-neg">
                        <span className="qw-ex-ar">{n.neg.ar}</span>
                        <span className="qw-ex-ph">{n.neg.ph}</span>
                      </div>
                    )}
                  </div>
                  {!hidden && n.note && <p className="verb-note qw-note">{lang==="en"&&n.noteEn?n.noteEn:n.note}</p>}
                </li>
              );
            })}
          </ul>
        </>
      )}

      {/* Liczebniki 11–100 */}
      {section === "bignum" && (
        <>
          <p className="verbs-intro">{ui('Liczebniki 11–100. Nastki (11–19) kończą się na „-taashar”. W dziesiątkach złożonych jedności stoją PRZED dziesiątką, spojone „wi” (khamsa wi 3eshriin = 25).')}</p>
          <ul className="num-grid">
            {BIG_NUMERALS.map((n, i) => (
              <li className="num-card" key={i}>
                <div className="num-head">
                  <span className="num-digit num-digit-wide">{n.pl}</span>
                  <div className="num-forms">
                    <span className="num-ar">{n.ar}</span>
                    <span className="num-ph">{n.ph}</span>
                  </div>
                </div>
                {n.note && <p className="verb-note num-note">{lang==="en"&&n.noteEn?n.noteEn:n.note}</p>}
              </li>
            ))}
          </ul>
        </>
      )}

      {/* Stopniowanie */}
      {section === "compar" && (
        <>
          <p className="verbs-intro">{ui('Stopniowanie: forma „af3al” działa jako wyższy (akbar min = większy niż) i — z rodzajnikiem — jako najwyższy (il-akbar = największy). Nie odmienia się przez rodzaj.')}</p>
          <ul className="qw-list">
            {COMPARATIVES.map((c, i) => (
              <li className="qw-card" key={i}>
                <div className="compar-row">
                  <div className="compar-cell">
                    <span className="compar-label">{ui("podstawowy")}</span>
                    <span className="compar-ar">{c.base.ar}</span>
                    <span className="compar-ph">{c.base.ph}</span>
                    <span className="compar-pl">{lang==="en"&&c.en?c.en:c.pl}</span>
                  </div>
                  <span className="compar-arrow">→</span>
                  <div className="compar-cell">
                    <span className="compar-label">{ui("wyższy")}</span>
                    <span className="compar-ar">{c.comp.ar}</span>
                    <span className="compar-ph">{c.comp.ph}</span>
                  </div>
                  <span className="compar-arrow">→</span>
                  <div className="compar-cell">
                    <span className="compar-label">{ui("najwyższy")}</span>
                    <span className="compar-ar">{c.sup.ar}</span>
                    <span className="compar-ph">{c.sup.ph}</span>
                  </div>
                </div>
                {c.note && <p className="verb-note qw-note">{lang==="en"&&c.noteEn?c.noteEn:c.note}</p>}
                {c.ex && (
                  <div className="qw-example">
                    <span className="qw-ex-ar">{c.ex.ar}</span>
                    <span className="qw-ex-ph">{c.ex.ph}</span>
                    <span className="qw-ex-pl">{trx(c.ex)}</span>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </>
      )}

      {/* Rozkaźnik */}
      {section === "imper" && (
        <>
          <p className="verbs-intro">{ui('Tryb rozkazujący: osobne formy dla mężczyzny, kobiety i liczby mnogiej. Zakaz tworzy klamra ma-…-sh na formie „ty” (ruuH → ma-truuH-sh = nie idź).')}</p>
          <ul className="qw-list">
            {IMPERATIVES.map((im, i) => (
              <li className="qw-card" key={i}>
                <div className="qw-head">
                  <span className="qw-pl imper-verb">{im.pl}</span>
                </div>
                <div className="imper-grid">
                  <div className="imper-cell">
                    <span className="imper-label">do niego</span>
                    <span className="imper-ar">{im.forms.m.ar}</span>
                    <span className="imper-ph">{im.forms.m.ph}</span>
                  </div>
                  <div className="imper-cell">
                    <span className="imper-label">do niej</span>
                    <span className="imper-ar">{im.forms.f.ar}</span>
                    <span className="imper-ph">{im.forms.f.ph}</span>
                  </div>
                  <div className="imper-cell">
                    <span className="imper-label">do wielu</span>
                    <span className="imper-ar">{im.forms.pl_.ar}</span>
                    <span className="imper-ph">{im.forms.pl_.ph}</span>
                  </div>
                  <div className="imper-cell imper-cell-neg">
                    <span className="imper-label">{ui("zakaz")}</span>
                    <span className="imper-ar">{im.neg.ar}</span>
                    <span className="imper-ph">{im.neg.ph}</span>
                  </div>
                </div>
                {im.note && <p className="verb-note qw-note">{lang==="en"&&im.noteEn?im.noteEn:im.note}</p>}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

// ---------- Widok: Układanka zdań ----------
function SentencesView() {
  const lang = useLang();
  const ui = useUi();
  const [order, setOrder] = useState(() => shuffle(SENTENCE_DRILLS.map((_, i) => i)));
  const [pos, setPos] = useState(0);
  const [placed, setPlaced] = useState([]); // indeksy kafelków w kolejności ułożenia
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [revealed, setRevealed] = useState(false); // "pokaż odpowiedź"
  const finished = pos >= order.length;
  const drill = finished ? null : SENTENCE_DRILLS[order[pos]];

  // Rozsypanie kafelków — stałe dla danego zdania (nie tasuje się co render).
  const scrambled = useMemo(() => {
    if (!drill) return [];
    const idx = drill.tiles.map((_, i) => i);
    if (idx.length < 2) return idx;
    let s = shuffle(idx);
    // Nie podawaj gotowej odpowiedzi: przetasuj, jeśli wyszła poprawna kolejność.
    let guard = 0;
    while (s.every((v, i) => v === i) && guard < 10) {
      s = shuffle(idx);
      guard++;
    }
    return s;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pos, order]);

  const allPlaced = drill ? placed.length === drill.tiles.length : false;
  const isCorrect = allPlaced && placed.every((v, i) => v === i);
  const isWrong = allPlaced && !isCorrect;
  const solved = isCorrect || revealed;

  function placeTile(i) {
    if (solved || placed.includes(i)) return;
    setPlaced((p) => [...p, i]);
  }

  function removeTile(i) {
    if (solved) return;
    setPlaced((p) => p.filter((v) => v !== i));
  }

  function next(countIt) {
    if (countIt) {
      setScore((s) => ({
        correct: s.correct + (isCorrect ? 1 : 0),
        total: s.total + 1,
      }));
    }
    setPlaced([]);
    setRevealed(false);
    setPos((p) => p + 1);
  }

  function reveal() {
    if (!drill) return;
    setPlaced(drill.tiles.map((_, i) => i));
    setRevealed(true);
    setScore((s) => ({ correct: s.correct, total: s.total + 1 }));
  }

  function restart() {
    setOrder(shuffle(SENTENCE_DRILLS.map((_, i) => i)));
    setPos(0);
    setPlaced([]);
    setRevealed(false);
    setScore({ correct: 0, total: 0 });
  }

  if (finished) {
    const pct = score.total ? Math.round((score.correct / score.total) * 100) : 0;
    return (
      <div className="view-quiz quiz-result">
        <span className="result-pct">{pct}%</span>
        <span className="result-label">
          {score.correct} z {score.total} poprawnie ułożonych zdań
        </span>
        <button className="nav-btn nav-btn-primary" onClick={restart}>
          zacznij od nowa
        </button>
      </div>
    );
  }

  return (
    <div className="view-quiz">
      <div className="progress-row">
        <span className="progress-text">
          {pos + 1} / {order.length}
        </span>
        <span className="progress-text progress-score">
          {score.correct} / {score.total} ✓
        </span>
      </div>

      <div className="quiz-prompt">
        <span className="card-eyebrow">{ui("ułóż po egipsku")}</span>
        <span className="quiz-word sentence-prompt">{lang==="en"&&drill.en?drill.en:drill.pl}</span>
      </div>

      {/* Pasek odpowiedzi */}
      <div
        className={`sentence-strip ${isCorrect ? "sentence-strip-correct" : ""} ${
          isWrong && !revealed ? "sentence-strip-wrong" : ""
        }`}
      >
        {placed.length === 0 && (
          <span className="sentence-strip-hint">{ui("stukaj kafelki poniżej…")}</span>
        )}
        {placed.map((tileIdx, i) => (
          <button
            key={i}
            type="button"
            className="sentence-tile sentence-tile-placed"
            onClick={() => removeTile(tileIdx)}
          >
            <span className="sentence-tile-ar">{drill.tiles[tileIdx].ar}</span>
            <span className="sentence-tile-ph">{drill.tiles[tileIdx].ph}</span>
          </button>
        ))}
      </div>

      {/* Pula kafelków */}
      <div className="sentence-pool">
        {scrambled.map((tileIdx) => {
          const used = placed.includes(tileIdx);
          return (
            <button
              key={tileIdx}
              type="button"
              className={`sentence-tile ${used ? "sentence-tile-used" : ""}`}
              onClick={() => placeTile(tileIdx)}
              disabled={used || solved}
            >
              <span className="sentence-tile-ar">{drill.tiles[tileIdx].ar}</span>
              <span className="sentence-tile-ph">{drill.tiles[tileIdx].ph}</span>
            </button>
          );
        })}
      </div>

      {/* Wynik / wyjaśnienie */}
      {solved && (
        <div className="sentence-solution">
          <span className="sentence-solution-ar">
            {drill.tiles.map((t) => t.ar).join(" ")}
          </span>
          <span className="sentence-solution-ph">
            {drill.tiles.map((t) => t.ph).join(" ")}
          </span>
          {drill.note && <p className="verb-note sentence-note">{lang==="en"&&drill.noteEn?drill.noteEn:drill.note}</p>}
        </div>
      )}
      {isWrong && !revealed && (
        <p className="sentence-wrong-hint">{ui('Coś nie gra — stuknij kafelek na pasku, żeby go zdjąć i poprawić.')}</p>
      )}

      <div className="nav-row">
        {!solved && (
          <button className="nav-btn" onClick={reveal}>
            {lang==="en"?"show answer":"pokaż odpowiedź"}
          </button>
        )}
        {solved && (
          <button
            className="nav-btn nav-btn-primary"
            onClick={() => next(!revealed)}
          >
            następne zdanie →
          </button>
        )}
      </div>
    </div>
  );
}

// ---------- Widok: Mini-dialogi ----------
// ---------- Edytor pojedynczej linii (dialog/czytanka) ----------
function LineEditor({ line, onSave, onCancel }) {
  const ui = useUi();
  const [ar, setAr] = useState(line.ar || "");
  const [ph, setPh] = useState(line.ph || "");
  const [pl, setPl] = useState(line.pl || "");

  function save() {
    if (!ar.trim() || !ph.trim() || !pl.trim()) return;
    onSave({ ar: ar.trim(), ph: ph.trim(), pl: pl.trim() });
  }

  return (
    <div className="line-editor">
      <input
        className="text-input input-arabic"
        value={ar}
        onChange={(e) => setAr(e.target.value)}
        placeholder="arabski"
        dir="rtl"
      />
      <input
        className="text-input input-mono"
        value={ph}
        onChange={(e) => setPh(e.target.value)}
        placeholder="transkrypcja"
      />
      <input
        className="text-input"
        value={pl}
        onChange={(e) => setPl(e.target.value)}
        placeholder={ui("tłumaczenie")}
      />
      <div className="line-editor-btns">
        <button type="button" className="line-editor-cancel" onClick={onCancel}>
          anuluj
        </button>
        <button type="button" className="line-editor-save" onClick={save}>
          zapisz
        </button>
      </div>
    </div>
  );
}

// ---------- Poziomy trudności czytania ----------
// Wzorowane na graded readers: im wyższy poziom, tym mniej podpórek.
// Kolejno znikają: tłumaczenie → transkrypcja → harakat (znaki samogłoskowe).
const READ_LEVELS = [
  { key: "a1", label: "A1", desc: "wszystko widoczne", descEn: "all visible", pl: true, ph: true, harakat: true },
  { key: "a2", label: "A2", desc: "bez tłumaczenia", descEn: "no translation", pl: false, ph: true, harakat: true },
  { key: "b1", label: "B1", desc: "bez transkrypcji", descEn: "no transcription", pl: false, ph: false, harakat: true },
  { key: "b2", label: "B2", desc: "samo pismo (bez harakat)", descEn: "script only (no harakat)", pl: false, ph: false, harakat: false },
];

// Usuwa harakat (znaki samogłoskowe) z tekstu arabskiego.
function stripHarakat(s) {
  return (s || "").replace(/[\u064B-\u0652\u0670\u0640]/g, "");
}

// Zwraca tekst arabski dopasowany do poziomu (z harakat lub bez).
function arForLevel(line, lvl) {
  // Preferuj wersję z harakat (arH), jeśli istnieje.
  const withH = line.arH || line.ar;
  return lvl.harakat ? withH : stripHarakat(withH);
}

function LevelPicker({ level, setLevel }) {
  const lang = useLang();
  const cur = READ_LEVELS.find((l) => l.key === level) || READ_LEVELS[0];
  return (
    <div className="level-picker">
      <div className="level-btns">
        {READ_LEVELS.map((l) => (
          <button
            key={l.key}
            type="button"
            className={`level-btn ${level === l.key ? "level-btn-active" : ""}`}
            onClick={() => setLevel(l.key)}
          >
            {l.label}
          </button>
        ))}
      </div>
      <span className="level-desc">{lang==="en"&&cur.descEn?cur.descEn:cur.desc}</span>
    </div>
  );
}

function DialoguesView() {
  const lang = useLang();
  const trx = useTr();
  const [idx, setIdx] = useState(0);
  const [level, setLevel] = useState("a1");
  const [edits, setEdits] = useState(loadContentEdits);
  const [editingLine, setEditingLine] = useState(null); // index edytowanej linii
  const d = DIALOGUES[idx];
  const lvl = READ_LEVELS.find((l) => l.key === level) || READ_LEVELS[0];

  function handleSaveLine(lineIdx, value) {
    const key = lineEditKey("dialog", d.title, lineIdx);
    saveContentEdit(key, value);
    setEdits(loadContentEdits());
    setEditingLine(null);
  }

  return (
    <div className="view-verbs">
      <p className="verbs-intro">
        {lang === "en"
          ? "Short real-life scenes — your words in real situations. Switch levels to gradually hide the translation, transcription, or harakat. Found a mistake? Tap the pencil next to a line to fix it."
          : "Krótkie scenki z życia — poznane słowa w realnych sytuacjach. Przełączaj dialogi, a przyciskami możesz ukryć tłumaczenia lub transkrypcję. Znalazłeś błąd? Dotknij ołówka przy zdaniu, żeby je poprawić."}
      </p>

      <div className="dlg-picker">
        {DIALOGUES.map((dl, i) => (
          <button
            key={i}
            type="button"
            className={`dlg-tab ${idx === i ? "dlg-tab-active" : ""}`}
            onClick={() => {
              setIdx(i);
              setEditingLine(null);
            }}
          >
            <span className="dlg-tab-emoji">{dl.emoji}</span>
            {lang==="en"&&dl.titleEn?dl.titleEn:dl.title}
          </button>
        ))}
      </div>

      <div className="dlg-card">
        <div className="dlg-header">
          <span className="dlg-title">
            {d.emoji} {lang==="en"&&d.titleEn?d.titleEn:d.title}
          </span>
        </div>
        <p className="dlg-context">{lang==="en"&&d.contextEn?d.contextEn:d.context}</p>

        <LevelPicker level={level} setLevel={setLevel} />

        <div className="dlg-thread">
          {d.lines.map((rawLn, i) => {
            const ln = applyLineEdit(rawLn, edits, lineEditKey("dialog", d.title, i));
            if (editingLine === i) {
              return (
                <div key={i} className={`dlg-bubble dlg-bubble-${ln.s}`}>
                  <LineEditor
                    line={ln}
                    onSave={(v) => handleSaveLine(i, v)}
                    onCancel={() => setEditingLine(null)}
                  />
                </div>
              );
            }
            return (
              <div key={i} className={`dlg-bubble dlg-bubble-${ln.s}`}>
                <button
                  type="button"
                  className="line-edit-btn"
                  onClick={() => setEditingLine(i)}
                  title="Popraw to zdanie"
                >
                  <Pencil size={12} />
                </button>
                <span className="dlg-ar">{arForLevel(ln, lvl)}</span>
                {lvl.ph && <span className="dlg-ph">{ln.ph}</span>}
                {lvl.pl && <span className="dlg-pl">{trx(ln)}</span>}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ---------- Widok: Uzupełnianie luki w zdaniu ----------
// Wykorzystuje SENTENCE_DRILLS: wyjmuje jeden element jako lukę, resztę pokazuje
// jako kontekst, a opcje dobiera z elementów innych zdań (mylące, ale sensowne).
function buildGapRounds(source) {
  // Źródło zdań: gotowe (SENTENCE_DRILLS) albo generowane z bazy.
  // Luka wymaga ≥3 elementów, więc dla generowanych bierzemy więcej i filtrujemy.
  let sentences;
  if (source === "gen") {
    sentences = generateSentences(40).filter((s) => s.tiles.length >= 3).slice(0, 15);
  } else {
    sentences = SENTENCE_DRILLS;
  }
  const allTiles = [];
  const seen = new Set();
  for (const d of sentences) {
    for (const tl of d.tiles) {
      if (!seen.has(tl.ph)) {
        seen.add(tl.ph);
        allTiles.push(tl);
      }
    }
  }
  const rounds = [];
  sentences.forEach((d, di) => {
    if (d.tiles.length < 3) return;
    const gapIdx = 1 + Math.floor(Math.random() * (d.tiles.length - 1));
    const answer = d.tiles[gapIdx];
    const inSentence = new Set(d.tiles.map((t) => t.ph));
    const pool = allTiles.filter((t) => t.ph !== answer.ph && !inSentence.has(t.ph));
    rounds.push({ drill: d, di, gapIdx, answer, pool });
  });
  return rounds;
}

function GapView() {
  const lang = useLang();
  const ui = useUi();
  const [source, setSource] = useState("fixed"); // "fixed" | "gen"
  const [rounds, setRounds] = useState(() => shuffle(buildGapRounds("fixed")));
  const [pos, setPos] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const finished = pos >= rounds.length;
  const round = finished ? null : rounds[pos];

  const options = useMemo(() => {
    if (!round) return [];
    const distractors = shuffle(round.pool).slice(0, 3);
    return shuffle([round.answer, ...distractors]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pos, rounds]);

  function choose(opt) {
    if (selected) return;
    setSelected(opt);
    const ok = opt.ph === round.answer.ph;
    setScore((s) => ({ correct: s.correct + (ok ? 1 : 0), total: s.total + 1 }));
  }

  function next() {
    setSelected(null);
    setPos((p) => p + 1);
  }

  function loadRounds(src) {
    setRounds(shuffle(buildGapRounds(src)));
    setPos(0);
    setSelected(null);
    setScore({ correct: 0, total: 0 });
  }

  function restart() {
    loadRounds(source);
  }

  if (rounds.length === 0) {
    return <EmptyState text={lang==="en"?"No sentences for the gap exercise.":"Brak zdań do ćwiczenia luki."} />;
  }

  if (finished) {
    const pct = score.total ? Math.round((score.correct / score.total) * 100) : 0;
    return (
      <div className="view-quiz quiz-result">
        <span className="result-pct">{pct}%</span>
        <span className="result-label">
          {score.correct} z {score.total} poprawnych uzupełnień
        </span>
        <button className="nav-btn nav-btn-primary" onClick={restart}>
          zacznij od nowa
        </button>
      </div>
    );
  }

  const solved = !!selected;

  return (
    <div className="view-quiz">
      <div className="quiz-len-row">
        <span className="quiz-len-label">{ui("zdania:")}</span>
        <div className="quiz-len-toggle">
          <button
            type="button"
            className={`quiz-len-btn ${source === "fixed" ? "quiz-len-active" : ""}`}
            onClick={() => { if (source !== "fixed") { setSource("fixed"); loadRounds("fixed"); } }}
          >
            {lang==="en"?"done":"gotowe"}
          </button>
          <button
            type="button"
            className={`quiz-len-btn ${source === "gen" ? "quiz-len-active" : ""}`}
            onClick={() => { if (source !== "gen") { setSource("gen"); loadRounds("gen"); } }}
          >
            generowane
          </button>
        </div>
      </div>

      <div className="progress-row">
        <span className="progress-text">
          {pos + 1} / {rounds.length}
        </span>
        <span className="progress-text progress-score">
          {score.correct} / {score.total} ✓
        </span>
      </div>

      <div className="quiz-prompt">
        <span className="card-eyebrow">{ui("uzupełnij lukę")}</span>
        <span className="quiz-word gap-pl">{lang==="en"&&round.drill.en?round.drill.en:round.drill.pl}</span>
      </div>

      <div className="gap-sentence">
        {round.drill.tiles.map((t, i) => {
          if (i === round.gapIdx) {
            return (
              <span
                key={i}
                className={`gap-slot ${solved ? "gap-slot-filled" : ""}`}
              >
                {solved ? (
                  <span className="gap-slot-ar">{round.answer.ar}</span>
                ) : (
                  "____"
                )}
              </span>
            );
          }
          return (
            <span key={i} className="gap-word">
              {t.ar}
            </span>
          );
        })}
      </div>

      <div className="quiz-options">
        {options.map((opt, i) => {
          let stateClass = "";
          if (solved) {
            if (opt.ph === round.answer.ph) stateClass = "opt-correct";
            else if (opt === selected) stateClass = "opt-wrong";
          }
          return (
            <button
              key={i}
              className={`quiz-option ${stateClass}`}
              onClick={() => choose(opt)}
              disabled={solved}
            >
              <span className="opt-arabic">{opt.ar}</span>
              <span className="opt-phonetic">{opt.ph}</span>
              {solved && opt.ph === round.answer.ph && <Check size={18} />}
              {solved && opt === selected && opt.ph !== round.answer.ph && <X size={18} />}
            </button>
          );
        })}
      </div>

      {solved && (
        <div className="gap-solution">
          <span className="gap-solution-ph">
            {round.drill.tiles.map((t) => t.ph).join(" ")}
          </span>
          {round.drill.note && <p className="verb-note gap-note">{lang==="en"&&round.drill.noteEn?round.drill.noteEn:round.drill.note}</p>}
        </div>
      )}

      {solved && (
        <button className="nav-btn nav-btn-primary nav-btn-full" onClick={next}>
          {pos + 1 >= rounds.length ? "zobacz wynik →" : "następne zdanie →"}
        </button>
      )}
    </div>
  );
}

// ---------- Śledzenie dni nauki (streak) ----------
const STATS_KEY_BASE = "ar-eg-stats-v1";
function statsKey() { return `${STATS_KEY_BASE}-${ACTIVE_COURSE}`; }

// Lokalna data w formacie YYYY-MM-DD (bez strefy UTC, żeby "dziś" było lokalne).
function todayKey(d = new Date()) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function loadStats() {
  try {
    const raw = localStorage.getItem(statsKey());
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return { days: {} }; // { "2026-07-03": liczba odpowiedzi }
}

function saveStats(stats) {
  try {
    localStorage.setItem(statsKey(), JSON.stringify(stats));
  } catch (e) {}
}

// Sprawdza, czy localStorage w ogóle działa (zapis+odczyt). Nie wykryje ulotności
// między sesjami, ale wyłapie środowisko, gdzie zapis jest całkiem zablokowany.
function storageWorks() {
  try {
    const k = "ar-eg-test";
    localStorage.setItem(k, "1");
    const ok = localStorage.getItem(k) === "1";
    localStorage.removeItem(k);
    return ok;
  } catch (e) {
    return false;
  }
}

// Odczytuje, ile słówek z postępem faktycznie leży w pamięci przeglądarki teraz.
// Pomaga odróżnić: „pamięć jest czyszczona" (0) od „błąd wyświetlania" (>0).
function storageDiagnostic(lang) {
  try {
    const raw = localStorage.getItem(progressKey());
    if (!raw) return lang==="en" ? "In memory: no saved progress." : "W pamięci: brak zapisanego postępu.";
    const prog = JSON.parse(raw);
    const ids = Object.keys(prog);
    // Ile ma REALNY postęp (trafienia/pomyłki), a ile to tylko puste wpisy.
    let withHits = 0, known = 0;
    for (const id of ids) {
      const p = prog[id];
      if ((p.correctCount || 0) + (p.wrongCount || 0) > 0) withHits++;
      if (p.known) known++;
    }
    return lang==="en"
      ? `In memory: ${ids.length} entries, of which ${withHits} with hits, ${known} marked. If "with hits" doesn't grow after practice — let me know.`
      : `W pamięci: ${ids.length} wpisów, z czego ${withHits} z trafieniami, ${known} oznaczonych. Jeśli po ćwiczeniu „z trafieniami" nie rośnie — daj znać.`;
  } catch (e) {
    return lang==="en" ? "Cannot read browser storage." : "Nie można odczytać pamięci przeglądarki.";
  }
}

// ---------- Eksport / import kopii postępu ----------
// Kopia obejmuje JEDNO I DRUGIE: postęp per słówko + statystyki dni (streak).
// Dzięki temu przetrwa wgranie nowej wersji aplikacji (nowy localStorage).
// Buduje obiekt kopii (postęp + statystyki dni).
function buildBackup(words, stats) {
  const progress = {};
  for (const w of words) {
    const c = w.correctCount || 0, x = w.wrongCount || 0;
    if (c || x || w.verified || w.flagged || w.known) {
      progress[wordId(w)] = {
        correctCount: c, wrongCount: x,
        verified: !!w.verified, flagged: !!w.flagged,
        known: w.known || undefined,
      };
    }
  }
  // Własne i edytowane fiszki = te, których nie ma w świeżej bazie (po wordId).
  // Zapisujemy ich pełną treść, żeby przeniosły się między urządzeniami.
  const deckIds = new Set(freshDeck().map(wordId));
  const customWords = words
    .filter((w) => !deckIds.has(wordId(w)))
    .map((w) => ({ cat: w.cat, pl: w.pl, ar: w.ar, ph: w.ph, ex: w.ex || undefined }));
  return {
    app: "arabic-egyptian-trainer",
    version: 2,
    exportedAt: new Date().toISOString(),
    progress,
    customWords,
    stats: stats || { days: {} },
  };
}

// Próba pobrania pliku. Zwraca true, jeśli pobieranie zostało zainicjowane
// (nie zawsze możliwe w osadzonej ramce — wtedy używamy schowka/podglądu).
function tryDownloadFile(text, filename) {
  try {
    const blob = new Blob([text], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.rel = "noopener";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 1500);
    return true;
  } catch (e) {
    return false;
  }
}


// Scala wczytaną kopię z bieżącą listą słówek. Zwraca { words, stats } albo null.
function applyBackup(backup, currentWords) {
  if (!backup || typeof backup !== "object" || !backup.progress) return null;
  const prog = backup.progress;

  // Dołącz własne/edytowane fiszki z kopii (wersja 2+), których nie ma w bieżącej
  // liście — żeby przeniosły się między urządzeniami. Zgodne wstecz: starsze kopie
  // (bez customWords) po prostu pomijają ten krok.
  let words = currentWords;
  if (Array.isArray(backup.customWords) && backup.customWords.length) {
    const haveIds = new Set(currentWords.map(wordId));
    const toAdd = backup.customWords.filter((w) => w && w.pl && w.ar && !haveIds.has(wordId(w)));
    if (toAdd.length) words = [...currentWords, ...toAdd];
  }

  const mergedWords = words.map((w) => {
    const p = prog[wordId(w)];
    return p ? { ...w, ...p } : w;
  });
  // Zapisz od razu do localStorage (żeby przetrwało kolejne odświeżenie).
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(mergedWords));
    localStorage.setItem(progressKey(), JSON.stringify(prog));
    if (backup.stats) localStorage.setItem(statsKey(), JSON.stringify(backup.stats));
  } catch (e) {}
  return { words: mergedWords, stats: backup.stats || { days: {} } };
}

// Odnotuj aktywność „dzisiaj" (+1 odpowiedź).
function markStudiedToday(stats) {
  const k = todayKey();
  const days = { ...stats.days, [k]: (stats.days[k] || 0) + 1 };
  return { ...stats, days };
}

// ---------- Cel dzienny ----------
const GOAL_KEY_BASE = "ar-eg-goal-v1";
function goalKey() { return `${GOAL_KEY_BASE}-${ACTIVE_COURSE}`; }
const GOAL_OPTIONS = [10, 20, 30, 50];

function loadGoal() {
  try {
    const raw = localStorage.getItem(goalKey());
    const n = raw ? parseInt(raw, 10) : 20;
    return GOAL_OPTIONS.includes(n) ? n : 20;
  } catch (e) {
    return 20;
  }
}

function saveGoal(n) {
  try {
    localStorage.setItem(goalKey(), String(n));
  } catch (e) {}
}

// Ile odpowiedzi udzielono dziś.
function todayCount(stats) {
  return (stats.days && stats.days[todayKey()]) || 0;
}

// Odnotuj odpowiedź w quizie na danym poziomie trudności.
function recordQuizLevel(stats, level, isCorrect) {
  const lvl = level === "hard" || level === "expert" ? level : "easy";
  const prev = (stats.quizByLevel && stats.quizByLevel[lvl]) || { correct: 0, total: 0 };
  const quizByLevel = {
    ...(stats.quizByLevel || {}),
    [lvl]: {
      correct: prev.correct + (isCorrect ? 1 : 0),
      total: prev.total + 1,
    },
  };
  return { ...stats, quizByLevel };
}

// Bieżąca seria dni z rzędu (dziś lub wczoraj = seria żyje).
function computeStreak(days) {
  const keys = Object.keys(days);
  if (keys.length === 0) return 0;
  const has = (d) => !!days[todayKey(d)];
  const now = new Date();
  // Seria liczy się od dziś, jeśli był dziś dzień; inaczej od wczoraj (dzień łaski).
  let cursor = new Date(now);
  if (!has(cursor)) {
    cursor.setDate(cursor.getDate() - 1);
    if (!has(cursor)) return 0;
  }
  let streak = 0;
  while (has(cursor)) {
    streak++;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

// Najdłuższa seria w historii.
function computeBestStreak(days) {
  const sorted = Object.keys(days).sort();
  if (sorted.length === 0) return 0;
  let best = 1, run = 1;
  for (let i = 1; i < sorted.length; i++) {
    const prev = new Date(sorted[i - 1]);
    const cur = new Date(sorted[i]);
    const diff = Math.round((cur - prev) / 86400000);
    if (diff === 1) run++;
    else run = 1;
    if (run > best) best = run;
  }
  return best;
}

// ---------- Widok: Statystyki ----------
// Kolor paska dla poziomu trudności quizu.
function quizLevelColor(level) {
  if (level === "expert") return "#c0392b";
  if (level === "hard") return "#d98a2b";
  return "#2e7d52";
}

function StatsView({ words, stats, categories, onExport, onImport, onPasteImport }) {
  const mastered_label_en = "Mastered (known)";
  const mastered_label_pl = "Opanowane (wiem)";
  const ui = useUi();
  const lang = useLang();
  const streak = computeStreak(stats.days || {});
  const best = computeBestStreak(stats.days || {});
  const daysStudied = Object.keys(stats.days || {}).length;
  const totalAnswers = Object.values(stats.days || {}).reduce((a, b) => a + b, 0);

  // Ostatnie 14 dni jako kratki aktywności.
  const last14 = [];
  for (let i = 13; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const k = todayKey(d);
    last14.push({ key: k, count: (stats.days || {})[k] || 0, dow: d.getDay() });
  }

  // Postęp per kategoria (przerobione / wszystkie).
  const catStats = categories
    .map((c) => {
      const inCat = words.filter((w) => (w.cat || "other") === c.key);
      if (inCat.length === 0) return null;
      const practiced = inCat.filter(
        (w) => (w.correctCount || 0) + (w.wrongCount || 0) > 0 || w.verified
      ).length;
      return {
        key: c.key,
        label: c.label,
        labelEn: c.labelEn,
        emoji: c.emoji,
        total: inCat.length,
        practiced,
        pct: Math.round((practiced / inCat.length) * 100),
      };
    })
    .filter(Boolean)
    .sort((a, b) => b.pct - a.pct);

  const DOW = lang === "en" ? ["S", "M", "T", "W", "T", "F", "S"] : ["N", "P", "W", "Ś", "C", "P", "S"];

  // Quiz z podziałem na poziomy trudności.
  const quizLevels = [
    { key: "easy", label: "łatwy", labelEn: "easy", emoji: "🟢" },
    { key: "hard", label: "trudny", labelEn: "hard", emoji: "🟡" },
    { key: "expert", label: "ekspert", labelEn: "expert", emoji: "🔴" },
  ].map((l) => {
    const d = (stats.quizByLevel && stats.quizByLevel[l.key]) || { correct: 0, total: 0 };
    return {
      ...l,
      correct: d.correct,
      total: d.total,
      pct: d.total ? Math.round((d.correct / d.total) * 100) : 0,
    };
  });
  const quizTotal = quizLevels.reduce((a, l) => a + l.total, 0);

  // Przerobione fiszki = oznaczone „wiem".
  const knownWords = words.filter((w) => w.known === "known").length;
  const unknownWords = words.filter((w) => w.known === "unknown").length;
  const reviewWords = words.filter((w) => w.known === "review").length;
  const knownPct = words.length ? Math.round((knownWords / words.length) * 100) : 0;

  return (
    <div className="view-verbs">
      <div className="stats-hero">
        <div className="stats-streak">
          <span className="stats-streak-num">{streak}</span>
          <span className="stats-streak-fire">🔥</span>
          <span className="stats-streak-label">
            {streak === 0
              ? (lang==="en"?"start a streak today!":"zacznij dziś serię!")
              : streak === 1
              ? (lang==="en"?"day streak":"dzień z rzędu")
              : streak < 5
              ? (lang==="en"?"day streak":"dni z rzędu")
              : "dni z rzędu — świetnie!"}
          </span>
        </div>
      </div>

      <div className="stats-cards">
        <div className="stats-card">
          <span className="stats-card-num">{best}</span>
          <span className="stats-card-label">{ui("najdłuższa seria")}</span>
        </div>
        <div className="stats-card">
          <span className="stats-card-num">{daysStudied}</span>
          <span className="stats-card-label">dni nauki</span>
        </div>
        <div className="stats-card">
          <span className="stats-card-num">{totalAnswers}</span>
          <span className="stats-card-label">{ui("odpowiedzi")}</span>
        </div>
      </div>

      <h3 className="modal-section-title stats-h">{ui("Ostatnie 14 dni")}</h3>
      <div className="stats-heatmap">
        {last14.map((d, i) => {
          const level = d.count === 0 ? 0 : d.count < 5 ? 1 : d.count < 15 ? 2 : 3;
          return (
            <div key={i} className="stats-day">
              <div className={`stats-cell stats-cell-${level}`} title={`${d.key}: ${d.count}`} />
              <span className="stats-dow">{DOW[d.dow]}</span>
            </div>
          );
        })}
      </div>

      <h3 className="modal-section-title stats-h">{ui("Quiz wg poziomu trudności")}</h3>
      {quizTotal === 0 ? (
        <p className="stats-empty-note">{ui("Rozwiąż quiz, aby zobaczyć wyniki wg poziomu.")}</p>
      ) : (
        <ul className="stats-cat-list">
          {quizLevels.map((l) => (
            <li className="stats-cat" key={l.key}>
              <div className="stats-cat-head">
                <span className="stats-cat-label">
                  {l.emoji} {lang==="en"&&l.labelEn?l.labelEn:l.label}
                </span>
                <span className="stats-cat-count">
                  {l.total === 0 ? "—" : `${l.correct}/${l.total} · ${l.pct}%`}
                </span>
              </div>
              <div className="stats-cat-track">
                <div
                  className="stats-cat-fill"
                  style={{ width: `${l.pct}%`, background: quizLevelColor(l.key) }}
                />
              </div>
            </li>
          ))}
        </ul>
      )}

      <h3 className="modal-section-title stats-h">{ui("Przerobione fiszki")}</h3>
      <div className="stats-known-row">
        <div className="stats-known-card stats-known-green">
          <span className="stats-known-num">{knownWords}</span>
          <span className="stats-known-label">🟢 wiem</span>
        </div>
        <div className="stats-known-card stats-known-orange">
          <span className="stats-known-num">{reviewWords}</span>
          <span className="stats-known-label">🟠 {lang==="en"?"to review":"do powtórki"}</span>
        </div>
        <div className="stats-known-card stats-known-red">
          <span className="stats-known-num">{unknownWords}</span>
          <span className="stats-known-label">🔴 {lang==="en"?"unknown":"nie wiem"}</span>
        </div>
      </div>
      <div className="stats-cat">
        <div className="stats-cat-head">
          <span className="stats-cat-label">{lang==="en" ? mastered_label_en : mastered_label_pl}</span>
          <span className="stats-cat-count">
            {knownWords}/{words.length} · {knownPct}%
          </span>
        </div>
        <div className="stats-cat-track">
          <div className="stats-cat-fill" style={{ width: `${knownPct}%`, background: "#2e7d52" }} />
        </div>
      </div>

      <h3 className="modal-section-title stats-h">{ui("Postęp w kategoriach")}</h3>
      <ul className="stats-cat-list">
        {catStats.map((c) => (
          <li className="stats-cat" key={c.key}>
            <div className="stats-cat-head">
              <span className="stats-cat-label">
                {c.emoji} {catLabel(c, lang)}
              </span>
              <span className="stats-cat-count">
                {c.practiced}/{c.total}
              </span>
            </div>
            <div className="stats-cat-track">
              <div className="stats-cat-fill" style={{ width: `${c.pct}%` }} />
            </div>
          </li>
        ))}
      </ul>

      <h3 className="modal-section-title stats-h stats-backup-h">{ui("Kopia zapasowa")}</h3>
      <p className="storage-diag">{storageDiagnostic(lang)}</p>
      {!storageWorks() && (
        <p className="storage-warning">
          ⚠️ Ta przeglądarka nie zapisuje danych trwale — postęp może znikać po
          odświeżeniu. Zapisuj kopię regularnie, albo wystaw aplikację na własny
          hosting (wtedy postęp jest trwały).
        </p>
      )}
      <p className="stats-backup-note">
        {lang === "en"
          ? "Your progress and your own/edited cards are saved in the browser's storage (separately on each device — computer and phone don't sync). \"Save backup\" secures everything to a file/clipboard — on another device use \"paste backup\" to transfer your progress and cards."
          : "Postęp i Twoje własne/edytowane fiszki są zapisywane w pamięci przeglądarki (osobno na każdym urządzeniu — komputer i telefon się nie synchronizują). „Zapisz kopię\" zabezpiecza wszystko do pliku/schowka — na drugim urządzeniu użyj „wklej kopię\", żeby przenieść postęp i fiszki."}
      </p>
      <div className="stats-backup-row">
        <button className="nav-btn nav-btn-primary stats-backup-btn" onClick={onExport}>
          <Upload size={15} /> {lang==="en"?"save backup":"zapisz kopię"}
        </button>
        <button className="nav-btn stats-backup-btn stats-backup-import" onClick={onPasteImport}>
          {lang==="en"?"paste backup":"wklej kopię"}
        </button>
      </div>
      <div className="stats-backup-row stats-backup-row2">
        <label className="nav-btn stats-backup-btn stats-backup-import stats-backup-file">
          {lang==="en"?"load from file":"wczytaj z pliku"}
          <input
            type="file"
            accept="application/json,.json"
            style={{ display: "none" }}
            onChange={(e) => {
              onImport(e.target.files && e.target.files[0]);
              e.target.value = "";
            }}
          />
        </label>
      </div>
    </div>
  );
}

// ---------- Widok: Dopasowywanie par (na czas) ----------
const MATCH_PAIRS = 6; // ile par na rundę

function MatchView({ words }) {
  const lang = useLang();
  const ui = useUi();
  // Kandydaci: krótkie, jednoznaczne słówka (bez długich zwrotów i zdań).
  const pool = useMemo(
    () =>
      words.filter(
        (w) =>
          w.pl && w.ar && w.pl.length <= 24 && !w.pl.includes("?") && !w.ar.includes(" ") &&
          (lang !== "en" || w.en)
      ),
    [words, lang]
  );

  const [round, setRound] = useState(0); // wymusza nowe losowanie
  const [selectedPl, setSelectedPl] = useState(null);
  const [selectedAr, setSelectedAr] = useState(null);
  const [matched, setMatched] = useState(new Set()); // id dopasowanych par
  const [wrongPair, setWrongPair] = useState(null); // chwilowe podświetlenie błędu
  const [mistakes, setMistakes] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [elapsed, setElapsed] = useState(0);
  const [done, setDone] = useState(false);

  // Wylosowana szóstka par + osobno potasowane kolumny.
  const game = useMemo(() => {
    const picked = shuffle(pool).slice(0, MATCH_PAIRS).map((w, i) => ({
      id: i,
      pl: w.pl,
      en: w.en,
      ar: w.ar,
      ph: w.ph,
    }));
    return {
      pairs: picked,
      leftOrder: shuffle(picked.map((p) => p.id)),
      rightOrder: shuffle(picked.map((p) => p.id)),
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [round, pool.length]);

  // Timer — tyka od pierwszego kliknięcia do ukończenia.
  useEffect(() => {
    if (startTime === null || done) return;
    const t = setInterval(() => setElapsed((Date.now() - startTime) / 1000), 100);
    return () => clearInterval(t);
  }, [startTime, done]);

  function ensureTimer() {
    if (startTime === null) setStartTime(Date.now());
  }

  function tryMatch(plId, arId) {
    if (plId === arId) {
      const next = new Set(matched);
      next.add(plId);
      setMatched(next);
      setSelectedPl(null);
      setSelectedAr(null);
      if (next.size === game.pairs.length) {
        setDone(true);
        setElapsed((Date.now() - startTime) / 1000);
      }
    } else {
      setMistakes((m) => m + 1);
      setWrongPair({ plId, arId });
      setTimeout(() => setWrongPair(null), 500);
      setSelectedPl(null);
      setSelectedAr(null);
    }
  }

  function clickPl(id) {
    if (matched.has(id) || done) return;
    ensureTimer();
    if (selectedAr !== null) tryMatch(id, selectedAr);
    else setSelectedPl(selectedPl === id ? null : id);
  }

  function clickAr(id) {
    if (matched.has(id) || done) return;
    ensureTimer();
    if (selectedPl !== null) tryMatch(selectedPl, id);
    else setSelectedAr(selectedAr === id ? null : id);
  }

  function restart() {
    setRound((r) => r + 1);
    setSelectedPl(null);
    setSelectedAr(null);
    setMatched(new Set());
    setWrongPair(null);
    setMistakes(0);
    setStartTime(null);
    setElapsed(0);
    setDone(false);
  }

  if (pool.length < MATCH_PAIRS) {
    return <EmptyState text={lang==="en"?"Not enough short words for the pairs game.":"Za mało krótkich słówek do gry w pary."} />;
  }

  const byId = (id) => game.pairs.find((p) => p.id === id);

  if (done) {
    return (
      <div className="view-quiz quiz-result">
        <span className="result-pct">{elapsed.toFixed(1)}s</span>
        <span className="result-label">
          {MATCH_PAIRS} par dopasowanych{mistakes > 0 ? ` · ${mistakes} pomyłek` : " · bezbłędnie!"}
        </span>
        <button className="nav-btn nav-btn-primary" onClick={restart}>
          jeszcze raz
        </button>
      </div>
    );
  }

  return (
    <div className="view-quiz">
      <div className="progress-row">
        <span className="progress-text">⏱ {elapsed.toFixed(1)}s</span>
        <span className="progress-text progress-score">
          {matched.size} / {game.pairs.length} · {mistakes} ✗
        </span>
      </div>

      <p className="verbs-intro match-intro">{ui('Połącz polskie słowo z arabskim — stuknij jedno, potem drugie. Czas leci od pierwszego kliknięcia.')}</p>

      <div className="match-grid">
        <div className="match-col">
          {game.leftOrder.map((id) => {
            const p = byId(id);
            const isMatched = matched.has(id);
            const isSel = selectedPl === id;
            const isWrong = wrongPair && wrongPair.plId === id;
            return (
              <button
                key={id}
                className={`match-tile ${isMatched ? "match-tile-done" : ""} ${
                  isSel ? "match-tile-sel" : ""
                } ${isWrong ? "match-tile-wrong" : ""}`}
                onClick={() => clickPl(id)}
                disabled={isMatched}
              >
                {lang==="en"&&p.en?p.en:p.pl}
              </button>
            );
          })}
        </div>
        <div className="match-col">
          {game.rightOrder.map((id) => {
            const p = byId(id);
            const isMatched = matched.has(id);
            const isSel = selectedAr === id;
            const isWrong = wrongPair && wrongPair.arId === id;
            return (
              <button
                key={id}
                className={`match-tile match-tile-ar ${isMatched ? "match-tile-done" : ""} ${
                  isSel ? "match-tile-sel" : ""
                } ${isWrong ? "match-tile-wrong" : ""}`}
                onClick={() => clickAr(id)}
                disabled={isMatched}
              >
                {p.ar}
              </button>
            );
          })}
        </div>
      </div>

      <button className="nav-btn match-reshuffle" onClick={restart}>
        <Shuffle size={15} /> {lang==="en"?"new words":"nowe słowa"}
      </button>
    </div>
  );
}

// ---------- Widok: Pisanie (układanie słowa z liter arabskich) ----------
// Znaki łączące w arabskim zmieniają kształt zależnie od pozycji, więc pojedyncze
// klocki pokazują formę izolowaną, a ułożone słowo renderujemy normalnie (z połączeniami).
const HARAKAT_RE = /[\u064B-\u0652\u0670]/; // diakrytyki, których nie chcemy rozbijać na klocki

function WriteView({ words }) {
  const lang = useLang();
  const ui = useUi();
  const trx = useTr();
  // Pula: słowa bez spacji, bez diakrytyków, długość 3–7 znaków (wykonalne).
  const pool = useMemo(
    () =>
      words.filter((w) => {
        if (!w.ar || w.ar.includes(" ")) return false;
        if (HARAKAT_RE.test(w.ar)) return false;
        const n = [...w.ar].length;
        return n >= 3 && n <= 7;
      }),
    [words]
  );

  const [round, setRound] = useState(0);
  const [placed, setPlaced] = useState([]); // indeksy klocków wstawione do odpowiedzi (w kolejności)
  const [checked, setChecked] = useState(false);
  const [revealed, setRevealed] = useState(false);

  // Wylosowane słowo + potasowane klocki (każdy klocek = znak + stały id).
  const game = useMemo(() => {
    if (pool.length === 0) return null;
    const word = shuffle(pool)[0];
    const chars = [...word.ar];
    const tiles = chars.map((ch, i) => ({ id: i, ch }));
    // tasuj, ale upewnij się, że kolejność startowa nie jest już poprawna
    let order = shuffle(tiles.map((t) => t.id));
    if (chars.length > 1 && order.every((id, i) => id === i)) {
      order = [...order].reverse();
    }
    return { word, chars, tiles, shuffledOrder: order };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [round, pool.length]);

  if (pool.length === 0) {
    return <EmptyState text={lang==="en"?"No suitable words for the writing exercise (need words of 3–7 letters without spaces).":"Brak odpowiednich słów do ćwiczenia pisania (potrzebne słowa 3–7 liter bez znaków spacji)."} />;
  }
  if (!game) return null;

  const { word, chars, tiles, shuffledOrder } = game;
  const isPlaced = (id) => placed.includes(id);
  const answerChars = placed.map((id) => tiles[id].ch);
  const answerStr = answerChars.join("");
  const correctStr = chars.join("");
  const isFull = placed.length === chars.length;
  const isCorrect = isFull && answerStr === correctStr;

  function tapTile(id) {
    if (checked || revealed || isPlaced(id)) return;
    setPlaced((p) => [...p, id]);
  }
  function removeLast() {
    if (checked || revealed) return;
    setPlaced((p) => p.slice(0, -1));
  }
  function clearAnswer() {
    if (revealed) return;
    setPlaced([]);
    setChecked(false);
  }
  function check() {
    if (!isFull) return;
    setChecked(true);
  }
  function reveal() {
    setRevealed(true);
    setPlaced(chars.map((_, i) => i)); // ustaw w poprawnej kolejności (id = pozycja docelowa)
  }
  function nextWord() {
    setPlaced([]);
    setChecked(false);
    setRevealed(false);
    setRound((r) => r + 1);
  }

  return (
    <div className="view-write">
      <p className="verbs-intro write-intro">{ui('Ułóż słowo po arabsku, stukając litery w dobrej kolejności. Pamiętaj: pismo arabskie czyta się')}<strong>{lang==="en"?"right to left":"od prawej do lewej"}</strong>. {lang==="en"?"The hint is the meaning and phonetic spelling.":"Podpowiedź to polskie znaczenie i zapis fonetyczny."}
      </p>

      <div className="write-prompt">
        <span className="write-pl">{trx(word)}</span>
        <span className="write-ph">{word.ph}</span>
      </div>

      {/* Pole odpowiedzi (RTL) */}
      <div
        className={`write-answer ${checked ? (isCorrect ? "write-answer-ok" : "write-answer-bad") : ""} ${
          revealed ? "write-answer-reveal" : ""
        }`}
        onClick={removeLast}
        title={ui("Stuknij, aby cofnąć ostatnią literę")}
      >
        {placed.length === 0 ? (
          <span className="write-placeholder">{ui("tu pojawi się słowo…")}</span>
        ) : (
          <span className="write-answer-text">{answerStr}</span>
        )}
      </div>

      {/* Klocki z literami (forma izolowana) */}
      <div className="write-tiles">
        {shuffledOrder.map((id) => (
          <button
            key={id}
            className={`write-tile ${isPlaced(id) ? "write-tile-used" : ""}`}
            onClick={() => tapTile(id)}
            disabled={isPlaced(id) || checked || revealed}
          >
            {tiles[id].ch}
          </button>
        ))}
      </div>

      {/* Informacja zwrotna */}
      {checked && (
        <div className={`write-feedback ${isCorrect ? "write-fb-ok" : "write-fb-bad"}`}>
          {isCorrect ? (
            <>✓ {lang==="en"?"Correct!":"Dobrze!"} <span className="write-fb-word">{correctStr}</span></>
          ) : (
            <>{lang==="en"?"Not quite. Correct: ":"Niezupełnie. Poprawnie: "}<span className="write-fb-word">{correctStr}</span></>
          )}
        </div>
      )}
      {revealed && (
        <div className="write-feedback write-fb-reveal">
          {lang==="en"?"Correct order: ":"Poprawna kolejność: "}<span className="write-fb-word">{correctStr}</span>
        </div>
      )}

      {/* Przyciski */}
      <div className="write-actions">
        {!checked && !revealed && (
          <>
            <button className="nav-btn" onClick={clearAnswer} disabled={placed.length === 0}>
              {lang==="en"?"clear":"wyczyść"}
            </button>
            <button className="nav-btn" onClick={reveal}>
              {lang==="en"?"show":"pokaż"}
            </button>
            <button
              className="nav-btn nav-btn-primary"
              onClick={check}
              disabled={!isFull}
            >
              {lang==="en"?"check":"sprawdź"}
            </button>
          </>
        )}
        {(checked || revealed) && (
          <>
            {checked && !isCorrect && (
              <button className="nav-btn" onClick={() => { setPlaced([]); setChecked(false); }}>
                {lang==="en"?"try again":"spróbuj ponownie"}
              </button>
            )}
            <button className="nav-btn nav-btn-primary" onClick={nextWord}>
              {lang==="en"?"next word":"następne słowo"} →
            </button>
          </>
        )}
      </div>
    </div>
  );
}

// ---------- Widok: Lekcje (dialog + ćwiczenia na jego słownictwie) ----------
function LessonsView({ words, onToggleFlag, onToggleVerified, onSetKnown, onSaveExample, onEditCard, onAnswer }) {
  const lang = useLang();
  const ui = useUi();
  const [lessonIdx, setLessonIdx] = useState(null); // która lekcja (dialog)
  const [exercise, setExercise] = useState(null); // które ćwiczenie w lekcji

  // Lista lekcji = dialogi + ich policzone słownictwo z bazy.
  const lessons = useMemo(
    () =>
      DIALOGUES.map((d) => {
        const lexicon = wordsInDialogue(d, words);
        return { dialogue: d, lexicon, sentences: sentencesForDialogue(d) };
      }),
    [words]
  );

  // Widok listy lekcji
  if (lessonIdx === null) {
    return (
      <div className="view-lessons">
        <p className="verbs-intro">{ui('Każda lekcja to dialog i zestaw ćwiczeń na jego słownictwie. Najpierw przeczytaj rozmowę, potem utrwal te same słowa na kilka sposobów.')}</p>
        <div className="lesson-list">
          {lessons.map((l, i) => (
            <button key={i} className="lesson-card" onClick={() => setLessonIdx(i)}>
              <span className="lesson-emoji">{l.dialogue.emoji}</span>
              <span className="lesson-info">
                <span className="lesson-title">{lang==="en"&&l.dialogue.titleEn?l.dialogue.titleEn:l.dialogue.title}</span>
                <span className="lesson-meta">
                  {l.dialogue.lines.length} {lang==="en"?"lines":"kwestii"} · {l.lexicon.length} {lang==="en"?"words":"słówek"}
                </span>
              </span>
              <span className="lesson-arrow">→</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  const lesson = lessons[lessonIdx];
  const lex = lesson.lexicon;

  // Ćwiczenie wybrane — renderuj odpowiedni widok z przefiltrowanymi słowami.
  if (exercise) {
    let body = null;
    if (exercise === "flash") {
      body = (
        <FlashcardsView
          words={lex}
          onToggleFlag={onToggleFlag}
          onToggleVerified={onToggleVerified}
          onSetKnown={onSetKnown}
          onSaveExample={onSaveExample}
          onEditCard={onEditCard}
          emptyHint="Brak słówek z tego dialogu w bazie."
        />
      );
    } else if (exercise === "quiz") {
      body = <QuizView words={lex} onAnswer={onAnswer} />;
    } else if (exercise === "match") {
      body = <MatchView words={lex} />;
    } else if (exercise === "write") {
      body = <WriteView words={lex} />;
    } else if (exercise === "sentences") {
      body = <LessonSentences sentences={lesson.sentences} />;
    }
    return (
      <div className="view-lessons">
        <button className="lesson-back" onClick={() => setExercise(null)}>
          ← {lang==="en"&&lesson.dialogue.titleEn?lesson.dialogue.titleEn:lesson.dialogue.title}
        </button>
        {body}
      </div>
    );
  }

  // Ekran lekcji: dialog + kafelki ćwiczeń
  const tiles = [
    { key: "flash", label: "Fiszki", labelEn: "Flashcards", emoji: "🎴", count: lex.length, min: 1 },
    { key: "quiz", label: "Quiz", labelEn: "Quiz", emoji: "❓", count: lex.length, min: 4 },
    { key: "match", label: "Pary", labelEn: "Pairs", emoji: "🔀", count: lex.length, min: 6 },
    { key: "write", label: "Pisanie", labelEn: "Writing", emoji: "✍️", count: lex.length, min: 1 },
    { key: "sentences", label: "Zdania", labelEn: "Sentences", emoji: "🧩", count: lesson.sentences.length, min: 1 },
  ];

  return (
    <div className="view-lessons">
      <button className="lesson-back" onClick={() => setLessonIdx(null)}>
        ← {lang==="en"?"all lessons":"wszystkie lekcje"}
      </button>

      <div className="lesson-head">
        <span className="lesson-head-emoji">{lesson.dialogue.emoji}</span>
        <h2 className="lesson-head-title">{lang==="en"&&lesson.dialogue.titleEn?lesson.dialogue.titleEn:lesson.dialogue.title}</h2>
        <p className="lesson-head-context">{lang==="en"&&lesson.dialogue.contextEn?lesson.dialogue.contextEn:lesson.dialogue.context}</p>
      </div>

      {/* Dialog */}
      <LessonDialogue dialogue={lesson.dialogue} />

      {/* Kafelki ćwiczeń */}
      <h3 className="lesson-section-title">{lang==="en"?"Exercises on this vocabulary":"Ćwiczenia na tym słownictwie"}</h3>
      <div className="lesson-tiles">
        {tiles.map((t) => {
          const enough = t.count >= t.min;
          return (
            <button
              key={t.key}
              className={`lesson-tile ${!enough ? "lesson-tile-disabled" : ""}`}
              onClick={() => enough && setExercise(t.key)}
              disabled={!enough}
            >
              <span className="lesson-tile-emoji">{t.emoji}</span>
              <span className="lesson-tile-label">{lang==="en"&&t.labelEn?t.labelEn:t.label}</span>
              <span className="lesson-tile-count">
                {enough ? `${t.count}` : (lang==="en"?"too few":"za mało")}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// Dialog wewnątrz lekcji, z poziomami trudności czytania.
function LessonDialogue({ dialogue }) {
  const ui = useUi();
  const trx = useTr();
  const [level, setLevel] = useState("a1");
  const lvl = READ_LEVELS.find((l) => l.key === level) || READ_LEVELS[0];
  return (
    <div className="lesson-dialogue">
      <div className="lesson-dialogue-bar">
        <span className="lesson-dialogue-label">{ui("Dialog")}</span>
      </div>
      <LevelPicker level={level} setLevel={setLevel} />
      {dialogue.lines.map((line, i) => (
        <div key={i} className={`dlg-line ${line.s === "a" ? "dlg-a" : "dlg-b"}`}>
          <div className="dlg-bubble">
            <span className="dlg-ar">{arForLevel(line, lvl)}</span>
            {lvl.ph && <span className="dlg-ph">{line.ph}</span>}
            {lvl.pl && <span className="dlg-pl">{trx(line)}</span>}
          </div>
        </div>
      ))}
    </div>
  );
}

// Zdania z układanki przypisane do lekcji — prosty player (jedno zdanie naraz).
function LessonSentences({ sentences }) {
  const lang = useLang();
  const ui = useUi();
  const list = sentences && sentences.length ? sentences : [];
  const [idx, setIdx] = useState(0);
  const [placed, setPlaced] = useState([]);
  const [revealed, setRevealed] = useState(false);

  const safeIdx = list.length ? idx % list.length : 0;
  const drill = list.length ? list[safeIdx] : null;

  const scrambled = useMemo(() => {
    if (!drill) return [];
    const ix = drill.tiles.map((_, i) => i);
    if (ix.length < 2) return ix;
    let s = shuffle(ix);
    let guard = 0;
    while (s.every((v, i) => v === i) && guard < 10) { s = shuffle(ix); guard++; }
    return s;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [safeIdx, drill]);

  if (!drill) {
    return <EmptyState text={lang==="en"?"No matching sentences for this dialogue.":"Brak pasujących zdań do tego dialogu."} />;
  }

  const allPlaced = placed.length === drill.tiles.length;
  const isCorrect = allPlaced && placed.every((v, i) => v === i);
  const solved = isCorrect || revealed;

  function place(i) {
    if (solved || placed.includes(i)) return;
    setPlaced((p) => [...p, i]);
  }
  function undo() {
    if (solved) return;
    setPlaced((p) => p.slice(0, -1));
  }
  function reveal() {
    setPlaced(drill.tiles.map((_, i) => i));
    setRevealed(true);
  }
  function next() {
    setPlaced([]);
    setRevealed(false);
    setIdx((i) => (i + 1) % list.length);
  }

  return (
    <div className="view-sentences">
      <div className="progress-row">
        <span className="progress-text">{safeIdx + 1} / {list.length}</span>
      </div>
      <p className="sentence-pl">{lang==="en"&&drill.en?drill.en:drill.pl}</p>

      <div className="sentence-answer" onClick={undo}>
        {placed.length === 0 ? (
          <span className="sentence-placeholder">{lang==="en"?"build the sentence (left to right: first word first)…":"ułóż zdanie (od lewej: pierwsze słowo zdania)…"}</span>
        ) : (
          <span className="sentence-answer-line">
            {placed.map((ti, k) => (
              <span key={k} className="sentence-slot">
                {drill.tiles[ti].ar}
              </span>
            ))}
          </span>
        )}
      </div>

      <div className="sentence-bank">
        {scrambled.map((ti) => (
          <button
            key={ti}
            className={`sentence-tile ${placed.includes(ti) ? "sentence-tile-used" : ""}`}
            onClick={() => place(ti)}
            disabled={placed.includes(ti) || solved}
          >
            <span className="st-ar">{drill.tiles[ti].ar}</span>
            <span className="st-ph">{drill.tiles[ti].ph}</span>
          </button>
        ))}
      </div>

      {isCorrect && <div className="sentence-fb sentence-fb-ok">✓ {lang==="en"?"Correct!":"Dobrze!"}</div>}
      {revealed && !isCorrect && (
        <div className="sentence-fb sentence-fb-reveal">{ui("Poprawna kolejność powyżej.")}</div>
      )}
      {drill.note && solved && <p className="sentence-note">{lang==="en"&&drill.noteEn?drill.noteEn:drill.note}</p>}

      <div className="sentence-actions">
        {!solved && (
          <button className="nav-btn" onClick={reveal}>{ui("pokaż")}</button>
        )}
        <button className="nav-btn nav-btn-primary" onClick={next}>
          następne zdanie →
        </button>
      </div>
    </div>
  );
}

// ---------- Widok: Czytanki (dłuższe teksty + rozumienie) ----------
function ReadingsView() {
  const trx = useTr();
  const lang = useLang();
  const [idx, setIdx] = useState(null);
  const [level, setLevel] = useState("a1");
  const [answers, setAnswers] = useState({}); // {questionIndex: chosenOption}
  const [showResults, setShowResults] = useState(false);
  const [edits, setEdits] = useState(loadContentEdits);
  const [editingLine, setEditingLine] = useState(null);
  const lvl = READ_LEVELS.find((l) => l.key === level) || READ_LEVELS[0];

  // Lista czytanek
  if (idx === null) {
    return (
      <div className="view-readings">
        <p className="verbs-intro">
          {lang === "en"
            ? "Longer texts for reading comprehension. Each uses a different tense (present, past, future, or mixed) — questions follow the text to check how much you understand."
            : "Dłuższe teksty do czytania ze zrozumieniem. Każdy używa innego czasu (teraźniejszy, przeszły, przyszły albo mieszany) — po tekście czekają pytania, żeby sprawdzić, ile rozumiesz."}
        </p>
        <div className="reading-list">
          {READINGS.map((r, i) => (
            <button key={i} className="reading-card" onClick={() => setIdx(i)}>
              <span className="reading-emoji">{r.emoji}</span>
              <span className="reading-info">
                <span className="reading-title">{lang==="en"&&r.titleEn?r.titleEn:r.title}</span>
                <span className="reading-meta">
                  {r.sentences.length} {lang==="en"?"sentences":"zdań"} · {lang==="en"&&r.levelEn?r.levelEn:r.level}
                </span>
              </span>
              <span className="reading-arrow">→</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  const r = READINGS[idx];
  const allAnswered = r.questions.every((_, qi) => answers[qi] !== undefined);
  const score = r.questions.filter((q, qi) => answers[qi] === q.correct).length;

  function choose(qi, oi) {
    if (showResults) return;
    setAnswers((a) => ({ ...a, [qi]: oi }));
  }
  function back() {
    setIdx(null);
    setAnswers({});
    setShowResults(false);
    setEditingLine(null);
  }

  return (
    <div className="view-readings">
      <button className="lesson-back" onClick={back}>
        ← wszystkie czytanki
      </button>

      <div className="reading-head">
        <span className="reading-head-emoji">{r.emoji}</span>
        <h2 className="reading-head-title">{lang==="en"&&r.titleEn?r.titleEn:r.title}</h2>
        <p className="reading-head-context">{lang==="en"&&r.contextEn?r.contextEn:r.context}</p>
      </div>

      <div className="reading-tense-note">🕐 {lang==="en"&&r.tenseNoteEn?r.tenseNoteEn:r.tenseNote}</div>

      <LevelPicker level={level} setLevel={setLevel} />

      <div className="reading-text">
        {r.sentences.map((rawS, i) => {
          const s = applyLineEdit(rawS, edits, lineEditKey("reading", r.title, i));
          if (editingLine === i) {
            return (
              <div key={i} className="reading-sentence">
                <LineEditor
                  line={s}
                  onSave={(v) => {
                    saveContentEdit(lineEditKey("reading", r.title, i), v);
                    setEdits(loadContentEdits());
                    setEditingLine(null);
                  }}
                  onCancel={() => setEditingLine(null)}
                />
              </div>
            );
          }
          return (
            <div key={i} className="reading-sentence">
              <button
                type="button"
                className="line-edit-btn"
                onClick={() => setEditingLine(i)}
                title="Popraw to zdanie"
              >
                <Pencil size={12} />
              </button>
              <span className="reading-ar">{arForLevel(s, lvl)}</span>
              {lvl.ph && <span className="reading-ph">{s.ph}</span>}
              {lvl.pl && <span className="reading-pl">{trx(s)}</span>}
            </div>
          );
        })}
      </div>

      <h3 className="reading-q-title">{lang === "en" ? "Comprehension questions" : "Pytania na rozumienie"}</h3>
      <div className="reading-questions">
        {r.questions.map((q, qi) => {
          // Wersja pytania/opcji zależna od poziomu i języka.
          const useAr = !lvl.pl && q.qAr;
          const useEn = lang === "en" && q.qEn;
          const qText = useAr ? q.qAr : useEn ? q.qEn : q.q;
          const opts = useAr ? q.optionsAr : useEn && q.optionsEn ? q.optionsEn : q.options;
          return (
          <div key={qi} className="reading-question">
            <p className={`reading-q-text ${useAr ? "reading-q-ar" : ""}`}>{qText}</p>
            <div className="reading-options">
              {opts.map((opt, oi) => {
                const chosen = answers[qi] === oi;
                let cls = "reading-option" + (useAr ? " reading-option-ar" : "");
                if (showResults) {
                  if (oi === q.correct) cls += " reading-option-correct";
                  else if (chosen) cls += " reading-option-wrong";
                } else if (chosen) {
                  cls += " reading-option-chosen";
                }
                return (
                  <button key={oi} className={cls} onClick={() => choose(qi, oi)}>
                    {opt}
                  </button>
                );
              })}
            </div>
          </div>
          );
        })}
      </div>

      {!showResults ? (
        <button
          className="nav-btn nav-btn-primary reading-check"
          onClick={() => setShowResults(true)}
          disabled={!allAnswered}
        >
          {allAnswered ? "sprawdź odpowiedzi" : "odpowiedz na wszystkie pytania"}
        </button>
      ) : (
        <div className="reading-score">
          Wynik: {score} / {r.questions.length}
          {score === r.questions.length ? " — świetnie! 🎉" : ""}
        </div>
      )}
    </div>
  );
}

// ---------- Widok: Egipski a MSA (fuS7a) ----------
// ---------- Widok: MSA — rdzenie i rodziny słów ----------
const ROLE_LABELS = {
  verb: { pl: "czasownik", en: "verb" },
  noun: { pl: "rzeczownik", en: "noun" },
  agent: { pl: "wykonawca", en: "doer" },
  place: { pl: "miejsce", en: "place" },
  plural: { pl: "liczba mnoga", en: "plural" },
  food: { pl: "przedmiot", en: "object" },
  meal: { pl: "źródło", en: "source" },
  student: { pl: "wykonawca", en: "doer" },
};

// ---------- Widok: Lekcje MSA od podstaw ----------
// Mini-ćwiczenie fiszkowe dla słów z lekcji MSA. Samodzielne, nie rusza
// głównego postępu (to osobny rejestr — MSA z własną wymową).
function MsaPractice({ examples, onClose }) {
  const lang = useLang();
  const [order] = useState(() => shuffle(examples.map((_, i) => i)));
  const [pos, setPos] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [known, setKnown] = useState(0);

  const ex = examples[order[pos]];
  const isLast = pos + 1 >= order.length;

  function next(gotIt) {
    if (gotIt) setKnown((k) => k + 1);
    if (isLast) { setPos(order.length); return; } // ekran wyniku
    setPos((p) => p + 1);
    setFlipped(false);
  }

  if (pos >= order.length) {
    return (
      <div className="msa-practice">
        <div className="msa-practice-done">
          <div className="msa-practice-score">{known} / {order.length}</div>
          <p>{lang === "en" ? "Practice complete!" : "Ćwiczenie ukończone!"}</p>
          <button className="nav-btn nav-btn-primary" onClick={onClose}>
            {lang === "en" ? "done" : "gotowe"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="msa-practice">
      <div className="msa-practice-bar">
        <span className="msa-practice-count">{pos + 1} / {order.length}</span>
        <button className="msa-practice-close" onClick={onClose}>✕</button>
      </div>
      <div className="msa-practice-card" onClick={() => setFlipped((f) => !f)}>
        {!flipped ? (
          <>
            <span className="msa-practice-ar">{ex.ar}</span>
            <span className="msa-practice-hint">{lang === "en" ? "tap to reveal" : "dotknij, by odsłonić"}</span>
          </>
        ) : (
          <>
            <span className="msa-practice-ar">{ex.ar}</span>
            <span className="msa-practice-msa">{ex.msaPh} <span className="msal-tag">MSA</span></span>
            <span className="msa-practice-eg">{ex.egPh} <span className="msal-tag msal-tag-eg">{lang === "en" ? "EGY" : "eg."}</span></span>
            <span className="msa-practice-meaning">{lang === "en" ? ex.en : ex.pl}</span>
          </>
        )}
      </div>
      {flipped && (
        <div className="msa-practice-actions">
          <button className="nav-btn" onClick={() => next(false)}>
            {lang === "en" ? "not yet" : "jeszcze nie"}
          </button>
          <button className="nav-btn nav-btn-primary" onClick={() => next(true)}>
            {lang === "en" ? "got it" : "umiem"}
          </button>
        </div>
      )}
    </div>
  );
}

// ---------- Widok: tabela alfabetu (28 liter, 4 formy) ----------
// Ćwiczenie: pokaż formę litery (w losowej pozycji), zgadnij którą to litera
// spośród grupy podobnych. Nie rusza głównego postępu.
function LetterQuiz({ onClose }) {
  const lang = useLang();
  const FORM_KEYS = ["iso", "ini", "med", "fin"];
  const FORM_LABELS = {
    iso: { pl: "forma izolowana", en: "isolated form" },
    ini: { pl: "forma początkowa", en: "initial form" },
    med: { pl: "forma środkowa", en: "medial form" },
    fin: { pl: "forma końcowa", en: "final form" },
  };

  const [round, setRound] = useState(0);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(null);
  const TOTAL = 10;

  // Generuj pytanie: losowa grupa, losowa litera z niej, losowa forma.
  const question = useMemo(() => {
    const grp = SIMILAR_GROUPS[Math.floor(Math.random() * SIMILAR_GROUPS.length)];
    const letterChar = grp.letters[Math.floor(Math.random() * grp.letters.length)];
    const letter = ARABIC_ALPHABET.find((l) => l.iso === letterChar);
    const formKey = FORM_KEYS[Math.floor(Math.random() * FORM_KEYS.length)];
    const options = shuffle([...grp.letters]);
    return { grp, letter, formKey, options };
  }, [round]);

  if (round >= TOTAL) {
    return (
      <div className="lq">
        <div className="lq-done">
          <div className="lq-score-big">{score} / {TOTAL}</div>
          <p>{lang === "en" ? "Nice work!" : "Dobra robota!"}</p>
          <button className="nav-btn nav-btn-primary" onClick={onClose}>
            {lang === "en" ? "done" : "gotowe"}
          </button>
        </div>
      </div>
    );
  }

  const q = question;
  const shownForm = q.letter[q.formKey];

  function pick(letterChar) {
    if (answered) return;
    const correct = letterChar === q.letter.iso;
    setAnswered({ picked: letterChar, correct });
    if (correct) setScore((s) => s + 1);
  }
  function nextQ() {
    setAnswered(null);
    setRound((r) => r + 1);
  }

  return (
    <div className="lq">
      <div className="lq-bar">
        <span className="lq-count">{round + 1} / {TOTAL}</span>
        <button className="lq-close" onClick={onClose}>✕</button>
      </div>

      <div className="lq-prompt">
        <span className="lq-form-label">{lang === "en" ? FORM_LABELS[q.formKey].en : FORM_LABELS[q.formKey].pl}</span>
        <span className="lq-form-big">{shownForm}</span>
        <span className="lq-question">{lang === "en" ? "which letter is this?" : "która to litera?"}</span>
      </div>

      <div className="lq-options">
        {q.options.map((opt) => {
          let cls = "lq-option";
          if (answered) {
            if (opt === q.letter.iso) cls += " lq-option-correct";
            else if (opt === answered.picked) cls += " lq-option-wrong";
          }
          const optLetter = ARABIC_ALPHABET.find((l) => l.iso === opt);
          return (
            <button key={opt} className={cls} onClick={() => pick(opt)} disabled={!!answered}>
              <span className="lq-option-letter">{opt}</span>
              <span className="lq-option-name">{optLetter ? optLetter.name : ""}</span>
            </button>
          );
        })}
      </div>

      {answered && (
        <div className="lq-feedback">
          <p className="lq-hint">{lang === "en" ? q.grp.hint.en : q.grp.hint.pl}</p>
          <button className="nav-btn nav-btn-primary" onClick={nextQ}>
            {round + 1 >= TOTAL ? (lang === "en" ? "see result" : "wynik") : (lang === "en" ? "next" : "dalej")} →
          </button>
        </div>
      )}
    </div>
  );
}

// ---------- Widok: kurs koraniczny (podstawowe formuły) ----------
// ---------- Widok: Koran od podstaw (cytaty z rozbiorem 3-rejestrowym) ----------
function QuranVersesView() {
  const lang = useLang();
  const [openWord, setOpenWord] = useState(null); // "verseId-wordIdx"
  return (
    <div className="view-qverses">
      <p className="qv-intro">
        {lang === "en"
          ? "Learn Arabic through short, well-known Quranic verses. Each word is shown in three registers — Classical (Quranic), MSA (standard), and Egyptian (dialect) — so you see how one word lives across the whole language."
          : "Ucz się arabskiego przez krótkie, znane wersety Koranu. Każde słowo pokazane w trzech rejestrach — klasyczny (koraniczny), MSA (standardowy) i egipski (dialekt) — byś zobaczył, jak jedno słowo żyje w całym języku."}
      </p>
      {QURAN_VERSES.map((v) => (
        <div className="qv-verse" key={v.id}>
          <div className="qv-verse-head">
            <span className="qv-ref">{lang === "en" ? v.ref.en : v.ref.pl}</span>
          </div>
          <div className="qv-verse-ar">{v.ar}</div>
          <div className="qv-verse-ph">{v.ph}</div>
          <div className="qv-verse-tr">{lang === "en" ? v.en : v.pl}</div>

          {(v.fullMsa || v.fullEg) && (
            <div className="qv-fulls">
              {v.fullMsa && (
                <div className="qv-full qv-full-msa">
                  <span className="qv-full-label">{lang === "en" ? "whole verse in MSA" : "cały werset w MSA"}</span>
                  <span className="qv-full-ar">{v.fullMsa.ar}</span>
                  <span className="qv-full-ph">{v.fullMsa.ph}</span>
                  {v.fullMsa.note && <span className="qv-full-note">{lang === "en" ? v.fullMsa.note.en : v.fullMsa.note.pl}</span>}
                </div>
              )}
              {v.fullEg && (
                <div className="qv-full qv-full-eg">
                  <span className="qv-full-label">{lang === "en" ? "whole verse in Egyptian" : "cały werset po egipsku"}</span>
                  <span className="qv-full-ar">{v.fullEg.ar}</span>
                  <span className="qv-full-ph">{v.fullEg.ph}</span>
                  {v.fullEg.note && <span className="qv-full-note">{lang === "en" ? v.fullEg.note.en : v.fullEg.note.pl}</span>}
                </div>
              )}
            </div>
          )}

          {v.note && (
            <div className="qv-verse-note">{lang === "en" ? v.note.en : v.note.pl}</div>
          )}

          <div className="qv-words">
            <div className="qv-words-label">{lang === "en" ? "word by word" : "słowo po słowie"}</div>
            {v.words.map((w, i) => {
              const key = v.id + "-" + i;
              const open = openWord === key;
              return (
                <div className="qv-word" key={i}>
                  <button className="qv-word-head" onClick={() => setOpenWord(open ? null : key)}>
                    <span className="qv-word-cl">{w.cl}</span>
                    <span className="qv-word-meaning">{lang === "en" ? w.en : w.pl}</span>
                    <span className="qv-word-chevron">{open ? "−" : "+"}</span>
                  </button>
                  {open && (
                    <div className="qv-word-body">
                      <div className="qv-registers">
                        <div className="qv-reg qv-reg-cl">
                          <span className="qv-reg-label">{lang === "en" ? "Classical" : "klasyczny"}</span>
                          <span className="qv-reg-ar">{w.cl}</span>
                          <span className="qv-reg-ph">{w.clPh}</span>
                        </div>
                        <div className="qv-reg qv-reg-msa">
                          <span className="qv-reg-label">MSA</span>
                          <span className="qv-reg-ar">{w.msa}</span>
                          <span className="qv-reg-ph">{w.msaPh}</span>
                        </div>
                        <div className="qv-reg qv-reg-eg">
                          <span className="qv-reg-label">{lang === "en" ? "Egyptian" : "egipski"}</span>
                          <span className="qv-reg-ar">{w.eg}</span>
                          <span className="qv-reg-ph">{w.egPh}</span>
                        </div>
                      </div>
                      <p className="qv-word-note">{lang === "en" ? w.note.en : w.note.pl}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

// ---------- Widok: kwestie religijne (praktyka i kultura, pogrupowane) ----------
function ReligiousView() {
  const lang = useLang();
  return (
    <div className="view-relig">
      <p className="relig-intro">
        {lang === "en"
          ? "Religious vocabulary of daily practice and culture — prayer names, Ramadan, feasts. Terms someone outside the Muslim world often doesn't know."
          : "Słownictwo religijnej praktyki i kultury — nazwy modlitw, ramadan, święta. Terminy, których ktoś spoza świata muzułmańskiego często nie zna."}
      </p>
      {RELIGIOUS.map((g, gi) => (
        <div className="relig-group" key={gi}>
          <h3 className="relig-group-title">{lang === "en" ? g.group.en : g.group.pl}</h3>
          <div className="relig-items">
            {g.items.map((it, i) => (
              <div className="relig-item" key={i}>
                <div className="relig-item-head">
                  <span className="relig-item-ar">{it.ar}</span>
                  <div className="relig-item-txt">
                    <span className="relig-item-ph">{it.ph}</span>
                    <span className="relig-item-meaning">{lang === "en" ? it.en : it.pl}</span>
                  </div>
                </div>
                <p className="relig-item-note">{lang === "en" ? it.note.en : it.note.pl}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function QuranBasicsView() {
  const lang = useLang();
  return (
    <div className="view-quran">
      <p className="quran-intro">
        {lang === "en"
          ? "Everyday phrases with religious roots — used constantly in Egypt, often automatically. Each one is broken into its root and linked to the daily language you already know."
          : "Codzienne zwroty o religijnym pochodzeniu — używane w Egipcie bez przerwy, często automatycznie. Każdy rozłożony na rdzeń i spięty z codziennym językiem, który już znasz."}
      </p>
      {QURAN_BASICS.map((f, i) => (
        <div className="quran-card" key={i}>
          <div className="quran-card-ar">{f.ar}</div>
          <div className="quran-card-ph">{f.ph}</div>
          <div className="quran-card-meaning">{lang === "en" ? f.en : f.pl}</div>
          <p className="quran-card-note">{lang === "en" ? f.note.en : f.note.pl}</p>
          <div className="quran-card-root">
            <span className="quran-root-label">{lang === "en" ? "root" : "rdzeń"}</span>
            <span className="quran-root-ar">{f.root.ar}</span>
            <span className="quran-root-tr">{f.root.tr}</span>
          </div>
          <p className="quran-root-link">{f.root.link}</p>
        </div>
      ))}
    </div>
  );
}

function AlphabetView() {
  const lang = useLang();
  const [openLetter, setOpenLetter] = useState(null);
  const [quizzing, setQuizzing] = useState(false);

  if (quizzing) {
    return <LetterQuiz onClose={() => setQuizzing(false)} />;
  }

  return (
    <div className="view-alphabet">
      <p className="alpha-intro">
        {lang === "en"
          ? "The Arabic alphabet — all 28 letters. Each letter changes shape depending on its position in the word: isolated, initial, medial, final. Tap a letter to see all four forms."
          : "Alfabet arabski — wszystkie 28 liter. Każda litera zmienia kształt zależnie od miejsca w wyrazie: izolowana, początkowa, środkowa, końcowa. Dotknij litery, by zobaczyć cztery formy."}
      </p>

      <div className="alpha-legend">
        <span className="alpha-legend-item"><span className="alpha-dot alpha-dot-connect"></span>{lang === "en" ? "connects both sides" : "łączy się z obu stron"}</span>
        <span className="alpha-legend-item"><span className="alpha-dot alpha-dot-noconnect"></span>{lang === "en" ? "doesn't connect to next" : "nie łączy z następną"}</span>
      </div>

      <details className="alpha-rule">
        <summary>{lang === "en" ? "Why a letter is sometimes 'isolated' at the end of a word" : "Dlaczego litera bywa „izolowana” na końcu wyrazu"}</summary>
        <p>
          {lang === "en"
            ? "A letter only takes its final or medial shape when it connects to the letter before it. After a non-connecting letter (ا د ذ ر ز و and hamza), a letter at the end of a word appears in its isolated form, and in the middle — in its initial form. Example: in فِراش (firaash) the ش comes after ا (non-connecting), so it's isolated ش, not final ـش."
            : "Litera przyjmuje formę końcową lub środkową tylko wtedy, gdy łączy się z literą przed nią. Po literze niełączącej (ا د ذ ر ز و i hamza) litera na końcu wyrazu ma formę izolowaną, a w środku — początkową. Przykład: w فِراش (firaash) litera ش stoi po ا (niełączące), więc jest izolowana ش, nie końcowa ـش."}
        </p>
      </details>

      <button className="alpha-quiz-btn" onClick={() => setQuizzing(true)}>
        {lang === "en" ? "practice: tell similar letters apart" : "ćwicz: rozróżnij podobne litery"}
      </button>

      <div className="alpha-grid">
        {ARABIC_ALPHABET.map((l) => (
          <button
            key={l.name}
            className={`alpha-cell ${l.nonConnect ? "alpha-cell-nc" : ""} ${openLetter === l.name ? "alpha-cell-open" : ""}`}
            onClick={() => setOpenLetter(openLetter === l.name ? null : l.name)}
          >
            <span className="alpha-cell-letter">{l.iso}</span>
            <span className="alpha-cell-name">{l.name}</span>
          </button>
        ))}
      </div>

      {openLetter && (() => {
        const l = ARABIC_ALPHABET.find((x) => x.name === openLetter);
        // Określa REALNĄ formę litery w danym słowie na danej pozycji.
        // W arabskim litera przyjmuje formę końcową/środkową tylko gdy łączy się
        // z POPRZEDNIĄ literą. Jeśli poprzednia jest niełącząca (ا د ذ ر ز و + hamza),
        // litera na końcu jest w formie IZOLOWANEJ, a w środku — POCZĄTKOWEJ.
        function realForm(word, baseLetter, pos) {
          const NON_CONNECT = "اأإآدذرزوءى";
          const chars = [...word];
          const idxs = [];
          chars.forEach((c, i) => { if (c === baseLetter) idxs.push(i); });
          let target = idxs[0];
          if (pos === "fin") target = idxs[idxs.length - 1];
          else if (pos === "med" && idxs.length > 1) target = idxs[Math.floor(idxs.length / 2)];
          else if (pos === "iso") {
            for (let k = idxs.length - 1; k >= 0; k--) {
              const idx = idxs[k];
              let pp = idx - 1;
              while (pp >= 0 && chars[pp].charCodeAt(0) >= 0x064B && chars[pp].charCodeAt(0) <= 0x0652) pp--;
              const pc = pp >= 0 ? chars[pp] : "";
              let nn = idx + 1;
              while (nn < chars.length && chars[nn].charCodeAt(0) >= 0x064B && chars[nn].charCodeAt(0) <= 0x0652) nn++;
              const nc = nn < chars.length ? chars[nn] : "";
              const cR = pc && !NON_CONNECT.includes(pc);
              const cL = !NON_CONNECT.includes(baseLetter) && nc;
              if (!cR && !cL) { target = idx; break; }
            }
          }
          if (target === undefined) return pos;
          let p = target - 1;
          while (p >= 0 && chars[p].charCodeAt(0) >= 0x064B && chars[p].charCodeAt(0) <= 0x0652) p--;
          const prevChar = p >= 0 ? chars[p] : "";
          const connectsRight = prevChar && !NON_CONNECT.includes(prevChar);
          if (pos === "fin" && !connectsRight) return "iso"; // końcowa bez łączenia = izolowana
          if (pos === "med" && !connectsRight) return "ini"; // środkowa bez łączenia = początkowa
          return pos;
        }
        const POS_LABELS = {
          iso: { pl: "tu: izolowana", en: "here: isolated" },
          ini: { pl: "tu: początkowa", en: "here: initial" },
          med: { pl: "tu: środkowa", en: "here: medial" },
          fin: { pl: "tu: końcowa", en: "here: final" },
        };
        const forms = [
          { key: "iso", label: { pl: "izolowana", en: "isolated" }, val: l.iso, ex: l.ex ? l.ex.iso : null, pos: "iso" },
          { key: "ini", label: { pl: "początkowa", en: "initial" }, val: l.ini, ex: l.ex ? l.ex.ini : null, pos: "ini" },
          { key: "med", label: { pl: "środkowa", en: "medial" }, val: l.med, ex: l.ex ? l.ex.med : null, pos: "med" },
          { key: "fin", label: { pl: "końcowa", en: "final" }, val: l.fin, ex: l.ex ? l.ex.fin : null, pos: "fin" },
        ];
        // Podświetla literę bazową w słowie (pierwsze wystąpienie właściwe dla pozycji).
        function highlightWord(word, baseLetter, pos) {
          const NON_CONNECT_H = "اأإآدذرزوءى";
          const chars = [...word];
          const idxs = [];
          chars.forEach((c, i) => { if (c === baseLetter) idxs.push(i); });
          let target = idxs[0];
          if (pos === "fin") target = idxs[idxs.length - 1];
          else if (pos === "med" && idxs.length > 1) target = idxs[Math.floor(idxs.length / 2)];
          else if (pos === "iso") {
            // Litera jest IZOLOWANA gdy nie łączy się ani w prawo, ani w lewo.
            // Gdy jest wiele takich wystąpień, wybieramy OSTATNIE (najbardziej naturalne
            // wizualnie — litera na końcu wyrazu).
            for (let k = idxs.length - 1; k >= 0; k--) {
              const idx = idxs[k];
              let pp = idx - 1;
              while (pp >= 0 && chars[pp].charCodeAt(0) >= 0x064B && chars[pp].charCodeAt(0) <= 0x0652) pp--;
              const pc = pp >= 0 ? chars[pp] : "";
              let nn = idx + 1;
              while (nn < chars.length && chars[nn].charCodeAt(0) >= 0x064B && chars[nn].charCodeAt(0) <= 0x0652) nn++;
              const nc = nn < chars.length ? chars[nn] : "";
              const connectsRight = pc && !NON_CONNECT_H.includes(pc);
              const connectsLeft = !NON_CONNECT_H.includes(baseLetter) && nc;
              if (!connectsRight && !connectsLeft) { target = idx; break; }
            }
          }
          if (target === undefined) return word;
          // Dziel słowo na 3 części: przed literą, litera (z jej haraką), po literze.
          // Nie rozbijamy każdego znaku — tylko jeden span — żeby zachować łączenie ligatur.
          // Haraka tuż po literze (jeśli jest) dołączamy do podświetlonego fragmentu.
          let end = target + 1;
          while (end < chars.length && chars[end].charCodeAt(0) >= 0x064B && chars[end].charCodeAt(0) <= 0x0652) {
            end++;
          }
          const before = chars.slice(0, target).join("");
          const mid = chars.slice(target, end).join("");
          const after = chars.slice(end).join("");
          // Łączenie w arabskim zależy od liter niełączących (ا د ذ ر ز و + hamza).
          // Taka litera NIE łączy się z następną. ZWJ dodajemy tylko tam, gdzie
          // realne łączenie istnieje — inaczej wymusilibyśmy fałszywą ligaturę.
          const NON_CONNECT = "اأإآدذرزوءى";
          const prevChar = target > 0 ? chars[target - 1] : "";
          const baseChar = baseLetter;
          // ZWJ przed literą: tylko gdy poprzednia litera łączy się z następną
          // (czyli poprzednia NIE jest niełącząca) i coś przed nią jest.
          const prevConnects = prevChar && !NON_CONNECT.includes(prevChar);
          const leftJoin = (before.length > 0 && prevConnects) ? "\u200D" : "";
          // ZWJ po literze: tylko gdy sama litera bazowa się łączy (nie jest niełącząca)
          // i coś po niej następuje.
          const baseConnects = !NON_CONNECT.includes(baseChar);
          const rightJoin = (after.length > 0 && baseConnects) ? "\u200D" : "";
          return (
            <>
              {before}
              <span className="alpha-hl">{leftJoin + mid + rightJoin}</span>
              {after}
            </>
          );
        }
        return (
          <div className="alpha-detail">
            <div className="alpha-detail-head">
              <span className="alpha-detail-name">{l.name} <AudioButton word={{ ar: l.iso, pl: l.name, cat: "alphabet" }} size={16} /></span>
              <span className="alpha-detail-sound">{lang === "en" ? l.sound.en : l.sound.pl}</span>
            </div>
            <div className="alpha-forms" dir="rtl">
              {forms.map((f) => (
                <div className="alpha-form" key={f.key}>
                  <span className="alpha-form-val">{f.val}</span>
                  <span className="alpha-form-label">{lang === "en" ? f.label.en : f.label.pl}</span>
                  {f.ex && (
                    <div className="alpha-form-ex">
                      <span className="alpha-form-ex-word">{highlightWord(f.ex.w, l.iso, f.pos)}</span>
                      {(() => {
                        const rf = realForm(f.ex.w, l.iso, f.pos);
                        if (rf !== f.pos) {
                          return <span className="alpha-form-ex-note">{lang === "en" ? POS_LABELS[rf].en : POS_LABELS[rf].pl}</span>;
                        }
                        return null;
                      })()}
                      <span className="alpha-form-ex-ph" dir="ltr">{f.ex.ph}</span>
                      <span className="alpha-form-ex-meaning" dir="ltr">{lang === "en" ? f.ex.en : f.ex.pl}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
            {l.nonConnect && (
              <p className="alpha-detail-note">
                {lang === "en"
                  ? "This letter never connects to the letter after it — the word 'breaks' here."
                  : "Ta litera nigdy nie łączy się z następną — wyraz się tu „przerywa”."}
              </p>
            )}
          </div>
        );
      })()}
    </div>
  );
}

// Role składniowe dla rozbioru zdań (Moduł 3) — etykieta + kolor.
const SYNTAX_ROLES = {
  subject: { pl: "podmiot", en: "subject", color: "#2e7d52" },
  predicate: { pl: "orzecznik", en: "predicate", color: "#c66e4a" },
  verb: { pl: "czasownik", en: "verb", color: "#b8860b" },
  object: { pl: "dopełnienie", en: "object", color: "#7a5cb8" },
  adverbial: { pl: "okolicznik", en: "adverbial", color: "#4a90a4" },
  mudaf: { pl: "muḍāf (1. człon)", en: "muḍāf (1st term)", color: "#2e7d52" },
  mudafilayhi: { pl: "muḍāf ilayhi (2. człon)", en: "muḍāf ilayhi (2nd term)", color: "#c66e4a" },
};

// ---------- Widok: ścieżka lekcji egipskiego (prowadzona, ze śledzeniem postępu) ----------
const EG_PATH_KEY = "ar-eg-egpath-v1";
function loadEgPathDone() {
  try { const raw = localStorage.getItem(EG_PATH_KEY); if (raw) return JSON.parse(raw); } catch (e) {}
  return {};
}
function saveEgPathDone(done) {
  try { localStorage.setItem(EG_PATH_KEY, JSON.stringify(done)); } catch (e) {}
}

function EgPathBlock({ b, lang }) {
  if (b.type === "text") return <p className="mpath-text">{lang === "en" ? b.en : b.pl}</p>;
  if (b.type === "tip") return <div className="mpath-tip"><span className="mpath-tip-icon">💡</span><span>{lang === "en" ? b.en : b.pl}</span></div>;
  if (b.type === "word" || b.type === "phrase") return (
    <div className="egp-word">
      <span className="egp-word-ar">{b.ar}</span>
      <div className="egp-word-txt">
        <span className="egp-word-ph">{b.ph} <AudioButton word={{ ar: b.ar, pl: b.pl, cat: "path" }} size={16} /></span>
        <span className="egp-word-meaning">{lang === "en" ? b.en : b.pl}</span>
      </div>
    </div>
  );
  if (b.type === "sentence") return (
    <div className="egp-sentence">
      <span className="egp-sent-ar">{b.ar}</span>
      <span className="egp-sent-ph">{b.ph} <AudioButton word={{ ar: b.ar, pl: b.pl, cat: "path" }} size={16} /></span>
      <span className="egp-sent-tr">{lang === "en" ? b.en : b.pl}</span>
    </div>
  );
  return null;
}

function EgPathView({ onGoFlashcards }) {
  const lang = useLang();
  const [done, setDone] = useState(loadEgPathDone);
  const [openLesson, setOpenLesson] = useState(null);

  const markDone = (id) => {
    const nd = { ...done, [id]: true };
    setDone(nd); saveEgPathDone(nd);
    setOpenLesson(null);
  };
  const doneCount = EG_PATH.filter((l) => done[l.id]).length;
  const nextIdx = EG_PATH.findIndex((l) => !done[l.id]);

  if (openLesson) {
    const lesson = EG_PATH.find((l) => l.id === openLesson);
    const kindLabel = lesson.kind === "grammar"
      ? (lang === "en" ? "grammar" : "gramatyka")
      : (lang === "en" ? "practice" : "praktyka");
    return (
      <div className="view-mpath">
        <button className="mpath-back" onClick={() => setOpenLesson(null)}>← {lang === "en" ? "lessons" : "lekcje"}</button>
        <div className="mpath-lesson">
          <div className="mpath-lesson-num">
            {lang === "en" ? "Lesson" : "Lekcja"} {lesson.num}
            <span className={`egp-kind egp-kind-${lesson.kind}`}>{kindLabel}</span>
          </div>
          <h2 className="mpath-lesson-title">{lang === "en" ? lesson.title.en : lesson.title.pl}</h2>
          <p className="mpath-lesson-goal">{lang === "en" ? lesson.goal.en : lesson.goal.pl}</p>
          <div className="mpath-blocks">
            {lesson.blocks.map((b, i) => <EgPathBlock key={i} b={b} lang={lang} />)}
          </div>
          {lesson.fiszki && (
            <button className="egp-fiszki-btn" onClick={() => onGoFlashcards && onGoFlashcards(lesson.fiszki.cat)}>
              🗂️ {lang === "en" ? lesson.fiszki.en : lesson.fiszki.pl}
            </button>
          )}
          <button className="mpath-done-btn" onClick={() => markDone(lesson.id)}>
            {done[lesson.id] ? (lang === "en" ? "✓ completed — close" : "✓ ukończono — zamknij") : (lang === "en" ? "mark as done" : "oznacz jako ukończone")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="view-mpath">
      <div className="mpath-header">
        <h2 className="mpath-h">{lang === "en" ? "Egyptian: zero to hero" : "Egipski: od zera do bohatera"}</h2>
        <p className="mpath-sub">{lang === "en" ? "A guided path that alternates practical phrases and grammar. Take the lessons in order." : "Prowadzona ścieżka na zmianę: zwrot praktyczny i klocek gramatyczny. Przechodź lekcje po kolei."}</p>
        <div className="mpath-progress">
          <div className="mpath-progress-bar"><div className="mpath-progress-fill" style={{ width: `${(doneCount / EG_PATH.length) * 100}%`, background: "var(--teal)" }} /></div>
          <span className="mpath-progress-txt">{doneCount} / {EG_PATH.length}</span>
        </div>
      </div>
      <div className="mpath-list">
        {EG_PATH.map((l, i) => {
          const isDone = !!done[l.id];
          const isNext = i === nextIdx;
          const kindLabel = l.kind === "grammar" ? (lang === "en" ? "grammar" : "gramatyka") : (lang === "en" ? "practice" : "praktyka");
          return (
            <button key={l.id} className={`mpath-item ${isDone ? "mpath-item-done" : ""} ${isNext ? "mpath-item-next mpath-item-next-eg" : ""}`} onClick={() => setOpenLesson(l.id)}>
              <span className={`mpath-item-num ${isDone ? "" : "egp-num-" + l.kind}`}>{isDone ? "✓" : l.num}</span>
              <span className="mpath-item-body">
                <span className="mpath-item-title">{lang === "en" ? l.title.en : l.title.pl}</span>
                <span className="mpath-item-goal">{lang === "en" ? l.goal.en : l.goal.pl}</span>
                <span className={`egp-kind egp-kind-${l.kind}`}>{kindLabel}</span>
              </span>
              {isNext && <span className="mpath-item-badge mpath-item-badge-eg">{lang === "en" ? "next" : "następna"}</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ---------- Widok: ścieżka lekcji MSA (prowadzona, ze śledzeniem postępu) ----------
const MSA_PATH_KEY_BASE = "ar-eg-msapath-v1";
function loadPathDone() {
  try { const raw = localStorage.getItem(MSA_PATH_KEY_BASE); if (raw) return JSON.parse(raw); } catch (e) {}
  return {};
}
function savePathDone(done) {
  try { localStorage.setItem(MSA_PATH_KEY_BASE, JSON.stringify(done)); } catch (e) {}
}

function MsaPathBlock({ b, lang }) {
  if (b.type === "text") return <p className="mpath-text">{lang === "en" ? b.en : b.pl}</p>;
  if (b.type === "tip") return <div className="mpath-tip"><span className="mpath-tip-icon">💡</span><span>{lang === "en" ? b.en : b.pl}</span></div>;
  if (b.type === "fact" || b.type === "word") return (
    <div className="mpath-word">
      <span className="mpath-word-ar">{b.ar}</span>
      <span className="mpath-word-ph">{b.ph}</span>
      <span className="mpath-word-meaning">{lang === "en" ? b.en : b.pl}</span>
    </div>
  );
  if (b.type === "letter") return (
    <div className="mpath-letter">
      <span className="mpath-letter-ar">{b.ar}</span>
      <div className="mpath-letter-txt">
        <span className="mpath-letter-ph">{b.ph}</span>
        <span className="mpath-letter-desc">{lang === "en" ? b.en : b.pl}</span>
      </div>
    </div>
  );
  if (b.type === "haraka") return (
    <div className="mpath-haraka">
      <span className="mpath-haraka-ar">{b.ar}</span>
      <div className="mpath-letter-txt">
        <span className="mpath-letter-ph">{b.ph}</span>
        <span className="mpath-letter-desc">{lang === "en" ? b.en : b.pl}</span>
      </div>
    </div>
  );
  if (b.type === "forms") return (
    <div className="mpath-forms" dir="rtl">
      {[["iso", b.iso], ["ini", b.ini], ["med", b.med], ["fin", b.fin]].map(([k, v]) => (
        <span className="mpath-form" key={k}>{v}</span>
      ))}
      <span className="mpath-forms-desc" dir="ltr">{lang === "en" ? b.en : b.pl}</span>
    </div>
  );
  if (b.type === "compare") return (
    <div className="mpath-compare">
      <span className="mpath-cmp-msa">{b.msa}<span className="msal-tag">MSA</span></span>
      <span className="mpath-cmp-eg">{b.eg}<span className="msal-tag msal-tag-eg">{lang === "en" ? "EGY" : "eg."}</span></span>
      <span className="mpath-cmp-desc">{lang === "en" ? b.en : b.pl}</span>
    </div>
  );
  if (b.type === "sentence") return (
    <div className="mpath-sentence">
      <span className="mpath-sent-ar">{b.ar}</span>
      <span className="mpath-sent-ph">{b.ph}</span>
      <span className="mpath-sent-tr">{lang === "en" ? b.en : b.pl}</span>
    </div>
  );
  return null;
}

function MsaPathView() {
  const lang = useLang();
  const [done, setDone] = useState(loadPathDone);
  const [openLesson, setOpenLesson] = useState(null);

  const markDone = (id) => {
    const nd = { ...done, [id]: true };
    setDone(nd); savePathDone(nd);
    setOpenLesson(null);
  };
  const doneCount = MSA_PATH.filter((l) => done[l.id]).length;
  // pierwsza nieukończona = "następna lekcja"
  const nextIdx = MSA_PATH.findIndex((l) => !done[l.id]);

  if (openLesson) {
    const lesson = MSA_PATH.find((l) => l.id === openLesson);
    return (
      <div className="view-mpath">
        <button className="mpath-back" onClick={() => setOpenLesson(null)}>← {lang === "en" ? "lessons" : "lekcje"}</button>
        <div className="mpath-lesson">
          <div className="mpath-lesson-num">{lang === "en" ? "Lesson" : "Lekcja"} {lesson.num}</div>
          <h2 className="mpath-lesson-title">{lang === "en" ? lesson.title.en : lesson.title.pl}</h2>
          <p className="mpath-lesson-goal">{lang === "en" ? lesson.goal.en : lesson.goal.pl}</p>
          <div className="mpath-blocks">
            {lesson.blocks.map((b, i) => <MsaPathBlock key={i} b={b} lang={lang} />)}
          </div>
          <button className="mpath-done-btn" onClick={() => markDone(lesson.id)}>
            {done[lesson.id] ? (lang === "en" ? "✓ completed — close" : "✓ ukończono — zamknij") : (lang === "en" ? "mark as done" : "oznacz jako ukończone")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="view-mpath">
      <div className="mpath-header">
        <h2 className="mpath-h">{lang === "en" ? "MSA: zero to hero" : "MSA: od zera do bohatera"}</h2>
        <p className="mpath-sub">{lang === "en" ? "A guided path. Take the lessons in order — each builds on the last." : "Prowadzona ścieżka. Przechodź lekcje po kolei — każda buduje na poprzedniej."}</p>
        <div className="mpath-progress">
          <div className="mpath-progress-bar"><div className="mpath-progress-fill" style={{ width: `${(doneCount / MSA_PATH.length) * 100}%` }} /></div>
          <span className="mpath-progress-txt">{doneCount} / {MSA_PATH.length}</span>
        </div>
      </div>
      <div className="mpath-list">
        {MSA_PATH.map((l, i) => {
          const isDone = !!done[l.id];
          const isNext = i === nextIdx;
          const locked = false; // wszystkie dostępne, ale "następna" jest wyróżniona
          return (
            <button key={l.id} className={`mpath-item ${isDone ? "mpath-item-done" : ""} ${isNext ? "mpath-item-next" : ""}`} onClick={() => setOpenLesson(l.id)}>
              <span className="mpath-item-num">{isDone ? "✓" : l.num}</span>
              <span className="mpath-item-body">
                <span className="mpath-item-title">{lang === "en" ? l.title.en : l.title.pl}</span>
                <span className="mpath-item-goal">{lang === "en" ? l.goal.en : l.goal.pl}</span>
              </span>
              {isNext && <span className="mpath-item-badge">{lang === "en" ? "next" : "następna"}</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function MsaLessonsView() {
  const lang = useLang();
  const [openLesson, setOpenLesson] = useState(null);
  const [showTech, setShowTech] = useState({});
  const [practicing, setPracticing] = useState(null); // examples[] gdy ćwiczymy

  if (practicing) {
    return <MsaPractice examples={practicing} onClose={() => setPracticing(null)} />;
  }

  return (
    <div className="view-msalessons">
      <p className="msal-intro">
        {lang === "en"
          ? "MSA from the ground up — built for reading. Each lesson shows how a letter or word works in literary Arabic, and how it maps to the Egyptian you already know."
          : "MSA od podstaw — pod kątem czytania. Każda lekcja pokazuje, jak litera lub słowo działa w literackim arabskim i jak łączy się z egipskim, który już znasz."}
      </p>

      {MSA_MODULES.map((mod, modIdx) => (
        <div className="msal-module" key={mod.id}>
          <div className="msal-module-head">
            <span className="msal-module-num">{modIdx + 1}</span>
            <div>
              <div className="msal-module-title">{lang === "en" ? mod.title.en : mod.title.pl}</div>
              <div className="msal-module-desc">{lang === "en" ? mod.desc.en : mod.desc.pl}</div>
            </div>
          </div>

          <div className="msal-lessons">
            {mod.lessons.map((lesson) => {
              const isOpen = openLesson === lesson.id;
              const tech = showTech[lesson.id];
              return (
                <div className={`msal-lesson ${isOpen ? "msal-lesson-open" : ""}`} key={lesson.id}>
                  <button
                    className="msal-lesson-head"
                    onClick={() => setOpenLesson(isOpen ? null : lesson.id)}
                  >
                    {lesson.letter && <span className="msal-lesson-letter">{lesson.letter}</span>}
                    <span className="msal-lesson-title">{lang === "en" ? lesson.title.en : lesson.title.pl}</span>
                    <span className="msal-lesson-chevron">{isOpen ? "−" : "+"}</span>
                  </button>

                  {isOpen && (
                    <div className="msal-lesson-body">
                      <p className="msal-simple">{lang === "en" ? lesson.simple.en : lesson.simple.pl}</p>

                      {lesson.bridge && (
                        <div className="msal-bridge">
                          <span className="msal-bridge-tag">{lang === "en" ? "you already know this" : "to już znasz"}</span>
                          <span className="msal-bridge-text">{lang === "en" ? lesson.bridge.en : lesson.bridge.pl}</span>
                        </div>
                      )}

                      <button
                        className="msal-tech-toggle"
                        onClick={() => setShowTech((s) => ({ ...s, [lesson.id]: !s[lesson.id] }))}
                      >
                        {tech
                          ? (lang === "en" ? "hide technical detail" : "ukryj szczegół techniczny")
                          : (lang === "en" ? "technical detail" : "szczegół techniczny")}
                      </button>
                      {tech && (
                        <p className="msal-tech">{lang === "en" ? lesson.tech.en : lesson.tech.pl}</p>
                      )}

                      <div className="msal-examples">
                        {(lesson.examples || lesson.words) && (
                          <div className="msal-examples-label">
                            {lang === "en" ? "examples (MSA vs Egyptian)" : "przykłady (MSA vs egipski)"}
                          </div>
                        )}
                        {lesson.sentences && (
                          <div className="msal-examples-label">
                            {lang === "en" ? "sentence breakdown" : "rozbiór zdań"}
                          </div>
                        )}
                        {lesson.examples && lesson.examples.map((ex, i) => (
                          <div className="msal-example" key={i}>
                            <span className="msal-example-ar">{ex.ar}</span>
                            <div className="msal-example-phs">
                              <span className="msal-example-msa">{ex.msaPh}<span className="msal-tag">MSA</span></span>
                              <span className="msal-example-eg">{ex.egPh}<span className="msal-tag msal-tag-eg">{lang === "en" ? "EGY" : "eg."}</span></span>
                            </div>
                            <span className="msal-example-meaning">{lang === "en" ? ex.en : ex.pl}</span>
                          </div>
                        ))}
                        {lesson.words && lesson.words.map((w, i) => (
                          <div className="msal-word" key={i}>
                            <div className="msal-word-head">
                              <span className="msal-word-ar">{w.ar}</span>
                              <div className="msal-word-phs">
                                <span className="msal-example-msa">{w.msaPh}<span className="msal-tag">MSA</span></span>
                                <span className="msal-example-eg">{w.egPh}<span className="msal-tag msal-tag-eg">{lang === "en" ? "EGY" : "eg."}</span></span>
                              </div>
                              <span className="msal-word-meaning">{lang === "en" ? w.en : w.pl}</span>
                            </div>
                            <div className="msal-word-sentence">
                              <span className="msal-sent-ar">{w.sMsa}</span>
                              <div className="msal-sent-phs">
                                <span className="msal-sent-msa">{w.sMsaPh}<span className="msal-tag">MSA</span></span>
                                <span className="msal-sent-eg">{w.sEg}<span className="msal-tag msal-tag-eg">{lang === "en" ? "EGY" : "eg."}</span></span>
                              </div>
                              <span className="msal-sent-meaning">{lang === "en" ? w.sEn : w.sPl}</span>
                            </div>
                          </div>
                        ))}
                        {lesson.sentences && lesson.sentences.map((s, i) => (
                          <div className="msal-synt" key={i}>
                            <span className="msal-synt-type">{lang === "en" ? s.type.en : s.type.pl}</span>
                            <div className="msal-synt-line" dir="rtl">
                              {s.segs.map((seg, j) => {
                                const role = SYNTAX_ROLES[seg.role] || { pl: seg.role, en: seg.role, color: "#666" };
                                return (
                                  <span className="msal-seg" key={j} style={{ borderColor: role.color }}>
                                    <span className="msal-seg-ar" style={{ color: role.color }}>{seg.ar}</span>
                                    <span className="msal-seg-ph">{seg.ph}</span>
                                    <span className="msal-seg-role" style={{ color: role.color }}>{lang === "en" ? role.en : role.pl}</span>
                                  </span>
                                );
                              })}
                            </div>
                            <span className="msal-synt-tr">{lang === "en" ? s.en : s.pl}</span>
                          </div>
                        ))}
                      </div>

                      {lesson.note && (
                        <div className="msal-synt-note">
                          <span className="msal-bridge-tag">{lang === "en" ? "MSA vs Egyptian" : "MSA vs egipski"}</span>
                          <span>{lang === "en" ? lesson.note.en : lesson.note.pl}</span>
                        </div>
                      )}

                      {(lesson.examples || lesson.words) && (
                        <button
                          className="msal-practice-btn"
                          onClick={() => setPracticing(lesson.examples || lesson.words)}
                        >
                          {lang === "en" ? "practice these words" : "ćwicz te słowa"}
                        </button>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

function RootsView({ initialRoot = 0 }) {
  const lang = useLang();
  const [openRoot, setOpenRoot] = useState(initialRoot);
  const [showTech, setShowTech] = useState({});

  useEffect(() => { setOpenRoot(initialRoot); }, [initialRoot]);

  return (
    <div className="view-roots">
      <p className="roots-intro">
        {lang === "en"
          ? "The heart of Arabic: from one three-letter root, a whole family of words grows by patterns (awzān). The same root lives in MSA, Egyptian, and classical Arabic."
          : "Serce arabskiego: z jednego trójliterowego rdzenia wyrasta cała rodzina słów według wzorów (أوزان). Ten sam rdzeń żyje w MSA, egipskim i arabskim klasycznym."}
      </p>

      <div className="roots-tabs">
        {MSA_ROOTS.map((r, i) => (
          <button
            key={i}
            className={`roots-tab ${openRoot === i ? "roots-tab-active" : ""}`}
            onClick={() => setOpenRoot(i)}
          >
            <span className="roots-tab-ar">{r.root.ar}</span>
            <span className="roots-tab-tr">{r.root.tr}</span>
          </button>
        ))}
      </div>

      {(() => {
        const r = MSA_ROOTS[openRoot];
        return (
          <div className="root-panel">
            <div className="root-head">
              <span className="root-head-ar">{r.root.ar}</span>
              <span className="root-head-tr">{r.root.tr}</span>
              <span className="root-head-meaning">
                {lang === "en" ? r.coreIdea.en : r.coreIdea.pl}
              </span>
            </div>

            <div className="root-family">
              {r.family.map((f, j) => {
                const roleLabel = ROLE_LABELS[f.role] || { pl: f.role, en: f.role };
                const key = openRoot + "-" + j;
                const tech = showTech[key];
                return (
                  <div className="root-word" key={j}>
                    <div className="root-word-role">
                      {lang === "en" ? roleLabel.en : roleLabel.pl}
                    </div>
                    <div className="root-word-main">
                      <div className="root-word-msa">
                        <span className="root-word-ar">{f.msa.ar}</span>
                        <span className="root-word-ph">{f.msa.ph}</span>
                        <span className="root-word-tag">MSA</span>
                      </div>
                      <div className="root-word-eg">
                        <span className="root-word-ar">{f.eg.ar}</span>
                        <span className="root-word-ph">{f.eg.ph}</span>
                        <span className="root-word-tag root-word-tag-eg">
                          {lang === "en" ? "Egyptian" : "egipski"}
                        </span>
                      </div>
                    </div>
                    <div className="root-word-meaning">
                      {lang === "en" ? f.en : f.pl}
                    </div>
                    <button
                      className="root-tech-toggle"
                      onClick={() => setShowTech((s) => ({ ...s, [key]: !s[key] }))}
                    >
                      {tech
                        ? (lang === "en" ? "hide details" : "ukryj szczegóły")
                        : (lang === "en" ? "pattern & notes" : "wzór i uwagi")}
                    </button>
                    {tech && (
                      <div className="root-tech">
                        <div className="root-wazn">
                          <span className="root-wazn-label">{lang === "en" ? "pattern (wazn):" : "wzór (wazn):"}</span>
                          <span className="root-wazn-ar">{f.wazn.ar}</span>
                          <span className="root-wazn-tr">{f.wazn.tr}</span>
                        </div>
                        <p className="root-note">{lang === "en" ? f.note.en : f.note.pl}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })()}
    </div>
  );
}

function MsaView() {
  const lang = useLang();
  const ui = useUi();
  const [group, setGroup] = useState("same"); // same | pronunciation | different

  const groups = [
    { key: "same", label: "Identyczne", labelEn: "Identical", emoji: "🟢" },
    { key: "pronunciation", label: "Inna wymowa", labelEn: "Different sound", emoji: "🟡" },
    { key: "different", label: "Inne słowo", labelEn: "Different word", emoji: "🔴" },
  ];

  return (
    <div className="view-msa">
      <p className="verbs-intro">{ui('Egipski (3aamiya) i arabski literacki (fuS7a / MSA) to dwie odmiany tego samego języka. Część słów jest identyczna, część pisze się tak samo, ale czyta inaczej, a część to zupełnie inne wyrazy. Poznanie różnic pomaga czytać i rozumieć oba.')}</p>

      <div className="msa-rules">
        <strong>{lang==="en"?"Key pronunciation rules:":"Główne reguły wymowy:"}</strong>{lang==="en"
          ? " ج is \"j\" in MSA and \"g\" in Egyptian (jamiil → gamiil). ق is \"q\" in MSA and a hamza in Egyptian (qalb → 2alb). ث \"th\" → \"t\" (thalatha → talaata). ذ \"dh\" → \"d\" (dhahab → dahab)."
          : " ج to w MSA „j”, a po egipsku „g” (jamiil → gamiil). ق to w MSA „q”, a po egipsku hamza (qalb → 2alb). ث „th” → „t” (thalatha → talaata). ذ „dh” → „d” (dhahab → dahab)."}
      </div>

      <div className="msa-tabs">
        {groups.map((g) => (
          <button
            key={g.key}
            className={`msa-tab ${group === g.key ? "msa-tab-active" : ""}`}
            onClick={() => setGroup(g.key)}
          >
            <span className="msa-tab-emoji">{g.emoji}</span>
            {lang==="en"&&g.labelEn?g.labelEn:g.label}
          </button>
        ))}
      </div>

      {group === "same" && (
        <div className="msa-list">
          <p className="msa-group-hint">{ui('Te same słowa w obu odmianach — bezpieczne wszędzie.')}</p>
          {MSA_COMPARISON.same.map((w, i) => (
            <div key={i} className="msa-row">
              <div className="msa-row-pl">{lang==="en"&&w.en?w.en:w.pl}</div>
              <div className="msa-pair">
                <div className="msa-variant">
                  <span className="msa-badge msa-badge-eg">{ui("egipski")}</span>
                  <span className="msa-ar">{w.eg.ar}</span>
                  <span className="msa-ph">{w.eg.ph}</span>
                </div>
                <div className="msa-variant">
                  <span className="msa-badge msa-badge-msa">MSA</span>
                  <span className="msa-ar">{w.msa.ar}</span>
                  <span className="msa-ph">{w.msa.ph}</span>
                </div>
              </div>
              {w.note && <p className="msa-note">{lang==="en"&&w.noteEn?w.noteEn:w.note}</p>}
            </div>
          ))}
        </div>
      )}

      {group === "pronunciation" && (
        <div className="msa-list">
          <p className="msa-group-hint">{ui('Pisownia arabska ta sama — różni się tylko wymowa. Świetne do nauki reguł ج/ق/ث/ذ.')}</p>
          {MSA_COMPARISON.pronunciation.map((w, i) => (
            <div key={i} className="msa-row">
              <div className="msa-row-head">
                <span className="msa-row-pl">{lang==="en"&&w.en?w.en:w.pl}</span>
                <span className="msa-ar msa-ar-shared">{w.ar}</span>
              </div>
              <div className="msa-pron-pair">
                <span className="msa-pron msa-pron-eg">🟢 {w.eg}</span>
                <span className="msa-pron msa-pron-msa">📖 {w.msa}</span>
              </div>
              <p className="msa-rule">{w.rule}</p>
            </div>
          ))}
        </div>
      )}

      {group === "different" && (
        <div className="msa-list">
          <p className="msa-group-hint">{ui('Zupełnie różne wyrazy — jeśli powiesz wersję MSA, Egipcjanin zrozumie, ale zabrzmi to książkowo.')}</p>
          {MSA_COMPARISON.different.map((w, i) => (
            <div key={i} className="msa-row">
              <div className="msa-row-pl">{lang==="en"&&w.en?w.en:w.pl}</div>
              <div className="msa-pair">
                <div className="msa-variant">
                  <span className="msa-badge msa-badge-eg">{ui("egipski")}</span>
                  <span className="msa-ar">{w.eg.ar}</span>
                  <span className="msa-ph">{w.eg.ph}</span>
                </div>
                <div className="msa-variant">
                  <span className="msa-badge msa-badge-msa">MSA</span>
                  <span className="msa-ar">{w.msa.ar}</span>
                  <span className="msa-ph">{w.msa.ph}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ---------- Widok: Na dziś (SRS + cel dzienny + seria) ----------
function TodayView({ words, stats, goal, setGoal, onStartReview, onStartNew }) {
  const lang = useLang();
  const ui = useUi();
  const due = useMemo(() => dueWords(words), [words]);
  const fresh = useMemo(() => newWords(words), [words]);
  const done = todayCount(stats);
  const streak = computeStreak(stats.days || {});
  const pct = Math.min(100, Math.round((done / goal) * 100));
  const goalMet = done >= goal;

  // Ile słów „opanowanych" (interwał ≥ 21 dni = utrwalone).
  const mastered = words.filter((w) => (w.interval || 0) >= 21).length;
  const learning = words.filter(
    (w) => (w.correctCount || w.wrongCount) && (w.interval || 0) < 21
  ).length;

  return (
    <div className="view-today">
      {/* Cel dzienny */}
      <div className="today-card today-goal">
        <div className="today-goal-head">
          <span className="today-goal-label">{lang==="en"?"Today's goal":"Cel na dziś"}</span>
          <span className={`today-goal-count ${goalMet ? "today-goal-met" : ""}`}>
            {done} / {goal}
          </span>
        </div>
        <div className="today-bar">
          <div
            className={`today-bar-fill ${goalMet ? "today-bar-done" : ""}`}
            style={{ width: pct + "%" }}
          />
        </div>
        {goalMet ? (
          <p className="today-goal-msg">🎉 {lang==="en"?"Goal reached! You can keep practicing.":"Cel osiągnięty! Możesz ćwiczyć dalej."}</p>
        ) : (
          <p className="today-goal-msg">Jeszcze {goal - done} do celu.</p>
        )}
        <div className="today-goal-picker">
          <span className="today-goal-picker-label">{lang==="en"?"change goal:":"zmień cel:"}</span>
          {GOAL_OPTIONS.map((g) => (
            <button
              key={g}
              type="button"
              className={`today-goal-btn ${goal === g ? "today-goal-btn-active" : ""}`}
              onClick={() => setGoal(g)}
            >
              {g}
            </button>
          ))}
        </div>
      </div>

      {/* Seria */}
      <div className="today-streak">
        <span className="today-streak-flame">🔥</span>
        <span className="today-streak-num">{streak}</span>
        <span className="today-streak-label">
          {lang==="en"?"day streak":(streak === 1 ? "dzień z rzędu" : "dni z rzędu")}
        </span>
      </div>

      {/* Do powtórki (SRS) */}
      <div className="today-card">
        <div className="today-row-head">
          <span className="today-row-title">🔁 {lang==="en"?"Due for review":"Do powtórki dziś"}</span>
          <span className="today-row-num">{due.length}</span>
        </div>
        <p className="today-row-desc">{ui('Słowa, które według harmonogramu zaczynasz zapominać. Powtórka teraz utrwala je najskuteczniej.')}</p>
        <button
          className="nav-btn nav-btn-primary today-start"
          onClick={onStartReview}
          disabled={due.length < 4}
        >
          {due.length < 4
            ? (lang==="en"?"not enough to review (min. 4)":"za mało do powtórki (min. 4)")
            : (lang==="en"?`review ${due.length} ${due.length === 1 ? "word" : "words"} →`:`powtórz ${due.length} ${due.length === 1 ? "słowo" : "słów"} →`)}
        </button>
      </div>

      {/* Nowe słowa */}
      <div className="today-card">
        <div className="today-row-head">
          <span className="today-row-title">✨ {lang==="en"?"New words":"Nowe słowa"}</span>
          <span className="today-row-num">{fresh.length}</span>
        </div>
        <p className="today-row-desc">{lang==="en"?"Untouched so far — ready to learn.":"Jeszcze nieruszone — do pierwszego poznania."}</p>
        <button
          className="nav-btn today-start"
          onClick={onStartNew}
          disabled={fresh.length < 4}
        >
          {lang==="en"?"learn new words →":"ucz się nowych →"}
        </button>
      </div>

      {/* Postęp ogólny */}
      <div className="today-summary">
        <div className="today-sum-item">
          <span className="today-sum-num">{mastered}</span>
          <span className="today-sum-label">opanowane</span>
        </div>
        <div className="today-sum-item">
          <span className="today-sum-num">{learning}</span>
          <span className="today-sum-label">w nauce</span>
        </div>
        <div className="today-sum-item">
          <span className="today-sum-num">{fresh.length}</span>
          <span className="today-sum-label">nowe</span>
        </div>
      </div>
    </div>
  );
}

// ---------- Motywy i czcionki (ustawienia wyglądu) ----------
// Motyw = zestaw zmiennych CSS nakładanych na :root. Domyślny = "morski".
const THEMES = {
  morski: {
    label: "Morski + bursztyn", labelEn: "Teal + amber",
    emoji: "🟢",
    vars: {
      "--sand": "#eceee7", "--sand-deep": "#d8dcd0", "--ink": "#1a2420",
      "--teal": "#1d5c52", "--teal-deep": "#123f38",
      "--terracotta": "#a66a24", "--terracotta-soft": "#e0c088", "--paper": "#ffffff",
      "--muted": "#6c766e", "--muted-soft": "#909a92", "--hairline": "rgba(0,0,0,0.06)",
    },
  },
  szalwia: {
    label: "Szałwia + glina", labelEn: "Sage + clay",
    emoji: "🌿",
    vars: {
      "--sand": "#eef0ea", "--sand-deep": "#dbe0d5", "--ink": "#1c241e",
      "--teal": "#5b7159", "--teal-deep": "#38473a",
      "--terracotta": "#a5542f", "--terracotta-soft": "#e0a878", "--paper": "#fcfdfb",
      "--muted": "#6c766e", "--muted-soft": "#909a92", "--hairline": "rgba(0,0,0,0.06)",
    },
  },
  zmierzch: {
    label: "Zmierzch (śliwka + miedź)", labelEn: "Dusk (plum + copper)",
    emoji: "🟤",
    vars: {
      "--sand": "#f3ede4", "--sand-deep": "#e2d5c4", "--ink": "#2a1c18",
      "--teal": "#7c3a2d", "--teal-deep": "#4a1f1a",
      "--terracotta": "#b3742a", "--terracotta-soft": "#e8b878", "--paper": "#fffaf3",
      "--muted": "#7a6a60", "--muted-soft": "#a2928a", "--hairline": "rgba(0,0,0,0.06)",
    },
  },
  lazur: {
    label: "Lazur (błękit + piasek)", labelEn: "Azure (blue + sand)",
    emoji: "🔵",
    vars: {
      "--sand": "#eaeef2", "--sand-deep": "#d3dce3", "--ink": "#16232c",
      "--teal": "#1a5a7a", "--teal-deep": "#0f3a52",
      "--terracotta": "#b57829", "--terracotta-soft": "#f0c078", "--paper": "#fdfdfd",
      "--muted": "#5e6e78", "--muted-soft": "#8a99a2", "--hairline": "rgba(0,0,0,0.06)",
    },
  },
  nocny: {
    label: "Nocny (ciemny)", labelEn: "Night (dark)",
    emoji: "🌙",
    dark: true,
    vars: {
      "--sand": "#141a18", "--sand-deep": "#242e2a", "--ink": "#e8ede9",
      "--teal": "#4a9d8e", "--teal-deep": "#7fc9ba",
      "--terracotta": "#d9a24e", "--terracotta-soft": "#8a6a3a", "--paper": "#1c2320",
      "--muted": "#9aa8a0", "--muted-soft": "#78857e", "--hairline": "rgba(255,255,255,0.08)",
    },
  },
};

// Czcionki arabskie (do dużego pisma na fiszkach i w tabelach).
const ARABIC_FONTS = {
  systemowa: { label: "Systemowa (jak wcześniej)", labelEn: "System (as before)", stack: "system-ui, 'Segoe UI', 'Geeza Pro', 'Noto Sans Arabic', sans-serif" },
  amiri: { label: "Amiri (klasyczny naskh)", stack: "'Amiri', 'Georgia', serif" },
  cairo: { label: "Cairo (nowoczesny)", stack: "'Cairo', system-ui, sans-serif" },
  noto: { label: "Noto Naskh (czysty)", stack: "'Noto Naskh Arabic', serif" },
  scheherazade: { label: "Scheherazade (dekoracyjny)", stack: "'Scheherazade New', serif" },
  tajawal: { label: "Tajawal (geometryczny)", stack: "'Tajawal', system-ui, sans-serif" },
};

// ---------- Wielojęzyczność (i18n) ----------
// Aplikacja wspiera polski i angielski. Kluczowa zasada: NIE zmieniamy pola `pl`
// w słówkach (bo wchodzi w wordId i zmiana zgubiłaby postęp). Zamiast tego słówka
// mają równoległe pole `en`, a aplikacja wybiera, które pokazać.
const LANG_KEY = "ar-eg-lang-v1";

const LANGS = [
  { key: "pl", label: "Polski", flag: "🇵🇱" },
  { key: "en", label: "English", flag: "🇬🇧" },
];

function loadLang() {
  try {
    const raw = localStorage.getItem(LANG_KEY);
    return raw === "en" ? "en" : "pl";
  } catch (e) {
    return "pl";
  }
}

function saveLang(l) {
  try {
    localStorage.setItem(LANG_KEY, l);
  } catch (e) {}
}

// Kontekst języka — każdy komponent pobiera aktualny język bez przekazywania propsów.
const LangContext = createContext("pl");
function useLang() {
  return useContext(LangContext);
}

// Przycisk odtwarzania wymowy. Pokazuje się aktywny tylko gdy audio istnieje
// (wg manifestu). Gdy audio brak — przycisk wyszarzony (audio "wkrótce").
function AudioButton({ word, size = 18, className = "" }) {
  const [ready, setReady] = useState(AUDIO_MANIFEST !== null);
  useEffect(() => { loadAudioManifest(() => setReady(true)); }, []);
  const available = ready && hasAudio(word);
  return (
    <button
      className={`audio-btn ${available ? "" : "audio-btn-empty"} ${className}`}
      onClick={(e) => { e.stopPropagation(); if (available) playWordAudio(word); }}
      aria-label="odtwórz wymowę"
      title={available ? "" : "audio wkrótce"}
      type="button"
    >
      <span style={{ fontSize: size }}>{available ? "🔊" : "🔈"}</span>
    </button>
  );
}

// Wyświetlane tłumaczenie słowa/zdania: angielskie jeśli wybrane i dostępne.
function useTr() {
  const lang = useLang();
  return (obj) => (lang === "en" && obj && obj.en ? obj.en : (obj && obj.pl) || "");
}

// Nazwa kategorii w wybranym języku.
function catLabel(c, lang) {
  if (!c) return "";
  return lang === "en" && c.labelEn ? c.labelEn : c.label;
}

// Teksty interfejsu.
// Słownik tłumaczeń interfejsu: polski tekst → angielski. Używany przez ui(pl).
const UI_DICT = {
  "transkrypcja": "transcription",
  "poprawna": "correct",
  "do poprawki": "needs fixing",
  "Szukaj: polski, transkrypcja lub arabski…": "Search: meaning, transcription or Arabic…",
  "polski (np. dom)": "meaning (e.g. house)",
  "arabski (np. بيت)": "Arabic (e.g. بيت)",
  "transkrypcja (np. beet)": "transcription (e.g. beet)",
  "arabski (np. ممكن الفاتورة؟)": "Arabic (e.g. ممكن الفاتورة؟)",

  "co poprawić?": "what to fix?",
  "Usuń oznaczenie": "Remove flag",
  "Usuń zatwierdzenie": "Remove verification",
  "tłumaczenie": "translation",
  "Od najstarszych (kolejność dodania)": "Oldest first (order added)",
  "Wyczyść": "Clear",
  "Oznacz jako poprawną": "Mark as correct",
  "polski (np. czy mogę prosić o rachunek?)": "Polish (e.g. can I have the bill?)",
  "Stuknij, aby cofnąć ostatnią literę": "Tap to undo the last letter",
  "Wygląd: kolory i czcionka": "Appearance: colors and font",
  "Ustawienia wyglądu": "Appearance settings",

  "dodaj fiszkę": "add card",
  "wyczyść wszystko": "clear all",
  "do powtórki": "to review",
  "losowe słówka jako błędne": "random words as distractors",
  "pokaż odpowiedź": "show answer",
  "wyczyść": "clear",
  "sprawdź": "check",
  "nowe słowa": "new words",
  "słówek": "words",

  "edytuj przykład": "edit example",
  "zdanie po arabsku": "sentence in Arabic",
  "transkrypcja zdania": "sentence transcription",
  "tłumaczenie zdania": "sentence translation",
  "Kliknij, by usunąć oznaczenie": "Click to remove the flag",
  "Kliknij, by usunąć zatwierdzenie": "Click to remove verification",
  "nieprzerobione": "untouched",

  "Odmiana podstawowych czasowników przez wszystkie osoby, w trzech czasach. Stuknij czasownik, aby zobaczyć pełną tabelę, i przełącz czas powyżej niej.": "Conjugation of basic verbs across all persons, in three tenses. Tap a verb to see the full table, and switch the tense above it.",
  "Schemat na przykładzie regularnego czasownika": "Pattern shown with a regular verb",
  "Wybierz czasownik modalny i czasownik bazowy — tabela pokaże, jak łączą się przez wszystkie osoby. Czasownik bazowy stoi w trybie łączącym (subjunctive), czyli bez przedrostka „بـ”.": "Pick a modal verb and a base verb — the table shows how they combine across all persons. The base verb is in the subjunctive, i.e. without the بـ prefix.",
  "Podstawowe rzeczowniki w trzech liczbach: pojedynczej, podwójnej (dual) i mnogiej, z oznaczeniem rodzaju. Stuknij rzeczownik, aby rozwinąć pełną tabelę.": "Basic nouns in three numbers: singular, dual, and plural, with gender marked. Tap a noun to expand the full table.",
  "W egipskim „mój / twój / jego…” to sufiks doklejany do rzeczownika, nie osobne słowo. Wybierz rzeczownik — tabela pokaże wszystkie osiem form.": "In Egyptian, \"my / your / his…\" is a suffix attached to the noun, not a separate word. Pick a noun — the table shows all eight forms.",
  "Zaimki pytające egipskiego arabskiego. Uwaga na szyk — zaimek często stoi na końcu zdania (np. „ismak eeh?” = „jak masz na imię?”). Każdy z przykładem użycia.": "Egyptian Arabic question words. Watch the word order — the question word often comes at the end (e.g. \"ismak eeh?\" = \"what's your name?\"). Each with a usage example.",
  "Zaimki wskazujące: ده (m.) / دي (f.) / دول (l.mn.). Zwykle stoją PO rzeczowniku z rodzajnikiem: „il-beet da” = „ten dom”.": "Demonstratives: ده (m.) / دي (f.) / دول (pl.). They usually come AFTER the definite noun: \"il-beet da\" = \"this house\".",
  "Liczebniki 1–10. Kluczowe reguły: „2” zastępuje dual (yomeen = 2 dni), a 3–10 stoją przed rzeczownikiem w liczbie MNOGIEJ, często w formie skróconej.": "Numbers 1–10. Key rules: \"2\" is replaced by the dual (yomeen = 2 days), and 3–10 come before a PLURAL noun, often in a shortened form.",
  "Przyimki łączą się z sufiksami zaimkowymi (ja/ty/on…). Stuknij przyimek, aby rozwinąć pełną odmianę. Formy są nieregularne — warto zapamiętać całościowo.": "Prepositions combine with pronoun suffixes (me/you/him…). Tap a preposition to expand the full set. The forms are irregular — best memorized as wholes.",
  "Liczebniki 11–100. Nastki (11–19) kończą się na „-taashar”. W dziesiątkach złożonych jedności stoją PRZED dziesiątką, spojone „wi” (khamsa wi 3eshriin = 25).": "Numbers 11–100. The teens (11–19) end in \"-taashar\". In compound tens, the units come BEFORE the ten, joined by \"wi\" (khamsa wi 3eshriin = 25).",
  "Stopniowanie: forma „af3al” działa jako wyższy (akbar min = większy niż) i — z rodzajnikiem — jako najwyższy (il-akbar = największy). Nie odmienia się przez rodzaj.": "Comparison: the \"af3al\" form works as the comparative (akbar min = bigger than) and — with the article — as the superlative (il-akbar = the biggest). It doesn't inflect for gender.",
  "Tryb rozkazujący: osobne formy dla mężczyzny, kobiety i liczby mnogiej. Zakaz tworzy klamra ma-…-sh na formie „ty” (ruuH → ma-truuH-sh = nie idź).": "The imperative: separate forms for a man, a woman, and the plural. Prohibition uses the ma-…-sh frame on the \"you\" form (ruuH → ma-truuH-sh = don't go).",
  "Coś nie gra — stuknij kafelek na pasku, żeby go zdjąć i poprawić.": "Something's off — tap a tile on the bar to remove it and fix it.",
  "Połącz polskie słowo z arabskim — stuknij jedno, potem drugie. Czas leci od pierwszego kliknięcia.": "Match the word with its Arabic — tap one, then the other. The timer starts from the first tap.",
  "Każda lekcja to dialog i zestaw ćwiczeń na jego słownictwie. Najpierw przeczytaj rozmowę, potem utrwal te same słowa na kilka sposobów.": "Each lesson is a dialogue plus a set of exercises on its vocabulary. First read the conversation, then reinforce the same words in several ways.",
  "Egipski (3aamiya) i arabski literacki (fuS7a / MSA) to dwie odmiany tego samego języka. Część słów jest identyczna, część pisze się tak samo, ale czyta inaczej, a część to zupełnie inne wyrazy. Poznanie różnic pomaga czytać i rozumieć oba.": "Egyptian (3aamiya) and Standard Arabic (fuS7a / MSA) are two varieties of the same language. Some words are identical, some are written the same but read differently, and some are entirely different. Knowing the differences helps you read and understand both.",
  "Te same słowa w obu odmianach — bezpieczne wszędzie.": "The same words in both varieties — safe everywhere.",
  "Pisownia arabska ta sama — różni się tylko wymowa. Świetne do nauki reguł ج/ق/ث/ذ.": "Same Arabic spelling — only the pronunciation differs. Great for learning the ج/ق/ث/ذ rules.",
  "Zupełnie różne wyrazy — jeśli powiesz wersję MSA, Egipcjanin zrozumie, ale zabrzmi to książkowo.": "Completely different words — if you say the MSA version, an Egyptian will understand, but it'll sound bookish.",
  "Słowa, które według harmonogramu zaczynasz zapominać. Powtórka teraz utrwala je najskuteczniej.": "Words you're starting to forget, according to the schedule. Reviewing now locks them in most effectively.",
  "Ułóż słowo po arabsku, stukając litery w dobrej kolejności. Pamiętaj: pismo arabskie czyta się": "Spell the word in Arabic by tapping the letters in the right order. Remember: Arabic script reads",
  "Każda lekcja to dialog i zestaw ćwiczeń na jego słownictwie.": "Each lesson is a dialogue and a set of exercises on its vocabulary.",
  "Dział dobrany automatycznie na podstawie treści — możesz go zmienić powyżej.": "Category chosen automatically from the content — you can change it above.",
  "To pole nie wygląda na zapisane pismem arabskim — sprawdź, czy nie wpisałeś transkrypcji w tym miejscu.": "This field doesn't look like it's written in Arabic script — check that you didn't enter transcription here.",

  "sprawdzone": "verified",
  "polski": "Polish",
  "dotknij, by odsłonić": "tap to reveal",
  "przykład z dialogu": "example from a dialogue",
  "liczba pytań:": "number of questions:",
  "kierunek:": "direction:",
  "przykład użycia": "usage example",
  "przykład użycia (opcjonalnie)": "usage example (optional)",
  "podgląd fiszki": "card preview",
  "Usunąć tę fiszkę na zawsze?": "Delete this card permanently?",
  "osoba": "person",
  "wzór": "pattern",
  "przykład": "example",
  "on / ja / oni": "he / I / they",
  "teraźn.": "present",
  "przeszły": "past",
  "przyszły": "future",
  "Czasowniki modalne + czasownik bazowy": "Modal verbs + base verb",
  "Czasownik modalny": "Modal verb",
  "Czasownik bazowy": "Base verb",
  "Zaimki dzierżawcze (sufiksy)": "Possessive pronouns (suffixes)",
  "Rzeczownik": "Noun",
  "Złóż frazę: liczba + rzeczownik": "Build a phrase: number + noun",
  "Liczba": "Number",
  "podstawowy": "base form",
  "wyższy": "comparative",
  "najwyższy": "superlative",
  "do niego": "to him",
  "do niej": "to her",
  "do wielu": "to them",
  "zakaz": "prohibition",
  "ułóż po egipsku": "arrange in Egyptian",
  "stukaj kafelki poniżej…": "tap the tiles below…",
  "zdania:": "sentences:",
  "uzupełnij lukę": "fill the gap",
  "najdłuższa seria": "longest streak",
  "dni nauki": "study days",
  "odpowiedzi": "answers",
  "Ostatnie 14 dni": "Last 14 days",
  "Quiz wg poziomu trudności": "Quiz by difficulty level",
  "Rozwiąż quiz, aby zobaczyć wyniki wg poziomu.": "Take a quiz to see results by level.",
  "Przerobione fiszki": "Cards reviewed",
  "Postęp w kategoriach": "Progress by category",
  "Kopia zapasowa": "Backup",
  "od prawej do lewej": "right to left",
  "tu pojawi się słowo…": "the word will appear here…",
  "Niezupełnie. Poprawnie:": "Not quite. Correct answer:",
  "Ćwiczenia na tym słownictwie": "Exercises on this vocabulary",
  "Dialog": "Dialogue",
  "ułóż zdanie (od lewej: pierwsze słowo zdania)…": "arrange the sentence (leftmost = first word)…",
  "Poprawna kolejność powyżej.": "Correct order above.",
  "pokaż": "show",
  "Pytania na rozumienie": "Comprehension questions",
  "Główne reguły wymowy:": "Key pronunciation rules:",
  "egipski": "Egyptian",
  "Cel na dziś": "Today's goal",
  "zmień cel:": "change goal:",
  "Jeszcze nieruszone — do pierwszego poznania.": "Untouched so far — ready to learn.",
  "opanowane": "mastered",
  "w nauce": "learning",
  "nowe": "new",
  "słownictwo egipskiego arabskiego": "Egyptian Arabic vocabulary",
  "przerobiony materiał": "material covered",
  "Kopia postępu": "Progress backup",
  "przykład użycia (z dialogu lub czytanki)": "usage example (from a dialogue or reading)",
  "Wybierz kategorię": "Choose a category",
  "dotknij ołówka, aby edytować": "tap the pencil to edit",
  "zapisz": "save",
  "anuluj": "cancel",
  "usuń": "delete",
  "dodaj przykład": "add example",
  "edytuj": "edit",
  "Edytuj fiszkę": "Edit card",
  "Nowa fiszka": "New card",
  "Znaczenie (po polsku)": "Meaning",
  "Słowo po arabsku": "Word in Arabic",
  "Wymowa (transkrypcja)": "Pronunciation (transcription)",
  "Kategoria": "Category",
  "wszystkie czytanki": "all readings",
  "wszystkie dialogi": "all dialogues",
  "pokaż tłumaczenie": "show translation",
  "ukryj tłumaczenie": "hide translation",
  "pokaż transkrypcję": "show transcription",
  "ukryj transkrypcję": "hide transcription",
};

// Zwraca tekst interfejsu w aktualnym języku. Hook: const ui = useUi();
function useUi() {
  const lang = useLang();
  return (plText) => (lang === "en" ? (UI_DICT[plText] || plText) : plText);
}

const UI = {
  appSubtitle: { pl: "słownictwo egipskiego arabskiego", en: "Egyptian Arabic vocabulary" },
  settings: { pl: "Ustawienia", en: "Settings" },
  language: { pl: "Język", en: "Language" },
  colors: { pl: "Kolory", en: "Colors" },
  arabicFont: { pl: "Czcionka arabska", en: "Arabic font" },
  goalToday: { pl: "Cel na dziś", en: "Today's goal" },
  goalMet: { pl: "🎉 Cel osiągnięty! Możesz ćwiczyć dalej.", en: "🎉 Goal reached! Keep going if you like." },
  goalLeft: { pl: "Jeszcze {n} do celu.", en: "{n} more to reach your goal." },
  goalChange: { pl: "zmień cel:", en: "change goal:" },
  streakDay: { pl: "dzień z rzędu", en: "day streak" },
  streakDays: { pl: "dni z rzędu", en: "day streak" },
  dueToday: { pl: "🔁 Do powtórki dziś", en: "🔁 Due for review" },
  dueDesc: {
    pl: "Słowa, które według harmonogramu zaczynasz zapominać. Powtórka teraz utrwala je najskuteczniej.",
    en: "Words you're about to forget, according to the schedule. Reviewing now locks them in.",
  },
  dueTooFew: { pl: "za mało do powtórki (min. 4)", en: "not enough to review (min. 4)" },
  newWordsTitle: { pl: "✨ Nowe słowa", en: "✨ New words" },
  newDesc: { pl: "Jeszcze nieruszone — do pierwszego poznania.", en: "Untouched so far — ready to learn." },
  newStart: { pl: "ucz się nowych →", en: "learn new words →" },
  masteredLbl: { pl: "opanowane", en: "mastered" },
  learningLbl: { pl: "w nauce", en: "learning" },
  freshLbl: { pl: "nowe", en: "new" },
  howInEgyptian: { pl: "jak po egipsku?", en: "how do you say it?" },
  usageExample: { pl: "przykład użycia", en: "usage example" },
  next: { pl: "następne słowo", en: "next word" },
  allReadings: { pl: "← wszystkie czytanki", en: "← all readings" },
};

// Skrót: t(UI.klucz, lang, {n: 5}) → tekst z podstawieniem {n}.
function t(entry, lang, vars) {
  let s = (entry && (lang === "en" ? entry.en : entry.pl)) || (entry && entry.pl) || "";
  if (vars) {
    for (const [k, v] of Object.entries(vars)) s = s.replace("{" + k + "}", v);
  }
  return s;
}

const APPEARANCE_KEY = "ar-eg-appearance-v1";

function loadAppearance() {
  try {
    const raw = localStorage.getItem(APPEARANCE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return { theme: "morski", font: "noto" }; // rekomendacja domyślna
}

function saveAppearance(a) {
  try {
    localStorage.setItem(APPEARANCE_KEY, JSON.stringify(a));
  } catch (e) {}
}

// Ładuje czcionki arabskie z Google Fonts (raz, do <head>).
function ensureFontsLoaded() {
  if (typeof document === "undefined") return;
  if (document.getElementById("ar-eg-fonts")) return;
  const pre1 = document.createElement("link");
  pre1.rel = "preconnect"; pre1.href = "https://fonts.googleapis.com";
  document.head.appendChild(pre1);
  const pre2 = document.createElement("link");
  pre2.rel = "preconnect"; pre2.href = "https://fonts.gstatic.com"; pre2.crossOrigin = "anonymous";
  document.head.appendChild(pre2);
  const link = document.createElement("link");
  link.id = "ar-eg-fonts";
  link.rel = "stylesheet";
  link.href =
    "https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&family=Cairo:wght@400;600;700&family=Tajawal:wght@400;500;700&family=Noto+Naskh+Arabic:wght@400;700&family=Scheherazade+New:wght@400;700&display=swap";
  document.head.appendChild(link);
}

// Buduje CSS nadpisujący zmienne motywu i rodzinę czcionki arabskiej.
function appearanceCSS(appearance) {
  const theme = THEMES[appearance.theme] || THEMES.morski;
  const font = ARABIC_FONTS[appearance.font] || ARABIC_FONTS.amiri;
  const vars = Object.entries(theme.vars).map(([k, v]) => `  ${k}: ${v};`).join("\n");
  // W motywie ciemnym przyciski na kolorze --teal potrzebują ciemnego tekstu
  // (bo --teal jest jasny), a domyślne cienie/obramowania są subtelniejsze.
  const darkExtra = theme.dark
    ? `\n.nav-btn-primary, .tab-active, .primary-btn { color: #0f1512 !important; }\n.settings-btn, .app-header { border-color: var(--hairline); }`
    : "";
  return `:root {\n${vars}\n  --ar-font: ${font.stack};\n}${darkExtra}`;
}

// ---------- App ----------
// ---------- Kurs koraniczny: podstawowe formuły (minimalny, nierozbudowywany) ----------
// ---------- Koran od podstaw: cytaty z rozbiorem 3-rejestrowym ----------
// Krótkie znane wersety, słowo po słowie w trzech rejestrach:
// klasyczny (koraniczny) / MSA (standardowy) / egipski (dialekt).
const QURAN_VERSES = [
  {
    id: "fatiha1",
    ref: { pl: "Al-Fatiha 1:1", en: "Al-Fatiha 1:1" },
    ar: "بِسْمِ اللَّهِ الرَّحْمٰنِ الرَّحيمِ",
    ph: "bismi llāhi r-raḥmāni r-raḥīm",
    pl: "W imię Boga Miłosiernego, Litościwego",
    en: "In the name of God, the Most Gracious, the Most Merciful",
    words: [
      { cl: "بِسْمِ", clPh: "bismi", msa: "باسم", msaPh: "bi-ism", eg: "بسم", egPh: "besm", pl: "w imię", en: "in the name of", note: { pl: "„bi” (w) + „ism” (imię). W codziennym egipskim „besm-illah” mówi się przed jedzeniem czy pracą.", en: "'bi' (in) + 'ism' (name). In everyday Egyptian 'besm-illah' is said before eating or working." } },
      { cl: "اللَّهِ", clPh: "llāhi", msa: "الله", msaPh: "allāh", eg: "الله", egPh: "allah", pl: "Boga", en: "of God", note: { pl: "To samo słowo we wszystkich rejestrach. Końcówka -i to dopełniacz (klasyczny i'rāb).", en: "The same word in all registers. The -i ending is the genitive (classical i'rāb)." } },
      { cl: "الرَّحْمٰنِ", clPh: "r-raḥmāni", msa: "الرحمن", msaPh: "ar-raḥmān", eg: "الرحمن", egPh: "er-raḥman", pl: "Miłosiernego", en: "the Most Gracious", note: { pl: "Rdzeń ر-ح-م (miłosierdzie). Pokrewne „raḥma” (litość) i imię „Abdel-Rahman”.", en: "Root ر-ح-م (mercy). Related to 'raḥma' (compassion) and the name 'Abdel-Rahman'." } },
      { cl: "الرَّحيمِ", clPh: "r-raḥīm", msa: "الرحيم", msaPh: "ar-raḥīm", eg: "الرحيم", egPh: "er-raḥīm", pl: "Litościwego", en: "the Most Merciful", note: { pl: "Ten sam rdzeń ر-ح-م, inny wzór (fa'īl). „raḥmān” i „raḥīm” to dwa aspekty miłosierdzia.", en: "Same root ر-ح-م, different pattern (fa'īl). 'raḥmān' and 'raḥīm' are two aspects of mercy." } },
    ],
  },
  {
    id: "fatiha2", ref: {pl:"Al-Fatiha 1:2",en:"Al-Fatiha 1:2"},
    ar: "الْحَمْدُ لِلَّهِ رَبِّ الْعالَمينَ", ph: "al-ḥamdu li-llāhi rabbi l-ʿālamīn",
    pl: "Chwała Bogu, Panu światów", en: "Praise be to God, Lord of the worlds",
    fullMsa: {ar:"الحمد لله رب العالمين", ph:"al-ḥamdu li-llāhi rabbi l-ʿālamīn", note:{pl:"Identyczne w MSA — to zdanie jest klasyczne i standardowe zarazem.",en:"Identical in MSA — this phrase is both classical and standard."}},
    fullEg: {ar:"الحمد لله", ph:"el-ḥamdu li-llāh", note:{pl:"W egipskim „el-ḥamdu li-llāh” to codzienne „dzięki Bogu” (wszystko OK).",en:"In Egyptian 'el-ḥamdu li-llāh' is the everyday 'thank God' (all's well)."}},
    words: [
      {cl:"الْحَمْدُ",clPh:"al-ḥamdu",msa:"الحمد",msaPh:"al-ḥamd",eg:"الحمد",egPh:"el-ḥamd",pl:"chwała",en:"praise",note:{pl:"Rdzeń ح-م-د. Stąd imię Muḥammad („godny chwały”).",en:"Root ح-م-d. Hence the name Muḥammad ('praiseworthy')."}},
      {cl:"لِلَّهِ",clPh:"li-llāhi",msa:"لله",msaPh:"li-llāh",eg:"لله",egPh:"li-llāh",pl:"Bogu",en:"to God",note:{pl:"„li” (dla) + „llāh”. Zlanie w piśmie.",en:"'li' (for) + 'llāh'. Merged in writing."}},
      {cl:"رَبِّ",clPh:"rabbi",msa:"رب",msaPh:"rabb",eg:"رب",egPh:"rabb",pl:"Panu",en:"Lord",note:{pl:"„rabb” (pan, władca). W egipskim „ya rabb!” = o Boże!",en:"'rabb' (lord, master). In Egyptian 'ya rabb!' = oh God!"}},
      {cl:"الْعالَمينَ",clPh:"l-ʿālamīn",msa:"العالمين",msaPh:"al-ʿālamīn",eg:"العالمين",egPh:"el-ʿalamīn",pl:"światów",en:"of the worlds",note:{pl:"Rdzeń ع-ل-م (wiedza, świat). Pokrewne „ʿālam” (świat) i „ʿilm” (nauka).",en:"Root ع-ل-م (knowledge, world). Related to 'ʿālam' (world) and 'ʿilm' (science)."}},
    ],
  },
  {
    id: "fatiha3", ref: {pl:"Al-Fatiha 1:3",en:"Al-Fatiha 1:3"},
    ar: "الرَّحْمٰنِ الرَّحيمِ", ph: "ar-raḥmāni r-raḥīm",
    pl: "Miłosiernego, Litościwego", en: "the Most Gracious, the Most Merciful",
    words: [
      {cl:"الرَّحْمٰنِ",clPh:"ar-raḥmāni",msa:"الرحمن",msaPh:"ar-raḥmān",eg:"الرحمن",egPh:"er-raḥman",pl:"Miłosiernego",en:"the Most Gracious",note:{pl:"Rdzeń ر-ح-م. Ten sam co w wersecie 1.",en:"Root ر-ح-م. Same as in verse 1."}},
      {cl:"الرَّحيمِ",clPh:"r-raḥīm",msa:"الرحيم",msaPh:"ar-raḥīm",eg:"الرحيم",egPh:"er-raḥīm",pl:"Litościwego",en:"the Most Merciful",note:{pl:"Ten sam rdzeń, wzór faʿīl. Powtórzenie z wersetu 1 — podkreśla miłosierdzie.",en:"Same root, faʿīl pattern. Repeated from verse 1 — emphasizes mercy."}},
    ],
  },
  {
    id: "fatiha4", ref: {pl:"Al-Fatiha 1:4",en:"Al-Fatiha 1:4"},
    ar: "مالِكِ يَوْمِ الدّينِ", ph: "māliki yawmi d-dīn",
    pl: "Władcy Dnia Sądu", en: "Master of the Day of Judgment",
    fullEg: {ar:"صاحب يوم الدين", ph:"ṣāḥib yōm ed-dīn", note:{pl:"Egipski wolałby „ṣāḥib” (właściciel) niż klasyczne „mālik”.",en:"Egyptian would prefer 'ṣāḥib' (owner) over classical 'mālik'."}},
    words: [
      {cl:"مالِكِ",clPh:"māliki",msa:"مالك",msaPh:"mālik",eg:"مالك",egPh:"mālik",pl:"Władcy",en:"Master of",note:{pl:"Rdzeń م-ل-ك (posiadać, panować). Pokrewne „malik” (król) i „mulk” (władza).",en:"Root م-ل-ك (to own, to rule). Related to 'malik' (king) and 'mulk' (dominion)."}},
      {cl:"يَوْمِ",clPh:"yawmi",msa:"يوم",msaPh:"yawm",eg:"يوم",egPh:"yōm",pl:"Dnia",en:"of the Day",note:{pl:"„yawm” (dzień). W egipskim „yōm” — codzienne słowo. Iḍāfa: „dzień sądu”.",en:"'yawm' (day). In Egyptian 'yōm' — an everyday word. Iḍāfa: 'day of judgment'."}},
      {cl:"الدّينِ",clPh:"d-dīn",msa:"الدين",msaPh:"ad-dīn",eg:"الدين",egPh:"ed-dīn",pl:"Sądu",en:"of Judgment",note:{pl:"„dīn” = religia/sąd. „yawm ad-dīn” = Dzień Sądu Ostatecznego.",en:"'dīn' = religion/judgment. 'yawm ad-dīn' = the Day of Final Judgment."}},
    ],
  },
  {
    id: "fatiha5", ref: {pl:"Al-Fatiha 1:5",en:"Al-Fatiha 1:5"},
    ar: "إِيّاكَ نَعْبُدُ وَإِيّاكَ نَسْتَعينُ", ph: "iyyāka naʿbudu wa-iyyāka nastaʿīn",
    pl: "Ciebie czcimy i Ciebie prosimy o pomoc", en: "You alone we worship, and You alone we ask for help",
    fullEg: {ar:"إحنا بنعبدك وبنطلب منك العون", ph:"eḥna binʿbudak we-binṭlub mennak el-ʿōn", note:{pl:"Egipski użyłby zwykłego szyku podmiot-czasownik i zaimków doczepionych.",en:"Egyptian would use plain subject-verb order and attached pronouns."}},
    words: [
      {cl:"إِيّاكَ",clPh:"iyyāka",msa:"إياك",msaPh:"iyyāka",eg:"إياك",egPh:"iyyāk",pl:"Ciebie",en:"You (alone)",note:{pl:"Zaimek wyodrębniony w bierniku — podkreśla „tylko Ciebie”. W egipskim rzadki, książkowy.",en:"Isolated accusative pronoun — emphasizes 'You alone'. Rare/bookish in Egyptian."}},
      {cl:"نَعْبُدُ",clPh:"naʿbudu",msa:"نعبد",msaPh:"naʿbud",eg:"نعبد",egPh:"neʿbud",pl:"czcimy",en:"we worship",note:{pl:"Rdzeń ع-ب-د (służyć, czcić). Pokrewne „ʿabd” (sługa) i imię „Abdullah” (sługa Boga).",en:"Root ع-ب-د (to serve, worship). Related to 'ʿabd' (servant) and 'Abdullah' (servant of God)."}},
      {cl:"وَإِيّاكَ",clPh:"wa-iyyāka",msa:"وإياك",msaPh:"wa-iyyāka",eg:"وإياك",egPh:"we-iyyāk",pl:"i Ciebie",en:"and You (alone)",note:{pl:"„wa” (i) + powtórzone „iyyāka”. Powtórzenie dla emfazy.",en:"'wa' (and) + repeated 'iyyāka'. Repetition for emphasis."}},
      {cl:"نَسْتَعينُ",clPh:"nastaʿīn",msa:"نستعين",msaPh:"nastaʿīn",eg:"نستعين",egPh:"nesteʿīn",pl:"prosimy o pomoc",en:"we ask for help",note:{pl:"Rdzeń ع-و-ن (pomoc). X wzór (istaf'ala). Pokrewne „ʿōn” (pomoc) i „muʿāwana”.",en:"Root ع-و-ن (help). Form X (istaf'ala). Related to 'ʿōn' (aid) and 'muʿāwana'."}},
    ],
  },
  {
    id: "fatiha6", ref: {pl:"Al-Fatiha 1:6",en:"Al-Fatiha 1:6"},
    ar: "اهْدِنَا الصِّراطَ الْمُسْتَقيمَ", ph: "ihdinā ṣ-ṣirāṭa l-mustaqīm",
    pl: "Prowadź nas drogą prostą", en: "Guide us to the straight path",
    words: [
      {cl:"اهْدِنَا",clPh:"ihdinā",msa:"اهدنا",msaPh:"ihdinā",eg:"اهدينا",egPh:"ehdīna",pl:"prowadź nas",en:"guide us",note:{pl:"Rozkaźnik od rdzenia ه-د-ي (prowadzić) + „nā” (nas). Pokrewne „hudā” (przewodnictwo).",en:"Imperative of root ه-د-ي (to guide) + 'nā' (us). Related to 'hudā' (guidance)."}},
      {cl:"الصِّراطَ",clPh:"ṣ-ṣirāṭa",msa:"الصراط",msaPh:"aṣ-ṣirāṭ",eg:"الصراط",egPh:"eṣ-ṣirāṭ",pl:"drogą",en:"the path",note:{pl:"„ṣirāṭ” (droga, ścieżka) — słowo koraniczne. W egipskim raczej „ṭarī'” lub „sekka”.",en:"'ṣirāṭ' (path) — a Quranic word. In Egyptian rather 'ṭarī'' or 'sekka'."}},
      {cl:"الْمُسْتَقيمَ",clPh:"l-mustaqīm",msa:"المستقيم",msaPh:"al-mustaqīm",eg:"المستقيم",egPh:"el-mostaʔīm",pl:"prostą",en:"the straight",note:{pl:"Rdzeń ق-و-م (stać, wstać). X wzór. Pokrewne „qāma” (wstał), „istaqāma” (być prostym).",en:"Root ق-و-م (to stand). Form X. Related to 'qāma' (stood), 'istaqāma' (to be straight)."}},
    ],
  },
  {
    id: "fatiha7", ref: {pl:"Al-Fatiha 1:7",en:"Al-Fatiha 1:7"},
    ar: "صِراطَ الَّذينَ أَنْعَمْتَ عَلَيْهِمْ", ph: "ṣirāṭa lladhīna anʿamta ʿalayhim",
    pl: "drogą tych, których obdarzyłeś łaską", en: "the path of those You have blessed",
    note: {pl:"To dłuższy werset — pokazujemy jego pierwszą część. Pełny werset kończy się „...nie tych, na których gniew, ani błądzących”.",en:"This is a longer verse — we show its first part. The full verse ends '...not those who earned anger, nor those who went astray'."},
    words: [
      {cl:"صِراطَ",clPh:"ṣirāṭa",msa:"صراط",msaPh:"ṣirāṭ",eg:"صراط",egPh:"ṣirāṭ",pl:"drogą",en:"the path of",note:{pl:"To samo „ṣirāṭ” co w wersecie 6, tu w iḍāfie (droga tych, którzy...).",en:"Same 'ṣirāṭ' as verse 6, here in iḍāfa (path of those who...)."}},
      {cl:"الَّذينَ",clPh:"lladhīna",msa:"الذين",msaPh:"alladhīna",eg:"اللي",egPh:"elli",pl:"tych, których",en:"those whom",note:{pl:"Zaimek względny (l.mn.). W egipskim wszystkie formy upraszczają się do jednego „elli”!",en:"Relative pronoun (plural). In Egyptian all forms collapse to a single 'elli'!"}},
      {cl:"أَنْعَمْتَ",clPh:"anʿamta",msa:"أنعمت",msaPh:"anʿamta",eg:"أنعمت",egPh:"anʿamt",pl:"obdarzyłeś łaską",en:"You have blessed",note:{pl:"Rdzeń ن-ع-م (łaska, dobrodziejstwo). Pokrewne „niʿma” (błogosławieństwo) i „naʿam” (tak).",en:"Root ن-ع-م (grace, blessing). Related to 'niʿma' (blessing) and 'naʿam' (yes)."}},
      {cl:"عَلَيْهِمْ",clPh:"ʿalayhim",msa:"عليهم",msaPh:"ʿalayhim",eg:"عليهم",egPh:"ʿalēhom",pl:"ich",en:"upon them",note:{pl:"„ʿalā” (na) + „him” (nich). W egipskim „ʿalēhom”. Bardzo częsty przyimek.",en:"'ʿalā' (upon) + 'him' (them). In Egyptian 'ʿalēhom'. A very common preposition."}},
    ],
  },
  {
    id: "ikhlas1",
    ref: { pl: "Al-Ichlas 112:1", en: "Al-Ikhlas 112:1" },
    ar: "قُلْ هُوَ اللَّهُ أَحَدٌ",
    ph: "qul huwa llāhu aḥad",
    pl: "Powiedz: On, Bóg, jest Jeden",
    en: "Say: He is God, the One",
    words: [
      { cl: "قُلْ", clPh: "qul", msa: "قل", msaPh: "qul", eg: "قول", egPh: "'ūl", pl: "powiedz", en: "say", note: { pl: "Rozkaźnik od rdzenia ق-و-ل (mówić). W egipskim „'ūl” (z hamzą zamiast qāf) — to samo słowo!", en: "Imperative of root ق-و-ل (to say). In Egyptian ''ūl' (hamza instead of qāf) — the same word!" } },
      { cl: "هُوَ", clPh: "huwa", msa: "هو", msaPh: "huwa", eg: "هو", egPh: "huwwa", pl: "on", en: "he", note: { pl: "Zaimek „on”. Klasyczny/MSA „huwa”, egipski „huwwa” (podwojone w). Prawie identyczne.", en: "Pronoun 'he'. Classical/MSA 'huwa', Egyptian 'huwwa' (doubled w). Almost identical." } },
      { cl: "اللَّهُ", clPh: "llāhu", msa: "الله", msaPh: "allāh", eg: "الله", egPh: "allah", pl: "Bóg", en: "God", note: { pl: "Końcówka -u to mianownik (podmiot). W egipskim końcówki przypadków znikają.", en: "The -u ending is the nominative (subject). In Egyptian case endings disappear." } },
      { cl: "أَحَدٌ", clPh: "aḥad", msa: "أحد", msaPh: "aḥad", eg: "واحد", egPh: "wāḥid", pl: "jeden", en: "one", note: { pl: "„aḥad” (jeden, jedyny) — klasyczne. W codziennym egipskim liczbę „jeden” mówi się „wāḥid” (rdzeń و-ح-د).", en: "'aḥad' (one, unique) — classical. In everyday Egyptian 'one' is 'wāḥid' (root و-ح-د)." } },
    ],
  },
];

// ---------- Trzon 3: kwestie religijne (praktyka i kultura) ----------
const RELIGIOUS = [
  {
    group: { pl: "Pięć modlitw dziennych", en: "The five daily prayers" },
    items: [
      { ar: "الفَجْر", ph: "al-fajr", pl: "modlitwa o świcie", en: "dawn prayer", note: { pl: "Pierwsza modlitwa, przed wschodem słońca. „fajr” = świt.", en: "The first prayer, before sunrise. 'fajr' = dawn." } },
      { ar: "الظُّهْر", ph: "aẓ-ẓuhr", pl: "modlitwa południowa", en: "noon prayer", note: { pl: "Po przejściu słońca przez zenit. „ẓuhr” = południe.", en: "After the sun passes its zenith. 'ẓuhr' = noon." } },
      { ar: "العَصْر", ph: "al-ʿaṣr", pl: "modlitwa popołudniowa", en: "afternoon prayer", note: { pl: "Późne popołudnie. „ʿaṣr” = popołudnie, też „epoka”.", en: "Late afternoon. 'ʿaṣr' = afternoon, also 'era'." } },
      { ar: "المَغْرِب", ph: "al-maghrib", pl: "modlitwa o zachodzie", en: "sunset prayer", note: { pl: "Tuż po zachodzie słońca. „maghrib” = zachód (i nazwa Maroka!).", en: "Just after sunset. 'maghrib' = west/sunset (and the name of Morocco!)." } },
      { ar: "العِشاء", ph: "al-ʿishā'", pl: "modlitwa nocna", en: "night prayer", note: { pl: "Po zapadnięciu nocy. „ʿishā'” = wieczór, noc.", en: "After nightfall. 'ʿishā'' = evening, night." } },
    ],
  },
  {
    group: { pl: "Ramadan i post", en: "Ramadan and fasting" },
    items: [
      { ar: "رَمَضان", ph: "ramaḍān", pl: "Ramadan (miesiąc postu)", en: "Ramadan (month of fasting)", note: { pl: "Dziewiąty miesiąc kalendarza księżycowego, miesiąc postu od świtu do zachodu.", en: "The ninth month of the lunar calendar, a month of fasting from dawn to sunset." } },
      { ar: "صَوْم / صِيام", ph: "ṣawm / ṣiyām", pl: "post", en: "fasting", note: { pl: "Powstrzymanie się od jedzenia, picia od świtu do zachodu. Rdzeń ص-و-م.", en: "Abstaining from food and drink from dawn to sunset. Root ص-و-م." } },
      { ar: "إِفْطار", ph: "ifṭār", pl: "posiłek przerywający post (o zachodzie)", en: "meal breaking the fast (at sunset)", note: { pl: "Wieczorny posiłek kończący dzienny post. Od rdzenia ف-ط-ر (przerwać post) — stąd też „fiṭār” (śniadanie).", en: "The evening meal ending the day's fast. From root ف-ط-ر (to break fast) — also 'fiṭār' (breakfast)." } },
      { ar: "سُحور", ph: "suḥūr", pl: "posiłek przed świtem", en: "pre-dawn meal", note: { pl: "Posiłek spożywany przed świtem, przed rozpoczęciem postu.", en: "The meal eaten before dawn, before the fast begins." } },
    ],
  },
  {
    group: { pl: "Święta i uroczystości", en: "Feasts and celebrations" },
    items: [
      { ar: "عيد", ph: "ʿīd", pl: "święto", en: "feast, holiday", note: { pl: "Ogólne słowo „święto”. Rdzeń ع-و-د (wracać) — święto, które co roku powraca.", en: "The general word for 'feast'. Root ع-و-د (to return) — a feast that returns each year." } },
      { ar: "عيد الفِطْر", ph: "ʿīd al-fiṭr", pl: "Święto Przerwania Postu", en: "Feast of Breaking the Fast", note: { pl: "Święto kończące ramadan. „fiṭr” od tego samego rdzenia co „ifṭār”.", en: "The feast ending Ramadan. 'fiṭr' from the same root as 'ifṭār'." } },
      { ar: "عيد الأَضْحى", ph: "ʿīd al-aḍḥā", pl: "Święto Ofiarowania", en: "Feast of Sacrifice", note: { pl: "Święto ofiary, w czasie pielgrzymki (hadżdż). „aḍḥā” od rdzenia ض-ح-ي (ofiara).", en: "The feast of sacrifice, during the pilgrimage (hajj). 'aḍḥā' from root ض-ح-ي (sacrifice)." } },
      { ar: "مُبارَك", ph: "mubārak", pl: "błogosławiony (życzenie: „ʿīd mubārak”)", en: "blessed (greeting: 'ʿīd mubārak')", note: { pl: "„ʿīd mubārak” = błogosławionego święta — standardowe życzenie. Rdzeń ب-ر-ك (błogosławieństwo).", en: "'ʿīd mubārak' = blessed feast — the standard greeting. Root ب-ر-ك (blessing)." } },
    ],
  },
];

const QURAN_BASICS = [
  {
    ar: "بِسْمِ اللَّه", ph: "bismi llāh", pl: "W imię Boga", en: "In the name of God",
    note: { pl: "Najczęstsza formuła, rozpoczyna niemal każde działanie. „bi” (w) + „ism” (imię) + „Allāh” (Bóg) — to iḍāfa: „imię Boga”.", en: "The most common formula, begins almost every action. 'bi' (in) + 'ism' (name) + 'Allāh' (God) — an iḍāfa: 'the name of God'." },
    root: { ar: "س-م-و", tr: "s-m-w", link: "ism (imię) — ten sam rdzeń co „ismuka?” (jak masz na imię?) w egipskim" },
  },
  {
    ar: "الْحَمْدُ لِلَّه", ph: "al-ḥamdu li-llāh", pl: "Chwała Bogu", en: "Praise be to God",
    note: { pl: "Wyraża wdzięczność — używane też potocznie („el-ḥamdu li-llāh” = dzięki Bogu, wszystko dobrze). „ḥamd” (chwała) + „li” (dla) + „llāh”.", en: "Expresses gratitude — also used colloquially ('el-ḥamdu li-llāh' = thank God, all's well). 'ḥamd' (praise) + 'li' (for) + 'llāh'." },
    root: { ar: "ح-م-د", tr: "ḥ-m-d", link: "ḥamd (chwała) — stąd imię Muḥammad („godny chwały”)" },
  },
  {
    ar: "إِنْ شاءَ اللَّه", ph: "in shā'a llāh", pl: "Jeśli Bóg zechce", en: "God willing",
    note: { pl: "Mówione przy planach na przyszłość. Bardzo częste też w egipskim („inshallah”). „in” (jeśli) + „shā'a” (zechciał) + „llāh”.", en: "Said about future plans. Very common in Egyptian too ('inshallah'). 'in' (if) + 'shā'a' (willed) + 'llāh'." },
    root: { ar: "ش-ي-أ", tr: "sh-y-2", link: "shā'a (chcieć) — pokrewne „shay'” (rzecz), którą znasz z alfabetu" },
  },
  {
    ar: "اللَّهُ أَكْبَر", ph: "allāhu akbar", pl: "Bóg jest największy", en: "God is greatest",
    note: { pl: "„akbar” to stopień najwyższy od „kabīr” (duży) — który znasz z egipskiego! „Allāh” + „akbar” (największy).", en: "'akbar' is the superlative of 'kabīr' (big) — which you know from Egyptian! 'Allāh' + 'akbar' (greatest)." },
    root: { ar: "ك-ب-ر", tr: "k-b-r", link: "kabīr (duży) → akbar (największy) — ten sam rdzeń co codzienne „kbeer”" },
  },,
  {
    ar: "ما شاءَ اللَّه", ph: "mā shā' allāh", pl: "Jak Bóg zechciał (wyraz zachwytu)", en: "What God has willed (expression of admiration)",
    note: { pl: "Mówione na widok czegoś pięknego/udanego — dziecka, sukcesu — by okazać podziw bez „złego oka”. Bardzo częste w egipskim („mashallah”).", en: "Said when seeing something beautiful/successful — a child, an achievement — to express admiration without the 'evil eye'. Very common in Egyptian ('mashallah')." },
    root: { ar: "ش-ي-أ", tr: "sh-y-2", link: "shā' (zechciał) — ten sam rdzeń co „inshallah”" },
  },
  {
    ar: "إِنْ شاءَ اللَّه", ph: "in shā' allāh", pl: "Jeśli Bóg zechce", en: "God willing",
    note: { pl: "Dodawane do każdego planu na przyszłość. W egipskim „inshallah” bywa też uprzejmym „może/zobaczymy”.", en: "Added to any future plan. In Egyptian 'inshallah' can also be a polite 'maybe/we'll see'." },
    root: { ar: "ش-ي-أ", tr: "sh-y-2", link: "shā' (chcieć) — pokrewne „shay'” (rzecz)" },
  },
  {
    ar: "وَاللَّه", ph: "wallāh(i)", pl: "Na Boga (przysięgam)", en: "By God (I swear)",
    note: { pl: "Wzmacnia szczerość — „naprawdę, przysięgam”. W codziennym egipskim „wallāhi” to po prostu „serio”, często bez wagi przysięgi.", en: "Strengthens sincerity — 'really, I swear'. In everyday Egyptian 'wallāhi' just means 'seriously', often without the weight of an oath." },
    root: { ar: "أ-ل-ه", tr: "2-l-h", link: "„wa” (na, przez) + „llāh” — forma przysięgi" },
  },
  {
    ar: "الله يِبارِك فيك", ph: "allāh yibārik fīk", pl: "Niech Bóg cię błogosławi", en: "May God bless you",
    note: { pl: "Odpowiedź na komplement lub podziękowanie. „Baraka” (błogosławieństwo) to też „obfitość”. Bardzo egipskie.", en: "A reply to a compliment or thanks. 'Baraka' (blessing) also means 'abundance'. Very Egyptian." },
    root: { ar: "ب-ر-ك", tr: "b-r-k", link: "baraka (błogosławieństwo) — stąd imię „Mubarak” (błogosławiony)" },
  },
  {
    ar: "بِإِذْنِ اللَّه", ph: "bi-idhni llāh", pl: "Za pozwoleniem Boga", en: "By God's leave",
    note: { pl: "Podobne do „inshallah”, ale bardziej formalne. Wyraża, że coś stanie się o ile Bóg pozwoli.", en: "Similar to 'inshallah' but more formal. Expresses that something will happen if God permits." },
    root: { ar: "أ-ذ-ن", tr: "2-dh-n", link: "idhn (pozwolenie) — pokrewne „ādhān” (wezwanie na modlitwę)" },
  },
  {
    ar: "اللَّهُمَّ", ph: "allāhumma", pl: "O Boże! (wołacz)", en: "O God! (vocative)",
    note: { pl: "Forma wołacza „o Boże” rozpoczynająca modlitwę lub prośbę. Częste w zwrotach typu „allāhumma bārik” (Boże, pobłogosław).", en: "The vocative 'O God' that begins a prayer or plea. Common in phrases like 'allāhumma bārik' (O God, bless)." },
    root: { ar: "أ-ل-ه", tr: "2-l-h", link: "„Allāh” + końcówka wołacza -umma" },
  }
];

// ---------- Definicja kursów i przypisania zakładek ----------
// Każdy kurs to osobna ścieżka nauki. Zakładki ułożone od najprostszej do trudniejszej,
// żeby ktoś zaczynający od zera wiedział, w jakiej kolejności iść.
const COURSES = {
  egyptian: {
    id: "egyptian",
    icon: "ع",
    title: { pl: "Egipski (dialekt)", en: "Egyptian (dialect)" },
    subtitle: { pl: "Język mówiony — codzienne rozmowy w Egipcie", en: "The spoken language — everyday conversation in Egypt" },
    desc: { pl: "Praktyczne słownictwo i zwroty do mówienia. Fiszki, quizy, dialogi i czytanki.", en: "Practical vocabulary and phrases for speaking. Flashcards, quizzes, dialogues and readings." },
    color: "#2e7d52",
    start: { pl: "Zacznij od „na dziś” lub fiszek — poznaj podstawowe słowa. Potem quiz i dialogi.", en: "Start with 'today' or flashcards — learn basic words. Then quiz and dialogues." },
    tabs: ["egpath", "today", "flash", "quiz", "match", "gaps", "write", "verbs", "nouns", "questions", "grammar", "sentences", "dialogues", "readings", "lessons", "stats", "list"],
  },
  msa: {
    id: "msa",
    icon: "ف",
    title: { pl: "MSA (literacki)", en: "MSA (literary)" },
    subtitle: { pl: "Arabski standardowy — prasa, książki, oficjalny", en: "Standard Arabic — press, books, formal" },
    desc: { pl: "Od alfabetu przez fonetykę i słownictwo po składnię zdania. Kurs czytania od podstaw.", en: "From the alphabet through phonetics and vocabulary to sentence syntax. A reading course from scratch." },
    color: "#c66e4a",
    start: { pl: "Zacznij od alfabetu (litery i ich formy). Potem „MSA od podstaw” — moduły 1, 2, 3 po kolei.", en: "Start with the alphabet (letters and their forms). Then 'MSA basics' — modules 1, 2, 3 in order." },
    tabs: ["msapath", "alphabet", "msalessons", "roots", "msa"],
  },
  quran: {
    id: "quran",
    icon: "ق",
    title: { pl: "Koraniczny (klasyczny)", en: "Quranic (classical)" },
    subtitle: { pl: "Arabski klasyczny — język Koranu", en: "Classical Arabic — the language of the Quran" },
    desc: { pl: "Pierwsze kroki w arabskim klasycznym: znane formuły, rozłożone na rdzenie, spięte z tym, co już znasz.", en: "First steps in classical Arabic: familiar formulas, broken into roots, linked to what you already know." },
    color: "#7a5cb8",
    start: { pl: "Ten kurs dopiero powstaje. Zacznij od podstawowych formuł i zobacz, jak ich rdzenie żyją w codziennym języku.", en: "This course is just beginning. Start with basic formulas and see how their roots live in everyday language." },
    tabs: ["quranbasics", "quranverses", "religious"],
  },
};

export default function App() {
  const [words, setWords] = useState(loadWords);
  // Wybrany kurs: null = ekran startowy z wyborem, "egyptian" / "msa" / "quran".
  // Zapisywany osobno (nie rusza postępu), by aplikacja wracała do ostatniego kursu.
  const [course, setCourseState] = useState(() => {
    try { return localStorage.getItem("ar-eg-course-v1") || null; } catch { return null; }
  });
  const setCourse = (c) => {
    setCourseState(c);
    try { if (c) localStorage.setItem("ar-eg-course-v1", c); else localStorage.removeItem("ar-eg-course-v1"); } catch {}
    if (c) {
      // Przełącz aktywny kurs i przeładuj jego osobny postęp, statystyki i cel.
      setActiveCourseKey(c);
      setWords(loadWords());   // ponownie wczytaj słowa z postępem nowego kursu
      setStats(loadStats());
      setGoalState(loadGoal());
    }
  };
  const [tab, setTab] = useState("today");
  // Docelowy rdzeń do otwarcia w widoku "rdzenie" (gdy ktoś kliknie link z fiszki).
  const [rootTarget, setRootTarget] = useState(0);
  const goToRoot = (idx) => { setRootTarget(idx); setTab("roots"); };
  const [activeCat, setActiveCat] = useState("all");
  const [stats, setStats] = useState(loadStats);
  // Cel dzienny (liczba odpowiedzi) — grywalizacja.
  const [goal, setGoalState] = useState(loadGoal);
  // Gdy niepuste, quiz/fiszki pracują na tej zawężonej liście (sesja SRS).
  const [srsSession, setSrsSession] = useState(null);
  // null = modal zamknięty, "new" = dodawanie nowej fiszki, obiekt słówka = edycja istniejącej
  const [editingCard, setEditingCard] = useState(null);
  // Tekst kopii do ręcznego skopiowania (gdy pobranie pliku jest zablokowane w ramce)
  const [backupText, setBackupText] = useState(null);
  // Wygląd: motyw kolorów + czcionka arabska (zapisywane osobno, nie ruszają postępu).
  const [appearance, setAppearance] = useState(loadAppearance);
  const [lang, setLangState] = useState(loadLang);

  function setLang(l) {
    setLangState(l);
    saveLang(l);
  }
  const [showSettings, setShowSettings] = useState(false);

  function setGoal(n) {
    setGoalState(n);
    saveGoal(n);
  }

  // Start sesji powtórkowej (SRS): quiz tylko na słowach do powtórki.
  function startReview() {
    const due = dueWords(words);
    if (due.length < 4) return;
    setSrsSession({ mode: "review", ids: due.map(wordId) });
    setTab("quiz");
  }

  // Start nauki nowych słów.
  function startNew() {
    const fresh = newWords(words).slice(0, 20);
    if (fresh.length < 4) return;
    setSrsSession({ mode: "new", ids: fresh.map(wordId) });
    setTab("flash");
  }

  useEffect(() => {
    ensureFontsLoaded();
  }, []);

  useEffect(() => {
    saveAppearance(appearance);
  }, [appearance]);

  useEffect(() => {
    saveWords(words);
  }, [words]);

  useEffect(() => {
    saveStats(stats);
  }, [stats]);

  // Tylko kategorie, które faktycznie mają jakieś słówko w obecnej liście
  const presentCatKeys = useMemo(() => {
    const set = new Set(words.map((w) => w.cat || "other"));
    return set;
  }, [words]);

  // Eksport kopii postępu. Kompaktowy JSON (bez wcięć) — krótszy i łatwiejszy
  // do skopiowania/wklejenia na telefonie. Import radzi sobie z obu formatami.
  async function handleExport() {
    const backup = buildBackup(words, stats);
    const text = JSON.stringify(backup); // kompaktowo, bez białych znaków
    const filename = `arabski-postep-${todayKey()}.json`;

    // spróbuj pobrać plik (zadziała po wystawieniu na hosting)
    tryDownloadFile(text, filename);

    // pokaż podgląd z możliwością skopiowania — pewny sposób w ramce
    setBackupText(text);
  }

  // Import kopii z pliku wybranego przez użytkownika.
  function handleImportFile(file) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => importFromText(e.target.result);
    reader.readAsText(file);
  }

  // Import z surowego tekstu (wklejonego lub z pliku).
  function importFromText(raw) {
    try {
      const backup = JSON.parse(raw);
      const result = applyBackup(backup, words);
      if (!result) {
        alert("Nie rozpoznano kopii. Wklej treść wyeksportowaną z tej aplikacji.");
        return;
      }
      setWords(result.words);
      setStats(result.stats);
      alert("Postęp wczytany. Statystyki zostały przywrócone.");
    } catch (err) {
      alert("Nie udało się odczytać kopii — sprawdź, czy wklejono całą treść.");
    }
  }

  // Import przez wklejenie tekstu (gdy wybór pliku jest niewygodny w ramce).
  function handlePasteImport() {
    const raw = prompt("Wklej tutaj treść kopii (cały tekst z okna kopii):");
    if (raw) importFromText(raw);
  }

  const availableCategories = useMemo(
    () => CATEGORIES.filter((c) => presentCatKeys.has(c.key)),
    [presentCatKeys]
  );

  // Wynik trudności słówka: błędne odpowiedzi w quizie ważą najwięcej,
  // oznaczenie "do poprawki" traktujemy jako dodatkowy sygnał problemu.
  function difficultyScore(w) {
    const wrong = w.wrongCount || 0;
    const correct = w.correctCount || 0;
    const flagBonus = w.flagged ? 2 : 0;
    return wrong * 2 - correct * 0.5 + flagBonus;
  }

  function isDueForReview(w) {
    return (w.wrongCount || 0) > 0 || w.flagged;
  }

  const filteredWords = useMemo(() => {
    // Sesja SRS (powtórka / nowe słowa) ma pierwszeństwo nad filtrem kategorii.
    if (srsSession && srsSession.ids && srsSession.ids.length) {
      const set = new Set(srsSession.ids);
      const picked = words.filter((w) => set.has(wordId(w)));
      if (picked.length) return picked;
    }
    if (activeCat === "review") {
      return words.filter(isDueForReview).sort((a, b) => difficultyScore(b) - difficultyScore(a));
    }
    if (activeCat === "flagged") return words.filter((w) => w.flagged);
    if (activeCat === "verified") return words.filter((w) => w.verified);
    if (activeCat === "known") return words.filter((w) => w.known === "known");
    if (activeCat === "unknown") return words.filter((w) => w.known === "unknown");
    if (activeCat === "toreview") return words.filter((w) => w.known === "review");
    if (activeCat === "all") return words;
    return words.filter((w) => (w.cat || "other") === activeCat);
  }, [words, activeCat, srsSession]);

  // Lista dla QUIZU jest zamrażana na czas sesji (odświeża się przy wejściu
  // w zakładkę lub zmianie kategorii, a NIE po każdej odpowiedzi).
  // Bez tego w „Powtórkach” odpowiedź zmienia liczniki → lista przefiltrowuje
  // się na żywo → quiz restartuje i podświetlenie dobra/zła znika natychmiast.
  const quizWords = useMemo(
    () => filteredWords,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [tab, activeCat]
  );

  const flaggedCount = useMemo(() => words.filter((w) => w.flagged).length, [words]);
  const verifiedCount = useMemo(() => words.filter((w) => w.verified).length, [words]);
  const reviewCount = useMemo(() => words.filter(isDueForReview).length, [words]);
  const knownCount = useMemo(() => words.filter((w) => w.known === "known").length, [words]);
  const unknownCount = useMemo(() => words.filter((w) => w.known === "unknown").length, [words]);
  const toReviewCount = useMemo(() => words.filter((w) => w.known === "review").length, [words]);

  // Wskaźnik postępu.
  // „Przerobione” = słówko, z którym już był kontakt: odpowiedziane w quizie
  //   (correctCount/wrongCount > 0) albo oznaczone jako sprawdzone.
  // „Opanowane” = trafione co najmniej 2× i bez przewagi błędów, albo sprawdzone.
  const progress = useMemo(() => {
    const total = words.length || 1;
    let practiced = 0;
    let mastered = 0;
    for (const w of words) {
      const c = w.correctCount || 0;
      const x = w.wrongCount || 0;
      const touched = c + x > 0 || w.verified;
      if (touched) practiced++;
      if (w.verified || (c >= 2 && c > x)) mastered++;
    }
    return {
      practiced,
      mastered,
      total: words.length,
      practicedPct: Math.round((practiced / total) * 100),
      masteredPct: Math.round((mastered / total) * 100),
    };
  }, [words]);

  // Aktualizuje licznik trafień/pomyłek po odpowiedzi w quizie — to napędza tryb powtórek.
  function recordAnswer(word, isCorrect, level) {
    setStats((s) => {
      let next = markStudiedToday(s);
      if (level) next = recordQuizLevel(next, level, isCorrect);
      return next;
    });
    setWords((ws) => {
      // Quiz działa na zamrożonej liście, więc po wcześniejszej odpowiedzi
      // referencja obiektu może być nieaktualna — wtedy dopasowujemy po treści.
      let i = ws.indexOf(word);
      if (i === -1) {
        i = ws.findIndex(
          (w) =>
            w.pl === word.pl &&
            w.ar === word.ar &&
            (w.cat || "other") === (word.cat || "other")
        );
      }
      if (i === -1) return ws;
      return ws.map((w, j) => {
        if (j !== i) return w;
        // Aktualizuj też harmonogram powtórek (SRS): trafienie wydłuża interwał,
        // błąd cofa słowo do jutra.
        const srs = srsUpdate(w, isCorrect);
        if (isCorrect) {
          return { ...w, correctCount: (w.correctCount || 0) + 1, ...srs };
        }
        return { ...w, wrongCount: (w.wrongCount || 0) + 1, ...srs };
      });
    });
  }

  function toggleFlag(word, flagged, note) {
    setWords((ws) =>
      ws.map((w) =>
        w === word ? { ...w, flagged, flagNote: note, verified: flagged ? false : w.verified } : w
      )
    );
  }

  function toggleVerified(word, verified) {
    setWords((ws) =>
      ws.map((w) =>
        w === word ? { ...w, verified, flagged: verified ? false : w.flagged, flagNote: verified ? "" : w.flagNote } : w
      )
    );
  }

  // Samoocena znajomości: "known" | "unknown" | "review". Ponowne kliknięcie
  // tego samego znacznika zdejmuje go (toggle). Niezależne od verified/flagged.
  function setKnown(word, value) {
    setWords((ws) =>
      ws.map((w) => (w === word ? { ...w, known: w.known === value ? undefined : value } : w))
    );
    // Samoocena to też forma nauki — odnotuj dzień aktywności.
    setStats((s) => markStudiedToday(s));
  }

  // Zastępuje przykład użycia danego słówka nowo wpisanym (szybka edycja z fiszki/listy).
  function saveExample(word, ex) {
    setWords((ws) => ws.map((w) => (w === word ? { ...w, ex } : w)));
  }

  // Zapisuje fiszkę z pełnego formularza — albo dodaje nową, albo zastępuje
  // treść istniejącej (gdy editingCard wskazuje na konkretne słówko).
  function saveCard(card) {
    if (editingCard && editingCard !== "new") {
      const targetId = wordId(editingCard);
      const newId = wordId(card);
      // Jeśli edycja zmienia wordId (zmiana pl/ar/cat), zapamiętaj, że oryginał
      // z bazy ma być ukryty — inaczej po przeładowaniu wróciłby obok edycji.
      if (newId !== targetId) {
        try {
          const raw = localStorage.getItem("ar-eg-hidden");
          const hidden = raw ? JSON.parse(raw) : [];
          if (!hidden.includes(targetId)) {
            hidden.push(targetId);
            localStorage.setItem("ar-eg-hidden", JSON.stringify(hidden));
          }
        } catch (e) {}
      }
      setWords((ws) => {
        let replaced = false;
        const next = ws.map((w) => {
          if (w === editingCard || wordId(w) === targetId) {
            replaced = true;
            return card;
          }
          return w;
        });
        return replaced ? next : [...ws, card];
      });
    } else {
      setWords((ws) => [...ws, card]);
    }
  }

  function deleteCard() {
    if (editingCard && editingCard !== "new") {
      const targetId = wordId(editingCard);
      // Trwale ukryj, żeby usunięte słowo z bazy nie wróciło po przeładowaniu.
      try {
        const raw = localStorage.getItem("ar-eg-hidden");
        const hidden = raw ? JSON.parse(raw) : [];
        if (!hidden.includes(targetId)) {
          hidden.push(targetId);
          localStorage.setItem("ar-eg-hidden", JSON.stringify(hidden));
        }
      } catch (e) {}
      setWords((ws) => ws.filter((w) => w !== editingCard && wordId(w) !== targetId));
    }
  }

  const showCategoryPicker = tab === "flash" || tab === "quiz" || tab === "list";
  const showAddButton = tab === "flash" || tab === "list";

  // Ekran startowy: wybór kursu. Gdy żaden kurs nie jest wybrany, pokazujemy karty.
  if (!course) {
    return (
      <LangContext.Provider value={lang}>
        <div className="app-root">
          <style>{CSS}</style>
          <style>{appearanceCSS(appearance)}</style>
          <div className="course-select">
            <div className="course-select-head">
              <div className="header-glyph" aria-hidden="true">ع</div>
              <h1>3aamiya</h1>
              <p>{lang === "en" ? "Choose your course to begin" : "Wybierz kurs, by zacząć"}</p>
            </div>
            <div className="course-cards">
              {Object.values(COURSES).map((c) => (
                <button
                  key={c.id}
                  className="course-card"
                  style={{ borderColor: c.color }}
                  onClick={() => { setCourse(c.id); setTab(c.tabs[0]); setSrsSession(null); }}
                >
                  <span className="course-card-icon" style={{ background: c.color }}>{c.icon}</span>
                  <span className="course-card-body">
                    <span className="course-card-title">{lang === "en" ? c.title.en : c.title.pl}</span>
                    <span className="course-card-subtitle">{lang === "en" ? c.subtitle.en : c.subtitle.pl}</span>
                    <span className="course-card-desc">{lang === "en" ? c.desc.en : c.desc.pl}</span>
                  </span>
                </button>
              ))}
            </div>
            <button className="course-lang-toggle" onClick={() => setLang(lang === "en" ? "pl" : "en")}>
              {lang === "en" ? "🇵🇱 polski" : "🇬🇧 English"}
            </button>
          </div>
        </div>
      </LangContext.Provider>
    );
  }

  return (
    <LangContext.Provider value={lang}>
    <div className="app-root">
      <style>{CSS}</style>
      <style>{appearanceCSS(appearance)}</style>

      <header className="app-header">
        <div className="header-glyph" aria-hidden="true">
          ع
        </div>
        <div className="header-text">
          <h1>3aamiya</h1>
          <p>{lang === "en" ? "Egyptian Arabic vocabulary" : "słownictwo egipskiego arabskiego"}</p>
        </div>
        <button
          className="settings-btn"
          onClick={() => setShowSettings(true)}
          title={(lang === "en" ? "Appearance: colors and font" : "Wygląd: kolory i czcionka")}
          aria-label={(lang === "en" ? "Appearance settings" : "Ustawienia wyglądu")}
        >
          <Palette size={18} />
        </button>
        {showAddButton && (
          <button className="add-card-btn" onClick={() => setEditingCard("new")}>
            <Plus size={16} />
            {lang==="en"?"add card":"dodaj fiszkę"}
          </button>
        )}
      </header>

      <div className="course-bar" style={{ borderColor: COURSES[course].color }}>
        <button className="course-back" onClick={() => setCourse(null)}>
          ← {lang === "en" ? "courses" : "kursy"}
        </button>
        <span className="course-bar-title" style={{ color: COURSES[course].color }}>
          {lang === "en" ? COURSES[course].title.en : COURSES[course].title.pl}
        </span>
      </div>

      <nav className="tab-bar">
        {(() => {
          const ALL_TABS = [
            { key: "egpath", label: "lekcje", labelEn: "lessons", Icon: GraduationCap },
            { key: "today", label: "na dziś", labelEn: "today", Icon: TrendingUp },
            { key: "lessons", label: "lekcje", labelEn: "lessons", Icon: GraduationCap },
            { key: "flash", label: "fiszki", labelEn: "flashcards", Icon: BookOpen },
            { key: "quiz", label: "quiz", labelEn: "quiz", Icon: ListChecks },
            { key: "verbs", label: "czasowniki", labelEn: "verbs", Icon: RotateCw },
            { key: "nouns", label: "rzeczowniki", labelEn: "nouns", Icon: Hash },
            { key: "questions", label: "zaimki", labelEn: "pronouns", Icon: HelpCircle },
            { key: "grammar", label: "gramatyka", labelEn: "grammar", Icon: Puzzle },
            { key: "sentences", label: "zdania", labelEn: "sentences", Icon: MessageSquare },
            { key: "gaps", label: "luki", labelEn: "gaps", Icon: PenLine },
            { key: "match", label: "pary", labelEn: "pairs", Icon: Shuffle },
            { key: "write", label: "pisanie", labelEn: "writing", Icon: Pencil },
            { key: "dialogues", label: "dialogi", labelEn: "dialogues", Icon: MessagesSquare },
            { key: "readings", label: "czytanki", labelEn: "readings", Icon: BookOpen },
            { key: "msa", label: "egipski/MSA", labelEn: "Egyptian/MSA", Icon: BookOpen },
            { key: "roots", label: "rdzenie", labelEn: "roots", Icon: BookOpen },
            { key: "alphabet", label: "alfabet", labelEn: "alphabet", Icon: BookOpen },
            { key: "msapath", label: "lekcje", labelEn: "lessons", Icon: GraduationCap },
            { key: "msalessons", label: "MSA od podstaw", labelEn: "MSA basics", Icon: GraduationCap },
            { key: "quranbasics", label: "powiedzenia codzienne", labelEn: "everyday sayings", Icon: BookOpen },
            { key: "quranverses", label: "Koran od podstaw", labelEn: "Quran basics", Icon: GraduationCap },
            { key: "religious", label: "kwestie religijne", labelEn: "religious topics", Icon: BookOpen },
            { key: "stats", label: "statystyki", labelEn: "stats", Icon: TrendingUp },
            { key: "list", label: "lista", labelEn: "word list", Icon: List },
          ];
          const tabMap = Object.fromEntries(ALL_TABS.map((t) => [t.key, t]));
          const courseTabs = COURSES[course].tabs.map((k) => tabMap[k]).filter(Boolean);
          return courseTabs.map(({ key, label, labelEn, Icon }) => (
          <button
            key={key}
            className={`tab-btn ${tab === key ? "tab-active" : ""}`}
            onClick={() => {
              setTab(key);
              // Ręczne przejście kończy sesję powtórkową (wracamy do normalnych filtrów).
              setSrsSession(null);
            }}
          >
            <span className="tab-icon"><Icon size={16} /></span>
            <span className="tab-label">{lang === "en" && labelEn ? labelEn : label}</span>
          </button>
          ));
        })()}
      </nav>

      <div className="progress-panel">
        <div className="progress-panel-head">
          <span className="progress-panel-label">{lang === "en" ? "material covered" : "przerobiony materiał"}</span>
          <span className="progress-panel-count">
            {progress.practiced} / {progress.total} ({progress.practicedPct}%)
          </span>
        </div>
        <div className="progress-bar-track">
          <div
            className="progress-bar-practiced"
            style={{ width: `${progress.practicedPct}%` }}
          />
          <div
            className="progress-bar-mastered"
            style={{ width: `${progress.masteredPct}%` }}
          />
        </div>
        <div className="progress-panel-legend">
          <span className="legend-item">
            <span className="legend-dot legend-dot-practiced" />
            {lang === "en" ? "practiced" : "przerobione"}
          </span>
          <span className="legend-item">
            <span className="legend-dot legend-dot-mastered" />
            {lang === "en" ? "mastered" : "opanowane"} {progress.mastered} ({progress.masteredPct}%)
          </span>
        </div>
      </div>

      {showCategoryPicker && (
        <CategoryPicker
          categories={availableCategories}
          activeCat={activeCat}
          setActiveCat={setActiveCat}
          totalCount={words.length}
          flaggedCount={flaggedCount}
          verifiedCount={verifiedCount}
          reviewCount={reviewCount}
          knownCount={knownCount}
          unknownCount={unknownCount}
          toReviewCount={toReviewCount}
        />
      )}

      <main className="app-main">
        {tab === "today" && (
          <TodayView
            words={words}
            stats={stats}
            goal={goal}
            setGoal={setGoal}
            onStartReview={startReview}
            onStartNew={startNew}
          />
        )}

        {tab === "lessons" && (
          <LessonsView
            words={words}
            onToggleFlag={toggleFlag}
            onToggleVerified={toggleVerified}
            onSetKnown={setKnown}
            onSaveExample={saveExample}
            onEditCard={setEditingCard}
            onAnswer={recordAnswer}
          />
        )}
        {tab === "flash" && (
          <FlashcardsView
            words={filteredWords}
            onToggleFlag={toggleFlag}
            onToggleVerified={toggleVerified}
            onSetKnown={setKnown}
            onSaveExample={saveExample}
            onEditCard={setEditingCard}
            onGoToRoot={goToRoot}
            preserveOrder={activeCat === "review"}
            emptyHint={
              activeCat === "known"
                ? "Nie masz jeszcze fiszek oznaczonych „wiem”. Odsłoń fiszkę i stuknij „wiem”, aby ją tu zebrać."
                : activeCat === "unknown"
                ? "Nie masz fiszek oznaczonych „nie wiem”. Odsłoń fiszkę i stuknij „nie wiem”."
                : activeCat === "toreview"
                ? "Nie masz fiszek oznaczonych „do powtórki”. Odsłoń fiszkę i stuknij „do powtórki”."
                : undefined
            }
          />
        )}
        {tab === "quiz" && (
          <QuizView
            words={quizWords}
            onAnswer={recordAnswer}
            preserveOrder={activeCat === "review"}
          />
        )}
        {tab === "verbs" && <VerbsView />}
        {tab === "nouns" && <NounsView />}
        {tab === "questions" && <QuestionsView />}
        {tab === "grammar" && <GrammarView />}
        {tab === "sentences" && <SentencesView />}
        {tab === "gaps" && <GapView />}
        {tab === "match" && <MatchView words={words} />}
        {tab === "write" && <WriteView words={words} />}
        {tab === "dialogues" && <DialoguesView />}
        {tab === "readings" && <ReadingsView />}
        {tab === "msa" && <MsaView />}
        {tab === "roots" && <RootsView initialRoot={rootTarget} />}
        {tab === "alphabet" && <AlphabetView />}
        {tab === "msapath" && <MsaPathView />}
        {tab === "egpath" && <EgPathView onGoFlashcards={(cat) => { setActiveCat(cat); setTab("flash"); }} />}
        {tab === "quranbasics" && <QuranBasicsView />}
        {tab === "quranverses" && <QuranVersesView />}
        {tab === "religious" && <ReligiousView />}
        {tab === "msalessons" && <MsaLessonsView />}
        {tab === "stats" && (
          <StatsView
            words={words}
            stats={stats}
            categories={CATEGORIES}
            onExport={handleExport}
            onImport={handleImportFile}
            onPasteImport={handlePasteImport}
          />
        )}
        {tab === "list" && (
          <ListView
            words={words}
            setWords={setWords}
            activeCat={activeCat}
            onToggleFlag={toggleFlag}
            onToggleVerified={toggleVerified}
            onSaveExample={saveExample}
            onEditCard={setEditingCard}
          />
        )}
      </main>

      {editingCard && (
        <CardFormModal
          onClose={() => setEditingCard(null)}
          onSave={saveCard}
          onDelete={deleteCard}
          initial={editingCard === "new" ? null : editingCard}
        />
      )}

      {backupText !== null && (
        <div className="modal-overlay" onClick={() => setBackupText(null)}>
          <div className="modal-card backup-modal" onClick={(e) => e.stopPropagation()}>
            <h3 className="modal-title">{(lang === "en" ? "Progress backup" : "Kopia postępu")}</h3>
            <p className="backup-modal-note">
              Stuknij „zaznacz i kopiuj", potem wklej do notatki w telefonie. Albo
              stuknij w pole — zaznaczy się całość, wtedy przytrzymaj i wybierz „Kopiuj".
              Po aktualizacji aplikacji użyj „wklej kopię", żeby przywrócić postęp.
            </p>
            <textarea
              className="backup-textarea"
              readOnly
              value={backupText}
              onClick={(e) => e.target.select()}
              onFocus={(e) => e.target.select()}
            />
            <div className="backup-modal-actions">
              <button
                className="nav-btn nav-btn-primary"
                onClick={(e) => {
                  // Zaznacz zawartość pola tekstowego (działa też na iOS)
                  const ta = e.currentTarget
                    .closest(".modal-card")
                    .querySelector(".backup-textarea");
                  let ok = false;
                  if (ta) {
                    ta.focus();
                    ta.select();
                    ta.setSelectionRange(0, ta.value.length); // iOS wymaga zakresu
                    try {
                      ok = document.execCommand("copy"); // działa w ramce, gdzie nowe API zawodzi
                    } catch (err) {}
                  }
                  if (!ok && navigator.clipboard && navigator.clipboard.writeText) {
                    navigator.clipboard.writeText(backupText).then(
                      () => alert("Skopiowano całość do schowka."),
                      () => alert("Tekst jest zaznaczony — przytrzymaj i wybierz „Kopiuj”.")
                    );
                    return;
                  }
                  alert(
                    ok
                      ? "Skopiowano całość do schowka. Wklej do notatki."
                      : "Tekst jest zaznaczony — przytrzymaj palcem i wybierz „Kopiuj”."
                  );
                }}
              >
                zaznacz i kopiuj
              </button>
              <button className="nav-btn" onClick={() => setBackupText(null)}>
                zamknij
              </button>
            </div>
          </div>
        </div>
      )}

      {showSettings && (
        <div className="modal-overlay" onClick={() => setShowSettings(false)}>
          <div className="modal-card settings-modal" onClick={(e) => e.stopPropagation()}>
            <h3 className="modal-title">{t(UI.settings, lang)}</h3>

            <p className="settings-group-label">{t(UI.language, lang)}</p>
            <div className="settings-langs">
              {LANGS.map((l) => (
                <button
                  key={l.key}
                  className={`lang-btn ${lang === l.key ? "lang-btn-active" : ""}`}
                  onClick={() => setLang(l.key)}
                >
                  <span className="lang-flag">{l.flag}</span>
                  <span className="lang-name">{l.label}</span>
                  {lang === l.key && <Check size={15} className="theme-check" />}
                </button>
              ))}
            </div>

            <p className="settings-group-label">{t(UI.colors, lang)}</p>
            <div className="settings-themes">
              {Object.entries(THEMES).map(([key, t]) => (
                <button
                  key={key}
                  className={`theme-swatch ${appearance.theme === key ? "theme-swatch-active" : ""}`}
                  onClick={() => setAppearance((a) => ({ ...a, theme: key }))}
                >
                  <span className="theme-dots">
                    <span style={{ background: t.vars["--teal"] }} />
                    <span style={{ background: t.vars["--terracotta"] }} />
                    <span style={{ background: t.vars["--sand"], border: "1px solid rgba(0,0,0,0.1)" }} />
                  </span>
                  <span className="theme-name">{lang==="en"&&t.labelEn?t.labelEn:t.label}</span>
                  {appearance.theme === key && <Check size={15} className="theme-check" />}
                </button>
              ))}
            </div>

            <p className="settings-group-label">{t(UI.arabicFont, lang)}</p>
            <div className="settings-fonts">
              {Object.entries(ARABIC_FONTS).map(([key, f]) => (
                <button
                  key={key}
                  className={`font-choice ${appearance.font === key ? "font-choice-active" : ""}`}
                  onClick={() => setAppearance((a) => ({ ...a, font: key }))}
                >
                  <span className="font-choice-sample" style={{ fontFamily: f.stack }}>
                    سؤال
                  </span>
                  <span className="font-choice-name">{lang==="en"&&f.labelEn?f.labelEn:f.label}</span>
                  {appearance.font === key && <Check size={15} className="theme-check" />}
                </button>
              ))}
            </div>

            <div className="settings-actions">
              <button
                className="nav-btn"
                onClick={() => setAppearance({ theme: "morski", font: "noto" })}
              >
                {lang==="en"?"restore defaults":"przywróć domyślne"}
              </button>
              <button className="nav-btn nav-btn-primary" onClick={() => setShowSettings(false)}>
                {lang==="en"?"done":"gotowe"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    </LangContext.Provider>
  );
}

// ---------- Wybór działu / tematu lekcji ----------
function CategoryPicker({ categories, activeCat, setActiveCat, totalCount, flaggedCount, verifiedCount, reviewCount, knownCount, unknownCount, toReviewCount }) {
  const ui = useUi();
  const lang = useLang();
  // Etykieta aktywnej kategorii do dropdownu (obsługuje też pseudo-kategorie).
  const special = lang === "en" ? {
    all: `📚 All (${totalCount})`,
    review: `🔁 Review (${reviewCount})`,
    flagged: `🚩 To fix (${flaggedCount})`,
    verified: `✓ Verified (${verifiedCount})`,
    known: `🟢 Known (${knownCount})`,
    unknown: `🔴 Don't know (${unknownCount})`,
    toreview: `🟠 Review later (${toReviewCount})`,
  } : {
    all: `📚 Wszystkie (${totalCount})`,
    review: `🔁 Powtórki (${reviewCount})`,
    flagged: `🚩 Do poprawki (${flaggedCount})`,
    verified: `✓ Sprawdzone (${verifiedCount})`,
    known: `🟢 Wiem (${knownCount})`,
    unknown: `🔴 Nie wiem (${unknownCount})`,
    toreview: `🟠 Do powtórki (${toReviewCount})`,
  };
  return (
    <div className="cat-picker">
      <select
        className="cat-jump"
        value={activeCat}
        onChange={(e) => setActiveCat(e.target.value)}
        aria-label={(lang === "en" ? "Choose category" : "Wybierz kategorię")}
      >
        <option value="all">{special.all}</option>
        <optgroup label="── Moja samoocena ──">
          <option value="known">{special.known}</option>
          <option value="unknown">{special.unknown}</option>
          <option value="toreview">{special.toreview}</option>
        </optgroup>
        <optgroup label={lang==="en"?"── To review ──":"── Do przeglądu ──"}>
          {reviewCount > 0 && <option value="review">{special.review}</option>}
          {flaggedCount > 0 && <option value="flagged">{special.flagged}</option>}
          {verifiedCount > 0 && <option value="verified">{special.verified}</option>}
        </optgroup>
        <optgroup label={lang==="en"?"── Categories ──":"── Działy ──"}>
          {categories.map((c) => (
            <option key={c.key} value={c.key}>
              {c.emoji} {catLabel(c, lang)}
            </option>
          ))}
        </optgroup>
      </select>
    </div>
  );
}

// ---------- Styles ----------
const CSS = `
:root {
  --sand: #eceee7;
  --sand-deep: #d8dcd0;
  --ink: #1a2420;
  --teal: #1d5c52;
  --teal-deep: #123f38;
  --terracotta: #a66a24;
  --terracotta-soft: #e0c088;
  --paper: #ffffff;
  --ar-font: 'Amiri', 'Georgia', serif;
}

* { box-sizing: border-box; }

.app-root {
  min-height: 100vh;
  background: var(--sand);
  background-image:
    radial-gradient(circle at 12% 8%, rgba(29,92,82,0.06), transparent 42%),
    radial-gradient(circle at 88% 92%, rgba(189,127,54,0.07), transparent 48%);
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  color: var(--ink);
  padding: 20px 16px 48px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.app-header {
  display: flex;
  align-items: center;
  gap: 14px;
  max-width: 480px;
  width: 100%;
  margin-bottom: 22px;
}

.header-glyph {
  font-family: var(--ar-font);
  font-size: 38px;
  color: var(--paper);
  line-height: 1;
  width: 56px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--teal);
  border-radius: 16px;
  border: none;
  box-shadow: 0 4px 14px rgba(29,92,82,0.28);
  flex-shrink: 0;
}

.header-text h1 {
  font-family: Georgia, 'Times New Roman', serif;
  font-size: 27px;
  font-weight: 700;
  letter-spacing: -0.2px;
  margin: 0;
  color: var(--teal-deep);
}

.header-text p {
  margin: 3px 0 0;
  font-size: 12.5px;
  color: #7a8478;
  letter-spacing: 0.2px;
}

.tab-bar {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 2px;
  max-width: 480px;
  width: 100%;
  box-sizing: border-box;
  background: var(--paper);
  border: 1.5px solid var(--sand-deep);
  border-radius: 14px;
  padding: 5px;
  margin-bottom: 20px;
}

.tab-btn {
  min-width: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  gap: 3px;
  border: none;
  background: transparent;
  padding: 8px 3px;
  border-radius: 10px;
  font-size: 10.5px;
  font-weight: 600;
  color: var(--muted);
  cursor: pointer;
  transition: background 0.18s, color 0.18s;
  text-align: center;
  line-height: 1.15;
  overflow-wrap: anywhere;
  word-break: break-word;
  hyphens: auto;
}

.tab-btn.tab-active {
  background: var(--teal);
  color: var(--paper);
}
.tab-icon {
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.tab-label {
  display: block;
  width: 100%;
  min-height: 24px;
}

.app-main {
  max-width: 480px;
  width: 100%;
  overflow-x: hidden;
}

/* ---- Flashcards ---- */
.view-flash {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.progress-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin-bottom: 12px;
}

.progress-text {
  font-size: 12.5px;
  letter-spacing: 0.5px;
  color: var(--muted);
  font-weight: 600;
}

.progress-score { color: var(--teal-deep); }

.icon-btn {
  border: 1.5px solid var(--sand-deep);
  background: var(--paper);
  border-radius: 10px;
  padding: 8px;
  display: flex;
  cursor: pointer;
  color: var(--teal-deep);
  transition: transform 0.15s;
}
.icon-btn:hover { transform: scale(1.06); }
.icon-btn-danger { color: var(--terracotta); border-color: var(--terracotta-soft); }
.icon-btn-edit { color: var(--teal-deep); }

.card-stage {
  width: 100%;
  height: 440px;
  perspective: 1200px;
  cursor: pointer;
  margin-bottom: 18px;
}

.card-inner {
  width: 100%;
  height: 100%;
  position: relative;
  transition: transform 0.5s cubic-bezier(.4,.2,.2,1);
  transform-style: preserve-3d;
}

.card-inner.is-flipped { transform: rotateY(180deg); }

.card-face {
  position: absolute;
  inset: 0;
  border-radius: 22px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  backface-visibility: hidden;
  padding: 24px 24px 56px;
  text-align: center;
  overflow-y: auto;
  overflow-x: hidden;
}
/* Tylna strona bywa dłuższa (przykład + oceny + panel) — wyrównaj do góry
   i pozwól przewijać, żeby elementy się nie nakładały. */


/* ---- Podgląd odmiany na fiszce ---- */
.conj-preview { align-self: stretch; margin-top: 4px; }
.conj-toggle {
  display: block; margin: 0 auto; padding: 6px 14px; border-radius: 999px;
  border: 1px dashed rgba(255,255,255,0.4); background: rgba(255,255,255,0.08);
  color: rgba(255,255,255,0.9); font-size: 12px; font-weight: 600; cursor: pointer;
}
.conj-tables {
  margin-top: 10px; display: flex; flex-direction: column; gap: 12px;
  background: rgba(0,0,0,0.15); border-radius: 12px; padding: 12px;
}
.conj-table { display: flex; flex-direction: column; gap: 3px; }
.conj-tense-title {
  font-size: 10.5px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase;
  color: rgba(255,255,255,0.55); margin-bottom: 3px;
}
.conj-tense-active { color: var(--amber, #e0a34e); }
.conj-row {
  display: grid; grid-template-columns: 62px 1fr auto; gap: 8px; align-items: baseline;
  padding: 3px 6px; border-radius: 6px;
}
.conj-row-hi { background: rgba(224,163,78,0.22); }
.conj-pron { font-family: 'JetBrains Mono', monospace; font-size: 11px; color: rgba(255,255,255,0.55); }
.conj-ar { font-family: var(--ar-font); font-size: 17px; color: #fff; direction: rtl; text-align: right; }
.conj-ph { font-family: 'JetBrains Mono', monospace; font-size: 11.5px; color: rgba(255,255,255,0.8); }
.conj-note {
  font-size: 11.5px; color: rgba(255,255,255,0.65); line-height: 1.5; margin: 4px 0 0;
  border-top: 1px solid rgba(255,255,255,0.15); padding-top: 8px;
}

.card-root-link {
  display: inline-flex; align-items: center; gap: 8px; align-self: center;
  margin-top: 4px; padding: 6px 14px; border-radius: 999px;
  border: 1px dashed rgba(255,255,255,0.4); background: rgba(255,255,255,0.08);
  color: rgba(255,255,255,0.9); font-size: 12px; font-weight: 600; cursor: pointer;
}
.card-root-link-ar { font-family: var(--ar-font); font-size: 15px; direction: rtl; }

.card-back {
  justify-content: flex-start;
}
.card-face::-webkit-scrollbar { width: 0; background: transparent; }

.card-front {
  background: var(--paper);
  border: 1px solid var(--sand-deep);
  box-shadow: 0 8px 30px rgba(26,36,32,0.08), 0 2px 8px rgba(26,36,32,0.04);
}

.card-back {
  background: var(--teal-deep);
  color: var(--paper);
  transform: rotateY(180deg);
  border: 1px solid var(--teal);
  box-shadow: 0 8px 30px rgba(18,63,56,0.22), 0 2px 8px rgba(18,63,56,0.12);
  justify-content: flex-start;
  padding-bottom: 24px;
}

.card-eyebrow {
  font-size: 11.5px;
  letter-spacing: 2px;
  text-transform: uppercase;
  opacity: 0.65;
  font-weight: 700;
}

.card-word {
  font-family: Georgia, serif;
  font-size: 28px;
  font-weight: 700;
  color: var(--teal-deep);
}

.card-hint {
  font-size: 12px;
  color: var(--muted);
  margin-top: 6px;
}

.card-arabic {
  font-family: var(--ar-font);
  font-size: 38px;
  direction: rtl;
}

.card-phonetic {
  font-family: 'JetBrains Mono', 'Courier New', monospace;
  font-size: 16px;
  color: var(--terracotta-soft);
  letter-spacing: 0.5px;
}

.card-example {
  margin-top: 14px;
  padding-top: 14px;
  border-top: 1px solid rgba(251,246,236,0.18);
  display: flex;
  flex-direction: column;
  gap: 5px;
  width: 100%;
}
.card-example-src {
  font-size: 9px;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  font-weight: 700;
  color: var(--terracotta-soft);
  opacity: 0.8;
  margin-bottom: 2px;
}

.example-arabic {
  font-family: var(--ar-font);
  font-size: 19px;
  direction: rtl;
  color: var(--paper);
}

.example-phonetic {
  font-family: 'JetBrains Mono', monospace;
  font-size: 12.5px;
  color: var(--terracotta-soft);
}

.example-pl {
  font-size: 12.5px;
  color: rgba(251,246,236,0.75);
  font-style: italic;
}

.nav-row {
  display: flex;
  gap: 10px;
  width: 100%;
}

.nav-btn {
  flex: 1;
  border: 1.5px solid var(--sand-deep);
  background: var(--paper);
  color: var(--teal-deep);
  font-weight: 700;
  font-size: 14px;
  padding: 13px;
  border-radius: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.12s;
}
.nav-btn:hover { transform: translateY(-1px); }

.nav-btn-primary {
  background: var(--teal);
  color: var(--paper);
  border-color: var(--teal);
}

.nav-btn-full { width: 100%; margin-top: 14px; }

/* ---- Quiz ---- */
.view-quiz { display: flex; flex-direction: column; }

.quiz-prompt {
  background: var(--paper);
  border: 2px solid var(--sand-deep);
  border-radius: 18px;
  padding: 26px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  margin-bottom: 16px;
}

.quiz-word {
  font-family: Georgia, serif;
  font-size: 24px;
  font-weight: 700;
  color: var(--teal-deep);
  text-align: center;
}

.quiz-word-ar {
  font-family: var(--ar-font);
  direction: rtl;
  font-size: 34px;
}

.quiz-word-ph {
  display: block;
  text-align: center;
  font-size: 15px;
  color: var(--terracotta);
  font-weight: 600;
  margin-top: 4px;
}

.opt-pl {
  font-size: 16px;
  color: var(--ink);
  font-weight: 500;
}

.quiz-options {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

/* ---- Ujawnienie po odpowiedzi (słowo + przykład) ---- */
.quiz-reveal {
  margin-top: 16px;
  border: 1.5px solid var(--sand-deep);
  border-radius: 14px;
  overflow: hidden;
}
.quiz-reveal-word {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  padding: 14px;
  background: rgba(29,92,82,0.06);
}
.quiz-reveal-ar { font-family: var(--ar-font); font-size: 28px; direction: rtl; color: var(--teal-deep); }
.quiz-reveal-ph { font-size: 14px; color: var(--terracotta); font-weight: 600; }
.quiz-reveal-pl { font-size: 13px; color: var(--muted); }
.quiz-reveal-ex {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;
  padding: 14px;
  border-top: 1px solid var(--sand-deep);
}
.quiz-reveal-ex-label {
  font-size: 10px; text-transform: uppercase; letter-spacing: 1px;
  font-weight: 700; color: var(--muted-soft); margin-bottom: 4px;
}
.quiz-reveal-ex-ar { font-family: var(--ar-font); font-size: 22px; direction: rtl; color: var(--ink); line-height: 1.5; text-align: center; }
.quiz-reveal-ex-ph { font-size: 13px; color: var(--terracotta); font-weight: 600; text-align: center; }
.quiz-reveal-ex-pl { font-size: 13px; color: var(--muted); text-align: center; }
.quiz-reveal-noex { font-size: 12.5px; color: var(--muted-soft); font-style: italic; text-align: center; padding: 12px; margin: 0; }

.quiz-option {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 30px;
  background: var(--paper);
  border: 1.5px solid var(--sand-deep);
  border-radius: 14px;
  padding: 14px 16px;
  cursor: pointer;
  text-align: left;
}

.quiz-option:disabled { cursor: default; }

.opt-ar-wrap {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
  min-width: 0;
}

.opt-arabic {
  font-family: var(--ar-font);
  font-size: 20px;
  direction: rtl;
  unicode-bidi: isolate;
}

.opt-phonetic {
  font-family: 'JetBrains Mono', monospace;
  font-size: 12.5px;
  color: var(--muted);
}
.opt-icon { flex-shrink: 0; margin-left: 10px; }

.opt-correct {
  background: rgba(15,92,92,0.12);
  border-color: var(--teal);
  color: var(--teal-deep);
}

.opt-wrong {
  background: rgba(193,87,47,0.10);
  border-color: var(--terracotta);
  color: var(--terracotta);
}

.quiz-result {
  align-items: center;
  text-align: center;
  padding: 40px 0;
  gap: 6px;
}

.result-pct {
  font-family: Georgia, serif;
  font-size: 52px;
  font-weight: 700;
  color: var(--teal-deep);
}

.result-label {
  font-size: 14px;
  color: var(--ink);
  margin-bottom: 22px;
}

/* ---- List ---- */
.view-list { display: flex; flex-direction: column; gap: 14px; }

.add-form {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  background: var(--paper);
  border: 1.5px solid var(--sand-deep);
  border-radius: 14px;
  padding: 12px;
}

.text-input {
  border: 1.5px solid var(--sand-deep);
  border-radius: 9px;
  padding: 10px 11px;
  font-size: 14px;
  background: var(--paper);
  color: var(--ink);
  outline: none;
  width: 100%;
  min-width: 0;
  box-sizing: border-box;
}
.text-input:focus { border-color: var(--teal); }

.input-arabic { font-family: var(--ar-font); direction: rtl; font-size: 16px; }
.input-mono { font-family: 'JetBrains Mono', monospace; }

.add-submit {
  grid-column: 1 / -1;
}

.example-divider {
  grid-column: 1 / -1;
  font-size: 11px;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: var(--muted);
  font-weight: 700;
  margin: 4px 0 -2px;
  border-top: 1px dashed var(--sand-deep);
  padding-top: 10px;
}

.example-pl-input {
  grid-column: 1 / -1;
  font-style: italic;
}

.list-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
}

.list-count {
  font-size: 12.5px;
  font-weight: 700;
  color: var(--teal-deep);
}

.list-toolbar-actions { display: flex; gap: 14px; flex-wrap: wrap; }

.text-btn {
  border: none;
  background: none;
  color: var(--teal);
  font-size: 12.5px;
  font-weight: 600;
  cursor: pointer;
  text-decoration: underline;
  padding: 0;
  display: flex;
  align-items: center;
}

.text-btn-danger { color: var(--terracotta); }

.csv-hint {
  font-size: 11.5px;
  color: var(--muted);
  margin: -6px 0 0;
  overflow-wrap: anywhere;
  word-break: break-word;
}

.word-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 7px;
}

.word-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: var(--paper);
  border: 1.5px solid var(--sand-deep);
  border-radius: 12px;
  padding: 10px 12px;
}

.word-row-text {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.word-pl { font-size: 13.5px; font-weight: 600; color: var(--ink); }
.word-ar { font-family: var(--ar-font); font-size: 17px; direction: rtl; color: var(--teal-deep); }
.word-ph { font-family: 'JetBrains Mono', monospace; font-size: 11.5px; color: var(--terracotta); }
.word-ex {
  font-family: var(--ar-font);
  font-size: 13px;
  direction: rtl;
  color: var(--muted);
  margin-top: 2px;
}
.word-ex-pl {
  font-family: 'Inter', sans-serif;
  font-style: italic;
  direction: ltr;
  unicode-bidi: isolate;
}

.empty-state {
  text-align: center;
  padding: 40px 20px;
  color: var(--muted);
  font-size: 13.5px;
  border: 1.5px dashed var(--sand-deep);
  border-radius: 14px;
}

/* ---- Verbs ---- */
.view-verbs { display: flex; flex-direction: column; gap: 14px; }

.verbs-intro {
  font-size: 12.5px;
  color: var(--ink);
  line-height: 1.5;
  margin: 0;
}

.verb-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.verb-card {
  background: var(--paper);
  border: 1.5px solid var(--sand-deep);
  border-radius: 14px;
  overflow: hidden;
}

.verb-card-header {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border: none;
  background: transparent;
  padding: 13px 14px;
  cursor: pointer;
  text-align: left;
}

.verb-card-title {
  display: flex;
  align-items: baseline;
  gap: 10px;
  flex-wrap: wrap;
}

.verb-card-pl {
  font-weight: 700;
  font-size: 14px;
  color: var(--ink);
}

.verb-card-ar {
  font-family: var(--ar-font);
  font-size: 18px;
  direction: rtl;
  color: var(--teal-deep);
}

.verb-card-ph {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11.5px;
  color: var(--terracotta);
}

.verb-caret {
  color: var(--teal);
  font-size: 14px;
  transition: transform 0.2s;
  flex-shrink: 0;
  margin-left: 8px;
}

.verb-caret-open { transform: rotate(180deg); }

.verb-table {
  border-top: 1.5px solid var(--sand-deep);
  padding: 10px 14px 14px;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.tense-tabs {
  display: flex;
  gap: 6px;
  margin-bottom: 10px;
}

.tense-tab {
  flex: 1;
  border: 1.5px solid var(--sand-deep);
  background: var(--paper);
  color: var(--muted);
  font-size: 12px;
  font-weight: 600;
  padding: 7px 4px;
  border-radius: 10px;
  cursor: pointer;
}

.tense-tab-active {
  background: var(--teal);
  border-color: var(--teal);
  color: var(--paper);
}

.verb-note {
  font-size: 11.5px;
  color: var(--muted);
  font-style: italic;
  line-height: 1.5;
  margin: 2px 0 10px;
}

.verb-row {
  display: grid;
  grid-template-columns: 50px 52px 1fr;
  align-items: center;
  gap: 8px;
  padding: 7px 0;
  border-bottom: 1px solid rgba(228,211,179,0.6);
}

.verb-row:last-child { border-bottom: none; }

.verb-pronoun-stack {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1px;
}

.verb-pronoun {
  font-family: var(--ar-font);
  font-size: 16px;
  direction: rtl;
  color: var(--teal-deep);
  text-align: center;
}

.verb-pronoun-ph {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  color: var(--muted);
}

.verb-pronoun-pl {
  font-size: 11px;
  color: var(--muted);
}

.verb-form-stack {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 1px;
  min-width: 0;
}

.verb-form-ar {
  font-family: var(--ar-font);
  font-size: 17px;
  direction: rtl;
  color: var(--ink);
  text-align: right;
}

.verb-form-ph {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  color: var(--terracotta);
  text-align: right;
  white-space: nowrap;
}

/* ---- Category picker ---- */
.cat-picker {
  max-width: 480px;
  width: 100%;
  margin-bottom: 16px;
}

.cat-jump {
  width: 100%;
  box-sizing: border-box;
  border: 1.5px solid var(--sand-deep);
  background: var(--paper);
  color: var(--ink);
  font-size: 13px;
  font-weight: 600;
  padding: 9px 34px 9px 13px;
  border-radius: 12px;
  margin-bottom: 0;
  cursor: pointer;
  appearance: none;
  -webkit-appearance: none;
  background-image: linear-gradient(45deg, transparent 50%, var(--teal) 50%),
    linear-gradient(135deg, var(--teal) 50%, transparent 50%);
  background-position: calc(100% - 18px) 50%, calc(100% - 13px) 50%;
  background-size: 5px 5px, 5px 5px;
  background-repeat: no-repeat;
}
.cat-jump:focus { outline: none; border-color: var(--teal); }

.cat-picker-scroll {
  display: flex;
  gap: 7px;
  overflow-x: auto;
  padding-bottom: 4px;
  padding-right: 28px;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: thin;
  /* Zanik na prawej krawędzi sygnalizuje, że pasek ma więcej kategorii. */
  -webkit-mask-image: linear-gradient(to right, black calc(100% - 24px), transparent);
  mask-image: linear-gradient(to right, black calc(100% - 24px), transparent);
}

.cat-picker-scroll::-webkit-scrollbar { height: 5px; }
.cat-picker-scroll::-webkit-scrollbar-thumb {
  background: var(--sand-deep);
  border-radius: 4px;
}

.cat-chip {
  flex-shrink: 0;
  border: 1.5px solid var(--sand-deep);
  background: var(--paper);
  color: var(--ink);
  font-size: 12.5px;
  font-weight: 600;
  padding: 8px 13px;
  border-radius: 999px;
  cursor: pointer;
  white-space: nowrap;
  transition: background 0.15s, color 0.15s, border-color 0.15s;
}

.cat-chip-active {
  background: var(--teal);
  border-color: var(--teal);
  color: var(--paper);
}

.cat-select {
  grid-column: 1 / -1;
  font-size: 13px;
  cursor: pointer;
  appearance: none;
  background-image: linear-gradient(45deg, transparent 50%, var(--teal) 50%),
    linear-gradient(135deg, var(--teal) 50%, transparent 50%);
  background-position: calc(100% - 16px) center, calc(100% - 11px) center;
  background-size: 5px 5px, 5px 5px;
  background-repeat: no-repeat;
}

.word-cat-tag {
  font-size: 10.5px;
  font-weight: 700;
  color: var(--teal);
  text-transform: uppercase;
  letter-spacing: 0.3px;
  margin-bottom: 1px;
}

/* ---- Oznaczanie "do poprawki" ---- */
.review-toggle-row {
  position: absolute;
  bottom: 14px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 8px;
  white-space: nowrap;
}
/* Na tyle karty treść bywa długa (przykład, odmiana, rdzeń) — panel oceny
   płynie normalnie na końcu, zamiast nachodzić na treść jako element absolutny. */
.card-back .review-toggle-row {
  position: static;
  transform: none;
  margin-top: 8px;
}

.review-toggle-btn {
  display: flex;
  align-items: center;
  gap: 5px;
  border: 1.5px dashed var(--sand-deep);
  background: transparent;
  color: var(--muted);
  font-size: 11px;
  font-weight: 600;
  padding: 6px 11px;
  border-radius: 999px;
  cursor: pointer;
  white-space: nowrap;
}
.card-back .review-toggle-btn {
  border-color: rgba(251,246,236,0.3);
  color: rgba(251,246,236,0.65);
}
.review-toggle-btn:hover { opacity: 0.8; }

.review-toggle-verify:hover {
  border-color: var(--teal);
  color: var(--teal);
}
.card-back .review-toggle-verify:hover {
  border-color: var(--paper);
  color: var(--paper);
}

.review-toggle-flag:hover {
  border-color: var(--terracotta);
  color: var(--terracotta);
}

.flag-panel {
  position: absolute;
  bottom: 10px;
  left: 12px;
  right: 12px;
  display: flex;
  align-items: center;
  gap: 6px;
}

.flag-panel-active {
  background: rgba(193,87,47,0.12);
  border: 1.5px solid var(--terracotta-soft);
  border-radius: 999px;
  padding: 6px 10px;
}
.card-back .flag-panel-active {
  background: rgba(193,87,47,0.22);
}

.verified-panel-active {
  background: rgba(15,92,92,0.12);
  border: 1.5px solid var(--teal);
  border-radius: 999px;
  padding: 6px 10px;
}
.card-back .verified-panel-active {
  background: rgba(15,92,92,0.30);
  border-color: rgba(251,246,236,0.5);
}

.flag-icon-active { color: var(--terracotta); flex-shrink: 0; }
.verified-icon-active { color: var(--teal); flex-shrink: 0; }
.card-back .verified-icon-active { color: var(--paper); }

.flag-note-text {
  flex: 1;
  font-size: 11.5px;
  color: var(--terracotta);
  text-align: left;
  cursor: pointer;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.card-back .flag-note-text { color: #f4c9b4; }

.verified-text {
  flex: 1;
  font-size: 11.5px;
  font-weight: 700;
  color: var(--teal-deep);
  text-align: left;
}
.card-back .verified-text { color: var(--paper); }

.flag-remove-btn {
  border: none;
  background: none;
  color: var(--terracotta);
  cursor: pointer;
  display: flex;
  flex-shrink: 0;
  padding: 2px;
}

.verified-remove-btn { color: var(--teal); }
.card-back .verified-remove-btn { color: var(--paper); }

.flag-note-input {
  flex: 1;
  border: none;
  background: transparent;
  font-size: 11.5px;
  color: var(--ink);
  outline: none;
  min-width: 0;
}
.card-back .flag-note-input { color: var(--paper); }

.flag-note-save {
  border: none;
  background: var(--terracotta);
  color: var(--paper);
  border-radius: 999px;
  width: 22px;
  height: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  flex-shrink: 0;
}

.cat-chip-review {
  border-color: #c9943a;
  color: #95692a;
}
.cat-chip-review.cat-chip-active {
  background: #c9943a;
  border-color: #c9943a;
  color: var(--paper);
}

.cat-chip-flag {
  border-color: var(--terracotta-soft);
  color: var(--terracotta);
}
.cat-chip-flag.cat-chip-active {
  background: var(--terracotta);
  border-color: var(--terracotta);
  color: var(--paper);
}

.cat-chip-verified {
  border-color: var(--teal);
  color: var(--teal);
}
.cat-chip-verified.cat-chip-active {
  background: var(--teal);
  border-color: var(--teal);
  color: var(--paper);
}

.word-row-flagged {
  border-color: var(--terracotta-soft);
  background: rgba(193,87,47,0.06);
}

.word-row-verified {
  border-color: var(--teal);
  background: rgba(15,92,92,0.05);
}

.word-row-tags {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
  margin-bottom: 1px;
}

.word-flag-tag {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  border: none;
  background: rgba(193,87,47,0.14);
  color: var(--terracotta);
  font-size: 10px;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 999px;
  cursor: pointer;
  max-width: 220px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.word-verified-tag {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  border: none;
  background: rgba(15,92,92,0.14);
  color: var(--teal-deep);
  font-size: 10px;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 999px;
  cursor: pointer;
}

.icon-btn-flag { color: var(--terracotta); border-color: var(--terracotta-soft); }
.icon-btn-verify { color: var(--teal); border-color: var(--teal); }

/* ---- Dodawanie fiszki przez AI ---- */
.add-card-btn {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 5px;
  border: 1.5px solid var(--teal);
  background: var(--teal);
  color: var(--paper);
  font-size: 12px;
  font-weight: 700;
  padding: 9px 13px;
  border-radius: 12px;
  cursor: pointer;
  flex-shrink: 0;
  white-space: nowrap;
  align-self: center;
}
.add-card-btn:hover { opacity: 0.9; }

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(44,36,26,0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  z-index: 50;
}

.modal-card {
  background: var(--paper);
  border-radius: 18px;
  border: 1.5px solid var(--sand-deep);
  width: 100%;
  max-width: 420px;
  max-height: 85vh;
  overflow-y: auto;
  padding: 18px;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.modal-header h2 {
  font-family: Georgia, serif;
  font-size: 18px;
  color: var(--teal-deep);
  margin: 0;
}

.modal-close {
  border: none;
  background: none;
  color: var(--muted);
  cursor: pointer;
  display: flex;
  padding: 4px;
}

.modal-form {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.modal-hint {
  font-size: 12.5px;
  color: var(--ink);
  line-height: 1.5;
  margin: 0;
}

.modal-error {
  font-size: 12px;
  color: var(--terracotta);
  margin: 0;
}

.modal-submit { width: 100%; }

.modal-warning {
  font-size: 11.5px;
  color: var(--terracotta);
  margin: -4px 0 0;
}

.modal-preview-label {
  font-size: 10.5px;
  font-weight: 700;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  color: var(--muted);
}

.modal-preview {
  display: flex;
  flex-direction: column;
  gap: 6px;
  background: var(--sand);
  border: 1.5px solid var(--sand-deep);
  border-radius: 14px;
  padding: 14px;
}

.modal-preview-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 8px;
}

/* ---- Przykład użycia: dodawanie / edycja ręczna ---- */
.new-example-wrap {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.new-example-btn {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  align-self: flex-start;
  border: 1px dashed rgba(251,246,236,0.35);
  background: transparent;
  color: rgba(251,246,236,0.7);
  font-size: 10.5px;
  font-weight: 600;
  padding: 4px 9px;
  border-radius: 999px;
  cursor: pointer;
  margin-top: 4px;
}
.new-example-btn:hover { opacity: 0.85; }
.new-example-btn:disabled { cursor: default; opacity: 0.6; }

.new-example-row {
  margin-top: 2px;
}
.new-example-row .new-example-btn {
  border: 1px dashed var(--sand-deep);
  color: var(--muted);
}

.new-example-card {
  align-self: center;
  margin-top: 6px;
}
.new-example-card .new-example-btn {
  align-self: center;
}

.example-edit-wrap {
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: 100%;
  margin-top: 8px;
  padding-top: 10px;
  border-top: 1px dashed rgba(251,246,236,0.2);
}

.example-edit-input {
  border: 1.5px solid rgba(251,246,236,0.3);
  background: rgba(251,246,236,0.08);
  border-radius: 9px;
  padding: 8px 10px;
  font-size: 12.5px;
  color: var(--paper);
  outline: none;
}
.example-edit-input::placeholder { color: rgba(251,246,236,0.45); }
.example-edit-input-arabic { font-family: var(--ar-font); direction: rtl; font-size: 15px; }
.example-edit-input-mono { font-family: 'JetBrains Mono', monospace; }

.new-example-row .example-edit-wrap {
  border-top: 1px dashed var(--sand-deep);
}
.new-example-row .example-edit-input {
  border-color: var(--sand-deep);
  background: var(--paper);
  color: var(--ink);
}
.new-example-row .example-edit-input::placeholder { color: var(--muted-soft); }

.example-edit-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 2px;
}

.example-edit-save {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  border: none;
  background: var(--teal);
  color: var(--paper);
  font-size: 11.5px;
  font-weight: 700;
  padding: 6px 12px;
  border-radius: 999px;
  cursor: pointer;
}
.example-edit-save:disabled { opacity: 0.5; cursor: default; }

/* ---- Edycja całej fiszki ---- */
.card-edit-btn {
  position: absolute;
  top: 14px;
  right: 14px;
  border: none;
  background: rgba(15,92,92,0.10);
  color: var(--teal-deep);
  width: 28px;
  height: 28px;
  border-radius: 999px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 2;
}
.card-edit-btn:hover { opacity: 0.85; }

.card-edit-btn-dark {
  background: rgba(251,246,236,0.16);
  color: var(--paper);
}

.modal-delete-zone {
  margin-top: 4px;
  display: flex;
  justify-content: center;
}

.modal-delete-confirm {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  font-size: 12.5px;
  color: var(--terracotta);
  background: rgba(193,87,47,0.08);
  border: 1px solid var(--terracotta-soft);
  border-radius: 12px;
  padding: 10px 14px;
  width: 100%;
}

.modal-delete-confirm-actions {
  display: flex;
  gap: 16px;
}

@media (max-width: 340px) {
  .list-toolbar-actions { gap: 10px; }
  .csv-hint { font-size: 11px; }
}

@media (max-width: 480px) {
  .add-form { grid-template-columns: 1fr; }
}

@media (max-width: 380px) {
  .verb-row { grid-template-columns: 40px 44px 1fr; gap: 6px; }
  .verb-form-ph { font-size: 10px; white-space: normal; }
  .verb-pronoun-pl { font-size: 10px; }
  .add-card-btn { font-size: 10.5px; padding: 8px 10px; }
}

/* ---- Oznaczenie rodzaju rzeczownika ---- */
.noun-gender {
  display: inline-block;
  margin-left: 8px;
  font-family: system-ui, sans-serif;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.3px;
  padding: 2px 7px;
  border-radius: 999px;
  vertical-align: middle;
}
.noun-gender-m {
  background: rgba(15,92,92,0.14);
  color: var(--teal-deep);
}
.noun-gender-f {
  background: rgba(193,87,47,0.14);
  color: var(--terracotta);
}

/* ---- Sekcja konstrukcji modalnych ---- */
.modal-section {
  margin-top: 28px;
  padding-top: 20px;
  border-top: 2px dashed var(--sand-deep);
}

.modal-section-title {
  font-family: Georgia, serif;
  font-size: 17px;
  color: var(--teal-deep);
  margin: 0 0 6px;
}

.modal-picker-label {
  font-size: 10.5px;
  font-weight: 700;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  color: var(--muted);
  margin: 12px 0 6px;
}

.modal-chip-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.modal-chip {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  border: 1.5px solid var(--sand-deep);
  background: var(--paper);
  border-radius: 12px;
  padding: 8px 12px;
  cursor: pointer;
  min-width: 64px;
}
.modal-chip:hover { border-color: var(--teal); }

.modal-chip-active {
  border-color: var(--teal);
  background: var(--teal);
}
.modal-chip-active .modal-chip-ar,
.modal-chip-active .modal-chip-pl { color: var(--paper); }

.modal-chip-ar {
  font-family: var(--ar-font);
  direction: rtl;
  font-size: 17px;
  color: var(--ink);
  line-height: 1.2;
}

.modal-chip-pl {
  font-size: 11px;
  color: var(--ink);
}

.modal-result-card {
  margin-top: 14px;
}

/* ---- Przełącznik trudności quizu ---- */
.quiz-diff-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 14px;
  flex-wrap: wrap;
}

.quiz-diff-toggle {
  display: inline-flex;
  background: var(--sand);
  border: 1.5px solid var(--sand-deep);
  border-radius: 999px;
  padding: 3px;
  gap: 2px;
}

.quiz-diff-btn {
  border: none;
  background: transparent;
  border-radius: 999px;
  padding: 6px 16px;
  font-size: 13px;
  font-weight: 600;
  color: var(--muted);
  cursor: pointer;
}

.quiz-diff-active {
  background: var(--teal);
  color: var(--paper);
}

.quiz-diff-hint {
  font-size: 11px;
  color: var(--muted);
  font-style: italic;
}

/* ---- Wybór długości quizu ---- */
.quiz-len-row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 16px;
  flex-wrap: wrap;
}

.quiz-len-label {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.4px;
  text-transform: uppercase;
  color: var(--muted);
}

.quiz-len-toggle {
  display: inline-flex;
  background: var(--sand);
  border: 1.5px solid var(--sand-deep);
  border-radius: 999px;
  padding: 3px;
  gap: 2px;
}

.quiz-len-btn {
  border: none;
  background: transparent;
  border-radius: 999px;
  padding: 5px 13px;
  font-size: 12.5px;
  font-weight: 600;
  color: var(--muted);
  cursor: pointer;
}

.quiz-len-active {
  background: var(--terracotta);
  color: var(--paper);
}

/* ---- Panel postępu (przerobiony materiał) ---- */
.progress-panel {
  max-width: 680px;
  margin: 0 auto;
  padding: 12px 20px 4px;
}

.progress-panel-head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
  margin-bottom: 6px;
}

.progress-panel-label {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  color: var(--muted);
}

.progress-panel-count {
  font-size: 13px;
  font-weight: 600;
  color: var(--teal-deep);
}

.progress-bar-track {
  position: relative;
  height: 10px;
  border-radius: 999px;
  background: var(--sand-deep);
  overflow: hidden;
}

.progress-bar-practiced {
  position: absolute;
  inset: 0 auto 0 0;
  height: 100%;
  background: var(--teal);
  border-radius: 999px;
  transition: width 0.4s ease;
}

.progress-bar-mastered {
  position: absolute;
  inset: 0 auto 0 0;
  height: 100%;
  background: var(--terracotta);
  border-radius: 999px;
  transition: width 0.4s ease;
}

.progress-panel-legend {
  display: flex;
  gap: 16px;
  margin-top: 6px;
}

.legend-item {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 11px;
  color: var(--muted);
}

.legend-dot {
  width: 9px;
  height: 9px;
  border-radius: 50%;
  display: inline-block;
}
.legend-dot-practiced { background: var(--teal); }
.legend-dot-mastered { background: var(--terracotta); }

/* ---- Zaimki pytające ---- */
.qw-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.qw-card {
  background: var(--paper);
  border: 1.5px solid var(--sand-deep);
  border-radius: 16px;
  padding: 14px 16px;
}

.qw-head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
}

.qw-main {
  display: flex;
  align-items: baseline;
  gap: 10px;
}

.qw-ar {
  font-family: var(--ar-font);
  direction: rtl;
  font-size: 26px;
  color: var(--ink);
  line-height: 1.1;
}

.qw-ph {
  font-size: 14px;
  color: var(--terracotta);
  font-weight: 600;
}

.qw-pl {
  font-size: 15px;
  color: var(--teal-deep);
  font-weight: 600;
  text-align: right;
}

.qw-note {
  margin: 10px 0 0;
}

.qw-example {
  margin-top: 12px;
  padding-top: 10px;
  border-top: 1px dashed var(--sand-deep);
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.qw-ex-ar {
  font-family: var(--ar-font);
  direction: rtl;
  font-size: 18px;
  color: var(--ink);
}

.qw-ex-ph {
  font-size: 13px;
  color: var(--terracotta);
}

.qw-ex-pl {
  font-size: 13px;
  color: var(--ink);
  font-style: italic;
}

/* ---- Gramatyka ---- */
.grammar-tabs {
  margin-bottom: 16px;
  flex-wrap: wrap;
}
.grammar-tabs .tense-tab {
  flex: 0 0 auto;
  padding: 7px 14px;
}

.num-grid {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: 1fr;
  gap: 10px;
}

.num-card {
  background: var(--paper);
  border: 1.5px solid var(--sand-deep);
  border-radius: 14px;
  padding: 12px 15px;
}

.num-head {
  display: flex;
  align-items: center;
  gap: 14px;
}

.num-digit {
  flex-shrink: 0;
  width: 34px;
  height: 34px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--teal);
  color: var(--paper);
  border-radius: 50%;
  font-size: 15px;
  font-weight: 700;
}

.num-forms {
  display: flex;
  align-items: baseline;
  gap: 10px;
}

.num-ar {
  font-family: var(--ar-font);
  direction: rtl;
  font-size: 24px;
  color: var(--ink);
}

.num-ph {
  font-size: 14px;
  color: var(--terracotta);
  font-weight: 600;
}

.num-note {
  margin: 8px 0 0;
}

/* ---- Kompozytor: liczba + rzeczownik ---- */
.count-composer {
  margin-top: 4px;
  margin-bottom: 22px;
  padding-top: 0;
  border-top: none;
}

.count-chip {
  min-width: 42px;
  padding: 8px 6px;
}

.count-chip-num {
  font-size: 15px;
  font-weight: 700;
  color: var(--ink);
}

.modal-chip-active .count-chip-num {
  color: var(--paper);
}

.count-result {
  margin-top: 14px;
  background: var(--paper);
  border: 1.5px solid var(--teal);
  border-radius: 16px;
  padding: 16px 18px;
}

.count-result-main {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
}

.count-result-ar {
  font-family: var(--ar-font);
  direction: rtl;
  font-size: 30px;
  color: var(--ink);
  line-height: 1.2;
}

.count-result-ph {
  font-size: 17px;
  color: var(--terracotta);
  font-weight: 700;
}

.count-result-rule {
  margin: 12px 0 0;
}

/* ---- Wyszukiwarka i filtr statusu ---- */
.search-bar {
  position: relative;
  margin: 16px 0 10px;
}

.search-input {
  width: 100%;
  box-sizing: border-box;
  border: 1.5px solid var(--sand-deep);
  border-radius: 12px;
  background: var(--paper);
  padding: 11px 40px 11px 14px;
  font-size: 14px;
  color: var(--ink);
  outline: none;
}
.search-input:focus { border-color: var(--teal); }
.search-input::placeholder { color: var(--muted-soft); }

.search-clear {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  border: none;
  background: var(--sand);
  border-radius: 50%;
  width: 26px;
  height: 26px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--muted);
  cursor: pointer;
}

.status-filter-row {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
  margin-bottom: 14px;
}

.status-filter-btn {
  border: 1.5px solid var(--sand-deep);
  background: var(--paper);
  border-radius: 999px;
  padding: 5px 12px;
  font-size: 12px;
  font-weight: 600;
  color: var(--muted);
  cursor: pointer;
}
.status-filter-btn:hover { border-color: var(--teal); }

.status-filter-active {
  background: var(--teal);
  border-color: var(--teal);
  color: var(--paper);
}

.status-filter-count {
  margin-left: auto;
  font-size: 11.5px;
  color: var(--muted);
  font-style: italic;
}

/* ---- Układanka zdań ---- */
.sentence-prompt {
  font-size: 22px;
}

.sentence-strip {
  min-height: 66px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  padding: 12px;
  margin: 16px 0 14px;
  border: 2px dashed var(--sand-deep);
  border-radius: 14px;
  background: var(--paper);
  transition: border-color 0.2s ease;
  /* Arabski czyta się od prawej do lewej — pierwszy dołożony kafelek
     ląduje po prawej, kolejne układają się w lewo. */
  direction: rtl;
}

/* Podpowiedź (polski tekst) wraca do normalnego kierunku. */
.sentence-strip-hint {
  direction: ltr;
}

.sentence-strip-correct {
  border-style: solid;
  border-color: var(--teal);
  background: rgba(15, 92, 92, 0.06);
}

.sentence-strip-wrong {
  border-style: solid;
  border-color: #c0392b;
  background: rgba(192, 57, 43, 0.05);
}

.sentence-strip-hint {
  font-size: 12.5px;
  color: var(--muted-soft);
  font-style: italic;
  padding-left: 4px;
}

.sentence-pool {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: center;
}

.sentence-tile {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  border: 1.5px solid var(--sand-deep);
  background: var(--paper);
  border-radius: 12px;
  padding: 8px 13px;
  cursor: pointer;
}
.sentence-tile:hover { border-color: var(--teal); }

.sentence-tile-ar {
  font-family: var(--ar-font);
  direction: rtl;
  font-size: 19px;
  color: var(--ink);
  line-height: 1.15;
}

.sentence-tile-ph {
  font-size: 11px;
  color: var(--terracotta);
  font-weight: 600;
  direction: ltr;
}

.sentence-tile-placed {
  border-color: var(--teal);
  background: rgba(15, 92, 92, 0.07);
}

.sentence-tile-used {
  opacity: 0.25;
  pointer-events: none;
}

.sentence-solution {
  margin-top: 16px;
  padding: 14px 16px;
  border: 1.5px solid var(--teal);
  border-radius: 14px;
  background: var(--paper);
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.sentence-solution-ar {
  font-family: var(--ar-font);
  direction: rtl;
  font-size: 24px;
  color: var(--ink);
  line-height: 1.4;
}

.sentence-solution-ph {
  font-size: 14px;
  color: var(--terracotta);
  font-weight: 600;
}

.sentence-note {
  margin: 8px 0 0;
}

.sentence-wrong-hint {
  margin: 12px 0 0;
  font-size: 12.5px;
  color: #c0392b;
  text-align: center;
}

/* ---- Negacja ---- */
.neg-test-row {
  margin-bottom: 14px;
}

.neg-head {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}

.neg-rule {
  flex-shrink: 0;
  font-size: 10.5px;
  font-weight: 700;
  letter-spacing: 0.4px;
  padding: 3px 9px;
  border-radius: 999px;
}
.neg-rule-mash {
  background: rgba(15, 92, 92, 0.14);
  color: var(--teal-deep);
}
.neg-rule-mish {
  background: rgba(193, 87, 47, 0.14);
  color: var(--terracotta);
}

.neg-pl {
  font-size: 13px;
  color: var(--ink);
}

.neg-pair {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.neg-line {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 10px;
}

.neg-line-neg .qw-ex-ar,
.neg-line-neg .qw-ex-ph {
  font-weight: 700;
}

.neg-arrow {
  color: var(--muted-soft);
  font-size: 13px;
  padding-left: 2px;
}

.neg-reveal-btn {
  border: 1.5px dashed var(--sand-deep);
  background: var(--sand);
  border-radius: 10px;
  padding: 10px;
  font-size: 12px;
  color: var(--muted);
  cursor: pointer;
  width: 100%;
}
.neg-reveal-btn:hover { border-color: var(--teal); }

/* ---- Mini-dialogi ---- */
.dlg-picker {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 14px;
}

.dlg-tab {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  border: 1.5px solid var(--sand-deep);
  background: var(--paper);
  border-radius: 999px;
  padding: 6px 12px;
  font-size: 12px;
  font-weight: 600;
  color: var(--muted);
  cursor: pointer;
}
.dlg-tab:hover { border-color: var(--teal); }
.dlg-tab-active {
  background: var(--teal);
  border-color: var(--teal);
  color: var(--paper);
}
.dlg-tab-emoji { font-size: 14px; }

.dlg-card {
  background: var(--paper);
  border: 1.5px solid var(--sand-deep);
  border-radius: 16px;
  padding: 16px;
}

.dlg-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  flex-wrap: wrap;
  margin-bottom: 4px;
}

.dlg-title {
  font-family: Georgia, serif;
  font-size: 16px;
  color: var(--teal-deep);
  font-weight: 700;
}

.dlg-context {
  font-size: 12.5px;
  color: var(--muted);
  font-style: italic;
  margin: 0 0 14px;
}

.dlg-thread {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.dlg-bubble {
  max-width: 82%;
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 10px 13px;
  border-radius: 16px;
  position: relative;
}

/* Przycisk edycji przy linii dialogu/czytanki */
.line-edit-btn {
  position: absolute;
  top: 6px;
  right: 6px;
  border: none;
  background: rgba(0,0,0,0.06);
  color: var(--muted);
  border-radius: 6px;
  padding: 3px;
  display: flex;
  cursor: pointer;
  opacity: 0.5;
  transition: opacity 0.15s;
}
.line-edit-btn:hover { opacity: 1; }
.reading-sentence { position: relative; }
.reading-sentence .line-edit-btn { top: 0; right: 0; }

/* Edytor linii */
.line-editor {
  display: flex;
  flex-direction: column;
  gap: 7px;
  width: 100%;
}
.line-editor .text-input {
  font-size: 14px;
  padding: 8px 10px;
}
.line-editor-btns {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
}
.line-editor-cancel,
.line-editor-save {
  border: none;
  border-radius: 8px;
  padding: 7px 16px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
}
.line-editor-cancel { background: var(--sand-deep); color: var(--ink); }
.line-editor-save { background: var(--teal); color: #fff; }

.dlg-bubble-a {
  align-self: flex-start;
  background: var(--sand);
  border-bottom-left-radius: 5px;
}

.dlg-bubble-b {
  align-self: flex-end;
  background: rgba(15, 92, 92, 0.10);
  border-bottom-right-radius: 5px;
  text-align: right;
}

.dlg-ar {
  font-family: var(--ar-font);
  direction: rtl;
  font-size: 20px;
  color: var(--ink);
  line-height: 1.35;
}

.dlg-ph {
  font-size: 12.5px;
  color: var(--terracotta);
  font-weight: 600;
}

.dlg-pl {
  font-size: 12.5px;
  color: var(--ink);
}

/* ---- Stopniowanie ---- */
.compar-row {
  display: flex;
  align-items: stretch;
  gap: 6px;
}
.compar-cell {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1px;
  text-align: center;
}
.compar-label {
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.3px;
  text-transform: uppercase;
  color: var(--muted-soft);
}
.compar-ar {
  font-family: var(--ar-font);
  direction: rtl;
  font-size: 21px;
  color: var(--ink);
}
.compar-ph {
  font-size: 12px;
  color: var(--terracotta);
  font-weight: 600;
}
.compar-pl {
  font-size: 11px;
  color: var(--ink);
}
.compar-arrow {
  align-self: center;
  color: var(--muted-soft);
  font-size: 13px;
}

/* ---- Liczebniki 11–100 ---- */
.num-digit-wide {
  width: auto;
  min-width: 34px;
  padding: 0 8px;
  border-radius: 16px;
}

/* ---- Rozkaźnik ---- */
.imper-verb {
  font-size: 15px;
}
.imper-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 6px;
  margin-top: 8px;
}
.imper-cell {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1px;
  padding: 8px 4px;
  background: var(--sand);
  border-radius: 10px;
  text-align: center;
}
.imper-cell-neg {
  background: rgba(192, 57, 43, 0.08);
}
.imper-label {
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.2px;
  text-transform: uppercase;
  color: var(--muted-soft);
}
.imper-cell-neg .imper-label {
  color: #c0392b;
}
.imper-ar {
  font-family: var(--ar-font);
  direction: rtl;
  font-size: 18px;
  color: var(--ink);
  line-height: 1.2;
}
.imper-ph {
  font-size: 10.5px;
  color: var(--terracotta);
  font-weight: 600;
}

/* ---- Uzupełnianie luki ---- */
.gap-pl {
  font-size: 19px;
}
.gap-sentence {
  direction: rtl;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  align-items: center;
  justify-content: center;
  background: var(--paper);
  border: 1.5px solid var(--sand-deep);
  border-radius: 14px;
  padding: 20px 16px;
  margin: 4px 0 16px;
}
.gap-word {
  font-family: var(--ar-font);
  font-size: 26px;
  color: var(--ink);
}
.gap-slot {
  font-family: var(--ar-font);
  font-size: 26px;
  color: var(--terracotta);
  min-width: 60px;
  text-align: center;
  border-bottom: 2px solid var(--terracotta);
  padding: 0 6px;
}
.gap-slot-filled { border-bottom-color: var(--teal); }
.gap-slot-ar { color: var(--teal-deep); font-weight: 700; }
.gap-solution {
  margin: 4px 0 14px;
  padding: 12px 16px;
  border: 1.5px solid var(--teal);
  border-radius: 14px;
  background: var(--paper);
}
.gap-solution-ph {
  font-size: 15px;
  color: var(--terracotta);
  font-weight: 600;
  direction: ltr;
}
.gap-note { margin: 8px 0 0; }

/* ---- Statystyki ---- */
.stats-hero {
  display: flex;
  justify-content: center;
  margin: 8px 0 20px;
}
.stats-streak {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}
.stats-streak-num {
  font-size: 56px;
  font-weight: 800;
  color: var(--teal-deep);
  line-height: 1;
}
.stats-streak-fire { font-size: 24px; margin-top: -4px; }
.stats-streak-label {
  font-size: 13px;
  color: var(--muted);
  margin-top: 4px;
}
.stats-cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  margin-bottom: 24px;
}
.stats-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  background: var(--paper);
  border: 1.5px solid var(--sand-deep);
  border-radius: 14px;
  padding: 14px 8px;
}
.stats-card-num {
  font-size: 24px;
  font-weight: 700;
  color: var(--terracotta);
}
.stats-card-label {
  font-size: 10.5px;
  color: var(--muted);
  text-align: center;
}
.stats-h {
  font-size: 15px;
  margin: 0 0 12px;
}
.stats-heatmap {
  display: flex;
  gap: 5px;
  justify-content: space-between;
  margin-bottom: 26px;
}
.stats-day {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  flex: 1;
}
.stats-cell {
  width: 100%;
  aspect-ratio: 1;
  border-radius: 5px;
  background: var(--sand-deep);
}
.stats-cell-0 { background: var(--sand-deep); }
.stats-cell-1 { background: rgba(15, 92, 92, 0.35); }
.stats-cell-2 { background: rgba(15, 92, 92, 0.65); }
.stats-cell-3 { background: var(--teal); }
.stats-dow {
  font-size: 9px;
  color: var(--muted-soft);
}
.stats-cat-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.stats-cat-head {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 5px;
}
.stats-cat-label { font-size: 13px; color: var(--ink); }
.stats-cat-count { font-size: 12px; color: var(--muted); font-weight: 600; }
.stats-cat-track {
  height: 8px;
  border-radius: 999px;
  background: var(--sand-deep);
  overflow: hidden;
}
.stats-cat-fill {
  height: 100%;
  background: var(--teal);
  border-radius: 999px;
  transition: width 0.4s ease;
}

/* ---- Dopasowywanie par ---- */
.match-intro { margin-bottom: 16px; }
.match-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}
.match-col {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.match-tile {
  min-height: 52px;
  border: 1.5px solid var(--sand-deep);
  background: var(--paper);
  border-radius: 14px;
  padding: 10px 12px;
  font-size: 15px;
  color: var(--ink);
  cursor: pointer;
  transition: all 0.15s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
}
.match-tile-ar {
  font-family: var(--ar-font);
  direction: rtl;
  font-size: 21px;
}
.match-tile:hover { border-color: var(--teal); }
.match-tile-sel {
  border-color: var(--teal);
  background: var(--teal);
  color: var(--paper);
}
.match-tile-wrong {
  border-color: #c0392b;
  background: rgba(192, 57, 43, 0.12);
  color: #c0392b;
  animation: shake 0.3s;
}
.match-tile-done {
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.3s ease;
}
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-4px); }
  75% { transform: translateX(4px); }
}
.match-reshuffle {
  margin-top: 18px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

/* ---- Kopia zapasowa ---- */
.stats-backup-h { margin-top: 28px; }
.storage-diag {
  font-size: 12px;
  color: var(--teal-deep);
  background: rgba(29,92,82,0.06);
  padding: 8px 12px;
  border-radius: 8px;
  margin: 0 0 12px;
  font-family: 'JetBrains Mono', monospace;
}
.storage-warning {
  background: rgba(192,57,43,0.08);
  border: 1px solid rgba(192,57,43,0.3);
  border-radius: 10px;
  padding: 12px 14px;
  font-size: 12.5px;
  color: #a03325;
  line-height: 1.5;
  margin: 0 0 12px;
}
.stats-backup-note {
  font-size: 12.5px;
  color: var(--muted);
  line-height: 1.5;
  margin: 0 0 14px;
}
.stats-backup-row {
  display: flex;
  gap: 10px;
}
.stats-backup-btn {
  flex: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  cursor: pointer;
}
.stats-backup-import {
  border: 1.5px solid var(--sand-deep);
  background: var(--paper);
  color: var(--ink);
}
.stats-backup-import:hover { border-color: var(--teal); }

/* ---- Modal kopii zapasowej ---- */
.backup-modal { max-width: 440px; }
.modal-title {
  font-family: Georgia, serif;
  font-size: 18px;
  color: var(--teal-deep);
  margin: 0 0 10px;
}
.backup-modal-note {
  font-size: 12.5px;
  color: var(--ink);
  line-height: 1.5;
  margin: 0 0 12px;
}
.backup-textarea {
  width: 100%;
  box-sizing: border-box;
  height: 120px;
  font-family: monospace;
  font-size: 11px;
  border: 1.5px solid var(--sand-deep);
  border-radius: 10px;
  padding: 10px;
  background: var(--sand);
  color: var(--ink);
  resize: vertical;
  -webkit-user-select: all;
  user-select: all;
}
.backup-modal-actions {
  display: flex;
  gap: 10px;
  margin-top: 14px;
}
.backup-modal-actions .nav-btn { flex: 1; }
.stats-backup-row2 { margin-top: 10px; }
.stats-backup-file { flex: 1; }

/* ---- Przełącznik kolejności fiszek ---- */
.flash-sort {
  display: flex;
  gap: 4px;
}
.flash-sort-btn {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  border: 1.5px solid var(--sand-deep);
  background: var(--paper);
  color: var(--muted);
  font-size: 11px;
  font-weight: 600;
  padding: 5px 9px;
  border-radius: 999px;
  cursor: pointer;
}
.flash-sort-btn:hover { border-color: var(--teal); }
.flash-sort-active {
  background: var(--teal);
  border-color: var(--teal);
  color: var(--paper);
}

/* ---- Znaczniki samooceny (wiem / nie wiem / do powtórki) ---- */
.known-tags {
  display: flex;
  gap: 6px;
  margin-top: 12px;
  flex-wrap: wrap;
  justify-content: center;
}
.known-tag {
  border: 1.5px solid var(--sand-deep);
  background: var(--paper);
  color: var(--muted);
  font-size: 11.5px;
  font-weight: 600;
  padding: 5px 11px;
  border-radius: 999px;
  cursor: pointer;
  transition: all 0.15s ease;
}
.known-tag:hover { border-color: var(--muted-soft); }
.known-tag-known.known-tag-active {
  background: #2e7d52;
  border-color: #2e7d52;
  color: #fff;
}
.known-tag-unknown.known-tag-active {
  background: #c0392b;
  border-color: #c0392b;
  color: #fff;
}
.known-tag-review.known-tag-active {
  background: #d98a2b;
  border-color: #d98a2b;
  color: #fff;
}

/* Plakietka na froncie fiszki */
.known-badge {
  position: absolute;
  top: 12px;
  left: 12px;
  font-size: 10px;
  font-weight: 700;
  padding: 3px 9px;
  border-radius: 999px;
  letter-spacing: 0.2px;
}
.known-badge-known { background: rgba(46,125,82,0.15); color: #2e7d52; }
.known-badge-unknown { background: rgba(192,57,43,0.15); color: #c0392b; }
.known-badge-review { background: rgba(217,138,43,0.15); color: #b5701a; }

/* ---- Ustawienia wyglądu ---- */
.settings-btn {
  border: 1.5px solid var(--sand-deep);
  background: var(--paper);
  color: var(--teal);
  width: 40px;
  height: 40px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  flex-shrink: 0;
  margin-left: auto;
}
.settings-btn:hover { border-color: var(--teal); }
.settings-modal { max-width: 400px; }
.settings-group-label {
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-weight: 700;
  color: var(--muted-soft);
  margin: 18px 0 10px;
}
.settings-langs { display: flex; gap: 8px; margin-bottom: 4px; }
.lang-btn {
  flex: 1; display: flex; align-items: center; justify-content: center; gap: 7px;
  border: 1.5px solid var(--sand-deep); background: var(--paper);
  border-radius: 12px; padding: 11px; cursor: pointer;
  font-size: 13.5px; font-weight: 600; color: var(--muted);
}
.lang-btn-active { border-color: var(--teal); border-width: 2px; color: var(--teal-deep); background: rgba(29,92,82,0.06); }
.lang-flag { font-size: 18px; }

.settings-themes { display: flex; flex-direction: column; gap: 8px; }
.theme-swatch {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  border: 1.5px solid var(--sand-deep);
  background: var(--paper);
  border-radius: 12px;
  cursor: pointer;
  text-align: left;
}
.theme-swatch:hover { border-color: var(--teal); }
.theme-swatch-active { border-color: var(--teal); border-width: 2px; }
.theme-dots { display: flex; gap: 4px; flex-shrink: 0; }
.theme-dots span { width: 18px; height: 18px; border-radius: 50%; display: block; }
.theme-name { font-size: 13.5px; font-weight: 600; color: var(--ink); flex: 1; }
.theme-check { color: var(--teal); flex-shrink: 0; }
.settings-fonts { display: flex; flex-direction: column; gap: 8px; }
.font-choice {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 12px;
  border: 1.5px solid var(--sand-deep);
  background: var(--paper);
  border-radius: 12px;
  cursor: pointer;
  text-align: left;
}
.font-choice:hover { border-color: var(--teal); }
.font-choice-active { border-color: var(--teal); border-width: 2px; }
.font-choice-sample {
  font-size: 26px;
  direction: rtl;
  color: var(--teal-deep);
  width: 48px;
  text-align: center;
  flex-shrink: 0;
}
.font-choice-name { font-size: 13px; font-weight: 600; color: var(--ink); flex: 1; }
.settings-actions {
  display: flex;
  gap: 10px;
  margin-top: 20px;
}
.settings-actions .nav-btn { flex: 1; }

/* ---- Pisanie (układanie z liter) ---- */
.view-write { display: flex; flex-direction: column; }
.write-intro { margin-bottom: 16px; }
.write-prompt {
  text-align: center;
  margin-bottom: 18px;
}
.write-pl {
  display: block;
  font-family: Georgia, serif;
  font-size: 22px;
  color: var(--teal-deep);
  font-weight: 700;
}
.write-ph {
  display: block;
  font-size: 14px;
  color: var(--terracotta);
  font-weight: 600;
  margin-top: 3px;
}
.write-answer {
  min-height: 74px;
  border: 2px dashed var(--sand-deep);
  border-radius: 16px;
  background: var(--paper);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px 18px;
  margin-bottom: 20px;
  cursor: pointer;
  transition: border-color 0.2s, background 0.2s;
}
.write-answer-text {
  font-family: var(--ar-font);
  font-size: 40px;
  direction: rtl;
  color: var(--ink);
  line-height: 1.3;
}
.write-placeholder {
  color: var(--muted-soft);
  font-size: 14px;
}
.write-answer-ok { border-color: #2e7d52; border-style: solid; background: rgba(46,125,82,0.06); }
.write-answer-bad { border-color: #c0392b; border-style: solid; background: rgba(192,57,43,0.06); }
.write-answer-reveal { border-color: var(--terracotta); border-style: solid; }
.write-tiles {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: center;
  direction: rtl;
  margin-bottom: 18px;
}
.write-tile {
  min-width: 54px;
  height: 60px;
  border: 1.5px solid var(--sand-deep);
  background: var(--paper);
  border-radius: 12px;
  font-family: var(--ar-font);
  font-size: 32px;
  color: var(--teal-deep);
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(26,36,32,0.06);
  transition: all 0.15s ease;
}
.write-tile:hover:not(:disabled) { border-color: var(--teal); transform: translateY(-2px); }
.write-tile-used {
  opacity: 0.25;
  pointer-events: none;
}
.write-feedback {
  text-align: center;
  font-size: 14px;
  margin-bottom: 16px;
  font-weight: 600;
}
.write-fb-ok { color: #2e7d52; }
.write-fb-bad { color: #c0392b; }
.write-fb-reveal { color: var(--terracotta); }
.write-fb-word {
  font-family: var(--ar-font);
  font-size: 24px;
  direction: rtl;
  margin-right: 6px;
  vertical-align: middle;
}
.write-actions {
  display: flex;
  gap: 8px;
}
.write-actions .nav-btn { flex: 1; }

/* ---- Lekcje ---- */
.view-lessons { display: flex; flex-direction: column; }
.lesson-list { display: flex; flex-direction: column; gap: 10px; margin-top: 8px; }
.lesson-card {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 16px;
  border: 1.5px solid var(--sand-deep);
  background: var(--paper);
  border-radius: 16px;
  cursor: pointer;
  text-align: left;
  transition: all 0.15s ease;
}
.lesson-card:hover { border-color: var(--teal); transform: translateY(-1px); box-shadow: 0 4px 14px rgba(26,36,32,0.07); }
.lesson-emoji { font-size: 28px; flex-shrink: 0; }
.lesson-info { display: flex; flex-direction: column; flex: 1; }
.lesson-title { font-family: Georgia, serif; font-size: 16px; font-weight: 700; color: var(--teal-deep); }
.lesson-meta { font-size: 12px; color: var(--muted); margin-top: 2px; }
.lesson-arrow { color: var(--teal); font-size: 18px; }
.lesson-back {
  align-self: flex-start;
  border: none;
  background: transparent;
  color: var(--teal);
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  padding: 4px 0;
  margin-bottom: 12px;
}
.lesson-head { text-align: center; margin-bottom: 18px; }
.lesson-head-emoji { font-size: 36px; }
.lesson-head-title { font-family: Georgia, serif; font-size: 22px; color: var(--teal-deep); margin: 6px 0 4px; }
.lesson-head-context { font-size: 13px; color: var(--muted); margin: 0; }
.lesson-dialogue {
  border: 1.5px solid var(--sand-deep);
  border-radius: 16px;
  padding: 14px;
  background: var(--paper);
  margin-bottom: 24px;
}
.lesson-dialogue-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}
.lesson-dialogue-label {
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-weight: 700;
  color: var(--muted-soft);
}
.lesson-hide-btn {
  border: none;
  background: transparent;
  color: var(--teal);
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
}
.lesson-section-title {
  font-family: Georgia, serif;
  font-size: 16px;
  color: var(--teal-deep);
  margin: 0 0 12px;
}
.lesson-tiles {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}
.lesson-tile {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  padding: 16px 8px;
  border: 1.5px solid var(--sand-deep);
  background: var(--paper);
  border-radius: 14px;
  cursor: pointer;
  transition: all 0.15s ease;
}
.lesson-tile:hover:not(:disabled) { border-color: var(--teal); transform: translateY(-2px); }
.lesson-tile-emoji { font-size: 24px; }
.lesson-tile-label { font-size: 13px; font-weight: 600; color: var(--ink); }
.lesson-tile-count { font-size: 11px; color: var(--terracotta); font-weight: 600; }
.lesson-tile-disabled { opacity: 0.4; cursor: not-allowed; }
.lesson-tile-disabled .lesson-tile-count { color: var(--muted-soft); }

/* ---- Zdania w lekcji ---- */
.sentence-answer-line {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  direction: rtl;
  justify-content: flex-start;
  align-items: center;
}
.sentence-slot {
  font-family: var(--ar-font);
  font-size: 26px;
  color: var(--ink);
  background: rgba(29,92,82,0.08);
  padding: 4px 12px;
  border-radius: 8px;
  line-height: 1.4;
}
.sentence-answer {
  min-height: 70px;
  border: 2px dashed var(--sand-deep);
  border-radius: 14px;
  padding: 14px;
  margin: 14px 0 18px;
  cursor: pointer;
  display: flex;
  align-items: center;
}
.sentence-placeholder { color: var(--muted-soft); font-size: 13px; }
.sentence-bank {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: center;
  margin-bottom: 16px;
}
.sentence-tile {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  border: 1.5px solid var(--sand-deep);
  background: var(--paper);
  border-radius: 12px;
  padding: 8px 14px;
  cursor: pointer;
  transition: all 0.15s ease;
}
.sentence-tile:hover:not(:disabled) { border-color: var(--teal); transform: translateY(-2px); }
.sentence-tile-used { opacity: 0.25; pointer-events: none; }
.sentence-tile .st-ar { font-family: var(--ar-font); font-size: 22px; color: var(--teal-deep); direction: rtl; }
.sentence-tile .st-ph { font-size: 11px; color: var(--terracotta); font-weight: 600; }
.sentence-pl { font-size: 17px; font-weight: 600; color: var(--ink); text-align: center; margin: 6px 0; }
.sentence-fb { text-align: center; font-size: 15px; font-weight: 600; margin-bottom: 12px; }
.sentence-fb-ok { color: #2e7d52; }
.sentence-fb-reveal { color: var(--terracotta); }
.sentence-note {
  font-size: 12.5px; color: var(--muted); text-align: center;
  background: rgba(0,0,0,0.03); padding: 8px 12px; border-radius: 8px; margin-bottom: 12px;
}
.sentence-actions { display: flex; gap: 8px; }
.sentence-actions .nav-btn { flex: 1; }

/* ---- Przełączniki ukrywania w dialogu ---- */
.dlg-toggles { display: flex; gap: 6px; flex-wrap: wrap; justify-content: flex-end; }

/* ---- Czytanki ---- */
/* ---- Ekran „Na dziś" (SRS + grywalizacja) ---- */
.view-today { display: flex; flex-direction: column; gap: 14px; }
.today-card {
  border: 1.5px solid var(--sand-deep);
  background: var(--paper);
  border-radius: 16px;
  padding: 18px;
}
.today-goal-head { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 10px; }
.today-goal-label { font-size: 11px; text-transform: uppercase; letter-spacing: 1px; font-weight: 700; color: var(--muted-soft); }
.today-goal-count { font-family: Georgia, serif; font-size: 24px; font-weight: 700; color: var(--teal-deep); }
.today-goal-met { color: #2e7d52; }
.today-bar { height: 10px; background: var(--sand-deep); border-radius: 999px; overflow: hidden; }
.today-bar-fill { height: 100%; background: var(--teal); border-radius: 999px; transition: width 0.4s ease; }
.today-bar-done { background: #2e7d52; }
.today-goal-msg { font-size: 12.5px; color: var(--muted); margin: 8px 0 0; }
.today-goal-picker { display: flex; align-items: center; gap: 6px; margin-top: 12px; flex-wrap: wrap; }
.today-goal-picker-label { font-size: 11px; color: var(--muted-soft); }
.today-goal-btn {
  border: 1.5px solid var(--sand-deep); background: transparent;
  color: var(--muted); border-radius: 999px; padding: 4px 12px;
  font-size: 12px; font-weight: 600; cursor: pointer;
}
.today-goal-btn-active { border-color: var(--teal); color: var(--teal-deep); background: rgba(29,92,82,0.08); }
.today-streak {
  display: flex; align-items: center; justify-content: center; gap: 8px;
  padding: 14px; background: rgba(217,138,43,0.10);
  border: 1.5px solid rgba(217,138,43,0.25); border-radius: 16px;
}
.today-streak-flame { font-size: 22px; }
.today-streak-num { font-family: Georgia, serif; font-size: 28px; font-weight: 700; color: var(--terracotta); }
.today-streak-label { font-size: 13px; color: var(--muted); }
.today-row-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px; }
.today-row-title { font-family: Georgia, serif; font-size: 16px; font-weight: 700; color: var(--teal-deep); }
.today-row-num { font-family: Georgia, serif; font-size: 22px; font-weight: 700; color: var(--terracotta); }
.today-row-desc { font-size: 12.5px; color: var(--muted); line-height: 1.5; margin: 0 0 12px; }
.today-start { width: 100%; }
.today-summary { display: flex; gap: 10px; }
.today-sum-item {
  flex: 1; display: flex; flex-direction: column; align-items: center; gap: 2px;
  padding: 14px 8px; border: 1.5px solid var(--sand-deep);
  background: var(--paper); border-radius: 14px;
}
.today-sum-num { font-family: Georgia, serif; font-size: 22px; font-weight: 700; color: var(--teal-deep); }
.today-sum-label { font-size: 11px; color: var(--muted-soft); text-align: center; }

.reading-list { display: flex; flex-direction: column; gap: 10px; margin-top: 8px; }
.reading-card {
  display: flex; align-items: center; gap: 14px; padding: 16px;
  border: 1.5px solid var(--sand-deep); background: var(--paper);
  border-radius: 16px; cursor: pointer; text-align: left; transition: all 0.15s ease;
}
.reading-card:hover { border-color: var(--teal); transform: translateY(-1px); box-shadow: 0 4px 14px rgba(26,36,32,0.07); }
.reading-emoji { font-size: 28px; flex-shrink: 0; }
.reading-info { display: flex; flex-direction: column; flex: 1; }
.reading-title { font-family: Georgia, serif; font-size: 16px; font-weight: 700; color: var(--teal-deep); }
.reading-meta { font-size: 12px; color: var(--muted); margin-top: 2px; }
.reading-arrow { color: var(--teal); font-size: 18px; }
.reading-head { text-align: center; margin-bottom: 14px; }
.reading-head-emoji { font-size: 36px; }
.reading-head-title { font-family: Georgia, serif; font-size: 22px; color: var(--teal-deep); margin: 6px 0 4px; }
.reading-head-context { font-size: 13px; color: var(--muted); margin: 0; }
.reading-tense-note {
  background: rgba(166,106,36,0.1); border: 1px solid rgba(166,106,36,0.25);
  border-radius: 10px; padding: 10px 14px; font-size: 12.5px; color: #8a5a1e;
  line-height: 1.5; margin-bottom: 16px;
}
/* ---- Poziomy trudności czytania (A1–B2) ---- */
.level-picker {
  display: flex; align-items: center; gap: 10px;
  margin-bottom: 14px; flex-wrap: wrap;
}
.level-btns { display: flex; gap: 4px; }
.level-btn {
  border: 1.5px solid var(--sand-deep); background: var(--paper);
  color: var(--muted); border-radius: 8px; padding: 5px 12px;
  font-size: 12px; font-weight: 700; cursor: pointer; letter-spacing: 0.3px;
}
.level-btn-active {
  border-color: var(--teal); background: var(--teal); color: #fff;
}
.level-desc { font-size: 11.5px; color: var(--muted-soft); font-style: italic; }

.reading-toggles { display: flex; gap: 6px; justify-content: flex-end; flex-wrap: wrap; margin-bottom: 12px; }
.reading-text {
  border: 1.5px solid var(--sand-deep); border-radius: 16px;
  padding: 18px; background: var(--paper); margin-bottom: 24px;
}
.reading-sentence { margin-bottom: 16px; padding-bottom: 16px; border-bottom: 1px solid rgba(0,0,0,0.05); }
.reading-sentence:last-child { margin-bottom: 0; padding-bottom: 0; border-bottom: none; }
.reading-ar {
  display: block; font-family: var(--ar-font); font-size: 24px;
  direction: rtl; color: var(--ink); line-height: 1.6; margin-bottom: 4px;
}
.reading-ph { display: block; font-size: 13.5px; color: var(--terracotta); font-weight: 600; margin-bottom: 2px; }
.reading-pl { display: block; font-size: 13.5px; color: var(--muted); }
.reading-q-title { font-family: Georgia, serif; font-size: 17px; color: var(--teal-deep); margin: 0 0 14px; }
.reading-questions { display: flex; flex-direction: column; gap: 18px; margin-bottom: 20px; }
.reading-q-text { font-size: 14.5px; font-weight: 600; color: var(--ink); margin: 0 0 10px; }
.reading-q-ar {
  font-family: var(--ar-font); font-size: 20px; direction: rtl;
  text-align: right; line-height: 1.6; font-weight: 400;
}
.reading-option-ar {
  font-family: var(--ar-font); font-size: 18px; direction: rtl;
  text-align: right;
}
.reading-options { display: flex; flex-direction: column; gap: 8px; }
.reading-option {
  text-align: left; padding: 11px 14px; border: 1.5px solid var(--sand-deep);
  background: var(--paper); border-radius: 10px; cursor: pointer; font-size: 14px;
  color: var(--ink); transition: all 0.15s ease;
}
.reading-option:hover { border-color: var(--teal); }
.reading-option-chosen { border-color: var(--teal); border-width: 2px; background: rgba(29,92,82,0.06); }
.reading-option-correct { border-color: #2e7d52; background: rgba(46,125,82,0.12); color: #2e7d52; font-weight: 600; }
.reading-option-wrong { border-color: #c0392b; background: rgba(192,57,43,0.1); color: #c0392b; }
.reading-check { width: 100%; }
.reading-score {
  text-align: center; font-family: Georgia, serif; font-size: 20px;
  font-weight: 700; color: var(--teal-deep); padding: 16px;
  background: rgba(29,92,82,0.08); border-radius: 12px;
}

/* ---- Egipski a MSA ---- */
.msa-rules {
  background: rgba(166,106,36,0.1); border: 1px solid rgba(166,106,36,0.25);
  border-radius: 10px; padding: 12px 14px; font-size: 12.5px; color: #8a5a1e;
  line-height: 1.6; margin-bottom: 16px;
}





/* ---- Moduł 3: rozbiór zdań ---- */
.msal-synt {
  display: flex; flex-direction: column; gap: 8px; padding: 12px;
  background: var(--sand); border-radius: 12px;
}
.msal-synt-type {
  align-self: flex-start; font-size: 10px; font-weight: 700; letter-spacing: 0.5px;
  text-transform: uppercase; color: var(--muted); padding: 2px 8px;
  background: var(--paper); border-radius: 6px;
}
.msal-synt-line {
  display: flex; flex-wrap: wrap; gap: 8px; justify-content: flex-start;
}
.msal-seg {
  display: flex; flex-direction: column; align-items: center; gap: 3px;
  padding: 8px 10px; border-radius: 10px; border: 1.5px solid; background: var(--paper);
  min-width: 0;
}
.msal-seg-ar { font-family: var(--ar-font); font-size: 22px; direction: rtl; line-height: 1.3; }
.msal-seg-ph { font-family: 'JetBrains Mono', monospace; font-size: 11px; color: var(--muted); }
.msal-seg-role { font-size: 8.5px; font-weight: 700; letter-spacing: 0.3px; text-transform: uppercase; text-align: center; line-height: 1.1; }
.msal-synt-tr { font-size: 13px; color: var(--ink); font-style: italic; margin-top: 2px; }
.msal-synt-note {
  display: flex; flex-direction: column; gap: 4px; padding: 10px 12px;
  background: #eef3ee; border-radius: 10px; border-left: 3px solid var(--terracotta);
  font-size: 12.5px; color: var(--ink); line-height: 1.5;
}

/* ---- Moduł 2: słowa ze zdaniami ---- */
.msal-word {
  display: flex; flex-direction: column; gap: 8px; padding: 12px;
  background: var(--sand); border-radius: 12px;
}
.msal-word-head {
  display: grid; grid-template-columns: auto 1fr auto; gap: 10px; align-items: center;
}
.msal-word-ar { font-family: var(--ar-font); font-size: 26px; color: var(--ink); direction: rtl; white-space: nowrap; }
.msal-word-phs { display: flex; flex-direction: column; gap: 2px; min-width: 0; }
.msal-word-meaning { font-size: 14px; color: var(--ink); font-weight: 700; text-align: right; }
.msal-word-sentence {
  display: flex; flex-direction: column; gap: 3px; padding: 10px;
  background: var(--paper); border-radius: 9px; border-right: 3px solid var(--teal);
}
.msal-sent-ar { font-family: var(--ar-font); font-size: 19px; color: var(--teal-deep); direction: rtl; line-height: 1.5; }
.msal-sent-phs { display: flex; flex-direction: column; gap: 1px; margin-top: 2px; }
.msal-sent-msa { display: flex; align-items: center; gap: 6px; font-family: 'JetBrains Mono', monospace; font-size: 11.5px; color: var(--terracotta); }
.msal-sent-eg { display: flex; align-items: center; gap: 6px; font-family: 'JetBrains Mono', monospace; font-size: 11px; color: var(--muted); }
.msal-sent-meaning { font-size: 12.5px; color: var(--ink); margin-top: 3px; font-style: italic; }

/* ---- Przycisk i ćwiczenie MSA ---- */
.msal-practice-btn {
  align-self: stretch; margin-top: 4px; padding: 10px; border-radius: 10px;
  border: none; background: var(--teal); color: #fff; font-size: 13px;
  font-weight: 600; cursor: pointer;
}
.msal-practice-btn:hover { opacity: 0.9; }
.msa-practice { display: flex; flex-direction: column; gap: 16px; min-height: 420px; }
.msa-practice-bar { display: flex; align-items: center; justify-content: space-between; }
.msa-practice-count { font-size: 13px; color: var(--muted); font-weight: 600; }
.msa-practice-close {
  border: none; background: none; color: var(--muted); font-size: 18px; cursor: pointer;
  width: 32px; height: 32px; border-radius: 999px;
}
.msa-practice-close:hover { background: var(--sand); }
.msa-practice-card {
  flex: 1; min-height: 300px; display: flex; flex-direction: column;
  align-items: center; justify-content: center; gap: 12px;
  background: var(--teal-deep); border-radius: 20px; padding: 32px 24px;
  cursor: pointer; text-align: center;
}
.msa-practice-ar { font-family: var(--ar-font); font-size: 44px; color: #fff; direction: rtl; }
.msa-practice-hint { font-size: 12px; color: rgba(255,255,255,0.6); }
.msa-practice-msa { font-family: 'JetBrains Mono', monospace; font-size: 18px; color: #fff; display: flex; align-items: center; gap: 8px; }
.msa-practice-eg { font-family: 'JetBrains Mono', monospace; font-size: 15px; color: rgba(255,255,255,0.7); display: flex; align-items: center; gap: 8px; }
.msa-practice-meaning { font-size: 20px; color: #fff; font-weight: 600; margin-top: 8px; }
.msa-practice-actions { display: flex; gap: 12px; }
.msa-practice-actions .nav-btn { flex: 1; }
.msa-practice-done {
  flex: 1; display: flex; flex-direction: column; align-items: center;
  justify-content: center; gap: 16px; text-align: center;
}
.msa-practice-score { font-size: 40px; font-weight: 700; color: var(--teal-deep); }



/* ---- Ćwiczenie: rozróżnianie podobnych liter ---- */
.alpha-quiz-btn {
  padding: 12px; border-radius: 12px; border: none; background: var(--teal);
  color: #fff; font-size: 13.5px; font-weight: 600; cursor: pointer;
}
.alpha-quiz-btn:hover { opacity: 0.9; }
.lq { display: flex; flex-direction: column; gap: 16px; min-height: 440px; }
.lq-bar { display: flex; align-items: center; justify-content: space-between; }
.lq-count { font-size: 13px; color: var(--muted); font-weight: 600; }
.lq-close { border: none; background: none; color: var(--muted); font-size: 18px; cursor: pointer; width: 32px; height: 32px; border-radius: 999px; }
.lq-close:hover { background: var(--sand); }
.lq-prompt {
  display: flex; flex-direction: column; align-items: center; gap: 8px;
  padding: 28px 20px; background: var(--teal-deep); border-radius: 18px;
}
.lq-form-label { font-size: 11px; color: rgba(255,255,255,0.6); text-transform: uppercase; letter-spacing: 1px; }
.lq-form-big { font-family: var(--ar-font); font-size: 72px; color: #fff; line-height: 1.1; direction: rtl; }
.lq-question { font-size: 13px; color: rgba(255,255,255,0.75); }
.lq-options { display: grid; grid-template-columns: repeat(auto-fit, minmax(70px, 1fr)); gap: 10px; }
.lq-option {
  display: flex; flex-direction: column; align-items: center; gap: 4px;
  padding: 14px 8px; border-radius: 12px; border: 1.5px solid var(--sand-deep);
  background: var(--paper); cursor: pointer; transition: all 0.15s;
}
.lq-option:hover:not(:disabled) { border-color: var(--teal); }
.lq-option-letter { font-family: var(--ar-font); font-size: 34px; color: var(--ink); line-height: 1; }
.lq-option-name { font-size: 10px; color: var(--muted); font-family: 'JetBrains Mono', monospace; }
.lq-option-correct { border-color: #2e7d52; background: rgba(46,125,82,0.12); }
.lq-option-wrong { border-color: #c0562e; background: rgba(192,86,46,0.1); }
.lq-feedback { display: flex; flex-direction: column; gap: 12px; }
.lq-hint {
  font-size: 12.5px; color: var(--ink); line-height: 1.5; margin: 0;
  padding: 12px; background: var(--sand); border-radius: 10px;
}
.lq-done { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 16px; text-align: center; }
.lq-score-big { font-size: 42px; font-weight: 700; color: var(--teal-deep); }


/* ---- Ekran wyboru kursu ---- */
.course-select { max-width: 480px; margin: 0 auto; padding: 32px 20px; display: flex; flex-direction: column; gap: 24px; min-height: 100vh; justify-content: center; }
.course-select-head { text-align: center; display: flex; flex-direction: column; align-items: center; gap: 8px; }
.course-select-head .header-glyph { width: 64px; height: 64px; font-size: 36px; border-radius: 18px; display: flex; align-items: center; justify-content: center; background: var(--teal); color: #fff; font-family: var(--ar-font); }
.course-select-head h1 { font-size: 28px; margin: 8px 0 0; color: var(--ink); }
.course-select-head p { font-size: 14px; color: var(--muted); margin: 0; }
.course-cards { display: flex; flex-direction: column; gap: 14px; }
.course-card {
  display: flex; align-items: flex-start; gap: 14px; padding: 18px;
  border: 2px solid; border-radius: 16px; background: var(--paper); cursor: pointer;
  text-align: left; transition: transform 0.12s, box-shadow 0.12s;
}
.course-card:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(0,0,0,0.08); }
.course-card-icon {
  width: 48px; height: 48px; border-radius: 12px; flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
  font-family: var(--ar-font); font-size: 26px; color: #fff;
}
.course-card-body { display: flex; flex-direction: column; gap: 3px; min-width: 0; }
.course-card-title { font-size: 17px; font-weight: 700; color: var(--ink); }
.course-card-subtitle { font-size: 12.5px; color: var(--terracotta); font-weight: 600; }
.course-card-desc { font-size: 12.5px; color: var(--muted); line-height: 1.45; margin-top: 4px; }
.course-lang-toggle {
  align-self: center; padding: 8px 16px; border: 1.5px solid var(--sand-deep);
  border-radius: 999px; background: var(--paper); color: var(--ink); font-size: 13px;
  font-weight: 600; cursor: pointer;
}

/* ---- Pasek kursu (nad zakładkami) ---- */
.course-bar {
  max-width: 480px; margin: 0 auto 12px; width: 100%; box-sizing: border-box;
  display: flex; align-items: center; gap: 12px; padding: 8px 10px;
  border-left: 3px solid; background: var(--paper); border-radius: 10px;
}
.course-back {
  border: none; background: var(--sand); color: var(--ink); font-size: 13px;
  font-weight: 600; cursor: pointer; padding: 6px 12px; border-radius: 8px; white-space: nowrap;
}
.course-back:hover { background: var(--sand-deep); }
.course-bar-title { font-size: 14px; font-weight: 700; }






/* ---- Przycisk audio wymowy ---- */
.audio-btn {
  display: inline-flex; align-items: center; justify-content: center;
  border: none; background: none; cursor: pointer; padding: 4px;
  border-radius: 8px; line-height: 1; transition: transform 0.1s, background 0.15s;
}
.audio-btn:hover { background: var(--sand); transform: scale(1.1); }
.audio-btn:active { transform: scale(0.95); }
.audio-btn-empty { opacity: 0.35; cursor: default; }
.audio-btn-empty:hover { background: none; transform: none; }

/* ---- Ścieżka egipskiego (dodatki do .mpath) ---- */
.egp-word { display: flex; align-items: center; gap: 14px; padding: 12px 16px; background: var(--sand); border-radius: 12px; }
.egp-word-ar { font-family: var(--ar-font); font-size: 30px; color: var(--teal-deep); direction: rtl; min-width: 60px; text-align: right; white-space: nowrap; }
.egp-word-txt { display: flex; flex-direction: column; gap: 2px; flex: 1; }
.egp-word-ph { font-family: 'JetBrains Mono', monospace; font-size: 15px; color: var(--terracotta); font-weight: 600; }
.egp-word-meaning { font-size: 13px; color: var(--ink); }
.egp-sentence { display: flex; flex-direction: column; align-items: center; gap: 4px; padding: 16px; background: var(--sand); border-radius: 14px; }
.egp-sent-ar { font-family: var(--ar-font); font-size: 28px; color: var(--teal-deep); direction: rtl; line-height: 1.6; }
.egp-sent-ph { font-family: 'JetBrains Mono', monospace; font-size: 14px; color: var(--terracotta); font-weight: 600; }
.egp-sent-tr { font-size: 13.5px; color: var(--ink); font-style: italic; }
.egp-kind { display: inline-block; font-size: 8.5px; font-weight: 700; letter-spacing: 0.5px; text-transform: uppercase; padding: 2px 7px; border-radius: 999px; margin-top: 3px; align-self: flex-start; }
.egp-kind-practice { background: rgba(46,125,82,0.12); color: var(--teal-deep); }
.egp-kind-grammar { background: rgba(184,134,11,0.14); color: #8a6608; }
.mpath-lesson-num .egp-kind { margin-top: 0; margin-left: 8px; vertical-align: middle; }
.egp-num-practice { background: var(--teal) !important; color: #fff !important; }
.egp-num-grammar { background: #b8860b !important; color: #fff !important; }
.mpath-item-next-eg { border-color: var(--teal) !important; box-shadow: 0 2px 10px rgba(46,125,82,0.12) !important; }
.mpath-item-badge-eg { background: var(--teal) !important; }
.egp-fiszki-btn { padding: 12px; border: 1.5px solid var(--sand-deep); border-radius: 12px; background: var(--paper); color: var(--ink); font-size: 14px; font-weight: 600; cursor: pointer; }
.egp-fiszki-btn:hover { background: var(--sand); }

/* ---- Ścieżka lekcji MSA ---- */
.view-mpath { display: flex; flex-direction: column; gap: 16px; }
.mpath-header { display: flex; flex-direction: column; gap: 8px; }
.mpath-h { font-size: 20px; font-weight: 700; color: var(--ink); margin: 0; }
.mpath-sub { font-size: 13px; color: var(--muted); margin: 0; line-height: 1.5; }
.mpath-progress { display: flex; align-items: center; gap: 10px; margin-top: 4px; }
.mpath-progress-bar { flex: 1; height: 8px; background: var(--sand-deep); border-radius: 999px; overflow: hidden; }
.mpath-progress-fill { height: 100%; background: var(--terracotta); border-radius: 999px; transition: width 0.3s; }
.mpath-progress-txt { font-size: 12px; font-weight: 700; color: var(--muted); white-space: nowrap; }
.mpath-list { display: flex; flex-direction: column; gap: 8px; }
.mpath-item {
  display: flex; align-items: center; gap: 12px; padding: 14px; border-radius: 12px;
  background: var(--paper); border: 1.5px solid var(--sand-deep); cursor: pointer; text-align: left; width: 100%;
}
.mpath-item-next { border-color: var(--terracotta); box-shadow: 0 2px 10px rgba(198,110,74,0.12); }
.mpath-item-done { opacity: 0.7; }
.mpath-item-num {
  width: 32px; height: 32px; border-radius: 50%; flex-shrink: 0; display: flex; align-items: center; justify-content: center;
  font-weight: 700; font-size: 14px; background: var(--sand); color: var(--muted);
}
.mpath-item-done .mpath-item-num { background: var(--teal); color: #fff; }
.mpath-item-next .mpath-item-num { background: var(--terracotta); color: #fff; }
.mpath-item-body { display: flex; flex-direction: column; gap: 2px; min-width: 0; flex: 1; }
.mpath-item-title { font-size: 14px; font-weight: 700; color: var(--ink); }
.mpath-item-goal { font-size: 12px; color: var(--muted); line-height: 1.4; }
.mpath-item-badge { font-size: 9px; font-weight: 700; letter-spacing: 0.5px; text-transform: uppercase; color: #fff; background: var(--terracotta); padding: 3px 8px; border-radius: 999px; white-space: nowrap; }
/* pojedyncza lekcja */
.mpath-back { align-self: flex-start; border: none; background: var(--sand); color: var(--ink); font-size: 13px; font-weight: 600; cursor: pointer; padding: 6px 12px; border-radius: 8px; }
.mpath-lesson { display: flex; flex-direction: column; gap: 12px; }
.mpath-lesson-num { font-size: 11px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; color: var(--terracotta); }
.mpath-lesson-title { font-size: 22px; font-weight: 700; color: var(--ink); margin: 0; }
.mpath-lesson-goal { font-size: 13.5px; color: var(--muted); font-style: italic; margin: 0; padding: 10px 12px; background: var(--sand); border-radius: 10px; border-left: 3px solid var(--terracotta); }
.mpath-blocks { display: flex; flex-direction: column; gap: 12px; }
.mpath-text { font-size: 14px; color: var(--ink); line-height: 1.6; margin: 0; }
.mpath-tip { display: flex; gap: 8px; padding: 10px 12px; background: #eef3ee; border-radius: 10px; font-size: 12.5px; color: var(--ink); line-height: 1.5; }
.mpath-tip-icon { flex-shrink: 0; }
.mpath-word { display: flex; flex-direction: column; align-items: center; gap: 3px; padding: 16px; background: var(--sand); border-radius: 14px; }
.mpath-word-ar { font-family: var(--ar-font); font-size: 38px; color: var(--teal-deep); direction: rtl; line-height: 1.4; }
.mpath-word-ph { font-family: 'JetBrains Mono', monospace; font-size: 15px; color: var(--terracotta); }
.mpath-word-meaning { font-size: 14px; color: var(--ink); font-weight: 600; }
.mpath-letter, .mpath-haraka { display: flex; align-items: center; gap: 14px; padding: 12px 16px; background: var(--sand); border-radius: 12px; }
.mpath-letter-ar, .mpath-haraka-ar { font-family: var(--ar-font); font-size: 34px; color: var(--teal-deep); direction: rtl; min-width: 44px; text-align: center; }
.mpath-letter-txt { display: flex; flex-direction: column; gap: 2px; }
.mpath-letter-ph { font-family: 'JetBrains Mono', monospace; font-size: 14px; color: var(--terracotta); font-weight: 600; }
.mpath-letter-desc { font-size: 12.5px; color: var(--muted); line-height: 1.4; }
.mpath-forms { display: flex; align-items: center; gap: 10px; padding: 14px; background: var(--sand); border-radius: 12px; flex-wrap: wrap; justify-content: center; }
.mpath-form { font-family: var(--ar-font); font-size: 30px; color: var(--teal-deep); direction: rtl; }
.mpath-forms-desc { font-size: 11.5px; color: var(--muted); width: 100%; text-align: center; }
.mpath-compare { display: flex; flex-direction: column; gap: 4px; padding: 12px 14px; background: var(--sand); border-radius: 12px; }
.mpath-cmp-msa { display: flex; align-items: center; gap: 6px; font-family: 'JetBrains Mono', monospace; font-size: 14px; color: var(--terracotta); }
.mpath-cmp-eg { display: flex; align-items: center; gap: 6px; font-family: 'JetBrains Mono', monospace; font-size: 13px; color: var(--muted); }
.mpath-cmp-desc { font-size: 12px; color: var(--ink); margin-top: 3px; }
.mpath-sentence { display: flex; flex-direction: column; align-items: center; gap: 4px; padding: 16px; background: var(--sand); border-radius: 14px; }
.mpath-sent-ar { font-family: var(--ar-font); font-size: 28px; color: var(--teal-deep); direction: rtl; line-height: 1.6; }
.mpath-sent-ph { font-family: 'JetBrains Mono', monospace; font-size: 13px; color: var(--terracotta); }
.mpath-sent-tr { font-size: 13.5px; color: var(--ink); font-style: italic; }
.mpath-done-btn { padding: 14px; border: none; border-radius: 12px; background: var(--teal); color: #fff; font-size: 15px; font-weight: 700; cursor: pointer; margin-top: 4px; }

/* ---- Kwestie religijne (trzon 3) ---- */
.view-relig { display: flex; flex-direction: column; gap: 22px; }
.relig-intro { font-size: 13px; color: var(--muted); margin: 0; line-height: 1.5; }
.relig-group { display: flex; flex-direction: column; gap: 10px; }
.relig-group-title {
  font-size: 14px; font-weight: 700; color: #7a5cb8; margin: 0;
  padding-bottom: 6px; border-bottom: 2px solid rgba(122,92,184,0.2);
}
.relig-items { display: flex; flex-direction: column; gap: 8px; }
.relig-item { display: flex; flex-direction: column; gap: 6px; padding: 14px; background: var(--sand); border-radius: 12px; }
.relig-item-head { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
.relig-item-ar { font-family: var(--ar-font); font-size: 26px; color: var(--teal-deep); direction: rtl; white-space: nowrap; }
.relig-item-txt { display: flex; flex-direction: column; gap: 1px; align-items: flex-end; text-align: right; }
.relig-item-ph { font-family: 'JetBrains Mono', monospace; font-size: 12.5px; color: var(--terracotta); }
.relig-item-meaning { font-size: 13px; color: var(--ink); font-weight: 600; }
.relig-item-note { font-size: 12px; color: var(--muted); line-height: 1.55; margin: 0; padding-top: 6px; border-top: 1px dashed var(--sand-deep); }

/* ---- Koran od podstaw: cytaty z rozbiorem ---- */
.view-qverses { display: flex; flex-direction: column; gap: 18px; }
.qv-intro { font-size: 13px; color: var(--muted); margin: 0; line-height: 1.5; }
.qv-verse { display: flex; flex-direction: column; gap: 8px; padding: 18px; background: var(--sand); border-radius: 16px; }
.qv-verse-head { display: flex; justify-content: center; }
.qv-ref { font-size: 10.5px; font-weight: 700; letter-spacing: 0.5px; text-transform: uppercase; color: #7a5cb8; padding: 3px 10px; background: rgba(122,92,184,0.1); border-radius: 6px; }
.qv-verse-ar { font-family: var(--ar-font); font-size: 30px; color: var(--teal-deep); direction: rtl; text-align: center; line-height: 1.7; }
.qv-verse-ph { font-family: 'JetBrains Mono', monospace; font-size: 13px; color: var(--terracotta); text-align: center; }
.qv-verse-tr { font-size: 14px; color: var(--ink); text-align: center; font-style: italic; }

.qv-fulls { display: flex; flex-direction: column; gap: 8px; margin-top: 4px; }
.qv-full { display: flex; flex-direction: column; gap: 2px; padding: 10px 12px; border-radius: 10px; }
.qv-full-msa { background: rgba(198,110,74,0.09); border-left: 3px solid var(--terracotta); }
.qv-full-eg { background: rgba(122,92,184,0.09); border-left: 3px solid #7a5cb8; }
.qv-full-label { font-size: 8.5px; font-weight: 700; letter-spacing: 0.5px; text-transform: uppercase; color: var(--muted); }
.qv-full-ar { font-family: var(--ar-font); font-size: 20px; color: var(--ink); direction: rtl; line-height: 1.5; }
.qv-full-ph { font-family: 'JetBrains Mono', monospace; font-size: 11px; color: var(--terracotta); }
.qv-full-note { font-size: 11.5px; color: var(--muted); line-height: 1.5; margin-top: 3px; font-style: italic; }
.qv-verse-note { font-size: 11.5px; color: var(--muted); line-height: 1.5; padding: 8px 12px; background: var(--sand); border-radius: 8px; font-style: italic; }

.qv-words { display: flex; flex-direction: column; gap: 6px; margin-top: 8px; }
.qv-words-label { font-size: 10px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; color: var(--muted); }
.qv-word { background: var(--paper); border-radius: 10px; overflow: hidden; }
.qv-word-head { width: 100%; display: grid; grid-template-columns: auto 1fr auto; gap: 10px; align-items: center; padding: 10px 12px; background: none; border: none; cursor: pointer; text-align: left; }
.qv-word-cl { font-family: var(--ar-font); font-size: 22px; color: var(--ink); direction: rtl; }
.qv-word-meaning { font-size: 13px; color: var(--ink); font-weight: 600; }
.qv-word-chevron { font-size: 18px; color: var(--muted); }
.qv-word-body { padding: 0 12px 12px; display: flex; flex-direction: column; gap: 10px; }
.qv-registers { display: grid; grid-template-columns: repeat(3, 1fr); gap: 6px; }
.qv-reg { display: flex; flex-direction: column; align-items: center; gap: 2px; padding: 8px 4px; border-radius: 9px; }
.qv-reg-cl { background: rgba(46,125,82,0.1); }
.qv-reg-msa { background: rgba(198,110,74,0.1); }
.qv-reg-eg { background: rgba(122,92,184,0.1); }
.qv-reg-label { font-size: 8px; font-weight: 700; letter-spacing: 0.5px; text-transform: uppercase; color: var(--muted); }
.qv-reg-ar { font-family: var(--ar-font); font-size: 19px; color: var(--ink); direction: rtl; }
.qv-reg-ph { font-family: 'JetBrains Mono', monospace; font-size: 10.5px; color: var(--terracotta); text-align: center; }
.qv-word-note { font-size: 12px; color: var(--muted); line-height: 1.55; margin: 0; padding: 8px 10px; background: var(--sand); border-radius: 8px; }

/* ---- Widok koraniczny ---- */
.view-quran { display: flex; flex-direction: column; gap: 16px; }
.quran-intro { font-size: 13px; color: var(--muted); margin: 0; line-height: 1.5; }
.quran-card {
  display: flex; flex-direction: column; gap: 8px; padding: 18px;
  background: var(--sand); border-radius: 16px; align-items: center; text-align: center;
}
.quran-card-ar { font-family: var(--ar-font); font-size: 34px; color: var(--teal-deep); direction: rtl; line-height: 1.4; }
.quran-card-ph { font-family: 'JetBrains Mono', monospace; font-size: 15px; color: var(--terracotta); }
.quran-card-meaning { font-size: 16px; font-weight: 700; color: var(--ink); }
.quran-card-note { font-size: 12.5px; color: var(--muted); line-height: 1.55; margin: 4px 0 0; }
.quran-card-root {
  display: flex; align-items: center; gap: 8px; margin-top: 6px; padding: 8px 14px;
  background: var(--paper); border-radius: 999px;
}
.quran-root-label { font-size: 9px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; color: var(--muted); }
.quran-root-ar { font-family: var(--ar-font); font-size: 18px; color: var(--teal-deep); direction: rtl; }
.quran-root-tr { font-family: 'JetBrains Mono', monospace; font-size: 12px; color: var(--terracotta); }
.quran-root-link { font-size: 11.5px; color: var(--ink); line-height: 1.5; margin: 0; font-style: italic; }

/* ---- Tabela alfabetu ---- */
.view-alphabet { display: flex; flex-direction: column; gap: 14px; }
.alpha-intro { font-size: 13px; color: var(--muted); margin: 0; line-height: 1.5; }
.alpha-legend { display: flex; gap: 16px; flex-wrap: wrap; }
.alpha-legend-item { display: flex; align-items: center; gap: 6px; font-size: 11.5px; color: var(--muted); }
.alpha-dot { width: 10px; height: 10px; border-radius: 3px; flex-shrink: 0; }
.alpha-dot-connect { background: var(--teal); }
.alpha-dot-noconnect { background: var(--terracotta); }
.alpha-grid {
  display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px;
}
.alpha-cell {
  display: flex; flex-direction: column; align-items: center; gap: 3px;
  padding: 12px 4px; border-radius: 12px; border: 1.5px solid var(--sand-deep);
  background: var(--paper); cursor: pointer; min-width: 0;
}
.alpha-cell-nc { border-color: rgba(198,110,74,0.4); }
.alpha-cell-open { border-color: var(--teal); background: var(--sand); }
.alpha-cell-letter { font-family: var(--ar-font); font-size: 30px; color: var(--ink); line-height: 1; }
.alpha-cell-name { font-size: 10px; color: var(--muted); font-family: 'JetBrains Mono', monospace; }
.alpha-detail {
  display: flex; flex-direction: column; gap: 12px; padding: 16px;
  background: var(--sand); border-radius: 14px;
}
.alpha-detail-head { display: flex; align-items: baseline; justify-content: space-between; gap: 12px; }
.alpha-detail-name { font-size: 16px; font-weight: 700; color: var(--ink); font-family: 'JetBrains Mono', monospace; }
.alpha-detail-sound { font-size: 13px; color: var(--terracotta); font-weight: 600; }
.alpha-forms { display: grid; grid-template-columns: repeat(4, 1fr); gap: 6px; }
.alpha-form {
  display: flex; flex-direction: column; align-items: center; gap: 5px;
  padding: 12px 3px; background: var(--paper); border-radius: 10px; min-width: 0;
}
.alpha-form-val { font-family: var(--ar-font); font-size: 28px; color: var(--teal-deep); line-height: 1; direction: rtl; }
.alpha-form-label {
  font-size: 8.5px; color: var(--muted); text-transform: uppercase;
  letter-spacing: 0.3px; text-align: center; line-height: 1.15;
}

.alpha-form-ex-note {
  font-size: 8px; font-weight: 700; letter-spacing: 0.3px; text-transform: uppercase;
  color: var(--terracotta); text-align: center; line-height: 1.1;
  padding: 1px 4px; background: rgba(198,110,74,0.1); border-radius: 4px;
}
.alpha-rule {
  font-size: 12px; color: var(--muted); background: var(--sand);
  border-radius: 10px; padding: 10px 12px;
}
.alpha-rule summary {
  cursor: pointer; font-weight: 600; color: var(--ink); font-size: 12.5px;
  list-style: revert;
}
.alpha-rule p { margin: 8px 0 0; line-height: 1.55; font-size: 12px; }

.alpha-form-ex {
  display: flex; flex-direction: column; align-items: center; gap: 1px;
  margin-top: 4px; padding-top: 6px; border-top: 1px dashed var(--sand-deep); width: 100%;
}
.alpha-form-ex-word { font-family: var(--ar-font); font-size: 18px; color: var(--ink); direction: rtl; line-height: 1.3; }
.alpha-hl { color: var(--terracotta); }
.alpha-form-ex-ph { font-family: 'JetBrains Mono', monospace; font-size: 9px; color: var(--terracotta); }
.alpha-form-ex-meaning { font-size: 9px; color: var(--muted); text-align: center; line-height: 1.2; }
.alpha-detail-note {
  font-size: 12px; color: var(--terracotta); margin: 0; line-height: 1.5;
  padding: 8px 10px; background: rgba(198,110,74,0.08); border-radius: 8px;
}

/* ---- Lekcje MSA od podstaw ---- */
.view-msalessons { display: flex; flex-direction: column; gap: 16px; }
.msal-intro { font-size: 13px; color: var(--muted); margin: 0; line-height: 1.5; }
.msal-module { display: flex; flex-direction: column; gap: 12px; }
.msal-module-head { display: flex; align-items: center; gap: 12px; }
.msal-module-num {
  width: 32px; height: 32px; border-radius: 999px; background: var(--teal);
  color: #fff; font-weight: 700; font-size: 15px; display: flex;
  align-items: center; justify-content: center; flex-shrink: 0;
}
.msal-module-title { font-size: 15px; font-weight: 700; color: var(--ink); }
.msal-module-desc { font-size: 12px; color: var(--muted); line-height: 1.4; }
.msal-lessons { display: flex; flex-direction: column; gap: 8px; }
.msal-lesson { border: 1.5px solid var(--sand-deep); border-radius: 12px; background: var(--paper); overflow: hidden; }
.msal-lesson-open { border-color: var(--teal); }
.msal-lesson-head {
  width: 100%; display: flex; align-items: center; gap: 12px; padding: 12px 14px;
  background: none; border: none; cursor: pointer; text-align: left;
}
.msal-lesson-letter {
  font-family: var(--ar-font); font-size: 28px; color: var(--teal-deep);
  width: 40px; text-align: center; flex-shrink: 0; direction: rtl;
}
.msal-lesson-title { flex: 1; font-size: 14px; font-weight: 600; color: var(--ink); min-width: 0; }
.msal-lesson-chevron { font-size: 20px; color: var(--muted); font-weight: 300; }
.msal-lesson-body {
  padding: 0 14px 14px; display: flex; flex-direction: column; gap: 12px;
  border-top: 1px solid var(--sand); padding-top: 12px;
}
.msal-simple { font-size: 13.5px; color: var(--ink); line-height: 1.55; margin: 0; }
.msal-bridge {
  display: flex; flex-direction: column; gap: 4px; padding: 10px 12px;
  background: #eef3ee; border-radius: 10px; border-left: 3px solid var(--teal);
}
.msal-bridge-tag {
  font-size: 9.5px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; color: var(--teal);
}
.msal-bridge-text { font-size: 13px; color: var(--ink); line-height: 1.5; }
.msal-tech-toggle {
  align-self: flex-start; border: none; background: none; color: var(--teal);
  font-size: 12px; font-weight: 600; cursor: pointer; text-decoration: underline; padding: 0;
}
.msal-tech {
  font-size: 12.5px; color: var(--muted); line-height: 1.55; margin: 0;
  padding: 10px 12px; background: var(--sand); border-radius: 10px;
}
.msal-examples { display: flex; flex-direction: column; gap: 8px; }
.msal-examples-label {
  font-size: 10px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase;
  color: var(--terracotta);
}
.msal-example {
  display: grid; grid-template-columns: auto 1fr auto; gap: 10px; align-items: center;
  padding: 8px 10px; border-radius: 9px; background: var(--sand); min-width: 0;
}
.msal-example-ar {
  font-family: var(--ar-font); font-size: 22px; color: var(--ink); direction: rtl;
  white-space: nowrap;
}
.msal-example-phs { display: flex; flex-direction: column; gap: 2px; min-width: 0; }
.msal-example-msa, .msal-example-eg {
  display: flex; align-items: center; gap: 6px;
  font-family: 'JetBrains Mono', monospace; font-size: 12px;
}
.msal-example-msa { color: var(--teal-deep); }
.msal-example-eg { color: var(--muted); }
.msal-tag {
  font-size: 8px; font-weight: 700; letter-spacing: 0.5px; padding: 1px 4px;
  border-radius: 4px; background: var(--teal); color: #fff;
}
.msal-tag-eg { background: var(--sand-deep); color: var(--ink); }
.msal-example-meaning { font-size: 12.5px; color: var(--ink); font-weight: 600; text-align: right; }

/* ---- MSA: rdzenie ---- */
.view-roots { display: flex; flex-direction: column; gap: 14px; }
.roots-intro { font-size: 13px; color: var(--muted); margin: 0; line-height: 1.5; }
.roots-tabs { display: flex; gap: 8px; flex-wrap: wrap; }
.roots-tab {
  display: flex; flex-direction: column; align-items: center; gap: 2px;
  padding: 10px 16px; border: 1.5px solid var(--sand-deep); border-radius: 12px;
  background: var(--paper); cursor: pointer; min-width: 0;
}
.roots-tab-active { border-color: var(--teal); background: var(--teal); }
.roots-tab-active .roots-tab-ar,
.roots-tab-active .roots-tab-tr { color: #fff; }
.roots-tab-ar { font-family: var(--ar-font); font-size: 20px; color: var(--ink); direction: rtl; }
.roots-tab-tr { font-family: 'JetBrains Mono', monospace; font-size: 11px; color: var(--muted); letter-spacing: 1px; }
.root-panel { display: flex; flex-direction: column; gap: 12px; }
.root-head {
  display: flex; flex-direction: column; align-items: center; gap: 4px;
  padding: 16px; background: var(--sand); border-radius: 14px;
}
.root-head-ar { font-family: var(--ar-font); font-size: 32px; color: var(--teal-deep); direction: rtl; }
.root-head-tr { font-family: 'JetBrains Mono', monospace; font-size: 13px; color: var(--terracotta); letter-spacing: 2px; }
.root-head-meaning { font-size: 13px; color: var(--muted); text-align: center; margin-top: 2px; }
.root-family { display: flex; flex-direction: column; gap: 10px; }
.root-word {
  border: 1.5px solid var(--sand-deep); border-radius: 12px; padding: 12px;
  background: var(--paper); display: flex; flex-direction: column; gap: 8px;
}
.root-word-role {
  font-size: 10.5px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase;
  color: var(--terracotta);
}
.root-word-main { display: flex; gap: 10px; flex-wrap: wrap; }
.root-word-msa, .root-word-eg {
  display: flex; flex-direction: column; gap: 1px; flex: 1; min-width: 0;
  padding: 8px 10px; border-radius: 9px; background: var(--sand);
}
.root-word-eg { background: #eef3ee; }
.root-word-ar { font-family: var(--ar-font); font-size: 20px; color: var(--ink); direction: rtl; }
.root-word-ph { font-family: 'JetBrains Mono', monospace; font-size: 12px; color: var(--terracotta); }
.root-word-tag {
  font-size: 9px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase;
  color: var(--muted); margin-top: 2px;
}
.root-word-tag-eg { color: var(--teal); }
.root-word-meaning { font-size: 14px; color: var(--ink); font-weight: 600; }
.root-tech-toggle {
  align-self: flex-start; border: none; background: none; color: var(--teal);
  font-size: 12px; font-weight: 600; cursor: pointer; text-decoration: underline; padding: 0;
}
.root-tech {
  border-top: 1px dashed var(--sand-deep); padding-top: 8px; display: flex;
  flex-direction: column; gap: 6px;
}
.root-wazn { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
.root-wazn-label { font-size: 11px; color: var(--muted); }
.root-wazn-ar { font-family: var(--ar-font); font-size: 18px; color: var(--teal-deep); direction: rtl; }
.root-wazn-tr { font-family: 'JetBrains Mono', monospace; font-size: 12px; color: var(--terracotta); }
.root-note { font-size: 12.5px; color: var(--muted); line-height: 1.5; margin: 0; }

.msa-tabs { display: flex; gap: 6px; margin-bottom: 16px; }
.msa-tab {
  flex: 1; display: flex; flex-direction: column; align-items: center; gap: 3px;
  padding: 10px 4px; border: 1.5px solid var(--sand-deep); background: var(--paper);
  border-radius: 12px; cursor: pointer; font-size: 12px; font-weight: 600; color: var(--muted);
}
.msa-tab-active { border-color: var(--teal); border-width: 2px; color: var(--teal-deep); background: rgba(29,92,82,0.05); }
.msa-tab-emoji { font-size: 15px; }
.msa-group-hint { font-size: 12.5px; color: var(--muted); font-style: italic; margin: 0 0 14px; }
.msa-list { display: flex; flex-direction: column; gap: 12px; }
.msa-row {
  border: 1.5px solid var(--sand-deep); background: var(--paper);
  border-radius: 14px; padding: 14px;
}
.msa-row-pl { font-size: 14px; font-weight: 700; color: var(--ink); margin-bottom: 10px; }
.msa-row-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px; }
.msa-row-head .msa-row-pl { margin-bottom: 0; }
.msa-ar-shared { font-family: var(--ar-font); font-size: 26px; direction: rtl; color: var(--teal-deep); }
.msa-pair { display: flex; gap: 10px; }
.msa-variant {
  flex: 1; display: flex; flex-direction: column; align-items: center; gap: 3px;
  padding: 10px; border-radius: 10px; background: rgba(0,0,0,0.02);
}
.msa-badge { font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; padding: 2px 8px; border-radius: 999px; }
.msa-badge-eg { background: rgba(29,92,82,0.15); color: var(--teal-deep); }
.msa-badge-msa { background: rgba(166,106,36,0.15); color: #8a5a1e; }
.msa-ar { font-family: var(--ar-font); font-size: 24px; direction: rtl; color: var(--ink); }
.msa-ph { font-size: 13px; color: var(--terracotta); font-weight: 600; }
.msa-note { font-size: 12px; color: var(--muted); margin: 10px 0 0; line-height: 1.5; }
.msa-pron-pair { display: flex; gap: 10px; margin-bottom: 8px; }
.msa-pron { flex: 1; text-align: center; font-size: 15px; font-weight: 600; padding: 8px; border-radius: 8px; }
.msa-pron-eg { background: rgba(29,92,82,0.08); color: var(--teal-deep); }
.msa-pron-msa { background: rgba(166,106,36,0.08); color: #8a5a1e; }
.msa-rule { font-size: 12px; color: var(--muted); margin: 0; text-align: center; }

/* ---- Statystyki: przerobione fiszki ---- */
.stats-empty-note {
  font-size: 12.5px;
  color: var(--muted);
  font-style: italic;
  margin: 0 0 8px;
}
.stats-known-row {
  display: flex;
  gap: 8px;
  margin-bottom: 14px;
}
.stats-known-card {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;
  padding: 12px 6px;
  border-radius: 12px;
  border: 1.5px solid var(--sand-deep);
}
.stats-known-num {
  font-size: 22px;
  font-weight: 700;
  font-family: Georgia, serif;
}
.stats-known-label {
  font-size: 11px;
  color: var(--ink);
  text-align: center;
}
.stats-known-green { background: rgba(46,125,82,0.08); }
.stats-known-green .stats-known-num { color: #2e7d52; }
.stats-known-orange { background: rgba(217,138,43,0.08); }
.stats-known-orange .stats-known-num { color: #b5701a; }
.stats-known-red { background: rgba(192,57,43,0.08); }
.stats-known-red .stats-known-num { color: #c0392b; }

/* ---- Tabela wzorów odmiany ---- */
.pattern-box {
  border: 1.5px solid var(--sand-deep);
  border-radius: 14px;
  margin-bottom: 18px;
  overflow: hidden;
  background: var(--paper);
}
.pattern-toggle {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border: none;
  background: transparent;
  padding: 13px 16px;
  font-size: 14px;
  font-weight: 600;
  color: var(--teal-deep);
  cursor: pointer;
}
.pattern-chevron {
  font-size: 18px;
  color: var(--muted-soft);
}
.pattern-body {
  padding: 0 16px 16px;
}
.pattern-intro {
  font-size: 12.5px;
  color: var(--ink);
  line-height: 1.5;
  margin: 0 0 12px;
}
.pattern-rule {
  font-size: 12px;
  color: var(--terracotta);
  font-style: italic;
  margin: 10px 0 12px;
}
.pattern-table {
  width: 100%;
  border-collapse: collapse;
}
.pattern-table th {
  text-align: right;
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.4px;
  color: var(--muted-soft);
  padding: 4px 8px;
  border-bottom: 1.5px solid var(--sand-deep);
}
.pattern-table th:first-child { text-align: left; }
.pattern-table td {
  padding: 8px;
  border-bottom: 1px solid var(--sand);
  vertical-align: middle;
}
.pattern-pron {
  font-size: 12.5px;
  color: var(--ink);
}
.pattern-affix {
  font-family: var(--ar-font);
  direction: rtl;
  font-size: 17px;
  color: var(--teal);
  text-align: center;
  white-space: nowrap;
}
.pattern-example {
  text-align: right;
}
.pattern-ar {
  font-family: var(--ar-font);
  direction: rtl;
  font-size: 19px;
  display: block;
}
.pattern-ph {
  font-size: 11.5px;
  color: var(--terracotta);
  font-weight: 600;
}

/* ---- Tabela nieregularnych ---- */
.irr-group {
  margin-bottom: 22px;
}
.irr-group:last-child { margin-bottom: 4px; }
.irr-title {
  font-family: Georgia, serif;
  font-size: 14.5px;
  color: var(--teal-deep);
  margin: 0 0 3px;
}
.irr-desc {
  font-size: 12px;
  color: var(--ink);
  line-height: 1.45;
  margin: 0 0 4px;
}
.irr-example {
  font-size: 11.5px;
  color: var(--muted);
  font-style: italic;
  margin: 0 0 8px;
}
.irr-table th {
  font-size: 9px;
}
.irr-cell {
  text-align: center;
  white-space: nowrap;
}
.irr-cell-hl {
  background: rgba(193, 87, 47, 0.07);
  border-radius: 6px;
}
.irr-ar {
  font-family: var(--ar-font);
  direction: rtl;
  font-size: 16px;
  display: block;
  line-height: 1.3;
}
.irr-ph {
  font-size: 10px;
  color: var(--terracotta);
  font-weight: 600;
}
.irr-note {
  margin-top: 8px;
}
`;
