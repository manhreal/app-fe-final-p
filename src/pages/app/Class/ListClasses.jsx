import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Card, Input, Button, Row, Col, Form, Tag, Empty, Spin, Modal, Avatar } from 'antd';
import { 
    SearchOutlined, 
    ReloadOutlined,
    UserOutlined,
    TeamOutlined,
    BookOutlined,
    MailOutlined,
    PhoneOutlined
} from '@ant-design/icons';
import { actionGetListClasses } from '../../../redux/class/actions';
import SimplePagination from '../../../components/Pagination/Pagination';
import {
    showSuccessToast
} from '../../../lib/sweetAlertConfig';

const DEFAULT_PAGINATION = {
    current: 1,
    pageSize: 9,
    total: 0
};

const CLASS_STATUS = [
    { value: '1', label: 'ACTIVE', color: 'green', text: 'Đang hoạt động' },
    { value: '0', label: 'INACTIVE', color: 'red', text: 'Ngừng hoạt động' },
    { value: '2', label: 'DRAFT', color: 'orange', text: 'Nháp' }
];

const ListClasses = () => {
    const dispatch = useDispatch();
    const { dataListClasses, loading } = useSelector(state => state.classes);
    const [form] = Form.useForm();
    const [pagination, setPagination] = useState(DEFAULT_PAGINATION);

    const buildSearchParams = useCallback((formValues = {}, paginationInfo = pagination) => {
        const { name, invite_code, teacher_name, description } = formValues;
        return {
            ...(name && { name }),
            ...(invite_code && { invite_code }),
            ...(teacher_name && { teacher_name }),
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
            const result = await dispatch(actionGetListClasses(params));
            const total = result?.total || 0;

            setPagination(prev => ({
                ...prev,
                total,
                ...(resetPage && { current: 1 })
            }));
        } catch (error) {
            console.error('Error fetching classes:', error);
            setPagination(prev => ({ ...prev, total: 0 }));
        }
    }, [dispatch, form, pagination, buildSearchParams]);

    const handlePageChange = useCallback((page) => {
        const newPagination = { ...pagination, current: page };
        setPagination(newPagination);

        const formValues = form.getFieldsValue();
        const params = buildSearchParams(formValues, newPagination);
        dispatch(actionGetListClasses(params));
    }, [dispatch, form, pagination, buildSearchParams]);

    const handleReset = useCallback(async () => {
        form.resetFields();
        setPagination(prev => ({ ...prev, current: 1 }));
        const params = { page: 1, limit: pagination.pageSize };

        try {
            await dispatch(actionGetListClasses(params));
            showSuccessToast('Đã đặt lại bộ lọc');
        } catch (error) {
            console.error('Reset error:', error);
        }
    }, [dispatch, form, pagination.pageSize]);

    const handleJoinClass = useCallback((classData) => {
        Modal.info({
            title: 'Thông báo',
            content: (
                <div>
                    <p className="text-base mb-2">
                        Bạn đang chuẩn bị tham gia lớp học: <strong>{classData.name}</strong>
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

    const getStatusInfo = (status) => {
        const statusObj = CLASS_STATUS.find(s => s.value === String(status));
        return statusObj || { label: 'Unknown', color: 'default', text: 'Không xác định' };
    };

    const ClassCard = ({ classData }) => {
        const status = getStatusInfo(classData.status);
        const isActive = status.value === '1';

        return (
            <Card
                hoverable
                className="h-full flex flex-col shadow-md hover:shadow-xl transition-all duration-300 border-t-4"
                style={{ 
                    borderTopColor: isActive ? '#52c41a' : status.color === 'red' ? '#ff4d4f' : '#faad14',
                }}
                cover={
                    <div 
                        className="h-48 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center relative overflow-hidden"
                    >
                        {classData.image ? (
                            <img 
                                src={classData.image} 
                                alt={classData.name}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="text-white text-center px-4">
                                <BookOutlined className="text-6xl mb-2 opacity-80" />
                                <h3 className="text-xl font-bold line-clamp-2">{classData.name}</h3>
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
                    <h3 className="text-lg font-bold mb-3 line-clamp-2 min-h-[56px]" title={classData.name}>
                        {classData.name}
                    </h3>

                    {/* Invite Code */}
                    <div className="mb-3">
                        <Tag color="cyan" className="text-xs">
                            {classData.invite_code}
                        </Tag>
                    </div>

                    {/* Description */}
                    {classData.description && (
                        <p className="text-gray-600 text-sm mb-4 line-clamp-2 min-h-[40px]" title={classData.description}>
                            {classData.description}
                        </p>
                    )}

                    {/* Teacher Info */}
                    <div className="space-y-3 mb-4 flex-grow">
                        {classData.teacher ? (
                            <div className="bg-gray-50 rounded-lg p-3">
                                <div className="flex items-center gap-2 mb-2">
                                    <UserOutlined className="text-blue-500" />
                                    <span className="font-medium text-gray-700">Giáo viên:</span>
                                </div>
                                <div className="space-y-1 ml-6">
                                    <div className="flex items-center text-sm text-gray-800 font-medium">
                                        <TeamOutlined className="mr-2 text-purple-500" />
                                        <span className="line-clamp-1">{classData.teacher.name}</span>
                                    </div>
                                    <div className="flex items-center text-sm text-gray-600">
                                        <MailOutlined className="mr-2 text-green-500" />
                                        <span className="line-clamp-1">{classData.teacher.email}</span>
                                    </div>
                                    {classData.teacher.mobile && (
                                        <div className="flex items-center text-sm text-gray-600">
                                            <PhoneOutlined className="mr-2 text-orange-500" />
                                            <span>{classData.teacher.mobile}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="bg-gray-50 rounded-lg p-3 text-center">
                                <UserOutlined className="text-gray-400 text-2xl mb-2" />
                                <p className="text-gray-500 text-sm">Chưa có giáo viên</p>
                            </div>
                        )}
                    </div>

                    {/* Action Button */}
                    <Button
                        type="primary"
                        size="large"
                        block
                        className={isActive ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-500'}
                        onClick={() => handleJoinClass(classData)}
                        disabled={!isActive}
                    >
                        {isActive ? 'Tham gia lớp học' : status.text}
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
                                <Form.Item label="Tên lớp học" name="name">
                                    <Input
                                        placeholder="Nhập tên lớp học"
                                        allowClear
                                    />
                                </Form.Item>
                            </Col>
                            <Col xs={24} sm={12} md={6}>
                                <Form.Item label="Mã mời" name="invite_code">
                                    <Input
                                        placeholder="Nhập mã mời"
                                        allowClear
                                    />
                                </Form.Item>
                            </Col>
                            <Col xs={24} sm={12} md={6}>
                                <Form.Item label="Tên giáo viên" name="teacher_name">
                                    <Input
                                        placeholder="Nhập tên giáo viên"
                                        allowClear
                                    />
                                </Form.Item>
                            </Col>
                            <Col xs={24} sm={12} md={6}>
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

                {/* Data Cards */}
                <Card
                    title="Danh sách lớp học"
                    extra={
                        <span style={{ color: '#666' }}>
                            Tổng số: {pagination.total} lớp học
                        </span>
                    }
                    className="w-full"
                >
                    <Spin spinning={loading} size="large">
                        {dataListClasses?.rows && dataListClasses.rows.length > 0 ? (
                            <div className="w-full">
                                <Row gutter={[24, 24]}>
                                    {dataListClasses.rows.map(classData => (
                                        <Col xs={24} sm={12} lg={8} key={classData.id}>
                                            <ClassCard classData={classData} />
                                        </Col>
                                    ))}
                                </Row>
                            </div>
                        ) : (
                            <Empty
                                description="Không tìm thấy lớp học nào"
                                className="my-12"
                            />
                        )}
                    </Spin>

                    {/* Pagination */}
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

export default ListClasses;