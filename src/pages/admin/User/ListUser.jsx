import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Table, Input, Button, Card, Space, Row, Col, Form, Tag, Select, Image } from 'antd';
import { SearchOutlined, PlusOutlined, ReloadOutlined, UserOutlined } from '@ant-design/icons';
import { actionGetListUsers } from '../../../redux/user/actions';
import { actionGetListRoles } from '../../../redux/role/actions';
import ActionEditDelete from '../../../components/ActionEditDelete';
import SimplePagination from '../../../components/Pagination/Pagination';
import { useNavigate } from 'react-router-dom';
import {
    showErrorAlert,
    showSuccessToast,
    showDeleteConfirmDialog
} from '../../../lib/sweetAlertConfig';

const { Option } = Select;

const DEFAULT_PAGINATION = {
    current: 1,
    pageSize: 10,
    total: 0
};

const USER_STATUS = [
    { value: '1', label: 'ACTIVE', color: 'green' },
    { value: '0', label: 'INACTIVE', color: 'red' }
];

const LOCK_STATUS = [
    { value: '0', label: 'BÌNH THƯỜNG', color: 'green' },
    { value: '1', label: 'BỊ KHÓA', color: 'red' }
];

const ListUsers = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { dataListUser, loading } = useSelector(state => state.users);
    const { dataListRoles } = useSelector(state => state.roles);
    const [form] = Form.useForm();
    const [pagination, setPagination] = useState(DEFAULT_PAGINATION);

    const buildSearchParams = useCallback((formValues = {}, paginationInfo = pagination) => {
        const { name, email, mobile, status, is_lock, role_id } = formValues;
        return {
            ...(name && { name }),
            ...(email && { email }),
            ...(mobile && { mobile }),
            ...(status && { status }),
            ...(is_lock !== undefined && { is_lock }),
            ...(role_id && { role_id }),
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
            const result = await dispatch(actionGetListUsers(params));
            const total = result?.total || 0;

            setPagination(prev => ({
                ...prev,
                total,
                ...(resetPage && { current: 1 })
            }));
        } catch (error) {
            console.error('Error fetching users:', error);
            setPagination(prev => ({ ...prev, total: 0 }));

            await showErrorAlert('Đã xảy ra lỗi khi tải dữ liệu. Vui lòng thử lại.');
        }
    }, [dispatch, form, pagination, buildSearchParams]);

    const handlePageChange = useCallback((page) => {
        const newPagination = { ...pagination, current: page };
        setPagination(newPagination);

        const formValues = form.getFieldsValue();
        const params = buildSearchParams(formValues, newPagination);
        dispatch(actionGetListUsers(params));
    }, [dispatch, form, pagination, buildSearchParams]);

    const handleReset = useCallback(async () => {
        form.resetFields();
        setPagination(prev => ({ ...prev, current: 1 }));
        const params = { page: 1, limit: pagination.pageSize };

        try {
            await dispatch(actionGetListUsers(params));

            // Show success toast
            showSuccessToast('Đã đặt lại bộ lọc');
        } catch (error) {
            console.error('Reset error:', error);
        }
    }, [dispatch, form, pagination.pageSize]);

    const handleView = useCallback((record) => {
        console.log('View user:', record);
        navigate(`/admin/user/info-user/${record.id}`);
    }, [navigate]);

    const handleEdit = useCallback((record) => {
        console.log('Edit user:', record);
        // TODO: Implement edit modal
    }, []);

    const handleDelete = useCallback(async (record) => {
        // Show confirmation dialog
        const result = await showDeleteConfirmDialog(record.name, 'người dùng');

        if (!result.isConfirmed) return;

        try {
            // TODO: Implement delete user action
            console.log('Delete user:', record);
            
            await showSuccessToast('Đã xóa người dùng thành công');

            handleSearch(true);
        } catch (error) {
            console.error('Delete error:', error);

            await showErrorAlert('Đã xảy ra lỗi, vui lòng thử lại');
        }
    }, [handleSearch]);

    const handleAddNew = useCallback(() => {
        console.log('Add new user');
        // TODO: Implement add user modal
    }, []);

    const truncateText = (text, maxLength = 100) => {
        if (!text) return '-';
        return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
    };

    const getStatusInfo = (status) => {
        const statusObj = USER_STATUS.find(s => s.value === String(status));
        return statusObj || { label: 'Unknown', color: 'default' };
    };

    const getLockStatusInfo = (is_lock) => {
        const lockObj = LOCK_STATUS.find(s => s.value === String(is_lock));
        return lockObj || { label: 'Unknown', color: 'default' };
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
            title: 'Avatar',
            dataIndex: 'avatar',
            key: 'avatar',
            width: 80,
            align: 'center',
            render: (avatar, record) => (
                <div className="flex justify-center">
                    {avatar ? (
                        <Image
                            src={avatar}
                            alt={record.name}
                            width={40}
                            height={40}
                            style={{
                                objectFit: 'cover',
                                borderRadius: '50%', 
                                border: '1px solid #f0f0f0'
                            }}
                            preview={{
                                mask: 'Xem ảnh'
                            }}
                        />
                    ) : (
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 via-blue-500 to-purple-500 flex items-center justify-center text-white">
                            <UserOutlined />
                        </div>
                    )}
                </div>
                )
        },
        {
            title: 'Tên người dùng',
            dataIndex: 'name',
            key: 'name',
            width: 180,
            render: (name) => (
                <div title={name} className="max-w-44 font-medium">
                    {truncateText(name, 40)}
                </div>
            )
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
            width: 200,
            render: (email) => (
                <div title={email} className="max-w-48 text-blue-600">
                    {truncateText(email, 35)}
                </div>
            )
        },
        {
            title: 'Số điện thoại',
            dataIndex: 'mobile',
            key: 'mobile',
            width: 140,
            render: (mobile) => (
                <span className="font-mono">
                    {mobile || '-'}
                </span>
            )
        },
        {
            title: 'Vai trò',
            dataIndex: 'role',
            key: 'role',
            width: 120,
            align: 'center',
            render: (role) => {
                let color = 'blue';
                if (role?.name === 'Admin') color = 'red';
                else if (role?.name === 'Teacher') color = 'green';
                else if (role?.name === 'User') color = 'orange';

                return (
                    <Tag color={color} title={role?.description}>
                        {role?.name}
                    </Tag>
                );
            }
        },
        {
            title: 'Địa chỉ',
            dataIndex: 'address',
            key: 'address',
            width: 200,
            render: (address, record) => (
                <div className="space-y-1">
                    {address && (
                        <div title={address} className="text-sm text-gray-700">
                            {truncateText(address, 30)}
                        </div>
                    )}
                    {record.city && (
                        <div className="text-xs text-gray-500">
                            {record.city}
                        </div>
                    )}
                    {!address && !record.city && (
                        <span className="text-gray-400">-</span>
                    )}
                </div>
            )
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            width: 100,
            align: 'center',
            render: (status) => {
                const statusInfo = getStatusInfo(status);
                return (
                    <Tag color={statusInfo.color}>
                        {statusInfo.label}
                    </Tag>
                );
            }
        },
        {
            title: 'Khóa tài khoản',
            dataIndex: 'is_lock',
            key: 'is_lock',
            width: 120,
            align: 'center',
            render: (is_lock) => {
                const lockInfo = getLockStatusInfo(is_lock);
                return (
                    <Tag color={lockInfo.color}>
                        {lockInfo.label}
                    </Tag>
                );
            }
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
        dispatch(actionGetListRoles());
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
                                <Form.Item label="Tên người dùng" name="name">
                                    <Input
                                        placeholder="Nhập tên người dùng"
                                        allowClear
                                    />
                                </Form.Item>
                            </Col>
                            <Col xs={24} sm={12} md={6}>
                                <Form.Item label="Email" name="email">
                                    <Input
                                        placeholder="Nhập email"
                                        allowClear
                                    />
                                </Form.Item>
                            </Col>
                            <Col xs={24} sm={12} md={6}>
                                <Form.Item label="Số điện thoại" name="mobile">
                                    <Input
                                        placeholder="Nhập số điện thoại"
                                        allowClear
                                    />
                                </Form.Item>
                            </Col>
                            <Col xs={24} sm={12} md={6}>
                                <Form.Item label="Vai trò" name="role_id">
                                    <Select
                                        placeholder="Chọn vai trò"
                                    allowClear
                                >
                                {dataListRoles?.rows?.map(role => (
                                    <Option key={role.id} value={role.id}>
                                    {role.name}
                                    </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={16}>
                            <Col xs={24} sm={12} md={6}>
                                <Form.Item label="Trạng thái" name="status">
                                    <Select
                                        placeholder="Chọn trạng thái"
                                        allowClear
                                    >
                                        {USER_STATUS.map(status => (
                                            <Option key={status.value} value={status.value}>
                                                {status.label}
                                            </Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col xs={24} sm={12} md={6}>
                                <Form.Item label="Khóa tài khoản" name="is_lock">
                                    <Select
                                        placeholder="Chọn trạng thái khóa"
                                        allowClear
                                    >
                                        {LOCK_STATUS.map(lock => (
                                            <Option key={lock.value} value={lock.value}>
                                                {lock.label}
                                            </Option>
                                        ))}
                                    </Select>
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
                    title="Danh sách người dùng"
                    extra={
                        <span style={{ color: '#666' }}>
                            Tổng số: {pagination.total} người dùng
                        </span>
                    }
                    className="w-full"
                >
                    <div className="w-full overflow-x-auto -mx-3 sm:mx-0 max-w-full">
                        <div className="px-3 sm:px-0">
                            <Table
                                columns={columns}
                                dataSource={dataListUser?.rows || []}
                                loading={loading}
                                rowKey="id"
                                pagination={false}
                                size="middle"
                                scroll={{ x: 1500 }}
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

export default ListUsers;