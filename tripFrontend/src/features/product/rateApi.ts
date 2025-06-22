import { api, EServer } from '@/lib';
import { TProductRate, TPagination } from '@/types';

export interface RateRequest {
  star: number;
  comment: string;
  billId: string
}

export interface RateResponse {
  success: boolean;
  data: TProductRate;
}

export interface GetRatesResponse {
  success: boolean;
  data: TProductRate[];
  pagination?: TPagination;
}

export const rateApi = {
  async getRates(productId: string): Promise<[TProductRate[], TPagination?]> {
    try {
      const response = await api.get<GetRatesResponse>(
        `/product/${productId}/rate`,
        {},
        EServer.Backend
      );
      return [response.data, response.pagination];
    } catch (error) {
      console.error('Lỗi khi gọi API getRates:', error);
      throw error;
    }
  },

  async submitRate(productId: string, data: RateRequest): Promise<RateResponse> {
    try {
      const response = await api.post<RateResponse, RateRequest>(
        `/product/${productId}/rate`,
        data,
        {},
        EServer.Backend
      );
      return response;
    } catch (error) {
      console.error('Lỗi khi gọi API submitRate:', error);
      throw error;
    }
  },
}; 