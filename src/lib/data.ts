import { Claim, Patient, Treatment, Notification } from '@/types';

export const samplePatients: Record<string, Patient> = {
  '12345678901234': {
    name: 'Rajesh Kumar',
    abhaId: '12-3456-7890-1234',
    age: 45,
    gender: 'Male',
    phone: '+91 98765 43210',
    email: 'rajesh.kumar@email.com',
    address: '123 Main Street, Delhi, 110001',
    emergencyContact: 'Sunita Kumar (+91 98765 43211)',
    bloodGroup: 'B+',
    allergies: 'None',
    medicalHistory: ['Diabetes Type 2', 'Hypertension'],
    lastVisit: '2025-01-15',
    status: 'Active'
  },
  '98765432109876': {
    name: 'Priya Sharma',
    abhaId: '98-7654-3210-9876',
    age: 32,
    gender: 'Female',
    phone: '+91 87654 32109',
    email: 'priya.sharma@email.com',
    address: '456 Park Avenue, Mumbai, 400001',
    emergencyContact: 'Amit Sharma (+91 87654 32110)',
    bloodGroup: 'O+',
    allergies: 'Penicillin',
    medicalHistory: ['Asthma', 'Migraine'],
    lastVisit: '2025-01-10',
    status: 'Active'
  }
};

export const sampleClaims: Claim[] = [
  {
    id: 'CLM-2025-001',
    patientName: 'Rajesh Kumar',
    abhaId: '12-3456-7890-1234',
    condition: 'Diabetes Management',
    hospital: 'AIIMS Delhi',
    claimAmount: 12500,
    claimAmountFormatted: '₹12,500',
    submissionDate: '2025-09-12',
    status: 'pending',
    urgency: 'medium',
    doctor: 'Dr. Alok Singh',
    policyNumber: 'POL-2023-456789'
  },
  {
    id: 'CLM-2025-002',
    patientName: 'Priya Sharma',
    abhaId: '98-7654-3210-9876',
    condition: 'Ayurvedic Panchakarma',
    hospital: 'Kerala Ayurveda Center',
    claimAmount: 25000,
    claimAmountFormatted: '₹25,000',
    submissionDate: '2025-09-11',
    status: 'pending',
    urgency: 'low',
    doctor: 'Dr. Priya Vaidya',
    policyNumber: 'POL-2023-123456'
  },
  {
    id: 'CLM-2025-003',
    patientName: 'Amit Patel',
    abhaId: '45-6789-0123-4567',
    condition: 'Cardiac Surgery',
    hospital: 'Fortis Hospital',
    claimAmount: 150000,
    claimAmountFormatted: '₹1,50,000',
    submissionDate: '2025-09-10',
    status: 'pending',
    urgency: 'low',
    doctor: 'Dr. Ramesh Gupta',
    policyNumber: 'POL-2023-789012'
  },
  {
    id: 'CLM-2025-004',
    patientName: 'Rajesh Kumar',
    abhaId: '12345678901234',
    condition: 'Ayurvedic Treatment',
    hospital: 'Ayurveda Center',
    claimAmount: 8000,
    claimAmountFormatted: '₹8,000',
    submissionDate: '2025-09-09',
    status: 'approved',
    urgency: 'low',
    doctor: 'Dr. Lakshmi Devi',
    policyNumber: 'POL-2023-345678'
  },
  {
    id: 'CLM-2025-005',
    patientName: 'Vikram Singh',
    abhaId: '98765432109876',
    condition: 'Physiotherapy',
    hospital: 'Rehab Center',
    claimAmount: 5000,
    claimAmountFormatted: '₹5,000',
    submissionDate: '2025-09-08',
    status: 'rejected',
    urgency: 'low',
    doctor: 'Dr. Anjali Mehta',
    policyNumber: 'POL-2023-901234'
  }
];

