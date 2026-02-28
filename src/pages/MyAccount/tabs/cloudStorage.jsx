import React, { useEffect, useState } from "react";
import "./CloudStorage.scss";
import { Link, Box, Typography, Stack, Collapse, Divider, IconButton, createTheme, ThemeProvider, Card } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { getCloudStorageData } from "../../../api/myAccountApi";
import { useMinDelay } from "../../../hooks/useMinDelay";
import AppLoader from "../../../components/loaders/Loader";
import Cloud from '../../../assets/cloud_d.png';
import InfoRoundedIcon from '@mui/icons-material/InfoRounded';
import { PremiumTooltip } from "../../ui/Tooltip";

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
    data: true,
    files: false,
  });
  const minDelayDone = useMinDelay(500);
  const theme = createTheme({
    typography: {
      fontFamily: `Google Sans, sans-serif !important`,
    },
  });

  const [storageData, setStorageData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!clientIp || !LUId) return;

    setLoading(true);

    getCloudStorageData(clientIp, LUId)
      .then((res) => {
        setStorageData(res.Data);
      })
      .catch((err) => {
        console.error("CloudStorage API error:", err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [clientIp, LUId]);

  const toggle = (key) => {
    setOpenSections((prev) => ({
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
    color: generateColorByIndex(index),
  }));

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{
        width: "100%", height: "100%", bgcolor: "#ffffff", py: 4,
        fontFamily: `Figtree Variable, sans-serif !important`
      }}>
        <Box sx={{ width: '80%', mx: "auto" }}>
          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={{ xs: 4, md: 6 }}
          >
            <Box sx={{ flex: 0.7 }}>
              <Box sx={{ mb: 6 }}>
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 1, color: "#1d1d1f" }}>
                  Your Cloud Storage
                </Typography>
                <Typography variant="body1" sx={{ color: "#6e6e73" }}>
                  Use your Cloud storage to keep your most important information.
                </Typography>
              </Box>

              <StorageAccordion
                title="Data Storage"
                isOpen={openSection.data}
                onToggle={() => toggle("data")}
                total={`${totalDataStorage} GB`}
                used={totalDataStorage}
                segments={dataSegments}
                details={dataStorage}
                tooltipMsg={`Stores system and transaction data generated through software usage.`}
              />

              <StorageAccordion
                title="File Storage"
                isOpen={openSection.files}
                onToggle={() => toggle("files")}
                total={`${totalFilStorage} GB`}
                used={totalFilStorage}
                segments={[
                  {
                    percent: totalFilStorage * 100,
                    color: "#007AFF",
                  },
                ]}
                isExpandable={false}
                tooltipMsg=
                {`Stores uploaded files like images, videos, and documents.`}
              />
            </Box>

            <Divider
              orientation="vertical"
              flexItem
              style={{
                marginTop: '85px'
              }}
              sx={{ display: { xs: "none", md: "block" }, borderColor: "#e5e5e7" }}
            />

            <Box sx={{ flex: 0.8, mt: 8, display: "flex", flexDirection: "column" }}>

              <Card
                elevation={0}
                sx={{
                  mt: 14,
                  maxWidth: 500,
                  borderRadius: "16px",
                  backgroundColor: "#f5f5f78a",
                  overflow: "hidden",
                  border: "1px solid rgba(0,0,0,0.04)",
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", sans-serif',
                }}
              >
                <Box
                  component="img"
                  src={Cloud}
                  alt="Cloud Storage Manager"
                  sx={{
                    width: "100%",
                    objectFit: "contain",
                    display: "block",
                  }}
                />
                <Box sx={{ p: "24px" }}>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 600,
                      fontSize: "17px",
                      color: "#1d1d1f",
                      mb: 1.5,
                      letterSpacing: "-0.02em",
                    }}
                  >
                    Benefits of Cloud Storage
                  </Typography>

                  <Stack spacing={1.2}>
                    {[
                      "Access your data anytime, from anywhere.",
                      "Track data storage easily.",
                      "Secure and centralized data management.",
                      "Smooth performance without local storage dependency.",
                    ].map((text, index) => (
                      <Box key={index} sx={{ display: "flex", alignItems: "flex-start" }}>
                        {/* Custom Dot to look like Apple's styling */}
                        <Typography
                          sx={{
                            color: "#86868b",
                            fontSize: "14px",
                            mr: 1,
                            lineHeight: "20px",
                          }}
                        >
                          •
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            color: "#424245", // Slightly darker gray for readability
                            fontSize: "14px",
                            lineHeight: "20px",
                            fontWeight: 400,
                            letterSpacing: "-0.01em",
                          }}
                        >
                          {text}
                        </Typography>
                      </Box>
                    ))}
                  </Stack>
                </Box>
              </Card>
            </Box>
          </Stack>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default CloudStorage;

