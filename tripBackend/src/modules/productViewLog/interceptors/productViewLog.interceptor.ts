import {
	Injectable,
	NestInterceptor,
	ExecutionContext,
	CallHandler,
} from '@nestjs/common';

import { Observable, tap } from 'rxjs';
import { HttpResponseBodySuccessDto } from 'src/common';
import { GetProductByProductIdResponseDto } from 'src/modules/product/dtos/responses/getProductBByProductId.response';

import { ProductViewLogRepository } from '../productViewLog.repository';

@Injectable()
export class ProductViewLogInterceptor implements NestInterceptor {
	constructor(private readonly productViewLogRepository: ProductViewLogRepository) {}

	async intercept(
		context: ExecutionContext,
		next: CallHandler,
	): Promise<Observable<HttpResponseBodySuccessDto<GetProductByProductIdResponseDto>>> {
		const request = context.switchToHttp().getRequest();
		return next.handle().pipe(
			tap(
				async (
					response: HttpResponseBodySuccessDto<GetProductByProductIdResponseDto>,
				) => {
					if (response.success == true && request.user) {
						await this.productViewLogRepository.createProductViewLog({
							product: {
								connect: {
									id: response.data.id,
								},
							},
							productName: response.data.name,
							user: {
								connect: {
									id: request.user.id,
								},
							},
						});
					}
				},
			),
		);
	}
}
