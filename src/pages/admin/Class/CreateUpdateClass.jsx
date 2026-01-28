import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import {
    Modal,
    Form,
    Input,
    Select,
    Button,
    Upload,
    Image,
    message
} from 'antd';
import {
    UploadOutlined,
    DeleteOutlined,
    FileTextOutlined
} from '@ant-design/icons';
import { actionGetDetailClass, actionUpdateClass, actionCreateClass } from '../../../redux/class/actions';
import { uploadImageClass } from '../../../redux/upload/actions';
import { actionGetListUsers } from '../../../redux/user/actions';
import {
    showErrorAlert,
    showSuccessToast
} from '../../../lib/sweetAlertConfig';

const { Option } = Select;
const { TextArea } = Input;

const CLASS_STATUS = [
    { value: '1', label: 'ACTIVE' },
    { value: '0', label: 'INACTIVE' },
    { value: '2', label: 'DRAFT' }
];

const CreateUpdateClass = ({
    visible,
    onCancel,
    onSuccess,
    editId = null,
    mode = 'create' // 'create' or 'edit'
}) => {
    const dispatch = useDispatch();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [detailLoading, setDetailLoading] = useState(false);
    const [teachers, setTeachers] = useState([]);
    const [teachersLoading, setTeachersLoading] = useState(false);
    
    const [imageUrl, setImageUrl] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [detailImageUrl, setDetailImageUrl] = useState('');

    const isEditMode = mode === 'edit' && editId;

    const handleImageChange = useCallback(async (info) => {
        if (info.file.status === 'uploading') {
            setUploading(true);
            return;
        }

        if (info.file.status === 'done') {
            setUploading(false);
            const previewUrl = info.file.response?.data?.filePaths?.file;
            if (previewUrl) {
                setImageUrl(previewUrl);
                setImageFile(info.file.originFileObj); 
            }
        }

        if (info.file.status === 'error') {
            setUploading(false);
            message.error('Tải ảnh lên thất bại!');
        }
    }, []);

    // Load teachers list with role_id = 7
    const loadTeachers = async () => {
        setTeachersLoading(true);
        try {
            const result = await dispatch(actionGetListUsers({
                page: 1,
                limit: 1000,
                role_id: 7 // Chỉ lấy giáo viên
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
    };

    // Load detail data for edit mode
    const loadDetailData = async () => {
        if (!isEditMode) return;

        setDetailLoading(true);
        try {
            const result = await dispatch(actionGetDetailClass(editId));
            console.log("data: ", result);
            if (result) {
                form.setFieldsValue({
                    name: result.name,
                    description: result.description,
                    teacher_id: result.teacher_id,
                    status: String(result.status || '2')
                });
                setImageUrl(result.image || '');
                setDetailImageUrl(result.image || '');
            }
        } catch (error) {
            console.error('Error loading detail:', error);
            message.error('Lỗi khi tải thông tin lớp học');
        } finally {
            setDetailLoading(false);
        }
    };

    const handleRemoveImage = useCallback(() => {
        setImageUrl('');
        setImageFile(null);
        message.success('Đã xóa ảnh!');
    }, []);

    const beforeUpload = useCallback((file) => {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            message.error('Bạn chỉ có thể upload file JPG/PNG!');
            return false;
        }

        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            message.error('Ảnh phải nhỏ hơn 2MB!');
            return false;
        }

        return true;
    }, []);

    const customUpload = useCallback(async ({ file, onSuccess, onError }) => {
        try {
            const previewUrl = URL.createObjectURL(file);

            onSuccess({
                data: {
                    filePaths: {
                        file: previewUrl 
                    }
                }
            });
        } catch (error) {
            console.error('Preview error:', error);
            onError(error);
        }
    }, []);

    // Handle form submission
    const handleSubmit = async (values) => {
        setLoading(true);
        try {
            let finalImageUrl = imageUrl;

            // Upload image if there's a new file
            if (imageFile && imageUrl.startsWith('blob:')) {
                const formData = new FormData();
                formData.append('file', imageFile);
                formData.append('type', 'class');

                if (isEditMode && detailImageUrl) {
                    formData.append('oldImage', detailImageUrl);
                }
                
                try {
                    finalImageUrl = await dispatch(uploadImageClass(formData));
                } catch (uploadError) {
                    console.error('Upload error:', uploadError);
                    message.error('Upload ảnh thất bại!');
                    setLoading(false);
                    return;
                }
            }

            const formData = {
                ...values,
                image: finalImageUrl
            };

            let result;
            if (isEditMode) {
                result = await dispatch(actionUpdateClass(editId, formData));
            } else {
                result = await dispatch(actionCreateClass(formData));
            }

            if (result?.success || result?.status === 200 || result) {
                // Show success alert
                await showSuccessToast(`${isEditMode ? 'Cập nhật' : 'Tạo mới'} lớp học thành công`);

                form.resetFields();
                setImageUrl('');
                setImageFile(null);
                onSuccess && onSuccess();
            } else {
                // Show error alert
                await showErrorAlert(result?.message || `${isEditMode ? 'Cập nhật' : 'Tạo mới'} lớp học thất bại`);
            }
        } catch (error) {
            console.error('Submit error:', error);

            // Show error alert
            await showErrorAlert('Đã xảy ra lỗi, vui lòng thử lại');
        } finally {
            setLoading(false);
        }
    };

    // Handle modal close
    const handleCancel = () => {
        form.resetFields();
        setImageUrl('');
        setImageFile(null);
        onCancel && onCancel();
    };

    // Load data when modal opens
    useEffect(() => {
        if (visible) {
            loadTeachers();

            if (isEditMode) {
                loadDetailData();
            } else {
                form.resetFields();
                setImageUrl('');
                setImageFile(null);
            }
        }
    }, [visible, isEditMode, editId]);

    return (
        <Modal
            title={isEditMode ? 'Sửa lớp học' : 'Thêm mới lớp học'}
            open={visible}
            onCancel={handleCancel}
            width={800}
            footer={null}
            destroyOnClose
        >
            {/* Header Section with Image */}
            <div className="bg-white rounded-lg shadow-sm border mb-6 overflow-hidden">
                <div className="p-4">
                    <div className="flex items-center gap-4">
                        {/* Icon/Image */}
                        <div className="relative">
                            <div className="w-16 h-16 bg-gradient-to-br from-green-500 via-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-white text-lg font-bold overflow-hidden shadow-lg">
                                {imageUrl ? (
                                    <img
                                        src={imageUrl}
                                        alt="Class thumbnail"
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            e.target.style.display = 'none';
                                            e.target.nextSibling.style.display = 'flex';
                                        }}
                                    />
                                ) : null}
                                <div
                                    className={`w-full h-full flex items-center justify-center ${imageUrl ? 'hidden' : ''}`}
                                >
                                    <FileTextOutlined className="text-xl" />
                                </div>
                            </div>
                        </div>

                        {/* Class Info */}
                        <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900 mb-1">
                                {isEditMode ? (form.getFieldValue('name') || 'Cập nhật lớp học') : 'Tạo lớp học mới'}
                            </h3>
                            <p className="text-gray-600 text-sm">
                                {isEditMode ? 'Chỉnh sửa thông tin lớp học' : 'Thêm lớp học mới vào hệ thống'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                disabled={detailLoading}
                initialValues={{
                    status: '2'
                }}
            >
                {/* Tên lớp học */}
                <Form.Item
                    label="Tên lớp học"
                    name="name"
                    rules={[
                        { required: true, message: 'Vui lòng nhập tên lớp học' },
                        { max: 200, message: 'Tên lớp học không được vượt quá 200 ký tự' }
                    ]}
                >
                    <Input
                        placeholder="Nhập tên lớp học"
                        showCount
                        maxLength={200}
                        disabled={detailLoading}
                    />
                </Form.Item>

                {/* Mô tả */}
                <Form.Item
                    label="Mô tả ngắn"
                    name="description"
                    rules={[
                        { required: true, message: 'Vui lòng nhập mô tả' },
                        { max: 500, message: 'Mô tả không được vượt quá 500 ký tự' }
                    ]}
                >
                    <TextArea
                        placeholder="Nhập mô tả ngắn về lớp học"
                        rows={4}
                        showCount
                        maxLength={500}
                        disabled={detailLoading}
                    />
                </Form.Item>

                {/* Giáo viên phụ trách */}
                <Form.Item
                    label="Giáo viên phụ trách"
                    name="teacher_id"
                    rules={[
                        { required: true, message: 'Vui lòng chọn giáo viên phụ trách' }
                    ]}
                >
                    <Select
                        placeholder="Chọn giáo viên phụ trách"
                        loading={teachersLoading}
                        disabled={detailLoading || teachersLoading}
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

                {/* Trạng thái */}
                <Form.Item
                    label="Trạng thái"
                    name="status"
                    rules={[
                        { required: true, message: 'Vui lòng chọn trạng thái' }
                    ]}
                >
                    <Select 
                        placeholder="Chọn trạng thái"
                        disabled={detailLoading}
                    >
                        {CLASS_STATUS.map(status => (
                            <Option key={status.value} value={status.value}>
                                {status.label}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>

                {/* Hình ảnh đại diện */}
                <Form.Item label="Hình ảnh đại diện">
                    <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex flex-col md:flex-row gap-4 items-start">
                            {/* Preview ảnh */}
                            <div className="flex-shrink-0">
                                {imageUrl ? (
                                    <div>
                                        <Image
                                            src={imageUrl}
                                            alt="Class image"
                                            width={150}
                                            height={100}
                                            style={{
                                                objectFit: 'cover',
                                                borderRadius: '8px'
                                            }}
                                        />
                                        <div className="mt-2 text-center">
                                            <Button
                                                danger
                                                icon={<DeleteOutlined />}
                                                onClick={handleRemoveImage}
                                                size="small"
                                                disabled={detailLoading}
                                            >
                                                Xóa ảnh
                                            </Button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="w-36 h-24 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center">
                                        <div className="text-gray-400 mb-1">
                                            <UploadOutlined style={{ fontSize: '20px' }} />
                                        </div>
                                        <p className="text-gray-500 text-xs">Chưa có ảnh</p>
                                    </div>
                                )}
                            </div>

                            {/* Upload controls */}
                            <div className="flex-1">
                                <Upload
                                    name="file"
                                    listType="text"
                                    className="w-full"
                                    showUploadList={false}
                                    customRequest={customUpload}
                                    beforeUpload={beforeUpload}
                                    onChange={handleImageChange}
                                    disabled={detailLoading}
                                >
                                    <Button
                                        icon={<UploadOutlined />}
                                        type={imageUrl ? 'default' : 'dashed'}
                                        loading={uploading}
                                        disabled={detailLoading}
                                        className="w-full md:w-auto"
                                    >
                                        {uploading ? 'Đang tải lên...' : (imageUrl ? 'Thay đổi ảnh' : 'Tải ảnh lên')}
                                    </Button>
                                </Upload>
                                <p className="text-xs text-gray-500 mt-2">
                                    Chỉ chấp nhận file JPG, PNG. Kích thước tối đa 2MB.
                                </p>
                            </div>
                        </div>
                    </div>
                </Form.Item>

                <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
                    <Button
                        onClick={handleCancel}
                        style={{ marginRight: 8 }}
                        disabled={loading || detailLoading}
                    >
                        Hủy
                    </Button>
                    <Button
                        type="primary"
                        htmlType="submit"
                        loading={loading || detailLoading}
                        className="bg-blue-600"
                    >
                        {isEditMode ? 'Cập nhật' : 'Tạo mới'}
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default CreateUpdateClass;