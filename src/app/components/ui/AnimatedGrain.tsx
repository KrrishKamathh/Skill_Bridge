"use client";

export const AnimatedGrain = () => {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 h-full w-full opacity-[0.04]">
      <svg className="absolute inset-0 h-full w-full">
        <filter id="noiseFilter">
          <feTurbulence 
            type="fractalNoise" 
            baseFrequency="0.6" 
            stitchTiles="stitch" 
          />
        </filter>
        <rect width="100%" height="100%" filter="url(#noiseFilter)" />
      </svg>
    </div>
  );
};
