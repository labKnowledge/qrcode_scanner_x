import React from "react";
import {
  Container,
  Typography,
  Box,
  Paper,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service - ScanPro",
  description:
    "Terms of Service for ScanPro QR code processing service. Learn about our service usage terms and conditions.",
};

const TermsOfService: React.FC = () => {
  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Paper elevation={0} sx={{ p: { xs: 3, md: 6 }, borderRadius: 2 }}>
        <Typography
          variant="h3"
          component="h1"
          gutterBottom
          sx={{
            fontWeight: 700,
            mb: 4,
            background: "linear-gradient(45deg, #2563eb, #7c3aed)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            color: "transparent",
          }}
        >
          Terms of Service
        </Typography>

        <Typography
          variant="body1"
          paragraph
          sx={{ mb: 4, color: "text.secondary" }}
        >
          Last updated: {new Date().toLocaleDateString()}
        </Typography>

        <Box sx={{ mb: 6 }}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
            Agreement to Terms
          </Typography>
          <Typography variant="body1" paragraph>
            By accessing and using ScanPro&apos;s services, you agree to be
            bound by these Terms of Service and all applicable laws and
            regulations. If you do not agree with any of these terms, you are
            prohibited from using or accessing our services.
          </Typography>
        </Box>

        <Box sx={{ mb: 6 }}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
            Use License
          </Typography>
          <Typography variant="body1" paragraph>
            Permission is granted to temporarily use ScanPro&apos;s services for
            personal, non-commercial purposes. This is the grant of a license,
            not a transfer of title, and under this license you may not:
          </Typography>
          <List>
            <ListItem sx={{ display: "list-item", pl: 0 }}>
              <ListItemText primary="Modify or copy the materials" />
            </ListItem>
            <ListItem sx={{ display: "list-item", pl: 0 }}>
              <ListItemText primary="Use the materials for any commercial purpose" />
            </ListItem>
            <ListItem sx={{ display: "list-item", pl: 0 }}>
              <ListItemText primary="Attempt to decompile or reverse engineer any software contained in the service" />
            </ListItem>
            <ListItem sx={{ display: "list-item", pl: 0 }}>
              <ListItemText primary="Remove any copyright or other proprietary notations from the materials" />
            </ListItem>
          </List>
        </Box>

        <Box sx={{ mb: 6 }}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
            Service Usage
          </Typography>
          <Typography variant="body1" paragraph>
            When using our service, you agree to:
          </Typography>
          <List>
            <ListItem sx={{ display: "list-item", pl: 0 }}>
              <ListItemText
                primary="Provide accurate information"
                secondary="You must provide accurate and complete information when using our service."
              />
            </ListItem>
            <ListItem sx={{ display: "list-item", pl: 0 }}>
              <ListItemText
                primary="Comply with laws"
                secondary="You must use our service in compliance with all applicable laws and regulations."
              />
            </ListItem>
            <ListItem sx={{ display: "list-item", pl: 0 }}>
              <ListItemText
                primary="Respect intellectual property"
                secondary="You must respect all intellectual property rights when using our service."
              />
            </ListItem>
          </List>
        </Box>

        <Box sx={{ mb: 6 }}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
            Disclaimer
          </Typography>
          <Typography variant="body1" paragraph>
            The materials on ScanPro&apos;s service are provided on an &apos;as
            is&apos; basis. ScanPro makes no warranties, expressed or implied,
            and hereby disclaims and negates all other warranties including,
            without limitation, implied warranties or conditions of
            merchantability, fitness for a particular purpose, or
            non-infringement of intellectual property or other violation of
            rights.
          </Typography>
        </Box>

        <Box sx={{ mb: 6 }}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
            Limitations
          </Typography>
          <Typography variant="body1" paragraph>
            In no event shall ScanPro or its suppliers be liable for any damages
            (including, without limitation, damages for loss of data or profit,
            or due to business interruption) arising out of the use or inability
            to use the materials on ScanPro&apos;s service.
          </Typography>
        </Box>

        <Box sx={{ mb: 6 }}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
            Revisions and Errata
          </Typography>
          <Typography variant="body1" paragraph>
            The materials appearing on ScanPro&apos;s service could include
            technical, typographical, or photographic errors. ScanPro does not
            warrant that any of the materials on its service are accurate,
            complete, or current. ScanPro may make changes to the materials
            contained on its service at any time without notice.
          </Typography>
        </Box>

        <Box sx={{ mb: 6 }}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
            Contact Information
          </Typography>
          <Typography variant="body1" paragraph>
            If you have any questions about these Terms of Service, please
            contact us at:
          </Typography>
          <Typography variant="body1" sx={{ color: "primary.main" }}>
            legal@scancode.pro
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default TermsOfService;
