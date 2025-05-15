// export class InfoBillItem {
//     id: string;
//     billId: string;
//     productScheduleId: string;
//     quantity: number;
//     productSchedule: {
//         id: string;
//         productId: string;
//         startTime: string;
//         endTime: string;
//         price: number;
//         booked: number;
//         startOrder: string;
//         endOrder: string;
//         createAt: string;
//         updateAt: string;
//         deletedAt: string | null;
//         status: string;
//         product: {
//             id: string;
//             name: string;
//             posterImageUrl: string;
//             supplierId: string;
//             time: number;
//             quantityAvailable: number;
//             age: number;
//             quantityCompleted: number;
//             description: string;
//             quantityRate: number;
//             avgRate: number;
//             locationId: string;
//             productCategoryId: string;
//             createAt: string;
//             updateAt: string;
//             deletedAt: string | null;
//             status: string;
//             supplier: {
//                 id: string;
//                 userId: string;
//                 taxId: string;
//                 fee: number;
//                 user: {
//                     id: string;
//                     name: string;
//                     roleId: string;
//                     image: string;
//                     gender: string | null;
//                     email: string;
//                     dateOfBirth: string | null;
//                     phoneNumber: string | null;
//                     address: string | null;
//                     balance: number;
//                     point: number;
//                     createAt: string;
//                     updateAt: string;
//                     deletedAt: string | null;
//                     status: string;
//                 };
//             };
//             productCategory: {
//                 id: string;
//                 name: string;
//                 description: string;
//                 createAt: string;
//                 updateAt: string;
//                 deletedAt: string | null;
//                 status: string;
//             };
//             location: {
//                 id: string;
//                 systemName: string;
//                 displayName: string;
//                 city: string;
//                 mapAddressId: string;
//                 createAt: string;
//                 updateAt: string;
//                 deletedAt: string | null;
//                 status: string;
//             }
//             ;
//         };
//     };
// }

// export class Bill {
//     id: string;
//     userId: string;
//     paymentMethodId: string;
//     transactionTargetId: string;
//     reductionPrice: number;
//     totalPrice: number;
//     createAt: string;
//     updateAt: string;
//     deletedAt: string | null;
//     status: string;
//     infoBill: InfoBillItem[];
//     infoBillDiscount: InfoBillDiscountItem[];
//     discountForBill: DiscountForBillItem[];
//     paymentMethod: {
//         id: string;
//         name: string;
//         description: string;
//         createAt: string;
//         updateAt: string;
//         deletedAt: string | null;
//         status: string;
//     };
//     transaction: {
//     id: string;
//     code: string;
//     description: string;
//     transactionTarget: string;
//     createAt: string;
//     updateAt: string;
//     deletedAt: string | null;
//     status: string;
// };
//     user: {
//         id: string;
//         name: string;
//         roleId: string;
//         image: string;
//         gender: string | null;
//         email: string;
//         dateOfBirth: string | null;
//         phoneNumber: string | null;
//         address: string | null;
//         balance: number;
//         point: number;
//         createAt: string;
//         updateAt: string;
//         deletedAt: string | null;
//         status: string;
//     };
// }

// export interface InfoBillDiscountItem {
//     id: string;
//     billId: string;
//     discountId: string;
//     discount: Discount;
// }

// export interface DiscountForBillItem {
//     id: string;
//     billId: string;
//     discountId: string;
//     discount: Discount;
// }

// export interface Discount {
//     id: string;
//     name: string;
//     discountProviderType: string;
//     userId: string;
//     code: string;
//     description: string;
//     startTime: string;
//     endTime: string;
//     value: number;
//     quantity: number;
//     point: number;
//     applited: number;
//     stackable: boolean;
//     discountTypeId: string;
//     discountEligibilityId: string;
//     discountApplicationScopeId: string;
//     createAt: string;
//     updateAt: string;
//     deletedAt: string | null;
//     status: string;
//     infoDiscount?: infoDiscount[]; // Adjust if more structure is known
// }

// class infoDiscount {
//     id: string;
//     discountId: string;
//     productScheduleId: string;
//     createAt: Date;
//     updateAt: Date;
//     deletedAt: Date | null;
//     status: InfoDiscountStatusEnum;
//     productSchedule: productSchedule;
// }
