import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Table, Input, Button, Card, Space, Row, Col, Form, Tag, Select } from 'antd';
import { SearchOutlined, PlusOutlined, ReloadOutlined } from '@ant-design/icons';
import { actionGetListQuizs, actionDeleteQuiz } from '../../../redux/quiz/actions';
import { actionGetListQuizTypes } from '../../../redux/quiz_type/actions';
import { actionGetListQuizFormats } from '../../../redux/quiz_format/actions';
import { actionGetListQuizDifficulties } from '../../../redux/quiz_difficulty/actions';
import ActionEditDelete from '../../../components/ActionEditDelete';
import SimplePagination from '../../../components/Pagination/Pagination';
import QuizViewModal from '../../../components/QuizViewModal/QuizViewModal'; // Import component modal
import {
    showErrorAlert,
    showSuccessToast,
    showDeleteConfirmDialog
} from '../../../lib/sweetAlertConfig';

const { Option } = Select;

const DEFAULT_PAGINATION = {
    current: 1,
    pageSize: 10,
    total: 0
};

const ListQuizs = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { dataListQuizs, loading } = useSelector(state => state.quizs);
    const [form] = Form.useForm();
    const [pagination, setPagination] = useState(DEFAULT_PAGINATION);
    const [quizTypes, setQuizTypes] = useState([]);
    const [quizFormats, setQuizFormats] = useState([]);
    const [quizDifficulties, setQuizDifficulties] = useState([]);
    
    // State cho view modal
    const [viewModalVisible, setViewModalVisible] = useState(false);
    const [selectedQuiz, setSelectedQuiz] = useState(null);

    const buildSearchParams = useCallback((formValues = {}, paginationInfo = pagination) => {
        const { content, type_id, format_id, difficulty_id } = formValues;
        return {
            ...(content && { content }),
            ...(type_id && { type_id }),
            ...(format_id && { format_id }),
            ...(difficulty_id && { difficulty_id }),
            page: paginationInfo.current,
            limit: paginationInfo.pageSize
        };
    }, [pagination]);

    const loadFilterData = async () => {
        try {
            const [typesRes, formatsRes, difficultiesRes] = await Promise.all([
                dispatch(actionGetListQuizTypes({ page: 1, limit: 100 })),
                dispatch(actionGetListQuizFormats({ page: 1, limit: 100 })),
                dispatch(actionGetListQuizDifficulties({ page: 1, limit: 100 }))
            ]);

            if (typesRes?.rows) setQuizTypes(typesRes.rows);
            if (formatsRes?.rows) setQuizFormats(formatsRes.rows);
            if (difficultiesRes?.rows) setQuizDifficulties(difficultiesRes.rows);
        } catch (error) {
            console.error('Error loading filter data:', error);
        }
    };

    const handleSearch = useCallback(async (resetPage = true) => {
        const formValues = form.getFieldsValue();
        const searchPagination = resetPage
            ? { ...pagination, current: 1 }
            : pagination;

        if (resetPage) {
            setPagination(searchPagination);
        }

        const params = buildSearchParams(formValues, searchPagination);

        try {
            const result = await dispatch(actionGetListQuizs(params));
            const total = result?.total || 0;

            setPagination(prev => ({
                ...prev,
                total,
                ...(resetPage && { current: 1 })
            }));
        } catch (error) {
            console.error('Error fetching quizs:', error);
            setPagination(prev => ({ ...prev, total: 0 }));
            await showErrorAlert('Đã xảy ra lỗi khi tải dữ liệu. Vui lòng thử lại.');
        }
    }, [dispatch, form, pagination, buildSearchParams]);

    const handlePageChange = useCallback((page) => {
        const newPagination = { ...pagination, current: page };
        setPagination(newPagination);

        const formValues = form.getFieldsValue();
        const params = buildSearchParams(formValues, newPagination);
        dispatch(actionGetListQuizs(params));
    }, [dispatch, form, pagination, buildSearchParams]);

    const handleReset = useCallback(async () => {
        form.resetFields();
        setPagination(prev => ({ ...prev, current: 1 }));
        const params = { page: 1, limit: pagination.pageSize };

        try {
            await dispatch(actionGetListQuizs(params));
            showSuccessToast('Đã đặt lại bộ lọc');
        } catch (error) {
            console.error('Reset error:', error);
        }
    }, [dispatch, form, pagination.pageSize]);

    const handleView = useCallback((record) => {
        setSelectedQuiz(record);
        setViewModalVisible(true);
    }, []);

    const handleCloseViewModal = useCallback(() => {
        setViewModalVisible(false);
        setSelectedQuiz(null);
    }, []);

    const handleDelete = useCallback(async (record) => {
        const result = await showDeleteConfirmDialog(
            record.content?.substring(0, 50) || 'câu hỏi này',
            'câu hỏi'
        );

        if (!result.isConfirmed) return;

        try {
            const deleteResult = await dispatch(actionDeleteQuiz(record.id));

            if (deleteResult?.success || deleteResult?.status === 200 || deleteResult) {
                await showSuccessToast('Xóa câu hỏi thành công');
                handleSearch(true);
            } else {
                await showErrorAlert(deleteResult?.message || 'Xóa câu hỏi thất bại');
            }
        } catch (error) {
            console.error('Delete error:', error);
            await showErrorAlert('Đã xảy ra lỗi, vui lòng thử lại');
        }
    }, [dispatch, handleSearch]);

    const handleAddNew = useCallback(() => {
        navigate('/admin/quizs/add-quiz');
    }, [navigate]);

    const handleAddNewByAI = useCallback(() => {
        navigate('/admin/quizs/add-quiz-ai');
    }, [navigate]);

    const handleEdit = useCallback((record) => {
        navigate(`/admin/quizs/edit-quiz/${record.id}`);
    }, [navigate]);
    
    const truncateText = (text, maxLength = 100) => {
        if (!text) return '-';
        return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
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
            title: 'Nội dung câu hỏi',
            dataIndex: 'content',
            key: 'content',
            width: 300,
            render: (content) => (
                <div title={content} className="max-w-xs font-medium">
                    {truncateText(content, 100)}
                </div>
            )
        },
        {
            title: 'Loại câu hỏi',
            dataIndex: 'type',
            key: 'type',
            width: 150,
            render: (type) => (
                <Tag color="blue">
                    {type?.name || '-'}
                </Tag>
            )
        },
        {
            title: 'Định dạng',
            dataIndex: 'format',
            key: 'format',
            width: 150,
            render: (format) => (
                <Tag color="green">
                    {format?.name || '-'}
                </Tag>
            )
        },
        {
            title: 'Độ khó',
            dataIndex: 'difficulty',
            key: 'difficulty',
            width: 120,
            align: 'center',
            render: (difficulty) => {
                const colorMap = {
                    1: 'success',
                    2: 'warning',
                    3: 'error'
                };
                return (
                    <Tag color={colorMap[difficulty?.level] || 'default'}>
                        {difficulty?.name || '-'}
                    </Tag>
                );
            }
        },
        {
            title: 'Tác giả',
            dataIndex: 'author',
            key: 'author',
            width: 180,
            render: (author) => (
                <div className="space-y-1">
                    {author ? (
                        <>
                            <div className="font-medium text-gray-900">
                                {truncateText(author.name, 30)}
                            </div>
                            <div className="text-sm text-gray-500">
                                {truncateText(author.email, 35)}
                            </div>
                        </>
                    ) : (
                        <span className="text-gray-400">Chưa có</span>
                    )}
                </div>
            )
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
            width: 120,
            fixed: 'right',
            render: (_, record) => (
                <ActionEditDelete
                    onclickView={() => handleView(record)}
                    onclickEdit={() => handleEdit(record)}
                    onclickDelete={() => handleDelete(record)}
                    tooltipText={record.content?.substring(0, 50)}
                />
            )
        }
    ], [pagination, handleView, handleEdit, handleDelete]);

    useEffect(() => {
        loadFilterData();
        handleSearch(false);
    }, []);

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
                            <Col xs={24} sm={12} md={6}>
                                <Form.Item label="Nội dung" name="content">
                                    <Input
                                        placeholder="Tìm theo nội dung"
                                        allowClear
                                    />
                                </Form.Item>
                            </Col>
                            <Col xs={24} sm={12} md={6}>
                                <Form.Item label="Loại câu hỏi" name="type_id">
                                    <Select
                                        placeholder="Chọn loại"
                                        allowClear
                                    >
                                        {quizTypes.map(type => (
                                            <Option key={type.id} value={type.id}>
                                                {type.name}
                                            </Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col xs={24} sm={12} md={6}>
                                <Form.Item label="Định dạng" name="format_id">
                                    <Select
                                        placeholder="Chọn định dạng"
                                        allowClear
                                    >
                                        {quizFormats.map(format => (
                                            <Option key={format.id} value={format.id}>
                                                {format.name}
                                            </Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col xs={24} sm={12} md={6}>
                                <Form.Item label="Độ khó" name="difficulty_id">
                                    <Select
                                        placeholder="Chọn độ khó"
                                        allowClear
                                    >
                                        {quizDifficulties.map(diff => (
                                            <Option key={diff.id} value={diff.id}>
                                                {diff.name}
                                            </Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row justify="space-between" className="flex-wrap">
                            <Col className='md:mb-0 mb-4'>
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
                            <Col>
                                <Space wrap>
                                    <Button
                                        type="primary"
                                        icon={<PlusOutlined />}
                                        onClick={handleAddNewByAI}
                                        className='bg-blue-600'
                                    >
                                        Thêm với AI
                                    </Button>
                                    <Button
                                        type="primary"
                                        icon={<PlusOutlined />}
                                        onClick={handleAddNew}
                                        className='bg-green-600'
                                    >
                                        Thêm mới
                                    </Button>
                                </Space>
                            </Col>
                        </Row>
                    </Form>
                </Card>

                {/* Data Table */}
                <Card
                    title="Danh sách câu hỏi"
                    extra={
                        <span style={{ color: '#666' }}>
                            Tổng số: {pagination.total} câu hỏi
                        </span>
                    }
                    className="w-full"
                >
                    <div className="w-full overflow-x-auto -mx-3 sm:mx-0 max-w-full">
                        <div className="px-3 sm:px-0">
                            <Table
                                columns={columns}
                                dataSource={dataListQuizs?.rows || []}
                                loading={loading}
                                rowKey="id"
                                pagination={false}
                                size="middle"
                                scroll={{ x: 1400 }}
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

                {/* View Modal */}
                <QuizViewModal
                    visible={viewModalVisible}
                    quiz={selectedQuiz}
                    onClose={handleCloseViewModal}
                />
            </div>
        </div>
    );
};

export default ListQuizs;