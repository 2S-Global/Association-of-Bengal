
// "use client";

// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import Script from "next/script";
// import { 
//   Heart, 
//   ShieldCheck, 
//   CheckCircle2, 
//   ArrowRight,
//   Loader2 
// } from "lucide-react";

// const presetAmounts = ["500", "1000", "2500", "5000", "10000"];
// const API_BASE = `${process.env.NEXT_PUBLIC_API_URL || "https://balc.albdglobal.org"}/api/v1`;

// // Helper function to safely decode JWT token on the client side
// function parseJwt(token: string) {
//   try {
//     const base64Url = token.split(".")[1];
//     const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
//     const jsonPayload = decodeURIComponent(
//       atob(base64)
//         .split("")
//         .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
//         .join("")
//     );
//     return JSON.parse(jsonPayload);
//   } catch (e) {
//     console.error("Failed to parse JWT token:", e);
//     return null;
//   }
// }

// export default function DonationPage() {
//   const [razorpayKey, setRazorpayKey] = useState<string>("");
//   const [selectedAmount, setSelectedAmount] = useState<string>("1000");
//   const [customAmount, setCustomAmount] = useState<string>("");
//   const [isRazorpayLoaded, setIsRazorpayLoaded] = useState<boolean>(false);
//   const [isProcessing, setIsProcessing] = useState<boolean>(false);
//   const [isSuccess, setIsSuccess] = useState<boolean>(false);
//   const [errorMsg, setErrorMsg] = useState<string>("");

//   // State to hold currency details passed from backend
//   const [currencyDetails, setCurrencyDetails] = useState({
//     currency: "INR",
//     symbol: "₹",
//   });

//   const getToken = () =>
//     localStorage.getItem("token") ||
//     localStorage.getItem("accessToken") ||
//     "";

//   // Fetch Razorpay config and currency settings from backend on mount
//   useEffect(() => {
//     const fetchBackendConfig = async () => {
//       const token = getToken();
//       if (!token) return;

//       const headers = { Authorization: `Bearer ${token}` };

//       try {
//         // 1. Fetch Razorpay public key configuration
//         const configRes = await axios.get(`${API_BASE}/payments/razorpay/config`, { headers });
//         if (configRes.data.success && configRes.data.data?.keyId) {
//           setRazorpayKey(configRes.data.data.keyId);
//         }
//       } catch (err) {
//         console.error("Failed to fetch Razorpay public config key:", err);
//       }

//       try {
//         // 2. Fetch pricing/currency details from backend endpoint
//         const priceRes = await axios.get(`${API_BASE}/auth/membership-price`, { headers });
//         if (priceRes.data.success && priceRes.data.data) {
//           const data = priceRes.data.data.membership || priceRes.data.data;
//           setCurrencyDetails({
//             currency: data.currency || "INR",
//             symbol: data.sysmbol || data.currencySymbol || "₹",
//           });
//         }
//       } catch (err) {
//         console.error("Failed to fetch currency details from backend:", err);
//       }
//     };

//     fetchBackendConfig();
//   }, []);

//   const handleAmountClick = (amount: string) => {
//     setSelectedAmount(amount);
//     setCustomAmount("");
//     setErrorMsg("");
//   };

//   const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const val = e.target.value.replace(/\D/g, "");
//     setCustomAmount(val);
//     if (val) setSelectedAmount("");
//     setErrorMsg("");
//   };

//   const handleDonateSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     const finalVal = customAmount || selectedAmount;
//     const parsedAmount = Number(finalVal);

//     if (!finalVal || isNaN(parsedAmount) || parsedAmount <= 0) {
//       setErrorMsg("Please select or enter a valid contribution amount.");
//       return;
//     }

//     if (!isRazorpayLoaded) {
//       setErrorMsg("Razorpay gateway is still loading. Please wait a moment.");
//       return;
//     }

//     const activeKey =
//       razorpayKey ||
//       process.env.NEXT_PUBLIC_RAZORPAY_KEY ||
//       process.env.NEXT_PUBLIC_VITE_RAZORPAY_KEY ||
//       "";

//     if (!activeKey) {
//       setErrorMsg("Razorpay public key is missing. Please ensure you are logged in or check config.");
//       return;
//     }

//     const token = getToken();
//     if (!token) {
//       setErrorMsg("Authentication token not found. Please log in to your account first.");
//       return;
//     }

