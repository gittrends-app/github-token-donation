import { ImageResponse } from "next/og";
import Logo from "@/components/Logo";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

// iOS applies its own rounded mask, so the background fills the whole square
export default function AppleIcon() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#2f7d7c",
      }}
    >
      <Logo size={120} color="#ffffff" />
    </div>,
    size,
  );
}
