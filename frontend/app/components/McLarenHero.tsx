"use client";

import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";

/** McLaren-inspired papaya + charcoal — no global ThemeProvider */
const papaya = "#FF8700";
const charcoal = "#0d0d0d";

export default function McLarenHero() {
  return (
    <Box
      component="section"
      sx={{
        position: "relative",
        overflow: "hidden",
        minHeight: { xs: "72vh", md: "78vh" },
        display: "flex",
        alignItems: "center",
        background: `linear-gradient(145deg, ${charcoal} 0%, #151820 42%, #0a0c10 100%)`,
        "&::before": {
          content: '""',
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse 80% 50% at 50% -20%, rgba(255,135,0,0.18), transparent 55%)",
          pointerEvents: "none",
        },
      }}
    >
      <Container
        maxWidth="lg"
        sx={{
          position: "relative",
          zIndex: 1,
          py: { xs: 8, md: 12 },
        }}
      >
        <Typography
          component="p"
          sx={{
            color: "#ffffff",
            fontWeight: 800,
            letterSpacing: "-0.045em",
            fontSize: {
              xs: "clamp(3.25rem, 12vw, 5rem)",
              md: "clamp(4.5rem, 11vw, 7.5rem)",
            },
            lineHeight: 0.95,
            mb: { xs: 4, md: 5 },
            maxWidth: "lg",
          }}
        >
          McLaren
        </Typography>
        <Box
          sx={{
            maxWidth: "md",
            borderLeft: `4px solid ${papaya}`,
            pl: { xs: 2.5, md: 3 },
          }}
        >
          <Typography
            variant="overline"
            sx={{
              color: papaya,
              letterSpacing: "0.25em",
              fontWeight: 600,
              display: "block",
              mb: 1.5,
            }}
          >
            McLaren F1 Data
          </Typography>
          
          <Typography
            variant="h2"
            component="h1"
            sx={{
              color: "#f5f5f5",
              fontWeight: 700,
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
              fontSize: { xs: "2.25rem", sm: "2.75rem", md: "3.5rem" },
            }}
          >
            Race results, recharted.
          </Typography>

          <Typography
            variant="h6"
            component="p"
            sx={{
              mt: 2.5,
              color: "rgba(255,255,255,0.72)",
              fontWeight: 400,
              lineHeight: 1.6,
              maxWidth: "36rem",
              fontSize: { xs: "1rem", md: "1.125rem" },
            }}
          >
            A papaya-and-carbon dashboard for McLaren&apos;s season — standings,
            races, and points over time. Built for one team, one screen, full
            throttle.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
