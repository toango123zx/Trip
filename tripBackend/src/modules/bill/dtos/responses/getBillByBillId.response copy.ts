// import { BillStatusEnum, DiscountStatusEnum, InfoDiscountStatusEnum, PaymentMethodStatusEnum, ProductScheduleStatusEnum, ProductStatusEnum, TransactionStatusEnum, UserStatusEnum } from "@prisma/client";
// import { BillEntity, InfoBillDiscountEntity, InfoBillEntity } from "src/models";

// class infoDiscount {
//     id: string;
//     discountId: string;
//     productScheduleId: string;
//     createAt: Date;
//     updateAt: Date;
//     deletedAt: Date | null;
//     status: InfoDiscountStatusEnum;
//     productSchedule: {
//         id: string;
//         productId?: string;
//         startTime?: Date;
//         endTime?: Date;
//         price?: number;
//         booked?: number;
//         startOrder?: Date;
//         endOrder?: Date;
//         createAt?: Date;
//         updateAt?: Date;
//         deletedAt?: Date | null;
//         status?: ProductScheduleStatusEnum;
//     };roductSchedule, ProductScheduleStatusEnum, ProductStatusEnum, TransactionStatusEnum, UserStatusEnum } from "@prisma/client";
// import { BillEntity, InfoBillDiscountEntity, InfoBillEntity } from "src/models";

// class InfoBillItem {
//     id: string;
//     billId: string;
//     productScheduleId: string;
//     quantity: number;
//     productId: Date;
//     productName: string;
//     startTime: Date;
//     endTime: Date;
//     price: number;
//     booked: number;
//     startOrder: Date;
//     endOrder: Date;
//     productScheduleStatus: ProductScheduleStatusEnum;
//     product: {
//         id: string;
//         name: string;
//         posterImageUrl: string;
//         supplierId: string;
//         time: number;
//         quantityAvailable: number;
//         age: number;
//         quantityCompleted: number;
//         description: string;
//         quantityRate: number;
//         avgRate: number;
//         locationId: string;
//         locationName: string;
//         productCategoryId: string;
//         createAt: Date;
//         updateAt: Date;
//         deletedAt: Date | null;
//         status: ProductStatusEnum;
//         supplier: {
//             id: string;
//             userId: string;
//             name: string;
//             image: string;
//             status: UserStatusEnum
//         };
//         productCategory: {
//             id: string;
//             name: string;
//         };
//     };
// }

// class InfoBillDiscountItem {
//     id: string;
//     discountId: string;
//     discount: Discount;
// }

// class DiscountForBillItem {
//     id: string;
//     discountId: string;
//     discount: Discount;
// }

// class Discount {
//     id: string;
//     name: string;
//     discountProviderType: string;
//     userId: string;
//     code: string;
//     description: string;
//     startTime: Date;
//     endTime: Date;
//     value: number;
//     quantity: number;
//     point: number;
//     applited: number;
//     stackable: boolean;
//     discountTypeId: string;
//     discountEligibilityId: string;
//     discountApplicationScopeId: string;
//     createAt: Date;
//     updateAt: Date;
//     deletedAt: Date | null;
//     status: DiscountStatusEnum;
//     infoDiscount?: infoDiscount[]
// }

// class infoDiscount {
//     id: string;
//     discountId: string;
//     productScheduleId: string;
//     createAt: Date;
//     updateAt: Date;
//     deletedAt: Date | null;
//     status: InfoDiscountStatusEnum;
//     productSchedule: {
//         id: string;
//         productScheduleId: string;
//         productScheduleStatus?: ProductScheduleStatusEnum;
//         productId?: string;
//         startTime?: Date;
//         endTime?: Date;
//         price?: number;
//         booked?: number;
//         startOrder?: Date;
//         endOrder?: Date;
//         createAt?: Date;
//         updateAt?: Date;
//         deletedAt?: Date;
//         status?: ProductScheduleStatusEnum;
//     };
// }

