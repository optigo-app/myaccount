import React, { useEffect, useState } from "react";
import "./Profile.scss";
import managementIcon from "../../../../assets/profile/fa7-solid--users-cog.svg";
import technicalIcon from "../../../../assets/profile/technical.svg";
import accountIcon from "../../../../assets/profile/account.svg";
import {
    updateManagementInfo,
    updateTechInfo,
    updateAccountInfo,
} from "../../../../api/myAccountApi";
import toast from "react-hot-toast";

const FormField = React.memo(function FormField({
    label,
    value,
    onChange,
    error,
    type = "text",
}) {
    return (
        <div className="profile-form-field">
            <label>{label}</label>

            <input
                type="text"
                inputMode={type === "tel" ? "numeric" : "text"}
                value={value}
                onChange={(e) => {
                    if (type === "tel") {
                        // 🔒 allow digits only
                        const digitsOnly = e.target.value.replace(/\D/g, "");
                        onChange(digitsOnly);
                    } else {
                        onChange(e.target.value);
                    }
                }}
                className={error ? "input-error" : ""}
            />

            {error && <span className="field-error-text">{error}</span>}
        </div>
    );
});

const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const isValidMobile = (mobile) => {
    return /^\d{10}$/.test(mobile);
};

const validateSection = (data) => {
    const errors = {};

    Object.keys(data).forEach((key) => {
        const value = data[key]?.trim();

        // REQUIRED FIELDS
        if (!value) {
            errors[key] = true;
            return;
        }

        // Mobile validation
        if (key === "mobile" && !isValidMobile(value)) {
            errors[key] = "Enter valid 10-digit mobile number";
            return;
        }

        // Email1 validation
        if ((key === "email1" || key === "email2" || key === "email3") && !isValidEmail(value)) {
            errors[key] = "Enter valid email address";
            return;
        }
    });

    return errors;
};

