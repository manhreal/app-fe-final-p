import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
    Card,
    Upload,
    Button,
    Table,
    Checkbox,
    Tag,
    Space,
    Modal,
    Typography,
    message,
    Divider,
    Alert,
    Collapse
} from 'antd';
import {
    UploadOutlined,
    RobotOutlined,
    CheckCircleOutlined,
    CloseCircleOutlined,
    EyeOutlined,
    SaveOutlined,
    DeleteOutlined
} from '@ant-design/icons';
import { 
    actionAIAnalyzeFile, 
    actionBatchCreateQuizzes 
} from '../../../redux/quiz/actions';
import { uploadFileQuizAI } from '../../../redux/upload/actions';
import { 
    showSuccessToast, 
} from '../../../lib/sweetAlertConfig';
import BackButton2 from '../../../components/BackButton/BackButton2';
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';

const { Title, Text, Paragraph } = Typography;
const { Panel } = Collapse;

const AIImportQuiz = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [file, setFile] = useState(null);
    const [analyzing, setAnalyzing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [analyzed, setAnalyzed] = useState(false);
    const [quizzes, setQuizzes] = useState([]);
    const [metadata, setMetadata] = useState({ types: [], formats: [], difficulties: [] });
    const [previewModal, setPreviewModal] = useState({ visible: false, quiz: null });

    // Xử lý upload file
    const handleFileChange = (info) => {
        const uploadedFile = info.file.originFileObj || info.file;
        setFile(uploadedFile);
        setAnalyzed(false);
        setQuizzes([]);
    };

    const beforeUpload = (file) => {
        const isPdfOrWord = 
            file.type === 'application/pdf' ||
            file.type === 'application/msword' ||
            file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
        
        if (!isPdfOrWord) {
            message.error('Chỉ chấp nhận file PDF hoặc Word!');
            return false;
        }

        const isLt10M = file.size / 1024 / 1024 < 10;
        if (!isLt10M) {
            message.error('File phải nhỏ hơn 10MB!');
            return false;
        }

        return false; // Prevent auto upload
    };

    // Phân tích file với AI (sử dụng upload action có sẵn)
    const handleAnalyze = async () => {
        if (!file) {
            message.warning('Vui lòng chọn file trước!');
            return;
        }

        setAnalyzing(true);
        try {
            // Bước 1: Upload file qua action có sẵn
            message.loading({ content: 'Đang upload file...', key: 'upload' });
            
            const fileUrl = await dispatch(uploadFileQuizAI(file));
            message.destroy('upload');
            
            if (!fileUrl) {
                throw new Error('Upload file thất bại');
            }
            
            console.log('✓ File uploaded:', fileUrl);
            
            // Bước 2: Gọi API phân tích với AI
            message.loading({ content: 'AI đang phân tích...', key: 'analyze' });
            
            const analyzeData = {
                fileUrl,
                fileName: file.name,
                mimeType: file.type
            };
            
            const result = await dispatch(actionAIAnalyzeFile(analyzeData));
            message.destroy('analyze');
            
            if (result) {
                setQuizzes(result.quizzes || []);
                setMetadata(result.metadata || { types: [], formats: [], difficulties: [] });
                setAnalyzed(true);
                message.success(`Phân tích thành công ${result.totalQuizzes} câu hỏi!`);
            } else {
                throw new Error('Phân tích thất bại');
            }
        } catch (error) {
            console.error('Analyze error:', error);
            message.destroy();
            const errorMsg = error?.message || error || 'Có lỗi xảy ra khi phân tích file';
            message.error(errorMsg);
        } finally {
            setAnalyzing(false);
        }
    };

    // Toggle chọn câu hỏi
    const handleToggleSelect = (tempId) => {
        setQuizzes(quizzes.map(q => 
            q.tempId === tempId ? { ...q, selected: !q.selected } : q
        ));
    };

    // Chọn/bỏ chọn tất cả
    const handleSelectAll = (checked) => {
        setQuizzes(quizzes.map(q => ({ ...q, selected: checked })));
    };

    // Xóa câu hỏi
    const handleRemove = (tempId) => {
        setQuizzes(quizzes.filter(q => q.tempId !== tempId));
    };

    // Preview chi tiết
    const handlePreview = (quiz) => {
        setPreviewModal({ visible: true, quiz });
    };

    // Lưu các câu hỏi đã chọn
    const handleSave = async () => {
        const selectedQuizzes = quizzes.filter(q => q.selected);
        
        if (selectedQuizzes.length === 0) {
            message.warning('Vui lòng chọn ít nhất 1 câu hỏi để lưu!');
            return;
        }

        setSaving(true);
        try {
            const result = await dispatch(actionBatchCreateQuizzes(selectedQuizzes));
            
            if (result) {
                await showSuccessToast(
                    `Đã lưu ${result.successCount || selectedQuizzes.length}/${result.total || selectedQuizzes.length} câu hỏi thành công!`
                );
                navigate('/admin/quizs/list');
            } else {
                throw new Error('Lưu thất bại');
            }
        } catch (error) {
            console.error('Save error:', error);
            const errorMsg = error?.message || error || 'Có lỗi xảy ra khi lưu câu hỏi';
            message.error(errorMsg);
        } finally {
            setSaving(false);
        }
    };

    // Render LaTeX
    const renderLatex = (text) => {
        if (!text) return null;
        
        try {
            // Tách text có chứa LaTeX
            const parts = text.split(/(\$\$[\s\S]+?\$\$|\$[^$]+?\$|\\[a-zA-Z]+\{[^}]*\})/g);
            
            return parts.map((part, index) => {
                if (part.startsWith('$$') && part.endsWith('$$')) {
                    return <BlockMath key={index} math={part.slice(2, -2)} />;
                } else if (part.startsWith('$') && part.endsWith('$')) {
                    return <InlineMath key={index} math={part.slice(1, -1)} />;
                } else if (part.startsWith('\\')) {
                    return <InlineMath key={index} math={part} />;
                }
                return <span key={index}>{part}</span>;
            });
        } catch (e) {
            console.error('LaTeX render error:', e);
            return text;
        }
    };

    // Lấy tên từ ID
    const getTypeName = (id) => metadata.types.find(t => t.id === id)?.name || 'N/A';
    const getFormatName = (id) => metadata.formats.find(f => f.id === id)?.name || 'N/A';
    const getDifficultyName = (id) => metadata.difficulties.find(d => d.id === id)?.name || 'N/A';

    // Columns cho table
    const columns = [
        {
            title: 'Chọn',
            key: 'select',
            width: 60,
            render: (_, record) => (
                <Checkbox
                    checked={record.selected}
                    onChange={() => handleToggleSelect(record.tempId)}
                />
            )
        },
        {
            title: 'Nội dung câu hỏi',
            key: 'content',
            render: (_, record) => (
                <div className="space-y-1">
                    <div className="font-medium">{renderLatex(record.content)}</div>
                    {record.content_meta?.parts && (
                        <div className="text-sm text-gray-600">
                            <Collapse size="small" ghost>
                                <Panel header={`${record.content_meta.parts.length} phần bổ sung`} key="1">
                                    {record.content_meta.parts.map((part, idx) => (
                                        <div key={idx}>
                                            <strong>{part.key}:</strong> {renderLatex(part.content)}
                                        </div>
                                    ))}
                                </Panel>
                            </Collapse>
                        </div>
                    )}
                </div>
            )
        },
        {
            title: 'Thông tin',
            key: 'info',
            width: 250,
            render: (_, record) => (
                <Space direction="vertical" size="small">
                    <Tag color="blue">{getTypeName(record.type_id)}</Tag>
                    <Tag color="green">{getFormatName(record.format_id)}</Tag>
                    <Tag color="orange">{getDifficultyName(record.difficulty_id)}</Tag>
                </Space>
            )
        },
        {
            title: 'Thao tác',
            key: 'action',
            width: 120,
            render: (_, record) => (
                <Space>
                    <Button
                        size="small"
                        icon={<EyeOutlined />}
                        onClick={() => handlePreview(record)}
                    >
                        Xem
                    </Button>
                    <Button
                        size="small"
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => handleRemove(record.tempId)}
                    />
                </Space>
            )
        }
    ];

    const selectedCount = quizzes.filter(q => q.selected).length;

    return (
        <Card className="mb-6 rounded-xl">
            <BackButton2
                onClick={() => navigate('/admin/quizs/list')}
                text="← Về danh sách câu hỏi"
            />

            {/* Header */}
            <div className="bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg shadow-sm p-6 mb-6 text-white">
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center">
                        <RobotOutlined className="text-4xl text-purple-600" />
                    </div>
                    <div>
                        <Title level={3} className="!text-white !mb-1">
                            AI Import - Tự động tạo câu hỏi
                        </Title>
                        <Text className="text-purple-100">
                            Upload file đề thi, AI sẽ tự động phân tích và tạo câu hỏi
                        </Text>
                    </div>
                </div>
            </div>

            {/* Upload Section */}
            <Card className="mb-6">
                <Title level={5}>Bước 1: Upload file đề thi</Title>
                <Alert
                    message="Lưu ý"
                    description="Hỗ trợ file PDF và Word (.doc, .docx). Kích thước tối đa 10MB. AI sẽ bỏ qua hình ảnh và đồ thị."
                    type="info"
                    showIcon
                    className="mb-4"
                />
                <Space direction="vertical" size="middle" className="w-full">
                    <Upload
                        beforeUpload={beforeUpload}
                        onChange={handleFileChange}
                        maxCount={1}
                        accept=".pdf,.doc,.docx"
                    >
                        <Button icon={<UploadOutlined />} size="large">
                            Chọn file đề thi
                        </Button>
                    </Upload>
                    
                    {file && (
                        <Alert
                            message={`File đã chọn: ${file.name}`}
                            type="success"
                            showIcon
                        />
                    )}

                    <Button
                        type="primary"
                        size="large"
                        icon={<RobotOutlined />}
                        onClick={handleAnalyze}
                        loading={analyzing}
                        disabled={!file}
                    >
                        {analyzing ? 'Đang phân tích với AI...' : 'Phân tích với AI'}
                    </Button>
                </Space>
            </Card>

            {/* Results Section */}
            {analyzed && quizzes.length > 0 && (
                <>
                    <Card className="mb-6">
                        <div className="flex justify-between items-center mb-4">
                            <Title level={5}>
                                Bước 2: Xem và chọn câu hỏi ({selectedCount}/{quizzes.length})
                            </Title>
                            <Space>
                                <Checkbox
                                    checked={quizzes.every(q => q.selected)}
                                    indeterminate={selectedCount > 0 && selectedCount < quizzes.length}
                                    onChange={(e) => handleSelectAll(e.target.checked)}
                                >
                                    Chọn tất cả
                                </Checkbox>
                                <Button
                                    type="primary"
                                    icon={<SaveOutlined />}
                                    onClick={handleSave}
                                    loading={saving}
                                    disabled={selectedCount === 0}
                                >
                                    Lưu {selectedCount} câu đã chọn
                                </Button>
                            </Space>
                        </div>

                        <Alert
                            message="Kiểm tra kỹ trước khi lưu"
                            description="AI có thể phân tích sai. Vui lòng xem chi tiết từng câu hỏi và bỏ chọn những câu không chính xác. Sau khi lưu, bạn vẫn có thể chỉnh sửa trong danh sách câu hỏi."
                            type="warning"
                            showIcon
                            className="mb-4"
                        />

                        <Table
                            dataSource={quizzes}
                            columns={columns}
                            rowKey="tempId"
                            pagination={{ pageSize: 10 }}
                        />
                    </Card>
                </>
            )}

            {analyzed && quizzes.length === 0 && (
                <Alert
                    message="Không tìm thấy câu hỏi"
                    description="AI không thể phát hiện câu hỏi nào trong file. Vui lòng thử file khác hoặc kiểm tra định dạng file."
                    type="warning"
                    showIcon
                />
            )}

            {/* Preview Modal */}
            <Modal
                title="Chi tiết câu hỏi"
                open={previewModal.visible}
                onCancel={() => setPreviewModal({ visible: false, quiz: null })}
                footer={null}
                width={800}
            >
                {previewModal.quiz && (
                    <div className="space-y-4">
                        <div>
                            <Text strong>Loại:</Text> <Tag color="blue">{getTypeName(previewModal.quiz.type_id)}</Tag>
                        </div>
                        <div>
                            <Text strong>Định dạng:</Text> <Tag color="green">{getFormatName(previewModal.quiz.format_id)}</Tag>
                        </div>
                        <div>
                            <Text strong>Độ khó:</Text> <Tag color="orange">{getDifficultyName(previewModal.quiz.difficulty_id)}</Tag>
                        </div>
                        
                        <Divider />
                        
                        <div>
                            <Text strong>Nội dung:</Text>
                            <Paragraph>{renderLatex(previewModal.quiz.content)}</Paragraph>
                        </div>

                        {previewModal.quiz.content_meta?.parts && (
                            <>
                                <Divider />
                                <div>
                                    <Text strong>Các phần bổ sung:</Text>
                                    {previewModal.quiz.content_meta.parts.map((part, idx) => (
                                        <div key={idx} className="ml-4 mt-2">
                                            <Text strong>{part.key}:</Text> {renderLatex(part.content)}
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}

                        {previewModal.quiz.answer && (
                            <>
                                <Divider />
                                <div>
                                    <Text strong>Đáp án:</Text>
                                    <pre className="bg-gray-100 p-3 rounded mt-2">
                                        {typeof previewModal.quiz.answer === 'object' 
                                            ? JSON.stringify(previewModal.quiz.answer, null, 2)
                                            : previewModal.quiz.answer
                                        }
                                    </pre>
                                </div>
                            </>
                        )}
                    </div>
                )}
            </Modal>
        </Card>
    );
};

export default AIImportQuiz;