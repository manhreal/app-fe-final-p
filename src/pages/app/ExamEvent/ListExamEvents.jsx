import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Card, Input, Button, Row, Col, Form, Tag, Empty, Spin, Modal } from 'antd';
import { 
    SearchOutlined, 
    ReloadOutlined, 
    PlusOutlined,
    CalendarOutlined, 
    ClockCircleOutlined,
    UserOutlined,
    FileTextOutlined,
    TrophyOutlined
} from '@ant-design/icons';
import { actionGetListExamEvents } from '../../../redux/exam_event/actions';
import SimplePagination from '../../../components/Pagination/Pagination';
import {
    showSuccessToast
} from '../../../lib/sweetAlertConfig';

const DEFAULT_PAGINATION = {
    current: 1,
    pageSize: 9,
    total: 0
};

const UserExamEvents = () => {
    const dispatch = useDispatch();
    const { dataListExamEvents, loading } = useSelector(state => state.examEvents);
    const [form] = Form.useForm();
    const [pagination, setPagination] = useState(DEFAULT_PAGINATION);

    const buildSearchParams = useCallback((formValues = {}, paginationInfo = pagination) => {
        const { name, code, description } = formValues;
        return {
            ...(name && { name }),
            ...(code && { code }),
            ...(description && { description }),
            page: paginationInfo.current,
            limit: paginationInfo.pageSize
        };
    }, [pagination]);

    const handleSearch = useCallback(async (resetPage = true) => {
        const formValues = form.getFieldsValue();
        const searchPagination = resetPage
            ? { ...pagination, current: 1 }
            : pagination;

        if (resetPage) {
            setPagination(searchPagination);
        }

        const params = buildSearchParams(formValues, searchPagination);

        try {
            const result = await dispatch(actionGetListExamEvents(params));
            const total = result?.total || 0;

            setPagination(prev => ({
                ...prev,
                total,
                ...(resetPage && { current: 1 })
            }));
        } catch (error) {
            console.error('Error fetching exam events:', error);
            setPagination(prev => ({ ...prev, total: 0 }));
        }
    }, [dispatch, form, pagination, buildSearchParams]);

    const handlePageChange = useCallback((page) => {
        const newPagination = { ...pagination, current: page };
        setPagination(newPagination);

        const formValues = form.getFieldsValue();
        const params = buildSearchParams(formValues, newPagination);
        dispatch(actionGetListExamEvents(params));
    }, [dispatch, form, pagination, buildSearchParams]);

    const handleReset = useCallback(async () => {
        form.resetFields();
        setPagination(prev => ({ ...prev, current: 1 }));
        const params = { page: 1, limit: pagination.pageSize };

        try {
            await dispatch(actionGetListExamEvents(params));
            showSuccessToast('Đã đặt lại bộ lọc');
        } catch (error) {
            console.error('Reset error:', error);
        }
    }, [dispatch, form, pagination.pageSize]);

    const handleJoinExam = useCallback((exam) => {
        Modal.info({
            title: 'Thông báo',
            content: (
                <div>
                    <p className="text-base mb-2">
                        Bạn đang chuẩn bị tham gia kỳ thi: <strong>{exam.name}</strong>
                    </p>
                    <p className="text-gray-600">
                        Chức năng này đang được phát triển...
                    </p>
                </div>
            ),
            okText: 'Đã hiểu',
            centered: true,
        });
    }, []);

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    const getExamStatus = (startDate, endDate) => {
        const now = new Date();
        const start = new Date(startDate);
        const end = new Date(endDate);

        if (now < start) {
            return { text: 'Sắp diễn ra', color: 'blue' };
        } else if (now >= start && now <= end) {
            return { text: 'Đang diễn ra', color: 'green' };
        } else {
            return { text: 'Đã kết thúc', color: 'default' };
        }
    };

    const ExamCard = ({ exam }) => {
        const status = getExamStatus(exam.startDate, exam.endDate);
        const isActive = status.text === 'Đang diễn ra';

        return (
            <Card
                hoverable
                className="h-full flex flex-col shadow-md hover:shadow-xl transition-all duration-300 border-t-4"
                style={{ 
                    borderTopColor: isActive ? '#52c41a' : '#1890ff',
                }}
                cover={
                    <div 
                        className="h-48 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center relative overflow-hidden"
                    >
                        {exam.image ? (
                            <img 
                                src={exam.image} 
                                alt={exam.name}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="text-white text-center px-4">
                                <TrophyOutlined className="text-6xl mb-2 opacity-80" />
                                <h3 className="text-xl font-bold line-clamp-2">{exam.name}</h3>
                            </div>
                        )}
                        <div className="absolute top-3 right-3">
                            <Tag color={status.color} className="text-sm font-medium">
                                {status.text}
                            </Tag>
                        </div>
                    </div>
                }
            >
                <div className="flex flex-col h-full">
                    {/* Title */}
                    <h3 className="text-lg font-bold mb-3 line-clamp-2 min-h-[56px]" title={exam.name}>
                        {exam.name}
                    </h3>

                    {/* Code */}
                    <div className="mb-3">
                        <Tag color="cyan" className="text-xs">
                            {exam.code}
                        </Tag>
                    </div>

                    {/* Description */}
                    {exam.description && (
                        <p className="text-gray-600 text-sm mb-4 line-clamp-2 min-h-[40px]" title={exam.description}>
                            {exam.description}
                        </p>
                    )}

                    {/* Info Grid */}
                    <div className="space-y-2 mb-4 flex-grow">
                        <div className="flex items-center text-sm text-gray-600">
                            <FileTextOutlined className="mr-2 text-blue-500" />
                            <span className="font-medium">Loại:</span>
                            <span className="ml-2">{exam.exam_type?.name || '-'}</span>
                        </div>

                        <div className="flex items-center text-sm text-gray-600">
                            <CalendarOutlined className="mr-2 text-green-500" />
                            <span className="font-medium">Bắt đầu:</span>
                            <span className="ml-2">{formatDate(exam.startDate)}</span>
                        </div>

                        <div className="flex items-center text-sm text-gray-600">
                            <CalendarOutlined className="mr-2 text-red-500" />
                            <span className="font-medium">Kết thúc:</span>
                            <span className="ml-2">{formatDate(exam.endDate)}</span>
                        </div>

                        {exam.author && (
                            <div className="flex items-center text-sm text-gray-600">
                                <UserOutlined className="mr-2 text-purple-500" />
                                <span className="font-medium">Tác giả:</span>
                                <span className="ml-2 line-clamp-1">{exam.author.name}</span>
                            </div>
                        )}

                        {exam.exam_events && exam.exam_events.length > 0 && (
                            <div className="flex items-start text-sm text-gray-600">
                                <ClockCircleOutlined className="mr-2 mt-1 text-orange-500" />
                                <div className="flex-1">
                                    <span className="font-medium">Sự kiện liên quan:</span>
                                    <div className="ml-2 mt-1 flex flex-wrap gap-1">
                                        {exam.exam_events.slice(0, 2).map(event => (
                                            <Tag key={event.id} color="blue" className="text-xs m-0">
                                                {event.name}
                                            </Tag>
                                        ))}
                                        {exam.exam_events.length > 2 && (
                                            <Tag color="default" className="text-xs m-0">
                                                +{exam.exam_events.length - 2}
                                            </Tag>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Action Button */}
                    <Button
                        type="primary"
                        size="large"
                        block
                        className={isActive ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600'}
                        onClick={() => handleJoinExam(exam)}
                        disabled={status.text === 'Đã kết thúc'}
                    >
                        {status.text === 'Đã kết thúc' ? 'Đã kết thúc' : 'Tham gia ngay'}
                    </Button>
                </div>
            </Card>
        );
    };

    useEffect(() => {
        handleSearch(false);
    }, []);

    return (
        <div className="w-full max-w-full min-h-screen">
            <div className="mx-auto max-w-full lg:max-w-7xl">
                {/* Search Form - Giống Admin */}
                <Card style={{ marginBottom: '16px' }} className="w-full">
                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={() => handleSearch(true)}
                        className="w-full"
                    >
                        <Row gutter={16}>
                            <Col xs={24} sm={12} md={6}>
                                <Form.Item label="Tên kỳ thi" name="name">
                                    <Input
                                        placeholder="Nhập tên kỳ thi"
                                        allowClear
                                    />
                                </Form.Item>
                            </Col>
                            <Col xs={24} sm={12} md={6}>
                                <Form.Item label="Mã kỳ thi" name="code">
                                    <Input
                                        placeholder="Nhập mã kỳ thi"
                                        allowClear
                                    />
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={12}>
                                <Form.Item label="Mô tả" name="description">
                                    <Input
                                        placeholder="Nhập mô tả"
                                        allowClear
                                    />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row justify="space-between" className="flex-wrap">
                            <Col className='md:mb-0 mb-4'>
                                <div className="flex gap-2">
                                    <Button
                                        type="primary"
                                        htmlType="submit"
                                        icon={<SearchOutlined />}
                                        loading={loading}
                                        className='bg-blue-600'
                                    >
                                        Tìm kiếm
                                    </Button>
                                    <Button
                                        icon={<ReloadOutlined />}
                                        onClick={handleReset}
                                    >
                                        Đặt lại
                                    </Button>
                                </div>
                            </Col>
                        </Row>
                    </Form>
                </Card>

                {/* Data Cards - Giống Admin */}
                <Card
                    title="Danh sách kỳ thi"
                    extra={
                        <span style={{ color: '#666' }}>
                            Tổng số: {pagination.total} kỳ thi
                        </span>
                    }
                    className="w-full"
                >
                    <Spin spinning={loading} size="large">
                        {dataListExamEvents?.rows && dataListExamEvents.rows.length > 0 ? (
                            <div className="w-full">
                                <Row gutter={[24, 24]}>
                                    {dataListExamEvents.rows.map(exam => (
                                        <Col xs={24} sm={12} lg={8} key={exam.id}>
                                            <ExamCard exam={exam} />
                                        </Col>
                                    ))}
                                </Row>
                            </div>
                        ) : (
                            <Empty
                                description="Không tìm thấy kỳ thi nào"
                                className="my-12"
                            />
                        )}
                    </Spin>

                    {/* Pagination - Giống Admin */}
                    <div style={{ marginTop: '16px' }} className="flex justify-end">
                        <SimplePagination
                            page={pagination.current}
                            total={pagination.total}
                            limit={pagination.pageSize}
                            onChange={handlePageChange}
                        />
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default UserExamEvents;