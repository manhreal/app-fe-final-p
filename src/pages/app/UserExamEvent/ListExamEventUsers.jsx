import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Table, Input, Card, Row, Col, Form, Tag, Select, Image, Button, Space } from 'antd';
import { UserOutlined, SearchOutlined, ReloadOutlined } from '@ant-design/icons';
import { actionGetListExamEventUsers } from '../../../redux/exam_event_user/actions';
import { actionGetListRoles } from '../../../redux/role/actions';
import SimplePagination from '../../../components/Pagination/Pagination';
import { showErrorAlert, showSuccessToast } from '../../../lib/sweetAlertConfig';

const { Option } = Select;

const DEFAULT_PAGINATION = {
    current: 1,
    pageSize: 10,
    total: 0
};

const USER_STATUS = [
    { value: '0', label: 'PENDING', color: 'orange' },
    { value: '1', label: 'APPROVED', color: 'green' },
    { value: '2', label: 'REJECTED', color: 'red' }
];

const ListClassUsers = ({ classId }) => {
    const dispatch = useDispatch();
    const { dataListClassUsers, loading } = useSelector(state => state.classUsers);
    const { dataListRoles } = useSelector(state => state.roles);
    const [form] = Form.useForm();
    const [pagination, setPagination] = useState(DEFAULT_PAGINATION);

    const buildSearchParams = useCallback((formValues = {}, paginationInfo = pagination) => {
        const { user_name, user_email, role_id, status } = formValues;
        return {
            class_id: classId,
            ...(user_name && { user_name }),
            ...(user_email && { user_email }),
            ...(role_id && { role_id }),
            ...(status && { status }),
            page: paginationInfo.current,
            limit: paginationInfo.pageSize
        };
    }, [pagination, classId]);

    const handleSearch = useCallback(async (resetPage = true) => {
        if (!classId) return;

        const formValues = form.getFieldsValue();
        const searchPagination = resetPage
            ? { ...pagination, current: 1 }
            : pagination;

        if (resetPage) {
            setPagination(searchPagination);
        }

        const params = buildSearchParams(formValues, searchPagination);

        try {
            const result = await dispatch(actionGetListExamEventUsers(params));
            const total = result?.total || 0;

            setPagination(prev => ({
                ...prev,
                total,
                ...(resetPage && { current: 1 })
            }));
        } catch (error) {
            console.error('Error fetching class users:', error);
            setPagination(prev => ({ ...prev, total: 0 }));
            await showErrorAlert('Đã xảy ra lỗi khi tải dữ liệu. Vui lòng thử lại.');
        }
    }, [dispatch, form, pagination, buildSearchParams, classId]);

    const handlePageChange = useCallback((page) => {
        const newPagination = { ...pagination, current: page };
        setPagination(newPagination);

        const formValues = form.getFieldsValue();
        const params = buildSearchParams(formValues, newPagination);
        dispatch(actionGetListExamEventUsers(params));
    }, [dispatch, form, pagination, buildSearchParams]);

    const handleReset = useCallback(async () => {
        form.resetFields();
        setPagination(prev => ({ ...prev, current: 1 }));
        const params = { 
            class_id: classId,
            page: 1, 
            limit: pagination.pageSize 
        };

        try {
            await dispatch(actionGetListExamEventUsers(params));
            showSuccessToast('Đã đặt lại bộ lọc');
        } catch (error) {
            console.error('Reset error:', error);
        }
    }, [dispatch, form, pagination.pageSize, classId]);

    const truncateText = (text, maxLength = 100) => {
        if (!text) return '-';
        return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
    };

    const getStatusInfo = (status) => {
        const statusObj = USER_STATUS.find(s => s.value === String(status));
        return statusObj || { label: 'Unknown', color: 'default' };
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
            dataIndex: ['user', 'avatar'],
            key: 'avatar',
            width: 80,
            align: 'center',
            render: (avatar, record) => (
                <div className="flex justify-center">
                    {avatar ? (
                        <Image
                            src={avatar}
                            alt={record.user?.name}
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
            title: 'Tên',
            dataIndex: ['user', 'name'],
            key: 'user_name',
            width: 200,
            render: (name) => (
                <div title={name} className="max-w-48 font-medium">
                    {truncateText(name, 50)}
                </div>
            )
        },
        {
            title: 'Email',
            dataIndex: ['user', 'email'],
            key: 'user_email',
            width: 250,
            render: (email) => (
                <div title={email} className="text-gray-600">
                    {truncateText(email, 35)}
                </div>
            )
        },
        {
            title: 'Số điện thoại',
            dataIndex: ['user', 'mobile'],
            key: 'user_mobile',
            width: 150,
            render: (mobile) => (
                <div className="text-gray-600">
                    {mobile || '-'}
                </div>
            )
        },
        {
            title: 'Vai trò',
            dataIndex: ['user', 'role'],
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
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            width: 110,
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
            title: 'Ngày tham gia',
            dataIndex: 'createdAt',
            key: 'createdAt',
            width: 140,
            render: (createdAt) => {
                return createdAt ? new Date(createdAt).toLocaleDateString('vi-VN') : '-';
            }
        }
    ], [pagination]);

    useEffect(() => {
        dispatch(actionGetListRoles());
        if (classId) {
            handleSearch(false);
        }
    }, [classId]);

    if (!classId) {
        return (
            <Card>
                <div className="text-center text-gray-500 py-8">
                    Vui lòng chọn lớp học để xem danh sách người dùng
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
                            <Col xs={24} sm={12} md={6}>
                                <Form.Item label="Tên người dùng" name="user_name">
                                    <Input
                                        placeholder="Nhập tên người dùng"
                                        allowClear
                                        onPressEnter={() => handleSearch(true)}
                                    />
                                </Form.Item>
                            </Col>
                            <Col xs={24} sm={12} md={6}>
                                <Form.Item label="Email" name="user_email">
                                    <Input
                                        placeholder="Nhập email"
                                        allowClear
                                        onPressEnter={() => handleSearch(true)}
                                    />
                                </Form.Item>
                            </Col>
                            <Col xs={24} sm={12} md={6}>
                                <Form.Item label="Vai trò" name="role_id">
                                    <Select
                                        placeholder="Chọn vai trò"
                                        allowClear
                                        onChange={() => handleSearch(true)}
                                    >
                                        {dataListRoles?.rows?.map(role => (
                                            <Option key={role.id} value={role.id}>
                                                {role.name}
                                            </Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col xs={24} sm={12} md={6}>
                                <Form.Item label="Trạng thái" name="status">
                                    <Select
                                        placeholder="Chọn trạng thái"
                                        allowClear
                                        onChange={() => handleSearch(true)}
                                    >
                                        {USER_STATUS.map(status => (
                                            <Option key={status.value} value={status.value}>
                                                {status.label}
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
                    title="Danh sách người dùng trong lớp"
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
                                dataSource={dataListClassUsers?.rows || []}
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

export default ListClassUsers;