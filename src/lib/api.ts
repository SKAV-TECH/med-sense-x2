
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the Google Generative AI with the API key
const API_KEY = "AIzaSyDYGHDOEmpCmAwtm2qISLlkyXIK8CZ_0-4";
const genAI = new GoogleGenerativeAI(API_KEY);

// YouTube API key
export const YOUTUBE_API_KEY = "AIzaSyAEXThGL8xrapf_tCW6w4jwOU_EKobyjcY";

// Convert file to base64 format for the Gemini API
export const fileToGenerativePart = async (file: File) => {
  return new Promise<{
    inlineData: { data: string; mimeType: string };
  }>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      resolve({
        inlineData: {
          data: (reader.result as string).split(",")[1],
          mimeType: file.type,
        },
      });
    };
    reader.readAsDataURL(file);
  });
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

// Function to analyze medical images
export const analyzeMedicalImage = async (file: File, promptText: string) => {
  try {
    const model = getGeminiVisionModel();
    const imagePart = await fileToGenerativePart(file);
    
    const prompt = promptText || 
      "Analyze this medical image in detail. Identify any visible abnormalities, potential diagnoses, severity level (low, medium, high), and recommendations for further tests or treatments. Format the response with clear sections.";
    
    const result = await model.generateContent([prompt, imagePart]);
    return result.response.text();
  } catch (error) {
    console.error("Error analyzing medical image:", error);
    throw new Error("Failed to analyze the medical image. Please try again.");
  }
};

// Function to ask health-related questions
export const askHealthQuestion = async (question: string) => {
  try {
    const model = getGemini2Model();
    const prompt = `As an AI medical assistant, please help with this health question. Provide informative, evidence-based information, including potential causes, preventive tips, and next steps if applicable. Remember to mention that this is not a substitute for professional medical advice.\n\nQuestion: ${question}`;
    
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error("Error asking health question:", error);
    throw new Error("Failed to process your question. Please try again.");
  }
};

// Function to generate personalized treatment plan
export const generateTreatmentPlan = async (patientInfo: string, symptoms: string, medicalHistory: string) => {
  try {
    const model = getGemini2Model();
    const prompt = `Based on the following patient information, generate a personalized treatment plan with recommendations for medications, lifestyle changes, and follow-up tests. Include a disclaimer about consulting healthcare professionals.\n\nPatient Information: ${patientInfo}\nSymptoms: ${symptoms}\nMedical History: ${medicalHistory}`;
    
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error("Error generating treatment plan:", error);
    throw new Error("Failed to generate a treatment plan. Please try again.");
  }
};

// Function to analyze medication safety
export const analyzeMedication = async (medicationName: string, patientInfo?: string) => {
  try {
    const model = getGemini2Model();
    const patientContext = patientInfo ? `\nPatient Information: ${patientInfo}` : '';
    
    const prompt = `Provide detailed information about this medication including uses, dosage, side effects, contraindications, and potential drug interactions. Format the response with clear sections.${patientContext}\n\nMedication: ${medicationName}`;
    
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error("Error analyzing medication:", error);
    throw new Error("Failed to analyze the medication. Please try again.");
  }
};

// Function to analyze prescription image
export const analyzePrescriptionImage = async (file: File) => {
  try {
    const model = getGeminiVisionModel();
    const imagePart = await fileToGenerativePart(file);
    
    const prompt = "Analyze this prescription image. Identify the medications prescribed, dosages, instructions, and any other relevant information. Also note any potential concerns or interactions between the medications.";
    
    const result = await model.generateContent([prompt, imagePart]);
    return result.response.text();
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

// Function to summarize a YouTube video
export const summarizeYouTubeVideo = async (videoId: string, videoTitle: string) => {
  try {
    const model = getGemini2FlashModel();
    const prompt = `Summarize the key medical information and takeaways from this YouTube video titled "${videoTitle}". Provide the information in a concise, structured format focusing on the main medical concepts, treatments discussed, and expert advice given.`;
    
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error("Error summarizing YouTube video:", error);
    throw new Error("Failed to summarize the video content. Please try again.");
  }
};
