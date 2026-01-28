import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Table, Input, Button, Card, Space, Row, Col, Form, Tag } from 'antd';
import { SearchOutlined, PlusOutlined, ReloadOutlined } from '@ant-design/icons';
import { actionGetListRoles, actionDeleteRole, actionGetPermissionsByRole, actionTogglePermissionForRole } from '../../../redux/role/actions';
import { actionGetPermissionTree } from '../../../redux/permission/actions';
import ActionEditDelete from '../../../components/ActionEditDelete';
import SimplePagination from '../../../components/Pagination/Pagination';
import CreateUpdateRole from './CreateUpdateRole';
import ViewRolePermissions from './ViewRolePermissions'; 
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

const ListRoles = () => {
    const dispatch = useDispatch();
    const { dataListRoles, loading } = useSelector(state => state.roles);
    console.log(dataListRoles);
    const [form] = Form.useForm();
    const [pagination, setPagination] = useState(DEFAULT_PAGINATION);

    // Modal states
    const [modalVisible, setModalVisible] = useState(false);
    const [modalMode, setModalMode] = useState('create'); // 'create' or 'edit'
    const [editId, setEditId] = useState(null);

    // View permissions modal states
    const [viewModalVisible, setViewModalVisible] = useState(false);
    const [viewRoleId, setViewRoleId] = useState(null);

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
            const result = await dispatch(actionGetListRoles(params));
            const total = result?.total || 0;

            setPagination(prev => ({
                ...prev,
                total,
                ...(resetPage && { current: 1 })
            }));
        } catch (error) {
            console.error('Error fetching roles:', error);
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
        dispatch(actionGetListRoles(params));
    }, [dispatch, form, pagination, buildSearchParams]);

    const handleReset = useCallback(async () => {
        form.resetFields();
        setPagination(prev => ({ ...prev, current: 1 }));
        const params = { page: 1, limit: pagination.pageSize };

        try {
            await dispatch(actionGetListRoles(params));

            // Show success toast
            showSuccessToast('Đã đặt lại bộ lọc');
        } catch (error) {
            console.error('Reset error:', error);
        }
    }, [dispatch, form, pagination.pageSize]);

    const handleView = useCallback((record) => {
        console.log('View role permissions:', record);
        setViewRoleId(record.id);
        setViewModalVisible(true);
    }, []);

    const handleEdit = useCallback((record) => {
        console.log('Edit permission group:', record);
        setModalMode('edit');
        setEditId(record.id);
        setModalVisible(true);
    }, []);

    const handleDelete = useCallback(async (record) => {
        // Show confirmation dialog
        const result = await showDeleteConfirmDialog(record.name, 'vai trò');

        if (!result.isConfirmed) return;

        try {
            const deleteResult = await dispatch(actionDeleteRole(record.id));

            if (deleteResult?.success || deleteResult?.status === 200 || deleteResult) {
                // Show success alert
                await showSuccessToast('Xóa vai trò thành công');

                handleSearch(true);
            } else {
                // Show error alert
                await showErrorAlert(deleteResult?.message || 'Xóa vai trò thất bại');
            }
        } catch (error) {
            console.error('Delete error:', error);

            // Show error alert
            await showErrorAlert('Đã xảy ra lỗi, vui lòng thử lại');
        }
    }, [dispatch, handleSearch]);

    const handleAddNew = useCallback(() => {
        console.log('Add new permission group');
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

    // Handle view modal cancel
    const handleViewModalCancel = useCallback(() => {
        setViewModalVisible(false);
        setViewRoleId(null);
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
            title: 'Tên vai trò',
            dataIndex: 'name',
            key: 'name',
            width: 200,
            render: (name) => (
                <div title={name} className="max-w-48">
                    {truncateText(name, 50)}
                </div>
            )
        },
        {
            title: 'Mã vai trò',
            dataIndex: 'code',
            key: 'code',
            width: 180,
            render: (code) => (
                <Tag color="blue" className="font-mono">
                    {code}
                </Tag>
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
                    tooltipText={record.name}
                />
            )
        }
    ], [pagination, handleView, handleEdit, handleDelete]);

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
                                <Form.Item label="Tên vai trò" name="name">
                                    <Input
                                        placeholder="Nhập tên vai trò"
                                        allowClear
                                    />
                                </Form.Item>
                            </Col>
                            <Col xs={24} sm={12} md={8}>
                                <Form.Item label="Mã vai trò" name="code">
                                    <Input
                                        placeholder="Nhập mã vai trò"
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
                                >
                                    Thêm mới
                                </Button>
                            </Col>
                        </Row>
                    </Form>
                </Card>

                {/* Data Table */}
                <Card
                    title="Danh sách vai trò"
                    extra={
                        <span style={{ color: '#666' }}>
                            Tổng số: {pagination.total} vai trò
                        </span>
                    }
                    className="w-full"
                >
                    <div className="w-full overflow-x-auto -mx-3 sm:mx-0 max-w-full">
                        <div className="px-3 sm:px-0">
                            <Table
                                columns={columns}
                                dataSource={dataListRoles?.rows || []}
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
            <CreateUpdateRole
                visible={modalVisible}
                mode={modalMode}
                editId={editId}
                onSuccess={handleModalSuccess}
                onCancel={handleModalCancel}
            />

            {/* View Role Permissions Modal */}
            <ViewRolePermissions
                visible={viewModalVisible}
                roleId={viewRoleId}
                onCancel={handleViewModalCancel}
                actionGetPermissionTree={actionGetPermissionTree}
                actionGetPermissionsByRole={actionGetPermissionsByRole}
                actionTogglePermissionForRole={actionTogglePermissionForRole}
            />
        </div>
    );
};

export default ListRoles;