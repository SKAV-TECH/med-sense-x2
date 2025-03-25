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
