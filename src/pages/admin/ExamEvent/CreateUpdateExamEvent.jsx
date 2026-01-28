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
import { actionGetDetailExamEvent, actionUpdateExamEvent, actionCreateExamEvent } from '../../../redux/exam_event/actions';
import { uploadImageExamEvent } from '../../../redux/upload/actions';
import {
    showErrorAlert,
    showSuccessToast
} from '../../../lib/sweetAlertConfig';

const { Option } = Select;
const { TextArea } = Input;

const CreateUpdateExamEvent = ({
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

    // Load detail data for edit mode
    const loadDetailData = async () => {
        if (!isEditMode) return;

        setDetailLoading(true);
        try {
            const result = await dispatch(actionGetDetailExamEvent(editId));
            console.log("data: ", result);
            if (result) {
                form.setFieldsValue({
                    name: result.name,
                    description: result.description,
                });
                setImageUrl(result.image || '');
                setDetailImageUrl(result.image || '');
            }
        } catch (error) {
            console.error('Error loading detail:', error);
            message.error('Lỗi khi tải thông tin kỳ thi');
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
                    finalImageUrl = await dispatch(uploadImageExamEvent(formData));
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
                result = await dispatch(actionUpdateExamEvent(editId, formData));
            } else {
                result = await dispatch(actionCreateExamEvent(formData));
            }

            if (result?.success || result?.status === 200 || result) {
                // Show success alert
                await showSuccessToast(`${isEditMode ? 'Cập nhật' : 'Tạo mới'} đề thi thành công`);

                form.resetFields();
                setImageUrl('');
                setImageFile(null);
                onSuccess && onSuccess();
            } else {
                // Show error alert
                await showErrorAlert(result?.message || `${isEditMode ? 'Cập nhật' : 'Tạo mới'} đề thi thất bại`);
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
            title={isEditMode ? 'Sửa kỳ thi' : 'Thêm mới kỳ thi'}
            open={visible}
            onCancel={handleCancel}
            width={800}
            footer={null}
            destroyOnClose
        >
            
            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                disabled={detailLoading}
                initialValues={{
                    status: '2'
                }}
            >
                {/* Tên kỳ thi */}
                <Form.Item
                    label="Tên kỳ thi"
                    name="name"
                    rules={[
                        { required: true, message: 'Vui lòng nhập tên kỳ thi' },
                        { max: 200, message: 'Tên kỳ thi không được vượt quá 200 ký tự' }
                    ]}
                >
                    <Input
                        placeholder="Nhập tên kỳ thi"
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
                        placeholder="Nhập mô tả ngắn về kỳ thi"
                        rows={4}
                        showCount
                        maxLength={500}
                        disabled={detailLoading}
                    />
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

export default CreateUpdateExamEvent;