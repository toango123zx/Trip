import React, { useMemo, useCallback } from 'react';
import {
  Layout,
  Typography,
  Button,
  Checkbox,
  Divider,
  Space,
  Card,
  List,
  Row,
  Col,
  Avatar,
  ConfigProvider,
  message,
  Tooltip,
  Tag,
  Skeleton,
} from 'antd';
import {
  ChevronLeft,
  Trash2,
  MapPin,
  Minus,
  Plus,
  ShoppingCart,
  Clock,
} from 'lucide-react';
import { JSX, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';

import { billApi } from '@/features/bill/billApi';
import { cartThunk } from '@/features/cart/cartThunk';
import {
  PaymentMethod,
  PaymentMethodSelector,
  getPaymentMethodInfo,
} from '@/features/paymentMethod';
import { TReduxStoreDispatch, TReduxStoreState } from '@/store';
import { TCartSummary, TDiscount } from '@/types';

import { DiscountSelector } from '../DiscountSelector/DiscountSelector';

const { Content } = Layout;
const { Title, Text } = Typography;

type TBookingItem = {
  id: string;
  scheduleId: string;
  name: string;
  location: string;
  image: string;
  startTime: string;
  endTime: string;
  price: number;
  selected: boolean;
  quantity: number;
  isExpired: boolean; // ✅ NEW: Track if schedule is expired
};

// ✅ Enhanced: Desktop Header with animation
const DesktopHeader = (): JSX.Element => (
  <motion.div
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="relative font-semibold text-4xl font-[Montserrat] text-left mb-8"
  >
    My Booking Cart
  </motion.div>
);

// ✅ Component: Table Header (Updated with expired indicator)
interface TableHeaderProps {
  bookingItems: TBookingItem[];
  toggleSelectAll: () => void;
}

// ✅ Enhanced: Table Header with better styling
const TableHeader = ({
  bookingItems,
  toggleSelectAll,
}: TableHeaderProps): JSX.Element => {
  const validItems = bookingItems.filter((item) => !item.isExpired);
  const allValidSelected =
    validItems.length > 0 && validItems.every((item) => item.selected);

  return (
    <div className="hidden md:flex items-center bg-gray-50 p-4 rounded-lg mb-4">
      <div style={{ width: '5%' }}>
        <Checkbox
          onChange={toggleSelectAll}
          checked={allValidSelected}
          disabled={validItems.length === 0}
          className="transform scale-110"
        />
      </div>
      <div style={{ width: '44%' }}>
        <Text strong className="text-gray-600">Product</Text>
      </div>
      <div style={{ width: '10%' }}>
        <Text strong className="text-gray-600">Start Time</Text>
      </div>
      <div style={{ width: '10%' }}>
        <Text strong className="text-gray-600">Price</Text>
      </div>
      <div style={{ width: '15%', textAlign: 'center' }}>
        <Text strong className="text-gray-600">Quantity</Text>
      </div>
      <div style={{ width: '10%', textAlign: 'center' }}>
        <Text strong className="text-gray-600">Total</Text>
      </div>
      <div style={{ width: '10%', textAlign: 'center' }}>
        <Text strong className="text-gray-600">Action</Text>
      </div>
    </div>
  );
};

// ✅ Enhanced: Empty Cart with animation
const EmptyCart = (): JSX.Element => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.5 }}
    className="text-center py-16"
  >
    <ShoppingCart size={64} className="mx-auto mb-6 text-gray-300" />
    <Text className="text-xl text-gray-500 mb-4">Your cart is empty</Text>
    {/* <Button type="primary" size="large" href="/attractions" className="hover:scale-105 transition-transform">
      Browse Attractions
    </Button> */}
  </motion.div>
);

// ✅ Component: Quantity Controls (Updated with disabled state)
interface QuantityControlsProps {
  quantity: number;
  onIncrease: () => void;
  onDecrease: () => void;
  size?: 'small' | 'default';
  disabled?: boolean; // ✅ NEW: Disabled state
}

// ✅ Enhanced: Quantity Controls with better styling
const QuantityControls = ({
  quantity,
  onIncrease,
  onDecrease,
  size = 'default',
  disabled = false,
}: QuantityControlsProps): JSX.Element => {
  const buttonSize = size === 'small' ? { minWidth: 28, height: 28 } : { minWidth: 32, height: 32 };
  const iconSize = size === 'small' ? 12 : 14;

  return (
    <div className="flex items-center">
      <Button
        onClick={onDecrease}
        size="small"
        style={buttonSize}
        disabled={disabled}
        className="hover:bg-gray-100 transition-colors"
      >
        <Minus size={iconSize} />
      </Button>
      <Text
        style={{
          // margin: '0 8px',
          minWidth: 30,
          textAlign: 'center',
          color: disabled ? '#ccc' : 'inherit',
        }}
        className="font-medium"
      >
        {quantity}
      </Text>
      <Button
        onClick={onIncrease}
        size="small"
        style={buttonSize}
        disabled={disabled}
        className="hover:bg-gray-100 transition-colors"
      >
        <Plus size={iconSize} />
      </Button>
    </div>
  );
};

// ✅ Component: Expired Badge
const ExpiredBadge = (): JSX.Element => (
  <Tooltip title="This schedule has expired and cannot be booked">
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Tag color="red" icon={<Clock size={12} />} className="ml-2">
        Expired
      </Tag>
    </motion.div>
  </Tooltip>
);

