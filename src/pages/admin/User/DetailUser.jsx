import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    Card,
    Form,
    Input,
    Select,
    Button,
    Avatar,
    Row,
    Col,
    Switch,
    Space,
    Spin,
    message,
    Modal,
    Upload as AntUpload
} from 'antd';
import {
    EditOutlined,
    SaveOutlined,
    CloseOutlined,
    UserOutlined,
    UploadOutlined
} from '@ant-design/icons';
import ImgCrop from 'antd-img-crop';
import { actionGetDetailUser, actionUpdateUser } from '../../../redux/user/actions';
import { uploadImageProfile } from '../../../redux/upload/actions';
import { validateName, validateEmail, validateMobile } from '../../../lib/validations';
import { actionGetListRoles } from '../../../redux/role/actions';

const { Option } = Select;
const { TextArea } = Input;

const BASE_IMG = '/icon/upload.png';

const DetailUser = ({ userId }) => {
    const dispatch = useDispatch();
    const { dataDetailUser, loading } = useSelector(state => state.users);
    const { dataListRoles } = useSelector(state => state.roles);
    
    // Get roles array from dataListRoles
    const [form] = Form.useForm();
    const [isEditing, setIsEditing] = useState(false);
    const [initialValues, setInitialValues] = useState({});
    const [previewUrl, setPreviewUrl] = useState(null);
    const [avatarModalVisible, setAvatarModalVisible] = useState(false);
    const [tempAvatarFile, setTempAvatarFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false);

    // Load user detail data
    const loadUserDetail = useCallback(async () => {
        if (!userId) return;

        try {
            await dispatch(actionGetDetailUser(userId));
        } catch (error) {
            message.error('Không thể tải thông tin người dùng');
            console.error('Error loading user detail:', error);
        }
    }, [dispatch, userId]);

    // Load roles list
    const loadRoles = useCallback(async () => {
        try {
            await dispatch(actionGetListRoles());
        } catch (error) {
            console.error('Error loading roles:', error);
        }
    }, [dispatch]);

    // Set form values when data changes
    useEffect(() => {
        if (dataDetailUser) {
            const formValues = {
                name: dataDetailUser.name || '',
                email: dataDetailUser.email || '',
                mobile: dataDetailUser.mobile || '',
                address: dataDetailUser.address || '',
                city: dataDetailUser.city || '',
                role_id: dataDetailUser.role_id || null,
                status: dataDetailUser.status === 1,
                is_lock: dataDetailUser.is_lock === 1
            };

            form.setFieldsValue(formValues);
            setInitialValues(formValues);
        }
    }, [dataDetailUser, form]);

    // Load data on component mount
    useEffect(() => {
        loadUserDetail();
        loadRoles();
    }, [loadUserDetail, loadRoles]);

    // Cleanup preview URL
    useEffect(() => {
        return () => {
            if (previewUrl && previewUrl.startsWith('blob:')) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, [previewUrl]);

    // Handle edit mode toggle
    const handleEdit = useCallback(() => {
        setIsEditing(true);
    }, []);

    // Handle cancel edit
    const handleCancel = useCallback(() => {
        form.setFieldsValue(initialValues);
        setIsEditing(false);
    }, [form, initialValues]);

    // Handle save changes
    const handleSave = useCallback(async () => {
        try {
            const values = await form.validateFields();

            // Convert boolean values back to numbers for API
            const payload = {
                ...values,
                status: values.status ? 1 : 0,
                is_lock: values.is_lock ? 1 : 0
            };

            await dispatch(actionUpdateUser(userId, payload));

            message.success('Cập nhật thông tin thành công');
            setIsEditing(false);

            // Update initial values with new data
            setInitialValues({
                ...values,
                status: payload.status === 1,
                is_lock: payload.is_lock === 1
            });

            // Reload user data to get updated role info
            await loadUserDetail();

        } catch (error) {
            if (error.errorFields) {
                message.error('Vui lòng kiểm tra lại thông tin nhập vào');
            } else {
                message.error('Có lỗi xảy ra khi cập nhật thông tin');
                console.error('Error updating user:', error);
            }
        }
    }, [dispatch, form, userId, loadUserDetail]);

    // Avatar upload functions
    const validateImageFile = (file) => {
        const allowedTypes = ['image/png', 'image/jpeg', 'image/webp', 'image/jpg'];
        const maxSize = 10 * 1024 * 1024;

        if (!allowedTypes.includes(file.type)) {
            message.error(`${file.name} không phải là file ảnh hợp lệ (PNG, JPG, JPEG, WEBP)`);
            return false;
        }

        if (file.size > maxSize) {
            message.error("Kích thước file phải nhỏ hơn 10MB!");
            return false;
        }

        return true;
    };

    const generateAvatarFileName = (email) => {
        const emailPrefix = email.split('@')[0];
        const timestamp = new Date().getTime();
        return `avt-${emailPrefix}-${timestamp}`;
    };

    const handleAvatarUpload = async (file) => {
        if (!validateImageFile(file)) return false;
        setTempAvatarFile(file);
        return false; // Prevent auto upload
    };

    const handleAvatarSave = async () => {
        if (!tempAvatarFile || !dataDetailUser?.email) return;

        setIsUploading(true);
        try {
            const customFileName = generateAvatarFileName(dataDetailUser.email);
            const formData = new FormData();

            const fileExtension = tempAvatarFile.name.split('.').pop();
            const newFile = new File([tempAvatarFile], `${customFileName}.${fileExtension}`, {
                type: tempAvatarFile.type,
                lastModified: tempAvatarFile.lastModified,
            });

            formData.append('file', newFile);
            formData.append('oldAvatar', dataDetailUser.avatar || '');

            const uploadedImagePath = await dispatch(uploadImageProfile(formData));

            if (uploadedImagePath) {
                // Update user with new avatar
                const payload = {
                    ...dataDetailUser,
                    avatar: uploadedImagePath,
                    status: dataDetailUser.status,
                    is_lock: dataDetailUser.is_lock
                };

                await dispatch(actionUpdateUser(userId, payload));

                setAvatarModalVisible(false);
                setTempAvatarFile(null);
                message.success('Cập nhật ảnh đại diện thành công!');

                // Reload user data
                await loadUserDetail();
            } else {
                throw new Error('Upload failed - no image path returned');
            }
        } catch (error) {
            console.error('Upload error:', error);
            message.error('Lỗi khi upload ảnh: ' + (error.message || 'Unknown error'));
        } finally {
            setIsUploading(false);
        }
    };

    const getCurrentAvatar = () => {
        if (previewUrl) return previewUrl;
        if (dataDetailUser?.avatar && dataDetailUser.avatar !== BASE_IMG) {
            if (dataDetailUser.avatar.startsWith('http')) {
                return dataDetailUser.avatar;
            } else {
                return `http://localhost:3000/image_profile/${dataDetailUser.avatar.split('/').pop()}`;
            }
        }
        return BASE_IMG;
    };

    // Format creation date
    const formatDate = (dateString) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Get role name
    const getRoleName = () => {
        return dataDetailUser?.role?.name || 'Chưa xác định';
    };

    // Get role description
    const getRoleDescription = () => {
        return dataDetailUser?.role?.description || '';
    };

    if (loading && !dataDetailUser) {
        return (
            <div className="flex items-center justify-center py-20">
                <Spin size="large" />
            </div>
        );
    }

    if (!dataDetailUser) {
        return (
            <Card className="mx-4 my-6">
                <div className="text-center py-8 text-gray-500">
                    Không tìm thấy thông tin người dùng
                </div>
            </Card>
        );
    }

    return (
        <div className="mx-auto">
            {/* Header Section with Avatar */}
            <div className="bg-white rounded-lg shadow-sm border mb-6 overflow-hidden">
                <div className="p-6">
                    <div className="flex flex-col sm:flex-row items-center gap-6">
                        {/* Avatar */}
                        <div className="relative">
                            <div className="w-24 h-24 bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-500 rounded-lg flex items-center justify-center text-white text-xl font-bold overflow-hidden shadow-lg ring-2 ring-white">
                                {getCurrentAvatar() && getCurrentAvatar() !== BASE_IMG ? (
                                    <img
                                        src={getCurrentAvatar()}
                                        alt="Avatar"
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            e.target.style.display = 'none';
                                            e.target.nextSibling.style.display = 'flex';
                                        }}
                                    />
                                ) : null}
                                <div
                                    className={`w-full h-full flex items-center justify-center ${getCurrentAvatar() !== BASE_IMG ? 'hidden' : ''}`}
                                >
                                    {dataDetailUser.name?.charAt(0)?.toUpperCase() || 'U'}
                                </div>
                            </div>

                            {/* Edit avatar button */}
                            <button
                                onClick={() => setAvatarModalVisible(true)}
                                className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-white shadow-md border-2 border-gray-100 flex items-center justify-center hover:bg-gray-50 transition-all duration-200 transform hover:scale-105"
                            >
                                <EditOutlined className="text-gray-600 text-xs" />
                            </button>
                        </div>

                        {/* User Info */}
                        <div className="text-center sm:text-left flex-1">
                            <h2 className="text-xl font-bold text-gray-900 mb-1">{dataDetailUser.name}</h2>
                            <p className="text-gray-600 mb-2">{dataDetailUser.email}</p>
                            <div className="flex items-center gap-2 justify-center sm:justify-start">
                                <span className="inline-block px-3 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                                    {getRoleName()}
                                </span>
                                {getRoleDescription() && (
                                    <span className="text-xs text-gray-500">
                                        ({getRoleDescription()})
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2">
                            {!isEditing ? (
                                <Button
                                    type="primary"
                                    icon={<EditOutlined />}
                                    onClick={handleEdit}
                                    className="bg-blue-600 hover:bg-blue-700 border-blue-600 hover:border-blue-700"
                                >
                                    Chỉnh sửa
                                </Button>
                            ) : (
                                <Space>
                                    <Button
                                        type="primary"
                                        icon={<SaveOutlined />}
                                        onClick={handleSave}
                                        loading={loading}
                                        className="bg-green-600 hover:bg-green-700 border-green-600 hover:border-green-700"
                                    >
                                        Lưu
                                    </Button>
                                    <Button
                                        icon={<CloseOutlined />}
                                        onClick={handleCancel}
                                        className="border-gray-300 hover:border-gray-400"
                                    >
                                        Hủy
                                    </Button>
                                </Space>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Form Section */}
            <Card className="shadow-sm border">
                <Form
                    form={form}
                    layout="vertical"
                    className="space-y-4"
                >
                    {/* Basic Information */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="space-y-3">
                            <label className="font-medium text-gray-700">Tên người dùng</label>
                            {isEditing ? (
                                <Form.Item
                                    name="name"
                                    rules={[
                                        { validator: validateName }
                                    ]}
                                    className="mb-0"
                                >
                                    <Input
                                        placeholder="Nhập tên người dùng"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                    />
                                </Form.Item>
                            ) : (
                                <div className="bg-gray-50 rounded-md px-4 py-2 text-gray-900 border border-gray-200">
                                    {dataDetailUser.name || 'Chưa cập nhật'}
                                </div>
                            )}
                        </div>

                        <div className="space-y-3">
                            <label className="font-medium text-gray-700">Email</label>
                            {isEditing ? (
                                <Form.Item
                                    name="email"
                                    rules={[
                                        { validator: validateEmail }
                                    ]}
                                    className="mb-0"
                                >
                                    <Input
                                        placeholder="Nhập email"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                    />
                                </Form.Item>
                            ) : (
                                <div className="bg-gray-50 rounded-md px-4 py-2 text-gray-900 border border-gray-200">
                                    {dataDetailUser.email || 'Chưa cập nhật'}
                                </div>
                            )}
                        </div>

                        <div className="space-y-3">
                            <label className="font-medium text-gray-700">Số điện thoại</label>
                            {isEditing ? (
                                <Form.Item
                                    name="mobile"
                                    rules={[
                                        { validator: validateMobile }
                                    ]}
                                    className="mb-0"
                                >
                                    <Input
                                        placeholder="Nhập số điện thoại"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                    />
                                </Form.Item>
                            ) : (
                                <div className="bg-gray-50 rounded-md px-4 py-2 text-gray-900 border border-gray-200">
                                    {dataDetailUser.mobile || 'Chưa cập nhật'}
                                </div>
                            )}
                        </div>

                        <div className="space-y-3">
                            <label className="font-medium text-gray-700">Vai trò</label>
                            {isEditing ? (
                                <Form.Item
                                    name="role_id"
                                    rules={[
                                        { required: true, message: 'Vui lòng chọn vai trò!' }
                                    ]}
                                    className="mb-0"
                                >
                                    <Select
                                        placeholder="Chọn vai trò"
                                        className="w-full"
                                        loading={!dataListRoles?.rows.length}
                                    >
                                        {dataListRoles?.rows.map(role => (
                                            <Option key={role.id} value={role.id}>
                                                {role.name} {role.description && `- ${role.description}`}
                                            </Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            ) : (
                                <div className="bg-gray-50 rounded-md px-4 py-2 text-gray-900 border border-gray-200">
                                    {getRoleName()}
                                </div>
                            )}
                        </div>

                        <div className="space-y-3">
                            <label className="font-medium text-gray-700">Thành phố</label>
                            {isEditing ? (
                                <Form.Item name="city" className="mb-0">
                                    <Input
                                        placeholder="Nhập thành phố"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                    />
                                </Form.Item>
                            ) : (
                                <div className="bg-gray-50 rounded-md px-4 py-2 text-gray-900 border border-gray-200">
                                    {dataDetailUser.city || 'Chưa cập nhật'}
                                </div>
                            )}
                        </div>

                        <div className="space-y-3">
                            <label className="font-medium text-gray-700">Địa chỉ</label>
                            {isEditing ? (
                                <Form.Item name="address" className="mb-0">
                                    <TextArea
                                        placeholder="Nhập địa chỉ"
                                        rows={2}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                    />
                                </Form.Item>
                            ) : (
                                <div className="bg-gray-50 rounded-md px-4 py-2 text-gray-900 border border-gray-200 min-h-[2.5rem]">
                                    {dataDetailUser.address || 'Chưa cập nhật'}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Status Switches */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-4 border-t border-gray-200">
                        <div className="space-y-3">
                            <label className="font-medium text-gray-700">Trạng thái hoạt động</label>
                            {isEditing ? (
                                <Form.Item
                                    name="status"
                                    valuePropName="checked"
                                    className="mb-0"
                                >
                                    <Switch
                                        checkedChildren="Hoạt động"
                                        unCheckedChildren="Không hoạt động"
                                    />
                                </Form.Item>
                            ) : (
                                <div className="bg-gray-50 rounded-md px-4 py-2 text-gray-900 border border-gray-200">
                                    {dataDetailUser.status === 1 ? 'Hoạt động' : 'Không hoạt động'}
                                </div>
                            )}
                        </div>

                        <div className="space-y-3">
                            <label className="font-medium text-gray-700">Trạng thái khóa</label>
                            {isEditing ? (
                                <Form.Item
                                    name="is_lock"
                                    valuePropName="checked"
                                    className="mb-0"
                                >
                                    <Switch
                                        checkedChildren="Đã khóa"
                                        unCheckedChildren="Không khóa"
                                    />
                                </Form.Item>
                            ) : (
                                <div className="bg-gray-50 rounded-md px-4 py-2 text-gray-900 border border-gray-200">
                                    {dataDetailUser.is_lock === 1 ? 'Đã khóa' : 'Không khóa'}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Read-only Information */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-6 border-t border-gray-200">
                        <div className="space-y-2">
                            <div className="text-sm">
                                <span className="font-medium text-gray-700">ID:</span>
                                <span className="ml-2 text-gray-900">{dataDetailUser.id}</span>
                            </div>
                            <div className="text-sm">
                                <span className="font-medium text-gray-700">Ngày tạo:</span>
                                <span className="ml-2 text-gray-900">{formatDate(dataDetailUser.createdAt)}</span>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="text-sm">
                                <span className="font-medium text-gray-700">Lần cập nhật cuối:</span>
                                <span className="ml-2 text-gray-900">{formatDate(dataDetailUser.updatedAt)}</span>
                            </div>
                        </div>
                    </div>
                </Form>
            </Card>

            {/* Avatar Upload Modal */}
            <Modal
                title="Cập nhật ảnh đại diện"
                open={avatarModalVisible}
                onCancel={() => {
                    setAvatarModalVisible(false);
                    setTempAvatarFile(null);
                }}
                footer={[
                    <Button key="cancel" onClick={() => {
                        setAvatarModalVisible(false);
                        setTempAvatarFile(null);
                    }}>
                        Hủy
                    </Button>,
                    <Button
                        key="save"
                        type="primary"
                        loading={isUploading}
                        disabled={!tempAvatarFile}
                        onClick={handleAvatarSave}
                        className="bg-blue-500 border-blue-500 hover:bg-blue-600"
                    >
                        Lưu ảnh
                    </Button>
                ]}
            >
                <div className="py-4">
                    <ImgCrop
                        rotationSlider
                        aspect={1}
                        quality={0.8}
                        modalTitle="Chỉnh sửa ảnh"
                        modalOk="Xác nhận"
                        modalCancel="Hủy"
                    >
                        <AntUpload
                            listType="picture-card"
                            className="avatar-uploader"
                            showUploadList={false}
                            beforeUpload={handleAvatarUpload}
                            accept="image/*"
                        >
                            {tempAvatarFile ? (
                                <div className="flex flex-col items-center">
                                    <img
                                        src={URL.createObjectURL(tempAvatarFile)}
                                        alt="preview"
                                        className="w-20 h-20 object-cover rounded-lg mb-2"
                                    />
                                    <span className="text-sm text-gray-600">Thay đổi</span>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center">
                                    <UploadOutlined className="text-2xl text-gray-400 mb-2" />
                                    <span className="text-sm text-gray-600">Chọn ảnh</span>
                                </div>
                            )}
                        </AntUpload>
                    </ImgCrop>
                    <p className="text-xs text-gray-500 mt-2 text-center">
                        Hỗ trợ định dạng: PNG, JPG, JPEG, WEBP (tối đa 10MB)
                    </p>
                </div>
            </Modal>
        </div>
    );
};

export default DetailUser;