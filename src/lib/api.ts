import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the Google Generative AI with the API key
const API_KEY = "AIzaSyDYGHDOEmpCmAwtm2qISLlkyXIK8CZ_0-4";
const genAI = new GoogleGenerativeAI(API_KEY);

// YouTube API key
export const YOUTUBE_API_KEY = "AIzaSyAEXThGL8xrapf_tCW6w4jwOU_EKobyjcY";

// Convert file to base64 format for the Gemini API
export const fileToGenerativePart = async (file: File) => {
  const arrayBuffer = await file.arrayBuffer();
  const base64String = btoa(
    new Uint8Array(arrayBuffer).reduce(
      (data, byte) => data + String.fromCharCode(byte),
      ''
    )
  );
  
  return {
    inlineData: {
      data: base64String,
      mimeType: file.type,
    },
  };
};

// Get the preferred model from local storage or use default
const getPreferredModel = () => {
  return localStorage.getItem('aiModel') || 'gemini-2.0-flash';
};

// Get models using the specified Gemini models
export const getGeminiProModel = () => {
  return genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
};

export const getGemini2Model = () => {
  return genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
};

export const getGemini2FlashModel = () => {
  return genAI.getGenerativeModel({ model: "gemini-2.0-flash-lite" });
};

export const getGeminiVisionModel = () => {
  return genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp-image-generation" });
};

// Function to get the appropriate model based on user settings
const getModelBasedOnPreference = () => {
  const preferredModel = getPreferredModel();
  switch (preferredModel) {
    case 'gemini-1.5-flash':
      return getGeminiProModel();
    case 'gemini-2.0-flash':
      return getGemini2Model();
    case 'gemini-2.0-flash-lite':
      return getGemini2FlashModel();
    default:
      return getGemini2Model();
  }
};

// Function to make content concise
export const makeConcise = async (content: string): Promise<string> => {
  try {
    const model = getModelBasedOnPreference();
    const prompt = `Summarize the following content in exactly 50 words. Be accurate, clear, and straight to the point while preserving the most important information:\n\n${content}`;
    
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error("Error making content concise:", error);
    // Create a manual summary if API fails
    return content.split(' ').slice(0, 50).join(' ') + '...';
  }
};

// Function to analyze medical images
export const analyzeMedicalImage = async (file: File, promptText: string, concise: boolean = false) => {
  try {
    const model = getGemini2Model(); // Always use the vision model for images
    const imagePart = await fileToGenerativePart(file);
    
    const prompt = promptText || 
      "Analyze this medical image in detail. Identify any visible abnormalities, potential diagnoses, severity level (low, medium, high), and recommendations for further tests or treatments. Format the response with clear sections.";
    
    const result = await model.generateContent([prompt, imagePart]);
    const detailedResponse = result.response.text();
    
    // If concise mode is requested, summarize the response
    if (concise) {
      return await makeConcise(detailedResponse);
    }
    
    return detailedResponse;
  } catch (error) {
    console.error("Error analyzing medical image:", error);
    throw new Error("Failed to analyze the medical image. Please try again.");
  }
};

// Function to ask health-related questions
export const askHealthQuestion = async (question: string, concise: boolean = false) => {
  try {
    const model = getModelBasedOnPreference();
    const prompt = `As an AI medical assistant, please help with this health question. Provide informative, evidence-based information, including potential causes, preventive tips, and next steps if applicable. Remember to mention that this is not a substitute for professional medical advice.\n\nQuestion: ${question}`;
    
    const result = await model.generateContent(prompt);
    const detailedResponse = result.response.text();
    
    if (concise) {
      return await makeConcise(detailedResponse);
    }
    
    return detailedResponse;
  } catch (error) {
    console.error("Error asking health question:", error);
    throw new Error("Failed to process your question. Please try again.");
  }
};

// Function to generate personalized treatment plan
export const generateTreatmentPlan = async (patientInfo: string, symptoms: string, medicalHistory: string, concise: boolean = false) => {
  try {
    const model = getModelBasedOnPreference();
    const prompt = `Based on the following patient information, generate a personalized treatment plan with recommendations for medications, lifestyle changes, and follow-up tests. Include a disclaimer about consulting healthcare professionals.\n\nPatient Information: ${patientInfo}\nSymptoms: ${symptoms}\nMedical History: ${medicalHistory}`;
    
    const result = await model.generateContent(prompt);
    const detailedResponse = result.response.text();
    
    if (concise) {
      return await makeConcise(detailedResponse);
    }
    
    return detailedResponse;
  } catch (error) {
    console.error("Error generating treatment plan:", error);
    throw new Error("Failed to generate a treatment plan. Please try again.");
  }
};

// Function to analyze medication safety
export const analyzeMedication = async (medicationName: string, patientInfo?: string, concise: boolean = false) => {
  try {
    const model = getModelBasedOnPreference();
    const patientContext = patientInfo ? `\nPatient Information: ${patientInfo}` : '';
    
    const prompt = `Provide detailed information about this medication including uses, dosage, side effects, contraindications, and potential drug interactions. Format the response with clear sections.${patientContext}\n\nMedication: ${medicationName}`;
    
    const result = await model.generateContent(prompt);
    const detailedResponse = result.response.text();
    
    if (concise) {
      return await makeConcise(detailedResponse);
    }
    
    return detailedResponse;
  } catch (error) {
    console.error("Error analyzing medication:", error);
    throw new Error("Failed to analyze the medication. Please try again.");
  }
};