// ✅ Component: Mobile Cart Item (Updated with expired handling)
interface MobileCartItemProps {
  item: TBookingItem;
  onToggleSelection: () => void;
  onRemove: () => void;
  onIncreaseQuantity: () => void;
  onDecreaseQuantity: () => void;
}

// ✅ Enhanced: Mobile Cart Item with better styling
const MobileCartItem = ({
  item,
  onToggleSelection,
  onRemove,
  onIncreaseQuantity,
  onDecreaseQuantity,
}: MobileCartItemProps): JSX.Element => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    className="relative md:hidden w-full p-4 bg-white rounded-xl shadow-md mb-4"
  >
    {/* Top left: Checkbox */}
    <div className="absolute top-4 left-4">
      <Checkbox
        checked={item.selected}
        onChange={onToggleSelection}
        disabled={item.isExpired}
        className="transform scale-110"
      />
    </div>

    {/* Top right: Remove button */}
    <div className="absolute top-4 right-4">
      <Button
        type="text"
        onClick={onRemove}
        className="hover:bg-gray-100 rounded-full !p-0"
      >
        <Trash2 size={18} />
      </Button>
    </div>

    {/* Center content */}
    <div className="flex flex-col items-center text-center gap-2 mt-8">
      <Avatar
        shape="square"
        size={120}
        src={item.image}
        style={{
          borderRadius: 12,
          opacity: item.isExpired ? 0.5 : 1,
        }}
      />
      <Text strong className="text-base mt-2 line-clamp-2">
        {item.name}
      </Text>
      <div className="flex items-center text-gray-500 text-sm">
        <MapPin size={14} className="mr-1.5" />
        <Text type="secondary" className="truncate">
          {item.location}
        </Text>
      </div>
    </div>

    {/* Price and Total */}
    <div className="flex justify-between items-center mt-4">
      <div>
        <Text type="secondary" className="text-xs">Price per item</Text>
        <Text strong className="text-sm block">
          {item.price.toLocaleString()} VND
        </Text>
      </div>
      <div className="text-right">
        <Text type="secondary" className="text-xs">Total</Text>
        <Text
          strong
          className="text-sm block"
          style={{ color: item.isExpired ? '#ccc' : 'inherit' }}
        >
          {(item.price * item.quantity).toLocaleString()} VND
        </Text>
      </div>
    </div>

    {/* Quantity controls */}
    <div className="flex items-center justify-between pt-3 mt-3 border-t border-gray-200">
      <Text type="secondary" className="text-sm">Quantity:</Text>
      <QuantityControls
        quantity={item.quantity}
        onIncrease={onIncreaseQuantity}
        onDecrease={onDecreaseQuantity}
        size="small"
        disabled={item.isExpired}
      />
    </div>
  </motion.div>
);

// ✅ Component: Desktop Cart Item (Updated with expired handling)
interface DesktopCartItemProps {
  item: TBookingItem;
  onToggleSelection: () => void;
  onRemove: () => void;
  onIncreaseQuantity: () => void;
  onDecreaseQuantity: () => void;
}

// ✅ Enhanced: Desktop Cart Item with better styling
const DesktopCartItem = ({
  item,
  onToggleSelection,
  onRemove,
  onIncreaseQuantity,
  onDecreaseQuantity,
}: DesktopCartItemProps): JSX.Element => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: 20 }}
    className={`hidden md:flex w-full items-center p-4 hover:bg-gray-50 transition-colors rounded-lg ${item.isExpired ? 'opacity-60' : ''}`}
  >
    <div style={{ width: '5%' }}>
      <Checkbox
        checked={item.selected}
        onChange={onToggleSelection}
        disabled={item.isExpired}
        className="transform scale-110"
      />
    </div>
    <div style={{ width: '44%' }} className="flex items-center space-x-4 gap-1 pr-2">
      <Avatar
        shape="square"
        size={64}
        src={item.image}
        style={{
          borderRadius: 8,
          opacity: item.isExpired ? 0.5 : 1,
        }}
        className="flex-shrink-0"
      />
      <div className="min-w-0 flex-1" >
        <div className="flex items-center space-x-2">
          <Text strong style={{ color: item.isExpired ? '#ccc' : 'inherit' }} className="text-base truncate">
            {item.name}
          </Text>
          {/* {item.isExpired && <ExpiredBadge />} */}
        </div>
        <div className="flex items-center text-gray-500 text-sm mt-1">
          <MapPin size={14} className="mr-2 flex-shrink-0" />
          <Text type="secondary" className="truncate">{item.location}</Text>
        </div>
      </div>
    </div>
    <div style={{ width: '10%' }}>
      <Text type="danger" strong style={{ color: item.isExpired ? '#ccc' : '#ff4d4f' }} className="text-base">
        {item.startTime.toLocaleString()}
      </Text>
    </div>
    <div style={{ width: '10%' }} className="text-center">
      <Text type="danger" strong style={{ color: item.isExpired ? '#ccc' : '#ff4d4f' }} className="text-base">
        {item.price.toLocaleString()} VND
      </Text>
    </div>
    <div style={{ width: '15%' }} className="flex justify-center">
      <QuantityControls
        quantity={item.quantity}
        onIncrease={onIncreaseQuantity}
        onDecrease={onDecreaseQuantity}
        disabled={item.isExpired}
      />
    </div>
    <div style={{ width: '10%' }} className="text-center">
      <Text type="danger" strong style={{ color: item.isExpired ? '#ccc' : '#ff4d4f' }} className="text-base">
        {(item.price * item.quantity).toLocaleString()}
      </Text>
    </div>
    <div style={{ width: '5%' }} className="flex justify-center">
      <Button
        type="text"
        onClick={onRemove}
        danger
        className="hover:bg-red-50 rounded-full p-2 transition-colors"
      >
        <Trash2 size={16} />
      </Button>
    </div>
  </motion.div>
);

