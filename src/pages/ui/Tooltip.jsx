import React from "react";
import { Box, Typography, Avatar, Tooltip } from "@mui/material";
import { styled } from "@mui/material/styles";

const PremiumTooltip = styled(({ className, ...props }) => <Tooltip {...props} classes={{ popper: className }} arrow />)(({ theme }) => ({
  [`& .MuiTooltip-tooltip`]: {
    backgroundColor: theme.palette.background.paper,
    color: theme.palette.text.primary,
    fontSize: 13,
    fontWeight: 500,
    borderRadius: 8,
    boxShadow: theme.shadows[4],
    padding: "8px 12px",
    maxWidth: 300, // allows text wrap
    whiteSpace: "pre-wrap",
    lineHeight: 1.4,
    border: `1px solid ${theme.palette.divider}`,
  },
  [`& .MuiTooltip-arrow`]: {
    color: theme.palette.background.paper,
  },
}));

const getRandomColor = (char) => {
  const colors = ["#FF6B6B", "#6BCB77", "#4D96FF", "#FFD93D", "#845EC2", "#FF9671", "#00C9A7", "#F9F871", "#FF70A6"];
  const index = char ? char.toUpperCase().charCodeAt(0) % colors.length : 0;
  return colors[index];
};

const AvatarPill = ({ title, key ,val }) => {
  const firstChar = title?.[0] || "";
  const bgColor = getRandomColor(firstChar);

  return (
    <Box
      key={key}
      sx={{
        display: "inline-flex",
        alignItems: "center",
        px: 0.7,
        py: 0.3,
        borderRadius: 50,
        bgcolor: "#f5f5f5",
        minHeight: 24,
        justifyContent: 'center',
        cursor: "grab",
        display: "inline-flex",
      }}
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData(
          "application/json",
          JSON.stringify({
            type: "RECEIVER",
            value: val,
            client : false
          })
        );
        e.dataTransfer.effectAllowed = "move";
      }}
     
    >
      {firstChar ? <Avatar
        sx={{
          width: 18,
          height: 18,
          bgcolor: bgColor,
          fontSize: 12,
          mr: 0.5,
        }}
      >
        {firstChar.toUpperCase()}
      </Avatar> : <>
        <Avatar
          sx={{
            width: 8,
            height: 8,
            fontSize: 10,
            mr: 0.5,
            bgcolor:'transparent',
            color:'gray'
          }}
        >
          -
        </Avatar>

      </>}
      <Typography
        variant="body2"
        sx={{
          fontWeight: 500,
          fontSize: 12,
          whiteSpace: "nowrap",
        }}
      >
        {title}
      </Typography>
    </Box>
  );
};

export { AvatarPill, PremiumTooltip };
