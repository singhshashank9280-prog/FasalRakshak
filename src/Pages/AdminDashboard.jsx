import { useState } from "react";
import "./AdminDashboard.css";

function AdminDashboard() {
    // ============================================================
    // STATE
    // ============================================================

    const [activeSection, setActiveSection] = useState("Overview");

    const [reportFilter, setReportFilter] = useState("All");
    const [showReports, setShowReports] = useState(false);

    const [selectedZone, setSelectedZone] = useState(null);
    const [showPrediction, setShowPrediction] = useState(false);

    const [predictionStatus, setPredictionStatus] = useState("Pending");

    const [advisory, setAdvisory] = useState({
        region: "Kamrup",
        crop: "Rice",
        disease: "Rice Blast",
        language: "Assamese",
        risk: "High",
        channels: {
            app: true,
            sms: true,
            ivr: true
        }
    });

    const [showAdvisoryPreview, setShowAdvisoryPreview] = useState(false);

    // ============================================================
    // DEMO DATA
    // ============================================================

    const reports = [
        {
            id: 1,
            crop: "Rice",
            disease: "Rice Blast",
            location: "Kamrup",
            confidence: 91,
            status: "Pending",
            time: "10 min ago"
        },
        {
            id: 2,
            crop: "Rice",
            disease: "Leaf Spot",
            location: "Nalbari",
            confidence: 82,
            status: "Verified",
            time: "25 min ago"
        },
        {
            id: 3,
            crop: "Potato",
            disease: "Late Blight",
            location: "Barpeta",
            confidence: 88,
            status: "Pending",
            time: "40 min ago"
        },
        {
            id: 4,
            crop: "Rice",
            disease: "Bacterial Blight",
            location: "Kamrup",
            confidence: 86,
            status: "Verified",
            time: "1 hour ago"
        },
        {
            id: 5,
            crop: "Rice",
            disease: "Rice Blast",
            location: "Nalbari",
            confidence: 89,
            status: "Rejected",
            time: "2 hours ago"
        }
    ];

    const zones = [
        {
            id: 1,
            location: "Kamrup",
            crop: "Rice",
            disease: "Rice Blast",
            reports: 34,
            confirmed: 21,
            confidence: 89,
            risk: "High",
            x: 55,
            y: 38
        },
        {
            id: 2,
            location: "Nalbari",
            crop: "Rice",
            disease: "Leaf Spot",
            reports: 18,
            confirmed: 11,
            confidence: 82,
            risk: "Medium",
            x: 72,
            y: 58
        },
        {
            id: 3,
            location: "Barpeta",
            crop: "Rice",
            disease: "Late Blight",
            reports: 27,
            confirmed: 17,
            confidence: 88,
            risk: "High",
            x: 32,
            y: 65
        },
        {
            id: 4,
            location: "Darrang",
            crop: "Rice",
            disease: "Bacterial Blight",
            reports: 9,
            confirmed: 5,
            confidence: 73,
            risk: "Low",
            x: 78,
            y: 28
        }
    ];

    // ============================================================
    // REPORT FILTER
    // ============================================================

    const filteredReports =
        reportFilter === "All"
            ? reports
            : reports.filter(
                  (report) => report.status === reportFilter
              );

    // ============================================================
    // HANDLERS
    // ============================================================

    const openReports = (filter = "All") => {
        setReportFilter(filter);
        setShowReports(true);
    };

    const openZone = (zone) => {
        setSelectedZone(zone);
    };

    const reviewPrediction = () => {
        setShowPrediction(true);
    };

    const approvePrediction = () => {
        setPredictionStatus("Approved");
        setShowPrediction(false);
        setActiveSection("Advisories");
    };

    const modifyPrediction = () => {
        setPredictionStatus("Modified");
        setShowPrediction(false);
    };

    const overridePrediction = () => {
        setPredictionStatus("Overridden");
        setShowPrediction(false);
    };

    const broadcastAdvisory = () => {
        alert(
            `Advisory broadcast started for ${advisory.region} via ${
                Object.entries(advisory.channels)
                    .filter(([, enabled]) => enabled)
                    .map(([channel]) => channel.toUpperCase())
                    .join(", ")
            }`
        );
    };

    // ============================================================
    // RENDER
    // ============================================================

    return (
        <div className="admin-dashboard">

            {/* ==================================================
                TOP NAVBAR
            ================================================== */}

            <header className="admin-navbar">

                <div className="admin-logo">
                    🌾 <span>FasalRakshak</span>
                </div>

                <nav className="admin-nav">

                    {[
                        "Overview",
                        "Outbreaks",
                        "Reports",
                        "Predictions",
                        "Advisories",
                        "Analytics"
                    ].map((item) => (
                        <button
                            key={item}
                            className={
                                activeSection === item
                                    ? "admin-nav-link active"
                                    : "admin-nav-link"
                            }
                            onClick={() => {
                                setActiveSection(item);

                                const section =
                                    document.getElementById(
                                        item.toLowerCase()
                                    );

                                if (section) {
                                    section.scrollIntoView({
                                        behavior: "smooth"
                                    });
                                }
                            }}
                        >
                            {item}
                        </button>
                    ))}

                </nav>

                <div className="admin-user-area">

                    <button className="notification-btn">
                        🔔
                        <span className="notification-dot"></span>
                    </button>

                    <div className="admin-user">
                        <div className="admin-avatar">
                            👤
                        </div>

                        <div>
                            <strong>KVK Officer</strong>
                            <small>Assam</small>
                        </div>
                    </div>

                </div>

            </header>

            {/* ==================================================
                MAIN CONTENT
            ================================================== */}

            <main className="admin-main">

                {/* ==================================================
                    WELCOME
                ================================================== */}

                <section id="overview" className="admin-welcome">

                    <div>

                        <h1>
                            Good Morning, KVK Officer 👋
                        </h1>

                        <p>
                            Monitor crop health, pest outbreaks and
                            farmer reports in real time.
                        </p>

                    </div>

                    <div className="system-info">

                        <span>
                            📍 Assam
                        </span>

                        <span className="system-online">
                            🟢 System Operational
                        </span>

                        <span>
                            Last updated: 2 min ago
                        </span>

                    </div>

                </section>

                {/* ==================================================
                    STAT CARDS
                ================================================== */}

                <section className="stats-grid">

                    <button
                        className="stat-card"
                        onClick={() => openReports("All")}
                    >
                        <span className="stat-icon">
                            📋
                        </span>

                        <strong>128</strong>

                        <span>REPORTS TODAY</span>

                        <small>
                            View Reports →
                        </small>
                    </button>


                    <button
                        className="stat-card"
                        onClick={() =>
                            openReports("Pending")
                        }
                    >
                        <span className="stat-icon">
                            ⏳
                        </span>

                        <strong>23</strong>

                        <span>PENDING VERIFICATION</span>

                        <small>
                            Review Now →
                        </small>
                    </button>


                    <button
                        className="stat-card"
                        onClick={() => {
                            setActiveSection("Outbreaks");

                            document
                                .getElementById("outbreaks")
                                ?.scrollIntoView({
                                    behavior: "smooth"
                                });
                        }}
                    >
                        <span className="stat-icon">
                            🔴
                        </span>

                        <strong>7</strong>

                        <span>HIGH RISK ZONES</span>

                        <small>
                            View Map →
                        </small>
                    </button>


                    <button className="stat-card">

                        <span className="stat-icon">
                            👨‍🌾
                        </span>

                        <strong>2,840</strong>

                        <span>FARMERS REACHED</span>

                        <small>
                            View Stats →
                        </small>

                    </button>

                </section>


                {/* ==================================================
                    OUTBREAK + ALERTS
                ================================================== */}

                <section
                    id="outbreaks"
                    className="dashboard-grid"
                >

                    {/* MAP */}

                    <div className="dashboard-card outbreak-card">

                        <div className="card-header">

                            <div>
                                <h2>
                                    🗺️ Hyperlocal Outbreak Monitoring
                                </h2>

                                <p>
                                    Monitor disease activity by region.
                                </p>
                            </div>

                        </div>


                        <div className="map-filters">

                            <select>
                                <option>District: All</option>
                                <option>Kamrup</option>
                                <option>Nalbari</option>
                                <option>Barpeta</option>
                            </select>

                            <select>
                                <option>Crop: All</option>
                                <option>Rice</option>
                                <option>Potato</option>
                            </select>

                            <select>
                                <option>Risk: All</option>
                                <option>High</option>
                                <option>Medium</option>
                                <option>Low</option>
                            </select>

                        </div>


                        <div className="fake-map">

                            <div className="map-label">
                                ASSAM
                            </div>

                            {zones.map((zone) => (

                                <button
                                    key={zone.id}
                                    className={`map-marker ${zone.risk.toLowerCase()}`}
                                    style={{
                                        left: `${zone.x}%`,
                                        top: `${zone.y}%`
                                    }}
                                    onClick={() =>
                                        openZone(zone)
                                    }
                                    title={`${zone.location} - ${zone.risk} Risk`}
                                >
                                    ●
                                </button>

                            ))}

                            <div className="map-water">
                                🌊
                            </div>

                        </div>


                        <div className="map-legend">

                            <span>
                                🔴 High
                            </span>

                            <span>
                                🟠 Medium
                            </span>

                            <span>
                                🟢 Low
                            </span>

                        </div>

                    </div>


                    {/* ALERTS */}

                    <div className="dashboard-card alerts-card">

                        <div className="card-header">

                            <h2>
                                ⚠️ Critical Alerts
                            </h2>

                            <span className="alert-count">
                                3
                            </span>

                        </div>


                        <div className="alert-item high">

                            <strong>
                                🔴 HIGH RISK
                            </strong>

                            <p>
                                Rice Blast — Kamrup
                            </p>

                            <small>
                                89% probability
                            </small>

                            <button
                                onClick={reviewPrediction}
                            >
                                Review
                            </button>

                        </div>


                        <div className="alert-item medium">

                            <strong>
                                🟠 REPORT CLUSTER
                            </strong>

                            <p>
                                12 new reports
                            </p>

                            <small>
                                Nalbari
                            </small>

                        </div>


                        <div className="alert-item weather">

                            <strong>
                                🌧 WEATHER ALERT
                            </strong>

                            <p>
                                High humidity
                            </p>

                            <small>
                                Barpeta
                            </small>

                        </div>


                        <button
                            className="secondary-btn"
                            onClick={() => openReports()}
                        >
                            View All Alerts
                        </button>

                    </div>

                </section>


                {/* ==================================================
                    REPORTS + AI PREDICTION
                ================================================== */}

                <section className="dashboard-grid">

                    {/* REPORTS */}

                    <div
                        id="reports"
                        className="dashboard-card"
                    >

                        <div className="card-header">

                            <h2>
                                📋 Recent Pest Reports
                            </h2>

                        </div>


                        <div className="report-mini-list">

                            {reports.slice(0, 3).map(
                                (report) => (

                                    <div
                                        className="report-mini"
                                        key={report.id}
                                    >

                                        <div>

                                            <strong>
                                                {report.disease}
                                            </strong>

                                            <small>
                                                {report.location}
                                            </small>

                                        </div>

                                        <span>
                                            {report.confidence}%
                                        </span>

                                        <b
                                            className={
                                                report.status.toLowerCase()
                                            }
                                        >
                                            {report.status}
                                        </b>

                                    </div>

                                )
                            )}

                        </div>


                        <div className="report-summary">

                            <div>
                                <strong>23</strong>
                                <span>Pending</span>
                            </div>

                            <div>
                                <strong>82</strong>
                                <span>Verified</span>
                            </div>

                            <div>
                                <strong>23</strong>
                                <span>Rejected</span>
                            </div>

                        </div>


                        <button
                            className="secondary-btn"
                            onClick={() =>
                                openReports("All")
                            }
                        >
                            View All Reports →
                        </button>

                    </div>


                    {/* AI PREDICTION */}

                    <div
                        id="predictions"
                        className="dashboard-card prediction-card"
                    >

                        <div className="card-header">

                            <h2>
                                🤖 AI Outbreak Prediction
                            </h2>

                            <span
                                className={`prediction-status ${predictionStatus.toLowerCase()}`}
                            >
                                {predictionStatus}
                            </span>

                        </div>


                        <div className="prediction-main">

                            <h3>
                                RICE BLAST — KAMRUP
                            </h3>

                            <div className="probability">
                                89%
                            </div>

                            <span>
                                OUTBREAK PROBABILITY
                            </span>

                            <strong className="high-risk">
                                🔴 HIGH RISK
                            </strong>

                            <p>
                                Expected spread: 3–5 days
                            </p>

                        </div>


                        <div className="prediction-factors">

                            <h4>
                                Contributing Factors
                            </h4>

                            <Factor
                                label="Rainfall"
                                value="High"
                                width="85%"
                            />

                            <Factor
                                label="Humidity"
                                value="High"
                                width="88%"
                            />

                            <Factor
                                label="Crop Stage"
                                value="High"
                                width="78%"
                            />

                            <Factor
                                label="Reports"
                                value="Very High"
                                width="95%"
                            />

                        </div>


                        <button
                            className="primary-btn"
                            onClick={reviewPrediction}
                        >
                            Review Prediction →
                        </button>

                    </div>

                </section>


                {/* ==================================================
                    ANALYTICS
                ================================================== */}

                <section
                    id="analytics"
                    className="dashboard-card analytics-card"
                >

                    <div className="card-header">

                        <div>

                            <h2>
                                📊 Outbreak Analytics
                            </h2>

                            <p>
                                Pest activity and disease distribution.
                            </p>

                        </div>

                    </div>


                    <div className="analytics-grid">

                        {/* LINE CHART */}

                        <div className="chart-container">

                            <h3>
                                Pest Reports Over Time
                            </h3>

                            <div className="line-chart">

                                <div className="chart-y">
                                    <span>100</span>
                                    <span>80</span>
                                    <span>60</span>
                                    <span>40</span>
                                    <span>20</span>
                                    <span>0</span>
                                </div>

                                <div className="chart-area">

                                    <div className="chart-line">
                                        <span></span>
                                        <span></span>
                                        <span></span>
                                        <span></span>
                                        <span></span>
                                        <span></span>
                                        <span></span>
                                    </div>

                                    <div className="chart-days">
                                        <span>Mon</span>
                                        <span>Tue</span>
                                        <span>Wed</span>
                                        <span>Thu</span>
                                        <span>Fri</span>
                                        <span>Sat</span>
                                        <span>Sun</span>
                                    </div>

                                </div>

                            </div>

                        </div>


                        {/* BAR CHART */}

                        <div className="chart-container">

                            <h3>
                                Disease Distribution
                            </h3>

                            <div className="bar-chart">

                                <Bar
                                    label="Rice Blast"
                                    value="42"
                                    width="90%"
                                />

                                <Bar
                                    label="Leaf Spot"
                                    value="28"
                                    width="65%"
                                />

                                <Bar
                                    label="Late Blight"
                                    value="19"
                                    width="48%"
                                />

                                <Bar
                                    label="Bacterial Blight"
                                    value="13"
                                    width="32%"
                                />

                            </div>

                        </div>

                    </div>


                    {/* ADVISORY DELIVERY */}

                    <div className="delivery-chart">

                        <h3>
                            📡 Advisory Delivery
                        </h3>

                        <div className="delivery-content">

                            <div className="donut">
                                <div>
                                    <strong>92%</strong>
                                    <span>Delivered</span>
                                </div>
                            </div>

                            <div className="delivery-stats">

                                <div>
                                    <span>🟢 Delivered</span>
                                    <strong>2,612</strong>
                                </div>

                                <div>
                                    <span>🟡 Pending</span>
                                    <strong>168</strong>
                                </div>

                                <div>
                                    <span>🔴 Failed</span>
                                    <strong>60</strong>
                                </div>

                            </div>

                        </div>

                    </div>

                </section>


                {/* ==================================================
                    ADVISORY + SYSTEM STATUS
                ================================================== */}

                <section className="dashboard-grid">

                    {/* ADVISORY */}

                    <div
                        id="advisories"
                        className="dashboard-card advisory-card"
                    >

                        <div className="card-header">

                            <h2>
                                📢 Advisory Broadcast
                            </h2>

                        </div>


                        <div className="advisory-form">

                            <label>
                                Target Region
                            </label>

                            <select
                                value={advisory.region}
                                onChange={(e) =>
                                    setAdvisory({
                                        ...advisory,
                                        region: e.target.value
                                    })
                                }
                            >
                                <option>Kamrup</option>
                                <option>Nalbari</option>
                                <option>Barpeta</option>
                                <option>All Assam</option>
                            </select>


                            <label>
                                Crop
                            </label>

                            <select
                                value={advisory.crop}
                                onChange={(e) =>
                                    setAdvisory({
                                        ...advisory,
                                        crop: e.target.value
                                    })
                                }
                            >
                                <option>Rice</option>
                                <option>Potato</option>
                                <option>Mustard</option>
                            </select>


                            <label>
                                Threat
                            </label>

                            <select
                                value={advisory.disease}
                                onChange={(e) =>
                                    setAdvisory({
                                        ...advisory,
                                        disease: e.target.value
                                    })
                                }
                            >
                                <option>Rice Blast</option>
                                <option>Leaf Spot</option>
                                <option>Late Blight</option>
                            </select>


                            <label>
                                Language
                            </label>

                            <select
                                value={advisory.language}
                                onChange={(e) =>
                                    setAdvisory({
                                        ...advisory,
                                        language: e.target.value
                                    })
                                }
                            >
                                <option>Assamese</option>
                                <option>Hindi</option>
                                <option>English</option>
                                <option>Bengali</option>
                            </select>


                            <div className="advisory-preview-box">

                                <strong>
                                    ⚠️ HIGH RISK ALERT
                                </strong>

                                <p>
                                    {advisory.disease} risk detected
                                    in your area. Please inspect your
                                    {` ${advisory.crop}`} crop.
                                </p>

                            </div>


                            <div className="channel-options">

                                <label>
                                    <input
                                        type="checkbox"
                                        checked={
                                            advisory.channels.app
                                        }
                                        onChange={(e) =>
                                            setAdvisory({
                                                ...advisory,
                                                channels: {
                                                    ...advisory.channels,
                                                    app: e.target.checked
                                                }
                                            })
                                        }
                                    />

                                    App
                                </label>


                                <label>
                                    <input
                                        type="checkbox"
                                        checked={
                                            advisory.channels.sms
                                        }
                                        onChange={(e) =>
                                            setAdvisory({
                                                ...advisory,
                                                channels: {
                                                    ...advisory.channels,
                                                    sms: e.target.checked
                                                }
                                            })
                                        }
                                    />

                                    SMS
                                </label>


                                <label>
                                    <input
                                        type="checkbox"
                                        checked={
                                            advisory.channels.ivr
                                        }
                                        onChange={(e) =>
                                            setAdvisory({
                                                ...advisory,
                                                channels: {
                                                    ...advisory.channels,
                                                    ivr: e.target.checked
                                                }
                                            })
                                        }
                                    />

                                    IVR
                                </label>

                            </div>


                            <div className="recipient-count">

                                Recipients:
                                <strong>
                                    2,840
                                </strong>

                            </div>


                            <div className="advisory-actions">

                                <button
                                    className="secondary-btn"
                                    onClick={() =>
                                        setShowAdvisoryPreview(true)
                                    }
                                >
                                    Preview Advisory
                                </button>


                                <button
                                    className="primary-btn"
                                    onClick={broadcastAdvisory}
                                    disabled={
                                        predictionStatus !== "Approved"
                                    }
                                    title={
                                        predictionStatus !== "Approved"
                                            ? "Approve the AI prediction first"
                                            : ""
                                    }
                                >
                                    🚀 Broadcast
                                </button>

                            </div>

                        </div>

                    </div>


                    {/* SYSTEM STATUS */}

                    <div className="dashboard-card system-card">

                        <div className="card-header">

                            <h2>
                                📡 System Status
                            </h2>

                        </div>


                        <div className="system-services">

                            <Status
                                icon="🌦"
                                label="Weather API"
                            />

                            <Status
                                icon="📍"
                                label="Farmer Reports"
                            />

                            <Status
                                icon="🤖"
                                label="Prediction Engine"
                            />

                            <Status
                                icon="📱"
                                label="SMS Gateway"
                            />

                            <Status
                                icon="☎️"
                                label="IVR"
                            />

                        </div>


                        <div className="network-support">

                            <h4>
                                Network Support
                            </h4>

                            <Network
                                label="2G"
                                width="45%"
                            />

                            <Network
                                label="3G"
                                width="65%"
                            />

                            <Network
                                label="4G"
                                width="90%"
                            />

                        </div>


                        <p className="last-sync">
                            Last sync: 2 minutes ago
                        </p>

                    </div>

                </section>

            </main>


            {/* ==================================================
                FOOTER
            ================================================== */}

            <footer className="admin-footer">

                <strong>
                    🌾 FasalRakshak
                </strong>

                <span>
                    Hyperlocal Crop Advisory & Pest Outbreak Monitoring
                </span>

                <span>
                    KVK Decision Support System
                </span>

                <span>
                    © 2026
                </span>

            </footer>


            {/* ==================================================
                REPORT MODAL
            ================================================== */}

            {showReports && (

                <div
                    className="admin-modal-overlay"
                    onClick={() =>
                        setShowReports(false)
                    }
                >

                    <div
                        className="admin-modal report-modal"
                        onClick={(e) =>
                            e.stopPropagation()
                        }
                    >

                        <div className="modal-header">

                            <div>

                                <h2>
                                    📋 Farmer Reports
                                </h2>

                                <p>
                                    Review and verify farmer submissions.
                                </p>

                            </div>

                            <button
                                onClick={() =>
                                    setShowReports(false)
                                }
                            >
                                ✕
                            </button>

                        </div>


                        <div className="report-filters">

                            {[
                                "All",
                                "Pending",
                                "Verified",
                                "Rejected"
                            ].map((filter) => (

                                <button
                                    key={filter}
                                    className={
                                        reportFilter === filter
                                            ? "active"
                                            : ""
                                    }
                                    onClick={() =>
                                        setReportFilter(filter)
                                    }
                                >
                                    {filter}
                                </button>

                            ))}

                        </div>


                        <div className="full-report-list">

                            {filteredReports.map(
                                (report) => (

                                    <div
                                        className="full-report"
                                        key={report.id}
                                    >

                                        <div className="report-image">
                                            🌱
                                        </div>

                                        <div className="full-report-info">

                                            <h3>
                                                {report.disease}
                                            </h3>

                                            <p>
                                                🌾 {report.crop}
                                            </p>

                                            <p>
                                                📍 {report.location}
                                            </p>

                                            <p>
                                                🕐 {report.time}
                                            </p>

                                        </div>


                                        <div className="report-confidence">

                                            <strong>
                                                {report.confidence}%
                                            </strong>

                                            <span>
                                                AI Confidence
                                            </span>

                                            <b
                                                className={
                                                    report.status.toLowerCase()
                                                }
                                            >
                                                {report.status}
                                            </b>

                                        </div>


                                        {report.status ===
                                            "Pending" && (

                                            <div className="report-actions">

                                                <button
                                                    className="confirm-btn"
                                                    onClick={() =>
                                                        alert(
                                                            "Report confirmed"
                                                        )
                                                    }
                                                >
                                                    ✓ Confirm
                                                </button>

                                                <button
                                                    className="reject-btn"
                                                    onClick={() =>
                                                        alert(
                                                            "Report rejected"
                                                        )
                                                    }
                                                >
                                                    ✕ Reject
                                                </button>

                                                <button
                                                    className="inspect-btn"
                                                    onClick={() =>
                                                        alert(
                                                            "Field inspection requested"
                                                        )
                                                    }
                                                >
                                                    ⚠ Field Inspection
                                                </button>

                                            </div>

                                        )}

                                    </div>

                                )
                            )}

                        </div>

                    </div>

                </div>

            )}


            {/* ==================================================
                ZONE MODAL
            ================================================== */}

            {selectedZone && (

                <div
                    className="admin-modal-overlay"
                    onClick={() =>
                        setSelectedZone(null)
                    }
                >

                    <div
                        className="admin-modal zone-modal"
                        onClick={(e) =>
                            e.stopPropagation()
                        }
                    >

                        <div className="modal-header">

                            <h2>
                                🔴 High-Risk Zone
                            </h2>

                            <button
                                onClick={() =>
                                    setSelectedZone(null)
                                }
                            >
                                ✕
                            </button>

                        </div>


                        <div className="zone-details">

                            <h3>
                                {selectedZone.location}
                            </h3>

                            <p>
                                Crop: {selectedZone.crop}
                            </p>

                            <p>
                                Threat: {selectedZone.disease}
                            </p>

                            <p>
                                Reports: {selectedZone.reports}
                            </p>

                            <p>
                                Confirmed: {selectedZone.confirmed}
                            </p>

                            <p>
                                AI Confidence:
                                {` ${selectedZone.confidence}%`}
                            </p>

                            <div className="weather-details">

                                <span>
                                    🌡 28°C
                                </span>

                                <span>
                                    💧 84%
                                </span>

                                <span>
                                    🌧 32 mm
                                </span>

                            </div>

                            <p>
                                Predicted Spread:
                                <strong>
                                    3–5 days
                                </strong>
                            </p>

                        </div>


                        <div className="modal-actions">

                            <button
                                className="secondary-btn"
                                onClick={() => {
                                    setSelectedZone(null);
                                    openReports();
                                }}
                            >
                                View Reports
                            </button>

                            <button
                                className="primary-btn"
                                onClick={() => {
                                    setSelectedZone(null);
                                    reviewPrediction();
                                }}
                            >
                                Review Prediction
                            </button>

                        </div>

                    </div>

                </div>

            )}


            {/* ==================================================
                AI PREDICTION MODAL
            ================================================== */}

            {showPrediction && (

                <div
                    className="admin-modal-overlay"
                    onClick={() =>
                        setShowPrediction(false)
                    }
                >

                    <div
                        className="admin-modal prediction-modal"
                        onClick={(e) =>
                            e.stopPropagation()
                        }
                    >

                        <div className="modal-header">

                            <div>

                                <h2>
                                    🤖 Rice Blast — Kamrup
                                </h2>

                                <p>
                                    AI Outbreak Prediction
                                </p>

                            </div>

                            <button
                                onClick={() =>
                                    setShowPrediction(false)
                                }
                            >
                                ✕
                            </button>

                        </div>


                        <div className="prediction-score">

                            <span>
                                Outbreak Probability
                            </span>

                            <strong>
                                89%
                            </strong>

                            <b>
                                🔴 HIGH RISK
                            </b>

                            <p>
                                Predicted spread: 3–5 days
                            </p>

                        </div>


                        <div className="modal-factors">

                            <h3>
                                Contributing Factors
                            </h3>

                            <Factor
                                label="Rainfall"
                                value="HIGH"
                                width="85%"
                            />

                            <Factor
                                label="Humidity"
                                value="HIGH"
                                width="88%"
                            />

                            <Factor
                                label="Crop Stage"
                                value="HIGH"
                                width="78%"
                            />

                            <Factor
                                label="Reports"
                                value="VERY HIGH"
                                width="95%"
                            />

                        </div>


                        <div className="officer-decision">

                            <h3>
                                Officer Decision
                            </h3>

                            <div>

                                <button
                                    className="confirm-btn"
                                    onClick={approvePrediction}
                                >
                                    ✓ Approve
                                </button>

                                <button
                                    className="modify-btn"
                                    onClick={modifyPrediction}
                                >
                                    ✎ Modify
                                </button>

                                <button
                                    className="reject-btn"
                                    onClick={overridePrediction}
                                >
                                    ✕ Override
                                </button>

                            </div>

                        </div>

                    </div>

                </div>

            )}


            {/* ==================================================
                ADVISORY PREVIEW MODAL
            ================================================== */}

            {showAdvisoryPreview && (

                <div
                    className="admin-modal-overlay"
                    onClick={() =>
                        setShowAdvisoryPreview(false)
                    }
                >

                    <div
                        className="admin-modal advisory-modal"
                        onClick={(e) =>
                            e.stopPropagation()
                        }
                    >

                        <div className="modal-header">

                            <div>

                                <h2>
                                    📢 Advisory Preview
                                </h2>

                                <p>
                                    {advisory.language}
                                </p>

                            </div>

                            <button
                                onClick={() =>
                                    setShowAdvisoryPreview(false)
                                }
                            >
                                ✕
                            </button>

                        </div>


                        <div className="advisory-preview-large">

                            <span>
                                ⚠️ HIGH RISK ALERT
                            </span>

                            <h3>
                                {advisory.disease}
                            </h3>

                            <p>
                                {advisory.disease} risk detected
                                in {advisory.region}.
                                Please inspect your{" "}
                                {advisory.crop} crop.
                            </p>

                            <small>
                                Language: {advisory.language}
                            </small>

                        </div>


                        <div className="modal-actions">

                            <button
                                className="secondary-btn"
                                onClick={() =>
                                    setShowAdvisoryPreview(false)
                                }
                            >
                                Close
                            </button>

                            <button
                                className="primary-btn"
                                onClick={() => {
                                    setShowAdvisoryPreview(false);
                                    broadcastAdvisory();
                                }}
                                disabled={
                                    predictionStatus !== "Approved"
                                }
                            >
                                🚀 Broadcast Advisory
                            </button>

                        </div>

                    </div>

                </div>

            )}

        </div>
    );
}


// ============================================================
// SMALL REUSABLE COMPONENTS
// ============================================================

function Factor({
    label,
    value,
    width
}) {
    return (
        <div className="factor">

            <div className="factor-label">

                <span>
                    {label}
                </span>

                <strong>
                    {value}
                </strong>

            </div>

            <div className="factor-bar">

                <span
                    style={{
                        width
                    }}
                />

            </div>

        </div>
    );
}


function Bar({
    label,
    value,
    width
}) {
    return (
        <div className="bar-row">

            <span className="bar-label">
                {label}
            </span>

            <div className="bar-track">

                <span
                    style={{
                        width
                    }}
                />

            </div>

            <strong>
                {value}
            </strong>

        </div>
    );
}


function Status({
    icon,
    label
}) {
    return (
        <div className="service-status">

            <span>
                {icon}
            </span>

            <strong>
                {label}
            </strong>

            <b>
                🟢 Active
            </b>

        </div>
    );
}


function Network({
    label,
    width
}) {
    return (
        <div className="network-row">

            <span>
                {label}
            </span>

            <div className="network-track">

                <span
                    style={{
                        width
                    }}
                />

            </div>

        </div>
    );
}


export default AdminDashboard;
