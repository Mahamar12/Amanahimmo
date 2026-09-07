import React, { useState } from 'react';
import { MapPin, Phone, Mail, MessageCircle, Send, CheckCircle2 } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    subject: '',
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      setFormData({ name: '', phone: '', email: '', subject: '', message: '' });
    }, 800);
  };

  return (
    <div className="space-y-16 pb-16">
      
      {/* Header Banner */}
      <section className="bg-[#12372A] text-white py-16 px-4 sm:px-6 lg:px-8 text-center space-y-4">
        <span className="text-[#D4AF37] font-bold text-xs uppercase tracking-widest">À votre écoute</span>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">Nous contacter</h1>
        <p className="text-gray-200 text-base sm:text-lg max-w-xl mx-auto font-light">
          Notre équipe vous accueille à notre agence de Niarry Tally ou répond directement à toutes vos questions par téléphone et WhatsApp.
        </p>
      </section>

      {/* Main Grid: Info + Form */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          
          {/* Left 2 cols: Agency Contact Info */}
          <div className="lg:col-span-2 space-y-8 bg-white p-8 rounded-3xl border border-gray-100 shadow-xl h-fit">
            
            <div className="space-y-2 pb-6 border-b border-gray-100">
              <div className="flex items-center space-x-3">
                <img 
                  src="/logo.png" 
                  alt="AmanahImmo Logo" 
                  className="h-10 w-auto object-contain rounded-lg mix-blend-multiply" 
                />
                <span className="font-extrabold text-2xl text-[#12372A]">
                  Amanah<span className="text-[#D4AF37]">Immo</span>
                </span>
              </div>
              <p className="text-gray-500 text-xs font-medium">Agence immobilière agréée à Dakar</p>
            </div>

            <div className="space-y-6">
              
              {/* Address */}
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 rounded-2xl bg-[#12372A]/10 text-[#12372A] flex items-center justify-center shrink-0">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-sm">Adresse</h4>
                  <p className="text-gray-600 text-sm">644 Niarry Tally, Dakar, Sénégal</p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 rounded-2xl bg-[#12372A]/10 text-[#12372A] flex items-center justify-center shrink-0">
                  <Phone className="w-6 h-6 text-[#12372A]" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-sm">Téléphone</h4>
                  <a href="tel:+221781571313" className="text-[#12372A] hover:text-[#D4AF37] font-bold text-base transition-colors">
                    78 157 13 13
                  </a>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 rounded-2xl bg-[#12372A]/10 text-[#12372A] flex items-center justify-center shrink-0">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-sm">Email</h4>
                  <a href="mailto:amanahimmo13@gmail.com" className="text-[#12372A] hover:underline text-sm font-medium">
                    amanahimmo13@gmail.com
                  </a>
                </div>
              </div>

              {/* WhatsApp */}
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 rounded-2xl bg-[#25D366]/20 text-[#25D366] flex items-center justify-center shrink-0">
                  <MessageCircle className="w-6 h-6 fill-[#25D366]" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-sm">WhatsApp</h4>
                  <a
                    href="https://wa.me/221781571313"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#25D366] font-bold text-sm hover:underline"
                  >
                    +221 78 157 13 13
                  </a>
                </div>
              </div>

            </div>

            {/* Direct WhatsApp CTA Button */}
            <div className="pt-4 border-t border-gray-100">
              <a
                href="https://wa.me/221781571313?text=Bonjour%20AmanahImmo,%20je%20souhaite%20un%20renseignement."
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-[#25D366] hover:bg-[#20ba59] text-white font-bold py-3.5 px-4 rounded-xl shadow flex items-center justify-center space-x-2 text-sm transition-all"
              >
                <MessageCircle className="w-5 h-5 fill-white" />
                <span>Ouvrir une discussion WhatsApp</span>
              </a>
            </div>

          </div>

          {/* Right 3 cols: Form */}
          <div className="lg:col-span-3 bg-white p-8 sm:p-10 rounded-3xl border border-gray-100 shadow-xl space-y-6">
            <div>
              <h3 className="text-2xl font-extrabold text-[#12372A]">Envoyez-nous un message</h3>
              <p className="text-gray-500 text-sm mt-1">Remplissez le formulaire ci-dessous et notre équipe vous recontactera très rapidement.</p>
            </div>

            {submitted ? (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 p-8 rounded-2xl text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-[#25D366] mx-auto" />
                <h4 className="font-bold text-xl">Message envoyé avec succès !</h4>
                <p className="text-sm text-gray-600">
                  Merci d'avoir contacté AmanahImmo. Notre équipe étudie votre demande et vous répondra dans les plus brefs délais.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-4 bg-[#12372A] text-white font-bold px-6 py-2.5 rounded-xl text-xs uppercase tracking-wider"
                >
                  Envoyer un autre message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Nom */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                      Nom complet *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Modou Diop"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#12372A] focus:border-transparent outline-none transition-all"
                    />
                  </div>

                  {/* Téléphone */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                      Téléphone *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="Ex: 77 000 00 00"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#12372A] focus:border-transparent outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Email */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                      Adresse Email
                    </label>
                    <input
                      type="email"
                      placeholder="Ex: nom@domaine.sn"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#12372A] focus:border-transparent outline-none transition-all"
                    />
                  </div>

                  {/* Sujet */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                      Sujet *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Recherche d'appartement, Vente..."
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#12372A] focus:border-transparent outline-none transition-all"
                    />
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                    Votre message *
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Précisez votre besoin immobilier..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#12372A] focus:border-transparent outline-none transition-all resize-none"
                  />
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#12372A] hover:bg-[#0d281e] text-white font-bold py-4 px-6 rounded-xl shadow-lg transition-all flex items-center justify-center space-x-2 text-sm uppercase tracking-wider"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Send className="w-4 h-4 text-[#D4AF37]" />
                      <span>Envoyer le message</span>
                    </>
                  )}
                </button>

              </form>
            )}

          </div>

        </div>
      </section>

      {/* GOOGLE MAPS EMBEDDED - Centered on Niarry Tally Dakar strictly as required by #15 */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xl space-y-4">
          <div className="flex items-center space-x-2">
            <MapPin className="w-5 h-5 text-[#D4AF37]" />
            <h3 className="text-xl font-extrabold text-[#12372A]">Notre géolocalisation à Niarry Tally</h3>
          </div>
          <div className="w-full h-80 rounded-2xl overflow-hidden border border-gray-200 relative bg-gray-100">
            <iframe
              title="AmanahImmo Google Maps Niarry Tally Dakar"
              width="100%"
              height="100%"
              frameBorder="0"
              src="https://maps.google.com/maps?q=Niarry%20Tally%20Dakar%20Senegal&t=&z=15&ie=UTF8&iwloc=&output=embed"
              loading="lazy"
            />
          </div>
        </div>
      </section>

    </div>
  );
};
