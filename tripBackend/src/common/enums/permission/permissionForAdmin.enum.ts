import { PermissionEnum } from '../permission.enum';

export enum PermissionForAdminEnum {
	FindUsers = PermissionEnum.FindUsers,
	FindUser = PermissionEnum.FindUser,
	CreateUser = PermissionEnum.CreateUser,
	UpdateUserInformation = PermissionEnum.UpdateUserInformation,
	ResetUserPassword = PermissionEnum.ResetUserPassword,
	LockUser = PermissionEnum.LockUser,
	UnlockUser = PermissionEnum.UnlockUser,
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
