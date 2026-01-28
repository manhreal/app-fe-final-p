import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Table, Input, Select, Button, Card, Space, Avatar, Row, Col, Form, Image, Tag } from 'antd';
import { SearchOutlined, PlusOutlined, ReloadOutlined, EyeOutlined } from '@ant-design/icons';
import { actionGetListNews, actionDeleteNews } from '../../../redux/news/actions';
import ActionEditDelete from '../../../components/ActionEditDelete';
import SimplePagination from '../../../components/Pagination/Pagination';
import { useNavigate } from 'react-router-dom';
import {
    showErrorAlert,
    showSuccessToast,
    showDeleteConfirmDialog
} from '../../../lib/sweetAlertConfig';

const { Option } = Select;

const NEWS_STATUS = [
    { value: '1', label: 'ACTIVE' },
    { value: '0', label: 'INACTIVE' },
    { value: '2', label: 'DRAFT' }
];

const DEFAULT_PAGINATION = {
    current: 1,
    pageSize: 10,
    total: 0
};

const ListNews = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { dataListNews, loading } = useSelector(state => state.news);
    console.log(dataListNews)
    const [form] = Form.useForm();
    const [pagination, setPagination] = useState(DEFAULT_PAGINATION);

    const buildSearchParams = useCallback((formValues = {}, paginationInfo = pagination) => {
        const { title, description, status, startDate, endDate } = formValues;
        return {
            ...(title && { title }),
            ...(description && { description }),
            ...(status && { status }),
            ...(startDate && { startDate }),
            ...(endDate && { endDate }),
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
            const result = await dispatch(actionGetListNews(params));
            const total = result?.total || 0;

            setPagination(prev => ({
                ...prev,
                total,
                ...(resetPage && { current: 1 })
            }));
        } catch (error) {
            console.error('Error fetching news:', error);
            setPagination(prev => ({ ...prev, total: 0 }));

            // Show error alert
            await showErrorAlert('Đã xảy ra lỗi khi tải dữ liệu. Vui lòng thử lại.');
        }
    }, [dispatch, form, pagination, buildSearchParams]);

    const handlePageChange = useCallback((page) => {
        const newPagination = { ...pagination, current: page };
        setPagination(newPagination);

        const formValues = form.getFieldsValue();
        const params = buildSearchParams(formValues, newPagination);
        dispatch(actionGetListNews(params));
    }, [dispatch, form, pagination, buildSearchParams]);

    const handleReset = useCallback(async () => {
        form.resetFields();
        setPagination(prev => ({ ...prev, current: 1 }));
        const params = { page: 1, limit: pagination.pageSize };

        try {
            await dispatch(actionGetListNews(params));

            // Show success toast
            showSuccessToast('Đã đặt lại bộ lọc');
        } catch (error) {
            console.error('Reset error:', error);
        }
    }, [dispatch, form, pagination.pageSize]);

    const handleView = useCallback((record) => {
        console.log('View news:', record);
        navigate(`/admin/news/info-news/${record.id}`);
    }, [navigate]);

    const handleEdit = useCallback((record) => {
        console.log('Edit news:', record);
        navigate(`/admin/news/edit-news/${record.id}`);
    }, [navigate]);

    const handleDelete = useCallback(async (record) => {
        // Show confirmation dialog
        const result = await showDeleteConfirmDialog(record.title, 'tin tức');

        if (!result.isConfirmed) return;

        try {
            const deleteResult = await dispatch(actionDeleteNews(record.id));

            if (deleteResult?.success || deleteResult?.status === 200 || deleteResult) {
                // Show success alert
                await showSuccessToast('Xóa tin tức thành công');

                handleSearch(true);
            } else {
                // Show error alert
                await showErrorAlert(deleteResult?.message || 'Xóa tin tức thất bại');
            }
        } catch (error) {
            console.error('Delete error:', error);

            // Show error alert
            await showErrorAlert('Đã xảy ra lỗi, vui lòng thử lại');
        }
    }, [dispatch, handleSearch]);

    const handleAddNew = useCallback(() => {
        console.log('Add new news');
        navigate('/admin/news/add-news');
    }, [navigate]);

    const truncateText = (text, maxLength = 100) => {
        if (!text) return '-';
        return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
    };

    const renderStatus = useCallback((status) => {
        const statusStr = String(status);
        const statusObj = NEWS_STATUS.find(s => s.value === statusStr);

        if (!statusObj) {
            return <Tag color="default">Unknown</Tag>;
        }

        const colors = {
            '1': 'green',    // ACTIVE
            '0': 'red',      // INACTIVE  
            '2': 'orange'    // DRAFT
        };

        return (
            <Tag color={colors[statusStr] || 'default'}>
                {statusObj.label}
            </Tag>
        );
    }, []);

    const columns = useMemo(() => [
        {
            title: 'STT',
            key: 'stt',
            align: 'center',
            width: 60,
            render: (_, __, index) => (pagination.current - 1) * pagination.pageSize + index + 1
        },
        {
            title: 'Hình ảnh',
            dataIndex: 'image',
            key: 'image',
            align: 'center',
            width: 100,
            render: (image, record) => (
                <div className="flex justify-center">
                    {image ? (
                        <Image
                            src={image}
                            alt={record.title}
                            width={60}
                            height={40}
                            style={{ objectFit: 'cover', borderRadius: '4px' }}
                            preview={{
                                mask: <EyeOutlined />
                            }}
                        />
                    ) : (
                        <div className="w-15 h-10 bg-gray-200 flex items-center justify-center rounded text-xs text-gray-500">
                            No Image
                        </div>
                    )}
                </div>
            )
        },
        {
            title: 'Tiêu đề',
            dataIndex: 'title',
            key: 'title',
            width: 200,
            render: (title) => (
                <div title={title} className="max-w-48">
                    {truncateText(title, 50)}
                </div>
            )
        },
        {
            title: 'Mô tả',
            dataIndex: 'description',
            key: 'description',
            width: 250,
            render: (description) => (
                <div title={description} className="max-w-60">
                    {truncateText(description, 80)}
                </div>
            )
        },
        {
            title: 'Ngày bắt đầu',
            dataIndex: 'startDate',
            key: 'startDate',
            width: 120,
            render: (startDate) => {
                return startDate ? new Date(startDate).toLocaleDateString('vi-VN') : '-';
            }
        },
        {
            title: 'Ngày kết thúc',
            dataIndex: 'endDate',
            key: 'endDate',
            width: 120,
            render: (endDate) => {
                return endDate ? new Date(endDate).toLocaleDateString('vi-VN') : '-';
            }
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            align: 'center',
            width: 100,
            render: (status) => renderStatus(status)
        },
        {
            title: 'Thời gian tạo',
            dataIndex: 'createdAt',
            key: 'createdAt',
            width: 120,
            render: (createdAt) => {
                return createdAt ? new Date(createdAt).toLocaleDateString('vi-VN') : '-';
            }
        },
        {
            title: 'Thao tác',
            key: 'actions',
            align: 'center',
            width: 120,
            fixed: 'right',
            render: (_, record) => (
                <ActionEditDelete
                    onclickView={() => handleView(record)}
                    onclickEdit={() => handleEdit(record)}
                    onclickDelete={() => handleDelete(record)}
                    tooltipText={record.title}
                />
            )
        }
    ], [pagination, handleView, handleEdit, handleDelete, renderStatus]);

    useEffect(() => {
        handleSearch(false);
    }, []);

    return (
        <div className="w-full max-w-full min-h-screen">
            <div className="mx-auto max-w-full lg:max-w-6xl">
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
                                <Form.Item label="Tiêu đề" name="title">
                                    <Input
                                        placeholder="Nhập tiêu đề tin tức"
                                        allowClear
                                    />
                                </Form.Item>
                            </Col>
                            <Col xs={24} sm={12} md={8}>
                                <Form.Item label="Mô tả" name="description">
                                    <Input
                                        placeholder="Nhập mô tả"
                                        allowClear
                                    />
                                </Form.Item>
                            </Col>
                            <Col xs={24} sm={12} md={8}>
                                <Form.Item label="Trạng thái" name="status">
                                    <Select
                                        placeholder="Chọn trạng thái"
                                        allowClear
                                    >
                                        {NEWS_STATUS.map(status => (
                                            <Option key={status.value} value={status.value}>
                                                {status.label}
                                            </Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={16}>
                            <Col xs={24} sm={12} md={8}>
                                <Form.Item label="Ngày bắt đầu" name="startDate">
                                    <Input
                                        type="date"
                                        placeholder="Chọn ngày bắt đầu"
                                    />
                                </Form.Item>
                            </Col>
                            <Col xs={24} sm={12} md={8}>
                                <Form.Item label="Ngày kết thúc" name="endDate">
                                    <Input
                                        type="date"
                                        placeholder="Chọn ngày kết thúc"
                                    />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row justify="space-between" className="flex-wrap">
                            <Col className='md:mb-0 mb-4'>
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
                            <Col>
                                <Button
                                    type="primary"
                                    icon={<PlusOutlined />}
                                    onClick={handleAddNew}
                                    className='bg-green-600'
                                >
                                    Thêm mới
                                </Button>
                            </Col>
                        </Row>
                    </Form>
                </Card>

                {/* Data Table */}
                <Card
                    title="Danh sách tin tức"
                    extra={
                        <span style={{ color: '#666' }}>
                            Tổng số: {pagination.total} tin tức
                        </span>
                    }
                    className="w-full"
                >
                    <div className="w-full overflow-x-auto -mx-3 sm:mx-0 max-w-full">
                        <div className="px-3 sm:px-0">
                            <Table
                                columns={columns}
                                dataSource={dataListNews?.rows || []}
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

export default ListNews;