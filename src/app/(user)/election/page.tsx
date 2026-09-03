// "use client";

// import React, { useState, useEffect } from "react";
// import { 
//   Vote, 
//   Calendar, 
//   CheckCircle2, 
//   AlertCircle, 
//   Loader2, 
//   ChevronRight, 
//   ArrowLeft, 
//   FileText, 
//   Award, 
//   Users, 
//   ShieldCheck, 
//   CheckSquare, 
//   Square,
//   Sparkles,
//   BarChart3,
//   Send,
//   Lock,
//   Filter,
//   Search,
//   X
// } from "lucide-react";

// const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_URL || "https://balc.albdglobal.org"}/api/v1`;

// export default function ElectionsPage() {
//   const [elections, setElections] = useState<any[]>([]);
//   const [selectedStatusFilter, setSelectedStatusFilter] = useState("");
//   const [searchQuery, setSearchQuery] = useState("");

//   const [selectedElectionId, setSelectedElectionId] = useState<string | null>(null);
//   const [electionDetail, setElectionDetail] = useState<any>(null);
//   const [nominationsData, setNominationsData] = useState<any>({ nominations: [], myNomination: null });
//   const [voteStatus, setVoteStatus] = useState<any>({ hasVoted: false });
//   const [resultsData, setResultsData] = useState<any>(null);

//   const [isLoading, setIsLoading] = useState(true);
//   const [isDetailLoading, setIsDetailLoading] = useState(false);
//   const [actionLoading, setActionLoading] = useState(false);
//   const [message, setMessage] = useState({ type: "", text: "" });

//   // Nomination form state
//   const [nominationForm, setNominationForm] = useState({
//     position: "",
//     manifesto: "",
//     agreedToTerms: false
//   });

//   // Voting selection state
//   const [selectedNominationIds, setSelectedNominationIds] = useState<string[]>([]);

//   const getToken = () => 
//     localStorage.getItem("token") || 
//     localStorage.getItem("accessToken") || 
//     localStorage.getItem("access_token");

//   // Fetch all elections on mount
//   useEffect(() => {
//     fetchElections();
//   }, []);

//   const fetchElections = async () => {
//     setIsLoading(true);
//     const token = getToken();
//     try {
//       const res = await fetch(`${API_BASE_URL}/elections`, {
//         headers: { "Authorization": `Bearer ${token}` }
//       });
//       const json = await res.json();
//       if (res.ok && json?.data) {
//         setElections(json.data.elections || json.data || []);
//       }
//     } catch (err) {
//       console.error("Failed to fetch elections", err);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Filter elections locally based on status and search query (title/wing/description)
//   const filteredElections = elections.filter((election) => {
//     const matchesStatus = selectedStatusFilter ? election.displayStatus === selectedStatusFilter : true;
    
//     const query = searchQuery.toLowerCase();
//     const titleMatch = (election.title || election.name || "").toLowerCase().includes(query);
//     const wingMatch = (election.wing || "").toLowerCase().includes(query);
//     const descMatch = (election.description || "").toLowerCase().includes(query);
    
//     const matchesSearch = query === "" || titleMatch || wingMatch || descMatch;

//     return matchesStatus && matchesSearch;
//   });

//   // Fetch single election details and invoke all associated child endpoints
//   const handleSelectElection = async (id: string) => {
//     setSelectedElectionId(id);
//     setIsDetailLoading(true);
//     setMessage({ type: "", text: "" });
//     const token = getToken();

//     try {
//       // 1. GET /elections/:id
//       const res = await fetch(`${API_BASE_URL}/elections/${id}`, {
//         headers: { "Authorization": `Bearer ${token}` }
//       });
//       const json = await res.json();
//       let currentDisplayStatus = "UPCOMING";
//       if (res.ok && json?.data) {
//         const detail = json.data.election || json.data;
//         setElectionDetail(detail);
//         currentDisplayStatus = detail.displayStatus || "UPCOMING";
//       }

