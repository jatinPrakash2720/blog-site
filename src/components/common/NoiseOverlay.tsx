import React from "react";

interface NoiseOverlayProps {
  className?: string;
  opacity?: string;
}

export const NoiseOverlay: React.FC<NoiseOverlayProps> = ({
  className = "",
  opacity = "opacity-[0.15] dark:opacity-[0.1]",
}) => {
  return (
    <div
      className={`absolute inset-0 pointer-events-none ${opacity} mix-blend-overlay ${className}`}
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix in='colorNoise' type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        backgroundSize: "200px 200px",
      }}
    />
  );
};

