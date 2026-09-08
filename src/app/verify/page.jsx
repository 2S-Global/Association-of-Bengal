'use client';
 
import { Suspense, useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import axios from 'axios';
import { QrCode,BadgeCheck,ShieldAlert,UserCheck,Shield} from "lucide-react";

// Inside your component:

 
function VerifyMemberContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const idParam = searchParams.get('id') || '';
 
  const [searchId, setSearchId] = useState(idParam);
  const [loading, setLoading] = useState(Boolean(idParam));
  const [memberData, setMemberData] = useState(null);
  const [error, setError] = useState(null);
 
  const fetchVerification = async (targetId) => {
    if (!targetId || !targetId.trim()) return;
    setLoading(true);
    setError(null);
    setMemberData(null);
 
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL;
      const res = await axios.get(`${baseUrl}/api/v1/members/verify/${encodeURIComponent(targetId.trim())}`);
      if (res.data?.data) {
        setMemberData(res.data.data);
      } else {
        setError('No valid member record returned.');
      }
    } catch (err) {
      console.error('Verification error:', err);
      const msg = err.response?.data?.message || 'Member not found or invalid membership ID.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };
 
  useEffect(() => {
    if (idParam) {
      setSearchId(idParam);
      fetchVerification(idParam);
    }
  }, [idParam]);
 
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchId.trim()) {
      router.push(`/verify?id=${encodeURIComponent(searchId.trim())}`);
      fetchVerification(searchId.trim());
    }
  };
 
  const formattedDate = memberData?.issueDate
    ? new Date(memberData.issueDate).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    })
    : '—';
 
  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#f8f5f0',
        padding: '24px 16px 40px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        fontFamily: 'inherit',
      }}
    >
      {/* Header Branding */}
      <div style={{ textAlign: 'center', maxWidth: 480, width: '100%', marginBottom: 20 }}>
        <div
          style={{
            width: 56,
            height: 56,
            margin: '0 auto 10px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #8C6B2A 0%, #6B1219 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 14px rgba(107,18,25,0.25)',
          }}
        >
          <BadgeCheck className="w-8 h-8 text-white" />
        </div>
        <h1
          style={{
            fontSize: 17,
            fontWeight: 800,
            color: '#3D0A0D',
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
            margin: '0 0 4px',
          }}
        >
          Association of Bengal
        </h1>
        <p
          style={{
            fontSize: 12,
            fontWeight: 600,
            color: '#8C6B2A',
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            margin: 0,
          }}
        >
          For Literature &amp; Culture • Official Registry
        </p>
      </div>
 
      {/* Main Verification Card */}
      <div
        style={{
          width: '100%',
          maxWidth: 480,
          background: '#ffffff',
          borderRadius: 18,
          boxShadow: '0 10px 30px rgba(107, 18, 25, 0.12)',
          border: '1px solid rgba(140, 107, 42, 0.15)',
          overflow: 'hidden',
        }}
      >
        {/* Card Header Strip */}
        <div
          style={{
            background: 'linear-gradient(135deg, #8C6B2A 0%, #3D0A0D 60%, #6B1219 100%)',
            padding: '16px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            color: 'white',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
           <QrCode style={{ width: 22, height: 22, color: '#f0d898' }} />
            <span style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              Member Verification Result
            </span>
          </div>
          <span
            style={{
              fontSize: 11,
              background: 'rgba(255,255,255,0.18)',
              padding: '2px 8px',
              borderRadius: 12,
              fontWeight: 600,
            }}
          >
            Digital Certificate
          </span>
        </div>
 
        {/* Content Body */}
        <div style={{ padding: '24px 20px' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <div
                className="spinner-border"
                style={{ color: '#6B1219', width: '2.5rem', height: '2.5rem' }}
                role="status"
              />
              <p style={{ marginTop: 16, fontSize: 13, color: '#666', fontWeight: 500 }}>
                Querying official member records…
              </p>
            </div>
          ) : error ? (
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <div
                style={{
                  width: 54,
                  height: 54,
                  margin: '0 auto 12px',
                  borderRadius: '50%',
                  background: '#fee2e2',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <ShieldAlert className="w-8 h-8 text-red-600" />
              </div>
              <h2 style={{ fontSize: 16, fontWeight: 700, color: '#dc2626', margin: '0 0 8px' }}>
                Verification Failed
              </h2>
              <p style={{ fontSize: 13, color: '#666', marginBottom: 16 }}>{error}</p>
 
              {/* Retry / search another ID form */}
              <form onSubmit={handleSearchSubmit} style={{ marginTop: 16 }}>
                <div style={{ display: 'flex', gap: 8 }}>
                  <input
                    type="text"
                    value={searchId}
                    onChange={(e) => setSearchId(e.target.value)}
                    placeholder="Enter Member ID (e.g. WB-2026-1029)"
                    style={{
                      flex: 1,
                      padding: '10px 14px',
                      borderRadius: 10,
                      border: '1px solid #ccc',
                      fontSize: 13,
                    }}
                  />
                  <button
                    type="submit"
                    style={{
                      padding: '10px 18px',
                      borderRadius: 10,
                      background: '#6B1219',
                      color: 'white',
                      border: 'none',
                      fontWeight: 600,
                      fontSize: 13,
                      cursor: 'pointer',
                    }}
                  >
                    Verify
                  </button>
                </div>
              </form>
            </div>
          ) : memberData ? (
            <div>
              {/* Status Badge */}
              <div
                style={{
                  background: '#ecfdf5',
                  border: '1px solid #a7f3d0',
                  borderRadius: 12,
                  padding: '12px 14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  marginBottom: 20,
                }}
              >
                <div
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: '50%',
                    background: '#10b981',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <UserCheck className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p
                    style={{
                      margin: 0,
                      fontSize: 14,
                      fontWeight: 700,
                      color: '#065f46',
                      letterSpacing: '0.02em',
                    }}
                  >
                    AUTHENTIC &amp; ACTIVE MEMBER
                  </p>
                  <p style={{ margin: 0, fontSize: 11, color: '#047857' }}>
                    Record validated in Association Central Database
                  </p>
                </div>
              </div>
 
              {/* Member Profile Info */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 16,
                  paddingBottom: 18,
                  borderBottom: '1px dashed #e2e8f0',
                  marginBottom: 16,
                }}
              >
                <div
                  style={{
                    width: 74,
                    height: 74,
                    borderRadius: 14,
                    overflow: 'hidden',
                    border: '2px solid #8C6B2A',
                    boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                    background: '#f3f4f6',
                    flexShrink: 0,
                  }}
                >
                  <img
                    src={memberData.photoUrl || '/profile.png'}
                    alt={memberData.fullName}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <h2 style={{ fontSize: 18, fontWeight: 800, color: '#1e293b', margin: '0 0 4px' }}>
                    {memberData.fullName}
                  </h2>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 6 }}>
                    {(Array.isArray(memberData.wings) && memberData.wings.length > 0
                      ? memberData.wings
                      : memberData.wing
                        ? memberData.wing.split(',').map((w) => w.trim())
                        : ['General Member']
                    ).map((wingName, idx) => (
                      <span
                        key={idx}
                        style={{
                          display: 'inline-block',
                          background: 'rgba(140, 107, 42, 0.12)',
                          color: '#8C6B2A',
                          fontWeight: 700,
                          fontSize: 10.5,
                          padding: '3px 8px',
                          borderRadius: 6,
                          textTransform: 'uppercase',
                          letterSpacing: '0.04em',
                        }}
                      >
                        {wingName}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
 
              {/* Key Details Table */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                  <span style={{ color: '#64748b', fontWeight: 500 }}>Member ID</span>
                  <span style={{ color: '#6B1219', fontWeight: 700, letterSpacing: '0.04em' }}>
                    {memberData.memberId}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                  <span style={{ color: '#64748b', fontWeight: 500 }}>Membership Status</span>
                  <span style={{ color: '#059669', fontWeight: 600, textTransform: 'capitalize' }}>
                    {memberData.status || 'Active'}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', fontSize: 13 }}>
                  <span style={{ color: '#64748b', fontWeight: 500, flexShrink: 0 }}>Assigned Wings</span>
                  <span style={{ color: '#1e293b', fontWeight: 600, textAlign: 'right', maxWidth: '65%' }}>
                    {Array.isArray(memberData.wings) && memberData.wings.length > 0
                      ? memberData.wings.join(', ')
                      : memberData.wing || 'General Member'}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                  <span style={{ color: '#64748b', fontWeight: 500 }}>Region / Country</span>
                  <span style={{ color: '#1e293b', fontWeight: 600 }}>
                    {[memberData.location?.region, memberData.location?.country].filter(Boolean).join(', ') || '—'}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                  <span style={{ color: '#64748b', fontWeight: 500 }}>Issued Date</span>
                  <span style={{ color: '#1e293b', fontWeight: 600 }}>{formattedDate}</span>
                </div>
              </div>
 
              {/* Security Seal Note */}
              <div
                style={{
                  background: '#fafaf9',
                  border: '1px solid #f1f5f9',
                  borderRadius: 10,
                  padding: '10px 12px',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 8,
                }}
              >
              <Shield className="w-4 h-4 text-[#8C6B2A] mt-0.5 shrink-0" />
                <p style={{ fontSize: 10.5, color: '#64748b', margin: 0, lineHeight: 1.4 }}>
                  This official digital credential confirms valid and active membership in the Association of Bengal
                  for Literature &amp; Culture. It is cryptographically recorded in the association directory.
                </p>
              </div>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <p style={{ fontSize: 13, color: '#64748b' }}>Enter a Membership ID to verify authenticity.</p>
              <form onSubmit={handleSearchSubmit} style={{ marginTop: 14 }}>
                <div style={{ display: 'flex', gap: 8 }}>
                  <input
                    type="text"
                    value={searchId}
                    onChange={(e) => setSearchId(e.target.value)}
                    placeholder="e.g. WB-2026-1029"
                    style={{
                      flex: 1,
                      padding: '10px 14px',
                      borderRadius: 10,
                      border: '1px solid #ccc',
                      fontSize: 13,
                    }}
                  />
                  <button
                    type="submit"
                    style={{
                      padding: '10px 18px',
                      borderRadius: 10,
                      background: '#6B1219',
                      color: 'white',
                      border: 'none',
                      fontWeight: 600,
                      fontSize: 13,
                      cursor: 'pointer',
                    }}
                  >
                    Verify
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
 
        {/* Footer Bar
        <div
          style={{
            padding: '12px 20px',
            background: '#f8fafc',
            borderTop: '1px solid #e2e8f0',
            textAlign: 'center',
          }}
        >
          <button
            onClick={() => router.push('/dashboard')}
            style={{
              background: 'none',
              border: 'none',
              color: '#8C6B2A',
              fontWeight: 600,
              fontSize: 12,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>
              dashboard
            </span>
            Go to Member Portal
          </button>
        </div>
         */}
      </div>
    </div>
  );
}
 
export default function VerifyMemberPage() {
  return (
    <Suspense
      fallback={
        <div style={{ padding: 40, textAlign: 'center', color: '#6B1219' }}>
          Loading verification service…
        </div>
      }
    >
      <VerifyMemberContent />
    </Suspense>
  );
}
 
 