//     const decodedToken = parseJwt(token);
//     const currentUserId =
//       decodedToken?.id ||
//       decodedToken?._id ||
//       decodedToken?.userId ||
//       decodedToken?.user_id ||
//       decodedToken?.sub ||
//       "";

//     if (!currentUserId) {
//       setErrorMsg("User ID could not be resolved from your session. Please log in again.");
//       return;
//     }

//     setIsProcessing(true);
//     setErrorMsg("");

//     try {
//       // 1. Call backend order creation route passing currency dynamically from backend state
//       const response = await axios.post(
//         `${API_BASE}/payments/razorpay/create-order`,
//         {
//           amount: parsedAmount,
//           currency: currencyDetails.currency,
//           donationType: "Direct Contribution",
//           donationNotes: `General contribution of ${parsedAmount} ${currencyDetails.currency} to Association of Bengal for Literature and Culture`,
//         },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       if (!response.data || !response.data.success || !response.data.data) {
//         throw new Error(response.data?.message || "Order creation failed from server.");
//       }

//       const orderData = response.data.data;
//       const orderId = orderData.orderId || orderData.id;
//       const gatewayKey = orderData.keyId || activeKey;

//       // 2. Configure Razorpay checkout options
//       const options = {
//         key: gatewayKey,
//         amount: orderData.amount, // Scaled by backend
//         currency: currencyDetails.currency,
//         name: "Association of Bengal for Literature and Culture",
//         description: `Direct Contribution (${currencyDetails.currency})`,
//         order_id: orderId,
//         handler: async function (paymentResponse: any) {
//           try {
//             // 3. Verify payment signature on the backend
//             const verifyRes = await axios.post(
//               `${API_BASE}/payments/razorpay/verify`,
//               {
//                 razorpay_order_id: paymentResponse.razorpay_order_id,
//                 razorpay_payment_id: paymentResponse.razorpay_payment_id,
//                 razorpay_signature: paymentResponse.razorpay_signature,
//                 donationType: "Direct Contribution",
//                 originalAmount: parsedAmount,
//                 originalCurrency: currencyDetails.symbol,
//               },
//               { headers: { Authorization: `Bearer ${token}` } }
//             );

//             if (verifyRes.data.success) {
//               setIsProcessing(false);
//               setIsSuccess(true);
//             } else {
//               throw new Error(verifyRes.data.message || "Verification failed");
//             }
//           } catch (verifyErr: any) {
//             console.error("❌ Verification error:", verifyErr);
//             setErrorMsg(verifyErr.response?.data?.message || "Payment verification failed.");
//             setIsProcessing(false);
//           }
//         },
//         prefill: {
//           name: decodedToken?.name || "",
//           email: decodedToken?.email || "",
//           contact: decodedToken?.phone || "",
//         },
//         theme: {
//           color: "#570013",
//         },
//       };

//       const rzp = new (window as any).Razorpay(options);
//       rzp.on("payment.failed", function (res: any) {
//         setErrorMsg(res.error.description || "Payment failed.");
//         setIsProcessing(false);
//       });

//       rzp.open();
//     } catch (error: any) {
//       console.error("Payment initialization error:", error);
//       setErrorMsg(error.response?.data?.message || error.message || "Failed to initialize payment gateway.");
//       setIsProcessing(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-[#fff8f5] flex items-center justify-center p-4 sm:p-6 md:p-8 font-sans">
//       <Script
//         src="https://checkout.razorpay.com/v1/checkout.js"
//         strategy="lazyOnload"
//         onLoad={() => setIsRazorpayLoaded(true)}
//       />

//       <div className="w-full max-w-2xl bg-white border border-[#e0bfbf] rounded-3xl shadow-xl overflow-hidden flex flex-col my-auto">
        
//         {/* Header Section */}
//         <div className="px-6 py-6 sm:px-8 border-b border-[#e0bfbf]/50 bg-gradient-to-r from-[#fbf2ed] via-[#fff8f5] to-[#fbf2ed] text-center space-y-3">
//           <div className="w-12 h-12 rounded-2xl bg-[#570013]/10 border border-[#e0bfbf]/60 flex items-center justify-center text-[#570013] mx-auto shadow-xs">
//             <Heart className="w-6 h-6 fill-[#570013]/20 text-[#570013]" />
//           </div>
//           <div>
//             <h3 className="text-xs sm:text-sm font-bold text-[#570013] font-['Playfair_Display',serif] tracking-tight">
//               ASSOCIATION OF BENGAL FOR LITERATURE AND CULTURE
//             </h3>
//             <h2 className="text-lg sm:text-xl font-bold text-[#775a19] font-['Playfair_Display',serif] mt-1">
//               Support Literature & Culture
//             </h2>
//           </div>
//           <p className="text-xs sm:text-sm text-[#584141] max-w-md mx-auto leading-relaxed">
//             Your contribution empowers Bengali arts, heritage books, and writers worldwide.
//           </p>
//         </div>

