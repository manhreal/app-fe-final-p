import React from 'react';
import { useNavigate } from 'react-router-dom';

const BackButton2 = ({
    to,
    onClick,
    text = "← Về danh sách",
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
            navigate(-1); // Quay lại trang trước
        }
    };

    return (
        <div className="mb-4">
            <button
                onClick={handleClick}
                className={`text-blue-500 hover:text-blue-700 underline text-sm font-medium transition-colors ${className}`}
                {...props}
            >
                {text}
            </button>
        </div>
    );
};

export default BackButton2;
