"use client";

import React, { useState, useEffect } from 'react';

const MembersPage = () => {
  // State for storing API data
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // State for the search bar
  const [searchQuery, setSearchQuery] = useState("");

  // State for the View Details Modal
  const [selectedMember, setSelectedMember] = useState<any>(null);

  // Fetch data from the API when the component mounts
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await fetch('/api/members');
        
        if (!response.ok) {
          throw new Error('Failed to fetch members data');
        }

        const data = await response.json();
        
        if (data.success) {
          setMembers(data.data);
        } else {
          throw new Error(data.message || 'Failed to load members');
        }
      } catch (err: unknown) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, []);

  // Filter members based on the search query (by name or ID)
  const filteredMembers = members.filter((member: any) => {
    const query = searchQuery.toLowerCase();
    return (
      member.fullName?.toLowerCase().includes(query) ||
      member.memberId?.toLowerCase().includes(query)
    );
  });

  // Helper function to format as Indian Currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount || 0);
  };

  return (
    <div className="p-3 sm:p-4 md:p-8 min-h-screen bg-[#fefcfc] font-sans text-gray-800">
      <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
        
        {/* --- Top Header Card --- */}
        <div className="bg-white border border-[#e8d5d5] rounded-2xl p-4 sm:p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3 sm:gap-4">
            <div className="mt-1 shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7 sm:w-8 sm:h-8 text-[#5c0f18]">
                <path d="M4.5 6.375a4.125 4.125 0 118.25 0 4.125 4.125 0 01-8.25 0zM14.25 8.625a3.375 3.375 0 116.75 0 3.375 3.375 0 01-6.75 0zM1.5 19.125a7.125 7.125 0 0114.25 0v.003l-.001.119a.75.75 0 01-.363.63 13.067 13.067 0 01-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 01-.364-.63l-.001-.122zM17.25 19.128l-.001.144a2.25 2.25 0 01-.233.96 10.088 10.088 0 005.06-1.01.75.75 0 00.42-.643 4.875 4.875 0 00-6.957-4.611 8.586 8.586 0 011.71 5.157v.003z" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-serif font-bold text-[#5c0f18]">Members Management</h1>
              <p className="text-xs sm:text-sm text-gray-600 mt-0.5 sm:mt-1">
                Manage and view all registered members, their verification status, and contributions.
              </p>
            </div>
          </div>
          
          <div className="shrink-0 border border-[#e8d5d5] bg-[#fbf3f3] text-[#5c0f18] px-4 py-2 rounded-full font-medium text-xs sm:text-sm self-start sm:self-auto">
            Total Members: {members.length}
          </div>
        </div>

        {/* --- Search Bar Card --- */}
        <div className="bg-white border border-[#e8d5d5] rounded-full px-4 sm:px-5 py-2.5 sm:py-3 shadow-sm flex items-center gap-3">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-gray-400 shrink-0">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
          <input 
            type="text" 
            placeholder="Search by member name or ID..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent focus:outline-none text-xs sm:text-sm text-gray-700 placeholder-gray-400"
          />
        </div>

        {/* --- Table Card --- */}
        <div className="bg-white border border-[#e8d5d5] rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto w-full">
            <table className="w-full min-w-[750px] text-left border-collapse">
              <thead className="bg-[#fbf3f3] text-[#7a2021] text-[11px] sm:text-xs uppercase tracking-wider font-bold border-b border-[#e8d5d5]">
                <tr>
                  <th className="px-4 sm:px-6 py-3.5 sm:py-4">MEMBER</th>
                  <th className="px-4 sm:px-6 py-3.5 sm:py-4">DETAILS</th>
                  <th className="px-4 sm:px-6 py-3.5 sm:py-4">CONTRIBUTIONS</th>
                  <th className="px-4 sm:px-6 py-3.5 sm:py-4 text-center">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e8d5d5] text-xs sm:text-sm">
                
                {/* Handle Loading State */}
                {loading && (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-gray-500 font-medium">
                      Loading members data...
                    </td>
                  </tr>
                )}

                {/* Handle Error State */}
                {error && !loading && (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-red-500 font-medium">
                      {error}
                    </td>
                  </tr>
                )}

                {/* Handle Empty/No Results State */}
                {!loading && !error && filteredMembers.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-gray-500 font-medium">
                      No members found.
                    </td>
                  </tr>
                )}

                {/* Render Data */}
                {!loading && !error && filteredMembers.map((member: any) => (
                  <tr key={member._id} className="hover:bg-[#fcf8f8] transition-colors">
                    
                    {/* Member Avatar, Name & ID */}
                    <td className="px-4 sm:px-6 py-4 sm:py-5">
                      <div className="flex items-center gap-3 sm:gap-4">
                        <img 
                          src={member.photoUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(member.fullName)}&background=fbf3f3&color=7a2021`} 
                          alt={member.fullName}
                          className="w-9 h-9 sm:w-10 sm:h-10 rounded-full object-cover border border-[#e8d5d5] shrink-0"
                        />
                        <div className="min-w-0">
                          <div className="text-sm sm:text-base font-bold text-[#2a2a2a] truncate">{member.fullName}</div>
                          <div className="text-[11px] sm:text-xs text-gray-500 mt-0.5">{member.memberId}</div>
                        </div>
                      </div>
                    </td>

                    {/* Details (Wings & Location) */}
                    <td className="px-4 sm:px-6 py-4 sm:py-5">
                      <div className="flex flex-col gap-1 text-xs sm:text-sm text-gray-600">
                        <div className="flex items-start gap-1.5">
                          <svg className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path></svg>
                          <span className="max-w-[180px] sm:max-w-[200px] truncate" title={member.wings?.length > 0 ? member.wings.join(', ') : member.wing}>
                            {member.wings?.length > 0 ? member.wings.join(', ') : (member.wing || 'N/A')}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                          <span className="capitalize">{member.location?.country?.toLowerCase() || 'N/A'}</span>
                        </div>
                      </div>
                    </td>

                    {/* Contributions Badge */}
                    <td className="px-4 sm:px-6 py-4 sm:py-5 whitespace-nowrap">
                      <span className="inline-flex items-center border border-[#e8d5d5] bg-white rounded-full px-3 py-1 text-xs font-bold text-[#7a2021]">
                        {formatCurrency(member.totalContributions)}
                      </span>
                    </td>

                    {/* Action Button */}
                    <td className="px-4 sm:px-6 py-4 sm:py-5 text-center whitespace-nowrap">
                      <button 
                        onClick={() => setSelectedMember(member)}
                        className="bg-[#5c0f18] hover:bg-[#4a0c13] transition-colors text-white text-xs font-semibold px-3.5 py-2 rounded-lg shadow-sm cursor-pointer"
                      >
                        View Details
                      </button>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* --- Rich Detailed View Modal --- */}
      {selectedMember && (
        <div className="fixed inset-0 z-[99999] bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white border border-[#e8d5d5] rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-150">
            
            {/* Modal Header */}
            <div className="bg-[#fbf3f3] px-4 sm:px-6 py-3.5 sm:py-4 border-b border-[#e8d5d5] flex items-center justify-between">
              <div>
                <h3 className="font-serif font-bold text-base sm:text-lg text-[#5c0f18]">Member Complete Details</h3>
                <p className="text-[11px] sm:text-xs text-gray-500 mt-0.5">Viewing profile breakdown and registration records</p>
              </div>
              <button 
                onClick={() => setSelectedMember(null)}
                className="text-gray-400 hover:text-gray-700 transition-colors p-1.5 rounded-full hover:bg-white/80 cursor-pointer shrink-0"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-4 sm:p-6 space-y-4 sm:space-y-6 max-h-[75vh] overflow-y-auto bg-[#fffcfc]">
              
              {/* Profile Card Header Info */}
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 pb-4 sm:pb-5 border-b border-[#e8d5d5] text-center sm:text-left">
                <img 
                  src={selectedMember.photoUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedMember.fullName || 'User')}&background=fbf3f3&color=7a2021`} 
                  alt={selectedMember.fullName}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border-2 border-[#e8d5d5] shadow-sm shrink-0"
                />
                <div className="space-y-1 w-full min-w-0">
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900 truncate">{selectedMember.fullName}</h2>
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
                    <span className="text-[11px] sm:text-xs font-semibold text-[#7a2021] bg-[#fbf3f3] border border-[#e0bfbf] px-2.5 sm:px-3 py-1 rounded-full">
                      ID: {selectedMember.memberId || 'N/A'}
                    </span>
                    <span className="text-[11px] sm:text-xs font-semibold text-gray-600 bg-gray-100 border border-gray-200 px-2.5 sm:px-3 py-1 rounded-full">
                      Member Since: {selectedMember.memberSince || 'N/A'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Data Grid Layout */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-xs sm:text-sm">
                
                {/* Contact Email */}
                <div className="bg-white border border-[#e8d5d5] p-3.5 sm:p-4 rounded-2xl shadow-2xs space-y-1">
                  <span className="block text-[10px] font-bold text-[#7a2021] uppercase tracking-wider">Email Address</span>
                  <span className="font-semibold text-gray-800 break-all">{selectedMember.user?.email || selectedMember.email || 'N/A'}</span>
                </div>

                {/* Mobile Number */}
                <div className="bg-white border border-[#e8d5d5] p-3.5 sm:p-4 rounded-2xl shadow-2xs space-y-1">
                  <span className="block text-[10px] font-bold text-[#7a2021] uppercase tracking-wider">Mobile Number</span>
                  <span className="font-semibold text-gray-800">{selectedMember.user?.mobile || selectedMember.mobile || 'N/A'}</span>
                </div>

                {/* Wings / Categories */}
                <div className="bg-white border border-[#e8d5d5] p-3.5 sm:p-4 rounded-2xl shadow-2xs space-y-1 sm:col-span-2">
                  <span className="block text-[10px] font-bold text-[#7a2021] uppercase tracking-wider">Wings / Categories</span>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {selectedMember.wings?.length > 0 ? (
                      selectedMember.wings.map((wingName: string, idx: number) => (
                        <span key={idx} className="bg-[#fbf3f3] text-[#7a2021] border border-[#e0bfbf] text-[11px] sm:text-xs px-2.5 py-0.5 rounded-full font-medium">
                          {wingName}
                        </span>
                      ))
                    ) : (
                      <span className="font-semibold text-gray-800">{selectedMember.wing || 'N/A'}</span>
                    )}
                  </div>
                </div>

                {/* Total Contributions */}
                <div className="bg-white border border-[#e8d5d5] p-3.5 sm:p-4 rounded-2xl shadow-2xs space-y-1">
                  <span className="block text-[10px] font-bold text-[#7a2021] uppercase tracking-wider">Total Contributions</span>
                  <span className="font-bold text-sm sm:text-base text-[#7a2021]">{formatCurrency(selectedMember.totalContributions)}</span>
                </div>

                {/* Location */}
                <div className="bg-white border border-[#e8d5d5] p-3.5 sm:p-4 rounded-2xl shadow-2xs space-y-1">
                  <span className="block text-[10px] font-bold text-[#7a2021] uppercase tracking-wider">Country / Location</span>
                  <span className="font-semibold text-gray-800 uppercase">{selectedMember.location?.country || 'N/A'}</span>
                </div>

                {/* Onboarding Step Info */}
                <div className="bg-white border border-[#e8d5d5] p-3.5 sm:p-4 rounded-2xl shadow-2xs space-y-1 sm:col-span-2">
                  <span className="block text-[10px] font-bold text-[#7a2021] uppercase tracking-wider">Onboarding Progress</span>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="font-semibold text-gray-800">Step: {selectedMember.user?.step ?? selectedMember.step ?? '1'}</span>
                    <span className={`text-[9px] sm:text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                      (selectedMember.user?.allstep_completed ?? selectedMember.allstep_completed) ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {(selectedMember.user?.allstep_completed ?? selectedMember.allstep_completed) ? 'Completed' : 'In Progress'}
                    </span>
                  </div>
                </div>

              </div>

            </div>

            {/* Modal Footer */}
            <div className="bg-[#fbf3f3] px-4 sm:px-6 py-3.5 sm:py-4 border-t border-[#e8d5d5] flex justify-end">
              <button 
                onClick={() => setSelectedMember(null)}
                className="bg-[#5c0f18] hover:bg-[#4a0c13] transition-colors text-white text-xs font-semibold px-5 sm:px-6 py-2.5 rounded-xl shadow-sm cursor-pointer w-full sm:w-auto"
              >
                Close Profile
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default MembersPage;