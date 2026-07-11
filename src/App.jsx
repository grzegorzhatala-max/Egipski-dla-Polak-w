import { useState, useEffect, useMemo, useRef } from "react";
import { Plus, Palette, GraduationCap, Trash2, Shuffle, BookOpen, ListChecks, X, Check, RotateCw, Upload, Flag, Pencil, Hash, HelpCircle, Puzzle, MessageSquare, MessagesSquare, List, PenLine, TrendingUp } from "lucide-react";

// ---------- Domyślny zestaw słówek (50 fraz, na podst. "50 Essential Egyptian Arabic Phrases") ----------
const SEED_WORDS = [
  {
    cat: "basics",
    pl: "Witaj!",
    ar: "أهلًا!",
    ph: "ahlan!",
    ex: { ar: "أهلًا! ايه الأخبار؟", ph: "ahlan! ee(h) (e)l2akhbaar?", pl: "Witaj! Co słychać?" },
  },
  {
    cat: "basics",
    pl: "dziękuję",
    ar: "شكرًا!",
    ph: "shokran!",
    ex: { ar: "شكرًا أوي على مساعدتك!", ph: "shokran 2awi 3ala mosa3detak!", pl: "Bardzo dziękuję za pomoc!" },
  },
  {
    cat: "basics",
    pl: "proszę (do mężczyzny/kobiety)",
    ar: "من فضلك / فضلِك",
    ph: "men faDlak/ek",
    ex: { ar: "واحد قهوة، من فضلِك.", ph: "waaHed 2ahwa, men faDlek.", pl: "Jedna kawa, proszę." },
  },
  {
    cat: "basics",
    pl: "przepraszam / proszę (do mężczyzny/kobiety)",
    ar: "لو سمحت / سمحتي",
    ph: "law sama7t/i",
    ex: { ar: "لو سمحتي، فين الحمّام؟", ph: "law sama7ti, feen el7ammaam?", pl: "Przepraszam (do kobiety), gdzie jest toaleta?" },
  },
  {
    cat: "basics",
    pl: "tak / nie",
    ar: "آه / لا",
    ph: "aa(h) / la2",
    ex: { ar: "آه، عايزين حاجة حلوة. / لا، شكرًا.", ph: "aa(h) 3ayziin 7aaga 7elwa. / la, shokran.", pl: "Tak, chcielibyśmy deser. / Nie, dziękuję." },
  },
  {
    cat: "basics",
    pl: "jak się masz? (do mężczyzny/kobiety)",
    ar: "ازايك / ازايِك؟",
    ph: "ezzayyak/ek?",
    ex: { ar: "ازايِك النهاردة؟", ph: "ezzayyek ennahaarda?", pl: "Jak się masz (do kobiety) dzisiaj?" },
  },
  {
    cat: "basics",
    pl: "nazywam się...",
    ar: "اسمي...",
    ph: "esmi…",
    ex: { ar: "اسمي مريم.", ph: "esmi maryam.", pl: "Nazywam się Maryam." },
  },
  {
    cat: "basics",
    pl: "miło mi cię poznać",
    ar: "اتشرفنا",
    ph: "etsharrafna",
    ex: { ar: "اتشرفنا يا علي. الشرف ليّا يا محمود.", ph: "etsharrafna ya 3ali. eshsharaf leyya ya ma7muud.", pl: "Miło mi, Ali. Mnie również, Mahmoud (standardowa odpowiedź)." },
  },
  {
    cat: "questions",
    pl: "gdzie jest/są...?",
    ar: "فين...؟",
    ph: "feen…?",
    ex: { ar: "فين محطة القطر؟", ph: "feen ma7aTTet el2aTr?", pl: "Gdzie jest stacja kolejowa?" },
  },
  {
    cat: "questions",
    pl: "ile to kosztuje?",
    ar: "بكام؟",
    ph: "bekaam?",
    ex: { ar: "بكام دا، لو سمحت؟", ph: "bekaam da, law sama7t?", pl: "Ile to kosztuje, proszę (do mężczyzny)?" },
  },
  {
    cat: "questions",
    pl: "mówisz po angielsku? (do mężczyzny/kobiety)",
    ar: "بتتكلم / بتتكلمي انجليزي؟",
    ph: "betetkallem/i engeliizi?",
    ex: { ar: "لو سمحت، بتتكلم انجليزي؟", ph: "law sama7t, betetkallem engeliizi?", pl: "Przepraszam, mówi pan po angielsku?" },
  },
  {
    cat: "questions",
    pl: "chcę / chciałbym (m./ż.)",
    ar: "عايز / عايزة",
    ph: "3aayez/3ayza",
    ex: { ar: "عايز ترابيزة لفردين، من فضلك.", ph: "3aayez tarabeeza l(e)fardeen, men faDlak.", pl: "Chcę stolik dla dwóch osób, proszę." },
  },
  {
    cat: "basics",
    pl: "do zobaczenia (m./ż./l.mn.)",
    ar: "اشوفك / اشوفِك / اشوفكو",
    ph: "ashuufak/ek / ashofku",
    ex: { ar: "اشوفكو على خير، ان شاء الله.", ph: "ashofku 3ala kheer, enshaa2allaa(h).", pl: "Do zobaczenia w dobrym zdrowiu, da Bóg (popularne wyrażenie)." },
  },
  {
    cat: "food_shopping",
    pl: "smacznego / dobre zdrowie po jedzeniu",
    ar: "بالهنا والشفا",
    ph: "belhana we (e)shshefa",
    ex: { ar: "بالهنا والشفا يا حبيبي.", ph: "belhana we (e)shshefa ya 7abiibi.", pl: "Smacznego, kochanie." },
  },
  {
    cat: "basics",
    pl: "przykro mi (m./ż.)",
    ar: "آسف / أسفة",
    ph: "aasef/asfa",
    ex: { ar: "آسف على التأخير.", ph: "aasef 3ala (e)tta2kheer.", pl: "Przepraszam za spóźnienie." },
  },
  {
    cat: "basics",
    pl: "nie rozumiem (m./ż.)",
    ar: "مش فاهم / فاهمة",
    ph: "mesh faahem/fahma",
    ex: { ar: "انا آسف، مش فاهم.", ph: "ana aasef, mesh faahem.", pl: "Przykro mi (m.), nie rozumiem." },
  },
  {
    cat: "basics",
    pl: "możesz mi pomóc? (do mężczyzny/kobiety)",
    ar: "ممكن تساعدني / تساعديني؟",
    ph: "momken tesa3edni/tesa3diini?",
    ex: { ar: "فيه مشكلة. ممكن تساعدني؟", ph: "fii(h) moshkela. momken tesa3edni?", pl: "Jest problem. Mógłbyś (m.) mi pomóc?" },
  },
  {
    cat: "questions",
    pl: "która jest godzina?",
    ar: "الساعة كام؟",
    ph: "essaa3a kaam?",
    ex: { ar: "الساعة كام، لو سمحت؟", ph: "essaa3a kaam, law sama7t?", pl: "Która jest godzina, proszę (do mężczyzny)?" },
  },
  {
    cat: "questions",
    pl: "gdzie mieszkasz? (do mężczyzny/kobiety)",
    ar: "انت عايش / انتي عايشة فين؟",
    ph: "enta 3aayesh / enti 3aysha feen?",
    ex: { ar: "انا نسيت. حضرتك عايش فين؟", ph: "ana neseet. HaDretak 3aayesh feen?", pl: "Zapomniałem. Gdzie pan mieszka?" },
  },
  {
    cat: "basics",
    pl: "dzień dobry",
    ar: "صباح الخير",
    ph: "SabaaH el-kheer",
    ex: { ar: "صباح الخير! صباح النور!", ph: "SabaaH el-kheer! SabaaH ennuur!", pl: "Dzień dobry! Dzień dobry! (standardowa odpowiedź)" },
  },
  {
    cat: "basics",
    pl: "do widzenia",
    ar: "سالم!",
    ph: "salaam!",
    ex: { ar: "سالم! اشوفك بكرة!", ph: "salaam! ashuufak bokra!", pl: "Cześć! Do zobaczenia jutro!" },
  },
  {
    cat: "basics",
    pl: "dobry wieczór",
    ar: "مساء الخير",
    ph: "masaa2 el-kheer",
    ex: { ar: "مساء الخير! مساء النور!", ph: "masaa2 el-kheer! masaa2 ennuur!", pl: "Dobry wieczór! Dobry wieczór! (standardowa odpowiedź)" },
  },
  {
    cat: "basics",
    pl: "dobranoc (do mężczyzny/kobiety)",
    ar: "تصبح / تصبحي على خير",
    ph: "teSbaH/i 3ala kheer",
    ex: { ar: "تصبحي على خير. وانتي من أهله.", ph: "teSbaHi 3ala kheer. we (e)nti men 2ahlu.", pl: "Dobranoc (do kobiety). Dobranoc (standardowa odpowiedź)." },
  },
  {
    cat: "basics",
    pl: "oczywiście",
    ar: "أكيد",
    ph: "akiid",
    ex: { ar: "بتحب العربي؟ أكيد.", ph: "bet7ebb el3arabi? akiid.", pl: "Kochasz arabski? Oczywiście." },
  },
  {
    cat: "basics",
    pl: "może",
    ar: "يمكن",
    ph: "yemken",
    ex: { ar: "يمكن آجي بكرة.", ph: "yemken aagi bokra.", pl: "Może przyjdę jutro." },
  },
  {
    cat: "basics",
    pl: "nic się nie stało / przykro mi (mniej formalne niż „aasef”)",
    ar: "معلش",
    ph: "ma3lesh",
    ex: { ar: "كان يوم صعب النهاردة. معلش.", ph: "kaan yoom Sa3b ennahaarda. ma3lesh.", pl: "To był trudny dzień. Przykro mi." },
  },
  {
    cat: "basics",
    pl: "uważaj na siebie (do mężczyzny/kobiety)",
    ar: "خلي بالك من نفسك / خلي بالِك من نفسِك",
    ph: "5alli baalak men nafsak / 5alli baalek men nafsek",
    ex: { ar: "الوقت متأخر. خلي بالك من نفسك.", ph: "elwa2t met2akhkhar. 5alli baalak men nafsak.", pl: "Jest późno. Uważaj na siebie (m.)." },
  },
  {
    cat: "basics",
    pl: "gratulacje",
    ar: "مبروك",
    ph: "mabruuk",
    ex: { ar: "مبروك الشقة الجديدة.", ph: "mabruuk eshsha22a (e)ggediida.", pl: "Gratulacje z powodu nowego mieszkania." },
  },
  {
    cat: "basics",
    pl: "wszystkiego dobrego (z okazji święta/urodzin)",
    ar: "كل سنة وانت طيب / وانتي طيبة",
    ph: "koll sana we (e)nta Tayyeb/(e)nti Tayyeba",
    ex: { ar: "رمضان بكرة. كل سنة وانت طيب. وانت طيب!", ph: "ramaDaan bokra. koll sana we (e)nta Tayyeb. we (e)nta Tayyeb!", pl: "Ramadan jest jutro. Wszystkiego dobrego. Tobie również! (standardowa odpowiedź)" },
  },
  {
    cat: "basics",
    pl: "szczęśliwego Ramadanu",
    ar: "رمضان كريم",
    ph: "ramaDaan kariim",
    ex: { ar: "رمضان كريم. رمضان كريم وهللا أكرم.", ph: "ramaDaan kariim. ramaDaan kariim wallaahu akram.", pl: "Ramadan jest dobry. Ramadan jest dobry, a Bóg jest jeszcze lepszy (standardowa odpowiedź)." },
  },
  {
    cat: "basics",
    pl: "da Bóg",
    ar: "ان شاء هللا",
    ph: "enshaa2allaa(h)",
    ex: { ar: "اشوفك الحد، ان شاء هللا.", ph: "ashuufak el7add, enshaa2allaa(h).", pl: "Do zobaczenia w niedzielę, da Bóg." },
  },
  {
    cat: "basics",
    pl: "dzięki Bogu",
    ar: "الحمد لله",
    ph: "el7amdulellaa(h)",
    ex: { ar: "ازايك؟ كويس، الحمد لله.", ph: "ezzayyak? kowayyes, el7amdulellaa(h).", pl: "Jak się masz? Dobrze, dzięki Bogu." },
  },
  {
    cat: "basics",
    pl: "miłego wolnego/urlopu",
    ar: "أجازة سعيدة",
    ph: "agaaza sa3iida",
    ex: { ar: "أجازة سعيدة! شكرًا!", ph: "agaaza sa3iida! shokran!", pl: "Miłego weekendu! Dziękuję!" },
  },
  {
    cat: "basics",
    pl: "wszystkiego dobrego (do chorego)",
    ar: "ألف سالمة",
    ph: "alf salaama",
    ex: { ar: "سمعت انك مريض. ألف سالمة.", ph: "seme3t ennak mariiD. alf salaama.", pl: "Słyszałem, że byłeś chory. Wszystkiego dobrego." },
  },
  {
    cat: "basics",
    pl: "w porządku",
    ar: "تمام",
    ph: "tamaam",
    ex: { ar: "هنتقابل الساعة سبعة. تمام.", ph: "hante2aabel essaa3a sab3a. tamaam.", pl: "Spotkamy się o siódmej. W porządku." },
  },
  {
    cat: "basics",
    pl: "kocham cię (do mężczyzny/kobiety)",
    ar: "بحبك / بحبِك",
    ph: "ba7ebbak/ek",
    ex: { ar: "بحبِك. وانا كمان.", ph: "ba7ebbek. wa (a)na kamaan.", pl: "Kocham cię (kobietę). Ja też." },
  },
  {
    cat: "feelings",
    pl: "jestem zmęczony/a",
    ar: "انا تعبان / تعبانة",
    ph: "ana ta3baan/a",
    ex: { ar: "انا تعبانة أوي النهاردة.", ph: "ana ta3baana awi (e)nnahaarda.", pl: "Jestem bardzo zmęczona dzisiaj." },
  },
  {
    cat: "feelings",
    pl: "jestem głodny/a",
    ar: "انا جعان / جعانة",
    ph: "ana ga3aan/a",
    ex: { ar: "انا جعان أوي. الغدا امتى؟", ph: "ana ga3aan awi. el8ada emta?", pl: "Jestem bardzo głodny. Kiedy jest obiad?" },
  },
  {
    cat: "feelings",
    pl: "potrzebuję (m./ż.)",
    ar: "انا محتاج / محتاجة",
    ph: "ana me7taag/a",
    ex: { ar: "انا محتاجة مساعدة.", ph: "ana me7taaga mosa3da.", pl: "Potrzebuję (kobieta) pomocy." },
  },
  {
    cat: "feelings",
    pl: "zgubiłem/am się (m./ż.)",
    ar: "انا تايه / تايهة",
    ph: "ana taayeh/tayha",
    ex: { ar: "لو سمحت، انا تايه. ممكن تساعدني؟", ph: "law sama7t, ana taayeh. momken tesa3edni?", pl: "Przepraszam, zgubiłem się. Mógłbyś mi pomóc?" },
  },
  {
    cat: "basics",
    pl: "wszystko w porządku?",
    ar: "كله تمام؟",
    ph: "kollu tamaam?",
    ex: { ar: "شكلِك زعلانة. كله تمام؟", ph: "shaklek za3laana. kollu tamaam?", pl: "Wyglądasz smutno. Wszystko w porządku?" },
  },
  {
    cat: "feelings",
    pl: "jestem zadowolony/a",
    ar: "مبسوط / مبسوطة",
    ph: "mabSuuT/a",
    ex: { ar: "انا مبسوطة أوي عشان النهاردة أجازة.", ph: "ana mabSuuTa awi 3ashaan ennahaarda agaaza.", pl: "Jestem bardzo zadowolona, bo dziś wolne." },
  },
  {
    cat: "basics",
    pl: "doskonale, świetnie",
    ar: "ممتاز",
    ph: "momtaaz",
    ex: { ar: "الجو ايه؟ ممتاز!", ph: "eggaww ee(h)? momtaaz!", pl: "Jaka jest pogoda? Świetna!" },
  },
  {
    cat: "basics",
    pl: "nie szkodzi (do mężczyzny/kobiety)",
    ar: "ولا يهمك / يهمِك",
    ph: "wala y(e)hemmak/ek",
    ex: { ar: "آسف. ولا يهمك.", ph: "aasef. wala y(e)hemmak.", pl: "Przepraszam. Nie szkodzi (m.)." },
  },
  {
    cat: "basics",
    pl: "jak się nazywasz? (do mężczyzny/kobiety)",
    ar: "اسمك / اسمِك ايه؟",
    ph: "esmak/ek ee(h)?",
    ex: { ar: "اسمِك ايه؟ ليلى.", ph: "esmek ee(h)? layla.", pl: "Jak się nazywasz (kobieta)? Layla." },
  },
  {
    cat: "basics",
    pl: "no chodź, dalej",
    ar: "يالا",
    ph: "yalla",
    ex: { ar: "يالا ناكل.", ph: "yalla naakol.", pl: "Chodźmy jeść." },
  },
  {
    cat: "basics",
    pl: "nie ma problemu",
    ar: "مفيش مشكلة",
    ph: "mafiish moshkela",
    ex: { ar: "آسف على التأخير. مفيش مشكلة.", ph: "aasef 3ala (e)tta2kheer. mafiish moshkela.", pl: "Przepraszam za spóźnienie. Nie ma problemu." },
  },
  {
    cat: "basics",
    pl: "jestem gotowy/a",
    ar: "انا جاهز / جاهزة",
    ph: "ana gaahez/gahza",
    ex: { ar: "انا جاهز. يالا بينا.", ph: "ana gaahez. yalla biina.", pl: "Jestem gotowy. Chodźmy." },
  },
  {
    cat: "basics",
    pl: "nie ma za co",
    ar: "عفوًا",
    ph: "3afwan",
    ex: { ar: "شكرًا! عفوًا.", ph: "shokran! 3afwan.", pl: "Dziękuję! Nie ma za co." },
  },
  {
    cat: "basics",
    pl: "skąd jesteś? (formalnie, do mężczyzny/kobiety)",
    ar: "حضرتك / حضرتِك منين؟",
    ph: "HaDretak/ek meneen?",
    ex: { ar: "حضرتِك منين؟ انا من مصر.", ph: "HaDretek meneen? ana men maSr.", pl: "Skąd pani jest? Jestem z Egiptu." },
  },
  {
    cat: "basics",
    pl: "duże drzwi",
    ar: "الباب الكبير",
    ph: "il-baab il-kibiir",
    ex: { ar: "الباب الكبير ده.", ph: "il-baab il-kibiir da.", pl: "To są duże drzwi." },
  },
  {
    cat: "basics",
    pl: "nie mam (czegoś)",
    ar: "معنديش",
    ph: "ma3andiish",
    ex: { ar: "معنديش فلوس.", ph: "ma3andiish fuluus.", pl: "Nie mam pieniędzy." },
  },
  {
    cat: "basics",
    pl: "mam (coś)",
    ar: "عندي",
    ph: "3andi",
    ex: { ar: "عندي مشكلة.", ph: "3andi moshkela.", pl: "Mam problem." },
  },
  {
    cat: "basics",
    pl: "nie ma / nie istnieje",
    ar: "مافيش",
    ph: "mafiish",
    ex: { ar: "مافيش مشكلة.", ph: "mafiish moshkela.", pl: "Nie ma problemu." },
  },
  {
    cat: "basics",
    pl: "jest / są (coś istnieje)",
    ar: "فيه",
    ph: "fiih",
    ex: { ar: "فيه مشكلة.", ph: "fiih moshkela.", pl: "Jest problem." },
  },
  {
    cat: "numbers_time",
    pl: "która godzina jest teraz, proszę?",
    ar: "الساعة كام دلوقتي من فضلك؟",
    ph: "essaa3a kaam dilwa2ti min faDlak?",
    ex: { ar: "الساعة كام دلوقتي من فضلك؟ الساعة سبعة.", ph: "essaa3a kaam dilwa2ti min faDlak? essaa3a sab3a.", pl: "Która godzina teraz, proszę? Jest siódma." },
  },
  {
    cat: "numbers_time",
    pl: "pół godziny",
    ar: "نص ساعة",
    ph: "nuSS saa3a",
    ex: { ar: "هوصل بعد نص ساعة.", ph: "hawSal ba3d nuSS saa3a.", pl: "Przyjedę za pół godziny." },
  },
  {
    cat: "home_hotel",
    pl: "pokój",
    ar: "أوضة",
    ph: "2uDa",
    ex: { ar: "عايز أوضة لفردين.", ph: "3aayez 2uDa l(e)fardeen.", pl: "Chcę pokój dla dwóch osób." },
  },
  {
    cat: "home_hotel",
    pl: "hotel",
    ar: "فندق",
    ph: "fundu2",
    ex: { ar: "الفندق ده كويس أوي.", ph: "el-fundu2 da kowayyes awi.", pl: "Ten hotel jest bardzo dobry." },
  },
  {
    cat: "home_hotel",
    pl: "łazienka",
    ar: "حمّام",
    ph: "Hammaam",
    ex: { ar: "فين الحمّام، لو سمحت؟", ph: "feen el-Hammaam, law sama7t?", pl: "Gdzie jest łazienka, proszę?" },
  },
  {
    cat: "home_hotel",
    pl: "klucz",
    ar: "مفتاح",
    ph: "muftaaH",
    ex: { ar: "ده مفتاح الأوضة.", ph: "da muftaaH el-2uDa.", pl: "To jest klucz do pokoju." },
  },
  {
    cat: "home_hotel",
    pl: "okno",
    ar: "شباك",
    ph: "shibbaak",
    ex: { ar: "الشباك ده كبير.", ph: "esh-shibbaak da kibiir.", pl: "To okno jest duże." },
  },
  {
    cat: "home_hotel",
    pl: "łóżko",
    ar: "سرير",
    ph: "sirriir",
    ex: { ar: "عايز سرير كبير.", ph: "3aayez sirriir kibiir.", pl: "Chcę duże łóżko." },
  },
  {
    cat: "home_hotel",
    pl: "ręcznik",
    ar: "فوطة",
    ph: "fuuTa",
    ex: { ar: "ممكن فوطة كمان، لو سمحت؟", ph: "momken fuuTa kamaan, law sama7t?", pl: "Mogę prosić jeszcze jeden ręcznik?" },
  },
  {
    cat: "food_shopping",
    pl: "ile kilo chcesz? (do mężczyzny)",
    ar: "عايز كام كيلو؟",
    ph: "3aayez kaam kiilu?",
    ex: { ar: "عايز كام كيلو رز؟ عايز كيلو واحد.", ph: "3aayez kaam kiilu ruzz? 3aayez kiilu waaHed.", pl: "Ile kilo ryżu chcesz? Chcę jedno kilo." },
  },
  {
    cat: "food_shopping",
    pl: "ryż",
    ar: "رز",
    ph: "ruzz",
    ex: { ar: "عندك رز؟", ph: "3andak ruzz?", pl: "Masz ryż?" },
  },
  {
    cat: "food_shopping",
    pl: "cukier",
    ar: "سكر",
    ph: "sukkar",
    ex: { ar: "عايز كيلو سكر.", ph: "3aayez kiilu sukkar.", pl: "Chcę kilo cukru." },
  },
  {
    cat: "food_shopping",
    pl: "herbata",
    ar: "شاي",
    ph: "shaay",
    ex: { ar: "عايز شاي وقهوة.", ph: "3aayez shaay wi 2ahwa.", pl: "Chcę herbatę i kawę." },
  },
  {
    cat: "food_shopping",
    pl: "ser",
    ar: "جبنة",
    ph: "gibna",
    ex: { ar: "عايز جبنة بيضا.", ph: "3aayez gibna beeDa.", pl: "Chcę biały ser." },
  },
  {
    cat: "food_shopping",
    pl: "mleko",
    ar: "لبن",
    ph: "laban",
    ex: { ar: "عايز عبوة لبن.", ph: "3aayez 3ilbet laban.", pl: "Chcę pudełko mleka." },
  },
  {
    cat: "food_shopping",
    pl: "proszę, daj mi...",
    ar: "من فضلك إديني",
    ph: "min faDlak 2iddiini",
    ex: { ar: "من فضلك إديني كيلو رز.", ph: "min faDlak 2iddiini kiilu ruzz.", pl: "Proszę, daj mi kilo ryżu." },
  },
  {
    cat: "food_shopping",
    pl: "proszę, zważ dla mnie...",
    ar: "من فضلك إوزن لي",
    ph: "min faDlak 2iwzen li",
    ex: { ar: "من فضلك إوزن لي كيلو بطاطس.", ph: "min faDlak 2iwzen li kiilu baTaaTes.", pl: "Proszę, zważ mi kilo ziemniaków." },
  },
  {
    cat: "food_shopping",
    pl: "menu, proszę",
    ar: "المنيو من فضلك",
    ph: "il-minya min faDlak",
    ex: { ar: "المنيو من فضلك.", ph: "il-minya min faDlak.", pl: "Menu, proszę." },
  },
  {
    cat: "food_shopping",
    pl: "do twoich usług, panie/pani",
    ar: "تحت أمرك / أمرك",
    ph: "taHt 2amrak / 2amrik",
    ex: { ar: "تحت أمرك يا فندم.", ph: "taHt 2amrak ya fandem.", pl: "Do pana usług." },
  },
  {
    cat: "food_shopping",
    pl: "kelner przynosi jedzenie na tacy",
    ar: "الجرسون بيجيب له الأكل على صينية",
    ph: "il-garsoon biygiib lu il-2akl 3ala Siniyya",
    ex: { ar: "الجرسون بيجيب له الأكل على صينية.", ph: "il-garsoon biygiib lu il-2akl 3ala Siniyya.", pl: "Kelner przynosi mu jedzenie na tacy." },
  },
  {
    cat: "travel",
    pl: "czy ten autobus jedzie do piramid?",
    ar: "الأتوبيس ده بيروح الأهرام؟",
    ph: "il-2utubiis da biyruuH il-2ahraam?",
    ex: { ar: "الأتوبيس ده بيروح الأهرام؟ آه.", ph: "il-2utubiis da biyruuH il-2ahraam? aa(h).", pl: "Czy ten autobus jedzie do piramid? Tak." },
  },
  {
    cat: "travel",
    pl: "ile kosztuje bilet?",
    ar: "بكام التذكرة؟",
    ph: "bikaam it-tazkara?",
    ex: { ar: "بكام التذكرة؟ بعشرة جنيه.", ph: "bikaam it-tazkara? bi3ashara geneeh.", pl: "Ile kosztuje bilet? Dziesięć funtów." },
  },
  {
    cat: "food_shopping",
    pl: "to jest za drogo (m.)",
    ar: "ده غالي عليّ",
    ph: "da ghaali 3alayya",
    ex: { ar: "ده غالي عليّ. خليها عشرين.", ph: "da ghaali 3alayya. khalliiha 3ishriin.", pl: "To dla mnie za drogo. Zrób dwadzieścia." },
  },
  {
    cat: "travel",
    pl: "dobra, ruszajmy (do taksówkarza/grupy)",
    ar: "ماشي، يالا بينا",
    ph: "maashi, yalla biina",
    ex: { ar: "ماشي، يالا بينا.", ph: "maashi, yalla biina.", pl: "OK, jedziemy." },
  },
  {
    cat: "body_services",
    pl: "głowa",
    ar: "راس",
    ph: "raas",
    ex: { ar: "راسي بتوجعني.", ph: "raasi bitiwga3ni.", pl: "Boli mnie głowa." },
  },
  {
    cat: "body_services",
    pl: "ręka",
    ar: "إيد",
    ph: "2iid",
    ex: { ar: "إيدي بتوجعني.", ph: "2iidi bitiwga3ni.", pl: "Boli mnie ręka." },
  },
  {
    cat: "body_services",
    pl: "noga",
    ar: "رجل",
    ph: "regl",
    ex: { ar: "رجلي بتوجعني.", ph: "regli bitiwga3ni.", pl: "Boli mnie noga." },
  },
  {
    cat: "body_services",
    pl: "brzuch",
    ar: "بطن",
    ph: "baTn",
    ex: { ar: "بطني بتوجعني.", ph: "baTni bitiwga3ni.", pl: "Boli mnie brzuch." },
  },
  {
    cat: "body_services",
    pl: "serce",
    ar: "قلب",
    ph: "2alb",
    ex: { ar: "قلبي طيب وانا مبسوط.", ph: "2albi Tayyeb wana mabSuuT.", pl: "Moje serce jest dobre i jestem zadowolony." },
  },
  {
    cat: "body_services",
    pl: "but/y",
    ar: "جزمة",
    ph: "gazma",
    ex: { ar: "ممكن تصلح الجزمة بتاعتي، من فضلك؟", ph: "momken tiSallaH il-gazma betaa3ti, min faDlak?", pl: "Możesz naprawić mi buty, proszę?" },
  },
  {
    cat: "questions",
    pl: "co jest z tym nie tak?",
    ar: "فيها إيه؟",
    ph: "fiiha 2eeh?",
    ex: { ar: "ممكن تصلح الجزمة؟ فيها إيه؟", ph: "momken tiSallaH il-gazma? fiiha 2eeh?", pl: "Możesz naprawić te buty? Co z nimi nie tak?" },
  },
  {
    cat: "body_services",
    pl: "znaczki pocztowe",
    ar: "طوابع",
    ph: "Tawaabe3",
    ex: { ar: "عندك طوابع للأمريكا؟", ph: "3andak Tawaabe3 lil2amriika?", pl: "Masz znaczki do Ameryki?" },
  },
  {
    cat: "body_services",
    pl: "gazeta",
    ar: "جورنال",
    ph: "gurnaal",
    ex: { ar: "عايز جورنال بالإنجليزي.", ph: "3aayez gurnaal bil2ingiliizi.", pl: "Chcę gazetę po angielsku." },
  },
  {
    cat: "body_services",
    pl: "sznurówka do butów",
    ar: "رباط جزمة",
    ph: "ribaaT gazma",
    ex: { ar: "عايز رباط جزمة جديد.", ph: "3aayez ribaaT gazma gediid.", pl: "Chcę nową sznurówkę do butów." },
  },
  {
    cat: "body_services",
    pl: "czy możesz zaszyć ten guzik?",
    ar: "ممكن تخيطي الزرار ده؟",
    ph: "momken tikhayyaTi iz-zoraar da?",
    ex: { ar: "ممكن تخيطي الزرار ده؟ آه، تحت أمرك.", ph: "momken tikhayyaTi iz-zoraar da? aa(h), taHt 2amrik.", pl: "Możesz przyszyć ten guzik? Tak, do usług." },
  },
  {
    cat: "basics",
    pl: "do zobaczenia wkrótce",
    ar: "أشوفك قريّب",
    ph: "ashuufak qureyyib",
    ex: { ar: "أشوفك قريّب بكرة الصبح", ph: "ashuufak qureyyib bukra is-subH", pl: "Do zobaczenia wkrótce, jutro rano" },
  },
  {
    cat: "basics",
    pl: "wcześnie rano",
    ar: "الصبح بدري",
    ph: "is-subH badri",
    ex: { ar: "أشوفك الصبح بدري", ph: "ashuufak is-subH badri", pl: "Do zobaczenia wcześnie rano" },
  },
  {
    cat: "travel",
    pl: "czy widzimy się wieczorem w restauracji?",
    ar: "نشوف بعض بالليل في المطعم؟",
    ph: "nishuuf ba3D bil-leel fil-maT3am?",
    ex: { ar: "نشوف بعض بالليل في المطعم؟ أيوا!", ph: "nishuuf ba3D bil-leel fil-maT3am? aywa!", pl: "Widzimy się wieczorem w restauracji? Tak!" },
  },
  {
    cat: "food_shopping",
    pl: "chcesz zjeść ze mną kolację? (do mężczyzny)",
    ar: "عايز تتعشى معايا؟",
    ph: "3aayez tit3ashsha ma3aaya?",
    ex: { ar: "عايز تتعشى معايا؟ أيوا، عايز.", ph: "3aayez tit3ashsha ma3aaya? aywa, 3aayez.", pl: "Chcesz zjeść ze mną kolację? Tak, chcę." },
  },
  {
    cat: "travel",
    pl: "co robisz dzisiaj wieczorem? (do mężczyzny)",
    ar: "انت هتعمل ايه النهاردة بالليل؟",
    ph: "enta hate3mel eeh ennaharda bil-leel?",
    ex: { ar: "انت هتعمل ايه النهاردة بالليل؟ مفيش حاجة.", ph: "enta hate3mel eeh ennaharda bil-leel? mafiish Haaga.", pl: "Co robisz dzisiaj wieczorem? Nic." },
  },
  {
    cat: "feelings",
    pl: "jest zimno wieczorem",
    ar: "بارد بالليل",
    ph: "baared bil-leel",
    ex: { ar: "بارد بالليل دلوقتي", ph: "baared bil-leel dilwa2ti", pl: "Teraz wieczorem jest zimno" },
  },
  {
    cat: "work_daily",
    pl: "chcę pracować z tobą",
    ar: "عايز اشتغل معاك",
    ph: "3aayez ashtaghal ma3aak",
    ex: { ar: "أنا عايز اشتغل معاك", ph: "ana 3aayez ashtaghal ma3aak", pl: "Chcę pracować z tobą" },
  },
  {
    cat: "work_daily",
    pl: "muszę iść tam dzisiaj",
    ar: "لازم اروح هناك النهاردة",
    ph: "laazem aruuH hinaak ennaharda",
    ex: { ar: "أنا لازم اروح هناك النهاردة", ph: "ana laazem aruuH hinaak ennaharda", pl: "Muszę iść tam dzisiaj" },
  },
  {
    cat: "work_daily",
    pl: "nie pracuję wcale",
    ar: "ما بشتغلش أبدا",
    ph: "ma bashtaghalsh abadan",
    ex: { ar: "أنا ما بشتغلش أبدا", ph: "ana ma bashtaghalsh abadan", pl: "Wcale nie pracuję" },
  },
  {
    cat: "work_daily",
    pl: "pracuję jako prawnik",
    ar: "باشتغل محامي",
    ph: "bashtaghal muHaami",
    ex: { ar: "أنا باشتغل محامي في شركتي", ph: "ana bashtaghal muHaami fi sharikti", pl: "Pracuję jako prawnik w mojej firmie" },
  },
  {
    cat: "work_daily",
    pl: "gotuję jedzenie",
    ar: "بعمل الأكل",
    ph: "ba3mel el-akl",
    ex: { ar: "أنا بعمل الأكل وهي بتشتغل مهندسة", ph: "ana ba3mel el-akl wi heyya betishtaghal mohandisa", pl: "Gotuję jedzenie, a ona pracuje jako inżynierka" },
  },
  {
    cat: "work_daily",
    pl: "kupuję teraz coś z supermarketu",
    ar: "بشتري حاجة من السوبر ماركت دلوقتي",
    ph: "bashtiri Haaga min is-supermarket dilwa2ti",
    ex: { ar: "أنا بشتري حاجة من السوبر ماركت دلوقتي", ph: "ana bashtiri Haaga min is-supermarket dilwa2ti", pl: "Kupuję teraz coś z supermarketu" },
  },
  {
    cat: "numbers_time",
    pl: "następny raz",
    ar: "المرة الجاية",
    ph: "el-marra el-gayya",
    ex: { ar: "اشوفك المرة الجاية", ph: "ashuufak el-marra el-gayya", pl: "Do zobaczenia następny raz" },
  },
  {
    cat: "numbers_time",
    pl: "następny tydzień",
    ar: "الإسبوع الجاي",
    ph: "el-isbuu3 el-gayy",
    ex: { ar: "هشتغل الإسبوع الجاي", ph: "hashtaghal el-isbuu3 el-gayy", pl: "Będę pracować w następnym tygodniu" },
  },
  {
    cat: "work_daily",
    pl: "lubię patrzeć na ciebie codziennie",
    ar: "عايز ابص لك كل يوم",
    ph: "3aayez aboSS lak koll yoom",
    ex: { ar: "أنا عايز ابص لك كل يوم", ph: "ana 3aayez aboSS lak koll yoom", pl: "Chcę patrzeć na ciebie codziennie" },
  },
  {
    cat: "work_daily",
    pl: "lubię sprzątać dom codziennie",
    ar: "بحب اعمل البيت كل يوم",
    ph: "baHebb a3mel el-beet koll yoom",
    ex: { ar: "أنا بحب اعمل البيت كل يوم", ph: "ana baHebb a3mel el-beet koll yoom", pl: "Lubię sprzątać dom codziennie" },
  },
  {
    cat: "work_daily",
    pl: "lubię jeść kurczaka",
    ar: "بحب آكل فراخ",
    ph: "baHebb aakul firaakh",
    ex: { ar: "أنا بحب آكل فراخ", ph: "ana baHebb aakul firaakh", pl: "Lubię jeść kurczaka" },
  },
  {
    cat: "work_daily",
    pl: "nie mam czasu",
    ar: "معنديش وقت",
    ph: "ma3andiish wa2t",
    ex: { ar: "عايز اروح معاكي المطعم بس معنديش وقت", ph: "3aayez aruuH ma3aaki el-maT3am bas ma3andiish wa2t", pl: "Chcę pójść z tobą do restauracji, ale nie mam czasu" },
  },
  {
    cat: "work_daily",
    pl: "chodziłem do szkoły",
    ar: "رحت المدرسة",
    ph: "ruHt el-madrasa",
    ex: { ar: "أنا رحت المدرسة", ph: "ana ruHt el-madrasa", pl: "Chodziłem do szkoły" },
  },
  {
    cat: "work_daily",
    pl: "gdzie byłeś wczoraj? (do grupy)",
    ar: "انتوا رحتوا مبارح فين؟",
    ph: "entu ruHtu mbaareH feen?",
    ex: { ar: "انتوا رحتوا مبارح فين؟", ph: "entu ruHtu mbaareH feen?", pl: "Gdzie byliście wczoraj?" },
  },
  {
    cat: "work_daily",
    pl: "kim był ten, który przyszedł wczoraj?",
    ar: "كان مين ده اللي جه مبارح؟",
    ph: "kaan miin da elli geh mbaareH?",
    ex: { ar: "كان مين ده اللي جه مبارح؟", ph: "kaan miin da elli geh mbaareH?", pl: "Kim był ten, który przyszedł wczoraj?" },
  },
  {
    cat: "work_daily",
    pl: "piszę teraz mejla",
    ar: "بكتب ايميل دلوقتي",
    ph: "baktib email dilwa2ti",
    ex: { ar: "أنا بكتب لك ايميل دلوقتي", ph: "ana baktib lak email dilwa2ti", pl: "Piszę teraz do ciebie mejla" },
  },
  {
    cat: "work_daily",
    pl: "będę w biurze o czwartej",
    ar: "هكون في المكتب الساعة أربعة",
    ph: "hakuun fil-maktab is-saa3a arba3a",
    ex: { ar: "أنا هكون في المكتب الساعة أربعة", ph: "ana hakuun fil-maktab is-saa3a arba3a", pl: "Będę w biurze o czwartej" },
  },
  {
    cat: "work_daily",
    pl: "byłem w biurze rano, ale teraz jestem w domu",
    ar: "كنت في المكتب الصبح لكن دلوقتي في البيت",
    ph: "kunt fil-maktab is-subH laakin dilwa2ti fil-beet",
    ex: { ar: "أنا كنت في المكتب النهاردة الصبح لكن أنا في البيت دلوقتي مع مراتي", ph: "ana kunt fil-maktab ennaharda is-subH laakin ana fil-beet dilwa2ti ma3a maraati", pl: "Byłem w biurze dziś rano, ale teraz jestem w domu z żoną" },
  },
  {
    cat: "work_daily",
    pl: "czy możemy zrobić to razem?",
    ar: "ممكن نعمله مع بعض؟",
    ph: "momken ne3miluh ma3a ba3D?",
    ex: { ar: "ممكن نعمله مع بعض؟ أيوا، ممكن.", ph: "momken ne3miluh ma3a ba3D? aywa, momken.", pl: "Możemy zrobić to razem? Tak, możemy." },
  },
  {
    cat: "work_daily",
    pl: "byłem kiedyś w Niemczech",
    ar: "كنت في ألمانيا مرة واحدة",
    ph: "kunt fi almaanya marra waHda",
    ex: { ar: "أنا كنت في ألمانيا مرة واحدة", ph: "ana kunt fi almaanya marra waHda", pl: "Byłem kiedyś w Niemczech" },
  },
  {
    cat: "work_daily",
    pl: "ona nigdy nie była w Japonii",
    ar: "هي ما كانتش أبدا في اليابان",
    ph: "heyya ma kaanetsh abadan fil-yabaan",
    ex: { ar: "هي ما كانتش أبدا في اليابان", ph: "heyya ma kaanetsh abadan fil-yabaan", pl: "Ona nigdy nie była w Japonii" },
  },
  {
    cat: "work_daily",
    pl: "czego chcesz? (do mężczyzny)",
    ar: "انت عايز ايه؟",
    ph: "enta 3aayez eeh?",
    ex: { ar: "انت عايز تروح فين؟", ph: "enta 3aayez tiruuH feen?", pl: "Gdzie chcesz pójść?" },
  },
  {
    cat: "work_daily",
    pl: "co chcesz kupić? (do mężczyzny)",
    ar: "انت عايز تشتري ايه؟",
    ph: "enta 3aayez tishtiri eeh?",
    ex: { ar: "انت عايز تشتري ايه من هنا؟", ph: "enta 3aayez tishtiri eeh min hina?", pl: "Co chcesz kupić stąd?" },
  },
  {
    cat: "feelings",
    pl: "myślę o czymś",
    ar: "بفكر في حاجة",
    ph: "befakkar fi Haaga",
    ex: { ar: "أنا بفكر في حاجة", ph: "ana befakkar fi Haaga", pl: "Myślę o czymś" },
  },
  {
    cat: "feelings",
    pl: "myślę, że masz rację (do kobiety)",
    ar: "بفكر إنك صح",
    ph: "befakkar ennek saHH",
    ex: { ar: "أنا بفكر إنك صح", ph: "ana befakkar ennek saHH", pl: "Myślę, że masz rację" },
  },
  {
    cat: "feelings",
    pl: "myślałem o tobie wczoraj",
    ar: "فكرت فيك مبارح",
    ph: "fakkart fiik mbaareH",
    ex: { ar: "أنا فكرت فيك مبارح", ph: "ana fakkart fiik mbaareH", pl: "Myślałem o tobie wczoraj" },
  },
  {
    cat: "work_daily",
    pl: "jaka jest sytuacja kraju teraz?",
    ar: "ايه حالة البلد دلوقتي؟",
    ph: "eeh Haalet el-balad dilwa2ti?",
    ex: { ar: "ايه حالة البلد دلوقتي؟", ph: "eeh Haalet el-balad dilwa2ti?", pl: "Jaka jest sytuacja kraju teraz?" },
  },
  {
    cat: "work_daily",
    pl: "potrzebuję więcej pieniędzy",
    ar: "بحتاج فلوس أكتر",
    ph: "baHtaag fuluus aktar",
    ex: { ar: "أنا بحتاج فلوس أكتر", ph: "ana baHtaag fuluus aktar", pl: "Potrzebuję więcej pieniędzy" },
  },
  {
    cat: "work_daily",
    pl: "rozumiemy się",
    ar: "احنا بنفهم بعض",
    ph: "e7na binifham ba3D",
    ex: { ar: "احنا بنفهم بعض كويس", ph: "e7na binifham ba3D kowayyes", pl: "Dobrze się rozumiemy" },
  },
  {
    cat: "feelings",
    pl: "jestem zadowolony, że jestem tutaj",
    ar: "أنا مبسوط إني هنا",
    ph: "ana mabSuuT enni hina",
    ex: { ar: "أنا مبسوط إني هنا معاكي", ph: "ana mabSuuT enni hina ma3aaki", pl: "Jestem zadowolony, że jestem tu z tobą" },
  },
  {
    cat: "home_hotel",
    pl: "gdzie jest mój pies?",
    ar: "فين كلبي؟",
    ph: "feen kalbi?",
    ex: { ar: "فين كلبي؟ هو في أوضة النوم.", ph: "feen kalbi? huwwa fi 2uDet en-noom.", pl: "Gdzie jest mój pies? Jest w sypialni." },
  },
  {
    cat: "home_hotel",
    pl: "ona jest w kuchni",
    ar: "هي في المطبخ",
    ph: "heyya fil-maTbakh",
    ex: { ar: "فين مراتي؟ هي في المطبخ.", ph: "feen maraati? heyya fil-maTbakh.", pl: "Gdzie jest moja żona? Jest w kuchni." },
  },
  {
    cat: "home_hotel",
    pl: "jest zaparkowany na zewnątrz",
    ar: "مركون برّا",
    ph: "markuun barra",
    ex: { ar: "فين عربيتي؟ مركونة برّا.", ph: "feen 3arabeyti? markoona barra.", pl: "Gdzie jest mój samochód? Jest zaparkowany na zewnątrz." },
  },
  {
    cat: "basics",
    pl: "wielkie dzięki (do mężczyzny)",
    ar: "متشكر أوي ليك",
    ph: "mitshakkir awi liik",
    ex: { ar: "متشكر أوي ليك", ph: "mitshakkir awi liik", pl: "Wielkie dzięki" },
  },
  {
    cat: "food_shopping",
    pl: "mam wszystko, czego potrzebuję",
    ar: "معايا كل حاجة",
    ph: "ma3aaya koll Haaga",
    ex: { ar: "أنا معايا كل حاجة للعشا", ph: "ana ma3aaya koll Haaga lil-3asha", pl: "Mam wszystko na kolację" },
  },
  {
    cat: "feelings",
    pl: "to jest szalony pomysł",
    ar: "دي فكرة مجنونة",
    ph: "di fikra magnuuna",
    ex: { ar: "جتلي فكرة مجنونة النهاردة", ph: "gatli fikra magnuuna ennaharda", pl: "Wpadłem dziś na szalony pomysł" },
  },
  {
    cat: "family",
    pl: "to jest mój mąż",
    ar: "ده جوزي",
    ph: "da gozi",
    ex: { ar: "ده جوزي ودي مراتي", ph: "da gozi wi di maraati", pl: "To jest mój mąż, a to moja żona" },
  },
  {
    cat: "family",
    pl: "to jest moja kochana",
    ar: "دي حبيبتي",
    ph: "di Habiibti",
    ex: { ar: "دي حبيبتي وده حبيبي", ph: "di Habiibti wi da Habiibi", pl: "To jest moja kochana, a to mój kochany" },
  },
  {
    cat: "family",
    pl: "to jest mój kolega/przyjaciel",
    ar: "ده صاحبي",
    ph: "da SaaHbi",
    ex: { ar: "ده صاحبي ودي صاحبتي", ph: "da SaaHbi wi di SaaHibti", pl: "To jest mój kolega, a to moja koleżanka" },
  },
  {
    cat: "family",
    pl: "to jest mój brat / to jest moja siostra",
    ar: "ده أخويا / دي أختي",
    ph: "da akhuuya / di ukhti",
    ex: { ar: "ده أخويا ودي أختي", ph: "da akhuuya wi di ukhti", pl: "To jest mój brat, a to moja siostra" },
  },
  {
    cat: "family",
    pl: "mama, tata, babcia, dziadek",
    ar: "ماما، بابا، تيتا، جدي",
    ph: "mama, baba, teeta, geddi",
    ex: { ar: "ده بابا، دي ماما، دي تيتا، ده جدي", ph: "da baba, di mama, di teeta, da geddi", pl: "To tata, to mama, to babcia, to dziadek" },
  },
  {
    cat: "family",
    pl: "jesteśmy ludźmi",
    ar: "احنا بني آدمين",
    ph: "e7na bani-2admiin",
    ex: { ar: "احنا بني آدمين", ph: "e7na bani-2admiin", pl: "Jesteśmy ludźmi" },
  },
  // ---- Liczby 0–1 000 000 ----
  {
    cat: "numbers_time",
    pl: "zero (0)",
    ar: "صفر",
    ph: "Sifr",
    ex: { ar: "معايا صفر جنيه", ph: "ma3aaya Sifr geneeh", pl: "Mam zero funtów" },
  },
  {
    cat: "numbers_time",
    pl: "jeden (1)",
    ar: "واحد",
    ph: "waaHed",
    ex: { ar: "عايز واحد قهوة", ph: "3aayez waaHed 2ahwa", pl: "Chcę jedną kawę" },
  },
  {
    cat: "numbers_time",
    pl: "dwa (2)",
    ar: "اتنين",
    ph: "etneen",
    ex: { ar: "عايز اتنين قهوة", ph: "3aayez etneen 2ahwa", pl: "Chcę dwie kawy" },
  },
  {
    cat: "numbers_time",
    pl: "trzy (3)",
    ar: "تلاتة",
    ph: "talaata",
    ex: { ar: "عندي تلاتة كتب", ph: "3andi talaata kotob", pl: "Mam trzy książki" },
  },
  {
    cat: "numbers_time",
    pl: "cztery (4)",
    ar: "أربعة",
    ph: "arba3a",
    ex: { ar: "عندي أربعة كتب", ph: "3andi arba3a kotob", pl: "Mam cztery książki" },
  },
  {
    cat: "numbers_time",
    pl: "pięć (5)",
    ar: "خمسة",
    ph: "khamsa",
    ex: { ar: "عايز خمسة كيلو رز", ph: "3aayez khamsa kiilu ruzz", pl: "Chcę pięć kilo ryżu" },
  },
  {
    cat: "numbers_time",
    pl: "sześć (6)",
    ar: "ستة",
    ph: "setta",
    ex: { ar: "الساعة ستة دلوقتي", ph: "essaa3a setta dilwa2ti", pl: "Jest teraz szósta" },
  },
  {
    cat: "numbers_time",
    pl: "siedem (7)",
    ar: "سبعة",
    ph: "sab3a",
    ex: { ar: "هنتقابل الساعة سبعة", ph: "hanet2aabel essaa3a sab3a", pl: "Spotkamy się o siódmej" },
  },
  {
    cat: "numbers_time",
    pl: "osiem (8)",
    ar: "تمانية",
    ph: "tamanya",
    ex: { ar: "عندي تمانية جنيه بس", ph: "3andi tamanya geneeh bas", pl: "Mam tylko osiem funtów" },
  },
  {
    cat: "numbers_time",
    pl: "dziewięć (9)",
    ar: "تسعة",
    ph: "tes3a",
    ex: { ar: "احنا تسعة في البيت", ph: "e7na tes3a fil-beet", pl: "Jest nas dziewięcioro w domu" },
  },
  {
    cat: "numbers_time",
    pl: "dziesięć (10)",
    ar: "عشرة",
    ph: "3ashara",
    ex: { ar: "عايز عشرة جنيه", ph: "3aayez 3ashara geneeh", pl: "Chcę dziesięć funtów" },
  },
  {
    cat: "numbers_time",
    pl: "jedenaście (11)",
    ar: "حداشر",
    ph: "Hidaashar",
    ex: { ar: "عندي حداشر كتاب", ph: "3andi Hidaashar kitaab", pl: "Mam jedenaście książek" },
  },
  {
    cat: "numbers_time",
    pl: "dwanaście (12)",
    ar: "اتناشر",
    ph: "etnaashar",
    ex: { ar: "الساعة اتناشر دلوقتي", ph: "essaa3a etnaashar dilwa2ti", pl: "Jest teraz dwunasta" },
  },
  {
    cat: "numbers_time",
    pl: "trzynaście (13)",
    ar: "تلتاشر",
    ph: "talattaashar",
    ex: { ar: "عندها تلتاشر سنة", ph: "3andaha talattaashar sana", pl: "Ona ma trzynaście lat" },
  },
  {
    cat: "numbers_time",
    pl: "czternaście (14)",
    ar: "أربعتاشر",
    ph: "arba3taashar",
    ex: { ar: "عندي أربعتاشر جنيه", ph: "3andi arba3taashar geneeh", pl: "Mam czternaście funtów" },
  },
  {
    cat: "numbers_time",
    pl: "piętnaście (15)",
    ar: "خمستاشر",
    ph: "khamastaashar",
    ex: { ar: "هوصل بعد خمستاشر دقيقة", ph: "hawSal ba3d khamastaashar di2ii2a", pl: "Przyjadę za piętnaście minut" },
  },
  {
    cat: "numbers_time",
    pl: "szesnaście (16)",
    ar: "ستاشر",
    ph: "sittaashar",
    ex: { ar: "عندي ستاشر سنة", ph: "3andi sittaashar sana", pl: "Mam szesnaście lat" },
  },
  {
    cat: "numbers_time",
    pl: "siedemnaście (17)",
    ar: "سبعتاشر",
    ph: "saba3taashar",
    ex: { ar: "عندي سبعتاشر جنيه بس", ph: "3andi saba3taashar geneeh bas", pl: "Mam tylko siedemnaście funtów" },
  },
  {
    cat: "numbers_time",
    pl: "osiemnaście (18)",
    ar: "تمنتاشر",
    ph: "tamantaashar",
    ex: { ar: "هنتقابل الساعة تمنتاشر", ph: "hanet2aabel essaa3a tamantaashar", pl: "Spotkamy się o osiemnastej" },
  },
  {
    cat: "numbers_time",
    pl: "dziewiętnaście (19)",
    ar: "تسعتاشر",
    ph: "tisa3taashar",
    ex: { ar: "عندي تسعتاشر كتاب", ph: "3andi tisa3taashar kitaab", pl: "Mam dziewiętnaście książek" },
  },
  {
    cat: "numbers_time",
    pl: "dwadzieścia (20)",
    ar: "عشرين",
    ph: "3ishriin",
    ex: { ar: "عايز عشرين جنيه", ph: "3aayez 3ishriin geneeh", pl: "Chcę dwadzieścia funtów" },
  },
  {
    cat: "numbers_time",
    pl: "dwadzieścia jeden (21)",
    ar: "واحد وعشرين",
    ph: "waaHed wi 3ishriin",
    ex: { ar: "عندي واحد وعشرين سنة", ph: "3andi waaHed wi 3ishriin sana", pl: "Mam dwadzieścia jeden lat" },
  },
  {
    cat: "numbers_time",
    pl: "trzydzieści (30)",
    ar: "تلاتين",
    ph: "talatiin",
    ex: { ar: "عندي تلاتين جنيه", ph: "3andi talatiin geneeh", pl: "Mam trzydzieści funtów" },
  },
  {
    cat: "numbers_time",
    pl: "trzydzieści pięć (35)",
    ar: "خمسة وتلاتين",
    ph: "khamsa wi talatiin",
    ex: { ar: "عندها خمسة وتلاتين سنة", ph: "3andaha khamsa wi talatiin sana", pl: "Ona ma trzydzieści pięć lat" },
  },
  {
    cat: "numbers_time",
    pl: "czterdzieści (40)",
    ar: "أربعين",
    ph: "arbe3iin",
    ex: { ar: "عايز أربعين كيلو سكر", ph: "3aayez arbe3iin kiilu sukkar", pl: "Chcę czterdzieści kilo cukru" },
  },
  {
    cat: "numbers_time",
    pl: "pięćdziesiąt (50)",
    ar: "خمسين",
    ph: "khamsiin",
    ex: { ar: "عندي خمسين جنيه بس", ph: "3andi khamsiin geneeh bas", pl: "Mam tylko pięćdziesiąt funtów" },
  },
  {
    cat: "numbers_time",
    pl: "sześćdziesiąt (60)",
    ar: "ستين",
    ph: "sittiin",
    ex: { ar: "هوصل بعد ستين دقيقة", ph: "hawSal ba3d sittiin di2ii2a", pl: "Przyjadę za sześćdziesiąt minut" },
  },
  {
    cat: "numbers_time",
    pl: "siedemdziesiąt (70)",
    ar: "سبعين",
    ph: "sab3iin",
    ex: { ar: "جدي عنده سبعين سنة", ph: "geddi 3andu sab3iin sana", pl: "Mój dziadek ma siedemdziesiąt lat" },
  },
  {
    cat: "numbers_time",
    pl: "osiemdziesiąt (80)",
    ar: "تمانين",
    ph: "tamaniin",
    ex: { ar: "ده غالي، تمانين جنيه", ph: "da ghaali, tamaniin geneeh", pl: "To drogie, osiemdziesiąt funtów" },
  },
  {
    cat: "numbers_time",
    pl: "dziewięćdziesiąt (90)",
    ar: "تسعين",
    ph: "tes3iin",
    ex: { ar: "عندي تسعين جنيه", ph: "3andi tes3iin geneeh", pl: "Mam dziewięćdziesiąt funtów" },
  },
  {
    cat: "numbers_time",
    pl: "dziewięćdziesiąt dziewięć (99)",
    ar: "تسعة وتسعين",
    ph: "tes3a wi tes3iin",
    ex: { ar: "ده تسعة وتسعين جنيه", ph: "da tes3a wi tes3iin geneeh", pl: "To dziewięćdziesiąt dziewięć funtów" },
  },
  {
    cat: "numbers_time",
    pl: "sto (100)",
    ar: "ميه",
    ph: "miyya",
    ex: { ar: "عايز ميه جنيه", ph: "3aayez miyya geneeh", pl: "Chcę sto funtów" },
  },
  {
    cat: "numbers_time",
    pl: "sto dwadzieścia pięć (125)",
    ar: "ميه وخمسة وعشرين",
    ph: "miyya wi khamsa wi 3ishriin",
    ex: { ar: "ده ميه وخمسة وعشرين جنيه", ph: "da miyya wi khamsa wi 3ishriin geneeh", pl: "To sto dwadzieścia pięć funtów" },
  },
  {
    cat: "numbers_time",
    pl: "dwieście (200)",
    ar: "ميتين",
    ph: "miteen",
    ex: { ar: "عندي ميتين جنيه", ph: "3andi miteen geneeh", pl: "Mam dwieście funtów" },
  },
  {
    cat: "numbers_time",
    pl: "trzysta (300)",
    ar: "تلتميه",
    ph: "tultumiyya",
    ex: { ar: "ده تلتميه جنيه", ph: "da tultumiyya geneeh", pl: "To trzysta funtów" },
  },
  {
    cat: "numbers_time",
    pl: "czterysta (400)",
    ar: "ربعميه",
    ph: "rub3umiyya",
    ex: { ar: "عايز ربعميه جنيه", ph: "3aayez rub3umiyya geneeh", pl: "Chcę czterysta funtów" },
  },
  {
    cat: "numbers_time",
    pl: "pięćset (500)",
    ar: "خمسميه",
    ph: "khamsumiyya",
    ex: { ar: "عندي خمسميه جنيه", ph: "3andi khamsumiyya geneeh", pl: "Mam pięćset funtów" },
  },
  {
    cat: "numbers_time",
    pl: "sześćset (600)",
    ar: "ستميه",
    ph: "suttumiyya",
    ex: { ar: "ده ستميه جنيه", ph: "da suttumiyya geneeh", pl: "To sześćset funtów" },
  },
  {
    cat: "numbers_time",
    pl: "siedemset (700)",
    ar: "سبعميه",
    ph: "sub3umiyya",
    ex: { ar: "عايز سبعميه جنيه", ph: "3aayez sub3umiyya geneeh", pl: "Chcę siedemset funtów" },
  },
  {
    cat: "numbers_time",
    pl: "osiemset (800)",
    ar: "تمنميه",
    ph: "tumnumiyya",
    ex: { ar: "ده تمنميه جنيه", ph: "da tumnumiyya geneeh", pl: "To osiemset funtów" },
  },
  {
    cat: "numbers_time",
    pl: "dziewięćset (900)",
    ar: "تسعميه",
    ph: "tus3umiyya",
    ex: { ar: "عندي تسعميه جنيه", ph: "3andi tus3umiyya geneeh", pl: "Mam dziewięćset funtów" },
  },
  {
    cat: "numbers_time",
    pl: "tysiąc (1 000)",
    ar: "ألف",
    ph: "alf",
    ex: { ar: "عايز ألف جنيه", ph: "3aayez alf geneeh", pl: "Chcę tysiąc funtów" },
  },
  {
    cat: "numbers_time",
    pl: "dwa tysiące (2 000)",
    ar: "ألفين",
    ph: "alfeen",
    ex: { ar: "عندي ألفين جنيه", ph: "3andi alfeen geneeh", pl: "Mam dwa tysiące funtów" },
  },
  {
    cat: "numbers_time",
    pl: "trzy tysiące (3 000)",
    ar: "تلات تلاف",
    ph: "talat talaaf",
    ex: { ar: "ده تلات تلاف جنيه", ph: "da talat talaaf geneeh", pl: "To trzy tysiące funtów" },
  },
  {
    cat: "numbers_time",
    pl: "cztery tysiące (4 000)",
    ar: "أربع تلاف",
    ph: "arba3 talaaf",
    ex: { ar: "عايز أربع تلاف جنيه", ph: "3aayez arba3 talaaf geneeh", pl: "Chcę cztery tysiące funtów" },
  },
  {
    cat: "numbers_time",
    pl: "pięć tysięcy (5 000)",
    ar: "خمس تلاف",
    ph: "khamas talaaf",
    ex: { ar: "عندي خمس تلاف جنيه", ph: "3andi khamas talaaf geneeh", pl: "Mam pięć tysięcy funtów" },
  },
  {
    cat: "numbers_time",
    pl: "sześć tysięcy (6 000)",
    ar: "ست تلاف",
    ph: "sit talaaf",
    ex: { ar: "ده ست تلاف جنيه", ph: "da sit talaaf geneeh", pl: "To sześć tysięcy funtów" },
  },
  {
    cat: "numbers_time",
    pl: "siedem tysięcy (7 000)",
    ar: "سبع تلاف",
    ph: "saba3 talaaf",
    ex: { ar: "عايز سبع تلاف جنيه", ph: "3aayez saba3 talaaf geneeh", pl: "Chcę siedem tysięcy funtów" },
  },
  {
    cat: "numbers_time",
    pl: "osiem tysięcy (8 000)",
    ar: "تمن تلاف",
    ph: "taman talaaf",
    ex: { ar: "عندي تمن تلاف جنيه", ph: "3andi taman talaaf geneeh", pl: "Mam osiem tysięcy funtów" },
  },
  {
    cat: "numbers_time",
    pl: "dziewięć tysięcy (9 000)",
    ar: "تسع تلاف",
    ph: "tisa3 talaaf",
    ex: { ar: "ده تسع تلاف جنيه", ph: "da tisa3 talaaf geneeh", pl: "To dziewięć tysięcy funtów" },
  },
  {
    cat: "numbers_time",
    pl: "dziesięć tysięcy (10 000)",
    ar: "عشر تلاف",
    ph: "3ashar talaaf",
    ex: { ar: "البيت ده عشر تلاف جنيه", ph: "el-beet da 3ashar talaaf geneeh", pl: "Ten dom kosztuje dziesięć tysięcy funtów" },
  },
  {
    cat: "numbers_time",
    pl: "sto tysięcy (100 000)",
    ar: "ميه ألف",
    ph: "miyyat alf",
    ex: { ar: "العربية دي ميه ألف جنيه", ph: "el-3arabiyya di miyyat alf geneeh", pl: "Ten samochód kosztuje sto tysięcy funtów" },
  },
  {
    cat: "numbers_time",
    pl: "milion (1 000 000)",
    ar: "مليون",
    ph: "milyoon",
    ex: { ar: "البيت ده بمليون جنيه", ph: "el-beet da bimilyoon geneeh", pl: "Ten dom kosztuje milion funtów" },
  },
  // ---- Godzina: liczby w praktyce ----
  {
    cat: "numbers_time",
    pl: "jest piąta (godzina)",
    ar: "الساعة خمسة",
    ph: "essaa3a khamsa",
    ex: { ar: "الساعة كام؟ الساعة خمسة", ph: "essaa3a kaam? essaa3a khamsa", pl: "Która godzina? Jest piąta" },
  },
  {
    cat: "numbers_time",
    pl: "jest wpół do szóstej",
    ar: "الساعة خمسة ونص",
    ph: "essaa3a khamsa wi nuSS",
    ex: { ar: "الساعة خمسة ونص دلوقتي", ph: "essaa3a khamsa wi nuSS dilwa2ti", pl: "Jest teraz wpół do szóstej" },
  },
  {
    cat: "numbers_time",
    pl: "piętnaście po piątej",
    ar: "الساعة خمسة وربع",
    ph: "essaa3a khamsa wi rub3",
    ex: { ar: "هنتقابل الساعة خمسة وربع", ph: "hanet2aabel essaa3a khamsa wi rub3", pl: "Spotkamy się piętnaście po piątej" },
  },
  {
    cat: "numbers_time",
    pl: "za piętnaście szósta",
    ar: "الساعة ستة إلا ربع",
    ph: "essaa3a setta illa rub3",
    ex: { ar: "هوصل الساعة ستة إلا ربع", ph: "hawSal essaa3a setta illa rub3", pl: "Przyjadę za piętnaście szósta" },
  },
  {
    cat: "numbers_time",
    pl: "za dziesięć minut",
    ar: "بعد عشر دقايق",
    ph: "ba3d 3ashar da2aayi2",
    ex: { ar: "هوصل بعد عشر دقايق", ph: "hawSal ba3d 3ashar da2aayi2", pl: "Przyjadę za dziesięć minut" },
  },
  {
    cat: "numbers_time",
    pl: "dwadzieścia minut temu",
    ar: "من عشرين دقيقة",
    ph: "min 3ishriin di2ii2a",
    ex: { ar: "هو وصل من عشرين دقيقة", ph: "huwwa waSal min 3ishriin di2ii2a", pl: "On przyjechał dwadzieścia minut temu" },
  },
  {
    cat: "numbers_time",
    pl: "o siódmej wieczorem",
    ar: "الساعة سبعة بالليل",
    ph: "essaa3a sab3a bil-leel",
    ex: { ar: "هنتقابل الساعة سبعة بالليل", ph: "hanet2aabel essaa3a sab3a bil-leel", pl: "Spotkamy się o siódmej wieczorem" },
  },
  {
    cat: "numbers_time",
    pl: "o dziewiątej rano",
    ar: "الساعة تسعة الصبح",
    ph: "essaa3a tes3a iS-SubH",
    ex: { ar: "الشغل بيبدأ الساعة تسعة الصبح", ph: "esh-shughl beyebda2 essaa3a tes3a iS-SubH", pl: "Praca zaczyna się o dziewiątej rano" },
  },
  // ---- Pogoda: liczby w praktyce ----
  {
    cat: "numbers_time",
    pl: "temperatura wynosi trzydzieści stopni",
    ar: "الحرارة تلاتين درجة",
    ph: "el-Haraara talatiin daraga",
    ex: { ar: "النهاردة الحرارة تلاتين درجة", ph: "ennaharda el-Haraara talatiin daraga", pl: "Dzisiaj temperatura wynosi trzydzieści stopni" },
  },
  {
    cat: "numbers_time",
    pl: "ile jest stopni dzisiaj?",
    ar: "الحرارة كام درجة النهاردة؟",
    ph: "el-Haraara kaam daraga ennaharda?",
    ex: { ar: "الحرارة كام درجة النهاردة؟ أربعين درجة", ph: "el-Haraara kaam daraga ennaharda? arbe3iin daraga", pl: "Ile jest stopni dzisiaj? Czterdzieści stopni" },
  },
  {
    cat: "numbers_time",
    pl: "jest czterdzieści stopni, bardzo gorąco",
    ar: "أربعين درجة، الجو حر جدا",
    ph: "arbe3iin daraga, el-gaww Harr giddan",
    ex: { ar: "النهاردة أربعين درجة، الجو حر جدا", ph: "ennaharda arbe3iin daraga, el-gaww Harr giddan", pl: "Dzisiaj jest czterdzieści stopni, bardzo gorąco" },
  },
  {
    cat: "numbers_time",
    pl: "tylko dziesięć stopni, bardzo zimno",
    ar: "عشرة درجة بس، الجو برد جدا",
    ph: "3ashara daraga bas, el-gaww bard giddan",
    ex: { ar: "بكرة عشرة درجة بس، الجو برد جدا", ph: "bukra 3ashara daraga bas, el-gaww bard giddan", pl: "Jutro jest tylko dziesięć stopni, bardzo zimno" },
  },
  {
    cat: "numbers_time",
    pl: "prognoza na pięć dni",
    ar: "نشرة الجو لخمس تيام",
    ph: "nashret el-gaww li-khamas tiyaam",
    ex: { ar: "شوفت نشرة الجو لخمس تيام؟", ph: "shuft nashret el-gaww li-khamas tiyaam?", pl: "Widziałeś prognozę na pięć dni?" },
  },
  {
    cat: "numbers_time",
    pl: "będzie dwadzieścia pięć stopni jutro",
    ar: "بكرة هتكون خمسة وعشرين درجة",
    ph: "bukra hatkuun khamsa wi 3ishriin daraga",
    ex: { ar: "بكرة هتكون خمسة وعشرين درجة، جو لطيف", ph: "bukra hatkuun khamsa wi 3ishriin daraga, gaww laTiif", pl: "Jutro będzie dwadzieścia pięć stopni, miła pogoda" },
  },
  // ---- Dni tygodnia ----
  {
    cat: "calendar",
    pl: "niedziela",
    ar: "يوم الحد",
    ph: "yoom el-Hadd",
    ex: { ar: "هشوفك يوم الحد", ph: "hashuufak yoom el-Hadd", pl: "Zobaczę się z tobą w niedzielę" },
  },
  {
    cat: "calendar",
    pl: "poniedziałek",
    ar: "يوم الاتنين",
    ph: "yoom el-etneen",
    ex: { ar: "الشغل بيبدأ يوم الاتنين", ph: "esh-shughl beyebda2 yoom el-etneen", pl: "Praca zaczyna się w poniedziałek" },
  },
  {
    cat: "calendar",
    pl: "wtorek",
    ar: "يوم التلات",
    ph: "yoom et-talaat",
    ex: { ar: "عندي اجتماع يوم التلات", ph: "3andi egtimaa3 yoom et-talaat", pl: "Mam spotkanie we wtorek" },
  },
  {
    cat: "calendar",
    pl: "środa",
    ar: "يوم الأربع",
    ph: "yoom el-arba3",
    ex: { ar: "هروح المطعم يوم الأربع", ph: "haruuH el-maT3am yoom el-arba3", pl: "Pójdę do restauracji w środę" },
  },
  {
    cat: "calendar",
    pl: "czwartek",
    ar: "يوم الخميس",
    ph: "yoom el-khamiis",
    ex: { ar: "بكرة يوم الخميس", ph: "bukra yoom el-khamiis", pl: "Jutro jest czwartek" },
  },
  {
    cat: "calendar",
    pl: "piątek",
    ar: "يوم الجمعة",
    ph: "yoom el-gum3a",
    ex: { ar: "يوم الجمعة أجازة", ph: "yoom el-gum3a agaaza", pl: "Piątek jest wolny (dniem wolnym)" },
  },
  {
    cat: "calendar",
    pl: "sobota",
    ar: "يوم السبت",
    ph: "yoom es-sabt",
    ex: { ar: "يوم السبت برضو أجازة", ph: "yoom es-sabt barDu agaaza", pl: "Sobota też jest wolna" },
  },
  {
    cat: "calendar",
    pl: "jaki dzisiaj jest dzień?",
    ar: "النهاردة ايه؟",
    ph: "ennaharda eeh?",
    ex: { ar: "النهاردة ايه؟ النهاردة الأربع", ph: "ennaharda eeh? ennaharda el-arba3", pl: "Jaki dzisiaj jest dzień? Dzisiaj jest środa" },
  },
  {
    cat: "calendar",
    pl: "dzień, dni",
    ar: "يوم، تيام",
    ph: "yoom, tiyaam",
    ex: { ar: "هقعد هناك تلات تيام", ph: "ha2aud hinaak talat tiyaam", pl: "Zostanę tam trzy dni" },
  },
  {
    cat: "calendar",
    pl: "tydzień",
    ar: "أسبوع",
    ph: "isbuu3",
    ex: { ar: "هشوفك الإسبوع الجاي", ph: "hashuufak el-isbuu3 el-gayy", pl: "Zobaczę się z tobą w następnym tygodniu" },
  },
  // ---- Miesiące ----
  {
    cat: "calendar",
    pl: "styczeń",
    ar: "يناير",
    ph: "yanaayer",
    ex: { ar: "عيد ميلادي في يناير", ph: "3iid milaadi fi yanaayer", pl: "Moje urodziny są w styczniu" },
  },
  {
    cat: "calendar",
    pl: "luty",
    ar: "فبراير",
    ph: "febraayer",
    ex: { ar: "هنسافر في فبراير", ph: "hanesaafer fi febraayer", pl: "Wyjedziemy w lutym" },
  },
  {
    cat: "calendar",
    pl: "marzec",
    ar: "مارس",
    ph: "maares",
    ex: { ar: "الجو بيتحسن في مارس", ph: "el-gaww beyetHassen fi maares", pl: "Pogoda się poprawia w marcu" },
  },
  {
    cat: "calendar",
    pl: "kwiecień",
    ar: "إبريل",
    ph: "ebriil",
    ex: { ar: "إبريل شهر لطيف في مصر", ph: "ebriil shahr laTiif fi maSr", pl: "Kwiecień jest miłym miesiącem w Egipcie" },
  },
  {
    cat: "calendar",
    pl: "maj",
    ar: "مايو",
    ph: "maayo",
    ex: { ar: "بنتجوز في مايو", ph: "bnetgawwez fi maayo", pl: "Bierzemy ślub w maju" },
  },
  {
    cat: "calendar",
    pl: "czerwiec",
    ar: "يونيو",
    ph: "yonyo",
    ex: { ar: "المدرسة بتخلص في يونيو", ph: "el-madrasa betkhallaS fi yonyo", pl: "Szkoła się kończy w czerwcu" },
  },
  {
    cat: "calendar",
    pl: "lipiec",
    ar: "يوليو",
    ph: "yolyo",
    ex: { ar: "الجو حر جدا في يوليو", ph: "el-gaww Harr giddan fi yolyo", pl: "W lipcu jest bardzo gorąco" },
  },
  {
    cat: "calendar",
    pl: "sierpień",
    ar: "أغسطس",
    ph: "aghosTos",
    ex: { ar: "هروح البحر في أغسطس", ph: "haruuH el-baHr fi aghosTos", pl: "Pojadę nad morze w sierpniu" },
  },
  {
    cat: "calendar",
    pl: "wrzesień",
    ar: "سبتمبر",
    ph: "sebtember",
    ex: { ar: "المدرسة بتبدأ في سبتمبر", ph: "el-madrasa betebda2 fi sebtember", pl: "Szkoła zaczyna się we wrześniu" },
  },
  {
    cat: "calendar",
    pl: "październik",
    ar: "أكتوبر",
    ph: "oktoobar",
    ex: { ar: "الجو حلو في أكتوبر", ph: "el-gaww Helw fi oktoobar", pl: "Pogoda jest piękna w październiku" },
  },
  {
    cat: "calendar",
    pl: "listopad",
    ar: "نوفمبر",
    ph: "novamber",
    ex: { ar: "بيبدأ يبرد في نوفمبر", ph: "beyebda2 yebrad fi novamber", pl: "Zaczyna się robić zimno w listopadzie" },
  },
  {
    cat: "calendar",
    pl: "grudzień",
    ar: "ديسمبر",
    ph: "disamber",
    ex: { ar: "هقعد مع عيلتي في ديسمبر", ph: "ha2aud ma3a 3eelti fi disamber", pl: "Spędzę czas z rodziną w grudniu" },
  },
  {
    cat: "calendar",
    pl: "miesiąc",
    ar: "شهر",
    ph: "shahr",
    ex: { ar: "هقعد في مصر شهر", ph: "ha2aud fi maSr shahr", pl: "Zostanę w Egipcie miesiąc" },
  },
  {
    cat: "calendar",
    pl: "w jakim miesiącu?",
    ar: "في أي شهر؟",
    ph: "fi ayyi shahr?",
    ex: { ar: "هتسافر في أي شهر؟", ph: "hatesaafer fi ayyi shahr?", pl: "W jakim miesiącu wyjedziesz?" },
  },
  // ---- Pory roku ----
  {
    cat: "calendar",
    pl: "lato",
    ar: "الصيف",
    ph: "eS-Seef",
    ex: { ar: "الصيف في مصر حر جدا", ph: "eS-Seef fi maSr Harr giddan", pl: "Lato w Egipcie jest bardzo gorące" },
  },
  {
    cat: "calendar",
    pl: "zima",
    ar: "الشتا",
    ph: "esh-shetaa",
    ex: { ar: "الشتا في القاهرة معتدل", ph: "esh-shetaa fil-2aahera mu3tadel", pl: "Zima w Kairze jest umiarkowana" },
  },
  {
    cat: "calendar",
    pl: "wiosna",
    ar: "الربيع",
    ph: "er-rabii3",
    ex: { ar: "الربيع أحلى فصل في السنة", ph: "er-rabii3 aHla faSl fis-sana", pl: "Wiosna jest najpiękniejszą porą roku" },
  },
  {
    cat: "calendar",
    pl: "jesień",
    ar: "الخريف",
    ph: "el-khariif",
    ex: { ar: "الخريف بيبدأ في سبتمبر", ph: "el-khariif beyebda2 fi sebtember", pl: "Jesień zaczyna się we wrześniu" },
  },
  {
    cat: "calendar",
    pl: "jaka jest twoja ulubiona pora roku?",
    ar: "إيه فصل السنة المفضل عندك؟",
    ph: "eeh faSl es-sana el-mufaDDal 3andak?",
    ex: { ar: "إيه فصل السنة المفضل عندك؟ الربيع", ph: "eeh faSl es-sana el-mufaDDal 3andak? er-rabii3", pl: "Jaka jest twoja ulubiona pora roku? Wiosna" },
  },
  {
    cat: "calendar",
    pl: "rok",
    ar: "سنة",
    ph: "sana",
    ex: { ar: "كل سنة وانت طيب", ph: "koll sana we (e)nta Tayyeb", pl: "Wszystkiego dobrego (co roku bądź dobry)" },
  },
];

// ---------- Kategorie / działy tematyczne ----------
const CATEGORIES = [
  { key: "basics", label: "Powitania i podstawy", emoji: "👋" },
  { key: "questions", label: "Pytania i zwroty użytkowe", emoji: "❓" },
  { key: "numbers_time", label: "Liczby i czas", emoji: "🕐" },
  { key: "calendar", label: "Dni, miesiące, pory roku", emoji: "📅" },
  { key: "feelings", label: "Uczucia i samopoczucie", emoji: "💭" },
  { key: "work_daily", label: "Praca i codzienność", emoji: "💼" },
  { key: "food_shopping", label: "Jedzenie i zakupy", emoji: "🍽️" },
  { key: "kitchen", label: "Kuchnia (potrawy, smaki)", emoji: "🍳" },
  { key: "home_hotel", label: "Dom i hotel", emoji: "🏠" },
  { key: "travel", label: "Podróże i transport", emoji: "🚕" },
  { key: "body_services", label: "Ciało i drobne usługi", emoji: "🧵" },
  { key: "family", label: "Rodzina i bliscy", emoji: "👨‍👩‍👧" },
  { key: "health", label: "Zdrowie i samopoczucie", emoji: "🩺" },
  { key: "weather", label: "Pogoda", emoji: "🌤️" },
  { key: "smalltalk", label: "Small talk (rozmowy)", emoji: "💭" },
  { key: "fillers", label: "Wygładzacze i reakcje", emoji: "🗯️" },
  { key: "slang", label: "Slang (jak miejscowy)", emoji: "😎" },
  { key: "life", label: "O sobie i życiu", emoji: "🙋" },
  { key: "colors", label: "Kolory", emoji: "🎨" },
  { key: "adjectives", label: "Przymiotniki opisowe", emoji: "📏" },
  { key: "daily_verbs", label: "Czasowniki codzienne", emoji: "⚡" },
  { key: "motion", label: "Czasowniki ruchu", emoji: "🚶" },
  { key: "time_adverbs", label: "Przysłówki czasu", emoji: "⏰" },
  { key: "body", label: "Ciało", emoji: "🧍" },
  { key: "clothes", label: "Ubrania", emoji: "👕" },
  { key: "home_furniture", label: "Dom i meble", emoji: "🛋️" },
  { key: "nature", label: "Natura i miejsca", emoji: "🏞️" },
  { key: "transport", label: "Transport", emoji: "🚗" },
  { key: "jobs", label: "Zawody", emoji: "💼" },
  { key: "emotions", label: "Emocje i stany", emoji: "😊" },
  { key: "animals", label: "Zwierzęta", emoji: "🐾" },
  { key: "ordinals", label: "Liczby porządkowe", emoji: "🔢" },
  { key: "expressions", label: "Wyrażenia codzienne", emoji: "💬" },
  { key: "conjunctions", label: "Spójniki i łączniki", emoji: "🔗" },
  { key: "religious", label: "Wyrażenia religijne", emoji: "🕌" },
  { key: "verbs", label: "Czasowniki (odmiana)", emoji: "🔁" },
  { key: "nouns", label: "Rzeczowniki (liczba)", emoji: "🔢" },
  { key: "questions_pron", label: "Zaimki pytające", emoji: "❔" },
  { key: "grammar", label: "Gramatyka (wskazujące, liczebniki, przyimki)", emoji: "🧩" },
  { key: "other", label: "Inne / dodane przez Ciebie", emoji: "✨" },
];

function categoryLabel(key) {
  const c = CATEGORIES.find((c) => c.key === key);
  return c ? `${c.emoji} ${c.label}` : "✨ Inne / dodane przez Ciebie";
}


// Każdy czasownik: bezokolicznik (forma "on"), znaczenie, oraz odmiana
// przez 8 zaimków z transkrypcją i przykładowym zdaniem.
const PRONOUNS = [
  { key: "ana", pl: "ja", ar: "أنا", ph: "ana" },
  { key: "enta", pl: "ty (m.)", ar: "انت", ph: "enta" },
  { key: "enti", pl: "ty (f.)", ar: "انتي", ph: "enti" },
  { key: "huwwa", pl: "on", ar: "هو", ph: "huwwa" },
  { key: "heyya", pl: "ona", ar: "هي", ph: "heyya" },
  { key: "e7na", pl: "my", ar: "احنا", ph: "e7na" },
  { key: "ento", pl: "wy", ar: "انتو", ph: "ento" },
  { key: "homma", pl: "oni/one", ar: "هم", ph: "homma" },
];

// Wzory odmiany czasownika REGULARNEGO (trójspółgłoskowego) na przykładzie
// كتب (k-t-b, „pisać"). Pokazuje przedrostki/przyrostki dla każdej osoby —
// systematyka, dzięki której można odmienić dowolny regularny czasownik.
const CONJ_PATTERN = {
  present: {
    label: "teraźniejszy (بـ + temat)",
    note: "Czas teraźniejszy/ciągły: przedrostek بـ (bi-) + osobowy przedrostek. Temat: -ktib-.",
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
    note: "Czas przeszły: rdzeń katab- + osobowa końcówka. Bez przedrostków.",
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
    note: "Czas przyszły: przedrostek هـ (ha-) zamiast بـ, reszta jak w teraźniejszym.",
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
    note: "Uwaga na przeszły „ja/ty”: naam → nemt (długie „aa” staje się krótkim „e”). Tak samo: raaḥ→ruḥt, shaaf→shuft.",
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
    note: "Końcówka „ja/ty” w przeszłym to -eet (ishtareet). Tak samo: eddi→eddeet (dać), nesi→neseet (zapomnieć).",
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
    note: "Podwójna spółgłoska „rozdziela się” przez -eet w 1./2. os. przeszłego: Habb → Habbeet.",
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
    note: "„przyjść” ma nietypowy przeszły (geh/gum) i rozkaźnik z innego rdzenia (ta3aala). Podobnie „wziąć” (khad) i „jeść” (kal) gubią hamzę.",
  },
];

const VERBS = [
  {
    pl: "chcieć",
    ar: "عايز",
    ph: "3aayez",
    note: "Nie jest to czasownik w klasycznym sensie, lecz aktywny imiesłów (ism fa3il) — odmienia się jak przymiotnik przez rodzaj/liczbę, nie przez osobę. W czasie przeszłym i przyszłym łączy się z czasownikiem „być” (kaan/hykuun).",
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
    ar: "لازم",
    ph: "laazem",
    note: "„لازم” (laazem) to nieodmienna partykuła modalna „trzeba / muszę”. Sama się nie odmienia — odmienia się czasownik następujący po niej, i to w trybie łączącym (subjunctive), czyli bez przedrostka „بـ” (tu na przykładzie „iść”: aruu7). Czas przeszły tworzy się przez „كان لازم” (kaan laazem = „musiałem / trzeba było”), a przyszły zwykle pokrywa się z formą teraźniejszą (لازم + subjunctive).",
    tenses: {
      present: [
        { pronoun: "ana", ar: "لازم أروح", ph: "laazem aruu7", pl: "muszę iść" },
        { pronoun: "enta", ar: "لازم تروح", ph: "laazem tiruu7", pl: "musisz iść (m.)" },
        { pronoun: "enti", ar: "لازم تروحي", ph: "laazem tiruu7i", pl: "musisz iść (f.)" },
        { pronoun: "huwwa", ar: "لازم يروح", ph: "laazem yiruu7", pl: "musi iść (on)" },
        { pronoun: "heyya", ar: "لازم تروح", ph: "laazem tiruu7", pl: "musi iść (ona)" },
        { pronoun: "e7na", ar: "لازم نروح", ph: "laazem niruu7", pl: "musimy iść" },
        { pronoun: "ento", ar: "لازم تروحوا", ph: "laazem tiruu7u", pl: "musicie iść" },
        { pronoun: "homma", ar: "لازم يروحوا", ph: "laazem yiruu7u", pl: "muszą iść" },
      ],
      past: [
        { pronoun: "ana", ar: "كان لازم أروح", ph: "kaan laazem aruu7", pl: "musiałem/am iść" },
        { pronoun: "enta", ar: "كان لازم تروح", ph: "kaan laazem tiruu7", pl: "musiałeś iść (m.)" },
        { pronoun: "enti", ar: "كان لازم تروحي", ph: "kaan laazem tiruu7i", pl: "musiałaś iść (f.)" },
        { pronoun: "huwwa", ar: "كان لازم يروح", ph: "kaan laazem yiruu7", pl: "musiał iść (on)" },
        { pronoun: "heyya", ar: "كان لازم تروح", ph: "kaan laazem tiruu7", pl: "musiała iść (ona)" },
        { pronoun: "e7na", ar: "كان لازم نروح", ph: "kaan laazem niruu7", pl: "musieliśmy iść" },
        { pronoun: "ento", ar: "كان لازم تروحوا", ph: "kaan laazem tiruu7u", pl: "musieliście iść" },
        { pronoun: "homma", ar: "كان لازم يروحوا", ph: "kaan laazem yiruu7u", pl: "musieli iść" },
      ],
      future: [
        { pronoun: "ana", ar: "هيبقى لازم أروح", ph: "haybqa laazem aruu7", pl: "będę musiał/a iść" },
        { pronoun: "enta", ar: "هيبقى لازم تروح", ph: "haybqa laazem tiruu7", pl: "będziesz musiał iść (m.)" },
        { pronoun: "enti", ar: "هيبقى لازم تروحي", ph: "haybqa laazem tiruu7i", pl: "będziesz musiała iść (f.)" },
        { pronoun: "huwwa", ar: "هيبقى لازم يروح", ph: "haybqa laazem yiruu7", pl: "będzie musiał iść (on)" },
        { pronoun: "heyya", ar: "هيبقى لازم تروح", ph: "haybqa laazem tiruu7", pl: "będzie musiała iść (ona)" },
        { pronoun: "e7na", ar: "هيبقى لازم نروح", ph: "haybqa laazem niruu7", pl: "będziemy musieli iść" },
        { pronoun: "ento", ar: "هيبقى لازم تروحوا", ph: "haybqa laazem tiruu7u", pl: "będziecie musieli iść" },
        { pronoun: "homma", ar: "هيبقى لازم يروحوا", ph: "haybqa laazem yiruu7u", pl: "będą musieli iść" },
      ],
    },
  },
  {
    pl: "przyjść / przychodzić",
    ar: "بييجي",
    ph: "biyiigi",
    note: "Nieregularny. Rozkaźnik: ta3aala (chodź). Czas przeszły od rdzenia „g-y-2”.",
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
    ar: "بياخد",
    ph: "biyaakhod",
    note: "Nieregularny (rdzeń a-kh-d). Rozkaźnik: khod (weź).",
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
    ar: "بيدي",
    ph: "biyeddi",
    note: "Rozkaźnik: iddi / eddiini (daj mi). Często z sufiksem: eddiini (daj mi).",
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
    ar: "بيرجع",
    ph: "biyirga3",
    note: "Regularny (r-g-3). Też: „stawać się” w niektórych kontekstach.",
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
    ar: "بينام",
    ph: "biynaam",
    note: "Czasownik pusty (środkowa „a” długa). Rozkaźnik: naam.",
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
    ar: "بيشتري",
    ph: "biyishteri",
    note: "Czasownik z „słabą” końcówką (-i). Rozkaźnik: eshteri.",
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
    ar: "بيفتح",
    ph: "biyiftaH",
    note: "Regularny (f-t-H). Rozkaźnik: eftaH.",
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
    ar: "بيكتب",
    ph: "biyiktib",
    note: "Regularny (k-t-b). Rozkaźnik: ekteb.",
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
    ar: "بيقدر",
    ph: "biyi2dar",
    note: "Wyraża zdolność („umieć/dać radę”). Po nim czasownik w subjunctive.",
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
    ar: "بيحب",
    ph: "biyHebb",
    note: "Podwojony (H-b-b). „baHebb” = lubię/kocham; jeden z najczęstszych.",
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
    key: "yeruu7", pl: "iść / jechać", ar: "يروح", ph: "yiruu7",
    sub: {
      ana:   { ar: "أروح",   ph: "aruu7" },
      enta:  { ar: "تروح",   ph: "tiruu7" },
      enti:  { ar: "تروحي",  ph: "tiruu7i" },
      huwwa: { ar: "يروح",   ph: "yiruu7" },
      heyya: { ar: "تروح",   ph: "tiruu7" },
      e7na:  { ar: "نروح",   ph: "niruu7" },
      ento:  { ar: "تروحوا", ph: "tiruu7u" },
      homma: { ar: "يروحوا", ph: "yiruu7u" },
    },
  },
  {
    key: "yaakol", pl: "jeść", ar: "ياكل", ph: "yaakol",
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
    key: "yeshrab", pl: "pić", ar: "يشرب", ph: "yeshrab",
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
    key: "yekteb", pl: "pisać", ar: "يكتب", ph: "yekteb",
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
    key: "ye3mel", pl: "robić", ar: "يعمل", ph: "ye3mel",
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
    key: "laazem", pl: "musieć", ar: "لازم", ph: "laazem",
    note: "„لازم” jest nieodmienne — dla każdej osoby to samo. Odmienia się tylko czasownik bazowy (subjunctive). Przeszłość: „كان لازم”, przyszłość: „هيبقى لازم”.",
    stem: {
      present: { all: { ar: "لازم", ph: "laazem" } },
      past:    { pre: { ar: "كان لازم", ph: "kaan laazem" } },
      future:  { pre: { ar: "هيبقى لازم", ph: "haybqa laazem" } },
    },
  },
  {
    key: "mumken", pl: "móc / można (mieć pozwolenie)", ar: "ممكن", ph: "mumken",
    note: "„ممكن” (mumken) wyraża możliwość/pozwolenie („mogę, można, czy mogę…?”). Nieodmienne — odmienia się czasownik bazowy. Przeszłość: „كان ممكن” (mógłbym był / można było), przyszłość zwykle jak teraźniejszość.",
    stem: {
      present: { all: { ar: "ممكن", ph: "mumken" } },
      past:    { pre: { ar: "كان ممكن", ph: "kaan mumken" } },
      future:  { all: { ar: "ممكن", ph: "mumken" } },
    },
  },
  {
    key: "3aayez", pl: "chcieć", ar: "عايز", ph: "3aayez",
    note: "„عايز” zgadza się RODZAJEM i LICZBĄ z podmiotem (عايز m. / عايزة f. / عايزين l.mn.), a czasownik bazowy stoi w subjunctive. Przeszłość: „كنت عايز…”, przyszłość: „هكون عايز…”.",
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
    gen: "m", pl: "książka",
    sing: { ar: "كتاب", ph: "ketaab" },
    dual: { ar: "كتابين", ph: "ketabeen" },
    plur: { ar: "كتب", ph: "kotob" },
    note: "Liczba mnoga łamana (kotob). Dual regularny: ketaab → ketabeen.",
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
    gen: "m", pl: "dom",
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
    gen: "f", pl: "torba / torebka",
    sing: { ar: "شنطة", ph: "shanTa" },
    dual: { ar: "شنطتين", ph: "shanTeteen" },
    plur: { ar: "شنط", ph: "shonaT" },
    note: "Rzeczownik żeński z końcówką ـة (ta marbuta). W dualu ـة zamienia się na ـت + ـين (shanTa → shanTeteen).",
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
    gen: "f", pl: "samochód",
    sing: { ar: "عربية", ph: "3arabeyya" },
    dual: { ar: "عربيتين", ph: "3arabeyyeteen" },
    plur: { ar: "عربيات", ph: "3arabeyyaat" },
    note: "Liczba mnoga regularna żeńska: ـات (-aat).",
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
    gen: "m", pl: "chłopiec",
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
    gen: "f", pl: "dziewczyna / córka",
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
    gen: "m", pl: "dzień",
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
    gen: "m", pl: "pokój",
    sing: { ar: "أوضة", ph: "2uDa" },
    dual: { ar: "أوضتين", ph: "2uDeteen" },
    plur: { ar: "أوض", ph: "2owaD" },
    note: "Uwaga: أوضة ma końcówkę ـة, ale jest rodzaju żeńskiego mimo zapisu — to jeden z często mylonych wyrazów.",
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
    gen: "m", pl: "stół",
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
    gen: "m", pl: "klucz",
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
    gen: "m", pl: "telefon / komórka",
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
    gen: "f", pl: "ręka",
    sing: { ar: "إيد", ph: "2iid" },
    dual: { ar: "إيدين", ph: "2iideen" },
    plur: { ar: "أيادي", ph: "2ayaadi" },
    note: "Części ciała występujące parami są rodzaju żeńskiego; dual (2iideen) jest tu formą używaną najczęściej.",
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
    gen: "m", pl: "przyjaciel",
    sing: { ar: "صاحب", ph: "SaaHeb" },
    dual: { ar: "صاحبين", ph: "SaHbeen" },
    plur: { ar: "أصحاب", ph: "aS7aab" },
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
    gen: "f", pl: "praca / robota",
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
];

// Etykiety sufiksów dzierżawczych (8 osób).
const POSS_SUFFIXES = [
  { key: "i",   suf: "ـي",  pl: "mój / moja",        ph: "-i" },
  { key: "ak",  suf: "ـك",  pl: "twój (m.)",         ph: "-ak" },
  { key: "ik",  suf: "ـك",  pl: "twój (f.)",         ph: "-ek" },
  { key: "uh",  suf: "ـه",  pl: "jego",              ph: "-uh" },
  { key: "ha",  suf: "ـها", pl: "jej",               ph: "-ha" },
  { key: "na",  suf: "ـنا", pl: "nasz",              ph: "-na" },
  { key: "ku",  suf: "ـكو", pl: "wasz",              ph: "-ku" },
  { key: "hum", suf: "ـهم", pl: "ich",               ph: "-hom" },
];

const NOUN_NUM_LABELS = {
  sing: "l. pojedyncza",
  dual: "l. podwójna",
  plur: "l. mnoga",
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

// Naturalne dopełnienie do przykładu czasownika (żeby przykład był pełnym zdaniem,
// nie tylko „zaimek + czasownik”). Klucz = bezokolicznik polski.
const VERB_OBJECTS = {
  "chcieć": { ar: "شاي", ph: "shaay", pl: "herbaty" },
  "robić": { ar: "حاجة", ph: "Haaga", pl: "coś" },
  "pić": { ar: "قهوة", ph: "2ahwa", pl: "kawę" },
  "rozumieć": { ar: "الدرس", ph: "id-dars", pl: "lekcję" },
  "pracować": { ar: "هنا", ph: "hena", pl: "tutaj" },
  "widzieć": { ar: "البحر", ph: "il-baHr", pl: "morze" },
  "wiedzieć": { ar: "كل حاجة", ph: "koll Haaga", pl: "wszystko" },
  "musieć": { ar: "أروح", ph: "aruuH", pl: "iść" },
  "spać": { ar: "بدري", ph: "badri", pl: "wcześnie" },
  "pisać": { ar: "رسالة", ph: "resaala", pl: "list" },
};

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
        let ex;
        if (pronoun) {
          ex = obj
            ? {
                ar: `${pronoun.ar} ${f.ar} ${obj.ar}`,
                ph: `${pronoun.ph} ${f.ph} ${obj.ph}`,
                pl: `${pronoun.pl} ${plClean} ${obj.pl}`,
              }
            : {
                ar: `${pronoun.ar} ${f.ar}`,
                ph: `${pronoun.ph} ${f.ph}`,
                pl: `${pronoun.pl} ${plClean}`,
              };
        }
        out.push({
          cat: "verbs",
          pl: `${f.pl} (${v.pl}, ${TENSE_LABELS[tenseKey]})`,
          ar: f.ar,
          ph: f.ph,
          ex,
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
    pl: "co?", ar: "إيه", ph: "eeh",
    note: "Zwykle na końcu zdania: „da eeh?” (co to?), „ismak eeh?” (jak się nazywasz?).",
    ex: { ar: "ده إيه؟", ph: "da eeh?", pl: "Co to jest?" },
  },
  {
    pl: "kto?", ar: "مين", ph: "meen",
    ex: { ar: "مين ده؟", ph: "meen da?", pl: "Kto to (jest)?" },
  },
  {
    pl: "gdzie?", ar: "فين", ph: "feen",
    ex: { ar: "الحمام فين؟", ph: "il-Hammaam feen?", pl: "Gdzie jest łazienka?" },
  },
  {
    pl: "kiedy?", ar: "إمتى", ph: "emta",
    ex: { ar: "هتيجي إمتى؟", ph: "hatiigi emta?", pl: "Kiedy przyjdziesz?" },
  },
  {
    pl: "dlaczego?", ar: "ليه", ph: "leeh",
    ex: { ar: "ليه زعلان؟", ph: "leeh za3laan?", pl: "Dlaczego jesteś smutny?" },
  },
  {
    pl: "jak?", ar: "إزاي", ph: "ezzaay",
    ex: { ar: "عامل إزاي؟", ph: "3aamel ezzaay?", pl: "Jak się masz? (do mężczyzny)" },
  },
  {
    pl: "ile?", ar: "كام", ph: "kaam",
    note: "Po „kaam” rzeczownik stoi w liczbie POJEDYNCZEJ: „kaam yoom?” (ile dni?).",
    ex: { ar: "بكام؟", ph: "bikaam?", pl: "Za ile? / Ile kosztuje?" },
  },
  {
    pl: "który / jaki?", ar: "أنهي", ph: "anhi",
    note: "Rodzaj męski „anhu”, żeński „anhi”; w mowie często „anhi” dla obu.",
    ex: { ar: "أنهي واحد؟", ph: "anhi waaHed?", pl: "Który (z nich)?" },
  },
  {
    pl: "czyj?", ar: "بتاع مين", ph: "betaa3 meen",
    note: "Dosłownie „należący do kogo”. Zgadza się rodzajem: bitaa3 (m.) / bitaa3et (f.) / bituu3 (l.mn.).",
    ex: { ar: "الكتاب ده بتاع مين؟", ph: "il-ketaab da betaa3 meen?", pl: "Czyja jest ta książka?" },
  },
  {
    pl: "ile? (liczba)", ar: "كام واحد", ph: "kaam waaHed",
    note: "„kaam” samo pyta o liczbę; „kaam waaHed” = „ile sztuk / ilu”.",
    ex: { ar: "كام واحد عايز؟", ph: "kaam waaHed 3aayez?", pl: "Ile (sztuk) chcesz?" },
  },
];

function questionWordsToWords(qws) {
  return qws.map((q) => ({
    cat: "questions_pron",
    pl: `${q.pl} (zaimek pytający)`,
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
    note: "Dla rzeczowników rodzaju męskiego. Stoi po rzeczowniku: „il-walad da” (ten chłopiec).",
    ex: { ar: "الكتاب ده", ph: "il-ketaab da", pl: "ta książka (dosł. ta-książka ten)" },
  },
  {
    pl: "ta (f.)", ar: "دي", ph: "di",
    note: "Dla rzeczowników rodzaju żeńskiego: „il-bent di” (ta dziewczyna).",
    ex: { ar: "العربية دي", ph: "il-3arabeyya di", pl: "ten samochód" },
  },
  {
    pl: "ci / te (l.mn.)", ar: "دول", ph: "dol",
    note: "Dla liczby mnogiej, niezależnie od rodzaju: „il-awlaad dol” (ci chłopcy).",
    ex: { ar: "الناس دول", ph: "in-naas dol", pl: "ci ludzie" },
  },
  {
    pl: "to (jest)…", ar: "ده", ph: "da",
    note: "Na początku zdania „da/di” znaczy „to jest”: „da beeti” (to jest mój dom).",
    ex: { ar: "ده بيتي", ph: "da beeti", pl: "To jest mój dom." },
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
  { pl: "1", ar: "واحد", ph: "waaHed", note: "waaHed (m.) / waHda (f.). Zwykle po rzeczowniku lub domyślne." },
  { pl: "2", ar: "اتنين", ph: "etneen", note: "Zamiast „2 + rzeczownik” używa się DUALU: „yomeen” (dwa dni), nie „etneen yoom”." },
  { pl: "3", ar: "تلاتة", ph: "talaata", note: "Przed rzeczownikiem forma skrócona: „talat tiyyaam” (3 dni)." },
  { pl: "4", ar: "أربعة", ph: "arba3a", note: "Skróć.: „arba3 …”. 3–10 łączą się z liczbą MNOGĄ rzeczownika." },
  { pl: "5", ar: "خمسة", ph: "khamsa", note: "Skróć.: „khamas …”." },
  { pl: "6", ar: "ستة", ph: "setta", note: "Skróć.: „sett …”." },
  { pl: "7", ar: "سبعة", ph: "sab3a", note: "Skróć.: „saba3 …”." },
  { pl: "8", ar: "تمانية", ph: "tamanya", note: "Skróć.: „taman …”." },
  { pl: "9", ar: "تسعة", ph: "tes3a", note: "Skróć.: „tesa3 …”." },
  { pl: "10", ar: "عشرة", ph: "3ashara", note: "Skróć.: „3ashar …”. Od 11 w górę rzeczownik wraca do l. POJEDYNCZEJ." },
];

// ---------- Gramatyka: przyimki z sufiksami zaimkowymi ----------
// Przyimek + sufiks (ja/ty/on…). Formy są nieregularne, więc wpisane ręcznie.
const PREP_SUFFIXES = [
  { key: "i",   pl: "ja",        ph: "-i / -ya" },
  { key: "ak",  pl: "ty (m.)",   ph: "-ak" },
  { key: "ik",  pl: "ty (f.)",   ph: "-ik" },
  { key: "uh",  pl: "on",        ph: "-uh" },
  { key: "ha",  pl: "ona",       ph: "-ha" },
  { key: "na",  pl: "my",        ph: "-na" },
  { key: "ku",  pl: "wy",        ph: "-ku" },
  { key: "hum", pl: "oni/one",   ph: "-hom" },
];

const PREPOSITIONS = [
  {
    pl: "u / mieć (posiadanie)", ar: "عند", ph: "3and",
    note: "„3and” + sufiks wyraża posiadanie: „3andi” = „mam” (dosł. „u-mnie”).",
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
    note: "„ma3a” + sufiks: „ma3aaya” = „ze mną / przy mnie”. Uwaga na wydłużone samogłoski.",
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
    note: "„li-” + sufiks: „liya” = „dla mnie / mnie (celownik)”.",
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
    note: "„fi” = „w”; z sufiksem „fiyya” = „we mnie”, częściej używane z rzeczownikiem („fi-l-beet” = w domu).",
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
    note: "„men” = „od / z / niż”; z sufiksem „menni” = „ode mnie”.",
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
    pl: "duży", base: { ar: "كبير", ph: "kebiir" },
    comp: { ar: "أكبر", ph: "akbar" }, sup: { ar: "الأكبر", ph: "il-akbar" },
    ex: { ar: "أخويا أكبر مني.", ph: "akhuuya akbar menni.", pl: "Mój brat jest starszy ode mnie." },
  },
  {
    pl: "mały", base: { ar: "صغير", ph: "so8ayyar" },
    comp: { ar: "أصغر", ph: "aS8ar" }, sup: { ar: "الأصغر", ph: "il-aS8ar" },
    ex: { ar: "دي أصغر أوضة.", ph: "di aS8ar 2uDa.", pl: "To najmniejszy pokój." },
  },
  {
    pl: "dobry / ładny", base: { ar: "كويس", ph: "kwayyes" },
    comp: { ar: "أحسن", ph: "aHsan" }, sup: { ar: "الأحسن", ph: "il-aHsan" },
    ex: { ar: "ده أحسن من ده.", ph: "da aHsan min da.", pl: "Ten jest lepszy od tamtego." },
    note: "Stopień wyższy „aHsan” pochodzi od innego rdzenia niż „kwayyes” (nieregularne, jak pol. dobry → lepszy).",
  },
  {
    pl: "ładny / piękny", base: { ar: "حلو", ph: "Helw" },
    comp: { ar: "أحلى", ph: "aHla" }, sup: { ar: "الأحلى", ph: "il-aHla" },
    ex: { ar: "المكان ده أحلى.", ph: "il-makaan da aHla.", pl: "To miejsce jest ładniejsze." },
  },
  {
    pl: "tani", base: { ar: "رخيص", ph: "rekhiiS" },
    comp: { ar: "أرخص", ph: "arkhaS" }, sup: { ar: "الأرخص", ph: "il-arkhaS" },
    ex: { ar: "فيه حاجة أرخص؟", ph: "fiih Haaga arkhaS?", pl: "Jest coś tańszego?" },
  },
  {
    pl: "drogi", base: { ar: "غالي", ph: "8aali" },
    comp: { ar: "أغلى", ph: "a8la" }, sup: { ar: "الأغلى", ph: "il-a8la" },
    ex: { ar: "ده أغلى واحد.", ph: "da a8la waaHed.", pl: "To najdroższy." },
  },
  {
    pl: "bliski", base: { ar: "قريب", ph: "2urayyib" },
    comp: { ar: "أقرب", ph: "a2rab" }, sup: { ar: "الأقرب", ph: "il-a2rab" },
    ex: { ar: "فين أقرب محطة؟", ph: "feen a2rab maHaTTa?", pl: "Gdzie jest najbliższa stacja?" },
  },
  {
    pl: "łatwy", base: { ar: "سهل", ph: "sahl" },
    comp: { ar: "أسهل", ph: "as-hal" }, sup: { ar: "الأسهل", ph: "il-as-hal" },
    ex: { ar: "دي أسهل طريقة.", ph: "di as-hal Tarii2a.", pl: "To najłatwiejszy sposób." },
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
  { pl: "21", ar: "واحد وعشرين", ph: "waaHed wi 3eshriin", note: "Jedności PRZED dziesiątkami, spojone „wi” (i): waaHed wi 3eshriin." },
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
    note: "„ta3aala” (chodź tu) jest nieregularne. Negacja od czasownika „giih”: matgiish.",
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
];

// Fiszki z nowych działów gramatyki.
function extraGrammarWords() {
  const out = [];
  for (const c of COMPARATIVES) {
    out.push({ cat: "grammar", pl: `${c.pl} — wyższy`, ar: c.comp.ar, ph: c.comp.ph });
    out.push({ cat: "grammar", pl: `${c.pl} — najwyższy`, ar: c.sup.ar, ph: c.sup.ph });
  }
  for (const n of BIG_NUMERALS) {
    out.push({ cat: "grammar", pl: `${n.pl} (liczebnik)`, ar: n.ar, ph: n.ph });
  }
  for (const im of IMPERATIVES) {
    out.push({ cat: "grammar", pl: `${im.pl} — rozkaz (m.)`, ar: im.forms.m.ar, ph: im.forms.m.ph });
    out.push({ cat: "grammar", pl: `nie ${im.pl.split(" ")[0]} — zakaz`, ar: im.neg.ar, ph: im.neg.ph });
  }
  return out;
}

// Fiszki z gramatyki: wskazujące, liczebniki i przyimki (z sufiksami).
function grammarToWords() {
  const out = [];
  for (const d of DEMONSTRATIVES) {
    out.push({ cat: "grammar", pl: `${d.pl} (wskazujący)`, ar: d.ar, ph: d.ph, ex: d.ex });
  }
  for (const n of NUMERALS) {
    out.push({ cat: "grammar", pl: `${n.pl} (liczebnik)`, ar: n.ar, ph: n.ph });
  }
  for (const p of PREPOSITIONS) {
    for (const suf of PREP_SUFFIXES) {
      const f = p.forms[suf.key];
      if (!f) continue;
      out.push({ cat: "grammar", pl: `${p.pl} — ${suf.pl}`, ar: f.ar, ph: f.ph });
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
    aff: { ar: "بحب القهوة", ph: "baHebb il-ahwa" },
    neg: { ar: "مبحبش القهوة", ph: "mabaHebbish il-ahwa" },
    note: "Czas teraźniejszy z بـ: klamra ma-…-sh wokół czasownika.",
  },
  {
    rule: "ma-…-sh",
    pl: "poszedłem do domu → nie poszedłem do domu",
    aff: { ar: "رحت البيت", ph: "ruHt il-beet" },
    neg: { ar: "مرحتش البيت", ph: "maruHtish il-beet" },
    note: "Czas przeszły: ma-…-sh; po zbitce spółgłosek wskakuje -i- (ruHt → maruHtish).",
  },
  {
    rule: "ma-…-sh",
    pl: "mam czas → nie mam czasu",
    aff: { ar: "عندي وقت", ph: "3andi wa2t" },
    neg: { ar: "معنديش وقت", ph: "ma3andiish wa2t" },
    note: "Posiadanie (3and + sufiks) neguje się klamrą jak czasownik.",
  },
  {
    rule: "ma-…-sh",
    pl: "jest problem → nie ma problemu",
    aff: { ar: "فيه مشكلة", ph: "fiih moshkila" },
    neg: { ar: "مفيش مشكلة", ph: "mafiish moshkila" },
    note: "fiih (jest/znajduje się) → mafiish (nie ma). Jedno z najczęstszych słów w Egipcie.",
  },
  {
    rule: "ma-…-sh",
    pl: "on był tutaj → on nie był tutaj",
    aff: { ar: "كان هنا", ph: "kaan hena" },
    neg: { ar: "مكنش هنا", ph: "makansh hena" },
    note: "kaan (był) → makansh.",
  },
  {
    rule: "mish",
    pl: "chcę jeść → nie chcę jeść",
    aff: { ar: "أنا عايز آكل", ph: "ana 3aayez aakol" },
    neg: { ar: "أنا مش عايز آكل", ph: "ana mish 3aayez aakol" },
    note: "3aayez to IMIESŁÓW, nie czasownik → mish, nigdy „ma3aayezsh”. Częsty błąd!",
  },
  {
    rule: "mish",
    pl: "wiem → nie wiem",
    aff: { ar: "أنا عارف", ph: "ana 3aaref" },
    neg: { ar: "أنا مش عارف", ph: "ana mish 3aaref" },
    note: "3aaref (wiedzący) — też imiesłów → mish 3aaref.",
  },
  {
    rule: "mish",
    pl: "jestem zmęczony → nie jestem zmęczony",
    aff: { ar: "أنا تعبان", ph: "ana ta3baan" },
    neg: { ar: "أنا مش تعبان", ph: "ana mish ta3baan" },
    note: "Przymiotniki zawsze z mish.",
  },
  {
    rule: "mish",
    pl: "pójdę jutro → nie pójdę jutro",
    aff: { ar: "هروح بكرة", ph: "haruu7 bukra" },
    neg: { ar: "مش هروح بكرة", ph: "mish haruu7 bukra" },
    note: "PRZYSZŁOŚĆ (ha-) neguje się przez mish — klamra ma-…-sh tu nie działa.",
  },
  {
    rule: "mish",
    pl: "to mój przyjaciel → to nie jest mój przyjaciel",
    aff: { ar: "ده صاحبي", ph: "da SaHbi" },
    neg: { ar: "ده مش صاحبي", ph: "da mish SaHbi" },
    note: "Zdania rzeczownikowe (bez czasownika) → mish.",
  },
];

// Formy przeczące jako fiszki.
function negationToWords() {
  return NEGATION_EXAMPLES.map((n) => ({
    cat: "grammar",
    pl: `${n.pl.split("→")[1].trim()} (negacja: ${n.rule})`,
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
    cat: "expressions", pl: "koniec / już / dość", ar: "خلاص", ph: "khalaaS",
    ex: { ar: "خلاص، فهمت.", ph: "khalaaS, fehemt.", pl: "Już dobrze, zrozumiałem." },
  },
  {
    cat: "expressions", pl: "w ogóle / całkiem (wzmacnia przeczenie)", ar: "خالص", ph: "khaaliS",
    ex: { ar: "مفيش فلوس خالص.", ph: "mafiish feluus khaaliS.", pl: "Nie ma w ogóle pieniędzy. (uwaga: خالص ≠ خلاص khalaaS „dość”)" },
  },
  {
    cat: "expressions", pl: "pytanie", ar: "سؤال", ph: "su2aal",
    ex: { ar: "عندي سؤال.", ph: "3andi su2aal.", pl: "Mam pytanie." },
  },
  {
    cat: "expressions", pl: "chwila", ar: "لحظة", ph: "laHZa",
    ex: { ar: "استنى لحظة.", ph: "estanna laHZa.", pl: "Poczekaj chwilę." },
  },
  {
    cat: "expressions", pl: "chwileczkę? / masz chwilę?", ar: "ممكن لحظة؟", ph: "mumken laHZa?",
    ex: { ar: "ممكن لحظة؟ عايز أسألك.", ph: "mumken laHZa? 3aayez as2alak.", pl: "Masz chwilę? Chcę cię o coś zapytać." },
  },
  {
    cat: "expressions", pl: "mogę zadać pytanie?", ar: "ممكن سؤال؟", ph: "mumken su2aal?",
    ex: { ar: "ممكن سؤال لو سمحت؟", ph: "mumken su2aal law samaHt?", pl: "Czy mogę zadać pytanie, proszę?" },
  },
  {
    cat: "expressions", pl: "no dobra / to…", ar: "طب", ph: "Tab",
    ex: { ar: "طب ماشي، نتكلم بكرة.", ph: "Tab maashi, netkallem bukra.", pl: "No dobra, pogadamy jutro." },
  },
  {
    cat: "expressions", pl: "drobiazg / nic takiego", ar: "بسيطة", ph: "basiiTa",
    ex: { ar: "متقلقش، بسيطة.", ph: "mat2la2sh, basiiTa.", pl: "Nie martw się, to drobiazg." },
  },
  {
    cat: "expressions", pl: "to znaczy / no wiesz", ar: "يعني", ph: "ya3ni",
    ex: { ar: "الفيلم كان يعني مش وحش.", ph: "il-film kaan ya3ni mish weHesh.", pl: "Film był, no wiesz, nie taki zły." },
  },
  {
    cat: "expressions", pl: "nie ma problemu", ar: "مش مشكلة", ph: "mish moshkila",
    ex: { ar: "مش مشكلة، أقدر أستنى.", ph: "mish moshkila, a2dar astanna.", pl: "Nie ma problemu, mogę poczekać." },
  },
  {
    cat: "expressions", pl: "nie przejmuj się (do m.)", ar: "ولا يهمك", ph: "wala yhemmak",
    ex: { ar: "ولا يهمك، كله هيبقى تمام.", ph: "wala yhemmak, kollo hayeb2a tamaam.", pl: "Nie przejmuj się, wszystko będzie dobrze." },
  },
  {
    cat: "expressions", pl: "za pozwoleniem (wychodząc)", ar: "عن إذنك", ph: "3an iznak",
    ex: { ar: "عن إذنك، لازم أمشي.", ph: "3an iznak, laazem amshi.", pl: "Za pozwoleniem, muszę już iść." },
  },
  {
    cat: "expressions", pl: "dzięki / bądź zdrów (do m.)", ar: "تسلم", ph: "tislam",
    ex: { ar: "تسلم إيدك!", ph: "tislam iidak!", pl: "Dzięki! (dosł. niech żyje twoja ręka — np. za posiłek)" },
  },
  {
    cat: "expressions", pl: "wszystko w porządku", ar: "كله تمام", ph: "kollo tamaam",
    ex: { ar: "كله تمام عندك؟", ph: "kollo tamaam 3andak?", pl: "Wszystko u ciebie w porządku?" },
  },
  {
    cat: "expressions", pl: "od razu / prosto", ar: "على طول", ph: "3ala Tuul",
    ex: { ar: "امشي على طول وبعدين شمال.", ph: "emshi 3ala Tuul wi ba3deen shemaal.", pl: "Idź prosto, a potem w lewo." },
  },
  {
    cat: "expressions", pl: "powoli / stopniowo", ar: "شوية شوية", ph: "shwayya shwayya",
    ex: { ar: "بتعلم عربي شوية شوية.", ph: "bat3allem 3arabi shwayya shwayya.", pl: "Uczę się arabskiego krok po kroku." },
  },
  {
    cat: "expressions", pl: "à propos / przy okazji", ar: "على فكرة", ph: "3ala fekra",
    ex: { ar: "على فكرة، شفت صاحبك امبارح.", ph: "3ala fekra, shuft SaHbak embaareH.", pl: "Przy okazji — widziałem wczoraj twojego przyjaciela." },
  },
];

// ---------- Wyrażenia religijne codziennego użytku ----------
// W Egipcie te zwroty są częścią zwykłej rozmowy niezależnie od religijności
// rozmówców — funkcjonują jak polskie "daj Boże" czy "dzięki Bogu".
const RELIGIOUS_WORDS = [
  {
    cat: "religious", pl: "jak Bóg da (o planach)", ar: "إن شاء الله", ph: "in shaa2 allah",
    ex: { ar: "أشوفك بكرة إن شاء الله.", ph: "ashuufak bukra in shaa2 allah.", pl: "Do zobaczenia jutro, jak Bóg da. (obowiązkowe przy każdym planie; bywa też grzecznym „zobaczymy”)" },
  },
  {
    cat: "religious", pl: "dzięki Bogu", ar: "الحمد لله", ph: "il-Hamdu lillah",
    ex: { ar: "عامل إيه؟ — الحمد لله.", ph: "3aamel eeh? — il-Hamdu lillah.", pl: "Jak się masz? — Dzięki Bogu. (standardowa odpowiedź; też po posiłku)" },
  },
  {
    cat: "religious", pl: "cóż za cudo (podziw bez uroku)", ar: "ما شاء الله", ph: "ma shaa2 allah",
    ex: { ar: "ابنك كبر، ما شاء الله!", ph: "ibnak kebir, ma shaa2 allah!", pl: "Ale twój syn urósł, ma shaa2 allah! (wypada dodać przy komplementach, zwłaszcza o dzieciach)" },
  },
  {
    cat: "religious", pl: "w imię Boga (zaczynając)", ar: "بسم الله", ph: "bismillah",
    ex: { ar: "بسم الله، نبدأ.", ph: "bismillah, nebda2.", pl: "Bismillah, zaczynamy. (przed jedzeniem, pracą, podróżą)" },
  },
  {
    cat: "religious", pl: "oby / daj Boże", ar: "يا رب", ph: "ya rabb",
    ex: { ar: "يا رب تنجح.", ph: "ya rabb tengaH.", pl: "Oby ci się udało." },
  },
  {
    cat: "religious", pl: "niech ci Bóg wynagrodzi (dziękując)", ar: "ربنا يخليك", ph: "rabbena yekhalliik",
    ex: { ar: "ساعدتني كتير، ربنا يخليك.", ph: "sa3edtini ketiir, rabbena yekhalliik.", pl: "Bardzo mi pomogłeś, niech ci Bóg wynagrodzi." },
  },
  {
    cat: "religious", pl: "oby Bóg ułatwił", ar: "ربنا يسهل", ph: "rabbena yesahhel",
    ex: { ar: "عندي امتحان بكرة. — ربنا يسهل!", ph: "3andi imtiHaan bukra. — rabbena yesahhel!", pl: "Mam jutro egzamin. — Oby poszło gładko!" },
  },
  {
    cat: "religious", pl: "za pozwoleniem Boga (pewniej niż in shaa2 allah)", ar: "بإذن الله", ph: "bi2izn illah",
    ex: { ar: "هننجح بإذن الله.", ph: "hanengaH bi2izn illah.", pl: "Uda nam się, z Bożą pomocą." },
  },
  {
    cat: "religious", pl: "pokój z tobą (powitanie)", ar: "السلام عليكم", ph: "is-salaamu 3aleekum",
    ex: { ar: "السلام عليكم. — وعليكم السلام.", ph: "is-salaamu 3aleekum. — wa 3aleekum is-salaam.", pl: "Pokój z wami. — I z wami pokój. (odpowiedź jest obowiązkowa)" },
  },
  {
    cat: "religious", pl: "świeć Panie nad jego duszą", ar: "الله يرحمه", ph: "allah yarHamuh",
    ex: { ar: "جدي، الله يرحمه، كان طيب.", ph: "geddi, allah yarHamuh, kaan Tayyeb.", pl: "Mój dziadek, świeć Panie nad jego duszą, był dobrym człowiekiem. (o zmarłych; o kobiecie: allah yarHamha)" },
  },
  {
    cat: "religious", pl: "Boże uchowaj / wybacz", ar: "أستغفر الله", ph: "astaghfar allah",
    ex: { ar: "أستغفر الله! مش ممكن.", ph: "astaghfar allah! mish mumken.", pl: "Boże uchowaj! Nie do wiary. (oburzenie lub skromne odżegnanie się od pochwały)" },
  },
  {
    cat: "religious", pl: "błogosławionego piątku", ar: "جمعة مباركة", ph: "gum3a mubaraka",
    ex: { ar: "جمعة مباركة عليك.", ph: "gum3a mubaraka 3aleek.", pl: "Błogosławionego piątku. (piątkowe pozdrowienie, jak nasze „miłej niedzieli”)" },
  },
];

// ---------- Jedzenie i zakupy: rozszerzenie (słownictwo codzienne) ----------
const FOOD_WORDS = [
  // Owoce
  { cat: "food_shopping", pl: "owoce", ar: "فاكهة", ph: "faakha" },
  { cat: "food_shopping", pl: "jabłko", ar: "تفاحة", ph: "toffaaHa" },
  { cat: "food_shopping", pl: "banan", ar: "موزة", ph: "mooza" },
  { cat: "food_shopping", pl: "pomarańcza", ar: "برتقانة", ph: "borto2aana" },
  { cat: "food_shopping", pl: "winogrona", ar: "عنب", ph: "3enab" },
  { cat: "food_shopping", pl: "arbuz", ar: "بطيخ", ph: "baTTiikh" },
  { cat: "food_shopping", pl: "mango", ar: "مانجة", ph: "manga" },
  { cat: "food_shopping", pl: "cytryna", ar: "لمونة", ph: "lamuuna" },
  { cat: "food_shopping", pl: "daktyle", ar: "بلح", ph: "balaH" },
  // Warzywa
  { cat: "food_shopping", pl: "warzywa", ar: "خضار", ph: "khoDaar" },
  { cat: "food_shopping", pl: "pomidor", ar: "طماطم", ph: "TamaaTem" },
  { cat: "food_shopping", pl: "ziemniak", ar: "بطاطس", ph: "baTaaTes" },
  { cat: "food_shopping", pl: "cebula", ar: "بصل", ph: "baSal" },
  { cat: "food_shopping", pl: "czosnek", ar: "توم", ph: "toom" },
  { cat: "food_shopping", pl: "ogórek", ar: "خيار", ph: "khiyaar" },
  { cat: "food_shopping", pl: "marchew", ar: "جزر", ph: "gazar" },
  { cat: "food_shopping", pl: "bakłażan", ar: "بتنجان", ph: "betengaan" },
  { cat: "food_shopping", pl: "papryka", ar: "فلفل", ph: "felfel" },
  // Mięso / białko
  { cat: "food_shopping", pl: "mięso", ar: "لحمة", ph: "laHma" },
  { cat: "food_shopping", pl: "kurczak", ar: "فراخ", ph: "feraakh" },
  { cat: "food_shopping", pl: "ryba", ar: "سمك", ph: "samak" },
  { cat: "food_shopping", pl: "jajko", ar: "بيضة", ph: "beeDa" },
  { cat: "food_shopping", pl: "fasola bób (ful)", ar: "فول", ph: "fuul" },
  // Pieczywo / podstawy
  { cat: "food_shopping", pl: "chleb", ar: "عيش", ph: "3eesh" },
  { cat: "food_shopping", pl: "sól", ar: "ملح", ph: "malH" },
  { cat: "food_shopping", pl: "olej", ar: "زيت", ph: "zeet" },
  { cat: "food_shopping", pl: "masło", ar: "زبدة", ph: "zebda" },
  { cat: "food_shopping", pl: "miód", ar: "عسل", ph: "3asal" },
  // Napoje
  { cat: "food_shopping", pl: "woda", ar: "ميّة", ph: "mayya" },
  { cat: "food_shopping", pl: "sok", ar: "عصير", ph: "3aSiir" },
  { cat: "food_shopping", pl: "kawa", ar: "قهوة", ph: "2ahwa" },
  { cat: "food_shopping", pl: "kawa po turecku bez cukru", ar: "قهوة سادة", ph: "2ahwa saada" },
  // Sklepy i zakupy
  { cat: "food_shopping", pl: "sklep", ar: "محل", ph: "maHall" },
  { cat: "food_shopping", pl: "targ / bazar", ar: "سوق", ph: "suu2" },
  { cat: "food_shopping", pl: "piekarnia", ar: "مخبز", ph: "makhbaz" },
  { cat: "food_shopping", pl: "rzeźnik", ar: "جزار", ph: "gazzaar" },
  { cat: "food_shopping", pl: "kilogram", ar: "كيلو", ph: "kiilo" },
  { cat: "food_shopping", pl: "pół kilo", ar: "نص كيلو", ph: "noSS kiilo" },
  { cat: "food_shopping", pl: "reszta (pieniądze)", ar: "الباقي", ph: "il-baa2i" },
  {
    cat: "food_shopping", pl: "ile to kosztuje?", ar: "بكام ده؟", ph: "bikaam da?",
    ex: { ar: "الكيلو بكام؟", ph: "il-kiilo bikaam?", pl: "Ile za kilogram?" },
  },
  {
    cat: "food_shopping", pl: "poproszę kilo pomidorów", ar: "كيلو طماطم لو سمحت", ph: "kiilo TamaaTem law samaHt",
    ex: { ar: "إديني كيلو طماطم لو سمحت.", ph: "eddiini kiilo TamaaTem law samaHt.", pl: "Daj mi kilo pomidorów, proszę." },
  },
  { cat: "food_shopping", pl: "świeży", ar: "طازة", ph: "Taaza" },
  { cat: "food_shopping", pl: "dojrzały", ar: "مستوي", ph: "mestewi" },
];

// ---------- Kuchnia: potrawy i przymiotniki kulinarne ----------
const KITCHEN_WORDS = [
  // Sposób przyrządzenia (przymiotniki kulinarne)
  { cat: "kitchen", pl: "smażony", ar: "مقلي", ph: "ma2li", ex: { ar: "بيض مقلي", ph: "beeD ma2li", pl: "jajka smażone" } },
  { cat: "kitchen", pl: "gotowany", ar: "مسلوق", ph: "masluu2", ex: { ar: "بيض مسلوق", ph: "beeD masluu2", pl: "jajka gotowane" } },
  { cat: "kitchen", pl: "pieczony / z piekarnika", ar: "في الفرن", ph: "fil-forn", ex: { ar: "فراخ في الفرن", ph: "feraakh fil-forn", pl: "kurczak z piekarnika" } },
  { cat: "kitchen", pl: "grillowany", ar: "مشوي", ph: "mashwi", ex: { ar: "سمك مشوي", ph: "samak mashwi", pl: "ryba z grilla" } },
  { cat: "kitchen", pl: "faszerowany / nadziewany", ar: "محشي", ph: "maHshi", ex: { ar: "محشي كرنب", ph: "maHshi koronb", pl: "gołąbki (nadziewana kapusta)" } },
  { cat: "kitchen", pl: "duszony / w sosie", ar: "مطبوخ", ph: "maTbuukh" },
  { cat: "kitchen", pl: "surowy", ar: "ني", ph: "nayy" },
  { cat: "kitchen", pl: "ostry / pikantny", ar: "حار", ph: "Haar" },
  { cat: "kitchen", pl: "słodki", ar: "حلو", ph: "Helw" },
  { cat: "kitchen", pl: "słony", ar: "مالح", ph: "maaleH" },
  { cat: "kitchen", pl: "kwaśny", ar: "حامض", ph: "HaameD" },
  { cat: "kitchen", pl: "gorzki", ar: "مر", ph: "morr" },
  { cat: "kitchen", pl: "pyszny", ar: "لذيذ", ph: "laziiz" },
  { cat: "kitchen", pl: "zimny", ar: "بارد", ph: "baared" },
  { cat: "kitchen", pl: "gorący / ciepły", ar: "سخن", ph: "sokhn" },
  // Popularne potrawy egipskie
  { cat: "kitchen", pl: "koszari (danie narodowe)", ar: "كشري", ph: "koshari", ex: { ar: "أنا بحب الكشري.", ph: "ana baHebb il-koshari.", pl: "Lubię koszari." } },
  { cat: "kitchen", pl: "ful (bób) medames", ar: "فول مدمس", ph: "fuul medammes" },
  { cat: "kitchen", pl: "falafel (ta3meya)", ar: "طعمية", ph: "Ta3meyya" },
  { cat: "kitchen", pl: "molocheja (zupa)", ar: "ملوخية", ph: "molokheyya" },
  { cat: "kitchen", pl: "shawarma", ar: "شاورما", ph: "shawerma" },
  { cat: "kitchen", pl: "kofta (mielone na grillu)", ar: "كفتة", ph: "kofta" },
  { cat: "kitchen", pl: "sałatka", ar: "سلطة", ph: "salaTa" },
  { cat: "kitchen", pl: "zupa", ar: "شوربة", ph: "shorba" },
  { cat: "kitchen", pl: "makaron", ar: "مكرونة", ph: "makaroona" },
  // Naczynia i sztućce
  { cat: "kitchen", pl: "talerz", ar: "طبق", ph: "Taba2" },
  { cat: "kitchen", pl: "szklanka", ar: "كباية", ph: "kobaaya" },
  { cat: "kitchen", pl: "widelec", ar: "شوكة", ph: "shooka" },
  { cat: "kitchen", pl: "łyżka", ar: "معلقة", ph: "ma3la2a" },
  { cat: "kitchen", pl: "nóż", ar: "سكينة", ph: "sekkiina" },
  // Czasowniki kuchenne (bezokolicznik/temat)
  { cat: "kitchen", pl: "gotować", ar: "يطبخ", ph: "yeTbokh" },
  { cat: "kitchen", pl: "jeść", ar: "ياكل", ph: "yaakol" },
  { cat: "kitchen", pl: "pić", ar: "يشرب", ph: "yeshrab" },
  // Zwroty
  { cat: "kitchen", pl: "jestem głodny (m.)", ar: "أنا جعان", ph: "ana ga3aan" },
  { cat: "kitchen", pl: "jestem spragniony (m.)", ar: "أنا عطشان", ph: "ana 3aTshaan" },
  { cat: "kitchen", pl: "najadłem się / jestem syty", ar: "أنا شبعان", ph: "ana shab3aan" },
  {
    cat: "kitchen", pl: "co dzisiaj gotujesz?", ar: "بتطبخي إيه النهاردة؟", ph: "betoTbokhi eeh in-naharda?",
    ex: { ar: "بتطبخي إيه النهاردة؟", ph: "betoTbokhi eeh in-naharda?", pl: "Co dziś gotujesz? (do kobiety)" },
  },
];

// ---------- Spójniki i łączniki ----------
// Egipski jest mniej „spójnikowy" niż polski — wiele polskich spójników
// oddaje kilka potocznych słów. Formy literackie (fusha) oznaczono w notatce.
const CONJUNCTION_WORDS = [
  {
    cat: "conjunctions", pl: "i / oraz", ar: "و", ph: "wi",
    ex: { ar: "أنا وانت", ph: "ana w-enta", pl: "ja i ty" },
  },
  {
    cat: "conjunctions", pl: "ale / lecz", ar: "بس", ph: "bass",
    ex: { ar: "عايز أروح بس مش قادر.", ph: "3aayez aruuH bass mish 2aader.", pl: "Chcę iść, ale nie mogę." },
  },
  {
    cat: "conjunctions", pl: "ale (formalniej)", ar: "لكن", ph: "laakin",
    ex: { ar: "الأكل كويس لكن غالي.", ph: "il-akl kwayyes laakin 8aali.", pl: "Jedzenie dobre, ale drogie." },
  },
  {
    cat: "conjunctions", pl: "bo / ponieważ / żeby", ar: "عشان", ph: "3ashaan",
    ex: { ar: "بذاكر عشان أنجح.", ph: "bazaaker 3ashaan angaH.", pl: "Uczę się, żeby zdać. (3ashaan = i „bo”, i „żeby”)" },
  },
  {
    cat: "conjunctions", pl: "ponieważ (pełniej)", ar: "علشان", ph: "3alashaan",
    ex: { ar: "بحبها علشان طيبة.", ph: "baHebbaha 3alashaan Tayyeba.", pl: "Lubię ją, ponieważ jest miła." },
  },
  {
    cat: "conjunctions", pl: "więc / dlatego", ar: "فـ", ph: "fa",
    ex: { ar: "كان بيشتي فقعدت في البيت.", ph: "kaan biyshatti fa 2a3adt fil-beet.", pl: "Padało, więc został(a)em w domu." },
  },
  {
    cat: "conjunctions", pl: "albo / lub", ar: "أو", ph: "aw",
    ex: { ar: "شاي أو قهوة؟", ph: "shaay aw 2ahwa?", pl: "Herbata czy kawa?" },
  },
  {
    cat: "conjunctions", pl: "albo… albo", ar: "يا... يا", ph: "ya... ya",
    ex: { ar: "يا دلوقتي يا بكرة.", ph: "ya dilwa2ti ya bukra.", pl: "Albo teraz, albo jutro." },
  },
  {
    cat: "conjunctions", pl: "jeśli / jeżeli", ar: "لو", ph: "law",
    ex: { ar: "لو عايز، تعالى.", ph: "law 3aayez, ta3aala.", pl: "Jeśli chcesz, przyjdź." },
  },
  {
    cat: "conjunctions", pl: "kiedy / gdy", ar: "لما", ph: "lamma",
    ex: { ar: "لما توصل، كلمني.", ph: "lamma tewSal, kallemni.", pl: "Kiedy dotrzesz, zadzwoń." },
  },
  {
    cat: "conjunctions", pl: "że (spójnik dopełnieniowy)", ar: "إن", ph: "enn",
    ex: { ar: "أعتقد إنه صح.", ph: "a3ta2ed ennu SaHH.", pl: "Myślę, że to prawda." },
  },
  {
    cat: "conjunctions", pl: "też / także", ar: "كمان", ph: "kamaan",
    ex: { ar: "أنا كمان جاي.", ph: "ana kamaan gaay.", pl: "Ja też przychodzę." },
  },
  {
    cat: "conjunctions", pl: "a poza tym / w dodatku", ar: "وكمان", ph: "wi kamaan",
    ex: { ar: "غالي وكمان وحش.", ph: "8aali wi kamaan weHesh.", pl: "Drogie, a w dodatku kiepskie." },
  },
  {
    cat: "conjunctions", pl: "mimo że / chociaż", ar: "مع إن", ph: "ma3 enn",
    ex: { ar: "خرج مع إنه تعبان.", ph: "kharag ma3 ennu ta3baan.", pl: "Wyszedł, chociaż był zmęczony." },
  },
  {
    cat: "conjunctions", pl: "jednak / mimo to", ar: "برضه", ph: "barDo",
    ex: { ar: "تعبان بس رايح برضه.", ph: "ta3baan bass raayeH barDo.", pl: "Zmęczony, ale mimo to idę." },
  },
  {
    cat: "conjunctions", pl: "aczkolwiek / jakkolwiek (fusha, formalne)", ar: "على الرغم من", ph: "3ala r-ra8m men",
    ex: { ar: "على الرغم من التعب، كمّل.", ph: "3ala r-ra8m men it-ta3ab, kammel.", pl: "Mimo zmęczenia — kontynuował. (rejestr pisany/formalny)" },
  },
  {
    cat: "conjunctions", pl: "potem / następnie", ar: "بعدين", ph: "ba3deen",
    ex: { ar: "هناكل الأول وبعدين نخرج.", ph: "hanaakol il-awwel wi ba3deen nokhrog.", pl: "Najpierw zjemy, a potem wyjdziemy." },
  },
  {
    cat: "conjunctions", pl: "dlatego / z tego powodu", ar: "عشان كده", ph: "3ashaan keda",
    ex: { ar: "تعبان، عشان كده مش جاي.", ph: "ta3baan, 3ashaan keda mish gaay.", pl: "Jestem zmęczony, dlatego nie przychodzę." },
  },
];

// ---------- Rodzina i bliscy: rozszerzenie ----------
const FAMILY_WORDS = [
  // Najbliżsi
  { cat: "family", pl: "rodzina", ar: "عيلة", ph: "3eela" },
  { cat: "family", pl: "mąż", ar: "جوز", ph: "gooz" },
  { cat: "family", pl: "żona", ar: "مرات", ph: "meraat", ex: { ar: "دي مراتي.", ph: "di meraati.", pl: "To moja żona." } },
  { cat: "family", pl: "syn", ar: "ابن", ph: "ebn" },
  { cat: "family", pl: "córka", ar: "بنت", ph: "bint" },
  { cat: "family", pl: "dzieci", ar: "عيال", ph: "3eyaal" },
  { cat: "family", pl: "dziecko / chłopiec", ar: "ولد", ph: "walad" },
  // Rodzice i dziadkowie
  { cat: "family", pl: "ojciec", ar: "أب", ph: "2ab" },
  { cat: "family", pl: "matka", ar: "أم", ph: "2omm" },
  { cat: "family", pl: "rodzice", ar: "الوالدين", ph: "il-waldeen" },
  { cat: "family", pl: "dziadek", ar: "جد", ph: "gedd" },
  { cat: "family", pl: "babcia", ar: "جدة", ph: "gedda" },
  // Rodzeństwo
  { cat: "family", pl: "brat", ar: "أخ", ph: "akh" },
  { cat: "family", pl: "siostra", ar: "أخت", ph: "okht" },
  // Dalsza rodzina
  { cat: "family", pl: "wujek (brat ojca)", ar: "عم", ph: "3amm" },
  { cat: "family", pl: "wujek (brat matki)", ar: "خال", ph: "khaal" },
  { cat: "family", pl: "ciotka (siostra ojca)", ar: "عمة", ph: "3amma" },
  { cat: "family", pl: "ciotka (siostra matki)", ar: "خالة", ph: "khaala" },
  { cat: "family", pl: "kuzyn / kuzynka", ar: "ابن عم / بنت عم", ph: "ebn 3amm / bint 3amm" },
  { cat: "family", pl: "wnuk / wnuczka", ar: "حفيد / حفيدة", ph: "Hafiid / Hafiida" },
  // Teściowie i powinowaci
  { cat: "family", pl: "teść / teściowa", ar: "حمو / حماة", ph: "Hamu / Hamaa" },
  { cat: "family", pl: "zięć", ar: "جوز البنت", ph: "gooz il-bint" },
  { cat: "family", pl: "synowa", ar: "مرات الابن", ph: "meraat il-ebn" },
  // Stan cywilny i etapy
  { cat: "family", pl: "narzeczony / narzeczona", ar: "خطيب / خطيبة", ph: "khaTiib / khaTiiba" },
  { cat: "family", pl: "zaręczony (m.)", ar: "مخطوب", ph: "makhTuub" },
  { cat: "family", pl: "żonaty / zamężna", ar: "متجوز / متجوزة", ph: "metgawwez / metgawweza" },
  { cat: "family", pl: "kawaler / panna", ar: "أعزب / عزباء", ph: "a3zab / 3azbaa2" },
  { cat: "family", pl: "rozwiedziony (m.)", ar: "مطلق", ph: "meTalla2" },
  // Określenia
  { cat: "family", pl: "krewny / bliski", ar: "قريب", ph: "2ariib" },
  { cat: "family", pl: "sąsiad", ar: "جار", ph: "gaar" },
  { cat: "family", pl: "przyjaciel / kolega", ar: "صاحب", ph: "SaaHeb" },
  {
    cat: "family", pl: "ile masz dzieci?", ar: "عندك كام عيل؟", ph: "3andak kaam 3ayyel?",
    ex: { ar: "عندك كام عيل؟", ph: "3andak kaam 3ayyel?", pl: "Ile masz dzieci? (do mężczyzny)" },
  },
  {
    cat: "family", pl: "jesteś żonaty?", ar: "إنت متجوز؟", ph: "enta metgawwez?",
    ex: { ar: "إنت متجوز ولا لأ؟", ph: "enta metgawwez walla la2?", pl: "Jesteś żonaty czy nie?" },
  },
];

// ---------- Zdrowie i samopoczucie ----------
const HEALTH_WORDS = [
  { cat: "health", pl: "lekarz", ar: "دكتور", ph: "doktoor" },
  { cat: "health", pl: "apteka", ar: "صيدلية", ph: "Saydaleyya" },
  { cat: "health", pl: "lekarstwo", ar: "دوا", ph: "dawa" },
  { cat: "health", pl: "szpital", ar: "مستشفى", ph: "mustashfa" },
  { cat: "health", pl: "chory (m.)", ar: "عيان", ph: "3ayyaan" },
  { cat: "health", pl: "chora (ż.)", ar: "عيانة", ph: "3ayyaana" },
  { cat: "health", pl: "boli mnie", ar: "بيوجعني", ph: "biyewga3ni" },
  { cat: "health", pl: "głowa", ar: "راس", ph: "raas" },
  { cat: "health", pl: "boli mnie głowa", ar: "راسي بتوجعني", ph: "raasi betewga3ni", ex: { ar: "راسي بتوجعني من الصبح.", ph: "raasi betewga3ni min iS-SobH.", pl: "Głowa boli mnie od rana." } },
  { cat: "health", pl: "brzuch", ar: "بطن", ph: "baTn" },
  { cat: "health", pl: "gardło", ar: "زور", ph: "zoor" },
  { cat: "health", pl: "ząb", ar: "سنة", ph: "senna" },
  { cat: "health", pl: "gorączka", ar: "سخونية", ph: "sokhoneyya" },
  { cat: "health", pl: "przeziębienie", ar: "برد", ph: "bard" },
  { cat: "health", pl: "kaszel", ar: "كحة", ph: "koHHa" },
  { cat: "health", pl: "zmęczony (m.)", ar: "تعبان", ph: "ta3baan" },
  { cat: "health", pl: "czuję się lepiej", ar: "أنا أحسن", ph: "ana aHsan" },
  { cat: "health", pl: "potrzebuję lekarza", ar: "محتاج دكتور", ph: "meHtaag doktoor" },
  { cat: "health", pl: "zdrowie", ar: "صحة", ph: "SeHHa" },
  { cat: "health", pl: "wyzdrowiej! (życzenie)", ar: "سلامتك", ph: "salamtak", ex: { ar: "سلامتك، ألف سلامة.", ph: "salamtak, alf salaama.", pl: "Zdrowia, oby szybko wyzdrowieć." } },
];

// ---------- Pogoda ----------
const WEATHER_WORDS = [
  { cat: "weather", pl: "pogoda", ar: "الجو", ph: "il-gaww" },
  { cat: "weather", pl: "gorąco", ar: "حر", ph: "Harr" },
  { cat: "weather", pl: "zimno", ar: "برد", ph: "bard" },
  { cat: "weather", pl: "słońce", ar: "شمس", ph: "shams" },
  { cat: "weather", pl: "deszcz", ar: "مطر", ph: "maTar" },
  { cat: "weather", pl: "wiatr", ar: "هوا", ph: "hawa" },
  { cat: "weather", pl: "upał", ar: "حرارة", ph: "Haraara" },
  { cat: "weather", pl: "chmury", ar: "غيوم", ph: "8oyuum" },
  { cat: "weather", pl: "jest gorąco", ar: "الجو حر", ph: "il-gaww Harr", ex: { ar: "النهارده الجو حر أوي.", ph: "innaharda il-gaww Harr awi.", pl: "Dziś jest bardzo gorąco." } },
  { cat: "weather", pl: "jest zimno", ar: "الجو برد", ph: "il-gaww bard" },
  { cat: "weather", pl: "pada deszcz", ar: "بتمطر", ph: "betemTar" },
  { cat: "weather", pl: "ładna pogoda", ar: "الجو حلو", ph: "il-gaww Helw" },
  { cat: "weather", pl: "lato", ar: "صيف", ph: "Seef" },
  { cat: "weather", pl: "zima", ar: "شتا", ph: "shita" },
];

// ---------- Small talk / rozmowy grzecznościowe ----------
// Pytania i zwroty, które podtrzymują rozmowę — mało treści, dużo relacji.
const SMALLTALK_WORDS = [
  { cat: "smalltalk", pl: "jak się masz? (do m.)", ar: "عامل إيه؟", ph: "3aamel eeh?" },
  { cat: "smalltalk", pl: "jak się masz? (do ż.)", ar: "عاملة إيه؟", ph: "3amla eeh?" },
  { cat: "smalltalk", pl: "co słychać?", ar: "أخبارك إيه؟", ph: "akhbaarak eeh?" },
  { cat: "smalltalk", pl: "jak leci? (dosł. jaki kolor)", ar: "إزيك؟", ph: "ezzayyak?" },
  { cat: "smalltalk", pl: "jak twoja rodzina?", ar: "إزاي العيلة؟", ph: "ezzaay il-3eela?" },
  { cat: "smalltalk", pl: "jak zdrowie? (dosł. jaki stan)", ar: "إزاي الصحة؟", ph: "ezzaay iS-SeHHa?" },
  { cat: "smalltalk", pl: "co u ciebie nowego?", ar: "إيه الجديد؟", ph: "eeh ig-gediid?" },
  { cat: "smalltalk", pl: "jak babcia? (dosł. jak ma się)", ar: "إزاي تيتا؟", ph: "ezzaay teeta?" },
  { cat: "smalltalk", pl: "dawno się nie widzieliśmy", ar: "من زمان ما شفتكش", ph: "min zamaan ma shoftaksh" },
  { cat: "smalltalk", pl: "tęskniłem za tobą (do m.)", ar: "وحشتني", ph: "waHashtini" },
  { cat: "smalltalk", pl: "wszystko dobrze, dzięki Bogu", ar: "كله تمام، الحمد لله", ph: "kollo tamaam, il-Hamdulillah" },
  { cat: "smalltalk", pl: "jakoś leci (tak sobie)", ar: "ماشي الحال", ph: "maashi il-Haal" },
  { cat: "smalltalk", pl: "pozdrów rodzinę", ar: "سلّم على العيلة", ph: "sallem 3ala il-3eela" },
  { cat: "smalltalk", pl: "co porabiałeś?", ar: "كنت بتعمل إيه؟", ph: "kont bete3mel eeh?" },
  { cat: "smalltalk", pl: "miło było cię widzieć", ar: "فرصة سعيدة", ph: "forSa sa3iida" },
  { cat: "smalltalk", pl: "trzymaj się (uważaj na siebie)", ar: "خلي بالك من نفسك", ph: "khalli baalak min nafsak" },
];

// ---------- Wygładzacze i reakcje (język mówiony) ----------
// Wtrącenia, pauzy, potakiwania. Egipski to język mówiony — te słowa są jego rytmem.
const FILLER_WORDS = [
  { cat: "fillers", pl: "no wiesz / to znaczy (pauza)", ar: "يعني", ph: "ya3ni", ex: { ar: "الفيلم كان... يعني... مش بطال.", ph: "il-film kaan... ya3ni... mish baTTaal.", pl: "Film był... no wiesz... niezły." } },
  { cat: "fillers", pl: "normalnie / nic takiego (wzruszenie ramion)", ar: "عادي", ph: "3aadi", ex: { ar: "معلش، عادي، بيحصل.", ph: "ma3lesh, 3aadi, biyiHSal.", pl: "Nie szkodzi, normalne, zdarza się." } },
  { cat: "fillers", pl: "no dobra / że tak powiem (na końcu)", ar: "بقى", ph: "ba2a", ex: { ar: "يلا بينا بقى!", ph: "yalla biina ba2a!", pl: "No to chodźmy już!" } },
  { cat: "fillers", pl: "tak jakby / w ten sposób", ar: "كده", ph: "keda" },
  { cat: "fillers", pl: "a propos / przy okazji", ar: "على فكرة", ph: "3ala fekra" },
  { cat: "fillers", pl: "oczywiście / jasne", ar: "طبعاً", ph: "Tab3an" },
  { cat: "fillers", pl: "naprawdę? (zdziwienie)", ar: "بجد؟", ph: "begad?" },
  { cat: "fillers", pl: "niemożliwe! (nie do wiary)", ar: "مش معقول!", ph: "mish ma32uul!" },
  { cat: "fillers", pl: "wspaniale! / super", ar: "جميل!", ph: "gamiil!" },
  { cat: "fillers", pl: "poważnie mówię", ar: "بجد بقولك", ph: "begad ba2ollak" },
  { cat: "fillers", pl: "no właśnie / dokładnie", ar: "بالظبط", ph: "biZ-ZabT" },
  { cat: "fillers", pl: "rozumiem / jasne (potakiwanie)", ar: "فاهم", ph: "faahem" },
  { cat: "fillers", pl: "no i? / i co dalej?", ar: "وبعدين؟", ph: "we ba3deen?" },
  { cat: "fillers", pl: "słuchaj... (zaczepienie)", ar: "بص...", ph: "boSS..." },
  { cat: "fillers", pl: "krótko mówiąc", ar: "المهم", ph: "il-mohemm" },
  { cat: "fillers", pl: "coś w tym stylu", ar: "حاجة زي كده", ph: "Haaga zayy keda" },
  { cat: "fillers", pl: "to ciekawe, co mówisz", ar: "كلام جميل", ph: "kalaam gamiil" },
  { cat: "fillers", pl: "dobra, dobra (zgoda/koniec tematu)", ar: "خلاص خلاص", ph: "khalaaS khalaaS" },
];

// ---------- Slang wyższego poziomu (brzmieć jak miejscowy) ----------
// Wyrażenia, które sygnalizują dobrą znajomość języka. Uwaga na rejestr — potoczne.
const SLANG_WORDS = [
  { cat: "slang", pl: "z przyjemnością (dosł. z moich oczu)", ar: "من عنيا", ph: "men 3enaaya", ex: { ar: "أساعدك؟ من عنيا!", ph: "asaa3dak? men 3enaaya!", pl: "Pomóc ci? Z przyjemnością!" } },
  { cat: "slang", pl: "świetny pomysł", ar: "فكرة جامدة", ph: "fekra gamda" },
  { cat: "slang", pl: "spoko / w porządku (o czymś)", ar: "ده ماشي", ph: "da maashi" },
  { cat: "slang", pl: "wyluzuj / odpuść", ar: "فكّك", ph: "fokkak" },
  { cat: "slang", pl: "nie ma sprawy / bez problemu", ar: "مفيش مشكلة", ph: "mafiish moshkela" },
  { cat: "slang", pl: "równy gość (dosł. lekka krew)", ar: "دمه خفيف", ph: "dammo khafiif" },
  { cat: "slang", pl: "nudziarz (dosł. ciężka krew)", ar: "دمه تقيل", ph: "dammo te2iil" },
  { cat: "slang", pl: "szefie / mistrzu (do m., z sympatią)", ar: "يا باشا", ph: "ya baasha" },
  { cat: "slang", pl: "stary / ziomek (zaczepnie)", ar: "يا عم", ph: "ya 3amm" },
  { cat: "slang", pl: "genialne / miód (dosł. miód)", ar: "عسل", ph: "3asal" },
  { cat: "slang", pl: "idealnie / sto procent", ar: "مية مية", ph: "meyya meyya" },
  { cat: "slang", pl: "nie martw się tym", ar: "ولا يهمك", ph: "wala yhemmak" },
  { cat: "slang", pl: "gadanie / puste słowa", ar: "كلام فاضي", ph: "kalaam faaDi" },
  { cat: "slang", pl: "on tylko gada bez sensu", ar: "بيقول أي كلام", ph: "biy2uul ayy kalaam" },
  { cat: "slang", pl: "kiedy świnie zaczną latać (nigdy)", ar: "في المشمش", ph: "fil-meshmesh" },
  { cat: "slang", pl: "daj spokój / no weź (namawianie)", ar: "خلاص بقى", ph: "khalaaS ba2a" },
  { cat: "slang", pl: "co jest grane? / o co chodzi?", ar: "إيه الحكاية؟", ph: "eeh il-Hekaaya?" },
  { cat: "slang", pl: "super sprawa / ekstra", ar: "تحفة", ph: "toHfa" },
];

// ---------- O sobie / życie codzienne ----------
// Słownictwo do mówienia o pracy, nauce, mieszkaniu, zwierzętach — podstawa
// osobistych rozmów i tekstów.
const LIFE_WORDS = [
  // praca i zawody
  { cat: "life", pl: "praca", ar: "شغل", ph: "shughl" },
  { cat: "life", pl: "pracuję", ar: "بشتغل", ph: "bashtaghal" },
  { cat: "life", pl: "firma", ar: "شركة", ph: "sherka" },
  { cat: "life", pl: "biuro", ar: "مكتب", ph: "maktab" },
  { cat: "life", pl: "prawnik / adwokat", ar: "محامي", ph: "moHaami" },
  { cat: "life", pl: "architekt(ka)", ar: "مهندس معماري", ph: "mohandes me3maari" },
  { cat: "life", pl: "księgowość", ar: "محاسبة", ph: "moHasba" },
  { cat: "life", pl: "pracownik", ar: "موظف", ph: "mowaZZaf" },
  { cat: "life", pl: "właściciel", ar: "صاحب", ph: "SaaHeb" },
  { cat: "life", pl: "klient", ar: "عميل", ph: "3amiil" },
  { cat: "life", pl: "podatki", ar: "ضرايب", ph: "Daraayeb" },
  // nauka i język
  { cat: "life", pl: "uczę się", ar: "بتعلم", ph: "bat3allem" },
  { cat: "life", pl: "nauczyciel(ka)", ar: "مدرس / مدرسة", ph: "modarres / modarresa" },
  { cat: "life", pl: "język", ar: "لغة", ph: "lo8a" },
  { cat: "life", pl: "arabski (język)", ar: "عربي", ph: "3arabi" },
  { cat: "life", pl: "polski (język)", ar: "بولندي", ph: "bolandi" },
  { cat: "life", pl: "lekcja", ar: "درس", ph: "dars" },
  { cat: "life", pl: "trudny", ar: "صعب", ph: "Sa3b" },
  { cat: "life", pl: "łatwy", ar: "سهل", ph: "sahl" },
  { cat: "life", pl: "przez internet / online", ar: "أونلاين", ph: "onlaayn" },
  { cat: "life", pl: "hobby", ar: "هواية", ph: "hewaaya" },
  // dom i miejsca
  { cat: "life", pl: "mieszkanie", ar: "شقة", ph: "sha22a" },
  { cat: "life", pl: "miasto", ar: "مدينة", ph: "mediina" },
  { cat: "life", pl: "kraj", ar: "بلد", ph: "balad" },
  { cat: "life", pl: "Polska", ar: "بولندا", ph: "bolanda" },
  { cat: "life", pl: "Egipt", ar: "مصر", ph: "maSr" },
  { cat: "life", pl: "za granicą", ar: "برة", ph: "barra" },
  // zwierzęta
  { cat: "life", pl: "pies", ar: "كلب", ph: "kalb" },
  { cat: "life", pl: "kot", ar: "قطة", ph: "2oTTa" },
  // czasowniki uczuć/relacji przydatne o sobie
  { cat: "life", pl: "lubię / kocham", ar: "بحب", ph: "baHebb" },
  { cat: "life", pl: "mieszkam (m.)", ar: "ساكن", ph: "saaken" },
  { cat: "life", pl: "od dwóch lat", ar: "من سنتين", ph: "min santeen" },
  { cat: "life", pl: "rok", ar: "سنة", ph: "sana" },
  { cat: "life", pl: "razem", ar: "مع بعض", ph: "ma3 ba3D" },
];

// ---------- Kolory ----------
const COLOR_WORDS = [
  { cat: "colors", pl: "kolor", ar: "لون", ph: "loon" },
  { cat: "colors", pl: "czerwony", ar: "أحمر", ph: "aHmar", ex: { ar: "العربية حمرا.", ph: "il-3arabeyya Hamra.", pl: "Samochód jest czerwony." } },
  { cat: "colors", pl: "niebieski", ar: "أزرق", ph: "azra2", ex: { ar: "السما زرقا النهارده.", ph: "is-sama zar2a innaharda.", pl: "Niebo jest dziś niebieskie." } },
  { cat: "colors", pl: "zielony", ar: "أخضر", ph: "akhDar" },
  { cat: "colors", pl: "żółty", ar: "أصفر", ph: "aSfar" },
  { cat: "colors", pl: "czarny", ar: "أسود", ph: "eswed" },
  { cat: "colors", pl: "biały", ar: "أبيض", ph: "abyaD" },
  { cat: "colors", pl: "brązowy", ar: "بني", ph: "bonni" },
  { cat: "colors", pl: "pomarańczowy", ar: "برتقاني", ph: "borto2aani" },
  { cat: "colors", pl: "różowy", ar: "بمبي", ph: "bambi" },
  { cat: "colors", pl: "szary", ar: "رمادي", ph: "romaadi" },
  { cat: "colors", pl: "fioletowy", ar: "بنفسجي", ph: "banafsegi" },
  { cat: "colors", pl: "jasny", ar: "فاتح", ph: "faateH", ex: { ar: "أزرق فاتح.", ph: "azra2 faateH.", pl: "Jasnoniebieski." } },
  { cat: "colors", pl: "ciemny", ar: "غامق", ph: "8aame2", ex: { ar: "أخضر غامق.", ph: "akhDar 8aame2.", pl: "Ciemnozielony." } },
];

// ---------- Przymiotniki opisowe ----------
const ADJECTIVE_WORDS = [
  { cat: "adjectives", pl: "duży", ar: "كبير", ph: "kebiir", ex: { ar: "البيت ده كبير.", ph: "il-beet da kebiir.", pl: "Ten dom jest duży." } },
  { cat: "adjectives", pl: "mały", ar: "صغير", ph: "So8ayyar", ex: { ar: "العيال صغيرين.", ph: "il-3eyaal So8ayyariin.", pl: "Dzieci są małe." } },
  { cat: "adjectives", pl: "ładny / piękny", ar: "جميل", ph: "gamiil" },
  { cat: "adjectives", pl: "brzydki", ar: "وحش", ph: "weHesh" },
  { cat: "adjectives", pl: "długi", ar: "طويل", ph: "Tawiil" },
  { cat: "adjectives", pl: "krótki", ar: "قصير", ph: "2oSayyar" },
  { cat: "adjectives", pl: "wysoki", ar: "عالي", ph: "3aali" },
  { cat: "adjectives", pl: "niski", ar: "واطي", ph: "waaTi" },
  { cat: "adjectives", pl: "gruby", ar: "تخين", ph: "tekhiin" },
  { cat: "adjectives", pl: "szczupły / chudy", ar: "رفيع", ph: "rofayya3" },
  { cat: "adjectives", pl: "stary (o rzeczy)", ar: "قديم", ph: "2adiim" },
  { cat: "adjectives", pl: "nowy", ar: "جديد", ph: "gediid" },
  { cat: "adjectives", pl: "szybki", ar: "سريع", ph: "sarii3" },
  { cat: "adjectives", pl: "wolny (powolny)", ar: "بطيء", ph: "baTii2" },
  { cat: "adjectives", pl: "silny / mocny", ar: "قوي", ph: "2awi" },
  { cat: "adjectives", pl: "słaby", ar: "ضعيف", ph: "Da3iif" },
  { cat: "adjectives", pl: "bogaty", ar: "غني", ph: "8ani" },
  { cat: "adjectives", pl: "biedny", ar: "فقير", ph: "fa2iir" },
  { cat: "adjectives", pl: "łatwy", ar: "سهل", ph: "sahl" },
  { cat: "adjectives", pl: "trudny", ar: "صعب", ph: "Sa3b" },
  { cat: "adjectives", pl: "pełny", ar: "مليان", ph: "malyaan" },
  { cat: "adjectives", pl: "pusty", ar: "فاضي", ph: "faaDi" },
  { cat: "adjectives", pl: "czysty", ar: "نضيف", ph: "neDiif" },
  { cat: "adjectives", pl: "brudny", ar: "وسخ", ph: "wesekh" },
  { cat: "adjectives", pl: "drogi", ar: "غالي", ph: "8aali" },
  { cat: "adjectives", pl: "tani", ar: "رخيص", ph: "rekhiiS" },
  { cat: "adjectives", pl: "ważny", ar: "مهم", ph: "mohemm" },
  { cat: "adjectives", pl: "prawdziwy", ar: "حقيقي", ph: "Ha2ii2i" },
];

// ---------- Czasowniki codzienne (forma podstawowa, on/ona) ----------
const DAILY_VERB_WORDS = [
  { cat: "daily_verbs", pl: "dawać", ar: "يدي", ph: "yeddi", ex: { ar: "ممكن تديني المية؟", ph: "momken teddiini il-mayya?", pl: "Możesz mi dać wodę?" } },
  { cat: "daily_verbs", pl: "brać", ar: "ياخد", ph: "yaakhod", ex: { ar: "خد الكتاب ده.", ph: "khod il-ketaab da.", pl: "Weź tę książkę." } },
  { cat: "daily_verbs", pl: "kupować", ar: "يشتري", ph: "yeshteri", ex: { ar: "بشتري خضار من السوق.", ph: "bashteri khoDaar min is-suu2.", pl: "Kupuję warzywa na targu." } },
  { cat: "daily_verbs", pl: "sprzedawać", ar: "يبيع", ph: "yebii3" },
  { cat: "daily_verbs", pl: "otwierać", ar: "يفتح", ph: "yeftaH", ex: { ar: "افتح الشباك.", ph: "eftaH ish-shebbaak.", pl: "Otwórz okno." } },
  { cat: "daily_verbs", pl: "zamykać", ar: "يقفل", ph: "ye2fel" },
  { cat: "daily_verbs", pl: "zaczynać", ar: "يبدأ", ph: "yebda2" },
  { cat: "daily_verbs", pl: "kończyć", ar: "يخلص", ph: "yekhallaS" },
  { cat: "daily_verbs", pl: "szukać", ar: "يدور", ph: "yedawwar", ex: { ar: "بدور على المفتاح.", ph: "badawwar 3ala il-muftaaH.", pl: "Szukam klucza." } },
  { cat: "daily_verbs", pl: "znajdować", ar: "يلاقي", ph: "yelaa2i" },
  { cat: "daily_verbs", pl: "pomagać", ar: "يساعد", ph: "yesaa3ed", ex: { ar: "ممكن تساعدني؟", ph: "momken tesa3edni?", pl: "Możesz mi pomóc?" } },
  { cat: "daily_verbs", pl: "pytać", ar: "يسأل", ph: "yes2al" },
  { cat: "daily_verbs", pl: "odpowiadać", ar: "يرد", ph: "yeredd" },
  { cat: "daily_verbs", pl: "mówić / powiedzieć", ar: "يقول", ph: "ye2uul" },
  { cat: "daily_verbs", pl: "słuchać", ar: "يسمع", ph: "yesma3" },
  { cat: "daily_verbs", pl: "czytać", ar: "يقرأ", ph: "ye2ra" },
  { cat: "daily_verbs", pl: "myśleć", ar: "يفكر", ph: "yefakkar" },
  { cat: "daily_verbs", pl: "wiedzieć / znać", ar: "يعرف", ph: "ye3raf" },
  { cat: "daily_verbs", pl: "lubić / kochać", ar: "يحب", ph: "yeHebb" },
  { cat: "daily_verbs", pl: "grać", ar: "يلعب", ph: "yel3ab" },
  { cat: "daily_verbs", pl: "pracować", ar: "يشتغل", ph: "yeshtaghal" },
  { cat: "daily_verbs", pl: "płacić", ar: "يدفع", ph: "yedfa3" },
  { cat: "daily_verbs", pl: "czekać", ar: "يستنى", ph: "yestanna", ex: { ar: "استنى شوية.", ph: "estanna shwayya.", pl: "Poczekaj chwilę." } },
  { cat: "daily_verbs", pl: "używać", ar: "يستعمل", ph: "yesta3mel" },
];

// ---------- Czasowniki ruchu ----------
const MOTION_VERB_WORDS = [
  { cat: "motion", pl: "iść / chodzić", ar: "يمشي", ph: "yemshi", ex: { ar: "بمشي كل يوم.", ph: "bamshi koll yoom.", pl: "Chodzę codziennie." } },
  { cat: "motion", pl: "iść (dokądś)", ar: "يروح", ph: "yeruuH", ex: { ar: "بروح الشغل بدري.", ph: "baruuH ish-shughl badri.", pl: "Idę do pracy wcześnie." } },
  { cat: "motion", pl: "przychodzić", ar: "ييجي", ph: "yiigi", ex: { ar: "تعالى هنا!", ph: "ta3aala hena!", pl: "Chodź tutaj!" } },
  { cat: "motion", pl: "wracać", ar: "يرجع", ph: "yerga3" },
  { cat: "motion", pl: "wchodzić", ar: "يدخل", ph: "yedkhol" },
  { cat: "motion", pl: "wychodzić", ar: "يخرج", ph: "yokhrog" },
  { cat: "motion", pl: "jechać (pojazdem)", ar: "يركب", ph: "yerkab", ex: { ar: "بركب تاكسي.", ph: "barkab taksi.", pl: "Jadę taksówką." } },
  { cat: "motion", pl: "wstawać", ar: "يقوم", ph: "ye2uum" },
  { cat: "motion", pl: "siadać", ar: "يقعد", ph: "yo23od", ex: { ar: "اقعد هنا.", ph: "o23od hena.", pl: "Usiądź tutaj." } },
  { cat: "motion", pl: "stać / zatrzymać się", ar: "يقف", ph: "ye2af" },
  { cat: "motion", pl: "biegać", ar: "يجري", ph: "yegri" },
  { cat: "motion", pl: "podróżować", ar: "يسافر", ph: "yesaafer", ex: { ar: "بسافر مصر كل سنة.", ph: "basaafer maSr koll sana.", pl: "Podróżuję do Egiptu co roku." } },
];

// ---------- Przysłówki czasu i częstotliwości ----------
const TIME_ADVERB_WORDS = [
  { cat: "time_adverbs", pl: "teraz", ar: "دلوقتي", ph: "delwa2ti" },
  { cat: "time_adverbs", pl: "potem / później", ar: "بعدين", ph: "ba3deen" },
  { cat: "time_adverbs", pl: "wcześniej / przedtem", ar: "قبل كده", ph: "2abl keda" },
  { cat: "time_adverbs", pl: "zawsze", ar: "دايماً", ph: "daayman", ex: { ar: "بشرب قهوة دايماً.", ph: "bashrab 2ahwa daayman.", pl: "Zawsze piję kawę." } },
  { cat: "time_adverbs", pl: "nigdy", ar: "أبداً", ph: "abadan" },
  { cat: "time_adverbs", pl: "czasami", ar: "أحياناً", ph: "aHyaanan" },
  { cat: "time_adverbs", pl: "często", ar: "كتير", ph: "ketiir" },
  { cat: "time_adverbs", pl: "rzadko", ar: "نادراً", ph: "naadran" },
  { cat: "time_adverbs", pl: "wczoraj", ar: "إمبارح", ph: "embaareH" },
  { cat: "time_adverbs", pl: "dzisiaj", ar: "النهارده", ph: "innaharda" },
  { cat: "time_adverbs", pl: "jutro", ar: "بكرة", ph: "bukra" },
  { cat: "time_adverbs", pl: "wcześnie", ar: "بدري", ph: "badri" },
  { cat: "time_adverbs", pl: "późno", ar: "متأخر", ph: "met2akhkhar" },
  { cat: "time_adverbs", pl: "szybko", ar: "بسرعة", ph: "besor3a" },
  { cat: "time_adverbs", pl: "powoli", ar: "بالراحة", ph: "bir-raaHa" },
  { cat: "time_adverbs", pl: "jeszcze / wciąż", ar: "لسه", ph: "lessa" },
  { cat: "time_adverbs", pl: "już", ar: "خلاص", ph: "khalaaS" },
];

// ---------- Ciało ----------
const BODY_WORDS = [
  { cat: "body", pl: "głowa", ar: "راس", ph: "raas" },
  { cat: "body", pl: "twarz", ar: "وش", ph: "wesh" },
  { cat: "body", pl: "oko", ar: "عين", ph: "3een" },
  { cat: "body", pl: "ucho", ar: "ودن", ph: "wedn" },
  { cat: "body", pl: "nos", ar: "مناخير", ph: "manakhiir" },
  { cat: "body", pl: "usta", ar: "بق", ph: "bo22" },
  { cat: "body", pl: "ząb", ar: "سنة", ph: "senna" },
  { cat: "body", pl: "język (w ustach)", ar: "لسان", ph: "lesaan" },
  { cat: "body", pl: "włosy", ar: "شعر", ph: "sha3r" },
  { cat: "body", pl: "szyja", ar: "رقبة", ph: "ra2aba" },
  { cat: "body", pl: "ręka / dłoń", ar: "إيد", ph: "iid" },
  { cat: "body", pl: "palec", ar: "صباع", ph: "Sobaa3" },
  { cat: "body", pl: "noga", ar: "رجل", ph: "regl" },
  { cat: "body", pl: "stopa", ar: "قدم", ph: "2adam" },
  { cat: "body", pl: "serce", ar: "قلب", ph: "2alb" },
  { cat: "body", pl: "brzuch", ar: "بطن", ph: "baTn" },
  { cat: "body", pl: "plecy", ar: "ضهر", ph: "Dahr" },
  { cat: "body", pl: "ramię / bark", ar: "كتف", ph: "ketf" },
];

// ---------- Ubrania ----------
const CLOTHES_WORDS = [
  { cat: "clothes", pl: "ubrania", ar: "هدوم", ph: "hoduum" },
  { cat: "clothes", pl: "koszula", ar: "قميص", ph: "2amiiS" },
  { cat: "clothes", pl: "spodnie", ar: "بنطلون", ph: "banTaloon" },
  { cat: "clothes", pl: "buty", ar: "جزمة", ph: "gazma" },
  { cat: "clothes", pl: "sukienka", ar: "فستان", ph: "fostaan" },
  { cat: "clothes", pl: "kurtka / płaszcz", ar: "جاكيت", ph: "zhakeet" },
  { cat: "clothes", pl: "czapka / kapelusz", ar: "قبعة", ph: "2obba3a" },
  { cat: "clothes", pl: "skarpetki", ar: "شراب", ph: "sharaab" },
  { cat: "clothes", pl: "sweter", ar: "بلوفر", ph: "belofar" },
  { cat: "clothes", pl: "koszulka (t-shirt)", ar: "تي شيرت", ph: "ti-shirt" },
  { cat: "clothes", pl: "okulary", ar: "نضارة", ph: "naDDaara" },
  { cat: "clothes", pl: "zegarek", ar: "ساعة", ph: "saa3a" },
  { cat: "clothes", pl: "torba", ar: "شنطة", ph: "shanTa" },
  { cat: "clothes", pl: "nosić / zakładać", ar: "يلبس", ph: "yelbes", ex: { ar: "بلبس جاكيت في الشتا.", ph: "balbes zhakeet fish-shita.", pl: "Noszę kurtkę zimą." } },
];

// ---------- Dom i meble ----------
const HOME_FURNITURE_WORDS = [
  { cat: "home_furniture", pl: "dom", ar: "بيت", ph: "beet" },
  { cat: "home_furniture", pl: "pokój", ar: "أوضة", ph: "ooDa" },
  { cat: "home_furniture", pl: "kuchnia (pomieszczenie)", ar: "مطبخ", ph: "maTbakh" },
  { cat: "home_furniture", pl: "łazienka", ar: "حمام", ph: "Hammaam" },
  { cat: "home_furniture", pl: "salon", ar: "صالة", ph: "Saala" },
  { cat: "home_furniture", pl: "sypialnia", ar: "أوضة نوم", ph: "ooDet noom" },
  { cat: "home_furniture", pl: "stół", ar: "ترابيزة", ph: "tarabeeza" },
  { cat: "home_furniture", pl: "krzesło", ar: "كرسي", ph: "korsi" },
  { cat: "home_furniture", pl: "łóżko", ar: "سرير", ph: "seriir" },
  { cat: "home_furniture", pl: "drzwi", ar: "باب", ph: "baab" },
  { cat: "home_furniture", pl: "okno", ar: "شباك", ph: "shebbaak" },
  { cat: "home_furniture", pl: "ściana", ar: "حيطة", ph: "HeeTa" },
  { cat: "home_furniture", pl: "podłoga", ar: "أرض", ph: "arD" },
  { cat: "home_furniture", pl: "lampa", ar: "لمبة", ph: "lamba" },
  { cat: "home_furniture", pl: "szafa", ar: "دولاب", ph: "dolaab" },
  { cat: "home_furniture", pl: "kanapa", ar: "كنبة", ph: "kanaba" },
  { cat: "home_furniture", pl: "lodówka", ar: "تلاجة", ph: "tallaaga" },
  { cat: "home_furniture", pl: "klucz", ar: "مفتاح", ph: "moftaaH" },
  { cat: "home_furniture", pl: "winda", ar: "أسانسير", ph: "asanseer" },
  { cat: "home_furniture", pl: "schody", ar: "سلم", ph: "sellem" },
];

// ---------- Natura i miejsca ----------
const NATURE_WORDS = [
  { cat: "nature", pl: "morze", ar: "بحر", ph: "baHr" },
  { cat: "nature", pl: "góra", ar: "جبل", ph: "gabal" },
  { cat: "nature", pl: "rzeka", ar: "نهر", ph: "nahr" },
  { cat: "nature", pl: "Nil", ar: "النيل", ph: "in-niil" },
  { cat: "nature", pl: "plaża", ar: "شاطئ", ph: "shaaTe2" },
  { cat: "nature", pl: "pustynia", ar: "صحرا", ph: "SaHra" },
  { cat: "nature", pl: "niebo", ar: "سما", ph: "sama" },
  { cat: "nature", pl: "słońce", ar: "شمس", ph: "shams" },
  { cat: "nature", pl: "księżyc", ar: "قمر", ph: "2amar" },
  { cat: "nature", pl: "gwiazda", ar: "نجمة", ph: "negma" },
  { cat: "nature", pl: "drzewo", ar: "شجرة", ph: "shagara" },
  { cat: "nature", pl: "kwiat", ar: "وردة", ph: "warda" },
  { cat: "nature", pl: "ogród / park", ar: "جنينة", ph: "geneena" },
  { cat: "nature", pl: "ulica", ar: "شارع", ph: "shaare3" },
  { cat: "nature", pl: "wieś", ar: "قرية", ph: "2arya" },
  { cat: "nature", pl: "kamień", ar: "حجر", ph: "Hagar" },
  { cat: "nature", pl: "piasek", ar: "رمل", ph: "raml" },
];

// ---------- Transport ----------
const TRANSPORT_WORDS = [
  { cat: "transport", pl: "samochód", ar: "عربية", ph: "3arabeyya" },
  { cat: "transport", pl: "autobus", ar: "أتوبيس", ph: "otobiis" },
  { cat: "transport", pl: "pociąg", ar: "قطر", ph: "2aTr" },
  { cat: "transport", pl: "samolot", ar: "طيارة", ph: "Tayyaara" },
  { cat: "transport", pl: "taksówka", ar: "تاكسي", ph: "taksi" },
  { cat: "transport", pl: "metro", ar: "مترو", ph: "metro" },
  { cat: "transport", pl: "rower", ar: "عجلة", ph: "3agala" },
  { cat: "transport", pl: "statek / łódź", ar: "مركب", ph: "markeb" },
  { cat: "transport", pl: "lotnisko", ar: "مطار", ph: "maTaar" },
  { cat: "transport", pl: "stacja / przystanek", ar: "محطة", ph: "maHaTTa" },
  { cat: "transport", pl: "bilet", ar: "تذكرة", ph: "tazkara" },
  { cat: "transport", pl: "droga", ar: "طريق", ph: "Tarii2" },
  { cat: "transport", pl: "benzyna", ar: "بنزين", ph: "banziin" },
];

// ---------- Zawody ----------
const JOB_WORDS = [
  { cat: "jobs", pl: "nauczyciel", ar: "مدرس", ph: "modarres" },
  { cat: "jobs", pl: "lekarz", ar: "دكتور", ph: "doktoor" },
  { cat: "jobs", pl: "inżynier", ar: "مهندس", ph: "mohandes" },
  { cat: "jobs", pl: "kierowca", ar: "سواق", ph: "sawwaa2" },
  { cat: "jobs", pl: "sprzedawca", ar: "بياع", ph: "bayyaa3" },
  { cat: "jobs", pl: "policjant", ar: "ظابط", ph: "ZaabeT" },
  { cat: "jobs", pl: "kucharz", ar: "طباخ", ph: "Tabbaakh" },
  { cat: "jobs", pl: "prawnik", ar: "محامي", ph: "moHaami" },
  { cat: "jobs", pl: "student", ar: "طالب", ph: "Taaleb" },
  { cat: "jobs", pl: "urzędnik / pracownik", ar: "موظف", ph: "mowaZZaf" },
  { cat: "jobs", pl: "rolnik", ar: "فلاح", ph: "fallaaH" },
  { cat: "jobs", pl: "artysta", ar: "فنان", ph: "fannaan" },
];

// ---------- Emocje i stany ----------
const EMOTION_WORDS = [
  { cat: "emotions", pl: "szczęśliwy / zadowolony", ar: "مبسوط", ph: "mabsuuT", ex: { ar: "أنا مبسوط النهارده.", ph: "ana mabsuuT innaharda.", pl: "Jestem dziś szczęśliwy." } },
  { cat: "emotions", pl: "smutny", ar: "زعلان", ph: "za3laan" },
  { cat: "emotions", pl: "zły / wkurzony", ar: "متعصب", ph: "met3aSSeb" },
  { cat: "emotions", pl: "zmęczony", ar: "تعبان", ph: "ta3baan" },
  { cat: "emotions", pl: "zdenerwowany / zmartwiony", ar: "قلقان", ph: "2al2aan" },
  { cat: "emotions", pl: "spokojny", ar: "هادي", ph: "haadi" },
  { cat: "emotions", pl: "przestraszony", ar: "خايف", ph: "khaayef" },
  { cat: "emotions", pl: "znudzony", ar: "زهقان", ph: "zah2aan" },
  { cat: "emotions", pl: "głodny", ar: "جعان", ph: "ga3aan" },
  { cat: "emotions", pl: "spragniony", ar: "عطشان", ph: "3aTshaan" },
  { cat: "emotions", pl: "dumny", ar: "فخور", ph: "fakhuur" },
  { cat: "emotions", pl: "zaskoczony", ar: "متفاجئ", ph: "metfaage2" },
];

// ---------- Zwierzęta ----------
const ANIMAL_WORDS = [
  { cat: "animals", pl: "pies", ar: "كلب", ph: "kalb" },
  { cat: "animals", pl: "kot", ar: "قطة", ph: "2oTTa" },
  { cat: "animals", pl: "koń", ar: "حصان", ph: "HoSaan" },
  { cat: "animals", pl: "krowa", ar: "بقرة", ph: "ba2ara" },
  { cat: "animals", pl: "ptak", ar: "عصفور", ph: "3aSfuur" },
  { cat: "animals", pl: "ryba", ar: "سمكة", ph: "samaka" },
  { cat: "animals", pl: "osioł", ar: "حمار", ph: "Homaar" },
  { cat: "animals", pl: "wielbłąd", ar: "جمل", ph: "gamal" },
  { cat: "animals", pl: "owca", ar: "خروف", ph: "kharuuf" },
  { cat: "animals", pl: "mysz", ar: "فار", ph: "faar" },
  { cat: "animals", pl: "lew", ar: "أسد", ph: "asad" },
];

// ---------- Liczby porządkowe ----------
const ORDINAL_WORDS = [
  { cat: "ordinals", pl: "pierwszy", ar: "أول", ph: "awwel", ex: { ar: "ده أول يوم.", ph: "da awwel yoom.", pl: "To pierwszy dzień." } },
  { cat: "ordinals", pl: "drugi", ar: "تاني", ph: "taani" },
  { cat: "ordinals", pl: "trzeci", ar: "تالت", ph: "taalet" },
  { cat: "ordinals", pl: "czwarty", ar: "رابع", ph: "raabe3" },
  { cat: "ordinals", pl: "piąty", ar: "خامس", ph: "khaames" },
  { cat: "ordinals", pl: "szósty", ar: "سادس", ph: "saades" },
  { cat: "ordinals", pl: "siódmy", ar: "سابع", ph: "saabe3" },
  { cat: "ordinals", pl: "ósmy", ar: "تامن", ph: "taamen" },
  { cat: "ordinals", pl: "dziewiąty", ar: "تاسع", ph: "taase3" },
  { cat: "ordinals", pl: "dziesiąty", ar: "عاشر", ph: "3aasher" },
  { cat: "ordinals", pl: "ostatni", ar: "آخر", ph: "aakher" },
];

// Przykłady dla słów, które nie mają własnego pola ex i nie występują w dialogach.
// Klucz = wordId (cat|pl|ar). Doklejane w loadWords, nie zmieniają definicji słowa
// (więc wordId się nie zmienia i postęp jest zachowany).
const EXAMPLES_EXTRA = {
  // --- jedzenie i zakupy ---
  "food_shopping|owoce|فاكهة": { ar: "بحب الفاكهة الطازة.", ph: "baHebb il-faakha iT-Taaza.", pl: "Lubię świeże owoce." },
  "food_shopping|jabłko|تفاحة": { ar: "كلت تفاحة الصبح.", ph: "kalt toffaaHa iS-SobH.", pl: "Zjadłem jabłko rano." },
  "food_shopping|banan|موزة": { ar: "الموزة دي مستوية.", ph: "il-mooza di mestewya.", pl: "Ten banan jest dojrzały." },
  "food_shopping|pomarańcza|برتقانة": { ar: "عصير البرتقان لذيذ.", ph: "3aSiir il-borto2aan laziiz.", pl: "Sok pomarańczowy jest pyszny." },
  "food_shopping|winogrona|عنب": { ar: "العنب حلو أوي.", ph: "il-3enab Helw awi.", pl: "Winogrona są bardzo słodkie." },
  "food_shopping|arbuz|بطيخ": { ar: "البطيخ حلو في الصيف.", ph: "il-baTTiikh Helw fiS-Seef.", pl: "Arbuz jest dobry latem." },
  "food_shopping|mango|مانجة": { ar: "المانجة فاكهة مصرية.", ph: "il-manga faakha maSreyya.", pl: "Mango to egipski owoc." },
  "food_shopping|cytryna|لمونة": { ar: "عايز لمونة على السلطة.", ph: "3aayez lamuuna 3ala is-salaTa.", pl: "Chcę cytrynę do sałatki." },
  "food_shopping|daktyle|بلح": { ar: "البلح حلو ومفيد.", ph: "il-balaH Helw we mefiid.", pl: "Daktyle są słodkie i zdrowe." },
  "food_shopping|warzywa|خضار": { ar: "بشتري الخضار من السوق.", ph: "bashteri il-khoDaar min is-suu2.", pl: "Kupuję warzywa na targu." },
  "food_shopping|pomidor|طماطم": { ar: "كيلو طماطم لو سمحت.", ph: "kiilo TamaaTem law samaHt.", pl: "Kilo pomidorów poproszę." },
  "food_shopping|ziemniak|بطاطس": { ar: "بحب البطاطس المقلية.", ph: "baHebb il-baTaaTes il-ma2leyya.", pl: "Lubię smażone ziemniaki." },
  "food_shopping|cebula|بصل": { ar: "من غير بصل من فضلك.", ph: "min 8eer baSal min faDlak.", pl: "Bez cebuli proszę." },
  "food_shopping|czosnek|توم": { ar: "التوم بيدي طعم حلو.", ph: "it-toom biyeddi Ta3m Helw.", pl: "Czosnek nadaje dobry smak." },
  "food_shopping|ogórek|خيار": { ar: "الخيار في السلطة.", ph: "il-khiyaar fis-salaTa.", pl: "Ogórek jest w sałatce." },
  "food_shopping|marchew|جزر": { ar: "الجزر لونه برتقاني.", ph: "il-gazar loono borto2aani.", pl: "Marchew jest pomarańczowa." },
  "food_shopping|bakłażan|بتنجان": { ar: "بحب البتنجان المطبوخ.", ph: "baHebb il-betengaan il-maTbuukh.", pl: "Lubię duszony bakłażan." },
  "food_shopping|papryka|فلفل": { ar: "الفلفل ده حار.", ph: "il-felfel da Haar.", pl: "Ta papryka jest ostra." },
  "food_shopping|mięso|لحمة": { ar: "اللحمة غالية النهارده.", ph: "il-laHma 8alya innaharda.", pl: "Mięso jest dziś drogie." },
  "food_shopping|kurczak|فراخ": { ar: "بنطبخ فراخ يوم الجمعة.", ph: "beniTbokh feraakh yoom ig-gom3a.", pl: "Gotujemy kurczaka w piątek." },
  "food_shopping|jajko|بيضة": { ar: "بفطر بيضة كل يوم.", ph: "bafTar beeDa koll yoom.", pl: "Jem jajko na śniadanie codziennie." },
  "food_shopping|fasola bób (ful)|فول": { ar: "الفول أكلة مصرية شعبية.", ph: "il-fuul akla maSreyya sha3beyya.", pl: "Ful to popularna egipska potrawa." },
  "food_shopping|sól|ملح": { ar: "الأكل عايز شوية ملح.", ph: "il-akl 3aayez shwayyet malH.", pl: "Jedzenie potrzebuje trochę soli." },
  "food_shopping|olej|زيت": { ar: "بستعمل زيت الزيتون.", ph: "basta3mel zeet iz-zatuun.", pl: "Używam oliwy z oliwek." },
  "food_shopping|masło|زبدة": { ar: "بحط زبدة على العيش.", ph: "baHoTT zebda 3ala il-3eesh.", pl: "Kładę masło na chleb." },
  "food_shopping|miód|عسل": { ar: "العسل أحلى من السكر.", ph: "il-3asal aHla min is-sokkar.", pl: "Miód jest słodszy niż cukier." },
  "food_shopping|sok|عصير": { ar: "عايز عصير مانجة.", ph: "3aayez 3aSiir manga.", pl: "Chcę sok z mango." },
  "food_shopping|sklep|محل": { ar: "المحل ده قريب من البيت.", ph: "il-maHall da 2orayyeb min il-beet.", pl: "Ten sklep jest blisko domu." },
  "food_shopping|targ / bazar|سوق": { ar: "السوق زحمة يوم الجمعة.", ph: "is-suu2 zaHma yoom ig-gom3a.", pl: "Targ jest zatłoczony w piątek." },
  "food_shopping|piekarnia|مخبز": { ar: "العيش سخن من المخبز.", ph: "il-3eesh sokhn min il-makhbaz.", pl: "Chleb jest ciepły z piekarni." },
  "food_shopping|rzeźnik|جزار": { ar: "بشتري اللحمة من الجزار.", ph: "bashteri il-laHma min il-gazzaar.", pl: "Kupuję mięso u rzeźnika." },
  "food_shopping|reszta (pieniądze)|الباقي": { ar: "خد الباقي من فضلك.", ph: "khod il-baa2i min faDlak.", pl: "Weź resztę proszę." },
  "food_shopping|świeży|طازة": { ar: "العيش ده طازة.", ph: "il-3eesh da Taaza.", pl: "Ten chleb jest świeży." },
  "food_shopping|dojrzały|مستوي": { ar: "المانجة مستوية وحلوة.", ph: "il-manga mestewya we Helwa.", pl: "Mango jest dojrzałe i słodkie." },
  "food_shopping|Gotówką|كاش": { ar: "هدفع كاش.", ph: "hadfa3 kaash.", pl: "Zapłacę gotówką." },
  "food_shopping|Wezmę to|هاخده": { ar: "تمام، هاخده.", ph: "tamaam, haakhdo.", pl: "Dobrze, wezmę to." },
  "food_shopping|Torba / reklamówka|كيس": { ar: "ممكن كيس من فضلك؟", ph: "momken kiis min faDlak?", pl: "Można torbę proszę?" },
  // --- kuchnia ---
  "kitchen|duszony / w sosie|مطبوخ": { ar: "الأكل ده مطبوخ كويس.", ph: "il-akl da maTbuukh kwayyes.", pl: "To jedzenie jest dobrze ugotowane." },
  "kitchen|ostry / pikantny|حار": { ar: "الأكل ده حار أوي.", ph: "il-akl da Haar awi.", pl: "To jedzenie jest bardzo ostre." },
  "kitchen|słony|مالح": { ar: "الشوربة مالحة شوية.", ph: "ish-shorba maalHa shwayya.", pl: "Zupa jest trochę słona." },
  "kitchen|kwaśny|حامض": { ar: "اللمون حامض.", ph: "il-lamuun HaameD.", pl: "Cytryna jest kwaśna." },
  "kitchen|pyszny|لذيذ": { ar: "الأكل لذيذ جداً!", ph: "il-akl laziiz gedan!", pl: "Jedzenie jest bardzo pyszne!" },
  "kitchen|zimny|بارد": { ar: "المية باردة.", ph: "il-mayya baarda.", pl: "Woda jest zimna." },
  "kitchen|gorący / ciepły|سخن": { ar: "الشاي سخن.", ph: "ish-shaay sokhn.", pl: "Herbata jest gorąca." },
  "kitchen|falafel (ta3meya)|طعمية": { ar: "الطعمية أكلة الفطار.", ph: "iT-Ta3meyya aklet il-faTaar.", pl: "Falafel to danie śniadaniowe." },
  "kitchen|shawarma|شاورما": { ar: "عايز ساندويتش شاورما.", ph: "3aayez sandawitsh shawerma.", pl: "Chcę kanapkę z shawarmą." },
  "kitchen|kofta (mielone na grillu)|كفتة": { ar: "الكفتة مشوية على الفحم.", ph: "il-kofta mashweyya 3ala il-faHm.", pl: "Kofta jest grillowana na węglu." },
  "kitchen|sałatka|سلطة": { ar: "السلطة فيها خضار كتير.", ph: "is-salaTa fiiha khoDaar ketiir.", pl: "W sałatce jest dużo warzyw." },
  "kitchen|zupa|شوربة": { ar: "الشوربة سخنة وحلوة.", ph: "ish-shorba sokhna we Helwa.", pl: "Zupa jest ciepła i dobra." },
  "kitchen|makaron|مكرونة": { ar: "بحب المكرونة بالصلصة.", ph: "baHebb il-makaroona biS-SalSa.", pl: "Lubię makaron z sosem." },
  "kitchen|talerz|طبق": { ar: "حط الأكل في الطبق.", ph: "HoTT il-akl fiT-Taba2.", pl: "Połóż jedzenie na talerzu." },
  "kitchen|szklanka|كباية": { ar: "عايز كباية مية.", ph: "3aayez kobaayet mayya.", pl: "Chcę szklankę wody." },
  "kitchen|widelec|شوكة": { ar: "الشوكة على الطبق.", ph: "ish-shooka 3ala iT-Taba2.", pl: "Widelec jest na talerzu." },
  "kitchen|łyżka|معلقة": { ar: "معلقة سكر في الشاي.", ph: "ma3la2et sokkar fish-shaay.", pl: "Łyżka cukru do herbaty." },
  "kitchen|nóż|سكينة": { ar: "السكينة قاطعة.", ph: "is-sekkiina 2aT3a.", pl: "Nóż jest ostry." },
  "kitchen|gotować|يطبخ": { ar: "مراتي بتطبخ كويس.", ph: "meraati betoTbokh kwayyes.", pl: "Moja żona dobrze gotuje." },
  "kitchen|jeść|ياكل": { ar: "بياكل كتير.", ph: "biyaakol ketiir.", pl: "Dużo je." },
  "kitchen|pić|يشرب": { ar: "بيشرب قهوة كل يوم.", ph: "biyeshrab 2ahwa koll yoom.", pl: "Pije kawę codziennie." },
  // --- rodzina ---
  "family|dzieci|عيال": { ar: "عندي عيال كتير.", ph: "3andi 3eyaal ketiir.", pl: "Mam dużo dzieci." },
  "family|dziecko / chłopiec|ولد": { ar: "الولد ده شاطر.", ph: "il-walad da shaaTer.", pl: "Ten chłopiec jest zdolny." },
  "family|rodzice|الوالدين": { ar: "بحب والديّ أوي.", ph: "baHebb waldeyya awi.", pl: "Bardzo kocham rodziców." },
  "family|dziadek|جد": { ar: "جدي عنده تمانين سنة.", ph: "geddi 3ando tamaniin sana.", pl: "Mój dziadek ma osiemdziesiąt lat." },
  "family|babcia|جدة": { ar: "جدتي بتطبخ حلو.", ph: "geddeti betoTbokh Helw.", pl: "Moja babcia dobrze gotuje." },
  "family|ciotka (siostra ojca)|عمة": { ar: "عمتي أخت أبويا.", ph: "3ammeti okht abuuya.", pl: "Ciotka to siostra mojego ojca." },
  "family|ciotka (siostra matki)|خالة": { ar: "خالتي ساكنة في طنطا.", ph: "khalti sakna fi TanTa.", pl: "Ciotka mieszka w Tancie." },
  "family|zaręczony (m.)|مخطوب": { ar: "أخويا مخطوب.", ph: "akhuuya makhTuub.", pl: "Mój brat jest zaręczony." },
  "family|rozwiedziony (m.)|مطلق": { ar: "هو مطلق من سنة.", ph: "howwa meTalla2 min sana.", pl: "Jest rozwiedziony od roku." },
  "family|sąsiad|جار": { ar: "جاري راجل كويس.", ph: "gaari raagel kwayyes.", pl: "Mój sąsiad to dobry człowiek." },
  // --- zdrowie ---
  "health|lekarz|دكتور": { ar: "لازم أروح للدكتور.", ph: "laazem aruuH lid-doktoor.", pl: "Muszę iść do lekarza." },
  "health|szpital|مستشفى": { ar: "المستشفى قريبة من هنا.", ph: "il-mustashfa 2orayyiba min hena.", pl: "Szpital jest blisko stąd." },
  "health|chory (m.)|عيان": { ar: "أنا عيان النهارده.", ph: "ana 3ayyaan innaharda.", pl: "Jestem dziś chory." },
  "health|chora (ż.)|عيانة": { ar: "هي عيانة وتعبانة.", ph: "heyya 3ayyaana we ta3baana.", pl: "Ona jest chora i zmęczona." },
  "health|boli mnie|بيوجعني": { ar: "ضهري بيوجعني.", ph: "Dahri biyewga3ni.", pl: "Boli mnie plecy." },
  "health|brzuch|بطن": { ar: "بطني بتوجعني.", ph: "baTni betewga3ni.", pl: "Boli mnie brzuch." },
  "health|kaszel|كحة": { ar: "عندي كحة من إمبارح.", ph: "3andi koHHa min embaareH.", pl: "Mam kaszel od wczoraj." },
  // --- pogoda ---
  "weather|słońce|شمس": { ar: "الشمس قوية النهارده.", ph: "ish-shams 2aweyya innaharda.", pl: "Słońce jest dziś mocne." },
  "weather|deszcz|مطر": { ar: "المطر بينزل في الشتا.", ph: "il-maTar biyinzel fish-shita.", pl: "Deszcz pada zimą." },
  "weather|upał|حرارة": { ar: "الحرارة عالية في الصيف.", ph: "il-Haraara 3alya fiS-Seef.", pl: "Temperatura jest wysoka latem." },
  "weather|pada deszcz|بتمطر": { ar: "الدنيا بتمطر بره.", ph: "id-donya betemTar barra.", pl: "Na dworze pada deszcz." },
  "weather|zima|شتا": { ar: "الشتا في مصر مش برد أوي.", ph: "ish-shita fi maSr mish bard awi.", pl: "Zima w Egipcie nie jest bardzo zimna." },
  // --- pozostałe ---
  "life|Polska|بولندا": { ar: "أنا من بولندا.", ph: "ana min bolanda.", pl: "Jestem z Polski." },
  "life|Egipt|مصر": { ar: "مصر بلد جميل.", ph: "maSr balad gamiil.", pl: "Egipt to piękny kraj." },
  "life|za granicą|برة": { ar: "مراتي بتشتغل مع شركة برة.", ph: "meraati betishtaghal ma3 sherka barra.", pl: "Moja żona pracuje z firmą za granicą." },
  "life|kot|قطة": { ar: "عندي قطة في البيت.", ph: "3andi 2oTTa fil-beet.", pl: "Mam kota w domu." },
  "life|rok|سنة": { ar: "بقالي سنة في كراكوف.", ph: "ba2aali sana fi Krakow.", pl: "Jestem rok w Krakowie." },
  "life|hobby|هواية": { ar: "العربي هوايتي.", ph: "il-3arabi hewayti.", pl: "Arabski to moje hobby." },
  // --- pozostałe pojedyncze słowa ---
  "kitchen|surowy|ني": { ar: "الأكل ده لسه ني.", ph: "il-akl da lessa nayy.", pl: "To jedzenie jest jeszcze surowe." },
  "kitchen|gorzki|مر": { ar: "القهوة مرة من غير سكر.", ph: "il-2ahwa morra min 8eer sokkar.", pl: "Kawa jest gorzka bez cukru." },
  "family|syn|ابن": { ar: "ابني في المدرسة.", ph: "ebni fil-madrasa.", pl: "Mój syn jest w szkole." },
  "family|ojciec|أب": { ar: "أبويا راجل طيب.", ph: "abuuya raagel Tayyeb.", pl: "Mój ojciec to dobry człowiek." },
  "family|matka|أم": { ar: "أمي بتحبني أوي.", ph: "ommi betHebbni awi.", pl: "Moja matka bardzo mnie kocha." },
  "family|siostra|أخت": { ar: "أختي أصغر مني.", ph: "okhti aS8ar menni.", pl: "Moja siostra jest młodsza ode mnie." },
  "family|wujek (brat ojca)|عم": { ar: "عمي أخو أبويا.", ph: "3ammi akhu abuuya.", pl: "Mój wujek to brat ojca." },
  "family|wujek (brat matki)|خال": { ar: "خالي ساكن في إسكندرية.", ph: "khaali saaken fi eskendereyya.", pl: "Mój wujek mieszka w Aleksandrii." },
  "family|przyjaciel / kolega|صاحب": { ar: "صاحبي من زمان.", ph: "SaaHbi min zamaan.", pl: "To mój stary przyjaciel." },
  "health|apteka|صيدلية": { ar: "الصيدلية فين؟", ph: "iS-Saydaleyya feen?", pl: "Gdzie jest apteka?" },
  "health|gardło|زور": { ar: "زوري بيوجعني.", ph: "zoori biyewga3ni.", pl: "Boli mnie gardło." },
  "health|ząb|سنة": { ar: "سنتي بتوجعني.", ph: "senneti betewga3ni.", pl: "Boli mnie ząb." },
  "weather|lato|صيف": { ar: "الصيف حر في مصر.", ph: "iS-Seef Harr fi maSr.", pl: "Lato w Egipcie jest upalne." },
  "fillers|naprawdę? (zdziwienie)|بجد؟": { ar: "بجد؟ مش مصدق!", ph: "begad? mish meSadda2!", pl: "Naprawdę? Nie wierzę!" },
  "fillers|rozumiem / jasne (potakiwanie)|فاهم": { ar: "أيوا، أنا فاهم.", ph: "aywa, ana faahem.", pl: "Tak, rozumiem." },
  "fillers|krótko mówiąc|المهم": { ar: "المهم، خلصنا الشغل.", ph: "il-mohemm, khallaSna ish-shughl.", pl: "Krótko mówiąc, skończyliśmy pracę." },
  "slang|wyluzuj / odpuść|فكّك": { ar: "فكّك من الموضوع ده.", ph: "fokkak min il-mawDuu3 da.", pl: "Odpuść sobie ten temat." },
  "slang|genialne / miód (dosł. miód)|عسل": { ar: "الفكرة دي عسل!", ph: "il-fekra di 3asal!", pl: "Ten pomysł jest genialny!" },
  "life|biuro|مكتب": { ar: "مكتبي في وسط البلد.", ph: "maktabi fi wist il-balad.", pl: "Moje biuro jest w centrum." },
  "life|właściciel|صاحب": { ar: "أنا صاحب الشركة.", ph: "ana SaaHeb ish-sherka.", pl: "Jestem właścicielem firmy." },
  "life|klient|عميل": { ar: "العميل مبسوط من الخدمة.", ph: "il-3amiil mabsuuT min il-khedma.", pl: "Klient jest zadowolony z usługi." },
  "life|język|لغة": { ar: "العربي لغة صعبة شوية.", ph: "il-3arabi lo8a Sa3ba shwayya.", pl: "Arabski to trochę trudny język." },
  "life|polski (język)|بولندي": { ar: "أنا بتكلم بولندي.", ph: "ana batkallem bolandi.", pl: "Mówię po polsku." },
  "life|łatwy|سهل": { ar: "الدرس ده سهل.", ph: "id-dars da sahl.", pl: "Ta lekcja jest łatwa." },
  "life|miasto|مدينة": { ar: "كراكوف مدينة جميلة.", ph: "Krakow mediina gamiila.", pl: "Kraków to piękne miasto." },
  "life|kraj|بلد": { ar: "مصر بلد كبير.", ph: "maSr balad kebiir.", pl: "Egipt to duży kraj." },
  "travel|Taksówka|تاكسي": { ar: "هركب تاكسي للمطار.", ph: "harkab taksi lil-maTaar.", pl: "Wezmę taksówkę na lotnisko." },
  "travel|Lotnisko|المطار": { ar: "المطار بعيد عن هنا.", ph: "il-maTaar be3iid 3an hena.", pl: "Lotnisko jest daleko stąd." },
  "travel|W prawo|يمين": { ar: "لف يمين بعد الإشارة.", ph: "leff yemiin ba3d il-eshaara.", pl: "Skręć w prawo za światłami." },
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
  { pl: "chcę", ar: "عايز", ph: "3aayez", note: "3aayez (m.) / 3ayza (f.) — imiesłów, zgadza się rodzajem." },
  { pl: "muszę", ar: "لازم", ph: "laazem", note: "لازم nieodmienne + czasownik w subjunctive." },
  { pl: "mogę", ar: "ممكن", ph: "mumken", note: "ممكن (możliwość/pozwolenie) + subjunctive." },
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
      note: "„3andi” (u-mnie) wyraża posiadanie — egipski nie ma osobnego „mieć”.",
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
      note: "Zaimek pytający „feen” stoi PO rzeczowniku.",
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
    tiles: [
      { ar: "أنا", ph: "ana" },
      { ar: "عايز", ph: "3aayez" },
      { ar: "أشرب", ph: "ashrab" },
      { ar: "قهوة", ph: "ahwa" },
    ],
    note: "Modalny (3aayez) + czasownik w subjunctive (ashrab, bez بـ).",
  },
  {
    pl: "Muszę teraz iść.",
    tiles: [
      { ar: "لازم", ph: "laazem" },
      { ar: "أروح", ph: "aruu7" },
      { ar: "دلوقتي", ph: "dilwa2ti" },
    ],
    note: "لازم jest nieodmienne i stoi przed czasownikiem.",
  },
  {
    pl: "Gdzie jest łazienka, przepraszam?",
    tiles: [
      { ar: "الحمام", ph: "il-Hammaam" },
      { ar: "فين", ph: "feen" },
      { ar: "لو سمحت", ph: "law samaHt" },
    ],
    note: "Zaimek pytający (feen) stoi PO rzeczowniku, nie na początku.",
  },
  {
    pl: "Mam trzy dni wolnego.",
    tiles: [
      { ar: "عندي", ph: "3andi" },
      { ar: "تلات", ph: "talat" },
      { ar: "تيام", ph: "tiyyaam" },
      { ar: "أجازة", ph: "agaaza" },
    ],
    note: "3–10 + liczba mnoga; ayyaam po liczebniku dostaje t- (tiyyaam).",
  },
  {
    pl: "Czyje to jest?",
    tiles: [
      { ar: "ده", ph: "da" },
      { ar: "بتاع", ph: "bitaa3" },
      { ar: "مين", ph: "meen" },
    ],
  },
  {
    pl: "Ta książka jest na stole.",
    tiles: [
      { ar: "الكتاب", ph: "il-ketaab" },
      { ar: "ده", ph: "da" },
      { ar: "على", ph: "3ala" },
      { ar: "الترابيزة", ph: "it-tarabeeza" },
    ],
    note: "Wskazujący (da) stoi PO rzeczowniku z rodzajnikiem.",
  },
  {
    pl: "Czy mogę zobaczyć menu?",
    tiles: [
      { ar: "ممكن", ph: "mumken" },
      { ar: "أشوف", ph: "ashuuf" },
      { ar: "المنيو", ph: "il-menyu" },
    ],
  },
  {
    pl: "Ona chciała iść.",
    tiles: [
      { ar: "هي", ph: "heyya" },
      { ar: "كانت", ph: "kaanet" },
      { ar: "عايزة", ph: "3ayza" },
      { ar: "تروح", ph: "tiruu7" },
    ],
    note: "Przeszłość modalnego: kaanet + 3ayza (zgodność rodzaju) + subjunctive.",
  },
  {
    pl: "Kiedy przyjdziesz? (do mężczyzny)",
    tiles: [
      { ar: "انت", ph: "enta" },
      { ar: "هتيجي", ph: "hatiigi" },
      { ar: "إمتى", ph: "emta" },
    ],
    note: "emta na końcu zdania.",
  },
  {
    pl: "Mój dom jest blisko stąd.",
    tiles: [
      { ar: "بيتي", ph: "beeti" },
      { ar: "قريب", ph: "2urayyib" },
      { ar: "من هنا", ph: "min hena" },
    ],
  },
  {
    pl: "Musimy iść do domu.",
    tiles: [
      { ar: "لازم", ph: "laazem" },
      { ar: "نروح", ph: "niruu7" },
      { ar: "البيت", ph: "il-beet" },
    ],
  },
  {
    pl: "Po ile jest ten kilogram?",
    tiles: [
      { ar: "بكام", ph: "bikaam" },
      { ar: "الكيلو", ph: "il-kiilo" },
      { ar: "ده", ph: "da" },
    ],
  },
  {
    pl: "Mam przy sobie nowy telefon.",
    tiles: [
      { ar: "معايا", ph: "ma3aaya" },
      { ar: "موبايل", ph: "mobaayel" },
      { ar: "جديد", ph: "gediid" },
    ],
    note: "Przymiotnik stoi PO rzeczowniku (mobaayel gediid).",
  },
  {
    pl: "Ten samochód należy do mojego przyjaciela.",
    tiles: [
      { ar: "العربية", ph: "il-3arabeyya" },
      { ar: "دي", ph: "di" },
      { ar: "بتاعة", ph: "bitaa3et" },
      { ar: "صاحبي", ph: "SaHbi" },
    ],
    note: "3arabeyya jest żeńska → di oraz bitaa3et (nie da/bitaa3).",
  },
  {
    pl: "Jestem z Polski.",
    tiles: [
      { ar: "أنا", ph: "ana" },
      { ar: "من", ph: "min" },
      { ar: "بولاندا", ph: "bolanda" },
    ],
    note: "Prosty schemat: ana min + miejsce (z dialogu z obcokrajowcem).",
  },
  {
    pl: "Mieszkam w Maadi.",
    tiles: [
      { ar: "أنا", ph: "ana" },
      { ar: "ساكن", ph: "saaken" },
      { ar: "في", ph: "fi" },
      { ar: "المعادي", ph: "il-ma3aadi" },
    ],
    note: "saaken (mieszkający) to imiesłów; „fi + miejsce” = „w”.",
  },
  {
    pl: "Mówisz po angielsku?",
    tiles: [
      { ar: "إنت", ph: "enta" },
      { ar: "بتتكلم", ph: "betetkallem" },
      { ar: "انجليزي", ph: "engliizi" },
    ],
    note: "Czas teraźniejszy z przedrostkiem بـ (betetkallem = mówisz/mawiasz).",
  },
  {
    pl: "Gdzie jest winda?",
    tiles: [
      { ar: "فين", ph: "feen" },
      { ar: "الأصانصير", ph: "il-2aSanSeer" },
    ],
    note: "Tu „feen” stoi PRZED rzeczownikiem — oba szyki (feen na początku i na końcu) są używane.",
  },
  {
    pl: "Chcę dużą butelkę.",
    tiles: [
      { ar: "عايز", ph: "3aayez" },
      { ar: "القزازة", ph: "il-2ezaaza" },
      { ar: "الكبيرة", ph: "il-kebiira" },
    ],
    note: "Przymiotnik (kebiira) stoi PO rzeczowniku i zgadza się rodzajem (2ezaaza żeńska → kebiira).",
  },
  {
    pl: "Znasz kawiarnię blisko stąd?",
    tiles: [
      { ar: "عارف", ph: "3aaref" },
      { ar: "قهوة", ph: "2ahwa" },
      { ar: "قريبة", ph: "2urayyiba" },
      { ar: "من هنا", ph: "min hena" },
    ],
    note: "3aaref (wiedzący/znający) — imiesłów; przymiotnik 2urayyiba po rzeczowniku.",
  },
  {
    pl: "Wszystko w porządku, dziękuję.",
    tiles: [
      { ar: "مفيش", ph: "mafiish" },
      { ar: "مشكلة", ph: "moshkila" },
      { ar: "شكراً", ph: "shukran" },
    ],
    note: "mafiish (nie ma) → mafiish moshkila = „nie ma problemu”.",
  },
];

// ---------- Egipski a MSA (fuS7a) ----------
// Porównanie dialektu egipskiego z arabskim literackim (Modern Standard Arabic).
// Trzy grupy: identyczne / to samo słowo, inna wymowa / zupełnie inne słowo.
// Reguły wymowy potwierdzone: ج j→g, ق q→hamza(2), ث th→t, ذ dh→d/z.
const MSA_COMPARISON = {
  // 1. IDENTYCZNE — pisownia i wymowa praktycznie takie same w obu.
  same: [
    { pl: "książka", eg: { ar: "كتاب", ph: "ketaab" }, msa: { ar: "كتاب", ph: "kitaab" }, note: "Ten sam rdzeń, tylko krótka samogłoska brzmi nieco inaczej." },
    { pl: "dom", eg: { ar: "بيت", ph: "beet" }, msa: { ar: "بيت", ph: "bayt" }, note: "MSA „ay” → egipskie długie „ee”. Pisownia identyczna." },
    { pl: "szkoła", eg: { ar: "مدرسة", ph: "madrasa" }, msa: { ar: "مدرسة", ph: "madrasa" }, note: "Praktycznie identyczne." },
    { pl: "woda", eg: { ar: "ماء / مية", ph: "mayya" }, msa: { ar: "ماء", ph: "maa2" }, note: "MSA „maa2” pisane ماء; egipski upraszcza do مية „mayya”." },
    { pl: "słońce", eg: { ar: "شمس", ph: "shams" }, msa: { ar: "شمس", ph: "shams" }, note: "Identyczne." },
    { pl: "ręka", eg: { ar: "يد / إيد", ph: "iid" }, msa: { ar: "يد", ph: "yad" }, note: "Ten sam rdzeń; egipski dodaje na początku „i”." },
    { pl: "nowy", eg: { ar: "جديد", ph: "gediid" }, msa: { ar: "جديد", ph: "jadiid" }, note: "Pisownia ta sama, ale ج: MSA „j” → egipskie „g” (patrz grupa „inna wymowa”)." },
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
    { pl: "jak? / w jaki sposób", eg: { ar: "إزاي", ph: "ezzaay" }, msa: { ar: "كيف", ph: "kayfa" } },
    { pl: "dlaczego?", eg: { ar: "ليه", ph: "leeh" }, msa: { ar: "لماذا", ph: "limaadha" } },
    { pl: "co?", eg: { ar: "إيه", ph: "eeh" }, msa: { ar: "ماذا", ph: "maadha" } },
    { pl: "gdzie?", eg: { ar: "فين", ph: "feen" }, msa: { ar: "أين", ph: "ayna" } },
    { pl: "teraz", eg: { ar: "دلوقتي", ph: "delwa2ti" }, msa: { ar: "الآن", ph: "al-2aan" } },
    { pl: "chcę", eg: { ar: "عايز", ph: "3aayez" }, msa: { ar: "أريد", ph: "uriid" } },
    { pl: "poszedł", eg: { ar: "راح", ph: "raaH" }, msa: { ar: "ذهب", ph: "dhahaba" } },
    { pl: "zobaczył / patrzył", eg: { ar: "بص / شاف", ph: "baSS / shaaf" }, msa: { ar: "نظر", ph: "naZara" } },
    { pl: "dobry / ładny", eg: { ar: "كويس", ph: "kwayyes" }, msa: { ar: "جيد", ph: "jayyid" } },
    { pl: "bardzo", eg: { ar: "أوي / خالص", ph: "awi / khaaliS" }, msa: { ar: "جداً", ph: "jiddan" } },
    { pl: "tylko", eg: { ar: "بس", ph: "bass" }, msa: { ar: "فقط", ph: "faqaT" } },
    { pl: "trochę", eg: { ar: "شوية", ph: "shwayya" }, msa: { ar: "قليلاً", ph: "qaliilan" } },
    { pl: "jak (podobny)", eg: { ar: "زي", ph: "zayy" }, msa: { ar: "مثل", ph: "mithl" } },
    { pl: "znowu / jeszcze", eg: { ar: "كمان", ph: "kamaan" }, msa: { ar: "أيضاً", ph: "ayDan" } },
  ],
};

// ---------- Czytanki ----------
// Dłuższe teksty narracyjne (nie dialogi) z użyciem różnych czasów.
// Każde zdanie: ar/ph/pl. tenseNote wyjaśnia użyte czasy. questions = pytania
// na rozumienie (typu prawda/fałsz lub wybór), oparte wyłącznie na treści tekstu.
const READINGS = [
  {
    title: "Mój dzień",
    emoji: "📅",
    level: "łatwy",
    context: "Opis zwykłego dnia — czas teraźniejszy.",
    tenseNote: "Tekst w czasie teraźniejszym (biyi-/ba-). Opisuje rutynę, która powtarza się codziennie.",
    sentences: [
      { ar: "أنا بصحى الساعة سبعة الصبح.", ph: "ana baSHa is-saa3a sab3a iS-SobH.", pl: "Wstaję o siódmej rano." },
      { ar: "بفطر عيش وجبنة وبشرب شاي.", ph: "bafTar 3eesh we gebna we bashrab shaay.", pl: "Jem na śniadanie chleb z serem i piję herbatę." },
      { ar: "بروح الشغل الساعة تسعة.", ph: "baruuH ish-shughl is-saa3a tes3a.", pl: "Idę do pracy o dziewiątej." },
      { ar: "بشتغل لحد الساعة خمسة.", ph: "bashtaghal leHadd is-saa3a khamsa.", pl: "Pracuję do piątej." },
      { ar: "بالليل بتفرج على التليفزيون وبنام بدري.", ph: "bil-leel batfarrag 3ala it-televizyon we banaam badri.", pl: "Wieczorem oglądam telewizję i kładę się wcześnie spać." },
    ],
    questions: [
      { q: "O której wstaje autor?", options: ["O szóstej", "O siódmej", "O dziewiątej"], correct: 1 },
      { q: "Co je na śniadanie?", options: ["Chleb z serem", "Koszari", "Tylko herbatę"], correct: 0 },
      { q: "Do której pracuje?", options: ["Do trzeciej", "Do piątej", "Do dziewiątej"], correct: 1 },
    ],
  },
  {
    title: "Wycieczka do Aleksandrii",
    emoji: "🏖️",
    level: "średni",
    context: "Opowieść o wczorajszym wyjeździe — czas przeszły.",
    tenseNote: "Tekst w czasie przeszłym (formy typu ruHt, akalt, kaan). Opowiada o zdarzeniu, które już się wydarzyło.",
    sentences: [
      { ar: "إمبارح رحت إسكندرية مع العيلة.", ph: "embaareH ruHt eskendereyya ma3 il-3eela.", pl: "Wczoraj pojechałem do Aleksandrii z rodziną." },
      { ar: "ركبنا العربية الساعة ستة الصبح.", ph: "rekebna il-3arabeyya is-saa3a setta iS-SobH.", pl: "Wsiedliśmy do samochodu o szóstej rano." },
      { ar: "الجو كان حلو والبحر كان جميل.", ph: "il-gaww kaan Helw wil-baHr kaan gamiil.", pl: "Pogoda była ładna, a morze było piękne." },
      { ar: "أكلنا سمك في مطعم على البحر.", ph: "akalna samak fi maT3am 3ala il-baHr.", pl: "Jedliśmy rybę w restauracji nad morzem." },
      { ar: "رجعنا القاهرة بالليل تعبانين بس مبسوطين.", ph: "rege3na il-2aahira bil-leel ta3baniin bass mabsuTiin.", pl: "Wróciliśmy do Kairu wieczorem, zmęczeni, ale zadowoleni." },
    ],
    questions: [
      { q: "Dokąd pojechał autor?", options: ["Do Kairu", "Do Aleksandrii", "Do Gizy"], correct: 1 },
      { q: "Jaka była pogoda?", options: ["Ładna", "Deszczowa", "Zimna"], correct: 0 },
      { q: "Co jedli?", options: ["Koszari", "Rybę", "Mięso"], correct: 1 },
      { q: "Jak się czuli po powrocie?", options: ["Głodni", "Zmęczeni ale zadowoleni", "Smutni"], correct: 1 },
    ],
  },
  {
    title: "Plany na weekend",
    emoji: "🗓️",
    level: "średni",
    context: "Zamiary na najbliższe dni — czas przyszły.",
    tenseNote: "Tekst w czasie przyszłym (ha- + czasownik, np. haruuH, hazuur). Mówi o tym, co dopiero się wydarzy.",
    sentences: [
      { ar: "الأسبوع الجاي هزور خالتي في طنطا.", ph: "il-osbuu3 ig-gaay hazuur khalti fi TanTa.", pl: "W przyszłym tygodniu odwiedzę ciocię w Tancie." },
      { ar: "هركب القطر الساعة تمنية.", ph: "harkab il-2aTr is-saa3a tamanya.", pl: "Wsiądę do pociągu o ósmej." },
      { ar: "هقعد معاها يومين.", ph: "haq3od ma3aaha yomeen.", pl: "Zostanę u niej dwa dni." },
      { ar: "هنطبخ ملوخية ونتفرج على أفلام.", ph: "hanTbokh molokheyya we netfarrag 3ala aflaam.", pl: "Ugotujemy molochiję i pooglądamy filmy." },
      { ar: "هرجع القاهرة يوم الأحد.", ph: "harga3 il-2aahira yoom il-Hadd.", pl: "Wrócę do Kairu w niedzielę." },
    ],
    questions: [
      { q: "Kogo odwiedzi autor?", options: ["Brata", "Ciocię", "Kolegę"], correct: 1 },
      { q: "Ile dni zostanie?", options: ["Jeden", "Dwa", "Trzy"], correct: 1 },
      { q: "Kiedy wróci do Kairu?", options: ["W sobotę", "W niedzielę", "W piątek"], correct: 1 },
    ],
  },
  {
    title: "Historia Ahmeda",
    emoji: "📖",
    level: "trudny",
    context: "Dłuższa opowieść mieszająca czasy — przeszły, teraźniejszy, przyszły.",
    tenseNote: "Tekst miesza czasy: przeszły (opis kim był), teraźniejszy (co robi teraz) i przyszły (plany). Zwróć uwagę, jak zmienia się forma czasownika.",
    sentences: [
      { ar: "أحمد كان طالب في الجامعة.", ph: "aHmad kaan Taalib fil-gam3a.", pl: "Ahmed był studentem na uniwersytecie." },
      { ar: "درس هندسة أربع سنين.", ph: "daras handasa arba3 siniin.", pl: "Studiował inżynierię przez cztery lata." },
      { ar: "دلوقتي هو بيشتغل في شركة كبيرة.", ph: "delwa2ti howwa biyishtaghal fi sherka kebiira.", pl: "Teraz pracuje w dużej firmie." },
      { ar: "بيحب شغله بس بيتعب كتير.", ph: "biyHebb shughlo bass biyit3ab ketiir.", pl: "Lubi swoją pracę, ale bardzo się męczy." },
      { ar: "السنة الجاية هيتجوز ويسافر برة مصر.", ph: "is-sana ig-gaaya hayitgawwez we yesaafer barra maSr.", pl: "W przyszłym roku ożeni się i wyjedzie za granicę." },
      { ar: "بيقول إن المستقبل هيبقى أحسن.", ph: "biy2uul enn il-musta2bal haybqa aHsan.", pl: "Mówi, że przyszłość będzie lepsza." },
    ],
    questions: [
      { q: "Co studiował Ahmed?", options: ["Medycynę", "Inżynierię", "Prawo"], correct: 1 },
      { q: "Gdzie teraz pracuje?", options: ["Na uniwersytecie", "W dużej firmie", "W szpitalu"], correct: 1 },
      { q: "Co planuje w przyszłym roku?", options: ["Zmienić pracę", "Ożenić się i wyjechać", "Wrócić na studia"], correct: 1 },
      { q: "Jak myśli o przyszłości?", options: ["Że będzie lepsza", "Że będzie trudna", "Nie wie"], correct: 0 },
    ],
  },
  {
    title: "Kim jestem",
    emoji: "🙋",
    level: "łatwy",
    context: "Grzegorz przedstawia siebie — czas teraźniejszy.",
    tenseNote: "Prosty tekst w czasie teraźniejszym — podstawa przedstawiania się. Zauważ „ana” (ja) + zawód bez czasownika „być”, typowe dla arabskiego.",
    sentences: [
      { ar: "أنا اسمي جيجورج، أنا من بولندا.", ph: "ana esmi Grzegorz, ana min bolanda.", pl: "Nazywam się Grzegorz, jestem z Polski." },
      { ar: "أنا ساكن في كراكوف.", ph: "ana saaken fi Krakow.", pl: "Mieszkam w Krakowie." },
      { ar: "أنا محامي وعندي شركة.", ph: "ana moHaami we 3andi sherka.", pl: "Jestem prawnikiem i mam firmę." },
      { ar: "الشركة بتقدم خدمات محاسبة.", ph: "ish-sherka bet2addem khadamaat moHasba.", pl: "Firma świadczy usługi księgowe." },
      { ar: "أنا متجوز ومراتي مهندسة معمارية.", ph: "ana metgawwez we meraati mohandesa me3maareyya.", pl: "Jestem żonaty, a moja żona jest architektką." },
    ],
    questions: [
      { q: "Skąd jest Grzegorz?", options: ["Z Egiptu", "Z Polski", "Z Austrii"], correct: 1 },
      { q: "Jaki ma zawód?", options: ["Architekt", "Prawnik", "Nauczyciel"], correct: 1 },
      { q: "Co robi jego firma?", options: ["Usługi księgowe", "Buduje domy", "Uczy języków"], correct: 0 },
    ],
  },
  {
    title: "Moja firma",
    emoji: "💼",
    level: "średni",
    context: "Grzegorz opowiada o swojej pracy — teraźniejszy z liczbami.",
    tenseNote: "Czas teraźniejszy do opisu stałej sytuacji. Zwróć uwagę na liczby (arba3iin = 40) i „3andi” (mam).",
    sentences: [
      { ar: "عندي شركة في كراكوف.", ph: "3andi sherka fi Krakow.", pl: "Mam firmę w Krakowie." },
      { ar: "بشتغل محامي ومستشار ضرايب.", ph: "bashtaghal moHaami we mostashaar Daraayeb.", pl: "Pracuję jako prawnik i doradca podatkowy." },
      { ar: "عندي أربعين موظف بيشتغلوا معايا.", ph: "3andi arba3iin mowaZZaf biyishtaghalu ma3aaya.", pl: "Mam czterdziestu pracowników, którzy pracują ze mną." },
      { ar: "بنقدم خدمات محاسبة للعملاء.", ph: "beni2addem khadamaat moHasba lil-3omalaa2.", pl: "Świadczymy usługi księgowe dla klientów." },
      { ar: "الشغل صعب شوية بس بحبه.", ph: "ish-shughl Sa3b shwayya bass baHebbo.", pl: "Praca jest trochę trudna, ale ją lubię." },
    ],
    questions: [
      { q: "Ilu pracowników ma Grzegorz?", options: ["Czternastu", "Czterdziestu", "Czterech"], correct: 1 },
      { q: "Czym się zajmuje oprócz prawa?", options: ["Doradztwem podatkowym", "Architekturą", "Nauczaniem"], correct: 0 },
      { q: "Jak ocenia swoją pracę?", options: ["Łatwa i nudna", "Trudna, ale ją lubi", "Nie lubi jej"], correct: 1 },
    ],
  },
  {
    title: "Moja żona",
    emoji: "👩‍💼",
    level: "średni",
    context: "Grzegorz opowiada o żonie i ich planach — teraźniejszy i przyszły.",
    tenseNote: "Tekst miesza teraźniejszy (co żona robi) z przyszłym (ha- + czasownik, plany o psie). Dobre ćwiczenie przechodzenia między czasami.",
    sentences: [
      { ar: "مراتي مهندسة معمارية.", ph: "meraati mohandesa me3maareyya.", pl: "Moja żona jest architektką." },
      { ar: "بتشتغل في شركة بتشتغل في النمسا.", ph: "betishtaghal fi sherka betishtaghal fin-nemsa.", pl: "Pracuje w firmie, która działa w Austrii." },
      { ar: "إحنا عندنا شقة في كراكوف.", ph: "eHna 3andena sha22a fi Krakow.", pl: "Mamy mieszkanie w Krakowie." },
      { ar: "قريب هنجيب كلب.", ph: "2orayyeb hangiib kalb.", pl: "Wkrótce sprowadzimy psa." },
      { ar: "إحنا مبسوطين بحياتنا مع بعض.", ph: "eHna mabsuTiin be-Hayaatna ma3 ba3D.", pl: "Jesteśmy szczęśliwi z naszego wspólnego życia." },
    ],
    questions: [
      { q: "Jaki zawód ma żona Grzegorza?", options: ["Prawniczka", "Architektka", "Księgowa"], correct: 1 },
      { q: "Na jakim rynku działa jej firma?", options: ["Austriackim", "Polskim", "Egipskim"], correct: 0 },
      { q: "Co planują wkrótce?", options: ["Kupić mieszkanie", "Sprowadzić psa", "Wyjechać za granicę"], correct: 1 },
    ],
  },
  {
    title: "Jak uczę się arabskiego",
    emoji: "📚",
    level: "trudny",
    context: "Grzegorz o swojej nauce arabskiego — przeszły, teraźniejszy, przyszły.",
    tenseNote: "Pełny miks czasów: zaczął uczyć się (przeszły), uczy się teraz (teraźniejszy), chce mówić lepiej (przyszły/pragnienie). To Twoja własna historia po egipsku.",
    sentences: [
      { ar: "بقالي سنتين بتعلم عربي.", ph: "ba2aali santeen bat3allem 3arabi.", pl: "Od dwóch lat uczę się arabskiego." },
      { ar: "بتعلمه كهواية، مش للشغل.", ph: "bat3allemo ke-hewaaya, mish lish-shughl.", pl: "Uczę się go jako hobby, nie do pracy." },
      { ar: "بآخد دروس أونلاين.", ph: "baakhod duruus onlaayn.", pl: "Biorę lekcje online." },
      { ar: "مدرستي سورية بس ساكنة في القاهرة.", ph: "modarrasti soreyya bass sakna fil-2aahira.", pl: "Moja nauczycielka jest Syryjką, ale mieszka w Kairze." },
      { ar: "رحت مصر كذا مرة وحبيت البلد.", ph: "roHt maSr kaza marra we Habbeet il-balad.", pl: "Byłem w Egipcie kilka razy i pokochałem ten kraj." },
      { ar: "نفسي أتكلم عربي كويس أكتر.", ph: "nefsi atkallem 3arabi kwayyes aktar.", pl: "Chciałbym mówić po arabsku jeszcze lepiej." },
    ],
    questions: [
      { q: "Jak długo Grzegorz uczy się arabskiego?", options: ["Rok", "Dwa lata", "Pięć lat"], correct: 1 },
      { q: "Po co się uczy?", options: ["Do pracy", "Jako hobby", "Bo ma rodzinę w Egipcie"], correct: 1 },
      { q: "Skąd jest jego nauczycielka?", options: ["Z Egiptu", "Z Syrii", "Z Polski"], correct: 1 },
      { q: "Gdzie ona mieszka?", options: ["W Damaszku", "W Kairze", "W Krakowie"], correct: 1 },
      { q: "Czego chce Grzegorz?", options: ["Mówić lepiej po arabsku", "Przestać się uczyć", "Zamieszkać w Egipcie"], correct: 0 },
    ],
  },
];

// ---------- Mini-dialogi ----------
// Scenki osadzone w słownictwie aplikacji. speaker: "a"/"b" (dwie strony rozmowy).
const DIALOGUES = [
  {
    title: "Na targu",
    emoji: "🛒",
    context: "Kupujesz owoce i się targujesz.",
    lines: [
      { s: "a", ar: "الكيلو بكام؟", ph: "il-kiilo bikaam?", pl: "Ile za kilogram?" },
      { s: "b", ar: "بعشرين جنيه.", ph: "bi3eshriin gineeh.", pl: "Dwadzieścia funtów." },
      { s: "a", ar: "غالي شوية. خمستاشر؟", ph: "8aali shwayya. khamastaashar?", pl: "Trochę drogo. Piętnaście?" },
      { s: "b", ar: "ماشي، عشانك.", ph: "maashi, 3ashaanak.", pl: "Dobra, dla ciebie." },
      { s: "a", ar: "تسلم، إديني اتنين كيلو.", ph: "tislam, eddiini etneen kiilo.", pl: "Dzięki, daj mi dwa kilo." },
    ],
  },
  {
    title: "W taksówce",
    emoji: "🚕",
    context: "Wsiadasz i podajesz cel.",
    lines: [
      { s: "a", ar: "على وسط البلد لو سمحت.", ph: "3ala wist il-balad law samaHt.", pl: "Do centrum, proszę." },
      { s: "b", ar: "اتفضل. الطريق زحمة دلوقتي.", ph: "etfaDDal. iT-Tarii2 zaHma dilwa2ti.", pl: "Proszę. Na drodze są teraz korki." },
      { s: "a", ar: "مفيش مشكلة، مش مستعجل.", ph: "mafiish moshkila, mish mesta3gel.", pl: "Nie ma problemu, nie spieszę się." },
      { s: "b", ar: "وصلنا. بعشرة جنيه.", ph: "wesilna. bi3ashara gineeh.", pl: "Dojechaliśmy. Dziesięć funtów." },
      { s: "a", ar: "اتفضل، تسلم.", ph: "etfaDDal, tislam.", pl: "Proszę, dziękuję." },
    ],
  },
  {
    title: "W kawiarni",
    emoji: "☕",
    context: "Zamawiasz coś do picia.",
    lines: [
      { s: "a", ar: "عايز أشرب إيه؟", ph: "3aayez ashrab eeh?", pl: "Na co masz ochotę? (dosł. co chcesz pić)" },
      { s: "b", ar: "قهوة من غير سكر، لو سمحت.", ph: "ahwa min 8eer sokkar, law samaHt.", pl: "Kawę bez cukru, proszę." },
      { s: "a", ar: "حاضر. حاجة تانية؟", ph: "HaaDer. Haaga tanya?", pl: "Już się robi. Coś jeszcze?" },
      { s: "b", ar: "لأ، كده تمام. شكراً.", ph: "la2, keda tamaam. shukran.", pl: "Nie, to wszystko. Dziękuję." },
    ],
  },
  {
    title: "Spotkanie znajomego",
    emoji: "👋",
    context: "Wpadasz na przyjaciela na ulicy.",
    lines: [
      { s: "a", ar: "إزيك يا صاحبي! عامل إيه؟", ph: "ezzayyak ya SaHbi! 3aamel eeh?", pl: "Cześć, przyjacielu! Jak się masz?" },
      { s: "b", ar: "الحمد لله، كله تمام. وانت؟", ph: "il-Hamdu lillah, kollo tamaam. wenta?", pl: "Dzięki Bogu, wszystko dobrze. A ty?" },
      { s: "a", ar: "الحمد لله. وحشتني!", ph: "il-Hamdu lillah. waHashtini!", pl: "Dzięki Bogu. Tęskniłem za tobą!" },
      { s: "b", ar: "وانت كمان. نشرب قهوة؟", ph: "wenta kamaan. neshrab ahwa?", pl: "Ja też. Napijemy się kawy?" },
      { s: "a", ar: "يلا بينا!", ph: "yalla biina!", pl: "Chodźmy!" },
    ],
  },
  {
    title: "W hotelu",
    emoji: "🏨",
    context: "Meldujesz się w recepcji.",
    lines: [
      { s: "a", ar: "عندكو أوضة فاضية؟", ph: "3andoku 2uDa faDya?", pl: "Macie wolny pokój?" },
      { s: "b", ar: "أيوه. لكام ليلة؟", ph: "aywa. li-kaam leela?", pl: "Tak. Na ile nocy?" },
      { s: "a", ar: "تلات ليالي.", ph: "talat layaali.", pl: "Trzy noce." },
      { s: "b", ar: "تمام. الأوضة في الدور التاني.", ph: "tamaam. il-2uDa fid-door it-taani.", pl: "W porządku. Pokój jest na drugim piętrze." },
      { s: "a", ar: "شكراً، ربنا يخليك.", ph: "shukran, rabbena yekhalliik.", pl: "Dziękuję, niech ci Bóg wynagrodzi." },
    ],
  },
  {
    title: "Pytanie o drogę",
    emoji: "🧭",
    context: "Zgubiłeś się i pytasz przechodnia.",
    lines: [
      { s: "a", ar: "لو سمحت، المحطة فين؟", ph: "law samaHt, il-maHaTTa feen?", pl: "Przepraszam, gdzie jest stacja?" },
      { s: "b", ar: "امشي على طول، وبعدين شمال.", ph: "emshi 3ala Tuul, wi ba3deen shemaal.", pl: "Idź prosto, a potem w lewo." },
      { s: "a", ar: "بعيدة من هنا؟", ph: "be3iida min hena?", pl: "Daleko stąd?" },
      { s: "b", ar: "لأ، قريبة. خمس دقايق.", ph: "la2, 2urayyiba. khamas da2aaye2.", pl: "Nie, blisko. Pięć minut." },
      { s: "a", ar: "متشكر جداً.", ph: "moteshakker gedan.", pl: "Bardzo dziękuję." },
    ],
  },
  {
    title: "Spotkanie i winda",
    emoji: "🛗",
    context: "Krótkie powitanie, pytanie o godzinę, potem o windę w budynku. (z Twoich notatek)",
    lines: [
      { s: "a", ar: "أهلاً", ph: "ahlan", pl: "Cześć." },
      { s: "b", ar: "أهلاً", ph: "ahlan", pl: "Cześć." },
      { s: "a", ar: "إزيّك؟", ph: "ezzayyek?", pl: "Jak się masz? (do kobiety)" },
      { s: "b", ar: "أنا كويسة، شكراً، وإنت؟", ph: "ana kwayyesa, shukran, wenta?", pl: "Dobrze, dziękuję, a ty?" },
      { s: "a", ar: "مفيش مشكلة، شكراً", ph: "mafiish moshkila, shukran.", pl: "Wszystko w porządku, dziękuję." },
      { s: "b", ar: "الساعة كام؟", ph: "is-saa3a kaam?", pl: "Która godzina?" },
      { s: "a", ar: "واحدة ونص", ph: "waHda wi noSS.", pl: "Wpół do drugiej." },
      { s: "b", ar: "فين الأصانصير؟", ph: "feen il-2aSanSeer?", pl: "Gdzie jest winda?" },
      { s: "a", ar: "قريّب من الحمّام، هناك عند المدخل", ph: "2urayyib min il-Hammaam, henaak 3and il-madkhal.", pl: "Blisko łazienki, tam przy wejściu." },
      { s: "b", ar: "أوه، فهمت… متشكّرة جداً", ph: "oh, fehemt… motshakkera gedan.", pl: "Aha, rozumiem… bardzo dziękuję." },
      { s: "a", ar: "العفو، مع السلامة", ph: "il-3afw, ma3 is-salaama.", pl: "Nie ma za co, do widzenia." },
    ],
  },
  {
    title: "Rozmowa z obcokrajowcem",
    emoji: "🌍",
    context: "Small talk: skąd jesteś, gdzie mieszkasz, potem kupno wody i pytanie o kawiarnię. (z Twoich notatek)",
    lines: [
      { s: "a", ar: "مساء الخير", ph: "misaa2 il-kheer.", pl: "Dobry wieczór." },
      { s: "b", ar: "مساء النّور", ph: "misaa2 in-nuur.", pl: "Dobry wieczór (odpowiedź)." },
      { s: "a", ar: "إنت بتتكلّم انجليزي؟", ph: "enta betetkallem engliizi?", pl: "Mówisz po angielsku?" },
      { s: "b", ar: "أيوا، بتكلّم انجليزي كويّس ومصري شويّة", ph: "aywa, batkallem engliizi kwayyes wi maSri shwayya.", pl: "Tak, mówię dobrze po angielsku i trochę po egipsku." },
      { s: "a", ar: "إنت منين؟", ph: "enta mneen?", pl: "Skąd jesteś?" },
      { s: "b", ar: "أنا من بولاندا", ph: "ana min bolanda.", pl: "Jestem z Polski." },
      { s: "a", ar: "أحسن ناس! إنت ساكن فين؟", ph: "aHsan naas! enta saaken feen?", pl: "Najlepsi ludzie! Gdzie mieszkasz?" },
      { s: "b", ar: "أنا ساكن في المعادي", ph: "ana saaken fil-ma3aadi.", pl: "Mieszkam w Maadi." },
      { s: "a", ar: "عايز حاجة؟", ph: "3aayez Haaga?", pl: "Chcesz coś?" },
      { s: "b", ar: "عايز ميّة. بكام القزازة؟", ph: "3aayez mayya. bikaam il-2ezaaza?", pl: "Chcę wodę. Ile za butelkę?" },
      { s: "a", ar: "الصغيّرة بخمسة جنيه والكبيرة بتمنية", ph: "iS-So8ayyara bi-khamsa gineeh wil-kebiira bi-tamanya.", pl: "Mała za 5 funtów, duża za 8." },
      { s: "b", ar: "إدّيني الكبيرة. عارف قهوة قريّبة من هنا؟", ph: "eddiini il-kebiira. 3aaref 2ahwa 2urayyiba min hena?", pl: "Daj mi dużą. Znasz kawiarnię blisko stąd?" },
      { s: "a", ar: "أيوا، في قهوة في آخر الشارع ده", ph: "aywa, fi 2ahwa fi aakher ish-shaare3 da.", pl: "Tak, jest kawiarnia na końcu tej ulicy." },
      { s: "b", ar: "شكراً ليك، مع السلامة", ph: "shukran liik, ma3 is-salaama.", pl: "Dziękuję ci, do widzenia." },
    ],
  },
  {
    title: "Rozmowa o rodzinie",
    emoji: "👨‍👩‍👧",
    context: "Pytacie się nawzajem o rodzinę.",
    lines: [
      { s: "a", ar: "إنت متجوز؟", ph: "enta metgawwez?", pl: "Jesteś żonaty?" },
      { s: "b", ar: "أيوا، أنا متجوز. عندي بنت وابن", ph: "aywa, ana metgawwez. 3andi bint we ebn.", pl: "Tak, jestem żonaty. Mam córkę i syna." },
      { s: "a", ar: "حلو! ومراتك بتشتغل؟", ph: "Helw! we meraatak betishtaghal?", pl: "Miło! A twoja żona pracuje?" },
      { s: "b", ar: "أيوا. وإنت، عندك عيلة كبيرة؟", ph: "aywa. wenta, 3andak 3eela kebiira?", pl: "Tak. A ty, masz dużą rodzinę?" },
      { s: "a", ar: "عندي أخ وأخت. أبويا وأمي في المعادي", ph: "3andi akh we okht. abuuya we ommi fil-ma3aadi.", pl: "Mam brata i siostrę. Rodzice są w Maadi." },
      { s: "b", ar: "ربنا يخليهم لك", ph: "rabbena yekhalliihom lak.", pl: "Niech Bóg ich zachowa dla ciebie." },
    ],
  },
  {
    title: "Umawianie się",
    emoji: "📅",
    context: "Ustalacie, kiedy się spotkać.",
    lines: [
      { s: "a", ar: "عايز تشرب قهوة بكرة؟", ph: "3aayez teshrab 2ahwa bukra?", pl: "Chcesz iść jutro na kawę?" },
      { s: "b", ar: "أيوا، طبعاً. الساعة كام؟", ph: "aywa, Tab3an. is-saa3a kaam?", pl: "Tak, jasne. O której godzinie?" },
      { s: "a", ar: "الساعة خمسة، كويس؟", ph: "is-saa3a khamsa, kwayyes?", pl: "O piątej, dobrze?" },
      { s: "b", ar: "ماشي. فين؟", ph: "maashi. feen?", pl: "Dobra. Gdzie?" },
      { s: "a", ar: "في القهوة اللي في وسط البلد", ph: "fil-2ahwa illi fi wist il-balad.", pl: "W kawiarni w centrum." },
      { s: "b", ar: "تمام، أشوفك بكرة", ph: "tamaam, ashuufak bukra.", pl: "Świetnie, do zobaczenia jutro." },
    ],
  },
  {
    title: "W restauracji",
    emoji: "🍽️",
    context: "Zamawiasz jedzenie i picie.",
    lines: [
      { s: "a", ar: "المنيو من فضلك", ph: "il-menyu min faDlak.", pl: "Poproszę menu." },
      { s: "b", ar: "اتفضل. عايز تاكل إيه؟", ph: "etfaDDal. 3aayez taakol eeh?", pl: "Proszę. Co chcesz zjeść?" },
      { s: "a", ar: "عايز كشري ومية", ph: "3aayez koshari we mayya.", pl: "Chcę koszari i wodę." },
      { s: "b", ar: "تحب تشرب حاجة تانية؟", ph: "teHebb teshrab Haaga tanya?", pl: "Chcesz się jeszcze czegoś napić?" },
      { s: "a", ar: "أيوا، قهوة بعد الأكل", ph: "aywa, 2ahwa ba3d il-akl.", pl: "Tak, kawę po jedzeniu." },
      { s: "b", ar: "حاضر، دقيقة", ph: "HaaDer, di2ii2a.", pl: "Już się robi, chwileczkę." },
      { s: "a", ar: "الحساب لو سمحت", ph: "il-Hisaab law samaHt.", pl: "Poproszę rachunek." },
    ],
  },
  {
    title: "U lekarza",
    emoji: "🩺",
    context: "Nie czujesz się dobrze i idziesz do lekarza.",
    lines: [
      { s: "a", ar: "أنا تعبان، راسي بتوجعني", ph: "ana ta3baan, raasi betewga3ni.", pl: "Źle się czuję, boli mnie głowa." },
      { s: "b", ar: "من إمتى؟", ph: "min emta?", pl: "Od kiedy?" },
      { s: "a", ar: "من الصبح. وعندي سخونية", ph: "min iS-SobH. we 3andi sokhoneyya.", pl: "Od rana. I mam gorączkę." },
      { s: "b", ar: "معلش، عندك برد بسيط", ph: "ma3lesh, 3andak bard basiiT.", pl: "Nic groźnego, masz lekkie przeziębienie." },
      { s: "a", ar: "محتاج دوا؟", ph: "meHtaag dawa?", pl: "Potrzebuję lekarstwa?" },
      { s: "b", ar: "أيوا، من الصيدلية. سلامتك", ph: "aywa, min iS-Saydaleyya. salamtak.", pl: "Tak, z apteki. Zdrowia!" },
    ],
  },
  {
    title: "Rozmowa o pogodzie",
    emoji: "🌤️",
    context: "Komentujecie pogodę.",
    lines: [
      { s: "a", ar: "الجو حر أوي النهارده", ph: "il-gaww Harr awi innaharda.", pl: "Dziś jest bardzo gorąco." },
      { s: "b", ar: "أيوا، الصيف في مصر حر", ph: "aywa, iS-Seef fi maSr Harr.", pl: "Tak, lato w Egipcie jest upalne." },
      { s: "a", ar: "بكرة هيبقى إيه؟", ph: "bukra haybqa eeh?", pl: "Jaka będzie jutro?" },
      { s: "b", ar: "قالوا هيبقى في هوا", ph: "2aalu haybqa fi hawa.", pl: "Mówili, że będzie wietrznie." },
      { s: "a", ar: "الحمد لله، أحسن من الحر", ph: "il-Hamdulillah, aHsan min il-Harr.", pl: "Dzięki Bogu, lepsze niż upał." },
    ],
  },
  {
    title: "Poranek w domu",
    emoji: "☀️",
    context: "Zwykły poranek, pytania o plany.",
    lines: [
      { s: "a", ar: "صباح الخير، نمت كويس؟", ph: "SabaaH il-kheer, nemt kwayyes?", pl: "Dzień dobry, dobrze spałeś?" },
      { s: "b", ar: "صباح النور، أيوا الحمد لله", ph: "SabaaH in-nuur, aywa il-Hamdulillah.", pl: "Dzień dobry, tak, dzięki Bogu." },
      { s: "a", ar: "عايز تفطر إيه؟", ph: "3aayez tefTar eeh?", pl: "Co chcesz na śniadanie?" },
      { s: "b", ar: "عيش وجبنة وشاي", ph: "3eesh we gebna we shaay.", pl: "Chleb, ser i herbatę." },
      { s: "a", ar: "وبعدين هتعمل إيه؟", ph: "we ba3deen hate3mel eeh?", pl: "A potem co robisz?" },
      { s: "b", ar: "هروح الشغل الساعة تسعة", ph: "haruuH ish-shughl is-saa3a tes3a.", pl: "Idę do pracy o dziewiątej." },
    ],
  },
  {
    title: "Poznajmy się",
    emoji: "🙋",
    context: "Ktoś pyta Grzegorza, skąd jest i czym się zajmuje.",
    lines: [
      { s: "a", ar: "إنت منين؟", ph: "enta mneen?", pl: "Skąd jesteś?" },
      { s: "b", ar: "أنا من بولندا، ساكن في كراكوف.", ph: "ana min bolanda, saaken fi Krakow.", pl: "Jestem z Polski, mieszkam w Krakowie." },
      { s: "a", ar: "بتشتغل إيه؟", ph: "betishtaghal eeh?", pl: "Czym się zajmujesz?" },
      { s: "b", ar: "أنا محامي وعندي شركة.", ph: "ana moHaami we 3andi sherka.", pl: "Jestem prawnikiem i mam firmę." },
      { s: "a", ar: "جميل! والشركة بتعمل إيه؟", ph: "gamiil! wish-sherka bte3mel eeh?", pl: "Świetnie! A czym zajmuje się firma?" },
      { s: "b", ar: "بنقدم خدمات محاسبة.", ph: "beni2addem khadamaat moHasba.", pl: "Świadczymy usługi księgowe." },
    ],
  },
  {
    title: "Pytania o pracę",
    emoji: "💼",
    context: "Rozmowa o firmie Grzegorza i pracownikach.",
    lines: [
      { s: "a", ar: "عندك موظفين كتير؟", ph: "3andak mowaZZafiin ketiir?", pl: "Masz dużo pracowników?" },
      { s: "b", ar: "أيوا، عندي أربعين موظف.", ph: "aywa, 3andi arba3iin mowaZZaf.", pl: "Tak, mam czterdziestu pracowników." },
      { s: "a", ar: "ده شغل كبير! صعب؟", ph: "da shughl kebiir! Sa3b?", pl: "To duża praca! Trudna?" },
      { s: "b", ar: "صعب شوية بس بحبه.", ph: "Sa3b shwayya bass baHebbo.", pl: "Trochę trudna, ale ją lubię." },
      { s: "a", ar: "إنت بتعمل إيه بالظبط؟", ph: "enta bte3mel eeh biZ-ZabT?", pl: "Co dokładnie robisz?" },
      { s: "b", ar: "محامي ومستشار ضرايب.", ph: "moHaami we mostashaar Daraayeb.", pl: "Prawnik i doradca podatkowy." },
    ],
  },
  {
    title: "Rozmowa o żonie",
    emoji: "👩‍💼",
    context: "Ktoś pyta Grzegorza o żonę i plany.",
    lines: [
      { s: "a", ar: "مراتك بتشتغل إيه؟", ph: "meraatak betishtaghal eeh?", pl: "Czym zajmuje się twoja żona?" },
      { s: "b", ar: "هي مهندسة معمارية.", ph: "heyya mohandesa me3maareyya.", pl: "Jest architektką." },
      { s: "a", ar: "بتشتغل فين؟", ph: "betishtaghal feen?", pl: "Gdzie pracuje?" },
      { s: "b", ar: "في شركة بتشتغل في النمسا.", ph: "fi sherka betishtaghal fin-nemsa.", pl: "W firmie, która działa w Austrii." },
      { s: "a", ar: "عندكوا أولاد؟", ph: "3andoku awlaad?", pl: "Macie dzieci?" },
      { s: "b", ar: "لسه، بس قريب هنجيب كلب!", ph: "lessa, bass 2orayyeb hangiib kalb!", pl: "Jeszcze nie, ale wkrótce sprowadzimy psa!" },
    ],
  },
  {
    title: "O nauce arabskiego",
    emoji: "📚",
    context: "Egipcjanin dziwi się, że Grzegorz mówi po arabsku.",
    lines: [
      { s: "a", ar: "إنت بتتكلم عربي كويس! بقالك قد إيه؟", ph: "enta betetkallem 3arabi kwayyes! ba2aalak 2add eeh?", pl: "Dobrze mówisz po arabsku! Od jak dawna?" },
      { s: "b", ar: "بقالي سنتين بتعلم.", ph: "ba2aali santeen bat3allem.", pl: "Uczę się od dwóch lat." },
      { s: "a", ar: "بتتعلم ليه؟ للشغل؟", ph: "betet3allem leeh? lish-shughl?", pl: "Dlaczego się uczysz? Do pracy?" },
      { s: "b", ar: "لأ، كهواية بس. بحب اللغة.", ph: "la2, ke-hewaaya bass. baHebb il-lo8a.", pl: "Nie, tylko jako hobby. Lubię ten język." },
      { s: "a", ar: "وبتتعلم إزاي؟", ph: "we betet3allem ezzaay?", pl: "A jak się uczysz?" },
      { s: "b", ar: "بآخد دروس أونلاين مع مدرسة سورية.", ph: "baakhod duruus onlaayn ma3 modarrsa soreyya.", pl: "Biorę lekcje online z syryjską nauczycielką." },
      { s: "a", ar: "تحفة! نفسك تزور مصر تاني؟", ph: "toHfa! nefsak tezuur maSr taani?", pl: "Świetnie! Chciałbyś znów odwiedzić Egipt?" },
      { s: "b", ar: "أكيد! رحت كذا مرة وحبيت البلد.", ph: "akiid! roHt kaza marra we Habbeet il-balad.", pl: "Jasne! Byłem kilka razy i pokochałem ten kraj." },
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
const PROGRESS_KEY = "ar-eg-progress-v1";

// Pełna, aktualna baza słówek (zawsze najnowsza, z wszystkimi dodatkami).
// ---------- 100 przydatnych zwrotów: brakujące (dodane z listy) ----------
const PHRASE_WORDS = [
  { cat: "basics", pl: "Witaj (serdeczne)", ar: "أهلاً وسهلاً", ph: "ahlan wa sahlan" },
  { cat: "basics", pl: "Dobranoc", ar: "تصبح على خير", ph: "teSbaH 3ala kheer", ex: { ar: "تصبح على خير يا سمير.", ph: "teSbaH 3ala kheer", pl: "Dobranoc, Samir." } },
  { cat: "basics", pl: "Jak się masz? (do kobiety)", ar: "عاملة إيه؟", ph: "3amla eeh?" },
  { cat: "basics", pl: "Bardzo dobrze", ar: "كويس جداً", ph: "kwayyes gedan" },
  { cat: "basics", pl: "Bardzo dziękuję", ar: "شكراً جداً", ph: "shukran gedan" },
  { cat: "basics", pl: "Przepraszam / przykro mi", ar: "آسف", ph: "aasef", ex: { ar: "آسف، مش قصدي.", ph: "aasef", pl: "Przepraszam, nie chciałem." } },
  { cat: "basics", pl: "Do zobaczenia", ar: "أشوفك بعدين", ph: "ashuufak ba3deen" },
  { cat: "basics", pl: "Tak", ar: "أيوة", ph: "aywa" },
  { cat: "basics", pl: "Nie", ar: "لأ", ph: "la2" },
  { cat: "basics", pl: "Oczywiście", ar: "طبعاً", ph: "Tab3an" },
  { cat: "questions", pl: "Powiedz jeszcze raz", ar: "قول تاني", ph: "2uul taani", ex: { ar: "مش فاهم، قول تاني.", ph: "2uul taani", pl: "Nie rozumiem, powtórz." } },
  { cat: "questions", pl: "Wolniej / spokojnie", ar: "بالراحة", ph: "bir-raaHa" },
  { cat: "questions", pl: "Głośniej trochę", ar: "أعلى شوية", ph: "a3la shwayya" },
  { cat: "questions_pron", pl: "Dlaczego?", ar: "ليه؟", ph: "leeh?" },
  { cat: "questions_pron", pl: "Dokąd?", ar: "على فين؟", ph: "3ala feen?" },
  { cat: "questions", pl: "Co się stało?", ar: "حصل إيه؟", ph: "HaSal eeh?" },
  { cat: "work_daily", pl: "Mieszkam w Polsce", ar: "أنا ساكن في بولندا", ph: "ana saaken fi bolanda" },
  { cat: "work_daily", pl: "Jestem Polakiem", ar: "أنا بولندي", ph: "ana bolandi" },
  { cat: "basics", pl: "Miło cię poznać", ar: "تشرفت بيك", ph: "tasharrafna biik" },
  { cat: "basics", pl: "Ja też", ar: "وأنا كمان", ph: "wana kamaan" },
  { cat: "work_daily", pl: "Czym się zajmujesz?", ar: "بتشتغل إيه؟", ph: "beteshta8al eeh?" },
  { cat: "work_daily", pl: "Jestem prawnikiem", ar: "أنا محامي", ph: "ana muHaami" },
  { cat: "work_daily", pl: "Jestem księgowym", ar: "أنا محاسب", ph: "ana muHaaseb" },
  { cat: "food_shopping", pl: "Poproszę menu", ar: "المنيو لو سمحت", ph: "il-menyu law samaHt" },
  { cat: "food_shopping", pl: "Co polecasz?", ar: "ترشح إيه؟", ph: "terashshaH eeh?" },
  { cat: "food_shopping", pl: "Chciałbym zamówić", ar: "عايز أطلب", ph: "3aayez aTlob" },
  { cat: "food_shopping", pl: "To wszystko", ar: "بس كده", ph: "bass keda" },
  { cat: "food_shopping", pl: "Bardzo smaczne", ar: "لذيذ جداً", ph: "laziiz gedan" },
  { cat: "food_shopping", pl: "Rachunek poproszę", ar: "الحساب لو سمحت", ph: "il-Hesaab law samaHt" },
  { cat: "food_shopping", pl: "Można kartą?", ar: "ينفع كارت؟", ph: "yenfa3 kart?" },
  { cat: "food_shopping", pl: "Gotówką", ar: "كاش", ph: "kaash" },
  { cat: "food_shopping", pl: "Bez cebuli", ar: "من غير بصل", ph: "min 8eer baSal" },
  { cat: "food_shopping", pl: "Bez ostrego", ar: "من غير شطة", ph: "min 8eer shaTTa" },
  { cat: "food_shopping", pl: "Ile to kosztuje?", ar: "ده بكام؟", ph: "da bikaam?" },
  { cat: "food_shopping", pl: "Za drogo (bardzo)", ar: "غالي قوي", ph: "8aali 2awi" },
  { cat: "food_shopping", pl: "Nie ma zniżki?", ar: "مفيش خصم؟", ph: "mafiish khaSm?" },
  { cat: "food_shopping", pl: "Wezmę to", ar: "هاخده", ph: "haakhdo" },
  { cat: "food_shopping", pl: "Tylko oglądam", ar: "بتفرج بس", ph: "batfarrag bass" },
  { cat: "food_shopping", pl: "Masz drobne?", ar: "معاك فكة؟", ph: "ma3aak fakka?" },
  { cat: "food_shopping", pl: "Torba / reklamówka", ar: "كيس", ph: "kiis" },
  { cat: "travel", pl: "Jak dojdę do…?", ar: "أروح إزاي؟", ph: "aruuH ezzaay?" },
  { cat: "travel", pl: "W prawo", ar: "يمين", ph: "yemiin" },
  { cat: "travel", pl: "Tutaj", ar: "هنا", ph: "hena" },
  { cat: "travel", pl: "Zatrzymaj tutaj", ar: "وقف هنا", ph: "wa22af hena", ex: { ar: "وقف هنا لو سمحت.", ph: "wa22af hena", pl: "Zatrzymaj tutaj, proszę." } },
  { cat: "travel", pl: "Taksówka", ar: "تاكسي", ph: "taksi" },
  { cat: "travel", pl: "Lotnisko", ar: "المطار", ph: "il-maTaar" },
  { cat: "expressions", pl: "Chwileczkę", ar: "استنى شوية", ph: "estanna shwayya" },
  { cat: "expressions", pl: "Zaraz wracam", ar: "راجع حالاً", ph: "raage3 Haalan" },
  { cat: "expressions", pl: "Naprawdę?", ar: "بجد؟", ph: "begad?" },
  { cat: "expressions", pl: "Powodzenia!", ar: "بالتوفيق", ph: "bit-tawfii2" },
  { cat: "expressions", pl: "Miłego dnia!", ar: "يوم سعيد", ph: "yoom sa3iid" },
];

function freshDeck() {
  return [
    ...SEED_WORDS, ...VERB_WORDS, ...NOUN_WORDS, ...QW_WORDS,
    ...GRAMMAR_WORDS, ...EXPRESSION_WORDS, ...RELIGIOUS_WORDS,
    ...FOOD_WORDS, ...KITCHEN_WORDS, ...PHRASE_WORDS, ...CONJUNCTION_WORDS, ...FAMILY_WORDS, ...HEALTH_WORDS, ...WEATHER_WORDS, ...SMALLTALK_WORDS, ...FILLER_WORDS, ...SLANG_WORDS, ...LIFE_WORDS,
    ...COLOR_WORDS, ...ADJECTIVE_WORDS, ...DAILY_VERB_WORDS, ...MOTION_VERB_WORDS, ...TIME_ADVERB_WORDS,
    ...BODY_WORDS, ...CLOTHES_WORDS, ...HOME_FURNITURE_WORDS, ...NATURE_WORDS, ...TRANSPORT_WORDS,
    ...JOB_WORDS, ...EMOTION_WORDS, ...ANIMAL_WORDS, ...ORDINAL_WORDS,
  ];
}

// Stabilny identyfikator słówka (nie zależy od pozycji w tablicy).
function wordId(w) {
  return `${w.cat || "other"}|${w.pl}|${w.ar}`;
}

function loadProgress() {
  try {
    const raw = localStorage.getItem(PROGRESS_KEY);
    if (raw) return JSON.parse(raw); // { id: {correctCount, wrongCount, verified, flagged, ex} }
  } catch (e) {}
  return {};
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
        };
      }
    }
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(prog));
    try {
      const meta = { count: Object.keys(prog).length, at: new Date().toISOString() };
      localStorage.setItem("ar-eg-progress-meta", JSON.stringify(meta));
    } catch (e2) {}
  } catch (e) {}
}

function loadWords() {
  // 1) Zbuduj aktualną bazę (z nowymi słowami z każdej aktualizacji).
  const deck = freshDeck();
  // 2) Dołóż słówka dodane ręcznie przez użytkownika (zapisane pod starym kluczem).
  let userAdded = [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const saved = JSON.parse(raw);
      const deckIds = new Set(deck.map(wordId));
      userAdded = saved.filter((w) => !deckIds.has(wordId(w)));
    }
  } catch (e) {}
  const all = [...deck, ...userAdded];
  // 3) Nałóż zapisany postęp na dopasowane słówka (po stabilnym id).
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
              placeholder="co poprawić?"
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
              title="Usuń oznaczenie"
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
          title="Usuń zatwierdzenie"
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
        poprawna
      </button>
      <button
        className="review-toggle-btn review-toggle-flag"
        onClick={() => onToggleFlag(true, "")}
      >
        <Flag size={14} />
        do poprawki
      </button>
    </div>
  );
}

// ---------- Komponent: przycisk "nowy przykład" (generowany przez AI) ----------
function EditExampleButton({ word, onSaveExample, className = "" }) {
  const [editing, setEditing] = useState(false);
  const [ar, setAr] = useState(word.ex?.ar || "");
  const [ph, setPh] = useState(word.ex?.ph || "");
  const [pl, setPl] = useState(word.ex?.pl || "");

  function startEdit(e) {
    e.preventDefault();
    e.stopPropagation();
    setAr(word.ex?.ar || "");
    setPh(word.ex?.ph || "");
    setPl(word.ex?.pl || "");
    setEditing(true);
  }

  function handleSave(e) {
    e.preventDefault();
    e.stopPropagation();
    if (!ar.trim() || !pl.trim()) return;
    onSaveExample({ ar: ar.trim(), ph: ph.trim(), pl: pl.trim() });
    setEditing(false);
  }

  if (editing) {
    return (
      <div className={`example-edit-wrap ${className}`} onClick={(e) => e.stopPropagation()}>
        <input
          autoFocus
          className="example-edit-input example-edit-input-arabic"
          placeholder="zdanie po arabsku"
          value={ar}
          onChange={(e) => setAr(e.target.value)}
        />
        <input
          className="example-edit-input example-edit-input-mono"
          placeholder="transkrypcja"
          value={ph}
          onChange={(e) => setPh(e.target.value)}
        />
        <input
          className="example-edit-input"
          placeholder="tłumaczenie"
          value={pl}
          onChange={(e) => setPl(e.target.value)}
        />
        <div className="example-edit-actions">
          <button type="button" className="text-btn" onClick={() => setEditing(false)}>
            anuluj
          </button>
          <button
            type="button"
            className="example-edit-save"
            onClick={handleSave}
            disabled={!ar.trim() || !pl.trim()}
          >
            <Check size={13} />
            zapisz
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`new-example-wrap ${className}`} onClick={(e) => e.stopPropagation()}>
      <button type="button" className="new-example-btn" onClick={startEdit}>
        <Pencil size={13} />
        {word.ex ? "edytuj przykład" : "dodaj przykład"}
      </button>
    </div>
  );
}

function Flashcard({ word, flipped, onFlip, onToggleFlag, onToggleVerified, onSetKnown, onSaveExample, onEditCard }) {
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
            title="Edytuj fiszkę"
          >
            <Pencil size={14} />
          </button>
          {word.known && <KnownBadge value={word.known} />}
          <span className="card-eyebrow">polski</span>
          <span className="card-word">{word.pl}</span>
          <span className="card-hint">dotknij, by odsłonić</span>
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
            title="Edytuj fiszkę"
          >
            <Pencil size={14} />
          </button>
          <span className="card-eyebrow">مصري</span>
          <span className="card-arabic">{word.ar}</span>
          <span className="card-phonetic">{word.ph}</span>
          {(() => {
            const ex = word.ex || findUsageExample(word);
            if (!ex) return null;
            return (
              <div className="card-example">
                {!word.ex && <span className="card-example-src">przykład z dialogu</span>}
                <span className="example-arabic">{ex.ar}</span>
                <span className="example-phonetic">{ex.ph}</span>
                <span className="example-pl">„{ex.pl}”</span>
              </div>
            );
          })()}
          <EditExampleButton word={word} onSaveExample={onSaveExample} className="new-example-card" />
          <KnownTags value={word.known} onSetKnown={onSetKnown} />
          <ReviewPanel word={word} onToggleFlag={onToggleFlag} onToggleVerified={onToggleVerified} />
        </div>
      </div>
    </div>
  );
}

// Pasek samooceny: wiem / nie wiem / do powtórki. Kliknięcie aktywnego zdejmuje.
function KnownTags({ value, onSetKnown }) {
  const opts = [
    { key: "known", label: "wiem", cls: "known-tag-known" },
    { key: "unknown", label: "nie wiem", cls: "known-tag-unknown" },
    { key: "review", label: "do powtórki", cls: "known-tag-review" },
  ];
  return (
    <div className="known-tags" onClick={(e) => e.stopPropagation()}>
      {opts.map((o) => (
        <button
          key={o.key}
          className={`known-tag ${o.cls} ${value === o.key ? "known-tag-active" : ""}`}
          onClick={() => onSetKnown(o.key)}
        >
          {o.label}
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
function FlashcardsView({ words, onToggleFlag, onToggleVerified, onSetKnown, onSaveExample, onEditCard, preserveOrder, emptyHint }) {
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
    return <EmptyState text="Wczytywanie słówek…" />;
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
            title="Od najstarszych (kolejność dodania)"
          >
            ↑ stare
          </button>
          <button
            className={`flash-sort-btn ${sortMode === "newest" ? "flash-sort-active" : ""}`}
            onClick={() => changeSort("newest")}
            title="Od najnowszych"
          >
            ↓ nowe
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
      />

      <div className="nav-row">
        <button className="nav-btn" onClick={prev}>
          ← wstecz
        </button>
        <button className="nav-btn nav-btn-primary" onClick={next}>
          dalej →
        </button>
      </div>
    </div>
  );
}

// ---------- Widok: Quiz ----------
// Znajduje w dialogach lub czytankach zdanie zawierające dane słowo — użyte jako
// przykład w quizie, gdy słowo nie ma własnego pola ex.
function findUsageExample(word) {
  if (!word || !word.ar) return null;
  const target = normalizeArabic(word.ar);
  if (!target || target.length < 2) return null;
  const inText = (arText) => {
    const norm = normalizeArabic(arText);
    return norm.split(" ").some((tok) => tok === target || (tok.length > 3 && tok.includes(target)));
  };
  for (const d of DIALOGUES) {
    for (const line of d.lines) {
      if (inText(line.ar)) return { ar: line.ar, ph: line.ph, pl: line.pl };
    }
  }
  for (const r of READINGS) {
    for (const s of r.sentences) {
      if (inText(s.ar)) return { ar: s.ar, ph: s.ph, pl: s.pl };
    }
  }
  return null;
}

function QuizView({ words, onAnswer, preserveOrder }) {
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
    return <EmptyState text="Dodaj przynajmniej 4 słówka, aby uruchomić quiz." />;
  }

  if (!correctWord) {
    return <EmptyState text="Wczytywanie słówek…" />;
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
            łatwy
          </button>
          <button
            type="button"
            className={`quiz-diff-btn ${difficulty === "hard" ? "quiz-diff-active" : ""}`}
            onClick={() => difficulty !== "hard" && (setDifficulty("hard"), setSelected(null))}
          >
            trudny
          </button>
          <button
            type="button"
            className={`quiz-diff-btn ${difficulty === "expert" ? "quiz-diff-active" : ""}`}
            onClick={() => difficulty !== "expert" && (setDifficulty("expert"), setSelected(null))}
          >
            ekspert
          </button>
        </div>
        <span className="quiz-diff-hint">
          {difficulty === "expert"
            ? "sam arabski — transkrypcja po odpowiedzi"
            : difficulty === "hard"
            ? "warianty tego samego wyrazu"
            : "losowe słówka jako błędne"}
        </span>
      </div>

      <div className="quiz-len-row">
        <span className="quiz-len-label">liczba pytań:</span>
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
        <span className="quiz-len-label">kierunek:</span>
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
          {direction === "ar2pl" ? "co to znaczy?" : "jak po egipsku?"}
        </span>
        {direction === "ar2pl" ? (
          <>
            <span className="quiz-word quiz-word-ar">{correctWord.ar}</span>
            {(difficulty !== "expert" || selected) && (
              <span className="quiz-word-ph">{correctWord.ph}</span>
            )}
          </>
        ) : (
          <span className="quiz-word">{correctWord.pl}</span>
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
              <span className="quiz-reveal-pl">{correctWord.pl}</span>
            </div>
            {usage ? (
              <div className="quiz-reveal-ex">
                <span className="quiz-reveal-ex-label">przykład użycia</span>
                <span className="quiz-reveal-ex-ar">{usage.ar}</span>
                <span className="quiz-reveal-ex-ph">{usage.ph}</span>
                <span className="quiz-reveal-ex-pl">„{usage.pl}”</span>
              </div>
            ) : null}
          </div>
        );
      })()}

      {selected && (
        <button className="nav-btn nav-btn-primary nav-btn-full" onClick={nextQuestion}>
          {idx + 1 >= pool.length ? "zobacz wynik" : "następne słowo"} →
        </button>
      )}
    </div>
  );
}

// ---------- Widok: Lista / edycja ----------
function ListView({ words, setWords, activeCat, onToggleFlag, onToggleVerified, onSaveExample, onEditCard }) {
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
      localStorage.removeItem(PROGRESS_KEY);
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
          placeholder="polski (np. dom)"
          value={pl}
          onChange={(e) => setPl(e.target.value)}
        />
        <input
          className="text-input input-arabic"
          placeholder="arabski (np. بيت)"
          value={ar}
          onChange={(e) => setAr(e.target.value)}
        />
        <input
          className="text-input input-mono"
          placeholder="transkrypcja (np. beet)"
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
              {c.emoji} {c.label}
            </option>
          ))}
        </select>
        <div className="example-divider">przykład użycia (opcjonalnie)</div>
        <input
          className="text-input input-arabic"
          placeholder="zdanie po arabsku"
          value={exAr}
          onChange={(e) => setExAr(e.target.value)}
        />
        <input
          className="text-input input-mono"
          placeholder="transkrypcja zdania"
          value={exPh}
          onChange={(e) => setExPh(e.target.value)}
        />
        <input
          className="text-input example-pl-input"
          placeholder="tłumaczenie zdania"
          value={exPl}
          onChange={(e) => setExPl(e.target.value)}
        />
        <button className="nav-btn nav-btn-primary add-submit" type="submit">
          <Plus size={16} style={{ marginRight: 6 }} />
          dodaj
        </button>
      </form>

      <div className="list-toolbar">
        <span className="list-count">
          {visibleWords.length} / {words.length} słówek
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
            zestaw startowy
          </button>
          <button className="text-btn text-btn-danger" onClick={clearAll}>
            wyczyść wszystko
          </button>
        </div>
      </div>
      <p className="csv-hint">
        CSV: polski,arabski,transkrypcja,zdanie_ar,zdanie_transkr,zdanie_pl — ostatnie trzy
        kolumny opcjonalne. Importowane słówka trafią do działu wybranego powyżej.
      </p>

      <div className="search-bar">
        <input
          type="text"
          className="search-input"
          placeholder="Szukaj: polski, transkrypcja lub arabski…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {search && (
          <button
            type="button"
            className="search-clear"
            onClick={() => setSearch("")}
            title="Wyczyść"
          >
            <X size={15} />
          </button>
        )}
      </div>

      <div className="status-filter-row">
        {[
          { key: "all", label: "wszystkie" },
          { key: "untouched", label: "nieprzerobione" },
          { key: "inprogress", label: "w trakcie" },
          { key: "mastered", label: "opanowane" },
        ].map((f) => (
          <button
            key={f.key}
            type="button"
            className={`status-filter-btn ${statusFilter === f.key ? "status-filter-active" : ""}`}
            onClick={() => setStatusFilter(f.key)}
          >
            {f.label}
          </button>
        ))}
        <span className="status-filter-count">{visibleWords.length} słówek</span>
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
                <span className="word-cat-tag">{categoryLabel(w.cat)}</span>
                {w.flagged && (
                  <button
                    className="word-flag-tag"
                    onClick={() => onToggleFlag(w, false, "")}
                    title="Kliknij, by usunąć oznaczenie"
                  >
                    <Flag size={11} />
                    {w.flagNote ? w.flagNote : "do poprawki"}
                  </button>
                )}
                {w.verified && (
                  <button
                    className="word-verified-tag"
                    onClick={() => onToggleVerified(w, false)}
                    title="Kliknij, by usunąć zatwierdzenie"
                  >
                    <Check size={11} />
                    sprawdzone
                  </button>
                )}
              </div>
              <span className="word-pl">{w.pl}</span>
              <span className="word-ar">{w.ar}</span>
              <span className="word-ph">{w.ph}</span>
              {w.ex && (
                <span className="word-ex">
                  {w.ex.ar} <span className="word-ex-pl">— {w.ex.pl}</span>
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
                title="Edytuj fiszkę"
              >
                <Pencil size={15} />
              </button>
              {!w.verified && (
                <button
                  className="icon-btn icon-btn-verify"
                  onClick={() => onToggleVerified(w, true)}
                  title="Oznacz jako poprawną"
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
            placeholder="polski (np. czy mogę prosić o rachunek?)"
            value={pl}
            onChange={(e) => handlePlChange(e.target.value)}
          />
          <input
            className="text-input input-arabic"
            placeholder="arabski (np. ممكن الفاتورة؟)"
            value={ar}
            onChange={(e) => setAr(e.target.value)}
          />
          {!arLooksArabic && (
            <p className="modal-warning">To pole nie wygląda na zapisane pismem arabskim — sprawdź, czy nie wpisałeś transkrypcji w tym miejscu.</p>
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
                {c.emoji} {c.label}
              </option>
            ))}
          </select>
          {!isEditing && !catTouched && cat !== "other" && (
            <p className="modal-hint">Dział dobrany automatycznie na podstawie treści — możesz go zmienić powyżej.</p>
          )}

          <div className="example-divider">przykład użycia (opcjonalnie)</div>
          <input
            className="text-input input-arabic"
            placeholder="zdanie po arabsku"
            value={exAr}
            onChange={(e) => setExAr(e.target.value)}
          />
          <input
            className="text-input input-mono"
            placeholder="transkrypcja zdania"
            value={exPh}
            onChange={(e) => setExPh(e.target.value)}
          />
          <input
            className="text-input example-pl-input"
            placeholder="tłumaczenie zdania"
            value={exPl}
            onChange={(e) => setExPl(e.target.value)}
          />

          {(pl.trim() || ar.trim()) && (
            <div className="modal-preview">
              <span className="modal-preview-label">podgląd fiszki</span>
              <span className="word-cat-tag">{categoryLabel(cat)}</span>
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
                  <span>Usunąć tę fiszkę na zawsze?</span>
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
  { key: "present", label: "teraźniejszy", arLabel: "المضارع" },
  { key: "past", label: "przeszły", arLabel: "الماضي" },
  { key: "future", label: "przyszły", arLabel: "المستقبل" },
];

function VerbsView() {
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
      <p className="verbs-intro">
        Odmiana podstawowych czasowników przez wszystkie osoby, w trzech czasach.
        Stuknij czasownik, aby zobaczyć pełną tabelę, i przełącz czas powyżej niej.
      </p>

      {/* Tabela wzorów odmiany */}
      <div className="pattern-box">
        <button
          className="pattern-toggle"
          onClick={() => setShowPattern((v) => !v)}
        >
          <span>📐 Wzory odmiany (przedrostki i końcówki)</span>
          <span className="pattern-chevron">{showPattern ? "−" : "+"}</span>
        </button>
        {showPattern && (
          <div className="pattern-body">
            <p className="pattern-intro">
              Schemat na przykładzie regularnego czasownika <strong>كتب</strong> (k-t-b,
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
                  {t.label}
                </button>
              ))}
            </div>
            <p className="pattern-rule">{pat.note}</p>
            <table className="pattern-table">
              <thead>
                <tr>
                  <th>osoba</th>
                  <th>wzór</th>
                  <th>przykład</th>
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
                      <th>osoba</th>
                      <th>teraźn.</th>
                      <th>przeszły</th>
                      <th>przyszły</th>
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
                <p className="pattern-rule irr-note">{grp.note}</p>
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
                  <span className="verb-card-pl">{v.pl}</span>
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
                        {t.label}
                      </button>
                    ))}
                  </div>
                  {v.note && tense === "present" && <p className="verb-note">{v.note}</p>}
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
        <h3 className="modal-section-title">Czasowniki modalne + czasownik bazowy</h3>
        <p className="verbs-intro">
          Wybierz czasownik modalny i czasownik bazowy — tabela pokaże, jak łączą się
          przez wszystkie osoby. Czasownik bazowy stoi w trybie łączącym (subjunctive),
          czyli bez przedrostka „بـ”.
        </p>

        <div className="modal-picker-label">Czasownik modalny</div>
        <div className="modal-chip-row">
          {MODALS.map((m) => (
            <button
              key={m.key}
              type="button"
              className={`modal-chip ${modalKey === m.key ? "modal-chip-active" : ""}`}
              onClick={() => setModalKey(m.key)}
            >
              <span className="modal-chip-ar">{m.ar}</span>
              <span className="modal-chip-pl">{m.pl.split(" ")[0]}</span>
            </button>
          ))}
        </div>

        <div className="modal-picker-label">Czasownik bazowy</div>
        <div className="modal-chip-row">
          {BASE_VERBS.map((b) => (
            <button
              key={b.key}
              type="button"
              className={`modal-chip ${baseKey === b.key ? "modal-chip-active" : ""}`}
              onClick={() => setBaseKey(b.key)}
            >
              <span className="modal-chip-ar">{b.ar}</span>
              <span className="modal-chip-pl">{b.pl.split(" ")[0]}</span>
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
                  {t.label}
                </button>
              ))}
            </div>
            {activeModal?.note && modalTense === "present" && (
              <p className="verb-note">{activeModal.note}</p>
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
  { key: "sing", label: "pojedyncza", arLabel: "المفرد" },
  { key: "dual", label: "podwójna", arLabel: "المثنى" },
  { key: "plur", label: "mnoga", arLabel: "الجمع" },
];

function NounsView() {
  const [openIdx, setOpenIdx] = useState(0);
  // Sekcja dzierżawcza — niezależny wybór rzeczownika
  const possNouns = NOUNS.filter((n) => n.poss);
  const [possIdx, setPossIdx] = useState(0);
  const activePoss = possNouns[possIdx];

  return (
    <div className="view-verbs">
      <p className="verbs-intro">
        Podstawowe rzeczowniki w trzech liczbach: pojedynczej, podwójnej (dual) i mnogiej,
        z oznaczeniem rodzaju. Stuknij rzeczownik, aby rozwinąć pełną tabelę.
      </p>
      <ul className="verb-list">
        {NOUNS.map((n, i) => {
          const isOpen = openIdx === i;
          const g = n.genOverride || n.gen;
          const genLabel = g === "f" ? "r.ż." : "r.m.";
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
                    {n.pl}
                    <span className={`noun-gender noun-gender-${g}`}>{genLabel}</span>
                  </span>
                  <span className="verb-card-ar">{n.sing.ar}</span>
                  <span className="verb-card-ph">{n.sing.ph}</span>
                </div>
                <span className={`verb-caret ${isOpen ? "verb-caret-open" : ""}`}>▾</span>
              </button>

              {isOpen && (
                <div className="verb-table">
                  {n.note && <p className="verb-note">{n.note}</p>}
                  {rows.map((r, j) => {
                    const tab = NOUN_NUM_TABS.find((t) => t.key === r.key);
                    return (
                      <div className="verb-row" key={j}>
                        <div className="verb-pronoun-stack">
                          <span className="verb-pronoun-pl">{tab?.label}</span>
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
        <h3 className="modal-section-title">Zaimki dzierżawcze (sufiksy)</h3>
        <p className="verbs-intro">
          W egipskim „mój / twój / jego…” to sufiks doklejany do rzeczownika, nie osobne słowo.
          Wybierz rzeczownik — tabela pokaże wszystkie osiem form.
        </p>

        <div className="modal-picker-label">Rzeczownik</div>
        <div className="modal-chip-row">
          {possNouns.map((n, i) => (
            <button
              key={i}
              type="button"
              className={`modal-chip ${possIdx === i ? "modal-chip-active" : ""}`}
              onClick={() => setPossIdx(i)}
            >
              <span className="modal-chip-ar">{n.sing.ar}</span>
              <span className="modal-chip-pl">{n.pl.split(" ")[0].replace("/", "")}</span>
            </button>
          ))}
        </div>

        <div className="verb-card modal-result-card">
          <div className="verb-table">
            <p className="verb-note">
              <strong>{activePoss.pl}</strong> — {activePoss.sing.ar} ({activePoss.sing.ph})
            </p>
            {activePoss.possNote && <p className="verb-note">{activePoss.possNote}</p>}
            {POSS_SUFFIXES.map((suf, j) => {
              const form = activePoss.poss[suf.key];
              if (!form) return null;
              return (
                <div className="verb-row" key={j}>
                  <div className="verb-pronoun-stack">
                    <span className="verb-pronoun">{suf.suf}</span>
                    <span className="verb-pronoun-ph">{suf.ph}</span>
                  </div>
                  <span className="verb-pronoun-pl">{suf.pl}</span>
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
  return (
    <div className="view-verbs">
      <p className="verbs-intro">
        Zaimki pytające egipskiego arabskiego. Uwaga na szyk — zaimek często stoi na
        końcu zdania (np. „ismak eeh?” = „jak masz na imię?”). Każdy z przykładem użycia.
      </p>
      <ul className="qw-list">
        {QUESTION_WORDS.map((q, i) => (
          <li className="qw-card" key={i}>
            <div className="qw-head">
              <div className="qw-main">
                <span className="qw-ar">{q.ar}</span>
                <span className="qw-ph">{q.ph}</span>
              </div>
              <span className="qw-pl">{q.pl}</span>
            </div>
            {q.note && <p className="verb-note qw-note">{q.note}</p>}
            {q.ex && (
              <div className="qw-example">
                <span className="qw-ex-ar">{q.ex.ar}</span>
                <span className="qw-ex-ph">{q.ex.ph}</span>
                <span className="qw-ex-pl">{q.ex.pl}</span>
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
  { key: "demons", label: "wskazujące" },
  { key: "numerals", label: "liczebniki" },
  { key: "bignum", label: "11–100" },
  { key: "compar", label: "stopniowanie" },
  { key: "imper", label: "rozkaźnik" },
  { key: "preps", label: "przyimki" },
  { key: "negation", label: "negacja" },
];

function GrammarView() {
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
            {s.label}
          </button>
        ))}
      </div>

      {/* Zaimki wskazujące */}
      {section === "demons" && (
        <>
          <p className="verbs-intro">
            Zaimki wskazujące: ده (m.) / دي (f.) / دول (l.mn.). Zwykle stoją PO rzeczowniku
            z rodzajnikiem: „il-beet da” = „ten dom”.
          </p>
          <ul className="qw-list">
            {DEMONSTRATIVES.map((d, i) => (
              <li className="qw-card" key={i}>
                <div className="qw-head">
                  <div className="qw-main">
                    <span className="qw-ar">{d.ar}</span>
                    <span className="qw-ph">{d.ph}</span>
                  </div>
                  <span className="qw-pl">{d.pl}</span>
                </div>
                {d.note && <p className="verb-note qw-note">{d.note}</p>}
                {d.ex && (
                  <div className="qw-example">
                    <span className="qw-ex-ar">{d.ex.ar}</span>
                    <span className="qw-ex-ph">{d.ex.ph}</span>
                    <span className="qw-ex-pl">{d.ex.pl}</span>
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
          <p className="verbs-intro">
            Liczebniki 1–10. Kluczowe reguły: „2” zastępuje dual (yomeen = 2 dni),
            a 3–10 stoją przed rzeczownikiem w liczbie MNOGIEJ, często w formie skróconej.
          </p>

          {/* Kompozytor: liczba + rzeczownik */}
          <div className="modal-section count-composer">
            <h3 className="modal-section-title">Złóż frazę: liczba + rzeczownik</h3>

            <div className="modal-picker-label">Liczba</div>
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

            <div className="modal-picker-label">Rzeczownik</div>
            <div className="modal-chip-row">
              {NOUNS.map((n, i) => (
                <button
                  key={i}
                  type="button"
                  className={`modal-chip ${countNounIdx === i ? "modal-chip-active" : ""}`}
                  onClick={() => setCountNounIdx(i)}
                >
                  <span className="modal-chip-ar">{n.sing.ar}</span>
                  <span className="modal-chip-pl">{n.pl.split(" ")[0].replace("/", "")}</span>
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
                {n.note && <p className="verb-note num-note">{n.note}</p>}
              </li>
            ))}
          </ul>
        </>
      )}

      {/* Przyimki z sufiksami */}
      {section === "preps" && (
        <>
          <p className="verbs-intro">
            Przyimki łączą się z sufiksami zaimkowymi (ja/ty/on…). Stuknij przyimek,
            aby rozwinąć pełną odmianę. Formy są nieregularne — warto zapamiętać całościowo.
          </p>
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
                      {p.note && <p className="verb-note">{p.note}</p>}
                      {PREP_SUFFIXES.map((suf, j) => {
                        const f = p.forms[suf.key];
                        if (!f) return null;
                        return (
                          <div className="verb-row" key={j}>
                            <div className="verb-pronoun-stack">
                              <span className="verb-pronoun-pl">{suf.pl}</span>
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
            Dwa systemy: <strong>ma-…-sh</strong> obejmuje klamrą czasownik (baruu7 →
            ma-baruu7-sh), a <strong>mish</strong> neguje wszystko inne — przymiotniki,
            rzeczowniki, imiesłowy (mish 3aayez!) oraz czas przyszły (mish haruu7).
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
              {negTest ? "tryb nauki: pokaż wszystko" : "sprawdź się: ukryj przeczenia"}
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
                    <span className="neg-pl">{n.pl}</span>
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
                  {!hidden && n.note && <p className="verb-note qw-note">{n.note}</p>}
                </li>
              );
            })}
          </ul>
        </>
      )}

      {/* Liczebniki 11–100 */}
      {section === "bignum" && (
        <>
          <p className="verbs-intro">
            Liczebniki 11–100. Nastki (11–19) kończą się na „-taashar”. W dziesiątkach
            złożonych jedności stoją PRZED dziesiątką, spojone „wi” (khamsa wi 3eshriin = 25).
          </p>
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
                {n.note && <p className="verb-note num-note">{n.note}</p>}
              </li>
            ))}
          </ul>
        </>
      )}

      {/* Stopniowanie */}
      {section === "compar" && (
        <>
          <p className="verbs-intro">
            Stopniowanie: forma „af3al” działa jako wyższy (akbar min = większy niż) i —
            z rodzajnikiem — jako najwyższy (il-akbar = największy). Nie odmienia się przez rodzaj.
          </p>
          <ul className="qw-list">
            {COMPARATIVES.map((c, i) => (
              <li className="qw-card" key={i}>
                <div className="compar-row">
                  <div className="compar-cell">
                    <span className="compar-label">podstawowy</span>
                    <span className="compar-ar">{c.base.ar}</span>
                    <span className="compar-ph">{c.base.ph}</span>
                    <span className="compar-pl">{c.pl}</span>
                  </div>
                  <span className="compar-arrow">→</span>
                  <div className="compar-cell">
                    <span className="compar-label">wyższy</span>
                    <span className="compar-ar">{c.comp.ar}</span>
                    <span className="compar-ph">{c.comp.ph}</span>
                  </div>
                  <span className="compar-arrow">→</span>
                  <div className="compar-cell">
                    <span className="compar-label">najwyższy</span>
                    <span className="compar-ar">{c.sup.ar}</span>
                    <span className="compar-ph">{c.sup.ph}</span>
                  </div>
                </div>
                {c.note && <p className="verb-note qw-note">{c.note}</p>}
                {c.ex && (
                  <div className="qw-example">
                    <span className="qw-ex-ar">{c.ex.ar}</span>
                    <span className="qw-ex-ph">{c.ex.ph}</span>
                    <span className="qw-ex-pl">{c.ex.pl}</span>
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
          <p className="verbs-intro">
            Tryb rozkazujący: osobne formy dla mężczyzny, kobiety i liczby mnogiej.
            Zakaz tworzy klamra ma-…-sh na formie „ty” (ruuH → ma-truuH-sh = nie idź).
          </p>
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
                    <span className="imper-label">zakaz</span>
                    <span className="imper-ar">{im.neg.ar}</span>
                    <span className="imper-ph">{im.neg.ph}</span>
                  </div>
                </div>
                {im.note && <p className="verb-note qw-note">{im.note}</p>}
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
        <span className="card-eyebrow">ułóż po egipsku</span>
        <span className="quiz-word sentence-prompt">{drill.pl}</span>
      </div>

      {/* Pasek odpowiedzi */}
      <div
        className={`sentence-strip ${isCorrect ? "sentence-strip-correct" : ""} ${
          isWrong && !revealed ? "sentence-strip-wrong" : ""
        }`}
      >
        {placed.length === 0 && (
          <span className="sentence-strip-hint">stukaj kafelki poniżej…</span>
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
          {drill.note && <p className="verb-note sentence-note">{drill.note}</p>}
        </div>
      )}
      {isWrong && !revealed && (
        <p className="sentence-wrong-hint">
          Coś nie gra — stuknij kafelek na pasku, żeby go zdjąć i poprawić.
        </p>
      )}

      <div className="nav-row">
        {!solved && (
          <button className="nav-btn" onClick={reveal}>
            pokaż odpowiedź
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
function DialoguesView() {
  const [idx, setIdx] = useState(0);
  const [hidePl, setHidePl] = useState(false);
  const [hidePh, setHidePh] = useState(false);
  const d = DIALOGUES[idx];

  return (
    <div className="view-verbs">
      <p className="verbs-intro">
        Krótkie scenki z życia — poznane słowa w realnych sytuacjach. Przełączaj dialogi,
        a przyciskami możesz ukryć tłumaczenia lub transkrypcję i sprawdzić, ile rozumiesz
        z samego pisma.
      </p>

      <div className="dlg-picker">
        {DIALOGUES.map((dl, i) => (
          <button
            key={i}
            type="button"
            className={`dlg-tab ${idx === i ? "dlg-tab-active" : ""}`}
            onClick={() => setIdx(i)}
          >
            <span className="dlg-tab-emoji">{dl.emoji}</span>
            {dl.title}
          </button>
        ))}
      </div>

      <div className="dlg-card">
        <div className="dlg-header">
          <span className="dlg-title">
            {d.emoji} {d.title}
          </span>
          <div className="dlg-toggles">
            <button
              type="button"
              className={`status-filter-btn ${hidePh ? "status-filter-active" : ""}`}
              onClick={() => setHidePh((v) => !v)}
            >
              {hidePh ? "pokaż transkrypcję" : "ukryj transkrypcję"}
            </button>
            <button
              type="button"
              className={`status-filter-btn ${hidePl ? "status-filter-active" : ""}`}
              onClick={() => setHidePl((v) => !v)}
            >
              {hidePl ? "pokaż tłumaczenia" : "ukryj tłumaczenia"}
            </button>
          </div>
        </div>
        <p className="dlg-context">{d.context}</p>

        <div className="dlg-thread">
          {d.lines.map((ln, i) => (
            <div key={i} className={`dlg-bubble dlg-bubble-${ln.s}`}>
              <span className="dlg-ar">{ln.ar}</span>
              {!hidePh && <span className="dlg-ph">{ln.ph}</span>}
              {!hidePl && <span className="dlg-pl">{ln.pl}</span>}
            </div>
          ))}
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
    return <EmptyState text="Brak zdań do ćwiczenia luki." />;
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
        <span className="quiz-len-label">zdania:</span>
        <div className="quiz-len-toggle">
          <button
            type="button"
            className={`quiz-len-btn ${source === "fixed" ? "quiz-len-active" : ""}`}
            onClick={() => { if (source !== "fixed") { setSource("fixed"); loadRounds("fixed"); } }}
          >
            gotowe
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
        <span className="card-eyebrow">uzupełnij lukę</span>
        <span className="quiz-word gap-pl">{round.drill.pl}</span>
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
          {round.drill.note && <p className="verb-note gap-note">{round.drill.note}</p>}
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
const STATS_KEY = "ar-eg-stats-v1";

// Lokalna data w formacie YYYY-MM-DD (bez strefy UTC, żeby "dziś" było lokalne).
function todayKey(d = new Date()) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function loadStats() {
  try {
    const raw = localStorage.getItem(STATS_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return { days: {} }; // { "2026-07-03": liczba odpowiedzi }
}

function saveStats(stats) {
  try {
    localStorage.setItem(STATS_KEY, JSON.stringify(stats));
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
function storageDiagnostic() {
  try {
    const raw = localStorage.getItem(PROGRESS_KEY);
    if (!raw) return "W pamięci: brak zapisanego postępu.";
    const prog = JSON.parse(raw);
    const ids = Object.keys(prog);
    // Ile ma REALNY postęp (trafienia/pomyłki), a ile to tylko puste wpisy.
    let withHits = 0, known = 0;
    for (const id of ids) {
      const p = prog[id];
      if ((p.correctCount || 0) + (p.wrongCount || 0) > 0) withHits++;
      if (p.known) known++;
    }
    return `W pamięci: ${ids.length} wpisów, z czego ${withHits} z trafieniami, ${known} oznaczonych. Jeśli po ćwiczeniu „z trafieniami" nie rośnie — daj znać.`;
  } catch (e) {
    return "Nie można odczytać pamięci przeglądarki.";
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
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(prog));
    if (backup.stats) localStorage.setItem(STATS_KEY, JSON.stringify(backup.stats));
  } catch (e) {}
  return { words: mergedWords, stats: backup.stats || { days: {} } };
}

// Odnotuj aktywność „dzisiaj" (+1 odpowiedź).
function markStudiedToday(stats) {
  const k = todayKey();
  const days = { ...stats.days, [k]: (stats.days[k] || 0) + 1 };
  return { ...stats, days };
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
        emoji: c.emoji,
        total: inCat.length,
        practiced,
        pct: Math.round((practiced / inCat.length) * 100),
      };
    })
    .filter(Boolean)
    .sort((a, b) => b.pct - a.pct);

  const DOW = ["N", "P", "W", "Ś", "C", "P", "S"];

  // Quiz z podziałem na poziomy trudności.
  const quizLevels = [
    { key: "easy", label: "łatwy", emoji: "🟢" },
    { key: "hard", label: "trudny", emoji: "🟡" },
    { key: "expert", label: "ekspert", emoji: "🔴" },
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
              ? "zacznij dziś serię!"
              : streak === 1
              ? "dzień z rzędu"
              : streak < 5
              ? "dni z rzędu"
              : "dni z rzędu — świetnie!"}
          </span>
        </div>
      </div>

      <div className="stats-cards">
        <div className="stats-card">
          <span className="stats-card-num">{best}</span>
          <span className="stats-card-label">najdłuższa seria</span>
        </div>
        <div className="stats-card">
          <span className="stats-card-num">{daysStudied}</span>
          <span className="stats-card-label">dni nauki</span>
        </div>
        <div className="stats-card">
          <span className="stats-card-num">{totalAnswers}</span>
          <span className="stats-card-label">odpowiedzi</span>
        </div>
      </div>

      <h3 className="modal-section-title stats-h">Ostatnie 14 dni</h3>
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

      <h3 className="modal-section-title stats-h">Quiz wg poziomu trudności</h3>
      {quizTotal === 0 ? (
        <p className="stats-empty-note">Rozwiąż quiz, aby zobaczyć wyniki wg poziomu.</p>
      ) : (
        <ul className="stats-cat-list">
          {quizLevels.map((l) => (
            <li className="stats-cat" key={l.key}>
              <div className="stats-cat-head">
                <span className="stats-cat-label">
                  {l.emoji} {l.label}
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

      <h3 className="modal-section-title stats-h">Przerobione fiszki</h3>
      <div className="stats-known-row">
        <div className="stats-known-card stats-known-green">
          <span className="stats-known-num">{knownWords}</span>
          <span className="stats-known-label">🟢 wiem</span>
        </div>
        <div className="stats-known-card stats-known-orange">
          <span className="stats-known-num">{reviewWords}</span>
          <span className="stats-known-label">🟠 do powtórki</span>
        </div>
        <div className="stats-known-card stats-known-red">
          <span className="stats-known-num">{unknownWords}</span>
          <span className="stats-known-label">🔴 nie wiem</span>
        </div>
      </div>
      <div className="stats-cat">
        <div className="stats-cat-head">
          <span className="stats-cat-label">Opanowane („wiem")</span>
          <span className="stats-cat-count">
            {knownWords}/{words.length} · {knownPct}%
          </span>
        </div>
        <div className="stats-cat-track">
          <div className="stats-cat-fill" style={{ width: `${knownPct}%`, background: "#2e7d52" }} />
        </div>
      </div>

      <h3 className="modal-section-title stats-h">Postęp w kategoriach</h3>
      <ul className="stats-cat-list">
        {catStats.map((c) => (
          <li className="stats-cat" key={c.key}>
            <div className="stats-cat-head">
              <span className="stats-cat-label">
                {c.emoji} {c.label}
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

      <h3 className="modal-section-title stats-h stats-backup-h">Kopia zapasowa</h3>
      <p className="storage-diag">{storageDiagnostic()}</p>
      {!storageWorks() && (
        <p className="storage-warning">
          ⚠️ Ta przeglądarka nie zapisuje danych trwale — postęp może znikać po
          odświeżeniu. Zapisuj kopię regularnie, albo wystaw aplikację na własny
          hosting (wtedy postęp jest trwały).
        </p>
      )}
      <p className="stats-backup-note">
        Postęp i Twoje własne/edytowane fiszki są zapisywane w pamięci przeglądarki
        (osobno na każdym urządzeniu — komputer i telefon się nie synchronizują).
        „Zapisz kopię" zabezpiecza wszystko do pliku/schowka — na drugim urządzeniu
        użyj „wklej kopię", żeby przenieść postęp i fiszki.
      </p>
      <div className="stats-backup-row">
        <button className="nav-btn nav-btn-primary stats-backup-btn" onClick={onExport}>
          <Upload size={15} /> zapisz kopię
        </button>
        <button className="nav-btn stats-backup-btn stats-backup-import" onClick={onPasteImport}>
          wklej kopię
        </button>
      </div>
      <div className="stats-backup-row stats-backup-row2">
        <label className="nav-btn stats-backup-btn stats-backup-import stats-backup-file">
          wczytaj z pliku
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
  // Kandydaci: krótkie, jednoznaczne słówka (bez długich zwrotów i zdań).
  const pool = useMemo(
    () =>
      words.filter(
        (w) =>
          w.pl && w.ar && w.pl.length <= 24 && !w.pl.includes("?") && !w.ar.includes(" ")
      ),
    [words]
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
    return <EmptyState text="Za mało krótkich słówek do gry w pary." />;
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

      <p className="verbs-intro match-intro">
        Połącz polskie słowo z arabskim — stuknij jedno, potem drugie. Czas leci
        od pierwszego kliknięcia.
      </p>

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
                {p.pl}
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
        <Shuffle size={15} /> nowe słowa
      </button>
    </div>
  );
}

// ---------- Widok: Pisanie (układanie słowa z liter arabskich) ----------
// Znaki łączące w arabskim zmieniają kształt zależnie od pozycji, więc pojedyncze
// klocki pokazują formę izolowaną, a ułożone słowo renderujemy normalnie (z połączeniami).
const HARAKAT_RE = /[\u064B-\u0652\u0670]/; // diakrytyki, których nie chcemy rozbijać na klocki

function WriteView({ words }) {
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
    return <EmptyState text="Brak odpowiednich słów do ćwiczenia pisania (potrzebne słowa 3–7 liter bez znaków spacji)." />;
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
      <p className="verbs-intro write-intro">
        Ułóż słowo po arabsku, stukając litery w dobrej kolejności. Pamiętaj: pismo
        arabskie czyta się <strong>od prawej do lewej</strong>. Podpowiedź to polskie
        znaczenie i zapis fonetyczny.
      </p>

      <div className="write-prompt">
        <span className="write-pl">{word.pl}</span>
        <span className="write-ph">{word.ph}</span>
      </div>

      {/* Pole odpowiedzi (RTL) */}
      <div
        className={`write-answer ${checked ? (isCorrect ? "write-answer-ok" : "write-answer-bad") : ""} ${
          revealed ? "write-answer-reveal" : ""
        }`}
        onClick={removeLast}
        title="Stuknij, aby cofnąć ostatnią literę"
      >
        {placed.length === 0 ? (
          <span className="write-placeholder">tu pojawi się słowo…</span>
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
            <>✓ Dobrze! <span className="write-fb-word">{correctStr}</span></>
          ) : (
            <>Niezupełnie. Poprawnie: <span className="write-fb-word">{correctStr}</span></>
          )}
        </div>
      )}
      {revealed && (
        <div className="write-feedback write-fb-reveal">
          Poprawna kolejność: <span className="write-fb-word">{correctStr}</span>
        </div>
      )}

      {/* Przyciski */}
      <div className="write-actions">
        {!checked && !revealed && (
          <>
            <button className="nav-btn" onClick={clearAnswer} disabled={placed.length === 0}>
              wyczyść
            </button>
            <button className="nav-btn" onClick={reveal}>
              pokaż
            </button>
            <button
              className="nav-btn nav-btn-primary"
              onClick={check}
              disabled={!isFull}
            >
              sprawdź
            </button>
          </>
        )}
        {(checked || revealed) && (
          <>
            {checked && !isCorrect && (
              <button className="nav-btn" onClick={() => { setPlaced([]); setChecked(false); }}>
                spróbuj ponownie
              </button>
            )}
            <button className="nav-btn nav-btn-primary" onClick={nextWord}>
              następne słowo →
            </button>
          </>
        )}
      </div>
    </div>
  );
}

// ---------- Widok: Lekcje (dialog + ćwiczenia na jego słownictwie) ----------
function LessonsView({ words, onToggleFlag, onToggleVerified, onSetKnown, onSaveExample, onEditCard, onAnswer }) {
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
        <p className="verbs-intro">
          Każda lekcja to dialog i zestaw ćwiczeń na jego słownictwie. Najpierw
          przeczytaj rozmowę, potem utrwal te same słowa na kilka sposobów.
        </p>
        <div className="lesson-list">
          {lessons.map((l, i) => (
            <button key={i} className="lesson-card" onClick={() => setLessonIdx(i)}>
              <span className="lesson-emoji">{l.dialogue.emoji}</span>
              <span className="lesson-info">
                <span className="lesson-title">{l.dialogue.title}</span>
                <span className="lesson-meta">
                  {l.dialogue.lines.length} kwestii · {l.lexicon.length} słówek
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
          ← {lesson.dialogue.title}
        </button>
        {body}
      </div>
    );
  }

  // Ekran lekcji: dialog + kafelki ćwiczeń
  const tiles = [
    { key: "flash", label: "Fiszki", emoji: "🎴", count: lex.length, min: 1 },
    { key: "quiz", label: "Quiz", emoji: "❓", count: lex.length, min: 4 },
    { key: "match", label: "Pary", emoji: "🔀", count: lex.length, min: 6 },
    { key: "write", label: "Pisanie", emoji: "✍️", count: lex.length, min: 1 },
    { key: "sentences", label: "Zdania", emoji: "🧩", count: lesson.sentences.length, min: 1 },
  ];

  return (
    <div className="view-lessons">
      <button className="lesson-back" onClick={() => setLessonIdx(null)}>
        ← wszystkie lekcje
      </button>

      <div className="lesson-head">
        <span className="lesson-head-emoji">{lesson.dialogue.emoji}</span>
        <h2 className="lesson-head-title">{lesson.dialogue.title}</h2>
        <p className="lesson-head-context">{lesson.dialogue.context}</p>
      </div>

      {/* Dialog */}
      <LessonDialogue dialogue={lesson.dialogue} />

      {/* Kafelki ćwiczeń */}
      <h3 className="lesson-section-title">Ćwiczenia na tym słownictwie</h3>
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
              <span className="lesson-tile-label">{t.label}</span>
              <span className="lesson-tile-count">
                {enough ? `${t.count}` : "za mało"}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// Dialog wewnątrz lekcji, z możliwością ukrycia tłumaczeń.
function LessonDialogue({ dialogue }) {
  const [hideTranslation, setHideTranslation] = useState(false);
  const [hidePh, setHidePh] = useState(false);
  return (
    <div className="lesson-dialogue">
      <div className="lesson-dialogue-bar">
        <span className="lesson-dialogue-label">Dialog</span>
        <div className="dlg-toggles">
          <button className="lesson-hide-btn" onClick={() => setHidePh((v) => !v)}>
            {hidePh ? "pokaż transkrypcję" : "ukryj transkrypcję"}
          </button>
          <button className="lesson-hide-btn" onClick={() => setHideTranslation((v) => !v)}>
            {hideTranslation ? "pokaż tłumaczenie" : "ukryj tłumaczenie"}
          </button>
        </div>
      </div>
      {dialogue.lines.map((line, i) => (
        <div key={i} className={`dlg-line ${line.s === "a" ? "dlg-a" : "dlg-b"}`}>
          <div className="dlg-bubble">
            <span className="dlg-ar">{line.ar}</span>
            {!hidePh && <span className="dlg-ph">{line.ph}</span>}
            {!hideTranslation && <span className="dlg-pl">{line.pl}</span>}
          </div>
        </div>
      ))}
    </div>
  );
}

// Zdania z układanki przypisane do lekcji — prosty player (jedno zdanie naraz).
function LessonSentences({ sentences }) {
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
    return <EmptyState text="Brak pasujących zdań do tego dialogu." />;
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
      <p className="sentence-pl">{drill.pl}</p>

      <div className="sentence-answer" onClick={undo}>
        {placed.length === 0 ? (
          <span className="sentence-placeholder">ułóż zdanie (od lewej: pierwsze słowo zdania)…</span>
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

      {isCorrect && <div className="sentence-fb sentence-fb-ok">✓ Dobrze!</div>}
      {revealed && !isCorrect && (
        <div className="sentence-fb sentence-fb-reveal">Poprawna kolejność powyżej.</div>
      )}
      {drill.note && solved && <p className="sentence-note">{drill.note}</p>}

      <div className="sentence-actions">
        {!solved && (
          <button className="nav-btn" onClick={reveal}>pokaż</button>
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
  const [idx, setIdx] = useState(null);
  const [hidePl, setHidePl] = useState(false);
  const [hidePh, setHidePh] = useState(false);
  const [answers, setAnswers] = useState({}); // {questionIndex: chosenOption}
  const [showResults, setShowResults] = useState(false);

  // Lista czytanek
  if (idx === null) {
    return (
      <div className="view-readings">
        <p className="verbs-intro">
          Dłuższe teksty do czytania ze zrozumieniem. Każdy używa innego czasu
          (teraźniejszy, przeszły, przyszły albo mieszany) — po tekście czekają
          pytania, żeby sprawdzić, ile rozumiesz.
        </p>
        <div className="reading-list">
          {READINGS.map((r, i) => (
            <button key={i} className="reading-card" onClick={() => setIdx(i)}>
              <span className="reading-emoji">{r.emoji}</span>
              <span className="reading-info">
                <span className="reading-title">{r.title}</span>
                <span className="reading-meta">
                  {r.sentences.length} zdań · {r.level}
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
    setHidePl(false);
    setHidePh(false);
  }

  return (
    <div className="view-readings">
      <button className="lesson-back" onClick={back}>
        ← wszystkie czytanki
      </button>

      <div className="reading-head">
        <span className="reading-head-emoji">{r.emoji}</span>
        <h2 className="reading-head-title">{r.title}</h2>
        <p className="reading-head-context">{r.context}</p>
      </div>

      <div className="reading-tense-note">🕐 {r.tenseNote}</div>

      <div className="reading-toggles">
        <button
          className={`status-filter-btn ${hidePh ? "status-filter-active" : ""}`}
          onClick={() => setHidePh((v) => !v)}
        >
          {hidePh ? "pokaż transkrypcję" : "ukryj transkrypcję"}
        </button>
        <button
          className={`status-filter-btn ${hidePl ? "status-filter-active" : ""}`}
          onClick={() => setHidePl((v) => !v)}
        >
          {hidePl ? "pokaż tłumaczenie" : "ukryj tłumaczenie"}
        </button>
      </div>

      <div className="reading-text">
        {r.sentences.map((s, i) => (
          <div key={i} className="reading-sentence">
            <span className="reading-ar">{s.ar}</span>
            {!hidePh && <span className="reading-ph">{s.ph}</span>}
            {!hidePl && <span className="reading-pl">{s.pl}</span>}
          </div>
        ))}
      </div>

      <h3 className="reading-q-title">Pytania na rozumienie</h3>
      <div className="reading-questions">
        {r.questions.map((q, qi) => (
          <div key={qi} className="reading-question">
            <p className="reading-q-text">{q.q}</p>
            <div className="reading-options">
              {q.options.map((opt, oi) => {
                const chosen = answers[qi] === oi;
                let cls = "reading-option";
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
        ))}
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
function MsaView() {
  const [group, setGroup] = useState("same"); // same | pronunciation | different

  const groups = [
    { key: "same", label: "Identyczne", emoji: "🟢" },
    { key: "pronunciation", label: "Inna wymowa", emoji: "🟡" },
    { key: "different", label: "Inne słowo", emoji: "🔴" },
  ];

  return (
    <div className="view-msa">
      <p className="verbs-intro">
        Egipski (3aamiya) i arabski literacki (fuS7a / MSA) to dwie odmiany tego samego
        języka. Część słów jest identyczna, część pisze się tak samo, ale czyta inaczej,
        a część to zupełnie inne wyrazy. Poznanie różnic pomaga czytać i rozumieć oba.
      </p>

      <div className="msa-rules">
        <strong>Główne reguły wymowy:</strong> ج to w MSA „j”, a po egipsku „g”
        (jamiil → gamiil). ق to w MSA „q”, a po egipsku hamza (qalb → 2alb). ث „th” → „t”
        (thalatha → talaata). ذ „dh” → „d” (dhahab → dahab).
      </div>

      <div className="msa-tabs">
        {groups.map((g) => (
          <button
            key={g.key}
            className={`msa-tab ${group === g.key ? "msa-tab-active" : ""}`}
            onClick={() => setGroup(g.key)}
          >
            <span className="msa-tab-emoji">{g.emoji}</span>
            {g.label}
          </button>
        ))}
      </div>

      {group === "same" && (
        <div className="msa-list">
          <p className="msa-group-hint">Te same słowa w obu odmianach — bezpieczne wszędzie.</p>
          {MSA_COMPARISON.same.map((w, i) => (
            <div key={i} className="msa-row">
              <div className="msa-row-pl">{w.pl}</div>
              <div className="msa-pair">
                <div className="msa-variant">
                  <span className="msa-badge msa-badge-eg">egipski</span>
                  <span className="msa-ar">{w.eg.ar}</span>
                  <span className="msa-ph">{w.eg.ph}</span>
                </div>
                <div className="msa-variant">
                  <span className="msa-badge msa-badge-msa">MSA</span>
                  <span className="msa-ar">{w.msa.ar}</span>
                  <span className="msa-ph">{w.msa.ph}</span>
                </div>
              </div>
              {w.note && <p className="msa-note">{w.note}</p>}
            </div>
          ))}
        </div>
      )}

      {group === "pronunciation" && (
        <div className="msa-list">
          <p className="msa-group-hint">
            Pisownia arabska ta sama — różni się tylko wymowa. Świetne do nauki reguł ج/ق/ث/ذ.
          </p>
          {MSA_COMPARISON.pronunciation.map((w, i) => (
            <div key={i} className="msa-row">
              <div className="msa-row-head">
                <span className="msa-row-pl">{w.pl}</span>
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
          <p className="msa-group-hint">
            Zupełnie różne wyrazy — jeśli powiesz wersję MSA, Egipcjanin zrozumie, ale
            zabrzmi to książkowo.
          </p>
          {MSA_COMPARISON.different.map((w, i) => (
            <div key={i} className="msa-row">
              <div className="msa-row-pl">{w.pl}</div>
              <div className="msa-pair">
                <div className="msa-variant">
                  <span className="msa-badge msa-badge-eg">egipski</span>
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

// ---------- Motywy i czcionki (ustawienia wyglądu) ----------
// Motyw = zestaw zmiennych CSS nakładanych na :root. Domyślny = "morski".
const THEMES = {
  morski: {
    label: "Morski + bursztyn",
    emoji: "🟢",
    vars: {
      "--sand": "#eceee7", "--sand-deep": "#d8dcd0", "--ink": "#1a2420",
      "--teal": "#1d5c52", "--teal-deep": "#123f38",
      "--terracotta": "#a66a24", "--terracotta-soft": "#e0c088", "--paper": "#ffffff",
      "--muted": "#6c766e", "--muted-soft": "#909a92", "--hairline": "rgba(0,0,0,0.06)",
    },
  },
  szalwia: {
    label: "Szałwia + glina",
    emoji: "🌿",
    vars: {
      "--sand": "#eef0ea", "--sand-deep": "#dbe0d5", "--ink": "#1c241e",
      "--teal": "#5b7159", "--teal-deep": "#38473a",
      "--terracotta": "#a5542f", "--terracotta-soft": "#e0a878", "--paper": "#fcfdfb",
      "--muted": "#6c766e", "--muted-soft": "#909a92", "--hairline": "rgba(0,0,0,0.06)",
    },
  },
  zmierzch: {
    label: "Zmierzch (śliwka + miedź)",
    emoji: "🟤",
    vars: {
      "--sand": "#f3ede4", "--sand-deep": "#e2d5c4", "--ink": "#2a1c18",
      "--teal": "#7c3a2d", "--teal-deep": "#4a1f1a",
      "--terracotta": "#b3742a", "--terracotta-soft": "#e8b878", "--paper": "#fffaf3",
      "--muted": "#7a6a60", "--muted-soft": "#a2928a", "--hairline": "rgba(0,0,0,0.06)",
    },
  },
  lazur: {
    label: "Lazur (błękit + piasek)",
    emoji: "🔵",
    vars: {
      "--sand": "#eaeef2", "--sand-deep": "#d3dce3", "--ink": "#16232c",
      "--teal": "#1a5a7a", "--teal-deep": "#0f3a52",
      "--terracotta": "#b57829", "--terracotta-soft": "#f0c078", "--paper": "#fdfdfd",
      "--muted": "#5e6e78", "--muted-soft": "#8a99a2", "--hairline": "rgba(0,0,0,0.06)",
    },
  },
  nocny: {
    label: "Nocny (ciemny)",
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
  systemowa: { label: "Systemowa (jak wcześniej)", stack: "system-ui, 'Segoe UI', 'Geeza Pro', 'Noto Sans Arabic', sans-serif" },
  amiri: { label: "Amiri (klasyczny naskh)", stack: "'Amiri', 'Georgia', serif" },
  cairo: { label: "Cairo (nowoczesny)", stack: "'Cairo', system-ui, sans-serif" },
  noto: { label: "Noto Naskh (czysty)", stack: "'Noto Naskh Arabic', serif" },
  scheherazade: { label: "Scheherazade (dekoracyjny)", stack: "'Scheherazade New', serif" },
  tajawal: { label: "Tajawal (geometryczny)", stack: "'Tajawal', system-ui, sans-serif" },
};

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
export default function App() {
  const [words, setWords] = useState(loadWords);
  const [tab, setTab] = useState("flash");
  const [activeCat, setActiveCat] = useState("all");
  const [stats, setStats] = useState(loadStats);
  // null = modal zamknięty, "new" = dodawanie nowej fiszki, obiekt słówka = edycja istniejącej
  const [editingCard, setEditingCard] = useState(null);
  // Tekst kopii do ręcznego skopiowania (gdy pobranie pliku jest zablokowane w ramce)
  const [backupText, setBackupText] = useState(null);
  // Wygląd: motyw kolorów + czcionka arabska (zapisywane osobno, nie ruszają postępu).
  const [appearance, setAppearance] = useState(loadAppearance);
  const [showSettings, setShowSettings] = useState(false);

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
  }, [words, activeCat]);

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
        if (isCorrect) {
          return { ...w, correctCount: (w.correctCount || 0) + 1 };
        }
        return { ...w, wrongCount: (w.wrongCount || 0) + 1 };
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
      setWords((ws) => ws.map((w) => (w === editingCard ? card : w)));
    } else {
      setWords((ws) => [...ws, card]);
    }
  }

  function deleteCard() {
    if (editingCard && editingCard !== "new") {
      setWords((ws) => ws.filter((w) => w !== editingCard));
    }
  }

  const showCategoryPicker = tab === "flash" || tab === "quiz" || tab === "list";
  const showAddButton = tab === "flash" || tab === "list";

  return (
    <div className="app-root">
      <style>{CSS}</style>
      <style>{appearanceCSS(appearance)}</style>

      <header className="app-header">
        <div className="header-glyph" aria-hidden="true">
          ع
        </div>
        <div className="header-text">
          <h1>3aamiya</h1>
          <p>słownictwo egipskiego arabskiego</p>
        </div>
        <button
          className="settings-btn"
          onClick={() => setShowSettings(true)}
          title="Wygląd: kolory i czcionka"
          aria-label="Ustawienia wyglądu"
        >
          <Palette size={18} />
        </button>
        {showAddButton && (
          <button className="add-card-btn" onClick={() => setEditingCard("new")}>
            <Plus size={16} />
            dodaj fiszkę
          </button>
        )}
      </header>

      <nav className="tab-bar">
        {[
          { key: "lessons", label: "lekcje", Icon: GraduationCap },
          { key: "flash", label: "fiszki", Icon: BookOpen },
          { key: "quiz", label: "quiz", Icon: ListChecks },
          { key: "verbs", label: "czasowniki", Icon: RotateCw },
          { key: "nouns", label: "rzeczowniki", Icon: Hash },
          { key: "questions", label: "zaimki", Icon: HelpCircle },
          { key: "grammar", label: "gramatyka", Icon: Puzzle },
          { key: "sentences", label: "zdania", Icon: MessageSquare },
          { key: "gaps", label: "luki", Icon: PenLine },
          { key: "match", label: "pary", Icon: Shuffle },
          { key: "write", label: "pisanie", Icon: Pencil },
          { key: "dialogues", label: "dialogi", Icon: MessagesSquare },
          { key: "readings", label: "czytanki", Icon: BookOpen },
          { key: "msa", label: "egipski/MSA", Icon: BookOpen },
          { key: "stats", label: "statystyki", Icon: TrendingUp },
          { key: "list", label: "lista", Icon: List },
        ].map(({ key, label, Icon }) => (
          <button
            key={key}
            className={`tab-btn ${tab === key ? "tab-active" : ""}`}
            onClick={() => setTab(key)}
          >
            <Icon size={16} />
            {label}
          </button>
        ))}
      </nav>

      <div className="progress-panel">
        <div className="progress-panel-head">
          <span className="progress-panel-label">przerobiony materiał</span>
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
            przerobione
          </span>
          <span className="legend-item">
            <span className="legend-dot legend-dot-mastered" />
            opanowane {progress.mastered} ({progress.masteredPct}%)
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
            <h3 className="modal-title">Kopia postępu</h3>
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
            <h3 className="modal-title">Wygląd</h3>

            <p className="settings-group-label">Kolory</p>
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
                  <span className="theme-name">{t.label}</span>
                  {appearance.theme === key && <Check size={15} className="theme-check" />}
                </button>
              ))}
            </div>

            <p className="settings-group-label">Czcionka arabska</p>
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
                  <span className="font-choice-name">{f.label}</span>
                  {appearance.font === key && <Check size={15} className="theme-check" />}
                </button>
              ))}
            </div>

            <div className="settings-actions">
              <button
                className="nav-btn"
                onClick={() => setAppearance({ theme: "morski", font: "noto" })}
              >
                przywróć domyślne
              </button>
              <button className="nav-btn nav-btn-primary" onClick={() => setShowSettings(false)}>
                gotowe
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ---------- Wybór działu / tematu lekcji ----------
function CategoryPicker({ categories, activeCat, setActiveCat, totalCount, flaggedCount, verifiedCount, reviewCount, knownCount, unknownCount, toReviewCount }) {
  // Etykieta aktywnej kategorii do dropdownu (obsługuje też pseudo-kategorie).
  const special = {
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
        aria-label="Wybierz kategorię"
      >
        <option value="all">{special.all}</option>
        <optgroup label="── Moja samoocena ──">
          <option value="known">{special.known}</option>
          <option value="unknown">{special.unknown}</option>
          <option value="toreview">{special.toreview}</option>
        </optgroup>
        <optgroup label="── Do przeglądu ──">
          {reviewCount > 0 && <option value="review">{special.review}</option>}
          {flaggedCount > 0 && <option value="flagged">{special.flagged}</option>}
          {verifiedCount > 0 && <option value="verified">{special.verified}</option>}
        </optgroup>
        <optgroup label="── Działy ──">
          {categories.map((c) => (
            <option key={c.key} value={c.key}>
              {c.emoji} {c.label}
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
  justify-content: center;
  gap: 3px;
  border: none;
  background: transparent;
  padding: 8px 4px;
  border-radius: 10px;
  font-size: 10.5px;
  font-weight: 600;
  color: var(--muted);
  cursor: pointer;
  transition: background 0.18s, color 0.18s;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.tab-btn.tab-active {
  background: var(--teal);
  color: var(--paper);
}

.app-main {
  max-width: 480px;
  width: 100%;
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
  height: 400px;
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
  overflow: hidden;
}

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

@media (max-width: 380px) {
  .add-form { grid-template-columns: 1fr; }
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
}

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
