import { useEffect, useState } from "react";
import { Marker, Popup } from "react-map-gl";

// const point1 = turf.point(route?.[currentIndex]);
// const point2 = turf.point(route?.[currentIndex - 1]);
// const options = { units: "kilometers" }; // or 'miles' or 'degrees'
// const calculatedDistance = turf.distance(point1, point2, options);
// console.log(currentCoordinate, calculatedDistance);

const MovingMarker = ({ route, intervalTime = 1000, specificTime = null }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const time = specificTime ? specificTime : intervalTime;

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        if (prevIndex + 1 < route.length) {
          return (prevIndex + 1) % route.length;
        }
        return prevIndex;
      });
    }, time);

    return () => clearInterval(intervalId);
  }, [route, time]);

  const currentCoordinate = route[currentIndex];
  const currentCoordinateSpeed = 50000 / time;

  return (
    <>
      <Marker
        latitude={currentCoordinate?.[1]}
        longitude={currentCoordinate?.[0]}
      >
        <div style={{ fontSize: "24px" }}>📍</div>
      </Marker>
      <Popup
        latitude={currentCoordinate?.[1]}
        longitude={currentCoordinate?.[0]}
        anchor="bottom"
        offset={[0, -25] as [number, number]}
        closeOnClick={false}
      >
        {`${currentCoordinate?.[1]?.toFixed(
          4
        )}, ${currentCoordinate?.[0]?.toFixed(4)}`}{" "}
        and
        {currentCoordinateSpeed} km/sec
      </Popup>
    </>
  );
};

export default MovingMarker;
