import { PermissionEnum } from '../permission.enum';

export enum PermissionForSupplierEnum {
	FindProductsForRole = PermissionEnum.FindProductsForRole,
	CreateProduct = PermissionEnum.CreateProduct,
	CreateProductSchedule = PermissionEnum.CreateProductSchedule,
	UpdateProductInformation = PermissionEnum.UpdateProductInformation,
	FindProductScheduleBySupplierId = PermissionEnum.FindProductScheduleBySupplierId,
	DeleteProductScheduleByProductScheduleId = PermissionEnum.DeleteProductScheduleByProductScheduleId,
	CreateDiscount = PermissionEnum.CreateDiscount,
	DeleteDiscountByDiscountId = PermissionEnum.DeleteDiscountByDiscountId,
	FindDiscountsByUserId = PermissionEnum.FindDiscountsByUserId,
	AsignProductSchedulesToDiscount = PermissionEnum.AsignProductSchedulesToDiscount,
}
