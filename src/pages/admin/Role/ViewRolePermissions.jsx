import React, { useEffect, useState } from 'react';
import { Modal, Card, Switch, Spin, Typography, Divider, Row, Col, Tag, Button, Space, Tooltip } from 'antd';
import { useDispatch } from 'react-redux';
import { EyeOutlined, UserOutlined, CheckOutlined, SettingOutlined } from '@ant-design/icons';
import { 
    showSuccessToast, 
    showErrorAlert, 
    showToggleAllConfirmDialog,
    closeLoading,
    showWarningAlert
} from '../../../lib/sweetAlertConfig';

const { Title, Text } = Typography;

const ViewRolePermissions = ({
    visible,
    roleId,
    onCancel,
    actionGetPermissionTree,
    actionGetPermissionsByRole,
    actionTogglePermissionForRole
}) => {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const [permissionTree, setPermissionTree] = useState([]);
    const [rolePermissions, setRolePermissions] = useState([]);
    const [roleInfo, setRoleInfo] = useState(null);
    const [toggleLoading, setToggleLoading] = useState({});

    useEffect(() => {
        if (visible && roleId) {
            fetchData();
        }
    }, [visible, roleId]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const treeData = await dispatch(actionGetPermissionTree());
            if (treeData) {
                setPermissionTree(treeData);
            }

            const roleData = await dispatch(actionGetPermissionsByRole(roleId));
            if (roleData) {
                setRolePermissions(roleData.permissions || []);
                setRoleInfo({
                    id: roleData.id,
                    name: roleData.name,
                    code: roleData.code,
                    description: roleData.description,
                    createdAt: roleData.createdAt
                });
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            showErrorAlert('Không thể tải dữ liệu quyền');
        } finally {
            setLoading(false);
        }
    };

    const isPermissionAssigned = (permissionId) => {
        return rolePermissions.some(permission => permission.id === permissionId);
    };

    const handleTogglePermission = async (permissionId, currentEnabled) => {
        const newEnabled = !currentEnabled;
        const permissionKey = `${roleId}-${permissionId}`;

        setToggleLoading(prev => ({ ...prev, [permissionKey]: true }));

        try {
            const result = await dispatch(actionTogglePermissionForRole(roleId, permissionId, newEnabled));

            if (result) {
                if (newEnabled) {
                    const newPermission = permissionTree
                        .flatMap(group => group.permissions || [])
                        .find(p => p.id === permissionId);

                    if (newPermission) {
                        setRolePermissions(prev => [...prev, newPermission]);
                    }
                } else {
                    setRolePermissions(prev => prev.filter(p => p.id !== permissionId));
                }

                showSuccessToast(`Đã ${newEnabled ? 'cấp' : 'bỏ cấp'} quyền thành công`);
            }
        } catch (error) {
            console.error('Error toggling permission:', error);
            showErrorAlert(`Không thể ${newEnabled ? 'cấp' : 'bỏ cấp'} quyền`);
        } finally {
            setToggleLoading(prev => ({ ...prev, [permissionKey]: false }));
        }
    };

    const isAllGroupPermissionsSelected = (groupPermissions) => {
        return groupPermissions.every(permission => isPermissionAssigned(permission.id));
    };

    const handleSelectAllGroupPermissions = async (group) => {
        const groupPermissions = group.permissions || [];
        const allSelected = isAllGroupPermissionsSelected(groupPermissions);
        const action = allSelected ? 'bỏ chọn' : 'chọn';
        const newEnabled = !allSelected;

        // Sử dụng hàm từ lib
        const result = await showToggleAllConfirmDialog(action, 'quyền', group.name);

        if (!result.isConfirmed) {
            return;
        }

        // Hiển thị loading
        // showLoading(`Đang ${action} tất cả quyền trong nhóm`);

        try {
            let successCount = 0;
            let errorCount = 0;
            let updatedPermissions = [...rolePermissions];

            for (const permission of groupPermissions) {
                try {
                    const currentEnabled = isPermissionAssigned(permission.id);

                    if (currentEnabled !== newEnabled) {
                        const result = await dispatch(actionTogglePermissionForRole(roleId, permission.id, newEnabled));
                        if (result) {
                            if (newEnabled) {
                                updatedPermissions.push(permission);
                            } else {
                                updatedPermissions = updatedPermissions.filter(p => p.id !== permission.id);
                            }
                            successCount++;
                        }
                    } else {
                        successCount++;
                    }
                } catch (error) {
                    console.error(`Error toggling permission ${permission.id}:`, error);
                    errorCount++;
                }
            }

            setRolePermissions(updatedPermissions);

            // Đóng loading
            closeLoading();

            // Hiển thị kết quả
            if (errorCount === 0) {
                showSuccessToast(`Đã ${action} tất cả quyền trong nhóm ${group.name} thành công`);
            } else {
                showWarningAlert(
                    `Thành công: ${successCount} quyền\nLỗi: ${errorCount} quyền`,
                    'Hoàn thành với lỗi!',
                    { timer: 4000 }
                );
            }

        } catch (error) {
            closeLoading();
            console.error('Error in select all:', error);
            showErrorAlert(`Không thể ${action} tất cả quyền trong nhóm`);
        }
    };

    const handleCancel = () => {
        setPermissionTree([]);
        setRolePermissions([]);
        setRoleInfo(null);
        setToggleLoading({});
        onCancel();
    };

    return (
        <Modal
            open={visible}
            onCancel={handleCancel}
            footer={null}
            width={1000}
            centered
            destroyOnClose
            bodyStyle={{ padding: 0 }}
        >
            <Spin spinning={loading}>
                {/* Header cố định */}
                <div style={{
                    position: 'sticky',
                    top: 0,
                    zIndex: 10,
                    backgroundColor: '#fff',
                    padding: '12px',
                    borderBottom: '1px solid #f0f0f0'
                }}>
                    {/* Thông tin vai trò */}
                    {roleInfo && (
                        <div style={{ marginBottom: 24 }}>
                            <Row align="middle" style={{ marginBottom: 12 }}>
                                <Col flex="none">
                                    <UserOutlined style={{ fontSize: 20, color: '#1890ff', marginRight: 12 }} />
                                </Col>
                                <Col flex="auto">
                                    <Space>
                                        <Title level={4} style={{ margin: 0, color: '#1890ff' }}>
                                            {roleInfo.name}
                                        </Title>
                                        <Tag color="processing">{roleInfo.code}</Tag>
                                    </Space>
                                </Col>
                            </Row>
                        </div>
                    )}

                    {/* Thống kê nhanh */}
                    {roleInfo && (
                        <Row gutter={16}>
                            <Col span={8}>
                                <Card
                                    size="small"
                                    style={{
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        gap: 8,
                                        background: "#f6ffed",
                                        border: "1px solid #b7eb8f",
                                    }}
                                >
                                    <Text strong style={{ color: "#52c41a", fontSize: 16, marginRight: 10 }}>
                                        {rolePermissions.length}
                                    </Text>
                                    <Text type="secondary">Quyền được cấp</Text>
                                </Card>
                            </Col>

                            <Col span={8}>
                                <Card
                                    size="small"
                                    style={{
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        gap: 8,
                                        background: "#fff1f0",
                                        border: "1px solid #ffccc7",
                                    }}
                                >
                                    <Text strong style={{ color: "#ff4d4f", fontSize: 16, marginRight: 10 }}>
                                        {permissionTree.reduce(
                                            (total, group) => total + (group.permissions?.length || 0),
                                            0
                                        ) - rolePermissions.length}
                                    </Text>
                                    <Text type="secondary">Quyền chưa cấp</Text>
                                </Card>
                            </Col>

                            <Col span={8}>
                                <Card
                                    size="small"
                                    style={{
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        gap: 8,
                                        background: "#f0f5ff",
                                        border: "1px solid #adc6ff",
                                    }}
                                >
                                    <Text strong style={{ color: "#1890ff", fontSize: 16, marginRight: 10 }}>
                                        {permissionTree.length}
                                    </Text>
                                    <Text type="secondary">Nhóm quyền</Text>
                                </Card>
                            </Col>
                        </Row>
                    )}

                </div>

                {/* Nội dung có thể scroll */}
                <div style={{ padding: '12px', maxHeight: 'calc(80vh - 200px)', overflowY: 'auto' }}>
                    {permissionTree.length > 0 ? (
                        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                            {permissionTree.map((group) => (
                                <Card
                                    key={group.id}
                                    size="small"
                                    style={{
                                        boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
                                    }}
                                    title={
                                        <Row justify="space-between" align="middle">
                                            <Col>
                                                <Space>
                                                    <SettingOutlined style={{ color: '#1890ff' }} />
                                                    <Text strong style={{ color: '#262626' }}>
                                                        {group.name}
                                                    </Text>
                                                    <Tag color="cyan" size="small">{group.code}</Tag>
                                                </Space>
                                            </Col>
                                            <Col>
                                                {group.permissions && group.permissions.length > 0 && (
                                                    <Tooltip title={
                                                        isAllGroupPermissionsSelected(group.permissions)
                                                            ? 'Bỏ chọn tất cả quyền trong nhóm'
                                                            : 'Chọn tất cả quyền trong nhóm'
                                                    }>
                                                        <Button
                                                            size="small"
                                                            type={isAllGroupPermissionsSelected(group.permissions) ? "default" : "primary"}
                                                            icon={<CheckOutlined />}
                                                            onClick={() => handleSelectAllGroupPermissions(group)}
                                                        >
                                                            {isAllGroupPermissionsSelected(group.permissions) ? 'Bỏ chọn tất cả' : 'Chọn tất cả'}
                                                        </Button>
                                                    </Tooltip>
                                                )}
                                            </Col>
                                        </Row>
                                    }
                                    extra={
                                        group.permissions && (
                                            <Text style={{ fontSize: 12, marginLeft: 10 }}>
                                                {group.permissions.filter(p => isPermissionAssigned(p.id)).length}/{group.permissions.length}
                                            </Text>
                                        )
                                    }
                                >
                                    {group.permissions && group.permissions.length > 0 ? (
                                        <div>
                                            {group.permissions.map((permission, index) => {
                                                const isAssigned = isPermissionAssigned(permission.id);
                                                const permissionKey = `${roleId}-${permission.id}`;
                                                const isToggling = toggleLoading[permissionKey];

                                                return (
                                                    <div key={permission.id}>
                                                        {index > 0 && <div style={{ borderTop: '1px solid #f0f0f0', margin: '8px 0' }} />}
                                                        <div style={{ padding: '8px 0' }}>
                                                            <Row justify="space-between" align="middle">
                                                                <Col flex="auto">
                                                                    <Space direction="vertical" size={2}>
                                                                        <Space>
                                                                            <Text strong style={{ fontSize: 13 }}>
                                                                                {permission.name}
                                                                            </Text>
                                                                            <Tag
                                                                                size="small"
                                                                                color={isAssigned ? 'success' : 'default'}
                                                                                style={{ fontSize: 11 }}
                                                                            >
                                                                                {permission.code}
                                                                            </Tag>
                                                                        </Space>
                                                                    </Space>
                                                                </Col>
                                                                <Col flex="none">
                                                                    <Space align="center">
                                                                        {isToggling && <Spin size="small" />}
                                                                        <Switch
                                                                            checked={isAssigned}
                                                                            size="small"
                                                                            loading={isToggling}
                                                                            onChange={() => handleTogglePermission(permission.id, isAssigned)}
                                                                            style={{
                                                                                backgroundColor: isAssigned ? undefined : '#666666'
                                                                            }}
                                                                        />
                                                                    </Space>
                                                                </Col>
                                                            </Row>
                                                        </div>
                                                        {index === group.permissions.length - 1 && <div style={{ borderTop: '1px solid #f0f0f0', marginTop: '8px' }} />}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    ) : (
                                        <div style={{
                                            textAlign: 'center',
                                            padding: '24px 0',
                                            background: '#fafafa',
                                            borderRadius: 4,
                                            border: '1px dashed #d9d9d9'
                                        }}>
                                            <Text type="secondary">
                                                Nhóm quyền này chưa có quyền nào
                                            </Text>
                                        </div>
                                    )}
                                </Card>
                            ))}
                        </Space>
                    ) : (
                        <div style={{
                            textAlign: 'center',
                            padding: '48px 0',
                            background: '#fafafa',
                            borderRadius: 8,
                            border: '1px dashed #d9d9d9'
                        }}>
                            <SettingOutlined style={{ fontSize: 48, color: '#bfbfbf', marginBottom: 16 }} />
                            <br />
                            <Text type="secondary" style={{ fontSize: 16 }}>
                                Không có dữ liệu quyền
                            </Text>
                        </div>
                    )}
                </div>
            </Spin>
        </Modal>
    );
};

export default ViewRolePermissions;