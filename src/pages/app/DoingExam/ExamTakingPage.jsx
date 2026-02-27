import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Card, Button, Tag, Progress, Tooltip, Modal, message, Divider, Input,
} from 'antd';
import {
    CheckCircleFilled, ClockCircleOutlined, SendOutlined,
    LeftOutlined, RightOutlined, ArrowLeftOutlined,
    CheckOutlined, CloseOutlined, SwapOutlined,
    InfoCircleOutlined, PlusCircleOutlined, MinusCircleOutlined,
    WarningOutlined, TrophyOutlined, FileTextOutlined,
} from '@ant-design/icons';
import { renderSmartContent } from '../../../utils//utils_file';
import { actionGetListExamQuizs } from '../../../redux/exam_quiz/actions';
import { actionSubmitExam } from '../../../redux/exam/actions';

// ── Format colors ─────────────────────────────────────────────────────────────
const FORMAT_COLOR_MAP = {
    MCQ:   '#1677ff',
    MCQ_M: '#722ed1',
    TF:    '#13c2c2',
    FILL:  '#fa8c16',
    SHORT: '#eb2f96',
    ESSAY: '#52c41a',
    MATCH: '#faad14',
};
const getFormatColor = (code) => FORMAT_COLOR_MAP[code] || '#8c8c8c';

// ── Check if answer is filled ─────────────────────────────────────────────────
const isAnswerFilled = (answer, formatCode) => {
    if (!answer) return false;
    switch (formatCode) {
        case 'MCQ':   return !!answer.correct;
        case 'MCQ_M': return Array.isArray(answer.correct) && answer.correct.length > 0;
        case 'TF':    return Object.keys(answer).length > 0 && Object.values(answer).some(v => v !== undefined);
        case 'FILL':  return Array.isArray(answer.accepted) && answer.accepted.some(a => a?.trim());
        case 'SHORT': return !!(answer.answer?.trim());
        case 'ESSAY': return !!(answer.solution?.trim());
        case 'MATCH': return Array.isArray(answer.pairs) && answer.pairs.length > 0;
        default:      return false;
    }
};

