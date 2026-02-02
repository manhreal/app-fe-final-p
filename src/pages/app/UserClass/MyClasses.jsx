import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Table, Input, Button, Card, Space, Row, Col, Form, Tag, Tooltip } from 'antd';
import { 
    SearchOutlined, 
    PlusOutlined, 
    ReloadOutlined, 
    LogoutOutlined,
    BookOutlined,
    UserOutlined 
} from '@ant-design/icons';
import { actionGetMyClasses, actionLeaveClass } from '../../../redux/user_class/action';
import SimplePagination from '../../../components/Pagination/Pagination';
import JoinClassModal from './JoinClassModal';
import {
    showErrorAlert,
    showSuccessToast,
    showDeleteConfirmDialog
} from '../../../lib/sweetAlertConfig';
import ActionEditDelete from '../../../components/ActionEditDelete';
import { useNavigate } from 'react-router-dom';

const DEFAULT_PAGINATION = {
    current: 1,
    pageSize: 10,
    total: 0
};

const CLASS_STATUS = {
    0: { label: 'Không hoạt động', color: 'default' },
    1: { label: 'Đang hoạt động', color: 'green' }
};

const USER_STATUS = {
    0: { label: 'Chờ duyệt', color: 'orange' },
    1: { label: 'Đã duyệt', color: 'green' },
    2: { label: 'Từ chối', color: 'red' }
};