//       // 2. GET /elections/:id/nominations
//       const nomRes = await fetch(`${API_BASE_URL}/elections/${id}/nominations`, {
//         headers: { "Authorization": `Bearer ${token}` }
//       });
//       const nomJson = await nomRes.json();
//       if (nomRes.ok && nomJson?.data) {
//         setNominationsData(nomJson.data);
//       }

//       // 3. GET /elections/:id/vote-status
//       const voteRes = await fetch(`${API_BASE_URL}/elections/${id}/vote-status`, {
//         headers: { "Authorization": `Bearer ${token}` }
//       });
//       const voteJson = await voteRes.json();
//       if (voteRes.ok) {
//         setVoteStatus(voteJson);
//       }

//       // 4. GET /elections/:id/results (Only if completed)
//       if (currentDisplayStatus === "COMPLETED") {
//         const resRes = await fetch(`${API_BASE_URL}/elections/${id}/results`, {
//           headers: { "Authorization": `Bearer ${token}` }
//         });
//         const resJson = await resRes.json();
//         if (resRes.ok && resJson?.data) {
//           setResultsData(resJson.data);
//         }
//       }

//     } catch (err) {
//       console.error("Error loading election full data suite", err);
//     } finally {
//       setIsDetailLoading(false);
//     }
//   };

//   // POST /elections/:id/nominate
//   const handleNominateSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!selectedElectionId) return;
//     setActionLoading(true);
//     setMessage({ type: "", text: "" });

//     const token = getToken();
//     try {
//       const res = await fetch(`${API_BASE_URL}/elections/${selectedElectionId}/nominate`, {
//         method: "POST",
//         headers: {
//           "Authorization": `Bearer ${token}`,
//           "Content-Type": "application/json"
//         },
//         body: JSON.stringify(nominationForm)
//       });
//       const data = await res.json();
//       if (res.ok) {
//         setMessage({ type: "success", text: "Nomination filed successfully!" });
//         handleSelectElection(selectedElectionId);
//       } else {
//         setMessage({ type: "error", text: data.message || "Failed to submit nomination." });
//       }
//     } catch (err) {
//       setMessage({ type: "error", text: "Network error occurred." });
//     } finally {
//       setActionLoading(false);
//     }
//   };

//   // POST /elections/:id/vote
//   const handleVoteSubmit = async () => {
//     if (!selectedElectionId || selectedNominationIds.length === 0) return;
//     setActionLoading(true);
//     setMessage({ type: "", text: "" });

//     const token = getToken();
//     try {
//       const res = await fetch(`${API_BASE_URL}/elections/${selectedElectionId}/vote`, {
//         method: "POST",
//         headers: {
//           "Authorization": `Bearer ${token}`,
//           "Content-Type": "application/json"
//         },
//         body: JSON.stringify({ nominationIds: selectedNominationIds })
//       });
//       const data = await res.json();
//       if (res.ok) {
//         setMessage({ type: "success", text: "Vote cast successfully!" });
//         handleSelectElection(selectedElectionId);
//       } else {
//         setMessage({ type: "error", text: data.message || "Failed to cast vote." });
//       }
//     } catch (err) {
//       setMessage({ type: "error", text: "Network error occurred." });
//     } finally {
//       setActionLoading(false);
//     }
//   };

