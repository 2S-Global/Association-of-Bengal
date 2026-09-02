// // "use client";

// // import React, { useEffect, useState } from "react";
// // import Script from "next/script";
// // import axios from "axios";
// // import { Loader2, CreditCard } from "lucide-react";

// // interface RazorpayPaymentProps {
// //   apiBase: string;
// //   authToken: string;
// //   documentType?: string;
// //   onSuccess: (paymentResponse: any) => void;
// // }

// // export default function RazorpayPayment({
// //   apiBase,
// //   authToken,
// //   documentType = "membership",
// //   onSuccess,
// // }: RazorpayPaymentProps) {
// //   const razorpayKey = process.env.NEXT_PUBLIC_RAZORPAY_KEY || "";

// //   const [isRazorpayLoaded, setIsRazorpayLoaded] = useState(false);
// //   const [amount, setAmount] = useState<number | null>(null);
// //   const [loading, setLoading] = useState(false);
// //   const [errorMsg, setErrorMsg] = useState("");

// //   // Fetch fees when component mounts
// //   useEffect(() => {
// //     const fetchFees = async () => {
// //       try {
// //         const token = authToken || localStorage.getItem("token") || localStorage.getItem("accessToken") || "";
// //         const response = await axios.get(`${apiBase}/candidatekyc/fees/${documentType}`, {
// //           headers: token ? { Authorization: `Bearer ${token}` } : {},
// //         });
// //         if (response.data.success) {
// //           setAmount(Number(response.data.fees));
// //         }
// //       } catch (error: any) {
// //         console.error("❌ Error fetching fees:", error);
// //         setErrorMsg("Failed to load payment amount.");
// //       }
// //     };

// //     if (apiBase) {
// //       fetchFees();
// //     }
// //   }, [apiBase, documentType, authToken]);

// //   const handlePayment = async () => {
// //     if (!isRazorpayLoaded) {
// //       setErrorMsg("Razorpay SDK is still loading. Please wait a moment.");
// //       return;
// //     }

// //     setLoading(true);
// //     setErrorMsg("");

// //     try {
// //       const token = authToken || localStorage.getItem("token") || localStorage.getItem("accessToken") || "";
      
// //       // 1. Create order on backend
// //       const response = await axios.post(
// //         `${apiBase}/candidatekyc/create-order`,
// //         { documentType },
// //         {
// //           headers: token ? { Authorization: `Bearer ${token}` } : {},
// //         }
// //       );

// //       if (!response.data || !response.data.data) {
// //         throw new Error("Order creation failed from server.");
// //       }

// //       const order = response.data.data;

// //       // 2. Configure Razorpay options matching your theme and requirements
// //       const options = {
// //         key: razorpayKey,
// //         amount: order.amount, // Amount in paise
// //         currency: "INR",
// //         name: "Association of Bengal",
// //         description: "Membership Registration & Contribution Fee",
// //         order_id: order.id,
// //         handler: function (paymentResponse: any) {
// //           console.log("✅ Payment successful:", paymentResponse);
// //           setLoading(false);
// //           if (onSuccess) onSuccess(paymentResponse);
// //         },
// //         prefill: {
// //           name: "",
// //           email: "",
// //           contact: "",
// //         },
// //         theme: { color: "#570013" }, // Maroon theme matching your portal
// //       };

// //       const rzp = new (window as any).Razorpay(options);
// //       rzp.on("payment.failed", function (response: any) {
// //         console.error("❌ Payment failed:", response.error);
// //         setErrorMsg(response.error.description || "Payment failed. Please try again.");
// //         setLoading(false);
// //       });
      
// //       rzp.open();
// //     } catch (error: any) {
// //       console.error("❌ Error during order creation:", error);
// //       setErrorMsg(error.response?.data?.message || error.message || "Could not initialize payment.");
// //       setLoading(false);
// //     }
// //   };

// //   return (
// //     <div className="space-y-4">
// //       {/* Load Razorpay Checkout Script */}
// //       <Script
// //         src="https://checkout.razorpay.com/v1/checkout.js"
// //         strategy="lazyOnload"
// //         onLoad={() => setIsRazorpayLoaded(true)}
// //       />

// //       <div className="bg-[#fbf2ed] border border-[#e0bfbf] p-5 rounded-2xl flex items-center justify-between">
// //         <div>
// //           <h4 className="text-sm font-bold text-[#570013]">Secure Payment Checkout</h4>
// //           <p className="text-xs text-[#775a19] mt-0.5">Complete your registration payment via Razorpay.</p>
// //         </div>
// //         <div className="text-right">
// //           <span className="text-[10px] uppercase font-bold text-[#8c7071] block">Total Payable</span>
// //           <span className="text-lg font-extrabold text-[#570013]">
// //             {amount !== null ? `₹${amount.toFixed(2)}` : "Calculating..."}
// //           </span>
// //         </div>
// //       </div>

// //       {errorMsg && (
// //         <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-3 rounded-xl font-medium">
// //           {errorMsg}
// //         </div>
// //       )}

// //       <button
// //         type="button"
// //         disabled={!isRazorpayLoaded || amount === null || loading}
// //         onClick={handlePayment}
// //         className="w-full bg-[#570013] text-white text-xs sm:text-sm font-semibold tracking-wider uppercase py-3.5 px-6 rounded-xl hover:bg-[#800020] transition-all shadow-md active:scale-95 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
// //       >
// //         {loading ? (
// //           <>
// //             <Loader2 className="w-4 h-4 animate-spin" /> Processing Payment...
// //           </>
// //         ) : (
// //           <>
// //             <CreditCard className="w-4 h-4" /> Pay {amount !== null ? `₹${amount.toFixed(2)}` : ""} Now
// //           </>
// //         )}
// //       </button>
// //     </div>
// //   );
// // }

