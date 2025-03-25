
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the Google Generative AI client
const API_KEY = "YOUR_GEMINI_API_KEY"; // Replace with your actual API key
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

// Add a function to truncate AI responses to approximately 50 words
export const truncateResponse = (text: string, wordLimit: number = 50, detailedMode: boolean = false): string => {
  if (detailedMode) return text;
  
  const words = text.split(/\s+/);
  if (words.length <= wordLimit) return text;
  
  return words.slice(0, wordLimit).join(' ') + '... [truncated for brevity]';
};

// Image analysis with Gemini
export const analyzeMedicalImage = async (
  image: File, 
  prompt: string,
  detailedMode: boolean = false
): Promise<string> => {
  try {
    // Convert the image to a format Gemini can use
    const imageData = await fileToGenerativePart(image);
    
    // Call Gemini with the image and prompt
    const result = await model.generateContent([prompt, imageData]);
    const response = await result.response;
    const text = response.text();
    
    return truncateResponse(text, 50, detailedMode);
  } catch (error) {
    console.error("Error analyzing medical image:", error);
    throw new Error("Failed to analyze the medical image. Please try again.");
  }
};

export const analyzeHealthReport = async (
  report: File,
  detailedMode: boolean = false
): Promise<string> => {
  try {
    // Convert the report to a format Gemini can use
    const reportData = await fileToGenerativePart(report);
    
    // Call Gemini with the report
    const prompt = "Analyze this health report. Provide a summary of key findings, any abnormal values, and recommendations.";
    const result = await model.generateContent([prompt, reportData]);
    const response = await result.response;
    const text = response.text();
    
    return truncateResponse(text, 50, detailedMode);
  } catch (error) {
    console.error("Error analyzing health report:", error);
    throw new Error("Failed to analyze the health report. Please try again.");
  }
};

export const analyzeMedication = async (
  medicationName: string,
  patientInfo: string = "",
  detailedMode: boolean = false
): Promise<string> => {
  try {
    let prompt = `Provide information about the medication ${medicationName}, including its uses, side effects, precautions, and typical dosage.`;
    
    if (patientInfo) {
      prompt += ` Consider the following patient information: ${patientInfo}`;
    }
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    return truncateResponse(text, 50, detailedMode);
  } catch (error) {
    console.error("Error analyzing medication:", error);
    throw new Error("Failed to analyze the medication. Please try again.");
  }
};

export const analyzePrescriptionImage = async (
  image: File,
  detailedMode: boolean = false
): Promise<string> => {
  try {
    // Convert the image to a format Gemini can use
    const imageData = await fileToGenerativePart(image);
    
    // Call Gemini with the image
    const prompt = "Analyze this prescription image. List all medications, dosages, and instructions found in the prescription.";
    const result = await model.generateContent([prompt, imageData]);
    const response = await result.response;
    const text = response.text();
    
    return truncateResponse(text, 50, detailedMode);
  } catch (error) {
    console.error("Error analyzing prescription image:", error);
    throw new Error("Failed to analyze the prescription image. Please try again.");
  }
};

export const generateTreatmentPlan = async (
  patientInfo: string,
  symptoms: string,
  medicalHistory: string = "",
  detailedMode: boolean = false
): Promise<string> => {
  try {
    let prompt = `Generate a treatment plan based on the following information.
    Patient information: ${patientInfo}
    Symptoms: ${symptoms}`;
    
    if (medicalHistory) {
      prompt += `\nMedical history: ${medicalHistory}`;
    }
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    return truncateResponse(text, 50, detailedMode);
  } catch (error) {
    console.error("Error generating treatment plan:", error);
    throw new Error("Failed to generate a treatment plan. Please try again.");
  }
};

export const searchYouTubeVideos = async (
  query: string
): Promise<any[]> => {
  // This would typically use YouTube API, but for now we'll use mocked data
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
  try {
    const prompt = `Summarize a video titled "${videoTitle}". Provide key points discussed in the video.`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    return truncateResponse(text, 50, detailedMode);
  } catch (error) {
    console.error("Error summarizing YouTube video:", error);
    throw new Error("Failed to summarize the YouTube video. Please try again.");
  }
};

export const getRecommendedVideos = async (
  recentActivities: string[]
): Promise<any[]> => {
  // This would typically use YouTube API, but for now we'll use mocked data
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

// Helper function to convert File to GenerativePart
async function fileToGenerativePart(file: File) {
  const buffer = await file.arrayBuffer();
  const byteArray = new Uint8Array(buffer);
  
  return {
    inlineData: {
      data: Array.from(byteArray),
      mimeType: file.type
    }
  };
}
