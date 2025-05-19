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

  // Lưu tên địa điểm vào localStorage
  saveLocationName(locationName: string): void {
    console.log('GeminiService - Saving location name:', locationName);
    localStorage.setItem(this.LOCATION_NAME_KEY, locationName);
  }

  // Lấy tên địa điểm từ localStorage
  getLocationName(): string | null {
    const locationName = localStorage.getItem(this.LOCATION_NAME_KEY);
    console.log('GeminiService - Retrieved location name:', locationName);
    return locationName;
  }

  // Xóa tên địa điểm khỏi localStorage
  clearLocationName(): void {
    console.log('GeminiService - Clearing location name');
    localStorage.removeItem(this.LOCATION_NAME_KEY);
  }

  async generateTravelDescription(locationName?: string, type: string = 'Du lịch'): Promise<string> {
    try {
      console.log('GeminiService - generateTravelDescription started');
      console.log('Input locationName:', locationName);

      // Ưu tiên sử dụng locationName truyền vào, nếu không có thì lấy từ localStorage
      const finalLocationName = locationName || this.getLocationName();
      
      console.log('Final location name:', finalLocationName);

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

      console.log('Prompt:', prompt);

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text().trim();

      console.log('Raw response:', response);
      console.log('Generated text length:', text.length);
      console.log('Generated text:', text);

      // Kiểm tra và xử lý nếu response rỗng
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