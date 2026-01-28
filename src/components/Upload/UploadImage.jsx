import React, { useState } from 'react';
import { Modal, Button, Upload as AntUpload, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import ImgCrop from 'antd-img-crop';
import { validateImageFile } from '../../lib/common';

const UploadImage = ({
    visible,
    onCancel,
    onSave,
    title = "Cập nhật hình ảnh",
    loading = false,
    aspect = 16/10,
    quality = 0.8,
    rotationSlider = true,
    cropModalTitle = "Chỉnh sửa ảnh",
    supportedFormats = "Hỗ trợ định dạng: PNG, JPG, JPEG, WEBP (tối đa 10MB)"
}) => {
    const [tempFile, setTempFile] = useState(null);

    const handleUpload = async (file) => {
        const validation = validateImageFile(file);
        
        if (!validation.isValid) {
            message.error(validation.message);
            return false;
        }

        setTempFile(file);
        return false; // Prevent automatic upload
    };

    const handleSave = async () => {
        if (!tempFile) return;
        
        try {
            await onSave(tempFile);
            handleCancel();
        } catch (error) {
            console.error('Upload error:', error);
        }
    };

    const handleCancel = () => {
        setTempFile(null);
        onCancel();
    };

    return (
        <Modal
            title={title}
            open={visible}
            onCancel={handleCancel}
            footer={[
                <Button key="cancel" onClick={handleCancel}>
                    Hủy
                </Button>,
                <Button
                    key="save"
                    type="primary"
                    loading={loading}
                    disabled={!tempFile}
                    onClick={handleSave}
                    className="bg-blue-500 border-blue-500 hover:bg-blue-600"
                >
                    Lưu ảnh
                </Button>
            ]}
        >
            <div className="py-4">
                <ImgCrop
                    rotationSlider={rotationSlider}
                    aspect={aspect}
                    quality={quality}
                    modalTitle={cropModalTitle}
                    modalOk="Xác nhận"
                    modalCancel="Hủy"
                >
                    <AntUpload
                        listType="picture-card"
                        className="avatar-uploader"
                        showUploadList={false}
                        beforeUpload={handleUpload}
                        accept="image/*"
                    >
                        {tempFile ? (
                            <div className="flex flex-col items-center">
                                <img
                                    src={URL.createObjectURL(tempFile)}
                                    alt="preview"
                                    className="w-20 h-20 object-cover rounded-lg mb-2"
                                />
                                <span className="text-sm text-gray-600">Thay đổi</span>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center">
                                <UploadOutlined className="text-2xl text-gray-400 mb-2" />
                                <span className="text-sm text-gray-600">Chọn ảnh</span>
                            </div>
                        )}
                    </AntUpload>
                </ImgCrop>
                {supportedFormats && (
                    <p className="text-xs text-gray-500 mt-2 text-center">
                        {supportedFormats}
                    </p>
                )}
            </div>
        </Modal>
    );
};

export default UploadImage;