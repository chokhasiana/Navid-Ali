import React from 'react';
import { X, Calendar, Clock, Tag, BookOpen, Share2 } from 'lucide-react';
import { BlogPost } from '../../types';
import { LionFaceLogo } from '../common/LionFaceLogo';

interface BlogPostModalProps {
  post: BlogPost | null;
  isOpen: boolean;
  onClose: () => void;
}

export const BlogPostModal: React.FC<BlogPostModalProps> = ({ post, isOpen, onClose }) => {
  if (!isOpen || !post) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={post.title}
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <article
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-3xl bg-white border border-[#e5e3dc] shadow-2xl rounded-3xl p-6 sm:p-10 my-8 max-h-[90vh] overflow-y-auto text-stone-900"
      >
        {/* Top Action Bar */}
        <div className="flex items-center justify-between pb-4 border-b border-[#e7e5e0] mb-6">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-stone-500">
            <LionFaceLogo size={16} color="#b8860b" />
            <span className="text-gold font-medium">Navid Ali Bhatti Blog</span>
            <span aria-hidden="true" className="text-stone-300">·</span>
            <span>{post.category}</span>
          </div>

          <button
            onClick={onClose}
            aria-label="Schließen"
            className="p-2 text-stone-400 hover:text-stone-900 transition-colors cursor-pointer rounded-full hover:bg-stone-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Header Metadata */}
        <div className="space-y-4 mb-6">
          <h1 className="font-serif text-3xl sm:text-4xl font-light text-stone-900 leading-tight">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-stone-500">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-gold" />
              <span>{post.date}</span>
            </div>
            <span aria-hidden="true" className="text-stone-300">·</span>
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-gold" />
              <span>{post.readTime}</span>
            </div>
            <span aria-hidden="true" className="text-stone-300">·</span>
            <span className="text-gold font-medium">Autor: Navid Ali Bhatti (Schüler & Künstler)</span>
          </div>
        </div>

        {/* Curved Cover Picture */}
        {post.imageUrl && (
          <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl bg-stone-950 mb-8 border-2 border-[#c59b27]/30 shadow-lg">
            <img
              src={post.imageUrl}
              alt={post.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Summary Lead paragraph */}
        {post.summary && (
          <p className="text-base sm:text-lg font-light text-stone-800 leading-relaxed italic mb-8 border-l-2 border-[#c59b27] pl-4 bg-[#faf9f6] py-3 rounded-r-lg">
            {post.summary}
          </p>
        )}

        {/* Content Body */}
        <div className="space-y-6 text-stone-700 leading-relaxed font-light text-base sm:text-lg">
          {post.content.split('\n\n').map((paragraph, idx) => (
            <p key={idx}>{paragraph}</p>
          ))}
        </div>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="pt-8 mt-8 border-t border-[#e7e5e0] flex flex-wrap items-center gap-2">
            <Tag className="w-3.5 h-3.5 text-stone-400" />
            {post.tags.map((t, idx) => (
              <span
                key={idx}
                className="px-2.5 py-1 text-xs font-mono bg-stone-100 border border-stone-200 text-stone-600 rounded-md"
              >
                #{t}
              </span>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="pt-6 mt-6 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500 font-mono">
          <span>Studio &amp; Schüler-Portfolio Navid Ali Bhatti</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-stone-900 text-white rounded-lg text-xs uppercase tracking-wider font-medium cursor-pointer hover:bg-stone-800"
          >
            Zurück zur Übersicht
          </button>
        </div>
      </article>
    </div>
  );
};
