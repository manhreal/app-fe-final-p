// src/components/Loading1.jsx
import React from "react";
import "../../styles/Loading1.css"; // import CSS riêng cho spinner

const Loading1 = () => {
    return (
        <div className="loading-overlay">
            <div className="spinner-box">
                <div className="blue-orbit leo"></div>
                <div className="green-orbit leo"></div>
                <div className="red-orbit leo"></div>
                <div className="white-orbit w1 leo"></div>
                <div className="white-orbit w2 leo"></div>
                <div className="white-orbit w3 leo"></div>
            </div>
        </div>
    );
};

export default Loading1;
