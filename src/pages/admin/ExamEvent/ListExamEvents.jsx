import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Table, Input, Button, Card, Space, Row, Col, Form, Tag, Select, Image } from 'antd';
import { SearchOutlined, PlusOutlined, ReloadOutlined, FileTextOutlined } from '@ant-design/icons';
import { actionGetListExamEvents, actionDeleteExamEvent } from '../../../redux/exam_event/actions';
import ActionEditDelete from '../../../components/ActionEditDelete';
import SimplePagination from '../../../components/Pagination/Pagination';
import CreateUpdateExamEvent from './CreateUpdateExamEvent';
import { useNavigate } from 'react-router-dom';
import {
    showErrorAlert,
    showSuccessToast,
    showDeleteConfirmDialog
} from '../../../lib/sweetAlertConfig';

const DEFAULT_PAGINATION = {
    current: 1,
    pageSize: 10,
    total: 0
};

const ListExamEvents = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { dataListExamEvents, loading } = useSelector(state => state.examEvents);
    const [form] = Form.useForm();
    const [pagination, setPagination] = useState(DEFAULT_PAGINATION);

    const [modalVisible, setModalVisible] = useState(false);
    const [modalMode, setModalMode] = useState('create');
    const [editId, setEditId] = useState(null);

    const buildSearchParams = useCallback((formValues = {}, paginationInfo = pagination) => {
        const { name, description, status, code } = formValues;
        return {
            ...(name && { name }),
            ...(description && { description }),
            ...(status && { status }),
            ...(code && { code }),
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

            await showErrorAlert('Đã xảy ra lỗi khi tải dữ liệu. Vui lòng thử lại.');
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

    const handleView = useCallback((record) => {
        console.log('View class:', record);
        navigate(`/admin/exam-events/info-exam-event/${record.id}`);
    }, [navigate]);

    const handleEdit = useCallback((record) => {
        console.log('Edit exam event:', record);
        setModalMode('edit');
        setEditId(record.id);
        setModalVisible(true);
    }, []);

    const handleDelete = useCallback(async (record) => {
        const result = await showDeleteConfirmDialog(record.name, 'người dùng');

        if (!result.isConfirmed) return;

        try {
            const deleteResult = await dispatch(actionDeleteExamEvent(record.id));

            if (deleteResult?.success || deleteResult?.status === 200 || deleteResult) {
                await showSuccessToast('Xóa kỳ thi thành công');

                handleSearch(true);
            } else {
                await showErrorAlert(deleteResult?.message || 'Xóa kỳ thi thất bại');
            }
        } catch (error) {
            console.error('Delete error:', error);

            await showErrorAlert('Đã xảy ra lỗi, vui lòng thử lại');
        }
    }, [dispatch, handleSearch]);

    const handleAddNew = useCallback(() => {
        setModalMode('create');
        setEditId(null);
        setModalVisible(true);
    }, []);

    const handleModalSuccess = useCallback(() => {
        setModalVisible(false);
        setEditId(null);
        setModalMode('create');
        handleSearch(true);
    }, [handleSearch]);

    const handleModalCancel = useCallback(() => {
        setModalVisible(false);
        setEditId(null);
        setModalMode('create');
    }, []);

    const truncateText = (text, maxLength = 100) => {
        if (!text) return '-';
        return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
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
                                borderRadius: '6px',
                                border: '1px solid #f0f0f0'
                            }}
                            preview={{
                                mask: 'Xem ảnh'
                            }}
                        />
                    ) : (
                        <div className="w-10 h-10 bg-gradient-to-br from-green-500 via-blue-500 to-purple-500 rounded flex items-center justify-center text-white text-xs font-bold">
                            <FileTextOutlined />
                        </div>
                    )}
                </div>
            )
        },
        {
            title: 'Tên',
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
            title: 'Mã kỳ thi',
            dataIndex: 'code',
            key: 'code',
            width: 200,
            render: (code) => (
                <div className=" text-blue-600">
                    {code || '-'}
                </div>
            )
        },
        {
            title: 'Mô tả',
            dataIndex: 'description',
            key: 'description',
            width: 250,
            render: (description) => (
                <div title={description} className="max-w-60 text-gray-600">
                    {truncateText(description, 80)}
                </div>
            )
        },
        {
            title: 'Ngày tạo',
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
                    tooltipText={record.name}
                    hideEdit
                />
            )
        }
    ], [pagination, handleView, handleEdit, handleDelete]);

    useEffect(() => {
        handleSearch(false);
    }, []);

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
                    title="Danh sách kỳ thi"
                    extra={
                        <span style={{ color: '#666' }}>
                            Tổng số: {pagination.total} kỳ thi
                        </span>
                    }
                    className="w-full"
                >
                    <div className="w-full overflow-x-auto -mx-3 sm:mx-0 max-w-full">
                        <div className="px-3 sm:px-0">
                            <Table
                                columns={columns}
                                dataSource={dataListExamEvents?.rows || []}
                                loading={loading}
                                rowKey="id"
                                pagination={false}
                                size="middle"
                                scroll={{ x: 1400 }}
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

            {/* Create/Update Modal */}
            <CreateUpdateExamEvent
                visible={modalVisible}
                mode={modalMode}
                editId={editId}
                onSuccess={handleModalSuccess}
                onCancel={handleModalCancel}
            />
        </div>
    );
};

export default ListExamEvents;