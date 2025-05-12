import { PermissionEnum } from '../permission.enum';

export enum PermissionForSupplierEnum {
	CreateProduct = PermissionEnum.CreateProduct,
	CreateProductSchedule = PermissionEnum.CreateProductSchedule,
	UpdateProductInformation = PermissionEnum.UpdateProductInformation,
	FindProductScheduleBySupplierId = PermissionEnum.FindProductScheduleBySupplierId,
	DeleteProductScheduleByProductScheduleId = PermissionEnum.DeleteProductScheduleByProductScheduleId,
	CreateDiscount = PermissionEnum.CreateDiscount,
}