const StorageAccordion = ({
  title,
  isOpen,
  onToggle,
  total,
  used,
  segments = [],
  details = [],
  isExpandable = true,
  upgradeContent = null,
  tooltipMsg = null
}) => {
  return (
    <Box
      sx={{
        bgcolor: "transparent",
        borderRadius: "16px",
        mb: 3,
        border: "none",
      }}
    >
      {/* HEADER */}
      <Box>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Stack direction="row" spacing={1.5} alignItems="center">
              <Typography variant="h6" sx={{
                fontSize: '22px',
                fontWeight: 700, color: "#1d1d1f"
              }}>
                {title}
              </Typography>
              <Box
                sx={{
                  bgcolor: "#000",
                  color: "#fff",
                  px: 0.8,
                  py: 0.2,
                  borderRadius: "9px",
                  fontSize: "17px",
                  fontWeight: 600,
                }}
              >
                {total}
              </Box>

            </Stack>
             <PremiumTooltip title={tooltipMsg}>

            <IconButton
              size="small"
              sx={{
                backgroundColor: 'transparent',
                '&:hover': {
                  backgroundColor: 'transparent',
                },
              }}
              >
              <InfoRoundedIcon
                fontSize="small"
                sx={{
                  width: '20px',
                  height: '20px',
                }}
                />
            </IconButton>
                </PremiumTooltip>

          </Box>

          <Typography variant="body2" sx={{
            color: "#000000ff",
            fontWeight: '600',
            fontSize: '15.3px'
          }}>
            Used {used} GB
          </Typography>
        </Box>

        {/* BAR */}
        <Box
          sx={{
            display: "flex",
            width: "100%",
            height: "10px",
            bgcolor: "#e5e5ea",
            borderRadius: "5px",
            overflow: "hidden",
            mb: 2,
          }}
        >
          {segments.map((seg, index) => (
            <Box
              key={index}
              sx={{
                width: `${seg.percent}%`,
                bgcolor: seg.color,
                height: "100%",
              }}
            />
          ))}
        </Box>
      </Box>

      {upgradeContent && <Box sx={{ mt: 2 }}>{upgradeContent}</Box>}

      {/* VIEW DETAILS TOGGLE */}
      {isExpandable && (
        <>
          <Divider sx={{ my: 2, borderColor: "#e5e5ea" }} />
          <Box
            onClick={onToggle}
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              cursor: "pointer",
              color: "#6e6e73",
              "&:hover": { color: "#1d1d1f" },
            }}
          >
            <Typography variant="body2" sx={{ fontSize: "14px" }}>
              View Details
            </Typography>
            <IconButton
              size="small"
              sx={{ bgcolor: "#b6b6b621" }}
            >
              <ExpandMoreIcon
                sx={{
                  transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                  transition: "transform 0.3s ease",
                }}
              />
            </IconButton>
          </Box>
        </>
      )}

      {/* EXPANDABLE CONTENT */}
      {isExpandable && (
        <Collapse in={isOpen}>
          <Box sx={{ mt: 2 }}>
            {details.length === 0 ? (
              <Typography variant="body2" sx={{ color: "#6e6e73", textAlign: "center", py: 2 }}>
                No details available
              </Typography>
            ) : (
              details.map((item, index) => (
                <StorageRow
                  key={index}
                  label={item.ModuleName}
                  size={item.datausage}
                  color={segments[index]?.color || "#000"}
                />
              ))
            )}
          </Box>
        </Collapse>
      )}
    </Box>
  );
};

const StorageRow = ({ label, size, color }) => (
  <Box
    sx={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      py: 1,
    }}
  >
    <Typography
      variant="body2"
      sx={{
        fontSize: "14px",
        color: "#292929c5",
        letterSpacing: "0.5px",
        fontWeight: 500
      }}
    >
      {label}
    </Typography>

    <Stack direction="row" spacing={1.5} alignItems="center">
      <Typography variant="body2" sx={{ fontSize: "13px", color: "#1d1d1f" }}>
        {size} GB
      </Typography>
      <Box
        sx={{
          width: "8px",
          height: "8px",
          borderRadius: "50%",
          bgcolor: color,
        }}
      />
    </Stack>
  </Box>
);


