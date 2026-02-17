import React, { useEffect, useState } from "react";
import { TextField, Button, Typography, Box } from "@mui/material";
import axios from "axios";
import toast from "react-hot-toast";
import SHA1 from "crypto-js/sha1";


const decodeBase64Payload = (encoded) => {
    try {
        return JSON.parse(
            decodeURIComponent(escape(atob(encoded)))
        );
    } catch (err) {
        console.error("Invalid URL payload");
        return null;
    }
};

const CreateUser = ({ clientIp }) => {
    const [formData, setFormData] = useState({
        userId: "",
        userCode: "",
        firstName: "",
        lastName: "",
        password: "",
    });
    const [loading, setLoading] = useState(false);
    const [apiConfig, setApiConfig] = useState({
        YearCode: "",
        SV: "",
        Version: "",
        rptapiurl: ""
    });

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const encodedData = params.get("data");

        if (!encodedData) {
            toast.error("Invalid access: Missing configuration");
            return;
        }

        const decoded = decodeBase64Payload(encodedData);

        if (!decoded) {
            toast.error("Invalid configuration data");
            return;
        }

        setApiConfig({
            YearCode: decoded.YearCode,
            SV: decoded.SV,
            Version: decoded.Version,
            rptapiurl: decoded.rptapiurl
        });
    }, []);

    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    console.log('apiConfig: ', apiConfig , btoa(apiConfig?.YearCode));
    const handleSubmit = async () => {
        const { userId, userCode, firstName, lastName, password } = formData;
        const { YearCode, SV, Version, rptapiurl } = apiConfig;
        if (!userId || !userCode || !firstName || !lastName || !password) {
            toast.error("All fields are required!");
            return;
        }
        const sha1Password = SHA1(password).toString();
        const payload = {
            con: JSON.stringify({
                mode: "CreateMyAccAdmin",
                appuserid: "",
                IPAddress: clientIp,
            }),
            p: JSON.stringify({
                userid: userId,
                usercode: userCode,
                firstname: firstName,
                lastname: lastName,
                password: sha1Password,
            }),
            f: "MyAccount ( gettoken )",
        };
        setLoading(true);
        try {
            const response = await axios.post(rptapiurl, payload, {
                headers: {
                    "YearCode": btoa(YearCode),
                    "version": Version,
                    "sv": SV,
                    "sp": 106,
                },
            });
            console.log("API Response:", response.data);
            toast.success("User created successfully!");
        } catch (error) {
            console.error("API Error:", error.response || error);
            toast.error(error?.response?.data?.message || "Failed to create user");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ maxWidth: 500, margin: "50px auto", p: 3, border: "1px solid #ccc", borderRadius: 2 }}>
            <Typography variant="h5" mb={2}>Create User</Typography>
            <TextField
                label="User ID"
                name="userId"
                fullWidth
                margin="normal"
                value={formData.userId}
                onChange={handleChange}
            />
            <TextField
                label="User Code"
                name="userCode"
                fullWidth
                margin="normal"
                value={formData.userCode}
                onChange={handleChange}
            />
            <TextField
                label="First Name"
                name="firstName"
                fullWidth
                margin="normal"
                value={formData.firstName}
                onChange={handleChange}
            />
            <TextField
                label="Last Name"
                name="lastName"
                fullWidth
                margin="normal"
                value={formData.lastName}
                onChange={handleChange}
            />
            <TextField
                label="Password"
                type="password"
                name="password"
                fullWidth
                margin="normal"
                value={formData.password}
                onChange={handleChange}
            />

            <Button
                variant="contained"
                color="primary"
                fullWidth
                sx={{ mt: 2 }}
                onClick={handleSubmit}
                disabled={loading}
            >
                {loading ? "Creating..." : "Create User"}
            </Button>
        </Box>
    );
};

export default CreateUser;