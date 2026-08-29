// "use client";

// import React, { useState, useEffect, useCallback } from "react";
// import axios from "axios";
// import StripePaymentForm from "../payment/StripePaymentForm";
// import PayPalPaymentButton from "../payment/PayPalPaymentButton";
// import {
//   CheckCircle2,
//   ArrowRight,
//   CreditCard,
//   FileText,
//   Heart,
// } from "lucide-react";
// const API_BASE = `${process.env.NEXT_PUBLIC_API_URL}/api/v1`;
// interface PaymentStepProps {
//   apiBase: string;
//   authToken?: string;
//   onSuccessRedirect: () => void;
// }

// export default function PaymentStep({
//   apiBase,
//   authToken,
//   onSuccessRedirect,
// }: PaymentStepProps) {
//   const [donation, setDonation] = useState("0");
//   const [payMethod, setPayMethod] = useState(""); // '' | 'stripe' | 'paypal'
//   const [successDonation, setSuccessDonation] = useState<any>(null);
//   const [membershipDetails, setMembershipDetails] = useState({
//     country: "INDIA",
//     sysmbol: "₹",
//     amount: 1000.0,
//     currency: "INR",
//     currencySymbol: "₹",
//   });

//   const membershipAmount = membershipDetails.amount || 1000.0;
//   const donationAmount = parseFloat(donation) || 0;
//   const total = membershipAmount + donationAmount;

//   // Currency handling
//   const displayCurrency =
//     membershipDetails.sysmbol || membershipDetails.currencySymbol || "₹";

//   // ── Fetch membership price using auth token ────────────────────────────────
//   useEffect(() => {
//     const fetchMembershipDetails = async () => {
//       // Fallback to localStorage if authToken prop is missing
//       const token =
//         authToken ||
//         localStorage.getItem("token") ||
//         localStorage.getItem("accessToken");
//       if (!token) {
//         console.warn(
//           "Authorization token missing when trying to fetch membership price.",
//         );
//         return;
//       }

//       try {
//         // NOTE: If your backend route is different (e.g., /payments/membership-price), update it here:
//         const response = await axios.get(`${API_BASE}/auth/membership-price`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         if (response.data.success && response.data.data) {
//           setMembershipDetails(
//             response.data.data.membership || response.data.data,
//           );
//         }
//       } catch (error) {
//         console.error("Error fetching membership details:", error);
//       }
//     };
//     fetchMembershipDetails();
//   }, [apiBase, authToken]);

//   // ── Payment success handler ─────────────────────────────────────────────────
//   const handlePaymentSuccess = useCallback(
//     (paymentData: any) => {
//       setSuccessDonation(paymentData);
//       setPayMethod("");
//       setTimeout(() => {
//         onSuccessRedirect();
//       }, 3000);
//     },
//     [onSuccessRedirect],
//   );

//   // ── Payment cancel handler ──────────────────────────────────────────────────
//   const handlePaymentCancel = useCallback(() => {
//     setPayMethod("");
//   }, []);

