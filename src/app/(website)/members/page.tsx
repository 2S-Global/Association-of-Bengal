// "use client";

// import React, { useState } from "react";
// import Image from "next/image";
// import { 
//   BookOpen, 
//   ArrowRight, 
//   Sparkles, 
//   History, 
//   PenTool, 
//   ChevronLeft, 
//   ChevronRight, 
//   CheckCircle2, 
//   User, 
//   Mail, 
//   ChevronDown, 
//   CheckCircle, 
//   Loader2 
// } from "lucide-react";

// // --- DYNAMIC DATA ---

// const bentoCards = [
//   {
//     id: "archive",
//     type: "featured-large",
//     badge: "PREMIUM ACCESS",
//     title: "The Digital Archive",
//     description:
//       "Unrestricted access to our century-old manuscripts, rare first editions, and exclusive academic papers digitized for scholarly research.",
//     icon: BookOpen,
//   },
//   {
//     id: "circles",
//     type: "featured-horizontal",
//     title: "Literary Circles",
//     description:
//       "Invitation-only monthly seminars with leading poets and historians.",
//     icon: ArrowRight,
//   },
//   {
//     id: "priority",
//     type: "standard",
//     bgClass: "bg-[#efe6e2]",
//     title: "Priority",
//     description: "Early-bird invitations to the Annual Heritage Festival.",
//     icon: Sparkles,
//   },
//   {
//     id: "publishing",
//     type: "standard",
//     bgClass: "bg-[#e9e1dc]",
//     title: "Publishing",
//     description: "Submit your work to our biannual peer-reviewed journal.",
//     icon: History,
//   },
// ];

// const membersData = [
//   {
//     id: 1,
//     name: "Dr. Alok Nath Tagore",
//     role: "Fellow Emeritus",
//     quote: '"Preserving the rhythm of our ancestors\' ink."',
//     image:
//       "https://lh3.googleusercontent.com/aida-public/AB6AXuDe_QKspD1HGoYjwyOgNkoZoywIxiJQKV_d3V5x15Qf9eh4Hbqilp7gKj_CvzBI0KPQaqbjG-yw7egD3q4-ogoFQ4jJ0gcmmqZh9OUOY6tj3QkwxiQ5b7SriGqBFMEVVfnH1Bx1s1iDf9NY45Y7bjnuAA7RZMIRm575B3iime-qZVAsP61rilZQhD84Y_B75MphIRlu8E3tI8-4fsMCp53d_vp3NvHbRFiQnnYevUx4789julJ75WYK",
//     tags: ["Historiography", "Medieval Poetry"],
//   },
//   {
//     id: 2,
//     name: "Sumitra Sen",
//     role: "Contributing Writer",
//     quote: '"Connecting global Bengali voices through digital prose."',
//     image:
//       "https://lh3.googleusercontent.com/aida-public/AB6AXuA---YTuPXKXgwMPMK3d1C2uvub8erz0p213ZHVDuRiemhf_NxzhY0jO02-5cw_wct4CF7t_FH3qazl4AJGydhp-EVXZYT6K6cYmf9ZfL0VU6LDN0C8LvkUEk4JeegOoSobxr8ameKY0pEXsP8NcBF83DolxERwKjxiKabhBLuLVtLLn_6yhfYkjwDgW645UeS7x-gDTDHpXuzhd2StWTALIg1jNtbA_uHu0vwwk8_aNvjF1LXRD2s4",
//     tags: ["Modern Fiction", "Essays"],
//   },
//   {
//     id: 3,
//     name: "Rohan Mukherjee",
//     role: "Archive Specialist",
//     quote: '"Technology is the bridge to our archival heritage."',
//     image:
//       "https://lh3.googleusercontent.com/aida-public/AB6AXuBUV6XwvaEMPmxFVWQp15JyRbLKZdb6NHOoH_2ZTkBrXXeoCMXawD3KD8XUtOhITaAf2qzlQBG9AqHsAmpn4jyeXJBL8vm1wRnNAZEa0R4n80v-53B7TUaCb_sSvd1qnFBLkoutS3BoPnsZcbhJeaf1JwzUdna6NsMQDAkXWX5RfeYdprGg5UgwTV8q-k4EMR0yvNxQXGwPbUu15wa-8cv7OCD6vtrrP4nQ1RHTGv2bwNxVItgR7RWJ",
//     tags: ["Digital Curation", "Rare Books"],
//   },
// ];

// const joinBenefits = [
//   {
//     title: "Verified Fellowship Status",
//     description:
//       "Gain professional recognition in the field of Bengali studies.",
//   },
//   {
//     title: "Community Forums",
//     description:
//       "Engage in deep discourse with like-minded individuals globally.",
//   },
// ];

// const interestOptions = [
//   "Classical Literature",
//   "Modern Poetry",
//   "Cultural History",
//   "Linguistic Studies",
//   "Philanthropy",
// ];

// // --- COMPONENT ---

// export default function MembersPage() {
//   // Form State
//   const [formData, setFormData] = useState({
//     fullName: "",
//     email: "",
//     interest: "",
//     background: "",
//   });

//   // Validation & UI State
//   const [errors, setErrors] = useState<{ [key: string]: string }>({});
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [isSuccess, setIsSuccess] = useState(false);

//   // Validation Logic
//   const validateForm = () => {
//     const newErrors: { [key: string]: string } = {};

//     if (!formData.fullName.trim()) {
//       newErrors.fullName = "Full name is required.";
//     } else if (formData.fullName.trim().length < 3) {
//       newErrors.fullName = "Name must be at least 3 characters.";
//     }

//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!formData.email.trim()) {
//       newErrors.email = "Email address is required.";
//     } else if (!emailRegex.test(formData.email)) {
//       newErrors.email = "Please enter a valid email address.";
//     }

