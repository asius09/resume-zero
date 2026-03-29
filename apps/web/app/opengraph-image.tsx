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
        {/* Vector Grid Motif */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            opacity: 0.1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              width: "1200px",
              height: "630px",
              backgroundImage:
                "linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px)",
              backgroundSize: "60px 60px",
            }}
          />
        </div>

        {/* Brand Focus */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "20px",
            zIndex: 10,
          }}
        >
          {/* RO Brand Mark */}
          <div
            style={{
              width: "100px",
              height: "100px",
              background: "white",
              color: "black",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "52px",
              fontWeight: 950,
              borderRadius: "16px",
              letterSpacing: "-0.05em",
              boxShadow: "0 0 40px rgba(255,255,255,0.1)",
            }}
          >
            RO
          </div>

          <h1
            style={{
              fontSize: "104px",
              fontWeight: 900,
              color: "white",
              margin: 0,
              letterSpacing: "-0.04em",
              lineHeight: 1,
              marginTop: "16px",
            }}
          >
            Resume Zero
          </h1>

          <p
            style={{
              fontSize: "32px",
              color: "rgba(255, 255, 255, 0.45)",
              margin: 0,
              textAlign: "center",
              lineHeight: 1.5,
              maxWidth: "850px",
              letterSpacing: "-0.02em",
              fontWeight: 400,
            }}
          >
            The ultimate minimalist, ATS-optimized resume builder for professionals. Zero friction. Zero clutter. Build your future now.
          </p>

          <div
            style={{
              marginTop: "48px",
              padding: "16px 36px",
              background: "white",
              borderRadius: "100px",
              fontSize: "24px",
              fontWeight: 700,
              color: "black",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            Build your resume now →
          </div>
        </div>

        {/* Footer Brand Info */}
        <div
          style={{
            position: "absolute",
            bottom: "40px",
            fontSize: "18px",
            fontWeight: 600,
            color: "rgba(255,255,255,0.2)",
            textTransform: "uppercase",
            letterSpacing: "0.4em",
          }}
        >
          r0.asius.in
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
