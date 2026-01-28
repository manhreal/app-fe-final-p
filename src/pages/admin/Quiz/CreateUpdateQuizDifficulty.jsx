import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Button, message, InputNumber } from 'antd';
import { useDispatch } from 'react-redux';
import {
    actionGetDetailQuizDifficulty,
    actionCreateQuizDifficulty,
    actionUpdateQuizDifficulty
} from '../../../redux/quiz_difficulty/actions';
import {
    showErrorAlert,
    showSuccessToast
} from '../../../lib/sweetAlertConfig';

const { TextArea } = Input;

const CreateUpdateQuizDifficulty = ({
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
            const result = await dispatch(actionGetDetailQuizDifficulty(editId));
            console.log("data: ", result);
            if (result) {
                form.setFieldsValue({
                    level: result.level,
                    name: result.name,
                    description: result.description
                });
            }
        } catch (error) {
            console.error('Error loading detail:', error);
            message.error('Lỗi khi tải thông tin độ khó câu hỏi');
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
                result = await dispatch(actionUpdateQuizDifficulty(editId, values));
            } else {
                result = await dispatch(actionCreateQuizDifficulty(values));
            }

            if (result?.success || result?.status === 200 || result) {
                // Show success alert
                await showSuccessToast(`${isEditMode ? 'Cập nhật' : 'Tạo mới'} độ khó câu hỏi thành công`);

                form.resetFields();
                onSuccess && onSuccess();
            } else {
                // Show error alert
                await showErrorAlert(result?.message || `${isEditMode ? 'Cập nhật' : 'Tạo mới'} độ khó câu hỏi thất bại`);
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
            title={isEditMode ? 'Sửa độ khó câu hỏi' : 'Thêm mới độ khó câu hỏi'}
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
                    label="Cấp độ khó câu hỏi"
                    name="level"
                    rules={[
                        { required: true, message: 'Vui lòng nhập mã độ khó câu hỏi' }
                    ]}
                >
                    <InputNumber
                        placeholder="Nhập cấp độ khó câu hỏi (ví dụ: 1, 2, 3...)"
                        disabled={detailLoading}
                        showCount
                        maxLength={50}
                        style={{ width: '100%' }}
                    />
                </Form.Item>
                <Form.Item
                    label="Tên độ khó câu hỏi"
                    name="name"
                    rules={[
                        { required: true, message: 'Vui lòng nhập tên độ khó câu hỏi' },
                        { max: 255, message: 'Tên độ khó câu hỏi không được vượt quá 255 ký tự' },
                        { min: 2, message: 'Tên độ khó câu hỏi phải có ít nhất 2 ký tự' }
                    ]}
                >
                    <Input
                        placeholder="Nhập tên độ khó câu hỏi (ví dụ: Đại số, Hình học, Giải tích...)"
                        disabled={detailLoading}
                        showCount
                        maxLength={255}
                    />
                </Form.Item>

                <Form.Item
                    label="Mô tả"
                    name="description"
                    rules={[
                        { required: true, message: 'Vui lòng nhập mô tả độ khó câu hỏi' },
                        { max: 1000, message: 'Mô tả không được vượt quá 1000 ký tự' },
                        { min: 10, message: 'Mô tả phải có ít nhất 10 ký tự' }
                    ]}
                >
                    <TextArea
                        placeholder="Nhập mô tả chi tiết về độ khó câu hỏi này..."
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

export default CreateUpdateQuizDifficulty;