//     if (!formData.interest) {
//       newErrors.interest = "Please select a specialization.";
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleInputChange = (
//     e: React.ChangeEvent<
//       HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
//     >
//   ) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//     if (errors[name]) {
//       setErrors((prev) => ({ ...prev, [name]: "" }));
//     }
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (!validateForm()) return;

//     setIsSubmitting(true);

//     // Simulate API Call
//     await new Promise((resolve) => setTimeout(resolve, 1500));

//     setIsSubmitting(false);
//     setIsSuccess(true);
//     setFormData({
//       fullName: "",
//       email: "",
//       interest: "",
//       background: "",
//     });
//   };

//   return (
//     <>
      

//       <div className="bg-[#fff8f5] text-[#1e1b18] font-['Libre_Franklin',sans-serif] min-h-screen overflow-x-hidden w-full">
//         <main className="relative z-10 max-w-[1280px] mx-auto px-4 sm:px-6 md:px-12 py-10 lg:py-20 w-full">
//           {/* Hero Section */}
//           <section className="mb-12 lg:mb-20 text-center">
//             <h2 className="text-[28px] sm:text-[32px] md:text-[44px] leading-[1.2] md:leading-[1.2] tracking-[-0.01em] md:tracking-[-0.02em] font-bold text-[#570013] font-['Playfair_Display',serif] mb-4 sm:mb-6">
//               Our Community of Scholars
//             </h2>
//             <p className="max-w-2xl mx-auto text-[16px] sm:text-[18px] leading-[1.6] sm:leading-[28px] text-[#584141] opacity-80 px-4">
//               Join a legacy of intellectual pursuit and cultural preservation. Our
//               members are the guardians of Bengali literature and the architects
//               of its future.
//             </p>
//           </section>

//           {/* Membership Benefits Bento Grid */}
//           <section className="mb-12 lg:mb-20">
//             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
//               {bentoCards.map((card) => {
//                 const IconComponent = card.icon;

//                 if (card.type === "featured-large") {
//                   return (
//                     <div
//                       key={card.id}
//                       className="bento-card-hover hover:shadow-[0_12px_24px_-10px_rgba(87,0,19,0.15)] col-span-1 sm:col-span-2 md:col-span-2 md:row-span-2 bg-[#fbf2ed] border border-[#e0bfbf] p-6 sm:p-12 rounded-xl flex flex-col justify-end relative overflow-hidden min-h-[300px] md:min-h-[400px]"
//                     >
//                       <div className="absolute top-0 right-0 p-8 sm:p-12 opacity-10 pointer-events-none">
//                         <IconComponent className="w-[80px] h-[80px] sm:w-[120px] sm:h-[120px]" />
//                       </div>
//                       <div className="relative z-10">
//                         <span className="bg-[#fed488] text-[#785a1a] px-3 py-1 rounded-full text-[12px] sm:text-[14px] leading-[20px] tracking-[0.05em] font-semibold mb-4 sm:mb-6 inline-block">
//                           {card.badge}
//                         </span>
//                         <h3 className="text-[20px] sm:text-[24px] leading-[1.2] sm:leading-[30px] font-semibold text-[#570013] font-['Playfair_Display',serif] mb-3">
//                           {card.title}
//                         </h3>
//                         <p className="text-[14px] sm:text-[16px] leading-[1.6] sm:leading-[24px] text-[#584141]">
//                           {card.description}
//                         </p>
//                       </div>
//                     </div>
//                   );
//                 }

//                 if (card.type === "featured-horizontal") {
//                   return (
//                     <div
//                       key={card.id}
//                       className="bento-card-hover hover:shadow-[0_12px_24px_-10px_rgba(87,0,19,0.15)] col-span-1 sm:col-span-2 md:col-span-2 bg-[#800020] p-6 sm:p-12 rounded-xl flex items-center justify-between group cursor-pointer"
//                     >
//                       <div className="pr-4">
//                         <h3 className="text-[18px] sm:text-[22px] leading-[1.2] sm:leading-[28px] font-medium text-white font-['Playfair_Display',serif] mb-2 sm:mb-1">
//                           {card.title}
//                         </h3>
//                         <p className="text-[14px] sm:text-[16px] leading-[1.6] sm:leading-[24px] text-white/90">
//                           {card.description}
//                         </p>
//                       </div>
//                       <IconComponent className="text-white w-8 h-8 sm:w-10 sm:h-10 group-hover:translate-x-2 transition-transform shrink-0" />
//                     </div>
//                   );
//                 }

//                 return (
//                   <div
//                     key={card.id}
//                     className={`bento-card-hover hover:shadow-[0_12px_24px_-10px_rgba(87,0,19,0.15)] ${card.bgClass} border border-[#e0bfbf] p-6 rounded-xl flex flex-col items-center justify-center text-center col-span-1`}
//                   >
//                     <IconComponent className="text-[#775a19] mb-3 w-8 h-8 sm:w-10 sm:h-10" />
//                     <h4 className="text-[18px] sm:text-[22px] leading-[1.2] sm:leading-[28px] font-medium text-[#570013] font-['Playfair_Display',serif]">
//                       {card.title}
//                     </h4>
//                     <p className="text-[12px] leading-[16px] text-[#584141] mt-1">
//                       {card.description}
//                     </p>
//                   </div>
//                 );
//               })}
//             </div>
//           </section>

//           {/* Ornamental Divider */}
//           <div className="relative flex items-center justify-center w-full my-10 before:content-[''] before:flex-1 before:h-[1px] before:bg-[#8c7071] before:opacity-30 after:content-[''] after:flex-1 after:h-[1px] after:bg-[#8c7071] after:opacity-30">
//             <PenTool className="px-4 text-[#775a19] w-10 h-6 box-content" />
//           </div>

//           {/* Member Spotlight (Directory) */}
//           <section className="mb-12 lg:mb-20">
//             <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 sm:mb-12 gap-4">
//               <div>
//                 <h2 className="text-[24px] sm:text-[28px] md:text-[32px] leading-[1.2] sm:leading-[38px] font-semibold text-[#570013] font-['Playfair_Display',serif] mb-2 sm:mb-1">
//                   Member Spotlight
//                 </h2>
//                 <p className="text-[14px] sm:text-[16px] leading-[1.6] sm:leading-[24px] text-[#584141]">
//                   Celebrating our most dedicated contributors and fellows.
//                 </p>
//               </div>
//               <div className="flex gap-3">
//                 <button
//                   className="p-2 sm:p-3 border border-[#8c7071] rounded-full hover:bg-[#e9e1dc] transition-colors focus:ring-2 focus:ring-[#570013] outline-none flex items-center justify-center"
//                   aria-label="Previous Members"
//                 >
//                   <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
//                 </button>
//                 <button
//                   className="p-2 sm:p-3 border border-[#8c7071] rounded-full hover:bg-[#e9e1dc] transition-colors focus:ring-2 focus:ring-[#570013] outline-none flex items-center justify-center"
//                   aria-label="Next Members"
//                 >
//                   <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
//                 </button>
//               </div>
//             </div>

//             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
//               {membersData.map((member) => (
//                 <div
//                   key={member.id}
//                   className="border border-[#e0bfbf] rounded-lg p-2 bg-[#fff8f5] shadow-sm hover:shadow-md transition-shadow flex flex-col"
//                 >
//                   <div className="h-56 sm:h-64 overflow-hidden mb-4 sm:mb-6 rounded-lg relative shrink-0">
//                     <Image
//                       fill
//                       className="w-full h-full object-cover"
//                       alt={member.name}
//                       src={member.image}
//                       sizes="(max-width: 768px) 100vw, 33vw"
//                     />
//                   </div>
//                   <div className="p-2 flex-grow flex flex-col">
//                     <span className="text-[12px] sm:text-[14px] leading-[20px] font-semibold text-[#775a19] uppercase tracking-[0.05em] mb-1 block">
//                       {member.role}
//                     </span>
//                     <h3 className="text-[18px] sm:text-[22px] leading-[1.2] sm:leading-[28px] font-medium text-[#570013] font-['Playfair_Display',serif] mb-2 sm:mb-1">
//                       {member.name}
//                     </h3>
//                     <p className="text-[14px] sm:text-[16px] leading-[1.6] sm:leading-[24px] text-[#584141] italic mb-4 sm:mb-6 flex-grow">
//                       {member.quote}
//                     </p>
//                     <div className="flex flex-wrap gap-2 sm:gap-1 mt-auto">
//                       {member.tags.map((tag) => (
//                         <span
//                           key={tag}
//                           className="bg-[#fbf2ed] text-[#775a19] px-2 py-1 rounded text-[11px] sm:text-[12px] font-semibold"
//                         >
//                           {tag}
//                         </span>
//                       ))}
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
// {/* 
//             <div className="mt-10 sm:mt-12 text-center">
//               <button className="px-8 sm:px-12 py-3 border-2 border-[#570013] text-[#570013] text-[12px] sm:text-[14px] leading-[20px] tracking-[0.05em] font-semibold rounded-full hover:bg-[#570013] hover:text-white transition-all duration-300 focus:ring-4 focus:ring-[#e0bfbf] outline-none">
//                 View Full Directory
//               </button>
//             </div> */}
//           </section>

//           {/* Join Us Form Section */}
//           <section className="bg-[#fbf2ed] border border-[#e0bfbf] rounded-xl overflow-hidden flex flex-col lg:grid lg:grid-cols-2 shadow-sm">
//             {/* Left Side Info */}
//             <div className="p-6 sm:p-10 md:p-12 lg:p-20 flex flex-col justify-center">
//               <h2 className="text-[24px] sm:text-[28px] md:text-[32px] leading-[1.2] sm:leading-[38px] font-semibold text-[#570013] font-['Playfair_Display',serif] mb-4 sm:mb-6">
//                 Begin Your Journey
//               </h2>
//               <p className="text-[14px] sm:text-[16px] md:text-[18px] leading-[1.6] sm:leading-[28px] text-[#584141] mb-8 sm:mb-12">
//                 Whether you are an established scholar or a curious seeker of
//                 cultural roots, our doors are open to those who share our passion.
//               </p>
//               <ul className="space-y-4 sm:space-y-6 mb-2 lg:mb-0">
//                 {joinBenefits.map((benefit, index) => (
//                   <li key={index} className="flex gap-4 sm:gap-6">
//                     <CheckCircle2 className="text-[#775a19] shrink-0 w-5 h-5 sm:w-6 sm:h-6" />
//                     <div>
//                       <span className="text-[14px] leading-[20px] tracking-[0.05em] font-semibold text-[#1e1b18]">
//                         {benefit.title}
//                       </span>
//                       <p className="text-[12px] sm:text-[14px] leading-[1.4] sm:leading-[16px] text-[#584141] mt-1">
//                         {benefit.description}
//                       </p>
//                     </div>
//                   </li>
//                 ))}
//               </ul>
//             </div>

//             {/* Right Side Form (or Success State) */}
//             <div className="bg-white p-6 sm:p-10 md:p-12 lg:p-16 border-t lg:border-t-0 lg:border-l border-[#e0bfbf] flex flex-col justify-center min-h-[500px]">
//               {isSuccess ? (
//                 // --- SUCCESS STATE ---
//                 <div className="text-center fade-in">
//                   <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[#fbf2ed] mb-6">
//                     <CheckCircle className="text-[#775a19] w-10 h-10" />
//                   </div>
//                   <h3 className="text-[22px] sm:text-[26px] font-['Playfair_Display',serif] font-semibold text-[#570013] mb-3">
//                     Application Received
//                   </h3>
//                   <p className="text-[15px] text-[#584141] leading-relaxed mb-8 max-w-sm mx-auto">
//                     Thank you for your interest. Our fellowship committee will
//                     review your details and reach out shortly.
//                   </p>
//                   <button
//                     onClick={() => setIsSuccess(false)}
//                     className="px-8 py-3 border border-[#8c7071] text-[#584141] text-[13px] font-semibold rounded-lg hover:bg-[#fbf2ed] transition-colors outline-none focus:ring-2 focus:ring-[#570013]"
//                   >
//                     Submit Another Request
//                   </button>
//                 </div>
//               ) : (
//                 // --- FORM ---
//                 <form onSubmit={handleSubmit} className="space-y-6 fade-in">
//                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
//                     {/* Full Name Input */}
//                     <div className="relative group">
//                       <label
//                         htmlFor="fullName"
//                         className={`text-[12px] sm:text-[13px] tracking-[0.05em] font-semibold block mb-1.5 transition-colors ${
//                           errors.fullName
//                             ? "text-[#ba1a1a]"
//                             : "text-[#584141] group-focus-within:text-[#570013]"
//                         }`}
//                       >
//                         Full Name
//                       </label>
//                       <div className="relative flex items-center">
//                         <input
//                           id="fullName"
//                           name="fullName"
//                           value={formData.fullName}
//                           onChange={handleInputChange}
//                           className={`w-full bg-[#fbf2ed]/40 border-0 border-b-2 rounded-t-md pl-4 pr-10 py-3 text-[15px] text-[#1e1b18] placeholder-gray-400 focus:ring-0 outline-none transition-all ${
//                             errors.fullName
//                               ? "border-[#ba1a1a] focus:bg-[#fbf2ed]/60"
//                               : "border-[#e0bfbf] focus:border-[#570013] focus:bg-[#fbf2ed]/60 hover:bg-[#fbf2ed]/60"
//                           }`}
//                           placeholder="e.g. Rabindra Nath"
//                           type="text"
//                         />
//                         <User
//                           className={`absolute right-3 w-5 h-5 transition-colors pointer-events-none ${
//                             errors.fullName
//                               ? "text-[#ba1a1a]"
//                               : "text-[#8c7071]"
//                           }`}
//                         />
//                       </div>
//                       {errors.fullName && (
//                         <p className="text-[#ba1a1a] text-[12px] mt-1.5 fade-in font-medium">
//                           {errors.fullName}
//                         </p>
//                       )}
//                     </div>

//                     {/* Email Input */}
//                     <div className="relative group">
//                       <label
//                         htmlFor="email"
//                         className={`text-[12px] sm:text-[13px] tracking-[0.05em] font-semibold block mb-1.5 transition-colors ${
//                           errors.email
//                             ? "text-[#ba1a1a]"
//                             : "text-[#584141] group-focus-within:text-[#570013]"
//                         }`}
//                       >
//                         Email Address
//                       </label>
//                       <div className="relative flex items-center">
//                         <input
//                           id="email"
//                           name="email"
//                           value={formData.email}
//                           onChange={handleInputChange}
//                           className={`w-full bg-[#fbf2ed]/40 border-0 border-b-2 rounded-t-md pl-4 pr-10 py-3 text-[15px] text-[#1e1b18] placeholder-gray-400 focus:ring-0 outline-none transition-all ${
//                             errors.email
//                               ? "border-[#ba1a1a] focus:bg-[#fbf2ed]/60"
//                               : "border-[#e0bfbf] focus:border-[#570013] focus:bg-[#fbf2ed]/60 hover:bg-[#fbf2ed]/60"
//                           }`}
//                           placeholder="email@domain.com"
//                           type="email"
//                         />
//                         <Mail
//                           className={`absolute right-3 w-5 h-5 transition-colors pointer-events-none ${
//                             errors.email
//                               ? "text-[#ba1a1a]"
//                               : "text-[#8c7071]"
//                           }`}
//                         />
//                       </div>
//                       {errors.email && (
//                         <p className="text-[#ba1a1a] text-[12px] mt-1.5 fade-in font-medium">
//                           {errors.email}
//                         </p>
//                       )}
//                     </div>
//                   </div>

//                   {/* Mandatory Interest Select */}
//                   <div className="relative group">
//                     <label
//                       htmlFor="interest"
//                       className={`text-[12px] sm:text-[13px] tracking-[0.05em] font-semibold block mb-1.5 transition-colors ${
//                         errors.interest
//                           ? "text-[#ba1a1a]"
//                           : "text-[#584141] group-focus-within:text-[#570013]"
//                       }`}
//                     >
//                       Interest / Specialization
//                     </label>
//                     <div className="relative flex items-center">
//                       <select
//                         id="interest"
//                         name="interest"
//                         value={formData.interest}
//                         onChange={handleInputChange}
//                         className={`w-full bg-[#fbf2ed]/40 border-0 border-b-2 rounded-t-md pl-4 pr-10 py-3 text-[15px] outline-none cursor-pointer appearance-none transition-all focus:ring-0 focus:bg-[#fbf2ed]/60 hover:bg-[#fbf2ed]/60 ${
//                           errors.interest
//                             ? "border-[#ba1a1a] focus:border-[#ba1a1a] text-[#1e1b18]"
//                             : "border-[#e0bfbf] focus:border-[#570013]"
//                         } ${!formData.interest ? "text-gray-400" : "text-[#1e1b18]"}`}
//                       >
//                         {/* Disabled Placeholder Option */}
//                         <option value="" disabled className="bg-[#fff8f5] text-gray-400">
//                           Select a specialization...
//                         </option>
//                         {interestOptions.map((option) => (
//                           <option
//                             key={option}
//                             value={option}
//                             className="bg-[#fff8f5] text-[#1e1b18]"
//                           >
//                             {option}
//                           </option>
//                         ))}
//                       </select>
//                       <ChevronDown
//                         className={`absolute right-3 w-5 h-5 pointer-events-none transition-colors ${
//                           errors.interest
//                             ? "text-[#ba1a1a]"
//                             : "text-[#8c7071]"
//                         }`}
//                       />
//                     </div>
//                     {errors.interest && (
//                       <p className="text-[#ba1a1a] text-[12px] mt-1.5 fade-in font-medium">
//                         {errors.interest}
//                       </p>
//                     )}
//                   </div>

//                   {/* Background Textarea */}
//                   <div className="relative group">
//                     <label
//                       htmlFor="background"
//                       className="text-[12px] sm:text-[13px] tracking-[0.05em] font-semibold text-[#584141] group-focus-within:text-[#570013] block mb-1.5 transition-colors"
//                     >
//                       Tell us about your work (Optional)
//                     </label>
//                     <textarea
//                       id="background"
//                       name="background"
//                       value={formData.background}
//                       onChange={handleInputChange}
//                       className="w-full border-2 border-[#e0bfbf] rounded-lg p-4 bg-[#fbf2ed]/30 focus:ring-0 focus:border-[#570013] focus:bg-[#fbf2ed]/60 hover:bg-[#fbf2ed]/60 transition-all resize-none text-[15px] text-[#1e1b18] placeholder-gray-400 outline-none"
//                       placeholder="Briefly describe your interest or academic background..."
//                       rows={4}
//                     ></textarea>
//                   </div>

//                   {/* Submit Button */}
//                   <div className="pt-2">
//                     <button
//                       disabled={isSubmitting}
//                       className={`w-full flex items-center justify-center gap-2 bg-[#570013] text-white py-4 rounded-lg text-[13px] sm:text-[14px] tracking-[0.05em] font-semibold transition-all shadow-md outline-none focus:ring-0 ${
//                         isSubmitting
//                           ? "opacity-80 cursor-not-allowed"
//                           : "hover:bg-[#800020] hover:shadow-lg transform active:scale-95 duration-200"
//                       }`}
//                       type="submit"
//                     >
//                       {isSubmitting ? (
//                         <>
//                           <Loader2 className="animate-spin w-5 h-5" />
//                           Submitting...
//                         </>
//                       ) : (
//                         "Request Membership Information"
//                       )}
//                     </button>
//                   </div>
//                   <p className="text-center text-[11px] sm:text-[12px] text-[#8c7071] mt-4">
//                     By clicking, you agree to our Terms of Participation.
//                   </p>
//                 </form>
//               )}
//             </div>
//           </section>
//         </main>
//       </div>
//     </>
//   );
// }





"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { 
  FileCheck, 
  Users, 
  ShieldCheck, 
  PenTool, 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle2, 
  User, 
  Mail, 
  ChevronDown, 
  CheckCircle, 
  Loader2,
  X,
  ExternalLink,
  UserPlus
} from "lucide-react";