const MyClasses = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { dataListUserClasses, loading } = useSelector(state => state.userClasses);
    const [form] = Form.useForm();
    const [pagination, setPagination] = useState(DEFAULT_PAGINATION);
    const [joinModalVisible, setJoinModalVisible] = useState(false);

    const buildSearchParams = useCallback((formValues = {}, paginationInfo = pagination) => {
        const { name, invite_code, status } = formValues;
        return {
            ...(name && { name }),
            ...(invite_code && { invite_code }),
            ...(status !== undefined && { status }),
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
            const result = await dispatch(actionGetMyClasses(params));
            const total = result?.total || 0;

            setPagination(prev => ({
                ...prev,
                total,
                ...(resetPage && { current: 1 })
            }));
        } catch (error) {
            console.error('Error fetching my classes:', error);
            setPagination(prev => ({ ...prev, total: 0 }));
            await showErrorAlert('Đã xảy ra lỗi khi tải dữ liệu. Vui lòng thử lại.');
        }
    }, [dispatch, form, pagination, buildSearchParams]);

    const handlePageChange = useCallback((page) => {
        const newPagination = { ...pagination, current: page };
        setPagination(newPagination);

        const formValues = form.getFieldsValue();
        const params = buildSearchParams(formValues, newPagination);
        dispatch(actionGetMyClasses(params));
    }, [dispatch, form, pagination, buildSearchParams]);

    const handleReset = useCallback(async () => {
        form.resetFields();
        setPagination(prev => ({ ...prev, current: 1 }));
        const params = { page: 1, limit: pagination.pageSize };

        try {
            await dispatch(actionGetMyClasses(params));
            showSuccessToast('Đã đặt lại bộ lọc');
        } catch (error) {
            console.error('Reset error:', error);
        }
    }, [dispatch, form, pagination.pageSize]);

    const handleView = useCallback((record) => {
        console.log('View class:', record);
        navigate(`info-class/${record.class?.id}`);
    }, [navigate]);

    const handleLeaveClass = useCallback(async (record) => {
        const result = await showDeleteConfirmDialog(
            record.class?.name, 
            'lớp học',
            'Bạn có chắc chắn muốn rời khỏi lớp học này?',
            'Rời khỏi'
        );

        if (!result.isConfirmed) return;

        try {
            const deleteResult = await dispatch(actionLeaveClass(record.id));

            if (deleteResult?.success || deleteResult?.status === 200 || deleteResult) {
                await showSuccessToast('Rời khỏi lớp học thành công');
                handleSearch(true);
            } else {
                await showErrorAlert(deleteResult?.message || 'Rời khỏi lớp học thất bại');
            }
        } catch (error) {
            console.error('Leave class error:', error);
            await showErrorAlert('Đã xảy ra lỗi, vui lòng thử lại');
        }
    }, [dispatch, handleSearch]);

    const handleJoinClass = useCallback(() => {
        setJoinModalVisible(true);
    }, []);

    const handleJoinSuccess = useCallback(() => {
        setJoinModalVisible(false);
        handleSearch(true);
    }, [handleSearch]);

    const handleJoinCancel = useCallback(() => {
        setJoinModalVisible(false);
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
            title: 'Tên lớp học',
            dataIndex: ['class', 'name'],
            key: 'class_name',
            width: 250,
            render: (name, record) => (
                <div>
                    <div className="font-medium text-blue-600 flex items-center gap-2">
                        <BookOutlined />
                        <span title={name}>{truncateText(name, 40)}</span>
                    </div>
                    {record.class?.description && (
                        <div className="text-gray-500 text-sm mt-1" title={record.class.description}>
                            {truncateText(record.class.description, 60)}
                        </div>
                    )}
                </div>
            )
        },
        {
            title: 'Mã lớp học',
            dataIndex: ['class', 'invite_code'],
            key: 'invite_code',
            width: 180,
            render: (code) => (
                <code className="bg-gray-100 px-2 py-1 rounded text-xs">
                    {code || '-'}
                </code>
            )
        },
        {
            title: 'Giáo viên',
            dataIndex: ['class', 'teacher'],
            key: 'teacher',
            width: 200,
            render: (teacher) => (
                <div>
                    <div className="font-medium flex items-center gap-2">
                        <UserOutlined />
                        {teacher?.name || '-'}
                    </div>
                    {teacher?.email && (
                        <div className="text-gray-500 text-sm">
                            {teacher.email}
                        </div>
                    )}
                </div>
            )
        },
        {
            title: 'Trạng thái lớp',
            dataIndex: ['class', 'status'],
            key: 'class_status',
            width: 140,
            align: 'center',
            render: (status) => {
                const statusInfo = CLASS_STATUS[status] || CLASS_STATUS[0];
                return (
                    <Tag color={statusInfo.color}>
                        {statusInfo.label}
                    </Tag>
                );
            }
        },
        {
            title: 'Trạng thái tham gia',
            dataIndex: 'status',
            key: 'user_status',
            width: 150,
            align: 'center',
            render: (status) => {
                const statusInfo = USER_STATUS[status] || USER_STATUS[0];
                return (
                    <Tag color={statusInfo.color}>
                        {statusInfo.label}
                    </Tag>
                );
            }
        },
        {
            title: 'Vai trò',
            dataIndex: 'role_id',
            key: 'role_id',
            width: 120,
            align: 'center',
            render: (roleId) => {
                const roleMap = {
                    3: { label: 'Học sinh', color: 'blue' },
                    7: { label: 'Giáo viên', color: 'purple' }
                };
                const role = roleMap[roleId] || { label: 'Khác', color: 'default' };
                return (
                    <Tag color={role.color}>
                        {role.label}
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
        },
        {
            title: 'Thao tác',
            key: 'actions',
            align: 'center',
            width: 100,
            fixed: 'right',
            render: (_, record) => (
                <ActionEditDelete
                                    onclickView={() => handleView(record)}
                                    onclickDelete={() => handleLeaveClass(record)}
                                    tooltipText={record.name}
                                    hideEdit
                                />
            )
        }
    ], [pagination, handleLeaveClass]);

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
                                <Form.Item label="Tên lớp học" name="name">
                                    <Input
                                        placeholder="Nhập tên lớp học"
                                        allowClear
                                    />
                                </Form.Item>
                            </Col>
                            <Col xs={24} sm={12} md={8}>
                                <Form.Item label="Mã lớp học" name="invite_code">
                                    <Input
                                        placeholder="Nhập mã lớp học"
                                        allowClear
                                    />
                                </Form.Item>
                            </Col>
                            <Col xs={24} sm={12} md={8}>
                                <Form.Item label="Trạng thái tham gia" name="status">
                                    <Input
                                        placeholder="Trạng thái (0: Chờ, 1: Duyệt, 2: Từ chối)"
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
                                    onClick={handleJoinClass}
                                    className='bg-green-600'
                                >
                                    Tham gia lớp học
                                </Button>
                            </Col>
                        </Row>
                    </Form>
                </Card>

                {/* Data Table */}
                <Card
                    title="Lớp học của tôi"
                    extra={
                        <span style={{ color: '#666' }}>
                            Tổng số: {pagination.total} lớp học
                        </span>
                    }
                    className="w-full"
                >
                    <div className="w-full overflow-x-auto -mx-3 sm:mx-0 max-w-full">
                        <div className="px-3 sm:px-0">
                            <Table
                                columns={columns}
                                dataSource={dataListUserClasses?.rows || []}
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

            {/* Join Class Modal */}
            <JoinClassModal
                visible={joinModalVisible}
                onSuccess={handleJoinSuccess}
                onCancel={handleJoinCancel}
            />
        </div>
    );
};

export default MyClasses;