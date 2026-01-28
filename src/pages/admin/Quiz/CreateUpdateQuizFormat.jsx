import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Button, message } from 'antd';
import { useDispatch } from 'react-redux';
import {
    actionGetDetailQuizFormat,
    actionCreateQuizFormat,
    actionUpdateQuizFormat
} from '../../../redux/quiz_format/actions';
import {
    showErrorAlert,
    showSuccessToast
} from '../../../lib/sweetAlertConfig';

const { TextArea } = Input;

const CreateUpdateQuizFormat = ({
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

    const isEditMode = mode === 'edit' && editId;

    // Load detail data for edit mode
    const loadDetailData = async () => {
        if (!isEditMode) return;

        setDetailLoading(true);
        try {
            const result = await dispatch(actionGetDetailQuizFormat(editId));
            console.log("data: ", result);
            if (result) {
                form.setFieldsValue({
                    code: result.code,
                    name: result.name,
                    description: result.description
                });
            }
        } catch (error) {
            console.error('Error loading detail:', error);
            message.error('Lỗi khi tải thông tin dạng câu hỏi');
        } finally {
            setDetailLoading(false);
        }
    };

    // Handle form submission
    const handleSubmit = async (values) => {
        setLoading(true);
        try {
            let result;
            if (isEditMode) {
                result = await dispatch(actionUpdateQuizFormat(editId, values));
            } else {
                result = await dispatch(actionCreateQuizFormat(values));
            }

            if (result?.success || result?.status === 200 || result) {
                // Show success alert
                await showSuccessToast(`${isEditMode ? 'Cập nhật' : 'Tạo mới'} dạng câu hỏi thành công`);

                form.resetFields();
                onSuccess && onSuccess();
            } else {
                // Show error alert
                await showErrorAlert(result?.message || `${isEditMode ? 'Cập nhật' : 'Tạo mới'} dạng câu hỏi thất bại`);
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
        onCancel && onCancel();
    };

    // Load data when modal opens
    useEffect(() => {
        if (visible) {
            if (isEditMode) {
                loadDetailData();
            } else {
                form.resetFields();
            }
        }
    }, [visible, isEditMode, editId]);

    return (
        <Modal
            title={isEditMode ? 'Sửa dạng câu hỏi' : 'Thêm mới dạng câu hỏi'}
            open={visible}
            onCancel={handleCancel}
            width={600}
            footer={null}
            destroyOnClose
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                disabled={detailLoading}
            >
                <Form.Item
                    label="Mã dạng câu hỏi"
                    name="code"
                    rules={[
                        { required: true, message: 'Vui lòng nhập mã dạng câu hỏi' },
                        { max: 50, message: 'Mã dạng câu hỏi không được vượt quá 50 ký tự' },
                        { min: 2, message: 'Mã dạng câu hỏi phải có ít nhất 2 ký tự' }
                    ]}
                >
                    <Input
                        placeholder="Nhập mã dạng câu hỏi (ví dụ: ALG, GEO, CAL...)"
                        disabled={detailLoading}
                        showCount
                        maxLength={50}
                    />
                </Form.Item>
                <Form.Item
                    label="Tên dạng câu hỏi"
                    name="name"
                    rules={[
                        { required: true, message: 'Vui lòng nhập tên dạng câu hỏi' },
                        { max: 255, message: 'Tên dạng câu hỏi không được vượt quá 255 ký tự' },
                        { min: 2, message: 'Tên dạng câu hỏi phải có ít nhất 2 ký tự' }
                    ]}
                >
                    <Input
                        placeholder="Nhập tên dạng câu hỏi (ví dụ: Đại số, Hình học, Giải tích...)"
                        disabled={detailLoading}
                        showCount
                        maxLength={255}
                    />
                </Form.Item>

                <Form.Item
                    label="Mô tả"
                    name="description"
                    rules={[
                        { required: true, message: 'Vui lòng nhập mô tả dạng câu hỏi' },
                        { max: 1000, message: 'Mô tả không được vượt quá 1000 ký tự' },
                        { min: 10, message: 'Mô tả phải có ít nhất 10 ký tự' }
                    ]}
                >
                    <TextArea
                        placeholder="Nhập mô tả chi tiết về dạng câu hỏi này..."
                        rows={4}
                        disabled={detailLoading}
                        showCount
                        maxLength={1000}
                    />
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

export default CreateUpdateQuizFormat;