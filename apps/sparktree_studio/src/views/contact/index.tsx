'use client';

import { useEffect, useState } from 'react';
import { FaWhatsapp, FaPhone, FaEnvelope, FaInstagram, FaLinkedin, FaTiktok, FaCalendar, FaMapMarkerAlt, FaCheckCircle } from 'react-icons/fa';
import { FaXmark } from 'react-icons/fa6';
import { MdOutlineHeadsetMic } from "react-icons/md";
import { ChevronDown } from 'lucide-react';
import PageBanner from '@/components/ui/PageBanner';
import { usePageMeta } from '@/hooks/usePageMeta';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import es from 'react-phone-input-2/lang/es.json';
import { CONTACT_SERVICES, getSelectedServices, saveSelectedServices, clearSelectedServices, normalizeServiceName } from '@/lib/servicesStore';

export default function Contact() {
  usePageMeta({
    title: 'Contacto | SparkTree Studio - Agencia de Marketing Digital en Lima',
    description: 'Contáctanos para una asesoría gratuita. Especialistas en diseño web, SEO, branding y marketing digital en Lima, Perú. Respuesta en menos de 24 horas.',
    url: 'https://sparktree.pe/contact',
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "ContactPage",
      "name": "Contacto SparkTree",
      "description": "Página de contacto de SparkTree Studio , agencia de marketing digital en Lima",
      "url": "https://sparktree.pe/contact"
    }
  });

  const [formData, setFormData] = useState<{
    name: string;
    email: string;
    phone: string;
    company: string;
    service: string[];
    budget: string;
    timeline: string;
    message: string;
  }>({
    name: '',
    email: '',
    phone: '',
    company: '',
    service: [],
    budget: '',
    timeline: '',
    message: ''
  });

  const [isServiceDropdownOpen, setIsServiceDropdownOpen] = useState(false);
  const [isBudgetDropdownOpen, setIsBudgetDropdownOpen] = useState(false);
  const [isTimelineDropdownOpen, setIsTimelineDropdownOpen] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [isConsultationModalOpen, setIsConsultationModalOpen] = useState(false);

  // States for split phone logic
  const [dialCode, setDialCode] = useState('51');
  const [phoneBody, setPhoneBody] = useState('');

  useEffect(() => {
    setFormData(prev => ({ ...prev, phone: dialCode + phoneBody }));
  }, [dialCode, phoneBody]);

  const breadcrumbs = [
    { label: 'Inicio', path: '/' },
    { label: 'Contacto' }
  ];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Hydrate form from localStorage and query parameter
  useEffect(() => {
    // Read from search params
    const params = new URLSearchParams(window.location.search);
    const serviceParam = params.get('service');

    // Read from localStorage
    const storedServices = getSelectedServices();
    let finalServices = [...storedServices];

    if (serviceParam) {
      const normalized = normalizeServiceName(serviceParam);
      if (!finalServices.includes(normalized)) {
        finalServices.push(normalized);
      }
      // Clean up URL parameters to keep the browser address bar clean and prevent stale re-hydration
      try {
        const cleanUrl = window.location.protocol + "//" + window.location.host + window.location.pathname;
        window.history.replaceState({ path: cleanUrl }, '', cleanUrl);
      } catch (e) {
        console.error('Failed to clean up query parameters', e);
      }
    }

    if (finalServices.length > 0) {
      const uniqueServices = Array.from(new Set(finalServices));
      setFormData(prev => ({
        ...prev,
        service: uniqueServices
      }));
      // Keep localStorage in sync
      saveSelectedServices(uniqueServices);
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleServiceToggle = (selectedService: string) => {
    setFormData(prev => {
      const isSelected = prev.service.includes(selectedService);
      const newServices = isSelected
        ? prev.service.filter(s => s !== selectedService)
        : [...prev.service, selectedService];
      saveSelectedServices(newServices);
      return { ...prev, service: newServices };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      setSubmitStatus('success');
      setFormData({ name: '', email: '', phone: '', company: '', service: [], budget: '', timeline: '', message: '' });
      clearSelectedServices();
    } catch (error) {
      console.error('Error al enviar el formulario:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    // Reset budget when services change because ranges might change
    setFormData(prev => ({ ...prev, budget: '' }));
  }, [formData.service]);

  const servicesList = CONTACT_SERVICES;

  const serviceBasePrices: Record<string, number> = {
    'Diseño Web': 300,
    'SEO': 150,
    'Branding': 400,
    'SparkBots': 250,
    'Servicios TI': 350,
    'Social Media': 200,
    'Apps Móviles': 2000,
    'Otro': 300
  };

  const basePrice = formData.service.reduce((total, s) => total + (serviceBasePrices[s] || 0), 0) || 500;

  const dynamicBudgets = [
    `S/. ${basePrice.toLocaleString('es-PE')} - S/. ${(basePrice + 500).toLocaleString('es-PE')}`,
    `S/. ${(basePrice + 500).toLocaleString('es-PE')} - S/. ${(basePrice + 1500).toLocaleString('es-PE')}`,
    `S/. ${(basePrice + 1500).toLocaleString('es-PE')} - S/. ${(basePrice + 2000).toLocaleString('es-PE')}`,
    `> S/. ${(basePrice + 2000).toLocaleString('es-PE')}`
  ];

  const timelines = ['Inmediato', 'En 1 mes', 'En 3 meses', 'A definir'];


  return (
    <div className="pt-[72px] bg-[#f8fafc]">
      <PageBanner
        title="Contacto"
        subtitle="Estamos aquí para ayudarte a impulsar tu negocio digital."
        breadcrumbs={breadcrumbs}
      />

      <section className="py-16 md:py-24 max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">

          {/* Left Side: Project Form */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-8 md:p-12 shadow-[0_10px_40px_-15px_rgba(34,139,34,0.1)] border border-green-50">
            <div className="mb-10">
              <h2 className="text-3xl font-black text-gray-900 mb-2">Cuéntanos tu proyecto</h2>
              <p className="text-gray-500 font-medium">Completa el formulario y te contactaremos en menos de 24 horas</p>
            </div>

            {submitStatus === 'success' ? (
              <div className="flex flex-col items-center justify-center py-16 text-center animate-fade-in-up">
                <div className="w-28 h-28 bg-[#41f0a5]/20 rounded-full flex items-center justify-center mb-8">
                  <FaCheckCircle className="text-[#41f0a5] text-6xl" />
                </div>
                <h3 className="text-4xl font-black text-gray-900 mb-4">¡Mensaje recibido!</h3>
                <p className="text-gray-500 font-medium text-xl mb-10 max-w-md">Te contactaremos muy pronto para conversar sobre tu proyecto.</p>

                <div className="bg-[#f8fafc] rounded-3xl p-8 max-w-md w-full border border-[#41f0a5]/20 shadow-lg shadow-[#41f0a5]/5">
                  <h4 className="text-gray-900 font-black text-lg mb-2">¿Te faltó algo?</h4>
                  <p className="text-gray-500 font-medium text-sm mb-6">Nos puedes enviar lo adicional que faltó agregar creando un nuevo mensaje.</p>
                  <button
                    onClick={() => setSubmitStatus('idle')}
                    className="w-full py-4 bg-white border-2 border-[#41f0a5] text-black hover:bg-[#41f0a5] rounded-2xl font-black uppercase tracking-widest transition-all shadow-sm"
                  >
                    Enviar adicional
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 ml-1">Nombre completo</label>
                    <input
                      type="text" name="name" value={formData.name} onChange={handleInputChange} required
                      className="w-full px-5 py-4 bg-white border border-gray-300 rounded-2xl focus:ring-2 focus:ring-[#41f0a5] focus:border-transparent transition-all outline-none placeholder:text-gray-300"
                      placeholder="Nombre completo"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 ml-1">Email</label>
                    <input
                      type="email" name="email" value={formData.email} onChange={handleInputChange} required
                      className="w-full px-5 py-4 bg-white border border-gray-300 rounded-2xl focus:ring-2 focus:ring-[#41f0a5] focus:border-transparent transition-all outline-none placeholder:text-gray-300"
                      placeholder="Correo electrónico"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2 relative group/phone">
                    <label className="text-sm font-bold text-gray-700 ml-1">Teléfono</label>
                    <div className="flex items-center border border-[#41f0a5]/30 rounded-2xl bg-white focus-within:ring-2 focus-within:ring-[#41f0a5] transition-all h-[58px] relative">
                      <div className="relative h-full flex items-center">
                        <PhoneInput
                          country={'pe'}
                          value={dialCode}
                          onChange={(_, data: any) => {
                            setDialCode(data.dialCode);
                            const btn = document.querySelector('.group\\/phone .selected-flag');
                            if (btn) btn.setAttribute('data-dial-code', `+${data.dialCode}`);
                          }}
                          onMount={(_, data: any) => {
                            setDialCode(data.dialCode);
                            const btn = document.querySelector('.group\\/phone .selected-flag');
                            if (btn) btn.setAttribute('data-dial-code', `+${data.dialCode}`);
                            const flagBtn = document.querySelector('.group\\/phone .flag-dropdown button');
                            if (flagBtn) flagBtn.setAttribute('type', 'button');
                          }}
                          countryCodeEditable={false}
                          inputClass="!hidden"
                          containerClass="!border-none !w-auto !h-full"
                          buttonClass="!bg-white !border-r !border-[#41f0a5]/20 !rounded-l-2xl !px-3 hover:!bg-gray-100 !flex !items-center !justify-center !w-[90px] !h-full !static"
                          dropdownClass="!bg-white !rounded-xl !shadow-2xl !border-[#41f0a5]/20 !text-gray-700"
                          enableSearch={true}
                          searchPlaceholder="Buscar..."
                          disableSearchIcon={true} // Removes the default emoji/icon
                          localization={es}
                        />
                      </div>
                      <input
                        type="tel"
                        value={phoneBody}
                        onChange={(e) => setPhoneBody(e.target.value.replace(/\D/g, ''))}
                        className="flex-1 px-5 py-4 bg-transparent outline-none placeholder:text-gray-300 font-medium text-gray-900 h-full rounded-r-2xl"
                        placeholder="Número de celular"
                      />
                    </div>
                    <style>{`
                      .group\\/phone .react-tel-input .flag-dropdown {
                        background: transparent;
                        border: none;
                        width: 90px;
                      }
                      .group\\/phone .react-tel-input .selected-flag {
                        width: 100%;
                        background: transparent;
                        display: flex !important;
                        align-items: center !important;
                        gap: 4px !important;
                        padding-left: 12px !important;
                        border-radius: 1rem 0 0 1rem !important;
                      }
                      .group\\/phone .react-tel-input .selected-flag::after {
                        content: attr(data-dial-code);
                        display: block;
                        font-size: 14px;
                        font-weight: 700;
                        color: #000000ff;
                        margin-left: 36px;
                      }
                      .group\\/phone .react-tel-input .flag {
                        position: absolute;
                        left: 12px;
                      }
                      /* Beautiful & Premium Search/Filter Box */
                      .group\\/phone .react-tel-input .search {
                        padding: 12px 16px !important;
                        margin: 0 !important;
                        background: #ffffff !important;
                        border-bottom: 1px solid #f1f5f9 !important;
                        position: sticky !important;
                        top: 0 !important;
                        z-index: 20 !important;
                        display: block !important;
                      }
                      .group\\/phone .react-tel-input .search-box {
                        width: 100% !important;
                        height: 42px !important;
                        padding: 10px 14px 10px 42px !important; /* Extra padding for icon */
                        border: 1px solid #e2e8f0 !important;
                        border-radius: 12px !important;
                        font-size: 14px !important;
                        font-weight: 500 !important;
                        background: #f8faff url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='18' height='18' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='11' cy='11' r='8'%3E%3C/circle%3E%3Cpath d='m21 21-4.3-4.3'%3E%3C/path%3E%3C/svg%3E") no-repeat 14px center !important;
                        color: #1e293b !important;
                        outline: none !important;
                        transition: all 0.2s !important;
                      }
                      .group\\/phone .react-tel-input .search-box:focus {
                        background: #ffffff !important;
                        border-color: #3b82f6 !important;
                        box-shadow: 0 4px 12px -2px rgba(59, 130, 246, 0.1) !important;
                      }
                      .group\\/phone .react-tel-input .country-list {
                        max-height: 320px !important;
                        width: 340px !important;
                        border-radius: 1.25rem !important;
                        margin-top: 10px !important;
                        box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04) !important;
                        border: 1px solid #f1f5f9 !important;
                        z-index: 9999;
                        /* Perfect Scroll Interaction */
                        overflow-y: auto !important;
                        overflow-x: hidden !important;
                        pointer-events: auto !important;
                        scrollbar-width: thin !important;
                        scrollbar-color: #e2e8f0 transparent !important;
                      }

                      /* Mobile Responsiveness */
                      @media (max-width: 640px) {
                        .group\\/phone .react-tel-input .country-list {
                          width: calc(100vw - 48px) !important;
                          position: fixed !important;
                          left: 24px !important;
                          top: 20% !important;
                          margin-top: 0 !important;
                          max-height: 60vh !important;
                        }
                      }

                      .group\\/phone .react-tel-input .country-list::-webkit-scrollbar {
                        width: 5px !important;
                      }
                      .group\\/phone .react-tel-input .country-list::-webkit-scrollbar-thumb {
                        background: #e2e8f0 !important;
                        border-radius: 10px !important;
                      }
                      .group\\/phone .react-tel-input .country-list .country {
                        padding: 14px 16px 14px 52px !important;
                        font-size: 14px !important;
                        font-weight: 500 !important;
                        color: #475569 !important;
                        transition: all 0.2s !important;
                        position: relative !important;
                      }
                      .group\\/phone .react-tel-input .country-list .country .flag {
                        position: absolute !important;
                        left: 16px !important;
                        top: 50% !important;
                        transform: translateY(-50%) !important;
                      }
                      .group\\/phone .react-tel-input .country-list .country.highlight {
                        background-color: #eff6ff !important;
                        color: #2563eb !important;
                      }
                      .group\\/phone .react-tel-input .country-list .country:hover {
                        background-color: #f8faff !important;
                        color: #1e293b !important;
                      }
                    `}</style>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 ml-1">Empresa/Negocio</label>
                    <input
                      type="text" name="company" value={formData.company} onChange={handleInputChange}
                      className="w-full px-5 py-4 bg-white border border-[#41f0a5]/30 rounded-2xl focus:ring-2 focus:ring-[#41f0a5] focus:border-transparent transition-all outline-none placeholder:text-gray-300"
                      placeholder="Nombre de empresa/negocio"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 ml-1">Servicios de interés</label>
                    <div className="relative">
                      <div
                        onClick={() => setIsServiceDropdownOpen(!isServiceDropdownOpen)}
                        className={`w-full min-h-[58px] px-5 py-4 bg-white border ${isServiceDropdownOpen ? 'border-[#41f0a5] ring-2 ring-[#41f0a5]' : 'border-[#41f0a5]/30'} rounded-2xl transition-all cursor-pointer flex items-center justify-between`}
                      >
                        <div className="flex flex-wrap gap-2 flex-1 mr-2">
                          {formData.service.length === 0 ? (
                            <span className="text-gray-300 font-medium">Selecciona uno o más</span>
                          ) : (
                            formData.service.map(s => (
                              <span key={s} className="bg-[#41f0a5]/20 text-green-900 px-3 py-1 rounded-xl text-sm font-bold flex items-center gap-2">
                                {s}
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleServiceToggle(s);
                                  }}
                                  className="hover:text-black transition-colors"
                                >
                                  &times;
                                </button>
                              </span>
                            ))
                          )}
                        </div>
                        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isServiceDropdownOpen ? 'rotate-180' : ''}`} />
                      </div>

                      {isServiceDropdownOpen && (
                        <>
                          <div className="fixed inset-0 z-10" onClick={() => setIsServiceDropdownOpen(false)}></div>
                          <div className="absolute z-20 w-full mt-2 bg-white border border-gray-100 rounded-2xl shadow-xl overflow-hidden py-2 animate-fade-in-up">
                            {servicesList.map(s => (
                              <div
                                key={s}
                                onClick={() => handleServiceToggle(s)}
                                className={`px-5 py-3 cursor-pointer hover:bg-gray-50 flex items-center gap-3 transition-colors ${formData.service.includes(s) ? 'bg-[#41f0a5]/10' : ''}`}
                              >
                                <div className={`w-5 h-5 rounded-[6px] border flex items-center justify-center transition-colors ${formData.service.includes(s) ? 'bg-[#41f0a5] border-[#41f0a5]' : 'border-gray-300'}`}>
                                  {formData.service.includes(s) && <FaCheckCircle className="text-black w-3 h-3" />}
                                </div>
                                <span className={formData.service.includes(s) ? 'font-bold text-gray-900' : 'text-gray-600 font-medium'}>{s}</span>
                              </div>
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 ml-1">Presupuesto aproximado</label>
                    <div className="relative">
                      <div
                        onClick={() => setIsBudgetDropdownOpen(!isBudgetDropdownOpen)}
                        className={`w-full min-h-[58px] px-5 py-4 bg-white border ${isBudgetDropdownOpen ? 'border-[#41f0a5] ring-2 ring-[#41f0a5]' : 'border-[#41f0a5]/30'} rounded-2xl transition-all cursor-pointer flex items-center justify-between`}
                      >
                        <div className="flex-1 mr-2">
                          {formData.budget ? (
                            <span className="text-gray-900 font-bold">{formData.budget}</span>
                          ) : (
                            <span className="text-gray-300 font-medium">Selecciona un rango</span>
                          )}
                        </div>
                        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isBudgetDropdownOpen ? 'rotate-180' : ''}`} />
                      </div>

                      {isBudgetDropdownOpen && (
                        <>
                          <div className="fixed inset-0 z-10" onClick={() => setIsBudgetDropdownOpen(false)}></div>
                          <div className="absolute z-20 w-full mt-2 bg-white border border-gray-100 rounded-2xl shadow-xl overflow-hidden py-2 animate-fade-in-up">
                            {dynamicBudgets.map(b => (
                              <div
                                key={b}
                                onClick={() => {
                                  setFormData(prev => ({ ...prev, budget: b }));
                                  setIsBudgetDropdownOpen(false);
                                }}
                                className={`px-5 py-3 cursor-pointer hover:bg-gray-50 flex items-center gap-3 transition-colors ${formData.budget === b ? 'bg-[#41f0a5]/10' : ''}`}
                              >
                                <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${formData.budget === b ? 'bg-[#41f0a5] border-[#41f0a5]' : 'border-gray-300'}`}>
                                  {formData.budget === b && <div className="w-2 h-2 bg-black rounded-full" />}
                                </div>
                                <span className={formData.budget === b ? 'font-bold text-gray-900' : 'text-gray-600 font-medium'}>{b}</span>
                              </div>
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 ml-1">¿Cuándo necesitas el proyecto?</label>
                  <div className="relative">
                    <div
                      onClick={() => setIsTimelineDropdownOpen(!isTimelineDropdownOpen)}
                      className={`w-full min-h-[58px] px-5 py-4 bg-white border ${isTimelineDropdownOpen ? 'border-[#41f0a5] ring-2 ring-[#41f0a5]' : 'border-[#41f0a5]/30'} rounded-2xl transition-all cursor-pointer flex items-center justify-between`}
                    >
                      <div className="flex-1 mr-2">
                        {formData.timeline ? (
                          <span className="text-gray-900 font-bold">{formData.timeline}</span>
                        ) : (
                          <span className="text-gray-300 font-medium">Selecciona un plazo</span>
                        )}
                      </div>
                      <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isTimelineDropdownOpen ? 'rotate-180' : ''}`} />
                    </div>

                    {isTimelineDropdownOpen && (
                      <>
                        <div className="fixed inset-0 z-10" onClick={() => setIsTimelineDropdownOpen(false)}></div>
                        <div className="absolute z-20 w-full mt-2 bg-white border border-gray-100 rounded-2xl shadow-xl overflow-hidden py-2 animate-fade-in-up">
                          {timelines.map(t => (
                            <div
                              key={t}
                              onClick={() => {
                                setFormData(prev => ({ ...prev, timeline: t }));
                                setIsTimelineDropdownOpen(false);
                              }}
                              className={`px-5 py-3 cursor-pointer hover:bg-gray-50 flex items-center gap-3 transition-colors ${formData.timeline === t ? 'bg-[#41f0a5]/10' : ''}`}
                            >
                              <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${formData.timeline === t ? 'bg-[#41f0a5] border-[#41f0a5]' : 'border-gray-300'}`}>
                                {formData.timeline === t && <div className="w-2 h-2 bg-black rounded-full" />}
                              </div>
                              <span className={formData.timeline === t ? 'font-bold text-gray-900' : 'text-gray-600 font-medium'}>{t}</span>
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 ml-1">Cuéntanos sobre tu proyecto</label>
                  <textarea
                    name="message" value={formData.message} onChange={handleInputChange} required rows={4}
                    className="w-full px-5 py-4 bg-white border border-[#41f0a5]/30 rounded-2xl focus:ring-2 focus:ring-[#41f0a5] focus:border-transparent transition-all outline-none placeholder:text-gray-300 resize-none font-medium text-gray-600"
                    placeholder="Describe tu proyecto, objetivos, características, datos importantes, referencias..."
                  />
                </div>

                <button
                  type="submit" disabled={isSubmitting}
                  className="w-full py-5 bg-[#41f0a5] text-black hover:bg-green-500 hover:text-white rounded-2xl font-black text-lg tracking-widest uppercase transition-all shadow-lg shadow-blue-200 active:scale-95 disabled:opacity-50"
                >
                  {isSubmitting ? 'Procesando...' : 'Enviar'}
                </button>
              </form>
            )}
          </div>

          {/* Right Side: Info Cards */}
          <div className="lg:col-span-5 space-y-8">
            <div className="mb-2">
              <h2 className="text-2xl font-black text-gray-900 mb-2">Información de contacto</h2>
              <p className="text-gray-500 text-sm font-medium">Estamos disponibles para responder tus consultas y ayudarte con tu proyecto.</p>
            </div>

            {/* WhatsApp Card */}
            <div className="bg-green-50 rounded-[2rem] p-8 text-center shadow-lg shadow-green-100">
              <h3 className="text-gray-900 font-black text-lg mb-4">¿Prefieres WhatsApp?</h3>
              <a
                href="https://wa.me/51958077827" target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-3 bg-white px-8 py-4 rounded-2xl text-gray-900 font-bold hover:scale-105 transition-all shadow-sm"
              >
                <FaWhatsapp className="text-2xl text-green-500" />
                Chatea por WhatsApp
              </a>
            </div>

            {/* Contact Box Card */}
            <div className="bg-[41f0a5] rounded-[2.5rem] p-8 space-y-4 shadow-xl shadow-green-100">
              <div
                onClick={() => setIsConsultationModalOpen(true)}
                className="bg-white hover:bg-gray-50 transition-colors p-4 rounded-xl flex items-center gap-4 cursor-pointer group"
              >
                <div className="w-10 h-10 flex items-center justify-center bg-green-50 rounded-lg group-hover:scale-110 transition-transform">
                  <MdOutlineHeadsetMic className="text-41f0a5 text-xl" />
                </div>
                <span className="text-41f0a5 font-bold">Consulta gratuita</span>
              </div>

              <a href="tel:+51958077827" className="bg-white hover:bg-gray-50 transition-colors p-4 rounded-xl flex items-center gap-4 cursor-pointer group">
                <div className="w-10 h-10 flex items-center justify-center bg-blue-50 rounded-lg group-hover:scale-110 transition-transform">
                  <FaPhone className="text-41f0a5 text-lg" />
                </div>
                <span className="text-41f0a5 font-bold">+51 958 077 827</span>
              </a>

              <a href="mailto:[EMAIL_ADDRESS]" className="bg-white hover:bg-gray-50 transition-colors p-4 rounded-xl flex items-center gap-4 cursor-pointer group">
                <div className="w-10 h-10 flex items-center justify-center bg-blue-50 rounded-lg group-hover:scale-110 transition-transform">
                  <FaEnvelope className="text-41f0a5 text-lg" />
                </div>
                <span className="text-41f0a5 font-bold">sparktree.rs@gmail.com</span>
              </a>

              <div className="bg-white/95 p-4 rounded-xl flex items-center gap-4 border border-white/20">
                <div className="w-10 h-10 flex items-center justify-center bg-green-50 rounded-lg">
                  <FaMapMarkerAlt className="text-41f0a5 text-lg" />
                </div>
                <span className="text-41f0a5 font-bold">Lima, Lima, Perú</span>
              </div>
            </div>

            {/* Social Media Card */}
            <div className="bg-white rounded-3xl p-8 border border-green-50 shadow-lg shadow-green-50">
              <h4 className="text-41f0a5 font-bold text-center mb-6">Siguenos en nuestras redes sociales</h4>
              <div className="flex justify-center gap-6">
                <a href="https://www.instagram.com/sparktree.rs/" className="w-14 h-14 bg-[#41f0a5] text-black rounded-2xl flex items-center justify-center hover:scale-110 hover:text-white hover:bg-black transition-transform shadow-md shadow-green-100">
                  <FaInstagram size={24} />
                </a>
                <a href="https://www.tiktok.com/@sparktreestudio?_t=8T7s42zXw2u&_r=1" className="w-14 h-14 bg-[#41f0a5] text-black rounded-2xl flex items-center justify-center hover:scale-110 hover:text-white hover:bg-black transition-transform shadow-md shadow-green-100">
                  <FaTiktok size={24} />
                </a>
                <a href="https://www.linkedin.com/company/sparktree-studio-marketing-digital" className="w-14 h-14 bg-[#41f0a5] text-black rounded-2xl flex items-center justify-center hover:scale-110 hover:text-white hover:bg-black transition-transform shadow-md shadow-green-100">
                  <FaLinkedin size={24} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Consultation Modal */}
      {isConsultationModalOpen && (
        <>
          <div className="fixed inset-0 z-[9998] bg-black/40 backdrop-blur-sm" onClick={() => setIsConsultationModalOpen(false)} />
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg p-10 relative">
              <button onClick={() => setIsConsultationModalOpen(false)} className="absolute top-6 right-6 text-gray-400 hover:text-gray-900 transition-colors"><FaXmark size={24} /></button>
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-4"><FaCalendar className="text-blue-600 text-2xl" /></div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Consulta Estratégica</h3>
                <p className="text-gray-500 text-sm">Agenda una reunión gratuita de 30 minutos.</p>
              </div>
              <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setIsConsultationModalOpen(false); alert('¡Recibido!'); }}>
                <input required className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-[#41f0a5] outline-none font-medium" placeholder="Tu nombre" />
                <input type="email" required className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-[#41f0a5] outline-none font-medium" placeholder="Email de contacto" />
                <div className="grid grid-cols-2 gap-4">
                  <input type="date" required className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-[#41f0a5] outline-none text-sm font-bold" />
                  <select required className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-[#41f0a5] outline-none text-sm font-bold">
                    <option value="">Hora</option>
                    <option>09:00 AM</option><option>11:00 AM</option><option>03:00 PM</option><option>05:00 PM</option>
                  </select>
                </div>
                <button type="submit" className="w-full py-5 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all mt-4">Confirmar Cita</button>
              </form>
            </div>
          </div>
        </>
      )}
    </div>
  );
}