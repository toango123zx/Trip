'use client';

import {
    Modal,
    Typography,
    Divider,
    Row,
    Col,
    Tag,
    Space,
    Card,
    List,
    Button,
    Spin,
} from 'antd';
import { CalendarDays, MapPin, Users, CreditCard, Building, DollarSign } from 'lucide-react';
import { JSX, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { TReduxStoreDispatch, TReduxStoreState } from '@/store';
import { EBillStatus, TBill } from '@/types/bill.type';

import { billThunk } from '../../billThunk';
import { billApi } from '../../billApi';
import { AddAttractionRatePopup } from '@/features/product';

const { Title, Text } = Typography;

type TBillDetailProps = {
    visible: boolean;
    onClose: () => void;
    billId: string | null;
};

export const BillDetail = ({ visible, onClose, billId }: TBillDetailProps): JSX.Element => {
    const [productRateVisible, setProductRateVisible] = useState<boolean>(false);
    const dispatch = useDispatch<TReduxStoreDispatch>();

    const billDetail = useSelector<TReduxStoreState, TBill>(
        (state) => state.bill.billDetail,
    );

    const paymentBillUrl = useSelector<TReduxStoreState, string>(
        (state) => state.bill.paymentBillUrl,
    );

    const loadingBill = useSelector<TReduxStoreState, boolean>(
        (state) => state.bill.loading,
    );

    useEffect(() => {
        if (visible && billId) {
            dispatch(billThunk.getBillByBillId(billId));
        }
    }, [visible, billId, dispatch]);

    useEffect(() => {
        if (paymentBillUrl && !loadingBill) {
            window.open(paymentBillUrl, '_self');
        }
    }, [paymentBillUrl, loadingBill]);

    const getStatusColor = (status: string): string => {
        switch (status) {
            case EBillStatus.paid:
                return 'green';
            case EBillStatus.cancel:
                return 'red';
            case EBillStatus.refunded:
                return 'blue';
            case EBillStatus.pending:
                return 'yellow';
            default:
                return 'default';
        }
    };

    const getRatedColor = (isRated: boolean): string => {
        return isRated ? 'green' : 'red';
    };

    const formatCurrency = (amount: number): string => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(amount);
    };

    const formatDate = (date: Date | string): string => {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const handleRetryPayment = async () => {
        if (billDetail?.id) {
            dispatch(billThunk.paymentBillByBillId(billDetail.id));
        }
    };

    const handleCancelPayment = async () => {
        if (billDetail?.id) {
            dispatch(billThunk.cancelBillByBillId(billDetail.id));
            onClose();
        }
    };

    const redirectAttraction = async (attractionId: string) => {
        window.open(`/attractions/${attractionId}`, '_self');
    }

    const handleCloseRatePopup = () => {
        setProductRateVisible(false);
    }

    const handleOpenRatePopup = () => {
        console.log(`🚀 ~ BillDetail.tsx:123 ~ handleOpenRatePopup ~ true:`, true)
        setProductRateVisible(true);
    };

    // ✅ Function to create footer buttons with unique keys
    const getFooterButtons = () => {
        const buttons = [
            <Button key="close" onClick={onClose}>
                Close
            </Button>
        ];

        // Add Cancel button for specific statuses
        if (billDetail?.status === EBillStatus.pending ||
            billDetail?.status === EBillStatus.paid ||
            billDetail?.status === EBillStatus.waitingRefund) {
            buttons.push(
                <Button
                    key="cancel-payment" // ✅ Unique key
                    onClick={handleCancelPayment}
                    className='!bg-red-500 !text-white hover:bg-red-600'
                >
                    Cancel
                </Button>
            );
        }

        // Add Checkout button for pending status
        if (billDetail?.status === EBillStatus.pending) {
            if (billDetail.transactionTargetId === 'pay') {
                buttons.push(
                    <Button
                        key="retry-checkout" // ✅ Unique key
                        onClick={handleRetryPayment}
                        className='!bg-orange-500 !text-white hover:bg-orange-600'
                    >
                        Checkout
                    </Button>
                );
            }
            if (billDetail.transactionTargetId === 'withdrawal' && localStorage.getItem('role') === 'admin') {
                buttons.push(
                    <Button
                        key="withdrawal" // ✅ Unique key
                        onClick={() => {
                            if (billDetail.id) {
                                dispatch(billThunk.payConfirmWithdrawal(billDetail.id));
                            }
                            onClose();
                        }}
                        className='!bg-orange-500 !text-white hover:bg-orange-600'
                    >
                        Confirm
                    </Button>
                );
            }
        }

        return buttons;
    };

    // Safe access to infoBill data and withdrawal data
    const infoBillData = billDetail?.infoBill || [];
    const productData = infoBillData?.[0]?.product;
    const withdrawalData = billDetail?.withdrawal;
    const isWithdrawal = billDetail?.transactionTargetId === 'withdrawal';

    return (
        <Modal
            title={
                <div className="flex items-center space-x-2">
                    {isWithdrawal ? <DollarSign size={20} /> : <CreditCard size={20} />}
                    <span>{isWithdrawal ? 'Withdrawal Details' : 'Bill Details'}</span>
                </div>
            }
            open={visible}
            onCancel={onClose}
            footer={getFooterButtons()}
            width={1000}
            styles={{
                body: {
                    maxHeight: '70vh',
                    overflowY: 'auto'
                }
            }}
        >
            {loadingBill ? (
                <div className="flex justify-center items-center py-8">
                    <Spin size="large" />
                </div>
            ) : billDetail ? (
                <div className="flex flex-col gap-y-3.5">
                    {/* User Information */}
                    {billDetail.user && (
                        <Card title="Customer Information" className="shadow-sm">
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <Text strong>Name:</Text>
                                    <Text>{billDetail.user.name}</Text>
                                </div>
                                <div className="flex justify-between">
                                    <Text strong>Email:</Text>
                                    <Text>{billDetail.user.email}</Text>
                                </div>
                                {billDetail.user.phoneNumber && (
                                    <div className="flex justify-between">
                                        <Text strong>Phone Number:</Text>
                                        <Text>{billDetail.user.phoneNumber}</Text>
                                    </div>
                                )}
                            </div>
                        </Card>
                    )}

                    {/* Bill Details */}
                    <Card title={isWithdrawal ? "Withdrawal Details" : "Payment Details"} className="shadow-sm">
                        <div className="space-y-4">
                            <Row gutter={[16, 16]}>
                                <Col xs={24} sm={12}>
                                    <div className="space-y-2">
                                        <Text strong>Transaction ID:</Text>
                                        <div>
                                            <Text strong className='!mt-2'>#{billDetail.id}</Text>
                                        </div>
                                    </div>
                                </Col>
                                <Col xs={24} sm={12}>
                                    <div className="space-y-2">
                                        <Text strong>Status:</Text>
                                        <div>
                                            <Tag color={getStatusColor(billDetail.status)} className="text-sm !px-2.5 !py-2 !mt-2">
                                                {billDetail.status}
                                            </Tag>
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                            <Row gutter={[16, 16]}>
                                <Col xs={24} sm={12}>
                                    <div>
                                        <Text strong>Created Date:</Text>
                                        <div>{formatDate(billDetail.createAt)}</div>
                                    </div>
                                </Col>
                                <Col xs={24} sm={12}>
                                    <div>
                                        <Text strong>Updated Date:</Text>
                                        <div>{formatDate(billDetail.updateAt)}</div>
                                    </div>
                                </Col>
                            </Row>

                            <Divider />

                            {/* Price Breakdown or Withdrawal Amount */}
                            {isWithdrawal ? (
                                <div className="space-y-4">
                                    <div className="flex justify-between">
                                        <Text strong>Withdrawal Amount:</Text>
                                        <Title level={5} className="!m-0 text-orange-500">
                                            {(withdrawalData?.amount || 0).toLocaleString('vi-VN')} VND
                                        </Title>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div className="flex justify-between">
                                        <Text strong>Discount:</Text>
                                        <Title level={5} className="!m-0 !text-orange-500">
                                            - {(billDetail.reductionPrice || 0).toLocaleString('vi-VN')} VND
                                        </Title>
                                    </div>
                                    <div className="flex justify-between">
                                        <Text strong>Total Amount:</Text>
                                        <Title level={5} className="!m-0 text-orange-500">
                                            {((billDetail.totalPrice || 0) - (billDetail.reductionPrice || 0)).toLocaleString('vi-VN')} VND
                                        </Title>
                                    </div>
                                </div>
                            )}
                        </div>
                    </Card>

                    {/* Withdrawal Information */}
                    {isWithdrawal && withdrawalData && (
                        <Card title="Bank Information" className="shadow-sm">
                            <div className="space-y-4">
                                <div className="flex items-center space-x-2">
                                    <Building size={16} className="text-orange-500" />
                                    <div>
                                        <Text strong>Bank Name: </Text>
                                        <Text>{withdrawalData.bankName}</Text>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <CreditCard size={16} className="text-orange-500" />
                                    <div>
                                        <Text strong>Bank Code/Account: </Text>
                                        <Text>{withdrawalData.bankCode}</Text>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <DollarSign size={16} className="text-orange-500" />
                                    <div>
                                        <Text strong>Amount: </Text>
                                        <Text type="danger" strong>
                                            {withdrawalData.amount.toLocaleString('vi-VN')} VND
                                        </Text>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    )}

                    {/* Trip Information - Only show if NOT withdrawal */}
                    {!isWithdrawal && productData && infoBillData.length > 0 && (
                        <div className="flex flex-col gap-y-3.5 shadow-sm border rounded-lg border-gray-100 p-4">
                            {infoBillData.map((infoItem) => (
                                <Card
                                    key={infoItem.id || `info-item-${infoItem.productId}`}
                                    title={
                                        <div className="flex justify-between items-center">
                                            <div className="flex items-center space-x-2">
                                                <MapPin size={16} className="text-orange-500" />
                                                <Text
                                                    strong
                                                    onClick={() => redirectAttraction(infoItem.productId)}
                                                    className='cursor-pointer hover:underline hover:!text-orange-600'
                                                >
                                                    {productData.name}
                                                </Text>
                                            </div>
                                            {billDetail.status === EBillStatus.done && (
                                                <div onClick={handleOpenRatePopup} className="cursor-pointer">
                                                    <Tag color={getRatedColor(infoItem.isRated)} className="text-sm !px-2.5 !py-2 !mt-2">
                                                        {infoItem.isRated ? 'Rated' : 'Rate Now >'}
                                                    </Tag>
                                                </div>
                                            )}
                                        </div>
                                    }
                                    className="shadow-sm"
                                >
                                    <div className="space-y-4">
                                        {infoItem.startTime && infoItem.endTime && (
                                            <div className="flex items-center space-x-2">
                                                <CalendarDays size={16} className="text-orange-500" />
                                                <Text>
                                                    {formatDate(infoItem.startTime)} - {formatDate(infoItem.endTime)}
                                                </Text>
                                            </div>
                                        )}
                                        <div className="flex items-center space-x-2">
                                            <Users size={16} className="text-orange-500" />
                                            <Text>Participants: {infoItem.quantity || 0}</Text>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <CreditCard size={16} className="text-orange-500" />
                                            <Text>Price: {(infoItem.price || 0).toLocaleString('vi-VN')} VND</Text>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    )}

                    {/* Rating Popup - Only show if NOT withdrawal */}
                    {!isWithdrawal && productData && infoBillData.length > 0 && billDetail.status === EBillStatus.done && (
                        <AddAttractionRatePopup
                            attractionId={infoBillData[0]?.productId}
                            isVisible={productRateVisible}
                            attractionName={productData.name}
                            onClose={handleCloseRatePopup}
                        />
                    )}
                </div>
            ) : (
                <div className="flex justify-center items-center py-8">
                    <Text>No {isWithdrawal ? 'withdrawal' : 'bill'} information found</Text>
                </div>
            )}
        </Modal>
    );
};