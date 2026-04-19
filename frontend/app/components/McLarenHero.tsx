"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";

import McLarenTopNav from "./McLarenTopNav";

/** Must match filename in `public/` (case-sensitive on Linux deploys). Bump `v` after replacing/cropping the file. */
const MCLAREN_LOGO_SRC = "/MclarenLogo.png?v=2";

/** McLaren-inspired papaya + charcoal — no global ThemeProvider */
const papaya = "#FF8700";
const charcoal = "#0d0d0d";

function useHeroLogoShiftX() {
  const sectionRef = useRef<HTMLElement>(null);
  const [shiftX, setShiftX] = useState(0);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );

    const maxShiftPx = () =>
      Math.min(160, Math.max(40, window.innerWidth * 0.14));

    const update = () => {
      if (reducedMotion.matches) {
        setShiftX(0);
        return;
      }
      const scrollY = window.scrollY;
      const rect = el.getBoundingClientRect();
      const sectionTopDoc = scrollY + rect.top;
      const span = Math.max(el.offsetHeight * 0.65, 280);
      const raw =
        (scrollY - sectionTopDoc + window.innerHeight * 0.12) / span;
      const progress = Math.min(1, Math.max(0, raw));
      setShiftX(progress * maxShiftPx());
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    reducedMotion.addEventListener("change", update);

    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      reducedMotion.removeEventListener("change", update);
    };
  }, []);

  return { sectionRef, shiftX };
}

export default function McLarenHero() {
  const { sectionRef, shiftX } = useHeroLogoShiftX();

  return (
    <Box
      ref={sectionRef}
      id="home"
      component="section"
      sx={{
        scrollMarginTop: "1rem",
        position: "relative",
        overflow: "hidden",
        minHeight: { xs: "72vh", md: "78vh" },
        display: "flex",
        flexDirection: "column",
        alignItems: "stretch",
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
      <Box
        sx={{
          position: "relative",
          zIndex: 2,
          flexShrink: 0,
          pt: { xs: 2, md: 2.5 },
          pb: { xs: 2, md: 2.5 },
        }}
      >
        <McLarenTopNav />
      </Box>
      <Box
        sx={{
          position: "relative",
          zIndex: 1,
          flex: "1 1 auto",
          display: "flex",
          alignItems: "center",
          minHeight: 0,
        }}
      >
        <Container
          maxWidth="lg"
          sx={{
            position: "relative",
            width: "100%",
            py: { xs: 6, md: 10 },
          }}
        >
          <Box
            sx={{
              position: "relative",
              width: "100%",
              maxWidth: { xs: "min(100%, 560px)", sm: 680, md: 880, lg: 960 },
              height: { xs: 104, sm: 132, md: 168, lg: 184 },
              mb: { xs: 4, md: 5 },
              transform: `translateX(${shiftX}px)`,
              willChange: "transform",
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
              A dashboard for McLaren's season performace. See their standings,
              races, and points over time.
            </Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}
