import { useEffect, useState, useCallback } from "react";
import { useDispatch } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { Card, Tabs, Spin } from "antd";
import { actionGetDetailUser } from "../../../redux/user/actions";
import DetailUser from "./DetailUser";
import Loading1 from "../../../components/common/Loading";
import BackButton2 from "../../../components/BackButton/BackButton2";

const { TabPane } = Tabs;

function InfoUser() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id: userId } = useParams();
    const [loading, setLoading] = useState(false);
    const [userData, setUserData] = useState(null);
    const [activeTab, setActiveTab] = useState("info");

    // Lấy thông tin chi tiết user
    const fetchUserDetail = useCallback(async () => {
        try {
            setLoading(true);
            const result = await dispatch(actionGetDetailUser(userId));
            if (result) {
                setUserData(result);
            }
        } catch (error) {
            console.error("Error loading user:", error);
        } finally {
            setLoading(false);
        }
    }, [dispatch, userId]);

    useEffect(() => {
        if (userId) {
            fetchUserDetail();
        }
    }, [userId, fetchUserDetail]);

    // Quay về danh sách người dùng
    const handleBackToList = useCallback(() => {
        navigate("/admin/user/user-list");
    }, [navigate]);

    // Chuyển tab
    const handleTabChange = (key) => {
        setActiveTab(key);
    };

    if (loading) {
        return (
            <Loading1 />
        );
    }

    if (!userData) {
        return (
            <Card className="mb-6 shadow-md rounded-xl">
                <div className="text-center py-10">
                    <p className="text-gray-600 text-lg">
                        Không tìm thấy thông tin người dùng
                    </p>
                </div>
            </Card>
        );
    }

    return (
        <Card className="mb-6 shadow-md rounded-xl">
            {/* Nút quay lại */}
            <BackButton2
                onClick={handleBackToList}
                text="← Về danh sách người dùng"
            />


            {/* Tiêu đề người dùng */}
            <div className="mb-4 p-4 bg-gray-100 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-800">
                    Người dùng: {userData.name || `ID: ${userId}`}
                </h3>
            </div>

            {/* Tabs thông tin người dùng */}
            <Tabs
                activeKey={activeTab}
                onChange={handleTabChange}
                className="mt-4"
            >
                <TabPane tab={<span>Thông tin người dùng</span>} key="info">
                    <div className="mt-4">
                        <DetailUser userId={userId} />
                    </div>
                </TabPane>

                <TabPane tab={<span>Tab 2</span>} key="tab2">
                    <div className="mt-4">
                        {/* <UserTab2 userId={userId} /> */}
                    </div>
                </TabPane>

                <TabPane tab={<span>Tab 3</span>} key="tab3">
                    <div className="mt-4">
                        {/* <UserTab3 userId={userId} /> */}
                    </div>
                </TabPane>
            </Tabs>
        </Card>
    );
}

export default InfoUser;