//         {/* Body Content */}
//         <div className="p-6 sm:p-8">
//           {isSuccess ? (
//             <div className="text-center py-10 space-y-4 animate-in fade-in zoom-in duration-300">
//               <div className="w-16 h-16 bg-green-50 text-[#1b5e20] rounded-full flex items-center justify-center mx-auto shadow-inner border border-green-200">
//                 <CheckCircle2 className="w-9 h-9" />
//               </div>
//               <h4 className="text-2xl font-bold text-[#570013] font-['Playfair_Display',serif]">
//                 Thank You for Your Contribution!
//               </h4>
//               <p className="text-xs sm:text-sm text-[#584141] max-w-sm mx-auto leading-relaxed">
//                 Your support makes a profound impact. A receipt and confirmation have been recorded securely under your profile.
//               </p>
//               <button
//                 type="button"
//                 onClick={() => {
//                   setIsSuccess(false);
//                   setCustomAmount("");
//                   setSelectedAmount("1000");
//                 }}
//                 className="mt-4 px-6 py-2.5 bg-[#570013] text-white text-xs sm:text-sm font-semibold rounded-xl hover:bg-[#800020] transition-all shadow-md cursor-pointer"
//               >
//                 Make Another Contribution
//               </button>
//             </div>
//           ) : (
//             <form onSubmit={handleDonateSubmit} className="space-y-6">
              
//               {/* Select Amount Grid */}
//               <div className="space-y-3">
//                 <label className="text-xs font-bold text-[#570013] tracking-wider uppercase block">
//                   Select Contribution Amount ({currencyDetails.symbol})
//                 </label>
//                 <div className="grid grid-cols-3 sm:grid-cols-5 gap-2.5">
//                   {presetAmounts.map((amt) => {
//                     const isSelected = selectedAmount === amt;
//                     return (
//                       <button
//                         key={amt}
//                         type="button"
//                         onClick={() => handleAmountClick(amt)}
//                         className={`py-3 rounded-2xl text-sm font-bold transition-all border cursor-pointer shadow-xs ${
//                           isSelected
//                             ? "bg-[#570013] text-white border-[#570013] scale-105 shadow-md"
//                             : "bg-[#fff8f5] text-[#584141] border-[#e0bfbf]/70 hover:bg-[#fbf2ed]"
//                         }`}
//                       >
//                         {currencyDetails.symbol}{amt}
//                       </button>
//                     );
//                   })}
//                 </div>
//               </div>

//               {/* Custom Amount Input */}
//               <div className="space-y-1.5">
//                 <label className="text-xs font-semibold text-[#8c7071] block">
//                   Or enter custom amount
//                 </label>
//                 <div className="relative">
//                   <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-[#570013]">
//                     {currencyDetails.symbol}
//                   </span>
//                   <input
//                     type="text"
//                     value={customAmount}
//                     onChange={handleCustomChange}
//                     placeholder="Enter custom amount"
//                     className="w-full pl-8 pr-4 py-3 bg-[#fff8f5] border border-[#e0bfbf] rounded-xl text-sm font-semibold text-[#570013] placeholder-[#8c7071]/60 focus:outline-none focus:ring-2 focus:ring-[#570013]/20"
//                   />
//                 </div>
//               </div>

//               {errorMsg && (
//                 <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-3 rounded-xl font-medium">
//                   {errorMsg}
//                 </div>
//               )}
              
//               <button
//                 type="submit"
//                 disabled={isProcessing || (!selectedAmount && !customAmount) || !isRazorpayLoaded}
//                 className="w-full py-3.5 bg-[#570013] text-white text-xs sm:text-sm font-semibold tracking-wider uppercase rounded-2xl hover:bg-[#800020] transition-all shadow-md active:scale-95 flex items-center justify-center gap-2 outline-none disabled:opacity-50 cursor-pointer"
//               >
//                 {isProcessing ? (
//                   <>
//                     <Loader2 className="w-4 h-4 animate-spin" />
//                     Processing Secure Payment...
//                   </>
//                 ) : (
//                   <>
//                     Proceed to Contribute {currencyDetails.symbol}{customAmount || selectedAmount || "0"} {currencyDetails.currency}{" "}
//                     <ArrowRight className="w-4 h-4" />
//                   </>
//                 )}
//               </button>
//             </form>
//           )}
//         </div>

