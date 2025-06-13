"use client";
import React from "react";
import { Box, Typography, Chip, Skeleton, Tooltip } from "@mui/material";
import { QrCodeScanner as QrIcon } from "@mui/icons-material";
import { useScanStatsContext } from "@/contexts/ScanStatsContext";

const ScanCounter: React.FC = () => {
  const { stats, isLoading, error } = useScanStatsContext();

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M";
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K";
    }
    return num.toString();
  };

  if (error && stats.total === 0) {
    return null; // Don't show anything if there's an error and no data
  }

  return (
    <Box
      sx={{ display: "flex", alignItems: "center", gap: 2, flexWrap: "wrap" }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <QrIcon sx={{ fontSize: 20, color: "text.secondary" }} />
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ fontWeight: 500 }}
        >
          QR Scans:
        </Typography>
      </Box>

      <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
        {isLoading ? (
          <>
            <Skeleton
              variant="rectangular"
              width={60}
              height={24}
              sx={{ borderRadius: 1 }}
            />
            <Skeleton
              variant="rectangular"
              width={60}
              height={24}
              sx={{ borderRadius: 1 }}
            />
            <Skeleton
              variant="rectangular"
              width={60}
              height={24}
              sx={{ borderRadius: 1 }}
            />
          </>
        ) : (
          <>
            <Tooltip title="Total scans processed" arrow>
              <Chip
                label={`${formatNumber(stats.total)} Total`}
                size="small"
                variant="outlined"
                sx={{
                  borderColor: "primary.main",
                  color: "primary.main",
                  fontWeight: 600,
                  "&:hover": {
                    bgcolor: "primary.main",
                    color: "white",
                  },
                }}
              />
            </Tooltip>

            <Tooltip title="Scans processed this week" arrow>
              <Chip
                label={`${formatNumber(stats.thisWeek)} This Week`}
                size="small"
                variant="outlined"
                sx={{
                  borderColor: "success.main",
                  color: "success.main",
                  fontWeight: 600,
                  "&:hover": {
                    bgcolor: "success.main",
                    color: "white",
                  },
                }}
              />
            </Tooltip>

            <Tooltip title="Scans processed today" arrow>
              <Chip
                label={`${formatNumber(stats.today)} Today`}
                size="small"
                variant="outlined"
                sx={{
                  borderColor: "info.main",
                  color: "info.main",
                  fontWeight: 600,
                  "&:hover": {
                    bgcolor: "info.main",
                    color: "white",
                  },
                }}
              />
            </Tooltip>
          </>
        )}
      </Box>
    </Box>
  );
};

export default ScanCounter;
