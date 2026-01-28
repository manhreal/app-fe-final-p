import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Form,
    Input,
    Select,
    Button,
    Card,
    DatePicker,
    Upload,
    Image,
    message
} from 'antd';
import {
    SaveOutlined,
    CloseOutlined,
    UploadOutlined,
    DeleteOutlined,
    FileTextOutlined,
    CalendarOutlined,
    RetweetOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { actionGetDetailNews, actionUpdateNews, actionCreateNews } from '../../../redux/news/actions';
import { uploadImageNews } from '../../../redux/upload/actions';
import EditorTiny from '../../../app/lib/editorTiny/tinymce';
import BackButton2 from '../../../components/BackButton/BackButton2';
import Loading1 from "../../../components/common/Loading";
import { showErrorAlert, showSuccessToast, showWarningToast, showUpdateConfirmDialog } from '../../../lib/sweetAlertConfig';

const { Option } = Select;
const { TextArea } = Input;

const NEWS_STATUS = [
    { value: '1', label: 'ACTIVE' },
    { value: '0', label: 'INACTIVE' },
    { value: '2', label: 'DRAFT' }
];

const QUICK_DATE_OPTIONS = [
    { label: '7 ngày', value: 7, icon: <CalendarOutlined /> },
    { label: '14 ngày', value: 14, icon: <CalendarOutlined /> },
    { label: '30 ngày', value: 30, icon: <CalendarOutlined /> },
    { label: 'Vĩnh viễn', value: null, icon: <RetweetOutlined /> }
];

const CreateUpdateNews = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams();
    const isEdit = Boolean(id);

    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [imageUrl, setImageUrl] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const [initialValues, setInitialValues] = useState({});
    const [uploading, setUploading] = useState(false);
    const [dataLoaded, setDataLoaded] = useState(false);
    const [editorContent, setEditorContent] = useState('');

    const { dataDetailNews, loading: loadingDetail } = useSelector(state => state.news);

    const handleEditorChange = useCallback((html) => {
        setEditorContent(html);
        form.setFieldsValue({ content: html });
    }, [form]);

    const handleQuickDateSelect = useCallback((days) => {
        const startDate = dayjs();

        if (days === null) {
            form.setFieldsValue({
                startDate: null,
                endDate: null
            });
        } else {
            const endDate = startDate.add(days, 'day');
            form.setFieldsValue({
                startDate: startDate,
                endDate: endDate
            });
        }
    }, [form]);

    const handleStartDateChange = useCallback((date) => {
        if (date) {
            const endDate = form.getFieldValue('endDate');
            if (!endDate) {
                form.setFieldsValue({
                    endDate: date.add(30, 'day')
                });
            }
        }
    }, [form]);

    const handleEndDateChange = useCallback((date) => {
        if (date) {
            const startDate = form.getFieldValue('startDate');
            if (!startDate) {
                form.setFieldsValue({
                    startDate: date.subtract(30, 'day')
                });
            }
        }
    }, [form]);

    const disabledStartDate = useCallback((current) => {
        const endDate = form.getFieldValue('endDate');
        if (endDate) {
            return current && current.isAfter(dayjs(endDate), 'day');
        }
        return false;
    }, [form]);

    const disabledEndDate = useCallback((current) => {
        const startDate = form.getFieldValue('startDate');
        if (startDate) {
            return current && current.isBefore(dayjs(startDate), 'day');
        }
        return false;
    }, [form]);

    const handleImageChange = useCallback(async (info) => {
        if (info.file.status === 'uploading') {
            setUploading(true);
            return;
        }

        if (info.file.status === 'done') {
            setUploading(false);
            // Lấy preview URL và lưu file gốc để upload khi submit
            const previewUrl = info.file.response?.data?.filePaths?.file;
            if (previewUrl) {
                setImageUrl(previewUrl);
                setImageFile(info.file.originFileObj); // Lưu file gốc
            }
        }

        if (info.file.status === 'error') {
            setUploading(false);
            message.error('Tải ảnh lên thất bại!');
        }
    }, []);

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

    const handleCancel = useCallback(() => {
        form.setFieldsValue(initialValues);
        setEditorContent(dataDetailNews?.content || '');
        setImageUrl(dataDetailNews?.image || '');
    }, [form, initialValues, dataDetailNews]);

    // Validate form trước khi submit
    const validateFormBeforeSubmit = useCallback(async () => {
        try {
            await form.validateFields();

            // Kiểm tra nội dung editor
            if (!editorContent || editorContent.trim() === '' || editorContent === '<p></p>') {
                return false;
            }

            return true;
        } catch (error) {
            console.log("Lỗi: ", error);
            return false;
        }
    }, [form, editorContent]);

    const handleSubmit = useCallback(async (values) => {
        try {
            setSubmitting(true);

            // Validate form trước khi submit
            const isFormValid = await validateFormBeforeSubmit();

            if (!isFormValid) {
                await showWarningToast('Vui lòng điền đầy đủ các trường bắt buộc và kiểm tra lại dữ liệu!');
                setSubmitting(false);
                return;
            }

            // Nếu là cập nhật, show confirm dialog
            if (isEdit) {
                const result = await showUpdateConfirmDialog('tin tức');

                if (!result.isConfirmed) {
                    setSubmitting(false);
                    return;
                }
            }

            let finalImageUrl = imageUrl;

            if (imageFile && imageUrl.startsWith('blob:')) {
                const formData = new FormData();
                formData.append('file', imageFile);
                formData.append('type', 'news');

                try {
                    finalImageUrl = await dispatch(uploadImageNews(formData));
                } catch (uploadError) {
                    console.error('Upload error:', uploadError);
                    message.error('Upload ảnh thất bại!');
                    setSubmitting(false);
                    return;
                }
            }

            const formData = {
                ...values,
                content: editorContent,
                startDate: values.startDate ? dayjs(values.startDate).format('YYYY-MM-DD') : null,
                endDate: values.endDate ? dayjs(values.endDate).format('YYYY-MM-DD') : null,
                image: finalImageUrl
            };

            let result;
            if (isEdit) {
                result = await dispatch(actionUpdateNews(id, formData));
                if (result) {
                    await showSuccessToast('Cập nhật tin tức thành công');
                    navigate('/admin/news/news-list');
                }
            } else {
                result = await dispatch(actionCreateNews(formData));
                if (result) {
                    await showSuccessToast('Tạo tin tức thành công');
                    navigate('/admin/news/news-list');
                }
            }

        } catch (error) {
            console.error('Error saving news:', error);
            await showErrorAlert(`${isEdit ? 'Cập nhật' : 'Tạo mới'} tin tức thất bại! Vui lòng thử lại.`);
        } finally {
            setSubmitting(false);
        }
    }, [dispatch, navigate, isEdit, id, imageUrl, editorContent, validateFormBeforeSubmit]);

    const getStatusLabel = useCallback((status) => {
        const statusObj = NEWS_STATUS.find(s => s.value === String(status));
        return statusObj ? statusObj.label : 'Unknown';
    }, []);

    const getStatusColor = useCallback((status) => {
        const statusStr = String(status);
        switch (statusStr) {
            case '1': return 'bg-green-100 text-green-800';
            case '0': return 'bg-red-100 text-red-800';
            case '2': return 'bg-yellow-100 text-yellow-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    }, []);

    const handleBackToList = useCallback(() => {
        navigate("/admin/news/news-list");
    }, [navigate]);

    const customUpload = useCallback(async ({ file, onSuccess, onError }) => {
        try {
            // Chỉ tạo URL preview từ file, không upload lên BE
            const previewUrl = URL.createObjectURL(file);

            onSuccess({
                data: {
                    filePaths: {
                        file: previewUrl // URL tạm để preview
                    }
                }
            });
        } catch (error) {
            console.error('Preview error:', error);
            onError(error);
        }
    }, []);

    useEffect(() => {
        const loadNewsData = async () => {
            if (isEdit && id && !dataLoaded) {
                setLoading(true);
                try {
                    await dispatch(actionGetDetailNews(id));
                    setDataLoaded(true);
                } catch (error) {
                    console.error('Error loading news:', error);
                    message.error('Không thể tải thông tin tin tức!');
                } finally {
                    setLoading(false);
                }
            }
        };

        loadNewsData();
    }, [isEdit, id, dispatch, dataLoaded]);

    const setFormData = useCallback(() => {
        if (dataDetailNews) {
            const formValues = {
                title: dataDetailNews.title || '',
                description: dataDetailNews.description || '',
                status: String(dataDetailNews.status || '2'),
                startDate: dataDetailNews.startDate ? dayjs(dataDetailNews.startDate) : null,
                endDate: dataDetailNews.endDate ? dayjs(dataDetailNews.endDate) : null
            };

            form.setFieldsValue(formValues);
            setInitialValues(formValues);
            setEditorContent(dataDetailNews.content || '');
            setImageUrl(dataDetailNews.image || '');
        }
    }, [dataDetailNews, form]);

    useEffect(() => {
        if (isEdit && dataDetailNews && dataLoaded) {
            setFormData();
            setTimeout(() => {
                setFormData();
            }, 200);
        }
    }, [dataDetailNews, isEdit, dataLoaded, setFormData]);

    const validateEndDate = useCallback((_, value) => {
        const startDate = form.getFieldValue('startDate');
        if (value && startDate && dayjs(value).isBefore(dayjs(startDate))) {
            return Promise.reject(new Error('Ngày kết thúc phải sau ngày bắt đầu!'));
        }
        return Promise.resolve();
    }, [form]);

    if (loading || loadingDetail) {
        return (
            <Loading1 />
        );
    }

    return (
        <Card className="mb-6 rounded-xl">
            <BackButton2
                onClick={handleBackToList}
                text="← Về danh sách tin tức"
            />
            {/* Header Section */}
            <div className="bg-white rounded-lg shadow-sm border mb-6 overflow-hidden">
                <div className="p-6">
                    <div className="flex flex-col sm:flex-row items-center gap-6">
                        {/* Icon */}
                        <div className="relative">
                            <div className="w-24 h-24 bg-gradient-to-br from-green-500 via-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-white text-xl font-bold overflow-hidden shadow-lg ring-2 ring-white">
                                {imageUrl ? (
                                    <img
                                        src={imageUrl}
                                        alt="News thumbnail"
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
                                    <FileTextOutlined className="text-2xl" />
                                </div>
                            </div>
                        </div>

                        {/* News Info */}
                        <div className="text-center sm:text-left flex-1">
                            <h2 className="text-xl font-bold text-gray-900 mb-1">
                                {isEdit ? (form.getFieldValue('title') || 'Cập nhật tin tức') : 'Tạo tin tức mới'}
                            </h2>
                            <p className="text-gray-600 mb-2">
                                {isEdit ? 'Chỉnh sửa thông tin tin tức' : 'Thêm tin tức mới vào hệ thống'}
                            </p>
                            {isEdit && dataDetailNews?.status && (
                                <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(dataDetailNews.status)}`}>
                                    {getStatusLabel(dataDetailNews.status)}
                                </span>
                            )}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2">
                            {isEdit && (
                                <Button
                                    icon={<CloseOutlined />}
                                    onClick={handleCancel}
                                    className="border-gray-300 hover:border-gray-400"
                                >
                                    Reset lại
                                </Button>
                            )}
                            <Button
                                type="primary"
                                icon={<SaveOutlined />}
                                onClick={() => form.submit()}
                                loading={submitting}
                                className="bg-blue-600 hover:bg-blue-700 border-blue-600 hover:border-blue-700"
                            >
                                {isEdit ? 'Cập nhật' : 'Tạo mới'}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Form Section */}
            <Card className="shadow-sm border">
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                    className="space-y-6"
                    initialValues={{
                        status: '2' // Default to DRAFT
                    }}
                >
                    {/* Tiêu đề */}
                    <div className="space-y-3">
                        <label className="font-medium text-gray-700">Tiêu đề tin tức</label>
                        <Form.Item
                            name="title"
                            rules={[
                                { required: true, message: 'Vui lòng nhập tiêu đề!' },
                                { max: 200, message: 'Tiêu đề không được vượt quá 200 ký tự!' }
                            ]}
                            className="mb-0"
                        >
                            <Input
                                placeholder="Nhập tiêu đề tin tức"
                                showCount
                                maxLength={200}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                            />
                        </Form.Item>
                    </div>

                    {/* Mô tả ngắn */}
                    <div className="space-y-3">
                        <label className="font-medium text-gray-700">Mô tả ngắn</label>
                        <Form.Item
                            name="description"
                            rules={[
                                { required: true, message: 'Vui lòng nhập mô tả!' },
                                { max: 500, message: 'Mô tả không được vượt quá 500 ký tự!' }
                            ]}
                            className="mb-0"
                        >
                            <TextArea
                                placeholder="Nhập mô tả ngắn về tin tức"
                                rows={4}
                                showCount
                                maxLength={500}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                            />
                        </Form.Item>
                    </div>

                    {/* Cài đặt - Hàng ngang */}
                    <div className="bg-gray-50 rounded-lg p-4">
                        <h3 className="font-medium text-gray-900 mb-4">Cài đặt</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-3">
                                <label className="font-medium text-gray-700">Trạng thái</label>
                                <Form.Item
                                    name="status"
                                    rules={[
                                        { required: true, message: 'Vui lòng chọn trạng thái!' }
                                    ]}
                                    className="mb-0"
                                >
                                    <Select placeholder="Chọn trạng thái">
                                        {NEWS_STATUS.map(status => (
                                            <Option key={status.value} value={status.value}>
                                                {status.label}
                                            </Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            </div>

                            <div className="space-y-3">
                                <label className="font-medium text-gray-700">Ngày bắt đầu</label>
                                <Form.Item
                                    name="startDate"
                                    className="mb-0"
                                >
                                    <DatePicker
                                        className="w-full"
                                        placeholder="Chọn ngày bắt đầu"
                                        format="DD/MM/YYYY"
                                        showTime={false}
                                        allowClear={true}
                                        disabledDate={disabledStartDate}
                                        onChange={handleStartDateChange}
                                    />
                                </Form.Item>
                            </div>

                            <div className="space-y-3">
                                <label className="font-medium text-gray-700">Ngày kết thúc</label>
                                <Form.Item
                                    name="endDate"
                                    className="mb-0"
                                    rules={[
                                        { validator: validateEndDate }
                                    ]}
                                >
                                    <DatePicker
                                        className="w-full"
                                        placeholder="Chọn ngày kết thúc"
                                        format="DD/MM/YYYY"
                                        showTime={false}
                                        allowClear={true}
                                        disabledDate={disabledEndDate}
                                        onChange={handleEndDateChange}
                                    />
                                </Form.Item>
                            </div>
                        </div>

                        {/* Nút chọn nhanh ngày */}
                        <div className="mt-4">
                            <label className="font-medium text-gray-700 mb-2 block">Chọn nhanh thời gian</label>
                            <div className="flex flex-wrap gap-2">
                                {QUICK_DATE_OPTIONS.map((option, index) => (
                                    <Button
                                        key={index}
                                        size="small"
                                        icon={option.icon}
                                        onClick={() => handleQuickDateSelect(option.value)}
                                        className="text-xs"
                                    >
                                        {option.label}
                                    </Button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Hình ảnh đại diện */}
                    <div className="bg-gray-50 rounded-lg p-4">
                        <h3 className="font-medium text-gray-900 mb-4">Hình ảnh đại diện</h3>
                        <div className="flex flex-col md:flex-row gap-4 items-start">
                            {/* Preview ảnh */}
                            <div className="flex-shrink-0">
                                {imageUrl ? (
                                    <div>
                                        <Image
                                            src={imageUrl}
                                            alt="News image"
                                            width={200}
                                            height={150}
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
                                            >
                                                Xóa ảnh
                                            </Button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="w-48 h-32 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center">
                                        <div className="text-gray-400 mb-2">
                                            <UploadOutlined style={{ fontSize: '24px' }} />
                                        </div>
                                        <p className="text-gray-500 text-sm">Chưa có ảnh đại diện</p>
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
                                >
                                    <Button
                                        icon={<UploadOutlined />}
                                        type={imageUrl ? 'default' : 'dashed'}
                                        loading={uploading}
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

                    {/* Nội dung chi tiết - Full width */}
                    <div className="space-y-3">
                        <label className="font-medium text-gray-700">Nội dung chi tiết</label>
                        <Form.Item
                            name="content"
                            rules={[
                                {
                                    validator: () => {
                                        if (!editorContent || editorContent.trim() === '' || editorContent === '<p></p>') {
                                            return Promise.reject(new Error('Vui lòng nhập nội dung!'));
                                        }
                                        return Promise.resolve();
                                    }
                                }
                            ]}
                            className="mb-0"
                        >
                            <EditorTiny
                                data={editorContent}
                                getData={handleEditorChange}
                            />
                        </Form.Item>
                    </div>

                    {/* Read-only Information for Edit Mode */}
                    {isEdit && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-6 border-t border-gray-200">
                            <div className="space-y-2">
                                <div className="text-sm">
                                    <span className="font-medium text-gray-700">Lần cập nhật cuối:</span>
                                    <span className="ml-2 text-gray-900">
                                        {dayjs().format('DD/MM/YYYY HH:mm')}
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}
                </Form>
            </Card>
        </Card>
    );
};

export default CreateUpdateNews;