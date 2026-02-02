import React, { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Card, Spin, message } from 'antd';
import { actionGetDetailClass } from '../../../redux/class/actions';
import { 
    formatDate, 
    getStatusLabel, 
    CLASS_STATUS 
} from '../../../lib/common';

const BASE_IMG = '/icon/upload.png';

const DetailClass = ({ classId }) => {
    const dispatch = useDispatch();
    const { dataDetailClass, loading } = useSelector(state => state.classes);

    // Load class detail data
    const loadClassDetail = useCallback(async () => {
        if (!classId) return;

        try {
            await dispatch(actionGetDetailClass(classId));
        } catch (error) {
            message.error('Không thể tải thông tin lớp học');
            console.error('Error loading class detail:', error);
        }
    }, [dispatch, classId]);

    useEffect(() => {
        loadClassDetail();
    }, [loadClassDetail]);

    const getCurrentImage = () => {
        if (dataDetailClass?.image && dataDetailClass.image !== BASE_IMG) {
            if (dataDetailClass.image.startsWith('http')) {
                return dataDetailClass.image;
            } else {
                return `http://localhost:3000/image_class/${dataDetailClass.image.split('/').pop()}`;
            }
        }
        return null;
    };

    const getTeacherName = () => {
        if (dataDetailClass?.teacher) {
            return `${dataDetailClass.teacher.name} (${dataDetailClass.teacher.email})`;
        }
        return 'Chưa có giáo viên';
    };

    if (loading && !dataDetailClass) {
        return (
            <div className="flex items-center justify-center py-20">
                <Spin size="large" />
            </div>
        );
    }

    if (!dataDetailClass) {
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
                        {/* Class Image */}
                        <div className="w-24 h-24 bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-500 rounded-lg flex items-center justify-center text-white text-xl font-bold overflow-hidden shadow-lg ring-2 ring-white">
                            {currentImage ? (
                                <img
                                    src={currentImage}
                                    alt="Class Image"
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
                                {dataDetailClass.name?.charAt(0)?.toUpperCase() || 'C'}
                            </div>
                        </div>

                        {/* Class Info */}
                        <div className="text-center sm:text-left flex-1">
                            <h2 className="text-xl font-bold text-gray-900 mb-1">
                                {dataDetailClass.name}
                            </h2>
                            <p className="text-gray-600 mb-2">{getTeacherName()}</p>
                            <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                                <span className="inline-block px-3 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                                    {getStatusLabel(dataDetailClass.status, CLASS_STATUS)}
                                </span>
                                <span className="inline-block px-3 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                                    Mã lời mời: {dataDetailClass.invite_code}
                                </span>
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
                            <label className="font-medium text-gray-700 block">Tên lớp học</label>
                            <div className="bg-gray-50 rounded-md px-4 py-2 text-gray-900 border border-gray-200">
                                {dataDetailClass.name || 'Chưa cập nhật'}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="font-medium text-gray-700 block">Mã lời mời</label>
                            <div className="bg-gray-50 rounded-md px-4 py-2 text-gray-900 border border-gray-200">
                                {dataDetailClass.invite_code || 'Chưa có mã'}
                            </div>
                        </div>

                        <div className="space-y-2 lg:col-span-2">
                            <label className="font-medium text-gray-700 block">Mô tả</label>
                            <div className="bg-gray-50 rounded-md px-4 py-2 text-gray-900 border border-gray-200 min-h-[2.5rem]">
                                {dataDetailClass.description || 'Chưa cập nhật'}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="font-medium text-gray-700 block">Giáo viên phụ trách</label>
                            <div className="bg-gray-50 rounded-md px-4 py-2 text-gray-900 border border-gray-200">
                                {getTeacherName()}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="font-medium text-gray-700 block">Trạng thái</label>
                            <div className="bg-gray-50 rounded-md px-4 py-2 text-gray-900 border border-gray-200">
                                {getStatusLabel(dataDetailClass.status, CLASS_STATUS)}
                            </div>
                        </div>
                    </div>

                    {/* Metadata Information */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-6 border-t border-gray-200">
                        <div className="space-y-2">
                            <div className="text-sm">
                                <span className="font-medium text-gray-700">ID:</span>
                                <span className="ml-2 text-gray-900">{dataDetailClass.id}</span>
                            </div>
                            <div className="text-sm">
                                <span className="font-medium text-gray-700">Ngày tạo:</span>
                                <span className="ml-2 text-gray-900">
                                    {formatDate(dataDetailClass.createdAt)}
                                </span>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="text-sm">
                                <span className="font-medium text-gray-700">Lần cập nhật cuối:</span>
                                <span className="ml-2 text-gray-900">
                                    {formatDate(dataDetailClass.updatedAt)}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default DetailClass;