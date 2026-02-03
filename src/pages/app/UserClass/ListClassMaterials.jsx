import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Table, Input, Button, Card, Space, Row, Col, Form, Select, Modal, Checkbox, List, Typography } from 'antd';
import { SearchOutlined, ReloadOutlined, FileOutlined, EyeOutlined, DownloadOutlined, FilePdfOutlined, FileImageOutlined, FileWordOutlined, FileExcelOutlined, FileTextOutlined } from '@ant-design/icons';
import { actionGetListClassMaterials } from '../../../redux/class_material/actions';
import { actionGetListClassMaterialCategories } from '../../../redux/class_material_category/actions';
import SimplePagination from '../../../components/Pagination/Pagination';
import { showErrorAlert, showSuccessToast, showWarningToast } from '../../../lib/sweetAlertConfig';

const { Option } = Select;
const { Title, Text } = Typography;

const DEFAULT_PAGINATION = {
    current: 1,
    pageSize: 10,
    total: 0
};

const ViewClassMaterials = ({ classId }) => {
    const dispatch = useDispatch();
    const { dataListClassMaterials, loading } = useSelector(state => state.classMaterials);
    const { dataListClassMaterialCategories } = useSelector(state => state.classMaterialCategories);
    
    const [form] = Form.useForm();
    const [pagination, setPagination] = useState(DEFAULT_PAGINATION);
    
    // File view modal states
    const [fileViewModalVisible, setFileViewModalVisible] = useState(false);
    const [selectedMaterial, setSelectedMaterial] = useState(null);
    const [selectedFiles, setSelectedFiles] = useState([]);

    const buildSearchParams = useCallback((formValues = {}, paginationInfo = pagination) => {
        const { title, teacher_name, category_id } = formValues;
        return {
            class_id: classId,
            ...(title && { title }),
            ...(teacher_name && { teacher_name }),
            ...(category_id && { category_id }),
            page: paginationInfo.current,
            limit: paginationInfo.pageSize
        };
    }, [pagination, classId]);

    const handleSearch = useCallback(async (resetPage = true) => {
        if (!classId) return;

        const formValues = form.getFieldsValue();
        const searchPagination = resetPage
            ? { ...pagination, current: 1 }
            : pagination;

        if (resetPage) {
            setPagination(searchPagination);
        }

        const params = buildSearchParams(formValues, searchPagination);

        try {
            const result = await dispatch(actionGetListClassMaterials(params));
            const total = result?.total || 0;

            setPagination(prev => ({
                ...prev,
                total,
                ...(resetPage && { current: 1 })
            }));
        } catch (error) {
            console.error('Error fetching class materials:', error);
            setPagination(prev => ({ ...prev, total: 0 }));
            await showErrorAlert('Đã xảy ra lỗi khi tải dữ liệu. Vui lòng thử lại.');
        }
    }, [dispatch, form, pagination, buildSearchParams, classId]);

    const handlePageChange = useCallback((page) => {
        const newPagination = { ...pagination, current: page };
        setPagination(newPagination);

        const formValues = form.getFieldsValue();
        const params = buildSearchParams(formValues, newPagination);
        dispatch(actionGetListClassMaterials(params));
    }, [dispatch, form, pagination, buildSearchParams]);

    const handleReset = useCallback(async () => {
        form.resetFields();
        setPagination(prev => ({ ...prev, current: 1 }));
        const params = { 
            class_id: classId,
            status: '1',
            page: 1, 
            limit: pagination.pageSize 
        };

        try {
            await dispatch(actionGetListClassMaterials(params));
            showSuccessToast('Đã đặt lại bộ lọc');
        } catch (error) {
            console.error('Reset error:', error);
        }
    }, [dispatch, form, pagination.pageSize, classId]);

    // File view modal handlers
    const handleView = useCallback((record) => {
        setSelectedMaterial(record);
        setSelectedFiles([]);
        setFileViewModalVisible(true);
    }, []);

    const handleCloseFileViewModal = useCallback(() => {
        setFileViewModalVisible(false);
        setSelectedMaterial(null);
        setSelectedFiles([]);
    }, []);

    const handleFileSelection = useCallback((fileUrl, checked) => {
        if (checked) {
            setSelectedFiles(prev => [...prev, fileUrl]);
        } else {
            setSelectedFiles(prev => prev.filter(url => url !== fileUrl));
        }
    }, []);

    const handleSelectAll = useCallback((checked) => {
        if (checked) {
            const allFiles = Array.isArray(selectedMaterial?.file_url) 
                ? selectedMaterial.file_url 
                : selectedMaterial?.file_url ? [selectedMaterial.file_url] : [];
            setSelectedFiles(allFiles);
        } else {
            setSelectedFiles([]);
        }
    }, [selectedMaterial]);

    const handleDownloadSelected = useCallback(() => {
        if (selectedFiles.length === 0) {
            showWarningToast('Vui lòng chọn ít nhất một file để tải xuống');
            return;
        }

        selectedFiles.forEach(fileUrl => {
            window.open(fileUrl, '_blank');
        });

        showSuccessToast(`Đang tải xuống ${selectedFiles.length} file`);
    }, [selectedFiles]);

    const truncateText = (text, maxLength = 100) => {
        if (!text) return '-';
        return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
    };

    const getFileIcon = (fileUrl) => {
        const extension = fileUrl.split('.').pop().toLowerCase();
        switch (extension) {
            case 'pdf':
                return <FilePdfOutlined style={{ color: '#ff4d4f' }} />;
            case 'doc':
            case 'docx':
                return <FileWordOutlined style={{ color: '#1890ff' }} />;
            case 'xls':
            case 'xlsx':
                return <FileExcelOutlined style={{ color: '#52c41a' }} />;
            case 'jpg':
            case 'jpeg':
            case 'png':
            case 'gif':
                return <FileImageOutlined style={{ color: '#722ed1' }} />;
            case 'txt':
                return <FileTextOutlined style={{ color: '#595959' }} />;
            default:
                return <FileOutlined style={{ color: '#8c8c8c' }} />;
        }
    };

    const getFileName = (fileUrl) => {
        return fileUrl.split('/').pop() || 'Unknown file';
    };

    const columns = useMemo(() => [
        {
            title: 'STT',
            key: 'stt',
            align: 'center',
            width: 60,
            render: (_, __, index) => (pagination.current - 1) * pagination.pageSize + index + 1
        },
        {
            title: 'Tiêu đề',
            dataIndex: 'title',
            key: 'title',
            width: 250,
            render: (title) => (
                <div title={title} className="font-medium">
                    {truncateText(title, 60)}
                </div>
            )
        },
        {
            title: 'Mô tả',
            dataIndex: 'description',
            key: 'description',
            width: 300,
            render: (description) => (
                <div title={description} className="text-gray-600">
                    {truncateText(description, 80)}
                </div>
            )
        },
        {
            title: 'Danh mục',
            dataIndex: ['category', 'name'],
            key: 'category_name',
            width: 150,
            render: (categoryName) => (
                <div className="text-blue-600">
                    {categoryName || '-'}
                </div>
            )
        },
        {
            title: 'Giáo viên',
            dataIndex: ['teacher', 'name'],
            key: 'teacher_name',
            width: 150,
            render: (teacherName) => (
                <div className="text-gray-700">
                    {teacherName || '-'}
                </div>
            )
        },
        {
            title: 'File đính kèm',
            dataIndex: 'file_url',
            key: 'file_url',
            width: 120,
            align: 'center',
            render: (fileUrls) => {
                const files = Array.isArray(fileUrls) ? fileUrls : (fileUrls ? [fileUrls] : []);
                return (
                    <div className="flex justify-center">
                        {files.length > 0 ? (
                            <div className="flex items-center space-x-2">
                                <FileOutlined className="text-blue-600" />
                                <span className="text-sm font-medium text-gray-600">
                                    {files.length} file{files.length > 1 ? 's' : ''}
                                </span>
                            </div>
                        ) : (
                            <span className="text-gray-400">-</span>
                        )}
                    </div>
                );
            }
        },
        {
            title: 'Ngày tạo',
            dataIndex: 'createdAt',
            key: 'createdAt',
            width: 120,
            render: (createdAt) => {
                return createdAt ? new Date(createdAt).toLocaleDateString('vi-VN') : '-';
            }
        },
        {
            title: 'Thao tác',
            key: 'actions',
            align: 'center',
            width: 100,
            fixed: 'right',
            render: (_, record) => (
                <Button
                    type="primary"
                    size="small"
                    icon={<EyeOutlined />}
                    onClick={() => handleView(record)}
                    className="bg-blue-600"
                >
                    Xem
                </Button>
            )
        }
    ], [pagination, handleView]);

    useEffect(() => {
        dispatch(actionGetListClassMaterialCategories());
        if (classId) {
            handleSearch(false);
        }
    }, [classId]);

    if (!classId) {
        return (
            <Card>
                <div className="text-center text-gray-500 py-8">
                    Vui lòng chọn lớp học để xem danh sách tài liệu
                </div>
            </Card>
        );
    }

    const modalFiles = selectedMaterial ? (
        Array.isArray(selectedMaterial.file_url) 
            ? selectedMaterial.file_url 
            : selectedMaterial.file_url ? [selectedMaterial.file_url] : []
    ) : [];

    const allFilesSelected = modalFiles.length > 0 && selectedFiles.length === modalFiles.length;
    const someFilesSelected = selectedFiles.length > 0 && selectedFiles.length < modalFiles.length;

    return (
        <div className="w-full max-w-full min-h-screen">
            <div className="mx-auto max-w-full lg:max-w-7xl">
                {/* Search Form */}
                <Card style={{ marginBottom: '16px' }} className="w-full">
                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={() => handleSearch(true)}
                        className="w-full"
                    >
                        <Row gutter={16}>
                            <Col xs={24} sm={12} md={8}>
                                <Form.Item label="Tiêu đề tài liệu" name="title">
                                    <Input
                                        placeholder="Nhập tiêu đề tài liệu"
                                        allowClear
                                    />
                                </Form.Item>
                            </Col>
                            <Col xs={24} sm={12} md={8}>
                                <Form.Item label="Tên giáo viên" name="teacher_name">
                                    <Input
                                        placeholder="Nhập tên giáo viên"
                                        allowClear
                                    />
                                </Form.Item>
                            </Col>
                            <Col xs={24} sm={12} md={8}>
                                <Form.Item label="Danh mục" name="category_id">
                                    <Select
                                        placeholder="Chọn danh mục"
                                        allowClear
                                    >
                                        {dataListClassMaterialCategories?.rows?.map(category => (
                                            <Option key={category.id} value={category.id}>
                                                {category.name}
                                            </Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row justify="start">
                            <Col>
                                <Space wrap>
                                    <Button
                                        type="primary"
                                        htmlType="submit"
                                        icon={<SearchOutlined />}
                                        loading={loading}
                                        className='bg-blue-600'
                                    >
                                        Tìm kiếm
                                    </Button>
                                    <Button
                                        icon={<ReloadOutlined />}
                                        onClick={handleReset}
                                    >
                                        Đặt lại
                                    </Button>
                                </Space>
                            </Col>
                        </Row>
                    </Form>
                </Card>

                {/* Data Table */}
                <Card
                    title="Tài liệu lớp học"
                    extra={
                        <span style={{ color: '#666' }}>
                            Tổng số: {pagination.total} tài liệu
                        </span>
                    }
                    className="w-full"
                >
                    <div className="w-full overflow-x-auto -mx-3 sm:mx-0 max-w-full">
                        <div className="px-3 sm:px-0">
                            <Table
                                columns={columns}
                                dataSource={dataListClassMaterials?.rows || []}
                                loading={loading}
                                rowKey="id"
                                pagination={false}
                                size="middle"
                                scroll={{ x: 1200 }}
                            />
                        </div>
                    </div>

                    <div style={{ marginTop: '16px' }} className="flex justify-end">
                        <SimplePagination
                            page={pagination.current}
                            total={pagination.total}
                            limit={pagination.pageSize}
                            onChange={handlePageChange}
                        />
                    </div>
                </Card>
            </div>

            {/* File View Modal */}
            <Modal
                title={
                    <div className="flex items-center space-x-2">
                        <FileOutlined className="text-blue-600" />
                        <span>Danh sách file tài liệu</span>
                    </div>
                }
                visible={fileViewModalVisible}
                onCancel={handleCloseFileViewModal}
                width={800}
                footer={[
                    <Button key="cancel" onClick={handleCloseFileViewModal}>
                        Đóng
                    </Button>,
                    <Button 
                        key="download" 
                        type="primary" 
                        icon={<DownloadOutlined />}
                        onClick={handleDownloadSelected}
                        disabled={selectedFiles.length === 0}
                        className="bg-blue-600"
                    >
                        Tải xuống ({selectedFiles.length})
                    </Button>
                ]}
            >
                {selectedMaterial && (
                    <div className="space-y-4">
                        {/* Material Info */}
                        <div className="p-4 bg-gray-50 rounded-lg">
                            <Title level={5} className="mb-2">{selectedMaterial.title}</Title>
                            {selectedMaterial.description && (
                                <Text type="secondary" className="block mb-2">
                                    <strong>Mô tả:</strong> {selectedMaterial.description}
                                </Text>
                            )}
                            {selectedMaterial.teacher?.name && (
                                <Text type="secondary" className="block mb-1">
                                    <strong>Giáo viên:</strong> {selectedMaterial.teacher.name}
                                </Text>
                            )}
                            {selectedMaterial.category?.name && (
                                <Text type="secondary" className="block">
                                    <strong>Danh mục:</strong> {selectedMaterial.category.name}
                                </Text>
                            )}
                        </div>

                        {/* Files List */}
                        {modalFiles.length > 0 ? (
                            <div>
                                <div className="flex items-center justify-between mb-3">
                                    <Title level={5} className="mb-0">
                                        Danh sách file ({modalFiles.length})
                                    </Title>
                                    <Checkbox
                                        checked={allFilesSelected}
                                        indeterminate={someFilesSelected}
                                        onChange={(e) => handleSelectAll(e.target.checked)}
                                    >
                                        Chọn tất cả
                                    </Checkbox>
                                </div>

                                <List
                                    size="small"
                                    dataSource={modalFiles}
                                    renderItem={(fileUrl, index) => (
                                        <List.Item
                                            key={index}
                                            className="border rounded-lg mb-2 p-3 hover:bg-gray-50 transition-colors"
                                        >
                                            <div className="flex items-center justify-between w-full">
                                                <div className="flex items-center space-x-3 flex-1">
                                                    <Checkbox
                                                        checked={selectedFiles.includes(fileUrl)}
                                                        onChange={(e) => handleFileSelection(fileUrl, e.target.checked)}
                                                    />
                                                    <div className="flex items-center space-x-2">
                                                        {getFileIcon(fileUrl)}
                                                        <span className="font-medium truncate max-w-xs">
                                                            {getFileName(fileUrl)}
                                                        </span>
                                                    </div>
                                                </div>
                                                <Button
                                                    type="text"
                                                    size="small"
                                                    icon={<EyeOutlined />}
                                                    onClick={() => window.open(fileUrl, '_blank')}
                                                    title="Xem trước"
                                                />
                                            </div>
                                        </List.Item>
                                    )}
                                />
                            </div>
                        ) : (
                            <div className="text-center text-gray-500 py-8">
                                <FileOutlined className="text-4xl mb-2" />
                                <p>Không có file đính kèm</p>
                            </div>
                        )}
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default ViewClassMaterials;