import { useEffect, useState, useCallback } from "react";
import { useDispatch } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { Card, Tabs, Spin } from "antd";
import { actionGetDetailExamEvent } from "../../../redux/exam_event/actions";
import DetailExamEvent from "./DetailExamEvent";
import Loading1 from "../../../components/common/Loading";
import BackButton2 from "../../../components/BackButton/BackButton2";
import ListExams from "./ListExams";

const { TabPane } = Tabs;

function InfoExemEvent() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id: examEventId } = useParams();
    const [loading, setLoading] = useState(false);
    const [examEventData, setUserData] = useState(null);
    const [activeTab, setActiveTab] = useState("info");

    // Lấy thông tin chi tiết exam_event
    const fetchUserDetail = useCallback(async () => {
        try {
            setLoading(true);
            const result = await dispatch(actionGetDetailExamEvent(examEventId));
            if (result) {
                setUserData(result);
            }
        } catch (error) {
            console.error("Error loading exam_event:", error);
        } finally {
            setLoading(false);
        }
    }, [dispatch, examEventId]);

    useEffect(() => {
        if (examEventId) {
            fetchUserDetail();
        }
    }, [examEventId, fetchUserDetail]);

    // Quay về danh sách kỳ thi
    const handleBackToList = useCallback(() => {
        navigate("/admin/exam-events/list");
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

    if (!examEventData) {
        return (
            <Card className="mb-6 shadow-md rounded-xl">
                <div className="text-center py-10">
                    <p className="text-gray-600 text-lg">
                        Không tìm thấy thông tin kỳ thi
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
                text="← Về danh sách kỳ thi"
            />


            {/* Tiêu đề kỳ thi */}
            <div className="mb-4 p-4 bg-gray-100 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-800">
                    Kỳ thi: {examEventData.name || `ID: ${examEventId}`}
                </h3>
            </div>

            {/* Tabs thông tin kỳ thi */}
            <Tabs
                activeKey={activeTab}
                onChange={handleTabChange}
                className="mt-4"
            >
                <TabPane tab={<span>Thông tin kỳ thi</span>} key="info">
                    <div className="mt-4">
                        <DetailExamEvent examEventId={examEventId} />
                    </div>
                </TabPane>

                <TabPane tab={<span>Đề thi</span>} key="tab2">
                    <div className="mt-4">
                        <ListExams examEventId={examEventId} />
                    </div>
                </TabPane>

                <TabPane tab={<span>Tab 3</span>} key="tab3">
                    <div className="mt-4">
                        {/* <UserTab3 examEventId={examEventId} /> */}
                    </div>
                </TabPane>
            </Tabs>
        </Card>
    );
}

export default InfoExemEvent;
