import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Button, message } from 'antd';
import { useDispatch } from 'react-redux';
import {
    actionGetDetailClassMaterialCategory,
    actionCreateClassMaterialCategory,
    actionUpdateClassMaterialCategory
} from '../../../redux/class_material_category/actions';
import {
    showErrorAlert,
    showSuccessToast
} from '../../../lib/sweetAlertConfig';

const { TextArea } = Input;

const CreateUpdateClassMaterialCategory = ({
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
            const result = await dispatch(actionGetDetailClassMaterialCategory(editId));
            console.log("data: ", result);
            if (result) {
                form.setFieldsValue({
                    name: result.name,
                    description: result.description
                });
            }
        } catch (error) {
            console.error('Error loading detail:', error);
            message.error('Lỗi khi tải thông tin danh mục');
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
                result = await dispatch(actionUpdateClassMaterialCategory(editId, values));
            } else {
                result = await dispatch(actionCreateClassMaterialCategory(values));
            }

            if (result?.success || result?.status === 200 || result) {
                // Show success alert
                await showSuccessToast(`${isEditMode ? 'Cập nhật' : 'Tạo mới'} danh mục thành công`);

                form.resetFields();
                onSuccess && onSuccess();
            } else {
                // Show error alert
                await showErrorAlert(result?.message || `${isEditMode ? 'Cập nhật' : 'Tạo mới'} danh mục thất bại`);
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
            title={isEditMode ? 'Sửa danh mục tài liệu học tập' : 'Thêm mới danh mục tài liệu học tập'}
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
                    label="Tên danh mục"
                    name="name"
                    rules={[
                        { required: true, message: 'Vui lòng nhập tên danh mục' },
                        { max: 255, message: 'Tên danh mục không được vượt quá 255 ký tự' },
                        { min: 2, message: 'Tên danh mục phải có ít nhất 2 ký tự' }
                    ]}
                >
                    <Input
                        placeholder="Nhập tên danh mục (ví dụ: Đại số, Hình học, Giải tích...)"
                        disabled={detailLoading}
                        showCount
                        maxLength={255}
                    />
                </Form.Item>

                <Form.Item
                    label="Mô tả"
                    name="description"
                    rules={[
                        { required: true, message: 'Vui lòng nhập mô tả danh mục' },
                        { max: 1000, message: 'Mô tả không được vượt quá 1000 ký tự' },
                        { min: 10, message: 'Mô tả phải có ít nhất 10 ký tự' }
                    ]}
                >
                    <TextArea
                        placeholder="Nhập mô tả chi tiết về danh mục này..."
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

export default CreateUpdateClassMaterialCategory;