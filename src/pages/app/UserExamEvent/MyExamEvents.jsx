import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Table, Input, Button, Card, Space, Row, Col, Form, Tag, Image } from 'antd';
import { 
    SearchOutlined, 
    PlusOutlined, 
    ReloadOutlined, 
    LogoutOutlined,
    FileTextOutlined
} from '@ant-design/icons';
import { actionGetMyExamEvents, actionLeaveExamEvent } from '../../../redux/user_exam_event/actions';
import SimplePagination from '../../../components/Pagination/Pagination';
import JoinExamEventModal from './JoinExamEventModal';
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

const EXAM_EVENT_STATUS = {
    0: { label: 'Không hoạt động', color: 'default' },
    1: { label: 'Đang hoạt động', color: 'green' }
};

const USER_STATUS = {
    0: { label: 'Chờ duyệt', color: 'orange' },
    1: { label: 'Đã duyệt', color: 'green' },
    2: { label: 'Từ chối', color: 'red' }
};

const MyExamEvents = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { dataListMyExamEvents, loading } = useSelector(state => state.examEvents);
    const [form] = Form.useForm();
    const [pagination, setPagination] = useState(DEFAULT_PAGINATION);
    const [joinModalVisible, setJoinModalVisible] = useState(false);

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
            const result = await dispatch(actionGetMyExamEvents(params));
            const total = result?.total || 0;

            setPagination(prev => ({
                ...prev,
                total,
                ...(resetPage && { current: 1 })
            }));
        } catch (error) {
            console.error('Error fetching my exam events:', error);
            setPagination(prev => ({ ...prev, total: 0 }));
            await showErrorAlert('Đã xảy ra lỗi khi tải dữ liệu. Vui lòng thử lại.');
        }
    }, [dispatch, form, pagination, buildSearchParams]);

    const handlePageChange = useCallback((page) => {
        const newPagination = { ...pagination, current: page };
        setPagination(newPagination);

        const formValues = form.getFieldsValue();
        const params = buildSearchParams(formValues, newPagination);
        dispatch(actionGetMyExamEvents(params));
    }, [dispatch, form, pagination, buildSearchParams]);

    const handleReset = useCallback(async () => {
        form.resetFields();
        setPagination(prev => ({ ...prev, current: 1 }));
        const params = { page: 1, limit: pagination.pageSize };

        try {
            await dispatch(actionGetMyExamEvents(params));
            showSuccessToast('Đã đặt lại bộ lọc');
        } catch (error) {
            console.error('Reset error:', error);
        }
    }, [dispatch, form, pagination.pageSize]);

    const handleView = useCallback((record) => {
        console.log('View exam event:', record);
        navigate(`info-exam-event/${record.examEvent?.id}`);
    }, [navigate]);

    const handleLeaveExamEvent = useCallback(async (record) => {
        const result = await showDeleteConfirmDialog(
            record.examEvent?.name, 
            'kỳ thi',
            'Bạn có chắc chắn muốn rời khỏi kỳ thi này?',
            'Rời khỏi'
        );

        if (!result.isConfirmed) return;

        try {
            const deleteResult = await dispatch(actionLeaveExamEvent(record.id));

            if (deleteResult?.success || deleteResult?.status === 200 || deleteResult) {
                await showSuccessToast('Rời khỏi kỳ thi thành công');
                handleSearch(true);
            } else {
                await showErrorAlert(deleteResult?.message || 'Rời khỏi kỳ thi thất bại');
            }
        } catch (error) {
            console.error('Leave exam event error:', error);
            await showErrorAlert('Đã xảy ra lỗi, vui lòng thử lại');
        }
    }, [dispatch, handleSearch]);

    const handleJoinExamEvent = useCallback(() => {
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
            title: 'Ảnh',
            dataIndex: ['examEvent', 'image'],
            key: 'image',
            width: 80,
            align: 'center',
            render: (image, record) => (
                <div className="flex justify-center">
                    {image ? (
                        <Image
                            src={image}
                            alt={record.examEvent?.name}
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
            title: 'Tên kỳ thi',
            dataIndex: ['examEvent', 'name'],
            key: 'exam_event_name',
            width: 200,
            render: (name, record) => (
                <div>
                    <div className="font-medium text-blue-600" title={name}>
                        {truncateText(name, 50)}
                    </div>
                    {record.examEvent?.description && (
                        <div className="text-gray-500 text-sm mt-1" title={record.examEvent.description}>
                            {truncateText(record.examEvent.description, 60)}
                        </div>
                    )}
                </div>
            )
        },
        {
            title: 'Mã kỳ thi',
            dataIndex: ['examEvent', 'code'],
            key: 'code',
            width: 150,
            render: (code) => (
                <code className="bg-gray-100 px-2 py-1 rounded text-xs text-blue-600">
                    {code || '-'}
                </code>
            )
        },
        {
            title: 'Mô tả',
            dataIndex: ['examEvent', 'description'],
            key: 'description',
            width: 250,
            render: (description) => (
                <div title={description} className="text-gray-600">
                    {truncateText(description, 80)}
                </div>
            )
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
                    3: { label: 'Thí sinh', color: 'blue' },
                    7: { label: 'Giám thị', color: 'purple' },
                    1: { label: 'Quản trị', color: 'red' }
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
            width: 120,
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
                    onclickDelete={() => handleLeaveExamEvent(record)}
                    tooltipText={record.examEvent?.name}
                    hideEdit
                />
            )
        }
    ], [pagination, handleView, handleLeaveExamEvent]);

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
                                <Form.Item label="Tên kỳ thi" name="name">
                                    <Input
                                        placeholder="Nhập tên kỳ thi"
                                        allowClear
                                    />
                                </Form.Item>
                            </Col>
                            <Col xs={24} sm={12} md={8}>
                                <Form.Item label="Mã kỳ thi" name="code">
                                    <Input
                                        placeholder="Nhập mã kỳ thi"
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
                                    onClick={handleJoinExamEvent}
                                    className='bg-green-600'
                                >
                                    Tham gia kỳ thi
                                </Button>
                            </Col>
                        </Row>
                    </Form>
                </Card>

                {/* Data Table */}
                <Card
                    title="Kỳ thi của tôi"
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
                                dataSource={dataListMyExamEvents?.rows || []}
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

            {/* Join Exam Event Modal */}
            <JoinExamEventModal
                visible={joinModalVisible}
                onSuccess={handleJoinSuccess}
                onCancel={handleJoinCancel}
            />
        </div>
    );
};

export default MyExamEvents;