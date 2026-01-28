import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    Card,
    Form,
    Input,
    Select,
    Button,
    Space,
    Spin,
    message
} from 'antd';
import {
    EditOutlined,
    SaveOutlined,
    CloseOutlined
} from '@ant-design/icons';
import { actionGetDetailClass, actionUpdateClass } from '../../../redux/class/actions';
import { uploadImageClass } from '../../../redux/upload/actions';
import { actionGetListUsers } from '../../../redux/user/actions';
import UploadImage from '../../../components/Upload/UploadImage';
import { 
    formatDate, 
    getStatusLabel, 
    CLASS_STATUS, 
    generateImageFileName 
} from '../../../lib/common';

const { Option } = Select;
const { TextArea } = Input;

const BASE_IMG = '/icon/upload.png';

const DetailClass = ({ classId }) => {
    const dispatch = useDispatch();
    const { dataDetailClass, loading } = useSelector(state => state.classes);
    const [form] = Form.useForm();
    const [isEditing, setIsEditing] = useState(false);
    const [initialValues, setInitialValues] = useState({});
    const [previewUrl, setPreviewUrl] = useState(null);
    const [avatarModalVisible, setAvatarModalVisible] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    
    const [teachers, setTeachers] = useState([]);
    const [teachersLoading, setTeachersLoading] = useState(false);

    const loadTeachers = useCallback(async () => {
        setTeachersLoading(true);
        try {
            const result = await dispatch(actionGetListUsers({
                page: 1,
                limit: 1000,
                role_id: 7 
            }));
            if (result?.rows) {
                setTeachers(result.rows);
            }
        } catch (error) {
            console.error('Error loading teachers:', error);
            message.error('Lỗi khi tải danh sách giáo viên');
        } finally {
            setTeachersLoading(false);
        }
    }, [dispatch]);

    // Load class detail data
    const loadClassDetail = useCallback(async () => {
        if (!classId) return;

        try {
            await dispatch(actionGetDetailClass(classId));
        } catch (error) {
            message.error('Không thể tải thông tin lớp học');
            console.error('Error loading class detail:', error);
        }
    }, [dispatch, classId]);

    useEffect(() => {
        if (dataDetailClass) {
            const formValues = {
                name: dataDetailClass.name || '',
                description: dataDetailClass.description || '',
                teacher_id: dataDetailClass.teacher_id || null,
                status: dataDetailClass.status || 2,
                invite_code: dataDetailClass.invite_code || ''
            };

            form.setFieldsValue(formValues);
            setInitialValues(formValues);
        }
    }, [dataDetailClass, form]);

    useEffect(() => {
        loadClassDetail();
        loadTeachers();
    }, [loadClassDetail, loadTeachers]);

    useEffect(() => {
        return () => {
            if (previewUrl && previewUrl.startsWith('blob:')) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, [previewUrl]);

    const handleEdit = useCallback(() => {
        setIsEditing(true);
    }, []);

    const handleCancel = useCallback(() => {
        form.setFieldsValue(initialValues);
        setIsEditing(false);
    }, [form, initialValues]);

    const handleSave = useCallback(async () => {
        try {
            const values = await form.validateFields();

            const payload = {
                ...values
            };

            await dispatch(actionUpdateClass(classId, payload));

            message.success('Cập nhật thông tin lớp học thành công');
            setIsEditing(false);

            setInitialValues(values);
            
            // Reload class detail to get updated teacher info
            await loadClassDetail();

        } catch (error) {
            if (error.errorFields) {
                message.error('Vui lòng kiểm tra lại thông tin nhập vào');
            } else {
                message.error('Có lỗi xảy ra khi cập nhật thông tin lớp học');
                console.error('Error updating class:', error);
            }
        }
    }, [dispatch, form, classId, loadClassDetail]);

    const handleImageSave = async (file) => {
        if (!dataDetailClass?.name) return;

        setIsUploading(true);
        try {
            const customFileName = generateImageFileName('class', dataDetailClass.name);
            const formData = new FormData();

            const fileExtension = file.name.split('.').pop();
            const newFile = new File([file], `${customFileName}.${fileExtension}`, {
                type: file.type,
                lastModified: file.lastModified,
            });

            formData.append('file', newFile);
            formData.append('type', 'class');
            formData.append('oldImage', dataDetailClass.image || '');

            const uploadedImagePath = await dispatch(uploadImageClass(formData));

            if (uploadedImagePath) {
                const payload = {
                    ...dataDetailClass,
                    image: uploadedImagePath
                };

                await dispatch(actionUpdateClass(classId, payload));

                message.success('Cập nhật hình ảnh lớp học thành công!');

                // Reload class data
                await loadClassDetail();
            } else {
                throw new Error('Upload failed - no image path returned');
            }
        } catch (error) {
            console.error('Upload error:', error);
            message.error('Lỗi khi upload ảnh: ' + (error.message || 'Unknown error'));
            throw error; // Re-throw to be handled by UploadImage component
        } finally {
            setIsUploading(false);
        }
    };

    const getCurrentImage = () => {
        if (previewUrl) return previewUrl;
        if (dataDetailClass?.image && dataDetailClass.image !== BASE_IMG) {
            if (dataDetailClass.image.startsWith('http')) {
                return dataDetailClass.image;
            } else {
                return `http://localhost:3000/image_class/${dataDetailClass.image.split('/').pop()}`;
            }
        }
        return BASE_IMG;
    };

    const getTeacherName = () => {
        if (dataDetailClass?.teacher) {
            return `${dataDetailClass.teacher.name} (${dataDetailClass.teacher.email})`;
        }
        return 'Chưa có giáo viên';
    };

    if (loading && !dataDetailClass) {
        return (
            <div className="flex items-center justify-center py-20">
                <Spin size="large" />
            </div>
        );
    }

    if (!dataDetailClass) {
        return (
            <Card className="mx-4 my-6">
                <div className="text-center py-8 text-gray-500">
                    Không tìm thấy thông tin lớp học
                </div>
            </Card>
        );
    }

    return (
        <div className="mx-auto">
            {/* Header Section with Image */}
            <div className="bg-white rounded-lg shadow-sm border mb-6 overflow-hidden">
                <div className="p-6">
                    <div className="flex flex-col sm:flex-row items-center gap-6">
                        {/* Class Image */}
                        <div className="relative">
                            <div className="w-24 h-24 bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-500 rounded-lg flex items-center justify-center text-white text-xl font-bold overflow-hidden shadow-lg ring-2 ring-white">
                                {getCurrentImage() && getCurrentImage() !== BASE_IMG ? (
                                    <img
                                        src={getCurrentImage()}
                                        alt="Class Image"
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            e.target.style.display = 'none';
                                            e.target.nextSibling.style.display = 'flex';
                                        }}
                                    />
                                ) : null}
                                <div
                                    className={`w-full h-full flex items-center justify-center ${getCurrentImage() !== BASE_IMG ? 'hidden' : ''}`}
                                >
                                    {dataDetailClass.name?.charAt(0)?.toUpperCase() || 'C'}
                                </div>
                            </div>

                            {/* Edit image button */}
                            <button
                                onClick={() => setAvatarModalVisible(true)}
                                className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-white shadow-md border-2 border-gray-100 flex items-center justify-center hover:bg-gray-50 transition-all duration-200 transform hover:scale-105"
                            >
                                <EditOutlined className="text-gray-600 text-xs" />
                            </button>
                        </div>

                        {/* Class Info */}
                        <div className="text-center sm:text-left flex-1">
                            <h2 className="text-xl font-bold text-gray-900 mb-1">{dataDetailClass.name}</h2>
                            <p className="text-gray-600 mb-2">{getTeacherName()}</p>
                            <span className="inline-block px-3 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full mr-2">
                                {getStatusLabel(dataDetailClass.status, CLASS_STATUS)}
                            </span>
                            <span className="inline-block px-3 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                                {dataDetailClass.invite_code}
                            </span>
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
                            <label className="font-medium text-gray-700">Tên lớp học</label>
                            {isEditing ? (
                                <Form.Item
                                    name="name"
                                    rules={[
                                        { required: true, message: 'Vui lòng nhập tên lớp học!' },
                                        { max: 200, message: 'Tên lớp học không được vượt quá 200 ký tự' }
                                    ]}
                                    className="mb-0"
                                >
                                    <Input
                                        placeholder="Nhập tên lớp học"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                        showCount
                                        maxLength={200}
                                    />
                                </Form.Item>
                            ) : (
                                <div className="bg-gray-50 rounded-md px-4 py-2 text-gray-900 border border-gray-200">
                                    {dataDetailClass.name || 'Chưa cập nhật'}
                                </div>
                            )}
                        </div>

                        <div className="space-y-3">
                            <label className="font-medium text-gray-700">Mã lời mời</label>
                            <div className="bg-gray-50 rounded-md px-4 py-2 text-gray-900 border border-gray-200">
                                {dataDetailClass.invite_code || 'Chưa có mã'}
                            </div>
                        </div>

                        <div className="space-y-3 lg:col-span-2">
                            <label className="font-medium text-gray-700">Mô tả</label>
                            {isEditing ? (
                                <Form.Item
                                    name="description"
                                    rules={[
                                        { required: true, message: 'Vui lòng nhập mô tả!' },
                                        { max: 500, message: 'Mô tả không được vượt quá 500 ký tự' }
                                    ]}
                                    className="mb-0"
                                >
                                    <TextArea
                                        placeholder="Nhập mô tả lớp học"
                                        rows={4}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                        showCount
                                        maxLength={500}
                                    />
                                </Form.Item>
                            ) : (
                                <div className="bg-gray-50 rounded-md px-4 py-2 text-gray-900 border border-gray-200 min-h-[2.5rem]">
                                    {dataDetailClass.description || 'Chưa cập nhật'}
                                </div>
                            )}
                        </div>

                        <div className="space-y-3">
                            <label className="font-medium text-gray-700">Giáo viên phụ trách</label>
                            {isEditing ? (
                                <Form.Item
                                    name="teacher_id"
                                    rules={[
                                        { required: true, message: 'Vui lòng chọn giáo viên phụ trách!' }
                                    ]}
                                    className="mb-0"
                                >
                                    <Select
                                        placeholder="Chọn giáo viên phụ trách"
                                        className="w-full"
                                        loading={teachersLoading}
                                        showSearch
                                        filterOption={(input, option) =>
                                            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                        }
                                    >
                                        {teachers.map(teacher => (
                                            <Option key={teacher.id} value={teacher.id}>
                                                {teacher.name} ({teacher.email})
                                            </Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            ) : (
                                <div className="bg-gray-50 rounded-md px-4 py-2 text-gray-900 border border-gray-200">
                                    {getTeacherName()}
                                </div>
                            )}
                        </div>

                        <div className="space-y-3">
                            <label className="font-medium text-gray-700">Trạng thái</label>
                            {isEditing ? (
                                <Form.Item
                                    name="status"
                                    rules={[
                                        { required: true, message: 'Vui lòng chọn trạng thái!' }
                                    ]}
                                    className="mb-0"
                                >
                                    <Select
                                        placeholder="Chọn trạng thái"
                                        className="w-full"
                                    >
                                        {CLASS_STATUS.map(status => (
                                            <Option key={status.value} value={status.value}>
                                                {status.label}
                                            </Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            ) : (
                                <div className="bg-gray-50 rounded-md px-4 py-2 text-gray-900 border border-gray-200">
                                    {getStatusLabel(dataDetailClass.status, CLASS_STATUS)}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Read-only Information */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-6 border-t border-gray-200">
                        <div className="space-y-2">
                            <div className="text-sm">
                                <span className="font-medium text-gray-700">ID:</span>
                                <span className="ml-2 text-gray-900">{dataDetailClass.id}</span>
                            </div>
                            <div className="text-sm">
                                <span className="font-medium text-gray-700">Ngày tạo:</span>
                                <span className="ml-2 text-gray-900">{formatDate(dataDetailClass.createdAt)}</span>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="text-sm">
                                <span className="font-medium text-gray-700">Lần cập nhật cuối:</span>
                                <span className="ml-2 text-gray-900">{formatDate(dataDetailClass.updatedAt)}</span>
                            </div>
                        </div>
                    </div>
                </Form>
            </Card>

            {/* Upload Image Modal */}
            <UploadImage
                visible={avatarModalVisible}
                onCancel={() => setAvatarModalVisible(false)}
                onSave={handleImageSave}
                loading={isUploading}
                title="Cập nhật hình ảnh lớp học"
            />
        </div>
    );
};

export default DetailClass;