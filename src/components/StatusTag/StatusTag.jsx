import React from 'react';
import { Tag } from 'antd';

const StatusTag = ({ status, type, size = 'default' }) => {
    const getStatusConfig = () => {
        const configs = {
            // User Status
            userStatus: {
                1: { color: '#52c41a', backgroundColor: '#f6ffed', borderColor: '#b7eb8f', text: 'Hoạt động' },
                0: { color: '#ff4d4f', backgroundColor: '#fff2f0', borderColor: '#ffadb5', text: 'Không hoạt động' }
            },
            // User Types
            userType: {
                1: { color: '#ff4d4f', backgroundColor: '#fff2f0', borderColor: '#ffadb5', text: 'ADMIN' },
                2: { color: '#fa8c16', backgroundColor: '#fff7e6', borderColor: '#ffd591', text: 'MANAGER' },
                3: { color: '#1890ff', backgroundColor: '#f0f5ff', borderColor: '#91caff', text: 'USER' }
            },
            // Order Status (example for other tables)
            orderStatus: {
                1: { color: '#52c41a', backgroundColor: '#f6ffed', borderColor: '#b7eb8f', text: 'Hoàn thành' },
                2: { color: '#faad14', backgroundColor: '#fffbe6', borderColor: '#ffe58f', text: 'Đang xử lý' },
                3: { color: '#ff4d4f', backgroundColor: '#fff2f0', borderColor: '#ffadb5', text: 'Đã hủy' },
                0: { color: '#d9d9d9', backgroundColor: '#fafafa', borderColor: '#d9d9d9', text: 'Đã hủy' }
            },
            // Product Status
            productStatus: {
                1: { color: '#52c41a', backgroundColor: '#f6ffed', borderColor: '#b7eb8f', text: 'Còn hàng' },
                0: { color: '#ff4d4f', backgroundColor: '#fff2f0', borderColor: '#ffadb5', text: 'Hết hàng' }
            }
        };

        return configs[type] || {};
    };

    const config = getStatusConfig()[status];

    if (!config) {
        return <Tag>Không xác định</Tag>;
    }

    const tagStyle = {
        color: config.color,
        backgroundColor: config.backgroundColor,
        borderColor: config.borderColor,
        border: `1px solid ${config.borderColor}`,
        borderRadius: '4px',
        fontWeight: '500',
        fontSize: size === 'small' ? '11px' : '12px',
        padding: size === 'small' ? '0 4px' : '2px 8px',
        margin: '2px'
    };

    return (
        <Tag style={tagStyle}>
            {config.text}
        </Tag>
    );
};

export default StatusTag;