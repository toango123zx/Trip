import {
  GiftOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import { Modal, List, Checkbox, Typography, Tag, Button, Empty, Spin } from 'antd';
import { JSX, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { discountThunk } from '@/features/discount/discountThunk';
import { TReduxStoreDispatch, TReduxStoreState } from '@/store';
import { EDiscountStatus, TDiscount } from '@/types';

const { Text, Title } = Typography;

interface BillInfo {
  quantity: number;
  scheduleId: string;
  totalPrice: number;
  reduction: number;
  paymentPrice: number;
}

interface Bill {
  totalPrice: number;
  reductionPrice: number;
  infoBill: BillInfo[];
}

interface SelectedItem {
  id: string;
  scheduleId: string;
  quantity: number;
  price: number;
  startTime: string;
  endTime: string;
  quantityAvailable: number;
  booked: number;
}

interface DiscountSelectorProps {
  open: boolean;
  onCancel: () => void;
  onApply: (selectedDiscounts: TDiscount[]) => void;
  subtotal: number;
  selectedItems: SelectedItem[];
  previouslySelectedDiscounts?: TDiscount[];
}

// ✅ Component: Summary Section
interface SummaryProps {
  subtotal: number;
  selectedDiscounts: TDiscount[];
  getTotalDiscount: () => number;
}

const SummarySection = ({
  subtotal,
  selectedDiscounts,
  getTotalDiscount,
}: SummaryProps): JSX.Element => (
  <div className="mb-4 p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg border border-orange-200">
    <div className="grid gap-4">
      <div className="flex justify-between items-center">
        <Text>Subtotal:</Text>
        <Text strong className="text-lg">
          {subtotal.toLocaleString()} VND
        </Text>
      </div>
    </div>

    {selectedDiscounts.length > 0 ? (
      <>
        <div className="flex justify-between items-center text-orange-600 mt-3 pt-3 border-t border-orange-200">
          <Text className="font-medium">Total discount:</Text>
          <Text strong className="text-xl">
            -{(getTotalDiscount() <= subtotal ? getTotalDiscount() : subtotal).toLocaleString()} VND
          </Text>
        </div>
        <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-300">
          <Text strong className="text-lg">
            Amount to pay:
          </Text>
          <Text strong className="text-2xl text-green-600 justify-end">
            {(Math.max(0, subtotal - getTotalDiscount()) > 10000 ? Math.max(0, subtotal - getTotalDiscount()) : 10000).toLocaleString()} VND
          </Text>
        </div>
      </>
    ) : (
      <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-300">
        <Text strong className="text-lg">
          Amount to pay:
        </Text>
        <Text strong className="text-2xl text-green-600">
          {subtotal.toLocaleString()} VND
        </Text>
      </div>
    )}
  </div>
);

// ✅ Component: Selected Discounts Display
interface SelectedDiscountsProps {
  selectedDiscounts: TDiscount[];
  calculateDiscountAmount: (discount: TDiscount) => number;
}

const SelectedDiscountsSection = ({
  selectedDiscounts,
  calculateDiscountAmount,
}: SelectedDiscountsProps): JSX.Element | null => {
  if (selectedDiscounts.length === 0) return null;

  return (
    <div className="mb-4">
      <Text strong className="block mb-2 text-base">
        🎯 Selected discounts:
      </Text>
      <div className="space-y-2">
        {selectedDiscounts.map((discount) => (
          <div
            key={discount.id}
            className="flex justify-between items-center bg-orange-50 p-3 rounded-lg border border-orange-200"
          >
            <div className="flex items-center space-x-2">
              <GiftOutlined className="text-orange-500" />
              <Text className="text-orange-700 font-medium">{discount.name}</Text>
              {!discount.stackable && (
                <Tag color="red" className="text-xs">
                  Exclusive
                </Tag>
              )}
            </div>
            <Text className="text-orange-600 font-bold">
              -{calculateDiscountAmount(discount).toLocaleString()} VND
            </Text>
          </div>
        ))}
      </div>
    </div>
  );
};

// ✅ Component: Discount Tags
interface DiscountTagsProps {
  discount: TDiscount;
  selectedItems: SelectedItem[];
}

const DiscountTags = ({ discount }: DiscountTagsProps): JSX.Element => (
  <>
    {/* Stackable/Non-stackable tags */}
    <div className="flex space-x-1 flex-wrap">
      {!discount.stackable ? (
        <Tag color="red" className="text-xs">
          Non-stackable
        </Tag>
      ) : (
        <Tag color="green" className="text-xs">
          Stackable
        </Tag>
      )}
    </div>
  </>
);

// ✅ Component: Discount Info Section
interface DiscountInfoProps {
  discount: TDiscount;
}

const DiscountInfo = ({ discount }: DiscountInfoProps): JSX.Element => (
  <div className="flex items-center space-x-4 text-sm flex-wrap gap-2">
    <div className="flex items-center">
      <Text className="mr-1">Discount:</Text>
      <Text strong className="text-orange-500">
        {discount.discountType.name.includes('Percentage')
          ? `${discount.value}%`
          : `${discount.value.toLocaleString()} VND`}
      </Text>
    </div>
    <div className="flex items-center">
      <ClockCircleOutlined className="mr-1 text-gray-400" />
      <Text type="secondary">
        Used: {discount.applited}/{discount.quantity}
      </Text>
    </div>
    <div className="flex items-center">
      <Text type="secondary" className="text-xs">
        By: {discount.user.name}
      </Text>
    </div>
  </div>
);

// ✅ Component: Error/Warning Messages
interface MessageProps {
  type: 'error' | 'warning';
  message: string;
}

const MessageBox = ({ type, message }: MessageProps): JSX.Element => {
  const isError = type === 'error';
  const bgColor = isError ? 'bg-red-50 border-red-200' : 'bg-yellow-50 border-yellow-200';
  const textColor = isError ? 'text-red-600' : 'text-yellow-600';

  return (
    <div className={`mt-2 p-2 ${bgColor} border rounded`}>
      <Text className={`text-xs font-medium ${textColor}`}>
        <ExclamationCircleOutlined className="mr-1" />
        {message}
      </Text>
    </div>
  );
};

// ✅ Component: Disabled Discount Item
interface DisabledDiscountItemProps {
  discount: TDiscount;
  selectedItems: SelectedItem[];
  calculateDiscountAmount: (discount: TDiscount) => number;
  reason: string;
}

const DisabledDiscountItem = ({
  discount,
  selectedItems,
  calculateDiscountAmount,
  reason,
}: DisabledDiscountItemProps): JSX.Element => {
  const discountAmount = calculateDiscountAmount(discount);

  return (
    <List.Item
      key={discount.id}
      className="border rounded-lg mb-3 p-4 opacity-50 bg-gray-50 border-gray-200"
    >
      <div className="w-full">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3 flex-1 gap-2.5">
            <Checkbox checked={false} disabled={true} />
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2 flex-wrap">
                <Title level={5} className="mb-0 text-gray-500">
                  {discount.name}
                </Title>
                <DiscountTags discount={discount} selectedItems={selectedItems} />
              </div>
              <Text type="secondary" className="block mb-2 text-sm">
                {discount.description}
              </Text>

              {/* Together discount info */}
              {discount.discountEligibility.name === 'Together' && (
                <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded">
                  <Text className="text-xs font-medium text-blue-800 block mb-1">
                    📦 Requires booking all {discount.infoDiscount.length} tours:
                  </Text>
                  <div className="flex flex-wrap gap-1">
                    {discount.infoDiscount.map((info) => {
                      const isInCart = selectedItems.some(
                        (item) => item.scheduleId === info.productScheduleId,
                      );
                      return (
                        <Tag
                          key={info.id}
                          color={isInCart ? 'green' : 'red'}
                          className="text-xs"
                        >
                          {isInCart ? '✅' : '❌'} {info.productSchedule.productName}
                        </Tag>
                      );
                    })}
                  </div>
                </div>
              )}

              <MessageBox type="error" message={reason} />
            </div>
          </div>
          <div className="text-right ml-4">
            <Text className="text-lg text-gray-400">
              -{discountAmount.toLocaleString()}
            </Text>
            <Text className="block text-xs text-gray-400">VND</Text>
          </div>
        </div>
      </div>
    </List.Item>
  );
};

// ✅ Component: Active Discount Item
interface ActiveDiscountItemProps {
  discount: TDiscount;
  selectedItems: SelectedItem[];
  isSelected: boolean;
  isDisabled: boolean;
  discountAmount: number;
  compatibilityReason?: string;
  onDiscountChange: (discount: TDiscount, checked: boolean) => void;
}

const ActiveDiscountItem = ({
  discount,
  selectedItems,
  isSelected,
  isDisabled,
  discountAmount,
  compatibilityReason,
  onDiscountChange,
}: ActiveDiscountItemProps): JSX.Element => (
  <List.Item
    key={discount.id}
    className={`border rounded-lg mb-3 p-4 transition-all duration-200 cursor-pointer ${isDisabled ? 'opacity-50 bg-gray-50' : 'hover:shadow-md hover:border-orange-300'
      } ${isSelected ? 'border-orange-500 bg-orange-50 shadow-sm' : 'border-gray-200'}`}
    onClick={() => !isDisabled && onDiscountChange(discount, !isSelected)}
  >
    <div className="w-full px-3">
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3 flex-1 gap-2.5">
          <Checkbox
            checked={isSelected}
            disabled={isDisabled}
            onChange={(e) => {
              e.stopPropagation();
              onDiscountChange(discount, e.target.checked);
            }}
          />

          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2 flex-wrap">
              <Title level={5} className="mb-0 text-gray-800 h-full self-center">
                {discount.name}
              </Title>
              <DiscountTags discount={discount} selectedItems={selectedItems} />
            </div>

            <Text type="secondary" className="block mb-2 text-sm">
              {discount.description}
            </Text>

            <DiscountInfo discount={discount} />

            {/* Applicable products */}
            <div className="mt-2">
              <Text type="secondary" className="text-xs block mb-1">
                {discount.discountEligibility.name === 'Together'
                  ? '🎯 Requires all tours:'
                  : 'Applies to:'}
              </Text>
              <div className="flex flex-wrap gap-1">
                {discount.infoDiscount.map((info) => {
                  const isInCart = selectedItems.some(
                    (item) => item.scheduleId === info.productScheduleId,
                  );
                  return (
                    <Tag
                      key={info.id}
                      color={
                        discount.discountEligibility.name === 'Together'
                          ? isInCart
                            ? 'green'
                            : 'red'
                          : 'cyan'
                      }
                      className="text-xs"
                    >
                      {discount.discountEligibility.name === 'Together' && (
                        <span className="mr-1">{isInCart ? '✅' : '❌'}</span>
                      )}
                      {info.productSchedule.productName}
                    </Tag>
                  );
                })}
              </div>
            </div>

            {/* Warning/Error messages */}
            {isDisabled && !isSelected && compatibilityReason && (
              <MessageBox type="warning" message={compatibilityReason} />
            )}
          </div>
        </div>

        <div className="text-right ml-4">
          <Text
            strong
            className={`text-lg ${isSelected ? 'text-orange-500' : 'text-gray-600'}`}
          >
            -{discountAmount.toLocaleString()}
          </Text>
          <Text
            className={`block text-xs ${isSelected ? 'text-orange-500' : 'text-gray-500'}`}
          >
            VND
          </Text>
        </div>
      </div>
    </div>
  </List.Item>
);

// ✅ Component: Discount List Item
interface DiscountItemProps {
  discount: TDiscount;
  selectedItems: SelectedItem[];
  selectedDiscounts: TDiscount[];
  onDiscountChange: (discount: TDiscount, checked: boolean) => void;
  calculateDiscountAmount: (discount: TDiscount) => number;
  checkBasicEligibility: (discount: TDiscount) => {
    canSelect: boolean;
    reason: string;
  };
  checkDiscountCompatibility: (discount: TDiscount) => {
    canSelect: boolean;
    reason: string;
  };
}

const DiscountItem = ({
  discount,
  selectedItems,
  selectedDiscounts,
  onDiscountChange,
  calculateDiscountAmount,
  checkBasicEligibility,
  checkDiscountCompatibility,
}: DiscountItemProps): JSX.Element => {
  const isSelected = selectedDiscounts.some((d) => d.id === discount.id);
  const basicEligibility = checkBasicEligibility(discount);

  // Show disabled item if basic eligibility fails
  if (!basicEligibility.canSelect) {
    return (
      <DisabledDiscountItem
        discount={discount}
        selectedItems={selectedItems}
        calculateDiscountAmount={calculateDiscountAmount}
        reason={basicEligibility.reason}
      />
    );
  }

  // Check compatibility for active items
  const compatibility = checkDiscountCompatibility(discount);
  const isDisabled = !compatibility.canSelect && !isSelected;
  const discountAmount = calculateDiscountAmount(discount);

  return (
    <ActiveDiscountItem
      discount={discount}
      selectedItems={selectedItems}
      isSelected={isSelected}
      isDisabled={isDisabled}
      discountAmount={discountAmount}
      compatibilityReason={compatibility.reason}
      onDiscountChange={onDiscountChange}
    />
  );
};

// ✅ Main Component: DiscountSelector
export const DiscountSelector = ({
  open,
  onCancel,
  onApply,
  subtotal,
  selectedItems,
  previouslySelectedDiscounts = [],
}: DiscountSelectorProps): JSX.Element => {
  const dispatch = useDispatch<TReduxStoreDispatch>();
  const { discountsDetail, loading: apiLoading } = useSelector(
    (state: TReduxStoreState) => state.discount,
  );

  const [discounts, setDiscounts] = useState<TDiscount[]>([]);
  const [selectedDiscounts, setSelectedDiscounts] = useState<TDiscount[]>([]);

  // ✅ Effects
  useEffect(() => {
    if (open && selectedItems.length > 0) {
      const scheduleIds = selectedItems.map((item) => item.scheduleId);
      dispatch(
        discountThunk.getDiscountsAvailableByScheduleIds({
          scheduleIds,
          query: { statusSearch: EDiscountStatus.active },
        }),
      );
    }
  }, [open, selectedItems, dispatch]);

  useEffect(() => {
    if (open && discountsDetail && Array.isArray(discountsDetail)) {
      setDiscounts(discountsDetail);
    }
  }, [open, discountsDetail]);

  useEffect(() => {
    if (open) {
      setSelectedDiscounts([...previouslySelectedDiscounts]);
    }
  }, [open, previouslySelectedDiscounts]);

  // ✅ Validation Logic
  const validateDiscounts = (
    discountsToCheck: TDiscount[],
  ): { isValid: boolean; reason: string } => {
    if (discountsToCheck.length === 0) return { isValid: true, reason: '' };

    let billCount = 0;
    const multiple = discountsToCheck.length > 1;
    const seen = new Set<string>();

    for (const discount of discountsToCheck) {
      if (discount.discountApplicationScope.name === 'Bill') {
        if (++billCount > 1) {
          return {
            isValid: false,
            reason: 'Only one bill-level discount allowed',
          };
        }
      }

      if (multiple && !discount.stackable) {
        return {
          isValid: false,
          reason: 'Cannot combine non-stackable discounts',
        };
      }

      for (const info of discount.infoDiscount) {
        const key = `${info.productScheduleId}|${discount.discountApplicationScope.id}|${discount.discountProviderType}`;
        if (seen.has(key)) {
          return {
            isValid: false,
            reason:
              'Cannot apply multiple discounts with same scope and provider for one tour',
          };
        }
        seen.add(key);
      }
    }

    return { isValid: true, reason: '' };
  };

  const validateTogetherDiscounts = (
    discountsToCheck: TDiscount[],
  ): { isValid: boolean; reason: string } => {
    if (discountsToCheck.length === 0) return { isValid: true, reason: '' };

    const selectedScheduleIds = new Set(selectedItems.map((item) => item.scheduleId));

    for (const discount of discountsToCheck) {
      if (discount.discountEligibility.name === 'Together') {
        const requiredScheduleIds = discount.infoDiscount.map(
          (info) => info.productScheduleId,
        );
        const missingSchedules = requiredScheduleIds.filter(
          (id) => !selectedScheduleIds.has(id),
        );

        if (missingSchedules.length > 0) {
          return {
            isValid: false,
            reason: `Discount requires booking all ${requiredScheduleIds.length} tours, missing ${missingSchedules.length} tours`,
          };
        }
      }
    }

    return { isValid: true, reason: '' };
  };

  // ✅ Calculation Logic
  const calculateBill = (discountsToApply: TDiscount[]): Bill => {
    const validDiscounts = discountsToApply.filter((discount) => {
      if (discount.discountEligibility.name === 'Together') {
        const selectedScheduleIds = new Set(selectedItems.map((item) => item.scheduleId));
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
            const requiredItems = selectedItems.filter((item) =>
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

    const infoBill: BillInfo[] = [];
    let totalPrice = 0;
    let totalScheduleReduction = 0;

    for (const item of selectedItems) {
      const totalPriceItem = item.price * item.quantity;
      const schedDs = schedDiscMap[item.scheduleId] || [];
      const reduction = applyDiscounts(schedDs, totalPriceItem, item.quantity);

      infoBill.push({
        scheduleId: item.scheduleId,
        quantity: item.quantity,
        totalPrice: totalPriceItem,
        reduction,
        paymentPrice: totalPriceItem - reduction,
      });

      totalPrice += totalPriceItem;
      totalScheduleReduction += reduction;
    }

    const totalQuantity = selectedItems.reduce((sum, item) => sum + item.quantity, 0);
    const totalBillReduction = applyDiscounts(billDiscounts, totalPrice, totalQuantity);

    return {
      totalPrice,
      reductionPrice: totalScheduleReduction + totalBillReduction,
      infoBill,
    };
  };

  // ✅ Eligibility Checks
  const checkDiscountApplicability = (discount: TDiscount): boolean => {
    const selectedScheduleIds = new Set(selectedItems.map((item) => item.scheduleId));

    if (discount.discountEligibility.name === 'Together') {
      const requiredScheduleIds = discount.infoDiscount.map(
        (info) => info.productScheduleId,
      );
      return requiredScheduleIds.every((id) => selectedScheduleIds.has(id));
    }

    return discount.infoDiscount.some((info) =>
      selectedScheduleIds.has(info.productScheduleId),
    );
  };

  const checkBasicEligibility = (
    discount: TDiscount,
  ): { canSelect: boolean; reason: string } => {
    const now = new Date();
    const startTime = new Date(discount.startTime);
    const endTime = new Date(discount.endTime);

    if (now < startTime || now > endTime) {
      return { canSelect: false, reason: 'Not in valid time period' };
    }

    if (discount.status === 'full') {
      return { canSelect: false, reason: 'Discount usage limit reached' };
    }

    if (discount.status === 'expired') {
      return { canSelect: false, reason: 'Discount has expired' };
    }

    if (discount.status !== 'active') {
      return { canSelect: false, reason: 'Discount not available' };
    }

    if (discount.discountType.name.includes('Fixed')) {
      const remainingDiscount = discount.quantity - discount.applited;
      if (remainingDiscount <= 0) {
        return { canSelect: false, reason: 'Fixed amount discount fully used' };
      }
    }

    if (!checkDiscountApplicability(discount)) {
      if (discount.discountEligibility.name === 'Together') {
        const selectedScheduleIds = new Set(selectedItems.map((item) => item.scheduleId));
        const requiredScheduleIds = discount.infoDiscount.map(
          (info) => info.productScheduleId,
        );
        const missingCount = requiredScheduleIds.filter(
          (id) => !selectedScheduleIds.has(id),
        ).length;

        return {
          canSelect: false,
          reason: `Need to book ${missingCount} more tours to use this discount`,
        };
      }
      return {
        canSelect: false,
        reason: 'Discount not applicable to selected tours',
      };
    }

    return { canSelect: true, reason: '' };
  };

  const checkDiscountCompatibility = (
    discount: TDiscount,
  ): { canSelect: boolean; reason: string } => {
    if (selectedDiscounts.length === 0) {
      return { canSelect: true, reason: '' };
    }

    const isAlreadySelected = selectedDiscounts.some((d) => d.id === discount.id);
    if (isAlreadySelected) {
      return { canSelect: true, reason: '' };
    }

    const testDiscounts = [...selectedDiscounts, discount];
    const discountValidation = validateDiscounts(testDiscounts);
    if (!discountValidation.isValid) {
      return { canSelect: false, reason: discountValidation.reason };
    }

    const togetherValidation = validateTogetherDiscounts(testDiscounts);
    if (!togetherValidation.isValid) {
      return { canSelect: false, reason: togetherValidation.reason };
    }

    return { canSelect: true, reason: '' };
  };

  // ✅ Event Handlers
  const handleDiscountChange = (discount: TDiscount, checked: boolean) => {
    if (checked) {
      const compatibility = checkDiscountCompatibility(discount);
      if (!compatibility.canSelect) {
        console.warn('Cannot select discount:', compatibility.reason);
        return;
      }

      if (!discount.stackable) {
        setSelectedDiscounts([discount]);
      } else {
        const filteredDiscounts = selectedDiscounts.filter((d) => d.stackable);
        setSelectedDiscounts([...filteredDiscounts, discount]);
      }
    } else {
      setSelectedDiscounts((prev) => prev.filter((d) => d.id !== discount.id));
    }
  };

  const calculateDiscountAmount = (discount: TDiscount): number => {
    const bill = calculateBill([discount]);
    return bill.reductionPrice;
  };

  const getTotalDiscount = (): number => {
    if (selectedDiscounts.length === 0) return 0;
    const bill = calculateBill(selectedDiscounts);
    return bill.reductionPrice;
  };

  const handleClearAll = () => {
    setSelectedDiscounts([]);
  };

  const handleApply = () => {
    // ✅ CHANGED: Always allow apply, even with no discounts
    if (selectedDiscounts.length > 0) {
      const finalValidation = validateDiscounts(selectedDiscounts);
      if (!finalValidation.isValid) {
        console.error('Final validation failed:', finalValidation.reason);
        return;
      }

      const togetherValidation = validateTogetherDiscounts(selectedDiscounts);
      if (!togetherValidation.isValid) {
        console.error('Together validation failed:', togetherValidation.reason);
        return;
      }
    }

    // Apply with selected discounts (can be empty array)
    onApply(selectedDiscounts);
    onCancel();
  };

  // ✅ Render
  return (
    <Modal
      title={
        <div className="flex items-center space-x-2">
          <GiftOutlined className="text-orange-500" />
          <span>Select Discounts</span>
        </div>
      }
      open={open}
      onCancel={onCancel}
      width={900}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Cancel
        </Button>,
        selectedDiscounts.length > 0 && (
          <Button key="clear" onClick={handleClearAll}>
            Clear All
          </Button>
        ),
        <Button
          key="apply"
          type="primary"
          onClick={handleApply}
          className="bg-orange-500 hover:bg-orange-600 border-orange-500"
        >
          {`Apply`}
        </Button>,
      ]}
      className="discount-selector-modal"
    >
      <SummarySection
        subtotal={subtotal}
        selectedDiscounts={selectedDiscounts}
        getTotalDiscount={getTotalDiscount}
      />

      <SelectedDiscountsSection
        selectedDiscounts={selectedDiscounts}
        calculateDiscountAmount={calculateDiscountAmount}
      />

      <div className="max-h-96 overflow-y-auto pr-2">
        {apiLoading ? (
          <div className="text-center py-12">
            <Spin size="large" />
            <Text className="block mt-3 text-gray-500">Loading discounts...</Text>
          </div>
        ) : discounts.length === 0 ? (
          <div className="text-center py-8">
            <Empty
              description="No discounts available for selected tours"
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
            <div className="mt-4 p-3 bg-gray-50 border border-gray-200 rounded-lg">
              <Text className="text-sm text-gray-600">
                You can still proceed to checkout with the original price.
              </Text>
            </div>
          </div>
        ) : (
          <List
            dataSource={discounts}
            renderItem={(discount) => (
              <DiscountItem
                discount={discount}
                selectedItems={selectedItems}
                selectedDiscounts={selectedDiscounts}
                onDiscountChange={handleDiscountChange}
                calculateDiscountAmount={calculateDiscountAmount}
                checkBasicEligibility={checkBasicEligibility}
                checkDiscountCompatibility={checkDiscountCompatibility}
              />
            )}
            className="discount-list"
          />
        )}
      </div>
    </Modal>
  );
};
