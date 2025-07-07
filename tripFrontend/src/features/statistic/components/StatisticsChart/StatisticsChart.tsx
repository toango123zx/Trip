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
import dayjs, { Dayjs, ManipulateType } from 'dayjs';
import { TReduxStoreDispatch, TReduxStoreState } from '@/store';
import { TRequestQueryQueryStatistic } from '@/features/statistic/statistic.type';
import { statisticThunk } from '../../statisticThunk';
import { productThunk } from '@/features/product/productThunk';
import { EStatisticTimeUnit } from '@/types';
import { TProductSumary } from '@/types';

const { Title } = Typography;
const { Option } = Select;

type ChartType = 'revenue' | 'booked' | 'both';

interface ProductSelectorProps {
    value?: string;
    onChange?: (productId?: string) => void;
    placeholder?: string;
    allowClear?: boolean;
    disabled?: boolean;
    className?: string;
}

const ProductSelector: React.FC<ProductSelectorProps> = ({
    value,
    onChange,
    placeholder = "Select product",
    allowClear = true,
    disabled = false,
    className
}) => {
    const dispatch = useDispatch<TReduxStoreDispatch>();
    const [loading, setLoading] = useState(false);
    const [products, setProducts] = useState<TProductSumary[]>([]);

    useEffect(() => {
        const loadProducts = async () => {
            try {
                setLoading(true);
                const result = await dispatch(productThunk.getProductsManagement({ page: 1, limit: 100 })).unwrap();
                const productData = Array.isArray(result) ? result[0] || [] : result;
                setProducts(productData);
            } catch {
                setProducts([]);
            } finally {
                setLoading(false);
            }
        };
        loadProducts();
    }, [dispatch]);

    return (
        <Select
            value={value}
            onChange={val => onChange?.(val || undefined)}
            placeholder={placeholder}
            allowClear={allowClear}
            disabled={disabled || loading}
            className={className}
            style={{ width: '100%' }}
            showSearch
            optionFilterProp="label"
            filterOption={(input, option) => {
                const productName = option?.label?.toString() || '';
                const productLocation = products.find(p => p.id === option?.value)?.locationName || '';
                const searchText = `${productName} ${productLocation}`.toLowerCase();
                return searchText.includes(input.toLowerCase());
            }}
            notFoundContent={loading ? <Spin size="small" /> : 'No products available'}
        >
            {products.map(p => (
                <Option key={p.id} value={p.id} label={p.name}>
                    <div className="flex items-center justify-between">
                        <span className="font-medium">{p.name}</span>
                        <span className="text-gray-500 text-sm ml-2">{p.locationName}</span>
                    </div>
                </Option>
            ))}
        </Select>
    );
};

interface UseProductSelectorReturn {
    selectedProductId?: string;
    handleProductChange: (id?: string) => void;
    getApiParams: () => { productId?: string };
}

const useProductSelector = (initialId?: string): UseProductSelectorReturn => {
    const [selectedProductId, setSelectedProductId] = useState<string | undefined>(initialId);
    const handleProductChange = useCallback((id?: string) => setSelectedProductId(id), []);
    const getApiParams = useCallback(() => ({ productId: selectedProductId }), [selectedProductId]);
    return { selectedProductId, handleProductChange, getApiParams };
};

const generateTimeRange = (startDate: Dayjs, endDate: Dayjs, unit: EStatisticTimeUnit): Date[] => {
    const unitMap: Record<EStatisticTimeUnit, ManipulateType> = {
        [EStatisticTimeUnit.hour]: 'hour',
        [EStatisticTimeUnit.day]: 'day',
        [EStatisticTimeUnit.week]: 'week',
        [EStatisticTimeUnit.month]: 'month',
        [EStatisticTimeUnit.year]: 'year',
    };
    const u = unitMap[unit] || 'day';
    const points: Date[] = [];
    let cur = startDate.startOf(u);
    const end = endDate.endOf(u);
    while (cur.isBefore(end) || cur.isSame(end)) {
        points.push(cur.toDate());
        cur = cur.add(1, u);
    }
    return points;
};

