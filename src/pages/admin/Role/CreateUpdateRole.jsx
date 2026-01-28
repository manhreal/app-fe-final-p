import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, InputNumber, Button, message } from 'antd';
import { useDispatch } from 'react-redux';
import {
    actionGetDetailRole,
    actionCreateRole,
    actionUpdateRole
} from '../../../redux/role/actions';
import {
    showErrorAlert,
    showSuccessToast
} from '../../../lib/sweetAlertConfig';

const { TextArea } = Input;

const CreateUpdateRole = ({
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

    // Function to convert Vietnamese text to code format
    const convertToCode = (text) => {
        if (!text) return '';

        // Remove Vietnamese accents
        const vietnameseMap = {
            'à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ': 'a',
            'è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ': 'e',
            'ì|í|ị|ỉ|ĩ': 'i',
            'ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ': 'o',
            'ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ': 'u',
            'ỳ|ý|ỵ|ỷ|ỹ': 'y',
            'đ': 'd',
            'À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ': 'A',
            'È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ': 'E',
            'Ì|Í|Ị|Ỉ|Ĩ': 'I',
            'Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ': 'O',
            'Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ': 'U',
            'Ỳ|Ý|Ỵ|Ỷ|Ỹ': 'Y',
            'Đ': 'D'
        };

        let result = text;
        Object.keys(vietnameseMap).forEach(key => {
            const regex = new RegExp(key, 'g');
            result = result.replace(regex, vietnameseMap[key]);
        });

        // Convert to lowercase, remove special characters, replace spaces with underscores
        return result
            .toLowerCase()
            .replace(/[^a-z0-9\s]/g, '')
            .trim()
            .replace(/\s+/g, '_');
    };

    // Handle name change to auto-generate code
    const handleNameChange = (e) => {
        const name = e.target.value;
        const autoCode = convertToCode(name);
        form.setFieldsValue({ code: autoCode });
    };

    // Load detail data for edit mode
    const loadDetailData = async () => {
        if (!isEditMode) return;

        setDetailLoading(true);
        try {
            const result = await dispatch(actionGetDetailRole(editId));
            console.log("data: ", result)
            if (result) {
                form.setFieldsValue({
                    name: result.name,
                    code: result.code,
                    description: result.description,
                });
            }


        } catch (error) {
            console.error('Error loading detail:', error);
            message.error('Lỗi khi tải thông tin vai trò');
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
                result = await dispatch(actionUpdateRole(editId, values));
            } else {
                result = await dispatch(actionCreateRole(values));
            }

            if (result?.success || result?.status === 200 || result) {
                // Show success alert
                await showSuccessToast(`${isEditMode ? 'Cập nhật' : 'Tạo mới'} vai trò thành công`);

                form.resetFields();
                onSuccess && onSuccess();
            } else {
                // Show error alert
                await showErrorAlert(`${isEditMode ? 'Cập nhật' : 'Tạo mới'} vai trò thất bại`);
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

    // Load data when modal opens in edit mode
    useEffect(() => {
        if (visible && isEditMode) {
            loadDetailData();
        } else if (visible && !isEditMode) {
            form.resetFields();
        }
    }, [visible, isEditMode, editId]);

    return (
        <Modal
            title={isEditMode ? 'Sửa vai trò' : 'Thêm mới vai trò'}
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
                    label="Tên vai trò"
                    name="name"
                    rules={[
                        { required: true, message: 'Vui lòng nhập tên vai trò' },
                        { max: 255, message: 'Tên vai trò không được vượt quá 255 ký tự' }
                    ]}
                >
                    <Input
                        placeholder="Nhập tên vai trò"
                        onChange={handleNameChange}
                        disabled={detailLoading}
                    />
                </Form.Item>

                <Form.Item
                    label="Mã vai trò"
                    name="code"
                    rules={[
                        { required: true, message: 'Vui lòng nhập mã vai trò' },
                        { max: 100, message: 'Mã vai trò không được vượt quá 100 ký tự' },
                        {
                            pattern: /^[a-z0-9_]+$/,
                            message: 'Mã chỉ được chứa chữ thường, số và dấu gạch dưới'
                        }
                    ]}
                >
                    <Input
                        placeholder="Mã sẽ được tự động tạo từ tên"
                        disabled
                    />
                </Form.Item>

                <Form.Item
                    label="Mô tả"
                    name="description"
                    rules={[
                        { max: 500, message: 'Mô tả không được vượt quá 500 ký tự' }
                    ]}
                >
                    <TextArea
                        placeholder="Nhập mô tả vai trò"
                        rows={4}
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

export default CreateUpdateRole;