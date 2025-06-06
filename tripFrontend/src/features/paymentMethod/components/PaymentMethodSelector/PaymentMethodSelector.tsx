import { Modal, List, Radio, Typography, Button, Card } from 'antd';
import { CreditCard, Building, Check } from 'lucide-react';
import { JSX, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

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

// ✅ UPDATED: Improved payment methods data
const paymentMethods: PaymentMethodOption[] = [
  {
    id: PaymentMethod.VNPAY,
    name: 'VNPay',
    description: 'Fast & secure payment via VNPay gateway',
    icon: (
      <div className="w-12 h-8 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg flex items-center justify-center shadow-sm">
        <span className="text-white font-bold text-xs">VNPay</span>
      </div>
    ),
    logo: 'https://cdn.haitrieu.com/wp-content/uploads/2022/10/Logo-VNPAY-QR.png',
    enabled: true,
  },
  {
    id: PaymentMethod.CARD,
    name: 'Credit/Debit Card',
    description: 'Pay securely with your card',
    icon: <CreditCard className="text-green-600" size={32} />,
    logo: 'https://cdn-icons-png.flaticon.com/512/349/349221.png',
    enabled: true,
  },
  {
    id: PaymentMethod.BANK,
    name: 'Bank Transfer',
    description: 'Direct bank transfer',
    icon: <Building className="text-purple-600" size={32} />,
    logo: 'https://cdn-icons-png.flaticon.com/512/2830/2830284.png',
    enabled: true,
  },
  {
    id: PaymentMethod.MOMO,
    name: 'MoMo E-Wallet',
    description: 'Quick payment via MoMo wallet',
    icon: (
      <div className="w-12 h-8 bg-gradient-to-r from-pink-500 to-pink-600 rounded-lg flex items-center justify-center shadow-sm">
        <span className="text-white font-bold text-xs">MoMo</span>
      </div>
    ),
    logo: 'https://developers.momo.vn/v3/assets/images/square-logo.svg',
    enabled: false,
  },
];

// ✅ ENHANCED: Payment Method Item with better UI
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
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.2 }}
  >
    <List.Item
      className={`relative overflow-hidden border-2 rounded-xl mb-3 p-4 transition-all duration-200 cursor-pointer
        ${!method.enabled
          ? 'opacity-50 bg-gray-50 border-gray-200 cursor-not-allowed'
          : isSelected
            ? 'border-orange-500 bg-gradient-to-r from-orange-50/80 to-orange-50/40'
            : 'border-gray-200 hover:border-orange-300 hover:bg-orange-50/30'
        }`}
      onClick={() => method.enabled && onSelect(method.id)}
    >
      <div className="w-full">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 flex-1 min-w-0 p-2.5">
            <Radio
              checked={isSelected}
              disabled={!method.enabled}
              onChange={() => method.enabled && onSelect(method.id)}
              onClick={(e) => e.stopPropagation()}
              className="transform scale-110"
            />

            {/* Logo Container */}
            <div className="flex-shrink-0 w-16 h-12 flex items-center justify-center bg-white border border-gray-200 rounded-xl p-2 shadow-sm transition-transform duration-200 hover:scale-105">
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

            {/* Method Info */}
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <Title level={5} className="!mb-0.5 truncate">
                  {method.name}
                </Title>
                {!method.enabled && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600">
                    Coming Soon
                  </span>
                )}
              </div>
              <Text type="secondary" className="text-sm block truncate">
                {method.description}
              </Text>
            </div>
          </div>

          {/* Selected Check Icon */}
          {/* <AnimatePresence>
            {isSelected && method.enabled && (
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                className="flex-shrink-0 w-6 h-6 rounded-full bg-orange-500 flex items-center justify-center"
              >
                <Check size={14} className="text-white" />
              </motion.div>
            )}
          </AnimatePresence> */}

          {/* VNPay Badge */}
          {method.id === PaymentMethod.VNPAY && (
            <div className="absolute top-0 right-0">
              <div className="bg-gradient-to-r bg-orange-500 text-white text-xs font-medium px-3 py-1 rounded-bl-lg rounded-tr-lg shadow-sm">
                Recommended
              </div>
            </div>
          )}
        </div>

        {/* VNPay Additional Info */}
        <AnimatePresence>
          {method.id === PaymentMethod.VNPAY && isSelected && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="mt-4"
            >
              <div className="p-3 bg-gradient-to-r from-blue-50 to-blue-50/50 border border-blue-200 rounded-xl">
                <Text className="text-sm text-blue-800 font-medium block mb-2">
                  🏦 Supported Banks
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
                      className="bg-white text-blue-700 text-xs px-2.5 py-1 rounded-lg border border-blue-200 shadow-sm transition-transform hover:scale-105"
                    >
                      {bank}
                    </span>
                  ))}
                  <span className="text-blue-600 text-xs px-2 py-1">+20 more</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </List.Item>
  </motion.div>
);

// ✅ ENHANCED: Selected Payment Display with better UI
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
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-6"
    >
      <Text className="mb-3 text-base flex items-center gap-2">
        <span className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
          <Check size={14} className="text-white" />
        </span>
        Selected Payment Method
      </Text>
      <Card 
        size="small" 
        className="bg-gradient-to-r from-green-50 to-green-50/50 border-green-200 rounded-xl shadow-sm"
      >
        <div className="flex items-center gap-4">
          <div className="w-14 h-10 flex items-center justify-center bg-white border border-gray-200 rounded-lg p-1.5 shadow-sm">
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
            <Text className="text-green-700 font-medium block">{method.name}</Text>
            <Text className="text-xs text-green-600">{method.description}</Text>
          </div>
        </div>
      </Card>
    </motion.div>
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
        <div className="flex items-center gap-3 py-1">
          <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center">
            <CreditCard className="text-orange-500" size={20} />
          </div>
          <span className="text-lg font-semibold">Select Payment Method</span>
        </div>
      }
      open={open}
      onCancel={onCancel}
      width={600}
      footer={[
        <Button 
          key="cancel" 
          onClick={onCancel}
          className="px-6"
        >
          Cancel
        </Button>,
        <Button
          key="apply"
          type="primary"
          onClick={handleApply}
          disabled={!currentSelection}
          className="px-6 bg-orange-500 hover:bg-orange-600 border-orange-500 shadow-sm"
        >
          Confirm Selection
        </Button>,
      ]}
      className="payment-method-selector-modal"
      classNames={{
        content: 'rounded-xl p-0 overflow-hidden',
        header: 'px-6 pt-6 pb-4 border-b border-gray-100',
        body: 'px-6 py-4',
        footer: 'px-6 py-4 bg-gray-50/80',
      }}
    >
      <SelectedPaymentDisplay selectedMethod={currentSelection} />

      <div className="max-h-[400px] overflow-y-auto pr-2 -mr-2">
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

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mt-4 p-3.5 bg-gradient-to-r from-gray-50 to-gray-50/50 border border-gray-200 rounded-xl"
      >
        <Text className="text-xs text-gray-600 flex items-start gap-2">
          <span className="text-orange-500 mt-0.5">💡</span>
          <span>
            <strong>Security Note:</strong> All payment transactions are encrypted and
            processed through secure channels. Your payment information is protected
            according to international PCI DSS security standards.
          </span>
        </Text>
      </motion.div>
    </Modal>
  );
};
