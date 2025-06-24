import { TableColumnsType, notification } from 'antd';
import { JSX, useState, useEffect } from 'react';
import { IoIosArrowRoundForward } from 'react-icons/io';

import {
    BaseTable,
    renderStatusBadge,
    formatDateTime,
} from '@/components/BaseTable/BaseTable';
import { cn } from '@/lib';
import { TProductSchedule, EProductScheduleStatus } from '@/types';
import { TRequestBodyCreateRoomType } from '../../product.type';
import { RoomTypeForm } from '../RooomTypeForm/RoomTypeForm';

type TRoomTypeBoardProps = {
    productId?: string;
    data?: TProductSchedule[] | TRequestBodyCreateRoomType[];
    pageSize?: number;
    page?: number;
    disabled?: boolean;
    onViewDetailSchedule?: (
        roomType: TRequestBodyCreateRoomType,
    ) => void;
    handleClosePopup?: () => void;
    className?: string;
    setPage?: (page: number) => void;
    onDeleteSuccess?: () => void;
    onRemoveRoom?: (roomId: string) => void;  // Add callback for remove action
    onUpdateData?: (updatedData: TRequestBodyCreateRoomType[]) => void; // Add callback for data update
    pagination?: {
        totalItems: number;
    };
};

const STATUS_MAP = {
    waiting: { color: 'orange', label: 'Waiting' },
    active: { color: 'green', label: 'Active' },
    waitingAdd: { color: 'yellow', label: 'Waiting Add' },
    waitingRemove: { color: 'red', label: 'Waiting Remove' },
    inactive: { color: 'red', label: 'Inactive' },
} as const;

