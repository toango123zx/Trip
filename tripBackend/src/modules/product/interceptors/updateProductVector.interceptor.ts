import {
	Injectable,
	NestInterceptor,
	ExecutionContext,
	CallHandler,
} from '@nestjs/common';

import { Observable, tap } from 'rxjs';
import { HttpResponseBodySuccessDto } from 'src/common';

import { ProductRecommendationsService } from '../services';

@Injectable()
export class UpdateProductVectorInterceptor implements NestInterceptor {
	constructor(private readonly recommendationService: ProductRecommendationsService) {}

	async intercept(
		context: ExecutionContext,
		next: CallHandler,
	): Promise<Observable<HttpResponseBodySuccessDto<unknown>>> {
		return next.handle().pipe(
			tap(async (response: HttpResponseBodySuccessDto<unknown>) => {
				if (response.success == true && response.data) {
					await this.recommendationService.updateProductVector();
				}
			}),
		);
	}
}
