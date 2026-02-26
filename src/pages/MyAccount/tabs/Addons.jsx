import React, { useEffect, useState } from "react";
import { addonsData } from "../../../data/data";
import { getAddonDetail, updateProfile } from "../../../api/myAccountApi";
import toast from "react-hot-toast";
import axios from "axios";
import AppLoader from "../../../components/loaders/Loader";

const Addons = ({
  clientIp, LUId
}) => {
  const activeAddons = addonsData.filter((addon) => addon.active);
  const inactiveAddons = addonsData.filter((addon) => !addon.active);

  const [loading, setLoading] = useState(false);

  if (loading) {
    return <AppLoader text="Loading..." />;
  }

  return (
    <>
      <div
        style={{
          flex: 1,
          minHeight: "55vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            background: "#f5f5f785",
            border: "1px solid #e5e5e7",
            borderRadius: "20px",
            padding: "48px 56px",
            maxWidth: "620px",
            textAlign: "center",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.08)",
          }}
        >

          {/* TITLE */}
          <div
            style={{
              fontSize: "30px",
              fontWeight: 600,
              color: "#1d1d1f",
              marginBottom: "12px",
            }}
          >
            Coming Soon
          </div>

          {/* DESCRIPTION */}
          <div
            style={{
              fontSize: "12px",
              color: "#6e6e73",
              lineHeight: "1.6",
            }}
          >
            All add-ons activated in your account will be shown here
          </div>
        </div>
      </div>

      {inactiveAddons.length > 0 && (
        <div style={{ background: "#f5f5f7", padding: "0.1% 9.5%", paddingBottom: "2.5%" }}>
          <h1 style={{ marginBottom: "12px", fontSize: "38px", marginBottom: "35px" }}>
            Available Add-ons
          </h1>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
              gap: "28px",
              margin: "0% 0%",
            }}
          >
            {inactiveAddons.map((addon) => (
              <AddonCard key={addon.id} addon={addon} clientIp={clientIp} LUId={LUId} setLoading={setLoading} />
            ))}
          </div>
        </div>
      )}
    </>
  );
};

const PopupInput = ({ label, value, onChange, disabled, maxLength }) => (
  <div style={{ marginBottom: "14px" }}>
    <label
      style={{
        display: "block",
        fontSize: "18px",
        color: "#6e6e73",
        marginBottom: "6px",
      }}
    >
      {label}
    </label>
    <input
      value={value}
      disabled={disabled}
      maxLength={maxLength}
      onChange={(e) => onChange?.(e.target.value)}
      style={{
        width: "94%",
        padding: "10px 12px",
        borderRadius: "8px",
        border: "1px solid #d2d2d7",
        fontSize: "20px",
        background: disabled ? "#f5f5f7" : "#fff",
      }}
    />
  </div>
);

