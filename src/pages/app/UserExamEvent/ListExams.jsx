import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Table, Input, Card, Space, Row, Col, Form, Tag, Select, Image, Button } from 'antd';
import { SearchOutlined, ReloadOutlined, FileTextOutlined } from '@ant-design/icons';
import { actionGetListExams } from '../../../redux/exam/actions';
import { actionGetListExamTypes } from '../../../redux/exam_type/actions';
import SimplePagination from '../../../components/Pagination/Pagination';
import dayjs from 'dayjs';
import { showErrorAlert, showSuccessToast } from '../../../lib/sweetAlertConfig';

const { Option } = Select;

const DEFAULT_PAGINATION = {
    current: 1,
    pageSize: 10,
    total: 0
};

const ListExams = ({ examEventId }) => {
    const dispatch = useDispatch();
    const { dataListExams, loading } = useSelector(state => state.exams);
    const { dataListExamTypes } = useSelector(state => state.examTypes);
    const [form] = Form.useForm();
    const [pagination, setPagination] = useState(DEFAULT_PAGINATION);

    const buildSearchParams = useCallback((formValues = {}, paginationInfo = pagination) => {
        const { name, code, type_id } = formValues;
        return {
            exam_event_id: examEventId,
            ...(name && { name }),
            ...(code && { code }),
            ...(type_id && { type_id }),
            page: paginationInfo.current,
            limit: paginationInfo.pageSize
        };
    }, [pagination, examEventId]);

    const handleSearch = useCallback(async (resetPage = true) => {
        if (!examEventId) return;

        const formValues = form.getFieldsValue();
        const searchPagination = resetPage
            ? { ...pagination, current: 1 }
            : pagination;

        if (resetPage) {
            setPagination(searchPagination);
        }

        const params = buildSearchParams(formValues, searchPagination);

        try {
            const result = await dispatch(actionGetListExams(params));
            const total = result?.total || 0;

            setPagination(prev => ({
                ...prev,
                total,
                ...(resetPage && { current: 1 })
            }));
        } catch (error) {
            console.error('Error fetching exams:', error);
            setPagination(prev => ({ ...prev, total: 0 }));
            await showErrorAlert('Đã xảy ra lỗi khi tải dữ liệu. Vui lòng thử lại.');
        }
    }, [dispatch, form, pagination, buildSearchParams, examEventId]);

    const handlePageChange = useCallback((page) => {
        const newPagination = { ...pagination, current: page };
        setPagination(newPagination);

        const formValues = form.getFieldsValue();
        const params = buildSearchParams(formValues, newPagination);
        dispatch(actionGetListExams(params));
    }, [dispatch, form, pagination, buildSearchParams]);

    const handleReset = useCallback(async () => {
        form.resetFields();
        setPagination(prev => ({ ...prev, current: 1 }));
        const params = { 
            exam_event_id: examEventId, 
            page: 1, 
            limit: pagination.pageSize 
        };

        try {
            await dispatch(actionGetListExams(params));
            showSuccessToast('Đã đặt lại bộ lọc');
        } catch (error) {
            console.error('Reset error:', error);
        }
    }, [dispatch, form, pagination.pageSize, examEventId]);

    const truncateText = (text, maxLength = 100) => {
        if (!text) return '-';
        return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
    };

    const formatDateTime = (date) => {
        if (!date) return '-';
        return dayjs(date).format('DD/MM/YYYY HH:mm');
    };

    const getExamStatus = (startDate, endDate) => {
        const now = dayjs();
        const start = dayjs(startDate);
        const end = dayjs(endDate);

        if (now.isBefore(start)) {
            return <Tag color="blue">Sắp diễn ra</Tag>;
        } else if (now.isAfter(end)) {
            return <Tag color="default">Đã kết thúc</Tag>;
        } else {
            return <Tag color="green">Đang diễn ra</Tag>;
        }
    };

    const columns = useMemo(() => [
        {
            title: 'STT',
            key: 'stt',
            align: 'center',
            width: 60,
            render: (_, __, index) => (pagination.current - 1) * pagination.pageSize + index + 1
        },
        {
            title: 'Ảnh',
            dataIndex: 'image',
            key: 'image',
            width: 80,
            align: 'center',
            render: (image, record) => (
                <div className="flex justify-center">
                    {image ? (
                        <Image
                            src={image}
                            alt={record.name}
                            width={40}
                            height={40}
                            style={{
                                objectFit: 'cover',
                                borderRadius: '8px',
                                border: '1px solid #f0f0f0'
                            }}
                            preview={{
                                mask: 'Xem ảnh'
                            }}
                        />
                    ) : (
                        <div className="w-10 h-10 rounded bg-gradient-to-br from-green-500 via-blue-500 to-purple-500 flex items-center justify-center text-white">
                            <FileTextOutlined />
                        </div>
                    )}
                </div>
            )
        },
        {
            title: 'Tên đề thi',
            dataIndex: 'name',
            key: 'name',
            width: 200,
            render: (name) => (
                <div title={name} className="max-w-48 font-medium">
                    {truncateText(name, 50)}
                </div>
            )
        },
        {
            title: 'Mã đề',
            dataIndex: 'code',
            key: 'code',
            width: 140,
            render: (code) => (
                <Tag color="blue">{code || '-'}</Tag>
            )
        },
        {
            title: 'Loại đề thi',
            dataIndex: ['exam_type', 'name'],
            key: 'exam_type',
            width: 150,
            render: (exam_type) => (
                <span className="text-gray-600">
                    {exam_type || '-'}
                </span>
            )
        },
        {
            title: 'Thời gian làm bài',
            dataIndex: 'doing_time',
            key: 'doing_time',
            width: 120,
            align: 'center',
            render: (time) => (
                <span className="text-gray-600">
                    {time ? `${time} phút` : '-'}
                </span>
            )
        },
        {
            title: 'Điểm',
            dataIndex: 'score',
            key: 'score',
            width: 80,
            align: 'center',
            render: (score) => (
                <Tag color="green">{score || 0}</Tag>
            )
        },
        {
            title: 'Thời gian thi',
            key: 'exam_time',
            width: 200,
            render: (_, record) => (
                <div className="text-xs">
                    <div>Bắt đầu: {formatDateTime(record.startDate)}</div>
                    <div>Kết thúc: {formatDateTime(record.endDate)}</div>
                </div>
            )
        },
        {
            title: 'Trạng thái',
            key: 'status',
            width: 120,
            align: 'center',
            render: (_, record) => getExamStatus(record.startDate, record.endDate)
        }
    ], [pagination]);

    useEffect(() => {
        dispatch(actionGetListExamTypes({ page: 1, limit: 1000 }));
        if (examEventId) {
            handleSearch(false);
        }
    }, [examEventId]);

    if (!examEventId) {
        return (
            <Card>
                <div className="text-center text-gray-500 py-8">
                    Vui lòng chọn kỳ thi để xem danh sách đề thi
                </div>
            </Card>
        );
    }

    return (
        <div className="w-full max-w-full min-h-screen">
            <div className="mx-auto max-w-full lg:max-w-7xl">
                {/* Search Form */}
                <Card style={{ marginBottom: '16px' }} className="w-full">
                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={() => handleSearch(true)}
                        className="w-full"
                    >
                        <Row gutter={16}>
                            <Col xs={24} sm={12} md={8}>
                                <Form.Item label="Tên đề thi" name="name">
                                    <Input
                                        placeholder="Nhập tên đề thi"
                                        allowClear
                                    />
                                </Form.Item>
                            </Col>
                            <Col xs={24} sm={12} md={8}>
                                <Form.Item label="Mã đề" name="code">
                                    <Input
                                        placeholder="Nhập mã đề"
                                        allowClear
                                    />
                                </Form.Item>
                            </Col>
                            <Col xs={24} sm={12} md={8}>
                                <Form.Item label="Loại đề thi" name="type_id">
                                    <Select
                                        placeholder="Chọn loại đề thi"
                                        allowClear
                                        showSearch
                                        optionFilterProp="children"
                                    >
                                        {dataListExamTypes?.rows?.map(type => (
                                            <Option key={type.id} value={type.id}>
                                                {type.name}
                                            </Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row justify="start">
                            <Col>
                                <Space wrap>
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
                                </Space>
                            </Col>
                        </Row>
                    </Form>
                </Card>

                {/* Data Table */}
                <Card
                    title="Danh sách đề thi"
                    extra={
                        <span style={{ color: '#666' }}>
                            Tổng số: {pagination.total} đề thi
                        </span>
                    }
                    className="w-full"
                >
                    <div className="w-full overflow-x-auto -mx-3 sm:mx-0 max-w-full">
                        <div className="px-3 sm:px-0">
                            <Table
                                columns={columns}
                                dataSource={dataListExams?.rows || []}
                                loading={loading}
                                rowKey="id"
                                pagination={false}
                                size="middle"
                                scroll={{ x: 1200 }}
                            />
                        </div>
                    </div>

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

export default ListExams;