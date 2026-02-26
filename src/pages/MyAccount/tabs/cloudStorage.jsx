import React, { useEffect, useState } from "react";
import "./CloudStorage.scss";
import { getCloudStorageData } from "../../../api/myAccountApi";
import { useMinDelay } from "../../../hooks/useMinDelay";
import AppLoader from "../../../components/loaders/Loader";
import Cloud from '../../../assets/newMyaccountImg/manage cloud storage.png'

const APPLE_COLORS = [
  "#FF9500",
  "#7367f0",
  "#34C759",
  "#AF52DE",
  "#007AFF",
  "#5AC8FA",
  "#FF2D55",
];

const generateColorByIndex = (index) =>
  APPLE_COLORS[index % APPLE_COLORS.length];

const CloudStorage = ({ clientIp, LUId }) => {
  const [openSection, setOpenSections] = useState({
    data: false,
    files: false,
  });
  const minDelayDone = useMinDelay(500);

  const [storageData, setStorageData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!clientIp || !LUId) return;

    setLoading(true);

    getCloudStorageData(clientIp, LUId)
      .then(res => {
        setStorageData(res.Data);
      })
      .catch(err => {
        console.error("CloudStorage API error:", err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [clientIp, LUId]);

  const toggle = (key) => {
    setOpenSections(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  if (loading || !minDelayDone) {
    return <AppLoader text="Loading..." />;
  }
  if (!storageData) return null;

  const dataStorage = storageData?.rd;
  const StorageTotals = storageData?.rd1?.[0];

  const totalStorage = 5;

  const totalDataStorage = StorageTotals?.TotalDataStorage ?? 0;
  const totalFilStorage = StorageTotals?.TotalFilStorage ?? 0;

  const dataSegments = dataStorage.map((item, index) => ({
    label: item.ModuleName,
    value: item.datausage,
    percent: (item.datausage / totalDataStorage) * 100,
    color: generateColorByIndex(index, dataStorage.length),
  }));

  return (
    <div className="cloud-wrapper-first">
      <div className="icloud-storage-wrapper">
        <div className="icloud-storage-grid">

          <div className="icloud-storage-left">
            <div className="icloud-storage-header">
              <h1>Your Cloud Storage</h1>
              <p>
                Use your Cloud storage to keep your most important information.
              </p>
            </div>

            <StorageAccordion
              title="Data Storage"
              isOpen={openSection.data}
              onToggle={() => toggle("data")}
              total={`${totalDataStorage} GB`}
              used={totalDataStorage}
              // free={totalStorage - totalDataStorage}
              segments={dataSegments}
              details={dataStorage}
            />

            <StorageAccordion
              title="File Storage"
              isOpen={openSection.files}
              onToggle={() => toggle("files")}
              total={`${totalFilStorage} GB`}
              used={totalFilStorage}
              // free={totalStorage - totalFilStorage}
              segments={[
                {
                  percent: totalFilStorage * 100,
                  color: "#007AFF",
                },
              ]}
              // details={fileStorage}
              isExpandable={false}
            />
          </div>

          <div className="icloud-storage-right">
            <div className="right-spacer" />

            <div className="right-content">
              <div className="vertical-divider" />

              <div className="storage-help-card">
                <img src={Cloud} alt="Cloud" style={{
                  width: '100%',
                  height: '100%'
                }} />
                <div className="storage_card_contnet">
                  <h3>Benefits of Cloud Storage</h3>
                  <div>
                    <p>•	Access your data anytime, from anywhere.</p>
                    <p>•	Track data storage easily.</p>
                    <p>•	Secure and centralized data management.</p>
                    <p>•	Smooth performance without local storage dependency.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default CloudStorage;

const StorageAccordion = ({
  title,
  isOpen,
  onToggle,
  total,
  used,
  // free,
  segments = [],
  details = [],
  isExpandable = true,
  upgradeContent = null,
}) => {
  return (
    <div className="storage-accordion">
      <div className="accordion-all-wrapper">
        {/* HEADER */}
        <div className="accordion-header-wrapper">
          <div className="accordion-bar-wrapper">
            <div className="accordion-header">
              <div className="accordion-left">
                <h3>{title}</h3>
                <span className="storage-badge">{total}</span>
              </div>

              <div className="storage-summary">
                {/* <span className="storage-free">Available {free} GB</span>
                <span className="dot-separator">·</span> */}
                <span className="storage-used-text">Used {used} GB</span>
              </div>
            </div>

            {/* BAR */}
            <div className="storage-bar">
              {segments.map((seg, index) => (
                <div
                  key={index}
                  className="storage-segment"
                  style={{
                    width: `${seg.percent}%`,
                    backgroundColor: seg.color,
                  }}
                />
              ))}
            </div>
          </div>

          {upgradeContent && (
            <div className="icloud-upgrade-card">
              {upgradeContent}
            </div>
          )}

          {isExpandable && (
            <div className="accrodian-last">
              <div className="storage-free">View Details</div>
              <div
                className={`chevron ${isOpen ? "open" : ""}`}
                onClick={onToggle}
              />
            </div>
          )}
        </div>

        {/* EXPANDABLE CONTENT */}
        {isExpandable && isOpen && (
          <div className="accordion-body">
            <div className="storage-list">
              {details.length === 0 ? (
                <div className="empty-text">No details available</div>
              ) : (
                details.map((item, index) => (
                  <StorageRow
                    key={index}
                    label={item.ModuleName}
                    size={item.datausage}
                    color={generateColorByIndex(index, details.length)}
                  />
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const StorageRow = ({ label, size, color }) => (
  <div className="storage-row">
    <div className="storage-left">
      <span>{label}</span>
    </div>

    <div className="storage-right">
      <span>{size} GB</span>
      <span className="dot" style={{ backgroundColor: color }} />
    </div>
  </div>
);