const fillMissingData = (
    data: { timePoint: string; value: number }[],
    allPoints: Date[],
    timeUnit: EStatisticTimeUnit,
    label: string,
    category: string
) => {
    // Map from timestamp -> value
    const map = new Map<number, number>();
    data.forEach(item => {
        const ts = dayjs(item.timePoint).valueOf();
        map.set(ts, Number(item.value) || 0);
    });

    // Generate all points, fill missing values with 0
    return allPoints.map(point => ({
        date: dayjs(point).format(
            timeUnit === EStatisticTimeUnit.hour
                ? 'HH:mm DD/MM/YYYY'
                : timeUnit === EStatisticTimeUnit.day
                    ? 'DD/MM/YYYY'
                    : timeUnit === EStatisticTimeUnit.month
                        ? 'MM/YYYY'
                        : 'YYYY',),
        value: map.get(point.valueOf()) ?? 0,
        type: label,
        category
    }));
};

export const StatisticsChart: React.FC = () => {
    const dispatch = useDispatch<TReduxStoreDispatch>();
    const { revenueData, bookedData, loading } = useSelector((state: TReduxStoreState) => state.statistic);

    const [timeUnit, setTimeUnit] = useState<EStatisticTimeUnit>(EStatisticTimeUnit.day);
    const [chartType, setChartType] = useState<ChartType>('both');
    // Tách thành 2 state riêng biệt
    const [startDate, setStartDate] = useState<Dayjs>(dayjs().subtract(30, 'day'));
    const [endDate, setEndDate] = useState<Dayjs>(dayjs());

    const { selectedProductId, handleProductChange, getApiParams } = useProductSelector();

    const fetchData = async () => {
        const query: TRequestQueryQueryStatistic = {
            timeUnit,
            startTimeSearch: startDate.toDate(),
            endTimeSearch: endDate.toDate(),
            ...getApiParams()
        };
        try {
            if (chartType === 'revenue' || chartType === 'both') {
                await dispatch(statisticThunk.getRevenue(query));
            }
            if (chartType === 'booked' || chartType === 'both') {
                await dispatch(statisticThunk.getBooked(query));
            }
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => { fetchData(); }, [timeUnit, chartType, startDate, endDate, selectedProductId]);

    const allPoints = generateTimeRange(startDate, endDate, timeUnit);
    const allPointsISO = allPoints.map(date => dayjs(date).format(
        timeUnit === EStatisticTimeUnit.hour
            ? 'HH:mm DD/MM/YYYY'
            : timeUnit === EStatisticTimeUnit.day
                ? 'DD/MM/YYYY'
                : timeUnit === EStatisticTimeUnit.month
                    ? 'MM/YYYY'
                    : 'YYYY',
    ));

    const raw: any[] = [];
    if (chartType !== 'booked') raw.push(...fillMissingData(revenueData || [], allPoints, timeUnit, 'Revenue', 'revenue'));
    if (chartType !== 'revenue') raw.push(...fillMissingData(bookedData || [], allPoints, timeUnit, 'Bookings', 'booked'));
    const chartData = raw.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    const isValid = chartData.every(d => d.date && typeof d.value === 'number');

    const formatDateDisplay = (dateStr: string) => {
        const d = dayjs(dateStr);
        if (timeUnit === EStatisticTimeUnit.hour) return d.format('DD/MM HH:mm');
        if (timeUnit === EStatisticTimeUnit.day) return d.format('DD/MM');
        if (timeUnit === EStatisticTimeUnit.month) return d.format('MM/YYYY');
        if (timeUnit === EStatisticTimeUnit.year) return d.format('YYYY');
        return d.format('DD/MM');
    };

    const chartConfig = {
        data: chartData,
        xField: 'date',
        yField: 'value',
        seriesField: 'type',
        smooth: false, // Đường thẳng
        height: 400,
        autoFit: true,
        point: { size: 4, shape: 'circle' },
        legend: { position: 'top' as const },
        // Cấu hình màu sắc: Bookings màu xanh lá, Revenue màu xanh dương
        color: (datum: any) => {
            if (datum.type === 'Bookings') return '#10B981'; // Green cho Bookings
            if (datum.type === 'Revenue') return '#3B82F6'; // Blue cho Revenue
            return '#6B7280'; // Gray fallback
        },
        xAxis: {
            type: 'time',
            tickCount: Math.min(10, allPoints.length),
            label: {
                autoRotate: false,
                rotate: -45,
                formatter: (v: Date) => formatDateDisplay(dayjs(v).format(timeUnit === EStatisticTimeUnit.hour
                    ? 'HH:mm DD/MM/YYYY'
                    : timeUnit === EStatisticTimeUnit.day
                        ? 'DD/MM/YYYY'
                        : timeUnit === EStatisticTimeUnit.month
                            ? 'MM/YYYY'
                            : 'YYYY',
                )),
            }
        },
        yAxis: {
            min: 0,
            nice: true,
            label: {
                formatter: (v: number) =>
                    chartType !== 'booked' && v > 1000 ? v.toLocaleString('en-US') : `${v}`
            }
        },
        tooltip: {
            fields: ['date', 'type', 'value'],
            title: (d: any) => {
                return d.date;
            },
            formatter: (datum: any) => ({
                name: datum.type,
                value:
                    datum.category === 'revenue'
                        ? `${Number(datum.value).toLocaleString('en-US')} VND`
                        : `${datum.value} bookings`
            })
        },
        interactions: [{ type: 'marker-active' }],
        connectNulls: false,
        animation: { appear: { animation: 'path-in', duration: 1000 } },
        meta: {
            value: { min: 0 }, 
            date: {
                type: 'time',
                mask:
                    timeUnit === EStatisticTimeUnit.hour
                        ? 'DD/MM HH:mm'
                        : timeUnit === EStatisticTimeUnit.day
                            ? 'DD/MM'
                            : timeUnit === EStatisticTimeUnit.month
                                ? 'MM/YYYY'
                                : 'YYYY',
            },
        }
    };

    const totalRevenue = (revenueData || []).reduce((sum, i) => sum + Number(i.value), 0);
    const totalBooked = (bookedData || []).reduce((sum, i) => sum + Number(i.value), 0);

    const getDateFormat = () => {
        if (timeUnit === EStatisticTimeUnit.hour) return 'YYYY-MM-DD HH:mm';
        if (timeUnit === EStatisticTimeUnit.day) return 'YYYY-MM-DD';
        if (timeUnit === EStatisticTimeUnit.month) return 'YYYY-MM';
        if (timeUnit === EStatisticTimeUnit.year) return 'YYYY';
        return 'YYYY-MM-DD';
    };

    // Validation để đảm bảo startDate không lớn hơn endDate
    const handleStartDateChange = (date: Dayjs | null) => {
        if (date) {
            setStartDate(date);
            // Nếu startDate > endDate, tự động set endDate = startDate
            if (date.isAfter(endDate)) {
                setEndDate(date);
            }
        }
    };

    const handleEndDateChange = (date: Dayjs | null) => {
        if (date) {
            setEndDate(date);
            // Nếu endDate < startDate, tự động set startDate = endDate
            if (date.isBefore(startDate)) {
                setStartDate(date);
            }
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                <div className="mb-6">
                    <Title level={2} className="mb-2">📊 Revenue & Booking Statistics</Title>
                </div>

                <Card className="shadow-sm !mb-6">
                    <Row gutter={[16, 16]} align="bottom">
                        {/* Product selector */}
                        <Col xs={24} sm={12} md={5}>
                            <Space direction="vertical" size="small" className="w-full">
                                <span className="text-sm font-medium text-gray-700">Product: <span className="text-gray-400">(Optional)</span></span>
                                <ProductSelector
                                    value={selectedProductId}
                                    onChange={handleProductChange}
                                    placeholder="All products"
                                />
                            </Space>
                        </Col>

                        {/* Time unit */}
                        <Col xs={24} sm={12} md={5}>
                            <Space direction="vertical" size="small" className="w-full">
                                <span className="text-sm font-medium text-gray-700">Time Unit:</span>
                                <Segmented
                                    options={[
                                        { label: 'Hour', value: EStatisticTimeUnit.hour },
                                        { label: 'Day', value: EStatisticTimeUnit.day },
                                        { label: 'Month', value: EStatisticTimeUnit.month },
                                        { label: 'Year', value: EStatisticTimeUnit.year }
                                    ]}
                                    value={timeUnit}
                                    onChange={val => setTimeUnit(val as EStatisticTimeUnit)}
                                />
                            </Space>
                        </Col>

                        {/* Chart type */}
                        <Col xs={24} sm={12} md={5}>
                            <Space direction="vertical" size="small" className="w-full">
                                <span className="text-sm font-medium text-gray-700">Chart Type:</span>
                                <Segmented
                                    options={[
                                        { label: 'Revenue', value: 'revenue' },
                                        { label: 'Bookings', value: 'booked' },
                                        { label: 'Both', value: 'both' }
                                    ]}
                                    value={chartType}
                                    onChange={val => setChartType(val as ChartType)}
                                />
                            </Space>
                        </Col>

                        {/* Start Date & End Date */}
                        <Col xs={24} sm={12} md={7}>
                            <div className='flex flex-row gap-2'>
                                <Space direction="vertical" size="small" className="w-full">
                                    <span className="text-sm font-medium text-gray-700">Start Date:</span>
                                    <DatePicker
                                        value={startDate}
                                        onChange={handleStartDateChange}
                                        format={getDateFormat()}
                                        suffixIcon={<CalendarOutlined />}
                                        className="w-full"
                                        disabledDate={(current) => current && current.isAfter(endDate, 'day')}
                                    />
                                </Space>
                                <Space direction="vertical" size="small" className="w-full">
                                    <span className="text-sm font-medium text-gray-700">End Date:</span>
                                    <DatePicker
                                        value={endDate}
                                        onChange={handleEndDateChange}
                                        format={getDateFormat()}
                                        suffixIcon={<CalendarOutlined />}
                                        className="w-full"
                                        disabledDate={(current) => current && current.isBefore(startDate, 'day')}
                                    />
                                </Space>
                            </div>
                        </Col>

                        {/* Refresh button */}
                        <Col xs={24} sm={12} md={2}>
                            <div className="flex items-end h-full">
                                <Button
                                    type="primary"
                                    icon={<ReloadOutlined />}
                                    onClick={fetchData}
                                    loading={loading}
                                    className="w-full"
                                >
                                    Reload
                                </Button>
                            </div>
                        </Col>
                    </Row>
                </Card>

                {/* Summary stats */}
                <Row gutter={[16, 16]} className="mb-6">
                    <Col xs={24} sm={12}>
                        <Card className="shadow-sm">
                            <Statistic
                                title={`Total Revenue${selectedProductId ? ' (Selected Product)' : ''}`}
                                value={totalRevenue}
                                precision={0}
                                prefix={<DollarOutlined style={{ color: '#3B82F6' }} />}
                                formatter={val => Number(val).toLocaleString('en-US')}
                                valueStyle={{ color: '#3B82F6' }}
                            />
                        </Card>
                    </Col>
                    <Col xs={24} sm={12}>
                        <Card className="shadow-sm">
                            <Statistic
                                title={`Total Bookings${selectedProductId ? ' (Selected Product)' : ''}`}
                                value={totalBooked}
                                prefix={<ShoppingCartOutlined style={{ color: '#10B981' }} />}
                                suffix=" bookings"
                                valueStyle={{ color: '#10B981' }}
                            />
                        </Card>
                    </Col>
                </Row>

                {/* Chart */}
                <Card title={<Space>📈 Statistics Chart {['Hour', 'Day', 'Month', 'Year'][timeUnit as unknown as number]}</Space>} className="shadow-sm">
                    <Spin spinning={loading} tip="Loading data...">
                        {chartData.length > 0 && isValid
                            ? <Line {...chartConfig} />
                            : <div className="text-center p-10 text-gray-500">
                                {loading ? 'Loading...' : 'No data to display'}
                            </div>
                        }
                    </Spin>
                </Card>
            </div>
        </div>
    );
};

export default StatisticsChart;