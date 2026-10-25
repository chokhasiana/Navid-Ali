import React from 'react';
import { X, Trash2, ArrowRight, ShoppingBag, ShieldCheck } from 'lucide-react';
import { CartItem } from '../../types';

interface CartDrawerProps {
  isOpen: boolean;
  items: CartItem[];
  onClose: () => void;
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  onProceedToCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  items,
  onClose,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout,
}) => {
  if (!isOpen) return null;

  const totalAmount = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Collector Portfolio Drawer"
      className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex justify-end"
    >
      <div className="w-full max-w-md bg-[#faf9f6] border-l border-[#e7e5e0] h-full flex flex-col justify-between p-6 sm:p-8 overflow-y-auto shadow-2xl">
        {/* Top Header */}
        <div>
          <div className="flex items-center justify-between pb-6 border-b border-[#e7e5e0]">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-stone-900" />
              <h3 className="font-serif text-xl font-light text-stone-900 tracking-wide">
                Collector Portfolio
              </h3>
            </div>

            <button
              onClick={onClose}
              aria-label="Close Portfolio Drawer"
              className="p-1.5 text-stone-500 hover:text-black transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Items List */}
          <div className="py-6 space-y-6">
            {items.length === 0 ? (
              <div className="py-16 text-center text-stone-500">
                <p className="font-serif text-lg text-stone-900 mb-2">
                  Your portfolio is empty
                </p>
                <p className="text-xs font-light max-w-xs mx-auto">
                  Browse our gallery and editions catalog to reserve archival museum prints or publications.
                </p>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 p-4 bg-white border border-[#e5e3dc] shadow-xs rounded-2xl"
                >
                  {/* Curved Thumbnail Picture */}
                  <div className="w-20 h-20 bg-stone-950 border border-[#c59b27]/30 rounded-xl shrink-0 overflow-hidden shadow-xs">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="font-serif text-sm font-light text-stone-900 leading-tight">
                        {item.title}
                      </h4>
                      <p className="text-[11px] text-stone-500 font-mono mt-1">
                        {item.sizeName} · {item.framingName}
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-3 text-xs">
                      {/* Quantity Modifier */}
                      <div className="flex items-center gap-2 bg-stone-100 border border-stone-300 px-2 py-0.5 rounded-sm">
                        <button
                          onClick={() => onUpdateQuantity(item.id, -1)}
                          className="text-stone-600 hover:text-black font-mono px-1 cursor-pointer"
                        >
                          -
                        </button>
                        <span className="font-mono text-xs tabular-nums text-stone-900 font-medium">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.id, 1)}
                          className="text-stone-600 hover:text-black font-mono px-1 cursor-pointer"
                        >
                          +
                        </button>
                      </div>

                      {/* Price in Gold & Remove */}
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-gold font-semibold tabular-nums">
                          €{(item.unitPrice * item.quantity).toLocaleString()}
                        </span>
                        <button
                          onClick={() => onRemoveItem(item.id)}
                          className="text-stone-400 hover:text-rose-600 transition-colors cursor-pointer"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Bottom Checkout Section */}
        {items.length > 0 && (
          <div className="pt-6 border-t border-[#e7e5e0] space-y-4">
            <div className="flex items-center justify-between text-xs text-stone-600 font-mono">
              <span>Insured White-Glove Crate</span>
              <span className="text-emerald-700 font-medium">Complimentary</span>
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="text-stone-700 uppercase font-mono tracking-wider text-xs">
                Acquisition Subtotal
              </span>
              <span className="font-mono text-2xl font-semibold text-gold tabular-nums">
                €{totalAmount.toLocaleString()}
              </span>
            </div>

            <div className="flex items-center gap-2 text-[11px] text-stone-500 py-2">
              <ShieldCheck className="w-4 h-4 text-stone-700 shrink-0" />
              <span>Direct artist studio registration &amp; escrow invoice</span>
            </div>

            <button
              onClick={onProceedToCheckout}
              className="w-full py-3.5 text-xs uppercase tracking-[0.2em] font-medium bg-stone-900 text-stone-50 hover:bg-stone-800 transition-colors rounded-sm cursor-pointer flex items-center justify-center gap-2 shadow-sm"
            >
              <span>Proceed to Reservation</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