export const sampleNotifications: Notification[] = [
  { id: 1, message: 'New claim submitted by Apollo Hospital', time: '10 min ago', type: 'info' },
  { id: 2, message: 'High-value claim requires manual review', time: '1 hour ago', type: 'warning' },
  { id: 3, message: 'Claim CLM-2025-001 approved for payment', time: '2 hours ago', type: 'success' }
];

export const getPatientByAbhaId = (abhaId: string): Patient | null => {
  return samplePatients[abhaId] || null;
};

export const getClaims = (): Claim[] => {
  if (typeof window !== 'undefined') {
    const savedClaims = localStorage.getItem('insuranceClaims');
    if (savedClaims) {
      return JSON.parse(savedClaims);
    } else {
      // Initialize localStorage with sample data if empty
      localStorage.setItem('insuranceClaims', JSON.stringify(sampleClaims));
      return sampleClaims;
    }
  }
  return sampleClaims;
};

export const saveClaims = (claims: Claim[]) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('insuranceClaims', JSON.stringify(claims));
  }
};

export const getNotifications = (): Notification[] => {
  return sampleNotifications;
};

export const sampleTreatments: Treatment[] = [
  {
    id: 'TREAT-001',
    patientId: '12345678901234',
    type: 'ayurvedic',
    condition: 'High Fever',
    traditionalName: 'Jwara (ज्वर)',
    details: 'Ayurvedic treatment for high fever with herbal medicines',
    namasteCode: 'SAT-E.A.001',
    icd11Code: '1C62.Z0',
    symptoms: ['High temperature', 'Sweating', 'Body aches'],
    additionalSymptoms: ['Headache'],
    cause: 'Pitta-Vata imbalance',
    date: '2025-01-15',
    doctor: 'Dr. Rajesh Vaidya',
    paymentType: 'paid',
    admissionDays: 3,
    amount: 2500,
    status: 'completed'
  },
  {
    id: 'TREAT-002',
    patientId: '12345678901234',
    type: 'panchakarma',
    condition: 'Digestive Disorder',
    traditionalName: 'Grahani (ग्रहणी)',
    details: 'Panchakarma treatment for digestive issues',
    namasteCode: 'SAT-E.A.006',
    icd11Code: 'DD90',
    symptoms: ['Abdominal pain', 'Bloating', 'Indigestion'],
    cause: 'Agni (digestive fire) imbalance',
    date: '2025-01-10',
    doctor: 'Dr. Priya Sharma',
    paymentType: 'insurance',
    admissionDays: 7,
    amount: 15000,
    status: 'active'
  },
  {
    id: 'TREAT-003',
    patientId: '98765432109876',
    type: 'yoga',
    condition: 'Mental Stress',
    traditionalName: 'Manasika Vikara (मानसिक विकार)',
    details: 'Yoga therapy for stress management',
    namasteCode: 'SAT-E.A.008',
    icd11Code: '6A70',
    symptoms: ['Anxiety', 'Depression', 'Insomnia'],
    cause: 'Rajas and Tamas gunas imbalance',
    date: '2025-01-12',
    doctor: 'Dr. Amit Kumar',
    paymentType: 'paid',
    admissionDays: 0,
    amount: 5000,
    status: 'completed'
  }
];

export const getTreatmentsByPatientId = (patientId: string): Treatment[] => {
  if (typeof window !== 'undefined') {
    const savedTreatments = localStorage.getItem('patientTreatments');
    const treatments = savedTreatments ? JSON.parse(savedTreatments) : sampleTreatments;
    return treatments.filter((treatment: Treatment) => treatment.patientId === patientId);
  }
  return sampleTreatments.filter(treatment => treatment.patientId === patientId);
};

