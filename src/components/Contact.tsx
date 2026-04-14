import React, { useState } from 'react';
import { useLanguage } from '@/components/LanguageContext';
import { MapPin, Phone, Mail, Send, Building2, FileBadge2, MessageCircle } from 'lucide-react';
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
      icon: Building2,
      label: 'KRS',
      value: companyInfo.registry.krs,
    },
    {
      icon: FileBadge2,
      label: 'NIP',
      value: companyInfo.registry.nip,
    },
  ];

  return (
    <section id="contact" className="relative overflow-hidden bg-white py-24">
      <div className="absolute inset-0 opacity-60">
        <div className="absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 rounded-full bg-cyan-400/10 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-64 w-64 rounded-full bg-amber-300/20 blur-3xl" />
      </div>

      <div className="container relative z-10 mx-auto px-4">
        <div className="mb-16 text-center">
          <div className="mx-auto mb-5 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-cyan-200">
            Power Tech
          </div>
          <h2 className="mb-4 text-4xl font-bold text-slate-900 md:text-5xl">
            {t?.contact?.title || 'Contact Us'}
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-slate-600">
            {t?.contact?.subtitle || 'Get in touch with us'}
          </p>
        </div>

        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-2">
          <div className="space-y-8">
            <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-xl shadow-slate-200/60">
              <h3 className="mb-6 text-2xl font-bold text-slate-900">
                {t?.contact?.info?.addressTitle || 'Contact Information'}
              </h3>
              <div className="space-y-6">
                {contactInfo.map((item, index) => {
                  const Icon = item.icon;
                  const content = (
                    <div className="group flex items-start gap-4">
                      <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 to-cyan-700 transition-transform duration-300 group-hover:scale-110">
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="mb-1 text-sm text-slate-500">{item.label}</p>
                        <p className="font-medium text-slate-900 transition-colors duration-300 group-hover:text-cyan-700">
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

              <div className="mt-8 grid gap-4">
                {companyInfo.phones.map((phone) => (
                  <div key={phone.href} className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-sm uppercase tracking-[0.2em] text-slate-500">{phone.label}</p>
                        <p className="mt-1 text-xl font-semibold text-slate-900">{phone.value}</p>
                        <p className="mt-2 text-sm text-green-600">WhatsApp available</p>
                      </div>
                      <div className="flex gap-3">
                        <a
                          href={`tel:${phone.href}`}
                          className="inline-flex items-center gap-2 rounded-xl bg-cyan-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-cyan-700"
                        >
                          <Phone className="h-4 w-4" />
                          Call
                        </a>
                        <a
                          href={phone.whatsapp}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-2 rounded-xl bg-green-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-green-600"
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

            <div className="rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-8 shadow-xl shadow-slate-200/60">
              <div className="mb-6 flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">
                    Dane rejestrowe
                  </p>
                  <h3 className="mt-2 text-2xl font-bold text-slate-900">{companyInfo.legalName}</h3>
                </div>
                <div className="rounded-2xl border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-cyan-200">
                  Verified
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {details.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.label} className="rounded-2xl border border-slate-200 bg-white p-4">
                      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100">
                        <Icon className="h-5 w-5 text-cyan-300" />
                      </div>
                      <p className="text-xs uppercase tracking-[0.25em] text-slate-500">{item.label}</p>
                      <p className="mt-1 text-lg font-semibold text-slate-900">{item.value}</p>
                    </div>
                  );
                })}
              </div>

              <p className="mt-6 text-sm text-slate-500">
                Address source:{' '}
                <a
                  href={companyInfo.address.source}
                  target="_blank"
                  rel="noreferrer"
                  className="text-cyan-300 transition-colors hover:text-cyan-200"
                >
                  ALEO company listing
                </a>
              </p>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-8 shadow-xl shadow-slate-200/60">
            <h3 className="mb-2 text-2xl font-bold text-slate-900">
              {t?.contact?.form?.title || 'Send a Message'}
            </h3>
            <p className="mb-6 text-sm leading-relaxed text-slate-600">
              {t?.contact?.form?.hint || 'Tell us what kind of installation, modernization, or cabling scope you need. We will get back with the right team and timing.'}
            </p>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="mb-2 block text-sm font-medium text-slate-700">
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
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 placeholder-slate-400 transition-all duration-300 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-cyan-400"
                />
              </div>

              <div>
                <label htmlFor="email" className="mb-2 block text-sm font-medium text-slate-700">
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
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 placeholder-slate-400 transition-all duration-300 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-cyan-400"
                />
              </div>

              <div>
                <label htmlFor="message" className="mb-2 block text-sm font-medium text-slate-700">
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
                  className="w-full resize-none rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 placeholder-slate-400 transition-all duration-300 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-cyan-400"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-500 to-cyan-700 px-6 py-3 font-semibold text-white transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-cyan-500/20 disabled:cursor-not-allowed disabled:from-cyan-800 disabled:to-cyan-900 disabled:text-white disabled:hover:scale-100"
              >
                {isSubmitting ? (
                  <>
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white"></div>
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
