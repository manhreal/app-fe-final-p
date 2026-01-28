import React from 'react';
import { Button } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const BackButton1 = ({
    to,
    onClick,
    text = "Quay lại",
    className = "",
    ...props
}) => {
    const navigate = useNavigate();

    const handleClick = () => {
        if (onClick) {
            onClick();
        } else if (to) {
            navigate(to);
        } else {
            navigate(-1); // Go back to previous page
        }
    };

    return (
        <Button
            icon={<ArrowLeftOutlined />}
            onClick={handleClick}
            type="text"
            className={`hover:bg-gray-100 ${className}`}
            {...props}
        >
            {text}
        </Button>
    );
};

export default BackButton1;