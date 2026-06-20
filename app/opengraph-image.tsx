import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Mark Lowel Montealto — Full Stack Developer & DevOps Engineer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          backgroundColor: "#ffffff",
          padding: "80px",
          fontFamily: "system-ui, sans-serif",
          borderLeft: "8px solid #2563eb",
        }}
      >
        <p
          style={{
            fontSize: 18,
            color: "#71717a",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            marginBottom: 24,
            margin: "0 0 24px 0",
          }}
        >
          Manila, Philippines
        </p>
        <h1
          style={{
            fontSize: 72,
            fontWeight: 700,
            color: "#18181b",
            lineHeight: 1.05,
            margin: "0 0 16px 0",
          }}
        >
          Mark Lowel Montealto
        </h1>
        <p
          style={{
            fontSize: 28,
            color: "#2563eb",
            fontWeight: 600,
            margin: "0 0 32px 0",
          }}
        >
          Full Stack Developer &amp; DevOps Engineer
        </p>
        <p
          style={{
            fontSize: 20,
            color: "#71717a",
            margin: 0,
            maxWidth: 700,
          }}
        >
          Angular · TypeScript · AWS · CI/CD · NestJS · Docker
        </p>
      </div>
    ),
    { ...size }
  );
}
