

// "use client";

// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import Script from "next/script";
// import { CreditCard, FileText, Heart, Loader2 } from "lucide-react";

// const API_BASE = `${process.env.NEXT_PUBLIC_API_URL || "https://balc.albdglobal.org"}/api/v1`;

// interface PaymentStepProps {
//   apiBase?: string;
//   authToken?: string;
//   onSuccessRedirect: () => void;
// }

// export default function PaymentStep({
//   apiBase = API_BASE,
//   authToken,
//   onSuccessRedirect,
// }: PaymentStepProps) {
//   const [razorpayKey, setRazorpayKey] = useState<string>("");
//   const [donation, setDonation] = useState("0");
//   const [isRazorpayLoaded, setIsRazorpayLoaded] = useState(false);
//   const [isProcessing, setIsProcessing] = useState(false);
//   const [errorMsg, setErrorMsg] = useState("");

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

//   const displayCurrency =
//     membershipDetails.sysmbol || membershipDetails.currencySymbol || "₹";

//   const getToken = () =>
//     authToken ||
//     localStorage.getItem("token") ||
//     localStorage.getItem("accessToken") ||
//     "";

//   // Fetch membership price and Razorpay public config key on mount
//   useEffect(() => {
//     const fetchInitialData = async () => {
//       const token = getToken();
//       if (!token) return;

//       const headers = { Authorization: `Bearer ${token}` };

//       try {
//         // 1. Fetch membership details
//         const priceRes = await axios.get(`${apiBase}/auth/membership-price`, { headers });
//         if (priceRes.data.success && priceRes.data.data) {
//           setMembershipDetails(
//             priceRes.data.data.membership || priceRes.data.data
//           );
//         }
//       } catch (error) {
//         console.error("Error fetching membership pricing:", error);
//       }

//       try {
//         // 2. Fetch Razorpay config as specified in documentation
//         const configRes = await axios.get(`${apiBase}/payments/razorpay/config`, { headers });
//         if (configRes.data.success && configRes.data.data?.keyId) {
//           setRazorpayKey(configRes.data.data.keyId);
//         }
//       } catch (error) {
//         console.error("Error fetching Razorpay config from backend:", error);
//       }
//     };

//     fetchInitialData();
//   }, [apiBase, authToken]);

//   // Handle Razorpay Checkout Execution & Verification via backend specs
//   const handleRazorpayPayment = async () => {
//     if (!isRazorpayLoaded) {
//       setErrorMsg("Razorpay gateway is loading. Please wait.");
//       return;
//     }

//     const token = getToken();
//     if (!token) {
//       setErrorMsg("Authentication token not found. Please log in again.");
//       return;
//     }

//     const activeKey =
//       razorpayKey ||
//       process.env.NEXT_PUBLIC_RAZORPAY_KEY ||
//       process.env.NEXT_PUBLIC_VITE_RAZORPAY_KEY ||
//       "";

//     if (!activeKey) {
//       setErrorMsg("Razorpay public key is missing. Please verify your config endpoint or environment variables.");
//       return;
//     }

//     setIsProcessing(true);
//     setErrorMsg("");

//     try {
//       // 1. Call POST /payments/razorpay/create-order
//       const orderResponse = await axios.post(
//         `${apiBase}/payments/razorpay/create-order`,
//         {
//           amount: total,
//           currency: membershipDetails.currency || "INR",
//           donationType: "Membership Registration",
//           donationNotes: donationAmount > 0 ? `Includes optional contribution of ${donationAmount}` : "Annual membership fee",
//         },
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );

//       if (!orderResponse.data || !orderResponse.data.success || !orderResponse.data.data) {
//         throw new Error(orderResponse.data?.message || "Order creation failed from server.");
//       }

//       const orderData = orderResponse.data.data;
//       const orderId = orderData.orderId;
//       const gatewayKey = orderData.keyId || activeKey;

//       // 2. Configure Razorpay checkout options matching exact documentation schema
//       const options = {
//         key: gatewayKey,
//         amount: orderData.amount, // Already multiplied by 100 on backend
//         currency: orderData.currency || "INR",
//         name: "Association of Bengal FOR LITERATURE AND CULTURE",
//         description: "Membership Registration & Contribution Fee",
//         order_id: orderId,
//         handler: async function (paymentResponse: any) {
//           console.log("✅ Payment successful from modal, verifying with backend...", paymentResponse);

