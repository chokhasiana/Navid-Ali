import React, { useState, useEffect } from 'react';
import { X, Upload, Sparkles, Image as ImageIcon, BookOpen } from 'lucide-react';
import { BlogPost } from '../../types';
import { createBlogPost, updateBlogPost } from '../../services/api';

interface BlogEditorModalProps {
  isOpen: boolean;
  postToEdit?: BlogPost | null;
  onClose: () => void;
  onPostSaved: (post: BlogPost) => void;
}

const CATEGORIES: BlogPost['category'][] = [
  'Kreativprozess',
  'Schulprojekt',
  'Fotografie',
  'Gedanken',
  'Ausstellung',
];

const PRESET_BLOG_IMAGES = [
  { label: 'Nebel & Monolith', url: '/art/monolith_fog.svg' },
  { label: 'Indigoblaues Licht', url: '/art/chroma_void.svg' },
  { label: 'Küste & Basaltsäulen', url: '/art/basalt_stack.svg' },
  { label: 'Beton im Regen', url: '/art/cantilever_rain.svg' },
  { label: 'Porträt im Atelier', url: '/art/artist_portrait.svg' },
];

export const BlogEditorModal: React.FC<BlogEditorModalProps> = ({
  isOpen,
  postToEdit,
  onClose,
  onPostSaved,
}) => {
  const isEditing = Boolean(postToEdit);

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<BlogPost['category']>('Kreativprozess');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('/art/monolith_fog.svg');
  const [tagsInput, setTagsInput] = useState('Skizzenbuch, Kunstunterricht');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (postToEdit) {
      setTitle(postToEdit.title);
      setCategory(postToEdit.category);
      setSummary(postToEdit.summary);
      setContent(postToEdit.content);
      setImageUrl(postToEdit.imageUrl || '/art/monolith_fog.svg');
      setTagsInput(postToEdit.tags?.join(', ') || '');
    } else {
      setTitle('');
      setCategory('Kreativprozess');
      setSummary('');
      setContent('');
      setImageUrl('/art/monolith_fog.svg');
      setTagsInput('Skizzenbuch, Kunstunterricht');
    }
    setErrorMsg(null);
  }, [postToEdit, isOpen]);

  if (!isOpen) return null;

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 15 * 1024 * 1024) {
      setErrorMsg('Bilddatei ist zu groß (maximal 15 MB).');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setImageUrl(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      setErrorMsg('Bitte Titel und Beitragstext ausfüllen.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    try {
      let saved: BlogPost;
      if (isEditing && postToEdit) {
        saved = await updateBlogPost(postToEdit.id, {
          title,
          category,
          summary,
          content,
          imageUrl,
          tags,
        });
      } else {
        saved = await createBlogPost({
          title,
          category,
          summary,
          content,
          imageUrl,
          tags,
        });
      }
      onPostSaved(saved);
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Speichern fehlgeschlagen.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={isEditing ? 'Blogbeitrag bearbeiten' : 'Neuen Blogbeitrag verfassen'}
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto text-stone-900"
    >
      <div className="w-full max-w-2xl bg-[#faf9f6] border border-[#e5e3dc] shadow-2xl rounded-3xl p-5 sm:p-8 my-6 max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#e7e5e0] mb-5">
          <div className="flex items-center gap-2.5">
            <BookOpen className="w-5 h-5 text-gold" />
            <div>
              <h2 className="font-serif text-2xl font-light text-stone-900">
                {isEditing ? 'Blogbeitrag bearbeiten' : 'Neuen Beitrag verfassen'}
              </h2>
              <p className="text-xs text-stone-500 font-light mt-0.5">
                Schüler-Portfolio &amp; Notizen von <span className="text-gold font-medium">Navid Ali Bhatti</span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Schließen"
            className="p-2 text-stone-400 hover:text-stone-900 transition-colors cursor-pointer rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {errorMsg && (
          <div className="p-3 mb-5 bg-rose-50 border border-rose-300 text-rose-900 text-xs rounded-xl font-mono">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Cover Picture & Upload */}
          <div>
            <label className="block text-xs uppercase tracking-wider font-mono text-stone-600 mb-1.5 font-semibold">
              Titelbild / Skizze (Foto oder Upload)
            </label>

            <div className="relative aspect-[16/9] w-full bg-stone-950 border-2 border-[#c59b27]/30 rounded-2xl overflow-hidden shadow-sm mb-3 flex items-center justify-center">
              {imageUrl ? (
                <img src={imageUrl} alt="Cover Preview" className="w-full h-full object-cover" />
              ) : (
                <div className="text-stone-500 text-center p-4">
                  <ImageIcon className="w-8 h-8 mx-auto mb-1 opacity-40" />
                  <span className="text-xs font-mono">Kein Bild gewählt</span>
                </div>
              )}
            </div>

            {/* Mobile-Friendly File Upload Button */}
            <div className="flex flex-wrap items-center gap-2">
              <label className="px-4 py-2.5 text-xs font-medium bg-white hover:bg-stone-50 border border-stone-300 text-stone-800 rounded-xl cursor-pointer shadow-xs inline-flex items-center gap-2 transition-colors">
                <Upload className="w-4 h-4 text-gold" />
                <span>Foto von Kamera / Galerie wählen</span>
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handleImageFileChange}
                  className="hidden"
                />
              </label>

              <div className="flex items-center gap-1.5 overflow-x-auto py-1 max-w-full">
                {PRESET_BLOG_IMAGES.map((p, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setImageUrl(p.url)}
                    className={`text-[10px] px-2.5 py-1 rounded-lg border whitespace-nowrap cursor-pointer transition-colors ${
                      imageUrl === p.url
                        ? 'bg-stone-900 text-white border-stone-900'
                        : 'bg-white border-stone-200 text-stone-600 hover:border-stone-400'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs uppercase tracking-wider font-mono text-stone-600 mb-1.5 font-semibold">
              Titel des Beitrags *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="z. B. Skizzenbuch Notizen: Mein Kunstprojekt im Schulatelier"
              className="w-full px-3.5 py-2.5 bg-white border border-stone-300 rounded-xl text-sm text-stone-900 focus:outline-none focus:border-[#c59b27]"
            />
          </div>

          {/* Category & Tags */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase tracking-wider font-mono text-stone-600 mb-1.5 font-semibold">
                Kategorie
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full px-3.5 py-2.5 bg-white border border-stone-300 rounded-xl text-xs text-stone-900 focus:outline-none focus:border-[#c59b27] font-mono"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider font-mono text-stone-600 mb-1.5 font-semibold">
                Tags (kommagetrennt)
              </label>
              <input
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="Skizzen, Malerei, Schule"
                className="w-full px-3.5 py-2.5 bg-white border border-stone-300 rounded-xl text-xs text-stone-900 focus:outline-none focus:border-[#c59b27]"
              />
            </div>
          </div>

          {/* Short Summary */}
          <div>
            <label className="block text-xs uppercase tracking-wider font-mono text-stone-600 mb-1.5 font-semibold">
              Kurzbeschreibung / Teaser
            </label>
            <textarea
              rows={2}
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="Ein kurzer Einleitungssatz für die Blog-Übersicht..."
              className="w-full px-3.5 py-2 bg-white border border-stone-300 rounded-xl text-xs text-stone-900 focus:outline-none focus:border-[#c59b27] resize-none"
            />
          </div>

          {/* Full Content */}
          <div>
            <label className="block text-xs uppercase tracking-wider font-mono text-stone-600 mb-1.5 font-semibold">
              Vollständiger Text / Beitrag *
            </label>
            <textarea
              rows={6}
              required
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Schreibe hier über deinen Entstehungsprozess, Gedanken, verwendete Materialien, Techniken oder Schulaufgaben..."
              className="w-full px-3.5 py-2.5 bg-white border border-stone-300 rounded-xl text-sm text-stone-900 focus:outline-none focus:border-[#c59b27] font-light leading-relaxed resize-y"
            />
          </div>

          {/* Action buttons */}
          <div className="pt-4 border-t border-[#e7e5e0] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-xs uppercase tracking-wider text-stone-600 hover:text-stone-900 font-medium rounded-xl cursor-pointer"
            >
              Abbrechen
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 text-xs uppercase tracking-wider font-medium bg-stone-900 text-white hover:bg-stone-800 rounded-xl cursor-pointer shadow-sm disabled:opacity-50 flex items-center gap-2"
            >
              <Sparkles className="w-3.5 h-3.5 text-gold-light" />
              <span>{isSubmitting ? 'Wird gespeichert...' : isEditing ? 'Änderungen speichern' : 'Beitrag veröffentlichen'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
