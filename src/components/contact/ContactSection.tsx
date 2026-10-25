import React, { useState } from 'react';
import { Mail, CheckCircle2, AlertCircle, Send, MapPin, Building2 } from 'lucide-react';
import { submitContactInquiry } from '../../services/api';
import { LionFaceLogo } from '../common/LionFaceLogo';

interface ContactSectionProps {
  initialArtworkRef?: string;
  onClearArtworkRef?: () => void;
}

export const ContactSection: React.FC<ContactSectionProps> = ({
  initialArtworkRef,
  onClearArtworkRef,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    type: initialArtworkRef ? 'acquisition' : 'general',
    subject: initialArtworkRef ? `Acquisition Inquiry: ${initialArtworkRef}` : '',
    message: initialArtworkRef
      ? `Dear Navid Ali Bhatti Studio,\n\nI am inquiring regarding the availability, edition provenance, and private acquisition terms for "${initialArtworkRef}".\n\nPlease send the collector dossier.`
      : '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [feedbackMsg, setFeedbackMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('idle');
    setFeedbackMsg('');

    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setStatus('error');
      setFeedbackMsg('Please fill in your name, email address, and message.');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await submitContactInquiry({
        ...formData,
        artworkReference: initialArtworkRef,
      });

      setStatus('success');
      setFeedbackMsg(response.message);
      setFormData({
        name: '',
        email: '',
        type: 'general',
        subject: '',
        message: '',
      });
      if (onClearArtworkRef) onClearArtworkRef();
    } catch (err: any) {
      setStatus('error');
      setFeedbackMsg(err.message || 'Transmission failed. Please check your network connection.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-12 lg:py-20 border-b border-[#e7e5e0] bg-[#faf9f6]">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Left Column: Studio Representation & Contacts */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2.5 text-xs uppercase tracking-[0.25em] text-stone-500 font-mono mb-2">
                <LionFaceLogo size={16} color="#b8860b" />
                <span className="text-gold font-medium">Studio Correspondence</span>
                <span aria-hidden="true" className="text-stone-300">·</span>
                <span>Acquisitions &amp; Press</span>
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl font-light text-stone-900 tracking-tight mb-6">
                Get in Touch with <span className="text-gold font-medium">Navid Ali Bhatti</span> Studio
              </h2>

              <p className="text-sm text-stone-600 font-light leading-relaxed mb-8">
                For private collector acquisitions, museum exhibition loans, institutional monographs, or press reviews, please transmit your inquiry via the studio desk or contact gallery representation.
              </p>

              <div className="space-y-4 text-xs text-stone-700">
                <div className="p-4 bg-white border border-[#e5e3dc] rounded-2xl shadow-xs">
                  <div className="flex items-center gap-2 font-mono uppercase tracking-wider text-gold mb-1 font-medium">
                    <Mail className="w-3.5 h-3.5" />
                    <span>Studio Desk</span>
                  </div>
                  <p className="text-stone-900 font-mono font-medium">studio@navidalibhatti.art</p>
                  <p className="text-stone-500 text-[11px] mt-0.5">Response window: 24 business hours</p>
                </div>

                <div className="p-4 bg-white border border-[#e5e3dc] rounded-2xl shadow-xs">
                  <div className="flex items-center gap-2 font-mono uppercase tracking-wider text-gold mb-1 font-medium">
                    <Building2 className="w-3.5 h-3.5" />
                    <span>Primary Representation</span>
                  </div>
                  <p className="text-stone-900 font-serif text-sm">Galerie Nordenfalk</p>
                  <p className="text-stone-600 text-[11px] mt-0.5">Lindenstraße 34, 10969 Berlin, Germany</p>
                </div>

                <div className="p-4 bg-white border border-[#e5e3dc] rounded-sm shadow-xs">
                  <div className="flex items-center gap-2 font-mono uppercase tracking-wider text-stone-500 mb-1">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>Artist Studio Visit</span>
                  </div>
                  <p className="text-stone-600 text-xs">
                    Private viewing appointments in the Berlin and Zürich studios are scheduled strictly by confirmed appointment.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-[#e7e5e0] text-xs font-mono text-stone-500">
              USt-IdNr.: DE 319 824 091 · All data processed according to EU-DSGVO Art. 13.
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-7 bg-white border border-[#e5e3dc] shadow-md p-8 sm:p-10 rounded-sm">
            {initialArtworkRef && (
              <div className="mb-6 p-3 bg-stone-100 border border-stone-200 rounded-sm flex items-center justify-between text-xs">
                <span className="text-stone-700">
                  Referenced Artwork: <strong className="text-stone-900 font-serif">{initialArtworkRef}</strong>
                </span>
                {onClearArtworkRef && (
                  <button
                    onClick={onClearArtworkRef}
                    className="text-stone-500 hover:text-black text-[11px] uppercase tracking-wider cursor-pointer"
                  >
                    Clear Reference
                  </button>
                )}
              </div>
            )}

            {status === 'success' && (
              <div className="mb-6 p-4 bg-emerald-50 border border-emerald-300 rounded-sm flex items-start gap-3 text-xs text-emerald-900">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <p className="font-light leading-relaxed">{feedbackMsg}</p>
              </div>
            )}

            {status === 'error' && (
              <div className="mb-6 p-4 bg-rose-50 border border-rose-300 rounded-sm flex items-start gap-3 text-xs text-rose-900">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <p className="font-light leading-relaxed">{feedbackMsg}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs uppercase tracking-wider font-mono text-stone-600 mb-1.5">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Helena Vance"
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-sm text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:border-stone-600"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider font-mono text-stone-600 mb-1.5">
                    Your Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="helena@collection.org"
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-sm text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:border-stone-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs uppercase tracking-wider font-mono text-stone-600 mb-1.5">
                    Inquiry Nature
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-sm text-xs text-stone-900 focus:outline-none focus:border-stone-600 cursor-pointer"
                  >
                    <option value="acquisition">Private Collector Acquisition</option>
                    <option value="exhibition">Curatorial &amp; Exhibition Proposal</option>
                    <option value="press">Press &amp; Monograph Editorial</option>
                    <option value="commission">Bespoke Architectural Commission</option>
                    <option value="general">General Studio Inquiry</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider font-mono text-stone-600 mb-1.5">
                    Subject Heading
                  </label>
                  <input
                    type="text"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="e.g. Acquisition Inquiry regarding Monolith IV"
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-sm text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:border-stone-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider font-mono text-stone-600 mb-1.5">
                  Message *
                </label>
                <textarea
                  rows={5}
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Detail your request, edition requirements, institutional background, or preferred studio timeline..."
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-sm text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:border-stone-600 resize-none leading-relaxed"
                />
              </div>

              <div className="pt-2 flex items-center justify-between">
                <span className="text-[11px] text-stone-500 font-mono">
                  Messages are encrypted and transmitted directly to the studio desk.
                </span>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-3 text-xs uppercase tracking-[0.2em] font-medium bg-stone-900 text-stone-50 hover:bg-stone-800 transition-colors rounded-sm cursor-pointer disabled:opacity-50 flex items-center gap-2 shrink-0 shadow-sm"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSubmitting ? 'Transmitting...' : 'Send Message'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};
