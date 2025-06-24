import { PermissionEnum } from '../permission.enum';

export enum PermissionForSupplierEnum {
	FindProductsForRole = PermissionEnum.FindProductsForRole,
	CreateProduct = PermissionEnum.CreateProduct,
	CreateProductSchedule = PermissionEnum.CreateProductSchedule,
	CreateRoomTypeForAccommodation = PermissionEnum.CreateRoomTypeForAccommodation,
	UpdateProductInformation = PermissionEnum.UpdateProductInformation,
	FindProductScheduleBySupplierId = PermissionEnum.FindProductScheduleBySupplierId,
	FindUsersInProductScheduleByProductScheduleId = PermissionEnum.FindUsersInProductScheduleByProductScheduleId,
	UpdateCompletedProductSchedule = PermissionEnum.UpdateCompletedProductSchedule,
	DeleteProductScheduleByProductScheduleId = PermissionEnum.DeleteProductScheduleByProductScheduleId,
	CreateDiscount = PermissionEnum.CreateDiscount,
	DeleteDiscountByDiscountId = PermissionEnum.DeleteDiscountByDiscountId,
	FindDiscountsByUserId = PermissionEnum.FindDiscountsByUserId,
	AssignProductSchedulesToDiscount = PermissionEnum.AssignProductSchedulesToDiscount,
	Statistic = PermissionEnum.Statistic,
}
