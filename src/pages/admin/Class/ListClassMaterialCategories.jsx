import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Table, Input, Button, Card, Space, Row, Col, Form, Tag } from 'antd';
import { SearchOutlined, PlusOutlined, ReloadOutlined } from '@ant-design/icons';
import { actionGetListClassMaterialCategories, actionDeleteClassMaterialCategory } from '../../../redux/class_material_category/actions';
import ActionEditDelete from '../../../components/ActionEditDelete';
import SimplePagination from '../../../components/Pagination/Pagination';
import CreateUpdateClassMaterialCategory from './CreateUpdateClassMaterialCategory';
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

const ListClassMaterialCategories = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { dataListClassMaterialCategories, loading } = useSelector(state => state.classMaterialCategories);
    console.log(dataListClassMaterialCategories);
    const [form] = Form.useForm();
    const [pagination, setPagination] = useState(DEFAULT_PAGINATION);

    // Modal states
    const [modalVisible, setModalVisible] = useState(false);
    const [modalMode, setModalMode] = useState('create'); // 'create' or 'edit'
    const [editId, setEditId] = useState(null);

    const buildSearchParams = useCallback((formValues = {}, paginationInfo = pagination) => {
        const { name, description } = formValues;
        return {
            ...(name && { name }),
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
            const result = await dispatch(actionGetListClassMaterialCategories(params));
            const total = result?.total || 0;

            setPagination(prev => ({
                ...prev,
                total,
                ...(resetPage && { current: 1 })
            }));
        } catch (error) {
            console.error('Error fetching class material categories:', error);
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
        dispatch(actionGetListClassMaterialCategories(params));
    }, [dispatch, form, pagination, buildSearchParams]);

    const handleReset = useCallback(async () => {
        form.resetFields();
        setPagination(prev => ({ ...prev, current: 1 }));
        const params = { page: 1, limit: pagination.pageSize };

        try {
            await dispatch(actionGetListClassMaterialCategories(params));

            // Show success toast
            showSuccessToast('Đã đặt lại bộ lọc');
        } catch (error) {
            console.error('Reset error:', error);
        }
    }, [dispatch, form, pagination.pageSize]);

    const handleView = useCallback((record) => {
        console.log('View class material category:', record);
        navigate(`/admin/class-material-categories/info-category/${record.id}`);
    }, [navigate]);

    const handleEdit = useCallback((record) => {
        console.log('Edit class material category:', record);
        setModalMode('edit');
        setEditId(record.id);
        setModalVisible(true);
    }, []);

    const handleDelete = useCallback(async (record) => {
        // Show confirmation dialog
        const result = await showDeleteConfirmDialog(record.name, 'danh mục');

        if (!result.isConfirmed) return;

        try {
            const deleteResult = await dispatch(actionDeleteClassMaterialCategory(record.id));

            if (deleteResult?.success || deleteResult?.status === 200 || deleteResult) {
                // Show success alert
                await showSuccessToast('Xóa danh mục thành công');

                handleSearch(true);
            } else {
                // Show error alert
                await showErrorAlert(deleteResult?.message || 'Xóa danh mục thất bại');
            }
        } catch (error) {
            console.error('Delete error:', error);

            // Show error alert
            await showErrorAlert('Đã xảy ra lỗi, vui lòng thử lại');
        }
    }, [dispatch, handleSearch]);

    const handleAddNew = useCallback(() => {
        console.log('Add new class material category');
        setModalMode('create');
        setEditId(null);
        setModalVisible(true);
    }, []);

    // Handle modal success (create/update success)
    const handleModalSuccess = useCallback(() => {
        setModalVisible(false);
        setEditId(null);
        setModalMode('create');
        handleSearch(true); // Refresh the list
    }, [handleSearch]);

    // Handle modal cancel
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
            title: 'Tên danh mục',
            dataIndex: 'name',
            key: 'name',
            width: 250,
            render: (name) => (
                <div title={name} className="max-w-60">
                    <strong className="text-blue-600">{truncateText(name, 50)}</strong>
                </div>
            )
        },
        {
            title: 'Mô tả',
            dataIndex: 'description',
            key: 'description',
            width: 350,
            render: (description) => (
                <div title={description} className="max-w-80">
                    {truncateText(description, 100)}
                </div>
            )
        },
        {
            title: 'Thời gian cập nhật',
            dataIndex: 'updatedAt',
            key: 'updatedAt',
            width: 150,
            render: (updatedAt) => {
                return updatedAt ? new Date(updatedAt).toLocaleDateString('vi-VN', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit'
                }) : '-';
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
                    hideView
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
                            <Col xs={24} sm={12} md={8}>
                                <Form.Item label="Tên danh mục" name="name">
                                    <Input
                                        placeholder="Nhập tên danh mục"
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
                                    size="middle"
                                >
                                    Thêm mới
                                </Button>
                            </Col>
                        </Row>
                    </Form>
                </Card>

                {/* Data Table */}
                <Card
                    title="Danh sách danh mục tài liệu học tập"
                    extra={
                        <span style={{ color: '#666' }}>
                            Tổng số: {pagination.total} danh mục
                        </span>
                    }
                    className="w-full"
                >
                    <div className="w-full overflow-x-auto -mx-3 sm:mx-0 max-w-full">
                        <div className="px-3 sm:px-0">
                            <Table
                                columns={columns}
                                dataSource={dataListClassMaterialCategories?.rows || []}
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

            {/* Create/Update Modal */}
            <CreateUpdateClassMaterialCategory
                visible={modalVisible}
                mode={modalMode}
                editId={editId}
                onSuccess={handleModalSuccess}
                onCancel={handleModalCancel}
            />
        </div>
    );
};

export default ListClassMaterialCategories;