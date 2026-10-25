import React, { useState } from 'react';
import { X, User, Check, Sparkles } from 'lucide-react';
import { ArtistProfile } from '../../types';
import { updateProfile } from '../../services/api';

interface ArtistProfileModalProps {
  isOpen: boolean;
  profile: ArtistProfile;
  onClose: () => void;
  onProfileUpdated: (updated: ArtistProfile) => void;
}

export const ArtistProfileModal: React.FC<ArtistProfileModalProps> = ({
  isOpen,
  profile,
  onClose,
  onProfileUpdated,
}) => {
  const [formData, setFormData] = useState<ArtistProfile>(profile);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const res = await updateProfile(formData);
      onProfileUpdated(res.profile);
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to update profile.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBioChange = (index: number, text: string) => {
    const updatedBio = [...formData.biography];
    updatedBio[index] = text;
    setFormData((prev) => ({ ...prev, biography: updatedBio }));
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Edit Artist Monograph and Bio"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto text-stone-900"
    >
      <div className="w-full max-w-2xl bg-[#faf9f6] border border-[#e5e3dc] shadow-2xl rounded-sm p-6 sm:p-8 my-8 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-[#e7e5e0] mb-6">
          <div className="flex items-center gap-2.5">
            <User className="w-5 h-5 text-stone-800" />
            <div>
              <h2 className="font-serif text-2xl font-light text-stone-900">
                Live Edit: Artist Profile &amp; Bio
              </h2>
              <p className="text-xs text-stone-500 font-light mt-0.5">
                Update artist monograph statement, studio location, and contact information.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close"
            className="p-1.5 text-stone-400 hover:text-stone-900 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {errorMsg && (
          <div className="p-3 mb-4 bg-rose-50 border border-rose-300 text-rose-900 text-xs rounded-sm">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs uppercase tracking-wider font-mono text-stone-600 mb-1">
              Artist Full Name
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
              className="w-full px-3.5 py-2 bg-white border border-stone-300 rounded-sm text-sm text-stone-900 focus:outline-none focus:border-stone-600"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider font-mono text-stone-600 mb-1">
              Disciplinary Title / Practice
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
              className="w-full px-3.5 py-2 bg-white border border-stone-300 rounded-sm text-xs text-stone-900 focus:outline-none focus:border-stone-600"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider font-mono text-stone-600 mb-1">
              Studio Base &amp; Field Offices
            </label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData((prev) => ({ ...prev, location: e.target.value }))}
              placeholder="e.g. Berlin / Lahore / Zürich"
              className="w-full px-3.5 py-2 bg-white border border-stone-300 rounded-sm text-xs text-stone-900 focus:outline-none focus:border-stone-600 font-mono"
            />
          </div>

          <div className="space-y-3 pt-2">
            <label className="block text-xs uppercase tracking-widest font-mono text-stone-600 font-semibold">
              Biography Paragraphs
            </label>
            {formData.biography.map((para, idx) => (
              <div key={idx}>
                <span className="text-[10px] font-mono uppercase text-stone-400 block mb-0.5">
                  Paragraph {idx + 1}
                </span>
                <textarea
                  rows={3}
                  value={para}
                  onChange={(e) => handleBioChange(idx, e.target.value)}
                  className="w-full px-3.5 py-2 bg-white border border-stone-300 rounded-sm text-xs text-stone-900 focus:outline-none focus:border-stone-600 font-light leading-relaxed"
                />
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs uppercase tracking-wider font-mono text-stone-600 mb-1">
                Studio Email
              </label>
              <input
                type="email"
                value={formData.contact.studioEmail}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    contact: { ...prev.contact, studioEmail: e.target.value },
                  }))
                }
                className="w-full px-3.5 py-2 bg-white border border-stone-300 rounded-sm text-xs text-stone-900 font-mono focus:outline-none focus:border-stone-600"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider font-mono text-stone-600 mb-1">
                Studio Address
              </label>
              <input
                type="text"
                value={formData.contact.studioAddress}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    contact: { ...prev.contact, studioAddress: e.target.value },
                  }))
                }
                className="w-full px-3.5 py-2 bg-white border border-stone-300 rounded-sm text-xs text-stone-900 focus:outline-none focus:border-stone-600"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#e7e5e0]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs uppercase tracking-wider text-stone-600 hover:text-black cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 text-xs uppercase tracking-[0.2em] font-medium bg-stone-900 text-stone-50 hover:bg-stone-800 rounded-sm shadow-sm transition-colors cursor-pointer flex items-center gap-2"
            >
              <Check className="w-3.5 h-3.5" />
              <span>{isSubmitting ? 'Saving Profile...' : 'Save Profile'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
