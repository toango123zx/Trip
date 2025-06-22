import {
	Injectable,
	NestInterceptor,
	ExecutionContext,
	CallHandler,
} from '@nestjs/common';

import { Response } from 'express';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { HttpResponseBodyDto } from '../dtos';

@Injectable()
export class SetCookieInterceptor implements NestInterceptor {
	intercept(
		context: ExecutionContext,
		next: CallHandler,
	): Observable<HttpResponseBodyDto<unknown>> {
		return next.handle().pipe(
			map((data: HttpResponseBodyDto<unknown>) => {
				const response = context.switchToHttp().getResponse<Response>();

				if (data.cookie) {
					const { cookie, ...restData } = data;

					Object.keys(cookie).forEach((name) => {
						response.cookie(name, String(cookie[name]), {
							httpOnly: true,
							path: '/',
							// secure: true,
							// sameSite: 'none',
						});
					});
					return restData;
				}

				return data;
			}),
		);
	}
}