const Profile = ({ setOpenEditProfile, profileData, clientIp, LUId }) => {
    const [activeSection, setActiveSection] = useState(null);
    const [originalSectionsData, setOriginalSectionsData] = useState(null);
    const [profileSectionsData, setProfileSectionsData] = useState({
        management: {
            firstName: profileData?.mnginfo_firstname || "",
            lastName: profileData?.mnginfo_lastname || "",
            designation: profileData?.mnginfo_designation || "",
            mobile: profileData?.mnginfo_mobileno || "",
            email1: profileData?.mnginfo_email1 || "",
            email2: profileData?.mnginfo_email2 || "",
            email3: profileData?.mnginfo_email3 || "",
            yearsInOrg: profileData?.mnginfo_yearsinorganization || ""
        },
        technical: {
            firstName: profileData?.techinfo_firstname || "",
            lastName: profileData?.techinfo_lastname || "",
            designation: profileData?.techinfo_designation || "",
            mobile: profileData?.techinfo_mobileno || "",
            email1: profileData?.techinfo_email1 || "",
            email2: profileData?.techinfo_email2 || "",
            email3: profileData?.techinfo_email3 || "",
            yearsInOrg: profileData?.techinfo_yearsinorganization || ""
        },
        account: {
            firstName: profileData?.billinfo_firstname || "",
            lastName: profileData?.billinfo_lastname || "",
            designation: profileData?.billinfo_designation || "",
            mobile: profileData?.billinfo_mobileno || "",
            email1: profileData?.billinfo_email1 || "",
            email2: profileData?.billinfo_email2 || "",
            email3: profileData?.billinfo_email3 || "",
            yearsInOrg: profileData?.billinfo_yearsinorganization || ""
        }
    });
    const [fieldErrors, setFieldErrors] = useState({});
    const [saving, setSaving] = useState(false);
    useEffect(() => {
        const initialData = {
            management: {
                firstName: profileData?.mnginfo_firstname || "",
                lastName: profileData?.mnginfo_lastname || "",
                designation: profileData?.mnginfo_designation || "",
                mobile: profileData?.mnginfo_mobileno || "",
                email1: profileData?.mnginfo_email1 || "",
                email2: profileData?.mnginfo_email2 || "",
                email3: profileData?.mnginfo_email3 || "",
                yearsInOrg: profileData?.mnginfo_yearsinorganization || ""
            },
            technical: {
                firstName: profileData?.techinfo_firstname || "",
                lastName: profileData?.techinfo_lastname || "",
                designation: profileData?.techinfo_designation || "",
                mobile: profileData?.techinfo_mobileno || "",
                email1: profileData?.techinfo_email1 || "",
                email2: profileData?.techinfo_email2 || "",
                email3: profileData?.techinfo_email3 || "",
                yearsInOrg: profileData?.techinfo_yearsinorganization || ""
            },
            account: {
                firstName: profileData?.billinfo_firstname || "",
                lastName: profileData?.billinfo_lastname || "",
                designation: profileData?.billinfo_designation || "",
                mobile: profileData?.billinfo_mobileno || "",
                email1: profileData?.billinfo_email1 || "",
                email2: profileData?.billinfo_email2 || "",
                email3: profileData?.billinfo_email3 || "",
                yearsInOrg: profileData?.billinfo_yearsinorganization || ""
            }
        };

        setProfileSectionsData(initialData);
        setOriginalSectionsData(initialData);

    }, [profileData]);

    // const STORAGE_KEY = "optigo_profile_sections";
    // useEffect(() => {
    //     const saved = localStorage.getItem(STORAGE_KEY);
    //     if (saved) {
    //         setProfileSectionsData(JSON.parse(saved));
    //     }
    // }, []);

    const updateSectionField = (section, field, value) => {
        setProfileSectionsData((prev) => ({
            ...prev,
            [section]: {
                ...prev[section],
                [field]: value
            }
        }));
    };
    const closeSection = () => {
        if (originalSectionsData) {
            setProfileSectionsData(originalSectionsData);
        }
        setActiveSection(null);
        setFieldErrors({});
    };


    const SECTION_META = {
        management: {
            title: "Management Info",
            color: "#0A84FF" // blue
        },
        technical: {
            title: "Technical Info",
            color: "#FF9F0A" // yellow/orange
        },
        account: {
            title: "Account Info",
            color: "#FF3B30" // red
        }
    };

    const isSectionIncomplete = (sectionKey) => {
        const sectionData = profileSectionsData[sectionKey];
        return Object.values(sectionData).some(
            (value) => value.trim() === ""
        );
    };

    const saveSection = async (sectionKey) => {
        if (saving) return;

        const sectionData = profileSectionsData[sectionKey];

        const errors = validateSection(sectionData);
        setFieldErrors(errors);
        if (Object.keys(errors).length > 0) return;

        setSaving(true);

        let apiFn;
        let mode;

        if (sectionKey === "management") {
            apiFn = updateManagementInfo;
            mode = "updateManagementInfo";
        } else if (sectionKey === "technical") {
            apiFn = updateTechInfo;
            mode = "updateTechInfo";
        } else {
            apiFn = updateAccountInfo;
            mode = "updateAccountInfo";
        }

        const body = buildUpdateBody(mode, sectionData);

        try {
            await apiFn(body);
            toast.success("Details updated successfully");
        } catch (err) {
            toast.error(err?.message || "Update failed");
        } finally {
            setSaving(false);
        }
    };

    const buildUpdateBody = (mode, sectionData) => ({
        con: JSON.stringify({
            mode,
            appuserid: LUId,
            IPAddress: clientIp,
        }),
        p: JSON.stringify({
            designation: sectionData.designation,
            firstname: sectionData.firstName,
            lastname: sectionData.lastName,
            mobileno: sectionData.mobile,
            email1: sectionData.email1,
            email2: sectionData.email2,
            email3: sectionData.email3,
            yearsinorganization: sectionData.yearsInOrg,
        }),
        f: "MyAccount ( gettoken )",
    });

    return (
        <div className="profile-container">
            {activeSection === null && (
                <>
                    {/* PROFILE CARD */}
                    <div className="profile-card">
                        <div className="profile-header">
                            <button
                                className="profile-edit-btn"
                                onClick={() => setOpenEditProfile(true)}
                            >
                                Edit
                            </button>
                        </div>

                        <div className="profile-grid">
                            <ProfileField label="Full Name" value={profileData.basicinfo_firstname + " " + profileData.basicinfo_lastname || ""} />
                            <ProfileField label="Company" value={profileData.cmpinfo_companyname || ""} />
                            <ProfileField label="Default Currency" value={profileData.Country_CurrencyCode || ""} />

                            <ProfileField label="Mobile No" value={profileData.basicinfo_mobileno || ""} />
                            <ProfileField label="Office No" value={profileData.cmpinfo_officeph || ""} />
                            <ProfileField label="Email" value={profileData.basicinfo_email || ""} />

                            <ProfileField
                                label="Address"
                                value={profileData.cmpinfo_addressline1 + " " + profileData.cmpinfo_addressline2 + " " + profileData.cmpinfo_state + "  " + profileData.cmpinfo_postalcode || ""}
                                full
                            />
                        </div>
                    </div>

                    {/* PROFILE INFO CARDS */}
                    <div className="profile-info-grid">
                        <div className="profile-info-warning-wrapper">
                            <div className="profile-info-card" onClick={() => setActiveSection("management")}>
                                <img src={managementIcon} alt="Management Info" />
                                <span>Management Info</span>
                            </div>
                            {isSectionIncomplete("management") && (
                                <div className="profile-info-warning">
                                    Please fill up the details
                                </div>
                            )}
                        </div>

                        <div className="profile-info-warning-wrapper">
                            <div className="profile-info-card" onClick={() => setActiveSection("technical")}>
                                <img src={technicalIcon} alt="Technical Info" />
                                <span>Technical Info</span>
                            </div>
                            {isSectionIncomplete("technical") && (
                                <div className="profile-info-warning">
                                    Please fill up the details
                                </div>
                            )}
                        </div>

                        <div className="profile-info-warning-wrapper">
                            <div className="profile-info-card" onClick={() => setActiveSection("account")}>
                                <img src={accountIcon} alt="Account Info" />
                                <span>Account Info</span>
                            </div>
                            {isSectionIncomplete("account") && (
                                <div className="profile-info-warning">
                                    Please fill up the details
                                </div>
                            )}
                        </div>
                    </div>
                </>
            )}

            {activeSection && (
                <div className="profile-section-header">
                    <button
                        className="profile-section-back"
                        onClick={closeSection}
                    >
                        ←
                    </button>

                    <h2
                        style={{ color: SECTION_META[activeSection].color }}
                    >
                        {SECTION_META[activeSection].title}
                    </h2>
                </div>
            )}

            {activeSection === "management" && (
                <div className="profile-section-body">

                    <div className="profile-form-grid">
                        <FormField
                            label="First Name"
                            value={profileSectionsData.management.firstName}
                            error={fieldErrors.firstName}
                            onChange={(v) =>
                                updateSectionField("management", "firstName", v)
                            }
                        />

                        <FormField
                            label="Last Name"
                            value={profileSectionsData.management.lastName}
                            error={fieldErrors.lastName}
                            onChange={(v) =>
                                updateSectionField("management", "lastName", v)
                            }
                        />

                        <FormField
                            label="Designation"
                            value={profileSectionsData.management.designation}
                            error={fieldErrors.designation}
                            onChange={(v) =>
                                updateSectionField("management", "designation", v)
                            }
                        />

                        <FormField
                            label="Mobile No."
                            type="tel"
                            value={profileSectionsData.management.mobile}
                            error={fieldErrors.mobile}
                            onChange={(v) => updateSectionField("management", "mobile", v)}
                        />

                        <FormField
                            label="E-Mail ID 1"
                            value={profileSectionsData.management.email1}
                            error={fieldErrors.email1}
                            onChange={(v) =>
                                updateSectionField("management", "email1", v)
                            }
                        />

                        <FormField
                            label="E-Mail ID 2"
                            value={profileSectionsData.management.email2}
                            error={fieldErrors.email2}
                            onChange={(v) =>
                                updateSectionField("management", "email2", v)
                            }
                        />

                        <FormField
                            label="E-Mail ID 3"
                            value={profileSectionsData.management.email3}
                            error={fieldErrors.email3}
                            onChange={(v) =>
                                updateSectionField("management", "email3", v)
                            }
                        />

                        <FormField
                            label="No. of years in organization"
                            value={profileSectionsData.management.yearsInOrg}
                            error={fieldErrors.yearsInOrg}
                            onChange={(v) =>
                                updateSectionField("management", "yearsInOrg", v)
                            }
                        />
                    </div>

                    <div className="profile-form-actions">
                        <button
                            className="profile-save-btn"
                            onClick={() => saveSection("management")}
                        >
                            Save
                        </button>
                    </div>

                </div>
            )}

            {activeSection === "technical" && (
                <div className="profile-section-body">

                    <div className="profile-form-grid">
                        <FormField
                            label="First Name"
                            value={profileSectionsData.technical.firstName}
                            error={fieldErrors.firstName}
                            onChange={(v) =>
                                updateSectionField("technical", "firstName", v)
                            }
                        />

                        <FormField
                            label="Last Name"
                            value={profileSectionsData.technical.lastName}
                            error={fieldErrors.lastName}
                            onChange={(v) =>
                                updateSectionField("technical", "lastName", v)
                            }
                        />

                        <FormField
                            label="Designation"
                            value={profileSectionsData.technical.designation}
                            error={fieldErrors.designation}
                            onChange={(v) =>
                                updateSectionField("technical", "designation", v)
                            }
                        />

                        <FormField
                            label="Mobile No."
                            type="tel"
                            value={profileSectionsData.technical.mobile}
                            error={fieldErrors.mobile}
                            onChange={(v) => updateSectionField("technical", "mobile", v)}
                        />

                        <FormField
                            label="E-Mail ID 1"
                            value={profileSectionsData.technical.email1}
                            error={fieldErrors.email1}
                            onChange={(v) =>
                                updateSectionField("technical", "email1", v)
                            }
                        />

                        <FormField
                            label="E-Mail ID 2"
                            value={profileSectionsData.technical.email2}
                            error={fieldErrors.email2}
                            onChange={(v) =>
                                updateSectionField("technical", "email2", v)
                            }
                        />

                        <FormField
                            label="E-Mail ID 3"
                            value={profileSectionsData.technical.email3}
                            error={fieldErrors.email3}
                            onChange={(v) =>
                                updateSectionField("technical", "email3", v)
                            }
                        />

                        <FormField
                            label="No. of years in organization"
                            value={profileSectionsData.technical.yearsInOrg}
                            error={fieldErrors.yearsInOrg}
                            onChange={(v) =>
                                updateSectionField("technical", "yearsInOrg", v)
                            }
                        />
                    </div>

                    <div className="profile-form-actions">
                        <button
                            className="profile-save-btn"
                            onClick={() => saveSection("technical")}
                        >
                            Save
                        </button>
                    </div>

                </div>
            )}

            {activeSection === "account" && (
                <>
                    <div className="profile-section-body">

                        <div className="profile-form-grid">
                            <FormField
                                label="First Name"
                                value={profileSectionsData.account.firstName}
                                error={fieldErrors.firstName}
                                onChange={(v) => updateSectionField("account", "firstName", v)}
                            />

                            <FormField
                                label="Last Name"
                                value={profileSectionsData.account.lastName}
                                error={fieldErrors.lastName}
                                onChange={(v) => updateSectionField("account", "lastName", v)}
                            />

                            <FormField
                                label="Designation"
                                value={profileSectionsData.account.designation}
                                error={fieldErrors.designation}
                                onChange={(v) => updateSectionField("account", "designation", v)}
                            />

                            <FormField
                                label="Mobile No."
                                type="tel"
                                value={profileSectionsData.account.mobile}
                                error={fieldErrors.mobile}
                                onChange={(v) => updateSectionField("account", "mobile", v)}
                            />

                            <FormField
                                label="E-Mail ID 1"
                                value={profileSectionsData.account.email1}
                                error={fieldErrors.email1}
                                onChange={(v) => updateSectionField("account", "email1", v)}
                            />

                            <FormField
                                label="E-Mail ID 2"
                                value={profileSectionsData.account.email2}
                                error={fieldErrors.email2}
                                onChange={(v) => updateSectionField("account", "email2", v)}
                            />

                            <FormField
                                label="E-Mail ID 3"
                                value={profileSectionsData.account.email3}
                                error={fieldErrors.email3}
                                onChange={(v) => updateSectionField("account", "email3", v)}
                            />

                            <FormField
                                label="No. of years in organization"
                                value={profileSectionsData.account.yearsInOrg}
                                error={fieldErrors.yearsInOrg}
                                onChange={(v) => updateSectionField("account", "yearsInOrg", v)}
                            />
                        </div>

                        <div className="profile-form-actions">
                            <button
                                className="profile-save-btn"
                                onClick={() => saveSection("account")}
                            >
                                Save
                            </button>

                        </div>

                    </div>
                </>
            )}
        </div>
    );
};

const ProfileField = ({ label, value, full }) => (
    <div className={`profile-field ${full ? "full-width" : ""}`}>
        <span className="profile-label">{label}</span>
        <span className="profile-value">{value}</span>
    </div>
);

export default Profile;