//         {/* Footer Trust Section */}
//         <div className="px-6 py-4 bg-[#fbf2ed]/50 border-t border-[#e0bfbf]/50 flex items-center justify-between text-[11px] text-[#8c7071]">
//           <span className="flex items-center gap-1">
//             <ShieldCheck className="w-3.5 h-3.5 text-[#1b5e20]" /> Tax Exemption Eligible
//           </span>
//           <span>Association of Bengal for Literature and Culture</span>
//         </div>

//       </div>
//     </div>
//   );
// }

"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import Script from "next/script";
import { 
  Heart, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight,
  Loader2,
  History,
  CreditCard,
  FileText,
  Eye,
  ArrowLeft,
  Receipt,
  Plus,
  ChevronUp,
  Sparkles,
  Wallet
} from "lucide-react";

const presetAmounts = ["500", "1000", "2500", "5000", "10000"];
const API_BASE = `${process.env.NEXT_PUBLIC_API_URL || "https://balc.albdglobal.org"}/api/v1`;

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

interface BreakdownType {
  membershipFee?: number;
  wing?: string;
  kycFee?: number;
  kycBreakdown?: {
    mobile?: { selected: boolean; fee: number };
    aadhar?: { selected: boolean; fee: number; aadharNumber?: string };
    pan?: { selected: boolean; fee: number };
  };
  contribution?: number;
  total?: number;
  currency?: string;
}

interface DonationItem {
  _id: string;
  member?: string;
  user?: string;
  type: string;
  amount: number;
  currency: string;
  paymentMethod: string;
  razorpayOrderId?: string;
  status: string;
  transactionId?: string;
  receiptUrl?: string | null;
  notes?: string;
  breakdown?: BreakdownType | null;
  referenceId?: string;
  createdAt: string;
}

