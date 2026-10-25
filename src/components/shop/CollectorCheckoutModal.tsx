import React, { useState } from 'react';
import { X, CheckCircle2, ShieldCheck, Printer, FileText } from 'lucide-react';
import { CartItem, CollectorOrder } from '../../types';
import { checkoutCollectorInquiry } from '../../services/api';

interface CollectorCheckoutModalProps {
  isOpen: boolean;
  items: CartItem[];
  onClose: () => void;
  onClearCart: () => void;
}

export const CollectorCheckoutModal: React.FC<CollectorCheckoutModalProps> = ({
  isOpen,
  items,
  onClose,
  onClearCart,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    street: '',
    city: '',
    postalCode: '',
    country: 'Germany',
    notes: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [confirmedOrder, setConfirmedOrder] = useState<CollectorOrder | null>(null);

  if (!isOpen) return null;

  const totalAmount = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!formData.name.trim() || !formData.email.trim() || !formData.street.trim() || !formData.city.trim()) {
      setErrorMsg('Please complete all required fields.');
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await checkoutCollectorInquiry({
        customerName: formData.name,
        customerEmail: formData.email,
        phone: formData.phone,
        shippingAddress: {
          street: formData.street,
          city: formData.city,
          postalCode: formData.postalCode,
          country: formData.country,
        },
        notes: formData.notes,
        items,
        totalAmount,
      });

      setConfirmedOrder(result.order);
      onClearCart();
    } catch (err: any) {
      setErrorMsg(err.message || 'An error occurred during reservation.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Collector Acquisition Reservation"
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
    >
      <div className="w-full max-w-2xl bg-[#faf9f6] border border-[#e5e3dc] shadow-2xl rounded-sm p-6 sm:p-10 my-8 max-h-[90vh] overflow-y-auto text-stone-900">
        {confirmedOrder ? (
          /* Confirmation & Formal Pro-Forma Invoice Screen */
          <div className="space-y-6">
            <div className="text-center pb-6 border-b border-[#e7e5e0]">
              <CheckCircle2 className="w-12 h-12 text-stone-900 mx-auto mb-3" />
              <div className="flex items-center justify-center gap-2 text-xs uppercase tracking-widest text-stone-500 font-mono mb-1">
                <span>Acquisition Reservation Registered</span>
              </div>
              <h2 className="font-serif text-3xl font-light text-stone-900">
                Voucher Reference #{confirmedOrder.orderNumber}
              </h2>
              <p className="text-xs text-stone-600 font-light mt-2 max-w-lg mx-auto">
                Thank you, {confirmedOrder.customerName}. Your limited edition prints by Navid Ali Bhatti have been reserved in our inventory. A formal pro-forma invoice and registrar dispatch confirmation has been registered.
              </p>
            </div>

            {/* Invoice Breakdown */}
            <div className="bg-white border border-[#e5e3dc] p-6 rounded-sm space-y-4 shadow-xs">
              <div className="flex justify-between items-center text-xs font-mono text-stone-500 border-b border-stone-200 pb-3">
                <span>Reserved Items</span>
                <span>Subtotal</span>
              </div>

              {confirmedOrder.items.map((i, idx) => (
                <div key={idx} className="flex justify-between items-start text-xs text-stone-700">
                  <div>
                    <p className="font-serif text-stone-900 text-sm">{i.title}</p>
                    <p className="text-[11px] text-stone-500 font-mono">
                      {i.sizeName} · {i.framingName} (Qty: {i.quantity})
                    </p>
                  </div>
                  <span className="font-mono text-gold font-semibold tabular-nums">
                    €{(i.unitPrice * i.quantity).toLocaleString()}
                  </span>
                </div>
              ))}

              <div className="pt-3 border-t border-stone-200 flex justify-between items-center text-sm font-medium">
                <span className="text-stone-700 uppercase font-mono text-xs">Total Valuation</span>
                <span className="font-mono text-2xl text-gold tabular-nums font-semibold">
                  €{confirmedOrder.totalAmount.toLocaleString()} EUR
                </span>
              </div>
            </div>

            {/* Official Gallery Wire Instructions */}
            <div className="p-5 bg-stone-100/80 border border-stone-200 rounded-sm text-xs space-y-2">
              <div className="flex items-center gap-2 font-mono uppercase tracking-wider text-stone-800">
                <FileText className="w-3.5 h-3.5" />
                <span>Gallery Escrow Wire Information</span>
              </div>
              <p className="text-stone-600 font-light text-[11px]">
                Payment will be handled via verified SEPA Bank Wire or Gallery Escrow. The studio registrar will inspect your shipping destination and email your formal documentation within 24 hours.
              </p>
              <div className="grid grid-cols-2 gap-2 pt-2 font-mono text-[11px] text-stone-800">
                <div>
                  <span className="text-stone-500 block">Bank:</span>
                  <span>Deutsche Bank Berlin (Art Division)</span>
                </div>
                <div>
                  <span className="text-stone-500 block">Account Holder:</span>
                  <span>Studio Navid Ali Bhatti</span>
                </div>
                <div>
                  <span className="text-stone-500 block">IBAN:</span>
                  <span>DE89 1007 0000 0192 8472 00</span>
                </div>
                <div>
                  <span className="text-stone-500 block">Reference:</span>
                  <span className="text-stone-900 font-bold">{confirmedOrder.orderNumber}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-4">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 text-xs uppercase tracking-wider text-stone-700 hover:text-black border border-stone-300 rounded-sm cursor-pointer flex items-center gap-2"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Dossier</span>
              </button>

              <button
                onClick={onClose}
                className="px-6 py-2.5 text-xs uppercase tracking-[0.2em] font-medium bg-stone-900 text-stone-50 hover:bg-stone-800 rounded-sm cursor-pointer"
              >
                Return to Gallery
              </button>
            </div>
          </div>
        ) : (
          /* Checkout Reservation Form */
          <div>
            <div className="flex items-center justify-between pb-6 border-b border-[#e7e5e0] mb-6">
              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-stone-500 block mb-1">
                  Collector Acquisition Desk
                </span>
                <h2 className="font-serif text-2xl font-light text-stone-900">
                  Acquisition Reservation &amp; Pro-Forma Invoice
                </h2>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 text-stone-500 hover:text-black transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Reservation Policy Banner */}
            <div className="p-3.5 bg-stone-100 border border-stone-200 rounded-sm text-xs text-stone-700 flex items-start gap-3 mb-6">
              <ShieldCheck className="w-4 h-4 text-stone-700 shrink-0 mt-0.5" />
              <p className="font-light leading-relaxed">
                As standard fine art gallery policy, acquisitions of limited edition works by Navid Ali Bhatti are reserved under collector agreement. No unverified third-party credit card processing is run; our registrar reviews crate logistics and delivers your invoice with verified escrow details.
              </p>
            </div>

            {errorMsg && (
              <div className="p-3 bg-rose-950/40 border border-rose-800 text-rose-300 text-xs rounded-sm mb-6">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider font-mono text-stone-600 mb-1.5">
                    Collector Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Dr. Arthur Pendelton"
                    className="w-full px-3 py-2 bg-white border border-stone-300 rounded-sm text-xs text-stone-900 focus:outline-none focus:border-stone-600"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider font-mono text-stone-600 mb-1.5">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="collector@example.com"
                    className="w-full px-3 py-2 bg-white border border-stone-300 rounded-sm text-xs text-stone-900 focus:outline-none focus:border-stone-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider font-mono text-stone-600 mb-1.5">
                    Telephone (for Courier Notification)
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+49 170 1234567"
                    className="w-full px-3 py-2 bg-white border border-stone-300 rounded-sm text-xs text-stone-900 focus:outline-none focus:border-stone-600"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider font-mono text-stone-600 mb-1.5">
                    Country of Delivery *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    placeholder="Germany / Switzerland / France / USA"
                    className="w-full px-3 py-2 bg-white border border-stone-300 rounded-sm text-xs text-stone-900 focus:outline-none focus:border-stone-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider font-mono text-stone-600 mb-1.5">
                  Delivery Street Address *
                </label>
                <input
                  type="text"
                  required
                  value={formData.street}
                  onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                  placeholder="Street and house number"
                  className="w-full px-3 py-2 bg-white border border-stone-300 rounded-sm text-xs text-stone-900 focus:outline-none focus:border-stone-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider font-mono text-stone-600 mb-1.5">
                    Postal Code *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.postalCode}
                    onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                    placeholder="10115"
                    className="w-full px-3 py-2 bg-white border border-stone-300 rounded-sm text-xs text-stone-900 focus:outline-none focus:border-stone-600"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider font-mono text-stone-600 mb-1.5">
                    City *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="Berlin"
                    className="w-full px-3 py-2 bg-white border border-stone-300 rounded-sm text-xs text-stone-900 focus:outline-none focus:border-stone-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider font-mono text-stone-600 mb-1.5">
                  Curatorial or Framing Notes (Optional)
                </label>
                <textarea
                  rows={2}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Any custom framing dimensions, delivery dates, or collection requirements..."
                  className="w-full px-3 py-2 bg-white border border-stone-300 rounded-sm text-xs text-stone-900 focus:outline-none focus:border-stone-600 resize-none"
                />
              </div>

              {/* Order total & submission */}
              <div className="pt-4 border-t border-[#e7e5e0] flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-stone-500 font-mono block">
                    Acquisition Total ({items.length} items)
                  </span>
                  <span className="font-mono text-2xl text-gold font-semibold tabular-nums">
                    €{totalAmount.toLocaleString()}
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-3 text-xs uppercase tracking-[0.2em] font-medium bg-stone-900 text-stone-50 hover:bg-stone-800 transition-colors rounded-sm cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? 'Registering...' : 'Register Acquisition'}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
