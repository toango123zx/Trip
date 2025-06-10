import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { firstValueFrom, timeout, catchError } from 'rxjs';
import { of } from 'rxjs';
import { recommendProductConfig } from 'src/configs';

import { ProductRecommendationsResponseDto } from '../dtos';

type RecommendationItemDto = {
	id: string;
	score: number;
};

type TRecommendationResponseDto = {
	product: RecommendationItemDto[];
	totalProducts: number;
	userId: string;
};

@Injectable()
export class ProductRecommendationsService {
	private readonly logger = new Logger(ProductRecommendationsService.name);
	private readonly recommendationApiUrl: string;
	private readonly timeout = 5000; // 5s

	constructor(
		private readonly httpService: HttpService,
		private readonly configService: ConfigService,
	) {
		this.recommendationApiUrl = this.configService.get<string>(
			'RECOMMENDATION_API_URL',
			recommendProductConfig.serviceUrl,
		);
	}
	/**
	 * Lấy recommendations cho 1 user, endpoint: /recommendations/:userId
	 */
	async getRecommendations(
		userId: string, // Bắt buộc phải có userId
	): Promise<ProductRecommendationsResponseDto[]> {
		const url = `${this.recommendationApiUrl}/recommendations/${userId}`;
		this.logger.log(`Calling recommendation API: GET ${url}`);
		try {
			const response = await firstValueFrom(
				this.httpService.get<TRecommendationResponseDto>(url).pipe(
					timeout(this.timeout),
					catchError((error) => {
						this.logger.error(`Recommendation API error: ${error.message}`);
						return of({
							data: {
								product: [],
								totalProducts: 0,
								userId,
							},
							status: 200,
						});
					}),
				),
			);
			if (response.status !== 200) {
				return [];
			}
			return response.data.product.map((item) => ({
				id: item.id,
				score: item.score,
			}));
		} catch (err) {
			this.logger.error(`Failed to get recommendations: ${err.message}`);
			return [];
		}
	}

	async updateProductVector(): Promise<void> {
		const url = `${this.recommendationApiUrl}/update-embeddings`;
		this.logger.log(`Calling recommendation API: POST ${url}`);
		try {
			const response = await firstValueFrom(
				this.httpService.post<void>(url).pipe(
					timeout(this.timeout),
					catchError((error) => {
						this.logger.error(`Recommendation API error: ${error.message}`);
						return of({
							data: {
								success: true,
							},
							status: 200,
						});
					}),
				),
			);
			if (response.status !== 200) {
				throw new Error(`Unexpected status code: ${response.status}`);
			}
			return;
		} catch (err) {
			this.logger.error(`Failed to get recommendations: ${err.message}`);
			return;
		}
	}

	/**
	 * Wrapper nếu bạn muốn giới hạn số item
	 */
}
