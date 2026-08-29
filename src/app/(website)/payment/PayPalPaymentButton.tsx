'use client';

import { useEffect, useRef, useState } from 'react';
import Script from 'next/script';
import axios from 'axios';
import { Loader2, AlertCircle, CheckCircle2, Info } from 'lucide-react';

const API_BASE = `${process.env.NEXT_PUBLIC_API_URL || "https://balc.albdglobal.org"}/api/v1`;

interface PayPalPaymentButtonProps {
  amount: number | string;
  currency?: string;
  displaySymbol?: string;
  displayAmount?: number | string;
  donationType?: string;
  originalAmount?: number | string;
  originalCurrency?: string;
  onSuccess: (donation: any) => void;
  onCancel?: () => void;
  onError?: (msg: string) => void;
}

export default function PayPalPaymentButton({
  amount,
  currency = 'USD',
  displaySymbol = '$',
  displayAmount,
  donationType = 'General Donation',
  originalAmount,
  originalCurrency,
  onSuccess,
  onCancel,
  onError,
}: PayPalPaymentButtonProps) {
  const paypalRef = useRef<HTMLDivElement>(null);
  const buttonsRef = useRef<any>(null); // holds the rendered Buttons instance
  const [sdkReady, setSdkReady] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');
  const [statusType, setStatusType] = useState('');

  // clientId is fetched from backend
  const [clientId, setClientId] = useState<string | null>(null);
  const [configError, setConfigError] = useState('');
  const configFetchedRef = useRef(false); // prevent duplicate fetches

  // ── Keep latest props accessible inside PayPal callbacks (avoids stale closure) ──
  const propsRef = useRef<any>({});
  propsRef.current = { amount, currency, donationType, originalAmount, originalCurrency, onSuccess, onCancel, onError };

  // ── Token sync + fetch PayPal clientId from backend on mount ────────────────
  useEffect(() => {
    if (typeof window === 'undefined') return;

    if ((window as any).paypal) setSdkReady(true);

    if (configFetchedRef.current) return;
    configFetchedRef.current = true;

    (async () => {
      try {
        const token = localStorage.getItem('token') || localStorage.getItem('accessToken');
        const response = await axios.get(`${API_BASE}/payments/paypal/config`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        const config = response.data;
        if (config && (config.clientId || config.data?.clientId)) {
          setClientId(config.clientId || config.data.clientId);
        } else {
          throw new Error('Backend did not return a PayPal clientId.');
        }
      } catch (err: any) {
        console.warn('[PayPal] Failed to fetch config from backend, trying env fallback:', err);
        const fallback = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
        if (fallback) {
          setClientId(fallback);
        } else {
          setConfigError('PayPal is unavailable. Please try another payment method.');
        }
      }
    })();
  }, []);

  // ── Render / re-render PayPal Buttons whenever SDK is ready or amount changes ─
  useEffect(() => {
    if (!sdkReady || !paypalRef.current || !(window as any).paypal) return;

    if (buttonsRef.current) {
      try { buttonsRef.current.close(); } catch (_) {}
      buttonsRef.current = null;
    }
    paypalRef.current.innerHTML = '';

    const FUNDING = (window as any).paypal.FUNDING;

    const buttons = (window as any).paypal.Buttons({
      fundingSource: FUNDING.PAYPAL,
      style: {
        color: 'gold',
        shape: 'rect',
        height: 48,
      },

      createOrder: async () => {
        const { amount: amt, currency: cur, donationType: dt } = propsRef.current;
        const token = localStorage.getItem('token') || localStorage.getItem('accessToken');

        try {
          const response = await axios.post(
            `${API_BASE}/payments/paypal/create-order`,
            {
              amount: Number(amt).toFixed(2),
              currency: cur.toUpperCase(),
              donationType: dt,
            },
            {
              headers: token ? { Authorization: `Bearer ${token}` } : {},
            }
          );

          const data = response.data;
          const orderId = data?.orderId || data?.data?.orderId;
          if (!orderId) throw new Error('Backend did not return an orderId');
          return orderId;
        } catch (err: any) {
          const msg = err.response?.data?.message || err.message || 'Failed to create PayPal order';
          console.error('[PayPal createOrder error]', err);
          setStatusMsg(msg);
          setStatusType('error');
          throw err;
        }
      },

      onApprove: async (data: any) => {
        const { donationType: dt, originalAmount: oa, originalCurrency: oc, onSuccess: onS } = propsRef.current;
        setStatusMsg('Verifying payment…');
        setStatusType('info');

        const token = localStorage.getItem('token') || localStorage.getItem('accessToken');

        try {
          const response = await axios.post(
            `${API_BASE}/payments/paypal/capture-order`,
            {
              orderId: data.orderID,
              donationType: dt,
              originalAmount: oa,
              originalCurrency: oc,
            },
            {
              headers: token ? { Authorization: `Bearer ${token}` } : {},
            }
          );
          const donation = response.data.data || response.data;
          setStatusMsg('Payment successful!');
          setStatusType('success');
          setTimeout(() => onS(donation), 800);
        } catch (err: any) {
          const msg = err.response?.data?.message || err.message || 'PayPal capture failed';
          console.error('[PayPal capture error]', err);
          setStatusMsg(msg);
          setStatusType('error');
          const { onError: onErr } = propsRef.current;
          if (onErr) onErr(msg);
        }
      },

      onCancel: () => {
        setStatusMsg('');
        const { onCancel: onC } = propsRef.current;
        if (onC) onC();
      },

      onError: (err: any) => {
        const msg = 'PayPal encountered an unexpected error. Please try again.';
        console.error('[PayPal SDK internal error]', err);
        setStatusMsg(msg);
        setStatusType('error');
        const { onError: onErr } = propsRef.current;
        if (onErr) onErr(msg);
      },
    });

    buttons.render(paypalRef.current);
    buttonsRef.current = buttons;

    return () => {
      if (buttonsRef.current) {
        try { buttonsRef.current.close(); } catch (_) {}
        buttonsRef.current = null;
      }
    };
  }, [sdkReady, amount]);

  if (configError) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center space-y-2">
        <AlertCircle className="w-8 h-8 text-red-600 mx-auto" />
        <p className="text-red-600 text-[13px] font-semibold">{configError}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Amount Banner */}
      <div className="bg-gradient-to-r from-[#003087] to-[#009cde] rounded-xl p-4 text-white flex justify-between items-center shadow-sm">
        <div>
          <p className="text-[10px] text-white/70 uppercase tracking-wider font-bold">
            PayPal Checkout
          </p>
          <p className="text-xl font-extrabold tracking-tight mt-0.5">
            {displaySymbol}{Number(displayAmount ?? amount).toLocaleString()}
          </p>
        </div>
        <div className="bg-[#ffc439] rounded-lg px-3 py-1 font-black text-[#003087] text-[13px] shadow-sm">
          PayPal
        </div>
      </div>

      {/* Info Notice */}
      <div className="bg-[#fbf2ed] border border-[#e0bfbf] rounded-xl p-3 text-[12px] text-[#570013] flex items-start gap-2.5 shadow-sm">
        <Info className="w-4 h-4 text-[#775a19] shrink-0 mt-0.5" />
        <span>Click the PayPal button below. A secure PayPal window will appear — you will stay on this page after completing payment.</span>
      </div>

      {/* Status Messages */}
      {statusMsg && (
        <div className={`p-3 rounded-xl border text-[12px] flex items-center gap-2.5 shadow-sm ${
          statusType === 'success' ? 'bg-[#e3f4e8] border-[#a3e0b2] text-[#135728]' :
          statusType === 'error' ? 'bg-[#fae2e2] border-[#f5b8b8] text-[#800020]' :
          'bg-[#e2edf8] border-[#b8d4f5] text-[#1b4480]'
        }`}>
          {statusType === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> :
           statusType === 'error' ? <AlertCircle className="w-4 h-4 shrink-0" /> :
           <Loader2 className="w-4 h-4 shrink-0 animate-spin" />}
          <span>{statusMsg}</span>
        </div>
      )}

      {/* PayPal Buttons Container */}
      <div ref={paypalRef} className="min-h-[50px] min-w-[200px] w-full" />

      {/* Cancel Link */}
      <div className="text-center pt-1">
        <button
          type="button"
          onClick={onCancel}
          className="text-[12px] font-semibold text-[#8c7071] hover:text-[#570013] underline transition-colors outline-none"
        >
          Cancel payment
        </button>
      </div>

      {/* Load PayPal SDK Script */}
      {clientId && (
        <Script
          src={`https://www.paypal.com/sdk/js?client-id=${clientId}&currency=${currency.toUpperCase()}&intent=capture&components=buttons`}
          strategy="lazyOnload"
          onLoad={() => setSdkReady(true)}
          onError={() => {
            setStatusMsg('Failed to load PayPal SDK. Please check your connection.');
            setStatusType('error');
          }}
        />
      )}
    </div>
  );
}