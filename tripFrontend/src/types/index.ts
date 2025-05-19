export * from './account.type';
export * from './common.type';
export * from './discount.type';
export * from './discountApplicationScope.type';
export * from './discountEligibility.type';
export * from './discountType.type';
export * from './location.type';
export * from './pagination.type';
export * from './product.type';
export * from './responseBackend.type';
export * from './user.type';

export type TRequestQueryGetUsers = {
    page?: number;
    limit?: number;
    search?: string;
    roleName?: 'tourist' | 'supplier' | 'admin';
};
