import { Modal, List, Radio, Typography, Button, Card } from 'antd';
import { CreditCard, Building } from 'lucide-react';
import { JSX, useState } from 'react';

const { Text, Title } = Typography;

export enum PaymentMethod {
  VNPAY = 'vnpay',
  CARD = 'card',
  BANK = 'bank',
  MOMO = 'momo',
}

interface PaymentMethodOption {
  id: PaymentMethod;
  name: string;
  description: string;
  icon: JSX.Element;
  logo: string;
  enabled: boolean;
}

interface PaymentMethodSelectorProps {
  open: boolean;
  onCancel: () => void;
  onApply: (paymentMethod: PaymentMethod) => void;
  selectedMethod?: PaymentMethod;
}

// ✅ UPDATED: Sử dụng logo thực tế cho các phương thức thanh toán
const paymentMethods: PaymentMethodOption[] = [
  {
    id: PaymentMethod.VNPAY,
    name: 'VNPay',
    description: 'Thanh toán qua cổng VNPay - Hỗ trợ tất cả ngân hàng Việt Nam',
    icon: (
      <div className="w-12 h-8 bg-blue-600 rounded flex items-center justify-center">
        <span className="text-white font-bold text-xs">VNP</span>
      </div>
    ),
    logo: 'https://cdn.haitrieu.com/wp-content/uploads/2022/10/Logo-VNPAY-QR.png',
    enabled: true,
  },
  {
    id: PaymentMethod.CARD,
    name: 'Credit/Debit Card',
    description: 'Thanh toán bằng thẻ tín dụng hoặc thẻ ghi nợ',
    icon: <CreditCard className="text-green-600" size={32} />,
    logo: 'https://cdn-icons-png.flaticon.com/512/349/349221.png',
    enabled: true,
  },
  {
    id: PaymentMethod.BANK,
    name: 'Bank Transfer',
    description: 'Chuyển khoản ngân hàng trực tiếp',
    icon: <Building className="text-purple-600" size={32} />,
    logo: 'https://cdn-icons-png.flaticon.com/512/2830/2830284.png',
    enabled: true,
  },
  {
    id: PaymentMethod.MOMO,
    name: 'MoMo E-Wallet',
    description: 'Thanh toán qua ví điện tử MoMo',
    icon: (
      <div className="w-12 h-8 bg-pink-600 rounded flex items-center justify-center">
        <span className="text-white font-bold text-xs">M</span>
      </div>
    ),
    logo: 'https://developers.momo.vn/v3/assets/images/square-logo.svg',
    enabled: false,
  },
];

// ✅ ENHANCED: Payment Method Item với logo và tên
interface PaymentMethodItemProps {
  method: PaymentMethodOption;
  isSelected: boolean;
  onSelect: (method: PaymentMethod) => void;
}

const PaymentMethodItem = ({
  method,
  isSelected,
  onSelect,
}: PaymentMethodItemProps): JSX.Element => (
  <List.Item
    className={`border rounded-lg mb-3 p-4 transition-all duration-200 cursor-pointer ${
      !method.enabled
        ? 'opacity-50 bg-gray-50 border-gray-200 cursor-not-allowed'
        : isSelected
          ? 'border-orange-500 bg-orange-50 shadow-sm hover:shadow-md'
          : 'border-gray-200 hover:shadow-md hover:border-orange-300'
    }`}
    onClick={() => method.enabled && onSelect(method.id)}
  >
    <div className="w-full">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4 flex-1">
          <Radio
            checked={isSelected}
            disabled={!method.enabled}
            onChange={() => method.enabled && onSelect(method.id)}
            onClick={(e) => e.stopPropagation()}
          />

          <div className="flex items-center space-x-4">
            {/* Logo/Icon */}
            <div className="w-16 h-12 flex items-center justify-center bg-white border border-gray-200 rounded-lg p-2">
              {method.logo ? (
                <img
                  src={method.logo}
                  alt={method.name}
                  className="max-w-full max-h-full object-contain"
                  onError={(e) => {
                    // Fallback to icon if logo fails to load
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    target.nextElementSibling?.classList.remove('hidden');
                  }}
                />
              ) : null}
              <div className={method.logo ? 'hidden' : ''}>{method.icon}</div>
            </div>

            {/* Payment Method Info */}
            <div>
              <Title
                level={5}
                className={`mb-1 ${!method.enabled ? 'text-gray-400' : ''}`}
              >
                {method.name}
                {!method.enabled && (
                  <span className="ml-2 text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded">
                    Coming Soon
                  </span>
                )}
              </Title>
              <Text type="secondary" className="text-sm">
                {method.description}
              </Text>
            </div>
          </div>
        </div>

        {/* VNPay Recommended Badge */}
        {method.id === PaymentMethod.VNPAY && (
          <div className="text-right">
            <div className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded">
              Recommended
            </div>
          </div>
        )}
      </div>

      {/* VNPay Bank Details */}
      {method.id === PaymentMethod.VNPAY && isSelected && (
        <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <Text className="text-sm text-blue-800 font-medium block mb-2">
            🏦 Supported Banks:
          </Text>
          <div className="flex flex-wrap gap-2">
            {[
              'Vietcombank',
              'VietinBank',
              'BIDV',
              'Agribank',
              'Techcombank',
              'MB Bank',
            ].map((bank) => (
              <span
                key={bank}
                className="bg-white text-blue-700 text-xs px-2 py-1 rounded border border-blue-200"
              >
                {bank}
              </span>
            ))}
            <span className="text-blue-600 text-xs px-2 py-1">+20 more...</span>
          </div>
        </div>
      )}
    </div>
  </List.Item>
);