// ── Answer Editors ────────────────────────────────────────────────────────────
const MCQEditor = ({ value = {}, onChange, metaParts = [] }) => {
    const options = metaParts.length > 0 ? metaParts : ['A','B','C','D'].map(k => ({ key: k, content: '' }));
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {options.map(opt => {
                const key = opt.key || opt;
                const content = opt.content || '';
                const selected = value?.correct === key;
                return (
                    <div key={key} onClick={() => onChange({ ...value, correct: key })} style={{
                        display: 'flex', alignItems: 'flex-start', gap: 12,
                        padding: '12px 16px', borderRadius: 10, cursor: 'pointer',
                        border: selected ? '2px solid #1677ff' : '1.5px solid #e8e8e8',
                        background: selected ? '#e6f4ff' : '#fafafa', transition: 'all 0.15s',
                    }}>
                        <div style={{
                            width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontWeight: 700, fontSize: 14,
                            background: selected ? '#1677ff' : 'white',
                            color: selected ? 'white' : '#595959',
                            border: selected ? 'none' : '1.5px solid #d9d9d9',
                        }}>{key}</div>
                        <div style={{ flex: 1, fontSize: 14, lineHeight: 1.6, paddingTop: 4 }}>
                            {content ? renderSmartContent(content) : <span style={{ color: '#bbb' }}>(Đáp án {key})</span>}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

const MCQMultiEditor = ({ value = {}, onChange, metaParts = [] }) => {
    const options = metaParts.length > 0 ? metaParts : ['A','B','C','D'].map(k => ({ key: k, content: '' }));
    const correct = Array.isArray(value?.correct) ? value.correct : [];
    const toggle = (key) => {
        const next = correct.includes(key) ? correct.filter(x => x !== key) : [...correct, key];
        onChange({ ...value, correct: next });
    };
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ fontSize: 12, color: '#8c8c8c', marginBottom: 4 }}>
                <InfoCircleOutlined style={{ marginRight: 4 }} />Có thể chọn nhiều đáp án
            </div>
            {options.map(opt => {
                const key = opt.key || opt;
                const content = opt.content || '';
                const selected = correct.includes(key);
                return (
                    <div key={key} onClick={() => toggle(key)} style={{
                        display: 'flex', alignItems: 'flex-start', gap: 12,
                        padding: '12px 16px', borderRadius: 10, cursor: 'pointer',
                        border: selected ? '2px solid #722ed1' : '1.5px solid #e8e8e8',
                        background: selected ? '#f9f0ff' : '#fafafa', transition: 'all 0.15s',
                    }}>
                        <div style={{
                            width: 32, height: 32, borderRadius: 6, flexShrink: 0,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontWeight: 700, fontSize: 14,
                            background: selected ? '#722ed1' : 'white',
                            color: selected ? 'white' : '#595959',
                            border: selected ? 'none' : '1.5px solid #d9d9d9',
                        }}>{selected ? <CheckOutlined /> : key}</div>
                        <div style={{ flex: 1, fontSize: 14, lineHeight: 1.6, paddingTop: 4 }}>
                            {content ? renderSmartContent(content) : <span style={{ color: '#bbb' }}>(Đáp án {key})</span>}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

const TFEditor = ({ value = {}, onChange, metaParts = [] }) => {
    if (metaParts.length === 0) return (
        <div style={{ padding: 16, background: '#fffbe6', border: '1px solid #ffe58f', borderRadius: 8, color: '#874d00', fontSize: 13 }}>
            <InfoCircleOutlined style={{ marginRight: 6 }} />Câu hỏi này chưa có mệnh đề.
        </div>
    );
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {metaParts.map(part => {
                const current = value[part.key];
                return (
                    <div key={part.key} style={{
                        display: 'flex', alignItems: 'flex-start', gap: 12,
                        padding: '12px 16px', borderRadius: 10,
                        border: current === true ? '2px solid #52c41a' : current === false ? '2px solid #ff4d4f' : '1.5px solid #e8e8e8',
                        background: current === true ? '#f6ffed' : current === false ? '#fff2f0' : '#fafafa',
                    }}>
                        <span style={{
                            width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
                            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                            background: '#e6e8ff', color: '#3730a3', fontWeight: 700, fontSize: 12
                        }}>{part.key.toUpperCase()}</span>
                        <div style={{ flex: 1, fontSize: 14, lineHeight: 1.6, paddingTop: 2 }}>
                            {renderSmartContent(part.content)}
                        </div>
                        <div style={{ display: 'flex', gap: 6, flexShrink: 0, paddingTop: 2 }}>
                            <button type="button" onClick={() => onChange({ ...value, [part.key]: true })} style={{
                                padding: '4px 12px', borderRadius: 6, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600,
                                background: current === true ? '#52c41a' : '#f0f0f0',
                                color: current === true ? 'white' : '#595959', transition: 'all 0.15s',
                            }}>✓ Đúng</button>
                            <button type="button" onClick={() => onChange({ ...value, [part.key]: false })} style={{
                                padding: '4px 12px', borderRadius: 6, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600,
                                background: current === false ? '#ff4d4f' : '#f0f0f0',
                                color: current === false ? 'white' : '#595959', transition: 'all 0.15s',
                            }}>✗ Sai</button>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

const ShortEditor = ({ value = {}, onChange }) => (
    <div>
        <div style={{ fontSize: 12, color: '#8c8c8c', marginBottom: 8 }}>
            <InfoCircleOutlined style={{ marginRight: 4 }} />Nhập đáp án ngắn gọn
        </div>
        <Input size="large" placeholder="Nhập đáp án..."
            value={value?.answer || ''}
            onChange={e => onChange({ ...value, answer: e.target.value })}
            style={{ fontFamily: 'monospace', fontSize: 15 }} />
    </div>
);

const FillEditor = ({ value = {}, onChange }) => {
    const accepted = value?.accepted || [''];
    return (
        <div>
            <div style={{ fontSize: 12, color: '#8c8c8c', marginBottom: 10 }}>
                <InfoCircleOutlined style={{ marginRight: 4 }} />Điền đáp án
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {accepted.map((entry, i) => (
                    <div key={i} style={{ display: 'flex', gap: 8 }}>
                        <Input placeholder={`Đáp án ${i + 1}`} value={entry}
                            onChange={e => {
                                const arr = [...accepted]; arr[i] = e.target.value;
                                onChange({ ...value, accepted: arr });
                            }} style={{ flex: 1, fontFamily: 'monospace' }} />
                        {accepted.length > 1 && (
                            <Button danger icon={<MinusCircleOutlined />}
                                onClick={() => onChange({ ...value, accepted: accepted.filter((_, idx) => idx !== i) })} />
                        )}
                    </div>
                ))}
                <Button type="dashed" icon={<PlusCircleOutlined />}
                    onClick={() => onChange({ ...value, accepted: [...accepted, ''] })}>
                    Thêm đáp án
                </Button>
            </div>
        </div>
    );
};

const EssayEditor = ({ value = {}, onChange }) => (
    <div>
        <div style={{ fontSize: 12, color: '#8c8c8c', marginBottom: 8 }}>
            <InfoCircleOutlined style={{ marginRight: 4 }} />Viết bài luận / lời giải
        </div>
        <Input.TextArea rows={8} placeholder="Nhập lời giải, bài làm..."
            value={value?.solution || ''}
            onChange={e => onChange({ ...value, solution: e.target.value })}
            style={{ fontFamily: 'monospace', fontSize: 14 }} />
    </div>
);

const MatchEditor = ({ value = {}, onChange }) => {
    const pairs = value?.pairs || [{ left: '', right: '' }];
    return (
        <div>
            <div style={{ fontSize: 12, color: '#8c8c8c', marginBottom: 10 }}>
                <InfoCircleOutlined style={{ marginRight: 4 }} />Nhập các cặp nối
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {pairs.map((pair, i) => (
                    <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                        <Input placeholder="Vế trái" value={pair.left}
                            onChange={e => { const arr = [...pairs]; arr[i] = { ...arr[i], left: e.target.value }; onChange({ ...value, pairs: arr }); }}
                            style={{ flex: 1 }} />
                        <SwapOutlined style={{ color: '#8c8c8c' }} />
                        <Input placeholder="Vế phải" value={pair.right}
                            onChange={e => { const arr = [...pairs]; arr[i] = { ...arr[i], right: e.target.value }; onChange({ ...value, pairs: arr }); }}
                            style={{ flex: 1 }} />
                        <Button danger size="small" icon={<MinusCircleOutlined />}
                            onClick={() => onChange({ ...value, pairs: pairs.filter((_, idx) => idx !== i) })} />
                    </div>
                ))}
                <Button type="dashed" onClick={() => onChange({ ...value, pairs: [...pairs, { left: '', right: '' }] })}>
                    + Thêm cặp
                </Button>
            </div>
        </div>
    );
};

const SmartAnswerEditor = ({ formatCode, value, onChange, metaParts }) => {
    switch (formatCode) {
        case 'MCQ':   return <MCQEditor value={value} onChange={onChange} metaParts={metaParts} />;
        case 'MCQ_M': return <MCQMultiEditor value={value} onChange={onChange} metaParts={metaParts} />;
        case 'TF':    return <TFEditor value={value} onChange={onChange} metaParts={metaParts} />;
        case 'SHORT': return <ShortEditor value={value} onChange={onChange} />;
        case 'FILL':  return <FillEditor value={value} onChange={onChange} />;
        case 'ESSAY': return <EssayEditor value={value} onChange={onChange} />;
        case 'MATCH': return <MatchEditor value={value} onChange={onChange} />;
        default:      return <ShortEditor value={value} onChange={onChange} />;
    }
};

// ── Timer ─────────────────────────────────────────────────────────────────────
const ExamTimer = ({ startTime, durationMinutes }) => {
    const [elapsed, setElapsed] = useState(0);
    useEffect(() => {
        const interval = setInterval(() => setElapsed(Math.floor((Date.now() - startTime) / 1000)), 1000);
        return () => clearInterval(interval);
    }, [startTime]);

    const remaining = durationMinutes ? Math.max(0, durationMinutes * 60 - elapsed) : null;
    const display = remaining !== null ? remaining : elapsed;
    const h = Math.floor(display / 3600);
    const m = Math.floor((display % 3600) / 60);
    const s = display % 60;
    const fmt = (n) => String(n).padStart(2, '0');
    const isWarning = remaining !== null && remaining < 300;
    const color = isWarning ? '#ff4d4f' : '#1677ff';

    return (
        <div style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '6px 14px', borderRadius: 20,
            background: isWarning ? '#fff2f0' : '#e6f4ff',
            border: `1px solid ${isWarning ? '#ffccc7' : '#bae0ff'}`,
            color, fontFamily: 'monospace', fontWeight: 700, fontSize: 16,
        }}>
            <ClockCircleOutlined />
            {h > 0 ? `${fmt(h)}:${fmt(m)}:${fmt(s)}` : `${fmt(m)}:${fmt(s)}`}
            {remaining !== null && <span style={{ fontSize: 11, fontFamily: 'sans-serif', fontWeight: 400, marginLeft: 2 }}>còn lại</span>}
        </div>
    );
};

// ── Main ──────────────────────────────────────────────────────────────────────
const ExamTakingPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { examEventId, examId } = useParams();

    const [quizRows, setQuizRows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [answers, setAnswers] = useState({});
    const [activeIdx, setActiveIdx] = useState(0);
    const [startTime] = useState(Date.now());
    const [submitted, setSubmitted] = useState(false);
    const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);

    // ── Quay về danh sách đề thi ──────────────────────────────────────────────
    const handleBackToList = useCallback(() => {
        navigate(`/my-exam-events/info-exam-event/${examEventId}`);
    }, [navigate, examEventId]);

    useEffect(() => {
        if (!examId) return;
        setLoading(true);
        dispatch(actionGetListExamQuizs({ exam_id: examId, page: 1, limit: 1000 }))
            .then(result => {
                const rows = (result?.rows || []).sort((a, b) => (a.order_number ?? 0) - (b.order_number ?? 0));
                setQuizRows(rows);
            })
            .catch(() => message.error('Lỗi khi tải câu hỏi'))
            .finally(() => setLoading(false));
    }, [examId, dispatch]);

    const activeQuiz = quizRows[activeIdx];
    const setAnswer = useCallback((id, val) => setAnswers(prev => ({ ...prev, [id]: val })), []);

    const stats = useMemo(() => {
        const total = quizRows.length;
        const done = quizRows.filter(q => isAnswerFilled(answers[q.id], q.format?.code)).length;
        const byFormat = quizRows.reduce((acc, q) => {
            const code = q.format?.code || '?';
            const name = q.format?.name || code;
            if (!acc[code]) acc[code] = { name, count: 0, done: 0, color: getFormatColor(code) };
            acc[code].count++;
            if (isAnswerFilled(answers[q.id], code)) acc[code].done++;
            return acc;
        }, {});
        return { total, done, byFormat };
    }, [quizRows, answers]);

    const handleSubmit = useCallback(async () => {
        setSubmitting(true);
        setShowSubmitConfirm(false);
        try {
            const payload = {
                exam_id: examId,
                answers: quizRows.map(q => ({
                    exam_quiz_id: q.id,
                    quiz_id: q.quiz_id,
                    answer: answers[q.id] || null,
                })),
                time_spent: Math.floor((Date.now() - startTime) / 1000),
            };
            await dispatch(actionSubmitExam(payload));
            setSubmitted(true);
        } catch (err) {
            console.error(err);
            message.error('Nộp bài thất bại, vui lòng thử lại');
        } finally {
            setSubmitting(false);
        }
    }, [dispatch, examId, quizRows, answers, startTime]);

    // ── Loading ───────────────────────────────────────────────────────────────
    if (loading) return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 300 }}>
            <div style={{ textAlign: 'center', color: '#8c8c8c' }}>
                <div style={{ fontSize: 32, marginBottom: 12 }}>⏳</div>
                <div>Đang tải câu hỏi...</div>
            </div>
        </div>
    );

    // ── Submitted ─────────────────────────────────────────────────────────────
    if (submitted) return (
        <div style={{ maxWidth: 560, margin: '60px auto', textAlign: 'center', padding: 40 }}>
            <div style={{ fontSize: 64, marginBottom: 16 }}>🎉</div>
            <h2 style={{ fontSize: 24, fontWeight: 700, color: '#1a1a2e', marginBottom: 8 }}>Nộp bài thành công!</h2>
            <p style={{ color: '#8c8c8c', marginBottom: 24 }}>Bài làm của bạn đã được ghi nhận.</p>
            <div style={{ padding: 24, borderRadius: 16, background: '#f0f9ff', border: '1px solid #bae0ff', marginBottom: 24 }}>
                <div style={{ fontSize: 14, color: '#595959', marginBottom: 4 }}>Số câu đã trả lời</div>
                <div style={{ fontSize: 42, fontWeight: 800, color: '#1677ff' }}>{stats.done} / {stats.total}</div>
            </div>
            <Button type="primary" size="large" onClick={handleBackToList}
                style={{ background: '#1677ff', borderRadius: 10, minWidth: 180 }}>
                Quay về danh sách đề thi
            </Button>
        </div>
    );

    const formatCode = activeQuiz?.format?.code;
    const metaParts = activeQuiz?.content_meta?.parts || [];
    const currentAnswer = answers[activeQuiz?.id] || {};
    const isFilled = isAnswerFilled(currentAnswer, formatCode);

    return (
        <div style={{ minHeight: '100vh', background: '#f5f5f7' }}>

            {/* ── Top Bar ── */}
            <div style={{
                position: 'sticky', top: 0, zIndex: 100,
                background: 'white', borderBottom: '1px solid #f0f0f0',
                padding: '10px 24px',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <Button icon={<ArrowLeftOutlined />} onClick={handleBackToList} style={{ borderRadius: 8 }}>
                        Quay lại
                    </Button>
                    <Tag color="blue" style={{ borderRadius: 20, fontWeight: 600 }}>
                        {stats.done}/{stats.total} câu
                    </Tag>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <ExamTimer startTime={startTime} />
                    <Button
                        type="primary"
                        icon={<SendOutlined />}
                        onClick={() => setShowSubmitConfirm(true)}
                        loading={submitting}
                        style={{
                            background: stats.done === stats.total ? '#52c41a' : '#1677ff',
                            border: 'none', borderRadius: 20, fontWeight: 600, paddingInline: 20,
                        }}
                    >
                        Nộp bài
                    </Button>
                </div>
            </div>

            <div style={{ display: 'flex', gap: 0, maxWidth: 1400, margin: '0 auto', padding: '20px 16px' }}>

                {/* ── Left Sidebar ── */}
                <div style={{
                    width: 280, flexShrink: 0, marginRight: 20,
                    position: 'sticky', top: 80, alignSelf: 'flex-start',
                    maxHeight: 'calc(100vh - 100px)', overflowY: 'auto',
                    display: 'flex', flexDirection: 'column', gap: 16,
                }}>
                    {/* Progress */}
                    <Card style={{ borderRadius: 16, border: '1px solid #f0f0f0' }} styles={{ body: { padding: 16 } }}>
                        <div style={{ fontSize: 12, fontWeight: 700, color: '#8c8c8c', marginBottom: 10, letterSpacing: 0.5 }}>
                            TIẾN ĐỘ LÀM BÀI
                        </div>
                        <Progress
                            percent={stats.total > 0 ? Math.round((stats.done / stats.total) * 100) : 0}
                            strokeColor={{ '0%': '#1677ff', '100%': '#52c41a' }}
                            style={{ marginBottom: 8 }}
                        />
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                            <span style={{ color: '#52c41a', fontWeight: 600 }}>
                                <CheckCircleFilled style={{ marginRight: 4 }} />{stats.done} đã làm
                            </span>
                            <span style={{ color: '#ff4d4f', fontWeight: 600 }}>
                                {stats.total - stats.done} chưa làm
                            </span>
                        </div>
                        <Divider style={{ margin: '12px 0' }} />
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                            {Object.entries(stats.byFormat).map(([code, { name, count, done, color }]) => (
                                <div key={code} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: color, flexShrink: 0 }} />
                                    <span style={{ flex: 1, fontSize: 11, color: '#595959', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                        {name}
                                    </span>
                                    <span style={{ fontSize: 11, fontWeight: 600, color: done === count ? '#52c41a' : '#1677ff' }}>
                                        {done}/{count}
                                    </span>
                                </div>
                            ))}
                        </div>
                        <Divider style={{ margin: '12px 0' }} />
                        <div style={{ display: 'flex', gap: 10, fontSize: 11, color: '#8c8c8c', flexWrap: 'wrap' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                <div style={{ width: 14, height: 14, borderRadius: 3, background: '#52c41a' }} />Đã làm
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                <div style={{ width: 14, height: 14, borderRadius: 3, background: '#e8e8e8', border: '1px solid #d9d9d9' }} />Chưa làm
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                <div style={{ width: 14, height: 14, borderRadius: 3, background: '#1677ff' }} />Đang xem
                            </div>
                        </div>
                    </Card>

                    {/* Question Grid */}
                    <Card style={{ borderRadius: 16, border: '1px solid #f0f0f0' }} styles={{ body: { padding: 16 } }}>
                        <div style={{ fontSize: 12, fontWeight: 700, color: '#8c8c8c', marginBottom: 10, letterSpacing: 0.5 }}>
                            DANH SÁCH CÂU HỎI
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                            {quizRows.map((q, idx) => {
                                const code = q.format?.code || '';
                                const color = getFormatColor(code);
                                const filled = isAnswerFilled(answers[q.id], code);
                                const isActive = idx === activeIdx;
                                return (
                                    <Tooltip key={q.id} title={
                                        <div style={{ fontSize: 12 }}>
                                            <div><b>Câu {idx + 1}</b> — Quiz #{q.quiz_id}</div>
                                            <div>{q.format?.name}</div>
                                            <div style={{ color: filled ? '#95de64' : '#ffc069' }}>
                                                {filled ? '✓ Đã trả lời' : '○ Chưa trả lời'}
                                            </div>
                                        </div>
                                    }>
                                        <div
                                            onClick={() => setActiveIdx(idx)}
                                            style={{
                                                width: 36, height: 36, borderRadius: 8,
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                fontSize: 12, fontWeight: 700, cursor: 'pointer', transition: 'all 0.15s',
                                                background: isActive ? '#1677ff' : filled ? '#52c41a' : '#f5f5f5',
                                                color: (isActive || filled) ? 'white' : '#595959',
                                                border: isActive ? '2px solid #0958d9' : filled ? '2px solid #389e0d' : `1.5px solid ${color}55`,
                                                boxShadow: isActive ? '0 2px 8px #1677ff50' : 'none',
                                                transform: isActive ? 'scale(1.1)' : 'none',
                                            }}
                                        >
                                            {idx + 1}
                                        </div>
                                    </Tooltip>
                                );
                            })}
                        </div>
                    </Card>
                </div>

                {/* ── Main Panel ── */}
                <div style={{ flex: 1, minWidth: 0 }}>
                    {activeQuiz && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                            {/* Question Card */}
                            <Card
                                style={{ borderRadius: 16, border: '1px solid #f0f0f0' }}
                                styles={{ body: { padding: '20px 24px' } }}
                                title={
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                                        <span style={{
                                            width: 36, height: 36, borderRadius: '50%',
                                            background: 'linear-gradient(135deg, #1677ff, #722ed1)',
                                            color: 'white', fontWeight: 800, fontSize: 15,
                                            display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                                        }}>{activeIdx + 1}</span>
                                        <Tag style={{ borderRadius: 20, background: `${getFormatColor(formatCode)}15`, color: getFormatColor(formatCode), border: `1px solid ${getFormatColor(formatCode)}40`, fontWeight: 600 }}>
                                            {activeQuiz.format?.name || formatCode}
                                        </Tag>
                                        <Tag color="default" style={{ borderRadius: 20 }}>
                                            {activeQuiz.difficulty?.name || ''}
                                        </Tag>
                                        {activeQuiz.is_required === 1 && <Tag color="red" style={{ borderRadius: 20 }}>Bắt buộc</Tag>}
                                        {activeQuiz.point > 0 && (
                                            <Tag color="gold" style={{ borderRadius: 20 }}>
                                                <TrophyOutlined style={{ marginRight: 3 }} />{activeQuiz.point} điểm
                                            </Tag>
                                        )}
                                        {isFilled && <Tag color="success" icon={<CheckCircleFilled />} style={{ borderRadius: 20 }}>Đã trả lời</Tag>}
                                    </div>
                                }
                                extra={
                                    <div style={{ display: 'flex', gap: 8 }}>
                                        <Button icon={<LeftOutlined />} disabled={activeIdx === 0} onClick={() => setActiveIdx(i => i - 1)} />
                                        <Button icon={<RightOutlined />} disabled={activeIdx === quizRows.length - 1} onClick={() => setActiveIdx(i => i + 1)} />
                                    </div>
                                }
                            >
                                <div style={{ padding: '16px 20px', borderRadius: 10, background: '#fafafa', border: '1px solid #f0f0f0', fontSize: 15, lineHeight: 1.8 }}>
                                    {renderSmartContent(activeQuiz.content)}
                                </div>
                                {activeQuiz.assets?.images?.map(img => (
                                    <div key={img.id} style={{ marginTop: 12 }}>
                                        <img src={img.url} alt={img.caption || ''} style={{ maxWidth: '100%', borderRadius: 8, border: '1px solid #f0f0f0' }} />
                                        {img.caption && <div style={{ fontSize: 12, color: '#8c8c8c', marginTop: 4, textAlign: 'center' }}>{img.caption}</div>}
                                    </div>
                                ))}
                            </Card>

                            {/* Answer Card */}
                            <Card
                                style={{ borderRadius: 16, border: '1px solid #f0f0f0' }}
                                styles={{ body: { padding: '20px 24px' } }}
                                title={<span style={{ fontWeight: 700, color: '#1a1a2e', fontSize: 14 }}>📝 Nhập đáp án</span>}
                                extra={
                                    answers[activeQuiz.id] && Object.keys(answers[activeQuiz.id]).length > 0 && (
                                        <Button size="small" danger type="text" icon={<CloseOutlined />}
                                            onClick={() => setAnswer(activeQuiz.id, {})}>
                                            Xóa đáp án
                                        </Button>
                                    )
                                }
                            >
                                <SmartAnswerEditor
                                    formatCode={formatCode}
                                    value={currentAnswer}
                                    onChange={(val) => setAnswer(activeQuiz.id, val)}
                                    metaParts={metaParts}
                                />
                            </Card>

                            {/* Navigation Footer */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 24 }}>
                                <Button size="large" icon={<LeftOutlined />} disabled={activeIdx === 0}
                                    onClick={() => setActiveIdx(i => i - 1)} style={{ borderRadius: 10 }}>
                                    Câu trước
                                </Button>
                                <span style={{ color: '#8c8c8c', fontSize: 13 }}>{activeIdx + 1} / {quizRows.length}</span>
                                {activeIdx < quizRows.length - 1 ? (
                                    <Button size="large" type="primary" onClick={() => setActiveIdx(i => i + 1)}
                                        style={{ borderRadius: 10, background: '#1677ff' }}>
                                        Câu tiếp <RightOutlined />
                                    </Button>
                                ) : (
                                    <Button size="large" type="primary" icon={<SendOutlined />}
                                        onClick={() => setShowSubmitConfirm(true)}
                                        style={{ borderRadius: 10, background: '#52c41a', border: 'none' }}>
                                        Nộp bài
                                    </Button>
                                )}
                            </div>
                        </div>
                    )}

                    {!activeQuiz && !loading && (
                        <Card style={{ borderRadius: 16, textAlign: 'center', padding: 40 }}>
                            <FileTextOutlined style={{ fontSize: 48, color: '#d9d9d9', marginBottom: 16, display: 'block' }} />
                            <div style={{ color: '#8c8c8c' }}>Không có câu hỏi nào trong đề thi này</div>
                        </Card>
                    )}
                </div>
            </div>

            {/* ── Submit Confirm Modal ── */}
            <Modal open={showSubmitConfirm} onCancel={() => setShowSubmitConfirm(false)} footer={null} centered width={480}>
                <div style={{ textAlign: 'center', padding: '8px 0' }}>
                    <div style={{ fontSize: 48, marginBottom: 12 }}>{stats.done === stats.total ? '✅' : '⚠️'}</div>
                    <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>Xác nhận nộp bài?</h3>
                    {stats.done < stats.total && (
                        <div style={{ padding: '12px 16px', borderRadius: 10, marginBottom: 16, background: '#fffbe6', border: '1px solid #ffe58f', color: '#874d00', fontSize: 14 }}>
                            <WarningOutlined style={{ marginRight: 6 }} />
                            Bạn còn <strong>{stats.total - stats.done}</strong> câu chưa trả lời
                        </div>
                    )}
                    <div style={{ color: '#595959', marginBottom: 24, fontSize: 14 }}>
                        Đã làm <strong style={{ color: '#1677ff' }}>{stats.done}</strong> / {stats.total} câu
                    </div>
                    <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
                        <Button size="large" onClick={() => setShowSubmitConfirm(false)} style={{ borderRadius: 10, minWidth: 100 }}>
                            Tiếp tục làm
                        </Button>
                        <Button size="large" type="primary" icon={<SendOutlined />} loading={submitting}
                            onClick={handleSubmit} style={{ background: '#1677ff', borderRadius: 10, minWidth: 120 }}>
                            Nộp bài
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default ExamTakingPage;