"use client";

import React, { useEffect, useState } from "react";
import Script from "next/script";
import axios from "axios";
import { Loader2, CreditCard } from "lucide-react";

interface RazorpayPaymentProps {
  apiBase: string;
  authToken: string;
  userId: string; // 👈 1. Pass the logged-in user's ID
  documentType?: string;
  userProfile?: {
    name?: string;
    email?: string;
    mobile?: string;
  };
  onSuccess: (paymentResponse: any) => void;
}

export default function RazorpayPayment({
  apiBase,
  authToken,
  userId,
  documentType = "membership",
  userProfile,
  onSuccess,
}: RazorpayPaymentProps) {
  const razorpayKey = process.env.NEXT_PUBLIC_RAZORPAY_KEY || "";

  const [isRazorpayLoaded, setIsRazorpayLoaded] = useState(false);
  const [amount, setAmount] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Fetch fees when component mounts
  useEffect(() => {
    const fetchFees = async () => {
      try {
        const token =
          authToken ||
          localStorage.getItem("token") ||
          localStorage.getItem("accessToken") ||
          "";
        const response = await axios.get(
          `${apiBase}/candidatekyc/fees/${documentType}`,
          {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
          }
        );
        if (response.data.success) {
          setAmount(Number(response.data.fees));
        }
      } catch (error: any) {
        console.error("❌ Error fetching fees:", error);
        setErrorMsg("Failed to load payment amount.");
      }
    };

    if (apiBase) {
      fetchFees();
    }
  }, [apiBase, documentType, authToken]);

  const handlePayment = async () => {
    if (!isRazorpayLoaded) {
      setErrorMsg("Razorpay SDK is still loading. Please wait a moment.");
      return;
    }

    if (!userId) {
      setErrorMsg("User session not found. Please log in again.");
      return;
    }

    setLoading(true);
    setErrorMsg("");

    try {
      const token =
        authToken ||
        localStorage.getItem("token") ||
        localStorage.getItem("accessToken") ||
        "";

      // 2. Pass userId and amount along with documentType to the backend
      const response = await axios.post(
        `${apiBase}/payments/razorpay/create`, // Matches your Next.js API route
        {
          userId, // 👈 Fixed: userId sent to backend
          amount: amount,
          donationType: documentType,
        },
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }
      );

      if (!response.data || !response.data.data) {
        throw new Error(response.data?.message || "Order creation failed from server.");
      }

      const order = response.data.data;

      // 3. Configure Razorpay checkout options
      const options = {
        key: razorpayKey,
        amount: order.amount, // Amount in paise
        currency: order.currency || "INR",
        name: "Association of Bengal",
        description: "Membership Registration & Contribution Fee",
        order_id: order.id,
        handler: async function (paymentResponse: any) {
          console.log("✅ Payment successful, verifying with server...", paymentResponse);
          
          try {
            // Verify payment signature on the backend
            const verifyRes = await axios.post(
              `${apiBase}/payments/razorpay/verify`,
              {
                razorpay_order_id: paymentResponse.razorpay_order_id,
                razorpay_payment_id: paymentResponse.razorpay_payment_id,
                razorpay_signature: paymentResponse.razorpay_signature,
              },
              {
                headers: token ? { Authorization: `Bearer ${token}` } : {},
              }
            );

            if (verifyRes.data.success) {
              setLoading(false);
              if (onSuccess) onSuccess(verifyRes.data);
            } else {
              throw new Error(verifyRes.data.message || "Verification failed");
            }
          } catch (verifyError: any) {
            console.error("❌ Payment verification failed:", verifyError);
            setErrorMsg(verifyError.response?.data?.message || "Payment verification failed.");
            setLoading(false);
          }
        },
        prefill: {
          name: userProfile?.name || "",
          email: userProfile?.email || "",
          contact: userProfile?.mobile || "",
        },
        theme: { color: "#570013" },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on("payment.failed", function (response: any) {
        console.error("❌ Payment failed:", response.error);
        setErrorMsg(response.error.description || "Payment failed. Please try again.");
        setLoading(false);
      });

      rzp.open();
    } catch (error: any) {
      console.error("❌ Error during order creation:", error);
      setErrorMsg(
        error.response?.data?.message || error.message || "Could not initialize payment."
      );
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Load Razorpay SDK */}
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="lazyOnload"
        onLoad={() => setIsRazorpayLoaded(true)}
      />

      <div className="bg-[#fbf2ed] border border-[#e0bfbf] p-5 rounded-2xl flex items-center justify-between">
        <div>
          <h4 className="text-sm font-bold text-[#570013]">Secure Payment Checkout</h4>
          <p className="text-xs text-[#775a19] mt-0.5">
            Complete your registration payment via Razorpay.
          </p>
        </div>
        <div className="text-right">
          <span className="text-[10px] uppercase font-bold text-[#8c7071] block">
            Total Payable
          </span>
          <span className="text-lg font-extrabold text-[#570013]">
            {amount !== null ? `₹${amount.toFixed(2)}` : "Calculating..."}
          </span>
        </div>
      </div>

      {errorMsg && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-3 rounded-xl font-medium">
          {errorMsg}
        </div>
      )}

      <button
        type="button"
        disabled={!isRazorpayLoaded || amount === null || loading}
        onClick={handlePayment}
        className="w-full bg-[#570013] text-white text-xs sm:text-sm font-semibold tracking-wider uppercase py-3.5 px-6 rounded-xl hover:bg-[#800020] transition-all shadow-md active:scale-95 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" /> Processing Payment...
          </>
        ) : (
          <>
            <CreditCard className="w-4 h-4" /> Pay {amount !== null ? `₹${amount.toFixed(2)}` : ""} Now
          </>
        )}
      </button>
    </div>
  );
}



