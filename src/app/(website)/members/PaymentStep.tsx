
// "use client";

// import React, { useState, useEffect, useCallback } from "react";
// import axios from "axios";
// import StripePaymentForm from "../payment/StripePaymentForm";
// import PayPalPaymentButton from "../payment/PayPalPaymentButton";
// import {
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

//   // ── Payment success handler (Triggers final success view immediately) ──
//   const handlePaymentSuccess = useCallback(
//     (paymentData: any) => {
//       setPayMethod("");
//       // Immediately trigger the main parent success view (skips the intermediate card)
//       onSuccessRedirect();
//     },
//     [onSuccessRedirect],
//   );

//   // ── Payment cancel handler ──────────────────────────────────────────────────
//   const handlePaymentCancel = useCallback(() => {
//     setPayMethod("");
//   }, []);

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

import React, { useState, useEffect } from "react";
import axios from "axios";
import Script from "next/script";
import { CreditCard, FileText, Heart, Loader2 } from "lucide-react";

const API_BASE = `${process.env.NEXT_PUBLIC_API_URL || "https://balc.albdglobal.org"}/api/v1`;

interface PaymentStepProps {
  apiBase?: string;
  authToken?: string;
  onSuccessRedirect: () => void;
}

// Helper function to safely decode JWT token on the client side
function parseJwt(token: string) {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error("Failed to parse JWT token:", e);
    return null;
  }
}

