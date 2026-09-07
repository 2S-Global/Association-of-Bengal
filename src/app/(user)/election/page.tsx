"use client";

import React, { useState, useEffect } from "react";
import { 
  Vote, 
  Calendar, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  ChevronRight, 
  ArrowLeft, 
  FileText, 
  Award, 
  Users, 
  ShieldCheck, 
  CheckSquare, 
  Square,
  Sparkles,
  BarChart3,
  Send,
  Lock,
  Filter,
  Search,
  X,
  MapPin,
  Clock,
  Layers,
  CheckCircle,
  Timer
} from "lucide-react";

const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_URL || "https://balc.albdglobal.org"}/api/v1`;

function getTimeRemaining(endDate: string, endTime: string) {
  try {
    const targetStr = `${endDate} ${endTime}`;
    const total = Date.parse(targetStr) - Date.parse(new Date().toString());
    if (total <= 0) return "Phase Closed";
    
    const days = Math.floor(total / (1000 * 60 * 60 * 24));
    const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((total / 1000 / 60) % 60);
    
    if (days > 0) return `${days}d ${hours}h left`;
    return `${hours}h ${minutes}m left`;
  } catch {
    return "";
  }
}

export default function ElectionsPage() {
  const [elections, setElections] = useState<any[]>([]);
  const [selectedStatusFilter, setSelectedStatusFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const [selectedElectionId, setSelectedElectionId] = useState<string | null>(null);
  const [electionDetail, setElectionDetail] = useState<any>(null);
  const [nominationsData, setNominationsData] = useState<any>({ nominations: [], myNomination: null });
  const [voteStatus, setVoteStatus] = useState<any>({ hasVoted: false });
  const [resultsData, setResultsData] = useState<any>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isDetailLoading, setIsDetailLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const [showNominateConfirm, setShowNominateConfirm] = useState(false);
  const [showVoteConfirm, setShowVoteConfirm] = useState(false);

  const [nominationForm, setNominationForm] = useState({
    position: "",
    manifesto: "",
    agreedToTerms: false
  });

  const [selectedNominationIds, setSelectedNominationIds] = useState<string[]>([]);

  const getToken = () => 
    localStorage.getItem("token") || 
    localStorage.getItem("accessToken") || 
    localStorage.getItem("access_token");

  useEffect(() => {
    fetchElections();
  }, []);

  const fetchElections = async () => {
    setIsLoading(true);
    const token = getToken();
    try {
      const res = await fetch(`${API_BASE_URL}/elections`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const json = await res.json();
      if (res.ok && json?.data) {
        setElections(json.data.elections || json.data || []);
      }
    } catch (err) {
      console.error("Failed to fetch elections", err);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredElections = elections.filter((election) => {
    const matchesStatus = selectedStatusFilter ? election.displayStatus === selectedStatusFilter : true;
    
    const query = searchQuery.toLowerCase();
    const titleMatch = (election.name || "").toLowerCase().includes(query);
    const descMatch = (election.description || "").toLowerCase().includes(query);
    const locationMatch = (election.location || "").toLowerCase().includes(query);
    const wingMatch = (election.wings || []).some((w: string) => w.toLowerCase().includes(query));
    
    const matchesSearch = query === "" || titleMatch || descMatch || locationMatch || wingMatch;

    return matchesStatus && matchesSearch;
  });

  const handleSelectElection = async (id: string) => {
    setSelectedElectionId(id);
    setIsDetailLoading(true);
    setMessage({ type: "", text: "" });
    const token = getToken();

    try {
      const res = await fetch(`${API_BASE_URL}/elections/${id}`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const json = await res.json();
      let currentDisplayStatus = "UPCOMING";
      if (res.ok && json?.data) {
        const detail = json.data.election || json.data;
        setElectionDetail(detail);
        currentDisplayStatus = detail.displayStatus || "UPCOMING";
      }

      const nomRes = await fetch(`${API_BASE_URL}/elections/${id}/nominations`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const nomJson = await nomRes.json();
      if (nomRes.ok && nomJson?.data) {
        setNominationsData(nomJson.data);
      }

      const voteRes = await fetch(`${API_BASE_URL}/elections/${id}/vote-status`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const voteJson = await voteRes.json();
      if (voteRes.ok) {
        setVoteStatus(voteJson);
      }

      if (currentDisplayStatus === "COMPLETED") {
        const resRes = await fetch(`${API_BASE_URL}/elections/${id}/results`, {
          headers: { "Authorization": `Bearer ${token}` }
        });
        const resJson = await resRes.json();
        if (resRes.ok && resJson?.data) {
          setResultsData(resJson.data);
        }
      }

    } catch (err) {
      console.error("Error loading election full data suite", err);
    } finally {
      setIsDetailLoading(false);
    }
  };

  const handleNominateSubmit = async () => {
    if (!selectedElectionId) return;
    setActionLoading(true);
    setMessage({ type: "", text: "" });

    const token = getToken();
    try {
      const res = await fetch(`${API_BASE_URL}/elections/${selectedElectionId}/nominate`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(nominationForm)
      });
      const data = await res.json();
      if (res.ok) {
        setMessage({ type: "success", text: "Nomination filed successfully!" });
        handleSelectElection(selectedElectionId);
      } else {
        setMessage({ type: "error", text: data.message || "Failed to submit nomination." });
      }
    } catch (err) {
      setMessage({ type: "error", text: "Network error occurred." });
    } finally {
      setActionLoading(false);
    }
  };

  const handleVoteSubmit = async () => {
    if (!selectedElectionId || selectedNominationIds.length === 0) return;
    setActionLoading(true);
    setMessage({ type: "", text: "" });

    const token = getToken();
    try {
      const res = await fetch(`${API_BASE_URL}/elections/${selectedElectionId}/vote`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ nominationIds: selectedNominationIds })
      });
      const data = await res.json();
      if (res.ok) {
        setMessage({ type: "success", text: "Vote cast successfully!" });
        handleSelectElection(selectedElectionId);
      } else {
        setMessage({ type: "error", text: data.message || "Failed to cast vote." });
      }
    } catch (err) {
      setMessage({ type: "error", text: "Network error occurred." });
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "VOTING_OPEN":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-[10px] font-extrabold uppercase bg-emerald-50 text-emerald-800 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span> Voting Live
          </span>
        );
      case "NOMINATION_OPEN":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-[10px] font-extrabold uppercase bg-amber-50 text-amber-800 border border-amber-200">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-600 animate-pulse"></span> Nomination Open
          </span>
        );
      case "WITHDRAWAL_OPEN":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-[10px] font-extrabold uppercase bg-orange-50 text-orange-800 border border-orange-200">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-600 animate-pulse"></span> Withdrawal Open
          </span>
        );
      case "COMPLETED":
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-xl text-[10px] font-extrabold uppercase bg-blue-50 text-blue-800 border border-blue-200">
            Completed
          </span>
        );
      case "UPCOMING":
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-xl text-[10px] font-extrabold uppercase bg-purple-50 text-purple-800 border border-purple-200">
            Upcoming
          </span>
        );
      case "SUSPENDED":
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-xl text-[10px] font-extrabold uppercase bg-red-50 text-red-800 border border-red-200">
            Suspended
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-xl text-[10px] font-extrabold uppercase bg-gray-100 text-gray-800 border border-gray-200">
            {status}
          </span>
        );
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[450px] space-y-4">
        <Loader2 className="w-9 h-9 animate-spin text-[#570013]" />
        <p className="text-xs font-bold text-[#8c7071] tracking-wider uppercase">Loading Election Portal...</p>
      </div>
    );
  }

  // --- DETAIL VIEW ---
  if (selectedElectionId) {
    if (isDetailLoading) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[450px] space-y-4">
          <Loader2 className="w-9 h-9 animate-spin text-[#570013]" />
          <p className="text-xs font-bold text-[#8c7071] tracking-wider uppercase">Fetching Election Details...</p>
        </div>
      );
    }

    const displayStatus = electionDetail?.displayStatus || "UPCOMING";

    const activeTargetDate = 
      displayStatus === "NOMINATION_OPEN" ? electionDetail?.nomination :
      displayStatus === "WITHDRAWAL_OPEN" ? electionDetail?.withdrawal :
      displayStatus === "VOTING_OPEN" ? electionDetail?.voting : null;

    const timeLeft = activeTargetDate ? getTimeRemaining(activeTargetDate.endDate, activeTargetDate.endTime) : "";

    return (
      <div className="space-y-6 animate-in fade-in duration-200 max-w-6xl mx-auto pb-12">
        <div className="flex items-center justify-between">
          <button 
            onClick={() => setSelectedElectionId(null)}
            className="inline-flex items-center gap-2 text-xs font-bold text-[#570013] bg-white border border-[#e0bfbf] px-4 py-2.5 rounded-2xl shadow-2xs hover:bg-[#fbf2ed] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Elections List
          </button>

          <div className="flex items-center gap-2">
            {timeLeft && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-extrabold tracking-wide uppercase bg-amber-50 text-amber-900 border border-amber-200 shadow-2xs">
                <Timer className="w-3.5 h-3.5 animate-pulse text-amber-600" /> {timeLeft}
              </span>
            )}
            {getStatusBadge(displayStatus)}
          </div>
        </div>

        {/* Master Details Card */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#e0bfbf]/60 shadow-sm space-y-6">
          <div className="space-y-3">
            <div className="flex flex-wrap gap-1.5">
              {electionDetail?.wings?.map((wing: string, idx: number) => (
                <span key={idx} className="text-[11px] font-mono font-extrabold text-[#775a19] bg-[#fbf2ed] px-3 py-1 rounded-xl border border-[#e0bfbf]">
                  {wing}
                </span>
              ))}
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-[#570013] font-['Playfair_Display',serif]">
              {electionDetail?.name}
            </h1>
            <p className="text-xs text-[#584141] leading-relaxed max-w-3xl">
              {electionDetail?.description}
            </p>
          </div>

          {/* Structured Phase Stepper */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className={`p-4 rounded-2xl border transition-all ${displayStatus === "NOMINATION_OPEN" ? "bg-[#fff8f5] border-[#570013] ring-1 ring-[#570013]/30 shadow-xs" : "bg-[#fbf2ed]/30 border-[#e0bfbf]/50"}`}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-extrabold text-[#775a19] uppercase flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> 1. Nomination Phase
                </span>
                {displayStatus === "NOMINATION_OPEN" && <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping"></span>}
              </div>
              <p className="text-xs font-bold text-[#570013]">
                {electionDetail?.nomination?.startDate} — {electionDetail?.nomination?.endDate}
              </p>
              <p className="text-[10px] text-[#8c7071] mt-0.5">Closes at {electionDetail?.nomination?.endTime}</p>
            </div>

            <div className={`p-4 rounded-2xl border transition-all ${displayStatus === "WITHDRAWAL_OPEN" ? "bg-[#fff8f5] border-[#570013] ring-1 ring-[#570013]/30 shadow-xs" : "bg-[#fbf2ed]/30 border-[#e0bfbf]/50"}`}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-extrabold text-[#775a19] uppercase flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> 2. Withdrawal Phase
                </span>
                {displayStatus === "WITHDRAWAL_OPEN" && <span className="w-2 h-2 rounded-full bg-orange-500 animate-ping"></span>}
              </div>
              <p className="text-xs font-bold text-[#570013]">
                {electionDetail?.withdrawal?.startDate} — {electionDetail?.withdrawal?.endDate}
              </p>
              <p className="text-[10px] text-[#8c7071] mt-0.5">Closes at {electionDetail?.withdrawal?.endTime}</p>
            </div>

            <div className={`p-4 rounded-2xl border transition-all ${displayStatus === "VOTING_OPEN" ? "bg-[#fff8f5] border-[#570013] ring-1 ring-[#570013]/30 shadow-xs" : "bg-[#fbf2ed]/30 border-[#e0bfbf]/50"}`}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-extrabold text-[#775a19] uppercase flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> 3. Voting Live
                </span>
                {displayStatus === "VOTING_OPEN" && <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>}
              </div>
              <p className="text-xs font-bold text-[#570013]">
                {electionDetail?.voting?.startDate} — {electionDetail?.voting?.endDate}
              </p>
              <p className="text-[10px] text-[#8c7071] mt-0.5">Closes at {electionDetail?.voting?.endTime}</p>
            </div>
          </div>

          {/* Key Metadata Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 border-t border-[#e0bfbf]/40">
            <div className="flex items-start gap-3 bg-[#fbf2ed]/40 p-4 rounded-2xl border border-[#e0bfbf]/50">
              <MapPin className="w-4 h-4 text-[#775a19] mt-0.5 shrink-0" />
              <div>
                <span className="text-[10px] font-extrabold text-[#8c7071] uppercase tracking-wider block">Location / Venue</span>
                <span className="text-xs font-bold text-[#570013]">{electionDetail?.location}</span>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-[#fbf2ed]/40 p-4 rounded-2xl border border-[#e0bfbf]/50 md:col-span-2">
              <Layers className="w-4 h-4 text-[#775a19] mt-0.5 shrink-0" />
              <div>
                <span className="text-[10px] font-extrabold text-[#8c7071] uppercase tracking-wider block">Eligible Post Designations</span>
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  {electionDetail?.postDesignations?.map((pos: string, i: number) => (
                    <span key={i} className="bg-white text-[#570013] px-2.5 py-1 rounded-lg text-[10px] font-extrabold border border-[#e0bfbf]">
                      {pos.trim()}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Rules and Regulations */}
          {electionDetail?.rulesAndRegulations && electionDetail.rulesAndRegulations.length > 0 && (
            <div className="bg-[#fbf2ed]/50 p-4 rounded-2xl border border-[#e0bfbf]/60 space-y-2">
              <h4 className="text-xs font-extrabold text-[#570013] uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#775a19]" /> Rules & Regulations
              </h4>
              <ul className="space-y-1 list-disc list-inside text-xs text-[#584141]">
                {electionDetail.rulesAndRegulations.map((rule: string, i: number) => (
                  <li key={i}>{rule}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {message.text && (
          <div className={`p-4 rounded-2xl text-xs font-bold flex items-center gap-2.5 ${message.type === "success" ? "bg-emerald-50 text-emerald-800 border border-emerald-200" : "bg-red-50 text-red-800 border border-red-200"}`}>
            {message.type === "success" ? <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> : <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />}
            {message.text}
          </div>
        )}

        {/* SECTION 1: NOMINATION PHASE */}
        {displayStatus === "NOMINATION_OPEN" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#e0bfbf]/60 shadow-sm space-y-5">
              <h3 className="text-sm font-extrabold text-[#570013] uppercase tracking-wider flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#775a19]" /> File Your Candidacy Nomination
              </h3>
              {nominationsData.myNomination ? (
                <div className="bg-emerald-50 border border-emerald-200 p-5 rounded-2xl space-y-2.5">
                  <span className="text-[10px] font-extrabold text-emerald-800 uppercase tracking-wider flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4" /> Nomination Successfully Filed
                  </span>
                  <p className="text-xs font-bold text-[#570013]">Position: {nominationsData.myNomination.position}</p>
                  <p className="text-xs text-[#584141] bg-white p-3 rounded-xl border border-emerald-100">
                    <strong>Manifesto:</strong> {nominationsData.myNomination.manifesto}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-[#584141] mb-1.5">Select Designation Position</label>
                    <select 
                      required
                      value={nominationForm.position}
                      onChange={(e) => setNominationForm({ ...nominationForm, position: e.target.value })}
                      className="w-full bg-[#fff8f5] border border-[#e0bfbf] rounded-2xl px-4 py-3 text-xs font-bold text-[#570013] focus:outline-none focus:border-[#570013] cursor-pointer"
                    >
                      <option value="" className="bg-[#fff8f5] text-[#570013]">-- Choose Position --</option>
                      {electionDetail?.postDesignations?.map((pos: string, idx: number) => (
                        <option key={idx} value={pos.trim()} className="bg-[#fff8f5] text-[#570013]">{pos.trim()}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#584141] mb-1.5">Manifesto / Vision Statement</label>
                    <textarea 
                      rows={4}
                      required
                      placeholder="Share your goals and vision..."
                      value={nominationForm.manifesto}
                      onChange={(e) => setNominationForm({ ...nominationForm, manifesto: e.target.value })}
                      className="w-full bg-[#fff8f5] border border-[#e0bfbf] rounded-2xl p-4 text-xs font-bold text-[#570013] focus:outline-none focus:border-[#570013]"
                    />
                  </div>
                  <div className="flex items-center gap-2.5 pt-1 bg-[#fff8f5] p-3.5 rounded-2xl border border-[#e0bfbf]/60">
                    <input 
                      type="checkbox" 
                      id="terms"
                      checked={nominationForm.agreedToTerms}
                      onChange={(e) => setNominationForm({ ...nominationForm, agreedToTerms: e.target.checked })}
                      className="rounded accent-[#570013] w-4 h-4 cursor-pointer"
                    />
                    <label htmlFor="terms" className="text-xs font-bold text-[#584141] cursor-pointer">
                      I agree to abide by the association election guidelines and code of conduct.
                    </label>
                  </div>
                  <button
                    type="button"
                    disabled={!nominationForm.position || !nominationForm.manifesto || !nominationForm.agreedToTerms}
                    onClick={() => setShowNominateConfirm(true)}
                    className="w-full inline-flex items-center justify-center gap-2 bg-[#570013] text-white py-3.5 rounded-2xl text-xs font-bold shadow-md hover:bg-[#40000e] transition-all cursor-pointer disabled:opacity-50"
                  >
                    <Send className="w-4 h-4" /> Submit Nomination
                  </button>
                </div>
              )}
            </div>

            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#e0bfbf]/60 shadow-sm space-y-4">
              <h3 className="text-sm font-extrabold text-[#570013] uppercase tracking-wider flex items-center gap-2">
                <Users className="w-4 h-4 text-[#775a19]" /> Filed Nominations ({nominationsData.nominations?.length || 0})
              </h3>
              <div className="space-y-3 max-h-[410px] overflow-y-auto pr-1">
                {nominationsData.nominations?.length === 0 ? (
                  <p className="text-xs text-[#8c7071] py-12 text-center">No nominations filed yet.</p>
                ) : (
                  nominationsData.nominations?.map((nom: any, idx: number) => (
                    <div key={idx} className="bg-[#fbf2ed]/50 border border-[#e0bfbf]/60 p-4 rounded-2xl flex items-center gap-3.5">
                      <div className="w-12 h-12 rounded-xl bg-[#570013] text-white overflow-hidden relative shrink-0 flex items-center justify-center font-bold text-xs shadow-2xs">
                        {nom.member?.photoUrl ? (
                          <img src={nom.member.photoUrl} alt="Candidate" className="w-full h-full object-cover" />
                        ) : (
                          nom.member?.fullName?.charAt(0) || "C"
                        )}
                      </div>
                      <div className="flex-1 overflow-hidden">
                        <h4 className="text-xs font-extrabold text-[#570013] truncate">{nom.member?.fullName}</h4>
                        <span className="inline-block bg-white text-[#775a19] px-2 py-0.5 rounded text-[10px] font-bold border border-[#e0bfbf] my-0.5">
                          {nom.position}
                        </span>
                        <p className="text-[10px] font-mono text-[#8c7071]">ID: {nom.member?.memberId}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* SECTION 2: VOTING PHASE */}
        {displayStatus === "VOTING_OPEN" && (
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#e0bfbf]/60 shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b border-[#e0bfbf]/40 pb-4">
              <div>
                <h3 className="text-sm font-extrabold text-[#570013] uppercase tracking-wider flex items-center gap-2">
                  <Vote className="w-4 h-4 text-[#775a19]" /> Official Secure Ballot Box
                </h3>
                <p className="text-xs text-[#8c7071] mt-0.5">Select your candidate preference and cast your encrypted vote.</p>
              </div>
              {voteStatus.hasVoted && (
                <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Voted on {new Date(voteStatus.castAt || Date.now()).toLocaleDateString()}
                </span>
              )}
            </div>

            {voteStatus.hasVoted ? (
              <div className="bg-[#fbf2ed] p-8 rounded-3xl text-center space-y-3 border border-[#e0bfbf]">
                <ShieldCheck className="w-12 h-12 text-[#775a19] mx-auto" />
                <h4 className="text-base font-extrabold text-[#570013]">Your Vote Has Been Securely Recorded</h4>
                <p className="text-xs text-[#584141] max-w-md mx-auto">Thank you for fulfilling your democratic duty. Your vote is anonymous and certified by the election committee.</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {nominationsData.nominations?.map((nom: any) => {
                    const isSelected = selectedNominationIds.includes(nom._id);
                    return (
                      <div 
                        key={nom._id}
                        onClick={() => setSelectedNominationIds([nom._id])}
                        className={`p-5 rounded-2xl border transition-all cursor-pointer flex items-center gap-4 ${
                          isSelected ? "bg-[#fff8f5] border-[#570013] shadow-xs ring-2 ring-[#570013]/20" : "bg-white border-[#e0bfbf]/70 hover:border-[#570013]/50"
                        }`}
                      >
                        <div className="w-14 h-14 rounded-2xl bg-[#570013] text-white overflow-hidden relative shrink-0 flex items-center justify-center font-bold text-base shadow-2xs">
                          {nom.member?.photoUrl ? (
                            <img src={nom.member.photoUrl} alt="Candidate" className="w-full h-full object-cover" />
                          ) : (
                            nom.member?.fullName?.charAt(0) || "C"
                          )}
                        </div>
                        <div className="flex-1 overflow-hidden">
                          <h4 className="text-xs font-extrabold text-[#570013]">{nom.member?.fullName}</h4>
                          <span className="inline-block bg-[#fbf2ed] text-[#775a19] px-2 py-0.5 rounded text-[10px] font-bold my-1 border border-[#e0bfbf]">
                            {nom.position}
                          </span>
                          <p className="text-[11px] text-[#584141] line-clamp-2 italic">&quot;{nom.manifesto || "No manifesto provided."}&quot;</p>
                        </div>
                        <div className="shrink-0 pl-2">
                          {isSelected ? <CheckSquare className="w-6 h-6 text-[#570013]" /> : <Square className="w-6 h-6 text-gray-300" />}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="flex justify-end pt-4 border-t border-[#e0bfbf]/40">
                  <button
                    onClick={() => setShowVoteConfirm(true)}
                    disabled={selectedNominationIds.length === 0}
                    className="inline-flex items-center gap-2 bg-[#570013] text-white px-8 py-3.5 rounded-2xl text-xs font-bold shadow-md hover:bg-[#40000e] transition-all cursor-pointer disabled:opacity-50"
                  >
                    <Vote className="w-4 h-4" /> Cast Secure Vote
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* SECTION 3: COMPLETED / RESULTS */}
        {displayStatus === "COMPLETED" && (
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#e0bfbf]/60 shadow-sm space-y-6">
            <h3 className="text-sm font-extrabold text-[#570013] uppercase tracking-wider flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-[#775a19]" /> Certified Election Results & Winners
            </h3>
            {resultsData ? (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {resultsData.winners?.map((winner: any, i: number) => (
                    <div key={i} className="bg-amber-50/80 border border-amber-200 p-5 rounded-2xl flex items-center gap-4 shadow-2xs">
                      <Award className="w-10 h-10 text-amber-600 shrink-0" />
                      <div>
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-800 bg-amber-100/80 px-2 py-0.5 rounded-md">Winner ({winner.position})</span>
                        <h4 className="text-sm font-extrabold text-[#570013] mt-1">{winner.fullName || winner.member?.fullName}</h4>
                        <span className="text-xs font-mono font-bold text-[#775a19] block mt-0.5">Total Votes: {winner.voteCount}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-[#e0bfbf]/40 pt-4 space-y-3">
                  <h4 className="text-xs font-extrabold text-[#584141] uppercase tracking-wider">Candidate Vote Share</h4>
                  {resultsData.candidates?.map((cand: any, idx: number) => (
                    <div key={idx} className="bg-[#fbf2ed]/50 p-4 rounded-2xl border border-[#e0bfbf]/60 space-y-2">
                      <div className="flex justify-between text-xs font-extrabold text-[#570013]">
                        <span>{cand.fullName} <span className="text-[#775a19]">({cand.position})</span></span>
                        <span className="font-mono">{cand.voteCount} votes ({cand.percentage}%)</span>
                      </div>
                      <div className="w-full bg-gray-200 h-2.5 rounded-full overflow-hidden">
                        <div className="bg-[#570013] h-full rounded-full transition-all duration-500" style={{ width: `${cand.percentage || 0}%` }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-xs text-[#8c7071] py-12 text-center">Results data is currently being processed by the committee.</p>
            )}
          </div>
        )}

        {/* OTHER STATUSES */}
        {!["NOMINATION_OPEN", "VOTING_OPEN", "COMPLETED"].includes(displayStatus) && (
          <div className="bg-white p-12 rounded-3xl border border-[#e0bfbf]/60 text-center space-y-3 shadow-sm">
            <Lock className="w-12 h-12 text-[#775a19] mx-auto opacity-80" />
            <h3 className="text-base font-extrabold text-[#570013]">Election Status: {displayStatus}</h3>
            <p className="text-xs text-[#584141] max-w-sm mx-auto">This election session is currently locked or inactive. Please check back when the active window opens.</p>
          </div>
        )}

        {/* CONFIRMATION MODALS */}
        {showNominateConfirm && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
            <div className="bg-white p-6 rounded-3xl max-w-md w-full space-y-4 shadow-xl border border-[#e0bfbf]">
              <h3 className="text-base font-extrabold text-[#570013]">Confirm Nomination Submission</h3>
              <p className="text-xs text-[#584141]">
                You are filing for <strong className="text-[#570013]">{nominationForm.position}</strong>. Once submitted, your nomination details cannot be changed. Proceed?
              </p>
              <div className="flex gap-3 pt-2">
                <button 
                  onClick={() => setShowNominateConfirm(false)}
                  className="flex-1 bg-gray-100 text-[#584141] py-2.5 rounded-2xl text-xs font-bold hover:bg-gray-200 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  disabled={actionLoading}
                  onClick={() => { setShowNominateConfirm(false); handleNominateSubmit(); }}
                  className="flex-1 bg-[#570013] text-white py-2.5 rounded-2xl text-xs font-bold hover:bg-[#40000e] transition-colors cursor-pointer flex items-center justify-center gap-2"
                >
                  {actionLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />} Confirm Submission
                </button>
              </div>
            </div>
          </div>
        )}

        {showVoteConfirm && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
            <div className="bg-white p-6 rounded-3xl max-w-md w-full space-y-4 shadow-xl border border-[#e0bfbf]">
              <h3 className="text-base font-extrabold text-[#570013]">Confirm Secure Ballot</h3>
              <p className="text-xs text-[#584141]">
                Your vote is anonymous, permanent, and cannot be altered once cast. Are you sure you wish to submit your vote?
              </p>
              <div className="flex gap-3 pt-2">
                <button 
                  onClick={() => setShowVoteConfirm(false)}
                  className="flex-1 bg-gray-100 text-[#584141] py-2.5 rounded-2xl text-xs font-bold hover:bg-gray-200 transition-colors cursor-pointer"
                >
                  Review Ballot
                </button>
                <button 
                  disabled={actionLoading}
                  onClick={() => { setShowVoteConfirm(false); handleVoteSubmit(); }}
                  className="flex-1 bg-[#570013] text-white py-2.5 rounded-2xl text-xs font-bold hover:bg-[#40000e] transition-colors cursor-pointer flex items-center justify-center gap-2"
                >
                  {actionLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />} Confirm & Cast Vote
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    );
  }

  // --- LIST VIEW WITH INSTANT SEARCH & FILTER ---
  return (
    <div className="space-y-6 animate-in fade-in duration-200 max-w-6xl mx-auto pb-12">
      
      {/* Header & Controls */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#e0bfbf]/60 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="text-[10px] font-extrabold text-[#775a19] uppercase tracking-wider flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-600" /> Democratic Association
          </span>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#570013] font-['Playfair_Display',serif]">
            Election & Voting Portal
          </h1>
        </div>

        {/* Filters and Search Bar */}
        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          
          {/* Search Box */}
          <div className="flex items-center gap-2 bg-[#fbf2ed] px-3.5 py-2 rounded-2xl border border-[#e0bfbf]/60 flex-1 md:w-64">
            <Search className="w-3.5 h-3.5 text-[#775a19] shrink-0" />
            <input
              type="text"
              placeholder="Search title, wing, location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent text-xs font-bold text-[#570013] placeholder-[#8c7071] focus:outline-none w-full"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery("")} className="text-[#8c7071] hover:text-[#570013]">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Status Dropdown Filter */}
          <div className="flex items-center gap-1.5 bg-[#fbf2ed] px-3.5 py-2 rounded-2xl border border-[#e0bfbf]/60">
            <Filter className="w-3.5 h-3.5 text-[#775a19] shrink-0" />
            <select
              value={selectedStatusFilter}
              onChange={(e) => setSelectedStatusFilter(e.target.value)}
              className="bg-transparent text-xs font-bold text-[#570013] focus:outline-none cursor-pointer"
            >
              <option value="" className="bg-[#fff8f5] text-[#570013]">All Statuses</option>
              <option value="UPCOMING" className="bg-[#fff8f5] text-[#570013]">Upcoming</option>
              <option value="NOMINATION_OPEN" className="bg-[#fff8f5] text-[#570013]">Nomination Open</option>
              <option value="WITHDRAWAL_OPEN" className="bg-[#fff8f5] text-[#570013]">Withdrawal Open</option>
              <option value="VOTING_OPEN" className="bg-[#fff8f5] text-[#570013]">Voting Open</option>
              <option value="COMPLETED" className="bg-[#fff8f5] text-[#570013]">Completed</option>
              <option value="SUSPENDED" className="bg-[#fff8f5] text-[#570013]">Suspended</option>
            </select>
          </div>

        </div>
      </div>

      {/* Grid List with Left Accent Border Stripe */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredElections.length === 0 ? (
          <div className="col-span-full bg-white p-12 rounded-3xl border border-[#e0bfbf]/60 text-center space-y-2">
            <Vote className="w-10 h-10 text-[#8c7071] mx-auto" />
            <h3 className="text-sm font-extrabold text-[#570013]">No Elections Found</h3>
            <p className="text-xs text-[#8c7071]">No elections match your current search or status filter criteria.</p>
          </div>
        ) : (
          filteredElections.map((election) => (
            <div 
              key={election._id}
              onClick={() => handleSelectElection(election._id)}
              className="bg-white p-6 rounded-3xl border border-[#e0bfbf]/60 shadow-sm hover:border-[#570013] transition-all cursor-pointer space-y-4 flex flex-col justify-between group relative overflow-hidden"
            >
              {/* Status color accent line on left edge */}
              <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${
                election.displayStatus === "VOTING_OPEN" ? "bg-emerald-500" :
                election.displayStatus === "NOMINATION_OPEN" ? "bg-amber-500" :
                election.displayStatus === "COMPLETED" ? "bg-blue-500" : "bg-[#570013]"
              }`}></div>

              <div className="space-y-3 pl-1">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex flex-wrap gap-1 max-w-[70%]">
                    {election.wings?.slice(0, 2).map((wing: string, idx: number) => (
                      <span key={idx} className="text-[9px] font-mono font-extrabold text-[#775a19] bg-[#fbf2ed] px-2 py-0.5 rounded-md border border-[#e0bfbf]/50 truncate max-w-[120px]">
                        {wing}
                      </span>
                    ))}
                    {election.wings?.length > 2 && (
                      <span className="text-[9px] font-mono font-bold text-[#8c7071] bg-[#fbf2ed] px-1.5 py-0.5 rounded-md border border-[#e0bfbf]/50">
                        +{election.wings.length - 2}
                      </span>
                    )}
                  </div>
                  {getStatusBadge(election.displayStatus)}
                </div>

                <div>
                  <h3 className="text-base font-extrabold text-[#570013] font-['Playfair_Display',serif] group-hover:text-amber-700 transition-colors">
                    {election.name}
                  </h3>
                  <p className="text-xs text-[#584141] line-clamp-2 mt-1">
                    {election.description}
                  </p>
                </div>

                <div className="flex items-center gap-2 text-[11px] text-[#775a19] font-bold">
                  <MapPin className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">{election.location}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-[#e0bfbf]/40 text-xs pl-1">
                <span className="text-[#8c7071] flex items-center gap-1 font-bold">
                  <Calendar className="w-3.5 h-3.5 text-[#775a19]" /> View Schedule
                </span>
                <span className="inline-flex items-center gap-1 font-extrabold text-[#570013] group-hover:translate-x-1 transition-transform">
                  Access Portal <ChevronRight className="w-4 h-4" />
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}