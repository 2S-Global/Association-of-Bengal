/**
 * src/components/payments/StripePaymentForm.tsx
 *
 * Reusable Stripe payment component using @stripe/react-stripe-js.
 * Renders Stripe's hosted card element (PCI-compliant, in-app, no redirect).
 */

'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { loadStripe, Stripe } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import axios from 'axios';
import { Loader2, AlertCircle, Lock} from 'lucide-react';

const API_BASE = `${process.env.NEXT_PUBLIC_API_URL || "https://balc.albdglobal.org"}/api/v1`;

// Keep a global cache of Stripe promises keyed by publishable key to avoid recreating on every render
const stripePromises: Record<string, Promise<Stripe | null>> = {};

function getStripePromise(publishableKey: string) {
  if (!stripePromises[publishableKey]) {
    stripePromises[publishableKey] = loadStripe(publishableKey);
  }
  return stripePromises[publishableKey];
}

// ── Stripe appearance theme ───────────────────────────────────────────────────
const STRIPE_APPEARANCE = {
  theme: 'stripe' as const,
  variables: {
    colorPrimary: '#635BFF',
    colorBackground: '#ffffff',
    colorText: '#1a1a2e',
    colorDanger: '#ef4444',
    fontFamily: '"Inter", "Segoe UI", system-ui, sans-serif',
    borderRadius: '10px',
    spacingUnit: '4px',
  },
  rules: {
    '.Input': {
      border: '1.5px solid #e5e7eb',
      boxShadow: 'none',
      padding: '12px 14px',
    },
    '.Input:focus': {
      border: '1.5px solid #635BFF',
      boxShadow: '0 0 0 3px rgba(99,91,255,0.12)',
    },
    '.Label': {
      fontSize: '13px',
      fontWeight: '600',
      color: '#374151',
    },
  },
};

// ── Inner form (needs Stripe context from <Elements>) ─────────────────────────
interface CheckoutFormProps {
  clientSecret: string;
  displayAmount: number | string;
  displaySymbol: string;
  donationType: string;
  originalAmount?: number | string;
  originalCurrency?: string;
  onSuccess: (donation: any) => void;
  onCancel: () => void;
}