//   const getStatusBadge = (status: string) => {
//     switch (status) {
//       case "VOTING_OPEN":
//         return <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-1 rounded-lg text-[10px] font-extrabold uppercase flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> Voting Live</span>;
//       case "NOMINATION_OPEN":
//         return <span className="bg-amber-50 text-amber-800 border border-amber-200 px-2.5 py-1 rounded-lg text-[10px] font-extrabold uppercase flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-500"></span> Nomination Open</span>;
//       case "WITHDRAWAL_OPEN":
//         return <span className="bg-orange-50 text-orange-800 border border-orange-200 px-2.5 py-1 rounded-lg text-[10px] font-extrabold uppercase flex items-center gap-1.5">Withdrawal Open</span>;
//       case "COMPLETED":
//         return <span className="bg-blue-50 text-blue-800 border border-blue-200 px-2.5 py-1 rounded-lg text-[10px] font-extrabold uppercase flex items-center gap-1.5">Completed</span>;
//       case "UPCOMING":
//         return <span className="bg-purple-50 text-purple-800 border border-purple-200 px-2.5 py-1 rounded-lg text-[10px] font-extrabold uppercase">Upcoming</span>;
//       default:
//         return <span className="bg-gray-100 text-gray-700 border border-gray-200 px-2.5 py-1 rounded-lg text-[10px] font-extrabold uppercase">{status}</span>;
//     }
//   };

//   if (isLoading) {
//     return (
//       <div className="flex flex-col items-center justify-center min-h-[450px] space-y-4">
//         <Loader2 className="w-9 h-9 animate-spin text-[#570013]" />
//         <p className="text-xs font-bold text-[#8c7071] tracking-wider uppercase">Loading Election Portal...</p>
//       </div>
//     );
//   }

//   // --- DETAIL VIEW ---
//   if (selectedElectionId) {
//     if (isDetailLoading) {
//       return (
//         <div className="flex flex-col items-center justify-center min-h-[450px] space-y-4">
//           <Loader2 className="w-9 h-9 animate-spin text-[#570013]" />
//           <p className="text-xs font-bold text-[#8c7071] tracking-wider uppercase">Fetching Election Details...</p>
//         </div>
//       );
//     }

//     const displayStatus = electionDetail?.displayStatus || "UPCOMING";

//     return (
//       <div className="space-y-6 animate-in fade-in duration-200">
//         <button 
//           onClick={() => setSelectedElectionId(null)}
//           className="inline-flex items-center gap-2 text-xs font-bold text-[#570013] bg-white border border-[#e0bfbf] px-4 py-2 rounded-2xl shadow-2xs hover:bg-[#fbf2ed] transition-colors cursor-pointer"
//         >
//           <ArrowLeft className="w-4 h-4" /> Back to Elections List
//         </button>

//         {/* Election Header Card */}
//         <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#e0bfbf]/60 shadow-sm space-y-4">
//           <div className="flex flex-wrap items-center justify-between gap-3">
//             <span className="text-xs font-mono font-extrabold text-[#775a19] bg-[#fbf2ed] px-3 py-1 rounded-xl border border-[#e0bfbf]">
//               {electionDetail?.wing || "General Election"}
//             </span>
//             {getStatusBadge(displayStatus)}
//           </div>
//           <h1 className="text-xl sm:text-2xl font-extrabold text-[#570013] font-['Playfair_Display',serif]">
//             {electionDetail?.title || electionDetail?.name || "Election Session"}
//           </h1>
//           <p className="text-xs text-[#584141] leading-relaxed">
//             {electionDetail?.description || "Cast your vote or file your nomination for official association leadership positions."}
//           </p>
//         </div>

//         {message.text && (
//           <div className={`p-4 rounded-2xl text-xs font-bold flex items-center gap-2.5 ${message.type === "success" ? "bg-emerald-50 text-emerald-800 border border-emerald-200" : "bg-red-50 text-red-800 border border-red-200"}`}>
//             {message.type === "success" ? <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> : <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />}
//             {message.text}
//           </div>
//         )}

