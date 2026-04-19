"use client";

import Image from "next/image";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";

/** Must match filename in `public/` (case-sensitive on Linux deploys). Bump `v` after replacing/cropping the file. */
const MCLAREN_LOGO_SRC = "/MclarenLogo.png?v=2";

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
        <Box
          sx={{
            position: "relative",
            width: "100%",
            maxWidth: { xs: "min(100%, 560px)", sm: 680, md: 880, lg: 960 },
            height: { xs: 104, sm: 132, md: 168, lg: 184 },
            mb: { xs: 4, md: 5 },
          }}
        >
          <Image
            src={MCLAREN_LOGO_SRC}
            alt="McLaren"
            fill
            priority
            unoptimized
            sizes="(max-width: 600px) 560px, (max-width: 960px) 680px, 960px"
            style={{
              objectFit: "contain",
              objectPosition: "left center",
            }}
          />
        </Box>
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
              fontFamily:
                "var(--font-rajdhani), ui-sans-serif, system-ui, sans-serif",
              fontWeight: 500,
              letterSpacing: "0.02em",
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
