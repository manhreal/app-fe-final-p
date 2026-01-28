import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    Card,
    Form,
    Input,
    Button,
    Space,
    Spin,
    message,
    Modal,
    Upload as AntUpload,
    DatePicker,
    InputNumber
} from 'antd';
import {
    EditOutlined,
    SaveOutlined,
    CloseOutlined,
    UploadOutlined
} from '@ant-design/icons';
import ImgCrop from 'antd-img-crop';
import { actionGetDetailExamEvent, actionUpdateExamEvent } from '../../../redux/exam_event/actions';
import { uploadImageExamEvent } from '../../../redux/upload/actions';
import moment from 'moment';

const { TextArea } = Input;

const BASE_IMG = '/icon/upload.png';

const DetailExamEvent = ({ examEventId }) => {
    const dispatch = useDispatch();
    const { dataDetailExamEvent, loading } = useSelector(state => state.examEvents);
    const [form] = Form.useForm();
    const [isEditing, setIsEditing] = useState(false);
    const [initialValues, setInitialValues] = useState({});
    const [previewUrl, setPreviewUrl] = useState(null);
    const [imageModalVisible, setImageModalVisible] = useState(false);
    const [tempImageFile, setTempImageFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false);

    // Load exam_event detail data
    const loadExamEventDetail = useCallback(async () => {
        if (!examEventId) return;

        try {
            await dispatch(actionGetDetailExamEvent(examEventId));
        } catch (error) {
            message.error('Không thể tải thông tin sự kiện thi');
            console.error('Error loading exam_event detail:', error);
        }
    }, [dispatch, examEventId]);

    // Set form values when data changes
    useEffect(() => {
        if (dataDetailExamEvent) {
            const formValues = {
                code: dataDetailExamEvent.code || '',
                name: dataDetailExamEvent.name || '',
                description: dataDetailExamEvent.description || '',
                student_limit: dataDetailExamEvent.student_limit || 0,
                startDate: dataDetailExamEvent.startDate ? moment(dataDetailExamEvent.startDate) : null,
                endDate: dataDetailExamEvent.endDate ? moment(dataDetailExamEvent.endDate) : null
            };

            form.setFieldsValue(formValues);
            setInitialValues(formValues);
        }
    }, [dataDetailExamEvent, form]);

    // Load data on component mount
    useEffect(() => {
        loadExamEventDetail();
    }, [loadExamEventDetail]);

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

            // Convert moment to date string for API
            const payload = {
                ...values,
                startDate: values.startDate ? values.startDate.format('YYYY-MM-DD HH:mm:ss') : null,
                endDate: values.endDate ? values.endDate.format('YYYY-MM-DD HH:mm:ss') : null
            };

            await dispatch(actionUpdateExamEvent(examEventId, payload));

            message.success('Cập nhật thông tin sự kiện thi thành công');
            setIsEditing(false);

            // Update initial values with new data
            setInitialValues(values);

        } catch (error) {
            if (error.errorFields) {
                message.error('Vui lòng kiểm tra lại thông tin nhập vào');
            } else {
                message.error('Có lỗi xảy ra khi cập nhật thông tin');
                console.error('Error updating exam_event:', error);
            }
        }
    }, [dispatch, form, examEventId]);

    // Image upload functions
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

    const generateImageFileName = (code) => {
        const timestamp = new Date().getTime();
        return `exam-event-${code}-${timestamp}`;
    };

    const handleImageUpload = async (file) => {
        if (!validateImageFile(file)) return false;
        setTempImageFile(file);
        return false; // Prevent auto upload
    };

    const handleImageSave = async () => {
        if (!tempImageFile || !dataDetailExamEvent?.code) return;

        setIsUploading(true);
        try {
            const customFileName = generateImageFileName(dataDetailExamEvent.code);
            const formData = new FormData();

            const fileExtension = tempImageFile.name.split('.').pop();
            const newFile = new File([tempImageFile], `${customFileName}.${fileExtension}`, {
                type: tempImageFile.type,
                lastModified: tempImageFile.lastModified,
            });

            formData.append('file', newFile);
            formData.append('oldImage', dataDetailExamEvent.image || '');

            const uploadedImagePath = await dispatch(uploadImageExamEvent(formData));

            if (uploadedImagePath) {
                // Update exam_event with new image
                const payload = {
                    ...dataDetailExamEvent,
                    image: uploadedImagePath,
                    startDate: dataDetailExamEvent.startDate ? moment(dataDetailExamEvent.startDate).format('YYYY-MM-DD HH:mm:ss') : null,
                    endDate: dataDetailExamEvent.endDate ? moment(dataDetailExamEvent.endDate).format('YYYY-MM-DD HH:mm:ss') : null
                };

                await dispatch(actionUpdateExamEvent(examEventId, payload));

                setImageModalVisible(false);
                setTempImageFile(null);
                message.success('Cập nhật ảnh sự kiện thành công!');

                // Reload exam_event data
                await loadExamEventDetail();
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

    const getCurrentImage = () => {
        if (previewUrl) return previewUrl;
        if (dataDetailExamEvent?.image && dataDetailExamEvent.image !== BASE_IMG) {
            if (dataDetailExamEvent.image.startsWith('http')) {
                return dataDetailExamEvent.image;
            } else {
                return `http://localhost:3000/image_exam_event/${dataDetailExamEvent.image.split('/').pop()}`;
            }
        }
        return BASE_IMG;
    };

    // Format date
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

    if (loading && !dataDetailExamEvent) {
        return (
            <div className="flex items-center justify-center py-20">
                <Spin size="large" />
            </div>
        );
    }

    if (!dataDetailExamEvent) {
        return (
            <Card className="mx-4 my-6">
                <div className="text-center py-8 text-gray-500">
                    Không tìm thấy thông tin sự kiện thi
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
                        {/* Event Image */}
                        <div className="relative">
                            <div className="w-24 h-24 bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-500 rounded-lg flex items-center justify-center text-white text-xl font-bold overflow-hidden shadow-lg ring-2 ring-white">
                                {getCurrentImage() && getCurrentImage() !== BASE_IMG ? (
                                    <img
                                        src={getCurrentImage()}
                                        alt="Event"
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
                                    {dataDetailExamEvent.name?.charAt(0)?.toUpperCase() || 'E'}
                                </div>
                            </div>

                            {/* Edit image button */}
                            <button
                                onClick={() => setImageModalVisible(true)}
                                className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-white shadow-md border-2 border-gray-100 flex items-center justify-center hover:bg-gray-50 transition-all duration-200 transform hover:scale-105"
                            >
                                <EditOutlined className="text-gray-600 text-xs" />
                            </button>
                        </div>

                        {/* Event Info */}
                        <div className="text-center sm:text-left flex-1">
                            <h2 className="text-xl font-bold text-gray-900 mb-1">{dataDetailExamEvent.name}</h2>
                            <p className="text-gray-600 mb-2">Mã: {dataDetailExamEvent.code}</p>
                            <span className="inline-block px-3 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                                Giới hạn: {dataDetailExamEvent.student_limit} học sinh
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
                            <label className="font-medium text-gray-700">Mã sự kiện</label>
                            {isEditing ? (
                                <Form.Item
                                    name="code"
                                    rules={[
                                        { required: true, message: 'Vui lòng nhập mã sự kiện!' }
                                    ]}
                                    className="mb-0"
                                >
                                    <Input
                                        placeholder="Nhập mã sự kiện"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                    />
                                </Form.Item>
                            ) : (
                                <div className="bg-gray-50 rounded-md px-4 py-2 text-gray-900 border border-gray-200">
                                    {dataDetailExamEvent.code || 'Chưa cập nhật'}
                                </div>
                            )}
                        </div>

                        <div className="space-y-3">
                            <label className="font-medium text-gray-700">Tên sự kiện</label>
                            {isEditing ? (
                                <Form.Item
                                    name="name"
                                    rules={[
                                        { required: true, message: 'Vui lòng nhập tên sự kiện!' }
                                    ]}
                                    className="mb-0"
                                >
                                    <Input
                                        placeholder="Nhập tên sự kiện"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                    />
                                </Form.Item>
                            ) : (
                                <div className="bg-gray-50 rounded-md px-4 py-2 text-gray-900 border border-gray-200">
                                    {dataDetailExamEvent.name || 'Chưa cập nhật'}
                                </div>
                            )}
                        </div>

                        <div className="space-y-3">
                            <label className="font-medium text-gray-700">Giới hạn học sinh</label>
                            {isEditing ? (
                                <Form.Item
                                    name="student_limit"
                                    rules={[
                                        { required: true, message: 'Vui lòng nhập giới hạn học sinh!' }
                                    ]}
                                    className="mb-0"
                                >
                                    <InputNumber
                                        min={0}
                                        placeholder="Nhập số lượng học sinh"
                                        className="w-full"
                                    />
                                </Form.Item>
                            ) : (
                                <div className="bg-gray-50 rounded-md px-4 py-2 text-gray-900 border border-gray-200">
                                    {dataDetailExamEvent.student_limit || 0}
                                </div>
                            )}
                        </div>

                        <div className="space-y-3">
                            <label className="font-medium text-gray-700">Ngày bắt đầu</label>
                            {isEditing ? (
                                <Form.Item
                                    name="startDate"
                                    rules={[
                                        { required: true, message: 'Vui lòng chọn ngày bắt đầu!' }
                                    ]}
                                    className="mb-0"
                                >
                                    <DatePicker
                                        showTime
                                        format="DD/MM/YYYY HH:mm"
                                        placeholder="Chọn ngày bắt đầu"
                                        className="w-full"
                                    />
                                </Form.Item>
                            ) : (
                                <div className="bg-gray-50 rounded-md px-4 py-2 text-gray-900 border border-gray-200">
                                    {formatDate(dataDetailExamEvent.startDate)}
                                </div>
                            )}
                        </div>

                        <div className="space-y-3">
                            <label className="font-medium text-gray-700">Ngày kết thúc</label>
                            {isEditing ? (
                                <Form.Item
                                    name="endDate"
                                    rules={[
                                        { required: true, message: 'Vui lòng chọn ngày kết thúc!' }
                                    ]}
                                    className="mb-0"
                                >
                                    <DatePicker
                                        showTime
                                        format="DD/MM/YYYY HH:mm"
                                        placeholder="Chọn ngày kết thúc"
                                        className="w-full"
                                    />
                                </Form.Item>
                            ) : (
                                <div className="bg-gray-50 rounded-md px-4 py-2 text-gray-900 border border-gray-200">
                                    {formatDate(dataDetailExamEvent.endDate)}
                                </div>
                            )}
                        </div>

                        <div className="space-y-3 lg:col-span-2">
                            <label className="font-medium text-gray-700">Mô tả</label>
                            {isEditing ? (
                                <Form.Item name="description" className="mb-0">
                                    <TextArea
                                        placeholder="Nhập mô tả sự kiện"
                                        rows={4}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                    />
                                </Form.Item>
                            ) : (
                                <div className="bg-gray-50 rounded-md px-4 py-2 text-gray-900 border border-gray-200 min-h-[6rem]">
                                    {dataDetailExamEvent.description || 'Chưa cập nhật'}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Read-only Information */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-6 border-t border-gray-200">
                        <div className="space-y-2">
                            <div className="text-sm">
                                <span className="font-medium text-gray-700">ID:</span>
                                <span className="ml-2 text-gray-900">{dataDetailExamEvent.id}</span>
                            </div>
                            <div className="text-sm">
                                <span className="font-medium text-gray-700">Ngày tạo:</span>
                                <span className="ml-2 text-gray-900">{formatDate(dataDetailExamEvent.createdAt)}</span>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="text-sm">
                                <span className="font-medium text-gray-700">Lần cập nhật cuối:</span>
                                <span className="ml-2 text-gray-900">{formatDate(dataDetailExamEvent.updatedAt)}</span>
                            </div>
                        </div>
                    </div>
                </Form>
            </Card>

            {/* Image Upload Modal */}
            <Modal
                title="Cập nhật ảnh sự kiện"
                open={imageModalVisible}
                onCancel={() => {
                    setImageModalVisible(false);
                    setTempImageFile(null);
                }}
                footer={[
                    <Button key="cancel" onClick={() => {
                        setImageModalVisible(false);
                        setTempImageFile(null);
                    }}>
                        Hủy
                    </Button>,
                    <Button
                        key="save"
                        type="primary"
                        loading={isUploading}
                        disabled={!tempImageFile}
                        onClick={handleImageSave}
                        className="bg-blue-500 border-blue-500 hover:bg-blue-600"
                    >
                        Lưu ảnh
                    </Button>
                ]}
            >
                <div className="py-4">
                    <ImgCrop
                        rotationSlider
                        aspect={16/9}
                        quality={0.8}
                        modalTitle="Chỉnh sửa ảnh"
                        modalOk="Xác nhận"
                        modalCancel="Hủy"
                    >
                        <AntUpload
                            listType="picture-card"
                            className="avatar-uploader"
                            showUploadList={false}
                            beforeUpload={handleImageUpload}
                            accept="image/*"
                        >
                            {tempImageFile ? (
                                <div className="flex flex-col items-center">
                                    <img
                                        src={URL.createObjectURL(tempImageFile)}
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

export default DetailExamEvent;