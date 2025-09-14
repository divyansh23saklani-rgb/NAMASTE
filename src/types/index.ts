export interface User {
  providerType: 'hospital' | 'insurance';
  providerId: string;
  providerName: string;
  loginTime: string;
}

export interface Patient {
  name: string;
  abhaId: string;
  age: number;
  gender: string;
  phone: string;
  email: string;
  address: string;
  emergencyContact: string;
  bloodGroup: string;
  allergies: string;
  medicalHistory: string[];
  lastVisit: string;
  status: string;
}

export interface Claim {
  id: string;
  patientName: string;
  abhaId: string;
  condition: string;
  hospital: string;
  claimAmount: number;
  claimAmountFormatted: string;
  submissionDate: string;
  status: 'pending' | 'approved' | 'rejected';
  urgency: 'low' | 'medium' | 'high';
  doctor: string;
  policyNumber: string;
}

export interface Treatment {
  id: string;
  patientId: string;
  type: string;
  condition: string;
  traditionalName?: string;
  details: string;
  namasteCode?: string;
  icd11Code?: string;
  symptoms: string[];
  additionalSymptoms?: string[];
  cause: string;
  date: string;
  doctor: string;
  paymentType: 'paid' | 'insurance';
  admissionDays?: number;
  amount?: number;
  status: 'active' | 'completed' | 'cancelled';
}

export interface Notification {
  id: number;
  message: string;
  time: string;
  type: 'info' | 'warning' | 'success' | 'error';
}