//           try {
//             // 3. Call POST /payments/razorpay/verify
//             const verifyRes = await axios.post(
//               `${apiBase}/payments/razorpay/verify`,
//               {
//                 razorpay_order_id: paymentResponse.razorpay_order_id,
//                 razorpay_payment_id: paymentResponse.razorpay_payment_id,
//                 razorpay_signature: paymentResponse.razorpay_signature,
//                 donationType: "Membership Registration",
//                 originalAmount: total,
//                 originalCurrency: displayCurrency,
//               },
//               {
//                 headers: { Authorization: `Bearer ${token}` },
//               }
//             );

//             if (verifyRes.data.success) {
//               setIsProcessing(false);
//               onSuccessRedirect(); // Triggers activation emails and advances step
//             } else {
//               throw new Error(verifyRes.data.message || "Verification failed");
//             }
//           } catch (verifyErr: any) {
//             console.error("❌ Verification error:", verifyErr);
//             setErrorMsg(
//               verifyErr.response?.data?.message || verifyErr.message || "Payment verification failed."
//             );
//             setIsProcessing(false);
//           }
//         },
//         prefill: { name: "", email: "", contact: "" },
//         theme: { color: "#570013" },
//       };

//       const rzp = new (window as any).Razorpay(options);
//       rzp.on("payment.failed", function (res: any) {
//         setErrorMsg(res.error.description || "Payment failed.");
//         setIsProcessing(false);
//       });

//       rzp.open();
//     } catch (err: any) {
//       console.error("❌ Razorpay initialization error:", err);
//       setErrorMsg(
//         err.response?.data?.message || err.message || "Failed to initialize payment gateway."
//       );
//       setIsProcessing(false);
//     }
//   };

//   return (
//     <div className="space-y-4 animate-in fade-in duration-300">
//       <Script
//         src="https://checkout.razorpay.com/v1/checkout.js"
//         strategy="lazyOnload"
//         onLoad={() => setIsRazorpayLoaded(true)}
//       />

//       <div className="space-y-1">
//         <h4 className="text-base sm:text-lg font-bold text-[#570013] font-['Playfair_Display',serif]">
//           Finalize Payment
//         </h4>
//         <p className="text-[12px] text-[#584141]">
//           Review your fees and proceed with secure Razorpay checkout.
//         </p>
//       </div>

//       {/* Fee Summary */}
//       <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-[#e0bfbf]/80 shadow-sm space-y-2">
//         <div className="flex items-center gap-2 text-[#570013] font-bold text-[13px] sm:text-[14px] border-b border-[#e0bfbf]/40 pb-2">
//           <FileText className="w-4 h-4 text-[#775a19]" />
//           <span>Fee Summary</span>
//         </div>
//         <div className="flex justify-between text-[12px] sm:text-[13px] text-[#584141]">
//           <span>Membership Fee (Standard)</span>
//           <span className="font-semibold text-[#1e1b18]">
//             {displayCurrency}
//             {membershipAmount.toFixed(2)}
//           </span>
//         </div>
//         {donationAmount > 0 && (
//           <div className="flex justify-between text-[12px] sm:text-[13px] text-[#584141]">
//             <span>Optional Contribution</span>
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

//       {/* Contribution Input */}
//       <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-[#e0bfbf]/80 shadow-sm space-y-1.5">
//         <div className="flex items-center gap-2 text-[#570013] font-bold text-[13px]">
//           <Heart className="w-4 h-4 text-red-600 fill-red-600" />
//           <span>Contribution (Optional)</span>
//         </div>
//         <div className="relative pt-1">
//           <span className="absolute left-3.5 top-4 text-[#8c7071] font-semibold text-[14px]">
//             {displayCurrency}
//           </span>
//           <input
//             type="number"
//             value={donation}
//             onChange={(e) => setDonation(e.target.value)}
//             min="0"
//             placeholder="0.00"
//             className="w-full pl-8 pr-4 py-2 sm:py-2.5 bg-white border border-[#e0bfbf] rounded-xl text-[13px] text-[#1e1b18] focus:outline-none focus:ring-2 focus:ring-[#570013]/30"
//           />
//         </div>
//       </div>

