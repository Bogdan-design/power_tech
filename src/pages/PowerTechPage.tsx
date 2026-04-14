import React from 'react';
import { Helmet } from 'react-helmet';
import { useLanguage } from '@/components/LanguageContext';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Services from '@/components/Services';
import About from '@/components/About';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import { companyInfo } from '@/lib/companyInfo';

const PowerTechPage = () => {
  const { language, t } = useLanguage();

  const seoData = {
    pl: {
      title: 'POWER TECH - Profesjonalne Instalacje Elektryczne | Polska, Niemcy, Benelux',
      description: 'POWER TECH Sp. z o.o. - specjaliści w instalacjach elektrycznych, słaboprądowych i pracach serwerowych dla obiektów przemysłowych, komercyjnych i mieszkalnych. Realizacje na terenie całej Europy, w tym w Irlandii.',
      keywords: 'instalacje elektryczne, słaboprądowe, serwerownie, okablowanie strukturalne, LAN, światłowód, instalacje przemysłowe, mieszkalne, Europa, Irlandia'
    },
    de: {
      title: 'POWER TECH - Professionelle Elektroinstallationen | Polen, Deutschland, Benelux',
      description: 'POWER TECH Sp. z o.o. - Spezialisten für Elektroinstallationen, Schwachstromsysteme und Serverraumarbeiten für Industrie-, Gewerbe- und Wohnobjekte. Projekte in ganz Europa, einschließlich Irland.',
      keywords: 'Elektroinstallationen, Schwachstrom, Serverräume, strukturierte Verkabelung, LAN, Glasfaser, Industrie, Wohnen, Europa, Irland'
    },
    en: {
      title: 'POWER TECH - Professional Electrical Installations | Poland, Germany, Benelux',
      description: 'POWER TECH Sp. z o.o. - Specialists in electrical installations, low-current systems, and server room works for industrial, commercial, and residential properties. Project delivery across Europe, including Ireland.',
      keywords: 'electrical installations, low-current systems, server rooms, structured cabling, LAN, fiber optic, industrial, residential, Europe, Ireland'
    }
  };

  const currentSeo = seoData[language] || seoData.en;
  const serviceItems = t?.services?.items || [];

  return (
    <>
      <Helmet>
        <html lang={language || 'en'} />
        <title>{currentSeo?.title || 'POWER TECH'}</title>
        <meta name="description" content={currentSeo?.description || ''} />
        <meta name="keywords" content={currentSeo?.keywords || ''} />
        
        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content={currentSeo?.title || 'POWER TECH'} />
        <meta property="og:description" content={currentSeo?.description || ''} />
        <meta property="og:locale" content={language === 'pl' ? 'pl_PL' : language === 'de' ? 'de_DE' : 'en_US'} />
        
        {/* Structured Data - Organization */}
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: 'POWER TECH Sp. z o.o.',
            url: 'https://powertech.net.pl',
            logo: 'https://powertech.net.pl/logo.png',
            description: currentSeo?.description || '',
            address: {
              '@type': 'PostalAddress',
              streetAddress: companyInfo.address.street,
              addressLocality: companyInfo.address.city,
              postalCode: companyInfo.address.postalCode,
              addressCountry: 'PL'
            },
            email: companyInfo.email,
            areaServed: ['PL', 'DE', 'BE', 'NL', 'LU', 'IE', 'EU']
          })}
        </script>

        {/* Structured Data - Service */}
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Service',
            serviceType: 'Electrical Installation Services',
            provider: {
              '@type': 'Organization',
              name: 'POWER TECH Sp. z o.o.'
            },
            areaServed: {
              '@type': 'Place',
              name: ['Poland', 'Germany', 'Belgium', 'Netherlands', 'Luxembourg', 'Ireland', 'Europe']
            },
            hasOfferCatalog: {
              '@type': 'OfferCatalog',
              name: 'Electrical Installation Services',
              itemListElement: serviceItems.map((service, index) => ({
                '@type': 'Offer',
                itemOffered: {
                  '@type': 'Service',
                  name: service?.title || `Service ${index + 1}`,
                  description: service?.description || ''
                }
              }))
            }
          })}
        </script>
      </Helmet>

      <div className="min-h-screen bg-slate-100 text-slate-900">
        <Header />
        <main>
          <Hero />
          <Services />
          <About />
          <Contact />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default PowerTechPage;
