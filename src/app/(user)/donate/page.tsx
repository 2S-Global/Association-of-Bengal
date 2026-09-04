
"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import Script from "next/script";
import { 
  Heart, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight,
  Loader2 
} from "lucide-react";

const presetAmounts = ["500", "1000", "2500", "5000", "10000"];
const API_BASE = `${process.env.NEXT_PUBLIC_API_URL || "https://balc.albdglobal.org"}/api/v1`;

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

export default function DonationPage() {
  const [razorpayKey, setRazorpayKey] = useState<string>("");
  const [selectedAmount, setSelectedAmount] = useState<string>("1000");
  const [customAmount, setCustomAmount] = useState<string>("");
  const [isRazorpayLoaded, setIsRazorpayLoaded] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>("");

  // State to hold currency details passed from backend
  const [currencyDetails, setCurrencyDetails] = useState({
    currency: "INR",
    symbol: "₹",
  });

  const getToken = () =>
    localStorage.getItem("token") ||
    localStorage.getItem("accessToken") ||
    "";

  // Fetch Razorpay config and currency settings from backend on mount
  useEffect(() => {
    const fetchBackendConfig = async () => {
      const token = getToken();
      if (!token) return;

      const headers = { Authorization: `Bearer ${token}` };

      try {
        // 1. Fetch Razorpay public key configuration
        const configRes = await axios.get(`${API_BASE}/payments/razorpay/config`, { headers });
        if (configRes.data.success && configRes.data.data?.keyId) {
          setRazorpayKey(configRes.data.data.keyId);
        }
      } catch (err) {
        console.error("Failed to fetch Razorpay public config key:", err);
      }

      try {
        // 2. Fetch pricing/currency details from backend endpoint
        const priceRes = await axios.get(`${API_BASE}/auth/membership-price`, { headers });
        if (priceRes.data.success && priceRes.data.data) {
          const data = priceRes.data.data.membership || priceRes.data.data;
          setCurrencyDetails({
            currency: data.currency || "INR",
            symbol: data.sysmbol || data.currencySymbol || "₹",
          });
        }
      } catch (err) {
        console.error("Failed to fetch currency details from backend:", err);
      }
    };

    fetchBackendConfig();
  }, []);

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
      setErrorMsg("Razorpay public key is missing. Please ensure you are logged in or check config.");
      return;
    }

    const token = getToken();
    if (!token) {
      setErrorMsg("Authentication token not found. Please log in to your account first.");
      return;
    }

    const decodedToken = parseJwt(token);
    const currentUserId =
      decodedToken?.id ||
      decodedToken?._id ||
      decodedToken?.userId ||
      decodedToken?.user_id ||
      decodedToken?.sub ||
      "";

    if (!currentUserId) {
      setErrorMsg("User ID could not be resolved from your session. Please log in again.");
      return;
    }

    setIsProcessing(true);
    setErrorMsg("");

    try {
      // 1. Call backend order creation route passing currency dynamically from backend state
      const response = await axios.post(
        `${API_BASE}/payments/razorpay/create-order`,
        {
          amount: parsedAmount,
          currency: currencyDetails.currency,
          donationType: "Direct Contribution",
          donationNotes: `General contribution of ${parsedAmount} ${currencyDetails.currency} to Association of Bengal for Literature and Culture`,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (!response.data || !response.data.success || !response.data.data) {
        throw new Error(response.data?.message || "Order creation failed from server.");
      }

      const orderData = response.data.data;
      const orderId = orderData.orderId || orderData.id;
      const gatewayKey = orderData.keyId || activeKey;

      // 2. Configure Razorpay checkout options
      const options = {
        key: gatewayKey,
        amount: orderData.amount, // Scaled by backend
        currency: currencyDetails.currency,
        name: "Association of Bengal for Literature and Culture",
        description: `Direct Contribution (${currencyDetails.currency})`,
        order_id: orderId,
        handler: async function (paymentResponse: any) {
          try {
            // 3. Verify payment signature on the backend
            const verifyRes = await axios.post(
              `${API_BASE}/payments/razorpay/verify`,
              {
                razorpay_order_id: paymentResponse.razorpay_order_id,
                razorpay_payment_id: paymentResponse.razorpay_payment_id,
                razorpay_signature: paymentResponse.razorpay_signature,
                donationType: "Direct Contribution",
                originalAmount: parsedAmount,
                originalCurrency: currencyDetails.symbol,
              },
              { headers: { Authorization: `Bearer ${token}` } }
            );

            if (verifyRes.data.success) {
              setIsProcessing(false);
              setIsSuccess(true);
            } else {
              throw new Error(verifyRes.data.message || "Verification failed");
            }
          } catch (verifyErr: any) {
            console.error("❌ Verification error:", verifyErr);
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

  return (
    <div className="min-h-screen bg-[#fff8f5] flex items-center justify-center p-4 sm:p-6 md:p-8 font-sans">
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="lazyOnload"
        onLoad={() => setIsRazorpayLoaded(true)}
      />

      <div className="w-full max-w-2xl bg-white border border-[#e0bfbf] rounded-3xl shadow-xl overflow-hidden flex flex-col my-auto">
        
        {/* Header Section */}
        <div className="px-6 py-6 sm:px-8 border-b border-[#e0bfbf]/50 bg-gradient-to-r from-[#fbf2ed] via-[#fff8f5] to-[#fbf2ed] text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-[#570013]/10 border border-[#e0bfbf]/60 flex items-center justify-center text-[#570013] mx-auto shadow-xs">
            <Heart className="w-6 h-6 fill-[#570013]/20 text-[#570013]" />
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-bold text-[#570013] font-['Playfair_Display',serif] tracking-tight">
              ASSOCIATION OF BENGAL FOR LITERATURE AND CULTURE
            </h3>
            <h2 className="text-lg sm:text-xl font-bold text-[#775a19] font-['Playfair_Display',serif] mt-1">
              Support Literature & Culture
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-[#584141] max-w-md mx-auto leading-relaxed">
            Your contribution empowers Bengali arts, heritage books, and writers worldwide.
          </p>
        </div>

        {/* Body Content */}
        <div className="p-6 sm:p-8">
          {isSuccess ? (
            <div className="text-center py-10 space-y-4 animate-in fade-in zoom-in duration-300">
              <div className="w-16 h-16 bg-green-50 text-[#1b5e20] rounded-full flex items-center justify-center mx-auto shadow-inner border border-green-200">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <h4 className="text-2xl font-bold text-[#570013] font-['Playfair_Display',serif]">
                Thank You for Your Contribution!
              </h4>
              <p className="text-xs sm:text-sm text-[#584141] max-w-sm mx-auto leading-relaxed">
                Your support makes a profound impact. A receipt and confirmation have been recorded securely under your profile.
              </p>
              <button
                type="button"
                onClick={() => {
                  setIsSuccess(false);
                  setCustomAmount("");
                  setSelectedAmount("1000");
                }}
                className="mt-4 px-6 py-2.5 bg-[#570013] text-white text-xs sm:text-sm font-semibold rounded-xl hover:bg-[#800020] transition-all shadow-md cursor-pointer"
              >
                Make Another Contribution
              </button>
            </div>
          ) : (
            <form onSubmit={handleDonateSubmit} className="space-y-6">
              
              {/* Select Amount Grid */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-[#570013] tracking-wider uppercase block">
                  Select Contribution Amount ({currencyDetails.symbol})
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2.5">
                  {presetAmounts.map((amt) => {
                    const isSelected = selectedAmount === amt;
                    return (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => handleAmountClick(amt)}
                        className={`py-3 rounded-2xl text-sm font-bold transition-all border cursor-pointer shadow-xs ${
                          isSelected
                            ? "bg-[#570013] text-white border-[#570013] scale-105 shadow-md"
                            : "bg-[#fff8f5] text-[#584141] border-[#e0bfbf]/70 hover:bg-[#fbf2ed]"
                        }`}
                      >
                        {currencyDetails.symbol}{amt}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Custom Amount Input */}
              <div className="space-y-1.5">
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
                    className="w-full pl-8 pr-4 py-3 bg-[#fff8f5] border border-[#e0bfbf] rounded-xl text-sm font-semibold text-[#570013] placeholder-[#8c7071]/60 focus:outline-none focus:ring-2 focus:ring-[#570013]/20"
                  />
                </div>
              </div>

              {errorMsg && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-3 rounded-xl font-medium">
                  {errorMsg}
                </div>
              )}
              
              <button
                type="submit"
                disabled={isProcessing || (!selectedAmount && !customAmount) || !isRazorpayLoaded}
                className="w-full py-3.5 bg-[#570013] text-white text-xs sm:text-sm font-semibold tracking-wider uppercase rounded-2xl hover:bg-[#800020] transition-all shadow-md active:scale-95 flex items-center justify-center gap-2 outline-none disabled:opacity-50 cursor-pointer"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Processing Secure Payment...
                  </>
                ) : (
                  <>
                    Proceed to Contribute {currencyDetails.symbol}{customAmount || selectedAmount || "0"} {currencyDetails.currency}{" "}
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
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