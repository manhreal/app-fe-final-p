import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    Modal,
    Form,
    Input,
    Select,
    Button,
    Upload,
    message,
    Space,
    Row,
    Col,
    List,
    Tag,
    Tooltip
} from 'antd';
import {
    UploadOutlined,
    DeleteOutlined,
    FileOutlined,
    SaveOutlined,
    EditOutlined,
    CheckOutlined,
    CloseOutlined
} from '@ant-design/icons';
import {
    actionGetDetailClassMaterial,
    actionCreateClassMaterial,
    actionUpdateClassMaterial
} from '../../../redux/class_material/actions';

import { uploadClassMaterial } from '../../../redux/upload/actions';

import {
    actionGetListClassMaterialCategories
} from '../../../redux/class_material_category/actions';


const { TextArea } = Input;
const { Option } = Select;

const CreateUpdateClassMaterial = ({
    visible,
    mode = 'create', // 'create' or 'edit'
    classId,
    initialData = null,
    onSuccess,
    onCancel
}) => {
    const [form] = Form.useForm();
    const dispatch = useDispatch();
    
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [fileList, setFileList] = useState([]);
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [editingFileName, setEditingFileName] = useState(null);
    const [tempFileName, setTempFileName] = useState('');
    
    const {
        dataDetailClassMaterial
    } = useSelector(state => state.classMaterials || {});
    
    const {
        dataListClassMaterialCategories,
        loading: loadingCategories
    } = useSelector(state => state.classMaterialCategories || {});
    
    const isEdit = mode === 'edit';
    const modalTitle = isEdit ? 'Chỉnh sửa tài liệu' : 'Tạo tài liệu mới';
    
    const normalizeFileName = useCallback((fileName) => {
        const lastDotIndex = fileName.lastIndexOf('.');
        const name = lastDotIndex > 0 ? fileName.substring(0, lastDotIndex) : fileName;
        const extension = lastDotIndex > 0 ? fileName.substring(lastDotIndex) : '';
        
        const normalizedName = name
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '') 
            .replace(/[^a-z0-9_]/g, '_')
            .replace(/_+/g, '_') 
            .replace(/^_|_$/g, ''); 
        
        return normalizedName + extension;
    }, []);
    
    const getUniqueFileName = useCallback((fileName, existingFiles) => {
        const normalizedName = normalizeFileName(fileName);
        const lastDotIndex = normalizedName.lastIndexOf('.');
        const name = lastDotIndex > 0 ? normalizedName.substring(0, lastDotIndex) : normalizedName;
        const extension = lastDotIndex > 0 ? normalizedName.substring(lastDotIndex) : '';
        
        let uniqueName = normalizedName;
        let counter = 1;
        
        while (existingFiles.some(file => file.displayName === uniqueName)) {
            uniqueName = `${name}_${counter}${extension}`;
            counter++;
        }
        
        return uniqueName;
    }, [normalizeFileName]);
    
    const validateFileName = (fileName) => {
        const nameWithoutExtension = fileName.substring(0, fileName.lastIndexOf('.')) || fileName;
        const validPattern = /^[a-zA-Z0-9_]+$/;
        
        if (!validPattern.test(nameWithoutExtension)) {
            return 'Tên file chỉ được chứa chữ cái, số và dấu gạch dưới (_)';
        }
        
        if (nameWithoutExtension.length === 0) {
            return 'Tên file không được để trống';
        }
        
        if (nameWithoutExtension.length > 100) {
            return 'Tên file không được quá 100 ký tự';
        }
        
        return null;
    };
    
    useEffect(() => {
        if (visible) {
            dispatch(actionGetListClassMaterialCategories());
            
            if (isEdit && initialData?.id) {
                dispatch(actionGetDetailClassMaterial(initialData.id));
            } else {
                form.resetFields();
                setFileList([]);
                setUploadedFiles([]);
            }
        } else {
            form.resetFields();
            setFileList([]);
            setUploadedFiles([]);
            setLoading(false);
            setUploading(false);
            setEditingFileName(null);
            setTempFileName('');
        }
    }, [visible, dispatch, form, isEdit, initialData]);
    
    useEffect(() => {
        if (visible && isEdit && dataDetailClassMaterial) {
            form.setFieldsValue({
                title: dataDetailClassMaterial.title,
                description: dataDetailClassMaterial.description,
                category_id: dataDetailClassMaterial.category_id
            });
            
            if (dataDetailClassMaterial.file_url) {
                try {
                    const existingFiles = Array.isArray(dataDetailClassMaterial.file_url) 
                        ? dataDetailClassMaterial.file_url 
                        : JSON.parse(dataDetailClassMaterial.file_url || '[]');
                    
                    const formattedFiles = existingFiles.map((url, index) => {
                        const fileName = url.split('/').pop() || `file-${index}`;
                        return {
                            uid: `existing-${index}`,
                            displayName: fileName,
                            originalName: fileName,
                            status: 'done',
                            url: url,
                            isExisting: true
                        };
                    });
                    
                    setFileList(formattedFiles);
                    setUploadedFiles(existingFiles);
                } catch (error) {
                    console.error('Error parsing existing files:', error);
                    setFileList([]);
                    setUploadedFiles([]);
                }
            }
        }
    }, [visible, isEdit, dataDetailClassMaterial, form]);
    
    const validateFile = (file) => {
        const allowedTypes = [
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/vnd.ms-excel',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'application/vnd.ms-powerpoint',
            'application/vnd.openxmlformats-officedocument.presentationml.presentation',
            'image/jpeg',
            'image/jpg', 
            'image/png',
            'image/webp'
        ];
        
        if (!allowedTypes.includes(file.type)) {
            message.error('Chỉ hỗ trợ file PDF, Word, Excel, PowerPoint và hình ảnh!');
            return false;
        }
        
        const isLt10M = file.size / 1024 / 1024 < 10;
        if (!isLt10M) {
            message.error('File phải nhỏ hơn 10MB!');
            return false;
        }
        
        return true;
    };
    
    const beforeUpload = useCallback((file) => {
        if (!validateFile(file)) {
            return false;
        }
        
        const uniqueDisplayName = getUniqueFileName(file.name, fileList);
        
        const newFile = {
            uid: `new-${Date.now()}-${Math.random()}`,
            displayName: uniqueDisplayName,
            originalName: file.name,
            status: 'ready',
            size: file.size,
            originFileObj: file,
            isExisting: false
        };
        
        setFileList(prev => [...prev, newFile]);
        return false; 
    }, [fileList, getUniqueFileName]);
    
    const handleRemoveFile = useCallback((file) => {
        setFileList(prev => prev.filter(item => item.uid !== file.uid));
        
        if (file.isExisting) {
            setUploadedFiles(prev => prev.filter(url => url !== file.url));
        }
        
        if (editingFileName === file.uid) {
            setEditingFileName(null);
            setTempFileName('');
        }
    }, [editingFileName]);
    
    const startEditFileName = (file) => {
        setEditingFileName(file.uid);
        const nameWithoutExt = file.displayName.substring(0, file.displayName.lastIndexOf('.')) || file.displayName;
        setTempFileName(nameWithoutExt);
    };
    
    const saveFileName = () => {
        const error = validateFileName(tempFileName);
        if (error) {
            message.error(error);
            return;
        }
        
        const currentFile = fileList.find(f => f.uid === editingFileName);
        if (!currentFile) return;
        
        const extension = currentFile.displayName.substring(currentFile.displayName.lastIndexOf('.')) || '';
        const newDisplayName = tempFileName + extension;
        
        const otherFiles = fileList.filter(f => f.uid !== editingFileName);
        const isDuplicate = otherFiles.some(f => f.displayName === newDisplayName);
        
        if (isDuplicate) {
            message.error('Tên file đã tồn tại!');
            return;
        }
        
        setFileList(prev => prev.map(file => 
            file.uid === editingFileName 
                ? { ...file, displayName: newDisplayName }
                : file
        ));
        
        setEditingFileName(null);
        setTempFileName('');
    };
    
    const cancelEditFileName = () => {
        setEditingFileName(null);
        setTempFileName('');
    };
    
    const uploadSingleFile = async (file) => {
        try {
            const formData = new FormData();
            
            const finalFileName = file.displayName;
            
            const renamedFile = new File([file.originFileObj], finalFileName, {
                type: file.originFileObj.type
            });
            
            formData.append('file', renamedFile);
            formData.append('classId', classId);
            
            const fileUrl = await dispatch(uploadClassMaterial(formData));
            
            if (!fileUrl) {
                throw new Error('Upload failed - no URL returned');
            }
            
            return fileUrl;
        } catch (error) {
            console.error('Upload error for file:', file.displayName, error);
            message.error(`Lỗi upload file ${file.displayName}: ${error.message}`);
            throw error;
        }
    };
    
    const uploadAllFiles = async () => {
        const newFiles = fileList.filter(file => !file.isExisting && file.status === 'ready');
        
        if (newFiles.length === 0) {
            const existingFileUrls = fileList
                .filter(file => file.isExisting)
                .map(file => {
                    if (file.displayName !== file.originalName) {
                        const urlParts = file.url.split('/');
                        urlParts[urlParts.length - 1] = file.displayName;
                        return urlParts.join('/');
                    }
                    return file.url;
                });
            
            return existingFileUrls.filter(Boolean);
        }
        
        setUploading(true);
        
        const existingFileUrls = fileList
            .filter(file => file.isExisting)
            .map(file => {
                if (file.displayName !== file.originalName) {
                    const urlParts = file.url.split('/');
                    urlParts[urlParts.length - 1] = file.displayName;
                    return urlParts.join('/');
                }
                return file.url;
            });
        
        const uploadedUrls = [...existingFileUrls];
        
        try {
            for (const file of newFiles) {
                try {
                    const fileUrl = await uploadSingleFile(file);
                    if (fileUrl) {
                        uploadedUrls.push(fileUrl);
                    }
                } catch (error) {
                    console.error(`Failed to upload ${file.displayName}:`, error);
                }
            }
            
            setUploading(false);
            return uploadedUrls.filter(Boolean);
        } catch (error) {
            setUploading(false);
            throw error;
        }
    };
    
    const handleSubmit = async (values) => {
        try {
            setLoading(true);
            
            const allFileUrls = await uploadAllFiles();
            
            const renamedFiles = fileList
                .filter(f => f.isExisting && f.originalName !== f.displayName)
                .map(f => {
                    const oldUrl = f.url;
                    const newUrl = allFileUrls.find(url => url.endsWith(f.displayName));
                    return { oldUrl, newUrl };
                });

            
            const submitData = {
                ...values,
                class_id: parseInt(classId),
                file_url: allFileUrls.length > 0 ? allFileUrls : [],
                renamed_files: renamedFiles
            };
            
            if (isEdit) {
                await dispatch(actionUpdateClassMaterial(initialData.id, submitData));
                message.success('Cập nhật tài liệu thành công!');
            } else {
                await dispatch(actionCreateClassMaterial(submitData));
                message.success('Tạo tài liệu thành công!');
            }
            
            onSuccess();
        } catch (error) {
            console.error('Submit error:', error);
            message.error(isEdit ? 'Lỗi cập nhật tài liệu!' : 'Lỗi tạo tài liệu!');
        } finally {
            setLoading(false);
        }
    };
    
    // Handle modal cancel
    const handleCancel = () => {
        form.resetFields();
        setFileList([]);
        setUploadedFiles([]);
        setEditingFileName(null);
        setTempFileName('');
        onCancel();
    };
    
    return (
        <Modal
            title={modalTitle}
            open={visible}
            onCancel={handleCancel}
            width={800}
            footer={null}
            destroyOnClose
            maskClosable={false}
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                requiredMark={false}
            >
                <Row gutter={16}>
                    <Col xs={24}>
                        <Form.Item
                            name="title"
                            label="Tiêu đề tài liệu"
                            rules={[
                                { required: true, message: 'Vui lòng nhập tiêu đề!' },
                                { max: 200, message: 'Tiêu đề không quá 200 ký tự!' }
                            ]}
                        >
                            <Input placeholder="Nhập tiêu đề tài liệu..." />
                        </Form.Item>
                    </Col>
                </Row>
                
                <Row gutter={16}>
                    <Col xs={24} sm={12}>
                        <Form.Item
                            name="category_id"
                            label="Danh mục"
                            rules={[{ required: true, message: 'Vui lòng chọn danh mục!' }]}
                        >
                            <Select 
                                placeholder="Chọn danh mục..."
                                loading={loadingCategories}
                            >
                                {dataListClassMaterialCategories?.rows?.map(category => (
                                    <Option key={category.id} value={category.id}>
                                        {category.name}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={12}>
                        <Form.Item label="Tải lên tài liệu">
                            <Upload
                                beforeUpload={beforeUpload}
                                showUploadList={false}
                                multiple
                                accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.jpg,.jpeg,.png,.webp"
                            >
                                <Button icon={<UploadOutlined />} size="small">
                                    Chọn file
                                </Button>
                            </Upload>
                        </Form.Item>
                    </Col>
                </Row>
                
                <Row gutter={16}>
                    <Col xs={24}>
                        <Form.Item
                            name="description"
                            label="Mô tả"
                            rules={[
                                { max: 500, message: 'Mô tả không quá 500 ký tự!' }
                            ]}
                        >
                            <TextArea 
                                rows={3} 
                                placeholder="Nhập mô tả tài liệu..."
                            />
                        </Form.Item>
                    </Col>
                </Row>
                
                {fileList.length > 0 && (
                    <Row gutter={16}>
                        <Col xs={24}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-2">
                                    Danh sách file ({fileList.length}):
                                </label>
                                <List
                                    size="small"
                                    dataSource={fileList}
                                    renderItem={(file) => (
                                        <List.Item
                                            actions={[
                                                // Allow editing for both new and existing files
                                                editingFileName === file.uid ? (
                                                    <Space key="edit-actions">
                                                        <Tooltip title="Lưu">
                                                            <Button
                                                                type="text"
                                                                size="small"
                                                                icon={<CheckOutlined />}
                                                                onClick={saveFileName}
                                                            />
                                                        </Tooltip>
                                                        <Tooltip title="Hủy">
                                                            <Button
                                                                type="text"
                                                                size="small"
                                                                icon={<CloseOutlined />}
                                                                onClick={cancelEditFileName}
                                                            />
                                                        </Tooltip>
                                                    </Space>
                                                ) : (
                                                    <Tooltip title="Sửa tên file" key="edit">
                                                        <Button
                                                            type="text"
                                                            size="small"
                                                            icon={<EditOutlined />}
                                                            onClick={() => startEditFileName(file)}
                                                        />
                                                    </Tooltip>
                                                ),
                                                <Tooltip title="Xóa file" key="delete">
                                                    <Button
                                                        type="text"
                                                        danger
                                                        size="small"
                                                        icon={<DeleteOutlined />}
                                                        onClick={() => handleRemoveFile(file)}
                                                    />
                                                </Tooltip>
                                            ]}
                                        >
                                            <List.Item.Meta
                                                avatar={<FileOutlined />}
                                                title={
                                                    <div>
                                                        {editingFileName === file.uid ? (
                                                            <Input
                                                                size="small"
                                                                value={tempFileName}
                                                                onChange={(e) => setTempFileName(e.target.value)}
                                                                placeholder="Nhập tên file (chỉ chữ, số và _)"
                                                                style={{ width: 200 }}
                                                                suffix={file.displayName.substring(file.displayName.lastIndexOf('.')) || ''}
                                                                onPressEnter={saveFileName}
                                                            />
                                                        ) : (
                                                            <Space>
                                                                <span>{file.displayName}</span>
                                                                {file.isExisting && (
                                                                    <Tag color="blue" size="small">
                                                                        Đã có
                                                                    </Tag>
                                                                )}
                                                                {file.status === 'ready' && (
                                                                    <Tag color="orange" size="small">
                                                                        Chờ upload
                                                                    </Tag>
                                                                )}
                                                                {file.originalName !== file.displayName && (
                                                                    <Tooltip title={`Tên gốc: ${file.originalName}`}>
                                                                        <Tag color="green" size="small">
                                                                            Đã rename
                                                                        </Tag>
                                                                    </Tooltip>
                                                                )}
                                                            </Space>
                                                        )}
                                                    </div>
                                                }
                                                description={
                                                    file.size ? 
                                                    `${(file.size / 1024 / 1024).toFixed(2)} MB` : 
                                                    'Đã upload'
                                                }
                                            />
                                        </List.Item>
                                    )}
                                />
                            </div>
                        </Col>
                    </Row>
                )}
                
                <div style={{ textAlign: 'right', marginTop: '24px', borderTop: '1px solid #f0f0f0', paddingTop: '16px' }}>
                    <Space>
                        <Button onClick={handleCancel} disabled={loading || uploading}>
                            Hủy
                        </Button>
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={loading || uploading}
                            icon={<SaveOutlined />}
                        >
                            {uploading 
                                ? 'Đang upload...' 
                                : loading 
                                ? 'Đang xử lý...' 
                                : isEdit 
                                ? 'Cập nhật' 
                                : 'Tạo mới'
                            }
                        </Button>
                    </Space>
                </div>
            </Form>
        </Modal>
    );
};

export default CreateUpdateClassMaterial;