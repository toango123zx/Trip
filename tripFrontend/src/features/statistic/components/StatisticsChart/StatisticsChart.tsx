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
const { RangePicker } = DatePicker;
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
    placeholder = "Chọn sản phẩm",
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
            optionFilterProp="children"
            filterOption={(input, option) =>
                (option?.children as unknown as string).toLowerCase().includes(input.toLowerCase())
            }
            notFoundContent={loading ? <Spin size="small" /> : 'Không có sản phẩm nào'}
        >
            {products.map(p => (
                <Option key={p.id} value={p.id}>
                    <div className="flex items-center justify-between">
                        <span className="font-medium">{p.name}</span>
                        <span className="text-gray-500 text-sm ml-2">{p.city}</span>
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
    // Map từ timestamp -> value
    const map = new Map<number, number>();
    data.forEach(item => {
        const ts = dayjs(item.timePoint).valueOf();
        map.set(ts, Number(item.value) || 0);
    });

    // Sinh đủ điểm, nếu thiếu thì value = 0
    return allPoints.map(point => ({
        date: dayjs(point).format(
            timeUnit === EStatisticTimeUnit.hour
                ? 'HH:mm DD/MM/YYYY'
                : timeUnit === EStatisticTimeUnit.day
                    ? 'DD/MM/YYYY'
                    : timeUnit === EStatisticTimeUnit.month
                        ? 'MM/YYYY'
                        : 'YYYY',),                          // là Date object
        value: map.get(point.valueOf()) ?? 0, // tìm theo timestamp
        type: label,
        category
    }));
};

export const StatisticsChart: React.FC = () => {
    const dispatch = useDispatch<TReduxStoreDispatch>();
    const { revenueData, bookedData, loading } = useSelector((state: TReduxStoreState) => state.statistic);

    const [timeUnit, setTimeUnit] = useState<EStatisticTimeUnit>(EStatisticTimeUnit.day);
    const [chartType, setChartType] = useState<ChartType>('both');
    const [dateRange, setDateRange] = useState<[Dayjs, Dayjs]>([dayjs().subtract(30, 'day'), dayjs()]);

    const { selectedProductId, handleProductChange, getApiParams } = useProductSelector();

    const fetchData = async () => {
        const query: TRequestQueryQueryStatistic = {
            timeUnit,
            startTimeSearch: dateRange[0].toDate(),
            endTimeSearch: dateRange[1].toDate(),
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

    useEffect(() => { fetchData(); }, [timeUnit, chartType, dateRange, selectedProductId]);

    const allPoints = generateTimeRange(dateRange[0], dateRange[1], timeUnit);
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
    if (chartType !== 'booked') raw.push(...fillMissingData(revenueData || [], allPoints, timeUnit, 'Thu nhập', 'revenue'));
    if (chartType !== 'revenue') raw.push(...fillMissingData(bookedData || [], allPoints, timeUnit, 'Lượt đặt', 'booked'));
    const chartData = raw.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    // const chartData = [
    //     ...(chartType !== 'booked'
    //         ? fillMissingData(revenueData || [], allPoints, 'Thu nhập', 'revenue')
    //         : []),
    //     ...(chartType !== 'revenue'
    //         ? fillMissingData(bookedData || [], allPoints, 'Lượt đặt', 'booked')
    //         : []),
    // ].sort((a, b) => a.date.getTime() - b.date.getTime());


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
        smooth: true,
        height: 400,
        autoFit: true,
        point: { size: 4, shape: 'circle' },
        legend: { position: 'top' as const },
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
                    chartType !== 'booked' && v > 1000 ? v.toLocaleString('vi-VN') : `${v}`
            }
        },
        tooltip: {
            // Format tiêu đề ngày tháng
            // title: (date: string) => dayjs(date).format('DD/MM/YYYY'),
            // Chỉ định các trường hiển thị
            fields: ['date', 'type', 'value'],
            title: (d: any) => {
                // G2Plot will usually pass you an object { date: <rawDate>, type, value }
                const raw = typeof d === 'object' && d?.date != null ? d.date : d;
                // return dayjs(raw).format(
                //     timeUnit === EStatisticTimeUnit.hour
                //         ? 'HH:mm DD/MM/YYYY'
                //         : timeUnit === EStatisticTimeUnit.day
                //             ? 'DD/MM/YYYY'
                //             : timeUnit === EStatisticTimeUnit.month
                //                 ? 'MM/YYYY'
                //                 : 'YYYY'
                // );
                return d.date
            },
            // Trả về đúng name và value, không kèm title ở đây
            formatter: (datum: any) => ({
                name: datum.type,
                value:
                    datum.category === 'revenue'
                        ? `${Number(datum.value).toLocaleString('vi-VN')} VND`
                        : `${datum.value} lượt`
            })
        },
        interactions: [{ type: 'marker-active' }],
        connectNulls: false,
        animation: { appear: { animation: 'path-in', duration: 1000 } },
        meta: {
            value: { min: 0 }, date: {
                type: 'time',
                // pick the right mask based on the unit
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

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                <div className="mb-6">
                    <Title level={2} className="mb-2">📊 Thống kê doanh thu & đặt hàng</Title>
                </div>

                <Card className="shadow-sm mb-6">
                    <Row gutter={[16, 16]} align="middle">
                        {/* Product selector */}
                        <Col xs={24} sm={12} md={5}>
                            <Space direction="vertical" size="small" className="w-full">
                                <span className="text-sm font-medium text-gray-700">Sản phẩm: <span className="text-gray-400">(Tùy chọn)</span></span>
                                <ProductSelector
                                    value={selectedProductId}
                                    onChange={handleProductChange}
                                    placeholder="Tất cả sản phẩm"
                                />
                            </Space>
                        </Col>
                        {/* Time unit */}
                        <Col xs={24} sm={12} md={5}>
                            <Space direction="vertical" size="small" className="w-full">
                                <span className="text-sm font-medium text-gray-700">Đơn vị thời gian:</span>
                                <Segmented
                                    options={[
                                        { label: 'Giờ', value: EStatisticTimeUnit.hour },
                                        { label: 'Ngày', value: EStatisticTimeUnit.day },
                                        { label: 'Tháng', value: EStatisticTimeUnit.month },
                                        { label: 'Năm', value: EStatisticTimeUnit.year }
                                    ]}
                                    value={timeUnit}
                                    onChange={val => setTimeUnit(val as EStatisticTimeUnit)}
                                />
                            </Space>
                        </Col>
                        {/* Chart type */}
                        <Col xs={24} sm={12} md={5}>
                            <Space direction="vertical" size="small" className="w-full">
                                <span className="text-sm font-medium text-gray-700">Loại biểu đồ:</span>
                                <Segmented
                                    options={[
                                        { label: 'Thu nhập', value: 'revenue' },
                                        { label: 'Lượt đặt', value: 'booked' },
                                        { label: 'Cả hai', value: 'both' }
                                    ]}
                                    value={chartType}
                                    onChange={val => setChartType(val as ChartType)}
                                />
                            </Space>
                        </Col>
                        {/* Date range */}
                        <Col xs={24} sm={12} md={6}>
                            <Space direction="vertical" size="small" className="w-full">
                                <span className="text-sm font-medium text-gray-700">Khoảng thời gian:</span>
                                <RangePicker
                                    value={dateRange}
                                    onChange={dates => dates && dates[0] && dates[1] && setDateRange([dates[0], dates[1]])}
                                    format={getDateFormat()}
                                    suffixIcon={<CalendarOutlined />}
                                    className="w-full"
                                />
                            </Space>
                        </Col>
                        {/* Refresh button */}
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

                {/* Summary stats */}
                <Row gutter={[16, 16]} className="mb-6">
                    <Col xs={24} sm={12}>
                        <Card className="shadow-sm">
                            <Statistic
                                title={`Tổng doanh thu${selectedProductId ? ' (Sản phẩm đã chọn)' : ''}`}
                                value={totalRevenue}
                                precision={0}
                                prefix={<DollarOutlined />}
                                formatter={val => Number(val).toLocaleString('vi-VN')}
                            />
                        </Card>
                    </Col>
                    <Col xs={24} sm={12}>
                        <Card className="shadow-sm">
                            <Statistic
                                title={`Tổng lượt đặt hàng${selectedProductId ? ' (Sản phẩm đã chọn)' : ''}`}
                                value={totalBooked}
                                prefix={<ShoppingCartOutlined />}
                                suffix=" lượt"
                            />
                        </Card>
                    </Col>
                </Row>

                {/* Chart */}
                <Card title={<Space>📈 Biểu đồ thống kê - {['Giờ', 'Ngày', 'Tháng', 'Năm'][timeUnit as unknown as number]}</Space>} className="shadow-sm">
                    <Spin spinning={loading} tip="Đang tải dữ liệu...">
                        {chartData.length > 0 && isValid
                            ? <Line {...chartConfig} />
                            : <div className="text-center p-10 text-gray-500">
                                {loading ? 'Đang tải...' : 'Không có dữ liệu để hiển thị'}
                            </div>
                        }
                    </Spin>
                </Card>
            </div>
        </div>
    );
};

export default StatisticsChart;
