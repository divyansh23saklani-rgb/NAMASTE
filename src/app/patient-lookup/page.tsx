'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getUserFromStorage } from '@/lib/auth';
import { getPatientByAbhaId, getTreatmentsByPatientId, saveTreatment } from '@/lib/data';
import { searchConditions, getConditionsByTreatmentType } from '@/lib/traditional-medicine';
import { Patient, Treatment } from '@/types';
import { TraditionalMedicineCondition } from '@/lib/traditional-medicine';

export default function PatientLookupPage() {
  const router = useRouter();
  const [abhaId, setAbhaId] = useState('');
  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showTreatmentForm, setShowTreatmentForm] = useState(false);
  const [showTreatmentHistory, setShowTreatmentHistory] = useState(false);
  const [treatmentHistory, setTreatmentHistory] = useState<Treatment[]>([]);
  const [selectedCondition, setSelectedCondition] = useState<TraditionalMedicineCondition | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [treatmentType, setTreatmentType] = useState('');
  const [availableConditions, setAvailableConditions] = useState<TraditionalMedicineCondition[]>([]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setPatient(null);

    if (abhaId.length !== 14) {
      setError('Please enter a valid 14-digit ABHA ID');
      setLoading(false);
      return;
    }

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    const foundPatient = getPatientByAbhaId(abhaId);
    if (foundPatient) {
      setPatient(foundPatient);
      // Load treatment history
      const history = getTreatmentsByPatientId(abhaId);
      setTreatmentHistory(history);
    } else {
      setError('No patient found with the provided ABHA ID');
    }

    setLoading(false);
  };

  const handleAddTreatment = () => {
    setShowTreatmentForm(true);
    setSelectedCondition(null);
    setSearchQuery('');
    setTreatmentType('');
    setAvailableConditions([]);
  };

  const handleViewHistory = () => {
    setShowTreatmentHistory(true);
  };

  const handleTreatmentTypeChange = (type: string) => {
    setTreatmentType(type);
    if (type === 'traditional') {
      setAvailableConditions(getConditionsByTreatmentType('traditional'));
    } else if (type === 'modern') {
      setAvailableConditions(getConditionsByTreatmentType('modern'));
    } else {
      setAvailableConditions(getConditionsByTreatmentType(type));
    }
    setSelectedCondition(null);
    setSearchQuery('');
  };

  const handleConditionSearch = (query: string) => {
    setSearchQuery(query);
    if (treatmentType) {
      const filtered = searchConditions(query, treatmentType);
      setAvailableConditions(filtered);
    }
  };

  const handleConditionSelect = (condition: TraditionalMedicineCondition) => {
    setSelectedCondition(condition);
  };

  const handleTreatmentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCondition || !patient) return;

    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const newTreatment: Treatment = {
      id: `TREAT-${Date.now()}`,
      patientId: patient.abhaId.replace(/-/g, ''),
      type: treatmentType,
      condition: selectedCondition.condition_name,
      traditionalName: selectedCondition.traditional_name,
      details: formData.get('details') as string,
      namasteCode: selectedCondition.namaste_code,
      icd11Code: selectedCondition.icd11_code,
      symptoms: selectedCondition.symptoms,
      additionalSymptoms: (formData.get('additionalSymptoms') as string)?.split(',').map(s => s.trim()).filter(s => s),
      cause: selectedCondition.ayurveda_cause || selectedCondition.siddha_cause || selectedCondition.unani_cause || selectedCondition.modern_cause,
      date: new Date().toISOString().split('T')[0],
      doctor: 'Dr. Current User',
      paymentType: formData.get('paymentType') as 'paid' | 'insurance',
      admissionDays: parseInt(formData.get('admissionDays') as string) || 0,
      amount: parseInt(formData.get('amount') as string) || 0,
      status: 'active'
    };

    saveTreatment(newTreatment);
    
    // Update treatment history
    const updatedHistory = [...treatmentHistory, newTreatment];
    setTreatmentHistory(updatedHistory);

    alert('Treatment record saved successfully!');
    setShowTreatmentForm(false);
    
    // Refresh the page to show updated data
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link href="/hospital-dashboard" className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xl">N</span>
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">NAMASTE</h1>
                  <p className="text-sm text-gray-600">Patient Lookup</p>
                </div>
              </Link>
            </div>

            <div className="flex items-center space-x-4">
              <Link href="/hospital-dashboard" className="btn-secondary">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Form */}
        <div className="card mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Search Patient</h2>
          <form onSubmit={handleSearch} className="flex gap-4">
            <div className="flex-1">
              <label htmlFor="abhaId" className="form-label">
                ABHA ID
              </label>
              <input
                id="abhaId"
                type="text"
                value={abhaId}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '');
                  if (value.length <= 14) {
                    setAbhaId(value);
                  }
                }}
                placeholder="Enter 14-digit ABHA ID"
                maxLength={14}
                className="form-input"
                required
              />
            </div>
            <div className="flex items-end">
              <button
                type="submit"
                disabled={loading}
                className="btn-primary"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Searching...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    Search Patient
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Error Message */}
        {error && (
          <div className="card mb-8">
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {error}
              </div>
            </div>
          </div>
        )}

        {/* Patient Information */}
        {patient && (
          <div className="card">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-semibold text-gray-900">{patient.name}</h2>
                <p className="text-gray-600">ABHA ID: {patient.abhaId}</p>
              </div>
              <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                {patient.status}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <div>
                <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">Age</label>
                <p className="text-lg font-semibold text-gray-900">{patient.age} years</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">Gender</label>
                <p className="text-lg font-semibold text-gray-900">{patient.gender}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">Phone</label>
                <p className="text-lg font-semibold text-gray-900">{patient.phone}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">Email</label>
                <p className="text-lg font-semibold text-gray-900">{patient.email}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">Blood Group</label>
                <p className="text-lg font-semibold text-gray-900">{patient.bloodGroup}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">Last Visit</label>
                <p className="text-lg font-semibold text-gray-900">{patient.lastVisit}</p>
              </div>
            </div>

            <div className="space-y-4 mb-8">
              <div>
                <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">Address</label>
                <p className="text-lg font-semibold text-gray-900">{patient.address}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">Emergency Contact</label>
                <p className="text-lg font-semibold text-gray-900">{patient.emergencyContact}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">Allergies</label>
                <p className="text-lg font-semibold text-gray-900">{patient.allergies}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">Medical History</label>
                <p className="text-lg font-semibold text-gray-900">{patient.medicalHistory.join(', ')}</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-4">
              <button onClick={handleAddTreatment} className="btn-primary">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add Treatment
              </button>
              <button onClick={handleViewHistory} className="btn-secondary">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                View History
              </button>
              <button className="btn-secondary">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Update Record
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Enhanced Treatment Form Modal */}
      {showTreatmentForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Add Treatment Record</h2>
              <button
                onClick={() => setShowTreatmentForm(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleTreatmentSubmit} className="space-y-6">
              {/* Treatment Type Selection */}
              <div>
                <label className="form-label">Treatment Type</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <button
                    type="button"
                    onClick={() => handleTreatmentTypeChange('traditional')}
                    className={`p-4 border-2 rounded-lg text-center transition-all ${
                      treatmentType === 'traditional'
                        ? 'border-primary-600 bg-primary-50 text-primary-700'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <div className="font-semibold">Traditional</div>
                    <div className="text-sm text-gray-500">Ayurveda, Siddha, Unani</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleTreatmentTypeChange('modern')}
                    className={`p-4 border-2 rounded-lg text-center transition-all ${
                      treatmentType === 'modern'
                        ? 'border-primary-600 bg-primary-50 text-primary-700'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <div className="font-semibold">Modern</div>
                    <div className="text-sm text-gray-500">Allopathic Medicine</div>
                  </button>
                </div>
              </div>

              {/* Condition Search and Selection */}
              {treatmentType && (
                <div>
                  <label className="form-label">Search Condition</label>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => handleConditionSearch(e.target.value)}
                    className="form-input"
                    placeholder="Search for conditions..."
                  />
                  
                  {availableConditions.length > 0 && (
                    <div className="mt-2 max-h-48 overflow-y-auto border border-gray-200 rounded-lg">
                      {availableConditions.map((condition) => (
                        <div
                          key={condition.namaste_code}
                          onClick={() => handleConditionSelect(condition)}
                          className={`p-3 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${
                            selectedCondition?.namaste_code === condition.namaste_code ? 'bg-primary-50' : ''
                          }`}
                        >
                          <div className="font-semibold">{condition.condition_name}</div>
                          <div className="text-sm text-gray-600">{condition.traditional_name}</div>
                          <div className="text-xs text-gray-500">
                            {condition.namaste_code} | {condition.icd11_code}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Auto-filled Condition Details */}
              {selectedCondition && (
                <div className="bg-gray-50 p-4 rounded-lg space-y-4">
                  <h3 className="font-semibold text-gray-900">Selected Condition Details</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Condition</label>
                      <p className="font-semibold">{selectedCondition.condition_name}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Traditional Name</label>
                      <p className="font-semibold">{selectedCondition.traditional_name}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">NAMASTE Code</label>
                      <p className="font-semibold">{selectedCondition.namaste_code}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">ICD-11 Code</label>
                      <p className="font-semibold">{selectedCondition.icd11_code}</p>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-500">Symptoms</label>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {selectedCondition.symptoms.map((symptom, index) => (
                        <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                          {symptom}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-500">Cause</label>
                    <p className="text-sm">{selectedCondition.ayurveda_cause || selectedCondition.siddha_cause || selectedCondition.unani_cause || selectedCondition.modern_cause}</p>
                  </div>
                </div>
              )}

              {/* Additional Symptoms */}
              <div>
                <label className="form-label">Additional Symptoms (comma-separated)</label>
                <input
                  type="text"
                  name="additionalSymptoms"
                  className="form-input"
                  placeholder="Enter additional symptoms if any"
                />
              </div>

              {/* Treatment Details */}
              <div>
                <label className="form-label">Treatment Details</label>
                <textarea
                  name="details"
                  className="form-input"
                  rows={4}
                  placeholder="Enter treatment details"
                  required
                />
              </div>

              {/* Payment and Admission Details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="form-label">Payment Type</label>
                  <select name="paymentType" className="form-input" required>
                    <option value="">Select Payment Type</option>
                    <option value="paid">Paid</option>
                    <option value="insurance">Insurance</option>
                  </select>
                </div>

                <div>
                  <label className="form-label">Admission Days</label>
                  <input
                    type="number"
                    name="admissionDays"
                    min="0"
                    className="form-input"
                    placeholder="0"
                  />
                </div>

                <div>
                  <label className="form-label">Amount (₹)</label>
                  <input
                    type="number"
                    name="amount"
                    min="0"
                    className="form-input"
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setShowTreatmentForm(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn-primary"
                  disabled={!selectedCondition}
                >
                  Save Treatment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Treatment History Modal */}
      {showTreatmentHistory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-4xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Treatment History</h2>
              <button
                onClick={() => setShowTreatmentHistory(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              {treatmentHistory.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No treatment history found for this patient.
                </div>
              ) : (
                treatmentHistory.map((treatment) => (
                  <div key={treatment.id} className="border border-gray-200 rounded-lg p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{treatment.condition}</h3>
                        {treatment.traditionalName && (
                          <p className="text-gray-600">{treatment.traditionalName}</p>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          treatment.status === 'completed' 
                            ? 'bg-green-100 text-green-800'
                            : treatment.status === 'active'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {treatment.status.toUpperCase()}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          treatment.paymentType === 'paid' 
                            ? 'bg-green-100 text-green-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {treatment.paymentType.toUpperCase()}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <label className="text-sm font-medium text-gray-500">Treatment Type</label>
                        <p className="font-semibold capitalize">{treatment.type}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Doctor</label>
                        <p className="font-semibold">{treatment.doctor}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Date</label>
                        <p className="font-semibold">{treatment.date}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      {treatment.namasteCode && (
                        <div>
                          <label className="text-sm font-medium text-gray-500">NAMASTE Code</label>
                          <p className="font-semibold">{treatment.namasteCode}</p>
                        </div>
                      )}
                      {treatment.icd11Code && (
                        <div>
                          <label className="text-sm font-medium text-gray-500">ICD-11 Code</label>
                          <p className="font-semibold">{treatment.icd11Code}</p>
                        </div>
                      )}
                    </div>

                    <div className="mb-4">
                      <label className="text-sm font-medium text-gray-500">Symptoms</label>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {treatment.symptoms.map((symptom, index) => (
                          <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                            {symptom}
                          </span>
                        ))}
                        {treatment.additionalSymptoms?.map((symptom, index) => (
                          <span key={index} className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">
                            {symptom}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="mb-4">
                      <label className="text-sm font-medium text-gray-500">Treatment Details</label>
                      <p className="text-sm">{treatment.details}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {treatment.admissionDays && treatment.admissionDays > 0 && (
                        <div>
                          <label className="text-sm font-medium text-gray-500">Admission Days</label>
                          <p className="font-semibold">{treatment.admissionDays} days</p>
                        </div>
                      )}
                      {treatment.amount && treatment.amount > 0 && (
                        <div>
                          <label className="text-sm font-medium text-gray-500">Amount</label>
                          <p className="font-semibold">₹{treatment.amount.toLocaleString()}</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
