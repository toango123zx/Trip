import React from 'react';
import { Card, Typography, Space } from 'antd';
import { boxChatThunk } from '@/features/boxChat';
import { TReduxStoreDispatch, TReduxStoreState } from '@/store';
import { useDispatch, useSelector } from 'react-redux';
import { Supplier } from '@/types';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;



interface ServiceProviderProps {
    // data?: Supplier;
    className?: string;
}

const defaultData: Supplier = {
    id: '1',
    userId: '1',
    name: 'Lorem Comp.',
    email: 'Lorem@example.com',
    phoneNumber: '0123456789',
    address: '54 Nguyễn Lương Bằng, TP Đà Nẵng',
    image: '',
    status: 'active'
};

export const AttracttionsSupplier: React.FC<ServiceProviderProps> = ({
    // data = defaultData,
    className
}) => {
    const dispatch = useDispatch<TReduxStoreDispatch>();
    const nav = useNavigate();
    const { productDetail } = useSelector(
        (state: TReduxStoreState) => state.product,
    );
    const data = productDetail.supplier || defaultData;
    const infoItems = [
        {
            label: 'Name',
            value: data.name,
            key: 'name'
        },
        {
            label: 'Email',
            value: data.email,
            key: 'email'
        },
        {
            label: 'Phone Number',
            value: data.phoneNumber,
            key: 'phone'
        },
        {
            label: 'Address',
            value: data.address,
            key: 'address'
        },
    ];

    const handleContactClick = () => {
        dispatch(boxChatThunk.createBoxChat({
            name: `${data.name} - ${localStorage.getItem('username')}`,
            boxChatMember: [
                data.userId,
            ]
        }))
        nav('/chats')
    }


    return (
        <div className="container mx-auto bg-white rounded-lg shadow-sm p-6 md:p-8 pl-10">
            <Card className={`shadow-sm bg-white ${className}`}>
                <div className="mb-6 flex flex-col gap-4">
                    <Title level={3} className="!mb-0 !text-gray-900 font-semibold">
                        Providing This Service
                    </Title>
                    <button
                        className='bg-orange-500 text-white px-4 py-2 rounded-lg mb-4 w-40'
                        onClick={handleContactClick}
                    >
                        Contact
                    </button>
                </div>

                <div className="space-y-5">
                    {infoItems.map((item) => (
                        <div key={item.key} className="sm:items-start gap-2 sm:gap-8 grid grid-cols-2">
                            <div className="sm:w-40 flex-shrink-0">
                                <Text className="font-semibold text-[#FF7A22] text-base">
                                    {item.label}
                                </Text>
                            </div>
                            <div className="flex-1">
                                <Text className="text-gray-800 text-base">
                                    {item.value}
                                </Text>
                            </div>
                        </div>
                    ))}
                </div>

            </Card>
        </div>

    );
};
