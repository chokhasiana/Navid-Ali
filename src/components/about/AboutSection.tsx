import React from 'react';
import { BookOpen, MapPin, Award, Mail, ExternalLink } from 'lucide-react';
import { ArtistProfile } from '../../types';
import { LionFaceLogo } from '../common/LionFaceLogo';

interface AboutSectionProps {
  profile: ArtistProfile;
  onNavigateContact: () => void;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ profile, onNavigateContact }) => {
  return (
    <section className="py-12 lg:py-20 border-b border-[#e7e5e0] bg-[#faf9f6]">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Main Grid: Portrait and Artist Statement */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start mb-20">
          {/* Left: Curved Studio Portrait with museum caption */}
          <div className="lg:col-span-5">
            <div className="relative border-2 border-[#c59b27]/30 rounded-3xl overflow-hidden bg-white shadow-2xl ring-4 ring-white/60">
              <img
                src="/art/artist_portrait.svg"
                alt="Navid Ali Bhatti in his studio"
                referrerPolicy="no-referrer"
                className="w-full aspect-[1/1] object-cover rounded-t-3xl"
              />
              <div className="p-4 bg-[#fcfbfa] border-t border-[#e7e5e0] text-xs font-mono text-stone-600 flex items-center justify-between">
                <span>
                  <strong className="text-gold font-medium">Navid Ali Bhatti</strong>, Berlin Studio
                </span>
                <span className="text-stone-400">2026</span>
              </div>
            </div>

            {/* Studio location & gallery credentials */}
            <div className="mt-6 p-5 bg-white border border-[#e5e3dc] rounded-2xl space-y-3 text-xs shadow-xs">
              <div className="flex items-start gap-2.5 text-stone-700">
                <MapPin className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                <div>
                  <span className="font-mono uppercase tracking-wider text-[11px] text-stone-500 block">
                    Studio Location
                  </span>
                  <span className="text-stone-900">{profile.contact.studioAddress}</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5 text-stone-700 pt-2 border-t border-stone-100">
                <Award className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                <div>
                  <span className="font-mono uppercase tracking-wider text-[11px] text-stone-500 block">
                    Gallery Representation
                  </span>
                  <span className="text-stone-900">{profile.contact.galleryRepresentation}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Artist Statement & Bio */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            <div className="flex items-center gap-2.5 text-xs uppercase tracking-[0.25em] text-stone-500 font-mono mb-3">
              <LionFaceLogo size={16} color="#b8860b" />
              <span className="text-gold font-medium">Artist Monograph &amp; Statement</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light text-stone-900 tracking-tight leading-tight mb-8">
              "We photograph the void not to document emptiness, but to reveal the geometry that remains when noise recedes."
            </h2>

            <div className="space-y-5 text-sm sm:text-base text-stone-700 font-light leading-relaxed">
              {profile.biography.map((paragraph, idx) => (
                <p key={idx}>{paragraph}</p>
              ))}
            </div>

            <div className="pt-8 mt-8 border-t border-[#e7e5e0] flex items-center gap-4">
              <button
                onClick={onNavigateContact}
                className="px-6 py-3 text-xs uppercase tracking-[0.2em] font-medium bg-stone-900 text-stone-50 hover:bg-stone-800 transition-colors rounded-sm cursor-pointer shadow-sm"
              >
                Inquire with Studio
              </button>
            </div>
          </div>
        </div>

        {/* Publications & Monographs Section */}
        <div className="mb-20">
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-stone-500 font-mono mb-6">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Published Monographs</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {profile.monographs.map((mono, idx) => (
              <div
                key={idx}
                className="p-6 bg-white border border-[#e5e3dc] rounded-sm flex flex-col justify-between gap-4 shadow-sm"
              >
                <div>
                  <span className="text-[11px] font-mono text-stone-500 uppercase tracking-widest block mb-1">
                    {mono.publisher} · {mono.year}
                  </span>
                  <h3 className="font-serif text-2xl font-light text-stone-900 mb-2">
                    {mono.title}
                  </h3>
                  <p className="text-xs text-stone-600 font-light">
                    {mono.pages}
                  </p>
                </div>
                <div className="text-[11px] font-mono text-stone-500 pt-3 border-t border-stone-100">
                  ISBN {mono.isbn}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Exhibitions Timeline */}
        <div>
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-stone-500 font-mono mb-8">
            <Award className="w-3.5 h-3.5" />
            <span>Exhibition History &amp; Provenance</span>
          </div>

          <div className="divide-y divide-[#e7e5e0] border-y border-[#e7e5e0]">
            {profile.exhibitions.map((ex, idx) => (
              <div
                key={idx}
                className="py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-sm"
              >
                <div className="flex items-center gap-4">
                  <span className="font-mono text-xs text-stone-500 w-12 shrink-0">
                    {ex.year}
                  </span>
                  <h4 className="font-serif text-lg text-stone-900 font-light">
                    {ex.title}
                  </h4>
                </div>

                <div className="flex items-center gap-4 text-xs text-stone-600 sm:text-right pl-16 sm:pl-0">
                  <span>{ex.venue}</span>
                  <span aria-hidden="true">·</span>
                  <span className="font-mono uppercase text-[11px] text-stone-500">
                    {ex.type}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