// --- DYNAMIC DATA ---

const bentoCards = [
  {
    id: "archive",
    type: "featured-large",
    badge: "PREMIUM ACCESS",
    title: "The Digital Archive",
    description:
      "Unrestricted access to our century-old manuscripts, rare first editions, and exclusive academic papers digitized for scholarly research.",
    imageSrc: "/images/shape/multipleuser.png",
  },
  {
    id: "circles",
    type: "featured-horizontal",
    title: "Apply for Membership",
    description:
      "Join our community of scholars, writers, and cultural enthusiasts to access exclusive events and archives.",
    icon: UserPlus,
  },
  {
    id: "Membership Categories",
    type: "standard",
    bgClass: "bg-[#efe6e2]",
    title: "Membership Categories",
    description: "Early-bird invitations to the Annual Heritage Festival.",
    icon: FileCheck,
  },
  {
    id: "Eligibility Criteria",
    type: "standard",
    bgClass: "bg-[#e9e1dc]",
    title: "Eligibility Criteria",
    description: "Submit your work to our biannual peer-reviewed journal.",
    icon: ShieldCheck,
  },
];

const membersData = [
  {
    id: 1,
    name: "Dr. Alok Nath Tagore",
    role: "Fellow Emeritus",
    quote: '"Preserving the rhythm of our ancestors\' ink."',
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDe_QKspD1HGoYjwyOgNkoZoywIxiJQKV_d3V5x15Qf9eh4Hbqilp7gKj_CvzBI0KPQaqbjG-yw7egD3q4-ogoFQ4jJ0gcmmqZh9OUOY6tj3QkwxiQ5b7SriGqBFMEVVfnH1Bx1s1iDf9NY45Y7bjnuAA7RZMIRm575B3iime-qZVAsP61rilZQhD84Y_B75MphIRlu8E3tI8-4fsMCp53d_vp3NvHbRFiQnnYevUx4789julJ75WYK",
    tags: ["Historiography", "Medieval Poetry"],
  },
  {
    id: 2,
    name: "Sumitra Sen",
    role: "Contributing Writer",
    quote: '"Connecting global Bengali voices through digital prose."',
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuA---YTuPXKXgwMPMK3d1C2uvub8erz0p213ZHVDuRiemhf_NxzhY0jO02-5cw_wct4CF7t_FH3qazl4AJGydhp-EVXZYT6K6cYmf9ZfL0VU6LDN0C8LvkUEk4JeegOoSobxr8ameKY0pEXsP8NcBF83DolxERwKjxiKabhBLuLVtLLn_6yhfYkjwDgW645UeS7x-gDTDHpXuzhd2StWTALIg1jNtbA_uHu0vwwk8_aNvjF1LXRD2s4",
    tags: ["Modern Fiction", "Essays"],
  },
  {
    id: 3,
    name: "Rohan Mukherjee",
    role: "Archive Specialist",
    quote: '"Technology is the bridge to our archival heritage."',
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBUV6XwvaEMPmxFVWQp15JyRbLKZdb6NHOoH_2ZTkBrXXeoCMXawD3KD8XUtOhITaAf2qzlQBG9AqHsAmpn4jyeXJBL8vm1wRnNAZEa0R4n80v-53B7TUaCb_sSvd1qnFBLkoutS3BoPnsZcbhJeaf1JwzUdna6NsMQDAkXWX5RfeYdprGg5UgwTV8q-k4EMR0yvNxQXGwPbUu15wa-8cv7OCD6vtrrP4nQ1RHTGv2bwNxVItgR7RWJ",
    tags: ["Digital Curation", "Rare Books"],
  },
];

