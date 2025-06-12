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
import { CalendarDays, MapPin, Users, CreditCard } from 'lucide-react';
import { JSX, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { TReduxStoreDispatch, TReduxStoreState } from '@/store';
import { TBill } from '@/types/bill.type';

import { billThunk } from '../../billThunk';

const { Title, Text } = Typography;

type TBillDetailProps = {
    visible: boolean;
    onClose: () => void;
    billId: string | null;
};

export const BillDetail = ({ visible, onClose, billId }: TBillDetailProps): JSX.Element => {
    const dispatch = useDispatch<TReduxStoreDispatch>();
    const billDetail = useSelector<TReduxStoreState, TBill | null>(
        (state) => state.bill.billDetail,
    );
    const loading = useSelector<TReduxStoreState, boolean>(
        (state) => state.bill.loading,
    );

    useEffect(() => {
        if (visible && billId) {
            dispatch(billThunk.getBillByBillId(billId));
        }
    }, [visible, billId, dispatch]);

    useEffect(() => {
        console.log(`🚀 ~ BillDetail.tsx:48 ~ billDetail:`, billDetail)
    }, [billDetail]);

    const getStatusColor = (status: string): string => {
        switch (status) {
            case 'DONE':
                return 'green';
            case 'CANCELED':
                return 'red';
            case 'WAITING':
                return 'blue';
            case 'PENDING':
                return 'orange';
            default:
                return 'default';
        }
    };

    const formatCurrency = (amount: number): string => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(amount);
    };

    const formatDate = (date: Date | string): string => {
        return new Date(date).toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    // Safe access to infoBill data
    const infoBillData = billDetail?.infoBill?.[0];
    const productData = infoBillData?.product;

    return (
        <Modal
            title={
                <div className="flex items-center space-x-2">
                    <CreditCard size={20} />
                    <span>Chi tiết hóa đơn</span>
                </div>
            }
            open={visible}
            onCancel={onClose}
            footer={[
                <Button key="close" onClick={onClose}>
                    Đóng
                </Button>,
            ]}
            width={800}
            bodyStyle={{ maxHeight: '70vh', overflowY: 'auto' }}
        >
            {loading ? (
                <div className="flex justify-center items-center py-8">
                    <Spin size="large" />
                </div>
            ) : billDetail ? (
                <div className="space-y-6">
                    {/* Header Information */}
                    <Card className="bg-gradient-to-r from-orange-50 to-orange-100">
                        <Row gutter={[16, 16]}>
                            <Col xs={24} sm={12}>
                                <div className="space-y-2">
                                    <Text strong>Mã hóa đơn:</Text>
                                    <Title level={4} className="!mb-0">
                                        #{billDetail.id}
                                    </Title>
                                </div>
                            </Col>
                            <Col xs={24} sm={12}>
                                <div className="space-y-2">
                                    <Text strong>Trạng thái:</Text>
                                    <div>
                                        <Tag color={getStatusColor(billDetail.status)} className="text-sm px-3 py-1">
                                            {billDetail.status}
                                        </Tag>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </Card>

                    {/* Trip Information */}
                    {infoBillData && productData && (
                        <Card title="Thông tin chuyến đi" className="shadow-sm">
                            <div className="space-y-4">
                                <div className="flex items-center space-x-2">
                                    <MapPin size={16} className="text-orange-500" />
                                    <Text strong>{productData.name}</Text>
                                </div>
                                {infoBillData.startTime && infoBillData.endTime && (
                                    <div className="flex items-center space-x-2">
                                        <CalendarDays size={16} className="text-orange-500" />
                                        <Text>
                                            {formatDate(infoBillData.startTime)} - {formatDate(infoBillData.endTime)}
                                        </Text>
                                    </div>
                                )}
                                <div className="flex items-center space-x-2">
                                    <Users size={16} className="text-orange-500" />
                                    <Text>Số người tham gia: {infoBillData.quantity || 0}</Text>
                                </div>
                                {productData.description && (
                                    <div>
                                        <Text strong>Mô tả: </Text>
                                        <Text>{productData.description}</Text>
                                    </div>
                                )}
                            </div>
                        </Card>
                    )}

                    {/* Bill Details */}
                    <Card title="Chi tiết thanh toán" className="shadow-sm">
                        <div className="space-y-4">
                            <Row gutter={[16, 16]}>
                                <Col xs={24} sm={12}>
                                    <div>
                                        <Text strong>Ngày tạo:</Text>
                                        <div>{formatDate(billDetail.createAt)}</div>
                                    </div>
                                </Col>
                                <Col xs={24} sm={12}>
                                    <div>
                                        <Text strong>Ngày cập nhật:</Text>
                                        <div>{formatDate(billDetail.updateAt)}</div>
                                    </div>
                                </Col>
                            </Row>

                            <Divider />

                            {/* Price Breakdown */}
                            {infoBillData && (
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <Text>Giá mỗi người:</Text>
                                        <Text>{formatCurrency(infoBillData.price || 0)}</Text>
                                    </div>
                                    <div className="flex justify-between">
                                        <Text>Số lượng:</Text>
                                        <Text>{infoBillData.quantity || 0} người</Text>
                                    </div>
                                    <Divider />
                                    <div className="flex justify-between">
                                        <Text strong>Tổng cộng:</Text>
                                        <Title level={4} className="!mb-0 text-orange-500">
                                            {formatCurrency((infoBillData.price || 0) * (infoBillData.quantity || 0))}
                                        </Title>
                                    </div>
                                </div>
                            )}
                        </div>
                    </Card>

                    {/* User Information */}
                    {billDetail.user && (
                        <Card title="Thông tin khách hàng" className="shadow-sm">
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <Text strong>Tên:</Text>
                                    <Text>{billDetail.user.name}</Text>
                                </div>
                                <div className="flex justify-between">
                                    <Text strong>Email:</Text>
                                    <Text>{billDetail.user.email}</Text>
                                </div>
                                {billDetail.user.phoneNumber && (
                                    <div className="flex justify-between">
                                        <Text strong>Số điện thoại:</Text>
                                        <Text>{billDetail.user.phoneNumber}</Text>
                                    </div>
                                )}
                            </div>
                        </Card>
                    )}

                    {/* Additional Information */}
                    {/* {billDetail.note && (
                        <Card title="Ghi chú" className="shadow-sm">
                            <Text>{billDetail.note}</Text>
                        </Card>
                    )} */}
                </div>
            ) : (
                <div className="flex justify-center items-center py-8">
                    <Text>Không tìm thấy thông tin hóa đơn</Text>
                </div>
            )}
        </Modal>
    );
};