import { motion } from 'framer-motion';
import {
  CheckCircle,
  XCircle,
  FileText,
  Clock,
  Car,
  Download,
  Home,
  RefreshCw,
  Loader2,
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { billThunk } from '@/features/bill/billThunk';
import { TReduxStoreDispatch } from '@/store';

// Types
interface StepItem {
  title: string;
  icon: React.ReactNode;
  status: 'finished' | 'process' | 'wait' | 'error';
}

interface PaymentResult {
  success: boolean;
  message: string;
  billId: string;
  amount?: string;
  createAt?: Date;
}

interface PaymentResultProps {
  billId?: string;
  orderId?: string;
  status?: 'success' | 'failure';
  errorMessage?: string;
}

// Animated Icons Components
const SuccessIcon = ({ className = 'w-10 h-10' }: { className?: string }) => (
  <motion.div
    initial={{ scale: 0, rotateY: 0 }}
    animate={{ scale: [0, 1.2, 1], rotateY: [0, 180, 360] }}
    transition={{ duration: 1.2, times: [0, 0.6, 1], ease: 'easeOut' }}
  >
    <CheckCircle className={`${className} text-green-500`} />
  </motion.div>
);

const FailureIcon = ({ className = 'w-10 h-10' }: { className?: string }) => (
  <motion.div
    initial={{ x: 0 }}
    animate={{ x: [-10, 10, -10, 10, 0] }}
    transition={{ duration: 0.6, ease: 'easeInOut' }}
  >
    <XCircle className={`${className} text-red-500`} />
  </motion.div>
);

const LoadingSpinner = () => (
  <motion.div
    animate={{ rotate: 360 }}
    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
  >
    <Loader2 className="h-12 w-12 text-orange-500" />
  </motion.div>
);

// Steps Component
const CustomSteps: React.FC<{
  items: StepItem[];
  current: number;
  isError?: boolean;
}> = ({ items, current, isError = false }) => {
  const [animatedStep, setAnimatedStep] = useState(0);

  useEffect(() => {
    if (current >= 0) {
      const timer = setTimeout(() => setAnimatedStep(current), 300);
      return () => clearTimeout(timer);
    }
  }, [current]);

  return (
    <div className="w-full">
      {/* Circles and Lines */}
      <div className="flex items-center justify-between w-full relative mb-4">
        {items.map((item, index) => {
          const isActive = index === animatedStep;
          const isCompleted = index < animatedStep;
          const isErrorStep = item.status === 'error';
          const isLast = index === items.length - 1;
          const shouldAnimate = index <= animatedStep;

          return (
            <React.Fragment key={index}>
              <motion.div
                className="relative z-1 flex-shrink-0"
                initial={{ scale: 0.8, opacity: 0.5 }}
                animate={{
                  scale: shouldAnimate ? (isActive ? 1.1 : 1) : 0.8,
                  opacity: shouldAnimate ? 1 : 0.5,
                }}
                transition={{
                  duration: 0.4,
                  delay: index * 0.1,
                  type: 'spring',
                  stiffness: 300,
                  damping: 20,
                }}
              >
                <div
                  className={`
                  relative w-6 h-6 rounded-full border-2 flex items-center justify-center bg-white
                  transition-all duration-300 ease-out
                  ${isCompleted || isActive
                      ? 'border-orange-400 shadow-md'
                      : isErrorStep
                        ? 'border-red-500 animate-pulse'
                        : 'border-gray-300'
                    }
                `}
                >
                  <motion.div
                    className="w-2 h-2 rounded-full"
                    initial={{ scale: 0 }}
                    animate={{
                      scale: shouldAnimate ? 1 : 0,
                      backgroundColor:
                        isCompleted || isActive
                          ? '#fb923c'
                          : isErrorStep
                            ? '#ef4444'
                            : '#d1d5db',
                    }}
                    transition={{
                      duration: 0.3,
                      delay: index * 0.1 + 0.2,
                    }}
                  />
                </div>
              </motion.div>

              {!isLast && (
                <div className="flex-1 h-0.5 mx-2 bg-gray-300 overflow-hidden relative">
                  <motion.div
                    className="absolute top-0 left-0 h-full bg-orange-400"
                    initial={{ width: '0%' }}
                    animate={{ width: isCompleted ? '100%' : '0%' }}
                    transition={{
                      duration: 0.8,
                      delay: index * 0.2 + 0.3,
                      ease: 'easeInOut',
                    }}
                  />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Labels */}
      <div className="flex items-center justify-between w-full">
        {items.map((item, index) => {
          const isActive = index === animatedStep;
          const isCompleted = index < animatedStep;
          const isErrorStep = item.status === 'error';
          const isLast = index === items.length - 1;
          const shouldAnimate = index <= animatedStep;

          return (
            <React.Fragment key={index}>
              <motion.div
                className="flex-shrink-0 flex justify-center"
                style={{ width: '24px' }}
                initial={{ y: 10, opacity: 0 }}
                animate={{
                  y: shouldAnimate ? 0 : 10,
                  opacity: shouldAnimate ? 1 : 0.4,
                }}
                transition={{ duration: 0.3, delay: index * 0.1 + 0.4 }}
              >
                <span
                  className={`
                  text-xs font-medium text-center whitespace-nowrap transition-colors duration-300 ease-out
                  ${isCompleted || isActive
                      ? 'text-orange-500'
                      : isErrorStep
                        ? 'text-red-500'
                        : 'text-gray-400'
                    }
                `}
                >
                  {item.title}
                </span>
              </motion.div>
              {!isLast && <div className="flex-1 mx-2"></div>}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

// Result Display Components
const SuccessResult: React.FC<{ message: string }> = ({ message }) => (
  <motion.div
    className="text-center py-8 px-6"
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.8, duration: 0.6 }}
  >
    <motion.div
      className="mb-6"
      whileHover={{ scale: 1.05 }}
      transition={{ type: 'spring', stiffness: 300 }}
    >
      <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto shadow-lg">
        <SuccessIcon className="w-12 h-12 text-orange-500" />
      </div>
    </motion.div>
    <motion.h2
      className="text-2xl md:text-3xl font-bold text-gray-900 mb-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1, duration: 0.5 }}
    >
      Payment Successful!
    </motion.h2>
    <motion.p
      className="text-gray-600 text-lg max-w-md mx-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.2, duration: 0.5 }}
    >
      {message}
    </motion.p>
  </motion.div>
);

const FailureResult: React.FC<{
  message: string;
  onRetry: () => void;
  isRetrying: boolean;
}> = ({ message, onRetry, isRetrying }) => (
  <motion.div
    className="text-center py-8 px-6"
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.8, duration: 0.6 }}
  >
    <motion.div
      className="mb-6"
      whileHover={{ scale: 1.05 }}
      transition={{ type: 'spring', stiffness: 300 }}
    >
      <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto shadow-lg">
        <FailureIcon className="w-12 h-12" />
      </div>
    </motion.div>
    <motion.h2
      className="text-2xl md:text-3xl font-bold text-gray-900 mb-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1, duration: 0.5 }}
    >
      Payment Failed
    </motion.h2>
    <motion.p
      className="text-gray-600 text-lg max-w-md mx-auto mb-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.2, duration: 0.5 }}
    >
      {message}
    </motion.p>
    <motion.button
      onClick={onRetry}
      disabled={isRetrying}
      className="inline-flex items-center px-8 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.4, duration: 0.5 }}
    >
      {isRetrying ? (
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        >
          <Loader2 className="w-5 h-5 mr-3" />
        </motion.div>
      ) : (
        <RefreshCw className="w-5 h-5 mr-3" />
      )}
      Retry Payment
    </motion.button>
  </motion.div>
);

// Order Details Component
const OrderDetails: React.FC<{ paymentResult: PaymentResult }> = ({ paymentResult }) => (
  <motion.div
    className="border-t border-gray-200 bg-gray-50"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ delay: 1.5, duration: 0.5 }}
  >
    <div className="py-6 px-6 md:px-10">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Order Details</h3>
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Order ID:</span>
          <span className="font-semibold">{paymentResult.billId}</span>
        </div>
        {paymentResult.amount && (
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Amount:</span>
            <span className="font-semibold text-orange-500">
              {parseInt(paymentResult.amount).toLocaleString()} VND
            </span>
          </div>
        )}
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Date & Time:</span>
          <span className="font-semibold">
            {paymentResult.createAt?.toLocaleString('en-US')}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Status:</span>
          <span
            className={`font-semibold ${paymentResult.success ? 'text-green-600' : 'text-red-600'}`}
          >
            {paymentResult.success ? 'Paid' : 'Unpaid'}
          </span>
        </div>
      </div>
    </div>
  </motion.div>
);

// Action Buttons Component
const ActionButtons: React.FC<{
  isSuccess: boolean;
  onGenerateBill: () => void;
  onViewOrders: () => void;
  onGoHome: () => void;
}> = ({ isSuccess, onGenerateBill, onViewOrders, onGoHome }) => (
  <motion.div
    className="border-t border-gray-200 bg-white"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ delay: 1.7, duration: 0.5 }}
  >
    <div className="px-6 md:px-10 py-6">
      <div className="flex flex-col sm:flex-row gap-3 justify-end">
        {isSuccess && (
          <motion.button
            onClick={onGenerateBill}
            className="inline-flex items-center justify-center px-6 py-2 border border-orange-400 text-orange-500 rounded-lg hover:border-orange-500 hover:text-orange-600 transition-colors font-medium"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Download className="w-5 h-5 mr-2" />
            Download Invoice
          </motion.button>
        )}

        <motion.button
          onClick={onViewOrders}
          className="inline-flex items-center justify-center px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          View My Orders
        </motion.button>

        <motion.button
          onClick={onGoHome}
          className="inline-flex items-center justify-center px-6 py-2 border border-orange-400 text-orange-500 rounded-lg hover:border-orange-500 hover:text-orange-600 transition-colors font-medium"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Home className="w-5 h-5 mr-2" />
          Go Home
        </motion.button>
      </div>
    </div>
  </motion.div>
);

// Loading State Component
const LoadingState = () => (
  <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50">
    <LoadingSpinner />
    <motion.span
      className="mt-4 text-gray-600"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5 }}
    >
      Processing payment result...
    </motion.span>
    <motion.span
      className="text-sm text-gray-500 mt-2"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.8 }}
    >
      Please do not close or refresh this page
    </motion.span>
  </div>
);