// ✅ ENHANCED: Selected Payment Display với logo
interface SelectedPaymentDisplayProps {
  selectedMethod: PaymentMethod | undefined;
}

const SelectedPaymentDisplay = ({
  selectedMethod,
}: SelectedPaymentDisplayProps): JSX.Element | null => {
  if (!selectedMethod) return null;

  const method = paymentMethods.find((m) => m.id === selectedMethod);
  if (!method) return null;

  return (
    <div className="mb-4">
      <Text strong className="block mb-2 text-base">
        🎯 Selected payment method:
      </Text>
      <Card size="small" className="bg-green-50 border-green-200">
        <div className="flex items-center space-x-3">
          {/* Logo */}
          <div className="w-12 h-8 flex items-center justify-center bg-white border border-gray-200 rounded p-1">
            {method.logo ? (
              <img
                src={method.logo}
                alt={method.name}
                className="max-w-full max-h-full object-contain"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  target.nextElementSibling?.classList.remove('hidden');
                }}
              />
            ) : null}
            <div className={method.logo ? 'hidden' : ''}>{method.icon}</div>
          </div>

          <div>
            <Text className="text-green-700 font-medium">{method.name}</Text>
            <Text className="block text-xs text-green-600">{method.description}</Text>
          </div>
        </div>
      </Card>
    </div>
  );
};

// ✅ UTILITY: Get payment method info for external use
export const getPaymentMethodInfo = (paymentMethod?: PaymentMethod) => {
  if (!paymentMethod) return null;
  return paymentMethods.find((m) => m.id === paymentMethod);
};

export const PaymentMethodSelector = ({
  open,
  onCancel,
  onApply,
  selectedMethod,
}: PaymentMethodSelectorProps): JSX.Element => {
  const [currentSelection, setCurrentSelection] = useState<PaymentMethod | undefined>(
    selectedMethod,
  );

  const handleApply = () => {
    if (currentSelection) {
      onApply(currentSelection);
      onCancel();
    }
  };

  const handleMethodSelect = (method: PaymentMethod) => {
    setCurrentSelection(method);
  };

  return (
    <Modal
      title={
        <div className="flex items-center space-x-2">
          <CreditCard className="text-orange-500" />
          <span>Select Payment Method</span>
        </div>
      }
      open={open}
      onCancel={onCancel}
      width={600}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Cancel
        </Button>,
        <Button
          key="apply"
          type="primary"
          onClick={handleApply}
          disabled={!currentSelection}
          className="bg-orange-500 hover:bg-orange-600 border-orange-500"
        >
          Select Payment Method
        </Button>,
      ]}
      className="payment-method-selector-modal"
    >
      <SelectedPaymentDisplay selectedMethod={currentSelection} />

      <div className="max-h-96 overflow-y-auto pr-2">
        <List
          dataSource={paymentMethods}
          renderItem={(method) => (
            <PaymentMethodItem
              method={method}
              isSelected={currentSelection === method.id}
              onSelect={handleMethodSelect}
            />
          )}
          className="payment-method-list"
        />
      </div>

      <div className="mt-4 p-3 bg-gray-50 border border-gray-200 rounded-lg">
        <Text className="text-xs text-gray-600">
          💡 <strong>Security Note:</strong> All payment transactions are encrypted and
          secure. Your payment information is protected according to international
          security standards.
        </Text>
      </div>
    </Modal>
  );
};
