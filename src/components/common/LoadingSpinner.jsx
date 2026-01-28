import React from 'react';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

const LoadingSpinner = ({ size = 24, tip = '', className = '' }) => {
    const antIcon = <LoadingOutlined style={{ fontSize: size }} spin />;

    return (
        <div className={`flex items-center justify-center ${className}`}>
            <Spin indicator={antIcon} tip={tip} />
        </div>
    );
};

export default LoadingSpinner;