const joinBenefits = [
  {
    title: "Verified Fellowship Status",
    description: "Gain professional recognition in the field of Bengali studies.",
  },
  {
    title: "Community Forums",
    description: "Engage in deep discourse with like-minded individuals globally.",
  },
];

const interestOptions = [
  "Classical Literature",
  "Modern Poetry",
  "Cultural History",
  "Linguistic Studies",
  "Philanthropy",
];

// --- MODAL DATA CONTENT (Upgraded UI, Identical Data) ---

const modalContentData = {
  "Membership Categories": (
    <div className="space-y-6 text-[#1e1b18]">
      <div className="flex items-center gap-3 border-b border-[#e0bfbf]/40 pb-3">
        <span className="w-1.5 h-1.5 rounded-full bg-[#775a19]"></span>
        <p className="font-bold text-lg text-[#570013] font-['Playfair_Display',serif] tracking-wide">
          Membership Categories (Alphabetical)
        </p>
      </div>
      
      <ol className="list-decimal pl-5 space-y-2.5 text-[15px] leading-relaxed text-[#584141] columns-1 sm:columns-2 gap-x-8 marker:text-[#775a19] marker:font-semibold">
        <li className="pl-1 break-inside-avoid">Binder / Bookbinder</li>
        <li className="pl-1 break-inside-avoid">Comics Artist</li>
        <li className="pl-1 break-inside-avoid">Composer / DTP Artist</li>
        <li className="pl-1 break-inside-avoid">Cover Artist</li>
        <li className="pl-1 break-inside-avoid">Digital Graphic Designer</li>
        <li className="pl-1 break-inside-avoid">Editor</li>
        <li className="pl-1 break-inside-avoid">Employee of Bookseller and/or Publisher</li>
        <li className="pl-1 break-inside-avoid">Illustrator</li>
        <li className="pl-1 break-inside-avoid">Painter</li>
        <li className="pl-1 break-inside-avoid">Performing Artist</li>
        <li className="pl-1 break-inside-avoid">Poet</li>
        <li className="pl-1 break-inside-avoid">Printing Press / Printer</li>
        <li className="pl-1 break-inside-avoid">Proofreader</li>
        <li className="pl-1 break-inside-avoid">Publisher</li>
        <li className="pl-1 break-inside-avoid">Reader / Consumer</li>
        <li className="pl-1 break-inside-avoid">Retail Bookseller</li>
        <li className="pl-1 break-inside-avoid">Wholesale Book Distributor</li>
        <li className="pl-1 break-inside-avoid">Writer</li>
      </ol>
    </div>
  ),
  "Eligibility Criteria": (
    <div className="space-y-6 text-[#1e1b18]">
      <p className="text-[15px] leading-relaxed text-[#584141]">
        Membership should be open to individuals and organisations genuinely associated with literature, books, publishing, printing, visual arts, performing arts, or cultural activities, as well as readers who support the objectives of the Association.
      </p>
      
      <div className="space-y-4">
        <div className="flex items-center gap-3 border-b border-[#e0bfbf]/40 pb-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#775a19]"></span>
          <p className="font-bold text-lg text-[#570013] font-['Playfair_Display',serif] tracking-wide">
            The applicant should:
          </p>
        </div>
        <ul className="list-disc pl-5 space-y-3 text-[15px] leading-relaxed text-[#584141] marker:text-[#c4a4a4]">
          <li className="pl-1">Be 18 years of age or above for regular membership. A separate student/junior category can be introduced later if desired.</li>
          <li className="pl-1">Select the appropriate membership category.</li>
          <li className="pl-1">Provide valid identity and contact details.</li>
          <li className="pl-1">Provide reasonable proof of professional, creative, business, or cultural involvement wherever applicable.</li>
          <li className="pl-1">Agree to abide by the Constitution, Rules, Code of Conduct, and objectives of the Association.</li>
          <li className="pl-1">Pay the prescribed membership fee (if applicable).</li>
          <li className="pl-1">Be subject to verification and approval by the authorised Membership Committee/Admin.</li>
        </ul>
      </div>

      <div className="relative mt-8 p-5 rounded-xl bg-gradient-to-br from-[#fbf2ed] to-[#fff8f5] border border-[#e0bfbf]/60 shadow-[inset_0_1px_3px_rgba(255,255,255,0.5)] overflow-hidden">
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#775a19]"></div>
        <div className="flex gap-3">
          <CheckCircle2 className="w-5 h-5 text-[#775a19] shrink-0 mt-0.5" />
          <p className="text-[14px] italic text-[#584141] leading-relaxed">
            For Reader / Consumer, professional proof should not be necessary. Valid identity proof and declaration of interest in literature and culture should be sufficient.
          </p>
        </div>
      </div>
    </div>
  ),
};