function CheckoutForm({
  clientSecret,
  displayAmount,
  displaySymbol,
  donationType,
  originalAmount,
  originalCurrency,
  onSuccess,
  onCancel,
}: CheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setIsLoading(true);
    setErrorMsg('');

    try {
      const cardElement = elements.getElement(CardElement);
      if (!cardElement) {
        throw new Error('Card element not found');
      }

      const { error, paymentIntent } =
        await stripe.confirmCardPayment(clientSecret, {
          payment_method: {
            card: cardElement,
          },
        });

      if (error) {
        setErrorMsg(error.message || 'Payment failed. Please try again.');
        setIsLoading(false);
        return;
      }

      if (paymentIntent?.status === 'succeeded') {
        const token = localStorage.getItem('token') || localStorage.getItem('accessToken');
        const response = await axios.post(
          `${API_BASE}/payments/stripe/confirm`,
          {
            paymentIntentId: paymentIntent.id,
            donationType,
            originalAmount,
            originalCurrency,
          },
          {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
          }
        );
        const donation = response.data.data || response.data;
        onSuccess(donation);
      } else {
        setErrorMsg(`Unexpected payment status: ${paymentIntent?.status}`);
      }
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || err.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Card brand graphic header */}
      <div style={{
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
        borderRadius: 12, padding: '16px 20px', marginBottom: 20,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <div>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 11, margin: 0, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            Secure Payment
          </p>
          <p style={{ color: '#fff', fontSize: 22, fontWeight: 800, margin: '4px 0 0', letterSpacing: '-0.02em' }}>
            {displaySymbol}{Number(displayAmount).toLocaleString()}
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ background: 'white', borderRadius: 4, padding: '3px 8px', fontWeight: 900, color: '#635BFF', fontSize: 13, fontStyle: 'italic' }}>stripe</span>
        </div>
      </div>

      {/* Stripe-hosted card element */}
      <div style={{ marginBottom: 20 }}>
        <CardElement
          options={{
            hidePostalCode: true,
            style: {
              base: {
                fontSize: '16px',
                color: '#1a1a2e',
              },
              invalid: {
                color: '#ef4444',
              },
            },
          }}
        />
      </div>

      {/* Error message */}
      {errorMsg && (
        <div style={{
          background: '#fef2f2', border: '1px solid #fecaca',
          borderRadius: 8, padding: '10px 14px', marginBottom: 16,
          color: '#dc2626', fontSize: 13, display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <AlertCircle style={{ width: 18, height: 18, flexShrink: 0 }} />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Action buttons */}
      <div style={{ display: 'flex', gap: 10 }}>
        <button
          type="button"
          onClick={onCancel}
          disabled={isLoading}
          style={{
            flex: 1, padding: '12px 0', border: '1.5px solid #e5e7eb',
            borderRadius: 10, background: 'white', color: '#374151',
            fontWeight: 600, fontSize: 14, cursor: 'pointer', fontFamily: 'inherit',
          }}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={!stripe || isLoading}
          style={{
            flex: 2, padding: '12px 0',
            background: isLoading ? '#9ca3af' : 'linear-gradient(135deg, #635BFF, #4f46e5)',
            border: 'none', borderRadius: 10, color: 'white',
            fontWeight: 700, fontSize: 14, cursor: isLoading ? 'not-allowed' : 'pointer',
            fontFamily: 'inherit', display: 'flex', alignItems: 'center',
            justifyContent: 'center', gap: 8,
            boxShadow: isLoading ? 'none' : '0 4px 12px rgba(99,91,255,0.35)',
            transition: 'all 0.2s ease',
          }}
        >
          {isLoading ? (
            <>
              <Loader2 style={{ width: 16, height: 16, animation: 'stripe-spin 0.7s linear infinite' }} />
              Processing…
            </>
          ) : (
            <>
              <Lock style={{ width: 16, height: 16 }} />
              Pay {displaySymbol}{Number(displayAmount).toLocaleString()}
            </>
          )}
        </button>
      </div>

      <style>{`
        @keyframes stripe-spin { to { transform: rotate(360deg); } }
      `}</style>
    </form>
  );
}

// ── Main exported component ───────────────────────────────────────────────────
interface StripePaymentFormProps {
  amount: number | string;
  currency?: string;
  displaySymbol?: string;
  displayAmount?: number | string;
  donationType?: string;
  originalAmount?: number | string;
  originalCurrency?: string;
  onSuccess: (donation: any) => void;
  onCancel: () => void;
}

export default function StripePaymentForm({
  amount,
  currency = 'usd',
  displaySymbol = '$',
  displayAmount,
  donationType = 'General Donation',
  originalAmount,
  originalCurrency,
  onSuccess,
  onCancel,
}: StripePaymentFormProps) {
  const [stripePromise, setStripePromise] = useState<Promise<Stripe | null> | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [initError, setInitError] = useState('');
  const [isInitialising, setIsInitialising] = useState(true);
  const initInFlight = useRef(false);

  const initIntent = useCallback(async () => {
    if (initInFlight.current) return;
    initInFlight.current = true;
    setIsInitialising(true);
    setInitError('');

    try {
      const token = localStorage.getItem('token') || localStorage.getItem('accessToken');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      let currentStripePromise = stripePromise;
      if (!currentStripePromise) {
        let pubKey = null;
        try {
          const response = await axios.get(`${API_BASE}/payments/stripe/config`, { headers });
          const config = response.data;
          if (config && (config.publishableKey || config.data?.publishableKey)) {
            pubKey = config.publishableKey || config.data.publishableKey;
          }
        } catch (apiErr) {
          console.warn('Failed to fetch Stripe config from API, trying fallback:', apiErr);
        }

        if (!pubKey) {
          pubKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || process.env.STRIPE_PUBLISHABLE_KEY;
        }

        if (pubKey) {
          currentStripePromise = getStripePromise(pubKey);
          setStripePromise(currentStripePromise);
        } else {
          throw new Error('Invalid Stripe configuration: publishable key not found.');
        }
      }

      const response = await axios.post(
        `${API_BASE}/payments/stripe/create-intent`,
        {
          amount,
          currency,
          donationType,
        },
        { headers }
      );
      
      const resData = response.data;
      const secret = resData.clientSecret || resData.data?.clientSecret;
      setClientSecret(secret);
    } catch (err: any) {
      setInitError(err.response?.data?.message || err.message || 'Failed to initialise payment. Please try again.');
    } finally {
      setIsInitialising(false);
      initInFlight.current = false;
    }
  }, [amount, currency, donationType, stripePromise]);

  useEffect(() => {
    if (Number(amount) > 0) {
      initIntent();
    }
  }, [initIntent, amount]);

  if (isInitialising) {
    return (
      <div style={{ textAlign: 'center', padding: '32px 0' }}>
        <div style={{
          width: 36, height: 36, border: '3px solid #e5e7eb', borderTopColor: '#635BFF',
          borderRadius: '50%', animation: 'stripe-spin 0.7s linear infinite',
          margin: '0 auto 12px',
        }} />
        <p style={{ color: '#6b7280', fontSize: 14 }}>Connecting to Stripe…</p>
        <style>{`@keyframes stripe-spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (initError) {
    return (
      <div style={{
        background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 10,
        padding: 20, textAlign: 'center',
      }}>
        <AlertCircle style={{ width: 36, height: 36, color: '#dc2626', margin: '0 auto 8px', display: 'block' }} />
        <p style={{ color: '#dc2626', fontWeight: 600, margin: '0 0 12px' }}>{initError}</p>
        <button
          onClick={initIntent}
          style={{
            padding: '10px 24px', background: '#635BFF', color: 'white',
            border: 'none', borderRadius: 8, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
          }}
        >
          Retry
        </button>
      </div>
    );
  }

  if (!stripePromise || !clientSecret) return null;

  return (
    <Elements
      key={clientSecret}
      stripe={stripePromise}
      options={{
        clientSecret,
        appearance: STRIPE_APPEARANCE,
        loader: 'auto',
      }}
    >
      <CheckoutForm
        clientSecret={clientSecret}
        displayAmount={displayAmount ?? amount}
        displaySymbol={displaySymbol}
        donationType={donationType}
        originalAmount={originalAmount}
        originalCurrency={originalCurrency}
        onSuccess={onSuccess}
        onCancel={onCancel}
      />
    </Elements>
  );
}