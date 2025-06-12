import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    Card,
    Segmented,
    DatePicker,
    Row,
    Col,
    Spin,
    Typography,
    Space,
    Button,
    Statistic,
    Select
} from 'antd';
import { Line } from '@ant-design/charts';
import { CalendarOutlined, DollarOutlined, ShoppingCartOutlined, ReloadOutlined } from '@ant-design/icons';
import dayjs, { Dayjs } from 'dayjs';
import { TReduxStoreDispatch, TReduxStoreState } from '@/store';
import { TRequestQueryQueryStatistic } from '@/features/statistic/statistic.type';
import { MainLayout } from '@/layouts';
import { statisticThunk } from '../../statisticThunk';
import { productThunk } from '@/features/product/productThunk';
import { EStatisticTimeUnit } from '@/types';
import { TProductSumary } from '@/types';

const { Title } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;

type ChartType = 'revenue' | 'booked' | 'both';

// ProductSelector Component - Inline
interface ProductSelectorProps {
    value?: string;
    onChange?: (productId: string | undefined) => void;
    placeholder?: string;
    allowClear?: boolean;
    disabled?: boolean;
    className?: string;
}

const ProductSelector: React.FC<ProductSelectorProps> = ({
    value,
    onChange,
    placeholder = "Chọn sản phẩm",
    allowClear = true,
    disabled = false,
    className
}) => {
    const dispatch = useDispatch<TReduxStoreDispatch>();
    const [loading, setLoading] = useState(false);
    const [products, setProducts] = useState<TProductSumary[]>([]);

    // Load products khi component mount
    useEffect(() => {
        const loadProducts = async () => {
            try {
                setLoading(true);
                console.log('🔄 ProductSelector - Loading products...');
                
                const result = await dispatch(productThunk.getProductsManagement({
                    page: 1,
                    limit: 100,
                })).unwrap();
                
                const [productData] = result;
                setProducts(productData || []);
                
                console.log('✅ ProductSelector - Products loaded:', productData?.length);
            } catch (error) {
                console.error('❌ ProductSelector - Error loading products:', error);
                setProducts([]);
            } finally {
                setLoading(false);
            }
        };

        loadProducts();
    }, [dispatch]);

    const handleChange = (selectedValue: string | undefined) => {
        console.log('📋 ProductSelector - Selected product ID:', selectedValue);
        onChange?.(selectedValue);
    };

    return (
        <Select
            value={value}
            onChange={handleChange}
            placeholder={placeholder}
            allowClear={allowClear}
            disabled={disabled || loading}
            className={className}
            style={{ width: '100%' }}
            showSearch
            optionFilterProp="children"
            filterOption={(input, option) =>
                (option?.children as unknown as string)
                    ?.toLowerCase()
                    .includes(input.toLowerCase())
            }
            notFoundContent={loading ? <Spin size="small" /> : 'Không có sản phẩm nào'}
        >
            {products.map((product) => (
                <Option key={product.id} value={product.id}>
                    <div className="flex items-center justify-between">
                        <span className="font-medium">{product.name}</span>
                        <span className="text-gray-500 text-sm ml-2">
                            {product.city}
                        </span>
                    </div>
                </Option>
            ))}
        </Select>
    );
};

// useProductSelector Hook - Inline
interface UseProductSelectorReturn {
    selectedProductId: string | undefined;
    setSelectedProductId: (productId: string | undefined) => void;
    handleProductChange: (productId: string | undefined) => void;
    getApiParams: () => { productId?: string };
}

const useProductSelector = (initialProductId?: string): UseProductSelectorReturn => {
    const [selectedProductId, setSelectedProductId] = useState<string | undefined>(initialProductId);

    const handleProductChange = useCallback((productId: string | undefined) => {
        setSelectedProductId(productId);
        console.log('🎯 Product selection changed:', productId || 'None selected');
    }, []);

    const getApiParams = useCallback(() => {
        return {
            productId: selectedProductId || undefined,
        };
    }, [selectedProductId]);

    return {
        selectedProductId,
        setSelectedProductId,
        handleProductChange,
        getApiParams,
    };
};