// Error State Component
const ErrorState: React.FC<{ onGoHome: () => void }> = ({ onGoHome }) => (
  <motion.div
    className="min-h-screen flex flex-col justify-center items-center bg-gray-50"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
  >
    <p className="text-red-500 mb-4">Unable to load payment result information</p>
    <motion.button
      onClick={onGoHome}
      className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      Go Home
    </motion.button>
  </motion.div>
);

// Main Component
export const BillPaymentStatus: React.FC<PaymentResultProps> = ({
  billId: propsBillId,
  orderId: propsOrderId,
  status: propsStatus,
  errorMessage: propsErrorMessage,
}) => {
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch<TReduxStoreDispatch>();
  const navigate = useNavigate();

  const [isRetrying, setIsRetrying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [paymentResult, setPaymentResult] = useState<PaymentResult | null>(null);

  // Data
  const successSteps: StepItem[] = [
    {
      title: 'Order Placed',
      icon: <FileText className="w-4 h-4" />,
      status: 'finished',
    },
    { title: 'Pending', icon: <Clock className="w-4 h-4" />, status: 'finished' },
    {
      title: 'Waiting for trip',
      icon: <Car className="w-4 h-4" />,
      status: 'process',
    },
    { title: 'Done', icon: <CheckCircle className="w-4 h-4" />, status: 'wait' },
  ];

  const failureSteps: StepItem[] = [
    {
      title: 'Order Placed',
      icon: <FileText className="w-4 h-4" />,
      status: 'finished',
    },
    { title: 'Pending', icon: <XCircle className="w-4 h-4" />, status: 'error' },
    { title: 'Waiting for trip', icon: <Car className="w-4 h-4" />, status: 'wait' },
    { title: 'Done', icon: <CheckCircle className="w-4 h-4" />, status: 'wait' },
  ];

  // Handlers
  const handleRetryPayment = async () => {
    if (!paymentResult?.billId) {
      alert('Order information not found');
      return;
    }

    setIsRetrying(true);
    await dispatch(billThunk.paymentBillByBillId(paymentResult.billId));

  };

  const handleGoHome = () => navigate('/');
  const handleViewOrders = () => navigate('/my-orders');
  const handleGenerateBill = () => alert('Invoice download feature is under development');

  // Effects
  useEffect(() => {
    const processPaymentResult = async () => {
      try {
        setIsLoading(true);

        const status = searchParams.get('status');
        const billId = searchParams.get('billId') || propsBillId || '';
        const amount = searchParams.get('amount') || '';
        const createAt = new Date(searchParams.get('createAt') || '');

        let success = false;
        let displayMessage = '';

        if (status === 'success') {
          success = true;
          displayMessage = 'Payment successful! Your trip has been confirmed.';
        } else if (status === 'fail') {
          success = false;
          displayMessage = 'Payment failed. Please try again.';
        } else {
          success = propsStatus === 'success';
          displayMessage = success
            ? 'Payment successful! Your trip has been confirmed.'
            : propsErrorMessage || 'Payment failed. Please try again.';
        }

        setPaymentResult({
          success,
          message: displayMessage,
          billId,
          amount,
          createAt: createAt || new Date(),
        });
      } catch (error) {
        console.error('Error processing payment result:', error);
        setPaymentResult({
          success: false,
          message: 'An error occurred while processing payment results',
          billId: searchParams.get('billId') || propsBillId || '',
          amount: searchParams.get('amount') || '',
          createAt: new Date(searchParams.get('createAt') || ''),
        });
      } finally {
        setIsLoading(false);
      }
    };

    processPaymentResult();
  }, [searchParams, propsBillId, propsOrderId, propsStatus, propsErrorMessage]);

  // Render States
  if (isLoading) return <LoadingState />;
  if (!paymentResult) return <ErrorState onGoHome={handleGoHome} />;

  // Main Render
  return (
    <div className="min-h-screen bg-gray-50">
      <motion.div
        className="container mx-auto px-4 pt-24 pb-16"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <motion.div
          className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden"
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {/* Steps Section */}
          <motion.div
            className="px-6 md:px-10 py-6 mb-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <CustomSteps
              items={paymentResult.success ? successSteps : failureSteps}
              current={paymentResult.success ? 2 : 1}
              isError={!paymentResult.success}
            />
          </motion.div>
          {/* Result Section */}
          {paymentResult.success ? (
            <SuccessResult message={paymentResult.message} />
          ) : (
            <FailureResult
              message={paymentResult.message}
              onRetry={handleRetryPayment}
              isRetrying={isRetrying}
            />
          )}
          {/* Order Details */}
          <OrderDetails paymentResult={paymentResult} />
          {/* Action Buttons */}
          <ActionButtons
            isSuccess={paymentResult.success}
            onGenerateBill={handleGenerateBill}
            onViewOrders={handleViewOrders}
            onGoHome={handleGoHome}
          />
        </motion.div>
      </motion.div>
    </div>
  );
};
