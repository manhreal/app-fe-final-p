import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Form,
    Input,
    Select,
    Button,
    Upload,
    Image,
    message,
    Space,
    Card,
    Divider,
    Tabs
} from 'antd';
import {
    UploadOutlined,
    DeleteOutlined,
    PlusOutlined,
    MinusCircleOutlined,
    FileImageOutlined,
    FunctionOutlined,
    SaveOutlined,
    CloseOutlined
} from '@ant-design/icons';
import { actionGetDetailQuiz, actionUpdateQuiz, actionCreateQuiz } from '../../../redux/quiz/actions';
import { actionGetListQuizTypes } from '../../../redux/quiz_type/actions';
import { actionGetListQuizFormats } from '../../../redux/quiz_format/actions';
import { actionGetListQuizDifficulties } from '../../../redux/quiz_difficulty/actions';
import { uploadImageQuiz } from '../../../redux/upload/actions';
import {
    showErrorAlert,
    showSuccessToast,
    showWarningToast,
    showUpdateConfirmDialog
} from '../../../lib/sweetAlertConfig';
import BackButton2 from '../../../components/BackButton/BackButton2';
import Loading1 from "../../../components/common/Loading";
import LatexMathEditor from '../../../components/LatexMathEditor/LatexMathEditor';

const { Option } = Select;
const { TextArea } = Input;

