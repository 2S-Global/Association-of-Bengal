"use client";

import React, { useState, useEffect } from "react";
import { 
  Bell, 
  CheckCheck, 
  CheckCircle2, 
  Loader2, 
  AlertCircle, 
  Inbox,
  ChevronLeft,
  ChevronRight,
  Filter
} from "lucide-react";

const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_URL || "https://balc.albdglobal.org"}/api/v1`;

interface Notification {
  _id: string;
  title?: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [unreadOnly, setUnreadOnly] = useState(false);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [actionLoading, setActionLoading] = useState(false);

  // Fetch notifications
  const fetchNotifications = async () => {
    const token = localStorage.getItem("token") || localStorage.getItem("accessToken") || localStorage.getItem("access_token");
    if (!token) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const url = `${API_BASE_URL}/notifications?page=${page}&limit=${limit}${unreadOnly ? "&unreadOnly=true" : ""}`;
      const res = await fetch(url, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const json = await res.json();

      if (res.ok && json?.data) {
        const list = json.data.notifications || json.data.list || json.data || [];
        setNotifications(list);
        setUnreadCount(json.data.unreadCount ?? list.filter((n: Notification) => !n.read).length);
      }
    } catch (err) {
      console.error("Failed to load notifications:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [page, unreadOnly]);

  // Mark single notification as read (`PATCH /notifications/:id/read`)
  const handleMarkAsRead = async (id: string) => {
    const token = localStorage.getItem("token") || localStorage.getItem("accessToken") || localStorage.getItem("access_token");
    if (!token) return;

    try {
      const res = await fetch(`${API_BASE_URL}/notifications/${id}/read`, {
        method: "PATCH",
        headers: { "Authorization": `Bearer ${token}` }
      });

      if (res.ok) {
        setNotifications(prev =>
          prev.map(item => (item._id === id ? { ...item, read: true } : item))
        );
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (err) {
      console.error("Error marking notification as read:", err);
    }
  };

  // Mark all notifications as read (`PATCH /notifications/read-all`)
  const handleMarkAllAsRead = async () => {
    const token = localStorage.getItem("token") || localStorage.getItem("accessToken") || localStorage.getItem("access_token");
    if (!token) return;

    setActionLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/notifications/read-all`, {
        method: "PATCH",
        headers: { "Authorization": `Bearer ${token}` }
      });

      if (res.ok) {
        setNotifications(prev => prev.map(item => ({ ...item, read: true })));
        setUnreadCount(0);
      }
    } catch (err) {
      console.error("Error marking all as read:", err);
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16 font-['Libre_Franklin',sans-serif]">
      
      {/* Header Banner */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#e0bfbf]/60 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-[#570013]/10 to-transparent rounded-full pointer-events-none" />
        <div className="space-y-1 z-10">
          <div className="inline-flex items-center gap-1.5 bg-[#570013]/10 text-[#570013] px-3 py-1 rounded-full text-xs font-mono font-bold">
            <Bell className="w-3.5 h-3.5 text-amber-600" /> Center
          </div>
          <h1 className="text-2xl font-extrabold text-[#570013] font-['Playfair_Display',serif]">
            Notifications & Updates
          </h1>
          <p className="text-xs text-[#8c7071]">Stay updated with official association announcements and account activity.</p>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllAsRead}
            disabled={actionLoading}
            className="inline-flex items-center gap-2 bg-[#570013] text-white px-5 py-2.5 rounded-2xl text-xs font-bold shadow-md hover:bg-[#40000e] transition-all cursor-pointer disabled:opacity-50 shrink-0 z-10"
          >
            {actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCheck className="w-4 h-4" />}
            Mark all as read ({unreadCount})
          </button>
        )}
      </div>

      {/* Filter & Controls Bar */}
      <div className="bg-white px-6 py-4 rounded-2xl border border-[#e0bfbf]/60 shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-[#775a19]" />
          <span className="text-xs font-extrabold text-[#570013]">Filter View:</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => { setUnreadOnly(false); setPage(1); }}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              !unreadOnly ? "bg-[#570013] text-white shadow-xs" : "bg-[#fbf2ed] text-[#584141] hover:bg-[#e0bfbf]/30"
            }`}
          >
            All
          </button>
          <button
            onClick={() => { setUnreadOnly(true); setPage(1); }}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              unreadOnly ? "bg-[#570013] text-white shadow-xs" : "bg-[#fbf2ed] text-[#584141] hover:bg-[#e0bfbf]/30"
            }`}
          >
            Unread Only
          </button>
        </div>
      </div>

      {/* Notifications Feed Container */}
      <div className="bg-white rounded-3xl border border-[#e0bfbf]/60 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center min-h-[300px] space-y-3">
            <Loader2 className="w-7 h-7 animate-spin text-[#570013]" />
            <p className="text-xs font-bold text-[#8c7071]">Loading notifications...</p>
          </div>
        ) : notifications.length > 0 ? (
          <div className="divide-y divide-[#e0bfbf]/40">
            {notifications.map((item) => (
              <div 
                key={item._id} 
                className={`p-5 sm:p-6 transition-colors flex items-start justify-between gap-4 ${
                  item.read ? "bg-white" : "bg-[#fff8f5]/70"
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 mt-0.5 border ${
                    item.read ? "bg-gray-50 text-gray-400 border-gray-200" : "bg-[#fbf2ed] text-[#775a19] border-[#e0bfbf]/80 shadow-xs"
                  }`}>
                    <Bell className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      {item.title && <h4 className="text-xs font-extrabold text-[#570013]">{item.title}</h4>}
                      {!item.read && (
                        <span className="inline-block w-2 h-2 rounded-full bg-[#570013] animate-pulse" />
                      )}
                    </div>
                    <p className="text-xs text-[#584141] leading-relaxed">{item.message}</p>
                    <span className="text-[10px] text-[#8c7071] font-medium block pt-1">
                      {item.createdAt ? new Date(item.createdAt).toLocaleString() : ""}
                    </span>
                  </div>
                </div>

                {!item.read && (
                  <button
                    onClick={() => handleMarkAsRead(item._id)}
                    className="text-[11px] font-bold text-[#570013] bg-[#fbf2ed] hover:bg-[#e0bfbf]/40 border border-[#e0bfbf]/60 px-3 py-1.5 rounded-xl transition-colors cursor-pointer shrink-0"
                  >
                    Mark Read
                  </button>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-[#fbf2ed] flex items-center justify-center text-[#775a19]">
              <Inbox className="w-7 h-7" />
            </div>
            <h3 className="text-sm font-extrabold text-[#570013]">No Notifications Found</h3>
            <p className="text-xs text-[#8c7071] max-w-xs">You're all caught up! There are no new alerts to display at this time.</p>
          </div>
        )}

        {/* Pagination Footer */}
        <div className="bg-[#fbf2ed]/40 px-6 py-4 border-t border-[#e0bfbf]/40 flex items-center justify-between">
          <span className="text-xs font-bold text-[#8c7071]">Page {page}</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage(prev => Math.max(1, prev - 1))}
              disabled={page === 1 || isLoading}
              className="p-2 rounded-xl bg-white border border-[#e0bfbf]/80 text-[#570013] disabled:opacity-40 cursor-pointer hover:bg-[#fbf2ed]"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setPage(prev => prev + 1)}
              disabled={notifications.length < limit || isLoading}
              className="p-2 rounded-xl bg-white border border-[#e0bfbf]/80 text-[#570013] disabled:opacity-40 cursor-pointer hover:bg-[#fbf2ed]"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}