//         {/* SECTION 1: NOMINATION PHASE */}
//         {displayStatus === "NOMINATION_OPEN" && (
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//             <div className="bg-white p-6 rounded-3xl border border-[#e0bfbf]/60 shadow-sm space-y-5">
//               <h3 className="text-sm font-extrabold text-[#570013] uppercase tracking-wider flex items-center gap-2">
//                 <FileText className="w-4 h-4 text-[#775a19]" /> File Your Nomination
//               </h3>
//               {nominationsData.myNomination ? (
//                 <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl space-y-2">
//                   <span className="text-[10px] font-extrabold text-emerald-800 uppercase tracking-wider block">Nomination Submitted</span>
//                   <p className="text-xs font-bold text-[#570013]">Position: {nominationsData.myNomination.position}</p>
//                   <p className="text-xs text-[#584141]">Manifesto: {nominationsData.myNomination.manifesto}</p>
//                 </div>
//               ) : (
//                 <form onSubmit={handleNominateSubmit} className="space-y-4">
//                   <div>
//                     <label className="block text-xs font-bold text-[#584141] mb-1.5">Position</label>
//                     <input 
//                       type="text" 
//                       required
//                       placeholder="e.g. President"
//                       value={nominationForm.position}
//                       onChange={(e) => setNominationForm({ ...nominationForm, position: e.target.value })}
//                       className="w-full bg-[#fff8f5] border border-[#e0bfbf] rounded-2xl px-4 py-3 text-xs font-bold text-[#570013] focus:outline-none focus:border-[#570013]"
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-xs font-bold text-[#584141] mb-1.5">Manifesto / Vision Statement</label>
//                     <textarea 
//                       rows={4}
//                       required
//                       placeholder="Share your goals and vision..."
//                       value={nominationForm.manifesto}
//                       onChange={(e) => setNominationForm({ ...nominationForm, manifesto: e.target.value })}
//                       className="w-full bg-[#fff8f5] border border-[#e0bfbf] rounded-2xl p-4 text-xs font-bold text-[#570013] focus:outline-none focus:border-[#570013]"
//                     />
//                   </div>
//                   <div className="flex items-center gap-2 pt-1">
//                     <input 
//                       type="checkbox" 
//                       id="terms"
//                       required
//                       checked={nominationForm.agreedToTerms}
//                       onChange={(e) => setNominationForm({ ...nominationForm, agreedToTerms: e.target.checked })}
//                       className="rounded accent-[#570013] w-4 h-4"
//                     />
//                     <label htmlFor="terms" className="text-xs font-bold text-[#584141] cursor-pointer">
//                       I agree to the election guidelines and code of conduct.
//                     </label>
//                   </div>
//                   <button
//                     type="submit"
//                     disabled={actionLoading}
//                     className="w-full inline-flex items-center justify-center gap-2 bg-[#570013] text-white py-3 rounded-2xl text-xs font-bold shadow-md hover:bg-[#40000e] transition-all cursor-pointer disabled:opacity-50"
//                   >
//                     {actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />} Submit Nomination
//                   </button>
//                 </form>
//               )}
//             </div>

//             <div className="bg-white p-6 rounded-3xl border border-[#e0bfbf]/60 shadow-sm space-y-4">
//               <h3 className="text-sm font-extrabold text-[#570013] uppercase tracking-wider flex items-center gap-2">
//                 <Users className="w-4 h-4 text-[#775a19]" /> Filed Nominations ({nominationsData.nominations?.length || 0})
//               </h3>
//               <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
//                 {nominationsData.nominations?.length === 0 ? (
//                   <p className="text-xs text-[#8c7071] py-8 text-center">No nominations filed yet.</p>
//                 ) : (
//                   nominationsData.nominations?.map((nom: any, idx: number) => (
//                     <div key={idx} className="bg-[#fbf2ed]/50 border border-[#e0bfbf]/60 p-3.5 rounded-2xl flex items-center gap-3">
//                       <div className="w-10 h-10 rounded-xl bg-[#570013] text-white overflow-hidden relative shrink-0 flex items-center justify-center font-bold text-xs">
//                         {nom.member?.photoUrl ? (
//                           <img src={nom.member.photoUrl} alt="Candidate" className="w-full h-full object-cover" />
//                         ) : (
//                           nom.member?.fullName?.charAt(0) || "C"
//                         )}
//                       </div>
//                       <div className="flex-1 overflow-hidden">
//                         <h4 className="text-xs font-extrabold text-[#570013] truncate">{nom.member?.fullName}</h4>
//                         <p className="text-[10px] text-[#775a19] font-bold">{nom.position}</p>
//                         <span className="text-[9px] font-mono text-[#8c7071]">{nom.member?.memberId}</span>
//                       </div>
//                     </div>
//                   ))
//                 )}
//               </div>
//             </div>
//           </div>
//         )}

//         {/* SECTION 2: VOTING PHASE */}
//         {displayStatus === "VOTING_OPEN" && (
//           <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#e0bfbf]/60 shadow-sm space-y-5">
//             <div className="flex items-center justify-between border-b border-[#e0bfbf]/40 pb-4">
//               <div>
//                 <h3 className="text-sm font-extrabold text-[#570013] uppercase tracking-wider flex items-center gap-2">
//                   <Vote className="w-4 h-4 text-[#775a19]" /> Official Ballot Box
//                 </h3>
//                 <p className="text-xs text-[#8c7071] mt-0.5">Select your preferred candidate nomination and cast your secure vote.</p>
//               </div>
//               {voteStatus.hasVoted && (
//                 <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1 rounded-xl text-xs font-bold flex items-center gap-1.5">
//                   <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Voted on {new Date(voteStatus.castAt || Date.now()).toLocaleDateString()}
//                 </span>
//               )}
//             </div>

//             {voteStatus.hasVoted ? (
//               <div className="bg-[#fbf2ed] p-6 rounded-2xl text-center space-y-2 border border-[#e0bfbf]">
//                 <ShieldCheck className="w-10 h-10 text-[#775a19] mx-auto" />
//                 <h4 className="text-sm font-extrabold text-[#570013]">Your Vote Has Been Recorded</h4>
//                 <p className="text-xs text-[#584141]">Thank you for participating in the association democratic election process.</p>
//               </div>
//             ) : (
//               <div className="space-y-4">
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   {nominationsData.nominations?.map((nom: any) => {
//                     const isSelected = selectedNominationIds.includes(nom._id);
//                     return (
//                       <div 
//                         key={nom._id}
//                         onClick={() => setSelectedNominationIds([nom._id])}
//                         className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center gap-4 ${
//                           isSelected ? "bg-[#fff8f5] border-[#570013] shadow-xs ring-1 ring-[#570013]" : "bg-white border-[#e0bfbf]/70 hover:border-[#570013]/50"
//                         }`}
//                       >
//                         <div className="w-12 h-12 rounded-2xl bg-[#570013] text-white overflow-hidden relative shrink-0 flex items-center justify-center font-bold text-sm">
//                           {nom.member?.photoUrl ? (
//                             <img src={nom.member.photoUrl} alt="Candidate" className="w-full h-full object-cover" />
//                           ) : (
//                             nom.member?.fullName?.charAt(0) || "C"
//                           )}
//                         </div>
//                         <div className="flex-1 overflow-hidden">
//                           <h4 className="text-xs font-extrabold text-[#570013]">{nom.member?.fullName}</h4>
//                           <span className="inline-block bg-[#fbf2ed] text-[#775a19] px-2 py-0.5 rounded text-[10px] font-bold my-0.5">
//                             {nom.position}
//                           </span>
//                           <p className="text-[11px] text-[#584141] truncate">{nom.manifesto || "No manifesto provided."}</p>
//                         </div>
//                         <div>
//                           {isSelected ? <CheckSquare className="w-5 h-5 text-[#570013]" /> : <Square className="w-5 h-5 text-gray-300" />}
//                         </div>
//                       </div>
//                     );
//                   })}
//                 </div>

//                 <div className="flex justify-end pt-4 border-t border-[#e0bfbf]/40">
//                   <button
//                     onClick={handleVoteSubmit}
//                     disabled={actionLoading || selectedNominationIds.length === 0}
//                     className="inline-flex items-center gap-2 bg-[#570013] text-white px-8 py-3 rounded-2xl text-xs font-bold shadow-md hover:bg-[#40000e] transition-all cursor-pointer disabled:opacity-50"
//                   >
//                     {actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Vote className="w-4 h-4" />} Cast Secure Vote
//                   </button>
//                 </div>
//               </div>
//             )}
//           </div>
//         )}

//         {/* SECTION 3: COMPLETED / RESULTS */}
//         {displayStatus === "COMPLETED" && (
//           <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#e0bfbf]/60 shadow-sm space-y-5">
//             <h3 className="text-sm font-extrabold text-[#570013] uppercase tracking-wider flex items-center gap-2">
//               <BarChart3 className="w-4 h-4 text-[#775a19]" /> Election Results & Final Winners
//             </h3>
//             {resultsData ? (
//               <div className="space-y-4">
//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                   {resultsData.winners?.map((winner: any, i: number) => (
//                     <div key={i} className="bg-amber-50/70 border border-amber-200 p-4 rounded-2xl flex items-center gap-3">
//                       <Award className="w-8 h-8 text-amber-600 shrink-0" />
//                       <div>
//                         <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-800">Winner ({winner.position})</span>
//                         <h4 className="text-xs font-extrabold text-[#570013]">{winner.fullName || winner.member?.fullName}</h4>
//                         <span className="text-[10px] font-mono font-bold text-[#775a19]">Votes: {winner.voteCount}</span>
//                       </div>
//                     </div>
//                   ))}
//                 </div>

//                 <div className="border-t border-[#e0bfbf]/40 pt-4 space-y-3">
//                   <h4 className="text-xs font-extrabold text-[#584141] uppercase tracking-wider">Detailed Statistics</h4>
//                   {resultsData.candidates?.map((cand: any, idx: number) => (
//                     <div key={idx} className="bg-[#fbf2ed]/50 p-3.5 rounded-2xl border border-[#e0bfbf]/60 space-y-1.5">
//                       <div className="flex justify-between text-xs font-extrabold text-[#570013]">
//                         <span>{cand.fullName} ({cand.position})</span>
//                         <span>{cand.voteCount} votes ({cand.percentage}%)</span>
//                       </div>
//                       <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
//                         <div className="bg-[#570013] h-full rounded-full" style={{ width: `${cand.percentage || 0}%` }}></div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             ) : (
//               <p className="text-xs text-[#8c7071] py-8 text-center">Results data is currently being processed.</p>
//             )}
//           </div>
//         )}

//         {/* OTHER STATUSES */}
//         {!["NOMINATION_OPEN", "VOTING_OPEN", "COMPLETED"].includes(displayStatus) && (
//           <div className="bg-white p-8 rounded-3xl border border-[#e0bfbf]/60 text-center space-y-3">
//             <Lock className="w-10 h-10 text-[#775a19] mx-auto" />
//             <h3 className="text-base font-extrabold text-[#570013]">Election Status: {displayStatus}</h3>
//             <p className="text-xs text-[#584141]">Please check back when the active window opens.</p>
//           </div>
//         )}

//       </div>
//     );
//   }

//   // --- LIST VIEW WITH INSTANT SEARCH & FILTER ---
//   return (
//     <div className="space-y-6 animate-in fade-in duration-200">
      
//       {/* Header & Controls */}
//       <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#e0bfbf]/60 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
//         <div>
//           <span className="text-[10px] font-extrabold text-[#775a19] uppercase tracking-wider flex items-center gap-1">
//             <Sparkles className="w-3 h-3 text-amber-600" /> Democratic Association
//           </span>
//           <h1 className="text-xl sm:text-2xl font-extrabold text-[#570013] font-['Playfair_Display',serif]">
//             Election & Voting Portal
//           </h1>
//         </div>

//         {/* Filters and Search Bar */}
//         <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          
//           {/* Search Box */}
//           <div className="flex items-center gap-2 bg-[#fbf2ed] px-3.5 py-2 rounded-2xl border border-[#e0bfbf]/60 flex-1 md:w-64">
//             <Search className="w-3.5 h-3.5 text-[#775a19] shrink-0" />
//             <input
//               type="text"
//               placeholder="Search by title, wing..."
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               className="bg-transparent text-xs font-bold text-[#570013] placeholder-[#8c7071] focus:outline-none w-full"
//             />
//             {searchQuery && (
//               <button onClick={() => setSearchQuery("")} className="text-[#8c7071] hover:text-[#570013]">
//                 <X className="w-3.5 h-3.5" />
//               </button>
//             )}
//           </div>

//           {/* Status Dropdown Filter */}
//           <div className="flex items-center gap-1.5 bg-[#fbf2ed] px-3.5 py-2 rounded-2xl border border-[#e0bfbf]/60">
//             <Filter className="w-3.5 h-3.5 text-[#775a19] shrink-0" />
//             <select
//               value={selectedStatusFilter}
//               onChange={(e) => setSelectedStatusFilter(e.target.value)}
//               className="bg-transparent text-xs font-bold text-[#570013] focus:outline-none cursor-pointer"
//             >
//               <option value="">All Statuses</option>
//               <option value="UPCOMING">Upcoming</option>
//               <option value="NOMINATION_OPEN">Nomination Open</option>
//               <option value="VOTING_OPEN">Voting Open</option>
//               <option value="COMPLETED">Completed</option>
//             </select>
//           </div>

//         </div>
//       </div>

//       {/* Grid List */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         {filteredElections.length === 0 ? (
//           <div className="col-span-full bg-white p-12 rounded-3xl border border-[#e0bfbf]/60 text-center space-y-2">
//             <Vote className="w-10 h-10 text-[#8c7071] mx-auto" />
//             <h3 className="text-sm font-extrabold text-[#570013]">No Elections Found</h3>
//             <p className="text-xs text-[#8c7071]">No elections match your current search or status filter criteria.</p>
//           </div>
//         ) : (
//           filteredElections.map((election) => (
//             <div 
//               key={election._id || election.id}
//               onClick={() => handleSelectElection(election._id || election.id)}
//               className="bg-white p-6 rounded-3xl border border-[#e0bfbf]/60 shadow-sm hover:border-[#570013] transition-all cursor-pointer space-y-4 flex flex-col justify-between group"
//             >
//               <div className="space-y-2">
//                 <div className="flex items-center justify-between">
//                   <span className="text-[10px] font-mono font-extrabold text-[#775a19] bg-[#fbf2ed] px-2.5 py-0.5 rounded-md border border-[#e0bfbf]/50">
//                     {election.wing || "General"}
//                   </span>
//                   {getStatusBadge(election.displayStatus)}
//                 </div>
//                 <h3 className="text-base font-extrabold text-[#570013] font-['Playfair_Display',serif] group-hover:text-amber-700 transition-colors">
//                   {election.title || election.name}
//                 </h3>
//                 <p className="text-xs text-[#584141] line-clamp-2">
//                   {election.description || "Official leadership election session."}
//                 </p>
//               </div>

//               <div className="flex items-center justify-between pt-4 border-t border-[#e0bfbf]/40 text-xs">
//                 <span className="text-[#8c7071] flex items-center gap-1 font-bold">
//                   <Calendar className="w-3.5 h-3.5 text-[#775a19]" /> View Session
//                 </span>
//                 <span className="inline-flex items-center gap-1 font-extrabold text-[#570013] group-hover:translate-x-1 transition-transform">
//                   Access Portal <ChevronRight className="w-4 h-4" />
//                 </span>
//               </div>
//             </div>
//           ))
//         )}
//       </div>
//     </div>
//   );
// }

import React from 'react'

const page = () => {
  return (
    <div>page</div>
  )
}

export default page