export const RoomTypeBoard = ({
    data,
    pageSize,
    page,
    disabled = false,
    className,
    setPage,
    handleClosePopup,
    onDeleteSuccess,
    onRemoveRoom,
    onUpdateData,
    pagination,
}: TRoomTypeBoardProps): JSX.Element => {
    const [localData, setLocalData] = useState<TProductSchedule[] | TRequestBodyCreateRoomType[]>(data || []);
    const [selectedRoomType, setSelectedRoomType] = useState<TProductSchedule | null | TRequestBodyCreateRoomType>(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);
	const [roomType, setRoomType] = useState<TRequestBodyCreateRoomType | TProductSchedule>({} as TRequestBodyCreateRoomType | TProductSchedule);

    const fetchData = async () => {
        try {
            // Update API call for room types if needed
            // const response = await roomTypeApi.getRoomTypes();
            // setLocalData(response.data);
        } catch (error) {
            notification.error({
                message: 'Error',
                description: 'Cannot refresh room type list',
                duration: 3,
            });
        }
    };

    useEffect(() => {
        setLocalData(data || []);
    }, [data]);

    const handleViewDetail = async (roomType: TProductSchedule | TRequestBodyCreateRoomType) => {
        try {
            if ('status' in roomType && roomType.status !== EProductScheduleStatus.waitingAdd) {
                // For existing room types, fetch detailed data if API exists
                // const response = await roomTypeApi.getRoomTypeById(roomType.id);
                // setSelectedRoomType(response);
                setSelectedRoomType(roomType);
            } else {
                setSelectedRoomType(roomType);
            }
            setIsDetailOpen(true);
        } catch (error) {
            notification.error({
                message: 'Error',
                description: 'Cannot get room type details',
                duration: 3,
            });
        }
    };

    const handleRoomTypeDeleted = () => {
        if (onDeleteSuccess) {
            onDeleteSuccess();
        }
    };

    // Handle remove room type
    const handleRemoveRoomType = (roomType: TRequestBodyCreateRoomType | TProductSchedule) => {
        console.log(`🚀 ~ RoomTypeBoard.tsx:107 ~ handleRemoveRoomType ~ roomType:`, roomType)
        try {
            const updatedData = [...localData] as TRequestBodyCreateRoomType[];
            
            if ('status' in roomType) {
                if (roomType.status === EProductScheduleStatus.waitingAdd) {
                    // Remove from list if waitingAdd
                    const filteredData = updatedData.filter(item => item.id !== roomType.id);
                    setLocalData(filteredData);
                    
                    // Notify parent component
                    if (onUpdateData) {
                        onUpdateData(filteredData);
                    }
                    
                    notification.success({
                        message: 'Success',
                        description: 'Room type removed from list',
                        duration: 3,
                    });
                } else if (roomType.status === EProductScheduleStatus.active) {
                    // Change status to waitingRemove if active
                    const updatedIndex = updatedData.findIndex(item => item.id === roomType.id);
                    if (updatedIndex !== -1) {
                        updatedData[updatedIndex] = {
                            ...updatedData[updatedIndex],
                            status: EProductScheduleStatus.waitingRemove
                        };
                        setLocalData(updatedData);
                        
                        // Notify parent component
                        if (onUpdateData) {
                            onUpdateData(updatedData);
                        }
                        
                        // Add to remove list
                        if (onRemoveRoom) {
                            onRemoveRoom(roomType.id);
                        }
                        
                        notification.success({
                            message: 'Success',
                            description: 'Room type marked for removal',
                            duration: 3,
                        });
                    }
                } else if (roomType.status === EProductScheduleStatus.waitingRemove) {
                    // If already waitingRemove, show info message
                    notification.info({
                        message: 'Info',
                        description: 'Room type is already marked for removal',
                        duration: 3,
                    });
                }
				setIsDetailOpen(false);
            }
        } catch (error) {
            notification.error({
                message: 'Error',
                description: 'Failed to remove room type',
                duration: 3,
            });
        }
    };

    const columnTable: TableColumnsType<TRequestBodyCreateRoomType> = [
        {
            title: 'Room Type ID',
            dataIndex: 'id',
            key: 'id',
            className: 'hidden',
            render: (value: string | undefined) => value ?? '-',
        },
        {
            title: 'Room Name',
            dataIndex: 'name',
            key: 'name',
            sorter: (a, b) => (a.name || '').localeCompare(b.name || ''),
            sortDirections: ['descend', 'ascend'],
            render: (value: string) => value ?? '-',
        },
        {
            title: 'Available Rooms',
            dataIndex: 'quantity',
            key: 'quantity',
            sorter: (a, b) => (a.quantity || 0) - (b.quantity || 0),
            sortDirections: ['descend', 'ascend'],
            render: (value: number | undefined) => value ?? 0,
        },
        {
            title: 'Max Occupancy',
            dataIndex: 'maxOccupancy',
            key: 'maxOccupancy',
            sorter: (a, b) => (a.maxOccupancy || 0) - (b.maxOccupancy || 0),
            sortDirections: ['descend', 'ascend'],
            render: (value: number | undefined) => value ?? 0,
        },
        {
            title: 'Price (VND)',
            dataIndex: 'price',
            key: 'price',
            sorter: (a, b) => (a.price || 0) - (b.price || 0),
            sortDirections: ['descend', 'ascend'],
            render: (value: number) => `${(value || 0).toLocaleString()} VND`,
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            sorter: (a, b) => (a.status?.length || 0) - (b.status?.length || 0),
            sortDirections: ['descend', 'ascend'],
            render: (text: string) =>
                renderStatusBadge(text || EProductScheduleStatus.active, STATUS_MAP),
        },
        {
            title: 'Action',
            className: `${disabled ?? 'hover:cursor-no-drop'}`,
            render: (roomType: TRequestBodyCreateRoomType | TProductSchedule) => (
                <div className="flex gap-2 items-center">
                    <button
                        type="button"
                        onClick={() =>{
                            !disabled ? handleViewDetail(roomType) : (): void => { }
							setRoomType(roomType)
						}

                        }
                        className={`text-blue-500 flex gap-2.5 items-center`}
                    >
                        <span>View Details</span>
                        {/* <span className="h-fit">
                            <IoIosArrowRoundForward />
                        </span> */}
                    </button>
                    
                    {/* Remove button */}
                    {/* {!disabled && 'status' in roomType && roomType.status !== EProductScheduleStatus.waitingRemove && (
                        <button
                            type="button"
                            onClick={() => handleRemoveRoomType(roomType)}
                            className="text-red-500 hover:text-red-700 ml-2 px-2 py-1 rounded border border-red-300 hover:border-red-500"
                        >
                            Remove
                        </button>
                    )} */}
                    
                    {/* Show status for waitingRemove */}
                    {/* {'status' in roomType && roomType.status === EProductScheduleStatus.waitingRemove && (
                        <span className="text-red-500 text-sm ml-2">
                            Pending Removal
                        </span>
                    )} */}
                </div>
            ),
        },
    ];

    return (
        <>
            <BaseTable<TRequestBodyCreateRoomType>
                rowKey="id"
                columns={columnTable}
                dataSource={localData as TRequestBodyCreateRoomType[]}
                className={cn(className)}
                pagination={{
                    current: page,
                    pageSize: pageSize,
                    total: pagination?.totalItems,
                    onChange: (newPage) => setPage?.(newPage),
                    showSizeChanger: false
                }}
                size="middle"
            />

            {/* Room Type Detail Modal for existing room types */}
            {(selectedRoomType && 'status' in selectedRoomType && selectedRoomType.status !== EProductScheduleStatus.waitingAdd) && (
                <RoomTypeForm
                    productName={'Room Details'}
                    data={selectedRoomType as TRequestBodyCreateRoomType}
                    setData={(newData) => setSelectedRoomType(newData)}
                    isCreate={false}
                    isRemove={true}
                    disabled={true} // Read-only for existing room types
                    onCancel={() => setIsDetailOpen(false)}
                    onRemove={() => handleRemoveRoomType(roomType)}
                    onDeleteSuccess={() => {
                        handleRoomTypeDeleted();
                        fetchData();
                        setIsDetailOpen(false);
                    }}
                />
            )}

            {/* Room Type Form for waitingAdd status */}
            {(isDetailOpen && selectedRoomType && (!('status' in selectedRoomType) || selectedRoomType.status === EProductScheduleStatus.waitingAdd)) && (
                <RoomTypeForm
                    productName={'Edit Room Type'}
                    data={data?.filter((item) => item.id === selectedRoomType.id)[0] as TRequestBodyCreateRoomType}
                    setData={(newData) => setSelectedRoomType(newData)}
                    isCreate={false}
                    isRemove={true}
                    disabled={disabled}
                    onCancel={() => setIsDetailOpen(false)}
                    onRemove={() => handleRemoveRoomType(roomType)}
                />
            )}
        </>
    );
};