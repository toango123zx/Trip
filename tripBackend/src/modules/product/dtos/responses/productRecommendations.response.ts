export class ProductRecommendationsResponseDto {
	id: string;
	score: number;
}

export class RecommendationsResponseDto {
	product: ProductRecommendationsResponseDto[];
	totalProducts: number;
	userId: string;
}
