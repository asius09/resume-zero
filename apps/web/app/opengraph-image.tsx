import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "Resume: Zero";
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#000000",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          padding: "80px",
          fontFamily: "Inter, sans-serif",
        }}
      >
        {/* Simple center focus */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "24px",
            zIndex: 10,
          }}
        >
          {/* Typographic 'RO' Mark */}
          <div
            style={{
              width: "120px",
              height: "120px",
              background: "white",
              color: "black",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "64px",
              fontWeight: 950,
              borderRadius: "20px",
              letterSpacing: "-0.05em",
            }}
          >
            RO
          </div>

          <h1
            style={{
              fontSize: "116px",
              fontWeight: 900,
              color: "white",
              margin: 0,
              letterSpacing: "-0.06em",
              lineHeight: 1,
              marginTop: "12px",
            }}
          >
            Resume Zero
          </h1>

          <p
            style={{
              fontSize: "36px",
              color: "rgba(255, 255, 255, 0.4)",
              margin: 0,
              textAlign: "center",
              lineHeight: 1.5,
              zIndex: 10,
              letterSpacing: "-0.02em",
              fontWeight: 400,
            }}
          >
            The minimalist, ATS-optimized resume builder.
          </p>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