// export class Bill {
//     id: string;
//     userId: string;
//     paymentMethodId: string;
//     transactionTargetId: string;
//     reductionPrice: number;
//     totalPrice: number;
//     createAt: Date;
//     updateAt: Date;
//     deletedAt: Date | null;
//     status: BillStatusEnum;
//     infoBill: InfoBillItem[];
//     infoBillDiscount: InfoBillDiscountItem[];
//     discountForBill: DiscountForBillItem[];
//     paymentMethod: {
//         id: string;
//         name: string;
//         description: string;
//         status: PaymentMethodStatusEnum;
//     };
//     transaction: {
//         id: string;
//         code: string;
//         description: string;
//         transactionTarget: string;
//         createAt: Date;
//         updateAt: Date;
//         deletedAt: Date | null;
//         status: TransactionStatusEnum;
//     };
//     user: {
//         id: string;
//         name: string;
//         image: string;
//         email: string;
//         dateOfBirth: Date | null;
//         phoneNumber: string | null;
//         address: string | null;
//         balance: number;
//         point: number;
//         status: UserStatusEnum;
//     };

//     constructor(bill: BillEntity) {
//         this.id = bill.id;
//         this.userId = bill.userId;
//         this.paymentMethodId = bill.paymentMethodId;
//         this.transactionTargetId = bill.transactionTargetId;
//         this.reductionPrice = bill.reductionPrice;
//         this.totalPrice = bill.totalPrice;
//         this.createAt = new Date(bill.createAt);
//         this.updateAt = new Date(bill.updateAt);
//         this.deletedAt = bill.deletedAt ? new Date(bill.deletedAt) : null;
//         this.status = bill.status;

