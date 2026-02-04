import { useEffect, useState, useCallback } from "react";
import { useDispatch } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { Card, Tabs, Spin } from "antd";
import { actionGetDetailExamEvent } from "../../../redux/exam_event/actions";
import DetailExamEvent from "./DetailExamEvent";
import ListExamEventUsers from "./ListExamEventUsers";
// import ListExamEventMaterials from "./ListExamEventMaterials";
import Loading1 from "../../../components/common/Loading";
import BackButton2 from "../../../components/BackButton/BackButton2";

const { TabPane } = Tabs;

function InfoExamEvent() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id: examEventId } = useParams();
    const [loading, setLoading] = useState(false);
    const [examEventData, setExamEventData] = useState(null);
    const [activeTab, setActiveTab] = useState("info");

    // Lấy thông tin chi tiết exam event
    const fetchExamEventDetail = useCallback(async () => {
        try {
            setLoading(true);
            const result = await dispatch(actionGetDetailExamEvent(examEventId));
            if (result) {
                setExamEventData(result);
            }
        } catch (error) {
            console.error("Error loading exam event:", error);
        } finally {
            setLoading(false);
        }
    }, [dispatch, examEventId]);

    useEffect(() => {
        if (examEventId) {
            fetchExamEventDetail();
        }
    }, [examEventId, fetchExamEventDetail]);

    // Quay về danh sách kỳ thi
    const handleBackToList = useCallback(() => {
        navigate("/my-exam-events");
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
                <TabPane tab={<span>Thông tin</span>} key="info">
                    <div className="mt-4">
                        <DetailExamEvent examEventId={examEventId} />
                    </div>
                </TabPane>

                <TabPane tab={<span>Thí sinh</span>} key="tab2">
                    <div className="mt-4">
                        <ListExamEventUsers examEventId={examEventId} />
                    </div>
                </TabPane>

                <TabPane tab={<span>Tài liệu</span>} key="tab3">
                    {/* <div className="mt-4">
                        <ListExamEventMaterials examEventId={examEventId} />
                    </div> */}
                    <div className="mt-4">
                        <ListExamEventUsers examEventId={examEventId} />
                    </div>
                </TabPane>
            </Tabs>
        </Card>
    );
}

export default InfoExamEvent;