//   // ── Success screen view ─────────────────────────────────────────────────────
//   if (successDonation) {
//     return (
//       <div className="text-center py-6 space-y-4 animate-in fade-in zoom-in duration-300">
//         <div className="w-16 h-16 bg-[#570013]/10 text-[#570013] rounded-full flex items-center justify-center mx-auto shadow-inner">
//           <CheckCircle2 className="w-9 h-9" />
//         </div>
//         <h4 className="text-xl sm:text-2xl font-bold text-[#570013] font-['Playfair_Display',serif]">
//           Payment Successful!
//         </h4>
//         <p className="text-[13px] sm:text-[14px] text-[#584141] max-w-sm mx-auto leading-relaxed">
//           Welcome to Association of Bengal. Your membership is now active.
//         </p>
//         <div className="bg-white border border-[#e0bfbf] rounded-xl p-4 text-left space-y-2 shadow-sm">
//           <div className="flex justify-between text-[12px]">
//             <span className="text-[#8c7071]">Reference</span>
//             <span className="font-bold font-mono text-[#1e1b18]">
//               {successDonation.referenceId || "TXN-84920"}
//             </span>
//           </div>
//           <div className="flex justify-between text-[12px]">
//             <span className="text-[#8c7071]">Amount Paid</span>
//             <span className="font-bold text-[#1e1b18]">
//               {successDonation.currency || displayCurrency}{" "}
//               {Number(successDonation.amount || total).toLocaleString()}
//             </span>
//           </div>
//           <div className="flex justify-between text-[12px]">
//             <span className="text-[#8c7071]">Method</span>
//             <span className="font-bold text-[#1e1b18] uppercase">
//               {successDonation.paymentMethod || "Online"}
//             </span>
//           </div>
//         </div>
//         <p className="text-[11px] text-[#8c7071]">
//           Redirecting to dashboard...
//         </p>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-3.5 animate-in fade-in duration-300">
//       <div className="space-y-1">
//         <h4 className="text-base sm:text-lg font-bold text-[#570013] font-['Playfair_Display',serif]">
//           Finalize Payment
//         </h4>
//         <p className="text-[12px] text-[#584141]">
//           Review your fees and select a secure payment option.
//         </p>
//       </div>

//       {/* Fee Summary Card */}
//       <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-[#e0bfbf]/80 shadow-sm space-y-2">
//         <div className="flex items-center gap-2 text-[#570013] font-bold text-[13px] sm:text-[14px] border-b border-[#e0bfbf]/40 pb-2">
//           <FileText className="w-4 h-4 text-[#775a19]" />
//           <span>Fee Summary</span>
//         </div>
//         <div className="flex justify-between text-[12px] sm:text-[13px] text-[#584141]">
//           <span>Membership Fee (DEFAULT)</span>
//           <span className="font-semibold text-[#1e1b18]">
//             {displayCurrency}
//             {membershipAmount.toFixed(2)}
//           </span>
//         </div>
//         {donationAmount > 0 && (
//           <div className="flex justify-between text-[12px] sm:text-[13px] text-[#584141]">
//             <span>Contribution</span>
//             <span className="font-semibold text-[#1e1b18]">
//               {displayCurrency}
//               {donationAmount.toFixed(2)}
//             </span>
//           </div>
//         )}
//         <div className="border-t border-[#e0bfbf]/40 pt-2 flex justify-between text-[13px] sm:text-[14px] font-bold text-[#570013]">
//           <span>Total</span>
//           <span className="text-[#775a19]">
//             {displayCurrency}
//             {total.toFixed(2)}
//           </span>
//         </div>
//       </div>

//       {/* Contribution Input Card */}
//       {!payMethod && (
//         <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-[#e0bfbf]/80 shadow-sm space-y-1.5">
//           <div className="flex items-center gap-2 text-[#570013] font-bold text-[13px]">
//             <Heart className="w-4 h-4 text-red-600 fill-red-600" />
//             <span>Contribution (Optional)</span>
//           </div>
//           <p className="text-[11px] text-[#584141]">
//             Support upcoming national development initiatives.
//           </p>
//           <div className="relative pt-1">
//             <span className="absolute left-3.5 top-4 text-[#8c7071] font-semibold text-[14px]">
//               {displayCurrency}
//             </span>
//             <input
//               type="number"
//               name="contribution"
//               value={donation}
//               onChange={(e) => setDonation(e.target.value)}
//               min="0"
//               placeholder="0.00"
//               className="w-full pl-8 pr-4 py-2 sm:py-2.5 bg-white border border-[#e0bfbf] rounded-xl text-[13px] text-[#1e1b18] focus:outline-none focus:ring-2 focus:ring-[#570013]/30"
//             />
//           </div>
//         </div>
//       )}

//       {/* Payment Gateway Selection */}
//       {!payMethod && (
//         <div className="space-y-2 pt-1">
//           <p className="text-[11px] font-bold uppercase tracking-wider text-[#775a19]">
//             Secure Payment Methods
//           </p>

