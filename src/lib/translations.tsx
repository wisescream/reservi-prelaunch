import React, { createContext, useContext, useState, useEffect } from "react";

export type Language = "en" | "fr" | "ar";

interface TranslationContextType {
  lang: Language;
  setLang: (l: Language) => void;
  t: (key: string) => string;
  dir: "ltr" | "rtl";
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    features: "Features",
    restaurants: "Restaurants",
    about: "About",
    contact: "Contact",
    waitlist: "Waitlist",
    partner: "Partner",
    join_waitlist: "Join waitlist",
    hero_title: "Book the best tables in seconds.",
    hero_desc: "Reservi reimagines reservations for the way you actually dine.",
    launching_soon: "Launching soon in Casablanca",
    get_in_touch: "Get in touch",
    email: "Email",
    phone: "Phone",
    address: "Address",
    follow_us: "Follow us",
    copyright: "All rights reserved.",
    for_restaurants: "For Restaurants",
    partner_us: "Partner With Us",
    product: "Product",
    company: "Company",
    hungry_yet: "Hungry yet?",
    hungry_desc: "Join the waitlist and book your first table.",
    name_placeholder: "Full Name",
    email_placeholder: "Email Address",
    message_placeholder: "Message",
    send_message: "Send Message",
    success_message: "Message Sent!",
    be_first_to_know: "Be the first to know",
    early_access_desc: "Get early access when we launch in your city."
  },
  fr: {
    features: "Fonctionnalités",
    restaurants: "Restaurants",
    about: "À propos",
    contact: "Contact",
    waitlist: "Liste d'attente",
    partner: "Partenaires",
    join_waitlist: "Rejoindre",
    hero_title: "Réservez les meilleures tables en quelques secondes.",
    hero_desc: "Reservi réinvente les réservations selon votre façon de dîner.",
    launching_soon: "Lancement bientôt à Casablanca",
    get_in_touch: "Contactez-nous",
    email: "E-mail",
    phone: "Téléphone",
    address: "Adresse",
    follow_us: "Suivez-nous",
    copyright: "Tous droits réservés.",
    for_restaurants: "Pour les Restaurants",
    partner_us: "Devenir Partenaire",
    product: "Produit",
    company: "Entreprise",
    hungry_yet: "Vous avez faim?",
    hungry_desc: "Rejoignez la liste d'attente et réservez votre table.",
    name_placeholder: "Nom complet",
    email_placeholder: "Adresse e-mail",
    message_placeholder: "Message",
    send_message: "Envoyer le Message",
    success_message: "Message Envoyé!",
    be_first_to_know: "Soyez le premier à savoir",
    early_access_desc: "Bénéficiez d'un accès anticipé lors de notre lancement dans votre ville."
  },
  ar: {
    features: "المميزات",
    restaurants: "المطاعم",
    about: "حول",
    contact: "اتصل بنا",
    waitlist: "قائمة الانتظار",
    partner: "الشراكة",
    join_waitlist: "انضم الآن",
    hero_title: "احجز أفضل الطاولات في ثوانٍ معدودة.",
    hero_desc: "رِزيرڤي يعيد تصور الحجوزات لتناسب طريقتك في تناول الطعام.",
    launching_soon: "قريباً في الدار البيضاء",
    get_in_touch: "تواصل معنا",
    email: "البريد الإلكتروني",
    phone: "الهاتف",
    address: "العنوان",
    follow_us: "تابعنا",
    copyright: "جميع الحقوق محفوظة.",
    for_restaurants: "للمطاعم",
    partner_us: "كن شريكاً",
    product: "المنتج",
    company: "الشركة",
    hungry_yet: "هل أنت جائع؟",
    hungry_desc: "انضم لقائمة الانتظار واحجز طاولتك الأولى.",
    name_placeholder: "الاسم الكامل",
    email_placeholder: "البريد الإلكتروني",
    message_placeholder: "الرسالة",
    send_message: "إرسال الرسالة",
    success_message: "تم الإرسال بنجاح!",
    be_first_to_know: "كن أول من يعلم",
    early_access_desc: "احصل على وصول مبكر عندما ننطلق في مدينتك."
  }
};

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

export const TranslationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLang] = useState<Language>(() => {
    const saved = localStorage.getItem("reservi-lang");
    if (saved === "en" || saved === "fr" || saved === "ar") return saved;
    return "en";
  });

  useEffect(() => {
    localStorage.setItem("reservi-lang", lang);
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = lang;
  }, [lang]);

  const t = (key: string) => {
    return translations[lang][key] || translations["en"][key] || key;
  };

  const dir = lang === "ar" ? "rtl" : "ltr";

  return (
    <TranslationContext.Provider value={{ lang, setLang, t, dir }}>
      {children}
    </TranslationContext.Provider>
  );
};

export const useTranslation = () => {
  const context = useContext(TranslationContext);
  if (!context) throw new Error("useTranslation must be used within TranslationProvider");
  return context;
};
