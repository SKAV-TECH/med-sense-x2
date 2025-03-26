import { GoogleGenerativeAI } from "@google/generative-ai";
import franc from "franc-min"; // Install via npm: `npm install franc-min`

const apiKey = "YOUR_GEMINI_API_KEY";
const youtubeApiKey = "YOUR_YOUTUBE_API_KEY";
const genAI = new GoogleGenerativeAI(apiKey);

const getModelBasedOnPreference = () => {
  return genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
};

// Function to get concise response
const makeConcise = async (text: string) => {
  const model = getModelBasedOnPreference();
  const prompt = `Summarize the following response concisely:\n\n${text}`;
  const result = await model.generateContent(prompt);
  return result.response.text();
};

// Function to analyze a health-related image
export const analyzeMedicalImage = async (imageBase64: string) => {
  try {
    const model = getModelBasedOnPreference();
    const prompt = "Analyze this medical image and provide insights.";
    const result = await model.generateContent([prompt, { inlineData: { data: imageBase64, mimeType: "image/jpeg" } }]);
    return result.response.text();
  } catch (error) {
    console.error("Error analyzing medical image:", error);
    throw new Error("Failed to analyze the image.");
  }
};

// Function to ask health-related questions
export const askHealthQuestion = async (question: string, concise: boolean = false) => {
  try {
    const model = getModelBasedOnPreference();
    
    // Detect the language of the user's input
    const detectedLang = franc(question);
    
    // Define supported languages (ISO 639-1 codes)
    const supportedLanguages = {
      'te': 'Telugu',
      'hi': 'Hindi',
      'ta': 'Tamil',
      'en': 'English'
    };

    let prompt = `
      As an AI medical assistant, please help with this health question. Provide informative, evidence-based information, including potential causes, preventive tips, and next steps if applicable.
      Remember to mention that this is not a substitute for professional medical advice.
    `;

    // If detected language is supported and not English, request translation
    if (detectedLang in supportedLanguages && detectedLang !== 'en') {
      prompt += ` Translate the response into ${supportedLanguages[detectedLang]}.`;
    }

    prompt += `\n\nQuestion: ${question}`;

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

// Function to fetch related YouTube videos
export const getYouTubeVideos = async (query: string) => {
  try {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)}&type=video&maxResults=5&key=${youtubeApiKey}`
    );
    const data = await response.json();
    return data.items.map((item: any) => ({
      title: item.snippet.title,
      videoId: item.id.videoId,
      thumbnail: item.snippet.thumbnails.default.url,
    }));
  } catch (error) {
    console.error("Error fetching YouTube videos:", error);
    throw new Error("Failed to retrieve videos.");
  }
};