const AddTemplet = ({
  addonName,
  companyCode,
  clientName,
  contactNumber,
}) => {
  return `
<body style="margin:0; padding:0; background:#f5f7fb; font-family:Segoe UI, Roboto, Helvetica, Arial, sans-serif; color:#0f172a;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
        <tr>
            <td align="center" style="padding:32px 12px;">
                <table role="presentation" width="600" class="container" cellspacing="0" cellpadding="0" border="0" style="width:600px; max-width:600px; background:#ffffff; border-radius:14px; box-shadow:0 6px 24px rgba(2,6,23,0.06); overflow:hidden;">
                    <!-- Header -->
                    <tr>
                        <td style="background: #8C8C8C; padding:20px 24px;">
                            <table width="100%" role="presentation" cellspacing="0" cellpadding="0" border="0">
                                <tr>
                                    <td align="left">
                                        <a href="https://optigoapps.com" target="_blank" style="text-decoration:none;">
                                            <span style="display:inline-block; font-weight:700; font-size:18px; color:#ffffff; letter-spacing:0.3px;">OptigoApps</span>
                                        </a>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <!-- Greeting / Intro -->
                    <tr>
                        <td class="card" style="padding:28px 28px 8px 28px;">
                            <p style="margin-top: 0;"><strong>Hello Team,</strong></p>
                            <p style="margin:0 0 12px 0; font-size:14px; line-height:22px; color:#334155;">
                                <strong>Great news!</strong>
                            </p>
                            <p style="margin:0; font-size:14px; line-height:22px; color:#334155;">
                                A client has requested activation of a new Add-On feature, indicating strong engagement and upsell potential.
                            </p>
                        </td>
                    </tr>
                    <!-- Requested Add-On Section -->
                    <tr>
                        <td class="card" style="padding:8px 28px 8px 28px;">
                            <p style="margin:0 0 8px 0; font-size:14px; font-weight:600; color:#0f172a;">Requested Add-On</p>
                            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-bottom:16px;">
                                <tr>
                                    <td style="font-size:14px; color:#0f172a; padding:10px 12px; background:#f1f5f9; border-radius:10px; ">
                                        ${addonName}
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <!-- Client Details Section -->
                    <tr>
                        <td class="card" style="padding:8px 28px 8px 28px;">
                            <p style="margin:0 0 8px 0; font-size:14px; font-weight:600; color:#0f172a;">Client Details</p>
                            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="border-collapse:separate; border-spacing:0 8px;">
                                <tr>
                                    <td width="34%" style="font-size:13px; color:#64748b; padding:10px 12px; background:#f8fafc; border-radius:10px 0 0 10px;">Company Code</td>
                                    <td style="font-size:14px; color:#0f172a; padding:10px 12px; background:#f1f5f9; border-radius:0 10px 10px 0;">
                                        ${companyCode}
                                    </td>
                                </tr>
                                <tr>
                                    <td width="34%" style="font-size:13px; color:#64748b; padding:10px 12px; background:#f8fafc; border-radius:10px 0 0 10px;">Client Name</td>
                                    <td style="font-size:14px; color:#0f172a; padding:10px 12px; background:#f1f5f9; border-radius:0 10px 10px 0;">
                                        ${clientName}
                                    </td>
                                </tr>
                                <tr>
                                    <td width="34%" style="font-size:13px; color:#64748b; padding:10px 12px; background:#f8fafc; border-radius:10px 0 0 10px;">Contact Number</td>
                                    <td style="font-size:14px; color:#0f172a; padding:10px 12px; background:#f1f5f9; border-radius:0 10px 10px 0;">
                                        <a href="tel:${contactNumber}" style="color:#4f46e5; text-decoration:none;">${contactNumber}</a>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <!-- Additional Context -->
                    <tr>
                        <td style="padding:8px 28px 8px 28px;">
                            <p style="margin:0; font-size:14px; line-height:22px; color:#334155;">
                                This request has been raised directly from the <strong>My Account → Add-Ons</strong> section, showing clear intent to proceed.
                            </p>
                        </td>
                    </tr>
                    <!-- Next Steps Section -->
                    <tr>
                        <td class="card" style="padding:8px 28px 8px 28px;">
                            <p style="margin:0 0 8px 0; font-size:14px; font-weight:600; color:#0f172a;">Next Steps</p>
                            <ul style="margin:0; padding-left:20px; font-size:14px; line-height:22px; color:#334155;">
                                <li style="margin-bottom:6px;">Connect with the client promptly</li>
                                <li style="margin-bottom:6px;">Understand usage scope and expectations</li>
                                <li style="margin-bottom:0;">Guide them through activation and commercial closure</li>
                            </ul>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding:16px 28px 8px 28px;">
                            <p style="margin:0; font-size:14px; line-height:22px; color:#334155;">
                                Let's ensure a smooth and proactive experience for the client.
                            </p>
                        </td>
                    </tr>
                    <!-- Footer -->
                    <tr>
                        <td style="padding:24px 28px 28px 28px;">
                            <p style="margin:0 0 6px 0; font-size:14px; color:#64748b;">Thank you,</p>
                            <p style="margin:0; font-size:14px;"><strong>Optigo Apps</strong></p>
                        </td>
                    </tr>
                </table>

                <div style="padding:16px 0 0 0; font-size:11px; color:#94a3b8;">
                    System-generated internal notification
                </div>
            </td>
        </tr>
    </table>
</body>
`;
};

