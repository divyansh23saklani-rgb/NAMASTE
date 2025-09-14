'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getUserFromStorage, removeUserFromStorage } from '@/lib/auth';
import { getClaims, saveClaims, getNotifications, getPatientByAbhaId, getTreatmentsByPatientId, updateTreatment, getApprovedAmountToday, getClaimsByPatientId, removeClaim, addApprovedAmount, getTotalClaimsAmount, resetApprovedAmountDaily } from '@/lib/data';
import { User, Claim, Notification, Patient, Treatment } from '@/types';

export default function InsuranceDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [claims, setClaims] = useState<Claim[]>([]);
  const [filteredClaims, setFilteredClaims] = useState<Claim[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [sortBy, setSortBy] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showPatientDetails, setShowPatientDetails] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [selectedPatientTreatments, setSelectedPatientTreatments] = useState<Treatment[]>([]);
  const [abhaSearchId, setAbhaSearchId] = useState('');
  const [showAbhaSearch, setShowAbhaSearch] = useState(false);
  const [approvedAmountToday, setApprovedAmountToday] = useState(0);
  const [totalClaimsAmount, setTotalClaimsAmount] = useState(0);
  const [patientClaims, setPatientClaims] = useState<Claim[]>([]);
  const [claimStatusFilter, setClaimStatusFilter] = useState('all');

  useEffect(() => {
    const currentUser = getUserFromStorage();
    if (!currentUser || currentUser.providerType !== 'insurance') {
      router.push('/login');
      return;
    }
    setUser(currentUser);

    // Reset approved amount daily and load data
    resetApprovedAmountDaily();
    loadClaimsData();
    setNotifications(getNotifications());
  }, [router]);

  const loadClaimsData = () => {
    const claimsData = getClaims();
    setClaims(claimsData);
    setFilteredClaims(claimsData);
    setApprovedAmountToday(getApprovedAmountToday());
    setTotalClaimsAmount(getTotalClaimsAmount());
  };


  const handleSort = (sortType: string) => {
    setSortBy(sortType);
    const sorted = [...filteredClaims].sort((a, b) => {
      switch (sortType) {
        case 'amount-high':
          return b.claimAmount - a.claimAmount;
        case 'amount-low':
          return a.claimAmount - b.claimAmount;
        case 'date-newest':
          return new Date(b.submissionDate).getTime() - new Date(a.submissionDate).getTime();
        case 'date-oldest':
          return new Date(a.submissionDate).getTime() - new Date(b.submissionDate).getTime();
        case 'patient-name':
          return a.patientName.localeCompare(b.patientName);
        default:
          return 0;
      }
    });
    setFilteredClaims(sorted);
  };

  const handleApproveClaim = (claimId: string) => {
    const claimToApprove = claims.find(claim => claim.id === claimId);
    if (claimToApprove) {
      // Add amount to approved today counter
      addApprovedAmount(claimToApprove.claimAmount);
    }
    
    const updatedClaims = claims.filter(claim => claim.id !== claimId);
    setClaims(updatedClaims);
    setFilteredClaims(updatedClaims.filter(claim => claim.id !== claimId));
    saveClaims(updatedClaims);
    
    // Update patient claims if we're in patient details view
    if (selectedPatient) {
      const updatedPatientClaims = patientClaims.filter(claim => claim.id !== claimId);
      setPatientClaims(updatedPatientClaims);
    }
    
    // Refresh data to update counters
    loadClaimsData();
    
    alert(`Claim ${claimId} approved successfully!`);
  };

  const handleRejectClaim = (claimId: string) => {
    const reason = prompt('Please provide a reason for rejection:');
    if (reason) {
      const updatedClaims = claims.filter(claim => claim.id !== claimId);
      setClaims(updatedClaims);
      setFilteredClaims(updatedClaims.filter(claim => claim.id !== claimId));
      saveClaims(updatedClaims);
      
      // Update patient claims if we're in patient details view
      if (selectedPatient) {
        const updatedPatientClaims = patientClaims.filter(claim => claim.id !== claimId);
        setPatientClaims(updatedPatientClaims);
      }
      
      // Refresh data to update counters
      loadClaimsData();
      
      alert(`Claim ${claimId} rejected. Reason: ${reason}`);
    }
  };

  const handleSignOut = () => {
    if (confirm('Are you sure you want to sign out?')) {
      removeUserFromStorage();
      router.push('/');
    }
  };

  const handlePatientNameClick = (patientName: string, abhaId: string) => {
    const patient = getPatientByAbhaId(abhaId);
    if (patient) {
      setSelectedPatient(patient);
      const treatments = getTreatmentsByPatientId(abhaId);
      const claims = getClaimsByPatientId(abhaId);
      setSelectedPatientTreatments(treatments);
      setPatientClaims(claims);
      setShowPatientDetails(true);
    }
  };


  const handleAbhaSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (abhaSearchId.length === 14 && /^\d+$/.test(abhaSearchId)) {
      const patient = getPatientByAbhaId(abhaSearchId);
      if (patient) {
        setSelectedPatient(patient);
        const treatments = getTreatmentsByPatientId(abhaSearchId);
        const claims = getClaimsByPatientId(abhaSearchId);
        setSelectedPatientTreatments(treatments);
        setPatientClaims(claims);
        setShowPatientDetails(true);
        setShowAbhaSearch(false);
      } else {
        alert('No patient found with the provided ABHA ID');
      }
    } else {
      alert('Please enter a valid 14-digit ABHA ID');
    }
  };

  const getFilteredPatientClaims = () => {
    if (claimStatusFilter === 'all') {
      return patientClaims;
    }
    return patientClaims.filter(claim => claim.status === claimStatusFilter);
  };

  const handleTreatmentApprove = (treatment: Treatment) => {
    if (confirm(`Approve treatment: ${treatment.condition}?`)) {
      // Update treatment status in localStorage
      updateTreatment(treatment.id, { status: 'completed' });
      
      // Update local state
      const updatedTreatments = selectedPatientTreatments.map(t => 
        t.id === treatment.id ? { ...t, status: 'completed' as const } : t
      );
      setSelectedPatientTreatments(updatedTreatments);
      
      // Remove corresponding claim from system if it's an insurance treatment
      if (treatment.paymentType === 'insurance') {
        const claimToRemove = patientClaims.find(claim => 
          claim.abhaId === treatment.patientId && claim.condition === treatment.condition
        );
        
        if (claimToRemove) {
          // Add amount to approved today counter
          addApprovedAmount(claimToRemove.claimAmount);
          
          // Remove claim from localStorage
          removeClaim(claimToRemove.id);
          
          // Update local state - remove from all claims lists
          const updatedClaims = claims.filter(claim => claim.id !== claimToRemove.id);
          setClaims(updatedClaims);
          setFilteredClaims(updatedClaims);
          
          // Update patient-specific claims
          const updatedPatientClaims = patientClaims.filter(claim => claim.id !== claimToRemove.id);
          setPatientClaims(updatedPatientClaims);
        }
      }
      
      // Refresh data
      loadClaimsData();
      
      alert('Treatment approved successfully!');
    }
  };

  const handleTreatmentReject = (treatment: Treatment) => {
    const reason = prompt(`Reject treatment: ${treatment.condition}?\nPlease provide a reason:`);
    if (reason) {
      // Update treatment status in localStorage
      updateTreatment(treatment.id, { status: 'cancelled' });
      
      // Update local state
      const updatedTreatments = selectedPatientTreatments.map(t => 
        t.id === treatment.id ? { ...t, status: 'cancelled' as const } : t
      );
      setSelectedPatientTreatments(updatedTreatments);
      
      // Remove corresponding claim from system if it's an insurance treatment
      if (treatment.paymentType === 'insurance') {
        const claimToRemove = patientClaims.find(claim => 
          claim.abhaId === treatment.patientId && claim.condition === treatment.condition
        );
        
        if (claimToRemove) {
          // Remove claim from localStorage
          removeClaim(claimToRemove.id);
          
          // Update local state - remove from all claims lists
          const updatedClaims = claims.filter(claim => claim.id !== claimToRemove.id);
          setClaims(updatedClaims);
          setFilteredClaims(updatedClaims);
          
          // Update patient-specific claims
          const updatedPatientClaims = patientClaims.filter(claim => claim.id !== claimToRemove.id);
          setPatientClaims(updatedPatientClaims);
        }
      }
      
      // Refresh data
      loadClaimsData();
      
      alert(`Treatment rejected. Reason: ${reason}`);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">N</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">NAMASTE</h1>
                <p className="text-sm text-gray-600">Insurance Dashboard</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* ABHA Search Button */}
              <button
                onClick={() => setShowAbhaSearch(true)}
                className="btn-secondary"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                Search by ABHA ID
              </button>
              
              {/* Notifications */}
              <div className="relative">
                <button 
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="p-2 text-gray-600 hover:text-gray-900 relative"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4.828 7l2.586 2.586a2 2 0 002.828 0L12.828 7H4.828z" />
                  </svg>
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {notifications.length}
                  </span>
                </button>

                {/* Notifications Dropdown */}
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                    <div className="p-4 border-b border-gray-200">
                      <h3 className="font-semibold text-gray-900">Notifications</h3>
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                      {notifications.map((notification) => (
                        <div key={notification.id} className="p-4 border-b border-gray-100">
                          <p className="text-sm text-gray-900">{notification.message}</p>
                          <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Account Dropdown */}
              <div className="relative">
                <button className="flex items-center space-x-2 p-2 text-gray-700 hover:text-gray-900">
                  <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <span className="font-medium">{user.providerName}</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>

              <button onClick={handleSignOut} className="btn-secondary">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending Claims</p>
                <p className="text-2xl font-bold text-gray-900">{claims.length}</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Amount</p>
                <p className="text-2xl font-bold text-gray-900">₹{totalClaimsAmount.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Approved Today</p>
                <p className="text-2xl font-bold text-gray-900">₹{approvedAmountToday.toLocaleString()}</p>
              </div>
            </div>
          </div>

        </div>

        {/* Claims Management */}
        <div className="card">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900">Claims Management</h2>
              <p className="text-gray-600">Review and process insurance claims</p>
            </div>
            <div className="flex gap-4">
              <select
                value={sortBy}
                onChange={(e) => handleSort(e.target.value)}
                className="form-input w-auto"
              >
                <option value="">Sort Claims</option>
                <option value="amount-high">Amount: High to Low</option>
                <option value="amount-low">Amount: Low to High</option>
                <option value="date-newest">Date: Newest First</option>
                <option value="date-oldest">Date: Oldest First</option>
                <option value="patient-name">Patient Name: A-Z</option>
              </select>
              <button className="btn-secondary">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Export Claims
              </button>
            </div>
          </div>

          {/* Claims List */}
          <div className="space-y-4">
            {filteredClaims.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No claims found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  No claims available at the moment.
                </p>
              </div>
            ) : (
              filteredClaims.map((claim) => (
              <div key={claim.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <button
                      onClick={() => handlePatientNameClick(claim.patientName, claim.abhaId)}
                      className="text-lg font-semibold text-primary-600 hover:text-primary-700 hover:underline"
                    >
                      {claim.patientName}
                    </button>
                    <p className="text-gray-600">Claim ID: {claim.id}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                      {claim.status.toUpperCase()}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Condition</label>
                    <p className="text-gray-900">{claim.condition}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Hospital</label>
                    <p className="text-gray-900">{claim.hospital}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Doctor</label>
                    <p className="text-gray-900">{claim.doctor}</p>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <div className="text-2xl font-bold text-gray-900">{claim.claimAmountFormatted}</div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleApproveClaim(claim.id)}
                      className="btn-primary"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Approve
                    </button>
                    <button
                      onClick={() => handleRejectClaim(claim.id)}
                      className="btn-secondary"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      Reject
                    </button>
                  </div>
                </div>
              </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* ABHA Search Modal */}
      {showAbhaSearch && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Search Patient by ABHA ID</h2>
              <button
                onClick={() => setShowAbhaSearch(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleAbhaSearch} className="space-y-4">
              <div>
                <label className="form-label">ABHA ID</label>
                <input
                  type="text"
                  value={abhaSearchId}
                  onChange={(e) => setAbhaSearchId(e.target.value)}
                  className="form-input"
                  placeholder="Enter 14-digit ABHA ID"
                  maxLength={14}
                />
              </div>

              <div>
                <label className="form-label">Filter Claims by Status</label>
                <select
                  value={claimStatusFilter}
                  onChange={(e) => setClaimStatusFilter(e.target.value)}
                  className="form-input"
                >
                  <option value="all">All Claims</option>
                  <option value="pending">For Approval</option>
                  <option value="approved">Passed/Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setShowAbhaSearch(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Search Patient
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Patient Details Modal */}
      {showPatientDetails && selectedPatient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-4xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Patient Details</h2>
              <button
                onClick={() => setShowPatientDetails(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Patient Information */}
            <div className="card mb-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Patient Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Name</label>
                  <p className="font-semibold">{selectedPatient.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">ABHA ID</label>
                  <p className="font-semibold">{selectedPatient.abhaId}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Age</label>
                  <p className="font-semibold">{selectedPatient.age} years</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Gender</label>
                  <p className="font-semibold">{selectedPatient.gender}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Phone</label>
                  <p className="font-semibold">{selectedPatient.phone}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Blood Group</label>
                  <p className="font-semibold">{selectedPatient.bloodGroup}</p>
                </div>
              </div>
            </div>

            {/* Patient Claims */}
            <div className="card mb-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-gray-900">
                  Insurance Claims 
                  {claimStatusFilter !== 'all' && (
                    <span className="text-sm font-normal text-gray-600 ml-2">
                      ({claimStatusFilter.toUpperCase()})
                    </span>
                  )}
                </h3>
                <select
                  value={claimStatusFilter}
                  onChange={(e) => setClaimStatusFilter(e.target.value)}
                  className="form-input w-auto"
                >
                  <option value="all">All Claims</option>
                  <option value="pending">For Approval</option>
                  <option value="approved">Passed/Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
                <div className="space-y-3">
                  {getFilteredPatientClaims().length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      No claims found for the selected filter.
                    </div>
                  ) : (
                    getFilteredPatientClaims().map((claim) => (
                    <div key={claim.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-semibold text-gray-900">{claim.condition}</h4>
                          <p className="text-sm text-gray-600">Claim ID: {claim.id}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            claim.status === 'pending' 
                              ? 'bg-yellow-100 text-yellow-800'
                              : claim.status === 'approved'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {claim.status.toUpperCase()}
                          </span>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <label className="text-xs font-medium text-gray-500">Amount</label>
                          <p className="font-semibold">{claim.claimAmountFormatted}</p>
                        </div>
                        <div>
                          <label className="text-xs font-medium text-gray-500">Date</label>
                          <p className="font-semibold">{claim.submissionDate}</p>
                        </div>
                        <div>
                          <label className="text-xs font-medium text-gray-500">Doctor</label>
                          <p className="font-semibold">{claim.doctor}</p>
                        </div>
                      </div>
                      
                      {/* Approve/Reject buttons for pending claims */}
                      {claim.status === 'pending' && (
                        <div className="flex justify-end space-x-2 mt-4 pt-4 border-t border-gray-200">
                          <button
                            onClick={() => handleApproveClaim(claim.id)}
                            className="bg-green-600 text-white px-4 py-2 rounded text-sm hover:bg-green-700 flex items-center space-x-1"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span>Approve</span>
                          </button>
                          <button
                            onClick={() => handleRejectClaim(claim.id)}
                            className="bg-red-600 text-white px-4 py-2 rounded text-sm hover:bg-red-700 flex items-center space-x-1"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            <span>Reject</span>
                          </button>
                        </div>
                      )}
                    </div>
                    ))
                  )}
                </div>
              </div>

          </div>
        </div>
      )}
    </div>
  );
}
