import { useEffect, useState } from "react";
import S3Image from "./S3Image";

const Ground = () => {
  const [tileCount, setTileCount] = useState(12);

  useEffect(() => {
    const calculateTileCount = () => {
      // Calculate tiles needed for current window width
      const tilesNeededForWidth = Math.ceil(window.innerWidth / 128);
      // Double the count to ensure smooth infinite scrolling and add extra buffer
      setTileCount(tilesNeededForWidth * 2 + 4);
    };

    calculateTileCount();
    window.addEventListener("resize", calculateTileCount);

    return () => {
      window.removeEventListener("resize", calculateTileCount);
    };
  }, []);

  const containerStyle = {
    position: "absolute" as const,
    bottom: 0,
    left: 0,
    width: "200%",
    height: "20px",
    zIndex: 1,
    display: "flex",
    overflow: "hidden",
    animation: "moveLeft 4s linear infinite",
    transform: "translateX(0)",
  };

  // Create two sets of tiles for seamless infinite scrolling
  const tiles = [...Array(Math.ceil(tileCount / 2))].map((_, index) => (
    <S3Image
        key={`tile1-${index}`}
        imageKey="tiles1.png"
        alt="ground tile"
        width={128}
        height={20}
        style={{
            flexShrink: 0,
            objectFit: 'none',
            imageRendering: 'pixelated',
            pointerEvents: 'none'
        }}
    />
  ));

  return (
    <div className="ground" style={containerStyle}>
      {tiles}
      {tiles}
    </div>
  );
};

export default Ground;
