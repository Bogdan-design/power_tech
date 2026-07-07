import React, { useState } from 'react';
import { useLanguage } from '@/components/LanguageContext';
import { MapPin, Phone, Mail, Send, FileBadge2, Hash, MessageCircle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { companyInfo } from '@/lib/companyInfo';

const Contact = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      toast({
        title: t?.contact?.form?.success || 'Success',
        description: t?.contact?.form?.successDesc || 'Message sent successfully.',
      });
      setFormData({ name: '', email: '', message: '' });
      setIsSubmitting(false);
    }, 1000);
  };

  const contactInfo = [
    {
      icon: MapPin,
      label: t?.contact?.info?.address || 'Address',
      value: companyInfo.address.display
    },
    {
      icon: Mail,
      label: t?.contact?.info?.email || 'Email',
      value: companyInfo.email,
      href: `mailto:${companyInfo.email}`
    }
  ];

  const details = [
    {
      icon: FileBadge2,
      label: 'NIP',
      value: companyInfo.registry.nip,
    },
    {
      icon: Hash,
      label: 'REGON',
      value: companyInfo.registry.regon,
    },
  ];

  const inputClass =
    'w-full border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder-slate-400 transition-colors duration-200 focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400';

  return (
    <section id="contact" className="relative overflow-hidden bg-slate-950 py-24">
      <div className="blueprint-grid absolute inset-0 opacity-40" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_left_top,rgba(245,158,11,0.10),transparent_40%)]" />

      <div className="container relative z-10 mx-auto px-4">
        <div className="mb-14 max-w-2xl">
          <div className="mb-4 flex items-center gap-3">
            <span className="h-px w-8 bg-amber-500" />
            <span className="font-tech text-xs uppercase tracking-[0.3em] text-amber-400">Get in touch</span>
          </div>
          <h2 className="font-display mb-4 text-4xl font-bold text-white md:text-5xl">
            {t?.contact?.title || 'Contact Us'}
          </h2>
          <p className="text-lg text-slate-400">
            {t?.contact?.subtitle || 'Get in touch with us'}
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Left column: contact + registry */}
          <div className="space-y-6">
            <div className="border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-sm sm:p-8">
              <h3 className="font-display mb-6 text-xl font-semibold text-white sm:text-2xl">
                {t?.contact?.info?.addressTitle || 'Contact Information'}
              </h3>
              <div className="space-y-5">
                {contactInfo.map((item, index) => {
                  const Icon = item.icon;
                  const content = (
                    <div className="group flex items-start gap-4">
                      <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center border border-slate-700 bg-slate-950 transition-colors duration-300 group-hover:border-amber-400">
                        <Icon className="h-5 w-5 text-amber-400" strokeWidth={2} />
                      </div>
                      <div className="flex-1">
                        <p className="font-tech mb-1 text-[11px] uppercase tracking-[0.2em] text-slate-500">{item.label}</p>
                        <p className="font-medium text-slate-100 transition-colors duration-300 group-hover:text-amber-300">
                          {item.value}
                        </p>
                      </div>
                    </div>
                  );

                  return item.href ? (
                    <a key={index} href={item.href} className="block">
                      {content}
                    </a>
                  ) : (
                    <div key={index}>{content}</div>
                  );
                })}
              </div>

              <div className="mt-8 space-y-4">
                {companyInfo.phones.map((phone) => (
                  <div key={phone.href} className="border border-slate-800 bg-slate-950/60 p-4 sm:p-5">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div className="min-w-0">
                        <p className="font-tech text-[11px] uppercase tracking-[0.2em] text-slate-500">{phone.label}</p>
                        <p className="mt-1 break-words text-lg font-semibold text-white sm:text-xl">{phone.value}</p>
                        <p className="mt-2 flex items-center gap-1.5 text-sm text-emerald-400">
                          <MessageCircle className="h-3.5 w-3.5" /> WhatsApp
                        </p>
                      </div>
                      <div className="flex flex-col gap-2 sm:flex-row">
                        <a
                          href={`tel:${phone.href}`}
                          className="inline-flex items-center justify-center gap-2 bg-amber-400 px-4 py-2 text-sm font-semibold text-slate-950 transition-colors hover:bg-amber-300"
                        >
                          <Phone className="h-4 w-4" />
                          Call
                        </a>
                        <a
                          href={phone.whatsapp}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center justify-center gap-2 border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-200 transition-colors hover:border-emerald-400 hover:text-emerald-400"
                        >
                          <MessageCircle className="h-4 w-4" />
                          WhatsApp
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Registry / legal data */}
            <div className="border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-sm sm:p-8">
              <div className="mb-6">
                <p className="font-tech text-[11px] uppercase tracking-[0.25em] text-amber-400">Dane rejestrowe</p>
                <h3 className="font-display mt-2 break-words text-xl font-semibold text-white sm:text-2xl">
                  {companyInfo.legalName}
                </h3>
              </div>

              <div className="grid grid-cols-1 gap-px border border-slate-800 bg-slate-800 sm:grid-cols-2">
                {details.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.label} className="bg-slate-950 p-4">
                      <div className="mb-3 flex h-9 w-9 items-center justify-center border border-slate-700 bg-slate-900">
                        <Icon className="h-4 w-4 text-amber-400" strokeWidth={2} />
                      </div>
                      <p className="font-tech text-[11px] uppercase tracking-[0.25em] text-slate-500">{item.label}</p>
                      <p className="font-tech mt-1 text-lg font-semibold text-white">{item.value}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right column: form */}
          <div className="border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-sm sm:p-8">
            <h3 className="font-display mb-2 text-xl font-semibold text-white sm:text-2xl">
              {t?.contact?.form?.title || 'Send a Message'}
            </h3>
            <p className="mb-6 text-sm leading-relaxed text-slate-400">
              {t?.contact?.form?.hint || 'Tell us what kind of installation, modernization, or cabling scope you need.'}
            </p>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="name" className="font-tech mb-2 block text-[11px] uppercase tracking-[0.2em] text-slate-400">
                  {t?.contact?.form?.name || 'Full Name'}
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder={t?.contact?.form?.namePlaceholder || 'John Doe'}
                  className={inputClass}
                />
              </div>

              <div>
                <label htmlFor="email" className="font-tech mb-2 block text-[11px] uppercase tracking-[0.2em] text-slate-400">
                  {t?.contact?.form?.email || 'Email Address'}
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder={t?.contact?.form?.emailPlaceholder || 'john@powertech.net.pl'}
                  className={inputClass}
                />
              </div>

              <div>
                <label htmlFor="message" className="font-tech mb-2 block text-[11px] uppercase tracking-[0.2em] text-slate-400">
                  {t?.contact?.form?.message || 'Message'}
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  placeholder={t?.contact?.form?.messagePlaceholder || 'Your message...'}
                  className={`${inputClass} resize-none`}
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="flex w-full items-center justify-center gap-2 bg-amber-400 px-6 py-3.5 font-semibold text-slate-950 transition-colors duration-300 hover:bg-amber-300 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400"
              >
                {isSubmitting ? (
                  <>
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-950/30 border-t-slate-950"></div>
                    {t?.contact?.form?.sending || 'Sending...'}
                  </>
                ) : (
                  <>
                    <Send className="h-5 w-5" />
                    {t?.contact?.form?.send || 'Send Message'}
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