export default function DonationPage() {
  const [showForm, setShowForm] = useState<boolean>(false);
  
  // Donation Form States
  const [razorpayKey, setRazorpayKey] = useState<string>("");
  const [selectedAmount, setSelectedAmount] = useState<string>("1000");
  const [customAmount, setCustomAmount] = useState<string>("");
  const [donationType, setDonationType] = useState<string>("Direct Contribution");
  const [donationNotes, setDonationNotes] = useState<string>("General contribution");
  const [isRazorpayLoaded, setIsRazorpayLoaded] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>("");

  // History & Details States
  const [donationsList, setDonationsList] = useState<DonationItem[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState<boolean>(false);
  const [selectedDonation, setSelectedDonation] = useState<DonationItem | null>(null);

  // Currency configuration
  const [currencyDetails, setCurrencyDetails] = useState({
    currency: "INR",
    symbol: "₹",
  });

  const getToken = () =>
    localStorage.getItem("token") ||
    localStorage.getItem("accessToken") ||
    "";

  useEffect(() => {
    const fetchBackendConfig = async () => {
      const token = getToken();
      if (!token) return;

      const headers = { Authorization: `Bearer ${token}` };

      try {
        const configRes = await axios.get(`${API_BASE}/payments/razorpay/config`, { headers });
        if (configRes.data.success && configRes.data.data?.keyId) {
          setRazorpayKey(configRes.data.data.keyId);
        }
      } catch (err) {
        console.error("Failed to fetch Razorpay config:", err);
      }

      try {
        const priceRes = await axios.get(`${API_BASE}/auth/membership-price`, { headers });
        if (priceRes.data.success && priceRes.data.data) {
          const data = priceRes.data.data.membership || priceRes.data.data;
          setCurrencyDetails({
            currency: data.currency || "INR",
            symbol: data.sysmbol || data.currencySymbol || "₹",
          });
        }
      } catch (err) {
        console.error("Failed to fetch currency details:", err);
      }
    };

    fetchBackendConfig();
    fetchDonationsHistory();
  }, []);

  const fetchDonationsHistory = async () => {
    const token = getToken();
    if (!token) return;

    setIsLoadingHistory(true);
    try {
      const response = await axios.get(`${API_BASE}/donations`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { page: 1, limit: 10 }
      });

      if (response.data && response.data.success) {
        const payload = response.data.data;
        if (Array.isArray(payload)) {
          setDonationsList(payload);
        } else if (payload.docs || payload.donations || payload.result) {
          setDonationsList(payload.docs || payload.donations || payload.result);
        }
      }
    } catch (err) {
      console.error("Failed to fetch donation history:", err);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  const fetchDonationDetails = async (id: string) => {
    const token = getToken();
    if (!token) return;

    try {
      const response = await axios.get(`${API_BASE}/donations/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data && response.data.success) {
        setSelectedDonation(response.data.data.donation || response.data.data);
      }
    } catch (err) {
      console.error("Failed to fetch donation details:", err);
    }
  };

  const handleAmountClick = (amount: string) => {
    setSelectedAmount(amount);
    setCustomAmount("");
    setErrorMsg("");
  };

  const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, "");
    setCustomAmount(val);
    if (val) setSelectedAmount("");
    setErrorMsg("");
  };

  const handleDonateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalVal = customAmount || selectedAmount;
    const parsedAmount = Number(finalVal);

    if (!finalVal || isNaN(parsedAmount) || parsedAmount <= 0) {
      setErrorMsg("Please select or enter a valid contribution amount.");
      return;
    }

    if (!isRazorpayLoaded) {
      setErrorMsg("Razorpay gateway is still loading. Please wait a moment.");
      return;
    }

    const activeKey =
      razorpayKey ||
      process.env.NEXT_PUBLIC_RAZORPAY_KEY ||
      process.env.NEXT_PUBLIC_VITE_RAZORPAY_KEY ||
      "";

    if (!activeKey) {
      setErrorMsg("Razorpay public key is missing. Please log in again.");
      return;
    }

    const token = getToken();
    if (!token) {
      setErrorMsg("Authentication token not found. Please log in first.");
      return;
    }

    const decodedToken = parseJwt(token);
    setIsProcessing(true);
    setErrorMsg("");

    try {
      const response = await axios.post(
        `${API_BASE}/payments/razorpay/create-order`,
        {
          amount: parsedAmount,
          currency: currencyDetails.currency,
          type: donationType,
          notes: donationNotes,
          paymentMethod: "razorpay"
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (!response.data || !response.data.success || !response.data.data) {
        throw new Error(response.data?.message || "Order creation failed from server.");
      }

      const orderData = response.data.data;
      const options = {
        key: orderData.keyId || activeKey,
        amount: orderData.amount,
        currency: currencyDetails.currency,
        name: "Association of Bengal for Literature and Culture",
        description: donationType,
        order_id: orderData.orderId || orderData.id,
        handler: async function (paymentResponse: any) {
          try {
            const verifyRes = await axios.post(
              `${API_BASE}/payments/razorpay/verify`,
              {
                razorpay_order_id: paymentResponse.razorpay_order_id,
                razorpay_payment_id: paymentResponse.razorpay_payment_id,
                razorpay_signature: paymentResponse.razorpay_signature,
                donationType: donationType,
                originalAmount: parsedAmount,
              },
              { headers: { Authorization: `Bearer ${token}` } }
            );

            if (verifyRes.data.success) {
              setIsProcessing(false);
              setIsSuccess(true);
              fetchDonationsHistory(); 
            } else {
              throw new Error(verifyRes.data.message || "Verification failed");
            }
          } catch (verifyErr: any) {
            console.error("Verification error:", verifyErr);
            setErrorMsg(verifyErr.response?.data?.message || "Payment verification failed.");
            setIsProcessing(false);
          }
        },
        prefill: {
          name: decodedToken?.name || "",
          email: decodedToken?.email || "",
          contact: decodedToken?.phone || "",
        },
        theme: {
          color: "#570013",
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on("payment.failed", function (res: any) {
        setErrorMsg(res.error.description || "Payment failed.");
        setIsProcessing(false);
      });

      rzp.open();
    } catch (error: any) {
      console.error("Payment initialization error:", error);
      setErrorMsg(error.response?.data?.message || error.message || "Failed to initialize payment gateway.");
      setIsProcessing(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold rounded-full">Completed</span>;
      case "pending":
        return <span className="px-2.5 py-1 bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-bold rounded-full">Pending</span>;
      case "failed":
        return <span className="px-2.5 py-1 bg-rose-50 text-rose-700 border border-rose-200 text-[10px] font-bold rounded-full">Failed</span>;
      default:
        return <span className="px-2.5 py-1 bg-slate-50 text-slate-700 border border-slate-200 text-[10px] font-bold rounded-full">{status || "Processing"}</span>;
    }
  };

  const formatCurrencySymbol = (curr: string) => {
    if (curr === "INR") return "₹";
    return curr || "₹";
  };

  // Calculate sum of completed amounts
  const totalContributed = donationsList
    .filter(item => item.status?.toLowerCase() === "completed")
    .reduce((acc, curr) => acc + (curr.amount || 0), 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fff8f5] via-[#fbf2ed] to-[#fff3ed] flex items-center justify-center p-4 sm:p-6 md:p-8 font-sans">
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="lazyOnload"
        onLoad={() => setIsRazorpayLoaded(true)}
      />

      <div className="w-full max-w-2xl bg-white border border-[#e0bfbf]/70 rounded-3xl shadow-2xl overflow-hidden flex flex-col my-auto">
        
        {/* Header Branding Section */}
        <div className="px-6 py-6 sm:px-8 border-b border-[#e0bfbf]/40 bg-gradient-to-r from-[#fbf2ed]/80 via-[#fff8f5] to-[#fbf2ed]/80 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-[#570013]/10 border border-[#e0bfbf]/60 flex items-center justify-center text-[#570013] mx-auto shadow-xs">
            <Heart className="w-6 h-6 fill-[#570013]/20 text-[#570013]" />
          </div>
          <div>
            <h3 className="text-[11px] sm:text-xs font-bold text-[#570013] font-['Playfair_Display',serif] tracking-widest uppercase">
              Association of Bengal for Literature and Culture
            </h3>
            <h2 className="text-xl sm:text-2xl font-bold text-[#775a19] font-['Playfair_Display',serif] mt-1">
              Contribution Dashboard
            </h2>
          </div>

          <div className="pt-1 flex items-center justify-center gap-3">
            <div className="px-4 py-1.5 bg-white border border-[#e0bfbf]/60 rounded-full shadow-xs flex items-center gap-1.5 text-xs text-[#584141]">
              <Wallet className="w-3.5 h-3.5 text-[#775a19]" />
              <span>Total Contributed: <strong className="text-[#570013]">₹{totalContributed}</strong></span>
            </div>
          </div>

          <div className="flex justify-center pt-2">
            <button
              onClick={() => { setShowForm(!showForm); setIsSuccess(false); setErrorMsg(""); setSelectedDonation(null); }}
              className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 shadow-md ${
                showForm 
                  ? "bg-[#775a19] text-white hover:bg-[#5d4412]" 
                  : "bg-[#570013] text-white hover:bg-[#800020]"
              }`}
            >
              {showForm ? (
                <>
                  <ChevronUp className="w-4 h-4" /> Close Contribution Form
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" /> Make New Contribution
                </>
              )}
            </button>
          </div>
        </div>

        {/* Dynamic Content Area */}
        <div className="p-6 sm:p-8 space-y-6">

          {/* Contribution Form Panel */}
          {showForm && (
            <div className="p-6 bg-gradient-to-br from-[#fbf2ed]/60 to-[#fff8f5] border border-[#e0bfbf] rounded-2xl shadow-inner space-y-5 animate-in fade-in slide-in-from-top-4 duration-300">
              <div className="flex items-center justify-between pb-2 border-b border-[#e0bfbf]/50">
                <h4 className="text-xs font-bold text-[#570013] uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-[#775a19]" /> Secure Checkout
                </h4>
                <span className="text-[11px] text-[#8c7071]">Razorpay Gateway</span>
              </div>

              {isSuccess ? (
                <div className="text-center py-6 space-y-4">
                  <div className="w-16 h-16 bg-emerald-50 text-[#1b5e20] rounded-full flex items-center justify-center mx-auto shadow-inner border border-emerald-200">
                    <CheckCircle2 className="w-9 h-9" />
                  </div>
                  <h4 className="text-xl font-bold text-[#570013] font-['Playfair_Display',serif]">
                    Thank You for Your Contribution!
                  </h4>
                  <p className="text-xs text-[#584141] max-w-sm mx-auto leading-relaxed">
                    Your contribution was completed successfully and recorded in your history log below.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setIsSuccess(false);
                      setCustomAmount("");
                      setSelectedAmount("1000");
                      setShowForm(false);
                    }}
                    className="mt-2 px-6 py-2.5 bg-[#570013] text-white text-xs font-semibold rounded-xl hover:bg-[#800020] transition-all shadow-md cursor-pointer"
                  >
                    View Updated History
                  </button>
                </div>
              ) : (
                <form onSubmit={handleDonateSubmit} className="space-y-4">
                  
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#570013] uppercase tracking-wider block">
                      Contribution Type
                    </label>
                    <select
                      value={donationType}
                      onChange={(e) => setDonationType(e.target.value)}
                      className="w-full px-4 py-2.5 bg-white border border-[#e0bfbf] rounded-xl text-xs font-semibold text-[#570013] focus:outline-none focus:ring-2 focus:ring-[#570013]/20"
                    >
                      <option value="Direct Contribution">Direct Contribution</option>
                      <option value="Building Fund">Building Fund</option>
                      <option value="Event Sponsorship">Event Sponsorship</option>
                      <option value="Publication Fund">Publication Fund</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-[#570013] tracking-wider uppercase block">
                      Select Amount ({currencyDetails.symbol})
                    </label>
                    <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                      {presetAmounts.map((amt) => {
                        const isSelected = selectedAmount === amt;
                        return (
                          <button
                            key={amt}
                            type="button"
                            onClick={() => handleAmountClick(amt)}
                            className={`py-2.5 rounded-xl text-xs font-bold transition-all border cursor-pointer shadow-xs ${
                              isSelected
                                ? "bg-[#570013] text-white border-[#570013] scale-105 shadow-md"
                                : "bg-white text-[#584141] border-[#e0bfbf]/70 hover:bg-[#fbf2ed]"
                            }`}
                          >
                            {currencyDetails.symbol}{amt}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-[#8c7071] block">
                      Or enter custom amount
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-[#570013]">
                        {currencyDetails.symbol}
                      </span>
                      <input
                        type="text"
                        value={customAmount}
                        onChange={handleCustomChange}
                        placeholder="Enter custom amount"
                        className="w-full pl-8 pr-4 py-2.5 bg-white border border-[#e0bfbf] rounded-xl text-xs font-semibold text-[#570013] placeholder-[#8c7071]/60 focus:outline-none focus:ring-2 focus:ring-[#570013]/20"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-[#8c7071] block">Notes / Message</label>
                    <input
                      type="text"
                      value={donationNotes}
                      onChange={(e) => setDonationNotes(e.target.value)}
                      placeholder="General contribution"
                      className="w-full px-4 py-2.5 bg-white border border-[#e0bfbf] rounded-xl text-xs font-semibold text-[#570013] focus:outline-none focus:ring-2 focus:ring-[#570013]/20"
                    />
                  </div>

                  {errorMsg && (
                    <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs p-3 rounded-xl font-medium">
                      {errorMsg}
                    </div>
                  )}
                  
                  <button
                    type="submit"
                    disabled={isProcessing || (!selectedAmount && !customAmount) || !isRazorpayLoaded}
                    className="w-full py-3 bg-[#570013] text-white text-xs font-semibold tracking-wider uppercase rounded-xl hover:bg-[#800020] transition-all shadow-md active:scale-95 flex items-center justify-center gap-2 outline-none disabled:opacity-50 cursor-pointer"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Processing Secure Payment...
                      </>
                    ) : (
                      <>
                        Proceed to Pay {currencyDetails.symbol}{customAmount || selectedAmount || "0"} {currencyDetails.currency}{" "}
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          )}

          {/* Detailed Contribution View */}
          {selectedDonation ? (
            <div className="space-y-4 animate-in fade-in duration-200">
              <button 
                onClick={() => setSelectedDonation(null)}
                className="text-xs font-bold text-[#570013] flex items-center gap-1 hover:underline cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back to All Contributions
              </button>

              <div className="p-5 bg-[#fbf2ed]/40 border border-[#e0bfbf] rounded-2xl space-y-4 shadow-sm">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-bold text-[#8c7071] uppercase tracking-wider">Reference ID</span>
                    <p className="text-xs font-mono font-bold text-[#570013]">{selectedDonation.referenceId || selectedDonation._id}</p>
                  </div>
                  {getStatusBadge(selectedDonation.status)}
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2 border-t border-[#e0bfbf]/50">
                  <div>
                    <span className="text-[10px] font-bold text-[#8c7071] uppercase">Amount Paid</span>
                    <p className="text-lg font-bold text-[#570013]">
                      {formatCurrencySymbol(selectedDonation.currency)} {selectedDonation.amount}
                    </p>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-[#8c7071] uppercase">Type</span>
                    <p className="text-sm font-semibold text-[#584141]">{selectedDonation.type}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2 border-t border-[#e0bfbf]/50">
                  <div>
                    <span className="text-[10px] font-bold text-[#8c7071] uppercase">Payment Method</span>
                    <p className="text-xs font-semibold uppercase text-[#584141]">{selectedDonation.paymentMethod}</p>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-[#8c7071] uppercase">Transaction ID</span>
                    <p className="text-xs font-mono text-[#584141]">{selectedDonation.transactionId || "N/A"}</p>
                  </div>
                </div>

                {selectedDonation.breakdown && (
                  <div className="pt-2 border-t border-[#e0bfbf]/50 space-y-1">
                    <span className="text-[10px] font-bold text-[#8c7071] uppercase block">Fee Breakdown</span>
                    <div className="text-xs text-[#584141] bg-white p-3 rounded-xl border border-[#e0bfbf]/60 space-y-1">
                      {selectedDonation.breakdown.membershipFee !== undefined && (
                        <p className="flex justify-between"><span>Membership Fee:</span> <span className="font-semibold">₹{selectedDonation.breakdown.membershipFee}</span></p>
                      )}
                      {selectedDonation.breakdown.wing && (
                        <p className="flex justify-between"><span>Wing:</span> <span className="font-semibold">{selectedDonation.breakdown.wing}</span></p>
                      )}
                      {selectedDonation.breakdown.kycFee !== undefined && (
                        <p className="flex justify-between"><span>KYC Verification Fee:</span> <span className="font-semibold">₹{selectedDonation.breakdown.kycFee}</span></p>
                      )}
                    </div>
                  </div>
                )}

                {selectedDonation.notes && (
                  <div className="pt-2 border-t border-[#e0bfbf]/50">
                    <span className="text-[10px] font-bold text-[#8c7071] uppercase">Notes</span>
                    <p className="text-xs text-[#584141] italic">{selectedDonation.notes}</p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-[#e0bfbf]/40">
                <h4 className="text-xs font-bold text-[#570013] uppercase tracking-wider flex items-center gap-1.5">
                  <History className="w-4 h-4 text-[#775a19]" /> Previous Contributions
                </h4>
                <span className="text-[11px] text-[#8c7071]">Live records</span>
              </div>

              {isLoadingHistory ? (
                <div className="py-12 flex flex-col items-center justify-center space-y-2">
                  <Loader2 className="w-6 h-6 animate-spin text-[#570013]" />
                  <p className="text-xs text-[#8c7071]">Loading history...</p>
                </div>
              ) : donationsList.length === 0 ? (
                <div className="text-center py-12 space-y-3 bg-[#fbf2ed]/30 rounded-2xl border border-dashed border-[#e0bfbf]">
                  <FileText className="w-8 h-8 text-[#8c7071] mx-auto" />
                  <p className="text-xs font-semibold text-[#584141]">No past contributions found</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
                  {donationsList.map((item) => (
                    <div 
                      key={item._id}
                      className="p-4 bg-[#fff8f5] border border-[#e0bfbf]/60 rounded-2xl flex items-center justify-between shadow-xs hover:border-[#570013]/40 transition-all"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-[#570013]">
                            {formatCurrencySymbol(item.currency)} {item.amount}
                          </span>
                          {getStatusBadge(item.status)}
                        </div>
                        <p className="text-xs text-[#584141] font-semibold">
                          {item.type}
                        </p>
                        <p className="text-[10px] text-[#8c7071] flex items-center gap-1 font-mono">
                          <Receipt className="w-3 h-3 text-[#775a19]" />
                          {item.referenceId || item._id.substring(0, 10)} • {new Date(item.createdAt).toLocaleDateString("en-IN")}
                        </p>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => fetchDonationDetails(item._id)}
                          className="px-3.5 py-2 bg-[#fbf2ed] text-[#570013] border border-[#e0bfbf] text-xs font-bold rounded-xl hover:bg-[#570013] hover:text-white transition-all cursor-pointer flex items-center gap-1 shadow-xs"
                        >
                          <Eye className="w-3.5 h-3.5" /> Details
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>

        {/* Footer Trust Section */}
        <div className="px-6 py-4 bg-[#fbf2ed]/50 border-t border-[#e0bfbf]/50 flex items-center justify-between text-[11px] text-[#8c7071]">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-[#1b5e20]" /> Tax Exemption Eligible
          </span>
          <span>Association of Bengal for Literature and Culture</span>
        </div>

      </div>
    </div>
  );
}