//           {/* PayPal Button */}
//           <button
//             type="button"
//             onClick={() => setPayMethod("paypal")}
//             className="w-full py-2.5 sm:py-3 px-4 bg-[#003087] hover:bg-[#002060] text-white rounded-xl font-semibold flex items-center justify-between shadow-sm transition-all active:scale-[0.98]"
//           >
//             <div className="flex items-center gap-2">
//               <span className="bg-[#ffc439] text-[#003087] font-extrabold px-2 py-0.5 rounded text-[11px] sm:text-[12px]">
//                 PayPal
//               </span>
//               <span className="text-[12px] sm:text-[13px]">
//                 Pay with PayPal
//               </span>
//             </div>
//             <ArrowRight className="w-4 h-4" />
//           </button>

//           {/* Stripe Button */}
//           <button
//             type="button"
//             onClick={() => setPayMethod("stripe")}
//             className="w-full py-2.5 sm:py-3 px-4 bg-[#635bff] hover:bg-[#5147e5] text-white rounded-xl font-semibold flex items-center justify-between shadow-sm transition-all active:scale-[0.98]"
//           >
//             <div className="flex items-center gap-2">
//               <CreditCard className="w-4 h-4 text-white" />
//               <span className="text-[12px] sm:text-[13px]">
//                 Pay with Stripe (Credit / Debit Card)
//               </span>
//             </div>
//             <ArrowRight className="w-4 h-4" />
//           </button>
//         </div>
//       )}

//       {/* Stripe Form Integration */}
//       {payMethod === "stripe" && (
//         <div className="bg-white p-4 rounded-xl border border-[#e0bfbf] shadow-sm space-y-3">
//           <div className="flex items-center justify-between border-b border-[#e0bfbf]/40 pb-2">
//             <span className="font-bold text-[13px] text-[#570013]">
//               Stripe Checkout
//             </span>
//             <button
//               type="button"
//               onClick={() => setPayMethod("")}
//               className="text-[11px] text-[#775a19] hover:underline"
//             >
//               Change Method
//             </button>
//           </div>
//           <StripePaymentForm
//             amount={total}
//             currency={(membershipDetails.currency || "INR").toLowerCase()}
//             displaySymbol={displayCurrency}
//             displayAmount={total}
//             donationType={"Membership Registration"}
//             originalAmount={total}
//             originalCurrency={displayCurrency}
//             onSuccess={handlePaymentSuccess}
//             onCancel={handlePaymentCancel}
//           />
//         </div>
//       )}

//       {/* PayPal Integration */}
//       {payMethod === "paypal" && (
//         <div className="bg-white p-4 rounded-xl border border-[#e0bfbf] shadow-sm space-y-3">
//           <div className="flex items-center justify-between border-b border-[#e0bfbf]/40 pb-2">
//             <span className="font-bold text-[13px] text-[#570013]">
//               PayPal Checkout
//             </span>
//             <button
//               type="button"
//               onClick={() => setPayMethod("")}
//               className="text-[11px] text-[#775a19] hover:underline"
//             >
//               Change Method
//             </button>
//           </div>
//           <PayPalPaymentButton
//             amount={total}
//             currency={(membershipDetails.currency || "USD").toUpperCase()}
//             displaySymbol={displayCurrency}
//             displayAmount={total.toFixed(2)}
//             donationType={"Membership Registration"}
//             originalAmount={total}
//             originalCurrency={displayCurrency}
//             onSuccess={handlePaymentSuccess}
//             onCancel={handlePaymentCancel}
//             onError={(msg: any) => console.error("[PayPal error]", msg)}
//           />
//         </div>
//       )}
//     </div>
//   );
// }

"use client";

import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import StripePaymentForm from "../payment/StripePaymentForm";
import PayPalPaymentButton from "../payment/PayPalPaymentButton";
import {
  ArrowRight,
  CreditCard,
  FileText,
  Heart,
} from "lucide-react";

const API_BASE = `${process.env.NEXT_PUBLIC_API_URL}/api/v1`;

interface PaymentStepProps {
  apiBase: string;
  authToken?: string;
  onSuccessRedirect: () => void;
}

