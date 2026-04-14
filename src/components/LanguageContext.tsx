import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type LanguageCode = 'pl' | 'de' | 'en';

type TranslationTree = typeof translations;
type TranslationSet = TranslationTree[LanguageCode];

type LanguageContextValue = {
  language: LanguageCode;
  setLanguageCode: (code: LanguageCode) => void;
  cycleLanguage: () => void;
  t: TranslationSet;
};

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

export const translations = {
  pl: {
    nav: {
      home: 'Start',
      services: 'Usługi',
      about: 'O nas',
      contact: 'Kontakt'
    },
    hero: {
      title: 'POWER TECH',
      subtitle: 'Instalacje elektryczne, słaboprądowe i serwerowe dla obiektów przemysłowych, mieszkalnych i komercyjnych',
      description: 'Wykonujemy kompleksowe instalacje elektryczne, słaboprądowe oraz prace w serwerowniach dla obiektów przemysłowych, komercyjnych i mieszkalnych. Mamy doświadczenie w realizacjach na terenie całej Europy, w tym również w Irlandii.',
      cta: 'Skontaktuj się z nami'
    },
    services: {
      title: 'Nasze Usługi',
      subtitle: 'Kompleksowe rozwiązania elektryczne dostosowane do Twoich potrzeb',
      items: [
        {
          title: 'Prowadzenie kabli',
          description: 'Profesjonalne prowadzenie kabli zgodnie z normami i standardami przemysłowymi.'
        },
        {
          title: 'Zakończenia',
          description: 'Precyzyjne wykonanie zakończeń kabli z zastosowaniem najwyższej jakości materiałów.'
        },
        {
          title: 'Okablowanie strukturalne i słaboprądowe',
          description: 'Systemy LAN, światłowodowe i słaboprądowe zapewniające niezawodną komunikację w firmie i budynku.'
        },
        {
          title: 'Połączenia szaf, racków i serwerowni',
          description: 'Organizacja i połączenia infrastruktury serwerowej, rackowej oraz telekomunikacyjnej.'
        },
        {
          title: 'Etykietowanie',
          description: 'Profesjonalne oznakowanie instalacji dla łatwego zarządzania i konserwacji.'
        },
        {
          title: 'Testowanie i dokumentacja',
          description: 'Kompleksowe testy instalacji z pełną dokumentacją techniczną projektu.'
        }
      ]
    },
    about: {
      title: 'O POWER TECH',
      subtitle: 'Twój partner w profesjonalnych instalacjach elektrycznych',
      content: [
        'POWER TECH Sp. z o.o. specjalizuje się w projektowaniu i wykonywaniu instalacji elektrycznych, słaboprądowych oraz prac w serwerowniach dla obiektów przemysłowych, komercyjnych oraz mieszkalnych. Dzięki wieloletniemu doświadczeniu realizujemy prace solidnie i terminowo na terenie całej Europy, w tym również w Irlandii.',
        'Nasz zespół wykwalifikowanych inżynierów i techników realizuje projekty od instalacji w budynkach mieszkalnych i biurowych po rozbudowane systemy dla dużych obiektów przemysłowych, hal, serwerowni i infrastruktury teletechnicznej. Zapewniamy bezpieczeństwo, porządek na budowie i zgodność z obowiązującymi normami.',
        'Stawiamy na nowoczesne technologie, profesjonalizm i długoterminowe partnerstwo z naszymi klientami.'
      ]
    },
    contact: {
      title: 'Kontakt',
      subtitle: 'Skontaktuj się z nami - jesteśmy gotowi na nowe wyzwania',
      info: {
        addressTitle: 'Informacje kontaktowe',
        address: 'Adres',
        phone: 'Telefon',
        email: 'E-mail'
      },
      form: {
        title: 'Wyślij wiadomość',
        hint: 'Opisz zakres prac, lokalizację i termin. Przygotujemy kontakt zwrotny dopasowany do wlasciwego zespolu i etapu realizacji.',
        name: 'Imię i nazwisko',
        namePlaceholder: 'Jan Kowalski',
        email: 'Adres e-mail',
        emailPlaceholder: 'jan.kowalski@powertech.net.pl',
        message: 'Wiadomość',
        messagePlaceholder: 'Opisz swój projekt lub zapytanie...',
        send: 'Wyślij wiadomość',
        sending: 'Wysyłanie...',
        success: 'Dziękujemy! Wiadomość została wysłana.',
        successDesc: 'Odpowiemy najszybciej jak to możliwe.',
        error: 'Wystąpił błąd. Spróbuj ponownie.'
      }
    },
    footer: {
      tagline: 'Profesjonalne instalacje elektryczne',
      rights: 'Wszelkie prawa zastrzeżone.',
      sections: 'Sekcje'
    }
  },
  de: {
    nav: {
      home: 'Startseite',
      services: 'Dienstleistungen',
      about: 'Über uns',
      contact: 'Kontakt'
    },
    hero: {
      title: 'POWER TECH',
      subtitle: 'Elektro-, Schwachstrom- und Serverinstallationen für Industrie-, Wohn- und Gewerbeobjekte',
      description: 'Wir realisieren umfassende Elektroinstallationen, Schwachstromsysteme und Arbeiten in Serverräumen für Industrie-, Gewerbe- und Wohnobjekte. Wir verfügen über Erfahrung bei Projekten in ganz Europa, einschließlich Irland.',
      cta: 'Kontaktieren Sie uns'
    },
    services: {
      title: 'Unsere Dienstleistungen',
      subtitle: 'Umfassende elektrische Lösungen für Ihre Bedürfnisse',
      items: [
        {
          title: 'Kabelführung',
          description: 'Professionelle Kabelverlegung gemäß industriellen Normen und Standards.'
        },
        {
          title: 'Abschlüsse',
          description: 'Präzise Kabelabschlüsse mit Materialien höchster Qualität.'
        },
        {
          title: 'Strukturierte Verkabelung und Schwachstrom',
          description: 'LAN-, Glasfaser- und Schwachstromsysteme für zuverlässige Kommunikation im Unternehmen und Gebäude.'
        },
        {
          title: 'Schrank-, Rack- und Serverraumverbindungen',
          description: 'Organisation und Verbindung von Server-, Rack- und Telekommunikationsinfrastruktur.'
        },
        {
          title: 'Etikettierung',
          description: 'Professionelle Kennzeichnung von Installationen für einfache Verwaltung und Wartung.'
        },
        {
          title: 'Prüfung und Dokumentation',
          description: 'Umfassende Installationstests mit vollständiger technischer Projektdokumentation.'
        }
      ]
    },
    about: {
      title: 'Über POWER TECH',
      subtitle: 'Ihr Partner für professionelle Elektroinstallationen',
      content: [
        'POWER TECH Sp. z o.o. ist auf die Planung und Ausführung von Elektroinstallationen, Schwachstromsystemen und Arbeiten in Serverräumen für Industrie-, Gewerbe- und Wohnobjekte spezialisiert. Mit langjähriger Erfahrung liefern wir saubere und termingerechte Ausführung in ganz Europa, einschließlich Irland.',
        'Unser Team aus qualifizierten Ingenieuren und Technikern realisiert Projekte von Wohn- und Büroinstallationen bis hin zu umfangreichen Systemen für große Industrieobjekte, Hallen, Serverräume und teletechnische Infrastruktur. Wir gewährleisten Sicherheit, Ordnung auf der Baustelle und die Einhaltung aller Normen.',
        'Wir setzen auf moderne Technologien, Professionalität und langfristige Partnerschaften mit unseren Kunden.'
      ]
    },
    contact: {
      title: 'Kontakt',
      subtitle: 'Kontaktieren Sie uns - wir sind bereit für neue Herausforderungen',
      info: {
        addressTitle: 'Kontaktinformationen',
        address: 'Adresse',
        phone: 'Telefon',
        email: 'E-Mail'
      },
      form: {
        title: 'Nachricht senden',
        hint: 'Beschreiben Sie Umfang, Standort und Termin. Wir leiten die Anfrage an das passende Team und die richtige Projektphase weiter.',
        name: 'Vor- und Nachname',
        namePlaceholder: 'Max Mustermann',
        email: 'E-Mail-Adresse',
        emailPlaceholder: 'max.mustermann@powertech.net.pl',
        message: 'Nachricht',
        messagePlaceholder: 'Beschreiben Sie Ihr Projekt oder Ihre Anfrage...',
        send: 'Nachricht senden',
        sending: 'Wird gesendet...',
        success: 'Vielen Dank! Nachricht wurde gesendet.',
        successDesc: 'Wir werden so schnell wie möglich antworten.',
        error: 'Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.'
      }
    },
    footer: {
      tagline: 'Professionelle Elektroinstallationen',
      rights: 'Alle Rechte vorbehalten.',
      sections: 'Bereiche'
    }
  },
  en: {
    nav: {
      home: 'Home',
      services: 'Services',
      about: 'About',
      contact: 'Contact'
    },
    hero: {
      title: 'POWER TECH',
      subtitle: 'Electrical, low-current, and server room solutions for industrial, residential, and commercial projects',
      description: 'We deliver complete electrical installations, low-current systems, and server room works for industrial, commercial, and residential properties. We have project experience across Europe, including Ireland.',
      cta: 'Contact Us'
    },
    services: {
      title: 'Our Services',
      subtitle: 'Comprehensive electrical solutions tailored to your needs',
      items: [
        {
          title: 'Cable routing',
          description: 'Professional cable routing in accordance with industrial norms and standards.'
        },
        {
          title: 'Terminations',
          description: 'Precise cable terminations using the highest quality materials.'
        },
        {
          title: 'Structured cabling and low-current systems',
          description: 'LAN, fiber optic, and low-current systems ensuring reliable communication throughout your company or building.'
        },
        {
          title: 'Rack, cabinet, and server room connections',
          description: 'Organization and connection of server, rack, and telecommunication infrastructure.'
        },
        {
          title: 'Labeling',
          description: 'Professional labeling of installations for easy management and maintenance.'
        },
        {
          title: 'Testing & Documentation',
          description: 'Comprehensive installation testing with full technical project documentation.'
        }
      ]
    },
    about: {
      title: 'About POWER TECH',
      subtitle: 'Your partner in professional electrical installations',
      content: [
        'POWER TECH Sp. z o.o. specializes in the design and execution of electrical installations, low-current systems, and server room works for industrial, commercial, and residential properties. With many years of experience, we deliver reliable execution across Europe, including Ireland.',
        'Our team of qualified engineers and technicians carries out projects ranging from residential and office installations to extensive systems for large industrial facilities, server rooms, and technical infrastructure. We focus on safety, clean site organization, and compliance with relevant standards.',
        'We focus on modern technologies, professionalism, and long-term partnerships with our clients.'
      ]
    },
    contact: {
      title: 'Contact',
      subtitle: 'Get in touch with us - we are ready for new challenges',
      info: {
        addressTitle: 'Contact Information',
        address: 'Address',
        phone: 'Phone',
        email: 'Email'
      },
      form: {
        title: 'Send a Message',
        hint: 'Share your scope, location, and timing. We will route the request to the right team for installation, modernization, or structured cabling work.',
        name: 'Full Name',
        namePlaceholder: 'John Doe',
        email: 'Email Address',
        emailPlaceholder: 'john.doe@powertech.net.pl',
        message: 'Message',
        messagePlaceholder: 'Describe your project or inquiry...',
        send: 'Send Message',
        sending: 'Sending...',
        success: 'Thank you! Your message has been sent.',
        successDesc: 'We will reply as soon as possible.',
        error: 'An error occurred. Please try again.'
      }
    },
    footer: {
      tagline: 'Professional Electrical Installations',
      rights: 'All rights reserved.',
      sections: 'Sections'
    }
  }
};

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<LanguageCode>(() => {
    const saved = localStorage.getItem('powertech-language');
    return (['en', 'pl', 'de'].includes(saved || '') ? saved : 'pl') as LanguageCode;
  });

  useEffect(() => {
    localStorage.setItem('powertech-language', language);
  }, [language]);

  const setLanguageCode = (code: LanguageCode) => {
    if (['pl', 'de', 'en'].includes(code)) {
      setLanguage(code);
    }
  };

  const cycleLanguage = () => {
    const order: LanguageCode[] = ['en', 'pl', 'de'];
    const currentIndex = order.indexOf(language);
    const nextIndex = (currentIndex + 1) % order.length;
    setLanguage(order[nextIndex]);
  };

  const t = translations[language] || translations.en; // Fallback to english if something goes wrong

  return (
    <LanguageContext.Provider value={{ language, setLanguageCode, cycleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};