// Function to analyze prescription image
export const analyzePrescriptionImage = async (file: File, concise: boolean = false) => {
  try {
    const model = getGeminiVisionModel();
    const imagePart = await fileToGenerativePart(file);
    
    const prompt = "Analyze this prescription image. Identify the medications prescribed, dosages, instructions, and any other relevant information. Also note any potential concerns or interactions between the medications.";
    
    const result = await model.generateContent([prompt, imagePart]);
    const detailedResponse = result.response.text();
    
    if (concise) {
      return await makeConcise(detailedResponse);
    }
    
    return detailedResponse;
  } catch (error) {
    console.error("Error analyzing prescription image:", error);
    throw new Error("Failed to analyze the prescription image. Please try again.");
  }
};

// Function to search and summarize YouTube medical videos
export const searchYouTubeVideos = async (query: string, maxResults: number = 5) => {
  try {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(
        "medical " + query
      )}&maxResults=${maxResults}&type=video&key=${YOUTUBE_API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error("YouTube API request failed");
    }
    
    const data = await response.json();
    return data.items.map((item: any) => ({
      id: item.id.videoId,
      title: item.snippet.title,
      description: item.snippet.description,
      thumbnail: item.snippet.thumbnails.medium.url,
      publishedAt: item.snippet.publishedAt,
      channelTitle: item.snippet.channelTitle
    }));
  } catch (error) {
    console.error("Error searching YouTube videos:", error);
    throw new Error("Failed to search for relevant videos. Please try again.");
  }
};

// Updated function to summarize YouTube videos - removed the videoUrl parameter
export const summarizeYouTubeVideo = async (videoId: string, videoTitle: string, concise: boolean = false) => {
  try {
    const model = getGemini2FlashModel();
    
    // Create a more detailed prompt that includes the video data for better summaries
    const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
    const prompt = `Summarize the key medical information from this YouTube video titled "${videoTitle}" (${videoUrl}). 
    Format your response with proper headings, bullet points, and paragraphs for readability.
    Break down the key medical concepts, treatments, and advice mentioned in this video.
    Avoid using markdown formatting like **, ##, or \`\`\` in your response - use proper HTML formatting instead.
    Use <h3> for section headings, <b> for important terms, <ul><li> for bullet points, and <p> for paragraphs.`;
    
    const result = await model.generateContent(prompt);
    const detailedResponse = result.response.text();
    
    if (concise) {
      return await makeConcise(detailedResponse);
    }
    
    return detailedResponse;
  } catch (error) {
    console.error("Error summarizing YouTube video:", error);
    throw new Error("Failed to summarize the video content. Please try again.");
  }
};

export const analyzeHealthReport = async (file: File, concise: boolean = false) => {
  try {
    // For PDFs and DOCXs, we'll extract text if possible or analyze as an image
    const model = getGemini2Model(); // Use Gemini 2.0 Flash for health reports
    const imagePart = await fileToGenerativePart(file);
    
    const prompt = "Analyze this medical report. Provide a comprehensive summary including key findings, diagnoses, causes, recommended immediate care, treatment plans, and follow-up actions. Format the response with clear sections.";
    
    const result = await model.generateContent([prompt, imagePart]);
    const detailedResponse = result.response.text();
    
    if (concise) {
      return await makeConcise(detailedResponse);
    }
    
    return detailedResponse;
  } catch (error) {
    console.error("Error analyzing health report:", error);
    throw new Error("Failed to analyze the health report. Please try again.");
  }
};

export const getMedicationRecommendations = async (symptoms: string, allergies: string = "", currentMedications: string = "", concise: boolean = false) => {
  try {
    const model = getModelBasedOnPreference();
    const prompt = `Based on the following symptoms, suggest appropriate over-the-counter medications or treatments. Include warnings about when to see a doctor and potential drug interactions. Include a disclaimer about consulting healthcare professionals.\n\nSymptoms: ${symptoms}\nAllergies: ${allergies}\nCurrent Medications: ${currentMedications}`;
    
    const result = await model.generateContent(prompt);
    const detailedResponse = result.response.text();
    
    if (concise) {
      return await makeConcise(detailedResponse);
    }
    
    return detailedResponse;
  } catch (error) {
    console.error("Error getting medication recommendations:", error);
    throw new Error("Failed to get medication recommendations. Please try again.");
  }
};

export const getRecommendedVideos = async (recentActivities: string[]) => {
  try {
    // Join recent activities to create a search query
    const searchQuery = recentActivities.join(", ");
    return await searchYouTubeVideos(searchQuery);
  } catch (error) {
    console.error("Error getting recommended videos:", error);
    throw new Error("Failed to get recommended videos. Please try again.");
  }
};