const AddonCard = ({ addon, clientIp, LUId, setLoading }) => {
  const [showRequestPopup, setShowRequestPopup] = useState(false);
  const [selectedAddon, setSelectedAddon] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [formData, setFormData] = useState({
    companyCode: "",
    firstName: "",
    lastName: "",
    contactNo: "",
    title: ""
  });
  const userDetail = sessionStorage.getItem("ufcc");
  console.log('formData: ', formData);

  useEffect(() => {
    const fetchAddonDetail = async () => {
      const body = {
        con: JSON.stringify({
          mode: "getAddonDetail",
          appuserid: LUId,
          IPAddress: clientIp,
        }),
        p: "",
        f: "MyAccount ( getAddonDetail )",
      };

      try {
        const res = await getAddonDetail(body);

        const rd = res?.Data?.rd?.[0];
        if (rd) {
          setProfileData(rd);
        }
      } catch (err) {
        toast.error(err.message || "Failed to fetch details");
      }
    };

    fetchAddonDetail();
  }, [LUId, clientIp]);



  const handleCancel = () => {
    setShowRequestPopup(false);
    setSelectedAddon(null);
  };

  const handleSubmitAddon = async () => {
    try {

      const ufcc = sessionStorage.getItem('ufcc');
      const loginUser = JSON.parse(sessionStorage.getItem('loginUser'));
      const htmlTemplate = AddTemplet({
        addonName: selectedAddon?.name,
        companyCode: formData.companyCode,
        clientName: `${formData.firstName} ${formData.lastName}`,
        contactNumber: formData.contactNo,
      });

      // "https://apilx.optigoapps.com/api/sendemail",

      const formDataApi = new FormData();

      formDataApi.append("fromEmail", "noreply@optigoapps.com");
      formDataApi.append("toEmail", JSON.stringify(["sales@orail.in"]));
      formDataApi.append("htmlTemplate", htmlTemplate);
      formDataApi.append("ccEmail", "");
      formDataApi.append("bccEmail", "");
      formDataApi.append("replyTo", "");
      formDataApi.append("subject", "Add-On Feature Request Received - ");
      formDataApi.append("message", "");
      formDataApi.append("mode", "addonrequest");
      formDataApi.append("ufcc", ufcc);
      formDataApi.append("templateNo", 0);

      const response = await axios.post(
        "http://newnextjs.web/api/sendemail",
        formDataApi,
        {
          headers: {
            YearCode: btoa(loginUser?.YearCode),
            sv: loginUser?.SV,
          },
        }
      );
      if (response?.status == 200) {
        setLoading(false);
        setShowRequestPopup(false);
        setShowToast(true);
        setTimeout(() => {
          setShowToast(false);
          setSelectedAddon(null);
        }, 3500);
      }
      setLoading(false);
    } catch (err) {
      setLoading(false);
      toast.error("Failed to submit request");
      console.error(err);
    }
  };




  return (
    <div
      style={{
        background: "#ffffff",
        borderRadius: "8px",
        padding: "24px",
        border: "1px solid var(--border-light)",
        display: "flex",
        flexDirection: "column",
        minHeight: "275px",
        boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
      }}
    >
      {addon.active && (
        <div
          style={{
            background: "#f5f5f7",
            padding: "16px 18px",
            borderTopLeftRadius: "8px",
            borderTopRightRadius: "8px",
            margin: "-24px -24px 16px -24px",
          }}
        >
          <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "10px",
                background: "#e5e5ea",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "22px",
              }}
            >
              <img
                src={addon.icon}
                alt={addon.name}
                style={{
                  width: "36px",
                  height: "36px",
                  objectFit: "contain",
                  borderRadius: "8px"
                }}
              />
            </div>

            <div>
              <h3 style={{ margin: 0, fontSize: "21px" }}>{addon.name}</h3>
              <span style={{ fontSize: "18px", color: "#6e6e73" }}>
                {addon.subText}
              </span>
            </div>
          </div>
        </div>
      )}

      {!addon.active && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            marginBottom: "14px",
            maxWidth: "430px",
          }}
        >
          <div
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "10px",
              // background: "#0071e3",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontSize: "22px",
            }}
          >
            <img
              src={addon.icon}
              alt={addon.name}
              style={{
                width: "36px",
                height: "36px",
                objectFit: "contain",
                borderRadius: "8px"
              }}
            />
          </div>

          <h3 style={{ margin: 0, fontSize: "21px" }}>{addon.name}</h3>
        </div>
      )}

      {addon.descriptions ? (
        Array.isArray(addon.descriptions) ? (
          addon.descriptions.map((desc, index) => (
            <p
              key={index}
              style={{
                fontSize: "18px",
                color: "var(--text-secondary)",
                lineHeight: "1.6",
                marginBottom: "8px",
                margin: "0px",
              }}
            >
              {desc}
            </p>
          ))
        ) : (
          <p
            style={{
              fontSize: "14px",
              color: "var(--text-secondary)",
              lineHeight: "1.6",
              marginBottom: "16px",
              margin: "0px",
            }}
          >
            {addon.descriptions}
          </p>
        )
      ) : (
        <p
          style={{
            fontSize: "14px",
            color: "var(--text-secondary)",
            lineHeight: "1.6",
            marginBottom: "16px",
            margin: "0px",
          }}
        >
          {addon.description}
        </p>
      )}

      <div
        style={{
          marginTop: "auto",
          paddingTop: "14px",
          borderTop: "1px dashed var(--border-light)",
          display: "flex",
          justifyContent: "center",
        }}
      >
        {addon.active ? (
          <span
            style={{
              padding: "8px 18px",
              borderRadius: "20px",
              background: "rgba(0, 113, 227, 0.12)",
              color: "#0071e3",
              fontWeight: 600,
              fontSize: "18px",
            }}
          >
            Active
          </span>
        ) : (
          <button
            onClick={() => {
              setSelectedAddon(addon);
              if (profileData) {
                setFormData({
                  companyCode: userDetail, // keep if coming from elsewhere
                  firstName: profileData.firstname || "",
                  lastName: profileData.lastname || "",
                  title: addon.name || "",
                  contactNo: profileData.mobileno?.replace(/\D/g, "") || "",
                });
              }

              setShowRequestPopup(true);
            }}
            style={{
              padding: "8px 22px",
              borderRadius: "20px",
              border: "none",
              cursor: "pointer",
              background: "#0071e3",
              color: "#fff",
              fontWeight: 600,
              fontSize: "18px",
            }}
          >
            + Add
          </button>
        )}
      </div>
      {showRequestPopup && (
        <>
          {/* Overlay */}
          <div
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.35)",
              zIndex: 999,
            }}
            onClick={() => setShowRequestPopup(false)}
          />

          {/* Popup */}
          <div
            style={{
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              background: "#fff",
              padding: "28px",
              borderRadius: "10px",
              width: "420px",
              zIndex: 1000,
            }}
          >
            <h3 style={{ margin: "0px", marginBottom: "16px", fontSize: "22px" }}>
              Request Add-on - {formData?.title}
            </h3>

            <PopupInput
              label="Company Code"
              value={formData.companyCode}
              disabled
            />

            <PopupInput
              label="First Name"
              value={formData.firstName}
              onChange={(v) =>
                setFormData({ ...formData, firstName: v })
              }
            />

            <PopupInput
              label="Last Name"
              value={formData.lastName}
              onChange={(v) =>
                setFormData({ ...formData, lastName: v })
              }
            />

            <PopupInput
              label="Contact No"
              value={formData.contactNo}
              onChange={(v) => {
                if (/^\d*$/.test(v)) {
                  setFormData({ ...formData, contactNo: v });
                }
              }}
              maxLength={10}
            />

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: "20px",
                gap: "12px",
              }}
            >
              {/* CANCEL */}
              <button
                onClick={handleCancel}
                style={{
                  width: "50%",
                  padding: "10px 20px",
                  borderRadius: "8px",
                  border: "1px solid #d2d2d7",
                  background: "#f5f5f7",
                  fontSize: "16px",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>

              {/* SUBMIT */}
              <button
                onClick={handleSubmitAddon}
                style={{
                  width: "50%",
                  padding: "10px 26px",
                  borderRadius: "8px",
                  border: "none",
                  background: "#0071e3",
                  color: "#fff",
                  fontSize: "16px",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Submit
              </button>
            </div>
          </div>
        </>
      )}
      {showToast && selectedAddon && (
        <div
          style={{
            position: "fixed",
            top: "30px",
            left: "50%",
            transform: "translateX(-50%)",
            background: "rgb(29, 29, 31)",
            color: "#fff",
            padding: "14px 24px",
            borderRadius: "12px",
            fontSize: "14px",
            zIndex: 1100,
            boxShadow: "0 5px 15px rgba(0,0,0,0.25)",
          }}
        >
          Your requset for {" "}
          <strong style={{ color: "#fff" }}>{selectedAddon.name}</strong> {" "}
          <span style={{ color: "#fff" }}>has been submitted successfully. Our team will contact you shortly.</span>
        </div>
      )}
    </div>

  );
};

export default Addons;