// --- MAIN COMPONENT ---

export default function MembersPage() {
  const [activeModal, setActiveModal] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    interest: "",
    background: "",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setActiveModal(null);
      }
    };

    if (activeModal) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeModal]);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required.";
    } else if (formData.fullName.trim().length < 3) {
      newErrors.fullName = "Name must be at least 3 characters.";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = "Email address is required.";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (!formData.interest) {
      newErrors.interest = "Please select a specialization.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setIsSuccess(true);
    setFormData({
      fullName: "",
      email: "",
      interest: "",
      background: "",
    });
  };

  return (
    <>
      <div className="bg-[#fff8f5] text-[#1e1b18] font-['Libre_Franklin',sans-serif] min-h-screen overflow-x-hidden w-full">
        <main className="relative z-10 max-w-[1280px] mx-auto px-4 sm:px-6 md:px-12 py-10 lg:py-20 w-full">
          {/* Hero Section */}
          <section className="mb-12 lg:mb-20 text-center">
            <h2 className="text-[28px] sm:text-[32px] md:text-[44px] leading-[1.2] md:leading-[1.2] tracking-[-0.01em] md:tracking-[-0.02em] font-bold text-[#570013] font-['Playfair_Display',serif] mb-4 sm:mb-6">
              Our Community of Scholars
            </h2>
            <p className="max-w-2xl mx-auto text-[16px] sm:text-[18px] leading-[1.6] sm:leading-[28px] text-[#584141] opacity-80 px-4">
              Join a legacy of intellectual pursuit and cultural preservation. Our
              members are the guardians of Bengali literature and the architects
              of its future.
            </p>
          </section>

          {/* Dynamic Bento Grid */}
          <section className="mb-12 lg:mb-20">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {bentoCards.map((card) => {
                const IconComponent = card.icon;
                const isTargetCardModal = activeModal === card.title;

                if (card.type === "featured-large") {
                  return (
                    <div
                      key={card.id}
                      className="group relative overflow-hidden min-h-[320px] md:min-h-[400px] rounded-xl p-6 sm:p-10 transition-all duration-300 col-span-1 sm:col-span-2 md:col-span-2 md:row-span-2 bg-[#fbf2ed] flex flex-col justify-between border border-[#e0bfbf] hover:border-[#570013]/40 hover:shadow-[0_12px_24px_-10px_rgba(87,0,19,0.15)]"
                    >
                      {/* Background Matched Image - Tinted */}
                      {card.imageSrc && (
                        <div className="absolute -right-6 -bottom-6 opacity-[0.06] pointer-events-none group-hover:opacity-[0.12] transition-opacity">
                          <Image
                            src={card.imageSrc}
                            alt=""
                            width={220}
                            height={220}
                            className="object-contain filter-[brightness(0)_saturate(100%)_invert(8%)_sepia(87%)_saturate(5412%)_hue-rotate(339deg)_brightness(88%)_contrast(106%)]"
                          />
                        </div>
                      )}

                      {/* Top Bar Icon */}
                      <div className="relative z-10 flex items-center justify-between">
                        <span className="bg-[#fed488] text-[#785a1a] px-3.5 py-1.5 rounded-full text-[12px] leading-none tracking-[0.05em] font-semibold">
                          {card.badge}
                        </span>
                        <div className="w-12 h-12 rounded-xl bg-[#570013]/10 flex items-center justify-center shrink-0 border border-[#570013]/10 p-2.5">
                          {card.imageSrc && (
                            <Image
                              src={card.imageSrc}
                              alt={card.title}
                              width={26}
                              height={26}
                              className="object-contain filter-[brightness(0)_saturate(100%)_invert(8%)_sepia(87%)_saturate(5412%)_hue-rotate(339deg)_brightness(88%)_contrast(106%)]"
                            />
                          )}
                        </div>
                      </div>

                      {/* Card Content */}
                      <div className="relative z-10 mt-auto pt-6">
                        <h3 className="text-[20px] sm:text-[24px] leading-[1.2] sm:leading-[30px] font-semibold text-[#570013] font-['Playfair_Display',serif] mb-3">
                          {card.title}
                        </h3>
                        <p className="text-[14px] sm:text-[16px] leading-[1.6] sm:leading-[24px] text-[#584141]">
                          {card.description}
                        </p>
                      </div>
                    </div>
                  );
                }

                if (card.type === "featured-horizontal") {
                  return (
                    <div
                      key={card.id}
                      className="col-span-1 sm:col-span-2 md:col-span-2 bg-[#800020] p-6 sm:p-10 rounded-xl flex items-center justify-between group cursor-pointer transition-all duration-300 hover:shadow-[0_12px_24px_-10px_rgba(87,0,19,0.2)] hover:-translate-y-0.5 border border-[#800020]"
                    >
                      <div className="pr-4">
                        <h3 className="text-[18px] sm:text-[22px] leading-[1.2] sm:leading-[28px] font-medium text-white font-['Playfair_Display',serif] mb-2 sm:mb-1">
                          {card.title}
                        </h3>
                        <p className="text-[14px] sm:text-[16px] leading-[1.6] sm:leading-[24px] text-white/90">
                          {card.description}
                        </p>
                      </div>
                      <div className="w-12 h-12 rounded-xl bg-white/10 text-white flex items-center justify-center shrink-0 group-hover:translate-x-1.5 transition-transform duration-300">
                        {IconComponent && <IconComponent className="w-6 h-6 stroke-[1.75]" />}
                      </div>
                    </div>
                  );
                }

                return (
                  <div
                    key={card.id}
                    onClick={() => setActiveModal(card.title)}
                    className={`group ${card.bgClass} p-6 rounded-xl flex flex-col items-center justify-center text-center col-span-1 cursor-pointer transition-all duration-300 ${
                      isTargetCardModal
                        ? "ring-2 ring-[#570013] border-transparent shadow-lg scale-[0.99]"
                        : "border border-[#e0bfbf] hover:border-[#570013]/40 hover:shadow-[0_12px_24px_-10px_rgba(87,0,19,0.15)] hover:-translate-y-0.5"
                    }`}
                  >
                    <div className="w-12 h-12 mb-3 flex items-center justify-center rounded-xl bg-[#570013]/5 text-[#775a19] shrink-0 border border-[#775a19]/10 group-hover:scale-110 transition-transform">
                      {IconComponent && <IconComponent className="w-6 h-6 stroke-[1.75]" />}
                    </div>
                    <h4 className="text-[18px] sm:text-[20px] leading-[1.3] font-medium text-[#570013] font-['Playfair_Display',serif]">
                      {card.title}
                    </h4>
                    <p className="text-[12px] leading-[16px] text-[#584141] mt-2 opacity-90">
                      {card.description}
                    </p>
                    <span className="mt-3 text-[11px] uppercase tracking-wider font-semibold text-[#775a19] opacity-80 group-hover:opacity-100 transition-opacity">
                      Click to expand →
                    </span>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Section Divider */}
          <div className="relative flex items-center justify-center w-full my-10 before:content-[''] before:flex-1 before:h-[1px] before:bg-[#8c7071] before:opacity-30 after:content-[''] after:flex-1 after:h-[1px] after:bg-[#8c7071] after:opacity-30">
            <PenTool className="px-4 text-[#775a19] w-10 h-6 box-content" />
          </div>

          {/* Member Directory */}
          <section className="mb-12 lg:mb-20">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 sm:mb-12 gap-4">
              <div>
                <h2 className="text-[24px] sm:text-[28px] md:text-[32px] leading-[1.2] sm:leading-[38px] font-semibold text-[#570013] font-['Playfair_Display',serif] mb-2 sm:mb-1">
                  Member Spotlight
                </h2>
                <p className="text-[14px] sm:text-[16px] leading-[1.6] sm:leading-[24px] text-[#584141]">
                  Celebrating our most dedicated contributors and fellows.
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  className="p-2 sm:p-3 border border-[#8c7071] rounded-full hover:bg-[#e9e1dc] transition-colors focus:ring-2 focus:ring-[#570013] outline-none flex items-center justify-center"
                  aria-label="Previous Members"
                >
                  <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
                <button
                  className="p-2 sm:p-3 border border-[#8c7071] rounded-full hover:bg-[#e9e1dc] transition-colors focus:ring-2 focus:ring-[#570013] outline-none flex items-center justify-center"
                  aria-label="Next Members"
                >
                  <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {membersData.map((member) => (
                <div
                  key={member.id}
                  className="border border-[#e0bfbf] rounded-lg p-2 bg-[#fff8f5] shadow-sm hover:shadow-md transition-shadow flex flex-col"
                >
                  <div className="h-56 sm:h-64 overflow-hidden mb-4 sm:mb-6 rounded-lg relative shrink-0">
                    <Image
                      fill
                      className="w-full h-full object-cover"
                      alt={member.name}
                      src={member.image}
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </div>
                  <div className="p-2 flex-grow flex flex-col">
                    <span className="text-[12px] sm:text-[14px] leading-[20px] font-semibold text-[#775a19] uppercase tracking-[0.05em] mb-1 block">
                      {member.role}
                    </span>
                    <h3 className="text-[18px] sm:text-[22px] leading-[1.2] sm:leading-[28px] font-medium text-[#570013] font-['Playfair_Display',serif] mb-2 sm:mb-1">
                      {member.name}
                    </h3>
                    <p className="text-[14px] sm:text-[16px] leading-[1.6] sm:leading-[24px] text-[#584141] italic mb-4 sm:mb-6 flex-grow">
                      {member.quote}
                    </p>
                    <div className="flex flex-wrap gap-2 sm:gap-1 mt-auto">
                      {member.tags.map((tag) => (
                        <span
                          key={tag}
                          className="bg-[#fbf2ed] text-[#775a19] px-2 py-1 rounded text-[11px] sm:text-[12px] font-semibold"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Form Section */}
          {/* ... Commented out as requested in your previous blocks ... */}
        </main>

        {/* Modal Window */}
        {activeModal && (
          <div 
            onClick={() => setActiveModal(null)}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1e1b18]/60 backdrop-blur-md animate-in fade-in duration-300 cursor-pointer"
          >
            <div 
              onClick={(e) => e.stopPropagation()} 
              className="bg-[#fff8f5] border border-[#e0bfbf] rounded-2xl shadow-[0_20px_50px_-12px_rgba(87,0,19,0.25)] w-full max-w-2xl overflow-hidden flex flex-col max-h-[85vh] cursor-default animate-in zoom-in-95 slide-in-from-bottom-4 duration-300 ease-out"
            >
              {/* Modal Header */}
              <div className="flex justify-between items-center px-6 sm:px-8 py-5 border-b border-[#e0bfbf]/50 bg-gradient-to-r from-[#fbf2ed] to-[#fff8f5]">
                <h3 className="text-[22px] sm:text-[26px] font-bold text-[#570013] font-['Playfair_Display',serif] tracking-tight">
                  {activeModal}
                </h3>
                <button
                  onClick={() => setActiveModal(null)}
                  className="p-2 rounded-full text-[#8c7071] bg-white/50 hover:bg-[#e9e1dc] hover:text-[#570013] transition-all duration-200 outline-none focus:ring-2 focus:ring-[#570013]/30"
                  aria-label="Close modal"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 sm:p-8 overflow-y-auto flex-1 custom-scrollbar">
                {modalContentData[activeModal as keyof typeof modalContentData] || (
                  <p className="text-[#584141] text-center italic py-8">No additional details available.</p>
                )}
              </div>

              {/* Modal Footer */}
              <div className="px-6 sm:px-8 py-4 border-t border-[#e0bfbf]/50 bg-white/40 flex justify-end">
                <button
                  onClick={() => setActiveModal(null)}
                  className="px-6 py-2.5 bg-[#570013] text-white text-[13px] tracking-[0.03em] font-semibold rounded-lg hover:bg-[#800020] hover:shadow-lg transition-all duration-200 active:scale-95 outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#570013]"
                >
                  Acknowledge & Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}