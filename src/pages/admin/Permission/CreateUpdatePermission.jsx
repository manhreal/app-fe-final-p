import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, InputNumber, Button, message, Select } from 'antd';
import { useDispatch } from 'react-redux';
import {
    actionGetDetailPermission,
    actionCreatePermission,
    actionUpdatePermission
} from '../../../redux/permission/actions';
import { actionGetListPermissionGroups } from '../../../redux/permission_group/actions';
import {
    showErrorAlert,
    showSuccessToast
} from '../../../lib/sweetAlertConfig';

const { TextArea } = Input;
const { Option } = Select;

const CreateUpdatePermission = ({
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
    const [permissionGroups, setPermissionGroups] = useState([]);
    const [groupsLoading, setGroupsLoading] = useState(false);

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

    // Load permission groups for dropdown
    const loadPermissionGroups = async () => {
        setGroupsLoading(true);
        try {
            const result = await dispatch(actionGetListPermissionGroups({
                page: 1,
                limit: 1000 // Get all groups for dropdown
            }));
            if (result?.rows) {
                setPermissionGroups(result.rows);
            }
        } catch (error) {
            console.error('Error loading permission groups:', error);
            message.error('Lỗi khi tải danh sách nhóm quyền');
        } finally {
            setGroupsLoading(false);
        }
    };

    // Load detail data for edit mode
    const loadDetailData = async () => {
        if (!isEditMode) return;

        setDetailLoading(true);
        try {
            const result = await dispatch(actionGetDetailPermission(editId));
            console.log("data: ", result);
            if (result) {
                form.setFieldsValue({
                    name: result.name,
                    code: result.code,
                    description: result.description,
                    group_id: result.group_id,
                    sort_order: result.sort_order ?? 0
                });
            }
        } catch (error) {
            console.error('Error loading detail:', error);
            message.error('Lỗi khi tải thông tin quyền');
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
                result = await dispatch(actionUpdatePermission(editId, values));
            } else {
                result = await dispatch(actionCreatePermission(values));
            }

            if (result?.success || result?.status === 200 || result) {
                // Show success alert
                await showSuccessToast(`${isEditMode ? 'Cập nhật' : 'Tạo mới'} quyền thành công`);

                form.resetFields();
                onSuccess && onSuccess();
            } else {
                // Show error alert
                await showErrorAlert(result?.message || `${isEditMode ? 'Cập nhật' : 'Tạo mới'} quyền thất bại`);
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
            loadPermissionGroups();

            if (isEditMode) {
                loadDetailData();
            } else {
                form.resetFields();
            }
        }
    }, [visible, isEditMode, editId]);

    return (
        <Modal
            title={isEditMode ? 'Sửa quyền' : 'Thêm mới quyền'}
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
                    label="Tên quyền"
                    name="name"
                    rules={[
                        { required: true, message: 'Vui lòng nhập tên quyền' },
                        { max: 255, message: 'Tên quyền không được vượt quá 255 ký tự' }
                    ]}
                >
                    <Input
                        placeholder="Nhập tên quyền"
                        onChange={handleNameChange}
                        disabled={detailLoading}
                    />
                </Form.Item>

                <Form.Item
                    label="Mã quyền"
                    name="code"
                    rules={[
                        { required: true, message: 'Vui lòng nhập mã quyền' },
                        { max: 100, message: 'Mã quyền không được vượt quá 100 ký tự' },
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
                    label="Nhóm quyền"
                    name="group_id"
                    rules={[
                        { required: true, message: 'Vui lòng chọn nhóm quyền' }
                    ]}
                >
                    <Select
                        placeholder="Chọn nhóm quyền"
                        loading={groupsLoading}
                        disabled={detailLoading || groupsLoading}
                        showSearch
                        filterOption={(input, option) =>
                            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                    >
                        {permissionGroups.map(group => (
                            <Option key={group.id} value={group.id}>
                                {group.name} ({group.code})
                            </Option>
                        ))}
                    </Select>
                </Form.Item>

                <Form.Item
                    label="Mô tả"
                    name="description"
                    rules={[
                        { max: 500, message: 'Mô tả không được vượt quá 500 ký tự' }
                    ]}
                >
                    <TextArea
                        placeholder="Nhập mô tả quyền"
                        rows={4}
                        disabled={detailLoading}
                    />
                </Form.Item>

                <Form.Item
                    label="Thứ tự sắp xếp"
                    name="sort_order"
                    initialValue={0}
                    rules={[
                        { type: 'number', min: 0, message: 'Thứ tự phải là số không âm' }
                    ]}
                >
                    <InputNumber
                        placeholder="Nhập thứ tự sắp xếp"
                        min={0}
                        style={{ width: '100%' }}
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

export default CreateUpdatePermission;