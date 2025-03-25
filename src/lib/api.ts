
// Add a function to truncate AI responses to approximately 50 words
export const truncateResponse = (text: string, wordLimit: number = 50, detailedMode: boolean = false): string => {
  if (detailedMode) return text;
  
  const words = text.split(/\s+/);
  if (words.length <= wordLimit) return text;
  
  return words.slice(0, wordLimit).join(' ') + '... [truncated for brevity]';
};

// Modify existing API methods to use the truncation function
export const analyzeMedicalImage = async (
  image: File, 
  prompt: string,
  detailedMode: boolean = false
): Promise<string> => {
  // Mock API call
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Simulate AI response
  const response = `The image shows early signs of macular degeneration, characterized by small yellow deposits under the retina called drusen. These are visible as small yellowish spots in the central part of the retina. The condition appears to be in its early (dry) stage. No signs of wet macular degeneration or retinal hemorrhages are present. The optic disc and blood vessels appear normal. Regular monitoring is recommended, along with lifestyle modifications such as smoking cessation, dietary changes (increased intake of green leafy vegetables, fish rich in omega-3 fatty acids), and possibly AREDS formula supplements depending on the severity. Follow-up with an ophthalmologist in 6 months is advised to monitor for progression.`;
  
  return truncateResponse(response, 50, detailedMode);
};

export const analyzeHealthReport = async (
  report: File,
  detailedMode: boolean = false
): Promise<string> => {
  // Mock API call
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Simulate AI response
  const response = `Based on the uploaded blood test report, several key findings are noted:
  
1. Elevated cholesterol levels (Total: 240 mg/dL, LDL: 160 mg/dL) indicating hypercholesterolemia
2. Slightly elevated blood glucose (110 mg/dL) suggesting pre-diabetic condition
3. Normal complete blood count values within reference ranges
4. Liver function tests within normal limits
5. Normal kidney function (creatinine: 0.9 mg/dL, BUN: 15 mg/dL)

Recommendations:
- Dietary modifications to reduce saturated fat and increase fiber intake
- Regular exercise (150 minutes moderate activity weekly)
- Blood glucose monitoring
- Follow-up lipid panel in 3 months
- Consider statin therapy if lifestyle modifications don't improve cholesterol levels within 6 months`;
  
  return truncateResponse(response, 50, detailedMode);
};

// Add missing API methods
export const analyzeMedication = async (
  medicationName: string,
  patientInfo: string = "",
  detailedMode: boolean = false
): Promise<string> => {
  // Mock API call
  await new Promise(resolve => setTimeout(resolve, 1800));
  
  // Simulate AI response
  const response = `${medicationName} is commonly prescribed for treating hypertension and certain cardiovascular conditions. It works by relaxing blood vessels to improve blood flow. Common side effects include dizziness, headache, and mild fatigue. Precautions are necessary for patients with kidney disease, pregnancy, or certain allergies. Drug interactions may occur with NSAIDs, potassium supplements, and certain antidepressants. The typical dosage ranges from 10-40mg daily based on patient response and condition severity. It's important to take this medication consistently at the same time each day. Regular blood pressure monitoring is recommended while using this medication. Avoid sudden discontinuation without medical advice.`;
  
  return truncateResponse(response, 50, detailedMode);
};

export const analyzePrescriptionImage = async (
  image: File,
  detailedMode: boolean = false
): Promise<string> => {
  // Mock API call
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Simulate AI response
  const response = `The prescription image shows three medications: 
1. Lisinopril 10mg - Take one tablet daily for blood pressure
2. Metformin 500mg - Take one tablet twice daily with meals for diabetes management
3. Atorvastatin 20mg - Take one tablet at bedtime for cholesterol

Important notes: All medications are to be taken for 30 days with 2 refills authorized. The prescribing physician is Dr. Smith. Patient should schedule a follow-up appointment in 3 months for medication review. Contact the physician if any side effects occur such as persistent cough, dizziness, muscle pain, or gastrointestinal discomfort.`;
  
  return truncateResponse(response, 50, detailedMode);
};