export default function PaymentStep({
  apiBase = API_BASE,
  authToken,
  onSuccessRedirect,
}: PaymentStepProps) {
  const razorpayKey =
    process.env.NEXT_PUBLIC_RAZORPAY_KEY ||
    process.env.NEXT_PUBLIC_VITE_RAZORPAY_KEY ||
    "";

  const [donation, setDonation] = useState("0");
  const [isRazorpayLoaded, setIsRazorpayLoaded] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

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

  const displayCurrency =
    membershipDetails.sysmbol || membershipDetails.currencySymbol || "₹";

  // Fetch membership pricing from backend on mount
  useEffect(() => {
    const fetchMembershipDetails = async () => {
      const token =
        authToken ||
        localStorage.getItem("token") ||
        localStorage.getItem("accessToken");
      if (!token) return;

      try {
        const response = await axios.get(`${apiBase}/auth/membership-price`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.data.success && response.data.data) {
          setMembershipDetails(
            response.data.data.membership || response.data.data
          );
        }
      } catch (error) {
        console.error("Error fetching membership details:", error);
      }
    };
    fetchMembershipDetails();
  }, [apiBase, authToken]);

  // Handle Razorpay Checkout Execution & Verification
  const handleRazorpayPayment = async () => {
    if (!isRazorpayLoaded) {
      setErrorMsg("Razorpay gateway is loading. Please wait.");
      return;
    }

    if (!razorpayKey) {
      setErrorMsg(
        "Razorpay public key is missing. Please check your NEXT_PUBLIC_RAZORPAY_KEY environment variable."
      );
      setIsProcessing(false);
      return;
    }

    setIsProcessing(true);
    setErrorMsg("");

    try {
      const token =
        authToken ||
        localStorage.getItem("token") ||
        localStorage.getItem("accessToken");

      if (!token) {
        throw new Error("Authentication token not found. Please log in again.");
      }

      // Safely extract userId from JWT token
      const decodedToken = parseJwt(token);
      const currentUserId =
        decodedToken?.id ||
        decodedToken?._id ||
        decodedToken?.userId ||
        decodedToken?.user_id ||
        decodedToken?.sub ||
        "";

      if (!currentUserId) {
        throw new Error("User ID could not be resolved from token payload.");
      }

      // 1. Call your Next.js API route to create Razorpay order securely
      const response = await axios.post(
        `/api/payments/razorpay/create-order`,
        {
          amount: total,
          currency: membershipDetails.currency || "INR",
          donationAmount: donationAmount,
          donationType: "Membership Registration",
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!response.data || !response.data.data) {
        throw new Error("Order creation failed from server.");
      }

      const order = response.data.data;

      // 2. Configure Razorpay checkout options
      const options = {
        key: razorpayKey,
        amount: order.amount, // Already converted to paise on the server
        currency: order.currency || "INR",
        name: "Association of Bengal FOR LITERATURE AND CULTURE",
        description: "Membership Registration & Contribution Fee",
        order_id: order.id,
        handler: async function (paymentResponse: any) {
          console.log("✅ Payment successful, verifying with server...", paymentResponse);

          try {
            // 3. Send payment details along with verified userId to verify route
            const verifyRes = await axios.post(
              `/api/payments/razorpay/verify`,
              {
                ...paymentResponse,
                userId: currentUserId,
                donationType: "Membership Registration",
                originalAmount: total,
                originalCurrency: displayCurrency,
              },
              {
                headers: { Authorization: `Bearer ${token}` },
              }
            );

            if (verifyRes.data.success) {
              setIsProcessing(false);
              onSuccessRedirect(); // Advances registration step seamlessly
            } else {
              throw new Error(verifyRes.data.message || "Verification failed");
            }
          } catch (verifyErr: any) {
            console.error("❌ Verification error:", verifyErr);
            setErrorMsg(
              verifyErr.response?.data?.message || "Payment verification failed."
            );
            setIsProcessing(false);
          }
        },
        prefill: { name: "", email: "", contact: "" },
        theme: { color: "#570013" },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on("payment.failed", function (res: any) {
        setErrorMsg(res.error.description || "Payment failed.");
        setIsProcessing(false);
      });

      rzp.open();
    } catch (err: any) {
      console.error("❌ Razorpay initialization error:", err);
      setErrorMsg(
        err.response?.data?.message || err.message || "Failed to initialize payment gateway."
      );
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="lazyOnload"
        onLoad={() => setIsRazorpayLoaded(true)}
      />

      <div className="space-y-1">
        <h4 className="text-base sm:text-lg font-bold text-[#570013] font-['Playfair_Display',serif]">
          Finalize Payment
        </h4>
        <p className="text-[12px] text-[#584141]">
          Review your fees and proceed with secure Razorpay checkout.
        </p>
      </div>

      {/* Fee Summary */}
      <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-[#e0bfbf]/80 shadow-sm space-y-2">
        <div className="flex items-center gap-2 text-[#570013] font-bold text-[13px] sm:text-[14px] border-b border-[#e0bfbf]/40 pb-2">
          <FileText className="w-4 h-4 text-[#775a19]" />
          <span>Fee Summary</span>
        </div>
        <div className="flex justify-between text-[12px] sm:text-[13px] text-[#584141]">
          <span>Membership Fee (Standard)</span>
          <span className="font-semibold text-[#1e1b18]">
            {displayCurrency}
            {membershipAmount.toFixed(2)}
          </span>
        </div>
        {donationAmount > 0 && (
          <div className="flex justify-between text-[12px] sm:text-[13px] text-[#584141]">
            <span>Optional Contribution</span>
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

      {/* Contribution Input */}
      <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-[#e0bfbf]/80 shadow-sm space-y-1.5">
        <div className="flex items-center gap-2 text-[#570013] font-bold text-[13px]">
          <Heart className="w-4 h-4 text-red-600 fill-red-600" />
          <span>Contribution (Optional)</span>
        </div>
        <div className="relative pt-1">
          <span className="absolute left-3.5 top-4 text-[#8c7071] font-semibold text-[14px]">
            {displayCurrency}
          </span>
          <input
            type="number"
            value={donation}
            onChange={(e) => setDonation(e.target.value)}
            min="0"
            placeholder="0.00"
            className="w-full pl-8 pr-4 py-2 sm:py-2.5 bg-white border border-[#e0bfbf] rounded-xl text-[13px] text-[#1e1b18] focus:outline-none focus:ring-2 focus:ring-[#570013]/30"
          />
        </div>
      </div>

      {errorMsg && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-3 rounded-xl font-medium">
          {errorMsg}
        </div>
      )}

      <button
        type="button"
        disabled={!isRazorpayLoaded || isProcessing}
        onClick={handleRazorpayPayment}
        className="w-full py-3 px-6 bg-[#570013] hover:bg-[#800020] text-white rounded-xl font-semibold text-xs sm:text-sm tracking-wider uppercase flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.98] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isProcessing ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" /> Processing Payment...
          </>
        ) : (
          <>
            <CreditCard className="w-4 h-4" /> Pay {displayCurrency}
            {total.toFixed(2)} via Razorpay
          </>
        )}
      </button>
    </div>
  );
}