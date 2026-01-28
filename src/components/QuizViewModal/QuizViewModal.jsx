import React from 'react';
import { Modal, Tag, Descriptions, Card, Divider } from 'antd';
import { 
    FileTextOutlined, 
    UserOutlined, 
    TagsOutlined, 
    CalendarOutlined,
    BarChartOutlined,
    AppstoreOutlined
} from '@ant-design/icons';
import LaTeXRenderer from '../LatexMathEditor/LaTeXRenderer';
const QuizViewModal = ({ visible, quiz, onClose }) => {
    if (!quiz) return null;

    const getDifficultyColor = (level) => {
        const colorMap = {
            1: 'success',
            2: 'warning', 
            3: 'error'
        };
        return colorMap[level] || 'default';
    };

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <Modal
            title={
                <div className="flex items-center gap-2">
                    <FileTextOutlined className="text-blue-600" />
                    <span className="font-bold text-lg">Chi tiết câu hỏi</span>
                </div>
            }
            open={visible}
            onCancel={onClose}
            footer={null}
            width={900}
            centered
        >
            <div className="space-y-4 py-4">
                {/* Nội dung câu hỏi */}
                <Card 
                    size="small"
                    title={
                        <span className="text-base font-semibold text-indigo-700">
                            <FileTextOutlined className="mr-2" />
                            Nội dung câu hỏi
                        </span>
                    }
                    className="shadow-sm"
                >
                    <div className="bg-gray-50 p-4 rounded border border-gray-200">
                        {/* Render content với LaTeX */}
                        <LaTeXRenderer
                            content={quiz.content}
                            fontSize={16}
                            fallbackText="Không có nội dung"
                        />
                    </div>
                </Card>

                <Divider className="my-4" />

                {/* Thông tin phân loại */}
                <Card 
                    size="small"
                    title={
                        <span className="text-base font-semibold text-indigo-700">
                            <AppstoreOutlined className="mr-2" />
                            Phân loại câu hỏi
                        </span>
                    }
                    className="shadow-sm"
                >
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <div className="text-xs text-gray-500 mb-2">Loại câu hỏi</div>
                            <Tag color="blue" className="text-sm px-3 py-1">
                                <TagsOutlined className="mr-1" />
                                {quiz.type?.name || '-'}
                            </Tag>
                            {quiz.type?.description && (
                                <div className="text-xs text-gray-600 mt-2">
                                    {quiz.type.description}
                                </div>
                            )}
                        </div>

                        <div>
                            <div className="text-xs text-gray-500 mb-2">Định dạng</div>
                            <Tag color="green" className="text-sm px-3 py-1">
                                <AppstoreOutlined className="mr-1" />
                                {quiz.format?.name || '-'}
                            </Tag>
                            {quiz.format?.description && (
                                <div className="text-xs text-gray-600 mt-2">
                                    {quiz.format.description}
                                </div>
                            )}
                        </div>

                        <div>
                            <div className="text-xs text-gray-500 mb-2">Độ khó</div>
                            <Tag 
                                color={getDifficultyColor(quiz.difficulty?.level)} 
                                className="text-sm px-3 py-1"
                            >
                                <BarChartOutlined className="mr-1" />
                                {quiz.difficulty?.name || '-'} (Cấp {quiz.difficulty?.level || '-'})
                            </Tag>
                            {quiz.difficulty?.description && (
                                <div className="text-xs text-gray-600 mt-2">
                                    {quiz.difficulty.description}
                                </div>
                            )}
                        </div>
                    </div>
                </Card>

                {/* Metadata nếu có */}
                {quiz.content_meta && Object.keys(quiz.content_meta).length > 0 && (
                    <>
                        <Divider className="my-4" />
                        <Card 
                            size="small"
                            title={
                                <span className="text-base font-semibold text-indigo-700">
                                    Metadata
                                </span>
                            }
                            className="shadow-sm"
                        >
                            <pre className="bg-gray-50 p-3 rounded text-xs overflow-auto">
                                {JSON.stringify(quiz.content_meta, null, 2)}
                            </pre>
                        </Card>
                    </>
                )}

                {/* Answer nếu có */}
                {quiz.answer && Object.keys(quiz.answer).length > 0 && (
                    <>
                        <Divider className="my-4" />
                        <Card 
                            size="small"
                            title={
                                <span className="text-base font-semibold text-indigo-700">
                                    Đáp án
                                </span>
                            }
                            className="shadow-sm"
                        >
                            <pre className="bg-gray-50 p-3 rounded text-xs overflow-auto">
                                {JSON.stringify(quiz.answer, null, 2)}
                            </pre>
                        </Card>
                    </>
                )}

                <Divider className="my-4" />

                {/* Thông tin tác giả */}
                <Card 
                    size="small"
                    title={
                        <span className="text-base font-semibold text-indigo-700">
                            <UserOutlined className="mr-2" />
                            Thông tin tác giả
                        </span>
                    }
                    className="shadow-sm"
                >
                    <Descriptions column={1} size="small">
                        <Descriptions.Item 
                            label={<span className="font-medium">Tên tác giả</span>}
                        >
                            <span className="text-gray-800">
                                {quiz.author?.name || 'Chưa có'}
                            </span>
                        </Descriptions.Item>
                        <Descriptions.Item 
                            label={<span className="font-medium">Email</span>}
                        >
                            <span className="text-gray-800">
                                {quiz.author?.email || 'Chưa có'}
                            </span>
                        </Descriptions.Item>
                        <Descriptions.Item 
                            label={<span className="font-medium">Số điện thoại</span>}
                        >
                            <span className="text-gray-800">
                                {quiz.author?.mobile || 'Chưa có'}
                            </span>
                        </Descriptions.Item>
                    </Descriptions>
                </Card>

                <Divider className="my-4" />

                {/* Thông tin thời gian */}
                <Card 
                    size="small"
                    title={
                        <span className="text-base font-semibold text-indigo-700">
                            <CalendarOutlined className="mr-2" />
                            Thông tin thời gian
                        </span>
                    }
                    className="shadow-sm"
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <div className="text-xs text-gray-500 mb-1">Ngày tạo</div>
                            <div className="text-sm font-medium text-gray-800">
                                {formatDate(quiz.createdAt)}
                            </div>
                        </div>
                        <div>
                            <div className="text-xs text-gray-500 mb-1">Ngày cập nhật</div>
                            <div className="text-sm font-medium text-gray-800">
                                {formatDate(quiz.updatedAt)}
                            </div>
                        </div>
                    </div>
                </Card>
            </div>
        </Modal>
    );
};

export default QuizViewModal;