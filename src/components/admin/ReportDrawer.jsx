import { useMemo, useState } from "react";
import "./ReportDrawer.css";

const DEMO_REPORTS = [
    {
        id: 1,
        crop: "Rice",
        disease: "Rice Blast",
        location: "Kamrup",
        farmer: "Ramesh Das",
        confidence: 91,
        status: "Pending",
        date: "19 Aug 2026, 10:42 AM",
        image: "https://images.unsplash.com/photo-1535090467336-9501f96eef89?auto=format&fit=crop&w=800&q=80"
    },
    {
        id: 2,
        crop: "Rice",
        disease: "Leaf Spot",
        location: "Nalbari",
        farmer: "Dilip Kumar",
        confidence: 82,
        status: "Verified",
        date: "19 Aug 2026, 10:18 AM",
        image: "https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?auto=format&fit=crop&w=800&q=80"
    },
    {
        id: 3,
        crop: "Potato",
        disease: "Late Blight",
        location: "Barpeta",
        farmer: "Mohan Bora",
        confidence: 88,
        status: "Pending",
        date: "19 Aug 2026, 09:56 AM",
        image: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=800&q=80"
    },
    {
        id: 4,
        crop: "Rice",
        disease: "Bacterial Blight",
        location: "Kamrup",
        farmer: "Anil Sharma",
        confidence: 79,
        status: "Rejected",
        date: "19 Aug 2026, 09:21 AM",
        image: "https://images.unsplash.com/photo-1492496913980-501348b61469?auto=format&fit=crop&w=800&q=80"
    },
    {
        id: 5,
        crop: "Mustard",
        disease: "Leaf Spot",
        location: "Darrang",
        farmer: "Prakash Das",
        confidence: 86,
        status: "Pending",
        date: "19 Aug 2026, 08:45 AM",
        image: "https://images.unsplash.com/photo-1497250681960-ef046c08a56e?auto=format&fit=crop&w=800&q=80"
    }
];