// ✅ Component: Cart Item
interface CartItemProps {
  item: TBookingItem;
  onToggleSelection: () => void;
  onRemove: () => void;
  onIncreaseQuantity: () => void;
  onDecreaseQuantity: () => void;
  isMobile: boolean;
  disabled?: boolean;
}

const CartItem = ({
  item,
  onToggleSelection,
  onRemove,
  onIncreaseQuantity,
  onDecreaseQuantity,
  isMobile,
  disabled = false
}: CartItemProps): JSX.Element => (
  <List.Item
  key={item.id}
  className="p-0 border-b"
  style={{
    padding: isMobile ? '12px 0' : '16px 0',
  }}
  >
    <MobileCartItem
      item={item}
      onToggleSelection={onToggleSelection}
      onRemove={onRemove}
      onIncreaseQuantity={onIncreaseQuantity}
      onDecreaseQuantity={onDecreaseQuantity}
    />
    <DesktopCartItem
      item={item}
      onToggleSelection={onToggleSelection}
      onRemove={onRemove}
      onIncreaseQuantity={onIncreaseQuantity}
      onDecreaseQuantity={onDecreaseQuantity}
    />
    {
      disabled && (
        <div className="absolute inset-0 bg-gray-100 opacity-50 z-20 cursor-not-allowed rounded-lg" />
      )
    }

  </List.Item>
);

// ✅ Component: Delete All Button
interface DeleteAllButtonProps {
  bookingItems: TBookingItem[];
  onDeleteAll: () => void;
}

const DeleteAllButton = ({
  bookingItems,
  onDeleteAll,
}: DeleteAllButtonProps): JSX.Element | null => {
  if (bookingItems.length === 0) return null;

  return (
    <div className="hidden md:block mt-4">
      <Button
        type="text"
        className="text-gray-500 hover:text-gray-700 p-0"
        onClick={() => {
          if (window.confirm('Are you sure you want to delete all items?')) {
            onDeleteAll();
          }
        }}
      >
        Delete all
      </Button>
    </div>
  );
};

// ✅ Component: Applied Discounts Display
interface AppliedDiscountsProps {
  selectedDiscounts: TDiscount[];
  calculateDiscountAmount: (discount: TDiscount) => number;
}

const AppliedDiscounts = ({
  selectedDiscounts,
  calculateDiscountAmount,
}: AppliedDiscountsProps): JSX.Element | null => {
  if (selectedDiscounts.length === 0) return null;

  return (
    <div className="bg-orange-50 p-2 rounded">
      {selectedDiscounts.map((discount) => (
        <div key={discount.id} className="flex justify-between items-center text-sm mb-1">
          <Text className="text-orange-600 font-medium">{discount.name}</Text>
          <Text className="text-orange-600 font-medium">
            -{calculateDiscountAmount(discount).toLocaleString()} VND
          </Text>
        </div>
      ))}
    </div>
  );
};

// ✅ ENHANCED: Payment Method Display Component
interface PaymentMethodDisplayProps {
  paymentMethod?: PaymentMethod;
  onClick: () => void;
  disabled?: boolean; // ✅ NEW: Disabled state
}

