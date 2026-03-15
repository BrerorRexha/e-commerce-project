import { useState, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import ProductImage from '../components/ProductImage';

type Step = 'shipping' | 'payment' | 'confirmation';

interface ShippingForm {
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  city: string;
  country: string;
  zip: string;
}

interface PaymentForm {
  cardNumber: string;
  expiry: string;
  cvv: string;
  nameOnCard: string;
}

const SHIPPING_INIT: ShippingForm = {
  firstName: '', lastName: '', email: '',
  address: '', city: '', country: 'United Kingdom', zip: '',
};

const PAYMENT_INIT: PaymentForm = {
  cardNumber: '', expiry: '', cvv: '', nameOnCard: '',
};

const STEPS: { id: Step; label: string }[] = [
  { id: 'shipping', label: 'Shipping' },
  { id: 'payment', label: 'Payment' },
  { id: 'confirmation', label: 'Confirmation' },
];

function formatCardNumber(value: string) {
  return value.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();
}

function formatExpiry(value: string) {
  const digits = value.replace(/\D/g, '').slice(0, 4);
  if (digits.length >= 3) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  return digits;
}

function generateOrderId() {
  return 'ORD-' + Math.random().toString(36).substring(2, 8).toUpperCase();
}

const inputClass =
  'w-full border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors';

const labelClass = 'block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1';

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  useNavigate(); // kept for future use

  const [step, setStep] = useState<Step>('shipping');
  const [shipping, setShipping] = useState<ShippingForm>(
    user ? { ...SHIPPING_INIT, firstName: user.name.split(' ')[0], lastName: user.name.split(' ')[1] ?? '', email: user.email } : SHIPPING_INIT
  );
  const [payment, setPayment] = useState<PaymentForm>(PAYMENT_INIT);
  const [orderId] = useState(generateOrderId);
  const [processing, setProcessing] = useState(false);

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <p className="text-gray-900 dark:text-gray-100 text-xl font-bold mb-4">Sign in to checkout</p>
        <Link to="/login" className="text-blue-500 hover:underline text-sm">Go to login</Link>
      </div>
    );
  }

  if (items.length === 0 && step !== 'confirmation') {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <p className="text-gray-900 dark:text-gray-100 text-xl font-bold mb-4">Your cart is empty</p>
        <Link to="/" className="text-blue-500 hover:underline text-sm">Continue shopping</Link>
      </div>
    );
  }

  const shipping_cost = totalPrice >= 50 ? 0 : 4.99;
  const tax = totalPrice * 0.08;
  const orderTotal = totalPrice + shipping_cost + tax;

  const handleShippingSubmit = (e: FormEvent) => {
    e.preventDefault();
    setStep('payment');
  };

  const handlePaymentSubmit = (e: FormEvent) => {
    e.preventDefault();
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      setStep('confirmation');
      clearCart();
    }, 1500);
  };

  const stepIndex = STEPS.findIndex((s) => s.id === step);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Progress bar */}
      <div className="mb-10">
        <div className="flex items-center justify-center gap-0">
          {STEPS.map((s, i) => (
            <div key={s.id} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                    i < stepIndex
                      ? 'bg-green-500 text-white'
                      : i === stepIndex
                      ? 'bg-blue-600 dark:bg-blue-500 text-white ring-4 ring-blue-100 dark:ring-blue-900'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-400'
                  }`}
                >
                  {i < stepIndex ? (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    i + 1
                  )}
                </div>
                <span className={`text-xs mt-1.5 font-medium ${i === stepIndex ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400 dark:text-gray-500'}`}>
                  {s.label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`w-24 h-0.5 mb-4 mx-2 transition-colors ${i < stepIndex ? 'bg-green-500' : 'bg-gray-200 dark:bg-gray-700'}`} />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form area */}
        <div className="lg:col-span-2">
          {/* ── Shipping step ── */}
          {step === 'shipping' && (
            <form onSubmit={handleShippingSubmit} className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-6 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-6">Shipping information</h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className={labelClass}>First name</label>
                  <input
                    required
                    className={inputClass}
                    value={shipping.firstName}
                    onChange={(e) => setShipping({ ...shipping, firstName: e.target.value })}
                    placeholder="Alex"
                  />
                </div>
                <div>
                  <label className={labelClass}>Last name</label>
                  <input
                    required
                    className={inputClass}
                    value={shipping.lastName}
                    onChange={(e) => setShipping({ ...shipping, lastName: e.target.value })}
                    placeholder="Johnson"
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className={labelClass}>Email address</label>
                <input
                  required
                  type="email"
                  className={inputClass}
                  value={shipping.email}
                  onChange={(e) => setShipping({ ...shipping, email: e.target.value })}
                  placeholder="alex@example.com"
                />
              </div>

              <div className="mb-4">
                <label className={labelClass}>Address</label>
                <input
                  required
                  className={inputClass}
                  value={shipping.address}
                  onChange={(e) => setShipping({ ...shipping, address: e.target.value })}
                  placeholder="42 Maple Street"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <div className="sm:col-span-1">
                  <label className={labelClass}>City</label>
                  <input
                    required
                    className={inputClass}
                    value={shipping.city}
                    onChange={(e) => setShipping({ ...shipping, city: e.target.value })}
                    placeholder="London"
                  />
                </div>
                <div>
                  <label className={labelClass}>Country</label>
                  <select
                    className={inputClass}
                    value={shipping.country}
                    onChange={(e) => setShipping({ ...shipping, country: e.target.value })}
                  >
                    {['United Kingdom', 'United States', 'Canada', 'Australia', 'Germany', 'France'].map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Postcode</label>
                  <input
                    required
                    className={inputClass}
                    value={shipping.zip}
                    onChange={(e) => setShipping({ ...shipping, zip: e.target.value })}
                    placeholder="SW1A 1AA"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 dark:bg-blue-500 text-white py-3 rounded-xl font-semibold text-sm hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
              >
                Continue to payment
              </button>
            </form>
          )}

          {/* ── Payment step ── */}
          {step === 'payment' && (
            <form onSubmit={handlePaymentSubmit} className="space-y-5">
              {/* Card preview */}
              <div
                className="relative h-44 rounded-2xl p-6 text-white overflow-hidden"
                style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 50%, #06b6d4 100%)' }}
              >
                {/* Decorative circles */}
                <div className="absolute -right-8 -top-8 w-40 h-40 bg-white/10 rounded-full" />
                <div className="absolute -right-2 -bottom-6 w-28 h-28 bg-white/10 rounded-full" />

                <div className="relative z-10 h-full flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <span className="text-sm font-semibold opacity-70 uppercase tracking-widest">ShopWave Pay</span>
                    <div className="flex gap-1">
                      <div className="w-8 h-8 bg-red-500 rounded-full opacity-90" />
                      <div className="w-8 h-8 bg-yellow-400 rounded-full opacity-90 -ml-3" />
                    </div>
                  </div>
                  <div>
                    <p className="text-lg font-mono tracking-widest mb-2 opacity-90">
                      {payment.cardNumber
                        ? payment.cardNumber.padEnd(19, '•').slice(0, 19)
                        : '•••• •••• •••• ••••'}
                    </p>
                    <div className="flex justify-between text-sm">
                      <span className="opacity-70">{payment.nameOnCard || 'CARDHOLDER NAME'}</span>
                      <span className="opacity-70">{payment.expiry || 'MM/YY'}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-6 shadow-sm">
                <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-6">Card details</h2>

                <div className="mb-4">
                  <label className={labelClass}>Card number</label>
                  <input
                    required
                    className={inputClass + ' font-mono'}
                    value={payment.cardNumber}
                    onChange={(e) => setPayment({ ...payment, cardNumber: formatCardNumber(e.target.value) })}
                    placeholder="1234 5678 9012 3456"
                    maxLength={19}
                  />
                </div>

                <div className="mb-4">
                  <label className={labelClass}>Name on card</label>
                  <input
                    required
                    className={inputClass}
                    value={payment.nameOnCard}
                    onChange={(e) => setPayment({ ...payment, nameOnCard: e.target.value.toUpperCase() })}
                    placeholder="ALEX JOHNSON"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className={labelClass}>Expiry date</label>
                    <input
                      required
                      className={inputClass + ' font-mono'}
                      value={payment.expiry}
                      onChange={(e) => setPayment({ ...payment, expiry: formatExpiry(e.target.value) })}
                      placeholder="MM/YY"
                      maxLength={5}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>CVV</label>
                    <input
                      required
                      className={inputClass + ' font-mono'}
                      value={payment.cvv}
                      onChange={(e) => setPayment({ ...payment, cvv: e.target.value.replace(/\D/g, '').slice(0, 4) })}
                      placeholder="•••"
                      maxLength={4}
                      type="password"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400 mb-6 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
                  <svg className="w-4 h-4 text-green-500 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                  Your payment is secured with 256-bit SSL encryption. This is a demo — no real charges are made.
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setStep('shipping')}
                    className="px-5 py-3 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-xl text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={processing}
                    className="flex-1 bg-blue-600 dark:bg-blue-500 text-white py-3 rounded-xl font-semibold text-sm hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors disabled:opacity-70 flex items-center justify-center gap-2"
                  >
                    {processing ? (
                      <>
                        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Processing...
                      </>
                    ) : (
                      `Pay $${orderTotal.toFixed(2)}`
                    )}
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* ── Confirmation step ── */}
          {step === 'confirmation' && (
            <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-8 shadow-sm text-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-5">
                <svg className="w-8 h-8 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Order confirmed!</h2>
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-1">Thank you, {shipping.firstName}. Your order has been placed.</p>
              <p className="text-gray-400 dark:text-gray-500 text-xs mb-6">A confirmation will be sent to {shipping.email}</p>

              <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 mb-6 inline-block">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Order reference</p>
                <p className="text-lg font-mono font-bold text-gray-900 dark:text-gray-100">{orderId}</p>
              </div>

              <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1 mb-8">
                <p>Delivering to: <span className="font-medium text-gray-900 dark:text-gray-200">{shipping.address}, {shipping.city}</span></p>
                <p>Estimated delivery: <span className="font-medium text-gray-900 dark:text-gray-200">3–5 business days</span></p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  to="/orders"
                  className="px-6 py-3 bg-blue-600 dark:bg-blue-500 text-white rounded-xl font-medium text-sm hover:bg-blue-700 transition-colors"
                >
                  View my orders
                </Link>
                <Link
                  to="/"
                  className="px-6 py-3 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-medium text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  Continue shopping
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Order summary sidebar */}
        {step !== 'confirmation' && (
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-5 shadow-sm sticky top-24">
              <h3 className="text-base font-bold text-gray-900 dark:text-gray-100 mb-4">
                Order ({items.length} {items.length === 1 ? 'item' : 'items'})
              </h3>

              <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                {items.map(({ product, quantity }) => (
                  <div key={product.id} className="flex items-center gap-3">
                    <div className="relative shrink-0 w-12 h-12 rounded-lg overflow-hidden">
                      <ProductImage product={product} index={0} size="sm" />
                      <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                        {quantity}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-gray-900 dark:text-gray-100 line-clamp-1">{product.name}</p>
                    </div>
                    <span className="text-xs font-semibold text-gray-900 dark:text-gray-100 shrink-0">
                      ${(product.price * quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-100 dark:border-gray-800 pt-3 space-y-2 text-sm">
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Subtotal</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Shipping</span>
                  <span>{shipping_cost === 0 ? <span className="text-green-500">Free</span> : `$${shipping_cost.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Tax</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-gray-900 dark:text-gray-100 text-base pt-1 border-t border-gray-100 dark:border-gray-800">
                  <span>Total</span>
                  <span>${orderTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
