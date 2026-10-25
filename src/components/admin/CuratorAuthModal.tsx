import React, { useState } from 'react';
import { X, Lock, KeyRound, AlertCircle, Check } from 'lucide-react';
import { loginAdmin } from '../../services/api';

interface CuratorAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const CuratorAuthModal: React.FC<CuratorAuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [passkey, setPasskey] = useState<string>('164325');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsSubmitting(true);

    try {
      await loginAdmin(passkey);
      onSuccess();
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Invalid master passkey.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Curator Authentication"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
    >
      <div className="w-full max-w-md bg-[#faf9f6] border border-[#e5e3dc] shadow-2xl rounded-sm p-6 sm:p-8 text-stone-900">
        <div className="flex items-center justify-between pb-4 border-b border-[#e7e5e0] mb-6">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-sm bg-stone-100 border border-stone-200 flex items-center justify-center">
              <Lock className="w-4 h-4 text-stone-800" />
            </div>
            <div>
              <h3 className="font-serif text-xl font-light text-stone-900">
                Curator Authorization
              </h3>
              <p className="text-[11px] font-mono text-stone-500">
                Navid Ali Bhatti Studio Management
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close"
            className="p-1 text-stone-400 hover:text-stone-900 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {errorMsg && (
          <div className="p-3 mb-4 bg-rose-50 border border-rose-300 text-rose-900 text-xs rounded-sm flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs uppercase tracking-wider font-mono text-stone-600 mb-1.5 font-medium">
              Studio Password
            </label>
            <div className="relative">
              <input
                type="password"
                required
                value={passkey}
                onChange={(e) => setPasskey(e.target.value)}
                placeholder="Enter password"
                autoFocus
                className="w-full px-3.5 py-2.5 bg-white border border-stone-300 rounded-sm text-sm text-stone-900 font-mono tracking-widest focus:outline-none focus:border-stone-800"
              />
              <KeyRound className="absolute right-3 top-3 w-4 h-4 text-stone-400 pointer-events-none" />
            </div>
            <p className="text-[11px] font-mono text-stone-500 mt-1.5">
              Configured master password: <span className="font-bold text-stone-900">164325</span>
            </p>
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={onClose}
              className="text-xs uppercase tracking-wider text-stone-500 hover:text-stone-900 cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 text-xs uppercase tracking-[0.2em] font-medium bg-stone-900 text-stone-50 hover:bg-stone-800 rounded-sm shadow-sm transition-colors cursor-pointer flex items-center gap-2"
            >
              <Check className="w-3.5 h-3.5" />
              <span>{isSubmitting ? 'Verifying...' : 'Unlock Live Edit'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
