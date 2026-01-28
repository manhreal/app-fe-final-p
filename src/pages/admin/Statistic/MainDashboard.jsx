import React, { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Card, Row, Col, Button } from 'antd';
import {
    UserOutlined,
    FileTextOutlined,
    BookOutlined,
    TeamOutlined,
    ReloadOutlined
} from '@ant-design/icons';
import {
    actionGetTotalUsers,
    actionGetTotalQuizs,
    actionGetTotalExams,
    actionGetTotalClasses
} from '../../../redux/statistic/actions';
import LoadingSpinner from '../../../components/common/LoadingSpinner';
import { showSuccessToast, showErrorAlert } from '../../../lib/sweetAlertConfig';

const MainDashboard = () => {
    const dispatch = useDispatch();
    const { 
        dataTotalUsers, 
        dataTotalQuizs, 
        dataTotalExams, 
        dataTotalClasses,
        loadingUsers,
        loadingQuizs,
        loadingExams,
        loadingClasses
    } = useSelector(state => state.statistics);

    const fetchUsers = useCallback(async () => {
        try {
            await dispatch(actionGetTotalUsers());
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    }, [dispatch]);

    const fetchQuizs = useCallback(async () => {
        try {
            await dispatch(actionGetTotalQuizs());
        } catch (error) {
            console.error('Error fetching quizs:', error);
        }
    }, [dispatch]);

    const fetchExams = useCallback(async () => {
        try {
            await dispatch(actionGetTotalExams());
        } catch (error) {
            console.error('Error fetching exams:', error);
        }
    }, [dispatch]);

    const fetchClasses = useCallback(async () => {
        try {
            await dispatch(actionGetTotalClasses());
        } catch (error) {
            console.error('Error fetching classes:', error);
        }
    }, [dispatch]);

    const fetchAllData = useCallback(async () => {
        await Promise.all([
            fetchUsers(),
            fetchQuizs(),
            fetchExams(),
            fetchClasses()
        ]);
    }, [fetchUsers, fetchQuizs, fetchExams, fetchClasses]);

    const handleRefresh = useCallback(async () => {
        try {
            await fetchAllData();
            showSuccessToast('Đã làm mới dữ liệu');
        } catch (error) {
            console.error('Error refreshing:', error);
            await showErrorAlert('Đã xảy ra lỗi khi làm mới dữ liệu');
        }
    }, [fetchAllData]);

    useEffect(() => {
        fetchAllData();
    }, []);

    const statsCards = [
        {
            title: 'Tổng số người dùng',
            value: dataTotalUsers?.count || 0,
            icon: <UserOutlined />,
            iconBg: 'bg-blue-100',
            iconColor: 'text-blue-600',
            textColor: 'text-blue-600',
            loading: loadingUsers,
            key: 'users'
        },
        {
            title: 'Tổng số Quiz',
            value: dataTotalQuizs?.count || 0,
            icon: <FileTextOutlined />,
            iconBg: 'bg-green-100',
            iconColor: 'text-green-600',
            textColor: 'text-green-600',
            loading: loadingQuizs,
            key: 'quizs'
        },
        {
            title: 'Tổng số Exam',
            value: dataTotalExams?.count || 0,
            icon: <BookOutlined />,
            iconBg: 'bg-orange-100',
            iconColor: 'text-orange-600',
            textColor: 'text-orange-600',
            loading: loadingExams,
            key: 'exams'
        },
        {
            title: 'Tổng số lớp học',
            value: dataTotalClasses?.count || 0,
            icon: <TeamOutlined />,
            iconBg: 'bg-purple-100',
            iconColor: 'text-purple-600',
            textColor: 'text-purple-600',
            loading: loadingClasses,
            key: 'classes'
        }
    ];

    return (
        <div className="w-full max-w-full min-h-screen">
            <div className="mx-auto max-w-full lg:max-w-7xl">
                {/* Header */}
                <div className="mb-6 flex justify-between items-center flex-wrap gap-4">
                    <div>
                        <p className="text-gray-600">
                            Tổng quan hệ thống quản lý
                        </p>
                    </div>
                    <Button
                        type="primary"
                        icon={<ReloadOutlined />}
                        onClick={handleRefresh}
                        className="bg-blue-600 hover:bg-blue-700"
                    >
                        Làm mới
                    </Button>
                </div>

                {/* Statistics Cards */}
                <Row gutter={[16, 16]}>
                    {statsCards.map((stat) => (
                        <Col xs={24} sm={12} lg={6} key={stat.key}>
                            <Card
                                className="h-full shadow-sm hover:shadow-md transition-shadow duration-300"
                                bodyStyle={{ padding: '20px' }}
                            >
                                {stat.loading ? (
                                    <div className="h-32 flex items-center justify-center">
                                        <LoadingSpinner size={32} />
                                    </div>
                                ) : (
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <p className="text-gray-600 text-sm mb-2">
                                                {stat.title}
                                            </p>
                                            <div className={`text-3xl font-bold ${stat.textColor}`}>
                                                {stat.value}
                                            </div>
                                        </div>
                                        <div className={`w-14 h-14 ${stat.iconBg} rounded-lg flex items-center justify-center`}>
                                            <span className={`text-2xl ${stat.iconColor}`}>
                                                {stat.icon}
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </Card>
                        </Col>
                    ))}
                </Row>

                {/* Additional Info Section */}
                <Row gutter={[16, 16]} className="mt-6">
                    <Col xs={24}>
                        <Card
                            title={
                                <span className="text-lg font-semibold">
                                    Thông tin chi tiết
                                </span>
                            }
                            className="shadow-sm"
                        >
                            <Row gutter={[16, 16]}>
                                <Col xs={24} md={12}>
                                    <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
                                        <div className="flex items-center mb-3">
                                            <UserOutlined className="text-2xl text-blue-600 mr-3" />
                                            <h3 className="text-lg font-semibold text-gray-800">
                                                Người dùng
                                            </h3>
                                        </div>
                                        {loadingUsers ? (
                                            <LoadingSpinner size={24} />
                                        ) : (
                                            <div className="space-y-2 text-gray-700">
                                                <p>Tổng số: <span className="font-semibold text-gray-800">{dataTotalUsers?.count || 0}</span></p>
                                                {dataTotalUsers?.active !== undefined && (
                                                    <p>Đang hoạt động: <span className="font-semibold text-green-600">{dataTotalUsers.active}</span></p>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </Col>

                                <Col xs={24} md={12}>
                                    <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
                                        <div className="flex items-center mb-3">
                                            <FileTextOutlined className="text-2xl text-green-600 mr-3" />
                                            <h3 className="text-lg font-semibold text-gray-800">
                                                Quiz
                                            </h3>
                                        </div>
                                        {loadingQuizs ? (
                                            <LoadingSpinner size={24} />
                                        ) : (
                                            <div className="space-y-2 text-gray-700">
                                                <p>Tổng số: <span className="font-semibold text-gray-800">{dataTotalQuizs?.count || 0}</span></p>
                                                {dataTotalQuizs?.published !== undefined && (
                                                    <p>Đã xuất bản: <span className="font-semibold text-green-600">{dataTotalQuizs.published}</span></p>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </Col>

                                <Col xs={24} md={12}>
                                    <div className="p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg">
                                        <div className="flex items-center mb-3">
                                            <BookOutlined className="text-2xl text-orange-600 mr-3" />
                                            <h3 className="text-lg font-semibold text-gray-800">
                                                Exam
                                            </h3>
                                        </div>
                                        {loadingExams ? (
                                            <LoadingSpinner size={24} />
                                        ) : (
                                            <div className="space-y-2 text-gray-700">
                                                <p>Tổng số: <span className="font-semibold text-gray-800">{dataTotalExams?.count || 0}</span></p>
                                                {dataTotalExams?.active !== undefined && (
                                                    <p>Đang hoạt động: <span className="font-semibold text-orange-600">{dataTotalExams.active}</span></p>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </Col>

                                <Col xs={24} md={12}>
                                    <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg">
                                        <div className="flex items-center mb-3">
                                            <TeamOutlined className="text-2xl text-purple-600 mr-3" />
                                            <h3 className="text-lg font-semibold text-gray-800">
                                                Lớp học
                                            </h3>
                                        </div>
                                        {loadingClasses ? (
                                            <LoadingSpinner size={24} />
                                        ) : (
                                            <div className="space-y-2 text-gray-700">
                                                <p>Tổng số: <span className="font-semibold text-gray-800">{dataTotalClasses?.count || 0}</span></p>
                                                {dataTotalClasses?.active !== undefined && (
                                                    <p>Đang hoạt động: <span className="font-semibold text-purple-600">{dataTotalClasses.active}</span></p>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </Col>
                            </Row>
                        </Card>
                    </Col>
                </Row>
            </div>
        </div>
    );
};

export default MainDashboard;