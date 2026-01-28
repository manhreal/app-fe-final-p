import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import {
    Modal,
    Form,
    Input,
    Button,
    message
} from 'antd';
import { actionGetDetailExamType, actionUpdateExamType, actionCreateExamType } from '../../../redux/exam_type/actions';
import {
    showErrorAlert,
    showSuccessToast
} from '../../../lib/sweetAlertConfig';

const { TextArea } = Input;

const CreateUpdateExamType = ({
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
            const result = await dispatch(actionGetDetailExamType(editId));
            console.log("data: ", result);
            if (result) {
                form.setFieldsValue({
                    name: result.name,
                    description: result.description,
                });
            }
        } catch (error) {
            console.error('Error loading detail:', error);
            message.error('Lỗi khi tải thông tin loại đề thi');
        } finally {
            setDetailLoading(false);
        }
    };

    // Handle form submission
    const handleSubmit = async (values) => {
        setLoading(true);
        try {
            const formData = {
                ...values
            };

            let result;
            if (isEditMode) {
                result = await dispatch(actionUpdateExamType(editId, formData));
            } else {
                result = await dispatch(actionCreateExamType(formData));
            }

            if (result?.success || result?.status === 200 || result) {
                // Show success alert
                await showSuccessToast(`${isEditMode ? 'Cập nhật' : 'Tạo mới'} loại đề thi thành công`);

                form.resetFields();
                onSuccess && onSuccess();
            } else {
                // Show error alert
                await showErrorAlert(result?.message || `${isEditMode ? 'Cập nhật' : 'Tạo mới'} loại đề thi thất bại`);
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
            title={isEditMode ? 'Sửa loại đề thi' : 'Thêm mới loại đề thi'}
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
                {/* Tên loại đề thi */}
                <Form.Item
                    label="Tên loại đề thi"
                    name="name"
                    rules={[
                        { required: true, message: 'Vui lòng nhập tên loại đề thi' },
                        { max: 200, message: 'Tên loại đề thi không được vượt quá 200 ký tự' }
                    ]}
                >
                    <Input
                        placeholder="Nhập tên loại đề thi"
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
                        placeholder="Nhập mô tả ngắn về loại đề thi"
                        rows={4}
                        showCount
                        maxLength={500}
                        disabled={detailLoading}
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

export default CreateUpdateExamType;