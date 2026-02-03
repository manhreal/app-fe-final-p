import React, { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Card, Spin, message } from 'antd';
import { actionGetDetailExamEvent } from '../../../redux/exam_event/actions';
import { 
    formatDate, 
    getStatusLabel, 
    CLASS_STATUS 
} from '../../../lib/common';

const BASE_IMG = '/icon/upload.png';

const DetailExamEvent = ({ examEventId }) => {
    const dispatch = useDispatch();
    const { dataDetailExamEvent, loading } = useSelector(state => state.examEvents);

    // Load exam event detail data
    const loadExamEventDetail = useCallback(async () => {
        if (!examEventId) return;

        try {
            await dispatch(actionGetDetailExamEvent(examEventId));
        } catch (error) {
            message.error('Không thể tải thông tin kỳ thi');
            console.error('Error loading exam event detail:', error);
        }
    }, [dispatch, examEventId]);

    useEffect(() => {
        loadExamEventDetail();
    }, [loadExamEventDetail]);

    const getCurrentImage = () => {
        if (dataDetailExamEvent?.image && dataDetailExamEvent.image !== BASE_IMG) {
            if (dataDetailExamEvent.image.startsWith('http')) {
                return dataDetailExamEvent.image;
            } else {
                return `http://localhost:3000/image_exam_event/${dataDetailExamEvent.image.split('/').pop()}`;
            }
        }
        return null;
    };

    const getCreatorName = () => {
        if (dataDetailExamEvent?.creator) {
            return `${dataDetailExamEvent.creator.name} (${dataDetailExamEvent.creator.email})`;
        }
        return 'Chưa có người tạo';
    };

    if (loading && !dataDetailExamEvent) {
        return (
            <div className="flex items-center justify-center py-20">
                <Spin size="large" />
            </div>
        );
    }

    if (!dataDetailExamEvent) {
        return (
            <Card className="mx-4 my-6">
                <div className="text-center py-8 text-gray-500">
                    Không tìm thấy thông tin
                </div>
            </Card>
        );
    }

    const currentImage = getCurrentImage();

    return (
        <div className="mx-auto">
            {/* Header Section with Image */}
            <div className="bg-white rounded-lg shadow-sm border mb-6 overflow-hidden">
                <div className="p-6">
                    <div className="flex flex-col sm:flex-row items-center gap-6">
                        {/* Exam Event Image */}
                        <div className="w-24 h-24 bg-gradient-to-br from-green-500 via-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-white text-xl font-bold overflow-hidden shadow-lg ring-2 ring-white">
                            {currentImage ? (
                                <img
                                    src={currentImage}
                                    alt="Exam Event Image"
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        e.target.style.display = 'none';
                                        e.target.nextSibling.style.display = 'flex';
                                    }}
                                />
                            ) : null}
                            <div
                                className={`w-full h-full flex items-center justify-center ${currentImage ? 'hidden' : ''}`}
                            >
                                {dataDetailExamEvent.name?.charAt(0)?.toUpperCase() || 'E'}
                            </div>
                        </div>

                        {/* Exam Event Info */}
                        <div className="text-center sm:text-left flex-1">
                            <h2 className="text-xl font-bold text-gray-900 mb-1">
                                {dataDetailExamEvent.name}
                            </h2>
                            <p className="text-gray-600 mb-2">{getCreatorName()}</p>
                            <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                                <span className="inline-block px-3 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                                    {getStatusLabel(dataDetailExamEvent.status, CLASS_STATUS)}
                                </span>
                                {dataDetailExamEvent.code && (
                                    <span className="inline-block px-3 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded-full">
                                        Mã kỳ thi: {dataDetailExamEvent.code}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Information Section */}
            <Card className="shadow-sm border">
                <div className="space-y-6">
                    {/* Basic Information */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="font-medium text-gray-700 block">Tên kỳ thi</label>
                            <div className="bg-gray-50 rounded-md px-4 py-2 text-gray-900 border border-gray-200">
                                {dataDetailExamEvent.name || 'Chưa cập nhật'}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="font-medium text-gray-700 block">Mã kỳ thi</label>
                            <div className="bg-gray-50 rounded-md px-4 py-2 text-gray-900 border border-gray-200">
                                {dataDetailExamEvent.code || 'Chưa có mã'}
                            </div>
                        </div>

                        <div className="space-y-2 lg:col-span-2">
                            <label className="font-medium text-gray-700 block">Mô tả</label>
                            <div className="bg-gray-50 rounded-md px-4 py-2 text-gray-900 border border-gray-200 min-h-[2.5rem]">
                                {dataDetailExamEvent.description || 'Chưa cập nhật'}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="font-medium text-gray-700 block">Người tạo</label>
                            <div className="bg-gray-50 rounded-md px-4 py-2 text-gray-900 border border-gray-200">
                                {getCreatorName()}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="font-medium text-gray-700 block">Trạng thái</label>
                            <div className="bg-gray-50 rounded-md px-4 py-2 text-gray-900 border border-gray-200">
                                {getStatusLabel(dataDetailExamEvent.status, CLASS_STATUS)}
                            </div>
                        </div>
                    </div>

                    {/* Metadata Information */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-6 border-t border-gray-200">
                        <div className="space-y-2">
                            <div className="text-sm">
                                <span className="font-medium text-gray-700">ID:</span>
                                <span className="ml-2 text-gray-900">{dataDetailExamEvent.id}</span>
                            </div>
                            <div className="text-sm">
                                <span className="font-medium text-gray-700">Ngày tạo:</span>
                                <span className="ml-2 text-gray-900">
                                    {formatDate(dataDetailExamEvent.createdAt)}
                                </span>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="text-sm">
                                <span className="font-medium text-gray-700">Lần cập nhật cuối:</span>
                                <span className="ml-2 text-gray-900">
                                    {formatDate(dataDetailExamEvent.updatedAt)}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default DetailExamEvent;