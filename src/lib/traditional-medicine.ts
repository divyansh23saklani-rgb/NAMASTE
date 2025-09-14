export interface TraditionalMedicineCondition {
  condition_name: string;
  traditional_name: string;
  namaste_code: string;
  icd11_code: string;
  symptoms: string[];
  ayurveda_cause?: string;
  siddha_cause?: string;
  unani_cause?: string;
  modern_cause: string;
  treatment_type: 'ayurveda' | 'siddha' | 'unani' | 'modern';
}

export const traditionalMedicineDatabase: TraditionalMedicineCondition[] = [
  {
    condition_name: "High Fever",
    traditional_name: "Jwara (ज्वर)",
    namaste_code: "SAT-E.A.001",
    icd11_code: "1C62.Z0",
    symptoms: ["High temperature", "Sweating", "Body aches", "Headache", "Chills"],
    ayurveda_cause: "Pitta-Vata imbalance",
    modern_cause: "Viral or bacterial infection",
    treatment_type: "ayurveda"
  },
  {
    condition_name: "Diabetes",
    traditional_name: "Madhumeha (मधुमेह)",
    namaste_code: "SAT-E.A.002",
    icd11_code: "5A10",
    symptoms: ["Excessive thirst", "Frequent urination", "Weight loss", "Fatigue", "Blurred vision"],
    ayurveda_cause: "Kapha-Pitta imbalance affecting medas dhatu",
    modern_cause: "Insulin resistance or deficiency",
    treatment_type: "ayurveda"
  },
  {
    condition_name: "Hypertension",
    traditional_name: "Rakta Vata (रक्त वात)",
    namaste_code: "SAT-E.A.003",
    icd11_code: "BA00",
    symptoms: ["High blood pressure", "Headache", "Dizziness", "Chest pain", "Shortness of breath"],
    ayurveda_cause: "Vata imbalance affecting circulation",
    modern_cause: "Arterial stiffness and vascular resistance",
    treatment_type: "ayurveda"
  },
  {
    condition_name: "Asthma",
    traditional_name: "Tamaka Shwasa (तमक श्वास)",
    namaste_code: "SAT-E.A.004",
    icd11_code: "CA23",
    symptoms: ["Wheezing", "Shortness of breath", "Chest tightness", "Coughing", "Difficulty breathing"],
    ayurveda_cause: "Kapha-Vata imbalance in pranavaha srotas",
    modern_cause: "Airway inflammation and bronchospasm",
    treatment_type: "ayurveda"
  },
  {
    condition_name: "Arthritis",
    traditional_name: "Amavata (आमवात)",
    namaste_code: "SAT-E.A.005",
    icd11_code: "FA20",
    symptoms: ["Joint pain", "Swelling", "Stiffness", "Reduced mobility", "Morning stiffness"],
    ayurveda_cause: "Ama (toxins) accumulation in joints with Vata imbalance",
    modern_cause: "Joint inflammation and cartilage degeneration",
    treatment_type: "ayurveda"
  },
  {
    condition_name: "Digestive Disorder",
    traditional_name: "Grahani (ग्रहणी)",
    namaste_code: "SAT-E.A.006",
    icd11_code: "DD90",
    symptoms: ["Abdominal pain", "Bloating", "Indigestion", "Nausea", "Irregular bowel movements"],
    ayurveda_cause: "Agni (digestive fire) imbalance",
    modern_cause: "Gastrointestinal dysfunction",
    treatment_type: "ayurveda"
  },
  {
    condition_name: "Skin Disease",
    traditional_name: "Kushtha (कुष्ठ)",
    namaste_code: "SAT-E.A.007",
    icd11_code: "EA90",
    symptoms: ["Skin rash", "Itching", "Redness", "Scaling", "Inflammation"],
    ayurveda_cause: "Tridosha imbalance affecting twak (skin)",
    modern_cause: "Immune system dysfunction or infection",
    treatment_type: "ayurveda"
  },
  {
    condition_name: "Mental Stress",
    traditional_name: "Manasika Vikara (मानसिक विकार)",
    namaste_code: "SAT-E.A.008",
    icd11_code: "6A70",
    symptoms: ["Anxiety", "Depression", "Insomnia", "Irritability", "Poor concentration"],
    ayurveda_cause: "Rajas and Tamas gunas imbalance",
    modern_cause: "Neurochemical imbalance and stress response",
    treatment_type: "ayurveda"
  },
  {
    condition_name: "Respiratory Infection",
    traditional_name: "Kasa (कास)",
    namaste_code: "SAT-E.A.009",
    icd11_code: "CA40",
    symptoms: ["Cough", "Chest congestion", "Sore throat", "Runny nose", "Fever"],
    ayurveda_cause: "Kapha accumulation in respiratory tract",
    modern_cause: "Viral or bacterial respiratory infection",
    treatment_type: "ayurveda"
  },
  {
    condition_name: "Heart Disease",
    traditional_name: "Hridroga (हृद्रोग)",
    namaste_code: "SAT-E.A.010",
    icd11_code: "BA40",
    symptoms: ["Chest pain", "Shortness of breath", "Palpitations", "Fatigue", "Swelling in legs"],
    ayurveda_cause: "Vata-Pitta imbalance affecting hridaya",
    modern_cause: "Coronary artery disease or heart muscle dysfunction",
    treatment_type: "ayurveda"
  },
  // Siddha Medicine Conditions
  {
    condition_name: "Fever",
    traditional_name: "Jwara (ஜ்வரம்)",
    namaste_code: "SAT-S.A.001",
    icd11_code: "1C62.Z0",
    symptoms: ["High temperature", "Body pain", "Headache", "Chills", "Sweating"],
    siddha_cause: "Pitta-Vata imbalance",
    modern_cause: "Viral or bacterial infection",
    treatment_type: "siddha"
  },
  {
    condition_name: "Diabetes",
    traditional_name: "Madhumeha (மதுமேகம்)",
    namaste_code: "SAT-S.A.002",
    icd11_code: "5A10",
    symptoms: ["Excessive thirst", "Frequent urination", "Weight loss", "Fatigue"],
    siddha_cause: "Kapha-Pitta imbalance",
    modern_cause: "Insulin resistance or deficiency",
    treatment_type: "siddha"
  },
  // Unani Medicine Conditions
  {
    condition_name: "Fever",
    traditional_name: "Humma (حمی)",
    namaste_code: "SAT-U.A.001",
    icd11_code: "1C62.Z0",
    symptoms: ["High temperature", "Body aches", "Headache", "Chills"],
    unani_cause: "Imbalance in Mizaj (temperament)",
    modern_cause: "Viral or bacterial infection",
    treatment_type: "unani"
  },
  {
    condition_name: "Diabetes",
    traditional_name: "Ziabitus (ذیابیطس)",
    namaste_code: "SAT-U.A.002",
    icd11_code: "5A10",
    symptoms: ["Excessive thirst", "Frequent urination", "Weight loss", "Fatigue"],
    unani_cause: "Imbalance in Mizaj affecting kidney function",
    modern_cause: "Insulin resistance or deficiency",
    treatment_type: "unani"
  }
];

export const getConditionsByTreatmentType = (treatmentType: string): TraditionalMedicineCondition[] => {
  if (treatmentType === 'traditional') {
    return traditionalMedicineDatabase.filter(condition => 
      ['ayurveda', 'siddha', 'unani'].includes(condition.treatment_type)
    );
  }
  return traditionalMedicineDatabase.filter(condition => condition.treatment_type === treatmentType);
};

export const searchConditions = (query: string, treatmentType?: string): TraditionalMedicineCondition[] => {
  let conditions = treatmentType ? getConditionsByTreatmentType(treatmentType) : traditionalMedicineDatabase;
  
  if (!query) return conditions;
  
  const lowercaseQuery = query.toLowerCase();
  return conditions.filter(condition =>
    condition.condition_name.toLowerCase().includes(lowercaseQuery) ||
    condition.traditional_name.toLowerCase().includes(lowercaseQuery) ||
    condition.symptoms.some(symptom => symptom.toLowerCase().includes(lowercaseQuery))
  );
};
