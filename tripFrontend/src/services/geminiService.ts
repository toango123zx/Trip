import { GoogleGenerativeAI } from "@google/generative-ai";

class GeminiService {
  private genAI: GoogleGenerativeAI;
  private LOCATION_NAME_KEY = 'temp_location_name';

  constructor() {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("Gemini API key is not defined");
    }
    this.genAI = new GoogleGenerativeAI(apiKey);
  }

  saveLocationName(locationName: string): void {
    localStorage.setItem(this.LOCATION_NAME_KEY, locationName);
  }

  getLocationName(): string | null {
    const locationName = localStorage.getItem(this.LOCATION_NAME_KEY);
    return locationName;
  }

  clearLocationName(): void {
    localStorage.removeItem(this.LOCATION_NAME_KEY);
  }

  async generateTravelDescription(locationName?: string, type: string = 'Du lịch'): Promise<string> {
    try {
      const finalLocationName = locationName || this.getLocationName();
      if (!finalLocationName) {
        console.error('No location name found');
        throw new Error("Không tìm thấy tên địa điểm");
      }

      const model = this.genAI.getGenerativeModel({ model: "gemini-pro" });
      
      const prompt = `Hãy viết một mô tả chi tiết, hấp dẫn và chuyên nghiệp về địa điểm du lịch "${finalLocationName}" tại Việt Nam. 
      Loại địa điểm: ${type}. 
      Mô tả nên bao gồm:
      - Vị trí địa lý
      - Đặc điểm nổi bật
      - Trải nghiệm du khách
      - Văn hóa và không khí địa phương
      Độ dài: Khoảng 150-200 từ
      Yêu cầu: Viết bằng tiếng Việt, mạch lạc và hấp dẫn`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text().trim();

      if (!text) {
        console.error('Empty response from Gemini');
        throw new Error("Không thể sinh mô tả");
      }

      return text;
    } catch (error) {
      console.error("Lỗi khi sinh mô tả bằng Gemini:", error);
      throw error;
    }
  }
}

export const geminiService = new GeminiService(); 