const CreateUpdateQuiz = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams();
    const isEdit = Boolean(id);

    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [dataLoaded, setDataLoaded] = useState(false);

    const [quizTypes, setQuizTypes] = useState([]);
    const [quizFormats, setQuizFormats] = useState([]);
    const [quizDifficulties, setQuizDifficulties] = useState([]);

    const [metaParts, setMetaParts] = useState([]);
    const [assets, setAssets] = useState({ images: [] });
    const [answer, setAnswer] = useState('');
    const [initialValues, setInitialValues] = useState({});

    const [imageFiles, setImageFiles] = useState({});
    const [uploading, setUploading] = useState(false);
    
    // Latex Editor visibility state
    const [latexEditorVisible, setLatexEditorVisible] = useState(false);

    // Load filter data
    const loadFilterData = useCallback(async () => {
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
    }, [dispatch]);

    // Load detail data for edit mode
    const loadDetailData = useCallback(async () => {
        if (!isEdit || !id) return;

        setLoading(true);
        try {
            const result = await dispatch(actionGetDetailQuiz(id));
            console.log("Quiz detail: ", result);
            
            if (result) {
                const formValues = {
                    type_id: result.type_id,
                    format_id: result.format_id,
                    difficulty_id: result.difficulty_id,
                    content: result.content
                };

                form.setFieldsValue(formValues);
                setInitialValues(formValues);
                
                if (result.content_meta) {
                    const meta = typeof result.content_meta === 'string' 
                        ? JSON.parse(result.content_meta) 
                        : result.content_meta;
                    setMetaParts(meta.parts || []);
                }

                if (result.assets) {
                    const parsedAssets = typeof result.assets === 'string'
                        ? JSON.parse(result.assets)
                        : result.assets;
                    setAssets(parsedAssets || { images: [] });
                }

                if (result.answer) {
                    const answerData = typeof result.answer === 'string'
                        ? result.answer
                        : JSON.stringify(result.answer, null, 2);
                    setAnswer(answerData);
                }
                
                setDataLoaded(true);
            }
        } catch (error) {
            console.error('Error loading detail:', error);
            message.error('Lỗi khi tải thông tin câu hỏi');
        } finally {
            setLoading(false);
        }
    }, [dispatch, isEdit, id, form]);

    // Handle meta parts
    const handleAddMetaPart = useCallback(() => {
        setMetaParts([...metaParts, { key: '', content: '' }]);
    }, [metaParts]);

    const handleRemoveMetaPart = useCallback((index) => {
        const newParts = metaParts.filter((_, i) => i !== index);
        setMetaParts(newParts);
    }, [metaParts]);

    const handleMetaPartChange = useCallback((index, field, value) => {
        const newParts = [...metaParts];
        newParts[index][field] = value;
        setMetaParts(newParts);
    }, [metaParts]);

    // Handle image upload
    const handleImageUpload = useCallback(async (info, imageId) => {
        if (info.file.status === 'uploading') {
            setUploading(true);
            return;
        }

        if (info.file.status === 'done') {
            setUploading(false);
            const previewUrl = info.file.response?.data?.filePaths?.file;
            if (previewUrl) {
                setImageFiles(prev => ({
                    ...prev,
                    [imageId]: info.file.originFileObj
                }));

                const newImages = [...assets.images];
                const imgIndex = newImages.findIndex(img => img.id === imageId);
                
                if (imgIndex >= 0) {
                    newImages[imgIndex].url = previewUrl;
                } else {
                    newImages.push({
                        id: imageId,
                        url: previewUrl,
                        caption: '',
                        for: ''
                    });
                }
                
                setAssets({ ...assets, images: newImages });
            }
        }

        if (info.file.status === 'error') {
            setUploading(false);
            message.error('Tải ảnh lên thất bại!');
        }
    }, [assets]);

    const handleRemoveImage = useCallback((imageId) => {
        const newImages = assets.images.filter(img => img.id !== imageId);
        setAssets({ ...assets, images: newImages });
        
        setImageFiles(prev => {
            const newFiles = { ...prev };
            delete newFiles[imageId];
            return newFiles;
        });
        
        message.success('Đã xóa ảnh!');
    }, [assets]);

    const handleImageCaptionChange = useCallback((imageId, caption) => {
        const newImages = assets.images.map(img =>
            img.id === imageId ? { ...img, caption } : img
        );
        setAssets({ ...assets, images: newImages });
    }, [assets]);

    const handleImageForChange = useCallback((imageId, forValue) => {
        const newImages = assets.images.map(img =>
            img.id === imageId ? { ...img, for: forValue } : img
        );
        setAssets({ ...assets, images: newImages });
    }, [assets]);

    const beforeUpload = useCallback((file) => {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            message.error('Bạn chỉ có thể upload file JPG/PNG!');
            return false;
        }

        const isLt5M = file.size / 1024 / 1024 < 5;
        if (!isLt5M) {
            message.error('Ảnh phải nhỏ hơn 5MB!');
            return false;
        }

        return true;
    }, []);

    const customUpload = useCallback(async ({ file, onSuccess, onError }) => {
        try {
            const previewUrl = URL.createObjectURL(file);
            onSuccess({
                data: {
                    filePaths: {
                        file: previewUrl
                    }
                }
            });
        } catch (error) {
            console.error('Preview error:', error);
            onError(error);
        }
    }, []);

    // Validate form trước khi submit
    const validateFormBeforeSubmit = useCallback(async () => {
        try {
            await form.validateFields();
            return true;
        } catch (error) {
            console.log("Lỗi: ", error);
            return false;
        }
    }, [form]);

    // Handle form submission
    const handleSubmit = useCallback(async (values) => {
        setSubmitting(true);
        try {
            // Validate form trước khi submit
            const isFormValid = await validateFormBeforeSubmit();

            if (!isFormValid) {
                await showWarningToast('Vui lòng điền đầy đủ các trường bắt buộc và kiểm tra lại dữ liệu!');
                setSubmitting(false);
                return;
            }

            // Nếu là cập nhật, show confirm dialog
            if (isEdit) {
                const result = await showUpdateConfirmDialog('câu hỏi');

                if (!result.isConfirmed) {
                    setSubmitting(false);
                    return;
                }
            }

            // Upload all images
            const uploadedImages = await Promise.all(
                assets.images.map(async (img) => {
                    if (imageFiles[img.id] && img.url.startsWith('blob:')) {
                        const formData = new FormData();
                        formData.append('file', imageFiles[img.id]);
                        formData.append('type', 'quiz');

                        try {
                            const uploadedUrl = await dispatch(uploadImageQuiz(formData));
                            return { ...img, url: uploadedUrl };
                        } catch (error) {
                            console.error('Upload error for image:', img.id, error);
                            return img;
                        }
                    }
                    return img;
                })
            );

            // Parse answer if it's JSON string
            let parsedAnswer;
            try {
                parsedAnswer = JSON.parse(answer);
            } catch {
                parsedAnswer = answer;
            }

            const formData = {
                type_id: values.type_id,
                format_id: values.format_id,
                difficulty_id: values.difficulty_id,
                content: values.content,
                content_meta: metaParts.length > 0 ? { parts: metaParts } : null,
                assets: uploadedImages.length > 0 ? { images: uploadedImages } : null,
                answer: parsedAnswer
            };

            let result;
            if (isEdit) {
                result = await dispatch(actionUpdateQuiz(id, formData));
            } else {
                result = await dispatch(actionCreateQuiz(formData));
            }

            if (result?.success || result?.status === 200 || result) {
                await showSuccessToast(`${isEdit ? 'Cập nhật' : 'Tạo mới'} câu hỏi thành công`);
                navigate('/admin/quizs/list');
            } else {
                await showErrorAlert(result?.message || `${isEdit ? 'Cập nhật' : 'Tạo mới'} câu hỏi thất bại`);
            }
        } catch (error) {
            console.error('Submit error:', error);
            await showErrorAlert('Đã xảy ra lỗi, vui lòng thử lại');
        } finally {
            setSubmitting(false);
        }
    }, [dispatch, navigate, isEdit, id, assets, imageFiles, metaParts, answer, validateFormBeforeSubmit]);

    // Handle reset form
    const handleReset = useCallback(() => {
        form.setFieldsValue(initialValues);
    }, [form, initialValues]);

    const handleBackToList = useCallback(() => {
        navigate("/admin/quizs/list");
    }, [navigate]);

    // Latex Editor handlers
    const toggleLatexEditor = useCallback(() => {
        setLatexEditorVisible(prev => !prev);
    }, []);

    // Load data when component mounts
    useEffect(() => {
        loadFilterData();
        
        if (isEdit && id && !dataLoaded) {
            loadDetailData();
        }
    }, [isEdit, id, dataLoaded, loadFilterData, loadDetailData]);

    if (loading) {
        return <Loading1 />;
    }

    return (
        <Card className="mb-6 rounded-xl">
            <BackButton2
                onClick={handleBackToList}
                text="← Về danh sách câu hỏi"
            />
            
            {/* Header Section */}
            <div className="bg-white rounded-lg shadow-sm border mb-6 overflow-hidden">
                <div className="p-6">
                    <div className="flex flex-col sm:flex-row items-center gap-6">
                        {/* Icon */}
                        <div className="relative">
                            <div className="w-24 h-24 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-white text-xl font-bold overflow-hidden shadow-lg ring-2 ring-white">
                                <FunctionOutlined className="text-4xl" />
                            </div>
                        </div>

                        {/* Quiz Info */}
                        <div className="text-center sm:text-left flex-1">
                            <h2 className="text-xl font-bold text-gray-900 mb-1">
                                {isEdit ? (form.getFieldValue('content')?.substring(0, 50) || 'Cập nhật câu hỏi') : 'Tạo câu hỏi mới'}
                            </h2>
                            <p className="text-gray-600 mb-2">
                                {isEdit ? 'Chỉnh sửa thông tin câu hỏi' : 'Thêm câu hỏi mới vào hệ thống'}
                            </p>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2">
                            <Button
                                icon={<FunctionOutlined />}
                                onClick={toggleLatexEditor}
                                className={latexEditorVisible 
                                    ? "bg-purple-600 text-white border-purple-600 hover:bg-purple-700" 
                                    : "bg-purple-50 text-purple-600 border-purple-300 hover:bg-purple-100"
                                }
                            >
                                {latexEditorVisible ? 'Đóng LaTeX Editor' : 'Mở LaTeX Editor'}
                            </Button>
                            {isEdit && (
                                <Button
                                    icon={<CloseOutlined />}
                                    onClick={handleReset}
                                    className="border-gray-300 hover:border-gray-400"
                                >
                                    Reset lại
                                </Button>
                            )}
                            <Button
                                type="primary"
                                icon={<SaveOutlined />}
                                onClick={() => form.submit()}
                                loading={submitting}
                                className="bg-blue-600 hover:bg-blue-700 border-blue-600 hover:border-blue-700"
                            >
                                {isEdit ? 'Cập nhật' : 'Tạo mới'}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* LaTeX Editor Section */}
            {latexEditorVisible && (
                <Card className="shadow-sm border mb-6 bg-purple-50">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold text-purple-900">
                            <FunctionOutlined className="mr-2" />
                            LaTeX Math Editor
                        </h3>
                        <Button
                            icon={<CloseOutlined />}
                            onClick={toggleLatexEditor}
                            size="small"
                            className="text-purple-600 hover:text-purple-800"
                        >
                            Đóng
                        </Button>
                    </div>
                    <LatexMathEditor />
                </Card>
            )}

            {/* Form Section */}
            <Card className="shadow-sm border">
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                    className="space-y-6"
                >
                    <Tabs
                        defaultActiveKey="1"
                        items={[
                            {
                                key: '1',
                                label: 'Thông tin cơ bản',
                                children: (
                                    <>
                                        <div className="grid grid-cols-3 gap-4">
                                            <Form.Item
                                                label="Loại câu hỏi"
                                                name="type_id"
                                                rules={[{ required: true, message: 'Vui lòng chọn loại câu hỏi' }]}
                                            >
                                                <Select placeholder="Chọn loại">
                                                    {quizTypes.map(type => (
                                                        <Option key={type.id} value={type.id}>
                                                            {type.name}
                                                        </Option>
                                                    ))}
                                                </Select>
                                            </Form.Item>

                                            <Form.Item
                                                label="Định dạng"
                                                name="format_id"
                                                rules={[{ required: true, message: 'Vui lòng chọn định dạng' }]}
                                            >
                                                <Select placeholder="Chọn định dạng">
                                                    {quizFormats.map(format => (
                                                        <Option key={format.id} value={format.id}>
                                                            {format.name}
                                                        </Option>
                                                    ))}
                                                </Select>
                                            </Form.Item>

                                            <Form.Item
                                                label="Độ khó"
                                                name="difficulty_id"
                                                rules={[{ required: true, message: 'Vui lòng chọn độ khó' }]}
                                            >
                                                <Select placeholder="Chọn độ khó">
                                                    {quizDifficulties.map(diff => (
                                                        <Option key={diff.id} value={diff.id}>
                                                            {diff.name}
                                                        </Option>
                                                    ))}
                                                </Select>
                                            </Form.Item>
                                        </div>

                                        <Divider>Nội dung câu hỏi</Divider>

                                        <div className="space-y-3">
                                            <div className="flex justify-between items-center">
                                                <label className="font-medium text-gray-700">
                                                    Nội dung câu hỏi (Hỗ trợ LaTeX)
                                                </label>
                                                <Button
                                                    type="dashed"
                                                    size="small"
                                                    icon={<FunctionOutlined />}
                                                    onClick={toggleLatexEditor}
                                                    className="text-purple-600 border-purple-300"
                                                >
                                                    {latexEditorVisible ? 'Đóng' : 'Mở'} LaTeX Editor
                                                </Button>
                                            </div>
                                            <Form.Item
                                                name="content"
                                                rules={[{ required: true, message: 'Vui lòng nhập nội dung câu hỏi' }]}
                                                className="mb-0"
                                            >
                                                <TextArea
                                                    placeholder="Nhập nội dung câu hỏi. Sử dụng LaTeX Editor để tạo công thức toán học và dán vào đây."
                                                    rows={10}
                                                    className="font-mono"
                                                />
                                            </Form.Item>
                                            <div className="text-xs text-gray-500">
                                                <strong>Gợi ý:</strong> Sử dụng nút "Mở LaTeX Editor" ở trên để tạo công thức toán học, 
                                                sau đó copy và dán vào ô nhập liệu.
                                            </div>
                                        </div>
                                    </>
                                )
                            },
                            {
                                key: '2',
                                label: 'Phần bổ sung (Meta)',
                                children: (
                                    <div>
                                        <div className="flex justify-between items-center mb-4">
                                            <h4 className="font-medium">Các phần nhỏ của câu hỏi (A, B, C...)</h4>
                                            <Button
                                                type="dashed"
                                                icon={<PlusOutlined />}
                                                onClick={handleAddMetaPart}
                                            >
                                                Thêm phần
                                            </Button>
                                        </div>

                                        <Space direction="vertical" className="w-full" size="middle">
                                            {metaParts.map((part, index) => (
                                                <Card key={index} size="small">
                                                    <div className="flex gap-4 items-start">
                                                        <Input
                                                            placeholder="Key (a, b, c...)"
                                                            value={part.key}
                                                            onChange={(e) => handleMetaPartChange(index, 'key', e.target.value)}
                                                            className="w-24"
                                                        />
                                                        <div className="flex-1">
                                                            <TextArea
                                                                placeholder="Nội dung (hỗ trợ LaTeX - sử dụng LaTeX Editor)"
                                                                value={part.content}
                                                                onChange={(e) => handleMetaPartChange(index, 'content', e.target.value)}
                                                                rows={3}
                                                                className="font-mono"
                                                            />
                                                        </div>
                                                        <Button
                                                            danger
                                                            icon={<MinusCircleOutlined />}
                                                            onClick={() => handleRemoveMetaPart(index)}
                                                        />
                                                    </div>
                                                </Card>
                                            ))}
                                        </Space>

                                        {metaParts.length === 0 && (
                                            <div className="text-center text-gray-400 py-8">
                                                Chưa có phần bổ sung. Nhấn "Thêm phần" để thêm mới.
                                            </div>
                                        )}
                                    </div>
                                )
                            },
                            {
                                key: '3',
                                label: 'Hình ảnh & Tài nguyên',
                                children: (
                                    <div>
                                        <div className="flex justify-between items-center mb-4">
                                            <h4 className="font-medium">Hình ảnh đính kèm</h4>
                                            <Upload
                                                customRequest={(options) => customUpload(options)}
                                                beforeUpload={beforeUpload}
                                                onChange={(info) => handleImageUpload(info, Date.now())}
                                                showUploadList={false}
                                            >
                                                <Button icon={<UploadOutlined />} type="dashed">
                                                    Thêm ảnh
                                                </Button>
                                            </Upload>
                                        </div>

                                        <Space direction="vertical" className="w-full" size="middle">
                                            {assets.images.map((img) => (
                                                <Card key={img.id} size="small">
                                                    <div className="flex gap-4 items-start">
                                                        <Image
                                                            src={img.url}
                                                            alt="quiz image"
                                                            width={100}
                                                            height={100}
                                                            style={{ objectFit: 'cover', borderRadius: '4px' }}
                                                        />
                                                        <div className="flex-1">
                                                            <Input
                                                                placeholder="Chú thích ảnh"
                                                                value={img.caption}
                                                                onChange={(e) => handleImageCaptionChange(img.id, e.target.value)}
                                                                className="mb-2"
                                                            />
                                                            <Input
                                                                placeholder="Cho phần nào? (a, b, c...)"
                                                                value={img.for}
                                                                onChange={(e) => handleImageForChange(img.id, e.target.value)}
                                                            />
                                                        </div>
                                                        <Button
                                                            danger
                                                            icon={<DeleteOutlined />}
                                                            onClick={() => handleRemoveImage(img.id)}
                                                        />
                                                    </div>
                                                </Card>
                                            ))}
                                        </Space>

                                        {assets.images.length === 0 && (
                                            <div className="text-center text-gray-400 py-8">
                                                <FileImageOutlined style={{ fontSize: '48px' }} />
                                                <div className="mt-2">Chưa có hình ảnh. Nhấn "Thêm ảnh" để upload.</div>
                                            </div>
                                        )}
                                    </div>
                                )
                            },
                            {
                                key: '4',
                                label: 'Đáp án',
                                children: (
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center">
                                            <label className="font-medium text-gray-700">
                                                Đáp án (JSON hoặc text, hỗ trợ LaTeX)
                                            </label>
                                            <Button
                                                type="dashed"
                                                size="small"
                                                icon={<FunctionOutlined />}
                                                onClick={toggleLatexEditor}
                                                className="text-purple-600 border-purple-300"
                                            >
                                                {latexEditorVisible ? 'Đóng' : 'Mở'} LaTeX Editor
                                            </Button>
                                        </div>
                                        <TextArea
                                            placeholder='Nhập đáp án (JSON hoặc text, hỗ trợ LaTeX). Ví dụ: {"correct": "a", "explanation": "$x = 2$"}'
                                            rows={10}
                                            value={answer}
                                            onChange={(e) => setAnswer(e.target.value)}
                                            className="font-mono"
                                        />
                                        <div className="text-xs text-gray-500">
                                            Bạn có thể nhập JSON hoặc text thuần. Hỗ trợ LaTeX trong giải thích. 
                                            Sử dụng LaTeX Editor để tạo công thức và dán vào đây.
                                        </div>
                                    </div>
                                )
                            }
                        ]}
                    />
                </Form>
            </Card>
        </Card>
    );
};

export default CreateUpdateQuiz;