//         this.infoBill = bill.infoBill?.map((infoBillDetail: InfoBillEntity) => ({
//             id: infoBillDetail.id,
//             productScheduleId: infoBillDetail.productScheduleId,
//             quantity: infoBillDetail.quantity,
//             productId: infoBillDetail.productSchedule?.productId,
//             productName: infoBillDetail.productSchedule?.product?.id,
//             startTime: infoBillDetail.productSchedule?.startTime,
//             endTime: infoBillDetail.productSchedule?.endTime,
//             price: infoBillDetail.productSchedule?.price,
//             booked: infoBillDetail.productSchedule?.booked,
//             startOrder: infoBillDetail.productSchedule?.startOrder,
//             endOrder: infoBillDetail.productSchedule?.endOrder,
//             productScheduleStatus: infoBillDetail.productSchedule?.status,
//             product: {
//                 id: infoBillDetail.productSchedule.product.id,
//                 name: infoBillDetail.productSchedule.product.name,
//                 posterImageUrl: infoBillDetail.productSchedule.product.posterImageUrl,
//                 supplierId: infoBillDetail.productSchedule.product.supplierId,
//                 time: infoBillDetail.productSchedule.product.time,
//                 quantityAvailable: infoBillDetail.productSchedule.product.quantityAvailable,
//                 age: infoBillDetail.productSchedule.product.age,
//                 quantityCompleted: infoBillDetail.productSchedule.product.quantityCompleted,
//                 description: infoBillDetail.productSchedule.product.description,
//                 quantityRate: infoBillDetail.productSchedule.product.quantityRate,
//                 avgRate: infoBillDetail.productSchedule.product.avgRate,
//                 locationId: infoBillDetail.productSchedule.product.locationId,
//                 locationName: infoBillDetail.productSchedule.product.location?.displayName,
//                 productCategoryId: infoBillDetail.productSchedule.product.productCategoryId,
//                 createAt: infoBillDetail.productSchedule.product.createAt,
//                 updateAt: infoBillDetail.productSchedule.product.updateAt,
//                 deletedAt: infoBillDetail.productSchedule.product.deletedAt || null,
//                 status: infoBillDetail.productSchedule.product.status,
//                 supplier: {
//                     id: infoBillDetail.productSchedule.product.supplierId,
//                     userId: infoBillDetail.productSchedule.product.supplier.userId,
//                     name: infoBillDetail.productSchedule.product.supplier.user?.name,
//                     image: infoBillDetail.productSchedule.product.supplier.user?.image,
//                     status: infoBillDetail.productSchedule.product.supplier.user?.status
//                 },
//                 productCategory: {
//                     id: infoBillDetail.productSchedule.product.productCategory.id,
//                     name: infoBillDetail.productSchedule.product.productCategory.name,
//                 },
//             },
//         })) || [],
//             this.infoBillDiscount = bill.infoBillDiscount?.map((infoBillDiscountDetail: InfoBillDiscountEntity) => ({
//                 id: infoBillDiscountDetail.id,
//                 discountId: infoBillDiscountDetail.discountId,
//                 discount: {
//                     id: infoBillDiscountDetail.discount.id,
//                     name: infoBillDiscountDetail.discount.name,
//                     discountProviderType: infoBillDiscountDetail.discount.discountProviderType,
//                     userId: infoBillDiscountDetail.discount.userId,
//                     code: infoBillDiscountDetail.discount.code,
//                     description: infoBillDiscountDetail.discount.description,
//                     startTime: infoBillDiscountDetail.discount.startTime,
//                     endTime: infoBillDiscountDetail.discount.endTime,
//                     value: infoBillDiscountDetail.discount.value,
//                     quantity: infoBillDiscountDetail.discount.quantity,
//                     point: infoBillDiscountDetail.discount.point,
//                     applited: infoBillDiscountDetail.discount.applited,
//                     stackable: infoBillDiscountDetail.discount.stackable,
//                     discountTypeId: infoBillDiscountDetail.discount.discountTypeId,
//                     discountEligibilityId: infoBillDiscountDetail.discount.discountEligibilityId,
//                     discountApplicationScopeId: infoBillDiscountDetail.discount.discountApplicationScopeId,
//                     createAt: infoBillDiscountDetail.discount.createAt,
//                     updateAt: infoBillDiscountDetail.discount.updateAt,
//                     deletedAt: infoBillDiscountDetail.discount.deletedAt || null,
//                     status: infoBillDiscountDetail.discount.status,
//                     infoDiscount: infoBillDiscountDetail.discount.infoDiscount.map((infoDiscountItem) => ({
//                         id: infoDiscountItem.id,
//                         discountId: infoBillDiscountDetail.discount.id,
//                         productScheduleId: infoDiscountItem.productScheduleId,
//                         createAt: infoDiscountItem.createAt,
//                         updateAt: infoDiscountItem.updateAt,
//                         deletedAt: infoDiscountItem.deletedAt || null,
//                         status: infoDiscountItem.status,
//                         productSchedule: {
//                             id: infoDiscountItem.productScheduleId,
//                             productScheduleId: infoDiscountItem.productScheduleId,
//                             productScheduleStatus: infoDiscountItem.productSchedule?.status,
//                         },
//                     }))
//                 },
//             })) || [];
//         this.discountForBill = bill.discountForBill?.map((dfb: any) => ({
//             id: dfb.id,
//             billId: dfb.billId,
//             discountId: dfb.discountId,
//             discount: {
//                 id: dfb.discount.id,
//                 name: dfb.discount.name,
//                 discountProviderType: dfb.discount.discountProviderType,
//                 userId: dfb.discount.userId,
//                 code: dfb.discount.code,
//                 description: dfb.discount.description,
//                 startTime: new Date(dfb.discount.startTime),
//                 endTime: new Date(dfb.discount.endTime),
//                 value: dfb.discount.value,
//                 quantity: dfb.discount.quantity,
//                 point: dfb.discount.point,
//                 applited: dfb.discount.applited,
//                 stackable: dfb.discount.stackable,
//                 discountTypeId: dfb.discount.discountTypeId,
//                 discountEligibilityId: dfb.discount.discountEligibilityId,
//                 discountApplicationScopeId: dfb.discount.discountApplicationScopeId,
//                 createAt: new Date(dfb.discount.createAt),
//                 updateAt: new Date(dfb.discount.updateAt),
//                 deletedAt: dfb.discount.deletedAt ? new Date(dfb.discount.deletedAt) : null,
//                 status: dfb.discount.status
//             }
//         })) || [];

//         this.paymentMethod = {
//             id: bill.paymentMethod.id,
//             name: bill.paymentMethod.name,
//             description: bill.paymentMethod.description,
//             status: bill.paymentMethod.status
//         };
//         this.transaction = {
//             id: bill.transaction.id,
//             code: bill.transaction.code,
//             description: bill.transaction.description,
//             transactionTarget: bill.transaction.transactionTarget,
//             createAt: new Date(bill.transaction.createAt),
//             updateAt: new Date(bill.transaction.updateAt),
//             deletedAt: bill.transaction.deletedAt ? new Date(bill.transaction.deletedAt) : null,
//             status: bill.transaction.status
//         };
//         this.user = {
//             id: bill.user.id,
//             name: bill.user.name,
//             image: bill.user.image,
//             email: bill.user.email,
//             dateOfBirth: bill.user.dateOfBirth ? new Date(bill.user.dateOfBirth) : null,
//             phoneNumber: bill.user.phoneNumber,
//             address: bill.user.address,
//             balance: bill.user.balance,
//             point: bill.user.point,
//             status: bill.user.status
//         };
//     }
// }
