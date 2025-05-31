import { createAsyncThunk } from '@reduxjs/toolkit';

import {
  TDiscount,
  TDiscountDetail,
  TDiscountsNonDiscountable,
  TPagination,
} from '@/types';

import {
  TRequestBodyAssignProductSchedulesToDiscount,
  TRequestBodyCreateDiscount,
  TRequestBodyDeleteProductSchedulesToDiscount,
  TRequestQueryGetDiscountsByProductId,
  TRequestQueryGetNonDiscountableSchedules,
  TResponseBodyAsignProductSchedulesToDiscount,
} from './discount.type';
import { discountApi } from './discountApi';

const getDiscountsByProductId = createAsyncThunk(
  'discount/getDiscountsByProductId',
  async ({
    productId,
    query,
  }: {
    productId: string;
    query?: TRequestQueryGetDiscountsByProductId;
  }): Promise<[TDiscountDetail[], TPagination?]> => {
    const [data, pagination] = await discountApi.getDiscountsByProductId(
      productId,
      query,
    );
    return [data, pagination];
  },
);

const getDiscountsAvailableByScheduleIds = createAsyncThunk(
  'discount/getDiscountsAvailableByScheduleIds',
  async ({
    scheduleIds,
    query,
  }: {
    scheduleIds: string[];
    query?: TRequestQueryGetDiscountsByProductId;
  }): Promise<TDiscount[]> => {
    const data = await discountApi.getDiscountsAvailableByScheduleIds(scheduleIds, query);
    return data;
  },
);

const getDiscountByUserId = createAsyncThunk(
  'discount/getDiscountByUserId',
  async ({
    query,
  }: {
    query?: TRequestQueryGetDiscountsByProductId;
  }): Promise<[TDiscountDetail[], TPagination?]> => {
    const [data, pagination] = await discountApi.getDiscountByUserId(query);
    return [data, pagination];
  },
);

const getNonDiscountableSchedules = createAsyncThunk(
  'discount/nonDiscountableSchedules',
  async ({
    discountId,
    productId,
    query,
  }: {
    discountId: string;
    productId: string;
    query?: TRequestQueryGetNonDiscountableSchedules;
  }): Promise<[TDiscountsNonDiscountable[], TPagination?]> => {
    const [data, pagination] = await discountApi.getNonDiscountableSchedules(
      discountId,
      productId,
      query,
    );
    return [data, pagination];
  },
);

const getDiscountByDiscountId = createAsyncThunk(
  'discount/getDiscountByDiscountId',
  async (discountId: string): Promise<TDiscount> => {
    const response = await discountApi.getDiscountByDiscountId(discountId);
    return response;
  },
);

const createDiscount = createAsyncThunk(
  'discount/createDiscount',
  async ({ discount }: { discount: TRequestBodyCreateDiscount }): Promise<TDiscount> => {
    const response = await discountApi.createDiscount(discount);
    return response;
  },
);

const assignProductSchedulesToDiscount = createAsyncThunk(
  'discount/assignProductSchedulesToDiscount',
  async ({
    discountId,
    schedules,
  }: {
    discountId: string;
    schedules: TRequestBodyAssignProductSchedulesToDiscount;
  }): Promise<TResponseBodyAsignProductSchedulesToDiscount> => {
    const response = await discountApi.asignProductSchedulesToDiscount(
      discountId,
      schedules,
    );
    return response;
  },
);

const deleteProductSchedulesToDiscount = createAsyncThunk(
  'discount/deleteProductSchedulesToDiscount',
  async ({
    discountId,
    schedules,
  }: {
    discountId: string;
    schedules: TRequestBodyDeleteProductSchedulesToDiscount;
  }): Promise<TDiscount> => {
    const response = await discountApi.deleteProductSchedulesToDiscount(
      discountId,
      schedules,
    );
    return response;
  },
);

const deleteDiscount = createAsyncThunk(
  'discount/deleteDiscount',
  async (discountId: string): Promise<TDiscount> => {
    const response = await discountApi.deleteDiscount(discountId);
    return response;
  },
);

export const discountThunk = {
  getDiscountsByProductId,
  getDiscountsAvailableByScheduleIds,
  getNonDiscountableSchedules,
  getDiscountByUserId,
  getDiscountByDiscountId,
  createDiscount,
  assignProductSchedulesToDiscount,
  deleteProductSchedulesToDiscount,
  deleteDiscount,
};
