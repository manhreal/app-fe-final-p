import React, { useState, useEffect } from 'react';
import { Modal, Input, Button, Card, Descriptions, Tag, Space, Alert } from 'antd';
import { SearchOutlined, UserAddOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { actionGetClassByCode, actionJoinClass, actionClearClassByCode } from '../../../redux/user_class/action';
import { showSuccessToast, showErrorAlert } from '../../../lib/sweetAlertConfig';

const JoinClassModal = ({ visible, onCancel, onSuccess }) => {
    const dispatch = useDispatch();
    const { dataDetailClassByCode, loading } = useSelector(state => state.userClasses);
    
    const [invite_code, setInviteCode] = useState('');
    const [searching, setSearching] = useState(false);
    const [joining, setJoining] = useState(false);

    useEffect(() => {
        if (!visible) {
            // Reset state khi đóng modal
            setInviteCode('');
            setSearching(false);
            setJoining(false);
            dispatch(actionClearClassByCode());
        }
    }, [visible, dispatch]);

    const handleSearch = async () => {
        if (!invite_code.trim()) {
            await showErrorAlert('Vui lòng nhập mã lớp học');
            return;
        }

        setSearching(true);
        try {
            await dispatch(actionGetClassByCode(invite_code.trim()));
        } catch (error) {
            console.error('Search error:', error);
            await showErrorAlert(error?.message || 'Không tìm thấy lớp học với mã này');
        } finally {
            setSearching(false);
        }
    };

    const handleJoinClass = async () => {
        if (!dataDetailClassByCode?.id) {
            await showErrorAlert('Không có thông tin lớp học');
            return;
        }

        setJoining(true);
        try {
            const result = await dispatch(actionJoinClass({
                class_id: dataDetailClassByCode.id,
                role_id: 3 // User role
            }));

            if (result) {
                await showSuccessToast('Gửi yêu cầu tham gia lớp học thành công! Vui lòng đợi giáo viên duyệt.');
                setInviteCode('');
                dispatch(actionClearClassByCode());
                onSuccess && onSuccess();
            }
        } catch (error) {
            console.error('Join error:', error);
            await showErrorAlert(error?.message || 'Gửi yêu cầu tham gia lớp học thất bại');
        } finally {
            setJoining(false);
        }
    };

    const handleCancel = () => {
        setInviteCode('');
        dispatch(actionClearClassByCode());
        onCancel && onCancel();
    };

    const getStatusTag = (status) => {
        const statusMap = {
            0: { color: 'orange', text: 'Không hoạt động' },
            1: { color: 'green', text: 'Đang hoạt động' },
        };
        return statusMap[status] || { color: 'default', text: 'Không xác định' };
    };

    return (
        <Modal
            title={
                <div className="flex items-center gap-2">
                    <UserAddOutlined />
                    <span>Tham gia lớp học</span>
                </div>
            }
            open={visible}
            onCancel={handleCancel}
            footer={null}
            width={600}
            destroyOnClose
        >
            <div className="space-y-4">
                {/* Search Section */}
                <div>
                    <label className="block mb-2 font-medium">Mã lớp học</label>
                    <Space.Compact style={{ width: '100%' }}>
                        <Input
                            placeholder="Nhập mã lớp học (ví dụ: CLASS-XXXXXXXXXXXX)"
                            value={invite_code}
                            onChange={(e) => setInviteCode(e.target.value)}
                            onPressEnter={handleSearch}
                            disabled={searching || joining}
                            size="large"
                        />
                        <Button
                            type="primary"
                            icon={<SearchOutlined />}
                            onClick={handleSearch}
                            loading={searching}
                            disabled={joining}
                            size="large"
                            className="bg-blue-600"
                        >
                            Tìm kiếm
                        </Button>
                    </Space.Compact>
                    <p className="text-gray-500 text-sm mt-2">
                        Nhập mã lớp học do giáo viên cung cấp để tìm kiếm
                    </p>
                </div>

                {/* Class Information Section */}
                {dataDetailClassByCode && (
                    <Card
                        className="mt-4"
                        style={{
                            borderColor: '#1890ff',
                            backgroundColor: '#f0f7ff'
                        }}
                    >
                        <Alert
                            message="Thông tin lớp học"
                            description="Vui lòng kiểm tra thông tin lớp học trước khi gửi yêu cầu tham gia"
                            type="info"
                            showIcon
                            className="mb-4"
                        />

                        <Descriptions column={1} bordered size="small">
                            <Descriptions.Item label="Tên lớp học">
                                <strong>{dataDetailClassByCode.name}</strong>
                            </Descriptions.Item>
                            
                            <Descriptions.Item label="Mã lớp học">
                                <code className="bg-gray-100 px-2 py-1 rounded">
                                    {dataDetailClassByCode.invite_code}
                                </code>
                            </Descriptions.Item>

                            {dataDetailClassByCode.description && (
                                <Descriptions.Item label="Mô tả">
                                    {dataDetailClassByCode.description}
                                </Descriptions.Item>
                            )}

                            <Descriptions.Item label="Giáo viên">
                                <div>
                                    <div className="font-medium">
                                        {dataDetailClassByCode.teacher?.name || 'N/A'}
                                    </div>
                                    {dataDetailClassByCode.teacher?.email && (
                                        <div className="text-gray-500 text-sm">
                                            {dataDetailClassByCode.teacher.email}
                                        </div>
                                    )}
                                </div>
                            </Descriptions.Item>

                            <Descriptions.Item label="Trạng thái">
                                <Tag color={getStatusTag(dataDetailClassByCode.status).color}>
                                    {getStatusTag(dataDetailClassByCode.status).text}
                                </Tag>
                            </Descriptions.Item>
                        </Descriptions>

                        <div className="mt-4 flex justify-end gap-2">
                            <Button
                                icon={<CloseCircleOutlined />}
                                onClick={handleCancel}
                                disabled={joining}
                            >
                                Hủy
                            </Button>
                            <Button
                                type="primary"
                                icon={<UserAddOutlined />}
                                onClick={handleJoinClass}
                                loading={joining}
                                disabled={dataDetailClassByCode.status !== 1}
                                className="bg-green-600"
                            >
                                Gửi yêu cầu tham gia
                            </Button>
                        </div>

                        {dataDetailClassByCode.status !== 1 && (
                            <Alert
                                message="Lớp học này hiện không hoạt động"
                                type="warning"
                                showIcon
                                className="mt-2"
                            />
                        )}
                    </Card>
                )}
            </div>
        </Modal>
    );
};

export default JoinClassModal;