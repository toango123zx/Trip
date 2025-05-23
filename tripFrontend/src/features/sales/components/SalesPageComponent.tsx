import React, { useEffect, useState, useCallback } from 'react';
import {
  Card,
  Row,
  Col,
  Input,
  Slider,
  Button,
  message,
  Spin,
  Alert,
  Tooltip,
} from 'antd';
import { FilterOutlined, TagOutlined, CopyOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/store/reduxStore';
import { fetchSales, Sale } from '../slice/salesSlice';

// Constants for localization
const TEXT = {
  FILTER_TITLE: 'Promotion Filters',
  SEARCH_PLACEHOLDER: 'Search by name or description',
  DISCOUNT_VALUE: 'Discount Value (%)',
  COPY_SUCCESS: 'Promotion code copied!',
  USE_NOW: 'Use Now',
  LOAD_MORE: 'Load More',
  ERROR_MESSAGE: 'Error',
  NO_DATA: 'No promotions available.',
};

// Utility to format date
const formatDateTime = (dateStr?: string | Date): string => {
  if (!dateStr) return 'N/A';
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  } catch {
    return 'N/A';
  }
};

// Filter component
const FilterSection: React.FC<{
  filters: { minValue: number; maxValue: number };
  setFilters: React.Dispatch<React.SetStateAction<{ minValue: number; maxValue: number }>>;
  searchText: string;
  setSearchText: React.Dispatch<React.SetStateAction<string>>;
}> = React.memo(({ filters, setFilters, searchText, setSearchText }) => {
  const [inputSearchText, setInputSearchText] = useState(searchText);

  // Preset discount ranges
  const presetDiscounts = [
    { label: 'Dưới 10%', min: 0, max: 10 },
    { label: 'Từ 10–30%', min: 10, max: 30 },
    { label: 'Từ 30–50%', min: 30, max: 50 },
    { label: 'Trên 50%', min: 50, max: 100 },
  ];

  // Memoize handleSearch to prevent unnecessary re-renders
  const handleSearch = useCallback(() => {
    setSearchText(inputSearchText.trim());
  }, [inputSearchText, setSearchText]);

  // Handle Enter key press
  const handleKeyPress = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  }, [handleSearch]);

  // Handle preset filter
  const handlePresetFilter = (preset: { min: number; max: number }) => {
    setFilters({ minValue: preset.min, maxValue: preset.max });
  };

  return (
    <Card
      title={
        <div className="flex items-center gap-2">
          <FilterOutlined />
          <span>{TEXT.FILTER_TITLE}</span>
        </div>
      }
      className="mb-6 shadow-md hover:shadow-lg transition-shadow duration-300"
    >
      <Row gutter={[16, 16]}>
        <Col span={24} className="flex gap-2">
          <Input
            placeholder={TEXT.SEARCH_PLACEHOLDER}
            value={inputSearchText}
            onChange={(e) => setInputSearchText(e.target.value)}
            onKeyPress={handleKeyPress}
            aria-label="Search promotions"
            className="flex-1"
          />
        </Col>
        <Col span={24}>
          <div className="text-sm font-medium mb-2">{TEXT.DISCOUNT_VALUE}</div>
          {/* Preset discount buttons */}
          <div className="flex gap-2 mb-3 flex-wrap">
            {presetDiscounts.map((preset) => (
              <Button 
                key={preset.label} 
                size="small" 
                onClick={() => handlePresetFilter(preset)}
                className={`${
                  filters.minValue === preset.min && filters.maxValue === preset.max 
                    ? 'bg-primary text-white' 
                    : 'bg-gray-100'
                }`}
              >
                {preset.label}
              </Button>
            ))}
          </div>
          <Slider
            range
            min={0}
            max={100}
            value={[filters.minValue, filters.maxValue]}
            onChange={(value: number[]) =>
              setFilters({ minValue: value[0], maxValue: value[1] })
            }
            aria-label="Discount value range"
          />
        </Col>
      </Row>
    </Card>
  );
});

// Sale card component
const SaleCard: React.FC<{ sale: Sale }> = ({ sale }) => {
  const handleCopyCode = () => {
    navigator.clipboard.writeText(sale.code);
    message.success(TEXT.COPY_SUCCESS);
  };

  return (
    <Card
      className="w-full mb-4 shadow-md hover:shadow-lg transition-shadow duration-300"
      title={
        <div className="flex justify-between items-center">
          <span className="text-lg font-semibold">🎉 {sale.name}</span>
        </div>
      }
    >
      <div className="space-y-3">
        <p className="text-gray-600">{sale.description}</p>
        <div className="flex items-center gap-2">
          <Tooltip title="Copy Code">
            <Button
              type="text"
              icon={<CopyOutlined />}
              onClick={handleCopyCode}
              aria-label={`Copy promotion code ${sale.code}`}
            />
          </Tooltip>
          <strong>{sale.code}</strong>
        </div>
        <div className="flex items-center gap-2 text-gray-500">
          📅 {formatDateTime(sale.startTime)} - {formatDateTime(sale.endTime)}
        </div>
        <div className="flex justify-between flex-col items-start gap-2">
          <div>🎯 Discount {sale.value}%</div>
          <div>🧍 {sale.value} codes remaining</div>
        </div>
        <Button type="primary" block className="mt-3">
          {TEXT.USE_NOW}
        </Button>
      </div>
    </Card>
  );
};

// Main Sales Page component
const SalesPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { sales, loading, error, pagination } = useSelector((state: RootState) => state.sales);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchText, setSearchText] = useState('');
  const [filters, setFilters] = useState({
    minValue: 0,
    maxValue: 100,
  });

  // Fetch sales data
  useEffect(() => {
    dispatch(fetchSales(currentPage));
  }, [dispatch, currentPage]);

  // Handle load more
  const handleLoadMore = () => {
    setCurrentPage((prev) => prev + 1);
  };

  // Filter sales
  const filteredSales = sales.filter(
    (sale) =>
      sale.value >= filters.minValue &&
      sale.value <= filters.maxValue &&
      (searchText === '' ||
        sale.name.toLowerCase().includes(searchText.toLowerCase()) ||
        sale.description.toLowerCase().includes(searchText.toLowerCase())),
  );

  if (loading && currentPage === 1) {
    return <Spin size="large" className="flex justify-center items-center min-h-screen" />;
  }

  if (error) {
    return (
      <Alert
        message={TEXT.ERROR_MESSAGE}
        description={error}
        type="error"
        showIcon
        className="m-4 max-w-2xl mx-auto"
      />
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Row gutter={[16, 16]}>
        <Col xs={24} md={6}>
          <FilterSection
            filters={filters}
            setFilters={setFilters}
            searchText={searchText}
            setSearchText={setSearchText}
          />
        </Col>
        <Col xs={24} md={18}>
          {filteredSales.length === 0 ? (
            <Alert message={TEXT.NO_DATA} type="info" showIcon className="mb-4" />
          ) : (
            <Row gutter={[16, 16]}>
              {filteredSales.map((sale) => (
                <Col key={sale.id} xs={24} sm={12} lg={8}>
                  <SaleCard sale={sale} />
                </Col>
              ))}
            </Row>
          )}
          {currentPage < pagination.totalPages && (
            <div className="flex justify-center mt-6">
              <Button
                type="primary"
                loading={loading}
                onClick={handleLoadMore}
                aria-label="Load more promotions"
              >
                {TEXT.LOAD_MORE}
              </Button>
            </div>
          )}
        </Col>
      </Row>
    </div>
  );
};

export default SalesPage;