export const saveTreatment = (treatment: Treatment) => {
  if (typeof window !== 'undefined') {
    const savedTreatments = localStorage.getItem('patientTreatments');
    const treatments = savedTreatments ? JSON.parse(savedTreatments) : sampleTreatments;
    treatments.push(treatment);
    localStorage.setItem('patientTreatments', JSON.stringify(treatments));
    
    // Auto-generate claim for insurance treatments
    if (treatment.paymentType === 'insurance' && treatment.amount && treatment.amount > 0) {
      // Get patient name from ABHA ID
      const patient = getPatientByAbhaId(treatment.patientId);
      const patientName = patient ? patient.name : 'Unknown Patient';
      
      const newClaim: Claim = {
        id: `CLM-${Date.now()}`,
        patientName: patientName,
        abhaId: treatment.patientId,
        condition: treatment.condition,
        hospital: 'Current Hospital',
        claimAmount: treatment.amount,
        claimAmountFormatted: `₹${treatment.amount.toLocaleString()}`,
        submissionDate: treatment.date,
        status: 'pending',
        urgency: 'low',
        doctor: treatment.doctor,
        policyNumber: `POL-${Date.now()}`
      };
      
      const savedClaims = localStorage.getItem('insuranceClaims');
      const claims = savedClaims ? JSON.parse(savedClaims) : sampleClaims;
      claims.push(newClaim);
      localStorage.setItem('insuranceClaims', JSON.stringify(claims));
    }
  }
};

export const updateTreatment = (treatmentId: string, updates: Partial<Treatment>) => {
  if (typeof window !== 'undefined') {
    const savedTreatments = localStorage.getItem('patientTreatments');
    const treatments = savedTreatments ? JSON.parse(savedTreatments) : sampleTreatments;
    const updatedTreatments = treatments.map((t: Treatment) => 
      t.id === treatmentId ? { ...t, ...updates } : t
    );
    localStorage.setItem('patientTreatments', JSON.stringify(updatedTreatments));
  }
};

export const getApprovedAmountToday = (): number => {
  if (typeof window !== 'undefined') {
    const approvedToday = localStorage.getItem('approvedAmountToday');
    return approvedToday ? parseFloat(approvedToday) : 0;
  }
  return 0;
};

export const addApprovedAmount = (amount: number) => {
  if (typeof window !== 'undefined') {
    const currentAmount = getApprovedAmountToday();
    const newAmount = currentAmount + amount;
    localStorage.setItem('approvedAmountToday', newAmount.toString());
  }
};

export const getTotalClaimsAmount = (): number => {
  if (typeof window !== 'undefined') {
    const savedClaims = localStorage.getItem('insuranceClaims');
    const claims = savedClaims ? JSON.parse(savedClaims) : sampleClaims;
    return claims.reduce((total: number, claim: Claim) => total + claim.claimAmount, 0);
  }
  return sampleClaims.reduce((total, claim) => total + claim.claimAmount, 0);
};

export const resetApprovedAmountDaily = () => {
  if (typeof window !== 'undefined') {
    const lastReset = localStorage.getItem('lastApprovedReset');
    const today = new Date().toDateString();
    
    if (lastReset !== today) {
      localStorage.setItem('approvedAmountToday', '0');
      localStorage.setItem('lastApprovedReset', today);
    }
  }
};

export const getClaimsByPatientId = (patientId: string): Claim[] => {
  if (typeof window !== 'undefined') {
    const savedClaims = localStorage.getItem('insuranceClaims');
    const claims = savedClaims ? JSON.parse(savedClaims) : sampleClaims;
    return claims.filter((claim: Claim) => claim.abhaId === patientId);
  }
  return sampleClaims.filter(claim => claim.abhaId === patientId);
};

export const removeClaim = (claimId: string) => {
  if (typeof window !== 'undefined') {
    const savedClaims = localStorage.getItem('insuranceClaims');
    const claims = savedClaims ? JSON.parse(savedClaims) : sampleClaims;
    const updatedClaims = claims.filter((claim: Claim) => claim.id !== claimId);
    localStorage.setItem('insuranceClaims', JSON.stringify(updatedClaims));
  }
};