function ReportDrawer({
    isOpen,
    onClose,
    initialFilter = "All"
}) {
    const [reports, setReports] = useState(DEMO_REPORTS);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] =
        useState(initialFilter);

    const [selectedReport, setSelectedReport] =
        useState(null);

    const filteredReports = useMemo(() => {
        return reports.filter((report) => {

            const matchesSearch =
                report.crop
                    .toLowerCase()
                    .includes(search.toLowerCase()) ||
                report.disease
                    .toLowerCase()
                    .includes(search.toLowerCase()) ||
                report.location
                    .toLowerCase()
                    .includes(search.toLowerCase()) ||
                report.farmer
                    .toLowerCase()
                    .includes(search.toLowerCase());

            const matchesStatus =
                statusFilter === "All" ||
                report.status === statusFilter;

            return matchesSearch && matchesStatus;
        });
    }, [reports, search, statusFilter]);

    if (!isOpen) return null;

    const updateStatus = (id, status) => {
        setReports((previous) =>
            previous.map((report) =>
                report.id === id
                    ? { ...report, status }
                    : report
            )
        );

        if (selectedReport?.id === id) {
            setSelectedReport((previous) => ({
                ...previous,
                status
            }));
        }
    };

    const handleConfirm = (id) => {
        updateStatus(id, "Verified");
    };

    const handleReject = (id) => {
        updateStatus(id, "Rejected");
    };

    const handleInspection = (id) => {
        updateStatus(id, "Inspection");
    };

    return (
        <div className="report-overlay">

            <div className="report-drawer">

                {/* HEADER */}
                <div className="report-header">

                    <div>
                        <h2>📋 Farmer Reports</h2>

                        <p>
                            Review and verify farmer disease reports
                        </p>
                    </div>

                    <button
                        className="report-close"
                        onClick={onClose}
                    >
                        ×
                    </button>

                </div>


                {/* SEARCH + FILTER */}
                <div className="report-controls">

                    <input
                        type="text"
                        placeholder="Search crop, disease, location or farmer..."
                        value={search}
                        onChange={(e) =>
                            setSearch(e.target.value)
                        }
                    />

                    <select
                        value={statusFilter}
                        onChange={(e) =>
                            setStatusFilter(e.target.value)
                        }
                    >
                        <option value="All">
                            All Reports
                        </option>

                        <option value="Pending">
                            Pending
                        </option>

                        <option value="Verified">
                            Verified
                        </option>

                        <option value="Rejected">
                            Rejected
                        </option>

                        <option value="Inspection">
                            Field Inspection
                        </option>
                    </select>

                </div>


                {/* CONTENT */}
                <div className="report-content">

                    {/* REPORT LIST */}
                    <div className="report-list">

                        <div className="report-count">
                            Showing {filteredReports.length} reports
                        </div>

                        {filteredReports.length === 0 ? (

                            <div className="no-reports">
                                No reports found.
                            </div>

                        ) : (

                            filteredReports.map((report) => (

                                <div
                                    key={report.id}
                                    className={`report-item ${
                                        selectedReport?.id === report.id
                                            ? "selected"
                                            : ""
                                    }`}
                                    onClick={() =>
                                        setSelectedReport(report)
                                    }
                                >

                                    <img
                                        src={report.image}
                                        alt={report.disease}
                                    />

                                    <div className="report-info">

                                        <div className="report-title-row">

                                            <h3>
                                                {report.disease}
                                            </h3>

                                            <span
                                                className={`status ${report.status.toLowerCase()}`}
                                            >
                                                {report.status}
                                            </span>

                                        </div>

                                        <p>
                                            🌾 {report.crop}
                                        </p>

                                        <p>
                                            📍 {report.location}
                                        </p>

                                        <p>
                                            🤖 AI Confidence:{" "}
                                            <strong>
                                                {report.confidence}%
                                            </strong>
                                        </p>

                                    </div>

                                </div>

                            ))

                        )}

                    </div>


                    {/* DETAILS */}
                    <div className="report-details">

                        {!selectedReport ? (

                            <div className="empty-details">

                                <div>
                                    📋
                                </div>

                                <h3>
                                    Select a report
                                </h3>

                                <p>
                                    Click a report to view its
                                    complete details.
                                </p>

                            </div>

                        ) : (

                            <>

                                <div className="details-image">

                                    <img
                                        src={
                                            selectedReport.image
                                        }
                                        alt={
                                            selectedReport.disease
                                        }
                                    />

                                </div>


                                <div className="details-body">

                                    <div className="details-title">

                                        <div>

                                            <h2>
                                                {
                                                    selectedReport.disease
                                                }
                                            </h2>

                                            <span
                                                className={`status ${selectedReport.status.toLowerCase()}`}
                                            >
                                                {
                                                    selectedReport.status
                                                }
                                            </span>

                                        </div>

                                    </div>


                                    <div className="detail-grid">

                                        <div>
                                            <span>
                                                Crop
                                            </span>

                                            <strong>
                                                🌾{" "}
                                                {
                                                    selectedReport.crop
                                                }
                                            </strong>
                                        </div>


                                        <div>
                                            <span>
                                                Location
                                            </span>

                                            <strong>
                                                📍{" "}
                                                {
                                                    selectedReport.location
                                                }
                                            </strong>
                                        </div>


                                        <div>
                                            <span>
                                                Farmer
                                            </span>

                                            <strong>
                                                👨‍🌾{" "}
                                                {
                                                    selectedReport.farmer
                                                }
                                            </strong>
                                        </div>


                                        <div>
                                            <span>
                                                AI Confidence
                                            </span>

                                            <strong>
                                                🤖{" "}
                                                {
                                                    selectedReport.confidence
                                                }%
                                            </strong>
                                        </div>


                                        <div>
                                            <span>
                                                Date / Time
                                            </span>

                                            <strong>
                                                🕒{" "}
                                                {
                                                    selectedReport.date
                                                }
                                            </strong>
                                        </div>

                                    </div>


                                    <div className="verification-section">

                                        <h3>
                                            Officer Verification
                                        </h3>


                                        {selectedReport.status ===
                                        "Pending" ? (

                                            <div className="verification-buttons">

                                                <button
                                                    className="confirm-btn"
                                                    onClick={() =>
                                                        handleConfirm(
                                                            selectedReport.id
                                                        )
                                                    }
                                                >
                                                    ✓ Confirm
                                                </button>


                                                <button
                                                    className="reject-btn"
                                                    onClick={() =>
                                                        handleReject(
                                                            selectedReport.id
                                                        )
                                                    }
                                                >
                                                    ✕ Reject
                                                </button>


                                                <button
                                                    className="inspection-btn"
                                                    onClick={() =>
                                                        handleInspection(
                                                            selectedReport.id
                                                        )
                                                    }
                                                >
                                                    ⚠ Request Field
                                                    Inspection
                                                </button>

                                            </div>

                                        ) : (

                                            <div className="already-reviewed">

                                                This report is already{" "}
                                                <strong>
                                                    {
                                                        selectedReport.status
                                                    }
                                                </strong>
                                                .

                                            </div>

                                        )}

                                    </div>

                                </div>

                            </>

                        )}

                    </div>

                </div>

            </div>

        </div>
    );
}

export default ReportDrawer;