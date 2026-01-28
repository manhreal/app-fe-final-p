import React, { useEffect, useState } from 'react';
import { Modal, Form, Select, Button, message, Alert, Card, Row, Col, Avatar, Tag, Divider } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { actionCreateClassUser, actionUpdateStatusClassUser, actionGetDetailClassUser } from '../../../redux/class_user/actions';
import { actionGetListUsersToAdd } from '../../../redux/user/actions';
import { CheckOutlined, CloseOutlined, UserOutlined, MailOutlined, PhoneOutlined } from '@ant-design/icons';
import {
    showErrorAlert,
    showSuccessToast
} from '../../../lib/sweetAlertConfig';

const { Option } = Select;

const ROLE_OPTIONS = [
    { value: '3', label: 'Học sinh', description: 'Người học trong lớp', color: 'blue' },
    { value: '7', label: 'Giáo viên', description: 'Người dạy và quản lý lớp', color: 'green' }
];

const STATUS_OPTIONS = [
    { value: '0', label: 'Chờ duyệt', color: 'orange' },
    { value: '1', label: 'Đã duyệt', color: 'green' },
    { value: '2', label: 'Từ chối', color: 'red' }
];

const CreateClassUser = ({
    visible,
    mode = 'create',
    classId,
    editId = null,
    onSuccess,
    onCancel
}) => {
    const dispatch = useDispatch();
    const { dataDetailClassUser, loading: loadingDetail } = useSelector(state => state.classUsers);
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [users, setUsers] = useState([]);
    const [loadingUsers, setLoadingUsers] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    const isEditMode = mode === 'edit';
    const title = isEditMode ? 'Cập nhật trạng thái người dùng' : 'Thêm người dùng vào lớp';

    // Get role info by role_id
    const getRoleInfo = (roleId) => {
        return ROLE_OPTIONS.find(role => role.value === String(roleId));
    };

    // Load detail data for edit mode
    const loadDetailData = async () => {
        if (!editId || !isEditMode) return;
        
        try {
            await dispatch(actionGetDetailClassUser(editId));
        } catch (error) {
            console.error('Error loading detail:', error);
            message.error('Lỗi khi tải thông tin chi tiết');
        }
    };

    // Load users for selection (only for create mode)
    const loadUsers = async () => {
        if (isEditMode) return;
        
        setLoadingUsers(true);
        try {
            const result = await dispatch(actionGetListUsersToAdd({ 
                class_id: classId 
            }));
            setUsers(result?.rows || []);
        } catch (error) {
            console.error('Error loading users:', error);
            message.error('Lỗi khi tải danh sách người dùng');
        } finally {
            setLoadingUsers(false);
        }
    };

    useEffect(() => {
        if (visible) {
            if (isEditMode) {
                loadDetailData();
            } else {
                form.resetFields();
                setSelectedUser(null);
                loadUsers();
            }
        }
    }, [visible, isEditMode, editId]);

    useEffect(() => {
        if (dataDetailClassUser && isEditMode) {
            console.log('Detail data received:', dataDetailClassUser);
        }
    }, [dataDetailClassUser, isEditMode]);

    const handleSubmit = async (values) => {
        setLoading(true);
        try {
            const payload = {
                class_id: classId,
                user_id: parseInt(values.user_id),
                role_id: selectedUser?.role_id || 3 // Lấy role từ user đã chọn
            };

            const result = await dispatch(actionCreateClassUser(payload));

            if (result?.success || result?.status === 200 || result) {
                await showSuccessToast('Thêm người dùng vào lớp thành công');

                form.resetFields();
                setSelectedUser(null);
                onSuccess?.();
            } else {
                await showErrorAlert(result?.message || 'Thêm người dùng vào lớp thất bại');
            }
        } catch (error) {
            console.error('Submit error:', error);
            await showErrorAlert('Đã xảy ra lỗi, vui lòng thử lại');
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        form.resetFields();
        setSelectedUser(null);
        onCancel?.();
    };

    const handleUserSelect = (userId) => {
        const user = users.find(u => u.id === userId);
        setSelectedUser(user);
    };

    const handleQuickStatusUpdate = async (newStatus) => {
        setLoading(true);
        try {
            const result = await dispatch(actionUpdateStatusClassUser(editId, { 
                status: newStatus 
            }));

            if (result?.success || result?.status === 200 || result) {
                const statusText = newStatus === 1 ? 'duyệt' : 'từ chối';
                await showSuccessToast(`Cập nhật trạng thái thành công: ${statusText}`);

                onSuccess?.();
            } else {
                await showErrorAlert(result?.message || 'Cập nhật trạng thái thất bại');
            }
        } catch (error) {
            console.error('Quick update error:', error);
            await showErrorAlert('Đã xảy ra lỗi, vui lòng thử lại');
        } finally {
            setLoading(false);
        }
    };

    const renderEditModeContent = () => {
        if (loadingDetail || !dataDetailClassUser) {
            return (
                <div className="flex justify-center items-center py-12">
                    <div className="text-gray-500">Đang tải thông tin...</div>
                </div>
            );
        }

        const currentStatus = dataDetailClassUser.status;
        const statusInfo = STATUS_OPTIONS.find(s => s.value === String(currentStatus));
        const userRoleInfo = getRoleInfo(dataDetailClassUser.role_id);

        return (
            <div className="space-y-6">
                {/* User Profile Card */}
                <Card className="shadow-sm">
                    <div className="text-center">
                        <Avatar 
                            size={80} 
                            className="mb-4 bg-gradient-to-br from-blue-500 via-green-500 to-purple-500"
                            icon={!dataDetailClassUser.user?.name && <UserOutlined />}
                        >
                            {dataDetailClassUser.user?.name?.charAt(0)?.toUpperCase()}
                        </Avatar>
                        <h3 className="text-xl font-semibold mb-2">
                            {dataDetailClassUser.user?.name}
                        </h3>
                    </div>
                    
                    <Divider />
                    
                    <Row gutter={[16, 12]}>
                        <Col span={24}>
                            <div className="flex items-center text-gray-600">
                                <MailOutlined className="mr-2" />
                                {dataDetailClassUser.user?.email}
                            </div>
                        </Col>
                        {dataDetailClassUser.user?.mobile && (
                            <Col span={24}>
                                <div className="flex items-center text-gray-600">
                                    <PhoneOutlined className="mr-2" />
                                    {dataDetailClassUser.user.mobile}
                                </div>
                            </Col>
                        )}
                    </Row>
                </Card>

                {/* Class & Role Info */}
                <Row gutter={16}>
                    <Col span={12}>
                        <Card title="Lớp học" size="small" className="h-full">
                            <Tag color="blue" className="text-sm">
                                {dataDetailClassUser.class?.name}
                            </Tag>
                        </Card>
                    </Col>
                    <Col span={12}>
                        <Card title="Vai trò" size="small" className="h-full">
                            {userRoleInfo && (
                                <Tag color={userRoleInfo.color || 'blue'} className="text-sm">
                                    {userRoleInfo.label}
                                </Tag>
                            )}
                        </Card>
                    </Col>
                </Row>

                {/* Status Card */}
                <Card title="Trạng thái hiện tại" className="text-center">
                    <div className="mb-4">
                        <Tag 
                            color={statusInfo?.color} 
                            className="px-4 py-2 text-base font-medium rounded-full"
                        >
                            {statusInfo?.label}
                        </Tag>
                    </div>

                    {/* Action Buttons */}
                    {currentStatus === 0 && (
                        <div className="flex justify-center gap-3 mt-4">
                            <Button
                                type="primary"
                                icon={<CheckOutlined />}
                                onClick={() => handleQuickStatusUpdate(1)}
                                loading={loading}
                                className="bg-green-600 hover:bg-green-700 px-6"
                                size="large"
                            >
                                Duyệt
                            </Button>
                            <Button
                                danger
                                icon={<CloseOutlined />}
                                onClick={() => handleQuickStatusUpdate(2)}
                                loading={loading}
                                size="large"
                                className="px-6"
                            >
                                Từ chối
                            </Button>
                        </div>
                    )}

                    {(currentStatus === 1 || currentStatus === 2) && (
                        <Alert
                            message="Không có thao tác nào khả dụng"
                            type="info"
                            showIcon
                            className="mt-4"
                        />
                    )}
                </Card>
            </div>
        );
    };

    const renderCreateModeContent = () => (
        <div className="space-y-6">
            {/* User Selection Card */}
            <Card title="" className="shadow-sm">
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                    preserve={false}
                >
                    <Form.Item
                        name="user_id"
                        rules={[{ required: true, message: 'Vui lòng chọn người dùng!' }]}
                    >
                        <Select
                            placeholder="Tìm kiếm và chọn người dùng..."
                            showSearch
                            size="large"
                            filterOption={(input, option) => {
                                const userData = option?.userData;
                                if (!userData) return false;
                                
                                const searchText = input.toLowerCase();
                                return (
                                    userData.name?.toLowerCase().includes(searchText) ||
                                    userData.email?.toLowerCase().includes(searchText) ||
                                    userData.mobile?.includes(searchText)
                                );
                            }}
                            loading={loadingUsers}
                            onSelect={handleUserSelect}
                            onChange={(value) => {
                                if (!value) {
                                    setSelectedUser(null);
                                }
                            }}
                        >
                            {users.map(user => (
                                <Option 
                                    key={user.id} 
                                    value={user.id}
                                    userData={user}
                                >
                                    <div className="py-2">
                                        <div className="text-gray-800">{user.name} - {user.email} - {user.mobile}</div>
                                    </div>
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>
                </Form>
            </Card>

            {/* Selected User Preview */}
            {selectedUser && (
                <Card title="" className="shadow-sm">
                    <Row gutter={16} align="middle">
                        <Col span={4}>
                            <Avatar 
                                size={64}
                                className="bg-gradient-to-br from-blue-500 via-green-500 to-purple-500"
                                icon={!selectedUser.name && <UserOutlined />}
                            >
                                {selectedUser.name?.charAt(0)?.toUpperCase()}
                            </Avatar>
                        </Col>
                        <Col span={14}>
                            <div>
                                <h4 className="font-semibold text-lg mb-1">{selectedUser.name}</h4>
                                <div className="text-gray-600 mb-1">
                                    <MailOutlined className="mr-1" />
                                    {selectedUser.email}
                                </div>
                                {selectedUser.mobile && (
                                    <div className="text-gray-600">
                                        <PhoneOutlined className="mr-1" />
                                        {selectedUser.mobile}
                                    </div>
                                )}
                            </div>
                        </Col>
                        <Col span={6}>
                            <div className="text-right">
                                <Tag color={getRoleInfo(selectedUser.role_id)?.color || 'blue'}>
                                    {getRoleInfo(selectedUser.role_id)?.label}
                                </Tag>
                            </div>
                        </Col>
                    </Row>
                </Card>
            )}
        </div>
    );

    return (
        <Modal
            title={<div className="text-lg font-semibold">{title}</div>}
            open={visible}
            onCancel={handleCancel}
            footer={isEditMode ? null : [
                <Button key="cancel" onClick={handleCancel} size="large">
                    Hủy
                </Button>,
                <Button
                    key="submit"
                    type="primary"
                    loading={loading}
                    onClick={() => form.submit()}
                    size="large"
                    disabled={!selectedUser}
                >
                    Thêm vào lớp
                </Button>
            ]}
            width={700}
            destroyOnClose
            className="top-8"
        >
            {isEditMode ? renderEditModeContent() : renderCreateModeContent()}
        </Modal>
    );
};

export default CreateClassUser;