// Main StatisticsChart Component
export const StatisticsChart: React.FC = () => {
    const dispatch = useDispatch<TReduxStoreDispatch>();
    const { revenueData, bookedData, loading } = useSelector(
        (state: TReduxStoreState) => state.statistic
    );

    // States
    const [timeUnit, setTimeUnit] = useState<EStatisticTimeUnit>(EStatisticTimeUnit.day);
    const [chartType, setChartType] = useState<ChartType>('both');
    const [dateRange, setDateRange] = useState<[Dayjs, Dayjs]>([
        dayjs().subtract(30, 'day'),
        dayjs()
    ]);

    // Product selector hook
    const {
        selectedProductId,
        handleProductChange,
        getApiParams,
    } = useProductSelector();

    // Time unit options
    const timeUnitOptions = [
        { label: 'Giờ', value: EStatisticTimeUnit.hour },
        { label: 'Ngày', value: EStatisticTimeUnit.day },
        { label: 'Tháng', value: EStatisticTimeUnit.month },
        { label: 'Năm', value: EStatisticTimeUnit.year }
    ];

    // Chart type options
    const chartTypeOptions = [
        { label: 'Thu nhập', value: 'revenue' },
        { label: 'Lượt đặt', value: 'booked' },
        { label: 'Cả hai', value: 'both' }
    ];

    // Fetch data function - Updated with productId
    const fetchData = async () => {
        const productParams = getApiParams();

        const query: TRequestQueryQueryStatistic = {
            timeUnit,
            startTimeSearch: dateRange[0].toDate(),
            endTimeSearch: dateRange[1].toDate(),
            ...productParams,
        };

        console.log('📊 StatisticsChart - Fetching data with query:', query);

        try {
            if (chartType === 'revenue' || chartType === 'both') {
                await dispatch(statisticThunk.getRevenue(query));
            }
            if (chartType === 'booked' || chartType === 'both') {
                await dispatch(statisticThunk.getBooked(query));
            }
        } catch (error) {
            console.error('❌ StatisticsChart - Error fetching data:', error);
        }
    };

    // Initial load and when dependencies change - Added selectedProductId
    useEffect(() => {
        fetchData();
    }, [timeUnit, chartType, dateRange, selectedProductId]);

    // Debug data
    useEffect(() => {
        console.log('📈 Revenue Data:', revenueData);
        console.log('📈 Booked Data:', bookedData);
        console.log('🎯 Selected Product ID:', selectedProductId);
        console.log('🔄 Loading:', loading);
    }, [revenueData, bookedData, loading, selectedProductId]);

    // Format data for charts
    const formatChartData = () => {
        const data: any[] = [];

        console.log('🔄 Formatting chart data...');

        if ((chartType === 'revenue' || chartType === 'both') && revenueData?.length > 0) {
            console.log('💰 Processing revenue data:', revenueData);
            revenueData.forEach((item, index) => {
                const formattedItem = {
                    date: item.timePoint,
                    value: Number(item.value),
                    type: 'Thu nhập',
                    category: 'revenue',
                    originalDate: item.timePoint
                };
                console.log(`Revenue item ${index}:`, formattedItem);
                data.push(formattedItem);
            });
        }

        if ((chartType === 'booked' || chartType === 'both') && bookedData?.length > 0) {
            console.log('📦 Processing booked data:', bookedData);
            bookedData.forEach((item, index) => {
                const formattedItem = {
                    date: item.timePoint,
                    value: Number(item.value),
                    type: 'Lượt đặt',
                    category: 'booked',
                    originalDate: item.timePoint
                };
                console.log(`Booked item ${index}:`, formattedItem);
                data.push(formattedItem);
            });
        }

        const sortedData = data.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        console.log('📊 Final formatted data:', sortedData);

        return sortedData;
    };

    // Get formatted date for display
    const formatDateForDisplay = (dateStr: string) => {
        const date = dayjs(dateStr);
        switch (timeUnit) {
            case EStatisticTimeUnit.hour:
                return date.format('DD/MM HH:mm');
            case EStatisticTimeUnit.day:
                return date.format('DD/MM');
            case EStatisticTimeUnit.month:
                return date.format('MM/YYYY');
            case EStatisticTimeUnit.year:
                return date.format('YYYY');
            default:
                return date.format('DD/MM');
        }
    };

    // Chart configuration
    const chartData = formatChartData();

    const chartConfig = {
        data: chartData,
        xField: 'date',
        yField: 'value',
        seriesField: 'type',
        smooth: true,
        height: 400,
        autoFit: true,
        color: ['#1890ff', '#52c41a'],
        point: {
            size: 4,
            shape: 'circle',
        },
        legend: {
            position: 'top' as const,
        },
        xAxis: {
            type: 'time',
            tickCount: 5,
            label: {
                formatter: (val: string) => formatDateForDisplay(val),
                rotate: -45,
            },
        },
        yAxis: {
            label: {
                formatter: (val: number) => {
                    if (chartType === 'revenue') {
                        return `${val.toLocaleString('vi-VN')}`;
                    } else if (chartType === 'booked') {
                        return `${val}`;
                    } else {
                        return val > 1000 ? `${val.toLocaleString('vi-VN')}` : `${val}`;
                    }
                },
            },
        },
        tooltip: {
            formatter: (datum: any) => {
                const isRevenue = datum.category === 'revenue';
                return {
                    name: datum.type,
                    value: isRevenue ?
                        `${Number(datum.value).toLocaleString('vi-VN')} VND` :
                        `${datum.value} lượt`
                };
            },
        },
        interactions: [
            {
                type: 'marker-active',
            },
        ],
    };

    // Calculate totals
    const totalRevenue = revenueData?.reduce((sum, item) => sum + Number(item.value), 0) || 0;
    const totalBooked = bookedData?.reduce((sum, item) => sum + Number(item.value), 0) || 0;

    // Get date format for range picker
    const getDateFormat = () => {
        switch (timeUnit) {
            case EStatisticTimeUnit.hour:
                return 'YYYY-MM-DD HH:mm';
            case EStatisticTimeUnit.day:
                return 'YYYY-MM-DD';
            case EStatisticTimeUnit.month:
                return 'YYYY-MM';
            case EStatisticTimeUnit.year:
                return 'YYYY';
            default:
                return 'YYYY-MM-DD';
        }
    };

    return (
        <div>
            <div className="min-h-screen bg-gray-50 p-6">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="mb-6">
                        <Title level={2} className="mb-2">
                            📊 Thống kê doanh thu & đặt hàng
                        </Title>
                        <p className="text-gray-600">
                            Theo dõi hiệu suất kinh doanh theo thời gian thực
                            {selectedProductId && (
                                <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
                                    Sản phẩm đã chọn
                                </span>
                            )}
                        </p>
                    </div>

                    {/* Controls - Updated with ProductSelector */}
                    <div className='mb-6'>
                        <Card className="shadow-sm">
                            <Row gutter={[16, 16]} align="middle">
                                {/* Product Selector - NEW */}
                                <Col xs={24} sm={12} md={5}>
                                    <Space direction="vertical" size="small" className="w-full">
                                        <span className="text-sm font-medium text-gray-700">
                                            Sản phẩm:
                                            <span className="text-gray-400 ml-1">(Tùy chọn)</span>
                                        </span>
                                        <ProductSelector
                                            value={selectedProductId}
                                            onChange={handleProductChange}
                                            placeholder="Tất cả sản phẩm"
                                            allowClear={true}
                                            className="w-full"
                                        />
                                    </Space>
                                </Col>

                                <Col xs={24} sm={12} md={5}>
                                    <Space direction="vertical" size="small" className="w-full">
                                        <span className="text-sm font-medium text-gray-700">Đơn vị thời gian:</span>
                                        <Segmented
                                            options={timeUnitOptions}
                                            value={timeUnit}
                                            onChange={(value) => setTimeUnit(value as EStatisticTimeUnit)}
                                            className="w-full"
                                        />
                                    </Space>
                                </Col>

                                <Col xs={24} sm={12} md={5}>
                                    <Space direction="vertical" size="small" className="w-full">
                                        <span className="text-sm font-medium text-gray-700">Loại biểu đồ:</span>
                                        <Segmented
                                            options={chartTypeOptions}
                                            value={chartType}
                                            onChange={(value) => setChartType(value as ChartType)}
                                            className="w-full"
                                        />
                                    </Space>
                                </Col>

                                <Col xs={24} sm={12} md={6}>
                                    <Space direction="vertical" size="small" className="w-full">
                                        <span className="text-sm font-medium text-gray-700">Khoảng thời gian:</span>
                                        <RangePicker
                                            value={dateRange}
                                            onChange={(dates) => {
                                                if (dates && dates[0] && dates[1]) {
                                                    setDateRange([dates[0], dates[1]]);
                                                }
                                            }}
                                            format={getDateFormat()}
                                            className="w-full"
                                            suffixIcon={<CalendarOutlined />}
                                        />
                                    </Space>
                                </Col>

                                <Col xs={24} sm={12} md={3}>
                                    <Button
                                        type="primary"
                                        icon={<ReloadOutlined />}
                                        onClick={fetchData}
                                        loading={loading}
                                        className="w-full"
                                    >
                                        Làm mới
                                    </Button>
                                </Col>
                            </Row>
                        </Card>
                    </div>

                    {/* Summary Cards */}
                    <Row gutter={[16, 16]} className="mb-6">
                        <Col xs={24} sm={12}>
                            <Card className="shadow-sm">
                                <Statistic
                                    title={`Tổng doanh thu${selectedProductId ? ' (Sản phẩm đã chọn)' : ''}`}
                                    value={totalRevenue}
                                    precision={0}
                                    valueStyle={{ color: '#1890ff' }}
                                    prefix={<DollarOutlined />}
                                    suffix="VND"
                                    formatter={(value) => `${Number(value || 0).toLocaleString('vi-VN')}`}
                                />
                            </Card>
                        </Col>
                        <Col xs={24} sm={12}>
                            <Card className="shadow-sm">
                                <Statistic
                                    title={`Tổng lượt đặt hàng${selectedProductId ? ' (Sản phẩm đã chọn)' : ''}`}
                                    value={totalBooked}
                                    valueStyle={{ color: '#52c41a' }}
                                    prefix={<ShoppingCartOutlined />}
                                    suffix="lượt"
                                />
                            </Card>
                        </Col>
                    </Row>

                    {/* Chart */}
                    <Card
                        title={
                            <Space>
                                📈
                                <span>
                                    Biểu đồ thống kê - {timeUnitOptions.find(opt => opt.value === timeUnit)?.label}
                                    {selectedProductId && (
                                        <span className="text-blue-600 text-sm ml-2">
                                            (Sản phẩm cụ thể)
                                        </span>
                                    )}
                                </span>
                            </Space>
                        }
                        className="shadow-sm"
                    >
                        <Spin spinning={loading} tip="Đang tải dữ liệu...">
                            <div style={{ height: '500px', width: '100%' }}>
                                {chartData.length > 0 ? (
                                    <>
                                        <div className="mb-4 text-sm text-gray-500 flex justify-between">
                                            <span>Tổng số điểm dữ liệu: {chartData.length}</span>
                                            {selectedProductId && (
                                                <span className="text-blue-600">
                                                    📦 Đang xem dữ liệu cho sản phẩm cụ thể
                                                </span>
                                            )}
                                        </div>
                                        <Line {...chartConfig} />
                                    </>
                                ) : (
                                    <div className="flex items-center justify-center h-full text-gray-500">
                                        <Space direction="vertical" align="center">
                                            <div className="text-4xl">📊</div>
                                            <div>Không có dữ liệu để hiển thị</div>
                                            <div className="text-sm">
                                                {selectedProductId 
                                                    ? 'Sản phẩm này chưa có dữ liệu trong khoảng thời gian đã chọn' 
                                                    : 'Vui lòng thử thay đổi khoảng thời gian'
                                                }
                                            </div>
                                            {/* Debug info */}
                                            <div className="text-xs text-gray-400 mt-4 p-4 bg-gray-100 rounded">
                                                <div>Revenue Data: {revenueData?.length || 0} items</div>
                                                <div>Booked Data: {bookedData?.length || 0} items</div>
                                                <div>Chart Type: {chartType}</div>
                                                <div>Time Unit: {timeUnit}</div>
                                                <div>Selected Product: {selectedProductId || 'All products'}</div>
                                                <div>Date Range: {dateRange[0].format('YYYY-MM-DD')} to {dateRange[1].format('YYYY-MM-DD')}</div>
                                                <div>Formatted Data Length: {chartData.length}</div>
                                                {chartData.length > 0 && (
                                                    <div className="mt-2">
                                                        <div>Sample Data:</div>
                                                        <pre className="text-xs overflow-auto max-h-20">
                                                            {JSON.stringify(chartData.slice(0, 2), null, 2)}
                                                        </pre>
                                                    </div>
                                                )}
                                            </div>
                                        </Space>
                                    </div>
                                )}
                            </div>
                        </Spin>
                    </Card>

                    {/* Data Table Preview */}
                    {chartData.length > 0 && (
                        <Card
                            title={
                                <Space>
                                    📋 Dữ liệu chi tiết
                                    {selectedProductId && (
                                        <span className="text-blue-600 text-sm">
                                            (Sản phẩm cụ thể)
                                        </span>
                                    )}
                                </Space>
                            }
                            className="mt-6 shadow-sm"
                        >
                            <div className="overflow-x-auto">
                                <table className="w-full border-collapse">
                                    <thead>
                                        <tr className="bg-gray-50">
                                            <th className="border p-3 text-left">Thời gian</th>
                                            <th className="border p-3 text-right">Loại</th>
                                            <th className="border p-3 text-right">Giá trị</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {chartData.slice(0, 10).map((item, index) => (
                                            <tr key={index} className="hover:bg-gray-50">
                                                <td className="border p-3">
                                                    {formatDateForDisplay(item.date)}
                                                </td>
                                                <td className="border p-3 text-right">
                                                    <span className={`px-2 py-1 rounded text-xs ${item.category === 'revenue'
                                                        ? 'bg-blue-100 text-blue-800'
                                                        : 'bg-green-100 text-green-800'
                                                        }`}>
                                                        {item.type}
                                                    </span>
                                                </td>
                                                <td className="border p-3 text-right font-medium">
                                                    {item.category === 'revenue'
                                                        ? `${Number(item.value).toLocaleString('vi-VN')} VND`
                                                        : `${item.value} lượt`
                                                    }
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                {chartData.length > 10 && (
                                    <div className="text-center mt-4 text-gray-500">
                                        Hiển thị 10/{chartData.length} bản ghi đầu tiên
                                    </div>
                                )}
                            </div>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
};

export default StatisticsChart;