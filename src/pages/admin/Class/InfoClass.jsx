import { useEffect, useState, useCallback } from "react";
import { useDispatch } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { Card, Tabs, Spin } from "antd";
import { actionGetDetailClass } from "../../../redux/class/actions";
import DetailClass from "./DetailClass";
import ListClassUsers from "./ListClassUsers";
import ListClassMaterials from "./ListClassMaterials";
import Loading1 from "../../../components/common/Loading";
import BackButton2 from "../../../components/BackButton/BackButton2";

const { TabPane } = Tabs;

function InfoClass() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id: classId } = useParams();
    const [loading, setLoading] = useState(false);
    const [classData, setUserData] = useState(null);
    const [activeTab, setActiveTab] = useState("info");

    // Lấy thông tin chi tiết class
    const fetchUserDetail = useCallback(async () => {
        try {
            setLoading(true);
            const result = await dispatch(actionGetDetailClass(classId));
            if (result) {
                setUserData(result);
            }
        } catch (error) {
            console.error("Error loading class:", error);
        } finally {
            setLoading(false);
        }
    }, [dispatch, classId]);

    useEffect(() => {
        if (classId) {
            fetchUserDetail();
        }
    }, [classId, fetchUserDetail]);

    // Quay về danh sách lớp học
    const handleBackToList = useCallback(() => {
        navigate("/admin/classes/classes-list");
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

    if (!classData) {
        return (
            <Card className="mb-6 shadow-md rounded-xl">
                <div className="text-center py-10">
                    <p className="text-gray-600 text-lg">
                        Không tìm thấy thông tin lớp học
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
                text="← Về danh sách lớp học"
            />


            {/* Tiêu đề lớp học */}
            <div className="mb-4 p-4 bg-gray-100 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-800">
                    Lớp học: {classData.name || `ID: ${classId}`}
                </h3>
            </div>

            {/* Tabs thông tin lớp học */}
            <Tabs
                activeKey={activeTab}
                onChange={handleTabChange}
                className="mt-4"
            >
                <TabPane tab={<span>Thông tin</span>} key="info">
                    <div className="mt-4">
                        <DetailClass classId={classId} />
                    </div>
                </TabPane>

                <TabPane tab={<span>Thành viên</span>} key="tab2">
                    <div className="mt-4">
                        <ListClassUsers classId={classId} />
                    </div>
                </TabPane>

                <TabPane tab={<span>Tài liệu</span>} key="tab3">
                    <div className="mt-4">
                        <ListClassMaterials classId={classId} />
                    </div>
                </TabPane>
            </Tabs>
        </Card>
    );
}

export default InfoClass;
