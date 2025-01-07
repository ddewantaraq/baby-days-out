import { useEffect, useState } from "react";
import S3Image from "./S3Image";
import Image from "next/image";

interface CloudProps {
  speed: number;
  scale: number;
  opacity: number;
  zIndex: number;
  initialPosition: number;
  top: number;
}

const Cloud: React.FC<CloudProps> = ({
  speed,
  scale,
  opacity,
  zIndex,
  initialPosition,
  top,
}) => {
  const [position, setPosition] = useState(initialPosition);

  useEffect(() => {
    const animate = () => {
      setPosition((prev) => {
        if (prev <= -200) return 100;
        return prev - speed;
      });
    };

    const intervalId = setInterval(animate, 50);
    return () => clearInterval(intervalId);
  }, [speed]);

  return (
    <div
      style={{
        position: "absolute",
        left: `${position}%`,
        transform: `scale(${scale})`,
        top: `${top}%`,
        opacity,
        zIndex,
        transition: "left 50ms linear",
      }}
    >
      {/* 
        use S3Image element if image already uploaded on s3 and remove image element
        */}
      {/* <S3Image
        imageKey="cloud.png"
        alt="cloud"
        width={128}
        height={71}
        style={{
          pointerEvents: "none",
        }}
      /> */}

      <Image
        src={"/clouds.png"}
        alt="clouds"
        width={128}
        height={71}
        style={{
          pointerEvents: "none",
        }}
      />
    </div>
  );
};

const Bird: React.FC<{ speed: number; height: number }> = ({
  speed,
  height,
}) => {
  const [position, setPosition] = useState(-20);

  useEffect(() => {
    const animate = () => {
      setPosition((prev) => {
        if (prev >= 120) return -20;
        return prev + speed;
      });
    };

    const intervalId = setInterval(animate, 50);
    return () => clearInterval(intervalId);
  }, [speed]);

  return (
    <div
      style={{
        position: "absolute",
        left: `${position}%`,
        top: `${height}%`,
        transform: "scale(0.5)",
      }}
    >
      {/* 
        use S3Image element if image already uploaded on s3 and remove image element
        */}
      {/* <S3Image
        imageKey="bird.png"
        alt="bird"
        width={32}
        height={32}
        style={{
          pointerEvents: "none",
        }} />*/}
      <Image
        src={"/dove.png"}
        alt="bird"
        width={32}
        height={32}
        style={{
          pointerEvents: "none",
        }}
      />
    </div>
  );
};

const Sky: React.FC = () => {
  const clouds = [
    {
      speed: 0.05,
      scale: 0.8,
      opacity: 0.8,
      zIndex: 1,
      initialPosition: 10,
      top: 10,
    },
    {
      speed: 0.08,
      scale: 1,
      opacity: 0.9,
      zIndex: 2,
      initialPosition: 30,
      top: 20,
    },
    {
      speed: 0.03,
      scale: 0.6,
      opacity: 0.7,
      zIndex: 1,
      initialPosition: 60,
      top: 15,
    },
    {
      speed: 0.06,
      scale: 0.9,
      opacity: 0.85,
      zIndex: 2,
      initialPosition: 80,
      top: 20,
    },
    {
      speed: 0.04,
      scale: 1.2,
      opacity: 0.6,
      zIndex: 1,
      initialPosition: 40,
      top: 10,
    },
  ];

  const skyColors = {
    dawn: "linear-gradient(180deg, #FF9AA2 0%, #FFB7B2 100%)",
    day: "linear-gradient(180deg, #87CEEB 0%, #B0E2FF 100%)",
    dusk: "linear-gradient(180deg, #FF9AA2 0%, #FFB7B2 100%)",
    night: "linear-gradient(180deg, #2C3E50 0%, #3498DB 100%)",
  };

  type TimeOfDay = keyof typeof skyColors;
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>("day");

  useEffect(() => {
    // Change time of day every few minutes
    const interval = setInterval(() => {
      setTimeOfDay((current) => {
        switch (current) {
          case "dawn":
            return "day";
          case "day":
            return "dusk";
          case "dusk":
            return "night";
          default:
            return "dawn";
        }
      });
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        background: skyColors[timeOfDay],
        transition: "background 3s ease-in-out",
        overflow: "hidden",
      }}
    >
      {clouds.map((cloud, index) => (
        <Cloud key={index} {...cloud} />
      ))}

      <Bird speed={0.1} height={25} />
      <Bird speed={0.15} height={30} />
      <Bird speed={0.2} height={37} />
      <Bird speed={0.17} height={40} />
      <Bird speed={0.12} height={35} />
    </div>
  );
};

export default Sky;