const PaymentMethodDisplay = ({
  paymentMethod,
  onClick,
  disabled = false,
}: PaymentMethodDisplayProps): JSX.Element => {
  const paymentInfo = getPaymentMethodInfo(paymentMethod);

  if (!paymentMethod || !paymentInfo) {
    return (
      <button
        className={`text-orange-500 text-sm hover:text-orange-700 transition-colors`}
        onClick={disabled ? undefined : onClick}
        disabled={disabled}
      >
        Select payment method
      </button>
    );
  }

  return (
    <button
      className={`flex items-center space-x-2 p-2 border border-green-200 rounded-lg bg-green-50 hover:bg-green-100 transition-colors w-full ${disabled ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
    >
      {/* Payment Method Logo */}
      <div className="w-8 h-6 flex items-center justify-center bg-white border border-gray-200 rounded p-1">
        {paymentInfo.logo ? (
          <img
            src={paymentInfo.logo}
            alt={paymentInfo.name}
            className="max-w-full max-h-full object-contain"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              target.nextElementSibling?.classList.remove('hidden');
            }}
          />
        ) : null}
        <div className={paymentInfo.logo ? 'hidden' : 'text-xs'}>{paymentInfo.icon}</div>
      </div>

      {/* Payment Method Name */}
      <div className="flex-1 text-left">
        <Text className="text-green-700 font-medium text-sm">{paymentInfo.name}</Text>
      </div>

      {/* Edit Icon */}
      <div className="text-green-600 text-xs">✏️</div>
    </button>
  );
};

// ✅ Component: Expired Items Notice
interface ExpiredItemsNoticeProps {
  expiredCount: number;
}

const ExpiredItemsNotice = ({
  expiredCount,
}: ExpiredItemsNoticeProps): JSX.Element | null => {
  if (expiredCount === 0) return null;

  return (
    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
      <div className="flex items-center space-x-2">
        <Clock size={16} className="text-red-600" />
        <Text className="text-red-700 font-medium">
          {expiredCount} item{expiredCount > 1 ? 's' : ''} in your cart{' '}
          {expiredCount > 1 ? 'have' : 'has'} expired
        </Text>
      </div>
      <Text className="text-red-600 text-sm mt-1">
        Expired items cannot be selected for checkout but can be removed from your cart.
      </Text>
    </div>
  );
};

// ✅ Component: Order Summary (Updated with expired handling)
interface OrderSummaryProps {
  subtotal: number;
  discount: number;
  total: number;
  selectedDiscounts: TDiscount[];
  selectedItemsCount: number;
  validItemsCount: number; // ✅ NEW: Count of valid (non-expired) items
  selectedPaymentMethod?: PaymentMethod;
  onShowDiscountSelector: () => void;
  onShowPaymentMethodSelector: () => void;
  onCheckout: () => void;
  calculateDiscountAmount: (discount: TDiscount) => number;
  isProcessing?: boolean;
}

// ✅ Enhanced: Order Summary with better styling
const OrderSummary = ({
  subtotal,
  discount,
  total,
  selectedDiscounts,
  selectedItemsCount,
  validItemsCount,
  selectedPaymentMethod,
  onShowDiscountSelector,
  onShowPaymentMethodSelector,
  onCheckout,
  calculateDiscountAmount,
  isProcessing = false,
}: OrderSummaryProps): JSX.Element => {
  const hasValidItems = validItemsCount > 0;
  const canCheckout =
    selectedItemsCount > 0 && selectedPaymentMethod && hasValidItems && !isProcessing;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="hidden md:block sticky top-4"
    >
      <Card className="shadow-lg rounded-xl border-0">
        <Space direction="vertical" style={{ width: '100%' }} size="large">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Text className="text-gray-500">Subtotal:</Text>
              <Text strong className="text-lg">{subtotal.toLocaleString()} VND</Text>
            </div>

            <div className="flex justify-between items-center">
              <Text className="text-gray-500">Discount:</Text>
              <Text type="danger" className="text-lg">- {discount.toLocaleString()} VND</Text>
            </div>

            <div className="flex justify-end items-center">
              <button
                className="text-orange-500 text-sm hover:text-orange-700 transition-colors"
                onClick={onShowDiscountSelector}
                disabled={!hasValidItems || isProcessing}
              >
                {selectedDiscounts.length > 0
                  ? `Selected ${selectedDiscounts.length} discount(s)`
                  : 'Select/enter code'}
              </button>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <Text className="text-sm text-gray-500">Payment Method:</Text>
            <PaymentMethodDisplay
              paymentMethod={selectedPaymentMethod}
              onClick={onShowPaymentMethodSelector}
              disabled={!hasValidItems || isProcessing}
            />
          </div>

          {selectedDiscounts.length > 0 && (
            <AppliedDiscounts
              selectedDiscounts={selectedDiscounts}
              calculateDiscountAmount={calculateDiscountAmount}
            />
          )}

          <Divider className="my-4" />

          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <Text strong className="text-lg">Total amount:</Text>
              <Text type="danger" strong className="text-2xl">
                {total.toLocaleString()} VND
              </Text>
            </div>

            <Button
              type="primary"
              onClick={onCheckout}
              block
              size="large"
              loading={isProcessing}
              disabled={!canCheckout}
              className="h-12 text-lg font-medium transition-transform"
            >
              {isProcessing ? 'Processing...' : 'Check out'}
            </Button>

            {!hasValidItems && (
              <Text type="secondary" className="text-sm text-center block">
                No valid items available for checkout
              </Text>
            )}

            {hasValidItems && selectedItemsCount === 0 && (
              <Text type="secondary" className="text-sm text-center block">
                Please select items to checkout
              </Text>
            )}

            {hasValidItems && selectedItemsCount > 0 && !selectedPaymentMethod && (
              <Text type="warning" className="text-sm text-center block">
                Please select a payment method to continue
              </Text>
            )}
          </div>
        </Space>
      </Card>
    </motion.div>
  );
};

// ✅ Component: Mobile Checkout (Updated with expired handling)
interface MobileCheckoutProps {
  selectedItemsCount: number;
  validItemsCount: number; // ✅ NEW: Count of valid items
  total: number;
  selectedPaymentMethod?: PaymentMethod;
  onCheckout: () => void;
  onShowPaymentMethodSelector: () => void;
  isProcessing?: boolean;
}

// ✅ Enhanced: Mobile Checkout with better styling
const MobileCheckout = ({
  selectedItemsCount,
  validItemsCount,
  total,
  selectedPaymentMethod,
  onCheckout,
  onShowPaymentMethodSelector,
  isProcessing = false,
}: MobileCheckoutProps): JSX.Element => {
  const paymentInfo = getPaymentMethodInfo(selectedPaymentMethod);
  const hasValidItems = validItemsCount > 0;
  const canCheckout =
    selectedItemsCount > 0 && selectedPaymentMethod && hasValidItems && !isProcessing;

  return (
    <motion.div
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg"
    >
      <div className="max-w-[1536px] mx-auto px-4 py-4">
        {selectedPaymentMethod && paymentInfo && (
          <div className="mb-4">
            <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-6 flex items-center justify-center bg-white border border-gray-200 rounded">
                  {paymentInfo.logo ? (
                    <img
                      src={paymentInfo.logo}
                      alt={paymentInfo.name}
                      className="max-w-full max-h-full object-contain"
                    />
                  ) : (
                    <div className="text-xs">{paymentInfo.icon}</div>
                  )}
                </div>
                <Text className="text-green-700 font-medium">
                  {paymentInfo.name}
                </Text>
              </div>
              <Button
                type="text"
                size="small"
                onClick={onShowPaymentMethodSelector}
                className="text-green-600 hover:text-green-700"
                disabled={!hasValidItems || isProcessing}
              >
                Change
              </Button>
            </div>
          </div>
        )}

        <div className="flex justify-between items-center">
          <Text strong className="text-lg">Total ({selectedItemsCount} tours):</Text>
          <Text type="danger" strong className="text-xl">
            {total.toLocaleString()} VND
          </Text>
        </div>

        <div className="space-y-3">
          <Button
            type="primary"
            block
            onClick={onCheckout}
            loading={isProcessing}
            disabled={!canCheckout}
            className="h-12 text-lg font-medium hover:scale-[1.02] transition-transform"
          >
            {isProcessing ? 'Processing...' : `Check out (${selectedItemsCount})`}
          </Button>

          {hasValidItems && selectedItemsCount > 0 && !selectedPaymentMethod && (
            <Button
              block
              onClick={onShowPaymentMethodSelector}
              className="h-12 text-lg border-orange-500 text-orange-500 hover:bg-orange-50"
              disabled={isProcessing}
            >
              Select Payment Method
            </Button>
          )}

          {!hasValidItems && (
            <Text className="text-sm text-center block text-gray-500">
              No valid items available for checkout
            </Text>
          )}
        </div>
      </div>
    </motion.div>
  );
};

// ✅ Component: Cart List
interface CartListProps {
  bookingItems: TBookingItem[];
  toggleSelection: (id: string) => void;
  removeItem: (id: string) => void;
  increaseQuantity: (id: string) => void;
  decreaseQuantity: (id: string) => void;
  isMobile: boolean;
}

const CartList = ({
  bookingItems,
  toggleSelection,
  removeItem,
  increaseQuantity,
  decreaseQuantity,
  isMobile,
}: CartListProps): JSX.Element => {
  if (bookingItems.length === 0) {
    return <EmptyCart />;
  }

  const expiredCount = bookingItems.filter((item) => item.isExpired).length;

  return (
    <div className="space-y-4">
      <ExpiredItemsNotice expiredCount={expiredCount} />
      <List
        className="divide-y divide-gray-100"
        dataSource={bookingItems}
        renderItem={(item) => (
          <CartItem
            item={item}
            onToggleSelection={() => toggleSelection(item.id)}
            onRemove={() => removeItem(item.id)}
            onIncreaseQuantity={() => increaseQuantity(item.id)}
            onDecreaseQuantity={() => decreaseQuantity(item.id)}
            isMobile={isMobile}
            disabled={item.isExpired}
          />
        )}
      />
    </div>
  );
};

// ✅ Main Component: BookingCart
export const BookingCart = (): JSX.Element => {
  const dispatch = useDispatch<TReduxStoreDispatch>();
  const carts: TCartSummary[] = useSelector<TReduxStoreState, TCartSummary[]>(
    (state) => state.cart.carts,
  );

  // ✅ NEW: Get bill state for loading
  const billLoading = useSelector<TReduxStoreState, boolean>(
    (state) => state.bill?.loading || false,
  );

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await dispatch(cartThunk.getCarts());
      setIsLoading(false);
    };
    loadData();
  }, [dispatch]);

  const [bookingItems, setBookingItems] = useState<TBookingItem[]>([]);
  useEffect(() => {
    setBookingItems(
      carts.map((cart) => ({
        id: cart.id,
        scheduleId: cart.scheduleId,
        name: cart.product.name,
        location: cart.product.locationName,
        image: cart.product.posterImageUrl,
        startTime: new Date(cart.startTime).toLocaleString(),
        endTime: new Date(cart.endTime).toLocaleString(),
        price: cart.price,
        selected: false,
        quantity: 1,
        isExpired: cart.endOrder < new Date(),
      })),
    );
  }, [carts]);

  const [showDiscountSelector, setShowDiscountSelector] = useState(false);
  const [selectedDiscounts, setSelectedDiscounts] = useState<TDiscount[]>([]);

  const [appliedDiscount, setAppliedDiscount] = useState(0);

  // ✅ NEW: Payment method state
  const [showPaymentMethodSelector, setShowPaymentMethodSelector] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<
    PaymentMethod | undefined
  >();

  // ✅ NEW: Processing state for checkout
  const [isProcessingCheckout, setIsProcessingCheckout] = useState(false);

  // ✅ UPDATED: Calculations (only count valid items)
  const validItems = bookingItems.filter((item) => !item.isExpired);
  const selectedItems = bookingItems.filter((item) => item.selected && !item.isExpired);
  const subtotal = selectedItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const discount = appliedDiscount;
  const total = selectedItems.length > 0 ? Math.max(0, subtotal - discount) : 0;

  // ✅ NEW: Function to validate and clean up discounts
  const validateAndCleanDiscounts = (
    currentDiscounts: TDiscount[],
    currentSelectedItems: TBookingItem[],
  ): TDiscount[] => {
    if (currentDiscounts.length === 0) return [];

    const validDiscounts = currentDiscounts.filter((discount) => {
      // Calculate discount value for this specific discount
      const discountValue = calculateSingleDiscountAmount(discount, currentSelectedItems);

      // Keep discount only if it has value > 0
      if (discountValue <= 0) {
        return false;
      }

      // Additional validation: Check if discount is still applicable
      const selectedScheduleIds = new Set(
        currentSelectedItems.map((item) => item.scheduleId),
      );

      // For Together discounts: must have ALL required schedules
      if (discount.discountEligibility.name === 'Together') {
        const requiredScheduleIds = discount.infoDiscount.map(
          (info) => info.productScheduleId,
        );
        const hasAllRequired = requiredScheduleIds.every((id) =>
          selectedScheduleIds.has(id),
        );

        if (!hasAllRequired) {
          return false;
        }
      } else {
        // For other discounts: must have at least ONE applicable schedule
        const hasApplicable = discount.infoDiscount.some((info) =>
          selectedScheduleIds.has(info.productScheduleId),
        );

        if (!hasApplicable) {
          return false;
        }
      }

      return true;
    });

    return validDiscounts;
  };

  // ✅ NEW: Calculate discount amount for a single discount
  const calculateSingleDiscountAmount = (
    discount: TDiscount,
    items: TBookingItem[],
  ): number => {
    if (items.length === 0) return 0;

    // Check if discount is applicable to current items
    const selectedScheduleIds = new Set(items.map((item) => item.scheduleId));

    // For Together discounts: must have ALL required schedules
    if (discount.discountEligibility.name === 'Together') {
      const requiredScheduleIds = discount.infoDiscount.map(
        (info) => info.productScheduleId,
      );
      const hasAllRequired = requiredScheduleIds.every((id) =>
        selectedScheduleIds.has(id),
      );
      if (!hasAllRequired) return 0;
    } else {
      // For other discounts: must have at least ONE applicable schedule
      const hasApplicable = discount.infoDiscount.some((info) =>
        selectedScheduleIds.has(info.productScheduleId),
      );
      if (!hasApplicable) return 0;
    }

    // Use the existing calculation logic but for single discount
    return calculateBillDiscountForItems([discount], items);
  };

  // ✅ UPDATED: Discount Calculation Logic with items parameter
  const calculateBillDiscountForItems = (
    discountsToApply: TDiscount[],
    items: TBookingItem[],
  ): number => {
    if (discountsToApply.length === 0 || items.length === 0) return 0;

    const validDiscounts = discountsToApply.filter((discount) => {
      if (discount.discountEligibility.name === 'Together') {
        const selectedScheduleIds = new Set(items.map((item) => item.scheduleId));
        const requiredScheduleIds = discount.infoDiscount.map(
          (info) => info.productScheduleId,
        );
        return requiredScheduleIds.every((id) => selectedScheduleIds.has(id));
      }
      return true;
    });

    const billDiscounts: TDiscount[] = [];
    const schedDiscMap: Record<string, TDiscount[]> = {};

    for (const d of validDiscounts) {
      if (d.discountApplicationScope.name === 'Bill') {
        billDiscounts.push(d);
      } else {
        for (const info of d.infoDiscount) {
          if (!schedDiscMap[info.productScheduleId]) {
            schedDiscMap[info.productScheduleId] = [];
          }
          schedDiscMap[info.productScheduleId].push(d);
        }
      }
    }

    function applyDiscounts(
      ds: TDiscount[],
      baseAmount: number,
      itemQuantity: number = 1,
    ): number {
      let stackableSum = 0;
      let nonStackableMax = 0;

      for (const d of ds) {
        let amt = 0;

        if (d.discountType.name.includes('Percentage')) {
          amt = baseAmount * (d.value / 100);
        } else if (d.discountType.name.includes('Fixed')) {
          if (d.discountEligibility.name === 'Together') {
            const requiredScheduleIds = d.infoDiscount.map(
              (info) => info.productScheduleId,
            );
            const requiredItems = items.filter((item) =>
              requiredScheduleIds.includes(item.scheduleId),
            );

            if (requiredItems.length > 0) {
              const minQuantityFromRequired = Math.min(
                ...requiredItems.map((item) => item.quantity),
              );
              const remainingDiscount = d.quantity - d.applited;
              const effectiveQty = Math.min(remainingDiscount, minQuantityFromRequired);
              amt = d.value * effectiveQty;
            }
          } else {
            const remainingDiscount = d.quantity - d.applited;
            const effectiveQty = Math.min(remainingDiscount, itemQuantity);
            amt = d.value * effectiveQty;
          }
        } else {
          amt = d.value * itemQuantity;
        }

        if (d.stackable) {
          stackableSum += amt;
        } else {
          nonStackableMax = Math.max(nonStackableMax, amt);
        }
      }

      return stackableSum + nonStackableMax;
    }

    let totalScheduleReduction = 0;
    const currentSubtotal = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );

    for (const item of items) {
      const totalPriceItem = item.price * item.quantity;
      const schedDs = schedDiscMap[item.scheduleId] || [];
      const reduction = applyDiscounts(schedDs, totalPriceItem, item.quantity);
      totalScheduleReduction += reduction;
    }

    const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
    const totalBillReduction = applyDiscounts(
      billDiscounts,
      currentSubtotal,
      totalQuantity,
    );

    return totalScheduleReduction + totalBillReduction;
  };

  // ✅ Keep original method for backward compatibility
  const calculateBillDiscount = (discountsToApply: TDiscount[]): number => {
    return calculateBillDiscountForItems(discountsToApply, selectedItems);
  };

  const calculateDiscountAmount = (discount: TDiscount): number => {
    return calculateSingleDiscountAmount(discount, selectedItems);
  };

  // ✅ NEW: Payment method handlers
  const handlePaymentMethodApply = (paymentMethod: PaymentMethod) => {
    setSelectedPaymentMethod(paymentMethod);
  };

  // ✅ UPDATED: Event Handlers with expired items handling
  const toggleSelection = (id: string): void => {
    const item = bookingItems.find((item) => item.id === id);
    if (item?.isExpired) return; // ✅ NEW: Prevent selection of expired items

    const newItems = bookingItems.map((item) =>
      item.id === id ? { ...item, selected: !item.selected } : item,
    );
    setBookingItems(newItems);

    // ✅ Auto-cleanup discounts after selection change
    const newSelectedItems = newItems.filter((item) => item.selected && !item.isExpired);
    const validDiscounts = validateAndCleanDiscounts(selectedDiscounts, newSelectedItems);

    if (validDiscounts.length !== selectedDiscounts.length) {
      setSelectedDiscounts(validDiscounts);
      const newDiscount = calculateBillDiscountForItems(validDiscounts, newSelectedItems);
      setAppliedDiscount(newDiscount);
    } else if (newSelectedItems.length !== selectedItems.length) {
      // Recalculate discount if selection changed but all discounts are still valid
      const newDiscount = calculateBillDiscountForItems(validDiscounts, newSelectedItems);
      setAppliedDiscount(newDiscount);
    }
  };

  const toggleSelectAll = (): void => {
    const validItems = bookingItems.filter((item) => !item.isExpired);
    const allValidSelected =
      validItems.length > 0 && validItems.every((item) => item.selected);

    const newItems = bookingItems.map((item) => ({
      ...item,
      selected: item.isExpired ? false : !allValidSelected, // ✅ NEW: Don't select expired items
    }));
    setBookingItems(newItems);

    // ✅ Auto-cleanup discounts after select all change
    const newSelectedItems = newItems.filter((item) => item.selected && !item.isExpired);
    const validDiscounts = validateAndCleanDiscounts(selectedDiscounts, newSelectedItems);

    setSelectedDiscounts(validDiscounts);
    const newDiscount = calculateBillDiscountForItems(validDiscounts, newSelectedItems);
    setAppliedDiscount(newDiscount);
  };

  const removeItem = (id: string): void => {
    dispatch(cartThunk.deleteCartByCartId(id));
    const newItems = bookingItems.filter((item) => item.id !== id);
    setBookingItems(newItems);

    // ✅ Auto-cleanup discounts after item removal
    const newSelectedItems = newItems.filter((item) => item.selected && !item.isExpired);
    const validDiscounts = validateAndCleanDiscounts(selectedDiscounts, newSelectedItems);

    setSelectedDiscounts(validDiscounts);
    const newDiscount = calculateBillDiscountForItems(validDiscounts, newSelectedItems);
    setAppliedDiscount(newDiscount);
  };

  const increaseQuantity = (id: string): void => {
    const item = bookingItems.find((item) => item.id === id);
    if (item?.isExpired) return; // ✅ NEW: Prevent quantity change for expired items

    const newItems = bookingItems.map((item) =>
      item.id === id ? { ...item, quantity: item.quantity + 1 } : item,
    );
    setBookingItems(newItems);

    // ✅ Recalculate discount after quantity change
    const newSelectedItems = newItems.filter((item) => item.selected && !item.isExpired);
    if (selectedDiscounts.length > 0) {
      const newDiscount = calculateBillDiscountForItems(
        selectedDiscounts,
        newSelectedItems,
      );
      setAppliedDiscount(newDiscount);
    }
  };

  const decreaseQuantity = (id: string): void => {
    const item = bookingItems.find((item) => item.id === id);
    if (item?.isExpired) return; // ✅ NEW: Prevent quantity change for expired items

    const newItems = bookingItems.map((item) =>
      item.id === id ? { ...item, quantity: Math.max(1, item.quantity - 1) } : item,
    );
    setBookingItems(newItems);

    // ✅ Recalculate discount after quantity change
    const newSelectedItems = newItems.filter((item) => item.selected && !item.isExpired);
    if (selectedDiscounts.length > 0) {
      const newDiscount = calculateBillDiscountForItems(
        selectedDiscounts,
        newSelectedItems,
      );
      setAppliedDiscount(newDiscount);
    }
  };

  const handleDeleteAll = (): void => {
    bookingItems.forEach((item) => {
      dispatch(cartThunk.deleteCartByCartId(item.id));
    });
    setBookingItems([]);

    // ✅ Clear all discounts when all items are deleted
    setSelectedDiscounts([]);
    setAppliedDiscount(0);
  };

  const handleDiscountApply = (discounts: TDiscount[]) => {
    // ✅ Validate discounts before applying (only for valid items)
    const validDiscounts = validateAndCleanDiscounts(discounts, selectedItems);
    setSelectedDiscounts(validDiscounts);

    const calculatedDiscount = calculateBillDiscountForItems(
      validDiscounts,
      selectedItems,
    );
    setAppliedDiscount(calculatedDiscount);
  };

  // ✅ COMPLETELY UPDATED: Checkout handler với API flow và expired validation
  const handlerCheckout = async (): Promise<void> => {
    if (selectedItems.length === 0) {
      message.error('Please select at least one item to checkout');
      return;
    }

    if (!selectedPaymentMethod) {
      message.error('Please select a payment method');
      return;
    }

    // ✅ NEW: Check for expired items in selection
    const hasExpiredItems = selectedItems.some((item) => item.isExpired);
    if (hasExpiredItems) {
      message.error(
        'Cannot checkout with expired items. Please remove them from selection.',
      );
      return;
    }

    setIsProcessingCheckout(true);

    try {
      // // ✅ Step 1: Prepare bill data
      // const scheduleIds = selectedItems.map(item => item.scheduleId);
      // const totalQuantity = selectedItems.reduce((sum, item) => sum + item.quantity, 0);

      const createBillData = {
        schedules: selectedItems.map((item) => ({
          scheduleId: item.scheduleId,
          quantity: item.quantity,
        })), // Assuming quantity is 1 for each schedule in the bill
        discountIds: selectedDiscounts.map((discount) => discount.id),
      };


      // ✅ Step 2: Create Bill
      const billResult = await billApi.createBill(createBillData);

      // if (billThunk.createBill.fulfilled.match(billResult)) {
      const billId = billResult.id;

      message.destroy(); // Clear loading message

      // ✅ Step 3: Process Payment
      const paymentUrl = await billApi.paymentBillByBillId(billId);

      // if (billThunk.paymentBillByBillId.fulfilled.match(paymentResult)) {
      // const paymentUrl = paymentResult.payload;

      message.destroy(); // Clear loading message

      // ✅ Step 4: Redirect to payment URL
      setTimeout(() => {
        if (typeof paymentUrl === 'string' && paymentUrl.startsWith('http')) {
          window.location.href = paymentUrl;
        } else {
          message.error('Invalid payment URL received');
        }
      }, 1000); // Small delay to show success message

      // } else {
      //     // Payment API failed
      //     console.error('Payment failed:', paymentResult.payload);
      //     message.destroy();
      //     message.error(paymentResult.payload?.message || 'Failed to process payment. Please try again.');
      // }

      // } else {
      //     // Bill creation failed
      //     console.error('Bill creation failed:', billResult.payload);
      //     message.destroy();
      //     message.error(billResult.payload?.message || 'Failed to create booking. Please try again.');
      // }
    } catch (error) {
      console.error('Checkout error:', error);
      message.destroy();
      message.error('An unexpected error occurred. Please try again.');
    } finally {
      setIsProcessingCheckout(false);
    }
  };

  const isMobile = (): boolean =>
    typeof window !== 'undefined' && window.innerWidth < 768;

  if (isLoading) {
    return (
      <Layout className="min-h-screen">
        <Content className="bg-white md:bg-gray-50 pt-4 md:py-12 py-6 px-4 md:px-8">
          <div className="max-w-[1536px] mx-auto">
            <Skeleton active paragraph={{ rows: 4 }} />
            <Skeleton active paragraph={{ rows: 4 }} />
          </div>
        </Content>
      </Layout>
    );
  }

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#f97316',
          borderRadius: 8,
        },
      }}
    >
      <Layout className="min-h-screen bg-gray-50">
        <Content className="py-6 px-4 md:py-12 md:px-8">
          <div className="max-w-[1536px] mx-auto">
            <DesktopHeader />
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <Row gutter={[24, 24]} className="p-6">
                <Col xs={24} md={16} className="border-r border-gray-100">
                  <TableHeader
                    bookingItems={bookingItems}
                    toggleSelectAll={toggleSelectAll}
                  />

                  <AnimatePresence>
                    <CartList
                      bookingItems={bookingItems}
                      toggleSelection={toggleSelection}
                      removeItem={removeItem}
                      increaseQuantity={increaseQuantity}
                      decreaseQuantity={decreaseQuantity}
                      isMobile={isMobile()}
                    />
                  </AnimatePresence>
                </Col>

                <Col xs={24} md={8}>
                  <OrderSummary
                    subtotal={subtotal}
                    discount={discount}
                    total={total}
                    selectedDiscounts={selectedDiscounts}
                    selectedItemsCount={selectedItems.length}
                    validItemsCount={validItems.length}
                    selectedPaymentMethod={selectedPaymentMethod}
                    onShowDiscountSelector={() => setShowDiscountSelector(true)}
                    onShowPaymentMethodSelector={() => setShowPaymentMethodSelector(true)}
                    onCheckout={handlerCheckout}
                    calculateDiscountAmount={calculateDiscountAmount}
                    isProcessing={isProcessingCheckout || billLoading}
                  />

                  <MobileCheckout
                    selectedItemsCount={selectedItems.length}
                    validItemsCount={validItems.length}
                    total={total}
                    selectedPaymentMethod={selectedPaymentMethod}
                    onCheckout={handlerCheckout}
                    onShowPaymentMethodSelector={() => setShowPaymentMethodSelector(true)}
                    isProcessing={isProcessingCheckout || billLoading}
                  />
                </Col>
              </Row>
            </div>
          </div>
        </Content>
      </Layout>

      <DiscountSelector
        open={showDiscountSelector}
        onCancel={() => setShowDiscountSelector(false)}
        onApply={handleDiscountApply}
        subtotal={subtotal}
        selectedItems={selectedItems.map((item) => ({
          id: item.id,
          scheduleId: item.scheduleId,
          quantity: item.quantity,
          price: item.price,
          startTime: item.startTime,
          endTime: item.endTime,
          quantityAvailable: 0,
          booked: 0,
        }))}
        previouslySelectedDiscounts={selectedDiscounts}
      />

      <PaymentMethodSelector
        open={showPaymentMethodSelector}
        onCancel={() => setShowPaymentMethodSelector(false)}
        onApply={handlePaymentMethodApply}
        selectedMethod={selectedPaymentMethod}
      />
    </ConfigProvider>
  );
};
