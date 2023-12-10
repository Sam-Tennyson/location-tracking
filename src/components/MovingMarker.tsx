import { useEffect, useState } from "react";
import { Marker, Popup } from "react-map-gl";
import { showMarkerSpeedWithConstants } from "../shared/Utils";
import orangePin from "../assets/orangepin.png";
import greenPin from "../assets/greenpin.png";
import redPin from "../assets/redpin.png";

// const point1 = turf.point(route?.[currentIndex]);
// const point2 = turf.point(route?.[currentIndex - 1]);
// const options = { units: "kilometers" }; // or 'miles' or 'degrees'
// const calculatedDistance = turf.distance(point1, point2, options);
// console.log(currentCoordinate, calculatedDistance);

const vehile_list = [
  {
    id: 1,
    color: "red",
    imgURL: redPin,
    message: "Warning 😶",
  },
  {
    id: 2,
    color: "orange",
    imgURL: orangePin,
    message: "Approaching limit! 😐 ",
  },
  {
    id: 3,
    color: "green",
    imgURL: greenPin,
    message: "Safe driving 😃 ",
  },
];

const MovingMarker = ({ routeData, route, thresholdSpeed }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const time = routeData.defaultTime;

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
  const currentCoordinateSpeed =
    currentCoordinate?.[1] !== routeData?.coordinatesStateEnd?.[1]?.lat &&
    currentCoordinate?.[0] !== routeData?.coordinatesStateEnd?.[1]?.lng
      ? showMarkerSpeedWithConstants(time)
      : 0;

  return (
    <>
      <Marker
        latitude={currentCoordinate?.[1]}
        longitude={currentCoordinate?.[0]}
        offset={[0, -10]}
      >
        <div style={{ fontSize: "24px" }}>📍</div>
        {/* <img
          alt="Marker"
          src={
            status === "red"
              ? vehile_list?.[0]?.imgURL
              : status === "orange"
              ? vehile_list?.[1]?.imgURL
              : vehile_list?.[2]?.imgURL
          }
          style={{ width: "30px", height: "30px" }}
        /> */}
      </Marker>
      <Popup
        latitude={currentCoordinate?.[1]}
        longitude={currentCoordinate?.[0]}
        anchor="bottom"
        offset={[0, -25] as [number, number]}
        closeOnClick={false}
      >
        Path {routeData?.pathId} <br />
        {currentCoordinateSpeed.toFixed(7)} km/sec
      </Popup>
    </>
  );
};

export default MovingMarker;
