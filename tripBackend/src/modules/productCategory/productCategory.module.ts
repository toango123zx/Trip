import { Module } from '@nestjs/common';

import { ProductCategoryRepository } from './productCategory.repository';

@Module({
	imports: [],
	controllers: [],
	providers: [ProductCategoryRepository],
	exports: [],
})
export class ProductCategoryModule {}
