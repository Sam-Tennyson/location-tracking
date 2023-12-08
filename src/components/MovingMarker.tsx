import React, { useEffect, useState } from "react";
import { Marker } from "react-map-gl";

interface MovingMarkerProps {
  coordinates: [number, number];
  speed: number;
  imgURL: string;
}

const MovingMarker: React.FC<MovingMarkerProps> = ({
  coordinates,
  speed,
  imgURL,
}) => {
  const [position, setPosition] = useState(coordinates);

  useEffect(() => {
    let interval;

    // Update marker position at a specified speed
    if (speed > 0) {
      interval = setInterval(() => {
        setPosition((prev) => {
          const [prevLng, prevLat] = prev;
          const [destLng, destLat] = coordinates;
          const diffLng = (destLng - prevLng) / 100;
          const diffLat = (destLat - prevLat) / 100;
          return [prevLng + diffLng, prevLat + diffLat];
        });
      }, 1000 / speed);
    }

    return () => clearInterval(interval);
  }, [coordinates, speed]);

  return (
    <Marker longitude={position[0]} latitude={position[1]} offset={[0, -10]}>
      <img
        alt="Moving Marker"
        src={imgURL}
        style={{ width: "30px", height: "30px" }}
      />
    </Marker>
  );
};

export default MovingMarker;