export default function PaymentStep({
  apiBase,
  authToken,
  onSuccessRedirect,
}: PaymentStepProps) {
  const [donation, setDonation] = useState("0");
  const [payMethod, setPayMethod] = useState(""); // '' | 'stripe' | 'paypal'
  const [membershipDetails, setMembershipDetails] = useState({
    country: "INDIA",
    sysmbol: "₹",
    amount: 1000.0,
    currency: "INR",
    currencySymbol: "₹",
  });

  const membershipAmount = membershipDetails.amount || 1000.0;
  const donationAmount = parseFloat(donation) || 0;
  const total = membershipAmount + donationAmount;

  // Currency handling
  const displayCurrency =
    membershipDetails.sysmbol || membershipDetails.currencySymbol || "₹";

  // ── Fetch membership price using auth token ────────────────────────────────
  useEffect(() => {
    const fetchMembershipDetails = async () => {
      const token =
        authToken ||
        localStorage.getItem("token") ||
        localStorage.getItem("accessToken");
      if (!token) {
        console.warn(
          "Authorization token missing when trying to fetch membership price.",
        );
        return;
      }

      try {
        const response = await axios.get(`${API_BASE}/auth/membership-price`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.data.success && response.data.data) {
          setMembershipDetails(
            response.data.data.membership || response.data.data,
          );
        }
      } catch (error) {
        console.error("Error fetching membership details:", error);
      }
    };
    fetchMembershipDetails();
  }, [apiBase, authToken]);

  // ── Payment success handler (Triggers final success view immediately) ──
  const handlePaymentSuccess = useCallback(
    (paymentData: any) => {
      setPayMethod("");
      // Immediately trigger the main parent success view (skips the intermediate card)
      onSuccessRedirect();
    },
    [onSuccessRedirect],
  );

  // ── Payment cancel handler ──────────────────────────────────────────────────
  const handlePaymentCancel = useCallback(() => {
    setPayMethod("");
  }, []);

  return (
    <div className="space-y-3.5 animate-in fade-in duration-300">
      <div className="space-y-1">
        <h4 className="text-base sm:text-lg font-bold text-[#570013] font-['Playfair_Display',serif]">
          Finalize Payment
        </h4>
        <p className="text-[12px] text-[#584141]">
          Review your fees and select a secure payment option.
        </p>
      </div>

      {/* Fee Summary Card */}
      <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-[#e0bfbf]/80 shadow-sm space-y-2">
        <div className="flex items-center gap-2 text-[#570013] font-bold text-[13px] sm:text-[14px] border-b border-[#e0bfbf]/40 pb-2">
          <FileText className="w-4 h-4 text-[#775a19]" />
          <span>Fee Summary</span>
        </div>
        <div className="flex justify-between text-[12px] sm:text-[13px] text-[#584141]">
          <span>Membership Fee (DEFAULT)</span>
          <span className="font-semibold text-[#1e1b18]">
            {displayCurrency}
            {membershipAmount.toFixed(2)}
          </span>
        </div>
        {donationAmount > 0 && (
          <div className="flex justify-between text-[12px] sm:text-[13px] text-[#584141]">
            <span>Contribution</span>
            <span className="font-semibold text-[#1e1b18]">
              {displayCurrency}
              {donationAmount.toFixed(2)}
            </span>
          </div>
        )}
        <div className="border-t border-[#e0bfbf]/40 pt-2 flex justify-between text-[13px] sm:text-[14px] font-bold text-[#570013]">
          <span>Total</span>
          <span className="text-[#775a19]">
            {displayCurrency}
            {total.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Contribution Input Card */}
      {!payMethod && (
        <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-[#e0bfbf]/80 shadow-sm space-y-1.5">
          <div className="flex items-center gap-2 text-[#570013] font-bold text-[13px]">
            <Heart className="w-4 h-4 text-red-600 fill-red-600" />
            <span>Contribution (Optional)</span>
          </div>
          <p className="text-[11px] text-[#584141]">
            Support upcoming national development initiatives.
          </p>
          <div className="relative pt-1">
            <span className="absolute left-3.5 top-4 text-[#8c7071] font-semibold text-[14px]">
              {displayCurrency}
            </span>
            <input
              type="number"
              name="contribution"
              value={donation}
              onChange={(e) => setDonation(e.target.value)}
              min="0"
              placeholder="0.00"
              className="w-full pl-8 pr-4 py-2 sm:py-2.5 bg-white border border-[#e0bfbf] rounded-xl text-[13px] text-[#1e1b18] focus:outline-none focus:ring-2 focus:ring-[#570013]/30"
            />
          </div>
        </div>
      )}

      {/* Payment Gateway Selection */}
      {!payMethod && (
        <div className="space-y-2 pt-1">
          <p className="text-[11px] font-bold uppercase tracking-wider text-[#775a19]">
            Secure Payment Methods
          </p>

          {/* PayPal Button */}
          <button
            type="button"
            onClick={() => setPayMethod("paypal")}
            className="w-full py-2.5 sm:py-3 px-4 bg-[#003087] hover:bg-[#002060] text-white rounded-xl font-semibold flex items-center justify-between shadow-sm transition-all active:scale-[0.98]"
          >
            <div className="flex items-center gap-2">
              <span className="bg-[#ffc439] text-[#003087] font-extrabold px-2 py-0.5 rounded text-[11px] sm:text-[12px]">
                PayPal
              </span>
              <span className="text-[12px] sm:text-[13px]">
                Pay with PayPal
              </span>
            </div>
            <ArrowRight className="w-4 h-4" />
          </button>

          {/* Stripe Button */}
          <button
            type="button"
            onClick={() => setPayMethod("stripe")}
            className="w-full py-2.5 sm:py-3 px-4 bg-[#635bff] hover:bg-[#5147e5] text-white rounded-xl font-semibold flex items-center justify-between shadow-sm transition-all active:scale-[0.98]"
          >
            <div className="flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-white" />
              <span className="text-[12px] sm:text-[13px]">
                Pay with Stripe (Credit / Debit Card)
              </span>
            </div>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Stripe Form Integration */}
      {payMethod === "stripe" && (
        <div className="bg-white p-4 rounded-xl border border-[#e0bfbf] shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-[#e0bfbf]/40 pb-2">
            <span className="font-bold text-[13px] text-[#570013]">
              Stripe Checkout
            </span>
            <button
              type="button"
              onClick={() => setPayMethod("")}
              className="text-[11px] text-[#775a19] hover:underline"
            >
              Change Method
            </button>
          </div>
          <StripePaymentForm
            amount={total}
            currency={(membershipDetails.currency || "INR").toLowerCase()}
            displaySymbol={displayCurrency}
            displayAmount={total}
            donationType={"Membership Registration"}
            originalAmount={total}
            originalCurrency={displayCurrency}
            onSuccess={handlePaymentSuccess}
            onCancel={handlePaymentCancel}
          />
        </div>
      )}

      {/* PayPal Integration */}
      {payMethod === "paypal" && (
        <div className="bg-white p-4 rounded-xl border border-[#e0bfbf] shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-[#e0bfbf]/40 pb-2">
            <span className="font-bold text-[13px] text-[#570013]">
              PayPal Checkout
            </span>
            <button
              type="button"
              onClick={() => setPayMethod("")}
              className="text-[11px] text-[#775a19] hover:underline"
            >
              Change Method
            </button>
          </div>
          <PayPalPaymentButton
            amount={total}
            currency={(membershipDetails.currency || "USD").toUpperCase()}
            displaySymbol={displayCurrency}
            displayAmount={total.toFixed(2)}
            donationType={"Membership Registration"}
            originalAmount={total}
            originalCurrency={displayCurrency}
            onSuccess={handlePaymentSuccess}
            onCancel={handlePaymentCancel}
            onError={(msg: any) => console.error("[PayPal error]", msg)}
          />
        </div>
      )}
    </div>
  );
}