//       {errorMsg && (
//         <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-3 rounded-xl font-medium">
//           {errorMsg}
//         </div>
//       )}

//       <button
//         type="button"
//         disabled={!isRazorpayLoaded || isProcessing}
//         onClick={handleRazorpayPayment}
//         className="w-full py-3 px-6 bg-[#570013] hover:bg-[#800020] text-white rounded-xl font-semibold text-xs sm:text-sm tracking-wider uppercase flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.98] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
//       >
//         {isProcessing ? (
//           <>
//             <Loader2 className="w-4 h-4 animate-spin" /> Processing Payment...
//           </>
//         ) : (
//           <>
//             <CreditCard className="w-4 h-4" /> Pay {displayCurrency}
//             {total.toFixed(2)} via Razorpay
//           </>
//         )}
//       </button>
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

export default function PaymentStep({
  apiBase = API_BASE,
  authToken,
  onSuccessRedirect,
}: PaymentStepProps) {
  const [razorpayKey, setRazorpayKey] = useState<string>("");
  const [donation, setDonation] = useState("0");
  const [isRazorpayLoaded, setIsRazorpayLoaded] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [pricingData, setPricingData] = useState({
    membership: { amount: 100, currency: "INR", currencySymbol: "₹", wing: "General" },
    kyc: { mobile: { selected: true, fee: 15 }, aadhar: { selected: true, fee: 30 }, fee: 45 },
    kycFee: 45
  });

  const getToken = () =>
    authToken ||
    localStorage.getItem("token") ||
    localStorage.getItem("accessToken") ||
    "";

  // Fetch membership price and KYC status on mount (validates KYC prerequisite)
  useEffect(() => {
    const fetchPricing = async () => {
      const token = getToken();
      if (!token) return;

      const headers = { Authorization: `Bearer ${token}` };

      try {
        const res = await axios.get(`${apiBase}/auth/membership-price`, { headers });
        if (res.data.success && res.data.data) {
          setPricingData(res.data.data);
        }
      } catch (err: any) {
        setErrorMsg(err.response?.data?.message || "Failed to fetch pricing details. Ensure KYC setup is complete.");
      }

      try {
        const configRes = await axios.get(`${apiBase}/payments/razorpay/config`, { headers });
        if (configRes.data.success && configRes.data.data?.keyId) {
          setRazorpayKey(configRes.data.data.keyId);
        }
      } catch (err) {
        console.error("Error fetching Razorpay config:", err);
      }
    };

    fetchPricing();
  }, [apiBase, authToken]);

  const membershipFee = pricingData.membership?.amount || 100;
  const kycFee = pricingData.kycFee || 45;
  const contributionAmount = parseFloat(donation) || 0;
  const total = membershipFee + kycFee + contributionAmount;
  const currencySymbol = pricingData.membership?.currencySymbol || "₹";

  // Construct itemized breakdown as required by backend schema
  const buildBreakdown = () => ({
    membershipFee: membershipFee,
    wing: pricingData.membership?.wing || "General",
    kycFee: kycFee,
    kycBreakdown: {
      mobile: { selected: true, fee: 15 },
      aadhar: { selected: true, fee: 30, aadharNumber: "[Redacted]" },
      pan: { selected: false, fee: 0 }
    },
    contribution: contributionAmount,
    total: total,
    currency: pricingData.membership?.currency || "INR"
  });

  const handleRazorpayPayment = async () => {
    if (!isRazorpayLoaded) {
      setErrorMsg("Razorpay gateway is loading. Please wait.");
      return;
    }

    const token = getToken();
    if (!token) {
      setErrorMsg("Authentication token not found. Please log in again.");
      return;
    }

    setIsProcessing(true);
    setErrorMsg("");

    const breakdownPayload = buildBreakdown();

    try {
      // 1. Create Razorpay Order
      const orderRes = await axios.post(
        `${apiBase}/payments/razorpay/create-order`,
        {
          amount: total,
          currency: pricingData.membership?.currency || "INR",
          donationType: "Membership Registration",
          donationNotes: "Membership registration & KYC verification fee",
          breakdown: breakdownPayload,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (!orderRes.data?.success || !orderRes.data?.data) {
        throw new Error(orderRes.data?.message || "Failed to initialize payment order.");
      }

      const { orderId, amount, keyId } = orderRes.data.data;

      // 2. Open Razorpay Checkout Modal
      const options = {
        key: keyId || razorpayKey,
        amount: amount, // in paisa/subunits handled by backend
        currency: pricingData.membership?.currency || "INR",
        name: "Association of Bengal",
        description: "Membership Registration Fee",
        order_id: orderId,
        handler: async (response: any) => {
          try {
            // 3. Verify Razorpay Payment Server-Side
            const verifyRes = await axios.post(
              `${apiBase}/payments/razorpay/verify`,
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                donationType: "Membership Registration",
                originalAmount: total,
                originalCurrency: currencySymbol,
                breakdown: breakdownPayload,
              },
              { headers: { Authorization: `Bearer ${token}` } }
            );

            if (verifyRes.data.success) {
              setIsProcessing(false);
              onSuccessRedirect(); // Advances to Step 7 (Verification)
            } else {
              throw new Error(verifyRes.data.message || "Payment verification failed.");
            }
          } catch (err: any) {
            setErrorMsg(err.response?.data?.message || err.message || "Verification error occurred.");
            setIsProcessing(false);
          }
        },
        theme: { color: "#570013" },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on("payment.failed", (res: any) => {
        setErrorMsg(res.error.description || "Payment failed.");
        setIsProcessing(false);
      });
      rzp.open();

    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || err.message || "Could not start payment process.");
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
          Finalize Payment & KYC Fees
        </h4>
        <p className="text-[12px] text-[#584141]">
          Review itemized charges before completing secure payment via Razorpay.
        </p>
      </div>

      {/* Itemized Summary */}
      <div className="bg-white p-4 rounded-xl border border-[#e0bfbf]/80 shadow-sm space-y-2.5">
        <div className="flex items-center gap-2 text-[#570013] font-bold text-[13px] border-b border-[#e0bfbf]/40 pb-2">
          <FileText className="w-4 h-4 text-[#775a19]" />
          <span>Itemized Fee Breakdown</span>
        </div>
        <div className="flex justify-between text-xs text-[#584141]">
          <span>Membership Fee ({pricingData.membership?.wing || "General"})</span>
          <span className="font-semibold text-[#1e1b18]">{currencySymbol}{membershipFee.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-xs text-[#584141]">
          <span>Mandatory KYC Processing Fee</span>
          <span className="font-semibold text-[#1e1b18]">{currencySymbol}{kycFee.toFixed(2)}</span>
        </div>
        {contributionAmount > 0 && (
          <div className="flex justify-between text-xs text-[#584141]">
            <span>Optional Contribution</span>
            <span className="font-semibold text-[#1e1b18]">{currencySymbol}{contributionAmount.toFixed(2)}</span>
          </div>
        )}
        <div className="border-t border-[#e0bfbf]/40 pt-2 flex justify-between text-sm font-bold text-[#570013]">
          <span>Total Amount Payable</span>
          <span className="text-[#775a19]">{currencySymbol}{total.toFixed(2)}</span>
        </div>
      </div>

      {/* Optional Contribution Input */}
      <div className="bg-white p-4 rounded-xl border border-[#e0bfbf]/80 shadow-sm space-y-1.5">
        <div className="flex items-center gap-2 text-[#570013] font-bold text-[13px]">
          <Heart className="w-4 h-4 text-red-600 fill-red-600" />
          <span>Add Contribution (Optional)</span>
        </div>
        <div className="relative pt-1">
          <span className="absolute left-3.5 top-4 text-[#8c7071] font-semibold text-sm">
            {currencySymbol}
          </span>
          <input
            type="number"
            value={donation}
            onChange={(e) => setDonation(e.target.value)}
            min="0"
            placeholder="0.00"
            className="w-full pl-8 pr-4 py-2.5 bg-white border border-[#e0bfbf] rounded-xl text-xs text-[#1e1b18] focus:outline-none focus:ring-2 focus:ring-[#570013]/30"
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
            <CreditCard className="w-4 h-4" /> Pay {currencySymbol}{total.toFixed(2)} via Razorpay
          </>
        )}
      </button>
    </div>
  );
}