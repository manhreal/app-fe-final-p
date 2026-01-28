import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    Modal,
    Form,
    Input,
    Select,
    Button,
    Upload,
    Image,
    DatePicker,
    InputNumber,
    message,
    Radio,
    Space
} from 'antd';
import {
    UploadOutlined,
    DeleteOutlined,
    FileTextOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { actionGetDetailExam, actionUpdateExam, actionCreateExam, actionGetListExams } from '../../../redux/exam/actions';
import { actionGetListExamTypes } from '../../../redux/exam_type/actions';
import { uploadImageExam } from '../../../redux/upload/actions';
import {
    showErrorAlert,
    showSuccessToast
} from '../../../lib/sweetAlertConfig';

const { Option } = Select;
const { TextArea } = Input;
const { RangePicker } = DatePicker;

const CreateUpdateExam = ({
    visible,
    onCancel,
    onSuccess,
    editId = null,
    mode = 'create',
    examEventId = null
}) => {
    const dispatch = useDispatch();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [detailLoading, setDetailLoading] = useState(false);
    
    const [imageUrl, setImageUrl] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [detailImageUrl, setDetailImageUrl] = useState('');

    const [examTypes, setExamTypes] = useState([]);
    const [loadingOptions, setLoadingOptions] = useState(false);

    const [examEventName, setExamEventName] = useState('');
    
    // New states for exam selection mode
    const [examCreationMode, setExamCreationMode] = useState('new'); // 'new' or 'existing'
    const [existingExams, setExistingExams] = useState([]);
    const [loadingExams, setLoadingExams] = useState(false);

    const isEditMode = mode === 'edit' && editId;
    const hasExamEvent = examEventId !== null && examEventId !== undefined;

    // Load exam types
    const loadOptions = async () => {
        setLoadingOptions(true);
        try {
            const result = await dispatch(
                actionGetListExamTypes({ page: 1, limit: 1000 })
            );

            setExamTypes(result?.rows || []);
        } catch (error) {
            message.error('Lỗi khi tải danh sách loại đề thi');
            console.error('Error loading exam types:', error);
        } finally {
            setLoadingOptions(false);
        }
    };

    // Load existing exams
    const loadExistingExams = async () => {
        setLoadingExams(true);
        try {
            const result = await dispatch(
                actionGetListExams({ page: 1, limit: 1000 })
            );

            setExistingExams(result?.rows || []);
        } catch (error) {
            message.error('Lỗi khi tải danh sách đề thi');
            console.error('Error loading exams:', error);
        } finally {
            setLoadingExams(false);
        }
    };

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
            const result = await dispatch(actionGetDetailExam(editId));
            console.log("data: ", result);
            if (result) {
                const formValues = {
                    code: result.code,
                    type_id: result.type_id,
                    name: result.name,
                    description: result.description,
                    doing_time: result.doing_time,
                    time_limit_resubmit: result.time_limit_resubmit,
                    score: result.score,
                };

                // Handle date range
                if (result.startDate && result.endDate) {
                    formValues.dateRange = [
                        dayjs(result.startDate),
                        dayjs(result.endDate)
                    ];
                }

                form.setFieldsValue(formValues);
                setImageUrl(result.image || '');
                setDetailImageUrl(result.image || '');

                // Lưu tên kỳ thi để hiển thị
                if (result.exam_events && result.exam_events.length > 0) {
                    setExamEventName(result.exam_events[0].name || '');
                }
            }
        } catch (error) {
            console.error('Error loading detail:', error);
            message.error('Lỗi khi tải thông tin đề thi');
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

    // Handle exam creation mode change
    const handleExamModeChange = (e) => {
        const newMode = e.target.value;
        setExamCreationMode(newMode);
        
        // Reset form when switching modes
        if (newMode === 'existing') {
            form.resetFields();
            setImageUrl('');
            setImageFile(null);
            loadExistingExams();
        } else {
            form.resetFields(['existing_exam_id']);
        }
    };

    // Handle form submission
    const handleSubmit = async (values) => {
        setLoading(true);
        try {
            let finalImageUrl = imageUrl;

            // For existing exam mode
            if (hasExamEvent && examCreationMode === 'existing') {
                if (!values.existing_exam_id) {
                    message.error('Vui lòng chọn đề thi');
                    setLoading(false);
                    return;
                }

                const submitData = {
                    exam_event_id: examEventId,
                    exam_id: values.existing_exam_id,
                    mode: 'existing'
                };

                const result = await dispatch(actionCreateExam(submitData));

                if (result?.success || result?.status === 200 || result) {
                    await showSuccessToast('Thêm đề thi vào kỳ thi thành công');
                    form.resetFields();
                    onSuccess && onSuccess();
                } else {
                    await showErrorAlert(result?.message || 'Thêm đề thi vào kỳ thi thất bại');
                }
                
                setLoading(false);
                return;
            }

            // For new exam mode (create or update)
            // Upload image if there's a new file
            if (imageFile && imageUrl.startsWith('blob:')) {
                const uploadFormData = new FormData();
                uploadFormData.append('file', imageFile);
                uploadFormData.append('type', 'exam');

                if (isEditMode && detailImageUrl) {
                    uploadFormData.append('oldImage', detailImageUrl);
                }
                
                try {
                    finalImageUrl = await dispatch(uploadImageExam(uploadFormData));
                } catch (uploadError) {
                    console.error('Upload error:', uploadError);
                    message.error('Upload ảnh thất bại!');
                    setLoading(false);
                    return;
                }
            }

            // Create object data to submit
            const submitData = {
                code: values.code,
                type_id: values.type_id,
                name: values.name,
                description: values.description,
                doing_time: values.doing_time || 0,
                time_limit_resubmit: values.time_limit_resubmit || 0,
                score: values.score || 0,
                image: finalImageUrl,
                mode: 'new'
            };

            // Add exam_event_id if provided
            if (hasExamEvent) {
                submitData.exam_event_id = examEventId;
            }

            // Handle date range
            if (values.dateRange && values.dateRange.length === 2) {
                submitData.startDate = values.dateRange[0].format('YYYY-MM-DD HH:mm:ss');
                submitData.endDate = values.dateRange[1].format('YYYY-MM-DD HH:mm:ss');
            }

            let result;
            if (isEditMode) {
                result = await dispatch(actionUpdateExam(editId, submitData));
            } else {
                result = await dispatch(actionCreateExam(submitData));
            }

            if (result?.success || result?.status === 200 || result) {
                await showSuccessToast(`${isEditMode ? 'Cập nhật' : 'Tạo mới'} đề thi thành công`);

                form.resetFields();
                setImageUrl('');
                setImageFile(null);
                onSuccess && onSuccess();
            } else {
                await showErrorAlert(result?.message || `${isEditMode ? 'Cập nhật' : 'Tạo mới'} đề thi thất bại`);
            }
        } catch (error) {
            console.error('Submit error:', error);
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
        setExamEventName('');
        setExamCreationMode('new');
        onCancel && onCancel();
    };

    // Load data when modal opens
    useEffect(() => {
        if (visible) {
            loadOptions();
            if (isEditMode) {
                loadDetailData();
            } else {
                form.resetFields();
                setImageUrl('');
                setImageFile(null);
                setExamEventName('');
                setExamCreationMode('new');
            }
        }
    }, [visible, isEditMode, editId]);

    return (
        <Modal
            title={isEditMode ? 'Sửa đề thi' : (hasExamEvent ? 'Thêm đề thi vào kỳ thi' : 'Thêm mới đề thi')}
            open={visible}
            onCancel={handleCancel}
            width={900}
            footer={null}
            destroyOnClose
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                disabled={detailLoading || loadingOptions}
                initialValues={{
                    doing_time: 0,
                    time_limit_resubmit: 0,
                    score: 0
                }}
            >
                <div className="grid grid-cols-1 gap-4">
                    {/* Exam creation mode selection - only show when adding to exam event */}
                    {hasExamEvent && !isEditMode && (
                        <Form.Item label="Phương thức thêm đề thi">
                            <Radio.Group 
                                value={examCreationMode} 
                                onChange={handleExamModeChange}
                                disabled={detailLoading || loadingOptions}
                            >
                                <Space direction="vertical">
                                    <Radio value="new">Tạo đề thi mới</Radio>
                                    <Radio value="existing">Chọn đề thi có sẵn</Radio>
                                </Space>
                            </Radio.Group>
                        </Form.Item>
                    )}

                    {/* Existing exam selection */}
                    {hasExamEvent && !isEditMode && examCreationMode === 'existing' && (
                        <Form.Item
                            label="Chọn đề thi"
                            name="existing_exam_id"
                            rules={[
                                { required: true, message: 'Vui lòng chọn đề thi' }
                            ]}
                        >
                            <Select
                                placeholder="Chọn đề thi có sẵn"
                                showSearch
                                optionFilterProp="children"
                                loading={loadingExams}
                                disabled={detailLoading || loadingOptions || loadingExams}
                                filterOption={(input, option) =>
                                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                }
                            >
                                {existingExams.map(exam => (
                                    <Option key={exam.id} value={exam.id}>
                                        {exam.code} - {exam.name}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                    )}

                    {/* Show exam form only for new mode or edit mode */}
                    {(examCreationMode === 'new' || isEditMode) && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Hiển thị kỳ thi (chỉ đọc) */}
                            {isEditMode && examEventName && (
                                <Form.Item
                                    label="Kỳ thi"
                                    className="md:col-span-2"
                                >
                                    <Input
                                        value={examEventName}
                                        disabled
                                        className="bg-gray-50"
                                        placeholder="Kỳ thi"
                                    />
                                </Form.Item>
                            )}

                            {/* Tên đề thi */}
                            <Form.Item
                                label="Tên đề thi"
                                name="name"
                                className="md:col-span-2"
                                rules={[
                                    { required: true, message: 'Vui lòng nhập tên đề thi' },
                                    { max: 255, message: 'Tên đề thi không được vượt quá 255 ký tự' }
                                ]}
                            >
                                <Input
                                    placeholder="Nhập tên đề thi"
                                    showCount
                                    maxLength={255}
                                    disabled={detailLoading || loadingOptions}
                                />
                            </Form.Item>

                            {/* Mã đề thi */}
                            <Form.Item
                                label="Mã đề thi"
                                name="code"
                                rules={[
                                    { required: true, message: 'Vui lòng nhập mã đề thi' },
                                    { max: 255, message: 'Mã đề thi không được vượt quá 255 ký tự' }
                                ]}
                            >
                                <Input
                                    placeholder="Nhập mã đề thi (ví dụ: DE001)"
                                    showCount
                                    maxLength={255}
                                    disabled={detailLoading || loadingOptions}
                                />
                            </Form.Item>

                            {/* Loại đề thi */}
                            <Form.Item
                                label="Loại đề thi"
                                name="type_id"
                                rules={[
                                    { required: true, message: 'Vui lòng chọn loại đề thi' }
                                ]}
                            >
                                <Select
                                    placeholder="Chọn loại đề thi"
                                    showSearch
                                    optionFilterProp="children"
                                    loading={loadingOptions}
                                    disabled={detailLoading || loadingOptions}
                                >
                                    {examTypes.map(type => (
                                        <Option key={type.id} value={type.id}>
                                            {type.name}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>

                            {/* Thời gian làm bài */}
                            <Form.Item
                                label="Thời gian làm bài (phút)"
                                name="doing_time"
                                rules={[
                                    { required: true, message: 'Vui lòng nhập thời gian làm bài' }
                                ]}
                            >
                                <InputNumber
                                    placeholder="Nhập số phút"
                                    min={0}
                                    style={{ width: '100%' }}
                                    disabled={detailLoading || loadingOptions}
                                />
                            </Form.Item>

                            {/* Thời gian chờ nộp lại */}
                            <Form.Item
                                label="Thời gian chờ nộp lại (phút)"
                                name="time_limit_resubmit"
                            >
                                <InputNumber
                                    placeholder="Nhập số phút"
                                    min={0}
                                    style={{ width: '100%' }}
                                    disabled={detailLoading || loadingOptions}
                                />
                            </Form.Item>

                            {/* Điểm */}
                            <Form.Item
                                label="Điểm tối đa"
                                name="score"
                                rules={[
                                    { required: true, message: 'Vui lòng nhập điểm tối đa' }
                                ]}
                            >
                                <InputNumber
                                    placeholder="Nhập điểm"
                                    min={0}
                                    style={{ width: '100%' }}
                                    disabled={detailLoading || loadingOptions}
                                />
                            </Form.Item>

                            {/* Thời gian bắt đầu - kết thúc */}
                            <Form.Item
                                label="Thời gian thi"
                                name="dateRange"
                                className="md:col-span-2"
                                rules={[
                                    { required: true, message: 'Vui lòng chọn thời gian thi' }
                                ]}
                            >
                                <RangePicker
                                    showTime
                                    format="DD/MM/YYYY HH:mm"
                                    placeholder={['Ngày bắt đầu', 'Ngày kết thúc']}
                                    style={{ width: '100%' }}
                                    disabled={detailLoading || loadingOptions}
                                />
                            </Form.Item>

                            {/* Mô tả */}
                            <Form.Item
                                label="Mô tả"
                                name="description"
                                className="md:col-span-2"
                            >
                                <TextArea
                                    placeholder="Nhập mô tả về đề thi"
                                    rows={4}
                                    showCount
                                    disabled={detailLoading || loadingOptions}
                                />
                            </Form.Item>

                            {/* Hình ảnh đại diện */}
                            <Form.Item label="Hình ảnh đại diện" className="md:col-span-2">
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <div className="flex flex-col md:flex-row gap-4 items-start">
                                        {/* Preview ảnh */}
                                        <div className="flex-shrink-0">
                                            {imageUrl ? (
                                                <div>
                                                    <Image
                                                        src={imageUrl}
                                                        alt="Exam image"
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
                                                            disabled={detailLoading || loadingOptions}
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
                                                disabled={detailLoading || loadingOptions}
                                            >
                                                <Button
                                                    icon={<UploadOutlined />}
                                                    type={imageUrl ? 'default' : 'dashed'}
                                                    loading={uploading}
                                                    disabled={detailLoading || loadingOptions}
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
                        </div>
                    )}
                </div>

                <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
                    <Button
                        onClick={handleCancel}
                        style={{ marginRight: 8 }}
                        disabled={loading || detailLoading || loadingOptions}
                    >
                        Hủy
                    </Button>
                    <Button
                        type="primary"
                        htmlType="submit"
                        loading={loading || detailLoading || loadingOptions}
                        className="bg-blue-600"
                    >
                        {isEditMode ? 'Cập nhật' : (examCreationMode === 'existing' ? 'Thêm vào kỳ thi' : 'Tạo mới')}
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default CreateUpdateExam;