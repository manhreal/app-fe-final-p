import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { User, Mail, Phone, MapPin, Calendar, Shield, Edit3, Save, X, Camera, Upload } from 'lucide-react';
import { Modal, Upload as AntUpload, message, Button } from 'antd';
import { actionGetProfile, actionUpdateProfile } from '../../redux/auth/actions';
import { uploadImageProfile } from '../../redux/upload/actions';
import ImgCrop from 'antd-img-crop';

const BASE_IMG = '/icon/upload.png';

const Profile = () => {
    const dispatch = useDispatch();
    const { loading, error } = useSelector(state => state.auth || {});

    const [previewUrl, setPreviewUrl] = useState(null);
    const [profile, setProfile] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({});
    const [isSaving, setIsSaving] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [avatarModalVisible, setAvatarModalVisible] = useState(false);
    const [tempAvatarFile, setTempAvatarFile] = useState(null);

    useEffect(() => {
        loadProfile();
    }, []);

    useEffect(() => {
        return () => {
            if (previewUrl && previewUrl.startsWith('blob:')) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, [previewUrl]);

    const showMessage = (type, content) => {
        message[type](content);
    };

    const validateImageFile = (file) => {
        const allowedTypes = ['image/png', 'image/jpeg', 'image/webp', 'image/jpg'];
        const maxSize = 10 * 1024 * 1024;

        if (!allowedTypes.includes(file.type)) {
            showMessage('error', `${file.name} không phải là file ảnh hợp lệ (PNG, JPG, JPEG, WEBP)`);
            return false;
        }

        if (file.size > maxSize) {
            showMessage('error', "Kích thước file phải nhỏ hơn 10MB!");
            return false;
        }

        return true;
    };

    const generateAvatarFileName = (email) => {
        const emailPrefix = email.split('@')[0];
        const timestamp = new Date().getTime();
        return `avt-${emailPrefix}-${timestamp}`;
    };

    const handleAvatarUpload = async (file) => {
        if (!validateImageFile(file)) return false;
        setTempAvatarFile(file);
        return false; // Prevent auto upload
    };

    const handleAvatarSave = async () => {
        if (!tempAvatarFile || !profile?.email) return;

        setIsUploading(true);
        try {
            const customFileName = generateAvatarFileName(profile.email);
            const formData = new FormData();

            const fileExtension = tempAvatarFile.name.split('.').pop();
            const newFile = new File([tempAvatarFile], `${customFileName}.${fileExtension}`, {
                type: tempAvatarFile.type,
                lastModified: tempAvatarFile.lastModified,
            });

            formData.append('file', newFile);
            formData.append('oldAvatar', profile.avatar || '');

            const uploadedImagePath = await dispatch(uploadImageProfile(formData));

            if (uploadedImagePath) {
                // Update profile with new avatar
                const updateData = { ...profile, avatar: uploadedImagePath };
                const result = await dispatch(actionUpdateProfile(updateData));

                if (result) {
                    setProfile(result);
                    setAvatarModalVisible(false);
                    setTempAvatarFile(null);
                    showMessage('success', 'Cập nhật ảnh đại diện thành công!');
                }
            } else {
                throw new Error('Upload failed - no image path returned');
            }
        } catch (error) {
            console.error('Upload error:', error);
            showMessage('error', 'Lỗi khi upload ảnh: ' + (error.message || 'Unknown error'));
        } finally {
            setIsUploading(false);
        }
    };

    const loadProfile = async () => {
        try {
            const result = await dispatch(actionGetProfile());
            if (result) {
                setProfile(result);
                setEditData(result);
            }
        } catch (err) {
            console.error('Failed to load profile:', err);
        }
    };

    const handleEdit = () => {
        setIsEditing(true);
        setEditData({ ...profile });
    };

    const handleCancel = () => {
        setIsEditing(false);
        setEditData({ ...profile });
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const result = await dispatch(actionUpdateProfile(editData));
            if (result) {
                setProfile(result);
                setIsEditing(false);
                showMessage('success', 'Cập nhật thông tin thành công!');
            }
        } catch (err) {
            console.error('Failed to update profile:', err);
            showMessage('error', 'Cập nhật thất bại: ' + (err.message || 'Unknown error'));
        } finally {
            setIsSaving(false);
        }
    };

    const handleInputChange = (field, value) => {
        setEditData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getCurrentAvatar = () => {
        if (previewUrl) return previewUrl;
        if (profile?.avatar && profile.avatar !== BASE_IMG) {
            if (profile.avatar.startsWith('http')) {
                return profile.avatar;
            } else {
                return `http://localhost:3000/image_profile/${profile.avatar.split('/').pop()}`;
            }
        }
        return BASE_IMG;
    };

    if (!profile) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
                {/* <div className="text-center bg-white rounded-2xl shadow-xl p-8 max-w-md mx-4">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <X className="w-8 h-8 text-red-600" />
                    </div>
                    <h2 className="text-xl font-bold text-slate-900 mb-2">Không thể tải thông tin</h2>
                    <p className="text-slate-600 mb-6">Vui lòng thử lại sau</p>
                    <button
                        onClick={loadProfile}
                        className="px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    >
                        Thử lại
                    </button>
                </div> */}
            </div>
        );
    }

    return (
        <div className="min-h-screen py-6 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Header Section */}
                <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 mb-6 overflow-hidden relative">
                    {/* Avatar Section */}
                    <div className="p-8">
                        <div className="flex flex-col sm:flex-row items-center gap-6">
                            <div className="relative">
                                {/* Avatar container */}
                                <div className="w-28 h-28 bg-gradient-to-br from-indigo-500 via-purple-500 to-blue-500 rounded-md flex items-center justify-center text-white text-3xl font-bold overflow-hidden shadow-2xl ring-4 ring-white">
                                    {getCurrentAvatar() && getCurrentAvatar() !== BASE_IMG ? (
                                        <img
                                            src={getCurrentAvatar()}
                                            alt="Avatar"
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                e.target.style.display = 'none';
                                                e.target.nextSibling.style.display = 'flex';
                                            }}
                                        />
                                    ) : null}
                                    <div
                                        className={`w-full h-full flex items-center justify-center ${getCurrentAvatar() !== BASE_IMG ? 'hidden' : ''}`}
                                    >
                                        {profile.name?.charAt(0)?.toUpperCase() || 'U'}
                                    </div>
                                </div>

                                {/* Edit avatar button */}
                                <div className="absolute -bottom-2 -right-2">
                                    <button
                                        onClick={() => setAvatarModalVisible(true)}
                                        className="group w-10 h-10 rounded-full border-2 border-indigo-100 bg-white shadow-lg flex items-center justify-center hover:bg-indigo-50 transition-all duration-200 transform hover:scale-105"
                                    >
                                        <img
                                            src="/icon/edit_avt.png"
                                            alt="Edit Avatar"
                                            className="w-6 h-6 object-contain group-hover:opacity-80"
                                        />
                                    </button>
                                </div>
                            </div>

                            <div className="text-center sm:text-left flex-1">
                                <h2 className="text-2xl font-bold text-blue-800 mb-2">{profile.name}</h2>
                                <p className="text-slate-600 text-lg mb-4">{profile.email}</p>
                                <div className="flex flex-wrap justify-center sm:justify-start gap-3">
                                    <span className={`py-2 text-sm font-medium italic underline`}>
                                        {profile?.role?.name || "Không xác định"}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Action buttons */}
                        <div
                            className="
                mt-4 sm:mt-0 
                md:absolute md:bottom-4 md:right-4
                flex gap-2 justify-center md:justify-end
            "
                        >
                            {!isEditing ? (
                                <button
                                    onClick={handleEdit}
                                    className="flex items-center gap-2 px-4 py-2 bg-white text-slate-700 rounded-lg hover:bg-slate-100 transition-all duration-200 font-medium border border-slate-300 shadow-sm"
                                >
                                    <Edit3 size={16} />
                                    Chỉnh sửa
                                </button>
                            ) : (
                                <>
                                    <button
                                        onClick={handleCancel}
                                        disabled={isSaving}
                                            className="flex items-center gap-2 px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-all duration-200 disabled:opacity-50 border border-slate-300"
                                    >
                                        <X size={16} />
                                        Hủy
                                    </button>
                                    <button
                                        onClick={handleSave}
                                        disabled={isSaving}
                                        className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-all duration-200 disabled:opacity-50 border border-emerald-600"
                                    >
                                        {isSaving ? (
                                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                                        ) : (
                                            <Save size={16} />
                                        )}
                                        {isSaving ? 'Đang lưu...' : 'Lưu'}
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>


                {/* Profile Information */}
                <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 overflow-hidden">
                    <div className="p-8">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Name */}
                            <div className="space-y-3">
                                <label className="flex items-center gap-2 text-sm font-semibold text-blue-800">
                                    <User size={16} className="text-indigo-600" />
                                    Họ và tên
                                </label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        value={editData.name || ''}
                                        onChange={(e) => handleInputChange('name', e.target.value)}
                                        className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-indigo-500 focus:ring-0 transition-all duration-200 bg-white/50 backdrop-blur-sm text-slate-900 placeholder-slate-400"
                                        placeholder="Nhập họ và tên"
                                    />
                                ) : (
                                    <div className="bg-slate-50/50 rounded-xl px-4 py-3 text-slate-900 border border-slate-200">
                                        {profile.name}
                                    </div>
                                )}
                            </div>

                            {/* Email */}
                            <div className="space-y-3">
                                <label className="flex items-center gap-2 text-sm font-semibold text-blue-800">
                                    <Mail size={16} className="text-indigo-600" />
                                    Email
                                </label>
                                <div className="bg-slate-50/50 rounded-xl px-4 py-3 text-slate-900 border border-slate-200">
                                    {profile.email}
                                </div>
                            </div>

                            {/* Mobile */}
                            <div className="space-y-3">
                                <label className="flex items-center gap-2 text-sm font-semibold text-blue-800">
                                    <Phone size={16} className="text-indigo-600" />
                                    Số điện thoại
                                </label>
                                {isEditing ? (
                                    <input
                                        type="tel"
                                        value={editData.mobile || ''}
                                        onChange={(e) => handleInputChange('mobile', e.target.value)}
                                        className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-indigo-500 focus:ring-0 transition-all duration-200 bg-white/50 backdrop-blur-sm text-slate-900 placeholder-slate-400"
                                        placeholder="Nhập số điện thoại"
                                    />
                                ) : (
                                    <div className="bg-slate-50/50 rounded-xl px-4 py-3 text-slate-900 border border-slate-200">
                                        {profile.mobile || 'Chưa cập nhật'}
                                    </div>
                                )}
                            </div>

                            {/* City */}
                            <div className="space-y-3">
                                <label className="flex items-center gap-2 text-sm font-semibold text-blue-800">
                                    <MapPin size={16} className="text-indigo-600" />
                                    Thành phố
                                </label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        value={editData.city || ''}
                                        onChange={(e) => handleInputChange('city', e.target.value)}
                                        className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-indigo-500 focus:ring-0 transition-all duration-200 bg-white/50 backdrop-blur-sm text-slate-900 placeholder-slate-400"
                                        placeholder="Nhập thành phố"
                                    />
                                ) : (
                                    <div className="bg-slate-50/50 rounded-xl px-4 py-3 text-slate-900 border border-slate-200">
                                        {profile.city || 'Chưa cập nhật'}
                                    </div>
                                )}
                            </div>

                            {/* Address */}
                            <div className="space-y-3 lg:col-span-2">
                                <label className="flex items-center gap-2 text-sm font-semibold text-blue-800">
                                    <MapPin size={16} className="text-indigo-600" />
                                    Địa chỉ
                                </label>
                                {isEditing ? (
                                    <textarea
                                        value={editData.address || ''}
                                        onChange={(e) => handleInputChange('address', e.target.value)}
                                        className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-indigo-500 focus:ring-0 transition-all duration-200 bg-white/50 backdrop-blur-sm text-slate-900 placeholder-slate-400 resize-none"
                                        rows="3"
                                        placeholder="Nhập địa chỉ"
                                    />
                                ) : (
                                    <div className="bg-slate-50/50 rounded-xl px-4 py-3 text-slate-900 border border-slate-200 min-h-[3rem]">
                                        {profile.address || 'Chưa cập nhật'}
                                    </div>
                                )}
                            </div>

                            {/* Created At */}
                            <div className="space-y-3 lg:col-span-2">
                                <label className="flex items-center gap-2 text-sm font-semibold text-blue-800">
                                    <Calendar size={16} className="text-indigo-600" />
                                    Ngày tạo tài khoản
                                </label>
                                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl px-4 py-3 text-slate-900 border border-indigo-200">
                                    {formatDate(profile.createdAt)}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Error Display */}
                {error && (
                    <div className="mt-6 bg-red-50/80 backdrop-blur-sm border-2 border-red-200 rounded-2xl p-6">
                        <p className="text-red-800 font-medium">{error}</p>
                    </div>
                )}
            </div>

            {/* Avatar Upload Modal */}
            <Modal
                title="Cập nhật ảnh đại diện"
                open={avatarModalVisible}
                onCancel={() => {
                    setAvatarModalVisible(false);
                    setTempAvatarFile(null);
                }}
                footer={[
                    <Button key="cancel" onClick={() => {
                        setAvatarModalVisible(false);
                        setTempAvatarFile(null);
                    }}>
                        Hủy
                    </Button>,
                    <Button
                        key="save"
                        type="primary"
                        loading={isUploading}
                        disabled={!tempAvatarFile}
                        onClick={handleAvatarSave}
                        className="!bg-blue-500 !border-blue-500 hover:!bg-blue-600 !text-white"
                    >
                        Lưu ảnh
                    </Button>
                ]}
                className="avatar-modal"
            >
                <div className="py-4">
                    <ImgCrop
                        rotationSlider
                        aspect={1}
                        quality={0.8}
                        modalTitle="Chỉnh sửa ảnh"
                        modalOk="Xác nhận"
                        modalCancel="Hủy"
                    >
                        <AntUpload
                            listType="picture-card"
                            className="avatar-uploader"
                            showUploadList={false}
                            beforeUpload={handleAvatarUpload}
                            accept="image/*"
                        >
                            {tempAvatarFile ? (
                                <div className="flex flex-col items-center">
                                    <img
                                        src={URL.createObjectURL(tempAvatarFile)}
                                        alt="preview"
                                        className="w-20 h-20 object-cover rounded-lg mb-2"
                                    />
                                    <span className="text-sm text-slate-600">Thay đổi</span>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center">
                                    <Upload className="w-8 h-8 text-slate-400 mb-2" />
                                    <span className="text-sm text-slate-600">Chọn ảnh</span>
                                </div>
                            )}
                        </AntUpload>
                    </ImgCrop>
                    <p className="text-xs text-slate-500 mt-2 text-center">
                        Hỗ trợ định dạng: PNG, JPG, JPEG, WEBP (tối đa 10MB)
                    </p>
                </div>
            </Modal>
        </div>
    );
};

export default Profile;