import React, { useState } from "react";
import "./IPSecurity.scss";
import toast from "react-hot-toast";
import { FaTrashAlt } from "react-icons/fa";
import { addIpSecurity } from "../../../../api/myAccountApi";
import { softDeleteIpSecurity } from "../../../../api/myAccountApi";
import { RefreshCw, Trash } from "lucide-react";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import { Button } from "@mui/material";

const IPSecurity = ({ setShowIpPopup, ipData, onRefresh, clientIp, LUId, refresh }) => {
  const [confirmPopup, setConfirmPopup] = useState({
    open: false,
    ip: null,
  });
  const [isAdding, setIsAdding] = useState(false);
  console.log('isAdding: ', isAdding);
  const [errors, setErrors] = useState({
    ip: "",
    requestBy: ""
  });
  console.log('errors: ', errors);
  const [newIp, setNewIp] = useState({
    ip: "",
    requestBy: ""
  });
  const [ipError, setIpError] = useState("");
  const ipRegex =
    /^(25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)){3}$/;


  // if (!Array.isArray(ipData) || ipData.length === 0) {
  //   return (
  //     <>
  //       <button
  //         className="profile-edit-btn"
  //         style={{ marginBottom: "1.5%" }}
  //         onClick={() => {
  //           setIsAdding(true);
  //           setNewIp({ ip: "", requestBy: "" });
  //           setIpError("");
  //         }}
  //       >
  //         + Add
  //       </button>

  //       <p>No IP records found</p>
  //     </>
  //   );
  // }

  const formatDateOnly = (dateTime) => {
    if (!dateTime) return "—";
    return dateTime.split(" ").slice(0, 3).join(" ");
  };

  const validateAddIp = () => {
    const newErrors = {
      ip: "",
      requestBy: ""
    };

    if (!newIp.ip.trim()) {
      newErrors.ip = "IP Address is required";
    } else if (!ipRegex.test(newIp.ip)) {
      newErrors.ip = "Enter a valid IP address";
    }

    if (!newIp.requestBy.trim()) {
      newErrors.requestBy = "Request By is required";
    }
    setErrors(newErrors);
    return !newErrors.ip && !newErrors.requestBy;
  };


  const handleAddIp = async () => {
    if (!validateAddIp()) return;
    if (!ipRegex.test(newIp.ip)) {
      setIpError("Enter a valid IP address");
      return;
    }

    if (!newIp.requestBy.trim()) {
      setIpError("Request By is required");
      return;
    }

    const body = {
      con: JSON.stringify({
        mode: "addIpSecurity",
        appuserid: LUId,
        IPAddress: clientIp,
      }),
      p: JSON.stringify({
        ipid: "0",
        newIpAddress: newIp.ip,
        appuserid: LUId,
        RequestBy: newIp.requestBy || "User",
        remark: "IP added from settings",
      }),
      f: "MyAccount ( gettoken )",
    };

    try {
      const res = await addIpSecurity(body);
      console.log('res: ', res?.Data?.rd[0]?.result == "IPAddress Already Exists!");
      if (res?.Data?.rd[0]?.result == "IPAddress Already Exists!") {
        toast.error("IPAddress Already Exists!");
      } else {
        toast.success("IP request added successfully");
      }

      // setIsAdding(false);
      setNewIp({ ip: "", requestBy: "" });
      setIpError("");

      onRefresh();
    } catch (err) {
      toast.error(err?.message || "Failed to add IP");
    }
  };

  const handleDeleteIp = async (ip) => {
    const body = {
      con: JSON.stringify({
        // mode: "softdeleteIpSecurity",
        mode: "deleteIpSecurity",
        appuserid: LUId,
        IPAddress: clientIp,
      }),
      p: JSON.stringify({
        ipid: ip.id,
        newIpAddress: ip.IPAddress,
        appuserid: LUId,
        RequestBy: ip.RequestBy || "User",
        remark: "Deleted from IP Security",
      }),
      f: "MyAccount ( gettoken )",
    };

    try {
      await softDeleteIpSecurity(body);
      toast.success("IP deleted successfully");
      onRefresh();
    } catch (err) {
      toast.error(err?.message || "Failed to delete IP");
    }
  };

  const handleDeleteClick = (ip) => {
    setConfirmPopup({
      open: true,
      ip,
    });
  };

  const getTodayDate = () => {
    const d = new Date();
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <button
          className="profile-edit-btn"
          onClick={() => {
            setIsAdding(true);
            setNewIp({ ip: "", requestBy: "" });
            setIpError("");
          }}
        >
          + Add
        </button>
        <Tooltip title="Refresh">
          <IconButton onClick={refresh} style={{
            backgroundColor: 'rgb(0 113 227)',
            color: 'white'
          }}>
            <RefreshCw color="white" />
          </IconButton>
        </Tooltip>
      </div>


      {isAdding && (
        <div className="ip-add-card">
          <h4>Add IP Request</h4>

          <div className="ip-add-grid">
            <div>
              <label>Date</label>
              <input
                value={getTodayDate()}
                readOnly
              />
            </div>

            <div>
              <label>IP Address</label>
              <input
                value={newIp.ip}
                placeholder="e.g. 192.168.1.10"
                onChange={(e) => {
                  setNewIp((p) => ({ ...p, ip: e.target.value }));
                  setErrors(prev => ({ ...prev, ip: "" }));
                }}
                className={errors.ip ? "input-error" : ""}
              />
              {errors.ip && <div className="error-text">{errors.ip}</div>}
            </div>

            <div>
              <label>Request By</label>
              <input
                value={newIp.requestBy}
                placeholder=""
                onChange={(e) => {
                  setNewIp((p) => ({ ...p, requestBy: e.target.value }));
                  setErrors(prev => ({ ...prev, requestBy: "" }));
                }}
                className={errors.requestBy ? "input-error" : ""}
              />
              {errors.requestBy && <div className="error-text">{errors.requestBy}</div>}
            </div>
          </div>

          {ipError && <div className="error-text">{ipError}</div>}

          <div className="ip-add-actions">
            <Button
              className="confirm-cancel"
              onClick={() => {
                setIsAdding(false);
                setNewIp({ ip: "", requestBy: "" });
                setIpError("");
              }}
            >
              Cancel
            </Button>
            <Button
              className="Ip-Proceed"
              onClick={handleAddIp}
            >
              Add IP
            </Button>
          </div>
        </div>
      )}

      <div className="ip-table">
        <div className="ip-table-head">
          <div className="wdth ip-table-head-fnt">Sr</div>
          <div className="wdth1 ip-table-head-fnt">Entry Date</div>
          <div className="wdth2 ip-table-head-fnt">IP Address</div>
          <div className="wdth3 ip-table-head-fnt">Status</div>
          <div className="wdth4 ip-table-head-fnt">Request By</div>
          <div className="wdth5 ip-table-head-fnt">Activated On</div>
          <div className="wdth6 ip-table-head-fnt">Delete</div>
        </div>
        {ipData?.length === 0 ? (
          <div className="ip-table-body">
            <p style={{ width: '100%', textAlign: 'center' }}>No IP records found</p>
          </div>
        ) : (
          ipData?.map((ip, index) => (
            <div key={ip.id || index} className="ip-table-body">
              <div className="wdth ip-table-body-fnt">{index + 1}</div>

              <div className="wdth1 ip-table-body-fnt">
                {formatDateOnly(ip.EntryDate1) || "—"}
              </div>

              <div className="wdth2 ip-table-body-fnt">
                {ip.IPAddress || "—"}
              </div>

              <div className="wdth3 ip-table-body-fnt ip-table-entry">
                {ip.isActive === 1
                  ? "Active"
                  : ip.isActive === 0
                    ? "Inactive"
                    : "—"}
              </div>

              <div className="wdth4 ip-table-body-fnt">
                {ip.RequestBy || "—"}
              </div>

              <div className="wdth5 ip-table-body-fnt">
                {ip.activateOn1 || "—"}
              </div>

              <div style={{ cursor: "pointer" }} className="wdth6">
                <IconButton onClick={() => handleDeleteClick(ip)}>
                  <Trash color="#ff3b30" />
                </IconButton>
              </div>
            </div>
          ))
        )}

      </div>
      {confirmPopup.open && (
        <>
          <div className="confirm-overlay" />

          <div className="confirm-modal small">
            <h4>Delete IP</h4>
            <p>
              Are you sure you want to delete IP{" "}
              <strong>{confirmPopup.ip.IPAddress}</strong>?
            </p>

            <div className="confirm-actions">
              <button
                className="confirm-cancel"
                onClick={() =>
                  setConfirmPopup({ open: false, ip: null })
                }
              >
                Cancel
              </button>

              <button
                className="confirm-delete"
                onClick={() => {
                  handleDeleteIp(confirmPopup.ip);
                  setConfirmPopup({ open: false, ip: null });
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </>
      )}

    </>
  );
};

export default IPSecurity;
