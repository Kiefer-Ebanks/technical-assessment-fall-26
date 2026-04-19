"use client";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

const papaya = "#FF8700";

const LINKS = [
  { id: "home" as const, label: "Home" },
  { id: "table" as const, label: "Table" },
  { id: "graph" as const, label: "Graph" },
];

function scrollToSection(id: string) {
  document.getElementById(id)?.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
}

/** Section nav — sits inside the hero over the gradient; scrolls with the hero (not viewport-fixed). */
export default function McLarenTopNav() {
  return (
    <Box
      component="nav"
      aria-label="Page sections"
      sx={{
        display: "flex",
        justifyContent: "center",
        width: "100%",
        px: { xs: 1, md: 2 },
      }}
    >
      <Box
        sx={{
          position: "relative",
          width: "100%",
          maxWidth: "min(1240px, calc(100vw - 16px))",
        }}
      >
        {/* Grey layer — sharp corners, offset bottom-right */}
        <Box
          aria-hidden
          sx={{
            position: "absolute",
            zIndex: 0,
            left: 10,
            top: 10,
            right: -10,
            bottom: -10,
            bgcolor: "#6e6e6e",
            borderRadius: 0,
            border: "2px solid #3d3d3d",
          }}
        />
        <Box
          sx={{
            position: "relative",
            zIndex: 1,
            bgcolor: "#ffffff",
            borderRadius: 0,
            px: { xs: 1.5, sm: 3, md: 4 },
            py: { xs: 1, sm: 1.25 },
            border: "2px solid #1a1a1a",
            boxShadow: "6px 6px 0 rgba(0,0,0,0.18)",
            display: "flex",
            flexWrap: "nowrap",
            gap: 0,
            justifyContent: "stretch",
            overflowX: "auto",
          }}
        >
          {LINKS.map(({ id, label }) => (
            <Button
              key={id}
              type="button"
              variant="text"
              onClick={() => scrollToSection(id)}
              sx={{
                flex: "1 1 0",
                minWidth: 0,
                color: "#111",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.12em",
                fontSize: { xs: "0.75rem", sm: "0.82rem" },
                borderRadius: 0,
                py: 1.25,
                px: { xs: 1.5, sm: 2.5 },
                borderRight: "2px solid #1a1a1a",
                "&:last-of-type": { borderRight: "none" },
                "&:hover": {
                  bgcolor: "rgba(255, 135, 0, 0.14)",
                  color: papaya,
                },
              }}
            >
              {label}
            </Button>
          ))}
        </Box>
      </Box>
    </Box>
  );
}