export const generateTreatmentPlan = async (
  patientInfo: string,
  symptoms: string,
  medicalHistory: string = "",
  detailedMode: boolean = false
): Promise<string> => {
  // Mock API call
  await new Promise(resolve => setTimeout(resolve, 2500));
  
  // Simulate AI response
  const response = `Based on the patient information and symptoms described, the recommended treatment plan is:

1. Medication:
   - Amoxicillin 500mg, three times daily for 10 days to address the bacterial infection
   - Acetaminophen 500mg every 6 hours as needed for pain and fever

2. Diagnostic Tests:
   - Complete Blood Count to assess infection severity
   - Chest X-ray to rule out pneumonia
   - Follow-up culture if symptoms persist after 3 days

3. Lifestyle Recommendations:
   - Rest for 48-72 hours
   - Increased fluid intake (minimum 2-3 liters daily)
   - Avoid strenuous activity for one week

4. Follow-up:
   - Virtual check-in after 3 days
   - In-person follow-up in 2 weeks if symptoms resolved
   - Immediate contact if shortness of breath, high fever (>102°F), or severe pain develops

5. Additional Considerations:
   - Monitor for medication side effects, especially gastrointestinal discomfort
   - Possible referral to specialist if symptoms do not improve within expected timeframe`;
  
  return truncateResponse(response, 50, detailedMode);
};

export const searchYouTubeVideos = async (
  query: string
): Promise<any[]> => {
  // Mock API call
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Simulate YouTube search results
  return [
    {
      id: "video1",
      title: `Understanding ${query}: A Medical Perspective`,
      description: "This video explains the medical aspects and latest research about this condition.",
      thumbnail: "https://placehold.co/320x180/6D28D9/FFFFFF.png?text=Medical+Video",
      publishedAt: new Date().toISOString(),
      channelTitle: "MedEd Channel"
    },
    {
      id: "video2",
      title: `Living with ${query}: Patient Stories`,
      description: "Real patients share their experiences and coping strategies.",
      thumbnail: "https://placehold.co/320x180/2563EB/FFFFFF.png?text=Patient+Stories",
      publishedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      channelTitle: "Health & Wellness"
    },
    {
      id: "video3",
      title: `Latest Treatments for ${query}`,
      description: "Medical experts discuss cutting-edge treatments and therapies.",
      thumbnail: "https://placehold.co/320x180/DC2626/FFFFFF.png?text=Treatments",
      publishedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
      channelTitle: "Medical Innovations"
    }
  ];
};

export const summarizeYouTubeVideo = async (
  videoId: string,
  videoTitle: string,
  detailedMode: boolean = false
): Promise<string> => {
  // Mock API call
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Simulate AI response
  const response = `This educational video provides a comprehensive overview of the condition and its management. The presenter, Dr. Johnson, begins by explaining the pathophysiology using clear diagrams and animations. Key points covered include common symptoms, risk factors, and diagnostic criteria. The second segment discusses evidence-based treatment options, comparing medication efficacy with lifestyle modifications. Patient testimonials are included to illustrate real-world experiences. The video concludes with practical advice for daily management and when to seek medical attention. Overall, this is an informative resource suitable for both patients and healthcare professionals, though some medical terminology may be challenging for general audiences.`;
  
  return truncateResponse(response, 50, detailedMode);
};

export const getRecommendedVideos = async (
  recentActivities: string[]
): Promise<any[]> => {
  // Mock API call
  await new Promise(resolve => setTimeout(resolve, 1800));
  
  // Generate some keywords from recent activities
  const keywords = recentActivities.join(" ").split(" ").filter(word => word.length > 4);
  const randomKeyword = keywords.length > 0 
    ? keywords[Math.floor(Math.random() * keywords.length)] 
    : "health";
  
  // Simulate recommended videos
  return [
    {
      id: "rec1",
      title: `${randomKeyword} - Understanding Your Health`,
      description: "A comprehensive guide to understanding this important health topic.",
      thumbnail: "https://placehold.co/320x180/059669/FFFFFF.png?text=Recommended",
      publishedAt: new Date().toISOString(),
      channelTitle: "Health Insights"
    },
    {
      id: "rec2",
      title: `Doctor's Guide to ${randomKeyword}`,
      description: "Medical professionals explain everything you need to know.",
      thumbnail: "https://placehold.co/320x180/0284C7/FFFFFF.png?text=Doctor+Guide",
      publishedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      channelTitle: "Medical Channel"
    },
    {
      id: "rec3",
      title: `Latest Research on ${randomKeyword}`,
      description: "New studies and findings that could impact your health decisions.",
      thumbnail: "https://placehold.co/320x180/9333EA/FFFFFF.png?text=Research",
      publishedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      channelTitle: "Science of Medicine"
    }
  ];
};
